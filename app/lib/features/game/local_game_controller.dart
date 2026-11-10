import 'dart:async';
import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/game/ai.dart';
import '../../domain/game/cards.dart';
import '../../domain/game/rules.dart';
import '../../domain/game/truco_game.dart';
import '../../domain/scorekeeper/team.dart';

/// Options chosen before a game against the computer.
class LocalGameSetup {
  const LocalGameSetup({
    required this.rules,
    required this.partnerLevel,
    required this.opponentLevel,
    required this.myName,
  });

  final TrucoRules rules;
  final AiLevel partnerLevel;
  final AiLevel opponentLevel;
  final String myName;
}

/// The human always sits at seat 0 (bottom); 1 is on the right, 2 (partner)
/// across, 3 on the left. Play goes 0 → 1 → 2 → 3, counter-clockwise.
const humanSeat = 0;

/// A game against three computer players on this device.
class LocalGameSession {
  const LocalGameSession({
    required this.setup,
    required this.game,
    required this.names,
    required this.version,
    required this.speech,
    required this.showLastRound,
    required this.wins,
    this.toast,
  });

  final LocalGameSetup setup;

  /// Mutable engine; [version] changes whenever it does.
  final TrucoGame game;
  final List<String> names;
  final int version;

  /// Last thing each seat said this hand ("Truco!", "Corro", ...).
  final Map<int, String> speech;

  /// Keep the cards of the round that just ended on the table for a moment.
  final bool showLastRound;

  /// Short message in the middle of the table (hand result).
  final String? toast;

  /// Games won by each team in this sitting (rematches).
  final Map<Team, int> wins;

  PlayerView get view => game.viewFor(humanSeat);

  LocalGameSession copyWith({
    Map<int, String>? speech,
    bool? showLastRound,
    String? Function()? toast,
    Map<Team, int>? wins,
    TrucoGame? game,
  }) => LocalGameSession(
    setup: setup,
    game: game ?? this.game,
    names: names,
    version: version + 1,
    speech: speech ?? this.speech,
    showLastRound: showLastRound ?? this.showLastRound,
    toast: toast == null ? this.toast : toast(),
    wins: wins ?? this.wins,
  );
}

final localGameControllerProvider =
    NotifierProvider<LocalGameController, LocalGameSession?>(
      LocalGameController.new,
    );

/// Runs a [TrucoGame] with the human at seat 0 and [TrucoBot]s elsewhere,
/// pacing the bots so their moves can be followed.
class LocalGameController extends Notifier<LocalGameSession?> {
  final _random = Random();
  Timer? _timer;
  List<TrucoBot> _bots = const [];
  int _seenEvents = 0;

  /// Delays between moves; tests set them to zero.
  Duration botDelay = const Duration(milliseconds: 850);
  Duration roundPause = const Duration(milliseconds: 1400);
  Duration handPause = const Duration(milliseconds: 2200);

  static const botNames = ['', 'Zeca', 'Bia', 'Tonho'];

  @override
  LocalGameSession? build() {
    ref.onDispose(() => _timer?.cancel());
    return null;
  }

  void start(LocalGameSetup setup) {
    _bots = [
      for (var s = 0; s < 4; s++)
        TrucoBot(
          s == 2 ? setup.partnerLevel : setup.opponentLevel,
          random: _random,
        ),
    ];
    _seenEvents = 0;
    state = LocalGameSession(
      setup: setup,
      game: TrucoGame(
        rules: setup.rules,
        seed: _random.nextInt(1 << 31),
        firstDealer: _random.nextInt(4),
      ),
      names: [setup.myName, botNames[1], botNames[2], botNames[3]],
      version: 0,
      speech: const {},
      showLastRound: false,
      wins: const {Team.a: 0, Team.b: 0},
    );
    _afterChange();
  }

