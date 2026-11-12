import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../domain/scorekeeper/team.dart';
import '../game/table_look.dart';

/// Scoreboards that draw the score the way people keep it at a real table,
/// instead of a big number: a 10 card with another card slid over it,
/// beans moved to a pile, chalk marks on a slate.
class ScoreArt extends StatelessWidget {
  const ScoreArt({
    super.key,
    required this.kind,
    required this.team,
    required this.score,
    required this.target,
    required this.text,
  });

  const ScoreArt.card10({
    super.key,
    required this.team,
    required this.score,
    required this.target,
    required this.text,
  }) : kind = ScoreArtKind.card10;

  const ScoreArt.beans({
    super.key,
    required this.team,
    required this.score,
    required this.target,
    required this.text,
  }) : kind = ScoreArtKind.beans;

  const ScoreArt.chalk({
    super.key,
    required this.team,
    required this.score,
    required this.target,
    required this.text,
  }) : kind = ScoreArtKind.chalk;

  final ScoreArtKind kind;
  final Team team;
  final int score;
  final int target;

  /// Color of the small number beside the drawing.
  final Color text;

  @override
  Widget build(BuildContext context) {
    final back = TableLookScope.of(context).back;
    final art = switch (kind) {
      ScoreArtKind.card10 => AspectRatio(
        aspectRatio: 0.75,
        child: TweenAnimationBuilder<double>(
          tween: Tween(end: score.toDouble()),
          duration: const Duration(milliseconds: 450),
          curve: Curves.easeOutCubic,
          builder: (context, v, _) => CustomPaint(
            painter: _Card10Painter(
              shown: v,
              red: team == Team.a,
              target: target,
              backTop: back.top,
              backBottom: back.bottom,
              edge: back.edge,
            ),
          ),
        ),
      ),
      ScoreArtKind.beans => CustomPaint(
        painter: _BeansPainter(score: score, target: target, seed: team.index),
        child: const SizedBox.expand(),
      ),
      ScoreArtKind.chalk => CustomPaint(
        painter: _ChalkPainter(score: score, seed: team.index),
        child: const SizedBox.expand(),
      ),
    };
    return Row(
      children: [
        Expanded(child: Center(child: art)),
        const SizedBox(width: 6),
        Text(
          '$score',
          key: ValueKey('score-${team.name}'),
          style: TextStyle(
            color: text,
            fontSize: 34,
            fontWeight: FontWeight.w800,
            height: 1,
          ),
        ),
      ],
    );
  }
}

enum ScoreArtKind { card10, beans, chalk }

// ------------------------------------------------------------- carta 10 --

/// The 12 pips of a 10 card, in the order a sliding card uncovers them:
/// the one under the top corner "10", the 10 in the middle, and the one
/// under the bottom corner "10". In card units (0..1 of width and height).
const _pips = [
  Offset(0.12, 0.20),
  Offset(0.36, 0.21),
  Offset(0.64, 0.21),
  Offset(0.50, 0.32),
  Offset(0.36, 0.43),
  Offset(0.64, 0.43),
  Offset(0.36, 0.57),
  Offset(0.64, 0.57),
  Offset(0.50, 0.68),
  Offset(0.36, 0.79),
  Offset(0.64, 0.79),
  Offset(0.88, 0.80),
];

class _Card10Painter extends CustomPainter {
  _Card10Painter({
    required this.shown,
    required this.red,
    required this.target,
    required this.backTop,
    required this.backBottom,
    required this.edge,
  });

  /// Colors of the cover card, from the chosen card back.
  final Color backTop;
  final Color backBottom;
  final Color edge;

  /// Pips uncovered (animated, so it can be between two counts).
  final double shown;
  final bool red;
  final int target;

  static const _aspect = 0.68;

