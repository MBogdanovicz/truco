import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../domain/scorekeeper/match_record.dart';
import '../../domain/scorekeeper/match_state.dart';
import '../../domain/scorekeeper/team.dart';
import '../../ui/theme/app_theme.dart';

/// Everything the scoreboard needs, independent of how the game is synced.
class ScoreboardModel {
  const ScoreboardModel({
    required this.teamNames,
    required this.seats,
    required this.state,
    required this.series,
    required this.canMark,
    required this.cooldownRemaining,
    required this.onAdd,
    required this.onUndo,
    this.highlightTeam,
  });

  final Map<Team, String> teamNames;
  final List<Seat> seats;
  final MatchState state;

  /// Previous games of the series (excluding the current one).
  final SeriesTally series;
  final bool Function(Team team) canMark;
  final Duration Function(Team team) cooldownRemaining;
  final void Function(Team team, int delta) onAdd;
  final void Function(Team team) onUndo;

  /// The viewer's own team, marked with "você".
  final Team? highlightTeam;
}

/// Two team panels with the score, point buttons and cues in between.
///
/// Designed to lie flat on the table: the top half can be flipped so it
/// reads correctly from the other side.
class ScoreboardView extends StatefulWidget {
  const ScoreboardView({super.key, required this.model, this.flipTop = false});

  final ScoreboardModel model;
  final bool flipTop;

  @override
  State<ScoreboardView> createState() => _ScoreboardViewState();
}

class _ScoreboardViewState extends State<ScoreboardView> {
  Timer? _ticker;

  @override
  void initState() {
    super.initState();
    // Cheap periodic rebuild so cooldown countdowns stay current.
    _ticker = Timer.periodic(const Duration(milliseconds: 500), (_) {
      final active = Team.values.any(
        (t) => widget.model.cooldownRemaining(t) > Duration.zero,
      );
      if (active || _cooldownShown) setState(() {});
    });
  }

  /// Whether the last build showed a countdown (one more rebuild clears it).
  bool _cooldownShown = false;

  @override
  void dispose() {
    _ticker?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final m = widget.model;
    _cooldownShown = Team.values.any(
      (t) => m.cooldownRemaining(t) > Duration.zero,
    );
    return LayoutBuilder(
      builder: (context, constraints) {
        // Landscape tablets and desktops show the teams side by side. Flipping
        // the top panel is for a device lying flat between the teams, so it
        // keeps them stacked (one team on each long edge).
        final sideBySide =
            !widget.flipTop &&
            constraints.maxWidth >= 640 &&
            constraints.maxWidth > constraints.maxHeight;
        if (sideBySide) {
          return Column(
            children: [
              _CenterStrip(model: m),
              Expanded(
                child: Row(
                  children: [
                    Expanded(
                      child: _TeamPanel(team: Team.a, model: m),
                    ),
                    Expanded(
                      child: _TeamPanel(team: Team.b, model: m),
                    ),
                  ],
                ),
              ),
            ],
          );
        }
        return Column(
          children: [
            Expanded(
              child: RotatedBox(
                quarterTurns: widget.flipTop ? 2 : 0,
                child: _TeamPanel(team: Team.a, model: m),
              ),
            ),
            _CenterStrip(model: m),
            Expanded(
              child: _TeamPanel(team: Team.b, model: m),
            ),
          ],
        );
      },
    );
  }
}

class _CenterStrip extends StatelessWidget {
  const _CenterStrip({required this.model});

  final ScoreboardModel model;

