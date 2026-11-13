---
page: ferry search results page
title: Results
description: the sailings for one route and day, with a summary of the search, a list of journeys that can be sorted, each with its times, duration, state and fare, and a summary of the chosen sailing.
order: 2
checks:
  - "Each sailing shows its departure and arrival times with the port under each, the duration on the line between them, and its fare in Overpass Mono at the right end of the card."
  - "Exactly one sailing carries a badge, Lowest fare, in cyan with navy text, and every other sailing shows a state as a dot and a word."
  - "Choosing a sailing sets aria-pressed on its button, gives its card the primary border, and changes the summary's times, ship and fare."
  - "The sold-out sailing has no fare and no button, and sorting by price or by duration puts it last."
  - "At 375px the journey, the fare and the button fit inside each card without the page scrolling sideways."
---

Sample content, if the user gave none: "Kestrel Ferries", a search for Harrowmouth to Port Ellery on Saturday 19 December 2026, one way, for 2 adults. Fares are for the whole booking (both adults), one way, and include port fees. Five sailings that day:

| Leaves Harrowmouth | Arrives Port Ellery | Duration | Way | Ship | Fare | State or badge |
|---|---|---|---|---|---|---|
| 06:30 | 08:15 | 1 h 45 min | Direct | MV Merlin Tide | £64.00 | Seats free |
| 09:15 | 11:00 | 1 h 45 min | Direct | MV Isla Grey | £78.00 | Seats free |
| 12:40 | 14:35 | 1 h 55 min | 1 stop (calls at Brindle Ness) | MV Merlin Tide | £58.00 | the badge "Lowest fare" |
| 15:30 | 17:15 | 1 h 45 min | Direct | MV Isla Grey | none | Sold out |
| 19:00 | 20:45 | 1 h 45 min | Direct | MV Merlin Tide | £64.00 | Few seats left |

The 09:15 is chosen when the page opens. Write the rest of the copy yourself, plain and short.

Build these parts in order.

### 1. Header

The header from the layout notes. This page is a step of booking, not the booking start itself, so here, in place of the notes' `aria-current="page"`, the "Book" link gets `aria-current="true"` and `underline`, and keeps `/`.

### 2. Opening

The first section, with `pt-8`, in columns 1–8 of a grid (`grid gap-5 md:grid-cols-12`): a label, `Step 1 of 3 · Choose a sailing`, then with `mt-2` the `<h1>` "Harrowmouth to Port Ellery" in `text-h1`, then with `mt-3` a label line in `text-foreground`: `Saturday 19 December 2026 · One way · 2 adults`, with the date in a `<time>`. Then with `mt-3` a `<p>` holding a link in running text, "Change search", that goes to `/`.

### 3. Sailings and summary

A section with `mt-16`, as a grid that is a single column up to `lg`: `grid gap-5 lg:grid-cols-12 lg:items-start`.

- In columns 1–8 (`lg:col-span-8`): the sailings.
- In columns 9–12 (`lg:col-span-4`): the summary card, with `lg:sticky lg:top-5`, so it stays in view while the list scrolls. Below `lg` it comes after the list.

**Sailings.** An `<h2>` "Sailings", then with `mt-3` one sentence: fares are for 2 adults, one way, and include port fees. Then with `mt-5` the sort card, a card holding a label `<p>` with an `id`, "Sort by", in `font-mono text-label text-foreground`, then with `mt-2` a button group as the layout notes describe, named by that label with `aria-labelledby`: "Departure", "Price", "Duration", with "Departure" chosen. Then, still in the sort card, with `mt-3`, a `<p>` with `role="status"`, a label in `text-muted-foreground`, that says the order: `5 sailings, earliest first`, `5 sailings, lowest fare first` or `5 sailings, shortest first`. Unlike the confirmations in the layout notes, it holds its first text from the start: it is a line that changes, not a message that replaces a form.

Then with `mt-5` the sailings as an `<ol>` with no markers and no padding, `grid gap-5`. Each `<li>` is a card, holding:

