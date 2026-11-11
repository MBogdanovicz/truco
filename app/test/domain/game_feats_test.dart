import 'package:flutter_test/flutter_test.dart';
import 'package:truco/domain/game/cards.dart';
import 'package:truco/domain/game/game_feats.dart';
import 'package:truco/domain/game/rules.dart';
import 'package:truco/domain/game/truco_game.dart';
import 'package:truco/domain/scorekeeper/team.dart';

Card c(String id) => Card.parse(id);

HandStarted hand(
  List<List<String>> dealt, {
  String vira = '4o',
  bool iron = false,
}) => HandStarted(
  handNumber: 1,
  dealer: 3,
  vira: c(vira),
  decisionTeam: null,
  iron: iron,
  dealt: [for (final h in dealt) h.map(c).toList()],
);

const filler = [
  ['4o', '5o', '6o'],
  ['4e', '5e', '6e'],
  ['4c', '5c', '6c'],
  ['4p', '5p', 'Qo'],
];

void main() {
  const rules = TrucoRules.paulista;

  test('casais by manilha suit (vira 4: manilhas are the 5s)', () {
    final f = gameFeats([
      hand([
        ['5p', '5c', '7o'], // gato + copas
        ['5e', '5o', '7e'], // espadilha + salmora
        ['7c', 'Qc', 'Jc'],
        ['7p', 'Qp', 'Jp'],
      ]),
      const HandEnded(winner: Team.a, points: 1),
    ], rules);
    expect(f[0], {GameFeat.casalMaior});
    expect(f[1], isEmpty); // team B lost the hand
  });

  test('fixed manilhas: 7♦ + A♠ is the casal menor and preto needs gato', () {
    final fixed = rules.copyWith(manilhaMode: ManilhaMode.fixed);
    final f = gameFeats([
      HandStarted(
        handNumber: 1,
        dealer: 3,
        vira: null,
        decisionTeam: null,
        iron: false,
        dealt: [
          [c('7o'), c('Ae'), c('3c')],
          [c('4o'), c('5o'), c('6o')],
          [c('2c'), c('4p'), c('3o')],
          [c('4e'), c('5e'), c('6e')],
        ],
      ),
      const HandEnded(winner: Team.a, points: 1),
    ], fixed);
    expect(f[0], {GameFeat.casalMenor});
    expect(f[2], isEmpty); // only the gato
  });

  test('three sixes, ace of spades on the river, iron hand', () {
    final f = gameFeats([
      hand([
        ['6o', '6e', '6c'],
        ...filler.sublist(1, 2),
        ['Ae', '2o', '3o'],
        ...filler.sublist(3),
      ], iron: true),
      const RoundEnded(1, winner: Team.a, topSeat: 0),
      const RoundEnded(2, winner: Team.b, topSeat: 1),
      CardPlayed(2, c('Ae'), covered: false),
      const RoundEnded(3, winner: Team.a, topSeat: 2),
      const HandEnded(winner: Team.a, points: 1),
    ], rules);
    expect(f[0], {GameFeat.beast, GameFeat.ironHand});
    expect(f[2], {GameFeat.aceRiver, GameFeat.ironHand});
  });

  test('doze aceito, seis burro, ran and won, comadre', () {
    final f = gameFeats([
      hand(filler),
      const RaiseCalled(0, value: 3, name: 'Truco'),
      const RaiseCalled(1, value: 6, name: 'Seis'),
      const RaiseCalled(0, value: 9, name: 'Nove'),
      const RaiseCalled(1, value: 12, name: 'Doze'),
      const RaiseAccepted(0, value: 12),
      const HandEnded(winner: Team.b, points: 12),
      hand(filler),
      const RaiseCalled(1, value: 3, name: 'Truco'),
      const RaiseCalled(2, value: 6, name: 'Seis'),
      const Folded(3),
      const HandEnded(winner: Team.a, points: 3),
      const GameEnded(Team.b),
    ], rules);
    expect(f[1], {GameFeat.truco12, GameFeat.ranAndWon});
    expect(f[0], {GameFeat.seisBurro});

    final quiet = gameFeats([
      hand(filler),
      const HandEnded(winner: Team.a, points: 1),
      const GameEnded(Team.a),
    ], rules);
    expect(quiet[0], {GameFeat.comadre});
    expect(quiet[1], isEmpty);
  });

  test('a real game reports feats only from its events', () {
    final g = TrucoGame(rules: rules, seed: 7);
    final f = gameFeats(g.events, rules);
    expect(f.values.every((s) => s.isEmpty), isTrue);
    expect((g.events.first as HandStarted).dealt, hasLength(4));
  });
}
