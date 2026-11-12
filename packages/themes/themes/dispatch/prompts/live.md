---
page: live blog
title: Live blog
description: live coverage of one event, with a summary of key points, timed updates of several kinds, a control for their order and a new update that arrives and is announced.
order: 3
checks:
  - Every update shows its time in a `<time>` element and its kind in words, never by color alone.
  - The order control is a group of two buttons with `aria-pressed`, and choosing one really reverses the list.
  - The "Show new update" button adds one update to the list, marks it "New" in words, and a `role="status"` element that was on the page from the start announces it.
  - After its one update is shown, the button is disabled and keeps keyboard focus.
  - The "Live" marker is a red dot with the word "Live" beside it, and the dot does not move.
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      First run of this page, on briefs revised after another page of the theme was built. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 99.8% of 2,803 measured values, with no errors and 2 warnings for the round "Live" dot, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 6 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems the earlier test builds reported. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 99.8% of 2,825 measured values, with no errors and 2 warnings for the round "Live" dot, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 3 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,915 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: **The Port Avery Ledger**, the daily paper of Port Avery, an invented harbour city. The event is tonight's emergency council meeting on the Kessel Street Bridge, which closed on Tuesday 10 November after inspectors found cracked bearings and stays shut for six months: councillors vote on a £48m repair, paid for by a loan the opposition wants to cut. It runs from 18:00 on Wednesday 11 November 2026. Write twelve updates from 17:30 to 20:05, each one to three sentences, by two reporters, Malik Osei and Hana Lindqvist. Every person and place is invented.

Build these parts in order.

### 1. Header

The header from the layout notes, with the masthead name in `text-h2`. The current page is Politics.

### 2. Live head

The first item of `<main>`: a stack with `gap-4` and `lg:max-w-4xl`, so no line of it runs the full width. From `lg` up the headline sets in one line; narrower, it may take two.

- A row with `flex flex-wrap items-center gap-x-4 gap-y-2`: the live marker, and the label `POLITICS` in `text-foreground`.
- The `<h1>`: `BRIDGE VOTE: LIVE`, `text-h1` below `md`, `text-display` from `md` up.
- A standfirst in `font-sans text-h2 font-normal`, one sentence, sentence case.
- A label line in `text-muted-foreground`: `MALIK OSEI AND HANA LINDQVIST · LAST UPDATE 20:05`, the time a `<time>`. When a new update is shown, this time changes to its time.

### 3. Coverage

The next item of `<main>`: a row of two columns with a rule between them, as the layout notes describe. The key points come first in the source, so on a phone they sit above the updates.

**Key points:** the column itself is the box, an `<aside>` with the `aria-labelledby` of its heading, carrying the box classes from the layout notes, `flex flex-col gap-4` and `lg:col-span-4 lg:order-2`. It takes no rule beside it: its own border divides it from the updates, and from `lg` up the updates column keeps `lg:pr-6`. From `lg` up it stays in view while the updates scroll (`lg:sticky lg:top-6 lg:self-start`; without `self-start` a grid item does not stick). Inside it: an `<h2>` label in `font-mono text-label uppercase text-foreground`, `KEY POINTS`, then a `<ul>` with `list-disc pl-6` and `flex flex-col gap-2`, holding four points, each one sentence in `text-body`. Below `lg` it is the same box, not sticky.

**Updates,** a `<section>` with `min-w-0 lg:col-span-8 lg:order-1 lg:pr-6`. Here, instead of the stacked-column rule, it takes no top border below `lg`: the box's own border above it divides them. A stack with `gap-4`, opening with an `<h2>` "Updates" that is `sr-only`:

- A row with `flex flex-wrap items-center justify-between gap-4`: the order control at the left and the "Show new update" button at the right.
- The order control: a button group with the `aria-label` "Order of updates" and two buttons, "Newest first" (chosen at the start) and "Oldest first".
- The "Show new update" button: `variant="secondary"`, with the `RefreshCw` icon before the text with `gap-2`.
- The updates: an `<ol>` with `flex flex-col gap-4`, no markers and no padding, each item after the first with a 1px top border and `pt-4`. Each update is an `<article>`, a stack with `gap-2`:
  - A label line with `flex flex-wrap items-baseline gap-x-4 gap-y-1`, its parts separate items spaced by the gap, here instead of the Labels note's ` · `: the time as a `<time>` in `text-foreground` (`19:42`), the kind in words (`KEY EVENT`, `UPDATE`, `QUOTE`, `ANALYSIS`) in `text-muted-foreground`, and the reporter's name in `text-muted-foreground`.
  - For a key event only, an `<h3>` headline in `text-h2`. Other updates have no headline, so their time and kind label them. Four of the twelve are key events, among them the vote result at 20:05: `REPAIR PASSES 31 TO 22`.
  - One to three paragraphs in `text-body`, capped at `max-w-xl`.
  - A quote update has one paragraph that says who spoke and when, then a `<blockquote>` with `flex flex-col gap-1 border-l-2 pl-4`: the quote as a `<p>` in `font-sans text-body italic`, one or two sentences that do not count toward the update's one to three, then who said it as a label in `text-muted-foreground`.
- The status element from the Announcements note, right after the row of controls, empty at the start.

### 4. Footer

The footer from the layout notes.

### Behavior

- All of this works on the sample data in component state. Each update has a time, a kind, a reporter, an optional headline and its text.
- The list starts newest first. Choosing "Oldest first" reverses it; the chosen button's `aria-pressed` and variant follow the choice. The status element says "Showing oldest first" or "Showing newest first". Pressing the chosen one again does nothing, as the Button groups note says.
- One more update is prepared but not shown at the start: a 20:12 `UPDATE` saying the repair work will start on Monday. "Show new update" adds it to the list at its place by time: at the top when the list is newest first, at the end when it is oldest first. It carries the "New" label from the Red note as the first item of its label line, which stays for the rest of the visit. The live head's last update time changes to 20:12.
- The status element then says "New update at 20:12: repair work to start on Monday." Focus stays on the button.
- There is one prepared update, so the button is then disabled, with `focusableWhenDisabled` so focus stays on it (and the `data-disabled:` classes from the Buttons note, which this page needs, so it looks disabled), and its text changes to "No new updates". It is not removed.
- Nothing scrolls or moves on its own when the update arrives.
