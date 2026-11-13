---
page: course page
title: Course
description: one course of an online school, with an opening that has the title, the facts and one action to start, a drawn chart, what you will learn, the syllabus as modules that open and close with their lessons inside, the teacher, and a panel with the price and the action.
order: 2
checks:
  - "The opening has one default button, Start the course, and the only other default button is in the price panel, far below it, with the learning list and the syllabus between them."
  - "The syllabus is an accordion of three modules that open and close with the keyboard, the first open at the start, and every lesson in it has its number, its title and its length."
  - "The picture is drawn from plain elements with `role=img` and an `aria-label`, its bars are azure with the figure written above each, and no image file is loaded."
  - "The figures agree: 3, 4 and 3 lessons make 10, and 45, 65 and 50 minutes make 2 h 40 min."
  - "The teacher's avatar is a circle of initials no more than 48px across, and the price panel gives $18 a month and $180 a year in words and figures."
---

Sample content, if the user gave none: "Rowlark", an online school for practical data skills, and its course "Charts that tell the truth": topic Charts, level Intermediate, 10 lessons in 3 modules, 2 h 40 min, taught by Lena Farrow. The first module of every course is free; the rest is in the Plus plan, $18 a month or $180 a year. The modules and lessons, with their lengths:

- Module 1, "Choosing the right chart", 3 lessons, 45 min: 1. "Why some charts mislead", 14 min; 2. "Bar, line or dot: picking a chart", 16 min; 3. "One chart, one message", 15 min.
- Module 2, "Honest axes and scales", 4 lessons, 1 h 5 min: 4. "Where the axis starts", 17 min; 5. "Two scales on one chart", 16 min; 6. "Percentages and what they hide", 18 min; 7. "Showing change over time", 14 min.
- Module 3, "Color, labels and titles", 3 lessons, 50 min: 8. "Color that carries nothing alone", 16 min; 9. "Labels in place of legends", 18 min; 10. "Titles that say the finding", 16 min.

The container inside `<main>` uses `gap-20` between sections. This page uses the stock `button`, `badge` and `accordion`; add any the project lacks with `npx shadcn@latest add button badge accordion`. It has no button group, so `components/ui/button.tsx` needs only the `secondary` change of the Buttons note.

Build these parts in order.

### 1. Header

The header from the layout notes, with Courses marked as the current section (`aria-current="true"`, as the Breadcrumb note says).

### 2. Opening

A grid from the layout notes with `lg:items-center`, not a section.

Its first item, `lg:col-span-7`, is a `flex flex-col gap-5`:

- The breadcrumb: `Courses` (a link to `/catalogue`) and the current step `Charts that tell the truth`.
- A `flex flex-col gap-3`: a row, `flex flex-wrap items-center gap-3`, with the topic mark from the layout notes (the berry dot and `Charts`) and the badge "Intermediate"; then the `<h1>` in `text-h1`, "Charts that tell the truth"; then one paragraph: "Most misleading charts are made by accident. In ten short lessons you learn where charts go wrong, and how to draw the same numbers so that a busy reader gets them right."
- The facts, a `<ul>` with `flex flex-wrap gap-x-5 gap-y-2`, each `<li>` a small figure in `text-foreground` with its icon: `BookOpen` and `10 lessons`; `Layers` and `3 modules`; `Clock` and `2 h 40 min`; `User` and `With Lena Farrow`.
- A row, `flex flex-wrap items-center gap-3`: the page's main action, an `<a href="#">` styled as a default button, "Start the course"; beside it a small figure, `Module 1 is free · No card needed`.

Its second item, `lg:col-span-5`, is the picture of part 3. Below `lg` it sits under the text.

### 3. The picture

A `<figure>` with `flex flex-col gap-2`. Inside it, a card with `role="img"` and the `aria-label` "The same two numbers, 96 on Monday and 98 on Tuesday, drawn twice. With the axis starting at 95 the second bar looks three times as tall as the first. With the axis starting at 0 the two bars look almost the same." Everything inside the card has `aria-hidden="true"`.

The card itself is `grid grid-cols-2 gap-5`, in place of its column stack, and holds two small bar charts of the same data, Monday at 96 and Tuesday at 98. Each chart is a `flex flex-col gap-2`:

1. Its name, a small figure in `text-foreground`: `Axis from 95` for the first chart, `Axis from 0` for the second. Keep the names this short: each stays on one line at 375px, so the two plots stand level.
2. The plot, `flex h-40 items-end justify-center gap-3 border-b border-border`: the bottom border is the axis, the only line. It holds two columns, each `flex h-full w-12 flex-col items-center justify-end gap-1`: the figure above the bar, `96` or `98`, as the Charts note sets a chart's figures; then the bar, `w-full shrink-0 bg-azure`, with its height as a percentage in an inline `style`.
3. The labels under the axis, `flex justify-center gap-3`: two small figures, each `w-12 text-center`: `Mon`, `Tue`.

