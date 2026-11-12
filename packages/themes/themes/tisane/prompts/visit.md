---
page: visit page
title: Visit
description: the page that tells people how to find a tea room, with its address, opening hours with today marked, how to get there, a map drawn from plain elements, notes on access and a contact form.
order: 5
checks:
  - The opening hours are a table with real `<th>` cells, and today's row says "Today" in words, not only with a color.
  - The map is drawn from plain elements with `role="img"` and an `aria-label`, and a paragraph next to it gives the same directions in words.
  - The address is an `<address>` element, set upright, with the phone number and email address as links.
  - Every field of the contact form has a visible label, each empty or wrong field gets its own message in words with an icon, and a good message replaces the form with a confirmation that a screen reader announces.
  - At 375px the hours table and the map fit the screen without the page scrolling sideways.
---

Sample content, if the user gave none: "The Linden Room", a tea room and shop at 14 Mill Lane, Ashby Wold, AW3 7LN, on the corner of Mill Lane and Station Road, opposite Orchard Park. Phone 01632 960 418, email hello@lindenroom.example. Open Tuesday to Friday 9:00–17:00, Saturday 9:00–18:00, Sunday 10:00–16:00, closed on Mondays; the kitchen serves plates from 11:30 to 14:30. Ashby Wold station is a four-minute walk; the 12 and 31 buses stop outside the park.

Build these parts in order.

### 1. Header

The header from the layout notes, with "Visit" as the current page; its link keeps `/visit`.

### 2. Opening

The first section, with `pt-10`, in columns 1–8 of a grid (`grid gap-6 md:grid-cols-12`): a label, `Mill Lane, Ashby Wold`, then with `mt-2` the `<h1>` "Visit us" in `text-h1`, then with `mt-4` one or two sentences: where the room is, and that there is no need to book unless you are four or more.

### 3. Address and hours

A section with `mt-18`, as a grid (`grid gap-6 md:grid-cols-12 md:items-start`):

- In columns 1–4: an `<h2>` "Address", then with `mt-4` an `<address className="not-italic">` with three block lines in `text-body`: `14 Mill Lane`, `Ashby Wold`, `AW3 7LN`. With `mt-4` the phone number and with `mt-2` the email address, each a link in running text in its own `<p>` inside the `<address>`, the `<p>` carrying the margin: `tel:+441632960418` and `mailto:hello@lindenroom.example`.
- In columns 6–12: an `<h2>` "Opening hours", then with `mt-6` the hours table.

