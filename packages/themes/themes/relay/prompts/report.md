---
page: match report
title: Report
description: a report of one football match, with a scoreboard band for the final score, a timeline of goals and cards, the report's text, the two line-ups side by side, and the match's figures as plain bars with each figure written beside its bar.
order: 5
checks:
  - "The scoreboard is a band with the final score 3–1 at `text-display` from `md` up, both clubs with a round crest drawn from plain elements, the scorers under each name and the page's one Final badge."
  - "The timeline lists four goals and three cards in order of the minute, each named in words, with the score after each goal, and it agrees with the scoreboard, the report and the line-ups."
  - "The two line-ups sit side by side from `lg` up and stack below, each with eleven numbered starters, the substitutes and the manager."
  - "Each match figure has one bar for each club with the figure written beside it; a bar's width comes from the data in an inline style, and the bars are hidden from screen readers."
  - "Join the club in the page head is the only amber button on the page, and no text, link, icon or bar is amber or orange."
---

Sample content, if the user gave none: "Wendmoor Football Club" and its match of Saturday 5 June 2027 in the Kestrel Valley League, Division One: Wendmoor FC 3, Otterby Town 1, at Millrace Park, kick-off 15:00, half-time 1–1, attendance 212, referee M. Garside. What happened, in order:

- `23'`: goal for Wendmoor FC, 1–0. Tobin Achebe, a low shot from Finn Marlowe's pass.
- `36'`: yellow card for Otterby Town. Dominic Ferreby, for a late tackle on Idris Farrow.
- `41'`: goal for Otterby Town, 1–1. Lars Penhale, a header from Patrick Lowther's corner.
- `57'`: yellow card for Otterby Town. Rhys Underhill, for a trip on Lewis Oyelaran in the area.
- `58'`: goal for Wendmoor FC, 2–1. Matteo Brandvold, from the penalty.
- `71'`: yellow card for Wendmoor FC. Samir Kettle, for a shirt pull.
- `84'`: goal for Wendmoor FC, 3–1. Tobin Achebe, a header from Dara Whitlock's cross.

The match's figures, Wendmoor FC first: possession 56% and 44%; shots 14 and 9; shots on target 7 and 3; corners 6 and 4; fouls 9 and 13. Wendmoor FC stay third on 27 points, two behind Castlebrook United, whom they play away on Saturday 12 June at 15:00. Name no goal, card or figure that is not in this brief.

This page uses the stock `button`; add it with `npx shadcn@latest add button` if the project lacks it.

Build these parts in order. The container inside `<main>` has four items: a `<div>` with `flex flex-col gap-8` that holds parts 2 and 3; the grid of part 4; the section of part 5; and the section of part 6.

### 1. Header

The header from the layout notes. The current page is Report.

### 2. Page head

The label `MATCH REPORT · DIVISION ONE`, then the `<h1>` "Achebe double sinks Otterby", then the sentence "Wendmoor FC were level at half-time and won 3–1 at Millrace Park, their third league win in a row." Then, as the stack's last item, a label in `text-muted-foreground`: `BY NADIA FERRIS · SAT 5 JUN 2027`, the date a `<time>`. On the right, the amber link "Join the club".

### 3. Scoreboard

A `<section>` that is a scoreboard band, with the classes of the Scoreboards note, named by an `<h2>` "Final score" that is `sr-only`, and laid out as `flex flex-col gap-5`. Every label on the band is `text-ice`. After the `<h2>`:

- A row with `flex items-center justify-between gap-3`: the label `KESTREL VALLEY LEAGUE · DIVISION ONE`, and the badge "Final". This is the page's one badge.
- The match row from the Scoreboards note: Wendmoor FC with the crest `W`, the score `3–1`, Otterby Town with the crest `OT`. Under each name, a `<ul>` with `flex flex-col gap-1` of that side's scorers, each a label: `ACHEBE 23', 84'` and `BRANDVOLD 58' (PEN)` for Wendmoor FC; `PENHALE 41'` for Otterby Town. A scorer's line may wrap on a phone.
- A stack with `gap-1` of two label lines, each centered with `text-center`: `SAT 5 JUN 2027 · 15:00 · MILLRACE PARK`, the date a `<time>`; then `HALF-TIME 1–1 · ATTENDANCE 212`.

