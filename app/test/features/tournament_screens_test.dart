import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:truco/data/groups_repository.dart';
import 'package:truco/data/tournaments.dart';
import 'package:truco/domain/game/rules.dart';
import 'package:truco/features/tournaments/create_tournament_screen.dart';
import 'package:truco/features/tournaments/tournament_screen.dart';

Tournament _t(TournamentStatus status, TournamentFormat format) => Tournament(
  id: format.name,
  code: 'ABC234',
  name: 'Copa do sofá',
  ownerId: 'me',
  groupId: null,
  format: format,
  entry: TournamentEntry.both,
  rules: TrucoRules.paulista,
  roundDays: 2,
  maxTeams: 8,
  bestOf: 3,
  finalBestOf: 5,
  status: status,
);

const _teams = [
  TournamentTeam(
    id: 'a',
    playerA: 'me',
    nameA: 'Eu',
    playerB: 'p',
    nameB: 'Par',
  ),
  TournamentTeam(
    id: 'b',
    playerA: 'x',
    nameA: 'Xis',
    playerB: 'y',
    nameB: 'Ípsilon',
  ),
  TournamentTeam(id: 'c', playerA: 'z', nameA: 'Zé', solo: true),
];

Future<void> _pump(
  WidgetTester tester,
  Widget screen,
  TournamentDetail d,
) async {
  tester.view.physicalSize = const Size(400, 900);
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(
    ProviderScope(
      overrides: [
        tournamentUserIdProvider.overrideWithValue('me'),
        tournamentProvider(d.tournament.id).overrideWith((ref) async => d),
        myGroupsProvider.overrideWith((ref) async => const <Group>[]),
      ],
      child: MaterialApp(home: screen),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('create screen lays out, also for slow games', (tester) async {
    await _pump(
      tester,
      const CreateTournamentScreen(),
      TournamentDetail(
        tournament: _t(TournamentStatus.open, TournamentFormat.knockout),
        teams: const [],
        matches: const [],
      ),
    );
    expect(find.text('A final'), findsOneWidget);
    await tester.scrollUntilVisible(
      find.text('Partida lenta'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.ensureVisible(find.text('Partida lenta'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Partida lenta'));
    await tester.pumpAndSettle();
    expect(find.text('Prazo por jogada'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('open tournament: sign-up and the owner starts', (tester) async {
    await _pump(
      tester,
      const TournamentScreen(id: 'knockout'),
      TournamentDetail(
        tournament: _t(TournamentStatus.open, TournamentFormat.knockout),
        teams: _teams,
        matches: const [],
      ),
    );
    expect(find.text('Você está inscrito com Par'), findsOneWidget);
    await tester.scrollUntilVisible(
      find.text('Começar o torneio'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    expect(find.textContaining('Inscritos (5 pessoas)'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('running knockout and round robin show the games', (
    tester,
  ) async {
    const matches = [
      TournamentMatch(
        id: '1',
        round: 1,
        slot: 0,
        teamA: 'a',
        teamB: 'b',
        status: 'playing',
        bestOf: 3,
        roomCode: 'ROOM23',
        gamesA: 1,
      ),
      TournamentMatch(
        id: '2',
        round: 1,
        slot: 1,
        teamA: 'c',
        teamB: null,
        status: 'done',
        bestOf: 3,
        winner: 'c',
      ),
    ];
    await _pump(
      tester,
      const TournamentScreen(id: 'knockout'),
      TournamentDetail(
        tournament: _t(TournamentStatus.running, TournamentFormat.knockout),
        teams: _teams,
        matches: matches,
      ),
    );
    expect(find.text('Contra Xis e Ípsilon'), findsOneWidget);
    expect(find.text('Entrar na sala'), findsOneWidget);
    await tester.scrollUntilVisible(
      find.text('Semifinal'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    expect(tester.takeException(), isNull);
  });

  testWidgets('finished round robin shows the table', (tester) async {
    const matches = [
      TournamentMatch(
        id: '1',
        round: 1,
        slot: 0,
        teamA: 'a',
        teamB: 'b',
        status: 'done',
        bestOf: 1,
        winner: 'a',
        scoreA: 12,
        scoreB: 4,
      ),
    ];
    await _pump(
      tester,
      const TournamentScreen(id: 'roundRobin'),
      TournamentDetail(
        tournament: _t(TournamentStatus.finished, TournamentFormat.roundRobin),
        teams: _teams,
        matches: matches,
      ),
    );
    expect(find.text('Classificação'), findsOneWidget);
    expect(find.text('1. Eu e Par'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
