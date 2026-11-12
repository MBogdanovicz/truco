import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/tournaments.dart';
import '../../domain/scorekeeper/team.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../game/game_table.dart';

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
