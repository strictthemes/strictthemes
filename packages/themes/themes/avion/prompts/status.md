---
page: status page
title: Status page
description: a public status page for a service, with the current state, each part's uptime, past incidents, planned maintenance and a way to get updates.
order: 2
checks:
  - Every state is a dot and a word, never a color alone, and the amber color is never used for text.
  - Each uptime bar has a text alternative that gives the percentage and how many days were slow or down, and a legend says in words what the three colors mean.
  - Every clock time and date that stands on its own is a `<time>` element with a machine-readable `dateTime`, set in the mono font.
  - The email field has a visible label, a wrong address gets a message in words with an icon, and a good one gets a confirmation that a screen reader announces.
tested:
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-11"
    result: >-
      First run. Built without errors. Strict Check passed at 99.2% of 5,406 measured values with no errors, in light and dark mode at 1280px and 375px; its two warnings are the round status dots, which the theme allows. Looked at in a browser at 1280px in light mode. The agent reported 26 problems, 6 of them blocking, among them: the field with an error kept a tinted ring, the error line had no place in a row with aligned bottoms, the uptime bars showed state by color alone, and the rule for figures did not say whether numbers inside sentences count.
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-11"
    result: >-
      Second run, on the revised prompt, with a legend under the uptime bars. Built without errors. Strict Check passed at 99.2% of 5,332 values with no errors and the same two warnings. Looked at in a browser at 1280px. The agent's report, capped at 12 items, had one blocking: a minimum height on a padded heading row does nothing. The notes now put the padding on a wrapper; that revision has not been re-run.
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-11"
    result: >-
      Run on the final text, in a new project with the theme installed from strictthemes.com. Built without errors. Strict Check passed at 99.2% of 5,451 measured values, with no errors and 2 warnings for round shapes the theme allows, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 7 problems, none blocking. This build was the preview on the site until the prompt was revised.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the 96 minor problems of the run before. A new project, the theme installed from strictthemes.com. Built without errors. Strict Check passed at 99.2% of 5,280 measured values, with no errors and 2 warnings for round shapes, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode and at 375px in dark mode: on the phone the uptime figure with its day count (`99.91% · 1 day down`) wraps onto two lines, which is still open. The agent reported 7 problems, none blocking. This build is the preview shown on the site.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt with the new note on disabled buttons that stay focusable. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 99.2% of 5,136 measured values, with no errors and 2 warnings for the round status dot, which the theme allows, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 7 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems the earlier test builds reported. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 99.2% of 5,284 measured values, with no errors and 2 warnings for the round status dot, which the theme allows, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode, and at 375px. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 5,273 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
---

Sample service, if the user gave none: "Northgate", a parcel carrier whose customers use a tracking site, a booking API, label printing, email notices, a customer dashboard and webhooks. Today the label printing is slow; everything else works. Invent the incidents and the times; keep them believable.

This page is one column. Its container, for the top bar's row too, is `max-w-3xl` instead of the usual width, and main content is a single stack with `gap-5` (`flex flex-col gap-5`), not the 12-column grid.

Build these parts in order.

### 1. Top bar

The product's name and, `gap-3` after it, the label `Status`, both in one wrapper with `flex items-baseline gap-3`, so that they share a baseline while the bar's row keeps `items-center` for the button. No nav links and so no "Menu" button. At the right end, on every screen size, a link styled as a `secondary` button, "Get updates", that goes to `#updates`.

### 2. Current state

No page header row on this page. The first panel has no label heading. It holds:

- The `<h1>` in `text-h1`: one sentence that states the overall state, e.g. "One system is running slowly".
- A `<div>` with `mt-3` holding a state: a caution dot and the words "Degraded performance".
- With `mt-3`, one paragraph in `text-body` saying what is affected and what is being done.
- With `mt-5`, one line, `flex flex-wrap items-baseline gap-2`: the label `Last checked` and the date and time as a small figure.

### 3. Systems

A panel with rows. Heading: `Systems`, and at the right end of the heading row the label `Last 30 days`. Six rows, one per system. Each row is:

