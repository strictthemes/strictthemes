---
page: wedding day plan page
title: The day
description: the plan for a wedding day, with a timeline of the day in rows, the venue with its address and how to get there, where to stay nearby, and questions and answers in an accordion.
order: 4
checks:
  - "The timeline is an ordered list of rows, each with its clock time as a time element in the mono font, and the Sunday row carries the page's only badge, Day two."
  - "The address is an address element set upright, and the way to the barn is written out in words for the train, the car, a taxi and on foot."
  - "The facts at a glance sit on a mist block, and the block holds no link, button or badge."
  - "Each question in the accordion opens and closes with the keyboard, its trigger is at least 44px tall, and its text is on the type scale."
  - "The page has no plum (default) button."
  - "The opening block element carries bg-candy text-candy-foreground and the at a glance block element bg-mist text-mist-foreground, so their text stays plum ink in dark mode."
---

Sample content, if the user gave none: the day of the wedding of Clem Ashdown and Rafe Linnell, Saturday 17 July 2027, at Quillbrook Barn, Saltry Lane, Little Saltry, ZQ4 7HB. The barn's phone on the day is 01632 960 214. The nearest station is Market Fenley, a 12-minute drive; minibuses leave the station forecourt for the barn at 13:00 and 13:15, and leave the barn for the station and The Old Granary at 22:30 and 23:30. Parking is free in the paddock. The local taxi firm, Fenley Cars, is on 01632 960 881. On Sunday 18 July there is brunch on the lawn from 11:00 to 13:00. Write any other copy yourself, warm and plain.

Build these parts in order.

### 1. Header

The header from the layout notes, with "The day" as the current page; its link keeps `/day`.

### 2. Opening

A full-width section that is a pastel block in candy, as the layout notes describe it, with its `aria-labelledby` pointing at the `<h1>`. The `<section>` is the block element, and it carries `bg-candy text-candy-foreground`, the pair from the first layout note, so its text stays plum in dark mode; nothing inside it gets a text color class of its own. It holds one `flex flex-col gap-3`: a `flex flex-col gap-2` with a label, `Saturday 17 July 2027 · Little Saltry` (the date a `<time dateTime="2027-07-17">`), and the `<h1>` "The plan for the day" in `text-h1 md:text-display`; then one paragraph in `text-body` with `max-w-xl`: "When things happen, how to reach the barn, where to sleep, and the answers to what people have asked us so far."

### 3. How the day goes

A section in the centered column from the layout notes, with an `<h2>` "How the day goes", then in the column's `gap-6` the timeline: an `<ol>` of rows as the Rows note describes it, with `divide-y divide-border`, no markers and no padding. Each `<li>` is `flex items-baseline gap-6 py-3 first:pt-0 last:pb-0`:

- At the left, the time as a `<time>` in `w-14 shrink-0 font-mono text-label tabular-nums text-foreground`, with a `dateTime` that holds the date and the time: `<time dateTime="2027-07-17T13:30">13:30</time>`.
- Then a `flex min-w-0 flex-col gap-2`: the title as an `<h3>` in `text-body`, and under it one or two sentences in `text-body`.

The eight rows, with the titles word for word:

1. `13:30` "Arrive and find a drink": lemonade and elderflower fizz in the orchard. The minibuses from Market Fenley station leave at 13:00 and 13:15.
2. `14:00` "The ceremony": in the barn, about half an hour. Phones away until it is over, please; the photographer has it covered.
3. `15:00` "Photos and lawn games": on the lawn behind the barn, with tea, cake and a croquet set.
4. `17:00` "Dinner at long tables": in the barn. Your place is on the board by the door.
5. `19:00` "Speeches and cake": three speeches, each under five minutes.
6. `20:00` "Dancing with The Saltry Reelers": a ceilidh band whose caller teaches every dance before it starts.
7. `23:30` "The last minibus": to Market Fenley station and The Old Granary. An earlier one leaves at 22:30.
8. `11:00` "Brunch on the lawn": the next morning, Sunday 18 July, for anyone still in Little Saltry, until 13:00. Its `dateTime` is `2027-07-18T11:00`, and the date in its sentence is a `<time dateTime="2027-07-18">Sunday 18 July</time>`. Here the title sits in a row, `flex flex-wrap items-center gap-2`, with the `<h3>` first and after it the page's one badge, from the layout notes, "Day two" (add it with `npx shadcn@latest add badge` if the project has none).

Every other time in the sentences is a `<time>` too, its `dateTime` the time alone (`13:00`).

### 4. Getting to the barn

A section of parts side by side, from the layout notes, with its `aria-labelledby` pointing at the `<h2>` "Getting to Quillbrook Barn".

**First part,** `md:col-span-6`: a `flex flex-col gap-6` holding two groups.

- A `flex flex-col gap-3` with the `<h2>` "Getting to Quillbrook Barn" and an `<address className="not-italic">` in `text-body`, a `flex flex-col` with no gap, so it reads as one block of lines, of four `<span>`s, `Quillbrook Barn`, `Saltry Lane`, `Little Saltry`, `ZQ4 7HB`, and a fifth line, a `<p>` in the `<address>`: "On the day: 01632 960 214", the number a link in running text to `tel:+441632960214`.
- The ways there, as a `<ul>` with no markers and no padding and `flex flex-col gap-6`. Each `<li>` is a `flex flex-col gap-2` with an `<h3>` in `text-body` and one or two sentences in `text-body`:
  - "By train": to Market Fenley station. A minibus waits on the forecourt at 13:00 and 13:15, and brings you back at 22:30 and 23:30.
  - "By car": the postcode takes you to the gate on Saltry Lane. Park in the paddock, signposted from the lane; it is free.
  - "By taxi": Fenley Cars, 01632 960 881, the number a link in running text to `tel:+441632960881`. They have three cars, so book ahead for the evening.
  - "On foot": from The Wren and Wheel, five minutes along Saltry Lane, with a pavement all the way.

