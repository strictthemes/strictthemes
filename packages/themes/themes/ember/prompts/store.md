---
page: item shop
title: Store
description: the item shop of a team arena game, with the viewer's balance in the game's currency, this week's featured bundle, and a grid of items with drawn pictures and prices that can be bought until the balance runs out.
order: 4
checks:
  - "Every price and the balance are `font-mono tabular-nums` with the word Flint beside them, and the balance goes down by the price of what is bought."
  - "Buy bundle is the page's only default (red) button, and the page has one badge, New, on Static Hood."
  - "An item that is owned, or that costs more than the balance, has a disabled button that keeps keyboard focus, and the reason is written under its price or on its button."
  - "After a purchase, a `role=status` element that was on the page from the start says what was bought and the new balance, and focus stays on the button that was pressed."
  - "The drawn pictures hold no text and no image file, and no tile holds a box with a border on all four sides."
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-12"
    result: >-
      A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,864 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: **Ashfall**, an invented free-to-play team arena game for PC by an invented studio, **Lowlight Games**. Its currency is **Flint**. Items change only how a player looks, never how they play. The shop turns over every Thursday; this week's runs from today, Thursday 12 November 2026, to Thursday 19 November. The viewer, **Juno Vane**, has **2,350 Flint** and already owns Lantern Coat. The featured bundle is the **Dry lightning bundle**, 1,800 Flint, which holds Stormglass Armour (skin for Bulwark, 1,400 Flint on its own), Forked Blade (weapon finish for Cinderblade, 900) and Thunderhead (banner, 300): 2,600 Flint bought one by one. The eight items of the week, with their kind, price and the heat color of their picture:

| Item | Kind | Price | Picture |
|---|---|---|---|
| Static Hood | Skin · Flarecaster | 1,400 | `bg-heat-high` |
| Saltpan Wraps | Skin · Bulwark | 1,200 | `bg-heat-mid` |
| Lantern Coat | Skin · Mender | 1,000 | `bg-heat-mid` |
| Glasswork Edge | Weapon finish · Cinderblade | 800 | `bg-heat-high` |
| Heatline Finish | Weapon finish · Flarecaster | 700 | `bg-heat-mid` |
| Dust Devil | Emote | 500 | `bg-heat-mid` |
| Slow Clap | Emote | 400 | `bg-heat-high` |
| Ash Banner | Banner | 300 | `bg-heat-high` |

Static Hood is new this week.

Build these parts in order.

### 1. Header

The header from the layout notes. "Store" is the current page.

### 2. Page head

The first `<section>`, a grid (`md:grid-cols-12`):

- Columns 1–7: a label in `text-muted-foreground`, `Item shop · Until Thu 19 Nov`, the date a `<time dateTime="2026-11-19">`; with `mt-2`, the `<h1>` "Item shop" in `text-h1 md:text-display uppercase`; with `mt-6`, one paragraph within `max-w-xl`: what the shop sells, that items change looks and never stats, and that it turns over every Thursday. With `mt-3`, a `<p>` in `text-body text-muted-foreground`: "This is a demo shop: nothing is charged, and the Flint is not real."
- Columns 8–12, with `mt-12 md:mt-0`: a card from the layout notes, `md:self-start`, the balance. A label `Your balance` in `text-muted-foreground` with an `id`; with `mt-2`, a `<p>` holding the big figure `2,350` (`font-mono text-h1 tabular-nums`) and after it a `<span>` label in `text-muted-foreground` with `ml-2`, `Flint`. With `mt-3`, the status element: a `<p>` with `role="status"` in `text-body`, empty at the start, on the page from the start and never hidden. With `mt-6`, an outline-variant link "Get Flint" (to `#`).

### 3. Featured bundle

The second `<section>`, with `mt-20`, a grid (`md:grid-cols-12`):

