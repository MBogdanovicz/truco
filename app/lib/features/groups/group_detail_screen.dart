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
    final g = group.value;
    if (g == null) {
      return AppScaffold(
        title: 'Grupo',
        body: Center(
          child: group.hasError
              ? Text(
                  group.error is GroupNotFound
                      ? 'Grupo não encontrado.'
                      : 'Erro: ${group.error}',
                )
              : const AppProgress(),
        ),
      );
    }
    final theme = Theme.of(context);
    final members = ref.watch(groupMembersProvider(g.id));
    final me = ref.watch(authRepositoryProvider).currentUser?.id;
    final isMember = g.myRole != null;

    return AppScaffold(
      title: g.name,
      onRefresh: () async {
        ref
          ..invalidate(groupProvider(g.id))
          ..invalidate(groupMembersProvider(g.id))
          ..invalidate(leaderboardProvider);
      },
      children: [
        if (g.description.isNotEmpty)
          Padding(
            padding: const EdgeInsets.fromLTRB(4, 0, 4, 16),
            child: Text(g.description),
          ),
        if (isMember)
          Padding(
            padding: const EdgeInsets.only(bottom: 24),
            child: AppCard(
              color: AppColors.felt,
              padding: const EdgeInsets.fromLTRB(20, 16, 8, 16),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Código do grupo',
                          style: theme.textTheme.labelLarge?.copyWith(
                            color: Colors.white70,
                          ),
                        ),
                        SelectableText(
                          g.joinCode,
                          style: theme.textTheme.headlineSmall?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 4,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    tooltip: 'Copiar convite',
                    color: Colors.white,
                    icon: Icon(context.icon(AppIcon.copy)),
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
                ],
              ),
            ),
          )
        else
          Padding(
            padding: const EdgeInsets.only(bottom: 24),
            child: AppButton(
              label: 'Entrar no grupo',
              icon: context.icon(AppIcon.groupAdd),
              onPressed: () => _join(context, ref, g),
            ),
          ),
        Padding(
          padding: const EdgeInsets.fromLTRB(4, 0, 4, 12),
          child: Text(
            'Ranking do grupo',
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        LeaderboardView(groupId: g.id),
        members.when(
          loading: () => const Padding(
            padding: EdgeInsets.all(16),
            child: Center(child: AppProgress()),
          ),
          error: (e, _) => Text('Erro: $e'),
          data: (list) => AppSection(
            header: 'Membros (${list.length})',
            children: [
              for (final m in list)
                AppTile(
                  leading: Icon(
                    context.icon(AppIcon.person),
                    color: AppColors.felt,
                  ),
                  title: m.userId == me ? '${m.name} (você)' : m.name,
                  subtitle: m.role == GroupRole.member
                      ? null
                      : (m.role == GroupRole.owner ? 'dono' : 'admin'),
                  trailing:
                      g.canManage && m.role != GroupRole.owner && m.userId != me
                      ? IconButton(
                          tooltip: 'Remover',
                          icon: Icon(context.icon(AppIcon.personRemove)),
                          onPressed: () => _remove(context, ref, m),
                        )
                      : null,
                ),
            ],
          ),
        ),
        if (isMember)
          AppTextButton(
            label: 'Sair do grupo',
            destructive: true,
            onPressed: () => _leave(context, ref, g),
          ),
      ],
    );
  }
}
