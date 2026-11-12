---
page: reservation request page
title: Reserve
description: a page to request a reservation at a small guesthouse, with a form for the dates, the room, the guests and who is coming, checked in code, a summary beside it that works out the nights and the total, and a confirmation that replaces the form.
order: 4
checks:
  - "Every field has a visible label; the two dates are date fields, and the room, the guests and the time of arrival are native `<select>` elements."
  - "Sending the empty form gives the arrival date, the departure date, the room, the name, the email address and the time of arrival each their own error line with an icon, and focus moves to the arrival date."
  - "The summary works out the nights and the total as the dates and the room are chosen: Marram from 14 to 17 May 2027 reads 3 nights at £152 and a total of £456, and Marram from 29 June to 3 July 2027 shows two lines, £304 and £356, and a total of £660."
  - "The page says in words that this is a request and not a payment, on the block of clay, which is the page's only `bg-clay` element, has ink text in both modes and holds no link, button or field."
  - "A good request replaces the form, inside the same card, with a confirmation that repeats the room, the guests, the dates, the nights and the total; its heading takes focus and a screen reader announces it."
  - "Send request is the page's one default (slate) button and Breakfast included its one badge; no heading is bold, and nothing is italic or round."
---

Sample content, if the user gave none: requesting a room at **Kittiwake House**, the invented guesthouse described in the layout notes. Use its six rooms, the number each sleeps and their prices by season exactly as the notes' list gives them. A stay is 1 to 14 nights, and two nights or more in July and August. This is a request, not a payment: the house replies within a day, and the guest pays at the house on leaving. The sample stay, wherever this brief needs one, is Marram for 2 guests from Friday 14 May 2027 to Monday 17 May 2027: 3 nights at £152, £456 in all. Every name is invented.

Build these parts in order. This page needs `npx shadcn@latest add input textarea badge`.

### 1. Header

The header from the layout notes, with "Reserve" as the current page.

### 2. Opening

The first section, with `pt-12`, as a grid (`grid gap-6 md:grid-cols-12 md:items-start`):

