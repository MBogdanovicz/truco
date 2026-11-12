import 'dart:async';
import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/game/ai.dart';
import '../../domain/game/cards.dart';
import '../../domain/game/coach.dart';
import '../../domain/game/game_session.dart';
import '../../domain/game/rules.dart';
import '../../domain/game/table_view.dart';
import '../../domain/game/truco_game.dart';
import '../../domain/scorekeeper/team.dart';
import 'frame_player.dart';
import 'game_table.dart';

/// Options chosen before a game against the computer.
class LocalGameSetup {
  const LocalGameSetup({
    required this.rules,
    required this.partnerLevel,
    required this.opponentLevel,
    required this.myName,
    this.coach = false,
  });

  final TrucoRules rules;
  final AiLevel partnerLevel;
  final AiLevel opponentLevel;
  final String myName;

  /// "Modo professor": comments on the person's moves.
  final bool coach;
}

/// The human always sits at seat 0 (bottom); 1 is on the right, 2 (partner)
/// across, 3 on the left. Play goes 0 → 1 → 2 → 3, counter-clockwise.
const humanSeat = 0;

final localGameControllerProvider =
    NotifierProvider<LocalGameController, GameTableModel?>(
      LocalGameController.new,
    );

/// A game against three computer players on this device: a [GameSession]
/// (the same code the server runs for online games) whose frames are shown
/// one by one, so the bots' moves can be followed.
class LocalGameController extends Notifier<GameTableModel?> {
  final _random = Random();
  late final FramePlayer _player = FramePlayer(_show);
  LocalGameSetup? _setup;
  GameSession? _session;
  Map<Team, int> _wins = const {Team.a: 0, Team.b: 0};
  List<String> _names = const [];
  final _coach = const Coach();
  CoachTip? _tip;
  CoachTip? _hint;
  CoachReport _report = CoachReport();

  /// The decision a hint was worked out for, so it is computed once.
  String? _hintKey;

  static const botNames = ['', 'Zeca', 'Bia', 'Tonho'];

  /// The running game (tests read the engine through it).
  GameSession? get session => _session;

  /// Ends the moment to show cards after a hand worth 3+.
  Timer? _revealTimer;

  @override
  GameTableModel? build() {
    ref.onDispose(_player.dispose);
    ref.onDispose(() => _revealTimer?.cancel());
    return null;
  }

  /// Delays between frames are multiplied by this; tests may speed up.
  set speed(double value) => _player.speed = value;

  void start(LocalGameSetup setup) {
    _setup = setup;
    _wins = const {Team.a: 0, Team.b: 0};
    _names = [setup.myName, botNames[1], botNames[2], botNames[3]];
    _newGame();
  }

  void rematch() {
    if (_setup != null) _newGame();
  }

  void _newGame() {
    final setup = _setup!;
    final session = _session = GameSession(
      rules: setup.rules,
      seed: _random.nextInt(1 << 31),
      firstDealer: _random.nextInt(4),
      bots: [
        null,
        setup.opponentLevel,
        setup.partnerLevel,
        setup.opponentLevel,
      ],
      random: _random,
    );
    _revealTimer?.cancel();
    _player.reset();
    state = null;
    _tip = null;
    _hint = null;
    _hintKey = null;
    _report = CoachReport();
    _show(session.viewFor(humanSeat), busy: true);
    _play(session.advance());
  }

  void quit() {
    _revealTimer?.cancel();
    _player.reset();
    _session = null;
    state = null;
  }

  // ---------------------------------------------------- human actions --

  void playCard(Card card, {bool covered = false}) =>
      _act(PlayCard(humanSeat, card, covered: covered));

  /// "Mão de ferro": the human picks a face-down card by position.
  void playBlind(int index) => _human((s) => s.actBlind(humanSeat, index));

  /// "Mostrar cartas" after a hand worth 3+.
  void showCards() => _reveal((s) => s.show(humanSeat));

  /// Doesn't show the cards: the next hand comes at once.
  void skipShow() => _reveal((s) => s.pass(humanSeat));

  void _reveal(Frames Function(GameSession s) action) {
    final s = _session;
    if (s == null || !(state?.view.canShow ?? false)) return;
    try {
      _play(action(s));
    } on GameRuleError {
      return;
    }
  }

  void raise() => _act(const Raise(humanSeat));
  void accept() => _act(const Accept(humanSeat));
  void fold() => _act(const Fold(humanSeat));

  /// Hides the professor's comment.
  void dismissTip() {
    _tip = null;
    _hint = null;
    final m = state;
    if (m != null) state = m.withoutTips();
  }

  bool get _coaching => _setup?.coach ?? false;

  void _act(GameAction action) {
    final s = _session;
    CoachTip? tip;
    if (s != null && _coaching && (state?.canAct ?? false)) {
      try {
        tip = _coach.review(s.game.viewFor(humanSeat), action);
      } on Object {
        tip = null;
      }
      _report.record(tip);
    }
    _human((s) => s.act(humanSeat, action), tip: tip);
  }

  void _human(Frames Function(GameSession s) action, {CoachTip? tip}) {
    final s = _session;
    if (s == null || !(state?.canAct ?? false)) return;
    final Frames frames;
    try {
      frames = action(s);
    } on GameRuleError {
      return;
    }
    _tip = tip;
    _hint = null;
    _play(frames);
  }

  /// True when the game waits for the person at seat 0.
  bool get waitingForHuman => state?.canAct ?? false;

  void _play(Frames frames) {
    final mine = frames[humanSeat] ?? const [];
    if (mine.isNotEmpty) _player.enqueue(mine);
  }

  void _show(TableView view, {bool busy = false}) {
    final before = state?.view.phase;
    if (view.phase == GamePhase.gameOver &&
        before != GamePhase.gameOver &&
        view.winner != null) {
      _wins = {..._wins, view.winner!: _wins[view.winner!]! + 1};
    }
    if (!busy) _maybeHint(view);
    if (!busy && view.revealing) {
      _revealTimer?.cancel();
      final session = _session;
      final hand = view.handNumber;
      _revealTimer = Timer(
        Duration(
          milliseconds: (FrameDelays.revealWindow * _player.speed).round(),
        ),
        () {
          if (_session != session || session == null) return;
          if (!session.revealing || session.game.handNumber != hand) return;
          _play(session.timeout());
        },
      );
    }
    state = GameTableModel(
      view: view,
      names: _names,
      wins: _wins,
      busy: busy,
      tip: _tip,
      hint: _hint,
      coachSummary: _coaching && view.phase == GamePhase.gameOver
          ? _report.summary()
          : null,
    );
  }

  /// Before the person answers a raise or decides a mão de onze, a word on
  /// what to weigh when the choice is close.
  void _maybeHint(TableView view) {
    final s = _session;
    if (s == null || !_coaching || !view.mustAnswer) return;
    if (view.phase != GamePhase.raisePending &&
        view.phase != GamePhase.decision) {
      return;
    }
    final key =
        '${view.handNumber}/${view.phase}/${view.stakeLevel}/'
        '${view.pending?.toLevel}/${view.rounds.length}';
    if (key == _hintKey) return;
    _hintKey = key;
    final live = s.game.viewFor(humanSeat);
    if (live.phase != view.phase) return;
    try {
      _hint = _coach.consider(live);
    } on Object {
      _hint = null;
    }
  }
}
