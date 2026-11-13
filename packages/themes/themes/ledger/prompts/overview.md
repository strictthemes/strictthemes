---
page: account overview
title: Overview
description: the overview screen of a small-business banking and invoicing product, with account balances, money in and out for the month, the things that wait on the user and recent transactions.
order: 1
checks:
  - Every balance is in the heading font at its one weight, with no `font-bold`, `font-semibold` or `font-medium` on it, and amounts in the table are right-aligned mono figures.
  - Every amount in or out in the recent transactions has a word ("In" or "Out") and a sign, and money out uses the minus sign U+2212, not a hyphen.
  - The chart has a legend in words, the in bar always comes before the out bar, and a text alternative gives both amounts for every week.
  - The "Approve" button changes the payment's state in words, removes its badge, announces the change and leaves the button disabled but focusable.
  - Badges are brass with dark text and stand only on items that wait on the user.
---

Sample content, if the user gave none: "Fairhold", a banking and invoicing service for small businesses. The business is "Hollis & Vane", a two-person print studio; the signed-in person is Ada Hollis. It has two accounts: a current account (sort code 60-14-22, ending 4417, £48,213.56) and a tax reserve (ending 8830, £13,690.71). In November so far £18,420.00 came in and £11,962.38 went out. Invent the payees, the clients and the rest of the figures; keep them believable for a small studio.

This page uses the stock `button`, `badge` and `table`; add any the project lacks with `npx shadcn@latest add button badge table`.

Build these parts in order; the footer is as the layout notes describe it.

### 1. Header

The product's name, five nav links (Overview, Transactions, Invoices, Payments, Reports) with Overview as the current page, and at the right end the business's name as a small figure, hidden below `md`, where the notes' "Menu" button takes the right end. Nav links go to the notes' paths.

### 2. Page header

Above the heading, today's date as a small figure in a `<time>` (`dateTime="2026-11-27"`), "Friday 27 November 2026": here, instead of the Dates note's `27 Nov 2026`, the long form with the day's name. The `<h1>` "Overview". The actions are two links styled as buttons: `outline` "New invoice" (`#`) and the default "Make a payment" (`/payment`).

### 3. Balances

A grid row of three sheets, four columns each from `lg` up, stacked below. None has a heading row: each is a stack with `gap-1`, and its label is an `<h2>` styled as a label, so the figure sits under a heading.

- **Total.** The label "Total balance", then the key figure in display (`text-h1 xl:text-display`), `£61,904.27`, then a small figure, "Across 2 accounts".
- **Current account.** The label "Current account", then the key figure in `text-h1`, `£48,213.56`, then a small figure with the sort code and the last four digits joined with ` · ` (`60-14-22 · ending 4417`).
- **Tax reserve.** The label "Tax reserve", the key figure `£13,690.71` in `text-h1`, then one small figure with the purpose and the last four digits joined the same way: `Set aside for VAT and tax · ending 8830`.

### 4. Money in and out

A sheet, eight columns from `lg` up, full width below. The grid stretches it to the height of its neighbour. Under the heading row, one `<div>` with `flex flex-1 flex-col gap-6` holds the figures and then the chart, its last item, a wrapper with `flex flex-1 flex-col justify-end`: any extra height goes above the chart, between the figures and the plot, so the chart's foot stays at the sheet's foot. The plot keeps its fixed `h-48`.

Heading: `Money in and out, November`. At the right end of the heading row, the legend: two items with `gap-4`, each `inline-flex items-center gap-2`: a `size-2` square in `bg-primary` or `bg-destructive` (`rounded-sm`, `aria-hidden="true"`) and the word "In" or "Out" as a label.

Under the heading row, two figures side by side in a `flex flex-wrap gap-6`, each a stack with `gap-1`: the label "In this month" over `+£18,420.00` and the label "Out this month" over `−£11,962.38`, both in `font-mono text-body tabular-nums text-foreground`. Here, instead of the Signed amounts note, there is no word before the figure and no color: the label says which is which.

