import 'dart:math';

import '../scorekeeper/team.dart';
import 'cards.dart';
import 'rules.dart';

/// Seats 0..3 sit in playing order; 0 and 2 are team A, 1 and 3 team B.
Team teamOfSeat(int seat) => seat.isEven ? Team.a : Team.b;
int partnerOf(int seat) => (seat + 2) % 4;
int nextSeat(int seat) => (seat + 1) % 4;

enum GamePhase {
  /// "Mão de onze": the team at [TrucoRules.decisionScore] decides to play
  /// or run.
  decision,

  /// Waiting for [TrucoGame.turn] to play a card (or call truco).
  playing,

  /// A raise was called; the other team must accept, run or raise again.
  raisePending,

  /// The hand is decided; call [TrucoGame.startNextHand].
  handOver,

  gameOver,
}

// ---------------------------------------------------------------- actions --

sealed class GameAction {
  const GameAction(this.seat);
  final int seat;
}

/// Plays [card] from the hand, optionally face down ("encoberta").
class PlayCard extends GameAction {
  const PlayCard(super.seat, this.card, {this.covered = false});
  final Card card;
  final bool covered;
  @override
  String toString() => 'PlayCard($seat, $card${covered ? ', covered' : ''})';
}

/// Calls truco, or answers a raise with a higher one ("seis!").
class Raise extends GameAction {
  const Raise(super.seat);
  @override
  String toString() => 'Raise($seat)';
}

/// Accepts a raise, or chooses to play a "mão de onze".
class Accept extends GameAction {
  const Accept(super.seat);
  @override
  String toString() => 'Accept($seat)';
}

/// Runs from a raise or from a "mão de onze" ("correr").
class Fold extends GameAction {
  const Fold(super.seat);
  @override
  String toString() => 'Fold($seat)';
}

// ----------------------------------------------------------------- events --

sealed class GameEvent {
  const GameEvent();
}

class HandStarted extends GameEvent {
  const HandStarted({
    required this.handNumber,
    required this.dealer,
    required this.vira,
    required this.decisionTeam,
    required this.iron,
  });
  final int handNumber;
  final int dealer;
  final Card? vira;
  final Team? decisionTeam;
  final bool iron;
}

class DecisionMade extends GameEvent {
  const DecisionMade(this.seat, {required this.play});
  final int seat;
  final bool play;
}

class CardPlayed extends GameEvent {
  const CardPlayed(this.seat, this.card, {required this.covered});
  final int seat;
  final Card card;
  final bool covered;
}

class RaiseCalled extends GameEvent {
  const RaiseCalled(this.seat, {required this.value, required this.name});
  final int seat;
  final int value;
  final String name;
}

class RaiseAccepted extends GameEvent {
  const RaiseAccepted(this.seat, {required this.value});
  final int seat;
  final int value;
}

class Folded extends GameEvent {
  const Folded(this.seat);
  final int seat;
}

class RoundEnded extends GameEvent {
  const RoundEnded(this.round, {required this.winner, required this.topSeat});
  final int round;

  /// Null when the round was tied ("empatou" / "cangou").
  final Team? winner;
  final int topSeat;
}

class HandEnded extends GameEvent {
  const HandEnded({required this.winner, required this.points});

  /// Null when all rounds tied and nobody scores.
  final Team? winner;
  final int points;
}

class GameEnded extends GameEvent {
  const GameEnded(this.winner);
  final Team winner;
}

// ------------------------------------------------------------------ state --

class Play {
  const Play(this.seat, this.card, {this.covered = false});
  final int seat;
  final Card card;
  final bool covered;
}

class RoundResult {
  const RoundResult(this.plays, {required this.winner, required this.topSeat});
  final List<Play> plays;
  final Team? winner;
  final int topSeat;
  bool get tied => winner == null;
}

class PendingRaise {
  const PendingRaise({required this.seat, required this.toLevel});

  /// Who called it.
  final int seat;
  final int toLevel;
  Team get team => teamOfSeat(seat);
}

class GameRuleError implements Exception {
  GameRuleError(this.message);
  final String message;
  @override
  String toString() => 'GameRuleError: $message';
}

