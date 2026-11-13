import '../scorekeeper/team.dart';
import 'cards.dart';
import 'rules.dart';
import 'table_view.dart';
import 'truco_game.dart';

/// How hard a training situation is.
enum TrainingLevel {
  basic('Básico', 'O que toda dupla precisa saber.'),
  intermediate('Intermediário', 'Posição, planejamento e quando trucar.'),
  advanced('Avançado', 'Situações para pensar como um truqueiro de mesa.');

  const TrainingLevel(this.label, this.blurb);
  final String label;
  final String blurb;
}

/// What the player can do at the training table: play a card (`card:3o`),
/// call or raise (`raise`), accept or play the mão de onze (`accept`), or
/// run (`fold`).
typedef TrainingMove = String;

/// Names around the training table, by seat (you are seat 0, at the
/// bottom; play goes to the right).
const trainingNames = ['Você', 'Juca', 'Parceiro', 'Tião'];

/// A situation of the "Treinar" mode: a moment of a real hand, seen at the
/// table, where the player picks the move (a card or a button).
///
/// The table is built from the cards alone: who leads each round follows
/// from the [dealer] and from who took the round before (after an
/// embuchada the same player leads again, so the pé stays the pé).
class TrainingScenario {
  TrainingScenario({
    required this.id,
    required this.level,
    required this.title,
    required this.situation,
    required String vira,
    required String hand,
    required this.answer,
    required this.explanation,
    this.dealer = 3,
    List<String> rounds = const [],
    String plays = '',
    String? partner,
    this.score = (0, 0),
    this.raiseBy,
    this.raiseTo,
    this.refusedByPartner = false,
    this.stake = 0,
    this.alsoGood = const {},
    this.wrong = const {},
  }) : vira = Card.parse(vira),
       hand = _cards(hand),
       partner = partner == null ? null : _cards(partner),
       rounds = [for (final r in rounds) _cards(r)],
       plays = _cards(plays);

  final String id;
  final TrainingLevel level;
  final String title;

  /// What happened so far and what to decide (shown in the popup).
  final String situation;
  final Card vira;

  /// Your cards still in hand.
  final List<Card> hand;

  /// The partner's cards in hand, when the rules show them (answering a
  /// raise, mão de onze).
  final List<Card>? partner;

  /// Rounds already played, each in playing order.
  final List<List<Card>> rounds;

  /// Cards on the table in this round, in playing order.
  final List<Card> plays;

  /// Who dealt: the next seat leads the first round.
  final int dealer;

  /// (us, them).
  final (int, int) score;

  /// A raise waiting for your answer: who asked and to what level (1 truco,
  /// 2 seis…).
  final int? raiseBy;
  final int? raiseTo;

  /// The partner wanted to run from [raiseBy]'s call: you decide.
  final bool refusedByPartner;

  /// Raises already accepted in this hand (0: worth 1).
  final int stake;

  final TrainingMove answer;
  final String explanation;

  /// Other moves that are also good, with a word on why.
  final Map<TrainingMove, String> alsoGood;

  /// A word on some wrong moves.
  final Map<TrainingMove, String> wrong;

  static List<Card> _cards(String ids) => ids.trim().isEmpty
      ? const []
      : ids.trim().split(RegExp(r'\s+')).map(Card.parse).toList();

  static const rules = TrucoRules.paulista;

  bool isGood(TrainingMove move) =>
      move == answer || alsoGood.containsKey(move);

  bool get isElevenDecision =>
      score.$1 == rules.decisionScore && raiseBy == null;

  /// Who leads each round (the finished ones and the current one), and the
  /// result of each finished round.
  ({List<int> leads, List<RoundView> done}) get _flow {
    var lead = nextSeat(dealer);
    final leads = <int>[];
    final done = <RoundView>[];
    for (final r in rounds) {
      leads.add(lead);
      final plays = [
        for (var i = 0; i < r.length; i++) PlayView((lead + i) % 4, r[i]),
      ];
      final top = plays
          .map((p) => rules.strength(p.card!, vira: vira))
          .reduce((a, b) => a > b ? a : b);
      final best = [
        for (final p in plays)
          if (rules.strength(p.card!, vira: vira) == top) p.seat,
      ];
      final teams = best.map(teamOfSeat).toSet();
      final winner = teams.length == 1 ? teams.first : null;
      done.add(RoundView(plays, winner: winner, topSeat: best.first));
      if (winner != null) lead = best.first;
    }
    leads.add(lead);
    return (leads: leads, done: done);
  }

  /// Seat that plays next in the current round.
  int get turn {
    final f = _flow;
    return (f.leads.last + plays.length) % 4;
  }

  /// Cards each seat played in this hand.
  int _played(int seat) {
    final f = _flow;
    var n = 0;
    for (var r = 0; r <= rounds.length; r++) {
      final cards = r < rounds.length ? rounds[r] : plays;
      final idx = (seat - f.leads[r] + 4) % 4;
      if (idx < cards.length) n++;
    }
    return n;
  }

