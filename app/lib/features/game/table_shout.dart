import 'dart:math' as math;

import 'package:flutter/material.dart';

/// Moments when the table "shouts" a comic-book balloon.
enum ShoutEvent { gameStart, truco, seis, nove, doze }

/// What can be shouted at each moment; one is picked at random. Only the
/// game start shouts for now; more phrases and events can be added here.
const shoutPhrases = <ShoutEvent, List<String>>{
  ShoutEvent.gameStart: ['Truco! Sofá de zona!'],
};

String? pickShout(ShoutEvent event, [math.Random? random]) {
  final options = shoutPhrases[event];
  if (options == null || options.isEmpty) return null;
  return options[(random ?? math.Random()).nextInt(options.length)];
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
