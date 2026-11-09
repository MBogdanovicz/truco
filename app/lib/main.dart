import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'app.dart';
import 'config/env.dart';
import 'data/crash_reporting.dart';
import 'data/result_uploader.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await CrashReporting.init();
  if (Env.hasSupabase) {
    await Supabase.initialize(
      url: Env.supabaseUrl,
      publishableKey: Env.supabasePublishableKey,
    );
    final auth = Supabase.instance.client.auth;
    CrashReporting.setUser(auth.currentUser?.id);
    auth.onAuthStateChange.listen(
      (state) => CrashReporting.setUser(state.session?.user.id),
    );
  }
  final container = ProviderContainer();
  runApp(
    UncontrolledProviderScope(container: container, child: const TrucoApp()),
  );
  // Upload games finished while offline, now and whenever the app comes
  // back to the foreground (the internet may be back by then).
  unawaited(container.read(resultUploaderProvider).flush());
  AppLifecycleListener(
    onResume: () => unawaited(
      container.read(resultUploaderProvider).flush().catchError((_) {}),
    ),
  );
}
