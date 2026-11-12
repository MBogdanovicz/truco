# Architecture

Status: living document, last updated 2026-11-10. The schema in §4 is the target; see `supabase/migrations` for what
exists today. This document covers the whole product, but only the parts needed for
**Phase 1 (scorekeeper / "marcador")** are specified in detail. The card game itself (Phase 2) is sketched so that
Phase 1 decisions don't block it.

The app UI is in Brazilian Portuguese. All documentation and code comments are in English.

---

## 1. Product overview

| Area | Description |
|------|-------------|
| Accounts | Passwordless login with an email code, then the user picks a display name. |
| Groups | Public or private groups. Joining via invite code/link. Each group has its own leaderboard. |
| Ranking | Global and per-group leaderboards for **players** and **duos**, with simple stats (W/L/win %) and an Elo rating. |
| Scorekeeper (Phase 1) | A host creates a match, up to 3 others join and pick their team. Each player marks points for their own team; everyone sees the score live. Results are saved at the end. |
| Game (Phase 2) | Ranked or friendly truco games, public/private championships, online or local (device-to-device). |
| Monetization | Free tier (ads, limits) and a paid premium tier. Limits are defined in §9. |

### Platforms

* **Android app** – the primary product. Material 3 look and feel.
* **PWA** – exists mainly so iPhone users can use the app without a native iOS build. It should match the free Android
  version as closely as the browser allows, with an iOS-like (Cupertino) look.

---

## 2. Technology choices

| Concern | Choice | Why |
|---------|--------|-----|
| Client | **Flutter (Dart)**, single codebase for Android and Web/PWA | One codebase keeps both versions functionally identical. |
| Look & feel | Material 3 on Android, Cupertino-style widgets on the PWA | Requested: Android must feel native, PWA should feel closer to iOS. Done via a thin adaptive widget layer (§2.1). |
| State management | Riverpod | Testable, no `BuildContext` coupling, good async support. |
| Navigation | go_router | Deep links (group invites, match join links) on both Android and Web. |
| Backend | **Supabase** (Postgres, Auth, Realtime, Edge Functions) | Email OTP auth out of the box, realtime channels for live scores, SQL for leaderboards. |
| Local storage | drift (SQLite) on Android, IndexedDB-backed drift on Web | Offline matches are stored locally and uploaded later. |
| Local multiplayer | Android **Nearby Connections** (own Kotlin bridge, `NearbyBridge.kt`, over `play-services-nearby`) | Device-to-device without internet or a shared Wi-Fi network (§5.3). |
| Ads | AdMob on Android (later phase) | Interstitial before each match on the free tier. |
| Payments | Google Play Billing on Android; web payments for the PWA (later phase) | See §9. |
| CI | GitHub Actions: analyze, test, build APK and web | Plus a Supabase keep-alive job (§8). |

### 2.1 Adaptive UI

The app never imports Material or Cupertino widgets directly in feature code for the handful of components that must
look different per platform (app bar, buttons, dialogs, switches, navigation bar, text fields, list tiles). Instead a
small `ui/adaptive/` package exposes `AppScaffold`, `AppButton`, `AppDialog`, etc., and picks the implementation from a
single `AppPlatformStyle` value:

* `material` – Android build (default for `TargetPlatform.android`).
* `cupertino` – Web build (the PWA), regardless of the browser's OS.

Everything else (layout, colors, typography scale, the score board itself) is shared. The scoreboard is a custom widget
and looks the same on both platforms.

### 2.2 Why Email OTP instead of a magic link

An installed PWA on iOS does not receive links: tapping a magic link in Mail opens Safari, not the installed PWA, so the
session would land in the wrong place. A **6-digit code** typed into the app works the same everywhere. Supabase Auth
supports this natively (`signInWithOtp` + `verifyOTP` with `type: email`).

---

## 3. High-level architecture

