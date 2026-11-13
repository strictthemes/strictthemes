---
page: dashboard
title: Dashboard
description: the overview screen of a web app, with navigation, key numbers, a chart and a table.
order: 5
checks:
  - Every number that can be compared with another is in `font-mono` with `tabular-nums` and right-aligned in tables.
  - Changes (up, down) are stated in words or with a labelled icon, never by color alone.
  - The chart has a text alternative, and its bars are `bg-foreground`, not the primary color.
  - The status filter and the name filter change which rows are shown, and an empty result shows a message.
  - The name filter is the theme's `Input` with `type="search"`, and with text in it shows no clear button drawn by the browser.
  - The period switch and the status filter are button groups with `aria-pressed`, not tabs, and the period switch sits with the key numbers it changes.
  - Below `lg` the sidebar is reachable through a "Menu" button that works with the keyboard.
---

Sample app, if the user gave none: **Plainsheet**, a shared spreadsheet tool. The dashboard is the workspace overview: how many sheets are active, who is editing, and what changed this week. Invent consistent sample data: about eight table rows and seven days of chart values. Keep every key number to five characters or fewer (`1,284`, `92%`) and every chart value to four digits, so they fit a phone as narrow as 320px.

This page is an app screen, not a marketing page. It uses the full width of the window instead of the `max-w-[1200px]` container, and it has no section headers of the `01 / NAME` kind. Every panel's label heading is an `<h2>`.

### 1. Shell

From `lg` up, two columns: a sidebar 256px wide (`w-64`) and the main area. Below `lg`, the sidebar is hidden behind a "Menu" button in the top bar, which opens it in a `Sheet` from the left.

**Sidebar:** `bg-sidebar` with a 1px right border and `p-4`. Each link points to `#` and is a block with `px-2 py-2` and `rounded-sm`, and the product name, group names and footer lines share its `px-2`. It is `sticky top-0 h-svh`, with `gap-8` between its parts, `gap-2` between a group name and its links, and `gap-1` between links. Top: the product name, a `<p>` in `font-heading text-h2`. Then a `<nav>` with two groups of label links, `gap-8` apart, each under a group name that is a label in a `<p>`, not a heading (for example Workspace: Overview, Sheets, Members, Activity; Settings: Billing, API keys). The current link is `bg-sidebar-accent text-sidebar-accent-foreground` with `aria-current="page"`. Overview is the current link. Bottom, pushed to the foot of the column with `mt-auto`: the signed-in person's name in `text-body` and email in `font-mono text-label text-muted-foreground`, on two lines, no avatar image. In the `Sheet`, the sidebar's content is the same, without `sticky`, `h-svh`, its right border and its `p-4`, which the sheet's own padding replaces; the sheet's one wrapper is `flex flex-1 flex-col`, so `mt-auto` still reaches the bottom. If the window grows to `lg` while the sheet is open, close it (a `matchMedia("(min-width: 64rem)")` change).

**Top bar:** a row with a 1px bottom border, `py-4`, and `px-4` below `md`, `px-8` from `md` up. Left, in a `flex items-center gap-4`: the "Menu" button (below `lg` only) and the `<h1>` "Overview" in `text-h2`. Right: the page's one default button, "New sheet", which stays in the bar at every width. The row has `flex-wrap items-center justify-between` and `gap-4` at every width, here instead of the notes' `gap-8` from `md` up, so on a narrow phone it breaks into two lines.

### 2. Key numbers

First a row with the label heading `KEY NUMBERS` on the left and, on the right, a period switch: a button group (7 days, 30 days, 90 days). The row wraps on small screens. Then, with `mt-4`, four cells in one bordered strip: a panel with `overflow-hidden` whose grid has `gap-px` and `bg-border`, with `bg-background` cells, so 1px lines show between them at every column count. No shadows. Two columns below `md`, four from `md` up. Each cell, with `p-4`:

