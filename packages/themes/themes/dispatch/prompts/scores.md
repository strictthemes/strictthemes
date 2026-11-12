---
page: sports results
title: Results
description: a sports results page, with today's scores, a league table, fixtures to come and a filter by competition.
order: 4
checks:
  - Every score, position, points total and kick-off time is set in the mono font with `tabular-nums`, and the numbers in the table are right-aligned.
  - Choosing a competition hides the results and fixtures of the others, and a competition with none today shows a sentence saying so.
  - The filter is a group of buttons with `aria-pressed`, and after each choice a `role="status"` element says how many results and fixtures are shown.
  - At 375px the league table scrolls sideways in its own box, which has the name "Coastal League table".
  - A match in progress shows the live marker with the word "Live" and the minute, and a finished one says "FT", "AET" or "PENS".
---

Sample content, if the user gave none: **The Port Avery Ledger**, the daily paper of Port Avery, an invented harbour city. The day is Wednesday 11 November 2026. Three competitions: the Coastal League (eight men's clubs: Port Avery Harriers, Saltgate United, Westmere Athletic, Dunmore City, Brackwater Town, Calloway Rovers, Fenwick Albion, Holm Bay), the County Cup, and the Women's Coastal League. Today: four Coastal League results, one still being played; two County Cup results between four clubs from outside the league, which you name, one won after extra time and one on penalties; no Women's Coastal League match. Invent the scores, the table as it stood before today (every club has played twelve games; P is W + D + L, PTS is 3 × W + D, and the goal differences add up to 0), and six fixtures over the next four days, Thursday 12 to Sunday 15 November: two County Cup on Thursday between four other clubs from outside the league, four Coastal League on Saturday and Sunday, so that no club plays two days running, and none in the Women's league. The filter buttons, the status text and the empty sentence use the short name "Women's League"; the results' competition `<h3>`s and the fixture label lines use the full names (`COASTAL LEAGUE`, `COUNTY CUP`).

Build these parts in order.

### 1. Header

The header from the layout notes, with the masthead name in `text-h2`. The current page is Results.

### 2. Page head

The first item of `<main>`: a stack with `gap-4`.

- A row styled as the section head, but with the name `SPORT` in a `<p>`, not an `<h2>`, since it comes before the `<h1>`.
- The `<h1>` `RESULTS`, `text-h1` below `md`, `text-display` from `md` up.
- A row with `flex flex-wrap items-center justify-between gap-4`: the date as a label in `text-muted-foreground` (`WEDNESDAY 11 NOVEMBER 2026`, a `<time>`), and the filter.
- The filter, the second item of that row: a button group with the `aria-label` "Competition", with All (chosen at the start), Coastal League, County Cup and Women's League. On a phone it wraps onto two lines.
- The status element from the Announcements note, right after the row, empty at the start.

### 3. Today's results

The next item of `<main>`: a `<section>` with the section head `TODAY'S RESULTS`. Under it, with `gap-4`, the results grouped by competition: for each competition that has results under the filter, an `<h3>` label in `font-mono text-label uppercase text-foreground` with the competition's name, and under it with `gap-2` a grid of score boxes, `grid gap-4 md:grid-cols-2 lg:grid-cols-3`. The groups are a stack with `gap-6`.

Each score box is an `<article>` with the `aria-label` of the match, home side first, ending with its state: "Port Avery Harriers 2, Saltgate United 1, full time"; "…, live, 67th minute"; "…, after extra time"; "Rookhaven 1, Elmsford 1, Rookhaven win 4–3 on penalties". It is a box from the layout notes, a stack with `gap-2`:

- A label line with `flex items-center justify-between gap-4`: the ground in `text-muted-foreground` (`HARBOUR ROAD`) at the left, and at the right the state: `FT` for a finished match, `AET` or `PENS` for one decided after extra time or on penalties, each in `text-foreground`; for a match being played, the live marker followed, `gap-2` after it, by the minute as a label in `text-primary` (`67'`).
- Two team rows, home first, each `flex items-baseline justify-between gap-4`: the club's name in `text-body`, and at the right its score as a big figure (`font-mono text-h2 tabular-nums`). In a finished match the winning side's name is `font-bold`, and under the rows of the penalty match only, since its score is level, a label line in `text-muted-foreground` says it in words (`ROOKHAVEN WIN 4–3 ON PENALTIES`). An extra-time win needs no words line: its score shows the winner. A draw and a match being played have neither the bold nor the line.
- Where a match has goals worth naming, a label line in `text-muted-foreground` with the scorers and minutes (`OKONJO 12', 58' · BRANDT 71'`).

When a competition has no result today and it is the one chosen, the section shows one sentence in `text-body` in place of the groups: "No Women's League matches today." With All chosen, competitions without results are left out.

### 4. Table and fixtures

The next item of `<main>`: a row of two columns with a rule between them, as the layout notes describe.

**League table,** `lg:col-span-8 min-w-0 lg:pr-6`: a `<section>`, a stack with `gap-4`: the section head `COASTAL LEAGUE TABLE`, and the `Table` (add it with `npx shadcn@latest add table`) with the `label` "Coastal League table" and `min-w-lg`, so it scrolls in its box on a phone. Columns: `POS`, `CLUB`, `P`, `W`, `D`, `L`, `GD`, `PTS`. Each short header holds an `<abbr>` with a `title` ("Position", "Played", "Won", "Drawn", "Lost", "Goal difference", "Points"). Every column but Club is a number, right-aligned with its header, except `POS`: here, instead of the Tables note, it is left-aligned with its header, so that it does not sit against the club name (positions are one digit, so they still line up). Goal difference has a sign (`+7`, `−3`, `0`). Points are `font-bold`. Eight rows. The row of Port Avery Harriers, the city's club, has the name in `font-bold` and no other mark. Under the table, with the section's `gap-4`, a label line in `text-muted-foreground`: `TOP TWO GO UP · AFTER 12 GAMES`. The filter does not change the table. While another competition is chosen, the label line under it adds ` · NOT FILTERED`.

**Fixtures,** `lg:col-span-4 lg:border-l lg:pl-6`: a `<section>` with the section head `FIXTURES`. Under it, with `gap-4`, the fixtures grouped by day: each day an `<h3>` label in `text-foreground` holding a `<time>` (`THU 12 NOV`), and under it with `gap-2` a list of fixtures divided by rules. The days are a stack with `gap-6`. Each fixture is a stack with `gap-1`: the two clubs in `text-body` ("Dunmore City v Fenwick Albion"), then a label line in `text-muted-foreground` with, here, the kick-off time as a `<time>` (`dateTime="2026-11-14T15:00"`), the competition and the ground (`15:00 · COASTAL LEAGUE · MILL LANE`, under `SAT 14 NOV`). A day with no fixture under the filter is left out, and with none at all the column shows "No fixtures in the next four days."

### 5. Footer

The footer from the layout notes.

### Behavior

- All of it works on the sample data in component state.
- Choosing a competition shows only its results and fixtures. The chosen button's `aria-pressed` and variant follow the choice. Focus stays on the button.
- After each choice, the status element names the button and the counts, a match being played included: "All: 6 results, 6 fixtures.", "County Cup: 2 results, 2 fixtures.", "Women's League: 0 results, 0 fixtures." One is "1 result", "1 fixture".
- The match being played does not change on its own: no timers.
