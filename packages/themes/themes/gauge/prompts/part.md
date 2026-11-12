---
page: part page
title: Part
description: one part's page as a spec sheet, with a drawing of the part in outline with its dimensions, its part number, stock and lead time, price breaks by quantity, a quantity field with Add to quote, and a full specification table.
order: 2
checks:
  - "The drawing is plain elements in 1px lines of the text color with square corners, has `aria-hidden=true`, and its caption gives every dimension in words."
  - "The part number `TVL-2047-RS` is in the `<h1>` in full, in the mono font, and no figure on the page is rounded beyond the decimals the brief gives."
  - "The price break that applies to the quantity typed is marked in bold and in words, and the line total follows the quantity."
  - "A quantity that is not a whole number from 1 to 10,000 gets an error in words with an icon, tied to the field, and Add to quote then adds nothing."
  - "After Add to quote a confirmation is announced from a `role=status` element that was on the page from the start, and the only default button on the page is Add to quote."
---

Sample content, if the user gave none: "Torvale Bearings Ltd" and its part `TVL-2047-RS`, a deep groove ball bearing with a 20 mm bore, a 47 mm outside diameter and a 14 mm width, with two rubber seals. Dynamic load rating 13.40 kN, static load rating 6.55 kN, limiting speed 13,000 r/min, mass 0.103 kg, operating temperature −30 to +110 °C. 1,240 in stock at Brigholt; more in 10 working days. Price breaks per bearing: 1 to 49 at £2.94, 50 to 249 at £2.61, 250 to 999 at £2.28, 1,000 and over at £1.97.

This page is divided into sections: the container inside `<main>` is `flex flex-col gap-12` with two items, a `<div>` with `flex flex-col gap-6` holding the page header and the grid row of parts 3 and 4, then the Specification section.

This page uses the stock `button`, `input` and `table`; add any the project lacks with `npx shadcn@latest add button input table`.

Build these parts in order; the footer is as the layout notes describe it.

### 1. Header

The product's name, the four nav links with Catalogue marked as the current section (`aria-current="true"`, as the Breadcrumb note says), the sales line at the right end from `md` up, and the "Menu" button below `md`.

### 2. Page header

On the left, the breadcrumb: `Catalogue` (`/catalogue`), `Deep groove` (`/catalogue`) and the current step `TVL-2047-RS`. Then the `<h1>` "TVL-2047-RS" in `font-mono text-h1`, and under it, as the stack's last item, one line in `text-body`: "Deep groove ball bearing, 20 × 47 × 14 mm, two rubber seals". On the right, two actions: links styled as `secondary` buttons, "Compare" (`/compare`) and "Data sheet" (`/downloads`).

### 3. Drawing

A grid row. The drawing is a panel spanning five columns from `lg` up, full width below, with the heading `<h2>` "Drawing" and, at the right end of its heading row, a small figure, `Dimensions in mm`. Its content is a `<figure>` with `flex flex-col gap-4`.

The drawing is the figure's first item, a `<div>` with `aria-hidden="true"` and `flex items-start justify-center gap-2 py-6`. It is a side view of the bearing at 4px to the millimetre: the bearing's axis runs across, so its width B is the drawing's width and its outside diameter D its height. Every size below is an inline `style` in pixels, worked out in code from the part's millimetres times 4, so another part draws right. Every line is 1px `border-foreground`; no box has a `rounded-*` class or a fill. Three items, left to right:

1. **Bore dimension:** a `<div>` with `flex items-center gap-2`, as tall as the body (`height` 188px, D × 4): a label `d 20` in `font-mono text-label tabular-nums text-foreground`, then a bracket, `w-2 border-y border-l border-foreground`, `height` 80px (d × 4). The parent centers it, so it spans the bore.
2. **The part:** a `<div>` with `flex flex-col items-center gap-2`. First the body, `relative border border-foreground`, `width` 56px (B × 4) and `height` 188px (D × 4). Inside it, the bore as two hidden lines, each `absolute inset-x-0 border-t border-dashed border-foreground`: the upper one with `top` 54px and the lower one with `bottom` 54px, both (D − d) / 2 × 4. Under the body, the width dimension: a bracket `h-2 self-stretch border-x border-b border-foreground`, then the label `B 14`, styled as the other labels.
3. **Outside dimension:** a `<div>` with `flex gap-2`, `height` 188px: a bracket `w-2 self-stretch border-y border-r border-foreground`, then the label `D 47`, which sits in the middle of the height (`self-center`).

The drawing is about 190px wide, which fits the panel at 375px. The `<figcaption>`, the figure's last item, is a small figure: "Side view of TVL-2047-RS. Bore d 20 mm, outside diameter D 47 mm, width B 14 mm. The dashed lines show the bore."

### 4. Price and stock

A panel spanning seven columns from `lg` up, full width below, with the heading `<h2>` "Price and stock". Under its heading row, three parts, the panel's `gap-4` between them:

**Stock.** A `<dl>` as the Description lists note sets it, with three rows:

- "Stock": the stock state "In stock" with its success dot, then, `gap-2` after it in a `flex flex-wrap items-center justify-end gap-2`, the small figure `1,240 at Brigholt`.
- "Dispatch": "Same working day if ordered by 15:00", a phrase in `text-body`.
- "Lead time beyond stock": "10 working days", a phrase in `text-body`.

