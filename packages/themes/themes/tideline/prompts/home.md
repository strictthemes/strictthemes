---
page: surf school home page
title: Home
description: the home page of a surf school, with an opening block of color and one action to book, today's conditions as a strip of labelled figures, three lessons with their prices, and where to find the school.
order: 1
checks:
  - "The opening is one coral block holding the page's only h1, one sentence and three facts, and it holds no link, button, field, badge or icon."
  - "Book a lesson is the only default button on the page, it is a link to /booking, and it stands on the sand right after the opening block, not on it."
  - "Today's conditions are a description list of four facts on a lagoon block (tide, swell, wind, water), each a label over a large figure in the heading font with its unit beside it."
  - "The opening block element carries bg-coral text-coral-foreground and the conditions block element bg-lagoon text-lagoon-foreground, so in dark mode their text is still deep-sea ink, and no element inside them has text-foreground, text-muted-foreground or text-primary."
  - "Each of the three lesson cards has one orange badge with its level, its length, group size and ages as a small figure, and its price in whole pounds."
  - "At 375px the heading, the four figures and the address rows fit inside their boxes, and the page does not scroll sideways."
---

Sample content, if the user gave none: "Sandhopper Surf School", which teaches on Pentarrow Sands, a mile of west-facing sand on the Tolven coast, from the Boat Shed at the foot of the slipway. Three lessons: First Waves (beginners, £42 a person), Green Waves (improvers, £55 a person) and Private Coaching (any level, £85 a person). Today is Thursday 17 June 2027, and the conditions were updated at 06:40: low water at 13:34 (1.5 m), high water at 19:41, a 3 ft swell from the west at 9 s, an 8 mph offshore wind from the east, the water at 15 °C. The Beach Road car park is a four-minute walk from the Boat Shed and costs £5 a day. Write any other copy yourself, plain and friendly, with no superlatives.

Build these parts in order.

### 1. Header

The header from the layout notes. No link is the current page here: the name is the link home.

### 2. Opening

A full-width section, with its `aria-labelledby` pointing at the `<h1>`. It holds two things: a color block in coral, a `<div>`, and after it, on the sand, the action.

**The block,** as the layout notes describe it. The block element itself carries `bg-coral text-coral-foreground`, the pair from the first layout note, so its text stays ink in dark mode; nothing inside it gets a text color class of its own. Here, in place of the block's `md:p-10`, it has `md:px-10 md:py-24`, so it stands like a painted sign. In the block's `gap-6`, two groups:

- A `flex flex-col gap-4` holding a heading group, the label `Pentarrow Sands · Tolven coast` over the `<h1>` "Learn to surf at Pentarrow Sands" in `text-h1 md:text-display`, and then one paragraph in `text-body` with `max-w-xl`: "Small groups, patient coaches and a wide sandy beach with gentle waves. Every lesson includes your wetsuit and your board."
- Three facts, a `<ul>` with no markers and no padding and `flex flex-wrap gap-x-6 gap-y-2`, each `<li>` a label: `Lessons from £42`, `Ages 6 and up`, `Every day of the year`.

**The action,** a row on the sand (`flex flex-wrap items-center gap-4`): the page's one main action, an `<a href="/booking">` styled as a default button, "Book a lesson", full width below `md` (`w-full md:w-auto`); and beside it a `<p>` in `text-body` holding a link in running text, "See the lessons and prices", to `/lessons`.

At 375px the heading wraps onto three or four lines and stays inside the block.

### 3. Today's conditions

A full-width section, with its `aria-labelledby` pointing at the `<h2>` in the block. It holds a color block in lagoon, a `<div>`, and after it, on the sand, one line.

**The block,** as the layout notes describe it. The block element itself carries `bg-lagoon text-lagoon-foreground`; nothing inside it gets a text color class of its own. In the block's `gap-6`:

- A heading group: the label `Thursday 17 June 2027 · Updated 06:40`, the date a `<time dateTime="2027-06-17">` and the time a `<time dateTime="06:40">`, over the `<h2>` "Today at the beach".
- The conditions, as the Conditions note describes them, with the figures in `text-h1`. Four facts, in these words:
  1. `Tide`: the figure `13:34`, a `<time dateTime="13:34">`, with the unit `low`; the note `1.5 m · High at 19:41`, its time a `<time>` too.
  2. `Swell`: the figure `3` with the unit `ft`; the note `9 s · From the west`.
  3. `Wind`: the figure `8` with the unit `mph`; the note `East · Offshore`.
  4. `Water`: the figure `15` with the unit `°C`; the note `Summer wetsuit`.
