import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:truco/data/game_prefs.dart';
import 'package:truco/domain/game/rules.dart';
import 'package:truco/features/game/rule_options.dart';
import 'package:truco/features/settings/settings_screen.dart';

void main() {
  setUp(() => SharedPreferences.setMockInitialValues({}));

  testWidgets('preferred rules are saved and shown in the summary', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(400, 1400);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    final container = ProviderContainer();
    addTearDown(container.dispose);
    await tester.pumpWidget(
      UncontrolledProviderScope(
        container: container,
        child: const MaterialApp(home: SettingsScreen()),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Regras preferidas'), findsOneWidget);
    await tester.tap(find.text('Manilhas fixas'));
    await tester.pumpAndSettle();
    final rules = container.read(preferredRulesProvider);
    expect(rules.manilhaMode, ManilhaMode.fixed);
    expect(rulesLine(rules), startsWith('Manilhas fixas'));
    final p = await SharedPreferences.getInstance();
    expect(p.getBool('game.fixedManilhas'), isTrue);
  });

  testWidgets('the summary tile changes only this game', (tester) async {
    TrucoRules? changed;
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: RulesSummaryTile(
            rules: TrucoRules.paulista,
            onChanged: (r) => changed = r,
          ),
        ),
      ),
    );
    expect(find.textContaining('Manilha virada'), findsOneWidget);
    await tester.tap(find.byTooltip('Alterar as regras'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Manilhas fixas'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Pronto'));
    await tester.pumpAndSettle();
    expect(changed?.manilhaMode, ManilhaMode.fixed);
  });
}
