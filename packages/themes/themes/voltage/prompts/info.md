---
page: information page
title: Info
description: the festival's practical information, with how to get there, opening times in a table, what to bring and what to leave at home, access, and questions that open and close.
order: 5
checks:
  - The opening times are a real table with header cells, every time is a `<time>` element, and on a phone the table scrolls inside its own box, which the keyboard can reach.
  - The lists of what to bring and what to leave at home say so in their headings, so that their icons are not the only sign.
  - Every question in the FAQ opens and closes with Enter and with Space, and shows the focus outline.
  - Every passage longer than two sentences sits on a white panel, not straight on the yellow page.
---

Sample content, if the user gave none: **Tremor Days**, a two-day music and design festival at Varsby Docks, Kajgatan 2, in the invented city of Varsby, on Friday 4 and Saturday 5 December 2026. The gates open at 16:00 on Friday and at 12:00 on Saturday, the last set ends at 00:30 on Friday and at 01:00 on Saturday, and last entry is at 22:00. The docks are a 12-minute walk from Varsby Central station, and tram 4 stops at the gate. Most of the site is indoors in old harbour halls; the Crane Stage is outdoors under a roof. All names and places are invented; the contact address is `info@tremordays.example`.

Build these parts in order, under the header from the layout notes, in which Info is the current page.

### 1. Page heading

A section with no heading row. Its stack has `gap-3`:

- A stack with `gap-2`: the label `Tremor Days · 4–5 Dec 2026`, its dates the range from the Numbers note, then the `<h1>` "Before you go".
- The address, straight on the page: an `<address>` with `not-italic` in `font-heading text-h2`, "Varsby Docks, Kajgatan 2, Varsby".

### 2. Getting there

A section. Its heading row holds the `<h2>` "Getting there". Then the grid from the layout notes with three panels, each `md:col-span-4`. Each panel is the stock panel with `gap-3`: an `<h3>` in `text-h2` ("By train", "By tram", "By bike"), a label line with the one fact that matters most (`12 min walk from Varsby Central`, `Tram 4 · Docks Gate stop`, `400 bike stands at the north gate`), and two sentences in `text-body` with the details. The trains and trams run late after both nights: the last train to Varsby Central leaves at 01:40 and the last tram 4 at 01:55. In those sentences the two times are `<time>` elements in the sentence's font, with the time alone as their `dateTime` (`01:40`), since it holds after both nights.

### 3. Opening times

A section. Its heading row holds the `<h2>` "Opening times".

One panel across the full width, with `gap-5`, holding the shadcn `Table` (add it with `npx shadcn@latest add table`) as the Tables note sets it up, with the `label` "Opening times". Columns: Day, Gates open, First set, Last set ends, Last entry. Two rows:

- Friday 4 December: 16:00, 17:00, 00:30, 22:00.
- Saturday 5 December: 12:00, 13:00, 01:00, 22:00.

The header cells are `TableHead` with `scope="col"`. The day in each row is a `<th scope="row">` with the body cells' padding (`px-3 py-2 first:pl-0`), `whitespace-nowrap align-middle`, as the stock `TableCell` has, plus `text-left text-body font-bold`, and its date in a `<time dateTime="2026-12-04">`. Every time is a `<time>` with a full `dateTime` and the offset, in `font-mono tabular-nums`; a set that ends after midnight ends on the next date (`2026-12-05T00:30+01:00`, `2026-12-06T01:00+01:00`). The stock cells do not wrap, so on a phone the table is wider than its panel and scrolls inside its box.

Under the table, in the panel's stack, small print: "Weekend wristbands can leave and come back until 22:00." It is a sentence, so 22:00 is plain text, not a `<time>`.

### 4. What to bring

A section. Its heading row holds the `<h2>` "What to bring". Then the grid with two panels, each `md:col-span-6`. Each panel is the stock panel with `gap-5`:

- An `<h3>` in `text-h2`: "Bring" and "Leave at home".
- A `<ul>` with `flex flex-col gap-3`, no markers and no padding, the six items below, each a row with `flex items-start gap-2` in `text-body`. In the first list each item starts with the `Check` icon, in the second with the `X` icon, both `shrink-0 mt-1` (from the Icons note) and `aria-hidden="true"`: the heading says which list is which. Bring: your ticket on your phone or printed, a photo ID if you are 13 to 17, earplugs, a warm layer for the outdoor stage, a card or phone to pay (the site takes no cash), an empty bottle to fill. Leave at home: glass, large bags (bigger than 30 × 20 cm), umbrellas with a point, drones, your own food beyond a snack, professional cameras with a removable lens.

### 5. Access

A section. Its heading row holds the `<h2>` "Access". One panel across the full width, with `gap-5`:

- Two paragraphs in `text-body` in a stack with `gap-3`, each at most `max-w-xl`, one sentence each and no more: "The whole site is step-free, on hard ground." and "Any ticket comes with a free ticket for a companion on request."
- A list in running text, `list-disc pl-5` with `flex flex-col gap-3` in `text-body`, six items: a raised viewing platform at both music stages, a quiet room in the Drawing Office open all day, accessible toilets at every bar, sign language interpreters at every talk, assistance dogs welcome, and last "Strobe lighting in two sets: Ossa Bloom and Sister Antenna". The items are plain text, the act names too.
- A sentence with a text link to the email address: "Write to info@tremordays.example and we answer within two working days." The address is the link, `mailto:` the same address.

### 6. Questions

A section. Its heading row holds the `<h2>` "Questions". One panel across the full width, with `gap-0`, holding the shadcn `Accordion` (add it with `npx shadcn@latest add accordion`) with six items and the `multiple` prop (`<Accordion multiple>`), so more than one may be open at a time; Base UI's default is one.

- Each trigger gets `className="items-center gap-3 py-3 font-sans text-body font-bold"`, which replaces its stock size and weight. Keep its stock corner, its hover underline and its chevron icons.
- Each content gets `className="pb-3 text-body"`. Every answer is one short paragraph of one to three sentences, so the stock space between paragraphs never applies.
- Items keep the stock line between them, a 1px `border-border` line.
- Each trigger sits in the stock `<h3>`. A question is not a headline: the Headings note's five-word limit does not apply to it.

The questions: Can I leave and come back? What happens if it rains? Is there a cloakroom? Can I bring a camera? Can I change the name on my ticket? Do children need a ticket? Write plain, direct answers that agree with the rest of this page: re-entry until 22:00, most stages indoors, a cloakroom for €3, phone and compact cameras are fine, names can be changed until 1 December by writing to the address under Access (say so in words; the address and its link stay in Access), under-13s go free with an adult.

### 7. Footer

The footer from the layout notes.

### Behavior

- The `Accordion` opens and closes an item on a click, on Enter and on Space, which the stock component does; do not add your own key handling. Each trigger keeps `aria-expanded`, set by the component.
- The table's box is reachable with Tab at every width, also where it happens to fit.
- The email link and the menu button are the only other interactive parts. Besides the menu's open state and the `Accordion`'s own, the page has no state.
