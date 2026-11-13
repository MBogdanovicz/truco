import 'package:flutter/material.dart';

import '../../domain/game/cards.dart';

/// A suit drawn as a shape, so its color is always the one asked for.
/// (The ♥ ♦ ♠ ♣ characters may come from an emoji font on Android, which
/// ignores the text color.)
class SuitGlyph extends StatelessWidget {
  const SuitGlyph(
    this.suit, {
    super.key,
    required this.size,
    required this.color,
  });

  final Suit suit;
  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) =>
      CustomPaint(size: Size.square(size), painter: _SuitPainter(suit, color));
}

class _SuitPainter extends CustomPainter {
  _SuitPainter(this.suit, this.color);

  final Suit suit;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width, h = size.height;
    final paint = Paint()
      ..color = color
      ..isAntiAlias = true;
    switch (suit) {
      case Suit.ouros:
        canvas.drawPath(
          Path()
            ..moveTo(w * 0.5, 0)
            ..lineTo(w * 0.9, h * 0.5)
            ..lineTo(w * 0.5, h)
            ..lineTo(w * 0.1, h * 0.5)
            ..close(),
          paint,
        );
      case Suit.copas:
        canvas.drawPath(_heart(w, h), paint);
      case Suit.espadas:
        // An upside-down heart with a stem.
        canvas.save();
        canvas.translate(0, h * 0.82);
        canvas.scale(1, -1);
        canvas.drawPath(_heart(w, h * 0.82), paint);
        canvas.restore();
        canvas.drawPath(_stem(w, h), paint);
      case Suit.paus:
        final r = w * 0.21;
        canvas.drawCircle(Offset(w * 0.5, h * 0.24), r, paint);
        canvas.drawCircle(Offset(w * 0.27, h * 0.56), r, paint);
        canvas.drawCircle(Offset(w * 0.73, h * 0.56), r, paint);
        canvas.drawRect(
          Rect.fromLTRB(w * 0.4, h * 0.3, w * 0.6, h * 0.62),
          paint,
        );
        canvas.drawPath(_stem(w, h), paint);
    }
  }

  Path _heart(double w, double h) => Path()
    ..moveTo(w * 0.5, h)
    ..cubicTo(w * 0.15, h * 0.68, 0, h * 0.48, 0, h * 0.28)
    ..cubicTo(0, h * 0.08, w * 0.15, 0, w * 0.28, 0)
    ..cubicTo(w * 0.4, 0, w * 0.48, h * 0.08, w * 0.5, h * 0.2)
    ..cubicTo(w * 0.52, h * 0.08, w * 0.6, 0, w * 0.72, 0)
    ..cubicTo(w * 0.85, 0, w, h * 0.08, w, h * 0.28)
    ..cubicTo(w, h * 0.48, w * 0.85, h * 0.68, w * 0.5, h)
    ..close();

  Path _stem(double w, double h) => Path()
    ..moveTo(w * 0.5, h * 0.55)
    ..quadraticBezierTo(w * 0.47, h * 0.9, w * 0.3, h)
    ..lineTo(w * 0.7, h)
    ..quadraticBezierTo(w * 0.53, h * 0.9, w * 0.5, h * 0.55)
    ..close();

  @override
  bool shouldRepaint(_SuitPainter old) =>
      old.suit != suit || old.color != color;
}
