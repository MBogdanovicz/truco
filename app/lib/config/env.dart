/// Build-time configuration, passed with `--dart-define`.
///
/// When Supabase is not configured the app runs in offline-only mode: the
/// single-device scorekeeper works, and features that need an account are
/// hidden.
abstract final class Env {
  static const supabaseUrl = String.fromEnvironment('SUPABASE_URL');
  static const supabasePublishableKey = String.fromEnvironment(
    'SUPABASE_PUBLISHABLE_KEY',
  );

  /// Short commit hash of this build, shown on the home screen so testers
  /// know which version they run. "dev" for local debug builds.
  static const commit = String.fromEnvironment(
    'APP_COMMIT',
    defaultValue: 'dev',
  );

  /// Cloudflare Turnstile site key (public) for the login security check.
  static const turnstileSiteKey = String.fromEnvironment(
    'TURNSTILE_SITE_KEY',
    defaultValue: '0x4AAAAAAF7KaZifE1YxSGM-',
  );

  static bool get hasSupabase =>
      supabaseUrl.isNotEmpty && supabasePublishableKey.isNotEmpty;

  /// Public address of the PWA, used in room invites.
  static const webAppUrl = String.fromEnvironment(
    'WEB_APP_URL',
    defaultValue: 'https://truco.mytrophies.app',
  );

  /// The app on Google Play (during closed testing it only opens for
  /// testers).
  static const androidStoreUrl =
      'https://play.google.com/store/apps/details?id=app.mytrophies.truco';

  /// Invite links open the Android app when installed, otherwise the PWA
  /// (web/sala/ and web/grupo/ forward to the join screens).
  static String roomInviteLink(String code) => '$webAppUrl/sala/?codigo=$code';

  static String groupInviteLink(String code) =>
      '$webAppUrl/grupo/?codigo=$code';
}
