import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../data/entitlements.dart';
import '../../domain/scorekeeper/team.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/theme/app_theme.dart';
import '../premium/premium_screen.dart';
import 'score_art.dart';

/// How the 12 tentos of a team are drawn.
enum TallyStyle { pips, holes, matches, art }

/// Look of the scoreboard. Inspired by what's used at a real truco table:
/// the felt of the table, the wooden marker with 12 holes per side, and
/// matchsticks.
///
/// Choosing a look is meant to be a premium feature once the paid tier
/// exists; for now every look is available.
enum ScoreboardSkin {
  felt(
    label: 'Mesa de feltro',
    description: 'Verde escuro de mesa de jogo, discreto.',
    bar: Color(0xFF0E2A1D),
    strip: Color(0xFF3A2716),
    text: Color(0xFFF4EBD8),
    tally: TallyStyle.pips,
  ),
  wood(
    label: 'Marcador de madeira',
    description: 'O marcador de madeira com 12 furinhos e pinos.',
    bar: Color(0xFF3B2414),
    strip: Color(0xFF2A190D),
    text: Color(0xFF3B2414),
    tally: TallyStyle.holes,
  ),
  matches(
    label: 'Palitos de fósforo',
    description: 'Cada tento é um palito na mesa.',
    bar: Color(0xFF151816),
    strip: Color(0xFF0B0D0C),
    text: Color(0xFFF1E6D2),
    tally: TallyStyle.matches,
  ),
  colors(
    label: 'Cores',
    description: 'Verde e vermelho, bem contrastado.',
    bar: AppColors.feltDark,
    strip: AppColors.felt,
    text: Colors.white,
    tally: TallyStyle.pips,
  ),
  card10(
    label: 'Carta 10',
    description: 'Um 10 na mesa e outra carta por cima, mostrando os tentos.',
    bar: Color(0xFF2A0F16),
    strip: Color(0xFF1A080D),
    text: Color(0xFFF6EAD7),
    tally: TallyStyle.art,
  ),
  beans(
    label: 'Feijões',
    description: 'Cada tento é um feijão que sai da tigela para o monte.',
    bar: Color(0xFF4A3520),
    strip: Color(0xFF2E2012),
    text: Color(0xFF3A2614),
    tally: TallyStyle.art,
  ),
  chalk(
    label: 'Lousa de giz',
    description: 'Risquinhos de giz no quadro, de cinco em cinco.',
    bar: Color(0xFF1C2622),
    strip: Color(0xFF5B3A1E),
    text: Color(0xFFEFEFE8),
    tally: TallyStyle.art,
  );

  const ScoreboardSkin({
    required this.label,
    required this.description,
    required this.bar,
    required this.strip,
    required this.text,
    required this.tally,
  });

  final String label;
  final String description;

  /// App bar and page background.
  final Color bar;

  /// Band between the two teams.
  final Color strip;

  /// Main text color on the panels.
  final Color text;
  final TallyStyle tally;

  bool get isWood => this == wood;

  /// Skins that draw the score instead of showing a big number.
  ScoreArtKind? get art => switch (this) {
    card10 => ScoreArtKind.card10,
    beans => ScoreArtKind.beans,
    chalk => ScoreArtKind.chalk,
    _ => null,
  };

  /// Light panels need dark buttons.
  bool get isLight => this == wood || this == beans;

  /// Team identity: the name, the "você" chip and the filled tentos.
  Color accent(Team team) => switch (this) {
    felt => team == Team.a ? AppColors.gold : const Color(0xFFE9E1CF),
    wood => team == Team.a ? const Color(0xFF7A1F12) : const Color(0xFF1F3A5F),
    matches => team == Team.a ? AppColors.gold : const Color(0xFFE9E1CF),
    colors => Colors.white,
    card10 => team == Team.a ? AppColors.gold : const Color(0xFFF6EAD7),
    beans => team == Team.a ? const Color(0xFF8A2A12) : const Color(0xFF1F4A3A),
    chalk => team == Team.a ? const Color(0xFFF7E08A) : const Color(0xFF9FD3F0),
  };

