---
page: catalogue page
title: Catalogue
description: one category of a parts catalogue, with filters in a narrow column and a dense table of parts with their dimensions, load rating, stock state and unit price.
order: 1
checks:
  - "The filters sit in a column three of twelve wide from `lg` up, and the bore, seal and stock filters and the sort order work together on the table."
  - "Every dimension, load and price in the table is a right-aligned mono figure with `tabular-nums`, and its unit is in the column header, not in the cells."
  - "Every stock state is a status dot and a word, and the green and the red appear nowhere else on the page."
  - "The count in the table's heading row follows the filters, and an empty result shows a sentence and a Clear filters button that moves focus to the first checkbox."
  - "Sort by is the theme's `Select`, with no native `<select>` on the page: its list opens under its trigger, as wide as it, the chosen row is bold with a check, and the arrow keys, Enter and Escape work in it."
  - "At 375px the table scrolls sideways inside its own box, which can be reached with the keyboard, and the page itself does not scroll sideways."
---

Sample content, if the user gave none: "Torvale Bearings Ltd" and its category "Deep groove ball bearings", sealed and shielded, from its TVL range. The part number gives the bore and the outside diameter: `TVL-2047-RS` has a 20 mm bore and a 47 mm outside diameter; `RS` means two rubber seals, `ZZ` two metal shields. The twelve parts, in this order (part number, bore d, outside diameter D, width B in mm, dynamic load rating C in kN, stock state, unit price for 1 to 49 in pounds):

1. `TVL-1026-ZZ`, 10, 26, 8, 4.75, In stock, 1.42
2. `TVL-1030-RS`, 10, 30, 9, 5.50, In stock, 1.64
3. `TVL-1232-RS`, 12, 32, 10, 7.20, In stock, 1.78
4. `TVL-1535-ZZ`, 15, 35, 11, 8.10, Low stock, 1.96
5. `TVL-1740-RS`, 17, 40, 12, 9.90, In stock, 2.38
6. `TVL-2047-RS`, 20, 47, 14, 13.40, In stock, 2.94
7. `TVL-2047-ZZ`, 20, 47, 14, 13.40, Low stock, 2.71
8. `TVL-2552-RS`, 25, 52, 15, 14.60, In stock, 3.46, with the badge "New"
9. `TVL-3062-RS`, 30, 62, 16, 20.10, Made to order, 4.88
10. `TVL-3572-ZZ`, 35, 72, 17, 26.80, In stock, 6.52
11. `TVL-4080-RS`, 40, 80, 18, 32.20, Made to order, 8.15
12. `TVL-4585-RS`, 45, 85, 19, 34.90, Discontinued, 9.40

This page uses the stock `button`, `badge`, `checkbox`, `select` and `table`; add any the project lacks with `npx shadcn@latest add button badge checkbox select table`.

Build these parts in order; the footer is as the layout notes describe it.

### 1. Header

The product's name, the four nav links with Catalogue marked as the current section (`aria-current="true"` in both navs, as the Breadcrumb note says), the sales line at the right end from `md` up, and the "Menu" button below `md`.

### 2. Page header

On the left, the breadcrumb: `Catalogue` (a link to `/catalogue`), `Ball bearings` (a link to `#`) and the current step `Deep groove`. Then the `<h1>` "Deep groove ball bearings". On the right, one action: a link styled as a `secondary` button, "Range documents", to `/downloads`. This page has no default button: nothing on it is the one main action.

Under the page header row, as the next item of the container, one paragraph in `text-body`, at most `max-w-lg` wide: "Single-row bearings with a 20% grease fill, sealed or shielded on both sides. Chrome steel rings, pressed steel cage, normal clearance."

### 3. Filters

A grid row. The filters are a panel spanning three columns from `lg` up, full width below: an `<aside>` with the `aria-label` "Filters", holding a heading row with the `<h2>` "Filters" and, at its right end, a `secondary` button "Clear filters", disabled with the plain `disabled` prop while no filter is set. Under the heading row, four groups, each divided from the one before by a 1px rule: the group itself has `border-t border-border pt-4`, except the first. The panel's `gap-4` spaces them. The filters and the table keep the grid's stretch, so the row ends level: the shorter panel grows to the taller one's height.

