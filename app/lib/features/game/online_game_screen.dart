import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../config/env.dart';
import '../../data/ads.dart';
import '../../data/game_room_repository.dart';
import '../../data/groups_repository.dart';
import '../../domain/game/ai.dart';
import '../../domain/game/truco_game.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/theme/app_theme.dart';
import 'game_table.dart';
import 'online_game_controller.dart';

/// Invite link that opens the game room (the app's /sala route).
String gameRoomInviteLink(String code) => '${Env.roomInviteLink(code)}&jogo=1';

/// An online game room: the lobby while people gather, then the table.
class OnlineGameScreen extends ConsumerStatefulWidget {
  const OnlineGameScreen({super.key});

  @override
  ConsumerState<OnlineGameScreen> createState() => _OnlineGameState();
}

class _OnlineGameState extends ConsumerState<OnlineGameScreen> {
  bool _leaving = false;

  OnlineGameController get _ctrl =>
      ref.read(onlineGameControllerProvider.notifier);

  Future<void> _run(Future<void> Function() request) async {
    try {
      await request();
    } on GameRoomError catch (e) {
      if (mounted) showAppToast(context, e.message);
    } on Object {
      if (mounted) {
        showAppToast(
          context,
          'Não foi possível falar com o servidor. Verifique sua internet.',
        );
      }
    }
  }

  Future<void> _confirmLeave() async {
    final s = ref.read(onlineGameControllerProvider);
    final playing = s?.room?.status == GameRoomStatus.playing;
    if (playing &&
        !await confirmLeaveGame(
          context,
          message: 'O computador joga no seu lugar até o fim da partida.',
        )) {
      return;
    }
    await _leave();
  }

  Future<void> _leave() async {
    if (_leaving) return;
    _leaving = true;
    await _ctrl.leave();
    if (mounted) context.go('/');
  }

  @override
  Widget build(BuildContext context) {
    final s = ref.watch(onlineGameControllerProvider);
    if (s == null) {
      return AppScaffold(
        title: 'Jogo online',
        body: Center(
          child: AppButton(
            label: 'Jogar truco',
            onPressed: () => context.go('/jogo'),
          ),
        ),
      );
    }
    if (s.closed && !_leaving) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        showAppToast(context, 'A sala foi encerrada.');
        _leave();
      });
    }
    final room = s.room;
    final model = _ctrl.modelOf(s);
    final Widget body;
    if (room == null) {
      body = AppScaffold(
        title: 'Sala ${s.code}',
        body: const Center(child: AppProgress()),
      );
    } else if (room.status == GameRoomStatus.lobby || model == null) {
      body = _Lobby(
        room: room,
        sending: s.sending,
        isHost: _ctrl.isHost,
        myId: _ctrl.myId,
        onLeave: _confirmLeave,
        run: _run,
      );
    } else {
      final host = _ctrl.isHost;
      body = GameTable(
        model: model,
        actions: GameTableActions(
          playCard: (card, {covered = false}) =>
              _run(() => _ctrl.playCard(card, covered: covered)),
          playBlind: (i) => _run(() => _ctrl.playBlind(i)),
          raise: () => _run(_ctrl.raise),
          accept: () => _run(_ctrl.accept),
          fold: () => _run(_ctrl.fold),
          onLeave: model.view.phase == GamePhase.gameOver
              ? _leave
              : _confirmLeave,
          onRematch: host && room.status == GameRoomStatus.finished
              ? () async {
                  await Ads.beforeGame(ref);
                  await _run(_ctrl.start);
                }
              : null,
          gameOverExtra: host
              ? null
              : 'Esperando quem criou a sala chamar a revanche.',
        ),
      );
    }
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) _confirmLeave();
      },
      child: body,
    );
  }
}

class _Lobby extends ConsumerWidget {
  const _Lobby({
    required this.room,
    required this.sending,
    required this.isHost,
    required this.myId,
    required this.onLeave,
    required this.run,
  });

