---
page: visitor information page
title: Visit
description: the visitor page of an independent cinema, with its address, opening times, its screens with seats and access notes, the bar, how to get there and a contact form.
order: 5
checks:
  - The opening times are a table with real `<th>` cells, its times are `<time>` elements in `font-mono tabular-nums`, and at 375px it fits or scrolls inside its own keyboard-reachable box.
  - Each screen states its seat count and its access notes in words; no access feature is shown by an icon alone.
  - The address is an `<address>` element, and the still of the bar has `role="img"`, an `aria-label` and a caption.
  - Sending the contact form with an empty name, a malformed email or an empty message shows a sentence with an icon under each such field, and a good form is replaced by a confirmation in a `role="status"` element.
  - The "Send message" button is the page's only default (gold) button.
---

Sample content, if the user gave none: **The Vesper**, an independent cinema with three screens and a late bar, in a former rope works at 21 Tallow Row, Oldmere OM2 4LT. Phone 01632 960 418, email hello@vesper.example. Screen 1 has 212 seats, Screen 2 has 84, Screen 3 has 38. The bar is on the first floor and stays open until midnight on Fridays and Saturdays. The nearest tram stop is Tallow Row on the Harbour line, three minutes' walk. Opening times: Monday closed; Tuesday to Thursday doors 17:00, last film 21:00, bar closes 23:30; Friday and Saturday doors 16:00, last film 23:15, bar closes 00:00 (midnight); Sunday doors 13:00, last film 20:30, bar closes 22:30.

Build these parts in order.

### 1. Header

The header from the layout notes. "Visit" is the current page.

### 2. Introduction

The first `<section>`, a grid (`md:grid-cols-12`):

- Columns 1–7: a label "Visit"; with `mt-2`, the `<h1>` "Find the Vesper" in `text-h1 md:text-display`; with `mt-6`, one paragraph within `max-w-xl` about the building: a rope works from 1871, a cinema since 1934, three screens and a bar on the first floor.
- Columns 9–12, with `mt-12 md:mt-0`: a card from the layout notes. A label "Address"; with `mt-2`, an `<address>` in `text-body` with `not-italic`, in three lines, "21 Tallow Row", "Oldmere" and "OM2 4LT", broken with `<br />`; with `mt-4`, a `<p>` holding the phone number and, under it with no margin, a `<p>` holding the email address, each a text link (`tel:` and `mailto:`). Do not uppercase the email address.

### 3. Opening times

The second `<section>`, with `mt-24`. An `<h2>` "Opening times" in `text-h2 md:text-h1`, then with `mt-4` one sentence: the box office opens half an hour before the first film.

With `mt-6`, in columns 1–8 of a grid (`md:grid-cols-12`), the `Table` from the layout notes (add it with `npx shadcn@latest add table`), with the `label` "Opening times". Columns: Day, Doors open, Last film starts, Bar closes. One row per day, Monday to Sunday; the first cell of each row is a `TableHead` with `scope="row"` and, in place of the column headers' label classes, `py-2 font-sans text-body font-normal text-foreground`; like every cell it keeps `px-4` and `first:pl-0 last:pr-0`. The column headers are `<th scope="col">`. Every time is a `<time>` (`dateTime="17:00"`) in `font-mono tabular-nums`. Monday is closed: its row says "Closed" in words in the Doors open cell, and its other two cells hold "—" with a visually hidden "Closed". Today, Wednesday, is not marked.

The stock cells do not wrap, so the table is about 480px wide: at 375px it is wider than the screen and scrolls sideways inside its own box, and the page does not.

### 4. Screens

The third `<section>`, with `mt-24`. An `<h2>` "The screens" in `text-h2 md:text-h1`.

With `mt-6`, three cards from the layout notes in a grid `grid grid-cols-1 gap-6 md:grid-cols-3`. Each card is an `<article>`:

