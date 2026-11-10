import 'package:flutter_test/flutter_test.dart';
import 'package:truco/domain/scorekeeper/match_engine.dart';
import 'package:truco/domain/scorekeeper/match_record.dart';
import 'package:truco/domain/scorekeeper/online/match_channel.dart';
import 'package:truco/domain/scorekeeper/online/online_room.dart';
import 'package:truco/domain/scorekeeper/online/room_snapshot.dart';
import 'package:truco/domain/scorekeeper/team.dart';

void main() {
  late InMemoryChannelHub hub;
  late DateTime now;
  late OnlineRoom host;
  late MatchChannel hostChannel;
  var ids = 0;

  DateTime clock() => now;
  Future<void> settle() => Future<void>.delayed(Duration.zero);

  OnlineRoom joiner(String id, String name) => OnlineRoom.join(
    channel: hub.connect(),
    me: RoomMember(userId: id, name: name),
    roomId: 'room',
    clock: clock,
  );

  setUp(() async {
    hub = InMemoryChannelHub();
    now = DateTime.utc(2026, 1, 1, 20);
    ids = 0;
    hostChannel = hub.connect();
    host = OnlineRoom.host(
      channel: hostChannel,
      me: const RoomMember(userId: 'h', name: 'Host'),
      newId: () => 'game${++ids}',
      clock: clock,
      initial: RoomSnapshot(
        roomId: 'room',
        code: 'ABC123',
        hostUserId: 'h',
        gameId: 'game0',
        phase: RoomPhase.lobby,
        teamNames: const {Team.a: 'Nós', Team.b: 'Eles'},
        seats: const [Seat(index: 0, team: Team.a, name: 'Host', userId: 'h')],
        events: const [],
        series: const SeriesTally(id: 'room'),
        gameStartedAt: now,
      ),
    );
    await host.start();
  });

  Future<List<OnlineRoom>> fullTable() async {
    final p2 = joiner('p2', 'Bia'),
        p3 = joiner('p3', 'Caio'),
        p4 = joiner('p4', 'Duda');
    for (final p in [p2, p3, p4]) {
      await p.start();
    }
    await settle();
    await p2.pickTeam(Team.a);
    await settle();
    await p3.pickTeam(Team.b);
    await settle();
    await p4.pickTeam(Team.b);
    await settle();
    await host.startGame();
    await settle();
    return [p2, p3, p4];
  }

  test('players join, pick teams and receive the snapshot', () async {
    final [p2, p3, p4] = await fullTable();
    for (final r in [host, p2, p3, p4]) {
      expect(r.snapshot!.seats, hasLength(4));
      expect(r.snapshot!.phase, RoomPhase.playing);
    }
    expect(p2.mySeat!.index, 2);
    expect(p4.mySeat!.index, 3);
  });

  test('a fifth player cannot take a full team', () async {
    await fullTable();
    final p5 = joiner('p5', 'Eva');
    await p5.start();
    await settle();
    await p5.pickTeam(Team.a);
    await settle();
    expect(p5.mySeat, isNull);
  });

  test('scores sync and only own team can be marked', () async {
    final [p2, p3, _] = await fullTable();
    final rejections = <IntentRejection>[];
    p3.rejections.listen(rejections.add);
    await p2.addPoints(Team.a, 3);
    await settle();
    await p3.addPoints(Team.a, 1);
    await settle();
    expect(p3.snapshot!.state.scoreOf(Team.a), 3);
    expect(rejections, [IntentRejection.notYourTeam]);
    expect(p3.canMark(Team.a), isFalse);
    expect(p3.canMark(Team.b), isTrue);
  });

  test('partner cooldown is enforced by the host', () async {
    final [p2, _, _] = await fullTable();
    final rejections = <IntentRejection>[];
    p2.rejections.listen(rejections.add);
    await host.addPoints(Team.a, 1);
    await settle();
    now = now.add(const Duration(seconds: 5));
    expect(p2.cooldownRemaining(Team.a), const Duration(seconds: 10));
    await p2.addPoints(Team.a, 1);
    await settle();
    expect(rejections, [IntentRejection.cooldown]);
    now = now.add(const Duration(seconds: 10));
    await p2.addPoints(Team.a, 1);
    await settle();
    expect(p2.snapshot!.state.scoreOf(Team.a), 2);
  });

  test('rematch needs both teams and reports the finished game once', () async {
    final [p2, p3, _] = await fullTable();
    final hostDone = <CompletedGame>[], p3Done = <CompletedGame>[];
    host.completedGames.listen(hostDone.add);
    p3.completedGames.listen(p3Done.add);
    await p2.addPoints(Team.a, 12);
    await settle();
    await p2.voteRematch();
    await settle();
    expect(p3.snapshot!.rematchVotes, {Team.a: true});
    expect(p3.snapshot!.state.isFinished, isTrue);
    await p3.voteRematch();
    await settle();
    expect(p3.snapshot!.gameId, 'game1');
    expect(p3.snapshot!.state.scoreOf(Team.a), 0);
    expect(p3.snapshot!.series.winsA, 1);
    expect(hostDone.single.record.winner, Team.a);
    expect(hostDone.single.ranked, isTrue);
    expect(p3Done.single.record.id, 'game0');
  });

  test('host marks for a team made only of guests', () async {
    final p2 = joiner('p2', 'Bia');
    await p2.start();
    await settle();
    await p2.pickTeam(Team.a);
    await settle();
    await host.addGuest(Team.b, 'Vô');
    await host.startGame();
    await settle();
    expect(host.canMark(Team.b), isTrue);
    expect(p2.canMark(Team.b), isFalse);
    await host.addPoints(Team.b, 3);
    await settle();
    expect(p2.snapshot!.state.scoreOf(Team.b), 3);
  });

  test('a late joiner gets the current score', () async {
    await fullTable();
    await host.addPoints(Team.a, 6);
    final late = joiner('p9', 'Zé');
    await late.start();
    await settle();
    expect(late.snapshot!.state.scoreOf(Team.a), 6);
  });

  test('host settings sync to everyone in the lobby', () async {
    final p2 = joiner('p2', 'Bia');
    await p2.start();
    await settle();
    await host.setRanked(false);
    await host.setGroup(const RoomGroup(id: 'g1', name: 'Bar'));
    await settle();
    expect(p2.snapshot!.ranked, isFalse);
    expect(p2.snapshot!.group!.name, 'Bar');
    await host.setGroup(null);
    await settle();
    expect(p2.snapshot!.group, isNull);
  });

  test('the next player takes over when the host goes silent', () async {
    final [p2, p3, p4] = await fullTable();
    await host.addPoints(Team.a, 3);
    await settle();

    // The host keeps a heartbeat while it is there.
    now = now.add(OnlineRoom.hostTimeout);
    await host.tick();
    await settle();
    for (final p in [p2, p3, p4]) {
      await p.tick();
    }
    expect([p2, p3, p4].any((p) => p.isHost), isFalse);

    // Then its phone loses signal.
    final hostNotices = <RoomNotice>[];
    final p3Notices = <RoomNotice>[];
    host.notices.listen(hostNotices.add);
    p3.notices.listen(p3Notices.add);
    hub.disconnect(hostChannel);
    expect(host.isConnected, isFalse);
    expect(host.canMark(Team.a), isFalse);
    now = now.add(OnlineRoom.hostTimeout);
    for (final p in [p2, p3, p4]) {
      await p.tick();
      await settle();
    }
    expect(p3.isHost, isTrue, reason: 'seat 1 is first in line');
    expect(p3Notices, [RoomNotice.youAreHost]);
    expect(p2.isHost || p4.isHost, isFalse);
    for (final p in [p2, p3, p4]) {
      expect(p.snapshot!.hostUserId, 'p3');
      expect(p.snapshot!.state.scoreOf(Team.a), 3);
    }

    // The game goes on under the new host.
    now = now.add(const Duration(seconds: 20));
    await p4.addPoints(Team.b, 1);
    await settle();
    expect(p2.snapshot!.state.scoreOf(Team.b), 1);

    // The old host comes back and steps down, even though its heartbeats
    // kept counting revisions while it was away.
    hub.reconnect(hostChannel);
    now = now.add(const Duration(seconds: 6));
    await host.tick();
    await settle();
    await p3.tick();
    await settle();
    expect(host.isHost, isFalse);
    expect(host.snapshot!.hostUserId, 'p3');
    expect(host.snapshot!.state.scoreOf(Team.b), 1);
    expect(host.snapshot!.state.scoreOf(Team.a), 3);
    expect(hostNotices, [RoomNotice.replacedWhileAway]);
    for (final p in [p2, p4]) {
      expect(p.snapshot!.hostUserId, 'p3');
    }
  });

  test('a device that stops hearing the room says so', () async {
    final [p2, p3, p4] = await fullTable();
    expect(p2.isConnected, isTrue);
    hub.disconnect(hostChannel);
    expect(host.isConnected, isFalse);
    now = now.add(OnlineRoom.connectionTimeout);
    for (final p in [p2, p3, p4]) {
      expect(p.isConnected, isFalse);
    }
    expect(p2.canMark(Team.a), isFalse);
  });

  test('with two devices, the one left keeps marking alone', () async {
    final p2 = joiner('p2', 'Bia');
    await p2.start();
    await settle();
    await p2.pickTeam(Team.b);
    await settle();
    await host.startGame();
    await settle();

    hub.disconnect(hostChannel);
    now = now.add(OnlineRoom.hostTimeout);
    await p2.tick();
    await settle();
    expect(p2.isHost, isTrue);
    expect(p2.isConnected, isTrue);
    expect(p2.canMark(Team.b), isTrue);
    await p2.addPoints(Team.b, 3);
    expect(p2.snapshot!.state.scoreOf(Team.b), 3);

    hub.reconnect(hostChannel);
    now = now.add(OnlineRoom.heartbeat);
    await host.tick();
    await p2.tick();
    await settle();
    expect(host.isHost, isFalse);
    expect(host.snapshot!.state.scoreOf(Team.b), 3);
  });

  test('host marks for a team whose players all lost signal', () async {
    final [p2, p3, p4] = await fullTable();
    expect(host.canMark(Team.b), isFalse);

    Future<void> tickAll(List<OnlineRoom> rooms) async {
      for (final r in rooms) {
        await r.tick();
      }
      await settle();
    }

    await tickAll([host, p2, p3, p4]);
    // p3 and p4 lose signal (they stop ticking, so no pings); p2 stays.
    for (var i = 0; i < 3; i++) {
      now = now.add(OnlineRoom.heartbeat);
      await tickAll([host, p2]);
    }
    expect(host.canMark(Team.b), isTrue);
    await host.addPoints(Team.b, 3);
    await settle();
    expect(p2.snapshot!.state.scoreOf(Team.b), 3);

    // One of them is back: their team marks for itself again.
    now = now.add(OnlineRoom.heartbeat);
    await p3.tick();
    await settle();
    expect(host.canMark(Team.b), isFalse);
  });

  test('the room closes when a whole team leaves', () async {
    final [p2, p3, p4] = await fullTable();
    final completed = <CompletedGame>[];
    host.completedGames.listen(completed.add);
    await host.addPoints(Team.a, 12);
    await settle();

    await p3.leave();
    await settle();
    expect(host.snapshot!.phase, RoomPhase.playing);
    expect(host.snapshot!.left, {'p3'});

    await p4.leave();
    await settle();
    expect(host.snapshot!.phase, RoomPhase.closed);
    expect(p2.snapshot!.phase, RoomPhase.closed);
    expect(completed, hasLength(1));
  });

  test(
    'a player who left and comes back is no longer marked as gone',
    () async {
      final [_, p3, _] = await fullTable();
      await p3.leave();
      await settle();
      expect(host.snapshot!.left, {'p3'});
      now = now.add(const Duration(seconds: 20));
      await p3.addPoints(Team.b, 1);
      await settle();
      expect(host.snapshot!.left, isEmpty);
      expect(host.snapshot!.state.scoreOf(Team.b), 1);
    },
  );

  test(
    'someone joining mid-game takes the seat of a player who left',
    () async {
      final [_, p3, _] = await fullTable();
      final p5 = joiner('p5', 'Eva');
      await p5.start();
      await settle();
      final rejections = <IntentRejection>[];
      p5.rejections.listen(rejections.add);

      await p5.pickTeam(Team.b);
      await settle();
      expect(p5.mySeat, isNull);
      expect(rejections, [IntentRejection.teamFull]);

      await p3.leave();
      await settle();
      await p5.pickTeam(Team.b);
      await settle();
      expect(p5.mySeat!.index, 1);
      expect(host.snapshot!.left, isEmpty);
      now = now.add(const Duration(seconds: 20));
      await p5.addPoints(Team.b, 3);
      await settle();
      expect(host.snapshot!.state.scoreOf(Team.b), 3);
    },
  );

  test('snapshot JSON round trip', () async {
    await fullTable();
    await host.setGroup(const RoomGroup(id: 'g1', name: 'Bar'));
    await host.addPoints(Team.a, 3);
    final json = host.snapshot!.toJson();
    final back = RoomSnapshot.fromJson(json);
    expect(back.toJson(), json);
  });
}
