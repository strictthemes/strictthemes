---
page: cinema programme
title: Programme
description: the programme of an independent cinema, with a featured film, a switch between the coming days and a listing of each day's films with posters, credits and showtimes.
order: 1
checks:
  - Choosing a day in the day switch changes the listing to that day's films and times, updates the count line, and marks only the chosen button with `aria-pressed="true"`.
  - The featured film's title is the page's only `text-display` text, and "Book tickets" is the page's only default (gold) button or link.
  - Every showtime is a `<time>` with a full `dateTime` such as `2026-11-13T20:30`, set in `font-mono` with `tabular-nums`.
  - The page has one badge, "Premiere", on the row of "Low Tide at Merrow", in `bg-tertiary text-tertiary-foreground`.
  - Every poster and the still have `role="img"` and an `aria-label`, keep their 2:3 and 16:9 shapes at 375px, and the page does not scroll sideways there.
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Third run of this page. The second build showed that a poster in a row needs `self-start` to keep its proportions, which the agent added itself and the theme's shared notes now say. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,577 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems the earlier test builds reported. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,526 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,589 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode, and at 1280px in dark mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: **The Vesper**, an independent cinema with three screens and a late bar at 21 Tallow Row, Oldmere. The programme runs from Wednesday 11 November 2026 (today) to Sunday 15 November. Six films are on: "Low Tide at Merrow" (Ada Kessler, Norway, 2026, 118 min, rated 15, opening today, Wednesday 11 November), "Night Ferry to Halvik" (Jonas Brask, Denmark, 2025, 96 min, rated 12A), "The Glass Year" (Inès Lavalle, France, 2026, 131 min, rated 15), "A Room Above the Station" (Tomasz Wierzba, Poland, 2024, 104 min, rated PG), "Small Hours" (Noor Hadid, Lebanon, 2026, 88 min, rated 15) and "The Quiet Lift" (Mirela Dobre, Romania, 2025, 99 min, rated 12A). The Ilse Varga season starts after this week, on Friday 20 November, so none of its films is in this listing. Give each day four or five of the films, each with one to three times within that day's opening hours (17:30 to 21:00 on Wednesday and Thursday, 16:30 to 23:15 on Friday and Saturday, 13:30 to 20:30 on Sunday, so late shows are on Friday and Saturday only), on Screen 1, 2 or 3. "Low Tide at Merrow" is on every day.

Build these parts in order.

### 1. Header

The header from the layout notes. "Programme" is the current page.

### 2. Featured film

The first `<section>`. It opens with the page's `<h1>`, styled as a label rather than a title: `font-mono text-label uppercase text-muted-foreground`, reading "What's on · 11–15 Nov", the range written as two `<time>` elements as the layout notes say. The film's title is the big title, so the `<h1>` stays small.

Under it, with `mt-6`, a grid (`md:grid-cols-12`):

- Columns 1–7: a still of "Low Tide at Merrow", in a `<figure>` with its caption, a label: `Low Tide at Merrow · Maren on the harbour wall at dusk`.
- Columns 8–12, with `mt-6 md:mt-0`: a label "Featured · Opens today"; with `mt-2`, the film's title as an `<h2>` in `text-h1 md:text-display` (the page's big title, so it takes the size the layout notes give a big title); with `mt-4`, the credits line ("Ada Kessler · Norway · 2026"); with `mt-2`, a label line in `text-muted-foreground`: `118 min · Rated 15 · Screen 1`; with `mt-4`, two sentences about the film; and with `mt-6`, a row `flex flex-wrap items-center gap-4` holding the default-variant link "Book tickets" (to `#`) and a text link "About the film" (to `/film`).

On a phone the still comes first and the text follows under it.

### 3. Day switch

The second `<section>`, with `mt-24`. An `<h2>` "Listings" in `text-h2 md:text-h1`. Under it, with `mt-6`, a button group with the `aria-label` "Choose a day", holding five buttons: "Today", "Thu 12", "Fri 13", "Sat 14", "Sun 15". "Today" is chosen at first. Each button's text is a label, so it is uppercased by its classes, and is a `<time>` with that day's date (`dateTime="2026-11-12"`), "Today" included. Here, instead of the notes' `Thu 12 Nov`, the buttons leave out the month.

Under the group, with `mt-4`, a count line in an element with `aria-live="polite"`: a label in `text-muted-foreground` such as `Fri 13 Nov · 5 films`, the date a `<time>`.

### 4. Listing

In the same section, with `mt-6`: a `<ul>` of films, as a list of rows from the layout notes, in the order of each film's first time that day. Each row is an `<li>` holding an `<article>` laid out as a row with a poster:

- The poster thumbnail, with the `aria-label` "Poster for" and the title.
- The text column: the title as an `<h3>` in `text-h2`, holding a title link from the layout notes (never gold), to `/film` for "Low Tide at Merrow" and to `#` for the others; with `mt-2`, the credits line (director, country, year); with `mt-2`, a label line in `text-muted-foreground` with the running time, the rating and the screen, e.g. `118 min · Rated 15 · Screen 1`.
- Then, with `mt-4`, the showtimes: a `<ul>` with `flex flex-wrap gap-2`, the `aria-label` "Showtimes", one `<li>` per time. Each time is a link (to `#`) styled as an outline button, `cn(buttonVariants({ variant: "outline" }), "h-auto px-4 py-2 font-mono text-label uppercase tabular-nums")`, holding a `<time>`. A time at 22:00 or later adds the word "Late" after the `<time>`, outside it but inside the link, written `22:45 · Late` and shown in capitals by the class, so a late show is named in words and never by color.

The row of "Low Tide at Merrow" carries the page's one badge, "Premiere" (add the component with `npx shadcn@latest add badge`). It sits above the title, as the first line of the text column: add `flex` to its classes (it keeps the stock `w-fit`), so it is a block on its own line, and the title then has `mt-2`. No other row gets a badge.

On a phone the poster stays `w-24` beside the text, and the showtimes wrap under it inside the text column. Nothing in a row is hidden below `md`.

### 5. Season and membership

The third `<section>`, with `mt-24`, has no heading or `aria-label` of its own: each card's `<h2>` names its part. It is a grid (`md:grid-cols-12`) of two cards, each `md:col-span-6`, the second with `mt-6 md:mt-0`.

- The first card: a label "Season · 20 Nov – 18 Dec", the range as two `<time>` elements; with `mt-2`, an `<h2>` in `text-h2` "Ilse Varga: the night films"; with `mt-4`, one sentence about the season, which opens on Friday 20 November; with `mt-6`, a secondary-variant link "See the season" (to `/season`).
- The second card: a label "Membership"; with `mt-2`, an `<h2>` in `text-h2` "Two films a month, on us"; with `mt-4`, one sentence about what members get; with `mt-6`, an outline-variant link "Become a member" (to `/membership`).

Below `md` the cards stack.

### 6. Footer

The footer from the layout notes.

### Behavior

- Keep the sample data as an array of films, each with its credits, rating and screen and its times per day. The chosen day is component state. The listing, the count line and the order of the rows all read from it.
- Changing the day does not move focus and does not scroll the page. The count line announces the change.
- "Today" is Wednesday 11 November 2026; every `dateTime` uses the real date of the chosen day.
- "Book tickets" and the showtime links point to `#`. No link needs behavior.
