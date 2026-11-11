import 'dart:math';

import 'package:flutter_test/flutter_test.dart';
import 'package:truco/domain/game/ai.dart';
import 'package:truco/domain/game/coach.dart';
import 'package:truco/domain/game/rules.dart';
import 'package:truco/domain/game/truco_game.dart';

void main() {
  test('reviews every move of whole games without failing', () {
    const coach = Coach();
    final tips = <CoachTip>[];
    final hints = <CoachTip>[];
    final report = CoachReport();
    var moves = 0;
    final watch = Stopwatch()..start();
    for (var seed = 0; seed < 6; seed++) {
      final rnd = Random(seed);
      final g = TrucoGame(rules: TrucoRules.paulista, seed: seed);
      // Seat 0 plays badly (easy) so the professor has things to say.
      final bots = [
        TrucoBot(AiLevel.easy, random: rnd),
        TrucoBot(AiLevel.medium, random: rnd),
        TrucoBot(AiLevel.medium, random: rnd),
        TrucoBot(AiLevel.medium, random: rnd),
      ];
      var guard = 0;
      while (g.phase != GamePhase.gameOver && guard++ < 2000) {
        if (g.phase == GamePhase.handOver) {
          g.startNextHand();
          continue;
        }
        final seat = [
          for (var s = 0; s < 4; s++)
            if (g.legalActions(s).isNotEmpty) s,
        ].first;
        final action = bots[seat].decide(g.viewFor(seat));
        if (seat == 0) {
          moves++;
          final hint = coach.consider(g.viewFor(0));
          if (hint != null) hints.add(hint);
          final tip = coach.review(g.viewFor(0), action);
          report.record(tip);
          if (tip != null) tips.add(tip);
        }
        g.apply(action);
      }
    }
    watch.stop();
    expect(moves, greaterThan(50));
    expect(tips.where((t) => !t.good), isNotEmpty);
    for (final t in [...tips, ...hints]) {
      expect(t.text, isNot(contains('null')));
    }
    expect(hints, isNotEmpty);
    for (final h in hints) {
      expect(h.isHint, isTrue);
      // Hints say what to weigh, never the chances (that's the answer).
      expect(h.text, isNot(contains('%')));
    }
    final summary = report.summary()!;
    expect(summary, contains('•'));
    expect(summary, isNot(contains('null')));
    // Fast enough to run after each move on a phone.
    expect(watch.elapsedMilliseconds / moves, lessThan(400));
  });

  test('summary praises a game without mistakes', () {
    final r = CoachReport()
      ..record(null)
      ..record(const CoachTip('Boa!', good: true, topic: CoachTopic.praise));
    expect(r.summary(), startsWith('Partida muito bem jogada!'));
    expect(CoachReport().summary(), isNull);
  });

  test('percentages are rounded to 5', () {
    expect(Coach.pct(0.333), '35%');
    expect(Coach.pct(0.02), '0%');
  });
}
