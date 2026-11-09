# Truco

Android app and PWA for Brazilian truco: a live scorekeeper ("marcador") for physical games, player/duo rankings,
groups, and later a full online/local truco game.

* [Architecture](docs/ARCHITECTURE.md)
* [Roadmap](docs/ROADMAP.md)

The app UI is in Brazilian Portuguese; documentation and code comments are in English.

## Development

The Flutter app lives in [`app/`](app). Database migrations live in [`supabase/migrations`](supabase/migrations).

```bash
cd app
flutter pub get
flutter test
flutter run                                   # Android device/emulator
flutter run -d chrome --dart-define=APP_STYLE=cupertino   # PWA look
```

Without Supabase settings the app runs offline-only (single-device scorekeeper, local history).
To enable login, pass the project settings at build time:

```bash
flutter run --dart-define=SUPABASE_URL=https://<project>.supabase.co \
            --dart-define=SUPABASE_PUBLISHABLE_KEY=<publishable key>
```

Release web builds use `--no-web-resources-cdn` so the PWA works offline.

### Supabase setup

1. Apply the migrations in `supabase/migrations` (Supabase CLI `supabase db push` or the SQL editor).
2. Auth → Providers → Email: enable email sign-in. In the "Magic Link" email template, include `{{ .Token }}`
   so users receive the 6-digit code.
3. Add `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` as GitHub repository secrets for the keep-alive workflow.
