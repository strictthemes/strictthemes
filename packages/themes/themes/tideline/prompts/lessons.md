---
page: surf lessons and prices page
title: Lessons
description: the lessons and prices of a surf school, with three lesson cards that give the level, the length, the group size, the price and what is included, a table of kit hire prices, and a few questions and answers.
order: 2
checks:
  - "Each of the three lesson cards has exactly one orange badge with its level, a description list with its length, group size and ages, a list of what is included, and its price in whole pounds."
  - "The three Book this lesson buttons are sun-yellow secondary links to /booking, each with an aria-label that names its lesson, and Book a lesson is the only default button on the page."
  - "The kit hire prices are a table of six rows whose header cells have scope col, inside a box that scrolls sideways at 375px, can be reached with the keyboard and has an aria-label."
  - "The questions are headings with their answers under them as plain text, all visible, with no accordion."
  - "The opening block element carries bg-lagoon text-lagoon-foreground and the closing block element bg-coral text-coral-foreground, so their text stays deep-sea ink in dark mode, and the blocks hold no link, button or badge."
---

Sample content, if the user gave none: the lessons and prices of "Sandhopper Surf School" at Pentarrow Sands for 2027. Three lessons, each with a wetsuit, a board and a coach in the water: First Waves for beginners, £42 a person; Green Waves for improvers, £55 a person; Private Coaching at any level, £85 a person. Kit can be hired from the Boat Shed without booking, for 2 hours, a half day (4 hours) or a full day (08:30 to 18:00). Lessons can be moved free of charge up to 48 hours before; the school decides by 07:30 on the day whether the sea is safe, and a lesson it calls off is moved or refunded in full. Write any other copy yourself, plain and friendly.

Build these parts in order.

### 1. Header

The header from the layout notes, with "Lessons" as the current page; its link keeps `/lessons`.

### 2. Opening

A full-width section that is a color block in lagoon, as the layout notes describe it, with its `aria-labelledby` pointing at the `<h1>`. The block element itself carries `bg-lagoon text-lagoon-foreground`, the pair from the first layout note, so its text stays ink in dark mode; nothing inside it gets a text color class of its own. In the block's `gap-6`, two groups:

- A `flex flex-col gap-4` holding a heading group, the label `Sandhopper Surf School · 2027` over the `<h1>` "Lessons and prices" in `text-h1 md:text-display`, and then one paragraph in `text-body` with `max-w-xl`: "Every lesson includes a wetsuit, a board and a coach in the water with you. We set the start time by the tide and email it to you the day before."
- Three facts, a `<ul>` with no markers and no padding and `flex flex-wrap gap-x-6 gap-y-2`, each `<li>` a label: `From £42 a person`, `Groups of 8 or fewer`, `Free to move up to 48 hours before`.

### 3. The lessons

A full-width section with its `aria-labelledby` pointing at the `<h2>`. It opens with the `<h2>` "Choose a lesson". Then, in the section's `gap-6`, a row of three from the layout notes, as a `<ul>` with no markers and no padding that carries the grid classes. Add the badge with `npx shadcn@latest add badge` if the project has none. Each `<li>` is a card from the layout notes. In the card's `gap-4`:

- The badge from the layout notes, with the level.
- The lesson's name as an `<h3>` in `text-h2`.
- Two sentences in `text-body`.
- Rows from the layout notes, a `<dl>` with three rows: `Length`, `Group` and `Ages`.
- A `flex flex-col gap-2` with a label in `text-muted-foreground`, `Included`, and a `<ul>` with no markers and no padding and `flex flex-col gap-2`. Each `<li>` is `flex items-start gap-2`: the `Check` icon with `mt-1 shrink-0`, as the Icons note says, and one line in `text-body`.
- Last, with `mt-auto`, the card's foot, so the three feet line up: a `flex flex-col gap-4 border-t border-border pt-4` holding the price as a large figure in `text-h2` (`£42` and the unit `a person`) and an `<a href="/booking">` styled as a `secondary` button with `w-full`, "Book this lesson", with an `aria-label` that adds the lesson's name: "Book this lesson: First Waves". These are not the page's main action: there are three of them, so they are sun yellow.

The three lessons, word for word:

1. Badge `Beginners`, "First Waves": "For anyone who has never stood on a board. You learn to read the water, paddle, and get to your feet in waist-deep white water." Length `2 h`; Group `Up to 8 per coach`; Ages `8 and up`. Included: "Wetsuit, boots and a soft foam board", "Twenty minutes on the sand before you get wet", "A coach in the water beside you". `£42`.
2. Badge `Improvers`, "Green Waves": "For surfers who can stand up in white water. You paddle out the back, catch unbroken waves and learn to turn along them." Length `2 h 30 min`; Group `Up to 6 per coach`; Ages `12 and up`. Included: "Wetsuit and a board matched to you", "Video of your waves, sent the same day", "A plan for practising on your own". `£55`.
3. Badge `Any level`, "Private Coaching": "One coach for you, your family or a few friends, at your pace. Good for nervous starters and for fixing one stubborn habit." Length `1 h 30 min`; Group `1 to 4 people`; Ages `6 and up`. Included: "Wetsuit and board for everyone", "Your own coach for the whole session", "A start time that suits you and the tide". `£85`.

