import 'dart:async';

import 'package:flutter/services.dart';

/// Something Nearby Connections reported.
sealed class NearbyEvent {
  const NearbyEvent(this.endpointId);
  final String endpointId;
}

/// A device advertising a room was found while discovering.
class EndpointFound extends NearbyEvent {
  const EndpointFound(super.endpointId, this.name);
  final String name;
}

class EndpointLost extends NearbyEvent {
  const EndpointLost(super.endpointId);
}

/// A connection is up (both sides accept automatically).
class EndpointConnected extends NearbyEvent {
  const EndpointConnected(super.endpointId);
}

/// A connection attempt failed, or a connection dropped.
class EndpointDisconnected extends NearbyEvent {
  const EndpointDisconnected(super.endpointId);
}

class PayloadReceived extends NearbyEvent {
  const PayloadReceived(super.endpointId, this.data);
  final String data;
}

/// Device-to-device link (Google Nearby Connections on Android).
abstract interface class NearbyLink {
  Stream<NearbyEvent> get events;

  /// Asks for the Bluetooth/Wi-Fi/location permissions Nearby needs.
  Future<bool> ensurePermissions();
  Future<void> startAdvertising(String name);
  Future<void> stopAdvertising();
  Future<void> startDiscovery();
  Future<void> stopDiscovery();
  Future<void> connect(String endpointId, String name);
  Future<void> send(Iterable<String> endpointIds, String data);
  Future<void> disconnect(String endpointId);
  Future<void> stopAll();
}

/// [NearbyLink] backed by the Kotlin bridge in MainActivity (NearbyBridge).
class PlatformNearbyLink implements NearbyLink {
  PlatformNearbyLink();

  static const _methods = MethodChannel('truco/nearby');
  static const _eventChannel = EventChannel('truco/nearby/events');

  @override
  late final Stream<NearbyEvent> events = _eventChannel
      .receiveBroadcastStream()
      .map((raw) => _parse((raw as Map).cast<String, Object?>()))
      .where((e) => e != null)
      .cast<NearbyEvent>()
      .asBroadcastStream();

  static NearbyEvent? _parse(Map<String, Object?> m) {
    final id = m['endpointId'] as String? ?? '';
    return switch (m['type']) {
      'found' => EndpointFound(id, m['name'] as String? ?? ''),
      'lost' => EndpointLost(id),
      'connected' => EndpointConnected(id),
      'rejected' || 'disconnected' => EndpointDisconnected(id),
      'payload' => PayloadReceived(id, m['data'] as String? ?? ''),
      _ => null,
    };
  }

  @override
  Future<bool> ensurePermissions() async =>
      await _methods.invokeMethod<bool>('ensurePermissions') ?? false;

  @override
  Future<void> startAdvertising(String name) =>
      _methods.invokeMethod('startAdvertising', {'name': name});

  @override
  Future<void> stopAdvertising() => _methods.invokeMethod('stopAdvertising');

  @override
  Future<void> startDiscovery() => _methods.invokeMethod('startDiscovery');

  @override
  Future<void> stopDiscovery() => _methods.invokeMethod('stopDiscovery');

  @override
  Future<void> connect(String endpointId, String name) => _methods.invokeMethod(
    'connect',
    {'endpointId': endpointId, 'name': name},
  );

  @override
  Future<void> send(Iterable<String> endpointIds, String data) =>
      _methods.invokeMethod('send', {
        'endpointIds': endpointIds.toList(),
        'data': data,
      });

  @override
  Future<void> disconnect(String endpointId) =>
      _methods.invokeMethod('disconnect', {'endpointId': endpointId});

  @override
  Future<void> stopAll() => _methods.invokeMethod('stopAll');
}
