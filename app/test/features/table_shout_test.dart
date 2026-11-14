import 'dart:math' as math;

import 'package:flutter_test/flutter_test.dart';
import 'package:truco/features/game/table_shout.dart';

void main() {
  const stakes = [1, 3, 6, 9, 12];

  test('tense moments', () {
    bool tense(int a, int b, int level) =>
        isTenseRaise(scoreA: a, scoreB: b, toLevel: level, stakes: stakes);
    expect(tense(0, 0, 1), isFalse);
    expect(tense(3, 4, 1), isFalse);
    expect(tense(7, 8, 1), isTrue); // close and late
    expect(tense(9, 10, 1), isTrue); // near the mão de ferro
    expect(tense(9, 2, 1), isTrue); // truco ends the match
    expect(tense(4, 1, 1), isFalse);
    expect(tense(6, 0, 2), isTrue); // seis ends it
  });

  test('a calm truco never shouts; at most two per match', () {
    final r = math.Random(1);
    for (var i = 0; i < 200; i++) {
      expect(
        shoutForRaise(
          event: ShoutEvent.truco,
          tense: false,
          shoutsSoFar: 0,
          random: r,
        ),
        isNull,
      );
      expect(
        shoutForRaise(
          event: ShoutEvent.seis,
          tense: true,
          shoutsSoFar: maxShoutsPerMatch,
          random: r,
        ),
        isNull,
      );
    }
    final shouts = [
      for (var i = 0; i < 1000; i++)
        shoutForRaise(
          event: ShoutEvent.truco,
          tense: true,
          shoutsSoFar: 0,
          random: r,
        ),
    ].nonNulls;
    expect(shouts.length, inInclusiveRange(500, 700));
    expect(shouts.toSet(), containsAll(shoutPhrases[ShoutEvent.truco]!));
  });
}