```
┌──────────────────────── Flutter app (Android / PWA) ────────────────────────┐
│ features/                                                                   │
│   auth   profile   groups   ranking   scorekeeper   (game – Phase 2)        │
│ domain/   pure Dart: scoring rules, match event log, Elo                    │
│ data/     repositories → Supabase client, local DB, transports              │
│ ui/adaptive/  Material vs Cupertino components                              │
└─────────────┬───────────────────────────────┬───────────────────────────────┘
              │ HTTPS / WebSocket             │ Nearby Connections (Android only)
              ▼                               ▼
┌──────────────────────────────┐     ┌────────────────────────────┐
│ Supabase                     │     │ Other Android devices at   │
│  Auth (email OTP)            │     │ the same table             │
│  Postgres + RLS              │     └────────────────────────────┘
│  Realtime (broadcast)        │
│  RPC: finish_match, ratings  │
└──────────────────────────────┘
```

The `domain/` layer has no Flutter or Supabase imports, so scoring rules and Elo are covered by plain unit tests and
can later be reused by the game.

---

## 4. Data model (Postgres)

All tables have Row Level Security enabled. `auth.users` is managed by Supabase.

```
profiles(id uuid PK → auth.users, display_name text, avatar_seed text,
         is_premium bool default false, created_at)

groups(id uuid PK, name text, description text, visibility enum('public','private'),
       join_code text unique, owner_id uuid → profiles, created_at)

group_members(group_id → groups, user_id → profiles, role enum('owner','admin','member'),
              joined_at, PK(group_id, user_id))

rooms(id uuid PK, code text, host_id → profiles, created_at, closed_at)   -- online scorekeeper tables

matches(id uuid PK, kind enum('scorekeeper','game'), mode enum('ranked','friendly'),
        group_id uuid null → groups, series_id uuid null → match_series,
        host_id → profiles, transport enum('online','nearby','single_device'),
        status enum('open','in_progress','finished','abandoned'),
        target_score int default 12, score_a int, score_b int, winner enum('a','b') null,
        is_ranked bool,            -- computed on finish, see §6.1
        started_at, finished_at, created_at)

match_players(match_id → matches, seat smallint 0..3, team enum('a','b'),
              user_id uuid null → profiles,     -- null for guests
              guest_name text null,
              PK(match_id, seat))

match_events(match_id → matches, seq int, team enum('a','b'), delta smallint,
             author_seat smallint, kind enum('score','undo'), undoes_seq int null,
             client_ts timestamptz, PK(match_id, seq))

match_series(id uuid PK, wins_a int, wins_b int, created_at)  -- rematch chain (§5.5)

ratings(scope_type enum('global','group'), scope_id uuid null,
        subject_type enum('player','duo'), subject_key text,  -- user id, or "uuidA:uuidB" sorted
        elo numeric default 1000, games int, wins int, losses int,
        points_for int, points_against int, updated_at,
        PK(scope_type, scope_id, subject_type, subject_key))
```

Ratings are updated incrementally by `finish_match` (global scope always, group scope when all four players are
members). Global rows use the nil UUID as `scope_id`. Leaderboards read the `leaderboard` view (ratings + display
names) with `ORDER BY elo` or by win rate (by Elo or by win %), so the "simple stats" view and the Elo
view come from the same table.

Writes to `matches` (final result), `match_events` and `ratings` happen only through a `finish_match` RPC
(`security definer`) that validates the event log and updates ratings in one transaction. Clients cannot write
ratings directly.

---

## 5. Scorekeeper (Phase 1)

### 5.1 Scoring rules

The scorekeeper is variant-agnostic: the common Brazilian truco scoring applies.

* A game is played to **12 tentos** (`target_score`, kept configurable for later).
* Point buttons: **+1** (normal hand), **+3** (truco), **+6**, **+9**, **+12**.
* A team's score is capped at the target; reaching it ends the game.
* Visual cues only (no rule enforcement): **"Mão de onze"** banner when one team is at 11, **"Mão de ferro"** when both
  are at 11.
