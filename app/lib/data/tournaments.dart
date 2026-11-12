import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../domain/game/rules.dart';
import '../domain/game/table_view.dart';
import 'auth_repository.dart';

enum TournamentFormat { knockout, roundRobin }

enum TournamentEntry { pairs, solo, both }

enum TournamentStatus { open, running, finished, cancelled }

extension TournamentFormatLabel on TournamentFormat {
  String get label => switch (this) {
    TournamentFormat.knockout => 'Mata-mata',
    TournamentFormat.roundRobin => 'Todos contra todos',
  };
  String get json =>
      this == TournamentFormat.knockout ? 'knockout' : 'round_robin';

  /// Most teams allowed.
  int get maxTeams => this == TournamentFormat.knockout ? 32 : 8;
}

extension TournamentEntryLabel on TournamentEntry {
  String get label => switch (this) {
    TournamentEntry.pairs => 'Duplas',
    TournamentEntry.solo => 'Individual',
    TournamentEntry.both => 'As duas',
  };
}

/// "Partida única", "Melhor de 3".
String bestOfLabel(int n) => n <= 1 ? 'Partida única' : 'Melhor de $n';

class Tournament {
  const Tournament({
    required this.id,
    required this.code,
    required this.name,
    required this.ownerId,
    required this.groupId,
    required this.format,
    required this.entry,
    required this.rules,
    required this.roundDays,
    required this.maxTeams,
    required this.bestOf,
    required this.finalBestOf,
    required this.status,
    this.champion,
    this.groupName,
  });

  final String id;
  final String code;
  final String name;
  final String ownerId;
  final String? groupId;
  final String? groupName;
  final TournamentFormat format;
  final TournamentEntry entry;
  final TrucoRules rules;

  /// Days to play each round (live matches).
  final int roundDays;
  final int maxTeams;
  final int bestOf;
  final int finalBestOf;
  final TournamentStatus status;
  final String? champion;

  bool get slow => rules.isSlow;

  factory Tournament.fromRow(Map<String, dynamic> r) => Tournament(
    id: r['id'] as String,
    code: r['code'] as String,
    name: r['name'] as String,
    ownerId: r['owner_id'] as String,
    groupId: r['group_id'] as String?,
    groupName: (r['groups'] as Map?)?['name'] as String?,
    format: r['format'] == 'round_robin'
        ? TournamentFormat.roundRobin
        : TournamentFormat.knockout,
    entry:
        TournamentEntry.values.asNameMap()[r['entry']] ?? TournamentEntry.pairs,
    rules: TrucoRules.fromJson(
      Map<String, Object?>.from((r['rules'] as Map?) ?? const {}),
    ),
    roundDays: (r['round_days'] as int?) ?? 2,
    maxTeams: (r['max_teams'] as int?) ?? 8,
    bestOf: (r['best_of'] as int?) ?? 1,
    finalBestOf: (r['final_best_of'] as int?) ?? 1,
    status:
        TournamentStatus.values.asNameMap()[r['status']] ??
        TournamentStatus.open,
    champion: r['champion'] as String?,
  );

  /// "Mata-mata · duplas · melhor de 3 (final melhor de 5)".
  String get summary => [
    format.label,
    switch (entry) {
      TournamentEntry.pairs => 'inscrição por dupla',
      TournamentEntry.solo => 'inscrição individual',
      TournamentEntry.both => 'dupla ou individual',
    },
    bestOfLabel(bestOf).toLowerCase() +
        (format == TournamentFormat.knockout && finalBestOf != bestOf
            ? ' (final: ${bestOfLabel(finalBestOf).toLowerCase()})'
            : ''),
    slow
        ? 'partida lenta'
        : '$roundDays ${roundDays == 1 ? 'dia' : 'dias'} por rodada',
  ].join(' · ');
}

class TournamentTeam {
  const TournamentTeam({
    required this.id,
    required this.playerA,
    required this.nameA,
    this.playerB,
    this.nameB = '',
    this.solo = false,
    this.seed,
  });

  final String id;
  final String playerA;
  final String nameA;
  final String? playerB;
  final String nameB;
  final bool solo;
  final int? seed;

  bool get complete => playerB != null;
  bool has(String? userId) =>
      userId != null && (playerA == userId || playerB == userId);
  String get label => complete ? '$nameA e $nameB' : nameA;

  factory TournamentTeam.fromRow(Map<String, dynamic> r) => TournamentTeam(
    id: r['id'] as String,
    playerA: r['player_a'] as String,
    nameA: (r['name_a'] as String?) ?? '',
    playerB: r['player_b'] as String?,
    nameB: (r['name_b'] as String?) ?? '',
    solo: r['solo'] == true,
    seed: r['seed'] as int?,
  );
}

