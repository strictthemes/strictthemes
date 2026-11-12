---
page: fixtures and results page
title: Fixtures
description: a club's fixtures and results, with a control to choose the team, rows grouped by month that show a date, an opponent, a venue and a score or a kick-off time, the team's record, and one Live or Final badge.
order: 2
checks:
  - "The team control is a group of three buttons with `aria-pressed`, and choosing one changes the months, the rows, the count and the record, and a `role=status` element says the new counts."
  - "Every row shows its date in a `<time>`, the opponent, home or away, the venue, and either a score with Won, Drew or Lost or a kick-off time, the score or the time set in the heading font."
  - "Each team's view has exactly one badge, Final on the latest result of the first team and of the under 18s and Live on the reserves' match being played."
  - "The next match of the chosen team is the one row filled with ice blue, with navy text, no muted text and nothing that takes focus."
  - "The first team's record reads 14 played, 8 won, 3 drawn, 3 lost, 30 goals for and 19 against, counted in code from its rows."
---

Sample content, if the user gave none: "Wendmoor Football Club" and the matches of its three teams, as they stand at 20:05 on Tuesday 8 June 2027. A score in these lists puts Wendmoor FC's goals first, whoever was at home. A home match is at Millrace Park; an away match is at the opponent's ground, from the Clubs note.

The first team, in the Kestrel Valley League, Division One, every kick-off at 15:00 (date, opponent, home or away, result):

- March 2027: `SAT 6 MAR`, Kirkfen Rangers, away, 1–1. `SAT 13 MAR`, Tarrowby United, home, 1–0. `SAT 20 MAR`, Otterby Town, away, 0–3. `SAT 27 MAR`, Castlebrook United, home, 4–2.
- April 2027: `SAT 3 APR`, Stenwick Albion, away, 3–2. `SAT 10 APR`, Sedgeholme, home, 2–4. `SAT 17 APR`, Dunmarsh Athletic, away, 2–2. `SAT 24 APR`, Eastlow Wanderers, home, 3–0.
- May 2027: `SAT 1 MAY`, Hollinvale, away, 1–1. `SAT 8 MAY`, Lowmere Welfare, home, 2–0. `SAT 15 MAY`, Pellow Green, away, 1–3. `SAT 22 MAY`, Kirkfen Rangers, home, 2–0. `SAT 29 MAY`, Tarrowby United, away, 5–0.
- June 2027: `SAT 5 JUN`, Otterby Town, home, 3–1, the latest result. `SAT 12 JUN`, Castlebrook United, away, the next match. `SAT 19 JUN`, Stenwick Albion, home. `SAT 26 JUN`, Sedgeholme, away.
- July 2027: `SAT 3 JUL`, Dunmarsh Athletic, home. `SAT 10 JUL`, Eastlow Wanderers, away. `SAT 17 JUL`, Hollinvale, home. `SAT 24 JUL`, Lowmere Welfare, away. `SAT 31 JUL`, Pellow Green, home.

The reserves, on Tuesday evenings, every kick-off at 19:30; each opponent's name ends in "Reserves":

- May 2027: `TUE 18 MAY`, Stenwick Albion Reserves, away, 2–2. `TUE 25 MAY`, Lowmere Welfare Reserves, home, 3–1.
- June 2027: `TUE 1 JUN`, Dunmarsh Athletic Reserves, away, 0–2. `TUE 8 JUN`, Sedgeholme Reserves, home, being played: 1–0 after 35 minutes. `TUE 15 JUN`, Castlebrook United Reserves, away, the next match. `TUE 22 JUN`, Pellow Green Reserves, home. `TUE 29 JUN`, Kirkfen Rangers Reserves, away.
- July 2027: `TUE 6 JUL`, Otterby Town Reserves, home.

The under 18s, on Sundays, every kick-off at 10:30 but the cup final's; each opponent's name ends in "U18":

- May 2027: `SUN 23 MAY`, Castlebrook United U18, home, 1–1. `SUN 30 MAY`, Pellow Green U18, away, 2–1, in the County Youth Cup semi-final.
- June 2027: `SUN 6 JUN`, Kirkfen Rangers U18, home, 4–0, the latest result. `SUN 13 JUN`, Stenwick Albion U18, away, the next match. `SUN 20 JUN`, Otterby Town U18, home. `SUN 27 JUN`, Dunmarsh Athletic U18, on neutral ground at Castle Meadow, kick-off 14:00, the County Youth Cup final.

This page uses the stock `button`; add it with `npx shadcn@latest add button` if the project lacks it.

Build these parts in order. The container inside `<main>` has one item: a `<div>` with `flex flex-col gap-8` that holds parts 2, 3 and 4.

### 1. Header

The header from the layout notes. The current page is Fixtures.

### 2. Page head

The label `2027 SEASON`, then the `<h1>` "Fixtures and results". On the right, the amber link "Join the club".

### 3. Team control

A row with `flex flex-wrap items-center justify-between gap-3`:

