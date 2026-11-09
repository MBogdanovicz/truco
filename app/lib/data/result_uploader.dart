import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../domain/scorekeeper/match_record.dart';
import 'auth_repository.dart';
import 'crash_reporting.dart';
import 'online_room_repository.dart';

/// Uploads finished games, queueing them on the device while offline.
class ResultUploader {
  ResultUploader(this._repo, this._prefs, this._isSignedIn);

  static const _key = 'scorekeeper.pendingUploads.v1';

  final OnlineRoomRepository? _repo;
  final SharedPreferencesAsync _prefs;
  final bool Function() _isSignedIn;

  Future<void> submit(
    MatchRecord record, {
    required MatchTransportKind transport,
    String? roomId,
    bool ranked = true,
    String? groupId,
  }) async {
    if (_repo == null || !_isSignedIn()) return;
    final pending = await _load();
    pending.add({
      'record': record.toJson(),
      'transport': transport.name,
      'roomId': roomId,
      'ranked': ranked,
      'groupId': groupId,
    });
    await _save(pending);
    await flush();
  }

  /// Retries every queued upload; keeps the ones that still fail.
  Future<void> flush() async {
    final repo = _repo;
    if (repo == null || !_isSignedIn()) return;
    final pending = await _load();
    if (pending.isEmpty) return;
    final failed = <Map<String, Object?>>[];
    for (final item in pending) {
      try {
        await repo.saveFinished(
          MatchRecord.fromJson(
            (item['record']! as Map).cast<String, Object?>(),
          ),
          transport: MatchTransportKind.values.byName(
            item['transport']! as String,
          ),
          roomId: item['roomId'] as String?,
          ranked: item['ranked'] as bool? ?? true,
          groupId: item['groupId'] as String?,
        );
      } on Object catch (e) {
        CrashReporting.log('Result upload failed, will retry: $e');
        failed.add(item);
      }
    }
    await _save(failed);
  }

  Future<List<Map<String, Object?>>> _load() async {
    final raw = await _prefs.getStringList(_key) ?? const [];
    return [
      for (final r in raw) (jsonDecode(r) as Map).cast<String, Object?>(),
    ];
  }

  Future<void> _save(List<Map<String, Object?>> items) =>
      _prefs.setStringList(_key, [for (final i in items) jsonEncode(i)]);
}

final resultUploaderProvider = Provider<ResultUploader>((ref) {
  final auth = ref.watch(authRepositoryProvider);
  return ResultUploader(
    ref.watch(onlineRoomRepositoryProvider),
    SharedPreferencesAsync(),
    // Guests have no profile, so the server can't store their games.
    () => auth.currentUser != null && !auth.currentUser!.isGuest,
  );
});
