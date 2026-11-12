import '../scorekeeper/team.dart';
import 'cards.dart';
import 'rules.dart';
import 'truco_game.dart';

/// A card on the table. [card] is null for a covered card seen by others.
class PlayView {
  const PlayView(this.seat, this.card, {this.covered = false});
  final int seat;
  final Card? card;
  final bool covered;

  Map<String, Object?> toJson() => {
    's': seat,
    if (card != null) 'c': card!.id,
    if (covered) 'x': true,
  };

  static PlayView fromJson(Map<String, Object?> j) => PlayView(
    j['s']! as int,
    j['c'] == null ? null : Card.parse(j['c']! as String),
    covered: j['x'] == true,
  );
}

class RoundView {
  const RoundView(this.plays, {required this.winner, required this.topSeat});
  final List<PlayView> plays;
  final Team? winner;
  final int topSeat;
  bool get tied => winner == null;

  Map<String, Object?> toJson() => {
    'p': [for (final p in plays) p.toJson()],
    if (winner != null) 'w': winner!.name,
    't': topSeat,
  };

  static RoundView fromJson(Map<String, Object?> j) => RoundView(
    [
      for (final p in j['p']! as List)
        PlayView.fromJson((p as Map).cast<String, Object?>()),
    ],
    winner: j['w'] == null ? null : Team.fromName(j['w']! as String),
    topSeat: j['t']! as int,
  );
}

/// Everything one seat sees of the table at one moment, plus the table
/// talk (who said "Truco!", hand result). It is what the screen draws, both
/// for games on this device and online, where the server sends it as JSON.
/// Seats are absolute (0/2 team A); [me] is the viewer.
class TableView {
  const TableView({
    required this.me,
    required this.rules,
    required this.phase,
    required this.turn,
    required this.dealer,
    required this.foot,
    required this.handNumber,
    required this.vira,
    required this.handValue,
    required this.stakeLevel,
    required this.pending,
    required this.decisionTeam,
    required this.iron,
    required this.scores,
    required this.rounds,
    required this.currentPlays,
    required this.hand,
    required this.handCounts,
    required this.partnerHand,
    required this.partnerShownForRaise,
    required this.canCover,
    required this.canRaise,
    required this.mustAnswer,
    required this.myTurn,
    required this.winner,
    this.forfeited,
    this.shown = const {},
    this.revealing = false,
    this.canShow = false,
    this.speech = const {},
    this.toast,
    this.showLastRound = false,
    this.delayMs = 0,
  });

  final int me;
  final TrucoRules rules;
  final GamePhase phase;
  final int turn;
  final int dealer;
  final int foot;
  final int handNumber;
  final Card? vira;
  final int handValue;
  final int stakeLevel;
  final PendingRaise? pending;
  final Team? decisionTeam;
  final bool iron;
  final Map<Team, int> scores;
  final List<RoundView> rounds;
  final List<PlayView> currentPlays;

  /// Own cards (empty in a mão de ferro: use [handCounts]).
  final List<Card> hand;
  final List<int> handCounts;
  final List<Card>? partnerHand;
  final bool partnerShownForRaise;
  final bool canCover;
  final bool canRaise;

  /// This seat's team must answer a raise or decide a mão de onze.
  final bool mustAnswer;

  /// This seat must play a card (or may raise).
  final bool myTurn;
  final Team? winner;

  /// The team that gave the game up (W.O.).
  final Team? forfeited;

  /// Cards shown after the hand ("Mostrar cartas"), by seat.
  final Map<int, List<Card>> shown;

  /// The hand is over and the game waits a moment for people to show
  /// their cards.
  final bool revealing;

  /// The viewer may show their cards now.
  final bool canShow;
  final Map<int, String> speech;
  final String? toast;
  final bool showLastRound;

  /// How long to wait before showing this frame, so moves can be followed.
  final int delayMs;

  Team get team => teamOfSeat(me);
  int scoreOf(Team t) => scores[t]!;

  /// Whether the viewer can do something right now.
  bool get canAct => myTurn || mustAnswer;

  /// Cards visible on the table now (the last round lingers a moment).
  List<PlayView> get tablePlays => currentPlays.isNotEmpty
      ? currentPlays
      : (showLastRound && rounds.isNotEmpty ? rounds.last.plays : const []);

  TableView copyWith({int? delayMs}) => TableView(
    me: me,
    rules: rules,
    phase: phase,
    turn: turn,
    dealer: dealer,
    foot: foot,
    handNumber: handNumber,
    vira: vira,
    handValue: handValue,
    stakeLevel: stakeLevel,
    pending: pending,
    decisionTeam: decisionTeam,
    iron: iron,
    scores: scores,
    rounds: rounds,
    currentPlays: currentPlays,
    hand: hand,
    handCounts: handCounts,
    partnerHand: partnerHand,
    partnerShownForRaise: partnerShownForRaise,
    canCover: canCover,
    canRaise: canRaise,
    mustAnswer: mustAnswer,
    myTurn: myTurn,
    winner: winner,
    forfeited: forfeited,
    shown: shown,
    revealing: revealing,
    canShow: canShow,
    speech: speech,
    toast: toast,
    showLastRound: showLastRound,
    delayMs: delayMs ?? this.delayMs,
  );

