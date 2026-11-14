import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../domain/game/rules.dart';
import '../../ui/adaptive/adaptive_widgets.dart';

/// The table rule switches (manilhas, coberta, mão de ferro, seeing the
/// partner): in "Configurações" and in the sheet that changes one game's
/// rules.
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
    subtitle: 'Carta virada para baixo, da 2ª rodada em diante.',
    trailing: AppSwitch(
      value: rules.allowCoveredCard,
      onChanged: (v) => onChanged(rules.copyWith(allowCoveredCard: v)),
    ),
  ),
  if (rules.allowCoveredCard)
    AppTile(
      title: 'Parceiro vê a coberta',
      subtitle: 'O parceiro sabe qual carta foi jogada coberta.',
      trailing: AppSwitch(
        value: rules.partnerSeesCovered,
        onChanged: (v) => onChanged(rules.copyWith(partnerSeesCovered: v)),
      ),
    ),
  AppTile(
    title: 'Mão de ferro',
    subtitle: 'No 11 × 11, todos jogam sem ver as cartas.',
    trailing: AppSwitch(
      value: rules.ironHand,
      onChanged: (v) => onChanged(rules.copyWith(ironHand: v)),
    ),
  ),
  AppTile(
    title: 'Ver o parceiro ao receber truco',
    subtitle: 'Quem responde ao truco vê as cartas do parceiro.',
    trailing: AppSwitch(
      value: rules.seePartnerOnRaise,
      onChanged: (v) => onChanged(rules.copyWith(seePartnerOnRaise: v)),
    ),
  ),
  AppTile(
    title: 'Mão de onze: as duas duplas veem',
    subtitle:
        'Os adversários também veem as cartas do parceiro (nunca na mão de '
        'ferro).',
    trailing: AppSwitch(
      value: rules.bothTeamsSeeOnDecision,
      onChanged: (v) => onChanged(rules.copyWith(bothTeamsSeeOnDecision: v)),
    ),
  ),
  AppTile(
    title: 'Quem dá vê a 3ª carta do parceiro',
    subtitle: 'Quem dá as cartas vê a terceira carta entregue ao parceiro.',
    trailing: AppSwitch(
      value: rules.dealerSeesPartnerThirdCard,
      onChanged: (v) =>
          onChanged(rules.copyWith(dealerSeesPartnerThirdCard: v)),
    ),
  ),
];

/// One line with every table option, e.g. "Manilha virada · coberta ·
/// mão de ferro · vê o parceiro no truco".
String rulesLine(TrucoRules r) => [
  r.manilhaMode == ManilhaMode.fixed ? 'Manilhas fixas' : 'Manilha virada',
  r.allowCoveredCard
      ? (r.partnerSeesCovered ? 'coberta' : 'coberta (parceiro não vê)')
      : 'sem coberta',
  r.ironHand ? 'mão de ferro' : 'sem mão de ferro',
  if (r.seePartnerOnRaise) 'vê o parceiro no truco',
  if (r.bothTeamsSeeOnDecision) 'mão de onze: as duas veem',
  if (r.dealerSeesPartnerThirdCard) 'quem dá vê a 3ª carta',
].join(' · ');

/// "Regras" summary with an icon to change them for this game only. Starts
/// from the preferred rules chosen in "Configurações".
class RulesSummaryTile extends StatelessWidget {
  const RulesSummaryTile({
    super.key,
    required this.rules,
    required this.onChanged,
    this.title = 'Regras desta partida',
  });

  final TrucoRules rules;
  final ValueChanged<TrucoRules> onChanged;
  final String title;

  Future<void> _edit(BuildContext context) async {
    final changed = await editRules(context, rules, title: title);
    if (changed != null) onChanged(changed);
  }

  @override
  Widget build(BuildContext context) => AppTile(
    title: title,
    subtitle: rulesLine(rules),
    leading: const AppTileIcon(AppIcon.cards, color: Colors.green),
    trailing: IconButton(
      tooltip: 'Alterar as regras',
      icon: const Icon(Icons.tune),
      onPressed: () => _edit(context),
    ),
    onTap: () => _edit(context),
  );
}

/// Sheet to review and change [rules]; returns the new rules, or null.
Future<TrucoRules?> editRules(
  BuildContext context,
  TrucoRules rules, {
  String title = 'Regras desta partida',
}) => showModalBottomSheet<TrucoRules>(
  context: context,
  isScrollControlled: true,
  showDragHandle: true,
  builder: (ctx) {
    var r = rules;
    return StatefulBuilder(
      builder: (ctx, setState) => SafeArea(
        child: ConstrainedBox(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.sizeOf(ctx).height * 0.85,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Flexible(
                child: ListView(
                  shrinkWrap: true,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  children: [
                    Text(title, style: Theme.of(ctx).textTheme.titleLarge),
                    const SizedBox(height: 4),
                    Text(
                      'As mudanças valem só aqui. Para mudar o padrão, use '
                      'Configurações.',
                      style: Theme.of(ctx).textTheme.bodySmall,
                    ),
                    const SizedBox(height: 8),
                    AppSection(
                      children: ruleOptionTiles(
                        r,
                        (v) => setState(() => r = v),
                      ),
                    ),
                    AppTile(
                      title: 'Ver as regras',
                      leading: const AppTileIcon(
                        AppIcon.info,
                        color: Colors.blueGrey,
                      ),
                      onTap: () => ctx.push(
                        '/jogo/regras?fixas='
                        '${r.manilhaMode == ManilhaMode.fixed ? 1 : 0}',
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                child: AppButton(
                  label: 'Pronto',
                  onPressed: () => Navigator.of(ctx).pop(r),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  },
);
