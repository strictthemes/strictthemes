---
page: about page
title: About
description: an about page for a writer or a small publication, with who makes it, how it is made, a short history and a contact form.
order: 5
checks:
  - The avatars are the only circles on the page, and each one shows initials, not an image.
  - The details of how the publication is made are a description list (`<dl>`), and the history is an ordered list with a `<time>` for each year.
  - Every field of the contact form has a visible label, and each wrong or empty field gets its own message in words with an icon.
  - Body text in the reading column averages 60 to 70 characters a line on a desktop screen.
---

Sample publication, if the user gave none: "The Long Margin", a small magazine about work that takes a long time, started in 2019, written by three people and paid for by its readers. Write all the copy yourself, plain and specific. Invent the people.

Build these parts in order.

### 1. Header

The publication's name and three nav links, in this order: Essays (`/essays`), Journal (`/journal`), About (`/about`). "About" is the current page.

### 2. Opening

In the reading column, with `pt-12`: a label `<p>` ("About"; not a label heading, so the `<h1>` stays the first heading), then with `mt-4` the `<h1>`, whose text is one sentence, with no full stop, that says what the publication is, then two paragraphs, the first with `mt-6`: why it exists and who it is for.

### 3. In numbers

Wide, with `mt-12`: a `<dl>` laid out as a row of three numbers (not `<figure>` elements), `grid gap-6 md:grid-cols-3`, single column below `md`. Each number and its term are a `<div>` with a 1px top border and `pt-4`: the number as the `<dd>` in `font-heading text-h1`, and what it counts as the `<dt>`, a label in `text-muted-foreground` under the number with `mt-2`. Use `flex flex-col-reverse` on each pair so that the `<dt>` stays first in the code. For example: letters sent, paying readers, years in print, each term a few words.

### 4. Who makes it

In the reading column, with `mt-24`: an `<h2>` "Who makes it", then three people, the first with `mt-6` and the others with `mt-12`. Each person is:

- A row with `flex items-center gap-4`: an avatar, and beside it a `<div>` holding the name as an `<h3>` and the role as a label `<p>` under it with `mt-2`.
- With `mt-4`, two or three sentences about them.

The avatar is `flex size-12 shrink-0 items-center justify-center rounded-full border bg-card`, with the person's initials in it in `font-heading text-body`, and `aria-hidden="true"`. Here, instead of the notes' "Nothing is centered", the initials are centered in their circle; that is the page's one exception.

### 5. How it is made

In the reading column, with `mt-24`: an `<h2>` "How it is made", then two paragraphs, the first with `mt-4` and the second with `mt-6`. The first holds one `<em>`, the second one link in running text.

Then a card (`my-12`), a `<div>` (it is not a note beside the text), holding only a `<dl>`: here, instead of the notes' label first, the card has no label, and the `<dl>` starts at the card's top with no margin. It has four rows: Typefaces, Published, Paid for by, Since; the value of Since is a `<time dateTime="2019">`. Each row is a `<div>` around a `<dt>`, a label in `text-muted-foreground` of one to three short words (from `md` up its column is about 98px), and its `<dd>`; every row but the first has `mt-4`, joined to the row's other classes with `cn(...)` so that it stays a class of its own. Below `md` the value sits under its term with `mt-2`. From `md` up each row is `md:grid md:grid-cols-4 md:items-baseline md:gap-x-6`, with the term in the first column and the value across the other three (`md:col-span-3 md:mt-0`), so the values line up.

### 6. A short history

In the reading column, with `mt-24`: an `<h2>` "A short history", then with `mt-6` an ordered list without numbers (`list-none`) of five entries. Each entry has a 1px top border and `py-4` (no line under the last, as the notes say) and holds two things: the year, a label `<p>` holding a `<time dateTime="2019">`; and under it, with `mt-2`, a `<p>` with one sentence about what happened.

Then a block quote (`my-12`): one sentence a reader once wrote about the magazine, ending with a full stop, with their first name and their town under it, e.g. `Ingrid, Leeds`.

### 7. Write to us

In the reading column, with `mt-24` and the `id` `contact`: an `<h2>` "Write to us", then with `mt-4` one sentence saying who reads the messages and how soon they answer, then a wrapper with `mt-6` that holds the form and its status element (see Confirmations in the notes). The form's parts are `<div>` elements, every one but the first with `mt-6`:

- "Your name": an `Input`.
- "Email address": an `Input` of type `email`.
- "Message": a `Textarea` with `min-h-48`. Add `Input` and `Textarea` with `npx shadcn@latest add input textarea`.
- The default button "Send message", alone in its `<div>`.

### 8. Footer

The footer from the layout notes.

### Behavior

- Each empty field, and a malformed address, gets its own error line. When all three are good, the form is replaced by a confirmation: an `<h3>` in `text-h2` with no top margin, "Thank you", and with `mt-4` one sentence saying when an answer will come.
- The other links need no behavior.
