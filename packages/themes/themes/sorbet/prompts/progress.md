---
page: progress screen
title: Progress
description: the progress screen of a habit-tracking app, with a week and month switch, the streak as a key figure, a chart of completed habits with a text alternative and each habit's completion in words and numbers.
order: 3
checks:
  - The week and month switch is a button group with `aria-pressed`, not tabs, and it changes the key figures, the chart, its text alternative and the habit list.
  - The chart is drawn from plain elements with `aria-hidden="true"`, and a visually hidden table gives every day's number.
  - Every habit's completion is given in words and numbers ("6 of 7 days", "86%"), and its meter is not the only way to read it.
  - Butter yellow appears only on the good-news badge, never as text, a bar or a border.
  - At 375px the month chart fits its card without sideways scroll.
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Second run of this page. The first run showed that the sample counts could not all be true at once and that the bars need a plot of fixed height; both are fixed in the brief. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,329 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems the earlier test builds reported. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,353 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,352 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 2 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: "Mossy", a habit tracker for small, daily steps. The person is Ines Okafor, with five habits: Drink 8 glasses of water, Read 10 pages, Walk after lunch, Stretch for 5 minutes, No phone after 22:00. Today is Wednesday, 11 November 2026. Her streak is 12 days; her best was 19, in September. The daily counts, out of 5: 13 to 29 October are 2, 3, 5, 4, 5, 5, 5, 2, 4, 4, 5, 3, 4, 5, 3, 5, 3; the 12 days from 30 October to 10 November are all at 5 (that is the streak); today is at 2 so far. So the last 7 days come to 32 of 35 and the last 30 to 129 of 150. Invent which days each habit was done so that the totals agree: over the week, Drink 8 glasses of water and Walk after lunch (the two done today) are at 7 of 7 and the other three at 6 of 7; over the month, Drink 8 glasses of water 29, Walk after lunch 28, Read 10 pages 25, Stretch for 5 minutes 24, No phone after 22:00 23, of 30, so no habit is at 100% in the month.

The `<main>` uses `gap-10` between groups.

Build these parts in order.

### 1. Header

The header from the layout notes, with Progress as the current page.

### 2. Page header

The page header from the layout notes: the small figure `Your last 7 days` (or `Your last 30 days`, following the switch; both periods end with and include today, the fixed sample date, so the week is 5 to 11 November and the month 13 October to 11 November; the range itself is not written on the page), then the `<h1>` "How it is going". Under the `<h1>`, in the page header's `gap-2`, the switch: a button group from the layout notes with the `aria-label` "Period" and two buttons, "Week" and "Month", with Week chosen.

### 3. Key figures

A section with an `aria-label` "Key figures" and no visible heading, holding only a row of three cards: a grid from the layout notes with `gap-6`, each card `md:col-span-4`. Each card, in its `gap-4`:

- A `flex flex-col gap-2` holding a label in `text-muted-foreground`, as an `<h2>` with `font-mono text-label`, and under it the key figure with its unit beside it.
- Where the card has one, the badge.
- One sentence in `text-body`.

The three cards:

1. "Current streak": `12` with `days`, and a good-news badge (add it with `npx shadcn@latest add badge`) "Your longest since September" with the `Flame` icon. Sentence: "Finish today's habits and it becomes 13." The streak does not change with the switch.
2. "Habits done": `32` with `of 35` (week) or `129` with `of 150` (month). Sentence: "That is 91% of everything you planned." (week) or "That is 86% …" (month).
3. "Best day": `Tuesday` (week) or `Monday` (month) in `font-heading text-h1` (a word, so the smaller key figure), with no unit. Sentence: "You finish the most on Tuesdays." or "… on Mondays." The best day is the weekday with the highest total in the period; where weekdays tie, the most recent wins. In the week the six days before today all tie at 5, so Tuesday; in the month Monday leads with 20.

### 4. Chart

A card, full width, that is a section. It opens with a `flex flex-col gap-2` holding the `<h2>` "Habits done each day" and a small figure under it, `Out of 5 habits`; the chart follows in the card's `gap-4`.

The chart is a `flex gap-3`: the scale, `relative h-48 w-6`, and the plot, `relative flex-1 h-48`, a fixed height for the bars' percentages. The scale has two values: `5` hangs under the top line (`absolute top-0 right-0`) and `0` stands on the bottom line (`absolute bottom-0 right-0`). The plot has two 1px `border-border` grid lines, at the top and the bottom (`absolute inset-x-0`), and the bars over them in a row aligned to the bottom (`flex h-full items-end`): `gap-2` between the 7 bars of a week, `gap-0.5` between the 30 bars of a month. Each bar is `flex-1 bg-secondary` with square corners, its height the day's share of 5 as a percentage in an inline `style`. A day with 0 has no bar, only the gap. All bars are the same color, today's included.

Under the plot, in the card's `gap-4`, the day labels, lined up with the bars: a second `flex gap-3` with an empty `w-6` column first, then a row with the same gap as the bars and one `flex-1 min-w-0` cell per bar (`min-w-0`, or a cell grows to fit its label and stops lining up with its bar). The labels are small figures, centered in their cells and not wrapped (`whitespace-nowrap`; a month's label may run wider than its cell, over the empty cells beside it): for a week, every day (`Thu` to `Tue`, then "Today" in `text-foreground` under the last bar, written through `cn` so that it replaces the small figure's color); for a month, a date every seventh cell counting back from today (`4 Nov`, `28 Oct`, `21 Oct`, `14 Oct`), ending with "Today" under the last bar, and the other cells empty. In the week view at 375px, a centered "Today" (about 40px in a 30px cell) runs into the gaps beside it and stops short of "Tue", which is right. In the month view, "Today" ends at the plot's right edge rather than being centered (`flex justify-end` on its cell), so it does not run past the plot.

The drawing (scale, plot and labels) has `aria-hidden="true"`. The text alternative is a plain `<table>` (not the shadcn `Table`) inside a `<div>` with `sr-only` (the class does not work on a `<table>` itself), with a `<caption>` "Habits done each day, out of 5", and a row for every day in the period: the date as a `<time>`, written `Thursday, 5 November` (`dateTime="2026-11-05"`), and the number.

At 375px the month's 30 bars (about 7px each) fit the card. Nothing in the chart scrolls.

### 5. Each habit

A section with an `<h2>` "By habit". Under it, one card holding a `<ul>` with `flex flex-col gap-4`. Each `<li>` is a `flex flex-col gap-2`, and every `<li>` after the first has `border-t border-border pt-4`:

- A row, `flex flex-wrap items-center justify-between gap-3`: first a `flex flex-wrap items-center gap-2` holding the habit's name in `text-body font-medium` (add `font-sans`) and, for a habit at 100%, a good-news badge "Every day" after it; then, at the right end, the numbers as a small figure: `6 of 7 days · 86%`.
- The meter from the layout notes, its fill the same percentage.

Sort the habits from the highest share to the lowest; habits with the same share keep the sample's order. Percentages are rounded to whole numbers. A habit under 50% gets no warning color: its numbers say it.

### 6. Footer

The footer from the layout notes.

### Behavior

- Keep the period in component state. The small figure in the page header, "Habits done", "Best day", the chart, its text alternative and the habit list all read from it. The streak does not.
- Switching the period moves no focus and scrolls nothing; the pressed button changes with it.
- The nav links go to the addresses in the layout notes and need no other behavior.
