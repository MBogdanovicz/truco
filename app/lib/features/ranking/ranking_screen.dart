import 'package:flutter/material.dart';

import '../../ui/adaptive/adaptive_widgets.dart';
import 'leaderboard_view.dart';

class RankingScreen extends StatelessWidget {
  const RankingScreen({super.key});

  @override
  Widget build(BuildContext context) =>
      const AppScaffold(title: 'Ranking geral', body: LeaderboardView());
}
