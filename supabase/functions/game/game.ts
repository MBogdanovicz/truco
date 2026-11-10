// Game rooms logic for the "game" Edge Function (see index.ts).

import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import "./engine.js";

export type Json = Record<string, unknown>;
type Level = "easy" | "medium" | "hard";

interface EngineOut {
  log: Json[];
  frames: Record<string, Json[]>;
  phase: string;
  winner?: "a" | "b";
  scores: [number, number];
  hands: Json[];
  error?: string;
}

const engine = (globalThis as unknown as { trucoEngine: (s: string) => string })
  .trucoEngine;

function runEngine(input: Json): EngineOut {
  return JSON.parse(engine(JSON.stringify(input)));
}

export class Refused extends Error {}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const LEVELS = new Set(["easy", "medium", "hard"]);

function newCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

function randomInt(max: number): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] % max;
}

interface Room {
  id: string;
  code: string;
  host_id: string;
  status: "lobby" | "playing" | "finished" | "closed";
  rules: Json;
  bot_level: Level;
  mode: "ranked" | "friendly";
  group_id: string | null;
  bots: (Level | null)[];
  wins_a: number;
  wins_b: number;
  game_no: number;
}

interface Seat {
  seat: number;
  user_id: string;
  name: string;
  is_guest: boolean;
}

interface State {
  room_id: string;
  seed: number;
  first_dealer: number;
  log: Json[];
  version: number;
  replaced: boolean;
  started_at: string;
  match_id: string | null;
}

export class Game {
  constructor(
    private db: SupabaseClient,
    private userId: string,
    private isGuest: boolean,
    private name: string,
  ) {}

