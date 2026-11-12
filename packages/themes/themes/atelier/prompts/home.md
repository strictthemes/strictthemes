---
page: home page
title: Home
description: the opening page of a small fashion house, with one very large heading, one large picture placed off-center, the current collection, three pieces from it and a link onward.
order: 1
checks:
  - The `<h1>` is the page's only `text-display` text, from `md` up, and exactly one word in it is in the heading font's italic.
  - The large picture spans eight columns and does not start at the left edge of the grid, with its caption beside it from `md` up and under it on a phone.
  - The three pieces sit at different columns and heights from `md` up, not in an even row, and each has a caption with its name and its price in the mono font.
  - The page has exactly one badge, and it is the only blush on the page.
  - "Most of the screen is empty: no section has a background, a border box or a card."
---

Sample house, if the user gave none: **Maison Ardelle**, a small fashion house in Lyon founded in 2014 by Inès Ardelle. It makes two collections a year in small numbers, cut in its own atelier from wool, linen and silk woven in Europe. The current collection is Autumn–Winter 2026, called *Still Water*: seven looks in undyed wool, black linen and silk the color of skin. Its pieces include the Lune wrap coat (€1,480), the Ilse pleated skirt (€640) and the Mira silk shirt (€520). Pictures are by the photographer Tomas Reyl. Write the rest of the copy yourself, short and plain: this page says little.

Build these parts in order.

### 1. Header

The header from the layout notes. None of the links is the current page.

### 2. Opening

The first section, in the grid:

- The `<h1>` in `text-h1 md:text-display`, across columns 1–10 (`md:col-span-10`). Sample: "Clothes cut slowly, to be worn for *years*", with the one italic word in an `<em>`.
- With `mt-16`, the large picture, as a figure with its caption beside it (see the layout notes). The picture takes columns 5–12 (`md:col-start-5 md:col-span-8`), `aspect-4/5`, `bg-secondary`. The caption takes columns 2–4 (`md:col-start-2 md:col-span-3`), to the left of the picture, so both get `md:row-start-1`. Caption lines: `Look 01 · Still Water`, then `Lune wrap coat, undyed wool`, then `Photograph · Tomas Reyl`.

This picture is the page's one image that fills most of a screen. Nothing else stands beside it.

### 3. The collection now

A section in the grid, with its content in columns 5–12 (`md:col-start-5 md:col-span-8`):

- A label line in `text-muted-foreground`: `Autumn–Winter 2026`. Beside it on the same line, the page's one badge: "New season". Add it with `npx shadcn@latest add badge`. Put the two in a `<div>` with `flex flex-wrap items-center gap-x-4 gap-y-2`: 16px between them on one line, 8px when the badge wraps under the label.
- With `mt-4`, an `<h2>` in `text-h2`: the collection's name with the name itself in an `<em>`, "*Still Water*". This is the page's second and last italic.
- With `mt-4`, one or two sentences in `text-body`, at most `max-w-md`: what the collection is made of and how many looks it has.

### 4. Three pieces

A section that is not a grid, with a label heading "From the collection", an `<h2>` at the full width. Then with `mt-8` a `<ul>` that is itself the grid (`grid grid-cols-1 md:grid-cols-12 md:gap-x-8`, `list-none`), holding three `<li>`, each a figure with its caption below:

- **First:** `md:col-start-1 md:col-span-4`, picture `aspect-3/4`.
- **Second:** `md:col-start-6 md:col-span-3`, with `mt-16 md:mt-32`, picture `aspect-2/3`, `bg-card`.
- **Third:** `md:col-start-10 md:col-span-3`, with `mt-16` at every width, picture `aspect-3/4`.

The three start at different heights from `md` up; the row is meant to look uneven. Each caption's first line is a `<p>` with `flex items-baseline justify-between gap-4`: the piece's name as a link to its page (styled as a link in a caption, in `font-mono text-label uppercase`) and its price in `font-mono text-label tabular-nums text-foreground` with `shrink-0`. The link has `min-w-0`: in a three-column box (up to about 1000px wide screens) a long name such as "Ilse pleated skirt" wraps onto two lines beside the price, which stays on one line at the right. The second line, with `mt-1`, gives the material in `text-muted-foreground`. Write each picture's `aria-label` as a description of the photograph of that piece.

### 5. Onward

A section in the grid with one `<p>` in columns 5–12 (`md:col-start-5 md:col-span-8`), holding a link "See the whole collection" to the collection page, as a label (`font-mono text-label uppercase`) styled as a link in running text, followed by the `ArrowRight` icon, in `inline-flex items-center gap-2`. Not a button: the page has no button at all.

### 6. Footer

The footer from the layout notes.

### On a phone

Every part is one column. The `<h1>` is `text-h1` and wraps over three or four lines. The large picture takes the full width with its caption under it. The three pieces stack: the first has no margin (the list's `mt-8` is above it), the second and the third are `mt-16` under the one before. The badge wraps under the season label if the line is too short.

### Behavior

Nothing on this page has state. Links only.
