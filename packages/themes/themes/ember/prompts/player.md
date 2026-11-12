---
page: player profile
title: Player
description: a player's profile in a team arena game, with a square mark with their initials, their rank and rating set large, the season's figures, meters for the classes they play and the season pass, their recent matches in a table and a few achievements.
order: 5
checks:
  - "The player's mark is a square with the initials JV and `rounded-md` corners, and the page has no circle but the 8px status dot beside the word Online."
  - "The global rank 18 is the page's only `text-display` text and is larger than the `<h1>`, and the page has one badge, Top 20."
  - "Each meter has `role=meter` with its values and a heat fill whose step matches its value, and its figure is written beside it."
  - "The recent matches table states every result as Win or Loss in words, gives rating changes with a plus or minus sign, and scrolls sideways in its own box at 375px."
  - "Play ranked is the page's only default (red) button or link, and no text is set in a heat color or in `text-primary`."
---

Sample content, if the user gave none: **Ashfall**, an invented free-to-play team arena game for PC by an invented studio, **Lowlight Games**. This is the profile of the viewer, **Juno Vane** (initials JV), who plays in Europe and mostly as Mender, and joined in March 2025. In **Season 4: Dry Lightning** (Ranked Clash): rating 2,418, tier Cinder, global rank 18, rank 6 in Europe, 383 matches, 212 wins, 171 losses, a win rate of 55.4%. Of the 383 matches, 234 were as Mender (61.1%), 92 as Flarecaster (24.0%), 42 as Bulwark (11.0%) and 15 as Cinderblade (3.9%). The season pass is at tier 14 of 60. Juno is online now; the last match ended at 09:40 today, Thursday 12 November 2026.

Build these parts in order.

### 1. Header

The header from the layout notes. "Profile" is the current page.

### 2. Player head

The first `<section>`, a grid (`md:grid-cols-12`):

