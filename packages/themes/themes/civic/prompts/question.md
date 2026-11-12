---
page: form question page
title: Question page
description: one step of a public-service form, with a few related questions, hints under the labels, a date in three fields, an error summary that links to each field, and a Back link.
order: 2
checks:
  - Sending the empty form shows an error summary at the top of the page that takes focus, with one link per error, and each link moves focus to its field.
  - Every field and both fieldsets have a visible label or `<legend>`; each hint and each error line is named in the `aria-describedby` of its field or fieldset.
  - Each error line has an icon and a sentence that says what to do, and its field has a red line beside it, so no error is shown by color alone.
  - The radio options are native radio inputs in rows at least 44px tall, and the three date fields each have their own label (Day, Month, Year).
  - While the error summary is shown the page's title starts with the word "Error", and it goes back to normal once the answers are good.
---

Sample content, if the user gave none: "Callowmere Council", an invented town council, and its service "Apply for a resident's parking permit". This page is step 2 of 3, "About your vehicle", for the applicant Priya Okafor of 14 Wharf Row, Callowmere CM4 7QJ, in permit zone B. Her answers, for testing: registration KX19 TDV, a Velmar Arden, petrol, the permit to start on 1 December 2026. The form opens empty. "Today" is 11 November 2026, fixed in code. Write the rest of the copy yourself, plain and short.

Build these parts in order.

### 1. Header

The header from the layout notes: "Callowmere Council" and "Apply for a resident's parking permit".

### 2. Back link

The first element of `<main>`: a `<p>` holding an `<a href="#">` "Back", `inline-flex min-h-11 items-center gap-2 text-primary underline underline-offset-4 hover:text-foreground transition-colors duration-150`, with the `ChevronLeft` icon before the word (`aria-hidden="true"`).

### 3. Error summary

The error summary from the layout notes, rendered only while the form has errors, after the Back link with `mt-6`. Its links follow the order of the fields on the page.

### 4. Title

- A caption with `mt-6`: `Step 2 of 3`.
- With `mt-2`, the `<h1>` "About your vehicle".
- With `mt-6`, one paragraph: the permit is linked to the registration number, so there is nothing to put in the windscreen.

### 5. Form

A wrapper `<div>` with `mt-10` holds the form and, after it, the status element; the `<form>` inside has no margin of its own and has `noValidate`. Four fields, each in a wrapper with `mt-6` except the first. Add `Input` with `npx shadcn@latest add input`.

- **"Vehicle registration number".** Hint: "This is on the number plate, for example KX19 TDV." An `Input` with `w-48`, `autoComplete="off"`, `spellCheck={false}` and `autoCapitalize="characters"`.
- **"Make and model".** Hint: "For example, Velmar Arden." An `Input` with `autoComplete="off"` (there is no token for it) that fills the column below `md` and is `md:w-96` from `md` up.
- **"What does the vehicle run on?"** A fieldset with this `<legend>` and the hint "This sets the price. Electric vehicles cost less." Three radio options from the layout notes, with the `name` `fuel`: "Petrol or diesel", "Hybrid", "Fully electric".
- **"When do you want the permit to start?"** A fieldset with this `<legend>` and the hint "It can start today or on any day in the next 3 months. For example, 1 12 2026." Then, with `mt-2`, a row `flex flex-wrap items-end gap-4` of three fields, each a `<div>` with its own `<label>` in `text-body`, here not bold, in place of the Fields note's bold: "Day", "Month", "Year". The `Input` under each label has `mt-2`, `inputMode="numeric"` and `autoComplete="off"`, and is `w-16` for the day and the month and `w-24` for the year. Here, in place of the Fieldsets note, the hint and the error line are named in each input's `aria-describedby` and not in the fieldset's, so that they are read once. Where the fieldset has an error, its error line sits between the hint and the row, with `mt-2`.

Then the row of buttons with `mt-10`: the default `Button` "Save and continue" with `type="submit"`. It is the only button on the page.

After the form, in the same wrapper, the status element from the layout notes; its message is a `<p>` with `mt-6`.

### 6. Help

A new part of the page: a `<section>` with `mt-16 border-t border-border pt-6`, opening with an `<h2>` "Help with this form" with no top margin. With `mt-4`, one paragraph: if you cannot find your registration number, it is on the vehicle's registration document. With `mt-4`, a paragraph holding the phone number 01632 960 418 as a `tel:` text link, and the opening hours: Monday to Friday, 9am to 5pm.

### 7. Footer

The footer from the layout notes.

### Behavior

- "Save and continue" checks every field in code, in page order:
  - Registration: empty is "Enter your vehicle's registration number". The check uses a copy of the value with spaces removed and letters made capitals; what the field shows does not change; anything other than 2 to 8 letters and numbers is "The registration number must be 2 to 8 letters and numbers, like KX19 TDV".
  - Make and model: empty is "Enter the make and model of your vehicle".
  - Fuel: none chosen is "Select what your vehicle runs on".
  - Start date: the checks below run in this order, and only the first that applies shows. Checks 5 to 7 mark all three parts.
    1. All three parts empty: "Enter the date you want the permit to start".
    2. One or two parts empty: "The start date must include a day" (or "a month", "a year"); two are joined with "and": "The start date must include a day and a year". It marks only the empty parts.
    3. A part that is not a whole number: "The day must be a number" (or "The month", "The year"), for the first such part only, day before month before year. It marks only that part.
    4. A year that is not four digits: "The year must have 4 numbers, like 2026". It marks only the year.
    5. A date that does not exist (31 November): "The start date must be a real date".
    6. A date before today: "The start date must be today or later".
    7. A date after the last good day: "The start date must be on or before 11 February 2027". The last good day, worked out from today and included, is the same day of the month 3 calendar months later: 11 February 2027; where that month is shorter, its last day (from 30 November, 28 February).
- Errors show as the Fields, Errors and Error summary notes say. With good answers, the status element reads "Your vehicle details are saved. In the full service, the next step would open now." Focus stays on the button. Nothing is sent anywhere.
- The Back link goes to `#`.
- On a phone the three date fields stay on one row (they fit at 375px), and the make and model field and the button fill the column.
