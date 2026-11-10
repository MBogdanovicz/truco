import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../data/ads.dart';
import '../../data/auth_repository.dart';
import '../../domain/game/ai.dart';
import '../../domain/game/rules.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import 'local_game_controller.dart';

/// Chooses rules and computer levels for a game against the computer.
class GameSetupScreen extends ConsumerStatefulWidget {
  const GameSetupScreen({super.key});

  @override
  ConsumerState<GameSetupScreen> createState() => _GameSetupState();
}

class _GameSetupState extends ConsumerState<GameSetupScreen> {
  static const _kFixed = 'game.fixedManilhas';
  static const _kCover = 'game.coveredCard';
  static const _kIron = 'game.ironHand';
  static const _kSeeOnRaise = 'game.seePartnerOnRaise';
  static const _kSeeOnDecision = 'game.bothTeamsSeeOnDecision';
  static const _kFoot = 'game.dealerSeesPartnerThirdCard';
  static const _kPartner = 'game.partner';
  static const _kOpponents = 'game.opponents';

  bool _fixed = false;
  bool _cover = true;
  bool _iron = true;
  bool _seeOnRaise = true;
  bool _seeOnDecision = true;
  bool _foot = true;

  TrucoRules get _rules => TrucoRules.paulista.copyWith(
    manilhaMode: _fixed ? ManilhaMode.fixed : ManilhaMode.vira,
    allowCoveredCard: _cover,
    ironHand: _iron,
    seePartnerOnRaise: _seeOnRaise,
    bothTeamsSeeOnDecision: _seeOnDecision,
    dealerSeesPartnerThirdCard: _foot,
  );
  AiLevel _partner = AiLevel.medium;
  AiLevel _opponents = AiLevel.medium;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final p = await SharedPreferences.getInstance();
      if (!mounted) return;
      setState(() {
        _fixed = p.getBool(_kFixed) ?? _fixed;
        _cover = p.getBool(_kCover) ?? _cover;
        _iron = p.getBool(_kIron) ?? _iron;
        _seeOnRaise = p.getBool(_kSeeOnRaise) ?? _seeOnRaise;
        _seeOnDecision = p.getBool(_kSeeOnDecision) ?? _seeOnDecision;
        _foot = p.getBool(_kFoot) ?? _foot;
        _partner =
            AiLevel.values.asNameMap()[p.getString(_kPartner)] ?? _partner;
        _opponents =
            AiLevel.values.asNameMap()[p.getString(_kOpponents)] ?? _opponents;
      });
    } catch (_) {}
  }

  Future<void> _save() async {
    try {
      final p = await SharedPreferences.getInstance();
      await p.setBool(_kFixed, _fixed);
      await p.setBool(_kCover, _cover);
      await p.setBool(_kIron, _iron);
      await p.setBool(_kSeeOnRaise, _seeOnRaise);
      await p.setBool(_kSeeOnDecision, _seeOnDecision);
      await p.setBool(_kFoot, _foot);
      await p.setString(_kPartner, _partner.name);
      await p.setString(_kOpponents, _opponents.name);
    } catch (_) {}
  }

  Future<void> _start() async {
    _save();
    await Ads.beforeGame(ref);
    if (!mounted) return;
    final me = ref.read(authRepositoryProvider).currentUser;
    final name = me?.displayName?.trim();
    ref
        .read(localGameControllerProvider.notifier)
        .start(
          LocalGameSetup(
            rules: _rules,
            partnerLevel: _partner,
            opponentLevel: _opponents,
            myName: name == null || name.isEmpty ? 'Você' : name,
          ),
        );
    context.go('/jogo/partida');
  }

  Widget _levels(AiLevel value, ValueChanged<AiLevel> onChanged) => Padding(
    padding: const EdgeInsets.all(12),
    child: AppSegmented<AiLevel>(
      segments: {for (final l in AiLevel.values) l: l.label},
      value: value,
      onChanged: onChanged,
    ),
  );

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Jogar truco',
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(4, 0, 4, 20),
          child: Text(
            'Você e um parceiro do computador contra dois adversários do '
            'computador. Partida amistosa, não conta para o ranking.',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ),
        AppSection(
          header: 'Regras (truco paulista)',
          footer:
              'Mão vale 1, truco 3, seis 6, nove 9, doze 12. '
              'Mão de onze vale 3.',
          children: [
            Padding(
              padding: const EdgeInsets.all(12),
              child: AppSegmented<bool>(
                segments: const {
                  false: 'Manilha virada',
                  true: 'Manilhas fixas',
                },
                value: _fixed,
                onChanged: (v) => setState(() => _fixed = v),
              ),
            ),
            AppTile(
              title: 'Pode jogar coberta',
              subtitle: 'Carta virada para baixo, da 2ª rodada em diante.',
              trailing: AppSwitch(
                value: _cover,
                onChanged: (v) => setState(() => _cover = v),
              ),
            ),
            AppTile(
              title: 'Mão de ferro',
              subtitle: 'No 11 × 11, todos jogam sem ver as cartas.',
              trailing: AppSwitch(
                value: _iron,
                onChanged: (v) => setState(() => _iron = v),
              ),
            ),
            AppTile(
              title: 'Ver o parceiro ao receber truco',
              subtitle: 'Quem responde ao truco vê as cartas do parceiro.',
              trailing: AppSwitch(
                value: _seeOnRaise,
                onChanged: (v) => setState(() => _seeOnRaise = v),
              ),
            ),
            AppTile(
              title: 'Mão de onze: as duas duplas veem',
              subtitle:
                  'Os adversários também veem as cartas do parceiro '
                  '(nunca na mão de ferro).',
              trailing: AppSwitch(
                value: _seeOnDecision,
                onChanged: (v) => setState(() => _seeOnDecision = v),
              ),
            ),
            AppTile(
              title: 'Quem dá vê a 3ª carta do parceiro',
              subtitle:
                  'Quem dá as cartas vê a terceira carta entregue ao '
                  'parceiro.',
              trailing: AppSwitch(
                value: _foot,
                onChanged: (v) => setState(() => _foot = v),
              ),
            ),
            AppTile(
              title: 'Ver as regras',
              leading: const AppTileIcon(AppIcon.info, color: Colors.blueGrey),
              onTap: () => context.push('/jogo/regras?fixas=${_fixed ? 1 : 0}'),
            ),
          ],
        ),
        AppSection(
          header: 'Parceiro',
          children: [_levels(_partner, (v) => setState(() => _partner = v))],
        ),
        AppSection(
          header: 'Adversários',
          children: [
            _levels(_opponents, (v) => setState(() => _opponents = v)),
          ],
        ),
        Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: SizedBox(
              width: double.infinity,
              child: AppButton(
                label: 'Começar',
                icon: context.icon(AppIcon.play),
                onPressed: _start,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
