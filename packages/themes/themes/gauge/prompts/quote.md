---
page: quote request
title: Quote
description: a request for a quote, with the lines already added in a table whose quantities can be changed, company and delivery details in a form checked in code, and a confirmation with a quote reference.
order: 4
checks:
  - "Changing a quantity moves its line to the right price break, and the line total and the subtotal follow at once, worked in pence."
  - "Sending the form with empty or wrong fields shows an error in words with an icon under each, tied with `aria-describedby`, and focus moves to the first field with an error, the quantities first."
  - "Every field has a visible label tied to it, and each quantity field has a name that says which part it is for."
  - "Delivery is the theme's `Select` and Required by a button that opens the theme's `Calendar` in a `Popover`, with no native `<select>` or date input on the page: both look like the inputs beside them, open under their trigger, and work with the arrow keys, Enter and Escape."
  - "In the calendar 12 November 2026 is marked as today by a border and bold figures, the chosen day is filled, and the chosen date reads `16 Nov 2026` in the field."
  - "After Request a quote the form is replaced by a confirmation with the reference `TQ-26-04173` from a `role=status` element that was on the page from the start, and focus moves to its heading."
  - "Request a quote is the only default button on the page; every other button is the pale steel secondary."
---

Sample content, if the user gave none: "Torvale Bearings Ltd". The buyer, from Pellam Pumps Ltd, has added three lines to a quote. Each part has four price breaks per bearing, for 1 to 49, 50 to 249, 250 to 999, and 1,000 and over:

- `TVL-2047-RS`, "Deep groove ball bearing, 20 × 47 × 14 mm, rubber seals": £2.94, £2.61, £2.28, £1.97. Quantity 250, so £2.28 each, line total £570.00.
- `TVL-2552-RS`, "Deep groove ball bearing, 25 × 52 × 15 mm, rubber seals": £3.46, £3.07, £2.68, £2.32. Quantity 100, so £3.07 each, line total £307.00.
- `TVL-3572-ZZ`, "Deep groove ball bearing, 35 × 72 × 17 mm, metal shields": £6.52, £5.79, £5.05, £4.37. Quantity 40, so £6.52 each, line total £260.80.

Subtotal, excluding VAT: £1,137.80. Today is Thursday 12 November 2026; the earliest delivery date is Monday 16 November 2026.

This page uses the stock `button`, `input`, `table`, `select`, `popover` and `calendar`; add any the project lacks with `npx shadcn@latest add button input table select popover calendar`.

Build these parts in order; the footer is as the layout notes describe it.

### 1. Header

The product's name, the four nav links with Quote as the current page, the sales line at the right end from `md` up, and the "Menu" button below `md`.

### 2. Page header

On the left, the label "Quote", then the `<h1>` "Request a quote". No actions: the form's button is the page's one main action.

### 3. The form

After the page header, one plain `<div>` holds the `<form>` and, after it, the confirmation element, on the page from the start and empty. The `<form>` has `noValidate` and is a `flex flex-col gap-4` with two items: the lines panel, then a grid row.

**Lines.** A panel with rows, full width. Its heading row holds the `<h2>` "Lines" and, at its right end, the count as a small figure in an element with `aria-live="polite"`: `3 lines` (`2 lines`, `1 line`).

The shadcn `Table` with the label "Lines" and six columns:

