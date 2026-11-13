---
page: beach guide article
title: Beach guide
description: a long read about one beach by a surf school, with a list of facts to plan by (parking, lifeguards, the best state of tide, hazards), five sections with headings, one block of color holding a safety tip, and links to two other guides.
order: 5
checks:
  - "The facts are a description list of six rows, among them parking, lifeguards, the best state of tide and hazards, each term a mono label over its value, and below md they come before the article."
  - "The article has five sections, each with its own h2, in this order: The beach, When to surf, Staying safe, Getting there and parking, After your surf; and no paragraph is wider than max-w-xl."
  - "The safety tip is the page's one coral block, it stands in the article's column on the sand, not in a card, and it holds a label, a heading and a paragraph and no link, button or icon."
  - "The writer's avatar is a 44px circle with the initials TR, hidden from screen readers, beside the written name, and it is the only round thing on the page."
  - "Each of the two guide cards ends in a link whose words name its beach, and Book a lesson is the only default button on the page, on a card."
  - "The opening block element carries bg-lagoon text-lagoon-foreground and the safety tip element bg-coral text-coral-foreground, so their text stays deep-sea ink in dark mode, and nothing inside them has a text color class of its own."
---

Sample content, if the user gave none: the guide of "Sandhopper Surf School" to Pentarrow Sands, the beach it teaches on: a mile of west-facing sand on the Tolven coast, between the north rocks and the mouth of the Tolven stream. Written by Tamsin Rowe, the head coach, and updated on 3 June 2027. The Beach Road car park has 180 spaces and costs £5 a day. Lifeguards are on duty from 10:00 to 18:00 every day from 15 May to 26 September 2027. The beach is best for two hours either side of low water. Its hazards are a rip current beside the north rocks and weever fish in the shallows. The two other guides are to Skerrin Cove, 4 miles north, and Maddow Strand, 7 miles south. The article's words are given below; use them as they are.

Build these parts in order.

### 1. Header

The header from the layout notes, with "Guide" as the current page; its link keeps `/guide`.

### 2. Opening

A full-width section, with its `aria-labelledby` pointing at the `<h1>`. It holds two things: a color block in lagoon, a `<div>`, and after it, on the sand, the writer's line.

**The block,** as the layout notes describe it. The block element itself carries `bg-lagoon text-lagoon-foreground`, the pair from the first layout note, so its text stays ink in dark mode; nothing inside it gets a text color class of its own. It holds one `flex flex-col gap-4`: a heading group, the label `Beach guide · Tolven coast` over the `<h1>` "Pentarrow Sands" in `text-h1 md:text-display`, and one paragraph in `text-body` with `max-w-xl`: "A mile of west-facing sand with gentle, even waves: the best beach on this coast to learn on, and the one where our lessons run."

**The writer's line,** a row on the sand, `flex items-center gap-4`: the avatar from the layout notes with the initials `TR`, then a `flex min-w-0 flex-col gap-2` holding the name as a `<p>` in `text-body font-bold text-foreground`, "Tamsin Rowe", and under it a small figure: `Head coach · Updated 3 June 2027 · 6 minute read`, the date a `<time dateTime="2027-06-03">`.

### 3. The facts and the article

Here, in place of a section, the `<main>`'s item is a `<div>` with the grid classes of the layout notes' parts side by side (`grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-6 md:items-start`), holding two things, in this order in the code: the facts, an `<aside>`, and the article, an `<article>`. Below `md` the facts come first, so a visitor in the car park finds them without scrolling; from `md` up the article stands on the left and the facts on the right, placed by classes alone.

**The facts,** an `<aside>` with `md:col-span-4 md:col-start-9`, `flex flex-col gap-6` and the `aria-label` "Plan your visit", a name for both its cards. It holds two cards from the layout notes.

The first card, in its `gap-4`: an `<h2>` "At a glance", then rows from the layout notes, stacked, as the Rows note says: a `<dl>` with six rows, the term a label in `text-muted-foreground` over the value in `text-body text-foreground`. Word for word:

- `Parking`: "Beach Road car park, 180 spaces, £5 a day. Full by 10:30 on sunny weekends."
- `Lifeguards`: "On duty 10:00–18:00, every day from 15 May to 26 September 2027."
- `Best state of tide`: "Two hours either side of low water."
- `Hazards`: "A rip current beside the north rocks. Weever fish in the shallows at low water."
- `Facilities`: "Toilets and a tap at the car park. Hot showers at the Boat Shed, £1."
- `Dogs`: "Welcome from 1 October to 30 April, and on a lead on the slipway."

Every clock time in them is a `<time>`, and so are the lifeguards' two dates: `<time dateTime="2027-05-15">15 May</time>` and `<time dateTime="2027-09-26">26 September 2027</time>`. The dogs' dates come round every year and stay plain text.

The second card, in its `gap-4`: an `<h2>` "Learn on this beach", one paragraph in `text-body`: "Our lessons run here every day of the year, from £42 a person, wetsuit and board included.", and the page's one main action, an `<a href="/booking">` styled as a default button with `w-full`, "Book a lesson".

