---
page: guesthouse room page
title: Room
description: the page of one room in a small guesthouse, with a group of drawn pictures, a description, a list of facts, what is included, a table of prices per night by season, and a panel with the price and the one action to request the room.
order: 3
checks:
  - "The pictures are one `<figure>` of three plates drawn from plain elements, each with the img role and its own `aria-label`, under one caption; none sits inside a card."
  - "The facts are a `<dl>` with a hairline between its rows and the terms in the mono font; the size reads 22 m² and is not uppercased."
  - "The prices by season are a table with real `<th>` cells that are not bold, a visually hidden caption, and a box that can be reached with the keyboard; the three prices are £128, £152 and £178."
  - "The panel is a card with the price in the heading font and the page's one default (slate) button, Request this room, which goes to `/reserve?room=marram`; on a phone the panel comes before the description."
  - "What is included is the page's only `bg-clay` element, with ink text in both modes and no link or button in it; Sea view is the page's one badge."
  - "No heading is bold, nothing on the page is italic, and nothing is a pill or a circle."
---

Sample content, if the user gave none: **Marram**, the fourth of the six rooms of **Kittiwake House**, the invented guesthouse described in the layout notes: on the first floor at the front of the house, with a bay window that faces south over the harbour wall to the sea. A king bed, 22 m², sleeps 2. £128 a night in winter, £152 in spring and autumn, £178 in summer, breakfast included. Every name is invented. Where this brief gives a paragraph only in outline, write it yourself, plain and exact.

Build these parts in order. This page needs `npx shadcn@latest add badge table`.

### 1. Header

The header from the layout notes. This page is one room, not the list of rooms, so here, in place of the notes' `aria-current="page"`, the "Rooms" link gets `aria-current="true"` and `underline`, and keeps `/rooms`.

### 2. Opening

The first section, with `pt-12`. It holds a grid and, after it, the pictures.

In columns 1–8 of the grid (`grid gap-6 md:grid-cols-12`, the `<div>` with `md:col-span-8`):

- A label line with the page's one badge beside it, in the row the Badges note gives: the label `Room 4 of 6 · First floor` in `text-muted-foreground`, then the badge "Sea view".
- With `mt-2`, the `<h1>` in `text-h1 lg:text-display`: "Marram". No italic here.
- With `mt-4`, a `<p>` in `text-body`: "The bay window at the front of the house, with the sea in all three panes."

After the grid, with `mt-6`, the pictures: one `<figure>` holding a grid of three plates and, after the grid, one caption.

- The grid is `grid gap-6 md:grid-cols-12`, with no `md:items-start`: from `md` up the large plate stretches to the height of the two small ones.
- The large plate, in columns 1–8 (`md:col-span-8`): `aspect-4/3 md:aspect-auto` (from `md` up it has no ratio of its own and takes the height of the row), the window at `left-1/6`; `aria-label` "The bay window of Marram, with the bed facing the sea".
- In columns 9–12 (`md:col-span-4`), a `<div>` with `grid grid-cols-2 gap-6 md:grid-cols-1`, holding two plates, each `aspect-4/3`: side by side on a phone, one above the other from `md` up.
  - The window at `right-1/6`, the ground `h-1/2`; `aria-label` "The writing table in the bay, two chairs and the harbour wall below".
  - The window at `right-1/6`, the ground `h-1/4`; `aria-label` "The bathroom of Marram, a deep bath under a small window".
- The `<figcaption>`, with `mt-2`: `Marram · The bay window, the writing table and the bath`.

### 3. The room

A section with the hairline from the layout notes, as a grid (`grid gap-6 md:grid-cols-12 md:items-start`) with two items. The panel comes first in the code, so that on a phone the price and the action stand before the description; from `md` up both items have `md:row-start-1`.

**The panel**, in columns 9–12 (`md:col-span-4 md:col-start-9 md:row-start-1`), with `md:sticky md:top-6`: an `<aside>` that is a card, with the `aria-label` "Price and request". Inside it:

