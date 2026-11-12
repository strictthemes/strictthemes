---
page: league table page
title: Table
description: a league table of twelve clubs with played, won, drawn, lost, goals for and against, goal difference and points, a control for all, home or away matches that recalculates it, the club's own row marked, and a narrow layout that needs no sideways scrolling.
order: 3
checks:
  - "The table is a real `<table>` with a `<caption>`, a `<th scope=col>` for every column and a `<th scope=row>` for every club, twelve rows, and figures right-aligned with `tabular-nums`."
  - "All matches, Home and Away are a group of buttons with `aria-pressed`; choosing one recalculates every figure and the order in code, and Wendmoor FC stand 3rd with 27 points, 2nd with 18 and 4th with 9."
  - "The row of Wendmoor FC is filled with ice blue, with navy text, a bold name and hidden words, wherever it stands, and no other row is colored."
  - "The table's head is a band, `bg-navy` with white text in both modes, whose labels are `text-ice`, and nothing on it or in the ice panel is muted, amber or orange."
  - "At 375px the table shows position, club, played, goal difference and points, each club's wins, draws, losses and goals sit in a line under its name, and nothing scrolls sideways."
---

Sample content, if the user gave none: "Wendmoor Football Club" and the Kestrel Valley League, Division One, after 14 of 22 matches. Keep each club's home record and away record as data, and work out everything else in code. The twelve clubs (home: played, won, drawn, lost, goals for, goals against; then the same away):

- Castlebrook United: home 6, 4, 1, 1, 12, 6; away 8, 5, 1, 2, 22, 14
- Dunmarsh Athletic: home 7, 5, 2, 0, 15, 4; away 7, 2, 4, 1, 15, 14
- Wendmoor FC: home 7, 6, 0, 1, 17, 7; away 7, 2, 3, 2, 13, 12
- Pellow Green: home 8, 6, 1, 1, 14, 7; away 6, 2, 1, 3, 6, 6
- Stenwick Albion: home 6, 4, 0, 2, 13, 8; away 8, 3, 2, 3, 7, 8
- Lowmere Welfare: home 8, 5, 1, 2, 12, 8; away 6, 1, 1, 4, 6, 9
- Sedgeholme: home 6, 3, 2, 1, 10, 9; away 8, 2, 1, 5, 12, 13
- Otterby Town: home 6, 3, 2, 1, 9, 5; away 8, 1, 3, 4, 8, 13
- Tarrowby United: home 7, 2, 3, 2, 7, 10; away 7, 1, 2, 4, 3, 8
- Kirkfen Rangers: home 7, 2, 4, 1, 12, 9; away 7, 0, 2, 5, 7, 14
- Hollinvale: home 8, 2, 3, 3, 10, 14; away 6, 0, 1, 5, 3, 12
- Eastlow Wanderers: home 8, 2, 2, 4, 8, 17; away 6, 0, 0, 6, 2, 16

A win is 3 points and a draw 1. Goal difference is goals for less goals against. The order is by points, then goal difference, then goals for, then the club's name. With all matches counted the table reads (position, club, played, won, drawn, lost, goals for, goals against, goal difference, points):

1. Castlebrook United, 14, 9, 2, 3, 34, 20, +14, 29
2. Dunmarsh Athletic, 14, 7, 6, 1, 30, 18, +12, 27
3. Wendmoor FC, 14, 8, 3, 3, 30, 19, +11, 27
4. Pellow Green, 14, 8, 2, 4, 20, 13, +7, 26
5. Stenwick Albion, 14, 7, 2, 5, 20, 16, +4, 23
6. Lowmere Welfare, 14, 6, 2, 6, 18, 17, +1, 20
7. Sedgeholme, 14, 5, 3, 6, 22, 22, 0, 18
8. Otterby Town, 14, 4, 5, 5, 17, 18, −1, 17
9. Tarrowby United, 14, 3, 5, 6, 10, 18, −8, 14
10. Kirkfen Rangers, 14, 2, 6, 6, 19, 23, −4, 12
11. Hollinvale, 14, 2, 4, 8, 13, 26, −13, 10
12. Eastlow Wanderers, 14, 2, 2, 10, 10, 33, −23, 8

Use it to check your sums. With home matches only, the order is Pellow Green (19 points), Wendmoor FC (18), Dunmarsh Athletic (17), Lowmere Welfare (16), Castlebrook United (13), Stenwick Albion (12), Otterby Town (11, +4), Sedgeholme (11, +1), Kirkfen Rangers (10), Tarrowby United (9, −3), Hollinvale (9, −4), Eastlow Wanderers (8). With away matches only: Castlebrook United (16), Stenwick Albion (11), Dunmarsh Athletic (10), Wendmoor FC (9), Pellow Green (7, 0), Sedgeholme (7, −1), Otterby Town (6), Tarrowby United (5), Lowmere Welfare (4), Kirkfen Rangers (2), Hollinvale (1), Eastlow Wanderers (0).

