// Tournaments (G6) for the "game" Edge Function: sign-up, the draw, the
// bracket or table, a game room per match, walkovers.
//
// Each match is one game to 12 in a room only its 4 people may enter (team
// A in seats 0 and 2, team B in 1 and 3). A live match starts when the
// fourth person enters and must be played by its deadline; a slow match
// ("lento" in the rules) starts right away. game.ts calls matchFinished()
// when a tournament game ends; game-sweep calls sweep() for walkovers.

import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { Game, type Json, Refused, slowDays } from "./game.ts";
import { sendPush } from "../_shared/push.ts";

const WEB_APP_URL = Deno.env.get("WEB_APP_URL") ?? "https://truco.mytrophies.app";
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const DAY_MS = 86_400_000;

export interface Tourney {
  id: string;
  code: string;
  name: string;
  owner_id: string;
  group_id: string | null;
  format: "knockout" | "round_robin" | "double_elimination";
  entry: "pairs" | "solo" | "both";
  rules: Json;
  round_days: number;
  max_teams: number;
  best_of: number;
  final_best_of: number;
  status: "open" | "running" | "finished" | "cancelled";
}

export interface Team {
  id: string;
  tournament_id: string;
  player_a: string;
  name_a: string;
  player_b: string | null;
  name_b: string;
  solo: boolean;
  seed: number | null;
}

export interface Match {
  id: string;
  tournament_id: string;
  round: number;
  slot: number;
  team_a: string | null;
  team_b: string | null;
  room_id: string | null;
  deadline: string | null;
  status: "pending" | "playing" | "done";
  winner: string | null;
  games_a: number;
  games_b: number;
  best_of: number;
  score_a: number | null;
  score_b: number | null;
  walkover: boolean;
  present: string[];
  /** Double elimination: "winners", "losers" or "final". */
  bracket?: string | null;
  /** Double elimination: where each team comes from. */
  sources?: (Source | null)[] | null;
}

/** A team of a double elimination match: the winner ("w") or loser ("l")
 * of another match, or ("reset") the second grand final, played only if
 * the losers' bracket champion wins the first. */
export type Source = { w: string } | { l: string } | { reset: string };

function randomInt(max: number): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] % max;
}

export function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Largest number of teams per format. */
export const MAX_TEAMS = { knockout: 32, round_robin: 8, double_elimination: 16 } as const;

/** Round numbers of the losers' bracket and the grand finals. */
export const LOSERS_ROUND = 100;
export const FINAL_ROUND = 200;

/** The whole double elimination ("repescagem") bracket for [teams] in draw
 * order. Winners' bracket round 1 has the teams (byes as in a knockout);
 * every other match takes the winner or loser of earlier ones. Losing twice
 * is out; the grand final is played again if the team from the losers'
 * bracket wins it. */
export function doubleElimination(teams: string[]) {
  const first = knockoutFirstRound(teams);
  const size = first.length * 2;
  const k = Math.log2(size);
  type Spec = {
    id: string;
    bracket: "winners" | "losers" | "final";
    round: number;
    slot: number;
    team_a: string | null;
    team_b: string | null;
    sources: (Source | null)[];
  };
  const out: Spec[] = [];
  const add = (s: Omit<Spec, "id">) => {
    const spec = { ...s, id: crypto.randomUUID() };
    out.push(spec);
    return spec;
  };
  const wb: Spec[][] = [];
  wb.push(first.map(([a, b], slot) =>
    add({ bracket: "winners", round: 1, slot, team_a: a, team_b: b, sources: [null, null] })
  ));
  for (let r = 2; r <= k; r++) {
    const prev = wb[r - 2];
    const round: Spec[] = [];
    for (let i = 0; i < prev.length / 2; i++) {
      round.push(add({
        bracket: "winners",
        round: r,
        slot: i,
        team_a: null,
        team_b: null,
        sources: [{ w: prev[2 * i].id }, { w: prev[2 * i + 1].id }],
      }));
    }
    wb.push(round);
  }
  let lb: Spec[] = [];
  let lr = 1;
  // Losers of the first round play each other.
  for (let i = 0; i < wb[0].length / 2; i++) {
    lb.push(add({
      bracket: "losers",
      round: LOSERS_ROUND + lr,
      slot: i,
      team_a: null,
      team_b: null,
      sources: [{ l: wb[0][2 * i].id }, { l: wb[0][2 * i + 1].id }],
    }));
  }
  for (let j = 1; j <= k - 1; j++) {
    // Winners so far meet the losers coming down from round j + 1 (in
    // reverse order every other time, to avoid quick rematches).
    lr++;
    const down = wb[j];
    const next: Spec[] = [];
    lb.forEach((m, i) => {
      const from = j % 2 ? down[down.length - 1 - i] : down[i];
      next.push(add({
        bracket: "losers",
        round: LOSERS_ROUND + lr,
        slot: i,
        team_a: null,
        team_b: null,
        sources: [{ w: m.id }, { l: from.id }],
      }));
    });
    lb = next;
    if (j < k - 1) {
      lr++;
      const paired: Spec[] = [];
      for (let i = 0; i < lb.length / 2; i++) {
        paired.push(add({
          bracket: "losers",
          round: LOSERS_ROUND + lr,
          slot: i,
          team_a: null,
          team_b: null,
          sources: [{ w: lb[2 * i].id }, { w: lb[2 * i + 1].id }],
        }));
      }
      lb = paired;
    }
  }
  const final = add({
    bracket: "final",
    round: FINAL_ROUND,
    slot: 0,
    team_a: null,
    team_b: null,
    sources: [{ w: wb[k - 1][0].id }, { w: lb[0].id }],
  });
  add({
    bracket: "final",
    round: FINAL_ROUND + 1,
    slot: 0,
    team_a: null,
    team_b: null,
    sources: [{ reset: final.id }, { reset: final.id }],
  });
  return out;
}
export const MIN_TEAMS = 3;

