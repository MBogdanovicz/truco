import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'auth_repository.dart';

/// What the signed-in user may use. Premium comes from `profiles.is_premium`,
/// which only the server can change (it will be set by the billing flow).
class Entitlements {
  const Entitlements({required this.isPremium});

  static const free = Entitlements(isPremium: false);

  /// Premium gates only apply once the paid tier can actually be bought;
  /// until then every feature stays open (and testable).
  static const gatesEnabled = false;

  /// Groups a free account may be in, created or joined (enforced by the
  /// server in `create_group` and `join_group`).
  static const freeGroupLimit = 2;

  final bool isPremium;

  bool get _unlocked => isPremium || !gatesEnabled;

  /// Choosing a scoreboard look other than the default felt.
  bool get canChooseScoreboardLook => _unlocked;

  /// Changing the display name after the first one (onboarding is free).
  bool get canRename => _unlocked;

  /// Creating "cada um no seu celular" online rooms (joining stays free).
  bool get canHostOnline => _unlocked;

  /// Playing without an ad before each game.
  bool get adFree => _unlocked;
}

final entitlementsProvider = FutureProvider<Entitlements>((ref) async {
  final user = ref.watch(currentUserProvider).value;
  final client = ref.watch(supabaseClientProvider);
  if (user == null || user.isGuest || client == null) return Entitlements.free;
  try {
    final row = await client
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .maybeSingle();
    return Entitlements(isPremium: row?['is_premium'] == true);
  } on Object {
    return Entitlements.free;
  }
});