This page uses the stock `button`; add it with `npx shadcn@latest add button` if the project lacks it.

Build these parts in order. The container inside `<main>` has one item: a `<div>` with `flex flex-col gap-8` that holds parts 2, 3 and 4.

### 1. Header

The header from the layout notes. The current page is Table.

### 2. Page head

The label `KESTREL VALLEY LEAGUE · 2027 SEASON`, then the `<h1>` "Division One table". On the right, the amber link "Join the club".

### 3. Matches control

A row with `flex flex-wrap items-center justify-between gap-3`:

- A button group with the `aria-label` "Matches counted" and three buttons: "All matches", chosen at the start, "Home" and "Away".
- A label in `text-muted-foreground`: `AFTER 14 OF 22 MATCHES`.

Right after the row, the status element from the Announcements note, empty at the start.

### 4. Table and side column

A grid row with two items.

**The table,** nine columns from `lg` up: a card with rows that holds the table from the Tables note and, after the table, a row with `border-t border-border px-5 py-3` holding one line of small print: "Clubs level on points are split by goal difference, then by goals scored. The champions go up to the Premier Division and the bottom two go down."

The caption follows the control: "Kestrel Valley League, Division One: all matches, after 14 of 22.", "Kestrel Valley League, Division One: home matches only." or "Kestrel Valley League, Division One: away matches only."

Ten columns. Every header but `CLUB` is an `<abbr>` with a `title`:

- `POS` ("Position"): the position, `1` to `12`, a figure in `text-h2`, left-aligned.
- `CLUB`: the club's name, the row's `<th scope="row">`. It holds a stack with `flex flex-col gap-1`: the name, then the club's record in one label, `W8 D3 L3 · 30–19` (won, drawn, lost, then goals for and against), with `md:hidden`. That label is `text-muted-foreground`, except in the club's own row, where it inherits.
- `P` ("Played"), `W` ("Won"), `D` ("Drawn"), `L` ("Lost"), `GF` ("Goals for"), `GA` ("Goals against"), `GD` ("Goal difference") and `PTS` ("Points"): right-aligned figures, headers too. The goal difference is signed, `+11`, `0`, `−4`, with U+2212 for the minus. The points are `font-bold`.

The five columns `W`, `D`, `L`, `GF` and `GA` show from `md` up only: their header cells and their body cells have `hidden md:table-cell`. So below `md` the table has five columns, position, club, played, goal difference and points, and the record under each name gives the rest. A name may wrap. The table never scrolls sideways and has no scroll box.

The row of Wendmoor FC is the club's own row, in every view.

**The side column,** three columns from `lg` up: a `<div>` with `flex flex-col gap-5` and two items.

- **Wendmoor's place,** an ice panel, a `<section>` named by its `<h2>` "Wendmoor FC" in `text-h2`. It holds, in this order: a label with the view, `ALL MATCHES`, `HOME MATCHES` or `AWAY MATCHES`; the club's position as a figure in `text-h1`, `3RD`; a `<dl>` as the Description lists note sets it on ice, each row `flex items-baseline justify-between gap-3`, the `<dt>` a label and the `<dd>` in `text-right text-body tabular-nums`, with three rows, "Points", "Played" and "Goal difference"; and a `<p>` in `text-body` that gives the gap to the top club. With all matches: `3RD`, `27`, `14`, `+11`, "2 points behind Castlebrook United." With home matches: `2ND`, `18`, `7`, `+10`, "1 point behind Pellow Green." With away matches: `4TH`, `9`, `7`, `+1`, "7 points behind Castlebrook United." All of it is worked out in code; were the club first, the sentence would read "Top of the table." Nothing on the panel has a text color class.
- **Key,** a card, a `<section>` named by its `<h2>` "Key". Under the heading a `<dl>` as the Description lists note sets it on a card, with eight rows: the `<dt>` is the short header as a label in `text-foreground` and the `<dd>` its meaning: `P`, "Played"; `W`, "Won"; `D`, "Drawn"; `L`, "Lost"; `GF`, "Goals for"; `GA`, "Goals against"; `GD`, "Goal difference"; `PTS`, "Points".

### 5. Footer

The footer from the layout notes.

### Behavior

- All of it works on the sample data in component state. The figures for all matches are the sums of the home and the away record.
- Choosing "All matches", "Home" or "Away" recalculates every row, sorts the table again, and changes the caption and the ice panel. The chosen button's `aria-pressed` and variant follow the choice, and focus stays on the button.
- After each choice the status element says where the club stands: "All matches: Wendmoor FC are 3rd with 27 points.", "Home matches: Wendmoor FC are 2nd with 18 points.", "Away matches: Wendmoor FC are 4th with 9 points."
- Rows change place at once, with no animation.
- The links need no behavior beyond their `href`.