/** First round of a knockout for [teams] (in draw order): pairs of team
 * ids, null for a bye. Byes go to the first teams, one per match, so no
 * match has two byes. */
export function knockoutFirstRound(teams: string[]): [string, string | null][] {
  let size = 2;
  while (size < teams.length) size *= 2;
  const byes = size - teams.length;
  const out: [string, string | null][] = [];
  let i = 0;
  for (let m = 0; m < size / 2; m++) {
    if (m < byes) {
      out.push([teams[i++], null]);
    } else {
      out.push([teams[i++], teams[i++]]);
    }
  }
  return out;
}

/** Round robin rounds by the circle method: each round is a list of pairs;
 * with an odd number of teams one rests each round. */
export function roundRobin(teams: string[]): [string, string][][] {
  const list: (string | null)[] = [...teams];
  if (list.length % 2) list.push(null);
  const n = list.length;
  const rounds: [string, string][][] = [];
  for (let r = 0; r < n - 1; r++) {
    const round: [string, string][] = [];
    for (let i = 0; i < n / 2; i++) {
      const a = list[i];
      const b = list[n - 1 - i];
      if (a && b) round.push(r % 2 ? [b, a] : [a, b]);
    }
    rounds.push(round);
    // Keep the first in place, rotate the rest.
    list.splice(1, 0, list.pop()!);
  }
  return rounds;
}

/** Round robin standings: wins, then tento balance, then tentos made. */
export function standings(teams: string[], matches: Match[]) {
  const rows = new Map(teams.map((t) => [t, { team: t, played: 0, wins: 0, pf: 0, pa: 0 }]));
  for (const m of matches) {
    if (m.status !== "done" || !m.team_a || !m.team_b) continue;
    const a = rows.get(m.team_a);
    const b = rows.get(m.team_b);
    if (!a || !b) continue;
    a.played++;
    b.played++;
    if (m.winner === m.team_a) a.wins++;
    if (m.winner === m.team_b) b.wins++;
    a.pf += m.score_a ?? 0;
    a.pa += m.score_b ?? 0;
    b.pf += m.score_b ?? 0;
    b.pa += m.score_a ?? 0;
  }
  return [...rows.values()].sort((x, y) =>
    y.wins - x.wins || (y.pf - y.pa) - (x.pf - x.pa) || y.pf - x.pf
  );
}

export class Tournaments {
  constructor(
    private db: SupabaseClient,
    private userId: string,
    private isGuest: boolean,
    private name: string,
  ) {}

  // ---------------------------------------------------------- reading --

  async get(id: string): Promise<Tourney> {
    const { data, error } = await this.db.from("tournaments").select().eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Refused("tournament_not_found");
    return data as Tourney;
  }

  async teams(id: string): Promise<Team[]> {
    const { data, error } = await this.db.from("tournament_teams").select()
      .eq("tournament_id", id).order("created_at");
    if (error) throw error;
    return (data ?? []) as Team[];
  }

  async matches(id: string): Promise<Match[]> {
    const { data, error } = await this.db.from("tournament_matches").select()
      .eq("tournament_id", id).order("round").order("slot");
    if (error) throw error;
    return (data ?? []) as Match[];
  }

  private ownerOnly(t: Tourney) {
    if (t.owner_id !== this.userId) throw new Refused("not_owner");
  }

