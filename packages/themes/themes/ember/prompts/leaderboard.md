---
page: leaderboard
title: Leaderboard
description: the season's ranking of a team arena game, with the viewer's place, a filter by region, a table of players with rank, tier, rating, wins and win rate in which the viewer's own row is marked with a heat bar, and a key to the tiers.
order: 3
checks:
  - "Choosing a region shows only its players, ranked again from 1 by rating, marks only the chosen button with `aria-pressed=true`, and the count line says how many players are shown."
  - "Ratings, wins and win rates are `font-mono tabular-nums` and right-aligned, with their column headers."
  - "The viewer's row (Juno Vane) has a `bg-heat-mid` bar at its left edge, the word You beside the name, and `aria-current=true`, and the bar is never the only sign."
  - "Every tier is a square rank mark followed by the tier's name in words, and no heat color is used for text."
  - "At 375px the table scrolls sideways in its own box with the name Ranking, and the page does not; the page has one badge, Rank 1, and no default (red) button."
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-12"
    result: >-
      A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 5,138 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: **Ashfall**, an invented free-to-play team arena game for PC by an invented studio, **Lowlight Games**. This is the Ranked Clash ladder of **Season 4: Dry Lightning**, in week 6 of 14, updated at 09:00 today, Thursday 12 November 2026. The viewer is **Juno Vane**, who plays in Europe: rating 2,418, 212 wins in 383 matches, global rank 18, rank 6 in Europe, tier Cinder. The ladder holds these nineteen players, in order of rating (region, rating, wins, matches, win rate):

| # | Player | Region | Rating | Wins | Matches | Win rate |
|---|---|---|---|---|---|---|
| 1 | Hollow Finch | Asia-Pacific | 2,961 | 301 | 490 | 61.4% |
| 2 | Red Static | Europe | 2,904 | 288 | 484 | 59.5% |
| 3 | Quiet Arson | Americas | 2,877 | 276 | 477 | 57.9% |
| 4 | Tin Saint | Asia-Pacific | 2,842 | 254 | 432 | 58.8% |
| 5 | Moss Cannon | Europe | 2,815 | 263 | 462 | 56.9% |
| 6 | Velvet Mortar | Americas | 2,790 | 241 | 421 | 57.2% |
| 7 | Dune Kestrel | Asia-Pacific | 2,761 | 230 | 406 | 56.7% |
| 8 | Ash Lantern | Europe | 2,733 | 247 | 440 | 56.1% |
| 9 | Pale Rook | Americas | 2,702 | 219 | 389 | 56.3% |
| 10 | Glass Hornet | Asia-Pacific | 2,676 | 226 | 407 | 55.5% |
| 11 | Iron Wren | Americas | 2,640 | 208 | 375 | 55.5% |
| 12 | Sour Comet | Europe | 2,611 | 215 | 393 | 54.7% |
| 13 | Brass Heron | Asia-Pacific | 2,583 | 198 | 364 | 54.4% |
| 14 | Cold Furnace | Americas | 2,547 | 201 | 373 | 53.9% |
| 15 | Night Tinder | Europe | 2,512 | 194 | 359 | 54.0% |
| 16 | Copper Wasp | Asia-Pacific | 2,486 | 187 | 350 | 53.4% |
| 17 | Grey Volley | Americas | 2,455 | 190 | 359 | 52.9% |
| 18 | Juno Vane | Europe | 2,418 | 212 | 383 | 55.4% |
| 19 | Static Moth | Europe | 2,390 | 176 | 336 | 52.4% |

Europe has seven players, the Americas six and Asia-Pacific six. Each player's tier follows from the rating, as the Rank marks note gives it: five Inferno, seven Blaze, seven Cinder.

Build these parts in order.

### 1. Header

The header from the layout notes. "Leaderboard" is the current page.

### 2. Page head

The first `<section>`, a grid (`md:grid-cols-12`):

