import 'dart:async';
import 'dart:convert';

import '../../domain/scorekeeper/online/match_channel.dart';
import 'nearby_link.dart';

/// A room as advertised over Nearby: `T1|<roomId>|<hostName>`.
class NearbyRoomAd {
  const NearbyRoomAd({
    required this.endpointId,
    required this.roomId,
    required this.hostName,
  });

  final String endpointId;
  final String roomId;
  final String hostName;

  static const _prefix = 'T1';

  static String encode(String roomId, String hostName) {
    final name = hostName.replaceAll('|', ' ').trim();
    return '$_prefix|$roomId|${name.length > 20 ? name.substring(0, 20) : name}';
  }

  static NearbyRoomAd? decode(String endpointId, String name) {
    final parts = name.split('|');
    if (parts.length < 3 || parts.first != _prefix) return null;
    return NearbyRoomAd(
      endpointId: endpointId,
      roomId: parts[1],
      hostName: parts.sublist(2).join('|'),
    );
  }
}

/// Host side of a Nearby room: a star hub. Every message from a player is
/// passed to the room and relayed to the other players, so the room sees
/// the same broadcast semantics as the online channel.
class NearbyHostChannel implements MatchChannel {
  NearbyHostChannel._(this._link);

  final NearbyLink _link;
  final _peers = <String>{};
  final _messages = StreamController<Map<String, Object?>>.broadcast();
  StreamSubscription<NearbyEvent>? _sub;

  static Future<NearbyHostChannel> open(
    NearbyLink link, {
    required String roomId,
    required String hostName,
  }) async {
    final channel = NearbyHostChannel._(link);
    channel._sub = link.events.listen(channel._onEvent);
    await link.startAdvertising(NearbyRoomAd.encode(roomId, hostName));
    return channel;
  }

  void _onEvent(NearbyEvent e) {
    switch (e) {
      case EndpointConnected():
        _peers.add(e.endpointId);
      case EndpointDisconnected():
        _peers.remove(e.endpointId);
      case PayloadReceived():
        final message = _decode(e.data);
        if (message == null) return;
        final others = _peers.where((p) => p != e.endpointId);
        if (others.isNotEmpty) unawaited(_link.send(others, e.data));
        if (!_messages.isClosed) _messages.add(message);
      case EndpointFound() || EndpointLost():
        break;
    }
  }

  @override
  Stream<Map<String, Object?>> get messages => _messages.stream;

  /// The host is the hub, so its own link is always "up".
  @override
  bool get isConnected => true;

  @override
  Future<void> send(Map<String, Object?> message) async {
    if (_peers.isEmpty) return;
    await _link.send(_peers, jsonEncode(message));
  }

  @override
  Future<void> close() async {
    await _sub?.cancel();
    await _link.stopAll();
    await _messages.close();
  }
}

/// Player side of a Nearby room. If the link to the host drops, it looks
/// for the same room again and reconnects on its own.
class NearbyClientChannel implements MatchChannel {
  NearbyClientChannel._(this._link, this.roomId, this._myName);

  final NearbyLink _link;
  final String roomId;
  final String _myName;
  final _messages = StreamController<Map<String, Object?>>.broadcast();
  StreamSubscription<NearbyEvent>? _sub;
  String? _hostEndpoint;
  String? _connecting;
  bool _closed = false;

  static Future<NearbyClientChannel> open(
    NearbyLink link, {
    required NearbyRoomAd room,
    required String myName,
    Duration timeout = const Duration(seconds: 20),
  }) async {
    final channel = NearbyClientChannel._(link, room.roomId, myName);
    final ready = Completer<void>();
    channel._sub = link.events.listen((e) {
      channel._onEvent(e);
      if (e is EndpointConnected && !ready.isCompleted) ready.complete();
    });
    channel._connecting = room.endpointId;
    await link.connect(room.endpointId, myName);
    try {
      await ready.future.timeout(timeout);
    } on TimeoutException {
      await channel.close();
      rethrow;
    }
    await link.stopDiscovery();
    return channel;
  }

  void _onEvent(NearbyEvent e) {
    switch (e) {
      case EndpointConnected():
        if (e.endpointId == _connecting) {
          _hostEndpoint = e.endpointId;
          _connecting = null;
          unawaited(_link.stopDiscovery());
        }
      case EndpointDisconnected():
        if (e.endpointId == _hostEndpoint || e.endpointId == _connecting) {
          _hostEndpoint = null;
          _connecting = null;
          if (!_closed) unawaited(_link.startDiscovery().catchError((_) {}));
        }
      case EndpointFound():
        final ad = NearbyRoomAd.decode(e.endpointId, e.name);
        if (ad?.roomId == roomId &&
            _hostEndpoint == null &&
            _connecting == null) {
          _connecting = e.endpointId;
          unawaited(
            _link.connect(e.endpointId, _myName).catchError((_) {
              _connecting = null;
            }),
          );
        }
      case PayloadReceived():
        if (e.endpointId != _hostEndpoint) return;
        final message = _decode(e.data);
        if (message != null && !_messages.isClosed) _messages.add(message);
      case EndpointLost():
        break;
    }
  }

  @override
  Stream<Map<String, Object?>> get messages => _messages.stream;

  @override
  bool get isConnected => _hostEndpoint != null;

  @override
  Future<void> send(Map<String, Object?> message) async {
    final host = _hostEndpoint;
    if (host == null) return;
    await _link.send([host], jsonEncode(message));
  }

  @override
  Future<void> close() async {
    _closed = true;
    await _sub?.cancel();
    await _link.stopAll();
    await _messages.close();
  }
}

Map<String, Object?>? _decode(String data) {
  try {
    final value = jsonDecode(data);
    return value is Map ? value.cast<String, Object?>() : null;
  } on FormatException {
    return null;
  }
}
