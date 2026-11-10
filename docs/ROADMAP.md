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
* Phase 2: the truco game (engine, online/local play, ranked/friendly, championships).

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
