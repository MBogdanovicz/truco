import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../domain/game/ai.dart';
import '../domain/game/rules.dart';
import '../domain/game/table_view.dart';
import 'auth_repository.dart';

enum GameRoomStatus { lobby, playing, finished, closed }

class GameSeat {
  const GameSeat({
    required this.seat,
    required this.userId,
    required this.name,
    this.isGuest = false,
  });

  final int seat;
  final String userId;
  final String name;
  final bool isGuest;
}

/// A game room as one person sees it: the room, who sits where, and the
/// frames of the last change to their own view of the table.
class GameRoomSnapshot {
  const GameRoomSnapshot({
    required this.id,
    required this.code,
    required this.hostId,
    required this.status,
    required this.rules,
    required this.botLevel,
    required this.ranked,
    required this.groupId,
    required this.bots,
    required this.wins,
    required this.seats,
    this.viewVersion = 0,
    this.frames = const [],
    this.turnDeadline,
  });

  final String id;
  final String code;
  final String hostId;
  final GameRoomStatus status;
  final TrucoRules rules;
  final AiLevel botLevel;
  final bool ranked;
  final String? groupId;

  /// Computer level per seat in the current game (null: a person).
  final List<AiLevel?> bots;

  /// Games won by team A and B in this room.
  final (int, int) wins;
  final List<GameSeat> seats;
  final int viewVersion;
  final List<TableView> frames;

  /// When the person the game waits for runs out of time.
  final DateTime? turnDeadline;

  GameSeat? seatOf(String userId) =>
      seats.where((s) => s.userId == userId).firstOrNull;
  GameSeat? at(int seat) => seats.where((s) => s.seat == seat).firstOrNull;

  /// Ranked games need four people with e-mail accounts.
  bool get rankable => seats.length == 4 && seats.every((s) => !s.isGuest);

  static GameRoomSnapshot fromRows(
    Map<String, dynamic> room,
    List<Map<String, dynamic>> seats,
    Map<String, dynamic>? view,
  ) {
    AiLevel? level(Object? v) =>
        v == null ? null : AiLevel.values.asNameMap()[v as String];
    return GameRoomSnapshot(
      id: room['id'] as String,
      code: room['code'] as String,
      hostId: room['host_id'] as String,
      status: GameRoomStatus.values.byName(room['status'] as String),
      rules: TrucoRules.fromJson(
        Map<String, Object?>.from((room['rules'] as Map?) ?? const {}),
      ),
      botLevel: level(room['bot_level']) ?? AiLevel.medium,
      ranked: room['mode'] == 'ranked',
      groupId: room['group_id'] as String?,
      bots: [for (final b in (room['bots'] as List?) ?? const []) level(b)],
      wins: ((room['wins_a'] as int?) ?? 0, (room['wins_b'] as int?) ?? 0),
      seats: [
        for (final s in seats)
          GameSeat(
            seat: s['seat'] as int,
            userId: s['user_id'] as String,
            name: (s['name'] as String?) ?? '',
            isGuest: s['is_guest'] == true,
          ),
      ]..sort((a, b) => a.seat.compareTo(b.seat)),
      turnDeadline: DateTime.tryParse((room['turn_deadline'] as String?) ?? ''),
      viewVersion: (view?['version'] as int?) ?? 0,
      frames: [
        for (final f in (view?['frames'] as List?) ?? const [])
          TableView.fromJson(Map<String, Object?>.from(f as Map)),
      ],
    );
  }
}

/// Why the server refused a request (see supabase/functions/game).
class GameRoomError implements Exception {
  const GameRoomError(this.code);
  final String code;

  String get message => switch (code) {
    'room_not_found' => 'Nenhuma sala aberta com esse código.',
    'room_full' => 'A sala está cheia.',
    'game_started' => 'A partida já começou.',
    'seat_taken' => 'Esse lugar já foi ocupado.',
    'account_required' => 'Entre com seu e-mail para criar salas.',
    'not_host' => 'Só quem criou a sala pode fazer isso.',
    'illegal_move' || 'not_playing' => 'Essa jogada não vale agora.',
    'busy' => 'A mesa está ocupada, tente de novo.',
    _ => 'O servidor recusou ($code). Tente de novo.',
  };

  @override
  String toString() => 'GameRoomError($code)';
}

/// The caller's own frames, returned right away by a move.
typedef ViewUpdate = ({int version, List<TableView> frames});

ViewUpdate? viewUpdateFrom(Map<String, dynamic> r) {
  final version = r['version'];
  if (version is! int) return null;
  return (
    version: version,
    frames: [
      for (final f in (r['frames'] as List?) ?? const [])
        TableView.fromJson(Map<String, Object?>.from(f as Map)),
    ],
  );
}

/// A live room: snapshots on every change, and [refresh] to ask again.
abstract class GameRoomWatch {
  Stream<GameRoomSnapshot> get snapshots;
  Future<void> refresh();
  Future<void> close();
}

/// Online game rooms. The server judges the game; this only sends requests
/// and follows the room.
abstract class GameRoomBackend {
  String? get userId;

  Future<({String roomId, String code})> create({
    required TrucoRules rules,
    required AiLevel botLevel,
    required bool ranked,
  });
  Future<({String roomId, String code})> join(String code);
  Future<void> sit(String roomId, int seat);
  Future<void> options(
    String roomId, {
    AiLevel? botLevel,
    bool? ranked,
    String? Function()? groupId,
  });
  Future<void> start(String roomId);
  Future<ViewUpdate?> act(String roomId, Map<String, Object?> action);

  /// Asks the computer to move for whoever ran out of time (the server
  /// checks the deadline); null when it isn't time yet.
  Future<ViewUpdate?> timeout(String roomId);
  Future<void> leave(String roomId);
  GameRoomWatch watch(String roomId);
}

