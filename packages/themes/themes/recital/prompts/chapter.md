---
page: handbook chapter
title: Chapter
description: one chapter of a guide or handbook, read from start to finish, with a list of its sections, a table, an aside and links to the chapters before and after.
order: 3
checks:
  - The "In this chapter" list has one link for each of the four section headings of the body, and each link jumps to its heading.
  - Body text in the reading column averages 60 to 70 characters a line on a desktop screen.
  - On a phone the table and the template scroll sideways inside their own boxes, which can be reached with the keyboard, and the page itself does not scroll sideways.
  - There is no sidebar, and the links to the previous and the next chapter are in a `<nav>` with a label.
tested:
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-11"
    result: >-
      First run. Built without errors. Strict Check passed at 100% of 2,159 measured values, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode and at 375px in dark mode: the table scrolled inside its own box and the page did not scroll sideways. The agent reported 22 problems, 2 of them blocking: `space-y-6` put 24px under headings, and the table's caption came out centered.
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-11"
    result: >-
      Second run, on the revised prompt. Built without errors. Strict Check passed at 100% of 2,200 values. Looked at in a browser at 1280px. The agent's report, capped at 12 items, had one item that blocks under one reading: whether the table's header cells get the same padding as its body cells. The prompt now says they do; that revision has not been re-run.
  - tool: Claude Code
    model: Claude Fable 5.2
    date: "2026-11-11"
    result: >-
      Run on the final text, in a new project with the theme installed from strictthemes.com. Built without errors. Strict Check passed at 100% of 2,206 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 problems, none blocking. This build was the preview on the site until the prompt was revised.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the 96 minor problems of the run before, twice. In the first run the agent left `text-body` off the table, and Strict Check failed with one error: 14px text in the table's cells. The sentence about the table now gives the exact classes, and the second run, in a new project, built without errors and passed Strict Check at 100% of 2,136 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 problems, none blocking. The second build is the preview shown on the site.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems the earlier test builds reported. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,168 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,175 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 2 minor problems with the brief and none blocking; they are not fixed.
---

Sample chapter, if the user gave none: chapter 3, "Writing things down", of "A Handbook for Small Teams", a guide for teams of five to fifteen people. The chapter argues that a decision is not made until it is written where the team can find it, and shows how. Write 700 to 900 words of running text yourself, plain and specific, in the paragraphs of four `<h2>` sections, the sentence that introduces the steps included; the standfirst, the aside, "In short", the table, the steps, the template and the quote come on top of that.

Build these parts in order. An `<article>` wraps the chapter opening, the list of sections, the body and "In short".

### 1. Header

The handbook's title in place of a publication's name, and two nav links, in this order: Contents (`/contents`), About (`/about`). None is marked as the current page. A long title may wrap on a phone.

### 2. Chapter opening

In the reading column, with `pt-24`:

- A label: `Chapter 3 of 9`.
- With `mt-4`, the `<h1>`: `text-display` from `md` up, `text-h1` below.
- With `mt-6`, a standfirst: two sentences.

### 3. In this chapter

In the reading column, with `mt-12`: a `<nav>` named by its label heading: `aria-labelledby` set to the heading's `id`, and no `aria-label`, so the name is read once. It has a 1px top border and a 1px bottom border and `py-6`. Inside it a label heading "In this chapter", then with `mt-4` (here, instead of the notes' `mt-2` under a label) a numbered list (`list-decimal pl-6`, `mt-2` between items) with one link for each of the body's four section headings, styled as links in a list of titles.

### 4. Body

In the reading column, except the table, with `mt-12`. The body must include, each once:

- **Four `<h2>` headings**, each with an `id` and `scroll-mt-6`. The first one has no `mt-12`: the body's own margin is enough.
- **A numbered list** of four steps, one sentence each, after a sentence that introduces it.
- **A table**, wide, between two reading columns: a small comparison with three columns and four rows, for example "What to write where" with the columns Kind of note, Where it lives and Who reads it. Use the shadcn `Table`. A `<div>` with `my-12` holds the table's name and the table: first the name as a label `<p>` ("What to write where"), then the `Table` inside a `<div>` with `mt-2`. No `<caption>`: inside the scroll box it would scroll sideways with the table. The `Table` itself gets `className="min-w-lg text-body"`: `text-body` because it ships a smaller size, and `min-w-lg` so that on a phone it scrolls sideways in its box instead of squeezing. Header cells are labels in `text-muted-foreground` with `h-auto`; header and body cells alike have `px-4 py-2 align-top whitespace-normal`, and the first and last cell of a row have `first:pl-0 last:pr-0`. Rows are divided by 1px borders and do not change on hover (`hover:bg-transparent` on every row, the header row included), because they do nothing. The scroll box is reachable with the keyboard: in `components/ui/table.tsx`, give `Table` a required `label: string` prop, and put `tabIndex={0}`, `role="region"`, `aria-label={label}` and the focus outline from the rules (`focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`) on its scroll box `<div>` always, also where the table fits. Pass the name as `label`.
- **An aside**: a card with a label ("Try this") and two or three sentences that give the reader one thing to do this week.
- **A template**: a block the reader can copy, for example a decision record with five lines (Decision, Date, Who decided, Why, When to look again), each filled in with an example long enough that the block is wider than a phone. It stays in the reading column, 512px at most, and scrolls inside itself on a desktop as well wherever a line is longer than that. The dates in it are plain text, not `<time>` elements. The `<pre>` is the panel: `rounded-xl border bg-card p-6 font-mono text-label text-foreground`. It scrolls sideways inside itself (`overflow-x-auto`), with `tabIndex={0}`, `role="region"`, an `aria-label` and the same focus outline. A label that names it sits above it; the label and the `<pre>` share a wrapper with `my-12`, and the `<pre>` has `mt-2`.
- **A block quote** of one sentence, with the name of who said it.
- **An emphasis** (`<em>`) in at least two paragraphs.

### 5. In short

In the reading column, with `mt-12`: a card, a `<section>` (not an `<aside>`: it sums up the chapter). The card has `mb-12`, as the notes give a card that opens a part. Inside it a label heading "In short", then with `mt-4` a bulleted list (`list-disc pl-6`) of three sentences that sum up the chapter.

### 6. Previous and next

In the reading column, with `mt-24`: a `<nav>` with the `aria-label` "Chapters", a 1px top border and `pt-6`. Two links side by side in a `grid grid-cols-2 gap-6`, the first with `justify-self-start`, the second right-aligned as a block (`justify-self-end text-right`). Each link is the whole block, with `group text-foreground transition-colors duration-150`, and holds two `<span className="block">`: a label ("Previous" or "Next") in `text-muted-foreground`, and, with `mt-2`, the chapter's number and title in `text-body text-foreground decoration-1 underline-offset-4 group-hover:underline`, e.g. "2. Meetings worth having".

### 7. Footer

The footer from the layout notes, with the handbook's title.

### Behavior

- The links in "In this chapter" jump to their headings.
- Nothing else needs behavior.