- A button group with the `aria-label` "Team" and three buttons: "First team", chosen at the start, "Reserves" and "Under 18s".
- The count, a label in `text-muted-foreground`: `22 MATCHES · 14 PLAYED · 8 TO COME` for the first team, `8 MATCHES · 3 PLAYED · 1 LIVE · 4 TO COME` for the reserves, `6 MATCHES · 3 PLAYED · 3 TO COME` for the under 18s. The part about a live match shows only while the team has one.

Right after the row, the status element from the Announcements note, empty at the start.

### 4. Matches and record

A grid row with two items.

**Matches,** eight columns from `lg` up: a `<div>` with `flex flex-col gap-8` holding one `<section>` for each month in which the chosen team has a match, in order of the calendar, the earliest first. Each `<section>` is named by its `<h2>`, the month and the year ("March 2027"), and is `flex flex-col gap-3`: the `<h2>`, then a card with rows, a `<ul>` with one `<li>` for each match, in order of date.

A row is `flex items-center justify-between gap-5` with the row padding of the Cards with rows note, and has two sides:

- **The left side,** `flex min-w-0 items-center gap-3`: the opponent's crest, `size-8`, shown from `md` up only (`hidden md:flex`); then a stack with `flex min-w-0 flex-col gap-1`. The stack's first line is `flex flex-wrap gap-x-3 gap-y-1`, its parts separate labels with no ` · ` between them: the date in a `<time>` (`SAT 5 JUN`, `dateTime="2027-06-05"`), then `HOME`, `AWAY` or `NEUTRAL`, then the venue (`MILLRACE PARK`), then, for a cup match, the round (`COUNTY YOUTH CUP SEMI-FINAL`, `COUNTY YOUTH CUP FINAL`). The stack's second line is the opponent's name in a `<p>` with `font-heading text-body font-bold uppercase`.
- **The right side,** `flex shrink-0 flex-col items-end gap-1`: a row with `flex items-center gap-3` that holds the badge, on the one match that has it, and the figure in `text-h2`; under it one label.
  - A match that was played: the figure is the score, `3–1`, and the label is `WON`, `DREW` or `LOST`, worked out in code from the score.
  - A match to come: the figure is the kick-off time, `15:00`, in a `<time>` with `dateTime="2027-06-12T15:00"`, and the label is `KICK-OFF`.
  - The match being played: the figure is the score so far, `1–0`, the badge says "Live", and the label is the minute, `35'`.

Three rows differ from the rest:

- **The latest result** of the first team and of the under 18s has the badge "Final" before its score. The reserves' view has no "Final": its one badge is "Live". So each view has exactly one badge.
- **The first team's latest result,** on 5 June, also ends its first line with a label link, "Match report", to `/report`. No other row has a link.
- **The next match** of the chosen team is a marked row: its `<li>` adds `bg-ice text-ice-foreground`, its labels inherit the navy in place of the muted color, and its crest is the one for ice from the Crests note.

**Record and match days,** four columns from `lg` up: a `<div>` with `flex flex-col gap-5` and two items.

- **Record,** a card, a `<section>` named by its `<h2>`. Its heading row is `flex flex-wrap items-baseline justify-between gap-3`: the `<h2>` "Record" and the chosen team as a label (`FIRST TEAM`, `RESERVES`, `UNDER 18S`). Then a `<dl>` with `grid grid-cols-3 gap-5` of six figures in `text-h1`, each above its label as the Scores and times note sets a pair: "Played", "Won", "Drawn", "Lost", "Goals for" and "Goals against". They are counted in code from the chosen team's rows that have a final score: `14`, `8`, `3`, `3`, `30`, `19` for the first team; `3`, `1`, `1`, `1`, `5`, `5` for the reserves; `3`, `2`, `1`, `0`, `7`, `2` for the under 18s. Last, one line of small print: "Scores show Wendmoor FC's goals first. A match being played is not counted."
- **Match days,** an ice panel, a `<section>` named by its `<h2>` "Match days" in `text-h2`. Then a `<dl>` as the Description lists note sets it on ice, each row `flex items-baseline justify-between gap-3`, the `<dt>` a label and the `<dd>` in `text-right text-body`: "Adults", `£4`; "Under 16s", "Free"; "Gates open", "One hour before kick-off"; "Ground", "Millrace Park, Mill Lane". Then a `<p>` in `text-body`: "The tea bar takes cash and cards. At away matches the home club sets the price." Nothing on the panel has a text color class.

### 5. Footer

The footer from the layout notes.

### Behavior

- All of it works on the sample data in component state.
- Choosing a team shows that team's months and rows, its count and its record. The chosen button's `aria-pressed` and variant follow the choice, and focus stays on the button. A month with no match for the team is left out.
- After each choice the status element says the team and its count in a sentence: "First team: 22 matches, 14 played, 8 to come.", "Reserves: 8 matches, 3 played, 1 live, 4 to come.", "Under 18s: 6 matches, 3 played, 3 to come."
- The match being played does not change on its own: the score stays 1–0 and the minute stays `35'`.
- The links need no behavior beyond their `href`.
