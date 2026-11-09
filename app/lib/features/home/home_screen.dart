import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/auth_repository.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
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
    final theme = Theme.of(context);

    return AppScaffold(
      title: 'Truco',
      actions: [
        if (user != null)
          IconButton(
            tooltip: 'Sair da conta',
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
              child: Text(
                'Olá, ${user!.displayName}!',
                style: theme.textTheme.headlineSmall,
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
            ),
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
            color: user == null ? Colors.grey : AppColors.teamA,
            title: 'Grupos',
            subtitle: user == null
                ? 'Entre com sua conta para usar.'
                : 'Ranking só entre os seus amigos.',
            onTap: user == null ? null : () => context.go('/grupos'),
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
        ],
      ),
    );
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
