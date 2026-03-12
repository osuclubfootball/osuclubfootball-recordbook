# CLAUDE.md — OSU Club Football Record Book

## Project Overview
A static multi-page website hosted on GitHub Pages that serves as the official record book for Ohio State Club Football. All data lives in a single `data.json` file; every page fetches it at runtime and renders content via vanilla JavaScript.

## Commands

```bash
# No build step — pure static HTML/CSS/JS
# Open locally by serving the directory:
npx serve .          # http://localhost:3000
# or
python -m http.server 8080  # http://localhost:8080
```

> **Important:** Pages must be served over HTTP (not opened as `file://`) because `fetch("data.json")` is blocked by CORS on `file://` in most browsers.

## Architecture

### Pages
| File | Purpose |
|---|---|
| `index.html` | Homepage — hero stats (championships, All-Americans, etc.) |
| `team-records.html` | Year-by-year results, points records, coach records |
| `game-by-game.html` | Full season-by-season game log in accordion layout |
| `record-vs-opponents.html` | All-time W/L record vs. each opponent, with search |
| `awards.html` | NCFA national awards |
| `all-americans.html` | All-American teams + academic All-Americans + team captains |
| `stats.html` | Statistical leaders by category, with search |

### Data Flow
- All pages `fetch("data.json")` on load
- `script.js` also loads data into `window.__osuClubFootballData` (currently unused by pages — each page fetches independently)
- `script.js` adds a minimize button to the site header on every page

### Shared Utilities (duplicated per page)
- `safe(v)` — null-safe string coercion
- `filterable(root, input)` — filters `[data-search]` elements by input value
- `makeListItem(item)` — renders a ranked list item with optional marker tag

## Known Bugs

### 1. `index.html` — Orphaned `</main>` (no opening tag)
**Line 42:** `</main>` appears with no corresponding `<main>` opening tag. The stats hero section is never wrapped in `<main>`, which is invalid HTML and may affect screen readers and browser rendering.
```html
<!-- Missing: <main> before <section class="stats-hero"> -->
<section class="stats-hero"> ... </section>
</main>  <!-- orphaned -->
```

### 2. `game-by-game.html` — Home game separator logic bug
**Line 66:** Home games display `@` instead of `vs.`
```js
// Bug: both away AND home use "@"
const sep = site === "neutral" ? "vs." : (site === "away" ? "@" : "@");
// Fix:
const sep = site === "neutral" ? "vs." : (site === "away" ? "@" : "vs.");
```

### 3. `script.js` — `response.ok` not checked before `.json()`
**Line 5:** If `data.json` returns a non-200 (e.g., 404), the code tries to parse the error HTML as JSON, producing a confusing parse error instead of a clear "not found" message.
```js
// Bug:
const response = await fetch("data.json");
const data = await response.json();  // explodes on 404

// Fix: add before .json()
if (!response.ok) throw new Error(`data.json not found (${response.status})`);
```

### 4. `all-americans.html` / `awards.html` — `filterable` defined but never called
Both pages define the `filterable` helper at the top of their script blocks but never wire it to a search input (neither page has a search box). Dead code — can be removed or a search input added.

### 5. `script.js` — `window.__osuClubFootballData` is never consumed
`loadRecords()` fetches data and stores it globally, but every page independently re-fetches `data.json`. Either pages should use the shared data or `script.js` should be removed from pages that don't need it.

## Data Structure (`data.json`)
Top-level keys:
- `team_records` — `year_by_year[]`, `points_game[]`, `points_season[]`, `points_per_game_season[]`, `coach_records[]`
- `game_by_game[]` — array of seasons, each with `season_header` and `games[]`
- `record_vs_opponents` — `rows[]` with `opponent`, `won`, `lost`, `first_meeting`, `last_meeting`
- `awards[]` — `title`, `role`, `person`, `narrative`
- `all_americans` — `first_team{}`, `second_team{}`, `honorable_mention{}` (keyed by year)
- `academic_all_americans{}` — keyed by year
- `team_captains{}` — keyed by year
- `stats{}` — nested by category → subcategory → ranked items

## Deployment
- Hosted on GitHub Pages from the `main` branch root
- URL: `https://osuclubfootball.github.io/osuclubfootball-recordbook/`
- No CI/CD — push to `main` deploys automatically via GitHub Pages
