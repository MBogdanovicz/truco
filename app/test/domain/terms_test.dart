import 'package:flutter_test/flutter_test.dart';
import 'package:truco/domain/game/terms.dart';

void main() {
  test('standard terms leave the text alone', () {
    const t = 'O gato ganha da espadilha. Embuchou tudo.';
    expect(Terms.standard.apply(t), t);
  });

  test('swaps manilha names with their articles', () {
    final t = Terms.standard
        .withManilha(ManilhaSlot.paus, const TermName('zap'))
        .withManilha(ManilhaSlot.ouros, const TermName('pica-fumo'))
        .withManilha(ManilhaSlot.copas, const TermName('copão'));
    expect(
      t.apply('A espadilha ganha da salmoura. O gato é o maior.'),
      'A espadilha ganha do pica-fumo. O zap é o maior.',
    );
    expect(
      t.apply('paus (gato) > copas > espadas. A copas e o gato.'),
      'paus (zap) > copas > espadas. O copão e o zap.',
    );
    expect(t.apply('7 de copas (copas)'), '7 de copas (copão)');
  });

  test('swaps the tie verb in every form', () {
    final t = Terms.standard.withTie(TieVerb.cangar);
    expect(
      t.apply('Embuchou a primeira; a rodada embucha; rodadas embuchadas.'),
      'Cangou a primeira; a rodada canga; rodadas cangadas.',
    );
  });

  test('round-trips through json', () {
    final t = Terms.standard
        .withManilha(ManilhaSlot.espadas, const TermName('espadão'))
        .withTie(TieVerb.melar);
    final back = Terms.fromJson(t.toJson());
    expect(back.nameOf(ManilhaSlot.espadas).name, 'espadão');
    expect(back.tie, TieVerb.melar);
    expect(back.nameOf(ManilhaSlot.paus).name, 'gato');
  });
}
