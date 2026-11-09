import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../domain/scorekeeper/match_record.dart';

/// Finished games stored on the device, newest first.
///
/// Ranked results are also uploaded to Supabase (milestone M3); this local
/// copy keeps history available offline.
class MatchHistoryRepository {
  MatchHistoryRepository(this._prefs);

  static const _key = 'scorekeeper.history.v1';
  static const maxEntries = 200;

  final SharedPreferencesAsync _prefs;

  Future<List<MatchRecord>> load() async {
    final raw = await _prefs.getStringList(_key) ?? const [];
    final records = <MatchRecord>[];
    for (final entry in raw) {
      try {
        records.add(
          MatchRecord.fromJson(
            (jsonDecode(entry) as Map).cast<String, Object?>(),
          ),
        );
      } on Object {
        // Skip corrupted entries instead of losing the whole history.
      }
    }
    return records;
  }

  Future<void> add(MatchRecord record) async {
    final raw = await _prefs.getStringList(_key) ?? const [];
    final updated = [
      jsonEncode(record.toJson()),
      ...raw,
    ].take(maxEntries).toList();
    await _prefs.setStringList(_key, updated);
  }

  Future<void> clear() => _prefs.remove(_key);
}

final matchHistoryRepositoryProvider = Provider<MatchHistoryRepository>(
  (ref) => MatchHistoryRepository(SharedPreferencesAsync()),
);

final matchHistoryProvider = FutureProvider<List<MatchRecord>>(
  (ref) => ref.watch(matchHistoryRepositoryProvider).load(),
);
