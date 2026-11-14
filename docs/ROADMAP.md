# Roadmap

See [ARCHITECTURE.md](ARCHITECTURE.md) for the design behind each milestone.

## Phase 1 – Scorekeeper ("marcador")

| # | Milestone | Scope |
|---|-----------|-------|
| M0 ✅ | Foundations | Flutter project (Android + Web/PWA), adaptive UI layer, theme, routing, CI (analyze/test/build), Supabase project + keep-alive workflow. |
| M1 ✅ | Accounts | Email OTP login, display name onboarding, profile screen. |
| M2 ✅ | Scorekeeper – single device | Domain event log, scoring rules, scoreboard UI, undo, mão de onze/ferro cues, guests, rematch/series, local history. |
| M3 ✅ | Scorekeeper – online | Lobby with code/QR, team selection, Supabase Realtime transport, host authority, cooldown, host hand-off, `finish_match` RPC. |
| M4 🟡 | Groups & ranking | Groups (public/private, join code/link), global + group leaderboards for players and duos, stats + Elo. |
| M5 ✅ | Scorekeeper – nearby (Android) | Nearby Connections transport, offline result queue and upload. |
| M6 | Polish & release | App name/icon, Play Store internal testing track, PWA install prompt, basic analytics. |

M2 is built first because it is useful on its own and exercises the domain layer that every transport reuses.

## Later

* Premium tier: in progress, see docs/PREMIUM.md (one-time purchase R$ 7,99, invites R$ 1,99). AdMob interstitial before each game on Android is in (2026-11-10).
* PWA payments.
* PWA ads for free accounts (AdSense / H5 Games Ads), revisit once the truco game is playable on the web: the site has too little content for AdSense approval today (decided 2026-11-10). Until then the PWA shows no ads.

## Phase 2 – The truco game

Order agreed with Marcelo on 2026-11-10. Only Paulista scoring (1/3/6/9/12, mão de onze); Mineiro scoring was left
out on purpose. Table variations are options on top of it.

| # | Milestone | Scope |
|---|-----------|-------|
| G1 ✅ | Local game vs computer | Engine (`domain/game/`), bots easy/medium/hard, card table, rules screen, variations (fixed or flipped manilhas, covered card, mão de ferro). Friendly only. |
| G2 ✅ | Online game | Rooms with a code/link (computer fills empty seats), server as judge (Edge Function `game` runs the Dart engine), ranked only with 4 people with accounts, ranking filter game / scorekeeper / both. Later: game "por perto", turn timer for idle players. |
| G3 ✅ | Social | "Intimar" button (push to group members), game achievements. |
| G4 ✅ | Learning & custom rules | Done (2026-11-11): online move time is the only new rule (Marcelo declined the others); "modo professor" (Premium): tips on the person's plays vs the computer, and training situations. |
| G5 | Looks | Perks unlocked by achievements (decks, table themes) and Marcelo's other theme ideas (decided 2026-11-10: features first). |
| G6 ✅ | Tournaments | Marcelo, 2026-11-11: public or group-only tournaments, chosen table rules, format (round robin, knockout, ...). Premium to create (planned since 2026-11-09). Built on dev 2026-11-11: knockout and round robin, sign-up by pair / alone / both, live (deadline per round) or slow matches, single game or best of 3/5 (final may differ), walkovers. |
| G7 ✅ | Slow ("assíncrono") game | Marcelo, 2026-11-11: 4 humans only; each player has X days per move; push to the player whose turn it is; the room stays listed in the account so a missed push doesn't lose it. |
| Later | Nearby game | Nearby (Bluetooth) game is low priority: people at the same table usually use a real deck. |

## Phase 3 – Polish and the real-table feel

Marcelo's list from 2026-11-12, after G6/G7 shipped (main 8c68eab). Order proposed by Claude; each step ships on its own.

| # | Milestone | Scope |
|---|-----------|-------|
| P1 | Settings and navigation | New "Configurações" screen: preferred table rules (manilha virada/fixa, mão de ferro, see partner's cards, ...) used as defaults; game and tournament screens show a summary with an icon to review/change. Manilha names chosen by the player (display only). Push toggle moves here from Grupos. "Meus torneios" (finished) becomes a chip in Histórico; the tournaments screen keeps only "em andamento" and "Inscrições abertas". Later theme pickers live here too. |
| P2 | Real table layout | Vira in the middle of the table with the deck on top of it (no "Vira" label), "Vale N" right below the deck, items moved to close the empty middle. Speech-bubble "shouts" (comic style) in the center for a few seconds: "Truco! Sofá de zona!" at game start; a phrase table ready for random phrases and other events (6, 9, 12). |
| P3 | Show cards | After a hand worth 3+ tentos, each player may tap "Mostrar cartas"; shown to everyone for a few seconds (max 5–10 s) before the next hand. Engine + server change. |
| P4 | Dealer by high card | First hand of a series only: deck spread on the table, each player picks one card within 10 s; highest card (truco rank, no manilhas) deals. Computer seats pick automatically; nobody picks = random as today. Engine + server change. **Done**: vs the computer client-side (`features/game/dealer_draw.dart`); online rooms in the engine (GameSession drawDealer, log entries draw/pick/draw-end) for the first game of a room, not slow games. Rematches (and next games of a tournament series) go on: the seat after the last dealer deals. |
| P5 | Partner signals | Manilha signals between partners (wink, raised eyebrows, ...) shown as a quick animation on the player's avatar: obvious to an attentive partner, catchable by attentive opponents. Design to confirm with Marcelo. |
| P6 | Looks (Premium) | Scoreboard themes with truly different layouts (e.g. counting with a 10 card covered by another card), deck themes and felt colors, chosen separately. Replaces G5. |
| P7 | More achievements | Modo professor, Treinar and tournaments (needs Play Games ids; keep the 2000-point budget). |

## Open items

* App name and visual identity.
* Exact cooldown value (default 15 s).
* Final free/premium limits.

## Status (2026-11-09)

* M0–M3 done: adaptive Flutter app, email-code login, single-device and online scorekeeper (rooms with invite links),
  PWA at https://truco.mytrophies.app.
* M4 in testing: groups (public/private, join codes, free limit of 2 owned groups), global and group leaderboards for
  players and duos (Elo + win rate), ranked/friendly toggle and group choice in the online lobby.
* M3 host hand-off done: if the host goes silent for 15 s, the next app user in seat order takes over the room.
* M5 done (tested on two phones in airplane mode with Bluetooth only): rooms between Android phones without internet, results queued for upload.
