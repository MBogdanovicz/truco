import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../config/env.dart';
import '../../data/ads.dart';
import '../../data/groups_repository.dart';
import '../../domain/scorekeeper/match_engine.dart';
import '../../domain/scorekeeper/match_record.dart';
import '../../domain/scorekeeper/online/online_room.dart';
import '../../domain/scorekeeper/online/room_snapshot.dart';
import '../../domain/scorekeeper/team.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/keep_screen_on.dart';
import '../../ui/theme/app_theme.dart';
import 'online_room_controller.dart';
import 'scoreboard_skin.dart';
import 'scoreboard_view.dart';

/// Online room: lobby while players gather, then the shared scoreboard.
class OnlineRoomScreen extends ConsumerStatefulWidget {
  const OnlineRoomScreen({super.key});

  @override
  ConsumerState<OnlineRoomScreen> createState() => _OnlineRoomState();
}

class _OnlineRoomState extends ConsumerState<OnlineRoomScreen> {
  bool _flipTop = false;

  /// Spectator chose to only watch, or was told both teams are full.
  bool _watching = false;
  bool _closing = false;

  /// The room ended (host closed it, or a whole team left): say so and go
  /// back to the home screen.
  void _leaveTo(String location) {
    if (_closing) return;
    _closing = true;
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await ref.read(onlineRoomControllerProvider.notifier).leave();
      if (mounted) context.go(location);
    });
  }

  void _onClosed() {
    if (_closing) return;
    _closing = true;
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      if (!mounted) return;
      showAppToast(context, 'A sala foi encerrada.');
      await ref.read(onlineRoomControllerProvider.notifier).leave();
      if (mounted) context.go('/');
    });
  }

  /// A spectator who can't join any team is told once.
  void _tellFull() {
    _watching = true;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        showAppToast(
          context,
          'As duas duplas estão completas. Você vai só assistir.',
        );
      }
    });
  }

  static const _noticeText = {
    RoomNotice.youAreHost:
        'Quem controlava a sala ficou sem conexão. Agora você controla a sala.',
    RoomNotice.hostChanged: 'Outro jogador passou a controlar a sala.',
    RoomNotice.replacedWhileAway:
        'Outro jogador assumiu a sala enquanto você estava sem conexão. '
        'O placar dele foi mantido.',
    RoomNotice.sameAccount:
        'Essa sala foi criada com a sua conta em outro aparelho. Para entrar, '
        'use uma conta diferente.',
  };

  static const _rejectionText = {
    IntentRejection.cooldown:
        'Sua dupla acabou de marcar. Aguarde alguns segundos.',
    IntentRejection.notYourTeam: 'Você só pode marcar os tentos da sua dupla.',
    IntentRejection.matchFinished: 'A partida já terminou.',
    IntentRejection.invalidDelta: 'Valor inválido.',
    IntentRejection.nothingToUndo: 'Não há nada para desfazer.',
    IntentRejection.teamFull:
        'Essa dupla já está completa. Tente a outra, ou espere alguém sair.',
  };

  Future<void> _leave() async {
    final view = ref.read(onlineRoomControllerProvider);
    final isHost = view?.room.isHost ?? false;
    final playing = view?.snapshot?.phase == RoomPhase.playing;
    if (view != null && (isHost || playing)) {
      final ok = await showAppDialog<bool>(
        context,
        title: isHost ? 'Encerrar a sala?' : 'Sair da sala?',
        message: isHost
            ? 'A sala será encerrada para todos. Partidas terminadas já foram salvas.'
            : 'Você pode voltar depois com o mesmo código.',
        actions: [
          const AppDialogAction(label: 'Cancelar', value: false),
          AppDialogAction(
            label: isHost ? 'Encerrar' : 'Sair',
            value: true,
            isDestructive: true,
          ),
        ],
      );
      if (ok != true) return;
    }
    _closing = true; // leaving on purpose: no "room closed" toast
    await ref.read(onlineRoomControllerProvider.notifier).leave();
    if (mounted) context.go('/');
  }

  /// Lets someone join a game already in progress.
  Future<void> _showCode(String code) async {
    final copy = await showAppDialog<bool>(
      context,
      title: 'Sala $code',
      message:
          'Quem quiser entrar toca em "Entrar com código" e digita $code. '
          'No iPhone, pelo site ${Env.webAppUrl.replaceFirst('https://', '')}.',
      actions: const [
        AppDialogAction(label: 'Fechar', value: false),
        AppDialogAction(label: 'Copiar convite', value: true, isPrimary: true),
      ],
    );
    if (copy != true) return;
    await Clipboard.setData(
      ClipboardData(
        text:
            'Entre na minha sala do Truco: ${Env.roomInviteLink(code)}\n'
            'Código: $code',
      ),
    );
    if (mounted) showAppToast(context, 'Convite copiado');
  }

  @override
  Widget build(BuildContext context) {
    ref.listen(onlineRoomControllerProvider.select((v) => v?.lastRejection), (
      _,
      next,
    ) {
      if (next != null) showAppToast(context, _rejectionText[next.$1]!);
    });
    ref.listen(onlineRoomControllerProvider.select((v) => v?.lastNotice), (
      _,
      next,
    ) {
      if (next == null) return;
      showAppToast(context, _noticeText[next.$1]!);
      if (next.$1 == RoomNotice.sameAccount) _leaveTo('/');
    });
    final view = ref.watch(onlineRoomControllerProvider);
    final snap = view?.snapshot;
    final skin = ref.watch(scoreboardSkinProvider);

    final Widget body;
    var title = 'Sala';
    var dark = false;
    if (view == null || snap?.phase == RoomPhase.closed) {
      _onClosed();
      body = const Center(child: AppProgress());
    } else if (snap == null) {
      body = const _Message(text: 'Conectando à sala…', progress: true);
    } else if (snap.phase == RoomPhase.lobby) {
      title = view.nearby ? 'Sala por perto' : 'Sala ${snap.code}';
      body = _Lobby(room: view.room, snap: snap, nearby: view.nearby);
    } else {
      title = 'Marcador';
      dark = true;
      final spectator =
          view.room.mySeat == null && !snap.state.isFinished && !_watching;
      final joinable = [
        for (final t in Team.values)
          if (snap.canJoinMidGame(t)) t,
      ];
      if (spectator && joinable.isEmpty) _tellFull();
      body = _Game(
        skin: skin,
        room: view.room,
        snap: snap,
        flipTop: _flipTop,
        onClose: _leave,
        joinTeams: spectator ? joinable : const [],
        onWatch: () => setState(() => _watching = true),
      );
    }

    return KeepScreenOn(
      child: PopScope(
        canPop: false,
        onPopInvokedWithResult: (didPop, _) {
          if (!didPop) _leave();
        },
        child: AppScaffold(
          title: title,
          backgroundColor: dark ? skin.bar : null,
          barColor: dark ? skin.bar : null,
          maxWidth: dark ? null : 960,
          actions: [
            if (dark && snap != null && !(view?.nearby ?? true))
              IconButton(
                tooltip: 'Código da sala',
                color: Colors.white,
                icon: Icon(context.icon(AppIcon.key)),
                onPressed: () => _showCode(snap.code),
              ),
            if (dark) const ScoreboardSkinButton(),
            if (dark)
              IconButton(
                tooltip: 'Virar placar de cima',
                color: Colors.white,
                icon: Icon(context.icon(AppIcon.flip)),
                onPressed: () => setState(() => _flipTop = !_flipTop),
              ),
            IconButton(
              tooltip: 'Sair',
              color: dark ? Colors.white : null,
              icon: Icon(context.icon(AppIcon.close)),
              onPressed: _leave,
            ),
          ],
          body: body,
        ),
      ),
    );
  }
}

