---
page: booking page
title: Appointment
description: a page for booking a fitting at a fashion house's atelier, with its address and opening hours and a form for a name, an email, a date, a time and a note.
order: 5
checks:
  - The address is in an `<address>` element, and the opening hours are a `<dl>` with each time in a `<time>` element.
  - Every field has a visible label, and a Sunday or a Monday chosen as the date gets its own error when the form is sent.
  - 'The date is picked from the theme''s `Calendar` in a `Popover` and the time from the theme''s `Select`, with no `<input type="date">` and no native `<select>` on the page: both open under their fields as square boxes with a black hairline and no shadow, the chosen time has a check, today is underlined in the calendar, and the arrow keys, Enter and Escape work in both.'
  - Sending the form empty shows a message in words with an icon under each required field, and focus moves to the first of them.
  - A good booking is replaced by a confirmation in a `role="status"` element that was on the page from the start, and the confirmation repeats the date and the time.
---

Sample house, if the user gave none: **Maison Ardelle**, a small fashion house in Lyon founded in 2014 by Inès Ardelle. A fitting is an hour in the atelier with one of its tailors, to try on pieces from Autumn–Winter 2026, *Still Water*, or to be measured for a coat cut to order. It is free. The atelier is at 7 rue Belvèze, 69001 Lyon, on the second floor, with a lift. It is open for fittings Tuesday to Friday 10:00–18:00 and Saturday 10:00–17:00, closed Sunday and Monday. Fittings start at 10:00, 11:30, 14:00, 15:30 and 17:00; on Saturdays the last one is 15:30. The house answers from atelier@maison-ardelle.example. "Today" is the visitor's clock, not a fixed date: a fitting can be booked from tomorrow on, with no last day.

Build these parts in order.

### 1. Header

The header from the layout notes. "Appointment" is the current page.

### 2. Opening

The first section, in the grid:

