import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/auth_repository.dart';
import '../../domain/scorekeeper/match_record.dart';
import '../../domain/scorekeeper/team.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/theme/app_theme.dart';
import 'scorekeeper_controller.dart';

/// Chooses team names and players for a single-device game.
///
/// Seats 0 and 2 play for team A, seats 1 and 3 for team B (partners sit
/// across from each other). Empty player names are allowed.
class ScorekeeperSetupScreen extends ConsumerStatefulWidget {
  const ScorekeeperSetupScreen({super.key});

  @override
  ConsumerState<ScorekeeperSetupScreen> createState() => _SetupState();
}

class _SetupState extends ConsumerState<ScorekeeperSetupScreen> {
  final _teamA = TextEditingController(text: 'Nós');
  final _teamB = TextEditingController(text: 'Eles');
  late final List<TextEditingController> _players;

  @override
  void initState() {
    super.initState();
    final me = ref.read(authRepositoryProvider).currentUser;
    _players = List.generate(4, (i) => TextEditingController(text: i == 0 ? me?.displayName ?? '' : ''));
  }

  @override
  void dispose() {
    for (final c in [_teamA, _teamB, ..._players]) {
      c.dispose();
    }
    super.dispose();
  }

  void _start() {
    final me = ref.read(authRepositoryProvider).currentUser;
    final seats = <Seat>[];
    for (var i = 0; i < 4; i++) {
      final name = _players[i].text.trim();
      final mine = i == 0 && me != null && name == me.displayName;
      if (name.isEmpty && !mine) continue;
      seats.add(Seat(
        index: i,
        team: i.isEven ? Team.a : Team.b,
        name: name,
        userId: mine ? me.id : null,
      ));
    }
    String teamName(TextEditingController c, String fallback) =>
        c.text.trim().isEmpty ? fallback : c.text.trim();
    ref.read(scorekeeperControllerProvider.notifier).start(MatchSetup(
          teamNames: {Team.a: teamName(_teamA, 'Nós'), Team.b: teamName(_teamB, 'Eles')},
          seats: seats,
        ));
    context.go('/marcador/partida');
  }

  Widget _teamCard(String label, Color color, TextEditingController team, List<int> seats) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(children: [
              Icon(Icons.circle, color: color, size: 14),
              const SizedBox(width: 8),
              Text(label, style: Theme.of(context).textTheme.titleMedium),
            ]),
            const SizedBox(height: 12),
            AppTextField(controller: team, label: 'Nome da dupla', maxLength: 20,
                textCapitalization: TextCapitalization.words),
            const SizedBox(height: 8),
            for (final s in seats) ...[
              AppTextField(
                controller: _players[s],
                label: 'Jogador ${s ~/ 2 + 1} (opcional)',
                maxLength: 24,
                textCapitalization: TextCapitalization.words,
              ),
              const SizedBox(height: 8),
            ],
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Novo marcador',
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Um aparelho marca os pontos das duas duplas. '
            'Jogadores sem conta entram como convidados e a partida não conta para o ranking.',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 16),
          _teamCard('Dupla 1', AppColors.teamA, _teamA, const [0, 2]),
          const SizedBox(height: 12),
          _teamCard('Dupla 2', AppColors.teamB, _teamB, const [1, 3]),
          const SizedBox(height: 24),
          AppButton(label: 'Começar partida', icon: Icons.play_arrow, onPressed: _start),
        ],
      ),
    );
  }
}
