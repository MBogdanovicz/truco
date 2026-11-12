// Game rooms logic for the "game" Edge Function (see index.ts).

import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import "./engine.js";
import { sendPush } from "../_shared/push.ts";
import { Tournaments } from "./tournament.ts";

const WEB_APP_URL = Deno.env.get("WEB_APP_URL") ?? "https://truco.mytrophies.app";

export type Json = Record<string, unknown>;
type Level = "easy" | "medium" | "hard";

interface EngineOut {
  log: Json[];
  frames: Record<string, Json[]>;
  phase: string;
  winner?: "a" | "b";
  scores: [number, number];
  hands: Json[];
  waitingFor?: number;
  /** Achievement ids earned per seat, when the game is over. */
  feats?: Record<string, string[]>;
  error?: string;
}

/** Time a person has for each move, after the previous moves are shown,
 * unless the room's rules say otherwise ("tempo", seconds; 0 = no limit). */
export const TURN_MS = 20_000;

/** Days per move of a slow game ("partida lenta", rules "lento"); 0 for a
 * normal game. A slow game is for 4 people, who play whenever they can. */
export function slowDays(rules: Json): number {
  const d = (rules as Record<string, unknown>)?.lento;
  return typeof d === "number" && d > 0 ? Math.min(Math.floor(d), 7) : 0;
}

export function turnMs(rules: Json): number | null {
  const days = slowDays(rules);
  if (days) return days * 86_400_000;
  const t = (rules as Record<string, unknown>)?.tempo;
  if (typeof t !== "number") return TURN_MS;
  return t > 0 ? Math.min(t, 120) * 1000 : null;
}

/** A seat's table view (TableView JSON) with everything private taken
 * out: no hand, no partner's cards, covered cards face down, no actions. */
