---
page: check answers page
title: Check answers
description: the last step of a public-service form, listing the answers so far with a link to change each one, the price, a declaration to tick and the button that sends the application.
order: 3
checks:
  - The answers are description lists (`<dl>`), one `<dt>` per answer, followed by a `<dd>` for the answer and a `<dd>` for its "Change" link, and on a phone each answer stacks under its question.
  - Every "Change" link says to a screen reader what it changes ("Change vehicle registration number"), not just "Change".
  - Sending without ticking the declaration shows the error summary with a link that moves focus to the checkbox, and an error line with an icon beside the checkbox; the button is never disabled.
  - The checkbox and its label make a target at least 44px tall, and the checkbox has 3px corners.
  - The price box shows the amount, the dates the permit covers and when payment is taken, with each date in a `<time>` element.
---

Sample content, if the user gave none: "Callowmere Council", an invented town council, and its service "Apply for a resident's parking permit". This page is step 3 of 3 for the applicant Priya Okafor: 14 Wharf Row, Callowmere CM4 7QJ, permit zone B, email priya.okafor@mail.example, phone 07700 900 214, proof of address "Council tax bill, uploaded 9 November 2026". Her vehicle: registration KX19 TDV, a Velmar Arden, petrol or diesel, the permit to start on 1 December 2026. As a first permit for a petrol or diesel vehicle it costs £96 for 12 months, 1 December 2026 to 30 November 2027, paid after approval. Write the rest of the copy yourself, plain and short.

Build these parts in order.

### 1. Header

The header from the layout notes: "Callowmere Council" and "Apply for a resident's parking permit".

### 2. Back link

The first element of `<main>`: a `<p>` holding an `<a href="#">` "Back", `inline-flex min-h-11 items-center gap-2 text-primary underline underline-offset-4 hover:text-foreground transition-colors duration-150`, with the `ChevronLeft` icon before the word (`aria-hidden="true"`).

### 3. Error summary

The error summary from the layout notes, shown after a send that finds the declaration not ticked, until the next send, after the Back link with `mt-6`. It has one link, which moves focus to the checkbox.

### 4. Title

- A caption with `mt-6`: `Step 3 of 3`.
- With `mt-2`, the `<h1>` "Check your application".
- With `mt-6`, one paragraph: read your answers, and change any that are wrong before you send them.

### 5. Your details

An `<h2>` "Your details", then with `mt-6` a summary list: a `<dl>` with `border-t border-border`, of six rows: Name, Address, Permit zone, Email, Phone, Proof of address. The address is three lines in its `<dd>`, one `<span className="block">` per line.

Each row is a `<div>` with `border-b border-border py-4`, holding:

- The question as the `<dt>`, in `text-body font-bold`.
- The answer as a `<dd>` with `mt-1` and `wrap-break-word`.
- A `<dd>` with `mt-2` holding the "Change" link: a text link, `inline-flex min-h-11 items-center md:items-start` (from `md` up its word then lines up with the question's first line), whose text is "Change" with the rest in a visually hidden span: `Change<span className="sr-only"> email address</span>`. The hidden words, row by row: name, address, permit zone, email address, phone number, proof of address; then vehicle registration number, make and model, what the vehicle runs on, permit start date. It goes to `#`.

From `md` up the row is a grid: `md:grid md:grid-cols-12 md:items-start md:gap-x-4`, where `md:items-start` keeps a long answer from stretching the link. The `<dt>` has `md:col-span-4`, the answer `md:col-span-6 md:mt-0`, and the link's `<dd>` `md:col-span-2 md:mt-0 md:text-right`. The row's `py-4` is the only space between rows.

### 6. Your vehicle

An `<h2>` "Your vehicle", then with `mt-6` a summary list like the one above, of four rows: Registration number, Make and model, Runs on, Permit start date. The start date is a `<time>` with a `dateTime`, in body text like every answer, not a label; so is the date in the proof of address answer.

### 7. What you will pay

A box with `mt-10`. Inside it:

- An `<h2>` "What you will pay", with no top margin.
- With `mt-2`, the amount as a `<p>` in `font-heading text-h1`: "£96".
- With `mt-2`, a `<p>`: "For 12 months, from 1 December 2026 to 30 November 2027", both dates in `<time>` elements.
- With `mt-4`, a `<p>`: you pay after the council approves the application, and it emails you a link to pay.

### 8. Declaration

A wrapper with `mt-10` holding the form and the status element. The form has `noValidate`:

- An `<h2>` "Declaration", with no top margin.
- With `mt-4`, one paragraph: giving false information to get a permit can mean it is cancelled with no refund.
- With `mt-6`, the checkbox field, which here departs from the Fields note's order, since its label sits beside the box: a wrapper that gets the red line while it has an error, holding the error line while there is one, with no top margin as the wrapper's first element, and the checkbox row from the layout notes, which has `mt-2` while the error line is above it. Add the checkbox with `npx shadcn@latest add checkbox` and change it as the layout notes say. The `<label>`: "I confirm that I live at 14 Wharf Row, that the vehicle is registered to me at this address, and that my answers are correct." Give the `Checkbox` an `id` and the `<label>` `htmlFor` with it, so a click on the words ticks the box. Give the `<label>` an `id` too, and the `Checkbox` `aria-labelledby` naming it: in a Base UI project the `Checkbox`'s `id` lands on a hidden input, and the visible box would otherwise have no name. The checkbox names the error line in its `aria-describedby` and gets `aria-invalid` while there is an error. Give the `Checkbox` a `ref` too, which lands on the visible box: the error summary's link focuses that box with `focus({ preventScroll: true })`, because focusing the hidden input passes focus on without `preventScroll`.
- The row of buttons with `mt-10`: the default `Button` "Submit application" with `type="submit"`, the only button on the page.

After the form, in the same wrapper, the status element from the layout notes; its message is a `<p>` with `mt-6`.

### 9. Footer

The footer from the layout notes.

### Behavior

- "Submit application" checks the declaration in code. If it is not ticked: the error line "Tick the box to confirm your answers are correct" shows beside the checkbox with the red line, the error summary appears with the same words as its link and takes focus, and the page's `<title>` starts with "Error: ".
- Ticking the box removes the error line, the red line and `aria-invalid`, as the Errors note says; the error summary and the title's prefix stay until the next send.
- A send with the box ticked removes the summary and the prefix, and the status element reads "In the full service, your application would be sent now and the confirmation page would open." Focus stays on the button. Nothing is sent anywhere.
- The "Change" links and the Back link go to `#`.
- On a phone each row stacks: question, answer, then the "Change" link, all left-aligned. The email address breaks if it has to.
