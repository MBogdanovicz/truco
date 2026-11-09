import 'score_event.dart';
import 'scoring_rules.dart';
import 'team.dart';

/// Score of a match derived from its event log.
class MatchState {
  MatchState._(this.rules, this.events, this._scores, this._active);

  /// Rebuilds the state by folding [events] in order.
  factory MatchState.fromEvents(
    List<ScoreEvent> events, {
    ScoringRules rules = ScoringRules.standard,
  }) {
    final active = {for (final t in Team.values) t: <ScoreEvent>[]};
    for (final event in events) {
      switch (event.kind) {
        case ScoreEventKind.score:
          active[event.team]!.add(event);
        case ScoreEventKind.undo:
          active[event.team]!.removeWhere((e) => e.seq == event.undoesSeq);
      }
    }
    final scores = {
      for (final t in Team.values)
        t: active[t]!
            .fold<int>(0, (sum, e) => sum + e.delta)
            .clamp(0, rules.targetScore),
    };
    return MatchState._(rules, List.unmodifiable(events), scores, active);
  }

  final ScoringRules rules;
  final List<ScoreEvent> events;
  final Map<Team, int> _scores;
  final Map<Team, List<ScoreEvent>> _active;

  int scoreOf(Team team) => _scores[team]!;

  /// Score events of [team] that have not been undone, oldest first.
  List<ScoreEvent> activeScoreEventsOf(Team team) =>
      List.unmodifiable(_active[team]!);

  ScoreEvent? lastActiveScoreEventOf(Team team) =>
      _active[team]!.isEmpty ? null : _active[team]!.last;

  Team? get winner {
    for (final t in Team.values) {
      if (scoreOf(t) >= rules.targetScore) return t;
    }
    return null;
  }

  bool get isFinished => winner != null;

  /// Exactly one team is one point away from winning.
  bool get isHandOfEleven {
    final eleven = rules.handOfElevenScore;
    return !isFinished &&
        (scoreOf(Team.a) == eleven) != (scoreOf(Team.b) == eleven);
  }

  /// Both teams are one point away from winning ("mão de ferro").
  bool get isIronHand =>
      !isFinished &&
      scoreOf(Team.a) == rules.handOfElevenScore &&
      scoreOf(Team.b) == rules.handOfElevenScore;

  int get nextSeq => events.isEmpty ? 1 : events.last.seq + 1;
}
