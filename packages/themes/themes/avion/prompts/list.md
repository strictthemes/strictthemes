---
page: records list
title: Records list
description: a list screen for an admin tool, with a table of records that can be searched, filtered, sorted, selected and paged.
order: 3
checks:
  - Clicking a column header sorts by it and clicking again reverses the order; the sorted column's `<th>` carries `aria-sort` and shows an arrow.
  - Search, the status filter and the depot filter work together, and changing any of them goes back to page 1 and clears the selection.
  - The depot filter is the theme's `Select`, with no native `<select>` on the page. Its list opens under its trigger in the theme's colors, and the chosen row has a check.
  - The checkbox in the header selects every row on the page, shows a dash when only some are selected, and every checkbox has a name a screen reader can read.
  - Numbers are right-aligned in mono figures with `tabular-nums`, and every state is a dot and a word.
  - An empty result shows a message and a way to clear the filters.
---

Sample product, if the user gave none: "Northgate", the operations console of a regional parcel carrier. The page lists shipments. Invent 24 of them, with believable IDs (such as `NG-48213`), customers, destinations, four depots, weights, values and times.

Build these parts in order.

### 1. Top bar

The product's name, four nav links (Overview, Shipments, Depots, Reports; not Settings) with Shipments as the current page, and at the right end the signed-in person's name as a small figure, hidden below `md`.

### 2. Page header

The `<h1>` "Shipments", with the total beside it as a small figure (`24 shipments`), the two in one wrapper with `flex items-baseline gap-3` as the row's left item; the total does not change with the filters. The actions are an `outline` button "Export" and the default button "New shipment".

### 3. Filters

A panel, twelve columns, with no label heading: a plain `<div>`, not a named region, holding a row of controls with `gap-5` that wraps, bottoms aligned.

- A search field with a visible label "Search" and the placeholder "ID, customer or destination", no icon, `w-64`, full width below `md`.
- The status filter: a visible label "Status" (a `<p>`, since a `<label>` cannot name a group) above a button group with the choices All, In transit, Delivered, Late, Held.
- The depot filter: a labelled `Select` "Depot" with All depots and the four depots, in a wrapper with `w-48`.
- At the right end (`ml-auto`), a "Clear filters" button, `variant="outline"`, disabled while the search is empty and both filters are on All.

### 4. Table

A panel with rows, twelve columns. Its heading row holds the heading `Results` and, at the right end, a small figure saying which rows are shown, e.g. `1–10 of 24`, where the last number counts the rows that match the filters (`0 of 0` when none do), in an element with `aria-live="polite"`.

When one or more rows are selected, the heading row keeps its heading, and in place of the range label it shows, in one wrapper `flex flex-wrap items-center gap-3`, how many are selected (`3 selected`, in `text-body`) and two buttons in a `flex gap-2`: "Mark as delivered" (`secondary`) and "Clear selection" (`outline`). Here, instead of the note's `min-h-7`, give the row `min-h-8`, the buttons' height, so that from `md` up the table does not move when they appear; below `md` the row wraps onto more lines while rows are selected, and the table moving down there is expected. The range label stays on the page for screen readers (`sr-only`).

Columns: a checkbox, ID (mono, a text link), Customer, Destination, Depot, Status (a state: In transit is neutral, Delivered is good, Late is failed, Held is caution), Weight with the header "Weight (kg)" (right-aligned, one decimal: `18.4`), Value (right-aligned, with a currency sign and two decimals, e.g. `£1,240.00`) and Updated (a date and time such as `11 Nov, 14:05`, right-aligned). A selected row has `data-state="selected"` and `data-[state=selected]:bg-secondary/10`: the stock fill for a selected row cannot be told from the panel in dark mode. Ten rows a page. The table scrolls in its box on a phone.

The checkboxes are the shadcn `Checkbox` with `className="rounded-sm"`; add it with `npx shadcn@latest add checkbox`. The header's checkbox has the `aria-label` "Select all on this page", each row's "Select shipment" and its ID. When no row matches, the header's checkbox is clear and `disabled`. A click on the header's checkbox selects every row on the page when it is clear or mixed, and clears the page's rows when it is checked. The stock `Checkbox` has no look for a mixed state: pass the header's checkbox the `indeterminate` prop when some but not all rows are selected, and edit `components/ui/checkbox.tsx` so that this state has the same fill as a checked box: beside every class that holds `data-checked:`, the prefixed ones (`dark:data-checked:`, `group-has-[:focus-visible]/field-label:data-checked:`) included, add a copy with `data-indeterminate:` in place of `data-checked:`. `not-data-checked:` and `aria-invalid:aria-checked:` classes stay as they are, with no copy. The mixed box shows a minus icon in place of the check. Base UI puts `data-indeterminate` on the box and still renders its indicator: give the box a `group` class, and show a `Minus` icon where the group has `data-indeterminate` and the `Check` icon otherwise.

The headers of ID, Customer, Weight, Value and Updated sort the table. Each is a `<button>` inside its `<th>`, styled as the header label, with `gap-1` between its text and an arrow icon, which comes after the text, or before it in a right-aligned column, so that the text stays on the numbers' edge: an up or a down arrow in `text-foreground` on the sorted column, an up-down arrow on the others. The button is `text-muted-foreground hover:text-foreground`. Only the sorted column's `<th>` has `aria-sort` (`ascending` or `descending`); the others have none. A first click on a column sorts it ascending (A to Z, smallest or oldest first); a click on the sorted column reverses it.

When no row matches, the table's body is one row with one cell across all columns, left-aligned, with `px-5 py-8 whitespace-normal`: a `<p>` with the sentence "No shipments match these filters." and, with `mt-3` under it, a "Clear filters" button (`outline`).

### 5. Paging

Under the table, inside the same panel: a row with a 1px top border and `px-5 py-3`. At the left a small figure, `Page 1 of 3`; when no row matches it reads `Page 1 of 1`, and both buttons are disabled. At the right two `outline` buttons, "Previous" and "Next", with `gap-2`, each disabled at its end of the list.

### Behavior

- All of it works on the sample data in component state: search (ID, customer and destination, ignoring case), both filters, sorting, selection and paging.
- The table starts sorted by Updated, newest first. Numbers sort as numbers and times as times. Sorting goes back to page 1 and keeps the selection.
- Changing the search or a filter goes back to page 1 and clears the selection. Otherwise the selection is kept from page to page; the header's checkbox speaks for the rows on the page shown. "Mark as delivered" sets every selected row's status to Delivered and clears the selection; where the rows that leave the filter's result leave the page shown past the last page, show the last page.
- After either "Clear filters" button, focus moves to the search field. After "Mark as delivered" or "Clear selection", which remove themselves, focus moves to the header's checkbox, or, where marking the rows leaves no row that matches, to the empty state's "Clear filters" button. Where the target appears only after the state change, make the change inside `flushSync` and call `focus()` straight after; setting state in a `useEffect` trips the project's lint rule.
- Previous and Next get `focusableWhenDisabled`, since a click can disable the button that has focus; no other button on this page needs it.
- "Export", "New shipment" and the nav links need no behavior.
