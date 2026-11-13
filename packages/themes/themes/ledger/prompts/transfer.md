---
page: payment form
title: Payment
description: a form to send a payment from a business account, with checks on every field, a review step that states the amount in words, and a confirmation that says nothing was sent.
order: 4
checks:
  - Sending the form with empty or wrong fields shows an error in words with an icon under each field, tied with `aria-describedby`, and moves focus to the first field with an error.
  - The review step states the amount in figures and in words (£1,240.50 is "One thousand, two hundred and forty pounds and fifty pence"), and "Change details" goes back with every value kept.
  - After "Send payment" a confirmation is announced from a `role="status"` element that was on the page from the start, it says that nothing was sent, and focus moves to the sheet's heading, now "Payment recorded".
  - An amount above the account's available balance or above £10,000.00 is refused with its own error message.
  - 'From and Payee are the theme''s `Select` and Pay on is a button that opens the theme''s calendar, with no native `<select>` or date input on the page: each popup opens under its trigger with a 1px border, the chosen row has a check, today is underlined in the calendar, days before today or after 26 January 2027 cannot be chosen, and the arrow keys, Enter and Escape work in all three.'
---

Sample content, if the user gave none: "Fairhold", a banking and invoicing service for small businesses, used by "Hollis & Vane", a two-person print studio. Two accounts to pay from: the current account (ending 4417, £48,213.56 available) and the tax reserve (ending 8830, £13,690.71 available). Four saved payees, each with a sort code and an account number: Copperleaf Paper Mill (40-11-62, 70119382), Brightwater Inks (20-45-17, 53817204), Kestle Property Lettings (30-92-08, 11640395) and Marlowe Van Leasing (60-83-41, 92054718).

This page uses the stock `button`, `input`, `select`, `popover` and `calendar`; add any the project lacks with `npx shadcn@latest add button input select popover calendar`.

Build these parts in order; the footer is as the layout notes describe it.

### 1. Header

The product's name, five nav links (Overview, Transactions, Invoices, Payments, Reports) with Payments as the current page, and at the right end the business's name as a small figure, hidden below `md`, where the notes' "Menu" button takes the right end. Nav links go to the notes' paths.

### 2. Page header

Above the heading, the label "Payments". The `<h1>` "Make a payment". No actions.

### 3. Payment sheet

A grid row: the payment sheet spans eight columns from `lg` up. Heading: `Payment details`; `Check the payment` on the review step; `Payment recorded` on the last step. At the right end of the heading row, the step as a small figure: `Step 1 of 3 · Details`, then `Step 2 of 3 · Review` and `Step 3 of 3 · Done`.

Under the heading row, one plain `<div>` holds the form or the review, then the confirmation element, on the page from the start and empty, then, after a payment, the confirmation's row of buttons.

**The form.** A `<form>` with `noValidate`, a stack with `gap-4`; every field is at most `max-w-md` wide.

- **From:** a `Select` "From account" with the two accounts, each choice reading `Current account · ending 4417`. Helper text: the chosen account's available balance, `£48,213.56 available`.
- **Payee:** a `Select` "Payee" with the four payees and, while none is chosen, the placeholder "Choose a payee". Helper text: the chosen payee's details, `Sort code 40-11-62 · Account 70119382`, or nothing while none is chosen.
- **Amount:** a field "Amount": the `£` sign as a small figure in `text-foreground`, then the `Input` with `inputMode="decimal"`, side by side in a row with `flex w-48 items-center gap-2`; the label, helper and error lines keep the form's width. Helper text: "Up to £10,000.00 a payment."
- **Reference:** an `Input` "Reference". Helper text: "Up to 18 letters, numbers and spaces. The payee sees this."
- **Date:** a date picker "Pay on", set to today, 27 November 2026: a button that looks like the selects and opens the project's `Calendar` in a `Popover`. Never an `<input type="date">`, whose picker the browser draws. Helper text: "Today, or a later day up to and including 26 January 2027." How to build it is under "The date picker" below.
- **Buttons:** a row with `flex flex-wrap gap-2`: the default button "Review payment" with `type="submit"`, and an `outline` link styled as a button, "Cancel", to `/`.