**Second part,** `md:col-span-5 md:col-start-8`: a pastel block in mist, as the layout notes describe it, a `<div>` in this section. The block element itself carries `bg-mist text-mist-foreground`, the pair from the first layout note, so its text stays plum in dark mode; nothing inside it gets a text color class of its own. In the block's `gap-6`: an `<h3>` in `text-h2`, "At a glance", then a `<dl>` of rows on a pastel block (`flex flex-col gap-3`, no rules). Each row is a `<div>` with `flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2`: the term, a `<dt>`, a label; the value, a `<dd>`, in `text-body` with `ml-auto text-right`. Where the two do not fit on one line (`Minibus from the station` in the narrow column), the value moves whole to a line of its own at the right, instead of being squeezed to a word per line. The rows: Postcode / `ZQ4 7HB`; Nearest station / `Market Fenley`; Parking / `Free, in the paddock`; Minibus from the station / `13:00 and 13:15`; Last minibus back / `23:30`. Each time is a `<time>`. The block holds no link: the numbers to call are in the first part.

### 5. Where to stay

A full-width section with its `aria-labelledby` pointing at the `<h2>`. It opens with a `flex flex-col gap-3` holding the `<h2>` "Where to stay" and one paragraph in `text-body` with `max-w-xl`: "Little Saltry is small, so book early. We have held the rooms at the inn until 1 May 2027.", the date a `<time dateTime="2027-05-01">`. Then, in the section's `gap-6`, a grid of three cards from the layout notes, each `md:col-span-4`, stacked below `md` in this order: a `<ul>` that carries the grid classes, each card a `<li>`. Each card, in its `gap-3`:

- A `flex flex-col gap-2` with a label in `text-muted-foreground` and the place's name as an `<h3>` in `text-h2`.
- One or two sentences in `text-body`.
- The price, a label in `text-foreground` with `tabular-nums`.
- Last, a `<p>` with `mt-auto` holding a link in running text, so the three links line up.

The three places:

1. `Inn · 6 rooms · A 5-minute walk`, "The Wren and Wheel": the pub on the green. All six rooms are held for guests until 1 May 2027 (a `<time>`); say you are coming to the wedding when you book. `From £95 a night`. Link: "Book a room", to `#`.
2. `Bed and breakfast · 4 rooms · Market Fenley`, "The Old Granary": in town, 15 minutes by car, and on the minibus route both ways. `From £80 a night`. Link: "Book a room", to `#`.
3. `Camping · Behind the barn`, "The top field": bring a tent and stay from Friday 16 July to Sunday 18 July (each date a `<time>`), with showers in the stable block. `Free`. Link: "Tell us you are camping", to `mailto:hello@clemandrafe.example`.

### 6. Questions and answers

A section in the centered column from the layout notes, with an `<h2>` "Questions and answers", then in the column's `gap-6` an `<Accordion multiple>` (add it with `npx shadcn@latest add accordion`) with six items, any number open at once (without `multiple`, Base UI opens one at a time), all closed when the page opens. Questions word for word, answers in one to three short sentences, each answer one `<p>` with `max-w-xl` inside the `AccordionContent`:

1. "Can we bring our children?": yes, if they are named on your invitation. There is a children's plate at dinner and a quiet room off the barn with blankets and books.
2. "Is the barn step-free?": the barn, the toilets and the lawn are; the orchard is on a gentle slope with a mown path.
3. "What if it rains?": everything but the lawn games moves into the barn, which holds everyone. Bring a coat for the walk from the paddock.
4. "Can I take photos?": not during the ceremony, please. From the drinks on, take as many as you like.
5. "Can the kitchen cook around an allergy?": yes. Tell us in the note when you reply, and the kitchen plans a plate for you. "When you reply" is a link in running text to `/rsvp`.
6. "When does it end?": the band stops at 23:15 and the last minibus leaves at 23:30. Brunch on Sunday is for anyone still around.

The stock `Accordion` is off the type scale and its trigger is under 44px. In `components/ui/accordion.tsx`: on the trigger, replace `items-start` with `items-center`, its stock vertical padding with `py-3` and its small text size with `font-sans text-body` (the questions read as body text, unlike the timeline's `<h3>` titles in the heading font), and add `min-h-11 gap-3` (its `font-medium` stays); on the content, replace the small text size with `text-body`, and on its inner element the stock bottom padding with `pb-3` (its `pt-0` stays) and `[&_a]:underline-offset-3` with `[&_a]:underline-offset-4`, the offset of a link in running text, and its stock 16px margin between paragraphs, which is off the spacing scale, with `[&_p:not(:last-child)]:mb-3`. Every item has its 1px line under it, the last one too: on the item, replace the stock `not-last:border-b` with `border-b border-border`. Both chevron icons get `strokeWidth={1.5}`. The trigger keeps its stock corner, which only shows in its focus outline, and its ring classes are replaced as the rules say.

### 7. Footer

The footer from the layout notes.

### Behavior

- The accordion opens and closes as it ships. Nothing else on the page has state.
- This page has no form and no main action, so it has no default button. It has no secondary button either; make the `secondary` hover edit in `button.tsx` anyway, as the notes say.
- The links go to their addresses and need no other behavior.
