import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences_platform_interface/in_memory_shared_preferences_async.dart';
import 'package:shared_preferences_platform_interface/shared_preferences_async_platform_interface.dart';
import 'package:truco/app.dart';
import 'package:truco/data/game_room_repository.dart';
import 'package:truco/domain/game/ai.dart';
import 'package:truco/domain/game/game_session.dart';
import 'package:truco/domain/game/rules.dart';
import 'package:truco/domain/game/table_view.dart';
import 'package:truco/domain/game/truco_game.dart';
import 'package:truco/features/game/online_game_controller.dart';
import 'package:truco/router.dart';
import 'package:truco/ui/adaptive/platform_style.dart';

/// The server in memory: the same GameSession, frames sent as JSON.
class FakeRooms implements GameRoomBackend {
  FakeRooms(this.userId);

  @override
  final String userId;

  final rooms = <String, _Room>{};

  @override
  Future<({String roomId, String code})> create({
    required TrucoRules rules,
    required AiLevel botLevel,
    required bool ranked,
  }) async {
    final room = _Room('r1', 'ABC234', userId, rules, botLevel, ranked);
    room.seats[0] = GameSeat(seat: 0, userId: userId, name: 'Eu');
    rooms[room.id] = room;
    return (roomId: room.id, code: room.code);
  }

  @override
  Future<({String roomId, String code})> join(String code) async {
    final room = rooms.values.where((r) => r.code == code).firstOrNull;
    if (room == null) throw const GameRoomError('room_not_found');
    return (roomId: room.id, code: room.code);
  }

  /// Someone else sits down.
  void seatOther(String roomId, int seat, String id, String name) {
    rooms[roomId]!.seats[seat] = GameSeat(seat: seat, userId: id, name: name);
    rooms[roomId]!.changed();
  }

  @override
  Future<void> sit(String roomId, int seat) async {
    final r = rooms[roomId]!;
    if (r.seats.containsKey(seat)) throw const GameRoomError('seat_taken');
    final me = r.seats.values.firstWhere((s) => s.userId == userId);
    r.seats.remove(me.seat);
    r.seats[seat] = GameSeat(seat: seat, userId: userId, name: me.name);
    r.changed();
  }

  @override
  Future<void> options(
    String roomId, {
    AiLevel? botLevel,
    bool? ranked,
    String? Function()? groupId,
  }) async {
    final r = rooms[roomId]!;
    if (botLevel != null) r.botLevel = botLevel;
    if (ranked != null) r.ranked = ranked;
    r.changed();
  }

  @override
  Future<void> start(String roomId) async {
    final r = rooms[roomId]!;
    r.session = GameSession(
      rules: r.rules,
      seed: 7,
      firstDealer: 1,
      bots: [
        for (var s = 0; s < 4; s++) r.seats.containsKey(s) ? null : r.botLevel,
      ],
      random: Random(1),
    );
    r.status = GameRoomStatus.playing;
    r.publish(r.session!.advance());
  }

  @override
  Future<void> act(String roomId, Map<String, Object?> action) async {
    final r = rooms[roomId]!;
    final seat = r.seats.values.firstWhere((s) => s.userId == userId).seat;
    try {
      r.publish(r.session!.actJson(seat, action));
    } on GameRuleError {
      throw const GameRoomError('illegal_move');
    }
  }

  /// Another person at the table moves.
  void actFor(String roomId, int seat, GameAction action) =>
      rooms[roomId]!.publish(rooms[roomId]!.session!.act(seat, action));

  @override
  Future<void> leave(String roomId) async {
    rooms[roomId]!.seats.removeWhere((_, s) => s.userId == userId);
  }

  @override
  GameRoomWatch watch(String roomId) => _Watch(rooms[roomId]!, userId);
}

class _Room {
  _Room(
    this.id,
    this.code,
    this.hostId,
    this.rules,
    this.botLevel,
    this.ranked,
  );
  final String id, code, hostId;
  final TrucoRules rules;
  AiLevel botLevel;
  bool ranked;
  GameRoomStatus status = GameRoomStatus.lobby;
  final seats = <int, GameSeat>{};
  GameSession? session;
  int version = 0;
  final views = <int, List<TableView>>{};
  (int, int) wins = (0, 0);
  final listeners = <void Function()>[];

  void changed() {
    for (final l in [...listeners]) {
      l();
    }
  }

  void publish(Frames frames) {
    version++;
    frames.forEach((seat, list) {
      // Through JSON, like the server.
      views[seat] = [
        for (final v in list)
          TableView.fromJson(
            jsonDecode(jsonEncode(v.toJson())) as Map<String, Object?>,
          ),
      ];
    });
    final g = session!.game;
    if (g.phase == GamePhase.gameOver && status == GameRoomStatus.playing) {
      status = GameRoomStatus.finished;
      wins = g.winner!.name == 'a'
          ? (wins.$1 + 1, wins.$2)
          : (wins.$1, wins.$2 + 1);
    }
    changed();
  }

