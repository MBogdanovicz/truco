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

  /// After someone showed their cards, a little longer to look at them.
  static const afterShown = 3500;

  /// How long players have to show their cards after a hand worth 3+.
  static const revealWindow = 5000;

  /// Between the computer players' draws for the first dealer.
  static const drawPick = 600;

  /// Showing the drawn cards before the first hand is dealt.
  static const afterDraw = 2800;

  /// How long people have to draw a card for the first dealer.
  static const drawWindow = 10000;
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
    bool drawDealer = false,
  }) : bots = List.unmodifiable(bots),
       _random = random ?? Random(),
       // A game that started with a draw says so in its first log entry.
       drawDealer = drawDealer || (log.isNotEmpty && log.first['t'] == 'draw'),
       log = [] {
    assert(this.bots.length == 4);
    if (this.drawDealer) {
      if (log.isEmpty) this.log.add(const {'t': 'draw'});
      _drawing = true;
      _spread = ([
        ...fullDeck,
      ]..shuffle(Random(seed ^ 0x2545F491))).take(drawCount).toList();
      // Only so [game] is never empty: it is replaced once the dealer is
      // known, and nobody sees or plays it.
      game = TrucoGame(rules: rules, seed: seed ^ 0x5BD1E995);
    } else {
      game = TrucoGame(rules: rules, seed: seed, firstDealer: firstDealer);
    }
    for (final entry in log) {
      _applyLogged(entry);
    }
    if (!_drawing) talk.apply(game.events.skip(_seen));
    _seen = game.events.length;
  }

  /// Before the first hand, everyone draws a card from the spread deck and
  /// the highest deals ([firstDealer] is used only if no person draws).
  final bool drawDealer;

  /// Cards spread for the draw.
  static const drawCount = 20;
  bool _drawing = false;
  List<Card> _spread = const [];
  final Map<int, int> _picks = {};

  /// The game waits for people to draw a card for the first dealer.
  bool get drawing => _drawing;

  /// Higher wins: rank first, then suit (paus > copas > espadas > ouros).
  static int drawStrength(Card c) => c.rank.index * 4 + c.suit.index;

  int _highestDraw() {
    var best = _picks.keys.first;
    for (final s in _picks.keys) {
      if (drawStrength(_spread[_picks[s]!]) >
          drawStrength(_spread[_picks[best]!])) {
        best = s;
      }
    }
    return best;
  }

  DrawView _drawView(int seat, {int? dealer, bool timedOut = false}) =>
      DrawView(
        count: _spread.length,
        picks: Map.unmodifiable(_picks),
        cards: dealer == null || timedOut
            ? const {}
            : {for (final e in _picks.entries) e.key: _spread[e.value]},
        dealer: dealer,
        timedOut: timedOut,
        canPick:
            _drawing &&
            dealer == null &&
            isHuman(seat) &&
            !_picks.containsKey(seat),
      );

  void _drawSnapshot(
    Frames frames,
    int delayMs, {
    int? dealer,
    bool timedOut = false,
  }) {
    for (final s in humanSeats) {
      (frames[s] ??= []).add(
        TableView.of(
          game,
          s,
          talk: TableTalk(),
          mayAnswer: (_) => false,
          delayMs: delayMs,
          draw: _drawView(s, dealer: dealer, timedOut: timedOut),
        ),
      );
    }
  }

  /// [seat] draws the card at [index] of the spread.
  Frames pick(int seat, int index) {
    if (!_drawing ||
        !isHuman(seat) ||
        _picks.containsKey(seat) ||
        index < 0 ||
        index >= _spread.length ||
        _picks.containsValue(index)) {
      throw GameRuleError('cannot draw $index');
    }
    _picks[seat] = index;
    log.add({'t': 'pick', 's': seat, 'i': index});
    final frames = <int, List<TableView>>{};
    _drawSnapshot(frames, 0);
    _advance(frames);
    return frames;
  }

  /// Everyone has drawn (or time ran out): the real game starts.
  void _beginGame(int dealer) {
    _drawing = false;
    game = TrucoGame(rules: rules, seed: seed, firstDealer: dealer);
    talk.resetForNewGame();
    _seen = 0;
  }

  /// Time to draw ran out: people who didn't draw get a random card; if
  /// no person drew at all, the dealer is drawn by lot as before.
  int? _closeDraw() {
    if (!humanSeats.any(_picks.containsKey)) return null;
    final r = Random(seed);
    for (var s = 0; s < 4; s++) {
      if (_picks.containsKey(s)) continue;
      final free = [
        for (var i = 0; i < _spread.length; i++)
          if (!_picks.containsValue(i)) i,
      ];
      _picks[s] = free[r.nextInt(free.length)];
    }
    return _highestDraw();
  }

  final TrucoRules rules;
  final int seed;
  final int firstDealer;

  /// Level of the computer player in each seat; null for a person.
  final List<AiLevel?> bots;
  final List<Map<String, Object?>> log;
  final Random _random;
  late TrucoGame game;
  final TableTalk talk = TableTalk();
  int _seen = 0;

  /// People done with the "mostrar cartas" moment of this hand.
  final Set<int> _ready = {};
  bool _revealClosed = false;

  bool isHuman(int seat) => bots[seat] == null;
  Iterable<int> get humanSeats => [
    for (var s = 0; s < 4; s++)
      if (isHuman(s)) s,
  ];

  TableView viewFor(int seat, {int delayMs = 0}) => TableView.of(
    game,
    seat,
    talk: _drawing ? TableTalk() : talk,
    mayAnswer: isHuman,
    delayMs: delayMs,
    revealing: revealing,
    canShow: canShowFor(seat),
    draw: _drawing ? _drawView(seat) : null,
  );

  /// After a hand worth 3+, the game waits a moment (see
  /// [FrameDelays.revealWindow]) for people to show their cards, until each
  /// person who could has shown them or passed, or the time runs out
  /// ([timeout]). Not in slow games.
  bool get revealing =>
      !_drawing &&
      !rules.isSlow &&
      !_revealClosed &&
      game.revealOpen &&
      humanSeats.any((s) => game.canShow(s) && !_ready.contains(s));

  bool canShowFor(int seat) =>
      isHuman(seat) &&
      revealing &&
      game.canShow(seat) &&
      !_ready.contains(seat);

  /// [seat] shows their cards ("Mostrar cartas").
  Frames show(int seat) {
    if (!canShowFor(seat)) throw GameRuleError('nothing to show');
    game.showCards(seat);
    log.add({'t': 'show', 's': seat});
    final frames = <int, List<TableView>>{};
    _snapshot(frames, 0);
    _advance(frames);
    return frames;
  }

  /// [seat] doesn't want to show their cards: the next hand needn't wait.
  Frames pass(int seat) {
    if (!canShowFor(seat)) throw GameRuleError('nothing to pass');
    _ready.add(seat);
    log.add({'t': 'ready', 's': seat});
    final frames = <int, List<TableView>>{};
    // The question goes away at once; the next hand follows as usual.
    _snapshot(frames, 0);
    _advance(frames);
    return frames;
  }

  /// A person's move. Throws [GameRuleError] if it isn't theirs to make.
  Frames act(int seat, GameAction action) {
    if (!isHuman(seat) || action.seat != seat) {
      throw GameRuleError('seat $seat is not a person');
    }
    if (_drawing) throw GameRuleError('drawing for the dealer');
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
    if (_drawing) return null;
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
        // The partner who has the last word is a bot.
        if (game.phase == GamePhase.raisePending &&
            game.pending!.refusedBy != null) {
          return null;
        }
        for (var s = 0; s < 4; s++) {
          if (teamOfSeat(s) == team && isHuman(s)) return s;
        }
        return null;
      case GamePhase.handOver:
      case GamePhase.gameOver:
        return null;
    }
  }

  /// The person took too long: the computer moves for them. With
  /// [missLimit] (tournament games), missing that many moves in a row
  /// gives the game up (W.O.).
  Frames timeout({AiLevel level = AiLevel.medium, int? missLimit}) {
    if (_drawing) {
      log.add(const {'t': 'draw-end'});
      final frames = <int, List<TableView>>{};
      final dealer = _closeDraw();
      _finishDraw(frames, dealer);
      _advance(frames);
      return frames;
    }
    if (waitingFor == null && revealing) {
      // Time to show the cards is over: deal the next hand.
      _revealClosed = true;
      log.add(const {'t': 'reveal-end'});
      final frames = <int, List<TableView>>{};
      _advance(frames);
      if (frames.isEmpty) _snapshot(frames, 0);
      return frames;
    }
    final seat = waitingFor;
    if (seat == null) throw GameRuleError('nobody to wait for');
    final action = TrucoBot(level, random: _random).decide(game.viewFor(seat));
    final frames = act(seat, action);
    // Marks the move as the computer's (see [missedInARow]).
    final i = log.lastIndexWhere((e) => e['s'] == seat);
    log[i] = {...log[i], 'to': true};
    if (missLimit != null &&
        game.phase != GamePhase.gameOver &&
        missedInARow(seat) >= missLimit) {
      final more = forfeit(seat);
      more.forEach((s, list) => (frames[s] ??= []).addAll(list));
    }
    return frames;
  }

  /// Moves of [seat] in a row (the latest ones) made by the computer
  /// because time ran out.
  int missedInARow(int seat) {
    var n = 0;
    for (final e in log.reversed) {
      if (e['s'] != seat) continue;
      if (e['to'] != true) break;
      n++;
    }
    return n;
  }

  /// [seat]'s team gives the game up (left a tournament game).
  Frames forfeit(int seat) {
    if (_drawing) _beginGame(firstDealer);
    game.forfeit(teamOfSeat(seat));
    log.add({'t': 'forfeit', 's': seat});
    final frames = <int, List<TableView>>{};
    _snapshot(frames, 0);
    return frames;
  }

  /// Applies a person's action sent as JSON (online games).
  Frames actJson(int seat, Map<String, Object?> j) => switch (j['t']) {
    'blind' => actBlind(seat, j['i']! as int),
    'pick' => pick(seat, j['i']! as int),
    'show' => show(seat),
    'ready' => pass(seat),
    _ => act(seat, actionFromJson({...j, 's': seat})),
  };

  /// Lets the computer play until a person must act (e.g. at the start).
  Frames advance() {
    final frames = <int, List<TableView>>{};
    _advance(frames);
    if (frames.isEmpty) _snapshot(frames, 0);
    return frames;
  }

  /// Shows the drawn cards (or that time ran out) and starts the game with
  /// that dealer ([dealer] null: drawn by lot).
  void _finishDraw(Frames frames, int? dealer) {
    final timedOut = dealer == null;
    final d = dealer ?? firstDealer;
    _drawSnapshot(
      frames,
      timedOut ? 0 : FrameDelays.move,
      dealer: d,
      timedOut: timedOut,
    );
    _beginGame(d);
    _snapshot(frames, timedOut ? 1800 : FrameDelays.afterDraw);
  }

  void _advance(Frames frames) {
    if (_drawing) {
      // The computer players draw, one after another.
      for (var s = 0; s < 4; s++) {
        if (isHuman(s) || _picks.containsKey(s)) continue;
        final free = [
          for (var i = 0; i < _spread.length; i++)
            if (!_picks.containsValue(i)) i,
        ];
        _picks[s] = free[_random.nextInt(free.length)];
        log.add({'t': 'pick', 's': s, 'i': _picks[s]});
        _drawSnapshot(frames, FrameDelays.drawPick);
      }
      if (_picks.length < 4) return;
      _finishDraw(frames, _highestDraw());
    }
    while (true) {
      final phase = game.phase;
      if (phase == GamePhase.gameOver) return;
      if (phase == GamePhase.handOver) {
        _botsReveal(frames);
        if (revealing) return;
        final wait = game.shown.isEmpty
            ? FrameDelays.nextHand
            : FrameDelays.afterShown;
        _nextHand();
        log.add(const {'t': 'next'});
        _snapshot(frames, wait);
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
        if (game.phase == GamePhase.raisePending &&
            game.pending!.refusedBy != null) {
          final last = game.responder!;
          return isHuman(last) ? null : last;
        }
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

  void _nextHand() {
    game.startNextHand();
    _ready.clear();
    _revealClosed = false;
    _botsRevealed = false;
  }

  /// Computer players decided whether to show their cards this hand.
  bool _botsRevealed = false;

  /// Chance that a computer player shows its cards after a hand worth 3+.
  static const botShowChance = 0.001;

  /// The computer players almost never show their cards (1 in 1000), and
  /// decide at once, so nobody waits for them.
  void _botsReveal(Frames frames) {
    if (_botsRevealed || !game.revealOpen || rules.isSlow) return;
    _botsRevealed = true;
    log.add(const {'t': 'bots-reveal'});
    for (var s = 0; s < 4; s++) {
      if (isHuman(s) || !game.canShow(s)) continue;
      if (_random.nextDouble() >= botShowChance) continue;
      game.showCards(s);
      log.add({'t': 'show', 's': s});
      _snapshot(frames, FrameDelays.move);
    }
  }

  void _applyLogged(Map<String, Object?> entry) {
    final t = entry['t'];
    if (t == 'draw') {
      // Marks a game that starts with the draw (see the constructor).
    } else if (t == 'pick') {
      _picks[entry['s']! as int] = entry['i']! as int;
      if (_picks.length == 4) _beginGame(_highestDraw());
    } else if (t == 'draw-end') {
      _beginGame(_closeDraw() ?? firstDealer);
    } else if (t == 'next') {
      _nextHand();
    } else if (t == 'show') {
      game.showCards(entry['s']! as int);
    } else if (t == 'ready') {
      _ready.add(entry['s']! as int);
    } else if (t == 'reveal-end') {
      _revealClosed = true;
    } else if (t == 'bots-reveal') {
      _botsRevealed = true;
    } else if (entry['t'] == 'forfeit') {
      if (_drawing) _beginGame(firstDealer);
      game.forfeit(teamOfSeat(entry['s']! as int));
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
