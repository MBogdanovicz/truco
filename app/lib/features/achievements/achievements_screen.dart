import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/achievements_repository.dart';
import '../../domain/achievements.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/theme/app_theme.dart';

class AchievementsScreen extends ConsumerWidget {
  const AchievementsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final data = ref.watch(unlockedAchievementsProvider);
    return AppScaffold(
      title: 'Conquistas',
      onRefresh: () async => ref.invalidate(unlockedAchievementsProvider),
      children: [
        data.when(
          loading: () => const Padding(
            padding: EdgeInsets.all(32),
            child: Center(child: AppProgress()),
          ),
          error: (e, _) => Padding(
            padding: const EdgeInsets.all(24),
            child: Text(
              'Não foi possível carregar as conquistas.\n$e',
              textAlign: TextAlign.center,
            ),
          ),
          data: (unlocked) => Column(
            children: [
              AppSection(
                header:
                    '${unlocked.length} de ${Achievement.values.length} · '
                    'Marcador e jogo',
                footer:
                    'Contam só as partidas rankeadas, as mesmas do ranking: 4 '
                    'jogadores com conta e as duas duplas confirmando o placar.',
                children: [
                  for (final a in Achievement.values)
                    if (!a.game) _tile(context, a, unlocked),
                ],
              ),
              AppSection(
                header: 'Jogo de truco',
                footer:
                    'Só nas partidas rankeadas do jogo: 4 pessoas com conta, '
                    'sem o computador em nenhum lugar.',
                children: [
                  for (final a in Achievement.values)
                    if (a.game) _tile(context, a, unlocked),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _tile(
    BuildContext context,
    Achievement a,
    Map<Achievement, DateTime> unlocked,
  ) => AppTile(
    leading: Icon(
      context.icon(AppIcon.medal),
      color: unlocked.containsKey(a)
          ? AppColors.gold
          : Theme.of(context).disabledColor,
    ),
    // Secret ones stay a mystery until unlocked.
    title: a.hidden && !unlocked.containsKey(a) ? 'Conquista secreta' : a.title,
    subtitle: switch (unlocked[a]) {
      final at? =>
        '${a.description}\nConquistada em '
            '${at.day.toString().padLeft(2, '0')}/'
            '${at.month.toString().padLeft(2, '0')}/${at.year}',
      null when a.hidden => 'Jogue para descobrir.',
      null => a.description,
    },
    enabled: unlocked.containsKey(a),
  );
}
