---
page: record detail
title: Record detail
description: the detail screen of one record in an admin tool, with its state, its progress, a timeline, a table of items, its properties and notes.
order: 4
checks:
  - The progress list says in words which steps are done, which one is current and which are to come, and marks the current one with `aria-current="step"`.
  - The properties are a description list (`<dl>`), and both addresses are `<address>` elements.
  - The "Mark as delivered" button changes the state, the progress and the timeline together, and then cannot be used again.
  - The items table has a total row in a `<tfoot>`, with its numbers right-aligned in mono figures.
  - Adding a note puts it at the top of the list and empties the field; an empty note cannot be added.
tested:
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-11"
    result: >-
      First run. Built without errors. Strict Check passed at 99.7% of 3,592 measured values with no errors, in light and dark mode at 1280px and 375px; its two warnings are the round status dots, which the theme allows. Looked at in a browser at 1280px in light mode. The agent reported 21 problems, 2 of them blocking: the table's focus outline was cut off by its panel, and times called labels came out uppercase.
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-11"
    result: >-
      Second run, on the revised prompt. Built without errors. Strict Check passed at 99.7% of 3,529 values with no errors and the same two warnings. Looked at in a browser at 375px in dark mode: no sideways scroll. The agent's report, capped at 12 items, had none blocking. The theme's shared layout notes were revised after this run, and that revision has not been re-run.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the final text, in a new project with the theme installed from strictthemes.com. Built without errors. Strict Check passed at 99.7% of 3,429 measured values, with no errors and 2 warnings for round shapes the theme allows, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 problems, none blocking. This build was the preview on the site until the prompt was revised.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the 96 minor problems of the run before. A new project, the theme installed from strictthemes.com. Built without errors. Strict Check passed at 99.7% of 3,519 measured values, with no errors and 2 warnings for round shapes, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 6 problems, none blocking. This build is the preview shown on the site.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt with the new note on disabled buttons that stay focusable. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 99.7% of 3,430 measured values, with no errors and 2 warnings for the round status dot, which the theme allows, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 6 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems the earlier test builds reported. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 99.7% of 3,529 measured values, with no errors and 2 warnings for the round status dot, which the theme allows, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 3,438 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
---

Sample record, if the user gave none: shipment `NG-48213` in "Northgate", the operations console of a regional parcel carrier. It is out for delivery and running late because of a road closure. Invent the customer, the addresses, the items and the events; keep them believable.

Build these parts in order.

### 1. Top bar

The product's name, four nav links (Overview, Shipments, Depots, Reports) with Shipments as the current page, and at the right end the signed-in person's name as a small figure, hidden below `md`.

### 2. Page header

Above the heading, a breadcrumb: a `<nav>` with the `aria-label` "Breadcrumb" holding, with `gap-2`, the link `Shipments` to `/shipments`, styled as a nav link, and the ID as a small figure in `text-foreground` (in place of `text-muted-foreground`), with a `/` between them that has `aria-hidden="true"`. The ID is the current page (`aria-current="page"`, not a link). Here, instead of the Top bar note's value, the nav link Shipments has `aria-current="true"`, so that only one element on the page says `page`. The page header row follows with `mt-2`; the breadcrumb and the row are one grid item.

The `<h1>` is "Shipment NG-48213", with the ID in `font-mono`. Beside it with `gap-3`, its state, "Out for delivery" with a neutral dot, and a caution badge, "Delayed". The actions are an `outline` button "Print label", a `secondary` button "Reroute" and the default button "Mark as delivered".

### 3. Main column

Eight columns from `lg` up, full width below. The column is the grid item: three panels stacked in it with `gap-5`, the last one growing to fill the column (`flex-1`).

