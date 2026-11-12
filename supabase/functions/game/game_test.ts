// deno test supabase/functions/game/game_test.ts
// Plays whole online games against an in-memory stand-in for the database.
import { Game, type Json, Refused, slowDays, turnMs } from "./game.ts";

import { asDb, assert, FakeDb, lastFrame, playToEnd, refused } from "./fake_db.ts";

Deno.test("two people and two computers play a whole game", async () => {
  const db = new FakeDb();
  const ana = new Game(asDb(db), "ana", false, "Ana");
  const bia = new Game(asDb(db), "bia", false, "Bia");
  const { roomId, code } = await ana.create({ mode: "ranked", botLevel: "easy" });
  await bia.join({ code });
  // Bia sits across from Ana, as her partner.
  await bia.sit({ roomId, seat: 2 });
  try {
    await bia.start({ roomId });
    throw new Error("only the host starts");
  } catch (e) {
    assert(e instanceof Refused && e.message === "not_host");
  }
  await ana.start({ roomId });
  const room = db.tables.game_rooms[0];
  assert(JSON.stringify(room.bots) === JSON.stringify([null, "easy", null, "easy"]));
  // Each person only gets their own cards.
  const a = lastFrame(db, roomId, 0)!, b = lastFrame(db, roomId, 2)!;
  assert(a.me === 0 && b.me === 2);
  await playToEnd(db, roomId, new Map([[0, ana], [2, bia]]));
  assert(room.status === "finished");
  assert(db.rpcs.length === 1 && db.rpcs[0].fn === "record_game_result");
  const scores = db.rpcs[0].args.p_scores as number[];
  assert(Math.max(...scores) === 12, `scores ${scores}`);
  assert((room.wins_a as number) + (room.wins_b as number) === 1);

  // Rematch: the version keeps growing.
  const before = db.tables.game_states[0].version as number;
  await ana.start({ roomId });
  assert((db.tables.game_states[0].version as number) === before + 1);
  assert((room.status as string) === "playing");
});

Deno.test("a person who leaves mid-game is replaced by the computer", async () => {
  const db = new FakeDb();
  const ana = new Game(asDb(db), "ana", false, "Ana");
  const caio = new Game(asDb(db), "caio", false, "Caio");
  const { roomId, code } = await ana.create({ botLevel: "medium" });
  await caio.join({ code });
  assert(db.tables.game_seats.find((s) => s.user_id === "caio")!.seat === 1);
  await ana.start({ roomId });
  try {
    await caio.act({ roomId, move: { t: "play", c: "zz" } });
  } catch (e) {
    assert(e instanceof Refused);
  }
  await ana.leave({ roomId });
  const room = db.tables.game_rooms[0];
  assert(room.host_id === "caio", "host passes on");
  assert((room.bots as unknown[])[0] === "medium");
  assert(db.tables.game_states[0].replaced === true);
  await playToEnd(db, roomId, new Map([[1, caio]]));
  assert(room.status === "finished");
  await caio.leave({ roomId });
  assert((room.status as string) === "closed");
});

Deno.test("guests can join but not create rooms", async () => {
  const db = new FakeDb();
  const guest = new Game(asDb(db), "g", true, "Visitante");
  try {
    await guest.create({});
    throw new Error("guest created a room");
  } catch (e) {
    assert(e instanceof Refused && e.message === "account_required");
  }
  const ana = new Game(asDb(db), "ana", false, "Ana");
  const { code } = await ana.create({});
  await guest.join({ code });
  assert(db.tables.game_seats.length === 2);
});

Deno.test("the computer moves for someone out of time", async () => {
  const db = new FakeDb();
  const ana = new Game(asDb(db), "ana", false, "Ana");
  const caio = new Game(asDb(db), "caio", false, "Caio");
  const { roomId, code } = await ana.create({ botLevel: "easy" });
  await caio.join({ code });
  await ana.start({ roomId });
  const room = db.tables.game_rooms[0];
  assert(typeof room.turn_deadline === "string", "deadline set");
  // Too early: nothing happens.
  const early = await caio.timeout({ roomId });
  assert((early as Json).waiting === true);
  const version = db.tables.game_states[0].version as number;
  room.turn_deadline = new Date(Date.now() - 1000).toISOString();
  const r = await caio.timeout({ roomId }) as Json;
  assert(r.version === version + 1, "moved");
  assert(Array.isArray(r.frames));
  // Play to the end only by timeouts.
  for (let i = 0; i < 2000 && room.status === "playing"; i++) {
    room.turn_deadline = new Date(Date.now() - 1000).toISOString();
    await ana.timeout({ roomId });
  }
  assert(room.status === "finished");
  assert(room.turn_deadline === null);
});