- Columns 1–7: the bundle's picture, a picture that stands on the page (`relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted`), with `flex items-end justify-center gap-6 pb-12` and the `aria-label` "The three pieces of the Dry lightning bundle: a suit of armour, a blade and a banner". Its three shapes, each a `<div>` with square corners: the armour, `h-1/2 w-1/6 bg-heat-mid`; the blade, `h-2/3 w-3 bg-heat-high`; the banner, `h-1/3 w-1/6 bg-heat-high`.
- Columns 8–12, with `mt-6 md:mt-0`: a label in `text-muted-foreground`, `Featured bundle · 3 items`; with `mt-2`, an `<h2>` "Dry lightning bundle" in `text-h2 md:text-h1 uppercase`; with `mt-3`, one sentence on the look (storm glass, forked light, a banner that crackles at the round's start). With `mt-6`, a `<ul>` of the three items as a list of rows from the layout notes, with `py-3` in place of `py-6`: each row `flex items-baseline justify-between gap-3`, the name and its kind in `text-body` (`Stormglass Armour · Bulwark skin`), and the price apart as a label in `text-muted-foreground` with `tabular-nums` (`1,400 Flint`). With `mt-6`, the price: a `<p>` with the big figure `1,800` and a `<span>` label in `text-muted-foreground` with `ml-2`, `Flint`; with `mt-2`, a label in `text-muted-foreground`: `Worth 2,600 Flint · Save 800`. With `mt-6`, the default `Button` "Buy bundle", the page's one red action.

On a phone the picture comes first.

### 4. This week's items

The third `<section>`, with `mt-20`. An `<h2>` "This week" in `text-h2 md:text-h1 uppercase`, then with `mt-3` one sentence: eight items until Thursday 19 November, most expensive first.

With `mt-6`, a `<ul>` with `grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4`, one `<li>` per item, in the order of the sample. Each `<li>` is a tile: `flex flex-col overflow-hidden rounded-xl border border-border bg-card`, holding an `<article>` with `flex flex-1 flex-col`:

- At the top, the picture at the top of a tile, `aspect-square border-b border-border bg-muted flex items-center justify-center`, with `aria-hidden="true"`: the item's name follows it in the text. Inside it, one shape with square corners in the item's heat color, by kind: a skin `h-1/2 w-1/3`, a weapon finish `h-2/3 w-1/12`, a banner `h-2/3 w-1/4`, an emote `aspect-square w-1/3`.
- Under it, the text part, `flex flex-1 flex-col p-3 md:p-6` (12px on a phone, where two tiles share the row; the card's 24px from `md` up). On Static Hood only, first the page's one badge, "New", as a block on its own line (add `flex` to its classes; it keeps the stock `w-fit`), and the label after it gets `mt-2`. Then a label in `text-muted-foreground`, the kind (`Skin · Flarecaster`); it may wrap on a phone. With `mt-2`, the name as an `<h3>` in `text-body font-bold`. With `mt-3`, the price: a `<p>` with the figure in `font-mono text-h2 tabular-nums` and a `<span>` label in `text-muted-foreground` with `ml-2`, `Flint`; the `<span>` may wrap under the figure on a phone. Where the item costs more than the balance and is not owned, with `mt-2`, a `<p>` in `text-body text-muted-foreground` with an `id`: "350 more Flint needed." (the figure is the price less the balance).
- Last, in a `<div>` with `mt-auto pt-3`, the item's button, `variant="secondary"`, full width, with `w-full whitespace-normal text-center`: "Buy", or "Owned" once the item is owned. Its accessible name says what it is for: give it `aria-label` "Buy Static Hood" (or "Static Hood, owned"), and where the "more Flint needed" line is shown, `aria-describedby` with that line's `id`.

From `md` up the tiles in a row are one height and their buttons line up at the bottom.

### 5. Footer

The footer from the layout notes.

### Behavior

- The balance, the items owned and the bundle's state are component state. Every figure, line and button reads from it.
- "Buy" on an item, or "Buy bundle", takes its price from the balance and marks it owned. Its button then reads "Owned" and is disabled, and focus stays on it: every button on this page that can be disabled gets `focusableWhenDisabled`, and `components/ui/button.tsx` gets `data-disabled:pointer-events-none data-disabled:opacity-50` beside the stock `disabled:` classes, as these pages need. The bundle's button reads "Owned" too.
- Any item or the bundle that is not owned and costs more than the new balance gets a disabled "Buy" button and its "more Flint needed" line. Buying the bundle leaves 550 Flint, so only Dust Devil, Slow Clap and Ash Banner can still be bought.
- After each purchase the status element says, in one sentence: "Bought Static Hood for 1,400 Flint. Your balance is 950 Flint." (for the bundle, "Bought the Dry lightning bundle for 1,800 Flint. Your balance is 550 Flint."). Each purchase replaces the sentence.
- Lantern Coat is owned from the start: its button reads "Owned" and is disabled from the first render.
- Nothing is sent anywhere and nothing is charged: the balance resets when the page reloads. There is no dialog and no confirmation step.
