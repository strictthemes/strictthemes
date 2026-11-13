---
page: live departures board
title: Departures
description: a live departures board for one ferry port, with a notice about a cancelled sailing, a table of the day's sailings with time, destination, ship, berth and state, a destination filter, and the port's practical details.
order: 5
checks:
  - "Every state on the board is a dot and a word: On time in the success color, Cancelled in the error color, and Delayed 20 min written out with its new time."
  - "The board is a table whose header cells have scope col, inside a box that scrolls sideways at 375px, can be reached with the keyboard and has an aria-label."
  - "Choosing a destination shows only the sailings that go there or call there, its button has aria-pressed set to true, and a status line says how many are shown."
  - "Exactly one row carries a badge, Boarding, in cyan with navy text, and it is the only badge on the page."
  - "Every time is on the 24-hour clock with two-digit hours, every sailing time on the board stands beside its destination in Overpass Mono with tabular figures, and the board's date and update time are fixed sample text, not the visitor's clock."
---

Sample content, if the user gave none: the departures board of "Kestrel Ferries" at Harrowmouth (`HRW`), Berths 1 to 4, Harbour Road, Harrowmouth, HW1 4QS. The board shows Friday 18 December 2026 and was last updated at 07:48: both are fixed sample text, and every state below is fixed with them. High winds are forecast for the afternoon, so the 14:00 to Wrenholm is cancelled. The eleven sailings:

| Time | Destination | Ship | Berth | State |
|---|---|---|---|---|
| 06:30 | Port Ellery | MV Merlin Tide | 2 | Departed |
| 07:10 | Brindle Ness | MV Harrier | 4 | Departed |
| 08:00 | Wrenholm | MV Kestrel Dawn | 1 | the badge "Boarding" |
| 09:15 | Port Ellery | MV Isla Grey | 2 | On time |
| 10:05 | Tollan Quay | MV Shearwater | 3 | Delayed 20 min, now 10:25 |
| 11:30 | Brindle Ness | MV Harrier | 4 | On time |
| 12:40 | Port Ellery, calls at Brindle Ness | MV Merlin Tide | 2 | On time |
| 14:00 | Wrenholm | MV Kestrel Dawn | 1 | Cancelled |
| 15:30 | Port Ellery | MV Isla Grey | 2 | On time |
| 17:20 | Tollan Quay | MV Shearwater | 3 | On time |
| 19:00 | Port Ellery | MV Merlin Tide | 2 | On time |

Write the rest of the copy yourself, plain and short.

Build these parts in order.

### 1. Header

The header from the layout notes, with "Departures" as the current page; its link keeps `/departures`.

### 2. Opening

The first section, with `pt-8`, in columns 1–8 of a grid (`grid gap-5 md:grid-cols-12`): a label, `Harrowmouth · HRW · Berths 1–4`, then with `mt-2` the `<h1>` "Departures from Harrowmouth" in `text-h1`, then with `mt-3` one sentence: the board follows the ships, and a berth can change up to 20 minutes before a sailing. Then with `mt-3` a label line in `text-foreground`: `Friday 18 December 2026 · Updated 07:48`, the date and the time each in a `<time>`.

### 3. Notice

A section with `mt-16`, in columns 1–8 of a grid: a card that is a nested `<section>` (no margin of its own) with `aria-labelledby` pointing at its heading, so that it is a named region, holding:

- A `<p>` holding the state from the layout notes, `Cancelled`.
- With `mt-2`, an `<h2>` "The 14:00 to Wrenholm is cancelled", the time in a `<time>`.
- With `mt-3`, one or two sentences in `text-body`: high winds are forecast for the afternoon; passengers booked on it can move to the 08:00 to Wrenholm on Saturday 19 December 2026 at no cost, or have a full refund. The times and the date are each a `<time>`.
- With `mt-3`, a `<p>` holding a link in running text, "Change a booking", that goes to `/ticket`.

### 4. Departures board

A section with `mt-16`: an `<h2>` "Departures board", then with `mt-3` one sentence: check-in closes 30 minutes before a sailing for foot passengers and 45 minutes before with a vehicle. Then with `mt-5` the board card: a card that holds a table, so `overflow-hidden rounded-xl border bg-card` with no padding, holding two parts.

