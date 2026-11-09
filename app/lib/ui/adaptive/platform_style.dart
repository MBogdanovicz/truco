import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';

/// Visual language of the running build.
///
/// Android uses Material 3. The PWA targets mostly iPhone users, so it uses
/// Cupertino-style components regardless of the browser's OS.
enum AppPlatformStyle { material, cupertino }

/// Override with `--dart-define=APP_STYLE=material|cupertino` for testing.
const _override = String.fromEnvironment('APP_STYLE');

AppPlatformStyle get defaultPlatformStyle {
  if (_override.isNotEmpty) return AppPlatformStyle.values.byName(_override);
  return kIsWeb ? AppPlatformStyle.cupertino : AppPlatformStyle.material;
}

/// Makes the style available to adaptive widgets below it.
class PlatformStyleScope extends InheritedWidget {
  const PlatformStyleScope({
    super.key,
    required this.style,
    required super.child,
  });

  final AppPlatformStyle style;

  static AppPlatformStyle of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<PlatformStyleScope>()?.style ??
      defaultPlatformStyle;

  @override
  bool updateShouldNotify(PlatformStyleScope oldWidget) =>
      style != oldWidget.style;
}

extension PlatformStyleContext on BuildContext {
  bool get isCupertino =>
      PlatformStyleScope.of(this) == AppPlatformStyle.cupertino;
}
