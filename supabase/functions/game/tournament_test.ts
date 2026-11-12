// deno test supabase/functions/game/tournament_test.ts
// Whole tournaments against the in-memory database.
import { Game, type Json } from "./game.ts";
import { knockoutFirstRound, roundRobin, Tournaments } from "./tournament.ts";
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
  const outsider = people(db, ["zz"]).get("zz")!.g;
  await refused(() => outsider.join({ code }), "not_in_match");
  await refused(() => outsider.watch({ roomId: m.room_id }), "not_in_tournament");

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
