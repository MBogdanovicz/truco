import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences_platform_interface/in_memory_shared_preferences_async.dart';
import 'package:shared_preferences_platform_interface/shared_preferences_async_platform_interface.dart';
import 'package:truco/app.dart';
import 'package:truco/data/auth_repository.dart';
import 'package:truco/data/match_history_repository.dart';
import 'package:truco/router.dart';
import 'package:truco/ui/adaptive/platform_style.dart';

void main() {
  setUp(() {
    SharedPreferencesAsyncPlatform.instance =
        InMemorySharedPreferencesAsync.empty();
  });

  for (final style in AppPlatformStyle.values) {
    testWidgets('single-device game to 12 with rematch (${style.name})', (
      tester,
    ) async {
      tester.view.physicalSize = const Size(1080, 2340);
      tester.view.devicePixelRatio = 3;
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

      await tester.tap(find.text('Novo marcador'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Um aparelho só'));
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(EditableText).at(1), 'Ana');
      await tester.scrollUntilVisible(
        find.text('Começar partida'),
        200,
        scrollable: find.byType(Scrollable).first,
      );
      await tester.ensureVisible(find.text('Começar partida'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Começar partida'));
      await tester.pumpAndSettle();

      Future<void> tap(String key) async {
        await tester.tap(find.byKey(ValueKey(key)));
        await tester.pump();
      }

      String score(String team) =>
          (tester.widget(find.byKey(ValueKey('score-$team'))) as Text).data!;

      await tap('add-a-3');
      await tap('add-b-1');
      expect(score('a'), '3');
      expect(score('b'), '1');

      await tester.tap(find.byTooltip('Desfazer').first);
      await tester.pump();
      expect(score('a'), '0');

      await tap('add-a-9');
      await tap('add-a-1');
      await tap('add-a-1');
      expect(find.text('Mão de onze'), findsOneWidget);
      // The team on 11 only gets "Vitória" (the other buttons stay, but do
      // nothing); the other team gets +1 and +3.
      await tap('add-a-3');
      expect(score('a'), '11');
      expect(find.text('Vitória'), findsOneWidget);
      expect(find.byKey(const ValueKey('add-b-3')), findsOneWidget);
      expect(find.byKey(const ValueKey('add-b-6')), findsNothing);

      await tap('add-a-1');
      await tester.pumpAndSettle();
      expect(find.text('Nós venceu!'), findsOneWidget);

      await tester.tap(find.text('Revanche'));
      await tester.pumpAndSettle();
      expect(score('a'), '0');
      expect(find.textContaining('Série 1 × 0'), findsOneWidget);

      final history = await container.read(matchHistoryProvider.future);
      expect(history, hasLength(1));
      expect(history.single.seats.single.name, 'Ana');
    });
  }

  test('auth redirect rules', () {
    expect(
      authRedirect(authAvailable: false, user: null, location: '/'),
      isNull,
    );
    expect(
      authRedirect(authAvailable: false, user: null, location: '/entrar'),
      '/',
    );
    expect(
      authRedirect(authAvailable: true, user: null, location: '/'),
      '/entrar',
    );
    const invite = '/marcador/entrar?codigo=ABC123';
    final toLogin = authRedirect(
      authAvailable: true,
      user: null,
      location: '/marcador/entrar',
      uri: invite,
    );
    expect(toLogin, '/entrar?de=${Uri.encodeComponent(invite)}');
    const me = AppUser(id: 'u', email: 'a@b.c', displayName: 'Ana');
    expect(
      authRedirect(
        authAvailable: true,
        user: me,
        location: '/entrar',
        uri: toLogin,
      ),
      invite,
    );
    expect(
      authRedirect(
        authAvailable: true,
        user: me,
        location: '/entrar',
        uri: '/entrar',
      ),
      '/',
    );
  });
}
