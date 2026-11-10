import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/ads.dart';
import '../../domain/game/truco_game.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import 'game_table.dart';
import 'local_game_controller.dart';

/// The card table for a game against the computer.
class GameTableScreen extends ConsumerWidget {
  const GameTableScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final model = ref.watch(localGameControllerProvider);
    final ctrl = ref.read(localGameControllerProvider.notifier);
    if (model == null) {
      return AppScaffold(
        title: 'Jogar truco',
        body: Center(
          child: AppButton(
            label: 'Novo jogo',
            onPressed: () => context.go('/jogo'),
          ),
        ),
      );
    }
    void leave() {
      ctrl.quit();
      context.go('/');
    }

    Future<void> confirmLeave() async {
      if (model.view.phase == GamePhase.gameOver) return leave();
      if (await confirmLeaveGame(context) && context.mounted) leave();
    }

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) confirmLeave();
      },
      child: GameTable(
        model: model,
        actions: GameTableActions(
          playCard: ctrl.playCard,
          playBlind: ctrl.playBlind,
          raise: ctrl.raise,
          accept: ctrl.accept,
          fold: ctrl.fold,
          onLeave: confirmLeave,
          onRematch: () async {
            await Ads.beforeGame(ref);
            ctrl.rematch();
          },
        ),
      ),
    );
  }
}