- Columns 1–8: a row `flex items-start gap-6`. First the player's mark: a `<div>` with `aria-hidden="true"`, `flex size-20 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground md:size-32`, holding the initials `JV` in a `<span>` in `font-heading text-h1`. A square, never a circle. Then a `min-w-0` column: a label in `text-muted-foreground`, `Player · Europe · Mender`; with `mt-2`, the `<h1>` "Juno Vane" in `text-h1 uppercase` at every width, so the rank beside it stays the biggest thing on the page; with `mt-3`, a row `flex items-center gap-2` holding a status dot from the layout notes and a label in `text-foreground`, `Online`, then in a `<span>` in `text-muted-foreground`, ` · Last match ` and the time `09:40`, a `<time dateTime="2026-11-12T09:40">`; with `mt-2`, a label in `text-muted-foreground`: `Joined Mar 2025`, the date a `<time dateTime="2025-03">`.
- Under that row, still in columns 1–8, with `mt-6`, a row `flex flex-wrap items-center gap-6`: the default-variant link "Play ranked" (to `#`), the page's one red action, and a text link "See the ranking" to `/leaderboard`.
- Columns 9–12, with `mt-12 md:mt-0`: the rank. A label in `text-muted-foreground`, `Global rank`, with an `id`. With `mt-2`, a row `flex flex-wrap items-center gap-3`: the figure `18` as a `<p>` in `font-mono text-h1 md:text-display tabular-nums` (the page's one `text-display` text), with `aria-describedby` pointing to the label, and the page's one badge, "Top 20". With `mt-3`, a rank mark from the layout notes with its tier in `text-body`: `Cinder`; with `mt-2`, a label in `text-muted-foreground`: `Rank 6 in Europe`.

On a phone the mark stays `size-20` beside the name, and the rank follows under the action row.

### 3. Season figures

The second `<section>`, with `mt-20`. An `<h2>` "Season 4" in `text-h2 md:text-h1 uppercase`, then with `mt-3` one sentence: these are Ranked Clash figures since Tuesday 6 October. With `mt-6`, a `<dl>` with `grid grid-cols-2 gap-x-6 md:grid-cols-4`, four entries, each a `<div>` with `border-t border-border py-3`: the `<dt>` a label in `text-muted-foreground` (`Rating`, `Matches`, `Wins`, `Win rate`), the `<dd>` with `mt-2` a big figure in `font-mono text-h2 tabular-nums md:text-h1` (Martian Mono is wide: at `text-h1` five figures do not fit half a phone's width): `2,418`, `383`, `212`, `55.4%`.

### 4. Classes and season pass

The third `<section>`, with `mt-20`, a grid (`md:grid-cols-12`). The meters' fills take their step from their value: under 20% `bg-heat-low`, 20% to 49% `bg-heat-mid`, 50% and up `bg-heat-high`.

- Columns 1–7: an `<h2>` "Classes" in `text-h2 md:text-h1 uppercase`, then with `mt-3` one sentence: the share of this season's ranked matches played on each class. With `mt-6`, a `<ul>` of four classes as a list of rows from the layout notes, with `py-3` in place of `py-6`. Each row holds a row `flex flex-wrap items-baseline justify-between gap-x-3`: the class's name as an `<h3>` in `text-h2` with an `id`, and a label in `text-muted-foreground` with `tabular-nums`, `234 matches · 61.1%`; then with `mt-2` a meter from the layout notes, labelled by the `<h3>`, with `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-valuenow` the percentage, and `aria-valuetext` such as "61.1% of matches, 234 of 383". In order: Mender (`61.1%`, `bg-heat-high`), Flarecaster (`24.0%`, `bg-heat-mid`), Bulwark (`11.0%`, `bg-heat-low`), Cinderblade (`3.9%`, `bg-heat-low`).
- Columns 9–12, with `mt-12 md:mt-0`: a card from the layout notes, `md:self-start`. A label in `text-muted-foreground`, `Season pass`, with an `id`; with `mt-2`, a `<p>` holding the big figure `14` (`font-mono text-h1 tabular-nums`) and a `<span>` label in `text-muted-foreground` with `ml-2`, `of 60`; with `mt-6`, a meter labelled by `Season pass`, `aria-valuemin={0}`, `aria-valuemax={60}`, `aria-valuenow={14}`, `aria-valuetext="Tier 14 of 60"`, its fill `bg-heat-mid` at `23.3%`; with `mt-3`, a `<p>` in `text-body`: "46 tiers to go, and 61 days left in the season."

### 5. Recent matches

The fourth `<section>`, with `mt-20`. An `<h2>` "Recent matches" in `text-h2 md:text-h1 uppercase`, then with `mt-3` a label in `text-muted-foreground`: `Last 8 · 5 wins · 3 losses`.

With `mt-6`, the `Table` from the layout notes with the `label` "Recent matches" and `min-w-2xl`, so it scrolls in its box on a phone. The column headers are `<th scope="col">`. Columns: When, Mode, Class, Result, Rounds, K / D / A, Rating. When is a `<time>` in `font-mono tabular-nums`, written `Thu 12 Nov · 09:40` with the `dateTime` holding the date and time. Mode, Class and Result are words in `text-body`; Result says `Win` or `Loss` and carries no color. Rounds, K / D / A and Rating are numbers, right-aligned with their headers, in `font-mono tabular-nums`. The K / D / A header holds an `<abbr>` with the `title` "Kills, deaths and assists". A rating change has a sign (`+21`, `−17`); an unranked match has `—` and a visually hidden "No change: unranked". The eight rows, newest first:

| When | Mode | Class | Result | Rounds | K / D / A | Rating |
|---|---|---|---|---|---|---|
| Thu 12 Nov · 09:40 | Ranked Clash | Mender | Win | 4–2 | 7 / 3 / 18 | +21 |
| Thu 12 Nov · 09:05 | Ranked Clash | Mender | Loss | 3–4 | 5 / 6 / 14 | −17 |
| Wed 11 Nov · 21:30 | Ranked Clash | Flarecaster | Win | 4–1 | 12 / 4 / 6 | +19 |
| Wed 11 Nov · 20:50 | Duel Pits | Mender | Win | 3–2 | 6 / 5 / 9 | — |
| Tue 10 Nov · 22:10 | Ranked Clash | Mender | Win | 4–3 | 4 / 2 / 22 | +16 |
| Tue 10 Nov · 21:25 | Ranked Clash | Bulwark | Loss | 1–4 | 3 / 7 / 5 | −22 |
| Mon 9 Nov · 20:15 | Ranked Clash | Mender | Win | 4–0 | 8 / 1 / 16 | +24 |
| Mon 9 Nov · 19:30 | Quick Clash | Cinderblade | Loss | 2–4 | 6 / 8 / 3 | — |

### 6. Achievements

The fifth `<section>`, with `mt-20`. An `<h2>` "Achievements" in `text-h2 md:text-h1 uppercase`, then with `mt-3` a label in `text-muted-foreground`: `4 of 52 earned`.

With `mt-6`, a `<ul>` with `grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4`, four cards from the layout notes, each an `<li>` holding: a rank mark from the layout notes with the rarity in words in place of a tier, as a label in `text-muted-foreground` (`Legendary` with `bg-heat-high`, `Rare` with `bg-heat-mid`, `Common` with `bg-heat-low`); with `mt-2`, the name as an `<h3>` in `text-h2`; with `mt-3`, one sentence that says what it took; with `mt-3`, a label in `text-muted-foreground`: `Earned ` and the date, a `<time>`. The four, newest first:

- "Smoke and mirrors", Legendary: heal 500,000 health as Mender in one season. `Sun 8 Nov`.
- "Top twenty", Rare: reach the global top 20 in Ranked Clash. `Sat 7 Nov`.
- "Last wall", Rare: win a round as the last Bulwark standing. `Tue 20 Oct`.
- "First light", Common: win the first ranked match of a season. `Tue 6 Oct`.

### 7. Footer

The footer from the layout notes.

### Behavior

- The page has no state but the small-screen menu's. "Play ranked" points to `#`.
- Every figure is a fixed sample figure and agrees with the leaderboard: rating 2,418, global rank 18, rank 6 in Europe, 212 wins in 383 matches.
