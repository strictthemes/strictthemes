---
page: breakfast and supper menu
title: Menu
description: the breakfast and supper menu of a small guesthouse, a typographic menu in sections where each dish has a line of description and a price at the end of a hairline, with letters for dietary notes, their key, and the times each meal is served.
order: 5
checks:
  - "Every dish has its name in the heading font, a line of description in the body font and a price in the mono font at the right end of a 1px hairline that runs from the name."
  - "Dietary notes are letters in the mono font, each with its full word for a screen reader, and the key that explains the four letters is a `<dl>`."
  - "The times each meal is served stand on the page's one block of clay, each time in a `<time>` element, and all text on the block is ink in both modes."
  - "The `<h1>` has one phrase in italics and no heading is bold; Included for guests is the page's one badge, the page has no default (slate) button, and nothing is a pill or a circle."
  - "At 375px each price stays on the row of its dish's name and nothing scrolls sideways."
---

Sample content, if the user gave none: the menu of **Kittiwake House**, the invented guesthouse described in the layout notes. Breakfast is cooked to order every morning from 08:00 to 10:00, on Sundays until 10:30, and is included for guests of the house. Supper is a short menu from Thursday to Saturday, from 18:30 to 20:30, for guests who ask by 14:00. Visitors who are not staying are welcome at both, at the prices shown, if they book the day before. The dietary letters are `V` (vegetarian), `VG` (vegan), `GF` (made without gluten) and `DF` (made without dairy). The dishes, each with its line of description, its price and its letters:

- **Breakfast, cooked to order:** The harbour breakfast ("Bacon, a pork sausage, a fried egg, tomato, mushrooms and fried bread", £13.50, no letters); The garden breakfast ("Field mushrooms, tomatoes, spinach, beans and a potato cake", £12.00, VG); Smoked haddock kedgeree ("With a soft egg, parsley and lemon", £11.50, GF); Grilled kipper ("From the smokehouse on the quay, with brown butter and brown bread", £9.50, no letters); Soft-boiled eggs and soldiers ("Two eggs from the farm on the hill", £7.00, V).
- **Breakfast, from the sideboard:** Porridge ("Pinhead oats soaked overnight, with cream and honey", £6.50, V); Yoghurt, rhubarb and toasted oats ("The rhubarb is from the garden", £6.00, V); Toast and the house marmalade ("Sourdough or soda bread, with salted butter", £4.00, V).
- **Supper, to start:** Crab on toast ("White and brown meat, lemon and cayenne", £9.50, no letters); Leek and potato soup ("With soda bread and salted butter", £7.00, V); Beetroot, lentil and dill salad ("Served warm, with a mustard dressing", £7.50, VG and GF).
- **Supper, mains:** Hake with mussels and cider ("From the morning's boats, with new potatoes", £19.50, GF); Lamb shoulder with white beans ("Cooked slowly overnight, with mint and garlic", £21.00, GF and DF); Baked squash with chard and hazelnuts ("With barley, sage and a sharp green sauce", £16.50, VG).
- **Supper, puddings:** Treacle tart ("With clotted cream", £7.50, V); Baked apple and oat crumble ("With custard or cream", £7.00, V); Three cheeses from the county ("With oatcakes and quince paste", £9.00, V).

Every name is invented.

Build these parts in order. This page needs `npx shadcn@latest add badge`.

### 1. Header

The header from the layout notes, with "Menu" as the current page.

### 2. Opening

The first section, with `pt-12`, as a grid (`grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start`):

- In columns 1–7 (`md:col-span-7`):
  - A label line in `text-muted-foreground`: `Spring menu · From 1 April 2027`, with the date in a `<time dateTime="2027-04-01">`.
  - With `mt-2`, the `<h1>` in `text-h1 lg:text-display`: "Breakfast and supper", with the words "and supper" in a `<span className="italic">`. This is the page's only italic.
  - With `mt-4`, a `<p>` in `text-body`: "Breakfast is cooked to order every morning and is included with a room. Supper is a short menu on three evenings a week. If you are not staying, you are welcome at both, at the prices shown: book the day before."
  - With `mt-6`, the key (see below).
  - With `mt-4`, a `<p>` of helper text in `font-mono text-label text-muted-foreground`, a sentence, not uppercased: "Everything is cooked in one small kitchen that also uses nuts, milk, eggs and gluten. Tell us about an allergy before you order."
- In columns 9–12 (`md:col-span-4 md:col-start-9`): the page's clay block, the grid item itself (the block's classes and the span on one element), holding:
  - A label heading, an `<h2>`: "When we serve". Here it has no text color class, so it takes the block's ink: `font-mono text-label uppercase` only.
  - With `mt-4`, a `<dl>` with three entries, the second and third with `mt-4`. Each entry is a `<div>`: the `<dt>` in `text-body`, and with `mt-2` the `<dd>`, a label with `tabular-nums`, the span of hours as two `<time>` elements. No hairlines here, as the clay block has none.
    - Breakfast, every day: `08:00–10:00`
    - Breakfast on Sundays: `08:00–10:30`
    - Supper, Thursday to Saturday: `18:30–20:30`
  - With `mt-6`, a `<p>` in `text-body`: "Tell us by 14:00 if you would like supper.", with the time in a `<time>`.

