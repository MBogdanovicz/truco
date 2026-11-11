import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/groups_repository.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import 'summon_widgets.dart';
import '../../ui/theme/app_theme.dart';

final _publicGroupsProvider = FutureProvider.family<List<Group>, String>(
  (ref, query) =>
      ref.watch(groupsRepositoryProvider)!.publicGroups(query: query),
);

/// My groups, plus creating, joining and discovering public groups.
class GroupsScreen extends ConsumerStatefulWidget {
  const GroupsScreen({super.key});

  @override
  ConsumerState<GroupsScreen> createState() => _GroupsScreenState();
}

class _GroupsScreenState extends ConsumerState<GroupsScreen> {
  String _query = '';

  Future<void> _create() async {
    final name = TextEditingController();
    final description = TextEditingController();
    var public = false;
    final ok = await showAppDialog<bool>(
      context,
      title: 'Novo grupo',
      content: StatefulBuilder(
        builder: (context, setLocal) => Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 12),
            AppTextField(
              controller: name,
              label: 'Nome do grupo',
              autofocus: true,
              maxLength: 40,
              textCapitalization: TextCapitalization.sentences,
            ),
            const SizedBox(height: 8),
            AppTextField(
              controller: description,
              label: 'Descrição (opcional)',
              maxLength: 200,
              textCapitalization: TextCapitalization.sentences,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        public ? 'Grupo público' : 'Grupo privado',
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                      Text(
                        public
                            ? 'Aparece na busca e qualquer pessoa pode entrar.'
                            : 'Não aparece na busca. Só entra quem tiver o código.',
                        style: const TextStyle(fontSize: 13),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                AppSwitch(
                  value: public,
                  onChanged: (v) => setLocal(() => public = v),
                ),
              ],
            ),
          ],
        ),
      ),
      actions: const [
        AppDialogAction(label: 'Cancelar', value: false),
        AppDialogAction(label: 'Criar', value: true, isPrimary: true),
      ],
    );
    final groupName = name.text.trim();
    final groupDescription = description.text.trim();
    name.dispose();
    description.dispose();
    if (ok != true || !mounted) return;
    if (groupName.length < 2) {
      showAppToast(context, 'O nome precisa ter pelo menos 2 letras.');
      return;
    }
    try {
      final group = await ref
          .read(groupsRepositoryProvider)!
          .create(
            name: groupName,
            description: groupDescription,
            visibility: public
                ? GroupVisibility.public
                : GroupVisibility.private,
          );
      ref.invalidate(myGroupsProvider);
      if (mounted) context.go('/grupos/${group.id}');
    } on GroupLimitReached {
      if (mounted) {
        showAppToast(
          context,
          'Na versão grátis você pode estar em até 2 grupos. Com o Premium, sem limite.',
        );
      }
    } on Object {
      if (mounted) showAppToast(context, 'Não foi possível criar o grupo.');
    }
  }

  @override
  Widget build(BuildContext context) {
    final mine = ref.watch(myGroupsProvider);
    final public = ref.watch(_publicGroupsProvider(_query));
    final myIds = mine.value?.map((g) => g.id).toSet() ?? const <String>{};

    List<Widget> state(AsyncValue<List<Group>> value, String empty) =>
        value.when(
          loading: () => const [
            Padding(
              padding: EdgeInsets.all(16),
              child: Center(child: AppProgress()),
            ),
          ],
          error: (e, _) => [AppTile(title: 'Erro ao carregar: $e')],
          data: (groups) => groups.isEmpty
              ? [AppTile(title: empty)]
              : [for (final g in groups) _GroupTile(group: g)],
        );

    return AppScaffold(
      title: 'Grupos',
      onRefresh: () async {
        ref.invalidate(myGroupsProvider);
        ref.invalidate(_publicGroupsProvider);
      },
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 24),
          child: Row(
            children: [
              Expanded(
                child: AppButton(
                  label: 'Criar grupo',
                  icon: context.icon(AppIcon.add),
                  onPressed: _create,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: AppButton(
                  label: 'Entrar com código',
                  tonal: true,
                  onPressed: () => context.go('/grupos/entrar'),
                ),
              ),
            ],
          ),
        ),
        AppSection(
          header: 'Meus grupos',
          children: state(mine, 'Você ainda não participa de nenhum grupo.'),
        ),
        const PushToggleTile(),
        Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: AppSearchField(
            placeholder: 'Buscar grupos públicos',
            onSubmitted: (v) => setState(() => _query = v),
          ),
        ),
        AppSection(
          header: 'Grupos públicos',
          children: state(
            public.whenData(
              (groups) => groups.where((g) => !myIds.contains(g.id)).toList(),
            ),
            'Nenhum grupo público encontrado.',
          ),
        ),
      ],
    );
  }
}

class _GroupTile extends StatelessWidget {
  const _GroupTile({required this.group});
  final Group group;

  @override
  Widget build(BuildContext context) => AppTile(
    leading: CircleAvatar(
      radius: context.isCupertino ? 16 : 20,
      backgroundColor: AppColors.felt,
      foregroundColor: Colors.white,
      child: Text(group.name.characters.first.toUpperCase()),
    ),
    title: group.name,
    subtitle: [
      if (group.memberCount != null) '${group.memberCount} membros',
      group.visibility == GroupVisibility.public ? 'público' : 'privado',
      if (group.myRole == GroupRole.owner) 'você criou',
    ].join(' · '),
    onTap: () => context.go('/grupos/${group.id}'),
  );
}
