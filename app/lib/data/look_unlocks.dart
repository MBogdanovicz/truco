import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../domain/achievements.dart';
import '../features/game/table_look.dart';
import '../features/scorekeeper/scoreboard_skin.dart';
import 'achievements_repository.dart';
import 'auth_repository.dart';
import 'entitlements.dart';

/// A few looks anyone can earn with an achievement, one of each kind (the
/// rest stays Premium).
abstract final class LookUnlocks {
  static const felt = (FeltColor.azul, Achievement.gameWins10);
  static const back = (CardBackStyle.preto, Achievement.tourChampion);
  static const skin = (ScoreboardSkin.matches, Achievement.veteran10);

  /// What [a] unlocks, for the achievements list ("Libera o feltro azul").
  static String? rewardOf(Achievement a) => switch (a) {
    _ when a == felt.$2 => 'Libera o feltro azul da mesa',
    _ when a == back.$2 => 'Libera o verso preto e dourado das cartas',
    _ when a == skin.$2 => 'Libera o placar de palitos de fósforo',
    _ => null,
  };

  /// The achievement that unlocks [item], if any.
  static Achievement? achievementFor(Object? item) => switch (item) {
    _ when item == felt.$1 => felt.$2,
    _ when item == back.$1 => back.$2,
    _ when item == skin.$1 => skin.$2,
    _ => null,
  };
}

/// What the player may use: everything with Premium; otherwise the
/// standard looks plus the ones earned with achievements.
class LookAccess {
  const LookAccess({required this.premium, required this.earned});

  static const none = LookAccess(premium: false, earned: {});

  final bool premium;
  final Set<Achievement> earned;

  bool _ok(Object item, Object standard) {
    if (premium || item == standard) return true;
    final a = LookUnlocks.achievementFor(item);
    return a != null && earned.contains(a);
  }

  bool felt(FeltColor f) => _ok(f, FeltColor.verde);
  bool back(CardBackStyle b) => _ok(b, CardBackStyle.vermelho);
  bool face(CardFaceStyle f) => _ok(f, CardFaceStyle.classico);
  bool skin(ScoreboardSkin s) => _ok(s, ScoreboardSkin.felt);

  bool table(TableLook l) => felt(l.felt) && back(l.back) && face(l.face);

  /// [look] with every part the player may not use set to the standard.
  TableLook allowed(TableLook look) => TableLook(
    felt: felt(look.felt) ? look.felt : TableLook.standard.felt,
    back: back(look.back) ? look.back : TableLook.standard.back,
    face: face(look.face) ? look.face : TableLook.standard.face,
  );
}

/// The unlocking achievements the player has, remembered on the device so
/// an earned look stays offline.
final lookAccessProvider = Provider<LookAccess>((ref) {
  final premium =
      ref.watch(entitlementsProvider).value?.canChooseScoreboardLook ?? false;
  if (premium) return const LookAccess(premium: true, earned: {});
  return LookAccess(premium: false, earned: ref.watch(_earnedProvider));
});

const _unlocking = [LookUnlocks.felt, LookUnlocks.back, LookUnlocks.skin];

final _earnedProvider = NotifierProvider<_EarnedNotifier, Set<Achievement>>(
  _EarnedNotifier.new,
);

class _EarnedNotifier extends Notifier<Set<Achievement>> {
  @override
  Set<Achievement> build() {
    final user = ref.watch(currentUserProvider).value;
    final id = user == null || user.isGuest ? null : user.id;
    if (id == null) return const {};
    final key = 'look.unlocks.$id';
    _loadCached(key);
    ref.listen(unlockedAchievementsProvider, (_, next) {
      final all = next.value;
      if (all == null) return;
      final earned = {
        for (final (_, a) in _unlocking)
          if (all.containsKey(a)) a,
      };
      state = earned;
      _save(key, earned);
    }, fireImmediately: true);
    return const {};
  }

  Future<void> _loadCached(String key) async {
    try {
      final ids = await SharedPreferencesAsync().getStringList(key);
      if (ids == null || state.isNotEmpty) return;
      state = {for (final id in ids) ?Achievement.byId(id)};
    } on Object {
      // Only a cache.
    }
  }

  Future<void> _save(String key, Set<Achievement> earned) async {
    try {
      await SharedPreferencesAsync().setStringList(key, [
        for (final a in earned) a.id,
      ]);
    } on Object {
      // Only a cache.
    }
  }
}
