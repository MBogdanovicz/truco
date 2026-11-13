import 'dart:math';

import '../scorekeeper/team.dart';
import 'cards.dart';
import 'truco_game.dart';

enum AiLevel {
  easy('Fácil'),
  medium('Médio'),
  hard('Difícil');

  const AiLevel(this.label);
  final String label;
}

/// Computer player. It only sees a [PlayerView], like a human would.
///
/// * easy: mostly random cards, random bets;
/// * medium: sensible card play, bets on a quick estimate of the hand;
/// * hard: simulates many possible deals of the unknown cards to pick the
///   card and the bet with the best odds, and bluffs now and then.
class TrucoBot {
  TrucoBot(this.level, {Random? random}) : _random = random ?? Random();

  final AiLevel level;
  final Random _random;

  GameAction decide(PlayerView v) {
    final legal = v.legalActions;
    if (legal.isEmpty) throw StateError('no legal action for ${v.seat}');
    if (v.iron) {
      // Nobody sees their cards in a "mão de ferro".
      final plays = legal.whereType<PlayCard>().where((p) => !p.covered);
      return plays.elementAt(_random.nextInt(plays.length));
    }
    return switch (v.phase) {
      GamePhase.decision => _decision(v),
      GamePhase.raisePending => _answerRaise(v, legal),
      _ => _onTurn(v, legal),
    };
  }

  // ------------------------------------------------------------ betting --

  int get _samples => switch (level) {
    AiLevel.easy => 0,
    AiLevel.medium => 40,
    AiLevel.hard => 220,
  };

  GameAction _decision(PlayerView v) {
    if (level == AiLevel.easy) {
      return _random.nextDouble() < 0.6 ? Accept(v.seat) : Fold(v.seat);
    }
    var p = winProbability(v, samples: _samples);
    // Leading the first round, our good cards are out of position: whoever
    // plays after can kill them cheaply.
    if (level == AiLevel.hard && teamOfSeat(nextSeat(v.dealer)) == v.team) {
      p -= 0.08;
    }
    // Playing risks the decision value; running gives away the base value.
    final play = v.rules.decisionHandValue;
    final run = v.rules.baseValue;
    final threshold = (play - run) / (2 * play);
    final opp = v.scoreOf(v.team.other);
    // If running loses the game anyway, always play.
    if (opp + run >= v.rules.targetScore) return Accept(v.seat);
    return p > threshold + _noise(0.08) ? Accept(v.seat) : Fold(v.seat);
  }

  GameAction _answerRaise(PlayerView v, List<GameAction> legal) {
    final canReraise = legal.any((a) => a is Raise);
    if (level == AiLevel.easy) {
      final r = _random.nextDouble();
      if (canReraise && r < 0.05) return Raise(v.seat);
      return r < 0.65 ? Accept(v.seat) : Fold(v.seat);
    }
    final pending = v.pending!;
    final current = v.rules.stakes[v.stakeLevel];
    final asked = v.rules.stakes[pending.toLevel];
    // A raise says the other team likes its cards (the hard bot already
    // weighs that in its simulation).
    // A re-raise over our own call ("seis!" after our truco) is rarely a
    // facão: the risk is too big. Weigh it as real strength.
    final reraise = pending.toLevel >= 2;
    final p =
        winProbability(v, samples: _samples) -
        (level == AiLevel.hard ? (reraise ? 0.12 : 0) : 0.08);
    final opp = v.scoreOf(v.team.other);
    if (opp + current >= v.rules.targetScore) {
      // Running ends the game: fight.
      return canReraise && p > 0.7 ? Raise(v.seat) : Accept(v.seat);
    }
    if (canReraise && p > 0.78 + _noise(0.05)) return Raise(v.seat);
    // Accepting is worth p*asked - (1-p)*asked; running costs `current`.
    final accept = (2 * p - 1) * asked;
    final bluffCall = level == AiLevel.hard && _random.nextDouble() < 0.06;
    return accept > -current + _noise(0.3) || bluffCall
        ? Accept(v.seat)
        : Fold(v.seat);
  }

  GameAction _onTurn(PlayerView v, List<GameAction> legal) {
    final canRaise = legal.any((a) => a is Raise);
    if (canRaise && _wantsToRaise(v)) return Raise(v.seat);
    return _chooseCard(v, legal);
  }

  bool _wantsToRaise(PlayerView v) {
    final ours = v.scoreOf(v.team);
    // No point raising a hand that already wins the game.
    if (ours + v.handValue >= v.rules.targetScore) return false;
    switch (level) {
      case AiLevel.easy:
        return _random.nextDouble() < 0.08;
      case AiLevel.medium:
        final p = winProbability(v, samples: _samples);
        return p > 0.72 + _noise(0.06) || _random.nextDouble() < 0.03;
      case AiLevel.hard:
        final p = winProbability(v, samples: _samples);
        // A hand that is all but won: let the other team get excited and
        // call truco (then raise them), and only ask at the last card.
        if (p > 0.9 && v.hand.length > 1 && _random.nextDouble() < 0.8) {
          return false;
        }
        if (p > 0.62 + _noise(0.03)) return true;
        // Rare "facão", late in the hand when fewer cards are hidden.
        return v.rounds.isNotEmpty && p < 0.3 && _random.nextDouble() < 0.04;
    }
  }

