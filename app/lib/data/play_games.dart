import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:games_services/games_services.dart' as gs;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../domain/achievements.dart';
import 'achievements_repository.dart';
import 'auth_repository.dart';
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
///
/// Remembers on the device what Play Games already got, so opening the app
/// calls Play Games only when there is something new (each call can show
/// Google's banner). Only the Play Games player linked to this app account
/// receives them (see link_play_games in the database).
class PlayGamesSync {
  bool _running = false;

  /// What this app run already tried to send, so a retry (and Google's
  /// banners) happens only when something new shows up, not on every
  /// session refresh.
  final _tried = <String>{};

  /// A call that never answers would otherwise block the sync.
  static const _timeout = Duration(seconds: 15);

  static bool get supported =>
      !kIsWeb &&
      defaultTargetPlatform == TargetPlatform.android &&
      _playGamesIds.isNotEmpty;

  /// What Play Games should have: `id` for unlocks, `id:steps` for
  /// progress of the incremental ones.
  static Set<String> _wanted(Map<Achievement, DateTime> unlocked, int games) {
    final wanted = <String>{};
    for (final a in _playGamesIds.keys) {
      final steps = _incrementalSteps[a];
      if (steps != null) {
        if (games > 0) wanted.add('${a.id}:${games.clamp(0, steps)}');
      } else if (unlocked.containsKey(a)) {
        wanted.add(a.id);
      }
    }
    return wanted;
  }

  Future<void> sync({
    required SupabaseClient client,
    required String userId,
    required Map<Achievement, DateTime> unlocked,
    required int rankedGames,
  }) async {
    if (!supported || _running) return;
    final prefs = SharedPreferencesAsync();
    final key = 'play_games.sent.$userId';
    final sent = (await prefs.getStringList(key) ?? const []).toSet();
    final pending = _wanted(unlocked, rankedGames).difference(sent);
    final attempt = '$userId|${(pending.toList()..sort()).join(',')}';
    if (pending.isEmpty || !_tried.add(attempt)) return;
    _running = true;
    try {
      if (!await gs.GameAuth.isSignedIn.timeout(_timeout)) {
        await gs.GameAuth.signIn().timeout(_timeout);
        if (!await gs.GameAuth.isSignedIn.timeout(_timeout)) return;
      }
      final player = await gs.Player.getPlayerID().timeout(_timeout);
      final linked = player != null &&
          await client.rpc<bool>(
                'link_play_games',
                params: {'p_player': player},
              ) ==
              true;
      if (!linked) {
        debugPrint('Play Games: player not linked to this account');
        return;
      }
      final remote = {
        for (final item
            in await gs.Achievements.loadAchievements(
                  forceRefresh: true,
                  ignoreImages: true,
                ).timeout(_timeout) ??
                const <gs.AchievementItemData>[])
          item.id: item,
      };
      for (final entry in pending) {
        final parts = entry.split(':');
        final a = Achievement.byId(parts.first);
        final id = a == null ? null : _playGamesIds[a];
        final item = id == null ? null : remote[id];
        if (a == null || id == null || item == null) continue;
        final target = parts.length > 1 ? int.parse(parts[1]) : null;
        final done = item.unlocked ||
            (item.totalSteps > 0 &&
                item.completedSteps >= (target ?? item.totalSteps));
        if (done || await _send(entry, () async {
          if (item.totalSteps > 0) {
            await gs.Achievements.setSteps(
              achievement: gs.Achievement(
                androidID: id,
                steps: (target ?? item.totalSteps).clamp(0, item.totalSteps),
              ),
            );
          } else if (target == null || target >= _incrementalSteps[a]!) {
            await gs.Achievements.unlock(
              achievement: gs.Achievement(androidID: id),
            );
          }
        })) {
          sent.add(entry);
        }
      }
      await prefs.setStringList(key, sent.toList());
    } on Object catch (e) {
      // No Play Games on the device, or the player declined: not an error.
      debugPrint('Play Games sync skipped: $e');
      CrashReporting.log('Play Games sync skipped: $e');
    } finally {
      _running = false;
    }
  }

  /// One update; Play Games often answers CLIENT_RECONNECT_REQUIRED to the
  /// first call after a pause, and checking the sign-in reconnects it.
  Future<bool> _send(String what, Future<void> Function() call) async {
    for (var attempt = 0; attempt < 3; attempt++) {
      try {
        await call().timeout(_timeout);
        return true;
      } on Object catch (e) {
        debugPrint('Play Games: $what failed: $e');
        CrashReporting.log('Play Games $what failed: $e');
        if (!'$e'.contains('RECONNECT')) return false;
        try {
          await gs.GameAuth.isSignedIn.timeout(_timeout);
        } on Object {
          return false;
        }
      }
    }
    return false;
  }
}

final _playGames = PlayGamesSync();

/// Watched by the home screen: syncs on start and whenever the unlocked
/// achievements are reloaded (e.g. after a game).
final playGamesSyncProvider = FutureProvider.autoDispose<void>((ref) async {
  if (!PlayGamesSync.supported) return;
  final client = ref.watch(supabaseClientProvider);
  // Only the account matters: the session refreshes its token now and then,
  // and that must not start another sync.
  final userId = ref.watch(
    currentUserProvider.select(
      (u) => u.value == null || u.value!.isGuest ? null : u.value!.id,
    ),
  );
  if (client == null || userId == null) return;
  final unlocked = await ref.watch(unlockedAchievementsProvider.future);
  final games = await ref.watch(rankedGamesCountProvider.future);
  await _playGames.sync(
    client: client,
    userId: userId,
    unlocked: unlocked,
    rankedGames: games,
  );
});