  async room(id: string): Promise<Room> {
    const { data, error } = await this.db.from("game_rooms").select().eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data || data.status === "closed") throw new Refused("room_not_found");
    return data as Room;
  }

  async seats(roomId: string): Promise<Seat[]> {
    const { data, error } = await this.db.from("game_seats")
      .select("seat, user_id, name, is_guest").eq("room_id", roomId).order("seat");
    if (error) throw error;
    return data as Seat[];
  }

  async state(roomId: string): Promise<State> {
    const { data, error } = await this.db.from("game_states").select()
      .eq("room_id", roomId).single();
    if (error) throw error;
    return data as State;
  }

  mySeat(seats: Seat[]): Seat {
    const s = seats.find((s) => s.user_id === this.userId);
    if (!s) throw new Refused("not_seated");
    return s;
  }

  hostOnly(room: Room) {
    if (room.host_id !== this.userId) throw new Refused("not_host");
  }

  // ------------------------------------------------------------ lobby --

  async create(body: Json) {
    if (this.isGuest) throw new Refused("account_required");
    const level = LEVELS.has(body.botLevel as string) ? body.botLevel : "medium";
    for (let attempt = 0; ; attempt++) {
      const { data, error } = await this.db.from("game_rooms").insert({
        code: newCode(),
        host_id: this.userId,
        rules: (body.rules ?? {}) as Json,
        bot_level: level,
        mode: body.mode === "friendly" ? "friendly" : "ranked",
        group_id: (body.groupId as string | undefined) ?? null,
      }).select().single();
      if (error?.code === "23505" && attempt < 5) continue;
      if (error) throw error;
      await this.seat(data.id, 0);
      return { roomId: data.id, code: data.code };
    }
  }

  private async seat(roomId: string, seat: number) {
    const { error } = await this.db.from("game_seats").insert({
      room_id: roomId,
      seat,
      user_id: this.userId,
      name: this.name,
      is_guest: this.isGuest,
    });
    if (error?.code === "23505") throw new Refused("seat_taken");
    if (error) throw error;
  }

  async join(body: Json) {
    const code = String(body.code ?? "").trim().toUpperCase();
    const { data } = await this.db.from("game_rooms").select("id")
      .eq("code", code).neq("status", "closed").maybeSingle();
    if (!data) throw new Refused("room_not_found");
    const room = await this.room(data.id);
    const seats = await this.seats(room.id);
    if (seats.some((s) => s.user_id === this.userId)) {
      return { roomId: room.id, code: room.code };
    }
    if (room.status === "playing") throw new Refused("game_started");
    const free = [0, 1, 2, 3].filter((i) => !seats.some((s) => s.seat === i));
    if (free.length === 0) throw new Refused("room_full");
    await this.seat(room.id, free[0]);
    await this.touch(room.id);
    return { roomId: room.id, code: room.code };
  }

  /** Moves to another free seat (to pick a partner) before a game. */
  async sit(body: Json) {
    const room = await this.room(body.roomId as string);
    if (room.status === "playing") throw new Refused("game_started");
    const seat = Number(body.seat);
    if (!(seat >= 0 && seat <= 3)) throw new Refused("bad_seat");
    const seats = await this.seats(room.id);
    this.mySeat(seats);
    if (seats.some((s) => s.seat === seat)) throw new Refused("seat_taken");
    const { error } = await this.db.from("game_seats").update({ seat })
      .eq("room_id", room.id).eq("user_id", this.userId);
    if (error?.code === "23505") throw new Refused("seat_taken");
    if (error) throw error;
    return {};
  }

  async options(body: Json) {
    const room = await this.room(body.roomId as string);
    this.hostOnly(room);
    if (room.status === "playing") throw new Refused("game_started");
    const patch: Json = { updated_at: new Date().toISOString() };
    if (LEVELS.has(body.botLevel as string)) patch.bot_level = body.botLevel;
    if (body.mode === "ranked" || body.mode === "friendly") patch.mode = body.mode;
    if ("groupId" in body) patch.group_id = body.groupId ?? null;
    if (body.rules && typeof body.rules === "object") patch.rules = body.rules;
    const { error } = await this.db.from("game_rooms").update(patch).eq("id", room.id);
    if (error) throw error;
    return {};
  }

  private async touch(roomId: string, patch: Json = {}) {
    const { error } = await this.db.from("game_rooms")
      .update({ ...patch, updated_at: new Date().toISOString() }).eq("id", roomId);
    if (error) throw error;
  }

  // ------------------------------------------------------------- game --

  /** Starts a game (or a rematch); the computer takes the empty seats. */
  async start(body: Json) {
    const room = await this.room(body.roomId as string);
    this.hostOnly(room);
    // Claim the start, so a double tap doesn't deal twice.
    const { data: claimed, error: claimError } = await this.db.from("game_rooms")
      .update({ status: "playing", updated_at: new Date().toISOString() })
      .eq("id", room.id).in("status", ["lobby", "finished"]).select("id");
    if (claimError) throw claimError;
    if (!claimed?.length) throw new Refused("game_started");
    const seats = await this.seats(room.id);
    const { data: old } = await this.db.from("game_states").select("version")
      .eq("room_id", room.id).maybeSingle();
    // Versions keep growing across games, so the app never mixes them up.
    const version = (old?.version ?? 0) + 1;
    const bots = [0, 1, 2, 3].map((i) =>
      seats.some((s) => s.seat === i) ? null : room.bot_level
    );
    const seed = randomInt(2 ** 31);
    const firstDealer = randomInt(4);
    const out = runEngine({
      rules: room.rules,
      seed,
      firstDealer,
      bots,
      log: [],
    });
    const { error } = await this.db.from("game_states").upsert({
      room_id: room.id,
      seed,
      first_dealer: firstDealer,
      log: out.log,
      version,
      replaced: false,
      started_at: new Date().toISOString(),
      match_id: null,
    });
    if (error) throw error;
    await this.touch(room.id, { bots, game_no: room.game_no + 1 });
    await this.writeViews(room.id, seats, out, version);
    return {};
  }

  async act(body: Json) {
    const action = body.action as Json | undefined;
    if (!action || typeof action.t !== "string") throw new Refused("bad_action");
    for (let attempt = 0; attempt < 4; attempt++) {
      const room = await this.room(body.roomId as string);
      if (room.status !== "playing") throw new Refused("not_playing");
      const seats = await this.seats(room.id);
      const me = this.mySeat(seats);
      const state = await this.state(room.id);
      const out = runEngine({
        rules: room.rules,
        seed: state.seed,
        firstDealer: state.first_dealer,
        bots: room.bots,
        log: state.log,
        act: { seat: me.seat, action },
      });
      if (out.error) throw new Refused("illegal_move");
      if (await this.save(room, seats, state, out)) return {};
    }
    throw new Refused("busy");
  }

  /** Stores the new log if nobody changed it meanwhile; false to retry. */
  private async save(room: Room, seats: Seat[], state: State, out: EngineOut, patch: Json = {}) {
    const version = state.version + 1;
    const { data, error } = await this.db.from("game_states")
      .update({ log: out.log, version, ...patch })
      .eq("room_id", room.id).eq("version", state.version).select("room_id");
    if (error) throw error;
    if (!data?.length) return false;
    await this.writeViews(room.id, seats, out, version);
    if (out.phase === "gameOver" && out.winner) await this.finish(room, state, out);
    return true;
  }

  private async finish(room: Room, state: State, out: EngineOut) {
    const { error } = await this.db.rpc("record_game_result", {
      p_room: room.id,
      p_scores: out.scores,
      p_hands: out.hands,
      p_started_at: state.started_at,
    });
    if (error) console.error("record_game_result", error);
    await this.touch(room.id, {
      status: "finished",
      wins_a: room.wins_a + (out.winner === "a" ? 1 : 0),
      wins_b: room.wins_b + (out.winner === "b" ? 1 : 0),
    });
  }

  private async writeViews(roomId: string, seats: Seat[], out: EngineOut, version: number) {
    const rows = seats
      .filter((s) => out.frames[String(s.seat)])
      .map((s) => ({
        room_id: roomId,
        seat: s.seat,
        user_id: s.user_id,
        version,
        frames: out.frames[String(s.seat)],
        updated_at: new Date().toISOString(),
      }));
    if (rows.length === 0) return;
    const { error } = await this.db.from("game_views").upsert(rows);
    if (error) throw error;
  }

  /** Leaves the room; during a game the computer takes the seat. */
  async leave(body: Json) {
    const room = await this.room(body.roomId as string);
    const seats = await this.seats(room.id);
    const me = seats.find((s) => s.user_id === this.userId);
    if (!me) return {};
    await this.db.from("game_seats").delete().eq("room_id", room.id).eq("user_id", this.userId);
    await this.db.from("game_views").delete().eq("room_id", room.id).eq("user_id", this.userId);
    const rest = seats.filter((s) => s.user_id !== this.userId);
    const patch: Json = {};
    if (rest.length === 0) patch.status = "closed";
    if (room.host_id === this.userId && rest.length > 0) patch.host_id = rest[0].user_id;

    if (room.status === "playing" && rest.length > 0) {
      const bots = [...room.bots];
      bots[me.seat] = room.bot_level;
      patch.bots = bots;
      await this.touch(room.id, patch);
      // The computer plays on for the one who left.
      for (let attempt = 0; attempt < 4; attempt++) {
        const state = await this.state(room.id);
        const out = runEngine({
          rules: room.rules,
          seed: state.seed,
          firstDealer: state.first_dealer,
          bots,
          log: state.log,
        });
        if (await this.save({ ...room, bots }, rest, state, out, { replaced: true })) break;
      }
      return {};
    }
    await this.touch(room.id, patch);
    return {};
  }
}