### 4. Report and timeline

A grid row with two items.

**The report,** seven columns from `lg` up: an `<article>` named by its `<h2>` "Report" in `text-h2`, laid out as `flex flex-col gap-3`. Under the heading, five paragraphs in `text-body`, each at most `max-w-2xl` wide, with these words; the manager's words stand in double quotation marks:

1. Tobin Achebe scored twice as Wendmoor FC beat Otterby Town 3–1 at Millrace Park on Saturday, their third league win in a row and their sixth in seven home matches.
2. It was a result with some weight behind it. Otterby won 3–0 when the sides met at Weir Lane in March, and for an hour here they looked ready to make trouble again. Achebe put Wendmoor ahead in the 23rd minute, running on to Finn Marlowe's pass and finishing low past Owen Hartigan, but the visitors were level before the break when their captain, Lars Penhale, headed in Patrick Lowther's corner.
3. The match turned just before the hour. Rhys Underhill tripped Lewis Oyelaran as he cut into the area and was booked for it, and Matteo Brandvold sent the penalty high to the keeper's left. Otterby pushed on and left room behind them; Jonah Pryce had one save to make, from Connor Maddern, and made it well.
4. The third goal came from the bench. Dara Whitlock, on for Idris Farrow, crossed from the right in the 84th minute and Achebe rose at the far post to head his eleventh league goal of the season.
5. "We owed them one," said the manager, Dev Halloran. "We were patient while it was level, and the penalty opened the game up." Wendmoor stay third on 27 points, two behind Castlebrook United, where they play next Saturday.

After the last paragraph, a text link "All fixtures and results" to `/fixtures`, at its own width (`self-start`).

**The timeline,** five columns from `lg` up: a card with rows, a `<section>` named by its `<h2>`. Its first row holds the `<h2>` "Timeline" in `text-h2`. Then an `<ol>` with `role="list"` of nine rows, in order of the minute. Each row is `flex items-baseline gap-3` with the row padding of the Cards with rows note, and has three parts:

- The minute, a figure in `text-h2` with `w-12 shrink-0`: `23'`.
- A stack with `flex min-w-0 flex-1 flex-col gap-1`: what it was and for whom, a label (`GOAL · WENDMOOR FC`, `YELLOW CARD · OTTERBY TOWN`), then a sentence in `text-body` with the player and how, from the sample ("Tobin Achebe, a low shot from Finn Marlowe's pass.").
- For a goal only, the score after it, a figure in `text-h2`: `1–0`.

The seven events of the sample make seven rows. Two more mark the halves and have a label and a score but no sentence: `45'`, `HALF-TIME`, `1–1`, after the row of the 41st minute; and `90'`, `FULL TIME`, `3–1`, as the last row. A goal and a card are told apart by their words, never by a color.

### 5. Line-ups

A `<section>` named by its `<h2>` "Line-ups", laid out as `flex flex-col gap-5`: the `<h2>`, then a grid row of two cards with rows, six columns each from `lg` up, Wendmoor FC first. Each card has, in this order:

- A first row with `flex items-center justify-between gap-3`: on the left, in a `flex items-center gap-3`, the club's crest (`size-8`) and its name in an `<h3>` as the Headings note sets a smaller heading; on the right the formation as a label, `4-4-2` or `4-5-1`.
- An `<ol>` with `role="list"` of the eleven starters. Each is a row with `flex items-baseline gap-3` and, here, `px-5 py-2` in place of the note's row padding: the shirt number, a label with `w-5 shrink-0 tabular-nums`; the name in `text-body` with `min-w-0 flex-1`; and, where the player has one, a note as a label with `text-right`.
- A row with `flex flex-col gap-1`: the label `SUBSTITUTES`, then one sentence in `text-body`.
- A last row with `flex items-baseline justify-between gap-3`: the label `MANAGER`, then the name in `text-body`.

Wendmoor FC, `4-4-2` (number, name, note):

