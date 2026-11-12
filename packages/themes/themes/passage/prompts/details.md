---
page: passenger details page
title: Passenger details
description: the step before payment in a ferry booking, with each passenger's details and the extras in white cards, a fare summary beside them on a wide screen, and checks in code.
order: 3
checks:
  - "The form is in white cards; from lg up the fare summary stands beside it and stays in view, and below lg it comes after the form."
  - "Sending the empty form gives each passenger's names, the email, the mobile number and the conditions box their own error line with an icon, and focus moves to the first name of passenger 1."
  - "Ticking an extra or changing the number of bicycles adds or removes its row in the fare summary, and the total adds up."
  - "Every checkbox ticks when its words are clicked and has a name that a screen reader reads."
  - "The page has no card number or other payment field, and ends at the Continue to payment button."
---

Sample content, if the user gave none: "Kestrel Ferries", a booking for the 09:15 from Harrowmouth to Port Ellery (arriving 11:00) on Saturday 19 December 2026, on MV Isla Grey, for 2 adults. The fare is £78.00 for both, one way, with port fees. The extras: a car up to 5 m long and 2 m high, £46.00; seats in the quiet lounge for two, £24.00; priority boarding, £8.00; bicycles, £6.00 each, up to two. Prices include VAT. This page collects names and contact details only; payment is the next step, on another page.

Build these parts in order.

### 1. Header

The header from the layout notes. This page is a step of booking, so here, in place of the notes' `aria-current="page"`, the "Book" link gets `aria-current="true"` and `underline`, and keeps `/`.

### 2. Opening

The first section, with `pt-8`, in columns 1–8 of a grid (`grid gap-5 md:grid-cols-12`): a label, `Step 2 of 3 · Passengers and extras`, then with `mt-2` the `<h1>` "Who is travelling" in `text-h1`, then with `mt-3` one or two sentences: write each name as it is on the passenger's photo ID, and the lead passenger gets a text if the sailing changes. Then with `mt-3` a `<p>` holding a link in running text, "Back to sailings", that goes to `/results`.

### 3. Form and fare summary

A section with `mt-16`, as a grid that is a single column up to `lg`: `grid gap-5 lg:grid-cols-12 lg:items-start`.

- In columns 1–8 (`lg:col-span-8`): a `<div>` that is the wrapper for the form and the confirmation. It holds the `<form>` (with `noValidate` and the `aria-label` "Passenger details") and, after it, the empty `role="status"` element. Add the fields with `npx shadcn@latest add input checkbox` if the project has none, and give the new files the edits the Added components note lists.
- In columns 9–12 (`lg:col-span-4`): the fare summary card, with `lg:sticky lg:top-5`. Below `lg` it comes after the form and its button.

The form holds four cards, `mt-5` apart (the first has none): here the form wraps the cards, in place of the Forms note's form inside one card. Each card is a `<div>` with the card classes, `role="group"` and `aria-labelledby` pointing at its `<h2>`. Inside each, a label first, then with `mt-2` the `<h2>`, then with `mt-5` the fields, which follow the Forms note:

1. **Passenger 1.** The label `Adult · Lead passenger`, the `<h2>` "Passenger 1". Then the two names side by side from `md` up, as the Forms note says: "First name" (`autoComplete="given-name"`) and "Last name" (`autoComplete="family-name"`). Then "Email address", an `Input` of type `email` with `autoComplete="email"`, and under it with `mt-2` a label in `text-muted-foreground`: `We send the boarding pass here.` Then "Mobile phone", an `Input` of type `tel` with `autoComplete="tel"`, and under it with `mt-2` a label in `text-muted-foreground`: `We text this number if the sailing is delayed or cancelled.` Where an error line shows under a field with helper text, it comes after the helper, also with `mt-2`, and the field's `aria-describedby` names both.
2. **Passenger 2.** The label `Adult`, the `<h2>` "Passenger 2". Then "First name" and "Last name" side by side, as above, each with its own `id`.
3. **Extras.** The label `Optional`, the `<h2>` "Extras". Then a list of rows as the layout notes describe, four rows, each `<li>` with `flex items-start justify-between gap-5 py-3 first:pt-0 last:pb-0` (here `items-start`, so the price lines up with the first line of the words). In each row, on the left a `<div>` with `min-w-0`, on the right the price as a label in `text-foreground` with `tabular-nums` and `shrink-0`:
   - A checkbox row as the Checkboxes note describes: "A car up to 5 m long and 2 m high", `£46.00`.
   - A checkbox row: "Seats in the quiet lounge for two", `£24.00`.
   - A checkbox row: "Priority boarding", `£8.00`.
   - The bicycles: a label `<p>` with an `id`, "Bicycles", in `font-mono text-label text-foreground`, then with `mt-2` a stepper as the layout notes describe, from zero to two, starting at zero. The value reads `0 bicycles`, `1 bicycle`, `2 bicycles`; the buttons' `aria-label`s are "Fewer bicycles" and "More bicycles". The price on the right reads `£6.00 each`. The stepper's buttons use `focusableWhenDisabled`, so this page makes the `data-disabled:` edit in `button.tsx`.