**Price breaks.** A stack with `gap-3`: an `<h3>` "Price breaks" as the Headings note sets it, then the shadcn `Table` with the label "Price breaks" and three columns: "Quantity" (the range, `1 to 49`, `50 to 249`, `250 to 999`, `1,000 and over`, in `font-mono tabular-nums`, right-aligned, header too), "Unit price (£)" (`2.94`, `2.61`, `2.28`, `1.97`, right-aligned, header too) and "Your quantity" (left-aligned). This table sits in a padded panel, so the first and last cells of every row, the header row included, get `first:pl-0 last:pr-0`, and its edges line up with the text above. The row that the quantity in the field falls in is marked in weight and in words, never by a fill: its three cells get `font-bold`, and its last cell holds the word "Applies" in `text-body`; the other rows' last cells are empty. While the field holds no valid quantity, no row is marked.

**Add to quote.** A `<form>` with `noValidate`, then the confirmation element, in one plain `<div>`. The form is a stack with `gap-4`:

- A row, `flex flex-wrap items-end gap-3`: the field "Quantity" in a wrapper with `w-32`, an `Input` with `inputMode="numeric"`, the quantity look of the Inputs note, starting at `1`; and the default button "Add to quote" with `type="submit"`. The field's helper text and its error line go under the row, not in the narrow wrapper: a stack with `gap-2` after the row holds the helper text, a small figure, "1,240 in stock. Larger orders ship in 10 working days.", and the error line when there is one. The field names both in its `aria-describedby`.
- The line total, a stack with `gap-1`: the label "Line total", then the total in `font-heading text-h1 tabular-nums`, `£2.94` for 1, then a small figure with the sum, `1 at £2.94 each`. While the field holds no valid quantity, the total reads `£0.00` and the small figure "Enter a quantity to see the price.".

The confirmation, rendered inside the status element only after a click, is a `<p>` with `mt-3 flex items-start gap-2 text-body`: the `Check` icon in `text-success`, then "Added to your quote: 250 at £2.28 each, £570.00." and, after one space, a text link "View quote" to `/quote`.

### 5. Specification

A `<section>` named by its `<h2>` "Specification" in `text-h2`, laid out as `flex flex-col gap-4`, then a grid row:

**Specification table.** A panel with rows spanning eight columns from `lg` up, full width below, with no heading row of its own: the section's `<h2>` names it. The shadcn `Table` with the label "Specification" and four columns: "Property" (in `text-body`), "Symbol" (`font-mono`), "Value" (right-aligned, header too) and "Unit" (`font-mono`). A value that is a figure is `font-mono tabular-nums`; a value that is a phrase is `text-body`. A row with no symbol or no unit leaves that cell empty. The fourteen rows, in this order:

1. Bore diameter, d, 20, mm
2. Outside diameter, D, 47, mm
3. Width, B, 14, mm
4. Dynamic load rating, C, 13.40, kN
5. Static load rating, C0, 6.55, kN (write `C0` as two plain characters: a `<sub>` would take a size outside the type scale)
6. Limiting speed, no symbol, 13,000, r/min
7. Mass, no symbol, 0.103, kg
8. Operating temperature, no symbol, `−30 to +110`, °C
9. Seals, no symbol, "Two rubber seals, RS", no unit
10. Cage, no symbol, "Pressed steel", no unit
11. Ring material, no symbol, "Chrome steel, 100Cr6", no unit
12. Grease, no symbol, "Lithium, 20% fill", no unit
13. Radial clearance, no symbol, "CN, normal", no unit
14. Precision class, no symbol, "P0, normal", no unit

**Documents.** A panel with rows spanning four columns from `lg` up, full width below. Heading row: the `<h3>` "Documents" in `text-h2` (an `<h3>`, to keep heading order under the section's `<h2>`) and, at its right end, a text link "All documents" to `/downloads`, as a label in `text-foreground`. Three rows, each a stack with `gap-1`: a text link to `#` in `text-body`, then a small figure.

- "Data sheet, TVL-2047-RS", then `PDF · Rev C · 0.84 MB`
- "3D model, TVL-2047-RS", then `STEP · Rev C · 1.62 MB`
- "Certificate of conformity, 2026", then `PDF · Rev A · 0.21 MB`

### Behavior

- The quantity field is read as a whole number after trimming spaces and dropping thousands commas, so `1,000` is 1000. A valid quantity is a whole number from 1 to 10,000. While the field holds one, the line total, its small figure and the marked price break follow it at every keystroke: 250 gives `£570.00` and `250 at £2.28 each`; 1,000 gives `£1,970.00` and `1,000 at £1.97 each`. Totals are worked in pence, so they never come out as `£569.9999`.
- "Add to quote" checks the field. Empty: "Enter a quantity." Anything else that is not valid: "Enter a whole number from 1 to 10,000." Focus moves to the field after the error line is rendered. With a valid quantity it puts the confirmation into the status element, worded from the quantity, its unit price and its total; a second click replaces it with the new wording. The quote is not stored: the quote page has its own sample lines.
- "Add to quote" is never disabled, so no button on this page gets `focusableWhenDisabled`, and `components/ui/button.tsx` needs no `data-disabled:` classes.
- "Compare", "Data sheet" and the links need no behavior beyond their `href`.
