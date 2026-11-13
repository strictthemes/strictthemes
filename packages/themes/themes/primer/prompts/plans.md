---
page: plans page
title: Plans
description: the plans and prices of an online school, with a switch between paying monthly and yearly that changes the prices, three plans with one marked, a table that compares what each includes, and questions and answers.
order: 5
checks:
  - "Turning Pay yearly on changes both paid plans' prices and billing notes in the cards and the price row of the table, and turning it off brings the monthly ones back."
  - "The switch has a visible label tied to it, says whether it is on, and a `role=status` element says in words which prices are shown."
  - "Exactly one plan carries the Most chosen badge, and its button is the only default button on the page."
  - "Every cell of the comparison table is words or a figure, Yes and No are written beside their icons, and at 375px the table scrolls inside its own box, which can be reached with the keyboard."
  - "Each question opens and closes with the keyboard, and its trigger is in the body font at weight 600."
---

Sample content, if the user gave none: "Rowlark", an online school for practical data skills, with nine courses and 102 lessons. Three plans, with prices in US dollars:

- **Free**, $0: the first module of every course, a question at the end of each lesson, your progress and your days in a row. No practice files and no certificates.
- **Plus**, $18 a month, or $180 a year, which is $15 a month and two months free: all nine courses, practice files for every lesson, a certificate for each course you finish. Plus is the plan most learners choose.
- **Team**, $24 a learner a month, or $240 a learner a year, which is $20 a month: Plus for 3 to 50 learners, the whole team's progress on one page, and one invoice.

The container inside `<main>` uses `gap-20` between sections. This page uses the stock `button`, `badge`, `switch`, `table` and `accordion`; add any the project lacks with `npx shadcn@latest add button badge switch table accordion`. It has no button group, so `components/ui/button.tsx` needs only the `secondary` change of the Buttons note.

Build these parts in order.

### 1. Header

The header from the layout notes, with Plans as the current page.

### 2. Opening

A `flex flex-col gap-3`, not a section: the `<h1>` in `text-h1 md:text-display`, "One plan opens every course", and one paragraph: "The first module of every course is free, for as long as you like. Plus opens all nine courses, 102 lessons in all."

### 3. Plans

A section with a visually hidden `<h2>`, "Plans" (`sr-only`), then the switch and the cards in the section's `gap-5`.

**The switch.** A row, `flex flex-wrap items-center gap-3`:

- A `<label>` with `inline-flex min-h-10 cursor-pointer items-center gap-3`, wrapping the shadcn `Switch` and a `<span>` with an `id`, "Pay yearly", in `font-sans text-body font-semibold`. The `Switch` also names that `<span>` in `aria-labelledby`. It is off at the start: the prices are monthly.
- A badge, "2 months free".
- A `<p>` with `role="status"` and `sr-only`, which always holds one sentence: "Prices are shown for paying monthly." or "Prices are shown for paying yearly."

The stock `Switch` is a pill, which this theme allows, but it is small and its off state is faint on cream. In `components/ui/switch.tsx`: replace `data-[size=default]:h-[18.4px] data-[size=default]:w-[32px]` with `data-[size=default]:h-6 data-[size=default]:w-10`, and the thumb's `group-data-[size=default]/switch:size-4` with `group-data-[size=default]/switch:size-5`; the `sm` size's classes and the thumb's `translate-x-[calc(100%-2px)]` stay, and at the new sizes the thumb still ends at the track's inner edge. On, the track is `bg-primary`, as it ships: deep blue, and yellow in dark mode. Off, replace `data-unchecked:bg-input dark:data-unchecked:bg-input/80` on the track with `data-unchecked:bg-muted-foreground`, and on the thumb take out `dark:data-unchecked:bg-foreground`, so an off thumb is `bg-background` in both modes. The thumb's other stock colors stay. The thumb's place and the switch's own state say whether it is on, not the color alone.

**The cards.** A `<ul>` with `grid grid-cols-1 gap-5 lg:grid-cols-3`, in the order Free, Plus, Team. Each `<li>` is a card from the layout notes with `h-full`, holding, top to bottom in its `gap-5`:

1. A row, `flex flex-wrap items-center justify-between gap-2`: the plan's name as an `<h3>` in `text-h2` and, on Plus only, the badge "Most chosen".
2. A `flex flex-col gap-2`: the price as the key figure's row from the layout notes, and under it the billing note, a small figure.
   - Free: `$0` with `a month`; `Free for as long as you like`.
   - Plus: `$18` with `a month`; `Billed every month`. On yearly: `$15` with `a month`; `Billed $180 once a year`.
   - Team: `$24` with `a learner a month`; `Billed every month · From 3 learners`. On yearly: `$20` with `a learner a month`; `Billed $240 a learner once a year · From 3 learners`.
