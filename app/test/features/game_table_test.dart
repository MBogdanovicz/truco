import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences_platform_interface/in_memory_shared_preferences_async.dart';
import 'package:shared_preferences_platform_interface/shared_preferences_async_platform_interface.dart';
import 'package:truco/app.dart';
import 'package:truco/domain/game/ai.dart';
import 'package:truco/domain/game/truco_game.dart';
import 'package:truco/features/game/local_game_controller.dart';
import 'package:truco/router.dart';
import 'package:truco/ui/adaptive/platform_style.dart';

void main() {
  setUp(() {
    SharedPreferencesAsyncPlatform.instance =
        InMemorySharedPreferencesAsync.empty();
  });

  for (final style in AppPlatformStyle.values) {
    for (final size in const [Size(1080, 2340), Size(720, 1280)]) {
      testWidgets(
        'plays a full game against the computer (${style.name}, $size)',
        (tester) async {
          tester.view.physicalSize = size;
          tester.view.devicePixelRatio = size.width / 360;
          addTearDown(tester.view.reset);

          final container = ProviderContainer();
          addTearDown(container.dispose);
          await tester.pumpWidget(
            UncontrolledProviderScope(
              container: container,
              child: TrucoApp(style: style),
            ),
          );
          await tester.pumpAndSettle();

          container.read(routerProvider).go('/jogo');
          await tester.pumpAndSettle();
          await tester.scrollUntilVisible(
            find.text('Começar'),
            200,
            scrollable: find.byType(Scrollable).first,
          );
          await tester.tap(find.text('Começar'));
          await tester.pumpAndSettle();

          final ctrl = container.read(localGameControllerProvider.notifier);
          // The human plays like a medium bot, through the controller.
          final me = TrucoBot(AiLevel.medium, random: Random(1));
          var steps = 0;
          while (container.read(localGameControllerProvider)!.game.phase !=
              GamePhase.gameOver) {
            if (ctrl.waitingForHuman) {
              final g = container.read(localGameControllerProvider)!.game;
              switch (me.decide(g.viewFor(humanSeat))) {
                case PlayCard(:final card, :final covered):
                  if (g.iron) {
                    ctrl.playBlind(0);
                  } else {
                    ctrl.playCard(card, covered: covered);
                  }
                case Raise():
                  ctrl.raise();
                case Accept():
                  ctrl.accept();
                case Fold():
                  ctrl.fold();
              }
            }
            await tester.pump(const Duration(milliseconds: 900));
            expect(++steps, lessThan(3000));
          }
          await tester.pump();
          expect(find.text('Revanche'), findsOneWidget);
          await tester.tap(find.text('Revanche'));
          await tester.pump();
          expect(
            container.read(localGameControllerProvider)!.game.phase,
            isNot(GamePhase.gameOver),
          );
          ctrl.quit();
          await tester.pumpAndSettle();
        },
      );
    }
  }

  testWidgets('rules screen shows both manilha options', (tester) async {
    final container = ProviderContainer();
    addTearDown(container.dispose);
    await tester.pumpWidget(
      UncontrolledProviderScope(
        container: container,
        child: const TrucoApp(style: AppPlatformStyle.material),
      ),
    );
    await tester.pumpAndSettle();
    container.read(routerProvider).go('/jogo');
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.text('Ver as regras'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.tap(find.text('Ver as regras'));
    await tester.pumpAndSettle();
    expect(find.textContaining('vira'), findsWidgets);
    await tester.tap(find.text('Manilhas fixas'));
    await tester.pumpAndSettle();
    expect(find.textContaining('espadilha'), findsWidgets);
  });
}