**Hours table.** The shadcn `Table` as the layout notes describe (add it, with the form's fields, by `npx shadcn@latest add table input textarea` if missing), with `label="Opening hours"`, seven rows from Monday to Sunday and three columns: Day, Room, Kitchen. Header cells have `scope="col"`; the day in each row is a `TableHead` with `scope="row"`, given `h-auto`, the body cells' classes and `font-sans text-body font-normal text-foreground text-left` in place of the header look. The Room and Kitchen cells are labels in `text-foreground` with `tabular-nums`, each time in a `<time>`: `9:00–17:00`, `11:30–14:30`. Monday reads `Closed` in both, as a word.

Today's row gets `aria-current="date"`, and its day cell holds, under the day's name, the word `Today` as a `<span>` with `block font-mono text-label text-primary` and no margin. No fill, no bold. Take today from the visitor's clock.

At 375px the table fits: `whitespace-nowrap` on every Room and Kitchen cell, Monday's `Closed` included; the day cell wraps.

### 4. Getting here

A section with `mt-18`, as a grid (`grid gap-6 md:grid-cols-12 md:items-start`):

- In columns 1–5: an `<h2>` "Getting here", then with `mt-6` four entries as a `<ul>` with no markers and no padding. Each entry after the first has `mt-6`. Each is an `<h3>` in `text-body` (By train, By bus, By bike, By car), and with `mt-2` one or two sentences in `text-body`. By car: there is no parking on Mill Lane; the car park on Station Road is three minutes away.
- In columns 7–12: a `<div>` holding the map's `<figure>` and, after the figure, the directions paragraph.

**The map.** A `<div>` with `relative aspect-4/3 overflow-hidden rounded-xl border bg-muted`, `role="img"`, the `aria-label` "Map of the streets around The Linden Room", and `aria-describedby` pointing at the directions paragraph. Draw it with absolutely placed plain elements, using only the classes below: fractions of the box and `inset-*-0`, no translate and no arbitrary values. No shape is round:

- Two streets, each a strip in `bg-background`: Station Road across the box (`absolute inset-x-0 top-1/2 h-4`) and Mill Lane down it (`absolute inset-y-0 left-1/4 w-4`).
- The railway, a thin strip in `bg-secondary` along the top (`absolute inset-x-0 top-1/6 h-1`).
- Orchard Park, a block in `bg-card` with a 1px border and square corners, in the lower right (`absolute right-1/12 bottom-1/12 flex h-1/5 w-2/5 items-center justify-center`), holding its name tag.
- The tea room, just below the corner of the two streets: a `<div>` with `absolute top-7/12 left-1/4 flex items-center gap-1` holding the `MapPin` icon in `text-primary` with `size-6` (here, instead of the notes' `size-4`), `strokeWidth={1.5}` and `aria-hidden="true"`, and a tag reading `The Linden Room`.
- A tag is `rounded-sm bg-card px-2 py-1 font-mono text-label text-foreground whitespace-nowrap`; the tea room's alone adds `border`. Besides that one and the park's, two more: `Station Road` above its street at the right (`absolute right-1/12 bottom-1/2`), and `Mill Lane` on its street near the top (`absolute top-1/4 left-1/4`).

At 375px the box is about 343 by 257 pixels, and these places keep every tag inside it and clear of the others: the closest pair, the tea room's tag and the park, are about 8px apart.

Under the map, with `mt-2`, the `<figcaption>`: a label in `text-muted-foreground`, `Not to scale`. After the `<figure>`, with `mt-4`, the directions paragraph in `text-body` with an `id`: "From the station, walk down Station Road for four minutes. We are on the corner with Mill Lane, opposite Orchard Park."

### 5. Access

A section with `mt-18`, in columns 1–8 of a grid: an `<h2>` "Access", then with `mt-4` a bulleted list in running text (`list-disc pl-6`, `mt-2` between items) of six notes: a step-free entrance on Mill Lane, an accessible toilet on the ground floor, two tables at wheelchair height by the window, a printed large-type menu at the counter, assistance dogs welcome, and a quiet first hour on Tuesdays with the music off.

### 6. Write to us

A section with `mt-18` and the `id` `contact`, in columns 1–7 of a grid: an `<h2>` "Write to us", then with `mt-4` one sentence saying who reads the messages and that they answer within two days, then with `mt-6` a card that is the wrapper for the form and the confirmation. The `<form>` has `noValidate` and the `aria-label` "Write to us"; after it comes the empty `role="status"` element. Fields, `mt-6` apart:

- "Your name": an `Input` with `autoComplete="name"`.
- "Email address": an `Input` of type `email` with `autoComplete="email"`.
- "About": a native `<select>` styled as the layout notes describe, with the empty choice "Choose a subject", then "A booking", "Buying tea", "Access", "Something else".
- "Message": a `Textarea` with `min-h-48`.

Then, in the notes' `<div>` with `mt-6`, the page's one default button, `type="submit"`: "Send message".

### 7. Footer

The footer from the layout notes.

### Behavior

- Each empty field gets its own error line: "Write your name.", "Write your email address.", "Choose what your message is about.", "Write a message." A malformed address gets "Check the email address: it needs an @ and a domain." Focus moves to the first field with an error.
- When all four are good, the form is replaced in its card by the confirmation in the status element: an `<h3>` in `text-h2`, "Thank you", with `tabIndex={-1}`, and with `mt-4` one sentence saying an answer comes within two days, to the address they gave. The heading and sentence sit in the message `<div>`, the `mt-4` on the sentence; no button follows. Move focus to the heading.
- Today's mark is set when the page loads.
- The other links need no behavior.