class _Message extends StatelessWidget {
  const _Message({required this.text, this.progress = false});

  final String text;
  final bool progress;

  @override
  Widget build(BuildContext context) => Center(
    child: Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (progress) ...[const AppProgress(), const SizedBox(height: 16)],
          Text(text, textAlign: TextAlign.center),
        ],
      ),
    ),
  );
}

class _Lobby extends StatelessWidget {
  const _Lobby({required this.room, required this.snap, this.nearby = false});

  final OnlineRoom room;
  final RoomSnapshot snap;
  final bool nearby;

  Future<void> _addGuest(BuildContext context, Team team) async {
    final name = TextEditingController();
    final ok = await showAppDialog<bool>(
      context,
      title: 'Adicionar convidado',
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
        AppDialogAction(label: 'Adicionar', value: true, isPrimary: true),
      ],
    );
    if (ok == true) {
      await room.addGuest(
        team,
        name.text.trim().isEmpty ? 'Convidado' : name.text,
      );
    }
    name.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final mine = room.mySeat;
    final white70 = theme.textTheme.bodySmall?.copyWith(color: Colors.white70);
    final teams = [
      for (final team in Team.values)
        _TeamSeats(room: room, snap: snap, team: team, onAddGuest: _addGuest),
    ];
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        AppCard(
          color: AppColors.felt,
          padding: const EdgeInsets.all(20),
          child: nearby
              ? Text(
                  room.isHost
                      ? 'Sala aberta sem internet. Nos outros celulares, toque em '
                            '"Novo marcador" > "Por perto, sem internet" e escolha '
                            'esta sala. Deixe o app aberto.'
                      : 'Conectado sem internet ao celular de quem criou a sala.',
                  textAlign: TextAlign.center,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: Colors.white,
                  ),
                )
              : Column(
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
                            snap.code,
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
                                      'Entre na minha sala do Truco: '
                                      '${Env.roomInviteLink(snap.code)}\n'
                                      'Código: ${snap.code}',
                                ),
                              );
                              showAppToast(context, 'Convite copiado');
                            },
                          ),
                        ],
                      ),
                    ),
                    Text(
                      'No app, toque em "Entrar com código". No iPhone, abra '
                      '${Env.webAppUrl.replaceFirst('https://', '')}. '
                      'Ou copie o convite com o link e mande no grupo.',
                      textAlign: TextAlign.center,
                      style: white70,
                    ),
                  ],
                ),
        ),
        const SizedBox(height: 24),
        _RoomSettings(room: room, snap: snap),
        LayoutBuilder(
          builder: (context, constraints) =>
              constraints.maxWidth >= AppBreakpoints.medium
              ? Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(child: teams[0]),
                    const SizedBox(width: 16),
                    Expanded(child: teams[1]),
                  ],
                )
              : Column(children: teams),
        ),
        if (room.isHost)
          Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: SizedBox(
                width: double.infinity,
                child: AppButton(
                  label: snap.canStart
                      ? 'Começar partida'
                      : 'Esperando as duas duplas',
                  icon: context.icon(AppIcon.play),
                  onPressed: snap.canStart ? room.startGame : null,
                ),
              ),
            ),
          )
        else
          Text(
            mine == null
                ? 'Escolha a sua dupla.'
                : 'Aguardando quem criou a sala começar a partida…',
            textAlign: TextAlign.center,
          ),
      ],
    );
  }
}

