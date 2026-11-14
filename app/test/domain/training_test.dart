import 'package:flutter_test/flutter_test.dart';
import 'package:truco/domain/game/training.dart';
import 'package:truco/domain/game/truco_game.dart';

void main() {
  test('scenarios are well formed', () {
    final ids = <String>{};
    for (final s in trainingScenarios) {
      expect(ids.add(s.id), isTrue, reason: 'duplicate id ${s.id}');
      final cards = s.allCards;
      expect(
        cards.toSet().length,
        cards.length,
        reason: 'repeated card in ${s.id}',
      );
      final v = s.view;
      expect(v.handCounts[0], s.hand.length, reason: 'hand of ${s.id}');
      if (s.partner != null) {
        expect(v.handCounts[2], s.partner!.length, reason: 'partner ${s.id}');
      }
      for (final r in s.rounds) {
        expect(r.length, 4, reason: 'round of ${s.id}');
      }
      expect(s.plays.length, lessThan(4));
      final moves = s.moves;
      expect(moves, contains(s.answer), reason: 'answer of ${s.id}');
      for (final k in [...s.alsoGood.keys, ...s.wrong.keys]) {
        expect(moves, contains(k), reason: '$k in ${s.id}');
        expect(k, isNot(s.answer));
      }
      if (v.phase == GamePhase.playing) {
        expect(v.turn, 0, reason: 'not your turn in ${s.id}');
        expect(v.myTurn, isTrue);
      } else {
        expect(v.mustAnswer, isTrue);
        expect(s.partner, isNotNull, reason: 'partner shown in ${s.id}');
      }
      expect(s.explanation, isNotEmpty);
    }
    for (final level in TrainingLevel.values) {
      expect(trainingAt(level).length, greaterThanOrEqualTo(10));
    }
  });

  test('rounds follow the leads', () {
    final s = trainingScenarios.firstWhere((s) => s.id == 'facao_third_round');
    final v = s.view;
    expect(v.rounds.map((r) => r.topSeat), [2, 1]);
    expect(v.currentPlays.first.seat, 1);
    expect(v.foot, 0);
    // After an embuchada the same player leads again.
    final t = trainingScenarios.firstWhere((s) => s.id == 'tie_on_purpose');
    expect(t.view.rounds, isEmpty);
    final r = trainingScenarios.firstWhere((s) => s.id == 'reinforce_partner');
    expect(r.view.rounds.single.tied, isTrue);
    expect(r.view.currentPlays.first.seat, 2);
  });
}