4. **Conditions.** The label `Before you pay`, the `<h2>` "Conditions". Then with `mt-3` one sentence in `text-body` with a link in running text, "conditions of carriage", to `#`: a booking can be changed up to 24 hours before the sailing for £10.00. Then with `mt-5` a checkbox row: "I have read the conditions of carriage and the fare rules." Its error line goes under the row.

Then, after the four cards, in the notes' `<div>` with `mt-5`, the page's one default button, `type="submit"`: "Continue to payment". Nothing follows it in the form: no card number, no payment field.

### 4. Fare summary

The fare summary card is an `<aside>` with `aria-labelledby` pointing at its heading. Inside it:

- A label: `Your sailing`.
- With `mt-2`, an `<h2>` "Fare summary".
- With `mt-5`, the journey from the layout notes in its small size: `09:15` and `Harrowmouth` on the left, `1 h 45 min` and `Direct` on the line, `11:00` and `Port Ellery` on the right.
- With `mt-3`, a label line in `text-muted-foreground`: `Saturday 19 December 2026 · MV Isla Grey`, with the date in a `<time>`.
- With `mt-5`, a list of rows as the layout notes describe: the name in `text-body` on the left, the price as a label in `text-foreground` with `tabular-nums` on the right. The first row is always there: `Fare, 2 adults`, `£78.00`. Then one row for each extra that is chosen, in the order of the form: `Car`, `£46.00`; `Lounge seats`, `£24.00`; `Priority boarding`, `£8.00`; and the bicycles as `1 bicycle`, `£6.00` or `2 bicycles`, `£12.00`.
- With `mt-5`, the total line: a `<div>` with `flex items-baseline justify-between gap-5 border-t pt-3`, holding a label in `text-foreground`, `Total`, and the total as a `<p>` in `font-mono text-h2 text-foreground tabular-nums`. With no extras it is `£78.00`; with two bicycles `£90.00`.
- With `mt-3`, a label in `text-muted-foreground`: `Includes port fees and VAT.`

The summary is not a live region: it changes with every tick, and announcing each one would be noise.

### 5. Footer

The footer from the layout notes.

### Behavior

- Keep every value in component state. The summary reads from the same state, so its rows and its total follow each extra as it changes. Work in pence and write the sums with two decimals.
- When the form is sent, check it in code:
  - Each first name: empty, or only spaces, gives "Write the first name as it is on the passenger's photo ID."
  - Each last name: empty gives "Write the last name as it is on the passenger's photo ID."
  - Email: empty gives "Write an email address for the boarding pass."; a malformed one gives "Check the email address: it needs an @ and a domain."
  - Mobile phone: empty gives "Write a mobile number we can text on the day."; fewer than 10 digits, counting digits only and allowing spaces, `+` and `-`, gives "Check the mobile number: it needs at least 10 digits."
  - Conditions: an unticked box gives "Tick the box to accept the conditions of carriage." The checkbox gets `aria-invalid` and its `aria-describedby` names the line.
  - The extras are optional and always valid.
- Each error line follows the layout notes, which say when it shows and when it goes. Focus moves to the first field with an error in the order of the form: passenger 1's first name, last name, email, phone, passenger 2's first name, last name, then the conditions box.
- When everything is good, the form stays as it is, and the confirmation appears in the status element after it: an `<h2>` in `text-h2`, "Ready for payment", with `tabIndex={-1}`, and with `mt-3` a sentence that gives the total and the lead passenger: "Your details are complete. The total to pay is £90.00, and the boarding pass goes to maren.holt@mail.example." with the total and the address as they are in the form. The message `<div>` has `mt-5`, since the form stays above it. Move focus to the heading. A later send that finds an error removes the confirmation.
- "Back to sailings", "conditions of carriage" and the other links need no behavior.