* **Undo** removes the most recent non-undone event of the player's own team.

### 5.2 Match as an event log

A match state is never stored as "current score" on the clients; it is derived from an ordered list of events:

```
ScoreEvent { seq, team, delta, authorSeat, kind: score | undo, undoesSeq?, clientTs }
```

The **host is the authority**: clients send *intents* ("seat 2 wants +3 for team B"), the host validates them
(own team only, cooldown, not finished), assigns `seq`, and broadcasts the accepted event. Every client rebuilds the
score by folding the log. This makes undo trivial, makes reconnects simple (send the full log), and gives a full audit
trail for ranked matches. The same model works over every transport.

### 5.3 Transports

Players at the same physical table usually don't need the internet, so the scorekeeper supports three transports
behind one interface:

```dart
abstract interface class MatchTransport {
  Stream<MatchSnapshot> get snapshots;
  Future<void> sendIntent(ScoreIntent intent);
  Future<void> close();
}
```

| Transport | Platforms | Needs internet? | How it works |
|-----------|-----------|-----------------|--------------|
| `online` | Android + PWA | Yes | A **room** (`rooms` table, 6-char join code) plus a Supabase Realtime **broadcast** channel `room:<id>`. The host device holds the authoritative state and broadcasts a full `RoomSnapshot` after every change; other devices send requests (`hello`, `pick`, `intent`, `vote`). See `lib/domain/scorekeeper/online/`. |
| `nearby` | Android only | **No** (not even shared Wi-Fi) | Google Nearby Connections, `P2P_STAR` strategy: host advertises, others discover and connect via Bluetooth/Wi-Fi Direct. Results stored locally and uploaded when the host is back online. |
| `single_device` | Android + PWA | No | One phone marks for both teams. Other seats can be registered users (picked from recent players/group) or **guests**. |

**Alternatives considered for offline play**

* *Local WebSocket server on the host phone* (`dart:io` HttpServer): works between Android devices on the **same
  Wi-Fi**, but at a bar or a friend's house people are often on mobile data. A PWA also cannot connect to it: the PWA is
  served over HTTPS and browsers block `ws://` connections to a LAN IP (mixed content), and self-signed `wss://` certs
  are rejected. Nearby Connections removes the shared-Wi-Fi requirement, so it is preferred.
* *WebRTC data channels*: would let the PWA connect peer-to-peer, but still needs an online signaling server for the
  handshake, so it gives no advantage over the `online` transport.

**Result:** fully offline multi-device scoring is an Android-only feature. PWA users can always use `online` or
`single_device`. A PWA player at a table with Android players in `nearby` mode can still be added to the match as a seat
by the host (marked by someone else).

### 5.4 Cooldown

To prevent two partners from scoring the same hand twice, the host rejects a score intent for a team if another score
event for that team was accepted less than **N seconds** ago (default **15 s**, constant `teamScoreCooldown`, tunable).
The UI shows a short countdown ring on that team's buttons for everyone on the team. Undo is never blocked by the
cooldown. In `single_device` mode the cooldown is disabled (a single person is marking).

### 5.5 Rematch / series

When a game ends, every connected device shows a **"Revanche?"** dialog. Each team confirms via any of its members
(in `single_device` mode the host confirms). When both teams confirm, a new match is created with the same seats and
the same `series_id`; the screen shows the series tally (e.g. *Nós 2 × 1 Eles*). Each game in a series is saved and
ranked independently, so "best of 3/5" is up to the players.

### 5.6 Lifecycle

1. Host creates a match: chooses transport, mode (ranked/friendly), optional group.
2. Lobby: players join (code/QR for `online`, discovery for `nearby`) and pick team A or B. The host can move players
   and add guests to empty seats.
3. Host starts the match once each team has at least one player (2v2 is the normal case; 1v1 is allowed).
4. Scoring until one team hits 12.
5. Host calls `finish_match` (immediately if online, or later from the local queue) → results and ratings are saved.
6. Rematch prompt (§5.5).

