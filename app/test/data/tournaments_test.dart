import 'package:flutter_test/flutter_test.dart';
import 'package:truco/data/tournaments.dart';

TournamentTeam team(String id) =>
    TournamentTeam(id: id, playerA: '${id}1', nameA: id, playerB: '${id}2');

TournamentMatch match(String a, String b, String? winner, int sa, int sb) =>
    TournamentMatch(
      id: '$a$b',
      round: 1,
      slot: 0,
      teamA: a,
      teamB: b,
      status: 'done',
      bestOf: 1,
      winner: winner,
      scoreA: sa,
      scoreB: sb,
    );

void main() {
  test('round robin table: wins, then balance, then tentos', () {
    final teams = [team('a'), team('b'), team('c')];
    final table = standingsOf(teams, [
      match('a', 'b', 'a', 12, 10),
      match('b', 'c', 'b', 12, 2),
      match('c', 'a', 'c', 12, 0),
    ]);
    // One win each: b +8, c -2, a -10.
    expect([for (final r in table) r.team.id], ['b', 'c', 'a']);
    expect(table.first.balance, 8);
  });

  test('summary names the series and the final', () {
    final t = Tournament.fromRow({
      'id': 'x',
      'code': 'ABC234',
      'name': 'Copa',
      'owner_id': 'o',
      'format': 'knockout',
      'entry': 'both',
      'rules': {'lento': 2},
      'best_of': 3,
      'final_best_of': 5,
      'status': 'open',
    });
    expect(t.slow, isTrue);
    expect(
      t.summary,
      'Mata-mata · dupla ou individual · melhor de 3 (final: melhor de 5) · '
      'partida lenta',
    );
  });

  test('the next match is the open one of the earliest round', () {
    TournamentMatch m(int round, String a, String b, {String? code}) =>
        TournamentMatch(
          id: '$round',
          round: round,
          slot: 0,
          teamA: a,
          teamB: b,
          status: 'pending',
          bestOf: 1,
          roomCode: code,
        );
    final d = TournamentDetail(
      tournament: Tournament.fromRow({
        'id': 'x',
        'code': 'ABC234',
        'name': 'Rodízio',
        'owner_id': 'o',
        'format': 'round_robin',
        'entry': 'pairs',
        'rules': <String, Object?>{},
        'status': 'running',
      }),
      teams: [team('a'), team('b'), team('c')],
      // Listed from the last round, as they once came from the server.
      matches: [m(3, 'c', 'b'), m(2, 'a', 'c'), m(1, 'b', 'a', code: 'R1')],
    );
    expect(d.nextMatchOf('a1')!.round, 1);
  });
}
