/// Achievements unlocked by the server from confirmed ranked games.
/// Ids match supabase/migrations/20261110000004_achievements.sql and
/// 20261111030000_game_achievements.sql.
enum Achievement {
  firstGame(
    'first_game',
    'Primeira mão',
    'Termine sua primeira partida rankeada.',
  ),
  firstWin('first_win', 'Primeira vitória', 'Vença uma partida rankeada.'),
  veteran10('veteran_10', 'Veterano', 'Jogue 10 partidas rankeadas.'),
  veteran50('veteran_50', 'Veterano de mesa', 'Jogue 50 partidas rankeadas.'),
  veteran100('veteran_100', 'Lenda do truco', 'Jogue 100 partidas rankeadas.'),
  shutout(
    'shutout',
    'Uh! Doze a zero!',
    'Vença uma partida por 12 x 0.',
    hidden: true,
  ),
  comeback(
    'comeback',
    'Virada histórica',
    'Vença depois de estar perdendo por 8 pontos ou mais.',
    hidden: true,
  ),
  streak5('streak_5', 'Embalado', 'Vença 5 partidas rankeadas seguidas.'),
  loyalPartner(
    'loyal_partner',
    'Parceiro fiel',
    'Jogue 10 partidas rankeadas com o mesmo parceiro.',
  ),
  revenge(
    'revenge',
    'Revanche',
    'Vença a dupla que ganhou de você na partida anterior.',
    hidden: true,
  ),
  groupGame(
    'group_game',
    'Turma formada',
    'Jogue uma partida rankeada valendo para um grupo.',
  ),

  // The truco game (ranked games only; see lib/domain/game/game_feats.dart).
  gameFirstWin(
    'game_first_win',
    'Primeira vitória no jogo',
    'Vença uma partida rankeada de truco no app.',
  ),
  gameWins10(
    'game_wins_10',
    'Truqueiro',
    'Vença 10 partidas rankeadas de truco no app.',
  ),
  gameShutout(
    'game_shutout',
    'Debaixo da mesa',
    'Vença uma partida de truco no app por 12 x 0.',
    hidden: true,
  ),
  gameTruco12(
    'game_truco_12',
    'Doze!',
    'Ganhe uma mão com o truco aceito valendo 12.',
    hidden: true,
  ),
  gameRanWon(
    'game_ran_won',
    'Correu e ganhou',
    'Corra de um truco e ainda vença a partida.',
  ),
  gameIronHand('game_iron_hand', 'Mão de ferro', 'Ganhe uma mão de ferro.'),
  gameComadre(
    'game_comadre',
    'Jogo de comadre',
    'Vença uma partida sem ninguém pedir ou aceitar truco.',
    hidden: true,
  ),
  gameAceRiver(
    'game_ace_river',
    'Ace on the river',
    'Ganhe uma mão jogando o ás de espadas na última rodada.',
  ),
  game666(
    'game_666',
    'Besta enjaulada',
    'Ganhe uma mão em que você recebeu três 6.',
    hidden: true,
  ),
  gameSeisBurro(
    'game_seis_burro',
    'Seis! Burro!',
    'Ganhe uma mão com o adversário correndo do seu seis.',
    hidden: true,
  ),
  gameCasalMaior(
    'game_casal_maior',
    'Casal maior',
    'Ganhe uma mão em que você recebeu o gato e a copas.',
  ),
  gameCasalMenor(
    'game_casal_menor',
    'Casal menor',
    'Ganhe uma mão em que você recebeu a salmora e a espadilha.',
  ),
  gameCasalPreto(
    'game_casal_preto',
    'Casal preto',
    'Ganhe uma mão em que você recebeu a espadilha e o gato.',
  ),
  gameCasalVermelho(
    'game_casal_vermelho',
    'Casal vermelho',
    'Ganhe uma mão em que você recebeu a salmora e a copas.',
  );

  const Achievement(
    this.id,
    this.title,
    this.description, {
    this.hidden = false,
  });

  final String id;
  final String title;
  final String description;

  /// Secret until unlocked, like in Google Play Games: a surprise.
  final bool hidden;

  /// From the app's truco game (not the scorekeeper).
  bool get game => id.startsWith('game_');

  static Achievement? byId(String id) {
    for (final a in values) {
      if (a.id == id) return a;
    }
    return null;
  }
}
