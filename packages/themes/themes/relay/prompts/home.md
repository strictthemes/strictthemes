---
page: club home page
title: Home
description: the home page of an amateur football club, with a scoreboard band that holds the last result and the next match, the latest news as a list, the top of the league table, the three kinds of membership and one main action to join.
order: 1
checks:
  - "The scoreboard is one band with the last result, Wendmoor FC 3–1 Otterby Town with the page's one Final badge, beside the next match and its kick-off time, the score and the time set in the heading font at `text-display` from `md` up."
  - "The header and the scoreboard are `bg-navy` in both modes, no text on them has a text color class but `text-ice` on labels (a crest and the badge keep their own pair), and the links there show their focus outline in `outline-navy-foreground`."
  - "The league table is a real `<table>` with a caption and scoped headers, shows the top five clubs, and marks Wendmoor FC, third on 27 points, with an ice blue row, a bold name and hidden words."
  - "Join the club in the page head is the only amber button on the page, and no text, link, icon or border is amber or orange."
  - "At 375px the header's nav sits on a second line, the two halves of the scoreboard stack, and the table fits without scrolling."
---

Sample content, if the user gave none: "Wendmoor Football Club", four days before its biggest match of the season. On Saturday 5 June 2027 the first team beat Otterby Town 3–1 at Millrace Park in front of 212 people; on Saturday 12 June at 15:00 they go to Castle Meadow to play the leaders, Castlebrook United. The top five of the Kestrel Valley League, Division One, after 14 of 22 matches (position, club, played, goal difference, points):

1. Castlebrook United, 14, +14, 29
2. Dunmarsh Athletic, 14, +12, 27
3. Wendmoor FC, 14, +11, 27
4. Pellow Green, 14, +7, 26
5. Stenwick Albion, 14, +4, 23

This page uses the stock `button`; add it with `npx shadcn@latest add button` if the project lacks it.

Build these parts in order. The container inside `<main>` has three items: a `<div>` with `flex flex-col gap-8` that holds parts 2 and 3; the grid of part 4; and the section of part 5.

### 1. Header

The header from the layout notes. No nav link is current on the home page.

### 2. Page head

The label `KESTREL VALLEY LEAGUE · DIVISION ONE`, then the `<h1>` "Wendmoor Football Club", then the sentence "Saturday football at Millrace Park since 1921. Three teams, 140 members, and room for one more." On the right, the amber link "Join the club".

### 3. Scoreboard

A `<section>` that is a scoreboard band, with the classes of the Scoreboards note, named by an `<h2>` "Last result and next match" that is `sr-only`. Inside it, after the `<h2>`, one grid with `grid grid-cols-1 gap-8 lg:grid-cols-2` and two halves. Every label on the band is `text-ice`, except its two links, which inherit the band's white.

**Last result,** a stack with `flex flex-col gap-5`:

- A row with `flex items-center justify-between gap-3`: an `<h3>` label, `LAST RESULT` (`font-mono text-label uppercase text-ice`), and the badge "Final". This is the page's one badge.
- The match row from the Scoreboards note: Wendmoor FC with the crest `W`, the score `3–1`, Otterby Town with the crest `OT`.
- A label line, centered with `text-center`: `SAT 5 JUN · MILLRACE PARK · ATTENDANCE 212`, the date a `<time>`.
- A link on the band, "Match report", to `/report`, centered with `self-center`: a label with the underline classes of the Links note and the band's focus outline.

**Next match,** a stack with `flex flex-col gap-5 border-t border-ice pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8`, so a rule divides the halves: above this one while they are stacked, to its left from `lg` up.

- An `<h3>` label, `NEXT MATCH`, styled as the first.
- A stack with `gap-1`: the kick-off time, `15:00`, a figure in `text-h1 md:text-display`, in a `<time>` with `dateTime="2027-06-12T15:00"`; under it the label line `SAT 12 JUN · CASTLE MEADOW · AWAY`.
- A `<p>` with `font-heading text-h2 uppercase`: "Castlebrook United v Wendmoor FC".
- A `<p>` in `text-body`: "First against third. A win takes Wendmoor above the leaders with seven matches left."
- A link on the band, "All fixtures", to `/fixtures`, at its own width (`self-start`), styled as the other.

### 4. News and table

A grid row with two items.

**Latest news,** seven columns from `lg` up: a `<section>` named by its `<h2>`, laid out as `flex flex-col gap-5`. Its heading row holds the `<h2>` "Latest news" and a label link "All news" to `#`. Under it a card with rows, a `<ul>` of four rows. Each `<li>` is a row and holds an `<article>` with `flex flex-col gap-1`: the date, a label in a `<time>`; the headline, an `<h3>` in `text-h2` that holds a link with `text-foreground underline-offset-4 decoration-2 hover:underline` (a headline link has no underline at rest); and one sentence in `text-body`. The four, newest first:

1. `SAT 5 JUN`, "Achebe double sinks Otterby", to `/report`: "Two goals from Tobin Achebe and a Brandvold penalty made it three league wins in a row at Millrace Park."
2. `THU 3 JUN`, "New floodlights switched on", to `#`: "The four new masts were lit for the first time at Thursday training, in time for the reserves' evening matches."
3. `SUN 30 MAY`, "Under 18s reach the cup final", to `#`: "A 2–1 win at Pellow Green puts the under 18s in the County Youth Cup final on Sunday 27 June."
4. `WED 26 MAY`, "Summer coaching week opens", to `#`: "Booking is open for a week of coaching for ages 7 to 14 at Millrace Park, from Monday 2 August."

**League table,** five columns from `lg` up: a `<section>` named by its `<h2>`, laid out as `flex flex-col gap-5`. Its heading row holds the `<h2>` "Division One" and a label link "Full table" to `/standings`. Under it a card with rows that holds the table from the Tables note and, after the table, a row with `border-t border-border px-5 py-3` holding one line of small print: "After 14 of 22 matches. Clubs level on points are split by goal difference."

The table's caption: "Kestrel Valley League, Division One: the top five clubs after 14 of 22 matches." Five columns, with these headers: `POS` (an `<abbr>` with the `title` "Position"), `CLUB`, `P` ("Played"), `GD` ("Goal difference") and `PTS` ("Points"); the last three are right-aligned. The five rows of the sample, with the goal difference signed (`+14`). The row of Wendmoor FC is the club's own row. A club's name may wrap on a phone; the table has no scroll box, because five short columns fit 375px.

### 5. Memberships

A `<section>` named by its `<h2>`, laid out as `flex flex-col gap-5`. Its heading row holds the `<h2>` "Three ways to join" and a label link "How membership works" to `/membership`. Under it a grid row of three cards, four columns each from `lg` up. Each card holds an `<h3>` as the Headings note sets a smaller heading; a stack with `gap-1` of the price, a figure in `text-h1`, and the label `A SEASON`; one sentence in `text-body`; and a label link to `/membership` at its own width (`self-start`):

- "Playing", `£95`: "For adults who want to play. Training twice a week and a place in the first team or reserves squad." The link: "Join as a player".
- "Junior", `£45`: "For players under 18. Coaching on Thursdays and matches with the under 18s on Sundays." The link: "Join as a junior".
- "Social", `£30`: "For everyone else. Free entry to home league matches and a vote at the annual meeting." The link: "Join as a social member".

### 6. Footer

The footer from the layout notes.

### Behavior

- The page has no state. Every link needs no behavior beyond its `href`.
- Nothing counts down to the next match, and the score does not change.
