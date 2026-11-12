---
page: journal index
title: Journal
description: the index page of a journal or blog, with a short introduction, a topic filter and a dated list of entries grouped by year.
order: 2
checks:
  - Choosing a topic shows only that topic's entries, a year with no entries left is hidden with its heading, and the button for the chosen topic is the one marked as pressed.
  - Every entry's date and every year heading is a `<time>` element with a machine-readable `dateTime`.
  - The page has one badge at most, `New`, on the newest entry.
  - The email field has a visible label, and a wrong address gets a message in words with an icon, not a color change alone.
tested:
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-11"
    result: >-
      First run. Built without errors. Strict Check passed at 100% of 2,492 measured values, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 18 problems, 2 of them blocking: the spacing rule named an allowed step as forbidden, and `bg-background` on the input did not hold in dark mode. The empty-topic message could not be reached with the sample data.
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-11"
    result: >-
      Second run, on the revised prompt, with a topic that has no entries. Built without errors. Strict Check passed at 100% of 2,498 values. Looked at in a browser at 1280px. The agent's report, capped at 12 items, had none blocking. One line was added after this run (the "Older entries" link in the empty state) and has not been re-run.
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-11"
    result: >-
      Run on the final text, in a new project with the theme installed from strictthemes.com. Built without errors. Strict Check passed at 100% of 2,481 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 6 problems, none blocking. This build was the preview on the site until the prompt was revised.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the 96 minor problems of the run before. A new project, the theme installed from strictthemes.com. Built without errors. Strict Check passed at 100% of 2,488 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 problems, none blocking. This build is the preview shown on the site.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems the earlier test builds reported. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,494 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,488 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 3 minor problems with the brief and none blocking; they are not fixed.
---

Sample journal, if the user gave none: the journal of "The Long Margin", a small magazine about work that takes a long time. Twelve entries over the last three years, in three topics: Letters, Craft and Reading. A fourth topic, Notes, has no entries yet. Write a title and a one-sentence summary for each entry, plain and specific.

Build these parts in order.

### 1. Header

The publication's name and three nav links, in this order: Essays (`/essays`), Journal (`/journal`), About (`/about`). "Journal" is the current page.

### 2. Introduction

In the reading column, with `pt-12`: the `<h1>` "Journal", then with `mt-4` two or three sentences about what the journal is and how often it is written.

### 3. Start here

In the reading column, with `mt-12`: a card that points a new reader to one entry. Inside it a label ("Start here"), then with `mt-2` the entry's title as an `<h2>` in `text-h2`, then with `mt-4` two sentences about it, then a `<p>` with `mt-6` holding a link styled as the default button: "Read the entry". The title itself is not a link.

### 4. Topic filter

In the reading column, with `mt-12`: a `role="group"` with the `aria-label` "Filter by topic", holding five buttons in a row that wraps (`flex flex-wrap gap-2`): All, Letters, Craft, Reading, Notes. Each button is its topic's one word. The chosen one has `aria-pressed="true"` and `variant="secondary"`; the others have `aria-pressed="false"` and `variant="outline"`. "All" is chosen at first.

Under the group, with `mt-4`, a label `<p>` with `aria-live="polite"` that says how many entries are shown, e.g. `12 entries`.

### 5. Entries

In the reading column, which has no margin of its own: the `mt-12` of its first element sets the space under the count. The entries are grouped by year, newest first. Each year is a `<section>` with `mt-12`: the year as a label heading with no top margin of its own, holding a `<time>` (`dateTime="2026"`), so that it does not look like the entry titles under it, then the year's entries as a `<ul>` with `mt-4`, one `<li>` for each entry.

Each entry is an `<article>` with a 1px top border and `py-6`:

- A label line: the day and month (a `<time>` such as `dateTime="2026-03-12"`), the topic and the reading time, e.g. `12 March · Craft · 6 min read`.
- With `mt-2`, the title as an `<h3>` in `text-h2` that holds a link.
- With `mt-2`, the one-sentence summary.

The newest entry has the page's one badge, "New". Its label line is `flex flex-wrap items-center gap-2` and has two items: one `<span>` holding the date, the topic and the reading time, then the badge, with no ` · ` before it. The badge belongs to the newest entry of all: it shows whenever that entry is shown, and no other entry ever gets it.

When the chosen topic has no entries, show one sentence in place of all the year sections, a `<p>` with `mt-12`: "No entries on this topic yet." The count then reads `0 entries`, and the "Older entries" link is not shown.

Under the last year: a `<p>` with `mt-12` that holds only the link "Older entries", styled as a link in running text.

### 6. Sign-up

In the reading column, with `mt-24`, a 1px top border and `pt-12`: an `<h2>` "Get the journal by email", then with `mt-4` one sentence, then a wrapper with `mt-6` that holds the form and its status element (see Confirmations in the notes). The form has a labelled email field ("Email address") and, in a `<div>` with `mt-4`, a `secondary` button "Subscribe". Under the button with `mt-4`, inside the form, a label line: how often the email comes and that leaving takes one click, e.g. `Every other Thursday · Leave with one click`.

### 7. Footer

The footer from the layout notes.

### Behavior

- The topic filter keeps its value in component state and filters the entries. The count label follows it.
- An empty or malformed address shows the error line under the field. A good one replaces the form with one sentence, a `<p>` with no top margin of its own (the wrapper carries the `mt-6`): "Thank you. The next entry will reach you by email."
- The other links need no behavior.
