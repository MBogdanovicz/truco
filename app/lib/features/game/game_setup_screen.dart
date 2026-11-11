import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../data/ads.dart';
import '../../data/auth_repository.dart';
import '../../data/entitlements.dart';
import '../../data/game_room_repository.dart';
import '../../domain/game/ai.dart';
import '../../domain/game/rules.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../premium/premium_screen.dart';
import 'local_game_controller.dart';
import 'online_game_controller.dart';
import 'rules_screen.dart';

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
  static const _kCoach = 'game.coach';
  static const _kTurn = 'game.turnSeconds';

  bool _fixed = false;
  bool _cover = true;
  bool _iron = true;
  bool _seeOnRaise = true;
  bool _seeOnDecision = true;
  bool _foot = true;
  bool _coach = false;
  int _turn = 20;

  TrucoRules get _rules => TrucoRules.paulista.copyWith(
    manilhaMode: _fixed ? ManilhaMode.fixed : ManilhaMode.vira,
    allowCoveredCard: _cover,
    ironHand: _iron,
    seePartnerOnRaise: _seeOnRaise,
    bothTeamsSeeOnDecision: _seeOnDecision,
    dealerSeesPartnerThirdCard: _foot,
    turnSeconds: _turn,
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
        _coach = p.getBool(_kCoach) ?? _coach;
        final turn = p.getInt(_kTurn);
        if (TrucoRules.turnSecondsOptions.contains(turn)) _turn = turn!;
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
      await p.setBool(_kCoach, _coach);
      await p.setInt(_kTurn, _turn);
      await p.setString(_kPartner, _partner.name);
      await p.setString(_kOpponents, _opponents.name);
    } catch (_) {}
  }

  Future<void> _start() async {
    _save();
    await Ads.beforeGame(ref);
    if (!mounted) return;
    final ent = await ref.read(entitlementsProvider.future);
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
            coach: _coach && ent.canUseCoach,
          ),
        );
    context.go('/jogo/partida');
  }

  bool _creating = false;

  Future<void> _openTraining() async {
    final ent = await ref.read(entitlementsProvider.future);
    if (!mounted) return;
    if (!ent.canUseCoach) {
      await showPremiumRequired(context, 'Treinar com o professor');
      return;
    }
    context.push('/jogo/treinar');
  }

  Future<void> _setCoach(bool on) async {
    if (on) {
      final ent = await ref.read(entitlementsProvider.future);
      if (!mounted) return;
      if (!ent.canUseCoach) {
        await showPremiumRequired(context, 'Modo professor');
        return;
      }
    }
    setState(() => _coach = on);
  }

  Future<void> _createRoom() async {
    final user = ref.read(authRepositoryProvider).currentUser;
    if (user == null || user.isGuest) {
      showAppToast(context, 'Entre com seu e-mail para criar salas.');
      return;
    }
    final ent = await ref.read(entitlementsProvider.future);
    if (!mounted) return;
    if (!ent.canHostOnline) {
      await showPremiumRequired(context, 'Criar salas de jogo online');
      return;
    }
    _save();
    setState(() => _creating = true);
    try {
      await ref
          .read(onlineGameControllerProvider.notifier)
          .create(rules: _rules, botLevel: _opponents, ranked: true);
      if (mounted) context.go('/jogo/sala');
    } on GameRoomError catch (e) {
      if (mounted) showAppToast(context, e.message);
    } on Object catch (e) {
      debugPrint('Create game room failed: $e');
      if (mounted) {
        showAppToast(
          context,
          'Não foi possível criar a sala. Verifique sua internet.',
        );
      }
    } finally {
      if (mounted) setState(() => _creating = false);
    }
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
            'Contra o computador neste aparelho (amistosa), ou online com '
            'amigos numa sala: o computador fica nos lugares vazios.',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ),
        AppSection(
          header: 'Regras',
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
        AppSection(
          header: 'Professor (Premium)',
          footer:
              'O professor comenta as suas jogadas quando havia uma melhor, '
              'e explica por quê.',
          children: [
            AppTile(
              title: 'Modo professor',
              subtitle: 'Dicas sobre as jogadas, só contra o computador.',
              trailing: AppSwitch(value: _coach, onChanged: _setCoach),
            ),
            AppTile(
              title: 'Treinar',
              subtitle: 'Situações de jogo com a explicação da melhor jogada.',
              leading: const AppTileIcon(AppIcon.info, color: Colors.teal),
              onTap: _openTraining,
            ),
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
        const SizedBox(height: 24),
        AppSection(
          header: 'Online, com amigos',
          footer:
              'A sala usa as regras acima; o computador joga nos lugares '
              'vazios no nível dos adversários. Quando o tempo de jogada '
              'acaba, o computador joga pela pessoa. Só conta para o ranking '
              'com 4 pessoas com conta.',
          children: [
            AppTile(title: 'Tempo de jogada'),
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
              child: AppSegmented<int>(
                segments: {
                  for (final t in TrucoRules.turnSecondsOptions)
                    t: turnSecondsLabel(t),
                },
                value: _turn,
                onChanged: (v) => setState(() => _turn = v),
              ),
            ),
            AppTile(
              title: 'Criar sala',
              subtitle: 'Mande o código para os amigos.',
              leading: const AppTileIcon(AppIcon.online, color: Colors.red),
              trailing: _creating ? const AppProgress() : null,
              onTap: _creating ? null : _createRoom,
            ),
            AppTile(
              title: 'Entrar com código',
              leading: const AppTileIcon(AppIcon.key, color: Colors.indigo),
              onTap: () => context.push('/jogo/entrar'),
            ),
          ],
        ),
      ],
    );
  }
}