1. `1`, Jonah Pryce
2. `2`, Callum Okafor
3. `5`, Ruben Stannard, `CAPTAIN`
4. `6`, Tomasz Wren
5. `3`, Kieran Dossou
6. `7`, Idris Farrow, `OFF 66'`
7. `4`, Matteo Brandvold, `GOAL 58' (PEN)`
8. `8`, Samir Kettle, `YELLOW CARD 71'`
9. `11`, Lewis Oyelaran
10. `9`, Tobin Achebe, `GOALS 23', 84'`
11. `10`, Finn Marlowe, `OFF 78'`

Substitutes: "14 Dara Whitlock (on 66' for Farrow), 16 Niall Sorensen (on 78' for Marlowe). Not used: 12 Aaron Petty, 15 Joe Tindall, 13 Milan Reyes." Manager: Dev Halloran.

Otterby Town, `4-5-1`:

1. `1`, Owen Hartigan
2. `2`, Marcus Bele
3. `5`, Lars Penhale, `CAPTAIN · GOAL 41'`
4. `4`, Dominic Ferreby, `YELLOW CARD 36'`
5. `3`, Ashley Quaye
6. `8`, Rhys Underhill, `YELLOW CARD 57'`
7. `6`, Jude Amankwah
8. `10`, Patrick Lowther
9. `7`, Theo Vasik, `OFF 62'`
10. `11`, Connor Maddern
11. `9`, Elias Thornbury, `OFF 75'`

Substitutes: "14 Ben Iredale (on 62' for Vasik), 15 Hal Sweeting (on 75' for Thornbury). Not used: 12 Luca Dray, 16 Nico Abara, 13 Sid Carver." Manager: Graham Tull.

### 6. Match figures

A `<section>` named by its `<h2>` "Match figures", laid out as `flex flex-col gap-5`: the `<h2>`, then a grid row with two items.

**The figures,** eight columns from `lg` up: a card. It holds a `<dl>` with `flex flex-col gap-5` and, after it, one line of small print: "Figures were recorded by the club. Referee: M. Garside."

Each figure is a `<div>` with `flex flex-col gap-2`: a `<dt>`, the figure's name as a label, then two `<dd>` elements, Wendmoor FC's first. A `<dd>` is `flex items-center gap-3` with three parts:

- The club's name as a label with `w-28 shrink-0`: `WENDMOOR FC`, `OTTERBY TOWN`.
- The bar's track, a `<div>` with `min-w-0 flex-1` and no fill, which holds the bar: a `<div>` with `h-3 rounded-sm` and `aria-hidden="true"`, `bg-secondary` for Wendmoor FC (navy in light mode, ice blue in dark mode; not `bg-navy`, which would not show on a dark card) and `bg-muted-foreground` for Otterby Town, its width an inline `style` in percent.
- The figure itself, written out, in `text-h2` with `w-12 shrink-0 text-right`: `56%`, `14`.

The five figures, in this order: "Possession", `56%` and `44%`; "Shots", `14` and `9`; "Shots on target", `7` and `3`; "Corners", `6` and `4`; "Fouls", `9` and `13`. A possession bar is as wide as its percent. Any other bar is the figure's share of the larger of the two, so the larger is 100%: 9 shots against 14 is 64.3%. The widths are worked out in code. The two clubs are told apart by their names; the two bar colors only help.

**Next match,** four columns from `lg` up: an ice panel, an `<aside>` named by its `<h2>` "Next match" in `text-h2`. It holds a stack with `gap-1` of the kick-off time, `15:00`, a figure in `text-h1`, and the label `SAT 12 JUN · CASTLE MEADOW · AWAY`; then a `<p>` with `font-heading text-body font-bold uppercase`, "Castlebrook United v Wendmoor FC"; then a `<p>` in `text-body`: "First against third. A win takes Wendmoor above the leaders with seven matches left." Nothing on the panel has a text color class, and nothing on it is a link.

### 7. Footer

The footer from the layout notes.

### Behavior

- The page has no state. The bars' widths are worked out from the figures when the page renders, so a changed figure changes its bar.
- Nothing animates: the bars are at their width from the start.
- The links need no behavior beyond their `href`.
