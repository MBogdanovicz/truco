import 'package:flutter/foundation.dart';

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
    bool ranked = true,
    String? groupId,
  }) => _client.rpc(
    'finish_match',
    params: {
      'p_record': record.toJson(),
      'p_transport': transport.dbName,
      'p_room_id': roomId,
      'p_mode': ranked ? 'ranked' : 'friendly',
      'p_group_id': groupId,
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
    final message = unwrapBroadcast(payload);
    if (message != null && !_messages.isClosed) _messages.add(message);
  }

  /// Extracts our message from a received broadcast envelope
  /// (`{type: broadcast, event: msg, payload: {...}}`).
  @visibleForTesting
  static Map<String, Object?>? unwrapBroadcast(Map<String, dynamic> envelope) {
    final inner = envelope['payload'];
    return inner is Map ? Map<String, Object?>.from(inner) : null;
  }

  @override
  Stream<Map<String, Object?>> get messages => _messages.stream;

  /// False once the socket drops or the channel is rejoining.
  @override
  bool get isConnected => _channel.canPush;

  @override
  Future<void> send(Map<String, Object?> message) async {
    // The client writes its own `type`/`event` keys into the map it is
    // given, which would clobber our message `type`; nest our message under
    // `payload`, the standard broadcast envelope field.
    await _channel.sendBroadcastMessage(
      event: _event,
      payload: {'payload': Map<String, dynamic>.from(message)},
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
