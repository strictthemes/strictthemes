---
page: artist page
title: Artist
description: the page of one act at the festival, with its name, where it is from, a picture, a short text, its sets and the other acts on the same day.
order: 4
checks:
  - The act's name is the page's `<h1>`, `text-display` from `md` up and `text-h1` below, and where the act is from stands right under it.
  - The picture is a plain element with `role="img"` and an `aria-label`, with no image file, and its caption sits under it.
  - The text about the act is on a white panel, not straight on the yellow page.
  - Each set gives its day and its times as `<time>` elements with a `dateTime`, and its stage in words.
  - The other acts on the same day are panels with a round avatar of initials, the act's name as a link, and its time and stage.
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      First run of this page, on briefs revised after another page of the theme was built. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 99.1% of 2,121 measured values, with no errors and 2 warnings for the round avatars with initials, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Second run on the prompt as revised after the problems the earlier test builds reported: after the first run on that text, the theme's notes now say that the Menu button carries `ml-auto` below `md`, where the dates that carry it are hidden. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 99.2% of 2,125 measured values, with no errors and 2 warnings for the round avatars with initials, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode, and at 375px, where the Menu button sits at the right end of the header. The agent reported 6 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,124 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: **Tremor Days**, a two-day music and design festival at Varsby Docks, on Friday 4 and Saturday 5 December 2026. The act is **Ossa Bloom**, an invented electronic duo from Gothenburg, Sweden: Edda Lind builds the music, Sami Rahko the light. They play the Crane Stage on Friday, 22:40–23:50, and give a talk in the Drawing Office on Saturday, 15:00–15:45, "Light shows from scrap". Also on Friday: Gravel & Gold (Crane Stage, 19:00), The Night Ferries (Crane Stage, 20:40), Sister Antenna (Pump House, 21:00) and Basement Choir (Pump House, 23:00). All names are invented.

Build these parts in order, under the header from the layout notes, in which Line-up is the current page, since an act's page belongs to it.

### 1. Name

A section with no heading row. Its stack has `gap-3`:

- A text link back to the line-up, "All acts" (`/line-up`), with the `ArrowLeft` icon before it, in a row with `inline-flex self-start items-center gap-2`, so it does not stretch across the stack. It is a label, so it has `font-mono text-label font-bold uppercase` and keeps the link's underline.
- A stack with `gap-2`: the label `Fri 4 Dec · Crane Stage`, the date a `<time dateTime="2026-12-04">`, then the `<h1>` "Ossa Bloom". The label gives the live set only; the Saturday talk is listed under Sets.
- Where they are from, in `font-heading text-h2`: "From Gothenburg, Sweden".

### 2. About

A section with a visually hidden `<h2>` "About Ossa Bloom" and the grid from the layout notes; the two items stack below `md`, picture first.

**Picture, `md:col-span-5`:** a `<figure>` from the Pictures note. The picture is `aspect-square` and is drawn from plain elements: inside it, a stack with `flex h-full flex-col justify-end gap-3 p-5` holds three bars of light, each `h-3 bg-background` with no corners, with the widths `w-1/2`, `w-3/4` and `w-full`, and under them the duo's initials, "OB", in `font-heading text-display text-background`, the one other `text-display` text on the page. The picture has `role="img"` and the `aria-label` "Drawing of three bars of light over the letters OB, on black". The bars and the letters inside it get `aria-hidden="true"`. The `<figcaption>`: `Edda Lind · Sami Rahko`, each name in its own `<span>` with `normal-case`.

**Text, `md:col-span-7`:** a panel with `gap-5`:

1. An `<h3>` in `text-h2`: "Music you can see".
2. Three paragraphs in `text-body`, in a stack with `gap-3`, each at most `max-w-xl`: how the two met, what a set sounds like, and how the light rig is built from parts found at scrap yards. Write them yourself; keep them plain and specific, about 120 words in all.
3. A row of facts with `border-t border-border pt-5` and `flex flex-wrap gap-x-8 gap-y-3`, three pairs, each a stack with `gap-1`: a label, here in `text-muted-foreground` in place of the Labels note's `text-foreground`, and its value in `text-body`. `Plays` "Live electronics and light", `First album` "Static Harbour, 2024", `Members` "Edda Lind, Sami Rahko".

### 3. Sets

A section. Its heading row holds the `<h2>` "Sets at Tremor Days".

One panel with rows across the full width, with no heading row of its own: the section's `<h2>` names it. It holds a `<ul>` with no markers and no padding, one `<li>` per set as a row from the Panels with rows note, laid out as `flex flex-col gap-1 md:flex-row md:items-center md:gap-5`:

1. The day and the times, `md:w-56 md:shrink-0`, in `font-mono text-label font-bold uppercase tabular-nums`: `Fri 4 Dec · 22:40–23:50`. The day is a `<time dateTime="2026-12-04">`; each time is a `<time>` with a full `dateTime` and the offset (`2026-12-04T22:40+01:00`).
2. What the set is, `md:flex-1`, an `<h3>` in `text-h2`: "Live set" and "Talk: Light shows from scrap".
3. The stage, `md:w-40 md:shrink-0`, as a label: `Crane Stage` and `Drawing Office`.

On a phone the three parts stack in that order inside the row.

### 4. Also on Friday

A section. Its heading row holds the `<h2>` "Also on Friday" and, at the right end, a text link "Full line-up" (`/line-up`).

Then the grid from the layout notes with four panels, each `md:col-span-6 lg:col-span-3`: two by two on a tablet, four in a row on a laptop, one under another on a phone. Each panel is the stock panel, laid out as a row: `flex-row items-center gap-3`, in place of the panel's `flex-col`. It holds:

- An avatar from the Avatars note with the act's initials (`GG`, `NF`, `SA`, `BC`).
- A stack with `min-w-0 flex-1 gap-1` (`flex flex-col`): the act's name as an `<h3>` in `text-h2 break-words` holding a link to its page (`/artists/<slug>`; no underline at rest, `underline underline-offset-4` on hover), and under it a label line with the start as a `<time>` and the stage: `19:00 · Crane Stage`. A long name wraps between words inside the stack, and `break-words` breaks a single word too long for it, which can happen four to a row at `lg`.

### 5. Footer

The footer from the layout notes.

### Behavior

- The page has no state of its own besides the menu button. "All acts", "Full line-up" and the act names are links and need no behavior.
- Keep the act's details, its sets and the other acts as data in the component, so the page could be filled for any act from the same shape.
