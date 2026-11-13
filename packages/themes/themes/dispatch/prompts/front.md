---
page: front page
title: Front page
description: a city newspaper's front page, with a masthead, one lead story, a column of other stories, a live strip and three sections of three stories each.
order: 1
checks:
  - The lead story's headline is the page's only `text-display` text and its only `<h1>`, and it sets in at most two lines at 1280px.
  - From `lg` up the lead story takes eight of the twelve columns and the other stories stack in the other four, with a 1px rule between the two and between the stories in the column.
  - The "Live" strip shows a red dot and the word "Live", and the dot is never shown without the word.
  - Each section opens with a 2px rule above its name and holds three stories divided by 1px rules, which stack with top rules below `md`.
  - At 375px the lead headline is `text-h1` and comes before the lead picture, as it does at 1280px.
---

Sample content, if the user gave none: **The Port Avery Ledger**, the daily paper of Port Avery, an invented harbour city. The date is Wednesday 11 November 2026. The lead story: the Kessel Street Bridge, the city's main river crossing, closed on Tuesday 10 November after inspectors found cracked bearings and stays shut for six months; the council holds an emergency vote on the £48m repair tonight. Every story, person, team and place is invented. Every story ran today and its label line shows a time, except that the swimmer's record in Sport ran yesterday and shows `TUE 10 NOV`. Write the headlines, standfirsts and bylines yourself, in plain news language: short headlines in uppercase, standfirsts that state the news in one sentence.

Build these parts in order. The page has one `<h1>`, the lead headline. The side column, the "Live" strip and each section have an `<h2>`; the stories under them have `<h3>` headlines.

### 1. Header

The header from the layout notes, with the front page's masthead: the name `text-h1` from `md` up, centered in its row. No section link is the current page on the front page.

### 2. Lead row

The first item of `<main>`: a row of two columns with a rule between them, as the layout notes describe.

**Lead story,** `lg:col-span-8 lg:pr-6`: an `<article>`, a stack with `gap-4`. Here, instead of the Story unit note's order, the picture comes last, so that the headline is the first thing seen; the order is the same at every width:

- A row with `flex items-center gap-2`: the kicker label `TRANSPORT` and the "Exclusive" badge (add it with `npx shadcn@latest add badge`). This is the page's one badge.
- The `<h1>`, a headline that is a link: `BRIDGE SHUT FOR SIX MONTHS`. It is `text-h1` below `md` and `text-display` from `md` up. Keep it under 30 characters, so it sets in two lines at most in eight columns.
- A standfirst in `font-sans text-h2 font-normal`: one sentence, sentence case, not uppercased.
- The label line in `text-muted-foreground`: `BY HANA LINDQVIST · 06:15`, the time a `<time>`.
- A picture, `aspect-3/2`, of the closed bridge, with its caption.

**Side column,** `lg:col-span-4 lg:border-l lg:pl-6`. Its `sr-only` heading is not a section head, so below `lg` it takes the stacked-column rule from the notes: `border-t pt-4 lg:border-t-0 lg:pt-0`. It opens with an `<h2>` "More top stories" that is `sr-only`. Then a list of five stories, divided by rules. Each is a story unit: a kicker, an `<h3>` small headline that is a link, one sentence in `text-body`, and the label line with the byline and the time (`BY PRIYA VENKATARAMAN · 08:10`). The first of the five also has a picture, `aspect-video`, before its kicker.

### 3. Live strip

The next item of `<main>`, across the full width: a box, `flex flex-col gap-2 md:flex-row md:flex-wrap md:items-baseline md:gap-x-6 md:gap-y-2`. It holds:

- An `<h2>` that is the live marker: it carries the Live marker note's classes and holds the dot and the word "Live".
- An `<h3>` small headline that is a link: `BRIDGE VOTE: COUNCIL MEETS AT 18:00`.
- The latest update, the live blog's first, at `17:30`: one `<p>` with `flex items-baseline gap-2 md:flex-1`, holding the time as a `<time>` label in `text-muted-foreground` and a `<span>` with one sentence in `text-body` and `max-w-xl`, the Measure note's cap, so the `<p>` still fills the row. The `<p>` is one item of the box, so the time and the sentence stay together.

At `md` and up these sit in one line and wrap where they must; below `md` they stack.

### 4. Sections

Three sections, each an item of `<main>`: Politics, Sport and City. Each opens with the section head, with a label link at the right end ("All politics", "All sport", "All city"). Under it, with the section's `gap-4`, three stories in a row of three with rules, as the layout notes describe for `md`.

Each story is a story unit: a picture `aspect-3/2` with its caption, a kicker, an `<h3>` in `text-h2` that is a link (at most 40 characters, so it fits two lines in a third of the row at 1280px), one sentence in `text-body`, and the label line with the byline and the time.

- Politics: the opposition's budget plan, a by-election date, a row over council pay.
- Sport: Port Avery Harriers win the derby against Saltgate United, a swimmer's record, a new manager at Westmere Athletic.
- City: a market's last day, a ferry timetable change, the winter night shelter opening.

In the Sport section, the first story's label line ends with a label link "Results".

### 5. Footer

The footer from the layout notes. The copyright line: `© 2026 THE PORT AVERY LEDGER · PORT AVERY`.

### Behavior

- The "Menu" button works as the layout notes say: it opens and closes the section list, sets `aria-expanded`, closes on Escape and gives focus back to itself.
- Every link but the masthead name points to `#`, as the Links note says.
