---
page: surf forecast page
title: Forecast
description: the surf forecast of a surf school, with a control to choose one of five days, that day's conditions as large figures on a block of color, its tide table, and a five-day table of swell, wind and a rating in words.
order: 3
checks:
  - "The day control is a button group named by its visible label, with five buttons that each have aria-pressed, exactly one of them true, and Today is chosen when the page opens."
  - "Choosing a day changes the date, the heading, the four figures and the sentence on the lagoon block, the rows of the tide table and the marked row of the five-day table, and a status line that was on the page from the start names the day."
  - "The conditions are a description list of four facts on the lagoon block, each a label over a large figure in the heading font with its unit, and the block holds no link, button, badge or icon."
  - "Both tables have header cells with scope col and sit in boxes that can be reached with the keyboard, have an aria-label and scroll sideways where they do not fit, so at 375px the page itself does not."
  - "Best day is the only badge on the page, in Friday's row, and Book a lesson is the only default button, standing on the sand."
  - "Every time is on the 24-hour clock in a time element, and the days, tides and figures are the fixed sample, not read from the visitor's clock."
  - "The opening block element carries bg-coral text-coral-foreground and the conditions block element bg-lagoon text-lagoon-foreground, so their text stays deep-sea ink in dark mode."
---

Sample content, if the user gave none: the forecast of "Sandhopper Surf School" for Pentarrow Sands, a west-facing beach, updated on Thursday 17 June 2027 at 06:40. It covers five days, Thursday 17 to Monday 21 June 2027. All of it is fixed sample data. Keep it in one array of five days and render every part of the page from it:

1. **Thursday 17 June 2027** (`2027-06-17`), button "Today", short date `Thu 17 Jun`. Rating `Good`; heading "Good: clean and waist high". Tide `13:34` `low`, note `1.5 m · High at 19:41`. Swell `3` `ft`, note `9 s · From the west`. Wind `8` `mph`, note `East · Offshore`; in the table `East, offshore`. Water `15` `°C`, note `Summer wetsuit`. Sentence: "A light offshore wind holds the waves up all morning. Best for beginners in the two hours either side of low water." Tides: Low 01:12, 1.4 m; High 07:20, 4.6 m; Low 13:34, 1.5 m; High 19:41, 4.8 m.
2. **Friday 18 June 2027** (`2027-06-18`), button "Fri 18 Jun", short date `Fri 18 Jun`. Rating `Very good`; heading "Very good: clean and chest high". Tide `14:22` `low`, note `1.3 m · High at 20:28`. Swell `4` `ft`, note `11 s · From the west`. Wind `6` `mph`, note `South-east · Offshore`; in the table `South-east, offshore`. Water `15` `°C`, note `Summer wetsuit`. Sentence: "The best day of the five. A longer swell arrives overnight, and the wind stays light and offshore until the middle of the afternoon." Tides: Low 02:01, 1.2 m; High 08:08, 4.8 m; Low 14:22, 1.3 m; High 20:28, 5.0 m.
3. **Saturday 19 June 2027** (`2027-06-19`), button "Sat 19 Jun", short date `Sat 19 Jun`. Rating `Fair`; heading "Fair: bigger, and bumpy by noon". Tide `15:09` `low`, note `1.1 m · High at 21:14`. Swell `5` `ft`, note `12 s · From the west`. Wind `14` `mph`, note `West · Onshore`; in the table `West, onshore`. Water `15` `°C`, note `Summer wetsuit`. Sentence: "The biggest waves of the five days, but the wind turns onshore by noon. Improvers should go early; beginners stay in the white water." Tides: Low 02:49, 1.0 m; High 08:55, 5.0 m; Low 15:09, 1.1 m; High 21:14, 5.2 m.
4. **Sunday 20 June 2027** (`2027-06-20`), button "Sun 20 Jun", short date `Sun 20 Jun`. Rating `Fair`; heading "Fair: small and tidy". Tide `15:56` `low`, note `0.9 m · High at 22:01`. Swell `2` `ft`, note `8 s · From the north-west`. Wind `10` `mph`, note `North · Cross-shore`; in the table `North, cross-shore`. Water `16` `°C`, note `Summer wetsuit`. Sentence: "The swell drops away and the wind swings to the north. Small, tidy waves that suit a first lesson." Tides: Low 03:36, 0.8 m; High 09:42, 5.2 m; Low 15:56, 0.9 m; High 22:01, 5.4 m.
5. **Monday 21 June 2027** (`2027-06-21`), button "Mon 21 Jun", short date `Mon 21 Jun`. Rating `Poor`; heading "Poor: nearly flat, and windy". Tide `16:44` `low`, note `0.8 m · High at 22:49`. Swell `1` `ft`, note `7 s · From the west`. Wind `18` `mph`, note `South-west · Onshore`; in the table `South-west, onshore`. Water `16` `°C`, note `Summer wetsuit`. Sentence: "Hardly a wave, and a stiff onshore wind. A day for a swim, a walk to the north rocks or the café." Tides: Low 04:24, 0.7 m; High 10:30, 5.3 m; Low 16:44, 0.8 m; High 22:49, 5.5 m.