  private async member(groupId: string, userId = this.userId) {
    const { data } = await this.db.from("group_members").select("user_id")
      .eq("group_id", groupId).eq("user_id", userId).maybeSingle();
    return !!data;
  }

  // ---------------------------------------------------------- sign-up --

  async create(body: Json) {
    if (this.isGuest) throw new Refused("account_required");
    const { data: profile } = await this.db.from("profiles").select("is_premium")
      .eq("id", this.userId).maybeSingle();
    if (!profile?.is_premium) throw new Refused("premium_required");
    const format = body.format === "round_robin"
      ? "round_robin"
      : body.format === "double_elimination"
      ? "double_elimination"
      : "knockout";
    const entry = ["pairs", "solo", "both"].includes(body.entry as string)
      ? body.entry as string
      : "pairs";
    const name = String(body.name ?? "").trim().slice(0, 40);
    if (name.length < 3) throw new Refused("bad_name");
    const max = Math.max(MIN_TEAMS, Math.min(MAX_TEAMS[format], Number(body.maxTeams) || 8));
    const groupId = (body.groupId as string | undefined) || null;
    if (groupId && !(await this.member(groupId))) throw new Refused("not_member");
    const days = Math.max(1, Math.min(14, Number(body.roundDays) || 2));
    const series = (v: unknown) => [1, 3, 5].includes(Number(v)) ? Number(v) : 1;
    const bestOf = series(body.bestOf);
    const finalBestOf = format !== "round_robin"
      ? series(body.finalBestOf ?? bestOf)
      : bestOf;
    for (let attempt = 0; ; attempt++) {
      const code = Array.from(
        crypto.getRandomValues(new Uint8Array(6)),
        (b) => ALPHABET[b % ALPHABET.length],
      ).join("");
      const { data, error } = await this.db.from("tournaments").insert({
        code,
        name,
        owner_id: this.userId,
        group_id: groupId,
        format,
        entry,
        rules: (body.rules ?? {}) as Json,
        round_days: days,
        max_teams: max,
        best_of: bestOf,
        final_best_of: finalBestOf,
      }).select("id, code").single();
      if (error?.code === "23505" && attempt < 5) continue;
      if (error) throw error;
      return { id: data.id, code: data.code };
    }
  }

  /** Signs up: "solo" (alone, the draw finds the partner), "pair" (a new
   * pair, waiting for the partner; returns the pair's code for the partner)
   * or "join" (as the partner of the pair with that [code]). */
  async register(body: Json) {
    if (this.isGuest) throw new Refused("account_required");
    const t = await this.get(body.tournamentId as string);
    if (t.status !== "open") throw new Refused("registration_closed");
    if (t.group_id && !(await this.member(t.group_id))) throw new Refused("not_member");
    const teams = await this.teams(t.id);
    if (teams.some((x) => x.player_a === this.userId || x.player_b === this.userId)) {
      throw new Refused("already_registered");
    }
    const people = teams.reduce((n, x) => n + (x.player_b ? 2 : 1), 0);
    if (people >= t.max_teams * 2) throw new Refused("tournament_full");
    const as = body.as;
    if (as === "join") {
      const code = String(body.code ?? "").trim().toUpperCase();
      const { data: codes } = await this.db.from("tournament_team_codes")
        .select("team_id").eq("code", code);
      const team = teams.find((x) => codes?.some((c) => c.team_id === x.id));
      if (!team) throw new Refused("bad_team_code");
      if (team.solo || team.player_b) throw new Refused("team_full");
      const { data, error } = await this.db.from("tournament_teams")
        .update({ player_b: this.userId, name_b: this.name })
        .eq("id", team.id).is("player_b", null).select("id");
      if (error) throw error;
      if (!data?.length) throw new Refused("team_full");
      await this.notify([team.player_a], t, {
        title: `Torneio ${t.name}`,
        body: `${this.name} entrou na sua dupla.`,
      });
      return { teamId: team.id };
    }
    const solo = as === "solo";
    if (solo && t.entry === "pairs") throw new Refused("pairs_only");
    if (!solo && t.entry === "solo") throw new Refused("solo_only");
    // Complete pairs (or pairs waiting a partner) can't outnumber the room.
    if (!solo && teams.filter((x) => !x.solo).length >= t.max_teams) {
      throw new Refused("tournament_full");
    }
    const { data, error } = await this.db.from("tournament_teams").insert({
      tournament_id: t.id,
      player_a: this.userId,
      name_a: this.name,
      solo,
    }).select("id").single();
    if (error) throw error;
    if (solo) return { teamId: data.id };
    try {
      return { teamId: data.id, code: await this.newPairCode(data.id) };
    } catch (e) {
      // No half sign-ups: without its code nobody could join the pair.
      await this.db.from("tournament_teams").delete().eq("id", data.id);
      throw e;
    }
  }

