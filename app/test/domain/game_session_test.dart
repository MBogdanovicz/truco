import 'package:flutter_test/flutter_test.dart';
import 'package:truco/domain/game/ai.dart';
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
  group('drawing a card for the first dealer', () {
    GameSession drawing({
      List<Map<String, Object?>> log = const [],
      bool draw = true,
    }) => GameSession(
      rules: TrucoRules.paulista,
      seed: 9,
      firstDealer: 1,
      bots: const [null, AiLevel.medium, null, AiLevel.medium],
      log: log,
      drawDealer: draw,
    );

    test('the highest card deals; replays the same', () {
      final s = drawing();
      final start = s.advance();
      expect(s.drawing, isTrue);
      expect(s.waitingFor, isNull);
      // The two computer players drew already.
      expect(start[0]!.last.draw!.picks.keys, containsAll([1, 3]));
      expect(start[0]!.last.draw!.canPick, isTrue);
      expect(
        () => s.act(0, s.game.legalActions(0).first),
        throwsA(isA<GameRuleError>()),
      );
      final taken = start[0]!.last.draw!.picks.values.toSet();
      final free = [
        for (var i = 0; i < 20; i++)
          if (!taken.contains(i)) i,
      ];
      s.pick(0, free[0]);
      expect(s.drawing, isTrue);
      final frames = s.pick(2, free[1]);
      expect(s.drawing, isFalse);
      final reveal = frames[0]!.firstWhere((v) => v.draw?.dealer != null).draw!;
      expect(reveal.cards, hasLength(4));
      final best = reveal.cards.entries.reduce(
        (a, b) =>
            GameSession.drawStrength(a.value) >=
                GameSession.drawStrength(b.value)
            ? a
            : b,
      );
      expect(reveal.dealer, best.key);
      expect(s.game.dealer, best.key);
      expect(frames[0]!.last.draw, isNull);
      // Rebuilt from the log (as the server does), without the flag.
      final again = drawing(log: s.log, draw: false);
      expect(again.drawing, isFalse);
      expect(again.game.dealer, best.key);
      expect(again.viewFor(0).toJson(), s.viewFor(0).toJson());
    });

    test('nobody draws in time: the dealer is drawn by lot', () {
      final s = drawing()..advance();
      final frames = s.timeout();
      expect(s.drawing, isFalse);
      expect(s.game.dealer, 1);
      expect(frames[0]!.first.draw!.timedOut, isTrue);
      expect(drawing(log: s.log, draw: false).game.dealer, 1);
    });

    test('someone drew in time: the others get a random card', () {
      final s = drawing()..advance();
      s.pick(0, s.viewFor(0).draw!.picks.values.contains(0) ? 1 : 0);
      s.timeout();
      expect(s.drawing, isFalse);
      final again = drawing(log: s.log, draw: false);
      expect(again.game.dealer, s.game.dealer);
    });
  });

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
    final action = s.game.legalActions(seat).first;
    s.act(seat, action);
    expect(s.missedInARow(seat), 0);
  });

  group('showing the cards after a hand worth 3+', () {
    /// Truco at once, and the other team runs (both of them).
    GameSession trucoHand() {
      final s = people();
      final caller = s.waitingFor!;
      s.act(caller, Raise(caller));
      final answer = s.waitingFor!;
      s.act(answer, Fold(answer));
      final last = s.waitingFor!;
      s.act(last, Fold(last));
      return s;
    }

    test('the game waits until everyone showed or passed', () {
      final s = trucoHand();
      expect(s.game.phase, GamePhase.handOver);
      expect(s.revealing, isTrue);
      final hand = s.game.handNumber;
      final seats = [
        for (var x = 0; x < 4; x++)
          if (s.canShowFor(x)) x,
      ];
      expect(seats, hasLength(4)); // nobody played a card
      final frames = s.show(seats.first);
      expect(s.game.shown[seats.first], hasLength(3));
      // Everyone sees the shown cards.
      for (final x in seats) {
        expect(frames[x]!.last.shown[seats.first], hasLength(3));
      }
      expect(s.viewFor(seats.first).canShow, isFalse);
      for (final x in seats.skip(1)) {
        expect(s.game.handNumber, hand);
        s.pass(x);
      }
      expect(s.game.handNumber, hand + 1);
      expect(s.game.shown, isEmpty);
      expect(s.revealing, isFalse);
    });

    test('time running out deals the next hand; replays agree', () {
      final s = trucoHand();
      s.show(s.waitingFor ?? 0);
      final hand = s.game.handNumber;
      s.timeout();
      expect(s.game.handNumber, hand + 1);
      final again = people(log: s.log);
      expect(again.game.handNumber, hand + 1);
      expect(again.revealing, isFalse);
    });

    test('hands without truco do not wait', () {
      final s = people();
      var guard = 0;
      while (s.game.handNumber == 1 && guard++ < 50) {
        final seat = s.waitingFor!;
        s.act(seat, s.game.legalActions(seat).whereType<PlayCard>().first);
      }
      expect(s.game.handNumber, 2);
    });
  });
}
