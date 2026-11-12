import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../domain/game/cards.dart' as deck;
import '../../domain/game/coach.dart';
import '../../domain/game/rules.dart';
import '../../domain/game/table_view.dart';
import '../../domain/game/truco_game.dart';
import '../../domain/scorekeeper/team.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/keep_screen_on.dart';
import '../../ui/theme/app_theme.dart';
import 'playing_card.dart';

/// What a [GameTable] shows: the viewer's [TableView] plus who sits where.
class GameTableModel {
  const GameTableModel({
    required this.view,
    required this.names,
    required this.wins,
    this.busy = false,
    this.status,
    this.secondsLeft,
    this.tip,
    this.hint,
    this.coachSummary,
    this.spectator = false,
  });

  final TableView view;

  /// Someone watching (a tournament match): the end names the winners.
  final bool spectator;

  /// Names by absolute seat.
  final List<String> names;

  /// Games won by each team in this sitting.
  final Map<Team, int> wins;

  /// Moves are still being shown; the viewer can't act yet.
  final bool busy;

  /// Message over the table (e.g. "Reconectando…").
  final String? status;

  /// Time left for the move the game waits for (online games).
  final int? secondsLeft;

  /// "Modo professor": a comment on the viewer's last move.
  final CoachTip? tip;

  /// "Modo professor": what to weigh before a hard decision.
  final CoachTip? hint;

  /// "Modo professor": how the game went, shown when it ends.
  final String? coachSummary;

  bool get canAct => !busy && view.canAct;

  GameTableModel withoutTips() => GameTableModel(
    view: view,
    names: names,
    wins: wins,
    busy: busy,
    status: status,
    secondsLeft: secondsLeft,
    coachSummary: coachSummary,
  );
}

/// What the viewer can do at the table.
class GameTableActions {
  const GameTableActions({
    required this.playCard,
    required this.playBlind,
    required this.raise,
    required this.accept,
    required this.fold,
    required this.onLeave,
    this.onRematch,
    this.rematchLabel = 'Revanche',
    this.gameOverExtra,
    this.onDismissTip,
    this.onShowCode,
  });

  final void Function(deck.Card card, {bool covered}) playCard;
  final void Function(int index) playBlind;
  final VoidCallback raise;
  final VoidCallback accept;
  final VoidCallback fold;

  /// The close button (the screen confirms if a game is on).
  final VoidCallback onLeave;
  final Future<void> Function()? onRematch;
  final String rematchLabel;

  /// E.g. "Esperando o anfitrião…" in an online room.
  final String? gameOverExtra;

  /// Closes the professor's comment.
  final VoidCallback? onDismissTip;

  /// Online rooms: shows the room code (to call someone in).
  final VoidCallback? onShowCode;
}

/// The card table: the viewer at the bottom, partner on top, opponents at
/// the sides. Used for games on this device and online.
class GameTable extends StatefulWidget {
  const GameTable({super.key, required this.model, required this.actions});

  final GameTableModel model;
  final GameTableActions actions;

  @override
  State<GameTable> createState() => _GameTableState();
}

class _GameTableState extends State<GameTable> {
  bool _cover = false;

  GameTableModel get m => widget.model;
  TableView get v => widget.model.view;
  GameTableActions get a => widget.actions;

  /// Screen position of a seat: 0 bottom (viewer), 1 right, 2 top, 3 left.
  int pos(int seat) => (seat - v.me + 4) % 4;
  int seatAt(int position) => (v.me + position) % 4;

