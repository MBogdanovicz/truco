import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:truco/domain/scorekeeper/match_record.dart';
import 'package:truco/domain/scorekeeper/online/match_channel.dart';
import 'package:truco/domain/scorekeeper/online/online_room.dart';
import 'package:truco/domain/scorekeeper/online/room_snapshot.dart';
import 'package:truco/domain/scorekeeper/team.dart';
import 'package:truco/features/scorekeeper/online_room_controller.dart';
import 'package:truco/features/scorekeeper/online_room_screen.dart';
import 'package:truco/ui/adaptive/platform_style.dart';

/// Controller bound to a pre-built room, without Supabase.
class _FakeController extends OnlineRoomController {
  _FakeController(this.room);
  final OnlineRoom room;
  StreamSubscription<RoomSnapshot>? _sub;

  @override
  OnlineRoomView? build() {
    _sub ??= room.changes.listen(
      (s) => state = OnlineRoomView(room: room, snapshot: s),
    );
    ref.onDispose(() => _sub?.cancel());
    return OnlineRoomView(room: room, snapshot: room.snapshot);
  }
}

void main() {
  for (final style in AppPlatformStyle.values) {
    testWidgets('lobby, game and finish card render (${style.name})', (
      tester,
    ) async {
      tester.view.physicalSize = const Size(1080, 2340);
      tester.view.devicePixelRatio = 3;
      addTearDown(tester.view.reset);

      final hub = InMemoryChannelHub();
      var n = 0;
      final host = OnlineRoom.host(
        channel: hub.connect(),
        me: const RoomMember(userId: 'h', name: 'Marcelo'),
        newId: () => 'g${n++}',
        initial: RoomSnapshot(
          roomId: 'r',
          code: 'K7Q2ZP',
          hostUserId: 'h',
          gameId: 'g',
          phase: RoomPhase.lobby,
          teamNames: const {Team.a: 'Dupla 1', Team.b: 'Dupla 2'},
          seats: const [
            Seat(index: 0, team: Team.a, name: 'Marcelo', userId: 'h'),
          ],
          events: const [],
          series: const SeriesTally(id: 'r'),
          gameStartedAt: DateTime(2026),
        ),
      );
      await tester.runAsync(host.start);

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            onlineRoomControllerProvider.overrideWith(
              () => _FakeController(host),
            ),
          ],
          child: PlatformStyleScope(
            style: style,
            child: MaterialApp(
              theme: style == AppPlatformStyle.cupertino
                  ? ThemeData(platform: TargetPlatform.iOS)
                  : null,
              home: const OnlineRoomScreen(),
            ),
          ),
        ),
      );
      await tester.pump();
      expect(find.text('K7Q2ZP'), findsOneWidget);
      expect(find.text('Partida rankeada'), findsOneWidget);
      await tester.scrollUntilVisible(
        find.text('Esperando as duas duplas'),
        200,
        scrollable: find.byType(Scrollable).first,
      );
      expect(find.text('Esperando as duas duplas'), findsOneWidget);

      await tester.runAsync(() => host.addGuest(Team.b, 'Vô'));
      await tester.pump();
      expect(find.text('Vô'), findsOneWidget);
      await tester.tap(find.text('Começar partida'));
      await tester.pump();
      await tester.pump();

      expect(find.text('você'), findsOneWidget);
      await tester.tap(find.byKey(const ValueKey('add-b-12')));
      await tester.pump();
      await tester.pump();
      expect(find.text('Dupla 2 venceu!'), findsOneWidget);
      expect(find.text('Revanche'), findsOneWidget);

      await tester.tap(find.text('Revanche'));
      await tester.pump();
      await tester.pump();
      expect(find.text('Dupla 2 venceu!'), findsNothing);
      expect(find.textContaining('Série 0 × 1'), findsOneWidget);
      await tester.runAsync(host.dispose);
    });
  }
}