  double _noise(double amp) => (_random.nextDouble() * 2 - 1) * amp;

  // ---------------------------------------------------------- card play --

  GameAction _chooseCard(PlayerView v, List<GameAction> legal) {
    final hand = v.hand;
    if (level == AiLevel.easy && _random.nextDouble() < 0.55) {
      return PlayCard(v.seat, hand[_random.nextInt(hand.length)]);
    }
    Card card;
    if (level == AiLevel.hard && hand.length > 1) {
      card = _bestCardBySimulation(v);
    } else {
      final strengths = [for (final c in hand) v.strength(c)];
      card =
          hand[heuristicPick(
            strengths,
            current: [
              for (final p in v.currentPlays) (p.seat, v.strengthOf(p)),
            ],
            seat: v.seat,
            roundWinners: [for (final r in v.rounds) r.winner],
          )];
    }
    // A card that can't win this round may go face down, hiding information.
    if (level == AiLevel.hard &&
        v.canCover &&
        !_wins(v, card) &&
        _random.nextDouble() < 0.5) {
      return PlayCard(v.seat, card, covered: true);
    }
    // Leading after winning the first with the hand all but won (the gato
    // kept for the third): a low card face down looks weak, so they keep
    // their good cards and may call truco, instead of spending a manilha
    // to beat a card shown.
    if (level == AiLevel.hard &&
        v.canCover &&
        v.currentPlays.isEmpty &&
        v.rounds.length == 1 &&
        v.rounds.first.winner == v.team &&
        hand.length > 1 &&
        !v.rules.isManilha(card, vira: v.vira) &&
        winProbability(v, samples: 120) > 0.9) {
      return PlayCard(v.seat, card, covered: true);
    }
    return PlayCard(v.seat, card);
  }

  bool _wins(PlayerView v, Card card) {
    final s = v.strength(card);
    return v.currentPlays.every((p) => v.strengthOf(p) < s);
  }

  /// Keeps the heuristic card unless simulations clearly favour another.
  Card _bestCardBySimulation(PlayerView v) {
    final hand = v.hand;
    final strengths = [for (final c in hand) v.strength(c)];
    final usual =
        hand[heuristicPick(
          strengths,
          current: [for (final p in v.currentPlays) (p.seat, v.strengthOf(p))],
          seat: v.seat,
          roundWinners: [for (final r in v.rounds) r.winner],
        )];
    var best = usual;
    var bestScore = winProbability(v, samples: 160, firstCard: usual) + 0.04;
    for (final c in hand) {
      if (c == usual) continue;
      final score = winProbability(v, samples: 160, firstCard: c);
      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
    }
    return best;
  }

  // --------------------------------------------------------- simulation --

  /// Chance that this seat's team wins the current hand, estimated by
  /// dealing the unknown cards at random [samples] times and playing the
  /// rest of the hand out with [heuristicPick] for everyone.
  double winProbability(PlayerView v, {required int samples, Card? firstCard}) {
    if (samples <= 0) return 0.5;
    final known = v.knownCards;
    final pool = [
      for (final c in fullDeck)
        if (!known.contains(c)) c,
    ];
    final partner = partnerOf(v.seat);
    final partnerHand = v.partnerHand;
    // The hard bot reads a raise from the other team as a sign of strength
    // and gives more weight to deals where they hold good cards.
    final oppRaised =
        level == AiLevel.hard &&
        (v.pending?.team == v.team.other || v.lastRaiser == v.team.other);
    var wins = 0.0, total = 0.0;
    for (var i = 0; i < samples; i++) {
      pool.shuffle(_random);
      var k = 0;
      final hands = List<List<int>>.generate(4, (s) {
        if (s == v.seat) return [for (final c in v.hand) v.strength(c)];
        // Partner cards we may see (all, or just one when we dealt); the
        // rest are drawn at random like everyone else's.
        final seen = s == partner
            ? (partnerHand ?? const <Card>[])
            : const <Card>[];
        final n = v.handCountOf(s) - seen.length;
        final h = [
          for (final c in seen) v.strength(c),
          for (var j = 0; j < n; j++) v.strength(pool[k + j]),
        ];
        k += n;
        return h;
      });
      var weight = 1.0;
      if (oppRaised) {
        for (final s in [nextSeat(v.seat), nextSeat(partner)]) {
          for (final str in hands[s]) {
            if (str >= 8) weight *= 1.8;
          }
        }
      }
      final w = simulateHand(
        hands: hands,
        current: [for (final p in v.currentPlays) (p.seat, v.strengthOf(p))],
        turn: v.turn,
        roundWinners: [for (final r in v.rounds) r.winner],
        forcedFirst: firstCard == null ? null : (v.seat, v.strength(firstCard)),
      );
      total += weight;
      if (w == v.team) {
        wins += weight;
      } else if (w == null) {
        wins += weight / 2;
      }
    }
    return wins / total;
  }
}

