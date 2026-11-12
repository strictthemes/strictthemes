---
page: dashboard
title: Dashboard
description: the overview screen of an operations tool, with key numbers, a chart, a list of things that need attention and a table of recent records.
order: 1
checks:
  - Every number that can be compared with another is in `font-mono` or `font-heading` with `tabular-nums`, and right-aligned in the table.
  - Every state is a dot and a word, and every change (up, down) is stated in words, never by color alone.
  - The chart has a text alternative that gives the numbers, and at most one of its bars is the primary color.
  - The status filter and the search field change which rows are shown, together, and an empty result shows a message.
  - The period switch is a button group with `aria-pressed`, not tabs, and it changes the key numbers.
tested:
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-11"
    result: >-
      First run. Built without errors. Strict Check passed at 98.7% of 4,621 measured values with no errors, in light and dark mode at 1280px and 375px; its two warnings are the round status dots, which the theme allows. Looked at in a browser at 1280px in light mode: the chart panel had a large empty area under the chart. The agent reported 22 problems, 2 of them blocking: the table's focus outline was cut off by its panel, and the caution badge made one panel's heading row taller than its neighbours'.
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-11"
    result: >-
      Second run, on the revised prompt. Built without errors. Strict Check passed at 98.7% of 4,625 values with no errors and the same two warnings. Looked at in a browser at 1280px: the chart fills its panel. The agent's report, capped at 12 items, had one blocking: the heading row's minimum height was only asked for where a row holds a control. The notes now ask for it on every panel; that revision has not been re-run.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the final text, in a new project with the theme installed from strictthemes.com. Built without errors. Strict Check passed at 98.7% of 4,663 measured values, with no errors and 2 warnings for round shapes the theme allows, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 6 problems, none blocking. This build was the preview on the site until the prompt was revised.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the 96 minor problems of the run before. A new project, the theme installed from strictthemes.com. Built without errors. Strict Check passed at 98.7% of 4,688 measured values, with no errors and 2 warnings for round shapes, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 problems, none blocking. This build is the preview shown on the site.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt with the new note on disabled buttons that stay focusable. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 98.7% of 4,676 measured values, with no errors and 2 warnings for the round status dot, which the theme allows, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 2 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems the earlier test builds reported. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 98.7% of 4,656 measured values, with no errors and 2 warnings for the round status dot, which the theme allows, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode, and at 375px. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 4,632 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode, and at 375px. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
---

Sample product, if the user gave none: "Northgate", the operations console of a regional parcel carrier with four depots. The people who use it are dispatchers who watch the day's deliveries. Invent the figures, the places and the names; keep them believable.

Build these parts in order.

### 1. Top bar

The product's name, four nav links (Overview, Shipments, Depots, Reports) with Overview as the current page, and at the right end the signed-in person's name as a small figure, hidden below `md`. No avatar.

### 2. Page header

The `<h1>` "Overview". The actions are the period switch, a button group named "Period" with the choices Today, 7 days and 30 days, with Today chosen, and then the default button "New shipment".

### 3. Key numbers

Four panels in a row: three columns each from `lg` up, six each from `md`, full width below. Each panel has:

- Its label heading, e.g. `Delivered`, `In transit`, `Late`, `On-time rate`.
- With `mt-3`, the key number, with its unit beside it as a small figure where it has one (`%`).
- With `mt-2`, the change against the period before (for `In transit`, up is neither better nor worse), as a short line in `font-mono text-label`, not uppercased: an arrow icon and at most six words, e.g. "Up 4% on yesterday", "Down 2% on last week". For the on-time rate, which is a percentage itself, give the change in points: "Down 1 point on yesterday". A change for the better is `text-success`, one for the worse `text-destructive`, none `text-muted-foreground`.

The `Late` panel also has a caution badge, "Check", in its heading row.

### 4. Deliveries chart

A panel, eight columns from `lg` up, full width below. Heading: `Deliveries per day`. A bar chart of the last 14 days, built from elements. The panel is a flex column and the chart grows to fill it (`flex-1`), so the panel has no empty space when its neighbour is taller. The chart is `flex flex-col`. Its first part is a row, `flex min-h-48 flex-1 gap-2`, of two columns: the scale's values in a column of their own (`relative w-12`, which has the row's height), and the plot, `relative flex-1`. A minimum height gives a bar's percent height nothing to count against, so the plot's contents are absolute: three horizontal grid lines at zero, half and the top of the scale, and over them the bars in a row `absolute inset-0 flex items-end gap-2`, which has a fixed height. Each of the 14 bars is `flex-1` with its height in percent of the scale's top as an inline `style`. The scale has three values, one per grid line, each `absolute right-0` as a small figure, so that none sticks out of the row: the top value hangs under its line (`top-0`), the middle one is centered on its line (`top-1/2 -translate-y-1/2`) and zero stands on its line (`bottom-0`). Under that row with `mt-2`, indented by the scale's column and its gap (`pl-14`), a row of one cell per bar, with the same `gap-2` and each cell `min-w-0 flex-1 text-center`, so that the cells line up with the bars: the date under every second bar as a small figure (`5 Nov`), not wrapped (`whitespace-nowrap`), ending with the last bar, whose label is "Today" in `text-foreground`. A label is wider than its cell at some widths and may run into the empty cells beside it; the last cell is `text-right` instead of centered, so that "Today" ends on the last bar's edge. The last bar is the one in `bg-primary`, and the label "Today" under it is the words that name it. Below `md`, show the last 7 days only: the first seven bars and their cells are `hidden md:block`, so the labels stand under the 1st, 3rd, 5th and 7th of the seven.

The text alternative is a table with the day and the count for each of the 14 days, at every width, the last row's day reading "Today", inside a `<div>` with `sr-only` (the class does not work on a `<table>` itself); the drawing has `aria-hidden="true"`.

### 5. Needs attention

A panel with rows, four columns from `lg` up, full width below. Heading: `Needs attention`. Four rows, each a stack with `gap-1`: a state (a caution or an error dot and a word such as "Delayed" or "Failed"), then one paragraph in `text-body` that starts with the shipment's ID as a text link, in the body font, and says what happened, then the time as a small figure.

### 6. Recent shipments

A panel with rows, twelve columns. Its heading row holds the heading `Recent shipments` and, at the right end, a search field and the status filter, a button group named "Status" with the choices All, In transit, Delivered, Late. The two controls sit together with `gap-3` and wrap under the heading where the row is too narrow. The search field has no visible label: it has the `aria-label` "Search shipments" and a search icon inside it, in a wrapper with `relative w-64` (the icon `absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground`, the input `pl-8`).

The table has ten rows and these columns: ID (mono, a text link), Destination, Depot, Status (a state: In transit is neutral, Delivered is good, Late is failed), Weight with the header "Weight (kg)" (right-aligned) and Due (a time of day, right-aligned). It scrolls in its box on a phone.

When no row matches, the table's body is one row with one cell across all columns, in `text-muted-foreground`: "No shipments match."

### Behavior

- The period switch keeps its value in component state and swaps the key numbers and their change lines between three sets of sample values. The chart and the table do not change with it.
- The status filter and the search field keep their values in state and filter the rows together. Search matches the ID and the destination, ignoring case.
- "New shipment" and the nav links need no behavior. No button on this page gets `focusableWhenDisabled`, so `components/ui/button.tsx` needs no `data-disabled:` classes.