  /** Only the partner who gets this code can join the pair. */
  private async newPairCode(teamId: string): Promise<string> {
    const code = Array.from(
      crypto.getRandomValues(new Uint8Array(4)),
      (b) => ALPHABET[b % ALPHABET.length],
    ).join("");
    const { error } = await this.db.from("tournament_team_codes")
      .upsert({ team_id: teamId, code });
    if (error) throw error;
    return code;
  }

  /** The code of the caller's pair, still waiting for the partner (made
   * now if the pair has none). */
  async pairCode(body: Json) {
    const t = await this.get(body.tournamentId as string);
    const team = (await this.teams(t.id)).find((x) =>
      x.player_a === this.userId && !x.solo && !x.player_b
    );
    if (!team) return { code: null };
    const { data } = await this.db.from("tournament_team_codes").select("code")
      .eq("team_id", team.id).maybeSingle();
    return { code: data?.code ?? await this.newPairCode(team.id) };
  }

  async unregister(body: Json) {
    const t = await this.get(body.tournamentId as string);
    if (t.status !== "open") throw new Refused("registration_closed");
    const teams = await this.teams(t.id);
    const team = teams.find((x) => x.player_a === this.userId || x.player_b === this.userId);
    if (!team) return {};
    if (team.player_b === this.userId) {
      await this.db.from("tournament_teams").update({ player_b: null, name_b: "" })
        .eq("id", team.id);
    } else if (team.player_b) {
      // The partner stays, waiting for someone else.
      await this.db.from("tournament_teams").update({
        player_a: team.player_b,
        name_a: team.name_b,
        player_b: null,
        name_b: "",
      }).eq("id", team.id);
    } else {
      await this.db.from("tournament_teams").delete().eq("id", team.id);
    }
    return {};
  }

  async cancel(body: Json) {
    const t = await this.get(body.tournamentId as string);
    this.ownerOnly(t);
    if (t.status === "finished" || t.status === "cancelled") return {};
    await this.db.from("tournaments").update({
      status: "cancelled",
      finished_at: new Date().toISOString(),
    }).eq("id", t.id);
    const matches = await this.matches(t.id);
    const rooms = matches.filter((m) => m.room_id && m.status !== "done").map((m) => m.room_id!);
    if (rooms.length) {
      await this.db.from("game_rooms").update({ status: "closed", turn_deadline: null })
        .in("id", rooms);
    }
    const teams = await this.teams(t.id);
    await this.notify(players(teams).filter((p) => p !== this.userId), t, {
      title: `Torneio ${t.name}`,
      body: "O torneio foi cancelado.",
    });
    return {};
  }

  // ------------------------------------------------------------ start --

