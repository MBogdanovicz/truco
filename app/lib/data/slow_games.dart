import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/game/rules.dart';
import 'auth_repository.dart';

/// A "partida lenta" the signed-in person is seated in.
class SlowGame {
  const SlowGame({
    required this.roomId,
    required this.code,
    required this.playing,
    required this.myTurn,
    required this.days,
    this.deadline,
    this.people = 0,
  });

  final String roomId;
  final String code;

  /// False while the room waits for 4 people (or between games).
  final bool playing;
  final bool myTurn;
  final int days;
  final DateTime? deadline;

  /// People seated (for a room still waiting).
  final int people;
}

/// The person's slow games, their turn first. Listed on the home screen so
/// a lost push doesn't lose the game.
final slowGamesProvider = FutureProvider.autoDispose<List<SlowGame>>((
  ref,
) async {
  final user = ref.watch(currentUserProvider).value;
  final client = ref.watch(supabaseClientProvider);
  if (user == null || user.isGuest || client == null) return const [];
  try {
    final mine = await client
        .from('game_seats')
        .select('seat, game_rooms!inner(*)')
        .eq('user_id', user.id)
        .timeout(const Duration(seconds: 8));
    final games = <SlowGame>[];
    final roomIds = <String>[];
    for (final row in mine) {
      final room = Map<String, dynamic>.from(row['game_rooms'] as Map);
      final rules = TrucoRules.fromJson(
        Map<String, Object?>.from((room['rules'] as Map?) ?? const {}),
      );
      final status = room['status'] as String?;
      if (!rules.isSlow || (status != 'lobby' && status != 'playing')) {
        continue;
      }
      final playing = status == 'playing';
      roomIds.add(room['id'] as String);
      games.add(
        SlowGame(
          roomId: room['id'] as String,
          code: room['code'] as String,
          playing: playing,
          myTurn: playing && room['waiting_seat'] == row['seat'],
          days: rules.slowDays,
          deadline: DateTime.tryParse((room['turn_deadline'] as String?) ?? '')
              ?.toLocal(),
        ),
      );
    }
    if (games.any((g) => !g.playing)) {
      // How many are already seated in the rooms still waiting.
      final seats = await client
          .from('game_seats')
          .select('room_id')
          .inFilter('room_id', roomIds);
      final count = <String, int>{};
      for (final s in seats) {
        final id = s['room_id'] as String;
        count[id] = (count[id] ?? 0) + 1;
      }
      for (var i = 0; i < games.length; i++) {
        final g = games[i];
        if (!g.playing) {
          games[i] = SlowGame(
            roomId: g.roomId,
            code: g.code,
            playing: false,
            myTurn: false,
            days: g.days,
            people: count[g.roomId] ?? 1,
          );
        }
      }
    }
    games.sort((a, b) {
      if (a.myTurn != b.myTurn) return a.myTurn ? -1 : 1;
      if (a.playing != b.playing) return a.playing ? -1 : 1;
      return 0;
    });
    return games;
  } on Object {
    return const [];
  }
});
