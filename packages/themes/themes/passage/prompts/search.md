---
page: ferry search home page
title: Search
description: the home page of a ferry line, with a journey search form in a white card on the page, popular routes with their fares, and three reasons to sail with the line.
order: 1
checks:
  - "The search form sits in a white card on the pale page, and the choice of one way or return is a button group whose chosen button has aria-pressed set to true."
  - "Sending the empty form gives the From select, the To select and the outward date each their own error line with an icon, and focus moves to the From select."
  - "Choosing the same port twice, or a date before today, gets an error line that says why in words."
  - "The adults and children steppers stop at their own limits and at nine passengers in all, and every minus and plus button has an aria-label."
  - "Every fare on the route cards has the pound sign and two decimals in Overpass Mono with tabular figures, and the page has one default button at a time."
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-12"
    result: >-
      A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,238 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light and dark mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: "Kestrel Ferries", a ferry line that sails from Harrowmouth (`HRW`) on the mainland to four island ports: Port Ellery (`PEL`), Brindle Ness (`BRN`), Wrenholm (`WRH`) and Tollan Quay (`TLQ`). Harrowmouth to Port Ellery takes 1 h 45 min direct, with five sailings a day; Brindle Ness 55 min, three a day; Wrenholm 2 h 30 min, two a day. Fares start at £29.00, £18.00 and £36.00 for one adult, one way. Children aged 4 to 15 need a ticket; under 4s travel free. Tickets are sold up to 180 days ahead. Write the rest of the copy yourself, plain and specific.

Build these parts in order.

### 1. Header

The header from the layout notes, with "Book" as the current page; its link keeps `/`.

### 2. Opening and search

The first section, with `pt-8`, as a grid (`grid gap-5 md:grid-cols-12 md:items-start`):

