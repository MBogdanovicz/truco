import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/tournaments.dart';
import '../../domain/scorekeeper/team.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../data/game_room_repository.dart';
import '../game/game_table.dart';
import '../game/online_game_controller.dart';

/// "Assistir": a tournament match (by its room id) or a normal room (by its
/// code) seen from outside (no cards in hand), refreshed every few seconds.
class WatchMatchScreen extends ConsumerStatefulWidget {
  const WatchMatchScreen({super.key, this.roomId, this.code});
  final String? roomId;
  final String? code;

  @override
  ConsumerState<WatchMatchScreen> createState() => _WatchMatchState();
}

class _WatchMatchState extends ConsumerState<WatchMatchScreen> {
  SpectatedMatch? _match;
  String? _error;
  Timer? _timer;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _load();
    _timer = Timer.periodic(const Duration(seconds: 3), (_) => _load());
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _load() async {
    if (_loading) return;
    _loading = true;
    try {
      final m = await ref
          .read(tournamentsRepositoryProvider)!
          .spectate(roomId: widget.roomId, code: widget.code);
      if (!mounted) return;
      // When the players leave the room at the end, keep their names.
      final before = _match?.names;
      if (before != null) {
        for (var i = 0; i < 4; i++) {
          if (m.names[i] == '…') m.names[i] = before[i];
        }
      }
      setState(() {
        _match = m;
        _error = null;
      });
      _offerSeat(m);
      if (m.status == 'closed') _timer?.cancel();
    } on TournamentError catch (e) {
      // After the end the room closes: keep showing how it ended.
      if (mounted && _match == null) setState(() => _error = e.message);
      _timer?.cancel();
    } on Object {
      // Try again on the next tick.
    } finally {
      _loading = false;
    }
  }

  /// Normal rooms: someone left and the computer took the seat, so the
  /// spectator may sit (the game is no longer ranked). Asked once per seat.
  int _offered = 0;
  Future<void> _offerSeat(SpectatedMatch m) async {
    final code = widget.code;
    // Someone took a free seat: a later departure is news again.
    if (m.freeSeats < _offered) _offered = m.freeSeats;
    if (code == null || m.status != 'playing' || m.freeSeats <= _offered) {
      return;
    }
    _offered = m.freeSeats;
    final sit = await showAppDialog<bool>(
      context,
      title: 'Lugar vago na mesa',
      message:
          'Alguém saiu e o computador está jogando no lugar. Quer sentar à '
          'mesa? A partida deixa de contar para o ranking.',
      actions: const [
        AppDialogAction(label: 'Só assistir', value: false),
        AppDialogAction(label: 'Sentar', value: true, isPrimary: true),
      ],
    );
    if (sit != true || !mounted) return;
    try {
      await ref.read(onlineGameControllerProvider.notifier).join(code);
      _timer?.cancel();
      if (mounted) context.go('/jogo/sala');
    } on GameRoomError catch (e) {
      if (mounted) showAppToast(context, e.message);
    } on Object {
      if (mounted) {
        showAppToast(context, 'Não foi possível sentar. Tente de novo.');
      }
    }
  }

  void _close() => context.canPop()
      ? context.pop()
      : context.go(widget.code != null ? '/jogo' : '/torneios');

  @override
  Widget build(BuildContext context) {
    final m = _match;
    final view = m?.view;
    if (view == null) {
      return AppScaffold(
        title: 'Assistir',
        body: Center(
          child: _error != null
              ? Text(_error!, textAlign: TextAlign.center)
              : m == null
              ? const AppProgress()
              : const Text(
                  'O jogo ainda não começou.\nEsta tela atualiza sozinha.',
                  textAlign: TextAlign.center,
                ),
        ),
      );
    }
    return GameTable(
      model: GameTableModel(
        view: view,
        names: m!.names,
        wins: {Team.a: m.wins.$1, Team.b: m.wins.$2},
        status: m.status == 'finished' ? null : 'Assistindo',
        spectator: true,
      ),
      actions: GameTableActions(
        playCard: (_, {covered = false}) {},
        playBlind: (_) {},
        raise: () {},
        accept: () {},
        fold: () {},
        onLeave: _close,
        gameOverExtra: 'Você está assistindo a este jogo.',
      ),
    );
  }
}
