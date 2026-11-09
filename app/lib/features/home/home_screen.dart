import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../config/env.dart';
import '../../data/auth_repository.dart';
import '../../data/last_room_repository.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/android_download_card.dart';
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
    final theme = Theme.of(context);

    return AppScaffold(
      title: 'Truco',
      actions: [
        if (user != null)
          IconButton(
            tooltip: user.isGuest
                ? 'Sair (e entrar com e-mail)'
                : 'Sair da conta',
            icon: const Icon(Icons.logout),
            onPressed: () => auth.signOut(),
          ),
      ],
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          if (user?.displayName != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Row(
                children: [
                  Flexible(
                    child: Text(
                      'Olá, ${user!.displayName}!',
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.headlineSmall,
                    ),
                  ),
                  IconButton(
                    tooltip: 'Mudar meu nome',
                    icon: const Icon(Icons.edit, size: 20),
                    onPressed: () => _rename(context, ref, user.displayName!),
                  ),
                ],
              ),
            ),
          if (room != null)
            _HomeCard(
              icon: Icons.wifi_tethering,
              color: AppColors.red,
              title: 'Voltar para a sala',
              subtitle: room.snapshot == null
                  ? 'Conectando…'
                  : 'Sala ${room.snapshot!.code}',
              onTap: () => context.go('/marcador/sala'),
            )
          else if (lastRoom != null && user != null)
            _HomeCard(
              icon: Icons.wifi_tethering,
              color: AppColors.red,
              title: 'Voltar para a sala $lastRoom',
              subtitle: 'Saiu sem querer? Toque para entrar de novo.',
              onTap: () => context.go('/marcador/entrar?codigo=$lastRoom'),
            ),
          const AndroidDownloadCard(),
          _HomeCard(
            icon: Icons.scoreboard,
            color: AppColors.felt,
            title: ongoing == null ? 'Novo marcador' : 'Continuar partida',
            subtitle: 'Marque os tentos de uma partida com baralho de verdade.',
            onTap: () => context.go(
              ongoing == null ? '/marcador/novo' : '/marcador/partida',
            ),
          ),
          _HomeCard(
            icon: Icons.history,
            color: AppColors.gold,
            title: 'Histórico',
            subtitle: 'Partidas salvas neste aparelho.',
            onTap: () => context.go('/historico'),
          ),
          _HomeCard(
            icon: Icons.groups,
            color: hasAccount ? AppColors.teamA : Colors.grey,
            title: 'Grupos',
            subtitle: hasAccount
                ? 'Ranking só entre os seus amigos.'
                : 'Entre com seu e-mail para usar.',
            onTap: hasAccount ? () => context.go('/grupos') : null,
          ),
          _HomeCard(
            icon: Icons.leaderboard,
            color: user == null ? Colors.grey : AppColors.red,
            title: 'Ranking geral',
            subtitle: user == null
                ? 'Entre com sua conta para usar.'
                : 'Os melhores jogadores e duplas.',
            onTap: user == null ? null : () => context.go('/ranking'),
          ),
          const _HomeCard(
            icon: Icons.style,
            color: Colors.grey,
            title: 'Jogar truco',
            subtitle: 'Em breve.',
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
            padding: const EdgeInsets.only(top: 24),
            child: Text(
              'Versão ${Env.commit}',
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.textTheme.bodySmall?.color?.withValues(alpha: 0.6),
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
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

class _HomeCard extends StatelessWidget {
  const _HomeCard({
    required this.icon,
    required this.color,
    required this.title,
    required this.subtitle,
    this.onTap,
  });

  final IconData icon;
  final Color color;
  final String title;
  final String subtitle;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: ListTile(
        enabled: onTap != null,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: CircleAvatar(
          backgroundColor: color,
          child: Icon(icon, color: Colors.white),
        ),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: onTap == null ? null : const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}