**The review.** It takes the form's place in the wrapper. A stack with `gap-6`:

- A stack with `gap-1`: the label "You are sending", the amount as a key figure in `text-h1`, `£1,240.50`, and under it the amount in words, a `<p>` in `text-body text-foreground`. Give this `<p>` `tabIndex={-1}` and move focus to it when the review appears.
- A `<dl>` of five rows, each `flex items-baseline justify-between gap-3 py-2`, a 1px top border on all but the first; the `<dt>` is a label in `text-muted-foreground`, the `<dd>` has `text-right`. From (the chosen account's label in `text-body`), To (a stack with `gap-1 items-end`: the payee in `text-body`, then its sort code and account number as a small figure), Reference (`font-mono`), Pay on (`font-mono tabular-nums`: a `<time>`, `27 Nov 2026`, with "Today, " before it when it is today) and Balance after (`font-mono tabular-nums`, the available balance less the amount).
- In `text-body`: "Check the payee's details. A payment cannot be called back once it is sent."
- A row with `flex flex-wrap gap-2`: the default button "Send payment" and an `outline` button "Change details".

**The confirmation.** Inside the confirmation element, rendered only after a payment, a stack with `gap-3` and no top margin (here, instead of the Confirmations note's `mt-3`: nothing stands above it in the wrapper then, and the sheet's `gap-3` spaces it from the heading row): a `<p>` in `font-heading text-h2 tabular-nums`, the amount and the payee, "£1,240.50 to Copperleaf Paper Mill"; one sentence in `text-body`, "From the current account, on 27 November 2026." ("From the tax reserve, on …" for the other account), with the Pay on date written out; and one sentence in `text-body`: "This is a demo: no money left the account and nothing was sent anywhere." After the confirmation element, not inside it, a row with `mt-6 flex flex-wrap items-center gap-2` holding a `secondary` button "Make another payment" and a text link "Back to overview" (`/`).

### The date picker

Write it as a small component beside the page, around `Popover`, `PopoverTrigger`, `PopoverContent` and `Calendar`. Keep `open` in state.

**The trigger.** The `PopoverTrigger` with the `id` the field's `<label>` points to, the field's `aria-describedby`, and `flex h-8 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-2 text-body whitespace-nowrap transition-colors outline-none focus-visible:border-ring` plus the outline classes of the Focus rule: the look of the select's trigger. In it, the date as the Dates note writes one that stands on its own, with the year, since the picker can leave 2026: a `<time>` with `font-mono tabular-nums`, `27 Nov 2026`, and its `dateTime`. Then the `Calendar` icon of the Icons note in `text-muted-foreground` with `shrink-0`. `px-2` on both sides is meant here: this icon is drawn almost to the edge of its box, where the chevron is not. Give the `<label>` and the `<time>` an `id` each and name both in the trigger's `aria-labelledby`, label first, so that it reads "Pay on 27 Nov 2026": a `<label htmlFor>` alone would hide the date from a screen reader.

**The popup.** `<PopoverContent align="start" className="w-auto">`, so it opens under the trigger's left edge at the calendar's own width (274px, which fits a phone). In `components/ui/popover.tsx`, on the popup, replace its stock gap and padding with `gap-2 p-3`, its small text size with `text-body`, and `shadow-md ring-1 ring-foreground/10` with `border border-border shadow-sm`, as on the select's list. A popover moves focus to the first thing in it that takes focus, the "previous month" arrow: wrap the `Calendar` in a `<div>` with a ref and give `PopoverContent` an `initialFocus` function that returns that `<div>`'s `td button[tabindex="0"]`, the chosen day.

**The calendar.** `<Calendar mode="single" required weekStartsOn={1} today={…} selected={…} defaultMonth={…} startMonth={…} endMonth={…} disabled={{ before: …, after: … }} onSelect={…} />`. `today` is the sample's today, not the device clock. `startMonth`, `endMonth` and `disabled` take today and 26 January 2027: days outside them are shown but cannot be chosen, and the arrows stop at November 2026 and January 2027. `required` keeps a click on the chosen day from clearing it. `onSelect` stores the date and closes the popover; focus goes back to the trigger by itself. Edit `components/ui/calendar.tsx`, once, changing the classes in the file:

- The root: replace its padding with `p-0`, since the popup pads it, and `[--cell-size:--spacing(7)]` with `[--cell-size:--spacing(8)]`, a 32px day. Its `[--cell-radius:var(--radius-md)]` stays: 3px, a button's corner.
- `month`: replace its stock gap with `gap-3`, the distance between a heading row and its content.
- `button_previous` and `button_next`: add `hover:bg-accent dark:hover:bg-accent` to the classes after `buttonVariants(…)`. The ghost button's own hover fill cannot be told from the popup in dark mode. The library names the two for screen readers.
- `caption_label`: replace the small text size of the `"label"` layout with `font-mono text-label uppercase`. The month's name is a label in the text color, like a sheet's heading: `NOVEMBER 2026`.
- `weekdays`: `flex gap-1`. `weekday`: replace its arbitrary text size and `font-normal` with `font-mono text-label uppercase`; `text-muted-foreground` stays.
- `week`: replace its top margin with `mt-1` and add `gap-1`: one 4px gutter across and down, which is also where the focus outline of a day fits.
- `today`: replace the whole string with `text-foreground`. A grey fill on the cell would mark today by color alone, under the day's button.
- The `Chevron` component: give `ChevronLeftIcon` and `ChevronRightIcon` `strokeWidth={1.5}`.
- `CalendarDayButton`: in its class list, delete the three `group-data-[focused=true]/day:` classes that draw a ring (`border-ring`, `ring-[3px]`, `ring-ring/50`): the outline `button.tsx` already has shows on keyboard focus. Add `font-mono text-body tabular-nums hover:bg-accent group-data-[today=true]/day:underline group-data-[today=true]/day:underline-offset-4`, and after `dark:hover:text-foreground` add `dark:hover:bg-accent`, or in dark mode a hovered day shows nothing. Replace the small text size in `[&>span]:` with `text-label`. `calendar.tsx` must import `cn` from the utils file, or `text-body` does not replace the button's own size.

The result: day figures in mono; the chosen day in `bg-primary` with `text-primary-foreground`, the stock classes; today underlined, as the current page is in the nav, also when it is the chosen day; days of the next month in `text-muted-foreground`; days that cannot be chosen paler still.

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
  - Reference empty: "Enter a reference the payee will recognise." Over 18 characters, or anything but the letters A to Z (either case, no accents), numbers and spaces: "Use up to 18 letters, numbers and spaces."
  - Pay on has no error: a date is always chosen, and the calendar does not let a day before today or after 26 January 2027 be chosen.
- The amount ignores spaces, commas and a leading `£`. The field keeps what was typed, also after "Change details"; the review, the confirmation and the balance after show it with two decimals and a thousands comma (`1240.5` reads `£1,240.50`). Spaces inside the reference count toward the 18. The Amount's error is also removed when From changes.
- With no errors, the review replaces the form.
- "Change details" brings back the form, values kept, and focuses From.
- "Send payment" removes the review, fills the confirmation element and moves focus to the sheet's `<h2>`, now "Payment recorded", which has `tabIndex={-1}` (here, instead of the Confirmations note's focus on the message's first element, so that the message is not read twice). The balances do not change.
- "Make another payment" empties the confirmation, removes its row of buttons, brings back an empty form (today's date, the current account) and moves focus to From.
