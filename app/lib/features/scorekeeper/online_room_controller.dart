import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/auth_repository.dart';
import '../../data/ids.dart';
import '../../data/match_history_repository.dart';
import '../../data/online_room_repository.dart';
import '../../data/result_uploader.dart';
import '../../domain/scorekeeper/match_engine.dart';
import '../../domain/scorekeeper/match_record.dart';
import '../../domain/scorekeeper/online/online_room.dart';
import '../../domain/scorekeeper/online/room_snapshot.dart';
import '../../domain/scorekeeper/team.dart';

/// What the online screens render.
class OnlineRoomView {
  const OnlineRoomView({required this.room, this.snapshot, this.lastRejection});

  final OnlineRoom room;

  /// Null while a joining device waits for the host's first snapshot.
  final RoomSnapshot? snapshot;

  /// Most recent refusal from the host, shown as a toast.
  final (IntentRejection, DateTime)? lastRejection;

  OnlineRoomView copyWith({
    RoomSnapshot? snapshot,
    (IntentRejection, DateTime)? lastRejection,
  }) => OnlineRoomView(
    room: room,
    snapshot: snapshot ?? this.snapshot,
    lastRejection: lastRejection ?? this.lastRejection,
  );
}

/// Creates or joins an online room and keeps the UI in sync with it.
class OnlineRoomController extends Notifier<OnlineRoomView?> {
  final _subs = <StreamSubscription<Object?>>[];

  /// Kept outside [state] because state cannot be read during disposal.
  OnlineRoom? _room;

  @override
  OnlineRoomView? build() {
    ref.onDispose(_teardown);
    return null;
  }

  OnlineRoomRepository get _repo => ref.read(onlineRoomRepositoryProvider)!;

  RoomMember _me() {
    final user = ref.read(authRepositoryProvider).currentUser!;
    return RoomMember(userId: user.id, name: user.displayName ?? '');
  }

  Future<void> create() async {
    await leave();
    final me = _me();
    final created = await _repo.createRoom();
    final channel = await _repo.connect(created.id);
    final room = OnlineRoom.host(
      channel: channel,
      me: me,
      newId: newUuid,
      initial: RoomSnapshot(
        roomId: created.id,
        code: created.code,
        hostUserId: me.userId,
        gameId: newUuid(),
        phase: RoomPhase.lobby,
        teamNames: const {Team.a: 'Dupla 1', Team.b: 'Dupla 2'},
        seats: [Seat(index: 0, team: Team.a, name: me.name, userId: me.userId)],
        events: const [],
        series: SeriesTally(id: created.id),
        gameStartedAt: DateTime.now(),
      ),
    );
    await _attach(room);
  }

  /// Throws [RoomNotFound] when the code does not match an open room.
  Future<void> join(String code) async {
    await leave();
    final roomId = await _repo.findOpenRoom(code);
    final channel = await _repo.connect(roomId);
    await _attach(OnlineRoom.join(
        channel: channel,
        me: _me(),
        roomId: roomId,
        newId: newUuid,
      ),);
  }

  /// Leaves the room. The host closes it for everyone.
  Future<void> leave() async {
    final view = state;
    if (view == null) return;
    if (view.room.isHost) {
      await view.room.closeRoom();
      unawaited(_repo.closeRoom(view.room.roomId).catchError((_) {}));
    }
    await _teardown();
    state = null;
  }

  Future<void> _attach(OnlineRoom room) async {
    _room = room;
    state = OnlineRoomView(room: room, snapshot: room.snapshot);
    _subs
      ..add(room.changes.listen((s) => state = state?.copyWith(snapshot: s)))
      ..add(
        room.rejections.listen(
          (r) => state = state?.copyWith(lastRejection: (r, DateTime.now())),
        ),
      )
      ..add(room.completedGames.listen((record) => _onCompleted(room, record)));
    await room.start();
  }

  Future<void> _onCompleted(OnlineRoom room, CompletedGame game) async {
    final record = game.record;
    await ref.read(matchHistoryRepositoryProvider).add(record);
    ref.invalidate(matchHistoryProvider);
    if (room.isHost) {
      await ref
          .read(resultUploaderProvider)
          .submit(
            record,
            transport: MatchTransportKind.online,
            roomId: room.roomId,
            ranked: game.ranked,
            groupId: game.group?.id,
          );
    }
  }

  Future<void> _teardown() async {
    for (final s in _subs) {
      await s.cancel();
    }
    _subs.clear();
    final room = _room;
    _room = null;
    await room?.dispose();
  }
}

final onlineRoomControllerProvider =
    NotifierProvider<OnlineRoomController, OnlineRoomView?>(
      OnlineRoomController.new,
    );
