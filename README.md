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

## Project layout

| File | Purpose |
| --- | --- |
| `src/game.html` | The game source: one self-contained page fragment (HTML, CSS and JS). |
| `build.sh` | Wraps the source in a full HTML document and writes `index.html`. |
| `index.html` | The built, playable game. |

After editing `src/game.html`, run `./build.sh` and commit both files.
