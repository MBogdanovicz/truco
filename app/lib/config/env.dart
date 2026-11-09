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
