#!/usr/bin/env bash
# Wraps src/game.html (an artifact-style page fragment) into a standalone index.html.
set -euo pipefail
cd "$(dirname "$0")"
{
  printf '%s\n' '<!doctype html>' '<html lang="en">' '<head>' \
    '<meta charset="utf-8">' \
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">' \
    '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>' \
    '</head>' '<body>'
  cat src/game.html
  printf '%s\n' '</body>' '</html>'
} > index.html
echo "Built index.html"
