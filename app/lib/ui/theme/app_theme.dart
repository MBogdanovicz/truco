import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

/// Brand palette: card-table felt green with red and gold accents.
abstract final class AppColors {
  static const felt = Color(0xFF1B5E3A);
  static const feltDark = Color(0xFF0F3D25);
  static const red = Color(0xFFC62828);
  static const gold = Color(0xFFE0B341);
  static const teamA = Color(0xFF2E7D5B);
  static const teamB = Color(0xFFB23A3A);
}

abstract final class AppTheme {
  static ThemeData material(Brightness brightness) {
    final scheme = ColorScheme.fromSeed(
      seedColor: AppColors.felt,
      brightness: brightness,
      secondary: AppColors.gold,
      tertiary: AppColors.red,
    );
    return ThemeData(
      colorScheme: scheme,
      useMaterial3: true,
      visualDensity: VisualDensity.standard,
    );
  }

  /// Material theme used under the Cupertino look on the PWA, so shared
  /// Material widgets pick up iOS-like behaviour (scroll physics, page
  /// transitions, fonts).
  static ThemeData cupertinoBase(Brightness brightness) => material(brightness)
      .copyWith(
        platform: TargetPlatform.iOS,
        cupertinoOverrideTheme: cupertino(brightness),
      );

  static CupertinoThemeData cupertino(Brightness brightness) =>
      CupertinoThemeData(
        brightness: brightness,
        primaryColor: brightness == Brightness.dark
            ? AppColors.gold
            : AppColors.felt,
      );
}
