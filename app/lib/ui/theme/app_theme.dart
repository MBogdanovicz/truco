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

  /// Icon tints for menu tiles (iOS-settings style squares, Material tonal
  /// containers).
  static const blue = Color(0xFF2F6FDB);
  static const purple = Color(0xFF7A4FD1);
  static const orange = Color(0xFFE07A1F);
}

abstract final class AppTheme {
  /// Font of the iOS look (stand-in for San Francisco, which can't be
  /// bundled). Android keeps Roboto.
  static const cupertinoFont = 'Inter';

  static ThemeData material(Brightness brightness) {
    final scheme = ColorScheme.fromSeed(
      seedColor: AppColors.felt,
      brightness: brightness,
      secondary: AppColors.gold,
      tertiary: AppColors.red,
    );
    // Android 16 style: grouped list items sit on a tinted page.
    final page = scheme.surfaceContainer;
    return ThemeData(
      colorScheme: scheme,
      useMaterial3: true,
      visualDensity: VisualDensity.standard,
      scaffoldBackgroundColor: page,
      appBarTheme: AppBarTheme(
        backgroundColor: page,
        surfaceTintColor: Colors.transparent,
        scrolledUnderElevation: 0,
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size(64, 52),
          textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        color: scheme.surfaceBright,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      ),
      dialogTheme: const DialogThemeData(
        constraints: BoxConstraints(minWidth: 280, maxWidth: 480),
      ),
    );
  }

  /// Material theme used under the Cupertino look on the PWA, so shared
  /// Material widgets pick up iOS-like behaviour (scroll physics, page
  /// transitions, fonts).
  static ThemeData cupertinoBase(Brightness brightness) {
    final base = material(brightness);
    final dark = brightness == Brightness.dark;
    return base.copyWith(
      platform: TargetPlatform.iOS,
      cupertinoOverrideTheme: cupertino(brightness),
      scaffoldBackgroundColor: dark
          ? CupertinoColors.black
          : const Color(0xFFF2F2F7),
      textTheme: base.textTheme.apply(fontFamily: cupertinoFont),
      primaryTextTheme: base.primaryTextTheme.apply(fontFamily: cupertinoFont),
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        backgroundColor:
            (dark ? const Color(0xFF3A3A3C) : const Color(0xFF1C1C1E))
                .withValues(alpha: 0.92),
        contentTextStyle: const TextStyle(
          fontFamily: cupertinoFont,
          color: Colors.white,
          fontSize: 15,
        ),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        elevation: 0,
      ),
    );
  }

  static CupertinoThemeData cupertino(Brightness brightness) {
    final primary = brightness == Brightness.dark
        ? AppColors.gold
        : AppColors.felt;
    final t = CupertinoTextThemeData(primaryColor: primary);
    TextStyle f(TextStyle s) => s.copyWith(fontFamily: cupertinoFont);
    return CupertinoThemeData(
      brightness: brightness,
      primaryColor: primary,
      textTheme: CupertinoTextThemeData(
        textStyle: f(t.textStyle),
        actionTextStyle: f(t.actionTextStyle),
        tabLabelTextStyle: f(t.tabLabelTextStyle),
        navTitleTextStyle: f(t.navTitleTextStyle),
        navLargeTitleTextStyle: f(t.navLargeTitleTextStyle),
        navActionTextStyle: f(t.navActionTextStyle),
        pickerTextStyle: f(t.pickerTextStyle),
        dateTimePickerTextStyle: f(t.dateTimePickerTextStyle),
      ),
    );
  }
}
