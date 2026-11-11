import 'dart:async';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'auth_repository.dart';

// getToken/onTokenRefresh give the registration token that FCM's HTTP v1
// "token" target takes (the newer register() gives an installation id).
// ignore_for_file: deprecated_member_use

/// Firebase web app (public values; empty until the site is set up).
abstract final class FirebaseWeb {
  static const apiKey = String.fromEnvironment('FIREBASE_WEB_API_KEY');
  static const appId = String.fromEnvironment('FIREBASE_WEB_APP_ID');
  static const senderId = String.fromEnvironment('FIREBASE_SENDER_ID');
  static const projectId = String.fromEnvironment('FIREBASE_PROJECT_ID');
  static const vapidKey = String.fromEnvironment('FIREBASE_VAPID_KEY');

  static bool get configured =>
      apiKey.isNotEmpty &&
      appId.isNotEmpty &&
      senderId.isNotEmpty &&
      projectId.isNotEmpty &&
      vapidKey.isNotEmpty;

  static FirebaseOptions get options => const FirebaseOptions(
    apiKey: apiKey,
    appId: appId,
    messagingSenderId: senderId,
    projectId: projectId,
  );
}

enum PushState {
  unsupported,
  off,
  on,
  blocked,

  /// Allowed, but the browser's push service refused to register (e.g.
  /// Brave with Google push services turned off).
  failed,
}

/// A push that calls the person to a room ("intimar").
class Summons {
  const Summons({
    required this.title,
    required this.body,
    required this.path,
    this.kind,
    this.tapped = false,
  });
  final String title;
  final String body;

  /// Where tapping it goes, e.g. /jogo/entrar?codigo=ABC234.
  final String path;

  /// "turn" (your move in a slow game), "end" (slow game over), or null
  /// ("intimar").
  final String? kind;

  /// The person tapped the notification (otherwise the app was open).
  final bool tapped;

  static Summons? from(RemoteMessage m, {bool tapped = false}) {
    final path = m.data['path'];
    if (path is! String || !path.startsWith('/')) return null;
    return Summons(
      title: m.notification?.title ?? 'Truco!',
      body: m.notification?.body ?? '',
      path: path,
      kind: m.data['kind'] as String?,
      tapped: tapped,
    );
  }
}

/// Push notifications for "intimar" (Firebase Cloud Messaging): the Android
/// app, and the site where the browser allows it.
class PushService {
  PushService._();
  static final instance = PushService._();

  static bool get supported => kIsWeb
      ? FirebaseWeb.configured
      : defaultTargetPlatform == TargetPlatform.android;

  bool _ready = false;
  final _summons = StreamController<Summons>.broadcast();
  StreamSubscription<String>? _refresh;

  /// Summons that arrived while the app was open, or were tapped.
  Stream<Summons> get summons => _summons.stream;

  Future<bool> _init() async {
    if (_ready) return true;
    if (!supported) return false;
    try {
      if (Firebase.apps.isEmpty) {
        await Firebase.initializeApp(
          options: kIsWeb ? FirebaseWeb.options : null,
        );
      }
    } on Object catch (e) {
      debugPrint('Push off: $e');
      return false;
    }
    _ready = true;
    FirebaseMessaging.onMessage.listen((m) => _add(m));
    FirebaseMessaging.onMessageOpenedApp.listen((m) => _add(m, tapped: true));
    final first = await FirebaseMessaging.instance.getInitialMessage();
    if (first != null) _add(first, tapped: true);
    return true;
  }

  void _add(RemoteMessage m, {bool tapped = false}) {
    final s = Summons.from(m, tapped: tapped);
    if (s != null) _summons.add(s);
  }

  static const _askedKey = 'push.asked.v1';

  /// The person turned "Receber intimações" off on this device (the system
  /// permission can only be taken back in the settings).
  static const _offKey = 'push.off.v1';

  Future<PushState> state() async {
    if (!await _init()) return PushState.unsupported;
    final s = await FirebaseMessaging.instance.getNotificationSettings();
    switch (s.authorizationStatus) {
      case AuthorizationStatus.authorized:
      case AuthorizationStatus.provisional:
        final off = await _prefs((p) => p.getBool(_offKey))
            .catchError((Object _) => null);
        return off == true ? PushState.off : PushState.on;
      case AuthorizationStatus.notDetermined:
        return PushState.off;
      case AuthorizationStatus.denied:
      case AuthorizationStatus.deniedPermanently:
        // Android says "denied" before the app ever asked: that is "off",
        // and turning it on shows the system question.
        final asked = await _prefs((p) => p.getBool(_askedKey))
            .catchError((Object _) => null);
        return asked == true ? PushState.blocked : PushState.off;
    }
  }

