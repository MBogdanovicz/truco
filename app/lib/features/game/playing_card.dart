import 'package:flutter/material.dart' hide Card;

import '../../domain/game/cards.dart';
import '../../ui/theme/app_theme.dart';
import 'suit_glyph.dart';
import 'table_look.dart';

/// Width / height of a card.
const cardAspect = 0.68;

/// A face-up card drawn with plain widgets (no image assets).
class PlayingCardView extends StatelessWidget {
  const PlayingCardView({
    super.key,
    required this.card,
    required this.width,
    this.manilha = false,
    this.dimmed = false,
    this.highlighted = false,
  });

  final Card card;
  final double width;

  /// Gold edge to point out manilhas (helps beginners).
  final bool manilha;
  final bool dimmed;
  final bool highlighted;

  /// Symbol color for [suit] in [face].
  static Color suitColor(Suit suit, CardFaceStyle face) => switch (face) {
    CardFaceStyle.classico =>
      suit.isRed ? const Color(0xFFC62828) : const Color(0xFF1A1A1A),
    CardFaceStyle.quatroCores => switch (suit) {
      Suit.copas => const Color(0xFFC62828),
      Suit.ouros => const Color(0xFF1565C0),
      Suit.paus => const Color(0xFF2E7D32),
      Suit.espadas => const Color(0xFF1A1A1A),
    },
    CardFaceStyle.noturno =>
      suit.isRed ? const Color(0xFFFF8A80) : const Color(0xFFF5F5F5),
  };

  @override
  Widget build(BuildContext context) {
    final face = TableLookScope.of(context).face;
    final color = suitColor(card.suit, face);
    final paper = face == CardFaceStyle.noturno
        ? const Color(0xFF23262B)
        : const Color(0xFFFFFDF7);
    final h = width / cardAspect;
    final corner = TextStyle(
      color: color,
      fontWeight: FontWeight.w800,
      fontSize: width * 0.26,
      height: 1,
    );
    return Opacity(
      opacity: dimmed ? 0.7 : 1,
      child: Container(
        width: width,
        height: h,
        decoration: BoxDecoration(
          color: paper,
          borderRadius: BorderRadius.circular(width * 0.1),
          border: Border.all(
            color: highlighted
                ? AppColors.gold
                : manilha
                ? AppColors.gold.withValues(alpha: 0.9)
                : face == CardFaceStyle.noturno
                ? const Color(0x55FFFFFF)
                : const Color(0x33000000),
            width: highlighted || manilha ? 2.5 : 1,
          ),
          boxShadow: const [
            BoxShadow(
              color: Color(0x55000000),
              blurRadius: 4,
              offset: Offset(0, 2),
            ),
          ],
        ),
        padding: EdgeInsets.all(width * 0.07),
        child: Stack(
          children: [
            Align(
              alignment: Alignment.topLeft,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(card.rank.symbol, style: corner),
                  SizedBox(height: width * 0.03),
                  SuitGlyph(card.suit, size: width * 0.16, color: color),
                ],
              ),
            ),
            Align(
              alignment: const Alignment(0.15, 0.35),
              child: SuitGlyph(card.suit, size: width * 0.36, color: color),
            ),
            if (manilha)
              Align(
                alignment: Alignment.topRight,
                child: Icon(
                  Icons.star_rounded,
                  size: width * 0.2,
                  color: AppColors.gold,
                ),
              ),
          ],
        ),
      ),
    );
  }
}

/// The back of a card (other players' hands, covered cards).
class CardBack extends StatelessWidget {
  const CardBack({super.key, required this.width, this.label});

  final double width;

  /// Small text over the back, e.g. "?" for a blind card.
  final String? label;

  @override
  Widget build(BuildContext context) {
    final back = TableLookScope.of(context).back;
    return Container(
      width: width,
      height: width / cardAspect,
      decoration: BoxDecoration(
        color: back.bottom,
        borderRadius: BorderRadius.circular(width * 0.1),
        border: Border.all(color: back.edge, width: width * 0.05),
        boxShadow: const [
          BoxShadow(
            color: Color(0x55000000),
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [back.top, back.bottom],
        ),
      ),
      clipBehavior: Clip.antiAlias,
      child: CustomPaint(
        painter: _BackPattern(
          back.edge == AppColors.gold
              ? AppColors.gold.withValues(alpha: 0.35)
              : Colors.white.withValues(alpha: 0.16),
        ),
        child: Center(
          child: label != null
              ? Text(
                  label!,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w800,
                    fontSize: width * 0.3,
                  ),
                )
              : Icon(
                  Icons.style,
                  color: Colors.white.withValues(alpha: 0.35),
                  size: width * 0.4,
                ),
        ),
      ),
    );
  }
}

/// Diamond lattice on the back of the cards.
class _BackPattern extends CustomPainter {
  const _BackPattern(this.color);
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1;
    final step = size.width / 5;
    for (var x = -size.height; x < size.width + size.height; x += step) {
      canvas
        ..drawLine(Offset(x, 0), Offset(x + size.height, size.height), paint)
        ..drawLine(Offset(x, size.height), Offset(x + size.height, 0), paint);
    }
  }

  @override
  bool shouldRepaint(_BackPattern old) => old.color != color;
}
