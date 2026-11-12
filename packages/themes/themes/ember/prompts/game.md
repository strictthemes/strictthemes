---
page: game home page
title: Game
description: the home page of a team arena game, with an opening that fills the first screen with the title and one action, the four classes, the current season, the latest news and the system requirements in a table.
order: 1
checks:
  - "The opening is at least as tall as the window, and the title ASHFALL is the page's only `text-display` text and its `<h1>`."
  - "Play free is the page's only default (red) button or link, and no text on the page is set in `text-primary` or in a heat color."
  - "Each class tile has a drawn picture with `role=img` and an `aria-label`, and its difficulty is written in words."
  - "The season meter has `role=meter` with its values, and the days of the season are written beside it."
  - "The system requirements are a table with real header cells, in a box that scrolls sideways at 375px while the page does not."
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-12"
    result: >-
      Second run of this page: the first, a trial build, led to corrections in this brief. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,781 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in dark mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: **Ashfall**, an invented free-to-play team arena game for PC by an invented studio, **Lowlight Games**. Two teams of five fight over a burning salt flat in rounds; the first team to win four rounds wins the match. Four classes: **Bulwark** (front line, difficulty low), **Cinderblade** (close damage, difficulty high), **Flarecaster** (ranged damage, difficulty medium) and **Mender** (support, difficulty medium). The modes are Ranked Clash, Quick Clash and, since patch 4.2, Duel Pits, a 2v2 mode. **Season 4: Dry Lightning** runs from Tuesday 6 October 2026 to Tuesday 12 January 2027, 98 days; by today, Thursday 12 November 2026, 37 of them have gone and 61 are left and it is week 6 of 14. It brought the map Glasswater Yard and a 60-tier season pass. Patch 4.2 came out on Tuesday 10 November 2026.

Build these parts in order.

### 1. Header

The header from the layout notes. "Game" is the current page.

### 2. Opening

The first `<section>`, which fills the first screen: a grid (`md:grid-cols-12`) with `content-center md:min-h-svh md:items-center`, so that from `md` up its content sits in the middle of a box at least as tall as the window. Below `md` the section is only as tall as its content, and the title starts right under the header.

- Columns 1–7: a label in `text-muted-foreground`, `Lowlight Games · 5v5 arena`; with `mt-2`, the `<h1>` "Ashfall" in `text-h1 md:text-display uppercase`; with `mt-6`, one sentence in `font-sans text-h2 font-normal`, within `max-w-xl`: "Two teams of five, one burning salt flat, first to four rounds." With `mt-6`, a row `flex flex-wrap items-center gap-6` holding the default-variant link "Play free" (to `#`), the page's one red action, and a label in `text-muted-foreground`: `PC · Free to play · Season 4`.
- Columns 8–12, with `mt-12 md:mt-0`: the key art, a picture that stands on the page (`relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted`) with the `aria-label` "A watchtower on a salt flat at dusk, a square sun above it and a line of fire on the horizon". Its shapes, each a `<div>` with `absolute`: the sun, `left-1/3 top-1/6 aspect-square w-1/3 bg-heat-high`; the ground, `inset-x-0 bottom-0 h-1/3 bg-heat-low`; the line of fire on the ground's top edge, `inset-x-0 bottom-1/3 h-2 bg-heat-mid`; the tower, standing on the ground, `bottom-1/3 left-1/6 h-1/2 w-1/12 bg-foreground`.

On a phone the text comes first and the key art under it.

### 3. Classes

The second `<section>`, with `mt-20`. An `<h2>` "Four classes" in `text-h2 md:text-h1 uppercase`, then with `mt-3` one sentence: every match lets a team take any mix of the four, and a player can switch between rounds.

With `mt-6`, a `<ul>` with `grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4`. Each `<li>` is a tile: `flex flex-col overflow-hidden rounded-xl border border-border bg-card`, holding an `<article>`:

- At the top, the class's emblem, a picture at the top of a tile (`aspect-video border-b border-border bg-muted flex items-center justify-center`) with the `aria-label` "Emblem of the" and the class's name. Inside it, one or two shapes, each a `<div>` with square corners:
  - Bulwark, a shield: `h-1/2 w-1/3 bg-heat-mid`.
  - Cinderblade, a blade: `h-2/3 w-1/12 bg-heat-high`.
  - Flarecaster, a flare: `aspect-square h-1/3 bg-heat-high`.
  - Mender, two lights: a row `flex h-1/3 gap-3` holding two `<div>`s, each `aspect-square h-full`, the first `bg-heat-mid`, the second `bg-heat-high`.