### 4. Kit hire

A section of parts side by side, from the layout notes, with its `aria-labelledby` pointing at the `<h2>` "Kit hire". Here the parts stand side by side only from `lg`: write `lg:` in place of `md:` in the grid's classes and in the spans (`grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-6 lg:items-start`).

**First part,** `lg:col-span-8`: a `flex flex-col gap-6` holding a `flex flex-col gap-4` with the `<h2>` "Kit hire" and one paragraph in `text-body` with `max-w-xl`: "Surfed before? Hire what you need from the Boat Shed, with no need to book. Prices are for one item.", and then the table in its card, as the Tables note describes it, with `label="Kit hire"`. Four columns: Item, 2 hours, Half day, Full day. Six rows, the item in `text-body` and the three prices with `tabular-nums`:

| Item | 2 hours | Half day | Full day |
|---|---|---|---|
| Foam surfboard, 7 to 9 ft | £10 | £15 | £22 |
| Hard surfboard, 6 to 9 ft | £14 | £20 | £28 |
| Wetsuit, summer or winter | £6 | £9 | £12 |
| Bodyboard | £5 | £8 | £10 |
| Boots and gloves | £3 | £4 | £5 |
| Foam board and wetsuit together | £14 | £21 | £30 |

At 375px the table is wider than the page and scrolls sideways inside its box, which the edit in `table.tsx` makes reachable with the keyboard; the page itself does not scroll sideways.

**Second part,** `lg:col-span-4`: a card from the layout notes. In the card's `gap-4`: an `<h3>` in `text-h2`, "How hire works", then rows from the layout notes, a `<dl>` with four rows: `Half day` / `4 hours`; `Full day` / `08:30–18:00`, each time a `<time>`; `Deposit` / `A bank card or a car key`; `Sizes` / `Wetsuits from age 4 to XXL`.

### 5. Good to know

A section of parts side by side, from the layout notes, with its `aria-labelledby` pointing at the `<h2>` "Good to know".

**First part,** `md:col-span-4`: a `flex flex-col gap-4` with the `<h2>` "Good to know" and one paragraph in `text-body`: "Not answered here? Call us on 01632 960 418.", the number a link in running text to `tel:+441632960418`.

**Second part,** `md:col-span-8`: the questions, a `<ul>` with no markers and no padding and `divide-y divide-border`. Each `<li>` is `flex flex-col gap-2 py-6 first:pt-0 last:pb-0`, holding the question as an `<h3>` in `text-body font-bold` and the answer as one paragraph in `text-body` with `max-w-xl`. They are plain text, all visible: no accordion. Five of them, word for word:

1. "Do I need to be able to swim?": "Yes, a little: 50 metres in a pool is enough. Beginners' lessons stay in water no deeper than your waist."
2. "What should I bring?": "Swimwear, a towel and a bottle of water. We lend you the wetsuit, the boots and the board, and there are hot showers at the Boat Shed."
3. "What if the sea is too rough or too flat?": "We decide by 07:30 on the day. If we call a lesson off, you choose another date or a full refund.", the time a `<time>`.
4. "Can I move my booking?": "Yes, free of charge up to 48 hours before the lesson. After that we keep half the price, unless we can fill your place."
5. "How old do children need to be?": "Eight for First Waves, twelve for Green Waves, and six for Private Coaching with a parent in the water."

### 6. Ready to get in?

A full-width section, with its `aria-labelledby` pointing at the `<h2>` in the block. It holds a color block in coral, a `<div>`, and after it, on the sand, the action.

**The block,** as the layout notes describe it. The block element itself carries `bg-coral text-coral-foreground`; nothing inside it gets a text color class of its own. It holds one `flex flex-col gap-4`: a heading group, the label `Every day of the year` over the `<h2>` "Ready to get in?", and one paragraph in `text-body` with `max-w-xl`: "Most days have places until the evening before. In July and August, book a week ahead."

**The action,** a row on the sand (`flex flex-wrap items-center gap-4`): the page's one main action, an `<a href="/booking">` styled as a default button, "Book a lesson", full width below `md` (`w-full md:w-auto`); and beside it a `<p>` in `text-body` holding a link in running text, "Check the forecast first", to `/forecast`.

### 7. Footer

The footer from the layout notes.

### Behavior

- The page is static: no state, no form and no script beyond what the stock components bring.
- The buttons and the links go to their addresses and need no other behavior. No button on this page disables itself, and none is an `outline` button, so `button.tsx` needs only the `secondary` hover edit.