**Host hand-off (online):** a host that leaves on purpose closes the room; finished games were already saved. A host
that goes silent (dead phone, no signal) is replaced: the host re-sends its snapshot every 5 s, and when a seated app
user has heard nothing for 15 s × (their place in seat order), they take over with the snapshot they already hold and
broadcast it under a new `hostEpoch`. Snapshots compare by (epoch, revision), so a former host that comes back steps
down even if it kept counting revisions alone, and is told that its offline changes were dropped. A non-host device that
has not heard the host for 10 s shows "Sem conexão" and cannot mark; the host is blocked only while its own Realtime
link is down. So with two devices, the one left behind takes over after 15 s and keeps marking alone. Non-host
devices ping the host every 5 s; when every app user of a team has been quiet for 10 s, the host may mark for that team
(as it does for a team of guests) until one of them is back. In
`nearby` mode the match pauses until the host reconnects. Nearby rooms reuse `OnlineRoom` with `handOff: false`: the host's `NearbyHostChannel` is a
star hub that relays each player's message to the others, and a `NearbyClientChannel` rediscovers the same room id
and reconnects after a drop. Rooms are advertised as `T1|<roomId>|<hostName>` and are not stored in the database;
finished games go through the offline upload queue with `transport = nearby`.

Finished games are uploaded by the host through the `finish_match` RPC (idempotent, recomputes the score from the event
log). Uploads are queued on the device while offline and retried on the next app start. Every device also keeps the game
in its local history.

---

## 6. Ranking

### 6.1 What counts

A finished match is **ranked** when: `mode = ranked`, all four seats are registered users (no guests), and the match is
2v2. Otherwise it is saved for history but does not change ratings. (1v1 ranking can be added later.)

A ranked match always updates the **global** scope, and also the **group** scope when `group_id` is set and all four
players are members of that group.

### 6.2 Simple stats

Per scope and subject: games, wins, losses, win %, points for/against.

### 6.3 Elo

Elo is a rating system where each player starts at 1000 and gains more points for beating stronger opponents and fewer
for beating weaker ones.

* **Player rating:** team rating = average of its two players. Expected score
  `E = 1 / (1 + 10^((R_opp - R_team) / 400))`. Each player's change is `K × (S − E)` with `S` = 1 for a win, 0 for a
  loss. `K = 40` for a player's first 20 games, then `K = 24`.
* **Duo rating:** a fixed pair of players (`subject_key = sorted(userA, userB)`) has its own rating computed the same
  way against the opposing duo's rating.
* Leaderboards hide subjects with fewer than 5 games by default ("provisional").

The rating maths live in `domain/` (Dart, unit tested) and are mirrored in the `finish_match` SQL function; a shared set
of test vectors keeps both in sync.

---

## 7. Accounts and groups

* **Login:** email → 6-digit code → (first time) choose display name. Sessions persist on device.
* **Profile:** display name, generated avatar, match history, own stats.
* **Groups:** create (public/private), join via code or link `…/g/<code>`, browse/search public groups. Owner/admins can
  regenerate the code and remove members. A group shows its member leaderboard (players and duos) and recent matches.

---

## 8. Supabase project keep-alive

Supabase pauses free-tier projects after 7 days without activity. A scheduled GitHub Actions workflow
(`.github/workflows/supabase-keepalive.yml`) runs every 3 days and performs a lightweight authenticated read against
the REST API (`SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` stored as repository secrets).

---

## 9. Free vs premium (initial proposal, to refine)

| Feature | Free | Premium |
|---------|------|---------|
| Scorekeeper (all transports) | ✅ | ✅ |
| Ads | Interstitial before each match | None |
| Groups joined/owned | Up to 2 owned, unlimited joined | Unlimited |
| History & stats | Last 30 days | Full history, detailed stats |
| Championships (Phase 2) | Join only | Create |

