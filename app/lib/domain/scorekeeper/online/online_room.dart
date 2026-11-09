// ignore_for_file: prefer_initializing_formals

import 'dart:async';

import '../match_engine.dart';
import '../match_record.dart';
import '../score_event.dart';
import '../team.dart';
import 'match_channel.dart';
import 'room_snapshot.dart';

/// A finished game with the room settings it was played under.
class CompletedGame {
  const CompletedGame({required this.record, required this.ranked, this.group});
  final MatchRecord record;
  final bool ranked;
  final RoomGroup? group;
}

/// The person using this device.
class RoomMember {
  const RoomMember({required this.userId, required this.name});
  final String userId;
  final String name;
}

/// One device's view of an online scorekeeper room.
///
/// The host owns the authoritative [RoomSnapshot]: it validates every action
/// with a [MatchEngine] and broadcasts the new snapshot. Other devices send
/// requests and render whatever snapshot the host sends back.
///
/// The host also re-sends its snapshot every [heartbeat]. When a seated
/// player has not heard from the host for [hostTimeout], the next app user
/// in seat order takes over as host (the one after waits twice as long, and
/// so on), so the game goes on if the host's phone dies or loses signal.
class OnlineRoom {
  static const heartbeat = Duration(seconds: 5);
  static const hostTimeout = Duration(seconds: 15);

  OnlineRoom.host({
    required MatchChannel channel,
    required this.me,
    required RoomSnapshot initial,
    required String Function() newId,
    DateTime Function()? clock,
  }) : _isHost = true,
       roomId = initial.roomId,
       _channel = channel,
       _newId = newId,
       _clock = clock ?? DateTime.now,
       _snapshot = initial;

  OnlineRoom.join({
    required MatchChannel channel,
    required this.me,
    required this.roomId,
    String Function()? newId,
    DateTime Function()? clock,
  }) : _isHost = false,
       _channel = channel,
       _newId = newId ?? _noIds,
       _clock = clock ?? DateTime.now;

  static String _noIds() => throw StateError('Only the host creates ids');

  final RoomMember me;
  bool _isHost;

  /// Whether this device runs the room now (it can change by hand-off).
  bool get isHost => _isHost;
  final String roomId;
  final MatchChannel _channel;
  final String Function() _newId;
  final DateTime Function() _clock;

  RoomSnapshot? _snapshot;
  StreamSubscription<Map<String, Object?>>? _sub;
  final _changes = StreamController<RoomSnapshot>.broadcast();
  final _rejections = StreamController<IntentRejection>.broadcast();
  final _completed = StreamController<CompletedGame>.broadcast();
  final _lastScoreSeenAt = <Team, (String, DateTime)>{};

  /// Latest known state; null until a client hears from the host.
  RoomSnapshot? get snapshot => _snapshot;
  Stream<RoomSnapshot> get changes => _changes.stream;

  /// Actions of this device that the host refused.
  Stream<IntentRejection> get rejections => _rejections.stream;

  /// Games that ended (by rematch or by closing the room), once each.
  Stream<CompletedGame> get completedGames => _completed.stream;

  Seat? get mySeat => _snapshot?.seatOfUser(me.userId);

  Future<void> start() async {
    _sub = _channel.messages.listen(_onMessage);
    _heardFromHostAt = _clock();
    _watchdog = Timer.periodic(const Duration(seconds: 1), (_) => tick());
    if (isHost) {
      _trackScores(_snapshot!);
      await _broadcast();
    } else {
      await _sendHello();
      // Keep asking until the host answers (it may have been in the
      // background, or the first message may have been lost).
      _helloRetry = Timer.periodic(const Duration(seconds: 3), (_) {
        if (_snapshot == null) {
          _sendHello();
        } else {
          _helloRetry?.cancel();
        }
      });
    }
  }

  Timer? _helloRetry;
  Timer? _watchdog;
  DateTime? _heardFromHostAt;
  DateTime? _broadcastAt;

  /// Periodic upkeep: the host's heartbeat, and the hand-off check on the
  /// other devices. Called every second; public so tests can drive it.
  Future<void> tick() async {
    final snap = _snapshot;
    if (snap == null) return;
    final now = _clock();
    if (_isHost) {
      final last = _broadcastAt;
      if (snap.phase != RoomPhase.closed &&
          (last == null || now.difference(last) >= heartbeat)) {
        await _broadcast();
      }
      return;
    }
    if (snap.phase == RoomPhase.closed) return;
    final rank = _successorRank(snap);
    if (rank == null) return;
    final silent = now.difference(_heardFromHostAt ?? now);
    if (silent >= hostTimeout * (rank + 1)) await _takeOver(snap);
  }

  /// This device's place in the line of successors, or null if it has none.
  int? _successorRank(RoomSnapshot snap) {
    final line = [
      for (final s in [...snap.seats]..sort((a, b) => a.index - b.index))
        if (s.userId != null && s.userId != snap.hostUserId) s.userId,
    ];
    final i = line.indexOf(me.userId);
    return i < 0 ? null : i;
  }

