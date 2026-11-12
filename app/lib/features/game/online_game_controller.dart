import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/game_room_repository.dart';
import '../../data/last_room_repository.dart';
import '../../domain/game/ai.dart';
import '../../domain/game/cards.dart';
import '../../domain/game/rules.dart';
import '../../domain/game/table_view.dart';
import '../../domain/game/truco_game.dart' show GamePhase;
import '../../domain/scorekeeper/team.dart';
import 'frame_player.dart';
import 'game_table.dart';
import 'tournament_history.dart';

/// Names of the computer players, by seat.
const onlineBotNames = ['Lia', 'Zeca', 'Bia', 'Tonho'];

class OnlineGameState {
  const OnlineGameState({
    required this.roomId,
    required this.code,
    this.room,
    this.table,
    this.sending = false,
    this.closed = false,
    this.secondsLeft,
  });

  final String roomId;
  final String code;
  final GameRoomSnapshot? room;

  /// The table as shown now (frames play one by one).
  final TableView? table;

  /// A request is on its way to the server.
  final bool sending;

  /// The room no longer exists.
  final bool closed;

  /// Time left for the move the game waits for.
  final int? secondsLeft;

  OnlineGameState copyWith({
    GameRoomSnapshot? room,
    TableView? table,
    bool? sending,
    bool? closed,
    int? Function()? secondsLeft,
  }) => OnlineGameState(
    roomId: roomId,
    code: code,
    room: room ?? this.room,
    table: table ?? this.table,
    sending: sending ?? this.sending,
    closed: closed ?? this.closed,
    secondsLeft: secondsLeft == null ? this.secondsLeft : secondsLeft(),
  );
}

final onlineGameControllerProvider =
    NotifierProvider<OnlineGameController, OnlineGameState?>(
      OnlineGameController.new,
    );

/// The person's online game room: follows it, plays the server's frames one
/// by one and sends their moves.
class OnlineGameController extends Notifier<OnlineGameState?> {
  late final FramePlayer _player = FramePlayer(_show);
  GameRoomWatch? _watch;
  StreamSubscription<GameRoomSnapshot>? _sub;
  int _version = 0;
  bool _playing = false;
  Timer? _clock;
  DateTime? _askedTimeout;

  GameRoomBackend get _backend => ref.read(gameRoomBackendProvider)!;

  @override
  OnlineGameState? build() {
    ref.onDispose(() {
      _clock?.cancel();
      _player.dispose();
      _sub?.cancel();
      _watch?.close();
    });
    return null;
  }

  String? get myId => _backend.userId;

  bool get isHost {
    final room = state?.room;
    return room != null && room.hostId == myId;
  }

  /// Delays between frames are multiplied by this; tests may speed up.
  set speed(double value) => _player.speed = value;

  Future<void> create({
    required TrucoRules rules,
    required AiLevel botLevel,
    required bool ranked,
  }) async {
    final r = await _backend.create(
      rules: rules,
      botLevel: botLevel,
      ranked: ranked,
    );
    _open(r.roomId, r.code);
  }

  Future<void> join(String code) async {
    final r = await _backend.join(code.trim().toUpperCase());
    _open(r.roomId, r.code);
  }

  void _open(String roomId, String code) {
    if (state?.roomId == roomId) return;
    _close();
    state = OnlineGameState(roomId: roomId, code: code);
    ref.read(lastGameRoomRepositoryProvider).save(code).then((_) {
      ref.invalidate(lastGameRoomCodeProvider);
    }, onError: (_) {});
    _clock = Timer.periodic(const Duration(seconds: 1), (_) => _tick());
    final watch = _watch = _backend.watch(roomId);
    _sub = watch.snapshots.listen(
      _onSnapshot,
      onError: (Object e) {
        if (e is GameRoomError && e.code == 'room_not_found') {
          state = state?.copyWith(closed: true);
        }
      },
    );
  }

  void _close() {
    _standing = false;
    _clock?.cancel();
    _clock = null;
    _player.reset();
    _sub?.cancel();
    _watch?.close();
    _sub = null;
    _watch = null;
    _version = 0;
    _playing = false;
  }

  void _onSnapshot(GameRoomSnapshot room) {
    final s = state;
    if (s == null || room.id != s.roomId) return;
    // A finished tournament match (or a closed room) is no place to go
    // back to from the home screen.
    if (room.status == GameRoomStatus.closed ||
        (room.isTournament &&
            room.status == GameRoomStatus.finished &&
            room.seriesOver)) {
      ref.read(lastGameRoomRepositoryProvider).clear().then((_) {
        ref.invalidate(lastGameRoomCodeProvider);
      }, onError: (_) {});
    }
    final seated = myId == null || room.seatOf(myId!) != null;
    if (seated) _standing = false;
    if (room.status == GameRoomStatus.closed ||
        (!seated && !(_standing && room.status == GameRoomStatus.lobby))) {
      state = s.copyWith(room: room, closed: true);
      return;
    }
    state = s.copyWith(room: room);
    _applyView(room.viewVersion, room.frames);
    // Tournament games go to this device's history.
    final last = room.frames.lastOrNull;
    if (room.isTournament &&
        room.status == GameRoomStatus.finished &&
        last != null &&
        last.phase == GamePhase.gameOver) {
      final key = '${room.id}-${room.wins.$1 + room.wins.$2}';
      if (_saved.add(key)) saveTournamentGame(ref, room, last);
    }
  }