3. One sentence in `text-body` saying who the plan is for: "For trying a course before you decide." / "For one learner who wants every course." / "For a team that learns together at work."
4. What it includes: a `<ul>` with `flex flex-col gap-2 border-t border-border pt-5`. Each `<li>` is a `flex items-start gap-2` in `text-body`: an icon (`mt-1 shrink-0`, `aria-hidden="true"`), `Check` for what the plan has and `Minus` for what it has not, then the line in words. The lines, exactly:
   - Free: "The first module of every course", "A question at the end of each lesson", "Your progress and your days in a row", then with `Minus`: "No practice files", "No certificates".
   - Plus: "All 9 courses, 102 lessons", "Practice files for every lesson", "A certificate for each course you finish", "Everything in Free".
   - Team: "Everything in Plus, for 3 to 50 learners", "The whole team's progress on one page", "One invoice, by card or bank transfer".
5. The call to action, last, with `mt-auto` and `w-full`, so the three stand on one line from `lg` up: an `<a href="#">` styled as a button. Free: `secondary`, "Start for free". Plus: the default variant, "Choose Plus". Team: `secondary`, "Choose Team".

Plus is marked only by its badge and its default button. Do not enlarge it, lift it, give it a colored border or tint its fill.

### 4. Compare the plans

A section with the `<h2>` "Compare the plans". Under it, a card whose classes are `overflow-hidden rounded-xl border border-border bg-card`: the card's without `p-5` and without stack classes, holding the shadcn `Table`.

The stock `Table` is off the type scale and its scroll box cannot take focus. Give the `Table` `className="text-body"`. In `components/ui/table.tsx`, give the scroll box, the `<div>` around the `<table>`, `tabIndex={0}`, `role="region"`, an `aria-label` from a required `label` prop, here "Comparison of the three plans", and the focus outline from the rules drawn inside it: `focus-visible:-outline-offset-2` in place of `focus-visible:outline-offset-2`, because the card around it clips. No `<caption>`: the heading above names the table.

- **The header row:** four header cells, each a `<th scope="col">` (the stock `TableHead`) that is a label in `text-muted-foreground` with `px-5`, its stock height and `whitespace-nowrap` kept: "What you get", "Free", "Plus", "Team".
- **The body rows:** each starts with a `<th scope="row">`, not the stock `TableHead`, with `px-5 py-3 text-left align-middle font-normal whitespace-nowrap text-body text-foreground` (`align-middle` as the stock `TableCell` has). The three cells after it are `TableCell`s with `px-5 py-3`. A cell that is a figure (a price, a number) is `font-mono tabular-nums` at the body size, all of it, the words of a price (`$18 a month`) included; a cell that is a phrase is body text. A "Yes" or a "No" is an `inline-flex items-center gap-2` with the `Check` or the `Minus` icon (`aria-hidden="true"`) before the word.
- Rows keep the stock 1px rules and the stock hover fill. No zebra stripes, no colored cells, no ticks without a word.

The nine rows, with the cells for Free, Plus and Team:

1. Price: `$0`; `$18 a month`; `$24 a learner a month`. On yearly: `$0`; `$15 a month`; `$20 a learner a month`.
2. Courses: "First module of each"; "All 9"; "All 9"
3. A question after each lesson: Yes; Yes; Yes
4. Progress and days in a row: Yes; Yes; Yes
5. Practice files: No; Yes; Yes
6. Certificates: No; Yes; Yes
7. Learners: `1`; `1`; `3 to 50`
8. The team's progress on one page: No; No; Yes
9. Answers by email: "Within 3 working days"; "Within 1 working day"; "Within 1 working day"

The four columns fit the card from `lg` up. On a phone the table scrolls sideways in its box.

### 5. Questions

A section with `md:max-w-3xl` and the `<h2>` "Questions people ask". Under it, the accordion in its card, as the Accordions note sets it, with five items whose values are `q1` to `q5`, none open at the start and one open at a time, as it ships. Each answer is one `<p>` in `text-body`. The questions and answers:

1. "Can I try a course before I pay?" "Yes. The first module of every course is free, and you do not need a card to start."
2. "What happens if I stop paying for Plus?" "You keep your progress and your certificates. Lessons after the first module of each course close until you come back."
3. "Can I pay once a year?" "Yes. Plus is $180 a year, which is two months free. Team is $240 a learner a year."
4. "How does Team work?" "One person pays for 3 to 50 learners and invites them by email. Everyone gets Plus, and the person who pays sees the team's progress on one page."
5. "Do certificates run out?" "No. A certificate names the course, its lessons and the day you finished, and it stays in your account."

### 6. Footer

The footer from the layout notes.

### Behavior

- Keep whether "Pay yearly" is on in component state. The two paid plans' prices and billing notes in the cards, the price row of the table and the sentence in the status element all read from it. Free does not change.
- The switch works with a click and from the keyboard, as it ships, and a click on its label turns it too. Turning it moves no focus.
- The accordion opens and closes on click, Enter and Space, as it ships.
- The three plan buttons and the nav links need no behavior beyond their `href`.