  Future<void> _takeOver(RoomSnapshot snap) async {
    _isHost = true;
    _helloRetry?.cancel();
    await _update(snap.copyWith(hostUserId: me.userId));
  }

  Future<void> _sendHello() =>
      _channel.send({'type': 'hello', 'userId': me.userId, 'name': me.name});

  Future<void> dispose() async {
    _helloRetry?.cancel();
    _watchdog?.cancel();
    await _sub?.cancel();
    await _channel.close();
    await _changes.close();
    await _rejections.close();
    await _completed.close();
  }

  // ---------------------------------------------------------------- actions

  Future<void> pickTeam(Team team) =>
      _request({'type': 'pick', 'team': team.name});

  Future<void> addPoints(Team team, int delta) => _request({
    'type': 'intent',
    'kind': 'add',
    'team': team.name,
    'delta': delta,
  });

  Future<void> undo(Team team) =>
      _request({'type': 'intent', 'kind': 'undo', 'team': team.name});

  /// Votes for a rematch on behalf of the teams this device can speak for.
  Future<void> voteRematch() => _request({'type': 'vote'});

  /// Host only: seats someone without the app.
  Future<void> addGuest(Team team, String name) async {
    final snap = _requireHost();
    final index = snap.freeSeatOf(team);
    if (index == null || snap.phase != RoomPhase.lobby) return;
    await _update(
      snap.copyWith(
        seats: [
          ...snap.seats,
          Seat(index: index, team: team, name: name.trim()),
        ],
      ),
    );
  }

  /// Host only: frees a seat (guest or a player who left).
  Future<void> removeSeat(int index) async {
    final snap = _requireHost();
    if (snap.phase != RoomPhase.lobby) return;
    final seat = snap.seats.where((s) => s.index == index).firstOrNull;
    if (seat == null || seat.userId == snap.hostUserId) return;
    await _update(
      snap.copyWith(seats: snap.seats.where((s) => s.index != index).toList()),
    );
  }

  /// Host only: ranked or friendly games (lobby only).
  Future<void> setRanked(bool ranked) async {
    final snap = _requireHost();
    if (snap.phase != RoomPhase.lobby) return;
    await _update(snap.copyWith(ranked: ranked));
  }

  /// Host only: also count games for a group's leaderboard (lobby only).
  Future<void> setGroup(RoomGroup? group) async {
    final snap = _requireHost();
    if (snap.phase != RoomPhase.lobby) return;
    await _update(
      group == null
          ? snap.copyWith(clearGroup: true)
          : snap.copyWith(group: group),
    );
  }

  Future<void> startGame() async {
    final snap = _requireHost();
    if (snap.phase != RoomPhase.lobby || !snap.canStart) return;
    await _update(
      snap.copyWith(phase: RoomPhase.playing, gameStartedAt: _clock()),
    );
  }

  Future<void> closeRoom() async {
    final snap = _requireHost();
    await _update(snap.copyWith(phase: RoomPhase.closed));
  }

  /// Time left before [team] may score again, as seen on this device.
  Duration cooldownRemaining(Team team) {
    final snap = _snapshot;
    final seen = _lastScoreSeenAt[team];
    if (snap == null || seen == null) return Duration.zero;
    final remaining =
        Duration(seconds: snap.cooldownSeconds) - _clock().difference(seen.$2);
    return remaining.isNegative ? Duration.zero : remaining;
  }

  /// Whether this device may mark points for [team].
  bool canMark(Team team) {
    final snap = _snapshot;
    final seat = mySeat;
    if (snap == null || seat == null) return false;
    return _engineFor(snap).canMark(seat.index, team);
  }

  // --------------------------------------------------------------- internals

  Future<void> _request(Map<String, Object?> body) async {
    final message = {...body, 'userId': me.userId, 'name': me.name};
    if (isHost) {
      await _handle(message);
    } else {
      await _channel.send(message);
    }
  }

  RoomSnapshot _requireHost() {
    if (!isHost) throw StateError('Host-only action');
    return _snapshot!;
  }

  void _onMessage(Map<String, Object?> message) {
    if (message['type'] == 'snapshot') {
      final snap = RoomSnapshot.fromJson(
        (message['snapshot']! as Map).cast<String, Object?>(),
      );
      if (snap.roomId != roomId) return;
      if (snap.hostUserId == me.userId) return;
      final current = _snapshot;
      if (current != null && snap.revision <= current.revision) {
        // Same revision: a heartbeat, so the host is still there. Older
        // snapshots (from a host that was replaced) are ignored.
        if (!_isHost && snap.hostUserId == current.hostUserId) {
          _heardFromHostAt = _clock();
        }
        return;
      }
      // Someone else runs the room now (this device was away too long).
      _isHost = false;
      _heardFromHostAt = _clock();
      _setSnapshot(snap);
    } else if (_isHost) {
      _handle(message);
    } else if (message['type'] == 'rejected' && message['to'] == me.userId) {
      _rejections.add(
        IntentRejection.values.byName(message['reason']! as String),
      );
    }
  }