  @override
  Widget build(BuildContext context) {
    final state = model.state;
    final series = model.series;
    final banner = state.isIronHand
        ? 'Mão de ferro'
        : state.isHandOfEleven
        ? 'Mão de onze'
        : null;
    final textStyle = Theme.of(context).textTheme.labelLarge
        ?.copyWith(color: Colors.white);
    return Container(
      width: double.infinity,
      color: AppColors.felt,
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            series.gamesPlayed == 0
                ? 'Jogo 1'
                : 'Jogo ${series.gamesPlayed + 1} · Série ${series.winsA} × ${series.winsB}',
            style: textStyle,
          ),
          if (banner != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
              decoration: BoxDecoration(
                color: AppColors.gold,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                banner,
                style: textStyle?.copyWith(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _TeamPanel extends StatelessWidget {
  const _TeamPanel({required this.team, required this.model});

  final Team team;
  final ScoreboardModel model;

  static const _labels = {3: 'Truco', 6: 'Seis', 9: 'Nove', 12: 'Doze'};

  @override
  Widget build(BuildContext context) {
    final state = model.state;
    final score = state.scoreOf(team);
    final color = team == Team.a ? AppColors.teamA : AppColors.teamB;
    final players = model.seats
        .where((s) => s.team == team)
        .map((s) => s.name)
        .where((n) => n.isNotEmpty);
    final canMark = model.canMark(team);
    final cooldown = model.cooldownRemaining(team);
    final scoringEnabled =
        canMark && !state.isFinished && cooldown == Duration.zero;
    final canUndo = canMark && state.lastActiveScoreEventOf(team) != null;
    final theme = Theme.of(context);
    const onColor = Colors.white;

    void add(int delta) {
      HapticFeedback.lightImpact();
      model.onAdd(team, delta);
    }

    // Mão de onze / de ferro: a team on 11 only needs one more point, so it
    // gets a single "Vitória" button; its opponent can score 1 (the team on
    // 11 refused to play the hand) or 3 (won the hand).
    final eleven = state.rules.handOfElevenScore;
    final onEleven =
        (state.isHandOfEleven || state.isIronHand) && score == eleven;
    final facingEleven = state.isHandOfEleven && score != eleven;
    final extraDeltas = onEleven
        ? const <int>[]
        : facingEleven
        ? const [3]
        : const [3, 6, 9, 12];

    return Container(
      color: color,
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
      alignment: Alignment.center,
      // On big screens the controls keep a comfortable size instead of
      // stretching to fill the panel.
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 560, maxHeight: 560),
        child: LayoutBuilder(
          builder: (context, constraints) {
            final compact = constraints.maxHeight < 260;
            return Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Flexible(
                                child: Text(
                                  model.teamNames[team]!,
                                  overflow: TextOverflow.ellipsis,
                                  style: theme.textTheme.titleLarge?.copyWith(
                                    color: onColor,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              if (model.highlightTeam == team) ...[
                                const SizedBox(width: 8),
                                const _Chip(label: 'você'),
                              ],
                            ],
                          ),
                          if (players.isNotEmpty)
                            Text(
                              players.join(' e '),
                              overflow: TextOverflow.ellipsis,
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: onColor.withValues(alpha: 0.8),
                              ),
                            ),
                        ],
                      ),
                    ),
                    if (canMark)
                      IconButton(
                        tooltip: 'Desfazer',
                        color: onColor,
                        disabledColor: onColor.withValues(alpha: 0.3),
                        icon: const Icon(Icons.undo),
                        onPressed: canUndo ? () => model.onUndo(team) : null,
                      ),
                  ],
                ),
                Expanded(
                  child: Row(
                    children: [
                      Expanded(
                        child: FittedBox(
                          child: Text(
                            '$score',
                            key: ValueKey('score-${team.name}'),
                            style: const TextStyle(
                              color: onColor,
                              fontWeight: FontWeight.w800,
                              fontSize: 120,
                              height: 1,
                            ),
                          ),
                        ),
                      ),
                      if (canMark) ...[
                        const SizedBox(width: 12),
                        Expanded(
                          flex: 2,
                          child: _AddButton(
                            key: ValueKey('add-${team.name}-1'),
                            label: cooldown > Duration.zero
                                ? '${(cooldown.inMilliseconds / 1000).ceil()}s'
                                : onEleven
                                ? 'Vitória'
                                : '+1',
                            caption: cooldown > Duration.zero
                                ? 'Aguarde'
                                : onEleven
                                ? 'Ganhou a mão'
                                : facingEleven
                                ? 'Correram'
                                : null,
                            big: true,
                            onPressed: scoringEnabled ? () => add(1) : null,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                _TentoPips(score: score, target: state.rules.targetScore),
                if (canMark && extraDeltas.isNotEmpty) ...[
                  SizedBox(height: compact ? 6 : 10),
                  Row(
                    children: [
                      for (final d in extraDeltas) ...[
                        Expanded(
                          child: _AddButton(
                            key: ValueKey('add-${team.name}-$d'),
                            label: '+$d',
                            caption: compact
                                ? null
                                : facingEleven
                                ? 'Ganhou a mão'
                                : _labels[d],
                            onPressed: scoringEnabled ? () => add(d) : null,
                          ),
                        ),
                        if (d != extraDeltas.last) const SizedBox(width: 8),
                      ],
                    ],
                  ),
                ],
              ],
            );
          },
        ),
      ),
    );
  }
}

class _Chip extends StatelessWidget {
  const _Chip({required this.label});
  final String label;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 1),
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: 0.25),
      borderRadius: BorderRadius.circular(10),
    ),
    child: Text(
      label,
      style: const TextStyle(color: Colors.white, fontSize: 12),
    ),
  );
}

/// Twelve marks, one per tento, filled as the team scores.
class _TentoPips extends StatelessWidget {
  const _TentoPips({required this.score, required this.target});

  final int score;
  final int target;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        for (var i = 0; i < target; i++)
          Expanded(
            child: Container(
              height: 8,
              margin: EdgeInsets.only(right: i == target - 1 ? 0 : 4),
              decoration: BoxDecoration(
                color: i < score
                    ? AppColors.gold
                    : Colors.white.withValues(alpha: 0.25),
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ),
      ],
    );
  }
}

class _AddButton extends StatelessWidget {
  const _AddButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.caption,
    this.big = false,
  });

  final String label;
  final String? caption;
  final bool big;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    final enabled = onPressed != null;
    return Material(
      color: Colors.white.withValues(alpha: enabled ? 0.18 : 0.06),
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onPressed,
        child: Padding(
          padding: EdgeInsets.symmetric(vertical: big ? 0 : 10),
          child: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: enabled ? 1 : 0.4),
                    fontSize: big ? 44 : 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (caption != null)
                  Text(
                    caption!,
                    style: TextStyle(
                      color: Colors.white.withValues(
                        alpha: enabled ? 0.8 : 0.5,
                      ),
                      fontSize: 12,
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