- A label in `text-muted-foreground`: `From`.
- With `mt-2`, a `<p>` with `flex items-baseline gap-2`: the price `£128` in a `<span>` with `font-heading text-h1 tabular-nums`, then `a night` in a `<span>`, a label in `text-muted-foreground`.
- With `mt-2`, a label in `text-foreground`: `Sleeps 2 · Breakfast included`.
- With `mt-6`, a facts list from the layout notes, three rows: Arrive (`15:00–20:00`, two `<time>` elements in the `<dd>`'s body text, not a label), Leave by (`10:30`, a `<time>`), July and August (`Two nights or more`). It has only hairlines, no corners, so it is not a card in a card.
- With `mt-6`, a `<p>` holding the page's one default button, an `<a>` styled as a button with `w-full whitespace-normal text-center` added, so its words can wrap where the panel is narrow: "Request this room", to `/reserve?room=marram`.
- With `mt-4`, a `<p>` of helper text in `font-mono text-label text-muted-foreground`, a sentence, not uppercased: "A request, not a payment. We reply within a day."

**The description**, in columns 1–7 (`md:col-span-7 md:col-start-1 md:row-start-1`), a `<div>` in block flow:

- A label line in `text-muted-foreground`: `At the front of the house`.
- With `mt-2`, an `<h2>`: "The room".
- With `mt-4`, three paragraphs in `text-body`, the second and third with `mt-4`. Say that this was the room the harbour pilot kept for himself, and that the bay window faces south over the harbour wall, so the sun is in it from breakfast until late afternoon; that the bed is a king with linen sheets and wool blankets, and a writing table with two chairs stands in the bay; and that the bathroom has a deep bath with a shower over it, and the room is above the breakfast room, so the first kettle can be heard at about 07:30, in a `<time>`.
- With `mt-12`, a label heading, an `<h3>`: "The facts".
- With `mt-4`, a facts list from the layout notes, six rows:
  - Bed: King bed, 150 cm wide
  - Size: 22 m²
  - View: The sea, through a bay window
  - Floor: First floor, 16 stairs, no lift
  - Sleeps: 2 guests
  - Bathroom: A bath with a shower over it
- With `mt-12`, the page's clay block, holding:
  - A label with no text color class, so it takes the block's ink: `In the price of the room`.
  - With `mt-2`, an `<h3>` in `text-h2`: "What is included".
  - With `mt-6`, a `<ul>` with no markers and no padding, `grid gap-x-6 gap-y-2 md:grid-cols-2`, of six items. Each `<li>` is `flex items-start gap-2` in `text-body`: the `Check` icon with `mt-1 shrink-0`, then the words. The items: "Breakfast on the veranda, from 08:00 to 10:00" (each time a `<time>`), "Linen sheets and wool blankets", "A kettle, loose tea and fresh milk", "Towels, soap and a hot water bottle", "Wifi through the house", "Free parking at the quay".

### 4. Prices by season

A section with the hairline, as a grid (`grid gap-6 md:grid-cols-12 md:items-start`):

- In columns 1–4 (`md:col-span-4`): a label line, `Per night · Breakfast included`; with `mt-2` an `<h2>`, "Prices by season"; with `mt-4` one sentence in `text-body`: "The price is for the room, for one guest or two, and each night is charged at the price of its season."
- In columns 6–12 (`md:col-span-7 md:col-start-6`): the table, then with `mt-4` a `<p>` of helper text in `font-mono text-label text-muted-foreground`, a sentence, not uppercased: "In July and August we take stays of two nights or more."

**The table.** The shadcn `Table` as the layout notes describe, with `label="Prices by season"` and a visually hidden `<caption>` with the same words. Three columns: Season, Dates, A night. Header cells have `scope="col"`; the last also has `text-right`. Three rows:

| Season | Dates | A night |
|---|---|---|
| Winter | 1 November to 31 March | £128 |
| Spring and autumn | 1 April to 30 June, and 1 September to 31 October | £152 |
| Summer | 1 July to 31 August | £178 |

The season in each row is a `TableHead` with `scope="row"`, given `h-auto`, the body cells' classes and `font-sans text-body font-normal text-foreground text-left` in place of the header look. The dates are plain text in `text-body`. The price is a label with `tabular-nums whitespace-nowrap text-right`, its `whitespace-nowrap` in place of the body cells' `whitespace-normal`, here in `text-foreground` and not muted, because the three figures are what the table is for. At 375px the table fits: the season and the dates wrap, the price does not.

### 5. Other rooms

A section with the hairline, as a grid (`grid gap-6 md:grid-cols-12 md:items-start`):

- In columns 1–4 (`md:col-span-4`): a label line, `Five more rooms`; with `mt-2` an `<h2>`, "Other rooms".
- In columns 6–12 (`md:col-span-7 md:col-start-6`): rows from the layout notes, three rows. In each, the name is a link to `#`, styled as a name that is a link, and the figure is the price per night, here in `text-muted-foreground` as the Prices note says:
  - Samphire: `From £112 a night`
  - Sea Holly: `From £142 a night`
  - Thrift: `From £104 a night`

  Then, with `mt-6`, an onward link: "See all six rooms", to `/rooms`.

### 6. Footer

The footer from the layout notes.

### Behavior

- Nothing on this page has state. From `md` up the panel stays in view while the description scrolls past it (`md:sticky md:top-6`); on a phone it is an ordinary block under the pictures.
- "Request this room" is a plain link: the reservation page reads the room from the address.
- The other links need no behavior.
