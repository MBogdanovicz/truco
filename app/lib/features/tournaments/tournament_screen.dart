import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/tournaments.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../game/rules_screen.dart';

/// One tournament: sign-up, the bracket or table, and the person's match.
class TournamentScreen extends ConsumerStatefulWidget {
  const TournamentScreen({super.key, required this.id});
  final String id;

  @override
  ConsumerState<TournamentScreen> createState() => _TournamentScreenState();
}

class _TournamentScreenState extends ConsumerState<TournamentScreen> {
  bool _busy = false;

  TournamentsRepository get _repo => ref.read(tournamentsRepositoryProvider)!;
  String? get _me => ref.read(tournamentUserIdProvider);

  Future<void> _run(Future<void> Function() action, {String? done}) async {
    setState(() => _busy = true);
    try {
      await action();
      if (done != null && mounted) showAppToast(context, done);
    } on TournamentError catch (e) {
      if (mounted) showAppToast(context, e.message);
    } on Object {
      if (mounted) {
        showAppToast(context, 'Não deu certo. Verifique sua internet.');
      }
    } finally {
      // Even after an error the server may have done it: read again.
      ref.invalidate(tournamentProvider(widget.id));
      ref.invalidate(tournamentsProvider);
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<bool> _confirm(String title, String message, String ok) async =>
      await showAppDialog<bool>(
        context,
        title: title,
        message: message,
        actions: [
          const AppDialogAction(label: 'Voltar', value: false),
          AppDialogAction(label: ok, value: true, isPrimary: true),
        ],
      ) ==
      true;

  @override
  Widget build(BuildContext context) {
    final detail = ref.watch(tournamentProvider(widget.id));
    return detail.when(
      loading: () => const AppScaffold(
        title: 'Torneio',
        body: Center(child: AppProgress()),
      ),
      error: (e, _) => AppScaffold(
        title: 'Torneio',
        children: [
          AppSection(
            children: [
              AppTile(
                title: e is TournamentError
                    ? e.message
                    : 'Não foi possível carregar o torneio.',
              ),
            ],
          ),
        ],
      ),
      data: (d) => AppScaffold(
        title: d.tournament.name,
        onRefresh: () async => ref.invalidate(tournamentProvider(widget.id)),
        children: _content(d),
      ),
    );
  }

  List<Widget> _content(TournamentDetail d) {
    final t = d.tournament;
    final me = _me;
    final owner = t.ownerId == me;
    final mine = d.teamOf(me);
    final champion = d.team(t.champion);
    return [
      AppSection(
        header: 'Torneio',
        footer: t.status == TournamentStatus.open
            ? 'Mande o código para quem vai jogar: Torneios > Entrar com '
                  'código.'
            : null,
        children: [
          AppTile(
            title: switch (t.status) {
              TournamentStatus.open => 'Inscrições abertas',
              TournamentStatus.running => 'Em andamento',
              TournamentStatus.finished =>
                champion == null
                    ? 'Encerrado'
                    : '🏆 Campeões: ${champion.label}',
              TournamentStatus.cancelled => 'Cancelado',
            },
            subtitle: t.summary,
          ),
          AppTile(
            title: t.groupName == null
                ? 'Público'
                : 'Só para o grupo ${t.groupName}',
            subtitle: 'Até ${t.maxTeams} duplas',
          ),
          AppTile(
            title: 'Código ${t.code}',
            leading: const AppTileIcon(AppIcon.copy, color: Colors.indigo),
            onTap: () {
              Clipboard.setData(ClipboardData(text: t.code));
              showAppToast(context, 'Código copiado.');
            },
          ),
        ],
      ),
      if (t.status == TournamentStatus.running) ..._myMatch(d),
      if (t.status == TournamentStatus.open) ..._signUp(d, mine, owner),
      if (t.status != TournamentStatus.open) ..._results(d),
      TableRulesSection(rules: t.rules),
      if (owner &&
          (t.status == TournamentStatus.open ||
              t.status == TournamentStatus.running))
        AppSection(
          children: [
            AppTile(
              title: 'Cancelar torneio',
              leading: const AppTileIcon(AppIcon.close, color: Colors.red),
              enabled: !_busy,
              onTap: () async {
                if (await _confirm(
                  'Cancelar o torneio?',
                  'Os jogos que ainda não acabaram são encerrados. Não dá '
                      'para desfazer.',
                  'Cancelar torneio',
                )) {
                  await _run(() => _repo.cancel(t.id));
                }
              },
            ),
          ],
        ),
    ];
  }

  List<Widget> _myMatch(TournamentDetail d) {
    final me = _me;
    final m = d.nextMatchOf(me);
    final mine = d.teamOf(me);
    if (m == null || mine == null) return const [];
    final other = d.team(m.teamA == mine.id ? m.teamB : m.teamA);
    final series = m.bestOf > 1
        ? ' ${bestOfLabel(m.bestOf).toLowerCase()}, '
              '${m.teamA == mine.id ? m.gamesA : m.gamesB} × '
              '${m.teamA == mine.id ? m.gamesB : m.gamesA}.'
        : '';
    return [
      AppSection(
        header: 'Seu jogo',
        footer: d.tournament.slow
            ? 'É uma partida lenta: ela também aparece na tela inicial.'
            : 'O jogo começa quando as 4 pessoas entrarem na sala. '
                  'Combinem um horário${m.deadline == null ? '' : ' até ${_when(m.deadline!)}'}.',
        children: [
          AppTile(
            title: 'Contra ${other?.label ?? '?'}',
            subtitle:
                'Com ${mine.playerA == me ? mine.nameB : mine.nameA}.$series',
          ),
          if (m.roomCode != null)
            AppTile(
              title: 'Entrar na sala',
              leading: const AppTileIcon(AppIcon.play, color: Colors.red),
              onTap: () => context.go('/jogo/entrar?codigo=${m.roomCode}'),
            ),
        ],
      ),
    ];
  }

  List<Widget> _signUp(TournamentDetail d, TournamentTeam? mine, bool owner) {
    final t = d.tournament;
    final full = d.people >= t.maxTeams * 2;
    return [
      AppSection(
        header: 'Inscrição',
        footer: mine != null
            ? null
            : full
            ? 'O torneio está cheio.'
            : null,
        children: [
          if (mine != null) ...[
            AppTile(
              title: mine.complete
                  ? 'Você está inscrito com ${mine.playerA == _me ? mine.nameB : mine.nameA}'
                  : mine.solo
                  ? 'Você está inscrito sozinho'
                  : 'Sua dupla está esperando o parceiro',
              subtitle: mine.solo
                  ? 'Sua dupla será sorteada quando o torneio começar.'
                  : null,
              leading: const AppTileIcon(AppIcon.check, color: Colors.teal),
            ),
            if (!mine.solo && !mine.complete && mine.playerA == _me)
              _PairCodeTile(tournamentId: t.id),
            AppTile(
              title: 'Sair do torneio',
              leading: const AppTileIcon(
                AppIcon.personRemove,
                color: Colors.red,
              ),
              enabled: !_busy,
              onTap: () => _run(() => _repo.unregister(t.id)),
            ),
          ] else if (!full) ...[
            if (t.entry != TournamentEntry.solo)
              AppTile(
                title: 'Inscrever minha dupla',
                subtitle: 'Depois o seu parceiro entra nela.',
                leading: const AppTileIcon(AppIcon.people, color: Colors.teal),
                enabled: !_busy,
                onTap: () => _run(() async {
                  final code = await _repo.register(t.id, 'pair');
                  if (code != null && mounted) {
                    await showAppDialog<void>(
                      context,
                      title: 'Dupla inscrita',
                      message:
                          'Mande este código para o seu parceiro: $code\n\n'
                          'Ele abre o torneio e toca em "Entrar na dupla de '
                          'um amigo". Só quem tiver o código entra na sua '
                          'dupla.',
                      actions: const [
                        AppDialogAction(label: 'OK', value: null),
                      ],
                    );
                  }
                }),
              ),
            if (t.entry != TournamentEntry.pairs)
              AppTile(
                title: 'Entrar sozinho',
                subtitle: 'O parceiro é sorteado quando o torneio começar.',
                leading: const AppTileIcon(AppIcon.person, color: Colors.blue),
                enabled: !_busy,
                onTap: () => _run(
                  () => _repo.register(t.id, 'solo'),
                  done: 'Inscrição feita.',
                ),
              ),
            if (t.entry != TournamentEntry.solo)
              AppTile(
                title: 'Entrar na dupla de um amigo',
                subtitle: 'Com o código que ele recebeu ao inscrever a dupla.',
                leading: const AppTileIcon(
                  AppIcon.personAdd,
                  color: Colors.indigo,
                ),
                enabled: !_busy,
                onTap: () => _joinPair(t.id),
              ),
          ],
          if (owner)
            AppTile(
              title: 'Começar o torneio',
              subtitle: 'Encerra as inscrições e sorteia os jogos.',
              leading: const AppTileIcon(AppIcon.play, color: Colors.red),
              enabled: !_busy,
              onTap: () async {
                final alone = d.teams.where((x) => !x.complete).length;
                final note = alone == 0
                    ? ''
                    : t.entry == TournamentEntry.pairs
                    ? ' Quem está sem parceiro fica de fora.'
                    : ' Quem está sem parceiro entra no sorteio das duplas '
                          '(se sobrar alguém, fica de fora).';
                if (await _confirm(
                  'Começar o torneio?',
                  'As inscrições fecham e os jogos são sorteados.$note',
                  'Começar',
                )) {
                  await _run(() => _repo.start(t.id));
                }
              },
            ),
        ],
      ),
      AppSection(
        header: 'Inscritos (${d.people} pessoas)',
        children: d.teams.isEmpty
            ? [AppTile(title: 'Ninguém se inscreveu ainda.')]
            : [
                for (final x in d.teams)
                  AppTile(
                    title: x.label,
                    subtitle: x.complete
                        ? null
                        : x.solo
                        ? 'Sozinho: entra no sorteio das duplas'
                        : 'Esperando o parceiro',
                    highlighted: x.has(_me),
                  ),
              ],
      ),
    ];
  }

  Future<void> _joinPair(String id) async {
    final code = TextEditingController();
    final ok = await showAppDialog<bool>(
      context,
      title: 'Entrar na dupla de um amigo',
      content: Padding(
        padding: const EdgeInsets.only(top: 12),
        child: AppTextField(
          controller: code,
          label: 'Código da dupla',
          autofocus: true,
          maxLength: 4,
          textCapitalization: TextCapitalization.characters,
        ),
      ),
      actions: const [
        AppDialogAction(label: 'Cancelar', value: false),
        AppDialogAction(label: 'Entrar', value: true, isPrimary: true),
      ],
    );
    final text = code.text.trim().toUpperCase();
    code.dispose();
    if (ok != true || !mounted) return;
    await _run(
      () => _repo.register(id, 'join', code: text),
      done: 'Você entrou na dupla.',
    );
  }

  List<Widget> _results(TournamentDetail d) {
    final t = d.tournament;
    final rounds = <int, List<TournamentMatch>>{};
    for (final m in d.matches) {
      (rounds[m.round] ??= []).add(m);
    }
    final out = <Widget>[];
    if (t.format == TournamentFormat.roundRobin) {
      final table = standingsOf(d.teams, d.matches);
      out.add(
        AppSection(
          header: 'Classificação',
          footer: 'V: vitórias · D: derrotas · S: saldo de tentos',
          children: [
            for (final (i, r) in table.indexed)
              AppTile(
                title: '${i + 1}. ${r.team.label}',
                trailing: Text(
                  '${r.wins} V  ${r.losses} D  '
                  '${r.balance >= 0 ? '+' : ''}${r.balance} S',
                  style: Theme.of(context).textTheme.bodyMedium
                      ?.copyWith(fontWeight: FontWeight.w600),
                ),
                highlighted: r.team.has(_me),
              ),
          ],
        ),
      );
    }
    for (final entry in rounds.entries) {
      // Repescagem: matches whose teams aren't known yet, and empty ones.
      final shown = [
        for (final m in entry.value)
          if (m.teamA != null || m.teamB != null) m,
      ];
      if (t.format == TournamentFormat.doubleElimination && shown.isEmpty) {
        continue;
      }
      out.add(
        AppSection(
          header: _roundName(t, entry.key, entry.value.length),
          children: [
            for (final m in entry.value)
              if (!(t.format == TournamentFormat.roundRobin && m.bye) &&
                  !(t.format == TournamentFormat.doubleElimination &&
                      m.teamA == null &&
                      m.teamB == null))
                _matchTile(d, m),
          ],
        ),
      );
    }
    return out;
  }

  String _roundName(Tournament t, int round, int matches) {
    if (t.format == TournamentFormat.roundRobin) return 'Rodada $round';
    if (t.format == TournamentFormat.doubleElimination) {
      if (round >= 201) return 'Finalíssima';
      if (round >= 200) return 'Final';
      if (round > 100) return 'Repescagem: rodada ${round - 100}';
      return matches == 1
          ? 'Final da chave principal'
          : 'Chave principal: rodada $round';
    }
    return switch (matches) {
      1 => 'Final',
      2 => 'Semifinal',
      4 => 'Quartas de final',
      8 => 'Oitavas de final',
      _ => 'Rodada $round',
    };
  }

  Widget _matchTile(TournamentDetail d, TournamentMatch m) {
    final a = d.team(m.teamA);
    final b = d.team(m.teamB);
    final winner = d.team(m.winner);
    final mine = a?.has(_me) == true || b?.has(_me) == true;
    final String subtitle;
    if (m.bye) {
      subtitle = 'Passou direto para a próxima rodada.';
    } else if (m.done) {
      final score = m.bestOf > 1
          ? '${m.gamesA} × ${m.gamesB}'
          : '${m.scoreA ?? 0} × ${m.scoreB ?? 0}';
      subtitle = m.walkover
          ? (winner == null
                ? 'Ninguém jogou: derrota para as duas.'
                : 'Vitória por W.O. de ${winner.label}.')
          : 'Vitória de ${winner?.label ?? '?'}, $score.';
    } else if (m.status == 'playing') {
      subtitle = m.bestOf > 1
          ? 'Jogando: ${m.gamesA} × ${m.gamesB}.'
          : 'Jogando agora.';
    } else {
      subtitle = m.deadline == null
          ? 'A jogar.'
          : 'A jogar até ${_when(m.deadline!)}.';
    }
    return AppTile(
      title: m.bye
          ? a?.label ?? '?'
          : '${a?.label ?? '?'} × ${b?.label ?? '?'}',
      subtitle: subtitle,
      highlighted: mine,
      onTap: mine && !m.done && m.roomCode != null
          ? () => context.go('/jogo/entrar?codigo=${m.roomCode}')
          : !mine &&
                m.status == 'playing' &&
                m.roomId != null &&
                d.teamOf(_me) != null
          ? () => context.push('/torneios/assistir/${m.roomId}')
          : null,
      trailing: !mine && m.status == 'playing' && d.teamOf(_me) != null
          ? const Text('Assistir')
          : null,
    );
  }

  static String _when(DateTime d) {
    String two(int n) => n.toString().padLeft(2, '0');
    return '${two(d.day)}/${two(d.month)} às ${two(d.hour)}h${two(d.minute)}';
  }
}

/// "Código da sua dupla", for the person who signed the pair up.
class _PairCodeTile extends ConsumerWidget {
  const _PairCodeTile({required this.tournamentId});
  final String tournamentId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(pairCodeProvider(tournamentId));
    final code = async.value;
    if (code == null) {
      return AppTile(
        title: async.isLoading
            ? 'Buscando o código da sua dupla…'
            : 'Não deu para buscar o código da dupla',
        subtitle: async.isLoading ? null : 'Toque para tentar de novo.',
        leading: const AppTileIcon(AppIcon.key, color: Colors.indigo),
        onTap: async.isLoading
            ? null
            : () => ref.invalidate(pairCodeProvider(tournamentId)),
      );
    }
    return AppTile(
      title: 'Código da sua dupla: $code',
      subtitle:
          'Mande para o seu parceiro: ele toca em "Entrar na dupla de um '
          'amigo" e digita o código. Só ele entra na sua dupla.',
      leading: const AppTileIcon(AppIcon.key, color: Colors.indigo),
      onTap: () {
        Clipboard.setData(ClipboardData(text: code));
        showAppToast(context, 'Código copiado.');
      },
    );
  }
}
