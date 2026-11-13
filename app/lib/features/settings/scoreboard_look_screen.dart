import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/look_unlocks.dart';
import '../../domain/scorekeeper/team.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../premium/premium_screen.dart';
import '../scorekeeper/score_art.dart';
import '../scorekeeper/scoreboard_skin.dart';

/// "Visual do placar": the scorekeeper themes with a live preview.
/// Choosing is Premium; anyone can preview.
class ScoreboardLookScreen extends ConsumerStatefulWidget {
  const ScoreboardLookScreen({super.key});

  @override
  ConsumerState<ScoreboardLookScreen> createState() =>
      _ScoreboardLookScreenState();
}

class _ScoreboardLookScreenState extends ConsumerState<ScoreboardLookScreen> {
  ScoreboardSkin? _draft;

  ScoreboardSkin get _skin => _draft ?? ref.read(scoreboardSkinProvider);

  Future<void> _save() async {
    final skin = _skin;
    if (!ref.read(lookAccessProvider).skin(skin)) {
      await showPremiumRequired(context, 'Escolher o visual do placar');
      return;
    }
    await ref.read(scoreboardSkinProvider.notifier).choose(skin);
    if (!mounted) return;
    showAppToast(context, 'Visual do placar salvo.');
    context.pop();
  }

  @override
  Widget build(BuildContext context) {
    ref.watch(scoreboardSkinProvider);
    final access = ref.watch(lookAccessProvider);
    final skin = _skin;
    final theme = Theme.of(context);
    return AppScaffold(
      title: 'Visual do placar',
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(18),
          child: SizedBox(
            height: 340,
            child: Column(
              children: [
                Expanded(
                  child: ScoreboardPreviewPanel(
                    skin: skin,
                    team: Team.a,
                    name: 'Nós',
                    score: 7,
                  ),
                ),
                Container(height: 4, color: skin.strip),
                Expanded(
                  child: ScoreboardPreviewPanel(
                    skin: skin,
                    team: Team.b,
                    name: 'Eles',
                    score: 4,
                  ),
                ),
              ],
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(4, 8, 4, 16),
          child: Text(skin.description, style: theme.textTheme.bodyMedium),
        ),
        AppSection(
          header: 'Temas',
          children: [
            Padding(
              padding: const EdgeInsets.all(12),
              child: Wrap(
                spacing: 12,
                runSpacing: 12,
                children: [
                  for (final s in ScoreboardSkin.values)
                    GestureDetector(
                      key: ValueKey('skin-${s.name}'),
                      onTap: () => setState(() => _draft = s),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(3),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: s == skin
                                    ? theme.colorScheme.primary
                                    : Colors.transparent,
                                width: 3,
                              ),
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: SizedBox(
                                width: 88,
                                height: 66,
                                child: ScoreboardPreviewPanel(
                                  skin: s,
                                  team: Team.a,
                                  score: 5,
                                  small: true,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 4),
                          SizedBox(
                            width: 94,
                            child: Text(
                              s.label,
                              textAlign: TextAlign.center,
                              style: theme.textTheme.bodySmall,
                            ),
                          ),
                          if (!access.skin(s) &&
                              LookUnlocks.achievementFor(s) != null)
                            Text(
                              '🏆 ${LookUnlocks.achievementFor(s)!.title}',
                              style: theme.textTheme.labelSmall?.copyWith(
                                color: theme.colorScheme.primary,
                              ),
                            ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(4, 0, 4, 12),
          child: Text(
            access.premium
                ? 'Todos os visuais liberados pelo Premium.'
                : 'Escolher o visual faz parte do Premium. Sem o Premium, dá '
                      'para ver como fica aqui, mas o placar continua o '
                      'padrão. Os marcados com 🏆 você ganha com a '
                      'conquista.',
            style: theme.textTheme.bodySmall,
          ),
        ),
        AppButton(label: 'Salvar', onPressed: _save),
        const SizedBox(height: 8),
        AppTextButton(
          label: 'Voltar ao padrão',
          onPressed: () => setState(() => _draft = ScoreboardSkin.felt),
        ),
        const SizedBox(height: 24),
      ],
    );
  }
}

/// One team's side of the scoreboard, without buttons, for previews.
class ScoreboardPreviewPanel extends StatelessWidget {
  const ScoreboardPreviewPanel({
    super.key,
    required this.skin,
    required this.team,
    required this.score,
    this.name,
    this.small = false,
  });

  final ScoreboardSkin skin;
  final Team team;
  final int score;
  final String? name;
  final bool small;

  @override
  Widget build(BuildContext context) {
    final art = skin.art;
    final tally = Tally(skin: skin, team: team, score: score, target: 12);
    final content = Padding(
      padding: EdgeInsets.all(small ? 6 : 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (name != null)
            Text(
              name!,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                color: skin.accent(team),
                fontWeight: FontWeight.bold,
              ),
            ),
          Expanded(
            child: art != null
                ? ScoreArt(
                    kind: art,
                    team: team,
                    score: score,
                    target: 12,
                    text: skin.text,
                  )
                : FittedBox(
                    child: Text(
                      '$score',
                      style: TextStyle(
                        color: skin.text,
                        fontWeight: FontWeight.w800,
                        fontSize: 120,
                        height: 1,
                      ),
                    ),
                  ),
          ),
          if (art == null) ...[
            SizedBox(height: small ? 4 : 8),
            if (small)
              SizedBox(
                height: 8,
                child: FittedBox(
                  fit: BoxFit.fitWidth,
                  child: SizedBox(width: 300, height: 26, child: tally),
                ),
              )
            else
              tally,
          ],
        ],
      ),
    );
    return DecoratedBox(
      decoration: skin.panel(team),
      child: skin.isWood
          ? CustomPaint(painter: const WoodGrainPainter(), child: content)
          : content,
    );
  }
}