  GameRoomSnapshot snapshot(String userId) {
    final mine = seats.values.where((s) => s.userId == userId).firstOrNull;
    return GameRoomSnapshot(
      id: id,
      code: code,
      hostId: hostId,
      status: status,
      rules: rules,
      botLevel: botLevel,
      ranked: ranked,
      groupId: null,
      bots: session?.bots ?? const [null, null, null, null],
      wins: wins,
      seats: [...seats.values]..sort((a, b) => a.seat.compareTo(b.seat)),
      viewVersion: mine == null ? 0 : version,
      frames: mine == null ? const [] : (views[mine.seat] ?? const []),
    );
  }
}

class _Watch implements GameRoomWatch {
  _Watch(this.room, this.userId) {
    room.listeners.add(_emit);
    scheduleMicrotask(_emit);
  }
  final _Room room;
  final String userId;
  final _out = StreamController<GameRoomSnapshot>.broadcast();

  void _emit() {
    if (!_out.isClosed) _out.add(room.snapshot(userId));
  }

  @override
  Stream<GameRoomSnapshot> get snapshots => _out.stream;

  @override
  Future<void> refresh() async => _emit();

  @override
  Future<void> close() async {
    room.listeners.remove(_emit);
    await _out.close();
  }
}

void main() {
  setUp(() {
    SharedPreferencesAsyncPlatform.instance =
        InMemorySharedPreferencesAsync.empty();
  });

  testWidgets('online room: lobby, a whole game with a friend, rematch', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1080, 2340);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);
    final rooms = FakeRooms('me');
    final container = ProviderContainer(
      overrides: [gameRoomBackendProvider.overrideWithValue(rooms)],
    );
    addTearDown(container.dispose);
    await tester.pumpWidget(
      UncontrolledProviderScope(
        container: container,
        child: const TrucoApp(style: AppPlatformStyle.material),
      ),
    );
    await tester.pumpAndSettle();

    final ctrl = container.read(onlineGameControllerProvider.notifier);
    await ctrl.create(
      rules: TrucoRules.paulista,
      botLevel: AiLevel.easy,
      ranked: true,
    );
    container.read(routerProvider).go('/jogo/sala');
    await tester.pumpAndSettle();
    expect(find.text('ABC234'), findsOneWidget);
    await tester.scrollUntilVisible(
      find.text('Começar a partida'),
      200,
      scrollable: find.byType(Scrollable).first,
    );

    // A friend sits across: my partner.
    rooms.seatOther('r1', 2, 'ana', 'Ana');
    await tester.pumpAndSettle();
    expect(find.text('Ana', skipOffstage: false), findsOneWidget);

    await tester.scrollUntilVisible(
      find.text('Começar a partida'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.tap(find.text('Começar a partida'));
    await tester.pump();
    await tester.pump(const Duration(seconds: 3));

    final me = TrucoBot(AiLevel.medium, random: Random(2));
    final ana = TrucoBot(AiLevel.medium, random: Random(3));
    final room = rooms.rooms['r1']!;
    var steps = 0;
    while (room.status == GameRoomStatus.playing) {
      final g = room.session!.game;
      final model = ctrl.tableModel;
      if (model != null && model.canAct) {
        switch (me.decide(g.viewFor(0))) {
          case PlayCard(:final card, :final covered):
            g.iron
                ? await ctrl.playBlind(0)
                : await ctrl.playCard(card, covered: covered);
          case Raise():
            await ctrl.raise();
          case Accept():
            await ctrl.accept();
          case Fold():
            await ctrl.fold();
        }
      } else if (!(model?.busy ?? true)) {
        // Ana's turn (or her team answering).
        final waitsForAna =
            (g.phase == GamePhase.playing && g.turn == 2) ||
            (g.phase == GamePhase.decision && g.decisionTeam!.name == 'a') ||
            (g.phase == GamePhase.raisePending && g.pending!.team.name == 'b');
        if (waitsForAna) {
          final action = ana.decide(g.viewFor(2));
          rooms.actFor('r1', 2, switch (action) {
            Accept() => const Accept(2),
            Fold() => const Fold(2),
            Raise() => const Raise(2),
            PlayCard(:final card, :final covered) => PlayCard(
              2,
              card,
              covered: covered,
            ),
          });
        }
      }
      await tester.pump(const Duration(milliseconds: 900));
      expect(++steps, lessThan(3000));
    }
    await tester.pump(const Duration(seconds: 5));
    expect(find.text('Revanche'), findsOneWidget);
    await tester.tap(find.text('Revanche'));
    await tester.pump();
    await tester.pump(const Duration(seconds: 3));
    expect(room.status, GameRoomStatus.playing);

    await ctrl.leave();
    await tester.pumpAndSettle();
  });
}
