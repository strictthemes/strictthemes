---
page: about page
title: House
description: the about page of a small fashion house, with a long heading, its story in a narrow column, a portrait of its founder, a timeline and the workshops where the clothes are made.
order: 4
checks:
  - The story's paragraphs sit in a column no wider than `max-w-md`, placed off-center in the grid from `md` up, and are set in the body font, not in the heading font.
  - The timeline is an ordered list with a `<time>` for each year, and each entry has a 1px top border.
  - The portrait is a picture with an `aria-label` and a caption that names the person and the photographer.
  - The workshops are a list, each with its town, what it makes and since when, and no workshop is shown as a card or with a fill.
---

Sample house, if the user gave none: **Maison Ardelle**, a small fashion house in Lyon. Inès Ardelle trained as a tailor in Lyon and cut coats for theatre for nine years before she opened the house in 2014 in two rooms above a print shop. The atelier moved to 7 rue Belvèze in 2019 and now has eleven people: five cutters and tailors, three in sewing, two in the shop and one who runs the office. The house makes two collections a year, never more than four hundred pieces of each design, and cuts much of it to order. Cloth comes from Lanificio Serra, a wool mill in Biella (since 2014), Tissage Vandamme, a linen weaver in Kortrijk (since 2017), and Seteria Olmo, a silk printer in Como (since 2021); knitwear is made by Tricots Pélissier, a family workshop in Yssingeaux, in the Haute-Loire (since 2020). The portrait is by the photographer Tomas Reyl.

Build these parts in order.

### 1. Header

The header from the layout notes. "House" is the current page, in the header and in the footer.

### 2. Opening

The first section, in the grid:

- A label line in `text-muted-foreground`, columns 1–12 (`md:col-span-12`): `The house · Lyon, since 2014`.
- With `mt-4`, the `<h1>` in `text-h1 md:text-display`, across columns 1–11 (`md:col-span-11`): a long heading of one sentence, twelve to sixteen words, that says what the house believes about clothes. Sample: "We make few clothes, cut them by hand, and mend what we made when it *wears*", with the one italic word in an `<em>`. It runs over three or four lines on a large screen, and that is the point.

### 3. Story and portrait

A section in the grid with two parts:

- **The portrait**, in columns 1–4 (`md:col-span-4`): a figure with its caption below. The picture is `aspect-3/4`, `bg-secondary`, with an `aria-label` such as "Inès Ardelle at the cutting table, a length of grey wool across it, chalk in her hand". Caption lines: `Inès Ardelle, founder`, then `Photograph · Tomas Reyl, 2026`.
- **The story**, in columns 6–10 (`md:col-start-6 md:col-span-5`), with `mt-16` on a phone and `md:mt-32` from `md` up, so it starts lower than the portrait: four paragraphs in `text-body`, each at most `max-w-md`, the second to fourth with `mt-4`. Tell how the house began, how a piece is made, why it makes so few, and what it does with what it does not sell. One link in running text, to the collection page, in the last paragraph.

### 4. A short history

A section in the grid, with its content in columns 6–12 (`md:col-start-6 md:col-span-7`):

- An `<h2>` in `text-h2`: "A short history".
- With `mt-8`, an `<ol>` as a list of entries (see the layout notes) with six entries. Each `<li>` is also `grid grid-cols-4 items-baseline gap-x-4`, with two grid items: in column 1 the year as a `<time dateTime="2014">` with `font-mono text-label uppercase tabular-nums text-muted-foreground`; and in the other three a `<p>` with `col-span-3`, one or two sentences in `text-body`. This holds at 375px too. Entries: 2014 the house opens, 2017 the first linen, 2019 the move to rue Belvèze, 2020 the knitwear workshop, 2021 the silk, 2026 *Still Water* and the mending service. The collection's name is upright here, as the Italic note says.

### 5. Where the clothes are made

A section in the grid:

- An `<h2>` in `text-h2`, columns 1–6 (`md:col-span-6`): "Where the clothes are *made*", with the one italic word in an `<em>`.
- With `mt-4`, in columns 1–5 (`md:col-start-1 md:col-span-5`, so it starts a new row under the heading), one sentence in `text-body`, at most `max-w-md`, saying that the clothes are cut and finished in Lyon from cloth made in three mills, and that the knitwear is made in a fourth workshop.
- With `mt-8`, a `<ul>` as a list of entries, across columns 1–12 (`md:col-span-12`). Five entries: the atelier in Lyon first (`Since 2014`), then the four mills and workshops. Each `<li>` is itself the row and also has `md:grid md:grid-cols-12 md:items-baseline md:gap-x-8`:
  - The town, an `<h3>` in `text-h2`, in columns 1–4 (`md:col-span-4`): Lyon, Biella, Kortrijk, Como, Yssingeaux.
  - What it makes and who runs it, one sentence in a `<p>` in `text-body`, at most `max-w-md`, in columns 5–9 (`md:col-span-5`), with `mt-2 md:mt-0`.
  - Since when, a `<p>` in `font-mono text-label uppercase tabular-nums text-muted-foreground` in columns 10–12 (`md:col-span-3`), with `mt-2 md:mt-0`: `Since 2017`, with the year in a `<time dateTime="2017">`.

No pictures in this list, no icons and no map.

### 6. Footer

The footer from the layout notes.

### On a phone

The heading wraps over five or six lines in `text-h1`. The portrait takes the full width, and the story starts `mt-16` under its caption. Each history entry keeps the year beside its text. Each workshop stacks: the town, then the sentence, then the year.

### Behavior

Nothing on this page has state. Links only.