  /** Closes sign-up: pairs the people alone, draws the order and opens the
   * first matches. */
  async start(body: Json) {
    const t = await this.get(body.tournamentId as string);
    this.ownerOnly(t);
    if (t.status !== "open") throw new Refused("already_started");
    let teams = await this.teams(t.id);
    const full = teams.filter((x) => x.player_b);
    const alone = teams.filter((x) => !x.player_b);
    const drop: string[] = [];
    const merged: Team[] = [];
    if (t.entry === "pairs") {
      drop.push(...alone.map((x) => x.id));
    } else {
      const order = shuffle(alone);
      for (let i = 0; i + 1 < order.length; i += 2) {
        const [a, b] = [order[i], order[i + 1]];
        merged.push({ ...a, player_b: b.player_a, name_b: b.name_a, solo: false });
        drop.push(b.id);
      }
      if (order.length % 2) drop.push(order[order.length - 1].id);
    }
    const final = [...full, ...merged].slice(0, t.max_teams);
    if (final.length < MIN_TEAMS) throw new Refused("too_few_teams");
    // Claim the start, so a double tap doesn't draw twice.
    const { data: claimed } = await this.db.from("tournaments")
      .update({ status: "running", started_at: new Date().toISOString() })
      .eq("id", t.id).eq("status", "open").select("id");
    if (!claimed?.length) throw new Refused("already_started");

    const leftOut = teams.filter((x) => drop.includes(x.id)).map((x) => x.player_a);
    for (const extra of [...full, ...merged].slice(t.max_teams)) {
      drop.push(extra.id);
      leftOut.push(extra.player_a, extra.player_b!);
    }
    for (const m of merged) {
      await this.db.from("tournament_teams").update({
        player_b: m.player_b,
        name_b: m.name_b,
        solo: false,
      }).eq("id", m.id);
    }
    if (drop.length) await this.db.from("tournament_teams").delete().in("id", drop);
    const order = shuffle(final);
    await Promise.all(order.map((x, i) =>
      this.db.from("tournament_teams").update({ seed: i + 1 }).eq("id", x.id)
    ));
    teams = order.map((x, i) => ({ ...x, seed: i + 1 }));
    const ids = teams.map((x) => x.id);
    const now = Date.now();
    const rows: Partial<Match>[] = [];
    if (t.format === "knockout") {
      const first = knockoutFirstRound(ids);
      first.forEach(([a, b], slot) =>
        rows.push({
          best_of: first.length === 1 ? t.final_best_of : t.best_of,
          tournament_id: t.id,
          round: 1,
          slot,
          team_a: a,
          team_b: b,
          status: b ? "pending" : "done",
          winner: b ? null : a,
          deadline: b ? this.deadline(t, now, 1) : null,
        })
      );
    } else if (t.format === "double_elimination") {
      for (const s of doubleElimination(ids)) {
        const bye = s.round === 1 && !s.team_b;
        rows.push({
          ...s,
          tournament_id: t.id,
          best_of: s.bracket === "final" ? t.final_best_of : t.best_of,
          status: bye ? "done" : "pending",
          winner: bye ? s.team_a : null,
          deadline: s.round === 1 && s.team_b ? this.deadline(t, now, 1) : null,
        });
      }
    } else {
      roundRobin(ids).forEach((round, r) =>
        round.forEach(([a, b], slot) =>
          rows.push({
            best_of: t.best_of,
            tournament_id: t.id,
            round: r + 1,
            slot,
            team_a: a,
            team_b: b,
            deadline: this.deadline(t, now, r + 1),
          })
        )
      );
    }
    const { data: created, error } = await this.db.from("tournament_matches")
      .insert(rows).select();
    if (error) throw error;
    if (leftOut.length) {
      await this.notify(leftOut, t, {
        title: `Torneio ${t.name}`,
        body: "O torneio começou, mas você ficou sem dupla desta vez.",
      });
    }
    // A round robin plays round by round (see advance).
    for (const m of (created ?? []) as Match[]) {
      if (m.team_b && (t.format !== "round_robin" || m.round === 1)) {
        await this.open(t, m, teams);
      }
    }
    await this.advance(t);
    return {};
  }

  /** Deadline of a live match in [round] (counted from [from]); none for
   * slow games, whose moves have their own deadline. */
  private deadline(t: Tourney, from: number, round: number): string | null {
    if (slowDays(t.rules)) return null;
    const rounds = t.format === "round_robin" ? round : 1;
    return new Date(from + rounds * t.round_days * DAY_MS).toISOString();
  }

  /** Opens the room of [m]: seats are fixed; a slow game starts now. */
  private async open(t: Tourney, m: Match, teams: Team[]) {
    const a = teams.find((x) => x.id === m.team_a);
    const b = teams.find((x) => x.id === m.team_b);
    if (!a || !b || !a.player_b || !b.player_b) return;
    const slow = slowDays(t.rules) > 0;
    const host = new Game(this.db, a.player_a, false, a.name_a);
    const { roomId, code } = await host.createForTournament({
      // "serie": games in the match, so the app knows when it's over.
      rules: { ...t.rules, serie: m.best_of || 1, torneio: t.id },
      groupId: t.group_id,
      matchId: m.id,
      seats: slow
        ? [
          { user_id: a.player_a, name: a.name_a },
          { user_id: b.player_a, name: b.name_a },
          { user_id: a.player_b, name: a.name_b },
          { user_id: b.player_b, name: b.name_b },
        ]
        : [],
    });
    await this.db.from("tournament_matches").update({
      room_id: roomId,
      room_code: code,
      updated_at: new Date().toISOString(),
    }).eq("id", m.id);
    const who = [a.player_a, a.player_b, b.player_a, b.player_b];
    const vs = `${a.name_a} e ${a.name_b} × ${b.name_a} e ${b.name_b}`;
    if (slow) {
      await host.start({ roomId });
      await this.notify(who, t, {
        title: `Torneio ${t.name}`,
        body: `Seu jogo começou como partida lenta: ${vs}.`,
        path: `/jogo/entrar?codigo=${code}`,
      });
    } else {
      const until = m.deadline ? ` até ${dayLabel(m.deadline)}` : "";
      await this.notify(who, t, {
        title: `Torneio ${t.name}`,
        body: `Seu jogo está pronto: ${vs}. Combinem um horário e joguem${until}.`,
        kind: "match",
      });
    }
  }

