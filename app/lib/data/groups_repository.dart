import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'auth_repository.dart';

enum GroupVisibility { public, private }

enum GroupRole { owner, admin, member }

class Group {
  const Group({
    required this.id,
    required this.name,
    required this.description,
    required this.visibility,
    required this.joinCode,
    required this.ownerId,
    this.myRole,
    this.memberCount,
  });

  final String id;
  final String name;
  final String description;
  final GroupVisibility visibility;

  /// Only readable by members (and public-group visitors).
  final String joinCode;
  final String ownerId;

  /// Null when the current user is not a member.
  final GroupRole? myRole;
  final int? memberCount;

  bool get canManage => myRole == GroupRole.owner || myRole == GroupRole.admin;

  factory Group.fromRow(Map<String, dynamic> row, {GroupRole? myRole}) {
    final members = row['group_members'];
    return Group(
      id: row['id'] as String,
      name: row['name'] as String,
      description: (row['description'] as String?) ?? '',
      visibility: GroupVisibility.values.byName(row['visibility'] as String),
      joinCode: row['join_code'] as String,
      ownerId: row['owner_id'] as String,
      myRole: myRole,
      memberCount: members is List && members.isNotEmpty
          ? members.first['count'] as int?
          : null,
    );
  }
}

class GroupMember {
  const GroupMember({
    required this.userId,
    required this.name,
    required this.role,
  });
  final String userId;
  final String name;
  final GroupRole role;
}

enum LeaderboardSubject { player, duo }

class LeaderboardEntry {
  const LeaderboardEntry({
    required this.key,
    required this.names,
    required this.playerIds,
    required this.elo,
    required this.games,
    required this.wins,
    required this.losses,
    required this.pointsFor,
    required this.pointsAgainst,
  });

  final String key;
  final List<String> names;
  final List<String> playerIds;
  final double elo;
  final int games;
  final int wins;
  final int losses;
  final int pointsFor;
  final int pointsAgainst;

  double get winRate => games == 0 ? 0 : wins / games;

  /// Too few games for the rating to mean much yet.
  bool get isProvisional => games < 5;

  factory LeaderboardEntry.fromRow(Map<String, dynamic> row) =>
      LeaderboardEntry(
        key: row['subject_key'] as String,
        names: [
          (row['name_a'] as String?) ?? 'Jogador',
          if (row['player_b'] != null) (row['name_b'] as String?) ?? 'Jogador',
        ],
        playerIds: [
          row['player_a'] as String,
          if (row['player_b'] != null) row['player_b'] as String,
        ],
        elo: (row['elo'] as num).toDouble(),
        games: row['games'] as int,
        wins: row['wins'] as int,
        losses: row['losses'] as int,
        pointsFor: row['points_for'] as int,
        pointsAgainst: row['points_against'] as int,
      );
}

class GroupLimitReached implements Exception {}

class GroupNotFound implements Exception {}

/// Groups, memberships and leaderboards in Supabase.
class GroupsRepository {
  GroupsRepository(this._client);

  final SupabaseClient _client;

  static const globalScopeId = '00000000-0000-0000-0000-000000000000';

  String get _uid => _client.auth.currentUser!.id;

  Future<List<Group>> myGroups() async {
    final rows = await _client
        .from('group_members')
        .select('role, groups(*, group_members(count))')
        .eq('user_id', _uid)
        .order('joined_at');
    return [
      for (final r in rows)
        if (r['groups'] != null)
          Group.fromRow(
            Map<String, dynamic>.from(r['groups'] as Map),
            myRole: GroupRole.values.byName(r['role'] as String),
          ),
    ];
  }

  Future<List<Group>> publicGroups({String query = ''}) async {
    var q = _client
        .from('groups')
        .select('*, group_members(count)')
        .eq('visibility', 'public');
    if (query.trim().isNotEmpty) q = q.ilike('name', '%${query.trim()}%');
    final rows = await q.order('created_at', ascending: false).limit(50);
    return [for (final r in rows) Group.fromRow(r)];
  }

  Future<Group> group(String id) async {
    final row = await _client
        .from('groups')
        .select('*, group_members(count)')
        .eq('id', id)
        .maybeSingle();
    if (row == null) throw GroupNotFound();
    final role = await _client
        .from('group_members')
        .select('role')
        .eq('group_id', id)
        .eq('user_id', _uid)
        .maybeSingle();
    return Group.fromRow(
      row,
      myRole: role == null
          ? null
          : GroupRole.values.byName(role['role'] as String),
    );
  }

