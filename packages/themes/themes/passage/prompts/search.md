---
page: ferry search home page
title: Search
description: the home page of a ferry line, with a journey search form in a white card on the page, popular routes with their fares, and three reasons to sail with the line.
order: 1
checks:
  - "The search form sits in a white card on the pale page, and the choice of one way or return is a button group whose chosen button has aria-pressed set to true."
  - "Sending the empty form gives the From select, the To select and the outward date each their own error line with an icon, and focus moves to the From select."
  - "Choosing the same port twice, or a return date before the outward date, gets an error line that says why in words."
  - "The two ports are the theme's Select and each date is picked from the theme's Calendar in a Popover, with no native select or date input on the page: each popup opens under its trigger with the field's border, the chosen port has a check, today has a border, and the arrow keys, Enter and Escape work in both."
  - "The adults and children steppers stop at their own limits and at nine passengers in all, and every minus and plus button has an aria-label."
  - "Every fare on the route cards has the pound sign and two decimals in Overpass Mono with tabular figures, and the page has one default button at a time."
---

Sample content, if the user gave none: "Kestrel Ferries", a ferry line that sails from Harrowmouth (`HRW`) on the mainland to four island ports: Port Ellery (`PEL`), Brindle Ness (`BRN`), Wrenholm (`WRH`) and Tollan Quay (`TLQ`). Harrowmouth to Port Ellery takes 1 h 45 min direct, with five sailings a day; Brindle Ness 55 min, three a day; Wrenholm 2 h 30 min, two a day. Fares start at £29.00, £18.00 and £36.00 for one adult, one way. Children aged 4 to 15 need a ticket; under 4s travel free. Tickets are sold up to 180 days ahead. Write the rest of the copy yourself, plain and specific.

Build these parts in order.

### 1. Header

The header from the layout notes, with "Book" as the current page; its link keeps `/`.

### 2. Opening and search

The first section, with `pt-8`, as a grid (`grid grid-cols-1 gap-5 md:grid-cols-12 md:items-start`):