/// Authoritative state of one truco game (to [TrucoRules.targetScore]).
///
/// Pure Dart and deterministic for a given [seed], so the same engine can run
/// on the host of an online or nearby room later. Players only ever see a
/// [PlayerView].
class TrucoGame {
  TrucoGame({required this.rules, int? seed, int firstDealer = 3})
    : _random = Random(seed),
      _dealer = (firstDealer + 3) % 4 {
    startNextHand();
  }

  final TrucoRules rules;
  final Random _random;

  final Map<Team, int> scores = {Team.a: 0, Team.b: 0};
  final List<GameEvent> events = [];

  int _dealer;
  int _handNumber = 0;
  GamePhase _phase = GamePhase.handOver;
  List<List<Card>> _hands = List.generate(4, (_) => <Card>[]);
  List<List<Card>> _dealt = List.generate(4, (_) => <Card>[]);
  Card? _vira;
  final List<RoundResult> _rounds = [];
  final List<Play> _current = [];
  int _turn = 0;
  int _stakeLevel = 0;
  Team? _lastRaiser;
  PendingRaise? _pending;
  Team? _decisionTeam;
  bool _iron = false;
  Team? _winner;

  int get dealer => _dealer;
  int get handNumber => _handNumber;
  GamePhase get phase => _phase;
  Card? get vira => _vira;
  int get turn => _turn;
  int get stakeLevel => _stakeLevel;
  PendingRaise? get pending => _pending;
  Team? get decisionTeam => _decisionTeam;

  /// Team whose raise was the last one accepted this hand.
  Team? get lastRaiser => _lastRaiser;
  bool get iron => _iron;
  Team? get winner => _winner;
  List<RoundResult> get rounds => List.unmodifiable(_rounds);
  List<Play> get currentPlays => List.unmodifiable(_current);
  List<Card> handOf(int seat) => List.unmodifiable(_hands[seat]);

  /// The three cards [seat] got at the start of this hand.
  List<Card> dealtTo(int seat) => List.unmodifiable(_dealt[seat]);

  /// What the current hand is worth if nobody raises again.
  int get handValue {
    if (_decisionTeam != null) return rules.decisionHandValue;
    return rules.stakes[_stakeLevel];
  }

  /// Seat that answers a pending raise or the "mão de onze" decision when a
  /// single seat must be chosen (the first of that team after the caller).
  int? get responder {
    switch (_phase) {
      case GamePhase.raisePending:
        return nextSeat(_pending!.seat);
      case GamePhase.decision:
        final t = _decisionTeam!;
        final first = nextSeat(_dealer);
        return teamOfSeat(first) == t ? first : nextSeat(first);
      default:
        return null;
    }
  }

  int strengthOf(Play p) =>
      p.covered ? coveredStrength : rules.strength(p.card, vira: _vira);

  // ------------------------------------------------------------ dealing --

  /// Deals the next hand. Only valid once the previous hand is over.
  void startNextHand() {
    if (_phase != GamePhase.handOver) {
      throw GameRuleError('hand still in progress');
    }
    _handNumber++;
    _dealer = nextSeat(_dealer);
    final deck = [...fullDeck]..shuffle(_random);
    _hands = [for (var s = 0; s < 4; s++) deck.sublist(s * 3, s * 3 + 3)];
    _dealt = [for (final h in _hands) List<Card>.unmodifiable(h)];
    _vira = rules.manilhaMode == ManilhaMode.vira ? deck[12] : null;
    _rounds.clear();
    _current.clear();
    _stakeLevel = 0;
    _lastRaiser = null;
    _pending = null;
    _turn = nextSeat(_dealer);

    final atDecision = [
      for (final t in Team.values)
        if (scores[t] == rules.decisionScore) t,
    ];
    _iron = atDecision.length == 2 && rules.ironHand;
    _decisionTeam = atDecision.length == 1 ? atDecision.single : null;
    _phase = _decisionTeam != null ? GamePhase.decision : GamePhase.playing;
    events.add(
      HandStarted(
        handNumber: _handNumber,
        dealer: _dealer,
        vira: _vira,
        decisionTeam: _decisionTeam,
        iron: _iron,
      ),
    );
  }

