#!/usr/bin/env bash
set -euo pipefail

SRC="$HOME/.openclaw/browser/chrome-extension"
DST="$(cd "$(dirname "$0")/.." && pwd)/src"

if [[ ! -d "$SRC" ]]; then
  echo "❌ missing source: $SRC"
  exit 1
fi

mkdir -p "$DST"
rsync -a --delete "$SRC/" "$DST/"

echo "✅ synced from $SRC to $DST"