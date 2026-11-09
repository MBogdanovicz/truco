import 'package:flutter_test/flutter_test.dart';
import 'package:truco/domain/scorekeeper/match_engine.dart';
import 'package:truco/domain/scorekeeper/match_record.dart';
import 'package:truco/domain/scorekeeper/match_state.dart';
import 'package:truco/domain/scorekeeper/score_event.dart';
import 'package:truco/domain/scorekeeper/scoring_rules.dart';
import 'package:truco/domain/scorekeeper/team.dart';

void main() {
  final t0 = DateTime.utc(2026, 1, 1, 20);
  const seats = {0: Team.a, 1: Team.b, 2: Team.a, 3: Team.b};

  MatchEngine engine({ScoringRules rules = ScoringRules.standard, bool any = false}) =>
      MatchEngine(rules: rules, seatTeams: seats, anySeatMarksAnyTeam: any);

  AddPointsIntent add(Team team, int delta, {int? seat}) => AddPointsIntent(
      team: team, delta: delta, authorSeat: seat ?? (team == Team.a ? 0 : 1));

  test('adds points and derives the score', () {
    final e = engine();
    e.apply(add(Team.a, 3), t0);
    e.apply(add(Team.b, 1), t0);
    expect(e.state.scoreOf(Team.a), 3);
    expect(e.state.scoreOf(Team.b), 1);
    expect(e.state.events.map((e) => e.seq), [1, 2]);
  });

  test('rejects marking the other team', () {
    final r = engine().apply(add(Team.b, 1, seat: 0), t0);
    expect((r as IntentRejected).reason, IntentRejection.notYourTeam);
  });

  test('single-device mode lets one seat mark both teams', () {
    final e = engine(any: true);
    expect(e.apply(add(Team.b, 1, seat: 0), t0), isA<IntentAccepted>());
  });

  test('rejects values outside the allowed deltas', () {
    final r = engine().apply(add(Team.a, 2), t0);
    expect((r as IntentRejected).reason, IntentRejection.invalidDelta);
  });

  test('cooldown blocks the partner within the window', () {
    final e = engine();
    e.apply(add(Team.a, 1, seat: 0), t0);
    final r = e.apply(add(Team.a, 1, seat: 2), t0.add(const Duration(seconds: 5)));
    expect((r as IntentRejected).reason, IntentRejection.cooldown);
    expect(r.retryAfter, const Duration(seconds: 10));
    // The other team is not affected.
    expect(e.apply(add(Team.b, 1), t0.add(const Duration(seconds: 5))),
        isA<IntentAccepted>());
    // After the window, the team can score again.
    expect(e.apply(add(Team.a, 1, seat: 2), t0.add(const Duration(seconds: 15))),
        isA<IntentAccepted>());
  });

  test('cooldown can be disabled', () {
    final e = engine(rules: const ScoringRules(teamScoreCooldown: Duration.zero));
    e.apply(add(Team.a, 1), t0);
    expect(e.apply(add(Team.a, 1), t0), isA<IntentAccepted>());
  });

  test('undo reverts the last active score and releases the cooldown', () {
    final e = engine();
    e.apply(add(Team.a, 3), t0);
    final t1 = t0.add(const Duration(seconds: 20));
    e.apply(add(Team.a, 6), t1);
    final r = e.apply(const UndoIntent(team: Team.a, authorSeat: 2), t1);
    expect(r, isA<IntentAccepted>());
    expect((r as IntentAccepted).event.undoesSeq, 2);
    expect(e.state.scoreOf(Team.a), 3);
    // Cooldown now refers to the first score, which is old enough.
    expect(e.apply(add(Team.a, 1), t1), isA<IntentAccepted>());
  });

  test('undo with nothing to undo is rejected', () {
    final r = engine().apply(const UndoIntent(team: Team.a, authorSeat: 0), t0);
    expect((r as IntentRejected).reason, IntentRejection.nothingToUndo);
  });

  test('score is capped at the target and finishes the game', () {
    final e = engine(rules: const ScoringRules(teamScoreCooldown: Duration.zero));
    e.apply(add(Team.a, 9), t0);
    e.apply(add(Team.a, 6), t0);
    expect(e.state.scoreOf(Team.a), 12);
    expect(e.state.winner, Team.a);
    final r = e.apply(add(Team.b, 1), t0);
    expect((r as IntentRejected).reason, IntentRejection.matchFinished);
  });

  test('undo after the end reopens the game', () {
    final e = engine(rules: const ScoringRules(teamScoreCooldown: Duration.zero));
    e.apply(add(Team.a, 12), t0);
    e.apply(const UndoIntent(team: Team.a, authorSeat: 0), t0);
    expect(e.state.isFinished, isFalse);
  });

  test('hand of eleven and iron hand cues', () {
    final e = engine(rules: const ScoringRules(teamScoreCooldown: Duration.zero));
    for (var i = 0; i < 11; i++) {
      e.apply(add(Team.a, 1), t0);
    }
    expect(e.state.isHandOfEleven, isTrue);
    expect(e.state.isIronHand, isFalse);
    e.apply(add(Team.b, 9), t0);
    e.apply(add(Team.b, 1), t0);
    e.apply(add(Team.b, 1), t0);
    expect(e.state.isHandOfEleven, isFalse);
    expect(e.state.isIronHand, isTrue);
  });

  test('event log survives a JSON round trip', () {
    final e = engine(rules: const ScoringRules(teamScoreCooldown: Duration.zero));
    e.apply(add(Team.a, 3), t0);
    e.apply(const UndoIntent(team: Team.a, authorSeat: 0), t0);
    e.apply(add(Team.b, 6), t0);
    final json = [for (final ev in e.state.events) ev.toJson()];
    final restored = MatchState.fromEvents([for (final j in json) ScoreEvent.fromJson(j)]);
    expect(restored.scoreOf(Team.a), 0);
    expect(restored.scoreOf(Team.b), 6);
  });

  test('series tally records wins', () {
    const s = SeriesTally(id: 'x');
    final s2 = s.recordWin(Team.a).recordWin(Team.b).recordWin(Team.a);
    expect(s2.winsOf(Team.a), 2);
    expect(s2.gamesPlayed, 3);
  });
}