1. A top line, `flex flex-wrap items-center justify-between gap-x-5 gap-y-2`: on the left the state from the layout notes (`Seats free`, `Sold out`, `Few seats left`), or for the 12:40 in its place the page's one badge, `Lowest fare` (add it with `npx shadcn@latest add badge` if the project has none). On the right, only on the chosen sailing, a mark: a `<span>` with `inline-flex items-center gap-2 font-mono text-label text-foreground` holding the `Check` icon and the word `Chosen`.
2. With `mt-5`, the main row: `flex flex-col gap-5 md:flex-row md:items-center`. This is a layout row, not a stack of text, so the gap is right here. In it:
   - The journey from the layout notes, in its full size, in a `<div>` with `md:min-w-0 md:flex-1`: the departure time and `Harrowmouth` on the left, the duration (`1 h 45 min`) and the way (`Direct` or `1 stop`) on the line, the arrival time and `Port Ellery` on the right.
   - A `<div>` with `flex items-center justify-end gap-5 md:shrink-0`: the fare in a `<div>` with `text-right`, a `<p>` in `font-mono text-h2 text-foreground tabular-nums` (`£78.00`) and under it with `mt-1` a label in `text-muted-foreground`, `2 adults`; then the "Choose" button. The sold-out sailing has neither: it shows no `<div>` here at all, and its state says why.
3. On the 12:40 only, with `mt-3`, a label in `text-muted-foreground`: `Calls at Brindle Ness · 10 min stop`.

The "Choose" button is `variant="outline"` with the notes' button classes, and on the chosen sailing `variant="secondary"`. Its text is always "Choose"; it has `aria-pressed` (`true` on the chosen sailing, `false` on the others) and an `aria-label` that names the sailing: "Choose the 09:15 sailing". The chosen card adds `border-primary`, which wins over the stock border color; the other cards keep the stock one.

At 375px a card's inside is about 295px wide: the journey fills it, and the fare and the button sit on their own line under it, at the right end.

**Summary.** The summary card is an `<aside>` with `aria-labelledby` pointing at its heading. Inside it:

- A label: `Your sailing`.
- With `mt-2`, an `<h2>` "Summary".
- With `mt-5`, the journey from the layout notes in its small size, for the chosen sailing.
- With `mt-5`, a description list as the layout notes describe, with three rows: Date (`Saturday 19 December 2026`, in a `<time>`), Ship (`MV Isla Grey`), Passengers (`2 adults`).
- With `mt-5`, a total line with a 1px top rule: a `<div>` with `flex items-baseline justify-between gap-5 border-t pt-3`, holding a label in `text-foreground`, `Total`, and the fare as a `<p>` in `font-mono text-h2 text-foreground tabular-nums`, `£78.00`.
- With `mt-5`, in a `<div>`, the page's one default button: an `<a>` styled as a button with `w-full`, "Continue", that goes to `/details`.
- With `mt-3`, a label in `text-muted-foreground`: `Passenger names and extras come next.`

The summary is not a live region: the chosen button's `aria-pressed` already says what changed.

### 4. Before you sail

A section with `mt-16`, in columns 1–8 of a grid: an `<h2>` "Before you sail", then with `mt-3` one or two sentences: check-in at Harrowmouth closes 30 minutes before a sailing for foot passengers and 45 minutes before with a vehicle, and fares go up as a sailing fills. Then with `mt-3` a `<p>` holding a link in running text, "Today's departures from Harrowmouth", that goes to `/departures`.

### 5. Footer

The footer from the layout notes.

### Behavior

- Keep the sailings, the chosen sailing and the sort order in component state. "Choose" on a sailing makes it the chosen one: its button and card change as above, the other cards lose the mark and the border, and the summary's journey, ship and total follow. Focus stays on the button.
- Sorting: "Departure" orders by the time of leaving. "Price" orders by fare, lowest first. "Duration" orders by time at sea, shortest first. Under "Price" and "Duration" the sold-out sailing comes last, and ties keep the order of leaving. Sorting keeps the chosen sailing and moves no focus; the status line follows.
- Times are fixed sample times on the 24-hour clock; nothing on this page reads the visitor's clock.
- "Continue", "Change search" and the other links need no behavior. No button on this page disables itself, so it needs no `focusableWhenDisabled` and no `data-disabled:` edit.