  Future<List<GroupMember>> members(String groupId) async {
    final rows = await _client
        .from('group_members')
        .select('user_id, role, profiles(display_name)')
        .eq('group_id', groupId)
        .order('joined_at');
    return [
      for (final r in rows)
        GroupMember(
          userId: r['user_id'] as String,
          name:
              ((r['profiles'] as Map?)?['display_name'] as String?) ??
              'Jogador',
          role: GroupRole.values.byName(r['role'] as String),
        ),
    ];
  }

  Future<Group> create({
    required String name,
    String description = '',
    required GroupVisibility visibility,
  }) async {
    try {
      final row = await _client.rpc(
        'create_group',
        params: {
          'p_name': name,
          'p_description': description,
          'p_visibility': visibility.name,
        },
      );
      return Group.fromRow(
        Map<String, dynamic>.from(row as Map),
        myRole: GroupRole.owner,
      );
    } on PostgrestException catch (e) {
      if (e.message.contains('group_limit_reached')) throw GroupLimitReached();
      rethrow;
    }
  }

  /// Joins by invite code, or a public group by id.
  Future<Group> join({String? code, String? groupId}) async {
    try {
      final row = await _client.rpc(
        'join_group',
        params: {'p_code': code, 'p_group_id': groupId},
      );
      return Group.fromRow(
        Map<String, dynamic>.from(row as Map),
        myRole: GroupRole.member,
      );
    } on PostgrestException catch (e) {
      if (e.message.contains('group_not_found')) throw GroupNotFound();
      rethrow;
    }
  }

  /// Ids of the groups that every one of [userIds] belongs to.
  Future<Set<String>> groupsShared(
    Iterable<String> groupIds,
    Set<String> userIds,
  ) async {
    if (groupIds.isEmpty || userIds.isEmpty) return {};
    final rows = await _client
        .from('group_members')
        .select('group_id, user_id')
        .inFilter('group_id', groupIds.toList())
        .inFilter('user_id', userIds.toList());
    final members = <String, Set<String>>{};
    for (final r in rows) {
      (members[r['group_id'] as String] ??= {}).add(r['user_id'] as String);
    }
    return {
      for (final e in members.entries)
        if (e.value.containsAll(userIds)) e.key,
    };
  }

  Future<void> leave(String groupId) =>
      _client.rpc('leave_group', params: {'p_group_id': groupId});

  Future<void> removeMember(String groupId, String userId) => _client.rpc(
    'remove_group_member',
    params: {'p_group_id': groupId, 'p_user_id': userId},
  );

  Future<String> regenerateCode(String groupId) async => await _client.rpc(
    'regenerate_group_code',
    params: {'p_group_id': groupId},
  ) as String;

  /// Leaderboard of a group, or the global one when [groupId] is null.
  Future<List<LeaderboardEntry>> leaderboard({
    String? groupId,
    required LeaderboardSubject subject,
  }) async {
    final rows = await _client
        .from('leaderboard')
        .select()
        .eq('scope_type', groupId == null ? 'global' : 'group')
        .eq('scope_id', groupId ?? globalScopeId)
        .eq('subject_type', subject.name)
        .order('elo', ascending: false)
        .limit(200);
    return [for (final r in rows) LeaderboardEntry.fromRow(r)];
  }
}

final groupsRepositoryProvider = Provider<GroupsRepository?>((ref) {
  final client = ref.watch(supabaseClientProvider);
  return client == null ? null : GroupsRepository(client);
});

final myGroupsProvider = FutureProvider.autoDispose<List<Group>>((ref) async {
  ref.watch(currentUserProvider);
  final repo = ref.watch(groupsRepositoryProvider);
  if (repo == null || ref.read(authRepositoryProvider).currentUser == null) {
    return const [];
  }
  return repo.myGroups();
});

final groupProvider = FutureProvider.autoDispose.family<Group, String>(
  (ref, id) => ref.watch(groupsRepositoryProvider)!.group(id),
);

final groupMembersProvider = FutureProvider.autoDispose
    .family<List<GroupMember>, String>(
      (ref, id) => ref.watch(groupsRepositoryProvider)!.members(id),
    );

final leaderboardProvider = FutureProvider.autoDispose
    .family<List<LeaderboardEntry>, (String?, LeaderboardSubject)>(
      (ref, args) => ref
          .watch(groupsRepositoryProvider)!
          .leaderboard(groupId: args.$1, subject: args.$2),
    );
