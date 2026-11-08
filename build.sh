#!/usr/bin/env bash
# Builds the installable web app from src/:
#   index.html         - src/game.html (an artifact-style page fragment) wrapped in a full HTML document,
#                        with the web app manifest, icons and service worker registration added
#   service-worker.js  - src/service-worker.js with a cache version stamped from this build's content
set -euo pipefail
cd "$(dirname "$0")"

{
  cat <<'HEAD'
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="A pass-and-play party word game. Everyone gets the secret word except the imposters, and there might be none at all.">
<meta name="theme-color" content="#1a0f2e">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Imposter">
<link rel="manifest" href="/manifest.json">
<link rel="icon" type="image/svg+xml" href="/icons/icon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
HEAD
  cat src/game.html
  cat <<'FOOT'
<script>
/* Register the service worker after the page has loaded, so it never competes with the first paint. */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/service-worker.js", { scope: "/" })
      .then(function (reg) {
        reg.update();
        console.info("Service worker registered for", reg.scope);
      })
      .catch(function (err) { console.warn("Service worker registration failed:", err); });
  });
}
</script>
</body>
</html>
FOOT
} > index.html

VERSION=$(cat index.html src/service-worker.js manifest.json | sha256sum | cut -c1-12)
sed "s/__BUILD__/${VERSION}/" src/service-worker.js > service-worker.js
echo "Built index.html and service-worker.js (cache version ${VERSION})"
