# Premium

Same app, free to download. Premium is a one-time in-app purchase (no
subscription) that lives on the account (`profiles.is_premium`), so it also
unlocks the PWA when signing in with the same e-mail.

| Product id (Play) | Price | Who can buy |
|---|---|---|
| `premium` | R$ 7,99 | anyone signed in with e-mail |
| `premium_invite` | R$ 1,99 | an e-mail invited by a full-price buyer (3 invites each) |

Premium unlocks: no ad before games, unlimited groups (free: 2 groups in
total, created or joined), the scoreboard looks, and later detailed stats
and championships.

## How it works

1. The app (Android) buys the product with Google Play Billing
   (`in_app_purchase`, `lib/data/premium_repository.dart`).
2. It sends the purchase token to the `verify-purchase` Edge Function
   (`supabase/functions/verify-purchase`), which asks the Play Developer API
   whether the purchase is real and completed, records it with
   `grant_premium` and consumes it.
3. Only then the app completes the purchase. A purchase that is never
   acknowledged (for example an invite purchase with no pending invite) is
   refunded by Google after 3 days.

The invite product is only offered when `my_premium_invite()` finds a
pending invite for the user's e-mail; `grant_premium` checks it again.

Client-side gates (`lib/data/entitlements.dart`, `gatesEnabled`) are on
since the purchase was tested end to end on 2026-11-10. The group limit
is enforced by the server as soon as the migration runs.

## Setup checklist

1. Run `supabase/migrations/20261109080000_premium.sql` in the SQL editor.
2. Release signing: the upload keystore lives on Marcelo's Mac
   (`~/.truco-signing/`, back it up), described by the git-ignored
   `app/android/key.properties`. Build the Play bundle with:

   ```sh
   cd app && TRUCO_PLAY_SIGNING=1 flutter build appbundle --release \
     --dart-define-from-file=config/supabase.json \
     --dart-define=APP_COMMIT=$(git rev-parse --short=7 HEAD) \
     --build-number=$(git rev-list --count HEAD)
   ```

   Without the Mac: Actions > "Play release" > Run workflow builds the same
   signed AAB (see the secrets listed in `.github/workflows/release.yml`).

   Sideloaded test APKs keep the committed test key, so the test phones can
   still update in place (a phone with the Play version must uninstall it
   first, the signatures differ).
3. Play Console: create the app `app.mytrophies.truco`, upload an AAB to
   the internal testing track, set up the payments profile, and create the
   two one-time products above.
4. Google Cloud: enable the Google Play Android Developer API, create a
   service account with a JSON key, and invite its e-mail in Play Console
   (Users and permissions) with "View financial data" and "Manage orders".
5. Supabase: `supabase functions deploy verify-purchase` and
   `supabase secrets set GOOGLE_SERVICE_ACCOUNT_JSON="$(cat key.json)"`.
6. Add test accounts as license testers in Play Console to buy without
   being charged.
7. Flip `Entitlements.gatesEnabled` to true (done).

Purchases are bought as consumables (`buyConsumable(autoConsume: false)`):
`verify-purchase` records the token on the app account and then consumes it
(falling back to acknowledging). Premium lives on the app account, so the same
Google account can buy again for another e-mail. A token already recorded for
another account answers 409 `token_used` (and is consumed too), and the
Premium screen says to buy again for this e-mail.
