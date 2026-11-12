import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/tournaments.dart';
import '../../domain/scorekeeper/team.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../game/game_table.dart';

/// "Assistir": a tournament match seen from outside (no cards in hand),
/// refreshed every few seconds.
class WatchMatchScreen extends ConsumerStatefulWidget {
  const WatchMatchScreen({super.key, required this.roomId});
  final String roomId;

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
          .spectate(widget.roomId);
      if (!mounted) return;
      setState(() {
        _match = m;
        _error = null;
      });
      if (m.status == 'closed') _timer?.cancel();
    } on TournamentError catch (e) {
      if (mounted) setState(() => _error = e.message);
      _timer?.cancel();
    } on Object {
      // Try again on the next tick.
    } finally {
      _loading = false;
    }
  }

  void _close() => context.canPop() ? context.pop() : context.go('/torneios');

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
