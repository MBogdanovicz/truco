import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'auth_repository.dart';
import 'crash_reporting.dart';
import 'entitlements.dart';

/// Google Play one-time products.
abstract final class PremiumProducts {
  /// Full price; the buyer can invite 3 friends.
  static const full = 'premium';

  /// Reduced price, only for an e-mail with a pending invite.
  static const invite = 'premium_invite';

  static const all = {full, invite};

  /// Friends a full-price buyer may invite (also enforced by the server).
  static const inviteLimit = 3;
}

class PremiumInvite {
  const PremiumInvite({
    required this.id,
    required this.email,
    required this.redeemed,
  });

  final String id;
  final String email;
  final bool redeemed;
}

/// Someone invited the current user.
class ReceivedInvite {
  const ReceivedInvite({required this.id, required this.inviterName});

  final String id;
  final String? inviterName;
}

/// The Google Play purchase belongs to another account of the app.
class PurchaseOwnedByAnotherAccount implements Exception {
  const PurchaseOwnedByAnotherAccount();
}

class InviteError implements Exception {
  const InviteError(this.code);

  /// Server code: not_full_buyer, cannot_invite_self, already_premium,
  /// already_invited, invite_limit_reached.
  final String code;
}

/// Premium purchases and invites on the server.
class PremiumRepository {
  PremiumRepository(this._client);

  final SupabaseClient _client;

  String get _uid => _client.auth.currentUser!.id;

  Future<bool> boughtFullPrice() async {
    final rows = await _client
        .from('premium_purchases')
        .select('product_id')
        .eq('user_id', _uid)
        .eq('product_id', PremiumProducts.full);
    return rows.isNotEmpty;
  }

  Future<List<PremiumInvite>> myInvites() async {
    final rows = await _client
        .from('premium_invites')
        .select('id, email, redeemed_by')
        .eq('inviter_id', _uid)
        .order('created_at');
    return [
      for (final r in rows)
        PremiumInvite(
          id: r['id'] as String,
          email: r['email'] as String,
          redeemed: r['redeemed_by'] != null,
        ),
    ];
  }

  Future<void> invite(String email) async {
    try {
      await _client.rpc(
        'create_premium_invite',
        params: {'p_email': email.trim()},
      );
    } on PostgrestException catch (e) {
      const codes = [
        'not_full_buyer',
        'cannot_invite_self',
        'already_premium',
        'already_invited',
        'invite_limit_reached',
      ];
      final code = codes.where(e.message.contains);
      if (code.isNotEmpty) throw InviteError(code.first);
      rethrow;
    }
  }

  Future<void> cancelInvite(String id) =>
      _client.rpc('cancel_premium_invite', params: {'p_invite_id': id});

  Future<ReceivedInvite?> receivedInvite() async {
    final rows = await _client.rpc('my_premium_invite') as List;
    if (rows.isEmpty) return null;
    final r = rows.first as Map<String, dynamic>;
    return ReceivedInvite(
      id: r['invite_id'] as String,
      inviterName: r['inviter_name'] as String?,
    );
  }

  /// Asks the server to check the purchase with Google and turn premium on.
  /// Returns true once premium is granted (false while Google says pending).
  ///
  /// Throws [PurchaseOwnedByAnotherAccount] when this Google Play purchase
  /// already unlocked premium for another e-mail.
  Future<bool> verify(String productId, String purchaseToken) async {
    try {
      final res = await _client.functions.invoke(
        'verify-purchase',
        body: {'productId': productId, 'purchaseToken': purchaseToken},
      );
      final data = res.data;
      return data is Map && data['status'] == 'premium';
    } on FunctionException catch (e) {
      final details = e.details;
      if (e.status == 409 &&
          details is Map &&
          details['error'] == 'token_used') {
        throw const PurchaseOwnedByAnotherAccount();
      }
      rethrow;
    }
  }
}

final premiumRepositoryProvider = Provider<PremiumRepository?>((ref) {
  final client = ref.watch(supabaseClientProvider);
  return client == null ? null : PremiumRepository(client);
});

final receivedInviteProvider = FutureProvider.autoDispose<ReceivedInvite?>((
  ref,
) async {
  final user = ref.watch(currentUserProvider).value;
  final repo = ref.watch(premiumRepositoryProvider);
  if (user == null || user.isGuest || repo == null) return null;
  return repo.receivedInvite();
});

final myInvitesProvider = FutureProvider.autoDispose<List<PremiumInvite>>((
  ref,
) async {
  final repo = ref.watch(premiumRepositoryProvider);
  if (repo == null) return const [];
  return repo.myInvites();
});

final boughtFullPriceProvider = FutureProvider.autoDispose<bool>((ref) async {
  final user = ref.watch(currentUserProvider).value;
  final repo = ref.watch(premiumRepositoryProvider);
  if (user == null || user.isGuest || repo == null) return false;
  return repo.boughtFullPrice();
});

/// State of the Play Store purchase flow.
enum StoreStatus {
  idle,
  buying,
  verifying,

