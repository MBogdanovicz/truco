// deno test supabase/functions/game/tournament_test.ts
// Whole tournaments against the in-memory database.
import { Game, type Json } from "./game.ts";
import {
  doubleElimination,
  FINAL_ROUND,
  knockoutFirstRound,
  roundRobin,
  Tournaments,
} from "./tournament.ts";
import { spectatorView } from "./game.ts";
import { asDb, assert, FakeDb, playToEnd, refused } from "./fake_db.ts";

function people(db: FakeDb, ids: string[], premium: string[] = []) {
  for (const id of ids) {
    db.tables.profiles.push({ id, display_name: id, is_premium: premium.includes(id) });
  }
  return new Map(ids.map((id) => [id, {
    t: new Tournaments(asDb(db), id, false, id),
    g: new Game(asDb(db), id, false, id),
  }]));
}

/** Plays every game of [match] in its room; returns how many were played. */
async function playMatch(db: FakeDb, match: Json, all: ReturnType<typeof people>) {
  const room = () => db.tables.game_rooms.find((r) => r.id === match.room_id)!;
  const teams = db.tables.tournament_teams;
  const a = teams.find((t) => t.id === match.team_a)!;
  const b = teams.find((t) => t.id === match.team_b)!;
  const seats = [a.player_a, b.player_a, a.player_b, b.player_b] as string[];
  const code = room().code as string;
  for (const id of seats) {
    if (!db.tables.game_seats.some((s) => s.room_id === room().id && s.user_id === id)) {
      await all.get(id)!.g.join({ code });
    }
  }
  let games = 0;
  for (; games < 6; games++) {
    if (room().status !== "playing") {
      if (match.status === "done") break;
      await all.get(seats[1])!.g.start({ roomId: room().id });
    }
    await playToEnd(db, room().id as string, new Map(seats.map((id, i) => [i, all.get(id)!.g])));
    if (match.status === "done") {
      games++;
      break;
    }
  }
  return games;
}

const live = (db: FakeDb) =>
  db.tables.tournament_matches.find((m) =>
    m.status !== "done" && m.team_b && m.room_id
  );

Deno.test("spectators never see covered cards", () => {
  const v = spectatorView({
    hand: ["4p"],
    partner: ["7c"],
    myTurn: true,
    plays: [{ s: 0, c: "Ae", x: true }, { s: 1, c: "3o" }],
    rounds: [{ p: [{ s: 2, c: "Kc", x: true }], t: 2 }],
  });
  assert((v.hand as unknown[]).length === 0 && !("partner" in v) && !("myTurn" in v));
  const plays = v.plays as Json[];
  assert(!("c" in plays[0]) && plays[1].c === "3o");
  assert(!("c" in ((v.rounds as Json[])[0].p as Json[])[0]));
});

Deno.test("draws: byes and round robin rounds", () => {
  const ko = knockoutFirstRound(["a", "b", "c", "d", "e"]);
  assert(ko.length === 4);
  assert(ko.filter(([, b]) => b === null).length === 3, "3 byes");
  const rr = roundRobin(["a", "b", "c", "d", "e"]);
  assert(rr.length === 5, "5 rounds for 5 teams");
  const pairs = new Set(rr.flat().map(([x, y]) => [x, y].sort().join()));
  assert(pairs.size === 10, "everyone plays everyone once");
});