  final _saved = <String>{};

  /// New frames for this person: played in order when they follow the
  /// last ones, otherwise only the last is shown.
  void _applyView(int version, List<TableView> frames) {
    if (version <= _version || frames.isEmpty) return;
    final next = version == _version + 1 && _version != 0;
    _version = version;
    if (next) {
      _player.enqueue(frames);
    } else {
      // First look, or changes were missed: show where things stand.
      _player.reset();
      _show(frames.last.copyWith(delayMs: 0));
    }
  }

  /// Counts down the move's time; when it runs out, asks the server to let
  /// the computer move (any seated person's app may ask).
  void _tick() {
    final s = state;
    final room = s?.room;
    if (s == null || room == null) return;
    final deadline = room.status == GameRoomStatus.playing
        ? room.turnDeadline
        : null;
    if (deadline == null || _playing) {
      if (s.secondsLeft != null) state = s.copyWith(secondsLeft: () => null);
      return;
    }
    final left = deadline.difference(DateTime.now()).inMilliseconds;
    // Slow games count days.
    final seconds = (left / 1000).ceil().clamp(0, 8 * 86400);
    if (seconds != s.secondsLeft) {
      state = s.copyWith(secondsLeft: () => seconds);
    }
    final asked = _askedTimeout;
    if (left < -1000 &&
        !s.sending &&
        (asked == null ||
            DateTime.now().difference(asked) > const Duration(seconds: 4))) {
      _askedTimeout = DateTime.now();
      final roomId = s.roomId;
      _backend.timeout(roomId).then((u) {
        if (u != null && state?.roomId == roomId) {
          _applyView(u.version, u.frames);
        }
      }, onError: (Object e) => debugPrint('Timeout request failed: $e'));
    }
  }

  void _show(TableView view, {bool busy = false}) {
    _playing = busy;
    final s = state;
    if (s != null) state = s.copyWith(table: view);
  }

  /// What the table screen draws.
  GameTableModel? get tableModel => modelOf(state);

  GameTableModel? modelOf(OnlineGameState? s) {
    final room = s?.room, view = s?.table;
    if (room == null || view == null) return null;
    return GameTableModel(
      view: view,
      names: [
        for (var seat = 0; seat < 4; seat++)
          room.at(seat)?.name ??
              (room.bots.length > seat && room.bots[seat] != null
                  ? '${onlineBotNames[seat]} (IA)'
                  : '…'),
      ],
      wins: {Team.a: room.wins.$1, Team.b: room.wins.$2},
      busy: _playing || s!.sending,
      secondsLeft: _playing ? null : s!.secondsLeft,
    );
  }

  // ------------------------------------------------------------ lobby --

  Future<void> sit(int seat) => _send((b, id) => b.sit(id, seat));

  /// Standing up in the lobby: the room stays open without a seat.
  bool _standing = false;
  Future<void> stand() async {
    _standing = true;
    try {
      await _send((b, id) => b.stand(id));
    } on Object {
      _standing = false;
      rethrow;
    }
  }

  Future<void> setBotLevel(AiLevel level) =>
      _send((b, id) => b.options(id, botLevel: level));

  Future<void> setRanked(bool ranked) =>
      _send((b, id) => b.options(id, ranked: ranked));

  Future<void> setGroup(String? groupId) =>
      _send((b, id) => b.options(id, groupId: () => groupId));

  /// Starts the game, or a rematch (host only).
  Future<void> start() => _send((b, id) => b.start(id));

  /// Tournament rooms: calls the match players who aren't here yet.
  Future<void> callPlayers() => _send((b, id) => b.callPlayers(id));

  // ------------------------------------------------------------- game --

  Future<void> playCard(Card card, {bool covered = false}) =>
      _act({'t': 'play', 'c': card.id, if (covered) 'x': true});
  Future<void> playBlind(int index) => _act({'t': 'blind', 'i': index});
  Future<void> raise() => _act({'t': 'raise'});
  Future<void> accept() => _act({'t': 'accept'});
  Future<void> fold() => _act({'t': 'fold'});

  Future<void> _act(Map<String, Object?> action) async {
    if (!(tableModel?.canAct ?? false)) return;
    await _send((b, id) async {
      final u = await b.act(id, action);
      if (u != null && state?.roomId == id) _applyView(u.version, u.frames);
    });
  }

  /// Sends a request; the room's changes come back through the watch.
  /// Throws [GameRoomError] when the server refuses.
  Future<void> _send(
    Future<void> Function(GameRoomBackend b, String roomId) request,
  ) async {
    final s = state;
    if (s == null) return;
    state = s.copyWith(sending: true);
    try {
      await request(_backend, s.roomId);
      unawaited(_watch?.refresh());
    } finally {
      if (state?.roomId == s.roomId) state = state!.copyWith(sending: false);
    }
  }

  /// Stops following the room but keeps the seat (slow games: the person
  /// comes back when it's their turn).
  void close() {
    _close();
    state = null;
  }

  Future<void> leave() async {
    final s = state;
    _close();
    state = null;
    if (s == null || s.closed) return;
    try {
      await _backend.leave(s.roomId);
    } on Object catch (e) {
      debugPrint('Leaving the game room failed: $e');
    }
  }
}