- In columns 1–5: a label, `Ferries to the islands · Since 1987`, then with `mt-2` the `<h1>` in `text-h1 lg:text-display` (here `lg:` in place of the Headings note's `md:`, since five columns at `md` are too narrow for the display size): "Over the water by lunchtime". With `mt-3` one or two sentences in `text-body`: crossings from Harrowmouth to four islands, with a car, a bike or a dog. With `mt-5` a label line in `text-muted-foreground`: `Harrowmouth · Port Ellery · Brindle Ness · Wrenholm · Tollan Quay`.
- In columns 7–12: the search card, a card that is the wrapper for the form and the confirmation. It holds the `<form>` (with `noValidate` and the `aria-label` "Search sailings") and, after it, the empty `role="status"` element. Add the fields with `npx shadcn@latest add select popover calendar` if the project has none, and give the new files the edits the Added components note lists.

On a phone the card comes under the label line, with the grid's `gap-5` between them.

The form's fields, in this order, each in its own `<div>`, `mt-5` apart, as the Forms note says:

1. **Trip**: a label `<p>` with an `id`, "Trip", in `font-mono text-label text-foreground`, then with `mt-2` a button group as the layout notes describe, named by that label with `aria-labelledby` in place of an `aria-label`: "One way" and "Return". "One way" is chosen when the page opens.
2. **From and To**: two fields side by side from `lg` up, as items of a `grid grid-cols-1 gap-5 lg:grid-cols-2` (here `lg:` in place of the Forms note's `md:`, because the card is narrow at `md`). Each is a `Select` as the layout notes describe: the label "From" and the label "To". Each has the placeholder "Choose a port" and the five ports as its items, each written with its code, with the code as its value: `{ value: "HRW", label: "Harrowmouth (HRW)" }`, then Port Ellery (PEL), Brindle Ness (BRN), Wrenholm (WRH), Tollan Quay (TLQ).
3. **Dates**: with "One way" chosen, one field: the label "Outward date", then a date field as described under "Date fields" below. With "Return" chosen, a second field follows it, "Return date", and the two sit side by side from `lg` up in a `grid grid-cols-1 gap-5 lg:grid-cols-2`; with "One way" the grid holds the outward date alone. The outward date can be picked from today to 180 days after today, on the visitor's clock; the return date from the later of the outward date and today (today while the outward date is empty), to the same last day. The calendar only limits what can be picked: an outward date moved past a return date already chosen still reaches the check, so the code keeps the range messages below.
4. **Adults**: a label `<p>` with an `id`, "Adults", in `font-mono text-label text-foreground`, then with `mt-2` a stepper as the layout notes describe, from one to nine, starting at two. The value reads `1 adult`, `2 adults`. The buttons' `aria-label`s are "Fewer adults" and "More adults".
5. **Children**: the label "Children" set the same way, then with `mt-2` a stepper from zero to eight, starting at zero. The value reads `0 children`, `1 child`, `2 children`. The buttons' `aria-label`s are "Fewer children" and "More children". Under the stepper, with `mt-2`, a label in `text-muted-foreground` with an `id`: `Ages 4 to 15. Under 4s travel free and need no ticket.` The stepper's `role="group"` names it with `aria-describedby`.

**Date fields.** A date is picked from the shadcn `Calendar` in a `Popover`, never typed into an `Input` of type `date`, whose picker the browser draws. Each date is kept in state as a `YYYY-MM-DD` string, empty at first, built from the picked day's own year, month and day (not with `toISOString`, which would give the day in UTC), and turned back into a `Date` with `new Date(year, month - 1, day)`.

- **The trigger** is the `PopoverTrigger`, a button that looks like an `Input`, with the field's `id`, `mt-2` and `flex w-full items-center justify-between gap-2 rounded-md border border-muted-foreground bg-card px-3 py-2 text-body text-foreground transition-colors focus-visible:border-ring aria-invalid:border-destructive` and the focus outline from the rules. It holds a `<span>` with an `id` and `min-w-0 truncate`, then the `Calendar` icon in `shrink-0 text-muted-foreground`, as the Icons note says. The `<span>` holds the date as a `<time>` with `tabular-nums` in the short form with the year, `Sat 19 Dec 2026` (this is one of the compact places the Times and dates note allows; the confirmation still writes dates in full), or, while empty, the words "Choose a date" in a `<span>` with `text-muted-foreground`. The field's `<label>` has an `id` and `htmlFor` as usual, and the trigger has `aria-labelledby` naming the label and the value's `<span>`, in that order, so that it is read "Outward date, Sat 19 Dec 2026": a `<label>` alone would hide the date. `aria-invalid` and `aria-describedby` go on the trigger, and so does the focus when the field has the first error.
- **The popup** is `<PopoverContent align="start" className="w-auto">` holding the `Calendar` in a `<div>` with a ref. Give it `initialFocus={() => ref.current?.querySelector('td button[tabindex="0"]') ?? true}`: a popover otherwise puts the focus on the "previous month" arrow, and the arrow keys should start on the chosen day. In `components/ui/popover.tsx`, in `PopoverContent`, replace the stock gap and padding with `gap-3 p-3`, the small text size with `text-body`, and `ring-1 ring-foreground/10` with `border border-muted-foreground`, as on the select's list; `rounded-lg`, `bg-popover` and `shadow-md` stay.
- **The calendar** is `<Calendar mode="single" required weekStartsOn={1} showOutsideDays={false} selected={…} defaultMonth={…} startMonth={…} endMonth={…} disabled={{ before: …, after: … }} onSelect={…} />`. `selected` is the field's date or `undefined`; `defaultMonth` is the field's date or, while empty, its first day that can be picked; `startMonth` and `before` are that first day, `endMonth` and `after` the last one. `onSelect` stores the day, removes the field's error line and closes the popover (keep `open` in state); focus returns to the trigger by itself. Days of the neighbouring months are not shown: with days before today faded, a third kind of grey day would be one too many.
- **Edit `components/ui/calendar.tsx`**, once, changing the classes in the file:
  - On the root: `p-2` becomes `p-0` (the popover has the padding), `[--cell-radius:var(--radius-md)]` becomes `[--cell-radius:var(--radius-sm)]`, and `[--cell-size:--spacing(7)]` becomes `[--cell-size:--spacing(8)]`, a 32px cell.
  - `months` and `month`: replace each stock gap, with `gap-5` in `months` and `gap-3` in `month`.
  - `caption_label`: replace `font-medium` with `font-heading font-bold` and its small text size (the one for `captionLayout === "label"`) with `text-body`, the look of an `<h3>`.
  - `weekdays`: `flex` becomes `flex gap-1`. `weekday`: replace its arbitrary text size and `font-normal` with `font-mono text-label`. `week`: `mt-2 flex w-full` becomes `mt-1 flex w-full gap-1`, one 4px gutter both ways.
  - `today`: replace the whole string with `text-foreground`. `disabled`: delete `opacity-50`, which the disabled day button already has.
  - `CalendarDayButton`: add `ref={ref}` to its `<Button>`. The stock file makes that ref and never attaches it, so the arrow keys move nothing. In its classes, delete `border-0` and the three classes that draw the stock ring (`group-data-[focused=true]/day:border-ring` and the two `group-data-[focused=true]/day:ring-*` after it); add `rounded-sm font-mono text-body tabular-nums group-data-[today=true]/day:border-foreground dark:hover:bg-accent`; and replace the small text size in `[&>span]:` with `text-label`. Today is then marked by a 1px border in the text color, not by a fill, and keeps it when chosen; the chosen day keeps the stock `bg-primary` fill; a day under the pointer gets the button's pale fill (in dark mode the lighter `bg-accent`, since the stock one hardly shows); a focused day shows the outline that `button.tsx` has after the Focus rule's edit.
  - Give the `ChevronLeftIcon` and the `ChevronRightIcon` `strokeWidth={1.5}`.

No booking holds more than nine passengers: while adults and children add up to nine, both plus buttons are disabled. The four stepper buttons use `focusableWhenDisabled`, so this page makes the `data-disabled:` edit in `button.tsx`.

Then, in the notes' `<div>` with `mt-5`, the page's one default button, `type="submit"`: "Search sailings".

### 3. Popular routes

A section with `mt-16`: an `<h2>` "Popular routes", then with `mt-3` one sentence: every crossing leaves from Harrowmouth's harbour, a five-minute walk from the station. Then with `mt-5` a grid of three cards (`grid grid-cols-1 gap-5 md:grid-cols-3`), stacked on a phone. This grid has no `md:items-start`: the cards stretch to the same height.

Each card is an `<article>` with the card classes, holding:

- A label in `text-muted-foreground` with how often it sails: `5 sailings a day`.
- With `mt-2`, an `<h3>` in `text-h2`, the route: "Harrowmouth to Port Ellery".
- With `mt-3`, one sentence in `text-body` about the crossing.
- With `mt-5`, a row `<div>` with `flex items-end justify-between gap-5`: on the left a `<p>`, a label in `text-muted-foreground`, with the duration and the way, `1 h 45 min · Direct`; on the right a `<div>` with `shrink-0 text-right` holding a label in `text-muted-foreground`, `From, one adult`, and under it with `mt-1` the price as a `<p>` in `font-mono text-h2 text-foreground tabular-nums`, `£29.00`.
- With `mt-5`, a `<p>` holding a link in running text that names its port, "See sailings to Port Ellery", so the three links differ.

The three routes: Harrowmouth to Port Ellery (`5 sailings a day`, `1 h 45 min · Direct`, `£29.00`, the link to `/results`); Harrowmouth to Brindle Ness (`3 sailings a day`, `55 min · Direct`, `£18.00`, the link to `#`); Harrowmouth to Wrenholm (`2 sailings a day`, `2 h 30 min · Direct`, `£36.00`, the link to `#`). No badge on this page.

### 4. Why sail with Kestrel

A section with `mt-16`: an `<h2>` "Why sail with Kestrel", then with `mt-5` a grid of three items (`grid grid-cols-1 gap-5 md:grid-cols-3 md:items-start`), on the page, not in cards. Each item is a `<div>` with an `<h3>` (`text-body font-bold`, as the Headings note says) that is `flex items-center gap-2` and holds an icon and its words, then with `mt-3` one or two sentences in `text-body`:

- `CalendarClock`, "Change for £10.00": a sailing can be moved up to 24 hours before it leaves, for £10.00 a booking.
- `Bike`, "Bring the bike": bicycles cost £6.00 each and travel on the car deck, with a rack by the stairs.
- `Dog`, "Dogs on deck": dogs travel free on the open deck and in the dog lounge on every ship.

The prices in these sentences are part of the sentence: they keep the body font.

### 5. Footer

The footer from the layout notes.

### Behavior

- Keep every value in component state. Choosing "Return" adds the return date; choosing "One way" removes it, its value and its error line.
- When the form is sent, check it in code, in this order, and only the first check that fails for a field shows:
  - From: no port chosen gives "Choose the port you sail from."
  - To: no port chosen gives "Choose the port you sail to."; the same port as From gives "Choose a different port from the one you sail from."
  - Outward date: empty gives "Choose the date you sail."; a date before today gives "Choose today or a later date."; a date after the last day gives "We sell tickets up to 180 days ahead."
  - Return date, with "Return" chosen: empty gives "Choose the date you sail back."; a date before the outward date gives "Choose a return date on or after the outward date."; a date after the last day gives "We sell tickets up to 180 days ahead."
  - The steppers are always valid.
- Compare dates as the `YYYY-MM-DD` strings kept in state, with today taken from the visitor's clock in their own time zone.
- Each error line follows the layout notes, which say when it shows and when it goes (for a select on `onValueChange`, for a date on `onSelect`), and focus moves to the first field with an error: a select's or a date field's trigger.
- When everything is good, the form is replaced in its card by the confirmation in the status element: an `<h2>` in `text-h2`, "Your search is ready", with `tabIndex={-1}`, and with `mt-3` a sentence that repeats the search: "Sailings from Harrowmouth to Port Ellery on Saturday 19 December 2026, for 2 adults." With "Return" chosen it adds the way back: "…, back on Sunday 27 December 2026, for 2 adults and 1 child." Write the counts as the steppers write them, and leave out children at zero. The dates are each a `<time>`, written as the layout notes say. Move focus to the heading. After the status element, still inside the search card, in a `<div>` with `mt-5` that is rendered only with the confirmation, an `<a>` styled as the default button, "See the sailings", that goes to `/results`: it takes the place of "Search sailings" as the page's one default button.
- The other links need no behavior.