Deno.test("leaving and coming back to a game in progress", async () => {
  const db = new FakeDb();
  const ana = new Game(asDb(db), "ana", false, "Ana");
  const caio = new Game(asDb(db), "caio", false, "Caio");
  const dani = new Game(asDb(db), "dani", false, "Dani");
  const { roomId, code } = await ana.create({ botLevel: "easy" });
  await caio.join({ code });
  await caio.sit({ roomId, seat: 3 });
  await ana.start({ roomId });
  await caio.leave({ roomId });
  const room = db.tables.game_rooms[0];
  assert((room.bots as unknown[])[3] === "easy");
  // Someone new takes a computer seat; Caio gets his own seat back.
  await dani.join({ code });
  const daniSeat = db.tables.game_seats.find((s) => s.user_id === "dani")!.seat as number;
  assert(daniSeat !== 3 && daniSeat !== 0, `dani at ${daniSeat}`);
  await caio.join({ code });
  assert(db.tables.game_seats.find((s) => s.user_id === "caio")!.seat === 3);
  assert((room.bots as unknown[])[3] === null);
  assert(lastFrame(db, roomId, 3)!.me === 3, "has a view");
  assert(db.tables.game_states[0].replaced === true);
  await playToEnd(db, roomId, new Map([[0, ana], [3, caio], [daniSeat, dani]]));
});

Deno.test("turn time comes from the room's rules", () => {
  assert(turnMs({}) === 20_000);
  assert(turnMs({ tempo: 10 }) === 10_000);
  assert(turnMs({ tempo: 0 }) === null);
  // Slow games: days per move.
  assert(slowDays({}) === 0);
  assert(slowDays({ lento: 2 }) === 2);
  assert(turnMs({ lento: 1, tempo: 10 }) === 86_400_000);
});

Deno.test("slow games: 4 people, and the sweep moves for whoever ran out of days", async () => {
  const db = new FakeDb();
  const people = ["ana", "caio", "dani", "edu"].map((id) =>
    new Game(asDb(db), id, false, id)
  );
  const [ana] = people;
  const { roomId, code } = await ana.create({ rules: { lento: 2 } });
  await refused(() => ana.start({ roomId }), "slow_needs_four");
  for (const p of people.slice(1)) await p.join({ code });
  await ana.start({ roomId });
  const room = db.tables.game_rooms[0];
  const deadline = Date.parse(room.turn_deadline as string);
  assert(deadline - Date.now() > 2 * 86_400_000 - 60_000, "two days");
  assert(typeof room.waiting_seat === "number", "waiting seat");
  // Not yet late: the sweep leaves it alone.
  const sweeper = new Game(asDb(db), "", false, "");
  assert((await sweeper.sweep()).moved === 0);
  room.turn_deadline = new Date(Date.now() - 1000).toISOString();
  const version = db.tables.game_states[0].version as number;
  assert((await sweeper.sweep()).moved === 1);
  assert(db.tables.game_states[0].version === version + 1);
  // The computer played for someone: no longer ranked.
  assert(db.tables.game_states[0].replaced === true);
});

Deno.test("anyone with the code watches a normal room", async () => {
  const db = new FakeDb();
  const ana = new Game(asDb(db), "ana", false, "Ana");
  const zeca = new Game(asDb(db), "zeca", false, "Zeca");
  const { roomId, code } = await ana.create({ botLevel: "easy" });
  await refused(() => zeca.watch({ roomId }), "not_tournament");
  await ana.start({ roomId });
  const seen = await zeca.watch({ code: code.toLowerCase() }) as Json;
  assert(seen.roomId === roomId && seen.status === "playing");
  const frame = seen.frame as Json;
  assert((frame.hand as unknown[]).length === 0, "no cards in hand");
});