- Columns 1–7: a label in `text-muted-foreground`, `Season 4 · Ranked Clash · Week 6`; with `mt-2`, the `<h1>` "Ranking" in `text-h1 md:text-display uppercase`; with `mt-6`, one paragraph within `max-w-xl`: the ladder ranks every player with at least 25 ranked matches this season by rating, and it is updated every hour. With `mt-3`, a label in `text-muted-foreground`: `Updated 09:00`, the time a `<time dateTime="2026-11-12T09:00">`.
- Columns 9–12, with `mt-12 md:mt-0`: a card from the layout notes, `md:self-start`, the viewer's place. A label in `text-muted-foreground`, `Your place`; with `mt-2`, the name "Juno Vane" as a `<p>` in `font-heading text-h2`. With `mt-3`, a `<dl>` of three rows, each a `<div>` with `flex items-baseline justify-between gap-3 border-t border-border py-2`: the `<dt>` a label in `text-muted-foreground` (`Global rank`, `Europe rank`, `Rating`) and the `<dd>` a big figure in `font-mono text-h2 tabular-nums` (`18`, `6`, `2,418`). The rows stack rather than sit side by side, because the card is narrow at `md`. With `mt-6`, a secondary-variant link "Your profile" to `/player`.

### 3. Filter

The second `<section>`, with `mt-20`. An `<h2>` "Top players" in `text-h2 md:text-h1 uppercase`. With `mt-6`, a button group with the `aria-label` "Region": Global, Europe, Americas, Asia-Pacific. "Global" is chosen at first. Under it, with `mt-3`, a count line, a `<p>` with `aria-live="polite"`: a label in `text-muted-foreground`, `Global · 19 players`, `Europe · 7 players`, `Americas · 6 players` or `Asia-Pacific · 6 players`.

### 4. Ranking table

In the same section, with `mt-6`, the `Table` from the layout notes with the `label` "Ranking" and `min-w-2xl`, so it scrolls in its box on a phone. In this table every cell keeps `px-3` and none gets `first:pl-0 last:pr-0`, so the viewer's bar has room at the left edge. The column headers are `<th scope="col">`. Columns:

1. `Rank`: the rank in the chosen list, `font-mono tabular-nums`, left-aligned with its header, so it sits next to the bar.
2. `Player`: the name in `text-body`. Juno Vane's name is a text link to `/player`; every other name is a text link to `#`. On the row ranked 1 in the chosen list, the page's one badge, "Rank 1", follows the name with `ml-2`: the name and the badge sit in a row `flex items-center gap-2` in place of the margin. On the viewer's row, the label `You` in `text-muted-foreground` follows the name in the same way.
3. `Tier`: a rank mark from the layout notes and the tier's name in `text-body`.
4. `Region`: in `text-body`, left-aligned.
5. `Rating`, 6. `Wins`, 7. `Win rate`: numbers, right-aligned with their headers, in `font-mono tabular-nums`. Win rate has one decimal and a `%`.

The viewer's row is marked with a heat bar at its left edge: its first cell is `relative`, and holds before the rank a `<span>` with `absolute inset-y-0 left-0 w-1 bg-heat-mid` and `aria-hidden="true"`. The row gets `aria-current="true"`. The bar, the word `You` and the link to the profile all mark it, so the bar is never the only sign. The row has no fill of its own.

When Americas or Asia-Pacific is chosen, the viewer is not in the list, and under the table, with `mt-3`, a `<p>` in `text-body` says so: "You play in Europe, so you are not in this list." With Global or Europe chosen it is not there.

### 5. Tiers

The third `<section>`, with `mt-20`. An `<h2>` "Tiers" in `text-h2 md:text-h1 uppercase`, then with `mt-3` one sentence: every rating starts the season at Cinder, and a tier is won and lost with the rating. With `mt-6`, a `<ul>` with `grid grid-cols-1 gap-6 md:grid-cols-3`, three entries, each an `<li>` with `border-t border-border pt-3`: a rank mark and the tier's name as a `<span>` in `font-heading text-h2`, in a row `flex items-center gap-2` (the mark keeps `size-3`); with `mt-2`, a label in `text-muted-foreground` with its range and its count on the ladder: `2,800 and up · 5 players`, `2,600 to 2,799 · 7 players`, `Under 2,600 · 7 players`.

### 6. Footer

The footer from the layout notes.

### Behavior

- Keep the nineteen players as an array, each with a name, a region, a rating, wins and matches. The win rate and the tier are worked out from them (win rate to one decimal); the rank is the position in the chosen list, sorted by rating, highest first. The chosen region is component state.
- Choosing a region shows only its players, ranked again from 1: in Europe, Red Static is 1 and Juno Vane is 6. With Global chosen, the ranks are the ones in the sample. The badge "Rank 1" moves to whoever is first in the shown list.
- Changing the region does not move focus and does not scroll the page. The count line announces the change.
- The tier counts are for the whole ladder and do not follow the filter.
- The page has no red action.
