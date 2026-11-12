---
page: wedding invitation page
title: Invitation
description: the invitation to a summer wedding, with a pastel opening that sets the names and the date large, the time and the place, a short welcome from the couple, the plan for the day in four lines and one action to reply.
order: 1
checks:
  - "The opening is one blush block holding the names as the page's only h1, the date in words, and the time and the place, and it holds no link, button, field or badge."
  - "Reply now is the only plum (default) button on the page, it is a link to /rsvp, and it sits on a card on the paper, not on a pastel block."
  - "The plan is an ordered list of four rows on the mist block, each with a clock time in the mono font as a time element and what happens in words."
  - "The opening block element carries bg-blush text-blush-foreground and the plan block element bg-mist text-mist-foreground, so in dark mode their text is still plum ink, and no element inside them has text-foreground, text-muted-foreground or text-primary."
  - "At 375px the names, the date and the place fit inside the opening block, and the page does not scroll sideways."
---

Sample content, if the user gave none: the wedding of Clem Ashdown and Rafe Linnell on Saturday 17 July 2027 at Quillbrook Barn, Saltry Lane, Little Saltry, ZQ4 7HB, near Market Fenley. Guests arrive from 13:30; the ceremony is at 14:00 in the barn, dinner at 17:00 at long tables, dancing from 20:00 with a ceilidh band, The Saltry Reelers, and the last minibus leaves for Market Fenley at 23:30. Replies by Friday 30 April 2027. Write any other copy yourself, warm and plain, with no superlatives.

Build these parts in order.

### 1. Header

The header from the layout notes. No link is the current page here: the names are the link home.

### 2. Opening

A full-width section that is a pastel block in blush, as the layout notes describe it, with its `aria-labelledby` pointing at the `<h1>`. This one block is centered: add `items-center text-center`, and here, in place of the block's `md:p-10`, `md:px-10 md:py-22`, so it stands like the front of a card. The block element itself carries `bg-blush text-blush-foreground`, the pair from the first layout note, so its text stays plum in dark mode; nothing inside it gets a text color class of its own. In the block's `gap-6`, two groups:

- A `flex flex-col items-center gap-3` holding a `flex flex-col items-center gap-2` with a label, `Together with their families`, and under it the `<h1>` "Clem & Rafe" in `text-h1 md:text-display`; then one sentence in `text-body` with `max-w-xl`: "would love you to be there on the day they marry."
- A `flex flex-col items-center gap-2` holding the date as a `<p>` in `font-heading text-h2 md:text-h1`, its words a `<time dateTime="2027-07-17">Saturday 17 July 2027</time>`, and under it a label: `14:00 · Quillbrook Barn, Little Saltry`, the time a `<time dateTime="14:00">`.

At 375px the names and the date may each wrap onto two lines; both stay inside the block.

### 3. When and where

A full-width section with an `<h2>` "When and where", then a grid of three cards from the layout notes, each `md:col-span-4`, stacked below `md` in this order. Each card, in its `gap-3`, holds an icon in `size-6` (here, instead of the notes' `size-4`) with `strokeWidth={1.5}`, `aria-hidden="true"` and `text-foreground`; an `<h3>` in `text-h2`; and a `flex flex-col gap-2` with the card's text and a small figure under it:

1. `CalendarDays`, "When": the date as a `<p>` in `text-body`, `<time dateTime="2027-07-17">Saturday 17 July 2027</time>`, and the small figure `Arrive from 13:30 · Ceremony at 14:00`, each time a `<time>`.
2. `MapPin`, "Where": an `<address className="not-italic">` in `text-body` with four block `<span>`s, `Quillbrook Barn`, `Saltry Lane`, `Little Saltry`, `ZQ4 7HB`, and the small figure `A 12-minute drive from Market Fenley station`.
3. `Shirt`, "What to wear": one or two sentences in `text-body`: summer best, and flat shoes, since the drinks are on the grass of the orchard. The small figure: `Evenings in the valley turn cool`.

### 4. A note from us

A section in the centered column from the layout notes, with an `<h2>` "A note from us", then, in the column's `gap-6`, a `flex flex-col gap-3` with two paragraphs in `text-body` and the signature:

- "We met eight years ago at a ceilidh in Market Fenley, where neither of us knew the steps. We still do not, and we would like to get them wrong again with all of you."
- "There will be long tables, a lot of food and a band that plays until the last minibus. Bring the people named on your invitation, your dancing shoes and a jumper for later."
- The signature, a `<p>` in `font-heading text-h2`: "Clem and Rafe". It is not a heading.

### 5. The plan

A section in the centered column whose `<div>` is a pastel block in mist, as the layout notes describe it, with the section's `aria-labelledby` pointing at its `<h2>`. The block element itself carries `bg-mist text-mist-foreground`, the pair from the first layout note, so its text stays plum in dark mode; nothing inside it gets a text color class of its own. In the block's `gap-6`: a `flex flex-col gap-2` with a label, `Saturday 17 July 2027` (a `<time dateTime="2027-07-17">`), and the `<h2>` "The plan"; then the plan as an `<ol>` with no markers and no padding, rows on a pastel block as the Rows note says (`flex flex-col gap-3`, no rules). Each `<li>` is `flex items-baseline gap-6`: the time, a `<time>` in `w-14 shrink-0 font-mono text-label tabular-nums`, then what happens in `text-body`. Four rows, in these words:

- `14:00` The ceremony, in the barn
- `17:00` Dinner at long tables
- `20:00` Dancing with The Saltry Reelers
- `23:30` The last minibus to Market Fenley

The `dateTime` of each is the time alone, `14:00` and so on. The block holds no link: the way to the whole day is in the next part, on the paper.

### 6. Reply

A section in the centered column whose `<div>` is a card, with the section's `aria-labelledby` pointing at its `<h2>`. The card adds `items-center text-center` and, in place of the card's `gap-3`, `gap-6`. Inside it:

- A `flex flex-col items-center gap-3` with the `<h2>` "Can you come?" and one sentence in `text-body`: "Please reply by Friday 30 April 2027, so we can plan dinner and the minibuses.", the date a `<time dateTime="2027-04-30">`.
- The page's one main action: an `<a href="/rsvp">` styled as a default button, "Reply now", full width below `md` (`w-full md:w-auto`).
- One sentence in `text-body` with `max-w-xl`: "The times, the way to the barn and where to stay are all on the plan for the day.", with "the plan for the day" as a link in running text to `/day`.

### 7. Footer

The footer from the layout notes.

### Behavior

- The page is static: no state, no form and no script beyond what the stock components bring.
- "Reply now" and the links go to their addresses and need no other behavior.
