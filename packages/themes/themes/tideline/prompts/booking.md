---
page: lesson booking form
title: Book a lesson
description: the booking form of a surf school, with a lesson, a date, the number of people, their ability, a name, an email, a phone number and a note, checked in code, a summary beside it whose total follows the choices, and a confirmation that replaces the form.
order: 4
checks:
  - "The lesson and the ability are native selects whose first option is an empty choice in words, and the date is a date field whose earliest day is today on the visitor's clock."
  - "The number of people is set with minus and plus buttons from 1 to 4, each with an aria-label, and the value is announced with its noun, 1 person or 2 people."
  - "The summary's total is the lesson's price times the number of people and follows both: First Waves for 2 people reads £84, and with no lesson chosen it reads £0."
  - "Sending the empty form gives the lesson, the date, the ability, the name, the email and the phone each their own error line with an icon, tied to its field, and focus moves to the lesson select."
  - "A good booking replaces the form, inside the same card, with a confirmation that repeats the lesson, the date, the number of people and the total, a screen reader announces it, and focus moves to its heading."
  - "The opening block element carries bg-lagoon text-lagoon-foreground and the promise block element bg-coral text-coral-foreground, so their text stays deep-sea ink in dark mode, and every field and button stands on a card or on the sand."
---

Sample content, if the user gave none: booking a lesson with "Sandhopper Surf School" at Pentarrow Sands. Three lessons: First Waves (beginners, 2 h, £42 a person), Green Waves (improvers, 2 h 30 min, £55 a person) and Private Coaching (any level, 1 h 30 min, £85 a person). One booking online covers 1 to 4 people; bigger groups book by phone on 01632 960 418. Nothing is paid online: the total is paid at the Boat Shed on the day, by card or cash. The start time is set by the tide, between 09:00 and 15:00, and emailed by 18:00 the day before. The school decides by 07:30 on the day whether the sea is safe; a lesson it calls off is moved or refunded in full.

Build these parts in order.

### 1. Header

The header from the layout notes, with "Book" as the current page; its link keeps `/booking`.

### 2. Opening

A full-width section that is a color block in lagoon, as the layout notes describe it, with its `aria-labelledby` pointing at the `<h1>`. The block element itself carries `bg-lagoon text-lagoon-foreground`, the pair from the first layout note, so its text stays ink in dark mode; nothing inside it gets a text color class of its own. It holds one `flex flex-col gap-4`: a heading group, the label `Lessons every day · Pay on the day` over the `<h1>` "Book a lesson" in `text-h1 md:text-display`, and one paragraph in `text-body` with `max-w-xl`: "Choose a lesson and a date, tell us who is coming, and we hold your places. It takes two minutes, and you pay at the Boat Shed on the day."

### 3. The form and your booking

A section of parts side by side, from the layout notes, with its `aria-labelledby` pointing at the `<h2>` "Your lesson".

**First part,** `md:col-span-7`: a `flex flex-col gap-6` with the `<h2>` "Your lesson" and the form card, as the Forms note describes it. Add the fields with `npx shadcn@latest add input textarea` if the project has none, and give the new files the edits the Added components note lists. This page uses the `outline` variant and `focusableWhenDisabled`, so it makes both of those edits in `button.tsx`, as well as the `secondary` one. The `<form>` has the `aria-label` "Book a lesson". Its fields, in this order, each in its own `flex flex-col gap-2`:

1. **Lesson**: the label "Lesson", then a native `<select>` styled as the layout notes describe, with the empty choice "Choose a lesson" and three options, each its plain text: `First Waves · Beginners · £42 a person`, `Green Waves · Improvers · £55 a person`, `Private Coaching · Any level · £85 a person`.
2. **Date**: the label "Date", an `Input` of type `date` with `min` set to today on the visitor's clock, and the helper text `We set the start time by the tide and email it to you the day before.` `min` only limits the picker: a date typed before it still reaches the check.
3. **People**: a label as a `<p>` with an `id`, "People", in `font-mono text-label uppercase text-foreground` (a `<label>` needs a field to point at; this one names the group), then a stepper from the layout notes, from 1 to 4, starting at 1. The value reads `1 person`, `2 people` and so on. The buttons' `aria-label`s are "Fewer people" and "More people". Under it the helper text `Up to 4 people online. For a bigger group, call 01632 960 418.`, named in the group's `aria-describedby`.
4. **Ability**: the label "Surfing so far", then a native `<select>` with the empty choice "Choose the closest" and four options: `Never surfed`, `One or two lessons`, `Catching white water waves alone`, `Riding unbroken waves`. Under it the helper text `For a group, choose for the least experienced person.`
5. **Name**: the label "Your name", an `Input` with `autoComplete="name"`.
6. **Email and phone**, side by side from `md` up: a `grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start` whose two items are the fields' own stacks. The label "Email address", an `Input` of type `email` with `autoComplete="email"`, and the helper text `We send your start time here.` The label "Mobile phone", an `Input` of type `tel` with `autoComplete="tel"`, and the helper text `We text you if the sea changes our plans.`
7. **Note**: the label "A note for your coach (optional)", a `Textarea` with `maxLength={300}`, and the helper text `An old injury, nerves, a birthday: anything that helps us plan.`

