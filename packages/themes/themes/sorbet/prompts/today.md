---
page: home screen
title: Today
description: the home screen of a habit-tracking app, with a greeting and the date, today's habits as cards that can be marked done, a count that updates, a celebration badge when all are done and a form to add a habit.
order: 2
checks:
  - Each habit's "Done" button has `aria-pressed`, and its card says in words whether the habit is done, not by color alone.
  - The count ("2 of 5 done" at the start) updates when a habit is marked or unmarked, and when every habit is done a butter-yellow badge appears inside a `role="status"` element that was on the page from the start.
  - Adding a habit with an empty name shows an error in words with an icon, tied to the field; a good name adds a card to the list and empties the field.
  - The "Add habit" button is the only raspberry button on the screen; the "Done" buttons are outline or secondary.
  - Every button and field on the page is at least 44px tall.
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Second run of this page: the first led to a revision of the theme's five briefs. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 1,589 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems the earlier test builds reported. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 1,591 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 1,584 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: "Mossy", a habit tracker for small, daily steps. The person is Ines Okafor. Today she has five habits, two of them already done: Drink 8 glasses of water (every day, done at 08:12), Read 10 pages (every day), Walk after lunch (every day, done at 13:05), Stretch for 5 minutes (every day), No phone after 22:00 (every day). Her streak is 12 days. Use these as the starting state.

The `<main>` uses `gap-10` between groups.

Build these parts in order.

### 1. Header

The header from the layout notes, with Today as the current page.

### 2. Page header

The page header from the layout notes: the date as a small figure, a `<time dateTime="2026-11-11">` reading `Wednesday, 11 November` (the fixed sample date) that carries the small figure's classes itself, then the `<h1>` "Good morning, Ines". The greeting is set once, when the page loads, from the clock: "Good morning" before 12:00, "Good afternoon" before 18:00, "Good evening" after. It does not update while the page is open.

Under the `<h1>`, in the page header's `gap-2`, a row `flex items-center` with no gap of its own, so the empty status element adds none, and no wrap, so the badge's `ml-3` never indents a second line:

- The count, a `<p>` in `font-heading text-h2 tabular-nums`: "2 of 5 done".
- The celebration's place: an element with `role="status"` and no classes, on the page from the start and empty while habits are left. When every habit is done it holds a good-news badge (add it with `npx shadcn@latest add badge`), "All done for today", with the `PartyPopper` icon before the words; the badge carries `ml-3`. At 375px the count and the badge fit on one line.

### 3. Today's habits and the form

A grid from the layout notes. Its first item, `md:col-span-7`, is the list; its second, `md:col-span-5`, is the form. Below `md` the form comes after the list.

**The list.** A section with an `<h2>` "Your habits" and the list under it in the section's `gap-6`. The list is a `<ul>` with `flex flex-col gap-3`; each `<li>` is a card with `flex flex-row items-center gap-4` in place of the card's column stack:

- At the left, a `flex min-w-0 flex-1 flex-col gap-2`: the habit's name as an `<h3>` in `text-h2`, and under it a small figure with how often and the state, joined with ` · `: `Every day · Done at 08:12` (the time a `<time>`) or `Every day · Not yet`.
- At the right, the done button: a `Button` with `aria-pressed`, the `aria-label` "Done: Read 10 pages" (the word "Done" and the habit's name) and the visible text "Done" (one word here, instead of the notes' two or three). When the habit is not done it is `variant="outline"` (the notes' quiet button) with the `Circle` icon; when done it is `variant="secondary"` with the `CircleCheck` icon. `shrink-0`, so it never wraps.

On a phone the name wraps beside the button; the button keeps its width. No other buttons in a card. The cards keep their order when a habit is done.

**The form.** A card that is a section and the wrapper for the form and its status element. It opens with an `<h2>` "Add a habit" and, in the card's `gap-4`, one sentence in `text-body`: "Keep it small. Something you can do in two minutes is a good start." The form has `noValidate` and `flex flex-col gap-6`:

- "What will you do?": an `Input` (add it with `npx shadcn@latest add input`) with `maxLength={40}` and helper text `Up to 40 characters, like "Drink a glass of water"`.
- "How often": a `<select>` with Every day, Weekdays, Weekends and Three times a week, full width.
- The page's one default `Button`, `type="submit"`, with the `Plus` icon: "Add habit", full width below `md` (`w-full md:w-auto md:self-start`).

The form and the `role="status"` element for its confirmation share one `<div>` with no gap, which is the card's item after the sentence; the status element comes after the form, empty at first. When a habit is added it holds the confirmation line from the layout notes, with `mt-4` on the line, and the words `Added "Drink tea, not coffee"` (the name typed). The form stays; the message does not replace it.

From `md` up the card stays in view while the list scrolls: `md:sticky md:top-6 md:self-start`.

### 4. A note for the day

A section with an `aria-label` "Tip for today" and no visible heading: one card, `md:max-w-lg`. In place of the card's `gap-4`, it is `flex flex-col gap-2`, since a label and the text it labels are `gap-2` apart: a label in `text-muted-foreground` ("Tip for today") and one or two sentences in `text-body`, e.g. "Put your book where your phone usually goes. Reading the first page is the hard part." No icon.

### 5. Footer

The footer from the layout notes.

### Behavior

- Keep the habits in component state, as a list of objects with a name, how often, and the time each was done (or none).
- Clicking a habit's done button toggles it. Marking it done stores the current time and shows `Done at 14:32`; unmarking clears it and shows `Not yet`. The button keeps focus, and its `aria-pressed` follows the state. The count updates with every click.
- When every habit is done, the badge appears in its status element. Unmarking any habit empties the element again.
- "Add habit" checks the name: an empty name, or only spaces, shows the error `Give your habit a name, like "Stretch for 5 minutes".` under the field and moves focus to it. A name that is already in the list, compared ignoring case and spaces at either end, shows `You already have this habit.` A good name (trimmed) adds a card at the end of the list, not done, empties the field, moves focus to it and shows the confirmation; the count follows ("2 of 6 done"). The confirmation goes away after four seconds; adding another habit before then replaces its text and starts the four seconds again.
- The nav links go to the addresses in the layout notes and need no other behavior.
