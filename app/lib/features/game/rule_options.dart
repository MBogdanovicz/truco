import 'package:flutter/material.dart';

import '../../domain/game/rules.dart';
import '../../ui/adaptive/adaptive_widgets.dart';

/// The table rule switches (manilhas, coberta, mão de ferro, seeing the
/// partner), for screens that choose rules for others (tournaments).
List<Widget> ruleOptionTiles(
  TrucoRules rules,
  ValueChanged<TrucoRules> onChanged,
) => [
  Padding(
    padding: const EdgeInsets.all(12),
    child: AppSegmented<bool>(
      segments: const {false: 'Manilha virada', true: 'Manilhas fixas'},
      value: rules.manilhaMode == ManilhaMode.fixed,
      onChanged: (v) => onChanged(
        rules.copyWith(manilhaMode: v ? ManilhaMode.fixed : ManilhaMode.vira),
      ),
    ),
  ),
  AppTile(
    title: 'Pode jogar coberta',
    trailing: AppSwitch(
      value: rules.allowCoveredCard,
      onChanged: (v) => onChanged(rules.copyWith(allowCoveredCard: v)),
    ),
  ),
  AppTile(
    title: 'Mão de ferro',
    trailing: AppSwitch(
      value: rules.ironHand,
      onChanged: (v) => onChanged(rules.copyWith(ironHand: v)),
    ),
  ),
  AppTile(
    title: 'Ver o parceiro ao receber truco',
    trailing: AppSwitch(
      value: rules.seePartnerOnRaise,
      onChanged: (v) => onChanged(rules.copyWith(seePartnerOnRaise: v)),
    ),
  ),
  AppTile(
    title: 'Mão de onze: as duas duplas veem',
    trailing: AppSwitch(
      value: rules.bothTeamsSeeOnDecision,
      onChanged: (v) => onChanged(rules.copyWith(bothTeamsSeeOnDecision: v)),
    ),
  ),
  AppTile(
    title: 'Quem dá vê a 3ª carta do parceiro',
    trailing: AppSwitch(
      value: rules.dealerSeesPartnerThirdCard,
      onChanged: (v) =>
          onChanged(rules.copyWith(dealerSeesPartnerThirdCard: v)),
    ),
  ),
];