class TournamentMatch {
  const TournamentMatch({
    required this.id,
    required this.round,
    required this.slot,
    required this.teamA,
    required this.teamB,
    required this.status,
    required this.bestOf,
    this.roomCode,
    this.roomId,
    this.deadline,
    this.winner,
    this.gamesA = 0,
    this.gamesB = 0,
    this.scoreA,
    this.scoreB,
    this.walkover = false,
  });

  final String id;
  final int round;
  final int slot;
  final String? teamA;

  /// Null: a bye.
  final String? teamB;
  final String status;
  final int bestOf;
  final String? roomCode;
  final String? roomId;
  final DateTime? deadline;
  final String? winner;
  final int gamesA;
  final int gamesB;
  final int? scoreA;
  final int? scoreB;
  final bool walkover;

  bool get done => status == 'done';
  bool get bye => teamB == null;

  factory TournamentMatch.fromRow(Map<String, dynamic> r) => TournamentMatch(
    id: r['id'] as String,
    round: r['round'] as int,
    slot: r['slot'] as int,
    teamA: r['team_a'] as String?,
    teamB: r['team_b'] as String?,
    status: (r['status'] as String?) ?? 'pending',
    bestOf: (r['best_of'] as int?) ?? 1,
    roomCode: r['room_code'] as String?,
    roomId: r['room_id'] as String?,
    deadline: DateTime.tryParse((r['deadline'] as String?) ?? '')?.toLocal(),
    winner: r['winner'] as String?,
    gamesA: (r['games_a'] as int?) ?? 0,
    gamesB: (r['games_b'] as int?) ?? 0,
    scoreA: r['score_a'] as int?,
    scoreB: r['score_b'] as int?,
    walkover: r['walkover'] == true,
  );
}

/// One row of a round robin table.
class StandingRow {
  StandingRow(this.team);
  final TournamentTeam team;
  int played = 0;
  int wins = 0;
  int pointsFor = 0;
  int pointsAgainst = 0;
  int get losses => played - wins;
  int get balance => pointsFor - pointsAgainst;
}

/// Wins, then tento balance, then tentos made (as the server decides the
/// champion).
List<StandingRow> standingsOf(
  List<TournamentTeam> teams,
  List<TournamentMatch> matches,
) {
  final rows = {for (final t in teams) t.id: StandingRow(t)};
  for (final m in matches) {
    if (!m.done || m.bye) continue;
    final a = rows[m.teamA];
    final b = rows[m.teamB];
    if (a == null || b == null) continue;
    a.played++;
    b.played++;
    if (m.winner == m.teamA) a.wins++;
    if (m.winner == m.teamB) b.wins++;
    a.pointsFor += m.scoreA ?? 0;
    a.pointsAgainst += m.scoreB ?? 0;
    b.pointsFor += m.scoreB ?? 0;
    b.pointsAgainst += m.scoreA ?? 0;
  }
  return rows.values.toList()..sort(
    (x, y) => y.wins != x.wins
        ? y.wins - x.wins
        : y.balance != x.balance
        ? y.balance - x.balance
        : y.pointsFor - x.pointsFor,
  );
}

class TournamentDetail {
  const TournamentDetail({
    required this.tournament,
    required this.teams,
    required this.matches,
  });
  final Tournament tournament;
  final List<TournamentTeam> teams;
  final List<TournamentMatch> matches;

  TournamentTeam? team(String? id) =>
      teams.where((t) => t.id == id).firstOrNull;
  TournamentTeam? teamOf(String? userId) =>
      teams.where((t) => t.has(userId)).firstOrNull;

  /// People signed up so far.
  int get people => teams.fold(0, (n, t) => n + (t.complete ? 2 : 1));

  /// The next match [userId] has to play, if any.
  TournamentMatch? nextMatchOf(String? userId) {
    final mine = teamOf(userId);
    if (mine == null) return null;
    return matches
        .where(
          (m) =>
              !m.done && !m.bye && (m.teamA == mine.id || m.teamB == mine.id),
        )
        .firstOrNull;
  }
}

/// What a spectator sees of a match.
class SpectatedMatch {
  const SpectatedMatch({
    required this.status,
    required this.version,
    required this.names,
    required this.wins,
    this.view,
  });
  final String status;
  final int version;
  final List<String> names;
  final (int, int) wins;

  /// Null before the first game starts.
  final TableView? view;
}

