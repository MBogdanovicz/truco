import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../config/env.dart';

/// Signed-in user as the app sees it.
class AppUser {
  const AppUser({required this.id, required this.email, this.displayName});

  final String id;
  final String? email;

  /// Null until the user finishes onboarding.
  final String? displayName;

  bool get needsOnboarding =>
      displayName == null || displayName!.trim().isEmpty;
}

/// Passwordless authentication with a 6-digit code sent by email.
///
/// A code is used instead of a magic link because links open in Safari, not in
/// an installed iOS PWA.
class AuthRepository {
  AuthRepository(this._client);

  final SupabaseClient? _client;

  bool get isAvailable => _client != null;

  AppUser? get currentUser => _toAppUser(_client?.auth.currentUser);

  Stream<AppUser?> watchUser() {
    final client = _client;
    if (client == null) return Stream.value(null);
    return client.auth.onAuthStateChange
        .map((s) => _toAppUser(s.session?.user))
        .distinct((a, b) => a?.id == b?.id && a?.displayName == b?.displayName);
  }

  Future<void> sendCode(String email) =>
      _client!.auth.signInWithOtp(email: email.trim(), shouldCreateUser: true);

  Future<void> verifyCode(String email, String code) async {
    await _client!.auth.verifyOTP(
      email: email.trim(),
      token: code.trim(),
      type: OtpType.email,
    );
  }

  /// Stores the display name in the auth metadata (available offline from the
  /// cached session) and in the public `profiles` table (used by rankings).
  Future<void> setDisplayName(String name) async {
    final client = _client!;
    final trimmed = name.trim();
    await client.auth.updateUser(
      UserAttributes(data: {'display_name': trimmed}),
    );
    await client.from('profiles').upsert({
      'id': client.auth.currentUser!.id,
      'display_name': trimmed,
    });
  }

  Future<void> signOut() async => _client?.auth.signOut();

  static AppUser? _toAppUser(User? user) {
    if (user == null) return null;
    return AppUser(
      id: user.id,
      email: user.email,
      displayName: user.userMetadata?['display_name'] as String?,
    );
  }
}

final supabaseClientProvider = Provider<SupabaseClient?>(
  (ref) => Env.hasSupabase ? Supabase.instance.client : null,
);

final authRepositoryProvider = Provider<AuthRepository>(
  (ref) => AuthRepository(ref.watch(supabaseClientProvider)),
);

final currentUserProvider = StreamProvider<AppUser?>((ref) {
  final repo = ref.watch(authRepositoryProvider);
  return repo.watchUser();
});

/// Bridges auth changes to go_router's `refreshListenable`.
class AuthRefreshListenable extends ChangeNotifier {
  AuthRefreshListenable(Stream<Object?> stream) {
    _sub = stream.listen((_) => notifyListeners());
  }

  late final StreamSubscription<Object?> _sub;

  @override
  void dispose() {
    _sub.cancel();
    super.dispose();
  }
}
