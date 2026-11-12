import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/game_prefs.dart';
import '../../domain/game/rules.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../game/rule_options.dart';
import '../game/rules_screen.dart' show turnSecondsLabel;
import '../groups/summon_widgets.dart';
import '../scorekeeper/scoreboard_skin.dart';

/// "Configurações": the player's preferred table rules (the starting point of
/// every game, room and tournament they create), notifications and looks.
class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final rules = ref.watch(preferredRulesProvider);
    final notifier = ref.read(preferredRulesProvider.notifier);
    final skin = ref.watch(scoreboardSkinProvider);
    return AppScaffold(
      title: 'Configurações',
      children: [
        AppSection(
          header: 'Regras preferidas',
          footer:
              'Usadas quando você cria um jogo, uma sala ou um torneio. Dá '
              'para mudar em cada partida, sem mexer aqui.',
          children: [
            ...ruleOptionTiles(rules, notifier.set),
            AppTile(
              title: 'Ver as regras',
              leading: const AppTileIcon(AppIcon.info, color: Colors.blueGrey),
              onTap: () => context.push(
                '/jogo/regras?fixas='
                '${rules.manilhaMode == ManilhaMode.fixed ? 1 : 0}',
              ),
            ),
          ],
        ),
        AppSection(
          header: 'Tempo de jogada online',
          footer: 'Quando o tempo acaba, o computador joga pela pessoa.',
          children: [
            Padding(
              padding: const EdgeInsets.all(12),
              child: AppSegmented<int>(
                segments: {
                  for (final t in TrucoRules.turnSecondsOptions)
                    t: turnSecondsLabel(t),
                },
                value: rules.turnSeconds,
                onChanged: (v) => notifier.set(rules.copyWith(turnSeconds: v)),
              ),
            ),
          ],
        ),
        AppSection(
          header: 'Visual',
          children: [
            AppTile(
              title: 'Visual do placar',
              subtitle: skin.label,
              leading: const AppTileIcon(AppIcon.palette, color: Colors.purple),
              onTap: () => pickScoreboardSkin(context, ref),
            ),
          ],
        ),
        const PushToggleTile(),
        const SizedBox(height: 24),
      ],
    );
  }
}
