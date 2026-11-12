---
page: payment form
title: Payment
description: a form to send a payment from a business account, with checks on every field, a review step that states the amount in words, and a confirmation that says nothing was sent.
order: 4
checks:
  - Sending the form with empty or wrong fields shows an error in words with an icon under each field, tied with `aria-describedby`, and moves focus to the first field with an error.
  - The review step states the amount in figures and in words (£1,240.50 is "One thousand, two hundred and forty pounds and fifty pence"), and "Change details" goes back with every value kept.
  - After "Send payment" a confirmation is announced from a `role="status"` element that was on the page from the start, it says that nothing was sent, and focus moves to it.
  - An amount above the account's available balance or above £10,000.00 is refused with its own error message.
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Second run of this page. The first run showed a broken sentence in the theme's shared notes, which is fixed. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 1,217 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Second run on the prompt as revised after the problems the earlier test builds reported: after the first run on that text, a wrong reference in the theme's notes was corrected (the header named "the last note" for the Menu button). A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 1,230 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 6 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 1,221 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 3 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: "Fairhold", a banking and invoicing service for small businesses, used by "Hollis & Vane", a two-person print studio. Two accounts to pay from: the current account (ending 4417, £48,213.56 available) and the tax reserve (ending 8830, £13,690.71 available). Four saved payees, each with a sort code and an account number: Copperleaf Paper Mill, Brightwater Inks, Kestle Property Lettings and Marlowe Van Leasing.

This page uses the stock `button` and `input`; add any the project lacks with `npx shadcn@latest add button input`.

Build these parts in order; the footer is as the layout notes describe it.

### 1. Header

The product's name, five nav links (Overview, Transactions, Invoices, Payments, Reports) with Payments as the current page, and at the right end the business's name as a small figure, hidden below `md`, where the notes' "Menu" button takes the right end. Nav links go to the notes' paths.

### 2. Page header

Above the heading, the label "Payments". The `<h1>` "Make a payment". No actions.

### 3. Payment sheet

A grid row: the payment sheet spans eight columns from `lg` up. Heading: `Payment details`; `Check the payment` on the review step; `Payment recorded` on the last step. At the right end of the heading row, the step as a small figure: `Step 1 of 3 · Details`, then `Step 2 of 3 · Review` and `Step 3 of 3 · Done`.

Under the heading row, one plain `<div>` holds the form or the review, then the confirmation element, on the page from the start and empty, then, after a payment, the confirmation's row of buttons.

**The form.** A `<form>` with `noValidate`, a stack with `gap-4`; every field is at most `max-w-md` wide.

- **From:** a `<select>` "From account" with the two accounts, each option reading `Current account · ending 4417`. Helper text: the chosen account's available balance, `£48,213.56 available`.
- **Payee:** a `<select>` "Payee" whose first option, "Choose a payee", has an empty value, then the four payees. Helper text: the chosen payee's details, `Sort code 40-11-62 · Account 70119382`, or nothing while none is chosen.
- **Amount:** a field "Amount": the `£` sign as a small figure in `text-foreground`, then the `Input` with `inputMode="decimal"`, side by side in a row with `flex w-48 items-center gap-2`; the label, helper and error lines keep the form's width. Helper text: "Up to £10,000.00 a payment."
- **Reference:** an `Input` "Reference". Helper text: "Up to 18 letters, numbers and spaces. The payee sees this."
- **Date:** an `Input` with `type="date"` "Pay on", set to today, 27 November 2026. Helper text: "Today, or a later day up to and including 26 January 2027."
- **Buttons:** a row with `flex flex-wrap gap-2`: the default button "Review payment" with `type="submit"`, and an `outline` link styled as a button, "Cancel", to `/`.

**The review.** It takes the form's place in the wrapper. A stack with `gap-6`:

