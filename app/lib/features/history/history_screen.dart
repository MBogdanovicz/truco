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
    return AppScaffold(
      title: 'Histórico',
      body: history.when(
        loading: () => const Center(child: AppProgress()),
        error: (e, _) => Center(child: Text('Não foi possível carregar o histórico.\n$e')),
        data: (records) => records.isEmpty
            ? const Center(child: Text('Nenhuma partida ainda.'))
            : ListView.separated(
                itemCount: records.length,
                separatorBuilder: (_, _) => const Divider(height: 1),
                itemBuilder: (_, i) => _HistoryTile(record: records[i]),
              ),
      ),
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
      final players = record.seatsOf(t).map((s) => s.name).where((n) => n.isNotEmpty);
      return players.isEmpty ? record.teamNames[t]! : '${record.teamNames[t]} (${players.join(', ')})';
    }

    final series = record.series;
    return ListTile(
      leading: Icon(Icons.emoji_events,
          color: winner == Team.a ? AppColors.teamA : AppColors.teamB),
      title: Text('${record.teamNames[Team.a]} ${state.scoreOf(Team.a)} × '
          '${state.scoreOf(Team.b)} ${record.teamNames[Team.b]}'),
      subtitle: Text([
        '${side(Team.a)} vs ${side(Team.b)}',
        _date(record.finishedAt),
        if (series.gamesPlayed > 1) 'Série ${series.winsA} × ${series.winsB}',
      ].join('\n')),
      isThreeLine: true,
    );
  }
}