  final GameRoomSnapshot room;
  final bool sending;
  final bool isHost;
  final String? myId;
  final VoidCallback onLeave;
  final Future<void> Function(Future<void> Function()) run;

  Future<void> _pickGroup(BuildContext context, WidgetRef ref) async {
    final ctrl = ref.read(onlineGameControllerProvider.notifier);
    final List<Group> groups;
    try {
      final mine = await ref.read(myGroupsProvider.future);
      final shared = await ref
          .read(groupsRepositoryProvider)!
          .groupsShared(
            [for (final g in mine) g.id],
            {for (final s in room.seats) s.userId},
          );
      groups = [
        for (final g in mine)
          if (shared.contains(g.id)) g,
      ];
    } on Object {
      if (context.mounted) {
        showAppToast(context, 'Não foi possível carregar os grupos.');
      }
      return;
    }
    if (!context.mounted) return;
    if (groups.isEmpty) {
      showAppToast(
        context,
        'Nenhum grupo tem todos os jogadores desta sala como membros.',
      );
      return;
    }
    final picked = await showAppPicker<String?>(
      context,
      title: 'Contar para o ranking de qual grupo?',
      message:
          'Aparecem só os grupos dos quais todos os jogadores da sala são '
          'membros. A partida sempre conta também para o ranking geral.',
      selected: room.groupId,
      options: [
        const AppPickerOption(label: 'Nenhum grupo', value: null),
        for (final g in groups) AppPickerOption(label: g.name, value: g.id),
      ],
    );
    if (picked == null || picked.value == room.groupId) return;
    await run(() => ctrl.setGroup(picked.value));
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ctrl = ref.read(onlineGameControllerProvider.notifier);
    final theme = Theme.of(context);
    const white70 = TextStyle(color: Colors.white70);
    final groupName = room.groupId == null
        ? null
        : ref
              .watch(myGroupsProvider)
              .value
              ?.where((g) => g.id == room.groupId)
              .firstOrNull
              ?.name;

    Widget seatTile(int seat) {
      final who = room.at(seat);
      final me = who != null && who.userId == myId;
      return AppTile(
        leading: AppTileIcon(
          who == null ? AppIcon.seat : AppIcon.person,
          color: who == null ? Colors.blueGrey : AppColors.felt,
        ),
        title: who == null
            ? 'Computador (${room.botLevel.label.toLowerCase()})'
            : (me ? '${who.name} (você)' : who.name),
        subtitle: who == null
            ? 'Lugar vazio. Toque para sentar aqui.'
            : (who.userId == room.hostId ? 'Criou a sala' : null),
        onTap: who == null && !sending ? () => run(() => ctrl.sit(seat)) : null,
      );
    }

    return AppScaffold(
      title: 'Sala ${room.code}',
      actions: [
        IconButton(
          tooltip: 'Sair da sala',
          icon: Icon(context.icon(AppIcon.close)),
          onPressed: onLeave,
        ),
      ],
      children: [
        AppCard(
          color: AppColors.felt,
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Text(
                'Código da sala',
                style: theme.textTheme.labelLarge?.copyWith(
                  color: Colors.white70,
                ),
              ),
              const SizedBox(height: 4),
              FittedBox(
                fit: BoxFit.scaleDown,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SelectableText(
                      room.code,
                      style: theme.textTheme.displaySmall?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 6,
                      ),
                    ),
                    IconButton(
                      tooltip: 'Copiar convite',
                      color: Colors.white,
                      icon: Icon(context.icon(AppIcon.copy)),
                      onPressed: () {
                        Clipboard.setData(
                          ClipboardData(
                            text:
                                'Vem jogar truco comigo: '
                                '${gameRoomInviteLink(room.code)}\n'
                                'Código: ${room.code}',
                          ),
                        );
                        showAppToast(context, 'Convite copiado');
                      },
                    ),
                  ],
                ),
              ),
              const Text(
                'Em "Jogar truco", toque em "Entrar com código". Ou copie o '
                'convite com o link e mande no grupo. Os lugares vazios '
                'ficam com o computador.',
                textAlign: TextAlign.center,
                style: white70,
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        AppSection(
          header: 'Nós (dupla 1)',
          children: [seatTile(0), seatTile(2)],
        ),
        AppSection(
          header: 'Eles (dupla 2)',
          children: [seatTile(1), seatTile(3)],
        ),
        AppSection(
          header: 'Partida',
          footer: room.rules.summary,
          children: [
            AppTile(
              title: 'Partida rankeada',
              subtitle: !room.ranked
                  ? 'Amistosa: fica só no histórico.'
                  : room.rankable
                  ? 'Conta para o ranking.'
                  : 'Só conta para o ranking com 4 pessoas com conta, '
                        'sem o computador.',
              trailing: AppSwitch(
                value: room.ranked,
                onChanged: isHost && !sending
                    ? (v) => run(() => ctrl.setRanked(v))
                    : null,
              ),
            ),
            if (room.ranked)
              AppTile(
                title: 'Grupo',
                subtitle: room.groupId == null
                    ? 'Só o ranking geral'
                    : (groupName ?? 'Grupo escolhido'),
                onTap: isHost ? () => _pickGroup(context, ref) : null,
              ),
            if (room.seats.length < 4)
              Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Nível do computador'),
                    const SizedBox(height: 8),
                    AppSegmented<AiLevel>(
                      segments: {for (final l in AiLevel.values) l: l.label},
                      value: room.botLevel,
                      onChanged: isHost && !sending
                          ? (v) => run(() => ctrl.setBotLevel(v))
                          : (_) {},
                    ),
                  ],
                ),
              ),
          ],
        ),
        Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: SizedBox(
              width: double.infinity,
              child: isHost
                  ? AppButton(
                      label: 'Começar a partida',
                      icon: context.icon(AppIcon.play),
                      onPressed: sending
                          ? null
                          : () async {
                              await Ads.beforeGame(ref);
                              await run(ctrl.start);
                            },
                    )
                  : const Text(
                      'Esperando quem criou a sala começar a partida…',
                      textAlign: TextAlign.center,
                    ),
            ),
          ),
        ),
      ],
    );
  }
}

