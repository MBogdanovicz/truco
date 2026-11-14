import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../domain/achievements.dart';
import '../domain/game/ai.dart';
import '../domain/game/training.dart';
import 'achievements_repository.dart';
import 'auth_repository.dart';

/// The Treinar exam of each level: a whole game with the professor
/// against the computer at the level's strength.
extension TrainingExam on TrainingLevel {
  AiLevel get examAi => switch (this) {
    TrainingLevel.basic => AiLevel.easy,
    TrainingLevel.intermediate => AiLevel.medium,
    TrainingLevel.advanced => AiLevel.hard,
  };

  Achievement get examAchievement => switch (this) {
    TrainingLevel.basic => Achievement.courseBasic,
    TrainingLevel.intermediate => Achievement.courseIntermediate,
    TrainingLevel.advanced => Achievement.courseAdvanced,
  };

  /// "básico", for "a prova do básico".
  String get lower => label.toLowerCase();
}

/// The exams passed on this device (and, with an account, the matching
/// achievements on the server).
class TrainingExamsNotifier extends Notifier<Set<TrainingLevel>> {
  static const _key = 'training.exams.v1';

  @override
  Set<TrainingLevel> build() {
    _load();
    return const {};
  }

  Future<void> _load() async {
    try {
      final p = await SharedPreferences.getInstance();
      final names = p.getStringList(_key) ?? const [];
      state = {
        ...state,
        for (final n in names) ?TrainingLevel.values.asNameMap()[n],
      };
    } on Object {
      // Keep what we have.
    }
  }

  Future<void> pass(TrainingLevel level) async {
    state = {...state, level};
    try {
      final p = await SharedPreferences.getInstance();
      await p.setStringList(_key, [for (final l in state) l.name]);
    } on Object {
      // Not remembered on this device.
    }
    final client = ref.read(supabaseClientProvider);
    final user = ref.read(authRepositoryProvider).currentUser;
    if (client == null || user == null || user.isGuest) return;
    try {
      await client.rpc(
        'unlock_course_achievement',
        params: {'p_achievement': level.examAchievement.id},
      );
      ref.invalidate(unlockedAchievementsProvider);
    } on Object {
      // Offline or not migrated yet: the exam stays passed on the device.
    }
  }
}

final trainingExamsProvider =
    NotifierProvider<TrainingExamsNotifier, Set<TrainingLevel>>(
      TrainingExamsNotifier.new,
    );
