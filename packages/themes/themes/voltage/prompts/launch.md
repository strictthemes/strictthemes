---
page: event page
title: Event page
description: the opening page of a two-day festival, with a large headline, a countdown to the start, the first names on the bill, three facts and a call to buy tickets.
order: 1
checks:
  - The countdown changes every second and shows days, hours, minutes and seconds as real text; nothing on the page moves on its own except its digits.
  - A screen reader gets the time left as a sentence, and the start of the festival is a `<time>` element with a `dateTime`.
  - The `<h1>` is five words or fewer, `text-display` from `md` up and `text-h1` below, and at 375px no word in it runs past the edge.
  - The three facts are white panels with a 1px border, in one row from `md` up and stacked below.
  - The page has one default (black) button, the hero's "Buy tickets"; the tickets panel's "Buy tickets" is blue.
---

Sample content, if the user gave none: **Tremor Days**, a two-day music and design festival at Varsby Docks, an old harbour in the city of Varsby. It runs on Friday 4 and Saturday 5 December 2026; the gates open on Friday at 16:00 (UTC+1). There are 19 acts on three stages: Crane Stage and Pump House for music, and the Drawing Office for design talks and workshops. A weekend ticket is €118, a day ticket from €64. All acts, people and places are invented: the first names on the bill are Ossa Bloom, The Night Ferries and Kettle Drum Union, then Lumen Varga, Sister Antenna, Pia Strand, Odd Weather, Gravel & Gold, Juno Halde and Neon Allotment.

Build these parts in order, under the header from the layout notes, which marks no link as the current page.

### 1. Hero

A section, but it opens with no heading row: the `<h1>` is its heading. Its stack has `gap-5`:

- A stack with `gap-2`: a label, `Music and design · Varsby Docks`, then the `<h1>` "Tremor Days".
- The dates and the place in `font-heading text-h2`, on one `<p>`: "4–5 December 2026 · Varsby Docks", the dates as the range from the Numbers note, "4" in a `<time dateTime="2026-12-04">` and "5 December 2026" in a `<time dateTime="2026-12-05">`. On a phone the line wraps; it never runs off the screen.
- One paragraph of at most two sentences, in `text-body` straight on the page, `max-w-xl`: what the festival is, in plain words, such as "Two days of bands, live sets and design talks in the old harbour of Varsby. Three stages sit between the cranes and the pump house."
- A row of two links styled as buttons, `flex flex-wrap gap-3`: "Buy tickets" (`/tickets`) in the default variant, and "See the line-up" (`/line-up`) in the `secondary` variant. This is the page's one default button.

### 2. Countdown

A section on the page, not on a panel: large numbers are part of the look. Its heading row holds an `<h2>` "Gates open in". The content is a stack with `gap-3`:

- The four units, in a row with `grid grid-cols-2 gap-5 md:flex md:items-center md:gap-8`: two by two on a phone, one line from `md` up. Each unit is a stack with `gap-1`: the number, two digits with a leading zero (`04`), in `font-heading text-h1 tabular-nums` below `md` and `md:text-display` from `md` up; under it its label, `Days`, `Hours`, `Minutes` or `Seconds`. These four numbers are the one other `text-display` text on the page. The days count may have three digits; it does not need a leading zero then.
- Between the units, from `md` up only, a separator: `hidden md:flex flex-col gap-2` holding two countdown dots, each `size-3 rounded-full bg-foreground`. Below `md` they are not shown, so the grid holds only the four units.
- The whole row of units and dots has `aria-hidden="true"`, which hides the separators too; they need no `aria-hidden` of their own. Right after it in the source, before the label line below, a `<p>` with `sr-only` gives the same time in words: "12 days, 4 hours and 31 minutes until the gates open." It is not a live region: it changes once a minute and is read when someone reaches it.
- Under the row, a label line with the start as one `<time dateTime="2026-12-04T16:00+01:00">` that wraps the whole `Fri 4 Dec · 16:00`, since it is one moment.

### 3. First names

A section. Its heading row holds the `<h2>` "First names" and, at the right end, a text link "Full line-up" (`/line-up`).

The content is a stack with `gap-3`:

- A `<ul>` of ten names with `flex flex-wrap items-baseline gap-x-5 gap-y-2`, no markers and no padding. The first three names (the headliners) are in `font-heading text-h2 md:text-h1`; the other seven in `font-heading text-h2`. Each name is a link to the act's page (`/artists/ossa-bloom`, and so on) that has no underline at rest and `underline underline-offset-4` on hover, like a nav link, and no transition. Names keep their own case. No separators between them: the gap does the work.
- Small print under the list: "Nine more acts on the full line-up."

### 4. Facts

A section with a visually hidden `<h2>` "The festival in numbers" and the grid from the layout notes: three panels, each `md:col-span-4`. Each panel is the stock panel with `gap-3`, holding:

1. A label: `Acts`, `Stages` and `Last train`.
2. The large number in `font-heading text-h1 tabular-nums`: `19`, `3` and `01:40`. The last one is a `<time dateTime="01:40">`, with the time alone as its `dateTime`, since it holds after both nights.
3. One sentence in `text-body`. Acts: "Bands, live sets and design talks across two days." Stages: "Two for music and one, the Drawing Office, for talks and workshops." Last train: "Extra trains run back to Varsby Central after both nights."

### 5. Tickets

A section whose one child is a panel across the full width, with no grid around it; the panel carries the section's heading. The panel has `gap-5` and lays its two parts side by side from `md` up: `md:flex-row md:items-center md:justify-between`.

- At the left, a stack with `gap-3`: the `<h2>` "Tickets on sale" in `text-h2 md:text-h1`, and two sentences in `text-body`: "Weekend €118, day tickets from €64. Saturday day tickets are sold out." The sold-out fact stays in words: no badge here, and the page has none.
- At the right, `self-start md:self-auto md:shrink-0`: a link styled as the `secondary` button, "Buy tickets" (`/tickets`). It is blue, not black, because the hero's is the page's one default button, and a tall screen can show both. Below `md` it sits under the text, at its own width.

### 6. Footer

The footer from the layout notes.

### Behavior

- The start time is one constant: `new Date("2026-12-04T16:00:00+01:00")`. Work out the time left from it and `Date.now()` in the state's first value, so the first render already shows the right numbers, then update it once a second with a `setInterval` that is cleared when the component unmounts. Count whole seconds left rounded up (`Math.ceil`), so every unit reaches `00` only at the start itself.
- The digits change and nothing else happens: no flip, no fade, no slide, no pulse, and no transition on the numbers. This holds with reduced motion as well, since there is no motion to reduce. The stock button's nudge while pressed stays, from the Motion note.
- The words in the `sr-only` sentence are derived from the same state, rounded down to the minute, so they change at most once a minute. Use "1 day", "1 hour" and "1 minute" in the singular. Leave out a unit that is 0 ("4 hours and 31 minutes until the gates open."), join two parts with "and" and three with a comma and "and". With less than a minute left, the sentence is "Less than a minute until the gates open."
- Once the start time has passed, stop the interval, show `00` in every unit, change the `<h2>` to "Gates are open" and the sentence to "The gates are open."
- The menu button is the only other state on the page. "Buy tickets", "See the line-up", "Full line-up" and the names are links and need no behavior.
