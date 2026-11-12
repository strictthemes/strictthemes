---
page: progress page
title: Progress
description: a learner's progress at an online school, with a row of figures, a bar chart of minutes per day that switches between this week and last week, a chart of time by topic with a legend, progress bars for three courses and a list of recent activity.
order: 4
checks:
  - "The row of figures gives 19 of 30 lessons, 10 hours and 9 days in a row, each number with its unit in words."
  - "The bar chart is drawn from plain elements with `aria-hidden=true`, every bar is azure with its figure written above it, a day with 0 minutes shows the figure 0 and no bar, and a visually hidden table gives every day's minutes."
  - "This week and Last week are a button group with `aria-pressed`, and pressing one changes the bars, their figures, the period line and the hidden table, and nothing else on the page."
  - "The topic chart has four segments in azure, green, sun and berry, in that order, with `bg-sun` and never `bg-secondary` for its yellow, and its legend gives each one's name, time and share in words and figures."
  - "Each of the three courses has a green progress bar on a track of the border color, with its percentage and its count of lessons written beside it."
  - "Continue lesson 4 is the only default button on the page."
---

Sample content, if the user gave none: "Rowlark", an online school for practical data skills. The learner is Tessa Marlow, who has been learning since 15 February 2027. Today is Sunday, 14 March 2027. She has started three courses and done 19 of their 30 lessons:

- "SQL from zero": 3 of 12 lessons, 25%. Her next lesson is lesson 4, "Filtering rows with WHERE".
- "Your first charts": 6 of 8 lessons, 75%. Her next lesson is lesson 7.
- "Spreadsheets from scratch": 10 of 10 lessons, 100%, finished on 9 March 2027.

She has learned for 10 hours in all: 4 h 30 min in spreadsheet lessons (45%), 1 h in SQL lessons (10%), 2 h on practice files, which belong to no one topic (20%), and 2 h 30 min in chart lessons (25%). She has learned 9 days in a row, since 6 March. Minutes per day, Monday to Sunday:

- This week, 8 to 14 March: 25, 40, 15, 35, 20, 50, 30. That is 3 h 35 min in all.
- Last week, 1 to 7 March: 30, 0, 45, 20, 0, 35, 25. That is 2 h 35 min in all.

The container inside `<main>` uses `gap-8` between groups. This page uses the stock `button` and `badge`; add any the project lacks with `npx shadcn@latest add button badge`. It has a button group, so make both changes to `components/ui/button.tsx` that the Buttons note gives.

Build these parts in order.

### 1. Header

The header from the layout notes, with My progress as the current page.

### 2. Page header

A row, `flex flex-wrap items-end justify-between gap-5`, not a section. On the left a `flex items-center gap-3`: the larger avatar of the layout notes with the initials `TM`, then a `flex flex-col gap-2` with a small figure, `Tessa Marlow · Learning since 15 February 2027` (plain text, no `<time>`), and the `<h1>` in `text-h1`, "Your progress". On the right the page's one main action: an `<a href="/lesson">` styled as a default button, "Continue lesson 4", with the `ArrowRight` icon after its text.

### 3. Figures

A section with the `aria-label` "Figures" and no visible heading, holding only a row of three cards: `grid grid-cols-1 gap-5 md:grid-cols-3`. Each card, in its `gap-5`:

- A `flex flex-col gap-2`: the card's name as an `<h2>` that is a label in `text-muted-foreground` (`font-mono text-label`, which replaces the heading font and size), and under it the key figure with its unit beside it, as the Key figures note sets them.
- One sentence in `text-body`.

The three cards:

1. "Lessons done": `19` with `of 30`. "Across the three courses you have started."
2. "Time learning": `10` with `hours`. "Since 15 February, in lessons and practice."
3. "Days in a row": `9` with `days`. "Since 6 March. Learn tomorrow and it becomes 10." This card has a badge, "Longest so far", in a row with the `<h2>`: the `<h2>` and the badge sit in a `flex flex-wrap items-center justify-between gap-2`, and that row takes the `<h2>`'s place in the stack.

### 4. Charts

A grid from the layout notes, with two cards that are sections.

**Minutes a day.** `lg:col-span-7`. The card opens with a heading row from the layout notes: on the left a `flex flex-col gap-2` with the `<h2>` "Minutes a day" and, under it, the period line, a `<p>` with `role="status"` that is a small figure: `8 to 14 March · 3 h 35 min in all`; on the right a button group from the layout notes with the `aria-label` "Week" and two buttons, "This week", chosen at the start, and "Last week".

The chart follows in the card's `gap-5`, as a `flex flex-col gap-2` of the drawing and its day labels, both with `aria-hidden="true"`:

