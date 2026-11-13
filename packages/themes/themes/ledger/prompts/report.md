---
page: yearly report
title: Report
description: a yearly report on a small business's money, made for reading, with three very large figures, a short commentary, a table of the year by quarter and notes.
order: 5
checks:
  - The three key figures are in the heading font at `text-display`, at its one weight, and none of them runs out of its column at 375px, 768px or 1280px.
  - The quarter table has its amounts right-aligned in mono figures, a total row in a `<tfoot>` under a double rule, and the loss in the second quarter shown with a minus sign and the word "Loss".
  - Every note marker in the text is a link to its note, and the notes are an ordered list whose items have the `id`s the markers point to.
  - No paragraph in `text-body` is wider than `max-w-lg`, and none of them is muted.
---

Sample content, if the user gave none: "Fairhold", a banking and invoicing service for small businesses, has prepared the yearly report of "Hollis & Vane Ltd", a two-person print studio, for the year from 1 October 2025 to 30 September 2026, on 20 November 2026. Figures are rounded to whole pounds on this page, so they have no pence: here, instead of the Money note's two decimals, `£412,860` and `−£4,180`. Income £412,860, up 14% on last year; costs £356,240, up 11%; profit before tax £56,620, up 37%. By quarter (income, costs, net, margin, cash at the end of the quarter): Q1, Oct to Dec 2025: £98,420, £79,310, profit £19,110, 19.4%, £38,250. Q2, Jan to Mar 2026: £84,950, £89,130, loss £4,180, −4.9%, £29,870. Q3, Apr to Jun 2026: £109,760, £90,420, profit £19,340, 17.6%, £44,120. Q4, Jul to Sep 2026: £119,730, £97,380, profit £22,350, 18.7%, £54,310. The year: margin 13.7%, cash at the end £54,310. The loss in Q2 came from a new folding machine (£18,400, February).

This page is for reading. On it, the container inside `<main>` is `flex flex-col gap-12`: the page header and four sections, each a `<section>` named by its `<h2>` with `aria-labelledby` and laid out as `flex flex-col gap-6`. Each section's `<h2>` is in `text-h2`, the serif.

This page uses the stock `button` and `table`; add any the project lacks with `npx shadcn@latest add button table`.

Build these parts in order; the footer is as the layout notes describe it.

### 1. Header

The product's name, five nav links (Overview, Transactions, Invoices, Payments, Reports) with Reports as the current page, and at the right end the business's name as a small figure, hidden below `md`, where the notes' "Menu" button takes the right end. Nav links go to the notes' paths.

### 2. Page header

Above the heading, the label "Yearly report". The `<h1>` "The year to 30 September 2026". One action: an `outline` button "Download PDF".

### 3. The year in figures

Heading: "The year in figures". Under it a `<dl>` laid out as `grid grid-cols-1 gap-6 lg:grid-cols-3`: three columns from `lg` up, stacked below, because a display figure does not fit a third of a tablet's width. Each item is a `<div>`, a stack with `gap-2` (here, not the Key figures note's `gap-1`: a sentence follows the figure), with a 1px top rule (`border-t border-border`) and `pt-3`:

- The `<dt>`, a label: "Income", "Costs", "Profit before tax".
- The `<dd>`, the figure in `font-heading text-display tabular-nums` at every width (here, instead of the Key figures note's `text-h1 xl:text-display`: these columns are wide enough), `£412,860`. No sign and no color: the label says what it is.
- A second `<dd>` in `text-body`, the change in words: "Up 14% on last year." It has no icon and no color: on these pages green and red mean money in and out, not better or worse.

### 4. Commentary

Heading: "What happened". Three short paragraphs in a stack with `gap-4`, each at most `max-w-lg` wide, written plainly in the first person plural of the business, about 60 words each: income grew with two new café clients and a busy summer of event print; costs rose with paper prices, about 9% over the year; the second quarter was a loss because the folding machine was paid for in February, and cash was lowest at the end of March.

Where a sentence relies on a note, it ends with a note marker, in order: the first paragraph's sentence with the year's income ends with marker 1, the second paragraph's sentence about paper prices with marker 2, the third paragraph's sentence about the folding machine with marker 3. A marker is a `<sup>` with `text-label` (a bare `<sup>` gets a size outside the type scale) in the body font, with no `font-mono`, and `relative -top-1 align-baseline` (so it does not open up its line), holding a text link to the note, `#note-2`, with the number as its text and the `aria-label` "Note 2". Note 4 has no marker.

### 5. By quarter

Heading: "By quarter". One sentence above the table in `text-body`, at most `max-w-lg` wide: "Income and costs exclude VAT. Cash is the balance of both accounts on the last day of each quarter."

Then a sheet with rows holding the table and no heading row of its own: the section's `<h2>` names it. The table has the label "The year by quarter" and these columns: Quarter, Income, Costs, Net, Margin and Cash at end; every column but the first is right-aligned, headers too. The Quarter cells and the total row's "Year" cell are `TableCell`s, not row headers. Each Quarter cell holds a `<div>` with `flex flex-col gap-1` (not on the `<td>` itself): the quarter, `Q1`, in `text-body`, and the months as a small figure, `Oct–Dec 2025`.

- **Income, Costs and Cash at end** are mono figures with no sign and no color.
- **Net** is a signed amount whose word is "Profit" or "Loss" in place of "In" and "Out": a profit is `text-primary` with a plus sign, the loss `text-destructive` with the minus sign U+2212.
- **Margin** is a mono figure with one decimal and a `%`, with the minus sign for the loss and no color.

The `<tfoot>` has one row, the total row, under the double rule: "Year" and the year's income, costs, net and margin, and the cash at the end of the year, all in `font-heading text-h2 tabular-nums`. "Year" is set like the figures, not as a label, so it takes the row's text color. The net is a signed amount as in the body rows: the word "Profit" as a label in `text-muted-foreground` (`font-mono text-label uppercase`, not the heading font), then `+£56,620` in `font-heading text-h2 tabular-nums text-primary`, with its plus sign. The margin, `13.7%`, and the other figures have no sign and no color. The table scrolls in its box on a phone.

### 6. Notes

Heading: "Notes". An `<ol>` with `list-decimal pl-6`, laid out as `flex flex-col gap-2`, each item in `text-body`, at most `max-w-lg` wide, with the `id` its marker points to (`note-1` to `note-4`):

1. Figures are rounded to the nearest pound and are before corporation tax.
2. Paper prices are the average of the studio's orders from Copperleaf Paper Mill in each quarter.
3. The folding machine is counted in full as a cost in February. The statutory accounts spread it over five years, so their profit for the year will be higher.
4. Transfers between the current account and the tax reserve are left out of income and costs.

After the list, as the section's last item, a small figure: "Prepared by Fairhold on 20 November 2026 from the records of both accounts.", with the date in a `<time>`.

### Behavior

- The page has no state but the small-screen menu's. The note markers jump to their notes; the browser handles focus and scrolling.
- "Download PDF" and the nav links need no behavior.