  @override
  Widget build(BuildContext context) {
    return KeepScreenOn(
      child: Scaffold(
        backgroundColor: AppColors.feltDark,
        body: DecoratedBox(
          decoration: const BoxDecoration(
            gradient: RadialGradient(
              radius: 1.1,
              colors: [AppColors.felt, AppColors.feltDark],
            ),
          ),
          child: SafeArea(
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 820),
                child: Column(
                  children: [
                    _TopBar(
                      view: v,
                      onBack: a.onLeave,
                      onShowCode: a.onShowCode,
                    ),
                    Expanded(child: _table()),
                    if (m.tip != null) _tip(m.tip!),
                    if (m.hint != null) _tip(m.hint!),
                    _actions(),
                    _hand(),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  // ------------------------------------------------------------ professor --

  Widget _tip(CoachTip tip) => Padding(
    padding: const EdgeInsets.fromLTRB(12, 4, 12, 4),
    child: Material(
      color: tip.good
          ? const Color(0xFF2E7D32)
          : tip.isHint
          ? const Color(0xFFE3F0FF)
          : const Color(0xFFFFF3C4),
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: a.onDismissTip,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(12, 8, 8, 8),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                tip.good
                    ? '👏'
                    : tip.isHint
                    ? '🤔'
                    : '💡',
                style: const TextStyle(fontSize: 18),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  tip.text,
                  style: TextStyle(
                    color: tip.good
                        ? Colors.white
                        : tip.isHint
                        ? const Color(0xFF0D2A4D)
                        : const Color(0xFF4A3B00),
                    fontSize: 14,
                    height: 1.25,
                  ),
                ),
              ),
              Icon(
                Icons.close,
                size: 18,
                color: tip.good ? Colors.white70 : const Color(0xFF8A7A30),
              ),
            ],
          ),
        ),
      ),
    ),
  );

  // -------------------------------------------------------------- table --

