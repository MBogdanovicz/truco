import 'package:flutter/widgets.dart';
import 'package:wakelock_plus/wakelock_plus.dart';

/// Keeps the display awake while [child] is on screen, so a scoreboard on the
/// table does not go dark (and the OS does not freeze the app) mid-game.
class KeepScreenOn extends StatefulWidget {
  const KeepScreenOn({super.key, required this.child});

  final Widget child;

  @override
  State<KeepScreenOn> createState() => _KeepScreenOnState();
}

class _KeepScreenOnState extends State<KeepScreenOn> {
  @override
  void initState() {
    super.initState();
    _set(true);
  }

  @override
  void dispose() {
    _set(false);
    super.dispose();
  }

  static Future<void> _set(bool on) async {
    try {
      await WakelockPlus.toggle(enable: on);
    } on Object {
      // Not supported here (tests, some browsers): nothing to do.
    }
  }

  @override
  Widget build(BuildContext context) => widget.child;
}
