---
page: film season page
title: Season
description: the page of a curated season of films at an independent cinema, with an introduction, the films in order with their dates and a note on each, and a season pass.
order: 3
checks:
  - The films are an `<ol>` in screening order, and each has a `<time>` with a full `dateTime`, a poster with `role="img"` and an `aria-label`, and a short note.
  - The season's title is the page's `<h1>` and its only `text-display` text, and the introduction's paragraphs are no wider than `max-w-xl`.
  - The season pass card states its price and what it includes in words, and its button is the page's only default (gold) action.
  - The cards on the page hold no poster or still, and no card sits inside another.
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Second run of this page. In the first build the gold link's label did not fit the narrow pass card from 768px, and the agent let it wrap; the brief now says so, and the shared notes give a poster in a row `self-start`. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,733 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 6 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems the earlier test builds reported. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,726 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode, and at 768px. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,765 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode, and at 768px. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: **The Vesper**, an independent cinema with three screens and a late bar at 21 Tallow Row, Oldmere. The season is "Ilse Varga: the night films", a retrospective of an invented Hungarian director, six of her films shot mostly after dark, shown on Friday 20 November, Friday 27 November, Tuesday 1 December, Friday 4 December, Friday 11 December and Friday 18 December 2026, all at 20:30 on Screen 2. The films: "Corridor Light" (1989, 94 min), "The Long Blue" (1998, 142 min), "Kestrel Street" (2003, 101 min), "Winter Switchboard" (2009, 117 min), "The Last Tram Home" (2014, 88 min) and "Small Fires" (2019, 109 min). The first four films are shown on 35mm prints; "The Last Tram Home" and "Small Fires" were shot on digital and are shown that way. The season is curated by Petra Lindqvist, the Vesper's programmer. A season pass costs £38 for all six films, £30 for members.

Build these parts in order.

### 1. Header

The header from the layout notes. "Seasons" is the current page.

### 2. Introduction

The first `<section>`, a grid (`md:grid-cols-12`):

- A `<div>` in `md:col-span-7` (columns 1–7): a label "Season · 20 Nov – 18 Dec 2026", in `text-muted-foreground`, built from two `<time>` elements; with `mt-2`, the `<h1>` "Ilse Varga: the night films" in `text-h1 md:text-display`; with `mt-6`, three paragraphs of introduction to read, each within `max-w-xl`, the second and third with `mt-4`. They say who Varga is, why these six films belong together (night, small rooms, people waiting for something), and how the season is shown (in order, the first four on 35mm prints, the last two digital); then, still in this `<div>`, with `mt-4`, a credits line from the layout notes, a `<p>` in `text-body text-muted-foreground`: "Curated by Petra Lindqvist" (not a label, so the name is not uppercased).
- The season pass card (part 4 below), with `mt-12 md:mt-0`, in `md:col-span-5` (columns 8–12) and from `lg` up in `lg:col-span-4 lg:col-start-9` (columns 9–12). From `md` up it stands beside the introduction, at the top of the row; below `md` it comes after the introduction. Give it `md:self-start`, so it keeps its own height.

### 3. The films

The second `<section>`, with `mt-24`. An `<h2>` "Six films, in order" in `text-h2 md:text-h1`, then with `mt-4` one sentence: "The six films run from Friday 20 November to Friday 18 December, and every screening starts at 20:30 on Screen 2." (The dates are not weekly: one of them is a Tuesday.)

With `mt-6`, an `<ol>` of the six films as a list of rows from the layout notes. Each `<li>` holds an `<article>` laid out as a row with a poster:

- The poster thumbnail, with the `aria-label` "Poster for" and the title, and the year inside it.
- The text column. First the date as a label line in `text-foreground`: the film's number and the date and time, e.g. `01 · Fri 20 Nov · 20:30`, the date and time in one `<time dateTime="2026-11-20T20:30">` with `tabular-nums`. Then, with `mt-2`, the title as an `<h3>` in `text-h2`; with `mt-2`, the credits line ("Ilse Varga · Hungary · 1998"); with `mt-2`, a label line in `text-muted-foreground` with the running time and the format: `142 min · 35mm print` for the first four films, `88 min · Digital` for the last two; with `mt-4`, the note: two or three sentences in running text, within `max-w-xl`, on what to watch for in this film and where it sits in her work.
- Last in the text column, a `<p>` with `mt-4` holding a text link "Film details" (to `#`: these films have no page yet).

From `md` up, the date comes first in the row, as the theme's listings do: add a column before the poster: a `<p>` label in `text-foreground` with `tabular-nums` and `hidden md:block md:w-32 md:shrink-0` (the `<p>` is the column, with no wrapper), holding the same date: one `<time dateTime="2026-11-20T20:30">` holding two `<span className="block">`, `Fri 20 Nov` and `20:30`, and from `md` up hide the date in the text column's label line, but not the film's number: put the separator and the `<time>` (` · Fri 20 Nov · 20:30`) in a `<span>` with `md:hidden`, so that the line reads `01` alone from `md` up. Only one of the two dates is shown at a time, and both are hidden with display classes, so a screen reader reads the date once.

On a phone the row is the poster at `w-24` with the text beside it.

### 4. Season pass card

A card from the layout notes, holding, in order:

- A label "Season pass".
- With `mt-2`, the price as a `<p>` in `font-heading text-h1 tabular-nums`: `£38`. With `mt-2`, a label in `text-muted-foreground`: `Six films · £30 for members`.
- With `mt-4`, a `<ul>` of what the pass includes, in words, `list-disc pl-4` in `text-body`, with `mt-2` on every item but the first: a seat at all six screenings, the same seat each night if you want it, a printed programme with an essay by Petra Lindqvist, and 10% off at the bar on season nights.
- With `mt-6`, the default-variant link "Buy a season pass" (to `#`), full width, `w-full whitespace-normal text-center`: the sample label fits on one line at every width, and these classes let a longer label from the user's content wrap instead of overflowing, since the stock button does not wrap its text. It is the page's one gold action.
- With `mt-4`, a `<p>` in `text-body text-muted-foreground`: single tickets go on sale two weeks before each screening.

### 5. Footer

The footer from the layout notes.

### Behavior

- The page has no state but the small-screen menu's. "Buy a season pass" points to `#`. No link needs behavior.
- Use the six dates of the sample in that order, with the weekdays given.
