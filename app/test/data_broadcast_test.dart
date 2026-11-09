import 'package:flutter_test/flutter_test.dart';
import 'package:truco/data/online_room_repository.dart';

void main() {
  test('our message type survives the broadcast envelope', () {
    // What realtime_client sends and delivers for
    // sendBroadcastMessage(event: 'msg', payload: {'payload': message}).
    final envelope = <String, dynamic>{
      'type': 'broadcast',
      'event': 'msg',
      'payload': {'type': 'hello', 'userId': 'u1', 'name': 'Ana'},
    };
    expect(SupabaseMatchChannel.unwrapBroadcast(envelope), {
      'type': 'hello',
      'userId': 'u1',
      'name': 'Ana',
    });
    expect(SupabaseMatchChannel.unwrapBroadcast({'type': 'broadcast'}), isNull);
  });
}
