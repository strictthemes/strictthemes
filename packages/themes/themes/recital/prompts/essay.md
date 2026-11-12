---
page: essay page
title: Essay
description: a long essay or article page built to be read from start to finish, with a block quote, a figure and footnotes.
order: 1
checks:
  - Body text in the reading column averages 60 to 70 characters a line on a desktop screen, and no text is centered or justified.
  - Each footnote number jumps to its note, and each note has a link back to the place it came from.
  - The block quote and every emphasis are in real italics, and there is no bold in the running text.
  - The essay is inside an `<article>` element with one `<h1>`, and the footnotes are an ordered list.
---

Sample essay, if the user gave none: "The case for the slow reply", a 900 to 1,100 word essay by a writer who answers letters for a small magazine, about why a considered answer a week later is worth more than a quick one today. Write the full text yourself, in the first person, plain and specific, with three `<h2>` sections. The publication is called "The Long Margin".

Build these parts in order. An `<article>` wraps the essay header, the body, the footnotes and the author note.

### 1. Header

The publication's name and three nav links, in this order: Essays (`/essays`), Journal (`/journal`), About (`/about`). None is marked as the current page.

### 2. Essay header

In the reading column, with `pt-12`:

- A label line: the kind of piece, the date and the reading time, e.g. `Essay · 12 March 2026 · 5 min read`.
- The `<h1>`, with `mt-4`.
- A standfirst with `mt-4`: one or two sentences.
- A byline label with `mt-6`: `By` and the author's name. No avatar.
- A 1px rule (`<hr>`) with `mt-12`, the last element of this column.

The body's first reading column has `mt-12`, and its first paragraph has no top margin of its own.

### 3. Body

In the reading column, except the figure. The body must include, each once unless stated:

- **A drop cap** on the first paragraph only: `first-letter:float-left first-letter:mr-2 first-letter:-mb-1 first-letter:font-heading first-letter:text-display first-letter:text-primary`. The `-mb-1` is the page's one negative margin: it trims the letter's box and pulls nothing out of the column. How many lines the letter spans (two or three) depends on the browser's font metrics; either is right, so add no other margin or line height to it.
- **Three `<h2>` headings**, each with an `id`.
- **Two footnote references** in different paragraphs. A reference is `<sup className="font-mono text-label leading-none">` (`leading-none` keeps the raised number from opening its line) holding a link to its note: the link's text is the number, its `id` is `fnref-1`, its `href` is `#fn-1` and its `aria-label` is "Note 1". Style the link as a link in running text.
- **A block quote** of one or two sentences that someone else said or wrote, with their name under it.
- **A figure**, wide, between two reading columns, with `my-12`: a simple drawing made of elements that belongs to the essay, for example two rows comparing "Replies sent the same day" and "Replies sent a week later" by how many needed a correction afterwards. The rows are `mt-6` apart. Each row is a label and under it, with `mt-2`, a line that is `flex items-center gap-4`: a track (`h-4 flex-1 border bg-background`) with a `bg-foreground` bar inside it, as tall as the track (`h-full`), and the number as a label in a column of fixed width (`w-24 shrink-0`), so that both tracks are the same length. Set the bar's width as a percentage with an inline `style`: it is data, and a width is a size, not spacing. Give the drawing a text alternative: `role="img"` on the panel, with an `aria-label` that states the numbers.
- **An aside**: a card (`my-12`) with a label ("A note on method") and two or three sentences.
- **An emphasis** (`<em>`) in at least two paragraphs, and one link in running text.

### 4. Footnotes

In the reading column, with `mt-12`, a 1px top border and `pt-6`: a label heading "Notes", then with `mt-4` an ordered list with its numbers showing (`list-decimal pl-6`, and `mt-2` between the notes). Each `<li>` has the `id` `fn-1`, `fn-2`, holds one or two sentences, and ends, after a space, with a link back to its reference, styled as a link in running text: the text "Back", with the `aria-label` "Back to reference 1" (or 2).

### 5. Author note

In the reading column, with `mt-12`: a card (`mb-12`, as the notes give a card that opens a part). Inside it a label `<p>` ("About the author"), then with `mt-2` the author's name as an `<h2>` in `text-h2`, then with `mt-4` two sentences about them and a link in running text to more of their essays.

### 6. Keep reading

In the reading column, with `mt-24`: an `<h2>` "Keep reading", then with `mt-6` a list of three other essays. Each item has a 1px top border and `py-6`: a label line (date and reading time, e.g. `2 February 2026 · 7 min read`), then with `mt-2` the title as an `<h3>` in `text-h2` that holds a link, then with `mt-2` one sentence about the essay.

### 7. Footer

The footer from the layout notes.

### Behavior

- A footnote reference jumps to its note and the note's "Back" link jumps to the reference. Give both targets `scroll-mt-6` so they do not land at the very top edge.
- Nothing else needs behavior.