- The drawing is a `flex gap-3`: the scale, then the plot. The scale is `relative h-48 w-6 shrink-0` and holds three small figures: `60` hangs under the top line (`absolute right-0 top-0`), `30` sits on the middle line (`absolute right-0 top-1/2 -translate-y-1/2`) and `0` stands on the bottom line (`absolute bottom-0 right-0`). The plot is `relative h-48 min-w-0 flex-1`. It has three 1px grid lines, each `absolute inset-x-0 border-t border-border`, at `top-0`, `top-1/2` and `bottom-0`, and over them the row of days, `absolute inset-0 flex items-end gap-2`.
- Each day is a column, `flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1`: the day's minutes as a chart figure (`25`), then the bar, `w-full max-w-12 shrink-0 bg-azure`, whose height is the minutes out of 60 as a percentage in an inline `style` (25 minutes is `41.67%`). A day with 0 minutes has the figure `0` and no bar. All seven bars are azure, today's included. The scale ends at 60 and no day in the sample is over 50, so the figure above the tallest bar stays inside the plot.
- The day labels are a second `flex gap-3`: an empty `w-6 shrink-0` column, then a row `flex min-w-0 flex-1 gap-2` with one `min-w-0 flex-1 text-center` cell per day, each a small figure: `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, `Sun`.

The text alternative is a plain `<table>` (not the shadcn `Table`) inside a `<div>` with `sr-only` (the class does not work on a `<table>` itself), after the chart inside the same `flex flex-col gap-2`, where it takes no space. Its `<caption>` is "Minutes learned each day, 8 to 14 March 2027", and it has a row for each day: the day and date, `Monday 8 March`, and the minutes, `25 min`.

At 375px the seven bars, about 30px each, fit the card. Nothing in the chart scrolls.

**Time by topic.** `lg:col-span-5`. The card opens with a `flex flex-col gap-2`: the `<h2>` "Time by topic" and a small figure, `10 h in all, since 15 February`. Then:

- The bar: a `<div>` with `flex h-5 w-full overflow-hidden rounded-sm` and `aria-hidden="true"`, holding four segments side by side with no gap, each `h-full` with its fill and its share as a percentage width in an inline `style`: Spreadsheets `bg-azure` at 45%, SQL `bg-tertiary` at 10%, Practice `bg-sun` at 20%, Charts `bg-berry` at 25%. The shares are worked out in code from the minutes: 270, 60, 120 and 150 of 600.
- The legend, which is also the chart's text alternative: a `<ul>` set as the Rows with rules note says. Each `<li>` is also `flex items-center justify-between gap-3`: the topic mark from the layout notes, with the name in `text-body text-foreground` (in place of the label style), then the time and share as a chart figure. The four rows: `Spreadsheets` with `4 h 30 min · 45%`; `SQL` with `1 h · 10%`; `Practice` with `2 h · 20%`, its dot `bg-sun`; `Charts` with `2 h 30 min · 25%`.

The four keep the order of the Chart colors note in the bar and in the legend, whatever their size, so Practice stands third, between SQL and Charts. Sun is pale on the white card: the segment is told from the green and the berry on either side of it, and its row in the legend gives its name and figure in ink.

### 5. Courses and activity

A grid from the layout notes, with two cards that are sections.

**Your courses.** `lg:col-span-7`. The `<h2>` "Your courses", then a `<ul>` set as the Rows with rules note says, in this order: "SQL from zero", "Your first charts", "Spreadsheets from scratch". Each `<li>` is also `flex flex-col gap-2`:

1. A row, `flex flex-wrap items-center justify-between gap-x-3 gap-y-1`: on the left a `flex flex-wrap items-center gap-2` with the course's title as an `<h3>` in the small heading of the Headings note (`font-sans text-body font-semibold`) and, for a course at 100%, the badge "Completed"; on the right a small figure in `text-foreground`: `3 of 12 lessons` (`6 of 8 lessons`, `10 of 10 lessons`).
2. The progress bar from the layout notes, at the course's percentage, with `25%` (`75%`, `100%`) beside it.
3. One last line with `self-start`: for "SQL from zero" a text link, "Continue with lesson 4: Filtering rows with WHERE", to `/lesson`; for "Your first charts" a text link, "Continue with lesson 7", to `#`; for "Spreadsheets from scratch" a small figure, `Finished on 9 March 2027`, with the date in a `<time dateTime="2027-03-09">`.

**Recent activity.** `lg:col-span-5`. The `<h2>` "Recent activity", then an `<ol>`, newest first, set as the Rows with rules note says. Each `<li>` is also `flex items-start gap-3`: an icon with `mt-0.5 size-5 shrink-0` in `text-foreground` and `aria-hidden="true"`, then a `flex min-w-0 flex-col gap-1` with one line in `text-body` and a small figure with the course and the date, the date in a `<time>`. The five rows:

1. `CircleCheck`, "Finished lesson 3, Choosing columns", then `SQL from zero · 14 March`
2. `CircleCheck`, "Finished lesson 2, Your first SELECT", then `SQL from zero · 13 March`
3. `CircleCheck`, "Finished lesson 6, Two lines on one chart", then `Your first charts · 13 March`
4. `CircleCheck`, "Finished lesson 1, What a database is", then `SQL from zero · 12 March`
5. `Award`, "Finished the course, all 10 lessons", then `Spreadsheets from scratch · 9 March`

### 6. Footer

The footer from the layout notes.

### Behavior

- Keep the week in component state. The seven bars, their figures, the period line and the hidden table (its caption and its rows) read from it. With "Last week" the period line reads `1 to 7 March · 2 h 35 min in all`, the caption "Minutes learned each day, 1 to 7 March 2027", and the bars follow last week's minutes: Tuesday and Friday show `0` and no bar.
- The period line's total is worked out in code from the seven figures, and so is each bar's height.
- Pressing a week moves no focus and scrolls nothing; the pressed button changes with it. The three figures, the topic chart, the courses and the activity do not change with the week.
- Each progress bar's width and percentage come from the lessons done and the lessons in the course, in code.
- "Continue lesson 4" and the other links need no behavior beyond their `href`.