The last item of the form is the page's one main action: the default `Button`, `type="submit"`, "Book my lesson", full width below `md` as the Forms note says. After the form, in the card, the empty `role="status"` element.

**Second part,** `md:col-span-4 md:col-start-9`: a card as an `<aside>` with `aria-labelledby` pointing at its `<h2>`, and `md:sticky md:top-6`, so it stays in view beside the form. Below `md` it comes after the form card. In the card's `gap-4`:

- The `<h2>` "Your booking".
- Rows from the layout notes, a `<dl>` with four rows that read from the form:
  - `Lesson`: the lesson's name alone, `First Waves`; before one is chosen, `Not chosen yet`.
  - `Date`: the date written out, `Saturday 19 June 2027`, in a `<time>` with the field's value as its `dateTime`; while the field is empty, `Not chosen yet`.
  - `People`: as the stepper writes it, `2 people`.
  - `Price`: `£42 a person`, with `tabular-nums`; before a lesson is chosen, `Not chosen yet`.
- The total line: a `<div>` with `flex items-baseline justify-between gap-6 border-t border-border pt-4`, holding a label in `text-foreground`, `Total`, and the total as a `<p>` in `font-heading text-h2 text-foreground tabular-nums`: the lesson's price times the number of people, `£84`. Before a lesson is chosen it reads `£0`.
- A `<p>` of small print in `text-muted-foreground`: "Wetsuit, board and coach included. Pay at the Boat Shed on the day, by card or cash."

The summary is not a live region: the stepper already announces its value, and the confirmation says the total.

### 4. What happens next

A full-width section with its `aria-labelledby` pointing at the `<h2>`. It opens with the `<h2>` "What happens next". Then, in the section's `gap-6`, a row of three from the layout notes, as an `<ol>` with no markers and no padding that carries the grid classes. The three steps stand on the sand, not in cards. Each `<li>` is `flex flex-col gap-2 border-t border-border pt-4`, holding the step's number as a `<p>` in `font-heading text-h1 text-foreground` with `aria-hidden="true"` (the list already counts), an `<h3>` in `text-h2`, and one or two sentences in `text-body`:

1. `1`, "We hold your places": "As soon as you send the form, your places are yours. Nothing is paid online."
2. `2`, "We set the time": "By 18:00 the day before, we email your start time. The tide decides it: somewhere between 09:00 and 15:00.", each time a `<time>`.
3. `3`, "You come 20 minutes early": "Find us at the Boat Shed at the foot of the slipway. You pay, we fit your wetsuit, and we walk down to the water together."

### 5. If the sea says no

A full-width section that is a color block in coral, as the layout notes describe it, with its `aria-labelledby` pointing at its `<h2>`. The block element itself carries `bg-coral text-coral-foreground`; nothing inside it gets a text color class of its own. It holds one `flex flex-col gap-4`: a heading group, the label `Our weather promise` over the `<h2>` "If the sea says no, you choose", and one paragraph in `text-body` with `max-w-xl`: "We decide by 07:30 on the day whether the sea is safe. If we call your lesson off, you pick another date or get all of your money back.", the time a `<time>`. The block holds no link and no button.

### 6. Footer

The footer from the layout notes.

### Behavior

- Keep every value in component state: the lesson, the date, the number of people, the ability, the name, the email, the phone and the note. The summary reads from the same state, so its rows and its total follow each change as it is made.
- The date in the summary is written from the field's `YYYY-MM-DD` value as the layout notes write a date, weekday first and with no comma. Read the value as a local date from its three numbers, not with `new Date(value)`, which reads it as UTC and can give the day before.
- When the form is sent, check it in code, in this order:
  - Lesson: the empty choice gives "Choose a lesson."
  - Date: empty gives "Choose a date."; a date before today gives "Choose today or a later date." Compare dates as the `YYYY-MM-DD` strings a date field gives, with today taken from the visitor's clock in their own time zone.
  - The number of people is always valid, since the stepper cannot leave 1 to 4.
  - Ability: the empty choice gives "Choose the closest match, so we can plan the lesson."
  - Name: empty, or only spaces, gives "Write your name."
  - Email: empty gives "Write your email address, so we can send your start time."; a malformed one gives "Check the email address: it needs an @ and a domain."
  - Phone: empty gives "Write a mobile number we can text on the day."; fewer than 10 digits, counting digits only and allowing spaces, `+` and `-`, gives "Check the mobile number: it needs at least 10 digits."
  - The note is optional and never gets an error.
- Each error line follows the layout notes, which say when it shows, when it goes and how focus reaches it. Focus moves to the first field with an error in the order of the form.
- When everything is good, the form is replaced in its card by the confirmation in the status element: an `<h3>` in `text-h2`, "Your places are held, Imogen Tarrant" (the name as typed, trimmed), with `tabIndex={-1}`; then a sentence that repeats the booking: "We have 2 people down for First Waves on Saturday 19 June 2027. The total is £84, to pay at the Boat Shed on the day.", the count written as the stepper writes it, the lesson by its name alone, and the date in a `<time>`; then a sentence: "We will email your start time to imogen@example.com by 18:00 the day before. To change anything, call 01632 960 418.", with the address they typed, the time a `<time>` and the number a link in running text to `tel:+441632960418`. The heading and the sentences sit in the message `<div>`; no button follows. Move focus to the heading. The card "Your booking" stays as it is.
- The other links need no behavior.
