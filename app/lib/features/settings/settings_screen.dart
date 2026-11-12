import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/game_prefs.dart';
import '../../domain/game/rules.dart';
import '../../domain/game/terms.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../game/rule_options.dart';
import '../game/rules_screen.dart' show turnSecondsLabel;
import '../groups/summon_widgets.dart';
import '../scorekeeper/scoreboard_skin.dart';

/// "Configurações": the player's preferred table rules (the starting point of
/// every game, room and tournament they create), notifications and looks.
class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  Future<void> _pickManilha(
    BuildContext context,
    WidgetRef ref,
    ManilhaSlot slot,
  ) async {
    final terms = ref.read(termsProvider);
    final current = terms.nameOf(slot);
    final picked = await showAppPicker<TermName?>(
      context,
      title: 'Manilha de ${slot.label.toLowerCase()}',
      selected: slot.common.contains(current) ? current : null,
      options: [
        for (final n in slot.common) AppPickerOption(label: n.name, value: n),
        AppPickerOption(
          label: 'Outro nome…',
          subtitle: slot.common.contains(current) ? null : current.name,
          value: null,
        ),
      ],
    );
    if (picked == null || !context.mounted) return;
    final name = picked.value ?? await _askName(context, current);
    if (name == null) return;
    await ref.read(termsProvider.notifier).set(terms.withManilha(slot, name));
  }

  Future<TermName?> _askName(BuildContext context, TermName current) async {
    final text = TextEditingController(text: current.name);
    var feminine = current.feminine;
    final ok = await showAppDialog<bool>(
      context,
      title: 'Como você chama essa manilha?',
      content: StatefulBuilder(
        builder: (ctx, setState) => Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 12),
            AppTextField(
              controller: text,
              label: 'Nome',
              autofocus: true,
              maxLength: 20,
            ),
            const SizedBox(height: 8),
            AppSegmented<bool>(
              segments: const {false: 'o …', true: 'a …'},
              value: feminine,
              onChanged: (v) => setState(() => feminine = v),
            ),
          ],
        ),
      ),
      actions: const [
        AppDialogAction(label: 'Cancelar', value: false),
        AppDialogAction(label: 'Salvar', value: true, isPrimary: true),
      ],
    );
    final name = text.text.trim().toLowerCase();
    text.dispose();
    if (ok != true || name.isEmpty) return null;
    return TermName(name, feminine: feminine);
  }

  Future<void> _pickTie(BuildContext context, WidgetRef ref) async {
    final terms = ref.read(termsProvider);
    final picked = await showAppPicker<TieVerb>(
      context,
      title: 'Rodada empatada',
      selected: terms.tie,
      options: [
        for (final v in TieVerb.values)
          AppPickerOption(label: tieLabel(v), value: v),
      ],
    );
    if (picked == null) return;
    await ref.read(termsProvider.notifier).set(terms.withTie(picked.value));
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final rules = ref.watch(preferredRulesProvider);
    final notifier = ref.read(preferredRulesProvider.notifier);
    final skin = ref.watch(scoreboardSkinProvider);
    final terms = ref.watch(termsProvider);
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
          header: 'Como você fala',
          footer:
              'Os nomes das manilhas e da rodada empatada que aparecem para '
              'você nas regras, nas dicas e na mesa. Só você vê.',
          children: [
            for (final slot in ManilhaSlot.values)
              AppTile(
                title: 'Manilha de ${slot.label.toLowerCase()}',
                subtitle: terms.nameOf(slot).name,
                onTap: () => _pickManilha(context, ref, slot),
              ),
            AppTile(
              title: 'Rodada empatada',
              subtitle: tieLabel(terms.tie),
              onTap: () => _pickTie(context, ref),
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

/// E.g. "embuchar (embuchou)".
String tieLabel(TieVerb v) => '${v.name} (${v.stem}ou)';
