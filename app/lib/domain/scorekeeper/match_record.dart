import 'match_state.dart';
import 'score_event.dart';
import 'team.dart';

/// A player sitting at the table. Guests have no [userId].
class Seat {
  const Seat({
    required this.index,
    required this.team,
    required this.name,
    this.userId,
  });

  final int index;
  final Team team;
  final String name;
  final String? userId;

  bool get isGuest => userId == null;

  Map<String, Object?> toJson() => {
    'index': index,
    'team': team.name,
    'name': name,
    'userId': userId,
  };

  factory Seat.fromJson(Map<String, Object?> json) => Seat(
    index: json['index']! as int,
    team: Team.fromName(json['team']! as String),
    name: json['name']! as String,
    userId: json['userId'] as String?,
  );
}

/// Running tally of a rematch chain ("revanche").
class SeriesTally {
  const SeriesTally({required this.id, this.winsA = 0, this.winsB = 0});

  final String id;
  final int winsA;
  final int winsB;

  int winsOf(Team team) => team == Team.a ? winsA : winsB;
  int get gamesPlayed => winsA + winsB;

  SeriesTally recordWin(Team team) => SeriesTally(
    id: id,
    winsA: winsA + (team == Team.a ? 1 : 0),
    winsB: winsB + (team == Team.b ? 1 : 0),
  );

  Map<String, Object?> toJson() => {'id': id, 'winsA': winsA, 'winsB': winsB};

  factory SeriesTally.fromJson(Map<String, Object?> json) => SeriesTally(
    id: json['id']! as String,
    winsA: json['winsA']! as int,
    winsB: json['winsB']! as int,
  );
}

/// A finished game as stored in history.
class MatchRecord {
  const MatchRecord({
    required this.id,
    required this.teamNames,
    required this.seats,
    required this.events,
    required this.startedAt,
    required this.finishedAt,
    required this.series,
  });

  final String id;
  final Map<Team, String> teamNames;
  final List<Seat> seats;
  final List<ScoreEvent> events;
  final DateTime startedAt;
  final DateTime finishedAt;

  /// Series tally including this game.
  final SeriesTally series;

  MatchState get state => MatchState.fromEvents(events);
  Team? get winner => state.winner;

  List<Seat> seatsOf(Team team) =>
      seats.where((s) => s.team == team).toList(growable: false);

  Map<String, Object?> toJson() => {
    'id': id,
    'teamNames': {for (final e in teamNames.entries) e.key.name: e.value},
    'seats': [for (final s in seats) s.toJson()],
    'events': [for (final e in events) e.toJson()],
    'startedAt': startedAt.toUtc().toIso8601String(),
    'finishedAt': finishedAt.toUtc().toIso8601String(),
    'series': series.toJson(),
  };

  factory MatchRecord.fromJson(Map<String, Object?> json) {
    final names = (json['teamNames']! as Map).cast<String, Object?>();
    return MatchRecord(
      id: json['id']! as String,
      teamNames: {
        for (final e in names.entries) Team.fromName(e.key): e.value! as String,
      },
      seats: [
        for (final s in json['seats']! as List)
          Seat.fromJson((s as Map).cast<String, Object?>()),
      ],
      events: [
        for (final e in json['events']! as List)
          ScoreEvent.fromJson((e as Map).cast<String, Object?>()),
      ],
      startedAt: DateTime.parse(json['startedAt']! as String),
      finishedAt: DateTime.parse(json['finishedAt']! as String),
      series: SeriesTally.fromJson(
        (json['series']! as Map).cast<String, Object?>(),
      ),
    );
  }
}
