import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/match_history_repository.dart';
import '../../domain/scorekeeper/match_record.dart';
import '../../domain/scorekeeper/team.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/theme/app_theme.dart';

class HistoryScreen extends ConsumerWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final history = ref.watch(matchHistoryProvider);
    final records = history.value;
    if (records == null || records.isEmpty) {
      return AppScaffold(
        title: 'Histórico',
        body: Center(
          child: history.hasError
              ? Text('Não foi possível carregar o histórico.\n${history.error}')
              : records == null
              ? const AppProgress()
              : const Text('Nenhuma partida ainda.'),
        ),
      );
    }
    return AppScaffold(
      title: 'Histórico',
      children: [
        AppSection(
          children: [for (final r in records) _HistoryTile(record: r)],
        ),
      ],
    );
  }
}

class _HistoryTile extends StatelessWidget {
  const _HistoryTile({required this.record});

  final MatchRecord record;

  String _date(DateTime d) {
    final l = d.toLocal();
    String two(int v) => v.toString().padLeft(2, '0');
    return '${two(l.day)}/${two(l.month)}/${l.year} ${two(l.hour)}:${two(l.minute)}';
  }

  @override
  Widget build(BuildContext context) {
    final state = record.state;
    final winner = record.winner;
    String side(Team t) {
      final players = record
          .seatsOf(t)
          .map((s) => s.name)
          .where((n) => n.isNotEmpty);
      return players.isEmpty
          ? record.teamNames[t]!
          : '${record.teamNames[t]} (${players.join(', ')})';
    }

    final series = record.series;
    return AppTile(
      leading: Icon(
        context.icon(AppIcon.trophy),
        color: winner == Team.a ? AppColors.teamA : AppColors.teamB,
      ),
      title:
          '${record.teamNames[Team.a]} ${state.scoreOf(Team.a)} × '
          '${state.scoreOf(Team.b)} ${record.teamNames[Team.b]}',
      subtitle: [
        '${side(Team.a)} vs ${side(Team.b)}',
        [
          _date(record.finishedAt),
          if (record.ranked != null)
            record.countsForRanking
                ? 'Rankeada${record.groupName == null ? '' : ' · ${record.groupName}'}'
                : 'Amistosa',
        ].join(' · '),
        if (series.gamesPlayed > 1) 'Série ${series.winsA} × ${series.winsB}',
      ].join('\n'),
    );
  }
}
