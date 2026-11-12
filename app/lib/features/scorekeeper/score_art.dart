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
        aspectRatio: _Card10Painter.boundsAspect,
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
      ScoreArtKind.matches => CustomPaint(
        painter: _MatchesPainter(
          score: score,
          target: target,
          seed: team.index,
        ),
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
        // A fixed width, so the drawing doesn't move when the score gets a
        // second digit: marks stay where they were made.
        SizedBox(
          width: 44,
          child: FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerRight,
            child: Text(
              '$score',
              key: ValueKey('score-${team.name}'),
              style: TextStyle(
                color: text,
                fontSize: 34,
                fontWeight: FontWeight.w800,
                height: 1,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

enum ScoreArtKind { card10, beans, chalk, matches }

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
    // The 10 and the cover card, at any count, fit inside the area: the
    // drawing is scaled to the bounds of every position of the cover.
    final b = _bounds;
    final h = math.min(size.width / b.width, size.height / b.height) * 0.94;
    final w = h * _aspect;
    final card = Rect.fromLTWH(
      (size.width - b.width * h) / 2 - b.left * h,
      (size.height - b.height * h) / 2 - b.top * h,
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
    final normal = Offset(math.sin(angle), math.cos(angle));
    final dir = Offset(math.cos(angle), -math.sin(angle));
    final linePoint = card.topLeft + normal * (offset * h);
    final c = card.center - linePoint;
    final along = c.dx * dir.dx + c.dy * dir.dy;
    canvas.translate(linePoint.dx, linePoint.dy);
    canvas.rotate(-angle);
    final cw = w * _coverWidth;
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

  static const _coverWidth = 1.08;

  /// Where the cover card lies for [n] pips shown, in card units (the 10
  /// at the origin, 1 tall).
  static List<Offset> _coverCorners(double n) {
    final (angle, offset) = _cut(n);
    final normal = Offset(math.sin(angle), math.cos(angle));
    final dir = Offset(math.cos(angle), -math.sin(angle));
    final linePoint = normal * offset;
    const center = Offset(_aspect / 2, 0.5);
    final c = center - linePoint;
    final along = c.dx * dir.dx + c.dy * dir.dy;
    const cw = _aspect * _coverWidth;
    return [
      for (final (x, y) in [
        (along - cw / 2, 0.0),
        (along + cw / 2, 0.0),
        (along - cw / 2, 1.0),
        (along + cw / 2, 1.0),
      ])
        linePoint + dir * x + normal * y,
    ];
  }

  static double get boundsAspect => _bounds.width / _bounds.height;

  /// The 10 and every position of the cover card, in card units.
  static final Rect _bounds = () {
    var r = const Rect.fromLTWH(0, 0, _aspect, 1);
    for (var n = 0; n < 12; n++) {
      for (final p in _coverCorners(n.toDouble())) {
        r = r.expandToInclude(Rect.fromLTWH(p.dx, p.dy, 0, 0));
      }
    }
    return r.inflate(0.03);
  }();

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
    // Two rows, always laid out the same way so marks never move: two
    // groups of five on top, the 11th and 12th below the first group.
    final h = math.min(size.height / 2.25, 70.0);
    final top = (size.height - h * 2.2) / 2;
    final top2 = top + h * 1.2;
    final chalk = Paint()
      ..color = const Color(0xFFF2F2EC).withValues(alpha: 0.92)
      ..strokeWidth = math.max(3, h * 0.06)
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;
    final dust = Paint()
      ..color = Colors.white.withValues(alpha: 0.18)
      ..strokeWidth = chalk.strokeWidth * 2.2
      ..strokeCap = StrokeCap.round;
    // Groups of five: four upright, the fifth across them.
    final gap = math.min(h * 0.22, (size.width - 12) / 8.8);
    final width = 8.8 * gap;
    final left = (size.width - width) / 2 + 0.4 * gap;
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

    for (var i = 0; i < score.clamp(0, 12); i++) {
      if (i >= 10) {
        final x = left + (i - 10) * gap;
        line(
          Offset(x + jitter(), top2 + jitter()),
          Offset(x + jitter(), top2 + h + jitter()),
        );
        continue;
      }
      final x0 = left + (i ~/ 5) * 5 * gap;
      final inGroup = i % 5;
      if (inGroup < 4) {
        final x = x0 + inGroup * gap;
        line(
          Offset(x + jitter(), top + jitter()),
          Offset(x + jitter(), top + h + jitter()),
        );
      } else {
        line(
          Offset(x0 - gap * 0.4, top + h * 0.8 + jitter()),
          Offset(x0 + gap * 3.4, top + h * 0.2 + jitter()),
        );
      }
    }
  }

  @override
  bool shouldRepaint(_ChalkPainter old) => old.score != score;
}

// -------------------------------------------------------------- fósforos --

/// Matchsticks: each tento is a match taken from the box and laid on the
/// table, in groups of three.
class _MatchesPainter extends CustomPainter {
  _MatchesPainter({
    required this.score,
    required this.target,
    required this.seed,
  });

  final int score;
  final int target;
  final int seed;

  void _match(Canvas canvas, Offset from, Offset to, double width) {
    final stick = Paint()
      ..color = const Color(0xFFE6C89B)
      ..strokeWidth = width
      ..strokeCap = StrokeCap.round;
    canvas.drawLine(
      from + const Offset(1.5, 2),
      to + const Offset(1.5, 2),
      Paint()
        ..color = Colors.black.withValues(alpha: 0.35)
        ..strokeWidth = width
        ..strokeCap = StrokeCap.round,
    );
    canvas.drawLine(from, to, stick);
    final dir = (to - from) / (to - from).distance;
    final head = Rect.fromCenter(
      center: to - dir * width * 0.2,
      width: width * 2.4,
      height: width * 1.7,
    );
    canvas.save();
    canvas.translate(head.center.dx, head.center.dy);
    canvas.rotate(math.atan2(dir.dy, dir.dx));
    final local = Rect.fromCenter(
      center: Offset.zero,
      width: head.width,
      height: head.height,
    );
    canvas.drawOval(
      local,
      Paint()
        ..shader = const RadialGradient(
          center: Alignment(-0.3, -0.4),
          colors: [Color(0xFFE0533F), Color(0xFF8E1E14)],
        ).createShader(local),
    );
    canvas.restore();
  }

  @override
  void paint(Canvas canvas, Size size) {
    final random = math.Random(11 + seed);
    // The box, on the right, its drawer pulled out a little.
    final bw = math.min(size.width * 0.3, size.height * 0.55);
    final bh = bw * 1.45;
    final box = Rect.fromCenter(
      center: Offset(size.width - bw * 0.62, size.height / 2),
      width: bw,
      height: bh,
    );
    final sleeve = RRect.fromRectAndRadius(box, const Radius.circular(3));
    canvas.drawShadow(Path()..addRRect(sleeve), Colors.black, 4, false);
    // The drawer, sticking out at the top, holds the matches still to win.
    final drawer = Rect.fromLTWH(
      box.left + bw * 0.06,
      box.top - bh * 0.28,
      bw * 0.88,
      bh * 0.6,
    );
    canvas.drawRect(drawer, Paint()..color = const Color(0xFFD9C29A));
    final left = target - score;
    final stickW = math.max(2.5, bw * 0.07);
    for (var i = 0; i < left; i++) {
      final x =
          drawer.left +
          drawer.width *
              (0.12 + 0.76 * (i + 0.5 + (target - left) / 2) / target);
      _match(
        canvas,
        Offset(x, drawer.bottom),
        Offset(x + (i.isEven ? 1 : -1), drawer.top + stickW * 1.2),
        stickW,
      );
    }
    // The sleeve, with its label and striker.
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTRB(box.left, drawer.top + bh * 0.3, box.right, box.bottom),
        const Radius.circular(3),
      ),
      Paint()
        ..shader = const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF2F6FB0), Color(0xFF1C4677)],
        ).createShader(box),
    );
    final label = Rect.fromCenter(
      center: Offset(box.center.dx, box.top + bh * 0.62),
      width: bw * 0.62,
      height: bw * 0.62,
    );
    canvas.drawOval(label, Paint()..color = const Color(0xFFF2D25C));
    canvas.drawOval(
      label.deflate(bw * 0.12),
      Paint()..color = const Color(0xFFC0392B),
    );
    canvas.drawRect(
      Rect.fromLTWH(
        box.right - bw * 0.1,
        box.top + bh * 0.1,
        bw * 0.1,
        bh * 0.8,
      ),
      Paint()..color = const Color(0xFF5A3A2A),
    );

    // The scored matches: groups of three, two groups per row.
    final area = Rect.fromLTRB(0, 0, box.left - bw * 0.15, size.height);
    final rows = (target / 6).ceil();
    final len = math.min(area.height / rows * 0.85, area.width * 0.55);
    final w = math.max(2.5, len * 0.07);
    final groupW = area.width / 2;
    for (var i = 0; i < score; i++) {
      final group = i ~/ 3;
      final row = group ~/ 2;
      final col = group % 2;
      final inGroup = i % 3;
      final cx = area.left + groupW * (col + 0.5) + (inGroup - 1) * len * 0.26;
      final cy = area.top + area.height * (row + 0.5) / rows;
      final tilt = (random.nextDouble() - 0.5) * 0.25;
      final d = Offset(math.sin(tilt), -math.cos(tilt)) * (len / 2);
      _match(canvas, Offset(cx, cy) - d, Offset(cx, cy) + d, w);
    }
  }

  @override
  bool shouldRepaint(_MatchesPainter old) =>
      old.score != score || old.target != target;
}