  // ------------------------------------------------------------ actions --

  /// Every action [seat] may take right now.
  List<GameAction> legalActions(int seat) {
    final team = teamOfSeat(seat);
    switch (_phase) {
      case GamePhase.decision:
        if (team != _decisionTeam) return const [];
        return [Accept(seat), Fold(seat)];
      case GamePhase.raisePending:
        if (team == _pending!.team) return const [];
        return [
          Accept(seat),
          Fold(seat),
          if (_pending!.toLevel + 1 < rules.stakes.length) Raise(seat),
        ];
      case GamePhase.playing:
        if (seat != _turn) return const [];
        return [
          for (final c in _hands[seat]) PlayCard(seat, c),
          if (canCover)
            for (final c in _hands[seat]) PlayCard(seat, c, covered: true),
          if (canRaise(seat)) Raise(seat),
        ];
      case GamePhase.handOver:
      case GamePhase.gameOver:
        return const [];
    }
  }

  bool get canCover => rules.allowCoveredCard && !_iron && _rounds.isNotEmpty;

  bool canRaise(int seat) =>
      _phase == GamePhase.playing &&
      seat == _turn &&
      _decisionTeam == null &&
      !_iron &&
      _lastRaiser != teamOfSeat(seat) &&
      _stakeLevel + 1 < rules.stakes.length;

  void apply(GameAction action) {
    final legal = legalActions(action.seat);
    final ok = legal.any((a) => _same(a, action));
    if (!ok) throw GameRuleError('illegal $action in $_phase');
    switch (action) {
      case PlayCard():
        _play(action);
      case Raise():
        _raise(action.seat);
      case Accept():
        _accept(action.seat);
      case Fold():
        _fold(action.seat);
    }
  }

  static bool _same(GameAction a, GameAction b) => switch ((a, b)) {
    (PlayCard x, PlayCard y) =>
      x.card == y.card && x.covered == y.covered && x.seat == y.seat,
    (Raise x, Raise y) => x.seat == y.seat,
    (Accept x, Accept y) => x.seat == y.seat,
    (Fold x, Fold y) => x.seat == y.seat,
    _ => false,
  };

  void _raise(int seat) {
    final from = _pending?.toLevel ?? _stakeLevel;
    if (_pending != null) {
      // Answering with a higher bet accepts the current one first.
      _stakeLevel = _pending!.toLevel;
      _lastRaiser = _pending!.team;
    }
    final to = from + 1;
    _pending = PendingRaise(seat: seat, toLevel: to);
    _phase = GamePhase.raisePending;
    events.add(
      RaiseCalled(seat, value: rules.stakes[to], name: rules.raiseName(to - 1)),
    );
  }

  void _accept(int seat) {
    if (_phase == GamePhase.decision) {
      events.add(DecisionMade(seat, play: true));
      _phase = GamePhase.playing;
      return;
    }
    final p = _pending!;
    _stakeLevel = p.toLevel;
    _lastRaiser = p.team;
    _pending = null;
    _phase = GamePhase.playing;
    events.add(RaiseAccepted(seat, value: rules.stakes[_stakeLevel]));
  }

  void _fold(int seat) {
    if (_phase == GamePhase.decision) {
      events.add(DecisionMade(seat, play: false));
      _endHand(teamOfSeat(seat).other, rules.baseValue);
      return;
    }
    events.add(Folded(seat));
    // The caller takes what the hand was worth before the refused raise.
    _endHand(_pending!.team, rules.stakes[_stakeLevel]);
  }

  void _play(PlayCard a) {
    _hands[a.seat].remove(a.card);
    _current.add(Play(a.seat, a.card, covered: a.covered));
    events.add(CardPlayed(a.seat, a.card, covered: a.covered));
    if (_current.length < 4) {
      _turn = nextSeat(_turn);
      return;
    }
    // Round complete.
    var best = -2;
    for (final p in _current) {
      best = max(best, strengthOf(p));
    }
    final top = _current.where((p) => strengthOf(p) == best).toList();
    final teams = top.map((p) => teamOfSeat(p.seat)).toSet();
    final winner = teams.length == 1 ? teams.single : null;
    final result = RoundResult(
      List.unmodifiable(_current),
      winner: winner,
      topSeat: top.first.seat,
    );
    _rounds.add(result);
    _current.clear();
    events.add(
      RoundEnded(_rounds.length, winner: winner, topSeat: result.topSeat),
    );
    final decided = handOutcome(_rounds);
    if (decided != null) {
      _endHand(decided.winner, handValue);
    } else {
      _turn = result.topSeat;
    }
  }

