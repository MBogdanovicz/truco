import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/ads.dart';
import '../../domain/game/cards.dart' as deck;
import '../../domain/game/rules.dart';
import '../../domain/game/truco_game.dart';
import '../../domain/scorekeeper/team.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/keep_screen_on.dart';
import '../../ui/theme/app_theme.dart';
import 'local_game_controller.dart';
import 'playing_card.dart';

/// The card table for a game against the computer.
class GameTableScreen extends ConsumerStatefulWidget {
  const GameTableScreen({super.key});

  @override
  ConsumerState<GameTableScreen> createState() => _GameTableState();
}

class _GameTableState extends ConsumerState<GameTableScreen> {
  bool _cover = false;

  LocalGameController get _ctrl =>
      ref.read(localGameControllerProvider.notifier);

  Future<void> _confirmLeave() async {
    final s = ref.read(localGameControllerProvider);
    if (s == null || s.game.phase == GamePhase.gameOver) {
      _leave();
      return;
    }
    final leave = await showAppDialog<bool>(
      context,
      title: 'Sair do jogo?',
      message: 'A partida em andamento será perdida.',
      actions: const [
        AppDialogAction(label: 'Continuar jogando', value: false),
        AppDialogAction(label: 'Sair', value: true, isDestructive: true),
      ],
    );
    if (leave == true && mounted) _leave();
  }

  void _leave() {
    _ctrl.quit();
    context.go('/');
  }

