import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../data/auth_repository.dart';
import '../../data/groups_repository.dart';
import '../../data/push.dart';
import '../../router.dart';
import '../../ui/adaptive/adaptive_widgets.dart';

/// "Avisos de intimação": lets this device get the group's calls to play.
class PushToggleTile extends ConsumerWidget {
  const PushToggleTile({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (!PushService.supported) return const SizedBox.shrink();
    final state = ref.watch(pushStateProvider).value;
    final on = state == PushState.on;
    return AppSection(
      footer: state == PushState.blocked
          ? 'As notificações do Truco estão bloqueadas. Libere nas '
                'configurações do ${Theme.of(context).platform == TargetPlatform.android ? 'celular' : 'navegador'}.'
          : 'Quando alguém do seu grupo intimar para uma partida, você recebe '
                'um aviso neste aparelho.',
      children: [
        AppTile(
          title: 'Receber intimações',
          trailing: AppSwitch(
            value: on,
            onChanged: state == null || state == PushState.unsupported
                ? null
                : (v) async {
                    final client = ref.read(supabaseClientProvider);
                    if (client == null) return;
                    try {
                      if (v) {
                        await PushService.instance.enable(client);
                      } else {
                        await PushService.instance.disable(client);
                        if (context.mounted) {
                          showAppToast(
                            context,
                            'Para parar de vez, desligue as notificações do '
                            'Truco nas configurações.',
                          );
                        }
                      }
                    } on Object catch (e) {
                      debugPrint('Push toggle: $e');
                      if (context.mounted) {
                        showAppToast(
                          context,
                          'Não foi possível ativar os avisos.',
                        );
                      }
                    }
                    ref.invalidate(pushStateProvider);
                  },
          ),
        ),
      ],
    );
  }
}

/// Picks one of the person's groups and calls its members to the room.
Future<void> summonToRoom(
  BuildContext context,
  WidgetRef ref, {
  required String code,
  required bool game,
}) async {
  final client = ref.read(supabaseClientProvider);
  final user = ref.read(authRepositoryProvider).currentUser;
  if (client == null || user == null || user.isGuest) {
    showAppToast(context, 'Entre com seu e-mail para intimar um grupo.');
    return;
  }
  final List<Group> groups;
  try {
    groups = await ref.read(myGroupsProvider.future);
  } on Object {
    if (context.mounted) {
      showAppToast(context, 'Não foi possível carregar os grupos.');
    }
    return;
  }
  if (!context.mounted) return;
  if (groups.isEmpty) {
    showAppToast(context, 'Você não participa de nenhum grupo.');
    return;
  }
  final picked = groups.length == 1
      ? (value: groups.single.id)
      : await showAppPicker<String>(
          context,
          title: 'Intimar qual grupo?',
          message:
              'Todos do grupo com os avisos ligados recebem um chamado '
              'para esta sala.',
          options: [
            for (final g in groups) AppPickerOption(label: g.name, value: g.id),
          ],
        );
  if (picked == null || !context.mounted) return;
  final name = groups.firstWhere((g) => g.id == picked.value).name;
  try {
    final r = await summonGroup(
      client,
      groupId: picked.value,
      code: code,
      game: game,
    );
    if (!context.mounted) return;
    showAppToast(
      context,
      r.sent > 0
          ? 'Intimação enviada para o grupo $name.'
          : 'Ninguém do grupo $name ligou os avisos de intimação ainda.',
    );
  } on FunctionException catch (e) {
    final code = e.details is Map ? (e.details as Map)['error'] : null;
    if (!context.mounted) return;
    showAppToast(
      context,
      code == 'too_soon'
          ? 'Calma! Espere um minuto para intimar de novo.'
          : 'Não foi possível intimar o grupo.',
    );
  } on Object {
    if (context.mounted) {
      showAppToast(context, 'Não foi possível intimar o grupo.');
    }
  }
}

/// Shows a call to play that arrived with the app open, and opens the room
/// when a push is tapped.
class SummonsListener extends ConsumerStatefulWidget {
  const SummonsListener({super.key, required this.child});
  final Widget child;

  @override
  ConsumerState<SummonsListener> createState() => _SummonsListenerState();
}

class _SummonsListenerState extends ConsumerState<SummonsListener> {
  @override
  void initState() {
    super.initState();
    if (!PushService.supported) return;
    PushService.instance.summons.listen(_show);
  }

  Future<void> _show(Summons s) async {
    final router = ref.read(routerProvider);
    if (s.tapped) {
      router.go(s.path);
      return;
    }
    final context = router.routerDelegate.navigatorKey.currentContext;
    if (context == null) return;
    final go = await showAppDialog<bool>(
      context,
      title: s.title,
      message: s.body,
      actions: const [
        AppDialogAction(label: 'Agora não', value: false),
        AppDialogAction(label: 'Entrar', value: true, isPrimary: true),
      ],
    );
    if (go == true) router.go(s.path);
  }

  @override
  Widget build(BuildContext context) => widget.child;
}
