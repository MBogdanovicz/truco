import 'match_state.dart';
import 'score_event.dart';
import 'scoring_rules.dart';
import 'team.dart';

/// Why a [ScoreIntent] was not accepted.
enum IntentRejection {
  /// The author is not seated on the team they tried to change.
  notYourTeam,

  /// The game is already over.
  matchFinished,

  /// The point value is not one of [ScoringRules.allowedDeltas].
  invalidDelta,

  /// Another score for this team was accepted too recently.
  cooldown,

  /// There is no score event left to undo for this team.
  nothingToUndo,

  /// Joining mid-game: every seat of that team has an active player.
  teamFull,
}

sealed class IntentResult {
  const IntentResult();
}

class IntentAccepted extends IntentResult {
  const IntentAccepted(this.event, this.state);
  final ScoreEvent event;
  final MatchState state;
}

class IntentRejected extends IntentResult {
  const IntentRejected(this.reason, {this.retryAfter});
  final IntentRejection reason;

  /// For [IntentRejection.cooldown]: time left until the team can score.
  final Duration? retryAfter;
}

/// Authoritative event log of a single game, run by the match host.
///
/// Every transport (single device, online, nearby) feeds player intents into
/// the host's engine and distributes the accepted events.
class MatchEngine {
  MatchEngine({
    required this.rules,
    required Map<int, Team> seatTeams,
    this.anySeatMarksAnyTeam = false,
    this.extraPermission,
    List<ScoreEvent> events = const [],
  }) : _seatTeams = Map.unmodifiable(seatTeams),
       _state = MatchState.fromEvents(events, rules: rules);

  final ScoringRules rules;
  final Map<int, Team> _seatTeams;

  /// True in single-device mode, where one person marks for both teams.
  final bool anySeatMarksAnyTeam;

  /// Extra marking rights beyond "own team", e.g. the host marking for a team
  /// made only of guests in online mode.
  final bool Function(int seat, Team team)? extraPermission;

  MatchState _state;
  MatchState get state => _state;

  Team? teamOfSeat(int seat) => _seatTeams[seat];

  /// Remaining cooldown for [team] at [now], or [Duration.zero].
  Duration cooldownRemaining(Team team, DateTime now) {
    if (rules.teamScoreCooldown == Duration.zero) return Duration.zero;
    final last = _lastScoreTime(team);
    if (last == null) return Duration.zero;
    final remaining = rules.teamScoreCooldown - now.difference(last);
    return remaining.isNegative ? Duration.zero : remaining;
  }

  bool canMark(int seat, Team team) =>
      anySeatMarksAnyTeam ||
      _seatTeams[seat] == team ||
      (extraPermission?.call(seat, team) ?? false);

  IntentResult apply(ScoreIntent intent, DateTime now) {
    if (!canMark(intent.authorSeat, intent.team)) {
      return const IntentRejected(IntentRejection.notYourTeam);
    }
    final ScoreEvent event;
    switch (intent) {
      case AddPointsIntent(:final delta):
        if (_state.isFinished) {
          return const IntentRejected(IntentRejection.matchFinished);
        }
        if (!rules.allowedDeltas.contains(delta)) {
          return const IntentRejected(IntentRejection.invalidDelta);
        }
        final wait = cooldownRemaining(intent.team, now);
        if (wait > Duration.zero) {
          return IntentRejected(IntentRejection.cooldown, retryAfter: wait);
        }
        event = ScoreEvent(
          seq: _state.nextSeq,
          kind: ScoreEventKind.score,
          team: intent.team,
          delta: delta,
          authorSeat: intent.authorSeat,
          timestamp: now,
        );
      case UndoIntent():
        // Undo stays available after the game ends, so a mistaken final hand
        // can be corrected before the result is confirmed.
        final target = _state.lastActiveScoreEventOf(intent.team);
        if (target == null) {
          return const IntentRejected(IntentRejection.nothingToUndo);
        }
        event = ScoreEvent(
          seq: _state.nextSeq,
          kind: ScoreEventKind.undo,
          team: intent.team,
          authorSeat: intent.authorSeat,
          undoesSeq: target.seq,
          timestamp: now,
        );
    }
    _state = MatchState.fromEvents([..._state.events, event], rules: rules);
    return IntentAccepted(event, _state);
  }

  /// Time of the latest accepted score event of [team] that is still active.
  ///
  /// An undone score does not hold the cooldown, so the right team can mark
  /// right after a correction.
  DateTime? _lastScoreTime(Team team) =>
      _state.lastActiveScoreEventOf(team)?.timestamp;
}
