#!/usr/bin/env bash
# bump-cache.sh — Update all ?v= cache-buster strings in index.html
# Run before committing to ensure browsers fetch fresh assets.
# Usage: bash scripts/bump-cache.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
INDEX="$ROOT_DIR/index.html"

if [ ! -f "$INDEX" ]; then
    echo "Error: index.html not found at $INDEX"
    exit 1
fi

# Generate version string: YYYYMMDD + a-z suffix based on hour
VERSION="$(date +%Y%m%d)a"

echo "Bumping cache busters in index.html to v=$VERSION ..."

# Replace all ?v=XXXXXXXXX patterns (alphanumeric version strings)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS sed requires '' after -i
    sed -i '' "s/\?v=[a-zA-Z0-9_.-]\{1,\}/?v=$VERSION/g" "$INDEX"
else
    sed -i "s/\?v=[a-zA-Z0-9_.-]\{1,\}/?v=$VERSION/g" "$INDEX"
fi

# Count how many were updated
COUNT=$(grep -c "?v=$VERSION" "$INDEX" || true)
echo "Updated $COUNT cache-buster strings to ?v=$VERSION"