  /// Moves the table offers in this situation.
  List<TrainingMove> get moves {
    if (isElevenDecision || raiseBy != null) {
      return [
        'accept',
        'fold',
        if (raiseBy != null && raiseTo! + 1 < rules.stakes.length) 'raise',
      ];
    }
    return [for (final c in hand) 'card:${c.id}', if (_canRaise) 'raise'];
  }

  bool get _canRaise =>
      stake + 1 < rules.stakes.length &&
      score.$1 < rules.decisionScore &&
      score.$2 < rules.decisionScore;

  /// The table as seat 0 sees it.
  TableView get view {
    final f = _flow;
    final lead = f.leads.last;
    final pending = raiseBy == null
        ? null
        : PendingRaise(
            seat: raiseBy!,
            toLevel: raiseTo!,
            refusedBy: refusedByPartner ? 2 : null,
          );
    final level = pending == null ? stake : pending.toLevel - 1;
    final phase = pending != null
        ? GamePhase.raisePending
        : isElevenDecision
        ? GamePhase.decision
        : GamePhase.playing;
    return TableView(
      me: 0,
      rules: rules,
      phase: phase,
      turn: turn,
      dealer: dealer,
      foot: (lead + 3) % 4,
      handNumber: 1,
      vira: vira,
      handValue: isElevenDecision
          ? rules.decisionHandValue
          : rules.stakes[level],
      stakeLevel: level,
      pending: pending,
      decisionTeam: phase == GamePhase.decision ? Team.a : null,
      iron: false,
      scores: {Team.a: score.$1, Team.b: score.$2},
      rounds: f.done,
      currentPlays: [
        for (var i = 0; i < plays.length; i++)
          PlayView((lead + i) % 4, plays[i]),
      ],
      hand: hand,
      handCounts: [for (var s = 0; s < 4; s++) 3 - _played(s)],
      partnerHand: partner,
      partnerShownForRaise: pending != null && partner != null,
      canCover: false,
      canRaise: phase == GamePhase.playing && _canRaise,
      mustAnswer: phase != GamePhase.playing,
      myTurn: phase == GamePhase.playing && turn == 0,
      winner: null,
    );
  }

  /// For checks: every card on the table, in hands and the vira.
  List<Card> get allCards => [
    vira,
    ...hand,
    ...?partner,
    for (final r in rounds) ...r,
    ...plays,
  ];

  /// For checks: cards [seat] played.
  int playedBy(int seat) => _played(seat);
}

