import 'package:flutter_test/flutter_test.dart';
import 'package:truco/domain/game/cards.dart';
import 'package:truco/features/game/dealer_draw.dart';

void main() {
  test('the highest card deals; the same rank goes by suit', () {
    const spread = [
      Card(Rank.three, Suit.ouros),
      Card(Rank.three, Suit.espadas),
      Card(Rank.king, Suit.paus),
      Card(Rank.four, Suit.paus),
    ];
    const draw = DealerDraw(
      names: ['a', 'b', 'c', 'd'],
      spread: spread,
      picks: {0: 3, 1: 0, 2: 2, 3: 1},
    );
    expect(draw.highest(), 3);
    const noThree = DealerDraw(
      names: ['a', 'b', 'c', 'd'],
      spread: spread,
      picks: {0: 3, 2: 2},
    );
    expect(noThree.highest(), 2);
  });
}
