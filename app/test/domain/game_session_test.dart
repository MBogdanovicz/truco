import 'package:flutter_test/flutter_test.dart';
import 'package:truco/domain/game/game_session.dart';
import 'package:truco/domain/game/rules.dart';
import 'package:truco/domain/game/truco_game.dart';
import 'package:truco/domain/scorekeeper/team.dart';

GameSession people({List<Map<String, Object?>> log = const []}) => GameSession(
  rules: TrucoRules.paulista,
  seed: 5,
  firstDealer: 3,
  bots: const [null, null, null, null],
  log: log,
);

void main() {
  test('giving a game up: the other team wins, also after a replay', () {
    final s = people();
    s.forfeit(1);
    expect(s.game.phase, GamePhase.gameOver);
    expect(s.game.winner, Team.a);
    expect(s.game.forfeited, Team.b);
    expect(s.game.scores[Team.a], TrucoRules.paulista.targetScore);
    expect(s.viewFor(0).forfeited, Team.b);
    final again = people(log: s.log);
    expect(again.game.winner, Team.a);
    expect(again.game.forfeited, Team.b);
  });

  test('missing 3 moves in a row gives a tournament game up', () {
    final s = people();
    final first = s.waitingFor!;
    var guard = 0;
    while (s.game.phase != GamePhase.gameOver && guard++ < 200) {
      s.timeout(missLimit: 3);
    }
    expect(s.log.last['t'], 'forfeit');
    final quitter = s.log.last['s']! as int;
    expect(s.game.forfeited, teamOfSeat(quitter));
    // The 3 moves before the W.O. were the computer's.
    expect(
      s.log
          .where((e) => e['s'] == quitter && e['t'] != 'forfeit')
          .toList()
          .reversed
          .take(3)
          .every((e) => e['to'] == true),
      isTrue,
    );
    expect(first, isNotNull);
  });

  test('a move of their own resets the count', () {
    final s = people();
    final seat = s.waitingFor!;
    s.timeout(missLimit: 3);
    expect(s.missedInARow(seat), 1);
    while (s.waitingFor != seat) {
      s.timeout();
    }
    final action = s.game.legalActions(seat).whereType<PlayCard>().first;
    s.act(seat, action);
    expect(s.missedInARow(seat), 0);
  });
}