  Widget _table() {
    final plays = v.tablePlays;
    final lastRound = v.currentPlays.isEmpty && v.showLastRound
        ? (v.rounds.isEmpty ? null : v.rounds.last)
        : null;
    return LayoutBuilder(
      builder: (context, c) {
        final cw = (c.maxWidth / 6).clamp(44.0, 88.0).toDouble();
        final small = (cw * 0.42).clamp(20.0, 34.0).toDouble();
        final active = _activeSeat();
        Alignment playSpot(int seat) => switch (pos(seat)) {
          0 => const Alignment(0, 0.75),
          1 => const Alignment(0.8, 0),
          2 => const Alignment(0, -0.75),
          _ => const Alignment(-0.8, 0),
        };
        Widget badge(int position, Alignment at) {
          final seat = seatAt(position);
          return Align(
            alignment: at,
            child: _SeatBadge(
              model: m,
              seat: seat,
              position: position,
              active: active == seat,
              backWidth: small,
              revealWidth: cw * 0.7,
            ),
          );
        }

        return Stack(
          children: [
            badge(2, const Alignment(0, -1)),
            badge(1, const Alignment(1, -0.5)),
            badge(3, const Alignment(-1, -0.5)),
            badge(0, const Alignment(0, 1)),
            Positioned(
              left: 8,
              top: 8,
              child: _ViraBox(rules: v.rules, vira: v.vira, width: cw * 0.7),
            ),
            Positioned(
              right: 10,
              top: 10,
              child: _RoundDots(rounds: v.rounds, myTeam: v.team),
            ),
            Padding(
              padding: EdgeInsets.symmetric(
                horizontal: cw * 0.9,
                vertical: cw * 0.55,
              ),
              child: Stack(
                children: [
                  for (final p in plays)
                    Align(
                      alignment: playSpot(p.seat),
                      child: p.card == null
                          ? CardBack(width: cw)
                          : p.covered
                          ? _CoveredPlay(
                              key: ValueKey(
                                'cov-${v.handNumber}-${p.card!.id}',
                              ),
                              card: p.card!,
                              width: cw,
                            )
                          : Opacity(
                              opacity: p.covered ? 0.6 : 1,
                              child: PlayingCardView(
                                card: p.card!,
                                width: cw,
                                manilha:
                                    !p.covered &&
                                    v.rules.isManilha(p.card!, vira: v.vira),
                                highlighted:
                                    lastRound != null &&
                                    !lastRound.tied &&
                                    lastRound.topSeat == p.seat,
                                dimmed:
                                    lastRound != null &&
                                    lastRound.topSeat != p.seat,
                              ),
                            ),
                    ),
                ],
              ),
            ),
            if (v.toast != null || m.status != null)
              Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 18,
                    vertical: 10,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.7),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    m.status ?? v.toast!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
            if (v.phase == GamePhase.gameOver && !m.busy) _gameOver(),
          ],
        );
      },
    );
  }

  int? _activeSeat() => switch (v.phase) {
    GamePhase.playing => v.turn,
    GamePhase.raisePending => v.mustAnswer ? v.me : nextSeat(v.pending!.seat),
    GamePhase.decision =>
      v.mustAnswer
          ? v.me
          : (teamOfSeat(nextSeat(v.dealer)) == v.decisionTeam
                ? nextSeat(v.dealer)
                : nextSeat(nextSeat(v.dealer))),
    _ => null,
  };

  Widget _gameOver() {
    final watching = m.spectator && v.winner != null;
    // Watching: the winners' side of the score comes first.
    final side = watching ? v.winner! : v.team;
    final won = watching || v.winner == v.team;
    final ours = v.scoreOf(side), theirs = v.scoreOf(side.other);
    final shutout = ours == 0 || theirs == 0;
    final winners = watching
        ? [
            for (var s = 0; s < 4; s++)
              if (teamOfSeat(s) == side) m.names[s],
          ].join(' e ')
        : null;
    return Container(
      color: Colors.black.withValues(alpha: 0.45),
      alignment: Alignment.center,
      padding: const EdgeInsets.all(24),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 360),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: const Color(0xFFFFFDF7),
            borderRadius: BorderRadius.circular(20),
          ),
          child: DefaultTextStyle.merge(
            style: const TextStyle(color: Colors.black87),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  winners != null
                      ? '$winners venceram!'
                      : won
                      ? 'Vocês venceram!'
                      : 'Eles venceram',
                  style: Theme.of(context).textTheme.headlineSmall
                      ?.copyWith(color: Colors.black),
                ),
                const SizedBox(height: 8),
                Text(
                  '$ours × $theirs'
                  '${shutout ? (won ? '\nDoze a zero! Pra baixo da mesa!' : '\nDoze a zero… pra baixo da mesa!') : ''}'
                  '\nPlacar da noite: ${m.wins[side]} × ${m.wins[side.other]}',
                  textAlign: TextAlign.center,
                ),
                if (m.coachSummary != null) ...[
                  const SizedBox(height: 12),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFF3C4),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '🎓 Professor\n${m.coachSummary}',
                      style: const TextStyle(
                        color: Color(0xFF4A3B00),
                        height: 1.3,
                      ),
                    ),
                  ),
                ],
                if (a.gameOverExtra != null) ...[
                  const SizedBox(height: 8),
                  Text(a.gameOverExtra!, textAlign: TextAlign.center),
                ],
                const SizedBox(height: 16),
                if (a.onRematch != null)
                  SizedBox(
                    width: double.infinity,
                    child: AppButton(
                      label: a.rematchLabel,
                      onPressed: a.onRematch,
                    ),
                  ),
                const SizedBox(height: 4),
                AppTextButton(label: 'Sair', onPressed: a.onLeave),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ------------------------------------------------------------ actions --

  Widget _actions() {
    final mine = m.canAct;
    final buttons = <Widget>[];
    String? prompt;

    switch (v.phase) {
      case GamePhase.decision:
        const label = 'Mão de onze';
        if (mine) {
          prompt =
              '$label! Vale ${v.rules.decisionHandValue}. Jogar ou correr? '
              'Correndo, eles levam ${v.rules.baseValue}.';
          buttons.addAll([
            _ActionButton('Jogar', AppColors.gold, a.accept),
            _ActionButton('Correr', Colors.white24, a.fold),
          ]);
        } else if (!m.busy) {
          prompt = v.decisionTeam == v.team
              ? '$label: decidindo…'
              : '$label: eles estão decidindo…';
        }
      case GamePhase.raisePending:
        final p = v.pending!;
        final asked = v.rules.stakes[p.toLevel];
        if (mine) {
          final refused = p.refusedBy;
          prompt =
              '${m.names[p.seat]} pediu '
              '${v.rules.raiseName(p.toLevel - 1).toLowerCase()} (vale $asked)'
              '${refused == null ? '' : '. ${m.names[refused]} quer correr: você decide'}';
          buttons.addAll([
            _ActionButton('Aceitar', AppColors.gold, a.accept),
            _ActionButton('Correr', Colors.white24, a.fold),
            if (p.toLevel + 1 < v.rules.stakes.length)
              _ActionButton(
                '${v.rules.raiseName(p.toLevel)}!',
                AppColors.red,
                a.raise,
              ),
          ]);
        } else if (!m.busy) {
          final refused = p.refusedBy;
          prompt = refused == v.me
              ? 'Você quer correr. Esperando a decisão do parceiro…'
              : refused != null && teamOfSeat(refused) == v.team
              ? '${m.names[refused]} quer correr. Esperando…'
              : refused != null
              ? '${m.names[refused]} quer correr. O parceiro decide…'
              : 'Esperando a resposta…';
        }
      case GamePhase.playing:
        if (mine) {
          if (v.canRaise) {
            buttons.add(
              _ActionButton(
                '${v.rules.raiseName(v.stakeLevel)}!',
                AppColors.red,
                a.raise,
              ),
            );
          }
          if (v.canCover) {
            buttons.add(
              _ActionButton(
                _cover ? 'Coberta: sim' : 'Jogar coberta',
                _cover ? AppColors.gold : Colors.white24,
                () => setState(() => _cover = !_cover),
              ),
            );
          }
          prompt = v.iron ? 'Sua vez: escolha uma carta às cegas.' : 'Sua vez.';
        }
      case GamePhase.handOver:
      case GamePhase.gameOver:
        break;
    }

    final left = m.secondsLeft;
    if (left != null && !m.busy) {
      final active = _activeSeat();
      if (prompt == null && v.phase == GamePhase.playing && active != null) {
        prompt = 'Vez de ${m.names[active]}';
      }
      if (prompt != null) prompt = '$prompt  ⏱ ${timeLeftLabel(left)}';
    }

    return AnimatedSize(
      duration: const Duration(milliseconds: 150),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(12, 4, 12, 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (prompt != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: Text(
                  prompt,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            if (buttons.isNotEmpty)
              Wrap(
                spacing: 8,
                runSpacing: 8,
                alignment: WrapAlignment.center,
                children: buttons,
              ),
          ],
        ),
      ),
    );
  }

  // --------------------------------------------------------------- hand --

  Widget _hand() {
    final canPlay = m.canAct && v.myTurn;
    return LayoutBuilder(
      builder: (context, c) {
        final screenH = MediaQuery.sizeOf(context).height;
        final cw = (c.maxWidth / 4.0)
            .clamp(56.0, 110.0)
            .clamp(0.0, screenH * 0.12)
            .toDouble();
        final count = v.handCounts[v.me];
        return Padding(
          padding: const EdgeInsets.fromLTRB(8, 6, 8, 12),
          child: SizedBox(
            height: cw / cardAspect + 12,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                for (var i = 0; i < count; i++)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: _TapCard(
                      enabled: canPlay,
                      onTap: () {
                        if (v.iron) {
                          a.playBlind(i);
                        } else {
                          a.playCard(v.hand[i], covered: _cover);
                        }
                        setState(() => _cover = false);
                      },
                      child: v.iron || i >= v.hand.length
                          ? CardBack(width: cw, label: '?')
                          : PlayingCardView(
                              card: v.hand[i],
                              width: cw,
                              manilha: v.rules.isManilha(
                                v.hand[i],
                                vira: v.vira,
                              ),
                            ),
                    ),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _TapCard extends StatelessWidget {
  const _TapCard({
    required this.enabled,
    required this.onTap,
    required this.child,
  });

  final bool enabled;
  final VoidCallback onTap;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return AnimatedSlide(
      duration: const Duration(milliseconds: 150),
      offset: Offset(0, enabled ? -0.06 : 0),
      child: GestureDetector(onTap: enabled ? onTap : null, child: child),
    );
  }
}

class _ActionButton extends StatelessWidget {
  const _ActionButton(this.label, this.color, this.onTap);

  final String label;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final dark = color == AppColors.gold;
    return Material(
      color: color,
      borderRadius: BorderRadius.circular(999),
      child: InkWell(
        borderRadius: BorderRadius.circular(999),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 11),
          child: Text(
            label,
            style: TextStyle(
              color: dark ? Colors.black : Colors.white,
              fontWeight: FontWeight.w800,
              fontSize: 16,
            ),
          ),
        ),
      ),
    );
  }
}

// ------------------------------------------------------------- top bar --

class _TopBar extends StatelessWidget {
  const _TopBar({required this.view, required this.onBack, this.onShowCode});

  final TableView view;
  final VoidCallback onBack;
  final VoidCallback? onShowCode;

  @override
  Widget build(BuildContext context) {
    const white = TextStyle(color: Colors.white, fontWeight: FontWeight.w700);
    return Padding(
      padding: const EdgeInsets.fromLTRB(4, 4, 12, 0),
      child: Row(
        children: [
          IconButton(
            onPressed: onBack,
            icon: const Icon(Icons.close, color: Colors.white),
            tooltip: 'Sair',
          ),
          Expanded(
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: Row(
                children: [
                  _ScorePill('Nós', view.scoreOf(view.team), AppColors.teamA),
                  const SizedBox(width: 8),
                  _ScorePill(
                    'Eles',
                    view.scoreOf(view.team.other),
                    AppColors.teamB,
                  ),
                ],
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.black26,
              borderRadius: BorderRadius.circular(999),
            ),
            child: Text('Vale ${view.handValue}', style: white),
          ),
          if (onShowCode != null)
            IconButton(
              onPressed: onShowCode,
              icon: const Icon(Icons.tag, color: Colors.white),
              tooltip: 'Código da sala',
            ),
          IconButton(
            onPressed: () => context.push('/jogo/regras', extra: view.rules),
            icon: const Icon(Icons.help_outline, color: Colors.white),
            tooltip: 'Regras',
          ),
        ],
      ),
    );
  }
}

class _ScorePill extends StatelessWidget {
  const _ScorePill(this.label, this.score, this.color);

  final String label;
  final int score;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        '$label  $score',
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w800,
          fontSize: 16,
        ),
      ),
    );
  }
}

