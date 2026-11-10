import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:in_app_update/in_app_update.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../data/crash_reporting.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import 'release_notes.dart';

/// Once per app session, on the home screen: offers a newer version from
/// Google Play, then shows what's new since the last version the user saw.
class StartupChecks extends StatefulWidget {
  const StartupChecks({super.key, required this.child});

  final Widget child;

  @override
  State<StartupChecks> createState() => _StartupChecksState();
}

class _StartupChecksState extends State<StartupChecks> {
  static bool _ran = false;
  static const _seenKey = 'release_notes.seen';

  @override
  void initState() {
    super.initState();
    if (_ran) return;
    _ran = true;
    WidgetsBinding.instance.addPostFrameCallback((_) => unawaited(_run()));
  }

  Future<void> _run() async {
    try {
      await _offerUpdate();
      await _showReleaseNotes();
    } on Object catch (e, st) {
      CrashReporting.recordError(e, st, reason: 'startup checks');
    }
  }

  /// Google Play in-app update. Only works for installs from the store;
  /// anywhere else (web, sideloaded builds) it throws and is skipped.
  Future<void> _offerUpdate() async {
    if (kIsWeb || defaultTargetPlatform != TargetPlatform.android) return;
    final AppUpdateInfo info;
    try {
      info = await InAppUpdate.checkForUpdate();
    } on Object catch (e) {
      debugPrint('Update check skipped: $e');
      return;
    }
    if (info.updateAvailability != UpdateAvailability.updateAvailable ||
        !info.immediateUpdateAllowed ||
        !mounted) {
      return;
    }
    final update = await showAppDialog<bool>(
      context,
      title: 'Versão nova disponível',
      message: 'Tem uma versão nova do Truco! na Play Store. Atualizar agora?',
      actions: const [
        AppDialogAction(label: 'Agora não', value: false),
        AppDialogAction(label: 'Atualizar', value: true, isPrimary: true),
      ],
    );
    if (update == true) await InAppUpdate.performImmediateUpdate();
  }

  Future<void> _showReleaseNotes() async {
    if (releaseNotes.isEmpty) return;
    final prefs = SharedPreferencesAsync();
    final latest = releaseNotes.last.id;
    final seen = await prefs.getInt(_seenKey);
    await prefs.setInt(_seenKey, latest);
    // A fresh install has nothing "new" to show.
    if (seen == null || seen >= latest || !mounted) return;
    final items = [
      for (final n in releaseNotes)
        if (n.id > seen) ...[...n.items, if (!kIsWeb) ...n.appOnly],
    ];
    if (items.isEmpty) return;
    await showAppDialog<void>(
      context,
      title: 'Novidades',
      content: Padding(
        padding: const EdgeInsets.only(top: 8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            for (final item in items)
              Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: Text('• $item', textAlign: TextAlign.start),
              ),
          ],
        ),
      ),
      actions: const [
        AppDialogAction(label: 'Legal!', value: null, isPrimary: true),
      ],
    );
  }

  @override
  Widget build(BuildContext context) => widget.child;
}
