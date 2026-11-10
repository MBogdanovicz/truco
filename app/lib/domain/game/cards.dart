/// Cards of the 40-card truco deck (no 8, 9 and 10).
library;

/// Suits, from weakest to strongest as manilhas (ouros < espadas < copas <
/// paus). Outside manilhas the suit does not matter.
enum Suit {
  ouros('♦', 'ouros'),
  espadas('♠', 'espadas'),
  copas('♥', 'copas'),
  paus('♣', 'paus');

  const Suit(this.symbol, this.label);
  final String symbol;
  final String label;

  bool get isRed => this == ouros || this == copas;
}

/// Ranks in their natural truco order, weakest first.
enum Rank {
  four('4', 'quatro'),
  five('5', 'cinco'),
  six('6', 'seis'),
  seven('7', 'sete'),
  queen('Q', 'dama'),
  jack('J', 'valete'),
  king('K', 'rei'),
  ace('A', 'ás'),
  two('2', 'dois'),
  three('3', 'três');

  const Rank(this.symbol, this.label);
  final String symbol;
  final String label;

  /// The rank right above this one, wrapping from 3 back to 4. With a "vira"
  /// this is the manilha rank.
  Rank get next => Rank.values[(index + 1) % Rank.values.length];
}

class Card {
  const Card(this.rank, this.suit);

  final Rank rank;
  final Suit suit;

  /// Compact id such as "7c" (rank symbol + suit initial), used in logs and
  /// on the wire.
  String get id => '${rank.symbol}${suit.name[0]}';

  static Card parse(String id) {
    final rank = Rank.values.firstWhere(
      (r) => r.symbol == id.substring(0, id.length - 1),
    );
    final suit = Suit.values.firstWhere((s) => s.name[0] == id[id.length - 1]);
    return Card(rank, suit);
  }

  String get label => '${rank.symbol}${suit.symbol}';

  @override
  bool operator ==(Object other) =>
      other is Card && other.rank == rank && other.suit == suit;

  @override
  int get hashCode => rank.index * 4 + suit.index;

  @override
  String toString() => id;
}

/// The full 40-card deck in a fixed order.
final List<Card> fullDeck = List.unmodifiable([
  for (final r in Rank.values)
    for (final s in Suit.values) Card(r, s),
]);