- A label, e.g. `ACTIVE SHEETS`.
- The value in `font-mono text-h2 font-normal tabular-nums md:text-h1`: at 320px a cell is about 110px wide inside its padding, which five characters of `text-h1` would fill.
- A change line in `font-mono text-label`, not uppercased: an arrow icon from the project's icon set and a short visible change, e.g. "Up 12%", followed by the period in an `sr-only` span (" from the previous 7 days"), so a screen reader hears it and the line fits a 110px cell; the period switch shows the period. Use `text-foreground` for it; do not color it green or red.

### 3. Chart

A panel with `p-8` (`p-4` below `md`): a row (`flex flex-wrap items-baseline justify-between gap-4`) with a label heading (`EDITS PER DAY`) and the label `LAST 7 DAYS` on the right, then, with `mt-4`, a bar chart. The chart always shows the last seven days, whatever the period switch says. The sample's today is Thursday 12 March 2026, so the weekday labels run `FRI` to `THU`, oldest on the left, and no date on the page is later than that day.

Build the chart from plain elements, with no chart library: seven columns in a `grid grid-cols-7 gap-2`, each column `min-w-0`. Each column is, top to bottom: a bar area of fixed height (`h-64`, a `flex flex-col justify-end gap-2` box) in which the value label and the `bg-foreground` bar sit at the bottom, the label above the bar, in `font-mono text-label text-foreground`, not uppercased; then the weekday label. The bar is a direct child of the `h-64` box, so its percent height resolves against that fixed height. The bar's height is its share of the largest value, as a percentage of 90% of the area so the tallest bar's label still fits, set with an inline `style`; that is fine here. Labels are left-aligned with the bar. Write chart values without a thousands separator. The whole visual chart is `aria-hidden`, and a visually hidden plain `<table>` after it gives the same seven values.

### 4. Recent sheets

A panel with a 1px border.

- Header row with `p-4` and a 1px bottom border: the label heading `RECENT SHEETS` on the left; on the right, in a `flex w-full flex-wrap items-center gap-4 sm:w-auto`, an `Input` with `type="search"` and the placeholder "Filter by name", `w-full sm:w-64`, and a status filter, which is a button group (All, Shared, Private). The row is `flex flex-wrap items-center justify-between gap-4`; on small screens the controls wrap under the heading.
- A `Table`: Name, Owner, Status, Edits, Last edited. Sheet names are plain text, not links. Label-style header cells. Edits and dates in `font-mono tabular-nums`, right-aligned. Status is a `Badge` styled as the notes say, outlined for Shared and Private alike: the word tells them apart. A status repeats on many rows, so it is never the signal badge: this page has no tertiary badge. The table's name is the panel's label heading, also passed as its `label`. The table touches the panel's side borders, so in `components/ui/table.tsx` the scroll box's outline is drawn inside: `focus-visible:-outline-offset-2` in place of `focus-visible:outline-offset-2`. Last edited is a date as the notes write it. 1px row borders, no zebra stripes. On small screens the table scrolls sideways inside the panel.
- When the filters leave no rows, show one row reading "No sheets match this filter."

### 5. Activity

Beside the table from `2xl` up (table in columns 1–8, activity in 9–12), below it otherwise. A panel with a header row like the table's (`p-4`, the label heading `ACTIVITY`) and six entries with `p-4`. Each entry is one sentence ("Dana renamed Q3 budget") with a time label under it, divided by 1px borders. The time label is a date and a time, `12 MARCH 2026, 14:05`, in a `<time>`. The chart's weekday labels (`FRI` to `THU`) are labels, not `<time>` elements.

### Behavior

- The period switch, the status filter and the name filter keep their value in component state. The period swaps the key numbers between three sets of sample values; the chart and the table do not change with it.
- "New sheet" and the sidebar links need no behavior.
- Main content has `p-8` (`p-4` below `md`) and `gap-8` between panels.
