---
page: guesthouse home page
title: Home
description: the home page of a small guesthouse, with an opening on a block of clay, a short date check that leads to the reservation page, three of its rooms, a few lines about the house, breakfast in brief and how to find it.
order: 1
checks:
  - "The opening's block is the page's only `bg-clay` element; all text on it is the ink of `text-clay-foreground` in both modes, and it holds no link, button, field or badge."
  - "The `<h1>` has exactly one phrase in italics, set with the `italic` class; the guest's words are the only other italic, and no heading or text in the heading font is bold."
  - "Each field of the date check has a visible label; a missing date, or a day of leaving that is not after the day of arriving, gets a message in words with an icon, and good dates lead to `/reserve` with the two dates and the guests in the address."
  - "Every picture is a plate drawn from plain elements, with the img role and an `aria-label`, 12px corners and a hairline border, and none sits inside a card."
  - "The two dates and the guests are the theme's date field and `Select`, with no `<input type=\"date\">` and no native `<select>` on the page: the calendar and the list open under their fields in the theme's colors, the chosen day is filled and the chosen row has a check, and the arrow keys, Enter and Escape work in both."
  - "Check dates is the page's one default (slate) button, Breakfast included is its one badge, and nothing on the page is a pill or a circle."
  - "The hours and the ways to get here are rows with a name on the left, a 1px hairline and a figure in the mono font at the right end."
---

Sample content, if the user gave none: the home page of **Kittiwake House**, the invented guesthouse of six rooms described in the layout notes: 9 Harbour Terrace, Port Lowan, above the harbour of an invented town, with a glazed veranda where breakfast is served. Rooms from £78 a night, breakfast included. Every name is invented. Where this brief gives a sentence only in outline, write it yourself, plain and unhurried, the way the samples read.

Build these parts in order. This page needs `npx shadcn@latest add select popover calendar badge`.

### 1. Header

The header from the layout notes. No link is the current page here.

### 2. Opening

The first section, with `pt-12` and `aria-labelledby` pointing at the `<h1>`. It holds a grid and, after it, the date check of part 3.

The grid is `grid gap-6 md:grid-cols-12` with no `md:items-start`: its two items stretch to the same height.

- In columns 1–5 (`md:col-span-5`): the page's clay block, with `flex items-end` beside the block's own classes, so its text sits at the foot of the block. It holds one `<div>`, in normal block flow:
  - A label with no text color class, so it takes the block's ink: `Guesthouse · Port Lowan`.
  - With `mt-2`, the `<h1>` in `text-h1 lg:text-display`: "A quiet house above the harbour", with the words "above the harbour" in a `<span className="italic">`. This is the page's one italic phrase in a heading.
  - With `mt-4`, a `<p>` in `text-body`: "Six rooms and a veranda that faces the bay. Breakfast is included, and nothing hurries you."
- In columns 6–12 (`md:col-span-7 md:col-start-6`): a plate with no caption, `aspect-4/3`, the window at `right-1/6`, with the `aria-label` "The glazed veranda of Kittiwake House at breakfast time, with the bay beyond its windows". The plate itself is the grid item.

From `md` up the block is as tall as the plate; where its text needs more room, it grows and the plate keeps its shape. On a phone the block comes first, as tall as its text, and the plate follows.

### 3. Date check

Still in the opening section, after the grid, with `mt-6`: a `<form>` that is a card, with `noValidate`, `action="/reserve"`, `method="get"` and `aria-labelledby` pointing at its heading. Here, in place of the Forms note's stack of fields, the three fields and the button share one row. Inside the card:

- A label heading, an `<h2>` with an `id`: "Check your dates".
- With `mt-4`, a row: `grid gap-6 md:grid-cols-12 md:items-end`, with four items, each a `<div>` of three columns (`md:col-span-3`):
  1. The label "Arrive", then with `mt-2` a date field from the layout notes with `name="arrive"` and `min` set to today.
  2. The label "Leave", then with `mt-2` a date field with `name="leave"` and `min` set to the day after the day of arriving, or to tomorrow while no day of arriving is set.
  3. The label "Guests", then with `mt-2` a `Select` with `name="guests"` and four choices, `1 guest`, `2 guests`, `3 guests` and `4 guests`, with the values `1` to `4`. It starts on `2 guests` and has no placeholder.
  4. The page's one default button, `type="submit"`: "Check dates", with `h-11 w-full` in place of the Buttons note's `h-auto`, so it is as tall as the fields beside it. This item has no label.