  /// The view of [seat] right now. [answerers] are the seats that may answer
  /// a raise or mão de onze (humans of that team, or one bot).
  static TableView of(
    TrucoGame g,
    int seat, {
    required TableTalk talk,
    required bool Function(int seat) mayAnswer,
    int delayMs = 0,
    bool revealing = false,
    bool canShow = false,
  }) {
    final v = g.viewFor(seat);
    PlayView play(Play p) => PlayView(
      p.seat,
      // Covered cards: the partner sees which one it was too.
      p.covered && p.seat != seat && p.seat != partnerOf(seat) ? null : p.card,
      covered: p.covered,
    );
    final team = teamOfSeat(seat);
    final mustAnswer = switch (g.phase) {
      GamePhase.raisePending =>
        g.pending!.team != team &&
            g.pending!.refusedBy != seat &&
            mayAnswer(seat),
      GamePhase.decision => g.decisionTeam == team && mayAnswer(seat),
      _ => false,
    };
    return TableView(
      me: seat,
      rules: g.rules,
      phase: g.phase,
      turn: g.turn,
      dealer: g.dealer,
      foot: g.foot,
      handNumber: g.handNumber,
      vira: g.vira,
      handValue: g.handValue,
      stakeLevel: g.stakeLevel,
      pending: g.pending,
      decisionTeam: g.decisionTeam,
      iron: g.iron,
      scores: Map.unmodifiable(g.scores),
      rounds: [
        for (final r in g.rounds)
          RoundView(
            [for (final p in r.plays) play(p)],
            winner: r.winner,
            topSeat: r.topSeat,
          ),
      ],
      currentPlays: [for (final p in g.currentPlays) play(p)],
      hand: v.hand,
      handCounts: [for (var s = 0; s < 4; s++) g.handOf(s).length],
      partnerHand: v.partnerHand,
      partnerShownForRaise: v.partnerShownForRaise,
      canCover: v.canCover,
      canRaise: g.canRaise(seat),
      mustAnswer: mustAnswer,
      myTurn: g.phase == GamePhase.playing && g.turn == seat,
      winner: g.winner,
      forfeited: g.forfeited,
      shown: g.shown,
      revealing: revealing,
      canShow: canShow,
      speech: Map.unmodifiable(talk.speech),
      toast: talk.toastFor(team),
      showLastRound: talk.showLastRound,
      delayMs: delayMs,
    );
  }

  Map<String, Object?> toJson() => {
    'me': me,
    'rules': rules.toJson(),
    'phase': phase.name,
    'turn': turn,
    'dealer': dealer,
    'foot': foot,
    'hand#': handNumber,
    if (vira != null) 'vira': vira!.id,
    'value': handValue,
    'level': stakeLevel,
    if (pending != null)
      'pending': [
        pending!.seat,
        pending!.toLevel,
        if (pending!.refusedBy != null) pending!.refusedBy!,
      ],
    if (decisionTeam != null) 'decision': decisionTeam!.name,
    if (iron) 'iron': true,
    'scores': [scores[Team.a], scores[Team.b]],
    'rounds': [for (final r in rounds) r.toJson()],
    'plays': [for (final p in currentPlays) p.toJson()],
    'hand': [for (final c in hand) c.id],
    'counts': handCounts,
    if (partnerHand != null) 'partner': [for (final c in partnerHand!) c.id],
    if (partnerShownForRaise) 'partnerRaise': true,
    if (canCover) 'canCover': true,
    if (canRaise) 'canRaise': true,
    if (mustAnswer) 'mustAnswer': true,
    if (myTurn) 'myTurn': true,
    if (winner != null) 'winner': winner!.name,
    if (forfeited != null) 'wo': forfeited!.name,
    if (shown.isNotEmpty)
      'shown': {
        for (final e in shown.entries)
          '${e.key}': [for (final c in e.value) c.id],
      },
    if (revealing) 'reveal': true,
    if (canShow) 'canShow': true,
    if (speech.isNotEmpty)
      'speech': {for (final e in speech.entries) '${e.key}': e.value},
    if (toast != null) 'toast': toast,
    if (showLastRound) 'showLast': true,
    if (delayMs > 0) 'delay': delayMs,
  };

