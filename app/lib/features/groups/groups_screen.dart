import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/groups_repository.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
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
            SwitchListTile.adaptive(
              contentPadding: EdgeInsets.zero,
              title: Text(public ? 'Grupo público' : 'Grupo privado'),
              subtitle: Text(
                public
                    ? 'Aparece na busca e qualquer pessoa pode entrar.'
                    : 'Não aparece na busca. Só entra quem tiver o código.',
              ),
              value: public,
              onChanged: (v) => setLocal(() => public = v),
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
        showAppToast(context, 'Na versão grátis você pode criar até 2 grupos.');
      }
    } on Object {
      if (mounted) showAppToast(context, 'Não foi possível criar o grupo.');
    }
  }

  @override
  Widget build(BuildContext context) {
    final mine = ref.watch(myGroupsProvider);
    final public = ref.watch(_publicGroupsProvider(_query));
    final theme = Theme.of(context);
    final myIds = mine.value?.map((g) => g.id).toSet() ?? const <String>{};

    return AppScaffold(
      title: 'Grupos',
      body: RefreshIndicator.adaptive(
        onRefresh: () async {
          ref.invalidate(myGroupsProvider);
          ref.invalidate(_publicGroupsProvider);
        },
        child: ListView(
          padding: const EdgeInsets.symmetric(vertical: 8),
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Expanded(
                    child: AppButton(
                      label: 'Criar grupo',
                      icon: Icons.add,
                      onPressed: _create,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: AppTextButton(
                      label: 'Entrar com código',
                      onPressed: () => context.go('/grupos/entrar'),
                    ),
                  ),
                ],
              ),
            ),
            _Section('Meus grupos'),
            ...mine.when(
              loading: () => const [
                Padding(
                  padding: EdgeInsets.all(16),
                  child: Center(child: AppProgress()),
                ),
              ],
              error: (e, _) => [ListTile(title: Text('Erro ao carregar: $e'))],
              data: (groups) => groups.isEmpty
                  ? const [
                      ListTile(
                        title: Text(
                          'Você ainda não participa de nenhum grupo.',
                        ),
                      ),
                    ]
                  : [for (final g in groups) _GroupTile(group: g)],
            ),
            _Section('Grupos públicos'),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: TextField(
                decoration: const InputDecoration(
                  prefixIcon: Icon(Icons.search),
                  hintText: 'Buscar pelo nome',
                  border: OutlineInputBorder(),
                  isDense: true,
                ),
                onSubmitted: (v) => setState(() => _query = v),
              ),
            ),
            ...public.when(
              loading: () => const [
                Padding(
                  padding: EdgeInsets.all(16),
                  child: Center(child: AppProgress()),
                ),
              ],
              error: (e, _) => [ListTile(title: Text('Erro ao carregar: $e'))],
              data: (groups) {
                final others = groups
                    .where((g) => !myIds.contains(g.id))
                    .toList();
                return others.isEmpty
                    ? [
                        ListTile(
                          title: Text(
                            'Nenhum grupo público encontrado.',
                            style: theme.textTheme.bodyMedium,
                          ),
                        ),
                      ]
                    : [for (final g in others) _GroupTile(group: g)];
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _Section extends StatelessWidget {
  const _Section(this.title);
  final String title;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(16, 20, 16, 8),
    child: Text(title, style: Theme.of(context).textTheme.titleMedium),
  );
}

class _GroupTile extends StatelessWidget {
  const _GroupTile({required this.group});
  final Group group;

  @override
  Widget build(BuildContext context) => ListTile(
    leading: CircleAvatar(
      backgroundColor: AppColors.felt,
      foregroundColor: Colors.white,
      child: Text(group.name.characters.first.toUpperCase()),
    ),
    title: Text(group.name),
    subtitle: Text(
      [
        if (group.memberCount != null) '${group.memberCount} membros',
        group.visibility == GroupVisibility.public ? 'público' : 'privado',
        if (group.myRole == GroupRole.owner) 'você criou',
      ].join(' · '),
    ),
    trailing: const Icon(Icons.chevron_right),
    onTap: () => context.go('/grupos/${group.id}'),
  );
}
