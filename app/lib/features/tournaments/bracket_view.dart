import 'package:flutter/material.dart';

import '../../data/tournaments.dart';

/// One round of a bracket: its name and matches (in slot order).
class BracketColumn {
  const BracketColumn(this.title, this.matches);
  final String title;
  final List<TournamentMatch> matches;
}

/// How a match looks in the bracket.
class BracketCardInfo {
  const BracketCardInfo({
    required this.top,
    required this.bottom,
    this.topScore,
    this.bottomScore,
    this.topWon = false,
    this.bottomWon = false,
    this.note,
    this.mine = false,
    this.onTap,
    this.action,
  });

  final String top;
  final String bottom;
  final String? topScore;
  final String? bottomScore;
  final bool topWon;
  final bool bottomWon;

  /// E.g. "Jogando agora", "W.O.", "Até 19/11".
  final String? note;
  final bool mine;
  final VoidCallback? onTap;

  /// E.g. "Entrar", "Assistir".
  final String? action;
}

/// A World Cup style bracket: rounds side by side, each match halfway
/// between the two it comes from, joined by lines. Scrolls sideways.
class BracketView extends StatelessWidget {
  const BracketView({super.key, required this.columns, required this.info});

  final List<BracketColumn> columns;
  final BracketCardInfo Function(TournamentMatch m) info;

  static const cardWidth = 210.0;
  static const cardHeight = 74.0;
  static const gap = 28.0;
  static const slot = cardHeight + 14;
  static const headerHeight = 28.0;

  @override
  Widget build(BuildContext context) {
    final shown = [
      for (final c in columns)
        if (c.matches.isNotEmpty) c,
    ];
    if (shown.isEmpty) return const SizedBox.shrink();
    final most = shown
        .map((c) => c.matches.length)
        .reduce((a, b) => a > b ? a : b);
    final height = most * slot;
    final width = shown.length * (cardWidth + gap) - gap;
    final theme = Theme.of(context);
    double centerOf(int count, int i) => (i + 0.5) * height / count;

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
      child: SizedBox(
        width: width,
        height: height + headerHeight,
        child: Stack(
          children: [
            Positioned.fill(
              top: headerHeight,
              child: CustomPaint(
                painter: _Lines(
                  counts: [for (final c in shown) c.matches.length],
                  centerOf: centerOf,
                  color: theme.colorScheme.outlineVariant,
                ),
              ),
            ),
            for (final (ci, c) in shown.indexed) ...[
              Positioned(
                left: ci * (cardWidth + gap),
                top: 0,
                width: cardWidth,
                height: headerHeight,
                child: Text(
                  c.title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: theme.textTheme.labelLarge?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
              ),
              for (final (i, m) in c.matches.indexed)
                Positioned(
                  left: ci * (cardWidth + gap),
                  top:
                      headerHeight +
                      centerOf(c.matches.length, i) -
                      cardHeight / 2,
                  width: cardWidth,
                  height: cardHeight,
                  child: _MatchCard(info: info(m)),
                ),
            ],
          ],
        ),
      ),
    );
  }
}

class _Lines extends CustomPainter {
  _Lines({required this.counts, required this.centerOf, required this.color});

  final List<int> counts;
  final double Function(int count, int i) centerOf;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;
    const w = BracketView.cardWidth, g = BracketView.gap;
    for (var c = 0; c + 1 < counts.length; c++) {
      final n = counts[c], next = counts[c + 1];
      // Two matches feed one (halving), or one feeds one (same size).
      if (next * 2 != n && next != n) continue;
      final x0 = c * (w + g) + w, x1 = x0 + g;
      for (var i = 0; i < n; i++) {
        final j = next == n ? i : i ~/ 2;
        final y0 = centerOf(n, i), y1 = centerOf(next, j);
        canvas.drawPath(
          Path()
            ..moveTo(x0, y0)
            ..lineTo(x0 + g / 2, y0)
            ..lineTo(x0 + g / 2, y1)
            ..lineTo(x1, y1),
          paint,
        );
      }
    }
  }

  @override
  bool shouldRepaint(_Lines old) => old.counts != counts || old.color != color;
}

class _MatchCard extends StatelessWidget {
  const _MatchCard({required this.info});
  final BracketCardInfo info;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    Widget row(String name, String? score, bool won) => Row(
      children: [
        Expanded(
          child: Text(
            name,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontWeight: won ? FontWeight.w700 : FontWeight.w400,
              color: won ? scheme.onSurface : scheme.onSurfaceVariant,
            ),
          ),
        ),
        if (score != null)
          Text(
            score,
            style: TextStyle(
              fontWeight: won ? FontWeight.w700 : FontWeight.w400,
              fontFeatures: const [FontFeature.tabularFigures()],
            ),
          ),
      ],
    );
    final note = [
      if (info.note != null) info.note!,
      if (info.action != null) info.action!,
    ].join(' · ');
    return Material(
      color: info.mine
          ? scheme.primaryContainer.withValues(alpha: 0.6)
          : scheme.surfaceContainerHigh,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
        side: BorderSide(
          color: info.action != null ? scheme.primary : scheme.outlineVariant,
        ),
      ),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: info.onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              row(info.top, info.topScore, info.topWon),
              const SizedBox(height: 2),
              row(info.bottom, info.bottomScore, info.bottomWon),
              if (note.isNotEmpty) ...[
                const SizedBox(height: 2),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    note,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: theme.textTheme.labelSmall?.copyWith(
                      color: info.action != null
                          ? scheme.primary
                          : scheme.onSurfaceVariant,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