- In columns 1–7 (`md:col-span-7`): a label line in `text-muted-foreground`, `Six rooms · We reply within a day`; with `mt-2` the `<h1>` in `text-h1 lg:text-display`, "Request a reservation", with no italic; with `mt-4` a `<p>` in `text-body`: "Tell us the days and the room you would like. Nothing is charged now: we write back to confirm, and you pay at the house when you leave."
- In columns 9–12 (`md:col-span-4 md:col-start-9`): the page's clay block, holding:
  - A label with no text color class, so it takes the block's ink: `How it works`.
  - With `mt-2`, an `<h2>` in `text-h2` (not the notes' `md:text-h1`: the block is narrow): "A request, not a payment".
  - With `mt-6`, an `<ol>` with no markers and no padding, three items, the second and third with `mt-4`. Each `<li>` is `flex items-baseline gap-4`: the step's number as a label with `tabular-nums`, `01`, `02`, `03`, then a `<p>` in `text-body`. The steps: "You send the days and the room you would like." "We check the room and write back within a day." "You pay at the house when you leave, by card or in cash."

### 3. Request and summary

A section with the hairline from the layout notes and the `aria-label` "Request and summary", as a grid (`grid gap-6 md:grid-cols-12 md:items-start`):

- In columns 1–7 (`md:col-span-7`): a card that is the wrapper for the form and the confirmation. It holds the `<form>` (with `noValidate` and `aria-labelledby` pointing at its heading) and, after it, the empty `role="status"` element.
- In columns 9–12 (`md:col-span-4 md:col-start-9`), with `md:sticky md:top-6`: the summary card of part 4. On a phone it comes after the form card.

The form, in this order. Each field sits in its own `<div>`, and rows and single fields are `mt-6` apart, as the Forms note says:

1. An `<h2>` in `text-h2` with an `id`: "Your request". It is the form's first element; the row after it has `mt-6`.
2. A row of two: **"Arrival date"**, an `Input` of type `date` with `min` set to today; and **"Departure date"**, an `Input` of type `date` with `min` set to the day after the arrival date, or to tomorrow while there is none. `min` only limits the picker: a date typed outside it still reaches the check.
3. A row of two: **"Room"**, a native `<select>` whose first option is the empty choice "Choose a room", followed by the six rooms in the notes' order, each written with the number it sleeps, `Thrift · sleeps 2`, `Campion · sleeps 1` and so on, with the values `thrift`, `campion`, `samphire`, `marram`, `sea-holly` and `tamarisk`; and **"Guests"**, a native `<select>` with the options `1 guest`, `2 guests`, `3 guests` and `4 guests` and the values `1` to `4`, which starts on `2 guests` and has no empty choice.
4. **"Name"**: an `Input` with `autoComplete="name"`.
5. A row of two: **"Email address"**, an `Input` of type `email` with `autoComplete="email"`; and **"Phone (optional)"**, an `Input` of type `tel` with `autoComplete="tel"`.
6. **"Time of arrival"**: a native `<select>` whose first option is the empty choice "Choose a time", followed by `15:00 to 16:00`, `16:00 to 17:00`, `17:00 to 18:00`, `18:00 to 19:00`, `19:00 to 20:00` and `Later than 20:00`. Under it, with `mt-2`, a `<p>` of helper text in `font-mono text-label text-muted-foreground`, a sentence, not uppercased, with an `id` the field names in `aria-describedby` at all times: "The door is open from 15:00 to 20:00. For a later arrival we leave a key in the porch.", each time a `<time>`.
7. **"Note (optional)"**: a `Textarea` with `maxLength={400}`. Under it, with `mt-2`, a helper line as above, named by the field: "An allergy, a cot, a late train: anything we should know."
8. In a `<div>` with `mt-6` and `flex flex-wrap items-center gap-x-6 gap-y-2`: the page's one default button, `type="submit"`, "Send request"; and beside it a `<p>` of helper text in `font-mono text-label text-muted-foreground`, not uppercased: "Nothing is paid now."

Where a field has both a helper line and an error line, the error comes after the helper, also with `mt-2`, and the field names both.

### 4. Summary

The summary card is an `<aside>` with `aria-labelledby` pointing at its heading. Inside it:

- A label line with the page's one badge beside it, in the row the Badges note gives: the label `Your stay` in `text-muted-foreground`, then the badge "Breakfast included".
- With `mt-2`, an `<h2>` in `text-h2` (the card is narrow): "Summary".
- With `mt-6`, a facts list from the layout notes, five rows: Arrive, Leave, Nights, Room, Guests. A date reads `Friday 14 May 2027`, in a `<time>`; the nights read `3 nights`; the room is its name, `Marram`; the guests read `2 guests`. A value that is still missing, and the nights while the two dates do not give at least one, reads "Not chosen yet", with `text-muted-foreground` on that `<dd>`.
- With `mt-6`, a second facts list, the price. It has one row for each season the stay has nights in, in the order the nights come: the `<dt>` reads `3 nights at £152` and the `<dd>` the sum, `£456`, as a label in `text-foreground` with `tabular-nums`. Its last row is the total: the `<dt>` reads `Total` and the `<dd>` the sum of the rows in `font-heading text-h2 tabular-nums`, `£456`. While the dates or the room are missing, or the dates do not give at least one night, the list has only the total row, and its `<dd>` reads "Not worked out yet" in `text-body text-muted-foreground`.
- With `mt-4`, a `<p>` of helper text in `font-mono text-label text-muted-foreground`, a sentence, not uppercased: "Breakfast is included. You pay at the house when you leave."

The facts lists have only hairlines, no corners, so they are not cards in a card. The summary is not a live region: it changes with every choice, and announcing each one would be noise.

### 5. Before you arrive

A section with the hairline, as a grid (`grid gap-6 md:grid-cols-12 md:items-start`):

- In columns 1–4 (`md:col-span-4`): a label line, `Good to know`; with `mt-2` an `<h2>`, "Before you arrive".
- In columns 6–12 (`md:col-span-7 md:col-start-6`): rows from the layout notes, four rows:
  - Arrive: `15:00–20:00`, two `<time>` elements
  - Leave by: `10:30`, a `<time>`
  - Change or cancel, free of charge: `Up to 7 days before`
  - Stays in July and August: `Two nights or more`

  Then, with `mt-4`, a `<p>` in `text-body`: "For anything else, write to stay@kittiwakehouse.example or call 01632 960 352.", the address a link in running text to `mailto:stay@kittiwakehouse.example` and the number one to `tel:+441632960352`.

### 6. Footer

The footer from the layout notes.

### Behavior

- **State:** keep every value in component state; the summary reads from the same state, so it follows each field as it changes. The name, the email address, the phone, the time of arrival and the note do not appear in the summary.
- **From the address:** when the page opens, read `arrive`, `leave`, `guests` and `room` from the query string of the address (`/reserve?arrive=2027-05-14&leave=2027-05-17&guests=2&room=marram`) and start the matching fields with them. Take a value only if it is well formed: a date as `YYYY-MM-DD` that is a real day, guests from `1` to `4`, a room that is one of the six values. Ignore anything else, and show no error for it. With no query string the form starts empty, with `2 guests`.
- **Dates:** "today" and "tomorrow" come from the visitor's clock. Work with the calendar dates as written: read the year, the month and the day from a field's value and count with `Date.UTC`, so that no time zone moves a day. The nights are the days from the arrival date up to, and not including, the departure date.
- **Price:** each night is charged at the room's price for the season of the date the night begins on. The season comes from that date's month: November to March is winter; April, May, June, September and October are spring and autumn; July and August are summer. So Marram from 29 June to 3 July 2027 is `2 nights at £152`, `£304`, then `2 nights at £178`, `£356`, and a total of `£660`. A sum of a thousand pounds or more has a comma: `£3,136`.
- **Sending:** check the fields in code, in the order of the form, and show one error per field, the first that applies:
  - Arrival date: empty gives "Choose the day you arrive."; a day before today gives "Choose today or a later day."
  - Departure date: empty gives "Choose the day you leave."; a day that is not after the arrival date gives "Choose a day after the day you arrive."; more than 14 nights gives "We take requests for up to 14 nights. For a longer stay, write to us."; a single night that begins in July or August gives "In July and August we take stays of two nights or more. Choose a later day."
  - Room: the empty choice gives "Choose a room."
  - Guests: more guests than the chosen room sleeps gives a line that names the room and its number: "Marram sleeps 2. Choose fewer guests or another room." Without a room this field has no error.
  - Name: empty gives "Write your name."
  - Email address: empty gives "Write your email address."; a malformed one gives "Check the email address: it needs an @ and a domain."
  - Phone: empty is fine. Anything but digits, spaces and one leading `+`, or fewer than 7 digits, gives "Write the number in digits, such as 01632 960 352, or leave it empty."
  - Time of arrival: the empty choice gives "Choose when you expect to arrive."
  - The note is never checked.
- **Errors and focus:** each error line follows the Errors note, and focus moves to the first field with an error. Two errors depend on a second field, and also go when that field changes: the departure date's when the arrival date changes, and the guests' when the room changes.
- **Confirmation:** when everything is good, the form is replaced in its card by the message in the status element: an `<h2>` in `text-h2`, "Thank you. We have your request", with `tabIndex={-1}` and focus moved to it. Then with `mt-4` a `<p>` in `text-body` that repeats the stay as the summary has it: "Marram for 2 guests, from Friday 14 May 2027 to Monday 17 May 2027: 3 nights, £456 in all.", each date a `<time>`. Then with `mt-4` a `<p>` in `text-body`: "We will write to ines@example.com within a day to say whether the room is free. Nothing has been paid.", with the email address as it was typed. Then with `mt-4` a label in `text-muted-foreground`: `Reference · KH-2705-014`, a fixed sample reference. The heading has no top margin: the message is the card's only content.
- **Again:** after the status element, in the card and only while the message shows, a `<div>` with `mt-6` holding a `secondary` button, "Make another request". It empties the status element, brings back the form as it starts with no query string and no errors, and moves focus to the arrival date. The summary follows, since it reads the same state.
- Nothing is sent anywhere: the confirmation is shown in the page. The other links need no behavior.
