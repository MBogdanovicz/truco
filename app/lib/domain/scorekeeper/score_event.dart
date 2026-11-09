import 'team.dart';

enum ScoreEventKind { score, undo }

/// One accepted entry of a match's event log.
///
/// Events are assigned a monotonically increasing [seq] by the match host.
/// The score is always derived by folding the log (see `MatchState`).
class ScoreEvent {
  const ScoreEvent({
    required this.seq,
    required this.kind,
    required this.team,
    required this.authorSeat,
    required this.timestamp,
    this.delta = 0,
    this.undoesSeq,
  });

  final int seq;
  final ScoreEventKind kind;
  final Team team;

  /// Points added by a [ScoreEventKind.score] event; 0 for undo.
  final int delta;

  /// Seat (0..3) of the player who made the change.
  final int authorSeat;

  /// For undo events, the [seq] of the score event being reverted.
  final int? undoesSeq;

  final DateTime timestamp;

  Map<String, Object?> toJson() => {
    'seq': seq,
    'kind': kind.name,
    'team': team.name,
    'delta': delta,
    'authorSeat': authorSeat,
    'undoesSeq': undoesSeq,
    'timestamp': timestamp.toUtc().toIso8601String(),
  };

  factory ScoreEvent.fromJson(Map<String, Object?> json) => ScoreEvent(
    seq: json['seq']! as int,
    kind: ScoreEventKind.values.byName(json['kind']! as String),
    team: Team.fromName(json['team']! as String),
    delta: json['delta'] as int? ?? 0,
    authorSeat: json['authorSeat']! as int,
    undoesSeq: json['undoesSeq'] as int?,
    timestamp: DateTime.parse(json['timestamp']! as String),
  );
}

/// A request from a player to change the score. The host validates it and,
/// if accepted, turns it into a [ScoreEvent].
sealed class ScoreIntent {
  const ScoreIntent({required this.team, required this.authorSeat});

  final Team team;
  final int authorSeat;
}

class AddPointsIntent extends ScoreIntent {
  const AddPointsIntent({
    required super.team,
    required super.authorSeat,
    required this.delta,
  });

  final int delta;
}

class UndoIntent extends ScoreIntent {
  const UndoIntent({required super.team, required super.authorSeat});
}
