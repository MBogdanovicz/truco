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
  Achievement.gameFirstWin: 'CgkI1Iv_lucZEAIQDA',
  Achievement.gameWins10: 'CgkI1Iv_lucZEAIQDQ',
  Achievement.gameRanWon: 'CgkI1Iv_lucZEAIQDg',
  Achievement.gameIronHand: 'CgkI1Iv_lucZEAIQDw',
  Achievement.gameAceRiver: 'CgkI1Iv_lucZEAIQEA',
  Achievement.gameCasalMaior: 'CgkI1Iv_lucZEAIQEQ',
  Achievement.gameCasalMenor: 'CgkI1Iv_lucZEAIQEg',
  Achievement.gameCasalPreto: 'CgkI1Iv_lucZEAIQEw',
  Achievement.gameCasalVermelho: 'CgkI1Iv_lucZEAIQFA',
  Achievement.gameTruco12: 'CgkI1Iv_lucZEAIQFQ',
  Achievement.gameComadre: 'CgkI1Iv_lucZEAIQFg',
  Achievement.game666: 'CgkI1Iv_lucZEAIQFw',
  Achievement.gameSeisBurro: 'CgkI1Iv_lucZEAIQGA',
  Achievement.gameShutout: 'CgkI1Iv_lucZEAIQGQ',
};

const _incrementalSteps = <Achievement, int>{
  Achievement.veteran10: 10,
  Achievement.veteran50: 50,
  Achievement.veteran100: 100,
  Achievement.gameWins10: 10,
  Achievement.tourChampion3: 3,
};

/// Incremental ones that count game wins (the others count ranked games,
/// except "Tricampeão", which counts tournament titles).
const _countsGameWins = {Achievement.gameWins10};

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
  static Set<String> _wanted(
    Map<Achievement, DateTime> unlocked,
    int games,
    int gameWins,
    int titles,
  ) {
    final wanted = <String>{};
    for (final a in _playGamesIds.keys) {
      final steps = _incrementalSteps[a];
      if (steps != null) {
        final n = a == Achievement.tourChampion3
            ? titles
            : _countsGameWins.contains(a)
            ? gameWins
            : games;
        if (n > 0) wanted.add('${a.id}:${n.clamp(0, steps)}');
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
    required int gameWins,
    required int titles,
  }) async {
    if (!supported || _running) return;
    final prefs = SharedPreferencesAsync();
    final key = 'play_games.sent.$userId';
    final sent = (await prefs.getStringList(key) ?? const []).toSet();
    final pending = _wanted(
      unlocked,
      rankedGames,
      gameWins,
      titles,
    ).difference(sent);
    final attempt = '$userId|${(pending.toList()..sort()).join(',')}';
    if (pending.isEmpty || !_tried.add(attempt)) return;
    _running = true;
    try {
      if (!await gs.GameAuth.isSignedIn.timeout(_timeout)) {
        await gs.GameAuth.signIn().timeout(_timeout);
        if (!await gs.GameAuth.isSignedIn.timeout(_timeout)) return;
      }
      final player = await gs.Player.getPlayerID().timeout(_timeout);
      final linked =
          player != null &&
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
        final done =
            item.unlocked ||
            (item.totalSteps > 0 &&
                item.completedSteps >= (target ?? item.totalSteps));
        if (done ||
            await _send(entry, () async {
              if (item.totalSteps > 0) {
                await gs.Achievements.setSteps(
                  achievement: gs.Achievement(
                    androidID: id,
                    steps: (target ?? item.totalSteps).clamp(
                      0,
                      item.totalSteps,
                    ),
                  ),
                );
              } else if (target == null || target >= _incrementalSteps[a]!) {
                await gs.Achievements.unlock(
                  achievement: gs.Achievement(androidID: id),
                );
              }
            })) {
          sent.add(entry);
          // Saved at once: a later failure or the app closing must not
          // send (and show) this one again.
          await prefs.setStringList(key, sent.toList());
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

  /// One update. Play Games answers CLIENT_RECONNECT_REQUIRED to most calls
  /// after a pause but still applies them (the banner shows up), so that
  /// answer counts as sent; retrying only showed the banner again.
  Future<bool> _send(String what, Future<void> Function() call) async {
    try {
      await call().timeout(_timeout);
      return true;
    } on Object catch (e) {
      debugPrint('Play Games: $what failed: $e');
      CrashReporting.log('Play Games $what failed: $e');
      return '$e'.contains('RECONNECT');
    }
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
  final gameWins = await ref.watch(rankedGameWinsCountProvider.future);
  final titles = await ref.watch(tournamentTitlesCountProvider.future);
  await _playGames.sync(
    client: client,
    userId: userId,
    unlocked: unlocked,
    rankedGames: games,
    gameWins: gameWins,
    titles: titles,
  );
});
