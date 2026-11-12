---
page: patch notes page
title: Patch notes
description: the patch notes of one version of a team arena game, with its version and date, a summary, the new features, a table of balance changes with before and after figures and a filter by class, the fixes and the known issues.
order: 2
checks:
  - "The version PATCH 4.2 is the page's `<h1>` and its only `text-display` text, and its date is a `<time>` with `dateTime=2026-11-10`."
  - "The balance table gives every change's before and after figures in `font-mono tabular-nums`, right-aligned, and names each change Buff or Nerf in words."
  - "Choosing a class in the filter shows only that class's rows, marks only the chosen button with `aria-pressed=true`, and the count line says how many changes are shown."
  - "The counts at the top (3 new, 8 balance changes, 10 fixes, 3 issues) match the items in the sections below."
  - "The page has one badge, Live, and no default (red) button or link."
---

Sample content, if the user gave none: **Ashfall**, an invented free-to-play team arena game for PC by an invented studio, **Lowlight Games**. Two teams of five; four classes, Bulwark, Cinderblade, Flarecaster and Mender. This is **patch 4.2**, released on Tuesday 10 November 2026, the second patch of Season 4: Dry Lightning. The one before it was patch 4.1, on Tuesday 20 October 2026. Patch 4.2 brings 3 new things, 8 balance changes, 10 fixes, and lists 3 known issues. Write the fixes and the known issues yourself, in plain words, as a player would read them.

Build these parts in order.

### 1. Header

The header from the layout notes. "Patch notes" is the current page.

### 2. Version

The first `<section>`, a grid (`md:grid-cols-12`):

- Columns 1–8: a label line in `text-muted-foreground`: `Patch notes · ` and the date, `Tue 10 Nov 2026`, a `<time dateTime="2026-11-10">`. With `mt-2`, a row `flex flex-wrap items-center gap-x-6 gap-y-2`: the `<h1>` "Patch 4.2" in `text-h1 md:text-display uppercase tabular-nums`, and the page's one badge, "Live". With `mt-6`, the summary: two paragraphs within `max-w-xl`, the second with `mt-3`. The first says what the patch is about: a new 2v2 mode, Duel Pits, and a round of balance that slows the Cinderblade and Bulwark front lines that ruled the first weeks of the season. The second says that the servers were down for an hour, from 08:00 to 09:00 on Tuesday, and that ranked ratings were not touched.
- Columns 9–12, with `mt-12 md:mt-0`: the counts, a `<dl>` with `grid grid-cols-2 gap-x-6`, four entries, each a `<div>` with `border-t border-border py-3`: the `<dt>` a label in `text-muted-foreground` (`New`, `Balance`, `Fixes`, `Issues`: short, so each fits on one line in a column at `md`), the `<dd>` with `mt-2` a big figure in `font-mono text-h2 tabular-nums` (`3`, `8`, `10`, `3`). The counts are fixed: the filter below does not change them.

Under the grid, with `mt-12`, a `<nav>` with the `aria-label` "On this page", holding a `<ul>` with `flex flex-wrap gap-x-6 gap-y-2` of four label links in `text-foreground` with `underline decoration-1 underline-offset-4 hover:decoration-2`: New (`#new`), Balance changes (`#balance`), Fixes (`#fixes`), Known issues (`#known`).

### 3. New

The second `<section>`, with `mt-20` and the `id` "new". An `<h2>` "New" in `text-h2 md:text-h1 uppercase`. With `mt-6`, a `<ul>` of three items as a list of rows from the layout notes. Each row is an `<li>` holding an `<article>`, a grid (`md:grid-cols-12`):

- Columns 1–3: the kind, a `<p>` label in `text-muted-foreground`: `Mode`, `Feature`, `Feature`.
- Columns 4–12, with `mt-2 md:mt-0`: the name as an `<h3>` in `text-h2`, then with `mt-3` two sentences within `max-w-xl`.

The three: "Duel Pits", a 2v2 mode on a small map, best of five rounds, unranked, in rotation until Tuesday 1 December; "Replay viewer", the last ten matches can be watched again from the profile, at any speed, from any player's view; "Ping wheel", hold a key to mark an enemy, an item or a place for the team, with a spoken line in every language the game has.

### 4. Balance changes

The third `<section>`, with `mt-20` and the `id` "balance". An `<h2>` "Balance changes" in `text-h2 md:text-h1 uppercase`, then with `mt-3` one sentence: figures are per hit or per use unless the change says otherwise.

