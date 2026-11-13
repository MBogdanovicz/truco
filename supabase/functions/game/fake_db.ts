// In-memory stand-in for the database, for the game and tournament tests.
import { Game, type Json, Refused } from "./game.ts";

export type Row = Json;

const KEYS: Record<string, string[]> = {
  game_rooms: ["id"],
  game_seats: ["room_id", "seat"],
  game_states: ["room_id"],
  game_views: ["room_id", "seat"],
  push_tokens: ["token"],
  tournaments: ["id"],
  tournament_teams: ["id"],
  tournament_matches: ["id"],
  profiles: ["id"],
  group_members: ["group_id", "user_id"],
  tournament_team_codes: ["team_id"],
};

export class FakeDb {
  tables: Record<string, Row[]> = {
    game_rooms: [],
    game_seats: [],
    game_states: [],
    game_views: [],
    push_tokens: [],
    tournaments: [],
    tournament_teams: [],
    tournament_matches: [],
    profiles: [],
    group_members: [],
    tournament_team_codes: [],
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
    if (table === "tournament_matches" && same(["tournament_id", "round", "slot"])) return true;
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
  insert(p: Row | Row[]) {
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
  limit(_n: number) {
    return this;
  }
  lt(k: string, v: string) {
    this.filters.push((r) => typeof r[k] === "string" && (r[k] as string) < v);
    return this;
  }
  /** Only `not(<col>-><key>, "is", null)`. */
  not(k: string, _op: "is", _v: null) {
    const [col, key] = k.split("->");
    this.filters.push((r) => {
      const v = key ? (r[col] as Json | undefined)?.[key] : r[col];
      return v !== undefined && v !== null;
    });
    return this;
  }
  eq(k: string, v: unknown) {
    this.filters.push((r) => r[k] === v);
    return this;
  }
  is(k: string, v: null) {
    this.filters.push((r) => (r[k] ?? null) === v);
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
    this.sortKeys.push(k);
    return this;
  }
  private sortKeys: string[] = [];
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
        out.sort((a, b) => {
          for (const k of this.sortKeys) {
            const [x, y] = [a[k], b[k]];
            if (x === y) continue;
            return (x as number | string) < (y as number | string) ? -1 : 1;
          }
          return 0;
        });
        break;
      case "insert": {
        for (const p of [this.payload].flat() as Row[]) {
          const row = { ...defaults(this.table), ...structuredClone(p) };
          if (this.db.violates(this.table, row)) return { data: null, error: { code: "23505" } };
          rows.push(row);
          out.push(copy(row));
        }
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
  if (table === "tournaments") {
    return {
      id: crypto.randomUUID(),
      status: "open",
      rules: {},
      round_days: 2,
      best_of: 1,
      final_best_of: 1,
      group_id: null,
      created_at: new Date().toISOString(),
    };
  }
  if (table === "tournament_teams") {
    return {
      id: crypto.randomUUID(),
      player_b: null,
      name_b: "",
      solo: false,
      seed: null,
      created_at: new Date().toISOString() + Math.random(),
    };
  }
  if (table === "tournament_matches") {
    return {
      id: crypto.randomUUID(),
      team_b: null,
      room_id: null,
      deadline: null,
      status: "pending",
      winner: null,
      games_a: 0,
      games_b: 0,
      best_of: 1,
      score_a: null,
      score_b: null,
      walkover: false,
      present: [],
    };
  }
  return {};
}

export function assert(cond: unknown, msg = "assertion failed"): asserts cond {
  if (!cond) throw new Error(msg);
}

// deno-lint-ignore no-explicit-any
export const asDb = (db: FakeDb) => db as any;

/** Plays for [seat] like a simple person: accept, else the first card.
 * After a hand worth 3+, shows the cards (even seats) or passes. */
export function move(view: Json): Json {
  const draw = view.draw as Json | undefined;
  if (draw) {
    // Draws the first card nobody took.
    const taken = Object.values(draw.p as Record<string, number>);
    let i = 0;
    while (taken.includes(i)) i++;
    return { t: "pick", i };
  }
  if (view.canShow) return { t: (view.me as number) % 2 === 0 ? "show" : "ready" };
  if (view.mustAnswer) return { t: "accept" };
  if (view.iron) return { t: "blind", i: 0 };
  return { t: "play", c: (view.hand as string[])[0] };
}

export function lastFrame(db: FakeDb, roomId: string, seat: number): Json | undefined {
  const v = db.tables.game_views.find((r) => r.room_id === roomId && r.seat === seat);
  return (v?.frames as Json[] | undefined)?.at(-1);
}

export async function playToEnd(db: FakeDb, roomId: string, players: Map<number, Game>) {
  for (let steps = 0; steps < 2000; steps++) {
    const room = db.tables.game_rooms.find((r) => r.id === roomId)!;
    if (room.status !== "playing") return;
    let moved = false;
    for (const [seat, game] of players) {
      const v = lastFrame(db, roomId, seat);
      const canMove = v?.draw
        ? (v.draw as Json).can
        : v && (v.myTurn || v.mustAnswer || v.canShow);
      if (v && canMove) {
        await game.act({ roomId, move: move(v) });
        moved = true;
        break;
      }
    }
    assert(moved, "nobody could move");
  }
  throw new Error("game did not end");
}

export async function refused(f: () => Promise<unknown>, message: string) {
  try {
    await f();
  } catch (e) {
    assert(e instanceof Refused && e.message === message, `refused ${message}`);
    return;
  }
  throw new Error(`expected ${message}`);
}