- Under the row, the error lines, one for each date field that has an error, in the order of the fields, each with `mt-2` as the Errors note says for a row.
- With `mt-4`, a `<p>` with `role="status"`, a label in `text-foreground`, uppercased as every label is. While a date is missing, or the day of leaving is not after the day of arriving, it reads `Choose the days you arrive and leave`. With two good dates it says the nights in words: `3 nights · Friday 14 May 2027 to Monday 17 May 2027`, each date a `<time>`. Unlike the confirmations in the layout notes, this element holds its first text from the start: it is a line that changes, not a message that replaces a form.
- With `mt-2`, a `<p>` of helper text in `font-mono text-label text-muted-foreground`, a sentence, not uppercased: "Rooms from £78 a night, breakfast included. Nothing is paid until we confirm your stay."

On a phone the four items stack, 24px apart, the button last and at the full width.

### 4. Three of the rooms

A section with the hairline from the layout notes:

- A label line in `text-muted-foreground`: `Six rooms · From £78 a night`.
- With `mt-2`, an `<h2>`: "Three of our rooms".
- With `mt-4`, one sentence in `text-body`: "Each room is named for a plant that grows on the cliff path, and no two are alike."
- With `mt-6`, a `<ul>` with no markers and no padding, `grid gap-6 md:grid-cols-3`: three equal columns, the one even row on the page. No `md:items-start` is needed. Each `<li>` holds, in block flow:
  - A plate with no caption, `aspect-4/3`.
  - With `mt-4`, the room's name as an `<h3>` in `text-h2`.
  - With `mt-2`, a `<p>` label in `text-foreground`, the room's three facts: `Sleeps 2 · King bed · Sea view`.
  - With `mt-2`, a `<p>` label in `text-muted-foreground` with `tabular-nums`, the price per night: `From £128 a night`.
  - With `mt-4`, an onward link from the layout notes.

  The three rooms, in this order:
  1. Marram: `Sleeps 2 · King bed · Sea view`, `From £128 a night`, the link "See Marram" to `/rooms/marram`. Plate: the window at `left-1/6`; `aria-label` "The bay window of Marram, with the bed facing the sea".
  2. Thrift: `Sleeps 2 · Double bed · Garden view`, `From £104 a night`, the link "See Thrift" to `#`. Plate: the window at `right-1/6`, the ground `h-1/2`; `aria-label` "Thrift on the ground floor, its door open to the walled garden".
  3. Tamarisk: `Sleeps 4 · King bed and two singles · Harbour view`, `From £164 a night`, the link "See Tamarisk" to `#`. Plate: the window at `left-1/6`, the ground `h-1/4`; `aria-label` "Tamarisk under the eaves, two rooms joined by a short landing".
- With `mt-6`, a `<p>` holding a `secondary` button that is a link: "See all six rooms", to `/rooms`.

### 5. The house

A section with the hairline, holding a grid and, after it, a guest's words.

The grid (`grid gap-6 md:grid-cols-12 md:items-start`):

- In columns 1–7 (`md:col-span-7`): a `<figure>` with a plate, `aspect-4/3`, the window at `left-1/6` and the ground `h-1/2`, with the `aria-label` "Kittiwake House seen from the quay, the third house of Harbour Terrace, with its white veranda", and the caption `Harbour Terrace from the quay`.
- In columns 9–12 (`md:col-span-4 md:col-start-9`): a label line in `text-muted-foreground`, `Since 1894`, with the year in a `<time dateTime="1894">`; with `mt-2` an `<h2>`, "The house"; with `mt-4` two short paragraphs in `text-body`, the second with `mt-4`. Sample: "The harbour pilot built this house in 1894, with a glazed veranda across the front so that he could watch for ships and stay dry. We have kept it since 2016 and changed as little as we could." and "There are six rooms, a breakfast room that opens onto the veranda, and a walled garden at the back. The quay is at the foot of the terrace steps."

After the grid, with `mt-12`, the guest's words: a `<figure>` in columns 1–9 of a grid of its own (`grid gap-6 md:grid-cols-12`, the `<figure>` with `md:col-span-9`):

- A `<blockquote>` holding one `<p>` in `font-heading text-h2 italic md:text-h1`, in curly quotation marks: “We meant to walk the cliff path every day. Mostly we sat on the veranda and watched the boats come in.” It has no border and no fill.
- With `mt-4`, a `<figcaption>`, a label in `text-muted-foreground`: `Ines and Paul · Stayed in Marram, April 2027`.

