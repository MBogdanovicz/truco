import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/ids.dart';
import '../../data/match_history_repository.dart';
import '../../domain/scorekeeper/match_engine.dart';
import '../../domain/scorekeeper/match_record.dart';
import '../../domain/scorekeeper/match_state.dart';
import '../../domain/scorekeeper/score_event.dart';
import '../../domain/scorekeeper/scoring_rules.dart';
import '../../domain/scorekeeper/team.dart';

/// Who is playing, chosen on the setup screen.
class MatchSetup {
  const MatchSetup({required this.teamNames, required this.seats});

  final Map<Team, String> teamNames;
  final List<Seat> seats;

  List<Seat> seatsOf(Team team) => seats.where((s) => s.team == team).toList();
}

/// A game in progress on this device.
class ScorekeeperSession {
  const ScorekeeperSession({
    required this.matchId,
    required this.setup,
    required this.state,
    required this.series,
    required this.startedAt,
    this.saved = false,
  });

  final String matchId;
  final MatchSetup setup;
  final MatchState state;

  /// Tally of previous games in this rematch chain (excluding this one).
  final SeriesTally series;
  final DateTime startedAt;

  /// True once the finished game was written to history.
  final bool saved;

  ScorekeeperSession copyWith({MatchState? state, SeriesTally? series, bool? saved}) =>
      ScorekeeperSession(
        matchId: matchId,
        setup: setup,
        state: state ?? this.state,
        series: series ?? this.series,
        startedAt: startedAt,
        saved: saved ?? this.saved,
      );
}

/// Single-device scorekeeper: one phone marks for both teams.
///
/// The online and nearby transports (M3/M5) will drive the same
/// [MatchEngine] on the host and stream accepted events to the other devices.
class ScorekeeperController extends Notifier<ScorekeeperSession?> {
  /// One person marks for everyone, so the partner cooldown is not needed.
  static final rules = ScoringRules.standard.copyWith(teamScoreCooldown: Duration.zero);

  /// The device owner's seat; authors every event in single-device mode.
  static const hostSeat = 0;

  MatchEngine? _engine;
  DateTime Function() clock = DateTime.now;

  @override
  ScorekeeperSession? build() => null;

  void start(MatchSetup setup) {
    _engine = _newEngine(setup);
    state = ScorekeeperSession(
      matchId: newUuid(),
      setup: setup,
      state: _engine!.state,
      series: SeriesTally(id: newUuid()),
      startedAt: clock(),
    );
  }

  IntentRejection? addPoints(Team team, int delta) =>
      _apply(AddPointsIntent(team: team, delta: delta, authorSeat: hostSeat));

  IntentRejection? undo(Team team) =>
      _apply(UndoIntent(team: team, authorSeat: hostSeat));

  /// Saves the finished game to history. Safe to call more than once.
  Future<MatchRecord?> saveFinished() async {
    final session = state;
    final winner = session?.state.winner;
    if (session == null || winner == null || session.saved) return null;
    final record = MatchRecord(
      id: session.matchId,
      teamNames: session.setup.teamNames,
      seats: session.setup.seats,
      events: session.state.events,
      startedAt: session.startedAt,
      finishedAt: clock(),
      series: session.series.recordWin(winner),
    );
    await ref.read(matchHistoryRepositoryProvider).add(record);
    ref.invalidate(matchHistoryProvider);
    state = session.copyWith(saved: true);
    return record;
  }

  /// Starts a new game with the same players, keeping the series tally.
  Future<void> rematch() async {
    final session = state;
    final winner = session?.state.winner;
    if (session == null || winner == null) return;
    await saveFinished();
    _engine = _newEngine(session.setup);
    state = ScorekeeperSession(
      matchId: newUuid(),
      setup: session.setup,
      state: _engine!.state,
      series: session.series.recordWin(winner),
      startedAt: clock(),
    );
  }

  Future<void> end() async {
    await saveFinished();
    _engine = null;
    state = null;
  }

  IntentRejection? _apply(ScoreIntent intent) {
    final engine = _engine;
    if (engine == null) return null;
    final result = engine.apply(intent, clock());
    switch (result) {
      case IntentAccepted(:final state):
        this.state = this.state!.copyWith(state: state);
        return null;
      case IntentRejected(:final reason):
        return reason;
    }
  }

  MatchEngine _newEngine(MatchSetup setup) => MatchEngine(
        rules: rules,
        seatTeams: {for (final s in setup.seats) s.index: s.team},
        anySeatMarksAnyTeam: true,
      );
}

final scorekeeperControllerProvider =
    NotifierProvider<ScorekeeperController, ScorekeeperSession?>(ScorekeeperController.new);
