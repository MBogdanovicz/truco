import '../match_record.dart';
import '../match_state.dart';
import '../score_event.dart';
import '../scoring_rules.dart';
import '../team.dart';

enum RoomPhase { lobby, playing, closed }

/// Full state of an online room, broadcast by the host after every change.
///
/// Snapshots are small (a game has a few dozen events), so sending the whole
/// state keeps late joiners and reconnects trivial.
class RoomSnapshot {
  const RoomSnapshot({
    required this.roomId,
    required this.code,
    required this.hostUserId,
    required this.gameId,
    required this.phase,
    required this.teamNames,
    required this.seats,
    required this.events,
    required this.series,
    required this.gameStartedAt,
    this.rematchVotes = const {},
    this.cooldownSeconds = 15,
    this.revision = 0,
  });

  final String roomId;

  /// Code other players type to join.
  final String code;
  final String hostUserId;

  /// Id of the current game; a rematch starts a new game in the same room.
  final String gameId;
  final RoomPhase phase;
  final Map<Team, String> teamNames;
  final List<Seat> seats;
  final List<ScoreEvent> events;

  /// Results of previous games in this room (excluding the current one).
  final SeriesTally series;
  final DateTime gameStartedAt;
  final Map<Team, bool> rematchVotes;
  final int cooldownSeconds;

  /// Increases with every host change, so clients can ignore stale copies.
  final int revision;

  static const seatsPerTeam = 2;

  /// Team A sits at even seats, team B at odd seats.
  static List<int> seatIndexesOf(Team team) =>
      team == Team.a ? const [0, 2] : const [1, 3];

  ScoringRules get rules =>
      ScoringRules(teamScoreCooldown: Duration(seconds: cooldownSeconds));

  MatchState get state => MatchState.fromEvents(events, rules: rules);

  Seat? seatOfUser(String userId) {
    for (final s in seats) {
      if (s.userId == userId) return s;
    }
    return null;
  }

  List<Seat> seatsOf(Team team) => seats.where((s) => s.team == team).toList();

  /// A team with no app user on it is marked by the host.
  bool teamHasAppUser(Team team) =>
      seats.any((s) => s.team == team && !s.isGuest);

  int? freeSeatOf(Team team) {
    for (final i in seatIndexesOf(team)) {
      if (!seats.any((s) => s.index == i)) return i;
    }
    return null;
  }

  bool get canStart => Team.values.every((t) => seatsOf(t).isNotEmpty);

  RoomSnapshot copyWith({
    String? gameId,
    RoomPhase? phase,
    List<Seat>? seats,
    List<ScoreEvent>? events,
    SeriesTally? series,
    DateTime? gameStartedAt,
    Map<Team, bool>? rematchVotes,
  }) => RoomSnapshot(
    roomId: roomId,
    code: code,
    hostUserId: hostUserId,
    gameId: gameId ?? this.gameId,
    phase: phase ?? this.phase,
    teamNames: teamNames,
    seats: seats ?? this.seats,
    events: events ?? this.events,
    series: series ?? this.series,
    gameStartedAt: gameStartedAt ?? this.gameStartedAt,
    rematchVotes: rematchVotes ?? this.rematchVotes,
    cooldownSeconds: cooldownSeconds,
    revision: revision + 1,
  );

  /// History record of the current game, once it has a winner.
  MatchRecord toRecord(DateTime finishedAt) {
    final winner = state.winner!;
    return MatchRecord(
      id: gameId,
      teamNames: teamNames,
      seats: seats,
      events: events,
      startedAt: gameStartedAt,
      finishedAt: finishedAt,
      series: series.recordWin(winner),
    );
  }

  Map<String, Object?> toJson() => {
    'roomId': roomId,
    'code': code,
    'hostUserId': hostUserId,
    'gameId': gameId,
    'phase': phase.name,
    'teamNames': {for (final e in teamNames.entries) e.key.name: e.value},
    'seats': [for (final s in seats) s.toJson()],
    'events': [for (final e in events) e.toJson()],
    'series': series.toJson(),
    'gameStartedAt': gameStartedAt.toUtc().toIso8601String(),
    'rematchVotes': {for (final e in rematchVotes.entries) e.key.name: e.value},
    'cooldownSeconds': cooldownSeconds,
    'revision': revision,
  };

  factory RoomSnapshot.fromJson(Map<String, Object?> json) {
    Map<String, Object?> map(Object? o) => (o! as Map).cast<String, Object?>();
    return RoomSnapshot(
      roomId: json['roomId']! as String,
      code: json['code']! as String,
      hostUserId: json['hostUserId']! as String,
      gameId: json['gameId']! as String,
      phase: RoomPhase.values.byName(json['phase']! as String),
      teamNames: {
        for (final e in map(json['teamNames']).entries)
          Team.fromName(e.key): e.value! as String,
      },
      seats: [for (final s in json['seats']! as List) Seat.fromJson(map(s))],
      events: [
        for (final e in json['events']! as List) ScoreEvent.fromJson(map(e)),
      ],
      series: SeriesTally.fromJson(map(json['series'])),
      gameStartedAt: DateTime.parse(json['gameStartedAt']! as String),
      rematchVotes: {
        for (final e in map(json['rematchVotes']).entries)
          Team.fromName(e.key): e.value! as bool,
      },
      cooldownSeconds: json['cooldownSeconds']! as int,
      revision: json['revision']! as int,
    );
  }
}
