import 'package:flutter_test/flutter_test.dart';
import 'package:truco/data/look_unlocks.dart';
import 'package:truco/domain/achievements.dart';
import 'package:truco/features/game/table_look.dart';
import 'package:truco/features/scorekeeper/scoreboard_skin.dart';

void main() {
  test('free players get the standard looks plus the earned ones', () {
    const look = TableLook(
      felt: FeltColor.azul,
      back: CardBackStyle.capivara,
      face: CardFaceStyle.noturno,
    );
    expect(LookAccess.none.allowed(look), TableLook.standard);
    const earned = LookAccess(
      premium: false,
      earned: {Achievement.gameWins10, Achievement.veteran10},
    );
    expect(earned.allowed(look), const TableLook(felt: FeltColor.azul));
    expect(earned.skin(ScoreboardSkin.matches), isTrue);
    expect(earned.skin(ScoreboardSkin.wood), isFalse);
    expect(earned.back(CardBackStyle.preto), isFalse);
    const premium = LookAccess(premium: true, earned: {});
    expect(premium.allowed(look), look);
  });
}