Entitlement is a server-side flag (`profiles.is_premium`, later an `entitlements` table fed by purchase verification).
Android uses Google Play Billing. For the PWA, the plan is web checkout (e.g. Stripe) tied to the same account; this is
deferred until after Phase 1. AdMob does not support Flutter Web, so the PWA free tier may initially ship without ads.

---

## 10. Phase 2: the game

### 10.1 Engine (`app/lib/domain/game/`)

* `cards.dart`: the 40-card deck (no 8, 9, 10). Card ids like `7c` are used in logs and on the wire.
* `rules.dart`: `TrucoRules`. Paulista is the only preset (stakes 1/3/6/9/12, mão de onze worth 3, game to 12).
  Variations are fields (`copyWith`): `manilhaMode` (`vira` = flipped card decides the manilha rank, `fixed` =
  4♣ 7♥ A♠ 7♦), `allowCoveredCard`, `ironHand`, and what partners may see: `seePartnerOnRaise` (the team answering
  a raise), `bothTeamsSeeOnDecision` (mão de onze, never in a mão de ferro), `dealerSeesPartnerThirdCard` (the dealer
  sees the third card dealt to the partner). `TrucoGame.foot` is the pé of the current round. The engine reads stakes and the decision score from the rules, so
  other scorings could come back as custom rules without engine changes.
* `truco_game.dart`: `TrucoGame`, a mutable, deterministic state machine (seeded shuffles). Seats 0..3 in playing
  order (counter-clockwise); 0/2 are team A. Phases: `decision` (mão de onze), `playing`, `raisePending`,
  `handOver`, `gameOver`. Actions: `PlayCard` (optionally covered), `Raise` (truco or counter-raise), `Accept`,
  `Fold`. `legalActions(seat)` is the single source of what a seat may do; `apply` rejects anything else.
  Every change appends a `GameEvent` (hand started, card played, raise called/accepted, fold, round/hand/game ended)
  so UIs and future transports can animate or replay.
