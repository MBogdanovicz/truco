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
/// Reads what Play Games already has and only sends what is missing, using
/// the type each achievement has in Play Console (normal or incremental).
class PlayGamesSync {
  bool _signedIn = false;
  bool _running = false;

  static bool get supported =>
      !kIsWeb &&
      defaultTargetPlatform == TargetPlatform.android &&
      _playGamesIds.isNotEmpty;

  /// Every Play Games call gets a deadline: a call that never answers
  /// would otherwise stop the sync for the rest of the session.
  static const _timeout = Duration(seconds: 15);

  Future<bool> _signIn() async {
    _signedIn = await gs.GameAuth.isSignedIn.timeout(_timeout);
    if (!_signedIn) {
      await gs.GameAuth.signIn().timeout(_timeout);
      _signedIn = await gs.GameAuth.isSignedIn.timeout(_timeout);
    }
    return _signedIn;
  }

  Future<void> sync(Map<Achievement, DateTime> unlocked, int rankedGames) async {
    if (!supported || _running) return;
    _running = true;
    try {
      if (!_signedIn && !await _signIn()) return;
      final remote = {
        for (final item
            in await gs.Achievements.loadAchievements(
                  forceRefresh: true,
                  ignoreImages: true,
                ).timeout(_timeout) ??
                const <gs.AchievementItemData>[])
          item.id: item,
      };
      debugPrint(
        'Play Games sync: ${unlocked.length} unlocked, $rankedGames games, '
        '${remote.length} in Play Games',
      );
      for (final MapEntry(key: a, value: id) in _playGamesIds.entries) {
        final item = remote[id];
        if (item == null) {
          debugPrint('Play Games: $id (${a.id}) not found');
          continue;
        }
        if (item.unlocked) continue;
        // Progress the server knows about, in this achievement's steps.
        final needed = _incrementalSteps[a];
        final earned = unlocked.containsKey(a) ||
            (needed != null && rankedGames >= needed);
        if (item.totalSteps > 0) {
          final target = needed != null
              ? rankedGames.clamp(0, item.totalSteps)
              : (earned ? item.totalSteps : 0);
          if (target <= item.completedSteps) continue;
          await _send(
            '${a.id} steps $target/${item.totalSteps}',
            () => gs.Achievements.setSteps(
              achievement: gs.Achievement(androidID: id, steps: target),
            ),
          );
        } else if (earned) {
          await _send(
            '${a.id} unlock',
            () => gs.Achievements.unlock(
              achievement: gs.Achievement(androidID: id),
            ),
          );
        }
      }
    } on Object catch (e) {
      // No Play Games on the device, or the player declined: not an error.
      debugPrint('Play Games sync skipped: $e');
      CrashReporting.log('Play Games sync skipped: $e');
    } finally {
      _running = false;
    }
  }

  /// Sends one update; a failure doesn't stop the others and is retried on
  /// the next sync. Play Games often answers CLIENT_RECONNECT_REQUIRED to
  /// the first call after a pause; checking the sign-in reconnects it.
  Future<void> _send(String what, Future<Object?> Function() call) async {
    for (var attempt = 0; attempt < 3; attempt++) {
      try {
        await call().timeout(_timeout);
        debugPrint('Play Games: $what ok');
        return;
      } on Object catch (e) {
        debugPrint('Play Games: $what failed: $e');
        CrashReporting.log('Play Games $what failed: $e');
        if (!'$e'.contains('RECONNECT')) return;
        try {
          await gs.GameAuth.isSignedIn.timeout(_timeout);
        } on Object catch (e) {
          debugPrint('Play Games: reconnect failed: $e');
          return;
        }
      }
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