/// Situations of the "Treinar" mode, by level. Rules with the vira: the
/// manilha is the rank after it, and between manilhas paus (gato) > copas >
/// espadas (espadilha) > ouros (salmoura).
final trainingScenarios = <TrainingScenario>[
  // ------------------------------------------------------------ básico --
  TrainingScenario(
    id: 'manilha_3',
    level: TrainingLevel.basic,
    title: 'Qual é a manilha?',
    situation:
        'Primeira rodada e você é o pé. A vira é o 3♥. O Tião (à sua '
        'esquerda) está ganhando com o 3♦. Toque na carta que você joga.',
    vira: '3c',
    dealer: 0,
    plays: '2e Ko 3o',
    hand: '4o Ae 2c',
    answer: 'card:4o',
    explanation:
        'A manilha é a carta logo acima da vira. Depois do 3 a sequência dá '
        'a volta e começa no 4: os 4 são as manilhas. O 4♦ é a salmoura, a '
        'menor das manilhas, mas ganha de qualquer 3. O ás e o 2 perdem.',
  ),
  TrainingScenario(
    id: 'manilha_7',
    level: TrainingLevel.basic,
    title: 'Sem 8, 9 e 10',
    situation:
        'Primeira rodada e você é o pé. A vira é o 7♦. O Tião está ganhando '
        'com o 3♦.',
    vira: '7o',
    dealer: 0,
    plays: '5e 6c 3o',
    hand: 'Qe Jc 3p',
    answer: 'card:Qe',
    explanation:
        'O baralho do truco não tem 8, 9 e 10: depois do 7 vem a dama. '
        'Então as damas são as manilhas, e a Q♠ é a espadilha: ganha a '
        'rodada.',
    wrong: {
      'card:3p':
          'O 3♣ só embucha com o 3♦ do Tião. Podendo ganhar a primeira, '
          'ganhe.',
    },
  ),
  TrainingScenario(
    id: 'manilha_vs_manilha',
    level: TrainingLevel.basic,
    title: 'Manilha contra manilha',
    situation:
        'Vira 3♠: as manilhas são os 4. O Juca abriu a rodada com o 4♦, a '
        'salmoura. Você é o pé.',
    vira: '3e',
    dealer: 0,
    plays: '4o 7p 5c',
    hand: '4e 3c 7e',
    answer: 'card:4e',
    explanation:
        'Só manilha ganha de manilha, e entre elas vale o naipe: paus (gato) '
        '> copas > espadas (espadilha) > ouros (salmoura). A espadilha ganha '
        'da salmoura. O 3 é a maior carta comum, mas perde de qualquer '
        'manilha.',
  ),
  TrainingScenario(
    id: 'cheapest_winner',
    level: TrainingLevel.basic,
    title: 'A mais barata que ganha',
    situation:
        'Primeira rodada, vira 5♥ (manilhas: os 6). Você é o pé e o Juca está '
        'ganhando com o 2♠.',
    vira: '5c',
    dealer: 0,
    plays: '2e 4p Qo',
    hand: '3o 6e Ap',
    answer: 'card:3o',
    explanation:
        'Você é o último: basta ganhar, e o 3♦ já ganha do 2. Guarde a '
        'espadilha para uma rodada em que ela faça diferença.',
    wrong: {
      'card:6e':
          'A espadilha também ganha, mas o 3 já resolvia. Manilha gasta à toa '
          'faz falta na próxima rodada.',
    },
  ),
  TrainingScenario(
    id: 'cant_beat_gato',
    level: TrainingLevel.basic,
    title: 'Não dá para ganhar',
    situation:
        'Primeira rodada, vira Q♥ (manilhas: os valetes). O Tião abriu com o '
        'J♣, o gato.',
    vira: 'Qc',
    dealer: 2,
    plays: 'Jp',
    hand: '3o 2e 6c',
    answer: 'card:6c',
    explanation:
        'Ninguém ganha do gato. Jogue a mais fraca e guarde o 3 e o 2 para '
        'as próximas rodadas.',
  ),
  TrainingScenario(
    id: 'partner_winning_last',
    level: TrainingLevel.basic,
    title: 'O parceiro já está ganhando',
    situation:
        'Primeira rodada, vira 4♦ (manilhas: os 5). Você é o pé e seu '
        'parceiro está ganhando com o 3♠.',
    vira: '4o',
    dealer: 0,
    plays: '6p 3e Ac',
    hand: '2c Kp 4e',
    answer: 'card:4e',
    explanation:
        'Você é o último e seu parceiro já ganha a rodada: jogue a pior '
        'carta e guarde as boas.',
  ),
  TrainingScenario(
    id: 'partner_winning_middle',
    level: TrainingLevel.basic,
    title: 'Reforçar ou não?',
    situation:
        'Primeira rodada, vira K♠ (manilhas: os ases). Seu parceiro abriu com '
        'o 3♥ e está ganhando. O Juca ainda joga depois de você.',
    vira: 'Ke',
    dealer: 1,
    plays: '3c Jc',
    hand: '2p 7e Qo',
    answer: 'card:7e',
    explanation:
        'Nenhuma das suas cartas ganha do 3 do parceiro. Se o Juca tiver '
        'manilha, ganha de qualquer jeito. Jogue a mais fraca, o 7, e guarde '
        'o 2.',
  ),
  TrainingScenario(
    id: 'first_lead',
    level: TrainingLevel.basic,
    title: 'Abrindo a mão',
    situation:
        'Primeira rodada e você é o primeiro a jogar. Vira 6♦: as manilhas '
        'são os 7.',
    vira: '6o',
    hand: '7p 3c 5e',
    answer: 'card:3c',
    explanation:
        'Abra com o 3, que só perde para manilha, e guarde o gato: ele '
        'ganha qualquer rodada depois, quando for preciso.',
  ),
  TrainingScenario(
    id: 'tied_first',
    level: TrainingLevel.basic,
    title: 'Primeira embuchada',
    situation:
        'A primeira rodada embuchou (o 3 do Juca com o 3 do parceiro). Agora '
        'quem ganhar a segunda leva a mão. Você é o primeiro. Vira 3♣: as '
        'manilhas são os 4.',
    vira: '3p',
    rounds: ['2e 3o 3e 5p'],
    hand: '2c Qe',
    answer: 'card:2c',
    explanation:
        'Depois de embuchar a primeira, a segunda decide a mão. Jogue a '
        'sua melhor carta.',
  ),
  TrainingScenario(
    id: 'lost_first_must_win',
    level: TrainingLevel.basic,
    title: 'Perdeu a primeira',
    situation:
        'Vocês perderam a primeira rodada. Na segunda, o Tião jogou o 2♦ e '
        'está ganhando. Você é o pé. Vira J♥: as manilhas são os reis.',
    vira: 'Jc',
    dealer: 2,
    rounds: ['7o 4e Ke 3o'],
    plays: 'Qp Ac 2o',
    hand: '3e 6p',
    answer: 'card:3e',
    explanation:
        'Perdendo a primeira, perder a segunda é perder a mão. O 3 ganha do '
        '2: é a hora de usar.',
  ),
  TrainingScenario(
    id: 'run_weak',
    level: TrainingLevel.basic,
    title: 'Truco com cartas fracas',
    situation:
        'Vocês perderam a primeira rodada. Na segunda, o Juca pediu truco '
        'antes de jogar. Vira K♥: as manilhas são os ases. Ao responder um '
        'truco você vê as cartas do parceiro.',
    vira: 'Kc',
    dealer: 2,
    rounds: ['6p 7c 2p Jo'],
    hand: '4e 5o',
    partner: 'Qp 5p',
    raiseBy: 1,
    raiseTo: 1,
    answer: 'fold',
    explanation:
        'Perdendo a primeira, vocês precisam ganhar as duas próximas, e com '
        '4, 5 e uma dama a chance é muito pequena. Correndo vocês perdem 1 '
        'ponto; aceitando, arriscam 3.',
  ),
  TrainingScenario(
    id: 'mao_de_onze_run',
    level: TrainingLevel.basic,
    title: 'Mão de onze: correr?',
    situation:
        'Vocês estão com 11 e os adversários com 10. Na mão de onze você vê '
        'as cartas do parceiro. Vira 2♦: as manilhas são os 3.',
    vira: '2o',
    score: (11, 10),
    hand: '4o 5p 6c',
    partner: 'Qe Jo 5c',
    answer: 'fold',
    explanation:
        'Com cartas tão fracas, perder é quase certo, e perder a mão de '
        'onze dá 3 pontos e a partida aos adversários. Correndo, eles vão '
        'para 11 e a próxima é mão de ferro (11 × 11), onde é sorte para '
        'os dois lados: bem melhor.',
  ),
  TrainingScenario(
    id: 'mao_de_onze_play',
    level: TrainingLevel.basic,
    title: 'Mão de onze: jogar?',
    situation:
        'Vocês estão com 11 e os adversários com 7. Vira 6♠: as manilhas são '
        'os 7.',
    vira: '6e',
    score: (11, 7),
    hand: '3p 2o Ke',
    partner: '3c Ao Jp',
    answer: 'accept',
    explanation:
        'Sem manilha, mas com dois 3 e um 2 a dupla ganha duas rodadas na '
        'maioria das vezes. Jogando, a mão vale 3 e fecha a partida; '
        'correndo, os adversários ganham 1 e o jogo continua. Na mão de onze '
        'ninguém pede truco: ela já vale 3.',
  ),

  // ------------------------------------------------------ intermediário --
  TrainingScenario(
    id: 'two_top_manilhas_answer',
    level: TrainingLevel.intermediate,
    title: 'Truco logo de cara',
    situation:
        'Primeira rodada. O Juca pediu truco antes de jogar. Vira 6♠: as '
        'manilhas são os 7.',
    vira: '6e',
    dealer: 0,
    hand: '7c 7e 4p',
    partner: 'Ko 5e Qc',
    raiseBy: 1,
    raiseTo: 1,
    answer: 'raise',
    explanation:
        'A copas e a espadilha são a 2ª e a 3ª maiores cartas do jogo. Só o '
        'gato ganha de uma delas, então vocês levam duas rodadas na grande '
        'maioria das vezes, mesmo com o parceiro fraco: peça seis.',
    alsoGood: {
      'accept':
          'Aceitar também é bom: é uma linha mais conservadora, e você ainda '
          'pode pedir seis mais à frente, depois de ver as cartas deles.',
    },
  ),
  TrainingScenario(
    id: 'raise_after_seis',
    level: TrainingLevel.intermediate,
    title: 'Pediram seis',
    situation:
        'Vocês ganharam a primeira rodada com o seu 3. Você pediu truco, e o '
        'Juca respondeu "seis!". Vira 6♥: as manilhas são os 7.',
    vira: '6c',
    rounds: ['3o 2p 4c Ae'],
    hand: '7p 5o',
    partner: 'Qp Jc',
    raiseBy: 1,
    raiseTo: 2,
    answer: 'raise',
    explanation:
        'Com a primeira ganha e o gato na mão, a segunda rodada é sua: a '
        'mão está ganha. Peça nove: se correrem, vocês levam 6; se '
        'aceitarem, 9.',
    alsoGood: {
      'accept':
          'Aceitar também é bom: a mão continua ganha e você ainda pode '
          'pedir nove mais à frente, quando eles já estiverem presos.',
    },
  ),
  TrainingScenario(
    id: 'casal_maior_truco',
    level: TrainingLevel.intermediate,
    title: 'Casal maior',
    situation:
        'Primeira rodada, você é o primeiro a jogar. Vira K♦: as manilhas '
        'são os ases. Truco agora ou não?',
    vira: 'Ko',
    hand: 'Ap Ac 4o',
    answer: 'card:4o',
    explanation:
        'O gato (A♣) e a copas (A♥) são as duas maiores cartas do jogo: '
        'mesmo perdendo a primeira, vocês ganham a segunda e a terceira. '
        'Então entregue a primeira com o 4♦: o adversário fica confiante e '
        'pede truco, e aí você responde com seis.',
    wrong: {
      'raise':
          'Pedir truco agora assusta, e eles podem correr e dar só 1 ponto.',
      'card:Ap':
          'Jogar o gato já na primeira mostra a sua força e desperdiça a '
          'chance de eles trucarem.',
    },
  ),
  TrainingScenario(
    id: 'partner_is_foot',
    level: TrainingLevel.intermediate,
    title: 'O parceiro é o pé',
    situation:
        'Primeira rodada, vira 4♣ (manilhas: os 5). O Tião abriu com o 7♠. '
        'Depois de você jogam o Juca e o seu parceiro, que é o pé.',
    vira: '4p',
    dealer: 2,
    plays: '7e',
    hand: '3c Ao 6o',
    answer: 'card:6o',
    explanation:
        'Quem resolve a rodada na sua dupla é quem está mais perto do pé, e '
        'aqui é o seu parceiro: ele joga por último e vê todas as cartas. '
        'Jogue baixo e deixe ele decidir. Se você joga o 3 agora, o Juca '
        'pode matar com manilha e você perdeu sua melhor carta à toa.',
    alsoGood: {
      'card:Ao':
          'O ás também segura: obriga o Juca a gastar um 2, um 3 ou manilha. '
          'Mas o 6 cumpre o papel e guarda o ás.',
    },
    wrong: {
      'card:3c':
          'O 3 aqui está fora de posição: o Juca joga depois e pode matar '
          'com manilha. Deixe a decisão para o parceiro, que é o pé.',
    },
  ),
  TrainingScenario(
    id: 'kill_for_partner',
    level: TrainingLevel.intermediate,
    title: 'Sua vez de matar',
    situation:
        'Primeira rodada, vira Q♠ (manilhas: os valetes). Seu parceiro abriu '
        'baixo, com o 4♠, e o Tião jogou o A♥. Só falta o Juca, que é o pé.',
    vira: 'Qe',
    dealer: 1,
    plays: '4e Ac',
    hand: '3p Ko 7c',
    answer: 'card:3p',
    explanation:
        'O parceiro abriu baixo justamente para você resolver: na dupla, '
        'você é quem está mais perto do pé. Mate com o 3: para levar a '
        'primeira, o Juca vai ter que gastar uma manilha.',
    wrong: {
      'card:Ko':
          'O rei perde para o ás do Tião: a primeira fica com eles sem o Juca '
          'gastar nada.',
    },
  ),
  TrainingScenario(
    id: 'tie_is_not_enough',
    level: TrainingLevel.intermediate,
    title: 'Embuchar não serve',
    situation:
        'Vocês perderam a primeira. Na segunda, o Juca abriu com o 3♦ e está '
        'ganhando. Você é o pé. Vira 5♣: as manilhas são os 6.',
    vira: '5p',
    rounds: ['Qo 2e Kp 7c'],
    plays: '3o 5e 4p',
    hand: '3e 6c',
    answer: 'card:6c',
    explanation:
        'Quem ganhou a primeira leva a mão se a segunda embuchar. Com o 3♠ '
        'você só embucha, e a mão é deles. Precisa ganhar: use a copas.',
    wrong: {
      'card:3e':
          'Embuchando a segunda depois de perder a primeira, a mão é de quem '
          'fez a primeira: deles.',
    },
  ),
  TrainingScenario(
    id: 'safe_truco_at_foot',
    level: TrainingLevel.intermediate,
    title: 'Truco sem risco',
    situation:
        'Terceira rodada (vocês fizeram a primeira, eles a segunda). O Juca '
        'abriu com o K♠ e ninguém passou dele. Você é o pé e tem o A♦. Vira '
        '2♥: as manilhas são os 3.',
    vira: '2c',
    dealer: 2,
    rounds: ['5p 2e 7o Jc', '6e Ap Qc 4e'],
    plays: 'Ke 4o Qp',
    hand: 'Ao',
    answer: 'raise',
    explanation:
        'Seu ás já ganha a rodada e a mão, e eles não têm mais carta para '
        'jogar. Pedindo truco não há risco nenhum: se aceitarem, vale 3; se '
        'correrem, vale o mesmo 1 que você já ia ganhar.',
    wrong: {
      'card:Ao': 'Jogando direto a mão vale só 1. Com o truco, pode valer 3.',
    },
  ),
  TrainingScenario(
    id: 'tied_with_gato',
    level: TrainingLevel.intermediate,
    title: 'Embuchou e o gato é seu',
    situation:
        'A primeira rodada embuchou (o seu K♣ com o K♥ do Juca). Você abre a '
        'segunda, que decide a mão. Vira Q♦: as manilhas são os valetes.',
    vira: 'Qo',
    rounds: ['Kp Kc 6e 5o'],
    hand: 'Jp 4c',
    answer: 'raise',
    explanation:
        'Com o gato a segunda rodada é sua, e ela decide a mão. Peça truco '
        'antes de jogar: eles ainda não viram o gato e podem aceitar (ou até '
        'pedir seis). Se correrem, você leva o mesmo 1 de jogar direto.',
    wrong: {
      'card:Jp': 'Jogando o gato direto, ninguém vai trucar: a mão vale só 1.',
      'card:4c':
          'Depois de embuchar, a segunda decide a mão. Com o 4 você entrega '
          'a mão que tinha ganha.',
    },
  ),
  TrainingScenario(
    id: 'mao_de_onze_cheap',
    level: TrainingLevel.intermediate,
    title: 'Mão de onze contra 2',
    situation:
        'Vocês estão com 11 e os adversários com só 2. Vira 7♠: as manilhas '
        'são as damas. Nenhuma manilha na dupla.',
    vira: '7e',
    score: (11, 2),
    hand: '3o Kp 5c',
    partner: '2p Je 6o',
    answer: 'accept',
    explanation:
        'Veja o placar: perdendo, eles vão a 5; correndo, a 3. Nos dois '
        'casos vocês continuam com 11 e a próxima é mão de onze de novo. '
        'Então o risco é pequeno e, ganhando, a partida acaba: com um 3 e um '
        '2 na dupla, jogue.',
    wrong: {
      'fold':
          'Correndo vocês só adiam: continuam com 11 e eles ganham 1. Com a '
          'diferença grande no placar, vale arriscar.',
    },
  ),
  TrainingScenario(
    id: 'medium_cards_leading',
    level: TrainingLevel.intermediate,
    title: 'Cartas de meio, fora de posição',
    situation:
        'Primeira rodada, você é o primeiro a jogar. Vira 6♣: as manilhas '
        'são os 7. Sua mão: K, A e 2, sem manilha e sem 3.',
    vira: '6p',
    hand: 'Ke Ac 2o',
    answer: 'card:Ke',
    explanation:
        'Abrindo a mão, três jogadores ainda vão jogar depois de você: suas '
        'cartas de meio estão fora de posição. O 2 aqui só ganha se ninguém '
        'tiver 3 ou manilha. Jogue a menor e deixe o parceiro (mais perto do '
        'pé) resolver; guarde o 2 para quando jogar depois deles.',
    wrong: {
      'raise':
          'Sem manilha e sem 3, pedir truco de primeira é passar facão sem '
          'motivo: quem tiver manilha aceita.',
      'card:2o':
          'O 2 jogado primeiro perde para qualquer 3 ou manilha dos três que '
          'jogam depois.',
    },
  ),
  TrainingScenario(
    id: 'read_their_truco',
    level: TrainingLevel.intermediate,
    title: 'Truco de primeira',
    situation:
        'Primeira rodada. O Juca pediu truco antes de qualquer carta. Vira '
        'Q♥: as manilhas são os valetes. Você vê as cartas do parceiro.',
    vira: 'Qc',
    dealer: 0,
    hand: '3c Ap 5o',
    partner: '3p 2o Ke',
    raiseBy: 1,
    raiseTo: 1,
    answer: 'accept',
    explanation:
        'Somando as duas mãos vocês têm dois 3, um 2 e um ás: sem manilha, '
        'mas cartas que só perdem para manilha. Eles precisam de duas '
        'rodadas e um truco de primeira muitas vezes é facão. Aceite.',
    wrong: {
      'fold': 'Com dois 3 e um 2 na dupla, correr de primeira é dar ponto.',
      'raise':
          'Sem nenhuma manilha, pedir seis é arriscar demais: se eles '
          'tiverem duas manilhas, a conta fica cara.',
    },
  ),
  TrainingScenario(
    id: 'won_first_lead_strong',
    level: TrainingLevel.intermediate,
    title: 'Primeira ganha',
    situation:
        'Vocês ganharam a primeira rodada com o seu 3. Na segunda, você é o '
        'primeiro. Vira 7♦: as manilhas são as damas.',
    vira: '7o',
    rounds: ['3p 2c 5o Ko'],
    hand: 'Ae 4c',
    answer: 'card:4c',
    explanation:
        'Truco é em dupla: quem está mais perto do pé é que deve jogar a '
        'carta forte. Jogando o 4, se o Juca puser uma carta alta, você '
        'economizou o ás e o seu parceiro responde, sabendo o que precisa '
        'fazer (e pode até trucar). E com a primeira ganha, mesmo perdendo a '
        'segunda vocês ainda têm o ás para a terceira.',
    alsoGood: {
      'card:Ae':
          'Jogar o ás também vale: com a primeira ganha, ganhar ou embuchar a '
          'segunda já fecha a mão, e o ás obriga os adversários a gastar '
          'cartas fortes.',
    },
  ),

  // ----------------------------------------------------------- avançado --
  TrainingScenario(
    id: 'dont_kill_partner_hold',
    level: TrainingLevel.advanced,
    title: 'Três cartas boas',
    situation:
        'Primeira rodada, vira 6♠ (manilhas: os 7). Você é o pé com gato, '
        'copas e um 3. Seu parceiro já está fazendo a rodada com o 3♣.',
    vira: '6e',
    dealer: 0,
    plays: '5o 3p 2c',
    hand: '7p 7c 3o',
    answer: 'card:3o',
    explanation:
        'A primeira já é de vocês, e com gato e copas você ganha a segunda ou '
        'a terceira: a mão está garantida. Agora o objetivo é fazer ela '
        'valer mais. Jogue o 3 (sem matar a carta do parceiro com manilha) e '
        'esconda o casal: eles podem achar que estão vivos e trucar, e aí '
        'você pede seis.',
    wrong: {
      'raise':
          'Com a mão garantida, o truco agora só espanta: eles correm e a mão '
          'vale 1. Deixe que eles trucam.',
      'card:7p': 'Mostrar o gato à toa: a primeira já era de vocês.',
      'card:7c': 'Mostrar a copas à toa: a primeira já era de vocês.',
    },
  ),
  TrainingScenario(
    id: 'raise_over',
    level: TrainingLevel.advanced,
    title: 'Truca por cima',
    situation:
        'Vocês fizeram a primeira com o seu 3. Na segunda você abriu baixo, '
        'com o 4♦, e o Juca pediu truco. Vira A♥: as manilhas são os 2. Você '
        'vê as cartas do parceiro.',
    vira: 'Ac',
    rounds: ['3c Ae 6p Ko'],
    plays: '4o',
    hand: 'Ke',
    partner: '2p 5e',
    raiseBy: 1,
    raiseTo: 1,
    answer: 'raise',
    explanation:
        'O parceiro tem o gato e ainda joga nesta rodada: a segunda é de '
        'vocês, e com a primeira já feita a mão está ganha. O Juca caiu na '
        'sua carta baixa. Truque por cima: peça seis.',
    alsoGood: {
      'accept':
          'Aceitar e deixar para pedir seis depois também funciona, mas eles '
          'podem não dar outra chance.',
    },
  ),
  TrainingScenario(
    id: 'partner_wants_to_run',
    level: TrainingLevel.advanced,
    title: 'O parceiro quer correr',
    situation:
        'Vocês fizeram a primeira com o seu 2. Na segunda você abriu com o '
        '3♦ e o Juca pediu truco. Seu parceiro, com cartas fracas, quer '
        'correr: você decide. Vira 6♦: as manilhas são os 7. Sobrou na sua '
        'mão a copas.',
    vira: '6o',
    rounds: ['2p Kc 5e Ao'],
    plays: '3o',
    hand: '7c',
    partner: '4p 6e',
    raiseBy: 1,
    raiseTo: 1,
    refusedByPartner: true,
    answer: 'accept',
    explanation:
        'O parceiro só vê as cartas dele. Faça a conta: com a primeira '
        'feita, eles precisam ganhar a segunda e a terceira. Para passar do '
        'seu 3 precisam de manilha (um 3 só embucha, e embuchando a mão é '
        'de vocês), e na terceira só o gato ganha da sua copas. Precisam '
        'ter duas manilhas, uma delas o gato. Aceite.',
    alsoGood: {
      'raise':
          'Pedir seis também se justifica: eles só ganham com o gato e mais '
          'uma manilha.',
    },
    wrong: {
      'fold':
          'Correr aqui é entregar uma mão que vocês ganham na grande maioria '
          'das vezes.',
    },
  ),
  TrainingScenario(
    id: 'eleven_ten_limit',
    level: TrainingLevel.advanced,
    title: 'Mão de onze no limite',
    situation:
        'Vocês estão com 11 e os adversários com 10. Vira Q♣: as manilhas '
        'são os valetes. A dupla tem a salmoura, um 3, um 2 e um rei.',
    vira: 'Qp',
    score: (11, 10),
    hand: '3e 2o 6p',
    partner: 'Jo Ke 5c',
    answer: 'accept',
    explanation:
        'Correndo, eles vão a 11 e a próxima é mão de ferro: cara ou coroa, '
        '50%. Então jogue sempre que a dupla ganhar mais da metade das vezes. '
        'Com salmoura, 3 e 2 vocês ganham duas rodadas bem mais que metade '
        'das vezes: jogue.',
    wrong: {
      'fold':
          'Com 11 × 10, correr leva para a mão de ferro (50%). Esta mão '
          'ganha mais que isso.',
    },
  ),
  TrainingScenario(
    id: 'broken_couple',
    level: TrainingLevel.advanced,
    title: 'Casal sem o gato',
    situation:
        'Primeira rodada, vira 4♠ (manilhas: os 5). Você é o pé com copas e '
        'espadilha. O Juca está ganhando com o 3♠. Entregar a primeira para '
        'eles trucarem?',
    vira: '4e',
    dealer: 0,
    plays: '3e 6o 7p',
    hand: '5c 5e Qo',
    answer: 'card:5e',
    explanation:
        'Entregar a primeira só é seguro com o casal maior (gato e copas). '
        'Sem o gato, se um deles tiver o gato ele ganha de uma das suas '
        'manilhas e a mão é deles. Faça a primeira com a espadilha e guarde '
        'a copas, que só perde para o gato.',
    wrong: {
      'card:Qo':
          'Perdendo a primeira você precisa ganhar as duas próximas, e o gato '
          'na mão deles derruba o plano.',
      'card:5c':
          'A copas também ganha, mas a espadilha já basta: guarde a maior.',
    },
  ),
  TrainingScenario(
    id: 'facao_third_round',
    level: TrainingLevel.advanced,
    title: 'Hora do facão',
    situation:
        'Terceira rodada (vocês fizeram a primeira, eles a segunda). O Juca '
        'abriu com o K♣ e os outros não passaram dele. Você é o pé e só tem o '
        '6♦, que perde. Vira 3♦: as manilhas são os 4.',
    vira: '3o',
    dealer: 2,
    rounds: ['7e 2c Jo 3p', 'Ap Qo 5c 2p'],
    plays: 'Kp Qc 5e',
    hand: '6o',
    answer: 'raise',
    explanation:
        'Jogando o 6 você perde 1 ponto de qualquer jeito. Eles já jogaram '
        'tudo e o rei deles perde para ás, 2, 3 e manilha: muita carta. '
        'Passando facão, eles tendem a correr e o ponto vira seu. Se '
        'aceitarem, você perde 3 em vez de 1: é o risco do facão.',
    alsoGood: {
      'card:6o':
          'Jogar e perder 1 também é razoável contra quem aceita qualquer '
          'truco. Mas um rei na mesa é o melhor momento para o facão.',
    },
  ),
  TrainingScenario(
    id: 'tie_on_purpose',
    level: TrainingLevel.advanced,
    title: 'Embuchar de propósito',
    situation:
        'Primeira rodada, vira 6♦ (manilhas: os 7). Você é o pé com gato, 3♥ '
        'e 4♦. O Juca está ganhando com o 3♠.',
    vira: '6o',
    dealer: 0,
    plays: '3e 5o Kc',
    hand: '3c 7p 4o',
    answer: 'card:3c',
    explanation:
        'Embuchando com o 3♥, a segunda decide a mão e você continua sendo o '
        'pé. Com o gato, você joga por último na rodada que decide: a mão '
        'está garantida, e eles ainda não sabem disso. Se trucarem, peça '
        'seis.',
    alsoGood: {
      'card:7p':
          'Fazer a primeira com o gato também é forte, mas aí a mão fica na '
          'mão do 3 e das cartas do parceiro. Embuchando, ela fica garantida.',
    },
    wrong: {
      'card:4o':
          'Entregando a primeira você precisa ganhar duas rodadas: o gato '
          'ganha uma, mas a outra fica com o 3 fora de posição.',
    },
  ),
  TrainingScenario(
    id: 'last_card_no_truco',
    level: TrainingLevel.advanced,
    title: 'Última carta: trucar antes?',
    situation:
        'Terceira rodada (eles fizeram a primeira, você a segunda). Você abre '
        'a rodada com a sua última carta, a copas. Vira J♠: as manilhas são '
        'os reis.',
    vira: 'Je',
    dealer: 2,
    rounds: ['3o Ae 7c 2p', '6p 2o Qe 5c'],
    hand: 'Kc',
    answer: 'card:Kc',
    explanation:
        'A copas só perde para o gato. Jogue sem trucar: sem o gato, eles '
        'não ganham e você leva o ponto (e, se trucarem de facão, você '
        'aceita). Com o gato, o Juca truca e você corre perdendo 1.',
    wrong: {
      'raise':
          'Trucando antes, quem não tem o gato corre (você leva 1) e quem '
          'tem pede seis: você perde 3 ou mais. Jogando primeiro, você '
          'nunca perde mais que 1.',
    },
  ),
  TrainingScenario(
    id: 'reinforce_partner',
    level: TrainingLevel.advanced,
    title: 'Mata a do parceiro',
    situation:
        'A primeira embuchou (o 2 do parceiro com o 2 do Tião), então a '
        'segunda decide. Seu parceiro abriu a segunda com o A♥ e o Tião '
        'jogou baixo. O Juca, o pé, joga depois de você. Vira 7♦: as '
        'manilhas são as damas.',
    vira: '7o',
    dealer: 1,
    rounds: ['2p 2c 4e 6p'],
    plays: 'Ac 5o',
    hand: '3e Kp',
    answer: 'card:3e',
    explanation:
        'Esta rodada decide a mão. O ás do parceiro perde para 2, 3 e '
        'manilha, e o Juca joga por último vendo tudo. Passe por cima do '
        'parceiro com o 3: para ganhar, o Juca vai precisar de manilha. Não '
        'há próxima rodada para guardar carta.',
    wrong: {
      'card:Kp':
          'Guardando o 3, o Juca leva a rodada (e a mão) com qualquer 2, 3 '
          'ou manilha.',
    },
  ),
  TrainingScenario(
    id: 'hold_the_gato',
    level: TrainingLevel.advanced,
    title: 'Mão ganha: não espante',
    situation:
        'Vocês fizeram a primeira com o seu 3. Na segunda você é o primeiro '
        'e tem o gato e o 2♠. Vira Q♦: as manilhas são os valetes.',
    vira: 'Qo',
    rounds: ['3c Ao 5p Ke'],
    hand: '2e Jp',
    answer: 'card:2e',
    explanation:
        'Com a primeira feita e o gato na mão, a mão já é sua: se perder a '
        'segunda, o gato ganha a terceira. Jogue o 2 e deixe eles acharem que '
        'têm chance. Se trucarem, peça seis.',
    wrong: {
      'raise': 'Truco com a mão ganha espanta: eles correm e a mão vale 1.',
      'card:Jp':
          'O gato agora fecha a mão valendo 1. Ele pode esperar a terceira.',
    },
  ),
];

/// The scenarios of [level], in order.
List<TrainingScenario> trainingAt(TrainingLevel level) => [
  for (final s in trainingScenarios)
    if (s.level == level) s,
];
