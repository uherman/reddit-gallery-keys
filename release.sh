#!/usr/bin/env bash
# Build a Chrome Web Store upload zip from the current source tree.
# Reads the version from manifest.json and writes
#   reddit-gallery-keys-v<version>.zip
# in the project root.
set -euo pipefail

cd "$(dirname "$0")"

VERSION=$(grep -oP '"version"\s*:\s*"\K[^"]+' manifest.json)
if [[ -z "$VERSION" ]]; then
  echo "could not read version from manifest.json" >&2
  exit 1
fi

OUT="reddit-gallery-keys-v${VERSION}.zip"
rm -f "$OUT"

if command -v zip >/dev/null 2>&1; then
  zip -r "$OUT" manifest.json content.js icons/ >/dev/null
elif command -v 7z >/dev/null 2>&1; then
  7z a -tzip "$OUT" manifest.json content.js icons/ >/dev/null
else
  echo "neither zip nor 7z found" >&2
  exit 1
fi

echo "built $OUT"
ls -lh "$OUT"
