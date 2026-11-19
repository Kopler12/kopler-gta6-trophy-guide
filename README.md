[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Kopler12/kopler-gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Kopler12/kopler-gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Platinum — GTA VI Trophy Guide & Tracker

The complete offline guide and tracker for the 55 PlayStation 5 trophies of
Grand Theft Auto VI: 1 platinum, 2 gold, 6 silver, 46 bronze (28 hidden on
PlayStation until earned). Every trophy carries its official name, description
and grade, plus a guide written in our own words with its sources cited beside
it — what to do, where and how, and when it can be missed.

## Features

- **Checklist tracker** — tick trophies off as you earn them; progress is saved
  in `localStorage`, with a progress bar and counts by grade.
- **Export / import** — save your progress to a JSON file and import it back.
- **Filters** — by kind (story, missable, collectibles, activities, exploration,
  combat, misc), by grade, by earned/unearned, plus text search.
- **Spoiler setting** — hides the names and descriptions of story trophies
  until they are earned (persisted).
- **Roadmap to the Platinum** — seven ordered stages built from the official
  descriptions: story, the one possibly-missable trophy, side characters,
  collectibles, activities, robberies, then cleanup and 100% completion.
- **Missables view** — the one possibly-missable trophy (Positive Mental
  Attitude, flagged by the launch guides) plus every story-locked trophy,
  with the no-mission-replay warning and the manual-save-per-chapter rule.
- **Deep-linkable views** — `?view=roadmap`, `?view=missables`,
  `?trophy=<id>` opens that trophy's guide panel. For screenshots, the
  screenshot script seeds `localStorage` with 14 earned trophies; see
  `shots.json` for the notes on each view.
- **Fully offline** — static files only, no external fonts, libraries or
  requests. The look is original (Vice City neon-sunset palette, CSS sun and
  SVG palm silhouettes drawn for this entry). No Rockstar logo or artwork.

## How to run

```sh
node serve.ts
```

Then open `http://localhost:8080` in desktop Chrome. Turn the network off —
the guide keeps working.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored make.fun library.

## Sources

Trophy names, descriptions and grades follow the official list as reported by
Exophase and PSNProfiles (cross-checked 2026-11-18). Guides cite Push Square,
Planet GTA 6, Output Lag, Playday One and eGamers beside each trophy; where a
step follows only from the official description, the guide says so. Guide text
is written in our own words — sources are cited, never copied.

## License

MIT — see `LICENSE`.
