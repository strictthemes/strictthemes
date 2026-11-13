---
page: section index
title: Section
description: one section's index page, with its lead story, a list of stories with their times, a numbered most-read list and a button that loads more stories.
order: 5
checks:
  - The lead story's headline is the page's only `text-display` text, and the section's name is the page's only `<h1>`.
  - Every story in the list shows its time in a `<time>` element, set in the mono font with `tabular-nums`.
  - The "Load more" button adds six stories to the list, moves focus to the first new story's headline link, and a `role="status"` element announces how many were added.
  - After the last stories are loaded, the button is replaced by a sentence, and focus is on the first new story, not lost.
  - The "Most read" list is an `<ol>` with `role="list"` whose numbers are set in the mono font and are read out once by a screen reader.
---

Sample content, if the user gave none: **The Port Avery Ledger**, the daily paper of Port Avery, an invented harbour city. The section is Politics, on Wednesday 11 November 2026. Its lead story: the council's ruling group loses its majority on the bridge loan as two councillors walk out. Invent twenty more stories from the last four days: council votes, a by-election in Saltgate ward, rows over bus fares and council pay, interviews. Two political reporters, Malik Osei and Priya Venkataraman. Every person and place is invented.

Build these parts in order.

### 1. Header

The header from the layout notes, with the masthead name in `text-h2`. The current page is Politics.

### 2. Section head

The first item of `<main>`: a stack with `gap-2`, with `border-t-2 pt-2`.

- The `<h1>` `POLITICS`, `text-h2` below `md` and `text-h1` from `md` up, so the lead headline under it is always the larger one.
- One sentence in `text-body`, capped at `max-w-xl`: what the section covers.

### 3. Lead story

The next item of `<main>`: an `<article>` that is `grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0`, with two columns and no rule between them. The text comes first and the picture after it, at every width, so the headline is the first thing seen.

- `lg:col-span-7 lg:pr-6`, a stack with `gap-4`: the kicker `COUNCIL`, the `<h2>` headline that is a link, `text-h1` below `md` and `text-display` from `md` up (`MAJORITY GONE`), a standfirst in `font-sans text-h2 font-normal`, and the label line: `BY MALIK OSEI · 07:50`, the time a `<time>`.
- `lg:col-span-5`: a picture, `aspect-3/2`, of the council chamber, with its caption.

### 4. Stories and most read

The next item of `<main>`: a row of two columns with a rule between them, as the layout notes describe.

**Latest,** `lg:col-span-8 lg:pr-6`: a `<section>`, a stack with `gap-4`: the section head `LATEST`, then the list of stories, then the "Load more" row.

The list is a `<ul>` of story rows divided by rules. Each row is an `<article>`, `grid grid-cols-1 gap-2 md:grid-cols-12 md:gap-0`:

- `md:col-span-2 md:pr-4`: a row with `flex flex-wrap items-baseline gap-2` holding the time as a label in `text-muted-foreground`, a `<time>` in the Dates note's forms (`09:40` today, `TUE 10 NOV` back to Sunday 8 November). Below `md` this row sits above the whole second column: picture, kicker and headline.
- `md:col-span-10`: a stack with `gap-2`: a kicker, an `<h3>` in `text-h2` that is a link, one sentence in `text-body`, and the byline alone as a label in `text-muted-foreground` (`BY MALIK OSEI`): here, instead of the Story unit note's label line, the time stays in the first column.

Eight rows are shown at the start, newest first. Two of the first eight have a picture, `aspect-video`, at the top of their second column. The newest story has the "New" label from the Red note after its time, in that row.

Under the list, a row with `flex flex-wrap items-center gap-4` and a 1px top border with `pt-4`:

- The "Load more" button, `variant="secondary"`.
- A label in `text-muted-foreground`: `SHOWING 8 OF 20`, which counts up as stories are added.

The status element from the Announcements note, empty at the start, at the end of the row.

**Most read,** `lg:col-span-4 lg:border-l lg:pl-6`: a `<section>`, a stack with `gap-4`: the section head `MOST READ`, then an `<ol>` with `role="list"` (Safari drops a list's role when its markers are removed) of five stories divided by rules, without list markers. Each item is `flex items-baseline gap-4`: its number as a big figure in `text-foreground` (`1` to `5`, in `font-mono text-h2 tabular-nums`, `w-8 shrink-0`), and an `<h3>` small headline that is a link. The visible number is the only one a screen reader reads, since the markers are gone. "Most read" does not change.

### 5. Footer

The footer from the layout notes.

### Behavior

- All of it works on the sample data in component state: twenty stories after the lead, each with a time, a kicker, a headline, a sentence and a byline.
- "Load more" adds the next six stories at the end of the list. Focus moves to the headline link of the first story it added, and the status element says "6 more stories shown." The count label changes to match.
- The second click shows the last six, the status element says "The last 6 stories shown." (a new text, so it is announced again), and it replaces the row's button with the sentence "That is every Politics story from the last four days.", a `<p>` in `text-body` with `max-w-xl`. Focus is already on the first new story, so it is not lost when the button goes.
- New stories appear at once, with no animation, and the page does not scroll on its own beyond what moving focus needs.
