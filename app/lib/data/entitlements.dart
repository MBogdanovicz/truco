import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'auth_repository.dart';

/// What the signed-in user may use. Premium comes from `profiles.is_premium`,
/// which only the server can change (it will be set by the billing flow).
class Entitlements {
  const Entitlements({required this.isPremium});

  static const free = Entitlements(isPremium: false);

  /// Premium gates are on since the purchase works end to end (2026-11-10).
  /// Setting this to false opens every feature again.
  static const gatesEnabled = true;

  /// Groups a free account may be in, created or joined (enforced by the
  /// server in `create_group` and `join_group`).
  static const freeGroupLimit = 2;

  final bool isPremium;

  bool get _unlocked => isPremium || !gatesEnabled;

  /// Choosing a scoreboard look other than the default felt.
  bool get canChooseScoreboardLook => _unlocked;

  /// Changing the display name as often as wanted (onboarding and one
  /// change are free: see AuthRepository.usedFreeRename).
  bool get canRename => _unlocked;

  /// Creating online truco game rooms (joining stays free). Scorekeeper
  /// rooms are free for everyone.
  bool get canHostOnline => _unlocked;

  /// "Modo professor": tips on the moves against the computer.
  bool get canUseCoach => _unlocked;

  /// Playing without an ad before each game.
  bool get adFree => _unlocked;
}

final entitlementsProvider = FutureProvider<Entitlements>((ref) async {
  final user = ref.watch(currentUserProvider).value;
  final client = ref.watch(supabaseClientProvider);
  if (user == null || user.isGuest || client == null) return Entitlements.free;
  // The last answer is kept on the device: offline (on the road, in airplane
  // mode) the request can hang while the session tries to refresh, and
  // starting a game must never wait for it.
  final key = 'premium.${user.id}';
  bool? cached;
  try {
    cached = await SharedPreferencesAsync().getBool(key);
  } on Object {
    cached = null;
  }
  try {
    final row = await client
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .maybeSingle()
        .timeout(const Duration(seconds: 5));
    final premium = row?['is_premium'] == true;
    try {
      await SharedPreferencesAsync().setBool(key, premium);
    } on Object {
      // Only a cache.
    }
    return Entitlements(isPremium: premium);
  } on Object {
    return Entitlements(isPremium: cached ?? false);
  }
});
