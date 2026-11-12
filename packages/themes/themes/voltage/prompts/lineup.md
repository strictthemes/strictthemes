---
page: line-up page
title: Line-up
description: the festival's programme, with a day switch, a stage filter, every set as a row with its time and stage, and a personal list of saved sets.
order: 2
checks:
  - The day switch and the stage filter change the rows shown, and the chosen day's button has `aria-pressed="true"` and a check icon.
  - Every set has a time in the mono font as `<time>` elements with a `dateTime`, the act's name and its stage.
  - Each set has a Save button with `aria-pressed`; saving changes the saved count, and "Only my list" shows only saved sets.
  - Exactly one set carries the pink "New" badge, and no other element on the page is pink.
  - When no set matches, the list shows a sentence and a button that shows all sets again.
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Second run of this page: the first led to a revision of the theme's five briefs. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 3,041 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in dark mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Second run on the prompt as revised after the problems the earlier test builds reported: after the first run on that text, the theme's notes now say that the Menu button carries `ml-auto` below `md`, where the dates that carry it are hidden. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,971 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,962 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode, and at 375px. The agent reported 1 minor problem with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: **Tremor Days**, a two-day music and design festival at Varsby Docks, on Friday 4 and Saturday 5 December 2026, with three stages: Crane Stage, Pump House and the Drawing Office (talks and workshops). In a label and in the stage `<select>` that stage is "Drawing Office", with no "the"; in a sentence it is "the Drawing Office". All acts are invented. Use these twenty sets, all times UTC+1:

- **Friday:** Crane Stage: Juno Halde 17:30–18:15, Gravel & Gold 19:00–19:50, The Night Ferries 20:40–21:40, Ossa Bloom 22:40–23:50. Pump House: Neon Allotment 18:00–18:45, Pia Strand 19:30–20:20, Sister Antenna 21:00–22:00, Basement Choir 23:00–00:30. Drawing Office: Teo Marsh, "Posters that shout", 17:00–17:45; Fold Press, "Print your own poster", a workshop, 18:30–19:30.
- **Saturday:** Crane Stage: Odd Weather 14:00–14:45, Lumen Varga 16:00–17:00, Halvard Ek 19:00–20:00, Kettle Drum Union 21:30–23:00. Pump House: Mira Sallis 13:30–14:15, Low Tide Radio 17:30–18:30, Cassette Saints 20:00–21:00, Rook & Ivy 23:30–01:00. Drawing Office: Studio Kantor, "Type for loud places", 13:00–13:45; Ossa Bloom, "Light shows from scrap", 15:00–15:45.

Neon Allotment was added this week and carries the page's one badge, "New" (add the `Badge` with `npx shadcn@latest add badge`).

Build these parts in order, under the header from the layout notes, in which Line-up is the current page.

### 1. Page heading

A section with no heading row. Its stack has `gap-3`:

- A stack with `gap-2`: the label `Tremor Days · 4–5 Dec 2026`, then the `<h1>` "Line-up".
- Two sentences in `text-body`, `max-w-xl`, straight on the page: "Save the sets you want to see. Your list stays in this browser."

### 2. Filters

A section with a visually hidden `<h2>` "Filter the programme". It holds one panel across the full width, with `gap-5`, whose controls stack below `md` and stand in one row from `md` up that wraps: `md:flex-row md:flex-wrap md:items-end`.

- **Day:** a stack with `gap-2`: a visible label "Day" (a `<p>` with an `id`, since a `<label>` cannot name a group), and under it a button group named by that label with `aria-labelledby`, holding "Fri 4 Dec" and "Sat 5 Dec". The chosen one follows the Button groups note, check icon included.
- **Stage:** a stack with `gap-2`: the `<label>` "Stage" and a native `<select>` with All stages, Crane Stage, Pump House and Drawing Office, in a wrapper with `w-full md:w-56`.
- **Only my list:** a row with `flex items-center gap-2`: the shadcn `Checkbox` with `className="rounded-sm"` (add it with `npx shadcn@latest add checkbox`) and, right after it, its `<label>` "Only my list", styled as a label. Give the `Checkbox` `id="only-my-list"` and the `<label>` `htmlFor="only-my-list"`: Base UI puts that `id` on its hidden `<input>` and names the checkbox from the label, so add no `aria-label` or `aria-labelledby` yourself. In `components/ui/checkbox.tsx`, replace `dark:bg-input/30` with `bg-card`, the fill the Inputs note gives a field.
- **Saved count:** at the right end from `md` up (`md:ml-auto`), a `<p>` styled as a label with `tabular-nums`, so it is uppercased on screen, here instead of the Small print note's look for a count; write it as below, always with the prefix: `My list · 3 sets`, `My list · 1 set`, and `My list · no sets yet` when nothing is saved. It counts saved sets on both days, whatever the filters show. It is not a live region: the Save button's `aria-pressed` already tells a screen reader that a set was saved.

