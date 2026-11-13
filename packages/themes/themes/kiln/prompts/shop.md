---
page: shop home page
title: Shop home
description: the storefront of a small ceramics studio, with one piece in a large opening, a line about the studio, featured pieces, a note on how they are made and a newsletter sign-up.
order: 1
checks:
  - The opening shows a single piece, and its `<h1>` is the page's only `text-display` text, from `lg` up.
  - The featured pieces are two to a row at 375px and four to a row on a wide screen, and each tile is one link holding the name, the glaze and a price in mono figures.
  - No screenful shows more than one terracotta (default) button.
  - The email field has a visible label, a wrong address gets a message in words with an icon, and a good one is replaced by a confirmation that a screen reader announces.
  - No text on the page is uppercased.
---

Sample content, if the user gave none: "Whitlow Pottery", a stoneware studio of two potters, Nell Varga and Tomas Reid, at Unit 3, Coldharbour Yard, Bramwick BW4 2LT. They make tableware and vases in small batches and fire the kiln about once a month; the last firing came out on 6 November 2026. Glazes are Ash (pale grey-white), Oat (pale cream), Iron (dark brown) and Slate (dark blue-grey). Prices are in pounds.

Build these parts in order.

### 1. Header

The header from the layout notes. "Shop" is the current page. The basket holds 3 pieces.

### 2. Opening

The first section of `<main>`, a 12-column grid with `md:items-center`.

- Columns 1–5: a label in `text-muted-foreground`, "Hand-thrown in Bramwick"; with `mt-2` the `<h1>` in `text-h1`, and `lg:text-display` from `lg` up, so it fits a phone and the narrow column of a tablet: "Stoneware for every day, made by two people"; with `mt-4` one paragraph of two sentences on what the studio makes; with `mt-6` a block element holding a link styled as the default button, "Shop tableware", to `/tableware`. This is the page's first terracotta button.
- Columns 7–12: one piece and a lot of clay around it. A `<figure>` with a picture in `aspect-4/5`, as the Pictures note says, showing a tall jug in Ash glaze: the piece is drawn pale, `h-1/2 w-2/5 bg-glaze-pale border border-foreground/40` with square corners. Its `aria-label` is "Tall jug in ash glaze, seen from the side". The caption: "Tall jug, ash glaze, £64.00", the caption muted and the price in a `<span>` in `tabular-nums text-foreground`, as the Prices note says.

Below `md` the figure comes under the text: give its column `mt-10 md:mt-0`.

### 3. About the studio

A `<section>` with the `aria-label` "About the studio", a 12-column grid. Columns 1–8: one sentence as a `<p>` in `font-heading text-h2`; it is set large, not as body text, so here, instead of the Measure note's `max-w-lg`, it fills the eight columns. For example "Every piece is thrown, trimmed and glazed by hand in a converted dairy at the edge of Bramwick, and no two come out of the kiln the same." Then with `mt-4` a block element holding a text link in running-text style, "Read about the studio", to `/studio`.

### 4. New from the kiln

The section heading row from the layout notes: the `<h2>` "New from the kiln" and the link "See all tableware" to `/tableware`. Then with `mt-6` a grid of eight product tiles, as the Product tiles note says. Each picture is `aspect-square`. The pieces, with name, glaze, price and badge:

- Moor mug, Ash, £28.00
- Fold bowl, Iron, £34.00, badge "New"
- Tumbler, set of two, Slate, £36.00
- Side plate, Oat, £22.00
- Espresso cup, Iron, £18.00
- Serving bowl, Ash, £72.00, badge "Last one"
- Bud vase, Slate, £30.00, badge "New"
- Dinner plate, Oat, £32.00

Each piece is drawn in the shape the Pictures note gives for its kind (a mug, a cup and a vase tall; a bowl low; a plate flat), dark for Iron and Slate, pale for Ash and Oat. Each link goes to the piece's address, as the Product tiles note says: `/tableware/fold-bowl`, `/tableware/tumbler-set-of-two`; the bud vase's goes to `/vases/bud-vase`. Add the `Badge` with `npx shadcn@latest add badge`.

### 5. How a piece is made

The `<h2>` "How a piece is made". Then with `mt-6` a list (`<ol>`) of three steps, `grid gap-y-6 md:grid-cols-3 md:gap-x-6`, with no markers and no padding. Each step has a 1px top border and `pt-4`:

- A label in `text-muted-foreground` with the step's number, `Step 1`, `Step 2`, `Step 3`.
- With `mt-2` a title as an `<h3>` in `font-sans text-body font-medium`: "Thrown on the wheel", "Trimmed and dried", "Glazed and fired".
- With `mt-2` a paragraph of two sentences. Put the real times in the text: a mug dries for about a week; the glaze firing reaches 1,260°C and the kiln takes two days to cool.

Then with `mt-10` a block element holding a text link, "See the whole process", to `/studio#process`.

### 6. Firing notes

A 12-column grid. Columns 1–7 hold a card, as the Cards note says, with the `id` `newsletter`:

- The `<h2>` "Firing notes".
- With `mt-4` one sentence: one email when the kiln opens, about once a month, with what came out and when it goes on sale.
- With `mt-6` the wrapper that holds the form and the status element. The form: the label "Email address", then with `mt-2` (the row's, in place of the field's) a row `flex flex-col gap-2 md:flex-row` with the email `Input` (add it with `npx shadcn@latest add input`; `type="email"`, `autoComplete="email"`, `md:flex-1`) and the default button "Sign up" (`type="submit"`). The row is the form's own child, and its children stretch to one height. Under the row, with `mt-2`, helper text: "No more than one email a month. Leave whenever you like." The error line, while there is one, comes last in the form, under the helper text. The `Input`'s `aria-describedby` names the helper text, then the error line while there is one.

This button is the page's second terracotta button. The opening's is the first, and the tiles and the steps stand between them, more than a screen's height at any width: keep the sections in this order, so that no screen shows both.

### 7. Footer

The footer from the layout notes.

### Behavior

- An empty or malformed address shows the error line: "Enter an email address, like name@example.com." A good one replaces the form, helper text included, with the confirmation, which takes focus as the Confirmations note says: "You are on the list. The next firing notes come when the kiln opens in early December."
- The "Menu" button opens and closes the small-screen menu and sets `aria-expanded`; Escape closes it as the notes say.
- The tiles, the basket link and the other links need no behavior.
