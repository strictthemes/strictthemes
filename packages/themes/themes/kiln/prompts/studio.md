---
page: studio page
title: Studio
description: the about page of a small ceramics studio, with its story, the people, the process in steps, opening hours and address, and a contact form.
order: 5
checks:
  - The avatars are the only round shapes on the page, and each one shows initials, not an image.
  - The process is an ordered list, and each step says in mono figures how long it takes.
  - The opening hours are a description list (`<dl>`) with a `<time>` for every time, and the address is an `<address>` that is not italic.
  - Each empty or wrong field of the contact form gets its own message in words with an icon, focus goes to the first of them, and a good message is replaced by a confirmation that takes focus.
  - The "Send message" button is the page's only terracotta button.
  - '"What it is about" is the theme''s `Select`, with no native `<select>` on the page: its trigger is as tall as the inputs above it and its text starts on their line, its list opens under it as ruled rows in the theme''s colors, and the chosen row has a check.'
---

Sample content, if the user gave none: "Whitlow Pottery", a stoneware studio at Unit 3, Coldharbour Yard, Bramwick BW4 2LT, in a dairy that closed in 1994. Nell Varga and Tomas Reid started it in 2019 with one wheel and a borrowed electric kiln; in 2021 they built a gas kiln in the yard. Ines Okafor joined in 2024 to pack orders and teach the Saturday class. The studio is open Thursday to Saturday, 10:00 to 16:00, and closed from 24 December to 2 January. Write the rest of the copy yourself, plain and specific.

Build these parts in order.

### 1. Header

The header from the layout notes. "Studio" is the current page. The basket holds 3 pieces.

### 2. Story

The first section of `<main>`, a 12-column grid with `md:items-start`.

- Columns 1–7: a label in `text-muted-foreground`, "The studio"; with `mt-2` the `<h1>` in `text-h1`, one sentence that says what the place is: "Two potters, one gas kiln and an old dairy in Bramwick"; then three paragraphs, the first with `mt-6` and the others `mt-4` apart: how it started, what they make and why in small batches, and what changed when the gas kiln was built. The third paragraph has one running-text link, "See what came out of the last firing", to `/`.
- Columns 9–12: a `<figure>` as the Pictures note says; its picture element is `aspect-4/5` with `rounded-xl border bg-muted`, showing the kiln drawn as one plain element, `h-3/5 w-1/2`, filled and outlined as a dark piece: `bg-glaze-dark border border-foreground/40`, square corners. Its `aria-label` is "The gas kiln in the yard, drawn as a block", and its caption "The gas kiln, built in 2021". Below `md` the figure comes under the text with `mt-10 md:mt-0`.

### 3. The people

The `<h2>` "The people". Then with `mt-6` a `<ul>` of three people, `grid gap-y-10 md:grid-cols-3 md:gap-x-6`, no markers. Each person is an `<li>`:

- A row, `flex items-center gap-4`: an avatar as the Avatars note says (NV, TR, IO), and beside it the name as an `<h3>` in `font-sans text-body font-medium` with, under it with `mt-1`, the role as a label in `text-muted-foreground`: "Potter, co-founder", "Glazes and kiln, co-founder", "Orders and the Saturday class".
- With `mt-4` two sentences about the person: Nell throws the tableware and keeps the glaze notebooks; Tomas mixes the glazes and fires the kiln; Ines packs every order and runs the Saturday class.

### 4. The process

A section with the `id` `process` and `scroll-mt-10`. The `<h2>` "From clay to kiln", then with `mt-4` one sentence: a piece takes about three weeks from a bag of clay to the shop. Then with `mt-6` an ordered list (`<ol>`) of five steps, with no markers and no padding. Each step is an `<li>` with a 1px top border and `py-6`, the last also with a 1px bottom border, laid out as `md:grid md:grid-cols-12 md:gap-x-6`:

- Columns 1–3: the step as a label (a `<p>`) in `text-muted-foreground`, `Step 1`, and with `mt-1` how long it takes, a label (a `<p>`) in `text-foreground` with `tabular-nums`: `1 hour`, `20 minutes a piece`, `7 days`, `1 day`, `2 days`.
- Columns 4–12: the step's name as an `<h3>` in `font-sans text-body font-medium`, and with `mt-2` one paragraph of two sentences. Below `md` this part sits under the labels with `mt-4 md:mt-0`.

The steps: Wedging the clay; Throwing on the wheel; Trimming and drying; The bisque firing, to 1,000°C; Glazing and the glaze firing, to 1,260°C. Temperatures in the text are part of a sentence and stay in the body font.

### 5. Visit

The `<h2>` "Visit the studio". Then with `mt-6` a 12-column grid:

- Columns 1–5: the address as an `<address>` with `not-italic`, three lines split by `<br />`: "Whitlow Pottery", "Unit 3, Coldharbour Yard" and "Bramwick BW4 2LT". Here, unlike the footer's, it opens with the name. With `mt-4` one paragraph: the yard has three parking spaces, the door is step-free, and the shop shelf is by the kiln.
- Columns 7–12: a label in `text-muted-foreground`, "Opening hours", then with `mt-2` a `<dl>` as the Description lists note says, with seven rows, Monday to Sunday. The `<dd>` is body text: "Closed", or the hours, "10:00 to 16:00", where only the two times are `<time>` elements with `dateTime`, each `font-mono tabular-nums`, and the "to" stays in the body font. Saturday adds, under the hours, "class 10:00 to 12:00": a label in `text-muted-foreground` in a `<span>` with `block`, its two times also `<time>` elements. Under the list, with `mt-4`, helper text: "Closed from 24 December to 2 January, both days included.", with the dates as two `<time>` elements (`2026-12-24`, `2027-01-02`). Below `md` this column comes under the address with `mt-10 md:mt-0`.

### 6. Write to us

A section with the `id` `contact`, a 12-column grid. Columns 1–7: the `<h2>` "Write to us", then with `mt-4` one sentence: Nell reads every message and answers within two working days, and commissions are booked from February. Then with `mt-6` the wrapper that holds the form and the status element. Add `Input` and `Textarea` with `npx shadcn@latest add input textarea`. The form's fields are `mt-6` apart:

- "Your name": an `Input` with `autoComplete="name"`.
- "Email address": an `Input` of type `email` with `autoComplete="email"`.
- "What it is about": a `Select` as the Selects note says, with nothing chosen to start and the prompt "Choose one", and four choices: A commission, An order, The Saturday class and Something else.
- "Message": a `Textarea` with `min-h-40`.
- The default button "Send message", `type="submit"`. It is the page's one terracotta button.

### 7. Footer

The footer from the layout notes.

### Behavior

- When the form is sent, each field is checked and each problem gets its own error line: "Enter your name.", "Enter an email address, like name@example.com.", "Choose what your message is about." and "Write a little more: at least 20 characters." Focus moves to the first field with an error. An error line goes away as the Errors note says.
- When all four are good, the form is replaced by the confirmation: "Thank you. Nell will answer within two working days." It takes focus, as the Confirmations note says.
- The "Menu" button opens and closes the small-screen menu and sets `aria-expanded`; Escape closes it as the notes say.
- The other links need no behavior.