// --------------------------------------------------------------- seats --

class _SeatBadge extends StatelessWidget {
  const _SeatBadge({
    required this.model,
    required this.seat,
    required this.position,
    required this.active,
    required this.backWidth,
    required this.revealWidth,
  });

  final GameTableModel model;
  final int seat;

  /// 0 bottom (viewer), 1 right, 2 top (partner), 3 left.
  final int position;
  final bool active;
  final double backWidth;

  /// Size of the partner's cards when shown because a decision depends on
  /// them (as big as the vira, to catch the eye).
  final double revealWidth;

  @override
  Widget build(BuildContext context) {
    final v = model.view;
    final said = v.speech[seat];
    // The pé (last to play this round) gets an orange tag and outline.
    final foot = v.foot == seat && v.phase != GamePhase.gameOver;
    // The partner's cards we may see are face up in their hand.
    final shown = position == 2 ? (v.partnerHand ?? const []) : const [];
    final big =
        shown.isNotEmpty &&
        (v.partnerShownForRaise || v.phase == GamePhase.decision);
    final hidden = v.handCounts[seat] - shown.length;
    final name = Container(
      padding: const EdgeInsets.fromLTRB(10, 3, 4, 3),
      decoration: BoxDecoration(
        color: active ? AppColors.gold : Colors.black38,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(
          color: foot ? AppColors.orange : Colors.transparent,
          width: 2,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            model.names[seat],
            style: TextStyle(
              color: active ? Colors.black : Colors.white,
              fontWeight: FontWeight.w700,
              fontSize: 13,
            ),
          ),
          if (foot)
            Container(
              key: ValueKey('foot-$seat'),
              margin: const EdgeInsets.only(left: 6),
              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 1),
              decoration: BoxDecoration(
                color: AppColors.orange,
                borderRadius: BorderRadius.circular(999),
              ),
              child: const Text(
                'PÉ',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w900,
                  fontSize: 11,
                ),
              ),
            )
          else
            const SizedBox(width: 6),
        ],
      ),
    );
    final bubble = said == null
        ? null
        : Container(
            margin: const EdgeInsets.symmetric(vertical: 4),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              said,
              style: const TextStyle(
                color: Colors.black,
                fontWeight: FontWeight.w800,
              ),
            ),
          );
    return Padding(
      padding: const EdgeInsets.all(6),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (position != 0)
            Row(
              key: ValueKey('hand-$seat'),
              mainAxisSize: MainAxisSize.min,
              children: [
                for (final c in shown)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 1),
                    child: PlayingCardView(
                      key: ValueKey('shown-${c.id}'),
                      card: c,
                      width: big ? revealWidth : backWidth,
                      manilha: v.rules.isManilha(c, vira: v.vira),
                    ),
                  ),
                for (var i = 0; i < hidden; i++)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 1),
                    child: CardBack(width: backWidth),
                  ),
              ],
            ),
          const SizedBox(height: 4),
          name,
          ?bubble,
        ],
      ),
    );
  }
}

