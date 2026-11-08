# Imposter Party

A pass-and-play party word game for 3–20 players on one phone. Everyone gets a secret word except the imposters, who have to bluff. The twist: there might be one imposter, several, or none at all.

**Play:** open `index.html` in any modern browser. No install or server needed. You can also host it with GitHub Pages (Settings → Pages → deploy from the `main` branch, root folder).

## Features

- **Imposter modes:** Classic (exact count, 0 allowed), Maybe (1-in-4 chance of no imposter), and Mystery (anywhere from zero to everyone).
- **Secret twists:** Undercover, Split Room, The Jester, Accomplice and Detective.
- **House rule cards** that change how clues are given each round.
- **Starting player** is never an imposter and can skip a word they don't like before anyone else sees it.
- **870 word pairs in 31 categories**, from Food, Animals and Countries to Superpowers, History and Weird. Every word has a close decoy (Pancake / Waffle) for the Undercover and Split Room twists. Add your own words too.
- **Scoring** across rounds and a discussion timer.
- **Built-in user guide** with one screen per topic.
- Settings and scores are saved in the browser's local storage.

## Install as an app (Android, desktop Chrome/Edge)

The game is a Progressive Web App. Open the hosted site in Chrome on Android and tap **Install app** (or menu → *Add to Home screen*). Chrome builds a WebAPK, so it gets its own launcher icon, opens full screen without the browser bar, and works offline after the first visit.

Requirements for the install prompt: the site must be served over **HTTPS** at the domain root (the manifest's `start_url` and `scope` are `/`), which GitHub Pages with the custom domain in `CNAME` provides once *Enforce HTTPS* is on.

## Project layout

| File | Purpose |
| --- | --- |
| `src/game.html` | The game source: one self-contained page fragment (HTML, CSS and JS). |
| `src/service-worker.js` | Service worker source: precaches the app on install, serves it offline. |
| `build.sh` | Builds `index.html` (adds manifest link, icons and service worker registration) and `service-worker.js` (stamps a new cache version). |
| `index.html` | The built, playable game. |
| `service-worker.js` | The built service worker. |
| `manifest.json` | Web app manifest: name, colours, standalone display and icons. |
| `icons/` | App icons: SVG sources plus 192/512 "any" and "maskable" PNGs, Apple touch icon and favicon. |
| `tools/make-icons.js` | Regenerates the PNG icons from the SVGs (needs Playwright). |

After editing anything in `src/`, run `./build.sh` and commit the built files too. Each build gets a new cache version, so installed copies pick up the update on their next online launch.
