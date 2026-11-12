import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../data/game_prefs.dart';
import '../../domain/game/cards.dart' as deck;
import '../../domain/game/rules.dart';
import '../../domain/game/training.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/theme/app_theme.dart';
import 'playing_card.dart';

/// "Modo professor": situations to practise, one after the other.
class TrainingScreen extends StatefulWidget {
  const TrainingScreen({super.key});

  @override
  State<TrainingScreen> createState() => _TrainingScreenState();
}

class _TrainingScreenState extends State<TrainingScreen> {
  static const _kDone = 'training.done.v1';

  /// Scenarios answered right at least once.
  Set<String> _done = {};
  int? _open;
  int? _picked;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final p = await SharedPreferences.getInstance();
      if (mounted) {
        setState(() => _done = (p.getStringList(_kDone) ?? const []).toSet());
      }
    } catch (_) {}
  }

  Future<void> _save() async {
    try {
      final p = await SharedPreferences.getInstance();
      await p.setStringList(_kDone, _done.toList());
    } catch (_) {}
  }

  void _answer(int i) {
    final s = trainingScenarios[_open!];
    setState(() {
      _picked = i;
      if (s.isGood(i)) _done = {..._done, s.id};
    });
    _save();
  }

  void _go(int? index) => setState(() {
    _open = index;
    _picked = null;
  });

  @override
  Widget build(BuildContext context) {
    final open = _open;
    if (open != null) return _scenario(open);
    return AppScaffold(
      title: 'Treinar',
      children: [
        AppSection(
          header:
              '${_done.length} de ${trainingScenarios.length} '
              'acertadas',
          footer:
              'Situações de jogo com a explicação da melhor jogada. Regras '
              'com vira: a manilha é a carta logo acima dela.',
          children: [
            for (var i = 0; i < trainingScenarios.length; i++)
              AppTile(
                title: said(context, trainingScenarios[i].title),
                leading: Icon(
                  _done.contains(trainingScenarios[i].id)
                      ? Icons.check_circle
                      : Icons.circle_outlined,
                  color: _done.contains(trainingScenarios[i].id)
                      ? Colors.green
                      : Theme.of(context).disabledColor,
                ),
                onTap: () => _go(i),
              ),
          ],
        ),
      ],
    );
  }

  Widget _scenario(int index) {
    final s = trainingScenarios[index];
    final theme = Theme.of(context);
    final picked = _picked;
    final last = index == trainingScenarios.length - 1;
    const rules = TrucoRules.paulista;
    Widget card(deck.Card c, {double width = 64}) => PlayingCardView(
      card: c,
      width: width,
      manilha: rules.isManilha(c, vira: s.vira),
    );
    Widget row(String label, List<Widget> cards) => Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: theme.textTheme.labelLarge),
          const SizedBox(height: 6),
          Wrap(spacing: 8, runSpacing: 8, children: cards),
        ],
      ),
    );

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) _go(null);
      },
      child: AppScaffold(
        key: ValueKey(index),
        title: '${index + 1}. ${said(context, s.title)}',
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(4, 0, 4, 12),
            child: Text(
              said(context, s.situation),
              style: theme.textTheme.bodyLarge,
            ),
          ),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.felt,
              borderRadius: BorderRadius.circular(16),
            ),
            child: DefaultTextStyle.merge(
              style: const TextStyle(color: Colors.white),
              child: Theme(
                data: theme.copyWith(
                  textTheme: theme.textTheme.apply(bodyColor: Colors.white),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    row('Vira', [card(s.vira, width: 52)]),
                    if (s.table.isNotEmpty)
                      row('Na mesa', [
                        for (final (who, c) in s.table)
                          Column(
                            children: [
                              card(c, width: 52),
                              const SizedBox(height: 4),
                              Text(
                                who,
                                style: const TextStyle(
                                  color: Colors.white70,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                      ]),
                    if (s.partner != null)
                      row('Cartas do parceiro', [
                        for (final c in s.partner!) card(c, width: 52),
                      ]),
                    row('Sua mão', [for (final c in s.hand) card(c)]),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: Text(
              said(context, s.question),
              style: theme.textTheme.titleMedium,
            ),
          ),
          const SizedBox(height: 8),
          for (var i = 0; i < s.options.length; i++)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: SizedBox(
                width: double.infinity,
                child: AppButton(
                  label: picked == null
                      ? said(context, s.options[i])
                      : '${said(context, s.options[i])}'
                            '${s.isGood(i)
                                ? '  ✓'
                                : i == picked
                                ? '  ✗'
                                : ''}',
                  tonal: !(picked != null && s.isGood(i)),
                  onPressed: picked == null
                      ? () => _answer(i)
                      : (s.isGood(i) ? () {} : null),
                ),
              ),
            ),
          if (picked != null) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: s.isGood(picked)
                    ? Colors.green.withValues(alpha: 0.12)
                    : Colors.orange.withValues(alpha: 0.14),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    picked == s.answer
                        ? 'Isso mesmo!'
                        : s.isGood(picked)
                        ? 'Também vale!'
                        : 'Não foi dessa vez.',
                    style: theme.textTheme.titleMedium,
                  ),
                  const SizedBox(height: 6),
                  Text(said(context, s.explanation)),
                  for (final MapEntry(:key, :value) in s.alsoGood.entries)
                    if (picked == key || picked == s.answer) ...[
                      const SizedBox(height: 6),
                      Text(said(context, value)),
                    ],
                ],
              ),
            ),
            const SizedBox(height: 16),
            AppButton(
              label: last ? 'Voltar à lista' : 'Próxima',
              onPressed: () => _go(last ? null : index + 1),
            ),
          ],
        ],
      ),
    );
  }
}
