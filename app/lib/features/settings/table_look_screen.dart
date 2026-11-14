import 'package:flutter/material.dart' hide Card;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/look_unlocks.dart';
import '../../domain/game/cards.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../game/playing_card.dart';
import '../game/table_look.dart';
import '../premium/premium_screen.dart';

/// "Mesa e baralho": felt color, card backs and card faces, chosen
/// separately with a live preview. Choosing is Premium; anyone can preview.
class TableLookScreen extends ConsumerStatefulWidget {
  const TableLookScreen({super.key});

  @override
  ConsumerState<TableLookScreen> createState() => _TableLookScreenState();
}

class _TableLookScreenState extends ConsumerState<TableLookScreen> {
  TableLook? _draft;

  TableLook get _look => _draft ?? ref.read(tableLookProvider);

  Future<void> _save() async {
    final look = _look;
    if (!ref.read(lookAccessProvider).table(look)) {
      await showPremiumRequired(context, 'Escolher o visual da mesa');
      return;
    }
    await ref.read(tableLookProvider.notifier).set(look);
    if (!mounted) return;
    showAppToast(context, 'Visual da mesa salvo.');
    context.pop();
  }

  Widget _swatches<T>({
    required List<T> values,
    required T selected,
    required String Function(T) label,
    required Widget Function(T) preview,
    required ValueChanged<T> onPick,
    required bool Function(T) allowed,
  }) => Padding(
    padding: const EdgeInsets.all(12),
    child: Wrap(
      spacing: 12,
      runSpacing: 12,
      children: [
        for (final v in values)
          GestureDetector(
            onTap: () => onPick(v),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(3),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: v == selected
                          ? Theme.of(context).colorScheme.primary
                          : Colors.transparent,
                      width: 3,
                    ),
                  ),
                  child: preview(v),
                ),
                const SizedBox(height: 4),
                Text(label(v), style: Theme.of(context).textTheme.bodySmall),
                if (_unlockNote(v, allowed(v)) case final note?)
                  Text(
                    note,
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
              ],
            ),
          ),
      ],
    ),
  );

  /// "🏆 Truqueiro" under a look earned with an achievement not yet
  /// unlocked.
  String? _unlockNote(Object? item, bool allowed) {
    if (allowed) return null;
    final a = LookUnlocks.achievementFor(item);
    return a == null ? null : '🏆 ${a.title}';
  }

  @override
  Widget build(BuildContext context) {
    ref.watch(tableLookProvider);
    final access = ref.watch(lookAccessProvider);
    final look = _look;
    void pick(TableLook l) => setState(() => _draft = l);
    const sample = [
      Card(Rank.four, Suit.paus),
      Card(Rank.seven, Suit.copas),
      Card(Rank.ace, Suit.espadas),
      Card(Rank.seven, Suit.ouros),
    ];
    return TableLookScope(
      look: look,
      child: Builder(
        builder: (context) => AppScaffold(
          title: 'Mesa e baralho',
          children: [
            // Live preview.
            Container(
              height: 170,
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(18),
                gradient: RadialGradient(
                  radius: 1.1,
                  colors: [look.felt.light, look.felt.dark],
                ),
              ),
              child: Center(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const CardBack(width: 58),
                    const SizedBox(width: 12),
                    for (final c in sample)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 3),
                        child: PlayingCardView(card: c, width: 58),
                      ),
                  ],
                ),
              ),
            ),
            AppSection(
              header: 'Cor do feltro',
              children: [
                _swatches<FeltColor>(
                  values: FeltColor.values,
                  selected: look.felt,
                  label: (f) => f.label,
                  preview: (f) => Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(9),
                      gradient: RadialGradient(colors: [f.light, f.dark]),
                    ),
                  ),
                  onPick: (f) => pick(look.copyWith(felt: f)),
                  allowed: access.felt,
                ),
              ],
            ),
            AppSection(
              header: 'Verso das cartas',
              children: [
                _swatches<CardBackStyle>(
                  values: CardBackStyle.values,
                  selected: look.back,
                  label: (b) => b.label,
                  preview: (b) => TableLookScope(
                    look: look.copyWith(back: b),
                    child: const CardBack(width: 40),
                  ),
                  onPick: (b) => pick(look.copyWith(back: b)),
                  allowed: access.back,
                ),
              ],
            ),
            AppSection(
              header: 'Frente das cartas',
              children: [
                _swatches<CardFaceStyle>(
                  values: CardFaceStyle.values,
                  selected: look.face,
                  label: (f) => f.label,
                  preview: (f) => TableLookScope(
                    look: look.copyWith(face: f),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        PlayingCardView(
                          card: Card(Rank.seven, Suit.ouros),
                          width: 36,
                        ),
                        SizedBox(width: 3),
                        PlayingCardView(
                          card: Card(Rank.four, Suit.paus),
                          width: 36,
                        ),
                      ],
                    ),
                  ),
                  onPick: (f) => pick(look.copyWith(face: f)),
                  allowed: access.face,
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(4, 0, 4, 12),
              child: Text(
                access.premium
                    ? 'Todos os visuais liberados pelo Premium.'
                    : 'Escolher o visual faz parte do Premium. Sem o Premium, '
                          'dá para ver como fica aqui, mas a mesa continua a '
                          'padrão. Os marcados com 🏆 você ganha com a '
                          'conquista.',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ),
            AppButton(label: 'Salvar', onPressed: _save),
            const SizedBox(height: 8),
            AppTextButton(
              label: 'Voltar ao padrão',
              onPressed: () => pick(TableLook.standard),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