* `PlayerView` is what one seat may know (own hand, partner's hand only in a mão de onze, face-up plays). Bots and
  UIs only get views, which is the boundary the online version needs to hide hands.
* Hand resolution (`handOutcomeOf`): two rounds win; a tie after a won round goes to the first-round winner; a tied
  first round is decided by the next decided round; all tied = nobody scores. Equal top cards from both teams tie
  the round; the first player of the tied top card leads next.
* Mão de onze: the team at 11 sees both hands and plays (worth 3, no raises) or runs (other team +1). 11×11 with
  `ironHand` = mão de ferro: nobody sees their own cards, worth 1.

### 10.2 Bots (`ai.dart`)

`TrucoBot(level)` decides from a `PlayerView`:

* easy: random cards about half the time, random bets.
* medium: heuristic card play (`heuristicPick`: let a winning partner win, beat with the cheapest card, tie when the
  first round is ours, keep a manilha in round 1 when there is another decent card), bets from a 40-deal Monte Carlo
  estimate of the hand.
* hard: 220-deal Monte Carlo for bets, weighted towards strong opponent hands after they raise; per-card simulations
  to pick the card; occasional covered cards and rare bluffs.

Bots self-play tests: medium beats easy ~88%, hard beats medium ~55-60% (12-point games, 100-game samples).

### 10.3 Sessions, frames and the table (`app/lib/features/game/`)

`GameSession` (domain) runs one game for its authority: people's actions come in, bots play until a person
must act, and every step becomes a `TableView` (what one seat sees, plus table talk and a `delayMs` hint) for
each human seat. Its whole state is rules + seed + first dealer + bot seats + action log, so it can be rebuilt
by replaying the log. The same code runs on the device (local games) and on the server (online games).

`GameTable` draws a `TableView` (viewer at the bottom); `FramePlayer` shows frames one by one with their
delays. `LocalGameController` runs a `GameSession` on the device (always friendly, nothing uploaded).
`GameSetupScreen` chooses variations and levels (remembered in shared preferences), `RulesScreen` explains them.

### 10.4 Online games (server as judge)

* The Edge Function `supabase/functions/game` runs the Dart engine compiled to JavaScript
  (`app/tool/build_game_server.sh` → `engine.js`; run it after changing `lib/domain/game` and commit the
  output). Each request replays the log, applies one action and writes each person's frames to `game_views`.
  Actions: create, join, sit, options, start (also rematch), act, leave. Tests: `deno test
  supabase/functions/game/game_test.ts` (in-memory database).
* Tables (`20261111000000_game_rooms.sql`): `game_rooms` (code, host, status, rules, computer level,
  ranked/friendly, group, wins), `game_seats` (people only; empty seats are played by the computer),
  `game_states` (seed and log; service role only), `game_views` (one row per person, readable only by them,
  so nobody sees another hand). The app follows rooms/seats/views over Realtime and re-reads the rows on each
  notice (plus a 15 s poll); a view `version` one above the last plays its frames, a bigger jump just shows
  the last frame.
* 20 s per move (`TURN_MS`): after each change the server sets `game_rooms.turn_deadline` (moves still being
  shown + 20 s). The app shows a countdown; once it is past, any seated person's app calls `timeout` and the
  server lets the computer (medium) move for whoever the game waits for.
* Someone leaving mid-game is replaced by the computer (`replaced`), which makes the game unranked. Joining a
  game in progress takes a computer seat (the same seat for someone coming back, from `game_states.departed`)
  and also makes it unranked. The app remembers the last game room so the home screen offers to go back.
* `act` and `timeout` return the caller's own frames, so their app doesn't wait for Realtime.
* Finished games go to `matches` (`kind = 'game'`) through `record_game_result()` (service role). Ranked only
  when asked, with four e-mail accounts and no computer seat; ratings and achievements are applied at once
  (no confirmations: the server saw every card). Hand results become `match_events`, so achievements that
  look at the score's path keep working.
* Rating boards: `ratings.board` is `all` (every ranked game, what older app versions show through the
  `leaderboard` view), `game` or `scorekeeper`. The app reads `leaderboard_boards` and filters
  Jogo / Marcador / Ambos.

### 10.5 Intimar and game achievements (G3)

* Intimar: the app registers its Firebase Cloud Messaging token (`save_push_token`, table `push_tokens`).
  "Intimar o grupo" in a room calls the Edge Function `intimar`, which checks membership, allows one call
  per person and group per minute (`summons`) and sends FCM HTTP v1 pushes to the other members' devices
  (secret `FIREBASE_SERVICE_ACCOUNT_JSON`). Tapping one opens the room's join screen. The site needs the
  Firebase web config and VAPID key as dart-defines (`FIREBASE_*`).
* Game achievements (`game_*` ids): `lib/domain/game/game_feats.dart` reads the game's events (cards
  dealt, raises, folds, the third round) and the engine returns them per seat when the game ends;
  `record_game_result(p_feats)` unlocks them only for ranked games. Wins in the game (`game_first_win`,
  `game_wins_10`) are counted in SQL. Manilha names: gato (paus), copas, espadilha (espadas), salmoura
  (ouros).

### 10.6 Phase 4: move time and "modo professor"