  /// Panel background.
  BoxDecoration panel(Team team) => switch (this) {
    felt => const BoxDecoration(
      gradient: RadialGradient(
        center: Alignment(0, -0.2),
        radius: 1.1,
        colors: [Color(0xFF235C40), Color(0xFF173F2C)],
      ),
    ),
    wood => const BoxDecoration(
      gradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [Color(0xFFD9A86C), Color(0xFFC38F55), Color(0xFFB07A42)],
      ),
    ),
    matches => const BoxDecoration(
      gradient: RadialGradient(
        center: Alignment(0, -0.3),
        radius: 1.2,
        colors: [Color(0xFF2C322D), Color(0xFF1A1E1B)],
      ),
    ),
    colors => BoxDecoration(
      color: team == Team.a ? AppColors.teamA : AppColors.teamB,
    ),
    card10 => const BoxDecoration(
      gradient: RadialGradient(
        center: Alignment(0, -0.2),
        radius: 1.1,
        colors: [Color(0xFF7A2333), Color(0xFF4A1220)],
      ),
    ),
    beans => const BoxDecoration(
      gradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [Color(0xFFE8D6B0), Color(0xFFD8C094), Color(0xFFC9AE7E)],
      ),
    ),
    chalk => BoxDecoration(
      gradient: const RadialGradient(
        center: Alignment(-0.3, -0.4),
        radius: 1.3,
        colors: [Color(0xFF3A4A43), Color(0xFF26322D)],
      ),
      border: Border.all(color: const Color(0xFF7A5230), width: 6),
    ),
  };

  /// Point buttons.
  Color button(bool enabled) => isLight
      ? const Color(0xFF5A3518).withValues(alpha: enabled ? 0.3 : 0.1)
      : Colors.white.withValues(alpha: enabled ? 0.13 : 0.05);

  Color buttonText(bool enabled) => text.withValues(alpha: enabled ? 1 : 0.4);
}

/// The chosen look, remembered on this device.
class ScoreboardSkinNotifier extends Notifier<ScoreboardSkin> {
  static const _key = 'scoreboard.skin.v1';
  // Created on use: storage may be unavailable (tests, private windows).
  SharedPreferencesAsync get _prefs => SharedPreferencesAsync();

  @override
  ScoreboardSkin build() {
    _load();
    return ScoreboardSkin.felt;
  }

  Future<void> _load() async {
    try {
      final saved = await _prefs.getString(_key);
      final skin = ScoreboardSkin.values.where((s) => s.name == saved);
      if (skin.isNotEmpty) state = skin.first;
    } on Object {
      // Keep the default.
    }
  }

  Future<void> choose(ScoreboardSkin skin) async {
    state = skin;
    try {
      await _prefs.setString(_key, skin.name);
    } on Object {
      // Not remembered; still applied for now.
    }
  }
}

final scoreboardSkinProvider =
    NotifierProvider<ScoreboardSkinNotifier, ScoreboardSkin>(
      ScoreboardSkinNotifier.new,
    );

/// Subtle wood grain drawn over the wooden panels.
class WoodGrainPainter extends CustomPainter {
  const WoodGrainPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final random = math.Random(7);
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;
    final lines = (size.height / 7).ceil();
    for (var i = 0; i < lines; i++) {
      final y0 = i * 7 + random.nextDouble() * 4;
      final amp = 1.5 + random.nextDouble() * 4;
      final freq = 0.004 + random.nextDouble() * 0.01;
      final phase = random.nextDouble() * math.pi * 2;
      paint
        ..strokeWidth = 0.6 + random.nextDouble() * 1.4
        ..color = const Color(0xFF6B3E1A)
            .withValues(alpha: 0.05 + random.nextDouble() * 0.12);
      final path = Path()..moveTo(0, y0);
      for (double x = 0; x <= size.width; x += 12) {
        path.lineTo(x, y0 + math.sin(x * freq + phase) * amp);
      }
      canvas.drawPath(path, paint);
    }
  }

  @override
  bool shouldRepaint(WoodGrainPainter oldDelegate) => false;
}

/// The 12 tentos of one team, drawn in the skin's style.
class Tally extends StatelessWidget {
  const Tally({
    super.key,
    required this.skin,
    required this.team,
    required this.score,
    required this.target,
  });

  final ScoreboardSkin skin;
  final Team team;
  final int score;
  final int target;

  @override
  Widget build(BuildContext context) => switch (skin.tally) {
    TallyStyle.pips => _pips(),
    TallyStyle.holes => _holes(),
    TallyStyle.matches => _matches(),
    TallyStyle.art => const SizedBox.shrink(),
  };