**The filter**, a `<div>` with `border-b p-5`: a label `<p>` with an `id`, "Destination", in `font-mono text-label text-foreground`, then with `mt-2` a button group as the layout notes describe, named by that label with `aria-labelledby`: "All", "Port Ellery", "Brindle Ness", "Wrenholm", "Tollan Quay", with "All" chosen. Then with `mt-3` a `<p>` with `role="status"`, a label in `text-muted-foreground`, that says how many rows are shown: `Showing 11 sailings`, `Showing 5 sailings to Port Ellery`, `Showing 3 sailings to Brindle Ness`, `Showing 2 sailings to Wrenholm`, `Showing 2 sailings to Tollan Quay`, and at one row `Showing 1 sailing to …`. Unlike the confirmations in the layout notes, it holds its first text from the start: it is a count that changes, not a message that replaces a form.

**The table**, the shadcn `Table` as the layout notes describe (add it with `npx shadcn@latest add table badge` if missing), with `label="Departures board"`, directly under the filter's rule and touching the card's other three edges. Five columns, each header cell with `scope="col"`: Time, Destination, Ship, Berth, State. One row per sailing, in the order of the sample. In each row:

- **Time**: a `<time>` with `font-mono text-h2 text-foreground tabular-nums`, `09:15`. The cell is a `TableCell`, not a header.
- **Destination**: the port's name in `text-body` as a block `<span>`. On the 12:40 only, under it, a block `<span>` with `mt-1`, a label in `text-muted-foreground`: `Calls at Brindle Ness`.
- **Ship**: `MV Isla Grey` and so on, in `text-body`.
- **Berth**: the number as a label in `text-foreground` with `tabular-nums`, `2`.
- **State**: the state from the layout notes: `Departed`, `On time`, `Cancelled` or `Delayed 20 min`. The 10:05 adds, under its state, a block `<span>` with `mt-1`, a label in `text-foreground`: `Now 10:25`, the time in a `<time>`. The 08:00 shows, in place of a state, the page's one badge, `Boarding`.

The cells keep the stock `whitespace-nowrap`, so the table is wider than a phone: at 375px it scrolls sideways inside its box, which the edit in `table.tsx` makes reachable with the keyboard, and the page itself does not scroll sideways. Rows do not change on hover. A cancelled or departed row keeps its time as written: no strike-through and no dimming, since its state says what happened.

### 5. At the port

A section with `mt-16`, as a grid (`grid gap-5 md:grid-cols-12 md:items-start`):

- In columns 1–7: an `<h2>` "At the port", then with `mt-5` a description list as the layout notes describe, on the page, not in a card, with five rows: Address (an `<address className="not-italic">` with three block `<span>`s, `Harbour Road`, `Harrowmouth`, `HW1 4QS`); Check-in desk (`Opens 05:45`, a label in `text-foreground` with the time in a `<time>`); Foot passengers (`Desk closes 30 min before`, a label in `text-foreground`); Vehicles (`Lane closes 45 min before`, a label in `text-foreground`); Parking (`Long stay · £8.00 a day`, a label in `text-foreground`).
- In columns 9–12: a card with a label `Sailing another day?`, then with `mt-2` an `<h3>` in `text-h2`, "Book a crossing", then with `mt-3` one sentence: fares are lowest a few weeks ahead, and dogs and bicycles can be added when booking. Then with `mt-5`, in a `<div>`, the page's one default button: an `<a>` styled as a button, "Search sailings", that goes to `/`.

### 6. Footer

The footer from the layout notes.

### Behavior

- Keep the chosen destination in component state. "All" shows every row. A port shows the rows that go there or call there: "Brindle Ness" shows the 07:10, the 11:30 and the 12:40. Hidden rows are not rendered. The status line follows each choice, and choosing moves no focus.
- The board's date, its update time and every state are the fixed sample above. Nothing on this page reads the visitor's clock, and nothing refreshes on a timer.
- No button on this page disables itself, so it needs no `focusableWhenDisabled` and no `data-disabled:` edit.
- The links need no behavior.
