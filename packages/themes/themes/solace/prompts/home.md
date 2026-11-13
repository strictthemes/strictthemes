---
page: therapy practice home page
title: Home
description: the home page of a private therapy practice of one therapist, with a quiet opening, what people bring as a short list, how it starts in three steps, the therapist in brief with a round portrait, the fee in one line and one action.
order: 1
checks:
  - "The `<h1>` is the page's only `text-display` text, from `md` up, its phrase time to think is an `<em>` in the italic, and no heading or text on the page is bold."
  - "The page has exactly one default (indigo) button, Request a first session, a link to /first-session inside the last card; the header and the opening hold no button."
  - "The three steps are an ordered list of three cards, each with a step number, a heading, a sentence or two and a label line: I reply within 2 working days, 20 minutes and Free, 50 minutes and £68."
  - "The portrait is a 72px round fill with the initials NE, with the img role and an aria-label, beside the name and a line of training; nothing else on the page is round."
  - "The fee is one line in the heading font at `text-h1`, an `<h2>`, and it says 50 minutes and £68."
  - "Sections are divided by 112px of space alone, with no hairline or fill between them, and no sentence on the page hurries the reader or promises a result."
---

Sample content, if the user gave none: the practice of **Nora Ellingham**, an invented registered psychotherapist who works alone, with adults, one to one, in a garden room at 14 Orchard Row in Larkmere, an invented town, and online by video. In private practice since 2014, after four years of training and nine years as a teacher. A session is 50 minutes and costs £68; it starts with a free call of 20 minutes; she replies to a request within two working days. The copy below is given word for word, because the page is only as calm as its words: use it as it is.

Build these parts in order.

### 1. Header

The header from the layout notes. None of the links is the current page.

### 2. Opening

The first section, in the grid, with its `aria-labelledby` naming the `<h1>`:

- A label line in `text-muted-foreground`, columns 1–12 (`md:col-span-12`): `Psychotherapy · Larkmere and online`.
- With `mt-4`, the `<h1>` in `text-h1 md:text-display`, columns 1–9 (`md:col-span-9`): "A quiet room, and time to think". The words "time to think" are an `<em>` with `italic`. It runs over two lines on a large screen.
- With `mt-7`, a `<p>` in columns 1–7 (`md:col-start-1 md:col-span-7`, which overlap the `<h1>`'s, so it starts a row under it), at most `max-w-xl`, in `text-body`: "I am Nora Ellingham, a psychotherapist. I work with adults, one to one, in a garden room in Larkmere and online. You do not need to know what to say before you come."
- With `mt-7`, in the same columns (`md:col-start-1 md:col-span-7`), a `<p>` holding one link in running text: "How it starts", to `#how-it-starts`.

No picture, no button and no badge in this section: the heading and the space around it are the whole opening.

### 3. What people bring

A section in the grid, with two parts:

- **Heading**, in columns 1–4 (`md:col-span-4`): an `<h2>`, "What people bring", then with `mt-4` a `<p>` in `text-body`: "Most people come with one of these, or with something they cannot name yet. Both are fine."
- **The list**, in columns 6–12 (`md:col-start-6 md:col-span-7`), with `mt-7 md:mt-0`: one `<div>` holding a `<ul>` as a list with hairlines (see the layout notes), six entries. Each `<li>` holds an `<h3>` in `text-h2` and, with `mt-2`, one sentence in `text-body`. Under the list, in the same `<div>`, with `mt-7`, a `<p>` in `text-body`, at most `max-w-xl`: "If what you carry is not on this list, write to me anyway. I will tell you honestly whether I am the right person."

  The entries, in this order, word for word:

  1. "Anxiety and worry": "Thoughts that will not settle, or a body that is always braced."
  2. "Low mood": "Days that feel flat or heavy, often with no clear reason."
  3. "Grief and loss": "Someone or something has gone, and the world carries on anyway."
  4. "Burnout and work": "You keep going, and it costs more than it used to."
  5. "Relationships": "The same hurt keeps coming round, with a partner, with family or at work."
  6. "A change you did not choose": "Illness, redundancy, a move, or the end of something."

### 4. How it starts

A section with the `id` `how-it-starts` and `scroll-mt-7`, that is not a grid:

- An `<h2>`: "How it starts".
- With `mt-4`, a `<p>` in `text-body`: "Three steps, at your own pace. You can stop after any of them."
- With `mt-7`, an `<ol>` with `list-none` and no padding that is itself the grid (`grid grid-cols-1 md:grid-cols-12 md:gap-x-7`). Its three `<li>` are cards from the layout notes, each with `md:col-span-4`, the second and third with `mt-4 md:mt-0`. A card is also `flex flex-col`, and holds, in this order:
  - A label line in `text-muted-foreground`: `Step 1`, `Step 2`, `Step 3`.
  - With `mt-4`, an `<h3>` in `text-h2`.
  - With `mt-4`, a `<p>` in `text-body`.
  - Last, a label line in `text-foreground` with `mt-auto pt-7` (here, in place of a top margin from the rhythm rule), so the three lines stand on one level whatever the length of the text above them.

  The steps, word for word:

  1. "You write to me": "Fill in a short form, and say as much or as little as you like. A name and a way to reach you is enough." Label: `I reply within 2 working days`.
  2. "We speak for 20 minutes": "A call, by phone or video. You can ask me anything, and I ask what you hope for. There is no charge." Label: `20 minutes · Free`.
  3. "We meet for a first session": "In the room or online. At the end we each say whether we would like to go on. Either answer is fine." Label: `50 minutes · £68`.

### 5. Who you would be talking to

A section in the grid, with two parts:

**The text**, in columns 1–7 (`md:col-span-7`):

- An `<h2>`: "Who you would be talking to".
- With `mt-7`, a row with `flex items-center gap-4`: the portrait from the layout notes, and beside it a `<div>` with `min-w-0` holding the name as a `<p>` in `font-heading text-h2`, "Nora Ellingham", and with `mt-2` a label line in `text-muted-foreground`, `Registered psychotherapist · In practice since 2014`.
- With `mt-7`, two paragraphs in `text-body`, each at most `max-w-xl`, the second with `mt-4`: "I trained for four years, after nine years as a teacher. I have worked with adults in private practice since 2014." and "I listen more than I talk. I will not hurry you, and I will not tell you what to do with your life."
- With `mt-7`, a `<p>` holding one link in running text: "More about me and my training", to `/about`.

**The note**, in columns 9–12 (`md:col-start-9 md:col-span-4`), with `mt-12 md:mt-0`: a card from the layout notes.

- An `<h3>` in `text-h2`: "In short".
- With `mt-4`, a `<dl>` of three rows. Here, instead of the Description lists note, a row is a plain `<div>` with no hairline, the second and third with `mt-4`: the `<dt>` holds a badge from the layout notes and takes no text color of its own, because the badge brings its colors; and the `<dd>`, with `mt-2`, one line in `text-body`. The rows: "In person" / "The Garden Room, 14 Orchard Row, Larkmere"; "Online" / "By video, with a link I send the day before"; "Evenings" / "On Wednesdays, until 20:00".

These three are the page's only badges.

### 6. The fee

A section in the grid, with its content in columns 1–8 (`md:col-span-8`):

- A label line in `text-muted-foreground`: `Fees from 1 January 2027`, with only the date in a `<time dateTime="2027-01-01">`.
- With `mt-4`, the fee in one line: an `<h2>` in `text-h1` (here, instead of the notes' `text-h2`), "A session is 50 minutes and costs £68".
- With `mt-4`, a `<p>` in `text-body`, at most `max-w-xl`: "The first call is 20 minutes and free. I send one invoice a month, and there is no charge if you cancel with 48 hours' notice."
- With `mt-7`, a `<p>` holding one link in running text: "Fees, paying and cancelling", to `/fees`.

### 7. The one action

A section in the grid, with one card in columns 1–8 (`md:col-span-8`), built as the note The one action says. The section's `aria-labelledby` names the card's `<h2>`.

- The `<h2>`: "When you are ready".
- With `mt-4`, a `<p>` in `text-body`, at most `max-w-xl`: "The button leads to a short form. I reply within two working days, and nothing is booked until we have spoken."
- With `mt-7`, a `<div>` holding the default button "Request a first session", an `<a>` to `/first-session`. The page's one default button.

### 8. Footer

The footer from the layout notes.

### On a phone

Every part is one column. The `<h1>` is `text-h1` and wraps over two lines. The list of what people bring comes 28px under its heading and sentence. The three step cards stack, 16px apart, each as tall as its own text. The portrait keeps its 72px and the name stays beside it; the label line under the name wraps. The In short card comes 48px under the text. The fee's line wraps over three lines. The button is as wide as its words.

### Behavior

Nothing on this page has state. Links only: "How it starts" jumps to the steps, and `scroll-mt-7` keeps their heading clear of the top edge.