**Progress.** Heading: `Progress`. An ordered list of five steps: Booked, Collected, At depot, Out for delivery, Delivered. The list is `grid gap-3 md:grid-cols-5`: from `md` up the steps are a row of five equal columns; below, they are stacked. Each step is `flex gap-3 md:flex-col md:gap-2`: a marker and, beside it below `md` and under it from `md`, the step's name in `text-body font-medium` and under the name a small figure that does not wrap: for a done step the time it was reached, for the current step the time it began (`11 Nov, 08:40`); a step to come has instead the uppercase label `Expected` with the expected time under it; the name, the label and the time are each a block (`<p>`, or a `<time>` with `block`). Every time here has the form `11 Nov, 08:40`, without the year, which fits a step's column at every width from `md` (about 112px at `lg`). The marker is `size-5 rounded-sm border`: a done step's is `border-secondary bg-secondary text-secondary-foreground` with a check icon; the current step's is `border-primary bg-primary` with nothing in it; a step to come has only the border. Each step also says its state for screen readers in an `sr-only` span ("Done", "Current", "To come"), and the current step has `aria-current="step"`.

**Timeline.** A panel with rows. Heading: `Timeline`. Six events, newest first. Each row: the date and time as a small figure, and beside it one sentence in `text-body`, not capped in width, with, under it with `mt-1`, a `<p>` with who or what did it as a small figure. From `md` up the time sits in a column of its own, `w-32`, with `gap-5` to the sentence; below, it sits above the sentence with `mt-1` between them. The newest event is the delay: above its sentence it has a caution state, "Delayed", in a `<div>` with `mb-1` (the margin goes on the wrapper, not on the `inline-flex` state).

**Items.** A panel with rows. Heading: `Items`, with the count at the right end of the heading row as a small figure, `4 items`: it counts the table's rows, not the units (their sum is in the total row). A table with four items and the columns SKU (mono), Description, Quantity (right-aligned) and Weight in kg (right-aligned). A `<tfoot>` row gives the totals, with "Total" in the first cell and `font-medium` on the row. The table is named "Items".

### 4. Side column

Four columns from `lg` up, full width below. The column is the grid item: three panels stacked in it with `gap-5`, the last one growing to fill the column (`flex-1`).

**Details.** Heading: `Details`. A `<dl>` with six rows: Customer, Service, Depot, Weight, Booked and Due. Each row has `py-2` and a 1px top border except the first, with the `<dt>` as a label at the left and, `gap-3` from it, the `<dd>` in `text-body` at the right, right-aligned. Figures and times are mono; a value that is a phrase, such as the service, is not.

**Addresses.** Heading: `Addresses`. Two blocks divided by a 1px border, the second with `mt-5 pt-5`: a label ("From" or "To", an `<h3>` styled as a label) and with `mt-1` an `<address>` in `text-body`, not italic (`not-italic`), with a line for the name, the street, and the postcode and town.

**Notes.** Heading: `Notes`. A form: a labelled `Textarea` "Add a note" (`min-h-24`, no `rows`: it grows with its text, as the stock one does; add it with `npx shadcn@latest add textarea`) and, with `mt-3`, a `secondary` button "Add note". Under the form with `mt-5`, the notes as a list, newest first, two to begin with. Each note has a 1px top border and `py-3`, the last one no bottom padding (`last:pb-0`): the text in `text-body`, and with `mt-1` a `<p>` as a small figure, not a label and not uppercased, with who wrote it and when (`Priya Nair · 11 Nov, 09:12`), where the date and time are a `<time>` inside the figure.

### Behavior

- "Mark as delivered" sets the state to "Delivered" with a success dot, removes the "Delayed" badge, marks all five progress steps as done with the current time on the last, adds a "Delivered" event with a success state to the top of the timeline, and disables itself. The delay event keeps its state. It stays in the page header, disabled, with `focusableWhenDisabled` so that focus stays on it; it is the one button on this page that needs the prop. Announce the change in a `role="status"` element with `sr-only`, empty from the start, placed at the end of the page header's grid item; after the click it reads "Shipment NG-48213 marked as delivered."
- "Add note" adds the note to the top of the list with the signed-in person's name and the current time, and empties the field. With an empty field, or one that holds only spaces, it shows an error line instead: "Write a note first." Focus moves to the field, which reads the line through its `aria-describedby`; the line is not a live region. The line goes away at the next keystroke.
- "Print label", "Reroute" and the links need no behavior.
