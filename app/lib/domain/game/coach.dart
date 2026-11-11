import 'dart:math';

import 'ai.dart';
import 'cards.dart';
import 'truco_game.dart';

/// A comment from the "modo professor" about a move.
class CoachTip {
  const CoachTip(this.text, {this.good = false});
  final String text;

  /// Praise rather than a correction.
  final bool good;

  @override
  String toString() => text;
}

/// "Modo professor": looks at a person's move against the computer and says
/// when a clearly better one existed, and why. It estimates the chances the
/// same way the hard computer player does (dealing the unknown cards many
/// times), so it only sees what the person could see.
class Coach {
  const Coach({this.seed = 7});
  final int seed;

  static const _samples = 400;

  /// Call with [v] as it was when the person chose [action] (before it was
  /// applied). Null when there is nothing worth saying.
  CoachTip? review(PlayerView v, GameAction action) {
    if (v.iron) return null; // Nobody sees their cards: nothing to teach.
    return switch (v.phase) {
      GamePhase.decision => _decision(v, action),
      GamePhase.raisePending => _answer(v, action),
      GamePhase.playing => _turn(v, action),
      _ => null,
    };
  }

  // A fresh, seeded bot each time: the same situation gets the same advice.
  double _chance(PlayerView v, {Card? firstCard}) => TrucoBot(
    AiLevel.hard,
    random: Random(seed),
  ).winProbability(v, samples: _samples, firstCard: firstCard);

  static String pct(double p) => '${(p * 20).round() * 5}%';

  static String cardName(Card c) => c.label;

  // ------------------------------------------------------- mão de onze --

  CoachTip? _decision(PlayerView v, GameAction action) {
    final play = v.rules.decisionHandValue;
    final run = v.rules.baseValue;
    final opp = v.scoreOf(v.team.other);
    if (action is Fold && opp + run >= v.rules.targetScore) {
      return const CoachTip(
        'Correr entregava a partida aos adversários: na mão de onze, nesse '
        'placar, é jogar de qualquer jeito.',
      );
    }
    final p = _chance(v);
    // Playing wins or loses `play`; running gives away `run`.
    final threshold = (play - run) / (2 * play);
    if (action is Accept && p < threshold - 0.12) {
      return CoachTip(
        'Arriscado: com essas cartas (as suas e as do parceiro) a chance de '
        'ganhar a mão de onze era de uns ${pct(p)}. Correndo você perde só '
        '$run ponto; jogando, arrisca $play.',
      );
    }
    if (action is Fold && p > threshold + 0.15) {
      return CoachTip(
        'Dava para jogar: vocês tinham uns ${pct(p)} de chance de ganhar a '
        'mão de onze, e jogar vale $play pontos contra $run de correr.',
      );
    }
    return null;
  }

  // ------------------------------------------------- answering a raise --

  CoachTip? _answer(PlayerView v, GameAction action) {
    final pending = v.pending!;
    final current = v.rules.stakes[v.stakeLevel];
    final asked = v.rules.stakes[pending.toLevel];
    final opp = v.scoreOf(v.team.other);
    final name = v.rules.raiseName(pending.toLevel - 1).toLowerCase();
    if (action is Fold && opp + current >= v.rules.targetScore) {
      return CoachTip(
        'Correr dava a partida aos adversários: aceitar o $name era a única '
        'chance.',
      );
    }
    final p = _chance(v);
    // Accepting: win or lose `asked`. Running: lose `current`.
    final accept = (2 * p - 1) * asked;
    final margin = max(1.0, asked * 0.25);
    if (action is Fold && accept > -current + margin) {
      return CoachTip(
        'Valia aceitar: a chance de ganhar a mão era de uns ${pct(p)}. '
        'Correndo, você entregou $current ${_pontos(current)}; aceitando, '
        'arriscava $asked para ganhar $asked.',
      );
    }
    if (action is Accept && accept < -current - margin) {
      final odds = p < 0.03
          ? 'a mão já estava perdida'
          : 'a chance de ganhar a mão era de só uns ${pct(p)}';
      return CoachTip(
        'Era melhor correr: $odds. Correndo, você perdia $current '
        '${_pontos(current)}; aceitando, arriscou $asked.',
      );
    }
    if (action is Raise && p < 0.45) {
      return CoachTip(
        'Pedir mais com uns ${pct(p)} de chance é blefe. Às vezes funciona, '
        'mas se aceitarem a conta fica alta.',
      );
    }
    return null;
  }

