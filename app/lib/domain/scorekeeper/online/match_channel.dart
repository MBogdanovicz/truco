import 'dart:async';

/// Broadcast pipe shared by every device in an online room.
///
/// Messages are JSON maps. A device does not receive its own messages.
abstract interface class MatchChannel {
  Stream<Map<String, Object?>> get messages;
  Future<void> send(Map<String, Object?> message);
  Future<void> close();
}

/// In-process channel hub, used by tests and as a reference implementation.
class InMemoryChannelHub {
  final _members = <_InMemoryChannel>[];

  MatchChannel connect() {
    final channel = _InMemoryChannel(this);
    _members.add(channel);
    return channel;
  }

  /// Drops a device without it closing cleanly (simulates losing signal).
  void disconnect(MatchChannel channel) => _members.remove(channel);

  void _deliver(_InMemoryChannel from, Map<String, Object?> message) {
    for (final m in List.of(_members)) {
      if (!identical(m, from)) {
        // Asynchronous delivery, like a real network.
        scheduleMicrotask(() {
          if (!m._controller.isClosed) m._controller.add(message);
        });
      }
    }
  }
}

class _InMemoryChannel implements MatchChannel {
  _InMemoryChannel(this._hub);

  final InMemoryChannelHub _hub;
  final _controller = StreamController<Map<String, Object?>>.broadcast();

  @override
  Stream<Map<String, Object?>> get messages => _controller.stream;

  @override
  Future<void> send(Map<String, Object?> message) async {
    if (_hub._members.contains(this)) _hub._deliver(this, message);
  }

  @override
  Future<void> close() async {
    _hub._members.remove(this);
    await _controller.close();
  }
}