  /// Looking for past purchases of this Google account.
  restoring,
  done,
  failed,

  /// Restore found no premium purchase on this Google account.
  nothingToRestore,

  /// This Google account's purchase already unlocked another e-mail.
  otherAccount,
}

/// Google Play billing (Android only). Listens to purchase updates for the
/// whole app session, so purchases finished while the app was closed are
/// also verified.
class PremiumStore extends Notifier<StoreStatus> {
  StreamSubscription<List<PurchaseDetails>>? _sub;

  static bool get isSupported =>
      !kIsWeb && defaultTargetPlatform == TargetPlatform.android;

  @override
  StoreStatus build() {
    // A new sign-in starts with a clean slate (no spinner or message left
    // over from the previous account).
    ref.listen(currentUserProvider.select((u) => u.value?.id), (_, _) {
      state = StoreStatus.idle;
    });
    if (isSupported) {
      _sub = InAppPurchase.instance.purchaseStream.listen(
        _onPurchases,
        onError: (Object e) => debugPrint('Purchase stream error: $e'),
      );
      ref.onDispose(() => _sub?.cancel());
    }
    return StoreStatus.idle;
  }

  /// Products available to buy, with the store's localized prices.
  Future<Map<String, ProductDetails>> products() async {
    if (!isSupported || !await InAppPurchase.instance.isAvailable()) {
      return const {};
    }
    final res = await InAppPurchase.instance.queryProductDetails(
      PremiumProducts.all,
    );
    return {for (final p in res.productDetails) p.id: p};
  }

  Future<void> buy(ProductDetails product) async {
    state = StoreStatus.buying;
    try {
      final launched = await InAppPurchase.instance.buyNonConsumable(
        purchaseParam: PurchaseParam(productDetails: product),
      );
      // Not launched usually means this Google account already owns it
      // (bought with another e-mail, or on another phone): look it up.
      if (!launched) await restore();
    } on Object catch (e, st) {
      CrashReporting.recordError(e, st, reason: 'buy ${product.id}');
      state = StoreStatus.failed;
    }
  }

  /// Re-delivers past purchases (e.g. after reinstalling the app).
  Future<void> restore() async {
    state = StoreStatus.restoring;
    try {
      await InAppPurchase.instance.restorePurchases();
    } on Object catch (e, st) {
      CrashReporting.recordError(e, st, reason: 'restore');
      state = StoreStatus.failed;
      return;
    }
    // Restored purchases arrive on the stream; if none did, say so.
    await Future<void>.delayed(const Duration(seconds: 4));
    if (state == StoreStatus.restoring) state = StoreStatus.nothingToRestore;
  }

  Future<void> _onPurchases(List<PurchaseDetails> purchases) async {
    if (state == StoreStatus.buying &&
        purchases.isNotEmpty &&
        purchases.every((p) => !PremiumProducts.all.contains(p.productID))) {
      // Errors and cancels from the billing flow may come without a product.
      final p = purchases.first;
      state = p.status == PurchaseStatus.canceled
          ? StoreStatus.idle
          : StoreStatus.failed;
      if (p.status == PurchaseStatus.error) {
        CrashReporting.log('Purchase error: ${p.error?.message}');
      }
      return;
    }
    for (final p in purchases) {
      if (!PremiumProducts.all.contains(p.productID)) continue;
      switch (p.status) {
        case PurchaseStatus.pending:
          state = StoreStatus.buying;
        case PurchaseStatus.canceled:
          state = StoreStatus.idle;
        case PurchaseStatus.error:
          CrashReporting.log('Purchase error: ${p.error?.message}');
          state = StoreStatus.failed;
        case PurchaseStatus.purchased || PurchaseStatus.restored:
          await _verify(p);
      }
    }
  }

  Future<void> _verify(PurchaseDetails p) async {
    final repo = ref.read(premiumRepositoryProvider);
    if (repo == null) return;
    state = StoreStatus.verifying;
    try {
      final granted = await repo.verify(
        p.productID,
        p.verificationData.serverVerificationData,
      );
      // Only acknowledge once the server recorded it: an unacknowledged
      // purchase is refunded by Google after 3 days.
      if (granted && p.pendingCompletePurchase) {
        await InAppPurchase.instance.completePurchase(p);
      }
      ref
        ..invalidate(entitlementsProvider)
        ..invalidate(boughtFullPriceProvider)
        ..invalidate(receivedInviteProvider);
      state = granted ? StoreStatus.done : StoreStatus.buying;
    } on PurchaseOwnedByAnotherAccount {
      CrashReporting.log('Purchase ${p.productID} belongs to another account');
      state = StoreStatus.otherAccount;
    } on Object catch (e, st) {
      CrashReporting.recordError(e, st, reason: 'verify ${p.productID}');
      state = StoreStatus.failed;
    }
  }
}

final premiumStoreProvider = NotifierProvider<PremiumStore, StoreStatus>(
  PremiumStore.new,
);
