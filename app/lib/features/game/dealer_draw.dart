import 'dart:math' as math;

import 'package:flutter/material.dart' hide Card;
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/game/cards.dart';
import '../../domain/game/table_view.dart';
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

  /// The draw of an online game, from the server's [DrawView].
  factory DealerDraw.fromView(
    DrawView v,
    List<String> names, {
    int? secondsLeft,
  }) {
    // Cards still face down are unknown: any card stands in for them.
    final spread = List<Card>.filled(
      v.count,
      const Card(Rank.four, Suit.ouros),
    );
    for (final e in v.cards.entries) {
      final i = v.picks[e.key];
      if (i != null) spread[i] = e.value;
    }
    return DealerDraw(
      names: names,
      spread: spread,
      picks: v.picks,
      secondsLeft: secondsLeft ?? seconds,
      dealer: v.dealer,
      timedOut: v.timedOut,
    );
  }

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

/// How the face-down cards are laid out.
enum DrawSpread {
  /// The deck spread in an overlapping line, as on a real table.
  ribbon,

  /// Separate cards in rows (the first version; kept to switch back).
  grid,
}

/// The screen where the person draws a card to see who deals.
class DealerDrawView extends StatelessWidget {
  static const spreadStyle = DrawSpread.ribbon;

  const DealerDrawView({
    super.key,
    required this.draw,
    required this.mySeat,
    required this.onPick,
    required this.onLeave,
    this.mayPick = true,
    this.spectator = false,
  });

  /// Watching someone else's game: nobody is "você".
  final bool spectator;

  final DealerDraw draw;
  final int mySeat;

  /// Whether the viewer takes part in the draw (false for spectators).
  final bool mayPick;
  final ValueChanged<int> onPick;
  final VoidCallback onLeave;

  @override
  Widget build(BuildContext context) {
    final felt = TableLookScope.of(context).felt;
    final theme = Theme.of(context);
    const light = Color(0xFFF4EBD8);
    final mine = draw.picks[mySeat];
    final canPick = mayPick && mine == null && !draw.timedOut;
    final String status;
    if (draw.timedOut) {
      status = 'O tempo acabou: quem dá foi sorteado.';
    } else if (draw.revealed) {
      status = draw.dealer == mySeat
          ? 'Você tirou a maior: você dá as cartas!'
          : '${draw.names[draw.dealer!]} tirou a maior e dá as cartas.';
    } else if (mine == null && mayPick) {
      status = 'Tire uma carta (${draw.secondsLeft} s)';
    } else if (spectator || draw.picks.length < 4) {
      status = spectator
          ? 'Cada um tira uma carta...'
          : 'Esperando os outros tirarem...';
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
                    for (var k = 0; k < 4; k++)
                      Expanded(
                        child: _SeatDraw(
                          draw: draw,
                          seat: (mySeat + k) % 4,
                          mySeat: spectator ? -1 : mySeat,
                        ),
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
                child: switch (spreadStyle) {
                  DrawSpread.ribbon => _RibbonSpread(
                    draw: draw,
                    onPick: canPick ? onPick : null,
                  ),
                  DrawSpread.grid => _GridSpread(
                    draw: draw,
                    onPick: canPick ? onPick : null,
                  ),
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SeatDraw extends StatelessWidget {
  const _SeatDraw({
    required this.draw,
    required this.seat,
    required this.mySeat,
  });

  final DealerDraw draw;
  final int seat;
  final int mySeat;

  @override
  Widget build(BuildContext context) {
    final card = draw.cardOf(seat);
    final winner = draw.dealer == seat && !draw.timedOut;
    const light = Color(0xFFF4EBD8);
    return Column(
      children: [
        Text(
          seat == mySeat ? 'Você' : draw.names[seat],
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            color: winner ? const Color(0xFFF2C14E) : light,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          mySeat < 0
              ? (seat.isEven ? 'dupla 1' : 'dupla 2')
              : seat == mySeat
              ? ''
              : (seat == (mySeat + 2) % 4 ? 'parceiro' : 'adversário'),
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

/// The deck spread in a slightly curved, overlapping line. Each card shows
/// a strip; a tap picks the card whose strip is under the finger.
class _RibbonSpread extends StatelessWidget {
  const _RibbonSpread({required this.draw, required this.onPick});

  final DealerDraw draw;
  final ValueChanged<int>? onPick;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, c) {
      final n = draw.spread.length;
      final width = math.min(c.maxWidth - 32, 560.0);
      final cardW = math.min(72.0, width / 4.5);
      final cardH = cardW / 0.68;
      final step = (width - cardW) / (n - 1);
      final left = (c.maxWidth - width) / 2;
      final top = math.max(24.0, (c.maxHeight - cardH) / 2 - 30);
      Offset at(int i) {
        // A gentle arc, higher in the middle.
        final t = i / (n - 1) * 2 - 1;
        return Offset(left + i * step, top + t * t * 18);
      }

      void tap(Offset p) {
        if (onPick == null) return;
        // The top card at this point: the last one whose left edge is to
        // the left of the finger.
        for (var i = n - 1; i >= 0; i--) {
          final o = at(i);
          final picked = draw.picks.containsValue(i);
          if (!picked && p.dx >= o.dx && p.dx <= o.dx + cardW) {
            onPick!(i);
            return;
          }
        }
      }

      return GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapUp: (d) => tap(d.localPosition),
        child: Stack(
          children: [
            for (var i = 0; i < n; i++)
              AnimatedPositioned(
                key: ValueKey('draw-card-$i'),
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeOut,
                left: at(i).dx,
                top: at(i).dy - (draw.picks.containsValue(i) ? 40 : 0),
                width: cardW,
                height: cardH,
                child: AnimatedOpacity(
                  duration: const Duration(milliseconds: 300),
                  opacity: draw.picks.containsValue(i) ? 0 : 1,
                  child: Transform.rotate(
                    angle: (i / (n - 1) * 2 - 1) * 0.12,
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(cardW * 0.08),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x66000000),
                            blurRadius: 4,
                            offset: Offset(-2, 2),
                          ),
                        ],
                      ),
                      child: CardBack(width: cardW),
                    ),
                  ),
                ),
              ),
          ],
        ),
      );
    },
  );
}

/// Separate face-down cards in rows.
class _GridSpread extends StatelessWidget {
  const _GridSpread({required this.draw, required this.onPick});

  final DealerDraw draw;
  final ValueChanged<int>? onPick;

  @override
  Widget build(BuildContext context) => SingleChildScrollView(
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
              onTap: onPick != null && !draw.picks.containsValue(i)
                  ? () => onPick!(i)
                  : null,
              child: const CardBack(width: 48),
            ),
          ),
      ],
    ),
  );
}