  // ---------------------------------------------------------- results --

  /** A game of a match ended (from game.ts). Returns true when the series
   * goes on (another game in the same room). */
  async matchFinished(matchId: string, scores: [number, number]): Promise<boolean> {
    for (let attempt = 0; attempt < 4; attempt++) {
      const { data } = await this.db.from("tournament_matches").select()
        .eq("id", matchId).maybeSingle();
      const m = data as Match | null;
      if (!m || m.status === "done") return false;
      const gamesA = m.games_a + (scores[0] > scores[1] ? 1 : 0);
      const gamesB = m.games_b + (scores[1] > scores[0] ? 1 : 0);
      const need = Math.floor((m.best_of || 1) / 2) + 1;
      const over = gamesA >= need || gamesB >= need;
      const { data: saved } = await this.db.from("tournament_matches").update({
        games_a: gamesA,
        games_b: gamesB,
        score_a: (m.score_a ?? 0) + scores[0],
        score_b: (m.score_b ?? 0) + scores[1],
        ...(over
          ? { status: "done", winner: gamesA > gamesB ? m.team_a : m.team_b }
          : {}),
        updated_at: new Date().toISOString(),
      }).eq("id", m.id).eq("games_a", m.games_a).eq("games_b", m.games_b)
        .neq("status", "done").select("id");
      if (!saved?.length) continue; // Changed meanwhile: read again.
      if (over) await this.advance(await this.get(m.tournament_id));
      return !over;
    }
    return false;
  }

  /** Whether the match of a tournament room still has games to play. */
  async seriesOpen(matchId: string): Promise<boolean> {
    const { data } = await this.db.from("tournament_matches")
      .select("status, tournament_id").eq("id", matchId).maybeSingle();
    if (!data || data.status === "done") return false;
    const t = await this.get(data.tournament_id);
    return t.status === "running";
  }

  /** A game of the match started (from game.ts). */
  async matchStarted(matchId: string) {
    await this.db.from("tournament_matches").update({
      status: "playing",
      updated_at: new Date().toISOString(),
    }).eq("id", matchId).eq("status", "pending");
  }

  /** Someone entered the room of a match (from game.ts). */
  async arrived(matchId: string, userId: string) {
    const { data } = await this.db.from("tournament_matches").select("present")
      .eq("id", matchId).maybeSingle();
    const present = (data?.present ?? []) as string[];
    if (present.includes(userId)) return;
    await this.db.from("tournament_matches")
      .update({ present: [...present, userId] }).eq("id", matchId);
  }

  /**
   * "Chamar os jogadores": pushes the players of a match who aren't in its
   * room yet. Only someone of the match can call.
   */
  async call(body: Json) {
    const { data: room } = await this.db.from("game_rooms")
      .select("id, code, status, tournament_match_id").eq("id", body.roomId as string)
      .maybeSingle();
    if (!room?.tournament_match_id) throw new Refused("room_not_found");
    const { data: m } = await this.db.from("tournament_matches").select()
      .eq("id", room.tournament_match_id).maybeSingle();
    if (!m) throw new Refused("room_not_found");
    const match = m as Match;
    if (match.status === "done") throw new Refused("match_over");
    const t = await this.get(match.tournament_id);
    const teams = (await this.teams(t.id))
      .filter((x) => x.id === match.team_a || x.id === match.team_b);
    const everyone = players(teams);
    if (!everyone.includes(this.userId)) throw new Refused("not_in_match");
    const { data: seats } = await this.db.from("game_seats").select("user_id")
      .eq("room_id", room.id);
    const seated = new Set((seats ?? []).map((x) => x.user_id as string));
    const missing = everyone.filter((id) => id !== this.userId && !seated.has(id));
    if (missing.length) {
      await sendPush(this.db, missing, {
        title: `Torneio ${t.name}`,
        body: `${this.name} está na sala do seu jogo (${room.code}). Bora jogar!`,
        path: `/jogo/entrar?codigo=${room.code}`,
        link: `${WEB_APP_URL}/sala/?codigo=${room.code}&jogo=1`,
        tag: `tournament-call-${match.id}`,
      });
    }
    return { called: missing.length };
  }