class _ViraBox extends StatelessWidget {
  const _ViraBox({
    required this.rules,
    required this.vira,
    required this.width,
  });

  final TrucoRules rules;
  final deck.Card? vira;
  final double width;

  @override
  Widget build(BuildContext context) {
    const label = TextStyle(color: Colors.white70, fontSize: 11);
    if (vira == null) {
      return const Text('Manilhas fixas', style: label);
    }
    return Column(
      children: [
        const Text('Vira', style: label),
        const SizedBox(height: 2),
        PlayingCardView(card: vira!, width: width),
      ],
    );
  }
}

class _RoundDots extends StatelessWidget {
  const _RoundDots({required this.rounds, required this.myTeam});

  final List<RoundView> rounds;
  final Team myTeam;

  @override
  Widget build(BuildContext context) {
    Color colorOf(int i) {
      if (i >= rounds.length) return Colors.white24;
      final w = rounds[i].winner;
      if (w == null) return Colors.white70;
      return w == myTeam ? AppColors.teamA : AppColors.teamB;
    }

    return Row(
      children: [
        for (var i = 0; i < 3; i++)
          Container(
            margin: const EdgeInsets.only(left: 4),
            width: 14,
            height: 14,
            decoration: BoxDecoration(
              color: colorOf(i),
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white54),
            ),
          ),
      ],
    );
  }
}

