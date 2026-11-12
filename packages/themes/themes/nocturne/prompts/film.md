---
page: film page
title: Film
description: the page of one film at an independent cinema, with its title, a still, its details, a synopsis, the credits, showtimes by day that can be chosen, and a quote from a review.
order: 2
checks:
  - The film's title is the page's `<h1>` and its only `text-display` text, and it is `text-h1` below `md`.
  - The credits are a `<dl>` with a `<dt>` and a `<dd>` for each role.
  - Choosing a showtime marks only that time with `aria-pressed="true"` across all days, and a sentence in an `aria-live` element states the chosen day, time and screen in words.
  - The "Book seats" link, the page's only default (gold) action, is on the page only once a time is chosen.
  - The still keeps its 16:9 shape at every width, has `role="img"` and an `aria-label`, and has a caption.
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Second run of this page. The first runs showed that a poster in a row needs `self-start` to keep its proportions, which the theme's shared notes now say. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,088 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems the earlier test builds reported. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,088 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,102 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: **The Vesper**, an independent cinema with three screens and a late bar at 21 Tallow Row, Oldmere. The film is "Low Tide at Merrow", directed by Ada Kessler, Norway, 2026, 118 minutes, rated 15, in Norwegian with English subtitles. Maren, a ferry pilot, comes back to the island she left at nineteen to sell her late father's house, and finds the harbour town waiting for a storm that the radio keeps moving to the next night. It opens at the Vesper on Wednesday 11 November 2026. Credits: directed by Ada Kessler; written by Ada Kessler and Sindre Vold; Ingrid Solberg as Maren; cinematography by Hanne Kvist; music by Oskar Lunde; editing by Tora Brekke. The review is by Tomas Brecht in "The Oldmere Review": "Kessler keeps the storm offshore for two hours, and you feel every minute of the waiting."

Build these parts in order.

### 1. Header

The header from the layout notes. The film page is not in the nav, so no nav link is the current page and none has `aria-current`; Programme still points to `/`.

### 2. Title

The first `<section>`:

- A label line in `text-muted-foreground`: a text link "Programme" back to `/`, then ` · Now showing`. The link is `text-foreground` with the text link's underline, hover and transition from the layout notes, inside the muted `<p>`, which gives it the label classes; ` · Now showing` stays muted.
- With `mt-2`, the `<h1>` "Low Tide at Merrow" in `text-h1 md:text-display`. It wraps on a phone; it is never cut.
- With `mt-4`, the film's details as labels: a `<ul>` with `flex flex-wrap gap-x-6 gap-y-2`, each `<li>` a label in `text-muted-foreground`: `2026`, `Norway`, `118 min`, `Rated 15`, `Subtitled`. Give the year a visually hidden "Year: " in front of it, so it is not read as a bare number.

### 3. Still

Still inside the first `<section>`, after the details, with `mt-12` (a new group), a `<figure>` across the container's full width: the still from the layout notes, with the `aria-label` "Still from Low Tide at Merrow: Maren on the ferry's open deck, the island behind her" and a caption, a label: `Ingrid Solberg as Maren · The ferry's open deck`. Large and uncropped: keep `aspect-video` at every width.

### 4. Synopsis and credits

The second `<section>`, with `mt-24`, is a grid (`md:grid-cols-12`):

- Columns 1–7: an `<h2>` "Synopsis" in `text-h2 md:text-h1`, then three paragraphs, the first with `mt-4` under the heading and each next one with `mt-4`. Keep them to the measure.
- Columns 9–12, with `mt-12 md:mt-0`: an `<h2>` "Credits" in `text-h2 md:text-h1`, then with `mt-6` a `<dl>`. Each role is a `<div>` with `border-t border-border py-4`, and the `<dl>` has `border-b border-border`. In each `<div>`: the `<dt>` is a label in `text-muted-foreground`, the `<dd>` follows with `mt-1` in `text-body`. Roles: Director, Written by, Maren (the lead role, so the actor's name is the `<dd>`), Cinematography, Music, Editing. Two names in one role are joined with a comma.

### 5. Showtimes

The third `<section>`, with `mt-24`, and its own `id` ("showtimes"):

- An `<h2>` "Showtimes" in `text-h2 md:text-h1`, then with `mt-4` one sentence: which screen it is on and that every screening has subtitles.
- With `mt-6`, a `<ul>` of five days (Wednesday 11 to Sunday 15 November) as a list of rows, with `py-4` in place of `py-6` on each row. A row is `flex flex-col gap-2 md:flex-row md:items-center md:gap-6`: first the day, a `<p>` label holding a `<time>` (`Fri 13 Nov`), with `md:w-32 md:shrink-0`; then a button group with the `aria-label` "Times on Friday 13 November" (the day in full), holding that day's two or three times, each within that day's opening hours: 17:30 to 21:00 on Wednesday and Thursday, 16:30 to 23:15 on Friday and Saturday, 13:30 to 20:30 on Sunday. Each button holds a `<time>` with the full `dateTime`, and has the button classes from the layout notes plus `tabular-nums`. On Friday the 20:30 time is the premiere with a talk: its button reads `20:30 · Q&A`, the `<time>` holding only `20:30` and ` · Q&A` following it, outside the `<time>`, inside the button.
- The chosen time is one choice across all days, so the five groups share one piece of state. Nothing is chosen at first, so every button starts as `variant="outline"` with `aria-pressed="false"`.
- With `mt-6`, a wrapper `flex flex-wrap items-center gap-4` holding the choice line and the booking link. The choice line is a `<p>` with `aria-live="polite"` in `text-body`, on the page from the start: "Choose a time to book seats." at first, then the choice in words, e.g. "You have chosen Friday 13 November at 20:30, Screen 1. This screening is followed by a talk with Ada Kessler." Once a time is chosen, the default-variant link "Book seats" (to `#`) appears after the line. It is the page's one gold action.

On a phone the day sits above its times, and the times wrap.

### 6. Review

The fourth `<section>`, with `mt-24`: the block quote from the layout notes, in columns 1–8 of a grid (`md:grid-cols-12`). The sentence from the review in the sample, then the caption `Tomas Brecht · The Oldmere Review`. No stars, no score graphic.

### 7. Footer

The footer from the layout notes.

### Behavior

- The chosen showtime is component state: the day, the time and the screen. Choosing a time sets it; choosing the chosen time again clears it, and the line goes back to "Choose a time to book seats." and the "Book seats" link goes away. Focus stays on the button that was pressed.
- The choice line reads from the state. Write the day and the date in full in it, not as a label.
- "Book seats" and the other links need no behavior.
