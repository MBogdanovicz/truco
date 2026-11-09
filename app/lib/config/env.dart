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

  static bool get hasSupabase =>
      supabaseUrl.isNotEmpty && supabasePublishableKey.isNotEmpty;

  /// Public address of the PWA, used in room invites.
  static const webAppUrl = String.fromEnvironment(
    'WEB_APP_URL',
    defaultValue: 'https://truco.mytrophies.app',
  );

  static String roomInviteLink(String code) =>
      '$webAppUrl/#/marcador/entrar?codigo=$code';

  static String groupInviteLink(String code) =>
      '$webAppUrl/#/grupos/entrar?codigo=$code';
}