export function spectatorView(frame: Json): Json {
  const hide = (plays: unknown) =>
    ((plays as Json[] | undefined) ?? []).map((p) => {
      if (!p.x) return p;
      const { c: _c, ...rest } = p;
      return rest;
    });
  const out: Json = { ...frame, hand: [] };
  for (
    const k of [
      "partner",
      "partnerRaise",
      "canCover",
      "canRaise",
      "mustAnswer",
      "myTurn",
      "toast",
      "delay",
    ]
  ) {
    delete out[k];
  }
  out.plays = hide(frame.plays);
  out.rounds = ((frame.rounds as Json[] | undefined) ?? []).map((r) => ({
    ...r,
    p: hide(r.p),
  }));
  return out;
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
  turn_deadline?: string | null;
  /** Seat the game waits for (null when nobody, e.g. between games). */
  waiting_seat?: number | null;
  /** The tournament match played in this room (seats are fixed). */
  tournament_match_id?: string | null;
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
  departed?: Record<string, number>;
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

  /** A room for a tournament match (see tournament.ts): [seats] are
   * filled now (slow games), or as each person enters. */
  async createForTournament(opts: {
    rules: Json;
    groupId: string | null;
    matchId: string;
    seats: { user_id: string; name: string }[];
  }) {
    for (let attempt = 0; ; attempt++) {
      const { data, error } = await this.db.from("game_rooms").insert({
        code: newCode(),
        host_id: this.userId,
        rules: opts.rules,
        bot_level: "medium",
        mode: "ranked",
        group_id: opts.groupId,
        tournament_match_id: opts.matchId,
      }).select().single();
      if (error?.code === "23505" && attempt < 5) continue;
      if (error) throw error;
      if (opts.seats.length) {
        const { error: seatError } = await this.db.from("game_seats").insert(
          opts.seats.map((s, seat) => ({
            room_id: data.id,
            seat,
            user_id: s.user_id,
            name: s.name,
            is_guest: false,
          })),
        );
        if (seatError) throw seatError;
      }
      return { roomId: data.id as string, code: data.code as string };
    }
  }

  /** The seat of this person in a tournament room (team A in 0 and 2, team
   * B in 1 and 3), or -1 when they don't play this match. */
  private async tournamentSeat(room: Room): Promise<number> {
    const { data: m } = await this.db.from("tournament_matches")
      .select("team_a, team_b").eq("id", room.tournament_match_id!).maybeSingle();
    if (!m) return -1;
    const { data: teams } = await this.db.from("tournament_teams")
      .select("id, player_a, player_b").in("id", [m.team_a, m.team_b]);
    const a = teams?.find((t) => t.id === m.team_a);
    const b = teams?.find((t) => t.id === m.team_b);
    const order = [a?.player_a, b?.player_a, a?.player_b, b?.player_b];
    return order.indexOf(this.userId);
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
    if (room.tournament_match_id) {
      return await this.joinTournament(room, seats);
    }
    if (seats.some((s) => s.user_id === this.userId)) {
      return { roomId: room.id, code: room.code };
    }
    if (room.status === "playing") {
      await this.joinGame(room, seats);
      return { roomId: room.id, code: room.code };
    }
    const free = [0, 1, 2, 3].filter((i) => !seats.some((s) => s.seat === i));
    if (free.length === 0) throw new Refused("room_full");
    await this.seat(room.id, free[0]);
    await this.touch(room.id);
    return { roomId: room.id, code: room.code };
  }

  private async joinTournament(room: Room, seats: Seat[]) {
    const seat = await this.tournamentSeat(room);
    if (seat < 0) throw new Refused("not_in_match");
    const tournaments = new Tournaments(this.db, this.userId, false, this.name);
    await tournaments.arrived(room.tournament_match_id!, this.userId);
    if (seats.some((s) => s.user_id === this.userId)) {
      return { roomId: room.id, code: room.code };
    }
    if (room.status === "playing") {
      await this.joinGame(room, seats, seat);
      return { roomId: room.id, code: room.code };
    }
    await this.seat(room.id, seat);
    await this.touch(room.id);
    // Everyone is here: the (live) match starts.
    if (room.status === "lobby" && seats.length === 3) {
      try {
        await this.start({ roomId: room.id }, true);
      } catch (e) {
        if (!(e instanceof Refused)) throw e;
      }
    }
    return { roomId: room.id, code: room.code };
  }

  /** Moves to another free seat (to pick a partner) before a game. */
  async sit(body: Json) {
    const room = await this.room(body.roomId as string);
    if (room.tournament_match_id) throw new Refused("tournament_room");
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
    if (room.tournament_match_id) throw new Refused("tournament_room");
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

  /** Starts a game (or a rematch); the computer takes the empty seats.
   * In a tournament room: the next game of the match, by anyone seated,
   * once all 4 are there ([internal]: by the server itself). */
  async start(body: Json, internal = false) {
    const room = await this.room(body.roomId as string);
    if (room.tournament_match_id) {
      const seated = await this.seats(room.id);
      if (!internal) this.mySeat(seated);
      if (seated.length < 4) throw new Refused("match_needs_four");
      const tournaments = new Tournaments(this.db, this.userId, false, this.name);
      if (!(await tournaments.seriesOpen(room.tournament_match_id))) {
        throw new Refused("match_over");
      }
    } else {
      this.hostOnly(room);
    }
    if (slowDays(room.rules) && (await this.seats(room.id)).length < 4) {
      throw new Refused("slow_needs_four");
    }
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
      departed: {},
      started_at: new Date().toISOString(),
      match_id: null,
    });
    if (error) throw error;
    await Promise.all([
      this.touch(room.id, {
        bots,
        game_no: room.game_no + 1,
        turn_deadline: this.deadline(room, out, seats),
        waiting_seat: out.waitingFor ?? null,
      }),
      this.writeViews(room.id, seats, out, version),
    ]);
    await this.notifyTurn({ ...room, waiting_seat: null }, seats, out);
    if (room.tournament_match_id) {
      await new Tournaments(this.db, this.userId, false, this.name)
        .matchStarted(room.tournament_match_id);
    }
    return {};
  }

  async act(body: Json) {
    const action = body.move as Json | undefined;
    if (!action || typeof action.t !== "string") throw new Refused("bad_action");
    for (let attempt = 0; attempt < 4; attempt++) {
      const { room, seats, state } = await this.load(body.roomId as string);
      if (room.status !== "playing") throw new Refused("not_playing");
      const me = this.mySeat(seats);
      const out = runEngine({
        ...this.input(room, state),
        act: { seat: me.seat, action },
      });
      if (out.error) throw new Refused("illegal_move");
      const version = await this.save(room, seats, state, out);
      if (version) return this.mine(out, me.seat, version);
    }
    throw new Refused("busy");
  }

  /** Someone ran out of time: the computer moves for them. Any seated
   * person's app may ask; it does nothing before the deadline. */
  async timeout(body: Json) {
    const seats = await this.seats(body.roomId as string);
    const me = this.mySeat(seats);
    const res = await this.expire(body.roomId as string);
    return res ? this.mine(res.out, me.seat, res.version) : { waiting: true };
  }

  /** Slow games: lets the computer move for whoever ran out of days. Called
   * by the game-sweep function (hourly), since nobody may be online. */
  async sweep() {
    const { data, error } = await this.db.from("game_rooms").select("id")
      .eq("status", "playing").not("rules->lento", "is", null)
      .lt("turn_deadline", new Date().toISOString()).limit(50);
    if (error) throw error;
    let moved = 0;
    for (const { id } of data ?? []) {
      try {
        if (await this.expire(id)) moved++;
      } catch (e) {
        console.error("sweep", id, e);
      }
    }
    return { rooms: data?.length ?? 0, moved };
  }

  private async expire(roomId: string) {
    for (let attempt = 0; attempt < 4; attempt++) {
      const { room, seats, state } = await this.load(roomId);
      const deadline = room.turn_deadline ? Date.parse(room.turn_deadline) : NaN;
      // A little slack for clocks that run a bit fast.
      if (room.status !== "playing" || !(Date.now() >= deadline - 2000)) {
        return null;
      }
      const out = runEngine({ ...this.input(room, state), timeout: true });
      if (out.error) return null;
      // In a slow game, the computer moving for someone takes it out of
      // the ranking (like leaving a normal game).
      const patch = slowDays(room.rules) ? { replaced: true } : {};
      const version = await this.save(room, seats, state, out, patch);
      if (version) return { out, version };
    }
    throw new Refused("busy");
  }

  private async load(roomId: string) {
    const [room, seats, state] = await Promise.all([
      this.room(roomId),
      this.seats(roomId),
      this.state(roomId),
    ]);
    return { room, seats, state };
  }

  private input(room: Room, state: State): Json {
    return {
      rules: room.rules,
      seed: state.seed,
      firstDealer: state.first_dealer,
      bots: room.bots,
      log: state.log,
    };
  }

  /** The caller's own frames, so their app needn't wait for Realtime. */
  private mine(out: EngineOut, seat: number, version: number) {
    return { version, frames: out.frames[String(seat)] ?? [] };
  }

  /** When the person the game now waits for runs out of time. */
  private deadline(room: Room, out: EngineOut, seats: Seat[]): string | null {
    if (out.waitingFor === undefined || out.phase === "gameOver") return null;
    const turn = turnMs(room.rules);
    if (turn === null) return null;
    // Everyone first watches the moves just made.
    const showing = Math.max(
      0,
      ...seats.map((s) =>
        (out.frames[String(s.seat)] ?? []).reduce(
          (sum, f) => sum + ((f.delay as number | undefined) ?? 0),
          0,
        )
      ),
    );
    return new Date(Date.now() + showing + turn).toISOString();
  }

  /** Stores the new log if nobody changed it meanwhile; returns the new
   * version, or 0 to retry. */
  private async save(room: Room, seats: Seat[], state: State, out: EngineOut, patch: Json = {}) {
    const version = state.version + 1;
    const { data, error } = await this.db.from("game_states")
      .update({ log: out.log, version, ...patch })
      .eq("room_id", room.id).eq("version", state.version).select("room_id");
    if (error) throw error;
    if (!data?.length) return 0;
    const over = out.phase === "gameOver" && out.winner;
    await Promise.all([
      this.writeViews(room.id, seats, out, version),
      over ? this.finish(room, state, out) : this.touch(room.id, {
        turn_deadline: this.deadline(room, out, seats),
        waiting_seat: out.waitingFor ?? null,
      }),
    ]);
    await this.notifyTurn(room, seats, out);
    return version;
  }

  /** Slow games: a push to the person whose turn it now is, and to
   * everyone when the game ends. */
  private async notifyTurn(room: Room, seats: Seat[], out: EngineOut) {
    const days = slowDays(room.rules);
    if (!days) return;
    const path = `/jogo/entrar?codigo=${room.code}`;
    const link = `${WEB_APP_URL}/sala/?codigo=${room.code}&jogo=1`;
    const tag = `slow-${room.id}`;
    if (out.phase === "gameOver") {
      const [a, b] = out.scores;
      await sendPush(this.db, seats.map((s) => s.user_id), {
        title: "Fim da partida lenta",
        body: `Sala ${room.code}: ${a} × ${b}. Veja como terminou.`,
        path,
        link,
        tag,
        kind: "end",
      });
      return;
    }
    const seat = out.waitingFor;
    if (seat === undefined || seat === room.waiting_seat) return;
    const who = seats.find((s) => s.seat === seat);
    if (!who) return;
    await sendPush(this.db, [who.user_id], {
      title: "Sua vez no truco!",
      body: `Partida lenta (sala ${room.code}): é a sua vez. Você tem ` +
        `${days === 1 ? "1 dia" : `${days} dias`} para jogar.`,
      path,
      link,
      tag,
      kind: "turn",
    });
  }

  private async finish(room: Room, state: State, out: EngineOut) {
    const { error } = await this.db.rpc("record_game_result", {
      p_room: room.id,
      p_scores: out.scores,
      p_hands: out.hands,
      p_started_at: state.started_at,
      p_feats: out.feats ?? {},
    });
    if (error) console.error("record_game_result", error);
    await this.touch(room.id, {
      status: "finished",
      turn_deadline: null,
      waiting_seat: null,
      wins_a: room.wins_a + (out.winner === "a" ? 1 : 0),
      wins_b: room.wins_b + (out.winner === "b" ? 1 : 0),
    });
    if (room.tournament_match_id) {
      const more = await new Tournaments(this.db, this.userId, false, this.name)
        .matchFinished(room.tournament_match_id, out.scores);
      // A slow series goes straight on to its next game.
      if (more && slowDays(room.rules)) {
        await this.start({ roomId: room.id }, true);
      }
    }
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

  /** Takes a seat the computer is playing (the one this person left, if
   * they come back), so a game in progress can be joined. */
  private async joinGame(room: Room, seats: Seat[], fixed?: number) {
    const state = await this.state(room.id);
    const bots = [...room.bots];
    const back = state.departed?.[this.userId];
    const seat = fixed !== undefined
      ? (bots[fixed] ? fixed : -1)
      : back !== undefined && bots[back]
      ? back
      : bots.findIndex((b) => b);
    if (seat < 0) throw new Refused("room_full");
    await this.seat(room.id, seat);
    bots[seat] = null;
    await this.touch(room.id, { bots });
    const now = [...seats, { seat, user_id: this.userId, name: this.name, is_guest: this.isGuest }];
    for (let attempt = 0; attempt < 4; attempt++) {
      const fresh = attempt === 0 ? state : await this.state(room.id);
      const out = runEngine(this.input({ ...room, bots }, fresh));
      // Someone joined mid-game: it no longer counts for the ranking.
      if (await this.save({ ...room, bots }, now, fresh, out, { replaced: true })) return;
    }
    throw new Refused("busy");
  }

  /** Watching a tournament match ("assistir"): for people in the same
   * tournament who don't play this match. Returns the table as a spectator
   * sees it (no hands, covered cards hidden), from the newest view. */
  async watch(body: Json) {
    const room = await this.room(body.roomId as string);
    if (!room.tournament_match_id) throw new Refused("not_tournament");
    const { data: m } = await this.db.from("tournament_matches")
      .select("tournament_id").eq("id", room.tournament_match_id).maybeSingle();
    if (!m) throw new Refused("not_tournament");
    const [{ data: asA }, { data: asB }, { data: t }] = await Promise.all([
      this.db.from("tournament_teams").select("id")
        .eq("tournament_id", m.tournament_id).eq("player_a", this.userId),
      this.db.from("tournament_teams").select("id")
        .eq("tournament_id", m.tournament_id).eq("player_b", this.userId),
      this.db.from("tournaments").select("owner_id")
        .eq("id", m.tournament_id).maybeSingle(),
    ]);
    if (!asA?.length && !asB?.length && t?.owner_id !== this.userId) {
      throw new Refused("not_in_tournament");
    }
    const seats = await this.seats(room.id);
    const { data: views, error } = await this.db.from("game_views")
      .select("seat, version, frames").eq("room_id", room.id);
    if (error) throw error;
    const newest = (views ?? []).reduce(
      (best: Json | null, v: Json) =>
        !best || (v.version as number) > (best.version as number) ? v : best,
      null,
    );
    const frames = (newest?.frames ?? []) as Json[];
    const frame = frames.length ? spectatorView(frames[frames.length - 1]) : null;
    return {
      status: room.status,
      version: newest?.version ?? 0,
      seats: seats.map((s) => ({ seat: s.seat, name: s.name })),
      bots: room.bots,
      wins: [room.wins_a, room.wins_b],
      frame,
    };
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
    // A tournament room waits for its people (until the match deadline).
    if (rest.length === 0 && !room.tournament_match_id) patch.status = "closed";
    if (room.host_id === this.userId && rest.length > 0) patch.host_id = rest[0].user_id;

    if (room.status === "playing" && rest.length > 0) {
      const bots = [...room.bots];
      bots[me.seat] = room.bot_level;
      patch.bots = bots;
      await this.touch(room.id, patch);
      // The computer plays on for the one who left.
      for (let attempt = 0; attempt < 4; attempt++) {
        const state = await this.state(room.id);
        const out = runEngine(this.input({ ...room, bots }, state));
        const departed = { ...(state.departed ?? {}), [this.userId]: me.seat };
        if (await this.save({ ...room, bots }, rest, state, out, { replaced: true, departed })) break;
      }
      return {};
    }
    await this.touch(room.id, patch);
    return {};
  }
}

