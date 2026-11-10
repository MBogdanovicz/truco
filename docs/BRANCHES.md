# Branches and releases

Testers are using the app, so work in progress never goes straight to them (decided 2026-11-10).

| Branch | Who uses it | Web | Android |
|--------|-------------|-----|---------|
| `main` | Testers (and later everyone) | https://truco.mytrophies.app | Play Store (closed testing): AAB from the "Play release" workflow, which refuses any other branch |
| `dev`  | Marcelo, before a release | https://truco.mytrophies.app/beta/ (separate PWA "Truco! Beta", not indexed) | Dev app `app.mytrophies.truco.dev` ("Truco β" on the launcher), installed by cable |

* All work is committed to `dev`. Releasing = fast-forward/merge `dev` into `main` when Marcelo says so; then the
  site root updates and an AAB can be built.
* Both sites and both apps use the same Supabase project (the database will be wiped before the public launch).
  SQL for unreleased features must not break the `main` build.
* GitHub Pages hosts one site, so `pwa.yml` builds both branches on every push to either (`.github/scripts/build-pwa.sh`).
  The beta footer shows "Versão beta <commit>".
* Dev APK: `TRUCO_DEV=1 flutter build apk --release --dart-define-from-file=config/supabase.json
  --dart-define=APP_COMMIT="beta $(git rev-parse --short=7 HEAD)"`. It installs next to the Play app, has no
  Crashlytics, and Play Games / purchases don't work in it. Invite links still open the Play app.