- Under it, the text part with `p-6`: a label in `text-muted-foreground`, the role (`Front line`, `Close damage`, `Ranged damage`, `Support`); with `mt-2`, the name as an `<h3>` in `text-h2`; with `mt-3`, two sentences on how the class plays; with `mt-3`, a label in `text-muted-foreground`: `Difficulty · Low` (`Low`, `High`, `Medium`, `Medium`, as the sample gives).

Below `md` the tiles stack; at `md` they sit two by two, from `lg` four in a row.

### 4. Current season

The third `<section>`, with `mt-20`, a grid (`md:grid-cols-12`):

- Columns 1–7: a label in `text-muted-foreground`, `Season 4 · 6 Oct – 12 Jan 2027`, the range as two `<time>` elements (`2026-10-06`, `2027-01-12`); with `mt-2`, the `<h2>` "Dry lightning" in `text-h2 md:text-h1 uppercase`; with `mt-3`, two paragraphs within `max-w-xl`, the second with `mt-3`: what the season brought (the map Glasswater Yard, a salt works where storms cut the light; a 60-tier season pass; ranks reset to Cinder at the start), and that patch 4.2 added Duel Pits. With `mt-6`, a secondary-variant link "See the ranking" to `/leaderboard`.
- Columns 9–12, with `mt-12 md:mt-0`: a card from the layout notes, `md:self-start`. A label `Season progress` with an `id` for the meter; with `mt-2`, a big figure `61` followed in the same `<p>` by a `<span>` label in `text-muted-foreground` with `ml-2`, `days left`; with `mt-6`, a meter from the layout notes: `aria-valuemin={0}`, `aria-valuemax={98}`, `aria-valuenow={37}`, `aria-valuetext="37 of 98 days gone"`, its fill `bg-heat-mid` at `37.8%`; with `mt-3`, a label in `text-muted-foreground`: `37 of 98 days gone · Week 6 of 14`.

### 5. Latest news

The fourth `<section>`, with `mt-20`. An `<h2>` "Latest news" in `text-h2 md:text-h1 uppercase`. With `mt-6`, a `<ul>` of four news items as a list of rows from the layout notes. Each row is an `<li>` holding an `<article>` that is a grid (`md:grid-cols-12`):

- Columns 1–2: the date, a `<p>` label in `text-muted-foreground` holding a `<time>`.
- Columns 3–12, with `mt-2 md:mt-0`: the title as an `<h3>` in `text-h2`, holding a title link from the layout notes; with `mt-3`, one sentence within `max-w-xl`.

The four items, newest first: `Tue 10 Nov`, "Patch 4.2: Duel Pits and a round of balance" (to `/patch`), which carries the page's one badge, "New": put the badge first in the text column, as a block on its own line (add `flex` to its classes; it keeps the stock `w-fit`), and give the `<h3>` `mt-2`; `Thu 5 Nov`, "The Ashfall Open: qualifiers start in December"; `Tue 20 Oct`, "Patch 4.1: matchmaking for groups of five"; `Tue 6 Oct`, "Season 4: Dry Lightning is live". The last three point to `#`.

### 6. System requirements

The fifth `<section>`, with `mt-20`. An `<h2>` "System specs" in `text-h2 md:text-h1 uppercase`, then with `mt-3` one sentence: Ashfall runs on PC and needs a connection for every match.

With `mt-6`, in columns 1–8 of a grid (`md:grid-cols-12`), with `min-w-0`, the `Table` from the layout notes with the `label` "System requirements" and `min-w-xl`. Columns: Part, Minimum, Recommended. The column headers are `<th scope="col">`. Each row's first cell is a `TableHead` with `scope="row"` and, in place of the header label classes, `py-2 font-sans text-body font-normal text-foreground`; like every cell it keeps `px-3` and `first:pl-0 last:pr-0`. Rows, written in words. Every cell here is a phrase, so every cell is body text in `font-sans`, and none takes the mono figure classes, not even "8 GB": System (64-bit Windows 10 · 64-bit Windows 11), Processor (4 cores at 3.0 GHz · 6 cores at 3.6 GHz), Memory (8 GB · 16 GB), Graphics (4 GB of video memory, DirectX 12 · 8 GB of video memory, DirectX 12), Storage (35 GB · 35 GB on an SSD), Network (Broadband · Broadband). These columns hold text, not numbers, so they stay left-aligned.

At 375px the table is wider than the screen and scrolls sideways in its own box; the page does not.

### 7. Footer

The footer from the layout notes.

### Behavior

- The page has no state but the small-screen menu's. "Play free" and the news links other than the patch point to `#`.
- The season meter and the days left are fixed sample figures: nothing reads the clock.