**The key.** A `<dl>` with `flex flex-wrap gap-x-6 gap-y-2` and four entries. Each entry is a `<div>` with `flex items-baseline gap-2`: the `<dt>` is the letter, a label in `text-foreground`; the `<dd>` is the word, a label in `text-muted-foreground`. The entries: `V` Vegetarian, `VG` Vegan, `GF` No gluten, `DF` No dairy. The key has no heading and no `aria-label`: its terms say what it is.

### 3. Breakfast

A section with the hairline from the layout notes and the `id` `breakfast`, as a grid (`grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start`):

- In columns 1–4 (`md:col-span-4`):
  - A label line with the page's one badge beside it, in the row the Badges note gives: the label `Every day · 08:00–10:00` in `text-muted-foreground`, the hours two `<time>` elements, then the badge "Included for guests".
  - With `mt-2`, an `<h2>`: "Breakfast".
  - With `mt-4`, one or two sentences in `text-body`: served on the veranda; order as much or as little as you like, and for guests of the house the prices do not apply.
- In columns 6–12 (`md:col-span-7 md:col-start-6`): two courses, each a label heading and a list of dishes.
  - A label heading, an `<h3>`: "Cooked to order". With `mt-4`, the list of its five dishes.
  - With `mt-12`, a label heading, an `<h3>`: "From the sideboard". With `mt-4`, the list of its three dishes.

**How a dish is set.** A list of dishes is a `<ul>` with no markers, no padding and no `divide-y`: the hairline in each dish is the only rule. Each `<li>` after the first has `mt-6`. A dish holds, in block flow:

- A row, a `<div>` with `flex items-baseline gap-2`:
  - The dish's name as an `<h4>` in `text-h2` with `min-w-0`.
  - The hairline: an empty `<span>` with `aria-hidden="true"` and `min-w-4 flex-1 border-b border-border`. It runs from the name to the price on the baseline of the name: an empty flex item's baseline is its bottom edge, so keep it empty, with no padding.
  - The price: a `<p>` label in `text-foreground` with `shrink-0 whitespace-nowrap tabular-nums`, `£13.50`.
- With `mt-2`, the description: a `<p>` in `text-body`, at most `max-w-xl`.
- Where the dish has letters, with `mt-2`, a `<p>` label in `text-muted-foreground` holding them, joined with ` · `: `VG · GF`. Each letter is a `<span>` with `aria-hidden="true"`, followed by a `<span>` with `sr-only` that holds its word from the key and a comma or a full stop ("Vegan, ", "No gluten."), so a screen reader says the words and not the letters. The ` · ` between two letters is a third `<span>` with `aria-hidden="true"`, after the `sr-only` one: `<span aria-hidden="true">VG</span><span className="sr-only">Vegan, </span><span aria-hidden="true"> · </span>`. A dish with no letters has no such line.

The name may wrap onto a second line on a phone; the price never wraps, and stays on the row of the name's first line.

### 4. Supper

A section with the hairline and the `id` `supper`, laid out as Breakfast is, with its dishes set the same way:

- In columns 1–4 (`md:col-span-4`): a label line in `text-muted-foreground`, `Thursday to Saturday · 18:30–20:30`, the hours two `<time>` elements; with `mt-2` an `<h2>`, "Supper"; with `mt-4` one or two sentences in `text-body`: three courses or one, at the long table in the breakfast room, with the fish from that morning's boats. No badge here.
- In columns 6–12 (`md:col-span-7 md:col-start-6`): three courses, each a label heading, an `<h3>`, with its list of dishes under it with `mt-4`: "To start", then with `mt-12` "Mains", then with `mt-12` "Puddings", three dishes each.

### 5. A table for supper

A section with the hairline, in columns 1–7 of a grid (`grid grid-cols-1 gap-6 md:grid-cols-12`, the `<div>` with `md:col-span-7`):

- A label line in `text-muted-foreground`: `Guests and visitors`.
- With `mt-2`, an `<h2>`: "A table for supper".
- With `mt-4`, a `<p>` in `text-body`: "If you are staying, tell us at breakfast or by 14:00. If you are not, write or call the day before: there are twelve places at the table.", with the time in a `<time>`.
- With `mt-6`, a `<div>` with `flex flex-wrap items-center gap-x-6 gap-y-4`: a `secondary` button that is a link, "Write to us", to `mailto:stay@kittiwakehouse.example`; and beside it a `<p>` label in `text-foreground`: `Or call 01632 960 352`, with the number a link in running text to `tel:+441632960352`.

This page has no default button: nothing on it is the one main action.

### 6. Footer

The footer from the layout notes.

### Behavior

Nothing on this page has state. Links only.
