import '../scorekeeper/team.dart';
import 'cards.dart';
import 'rules.dart';
import 'truco_game.dart';

/// Achievement ids the game itself shows (see lib/domain/achievements.dart
/// and supabase/migrations/20261111030000_game_achievements.sql). The
/// server unlocks them only when the game was ranked.
abstract final class GameFeat {
  /// Won a hand with a truco accepted at 12.
  static const truco12 = 'game_truco_12';

  /// Ran from a raise and still won the game.
  static const ranAndWon = 'game_ran_won';

  /// Won a "mão de ferro".
  static const ironHand = 'game_iron_hand';

  /// Won a game where nobody called truco ("jogo de comadre").
  static const comadre = 'game_comadre';

  /// Won a hand playing the ace of spades in its third round.
  static const aceRiver = 'game_ace_river';

  /// Won a hand after being dealt three sixes.
  static const beast = 'game_666';

  /// Won a hand because the other team ran from this team's "seis".
  static const seisBurro = 'game_seis_burro';

  /// Won a hand after being dealt two given manilhas.
  static const casalMaior = 'game_casal_maior'; // gato + copas
  static const casalMenor = 'game_casal_menor'; // salmora + espadilha
  static const casalPreto = 'game_casal_preto'; // espadilha + gato
  static const casalVermelho = 'game_casal_vermelho'; // salmora + copas

  static const all = {
    truco12,
    ranAndWon,
    ironHand,
    comadre,
    aceRiver,
    beast,
    seisBurro,
    casalMaior,
    casalMenor,
    casalPreto,
    casalVermelho,
  };
}

/// Manilha suits (by strength 10..13) for each "casal".
const _casais = {
  GameFeat.casalMaior: {Suit.paus, Suit.copas},
  GameFeat.casalMenor: {Suit.ouros, Suit.espadas},
  GameFeat.casalPreto: {Suit.espadas, Suit.paus},
  GameFeat.casalVermelho: {Suit.ouros, Suit.copas},
};

const _aceOfSpades = Card(Rank.ace, Suit.espadas);

/// What each seat did in this game that counts for an achievement.
Map<int, Set<String>> gameFeats(List<GameEvent> events, TrucoRules rules) {
  final feats = {for (var s = 0; s < 4; s++) s: <String>{}};
  void team(Team t, String feat) {
    for (var s = 0; s < 4; s++) {
      if (teamOfSeat(s) == t) feats[s]!.add(feat);
    }
  }

  var anyRaise = false;
  final ran = <Team>{};
  HandStarted? hand;
  var round = 1;
  var lastRaise = 0;
  var folded = false;
  var ranFromSeis = false;
  final lastRound = <int, Card>{};

  for (final e in events) {
    switch (e) {
      case HandStarted():
        hand = e;
        round = 1;
        lastRaise = 0;
        folded = false;
        ranFromSeis = false;
        lastRound.clear();
      case RaiseCalled():
        anyRaise = true;
        lastRaise = e.value;
      case Folded():
        folded = true;
        ran.add(teamOfSeat(e.seat));
        ranFromSeis = lastRaise == 6;
      case CardPlayed():
        if (round == 3 && !e.covered) lastRound[e.seat] = e.card;
      case RoundEnded():
        round = e.round + 1;
      case HandEnded():
        final h = hand;
        final w = e.winner;
        if (h == null || w == null) continue;
        if (ranFromSeis) team(w, GameFeat.seisBurro);
        if (!folded && e.points == 12) team(w, GameFeat.truco12);
        if (h.iron) team(w, GameFeat.ironHand);
        for (var s = 0; s < 4; s++) {
          if (teamOfSeat(s) != w) continue;
          if (!folded && lastRound[s] == _aceOfSpades) {
            feats[s]!.add(GameFeat.aceRiver);
          }
          if (h.dealt.length != 4) continue;
          final dealt = h.dealt[s];
          if (dealt.length == 3 && dealt.every((c) => c.rank == Rank.six)) {
            feats[s]!.add(GameFeat.beast);
          }
          final manilhas = {
            for (final c in dealt)
              if (rules.isManilha(c, vira: h.vira))
                Suit.values[rules.strength(c, vira: h.vira) - 10],
          };
          for (final MapEntry(:key, :value) in _casais.entries) {
            if (manilhas.containsAll(value)) feats[s]!.add(key);
          }
        }
      case GameEnded():
        if (!anyRaise) team(e.winner, GameFeat.comadre);
        if (ran.contains(e.winner)) team(e.winner, GameFeat.ranAndWon);
      case DecisionMade():
      case RaiseAccepted():
    }
  }
  return feats;
}
