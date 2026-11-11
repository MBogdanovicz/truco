import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

import 'crash_reporting.dart';
import 'entitlements.dart';

/// The interstitial shown to free accounts before each game (Android only;
/// Premium removes it).
///
/// Only production builds use the real AdMob unit (`--dart-define=
/// ADMOB_REAL=true`, the "real_ads" option of release.yml). Test and
/// closed-testing builds show Google's test ads, so testers tapping them
/// never breaks AdMob's rules.
class Ads {
  Ads._();

  static const _real = bool.fromEnvironment('ADMOB_REAL');
  static const _unitId = _real
      ? 'ca-app-pub-2698056923143428/4305668286'
      : 'ca-app-pub-3940256099942544/1033173712';

  /// No more than one ad in this interval, even for quick rematches.
  static const _minGap = Duration(minutes: 3);

  static bool get supported =>
      !kIsWeb && defaultTargetPlatform == TargetPlatform.android;

  static InterstitialAd? _ad;
  static bool _loading = false;
  static bool _started = false;
  static DateTime? _lastShown;

  /// Starts the SDK, asks for consent where the law requires it (Europe),
  /// and loads the first ad. Safe to call more than once.
  static Future<void> init() async {
    if (!supported || _started) return;
    _started = true;
    try {
      await _consent();
      await MobileAds.instance.initialize();
      _load();
    } on Object catch (e) {
      CrashReporting.log('Ads init failed: $e');
    }
  }

  static Future<void> _consent() {
    final done = Completer<void>();
    ConsentInformation.instance.requestConsentInfoUpdate(
      ConsentRequestParameters(),
      () => ConsentForm.loadAndShowConsentFormIfRequired((_) {
        if (!done.isCompleted) done.complete();
      }),
      (_) {
        if (!done.isCompleted) done.complete();
      },
    );
    return done.future.timeout(const Duration(seconds: 10), onTimeout: () {});
  }

  static void _load() {
    if (_ad != null || _loading) return;
    _loading = true;
    unawaited(
      InterstitialAd.load(
        adUnitId: _unitId,
        request: const AdRequest(),
        adLoadCallback: InterstitialAdLoadCallback(
          onAdLoaded: (ad) {
            _ad = ad;
            _loading = false;
          },
          onAdFailedToLoad: (e) {
            _loading = false;
            debugPrint('Ad failed to load: $e');
          },
        ),
      ).catchError((Object e) {
        _loading = false;
      }),
    );
  }

  /// Shows the ad before a game and waits until it is closed. Does nothing
  /// for Premium, on the web, or when no ad is ready (no internet, say):
  /// a game never waits for an ad to load.
  static Future<void> beforeGame(WidgetRef ref) async {
    // Started by main(), so widget tests never reach the ad SDK.
    if (!supported || !_started) return;
    // No ad ready (offline, say): nothing to wait for, not even Premium.
    if (_ad == null) {
      _load();
      return;
    }
    final last = _lastShown;
    if (last != null && DateTime.now().difference(last) < _minGap) return;
    final Entitlements ent;
    try {
      ent = await ref
          .read(entitlementsProvider.future)
          .timeout(const Duration(seconds: 6));
    } on Object {
      return;
    }
    if (ent.adFree) return;
    final ad = _ad;
    if (ad == null) return;
    _ad = null;
    final closed = Completer<void>();
    void finish(Ad a) {
      a.dispose();
      if (!closed.isCompleted) closed.complete();
      _load();
    }

    ad.fullScreenContentCallback = FullScreenContentCallback(
      onAdDismissedFullScreenContent: finish,
      onAdFailedToShowFullScreenContent: (a, _) => finish(a),
    );
    _lastShown = DateTime.now();
    try {
      await ad.show();
    } on Object {
      finish(ad);
    }
    await closed.future.timeout(const Duration(minutes: 2), onTimeout: () {});
  }
}
