import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/groups_repository.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import 'leaderboard_view.dart';

class RankingScreen extends ConsumerWidget {
  const RankingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) => AppScaffold(
    title: 'Ranking geral',
    onRefresh: () async => ref.invalidate(leaderboardProvider),
    children: const [LeaderboardView()],
  );
}
