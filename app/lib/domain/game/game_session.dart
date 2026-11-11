import 'dart:math';

import 'ai.dart';
import 'cards.dart';
import 'rules.dart';
import 'table_view.dart';
import 'truco_game.dart';

/// Frames per human seat produced by one call, in order.
typedef Frames = Map<int, List<TableView>>;

/// Delays between frames, so people can follow the computer's moves.
abstract final class FrameDelays {
  static const move = 850;
  static const afterRound = 1400;
  static const nextHand = 2200;
}

/// One game run by its authority (this device for a game against the
/// computer, the server for online games): humans' actions come in, bots
/// play until a human must act, and every step becomes a [TableView] frame
/// for each human seat.
///
/// The whole state is ([rules], [seed], [firstDealer], [bots], [log]); the
/// log holds every action (bots' too), so the server can store it and
/// rebuild the game on each request.
class GameSession {
  GameSession({
    required this.rules,
    required this.seed,
    required this.firstDealer,
    required List<AiLevel?> bots,
    List<Map<String, Object?>> log = const [],
    Random? random,
  }) : bots = List.unmodifiable(bots),
       _random = random ?? Random(),
       log = [] {
    assert(this.bots.length == 4);
    game = TrucoGame(rules: rules, seed: seed, firstDealer: firstDealer);
    for (final entry in log) {
      _applyLogged(entry);
    }
    talk.apply(game.events);
    _seen = game.events.length;
  }

  final TrucoRules rules;
  final int seed;
  final int firstDealer;

  /// Level of the computer player in each seat; null for a person.
  final List<AiLevel?> bots;
  final List<Map<String, Object?>> log;
  final Random _random;
  late final TrucoGame game;
  final TableTalk talk = TableTalk();
  int _seen = 0;

  bool isHuman(int seat) => bots[seat] == null;
  Iterable<int> get humanSeats => [
    for (var s = 0; s < 4; s++)
      if (isHuman(s)) s,
  ];

  TableView viewFor(int seat, {int delayMs = 0}) => TableView.of(
    game,
    seat,
    talk: talk,
    mayAnswer: isHuman,
    delayMs: delayMs,
  );

  /// A person's move. Throws [GameRuleError] if it isn't theirs to make.
  Frames act(int seat, GameAction action) {
    if (!isHuman(seat) || action.seat != seat) {
      throw GameRuleError('seat $seat is not a person');
    }
    game.apply(action);
    log.add(actionToJson(action));
    final frames = <int, List<TableView>>{};
    _snapshot(frames, 0);
    _advance(frames);
    return frames;
  }

  /// "Mão de ferro": a person picks a face-down card by position.
  Frames actBlind(int seat, int index) {
    final hand = game.handOf(seat);
    if (index < 0 || index >= hand.length) {
      throw GameRuleError('no card $index');
    }
    return act(seat, PlayCard(seat, hand[index]));
  }

  /// The person the game waits for, or null (game over, or a bot's move).
  int? get waitingFor {
    switch (game.phase) {
      case GamePhase.playing:
        return isHuman(game.turn) ? game.turn : null;
      case GamePhase.raisePending:
      case GamePhase.decision:
        final team = game.phase == GamePhase.decision
            ? game.decisionTeam!
            : game.pending!.team.other;
        final responder = game.responder;
        if (responder != null && isHuman(responder)) return responder;
        for (var s = 0; s < 4; s++) {
          if (teamOfSeat(s) == team && isHuman(s)) return s;
        }
        return null;
      case GamePhase.handOver:
      case GamePhase.gameOver:
        return null;
    }
  }

  /// The person took too long: the computer moves for them.
  Frames timeout({AiLevel level = AiLevel.medium}) {
    final seat = waitingFor;
    if (seat == null) throw GameRuleError('nobody to wait for');
    final action = TrucoBot(level, random: _random).decide(game.viewFor(seat));
    return act(seat, action);
  }

  /// Applies a person's action sent as JSON (online games).
  Frames actJson(int seat, Map<String, Object?> j) => j['t'] == 'blind'
      ? actBlind(seat, j['i']! as int)
      : act(seat, actionFromJson({...j, 's': seat}));

  /// Lets the computer play until a person must act (e.g. at the start).
  Frames advance() {
    final frames = <int, List<TableView>>{};
    _advance(frames);
    if (frames.isEmpty) _snapshot(frames, 0);
    return frames;
  }

  void _advance(Frames frames) {
    while (true) {
      final phase = game.phase;
      if (phase == GamePhase.gameOver) return;
      if (phase == GamePhase.handOver) {
        game.startNextHand();
        log.add(const {'t': 'next'});
        _snapshot(frames, FrameDelays.nextHand);
        continue;
      }
      final seat = _botToMove();
      if (seat == null) return;
      final wait = talk.roundJustEnded
          ? FrameDelays.afterRound
          : FrameDelays.move;
      final action = TrucoBot(
        bots[seat]!,
        random: _random,
      ).decide(game.viewFor(seat));
      game.apply(action);
      log.add(actionToJson(action));
      _snapshot(frames, wait);
    }
  }

  /// The bot whose move the game waits for, or null when a person must act.
  int? _botToMove() {
    switch (game.phase) {
      case GamePhase.playing:
        return isHuman(game.turn) ? null : game.turn;
      case GamePhase.raisePending:
      case GamePhase.decision:
        final team = game.phase == GamePhase.decision
            ? game.decisionTeam!
            : game.pending!.team.other;
        final seats = [
          for (var s = 0; s < 4; s++)
            if (teamOfSeat(s) == team) s,
        ];
        // A person on the team answers; otherwise the first bot does.
        if (seats.any(isHuman)) return null;
        return game.responder;
      case GamePhase.handOver:
      case GamePhase.gameOver:
        return null;
    }
  }

  void _snapshot(Frames frames, int delayMs) {
    talk.apply(game.events.skip(_seen));
    _seen = game.events.length;
    for (final s in humanSeats) {
      (frames[s] ??= []).add(viewFor(s, delayMs: delayMs));
    }
  }

  void _applyLogged(Map<String, Object?> entry) {
    if (entry['t'] == 'next') {
      game.startNextHand();
    } else {
      game.apply(actionFromJson(entry));
    }
    log.add(entry);
  }
}

Map<String, Object?> actionToJson(GameAction a) => switch (a) {
  PlayCard(:final seat, :final card, :final covered) => {
    't': 'play',
    's': seat,
    'c': card.id,
    if (covered) 'x': true,
  },
  Raise(:final seat) => {'t': 'raise', 's': seat},
  Accept(:final seat) => {'t': 'accept', 's': seat},
  Fold(:final seat) => {'t': 'fold', 's': seat},
};

GameAction actionFromJson(Map<String, Object?> j) {
  final seat = j['s']! as int;
  return switch (j['t']) {
    'play' => PlayCard(
      seat,
      Card.parse(j['c']! as String),
      covered: j['x'] == true,
    ),
    'raise' => Raise(seat),
    'accept' => Accept(seat),
    'fold' => Fold(seat),
    _ => throw GameRuleError('unknown action ${j['t']}'),
  };
}
