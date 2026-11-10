import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/auth_repository.dart';
import '../../data/groups_repository.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/theme/app_theme.dart';

enum LeaderboardSort { elo, winRate, shutouts }

/// Players or duos of one scope, sortable by Elo or win rate.
class LeaderboardView extends ConsumerStatefulWidget {
  const LeaderboardView({super.key, this.groupId});

  /// Null for the global leaderboard. Lives inside the page's scroll view.
  final String? groupId;

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

    final header = Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        AppSegmented<LeaderboardSubject>(
          segments: const {
            LeaderboardSubject.player: 'Jogadores',
            LeaderboardSubject.duo: 'Duplas',
          },
          value: _subject,
          onChanged: (v) => setState(() => _subject = v),
        ),
        const SizedBox(height: 10),
        AppSegmented<LeaderboardSort>(
          segments: const {
            LeaderboardSort.elo: 'Elo',
            LeaderboardSort.winRate: '% vitórias',
            LeaderboardSort.shutouts: '12 x 0',
          },
          value: _sort,
          onChanged: (v) => setState(() => _sort = v),
        ),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 4,
          alignment: WrapAlignment.spaceBetween,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            AppToggleChip(
              label: 'Incluir quem tem menos de 5 jogos',
              selected: _showProvisional,
              onChanged: (v) => setState(() => _showProvisional = v),
            ),
            AppTextButton(
              label: 'Como funciona?',
              onPressed: () => showEloHelp(context),
            ),
          ],
        ),
      ],
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
        switch (_sort) {
          case LeaderboardSort.elo:
            break;
          case LeaderboardSort.winRate:
            list.sort((a, b) {
              final byRate = b.winRate.compareTo(a.winRate);
              return byRate != 0 ? byRate : b.games.compareTo(a.games);
            });
          case LeaderboardSort.shutouts:
            // Most given first; among equals, fewest taken.
            list.sort((a, b) {
              final byFor = b.shutoutsFor.compareTo(a.shutoutsFor);
              return byFor != 0
                  ? byFor
                  : a.shutoutsAgainst.compareTo(b.shutoutsAgainst);
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
        final wide = MediaQuery.sizeOf(context).width >= AppBreakpoints.medium;
        return AppSection(
          footer: wide
              ? 'J jogos · V vitórias · D derrotas · SP saldo de pontos · '
                    '% aproveitamento · 12x0 aplicados/tomados'
              : 'J jogos · V vitórias · D derrotas · SP saldo de pontos',
          children: [
            _TableRow.header(wide: wide),
            for (var i = 0; i < list.length; i++)
              _TableRow(
                position: i + 1,
                entry: list[i],
                isMe: list[i].playerIds.contains(me),
                ambiguous: ambiguous,
                wide: wide,
              ),
          ],
        );
      },
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [header, const SizedBox(height: 12), content],
    );
  }
}

/// One line of the standings table, like a football league table.
class _TableRow extends StatelessWidget {
  const _TableRow({
    required this.position,
    required this.entry,
    required this.isMe,
    required this.wide,
    this.ambiguous = const {},
  });

  const _TableRow.header({required this.wide})
    : position = 0,
      entry = null,
      isMe = false,
      ambiguous = const {};

  final int position;
  final LeaderboardEntry? entry;
  final bool isMe;
  final bool wide;
  final Set<String> ambiguous;

  static const _pos = 30.0;
  static const _num = 30.0;
  static const _saldo = 38.0;
  static const _elo = 46.0;
  static const _rate = 42.0;
  static const _shutouts = 44.0;

  String _title(LeaderboardEntry e) => [
    for (var p = 0; p < e.names.length; p++)
      ambiguous.contains(e.names[p]) && p < e.hints.length && e.hints[p] != null
          ? '${e.names[p]} (${e.hints[p]})'
          : e.names[p],
  ].join(' e ');

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final e = entry;
    final numbers = theme.textTheme.bodyMedium?.copyWith(
      fontFeatures: const [FontFeature.tabularFigures()],
    );
    final head = theme.textTheme.labelMedium?.copyWith(
      color: theme.colorScheme.onSurfaceVariant,
      fontWeight: FontWeight.w600,
    );

    Widget cell(String text, double width, {TextStyle? style}) => SizedBox(
      width: width,
      child: Text(
        text,
        textAlign: TextAlign.center,
        style: style ?? (e == null ? head : numbers),
      ),
    );

    final Widget pos;
    final Widget name;
    if (e == null) {
      pos = cell('#', _pos);
      name = Text('Nome', style: head);
    } else {
      final medal = switch (position) {
        1 => AppColors.gold,
        2 => Colors.blueGrey,
        3 => Colors.brown,
        _ => null,
      };
      pos = SizedBox(
        width: _pos,
        child: Center(
          child: CircleAvatar(
            radius: 12,
            backgroundColor:
                medal ?? theme.colorScheme.surfaceContainerHighest,
            foregroundColor: medal == null
                ? theme.colorScheme.onSurface
                : Colors.white,
            child: Text('$position', style: const TextStyle(fontSize: 12)),
          ),
        ),
      );
      final small = theme.textTheme.bodySmall?.copyWith(
        color: theme.colorScheme.onSurfaceVariant,
      );
      name = Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            _title(e),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: isMe ? FontWeight.w700 : FontWeight.w500,
            ),
          ),
          if (e.isProvisional) Text('provisório', style: small),
          if (!wide && (e.shutoutsFor > 0 || e.shutoutsAgainst > 0))
            Text(
              '12x0: aplicou ${e.shutoutsFor} · tomou ${e.shutoutsAgainst}',
              style: small,
            ),
        ],
      );
    }

    final saldo = e == null ? 0 : e.pointsFor - e.pointsAgainst;
    final row = Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
      child: Row(
        children: [
          pos,
          const SizedBox(width: 6),
          Expanded(child: name),
          cell(e == null ? 'J' : '${e.games}', _num),
          cell(e == null ? 'V' : '${e.wins}', _num),
          cell(e == null ? 'D' : '${e.losses}', _num),
          cell(e == null ? 'SP' : (saldo > 0 ? '+$saldo' : '$saldo'), _saldo),
          if (wide) ...[
            cell(e == null ? '%' : '${(e.winRate * 100).round()}', _rate),
            cell(
              e == null ? '12x0' : '${e.shutoutsFor}/${e.shutoutsAgainst}',
              _shutouts,
            ),
          ],
          cell(
            e == null ? 'Elo' : e.elo.round().toString(),
            _elo,
            style: e == null
                ? head
                : numbers?.copyWith(fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
    if (!isMe) return row;
    return ColoredBox(
      color: theme.colorScheme.primaryContainer.withValues(alpha: 0.5),
      child: row,
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
      'jogaram juntos. O ranking do grupo conta só as partidas daquele grupo.\n\n'
      '12 x 0: pela tradição, quem perde sem marcar nenhum ponto passa por '
      'baixo da mesa. O ranking mostra quantos 12 x 0 cada um aplicou e tomou.',
    ),
  ),
  actions: const [
    AppDialogAction(label: 'Entendi', value: null, isPrimary: true),
  ],
);