  void rematch() {
    final s = state;
    if (s == null) return;
    _seenEvents = 0;
    state = s.copyWith(
      game: TrucoGame(
        rules: s.setup.rules,
        seed: _random.nextInt(1 << 31),
        firstDealer: _random.nextInt(4),
      ),
      speech: const {},
      showLastRound: false,
      toast: () => null,
    );
    _afterChange();
  }

  void quit() {
    _timer?.cancel();
    state = null;
  }

  // ---------------------------------------------------- human actions --

  void playCard(Card card, {bool covered = false}) =>
      _human(PlayCard(humanSeat, card, covered: covered));

  /// "Mão de ferro": the human picks a face-down card by position.
  void playBlind(int index) {
    final s = state;
    if (s == null) return;
    final hand = s.game.handOf(humanSeat);
    if (index < hand.length) _human(PlayCard(humanSeat, hand[index]));
  }

  void raise() => _human(const Raise(humanSeat));
  void accept() => _human(const Accept(humanSeat));
  void fold() => _human(const Fold(humanSeat));

  void _human(GameAction action) {
    final s = state;
    if (s == null || !waitingForHuman) return;
    try {
      s.game.apply(action);
    } on GameRuleError {
      return;
    }
    _afterChange();
  }

  /// True when the game waits for the person at seat 0.
  bool get waitingForHuman {
    final g = state?.game;
    if (g == null) return false;
    return switch (g.phase) {
      GamePhase.playing => g.turn == humanSeat,
      GamePhase.decision => g.decisionTeam == Team.a,
      GamePhase.raisePending => g.pending!.team == Team.b,
      _ => false,
    };
  }

  // ------------------------------------------------------------ pacing --

  void _afterChange() {
    final s = state;
    if (s == null) return;
    final g = s.game;
    final speech = Map<int, String>.of(s.speech);
    String? toast = s.toast;
    var showLast = s.showLastRound;
    var roundJustEnded = false;
    var wins = s.wins;
    for (final e in g.events.skip(_seenEvents)) {
      switch (e) {
        case HandStarted():
          speech.clear();
          toast = null;
          showLast = false;
          if (e.iron) toast = 'Mão de ferro! Ninguém vê as cartas.';
        case CardPlayed():
          showLast = false;
          roundJustEnded = false;
        case RaiseCalled():
          speech[e.seat] = '${e.name}!';
        case RaiseAccepted():
          speech[e.seat] = 'Cai dentro!';
        case Folded():
          speech[e.seat] = 'Corro.';
        case DecisionMade():
          speech[e.seat] = e.play ? 'Vamos jogar!' : 'Corro.';
        case RoundEnded():
          showLast = true;
          roundJustEnded = true;
        case HandEnded():
          final who = e.winner == null
              ? null
              : (e.winner == Team.a ? 'Nós' : 'Eles');
          toast = who == null
              ? 'Empatou tudo, ninguém marca.'
              : '$who +${e.points}';
        case GameEnded():
          wins = {...wins, e.winner: wins[e.winner]! + 1};
      }
    }
    _seenEvents = g.events.length;
    state = s.copyWith(
      speech: speech,
      showLastRound: showLast,
      toast: () => toast,
      wins: wins,
    );
    _schedule(roundJustEnded: roundJustEnded);
  }

  void _schedule({bool roundJustEnded = false}) {
    _timer?.cancel();
    final s = state;
    if (s == null) return;
    final g = s.game;
    switch (g.phase) {
      case GamePhase.gameOver:
        return;
      case GamePhase.handOver:
        _timer = Timer(handPause, () {
          if (state?.game != g) return;
          g.startNextHand();
          _afterChange();
        });
        return;
      default:
        if (waitingForHuman) return;
        final seat = g.phase == GamePhase.playing ? g.turn : g.responder!;
        final delay = roundJustEnded ? roundPause : botDelay;
        _timer = Timer(delay, () {
          if (state?.game != g) return;
          final action = _bots[seat].decide(g.viewFor(seat));
          g.apply(action);
          _afterChange();
        });
    }
  }
}