  /// Host: applies a request from any device (including itself).
  Future<void> _handle(Map<String, Object?> m) async {
    final snap = _snapshot!;
    final userId = m['userId'] as String?;
    if (userId == null) return;
    switch (m['type']) {
      case 'hello':
        await _broadcast();
      case 'pick':
        await _pick(
          snap,
          userId,
          (m['name'] as String?) ?? '',
          Team.fromName(m['team']! as String),
        );
      case 'intent':
        await _intent(snap, userId, m);
      case 'vote':
        await _vote(snap, userId);
    }
  }

  Future<void> _pick(
    RoomSnapshot snap,
    String userId,
    String name,
    Team team,
  ) async {
    if (snap.phase != RoomPhase.lobby) return _broadcast();
    final current = snap.seatOfUser(userId);
    if (current?.team == team) return _broadcast();
    final index = snap.freeSeatOf(team);
    if (index == null) return _broadcast();
    final others = snap.seats.where((s) => s.userId != userId);
    await _update(
      snap.copyWith(
        seats: [
          ...others,
          Seat(index: index, team: team, name: name.trim(), userId: userId),
        ],
      ),
    );
  }

  Future<void> _intent(
    RoomSnapshot snap,
    String userId,
    Map<String, Object?> m,
  ) async {
    final seat = snap.seatOfUser(userId);
    if (seat == null || snap.phase != RoomPhase.playing) {
      return _reject(userId, IntentRejection.notYourTeam);
    }
    final team = Team.fromName(m['team']! as String);
    final intent = m['kind'] == 'undo'
        ? UndoIntent(team: team, authorSeat: seat.index)
        : AddPointsIntent(
            team: team,
            authorSeat: seat.index,
            delta: m['delta']! as int,
          );
    switch (_engineFor(snap).apply(intent, _clock())) {
      case IntentAccepted(:final state):
        await _update(
          snap.copyWith(
            events: state.events,
            // Any score change after the end cancels pending rematch votes.
            rematchVotes: const {},
          ),
        );
      case IntentRejected(:final reason):
        await _reject(userId, reason);
    }
  }

  Future<void> _vote(RoomSnapshot snap, String userId) async {
    if (snap.phase != RoomPhase.playing || !snap.state.isFinished) return;
    final seat = snap.seatOfUser(userId);
    if (seat == null) return;
    final votes = {...snap.rematchVotes, seat.team: true};
    // The host speaks for teams made only of guests.
    if (userId == snap.hostUserId) {
      for (final t in Team.values) {
        if (!snap.teamHasAppUser(t)) votes[t] = true;
      }
    }
    if (Team.values.every((t) => votes[t] ?? false)) {
      await _update(
        snap.copyWith(
          gameId: _newId(),
          events: const [],
          series: snap.series.recordWin(snap.state.winner!),
          rematchVotes: const {},
          gameStartedAt: _clock(),
        ),
      );
    } else {
      await _update(snap.copyWith(rematchVotes: votes));
    }
  }

  MatchEngine _engineFor(RoomSnapshot snap) {
    final hostSeat = snap.seatOfUser(snap.hostUserId)?.index;
    return MatchEngine(
      rules: snap.rules,
      seatTeams: {for (final s in snap.seats) s.index: s.team},
      extraPermission: (seat, team) =>
          seat == hostSeat && !snap.teamHasAppUser(team),
      events: snap.events,
    );
  }

  Future<void> _reject(String userId, IntentRejection reason) async {
    if (userId == me.userId) {
      _rejections.add(reason);
    } else {
      await _channel.send({
        'type': 'rejected',
        'to': userId,
        'reason': reason.name,
      });
    }
  }

  Future<void> _update(RoomSnapshot next) async {
    _setSnapshot(next);
    await _broadcast();
  }

  Future<void> _broadcast() {
    _broadcastAt = _clock();
    return _channel.send({'type': 'snapshot', 'snapshot': _snapshot!.toJson()});
  }

  void _setSnapshot(RoomSnapshot next) {
    final previous = _snapshot;
    _snapshot = next;
    if (previous != null && previous.state.isFinished) {
      final rematched = next.series.gamesPlayed > previous.series.gamesPlayed;
      final closed =
          next.phase == RoomPhase.closed && previous.phase != RoomPhase.closed;
      if (rematched || closed) {
        _completed.add(
          CompletedGame(
            record: previous.toRecord(_clock()),
            ranked: previous.ranked,
            group: previous.group,
          ),
        );
      }
    }
    _trackScores(next);
    _changes.add(next);
  }

  void _trackScores(RoomSnapshot snap) {
    final state = snap.state;
    for (final team in Team.values) {
      final last = state.lastActiveScoreEventOf(team);
      if (last == null) {
        _lastScoreSeenAt.remove(team);
      } else if (_lastScoreSeenAt[team]?.$1 != '${snap.gameId}:${last.seq}') {
        _lastScoreSeenAt[team] = ('${snap.gameId}:${last.seq}', _clock());
      }
    }
  }
}
