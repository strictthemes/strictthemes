---
page: collection page
title: Collection
description: one category of a small ceramics studio's shop, as a grid of product tiles with a category filter, a sort order, a count and an empty state.
order: 2
checks:
  - Choosing a category shows only its pieces, the chosen button has `aria-pressed="true"`, and the count above the grid says how many pieces are shown.
  - Each sort order really reorders the tiles, prices as numbers, and keeps the chosen category.
  - Choosing "Jugs" shows the empty state, and its button shows every piece again and moves focus to the "All" button.
  - The tiles are two to a row at 375px with no sideways scroll, and four to a row on a wide screen.
  - The page has no terracotta (default) button.
---

Sample content, if the user gave none: "Whitlow Pottery", a stoneware studio of two potters, Nell Varga and Tomas Reid, in Bramwick. This page is their Tableware collection. Glazes are Ash (pale grey-white), Oat (pale cream), Iron (dark brown) and Slate (dark blue-grey). The twelve pieces, in the studio's own order, with category, glaze, price and badge:

- Moor mug, Mugs and cups, Ash, £28.00
- Fold bowl, Bowls, Iron, £34.00, badge "New"
- Side plate, Plates, Oat, £22.00
- Espresso cup, Mugs and cups, Iron, £18.00
- Serving bowl, Bowls, Ash, £72.00, badge "Last one"
- Platter, Plates, Iron, £85.00, badge "New"
- Tumbler, set of two, Mugs and cups, Slate, £36.00
- Breakfast bowl, Bowls, Ash, £26.00
- Dinner plate, Plates, Oat, £32.00
- Beaker, Mugs and cups, Oat, £24.00, badge "Sold out"
- Nest of three bowls, Bowls, Slate, £58.00
- Pasta plate, Plates, Slate, £30.00

There are no jugs at the moment: the next ones come out of the December firing.

Build these parts in order.

### 1. Header

The header from the layout notes. "Tableware" is the current page. The basket holds 3 pieces.

### 2. Introduction

The first section of `<main>` holds this part and the next. It opens with a 12-column grid; its columns 1–7 hold a breadcrumb, then the `<h1>` and a paragraph.

- The breadcrumb is a `<nav>` with the `aria-label` "Breadcrumb" holding an `<ol>` in one row, `flex flex-wrap gap-2 font-mono text-label text-muted-foreground`: a link "Shop" to `/`, styled as a header link and so in `text-foreground`, a `/` with `aria-hidden="true"` and "Tableware" with `aria-current="page"`, both muted.
- With `mt-2` the `<h1>` in `text-h1`: "Tableware".
- With `mt-4` one paragraph: everything here is food-safe and goes in the dishwasher; no two pieces come out of the kiln quite the same.

### 3. Pieces

In the same section as the introduction, after its grid: first a visually hidden `<h2>`, "Pieces", so that the tiles' `<h3>` headings follow an `<h2>`; then, in this order:

**Controls.** With `mt-10` under the introduction's grid, a row, `flex flex-col gap-6 md:flex-row md:items-end md:justify-between`:

- At the left, the category filter: a visible label "Category" (a `<p>`, in `text-foreground`), then with `mt-2` a button group, as the notes say, named by that label, with All, Mugs and cups, Bowls, Plates and Jugs. "All" is chosen to start. On a phone the buttons wrap onto a second line.
- At the right, the sort order: the label "Sort by" and with `mt-2` a native `<select>` as the Selects note says, with Featured, Price: low to high, Price: high to low and Name: A to Z. Its wrapper is `w-full md:w-56`.

**Count.** With `mt-6` a label, a `<p>`, in `text-muted-foreground` with `aria-live="polite"`: "12 pieces", or "4 pieces", "1 piece", "No pieces". It counts what is shown.

**Grid.** With `mt-4` the grid of product tiles from the Product tiles note, in the order the sort gives. Each picture is `aspect-square`, the piece drawn in the shape the Pictures note gives for its kind (a mug, a cup, a beaker and a tumbler tall; a bowl low; a plate and a platter flat), dark for Iron and Slate, pale for Ash and Oat. Each tile links to the piece's address, as the Product tiles note says: `/tableware/nest-of-three-bowls`, `/tableware/tumbler-set-of-two`. Add the `Badge` with `npx shadcn@latest add badge`. The sold-out beaker stays in the grid with its "Sold out" badge and its price.

**Empty state.** When no piece matches, the grid is not rendered and in its place, with `mt-4`, stands a card, as the Cards note says, at most `max-w-lg` wide:

- An `<h3>` in `text-h2`: "No jugs just now". It is an `<h3>` because it stands under the hidden "Pieces" `<h2>`, in place of the tiles' `<h3>` headings.
- With `mt-4` one sentence: "The next jugs come out of the kiln in early December."
- With `mt-6` a `secondary` button "Show all pieces".

In the sample only Jugs is ever empty. Build the heading from the category's name in lower case ("No bowls just now"), so that any category that empties gets its own. The sentence's month holds for jugs only: for any other category it is "The next bowls come out of the next firing."

This page has no default (terracotta) button.

### 4. Delivery note

A 12-column grid. Columns 1–7 hold a card with an `<h2>` in `text-h2`, "Delivery and returns", and with `mt-4` two short paragraphs, `mt-4` apart: every piece is packed in recycled paper and posted within three working days; returns within 30 days, unused. The second paragraph ends with a running-text link, "Read the delivery terms", to `/delivery`, where the footer's "Delivery and returns" goes too.

### 5. Footer

The footer from the layout notes.

### Behavior

- Keep the category and the sort order in component state, and derive the shown pieces from both: filter by category first, then sort. Changing one keeps the other.
- "Featured" is the studio's own order above. The price orders compare the prices as numbers in pence; ties keep the studio's order. "Name: A to Z" ignores case.
- Choosing a category moves the pressed state to that button and leaves focus on it. The count updates in the same render, and its `aria-live` reads it out.
- "Show all pieces" sets the category back to All, keeps the sort order, and moves focus to the "All" button.
- The "Menu" button opens and closes the small-screen menu and sets `aria-expanded`; Escape closes it as the notes say.
- The tiles, the basket link and the other links need no behavior.
