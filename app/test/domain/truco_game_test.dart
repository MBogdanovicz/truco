import 'package:truco/domain/game/table_view.dart';

import 'dart:math';

import 'package:flutter_test/flutter_test.dart';
import 'package:truco/domain/game/ai.dart';
import 'package:truco/domain/game/cards.dart';
import 'package:truco/domain/game/rules.dart';
import 'package:truco/domain/game/truco_game.dart';
import 'package:truco/domain/scorekeeper/team.dart';

void main() {
  group('card strength', () {
    test('Paulista: the rank after the vira is manilha, by suit', () {
      const r = TrucoRules.paulista;
      const vira = Card(Rank.king, Suit.ouros);
      expect(r.strength(const Card(Rank.ace, Suit.paus), vira: vira), 13);
      expect(r.strength(const Card(Rank.ace, Suit.ouros), vira: vira), 10);
      expect(r.strength(const Card(Rank.three, Suit.paus), vira: vira), 9);
      expect(r.strength(const Card(Rank.four, Suit.paus), vira: vira), 0);
      // Vira 3 wraps to 4.
      const v3 = Card(Rank.three, Suit.copas);
      expect(r.isManilha(const Card(Rank.four, Suit.copas), vira: v3), isTrue);
    });

    test('fixed manilhas option', () {
      final r = TrucoRules.paulista.copyWith(manilhaMode: ManilhaMode.fixed);
      expect(r.strength(const Card(Rank.four, Suit.paus)), 13);
      expect(r.strength(const Card(Rank.seven, Suit.copas)), 12);
      expect(r.strength(const Card(Rank.ace, Suit.espadas)), 11);
      expect(r.strength(const Card(Rank.seven, Suit.ouros)), 10);
      expect(r.strength(const Card(Rank.ace, Suit.paus)), Rank.ace.index);
      expect(r.strength(const Card(Rank.four, Suit.copas)), 0);
    });

    test('card ids round trip', () {
      for (final c in fullDeck) {
        expect(Card.parse(c.id), c);
      }
      expect(fullDeck.length, 40);
    });
  });

  group('hand outcome', () {
    const a = Team.a, b = Team.b;
    test('two rounds win', () {
      expect(handOutcomeOf([a, a])!.winner, a);
      expect(handOutcomeOf([a, b]), isNull);
      expect(handOutcomeOf([a, b, b])!.winner, b);
    });
    test('ties', () {
      expect(handOutcomeOf([null]), isNull);
      expect(handOutcomeOf([null, b])!.winner, b);
      expect(handOutcomeOf([a, null])!.winner, a);
      expect(handOutcomeOf([a, b, null])!.winner, a);
      expect(handOutcomeOf([null, null]), isNull);
      expect(handOutcomeOf([null, null, a])!.winner, a);
      expect(handOutcomeOf([null, null, null])!.winner, isNull);
    });
  });

  group('betting', () {
    test('truco, seis, run: caller team scores the accepted value', () {
      final g = TrucoGame(rules: TrucoRules.paulista, seed: 1, firstDealer: 3);
      expect(g.turn, 0);
      g.apply(const Raise(0));
      expect(g.phase, GamePhase.raisePending);
      expect(g.legalActions(2), isEmpty); // own team can't answer
      g.apply(const Raise(1)); // seis: accepts truco (3) and raises
      expect(g.stakeLevel, 1);
      g.apply(const Fold(2));
      g.apply(const Fold(0)); // the partner runs too
      expect(g.scores[Team.b], 3);
      expect(g.phase, GamePhase.handOver);
    });

    test('accepted truco is worth 3 and the same team cannot raise again', () {
      final g = TrucoGame(rules: TrucoRules.paulista, seed: 2, firstDealer: 3);
      g.apply(const Raise(0));
      g.apply(const Accept(3));
      expect(g.handValue, 3);
      expect(g.canRaise(0), isFalse);
      g.apply(PlayCard(0, g.handOf(0).first));
      expect(g.canRaise(1), isTrue);
    });

    test('the first to answer runs: the partner decides', () {
      final g = TrucoGame(rules: TrucoRules.paulista, seed: 3, firstDealer: 3);
      g.apply(const Raise(0));
      g.apply(const Fold(1));
      expect(g.phase, GamePhase.raisePending);
      expect(g.pending!.refusedBy, 1);
      expect(g.legalActions(1), isEmpty);
      expect(g.responder, 3);
      g.apply(const Accept(3));
      expect(g.handValue, 3);
      expect(g.phase, GamePhase.playing);
    });

    test('running from a truco gives the base value', () {
      final g = TrucoGame(rules: TrucoRules.paulista, seed: 3, firstDealer: 3);
      g.apply(const Raise(0));
      g.apply(const Fold(1));
      g.apply(const Fold(3)); // the partner runs too
      expect(g.scores[Team.a], 1);
    });

    test('covered cards only from the second round', () {
      final g = TrucoGame(rules: TrucoRules.paulista, seed: 4, firstDealer: 3);
      expect(
        g.legalActions(0).whereType<PlayCard>().any((p) => p.covered),
        isFalse,
      );
      for (var i = 0; i < 4; i++) {
        final s = g.turn;
        g.apply(PlayCard(s, g.handOf(s).first));
      }
      if (g.phase == GamePhase.playing) {
        final s = g.turn;
        expect(
          g.legalActions(s).whereType<PlayCard>().any((p) => p.covered),
          isTrue,
        );
      }
    });
  });

  group('mão de onze', () {
    TrucoGame at(int a, int b) {
      final g = TrucoGame(rules: TrucoRules.paulista, seed: 5, firstDealer: 3);
      // Finish the first hand by a run and set the score.
      g.apply(const Raise(0));
      g.apply(const Fold(1));
      g.apply(const Fold(3)); // the partner runs too
      g.scores[Team.a] = a;
      g.scores[Team.b] = b;
      g.startNextHand();
      return g;
    }

    test('team at 11 decides; running gives 1 to the other team', () {
      final g = at(11, 4);
      expect(g.phase, GamePhase.decision);
      expect(g.decisionTeam, Team.a);
      expect(g.legalActions(1), isEmpty);
      expect(g.viewFor(0).partnerHand, isNotNull);
      expect(g.viewFor(1).partnerHand, isNotNull); // both teams see (option)
      g.apply(const Fold(0));
      expect(g.scores[Team.b], 5);
    });

    test('playing it is worth 3 and nobody may raise', () {
      final g = at(4, 11);
      g.apply(const Accept(1));
      expect(g.handValue, 3);
      expect(g.canRaise(g.turn), isFalse);
    });

    test('without mão de ferro, 11 x 11 is a normal hand', () {
      final g = TrucoGame(
        rules: TrucoRules.paulista.copyWith(ironHand: false),
        seed: 5,
        firstDealer: 3,
      );
      g.apply(const Raise(0));
      g.apply(const Fold(1));
      g.apply(const Fold(3)); // the partner runs too
      g.scores[Team.a] = 11;
      g.scores[Team.b] = 11;
      g.startNextHand();
      expect(g.iron, isFalse);
      expect(g.phase, GamePhase.playing);
      expect(g.viewFor(0).hand, hasLength(3));
      // Still no truco and no peeking at the partner at 11 × 11.
      expect(g.canRaise(g.turn), isFalse);
      for (var seat = 0; seat < 4; seat++) {
        expect(g.viewFor(seat).partnerHand, isNull);
      }
    });

    test('11 x 11 is a mão de ferro: blind, worth 1', () {
      final g = at(11, 11);
      expect(g.iron, isTrue);
      expect(g.phase, GamePhase.playing);
      expect(g.viewFor(0).hand, isEmpty);
      expect(g.handValue, 1);
      expect(g.canRaise(g.turn), isFalse);
    });
  });

  group('full games with bots', () {
    final variants = {
      'virada': TrucoRules.paulista,
      'fixas': TrucoRules.paulista.copyWith(
        manilhaMode: ManilhaMode.fixed,
        allowCoveredCard: false,
        ironHand: false,
      ),
    };
    for (final MapEntry(key: name, value: rules) in variants.entries) {
      for (final level in AiLevel.values) {
        test('$name ${level.label} finishes', () {
          for (var seed = 0; seed < 6; seed++) {
            final g = TrucoGame(rules: rules, seed: seed);
            final bots = List.generate(
              4,
              (_) => TrucoBot(level, random: Random(seed)),
            );
            var steps = 0;
            while (g.phase != GamePhase.gameOver) {
              if (g.phase == GamePhase.handOver) {
                g.startNextHand();
                continue;
              }
              final seat = switch (g.phase) {
                GamePhase.decision || GamePhase.raisePending => g.responder!,
                _ => g.turn,
              };
              g.apply(bots[seat].decide(g.viewFor(seat)));
              expect(++steps, lessThan(2000));
            }
            expect(g.scores[g.winner], rules.targetScore);
          }
        });
      }
    }

    test('hard beats easy most of the time', () {
      var hardWins = 0;
      const games = 30;
      for (var seed = 0; seed < games; seed++) {
        final g = TrucoGame(rules: TrucoRules.paulista, seed: seed);
        final rnd = Random(seed);
        final bots = [
          TrucoBot(AiLevel.hard, random: rnd),
          TrucoBot(AiLevel.easy, random: rnd),
          TrucoBot(AiLevel.hard, random: rnd),
          TrucoBot(AiLevel.easy, random: rnd),
        ];
        while (g.phase != GamePhase.gameOver) {
          if (g.phase == GamePhase.handOver) {
            g.startNextHand();
            continue;
          }
          final seat = switch (g.phase) {
            GamePhase.decision || GamePhase.raisePending => g.responder!,
            _ => g.turn,
          };
          g.apply(bots[seat].decide(g.viewFor(seat)));
        }
        if (g.winner == Team.a) hardWins++;
      }
      expect(hardWins, greaterThan(games * 0.65));
    });
  });

  group('seeing the partner\'s cards', () {
    TrucoGame fresh(TrucoRules r, int seed) =>
        TrucoGame(rules: r, seed: seed, firstDealer: 3);

    test('answering a truco', () {
      final g = fresh(TrucoRules.paulista, 1)..apply(const Raise(0));
      expect(g.viewFor(1).partnerHand, g.handOf(3));
      expect(g.viewFor(0).partnerHand, isNull);
      final off = fresh(
        TrucoRules.paulista.copyWith(seePartnerOnRaise: false),
        1,
      )..apply(const Raise(0));
      expect(off.viewFor(1).partnerHand, isNull);
    });

    TrucoGame atScores(TrucoRules r, int a, int b) {
      final g = fresh(r, 5)
        ..apply(const Raise(0))
        ..apply(const Fold(1))
        ..apply(const Fold(3));
      g.scores[Team.a] = a;
      g.scores[Team.b] = b;
      g.startNextHand();
      return g;
    }

    test('mão de onze: both teams, unless the option is off', () {
      final g = atScores(TrucoRules.paulista, 11, 3);
      expect(g.viewFor(0).partnerHand, isNotNull);
      expect(g.viewFor(1).partnerHand, isNotNull);
      final off = atScores(
        TrucoRules.paulista.copyWith(bothTeamsSeeOnDecision: false),
        11,
        3,
      );
      expect(off.viewFor(0).partnerHand, isNotNull);
      expect(off.viewFor(1).partnerHand, isNull);
    });

    test('never in a mão de ferro', () {
      final g = atScores(TrucoRules.paulista, 11, 11);
      for (var s = 0; s < 4; s++) {
        expect(g.viewFor(s).partnerHand, isNull);
      }
    });

    test('the pé is the dealer first, then left of the round winner', () {
      final g = fresh(TrucoRules.paulista, 7);
      expect(g.foot, g.dealer);
      for (var i = 0; i < 4; i++) {
        g.apply(PlayCard(g.turn, g.handOf(g.turn).first));
      }
      if (g.phase == GamePhase.playing) {
        expect(g.foot, (g.rounds.last.topSeat + 3) % 4);
        expect(g.turn, g.rounds.last.topSeat);
      }
    });

    test('after a tied round the same seat leads and the pé stays', () {
      var found = false;
      for (var seed = 1; seed < 400 && !found; seed++) {
        final g = fresh(TrucoRules.paulista, seed);
        final leader = g.turn, foot = g.foot;
        for (var i = 0; i < 4; i++) {
          g.apply(PlayCard(g.turn, g.handOf(g.turn).first));
        }
        if (g.phase != GamePhase.playing || g.rounds.last.winner != null) {
          continue;
        }
        found = true;
        expect(g.turn, leader);
        expect(g.foot, foot);
      }
      expect(found, isTrue, reason: 'no tied first round found');
    });

    test('the dealer sees the third card dealt to the partner', () {
      final g = fresh(TrucoRules.paulista, 9);
      final dealer = g.dealer;
      final partner = partnerOf(dealer);
      final third = g.dealtTo(partner)[2];
      expect(g.viewFor(dealer).partnerHand, [third]);
      expect(g.viewFor(partner).partnerHand, isNull);
      expect(g.viewFor(nextSeat(dealer)).partnerHand, isNull);
      // Once the partner plays it, it is simply on the table.
      while (g.handOf(partner).contains(third) &&
          g.phase == GamePhase.playing) {
        final s = g.turn;
        final card = s == partner ? third : g.handOf(s).first;
        g.apply(PlayCard(s, card));
      }
      expect(g.viewFor(dealer).partnerHand, isNull);
      final off = fresh(
        TrucoRules.paulista.copyWith(dealerSeesPartnerThirdCard: false),
        9,
      );
      expect(off.viewFor(off.dealer).partnerHand, isNull);
    });
  });

  test('the partner sees a covered card; the others do not', () {
    final g = TrucoGame(rules: TrucoRules.paulista, seed: 4, firstDealer: 3);
    for (var i = 0; i < 4; i++) {
      final s = g.turn;
      g.apply(PlayCard(s, g.handOf(s).first));
    }
    if (g.phase != GamePhase.playing) return;
    final s = g.turn;
    final card = g.handOf(s).first;
    g.apply(PlayCard(s, card, covered: true));
    TableView view(int seat) =>
        TableView.of(g, seat, talk: TableTalk(), mayAnswer: (_) => true);
    expect(view(partnerOf(s)).currentPlays.single.card, card);
    expect(view(nextSeat(s)).currentPlays.single.card, isNull);
  });
}