- A row with the system's name as an `<h3>` in `text-body font-medium`, and at the right end its state.
- With `mt-3`, the uptime bar: 30 segments in a row with `gap-px`, each `h-6 flex-1 rounded-sm`. A day that was fully up is `bg-success`, a day with slow service `bg-tertiary`, a day with an outage `bg-destructive`. The bar has `role="img"` and an `aria-label` such as "99.2% uptime over 30 days. Slow on 2 days, down on 1 day."
- With `mt-2`, a line `grid grid-cols-2 gap-x-3 gap-y-1 md:grid-cols-3`, in this order: the label `30 days ago` at the left; the uptime percentage as a small figure, followed in the same figure by the days that were slow or down, in words, where there were any (`99.91% · 1 day down`); and the label `Today`, right-aligned (`text-right`). At 375px the figure does not fit between the two labels, so below `md` it is `order-last col-span-2` and stands on its own line under them, left-aligned; from `md` up it is `md:order-none md:col-span-1 md:text-center`, in the middle column.

Five systems are "Operational" with a success dot. Label printing is "Degraded" with a caution dot. Across the six bars, most days are fully up, three or four are slow and one is down.

The panel ends with a legend, after the list of systems and not an item of it: a `<div>` with the rows' `px-5 py-3` and 1px top border, `flex flex-wrap gap-5`, holding three pairs, each `inline-flex items-center gap-2`, of a `size-3 rounded-sm` square with `aria-hidden="true"` and a label, `Up`, `Slow` and `Down`. This is the one place where the three state colors fill more than a dot, and the legend is what keeps them from standing alone; the Charts note does not apply to these bars.

### 4. Planned maintenance

A panel. Heading: `Planned maintenance`, with a caution badge "Scheduled" at the right end of the heading row. With the usual `mt-3` under the heading row, an `<h3>` in `text-body font-medium` naming the work, with `mt-2` a line, `flex flex-wrap gap-x-5 gap-y-1`, holding two pairs: the label `Starts` with its date and time as a small figure, and the label `Ends` with its, each pair `flex items-baseline gap-2`. Then with `mt-3` one paragraph on what customers will notice.

### 5. Get updates

A panel with the `id` `updates` and `scroll-mt-5`. Heading: `Get updates`. One sentence in `text-body` on what can be followed, such as "Get an email about incidents and planned maintenance for Northgate.", then with `mt-5` a form: the field's label "Email address", then with `mt-2` a row with `gap-3` holding the email field (`md:flex-1`) and the default button "Subscribe"; below `md` the row is a column and the button goes under the field at full width (its label fits on one line). The error line goes under the row. Under the form with `mt-2`, after the `<form>` and so after the error line inside it, the field's helper text, which says when mail comes and how to stop it rather than repeating the sentence above: "One email when an incident opens and one when it is resolved. Every email has an unsubscribe link."

### 6. Past incidents

An `<h2>` in `text-h2`, "Past incidents", directly on the page with `mt-3`, which with the stack's gap puts it 32px under the panel before it. Then three panels, one per incident, as items of the same stack. Each panel has:

- A heading row: the incident's title as an `<h3>` in `text-body font-medium`, and at the right end its state, "Resolved" with a neutral dot.
- With `mt-2`, a line of small figures, `flex flex-wrap gap-x-5`: the date (a `<time>`), and how long it lasted (`38 min`, not a `<time>`).
- With `mt-5`, the updates as an ordered list without numbers, newest first. Each update has a 1px top border and `py-3`: the kind of update as a label in `text-foreground` (Resolved, Monitoring, Identified, Investigating) with the time beside it as a small figure, in a `flex items-baseline gap-2`, and with `mt-1` a `<p>` with one or two sentences in `text-body`. The last update has no bottom padding (`last:pb-0`).

These three panels use an `<h3>` in place of the usual label heading. Its row keeps `min-h-7`, and what follows it uses the margins given here, not the `mt-3` of the Panel heading note.

### 7. Footer

Not a panel: a `<footer>` in the container, a row with `pb-5` holding two labels, the company's name and year at the left and the time zone all times are shown in at the right.

### Behavior

- An empty or malformed address shows the error line. A good one replaces the form with a confirmation in `text-body`: a check icon in `text-success` and "Subscribed. We will write when something changes." The helper text is removed together with the form: the form, the helper text and the empty `role="status"` element share the one wrapper with `mt-5`.
- "Get updates" scrolls to the panel and moves focus to the email field, or to the confirmation once the form is gone. A link to `#updates` cannot do both on its own: handle its click in code (`preventDefault`, then `scrollIntoView`, then `focus` with `preventScroll`).
- No button on this page gets `focusableWhenDisabled`, so `components/ui/button.tsx` needs no `data-disabled:` classes.
