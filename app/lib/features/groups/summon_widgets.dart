import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../data/auth_repository.dart';
import '../../data/groups_repository.dart';
import '../../data/push.dart';
import '../../data/slow_games.dart';
import '../../data/tournaments.dart';
import '../../router.dart';
import '../game/online_game_controller.dart';
import '../scorekeeper/online_room_controller.dart';
import '../../ui/adaptive/adaptive_widgets.dart';

/// Lets this device get push notifications: group calls to play, your turn
/// in a slow game, tournament matches. Lives in "Configurações".
class PushToggleTile extends ConsumerWidget {
  const PushToggleTile({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (!PushService.supported) return const SizedBox.shrink();
    final state = ref.watch(pushStateProvider).value;
    final on = state == PushState.on;
    return AppSection(
      header: 'Notificações',
      footer: state == PushState.blocked
          ? 'As notificações do Truco estão bloqueadas. Libere nas '
                'configurações do ${Theme.of(context).platform == TargetPlatform.android ? 'celular' : 'navegador'}.'
          : state == PushState.failed
          ? 'Este navegador não conseguiu ativar os avisos. No Brave, ligue '
                '"Usar os serviços do Google para mensagens push" em '
                'Configurações > Privacidade e segurança, ou use o Chrome.'
          : 'Avisos neste aparelho quando alguém do grupo intimar para uma '
                'partida, quando for a sua vez numa partida lenta e quando um '
                'jogo do seu torneio estiver pronto.',
      children: [
        AppTile(
          title: 'Receber notificações',
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
                        ref.invalidate(pushStateProvider);
                      } else {
                        await PushService.instance.disable(client);
                      }
                    } on Object catch (e) {
                      debugPrint('Push toggle: $e');
                      if (context.mounted) {
                        showAppToast(
                          context,
                          '$e'.contains('push service')
                              ? 'O navegador recusou os avisos. Veja a dica '
                                    'abaixo.'
                              : 'Não foi possível ativar os avisos.',
                          long: true,
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
          : r.failed > 0
          ? 'Não foi possível enviar os avisos. Tente de novo daqui a pouco.'
          : 'Ninguém do grupo $name ligou os avisos de intimação ainda.',
      long: true,
    );
  } on FunctionException catch (e) {
    final code = e.details is Map ? (e.details as Map)['error'] : null;
    if (!context.mounted) return;
    showAppToast(
      context,
      code == 'too_soon'
          ? 'Calma! Espere um minuto para intimar de novo.'
          : 'Não foi possível intimar o grupo.',
      long: true,
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
  StreamSubscription<Summons>? _sub;

  /// A dialog is open; pushes that arrive meanwhile wait here, the latest
  /// per room only (a newer "sua vez" or the end replaces an older one).
  bool _showing = false;
  final _pending = <String, Summons>{};

  @override
  void initState() {
    super.initState();
    if (!PushService.supported) return;
    _sub = PushService.instance.summons.listen(_onSummons);
  }

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }

  void _onSummons(Summons s) {
    if (s.tapped) {
      ref.read(routerProvider).go(s.path);
      return;
    }
    _pending.remove(s.path);
    _pending[s.path] = s;
    if (!_showing) _drain();
  }

  Future<void> _drain() async {
    _showing = true;
    try {
      while (_pending.isNotEmpty && mounted) {
        final s = _pending.remove(_pending.keys.first)!;
        if (await _stillNews(s)) await _show(s);
      }
    } finally {
      _showing = false;
    }
  }

  /// Whether [s] is still worth a dialog now (it may have waited behind
  /// another one, or the person may be at that table already).
  Future<bool> _stillNews(Summons s) async {
    final router = ref.read(routerProvider);
    if (_alreadyThere(s, router.routerDelegate.currentConfiguration.uri.path)) {
      return false;
    }
    final code = Uri.tryParse(s.path)?.queryParameters['codigo'];
    if (s.kind == 'end') {
      // Seen it end at the table (even if now on another screen of it).
      return ref.read(onlineGameControllerProvider)?.code != code;
    }
    if (s.kind == 'match') {
      // "Seu jogo está pronto": only while that match is still to play
      // (the push may have waited while the app was in the background).
      final id = Uri.tryParse(s.path)?.pathSegments.last;
      if (id == null) return false;
      try {
        final me = ref.read(tournamentUserIdProvider);
        final d = await ref.read(tournamentsRepositoryProvider)!.detail(id);
        final next = d.nextMatchOf(me);
        return next != null &&
            next.teamB != null &&
            next.roomCode != null &&
            next.status == 'pending';
      } on Object {
        return true;
      }
    }
    if (s.kind == 'turn') {
      // Still this person's turn? (They may have played elsewhere, or the
      // game may be over.)
      ref.invalidate(slowGamesProvider);
      // Keeps the (auto-dispose) list alive while it loads.
      final keep = ref.listenManual(slowGamesProvider, (_, _) {});
      try {
        final games = await ref.read(slowGamesProvider.future);
        return games.any((g) => g.code == code && g.myTurn);
      } on Object {
        return true;
      } finally {
        keep.close();
      }
    }
    return true;
  }

  Future<void> _show(Summons s) async {
    final router = ref.read(routerProvider);
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

  /// The person is already looking at the room the push is about (their
  /// turn in a slow game, its end): the table shows it, no dialog needed.
  bool _alreadyThere(Summons s, String location) {
    final target = Uri.tryParse(s.path);
    final tournament = target?.path.startsWith('/torneios/') == true
        ? target!.pathSegments.last
        : null;
    if (tournament != null) {
      // On the tournament screen, or still at the table of one of its
      // matches ("Sair" leads to the tournament anyway). The champions'
      // congratulations always show.
      if (s.kind == 'champion') return false;
      return location == target!.path ||
          (location == '/jogo/sala' &&
              ref.read(onlineGameControllerProvider)?.room?.tournamentId ==
                  tournament);
    }
    final code = target?.queryParameters['codigo'];
    if (code == null) return false;
    if (target!.path == '/jogo/entrar') {
      return location == '/jogo/sala' &&
          ref.read(onlineGameControllerProvider)?.code == code;
    }
    if (target.path == '/marcador/entrar') {
      return location == '/marcador/sala' &&
          ref.read(onlineRoomControllerProvider)?.snapshot?.code == code;
    }
    return false;
  }

  @override
  Widget build(BuildContext context) => widget.child;
}
