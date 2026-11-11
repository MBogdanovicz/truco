// deno test supabase/functions/game/game_test.ts
// Plays whole online games against an in-memory stand-in for the database.
import { Game, type Json, Refused, turnMs } from "./game.ts";

type Row = Json;

const KEYS: Record<string, string[]> = {
  game_rooms: ["id"],
  game_seats: ["room_id", "seat"],
  game_states: ["room_id"],
  game_views: ["room_id", "seat"],
};

class FakeDb {
  tables: Record<string, Row[]> = {
    game_rooms: [],
    game_seats: [],
    game_states: [],
    game_views: [],
  };
  rpcs: { fn: string; args: Json }[] = [];

  from(table: string) {
    return new Query(this, table);
  }

  rpc(fn: string, args: Json) {
    this.rpcs.push({ fn, args });
    return Promise.resolve({ data: null, error: null });
  }

  violates(table: string, row: Row, except?: Row): boolean {
    const rows = this.tables[table].filter((r) => r !== except);
    const same = (keys: string[]) =>
      rows.some((r) => keys.every((k) => r[k] === row[k]));
    if (same(KEYS[table])) return true;
    if (table === "game_seats" && same(["room_id", "user_id"])) return true;
    if (table === "game_rooms") {
      return rows.some((r) =>
        r.code === row.code && r.status !== "closed" && row.status !== "closed"
      );
    }
    return false;
  }
}

class Query {
  private op: "select" | "insert" | "update" | "upsert" | "delete" = "select";
  private payload: Row | Row[] | null = null;
  private filters: ((r: Row) => boolean)[] = [];
  private returning = false;
  private mode: "many" | "single" | "maybe" = "many";

  constructor(private db: FakeDb, private table: string) {}

  select(_cols?: string) {
    if (this.op !== "select") this.returning = true;
    return this;
  }
  insert(p: Row) {
    this.op = "insert";
    this.payload = p;
    return this;
  }
  update(p: Row) {
    this.op = "update";
    this.payload = p;
    return this;
  }
  upsert(p: Row | Row[]) {
    this.op = "upsert";
    this.payload = p;
    return this;
  }
  delete() {
    this.op = "delete";
    return this;
  }
  eq(k: string, v: unknown) {
    this.filters.push((r) => r[k] === v);
    return this;
  }
  neq(k: string, v: unknown) {
    this.filters.push((r) => r[k] !== v);
    return this;
  }
  in(k: string, vs: unknown[]) {
    this.filters.push((r) => vs.includes(r[k]));
    return this;
  }
  order(k: string) {
    this.filters.push(() => true);
    this.sortKey = k;
    return this;
  }
  private sortKey?: string;
  single() {
    this.mode = "single";
    return this;
  }
  maybeSingle() {
    this.mode = "maybe";
    return this;
  }

  then<T>(resolve: (v: { data: unknown; error: unknown }) => T) {
    return Promise.resolve(resolve(this.run()));
  }

  private run(): { data: unknown; error: unknown } {
    const rows = this.db.tables[this.table];
    const match = () => rows.filter((r) => this.filters.every((f) => f(r)));
    const copy = (r: Row) => structuredClone(r);
    let out: Row[] = [];
    switch (this.op) {
      case "select":
        out = match().map(copy);
        if (this.sortKey) {
          const k = this.sortKey;
          out.sort((a, b) => (a[k] as number) - (b[k] as number));
        }
        break;
      case "insert": {
        const row = { ...defaults(this.table), ...structuredClone(this.payload as Row) };
        if (this.db.violates(this.table, row)) return { data: null, error: { code: "23505" } };
        rows.push(row);
        out = [copy(row)];
        break;
      }
      case "update":
        for (const r of match()) {
          const next = { ...r, ...structuredClone(this.payload as Row) };
          if (this.db.violates(this.table, next, r)) return { data: null, error: { code: "23505" } };
          Object.assign(r, next);
          out.push(copy(r));
        }
        break;
      case "upsert":
        for (const p of [this.payload].flat() as Row[]) {
          const keys = KEYS[this.table];
          const old = rows.find((r) => keys.every((k) => r[k] === p[k]));
          if (old) Object.assign(old, structuredClone(p));
          else rows.push({ ...defaults(this.table), ...structuredClone(p) });
        }
        break;
      case "delete":
        for (const r of match()) rows.splice(rows.indexOf(r), 1);
        break;
    }
    if (this.mode === "single") {
      return out.length === 1 ? { data: out[0], error: null } : { data: null, error: { code: "PGRST116" } };
    }
    if (this.mode === "maybe") return { data: out[0] ?? null, error: null };
    return { data: out, error: null };
  }
}

function defaults(table: string): Row {
  if (table === "game_rooms") {
    return {
      id: crypto.randomUUID(),
      status: "lobby",
      rules: {},
      bot_level: "medium",
      mode: "ranked",
      group_id: null,
      bots: [null, null, null, null],
      wins_a: 0,
      wins_b: 0,
      game_no: 0,
    };
  }
  if (table === "game_states") return { replaced: false, match_id: null, version: 0 };
  return {};
}

function assert(cond: unknown, msg = "assertion failed"): asserts cond {
  if (!cond) throw new Error(msg);
}

// deno-lint-ignore no-explicit-any
const asDb = (db: FakeDb) => db as any;

/** Plays for [seat] like a simple person: accept, else the first card. */
function move(view: Json): Json {
  if (view.mustAnswer) return { t: "accept" };
  if (view.iron) return { t: "blind", i: 0 };
  return { t: "play", c: (view.hand as string[])[0] };
}

function lastFrame(db: FakeDb, roomId: string, seat: number): Json | undefined {
  const v = db.tables.game_views.find((r) => r.room_id === roomId && r.seat === seat);
  return (v?.frames as Json[] | undefined)?.at(-1);
}

async function playToEnd(db: FakeDb, roomId: string, players: Map<number, Game>) {
  for (let steps = 0; steps < 2000; steps++) {
    const room = db.tables.game_rooms.find((r) => r.id === roomId)!;
    if (room.status !== "playing") return;
    let moved = false;
    for (const [seat, game] of players) {
      const v = lastFrame(db, roomId, seat);
      if (v && (v.myTurn || v.mustAnswer)) {
        await game.act({ roomId, move: move(v) });
        moved = true;
        break;
      }
    }
    assert(moved, "nobody could move");
  }
  throw new Error("game did not end");
}

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
});