- The screen's name as an `<h3>` in `text-h2` ("Screen 1").
- With `mt-2`, a label in `text-muted-foreground`: the seats and the screen's format, e.g. `212 seats · 35mm and digital`.
- With `mt-4`, one sentence about the room.
- With `mt-6`, the access notes as a `<ul>` with `list-disc pl-4` in `text-body`, with `mt-2` on every item but the first. Write them as facts: step-free from the street, the number of wheelchair spaces and where they are, a hearing loop, which seats have extra legroom, captioned screenings on Tuesdays. Screen 3 is up a flight of stairs with no lift: say so plainly, as the first note.

Below `md` the cards stack.

### 5. The bar

The fourth `<section>`, with `mt-24`, a grid (`md:grid-cols-12`):

- Columns 1–7: a still of the bar in a `<figure>`, with the `aria-label` "The first-floor bar at night, with its long zinc counter and the windows over Tallow Row" and a caption, a label: `The bar · An hour before the late show`.
- Columns 8–12, with `mt-6 md:mt-0`: an `<h2>` "The bar" in `text-h2 md:text-h1`; with `mt-4`, two paragraphs, the second with `mt-4`, on what it serves (local beer, coffee until late, small plates until 21:00) and that you can take a drink into Screens 1 and 2; with `mt-4`, a label in `text-muted-foreground`: `Opens with the doors · Until midnight Fri and Sat`.

On a phone the still comes first.

### 6. Getting here

The fifth `<section>`, with `mt-24`. An `<h2>` "Getting here" in `text-h2 md:text-h1`. With `mt-6`, a `<dl>` laid out as a grid `grid grid-cols-1 gap-6 md:grid-cols-2`, four entries, each a `<div>` with `border-t border-border pt-4`: the `<dt>` a label in `text-muted-foreground` (`By tram`, `By bus`, `By bike`, `By car`), the `<dd>` with `mt-2` one or two sentences in `text-body`, within `max-w-xl`. No map.

### 7. Contact

The sixth `<section>`, with `mt-24` and the `id` "contact", a grid (`md:grid-cols-12`):

- Columns 1–5: an `<h2>` "Write to us" in `text-h2 md:text-h1`, then with `mt-4` one sentence: questions about access, private hire or lost property, answered within two working days.
- Columns 7–12, with `mt-12 md:mt-0`: a wrapper holding the form and the status element from the layout notes.

The form, with `noValidate`:

1. "Your name", an `Input` with `autoComplete="name"` (add `input` and `textarea` with `npx shadcn@latest add` if the project lacks them).
2. With `mt-6`, "Email address", an `Input` with `type="email"` and `autoComplete="email"`.
3. With `mt-6`, "Topic", a native `<select>`: General question, Access, Private hire, Lost property. General question is chosen at first.
4. With `mt-6`, "Message", a `Textarea` with `rows={5}`; in `components/ui/textarea.tsx`, replace `field-sizing-content` with `field-sizing-fixed` (the stock one sizes to its content and ignores `rows`). Helper text: "If you lost something, say which screening you were at."
5. With `mt-6`, the default `Button` "Send message", with `type="submit"`. It is the page's one gold action.

### 8. Footer

The footer from the layout notes.

### Behavior

- When the form is sent, check it in code: the name must not be empty ("Enter your name."), the email must not be empty and must look like an address, with one `@` and a dot after it ("Enter an email address such as name@example.com."), and the message must be at least 20 characters ("Write a few words more, so we can help: at least 20 characters."). Show every error at once and move focus to the first field with an error.
- A good form is replaced by the confirmation. Its `<h3>`: "Thank you, your message is with us", with no full stop. Under it, with `mt-4`, one sentence that names the topic and the email address the reply goes to: "We will answer your question about access at mara@example.com within two working days." The topic reads "your question" for General question, "your question about access", "your question about private hire" and "your message about lost property". Nothing is sent anywhere: this is a demo.
- The phone and email links use `tel:01632960418` and `mailto:hello@vesper.example`. No link needs behavior.