With `mt-6`, a button group with the `aria-label` "Show changes for": All, Bulwark, Cinderblade, Flarecaster, Mender. "All" is chosen at first. Under it, with `mt-3`, a count line, a `<p>` with `aria-live="polite"`: a label in `text-muted-foreground` such as `All classes · 8 changes` or `Mender · 2 changes`.

With `mt-6`, the `Table` from the layout notes with the `label` "Balance changes" and `min-w-2xl`, so it scrolls in its box on a phone. Columns: Class, Ability, Stat, Before, After, Change. Before and After are numbers: right-aligned, with their headers, in `font-mono tabular-nums`, the unit after the figure (`14 s`, `6 m`). Change is the word `Buff` or `Nerf` in `text-foreground`, a label (`font-mono text-label uppercase`), with no color and no arrow: the word says it. The column headers are `<th scope="col">`. The eight rows, in this order:

| Class | Ability | Stat | Before | After | Change |
|---|---|---|---|---|---|
| Bulwark | Slag Wall | Wall health | 1,200 | 1,050 | Nerf |
| Bulwark | Anchor Step | Cooldown | 14 s | 12 s | Buff |
| Cinderblade | Coal Rush | Damage | 65 | 60 | Nerf |
| Cinderblade | Backdraft | Duration | 1.5 s | 1.2 s | Nerf |
| Flarecaster | Flare Bolt | Damage | 42 | 45 | Buff |
| Flarecaster | Heat Haze | Radius | 6 m | 5 m | Nerf |
| Mender | Mending Smoke | Healing a second | 30 | 34 | Buff |
| Mender | Ash Veil | Cooldown | 20 s | 24 s | Nerf |

Under the table, with `mt-3`, a `<p>` in `text-body text-muted-foreground`: "A shorter cooldown is a buff; a longer one is a nerf."

### 5. Fixes

The fourth `<section>`, with `mt-20` and the `id` "fixes". An `<h2>` "Fixes" in `text-h2 md:text-h1 uppercase`. Under it, three groups in a grid `grid grid-cols-1 gap-6 md:grid-cols-3`, with `mt-6`, each a `<div>`: an `<h3>` in `text-h2` (Gameplay, Interface, Audio), then with `mt-3` a `<ul>` with `list-disc pl-6` in `text-body`, with `mt-2` on every item but the first. Each item is one sentence that says what was wrong and that it is fixed. Gameplay has four (among them: Anchor Step could carry a Bulwark through the wall at the Glasswater Yard pump house), Interface three, Audio three: ten in all.

### 6. Known issues

The fifth `<section>`, with `mt-20` and the `id` "known". An `<h2>` "Known issues" in `text-h2 md:text-h1 uppercase`, then with `mt-3` one sentence: the team is working on these and will fix them in patch 4.2.1.

With `mt-6`, in columns 1–8 of a grid (`md:grid-cols-12`), a card from the layout notes holding a `<ul>` of three issues with no markers and no padding. Each `<li>` after the first has `border-t border-border pt-3 mt-3`. Each holds a row `flex items-start gap-2`: the `TriangleAlert` icon (`shrink-0`, `mt-1`), and a `<div>` with the issue as one sentence in `text-body`, then with `mt-2` a label in `text-muted-foreground` that starts with `Workaround ·` and gives it in a few words, or `No workaround yet`.

### 7. Earlier patches

The sixth `<section>`, with `mt-20`. An `<h2>` "Earlier patches" in `text-h2 md:text-h1 uppercase`. With `mt-6`, a `<ul>` of two rows as a list of rows from the layout notes, with `py-3` in place of `py-6`. Each row is `flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2`: a text link in `text-body` ("Patch 4.1", "Patch 4.0", to `#`), and a label in `text-muted-foreground` holding a `<time>`: `Tue 20 Oct 2026`, `Tue 6 Oct 2026`.

### 8. Footer

The footer from the layout notes.

### Behavior

- Keep the eight balance changes as an array of rows. The chosen class is component state; the table rows and the count line read from it. With All chosen, all eight show.
- Changing the class does not move focus and does not scroll the page. The count line announces the change; one change reads `1 change`.
- The links of "On this page" jump to their sections by their `id`. No other link needs behavior.
- The page has no red action: there is nothing to buy or start here.
