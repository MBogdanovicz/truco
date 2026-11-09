import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/auth_repository.dart';
import '../../data/groups_repository.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/theme/app_theme.dart';

enum LeaderboardSort { elo, winRate }

/// Players or duos of one scope, sortable by Elo or win rate.
class LeaderboardView extends ConsumerStatefulWidget {
  const LeaderboardView({super.key, this.groupId, this.shrinkWrap = false});

  /// Null for the global leaderboard.
  final String? groupId;

  /// For use inside another scroll view.
  final bool shrinkWrap;

  @override
  ConsumerState<LeaderboardView> createState() => _LeaderboardViewState();
}

class _LeaderboardViewState extends ConsumerState<LeaderboardView> {
  var _subject = LeaderboardSubject.player;
  var _sort = LeaderboardSort.elo;
  var _showProvisional = false;

  @override
  Widget build(BuildContext context) {
    final data = ref.watch(leaderboardProvider((widget.groupId, _subject)));
    final me = ref.watch(authRepositoryProvider).currentUser?.id;
    final theme = Theme.of(context);

    final header = Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SegmentedButton<LeaderboardSubject>(
            segments: const [
              ButtonSegment(
                value: LeaderboardSubject.player,
                label: Text('Jogadores'),
                icon: Icon(Icons.person),
              ),
              ButtonSegment(
                value: LeaderboardSubject.duo,
                label: Text('Duplas'),
                icon: Icon(Icons.people),
              ),
            ],
            selected: {_subject},
            onSelectionChanged: (s) => setState(() => _subject = s.first),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 4,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              ChoiceChip(
                label: const Text('Pontuação Elo'),
                selected: _sort == LeaderboardSort.elo,
                onSelected: (_) => setState(() => _sort = LeaderboardSort.elo),
              ),
              ChoiceChip(
                label: const Text('% de vitórias'),
                selected: _sort == LeaderboardSort.winRate,
                onSelected: (_) =>
                    setState(() => _sort = LeaderboardSort.winRate),
              ),
              FilterChip(
                label: const Text('Incluir quem tem menos de 5 jogos'),
                selected: _showProvisional,
                onSelected: (v) => setState(() => _showProvisional = v),
              ),
              ActionChip(
                avatar: const Icon(Icons.info_outline, size: 18),
                label: const Text('Como funciona?'),
                onPressed: () => showEloHelp(context),
              ),
            ],
          ),
        ],
      ),
    );

    final Widget content = data.when(
      loading: () => const Padding(
        padding: EdgeInsets.all(32),
        child: Center(child: AppProgress()),
      ),
      error: (e, _) => Padding(
        padding: const EdgeInsets.all(24),
        child: Text(
          'Não foi possível carregar o ranking.\n$e',
          textAlign: TextAlign.center,
        ),
      ),
      data: (rows) {
        final list = rows
            .where((r) => _showProvisional || !r.isProvisional)
            .toList();
        if (_sort == LeaderboardSort.winRate) {
          list.sort((a, b) {
            final byRate = b.winRate.compareTo(a.winRate);
            return byRate != 0 ? byRate : b.games.compareTo(a.games);
          });
        }
        if (list.isEmpty) {
          return Padding(
            padding: const EdgeInsets.all(24),
            child: Text(
              rows.isEmpty
                  ? 'Nenhuma partida rankeada ainda. Jogue pelo marcador online com 4 jogadores com conta.'
                  : 'Ninguém com 5 jogos ou mais ainda. Ative o filtro acima para ver todos.',
              textAlign: TextAlign.center,
              style: theme.textTheme.bodyMedium,
            ),
          );
        }
        // Names used by more than one player get the masked e-mail.
        final idsByName = <String, Set<String>>{};
        for (final e in list) {
          for (var p = 0; p < e.names.length; p++) {
            (idsByName[e.names[p]] ??= {}).add(e.playerIds[p]);
          }
        }
        final ambiguous = {
          for (final e in idsByName.entries)
            if (e.value.length > 1) e.key,
        };
        return Column(
          children: [
            for (var i = 0; i < list.length; i++)
              _Row(
                position: i + 1,
                entry: list[i],
                isMe: list[i].playerIds.contains(me),
                ambiguous: ambiguous,
              ),
          ],
        );
      },
    );

    final children = [header, const SizedBox(height: 8), content];
    if (widget.shrinkWrap) return Column(children: children);
    return RefreshIndicator.adaptive(
      onRefresh: () =>
          ref.refresh(leaderboardProvider((widget.groupId, _subject)).future),
      child: ListView(children: children),
    );
  }
}

class _Row extends StatelessWidget {
  const _Row({
    required this.position,
    required this.entry,
    required this.isMe,
    this.ambiguous = const {},
  });

  final int position;
  final LeaderboardEntry entry;
  final bool isMe;
  final Set<String> ambiguous;

  String get _title => [
    for (var p = 0; p < entry.names.length; p++)
      ambiguous.contains(entry.names[p]) &&
              p < entry.hints.length &&
              entry.hints[p] != null
          ? '${entry.names[p]} (${entry.hints[p]})'
          : entry.names[p],
  ].join(' e ');

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final medal = switch (position) {
      1 => AppColors.gold,
      2 => Colors.blueGrey,
      3 => Colors.brown,
      _ => null,
    };
    return ListTile(
      tileColor: isMe
          ? theme.colorScheme.primaryContainer.withValues(alpha: 0.4)
          : null,
      leading: CircleAvatar(
        backgroundColor: medal ?? theme.colorScheme.surfaceContainerHighest,
        foregroundColor: medal == null
            ? theme.colorScheme.onSurface
            : Colors.white,
        child: Text('$position'),
      ),
      title: Text(_title, overflow: TextOverflow.ellipsis),
      subtitle: Text(
        '${entry.games} jogos · ${entry.wins}V ${entry.losses}D · '
        '${(entry.winRate * 100).round()}%${entry.isProvisional ? ' · provisório' : ''}',
      ),
      trailing: Text(
        entry.elo.round().toString(),
        style: theme.textTheme.titleMedium,
      ),
    );
  }
}

/// Plain-language explanation of the Elo rating.
Future<void> showEloHelp(BuildContext context) => showAppDialog<void>(
  context,
  title: 'Como funciona a pontuação',
  content: const SingleChildScrollView(
    child: Text(
      'Todo mundo começa com 1000 pontos de Elo. A cada partida rankeada, '
      'quem ganha sobe e quem perde desce.\n\n'
      'Quanto vale cada partida depende da força dos adversários. A força de '
      'uma dupla é a média do Elo dos dois jogadores. Ganhar de quem tem mais '
      'pontos que você vale bastante, e ganhar de quem tem bem menos vale '
      'pouco. Perder para alguém mais forte tira poucos pontos, e perder para '
      'alguém mais fraco tira muitos.\n\n'
      'Nas primeiras 20 partidas, cada jogo mexe mais na pontuação (até 40 '
      'pontos), para achar logo o seu nível. Depois, até 24 pontos por jogo.\n\n'
      'Quem tem menos de 5 jogos aparece como "provisório". Ainda é cedo para '
      'a pontuação dizer muito.\n\n'
      'As duplas têm um Elo próprio, que conta só as partidas em que os dois '
      'jogaram juntos. O ranking do grupo conta só as partidas daquele grupo.',
    ),
  ),
  actions: const [
    AppDialogAction(label: 'Entendi', value: null, isPrimary: true),
  ],
);