### 6. Breakfast in brief

A section with the hairline, as a grid (`grid gap-6 md:grid-cols-12 md:items-start`):

- In columns 1–4 (`md:col-span-4`):
  - A label line with the page's one badge beside it, in the row the Badges note gives: the label `Every morning` in `text-muted-foreground`, then the badge "Breakfast included".
  - With `mt-2`, an `<h2>`: "Breakfast on the veranda".
  - With `mt-4`, one or two sentences in `text-body`: cooked to order, with eggs from the farm on the hill and kippers from the smokehouse on the quay, and served at the hours listed here. Do not write "below" or "beside": the hours sit under the text on a phone and beside it from `md` up.
  - With `mt-6`, an onward link: "See the menu", to `/menu`.
- In columns 6–12 (`md:col-span-7 md:col-start-6`):
  - Rows of times from the layout notes, four rows, each span of hours two `<time>` elements:
    - Breakfast, every day: `08:00–10:00`
    - Breakfast on Sundays: `08:00–10:30`
    - Tea and cake on the veranda: `15:00–17:00`
    - Supper, Thursday to Saturday: `18:30–20:30`
  - With `mt-4`, one sentence in `text-body`: "Supper is a short menu of three courses. Tell us by 14:00 if you would like a table.", with `14:00` in a `<time>`.

### 7. Find us

A section with the hairline, the `id` `find-us` and `scroll-mt-6`, as a grid (`grid gap-6 md:grid-cols-12 md:items-start`):

- In columns 1–4 (`md:col-span-4`):
  - A label line in `text-muted-foreground`: `Port Lowan`.
  - With `mt-2`, an `<h2>`: "Find us".
  - With `mt-4`, an `<address className="not-italic">` in `text-body` with three block `<span>`s: `Kittiwake House`, `9 Harbour Terrace`, `Port Lowan LW6 3QT`.
  - With `mt-4`, a `<p>` holding `01632 960 352` as a link in running text to `tel:+441632960352`; with `mt-2`, a `<p>` holding `stay@kittiwakehouse.example` as a link in running text to `mailto:stay@kittiwakehouse.example`.
- In columns 6–12 (`md:col-span-7 md:col-start-6`):
  - A label heading, an `<h3>`: "Getting here".
  - With `mt-4`, rows from the layout notes, three rows; the figures are plain labels, not `<time>` elements:
    - Port Lowan station: `12 min on foot`
    - Harbour bus stop, routes 7 and 18: `2 min on foot`
    - Quay car park, free for guests: `4 min on foot`
  - With `mt-12`, a label heading, an `<h3>`: "Arriving and leaving".
  - With `mt-4`, rows from the layout notes, three rows:
    - Arrive: `15:00–20:00`, two `<time>` elements
    - Leave by: `10:30`, a `<time>`
    - Later than 20:00, with `20:00` in a `<time>`: `By arrangement`

### 8. Footer

The footer from the layout notes.

### Behavior

- Keep the two dates and the guests in component state. "Today" and "tomorrow" come from the visitor's clock. Work with the calendar dates as written: read the year, the month and the day from a field's value and count with `Date.UTC`, so that no time zone moves a day. The number of nights is the number of days from the day of arriving to the day of leaving.
- The status line follows the fields as they change. It is the only thing on the page that announces itself.
- When the form is sent, check the two dates in code, in this order, one message per field:
  - Arrive: empty gives "Choose the day you arrive."; a day before today gives "Choose today or a later day." The calendar cannot pick such a day, but a page left open past midnight can hold one, so keep the check.
  - Leave: empty gives "Choose the day you leave."; a day that is not after the day of arriving gives "Choose a day after the day you arrive." While Arrive is empty, Leave gets only its empty check.
  - The guests are always valid.
- With an error, stop the form from being sent, show the lines under the row and move focus to the first field with an error, as the Errors note says.
- With two good dates, let the form go: do not stop it. The browser then opens `/reserve?arrive=2027-05-14&leave=2027-05-17&guests=2`, with the values of the three fields, which their hidden inputs carry. Nothing is checked against real bookings: the reservation page takes it from there.
- "Find us" in the header jumps to the Find us section; `scroll-mt-6` keeps its hairline clear of the top edge.
- The other links need no behavior.
