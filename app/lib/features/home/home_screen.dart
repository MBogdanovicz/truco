import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../config/env.dart';
import '../../data/auth_repository.dart';
import '../../data/entitlements.dart';
import '../../data/last_room_repository.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/android_download_card.dart';
import '../premium/premium_screen.dart';
import '../../ui/theme/app_theme.dart';
import '../scorekeeper/online_room_controller.dart';
import '../scorekeeper/scorekeeper_controller.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authRepositoryProvider);
    final user = ref.watch(currentUserProvider).value ?? auth.currentUser;
    final ongoing = ref.watch(scorekeeperControllerProvider);
    final room = ref.watch(onlineRoomControllerProvider);
    final lastRoom = ref.watch(lastRoomCodeProvider).value;
    final hasAccount = user != null && !user.isGuest;
    final premium = ref.watch(entitlementsProvider).value?.isPremium ?? false;
    final theme = Theme.of(context);

    final menu = <_MenuItem>[
      if (room != null)
        _MenuItem(
          icon: AppIcon.online,
          color: AppColors.red,
          title: 'Voltar para a sala',
          subtitle: room.snapshot == null
              ? 'Conectando…'
              : 'Sala ${room.snapshot!.code}',
          onTap: () => context.go('/marcador/sala'),
        )
      else if (lastRoom != null && user != null)
        _MenuItem(
          icon: AppIcon.online,
          color: AppColors.red,
          title: 'Voltar para a sala $lastRoom',
          subtitle: 'Saiu sem querer? Toque para entrar de novo.',
          onTap: () => context.go('/marcador/entrar?codigo=$lastRoom'),
        ),
      if (AndroidDownloadCard.isShown)
        _MenuItem(
          icon: AppIcon.download,
          color: AppColors.felt,
          title: 'Baixe o app para Android',
          subtitle: AndroidDownloadCard.subtitle,
          onTap: AndroidDownloadCard.open,
        ),
      _MenuItem(
        icon: AppIcon.scoreboard,
        color: AppColors.felt,
        title: ongoing == null ? 'Novo marcador' : 'Continuar partida',
        subtitle: 'Marque os tentos de uma partida com baralho de verdade.',
        onTap: () => context.go(
          ongoing == null ? '/marcador/novo' : '/marcador/partida',
        ),
      ),
      _MenuItem(
        icon: AppIcon.history,
        color: AppColors.orange,
        title: 'Histórico',
        subtitle: 'Partidas salvas neste aparelho.',
        onTap: () => context.go('/historico'),
      ),
      _MenuItem(
        icon: AppIcon.groups,
        color: AppColors.blue,
        title: 'Grupos',
        subtitle: hasAccount
            ? 'Ranking só entre os seus amigos.'
            : 'Entre com seu e-mail para usar.',
        onTap: hasAccount ? () => context.go('/grupos') : null,
      ),
      _MenuItem(
        icon: AppIcon.leaderboard,
        color: AppColors.gold,
        title: 'Ranking geral',
        subtitle: user == null
            ? 'Entre com sua conta para usar.'
            : 'Os melhores jogadores e duplas.',
        onTap: user == null ? null : () => context.go('/ranking'),
      ),
      if (hasAccount)
        _MenuItem(
          icon: AppIcon.trophy,
          color: AppColors.gold,
          title: premium ? 'Premium ativo' : 'Truco Premium',
          subtitle: premium
              ? 'Obrigado! Convide seus amigos com desconto.'
              : 'Sem anúncios, grupos sem limite e visuais do placar.',
          onTap: () => context.go('/premium'),
        ),
      const _MenuItem(
        icon: AppIcon.cards,
        color: AppColors.purple,
        title: 'Jogar truco',
        subtitle: 'Em breve.',
      ),
    ];
    final muted = theme.textTheme.bodySmall?.copyWith(
      color: theme.textTheme.bodySmall?.color?.withValues(alpha: 0.6),
    );

    return AppScaffold(
      title: 'Truco',
      largeTitle: true,
      maxWidth: 1040,
      actions: [
        if (user != null)
          IconButton(
            tooltip: user.isGuest
                ? 'Sair (e entrar com e-mail)'
                : 'Sair da conta',
            icon: Icon(context.icon(AppIcon.logout)),
            onPressed: () => auth.signOut(),
          ),
      ],
      children: [
        if (user?.displayName != null)
          Padding(
            padding: const EdgeInsets.fromLTRB(4, 0, 4, 16),
            child: Row(
              children: [
                Flexible(
                  child: Text(
                    'Olá, ${user!.displayName}!',
                    overflow: TextOverflow.ellipsis,
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                IconButton(
                  tooltip: 'Mudar meu nome',
                  icon: Icon(context.icon(AppIcon.edit), size: 20),
                  onPressed: () async {
                    final ent = await ref.read(entitlementsProvider.future);
                    if (!context.mounted) return;
                    if (!ent.canRename) {
                      showPremiumRequired(context, 'Mudar o nome');
                      return;
                    }
                    await _rename(context, ref, user.displayName!);
                  },
                ),
              ],
            ),
          ),
        LayoutBuilder(
          builder: (context, constraints) =>
              constraints.maxWidth >= AppBreakpoints.medium
              ? Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: _MenuGrid(items: menu, width: constraints.maxWidth),
                )
              : AppSection(
                  children: [
                    for (final m in menu)
                      AppTile(
                        leading: AppTileIcon(
                          m.icon,
                          color: m.onTap == null ? Colors.grey : m.color,
                        ),
                        title: m.title,
                        subtitle: m.subtitle,
                        enabled: m.onTap != null,
                        onTap: m.onTap,
                      ),
                  ],
                ),
        ),
        if (!auth.isAvailable)
          Padding(
            padding: const EdgeInsets.only(top: 16),
            child: Text(
              'Modo offline: login, grupos e ranking ainda não estão configurados nesta versão.',
              style: theme.textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
          ),
        Padding(
          padding: const EdgeInsets.only(top: 16),
          child: Text(
            'Versão ${Env.commit}',
            style: muted,
            textAlign: TextAlign.center,
          ),
        ),
      ],
    );
  }
}