  /** Opens the next knockout round, or ends the tournament. */
  async advance(t: Tourney) {
    if (t.status !== "running") return;
    const matches = await this.matches(t.id);
    const teams = await this.teams(t.id);
    if (t.format === "round_robin") {
      if (matches.every((m) => m.status === "done")) {
        const top = standings(teams.map((x) => x.id), matches)[0];
        await this.finish(t, top?.team ?? null, teams);
        return;
      }
      // The next round opens when the current one is over.
      const round = Math.min(
        ...matches.filter((m) => m.status !== "done").map((m) => m.round),
      );
      if (matches.some((m) => m.round < round && m.status !== "done")) return;
      for (const m of matches) {
        if (m.round !== round || m.room_id || m.status === "done" || !m.team_b) continue;
        // Claim it, so two results arriving together don't open it twice.
        const { data: claimed } = await this.db.from("tournament_matches")
          .update({ room_code: "" }).eq("id", m.id).is("room_code", null)
          .select("id");
        if (claimed?.length) await this.open(t, m, teams);
      }
      return;
    }
    if (t.format === "double_elimination") {
      await this.resolveDouble(t, matches, teams);
      return;
    }
    const last = Math.max(...matches.map((m) => m.round));
    const round = matches.filter((m) => m.round === last);
    if (round.length === 1) {
      if (round[0].status === "done") await this.finish(t, round[0].winner, teams);
      return;
    }
    for (let slot = 0; slot < round.length; slot += 2) {
      const [x, y] = [round[slot], round[slot + 1]];
      if (!x || !y || x.status !== "done" || y.status !== "done") continue;
      const { data, error } = await this.db.from("tournament_matches").insert({
        best_of: round.length === 2 ? t.final_best_of : t.best_of,
        tournament_id: t.id,
        round: last + 1,
        slot: slot / 2,
        team_a: x.winner,
        team_b: y.winner,
        deadline: this.deadline(t, Date.now(), 1),
      }).select().maybeSingle();
      if (error?.code === "23505") continue; // Opened by someone else.
      if (error) throw error;
      await this.open(t, data as Match, teams);
    }
  }

  /** Double elimination: fills in every match whose teams are now known,
   * opens it (or passes a lone team through), and ends the tournament after
   * the grand final. */
  private async resolveDouble(t: Tourney, matches: Match[], teams: Team[]) {
    const byId = new Map(matches.map((m) => [m.id, m]));
    const loser = (m: Match) =>
      !m.winner ? null : m.winner === m.team_a ? m.team_b : m.team_a;
    for (let changed = true; changed;) {
      changed = false;
      for (const m of matches) {
        if (m.status === "done" || m.room_id) continue;
        const sources = m.sources ?? [null, null];
        const reset = sources[0] && "reset" in sources[0] ? byId.get(sources[0].reset) : null;
        if (reset) {
          if (reset.status !== "done") continue;
          // The champion of the winners' bracket (team A) won: it's over.
          const over = reset.winner === reset.team_a;
          const patch = over
            ? { status: "done", team_a: null, team_b: null, winner: null }
            : { team_a: reset.team_a, team_b: reset.team_b };
          Object.assign(m, patch);
          await this.db.from("tournament_matches").update(patch).eq("id", m.id);
          if (over) {
            await this.finish(t, reset.winner, teams);
            return;
          }
          changed = true;
          await this.openDouble(t, m, teams);
          continue;
        }
        const side = (i: number): { ready: boolean; team: string | null } => {
          const s = sources[i];
          if (!s) return { ready: true, team: i ? m.team_b : m.team_a };
          const from = byId.get("w" in s ? s.w : "l" in s ? s.l : "");
          if (!from || from.status !== "done") return { ready: false, team: null };
          return { ready: true, team: "w" in s ? from.winner : loser(from) };
        };
        const [a, b] = [side(0), side(1)];
        if (!a.ready || !b.ready) continue;
        changed = true;
        if (a.team && b.team) {
          Object.assign(m, { team_a: a.team, team_b: b.team });
          await this.db.from("tournament_matches")
            .update({ team_a: a.team, team_b: b.team }).eq("id", m.id);
          await this.openDouble(t, m, teams);
        } else {
          // One team (it goes through) or none (an empty match).
          const team = a.team ?? b.team;
          const patch = { status: "done", team_a: team, team_b: null, winner: team };
          Object.assign(m, patch);
          await this.db.from("tournament_matches").update(patch).eq("id", m.id);
        }
      }
    }
    const last = matches.find((m) => m.round === FINAL_ROUND + 1);
    if (last?.status === "done" && last.winner) await this.finish(t, last.winner, teams);
  }

  private async openDouble(t: Tourney, m: Match, teams: Team[]) {
    const deadline = this.deadline(t, Date.now(), 1);
    m.deadline = deadline;
    await this.db.from("tournament_matches").update({ deadline }).eq("id", m.id);
    await this.open(t, m, teams);
    // open() set the room; keep this copy from opening it twice.
    m.room_id = m.room_id ?? "opened";
  }

