import 'dart:async';
import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../domain/scorekeeper/match_record.dart';
import '../domain/scorekeeper/online/match_channel.dart';
import 'auth_repository.dart';
import 'ids.dart';

enum MatchTransportKind { online, nearby, singleDevice }

extension on MatchTransportKind {
  String get dbName => switch (this) {
    MatchTransportKind.online => 'online',
    MatchTransportKind.nearby => 'nearby',
    MatchTransportKind.singleDevice => 'single_device',
  };
}

class RoomNotFound implements Exception {}

/// Rooms (join codes), Realtime channels and saved results in Supabase.
class OnlineRoomRepository {
  OnlineRoomRepository(this._client);

  final SupabaseClient _client;
  static final _random = Random.secure();

  /// No 0/O or 1/I, which are easy to confuse when read aloud.
  static const _alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  static String generateCode() => List.generate(
    6,
    (_) => _alphabet[_random.nextInt(_alphabet.length)],
  ).join();

  /// Registers a new room and returns its id and join code.
  Future<({String id, String code})> createRoom() async {
    final id = newUuid();
    for (var attempt = 0; ; attempt++) {
      final code = generateCode();
      try {
        await _client.from('rooms').insert({'id': id, 'code': code});
        return (id: id, code: code);
      } on PostgrestException catch (e) {
        // 23505: another open room already uses this code.
        if (e.code != '23505' || attempt >= 4) rethrow;
      }
    }
  }

  Future<String> findOpenRoom(String code) async {
    final row = await _client
        .from('rooms')
        .select('id')
        .eq('code', code.trim().toUpperCase())
        .isFilter('closed_at', null)
        .maybeSingle();
    if (row == null) throw RoomNotFound();
    return row['id'] as String;
  }

  Future<void> closeRoom(String roomId) => _client
      .from('rooms')
      .update({'closed_at': DateTime.now().toUtc().toIso8601String()})
      .eq('id', roomId);

  /// Joins the room's broadcast channel and waits until it is live.
  Future<MatchChannel> connect(String roomId) =>
      SupabaseMatchChannel.open(_client, roomId);

  /// Uploads a finished game. Safe to retry: the server ignores duplicates.
  Future<void> saveFinished(
    MatchRecord record, {
    required MatchTransportKind transport,
    String? roomId,
  }) => _client.rpc(
    'finish_match',
    params: {
      'p_record': record.toJson(),
      'p_transport': transport.dbName,
      'p_room_id': roomId,
    },
  );
}

/// [MatchChannel] over a Supabase Realtime broadcast channel.
class SupabaseMatchChannel implements MatchChannel {
  SupabaseMatchChannel._(this._client, this._channel);

  static const _event = 'msg';

  final SupabaseClient _client;
  final RealtimeChannel _channel;
  final _messages = StreamController<Map<String, Object?>>.broadcast();

  static Future<SupabaseMatchChannel> open(
    SupabaseClient client,
    String roomId,
  ) {
    final channel = client.channel('room:$roomId');
    final result = SupabaseMatchChannel._(client, channel);
    final ready = Completer<SupabaseMatchChannel>();
    channel.onBroadcast(event: _event, callback: result._onPayload).subscribe((
      status,
      error,
    ) {
      if (ready.isCompleted) return;
      if (status == RealtimeSubscribeStatus.subscribed) {
        ready.complete(result);
      } else if (status == RealtimeSubscribeStatus.channelError ||
          status == RealtimeSubscribeStatus.timedOut) {
        ready.completeError(
          error ?? TimeoutException('Realtime subscription failed'),
        );
      }
    });
    return ready.future.timeout(const Duration(seconds: 15));
  }

  void _onPayload(Map<String, dynamic> payload) {
    // Depending on the client version the callback gets the whole broadcast
    // envelope or just its payload.
    final inner = payload['type'] == 'broadcast' && payload['payload'] is Map
        ? (payload['payload'] as Map).cast<String, Object?>()
        : payload.cast<String, Object?>();
    if (!_messages.isClosed) _messages.add(inner);
  }

  @override
  Stream<Map<String, Object?>> get messages => _messages.stream;

  @override
  Future<void> send(Map<String, Object?> message) async {
    await _channel.sendBroadcastMessage(
      event: _event,
      payload: message.cast<String, dynamic>(),
    );
  }

  @override
  Future<void> close() async {
    await _client.removeChannel(_channel);
    await _messages.close();
  }
}

final onlineRoomRepositoryProvider = Provider<OnlineRoomRepository?>((ref) {
  final client = ref.watch(supabaseClientProvider);
  return client == null ? null : OnlineRoomRepository(client);
});
