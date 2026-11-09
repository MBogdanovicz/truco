import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../config/env.dart';
import '../../data/auth_repository.dart';
import '../../data/groups_repository.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/theme/app_theme.dart';
import '../ranking/leaderboard_view.dart';

class GroupDetailScreen extends ConsumerWidget {
  const GroupDetailScreen({super.key, required this.groupId});

  final String groupId;

  Future<void> _leave(BuildContext context, WidgetRef ref, Group group) async {
    final ok = await showAppDialog<bool>(
      context,
      title: 'Sair do grupo?',
      message: group.myRole == GroupRole.owner
          ? 'Você criou este grupo. Ao sair, outro membro passa a ser o dono.'
          : 'Você pode voltar depois com o código do grupo.',
      actions: const [
        AppDialogAction(label: 'Cancelar', value: false),
        AppDialogAction(label: 'Sair', value: true, isDestructive: true),
      ],
    );
    if (ok != true) return;
    await ref.read(groupsRepositoryProvider)!.leave(group.id);
    ref.invalidate(myGroupsProvider);
    if (context.mounted) context.go('/grupos');
  }

  Future<void> _join(BuildContext context, WidgetRef ref, Group group) async {
    await ref.read(groupsRepositoryProvider)!.join(groupId: group.id);
    ref
      ..invalidate(myGroupsProvider)
      ..invalidate(groupProvider(group.id))
      ..invalidate(groupMembersProvider(group.id));
  }

  Future<void> _remove(
    BuildContext context,
    WidgetRef ref,
    GroupMember m,
  ) async {
    final ok = await showAppDialog<bool>(
      context,
      title: 'Remover ${m.name}?',
      actions: const [
        AppDialogAction(label: 'Cancelar', value: false),
        AppDialogAction(label: 'Remover', value: true, isDestructive: true),
      ],
    );
    if (ok != true) return;
    await ref.read(groupsRepositoryProvider)!.removeMember(groupId, m.userId);
    ref.invalidate(groupMembersProvider(groupId));
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final group = ref.watch(groupProvider(groupId));
    return AppScaffold(
      title: group.value?.name ?? 'Grupo',
      body: group.when(
        loading: () => const Center(child: AppProgress()),
        error: (e, _) => Center(
          child: Text(
            e is GroupNotFound ? 'Grupo não encontrado.' : 'Erro: $e',
          ),
        ),
        data: (g) => _body(context, ref, g),
      ),
    );
  }

  Widget _body(BuildContext context, WidgetRef ref, Group g) {
    final theme = Theme.of(context);
    final members = ref.watch(groupMembersProvider(g.id));
    final me = ref.watch(authRepositoryProvider).currentUser?.id;
    final isMember = g.myRole != null;

    return RefreshIndicator.adaptive(
      onRefresh: () async {
        ref
          ..invalidate(groupProvider(g.id))
          ..invalidate(groupMembersProvider(g.id))
          ..invalidate(leaderboardProvider);
      },
      child: ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          if (g.description.isNotEmpty)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
              child: Text(g.description),
            ),
          if (isMember)
            Card(
              margin: const EdgeInsets.all(16),
              color: AppColors.felt,
              child: ListTile(
                textColor: Colors.white,
                iconColor: Colors.white,
                title: const Text('Código do grupo'),
                subtitle: Text(
                  g.joinCode,
                  style: theme.textTheme.headlineSmall?.copyWith(
                    color: Colors.white,
                    letterSpacing: 4,
                  ),
                ),
                trailing: IconButton(
                  tooltip: 'Copiar convite',
                  icon: const Icon(Icons.copy),
                  onPressed: () {
                    Clipboard.setData(
                      ClipboardData(
                        text:
                            'Entre no grupo "${g.name}" do Truco: ${Env.groupInviteLink(g.joinCode)}\n'
                            'Código: ${g.joinCode}',
                      ),
                    );
                    showAppToast(context, 'Convite copiado');
                  },
                ),
              ),
            )
          else
            Padding(
              padding: const EdgeInsets.all(16),
              child: AppButton(
                label: 'Entrar no grupo',
                icon: Icons.group_add,
                onPressed: () => _join(context, ref, g),
              ),
            ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            child: Text('Ranking do grupo', style: theme.textTheme.titleMedium),
          ),
          LeaderboardView(groupId: g.id, shrinkWrap: true),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 24, 16, 0),
            child: Text('Membros', style: theme.textTheme.titleMedium),
          ),
          ...members.when(
            loading: () => const [
              Padding(
                padding: EdgeInsets.all(16),
                child: Center(child: AppProgress()),
              ),
            ],
            error: (e, _) => [ListTile(title: Text('Erro: $e'))],
            data: (list) => [
              for (final m in list)
                ListTile(
                  leading: const Icon(Icons.person),
                  title: Text(m.userId == me ? '${m.name} (você)' : m.name),
                  subtitle: m.role == GroupRole.member
                      ? null
                      : Text(m.role == GroupRole.owner ? 'dono' : 'admin'),
                  trailing:
                      g.canManage && m.role != GroupRole.owner && m.userId != me
                      ? IconButton(
                          tooltip: 'Remover',
                          icon: const Icon(Icons.person_remove_outlined),
                          onPressed: () => _remove(context, ref, m),
                        )
                      : null,
                ),
            ],
          ),
          if (isMember)
            Padding(
              padding: const EdgeInsets.all(16),
              child: AppTextButton(
                label: 'Sair do grupo',
                onPressed: () => _leave(context, ref, g),
              ),
            ),
        ],
      ),
    );
  }
}