class _TeamSeats extends StatelessWidget {
  const _TeamSeats({
    required this.room,
    required this.snap,
    required this.team,
    required this.onAddGuest,
  });

  final OnlineRoom room;
  final RoomSnapshot snap;
  final Team team;
  final Future<void> Function(BuildContext, Team) onAddGuest;

  @override
  Widget build(BuildContext context) {
    final seats = {for (final s in snap.seatsOf(team)) s.index: s};
    final mine = room.mySeat;
    final hasRoom = snap.freeSeatOf(team) != null;
    return AppSection(
      header: snap.teamNames[team]!,
      headerLeading: Icon(
        Icons.circle,
        size: 12,
        color: team == Team.a ? AppColors.teamA : AppColors.teamB,
      ),
      children: [
        for (final index in RoomSnapshot.seatIndexesOf(team))
          _seatTile(context, index, seats[index]),
        if (mine?.team != team && hasRoom)
          AppTile(
            leading: AppTileIcon(
              AppIcon.login,
              color: team == Team.a ? AppColors.teamA : AppColors.teamB,
            ),
            title: mine == null
                ? 'Entrar nesta dupla'
                : 'Trocar para esta dupla',
            onTap: () => room.pickTeam(team),
          ),
      ],
    );
  }

  Widget _seatTile(BuildContext context, int index, Seat? s) {
    final grey = Colors.grey.shade500;
    if (s == null) {
      return AppTile(
        leading: Icon(context.icon(AppIcon.seat), color: grey),
        title: 'Lugar livre',
        trailing: room.isHost
            ? IconButton(
                tooltip: 'Adicionar convidado',
                icon: Icon(context.icon(AppIcon.personAdd)),
                onPressed: () => onAddGuest(context, team),
              )
            : null,
      );
    }
    final isMe = s.userId == room.me.userId;
    final isHostSeat = s.userId == snap.hostUserId;
    final canRemove = room.isHost && s.userId != snap.hostUserId;
    final tags = [
      if (isMe) 'você',
      if (isHostSeat) 'criou a sala',
      if (s.isGuest) 'convidado, sem app',
    ];
    return AppTile(
      leading: Icon(
        context.icon(s.isGuest ? AppIcon.personOutline : AppIcon.person),
        color: team == Team.a ? AppColors.teamA : AppColors.teamB,
      ),
      title: s.name.isEmpty ? 'Jogador' : s.name,
      subtitle: tags.isEmpty ? null : tags.join(' · '),
      highlighted: isMe,
      trailing: canRemove
          ? IconButton(
              tooltip: 'Remover',
              icon: Icon(context.icon(AppIcon.close)),
              onPressed: () => room.removeSeat(index),
            )
          : null,
    );
  }
}

