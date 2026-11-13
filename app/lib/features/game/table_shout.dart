import 'dart:math' as math;

import 'package:flutter/material.dart';

/// Moments when the table "shouts" a comic-book balloon.
enum ShoutEvent { truco, seis, nove, doze }

/// What can be shouted at each moment; one is picked at random.
const shoutPhrases = <ShoutEvent, List<String>>{
  ShoutEvent.truco: ['Truco! Sofá de zona!', 'Treis mio!', 'É o nome do jogo!'],
  ShoutEvent.seis: ['Seeeiss burro!', 'Seis papudo!'],
  ShoutEvent.nove: ['Nove facãozeiro!'],
  ShoutEvent.doze: ['Vamos acabar com o jogo!'],
};

/// The rare variant of "Truco! Sofá de zona!" (1 in 1000).
const rareTrucoShout = 'Truco! Penteadeira de puta!';

/// At most this many balloons in one match.
const maxShoutsPerMatch = 2;

/// Chance of a balloon for a raise at a tense moment, and for a raise
/// above truco (seis, nove, doze) at a calm one. A plain truco at a calm
/// moment never shouts.
const tenseShoutChance = 0.6;
const calmRaiseShoutChance = 0.25;

/// Whether a raise to [toLevel] comes at a tense moment: near the mão de
/// ferro (both teams at 9 or more), a close score late in the match, or a
/// hand that would now be worth enough to end it.
bool isTenseRaise({
  required int scoreA,
  required int scoreB,
  required int toLevel,
  required List<int> stakes,
  int target = 12,
}) {
  final high = math.max(scoreA, scoreB);
  if (math.min(scoreA, scoreB) >= 9) return true;
  if (high >= 7 && (scoreA - scoreB).abs() <= 2) return true;
  final value = stakes[math.min(toLevel, stakes.length - 1)];
  return high + value >= target;
}

String? pickShout(ShoutEvent event, [math.Random? random]) {
  final options = shoutPhrases[event];
  if (options == null || options.isEmpty) return null;
  final r = random ?? math.Random();
  final text = options[r.nextInt(options.length)];
  if (text == 'Truco! Sofá de zona!' && r.nextInt(1000) == 0) {
    return rareTrucoShout;
  }
  return text;
}

/// The balloon for a raise, or null when this one stays quiet: decides by
/// how tense the moment is and how many balloons the match already had.
String? shoutForRaise({
  required ShoutEvent event,
  required bool tense,
  required int shoutsSoFar,
  math.Random? random,
}) {
  if (shoutsSoFar >= maxShoutsPerMatch) return null;
  final r = random ?? math.Random();
  final chance = tense
      ? tenseShoutChance
      : event == ShoutEvent.truco
      ? 0.0
      : calmRaiseShoutChance;
  if (r.nextDouble() >= chance) return null;
  return pickShout(event, r);
}

/// A comic-book "shout" balloon that pops in the middle of the table and
/// goes away by itself after a few seconds, so it doesn't hide the vira.
class TableShout extends StatefulWidget {
  const TableShout({super.key, required this.text, this.onDone});

  final String text;
  final VoidCallback? onDone;

  static const duration = Duration(milliseconds: 2800);

  @override
  State<TableShout> createState() => _TableShoutState();
}

class _TableShoutState extends State<TableShout>
    with SingleTickerProviderStateMixin {
  late final _c = AnimationController(
    vsync: this,
    duration: TableShout.duration,
  )..forward().whenComplete(() => widget.onDone?.call());

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => IgnorePointer(
    child: AnimatedBuilder(
      animation: _c,
      builder: (context, child) {
        final t = _c.value;
        // Pop in (first 15%), hold, fade out (last 20%).
        final pop = Curves.elasticOut.transform((t / 0.15).clamp(0.0, 1.0));
        final fade = 1 - ((t - 0.8) / 0.2).clamp(0.0, 1.0);
        return Opacity(
          opacity: fade,
          child: Transform.rotate(
            angle: -0.08,
            child: Transform.scale(scale: 0.3 + 0.7 * pop, child: child),
          ),
        );
      },
      child: CustomPaint(
        painter: const _BurstPainter(),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 46, vertical: 40),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 220),
            child: Text(
              widget.text.toUpperCase(),
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Color(0xFF1A1A1A),
                fontSize: 24,
                height: 1.05,
                fontWeight: FontWeight.w900,
                letterSpacing: 0.5,
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

/// Jagged "explosion" balloon, yellow with a thick black outline.
class _BurstPainter extends CustomPainter {
  const _BurstPainter();

  @override
  void paint(Canvas canvas, Size size) {
    const spikes = 16;
    final c = size.center(Offset.zero);
    final rx = size.width / 2, ry = size.height / 2;
    final path = Path();
    for (var i = 0; i < spikes * 2; i++) {
      final a = i * math.pi / spikes - math.pi / 2;
      // Outer points vary a little, so it looks hand drawn.
      final r = i.isEven ? 1.0 + (i % 4 == 0 ? 0.04 : -0.03) : 0.8;
      final p = c + Offset(math.cos(a) * rx * r, math.sin(a) * ry * r);
      i == 0 ? path.moveTo(p.dx, p.dy) : path.lineTo(p.dx, p.dy);
    }
    path.close();
    canvas.drawShadow(path, Colors.black, 6, false);
    canvas.drawPath(path, Paint()..color = const Color(0xFFFFD60A));
    canvas.drawPath(
      path,
      Paint()
        ..color = const Color(0xFF1A1A1A)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3.5
        ..strokeJoin = StrokeJoin.miter,
    );
  }

  @override
  bool shouldRepaint(_BurstPainter oldDelegate) => false;
}
