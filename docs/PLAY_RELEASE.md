# Play Store release

Package: `app.mytrophies.truco`. Store name: "Truco! Sofá de zona".
Signing and the AAB command are in [PREMIUM.md](PREMIUM.md).

## Firebase Crashlytics

- `app/android/app/google-services.json` (Firebase project, Android app
  `app.mytrophies.truco`) turns on the Google Services and Crashlytics Gradle
  plugins. Without the file the build still works and reporting stays off.
- `lib/data/crash_reporting.dart` initializes Firebase on Android only,
  sends fatal Flutter/platform errors, non-fatal purchase errors, breadcrumb
  logs (routes, failed uploads) and the Supabase user id (never the e-mail).
  Collection is on in release builds only.

## Account deletion

`supabase/migrations/20261109090000_delete_account.sql` adds
`delete_my_account()`. In the app: tap the greeting on the home screen,
"Excluir minha conta". Web instructions: https://truco.mytrophies.app/privacy/#excluir

## App review login

Play's reviewers can't read a code e-mail, so `review@mytrophies.app`
signs in with a password typed in the code field (`AuthRepository.reviewEmail`).
Create it in Supabase: Authentication → Users → Add user → Create new user,
with that e-mail, a 6–8 digit password and "Auto Confirm User" checked.
Give the e-mail and password in Play Console → App access.

## Legal pages

- Privacy: https://truco.mytrophies.app/privacy/ (`app/web/privacy/`)
- Terms: https://truco.mytrophies.app/terms/ (`app/web/terms/`)

## Updates and release notes

- On the home screen, once per session, `StartupChecks` asks Google Play for
  a newer version (in-app update, store installs only) and then shows the
  unseen entries of `lib/features/startup/release_notes.dart`.
- For each release with user-visible changes, add a `ReleaseNote` with the
  next id (Portuguese), and reuse the text in the Play Console release notes.
- Fresh installs don't see old notes; they start from the latest id.
