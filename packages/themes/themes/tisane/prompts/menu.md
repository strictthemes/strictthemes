---
page: menu page
title: Menu
description: the menu of a tea room, in three sections of teas, plates and cakes, with a price and dietary marks for each item and a filter for vegan and gluten-free dishes.
order: 2
checks:
  - Every item shows its name, a short note, its dietary marks in words and a price in the mono font at the right end of its row.
  - Choosing "Vegan" or "Gluten-free" hides every item without that mark, the chosen button has `aria-pressed="true"`, and a status line says how many items are shown.
  - Exactly one item carries a badge, "Seasonal", in peach with dark text, and it is the only badge on the page.
  - Rows are divided by 1px rules, with no rule above the first row or below the last of each section.
  - At 375px the price stays on the same row as the item's name and nothing scrolls sideways.
---

Sample content, if the user gave none: the menu of "The Linden Room", a tea room and shop at 14 Mill Lane, Ashby Wold. Three sections, four or five items each. Teas come as a pot for one; the dietary marks are Vegan, Gluten-free and Vegetarian.

- **Teas:** Garden mint (£3.80, vegan, gluten-free), Lemon verbena (£3.80, vegan, gluten-free), Pear and ginger (£4.20, vegan, gluten-free, the seasonal item), Roasted barley (£3.60, vegan; barley has gluten), Breakfast black with oat milk (£3.40, vegan, gluten-free).
- **Plates** (served 11:30 to 14:30): Roast squash and lentil soup with rye bread (£7.50, vegan), Baked eggs with spinach and yoghurt (£9.00, vegetarian, gluten-free), Mushrooms on sourdough toast (£8.50, vegan), Beetroot, lentil and walnut salad (£9.50, vegan, gluten-free).
- **Cakes:** Pear and cardamom loaf (£3.60, vegetarian), Almond and orange cake (£3.80, vegetarian, gluten-free), Oat and date slice (£3.20, vegan), Ginger parkin (£3.20, vegetarian).

Each item has a note of one short line, which you write, such as "Fresh leaves from the garden at the back" or "Made with this week's pears". The current link in the header is "Menu".

Build these parts in order.

### 1. Header

The header from the layout notes, with "Menu" as the current page.

### 2. Opening

The first section, with `pt-10`, in columns 1–8 of a grid (`grid gap-6 md:grid-cols-12`): a label, `Autumn menu · From 2 November 2026`, with the date in a `<time>`; then with `mt-2` the `<h1>` "Menu" in `text-h1`; then with `mt-4` one or two sentences: what is cooked here, and that the teas on the menu are also sold by weight at the counter.

### 3. Filter

Still in the opening's `<div>` that spans columns 1–8, after its sentences, a `<div>` with `mt-6` that holds the filter and its status line:

- A button group with the `aria-label` "Show", holding three buttons: "All", "Vegan", "Gluten-free". "All" is chosen when the page opens.
- With `mt-4`, a `<p>` with `role="status"` in `font-mono text-label text-muted-foreground`, saying how many items are shown: `Showing all 13 items`, `Showing 9 vegan items` or `Showing 7 gluten-free items`, and at one item `Showing 1 vegan item`. Unlike the confirmations in the layout notes, it holds its first text from the start: it is a count that changes, not a message that replaces a form.

No button on this page disables itself, so it needs no `focusableWhenDisabled` and no `data-disabled:` edit.

### 4. The menu and the allergy note

A section with `mt-18`, as a grid (`grid gap-6 md:grid-cols-12 md:items-start`):

- In columns 1–8, the three menu sections, one after the other. Each is a `<section>` nested inside this grid item, so the notes' `mt-18` does not apply, with an `aria-labelledby` pointing at its heading. The first has no top margin, the other two `mt-10`. Each opens with an `<h2>` ("Teas", "Plates", "Cakes"), then with `mt-2` a label in `text-muted-foreground` that says how it is served (`A pot for one`, `Served 11:30–14:30`, `Baked each morning`), then with `mt-4` the list of items.
- In columns 10–12, a card as an `<aside>` with the `aria-label` "Allergies": a label `Allergies`, then with `mt-2` two or three sentences: everything is made in one small kitchen that also uses nuts, gluten and milk, so a mark means the recipe has none, not that the kitchen is free of it; ask at the counter. On a phone the card comes after the three sections.

Each list is a list of rows as the layout notes describe, with `py-4` on each row. A row holds:

- On the left, a `<div>` with `min-w-0`: the item's name as an `<h3>` in `text-body`; with `mt-2` the note as a `<p>` in `text-body`; with `mt-2` the dietary marks as a label in `text-muted-foreground`, joined with ` · `, for example `Vegan · Gluten-free`. An item with no mark has no label line.
- On the right, the price, a label in `text-foreground` with `tabular-nums` and `shrink-0`.

The name and the price stay on one row at every width: the left `<div>` wraps its own text, the price never wraps.

### 5. The seasonal item

The Pear and ginger tea carries the page's one badge, "Seasonal", beside its name: put the name and the badge in a `<div>` with `flex flex-wrap items-center gap-2`, with the `<h3>` first. The badge is the one from the layout notes; add it with `npx shadcn@latest add badge` if the project has none. Do not color, enlarge or box the row in any other way.

### 6. Closing line

A section with `mt-18`, in columns 1–8 of a grid: one sentence in `text-body` that says a table can be booked, with a link in running text, "Book a table", that goes to `/booking`. This page has no default button.

### 7. Footer

The footer from the layout notes.

### Behavior

- Keep the chosen filter in component state. "All" shows every item. "Vegan" shows only items marked Vegan; "Gluten-free" only items marked Gluten-free. Hidden items are not rendered, so the rules between rows stay right: no doubled rule, no rule left at the top.
- In the sample every section keeps at least one item under every filter. With the user's own menu, a section left with no item shows, in place of its list and with `mt-4`, one line in `text-body`: "Nothing in this section is vegan today." (or gluten-free). The section's heading stays.
- The status line updates with each choice. Choosing a filter moves no focus: it stays on the button.
- The filter changes only what is shown; it does not change the address of the page.
- The other links need no behavior.