- In columns 1–5: a label, `Ferries to the islands · Since 1987`, then with `mt-2` the `<h1>` in `text-h1 lg:text-display` (here `lg:` in place of the Headings note's `md:`, since five columns at `md` are too narrow for the display size): "Over the water by lunchtime". With `mt-3` one or two sentences in `text-body`: five islands' worth of crossings from Harrowmouth, with a car, a bike or a dog. With `mt-5` a label line in `text-muted-foreground`: `Harrowmouth · Port Ellery · Brindle Ness · Wrenholm · Tollan Quay`.
- In columns 7–12: the search card, a card that is the wrapper for the form and the confirmation. It holds the `<form>` (with `noValidate` and the `aria-label` "Search sailings") and, after it, the empty `role="status"` element. Add the fields with `npx shadcn@latest add input` if the project has none, and give the new file the edits the Added components note lists.

On a phone the card comes under the label line, with the grid's `gap-5` between them.

The form's fields, in this order, each in its own `<div>`, `mt-5` apart, as the Forms note says:

1. **Trip**: a label `<p>` with an `id`, "Trip", in `font-mono text-label text-foreground`, then with `mt-2` a button group as the layout notes describe, named by that label with `aria-labelledby` in place of an `aria-label`: "One way" and "Return". "One way" is chosen when the page opens.
2. **From and To**: two fields side by side from `lg` up, as items of a `grid gap-5 lg:grid-cols-2` (here `lg:` in place of the Forms note's `md:`, because the card is narrow at `md`). Each is a native `<select>` styled as the layout notes describe: the label "From" and the label "To". Each list starts with the empty choice "Choose a port", then the five ports, each written with its code, as plain text: `<option value="HRW">Harrowmouth (HRW)</option>`, then Port Ellery (PEL), Brindle Ness (BRN), Wrenholm (WRH), Tollan Quay (TLQ).
3. **Dates**: with "One way" chosen, one field: the label "Outward date", then an `Input` of type `date`. With "Return" chosen, a second field follows it, "Return date", and the two sit side by side from `lg` up in a `grid gap-5 lg:grid-cols-2`; with "One way" the grid holds the outward date alone. The outward date has `min` set to today and `max` to 180 days after today, on the visitor's clock; the return date has `min` set to the outward date, or today while the outward date is empty, and the same `max`. `min` and `max` only limit the picker: a date typed outside them still reaches the check, so the code keeps the range messages below.
4. **Adults**: a label `<p>` with an `id`, "Adults", in `font-mono text-label text-foreground`, then with `mt-2` a stepper as the layout notes describe, from one to nine, starting at two. The value reads `1 adult`, `2 adults`. The buttons' `aria-label`s are "Fewer adults" and "More adults".
5. **Children**: the label "Children" set the same way, then with `mt-2` a stepper from zero to eight, starting at zero. The value reads `0 children`, `1 child`, `2 children`. The buttons' `aria-label`s are "Fewer children" and "More children". Under the stepper, with `mt-2`, a label in `text-muted-foreground`: `Ages 4 to 15. Under 4s travel free and need no ticket.`

No booking holds more than nine passengers: while adults and children add up to nine, both plus buttons are disabled. The four stepper buttons use `focusableWhenDisabled`, so this page makes the `data-disabled:` edit in `button.tsx`.

Then, in the notes' `<div>` with `mt-5`, the page's one default button, `type="submit"`: "Search sailings".

### 3. Popular routes

A section with `mt-16`: an `<h2>` "Popular routes", then with `mt-3` one sentence: every crossing leaves from Harrowmouth's harbour, a five-minute walk from the station. Then with `mt-5` a grid of three cards (`grid gap-5 md:grid-cols-3`), stacked on a phone. This grid has no `md:items-start`: the cards stretch to the same height.

Each card is an `<article>` with the card classes, holding:

- A label in `text-muted-foreground` with how often it sails: `5 sailings a day`.
- With `mt-2`, an `<h3>` in `text-h2`, the route: "Harrowmouth to Port Ellery".
- With `mt-3`, one sentence in `text-body` about the crossing.
- With `mt-5`, a row `<div>` with `flex items-end justify-between gap-5`: on the left a `<p>`, a label in `text-muted-foreground`, with the duration and the way, `1 h 45 min · Direct`; on the right a `<div>` with `shrink-0 text-right` holding a label in `text-muted-foreground`, `From, one adult`, and under it with `mt-1` the price as a `<p>` in `font-mono text-h2 text-foreground tabular-nums`, `£29.00`.
- With `mt-5`, a `<p>` holding a link in running text, "See sailings".

The three routes: Harrowmouth to Port Ellery (`5 sailings a day`, `1 h 45 min · Direct`, `£29.00`, the link to `/results`); Harrowmouth to Brindle Ness (`3 sailings a day`, `55 min · Direct`, `£18.00`, the link to `#`); Harrowmouth to Wrenholm (`2 sailings a day`, `2 h 30 min · Direct`, `£36.00`, the link to `#`). No badge on this page.

### 4. Why sail with Kestrel

A section with `mt-16`: an `<h2>` "Why sail with Kestrel", then with `mt-5` a grid of three items (`grid gap-5 md:grid-cols-3 md:items-start`), on the page, not in cards. Each item is a `<div>` with an `<h3>` (`text-body font-bold`, as the Headings note says) that is `flex items-center gap-2` and holds an icon and its words, then with `mt-3` one or two sentences in `text-body`:

- `CalendarClock`, "Change for £10.00": a sailing can be moved up to 24 hours before it leaves, for £10.00 a booking.
- `Bike`, "Bring the bike": bicycles cost £6.00 each and travel on the car deck, with a rack by the stairs.
- `Dog`, "Dogs on deck": dogs travel free on the open deck and in the dog lounge on every ship.

The prices in these sentences are part of the sentence: they keep the body font.

### 5. Footer

The footer from the layout notes.

### Behavior

- Keep every value in component state. Choosing "Return" adds the return date; choosing "One way" removes it, its value and its error line.
- When the form is sent, check it in code, in this order, and only the first check that fails for a field shows:
  - From: the empty choice gives "Choose the port you sail from."
  - To: the empty choice gives "Choose the port you sail to."; the same port as From gives "Choose a different port from the one you sail from."
  - Outward date: empty gives "Choose the date you sail."; a date before today gives "Choose today or a later date."; a date after `max` gives "We sell tickets up to 180 days ahead."
  - Return date, with "Return" chosen: empty gives "Choose the date you sail back."; a date before the outward date gives "Choose a return date on or after the outward date."; a date after `max` gives "We sell tickets up to 180 days ahead."
  - The steppers are always valid.
- Compare dates as the `YYYY-MM-DD` strings a date field gives, with today taken from the visitor's clock in their own time zone.
- Each error line follows the layout notes, which say when it shows and when it goes, and focus moves to the first field with an error.
- When everything is good, the form is replaced in its card by the confirmation in the status element: an `<h2>` in `text-h2`, "Your search is ready", with `tabIndex={-1}`, and with `mt-3` a sentence that repeats the search: "Sailings from Harrowmouth to Port Ellery on Saturday 19 December 2026, for 2 adults." With "Return" chosen it adds the way back: "…, back on Sunday 27 December 2026, for 2 adults and 1 child." Write the counts as the steppers write them, and leave out children at zero. The dates are each a `<time>`, written as the layout notes say. Move focus to the heading. After the status element, in a `<div>` with `mt-5` that is rendered only with the confirmation, an `<a>` styled as the default button, "See the sailings", that goes to `/results`: it takes the place of "Search sailings" as the page's one default button.
- The other links need no behavior.