/// Why the server refused (see supabase/functions/game/tournament.ts).
class TournamentError implements Exception {
  const TournamentError(this.code);
  final String code;

  String get message => switch (code) {
    'premium_required' => 'Criar torneios faz parte do Truco Premium.',
    'account_required' => 'Entre com seu e-mail para participar de torneios.',
    'bad_name' => 'O nome precisa ter pelo menos 3 letras.',
    'not_member' => 'Esse torneio é só para quem é do grupo.',
    'registration_closed' => 'As inscrições já foram encerradas.',
    'already_registered' => 'Você já está inscrito.',
    'tournament_full' => 'O torneio já está cheio.',
    'team_full' => 'Essa dupla já está completa.',
    'bad_team_code' => 'Nenhuma dupla deste torneio com esse código.',
    'pairs_only' => 'Neste torneio a inscrição é por dupla.',
    'solo_only' => 'Neste torneio a inscrição é individual.',
    'not_owner' => 'Só quem criou o torneio pode fazer isso.',
    'too_few_teams' =>
      'São precisas pelo menos 3 duplas completas para começar.',
    'already_started' => 'O torneio já começou.',
    'tournament_not_found' => 'Torneio não encontrado.',
    'not_in_tournament' => 'Só quem está no torneio pode assistir aos jogos.',
    'room_not_found' => 'Esse jogo já acabou.',
    _ => 'O servidor recusou ($code). Tente de novo.',
  };

  @override
  String toString() => 'TournamentError($code)';
}

class TournamentsRepository {
  TournamentsRepository(this._client);
  final SupabaseClient _client;

  String? get userId => _client.auth.currentUser?.id;

  static const _columns = '*, groups(name)';

  Future<Map<String, dynamic>> _call(
    String action,
    Map<String, Object?> body,
  ) async {
    try {
      final res = await _client.functions.invoke(
        'game',
        body: {'action': 'tournament.$action', ...body},
      );
      final data = res.data;
      return data is Map ? Map<String, dynamic>.from(data) : const {};
    } on FunctionException catch (e) {
      final details = e.details;
      if (details is Map && details['error'] is String) {
        throw TournamentError(details['error'] as String);
      }
      rethrow;
    }
  }

  /// Tournaments open for sign-up or running that this person can see, and
  /// every one they are in or created.
  Future<({List<Tournament> mine, List<Tournament> open})> list() async {
    final me = userId;
    final rows = await _client
        .from('tournaments')
        .select(_columns)
        .order('created_at', ascending: false)
        .limit(100);
    final teams = me == null
        ? const <dynamic>[]
        : await _client
              .from('tournament_teams')
              .select('tournament_id')
              .or('player_a.eq.$me,player_b.eq.$me');
    final joined = {for (final t in teams) t['tournament_id'] as String};
    final all = [for (final r in rows) Tournament.fromRow(r)];
    final mine = all
        .where((t) => t.ownerId == me || joined.contains(t.id))
        .where((t) => t.status != TournamentStatus.cancelled)
        .toList();
    final open = all
        .where((t) => t.status == TournamentStatus.open && !mine.contains(t))
        .toList();
    return (mine: mine, open: open);
  }

  Future<TournamentDetail> detail(String id) async {
    final results = await Future.wait<Object?>([
      _client.from('tournaments').select(_columns).eq('id', id).maybeSingle(),
      _client
          .from('tournament_teams')
          .select()
          .eq('tournament_id', id)
          .order('created_at'),
      _client
          .from('tournament_matches')
          .select()
          .eq('tournament_id', id)
          .order('round')
          .order('slot'),
    ]);
    final row = results[0] as Map<String, dynamic>?;
    if (row == null) throw const TournamentError('tournament_not_found');
    final teams = [
      for (final t in results[1] as List)
        TournamentTeam.fromRow(Map<String, dynamic>.from(t as Map)),
    ];
    if (teams.any((t) => t.seed != null)) {
      teams.sort((a, b) => (a.seed ?? 99).compareTo(b.seed ?? 99));
    }
    return TournamentDetail(
      tournament: Tournament.fromRow(row),
      teams: teams,
      matches: [
        for (final m in results[2] as List)
          TournamentMatch.fromRow(Map<String, dynamic>.from(m as Map)),
      ],
    );
  }

