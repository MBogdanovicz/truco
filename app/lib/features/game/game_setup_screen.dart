import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../data/ads.dart';
import '../../data/auth_repository.dart';
import '../../data/entitlements.dart';
import '../../data/game_prefs.dart';
import '../../data/game_room_repository.dart';
import '../../domain/game/ai.dart';
import '../../domain/game/rules.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../premium/premium_screen.dart';
import 'local_game_controller.dart';
import 'online_game_controller.dart';
import 'rule_options.dart';
import 'rules_screen.dart';

/// Chooses rules and computer levels for a game against the computer.
class GameSetupScreen extends ConsumerStatefulWidget {
  const GameSetupScreen({super.key});

  @override
  ConsumerState<GameSetupScreen> createState() => _GameSetupState();
}

class _GameSetupState extends ConsumerState<GameSetupScreen> {
  static const _kPartner = 'game.partner';
  static const _kOpponents = 'game.opponents';
  static const _kCoach = 'game.coach';
  static const _kSlow = 'game.slowDays';

  bool _coach = false;
  int _slow = 1;

  /// This game's rules when changed here; otherwise the preferred ones.
  TrucoRules? _changed;
  int? _turn;

  TrucoRules get _rules {
    final TrucoRules base = _changed ?? ref.read(preferredRulesProvider);
    return base.copyWith(turnSeconds: _turn);
  }

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
        _coach = p.getBool(_kCoach) ?? _coach;
        final slow = p.getInt(_kSlow);
        if (TrucoRules.slowDaysOptions.contains(slow)) _slow = slow!;
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
      await p.setBool(_kCoach, _coach);
      await p.setInt(_kSlow, _slow);
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
            drawDealer: true,
          ),
        );
    context.go('/jogo/partida');
  }

  bool _creating = false;

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

  Future<void> _createRoom({bool slow = false}) async {
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
          .create(
            rules: slow ? _rules.copyWith(slowDays: _slow) : _rules,
            botLevel: _opponents,
            ranked: true,
          );
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
    ref.watch(preferredRulesProvider);
    final rules = _rules;
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
              'Mão de onze vale 3. As regras de sempre ficam em '
              'Configurações.',
          children: [
            RulesSummaryTile(
              rules: rules,
              onChanged: (r) => setState(() => _changed = r),
            ),
            AppTile(
              title: 'Ver as regras',
              leading: const AppTileIcon(AppIcon.info, color: Colors.blueGrey),
              onTap: () => context.push(
                '/jogo/regras?fixas='
                '${rules.manilhaMode == ManilhaMode.fixed ? 1 : 0}',
              ),
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
                value: rules.turnSeconds,
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
        const SizedBox(height: 24),
        AppSection(
          header: 'Partida lenta',
          footer:
              'Para 4 pessoas jogarem sem combinar horário: cada uma tem o '
              'prazo acima para fazer a sua jogada e recebe um aviso quando '
              'for a vez dela. A partida fica na tela inicial. Se o prazo '
              'acabar, o computador joga pela pessoa e a partida deixa de '
              'contar para o ranking.',
          children: [
            AppTile(title: 'Prazo por jogada'),
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
              child: AppSegmented<int>(
                segments: {
                  for (final d in TrucoRules.slowDaysOptions)
                    d: slowDaysLabel(d),
                },
                value: _slow,
                onChanged: (v) => setState(() => _slow = v),
              ),
            ),
            AppTile(
              title: 'Criar partida lenta',
              subtitle: 'Mande o código para os outros 3.',
              leading: const AppTileIcon(AppIcon.online, color: Colors.teal),
              trailing: _creating ? const AppProgress() : null,
              onTap: _creating ? null : () => _createRoom(slow: true),
            ),
          ],
        ),
      ],
    );
  }
}