### 3. Sets

A section with one panel with rows across the full width. It has no heading row of its own: the panel's heading row is the section's heading.

The heading row wrapper is `flex flex-wrap items-baseline justify-between gap-3`: an `<h2>` in `text-h2` naming the chosen day, "Friday 4 December" or "Saturday 5 December", the whole text in a `<time dateTime="2026-12-04">` (or `2026-12-05`), and at the right end small print with `aria-live="polite"`, the page's one live region, that says how many sets are shown, `10 sets` or `3 of 10 sets` when a filter hides some (`1 of 10 sets` and `0 of 10 sets` too: the noun follows the 10).

Then the sets as a `<ul>` with no markers and no padding, one `<li>` per set, sorted by start time. Each `<li>` is a row from the Panels with rows note, laid out as `flex items-start gap-5 md:items-center`:

- A block that takes the free space, `flex min-w-0 flex-1 flex-col gap-1`, which from `md` up becomes a row: `md:flex-row md:items-center md:gap-5`. In it, in this order:
  1. The time, `md:w-32 md:shrink-0`, in `font-mono text-label font-bold tabular-nums`: two `<time>` elements joined by an en dash, `17:30–18:15`. Each has a full `dateTime` with the offset (`2026-12-04T17:30+01:00`); a time after midnight belongs to the next date, so Basement Choir ends at `2026-12-05T00:30+01:00`.
  2. The act, `md:flex-1 md:min-w-0`: a row with `flex flex-wrap items-center gap-2` holding an `<h3>` in `text-h2` with the act's name as a link to its page (`/artists/<slug>`, such as `/artists/ossa-bloom`; no underline at rest, `underline underline-offset-4` on hover), and for Neon Allotment the "New" badge after it. For a talk or a workshop, what it is follows the name in the same row, outside the `<h3>`, as a `<p>` in `text-body`: "Talk: Posters that shout", "Workshop: Print your own poster", "Talk: Type for loud places" and "Talk: Light shows from scrap", with no quotation marks.
  3. The stage, `md:w-40 md:shrink-0`, as a label.
- At the right end, `shrink-0`, the Save button: a toggle with `aria-pressed`, holding an icon and the word "Save", and a `<span className="sr-only">` with the act's name and the day, so each button has its own name ("Save Ossa Bloom, Friday"). Not saved: a quiet button with the `Plus` icon. Saved: `variant="secondary"` with the `Check` icon. The word stays "Save" in both states; the pressed state and the icon say which it is.

On a phone the time and the stage sit above and below the name. A long name wraps inside its block and never pushes the button off the screen.

When no set matches, the `<ul>` is replaced by one row with `flex flex-col items-start gap-3`: the sentence "No sets match these filters." in `text-body` and a quiet button, "Show all sets".

### 4. Footer

The footer from the layout notes.

### Behavior

- Keep the sets as data in the component, and the chosen day, the chosen stage, "Only my list" and the saved sets in state. The rows shown are the chosen day's sets, narrowed by the stage and, when it is ticked, by the saved list. The page starts on Friday, all stages, with "Only my list" off.
- Save and unsave by each set's own id, so a set saved on Friday stays saved when you switch to Saturday and back. Unsaving a set while "Only my list" is on removes its row; move focus to the next row's Save button, or to the previous one when it was the last, or to the "Show all sets" button when none is left.
- Keep the saved ids in `localStorage` under one key, read once when the page loads and written on every change. Wrap both in `try`/`catch`: where storage is not available, the list still works for the visit.
- "Show all sets" sets the stage back to All stages and turns "Only my list" off; it keeps the day, and moves focus to the stage `<select>`.
- Changing a filter does not move focus. The shown count changes in its `aria-live` element, which is how a screen reader learns the result.