- A label line in `text-muted-foreground`, columns 1–12 (`md:col-span-12`): `Fittings · Lyon`.
- With `mt-4`, the `<h1>` in `text-h1 md:text-display`, columns 1–9 (`md:col-span-9`): "Come to the *atelier*", with the one italic word in an `<em>`. The page's only italic: where the copy names "Still Water", the name is upright.
- With `mt-8`, a `<p>` in columns 5–9 (`md:col-start-5 md:col-span-5`, which overlap the `<h1>`'s, so it starts a row under it), at most `max-w-md`, two sentences in `text-body`. Sample: "A fitting is an hour in the atelier with one of our tailors, to try on the season's pieces or to be measured for a coat. It is free."

### 3. Visit and book

A section in the grid with two parts.

**The atelier**, in columns 1–4 (`md:col-span-4`):

- A label heading "Address", an `<h2>`.
- With `mt-4`, an `<address>` with `not-italic` (the element is italic by default, and this is not the theme's italic) in `text-body`: the street, the postcode and city, and "Second floor, with a lift", each on its own line with `<br>`.
- With `mt-4`, a `<p>` holding a link in running text, "Open in a map", pointing to `#` (the margin is on the `<p>`: a link is inline).
- With `mt-16`, a label heading "Hours", an `<h2>`.
- With `mt-4`, a `<dl>` as the layout notes describe it, one row per day group, with the terms `Tuesday to Friday`, `Saturday` and `Sunday and Monday`. Here, instead of the notes' three columns at every width, a row is `grid grid-cols-1 lg:grid-cols-3 lg:items-baseline lg:gap-x-4` and its `<dd>` is `mt-2 lg:col-span-2 lg:mt-0`, so below `lg` the times sit 8px under their days: from `md` to `lg` this column is too narrow for a label and a span of hours side by side. The row keeps its `border-t border-border py-4`. In each `<dd>` the times are `font-mono tabular-nums` inside `<time>` elements (`<time dateTime="10:00">10:00</time>–<time dateTime="18:00">18:00</time>`); the closed days read "Closed" in `text-body`.
- With `mt-16`, a label heading "Questions", an `<h2>`, and with `mt-4` one sentence in `text-body` with the email address as a link in running text (`mailto:`), not uppercased.

**The booking**, in columns 6–12 (`md:col-start-6 md:col-span-7`), with `mt-16 md:mt-0`: one wrapper holding the form and the empty `role="status"` element, as the layout notes describe. The form is `bg-card p-8` with `noValidate`:

- An `<h2>` in `text-h2`: "Book a fitting".
- With `mt-4`, one sentence in `text-body`: a tailor will confirm by email within a day.
- With `mt-8`, the fields, `mt-8` apart (`npx shadcn@latest add input textarea select calendar popover`):
  - "Your name": an `Input`.
  - "Email address": an `Input` of type `email`.
  - A row with the date and the time: `xl:grid xl:grid-cols-2 xl:gap-x-8`, each field in its own wrapper, the time's wrapper with `mt-8 xl:mt-0`. Below `xl` the two stack: a date written out in full needs more room than half the form has before that. "Date": the `DatePicker` of the Date fields note, with no day chosen at first. A day before tomorrow by the clock cannot be chosen: give it `disabled={{ before: tomorrow }}` and `startMonth={tomorrow}`, where `tomorrow` is a `Date` at local midnight. Closed days can be chosen and are caught when the form is sent (see Behavior), where a message says why. "Time": a `Select` as the Selects note describes it, with the placeholder `Choose a time` and the choices `10:00`, `11:30`, `14:00`, `15:30` and `17:00`. The choices and the chosen time keep the `Select`'s `text-body` in the body font: the Figures note's `font-mono` is for figures shown on the page, not inside a control.
  - "Note (optional)": a `Textarea` with `min-h-32`. Under the label, with `mt-2`, a helper line: a `<p>` in `font-mono text-label text-muted-foreground`, not uppercased, "Tell us what you would like to try, or your size.", with an `id` (`note-help`) that the textarea's `aria-describedby` names at all times. Here, instead of the Inputs note's `mt-2` under the label, the textarea has `mt-2` under the helper line.
- With `mt-8`, the default button "Request a fitting", `type="submit"`. The page's only default button.

### 4. Footer

The footer from the layout notes.

### On a phone

The atelier's details come first and the form after them, at the full width, with `mt-16` between. The date and time fields stack. The form keeps its `p-8`. Inputs, the date field and the select take the full width of the form. The send button is `w-full md:w-auto`: full width on a phone, its own width from `md` up.

### Behavior

- **Sending:** check each field in code, in this order. Empty name: "Write your name." Empty or malformed email: "Write an email address such as name@example.com." No date: "Choose a day." A date before tomorrow (tomorrow itself is fine): "Choose a day from tomorrow on." The calendar already blocks those days, so this shows only when the page stayed open past midnight: work out tomorrow again at each send. A Sunday or a Monday: "The atelier is closed on Sundays and Mondays. Choose another day." No time: "Choose a time." A Saturday with 17:00, under the time field: "On Saturdays the last fitting is at 15:30." Show one error per field, the first that applies, under that field. The Saturday error is also removed when the date changes, as the Errors note says. Focus moves to the first field with an error. The note is not checked: its `aria-describedby` names only its helper line.
- **Reading the date:** the date field's value is a `Date` at local midnight, or `undefined`. Read the weekday with `getDay()` and compare it with tomorrow as two local dates; never go through `toISOString()` or `new Date()` on a string such as `2026-11-19`, which read in UTC and can shift the day.
- **Confirmation:** when all is good, the form is replaced by the message in the status element, drawn as the Confirmations note says: an `<h2>` in `text-h2`, "Your fitting is requested", with `tabIndex={-1}` and focus moved to it, then with `mt-4` a sentence in `text-body` that repeats the day and the time as `<time>` elements with `dateTime` and the email address as written: "Thursday 19 November 2026 at 11:30. We will confirm to ines@example.com within a day." After the status element, in the same wrapper and only while the message shows, an `outline` button with `mt-8`, "Book another fitting", which empties the status element, brings the empty form back and moves focus to the name field.
- Nothing is sent anywhere: the confirmation is shown in the page.