/// Types a room code (or takes it from an invite link) and joins.
class JoinGameScreen extends ConsumerStatefulWidget {
  const JoinGameScreen({super.key, this.initialCode});

  final String? initialCode;

  @override
  ConsumerState<JoinGameScreen> createState() => _JoinGameState();
}

class _JoinGameState extends ConsumerState<JoinGameScreen> {
  late final _code = TextEditingController(
    text: widget.initialCode?.toUpperCase() ?? '',
  );
  bool _busy = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    if ((widget.initialCode ?? '').length == 6) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _join());
    }
  }

  @override
  void dispose() {
    _code.dispose();
    super.dispose();
  }

  Future<void> _join() async {
    final code = _code.text.trim().toUpperCase();
    if (code.length != 6) {
      setState(() => _error = 'O código tem 6 letras e números.');
      return;
    }
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await ref.read(onlineGameControllerProvider.notifier).join(code);
      if (mounted) context.go('/jogo/sala');
    } on GameRoomError catch (e) {
      setState(() => _error = e.message);
    } on Object catch (e) {
      debugPrint('Join failed: $e');
      setState(
        () => _error = 'Não foi possível entrar. Verifique sua internet.',
      );
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Entrar na sala',
      maxWidth: 480,
      children: [
        const Text('Digite o código da sala de jogo que te mandaram.'),
        const SizedBox(height: 24),
        AppTextField(
          controller: _code,
          label: 'Código',
          autofocus: true,
          maxLength: 6,
          textCapitalization: TextCapitalization.characters,
          onSubmitted: (_) => _join(),
        ),
        if (_error != null) ...[
          const SizedBox(height: 12),
          Text(
            _error!,
            style: TextStyle(color: Theme.of(context).colorScheme.error),
          ),
        ],
        const SizedBox(height: 24),
        _busy
            ? const Center(child: AppProgress())
            : AppButton(label: 'Entrar', onPressed: _join),
      ],
    );
  }
}