The heights are worked out in code from the value and the chart's axis, (value − axis start) ÷ (axis end − axis start): the first chart's axis runs from 95 to 100, so its bars are 20% and 60%; the second's runs from 0 to 120, so its bars are 80% and 81.67%. Do not round: the heights are not shown as figures. Both bars of both charts are azure: it is one series. At 375px the two charts still stand side by side.

The `<figcaption>` under the card is a small figure: `From lesson 4: where the axis starts changes what a chart says.`

### 4. What you will learn

A section with the `<h2>` "What you will learn", then a `<ul>` with `grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2`. Each `<li>` is `flex items-start gap-3` in `text-body`: the `Check` icon (`mt-1 shrink-0`, `aria-hidden="true"`) and one line. The six lines:

- "Pick a bar, a line or a dot chart for the question in front of you"
- "Spot the five most common ways a chart misleads"
- "Start an axis where it should start, and say so when it does not"
- "Show change over time without hiding the dull months"
- "Use color so that the chart still reads in grey"
- "Write a title that says what the chart found"

Under the list, in the section's `gap-5`, one paragraph: "You should already be able to make a simple chart in a spreadsheet." followed by a text link, "Your first charts", to `#`, and the words " covers it." after the link.

### 5. Syllabus

A section with a heading row from the layout notes: the `<h2>` "Syllabus" and, on the right, a small figure, `3 modules · 10 lessons · 2 h 40 min`.

Under it, the accordion in its card, as the Accordions note sets it, with three items whose values are `module-1`, `module-2` and `module-3`. Give the `Accordion` the `multiple` prop, so that opening one module does not close another, and `defaultValue={["module-1"]}`, so the first module is open at the start.

- **The trigger** holds one `<span>` with `flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-3`: the module's name, "Module 1: Choosing the right chart", and a small figure, `3 lessons · 45 min` (`4 lessons · 1 h 5 min`, `3 lessons · 50 min`). The stock chevron follows it.
- **The content** holds the module's lessons as an `<ol>`, set as the Rows with rules note says. Each `<li>` is also `flex items-baseline gap-3`: the lesson's number as a small figure with `w-5 shrink-0` (`1`, counted through the whole course, so module 2 starts at `4`); its title in `text-body` with `min-w-0 flex-1`; its length as a small figure, `14 min`. A lesson here is not a link and has no state: the page is for someone who has not started.

### 6. Teacher and price

A grid from the layout notes, with two cards that are sections.

**The teacher.** `lg:col-span-7`. The `<h2>` "Your teacher"; then a row, `flex items-center gap-3`: the larger avatar of the layout notes with the initials `LF`, and a `flex flex-col gap-1` with a name (the small heading of the Headings note, as a `<p>`), "Lena Farrow", and a small figure, `Teaches charts · 3 courses`. Then a `flex flex-col gap-3` with two paragraphs: "Lena drew charts for a regional newspaper for eleven years. A chart there had to be right by six o'clock and clear to a reader on a bus." and "She has taught at Rowlark since 2025, and she answers the questions under her lessons herself." Then a text link with `self-start`, "All of Lena's courses", to `/catalogue`.

**The price.** `lg:col-span-5`. The `<h2>` "What it costs"; then a `flex flex-col gap-2`: a small figure, `Included in Plus`; the key figure's row from the layout notes, `$18` with `a month` beside it; and a small figure, `or $180 a year, which is two months free`. Then a `<ul>` with `flex flex-col gap-2 border-t border-border pt-5`, each `<li>` a `flex items-start gap-2` in `text-body` with the `Check` icon (`mt-1 shrink-0`, `aria-hidden="true"`): "All 10 lessons of this course", "The other 8 courses too", "A certificate when you finish". Then, with `mt-auto`, a `flex flex-col items-start gap-3`: an `<a href="#">` styled as a default button with `w-full`, "Start the course", and a text link, "Compare the plans", to `/plans`.

This is the second default button on the page. It is far below the opening, with what you will learn and the syllabus between them.

### 7. Footer

The footer from the layout notes.

### Behavior

- The accordion opens and closes each module on click, Enter and Space, as it ships. More than one module may be open, and all three may be closed.
- The bars of the picture get their heights from the two values and each chart's axis, in code, so another pair of values draws right, as long as each axis ends above the higher value, as both do here: a bar at the axis end would push its figure out of the plot.
- Every link and both buttons need no behavior beyond their `href`. The page has no other state.