Deno.test("knockout with pairs, a best-of-3 final", async () => {
  const db = new FakeDb();
  const ids = Array.from({ length: 10 }, (_, i) => `p${i}`);
  const all = people(db, ids, ["p0"]);
  const owner = all.get("p0")!.t;
  await refused(() => all.get("p1")!.t.create({ name: "Copa" }), "premium_required");
  const { id } = await owner.create({
    name: "Copa do sofá",
    format: "knockout",
    entry: "pairs",
    maxTeams: 8,
    bestOf: 1,
    finalBestOf: 3,
    rules: { tempo: 0 },
  });
  for (let i = 0; i < 10; i += 2) {
    const { code } = await all.get(ids[i])!.t.register({ tournamentId: id, as: "pair" }) as Json;
    if (i === 0) {
      await refused(
        () => all.get(ids[1])!.t.register({ tournamentId: id, as: "join", code: "ZZZZ" }),
        "bad_team_code",
      );
    }
    await all.get(ids[i + 1])!.t.register({ tournamentId: id, as: "join", code });
  }
  await refused(
    () => all.get("p3")!.t.register({ tournamentId: id, as: "pair" }),
    "already_registered",
  );
  await refused(() => all.get("p1")!.t.start({ tournamentId: id }), "not_owner");
  await owner.start({ tournamentId: id });
  const t = db.tables.tournaments[0];
  assert(t.status === "running");
  const first = db.tables.tournament_matches.filter((m) => m.round === 1);
  assert(first.length === 4 && first.filter((m) => m.status === "done").length === 3);
  // Nobody else gets into a match room.
  const m = live(db)!;
  const code = db.tables.game_rooms.find((r) => r.id === m.room_id)!.code;
  const zz = people(db, ["zz"]).get("zz")!;
  const outsider = zz.g;
  await refused(() => outsider.join({ code }), "not_in_match");
  await refused(() => outsider.watch({ roomId: m.room_id }), "not_in_tournament");
  // "Chamar os jogadores": only someone of the match; the others are called.
  await refused(() => zz.t.call({ roomId: m.room_id }), "not_in_match");
  {
    const a = db.tables.tournament_teams.find((x) => x.id === m.team_a)!;
    const called = await all.get(a.player_a as string)!.t.call({ roomId: m.room_id }) as Json;
    assert(called.called === 3, `called ${called.called}`);
  }

  // Someone of another pair watches the match: no cards in hand.
  {
    const teams = db.tables.tournament_teams;
    const playing = [m.team_a, m.team_b];
    const watcher = teams.find((x) => !playing.includes(x.id))!.player_a as string;
    const a = teams.find((x) => x.id === m.team_a)!;
    const b = teams.find((x) => x.id === m.team_b)!;
    for (const p of [a.player_a, b.player_a, a.player_b, b.player_b]) {
      await all.get(p as string)!.g.join({ code });
    }
    const seen = await all.get(watcher)!.g.watch({ roomId: m.room_id }) as Json;
    assert(seen.status === "playing", `status ${seen.status}`);
    const frame = seen.frame as Json;
    assert(Array.isArray(frame.hand) && (frame.hand as unknown[]).length === 0, "no hand");
    assert(!("mustAnswer" in frame) && !("partner" in frame));
  }

  let final = 0;
  for (let i = 0; i < 10 && t.status === "running"; i++) {
    const next = live(db);
    assert(next, "a match to play");
    const games = await playMatch(db, next, all);
    if (next.best_of === 3) final = games;
  }
  assert((t.status as string) === "finished", `status ${t.status}`);
  assert(typeof t.champion === "string");
  assert(final >= 2 && final <= 3, `final had ${final} games`);
  const last = db.tables.tournament_matches.at(-1)!;
  assert(last.round === 3 && last.winner === t.champion);
});

