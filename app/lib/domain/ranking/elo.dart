import 'dart:math' as math;

/// Elo rating maths used by the leaderboards.
///
/// Mirrored by the `finish_match` SQL function; keep both in sync with the
/// shared vectors in `test/domain/elo_test.dart`.
abstract final class Elo {
  static const double initialRating = 1000;
  static const int provisionalGames = 20;
  static const double provisionalK = 40;
  static const double establishedK = 24;

  /// Probability that a side rated [rating] beats a side rated [opponent].
  static double expectedScore(double rating, double opponent) =>
      1 / (1 + math.pow(10, (opponent - rating) / 400));

  static double kFactor(int gamesPlayed) =>
      gamesPlayed < provisionalGames ? provisionalK : establishedK;

  /// Rating change for a side rated [rating] against [opponent].
  static double delta({
    required double rating,
    required double opponent,
    required bool won,
    required int gamesPlayed,
  }) =>
      kFactor(gamesPlayed) *
      ((won ? 1 : 0) - expectedScore(rating, opponent));

  /// Rating changes for the four players of a 2v2 match.
  ///
  /// Each team is rated as the average of its players; each player's change
  /// uses their own K factor.
  static Map<String, double> playerDeltas({
    required List<PlayerRating> winners,
    required List<PlayerRating> losers,
  }) {
    double avg(List<PlayerRating> team) =>
        team.map((p) => p.rating).reduce((a, b) => a + b) / team.length;
    final winAvg = avg(winners);
    final loseAvg = avg(losers);
    return {
      for (final p in winners)
        p.id: delta(
            rating: winAvg, opponent: loseAvg, won: true, gamesPlayed: p.games),
      for (final p in losers)
        p.id: delta(
            rating: loseAvg,
            opponent: winAvg,
            won: false,
            gamesPlayed: p.games),
    };
  }

  /// Stable key identifying a duo regardless of seat order.
  static String duoKey(String playerA, String playerB) {
    final ids = [playerA, playerB]..sort();
    return ids.join(':');
  }
}

class PlayerRating {
  const PlayerRating(this.id, this.rating, this.games);
  final String id;
  final double rating;
  final int games;
}
