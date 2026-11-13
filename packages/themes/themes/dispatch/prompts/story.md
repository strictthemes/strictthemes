---
page: news story
title: Story
description: one news story, with its section and time, a large headline, a standfirst, a byline, a captioned picture, the body with a pull quote and a fact box, and related stories.
order: 2
checks:
  - The headline is the page's only `<h1>`, uppercase, `text-display` from `md` up and `text-h1` below.
  - Body paragraphs are set in Newsreader at `text-body` and are at most 576px wide, about 65 to 70 characters a line.
  - The pull quote is set in Newsreader italic, between a 2px top rule and a 1px bottom rule, with who said it as a label.
  - The fact box is a `bg-card` box with a 1px border and square corners, and it is not inside another box.
  - The published and updated times are `<time>` elements with a `dateTime`.
---

Sample content, if the user gave none: **The Port Avery Ledger**, the daily paper of Port Avery, an invented harbour city. The story is the front page's lead: the Kessel Street Bridge closed on Tuesday 10 November after inspectors found cracked bearings and stays shut for six months, and the council votes tonight on a £48m repair. Write a story of 600 to 800 words in its body paragraphs alone (the subheading, the pull quote and the fact box come on top) in plain news language: the news first, then what it means for the 40,000 people who cross each day, then what the council says, the opposition's reply and what happens next. Quote the transport chief, Reuben Achterberg, and a café owner by the bridge, Selin Duraković. Every person and place is invented.

Build these parts in order. The story is an `<article>` that holds parts 2 to 5: it is the one item of `<main>`'s container, and is itself a stack with `gap-12`, so its parts sit as the page's blocks would.

### 1. Header

The header from the layout notes, with the masthead name in `text-h2`. The current page is News, with `aria-current="page"`.

### 2. Story head

The first item of the article: a 12-column grid (as the Grid note says) whose one item, `lg:col-span-10`, is a stack with `gap-4`, so that nothing reaches the right edge on a wide screen.

- A label line: the section as a label link `TRANSPORT` in `text-foreground`, as the Links note gives it, then, in a `<span>` in `text-muted-foreground`, ` · ` and the time published, `06:15`, a `<time>`.
- The `<h1>`: `BRIDGE SHUT FOR SIX MONTHS`, `text-h1` below `md`, `text-display` from `md` up.
- The standfirst: one or two sentences in `font-sans text-h2 font-normal`, sentence case, capped as the Measure note says.
- The byline, a stack with `gap-1` (two lines of one byline): `BY HANA LINDQVIST, CITY REPORTER` in `text-foreground`, then in `text-muted-foreground` `UPDATED 09:40`, a `<time>`.

### 3. Picture

The next item of the article: a 12-column grid whose one item, `lg:col-span-8`, is a picture, `aspect-3/2`, of the bridge with barriers across it, with a caption that names the place and ends with the credit.

### 4. Body and rail

The next item of the article: a row of two columns with a rule between them, as the layout notes describe.

**Body,** `lg:col-span-8 lg:pr-6`: a stack with `gap-4`, each paragraph a `<p>` in `text-body` capped at `max-w-xl`. Everything in the body is capped at `max-w-xl`, the pull quote and the fact box included. The body includes, each styled once:

- One `<h2>` in `text-h2` partway through ("What happens next"). It is the one item of the stack with its own margin: `mt-6`, which with the gap puts 40px above it.
- A link in running text, to `#`, in the Links style.
- One phrase marked with yellow, the `<mark>` from the layout notes, around the figure "£48m" in a sentence. Only one on the page.
- A pull quote after the fourth paragraph: a `<blockquote>` with `border-t-2 border-b py-4`. The quote is a `<p>` in `font-sans text-h2 font-normal italic`, sentence case, with no quotation marks. Under it, `mt-2`, a `<footer>` inside the blockquote: who said it, as a label in `text-muted-foreground` with `not-italic` (`REUBEN ACHTERBERG, TRANSPORT CHIEF`).
- A fact box after the sixth paragraph: an `<aside>` with the `aria-labelledby` of its heading, a box from the layout notes and a stack with `gap-4`. It opens with an `<h2>` label in `font-mono text-label uppercase text-foreground`, `THE BRIDGE IN NUMBERS`, then a `<dl>`, a stack with `gap-4`: four pairs, each a stack with `gap-1` (here, instead of the notes' `gap-2`), the term as a label in `text-muted-foreground` and the value as a big figure. A value with a word in it keeps its lower case (`6 months`). For example `OPENED` 1964, `CROSSINGS A DAY` 40,000, `CLOSED FOR` 6 months, `REPAIR COST` £48m.

**Rail,** `lg:col-span-4 lg:border-l lg:pl-6`, a stack that comes after the body on a phone. It holds the section head "Latest", whose 2px rule divides it from the body below `lg`, and, with `gap-4`, a list of five stories divided by rules: each `<li>` holding an `<article>`, a stack with `gap-1`: a small headline that is a link, as an `<h3>`, and under it its time as a label in `text-muted-foreground`. One of them, the newest, has the "New" label from the Red note before its time: the `<span>` and the `<time>` sit in a row with `flex items-baseline gap-2`.

### 5. Related

The last item of the article: a `<section>` with the section head "Related" and three stories in a row of three with rules. Each is a story unit: a picture `aspect-3/2` with its caption, a kicker that is the story's section name as a plain label in `text-foreground`, not a link (`CITY`), an `<h3>` in `text-h2` that is a link, and the label line with the byline and the day it ran (`MON 9 NOV`), a `<time>`.

### 6. Footer

The footer from the layout notes.

### Behavior

- The page has no state of its own besides the "Menu" button, which works as the layout notes say.
- Links in the body, the rail and the related stories point to `#`.
