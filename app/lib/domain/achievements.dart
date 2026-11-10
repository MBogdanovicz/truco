/// Achievements unlocked by the server from confirmed ranked games.
/// Ids match supabase/migrations/20261110000004_achievements.sql.
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
  shutout('shutout', 'Uh! Doze a zero!', 'Vença uma partida por 12 x 0.'),
  comeback(
    'comeback',
    'Virada histórica',
    'Vença depois de estar perdendo por 8 pontos ou mais.',
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
  ),
  groupGame(
    'group_game',
    'Turma formada',
    'Jogue uma partida rankeada valendo para um grupo.',
  );

  const Achievement(this.id, this.title, this.description);

  final String id;
  final String title;
  final String description;

  static Achievement? byId(String id) {
    for (final a in values) {
      if (a.id == id) return a;
    }
    return null;
  }
}