Deno.test("round robin of people alone; walkovers", async () => {
  const db = new FakeDb();
  const ids = Array.from({ length: 7 }, (_, i) => `s${i}`);
  const all = people(db, ids, ["s0"]);
  const { id } = await all.get("s0")!.t.create({
    name: "Rodízio",
    format: "round_robin",
    entry: "solo",
    maxTeams: 8,
  });
  await refused(
    () => all.get("s1")!.t.register({ tournamentId: id, as: "pair" }),
    "solo_only",
  );
  for (const p of ids) await all.get(p)!.t.register({ tournamentId: id, as: "solo" });
  await all.get("s0")!.t.start({ tournamentId: id });
  // 7 people: 3 pairs, one left out.
  assert(db.tables.tournament_teams.length === 3);
  assert(db.tables.tournament_teams.every((x) => x.player_b));
  const matches = db.tables.tournament_matches;
  assert(matches.length === 3, `${matches.length} matches`);
  // Round 1: one team shows up, the other doesn't.
  const m = matches.find((x) => x.round === 1)!;
  const team = db.tables.tournament_teams.find((x) => x.id === m.team_a)!;
  const code = db.tables.game_rooms.find((r) => r.id === m.room_id)!.code;
  await all.get(team.player_a as string)!.g.join({ code });
  const sweeper = new Tournaments(asDb(db), "", false, "");
  assert((await sweeper.sweep()).decided === 0, "not late yet");
  for (const x of matches) x.deadline = new Date(Date.now() - 1000).toISOString();
  assert((await sweeper.sweep()).decided === 3);
  assert(m.winner === m.team_a && m.walkover === true);
  assert(matches.filter((x) => x.winner === null).length === 2, "both lost");
  assert(db.tables.tournaments[0].status === "finished");
});

Deno.test("slow knockout: games start by themselves", async () => {
  const db = new FakeDb();
  const ids = Array.from({ length: 8 }, (_, i) => `l${i}`);
  const all = people(db, ids, ["l0"]);
  const { id } = await all.get("l0")!.t.create({
    name: "Lentinho",
    format: "knockout",
    entry: "both",
    maxTeams: 4,
    bestOf: 3,
    rules: { lento: 2 },
  });
  for (const p of ids.slice(0, 4)) await all.get(p)!.t.register({ tournamentId: id, as: "solo" });
  const { code } = await all.get("l4")!.t.register({ tournamentId: id, as: "pair" }) as Json;
  await all.get("l5")!.t.register({ tournamentId: id, as: "join", code });
  await all.get("l6")!.t.register({ tournamentId: id, as: "pair" });
  await all.get("l0")!.t.start({ tournamentId: id });
  // l0..l3 alone + l6 waiting: two pairs drawn, one left out.
  assert(db.tables.tournament_teams.length === 3, "3 teams");
  const rooms = db.tables.game_rooms;
  assert(rooms.length === 1 && rooms[0].status === "playing", "slow match already on");
  assert(db.tables.game_seats.length === 4);
  const m = live(db)!;
  await playMatch(db, m, all);
  assert(m.status === "done");
  assert(((m.games_a as number) + (m.games_b as number)) >= 2, "a series");
});

Deno.test("double elimination bracket: shape", () => {
  for (const n of [3, 4, 5, 8, 11, 16]) {
    const ms = doubleElimination(Array.from({ length: n }, (_, i) => `t${i}`));
    const size = 2 ** Math.ceil(Math.log2(Math.max(n, 4)));
    // Winners: size - 1 matches; losers: size - 2; two grand finals.
    assert(ms.filter((m) => m.bracket === "winners").length === size - 1, `w ${n}`);
    assert(ms.filter((m) => m.bracket === "losers").length === size - 2, `l ${n}`);
    assert(ms.filter((m) => m.bracket === "final").length === 2);
  }
});

Deno.test("repescagem: nobody is out with one loss", async () => {
  const db = new FakeDb();
  const ids = Array.from({ length: 10 }, (_, i) => `d${i}`);
  const all = people(db, ids, ["d0"]);
  const { id } = await all.get("d0")!.t.create({
    name: "Repescagem",
    format: "double_elimination",
    entry: "pairs",
    maxTeams: 8,
    bestOf: 1,
    finalBestOf: 1,
    rules: { tempo: 0 },
  });
  for (let i = 0; i < 10; i += 2) {
    const { code } = await all.get(ids[i])!.t.register({ tournamentId: id, as: "pair" }) as Json;
    await all.get(ids[i + 1])!.t.register({ tournamentId: id, as: "join", code });
  }
  await all.get("d0")!.t.start({ tournamentId: id });
  const t = db.tables.tournaments[0];
  for (let i = 0; i < 40 && t.status === "running"; i++) {
    const next = live(db);
    assert(next, "a match to play");
    await playMatch(db, next, all);
  }
  assert((t.status as string) === "finished", `status ${t.status}`);
  // Every team but the champion lost exactly twice (or once, if it only
  // lost the second grand final... that is still two losses overall).
  const losses = new Map<string, number>();
  for (const m of db.tables.tournament_matches) {
    if (m.status !== "done" || !m.team_b || !m.winner) continue;
    const lost = m.winner === m.team_a ? m.team_b : m.team_a;
    losses.set(lost as string, (losses.get(lost as string) ?? 0) + 1);
  }
  for (const team of db.tables.tournament_teams) {
    const n = losses.get(team.id as string) ?? 0;
    if (team.id === t.champion) assert(n <= 1, "champion lost at most once");
    else assert(n === 2, `team lost ${n} times`);
  }
  const reset = db.tables.tournament_matches.find((m) => m.round === FINAL_ROUND + 1)!;
  assert(reset.status === "done");
});

