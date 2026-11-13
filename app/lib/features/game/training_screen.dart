import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../data/game_prefs.dart';
import '../../domain/game/training.dart';
import '../../domain/scorekeeper/team.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import 'game_table.dart';

const _kDone = 'training.done.v1';

Future<Set<String>> _loadDone() async {
  try {
    final p = await SharedPreferences.getInstance();
    return (p.getStringList(_kDone) ?? const []).toSet();
  } catch (_) {
    return {};
  }
}

Future<void> _saveDone(Set<String> done) async {
  try {
    final p = await SharedPreferences.getInstance();
    await p.setStringList(_kDone, done.toList());
  } catch (_) {}
}

/// "Treinar": situations by level, each played at the table.
class TrainingScreen extends StatefulWidget {
  const TrainingScreen({super.key});

  @override
  State<TrainingScreen> createState() => _TrainingScreenState();
}

class _TrainingScreenState extends State<TrainingScreen> {
  /// Scenarios answered right at least once.
  Set<String> _done = {};

  @override
  void initState() {
    super.initState();
    _reload();
  }

  Future<void> _reload() async {
    final done = await _loadDone();
    if (mounted) setState(() => _done = done);
  }

  Future<void> _open(TrainingLevel level, int index) async {
    await Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => TrainingTableScreen(level: level, index: index),
      ),
    );
    await _reload();
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Treinar',
      children: [
        for (final level in TrainingLevel.values) _section(context, level),
      ],
    );
  }

  Widget _section(BuildContext context, TrainingLevel level) {
    final list = trainingAt(level);
    final done = list.where((s) => _done.contains(s.id)).length;
    return AppSection(
      header: '${level.label} · $done de ${list.length}',
      footer: level.blurb,
      children: [
        for (var i = 0; i < list.length; i++)
          AppTile(
            title: said(context, list[i].title),
            leading: Icon(
              _done.contains(list[i].id)
                  ? Icons.check_circle
                  : Icons.circle_outlined,
              color: _done.contains(list[i].id)
                  ? Colors.green
                  : Theme.of(context).disabledColor,
            ),
            onTap: () => _open(level, i),
          ),
      ],
    );
  }
}

/// One situation at the card table: the popup tells what happened, and the
/// player answers by touching a card or a button, as in a game.
class TrainingTableScreen extends StatefulWidget {
  const TrainingTableScreen({
    super.key,
    required this.level,
    required this.index,
  });

  final TrainingLevel level;
  final int index;

  @override
  State<TrainingTableScreen> createState() => _TrainingTableScreenState();
}

class _TrainingTableScreenState extends State<TrainingTableScreen> {
  late final List<TrainingScenario> _list = trainingAt(widget.level);
  late int _index = widget.index;
  TrainingMove? _picked;
  bool _popupOpen = false;

  TrainingScenario get _s => _list[_index];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _showPopup());
  }

  Future<void> _answer(TrainingMove move) async {
    if (_picked != null) return;
    setState(() => _picked = move);
    if (_s.isGood(move)) {
      final done = await _loadDone();
      await _saveDone({...done, _s.id});
    }
    if (mounted) await _showPopup();
  }

  void _go(int index) {
    setState(() {
      _index = index;
      _picked = null;
    });
    WidgetsBinding.instance.addPostFrameCallback((_) => _showPopup());
  }

  Future<void> _showPopup() async {
    if (_popupOpen || !mounted) return;
    _popupOpen = true;
    final next = await showDialog<_Next>(
      context: context,
      builder: (context) => _picked == null
          ? _IntroDialog(scenario: _s, number: _index + 1, total: _list.length)
          : _ResultDialog(
              scenario: _s,
              picked: _picked!,
              last: _index == _list.length - 1,
            ),
    );
    _popupOpen = false;
    if (!mounted) return;
    switch (next) {
      case _Next.next:
        _go(_index + 1);
      case _Next.retry:
        _go(_index);
      case _Next.list:
        Navigator.of(context).pop();
      case null:
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = _s;
    final view = s.view;
    return GameTable(
      key: ValueKey(s.id),
      model: GameTableModel(
        view: view,
        names: trainingNames,
        wins: const {Team.a: 0, Team.b: 0},
        busy: _picked != null,
      ),
      actions: GameTableActions(
        playCard: (card, {covered = false}) => _answer('card:${card.id}'),
        playBlind: (_) {},
        raise: () => _answer('raise'),
        accept: () => _answer('accept'),
        fold: () => _answer('fold'),
        onLeave: () => Navigator.of(context).pop(),
        onInfo: _showPopup,
      ),
    );
  }
}

enum _Next { next, retry, list }

class _IntroDialog extends StatelessWidget {
  const _IntroDialog({
    required this.scenario,
    required this.number,
    required this.total,
  });

  final TrainingScenario scenario;
  final int number;
  final int total;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return AlertDialog(
      title: Text(said(context, scenario.title)),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${scenario.level.label} · $number de $total',
              style: theme.textTheme.labelMedium?.copyWith(
                color: theme.colorScheme.primary,
              ),
            ),
            const SizedBox(height: 8),
            Text(said(context, scenario.situation)),
            const SizedBox(height: 12),
            Text(
              'Responda na mesa: toque na carta que você joga ou no botão '
              '(truco, aceitar, correr…). O botão 🎓 lá em cima abre este '
              'texto de novo.',
              style: theme.textTheme.bodySmall,
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Ver a mesa'),
        ),
      ],
    );
  }
}

class _ResultDialog extends StatelessWidget {
  const _ResultDialog({
    required this.scenario,
    required this.picked,
    required this.last,
  });

  final TrainingScenario scenario;
  final TrainingMove picked;
  final bool last;

  @override
  Widget build(BuildContext context) {
    final s = scenario;
    final good = s.isGood(picked);
    final notes = [
      ?s.wrong[picked],
      ?s.alsoGood[picked],
      if (picked == s.answer) ...s.alsoGood.values,
    ];
    return AlertDialog(
      title: Text(
        picked == s.answer
            ? 'Isso mesmo! 👏'
            : good
            ? 'Também vale! 👍'
            : 'Não foi dessa vez 💡',
      ),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!good) ...[
              Text(
                'Melhor jogada: ${_label(s.answer)}.',
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
            ],
            for (final n in notes) ...[
              Text(said(context, n)),
              const SizedBox(height: 8),
            ],
            Text(said(context, s.explanation)),
          ],
        ),
      ),
      actions: [
        if (!good)
          TextButton(
            onPressed: () => Navigator.of(context).pop(_Next.retry),
            child: const Text('Tentar de novo'),
          ),
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Ver a mesa'),
        ),
        FilledButton(
          onPressed: () =>
              Navigator.of(context).pop(last ? _Next.list : _Next.next),
          child: Text(last ? 'Voltar à lista' : 'Próxima'),
        ),
      ],
    );
  }

  String _label(TrainingMove move) {
    if (move.startsWith('card:')) {
      final id = move.substring(5);
      final card = scenario.hand.firstWhere((c) => c.id == id);
      return 'jogar o ${card.label}';
    }
    final pending = scenario.raiseTo;
    return switch (move) {
      'raise' when pending != null =>
        'pedir ${TrainingScenario.rules.raiseName(pending).toLowerCase()}',
      'raise' => 'pedir truco',
      'accept' when scenario.isElevenDecision => 'jogar a mão de onze',
      'accept' => 'aceitar',
      'fold' => 'correr',
      _ => move,
    };
  }
}
