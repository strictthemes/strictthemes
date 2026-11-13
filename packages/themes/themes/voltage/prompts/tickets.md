---
page: ticket page
title: Tickets
description: a ticket page with four ticket types and their prices, a quantity for each, an order summary that updates, and a form for name and email that ends in a confirmation, with no payment.
order: 3
checks:
  - Each ticket type is a white panel with its price and a list in words of what it includes; the sold-out type has the "Sold out" badge and its quantity buttons are disabled.
  - The plus and minus buttons change the quantity, each has a name that says which ticket it changes, and the summary's lines and total follow at once.
  - Sending with an empty name, a malformed email or no tickets shows an error in words with an icon, and focus moves to the first problem.
  - A good order replaces the form with a confirmation that a screen reader announces, and the page says plainly that no payment is taken.
---

Sample content, if the user gave none: **Tremor Days**, a two-day music and design festival at Varsby Docks, on Friday 4 and Saturday 5 December 2026. Four ticket types, in euros, all invented:

- **Weekend**, €118: both days, all three stages and the Drawing Office talks, and re-entry until 22:00.
- **Friday**, €64: Friday from 16:00, all stages, and the Fold Press workshop if places are left.
- **Saturday**, €72: Saturday from 12:00, all stages, and the Drawing Office talks. Sold out.
- **Under 18 weekend**, €59: both days, all three stages and the Drawing Office talks, and entry for ages 13 to 17 with an adult who holds a ticket.

This page is a demo: it takes a name and an email and confirms the order, but no payment is taken and nothing is sent.

Build these parts in order, under the header from the layout notes, in which Tickets is the current page.

### 1. Page heading

A section with no heading row. Its stack has `gap-3`:

- A stack with `gap-2`: the label `Tremor Days · 4–5 Dec 2026`, its dates the range from the Numbers note, then the `<h1>` "Tickets".
- Two sentences in `text-body`, `max-w-xl`, straight on the page: "Choose your tickets, then leave a name and an email. No payment is taken on this page."

### 2. Order

A section with a visually hidden `<h2>` "Your order" and the grid from the layout notes. Its two columns stack below `md`, tickets first.

**Tickets, `md:col-span-7`:** a `<ul>` with `flex flex-col gap-5`, no markers and no padding, one ticket panel per `<li>`. Each ticket panel is the stock panel with `gap-5`:

1. A heading row, `flex flex-wrap items-center justify-between gap-3`: the ticket's name as an `<h3>` in `text-h2`, and for the sold-out type the "Sold out" badge at the right end (add it with `npx shadcn@latest add badge`). It is the page's one badge.
2. A stack with `gap-1`: the price in `font-heading text-h1 tabular-nums`, in whole euros (`€118`), and under it the label `Per person`.
3. What it includes, as a `<ul>` with `flex flex-col gap-3`: three short lines in `text-body`, the three parts of the type's entry above, split at its commas, with the last part's "and" dropped and Saturday's "Sold out." left to the badge, and written as fragments with no full stop ("Both days", "All three stages and the Drawing Office talks", "Re-entry until 22:00"), each a row with `flex items-start gap-2` and the `Check` icon (`shrink-0 mt-1`, from the Icons note) before the words. The words carry the meaning; the icon only marks the line.
4. The quantity, on a row with `flex items-center justify-between gap-3 border-t border-border pt-5`: at the left the label `Quantity`, at the right a `role="group"` with the `aria-label` "Weekend tickets" (each type its own) and `flex items-center gap-3`, holding an icon button with the `Minus` icon, the number, and an icon button with the `Plus` icon. The buttons' names say what they change: "One fewer Weekend ticket" and "One more Weekend ticket". The number is a `<p>` with `w-8` and `font-heading text-h2 tabular-nums`, centered with `flex justify-center`, and `aria-live="polite"`, so a screen reader hears the new quantity. It is the one live region for a change of quantity: the summary's lines and total have none.

The sold-out panel looks the same as the others, with its price and its list; only its badge and its two quantity buttons differ. Both buttons are `disabled` and stay at 0, and the panel's heading row says why. Do not grey out, tint or strike through the panel.

**Summary and details, `md:col-span-5`:** a column with `flex flex-col gap-5` holding two panels.

The **summary panel** has `gap-5`:

1. An `<h3>` in `text-h2`, "Summary".
2. The lines, a `<ul>` with `flex flex-col gap-3`: one per ticket type with a quantity above 0, as a row with `flex items-baseline justify-between gap-3`: the quantity and the name in `text-body` (`2 × Weekend`) and the line's amount at the right in `font-mono tabular-nums` (`€236`). With nothing chosen, a `<p>` in `text-body`, "No tickets chosen yet.", stands in place of the `<ul>`, and the total reads `€0`.
3. The total, a row with `flex items-baseline justify-between gap-3 border-t border-border pt-5`: the label `Total`, and the amount in `font-heading text-h1 tabular-nums`.
4. Small print: "This is a demo. No payment is taken and no tickets are issued."

The **details panel** has `gap-5`. It opens with an `<h3>` in `text-h2`, "Your details". Under it, the wrapper from the Confirmations note, a plain `<div>` with no gap, holds the form, the `role="status"` element and the "Start a new order" button. The form has `noValidate` and is a stack with `gap-5`; its fields use the shadcn `Input` (add it with `npx shadcn@latest add input`):

- The field "Name", with `autoComplete="name"`.
- The field "Email", `type="email"`, with `autoComplete="email"`, and under it small print in the field's stack: "We would send the tickets here."
- A stack with `gap-2`: the default button, "Reserve tickets", `type="submit"`, full width with `w-full`, the page's one default button; and under it, shown only when needed, the error line from the layout notes, "Choose at least one ticket first.", with an `id`. While it shows, the button and the Weekend ticket's plus button both name it in their `aria-describedby`.

### 3. Footer

The footer from the layout notes.

### Behavior

- Keep the quantities in state, one per ticket type, from 0 to 8. The minus button is disabled at 0 and the plus button at 8; both get `focusableWhenDisabled`, since their own click can disable them. The sold-out type's buttons are plainly `disabled`.
- The summary's lines and total are worked out from the quantities on every render. Amounts are whole euros, written `€236`, with a comma above 999 (`€1,062`).
- When the form is sent, check the name (not blank), the email (at least one character before the `@`, and after it a dot with at least one character on each side: `a@b.c` passes, `a@b.` and `a@.c` do not) and the order (at least one ticket). Show every error at once: "Enter your name.", "Enter an email address, like ada@example.com." and the ticket line. Focus moves to the first problem in this order, which starts at the form although the tickets come first on the page: the name field, then the email field, then the Weekend ticket's plus button.
- Errors go away as the Errors note says; for the ticket line, the quantities are its field, so it goes when a quantity rises above 0. No element takes `aria-invalid` for it: the buttons and the number are not a field, and the `aria-describedby` above ties the line in.
- A good order removes the form and renders the message inside the status element, as a stack with `flex flex-col gap-3`: first a `<p>` with `flex items-start gap-2 text-body font-bold` holding the `Check` icon (`shrink-0 mt-1`) and "Reserved: 2 tickets, €236." (the count and the total of the order); this `<p>` is the element with `tabIndex={-1}` that gets focus; then two sentences in `text-body`, "Tickets would go to ada@example.com. This is a demo, so nothing was charged or sent." After the status element, in the wrapper, a `<div>` with `pt-3` holds a quiet button, "Start a new order".
- While the confirmation shows, the quantity buttons are disabled, so the summary stays as it was ordered. "Start a new order" sets every quantity to 0, empties the fields, brings the form back and moves focus to the name field.