  void _endHand(Team? winner, int points) {
    _pending = null;
    events.add(HandEnded(winner: winner, points: winner == null ? 0 : points));
    if (winner != null) {
      scores[winner] = min(rules.targetScore, scores[winner]! + points);
      if (scores[winner]! >= rules.targetScore) {
        _winner = winner;
        _phase = GamePhase.gameOver;
        events.add(GameEnded(winner));
        return;
      }
    }
    _phase = GamePhase.handOver;
  }

  PlayerView viewFor(int seat) => PlayerView._(this, seat);
}

/// Who won a hand given its finished rounds, or null while undecided.
/// `(winner: null)` means every round tied and nobody scores.
({Team? winner})? handOutcome(List<RoundResult> rounds) =>
    handOutcomeOf([for (final r in rounds) r.winner]);

/// [handOutcome] over the round winners alone (null = tied round).
({Team? winner})? handOutcomeOf(List<Team?> winners) {
  var a = 0, b = 0;
  for (final w in winners) {
    if (w == Team.a) a++;
    if (w == Team.b) b++;
  }
  if (a >= 2) return (winner: Team.a);
  if (b >= 2) return (winner: Team.b);
  if (winners.length >= 2) {
    final r1 = winners[0], r2 = winners[1];
    // A tie after a won round goes to whoever won the first one, and a won
    // round after a tied first round decides the hand.
    if (r1 != null && r2 == null) return (winner: r1);
    if (r1 == null && r2 != null) return (winner: r2);
  }
  if (winners.length == 3) {
    return (winner: winners[2] ?? winners[0]); // null if everything tied
  }
  return null;
}

/// What one seat is allowed to know about the game.
class PlayerView {
  PlayerView._(this._game, this.seat);
  final TrucoGame _game;
  final int seat;

  TrucoRules get rules => _game.rules;
  Team get team => teamOfSeat(seat);
  GamePhase get phase => _game.phase;
  int get turn => _game.turn;
  int get dealer => _game.dealer;
  int get handNumber => _game.handNumber;
  Card? get vira => _game.vira;
  int get handValue => _game.handValue;
  int get stakeLevel => _game.stakeLevel;
  PendingRaise? get pending => _game.pending;
  Team? get decisionTeam => _game.decisionTeam;
  Team? get lastRaiser => _game.lastRaiser;
  bool get iron => _game.iron;
  int scoreOf(Team t) => _game.scores[t]!;
  List<RoundResult> get rounds => _game.rounds;
  List<Play> get currentPlays => _game.currentPlays;
  List<GameAction> get legalActions => _game.legalActions(seat);
  bool get canCover => _game.canCover;

  /// Own cards; empty in a "mão de ferro", where nobody sees their hand.
  List<Card> get hand => _game.iron ? const [] : _game.handOf(seat);
  int get handCount => _game.handOf(seat).length;
  int handCountOf(int s) => _game.handOf(s).length;

  /// In a "mão de onze" the deciding team sees each other's cards.
  List<Card>? get partnerHand =>
      _game.decisionTeam == team ? _game.handOf(partnerOf(seat)) : null;

  int strength(Card c) => _game.rules.strength(c, vira: _game.vira);
  int strengthOf(Play p) => _game.strengthOf(p);

  /// Every card this seat has seen this hand (own, vira, face-up plays,
  /// partner's in a mão de onze). The rest are unknown.
  Set<Card> get knownCards => {
    ...hand,
    ?vira,
    ...?partnerHand,
    for (final r in rounds)
      for (final p in r.plays)
        if (!p.covered) p.card,
    for (final p in currentPlays)
      if (!p.covered) p.card,
  };
}