class SupabaseGameRooms implements GameRoomBackend {
  SupabaseGameRooms(this._client);

  final SupabaseClient _client;

  @override
  String? get userId => _client.auth.currentUser?.id;

  Future<Map<String, dynamic>> _call(
    String action,
    Map<String, Object?> body,
  ) async {
    try {
      final res = await _client.functions.invoke(
        'game',
        body: {'action': action, ...body},
      );
      final data = res.data;
      return data is Map ? Map<String, dynamic>.from(data) : const {};
    } on FunctionException catch (e) {
      final details = e.details;
      if (details is Map && details['error'] is String) {
        throw GameRoomError(details['error'] as String);
      }
      rethrow;
    }
  }

  ({String roomId, String code}) _room(Map<String, dynamic> r) =>
      (roomId: r['roomId'] as String, code: r['code'] as String);

  @override
  Future<({String roomId, String code})> create({
    required TrucoRules rules,
    required AiLevel botLevel,
    required bool ranked,
  }) async => _room(
    await _call('create', {
      'rules': rules.toJson(),
      'botLevel': botLevel.name,
      'mode': ranked ? 'ranked' : 'friendly',
    }),
  );

  @override
  Future<({String roomId, String code})> join(String code) async =>
      _room(await _call('join', {'code': code}));

  @override
  Future<void> sit(String roomId, int seat) =>
      _call('sit', {'roomId': roomId, 'seat': seat});

  @override
  Future<void> options(
    String roomId, {
    AiLevel? botLevel,
    bool? ranked,
    String? Function()? groupId,
  }) => _call('options', {
    'roomId': roomId,
    if (botLevel != null) 'botLevel': botLevel.name,
    if (ranked != null) 'mode': ranked ? 'ranked' : 'friendly',
    if (groupId != null) 'groupId': groupId(),
  });

  @override
  Future<void> start(String roomId) => _call('start', {'roomId': roomId});

  @override
  Future<ViewUpdate?> act(String roomId, Map<String, Object?> action) async =>
      viewUpdateFrom(await _call('act', {'roomId': roomId, 'move': action}));

  @override
  Future<ViewUpdate?> timeout(String roomId) async =>
      viewUpdateFrom(await _call('timeout', {'roomId': roomId}));

  @override
  Future<void> leave(String roomId) => _call('leave', {'roomId': roomId});

  @override
  GameRoomWatch watch(String roomId) => _SupabaseRoomWatch(_client, roomId);
}

class _SupabaseRoomWatch implements GameRoomWatch {
  _SupabaseRoomWatch(this._client, this._roomId) {
    PostgresChangeFilter by(String column) => PostgresChangeFilter(
      type: PostgresChangeFilterType.eq,
      column: column,
      value: _roomId,
    );
    void changed(PostgresChangePayload _) => refresh();
    _channel = _client.channel('game:$_roomId')
      ..onPostgresChanges(
        event: PostgresChangeEvent.all,
        schema: 'public',
        table: 'game_rooms',
        filter: by('id'),
        callback: changed,
      )
      ..onPostgresChanges(
        event: PostgresChangeEvent.all,
        schema: 'public',
        table: 'game_seats',
        filter: by('room_id'),
        callback: changed,
      )
      ..onPostgresChanges(
        event: PostgresChangeEvent.all,
        schema: 'public',
        table: 'game_views',
        filter: by('room_id'),
        callback: changed,
      )
      ..subscribe((status, _) {
        if (status == RealtimeSubscribeStatus.subscribed) refresh();
      });
    // In case a change notice gets lost (phone asleep, flaky network).
    _poll = Timer.periodic(const Duration(seconds: 15), (_) => refresh());
    refresh();
  }

  final SupabaseClient _client;
  final String _roomId;
  late final RealtimeChannel _channel;
  late final Timer _poll;
  final _out = StreamController<GameRoomSnapshot>.broadcast();
  Future<void>? _running;
  bool _again = false;

  @override
  Stream<GameRoomSnapshot> get snapshots => _out.stream;

  /// Reads the room again; calls during a read are folded into one more.
  @override
  Future<void> refresh() {
    if (_running != null) {
      _again = true;
      return _running!;
    }
    return _running = _read().whenComplete(() {
      _running = null;
      if (_again) {
        _again = false;
        refresh();
      }
    });
  }

  Future<void> _read() async {
    final me = _client.auth.currentUser?.id;
    try {
      final results = await Future.wait<Object?>([
        _client.from('game_rooms').select().eq('id', _roomId).maybeSingle(),
        _client.from('game_seats').select().eq('room_id', _roomId),
        if (me != null)
          _client
              .from('game_views')
              .select('version, frames')
              .eq('room_id', _roomId)
              .eq('user_id', me)
              .maybeSingle(),
      ]);
      final room = results[0] as Map<String, dynamic>?;
      if (_out.isClosed) return;
      if (room == null) {
        _out.addError(const GameRoomError('room_not_found'));
        return;
      }
      _out.add(
        GameRoomSnapshot.fromRows(
          room,
          List<Map<String, dynamic>>.from(results[1] as List),
          results.length > 2 ? results[2] as Map<String, dynamic>? : null,
        ),
      );
    } on Object catch (e) {
      debugPrint('Game room read failed: $e');
    }
  }

  @override
  Future<void> close() async {
    _poll.cancel();
    await _client.removeChannel(_channel);
    await _out.close();
  }
}

final gameRoomBackendProvider = Provider<GameRoomBackend?>((ref) {
  final client = ref.watch(supabaseClientProvider);
  return client == null ? null : SupabaseGameRooms(client);
});
