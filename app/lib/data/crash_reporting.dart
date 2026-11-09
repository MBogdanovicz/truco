import 'dart:async';
import 'dart:isolate';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:flutter/foundation.dart';

import '../config/env.dart';

/// Crash reports and breadcrumb logs through Firebase Crashlytics.
///
/// Android release builds only: the web has no Crashlytics, and builds made
/// without `android/app/google-services.json` (CI) fail to initialize
/// Firebase, so reporting simply stays off.
abstract final class CrashReporting {
  static bool _enabled = false;

  static Future<void> init() async {
    if (kIsWeb || defaultTargetPlatform != TargetPlatform.android) return;
    try {
      await Firebase.initializeApp();
    } catch (e) {
      debugPrint('Crashlytics off: $e');
      return;
    }
    final crashlytics = FirebaseCrashlytics.instance;
    await crashlytics.setCrashlyticsCollectionEnabled(kReleaseMode);
    await crashlytics.setCustomKey('commit', Env.commit);
    _enabled = true;

    FlutterError.onError = crashlytics.recordFlutterFatalError;
    PlatformDispatcher.instance.onError = (error, stack) {
      crashlytics.recordError(error, stack, fatal: true);
      return true;
    };
    Isolate.current.addErrorListener(
      RawReceivePort((List<dynamic> pair) {
        final [error, stack] = pair;
        crashlytics.recordError(
          error,
          stack is String ? StackTrace.fromString(stack) : null,
          fatal: true,
        );
      }).sendPort,
    );
  }

  /// A breadcrumb attached to the next crash report.
  static void log(String message) {
    if (kDebugMode) debugPrint(message);
    if (_enabled) unawaited(FirebaseCrashlytics.instance.log(message));
  }

  /// A handled error worth knowing about (sent as non-fatal).
  static void recordError(Object error, StackTrace? stack, {String? reason}) {
    if (_enabled) {
      unawaited(
        FirebaseCrashlytics.instance.recordError(error, stack, reason: reason),
      );
    }
  }

  /// Ties reports to the signed-in account id (never the e-mail).
  static void setUser(String? userId) {
    if (_enabled) {
      unawaited(FirebaseCrashlytics.instance.setUserIdentifier(userId ?? ''));
    }
  }
}
