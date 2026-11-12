import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../config/env.dart';
import '../../data/ads.dart';
import '../../data/game_room_repository.dart';
import '../../data/groups_repository.dart';
import '../../data/last_room_repository.dart';
import '../../data/tournaments.dart' show bestOfLabel;
import '../../domain/game/ai.dart';
import '../../domain/game/truco_game.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/theme/app_theme.dart';
import 'game_table.dart';
import 'online_game_controller.dart';
import 'rules_screen.dart';
import '../groups/summon_widgets.dart';

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
    if (s?.room?.rules.isSlow ?? false) {
      // A slow game goes on without anyone watching: leaving the screen
      // keeps the seat, unless the person really wants out.
      final choice = await showAppDialog<String>(
        context,
        title: 'Partida lenta',
        message:
            'Você continua na partida e recebe um aviso quando for a sua '
            'vez. Ela também fica na tela inicial.',
        actions: const [
          AppDialogAction(label: 'Voltar depois', value: 'close'),
          AppDialogAction(label: 'Continuar aqui', value: 'stay'),
          AppDialogAction(
            label: 'Abandonar a partida',
            value: 'leave',
            isDestructive: true,
          ),
        ],
      );
      if (!mounted) return;
      if (choice == 'close') {
        _leaving = true;
        _ctrl.close();
        context.go('/');
      } else if (choice == 'leave') {
        await _leave();
      }
      return;
    }
    if (playing &&
        !await confirmLeaveGame(
          context,
          message: 'O computador joga no seu lugar até o fim da partida.',
        )) {
      return;
    }
    await _leave();
  }

  /// The room code during the game, like the scorekeeper's.
  Future<void> _showCode(String code) async {
    final copy = await showAppDialog<bool>(
      context,
      title: 'Sala $code',
      message:
          'Quem quiser entrar toca em "Jogar truco" > "Entrar com código" '
          'e digita $code.',
      actions: const [
        AppDialogAction(label: 'Fechar', value: false),
        AppDialogAction(label: 'Copiar convite', value: true, isPrimary: true),
      ],
    );
    if (copy != true) return;
    await Clipboard.setData(
      ClipboardData(
        text:
            'Vem jogar truco comigo: ${gameRoomInviteLink(code)}\n'
            'Código: $code',
      ),
    );
    if (mounted) showAppToast(context, 'Convite copiado');
  }

  Future<void> _leave() async {
    if (_leaving) return;
    _leaving = true;
    // Players of a tournament match go back to the tournament.
    final room = ref.read(onlineGameControllerProvider)?.room;
    final back = room == null || !room.isTournament
        ? '/'
        : room.tournamentId == null
        ? '/torneios'
        : '/torneios/${room.tournamentId}';
    // Go first: leaving takes a round trip to the server.
    final leaving = _ctrl.leave();
    if (mounted) context.go(back);
    await leaving;
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
          onRematch: room.isTournament
              ? (room.status == GameRoomStatus.finished && !room.seriesOver
                    ? () => _run(_ctrl.start)
                    : null)
              : host && room.status == GameRoomStatus.finished
              ? () async {
                  await Ads.beforeGame(ref);
                  await _run(_ctrl.start);
                }
              : null,
          onShowCode: () => _showCode(room.code),
          rematchLabel: room.isTournament
              ? 'Próxima partida (${room.wins.$1} × ${room.wins.$2})'
              : 'Revanche',
          gameOverExtra: room.isTournament
              ? (room.seriesOver || room.bestOf <= 1
                    ? 'Fim do jogo do torneio. O resultado já está na chave.'
                    : 'Série ${bestOfLabel(room.bestOf).toLowerCase()}: '
                          '${room.wins.$1} × ${room.wins.$2}.')
              : host
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

    final standing = myId != null && room.seatOf(myId!) == null;

    Widget seatTile(int seat) {
      final who = room.at(seat);
      final me = who != null && who.userId == myId;
      return AppTile(
        leading: AppTileIcon(
          who == null ? AppIcon.seat : AppIcon.person,
          color: who == null ? Colors.blueGrey : AppColors.felt,
        ),
        title: who == null
            ? (room.isTournament
                  ? 'Esperando o jogador'
                  : 'Computador (${room.botLevel.label.toLowerCase()})')
            : (me ? '${who.name} (você)' : who.name),
        subtitle: who == null
            ? (room.isTournament
                  ? 'Lugar de quem joga este jogo do torneio.'
                  : 'Lugar vazio. Toque para sentar aqui.')
            : (who.userId == room.hostId && !room.isTournament
                  ? 'Criou a sala'
                  : null),
        // Getting up frees the seat; nobody takes someone else's.
        trailing: me && !room.isTournament
            ? AppTextButton(
                label: 'Levantar',
                onPressed: sending ? null : () => run(ctrl.stand),
              )
            : null,
        onTap: who == null && !sending && !room.isTournament
            ? () => run(() => ctrl.sit(seat))
            : null,
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
              const SizedBox(height: 8),
              if (room.isTournament)
                AppButton(
                  label: 'Chamar os jogadores',
                  icon: context.icon(AppIcon.groups),
                  tonal: true,
                  onPressed: sending || room.seats.length >= 4
                      ? null
                      : () => run(() async {
                          await ctrl.callPlayers();
                          if (context.mounted) {
                            showAppToast(context, 'Chamamos quem falta.');
                          }
                        }),
                )
              else
                AppButton(
                  label: 'Intimar o grupo',
                  icon: context.icon(AppIcon.groups),
                  tonal: true,
                  onPressed: () =>
                      summonToRoom(context, ref, code: room.code, game: true),
                ),
              const SizedBox(height: 8),
              Text(
                'Em "Jogar truco", toque em "Entrar com código". Ou copie o '
                'convite com o link e mande no grupo. '
                '${room.rules.isSlow ? 'A partida lenta começa com 4 pessoas.' : 'Os lugares vazios ficam com o computador.'}',
                textAlign: TextAlign.center,
                style: white70,
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        if (standing)
          const AppSection(
            children: [
              AppTile(
                title: 'Você está em pé',
                subtitle: 'Toque num lugar vazio para sentar.',
              ),
            ],
          ),
        AppSection(
          header: 'Nós (dupla 1)',
          children: [seatTile(0), seatTile(2)],
        ),
        AppSection(
          header: 'Eles (dupla 2)',
          children: [seatTile(1), seatTile(3)],
        ),
        TableRulesSection(
          rules: room.rules,
          footer: isHost
              ? 'Para mudar, saia e crie outra sala em "Jogar truco".'
              : 'Escolhidas por quem criou a sala.',
        ),
        AppSection(
          children: [
            AppTile(
              title: 'Ver as regras do truco',
              leading: const AppTileIcon(AppIcon.info, color: Colors.blueGrey),
              onTap: () => context.push('/jogo/regras', extra: room.rules),
            ),
          ],
        ),
        if (!room.isTournament)
          AppSection(
            header: 'Partida',
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
              if (room.seats.length < 4 && !room.rules.isSlow)
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
              child: room.isTournament && room.seats.length >= 4
                  ? AppButton(
                      label: 'Começar a partida',
                      icon: context.icon(AppIcon.play),
                      onPressed: sending ? null : () => run(ctrl.start),
                    )
                  : room.isTournament
                  ? Text(
                      'Jogo do torneio: começa sozinho quando as 4 pessoas '
                      'entrarem (${room.seats.length} de 4 na sala).',
                      textAlign: TextAlign.center,
                    )
                  : isHost
                  ? AppButton(
                      label: room.rules.isSlow && room.seats.length < 4
                          ? (room.seats.length == 3
                                ? 'Falta 1 pessoa'
                                : 'Faltam ${4 - room.seats.length} pessoas')
                          : 'Começar a partida',
                      icon: context.icon(AppIcon.play),
                      onPressed:
                          sending ||
                              standing ||
                              (room.rules.isSlow && room.seats.length < 4)
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

  /// The room is full: it can still be watched.
  String? _full;

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
      _full = null;
    });
    try {
      await ref.read(onlineGameControllerProvider.notifier).join(code);
      if (mounted) context.go('/jogo/sala');
    } on GameRoomError catch (e) {
      setState(() {
        _error = e.message;
        _full = e.code == 'room_full' ? code : null;
      });
      if (const {
        'room_not_found',
        'room_full',
        'match_over',
        'not_in_match',
      }.contains(e.code)) {
        final last = ref.read(lastGameRoomRepositoryProvider);
        if (await last.load() == code) {
          await last.clear();
          ref.invalidate(lastGameRoomCodeProvider);
        }
      }
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
        if (_full != null && !_busy) ...[
          const SizedBox(height: 12),
          AppButton(
            label: 'Assistir',
            tonal: true,
            onPressed: () => context.push('/jogo/assistir?codigo=$_full'),
          ),
        ],
      ],
    );
  }
}
