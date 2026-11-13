---
page: invoice
title: Invoice
description: one invoice set as a document on a white sheet, with who it is from and to, its number and dates, line items with subtotal, tax and total, its state, payment details and a way to mark it as paid.
order: 3
checks:
  - The line items are a table with no `<tfoot>`, followed by a `<dl>` of the subtotal, the VAT and the total that is readable at 375px without scrolling the table, and only the total sits under a double rule, in the heading font with no bold, semibold or medium class.
  - The addresses are `<address>` elements and the numbers and dates are description lists (`<dl>`), with every date in a `<time>`.
  - The invoice's state is a mark and a word on the document and in the status sheet, and the "Due" badge is brass with dark text.
  - Clicking "Mark as paid" changes the state to Paid in both places, sets the amount due to £0.00, adds an activity row, announces the change and leaves the button disabled but focusable.
---

Sample content, if the user gave none: "Fairhold", a banking and invoicing service for small businesses. The invoice is `INV-0142` from "Hollis & Vane", a two-person print studio (Hollis & Vane Ltd, Unit 4, Tanner's Yard, Kestle KS3 9QT, VAT number GB 318 4402 17), to "Larkspur Café" (Accounts, 18 Mill Row, Kestle KS1 4DE). It was issued on 13 November 2026 and is due today, 27 November. Four lines: menu cards (400 at £1.10, £440.00), table tents (120 at £2.50, £300.00), window posters (6 at £45.00, £270.00) and design and proofing (1 at £230.00). Subtotal £1,240.00, VAT at 20% £248.00, total £1,488.00.

This page uses the stock `button`, `badge` and `table`; add any the project lacks with `npx shadcn@latest add button badge table`.

Build these parts in order; the footer is as the layout notes describe it.

### 1. Header

The product's name, five nav links (Overview, Transactions, Invoices, Payments, Reports) with Invoices as the current page, and at the right end the business's name as a small figure, hidden below `md`, where the notes' "Menu" button takes the right end. Nav links go to the notes' paths.

### 2. Page header

Above the heading, the label "Invoice". The `<h1>` "INV-0142". The actions are an `outline` button "Download PDF" and the default button "Mark as paid".

### 3. The document

A grid row. The document is a sheet spanning eight columns from `lg` up, full width below, with `p-6` and `md:p-12` in place of the sheet's usual padding, so it reads as a page of paper. It is an `<article>` named by its title with `aria-labelledby`, and a `flex flex-col gap-12` with no heading row. Its parts:

**Letterhead.** A row, `flex flex-wrap items-start justify-between gap-6`. On the left, a stack with `gap-2`: the business's name in `font-heading text-h2` (a `<p>`, not a heading), an `<address>` in `text-body` with `not-italic`, one line each: "Hollis & Vane Ltd", "Unit 4, Tanner's Yard" and "Kestle KS3 9QT"; then, after the `<address>` and not inside it, the VAT number as a small figure in a `<p>`, `VAT GB 318 4402 17`. On the right, a stack with `gap-1`, its lines left-aligned (the default), not flush right: the title, an `<h2>` "Invoice" in `text-h2`, the number `INV-0142` as a small figure in `text-foreground`, and the state: a `bg-muted-foreground` mark and "Sent", until it is marked as paid (see Behavior). The state is a direct item of the stack, with no wrapper: stretched to the stack's width, it looks the same.

**Parties and dates.** A grid, `grid grid-cols-1 gap-6 md:grid-cols-2`.

- On the left a stack with `gap-2`: the label heading "Bill to" (an `<h3>`) and the client's `<address>`, set as above with four lines: "Larkspur Café", "Accounts", "18 Mill Row" and "Kestle KS1 4DE".
- On the right a `<dl>` with four rows: Invoice number, Issued, Due and Your reference (`LC-PO-2211`). Each row is `flex items-baseline justify-between gap-3 py-2` with a 1px top border except the first: the `<dt>` as a label in `text-muted-foreground`, the `<dd>` in `font-mono tabular-nums text-right`, which the row's `justify-between` puts at its right end. The dates are `<time>` elements, `13 Nov 2026` and `27 Nov 2026`.

**Line items.** The shadcn `Table` with the label "Line items" and four columns: Description, Quantity, Unit price and Amount; the last three right-aligned, headers too. This table sits in a padded sheet, so the first and last cells of every row, the header row included, get `first:pl-0 last:pr-0` in place of the sheet-with-rows padding, and its edges line up with the text above. Description cells hold a sentence and get `whitespace-normal`, with a `min-w-48` on that column's header so the column does not collapse on a phone. On a phone the table scrolls in its box.

**Totals.** Here, instead of the Totals note's `<tfoot>`, the totals are a `<dl>` under the table, so that on a phone they stay in view while the table scrolls. The table and the `<dl>` share a wrapper `<div>` with `flex flex-col` and no gap. The `<dl>` is `flex w-full flex-col self-end md:max-w-sm`: full width on a phone, and from `md` up a block whose right edge is the Amount column's. Three rows, each `flex items-baseline justify-between gap-3 py-2`:

1. "Subtotal" as a `<dt>` label in `text-muted-foreground`, `£1,240.00` as a `<dd>` in `font-mono tabular-nums text-foreground`, with `border-t border-border`, which continues the table's row rules.
2. "VAT 20%" the same way, `£248.00`.
3. The total, with `border-t-4 border-double border-foreground` and `font-heading text-h2 tabular-nums` on the row: "Total" and `£1,488.00`.

None of these amounts has a sign or a color: an invoice states what is owed, not money in or out.

**Payment details.** A stack with `gap-3`, with a 1px top border and `pt-6`: the label heading "Payment details" (an `<h3>`), one sentence in `text-body`, "Pay by bank transfer within 14 days, quoting the invoice number.", and a `<dl>` set like the one above with Account name (Hollis & Vane Ltd, in `text-body`, not mono), Sort code `60-14-22`, Account number `31884417` and Reference `INV-0142`. The `<dl>` is `w-full max-w-md`; the sentence keeps the paragraph's `max-w-lg`.

### 4. Side column

Four columns from `lg` up, full width below: two sheets stacked with `gap-6`, the second growing to fill the column (`flex-1`).

**Status.** Heading: `Status`, with the badge "Due" at the right end of the heading row. Then a stack with `gap-3`:

- A row, `flex flex-wrap items-center gap-2`: the state, a mark and a word, "Sent", then a small figure, `Due 27 Nov 2026`, with the date in a `<time>`.
- A plain `<div>` holding the label "Amount due" over the key figure `£1,488.00` in `text-h1`, as a stack with `gap-1`, and after that stack the confirmation element, empty at first.

**Activity.** A sheet with rows. Heading: `Activity`. Three rows, newest first, each a stack with `gap-1`: a sentence in `text-body` and, under it, the date as a small figure in a `<time>`. "Viewed by Larkspur Café" (`24 Nov 2026`), "Sent to accounts@larkspur.example" (`13 Nov 2026`), with the address in mono, and "Created by Ada Hollis" (`13 Nov 2026`).

### Behavior

- "Mark as paid" changes, together: the state on the document and in the status sheet to "Paid" with a `bg-primary` mark; the small figure beside the status to `Paid 27 Nov 2026`, the date still in a `<time>`; the "Due" badge, which goes away; the amount due, to `£0.00`; and the activity list, which gets a new first row, "Marked as paid by Ada Hollis" (`27 Nov 2026`). The line items and the total do not change.
- It then disables itself with `focusableWhenDisabled` (so this page needs the `data-disabled:` classes of the Buttons note) and puts "Invoice INV-0142 marked as paid." into the confirmation element, as a `<p>` in `text-body` with `mt-3`. A second click does nothing.
- "Download PDF" and the nav links need no behavior.
