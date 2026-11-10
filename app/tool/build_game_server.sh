#!/usr/bin/env bash
# Compiles the game engine to JavaScript for the "game" Edge Function.
# Run after changing anything in lib/domain/game, then commit engine.js.
set -euo pipefail
cd "$(dirname "$0")/.."
out=../supabase/functions/game/engine.js
dart compile js -O2 --no-source-maps -o "$out" tool/game_server.dart
rm -f "$out.deps"
echo "Wrote $out ($(wc -c < "$out") bytes)"
