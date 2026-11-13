---
page: article page
title: Article page
description: a long-form article or blog post page built for reading, with a table of contents.
order: 3
checks:
  - Body text lines are between 60 and 75 characters long on a desktop screen.
  - The table of contents links jump to their headings, and the heading in view is marked in it.
  - The article is inside an `<article>` element, with one `<h1>` and `<h2>` section headings.
  - Code blocks and the table scroll sideways inside their own box on small screens instead of widening the page.
---

Sample article, if the user gave none: "Why we removed every gradient from our product", a piece by a product designer about replacing decoration with hierarchy, with 600 to 800 words in its paragraphs and list items (headings, the pull quote, the table, the code, the captions and the author note in the article footer are not counted), so the reading time in the label line is the word count at 200 words a minute, rounded up (`4 MIN READ` for 700 words). Write the full text yourself, in plain and specific language, with four `<h2>` sections.

Build these parts in order. An `<article>` wraps the article header, the body layout and the article footer.

### 1. Header

A single row with a 1px bottom border: the publication name in `font-heading text-h2`, three label links, Articles, Topics and About, none of them the current page, and "Subscribe", an `<a>` styled as an `outline` button. Every one points to `#`. Below `md`, the links go behind a "Menu" button and "Subscribe" stays in the row.

### 2. Article header

- Columns 1–12: a label line: the topic, the date and the reading time, e.g. `DESIGN · 12 MARCH 2026 · 4 MIN READ`, the date a `<time>`.
- Columns 1–10: the `<h1>` in `text-display` on `md` and up, `text-h1` below.
- Columns 1–8: a standfirst, one or two sentences in `font-sans text-h2 font-normal`.
- Columns 1–12: a byline label: the author's name and role. No avatar.
- A 1px `border-foreground` rule closes the header.

The article header has `pt-16` and `pb-8` above the closing rule. Space its parts with margins: `mt-2` on the `<h1>` under the label line, `mt-4` on the standfirst and `mt-4` on the byline. The byline names the whole article, not the standfirst, so it takes `mt-4`, here instead of the notes' `gap-2` for a byline. The body layout under the rule has `pt-8`, and ends with the section's `pb-16`, which is the space above Read next's rule.

### 3. Body layout

From `lg` up, a 12-column grid: columns 1–3 hold the table of contents, columns 4–11 hold the article body. Below `lg`, the table of contents sits above the body as a plain list, with `gap-y-8` between them; the grid keeps `gap-y-8` at every width, where from `lg` up it changes nothing.

**Table of contents:** a label heading "ON THIS PAGE" in `text-foreground`, then, `gap-4` below the heading, a list with `gap-2` holding one link per `<h2>` of the article body, as labels. From `lg` up it stays in view while the body scrolls (`lg:sticky lg:top-8 lg:self-start`; without `self-start` a grid item does not stick). Below `lg` it is the same list with the same marking, not sticky. Each link is a block with a 2px left line (`border-l-2`) and `pl-4`. The link for the section in view is `text-foreground` with a `border-foreground` line and `aria-current="location"`; the rest are `text-muted-foreground` with a transparent line. Before the first heading is reached, the first link is the marked one.

**Body:** everything in the body column, the article footer included, is capped at `max-w-lg` (512px, 65 to 70 characters a line in this font). Use `text-body` for paragraphs, with `space-y-4` on the body column for the space between them. The pull quote, figure, code block, list and table each have `my-8`. Keep the body column in normal block flow, not flex or grid: these margins rely on collapsing. Open the body with one or two paragraphs before the first `<h2>`: the column is a grid item, so a first `<h2>`'s `mt-16` would not collapse into the `pt-8` above it. The body must include, each styled once and reused:

- `<h2>` headings in `text-h2`, with `mt-16` above them.
- A pull quote: one sentence in `font-heading text-h1`, between 1px top and bottom borders, with `py-8`.
- A figure: a `bg-card` panel with `p-8`, built from elements, and a `<figcaption>` label. For example two small screen sketches side by side, each under a label, `BEFORE` and `AFTER`, `gap-2` above it. These two are uppercase labels, here instead of the notes' rule for a figure of the product, because the sketches are not the product. Draw the sketches with `bg-foreground`, `bg-background` and borders, never with the primary color or a gradient. Each sketch's box is a drawing, not decoration: give it `role="img"` and an `aria-label` that says what it shows; its `BEFORE` or `AFTER` label stays outside it.
- A code block: a `bg-card` panel with `p-4`, in `font-mono text-body`, that scrolls sideways inside itself. The code in it is text and may show the gradient being removed, but write its colors as token names (`var(--foreground)`, `bg-card`), never as hex or rgb values, so the page's code holds none. Show the gradient as CSS text (`background: linear-gradient(var(--primary), …)`), not as Tailwind class names, which Tailwind would build into the page's CSS.
- An ordered list of three or four steps: `list-decimal pl-4`, with `space-y-2`.
- A small `Table` with a label-style header row and 1px row borders. On a phone it is wider than the column and scrolls in its box. Name it with a label heading, an `<h3>`, above it: wrap the two in one `<div>` with `grid gap-2`, which takes the table's `my-8`, and pass the heading's words as the table's `label`.
- Inline links in `text-primary`, underlined.

### 4. Article footer

In the body column, with `mt-16`: a 1px top border and `pt-8`, then the topics as badges in a `flex flex-wrap gap-2` row, all outlined, since none of them signals anything, and, with `mt-4`, one or two sentences about the author.

### 5. Read next

Section header: `01 / READ NEXT`, with an `<h2>` such as "More on design systems". Three article links in a 12-column grid, four columns each. Each has a 1px top border, `pt-4`, a label (topic and reading time) and an `<h3>` in `text-h2` whose link is `text-foreground` with an underline on hover. No images, no cards.

### 6. Footer

A footer with `py-8` and a 1px top border: the publication name in `font-heading text-h2`, then, `gap-4` below the name, a one-line description in `text-body`, and, with `mt-8`, a label line with the copyright.

### Behavior

- Mark the current section in the table of contents. Work it out from the headings' positions on scroll: the section in view is the last `<h2>` whose top is above a line one third of the way down the window, the first one before any is, and the last one when the page is scrolled to its end. An `IntersectionObserver` on the headings alone misses jumps.
- Jumping to a heading must not hide it under any sticky element: give headings `scroll-mt-8`.
