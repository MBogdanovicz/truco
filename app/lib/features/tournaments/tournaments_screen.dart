import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/auth_repository.dart';
import '../../data/entitlements.dart';
import '../../data/tournaments.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../premium/premium_screen.dart';

/// "Torneios": mine, the ones open for sign-up, creating one.
class TournamentsScreen extends ConsumerWidget {
  const TournamentsScreen({super.key});

  Future<void> _create(BuildContext context, WidgetRef ref) async {
    final ent = await ref.read(entitlementsProvider.future);
    if (!context.mounted) return;
    if (!ent.isPremium && Entitlements.gatesEnabled) {
      await showPremiumRequired(context, 'Criar torneios');
      return;
    }
    context.push('/torneios/novo');
  }

  Future<void> _byCode(BuildContext context, WidgetRef ref) async {
    final code = TextEditingController();
    final ok = await showAppDialog<bool>(
      context,
      title: 'Entrar com código',
      content: Padding(
        padding: const EdgeInsets.only(top: 12),
        child: AppTextField(
          controller: code,
          label: 'Código do torneio',
          autofocus: true,
          maxLength: 6,
          textCapitalization: TextCapitalization.characters,
        ),
      ),
      actions: const [
        AppDialogAction(label: 'Cancelar', value: false),
        AppDialogAction(label: 'Abrir', value: true, isPrimary: true),
      ],
    );
    final text = code.text;
    code.dispose();
    if (ok != true || !context.mounted) return;
    final id = await ref
        .read(tournamentsRepositoryProvider)
        ?.idByCode(text)
        .catchError((Object _) => null);
    if (!context.mounted) return;
    if (id == null) {
      showAppToast(context, 'Nenhum torneio com esse código.');
      return;
    }
    context.push('/torneios/$id');
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider).value;
    final list = ref.watch(tournamentsProvider);
    if (user == null || user.isGuest) {
      return const AppScaffold(
        title: 'Torneios',
        children: [
          AppSection(
            children: [
              AppTile(
                title: 'Entre com seu e-mail para participar de torneios.',
              ),
            ],
          ),
        ],
      );
    }
    List<Widget> tiles(List<Tournament> ts, String empty) => ts.isEmpty
        ? [AppTile(title: empty)]
        : [
            for (final t in ts)
              AppTile(
                leading: AppTileIcon(
                  AppIcon.trophy,
                  color: switch (t.status) {
                    TournamentStatus.open => Colors.teal,
                    TournamentStatus.running => Colors.red,
                    _ => Colors.blueGrey,
                  },
                ),
                title: t.name,
                subtitle: [
                  switch (t.status) {
                    TournamentStatus.open => 'Inscrições abertas',
                    TournamentStatus.running => 'Em andamento',
                    TournamentStatus.finished => 'Encerrado',
                    TournamentStatus.cancelled => 'Cancelado',
                  },
                  t.groupName == null ? 'público' : 'grupo ${t.groupName}',
                  t.format.label.toLowerCase(),
                ].join(' · '),
                onTap: () => context.push('/torneios/${t.id}'),
              ),
          ];
    return AppScaffold(
      title: 'Torneios',
      onRefresh: () async => ref.invalidate(tournamentsProvider),
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 24),
          child: Row(
            children: [
              Expanded(
                child: AppButton(
                  label: 'Criar torneio',
                  icon: context.icon(AppIcon.add),
                  onPressed: () => _create(context, ref),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: AppButton(
                  label: 'Entrar com código',
                  tonal: true,
                  onPressed: () => _byCode(context, ref),
                ),
              ),
            ],
          ),
        ),
        ...list.when(
          loading: () => const [Center(child: AppProgress())],
          error: (e, _) => [
            AppSection(
              children: [
                AppTile(title: 'Não foi possível carregar os torneios.'),
              ],
            ),
          ],
          data: (d) => [
            AppSection(
              header: 'Meus torneios',
              children: tiles(d.mine, 'Você ainda não está em nenhum torneio.'),
            ),
            AppSection(
              header: 'Inscrições abertas',
              footer:
                  'Torneios públicos e dos seus grupos. Criar um torneio faz '
                  'parte do Premium; participar é grátis.',
              children: tiles(d.open, 'Nenhum torneio com inscrições abertas.'),
            ),
          ],
        ),
      ],
    );
  }
}
