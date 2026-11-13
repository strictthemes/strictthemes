---
page: plans page
title: Plans
description: the plans page of a habit-tracking app, with a monthly and yearly switch, three plan cards with one recommended, what each includes in words and a short FAQ.
order: 4
checks:
  - Switching between monthly and yearly changes both paid plans' prices and billing notes, and the chosen button has `aria-pressed="true"`.
  - Exactly one plan carries the "Recommended" badge, and its button is the only raspberry button among the plans.
  - The plans' buttons sit on one line from `md` up, whatever the length of each plan's list.
  - Every feature in a plan is written in words, and the free plan's limits are stated, not shown by a missing check.
  - Each FAQ item opens and closes with the keyboard, and its trigger is at least 44px tall.
---

Sample content, if the user gave none: "Mossy", a habit tracker for small, daily steps. The person, Ines Okafor, is on the free plan. Three plans: Free ($0, up to 5 habits, reminders, your streak with the week and month views, 30 days of history); Plus ($4 a month, or $36 a year, which is $3 a month; unlimited habits, all your history, the year view, a note on each day, and everything in Free); Together ($8 a month, or $72 a year, which is $6 a month; Plus for up to 4 people, shared habits you can tick off together, and everything in Plus). Plus is recommended. Prices are in US dollars, taxes included.

The `<main>` uses `gap-16` between sections.

Build these parts in order.

### 1. Header

The header from the layout notes, with Plans as the current page.

### 2. Opening

A `flex flex-col gap-4` holding the page header from the layout notes, with the small figure `You are on Free` above the `<h1>` "Pick what fits you", in `text-h1 md:text-display`; then, `gap-4` under it as a heading's paragraph, one paragraph in `text-body`: "Free covers most people. Plus is for when five habits are not enough."

### 3. Plans

A section with a visually hidden `<h2>` "Plans" (`sr-only`), then its content in the section's `gap-6`:

**The switch.** A row, `flex flex-wrap items-center gap-3`: a button group from the layout notes with the `aria-label` "Billing" and two buttons, "Monthly" and "Yearly", with Monthly chosen; then a `<div>` with `flex h-11 items-center` holding a small figure, `Yearly saves 3 months`. When Yearly is chosen the small figure is replaced, inside the same `<div>`, by a good-news badge with the same words, since it is now true for the prices on screen. The `<div>` is 44px tall either way, so nothing below moves when the switch is used, also at 375px, where it wraps under the buttons.

**The cards.** A row of three cards: a grid from the layout notes with `gap-6`, each card `md:col-span-4`, in the order Free, Plus, Together, stacked below `md` in the same order. Each card, in its `gap-4`, top to bottom:

1. A row, `flex flex-wrap items-center gap-3`: the plan's name as an `<h3>` in `text-h2`, and beside it a badge where the plan has one (add it with `npx shadcn@latest add badge`). Only Plus has one: a `secondary` badge "Recommended". Free has none; its last line says it is your plan.
2. One `flex flex-col gap-2`, a figure and the line about it, holding the price as a key figure, `$4` with `a month` beside it (Free shows `$0` with `a month`), and under it a small figure, the billing note: `Billed monthly`, or `Billed $36 once a year` on yearly. Free's note is `Free for as long as you like`, and Free's figure and note stay the same on both periods.
3. One sentence in `text-body` saying who the plan is for: "For getting started with a few habits." / "For when five habits are not enough, or you want all your history." / "For a household that keeps habits together."
4. The features: a `<ul>` with `flex flex-col gap-2` and `border-t border-border pt-4`. Each item is a `flex items-start gap-2` in `text-body`: the `Check` icon (`mt-1 shrink-0`, `aria-hidden="true"`, `text-foreground`; `mt-1` sets it on the first line) and the feature in words. The items, exactly: Free: "Daily reminders", "Your streak, by week and month", then its limits with the `Minus` icon in place of the check: "Up to 5 habits", "30 days of history". Plus: "Unlimited habits", "All your history", "The year view", "A note on each day", "Everything in Free". Together: "Plus for up to 4 people", "Shared habits you tick off together", "Everything in Plus".
5. The call to action, last, with `mt-auto` so the three sit on one line from `md` up, full width (`w-full`):
   - Plus: an `<a href="#">` styled as a default button, "Try Plus free".
   - Together: an `<a href="#">` styled as a `secondary` button, "Choose Together".
   - Free: no button. In its place, a `<p>` `mt-auto flex h-11 items-center gap-2 font-mono text-label text-muted-foreground` (the `mt-auto` as on the buttons, no `w-full`), with the `CircleCheck` icon and "You are on this plan", so the three still line up.

Plus is marked only by its badge and its raspberry button. Do not enlarge it, lift it, give it a colored border or tint its fill.

### 4. Questions

A section with an `<h2>` "Questions people ask", `md:max-w-3xl`. Under the heading, an `Accordion` (add it with `npx shadcn@latest add accordion`) with five items and short, direct answers, each a `<p>` with `max-w-lg`, the notes' measure: Can I try Plus before paying? (14 days, no card), What happens to my habits if I go back to Free? (all kept; you choose which five stay active), Can I pay once a year? (yes, $36), How does Together work? (one person pays, up to 4 people join with a link), Can I cancel any time? (yes, in Profile, and you keep Plus to the end of the period).

The stock `Accordion` is off the type scale and its trigger is under 44px. In `components/ui/accordion.tsx`: on the trigger, replace `items-start` with `items-center`, its stock vertical padding with `py-3` and its small text size with `font-sans text-body`, and add `min-h-11 gap-4` (its `font-medium` stays); on the content, replace the small text size with `text-body`, and on its inner element the stock bottom padding with `pb-4` (`pt-0` stays). Every item has its 1px line under it, the last one too: on the item, replace the stock `not-last:border-b` with `border-b border-border`. Both chevron icons get `strokeWidth={1.5}`. The trigger keeps its stock `rounded-lg` corner, which only shows in its focus outline.

### 5. A last word

A card that is a section, `md:max-w-lg`: an `<h2>` "Not sure yet?" and one sentence: "Stay on Free. Nothing you add there is lost if you move to Plus later." No button: the plan row may still be on screen.

### 6. Footer

The footer from the layout notes.

### Behavior

- Keep the billing period in component state. The prices, the billing notes and the small figure or badge beside the switch all read from it. On yearly, Plus shows `$3` and Together `$6`, each with `a month`, and the note says what is billed once a year.
- The switch moves no focus; the pressed button changes with it.
- The plan links point to `#`; the nav links go to the addresses in the layout notes. Neither needs other behavior.