class _Game extends StatelessWidget {
  const _Game({
    required this.skin,
    required this.room,
    required this.snap,
    required this.flipTop,
    required this.onClose,
    this.joinTeams = const [],
    this.onWatch,
  });

  final ScoreboardSkin skin;
  final OnlineRoom room;
  final RoomSnapshot snap;
  final bool flipTop;
  final VoidCallback onClose;

  /// Teams a spectator may join (empty when not offering).
  final List<Team> joinTeams;
  final VoidCallback? onWatch;

  @override
  Widget build(BuildContext context) {
    final state = snap.state;
    return Stack(
      children: [
        ScoreboardView(
          flipTop: flipTop,
          skin: skin,
          model: ScoreboardModel(
            teamNames: snap.teamNames,
            seats: snap.seats,
            state: state,
            series: snap.series,
            canMark: room.canMark,
            cooldownRemaining: room.cooldownRemaining,
            onAdd: room.addPoints,
            onUndo: room.undo,
            highlightTeam: room.mySeat?.team,
          ),
        ),
        if (joinTeams.isNotEmpty)
          _JoinGameBar(
            room: room,
            snap: snap,
            teams: joinTeams,
            onWatch: onWatch ?? () {},
          ),
        if (state.isFinished)
          _FinishedCard(room: room, snap: snap, onClose: onClose),
        if (!room.isConnected) const _ConnectionLost(),
      ],
    );
  }
}

/// For someone who opened a room with a game already going: pick a team to
/// play (a free seat, or the place of a guest or of someone who left).
class _JoinGameBar extends StatelessWidget {
  const _JoinGameBar({
    required this.room,
    required this.snap,
    required this.teams,
    required this.onWatch,
  });

  final OnlineRoom room;
  final RoomSnapshot snap;
  final List<Team> teams;
  final VoidCallback onWatch;

  @override
  Widget build(BuildContext context) => Align(
    alignment: Alignment.bottomCenter,
    child: SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 520),
          child: AppCard(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'A partida já começou. Quer jogar numa dupla ou só assistir?',
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    for (final t in teams) ...[
                      Expanded(
                        child: AppButton(
                          label: 'Jogar na ${snap.teamNames[t]}',
                          onPressed: () => room.pickTeam(t),
                        ),
                      ),
                      if (t != teams.last) const SizedBox(width: 8),
                    ],
                  ],
                ),
                AppTextButton(label: 'Só assistir', onPressed: onWatch),
              ],
            ),
          ),
        ),
      ),
    ),
  );
}

/// Shown while this device is out of touch with the room.
class _ConnectionLost extends StatelessWidget {
  const _ConnectionLost();

  @override
  Widget build(BuildContext context) => Align(
    alignment: Alignment.topCenter,
    child: Container(
      margin: const EdgeInsets.all(12),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.black87,
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox.square(
            dimension: 16,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: Colors.white,
            ),
          ),
          SizedBox(width: 12),
          Flexible(
            child: Text(
              'Sem conexão com a sala. Reconectando…',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    ),
  );
}

class _FinishedCard extends ConsumerWidget {
  const _FinishedCard({
    required this.room,
    required this.snap,
    required this.onClose,
  });

