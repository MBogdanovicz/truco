import 'dart:math';

import 'ai.dart';
import 'cards.dart';
import 'truco_game.dart';

/// What a comment of the "modo professor" is about (for the summary at the
/// end of the game).
enum CoachTopic {
  card,
  cover,
  truco,

  /// A bluff ("facão"): a fair play, pointed out but not a mistake.
  bluff,
  answer,
  elevenHand,
  praise,

  /// Something to think about before a hard decision, said before it.
  hint,
}

/// A comment from the "modo professor" about a move.
class CoachTip {
  const CoachTip(this.text, {this.good = false, this.topic = CoachTopic.card});
  final String text;

  /// Praise rather than a correction.
  final bool good;
  final CoachTopic topic;

  /// Said before the decision, not about a move already made.
  bool get isHint => topic == CoachTopic.hint;

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
        topic: CoachTopic.elevenHand,
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
        topic: CoachTopic.elevenHand,
      );
    }
    if (action is Fold && p > threshold + 0.15) {
      return CoachTip(
        'Dava para jogar: vocês tinham uns ${pct(p)} de chance de ganhar a '
        'mão de onze, e jogar vale $play pontos contra $run de correr.',
        topic: CoachTopic.elevenHand,
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
        topic: CoachTopic.answer,
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
        topic: CoachTopic.answer,
      );
    }
    if (action is Accept && accept < -current - margin) {
      final odds = p < 0.03
          ? 'a mão já estava perdida'
          : 'a chance de ganhar a mão era de só uns ${pct(p)}';
      return CoachTip(
        'Era melhor correr: $odds. Correndo, você perdia $current '
        '${_pontos(current)}; aceitando, arriscou $asked.',
        topic: CoachTopic.answer,
      );
    }
    if (action is Raise && p < 0.45) {
      return CoachTip(
        'Passando facão: com uns ${pct(p)} de chance, vale se eles '
        'correrem, mas se aceitarem a conta fica alta.',
        topic: CoachTopic.bluff,
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
          topic: CoachTopic.truco,
        );
      }
      final p = _chance(v);
      if (p < 0.03) {
        return const CoachTip(
          'A mão já estava perdida: esse truco só funciona se eles correrem. '
          'Se aceitarem, vocês perdem mais pontos.',
          topic: CoachTopic.truco,
        );
      }
      if (p < 0.3) {
        return CoachTip(
          'Passando facão: com uns ${pct(p)} de chance, esse truco vale se '
          'eles correrem, mas se aceitarem vocês arriscam mais.',
          topic: CoachTopic.bluff,
        );
      }
      return null;
    }
    if (action is! PlayCard) return null;
    final hand = v.hand;
    final chosen = action.card;

    // Covering or giving away a round is a plan (letting them call truco)
    // when the hand stays all but won; the professor only speaks when it
    // costs the hand.
    if (action.covered && _winsRound(v, chosen) && _chance(v) < 0.85) {
      return CoachTip(
        'Você cobriu o ${cardName(chosen)}, que ganhava a rodada. Coberta '
        'perde para qualquer carta.',
        topic: CoachTopic.cover,
      );
    }
    if (hand.length < 2 || action.covered) return null;

    final chances = {for (final c in hand) c: _chance(v, firstCard: c)};
    final best = chances.entries.reduce((a, b) => b.value > a.value ? b : a);
    final mine = chances[chosen]!;

    if (best.value - mine >= 0.1 && mine < 0.85 && best.key != chosen) {
      return CoachTip(_why(v, chosen, best.key, mine, best.value));
    }

    // A hand already won without truco is not a mistake: letting the other
    // team get excited and call it (or bluffing later) is a fine way to play
    // it, so the professor says nothing about it.

    final others = [
      for (final e in chances.entries)
        if (e.key != chosen) e.value,
    ];
    if (others.isNotEmpty && mine - others.reduce(max) >= 0.2) {
      return const CoachTip(
        'Boa! Era a melhor carta para essa hora.',
        good: true,
        topic: CoachTopic.praise,
      );
    }
    return null;
  }

  // ----------------------------------------- before a hard decision --

  /// Call when the person has to answer a raise or decide a mão de onze.
  /// When the choice is close, says what to weigh, without the answer.
  CoachTip? consider(PlayerView v) {
    if (v.iron) return null;
    final ours = v.scoreOf(v.team), opp = v.scoreOf(v.team.other);
    final target = v.rules.targetScore;
    final int lose, risk;
    final String verb;
    if (v.phase == GamePhase.raisePending) {
      final pending = v.pending;
      if (pending == null || teamOfSeat(pending.seat) == v.team) return null;
      lose = v.rules.stakes[v.stakeLevel];
      risk = v.rules.stakes[pending.toLevel];
      verb = 'aceitando';
    } else if (v.phase == GamePhase.decision) {
      if (v.decisionTeam != v.team) return null;
      lose = v.rules.baseValue;
      risk = v.rules.decisionHandValue;
      verb = 'jogando';
    } else {
      return null;
    }
    // Running would end the game: there is nothing to weigh.
    if (opp + lose >= target) return null;
    final p = _chance(v);
    final even = (risk - lose) / (2 * risk);
    if ((p - even).abs() > 0.15) return null;

    final parts = <String>[
      'Decisão difícil.',
      _roundsSoFar(v),
      _strongCards(v),
      'Correndo, vocês perdem $lose ${_pontos(lose)}; $verb, arriscam '
          '$risk para ganhar $risk.',
      if (opp + risk >= target)
        'Se perderem, a partida acaba.'
      else if (ours + risk >= target)
        'Se ganharem, vocês fecham a partida.',
      v.phase == GamePhase.decision
          ? 'Pense se as cartas de vocês dois ganham duas rodadas.'
          : 'Pense em quantas rodadas suas cartas ainda ganham.',
    ];
    return CoachTip(
      parts.where((t) => t.isNotEmpty).join(' '),
      topic: CoachTopic.hint,
    );
  }

  String _roundsSoFar(PlayerView v) {
    final r = v.rounds;
    if (r.isEmpty) return 'Ainda é a primeira rodada.';
    if (r.length == 1) {
      if (r.first.tied) {
        return 'A primeira empatou: quem ganhar a próxima leva a mão.';
      }
      return r.first.winner == v.team
          ? 'Vocês ganharam a primeira: ganhar ou empatar mais uma fecha a mão.'
          : 'Vocês perderam a primeira: precisam ganhar as duas próximas.';
    }
    return 'Está uma a uma: a terceira rodada decide.';
  }

  String _strongCards(PlayerView v) {
    String count(List<Card> cards) {
      final manilhas = cards
          .where((c) => v.rules.isManilha(c, vira: v.vira))
          .length;
      final threes = cards
          .where(
            (c) => c.rank == Rank.three && !v.rules.isManilha(c, vira: v.vira),
          )
          .length;
      final m = switch (manilhas) {
        0 => 'nenhuma manilha',
        1 => '1 manilha',
        _ => '$manilhas manilhas',
      };
      final t = switch (threes) {
        0 => 'nenhum 3',
        1 => 'um 3',
        _ => '$threes 3s',
      };
      return '$m e $t';
    }

    final partner = v.partnerHand;
    return 'Na sua mão: ${count(v.hand)}.'
        '${partner == null || partner.isEmpty ? '' : ' Na do parceiro: ${count(partner)}.'}';
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

/// Adds up the professor's comments over a game, for the summary at the end.
class CoachReport {
  int moves = 0;
  final _counts = <CoachTopic, int>{};

  void record(CoachTip? tip) {
    moves++;
    if (tip != null && !tip.isHint) {
      _counts[tip.topic] = (_counts[tip.topic] ?? 0) + 1;
    }
  }

  int get praises => _counts[CoachTopic.praise] ?? 0;
  int get mistakes => _counts.entries
      .where((e) => e.key != CoachTopic.praise && e.key != CoachTopic.bluff)
      .fold(0, (a, e) => a + e.value);

  static const _advice = {
    CoachTopic.card:
        'Escolha da carta: lembre da posição (se o parceiro ainda joga, '
        'ele pode resolver a rodada) e guarde as fortes quando uma mais '
        'fraca resolve.',
    CoachTopic.cover:
        'Carta coberta: cobrir a carta que ganhava a rodada só vale como '
        'plano quando a mão continua garantida.',
    CoachTopic.truco:
        'Pedidos de truco: com a mão perdida ou já valendo a partida, o '
        'truco só ajuda o adversário.',
    CoachTopic.answer:
        'Respostas ao truco: compare o que perde correndo com o que arrisca '
        'aceitando.',
    CoachTopic.elevenHand:
        'Mão de onze: jogue quando as cartas de vocês dois ganham duas '
        'rodadas; senão, correr custa só 1 ponto.',
  };

  /// Null when nothing was reviewed (no moves by the person).
  String? summary() {
    if (moves == 0) return null;
    final m = mistakes;
    if (m == 0) {
      return praises > 0
          ? 'Partida muito bem jogada! Nenhum erro claro, e $praises '
                '${praises == 1 ? 'jogada se destacou' : 'jogadas se destacaram'}.'
          : 'Partida muito bem jogada! Nenhum erro claro.';
    }
    final lines = <String>[
      if (m <= 2)
        'Boa partida, com poucos deslizes.'
      else
        'Alguns pontos para melhorar:',
      for (final MapEntry(:key, :value) in _advice.entries)
        if ((_counts[key] ?? 0) > 0) '• $value (${_counts[key]}×)',
      if (praises > 0)
        '${praises == 1 ? 'Uma jogada' : '$praises jogadas'} de destaque.',
    ];
    return lines.join('\n');
  }
}
