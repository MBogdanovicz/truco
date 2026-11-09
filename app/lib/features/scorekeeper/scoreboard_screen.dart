import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../domain/scorekeeper/match_state.dart';
import '../../domain/scorekeeper/team.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/theme/app_theme.dart';
import 'scorekeeper_controller.dart';

/// Live scoreboard. Designed to lie flat on the table between the players:
/// team A's half can be flipped so it reads correctly from the other side.
class ScoreboardScreen extends ConsumerStatefulWidget {
  const ScoreboardScreen({super.key});

  @override
  ConsumerState<ScoreboardScreen> createState() => _ScoreboardState();
}

enum _EndChoice { fix, rematch, end }

class _ScoreboardState extends ConsumerState<ScoreboardScreen> {
  bool _flipTop = false;
  bool _dialogOpen = false;

  Future<void> _onFinished(ScorekeeperSession session) async {
    if (_dialogOpen) return;
    _dialogOpen = true;
    final winner = session.state.winner!;
    final name = session.setup.teamNames[winner]!;
    final tally = session.series.recordWin(winner);
    final choice = await showAppDialog<_EndChoice>(
      context,
      title: '$name venceu!',
      message: '${session.state.scoreOf(Team.a)} × ${session.state.scoreOf(Team.b)}'
          '${tally.gamesPlayed > 1 ? '\nSérie: ${tally.winsA} × ${tally.winsB}' : ''}'
          '\n\nVamos de revanche?',
      barrierDismissible: false,
      actions: const [
        AppDialogAction(label: 'Revanche', value: _EndChoice.rematch, isPrimary: true),
        AppDialogAction(label: 'Encerrar', value: _EndChoice.end),
        AppDialogAction(label: 'Corrigir placar', value: _EndChoice.fix),
      ],
    );
    _dialogOpen = false;
    if (!mounted) return;
    final controller = ref.read(scorekeeperControllerProvider.notifier);
    switch (choice) {
      case _EndChoice.rematch:
        await controller.rematch();
      case _EndChoice.end:
        await controller.end();
        if (mounted) context.go('/');
      case _EndChoice.fix || null:
        controller.undo(winner);
    }
  }

  Future<void> _confirmLeave() async {
    final session = ref.read(scorekeeperControllerProvider);
    final controller = ref.read(scorekeeperControllerProvider.notifier);
    if (session == null || session.state.events.isEmpty) {
      await controller.end();
      if (mounted) context.go('/');
      return;
    }
    final leave = await showAppDialog<bool>(
      context,
      title: 'Sair da partida?',
      message: 'O placar desta partida será descartado.',
      actions: const [
        AppDialogAction(label: 'Continuar jogando', value: false, isPrimary: true),
        AppDialogAction(label: 'Sair', value: true, isDestructive: true),
      ],
    );
    if (leave == true) {
      await controller.end();
      if (mounted) context.go('/');
    }
  }

