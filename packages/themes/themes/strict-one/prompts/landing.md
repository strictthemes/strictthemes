---
page: landing page
title: Landing page
description: a marketing landing page for a software product, from header to footer.
order: 1
checks:
  - The hero heading is the page's only `text-display` text and its only `<h1>`.
  - No screenful shows more than one default (primary) button.
  - The page uses no image files; figures are built from elements.
  - Feature and step blocks are separated by borders and whitespace, not wrapped in cards.
tested:
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-10"
    result: >-
      Built without errors and matched the theme in light and dark mode and at 375px. Found 11 problems in the prompt, the largest that shadcn's cn() drops the theme's type classes.
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-10"
    result: >-
      Built without errors and matched the theme. The cn() fix did not reach stock components, which import cn directly; the prompt now covers that.
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-10"
    result: >-
      Third run. Built without errors; checked in a browser in light mode, in dark mode and at 375px. The agent reported 14 problems, mostly the grid gap fighting the vertical rhythm, section padding, and no focus style.
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-10"
    result: >-
      Fourth run, on the fixed theme. Built without errors; checked in a browser in light mode and at 360px in dark mode. Label, heading and paragraph sat 8px and 16px apart as the brief asks. The agent reported 11 problems, 5 of them blocking, down from 14: mostly spacing the brief did not give, and where a figure's caption goes. The prompt was revised after this run and that revision has not been re-run.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the final text, in a new project with the theme installed from strictthemes.com. Built without errors. Strict Check passed at 100% of 3,628 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode and at 375px in dark mode. The agent reported 6 problems, none blocking. This build was the preview on the site until the prompt was revised.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the 96 minor problems of the run before. A new project, the theme installed from strictthemes.com. Built without errors. Strict Check passed at 100% of 3,537 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 3 problems, none blocking. This build is the preview shown on the site.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems the earlier test builds reported. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 3,617 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 3,595 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
---

Sample product, if the user gave none: **Plainsheet**, "spreadsheets your whole team can read". It turns messy spreadsheets into clean shared views with comments and history.

Build these sections in order.

### 1. Header

A single row with a 1px bottom border. Left: the product name in `font-heading text-h2`. Middle or right: three text links as labels, Product, Pricing and Docs, none of them the current page. Far right: a "Sign in" label link and an `outline` button "Start free". Every one points to `#`. Below `md` the row holds only the product name, "Start free" and a "Menu" button; the three links and "Sign in" move into the menu.

### 2. Hero

- Columns 1–12: an eyebrow label, e.g. `SPREADSHEETS FOR TEAMS`.
- Columns 1–10: the `<h1>` in `text-display` on `md` and up, `text-h1` below. Sample: "The spreadsheet everyone on the team can actually read."
- Columns 1–6: one paragraph in `text-body`, two or three sentences.
- Then a row with the default button ("Start free") and one text link ("See how it works").
- Then, across all 12 columns, a product figure: a `bg-card` panel with `p-8` (`p-4` below `md`), holding a plain `<table>` that follows the Tables note: a header row of labels and five data rows of plausible sample data in `text-body`, names in the inherited body font, numbers in `font-mono tabular-nums` aligned right, rows divided by 1px borders, `first:pl-0 last:pr-0` on the cells. Below `md`, hide the less important columns so the table fits; it then needs no scroll box. Give the figure a caption.

### 3. Proof row

One row, padded as the layout notes say for a one-line row: a label "USED BY TEAMS AT" followed by five invented company names as plain text in `font-heading text-h2`, all six items in one `flex flex-wrap items-baseline gap-x-8 gap-y-2`, so the label sits `gap-x-8` before the first name. They wrap onto more lines on small screens. No logos.

### 4. Features

Section header: `01 / FEATURES`. Then three features in a 12-column grid, four columns each. Each feature has a 1px top border, `pt-4`, a one-word label naming it (`VIEWS`, `COMMENTS`, `HISTORY`), an `<h3>` in `text-h2`, and a paragraph in `text-body`. No icons, no cards.

### 5. How it works

Section header: `02 / HOW IT WORKS`. Two rows, each with a 1px top border and `pt-8`. In each, columns 1–5 hold a step label (`STEP 01`), an `<h3>` in `text-h2` and a paragraph; columns 7–12 hold a `bg-card` panel with `p-8` (`p-4` below `md`), a figure built from elements (for example a comment thread, or a list of versions), with a caption. In the figure, its entries (comments, versions) are `gap-4` apart, and in each entry the name and time line sits `gap-2` above its text. Stack the two parts below `md`.

### 6. Quote

One customer quote in a `<blockquote>`, set in `font-heading text-h1` across columns 1–10, with a 1px `border-foreground` top border above it, as wide as the container, and `pt-8`. Under it, with `mt-4`, a `<figcaption>` holding a label with the person's name, role and company; the quote and the caption sit in one `<figure>`. No avatar, no quotation-mark graphic.

### 7. Closing call to action

A section with a 1px top border and `pt-16`. It has no bottom border: the footer's line closes it. Columns 1–8: an `<h2>` in `text-h1` and one sentence. Then the default button. This is the second primary button on the page, which is fine because it is never on screen with the hero's.

### 8. Footer

A footer with `py-16` and the full-width top line from the layout notes. Four groups, each `md:col-span-3` of the 12-column grid, stacked with `gap-y-8` below `md`: the product name in `font-heading text-h2` with a one-line description in `text-body` under it, `gap-4` apart, then three link groups (Product, Company, Legal), each with a label heading and four links in `text-body`. Under them, with `mt-8`, a 1px top border, `pt-4` and a label line with the copyright.

### Behavior

- The mobile menu opens and closes with the keyboard, closes on Escape and sets `aria-expanded`.
