import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/auth_repository.dart';
import '../../data/match_history_repository.dart';
import '../../data/tournaments.dart';
import '../../domain/scorekeeper/match_record.dart';
import '../../domain/scorekeeper/team.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/theme/app_theme.dart';
import '../tournaments/tournaments_screen.dart';

/// "Histórico": matches saved on this device, and my finished tournaments.
class HistoryScreen extends ConsumerStatefulWidget {
  const HistoryScreen({super.key});

  @override
  ConsumerState<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends ConsumerState<HistoryScreen> {
  bool _tournaments = false;

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(currentUserProvider).value;
    final hasAccount = user != null && !user.isGuest;
    final showTournaments = _tournaments && hasAccount;
    return AppScaffold(
      title: 'Histórico',
      onRefresh: showTournaments
          ? () async => ref.invalidate(tournamentsProvider)
          : null,
      children: [
        if (hasAccount)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Wrap(
              spacing: 8,
              children: [
                AppToggleChip(
                  label: 'Partidas',
                  selected: !_tournaments,
                  onChanged: (_) => setState(() => _tournaments = false),
                ),
                AppToggleChip(
                  label: 'Torneios',
                  selected: _tournaments,
                  onChanged: (_) => setState(() => _tournaments = true),
                ),
              ],
            ),
          ),
        if (showTournaments) ..._tournamentList() else ..._matches(),
      ],
    );
  }

  List<Widget> _matches() {
    final history = ref.watch(matchHistoryProvider);
    final records = history.value;
    if (records == null || records.isEmpty) {
      return [
        Padding(
          padding: const EdgeInsets.all(24),
          child: Center(
            child: history.hasError
                ? Text(
                    'Não foi possível carregar o histórico.\n${history.error}',
                  )
                : records == null
                ? const AppProgress()
                : const Text('Nenhuma partida ainda.'),
          ),
        ),
      ];
    }
    return [
      AppSection(children: [for (final r in records) _HistoryTile(record: r)]),
    ];
  }

  List<Widget> _tournamentList() => ref
      .watch(tournamentsProvider)
      .when(
        loading: () => const [Center(child: AppProgress())],
        error: (_, _) => const [
          AppSection(
            children: [
              AppTile(title: 'Não foi possível carregar os torneios.'),
            ],
          ),
        ],
        data: (d) {
          final over = d.mine
              .where((t) => t.status == TournamentStatus.finished)
              .toList();
          return [
            AppSection(
              header: 'Meus torneios encerrados',
              children: over.isEmpty
                  ? const [AppTile(title: 'Nenhum torneio encerrado ainda.')]
                  : [for (final t in over) TournamentTile(t)],
            ),
          ];
        },
      );
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
