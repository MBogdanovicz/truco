# Roadmap

See [ARCHITECTURE.md](ARCHITECTURE.md) for the design behind each milestone.

## Phase 1 – Scorekeeper ("marcador")

| # | Milestone | Scope |
|---|-----------|-------|
| M0 | Foundations | Flutter project (Android + Web/PWA), adaptive UI layer, theme, routing, CI (analyze/test/build), Supabase project + keep-alive workflow. |
| M1 | Accounts | Email OTP login, display name onboarding, profile screen. |
| M2 | Scorekeeper – single device | Domain event log, scoring rules, scoreboard UI, undo, mão de onze/ferro cues, guests, rematch/series, local history. |
| M3 | Scorekeeper – online | Lobby with code/QR, team selection, Supabase Realtime transport, host authority, cooldown, host hand-off, `finish_match` RPC. |
| M4 | Groups & ranking | Groups (public/private, join code/link), global + group leaderboards for players and duos, stats + Elo. |
| M5 | Scorekeeper – nearby (Android) | Nearby Connections transport, offline result queue and upload. |
| M6 | Polish & release | App name/icon, Play Store internal testing track, PWA install prompt, basic analytics. |

M2 is built first because it is useful on its own and exercises the domain layer that every transport reuses.

## Later

* Premium tier: Play Billing, entitlements, limits, AdMob interstitials.
* PWA payments.
* Phase 2: the truco game (engine, online/local play, ranked/friendly, championships).

## Open items

* App name and visual identity.
* Exact cooldown value (default 15 s).
* Final free/premium limits.
