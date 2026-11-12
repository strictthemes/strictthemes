---
page: booking confirmation and boarding pass
title: Ticket
description: the confirmation of a ferry booking, with a boarding pass as a ticket card with a dashed tear line, the booking reference, the journey, the passengers, a drawn boarding code and what to bring.
order: 4
checks:
  - "The ticket is one white card with 18px corners, divided by a dashed tear line, with no card or bordered box inside it."
  - "The booking reference is in Overpass Mono, and Copy reference announces the result through a status element that was on the page, empty, from the start."
  - "The boarding code is drawn from plain elements in a grid, has role img and an aria-label that names the booking reference, and is not an image file or a real QR code."
  - "Confirmed shows its success dot beside the word, and the journey reads from Harrowmouth at 09:15 on the left to Port Ellery at 11:00 on the right."
  - "Every time on the page is on the 24-hour clock with two-digit hours, in a time element."
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-12"
    result: >-
      A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,561 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: "Kestrel Ferries", booking `KF-7Q4M2R`, confirmed and paid. The 09:15 from Harrowmouth (`HRW`) to Port Ellery (`PEL`), arriving 11:00, on Saturday 19 December 2026, on MV Isla Grey from Berth 2; 1 h 45 min, direct. Two adults, Maren Holt and Tomas Holt, with two bicycles. Paid £90.00: the fare of £78.00 and two bicycles at £6.00 each. Check-in closes at 08:45 and boarding starts at 08:50. The boarding pass went to maren.holt@mail.example. A booking can be changed up to 24 hours before the sailing for £10.00, and cancelled up to 7 days before for a refund less £15.00.

Build these parts in order.

### 1. Header

The header from the layout notes, with "My booking" as the current page; its link keeps `/ticket`.

### 2. Opening

The first section, with `pt-8`, in columns 1–8 of a grid (`grid gap-5 md:grid-cols-12`):

- A `<p>` holding the state from the layout notes, `Confirmed`.
- With `mt-2`, the `<h1>` "Your crossing is booked" in `text-h1`.
- With `mt-3`, one or two sentences in `text-body`: the boarding pass went to maren.holt@mail.example, and it can be shown on a phone or on paper.
- With `mt-3`, a label line in `text-muted-foreground`: `Booked on Thursday 12 November 2026 · Paid £90.00`, the date in a `<time>` and the price in `tabular-nums`.

### 3. Boarding pass and what to bring

A section with `mt-16`, as a grid (`grid gap-5 md:grid-cols-12 md:items-start`):

- In columns 1–7: the ticket card and, after it, a row of actions.
- In columns 9–12: the "What to bring" card. On a phone it comes after the actions.

**The ticket.** An `<article>` with `aria-labelledby` pointing at its `<h2>`, and `relative overflow-hidden rounded-xl border bg-card`, with no padding of its own: it is a card of two parts with a tear line between them.

The first part, a `<div>` with `p-5`:

1. A top line, `flex flex-wrap items-center justify-between gap-x-5 gap-y-2`: a label in `text-muted-foreground`, `Boarding pass · Kestrel Ferries`, and the state `Confirmed`.
2. With `mt-2`, the `<h2>` "Harrowmouth to Port Ellery".
3. With `mt-5`, a row `<div>` with `flex flex-wrap items-end justify-between gap-x-5 gap-y-3`: on the left a `<div>` with a label in `text-muted-foreground`, `Booking reference`, and under it with `mt-1` the reference as a `<p>` in `font-mono text-h1 text-foreground`, `KF-7Q4M2R` (Overpass Mono at the h1 size, on purpose, like the prices); on the right a `<div>` with `flex items-center gap-3` holding the "Copy reference" button (`variant="outline"`, the notes' button classes) and, after it, a `<span>` with `role="status"` and `font-mono text-label text-foreground`, empty from the start.
4. With `mt-5`, the journey from the layout notes in its full size: `09:15` and `Harrowmouth` on the left, `1 h 45 min` and `Direct` on the line, `11:00` and `Port Ellery` on the right.
5. With `mt-5`, a description list as the layout notes describe, seven rows: Date (`Saturday 19 December 2026`, in a `<time>`); Route (`HRW–PEL`, a label in `text-foreground`); Ship (`MV Isla Grey`); Berth (`2`, a label in `text-foreground`); Check-in closes (`08:45`, a label in `text-foreground`, in a `<time>`); Passengers (`Maren Holt` and `Tomas Holt`, each a block `<span>`, so they stand on two lines); Extras (`2 bicycles`).

The tear line, a `<div>` with `relative border-t border-dashed` and `aria-hidden="true"`, running the full width of the card. In it two notches, page-colored half circles cut into the card's edges: `absolute top-0 left-0 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background` and `absolute top-0 right-0 size-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-background`. They are 20px circles, within the theme's limit for a full round, with no border, and the card's `overflow-hidden` cuts each to a half. These and the state dot are the only round shapes on the page.

The second part, a `<div>` with `flex items-center gap-5 p-5`:

- **The boarding code**, drawn from plain elements and not a real QR code: a `<div>` with `grid size-32 shrink-0 grid-cols-8`, `role="img"` and the `aria-label` "Boarding code for booking KF-7Q4M2R", holding 64 `<span>`s, row by row. A `1` below is a `<span>` with `bg-foreground`, a `0` an empty `<span>`, so each cell is 16px square and the code is navy on white in light mode and pale on navy in dark mode. No border, no corners, no gap. The eight rows:
  - `11101011`
  - `10101001`
  - `11100110`
  - `00011011`
  - `10110100`
  - `01001110`
  - `11010101`
  - `10011011`
- Beside it, a `<div>` with `min-w-0`: a label in `text-muted-foreground`, `Scan at check-in`; with `mt-2` a sentence in `text-body`: "Show this code at the desk by Berth 2 before 08:45.", the time in a `<time>`; with `mt-2` a label in `text-muted-foreground`, `2 adults · 2 bicycles`.

At 375px the code and its text fit side by side: about 295px inside the card, 128 for the code, 20 for the gap and the rest for the text, which wraps.

**Actions.** After the ticket, with `mt-5`, a `<div>` with `flex flex-wrap items-center gap-5`: a `secondary` button, "Print boarding pass", and a link in running text, "Departures on the day", that goes to `/departures`. This page has no default button.

**What to bring.** A card as an `<aside>` with `aria-labelledby` pointing at its heading: a label `Before you leave home`, then with `mt-2` an `<h2>` "What to bring", then with `mt-5` a `<ul>` with no markers and no padding, and `divide-y`. Each `<li>` is `flex items-start gap-3 py-3 first:pt-0 last:pb-0`: an icon with `mt-1` (so it sits on the first line) and a sentence in `text-body`:

- `IdCard`: Photo ID for each adult, such as a passport or a driving licence.
- `Smartphone`: This boarding pass, on your phone or printed.
- `Bike`: A lock for each bicycle. Bicycles travel on the car deck.
- `Clock`: Time to check in: the desk by Berth 2 closes at 08:45, with the time in a `<time>`.

### 4. Change or cancel

A section with `mt-16`, in columns 1–8 of a grid: an `<h2>` "Change or cancel", then with `mt-3` one sentence: changes and refunds are made from this page or at the desk, and the fare difference is charged or refunded. Then with `mt-5` a description list as the layout notes describe, on the page, not in a card, with three rows: `Change up to 24 hours before` with `£10.00`, a price label; `Cancel up to 7 days before` with `Refund less £15.00`; `Cancel later` with `No refund`. Then with `mt-5` a `<p>` holding a link in running text, "Change this booking", to `#`.

### 5. Footer

The footer from the layout notes.

### Behavior

- "Copy reference" writes `KF-7Q4M2R` to the clipboard with `navigator.clipboard.writeText`. When it works, the status element reads `Copied`; when it fails, `Copy failed: select the reference and copy it.` The text is cleared after four seconds. Focus stays on the button, which never disables itself, so it needs no `focusableWhenDisabled`, and this page needs no `data-disabled:` edit.
- "Print boarding pass" calls `window.print()`.
- The booking is fixed sample data: nothing on this page reads the visitor's clock.
- The other links need no behavior.
