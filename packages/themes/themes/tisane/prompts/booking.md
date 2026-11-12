---
page: booking page
title: Booking
description: a page to reserve a table at a tea room, with a form for the date, time, number of people, name, email and a note, a summary that follows the form, and a confirmation.
order: 3
checks:
  - The time is a native `<select>` whose first option is an empty choice in words, and the number of people is set with minus and plus buttons that each have an `aria-label`.
  - Sending the empty form gives the date, the time, the name and the email each their own error line with an icon, and focus moves to the date field.
  - A Monday, or a date before today, gets an error line that says why in words.
  - The summary card shows each value as soon as it is chosen or typed, and "Not chosen yet" for what is still missing.
  - After a good booking the form is replaced, inside the same card, by a confirmation that repeats the date, time, number of people and name, and focus moves to its heading.
---

Sample content, if the user gave none: booking a table at "The Linden Room", a tea room and shop at 14 Mill Lane, Ashby Wold. Open Tuesday to Sunday, closed on Mondays. Tables for one to eight people; larger groups write to hello@lindenroom.example. Bookings open 60 days ahead, and half the tables are kept for people who walk in. Times every half hour from 9:30 to 16:00. Write the rest of the copy yourself, plain and short.

Build these parts in order.

### 1. Header

The header from the layout notes, with "Book a table" as the current page; its link keeps `/booking`.

### 2. Opening

The first section, with `pt-10`, in columns 1–8 of a grid (`grid gap-6 md:grid-cols-12`): a label, `Tables for one to eight · Up to 60 days ahead`, then with `mt-2` the `<h1>` "Book a table" in `text-h1`, then with `mt-4` one or two sentences: half the tables are kept for walk-ins, and a booking is held for fifteen minutes.

### 3. Form and summary

A section with `mt-18`, as a grid (`grid gap-6 md:grid-cols-12 md:items-start`):

- In columns 1–7, a card that is the wrapper for the form and the confirmation. Add the fields with `npx shadcn@latest add input textarea` if the project has none, and give the new files the edits the Added components note lists. The stepper's buttons use `focusableWhenDisabled`, so this page makes the `data-disabled:` edit in `button.tsx`. The card holds the `<form>` (with `noValidate` and the `aria-label` "Book a table") and, after it, the empty `role="status"` element.
- In columns 8–12, the summary card. On a phone it comes after the form card.

The form's fields, in this order, each in its own `<div>`, `mt-6` apart, as the Forms note says:

1. **Date**: the label "Date", then an `Input` of type `date`, with `min` set to today and `max` to the date 60 days after today (from 11 November, that is 10 January); both of them can be booked. Today is the visitor's clock. `min` and `max` only limit the picker: a date typed outside them still reaches the check, so the code keeps both range messages below.
2. **Time**: the label "Time", then a native `<select>` styled as the layout notes describe. The first option is an empty choice, "Choose a time"; then every half hour from `9:30` to `16:00`, written as `9:30`, `10:00` and so on. An option holds plain text, not a `<time>`, and its value has two-digit hours: `<option value="09:30">9:30</option>`.
3. **Number of people**: a label in `font-mono text-label text-foreground` as a `<p>` with an `id`, "Number of people" (a `<label>` needs a field to point at; this one names the stepper), then with `mt-2` a stepper as the layout notes describe, from one to eight, starting at two. The value reads `1 person`, `2 people` and so on. The buttons' `aria-label`s are "Fewer people" and "More people". Under the stepper, with `mt-2`, a label in `text-muted-foreground`: `For nine or more, write to hello@lindenroom.example`, with the address as a link in running text to `mailto:hello@lindenroom.example`.
4. **Name**: the label "Name", then an `Input` with `autoComplete="name"`.
5. **Email**: the label "Email address", then an `Input` of type `email` with `autoComplete="email"`. Under it, with `mt-2`, a label in `text-muted-foreground`: `We send the booking here, and nothing else.` Where an error line shows, it comes after this label, also with `mt-2`, and the field's `aria-describedby` names both.
6. **Note**: the label "Note (optional)", then a `Textarea` with `min-h-24` and `maxLength={300}`. Under it, with `mt-2`, a label in `text-muted-foreground` that counts down: `300 characters left`, down to `1 character left` and `0 characters left`.

Then, in the notes' `<div>` with `mt-6`, the page's one default button, `type="submit"`: "Book the table".

### 4. Summary

The summary card is an `<aside>` with `aria-labelledby` pointing at its heading. Inside it:

- A label: `Your booking`.
- With `mt-2`, an `<h2>` "Summary".
- With `mt-6`, a `<dl>` with four rows: Date, Time, People, Name. Each row is a `<div>` with `flex items-baseline justify-between gap-4 py-2 first:pt-0` and the `<dl>` has `divide-y`: the Rows note, with a `<dl>` in place of the `<ul>`, and `first:pt-0` so the first row starts at the `mt-6`. The term, a `<dt>`, is a label in `text-muted-foreground`; the value, a `<dd>`, is `text-body text-foreground`, right-aligned with `text-right`. The date reads like `Saturday 14 November 2026`, inside a `<time>` with `dateTime="2026-11-14"`; the time is a `<time>` too, `<time dateTime="11:30">11:30</time>`. People reads `2 people`. A value that is still missing reads "Not chosen yet" in `text-muted-foreground`.
- With `mt-6`, one sentence in `text-body`: we hold the table for fifteen minutes, and a booking can be changed by answering the email.

The summary is not a live region: it changes with every keystroke, and announcing each one would be noise.

### 5. A line under the form

A section with `mt-18`, in columns 1–8 of a grid: an `<h2>` "Before you come", then with `mt-4` one or two sentences: the kitchen serves plates from 11:30 to 14:30, and the shop counter stays open while the room is full. With `mt-4`, a `<p>` holding a link in running text, "See the menu", that goes to `/menu`.

### 6. Footer

The footer from the layout notes.

### Behavior

- Keep every value in component state. The summary reads from the same state, so it follows each field as it changes. The note does not appear in the summary.
- When the form is sent, check it in code:
  - Date: empty gives "Choose a date."; a date before today gives "Choose today or a later date."; a date later than `max` gives "We take bookings up to 60 days ahead."; a Monday gives "We are closed on Mondays. Choose another day."
  - Time: the empty choice gives "Choose a time."
  - Name: empty gives "Write the name for the booking."
  - Email: empty gives "Write your email address."; a malformed one gives "Check the email address: it needs an @ and a domain."
  - The number of people is always valid, since the stepper cannot leave one to eight. The note is optional.
- Each error line follows the layout notes, which say when it shows and when it goes, and focus moves to the first field with an error. The date's four checks run in the order listed, and only the first that fails shows: a past Monday gets "Choose today or a later date."
- When everything is good, the form is replaced in its card by the confirmation in the status element: an `<h2>` in `text-h2`, "Your table is booked", with `tabIndex={-1}`, and with `mt-4` a sentence that repeats the booking: "A table for 3 people on Saturday 14 November 2026 at 11:30, under the name Ada Fenwick.", with the count written as the stepper writes it (`1 person`, `3 people`). The date and the time in it are each a `<time>`. Then with `mt-4` a sentence saying the details went to the address they gave, which is shown in full. The heading and both sentences sit in the message `<div>`, the `mt-4`s on the sentences. No button follows. Move focus to the heading. The summary card stays as it is.
- The other links need no behavior.
