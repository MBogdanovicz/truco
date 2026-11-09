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
    host = OnlineRoom.host(
      channel: hub.connect(),
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
    final hostDone = <MatchRecord>[], p3Done = <MatchRecord>[];
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
    expect(hostDone.single.winner, Team.a);
    expect(p3Done.single.id, 'game0');
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

  test('snapshot JSON round trip', () async {
    await fullTable();
    await host.addPoints(Team.a, 3);
    final json = host.snapshot!.toJson();
    final back = RoomSnapshot.fromJson(json);
    expect(back.toJson(), json);
  });
}
