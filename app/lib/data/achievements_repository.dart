import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../domain/achievements.dart';
import 'auth_repository.dart';

/// The full account's id. Token refreshes don't change it, so the lists
/// below (and the Play Games sync that watches them) don't reload.
final _accountIdProvider = Provider<String?>((ref) {
  final user = ref.watch(currentUserProvider).value;
  return user == null || user.isGuest ? null : user.id;
});

/// The signed-in player's unlocked achievements and when they happened.
final unlockedAchievementsProvider =
    FutureProvider.autoDispose<Map<Achievement, DateTime>>((ref) async {
      final client = ref.watch(supabaseClientProvider);
      final userId = ref.watch(_accountIdProvider);
      if (client == null || userId == null) return const {};
      final rows = await client
          .from('achievements_unlocked')
          .select('achievement, unlocked_at')
          .eq('user_id', userId);
      return {
        for (final r in rows)
          ?Achievement.byId(r['achievement'] as String): DateTime.parse(
            r['unlocked_at'] as String,
          ).toLocal(),
      };
    });

/// Confirmed ranked games the signed-in player took part in (the progress
/// of the "Veterano" achievements).
final rankedGamesCountProvider = FutureProvider.autoDispose<int>((ref) async {
  final client = ref.watch(supabaseClientProvider);
  final userId = ref.watch(_accountIdProvider);
  if (client == null || userId == null) return 0;
  final res = await client
      .from('match_players')
      .select('match_id, matches!inner(id)')
      .eq('user_id', userId)
      .eq('matches.is_ranked', true)
      .eq('matches.ratings_applied', true)
      .count(CountOption.exact);
  return res.count;
});
