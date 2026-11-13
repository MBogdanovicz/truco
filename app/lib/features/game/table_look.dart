import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../ui/theme/app_theme.dart';

/// Color of the table's felt.
enum FeltColor {
  verde('Verde', AppColors.felt, AppColors.feltDark),
  azul('Azul', Color(0xFF1D4F7A), Color(0xFF0E2C47)),
  vinho('Vinho', Color(0xFF6E1F2E), Color(0xFF3B0E17)),
  roxo('Roxo', Color(0xFF4B2E6E), Color(0xFF26163B)),
  marrom('Marrom', Color(0xFF6A4424), Color(0xFF3A2412)),
  preto('Preto', Color(0xFF2E2E2E), Color(0xFF111111));

  const FeltColor(this.label, this.light, this.dark);
  final String label;
  final Color light;
  final Color dark;
}

/// The design on the back of the cards.
enum CardBackStyle {
  vermelho('Vermelho', Color(0xFFA62A38), Color(0xFF6E1520), Color(0xFFFFFDF7)),
  azul('Azul', Color(0xFF2F5FA8), Color(0xFF17305E), Color(0xFFFFFDF7)),
  verde('Verde', Color(0xFF2E7D4F), Color(0xFF14432A), Color(0xFFFFFDF7)),
  preto(
    'Preto e dourado',
    Color(0xFF3A3A3A),
    Color(0xFF121212),
    AppColors.gold,
  ),
  capivara(
    'Capivara E.C.',
    Color(0xFF1E1E1E),
    Color(0xFF050505),
    Color(0xFF2BE62B),
    image: 'assets/backs/capivara.png',
  );

  const CardBackStyle(
    this.label,
    this.top,
    this.bottom,
    this.edge, {
    this.image,
  });
  final String label;
  final Color top;
  final Color bottom;

  /// The border around the back.
  final Color edge;

  /// A crest in the middle of the back, instead of the plain pattern.
  final String? image;
}

/// How the face of the cards looks.
enum CardFaceStyle {
  classico('Clássico'),

  /// Each suit its own color, easier to tell apart at a glance.
  quatroCores('4 cores'),

  /// Dark cards with light symbols.
  noturno('Noturno');

  const CardFaceStyle(this.label);
  final String label;
}

/// The table's look: felt, card backs and card faces, chosen separately
/// (Premium; everyone else gets the defaults).
@immutable
class TableLook {
  const TableLook({
    this.felt = FeltColor.verde,
    this.back = CardBackStyle.vermelho,
    this.face = CardFaceStyle.classico,
  });

  final FeltColor felt;
  final CardBackStyle back;
  final CardFaceStyle face;

  static const standard = TableLook();

  bool get isStandard => this == standard;

  TableLook copyWith({
    FeltColor? felt,
    CardBackStyle? back,
    CardFaceStyle? face,
  }) => TableLook(
    felt: felt ?? this.felt,
    back: back ?? this.back,
    face: face ?? this.face,
  );

  @override
  bool operator ==(Object other) =>
      other is TableLook &&
      other.felt == felt &&
      other.back == back &&
      other.face == face;

  @override
  int get hashCode => Object.hash(felt, back, face);
}

/// Makes the look available to the cards and the table below it.
class TableLookScope extends InheritedWidget {
  const TableLookScope({super.key, required this.look, required super.child});

  final TableLook look;

  static TableLook of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<TableLookScope>()?.look ??
      TableLook.standard;

  @override
  bool updateShouldNotify(TableLookScope old) => old.look != look;
}

/// The chosen look, remembered on this device.
class TableLookNotifier extends Notifier<TableLook> {
  static const _kFelt = 'look.felt';
  static const _kBack = 'look.back';
  static const _kFace = 'look.face';

  @override
  TableLook build() {
    _load();
    return TableLook.standard;
  }

  Future<void> _load() async {
    try {
      final p = await SharedPreferences.getInstance();
      state = TableLook(
        felt:
            FeltColor.values.asNameMap()[p.getString(_kFelt)] ??
            FeltColor.verde,
        back:
            CardBackStyle.values.asNameMap()[p.getString(_kBack)] ??
            CardBackStyle.vermelho,
        face:
            CardFaceStyle.values.asNameMap()[p.getString(_kFace)] ??
            CardFaceStyle.classico,
      );
    } on Object {
      // Keep the defaults.
    }
  }

  Future<void> set(TableLook look) async {
    state = look;
    try {
      final p = await SharedPreferences.getInstance();
      await p.setString(_kFelt, look.felt.name);
      await p.setString(_kBack, look.back.name);
      await p.setString(_kFace, look.face.name);
    } on Object {
      // Not remembered; still used for now.
    }
  }
}

final tableLookProvider = NotifierProvider<TableLookNotifier, TableLook>(
  TableLookNotifier.new,
);
