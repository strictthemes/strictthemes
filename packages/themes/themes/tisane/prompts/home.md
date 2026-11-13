---
page: home page
title: Home
description: the opening page of a tea room and shop, with a calm welcome, what is in season, a line about the place, its opening hours and a newsletter sign-up.
order: 1
checks:
  - The opening has one `<h1>`, one sentence and one button, and that button is the only olive (default) button on the page.
  - The "In season" cards each open with a picture drawn from a plain element with `role="img"` and an `aria-label`, and each shows its price as a mono label.
  - The opening hours are a list of rows with the day on the left and the times on the right in the mono font, with a 1px rule between rows.
  - The newsletter email field has a visible label; an empty or malformed address gets a message in words with an icon, and a good one replaces the form with a confirmation that a screen reader announces.
  - No heading or text in the heading font has a bold, semibold or medium weight class.
---

Sample content, if the user gave none: "The Linden Room", a tea room and shop at 14 Mill Lane, Ashby Wold, in a former seed merchant's. It serves loose-leaf tea and herbal tisanes, soup and plates at lunch, and cakes baked each morning, and it sells the same teas by weight. Open Tuesday to Sunday, closed on Mondays. Write all the copy yourself, plain and specific, without superlatives.

Build these parts in order.

### 1. Header

The header from the layout notes. No link is the current page here: the name is the link home.

### 2. Opening

The first section, with `pt-10`, as a grid (`grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center`; here `md:items-center` takes the place of the notes' `md:items-start`):

- In columns 1–6: a label, `Tea room and shop · Ashby Wold`, then with `mt-2` the `<h1>` in `text-h1 md:text-display`: a short phrase, for example "Tea, soup and cake, made slowly". With `mt-4` one sentence in `text-body` that says what the place is. With `mt-6`, in a `<p>`, the page's one default button: an `<a>` styled as a button, "Book a table", that goes to `/booking`.
- In columns 8–12: a picture, `aspect-4/3`, with the `aria-label` "The window seat on a grey morning, a pot of tea on the sill" and a caption such as `The window seat, Mill Lane`.

On a phone the picture comes under the button, with the grid's `gap-6` between them.

### 3. In season

A section with `mt-18`: an `<h2>` "In season", then with `mt-4` one sentence that says what changes each month. Then with `mt-6` a grid of three cards (`grid grid-cols-1 gap-6 md:grid-cols-3`), stacked on a phone. This grid has no `md:items-start`: the cards stretch to the same height.

Each card is a card with a picture at its top, as the layout notes describe:

- The picture, `aspect-3/2`, with an `aria-label` that says what it shows: a plain `<div>` with no `<figure>` and no caption, as the Cards note says.
- In the `<div>` with `p-6`: a label in `text-muted-foreground` naming the kind, for example `Tea`, `Plate` or `Cake`; with `mt-2` an `<h3>` in `text-h2` with the item's name; with `mt-4` one or two sentences about it; and with `mt-4` the price as a label in `text-foreground`, the price first: `£4.20 a pot`, `£7.50 with rye bread`, `£3.60 a slice`.

Sample items: Pear and ginger tisane (a pot, £4.20), Roast squash and lentil soup (with rye bread, £7.50), Pear and cardamom loaf (a slice, £3.60). No badge on this page.

After the grid, with `mt-6`, a `<p>` holding a link in running text: "See the whole menu", which goes to `/menu`.

### 4. The place

A section with `mt-18`, in columns 1–8 of a grid (`grid grid-cols-1 gap-6 md:grid-cols-12`):

- A label: `Since 2019`.
- With `mt-2`, one or two sentences about the room as a `<p>` in `font-heading text-h2`, for example: the counter is the seed merchant's old one, the cups are thrown at a pottery two streets away, and the teas are weighed out at the same counter. This is a paragraph, not a heading.
- With `mt-4`, a `<p>` holding a link in running text: "How to find us", which goes to `/visit`.

### 5. Opening hours

A section with `mt-18`, in columns 1–6 of a grid: an `<h2>` "Opening hours", then with `mt-6` a list of rows as the layout notes describe, with `py-2` on each row. Four rows:

- Tuesday to Friday: `9:00–17:00`
- Saturday: `9:00–18:00`
- Sunday: `10:00–16:00`
- Monday: `Closed`, the same label in `text-foreground`, as plain text with no `<time>`

The day is `text-body`; the times are a label in `text-foreground` with each time in a `<time>` (`<time dateTime="09:00">9:00</time>`). No row is marked as today on this page. Under the list, with `mt-4`, one sentence: lunch is served from 11:30 to 14:30, and cakes until they run out.

### 6. Newsletter

A section with `mt-18`, in columns 1–7 of a grid: a card holding the form and, later, the confirmation that replaces it. The card is the wrapper the layout notes ask for.

Inside the card:

- A label: `Four letters a year`.
- With `mt-2`, an `<h2>` "News from the room".
- With `mt-4`, one sentence: a short letter when the season's teas come in, nothing else.
- With `mt-6`, the form. Add the field with `npx shadcn@latest add input` if the project has none, and give the new file the edits the Added components note lists. The label "Email address", then with `mt-2` a row `<div>` with `md:flex md:gap-4` and no `items-*` class, so the button stretches to the field's 46px height instead of stopping short of its bottom. In the row: a `<div>` with `md:flex-1` holding the `Input` of type `email` (the `Input` has no margin of its own here: the row carries the `mt-2`), and the `secondary` button "Sign up", `type="submit"`, with `mt-4 md:mt-0` on the button itself. Here, instead of the notes' `<div>` with `mt-6`, the button carries `mt-4`, since it shares the row from `md` and on a phone sits right under its field, at its own width, not the field's. The error line sits under the row, with `mt-2`.
- After the form, the empty `role="status"` element, as the layout notes describe.

### 7. Footer

The footer from the layout notes.

### Behavior

- An empty address shows "Write your email address." and a malformed one "Check the email address: it needs an @ and a domain." Focus goes to the field.
- A good address replaces the form with the confirmation in the status element: an `<h3>` in `text-h2`, "You are on the list", and with `mt-4` one sentence saying the next letter comes when the winter teas arrive, in December. A month alone is not a date: "December" is plain text, not a `<time>`. The heading and the sentence are inside the message `<div>`, which has `mt-6` because the card's text stays above it; the `mt-4` goes on the sentence. The heading has `tabIndex={-1}` and gets the focus. The card's label, heading and sentence above the form stay. No button follows the confirmation.
- The other links need no behavior.