  Widget _pips() => Row(
    children: [
      for (var i = 0; i < target; i++)
        Expanded(
          child: Container(
            height: 8,
            margin: EdgeInsets.only(right: i == target - 1 ? 0 : 4),
            decoration: BoxDecoration(
              color: i < score
                  ? (skin == ScoreboardSkin.colors
                        ? AppColors.gold
                        : skin.accent(team))
                  : skin.text.withValues(alpha: 0.18),
              borderRadius: BorderRadius.circular(4),
            ),
          ),
        ),
    ],
  );

  /// A row of holes; a scored tento has a peg in its hole.
  Widget _holes() => LayoutBuilder(
    builder: (context, c) {
      final size = math.min(24.0, c.maxWidth / target - 6);
      return Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          for (var i = 0; i < target; i++)
            SizedBox.square(
              dimension: size,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Container(
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: RadialGradient(
                        center: Alignment(-0.3, -0.4),
                        colors: [Color(0xFF1E1008), Color(0xFF4A2C14)],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Color(0x66FFE2B0),
                          offset: Offset(0, 1),
                        ),
                      ],
                    ),
                  ),
                  if (i < score)
                    FractionallySizedBox(
                      widthFactor: 0.72,
                      heightFactor: 0.72,
                      child: Container(
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            center: const Alignment(-0.35, -0.4),
                            colors: [
                              Color.lerp(
                                skin.accent(team),
                                Colors.white,
                                0.45,
                              )!,
                              skin.accent(team),
                            ],
                          ),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x88000000),
                              blurRadius: 2,
                              offset: Offset(0, 1.5),
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
            ),
        ],
      );
    },
  );

  /// Matchsticks in groups of three; missing ones are faint outlines.
  Widget _matches() => SizedBox(
    height: 34,
    child: Row(
      children: [
        for (var i = 0; i < target; i++) ...[
          Expanded(
            child: Center(child: _Match(lit: i < score)),
          ),
          if (i % 3 == 2 && i != target - 1) const SizedBox(width: 10),
        ],
      ],
    ),
  );
}

class _Match extends StatelessWidget {
  const _Match({required this.lit});

  final bool lit;

  @override
  Widget build(BuildContext context) => Opacity(
    opacity: lit ? 1 : 0.14,
    child: Column(
      children: [
        Container(
          width: 7,
          height: 9,
          decoration: BoxDecoration(
            color: lit ? const Color(0xFFC0392B) : Colors.white,
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        Expanded(
          child: Container(
            width: 3.5,
            decoration: BoxDecoration(
              color: lit ? const Color(0xFFE6C89B) : Colors.white,
              borderRadius: const BorderRadius.vertical(
                bottom: Radius.circular(1),
              ),
            ),
          ),
        ),
      ],
    ),
  );
}

/// Lets the player choose the scoreboard look.
Future<void> pickScoreboardSkin(BuildContext context, WidgetRef ref) async {
  final current = ref.read(scoreboardSkinProvider);
  final picked = await showAppDialog<ScoreboardSkin>(
    context,
    title: 'Visual do placar',
    message: 'Escolha como o marcador aparece na mesa.',
    actions: [
      for (final s in ScoreboardSkin.values)
        AppDialogAction(
          label: s == current ? '✓ ${s.label}' : s.label,
          value: s,
          isPrimary: s == current,
        ),
    ],
  );
  if (picked != null && picked != ScoreboardSkin.felt) {
    final allowed = (await ref.read(entitlementsProvider.future))
        .canChooseScoreboardLook;
    if (!allowed) {
      if (context.mounted) {
        await showPremiumRequired(context, 'Escolher o visual do placar');
      }
      return;
    }
  }
  if (picked != null) {
    await ref.read(scoreboardSkinProvider.notifier).choose(picked);
  }
}

/// App bar button that opens [pickScoreboardSkin].
class ScoreboardSkinButton extends ConsumerWidget {
  const ScoreboardSkinButton({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) => IconButton(
    tooltip: 'Visual do placar',
    color: Colors.white,
    icon: Icon(context.icon(AppIcon.palette)),
    onPressed: () => pickScoreboardSkin(context, ref),
  );
}
