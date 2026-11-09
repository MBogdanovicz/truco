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
    final me = ref.watch(authRepositoryProvider).currentUser;
    final online = me != null;
    // Guests (no e-mail) can join rooms but not open them.
    final canHost = me != null && !me.isGuest;
    final android = !kIsWeb && defaultTargetPlatform == TargetPlatform.android;
    if (_busy) {
      return const AppScaffold(
        title: 'Novo marcador',
        body: Center(child: AppProgress()),
      );
    }
    final login = 'Entre com sua conta para usar.';
    return AppScaffold(
      title: 'Novo marcador',
      children: [
        AppSection(
          header: 'Como vocês vão marcar?',
          children: [
            AppTile(
              leading: const AppTileIcon(AppIcon.phone, color: AppColors.felt),
              title: 'Um aparelho só',
              subtitle: 'Um celular na mesa marca os pontos das duas duplas. Funciona sem internet.',
              onTap: () => context.go('/marcador/novo/local'),
            ),
            AppTile(
              leading: AppTileIcon(
                AppIcon.online,
                color: canHost ? AppColors.blue : Colors.grey,
              ),
              title: 'Cada um no seu celular',
              subtitle: canHost
                  ? 'Crie uma sala e passe o código. Cada dupla marca os seus tentos. Precisa de internet.'
                  : online
                  ? 'Para criar salas, entre com seu e-mail.'
                  : login,
              enabled: canHost,
              onTap: _createRoom,
            ),
            if (android)
              AppTile(
                leading: AppTileIcon(
                  AppIcon.bluetooth,
                  color: online ? AppColors.purple : Colors.grey,
                ),
                title: 'Por perto, sem internet',
                subtitle: online
                    ? 'Cada um no seu celular Android, na mesma mesa, sem precisar de internet.'
                    : login,
                enabled: online,
                onTap: () => context.go('/marcador/perto'),
              ),
          ],
        ),
        AppSection(
          children: [
            AppTile(
              leading: AppTileIcon(
                AppIcon.login,
                color: online ? AppColors.orange : Colors.grey,
              ),
              title: 'Entrar com código',
              subtitle: online
                  ? 'Alguém já criou a sala? Digite o código.'
                  : login,
              enabled: online,
              onTap: () => context.go('/marcador/entrar'),
            ),
          ],
        ),
      ],
    );
  }
}
