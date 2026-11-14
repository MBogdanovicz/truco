import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../config/env.dart';

/// Signed-in user as the app sees it.
class AppUser {
  const AppUser({
    required this.id,
    required this.email,
    this.displayName,
    this.isGuest = false,
  });

  final String id;
  final String? email;

  /// Null until the user finishes onboarding.
  final String? displayName;

  /// Signed in without e-mail (Supabase anonymous user): can play in rooms,
  /// but has no profile, so games with guests never count for rankings and
  /// groups are unavailable.
  final bool isGuest;

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

  /// Signs in without e-mail, just to join a scorekeeper room.
  Future<void> signInAsGuest(String name, {String? captchaToken}) async {
    await _client!.auth.signInAnonymously(
      data: {'display_name': name.trim()},
      captchaToken: captchaToken,
    );
  }

  /// Account used by Google Play's app review. Its inbox can't receive
  /// codes, so it signs in with a numeric password typed in the code field.
  /// The user (and its password) is created by hand in Supabase Auth.
  static const reviewEmail = 'review@mytrophies.app';

  static bool isReviewEmail(String email) =>
      email.trim().toLowerCase() == reviewEmail;

  Future<void> sendCode(String email, {String? captchaToken}) async {
    if (isReviewEmail(email)) return;
    await _client!.auth.signInWithOtp(
      email: email.trim(),
      shouldCreateUser: true,
      captchaToken: captchaToken,
    );
  }

  Future<void> verifyCode(
    String email,
    String code, {
    String? captchaToken,
  }) async {
    if (isReviewEmail(email)) {
      await _client!.auth.signInWithPassword(
        email: reviewEmail,
        password: code.trim(),
        captchaToken: captchaToken,
      );
      return;
    }
    await _client!.auth.verifyOTP(
      email: email.trim(),
      token: code.trim(),
      type: OtpType.email,
    );
  }

  /// Stores the display name in the auth metadata (available offline from the
  /// cached session) and in the public `profiles` table (used by rankings).
  /// [freeRename]: a free account's one name change after the first name.
  Future<void> setDisplayName(String name, {bool freeRename = false}) async {
    final client = _client!;
    final trimmed = name.trim();
    await client.auth.updateUser(
      UserAttributes(
        data: {'display_name': trimmed, if (freeRename) 'free_rename': true},
      ),
    );
    // The database also copies the metadata name into profiles (trigger
    // on auth.users); this update just makes it visible right away.
    await client
        .from('profiles')
        .update({'display_name': trimmed})
        .eq('id', client.auth.currentUser!.id);
  }

  /// Whether this account already used its one free name change.
  bool get usedFreeRename =>
      _client?.auth.currentUser?.userMetadata?['free_rename'] == true;

  Future<void> signOut() async => _client?.auth.signOut();

  /// Deletes the account and its data on the server, then signs out.
  Future<void> deleteAccount() async {
    final client = _client!;
    await client.rpc('delete_my_account');
    await client.auth.signOut();
  }

  static AppUser? _toAppUser(User? user) {
    if (user == null) return null;
    return AppUser(
      id: user.id,
      email: user.email,
      displayName: user.userMetadata?['display_name'] as String?,
      isGuest: user.isAnonymous,
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
