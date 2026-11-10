import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/achievements.dart';
import 'auth_repository.dart';

/// The signed-in player's unlocked achievements and when they happened.
final unlockedAchievementsProvider =
    FutureProvider.autoDispose<Map<Achievement, DateTime>>((ref) async {
      final client = ref.watch(supabaseClientProvider);
      final user = ref.watch(currentUserProvider).value;
      if (client == null || user == null || user.isGuest) return const {};
      final rows = await client
          .from('achievements_unlocked')
          .select('achievement, unlocked_at')
          .eq('user_id', user.id);
      return {
        for (final r in rows)
          ?Achievement.byId(r['achievement'] as String):
              DateTime.parse(r['unlocked_at'] as String).toLocal(),
      };
    });
