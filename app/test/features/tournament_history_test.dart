import 'package:flutter_test/flutter_test.dart';
import 'package:truco/data/game_room_repository.dart';
import 'package:truco/domain/game/ai.dart';
import 'package:truco/domain/game/rules.dart';
import 'package:truco/domain/game/table_view.dart';
import 'package:truco/domain/game/truco_game.dart';
import 'package:truco/domain/scorekeeper/team.dart';
import 'package:truco/features/game/tournament_history.dart';

void main() {
  test('a tournament game becomes a history entry', () {
    final g = TrucoGame(rules: TrucoRules.paulista, seed: 1);
    g.scores[Team.a] = 12;
    g.scores[Team.b] = 7;
    final view = TableView.of(g, 0, talk: TableTalk(), mayAnswer: (_) => true);
    const room = GameRoomSnapshot(
      id: 'r',
      code: 'ABC234',
      hostId: 'a',
      status: GameRoomStatus.finished,
      rules: TrucoRules.paulista,
      botLevel: AiLevel.medium,
      ranked: true,
      groupId: null,
      bots: [null, null, null, null],
      wins: (1, 0),
      seats: [
        GameSeat(seat: 0, userId: 'a', name: 'Ana'),
        GameSeat(seat: 1, userId: 'b', name: 'Bia'),
        GameSeat(seat: 2, userId: 'c', name: 'Caio'),
        GameSeat(seat: 3, userId: 'd', name: 'Dani'),
      ],
      tournamentMatchId: 'm',
    );
    final r = tournamentRecord(room, view, tournamentName: 'Copa');
    expect(r.teamNames[Team.a], 'Ana e Caio');
    expect(r.state.scoreOf(Team.a), 12);
    expect(r.state.scoreOf(Team.b), 7);
    expect(r.winner, Team.a);
    expect(r.groupName, 'Torneio Copa');
    expect(r.countsForRanking, isTrue);
  });
}
