import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/game/ai.dart';
import '../../domain/game/cards.dart';
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
  });

  final TrucoRules rules;
  final AiLevel partnerLevel;
  final AiLevel opponentLevel;
  final String myName;
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

  static const botNames = ['', 'Zeca', 'Bia', 'Tonho'];

  /// The running game (tests read the engine through it).
  GameSession? get session => _session;

  @override
  GameTableModel? build() {
    ref.onDispose(_player.dispose);
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
    _player.reset();
    state = null;
    _show(session.viewFor(humanSeat), busy: true);
    _play(session.advance());
  }

  void quit() {
    _player.reset();
    _session = null;
    state = null;
  }

  // ---------------------------------------------------- human actions --

  void playCard(Card card, {bool covered = false}) => _human(
    (s) => s.act(humanSeat, PlayCard(humanSeat, card, covered: covered)),
  );

  /// "Mão de ferro": the human picks a face-down card by position.
  void playBlind(int index) => _human((s) => s.actBlind(humanSeat, index));

  void raise() => _human((s) => s.act(humanSeat, const Raise(humanSeat)));
  void accept() => _human((s) => s.act(humanSeat, const Accept(humanSeat)));
  void fold() => _human((s) => s.act(humanSeat, const Fold(humanSeat)));

  void _human(Frames Function(GameSession s) action) {
    final s = _session;
    if (s == null || !(state?.canAct ?? false)) return;
    final Frames frames;
    try {
      frames = action(s);
    } on GameRuleError {
      return;
    }
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
    state = GameTableModel(view: view, names: _names, wins: _wins, busy: busy);
  }
}
