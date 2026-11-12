---
page: pricing page
title: Pricing page
description: a pricing page with three plans, a monthly and yearly switch, a comparison table and a FAQ.
order: 2
checks:
  - Switching between monthly and yearly changes every paid plan's price and its billing note, and the selected button has `aria-pressed="true"`.
  - Exactly one plan is marked as recommended, and it has the only default (primary) button in the plan row.
  - The comparison table uses real `<th>` cells with `scope`, and shows included features with words or an icon that has a text alternative, never color alone.
  - Each FAQ item opens and closes with the keyboard.
tested:
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-10"
    result: >-
      First run. Built without errors; the billing switch, the table and the FAQ worked in a browser in light mode, in dark mode and at 375px. The agent reported 20 problems, mostly the plan grid, the stock Accordion and Table, and section padding.
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-10"
    result: >-
      Second run, on the fixed theme. Built without errors; the three calls to action lined up, the Recommended badge used the tertiary color, and the page fit at 375px and 360px. The agent reported 12 problems, 3 of them blocking, down from 20: mostly spacing inside a plan and the table's group headings. The prompt was revised after this run and that revision has not been re-run.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the final text, in a new project with the theme installed from strictthemes.com. Built without errors. Strict Check passed at 100% of 3,959 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 6 problems, none blocking. This build was the preview on the site until the prompt was revised.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the 96 minor problems of the run before. A new project, the theme installed from strictthemes.com. Built without errors. Strict Check passed at 100% of 3,858 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 6 problems, none blocking. This build is the preview shown on the site.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems the earlier test builds reported. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 3,852 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 3,779 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
---

Sample product, if the user gave none: **Plainsheet**, "spreadsheets your whole team can read". Sample plans: Starter (free, up to 3 people), Team ($12 per person a month, or $10 billed yearly), Business ($24 per person a month, or $20 billed yearly).

Build these sections in order.

### 1. Header

A single row with a 1px bottom border: product name in `font-heading text-h2` on the left, three label links, Product (`#`), Templates (`#`) and Pricing (`#`, the current page), then a "Sign in" label link (`#`) and an `outline` button "Start free" (`#`). Below `md` the row holds only the product name, "Start free" and a "Menu" button; the links and "Sign in" move into the menu.

### 2. Intro

- An eyebrow label: `PRICING`.
- Columns 1–8: the `<h1>` in `text-display` on `md` and up, `text-h1` below. Sample: "One price per person. No tiers hidden in a sales call."
- Columns 1–6: one paragraph in `text-body`.

### 3. Plans

This section has no top padding: it follows the intro's `pb-16`. It opens with a visually hidden `<h2>` "Plans".

First, a row (`flex flex-wrap items-center gap-4`) holding a billing switch, a button group with two buttons, "Monthly" and "Yearly", and after it a label in `text-muted-foreground` saying what yearly saves, e.g. `2 MONTHS FREE`. Do not use `Tabs`: there are no tab panels here.

Then, with `mt-8`, three plans side by side, stacked below `md`. They are columns divided by 1px borders, not floating cards: a three-column grid with no gap, one outer 1px border with `rounded-md` around the row, and a 1px border between plans (vertical from `md` up, horizontal below).

Each plan, top to bottom, with `p-8`:

1. The plan name as a label heading, an `<h3>`.
2. The price in `font-heading text-display`, with `/ person / month` as a label in `text-muted-foreground` beside it, on the price's baseline (`flex flex-wrap items-baseline gap-2`). At `md` a plan's box is too narrow for both, so the label wraps under the price there, `gap-2` below it, and shares its line from `lg` up and below `md`. The free plan shows "$0" with the same label.
3. A billing note as a label in `text-muted-foreground`, e.g. `BILLED YEARLY` or `BILLED MONTHLY`. The free plan says `FREE FOREVER`.
4. One sentence saying who the plan is for.
5. The call to action, full width: an `<a>` styled as a button. The recommended plan uses the default variant; the others use `outline`. The three sit on one line across the plans. They keep the stock `whitespace-nowrap`, so each label is at most 15 characters, which fits a plan's box at `md`: `START FREE`, `START TEAM`, `START BUSINESS`.
6. A 1px top border, then a list of five or six features. Mark each with a small check icon from the project's icon set, in `text-foreground`.

Spacing inside a plan is margins, not gap: `mt-2` before the price and before the billing note, `mt-4` before the sentence, `mt-8` before the call to action, `mt-8` before the list's top border, `pt-8` under that border, and `gap-2` between features. To keep the calls to action level from `md` up, make each plan `row-span-6 grid grid-rows-subgrid gap-0`, so every part shares a row with its neighbours. Give the row no `grid-rows-*` class: the spans create six implicit rows sized to their content, where `grid-rows-6` would make six equal ones.

The recommended plan (Team) carries a `Badge` reading "Recommended" next to its name. It is the page's one signal badge, in the tertiary color. Do not enlarge the plan, lift it or tint its background.

### 4. Compare plans

Section header: `01 / COMPARE`. Across all 12 columns, a `Table` with the feature name in the first column and one column per plan. Group rows under three group headings (for example Sharing, History, Admin): one `TableBody` per group, opened by a row with one `TableHead` with `colSpan={4} scope="rowgroup"`, styled as a label in `text-foreground` (here, instead of the notes' muted header cells: it heads a group of rows, not a column), with `pt-8` so the groups stand apart. The stock `TableBody` drops its last row's border: in `components/ui/table.tsx`, take `[&_tr:last-child]:border-0` out of it, so every row keeps its line. Feature names are `TableHead` cells with `scope="row"`, in `font-sans text-body font-normal`; they keep the stock `h-10` and stay on one line. The table's name is the section's `<h2>`, which is also its `label`. Plan cells hold "Included", "Not included" or a value such as "30 days", in `font-mono text-body`. Rows are divided by 1px borders, with no zebra stripes and no hover color. On small screens the table scrolls sideways inside its own container.

### 5. FAQ

Section header: `02 / QUESTIONS`. Columns 4–12: an `Accordion` with six questions and short, direct answers about billing, trials, cancelling and data. Every item has a 1px line under it, the last one too: in `components/ui/accordion.tsx`, change the item's `not-last:border-b` to `border-b`. The stock `Accordion` is off the type scale. Pass `items-center gap-4 rounded-none py-4 font-sans text-body font-medium` in the trigger's `className`, and `pb-4` in the content's `className`, which lands on the inner `<div>` that holds the stock bottom padding. The content's stock text size class sits on the outer `Panel`, which `className` does not reach: replace that one class with `text-body` in `components/ui/accordion.tsx`. Both of its chevron icons get `strokeWidth={1.5}`.

### 6. Closing line

A section with a 1px top border and `pt-16`: an `<h2>` in `text-h1` across columns 1–8 ("Still deciding? Start on the free plan."), and, in a `<p>` with `mt-4` under it, one text link to contact sales. No second primary button here, since the plan row may still be on screen.

### 7. Footer

A footer with `py-16` and the full-width top line from the layout notes. Four groups, each `md:col-span-3` of the 12-column grid, stacked with `gap-y-8` below `md`: the product name in `font-heading text-h2` with a one-line description in `text-body` under it, `gap-4` apart, then three link groups, each with a label heading and four links in `text-body`. Under them, with `mt-8`, a 1px top border, `pt-4` and a copyright label.

### Behavior

- Keep the billing period in component state. Both the prices and the billing notes read from it.
- The yearly prices are the per-month equivalent; say "billed yearly" so nobody is surprised.
