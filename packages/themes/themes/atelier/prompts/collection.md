---
page: lookbook page
title: Collection
description: a season's lookbook for a fashion house, with numbered looks laid out large and uneven across the grid, each with a caption and credits, and a short text about the season.
order: 2
checks:
  - The looks are numbered in order, `Look 01` to `Look 07`, and no two pictures that share a row from `md` up have the same width and the same top edge.
  - Two looks have their caption beside the picture from `md` up, one on the right and one on the left; on a phone every caption sits under its picture.
  - Every picture has an `aria-label` that describes the photograph, and every look's caption names the pieces and gives a credit.
  - The credits for the whole shoot are a `<dl>`, and the season's text is at most `max-w-md` wide.
---

Sample house, if the user gave none: **Maison Ardelle**, a small fashion house in Lyon founded in 2014 by Inès Ardelle. This page is its lookbook for Autumn–Winter 2026, called *Still Water*: seven looks in undyed wool, black linen and silk the color of skin, shot in the empty Bains du Rhône swimming baths in Lyon in September 2026. Photography by Tomas Reyl, styling by Anouk Delmas, casting by Petra Laine, hair and make-up by Sami Okafor. The models are Yara Benali, Marit Ekwall and Joon Seo. The pieces are the Lune wrap coat, the Ilse pleated skirt, the Mira silk shirt, the Sorel wide trousers, the Nadia knitted dress, the Tove belted cardigan and the Ren linen shirt-dress. This page shows no prices.

Build these parts in order.

### 1. Header

The header from the layout notes. "Collection" is the current page.

### 2. The season

The first section, in the grid:

- A label line in `text-muted-foreground`, across columns 1–12 (`md:col-span-12`): `Autumn–Winter 2026 · 7 looks`.
- With `mt-4`, the `<h1>` in `text-h1 md:text-display`, columns 1–8 (`md:col-span-8`): the collection's name, "*Still Water*", the whole name in an `<em>`. This is the page's one italic.
- With `mt-8`, the season's text, one `<div>` in columns 5–9 (`md:col-start-5 md:col-span-5`), which overlap the `<h1>`'s, so it starts a row under it; each paragraph at most `max-w-md`: two short paragraphs in `text-body`, the second with `mt-4`. Say where the clothes were shot, what they are made of and one thing that is new this season.

### 3. The looks

A section whose content is an `<ol>` with `list-none` that is itself the grid (`grid grid-cols-1 md:grid-cols-12 md:gap-x-8`), with `aria-label="Looks"`: the section has no visible heading. Each look is an `<li>` holding a `<figure>`; the margin is on the `<li>`, and the `<figure>` has none. Look 01 has no top margin at any width: the section's own margin is the gap above it. Every look after it has `mt-16` on a phone; the margin from `md` up is given for each. Lay them out exactly like this:

| Look | Columns of the `<li>` | Top margin from `md` | Picture | Caption |
|---|---|---|---|---|
| 01 | `md:col-span-12` | none | columns 1–8, `aspect-4/5` | beside, columns 9–11 |
| 02 | `md:col-start-2 md:col-span-4` | `md:mt-32` | `aspect-3/4` | below |
| 03 | `md:col-start-8 md:col-span-5` | `md:mt-16` | `aspect-2/3`, `bg-card` | below |
| 04 | `md:col-span-12` | `md:mt-32` | columns 5–12, `aspect-4/3` | beside, columns 2–4, on the left |
| 05 | `md:col-start-1 md:col-span-5` | `md:mt-32` | `aspect-3/4` | below |
| 06 | `md:col-start-7 md:col-span-3` | `md:mt-32` | `aspect-2/3`, `bg-card` | below |
| 07 | `md:col-start-10 md:col-span-3` | `md:mt-16` | `aspect-3/4` | below |

This table is for you, not for the page. Looks 01 and 04 use the caption-beside layout from the layout notes, where the `<figure>` is itself a 12-column grid: for look 01 the picture is `md:col-span-8` and the caption `md:col-start-9 md:col-span-3`; for look 04 the picture is `md:col-start-5 md:col-span-8` and the caption `md:col-start-2 md:col-span-3`, both with `md:row-start-1`. Looks 02 and 03 share a row, and so do 05, 06 and 07: the top margins make each row uneven. A margin counts from the foot of the row above, which ends at the foot of its tallest look, and it is the whole gap: under look 01, look 02 starts 128px lower and look 03 64px lower. Pictures are `bg-secondary` unless the table says `bg-card`.

Each caption has three or four label lines, as the layout notes describe:

- The look number in `text-foreground`: `Look 03`.
- The pieces it shows in `text-muted-foreground`, joined with ` · `: `Lune wrap coat · Mira silk shirt`. In look 03, "Lune wrap coat" is a link to the piece page (`#`, as the Links note says), styled as a link in a caption and kept in `text-foreground`. The other pieces are plain text.
- The credit in `text-muted-foreground`: `Worn by Marit Ekwall`.
- For the two looks with the caption beside the picture, a fourth line in `text-muted-foreground` with what the pieces are made of.

The pieces and the model of each look:

- 01: `Lune wrap coat · Sorel wide trousers`, Yara Benali; fourth line `Undyed wool · Black linen`.
- 02: `Mira silk shirt · Ilse pleated skirt`, Marit Ekwall.
- 03: `Lune wrap coat · Mira silk shirt`, Marit Ekwall.
- 04: `Ren linen shirt-dress · Tove belted cardigan`, Joon Seo; fourth line `Black linen · Undyed wool`.
- 05: `Nadia knitted dress`, Yara Benali.
- 06: `Tove belted cardigan · Ilse pleated skirt`, Joon Seo.
- 07: `Sorel wide trousers · Mira silk shirt`, Yara Benali.

Each picture's `aria-label` describes that photograph in one sentence: the clothes, the pose, the room. The look number is in it too ("Look 03: …").

### 4. Credits

A section in the grid, with its content in columns 5–9 (`md:col-start-5 md:col-span-5`): a label heading "Credits", an `<h2>`, then with `mt-4` a `<dl>` as the layout notes describe it, with six rows: Photography, Styling, Casting, Hair and make-up, Models, Location (`Bains du Rhône, Lyon`). The models' names are one `<dd>`, joined with commas. Then with `mt-8` a `<p>` holding a link "Book a fitting" to the appointment page, in `font-mono text-label uppercase` and styled as a link in running text (the margin is on the `<p>`: a link is inline).

### 5. Footer

The footer from the layout notes.

### On a phone

Every look is one column at the full width, `mt-16` under the one before, with its caption under its picture. The pictures keep their ratios, so the page is long and the rhythm comes from their different heights. The season's text and the credits take the full width.

### Behavior

Nothing on this page has state. Links only.
