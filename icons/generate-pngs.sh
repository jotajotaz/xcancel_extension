#!/bin/bash
# Generates PNG icons from icon.svg
# Requires: brew install librsvg (for rsvg-convert)
# Or: brew install imagemagick (for convert)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SVG="$SCRIPT_DIR/icon.svg"

for size in 16 32 48 128; do
  if command -v rsvg-convert &> /dev/null; then
    rsvg-convert -w "$size" -h "$size" "$SVG" > "$SCRIPT_DIR/icon-${size}.png"
  elif command -v convert &> /dev/null; then
    convert -background none -resize "${size}x${size}" "$SVG" "$SCRIPT_DIR/icon-${size}.png"
  else
    echo "Install librsvg or imagemagick: brew install librsvg"
    exit 1
  fi
  echo "Created icon-${size}.png"
done