/// Plays out the rest of a hand with [heuristicPick] for every seat and
/// returns the winning team (null if every round tied). Hands hold card
/// strengths; [hands] is consumed.
Team? simulateHand({
  required List<List<int>> hands,
  required List<(int, int)> current,
  required int turn,
  required List<Team?> roundWinners,
  (int, int)? forcedFirst,
}) {
  final winners = [...roundWinners];
  final plays = [...current];
  var seat = turn;
  var forced = forcedFirst;
  while (true) {
    final outcome = handOutcomeOf(winners);
    if (outcome != null) return outcome.winner;
    while (plays.length < 4) {
      final h = hands[seat];
      int idx;
      if (forced != null && forced.$1 == seat) {
        idx = h.indexOf(forced.$2);
        forced = null;
      } else {
        idx = heuristicPick(
          h,
          current: plays,
          seat: seat,
          roundWinners: winners,
        );
      }
      plays.add((seat, h.removeAt(idx)));
      seat = nextSeat(seat);
    }
    var best = -2;
    for (final p in plays) {
      best = max(best, p.$2);
    }
    final top = plays.where((p) => p.$2 == best).toList();
    final teams = top.map((p) => teamOfSeat(p.$1)).toSet();
    winners.add(teams.length == 1 ? teams.single : null);
    seat = top.first.$1;
    plays.clear();
  }
}

/// Index of the card a sensible player would play from [hand] (strengths),
/// given the plays of the round so far as (seat, strength).
int heuristicPick(
  List<int> hand, {
  required List<(int, int)> current,
  required int seat,
  required List<Team?> roundWinners,
}) {
  int idxMin() {
    var i = 0;
    for (var j = 1; j < hand.length; j++) {
      if (hand[j] < hand[i]) i = j;
    }
    return i;
  }

  int idxMax() {
    var i = 0;
    for (var j = 1; j < hand.length; j++) {
      if (hand[j] > hand[i]) i = j;
    }
    return i;
  }

  if (hand.length == 1) return 0;
  final team = teamOfSeat(seat);
  // Losing this round loses the hand (first lost or tied, or one each).
  final decisive =
      roundWinners.isNotEmpty &&
      (roundWinners.first != team || roundWinners.length > 1);
  if (current.isEmpty) {
    // After winning the first, lead low: the partner, closer to the pé,
    // answers if needed, and the strong card stays for the third round.
    if (roundWinners.isNotEmpty) return decisive ? idxMax() : idxMin();
    // First round: whoever leads is far from the pé. Lead low and let the
    // partner (closer to the pé) play the strong card: a 3 led here can be
    // killed by a manilha, while kept it may come back with us at the pé.
    return idxMin();
  }
  var bestOpp = -2, bestOurs = -2;
  for (final (s, str) in current) {
    if (teamOfSeat(s) == team) {
      bestOurs = max(bestOurs, str);
    } else {
      bestOpp = max(bestOpp, str);
    }
  }
  // Second to play: the partner is the pé and plays after both opponents.
  // Win cheaply when a plain card does it; otherwise keep the manilhas and
  // leave the round to the partner, unless the round decides the hand.
  if (current.length == 1 && teamOfSeat(current.first.$1) != team) {
    var cheap = -1;
    for (var j = 0; j < hand.length; j++) {
      if (hand[j] > bestOpp && (cheap < 0 || hand[j] < hand[cheap])) cheap = j;
    }
    if (cheap >= 0 && (hand[cheap] < 10 || decisive)) return cheap;
    return idxMin();
  }
  // Partner is winning: save the good cards, unless an opponent still plays
  // after us and partner's card is weak.
  final last = current.length == 3;
  if (bestOurs > bestOpp && (last || bestOurs >= 8)) return idxMin();
  final target = max(bestOpp, bestOurs > bestOpp ? bestOurs : -2);
  var pick = -1;
  for (var j = 0; j < hand.length; j++) {
    if (hand[j] > target && (pick < 0 || hand[j] < hand[pick])) pick = j;
  }
  if (pick >= 0) return pick;
  // Tie the round ("amarrar") when that already wins us the hand.
  if (roundWinners.isNotEmpty && roundWinners.first == team) {
    final tie = hand.indexOf(bestOpp);
    if (tie >= 0) return tie;
  }
  return idxMin();
}
