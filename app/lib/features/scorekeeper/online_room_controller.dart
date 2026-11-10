import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/auth_repository.dart';
import '../../data/ids.dart';
import '../../data/last_room_repository.dart';
import '../../data/match_history_repository.dart';
import '../../data/nearby/nearby_link.dart';
import '../../data/nearby/nearby_match_channel.dart';
import '../../data/online_room_repository.dart';
import '../../data/result_uploader.dart';
import '../../domain/scorekeeper/match_engine.dart';
import '../../domain/scorekeeper/match_record.dart';
import '../../domain/scorekeeper/online/online_room.dart';
import '../../domain/scorekeeper/online/room_snapshot.dart';
import '../../domain/scorekeeper/team.dart';

/// What the online screens render.
class OnlineRoomView {
  const OnlineRoomView({
    required this.room,
    this.nearby = false,
    this.snapshot,
    this.lastRejection,
    this.lastNotice,
  });

  final OnlineRoom room;

  /// Played over Nearby Connections (no internet) instead of Supabase.
  final bool nearby;

  /// Null while a joining device waits for the host's first snapshot.
  final RoomSnapshot? snapshot;

  /// Most recent refusal from the host, shown as a toast.
  final (IntentRejection, DateTime)? lastRejection;

  /// Most recent host hand-off event, shown as a toast.
  final (RoomNotice, DateTime)? lastNotice;

  OnlineRoomView copyWith({
    RoomSnapshot? snapshot,
    (IntentRejection, DateTime)? lastRejection,
    (RoomNotice, DateTime)? lastNotice,
  }) => OnlineRoomView(
    room: room,
    nearby: nearby,
    snapshot: snapshot ?? this.snapshot,
    lastRejection: lastRejection ?? this.lastRejection,
    lastNotice: lastNotice ?? this.lastNotice,
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
      initial: _initial(me: me, roomId: created.id, code: created.code),
    );
    await _attach(room);
  }

  /// Throws [RoomNotFound] when the code does not match an open room.
  Future<void> join(String code) async {
    await leave();
    final roomId = await _repo.findOpenRoom(code);
    final channel = await _repo.connect(roomId);
    await _attach(
      OnlineRoom.join(
        channel: channel,
        me: _me(),
        roomId: roomId,
        newId: newUuid,
      ),
    );
  }

  RoomSnapshot _initial({
    required RoomMember me,
    required String roomId,
    required String code,
  }) => RoomSnapshot(
    roomId: roomId,
    code: code,
    hostUserId: me.userId,
    gameId: newUuid(),
    phase: RoomPhase.lobby,
    teamNames: const {Team.a: 'Dupla 1', Team.b: 'Dupla 2'},
    seats: [Seat(index: 0, team: Team.a, name: me.name, userId: me.userId)],
    events: const [],
    series: SeriesTally(id: roomId),
    gameStartedAt: DateTime.now(),
  );

  /// Opens a room for phones at the same table, without internet.
  Future<void> createNearby() async {
    await leave();
    final me = _me();
    final roomId = newUuid();
    final channel = await NearbyHostChannel.open(
      ref.read(nearbyLinkProvider),
      roomId: roomId,
      hostName: me.name,
    );
    final room = OnlineRoom.host(
      channel: channel,
      me: me,
      newId: newUuid,
      handOff: false,
      initial: _initial(me: me, roomId: roomId, code: 'PERTO'),
    );
    await _attach(room, nearby: true);
  }

  /// Joins a room found nearby. Throws a TimeoutException if it can't
  /// connect.
  Future<void> joinNearby(NearbyRoomAd ad) async {
    await leave();
    final me = _me();
    final channel = await NearbyClientChannel.open(
      ref.read(nearbyLinkProvider),
      room: ad,
      myName: me.name,
    );
    await _attach(
      OnlineRoom.join(
        channel: channel,
        me: me,
        roomId: ad.roomId,
        newId: newUuid,
        handOff: false,
      ),
      nearby: true,
    );
  }

  /// Leaves the room. The host closes it for everyone.
  Future<void> leave() async {
    final view = state;
    if (view == null) return;
    if (!view.room.isHost) {
      // Best effort: tell the host, so it can free the seat or close the room.
      await view.room
          .leave()
          .timeout(const Duration(seconds: 2), onTimeout: () {})
          .catchError((_) {});
    } else if (view.nearby) {
      await view.room.closeRoom();
    } else if (view.room.isHost) {
      await view.room.closeRoom();
      _rememberedCode = null;
      unawaited(
        ref
            .read(lastRoomRepositoryProvider)
            .clear()
            .then((_) => ref.invalidate(lastRoomCodeProvider)),
      );
      unawaited(_repo.closeRoom(view.room.roomId).catchError((_) {}));
    }
    await _teardown();
    state = null;
  }

  Future<void> _attach(OnlineRoom room, {bool nearby = false}) async {
    _room = room;
    state = OnlineRoomView(room: room, snapshot: room.snapshot, nearby: nearby);
    _subs
      ..add(
        room.changes.listen((s) {
          state = state?.copyWith(snapshot: s);
          if (!nearby) _rememberRoom(s);
        }),
      )
      ..add(
        room.rejections.listen(
          (r) => state = state?.copyWith(lastRejection: (r, DateTime.now())),
        ),
      )
      ..add(
        room.notices.listen(
          (n) => state = state?.copyWith(lastNotice: (n, DateTime.now())),
        ),
      )
      ..add(
        room.completedGames.listen(
          (record) => _onCompleted(room, record, nearby: nearby),
        ),
      );
    await room.start();
  }

  String? _rememberedCode;

  /// Keeps the room code for "Voltar para a sala" on the home screen.
  void _rememberRoom(RoomSnapshot s) {
    final repo = ref.read(lastRoomRepositoryProvider);
    if (s.phase == RoomPhase.closed) {
      if (_rememberedCode == null) return;
      _rememberedCode = null;
      unawaited(repo.clear().then((_) => ref.invalidate(lastRoomCodeProvider)));
    } else if (_rememberedCode != s.code) {
      _rememberedCode = s.code;
      unawaited(
        repo.save(s.code).then((_) => ref.invalidate(lastRoomCodeProvider)),
      );
    }
  }

  Future<void> _onCompleted(
    OnlineRoom room,
    CompletedGame game, {
    required bool nearby,
  }) async {
    final record = game.record;
    await ref.read(matchHistoryRepositoryProvider).add(record);
    ref.invalidate(matchHistoryProvider);
    // A guest (no e-mail account) can't save games: it has no profile.
    // Every other seated player uploads it: a ranked result counts only
    // once both teams have confirmed it.
    final user = ref.read(authRepositoryProvider).currentUser;
    final seated = record.seats.any((s) => s.userId == user?.id);
    if (user != null && !user.isGuest && seated) {
      await ref
          .read(resultUploaderProvider)
          .submit(
            record,
            // Nearby rooms are not registered in the database.
            transport: nearby
                ? MatchTransportKind.nearby
                : MatchTransportKind.online,
            roomId: nearby ? null : room.roomId,
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

/// The device's Nearby Connections link (Android only).
final nearbyLinkProvider = Provider<NearbyLink>((ref) => PlatformNearbyLink());

final onlineRoomControllerProvider =
    NotifierProvider<OnlineRoomController, OnlineRoomView?>(
      OnlineRoomController.new,
    );
