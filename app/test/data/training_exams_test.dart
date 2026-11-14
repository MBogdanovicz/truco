import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:truco/data/training_exams.dart';
import 'package:truco/domain/game/ai.dart';
import 'package:truco/domain/game/training.dart';

void main() {
  test('each level has its exam', () {
    expect(TrainingLevel.basic.examAi, AiLevel.easy);
    expect(TrainingLevel.advanced.examAi, AiLevel.hard);
    expect(TrainingLevel.intermediate.examAchievement.course, isTrue);
  });

  test('a passed exam is remembered on the device', () async {
    SharedPreferences.setMockInitialValues({});
    final c = ProviderContainer();
    addTearDown(c.dispose);
    c.read(trainingExamsProvider);
    await c.read(trainingExamsProvider.notifier).pass(TrainingLevel.basic);
    expect(c.read(trainingExamsProvider), {TrainingLevel.basic});
    final again = ProviderContainer();
    addTearDown(again.dispose);
    again.read(trainingExamsProvider);
    await Future<void>.delayed(Duration.zero);
    expect(again.read(trainingExamsProvider), {TrainingLevel.basic});
  });
}