- **Part number:** a text link in `font-mono text-body`, `/part` for `TVL-2047-RS` and `#` for the others.
- **Description:** the sentence from the sample, with `whitespace-normal`; its header has `min-w-48`, so the column does not collapse on a phone.
- **Quantity:** right-aligned, header too. The cell holds a stack with `flex flex-col items-end gap-2`: an `Input` in the quantity look of the Inputs note with `w-24`, no visible label but the `aria-label` "Quantity of TVL-2047-RS" (with the line's part number), then the error line when there is one, with `max-w-48 text-left`, so a wrapped sentence reads on from its icon; the cell has `whitespace-normal` so the line can wrap. The column grows while an error shows; that is expected.
- **Unit price (£):** the price of the break the quantity falls in, `2.28`, right-aligned, header too. While the quantity is not valid it shows the 1 to 49 price.
- **Line total (£):** `570.00`, right-aligned, header too. While the quantity is not valid it reads `0.00`.
- **The last column** has the header "Action", made `sr-only`; its cells are left-aligned, as stock, and hold a `secondary` button "Remove" with the `aria-label` "Remove TVL-2047-RS". While only one line is left, its "Remove" is disabled with the plain `disabled` prop.

The `<tfoot>` has one row: its first cell spans the first four columns and holds the label "Subtotal, excluding VAT", right-aligned; the next cell holds the sum of the line totals, `1,137.80`, in `font-heading text-h2 tabular-nums`, right-aligned; the last cell is empty. The `TableFooter`'s own top border is the rule above it, as the Tables note says.

On a phone the table scrolls in its box.

**The grid row.** A grid row with two items: the details panel spanning eight columns from `lg` up, and the side panel spanning four, full width below.

**Company and delivery.** A panel with the `<h2>` "Company and delivery". Under its heading row, a grid of fields, `grid grid-cols-1 gap-4 md:grid-cols-2`, in this order; a field marked "both" spans both columns (`md:col-span-2`):

1. "Company", an `Input` with `autoComplete="organization"`, both.
2. "Your name", `autoComplete="name"`.
3. "Email", `type="email"`, `autoComplete="email"`.
4. "Phone (optional)", `type="tel"`, `autoComplete="tel"`.
5. "Delivery", a `Select`, as the Selects note sets it, with three choices: "Standard, 3 to 5 working days" (chosen), "Next working day" and "Collect from Brigholt".
6. "Delivery address", `autoComplete="street-address"`, both.
7. "Town", `autoComplete="address-level2"`.
8. "Postcode", `autoComplete="postal-code"`, in a wrapper with `w-32` inside its grid cell; its label, helper and error lines keep the cell's width.
9. "Required by", a date field as set below, empty, with the helper text "Monday 16 November 2026 or later."

Every field starts empty but the select.

**The date field.** Never an `<input type="date">`: the browser draws that one and its calendar. It is a button that looks like an `Input` and opens the shadcn `Calendar` in a `Popover`. Three files in `components/ui` change, once, in the file:

- `popover.tsx`, on the popup: replace its stock gap with `gap-2`, its stock padding with `p-3`, its small text size with `text-body`, and `ring-1 ring-foreground/10` with `border border-border`; `rounded-lg`, `bg-popover` and `shadow-md` stay, as on the select's list.
- `calendar.tsx`:
  - On the root, replace `p-2` with `p-0` (the popover pads it) and the cell size of 28px with `[--cell-size:--spacing(8)]`, 32px, the height of an input; the cell corner, `var(--radius-md)`, is 4px and stays.
  - `month`: replace its stock gap with `gap-2`. `caption_label`: replace `font-medium` with `font-bold` and the small text size of the `"label"` layout with `text-body`: the month is a small heading, body text in bold.
  - `weekdays`: add `gap-1`. `weekday`: replace its arbitrary text size and `font-normal` with `font-mono text-label`, the label style, in sentence case as the library writes them (`Mo`, `Tu`). `week`: replace its stock top margin with `mt-1` and add `gap-1`, so the gutter is 4px both ways, which is where the focus outline fits.
  - `today`: leave only `text-foreground`; delete its corner class, `bg-muted` and the `data-[selected=true]:` class. A grey fill would mark today by a color alone.
  - The `Chevron` component: give `ChevronLeftIcon` and `ChevronRightIcon` `strokeWidth={1.5}`.
  - `CalendarDayButton`: in its classes, delete `border-0`, the three `group-data-[focused=true]/day:` classes that draw the ring (`…:border-ring`, `…:ring-[3px]`, `…:ring-ring/50`) and `dark:hover:text-foreground`, which would make the chosen day's figure unreadable on hover in dark mode; leave the `[&>span]:` classes as they are (this version draws no `<span>` in a day, so they do nothing); and add `font-mono text-body tabular-nums group-data-[today=true]/day:border-foreground group-data-[today=true]/day:font-bold`. A day is then a mono figure; today has a 1px border in the text color and a bold figure, and the bold still shows when today is the chosen day; the chosen day keeps the stock graphite fill (`data-[selected-single=true]:bg-primary`); the focused day shows the outline `button.tsx` already has.
- `button.tsx`, the `ghost` variant, which only the calendar's days and arrows use: replace `hover:bg-muted` with `hover:bg-accent`, the fill of a highlighted row in a select, and delete `dark:hover:bg-muted/50`, which cannot be seen on the popup in dark mode. No button of the page itself is `ghost`.

Then write `components/ui/date-picker.tsx`, a `DatePicker` with the props `id`, `labelId`, `value` (a `Date` or `undefined`), `onValueChange`, `today`, `aria-invalid` and `aria-describedby`. It keeps `open` in state and renders a `Popover` with:

- A `PopoverTrigger` with the `id`, the two `aria-` props, an `aria-labelledby` that names two ids, `labelId` and then the `id` of the value's `<span>`, and the classes `flex h-8 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-2 text-body whitespace-nowrap text-foreground transition-colors outline-none select-none focus-visible:border-ring aria-invalid:border-destructive` plus the outline classes of the Focus rule. In it, a `<span>` with the `id` `${id}-value` holding the date as a `<time>` with its `dateTime`, in `font-mono tabular-nums`, written `16 Nov 2026` (`format(value, "d MMM yyyy")` from `date-fns`, which the calendar installs), or, with no date, the words "Choose a date" in `text-muted-foreground`; then the `Calendar` icon from `lucide-react`, `size-4 shrink-0 text-muted-foreground`, `strokeWidth={1.5}`, `aria-hidden="true"`. `px-2` is meant here, not the select's `pr-1`: this icon nearly fills its box. The trigger is named by the label and by its value, so a screen reader says "Required by 16 Nov 2026"; a `<label htmlFor>` alone would hide the date.
- A `PopoverContent` with `align="start"`, `className="w-auto"` and an `initialFocus` that returns the day button with `tabindex="0"` inside the popup (the chosen day, or today): without it the focus lands on the "previous month" arrow. In it, `<Calendar mode="single" required weekStartsOn={1} showOutsideDays={false} today={today} selected={value} defaultMonth={value ?? today} onSelect={…} />`, where `onSelect` passes the date on and closes the popover; focus returns to the trigger by itself. `showOutsideDays={false}`: the theme's grey for quiet text is too near its text color to set the neighbouring months' days apart, so they are left out.

On this page the field is the `DatePicker` with `today` set to the sample's today, 12 November 2026, in the same label and stack as any field: the `<label>` has the `id` that `labelId` names and its `htmlFor` is the trigger's `id`. No day is disabled: a date before 16 November 2026 can be chosen and gets the error below. Choosing a date removes the field's error line, as typing does in an `Input`. After the grid, a row with `flex flex-wrap items-center gap-3 border-t border-border pt-4`: the default button "Request a quote" with `type="submit"`, and the small figure "We reply by 17:00 on the next working day."

**How quotes work.** A panel with rows: a heading row with the `<h2>` "How quotes work", then three rows, each one sentence in `text-body`:

- "Prices hold for 30 days from the date on the quote."
- "Delivery is priced in the quote. Standard delivery is free on orders over £500.00."
- "Orders placed by 15:00 on a working day leave Brigholt the same day."

### 4. The confirmation

Rendered inside the confirmation element only after a good submit, when the `<form>` is gone: a panel, `rounded-xl border border-border bg-card p-4`, laid out as `flex flex-col gap-4`, with no top margin (here, instead of the Confirmations note's `mt-3`: nothing stands above it in the wrapper then, and the container's `gap-6` spaces it from the page header). In it:

- The `<h2>` "Quote requested" in `text-h2`, with `tabIndex={-1}` and the `focus:` outline from the rules.
- A `<dl>` as the Description lists note sets it, `w-full max-w-md`, with four rows: "Reference", `TQ-26-04173`; "Lines", `3`; "Subtotal, excluding VAT", `£1,137.80`; "Reply by", `17:00, 13 Nov 2026`, with the time and the date in one `<time>` with `dateTime="2026-11-13T17:00"`. The figures follow what was sent: two lines and their subtotal if one was removed.
- One paragraph in `text-body`: "We will send the quote to" with the email address as typed, then ", from sales@torvale.example." Then a second paragraph: "This is a demo: nothing was sent and no stock is held."
- A link styled as a `secondary` button, "Back to the catalogue", to `/catalogue`, at its own width (`self-start`).

### Behavior

- A quantity is read as a whole number after trimming spaces and dropping every comma, wherever it stands. A valid one is from 1 to 10,000. As it is typed, the line's unit price, its line total and the subtotal follow at once; an invalid quantity counts as zero in the subtotal. All sums are worked in pence.
- "Remove" removes its line, and focus moves to the quantity field of the line that took its place, or of the line above when the last line went. The count follows. The lines left keep their quantities. A removed line's error goes with it; every other error stays until the next submit.
- "Request a quote" checks every field in code, the quantities first, then the fields in their order, and moves focus to the first one with an error once the error lines are rendered. Each error, with its text:
  - A quantity: "Enter a whole number from 1 to 10,000."
  - Company: "Enter your company's name."
  - Your name: "Enter your name."
  - Email empty: "Enter your email address." Anything without one `@` with text before it and, after it, a dot with text on both sides (`a@b.c`, not `a@.` or `a@b.`): "Enter an email address such as buyer@pellam.example."
  - Phone, only when it is not empty: with spaces removed, anything but 10 to 15 digits with an optional `+` in front: "Enter a phone number of 10 to 15 digits, or leave it empty."
  - Delivery address: "Enter the delivery address."
  - Town: "Enter the town."
  - Postcode, trimmed and ignoring case: anything that is not a UK postcode shape (one or two letters, a digit, an optional letter or digit, an optional space, a digit and two letters): "Enter a postcode such as AC7 1RT."
  - Required by empty: "Enter a date." Before 16 November 2026: "Choose 16 November 2026 or later. We need two working days."
- With no errors, the form is removed, the confirmation fills the status element, and focus moves to its `<h2>`, so that the message is not read twice.
- Only the "Remove" of a lone line is disabled, and with the plain `disabled` prop, so no button on this page gets `focusableWhenDisabled`, and `components/ui/button.tsx` needs no `data-disabled:` classes.
- The links need no behavior beyond their `href`.