  static String _pontos(int n) => n == 1 ? 'ponto' : 'pontos';

  // ----------------------------------------------------- on your turn --

  CoachTip? _turn(PlayerView v, GameAction action) {
    if (action is Raise) {
      final ours = v.scoreOf(v.team);
      if (ours + v.handValue >= v.rules.targetScore) {
        return const CoachTip(
          'Essa mão já valia a partida: pedir truco só dá ao adversário a '
          'chance de correr e entregar menos.',
        );
      }
      final p = _chance(v);
      if (p < 0.03) {
        return const CoachTip(
          'A mão já estava perdida: esse truco só funciona se eles correrem. '
          'Se aceitarem, vocês perdem mais pontos.',
        );
      }
      if (p < 0.3) {
        return CoachTip(
          'Truco com uns ${pct(p)} de chance é blefe. Funciona às vezes, '
          'mas se aceitarem você arrisca mais.',
        );
      }
      return null;
    }
    if (action is! PlayCard) return null;
    final hand = v.hand;
    final chosen = action.card;

    if (action.covered && _winsRound(v, chosen)) {
      return CoachTip(
        'Você cobriu o ${cardName(chosen)}, que ganhava a rodada. Coberta '
        'perde para qualquer carta.',
      );
    }
    if (hand.length < 2 || action.covered) return null;

    final chances = {for (final c in hand) c: _chance(v, firstCard: c)};
    final best = chances.entries.reduce((a, b) => b.value > a.value ? b : a);
    final mine = chances[chosen]!;

    if (best.value - mine >= 0.1 && best.key != chosen) {
      return CoachTip(_why(v, chosen, best.key, mine, best.value));
    }

    // Didn't call truco with a hand that was very likely to win.
    if (v.legalActions.any((a) => a is Raise) &&
        v.stakeLevel == 0 &&
        v.scoreOf(v.team) + v.handValue < v.rules.targetScore) {
      final p = _chance(v);
      if (p > 0.85) {
        return CoachTip(
          'Com uns ${pct(p)} de chance de ganhar a mão, valia pedir truco '
          'antes de jogar.',
        );
      }
    }

    final others = [
      for (final e in chances.entries)
        if (e.key != chosen) e.value,
    ];
    if (others.isNotEmpty && mine - others.reduce(max) >= 0.2) {
      return const CoachTip(
        'Boa! Era a melhor carta para essa hora.',
        good: true,
      );
    }
    return null;
  }

  bool _winsRound(PlayerView v, Card c) {
    final s = v.strength(c);
    return v.currentPlays.every((p) => v.strengthOf(p) < s);
  }

  String _why(
    PlayerView v,
    Card chosen,
    Card better,
    double mine,
    double best,
  ) {
    final s = v.strength(chosen), b = v.strength(better);
    var bestOurs = -2, bestOpp = -2;
    for (final p in v.currentPlays) {
      final str = v.strengthOf(p);
      if (teamOfSeat(p.seat) == v.team) {
        bestOurs = max(bestOurs, str);
      } else {
        bestOpp = max(bestOpp, str);
      }
    }
    final odds =
        'Com o ${cardName(better)}, a chance de ganhar a mão era de uns '
        '${pct(best)}; com o ${cardName(chosen)}, ${pct(mine)}.';
    if (b < s) {
      if (bestOurs > bestOpp && v.currentPlays.isNotEmpty) {
        return 'Seu parceiro já estava ganhando a rodada: dava para jogar o '
            '${cardName(better)} e guardar o ${cardName(chosen)}. $odds';
      }
      if (v.currentPlays.isNotEmpty && s <= bestOpp) {
        return 'O ${cardName(chosen)} não ganhava a rodada: era melhor '
            'jogar o ${cardName(better)} e guardar o mais forte. $odds';
      }
      if (v.currentPlays.isNotEmpty && b > bestOpp && b > bestOurs) {
        return 'O ${cardName(better)} já ganhava a rodada: não precisava '
            'gastar o ${cardName(chosen)}. $odds';
      }
      return 'Era melhor guardar o ${cardName(chosen)} para depois. $odds';
    }
    if (v.currentPlays.isNotEmpty && b > bestOpp && s <= bestOpp) {
      return 'O ${cardName(better)} ganhava a rodada, e o '
          '${cardName(chosen)} não. $odds';
    }
    return 'Era hora de usar o ${cardName(better)}. $odds';
  }
}
