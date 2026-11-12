import 'data/game_prefs.dart';

import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'data/premium_repository.dart';
import 'features/groups/summon_widgets.dart';
import 'router.dart';
import 'ui/adaptive/platform_style.dart';
import 'ui/theme/app_theme.dart';

class TrucoApp extends ConsumerWidget {
  const TrucoApp({super.key, this.style});

  /// Defaults to [defaultPlatformStyle]; overridable in tests.
  final AppPlatformStyle? style;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Keeps the Play purchase listener alive for the whole session.
    ref.listen(premiumStoreProvider, (_, _) {});
    // Loads the player's words early, so every screen uses them.
    ref.listen(termsProvider, (_, _) {});
    final effective = style ?? defaultPlatformStyle;
    final cupertino = effective == AppPlatformStyle.cupertino;
    return PlatformStyleScope(
      style: effective,
      child: MaterialApp.router(
        title: 'Truco! Sofá de zona',
        debugShowCheckedModeBanner: false,
        theme: cupertino
            ? AppTheme.cupertinoBase(Brightness.light)
            : AppTheme.material(Brightness.light),
        darkTheme: cupertino
            ? AppTheme.cupertinoBase(Brightness.dark)
            : AppTheme.material(Brightness.dark),
        locale: const Locale('pt', 'BR'),
        supportedLocales: const [Locale('pt', 'BR')],
        localizationsDelegates: GlobalMaterialLocalizations.delegates,
        routerConfig: ref.watch(routerProvider),
        builder: (context, child) =>
            SummonsListener(child: child ?? const SizedBox.shrink()),
      ),
    );
  }
}