**The article,** an `<article>` with `md:col-span-7 md:col-start-1 md:row-start-1`, `flex flex-col gap-10` and the `aria-label` "Guide to Pentarrow Sands". It holds five sections. Each is a `<section>` with `aria-labelledby` pointing at its `<h2>` and `flex flex-col gap-4`: the `<h2>` first, then its paragraphs, each in `text-body` with `max-w-xl`. Word for word:

1. "The beach"
   - "Pentarrow Sands is a mile of pale sand facing due west, between the north rocks and the mouth of the Tolven stream. The beach shelves so gently that at low water you can walk two hundred metres out and still be waist deep."
   - "That gentle slope is why we teach here. Waves break early, lose their power and roll in as long lines of white water: easy to catch, soft to fall off, and much the same from one day to the next."
2. "When to surf"
   - "The beach is at its best for two hours either side of low water. The waves break over flat sand then, well away from the rocks, and there is room for everybody."
   - "At high water the sea reaches the pebble bank at the top of the beach and the waves break hard onto it. It is no place to learn, and our lessons never run then. Check the time of low water in the forecast before you set off.", with "the forecast" as a link in running text to `/forecast`.
   - A list in `text-body` with `max-w-xl`, a `<ul>` with `list-disc pl-6` and `flex flex-col gap-2`, of three lines: "A small swell, 1 to 3 ft: good for a first lesson." "A middling swell, 3 to 5 ft: good for improvers, out the back." "Over 5 ft, or a strong onshore wind: stay in the white water, or come another day."
3. "Staying safe"
   - "In season the lifeguards put out two kinds of flags. Swim and bodyboard between the red and yellow ones; surf between the black and white ones. If no flags are flying, nobody is watching the water."
   - The safety tip, described below.
   - "The one rip to know runs beside the north rocks, and is strongest in the hour after high water. Weever fish bury themselves in the warm shallows at low water in summer: wear wetsuit boots, and if one stings you, the lifeguards have hot water, which stops the pain."
4. "Getting there and parking"
   - "Follow Beach Road to its end, a mile and a half from the village of Pentarrow. The car park has 180 spaces and costs £5 a day; the machine takes cards and coins. On a sunny weekend in July or August it is full by 10:30.", the time a `<time>`.
   - "The number 14 bus from Tolven stops at the top of Beach Road once an hour, a ten-minute walk from the sand. There are bike racks beside the Boat Shed."
5. "After your surf"
   - "The Slipway Café opens at 08:00 and does a bacon roll for £4 and a hot chocolate that has rescued many a cold surfer. Rinse your kit at the tap by the car park, or take a hot shower at the Boat Shed for £1.", the time a `<time>`.

**The safety tip,** the second item of "Staying safe": a color block in coral, a `<div>`, as the layout notes describe it, as wide as the article's column (no `max-w-xl` on the block itself). The block element itself carries `bg-coral text-coral-foreground`; nothing inside it gets a text color class of its own. It holds one `flex flex-col gap-4`: a heading group, the label `Safety tip` over an `<h3>` in `text-h2`, "Caught in a rip? Float, then swim sideways", and one paragraph in `text-body` with `max-w-xl`: "A rip is a channel of water running out to sea. Do not swim against it. Lie back, raise one arm and shout. When the pull eases, swim along the beach until you are clear, then come in with the waves." It is the page's only coral block, it is not in a card, and it holds no link, button or icon.

### 4. More beach guides

A full-width section with its `aria-labelledby` pointing at the `<h2>`. It opens with the `<h2>` "More beach guides". Then, in the section's `gap-6`, two cards side by side from the layout notes (`grid grid-cols-1 gap-6 md:grid-cols-2`), as a `<ul>` with no markers and no padding that carries the grid classes. Add the badge with `npx shadcn@latest add badge` if the project has none. Each `<li>` is a card from the layout notes. In the card's `gap-4`:

- The badge from the layout notes, with who the beach suits.
- A `flex flex-col gap-2` with the beach's name as an `<h3>` in `text-h2` and, under it, a small figure with the distance and the tide.
- One or two sentences in `text-body` with `max-w-xl`.
- Last, with `mt-auto`, a `<p>` in `text-body` holding a link in running text to `#`, whose words name the beach.

The two guides:

1. Badge `Improvers`, "Skerrin Cove", `4 miles north · Best at mid tide`: "A small, steep cove that turns a modest swell into fast, hollow waves. For surfers who can already turn." Link: "Read the guide to Skerrin Cove".
2. Badge `All levels`, "Maddow Strand", `7 miles south · Best at low water`: "Three miles of open beach that picks up any swell going. Quiet, with no lifeguards, and best on small days." Link: "Read the guide to Maddow Strand".

### 5. Footer

The footer from the layout notes.

### Behavior

- The page is static: no state, no form and no script beyond what the stock components bring.
- The dates and the times are the fixed sample. Nothing on this page reads the visitor's clock.
- "Book a lesson" and the links go to their addresses and need no other behavior. The page has no secondary and no outline button; make the `secondary` hover edit in `button.tsx` anyway, as the notes say.
