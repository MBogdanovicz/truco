import 'dart:async';
import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:truco/data/nearby/nearby_link.dart';
import 'package:truco/data/nearby/nearby_match_channel.dart';

class FakeLink implements NearbyLink {
  final events$ = StreamController<NearbyEvent>.broadcast();
  final sent = <(List<String>, String)>[];
  final connects = <String>[];
  String? advertised;
  var discovering = false;

  @override
  Stream<NearbyEvent> get events => events$.stream;
  @override
  Future<bool> ensurePermissions() async => true;
  @override
  Future<void> startAdvertising(String name) async => advertised = name;
  @override
  Future<void> stopAdvertising() async {}
  @override
  Future<void> startDiscovery() async => discovering = true;
  @override
  Future<void> stopDiscovery() async => discovering = false;
  @override
  Future<void> connect(String endpointId, String name) async =>
      connects.add(endpointId);
  @override
  Future<void> send(Iterable<String> ids, String data) async =>
      sent.add((ids.toList(), data));
  @override
  Future<void> disconnect(String endpointId) async {}
  @override
  Future<void> stopAll() async {}
}

void main() {
  Future<void> settle() => Future<void>.delayed(Duration.zero);

  test('room ads round trip', () {
    final ad = NearbyRoomAd.decode('e1', NearbyRoomAd.encode('r1', 'Ana|Bia'));
    expect(ad!.roomId, 'r1');
    expect(ad.hostName, 'Ana Bia');
    expect(NearbyRoomAd.decode('e2', 'other app'), isNull);
  });

  test('host relays player messages to the other players', () async {
    final link = FakeLink();
    final host = await NearbyHostChannel.open(
      link,
      roomId: 'r1',
      hostName: 'Ana',
    );
    expect(link.advertised, startsWith('T1|r1|'));
    final received = <Map<String, Object?>>[];
    host.messages.listen(received.add);
    link.events$
      ..add(const EndpointConnected('p1'))
      ..add(const EndpointConnected('p2'))
      ..add(PayloadReceived('p1', jsonEncode({'type': 'hello'})));
    await settle();
    expect(received.single['type'], 'hello');
    expect(link.sent.single.$1, ['p2']);

    await host.send({'type': 'snapshot'});
    expect(link.sent.last.$1, unorderedEquals(['p1', 'p2']));
  });

  test('player reconnects to the same room after a drop', () async {
    final link = FakeLink();
    final opening = NearbyClientChannel.open(
      link,
      room: const NearbyRoomAd(endpointId: 'h1', roomId: 'r1', hostName: 'Ana'),
      myName: 'Bia',
    );
    await settle();
    link.events$.add(const EndpointConnected('h1'));
    final client = await opening;
    expect(client.isConnected, isTrue);

    link.events$.add(const EndpointDisconnected('h1'));
    await settle();
    expect(client.isConnected, isFalse);
    expect(link.discovering, isTrue);

    link.events$
      ..add(EndpointFound('x9', NearbyRoomAd.encode('other', 'Caio')))
      ..add(EndpointFound('h2', NearbyRoomAd.encode('r1', 'Ana')));
    await settle();
    expect(link.connects.last, 'h2');
    link.events$.add(const EndpointConnected('h2'));
    await settle();
    expect(client.isConnected, isTrue);
    await client.send({'type': 'ping'});
    expect(link.sent.last.$1, ['h2']);
  });
}
