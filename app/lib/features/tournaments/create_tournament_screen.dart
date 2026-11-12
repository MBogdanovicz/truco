import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/groups_repository.dart';
import '../../data/tournaments.dart';
import '../../domain/game/rules.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../game/rule_options.dart';
import '../game/rules_screen.dart' show slowDaysLabel, turnSecondsLabel;

/// "Criar torneio" (Premium; checked before opening this screen).
class CreateTournamentScreen extends ConsumerStatefulWidget {
  const CreateTournamentScreen({super.key});

  @override
  ConsumerState<CreateTournamentScreen> createState() =>
      _CreateTournamentState();
}

class _CreateTournamentState extends ConsumerState<CreateTournamentScreen> {
  final _name = TextEditingController();
  String? _groupId;
  TournamentFormat _format = TournamentFormat.knockout;
  TournamentEntry _entry = TournamentEntry.pairs;
  int _maxTeams = 8;
  int _bestOf = 1;
  int _finalBestOf = 1;
  bool _slow = false;
  int _roundDays = 2;
  int _slowDays = 1;
  TrucoRules _rules = TrucoRules.paulista;
  bool _saving = false;

  static const _koSizes = [4, 8, 16, 32];
  static const _rrSizes = [3, 4, 5, 6, 8];
  static const _deSizes = [4, 8, 16];
  static const _roundDayOptions = [1, 2, 3, 7];

  @override
  void dispose() {
    _name.dispose();
    super.dispose();
  }