- A stack with `gap-1`: the label "You are sending", the amount as a key figure in `text-h1`, `£1,240.50`, and under it the amount in words, a `<p>` in `text-body text-foreground`. Give this `<p>` `tabIndex={-1}` and move focus to it when the review appears.
- A `<dl>` of five rows, each `flex items-baseline justify-between gap-3 py-2`, a 1px top border on all but the first; the `<dt>` is a label in `text-muted-foreground`, the `<dd>` has `text-right`. From (the chosen option's text in `text-body`), To (a stack with `gap-1 items-end`: the payee in `text-body`, then its sort code and account number as a small figure), Reference (`font-mono`), Pay on (`font-mono tabular-nums`: a `<time>`, `27 Nov 2026`, with "Today, " before it when it is today) and Balance after (`font-mono tabular-nums`, the available balance less the amount).
- In `text-body`: "Check the payee's details. A payment cannot be called back once it is sent."
- A row with `flex flex-wrap gap-2`: the default button "Send payment" and an `outline` button "Change details".

**The confirmation.** Inside the confirmation element, rendered only after a payment, a stack with `gap-3` and no top margin (here, instead of the Confirmations note's `mt-3`: nothing stands above it in the wrapper then, and the sheet's `gap-3` spaces it from the heading row): a `<p>` in `font-heading text-h2 tabular-nums`, the amount and the payee, "£1,240.50 to Copperleaf Paper Mill"; one sentence in `text-body`, "From the current account, on 27 November 2026." ("From the tax reserve, on …" for the other account), with the Pay on date written out; and one sentence in `text-body`: "This is a demo: no money left the account and nothing was sent anywhere." After the confirmation element, not inside it, a row with `mt-6 flex flex-wrap items-center gap-2` holding a `secondary` button "Make another payment" and a text link "Back to overview" (`/`).

### 4. Side column

Four columns from `lg` up, full width below: a sheet with rows. Heading: `Good to know`. Two rows in `text-body`: payments for today go out within two hours, later ones at 06:00 on their day; the limit is £10,000.00 a payment.

### Amounts in words

Pounds, then pence; only the first letter capitalised; "and" before the tens and units of each hundreds group; a comma after "thousand" when hundreds follow; hyphenated tens and units; "pound" and "penny" for one; no "and zero pence". Examples:

- `£1,240.50`: "One thousand, two hundred and forty pounds and fifty pence"
- `£1,005.00`: "One thousand and five pounds"; `£300.01`: "Three hundred pounds and one penny"; `£1.00`: "One pound"; `£0.75`: "Seventy-five pence"

### Behavior

- "Review payment" checks every field in code. Each error, with its text:
  - Payee: "Choose who to pay."
  - Amount empty: "Enter an amount." Anything but digits with an optional point and one or two digits after it (`240.5` is one; `240.` and `.5` are not), or zero: "Enter an amount in pounds and pence, such as 240.50." Check the balance before the limit. Above the chosen account's balance: "That is more than the £13,690.71 available in this account.", with that account's figure. Within the balance but above £10,000.00: "The most you can send in one payment is £10,000.00."
  - Reference empty: "Enter a reference the payee will recognise." Over 18 characters, or anything but letters, numbers and spaces: "Use up to 18 letters, numbers and spaces."
  - Pay on empty: "Enter a date." Before today: "Choose today or a later date." After 26 January 2027, which is still allowed: "Choose a date up to 26 January 2027."
- The amount ignores spaces, commas and a leading `£`. The field keeps what was typed, also after "Change details"; the review, the confirmation and the balance after show it with two decimals and a thousands comma (`1240.5` reads `£1,240.50`). The reference is trimmed at both ends before it is checked and shown, so a reference of only spaces is empty; spaces inside it count toward the 18. The Amount's error is also removed when From changes.
- With no errors, the review replaces the form.
- "Change details" brings back the form, values kept, and focuses From.
- "Send payment" removes the review, fills the confirmation element and moves focus to the sheet's `<h2>`, now "Payment recorded", which has `tabIndex={-1}` (here, instead of the Confirmations note's focus on the message's first element, so that the message is not read twice). The balances do not change.
- "Make another payment" empties the confirmation, removes its row of buttons, brings back an empty form (today's date, the current account) and moves focus to From.