  @override
  void paint(Canvas canvas, Size size) {
    // The 10 sits on the left; the cover card slides down over it.
    // Small enough that the cover card has room to slide below it.
    final h = math.min(size.height * 0.62, size.width / _aspect * 0.8);
    final w = h * _aspect;
    final card = Rect.fromLTWH(
      (size.width - w) / 2 - w * 0.12,
      size.height * 0.04,
      w,
      h,
    );
    final rr = RRect.fromRectAndRadius(card, Radius.circular(w * 0.08));
    canvas.drawShadow(Path()..addRRect(rr), Colors.black, 4, false);
    canvas.drawRRect(rr, Paint()..color = const Color(0xFFFFFDF7));
    final ink = red ? const Color(0xFFC62828) : const Color(0xFF1A1A1A);
    final suit = red ? '♥' : '♠';

    void text(String s, Offset at, double fontSize, {bool flip = false}) {
      final tp = TextPainter(
        text: TextSpan(
          text: s,
          style: TextStyle(
            color: ink,
            fontSize: fontSize,
            fontWeight: FontWeight.w800,
            height: 1,
          ),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      canvas.save();
      canvas.translate(at.dx, at.dy);
      if (flip) canvas.rotate(math.pi);
      tp.paint(canvas, Offset(-tp.width / 2, -tp.height / 2));
      canvas.restore();
    }

    Offset at(Offset p) => Offset(card.left + p.dx * w, card.top + p.dy * h);
    // Corner indices.
    text('10', at(const Offset(0.12, 0.08)), w * 0.17);
    text('10', at(const Offset(0.88, 0.92)), w * 0.17, flip: true);
    for (var i = 0; i < _pips.length; i++) {
      final corner = i == 0 || i == _pips.length - 1;
      text(
        suit,
        at(_pips[i]),
        corner ? w * 0.15 : w * 0.21,
        flip: _pips[i].dy > 0.5,
      );
    }

    // The cover card: everything past the shown pips is under it. It is
    // a whole card lying on the 10, its top edge along the cut.
    final n = shown.clamp(0.0, 12.0);
    if (n >= 11.98) return;
    final (angle, offset) = _cut(n);
    canvas.save();
    canvas.clipRect(Offset.zero & size);
    final normal = Offset(math.sin(angle), math.cos(angle));
    final dir = Offset(math.cos(angle), -math.sin(angle));
    final linePoint = card.topLeft + normal * (offset * h);
    final c = card.center - linePoint;
    final along = c.dx * dir.dx + c.dy * dir.dy;
    canvas.translate(linePoint.dx, linePoint.dy);
    canvas.rotate(-angle);
    final cw = w * 1.08;
    final cover = RRect.fromRectAndRadius(
      Rect.fromLTWH(along - cw / 2, 0, cw, h),
      Radius.circular(w * 0.08),
    );
    canvas.drawShadow(Path()..addRRect(cover), Colors.black, 6, false);
    canvas.drawRRect(cover, Paint()..color = edge);
    final inner = cover.deflate(w * 0.05);
    canvas.drawRRect(
      inner,
      Paint()
        ..shader = LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [backTop, backBottom],
        ).createShader(inner.outerRect),
    );
    // A diamond lattice, like the back of a deck.
    canvas.save();
    canvas.clipRRect(inner);
    final lattice = Paint()
      ..color = edge.withValues(alpha: 0.28)
      ..strokeWidth = math.max(1, w * 0.012);
    final r = inner.outerRect;
    final step = w * 0.14;
    for (var x = r.left - r.height; x < r.right; x += step) {
      canvas.drawLine(
        Offset(x, r.top),
        Offset(x + r.height, r.bottom),
        lattice,
      );
      canvas.drawLine(
        Offset(x + r.height, r.top),
        Offset(x, r.bottom),
        lattice,
      );
    }
    canvas.restore();
    canvas.restore();
  }

  /// The edge of the cover card for [n] pips shown: an angle (from
  /// horizontal) and its distance from the card's corner, found so the
  /// first n pips are above it and the rest below. Card units: x in
  /// widths × aspect, y in heights.
  static (double, double) _cut(double n) {
    final whole = n.floor();
    final frac = n - whole;
    final (a0, o0) = _cutAt(whole);
    if (frac < 0.01) return (a0, o0);
    final (a1, o1) = _cutAt(whole + 1);
    return (a0 + (a1 - a0) * frac, o0 + (o1 - o0) * frac);
  }

  static final _cache = <int, (double, double)>{};

  static (double, double) _cutAt(int n) => _cache.putIfAbsent(n, () {
    Offset p(Offset o) => Offset(o.dx * _aspect, o.dy);
    if (n <= 0) return (0.0, 0.1);
    if (n >= 12) return (0.0, 1.05);
    var best = (0.0, 0.0);
    var margin = -1.0;
    for (var deg = -70; deg <= 70; deg++) {
      final t = deg * math.pi / 180;
      final nx = math.sin(t), ny = math.cos(t);
      double proj(Offset o) => p(o).dx * nx + p(o).dy * ny;
      final above = _pips.take(n).map(proj).reduce(math.max);
      final below = _pips.skip(n).map(proj).reduce(math.min);
      if (below - above > margin) {
        margin = below - above;
        best = (t, (above + below) / 2);
      }
    }
    return best;
  });

  @override
  bool shouldRepaint(_Card10Painter old) =>
      old.shown != shown || old.red != red || old.edge != edge;
}

// --------------------------------------------------------------- feijões --

/// Beans: each tento is a bean moved from the bowl to the team's pile.
class _BeansPainter extends CustomPainter {
  _BeansPainter({
    required this.score,
    required this.target,
    required this.seed,
  });

  final int score;
  final int target;
  final int seed;