- One paragraph in `text-body` with `max-w-xl`: "Clean, waist-high waves and a light offshore wind. A good day for a first lesson, best in the two hours either side of low water."

**The line,** a `<p>` in `text-body` on the sand: "Planning ahead? See the five-day forecast.", with "the five-day forecast" as a link in running text to `/forecast`.

At 375px the four facts stand two to a row, and a unit that does not fit beside its figure wraps under it.

### 4. Three lessons

A full-width section with its `aria-labelledby` pointing at the `<h2>`. It opens with a `flex flex-col gap-4` holding the `<h2>` "Three ways to start" and one paragraph in `text-body` with `max-w-xl`: "We set the start time by the tide, between 09:00 and 15:00, and email it to you by 18:00 the day before.", each time a `<time>`. Then, in the section's `gap-6`, a row of three from the layout notes, as a `<ul>` with no markers and no padding that carries the grid classes. Add the badge with `npx shadcn@latest add badge` if the project has none. Each `<li>` is a card from the layout notes. In the card's `gap-4`:

- The badge from the layout notes, with the level.
- A `flex flex-col gap-2` with the lesson's name as an `<h3>` in `text-h2` and, under it, a small figure with the length, the group and the ages.
- One or two sentences in `text-body`.
- Last, with `mt-auto`, the card's foot, so the three feet line up: a `flex flex-col gap-4 border-t border-border pt-4` holding the price as a large figure in `text-h2` (`£42` and the unit `a person`), and a `<p>` in `text-body` with a link in running text to `/lessons`, "What is included", with an `aria-label` that adds the lesson's name: "What is included in First Waves".

The three lessons:

1. Badge `Beginners`, "First Waves", `2 h · Up to 8 per coach · Ages 8 and up`: "For anyone who has never stood on a board. You learn to read the water, paddle, and get to your feet in waist-deep white water." `£42`.
2. Badge `Improvers`, "Green Waves", `2 h 30 min · Up to 6 per coach · Ages 12 and up`: "For surfers who can stand up in white water and want to paddle out the back and ride along unbroken waves." `£55`.
3. Badge `Any level`, "Private Coaching", `1 h 30 min · 1 to 4 people · Ages 6 and up`: "One coach for you, your family or a few friends, at your pace. Good for nervous starters and for fixing one stubborn habit." `£85`.

### 5. Where to find us

A section of parts side by side, from the layout notes, with its `aria-labelledby` pointing at the `<h2>` "Find us on the sand".

**First part,** `md:col-span-7`: a `flex flex-col gap-6` holding two groups.

- A `flex flex-col gap-4` with the `<h2>` "Find us on the sand" and one paragraph in `text-body` with `max-w-xl`: "We work from the Boat Shed, the hut at the foot of the slipway. Park in the Beach Road car park and walk down past the café: it takes four minutes. Come 20 minutes before your lesson to get into your wetsuit."
- Rows from the layout notes, a `<dl>` on the sand with four rows:
  - `Address`: an `<address className="not-italic">` with three block `<span>`s, `The Boat Shed, Beach Road`, `Pentarrow Sands`, `ZP7 3SB`.
  - `Open`: `Every day, 08:30–18:00`, each time a `<time>`.
  - `Parking`: `Beach Road car park, £5 a day`.
  - `Phone`: `01632 960 418`, a link in running text to `tel:+441632960418`.

**Second part,** `md:col-span-4 md:col-start-9`: a card from the layout notes. In the card's `gap-4`: an `<h3>` in `text-h2`, "What to bring", then a `<ul>` with no markers and no padding and `flex flex-col gap-4`. Each `<li>` is `flex items-start gap-2`: the `Check` icon with `mt-1 shrink-0`, as the Icons note says, and one line in `text-body`:

- Swimwear to wear under the wetsuit
- A towel and something warm for afterwards
- Sun cream, also on a grey day
- A bottle of water

Then, after the list, a `<p>` of small print in `text-muted-foreground`: "We lend you the wetsuit, the boots and the board."

### 6. Footer

The footer from the layout notes.

### Behavior

- The page is static: no state, no form and no script beyond what the stock components bring.
- The conditions are the fixed sample above. Nothing on this page reads the visitor's clock.
- "Book a lesson" and the links go to their addresses and need no other behavior. The page has no secondary and no outline button; make the `secondary` hover edit in `button.tsx` anyway, as the notes say.
