import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences_platform_interface/in_memory_shared_preferences_async.dart';
import 'package:shared_preferences_platform_interface/shared_preferences_async_platform_interface.dart';
import 'package:truco/app.dart';
import 'package:truco/domain/game/ai.dart';
import 'package:truco/domain/game/game_session.dart';
import 'package:truco/domain/game/rules.dart';
import 'package:truco/domain/game/table_view.dart';
import 'package:truco/domain/game/truco_game.dart';
import 'package:truco/domain/scorekeeper/team.dart';
import 'package:truco/features/game/dealer_draw.dart';
import 'package:truco/features/game/game_table.dart';
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
          await tester.ensureVisible(find.text('Começar'));
          await tester.pumpAndSettle();
          await tester.tap(find.text('Começar'));
          // Not pumpAndSettle: the draw has a countdown running.
          for (var i = 0; i < 10; i++) {
            await tester.pump(const Duration(milliseconds: 100));
          }

          // First everyone draws a card to see who deals.
          expect(find.text('Quem dá as cartas?'), findsOneWidget);
          await tester.pump(const Duration(seconds: 2));
          final taken = container.read(dealerDrawProvider)!.picks.values;
          final free = [for (var i = 0; i < 12; i++) i]
              .firstWhere((i) => !taken.contains(i));
          final first = find.byKey(ValueKey('draw-card-$free'));
          await tester.ensureVisible(first);
          await tester.pump();
          await tester.tap(first);
          await tester.pump();
          for (var i = 0; i < 15; i++) {
            await tester.pump(const Duration(milliseconds: 100));
          }
          final dealer = container.read(dealerDrawProvider)?.dealer;
          expect(dealer, isNotNull);
          await tester.pump(const Duration(seconds: 3));
          expect(container.read(dealerDrawProvider), isNull);
          expect(
            container
                .read(localGameControllerProvider.notifier)
                .session!
                .firstDealer,
            dealer,
          );

          final ctrl = container.read(localGameControllerProvider.notifier);
          // The human plays like a medium bot, through the controller.
          final me = TrucoBot(AiLevel.medium, random: Random(1));
          var steps = 0;
          while (container.read(localGameControllerProvider)!.view.phase !=
              GamePhase.gameOver) {
            if (ctrl.waitingForHuman) {
              final g = ctrl.session!.game;
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
          expect(ctrl.session!.game.phase, isNot(GamePhase.gameOver));
          ctrl.quit();
          await tester.pumpAndSettle();
        },
      );
    }
  }

  testWidgets('rules screen shows both manilha options', (tester) async {
    tester.view.physicalSize = const Size(800, 4000);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
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
    expect(find.textContaining('espadilha', skipOffstage: false), findsWidgets);
  });

  testWidgets('partner cards open, big, when we must answer a truco', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1080, 2340);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);
    // Dealer 0: seat 1 (an opponent) leads and calls truco against us.
    final session = GameSession(
      rules: TrucoRules.paulista.copyWith(dealerSeesPartnerThirdCard: false),
      seed: 3,
      firstDealer: 0,
      bots: const [null, AiLevel.easy, AiLevel.easy, AiLevel.easy],
    );
    Widget table() => MaterialApp(
      home: GameTable(
        model: GameTableModel(
          view: session.viewFor(0),
          names: const ['Eu', 'Zeca', 'Bia', 'Tonho'],
          wins: const {Team.a: 0, Team.b: 0},
        ),
        actions: GameTableActions(
          playCard: (_, {covered = false}) {},
          playBlind: (_) {},
          raise: () {},
          accept: () {},
          fold: () {},
          onLeave: () {},
        ),
      ),
    );
    await tester.pumpWidget(table());
    final partner = session.game.handOf(2);
    expect(find.byKey(ValueKey('shown-${partner.first.id}')), findsNothing);
    session.game.apply(const Raise(1));
    await tester.pumpWidget(table());
    for (final c in partner) {
      expect(find.byKey(ValueKey('shown-${c.id}')), findsOneWidget);
    }
    expect(find.text('Aceitar'), findsOneWidget);
  });

  test('frames survive JSON (what the server sends)', () {
    final session = GameSession(
      rules: TrucoRules.paulista,
      seed: 11,
      firstDealer: 2,
      bots: const [null, AiLevel.medium, null, AiLevel.medium],
    );
    final frames = session.advance();
    for (final views in frames.values) {
      for (final v in views) {
        final again = TableView.fromJson(
          jsonDecode(jsonEncode(v.toJson())) as Map<String, Object?>,
        );
        expect(jsonEncode(again.toJson()), jsonEncode(v.toJson()));
      }
    }
    // Replaying the log rebuilds the same game.
    final copy = GameSession(
      rules: TrucoRules.fromJson(TrucoRules.paulista.toJson()),
      seed: 11,
      firstDealer: 2,
      bots: const [null, AiLevel.medium, null, AiLevel.medium],
      log: session.log,
    );
    expect(
      jsonEncode(copy.viewFor(0).toJson()),
      jsonEncode(session.viewFor(0).toJson()),
    );
  });
}
