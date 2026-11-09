import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Remembers the code of the last online room this device was in, so a
/// player who left (or closed the app) can go back without retyping it.
class LastRoomRepository {
  LastRoomRepository(this._prefs);

  static const _key = 'scorekeeper.lastRoom.v1';

  /// After this long the room is most likely over.
  static const maxAge = Duration(hours: 6);

  final SharedPreferencesAsync _prefs;

  Future<String?> load() async {
    final raw = await _prefs.getString(_key);
    if (raw == null) return null;
    final [code, at] = raw.split('|');
    final saved = DateTime.tryParse(at);
    if (saved == null || DateTime.now().difference(saved) > maxAge) {
      await clear();
      return null;
    }
    return code;
  }

  Future<void> save(String code) => _prefs.setString(
    _key,
    '$code|${DateTime.now().toUtc().toIso8601String()}',
  );

  Future<void> clear() => _prefs.remove(_key);
}

final lastRoomRepositoryProvider = Provider<LastRoomRepository>(
  (ref) => LastRoomRepository(SharedPreferencesAsync()),
);

final lastRoomCodeProvider = FutureProvider<String?>(
  (ref) => ref.watch(lastRoomRepositoryProvider).load(),
);