Build these parts in order.

### 1. Header

The header from the layout notes, with "Forecast" as the current page; its link keeps `/forecast`.

### 2. Opening

A full-width section that is a color block in coral, as the layout notes describe it, with its `aria-labelledby` pointing at the `<h1>`. The block element itself carries `bg-coral text-coral-foreground`, the pair from the first layout note, so its text stays ink in dark mode; nothing inside it gets a text color class of its own. It holds one `flex flex-col gap-4`: a heading group, the label `Pentarrow Sands · Updated Thursday 17 June 2027 at 06:40` (the date a `<time dateTime="2027-06-17">`, the time a `<time dateTime="06:40">`) over the `<h1>` "Surf forecast" in `text-h1 md:text-display`, and one paragraph in `text-body` with `max-w-xl`: "Five days of tide, swell and wind for the beach in front of the Boat Shed, checked by our coaches every morning before the first lesson."

### 3. Day by day

A full-width section with its `aria-labelledby` pointing at the `<h2>`. In the section's `gap-6`, three things:

**The heading,** the `<h2>` "Day by day".

**The control,** on the sand, a `flex flex-col gap-2`:

- A label as a `<p>` with an `id`, "Choose a day", in `font-mono text-label uppercase text-foreground` (a `<label>` needs a field to point at; this one names the group).
- A button group from the layout notes, `aria-labelledby` pointing at that `<p>`, with five buttons in the order of the sample: "Today", "Fri 18 Jun", "Sat 19 Jun", "Sun 20 Jun", "Mon 21 Jun". "Today" is chosen when the page opens. This page uses the `outline` variant, so it makes that edit in `button.tsx`, as well as the `secondary` one.
- A `<p>` with `role="status"`, a small figure, that names the day shown: `Showing Thursday 17 June 2027`, the date a `<time>`. Unlike the confirmations in the layout notes, it holds its text from the start: it is a line that changes, not a message that replaces a form.

**The conditions,** a color block in lagoon, a `<div>`, as the layout notes describe it. The block element itself carries `bg-lagoon text-lagoon-foreground`; nothing inside it gets a text color class of its own. In the block's `gap-6`, for the chosen day:

- A heading group: the day's date as a label, `Thursday 17 June 2027`, a `<time dateTime="2027-06-17">`, over an `<h3>` in `text-h2`, the day's heading: "Good: clean and waist high".
- The conditions, as the Conditions note describes them, with the figures in `text-h1 lg:text-display`, larger than anywhere else on these pages. Four facts, `Tide`, `Swell`, `Wind` and `Water`, each with the day's figure, unit and note from the sample. The tide's figure is a `<time dateTime="13:34">`, and the time in its note is a `<time>` too. In every day of the sample the tide figure is the day's third tide and the `High at` in its note the fourth, so both may be read from the day's tides.
- The day's sentence, one paragraph in `text-body` with `max-w-xl`.

At 375px the four facts stand two to a row, and a unit that does not fit beside its figure wraps under it.

### 4. Tide times and how to read it

Here, in place of a section, the `<main>`'s item is a `<div>` with the grid classes of the layout notes' parts side by side, with `lg:` in place of `md:` (`grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-6 lg:items-start`), holding two sections. Up to `lg` the tide times come first, then the reading notes.

**Tide times,** a section with `lg:col-span-5`, `flex flex-col gap-6`, and its `aria-labelledby` pointing at its `<h2>`. It opens with a `flex flex-col gap-2` holding the `<h2>` "Tide times" and, under it, a small figure with the chosen day: `Thursday 17 June 2027 · Pentarrow Sands`, the date a `<time>`. Then the table in its card, as the Tables note describes it (add it with `npx shadcn@latest add table badge` if missing), with `label="Tide times"`. Three columns: Tide, Time, Height. Four rows for the chosen day, in the order of the sample: the tide in words (`Low` or `High`), the time as a `<time>` with `tabular-nums`, the height with `tabular-nums` (`1.4 m`). For today:

| Tide | Time | Height |
|---|---|---|
| Low | 01:12 | 1.4 m |
| High | 07:20 | 4.6 m |
| Low | 13:34 | 1.5 m |
| High | 19:41 | 4.8 m |

**How to read it,** a section with `lg:col-span-6 lg:col-start-7`, `flex flex-col gap-6`, and its `aria-labelledby` pointing at its `<h2>`, "How to read it". Then a `<dl>` with `flex flex-col gap-6`. Each entry is a `<div>` with `flex flex-col gap-2`: the term, a `<dt>` in `text-body font-bold text-foreground`, and the meaning, a `<dd>` in `text-body` with `max-w-xl`. Four entries, word for word:

- "Swell": "The height of the waves out at sea, in feet. On this beach, 2 to 4 ft suits a first lesson."
- "Period": "The seconds between one wave and the next. A longer period means stronger, tidier waves."
- "Offshore wind": "Wind that blows from the land to the sea. It holds the waves up and keeps them clean; an onshore wind flattens them."
- "Low water": "Pentarrow Sands is gentlest for two hours either side of low water, when the waves break over flat sand."

### 5. Five days

A full-width section with its `aria-labelledby` pointing at the `<h2>`. It opens with a `flex flex-col gap-2` holding the `<h2>` "Five days" and, under it, a small figure: `Updated 06:40 · Swell in feet · Wind in miles an hour`, the time a `<time>`. Then, in the section's `gap-6`, the table in its card, as the Tables note describes it, with `label="Five days"`, and after the card the action.

**The table.** Six columns: Day, Swell, Period, Wind, Direction, Rating. One row for each day of the sample, in order:

| Day | Swell | Period | Wind | Direction | Rating |
|---|---|---|---|---|---|
| Thu 17 Jun | 3 ft | 9 s | 8 mph | East, offshore | Good |
| Fri 18 Jun | 4 ft | 11 s | 6 mph | South-east, offshore | Very good, and the badge "Best day" |
| Sat 19 Jun | 5 ft | 12 s | 14 mph | West, onshore | Fair |
| Sun 20 Jun | 2 ft | 8 s | 10 mph | North, cross-shore | Fair |
| Mon 21 Jun | 1 ft | 7 s | 18 mph | South-west, onshore | Poor |

The day is a `<time>` with the day's `dateTime` (`<time dateTime="2027-06-17">Thu 17 Jun</time>`). Swell, period and wind have `tabular-nums`. The rating is a word, never a color or a row of stars. In Friday's rating cell the word and the page's one badge, from the layout notes, sit in a `<span>` with `inline-flex items-center gap-2`: `Very good`, then the badge "Best day".

The chosen day's row is marked, and not by color alone: it has `bg-secondary hover:bg-secondary` in place of `hover:bg-transparent` and `aria-current="true"`, its cells have `text-secondary-foreground` in place of `text-foreground`, and its day cell adds `font-bold`. It is sun yellow with ink (sand with ink in dark mode), like the chosen day's button; the stock `bg-accent` can hardly be seen on a white card. The other rows have none of this.

**The action,** after the card, a row on the sand (`flex flex-wrap items-center gap-4`): the page's one main action, an `<a href="/booking">` styled as a default button, "Book a lesson", full width below `md` (`w-full md:w-auto`); and beside it a `<p>` in `text-body`: "Lessons run every day. We set the start time by the tide."

Below `lg` the table may be wider than its card: it scrolls sideways inside its box, which the edit in `table.tsx` makes reachable with the keyboard, and the page itself does not scroll sideways.

### 6. Footer

The footer from the layout notes.

### Behavior

- Keep the chosen day in component state, as an index into the array of five days; it starts at the first, today.
- Clicking a day's button chooses it: it becomes `aria-pressed="true"` and `variant="secondary"`, the others go back to `aria-pressed="false"` and `variant="outline"`, and focus stays on the button clicked.
- Everything that shows one day follows the choice: on the lagoon block the date, the heading, the four figures with their units and notes, and the sentence; the small figure and the four rows of the tide table; the marked row of the five-day table; and the status line, which then reads `Showing Friday 18 June 2027` and so on. The rest of the five-day table does not change.
- The lagoon block and the tables are not live regions: the status line says what changed.
- The days, the tides and the figures are the fixed sample. Nothing on this page reads the visitor's clock, and nothing refreshes on a timer.
- No button on this page disables itself, so it needs no `focusableWhenDisabled` and no `data-disabled:` edit.
- "Book a lesson" and the links go to their addresses and need no other behavior.
