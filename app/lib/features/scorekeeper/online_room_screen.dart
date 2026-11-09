import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../config/env.dart';
import '../../domain/scorekeeper/match_engine.dart';
import '../../domain/scorekeeper/match_record.dart';
import '../../domain/scorekeeper/online/online_room.dart';
import '../../domain/scorekeeper/online/room_snapshot.dart';
import '../../domain/scorekeeper/team.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/keep_screen_on.dart';
import '../../ui/theme/app_theme.dart';
import 'online_room_controller.dart';
import 'scoreboard_view.dart';

/// Online room: lobby while players gather, then the shared scoreboard.
class OnlineRoomScreen extends ConsumerStatefulWidget {
  const OnlineRoomScreen({super.key});

  @override
  ConsumerState<OnlineRoomScreen> createState() => _OnlineRoomState();
}

class _OnlineRoomState extends ConsumerState<OnlineRoomScreen> {
  bool _flipTop = false;

  static const _rejectionText = {
    IntentRejection.cooldown:
        'Sua dupla acabou de marcar. Aguarde alguns segundos.',
    IntentRejection.notYourTeam: 'Você só pode marcar os tentos da sua dupla.',
    IntentRejection.matchFinished: 'A partida já terminou.',
    IntentRejection.invalidDelta: 'Valor inválido.',
    IntentRejection.nothingToUndo: 'Não há nada para desfazer.',
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
    await ref.read(onlineRoomControllerProvider.notifier).leave();
    if (mounted) context.go('/');
  }

  @override
  Widget build(BuildContext context) {
    ref.listen(onlineRoomControllerProvider.select((v) => v?.lastRejection), (
      _,
      next,
    ) {
      if (next != null) showAppToast(context, _rejectionText[next.$1]!);
    });
    final view = ref.watch(onlineRoomControllerProvider);
    final snap = view?.snapshot;

    final Widget body;
    var title = 'Sala';
    var dark = false;
    if (view == null || snap?.phase == RoomPhase.closed) {
      body = _Message(
        text: 'A sala foi encerrada.',
        action: AppButton(label: 'Voltar ao início', onPressed: _leave),
      );
    } else if (snap == null) {
      body = const _Message(text: 'Conectando à sala…', progress: true);
    } else if (snap.phase == RoomPhase.lobby) {
      title = 'Sala ${snap.code}';
      body = _Lobby(room: view.room, snap: snap);
    } else {
      title = 'Marcador';
      dark = true;
      body = _Game(
        room: view.room,
        snap: snap,
        flipTop: _flipTop,
        onClose: _leave,
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
          backgroundColor: dark ? AppColors.feltDark : null,
          barColor: dark ? AppColors.feltDark : null,
          actions: [
            if (dark)
              IconButton(
                tooltip: 'Virar placar de cima',
                color: Colors.white,
                icon: const Icon(Icons.screen_rotation_alt),
                onPressed: () => setState(() => _flipTop = !_flipTop),
              ),
            IconButton(
              tooltip: 'Sair',
              color: dark ? Colors.white : null,
              icon: const Icon(Icons.close),
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
  const _Message({required this.text, this.action, this.progress = false});

  final String text;
  final Widget? action;
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
          if (action != null) ...[const SizedBox(height: 16), action!],
        ],
      ),
    ),
  );
}

class _Lobby extends StatelessWidget {
  const _Lobby({required this.room, required this.snap});

  final OnlineRoom room;
  final RoomSnapshot snap;

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
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          color: AppColors.felt,
          child: Padding(
            padding: const EdgeInsets.all(16),
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
                        icon: const Icon(Icons.copy),
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
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: Colors.white70,
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),
        for (final team in Team.values)
          _TeamSeats(room: room, snap: snap, team: team, onAddGuest: _addGuest),
        const SizedBox(height: 16),
        if (room.isHost)
          AppButton(
            label: snap.canStart
                ? 'Começar partida'
                : 'Esperando as duas duplas',
            icon: Icons.play_arrow,
            onPressed: snap.canStart ? room.startGame : null,
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
    return Card(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 8, 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Icon(
                  Icons.circle,
                  size: 14,
                  color: team == Team.a ? AppColors.teamA : AppColors.teamB,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    snap.teamNames[team]!,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ),
              ],
            ),
            for (final index in RoomSnapshot.seatIndexesOf(team))
              _SeatRow(
                seat: seats[index],
                isMe: seats[index]?.userId == room.me.userId,
                isHostSeat: seats[index]?.userId == snap.hostUserId,
                canRemove:
                    room.isHost &&
                    seats[index] != null &&
                    seats[index]!.userId != snap.hostUserId,
                onRemove: () => room.removeSeat(index),
                onAddGuest: room.isHost && seats[index] == null
                    ? () => onAddGuest(context, team)
                    : null,
              ),
            if (mine?.team != team && hasRoom)
              Align(
                alignment: Alignment.centerRight,
                child: AppTextButton(
                  label: mine == null
                      ? 'Entrar nesta dupla'
                      : 'Trocar para esta dupla',
                  onPressed: () => room.pickTeam(team),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _SeatRow extends StatelessWidget {
  const _SeatRow({
    required this.seat,
    required this.isMe,
    required this.isHostSeat,
    required this.canRemove,
    required this.onRemove,
    this.onAddGuest,
  });

  final Seat? seat;
  final bool isMe;
  final bool isHostSeat;
  final bool canRemove;
  final VoidCallback onRemove;
  final VoidCallback? onAddGuest;

  @override
  Widget build(BuildContext context) {
    final s = seat;
    if (s == null) {
      return ListTile(
        dense: true,
        leading: const Icon(Icons.event_seat_outlined),
        title: const Text('Lugar livre', style: TextStyle(color: Colors.grey)),
        trailing: onAddGuest == null
            ? null
            : IconButton(
                tooltip: 'Adicionar convidado',
                icon: const Icon(Icons.person_add_alt),
                onPressed: onAddGuest,
              ),
      );
    }
    final tags = [
      if (isMe) 'você',
      if (isHostSeat) 'criou a sala',
      if (s.isGuest) 'convidado, sem app',
    ];
    return ListTile(
      dense: true,
      leading: Icon(s.isGuest ? Icons.person_outline : Icons.person),
      title: Text(s.name.isEmpty ? 'Jogador' : s.name),
      subtitle: tags.isEmpty ? null : Text(tags.join(' · ')),
      trailing: canRemove
          ? IconButton(
              tooltip: 'Remover',
              icon: const Icon(Icons.close),
              onPressed: onRemove,
            )
          : null,
    );
  }
}

class _Game extends StatelessWidget {
  const _Game({
    required this.room,
    required this.snap,
    required this.flipTop,
    required this.onClose,
  });

  final OnlineRoom room;
  final RoomSnapshot snap;
  final bool flipTop;
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context) {
    final state = snap.state;
    return Stack(
      children: [
        ScoreboardView(
          flipTop: flipTop,
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
        if (state.isFinished)
          _FinishedCard(room: room, snap: snap, onClose: onClose),
      ],
    );
  }
}

class _FinishedCard extends StatelessWidget {
  const _FinishedCard({
    required this.room,
    required this.snap,
    required this.onClose,
  });

  final OnlineRoom room;
  final RoomSnapshot snap;
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context) {
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
      child: Card(
        child: Padding(
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
              const SizedBox(height: 16),
              for (final t in Team.values)
                Row(
                  children: [
                    Icon(
                      (snap.rematchVotes[t] ?? false)
                          ? Icons.check_circle
                          : Icons.hourglass_empty,
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
                  onPressed: iVoted ? null : room.voteRematch,
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