Deno.test("round robin plays round by round; the champions are congratulated", async () => {
  const db = new FakeDb();
  const ids = Array.from({ length: 8 }, (_, i) => `r${i}`);
  const all = people(db, ids, ["r0"]);
  const { id } = await all.get("r0")!.t.create({
    name: "Pontos corridos",
    format: "round_robin",
    entry: "pairs",
    maxTeams: 4,
    rules: { tempo: 0 },
  });
  for (let i = 0; i < 8; i += 2) {
    const { code } = await all.get(ids[i])!.t.register({ tournamentId: id, as: "pair" }) as Json;
    await all.get(ids[i + 1])!.t.register({ tournamentId: id, as: "join", code });
  }
  await all.get("r0")!.t.start({ tournamentId: id });
  const matches = db.tables.tournament_matches;
  const opened = () => matches.filter((m) => m.room_id).map((m) => m.round as number);
  assert(matches.length === 6, `${matches.length} matches`);
  assert(opened().length === 2 && opened().every((r) => r === 1), `opened ${opened()}`);
  const t = db.tables.tournaments[0];
  for (let i = 0; i < 10 && t.status === "running"; i++) {
    const next = live(db);
    assert(next, "a match to play");
    const round = next.round as number;
    assert(
      matches.filter((m) => (m.round as number) < round).every((m) => m.status === "done"),
      "earlier rounds over",
    );
    await playMatch(db, next, all);
  }
  assert((t.status as string) === "finished", `status ${t.status}`);
  assert(opened().length === 6, "every match got its room");
});

Deno.test("leaving a tournament game gives it up (W.O.)", async () => {
  const db = new FakeDb();
  const ids = Array.from({ length: 8 }, (_, i) => `w${i}`);
  const all = people(db, ids, ["w0"]);
  const { id } = await all.get("w0")!.t.create({
    name: "Sem fujão",
    format: "knockout",
    entry: "pairs",
    maxTeams: 4,
    rules: { tempo: 0 },
  });
  for (let i = 0; i < 8; i += 2) {
    const { code } = await all.get(ids[i])!.t.register({ tournamentId: id, as: "pair" }) as Json;
    await all.get(ids[i + 1])!.t.register({ tournamentId: id, as: "join", code });
  }
  await all.get("w0")!.t.start({ tournamentId: id });
  const m = live(db)!;
  const room = () => db.tables.game_rooms.find((r) => r.id === m.room_id)!;
  const teams = db.tables.tournament_teams;
  const a = teams.find((t) => t.id === m.team_a)!;
  const b = teams.find((t) => t.id === m.team_b)!;
  for (const p of [a.player_a, b.player_a, a.player_b, b.player_b]) {
    await all.get(p as string)!.g.join({ code: room().code });
  }
  assert(room().status === "playing", `status ${room().status}`);
  await all.get(a.player_a as string)!.g.leave({ roomId: room().id });
  assert(m.status === "done", `match ${m.status}`);
  assert(m.winner === b.id, "the other pair wins");
  assert(room().status === "finished");
  assert(room().wins_b === 1);
});