  @override
  Widget build(BuildContext context) {
    final session = ref.watch(localGameControllerProvider);
    if (session == null) {
      return AppScaffold(
        title: 'Jogar truco',
        body: Center(
          child: AppButton(
            label: 'Novo jogo',
            onPressed: () => context.go('/jogo'),
          ),
        ),
      );
    }
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) _confirmLeave();
      },
      child: KeepScreenOn(
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
                      _TopBar(session: session, onBack: _confirmLeave),
                      Expanded(child: _table(session)),
                      _actions(session),
                      _hand(session),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  // -------------------------------------------------------------- table --

  Widget _table(LocalGameSession s) {
    final g = s.game;
    final v = s.view;
    final plays = g.currentPlays.isNotEmpty
        ? g.currentPlays
        : (s.showLastRound && g.rounds.isNotEmpty
              ? g.rounds.last.plays
              : const <Play>[]);
    final lastRound = g.currentPlays.isEmpty && s.showLastRound
        ? (g.rounds.isEmpty ? null : g.rounds.last)
        : null;
    return LayoutBuilder(
      builder: (context, c) {
        final cw = (c.maxWidth / 6).clamp(44.0, 88.0).toDouble();
        final small = (cw * 0.42).clamp(20.0, 34.0).toDouble();
        final active = _activeSeat(g);
        Alignment playSpot(int seat) => switch (seat) {
          0 => const Alignment(0, 0.75),
          1 => const Alignment(0.8, 0),
          2 => const Alignment(0, -0.75),
          _ => const Alignment(-0.8, 0),
        };
        return Stack(
          children: [
            // Seats.
            Align(
              alignment: const Alignment(0, -1),
              child: _SeatBadge(
                session: s,
                seat: 2,
                active: active == 2,
                backWidth: small,
                revealWidth: cw * 0.7,
              ),
            ),
            Align(
              alignment: const Alignment(1, -0.5),
              child: _SeatBadge(
                session: s,
                seat: 1,
                active: active == 1,
                backWidth: small,
              ),
            ),
            Align(
              alignment: const Alignment(-1, -0.5),
              child: _SeatBadge(
                session: s,
                seat: 3,
                active: active == 3,
                backWidth: small,
              ),
            ),
            Align(
              alignment: const Alignment(0, 1),
              child: _SeatBadge(
                session: s,
                seat: 0,
                active: active == 0,
                backWidth: small,
              ),
            ),
            // Vira and round markers.
            Positioned(
              left: 8,
              top: 8,
              child: _ViraBox(rules: v.rules, vira: v.vira, width: cw * 0.7),
            ),
            Positioned(right: 10, top: 10, child: _RoundDots(rounds: g.rounds)),
            // Cards on the table.
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
                      child: p.covered
                          ? CardBack(width: cw)
                          : PlayingCardView(
                              card: p.card,
                              width: cw,
                              manilha: v.rules.isManilha(p.card, vira: v.vira),
                              highlighted:
                                  lastRound != null &&
                                  !lastRound.tied &&
                                  lastRound.topSeat == p.seat,
                              dimmed:
                                  lastRound != null &&
                                  lastRound.topSeat != p.seat,
                            ),
                    ),
                ],
              ),
            ),
            if (s.toast != null)
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
                    s.toast!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
            if (g.phase == GamePhase.gameOver) _gameOver(s),
          ],
        );
      },
    );
  }

  int? _activeSeat(TrucoGame g) => switch (g.phase) {
    GamePhase.playing => g.turn,
    GamePhase.raisePending || GamePhase.decision => g.responder,
    _ => null,
  };

  Widget _gameOver(LocalGameSession s) {
    final won = s.game.winner == Team.a;
    final a = s.game.scores[Team.a]!, b = s.game.scores[Team.b]!;
    final shutout = a == 0 || b == 0;
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
                  won ? 'Vocês venceram!' : 'Eles venceram',
                  style: Theme.of(context).textTheme.headlineSmall
                      ?.copyWith(color: Colors.black),
                ),
                const SizedBox(height: 8),
                Text(
                  '$a × $b'
                  '${shutout ? (won ? '\nDoze a zero! Pra baixo da mesa!' : '\nDoze a zero… pra baixo da mesa!') : ''}'
                  '\nPlacar da noite: ${s.wins[Team.a]} × ${s.wins[Team.b]}',
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: AppButton(
                    label: 'Revanche',
                    onPressed: () async {
                      await Ads.beforeGame(ref);
                      _ctrl.rematch();
                    },
                  ),
                ),
                const SizedBox(height: 4),
                AppTextButton(label: 'Sair', onPressed: _leave),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ------------------------------------------------------------ actions --

  Widget _actions(LocalGameSession s) {
    final g = s.game;
    final v = s.view;
    final mine = _ctrl.waitingForHuman;
    final buttons = <Widget>[];
    String? prompt;
    Widget? extra;

    switch (g.phase) {
      case GamePhase.decision:
        final label = 'Mão de ${v.rules.decisionScore == 11 ? 'onze' : 'dez'}';
        if (mine) {
          prompt =
              '$label! Vale ${v.rules.decisionHandValue}. Jogar ou correr? '
              'Correndo, eles levam ${v.rules.baseValue}.';
          buttons.addAll([
            _ActionButton('Jogar', AppColors.gold, _ctrl.accept),
            _ActionButton('Correr', Colors.white24, _ctrl.fold),
          ]);
        } else {
          prompt = '$label: eles estão decidindo…';
        }
      case GamePhase.raisePending:
        final p = g.pending!;
        final asked = v.rules.stakes[p.toLevel];
        if (mine) {
          prompt =
              '${s.names[p.seat]} pediu ${v.rules.raiseName(p.toLevel - 1).toLowerCase()} (vale $asked)';
          buttons.addAll([
            _ActionButton('Aceitar', AppColors.gold, _ctrl.accept),
            _ActionButton('Correr', Colors.white24, _ctrl.fold),
            if (p.toLevel + 1 < v.rules.stakes.length)
              _ActionButton(
                '${v.rules.raiseName(p.toLevel)}!',
                AppColors.red,
                _ctrl.raise,
              ),
          ]);
        } else {
          prompt = 'Esperando a resposta…';
        }
      case GamePhase.playing:
        if (mine) {
          if (g.canRaise(humanSeat)) {
            buttons.add(
              _ActionButton(
                '${v.rules.raiseName(g.stakeLevel)}!',
                AppColors.red,
                _ctrl.raise,
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

    return AnimatedSize(
      duration: const Duration(milliseconds: 150),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(12, 4, 12, 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ?extra,
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

  Widget _hand(LocalGameSession s) {
    final g = s.game;
    final v = s.view;
    final canPlay = _ctrl.waitingForHuman && g.phase == GamePhase.playing;
    return LayoutBuilder(
      builder: (context, c) {
        final screenH = MediaQuery.sizeOf(context).height;
        final cw = (c.maxWidth / 4.0)
            .clamp(56.0, 110.0)
            .clamp(0.0, screenH * 0.12)
            .toDouble();
        final count = v.handCount;
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
                          _ctrl.playBlind(i);
                        } else {
                          _ctrl.playCard(v.hand[i], covered: _cover);
                        }
                        setState(() => _cover = false);
                      },
                      child: v.iron
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
  const _TopBar({required this.session, required this.onBack});

  final LocalGameSession session;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    final g = session.game;
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
                  _ScorePill('Nós', g.scores[Team.a]!, AppColors.teamA),
                  const SizedBox(width: 8),
                  _ScorePill('Eles', g.scores[Team.b]!, AppColors.teamB),
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
            child: Text('Vale ${g.handValue}', style: white),
          ),
          IconButton(
            onPressed: () => context.push('/jogo/regras'),
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
    required this.session,
    required this.seat,
    required this.active,
    required this.backWidth,
    this.revealWidth,
  });

  final LocalGameSession session;
  final int seat;
  final bool active;
  final double backWidth;

  /// Size of the partner's cards when they are shown because our team must
  /// answer a truco (as big as the vira, to catch the eye).
  final double? revealWidth;

  @override
  Widget build(BuildContext context) {
    final g = session.game;
    final said = session.speech[seat];
    // The pé (last to play this round) gets an orange tag and outline.
    final foot = g.foot == seat && g.phase != GamePhase.gameOver;
    // The partner's cards we may see are face up in their hand.
    final view = session.view;
    final shown = seat == 2 ? (view.partnerHand ?? const []) : const [];
    // Big (vira-sized) while a decision depends on them: answering a raise
    // or deciding the mão de onze.
    final big =
        shown.isNotEmpty &&
        revealWidth != null &&
        (view.partnerShownForRaise || view.phase == GamePhase.decision);
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
            session.names[seat],
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
          if (seat != 0)
            Row(
              key: ValueKey('hand-$seat'),
              mainAxisSize: MainAxisSize.min,
              children: [
                for (final c in g.handOf(seat))
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 1),
                    child: shown.contains(c)
                        ? PlayingCardView(
                            key: ValueKey('shown-${c.id}'),
                            card: c,
                            width: big ? revealWidth! : backWidth,
                            manilha: g.rules.isManilha(c, vira: g.vira),
                          )
                        : CardBack(width: backWidth),
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
  const _RoundDots({required this.rounds});

  final List<RoundResult> rounds;

  @override
  Widget build(BuildContext context) {
    Color colorOf(int i) {
      if (i >= rounds.length) return Colors.white24;
      final w = rounds[i].winner;
      if (w == null) return Colors.white70;
      return w == Team.a ? AppColors.teamA : AppColors.teamB;
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