/// Changes the name shown to other players and in the rankings.
Future<void> _rename(
  BuildContext context,
  WidgetRef ref,
  String current,
) async {
  final name = TextEditingController(text: current);
  final ok = await showAppDialog<bool>(
    context,
    title: 'Seu nome',
    content: Padding(
      padding: const EdgeInsets.only(top: 12),
      child: AppTextField(
        controller: name,
        label: 'Nome',
        autofocus: true,
        maxLength: 24,
        textCapitalization: TextCapitalization.words,
      ),
    ),
    actions: const [
      AppDialogAction(label: 'Cancelar', value: false),
      AppDialogAction(label: 'Salvar', value: true, isPrimary: true),
    ],
  );
  final value = name.text.trim();
  name.dispose();
  if (ok != true || value == current || !context.mounted) return;
  if (value.length < 2) {
    showAppToast(context, 'O nome precisa ter pelo menos 2 letras.');
    return;
  }
  try {
    await ref.read(authRepositoryProvider).setDisplayName(value);
    if (context.mounted) showAppToast(context, 'Nome atualizado');
  } on Object {
    if (context.mounted) {
      showAppToast(context, 'Não foi possível mudar o nome. Tente de novo.');
    }
  }
}

class _MenuItem {
  const _MenuItem({
    required this.icon,
    required this.color,
    required this.title,
    required this.subtitle,
    this.onTap,
  });

  final AppIcon icon;
  final Color color;
  final String title;
  final String subtitle;
  final VoidCallback? onTap;
}

/// Tablet and desktop home: the menu as a grid of cards.
class _MenuGrid extends StatelessWidget {
  const _MenuGrid({required this.items, required this.width});

  final List<_MenuItem> items;
  final double width;

  @override
  Widget build(BuildContext context) {
    const gap = 16.0;
    final columns = width >= AppBreakpoints.expanded ? 3 : 2;
    final tileWidth = (width - gap * (columns - 1)) / columns;
    return Wrap(
      spacing: gap,
      runSpacing: gap,
      children: [
        for (final m in items)
          SizedBox(
            width: tileWidth,
            height: 168,
            child: _MenuCard(item: m),
          ),
      ],
    );
  }
}

class _MenuCard extends StatelessWidget {
  const _MenuCard({required this.item});

  final _MenuItem item;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final enabled = item.onTap != null;
    return AppCard(
      onTap: item.onTap,
      padding: const EdgeInsets.all(20),
      child: Opacity(
        opacity: enabled ? 1 : 0.45,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AppTileIcon(item.icon, color: enabled ? item.color : Colors.grey),
            const Spacer(),
            Text(
              item.title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              item.subtitle,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
