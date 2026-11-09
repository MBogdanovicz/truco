/// Scoring rules shared by every truco variant for the scorekeeper.
///
/// The scorekeeper does not enforce hand-level rules (who can call truco,
/// mão de onze restrictions, ...). It only keeps the score.
class ScoringRules {
  const ScoringRules({
    this.targetScore = 12,
    this.allowedDeltas = const [1, 3, 6, 9, 12],
    this.teamScoreCooldown = const Duration(seconds: 15),
  });

  /// Score that ends a game.
  final int targetScore;

  /// Point values a hand can be worth (normal, truco, seis, nove, doze).
  final List<int> allowedDeltas;

  /// Minimum time between two accepted score events of the same team.
  ///
  /// Prevents both partners from marking the same hand. Use [Duration.zero]
  /// to disable (e.g. when a single device marks for everyone).
  final Duration teamScoreCooldown;

  /// The "mão de onze" score: one point away from winning.
  int get handOfElevenScore => targetScore - 1;

  ScoringRules copyWith({Duration? teamScoreCooldown}) => ScoringRules(
        targetScore: targetScore,
        allowedDeltas: allowedDeltas,
        teamScoreCooldown: teamScoreCooldown ?? this.teamScoreCooldown,
      );

  static const standard = ScoringRules();
}
