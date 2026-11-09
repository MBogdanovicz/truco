import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../domain/scorekeeper/team.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/keep_screen_on.dart';
import '../../ui/theme/app_theme.dart';
import 'scoreboard_view.dart';
import 'scorekeeper_controller.dart';

/// Single-device game: this phone marks for both teams.
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
      message:
          '${session.state.scoreOf(Team.a)} × ${session.state.scoreOf(Team.b)}'
          '${tally.gamesPlayed > 1 ? '\nSérie: ${tally.winsA} × ${tally.winsB}' : ''}'
          '\n\nVamos de revanche?',
      barrierDismissible: false,
      actions: const [
        AppDialogAction(
          label: 'Revanche',
          value: _EndChoice.rematch,
          isPrimary: true,
        ),
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
        AppDialogAction(
          label: 'Continuar jogando',
          value: false,
          isPrimary: true,
        ),
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
      if (next != null &&
          next.state.isFinished &&
          !(prev?.state.isFinished ?? false)) {
        _onFinished(next);
      }
    });
    final session = ref.watch(scorekeeperControllerProvider);
    if (session == null) {
      return AppScaffold(
        title: 'Marcador',
        body: Center(
          child: AppButton(
            label: 'Nova partida',
            onPressed: () => context.go('/marcador/novo'),
          ),
        ),
      );
    }
    final controller = ref.read(scorekeeperControllerProvider.notifier);
    return KeepScreenOn(
      child: PopScope(
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
          body: ScoreboardView(
            flipTop: _flipTop,
            model: ScoreboardModel(
              teamNames: session.setup.teamNames,
              seats: session.setup.seats,
              state: session.state,
              series: session.series,
              canMark: (_) => true,
              cooldownRemaining: (_) => Duration.zero,
              onAdd: controller.addPoints,
              onUndo: controller.undo,
            ),
          ),
        ),
      ),
    );
  }
}
