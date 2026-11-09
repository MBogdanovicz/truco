import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/auth_repository.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/theme/app_theme.dart';
import 'online_room_controller.dart';

/// First step of a new game: how will the score be kept?
class ScorekeeperModeScreen extends ConsumerStatefulWidget {
  const ScorekeeperModeScreen({super.key});

  @override
  ConsumerState<ScorekeeperModeScreen> createState() => _ModeState();
}

class _ModeState extends ConsumerState<ScorekeeperModeScreen> {
  bool _busy = false;

  Future<void> _createRoom() async {
    setState(() => _busy = true);
    try {
      await ref.read(onlineRoomControllerProvider.notifier).create();
      if (mounted) context.go('/marcador/sala');
    } on Object catch (e) {
      debugPrint('Create room failed: $e');
      if (mounted) {
        showAppToast(
          context,
          'Não foi possível criar a sala. Verifique sua internet.',
        );
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final online = ref.watch(authRepositoryProvider).currentUser != null;
    final android = !kIsWeb && defaultTargetPlatform == TargetPlatform.android;
    return AppScaffold(
      title: 'Novo marcador',
      body: _busy
          ? const Center(child: AppProgress())
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _ModeCard(
                  icon: Icons.phone_android,
                  title: 'Um aparelho só',
                  subtitle: 'Um celular na mesa marca os pontos das duas duplas. Funciona sem internet.',
                  onTap: () => context.go('/marcador/novo/local'),
                ),
                _ModeCard(
                  icon: Icons.wifi_tethering,
                  title: 'Cada um no seu celular',
                  subtitle: online
                      ? 'Crie uma sala e passe o código. Cada dupla marca os seus tentos. Precisa de internet.'
                      : 'Entre com sua conta para usar.',
                  onTap: online ? _createRoom : null,
                ),
                if (android)
                  _ModeCard(
                    icon: Icons.bluetooth,
                    title: 'Por perto, sem internet',
                    subtitle: online
                        ? 'Cada um no seu celular Android, na mesma mesa, sem precisar de internet.'
                        : 'Entre com sua conta para usar.',
                    onTap: online ? () => context.go('/marcador/perto') : null,
                  ),
                _ModeCard(
                  icon: Icons.login,
                  title: 'Entrar com código',
                  subtitle: online
                      ? 'Alguém já criou a sala? Digite o código.'
                      : 'Entre com sua conta para usar.',
                  onTap: online ? () => context.go('/marcador/entrar') : null,
                ),
              ],
            ),
    );
  }
}

class _ModeCard extends StatelessWidget {
  const _ModeCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) => Card(
    clipBehavior: Clip.antiAlias,
    child: ListTile(
      enabled: onTap != null,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      leading: CircleAvatar(
        backgroundColor: onTap == null ? Colors.grey : AppColors.felt,
        child: Icon(icon, color: Colors.white),
      ),
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: onTap == null ? null : const Icon(Icons.chevron_right),
      onTap: onTap,
    ),
  );
}
