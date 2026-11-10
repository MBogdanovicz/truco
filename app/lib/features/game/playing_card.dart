import 'package:flutter/material.dart' hide Card;

import '../../domain/game/cards.dart';
import '../../ui/theme/app_theme.dart';

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

  @override
  Widget build(BuildContext context) {
    final color = card.suit.isRed
        ? const Color(0xFFC62828)
        : const Color(0xFF1A1A1A);
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
          color: const Color(0xFFFFFDF7),
          borderRadius: BorderRadius.circular(width * 0.1),
          border: Border.all(
            color: highlighted
                ? AppColors.gold
                : manilha
                ? AppColors.gold.withValues(alpha: 0.9)
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
                  Text(
                    card.suit.symbol,
                    style: corner.copyWith(fontSize: width * 0.2),
                  ),
                ],
              ),
            ),
            Align(
              alignment: const Alignment(0.15, 0.35),
              child: Text(
                card.suit.symbol,
                style: TextStyle(color: color, fontSize: width * 0.5),
              ),
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
    return Container(
      width: width,
      height: width / cardAspect,
      decoration: BoxDecoration(
        color: const Color(0xFF8E1F2B),
        borderRadius: BorderRadius.circular(width * 0.1),
        border: Border.all(color: const Color(0xFFFFFDF7), width: width * 0.05),
        boxShadow: const [
          BoxShadow(
            color: Color(0x55000000),
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFA62A38), Color(0xFF6E1520)],
        ),
      ),
      alignment: Alignment.center,
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
    );
  }
}
