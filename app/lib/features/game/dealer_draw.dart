import 'package:flutter/material.dart' hide Card;
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/game/cards.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import 'playing_card.dart';
import 'table_look.dart';

/// Before the first hand of a series, each player draws a card from the
/// spread deck: the highest card deals. Ranks go in truco order (4 lowest,
/// 3 highest, no manilhas yet); the same rank is decided by the suit
/// (paus > copas > espadas > ouros), so there are no ties.
@immutable
class DealerDraw {
  const DealerDraw({
    required this.names,
    required this.spread,
    this.picks = const {},
    this.secondsLeft = DealerDraw.seconds,
    this.dealer,
    this.timedOut = false,
  });

  /// Time to pick a card.
  static const seconds = 10;

  /// Players' names by seat.
  final List<String> names;

  /// The face-down cards to pick from.
  final List<Card> spread;

  /// Seat → index in [spread] of the card they drew.
  final Map<int, int> picks;
  final int secondsLeft;

  /// Who deals, once every card is turned over.
  final int? dealer;

  /// Time ran out with no card drawn: the dealer was drawn by lot.
  final bool timedOut;

  bool get revealed => dealer != null;

  Card? cardOf(int seat) => picks[seat] == null ? null : spread[picks[seat]!];

  DealerDraw copyWith({
    Map<int, int>? picks,
    int? secondsLeft,
    int? dealer,
    bool? timedOut,
  }) => DealerDraw(
    names: names,
    spread: spread,
    picks: picks ?? this.picks,
    secondsLeft: secondsLeft ?? this.secondsLeft,
    dealer: dealer ?? this.dealer,
    timedOut: timedOut ?? this.timedOut,
  );

  /// Higher wins: rank first, then suit.
  static int strength(Card c) => c.rank.index * 4 + c.suit.index;

  /// The seat with the highest card among [picks].
  int highest() {
    var best = picks.keys.first;
    for (final s in picks.keys) {
      if (strength(spread[picks[s]!]) > strength(spread[picks[best]!])) {
        best = s;
      }
    }
    return best;
  }
}

/// The draw in progress for a game against the computer, or null.
class DealerDrawNotifier extends Notifier<DealerDraw?> {
  @override
  DealerDraw? build() => null;

  void set(DealerDraw? draw) => state = draw;
}

final dealerDrawProvider = NotifierProvider<DealerDrawNotifier, DealerDraw?>(
  DealerDrawNotifier.new,
);

/// The screen where the person draws a card to see who deals.
class DealerDrawView extends StatelessWidget {
  const DealerDrawView({
    super.key,
    required this.draw,
    required this.mySeat,
    required this.onPick,
    required this.onLeave,
  });

  final DealerDraw draw;
  final int mySeat;
  final ValueChanged<int> onPick;
  final VoidCallback onLeave;

  @override
  Widget build(BuildContext context) {
    final felt = TableLookScope.of(context).felt;
    final theme = Theme.of(context);
    const light = Color(0xFFF4EBD8);
    final mine = draw.picks[mySeat];
    final String status;
    if (draw.timedOut) {
      status = 'O tempo acabou: quem dá foi sorteado.';
    } else if (draw.revealed) {
      status = draw.dealer == mySeat
          ? 'Você tirou a maior: você dá as cartas!'
          : '${draw.names[draw.dealer!]} tirou a maior e dá as cartas.';
    } else if (mine == null) {
      status = 'Tire uma carta (${draw.secondsLeft} s)';
    } else {
      status = 'Virando as cartas...';
    }
    return Scaffold(
      body: DecoratedBox(
        decoration: BoxDecoration(
          gradient: RadialGradient(
            radius: 1.2,
            colors: [felt.light, felt.dark],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              Align(
                alignment: Alignment.centerLeft,
                child: IconButton(
                  tooltip: 'Sair',
                  color: light,
                  icon: Icon(context.icon(AppIcon.close)),
                  onPressed: onLeave,
                ),
              ),
              Text(
                'Quem dá as cartas?',
                style: theme.textTheme.headlineSmall?.copyWith(
                  color: light,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 6),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Text(
                  'Cada um tira uma carta e a maior dá. Mesmo número, vale o '
                  'naipe: paus, copas, espadas e ouros.',
                  textAlign: TextAlign.center,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: light.withValues(alpha: 0.8),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Row(
                  children: [
                    for (final seat in const [0, 1, 2, 3])
                      Expanded(
                        child: _SeatDraw(draw: draw, seat: seat),
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Text(
                status,
                key: const ValueKey('draw-status'),
                textAlign: TextAlign.center,
                style: theme.textTheme.titleMedium?.copyWith(
                  color: draw.revealed ? const Color(0xFFF2C14E) : light,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Wrap(
                    alignment: WrapAlignment.center,
                    spacing: 10,
                    runSpacing: 10,
                    children: [
                      for (var i = 0; i < draw.spread.length; i++)
                        AnimatedOpacity(
                          duration: const Duration(milliseconds: 250),
                          opacity: draw.picks.containsValue(i) ? 0.15 : 1,
                          child: GestureDetector(
                            key: ValueKey('draw-card-$i'),
                            onTap:
                                mine == null &&
                                    !draw.timedOut &&
                                    !draw.picks.containsValue(i)
                                ? () => onPick(i)
                                : null,
                            child: const CardBack(width: 48),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SeatDraw extends StatelessWidget {
  const _SeatDraw({required this.draw, required this.seat});

  final DealerDraw draw;
  final int seat;

  @override
  Widget build(BuildContext context) {
    final card = draw.cardOf(seat);
    final winner = draw.dealer == seat && !draw.timedOut;
    const light = Color(0xFFF4EBD8);
    return Column(
      children: [
        Text(
          seat == 0 ? 'Você' : draw.names[seat],
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            color: winner ? const Color(0xFFF2C14E) : light,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          seat == 2 ? 'parceiro' : (seat == 0 ? '' : 'adversário'),
          style: TextStyle(color: light.withValues(alpha: 0.6), fontSize: 11),
        ),
        const SizedBox(height: 6),
        AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          padding: const EdgeInsets.all(3),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: winner ? const Color(0xFFF2C14E) : Colors.transparent,
              width: 3,
            ),
          ),
          child: SizedBox(
            width: 58,
            height: 58 / 0.68,
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 350),
              child: card == null
                  ? Container(
                      key: const ValueKey('empty'),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: light.withValues(alpha: 0.3),
                          width: 1.5,
                        ),
                      ),
                    )
                  : draw.revealed && !draw.timedOut
                  ? PlayingCardView(
                      key: ValueKey('face-$seat'),
                      card: card,
                      width: 58,
                    )
                  : const CardBack(key: ValueKey('back'), width: 58),
            ),
          ),
        ),
      ],
    );
  }
}
