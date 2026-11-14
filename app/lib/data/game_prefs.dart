import 'dart:convert';

import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../domain/game/rules.dart';
import '../domain/game/terms.dart';

/// The table rules the player likes ("Configurações"), used as the starting
/// point when creating a game, a room or a tournament. Kept on this device,
/// under the keys the game setup screen used before, so old choices stay.
class PreferredRulesNotifier extends Notifier<TrucoRules> {
  static const _kFixed = 'game.fixedManilhas';
  static const _kCover = 'game.coveredCard';
  static const _kCoverPartner = 'game.partnerSeesCovered';
  static const _kIron = 'game.ironHand';
  static const _kSeeOnRaise = 'game.seePartnerOnRaise';
  static const _kSeeOnDecision = 'game.bothTeamsSeeOnDecision';
  static const _kFoot = 'game.dealerSeesPartnerThirdCard';
  static const _kTurn = 'game.turnSeconds';

  @override
  TrucoRules build() {
    _load();
    return TrucoRules.paulista;
  }

  Future<void> _load() async {
    try {
      final p = await SharedPreferences.getInstance();
      final r = TrucoRules.paulista;
      final turn = p.getInt(_kTurn);
      state = r.copyWith(
        manilhaMode: (p.getBool(_kFixed) ?? false)
            ? ManilhaMode.fixed
            : ManilhaMode.vira,
        allowCoveredCard: p.getBool(_kCover),
        partnerSeesCovered: p.getBool(_kCoverPartner),
        ironHand: p.getBool(_kIron),
        seePartnerOnRaise: p.getBool(_kSeeOnRaise),
        bothTeamsSeeOnDecision: p.getBool(_kSeeOnDecision),
        dealerSeesPartnerThirdCard: p.getBool(_kFoot),
        turnSeconds: TrucoRules.turnSecondsOptions.contains(turn) ? turn : null,
      );
    } on Object {
      // Storage unavailable (tests, private windows): keep the defaults.
    }
  }

  Future<void> set(TrucoRules rules) async {
    state = rules;
    try {
      final p = await SharedPreferences.getInstance();
      await p.setBool(_kFixed, rules.manilhaMode == ManilhaMode.fixed);
      await p.setBool(_kCover, rules.allowCoveredCard);
      await p.setBool(_kCoverPartner, rules.partnerSeesCovered);
      await p.setBool(_kIron, rules.ironHand);
      await p.setBool(_kSeeOnRaise, rules.seePartnerOnRaise);
      await p.setBool(_kSeeOnDecision, rules.bothTeamsSeeOnDecision);
      await p.setBool(_kFoot, rules.dealerSeesPartnerThirdCard);
      await p.setInt(_kTurn, rules.turnSeconds);
    } on Object {
      // Not remembered; still used for now.
    }
  }
}

final preferredRulesProvider =
    NotifierProvider<PreferredRulesNotifier, TrucoRules>(
      PreferredRulesNotifier.new,
    );

/// The player's words for the manilhas and the tied round, on this device.
class TermsNotifier extends Notifier<Terms> {
  static const _key = 'terms.v1';

  @override
  Terms build() {
    _load();
    return Terms.standard;
  }

  Future<void> _load() async {
    try {
      final p = await SharedPreferences.getInstance();
      final raw = p.getString(_key);
      if (raw == null) return;
      state = Terms.fromJson((jsonDecode(raw) as Map).cast<String, Object?>());
    } on Object {
      // Keep the defaults.
    }
  }

  Future<void> set(Terms terms) async {
    state = terms;
    try {
      final p = await SharedPreferences.getInstance();
      await p.setString(_key, jsonEncode(terms.toJson()));
    } on Object {
      // Not remembered; still used for now.
    }
  }
}

final termsProvider = NotifierProvider<TermsNotifier, Terms>(TermsNotifier.new);

/// [text] in the player's words (see [Terms]), for screens without a ref.
String said(BuildContext context, String text) {
  try {
    return ProviderScope.containerOf(
      context,
      listen: false,
    ).read(termsProvider).apply(text);
  } on Object {
    return text; // No ProviderScope (some tests).
  }
}
