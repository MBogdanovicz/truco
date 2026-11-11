import 'cards.dart';

/// A situation to practise in the "modo professor": the table as one player
/// sees it, a question, and the explanation of the answer.
class TrainingScenario {
  const TrainingScenario({
    required this.id,
    required this.title,
    required this.situation,
    required this.vira,
    required this.hand,
    required this.question,
    required this.options,
    required this.answer,
    required this.explanation,
    this.table = const [],
    this.partner,
  });

  /// Stable id, kept with the person's progress.
  final String id;
  final String title;

  /// What happened so far, in words.
  final String situation;
  final Card vira;
  final List<Card> hand;

  /// Cards already on the table this round: (who played, card).
  final List<(String, Card)> table;

  /// The partner's cards, when the rules let the person see them.
  final List<Card>? partner;
  final String question;
  final List<String> options;

  /// Index of the right option.
  final int answer;
  final String explanation;
}

Card _c(String id) => Card.parse(id);
List<Card> _h(String ids) => ids.split(' ').map(_c).toList();

/// Paulista rules with the "vira": the manilha is the rank after the vira,
/// and between manilhas: paus (gato) > copas > espadas (espadilha) > ouros
/// (salmora).
final trainingScenarios = <TrainingScenario>[
  TrainingScenario(
    id: 'manilha_3',
    title: 'Qual é a manilha?',
    situation: 'A vira é o 3♥.',
    vira: _c('3c'),
    hand: _h('4p Ae 2o'),
    question: 'Qual carta é a manilha nesta mão?',
    options: ['O 4', 'O ás', 'O 2'],
    answer: 0,
    explanation:
        'A manilha é a carta logo acima da vira. Depois do 3 a sequência dá '
        'a volta e começa no 4. E o 4♣ é o gato, a maior de todas.',
  ),
  TrainingScenario(
    id: 'manilha_7',
    title: 'Sem 8, 9 e 10',
    situation: 'A vira é o 7♦.',
    vira: _c('7o'),
    hand: _h('Qe Jc 3p'),
    question: 'Qual carta é a manilha nesta mão?',
    options: ['A dama (Q)', 'O valete (J)', 'O 3'],
    answer: 0,
    explanation:
        'O baralho do truco não tem 8, 9 e 10: depois do 7 vem a dama. '
        'Então as damas são as manilhas, e a Q♠ é a espadilha.',
  ),
  TrainingScenario(
    id: 'manilha_vs_manilha',
    title: 'Manilha contra manilha',
    situation:
        'Vira 3♠: as manilhas são os 4. O adversário antes de você jogou o '
        '4♦.',
    vira: _c('3e'),
    hand: _h('4e 3c 7p'),
    table: [('Adversário', _c('4o'))],
    question: 'Qual carta ganha a rodada?',
    options: ['4♠', '3♥', 'Nenhuma'],
    answer: 0,
    explanation:
        'Só manilha ganha de manilha, e entre elas vale o naipe: paus (gato) '
        '> copas > espadas (espadilha) > ouros (salmora). A espadilha ganha '
        'da salmora. O 3 é a maior carta comum, mas perde de qualquer '
        'manilha.',
  ),
  TrainingScenario(
    id: 'cheapest_winner',
    title: 'A mais barata que ganha',
    situation:
        'Primeira rodada, vira 5♥ (manilhas: os 6). O adversário jogou o '
        '2♠.',
    vira: _c('5c'),
    hand: _h('3o Ap 5e'),
    table: [('Adversário', _c('2e'))],
    question: 'Qual carta você joga?',
    options: ['3♦', 'A♣', '5♠'],
    answer: 0,
    explanation:
        'O 2 só perde para o 3 e para as manilhas. O 3♦ é a única carta sua '
        'que ganha a rodada. O ás perde para o 2.',
  ),
  TrainingScenario(
    id: 'cant_beat_gato',
    title: 'Não dá para ganhar',
    situation:
        'Primeira rodada, vira Q♥ (manilhas: os valetes). O adversário '
        'jogou o J♣, o gato. Seu parceiro ainda vai jogar.',
    vira: _c('Qc'),
    hand: _h('3o 2e 6c'),
    table: [('Adversário', _c('Jp'))],
    question: 'Qual carta você joga?',
    options: ['3♦', '2♠', '6♥'],
    answer: 2,
    explanation:
        'Ninguém ganha do gato. Jogue a mais fraca e guarde o 3 e o 2 para '
        'as próximas rodadas.',
  ),
  TrainingScenario(
    id: 'partner_winning_last',
    title: 'O parceiro já está ganhando',
    situation:
        'Primeira rodada, vira 4♦ (manilhas: os 5). Você é o último a '
        'jogar. Seu parceiro está ganhando com o 3♠.',
    vira: _c('4o'),
    hand: _h('2c Kp 4e'),
    table: [
      ('Adversário', _c('Jo')),
      ('Parceiro', _c('3e')),
      ('Adversário', _c('2p')),
    ],
    question: 'Qual carta você joga?',
    options: ['2♥', 'K♣', '4♠'],
    answer: 2,
    explanation:
        'Você é o último e seu parceiro já ganha a rodada: jogue a pior '
        'carta e guarde as boas.',
  ),
  TrainingScenario(
    id: 'partner_winning_middle',
    title: 'Reforçar ou não?',
    situation:
        'Primeira rodada, vira K♠ (manilhas: os ases). Seu parceiro está '
        'ganhando com o 3♥, e um adversário ainda joga depois de você.',
    vira: _c('Ke'),
    hand: _h('2p 7e Qo'),
    table: [('Adversário', _c('Jc')), ('Parceiro', _c('3c'))],
    question: 'Qual carta você joga?',
    options: ['2♣', '7♠', 'Q♦'],
    answer: 1,
    explanation:
        'Nenhuma das suas cartas ganha do 3 do parceiro. Se o último '
        'adversário tiver manilha, ganha de qualquer jeito. Jogue a mais '
        'fraca, o 7, e guarde o 2.',
  ),
  TrainingScenario(
    id: 'first_lead',
    title: 'Abrindo a mão',
    situation:
        'Primeira rodada e você é o primeiro a jogar. Vira 6♦: as manilhas '
        'são os 7.',
    vira: _c('6o'),
    hand: _h('7p 3c 5e'),
    question: 'Qual carta você joga?',
    options: ['7♣ (gato)', '3♥', '5♠'],
    answer: 1,
    explanation:
        'Abra com o 3, que só perde para manilha, e guarde o gato: ele '
        'ganha qualquer rodada depois, quando for preciso.',
  ),
  TrainingScenario(
    id: 'won_first_lead_strong',
    title: 'Primeira ganha',
    situation:
        'Vocês ganharam a primeira rodada. Na segunda, você é o primeiro. '
        'Vira 7♦: as manilhas são as damas.',
    vira: _c('7o'),
    hand: _h('Ae 4c'),
    question: 'Qual carta você joga?',
    options: ['A♠', '4♥'],
    answer: 0,
    explanation:
        'Com a primeira ganha, ganhar ou empatar a segunda já fecha a mão. '
        'Jogue a mais forte e obrigue os adversários a gastar as deles.',
  ),
  TrainingScenario(
    id: 'tied_first',
    title: 'Primeira empatada',
    situation:
        'A primeira rodada empatou ("cangou"). Agora quem ganhar a segunda '
        'leva a mão. Você é o primeiro. Vira 3♣: as manilhas são os 4.',
    vira: _c('3p'),
    hand: _h('2c Qe'),
    question: 'Qual carta você joga?',
    options: ['2♥', 'Q♠'],
    answer: 0,
    explanation:
        'Depois de um empate na primeira, a segunda decide a mão. Jogue a '
        'sua melhor carta.',
  ),
  TrainingScenario(
    id: 'lost_first_must_win',
    title: 'Perdeu a primeira',
    situation:
        'Vocês perderam a primeira rodada. Na segunda, o adversário jogou o '
        '2♦ e está ganhando. Você é o último a jogar. Vira J♥: as manilhas '
        'são os reis.',
    vira: _c('Jc'),
    hand: _h('3e 6p'),
    table: [
      ('Adversário', _c('Qp')),
      ('Parceiro', _c('Ac')),
      ('Adversário', _c('2o')),
    ],
    question: 'Qual carta você joga?',
    options: ['3♠', '6♣'],
    answer: 0,
    explanation:
        'Perdendo a primeira, perder a segunda é perder a mão. O 3 ganha do '
        '2: é a hora de usar.',
  ),
  TrainingScenario(
    id: 'run_weak',
    title: 'Truco com cartas fracas',
    situation:
        'Vocês perderam a primeira rodada. Na segunda, o adversário pediu '
        'truco. Vira K♥: as manilhas são os ases.',
    vira: _c('Kc'),
    hand: _h('4e 5o'),
    question: 'O que você faz?',
    options: ['Aceitar', 'Correr'],
    answer: 1,
    explanation:
        'Perdendo a primeira, vocês precisam ganhar as duas próximas, e com '
        '4 e 5 a chance é muito pequena. Correndo vocês perdem 1 ponto; '
        'aceitando, arriscam 3.',
  ),
  TrainingScenario(
    id: 'casal_maior_truco',
    title: 'Casal maior',
    situation:
        'Primeira rodada, você é o primeiro a jogar. Vira K♦: as manilhas '
        'são os ases.',
    vira: _c('Ko'),
    hand: _h('Ap Ac 4o'),
    question: 'Vale pedir truco?',
    options: ['Sim', 'Não'],
    answer: 0,
    explanation:
        'O gato (A♣) e a copas (A♥) são as duas maiores cartas do jogo: '
        'vocês ganham duas rodadas com certeza. Pode pedir truco sem medo. '
        'Se quiser arrancar mais pontos, deixe que eles peçam e responda '
        'com seis.',
  ),
  TrainingScenario(
    id: 'raise_after_seis',
    title: 'Pediram seis',
    situation:
        'Vocês ganharam a primeira rodada. Você pediu truco, e o adversário '
        'respondeu "seis!". Vira 6♥: as manilhas são os 7.',
    vira: _c('6c'),
    hand: _h('7p 5o'),
    question: 'O que você faz?',
    options: ['Correr', 'Aceitar', 'Pedir nove'],
    answer: 2,
    explanation:
        'Com a primeira ganha e o gato na mão, a segunda rodada é sua: a '
        'mão está ganha. Peça nove: se correrem, vocês levam 6; se '
        'aceitarem, 9.',
  ),
  TrainingScenario(
    id: 'two_top_manilhas_answer',
    title: 'Truco logo de cara',
    situation:
        'Primeira rodada. O adversário pediu truco antes de jogar. Vira 6♠: '
        'as manilhas são os 7.',
    vira: _c('6e'),
    hand: _h('7c 7e 4p'),
    question: 'O que você faz?',
    options: ['Correr', 'Aceitar', 'Pedir seis'],
    answer: 2,
    explanation:
        'A copas e a espadilha são a 2ª e a 3ª maiores cartas do jogo. Só o '
        'gato ganha de uma delas. Vocês ganham na grande maioria das vezes: '
        'peça seis.',
  ),
  TrainingScenario(
    id: 'mao_de_onze_play',
    title: 'Mão de onze: jogar?',
    situation:
        'Vocês estão com 11 e os adversários com 7. Na mão de onze você vê '
        'as cartas do parceiro. Vira 6♠: as manilhas são os 7.',
    vira: _c('6e'),
    hand: _h('3p 2o Ke'),
    partner: _h('3c Ao Jp'),
    question: 'Vocês jogam ou correm?',
    options: ['Jogar', 'Correr'],
    answer: 0,
    explanation:
        'Sem manilha, mas com dois 3 e um 2 a dupla ganha duas rodadas na '
        'maioria das vezes. Jogando, a mão vale 3 e fecha a partida; '
        'correndo, os adversários ganham 1 e o jogo continua.',
  ),
  TrainingScenario(
    id: 'mao_de_onze_run',
    title: 'Mão de onze: correr?',
    situation:
        'Vocês estão com 11 e os adversários com 10. Vira 2♦: as manilhas '
        'são os 3.',
    vira: _c('2o'),
    hand: _h('4o 5p 6c'),
    partner: _h('Qe Jo 5c'),
    question: 'Vocês jogam ou correm?',
    options: ['Jogar', 'Correr'],
    answer: 1,
    explanation:
        'Com cartas tão fracas, perder é quase certo, e perder a mão de '
        'onze dá 3 pontos e a partida aos adversários. Correndo, eles vão '
        'para 11 e a próxima é mão de ferro (11 × 11), onde é sorte para '
        'os dois lados: bem melhor.',
  ),
  TrainingScenario(
    id: 'no_truco_on_eleven',
    title: 'Truco na mão de onze?',
    situation:
        'Os adversários estão com 11 e decidiram jogar a mão de onze. Você '
        'tem uma mão ótima. Vira 4♣: as manilhas são os 5.',
    vira: _c('4p'),
    hand: _h('5p 5c 3o'),
    question: 'Você pode pedir truco?',
    options: ['Sim', 'Não'],
    answer: 1,
    explanation:
        'Na mão de onze ninguém pede truco: ela já vale 3 pontos. Com essa '
        'mão, o jeito é ganhar as rodadas e tirar a partida deles.',
  ),
];
