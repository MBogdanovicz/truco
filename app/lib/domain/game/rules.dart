import 'cards.dart';

/// How the manilhas (the four strongest cards) are chosen.
enum ManilhaMode {
  /// A "vira" card is turned up each hand; the rank above it is the manilha
  /// (Paulista).
  vira,

  /// Always the same four cards: 4♣ (gato), 7♥ (copas), A♠ (espadilha) and
  /// 7♦ (salmora or pica-fumo), as in truco mineiro.
  fixed,
}

/// Rules of a truco game. Paulista scoring is the base; the options that
/// change between tables (fixed manilhas, covered card, mão de ferro) are
/// fields here, so the engine stays generic and custom rules can grow later.
/// (Mineiro scoring, 2/4/8/10/12 with a "mão de dez", was left out on
/// purpose; the engine still supports it through [stakes] and
/// [decisionScore].)
class TrucoRules {
  const TrucoRules({
    required this.id,
    required this.name,
    required this.manilhaMode,
    required this.stakes,
    required this.decisionScore,
    required this.decisionHandValue,
    this.targetScore = 12,
    this.allowCoveredCard = true,
    this.ironHand = true,
    this.seePartnerOnRaise = true,
    this.bothTeamsSeeOnDecision = true,
    this.dealerSeesPartnerThirdCard = true,
  });

  /// Stable id ("paulista"), stored with results.
  final String id;
  final String name;
  final ManilhaMode manilhaMode;

  /// Hand values: the first entry is a normal hand, then each raise
  /// (truco, seis, nove, doze in Paulista: 1, 3, 6, 9, 12).
  final List<int> stakes;

  /// A team with exactly this score plays a "mão de onze" (or "mão de dez" in
  /// Mineiro): it sees the partner's cards and decides to play or run, and
  /// nobody may call truco.
  final int decisionScore;

  /// What a "mão de onze" is worth when the team chooses to play.
  final int decisionHandValue;

  final int targetScore;

  /// Whether a card may be played face down from the second round on.
  final bool allowCoveredCard;

  /// When both teams are at [decisionScore] ("mão de ferro"), everyone plays
  /// without seeing their own cards.
  final bool ironHand;

  /// The team answering a truco (or any raise) sees each other's cards
  /// before deciding.
  final bool seePartnerOnRaise;

  /// In a mão de onze the other team also sees each other's cards (the team
  /// at 11 always does). Never in a mão de ferro.
  final bool bothTeamsSeeOnDecision;

  /// Whoever deals sees the third card dealt to their partner (for the whole
  /// hand, while the partner still holds it).
  final bool dealerSeesPartnerThirdCard;

  int get baseValue => stakes.first;

  /// Name of the call that raises the hand from [stakes][level] to the next
  /// value. The names are the same in both variants even though Mineiro
  /// values differ ("seis" is worth 8 there).
  String raiseName(int level) => const ['Truco', 'Seis', 'Nove', 'Doze'][level];

  static const paulista = TrucoRules(
    id: 'paulista',
    name: 'Paulista',
    manilhaMode: ManilhaMode.vira,
    stakes: [1, 3, 6, 9, 12],
    decisionScore: 11,
    decisionHandValue: 3,
  );

  /// Paulista with the given table options.
  TrucoRules copyWith({
    ManilhaMode? manilhaMode,
    bool? allowCoveredCard,
    bool? ironHand,
    bool? seePartnerOnRaise,
    bool? bothTeamsSeeOnDecision,
    bool? dealerSeesPartnerThirdCard,
  }) => TrucoRules(
    id: id,
    name: name,
    manilhaMode: manilhaMode ?? this.manilhaMode,
    stakes: stakes,
    decisionScore: decisionScore,
    decisionHandValue: decisionHandValue,
    targetScore: targetScore,
    allowCoveredCard: allowCoveredCard ?? this.allowCoveredCard,
    ironHand: ironHand ?? this.ironHand,
    seePartnerOnRaise: seePartnerOnRaise ?? this.seePartnerOnRaise,
    bothTeamsSeeOnDecision:
        bothTeamsSeeOnDecision ?? this.bothTeamsSeeOnDecision,
    dealerSeesPartnerThirdCard:
        dealerSeesPartnerThirdCard ?? this.dealerSeesPartnerThirdCard,
  );

  /// Table options as stored with a room (Paulista base + variations).
  Map<String, Object?> toJson() => {
    'manilhas': manilhaMode.name,
    'coberta': allowCoveredCard,
    'ferro': ironHand,
    'verNoTruco': seePartnerOnRaise,
    'verNaMaoDeOnze': bothTeamsSeeOnDecision,
    'terceiraCarta': dealerSeesPartnerThirdCard,
  };

  static TrucoRules fromJson(Map<String, Object?> j) => paulista.copyWith(
    manilhaMode: ManilhaMode.values.asNameMap()[j['manilhas']],
    allowCoveredCard: j['coberta'] as bool?,
    ironHand: j['ferro'] as bool?,
    seePartnerOnRaise: j['verNoTruco'] as bool?,
    bothTeamsSeeOnDecision: j['verNaMaoDeOnze'] as bool?,
    dealerSeesPartnerThirdCard: j['terceiraCarta'] as bool?,
  );

  /// Short description of the options, e.g. for results and the rules page.
  String get summary => [
    manilhaMode == ManilhaMode.vira ? 'manilha virada' : 'manilhas fixas',
    if (!allowCoveredCard) 'sem carta coberta',
    if (!ironHand) 'sem mão de ferro',
  ].join(', ');

  /// Strength of [card] for this hand (higher wins). Normal cards go from 0
  /// (4) to 9 (3); manilhas are 10..13 by suit.
  int strength(Card card, {Card? vira}) {
    switch (manilhaMode) {
      case ManilhaMode.vira:
        if (vira != null && card.rank == vira.rank.next) {
          return 10 + card.suit.index;
        }
      case ManilhaMode.fixed:
        final m = _fixedManilhas.indexOf(card);
        if (m >= 0) return 10 + m;
    }
    return card.rank.index;
  }

  bool isManilha(Card card, {Card? vira}) => strength(card, vira: vira) >= 10;

  /// Mineiro manilhas, weakest first.
  static const _fixedManilhas = [
    Card(Rank.seven, Suit.ouros), // salmora (pica-fumo)
    Card(Rank.ace, Suit.espadas), // espadilha
    Card(Rank.seven, Suit.copas), // sete copas
    Card(Rank.four, Suit.paus), // gato
  ];
}

/// Strength of a card played face down: loses to everything.
const coveredStrength = -1;