  Future<void> _create() async {
    final name = _name.text.trim();
    if (name.length < 3) {
      showAppToast(context, 'O nome precisa ter pelo menos 3 letras.');
      return;
    }
    setState(() => _saving = true);
    try {
      final id = await ref
          .read(tournamentsRepositoryProvider)!
          .create(
            name: name,
            groupId: _groupId,
            format: _format,
            entry: _entry,
            rules: _rules.copyWith(slowDays: _slow ? _slowDays : 0),
            roundDays: _roundDays,
            maxTeams: _maxTeams,
            bestOf: _bestOf,
            finalBestOf: _format.hasFinal ? _finalBestOf : _bestOf,
          );
      ref.invalidate(tournamentsProvider);
      if (mounted) context.go('/torneios/$id');
    } on TournamentError catch (e) {
      if (mounted) showAppToast(context, e.message);
    } on Object {
      if (mounted) {
        showAppToast(context, 'Não foi possível criar o torneio.');
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Widget _pad(Widget child) =>
      Padding(padding: const EdgeInsets.all(12), child: child);

  @override
  Widget build(BuildContext context) {
    final groups = ref.watch(myGroupsProvider).value ?? const <Group>[];
    final sizes = switch (_format) {
      TournamentFormat.knockout => _koSizes,
      TournamentFormat.doubleElimination => _deSizes,
      TournamentFormat.roundRobin => _rrSizes,
    };
    if (!sizes.contains(_maxTeams)) _maxTeams = sizes[1];
    const series = {1: 'Única', 3: 'Melhor de 3', 5: 'Melhor de 5'};
    return AppScaffold(
      title: 'Criar torneio',
      children: [
        AppSection(
          header: 'Torneio',
          children: [
            _pad(
              AppTextField(
                controller: _name,
                label: 'Nome do torneio',
                maxLength: 40,
                textCapitalization: TextCapitalization.sentences,
              ),
            ),
            AppTile(
              title: 'Quem pode participar',
              subtitle: _groupId == null
                  ? 'Público: qualquer pessoa com conta.'
                  : 'Só quem é do grupo.',
            ),
            _pad(
              DropdownButton<String?>(
                isExpanded: true,
                value: _groupId,
                items: [
                  const DropdownMenuItem(value: null, child: Text('Público')),
                  for (final g in groups)
                    DropdownMenuItem(
                      value: g.id,
                      child: Text('Grupo ${g.name}'),
                    ),
                ],
                onChanged: (v) => setState(() => _groupId = v),
              ),
            ),
          ],
        ),
        AppSection(
          header: 'Formato',
          footer: _format == TournamentFormat.knockout
              ? 'A chave é sorteada quando o torneio começa. Se faltar dupla '
                    'para completar a chave, algumas passam direto para a '
                    'rodada seguinte.'
              : _format == TournamentFormat.doubleElimination
              ? 'Eliminação dupla: quem perde vai para a repescagem e só sai '
                    'com a segunda derrota. Na final, o campeão da chave '
                    'principal enfrenta o da repescagem; se o da repescagem '
                    'ganhar, tem a finalíssima.'
              : 'Todas as duplas se enfrentam uma vez. Vale o número de '
                    'vitórias, depois o saldo de tentos e depois os tentos '
                    'feitos.',
          children: [
            _pad(
              AppSegmented<TournamentFormat>(
                segments: {
                  TournamentFormat.knockout: TournamentFormat.knockout.label,
                  TournamentFormat.roundRobin:
                      TournamentFormat.roundRobin.label,
                },
                value: _format == TournamentFormat.roundRobin
                    ? TournamentFormat.roundRobin
                    : TournamentFormat.knockout,
                onChanged: (v) => setState(() => _format = v),
              ),
            ),
            if (_format != TournamentFormat.roundRobin)
              AppTile(
                title: 'Repescagem',
                subtitle: 'Quem perde uma vez ainda tem chance.',
                trailing: AppSwitch(
                  value: _format == TournamentFormat.doubleElimination,
                  onChanged: (v) => setState(
                    () => _format = v
                        ? TournamentFormat.doubleElimination
                        : TournamentFormat.knockout,
                  ),
                ),
              ),
            AppTile(title: 'Máximo de duplas'),
            _pad(
              AppSegmented<int>(
                segments: {for (final n in sizes) n: '$n'},
                value: _maxTeams,
                onChanged: (v) => setState(() => _maxTeams = v),
              ),
            ),
            AppTile(title: 'Cada jogo'),
            _pad(
              AppSegmented<int>(
                segments: series,
                value: _bestOf,
                onChanged: (v) => setState(() {
                  if (_finalBestOf == _bestOf) _finalBestOf = v;
                  _bestOf = v;
                }),
              ),
            ),
            if (_format.hasFinal) ...[
              AppTile(title: 'A final'),
              _pad(
                AppSegmented<int>(
                  segments: series,
                  value: _finalBestOf,
                  onChanged: (v) => setState(() => _finalBestOf = v),
                ),
              ),
            ],
          ],
        ),
        AppSection(
          header: 'Inscrição',
          footer: switch (_entry) {
            TournamentEntry.pairs =>
              'Cada pessoa inscreve a sua dupla, e o parceiro entra nela.',
            TournamentEntry.solo =>
              'Cada pessoa se inscreve sozinha; as duplas são sorteadas '
                  'quando o torneio começa.',
            TournamentEntry.both =>
              'Dá para inscrever uma dupla ou entrar sozinho. Quem estiver '
                  'sem parceiro no começo entra no sorteio das duplas.',
          },
          children: [
            _pad(
              AppSegmented<TournamentEntry>(
                segments: {for (final e in TournamentEntry.values) e: e.label},
                value: _entry,
                onChanged: (v) => setState(() => _entry = v),
              ),
            ),
          ],
        ),
        AppSection(
          header: 'Como jogar',
          footer: _slow
              ? 'Cada jogo é uma partida lenta: começa sozinho, e cada pessoa '
                    'tem o prazo acima para fazer a sua jogada.'
              : 'Cada rodada tem esse prazo. As duplas combinam um horário, e '
                    'o jogo começa quando as 4 pessoas entram na sala. Se o '
                    'prazo acabar, ganha por W.O. a dupla que apareceu.',
          children: [
            _pad(
              AppSegmented<bool>(
                segments: const {false: 'Com prazo', true: 'Partida lenta'},
                value: _slow,
                onChanged: (v) => setState(() => _slow = v),
              ),
            ),
            if (_slow) ...[
              AppTile(title: 'Prazo por jogada'),
              _pad(
                AppSegmented<int>(
                  segments: {
                    for (final d in TrucoRules.slowDaysOptions)
                      d: slowDaysLabel(d),
                  },
                  value: _slowDays,
                  onChanged: (v) => setState(() => _slowDays = v),
                ),
              ),
            ] else ...[
              AppTile(title: 'Prazo por rodada'),
              _pad(
                AppSegmented<int>(
                  segments: {
                    for (final d in _roundDayOptions) d: slowDaysLabel(d),
                  },
                  value: _roundDays,
                  onChanged: (v) => setState(() => _roundDays = v),
                ),
              ),
              AppTile(title: 'Tempo de jogada'),
              _pad(
                AppSegmented<int>(
                  segments: {
                    for (final t in TrucoRules.turnSecondsOptions)
                      t: turnSecondsLabel(t),
                  },
                  value: _rules.turnSeconds,
                  onChanged: (v) =>
                      setState(() => _rules = _rules.copyWith(turnSeconds: v)),
                ),
              ),
            ],
          ],
        ),
        AppSection(
          header: 'Regras da mesa',
          children: ruleOptionTiles(_rules, (r) => setState(() => _rules = r)),
        ),
        Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: SizedBox(
              width: double.infinity,
              child: _saving
                  ? const Center(child: AppProgress())
                  : AppButton(label: 'Criar torneio', onPressed: _create),
            ),
          ),
        ),
        const SizedBox(height: 24),
      ],
    );
  }
}
