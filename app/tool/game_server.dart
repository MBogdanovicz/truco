// The game engine for the server (Supabase Edge Function "game").
//
// Compiled to JavaScript by tool/build_game_server.sh into
// supabase/functions/game/engine.js; it sets globalThis.trucoEngine, a
// function that takes and returns JSON text:
//
//   in:  {rules, seed, firstDealer, bots: [level|null x4], log,
//         act?: {seat, action}}            // action: {t, c?, x?, i?}
//   out: {log, frames: {"<seat>": [TableView json]}, phase, winner?,
//         scores: [a, b], hands: [{w?, p}], error?}
//
// Without "act" the computer plays until a person must act (game start).
import 'dart:convert';
import 'dart:js_interop';

import 'package:truco/domain/game/ai.dart';
import 'package:truco/domain/game/game_session.dart';
import 'package:truco/domain/game/rules.dart';
import 'package:truco/domain/game/truco_game.dart';
import 'package:truco/domain/scorekeeper/team.dart';

@JS('globalThis.trucoEngine')
external set trucoEngine(JSFunction f);

String run(String input) {
  final j = (jsonDecode(input) as Map).cast<String, Object?>();
  final session = GameSession(
    rules: TrucoRules.fromJson((j['rules']! as Map).cast<String, Object?>()),
    seed: j['seed']! as int,
    firstDealer: j['firstDealer']! as int,
    bots: [
      for (final b in j['bots']! as List)
        b == null ? null : AiLevel.values.byName(b as String),
    ],
    log: [
      for (final e in (j['log'] as List?) ?? const [])
        (e as Map).cast<String, Object?>(),
    ],
  );
  Map<int, List<Object?>> frames;
  String? error;
  final act = (j['act'] as Map?)?.cast<String, Object?>();
  try {
    final f = act == null
        ? session.advance()
        : session.actJson(
            act['seat']! as int,
            (act['action']! as Map).cast<String, Object?>(),
          );
    frames = {
      for (final e in f.entries) e.key: [for (final v in e.value) v.toJson()],
    };
  } on GameRuleError catch (e) {
    error = e.message;
    frames = const {};
  } on Object catch (e) {
    // A malformed action from the app (e.g. an unknown card).
    error = '$e';
    frames = const {};
  }
  final g = session.game;
  return jsonEncode({
    'log': session.log,
    'frames': {for (final e in frames.entries) '${e.key}': e.value},
    'phase': g.phase.name,
    if (g.winner != null) 'winner': g.winner!.name,
    'scores': [g.scores[Team.a], g.scores[Team.b]],
    'hands': [
      for (final e in g.events.whereType<HandEnded>())
        {if (e.winner != null) 'w': e.winner!.name, 'p': e.points},
    ],
    'error': ?error,
  });
}

void main() {
  trucoEngine = ((JSString s) => run(s.toDart).toJS).toJS;
}
