import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:games_services/games_services.dart' as gs;

import '../domain/achievements.dart';
import 'achievements_repository.dart';
import 'crash_reporting.dart';

/// Achievement ids in Google Play Games (Play Console > Play Games Services
/// > Achievements > Get resources). Incremental ones carry their steps.
const _playGamesIds = <Achievement, String>{
  Achievement.firstGame: 'CgkI1Iv_lucZEAIQAQ',
  Achievement.firstWin: 'CgkI1Iv_lucZEAIQAg',
  Achievement.veteran10: 'CgkI1Iv_lucZEAIQAw',
  Achievement.veteran50: 'CgkI1Iv_lucZEAIQBA',
  Achievement.veteran100: 'CgkI1Iv_lucZEAIQBQ',
  Achievement.shutout: 'CgkI1Iv_lucZEAIQBg',
  Achievement.comeback: 'CgkI1Iv_lucZEAIQBw',
  Achievement.streak5: 'CgkI1Iv_lucZEAIQCA',
  Achievement.loyalPartner: 'CgkI1Iv_lucZEAIQCQ',
  Achievement.revenge: 'CgkI1Iv_lucZEAIQCg',
  Achievement.groupGame: 'CgkI1Iv_lucZEAIQCw',
};

const _incrementalSteps = <Achievement, int>{
  Achievement.veteran10: 10,
  Achievement.veteran50: 50,
  Achievement.veteran100: 100,
};

/// Mirrors the server's achievements to Google Play Games on Android.
/// Play Games ignores repeats, so syncing everything again is safe.
class PlayGamesSync {
  bool _signedIn = false;
  final _sent = <String>{};

  static bool get supported =>
      !kIsWeb &&
      defaultTargetPlatform == TargetPlatform.android &&
      _playGamesIds.isNotEmpty;

  Future<void> sync(Map<Achievement, DateTime> unlocked, int rankedGames) async {
    if (!supported) return;
    try {
      if (!_signedIn) {
        _signedIn = await gs.GameAuth.isSignedIn;
        if (!_signedIn) {
          await gs.GameAuth.signIn();
          _signedIn = await gs.GameAuth.isSignedIn;
        }
        if (!_signedIn) return;
      }
      for (final MapEntry(key: a, value: id) in _playGamesIds.entries) {
        final steps = _incrementalSteps[a];
        if (steps != null) {
          final done = rankedGames.clamp(0, steps);
          final key = '$id:$done';
          if (done == 0 || !_sent.add(key)) continue;
          await gs.Achievements.setSteps(
            achievement: gs.Achievement(androidID: id, steps: done),
          );
        } else if (unlocked.containsKey(a) && _sent.add(id)) {
          await gs.Achievements.unlock(
            achievement: gs.Achievement(androidID: id),
          );
        }
      }
    } on Object catch (e) {
      // No Play Games on the device, or the player declined: not an error.
      CrashReporting.log('Play Games sync skipped: $e');
    }
  }
}

final _playGames = PlayGamesSync();

/// Watched by the home screen: syncs on start and whenever the unlocked
/// achievements are reloaded (e.g. after a game).
final playGamesSyncProvider = FutureProvider.autoDispose<void>((ref) async {
  if (!PlayGamesSync.supported) return;
  final unlocked = await ref.watch(unlockedAchievementsProvider.future);
  final games = await ref.watch(rankedGamesCountProvider.future);
  await _playGames.sync(unlocked, games);
});
