#!/usr/bin/env bash
# Builds the PWA of the checked-out branch into app/build/web.
# Usage (from app/): build-pwa.sh <base-href> <channel: main|dev>
set -euo pipefail
base="$1"
channel="$2"
commit="$(git rev-parse --short=7 HEAD)"
label="$commit"
[ "$channel" = dev ] && label="beta $commit"

flutter pub get
# Full icon font: its URL never changes, so a cached copy from an older
# build must still have every icon.
flutter build web --release --no-web-resources-cdn --no-tree-shake-icons \
  --base-href "$base" \
  --dart-define-from-file=config/supabase.json \
  --dart-define=APP_COMMIT="$label"

cd build/web
# Version the entry scripts so browsers never mix cached builds.
v="$(git rev-parse --short=8 HEAD)"
sed -i "s|\"flutter_bootstrap.js\"|\"flutter_bootstrap.js?v=$v\"|" index.html
sed -i "s|\"main.dart.js\"|\"main.dart.js?v=$v\"|g" flutter_bootstrap.js
grep -q "flutter_bootstrap.js?v=$v" index.html
grep -q "main.dart.js?v=$v" flutter_bootstrap.js

if [ "$channel" = dev ]; then
  # A separate installable app on phones, clearly marked as beta.
  sed -i 's|"name": "Truco! Sofá de zona"|"name": "Truco! Beta"|; s|"short_name": "Truco!"|"short_name": "Truco β"|' manifest.json
  grep -q '"short_name": "Truco β"' manifest.json
  sed -i 's|<head>|<head>\n  <meta name="robots" content="noindex">|' index.html
fi
