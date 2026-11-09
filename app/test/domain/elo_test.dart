import 'package:flutter_test/flutter_test.dart';
import 'package:truco/domain/ranking/elo.dart';

// Shared test vectors: the finish_match SQL function must produce the same
// numbers (see supabase/tests).
void main() {
  test('equal ratings expect 50%', () {
    expect(Elo.expectedScore(1000, 1000), 0.5);
  });

  test('400 points ahead expects ~91%', () {
    expect(Elo.expectedScore(1400, 1000), closeTo(0.9091, 1e-4));
  });

  test('K factor drops after provisional games', () {
    expect(Elo.kFactor(0), 40);
    expect(Elo.kFactor(19), 40);
    expect(Elo.kFactor(20), 24);
  });

  test('2v2 deltas use team averages and individual K', () {
    final d = Elo.playerDeltas(
      winners: const [PlayerRating('w1', 1100, 30), PlayerRating('w2', 900, 5)],
      losers: const [PlayerRating('l1', 1000, 30), PlayerRating('l2', 1000, 30)],
    );
    expect(d['w1'], closeTo(12, 1e-9));
    expect(d['w2'], closeTo(20, 1e-9));
    expect(d['l1'], closeTo(-12, 1e-9));
  });

  test('duo key is order independent', () {
    expect(Elo.duoKey('b', 'a'), Elo.duoKey('a', 'b'));
    expect(Elo.duoKey('b', 'a'), 'a:b');
  });
}
