import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:truco/domain/game/training.dart';
import 'package:truco/features/game/training_screen.dart';

void main() {
  testWidgets('plays every scenario at the table', (tester) async {
    SharedPreferences.setMockInitialValues({});
    tester.view.physicalSize = const Size(400, 860);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    for (final level in TrainingLevel.values) {
      final list = trainingAt(level);
      await tester.pumpWidget(
        MaterialApp(home: TrainingTableScreen(level: level, index: 0)),
      );
      await tester.pumpAndSettle();
      for (var i = 0; i < list.length; i++) {
        final s = list[i];
        // The situation opens first.
        expect(find.text(s.title), findsOneWidget, reason: s.id);
        await tester.tap(find.text('Ver a mesa'));
        await tester.pumpAndSettle();
        if (s.answer.startsWith('cover:')) {
          await tester.tap(find.text('Jogar coberta'));
          await tester.pump();
        }
        await tester.tap(_moveFinder(s, s.answer));
        await tester.pumpAndSettle();
        expect(find.text('Isso mesmo! 👏'), findsOneWidget, reason: s.id);
        if (i == list.length - 1) {
          expect(find.text('Voltar à lista'), findsOneWidget);
          break;
        }
        await tester.tap(find.text('Próxima'));
        await tester.pumpAndSettle();
      }
      await tester.pumpWidget(const SizedBox());
    }
    final prefs = await SharedPreferences.getInstance();
    expect(
      prefs.getStringList('training.done.v1')!.length,
      trainingScenarios.length,
    );
    expect(tester.takeException(), isNull);
  });

  testWidgets('a wrong move shows the best one and can be retried', (
    tester,
  ) async {
    SharedPreferences.setMockInitialValues({});
    tester.view.physicalSize = const Size(400, 860);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    final list = trainingAt(TrainingLevel.advanced);
    final i = list.indexWhere((s) => s.id == 'hold_the_gato');
    await tester.pumpWidget(
      MaterialApp(
        home: TrainingTableScreen(level: TrainingLevel.advanced, index: i),
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.text('Ver a mesa'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Truco!'));
    await tester.pumpAndSettle();
    expect(find.text('Não foi dessa vez 💡'), findsOneWidget);
    expect(find.text('Melhor jogada: jogar o 2♠ coberto.'), findsOneWidget);
    await tester.tap(find.text('Tentar de novo'));
    await tester.pumpAndSettle();
    expect(find.text(list[i].title), findsOneWidget);
  });

  testWidgets('the list groups the levels', (tester) async {
    SharedPreferences.setMockInitialValues({});
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: TrainingScreen())),
    );
    await tester.pumpAndSettle();
    expect(find.textContaining('Básico · 0 de'), findsOneWidget);
    // Without Premium the other levels are marked.
    await tester.scrollUntilVisible(
      find.textContaining('Intermediário · Premium'),
      300,
      scrollable: find.byType(Scrollable).first,
    );
    expect(find.textContaining('Intermediário · Premium'), findsOneWidget);
  });
}

Finder _moveFinder(TrainingScenario s, TrainingMove move) {
  if (move.contains(':')) {
    return find.byKey(ValueKey('my-card-${move.split(':').last}'));
  }
  final level = s.raiseTo;
  return find.text(switch (move) {
    'accept' when s.isElevenDecision => 'Jogar',
    'accept' => 'Aceitar',
    'fold' => 'Correr',
    _ when level != null => '${TrainingScenario.rules.raiseName(level)}!',
    _ => 'Truco!',
  });
}