  private async finish(t: Tourney, champion: string | null, teams: Team[]) {
    const { data } = await this.db.from("tournaments").update({
      status: "finished",
      champion,
      finished_at: new Date().toISOString(),
    }).eq("id", t.id).eq("status", "running").select("id");
    if (!data?.length) return;
    const team = teams.find((x) => x.id === champion);
    const winners = team ? [team.player_a, team.player_b!] : [];
    await this.notify(players(teams).filter((id) => !winners.includes(id)), t, {
      title: `Torneio ${t.name}`,
      body: team
        ? `Fim do torneio! Campeões: ${team.name_a} e ${team.name_b}.`
        : "Fim do torneio!",
    });
    if (team) {
      await this.notify(winners, t, {
        title: `Parabéns, campeões! 🏆`,
        body: `${team.name_a} e ${team.name_b} venceram o torneio ${t.name}!`,
        kind: "champion",
      });
    }
  }

  // -------------------------------------------------------- walkovers --

  /** Live matches past their deadline that never started: the team that
   * showed up wins; neither (or both): a draw decides the knockout, and
   * both lose in a round robin. Called by game-sweep. */
  async sweep() {
    const { data, error } = await this.db.from("tournament_matches").select()
      .in("status", ["pending", "playing"]).not("team_b", "is", null)
      .lt("deadline", new Date().toISOString()).limit(50);
    if (error) throw error;
    let decided = 0;
    for (const m of (data ?? []) as Match[]) {
      try {
        if (await this.walkover(m)) decided++;
      } catch (e) {
        console.error("tournament sweep", m.id, e);
      }
    }
    return { matches: data?.length ?? 0, decided };
  }

  private async walkover(m: Match) {
    const t = await this.get(m.tournament_id);
    if (t.status !== "running") return false;
    if (m.room_id) {
      // A game in progress gets to finish.
      const { data: room } = await this.db.from("game_rooms").select("status")
        .eq("id", m.room_id).maybeSingle();
      if (room?.status === "playing") return false;
    }
    const teams = await this.teams(t.id);
    const a = teams.find((x) => x.id === m.team_a);
    const b = teams.find((x) => x.id === m.team_b);
    const count = (x?: Team) =>
      x ? [x.player_a, x.player_b].filter((p) => p && m.present.includes(p)).length : 0;
    const [ca, cb] = [count(a), count(b)];
    // Ahead in the series wins; otherwise whoever showed up.
    let winner: string | null = m.games_a !== m.games_b
      ? (m.games_a > m.games_b ? m.team_a : m.team_b)
      : ca > cb
      ? m.team_a
      : cb > ca
      ? m.team_b
      : null;
    if (!winner && t.format !== "round_robin") {
      winner = randomInt(2) ? m.team_a : m.team_b;
    }
    const { data: done } = await this.db.from("tournament_matches").update({
      status: "done",
      winner,
      walkover: true,
      updated_at: new Date().toISOString(),
    }).eq("id", m.id).eq("status", m.status).select("id");
    if (!done?.length) return false;
    if (m.room_id) {
      await this.db.from("game_rooms").update({ status: "closed" })
        .eq("id", m.room_id).in("status", ["lobby", "finished"]);
    }
    const team = teams.find((x) => x.id === winner);
    await this.notify(
      [a, b].flatMap((x) => x ? [x.player_a, x.player_b!] : []),
      t,
      {
        title: `Torneio ${t.name}`,
        body: team
          ? `O prazo do jogo acabou: vitória por W.O. de ${team.name_a} e ${team.name_b}.`
          : "O prazo do jogo acabou sem ninguém jogar: derrota para as duas duplas.",
      },
    );
    await this.advance(t);
    return true;
  }

  private async notify(
    userIds: string[],
    t: Tourney,
    push: { title: string; body: string; path?: string; kind?: "match" | "champion" },
  ) {
    await sendPush(this.db, userIds.filter(Boolean), {
      ...push,
      path: push.path ?? `/torneios/${t.id}`,
      link: `${WEB_APP_URL}/`,
      tag: `tournament-${t.id}`,
    });
  }
}

function players(teams: Team[]): string[] {
  return teams.flatMap((x) => x.player_b ? [x.player_a, x.player_b] : [x.player_a]);
}

/** "15/11 às 20h" in Brasília time. */
export function dayLabel(iso: string): string {
  const d = new Date(Date.parse(iso) - 3 * 3_600_000);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm} às ${d.getUTCHours()}h`;
}