  static Future<T> _prefs<T>(Future<T> Function(SharedPreferencesAsync) f) =>
      f(SharedPreferencesAsync());

  /// Asks permission (if needed) and registers this device for the account.
  Future<PushState> enable(SupabaseClient client) async {
    if (!await _init()) return PushState.unsupported;
    final s = await FirebaseMessaging.instance.requestPermission();
    await _prefs((p) async {
      await p.setBool(_askedKey, true);
      await p.remove(_offKey);
    }).catchError((Object e) => debugPrint('Push: $e'));
    if (s.authorizationStatus == AuthorizationStatus.denied ||
        s.authorizationStatus == AuthorizationStatus.deniedPermanently) {
      return PushState.blocked;
    }
    await _register(client);
    return PushState.on;
  }

  /// Keeps the token up to date when notifications are already allowed.
  Future<void> sync(SupabaseClient client) async {
    if (await state() == PushState.on) await _register(client);
  }

  Future<void> _register(SupabaseClient client) async {
    final messaging = FirebaseMessaging.instance;
    final token = await messaging
        .getToken(vapidKey: kIsWeb ? FirebaseWeb.vapidKey : null)
        .timeout(const Duration(seconds: 20));
    if (token == null) return;
    Future<void> save(String t) => client.rpc(
      'save_push_token',
      params: {'p_token': t, 'p_platform': kIsWeb ? 'web' : 'android'},
    );
    await save(token);
    _refresh ??= messaging.onTokenRefresh.listen(
      (t) => save(t).catchError((Object e) => debugPrint('Token: $e')),
    );
  }

  /// Stops pushes to this device (e.g. on sign out).
  Future<void> disable(SupabaseClient client) async {
    await _prefs((p) => p.setBool(_offKey, true))
        .catchError((Object e) => debugPrint('Push: $e'));
    await _refresh?.cancel();
    _refresh = null;
    if (!_ready) return;
    final token = await FirebaseMessaging.instance.getToken(
      vapidKey: kIsWeb ? FirebaseWeb.vapidKey : null,
    );
    if (token != null) {
      await client.from('push_tokens').delete().eq('token', token);
    }
  }
}

/// Registers this device for pushes when the person has allowed them.
final pushSyncProvider = FutureProvider.autoDispose<void>((ref) async {
  if (!PushService.supported) return;
  final client = ref.watch(supabaseClientProvider);
  final userId = ref.watch(
    currentUserProvider.select(
      (u) => u.value == null || u.value!.isGuest ? null : u.value!.id,
    ),
  );
  if (client == null || userId == null) return;
  try {
    await PushService.instance.sync(client);
  } on Object catch (e) {
    debugPrint('Push sync failed: $e');
  }
});

/// Whether this device gets "intimar" pushes. When notifications are
/// allowed (also when the person allowed them in the phone's settings), the
/// device is registered for the account.
final pushStateProvider = FutureProvider.autoDispose<PushState>((ref) async {
  final state = await PushService.instance.state();
  final client = ref.read(supabaseClientProvider);
  final user = ref.read(currentUserProvider).value;
  if (state == PushState.on &&
      client != null &&
      user != null &&
      !user.isGuest) {
    try {
      await PushService.instance._register(client);
    } on Object catch (e) {
      // ignore: avoid_print
      print('Push register failed: $e'); // shows in the browser console
    }
  }
  return state;
});

/// Sends an "intimar" push to the other members of [groupId].
/// Returns how many devices got it, and how many sends failed.
Future<({int sent, int failed, int members})> summonGroup(
  SupabaseClient client, {
  required String groupId,
  required String code,
  required bool game,
}) async {
  final res = await client.functions.invoke(
    'intimar',
    body: {
      'groupId': groupId,
      'code': code,
      'kind': game ? 'game' : 'scorekeeper',
    },
  );
  final data = res.data as Map;
  return (
    sent: data['sent'] as int,
    failed: (data['failed'] as int?) ?? 0,
    members: data['members'] as int,
  );
}