  /// A tournament match as a spectator sees it (see game.ts `watch`).
  Future<SpectatedMatch> spectate(String roomId) async {
    final r = await _call2('watch', {'roomId': roomId});
    final frame = r['frame'];
    final names = List.filled(4, '…');
    for (final s in (r['seats'] as List?) ?? const []) {
      names[s['seat'] as int] = (s['name'] as String?) ?? '…';
    }
    final bots = (r['bots'] as List?) ?? const [];
    for (var i = 0; i < 4 && i < bots.length; i++) {
      if (bots[i] != null) {
        names[i] = '${names[i] == '…' ? 'Computador' : names[i]} (IA)';
      }
    }
    final wins = ((r['wins'] as List?) ?? const [0, 0]).cast<int>();
    return SpectatedMatch(
      status: (r['status'] as String?) ?? 'lobby',
      version: (r['version'] as int?) ?? 0,
      names: names,
      wins: (wins[0], wins[1]),
      view: frame is Map
          ? TableView.fromJson(Map<String, Object?>.from(frame))
          : null,
    );
  }

  /// A plain "game" action (not tournament.*).
  Future<Map<String, dynamic>> _call2(
    String action,
    Map<String, Object?> body,
  ) async {
    try {
      final res = await _client.functions.invoke(
        'game',
        body: {'action': action, ...body},
      );
      final data = res.data;
      return data is Map ? Map<String, dynamic>.from(data) : const {};
    } on FunctionException catch (e) {
      final details = e.details;
      if (details is Map && details['error'] is String) {
        throw TournamentError(details['error'] as String);
      }
      rethrow;
    }
  }

  /// The name of the tournament a match belongs to.
  Future<String?> nameOfMatch(String matchId) async {
    final row = await _client
        .from('tournament_matches')
        .select('tournaments(name)')
        .eq('id', matchId)
        .maybeSingle();
    return (row?['tournaments'] as Map?)?['name'] as String?;
  }

  /// The id of the tournament with [code], if this person can see it.
  Future<String?> idByCode(String code) async {
    final row = await _client
        .from('tournaments')
        .select('id')
        .eq('code', code.trim().toUpperCase())
        .maybeSingle();
    return row?['id'] as String?;
  }

  Future<String> create({
    required String name,
    required String? groupId,
    required TournamentFormat format,
    required TournamentEntry entry,
    required TrucoRules rules,
    required int roundDays,
    required int maxTeams,
    required int bestOf,
    required int finalBestOf,
  }) async {
    final r = await _call('create', {
      'name': name,
      'groupId': groupId,
      'format': format.json,
      'entry': entry.name,
      'rules': rules.toJson(),
      'roundDays': roundDays,
      'maxTeams': maxTeams,
      'bestOf': bestOf,
      'finalBestOf': finalBestOf,
    });
    return r['id'] as String;
  }

  /// [as]: "solo", "pair" (returns the pair's code for the partner) or
  /// "join" (with that [code]).
  Future<String?> register(String id, String as, {String? code}) async =>
      (await _call('register', {
            'tournamentId': id,
            'as': as,
            'code': code,
          }))['code']
          as String?;

  /// The code of the pair [teamId] signed up (only its creator reads it).
  Future<String?> pairCode(String teamId) async {
    final row = await _client
        .from('tournament_team_codes')
        .select('code')
        .eq('team_id', teamId)
        .maybeSingle();
    return row?['code'] as String?;
  }

  Future<void> unregister(String id) =>
      _call('unregister', {'tournamentId': id});

  Future<void> start(String id) => _call('start', {'tournamentId': id});

  Future<void> cancel(String id) => _call('cancel', {'tournamentId': id});
}

final tournamentsRepositoryProvider = Provider<TournamentsRepository?>((ref) {
  final client = ref.watch(supabaseClientProvider);
  return client == null ? null : TournamentsRepository(client);
});

/// The signed-in person's id, for "mine" marks on tournament screens.
final tournamentUserIdProvider = Provider<String?>(
  (ref) => ref.watch(tournamentsRepositoryProvider)?.userId,
);

/// The code of a pair waiting for the partner (for whoever signed it up).
final pairCodeProvider = FutureProvider.autoDispose.family<String?, String>(
  (ref, teamId) async =>
      ref.watch(tournamentsRepositoryProvider)?.pairCode(teamId),
);

final tournamentsProvider =
    FutureProvider.autoDispose<
      ({List<Tournament> mine, List<Tournament> open})
    >((ref) async {
      final user = ref.watch(currentUserProvider).value;
      final repo = ref.watch(tournamentsRepositoryProvider);
      if (repo == null || user == null || user.isGuest) {
        return (mine: const <Tournament>[], open: const <Tournament>[]);
      }
      return repo.list();
    });

final tournamentProvider = FutureProvider.autoDispose
    .family<TournamentDetail, String>(
      (ref, id) => ref.watch(tournamentsRepositoryProvider)!.detail(id),
    );