- **Bore:** a group labelled "Bore (mm)" with three checkboxes, "10 to 17", "20 to 30" and "35 to 45", all clear.
- **Seals:** a group labelled "Seals" with two checkboxes, "Rubber seals, RS" and "Metal shields, ZZ", all clear.
- **Stock:** a group labelled "Stock" with one checkbox, "In stock only", clear.
- **Sort:** a field, not a `role="group"`: the field's `flex flex-col gap-3` stack plus the groups' `border-t border-border pt-4`, holding the label "Sort by" and a `Select`, as the Selects note sets it, with four choices: "Bore, smallest first" (chosen), "Part number, A to Z", "Load rating, highest first" and "Unit price, lowest first". It is not a filter: it does not enable "Clear filters".

### 4. Parts table

The table is a panel with rows spanning nine columns from `lg` up, full width below: a `<div>`, named by its `<h2>`, with `flex flex-col` beside the panel's classes, so that its note row (below) can sit at its foot when the filters are taller. Its heading row holds the `<h2>` "Parts" and, at its right end, the count as a small figure in an element with `aria-live="polite"`: `12 parts` with no filter set, and the "of" form whenever a filter is set, even if every part matches: `4 of 12 parts` when filters leave four (`12 of 12 parts`, `1 of 12 parts`, `0 of 12 parts`).

The shadcn `Table` with the label "Parts", one row a part, and these columns, with these headers:

- **Part number:** the part number as a text link in `font-mono text-body`, `/part` for `TVL-2047-RS` and `#` for the others. The "New" badge of `TVL-2552-RS` follows the link in the same cell, in a `flex items-center gap-2`.
- **Bore (mm)**, **Outside (mm)**, **Width (mm)**: the bare figures, `20`, `47`, `14`, right-aligned, headers too.
- **Load C (kN):** the dynamic load rating with two decimals, `13.40`, right-aligned, header too.
- **Stock:** the stock state, a dot and a word.
- **Unit price (£):** the price with two decimals and no pound sign, `2.94`, right-aligned, header too.

There is no column for the seals: the part number's suffix gives them. Keep the headers exactly this short: nine columns of 1280px is about 930px, and these seven columns fit it at 1280px without scrolling. Below that width the table scrolls in its box.

When no part matches, the table's body is one row with one cell across all seven columns, with `px-4 py-12 whitespace-normal`: a stack with `gap-3` and `items-start` holding the sentence "No parts match these filters." in `text-body` and a `secondary` button "Clear filters".

Under the table, inside the same panel, a row with `mt-auto border-t border-border px-4 py-3` holding one small figure (`mt-auto` is this page's one margin: when few parts match, the panel is stretched to the filters' height and the note stays at its foot): "Unit prices are for 1 to 49 and exclude VAT. Price breaks for larger quantities are on each part's page."

### Behavior

- All of it works on the sample data in component state.
- Within a group, the checked options add up: "10 to 17" and "35 to 45" together keep both ranges. A group with nothing checked does not filter. The groups work together: a part must pass every group that has a box checked. "In stock only" keeps the parts that are "In stock" or "Low stock".
- The sort applies to the filtered rows. Ties keep the part number order (A to Z). "Load rating, highest first" puts `TVL-4585-RS` first; with the default sort the table is in the order of the sample list.
- A filter is set when any checkbox is checked. "Clear filters", in the panel or in the empty state, clears every checkbox, leaves the sort as it is, and moves focus to the first checkbox, "10 to 17". The panel's button is disabled with the plain `disabled` prop: its click moves focus elsewhere, so no button on this page gets `focusableWhenDisabled`, and `components/ui/button.tsx` needs no `data-disabled:` classes.
- The count follows the filters at once.
- "Range documents", the part links and the nav links need no behavior beyond their `href`.
