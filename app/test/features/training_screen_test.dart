import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:truco/domain/game/training.dart';
import 'package:truco/features/game/training_screen.dart';

void main() {
  testWidgets('answers a scenario and shows the explanation', (tester) async {
    SharedPreferences.setMockInitialValues({});
    tester.view.physicalSize = const Size(400, 900);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(const MaterialApp(home: TrainingScreen()));
    await tester.pumpAndSettle();
    final s = trainingScenarios.first;
    await tester.tap(find.text(s.title));
    await tester.pumpAndSettle();
    expect(find.text(s.question), findsOneWidget);
    await tester.tap(find.text(s.options[s.answer]));
    await tester.pumpAndSettle();
    expect(find.text('Isso mesmo!'), findsOneWidget);
    // Every scenario lays out without errors.
    for (var i = 1; i < trainingScenarios.length; i++) {
      await tester.scrollUntilVisible(find.text('Próxima'), 200);
      await tester.ensureVisible(find.text('Próxima'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Próxima'));
      await tester.pumpAndSettle();
      final t = trainingScenarios[i];
      expect(find.text(t.question), findsOneWidget);
      await tester.scrollUntilVisible(find.text(t.options.first), 200);
      await tester.ensureVisible(find.text(t.options.first));
      await tester.pumpAndSettle();
      await tester.tap(find.text(t.options.first));
      await tester.pumpAndSettle();
      if (i == trainingScenarios.length - 1) break;
    }
    expect(tester.takeException(), isNull);
  });
}