  @override
  Widget build(BuildContext context) {
    ref.listen(scorekeeperControllerProvider, (prev, next) {
      if (next != null && next.state.isFinished && !(prev?.state.isFinished ?? false)) {
        _onFinished(next);
      }
    });
    final session = ref.watch(scorekeeperControllerProvider);
    if (session == null) {
      return AppScaffold(
        title: 'Marcador',
        body: Center(
          child: AppButton(label: 'Nova partida', onPressed: () => context.go('/marcador/novo')),
        ),
      );
    }
    final controller = ref.read(scorekeeperControllerProvider.notifier);
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) _confirmLeave();
      },
      child: AppScaffold(
        title: 'Marcador',
        backgroundColor: AppColors.feltDark,
        barColor: AppColors.feltDark,
        actions: [
          IconButton(
            tooltip: 'Virar placar de cima',
            color: Colors.white,
            icon: const Icon(Icons.screen_rotation_alt),
            onPressed: () => setState(() => _flipTop = !_flipTop),
          ),
          IconButton(
            tooltip: 'Sair',
            color: Colors.white,
            icon: const Icon(Icons.close),
            onPressed: _confirmLeave,
          ),
        ],
        body: Column(
          children: [
            Expanded(
              child: RotatedBox(
                quarterTurns: _flipTop ? 2 : 0,
                child: _TeamPanel(
                  team: Team.a,
                  session: session,
                  onAdd: (d) => _feedback(controller.addPoints(Team.a, d)),
                  onUndo: () => controller.undo(Team.a),
                ),
              ),
            ),
            _CenterStrip(session: session),
            Expanded(
              child: _TeamPanel(
                team: Team.b,
                session: session,
                onAdd: (d) => _feedback(controller.addPoints(Team.b, d)),
                onUndo: () => controller.undo(Team.b),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _feedback(Object? rejection) {
    if (rejection == null) HapticFeedback.lightImpact();
  }
}

class _CenterStrip extends StatelessWidget {
  const _CenterStrip({required this.session});

  final ScorekeeperSession session;

  @override
  Widget build(BuildContext context) {
    final state = session.state;
    final series = session.series;
    final banner = state.isIronHand
        ? 'Mão de ferro'
        : state.isHandOfEleven
            ? 'Mão de onze'
            : null;
    final textStyle = Theme.of(context).textTheme.labelLarge?.copyWith(color: Colors.white);
    return Container(
      width: double.infinity,
      color: AppColors.felt,
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            series.gamesPlayed == 0
                ? 'Jogo 1'
                : 'Jogo ${series.gamesPlayed + 1} · Série ${series.winsA} × ${series.winsB}',
            style: textStyle,
          ),
          if (banner != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
              decoration: BoxDecoration(color: AppColors.gold, borderRadius: BorderRadius.circular(12)),
              child: Text(banner,
                  style: textStyle?.copyWith(color: Colors.black, fontWeight: FontWeight.bold)),
            ),
        ],
      ),
    );
  }
}

class _TeamPanel extends StatelessWidget {
  const _TeamPanel({
    required this.team,
    required this.session,
    required this.onAdd,
    required this.onUndo,
  });

  final Team team;
  final ScorekeeperSession session;
  final ValueChanged<int> onAdd;
  final VoidCallback onUndo;

  static const _labels = {3: 'Truco', 6: 'Seis', 9: 'Nove', 12: 'Doze'};

  @override
  Widget build(BuildContext context) {
    final MatchState state = session.state;
    final score = state.scoreOf(team);
    final color = team == Team.a ? AppColors.teamA : AppColors.teamB;
    final players = session.setup.seatsOf(team).map((s) => s.name).where((n) => n.isNotEmpty);
    final finished = state.isFinished;
    final canUndo = state.lastActiveScoreEventOf(team) != null;
    final theme = Theme.of(context);
    const onColor = Colors.white;

    return Container(
      color: color,
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
      child: LayoutBuilder(builder: (context, constraints) {
        final compact = constraints.maxHeight < 260;
        return Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(session.setup.teamNames[team]!,
                          style: theme.textTheme.titleLarge?.copyWith(color: onColor, fontWeight: FontWeight.bold)),
                      if (players.isNotEmpty)
                        Text(players.join(' e '),
                            style: theme.textTheme.bodyMedium?.copyWith(color: onColor.withValues(alpha: 0.8))),
                    ],
                  ),
                ),
                IconButton(
                  tooltip: 'Desfazer',
                  color: onColor,
                  disabledColor: onColor.withValues(alpha: 0.3),
                  icon: const Icon(Icons.undo),
                  onPressed: canUndo ? onUndo : null,
                ),
              ],
            ),
            Expanded(
              child: Row(
                children: [
                  Expanded(
                    child: FittedBox(
                      child: Text(
                        '$score',
                        key: ValueKey('score-${team.name}'),
                        style: const TextStyle(
                            color: onColor, fontWeight: FontWeight.w800, fontSize: 120, height: 1),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: _AddButton(
                      key: ValueKey('add-${team.name}-1'),
                      label: '+1',
                      big: true,
                      onPressed: finished ? null : () => onAdd(1),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            _TentoPips(score: score, target: state.rules.targetScore),
            SizedBox(height: compact ? 6 : 10),
            Row(
              children: [
                for (final d in const [3, 6, 9, 12]) ...[
                  Expanded(
                    child: _AddButton(
                      key: ValueKey('add-${team.name}-$d'),
                      label: '+$d',
                      caption: compact ? null : _labels[d],
                      onPressed: finished ? null : () => onAdd(d),
                    ),
                  ),
                  if (d != 12) const SizedBox(width: 8),
                ],
              ],
            ),
          ],
        );
      }),
    );
  }
}

/// Twelve marks, one per tento, filled as the team scores.
class _TentoPips extends StatelessWidget {
  const _TentoPips({required this.score, required this.target});

  final int score;
  final int target;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        for (var i = 0; i < target; i++)
          Expanded(
            child: Container(
              height: 8,
              margin: EdgeInsets.only(right: i == target - 1 ? 0 : 4),
              decoration: BoxDecoration(
                color: i < score ? AppColors.gold : Colors.white.withValues(alpha: 0.25),
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ),
      ],
    );
  }
}

class _AddButton extends StatelessWidget {
  const _AddButton({super.key, required this.label, required this.onPressed, this.caption, this.big = false});

  final String label;
  final String? caption;
  final bool big;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    final enabled = onPressed != null;
    return Material(
      color: Colors.white.withValues(alpha: enabled ? 0.18 : 0.06),
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onPressed,
        child: Padding(
          padding: EdgeInsets.symmetric(vertical: big ? 0 : 10),
          child: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(label,
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: enabled ? 1 : 0.4),
                      fontSize: big ? 44 : 22,
                      fontWeight: FontWeight.bold,
                    )),
                if (caption != null)
                  Text(caption!,
                      style: TextStyle(color: Colors.white.withValues(alpha: enabled ? 0.8 : 0.3), fontSize: 12)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