Then the chart, four weeks of November: 2–8, 9–15, 16–22 and 23–27 (to date). The chart is two columns with `gap-2`: the scale's values in a column of their own (`relative h-48 w-12`, the plot's height, small figures, each `absolute right-0`), and the plot, `h-48` (a fixed height for the bars' percentage heights), over three horizontal grid lines at zero, half and the top of the scale. `£8k` is at `top-0` and hangs under its line, `£4k` is at `top-1/2 -translate-y-1/2`, centered on its line, and `£0` is at `bottom-0` and stands on its line, so no value sticks out of the plot's height. No week's bar is above £8k. The plot holds four week groups in a row with `gap-4`, each group `flex-1 min-w-0`: two bars side by side with `gap-1`, the in bar first and the out bar second, each bar's height a share of the plot from an inline `style`. Under the plot, in its column (a `flex flex-col gap-2`: the plot, then the cells), four cells with the same `gap-4` and `flex-1 min-w-0`, one under each group: the week's days as a small figure, centered and not wrapped, without the month, which the heading gives (`2–8`, `9–15`, `16–22`); the last one reads `23–27` in `text-foreground`. A label is then narrower than its cell at 375px, and nothing in the chart runs past the sheet.

The text alternative is a table of each week's money in and out, inside a `<div>` with `sr-only` (the class does not work on a `<table>` itself); the drawing has `aria-hidden="true"`. Make it a plain `<table>` with `<th scope="col">` and `<th scope="row">` cells, not the stock `Table`, whose scroll box takes keyboard focus. Give every `<th>` in it `font-normal`, against the browser's bold.

### 5. Waiting on you

A sheet with rows, four columns from `lg` up, full width below. Heading: `Waiting on you`, with the count as a small figure at the right end of the heading row (`3 items`). Three rows, each a stack with `gap-1`. Each row's sentence is a `<p>` in `text-body` with `max-w-lg`, as the Measure note asks of a paragraph.

1. A first line, `flex items-start justify-between gap-3`: the invoice number `INV-0142` as a text link in `font-mono` to `/invoice`, and the badge "Due". Then one sentence in `text-body`: "Larkspur Café owes £1,488.00, due today." Then the due date as a small figure, the word and the date: `Due 27 Nov 2026`, with the date in a `<time>`.
2. The same shape for `INV-0137` (its link is `#`), with no badge and, in its place, the state "Overdue" (a `bg-destructive` mark and the word): "Brennan Wholesale owes £640.00, 9 days late.", and the small figure `Due 18 Nov 2026`.
3. A payment to approve: the first line holds the payee's name, "Copperleaf Paper Mill", in `text-body`, and the badge "To approve". Then one sentence: "Tom Vane set up a payment of £2,350.00 from the current account, to go on 30 November." This row alone is a stack with `gap-3`: a stack with `gap-1` of the first line and the sentence, then a plain `<div>` holding a `secondary` button "Approve" and, after it, the confirmation element. So the button sits 12px under the sentence, not 4px.

### 6. Recent transactions

A sheet with rows, directly in the container and full width, not in a grid. Heading: `Recent transactions`, with a link "All transactions" (`/transactions`) at the right end of the heading row.

A table with six rows, newest first, and the columns Date (a `<time>`, mono, such as `26 Nov`), Description (a stack with `gap-1`: the payee or payer, then the reference as a small figure), Account ("Current" or "Tax reserve") and Amount (a signed amount, right-aligned, with a right-aligned header). Mix four payments out (rent, paper stock, a software bill, and the quarter's VAT from the tax reserve, the one "Tax reserve" row, described as "VAT payment" with no tax office named) with two in (client payments). There is no total row.

### Behavior

- "Approve" removes the "To approve" badge and puts, in its place at the end of the first line, the state "Approved" with a `bg-primary` mark and the word, disables itself with `focusableWhenDisabled` (so this page needs the `data-disabled:` classes of the Buttons note), changes the count in the heading row to `2 items`, and puts "Approved. It goes on 30 November." into the confirmation element under it, as a `<p>` with `mt-2`, a small figure in `text-foreground`. Nothing else changes.
- The links need no behavior beyond their `href`.