/// Asks before leaving a game in progress.
Future<bool> confirmLeaveGame(BuildContext context, {String? message}) async {
  final leave = await showAppDialog<bool>(
    context,
    title: 'Sair do jogo?',
    message: message ?? 'A partida em andamento será perdida.',
    actions: const [
      AppDialogAction(label: 'Continuar jogando', value: false),
      AppDialogAction(label: 'Sair', value: true, isDestructive: true),
    ],
  );
  return leave == true;
}

/// "15 s", "12 min", "5 h", "1 d 4 h" (slow games count days).
String timeLeftLabel(int seconds) {
  if (seconds < 100) return '$seconds s';
  if (seconds < 3600) return '${(seconds / 60).ceil()} min';
  final hours = (seconds / 3600).ceil();
  if (hours < 24) return '$hours h';
  final d = hours ~/ 24, h = hours % 24;
  return h == 0 ? '$d d' : '$d d $h h';
}

/// A covered card the viewer may know (their own, or the partner's): shown
/// faded for a moment, then turned face down, so it reads as covered.
class _CoveredPlay extends StatefulWidget {
  const _CoveredPlay({super.key, required this.card, required this.width});
  final deck.Card card;
  final double width;

  @override
  State<_CoveredPlay> createState() => _CoveredPlayState();
}

class _CoveredPlayState extends State<_CoveredPlay> {
  bool _down = false;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer(const Duration(milliseconds: 1400), () {
      if (mounted) setState(() => _down = true);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedSwitcher(
    duration: const Duration(milliseconds: 350),
    transitionBuilder: (child, anim) => ScaleTransition(
      scale: Tween(begin: 0.85, end: 1.0).animate(anim),
      child: FadeTransition(opacity: anim, child: child),
    ),
    child: _down
        ? CardBack(key: const ValueKey('down'), width: widget.width)
        : Opacity(
            key: const ValueKey('up'),
            opacity: 0.55,
            child: PlayingCardView(card: widget.card, width: widget.width),
          ),
  );
}