  void _bean(Canvas canvas, Offset c, double r, double angle, double alpha) {
    canvas.save();
    canvas.translate(c.dx, c.dy);
    canvas.rotate(angle);
    final rect = Rect.fromCenter(
      center: Offset.zero,
      width: r * 2.2,
      height: r * 1.4,
    );
    canvas.drawOval(
      rect.shift(const Offset(1, 2)),
      Paint()..color = Colors.black.withValues(alpha: 0.35 * alpha),
    );
    canvas.drawOval(
      rect,
      Paint()
        ..shader = RadialGradient(
          center: const Alignment(-0.4, -0.5),
          colors: [
            const Color(0xFF8D4A2B).withValues(alpha: alpha),
            const Color(0xFF4A2112).withValues(alpha: alpha),
          ],
        ).createShader(rect),
    );
    // The little white "eye" of the bean.
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(0, -r * 0.45),
        width: r * 0.6,
        height: r * 0.22,
      ),
      Paint()..color = const Color(0xFFF3E6D0).withValues(alpha: 0.8 * alpha),
    );
    canvas.restore();
  }

  @override
  void paint(Canvas canvas, Size size) {
    final r = math.min(size.width / 13, size.height / 9);
    // The pile: beans scattered in a circle, always in the same spots.
    final pile = Offset(size.width * 0.3, size.height * 0.5);
    final spread = math.min(size.width * 0.27, size.height * 0.44);
    final random = math.Random(7 + seed);
    for (var i = 0; i < target; i++) {
      final a = random.nextDouble() * math.pi * 2;
      final d = math.sqrt((i + 0.5) / target) * spread;
      final c = pile + Offset(math.cos(a) * d, math.sin(a) * d);
      final turn = random.nextDouble() * math.pi;
      if (i < score) _bean(canvas, c, r, turn, 1);
    }
    // The bowl with the beans still to win.
    final bowl = Offset(size.width * 0.78, size.height * 0.5);
    final br = math.min(size.width * 0.2, size.height * 0.4);
    canvas.drawCircle(
      bowl,
      br,
      Paint()
        ..shader = const RadialGradient(
          colors: [Color(0xFFE9DCC2), Color(0xFFB79E77)],
        ).createShader(Rect.fromCircle(center: bowl, radius: br)),
    );
    canvas.drawCircle(
      bowl,
      br,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2
        ..color = const Color(0xFF7A6040),
    );
    final left = target - score;
    final small = br / 4;
    for (var i = 0; i < left; i++) {
      final a = i * 2.4;
      final d = math.sqrt((i + 0.5) / target) * br * 0.75;
      _bean(
        canvas,
        bowl + Offset(math.cos(a) * d, math.sin(a) * d),
        small,
        a,
        1,
      );
    }
  }

  @override
  bool shouldRepaint(_BeansPainter old) =>
      old.score != score || old.target != target;
}

// ------------------------------------------------------------------ giz --

/// Chalk tally marks on a slate, in groups of five.
class _ChalkPainter extends CustomPainter {
  _ChalkPainter({required this.score, required this.seed});

  final int score;
  final int seed;

  @override
  void paint(Canvas canvas, Size size) {
    final random = math.Random(3 + seed);
    final h = math.min(size.height * 0.7, 90.0);
    final gap = h * 0.22;
    final groupGap = gap * 1.6;
    final top = (size.height - h) / 2;
    final chalk = Paint()
      ..color = const Color(0xFFF2F2EC).withValues(alpha: 0.92)
      ..strokeWidth = math.max(3, h * 0.06)
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;
    final dust = Paint()
      ..color = Colors.white.withValues(alpha: 0.18)
      ..strokeWidth = chalk.strokeWidth * 2.2
      ..strokeCap = StrokeCap.round;
    // Total width, to center the marks.
    final groups = (score / 5).ceil();
    final width = score == 0
        ? 0.0
        : (score - groups) * gap + groups * (4 * gap + groupGap) - groupGap;
    var x = math.max(8.0, (size.width - width) / 2);
    double jitter() => (random.nextDouble() - 0.5) * h * 0.08;
    void line(Offset a, Offset b) {
      canvas.drawLine(a, b, dust);
      final mid = Offset((a.dx + b.dx) / 2 + jitter(), (a.dy + b.dy) / 2);
      canvas.drawPath(
        Path()
          ..moveTo(a.dx, a.dy)
          ..quadraticBezierTo(mid.dx, mid.dy, b.dx, b.dy),
        chalk,
      );
    }

    for (var i = 0; i < score; i++) {
      final inGroup = i % 5;
      if (inGroup == 4) {
        // The fifth crosses the four before it.
        final start = x - 4 * gap - gap * 0.4;
        line(
          Offset(start, top + h * 0.8 + jitter()),
          Offset(x - gap * 0.6, top + h * 0.2 + jitter()),
        );
        x += groupGap;
        continue;
      }
      line(
        Offset(x + jitter(), top + jitter()),
        Offset(x + jitter(), top + h + jitter()),
      );
      x += gap;
    }
  }

  @override
  bool shouldRepaint(_ChalkPainter old) => old.score != score;
}