  static TableView fromJson(Map<String, Object?> j) {
    List<Card> cards(Object? l) => [
      for (final c in (l as List?) ?? const []) Card.parse(c as String),
    ];
    final scores = (j['scores']! as List).cast<int>();
    final pending = (j['pending'] as List?)?.cast<int>();
    return TableView(
      me: j['me']! as int,
      rules: TrucoRules.fromJson((j['rules']! as Map).cast<String, Object?>()),
      phase: GamePhase.values.byName(j['phase']! as String),
      turn: j['turn']! as int,
      dealer: j['dealer']! as int,
      foot: j['foot']! as int,
      handNumber: j['hand#']! as int,
      vira: j['vira'] == null ? null : Card.parse(j['vira']! as String),
      handValue: j['value']! as int,
      stakeLevel: j['level']! as int,
      pending: pending == null
          ? null
          : PendingRaise(
              seat: pending[0],
              toLevel: pending[1],
              refusedBy: pending.length > 2 ? pending[2] : null,
            ),
      decisionTeam: j['decision'] == null
          ? null
          : Team.fromName(j['decision']! as String),
      iron: j['iron'] == true,
      scores: {Team.a: scores[0], Team.b: scores[1]},
      rounds: [
        for (final r in j['rounds']! as List)
          RoundView.fromJson((r as Map).cast<String, Object?>()),
      ],
      currentPlays: [
        for (final p in j['plays']! as List)
          PlayView.fromJson((p as Map).cast<String, Object?>()),
      ],
      hand: cards(j['hand']),
      handCounts: (j['counts']! as List).cast<int>(),
      partnerHand: j['partner'] == null ? null : cards(j['partner']),
      partnerShownForRaise: j['partnerRaise'] == true,
      canCover: j['canCover'] == true,
      canRaise: j['canRaise'] == true,
      mustAnswer: j['mustAnswer'] == true,
      myTurn: j['myTurn'] == true,
      winner: j['winner'] == null
          ? null
          : Team.fromName(j['winner']! as String),
      forfeited: j['wo'] == null ? null : Team.fromName(j['wo']! as String),
      shown: {
        for (final e in ((j['shown'] as Map?) ?? const {}).entries)
          int.parse(e.key as String): cards(e.value),
      },
      revealing: j['reveal'] == true,
      canShow: j['canShow'] == true,
      speech: {
        for (final e in ((j['speech'] as Map?) ?? const {}).entries)
          int.parse(e.key as String): e.value as String,
      },
      toast: j['toast'] as String?,
      showLastRound: j['showLast'] == true,
      delayMs: (j['delay'] as int?) ?? 0,
    );
  }
}

/// Table talk built from the engine's events: what each seat said this hand,
/// the hand result, and whether the last round stays on the table.
class TableTalk {
  final Map<int, String> speech = {};
  ({Team? winner, int points})? _handResult;
  bool _ironStarted = false;
  bool showLastRound = false;

  /// Whether the last event batch ended a round (the next move waits a bit).
  bool roundJustEnded = false;
  bool handJustEnded = false;

  /// Games won by each team in this sitting.
  final Map<Team, int> wins = {Team.a: 0, Team.b: 0};

  void apply(Iterable<GameEvent> events) {
    roundJustEnded = false;
    handJustEnded = false;
    for (final e in events) {
      switch (e) {
        case HandStarted():
          speech.clear();
          _handResult = null;
          showLastRound = false;
          _ironStarted = e.iron;
        case CardPlayed():
          showLastRound = false;
          roundJustEnded = false;
          _ironStarted = false;
        case RaiseCalled():
          speech[e.seat] = '${e.name}!';
        case RaiseAccepted():
          speech[e.seat] = 'Cai dentro!';
        case Folded():
          speech[e.seat] = e.partnerDecides ? 'Eu corro… parceiro?' : 'Corro.';
        case DecisionMade():
          speech[e.seat] = e.play ? 'Vamos jogar!' : 'Corro.';
        case RoundEnded():
          showLastRound = true;
          roundJustEnded = true;
        case HandEnded():
          _handResult = (winner: e.winner, points: e.points);
          handJustEnded = true;
        case GameEnded():
          wins[e.winner] = wins[e.winner]! + 1;
        case Forfeited():
          _handResult = null;
          showLastRound = false;
        case CardsShown():
          break;
      }
    }
  }

  String? toastFor(Team viewer) {
    final r = _handResult;
    if (r != null) {
      if (r.winner == null) return 'Embuchou tudo, ninguém marca.';
      return '${r.winner == viewer ? 'Nós' : 'Eles'} +${r.points}';
    }
    if (_ironStarted) return 'Mão de ferro! Ninguém vê as cartas.';
    return null;
  }

  void resetForNewGame() {
    speech.clear();
    _handResult = null;
    _ironStarted = false;
    showLastRound = false;
  }
}
