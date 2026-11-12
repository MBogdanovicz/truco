import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/game_room_repository.dart';
import '../../data/match_history_repository.dart';
import '../../data/tournaments.dart';
import '../../domain/game/table_view.dart';
import '../../domain/scorekeeper/match_record.dart';
import '../../domain/scorekeeper/score_event.dart';
import '../../domain/scorekeeper/team.dart';

/// A finished game of a tournament match, as a history entry ("Torneio
/// 'name'" where the group goes).
MatchRecord tournamentRecord(
  GameRoomSnapshot room,
  TableView last, {
  String? tournamentName,
  DateTime? now,
}) {
  final at = now ?? DateTime.now();
  String names(Team t) => [
    for (final s in room.seats)
      if ((s.seat.isEven ? Team.a : Team.b) == t) s.name,
  ].join(' e ');
  final games = room.wins.$1 + room.wins.$2;
  return MatchRecord(
    id: '${room.id}-$games',
    teamNames: {Team.a: names(Team.a), Team.b: names(Team.b)},
    seats: [
      for (final s in room.seats)
        Seat(
          index: s.seat,
          team: s.seat.isEven ? Team.a : Team.b,
          name: s.name,
          userId: s.isGuest ? null : s.userId,
        ),
    ],
    events: [
      for (final (i, t) in Team.values.indexed)
        ScoreEvent(
          seq: i + 1,
          kind: ScoreEventKind.score,
          team: t,
          authorSeat: 0,
          timestamp: at,
          delta: last.scoreOf(t),
        ),
    ],
    startedAt: at,
    finishedAt: at,
    series: SeriesTally(id: room.id, winsA: room.wins.$1, winsB: room.wins.$2),
    ranked: room.ranked,
    groupName: 'Torneio${tournamentName == null ? '' : ' $tournamentName'}',
  );
}

/// Saves it to this device's history (once per game).
Future<void> saveTournamentGame(
  Ref ref,
  GameRoomSnapshot room,
  TableView last,
) async {
  try {
    String? name;
    try {
      name = await ref
          .read(tournamentsRepositoryProvider)
          ?.nameOfMatch(room.tournamentMatchId!);
    } on Object {
      name = null;
    }
    final record = tournamentRecord(room, last, tournamentName: name);
    final repo = ref.read(matchHistoryRepositoryProvider);
    final saved = await repo.load();
    if (saved.any((r) => r.id == record.id)) return;
    await repo.add(record);
    ref.invalidate(matchHistoryProvider);
  } on Object catch (e) {
    debugPrint('Tournament history: $e');
  }
}
