---
page: statement
title: Transactions
description: a statement of a business's transactions, with search, an account filter and an in/out filter, a total row that follows the filters, paging and an empty state.
order: 2
checks:
  - Search, the account filter and the in/out filter work together, and changing any of them goes back to page 1.
  - Every amount is right-aligned in mono figures with `tabular-nums`, money out has the word "Out" and the minus sign U+2212, and money in the word "In" and a plus sign.
  - The total rows sum every transaction that matches the filters, on all pages, and change when a filter changes; the net row sits under a double rule in the heading font at its one weight.
  - Previous and Next are disabled at their end of the list and keep keyboard focus when they disable themselves.
  - An empty result shows a sentence and a "Clear filters" button, and after clearing, focus moves to the search field.
  - 'The account filter is the theme''s `Select`, with no native `<select>` on the page: its list opens under its trigger, as wide as it, with a 1px rule between rows and a check on the chosen row, and the arrow keys, Enter and Escape work in it.'
---

Sample content, if the user gave none: "Fairhold", a banking and invoicing service for small businesses, and its customer "Hollis & Vane", a two-person print studio. The statement covers 30 October to 27 November 2026 on two accounts: the current account (ending 4417) and the tax reserve (ending 8830). Invent 28 transactions, newest first: client payments in (Larkspur Café, Brennan Wholesale, Odell & Pryce Architects), payments out for rent, paper stock (Copperleaf Paper Mill), ink, software, card fees and a van lease, the quarter's VAT paid out of the tax reserve (described as "VAT payment", with no tax office named), and two transfers to the tax reserve, each shown as two rows with the same date and amount: "To tax reserve" out of the current account and "From current account" into the tax reserve, so four of the 28 rows are transfers. The tax reserve then has rows in and out, for the Account and In or out filters to work on. Each has a reference such as `INV-0139` or `RENT NOV`.

This page uses the stock `button`, `input`, `select` and `table`; add any the project lacks with `npx shadcn@latest add button input select table`.

Build these parts in order; the footer is as the layout notes describe it.

### 1. Header

The product's name, five nav links (Overview, Transactions, Invoices, Payments, Reports) with Transactions as the current page, and at the right end the business's name as a small figure, hidden below `md`, where the notes' "Menu" button takes the right end. Nav links go to the notes' paths.

### 2. Page header

Above the heading, the period as a small figure, not uppercased: "30 Oct – 27 Nov 2026", each date in a `<time>`. The `<h1>` "Transactions". One action: an `outline` button "Export CSV".

### 3. Filters

A sheet with no heading row, directly in the container and full width, not in a grid. It holds one row of controls, `flex flex-wrap items-end gap-4`, so that the bottoms of the fields line up when a label wraps.

- **Search:** a field with the visible label "Search" and the placeholder "Payee or reference", no icon, in a wrapper with `w-full md:w-64`. It is a search field, as the Controls rule writes one.
- **Account:** a labelled `Select` "Account" with the choices All accounts, Current account and Tax reserve, in a wrapper with `w-full md:w-48`.
- **Direction:** a visible label "In or out" (a `<p>` with an `id`, since a `<label>` cannot name a group) over a button group, tied to it with `aria-labelledby`, with the choices All, In and Out; All is chosen. The label and the group are a stack with `gap-3`, like a field.
- **Clear filters:** an `outline` button "Clear filters" at its own width, in a wrapper `<div>` with `w-full md:ml-auto md:w-auto`: the full-width wrapper gives it its own line under the group on a phone, and `md:ml-auto` puts it at the right end from `md` up. It is disabled with the plain `disabled` prop, not `focusableWhenDisabled`, while no filter is set: its click moves focus to the search field.

### 4. Statement

A sheet with rows, directly in the container and full width, not in a grid. Heading: `Statement`. At the right end of the heading row, a small figure saying which rows are shown, `1–10 of 28`, where the last number counts the rows that match the filters (`21 of 21` when the page shows one row, `0 of 0` when none match), in an element with `aria-live="polite"`.

The table, with the label "Statement", has these columns:

- **Date:** a `<time>` in mono, `27 Nov`.
- **Description:** the payee or the payer in `text-body`.
- **Reference:** a small figure, `INV-0139`.
- **Account:** "Current" or "Tax reserve" in `text-body`, not a small figure.
- **Amount:** a signed amount (the word "In" or "Out", then the figure), right-aligned, with a right-aligned header.

Ten rows a page. The table scrolls in its box on a phone; nothing in it wraps except the empty state.

The `<tfoot>` sums every transaction that matches the filters, on every page, not only the rows shown. It has three rows. The first cell of each spans the first four columns and holds its label; the last cell holds the amount, right-aligned:

1. "Money in" as a label in `text-muted-foreground`, with the sum of money in as a signed amount; a sum of zero reads `In £0.00`, with no sign and no color.
2. "Money out" as a label in `text-muted-foreground`, with the sum of money out as a signed amount; zero reads `Out £0.00` the same way.
3. The total row, under the double rule: "Net in" or "Net out", whichever applies, and the difference, both in `font-heading text-h2 tabular-nums`. The net figure has its sign and is `text-primary` for net in, `text-destructive` for net out; the word in the label says which, so the color is never alone. Here the label carries the word, instead of a word before the figure. When the two sums are equal, the label reads "Net" and the figure `£0.00`, with no sign and in `text-foreground`. The label cell holds a `flex flex-wrap items-baseline gap-2`: the label, then the count it covers as a small figure, `28 transactions`.

When no row matches, the table's body is one row with one cell across all five columns, with `px-6 py-12 whitespace-normal`: a stack with `gap-3 items-start`, so the button keeps its own width, holding the sentence "No transactions match these filters." in `text-body` and an `outline` button "Clear filters". Here, instead of the Tables note's hover fill, that row has `hover:bg-transparent`: it is not a transaction. The `<tfoot>` is not shown then.

### 5. Paging

Under the table, inside the same sheet: a row with a 1px top border and `px-6 py-3`, `flex flex-wrap items-center justify-between gap-3`. At the left a small figure, `Page 1 of 3`. At the right two `outline` buttons, "Previous" and "Next", with `gap-2`, each disabled at its end of the list and given `focusableWhenDisabled`, so this page needs the `data-disabled:` classes of the Buttons note. With no matching rows the figure reads `Page 1 of 1` and both are disabled.

### Behavior

- All of it works on the sample data in component state. The rows stay newest first; there is no sorting.
- Search matches the description and the reference, ignoring case and spaces at either end. A search that is empty after trimming is no filter: it matches every row and leaves "Clear filters" disabled. A filter is set when the trimmed search is not empty, the account is not All accounts, or the direction is not All. The account filter keeps one account's rows. "In" keeps money in, "Out" keeps money out. The three work together.
- Changing the search, the account or the direction goes back to page 1. The range label, the page figure and the total rows follow at once.
- "Clear filters", in the filter row or in the empty state, empties the search, sets the account to All accounts and the direction to All, and moves focus to the search field.
- "Export CSV" and the nav links need no behavior.
