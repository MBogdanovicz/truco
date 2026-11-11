import 'package:flutter_test/flutter_test.dart';
import 'package:truco/domain/game/training.dart';

void main() {
  test('scenarios are well formed', () {
    final ids = <String>{};
    for (final s in trainingScenarios) {
      expect(ids.add(s.id), isTrue, reason: 'duplicate id ${s.id}');
      expect(s.answer, inInclusiveRange(0, s.options.length - 1));
      final cards = [
        s.vira,
        ...s.hand,
        ...?s.partner,
        for (final t in s.table) t.$2,
      ];
      expect(
        cards.toSet().length,
        cards.length,
        reason: 'repeated card in ${s.id}',
      );
      expect(s.explanation, isNotEmpty);
    }
    expect(trainingScenarios.length, greaterThanOrEqualTo(15));
  });
}