  final OnlineRoom room;
  final RoomSnapshot snap;
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = snap.state;
    final winner = state.winner!;
    final tally = snap.series.recordWin(winner);
    final myTeam = room.mySeat?.team;
    final iVoted = myTeam != null && (snap.rematchVotes[myTeam] ?? false);
    final theme = Theme.of(context);
    return Container(
      color: Colors.black54,
      alignment: Alignment.center,
      padding: const EdgeInsets.all(24),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 440),
        child: AppCard(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                '${snap.teamNames[winner]} venceu!',
                textAlign: TextAlign.center,
                style: theme.textTheme.headlineSmall,
              ),
              const SizedBox(height: 4),
              Text(
                '${state.scoreOf(Team.a)} × ${state.scoreOf(Team.b)}'
                '${tally.gamesPlayed > 1 ? '  ·  Série ${tally.winsA} × ${tally.winsB}' : ''}',
                textAlign: TextAlign.center,
              ),
              if (state.isShutout) ...[
                const SizedBox(height: 12),
                Text(
                  switch (myTeam) {
                    null =>
                      'Doze a zero! ${snap.teamNames[winner.other]} passa por '
                          'baixo da mesa!',
                    _ when myTeam == winner => 'Uh! Doze a zero!',
                    _ => 'Passa por baixo da mesa!',
                  },
                  textAlign: TextAlign.center,
                  style: theme.textTheme.titleLarge?.copyWith(
                    color: myTeam != winner.other
                        ? AppColors.gold
                        : theme.colorScheme.error,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
              const SizedBox(height: 16),
              for (final t in Team.values)
                Row(
                  children: [
                    Icon(
                      (snap.rematchVotes[t] ?? false)
                          ? context.icon(AppIcon.check)
                          : context.icon(AppIcon.waiting),
                      size: 18,
                      color: (snap.rematchVotes[t] ?? false)
                          ? AppColors.felt
                          : Colors.grey,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        '${snap.teamNames[t]}: ${(snap.rematchVotes[t] ?? false) ? 'quer revanche' : 'decidindo…'}',
                      ),
                    ),
                  ],
                ),
              const SizedBox(height: 16),
              if (myTeam != null)
                AppButton(
                  label: iVoted ? 'Aguardando a outra dupla' : 'Revanche',
                  onPressed: iVoted
                      ? null
                      : () async {
                          await Ads.beforeGame(ref);
                          await room.voteRematch();
                        },
                ),
              if (room.canMark(winner))
                AppTextButton(
                  label: 'Corrigir placar',
                  onPressed: () => room.undo(winner),
                ),
              AppTextButton(
                label: room.isHost ? 'Encerrar sala' : 'Sair',
                onPressed: onClose,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Ranked/friendly and group choice. Editable by the host, read-only for others.
class _RoomSettings extends ConsumerWidget {
  const _RoomSettings({required this.room, required this.snap});

  final OnlineRoom room;
  final RoomSnapshot snap;

  Future<void> _pickGroup(BuildContext context, WidgetRef ref) async {
    final List<Group> groups;
    try {
      final mine = await ref.read(myGroupsProvider.future);
      final players = {
        for (final s in snap.seats)
          if (s.userId != null) s.userId!,
      };
      final shared = await ref.read(groupsRepositoryProvider)!.groupsShared([
        for (final g in mine) g.id,
      ], players);
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
    final current = snap.group?.id;
    final picked = await showAppPicker<String?>(
      context,
      title: 'Contar para o ranking de qual grupo?',
      message:
          'Aparecem só os grupos dos quais todos os jogadores da sala são '
          'membros. A partida sempre conta também para o ranking geral.',
      selected: current,
      options: [
        const AppPickerOption(label: 'Nenhum grupo', value: null),
        for (final g in groups) AppPickerOption(label: g.name, value: g.id),
      ],
    );
    // Dismissed: keep the current choice.
    if (picked == null || picked.value == current) return;
    final group = groups.where((g) => g.id == picked.value).firstOrNull;
    await room.setGroup(
      group == null ? null : RoomGroup(id: group.id, name: group.name),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final host = room.isHost;
    return AppSection(
      header: 'Partida',
      children: [
        AppTile(
          title: 'Partida rankeada',
          subtitle: snap.ranked
              ? 'Conta para o ranking quando os 4 jogadores têm conta.'
              : 'Amistosa: fica só no histórico.',
          trailing: AppSwitch(
            value: snap.ranked,
            onChanged: host ? room.setRanked : null,
          ),
        ),
        if (snap.ranked)
          AppTile(
            title: 'Grupo',
            subtitle: snap.group?.name ?? 'Só o ranking geral',
            onTap: host ? () => _pickGroup(context, ref) : null,
          ),
      ],
    );
  }
}
