---
page: comparison page
title: Compare
description: three parts side by side in one comparison table, a column per part and a row per property, with the values that differ marked in words and weight and a switch to show only those rows.
order: 3
checks:
  - "The comparison is one table with a column per part and a row per property, each property a `<th scope=row>` and each part a `<th scope=col>`."
  - "Every row whose values differ says Differs in words beside its property, and its values are `font-bold`; no row, cell or value is marked by color."
  - "Show only rows that differ hides the five rows whose values are the same and the count says so, and clearing it brings them back."
  - "Figures are right-aligned mono with `tabular-nums`, with the unit once in the property's name, and agree with the catalogue and the part page."
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-12"
    result: >-
      A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,956 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: "Torvale Bearings Ltd" and three deep groove ball bearings from its TVL range: `TVL-2047-RS` (20 × 47 × 14 mm, two rubber seals), `TVL-2047-ZZ` (the same size with two metal shields) and `TVL-2552-RS` (25 × 52 × 15 mm, two rubber seals, new this year). Their figures are the same as on the catalogue and the part page.

This page uses the stock `button`, `badge`, `checkbox` and `table`; add any the project lacks with `npx shadcn@latest add button badge checkbox table`.

Build these parts in order; the footer is as the layout notes describe it.

### 1. Header

The product's name, the four nav links with Compare as the current page, the sales line at the right end from `md` up, and the "Menu" button below `md`.

### 2. Page header

On the left, the label "Compare", then the `<h1>` "Three parts side by side". On the right, two actions: a link styled as a `secondary` button, "Back to the catalogue" (`/catalogue`), and a link styled as the default button, "Request a quote" (`/quote`): it is the page's one main action.

### 3. Comparison

A panel with rows, full width, directly in the container. Its heading row holds the `<h2>` "Comparison" and, at its right end, in a `flex flex-wrap items-center gap-4`, the count as a small figure in an element with `aria-live="polite"`, then the checkbox "Show only rows that differ", clear, set as the Checkboxes note says.

The count reads `11 of 16 rows differ` while all rows show, and `Showing the 11 rows that differ` while the checkbox is checked.

The shadcn `Table` with the label "Comparison of three parts", four columns:

- **The header row:** the first header cell reads "Property". Each of the other three is a `<th scope="col">`, right-aligned, holding a stack with `gap-1` and `items-end`: the part number as a text link in `font-mono text-body text-foreground` (`/part` for `TVL-2047-RS`, `#` for the other two), then a small figure with its seals, `Rubber seals` or `Metal shields`; `TVL-2552-RS` also has the "New" badge after its part number, in a `flex items-center gap-2`. These three cells hold two lines, so give them `h-auto py-2` in place of the stock height; they keep the stock `whitespace-nowrap`.
- **The body rows:** each starts with a `<th scope="row">`, not the stock `TableHead`, with `px-4 py-2 text-left align-top font-normal text-body text-foreground`. It holds a `<div>` with `flex flex-wrap items-baseline gap-2`: the property's name with its unit in brackets, then, on a row whose values differ, the word `Differs` as a small figure in `text-foreground`. The three value cells are right-aligned; a figure is `font-mono tabular-nums`, a phrase is `text-body`. On a row whose values differ, the three value cells also get `font-bold`, all three, since none of them is the odd one out on its own.

The sixteen rows, in this order, with the values of `TVL-2047-RS`, `TVL-2047-ZZ` and `TVL-2552-RS`:

1. Bore d (mm): `20`, `20`, `25`
2. Outside diameter D (mm): `47`, `47`, `52`
3. Width B (mm): `14`, `14`, `15`
4. Seals: "Two rubber seals, RS", "Two metal shields, ZZ", "Two rubber seals, RS"
5. Dynamic load rating C (kN): `13.40`, `13.40`, `14.60`
6. Static load rating C0 (kN): `6.55`, `6.55`, `7.85`
7. Limiting speed (r/min): `13,000`, `18,000`, `11,000`
8. Operating temperature (°C): `−30 to +110`, `−30 to +120`, `−30 to +110`
9. Mass (kg): `0.103`, `0.101`, `0.125`
10. Cage: "Pressed steel" for all three
11. Ring material: "Chrome steel, 100Cr6" for all three
12. Grease: "Lithium, 20% fill" for all three
13. Radial clearance: "CN, normal" for all three
14. Precision class: "P0, normal" for all three
15. Stock: the stock state, a dot and a word: "In stock", "Low stock", "In stock"
16. Unit price, 1 to 49 (£): `2.94`, `2.71`, `3.46`

Write `C0` as two plain characters: a `<sub>` would take a size outside the type scale. A stock state cell holds the state's `inline-flex`; the cell is right-aligned, so the state ends on the column's edge.

The table has four columns of about 180px to 220px each and fits the panel at 1280px. On a phone it scrolls sideways in its box.

Under the table, inside the same panel, a row with `border-t border-border px-4 py-3` holding one small figure: "Load ratings are calculated to ISO 281 and ISO 76. Limiting speeds are for grease lubrication. Prices exclude VAT."

### 4. Next steps

A grid row of two panels, six columns each from `lg` up, stacked below. Each has a heading row with an `<h2>` and, under it, one paragraph in `text-body`, then a text link.

- **"Not sure which to choose?"**: "Shields let a bearing run faster and warmer; seals keep out more dirt and water. For a pump shaft near water, choose the rubber seals." Then the link "Ask an engineer" to `#`.
- **"Need the files?"**: "Data sheets, 3D models and certificates for the whole TVL range are on one page." Then the link "Range documents" to `/downloads`.

### Behavior

- Whether a row differs is worked out in code from its three values as shown, so a changed value changes the marks. With the sample data, rows 1 to 9, 15 and 16 differ and rows 10 to 14 are the same.
- "Show only rows that differ" hides the rows whose values are the same (it removes them from the table, not with `hidden` styling alone) and changes the count's wording; clearing it brings them back in their place. Focus stays on the checkbox.
- No button on this page is ever disabled, so none gets `focusableWhenDisabled`, and `components/ui/button.tsx` needs no `data-disabled:` classes.
- The links need no behavior beyond their `href`.