* Custom rules: only the online move time (`TrucoRules.turnSeconds`, JSON `tempo`, 10/20/30 s or 0 =
  no limit; the server's `turnMs()` returns null for no deadline). The game is called just "Truco" in
  the app (no "Paulista").
* "Modo professor" (Premium, `Entitlements.canUseCoach`): `lib/domain/game/coach.dart` reviews each of
  the person's moves against the computer before it is applied, estimating chances with the hard bot's
  sampling (400 deals, fixed seed), and shows a tip banner above the actions. `training.dart` holds the
  practice situations shown by `TrainingScreen` (`/jogo/treinar`); progress is a local pref.

### 10.7 Slow games ("partida lenta")

* A room whose rules have `lento` (days per move, 1-3) is a slow game: it starts only with 4 people,
  `turn_deadline` is days away, and `game_rooms.waiting_seat` says whose turn it is (home screen list
  `slowGamesProvider`, "Sua vez").
* The `game` function pushes (`_shared/push.ts`, FCM) the person whose turn it becomes, and everyone when
  the game ends. Nobody needs the game open: the `game-sweep` function (hourly GitHub workflow
  `game-sweep.yml`, header `x-cron-secret`) lets the computer move for whoever ran out of days, which
  takes the game out of the ranking (`replaced`).
* Leaving the screen keeps the seat ("Voltar depois"); "Abandonar a partida" gives the seat to the computer.

### 10.8 Tournaments (G6)

* Tables `tournaments`, `tournament_teams`, `tournament_matches` (migration `20261113000000_tournaments.sql`),
  written only by the `game` function (`game/tournament.ts`, actions `tournament.*`); the app reads them
  (`app/lib/data/tournaments.dart`). Public or group-only; creating needs Premium (checked on the server).
* Sign-up: pairs (a pair waits for the partner, who joins with the pair's 4-letter code from
  `tournament_team_codes`, readable only by whoever signed the pair up), people alone, or both. On start the people
  without a partner are paired at random (an odd one is left out) and the order is drawn.
* Knockout: byes fill the bracket to a power of 2; each round opens when both feeding matches are done.
  Round robin: circle method, every match created at start, round N due after N × `round_days`.
* Each match has its own game room (`game_rooms.tournament_match_id`, rules carry `serie` = games in the
  match): only its 4 people enter, on fixed seats (team A in 0/2). Live: the game starts when the 4th person
  enters, the next game of a series by anyone seated. Slow (`lento`): seats filled and started at once,
  the series goes on by itself. No rematch.
* `game-sweep` also decides live matches past their deadline (not being played): ahead in the series wins,
  else the team that entered the room (`present`), else a draw (knockout) or a loss for both (round robin).
* Round robin order: wins, tento balance, tentos made.
* Repescagem (`double_elimination`, migration `20261113020000`): the whole bracket is created at start
  (`doubleElimination()`), each match with `bracket` and `sources` (winner/loser of earlier matches);
  `resolveDouble()` fills and opens matches as results come in, passes lone teams through, and plays the
  grand final again (round 201, "Finalíssima"; round 200 is shown as "Final") only if the losers' bracket champion wins round 200.
* Spectators: people in the tournament may watch other matches (`watch` action: the newest seat view
  with hands, partner cards, covered cards and actions removed; the app polls every 3 s).
  Normal rooms can be watched by anyone with the room code (`watch` with `code`; offered by
  "Entrar com código" when the room is full).
* Each finished tournament game is saved to the device history ("Torneio <name>").
* Round robin opens one round at a time (`advance` opens the next round's rooms once the current
  round is over; claimed via `room_code = ''`). The champions get their own push (kind `champion`).
* The app draws knockout and repescagem as a bracket (`bracket_view.dart`): rounds side by side, each
  match centred between the two that feed it.
* Normal rooms: in the lobby a seated person can stand up (`stand`) and then sit only on a free seat; the table shows the room code.

### 10.9 Next (see ROADMAP G5+)

* Groups + knockout tournaments; tournaments played on the scorekeeper.

## 11. Repository layout (planned)

```
app/                    Flutter project
  lib/
    domain/             scoring, events, Elo (pure Dart)
    data/               Supabase repos, local DB, transports
    features/           auth, profile, groups, ranking, scorekeeper
    ui/adaptive/        Material / Cupertino components
    ui/theme/
  test/
supabase/
  migrations/           SQL schema, RLS policies, RPCs
  tests/                SQL tests for finish_match / Elo
docs/
.github/workflows/
```
