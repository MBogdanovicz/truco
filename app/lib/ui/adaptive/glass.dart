import 'dart:ui';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

/// Page background of the iOS look: a soft felt-and-gold wash that the
/// frosted panels and bars blur over.
class GlassBackground extends StatelessWidget {
  const GlassBackground({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final dark = CupertinoTheme.brightnessOf(context) == Brightness.dark;
    return DecoratedBox(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: dark
              ? const [Color(0xFF0B1A12), Color(0xFF000000), Color(0xFF1A160B)]
              : const [Color(0xFFE3EFE7), Color(0xFFF2F2F7), Color(0xFFF6EFDC)],
          stops: const [0, 0.55, 1],
        ),
      ),
      child: child,
    );
  }
}

/// Frosted "liquid glass" surface: translucent fill, background blur, a
/// light rim and a soft shadow.
class GlassPanel extends StatelessWidget {
  const GlassPanel({
    super.key,
    required this.child,
    this.radius = 24,
    this.tint,
    this.padding = EdgeInsets.zero,
  });

  final Widget child;
  final double radius;

  /// Solid color instead of the frosted fill (for branded cards).
  final Color? tint;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final dark = CupertinoTheme.brightnessOf(context) == Brightness.dark;
    final shape = BorderRadius.circular(radius);
    final fill =
        tint ??
        (dark
            ? const Color(0xFF1C1C1E).withValues(alpha: 0.72)
            : Colors.white.withValues(alpha: 0.72));
    final rim = Colors.white.withValues(alpha: dark ? 0.12 : 0.7);
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: shape,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: dark ? 0.3 : 0.06),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: shape,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 24, sigmaY: 24),
          child: DecoratedBox(
            decoration: BoxDecoration(
              color: fill,
              borderRadius: shape,
              border: Border.all(color: rim, width: 0.8),
            ),
            child: DecoratedBox(
              // Subtle top sheen, like light catching the glass.
              decoration: BoxDecoration(
                borderRadius: shape,
                gradient: tint == null
                    ? LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.center,
                        colors: [
                          Colors.white.withValues(alpha: dark ? 0.05 : 0.2),
                          Colors.white.withValues(alpha: 0),
                        ],
                      )
                    : null,
              ),
              child: Padding(padding: padding, child: child),
            ),
          ),
        ),
      ),
    );
  }
}

/// Translucent fill for navigation bars in the iOS look.
Color glassBarColor(BuildContext context) =>
    CupertinoTheme.brightnessOf(context) == Brightness.dark
    ? const Color(0xFF121212).withValues(alpha: 0.7)
    : const Color(0xFFF9F9F9).withValues(alpha: 0.7);

/// Felt-colored hero card color shared by both looks.
const brandCardColor = AppColors.felt;
