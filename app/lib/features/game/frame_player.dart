import 'dart:async';
import 'dart:collection';

import '../../domain/game/table_view.dart';

/// Shows [TableView] frames one after the other, waiting each frame's
/// [TableView.delayMs] first, so people can follow the computer's moves.
/// [show] gets `busy: true` while more frames are queued.
class FramePlayer {
  FramePlayer(this.show);

  final void Function(TableView view, {bool busy}) show;
  final _queue = Queue<TableView>();
  Timer? _timer;

  /// Delays are multiplied by this (tests use 0).
  double speed = 1;

  bool get playing => _timer != null || _queue.isNotEmpty;

  void enqueue(Iterable<TableView> frames) {
    _queue.addAll(frames);
    if (_timer == null) _next();
  }

  /// Drops queued frames.
  void reset() {
    _timer?.cancel();
    _timer = null;
    _queue.clear();
  }

  void dispose() => reset();

  void _next() {
    if (_queue.isEmpty) {
      _timer = null;
      return;
    }
    final frame = _queue.first;
    final wait = Duration(milliseconds: (frame.delayMs * speed).round());
    void fire() {
      _queue.removeFirst();
      _timer = null;
      show(frame, busy: _queue.isNotEmpty);
      if (_queue.isNotEmpty) {
        _timer = Timer(Duration.zero, _next);
      }
    }

    if (wait == Duration.zero) {
      fire();
    } else {
      _timer = Timer(wait, fire);
    }
  }
}
