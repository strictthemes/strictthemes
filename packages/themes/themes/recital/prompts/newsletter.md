---
page: newsletter sign-up page
title: Newsletter
description: the sign-up page of a newsletter or a small publication, with what it is, a sample of the writing, what readers say and a sign-up form.
order: 4
checks:
  - The email field has a visible label, and a wrong address gets a message in words with an icon, tied to the field with `aria-describedby`.
  - After a good address is sent, the form is replaced by a confirmation that a screen reader announces.
  - There is one oxblood button on the page; the link at the end of the page that leads back to the form is the ink variant.
  - No text is centered.
---

Sample newsletter, if the user gave none: "The Long Margin", a letter sent every other Sunday by one writer, about work that takes a long time: a boat built over six years, a dictionary, a garden. About 4,000 readers. Free. Write all the copy yourself, plain and specific, without superlatives.

Build these parts in order.

### 1. Header

The publication's name and two nav links, in this order: Archive (`/archive`), About (`/about`). None is marked as the current page.

### 2. Opening

In the reading column, with `pt-24`:

- A label: how often the letter comes, e.g. `A letter every other Sunday`.
- With `mt-4`, the `<h1>`: a short phrase that says what the letters are about. `text-display` from `md` up, `text-h1` below.
- With `mt-6`, two or three sentences that say what a reader gets and who writes it.

### 3. Sign-up form

In its own reading column, with `mt-12`: that column `<div>` is the wrapper of the notes' Confirmations. It has the `id` `subscribe` and `scroll-mt-6`, and holds the form and the status element for the confirmation that replaces it. The form has a labelled email field ("Email address") and, in a `<div>` with `mt-4`, the default button "Subscribe". Under the button with `mt-4`, inside the form, a label: `Free · Every other Sunday · Leave with one click`.

### 4. From the last letter

In the reading column, with `mt-24`:

- A label: the letter's number and date, e.g. `Letter 112 · 1 March 2026`.
- With `mt-2`, an `<h2>`: the letter's title.
- Three paragraphs from the letter, the first with `mt-4` and the others with `mt-6`, about 150 words, with one `<em>`.
- A block quote (`my-12`): one sentence from later in the same letter, with no name under it.
- A `<p>` with `mt-6` that holds only one link in running text: "Read the whole letter".

### 5. What you get

In the reading column, with `mt-24`: an `<h2>` "What you get", then with `mt-6` three items, each with a 1px top border and `py-6`: an `<h3>` and, with `mt-2`, one or two sentences. For example: one long letter, one thing worth reading from someone else, and no advertising. No icons, no cards, no numbers in circles.

### 6. Readers

In the reading column, with `mt-24`: an `<h2>` "From readers", then two block quotes, the first with `mt-6 mb-12` and the second with `my-12`, so they stand 48px apart. Each is one or two sentences, with the reader's first name and what they do under it. Invent them.

### 7. The writer

In the reading column, with `mt-24`: a card (`mb-12`, as the notes give a card that opens a part). Inside it a label `<p>` ("Who writes it"), then with `mt-2` the writer's name as an `<h2>` in `text-h2`, then with `mt-4` two or three sentences about them.

### 8. Recent letters

In the reading column, with `mt-24`: an `<h2>` "Recent letters", then with `mt-6` a list of five letters. Each `<li>` has a 1px top border and `py-4`, and from `md` up is one row: `md:flex md:items-baseline md:justify-between md:gap-6`. In it the title, a link styled as a link in a list of titles, and the date as a label `<p>` holding a `<time>`, with `mt-2 md:mt-0 md:shrink-0`: under the title below `md`, at the right end from `md` up. Under the list, a `<p>` with `mt-6` holds the link "See the archive", styled as a link in running text.

Then, still in this column, a `<p>` with `mt-12`: one sentence that asks the reader to sign up. Under it a `<p>` with `mt-4` holding a link styled as a `secondary` button, "Subscribe", whose `href` is `#subscribe`.

### 9. Footer

The footer from the layout notes.

### Behavior

- An empty or malformed address shows the error line under the field. A good one replaces the form with a confirmation: an `<h2>` in `text-h2` with no top margin, "You are on the list", and with `mt-4` one sentence saying the next letter arrives within two weeks.
- The "Subscribe" link at the end of the page scrolls to the wrapper and moves focus to the email field, or to the confirmation's heading once the form is gone. This needs a click handler: keep the link's own jump to `#subscribe` (do not call `preventDefault`), and in its `onClick` call `focus({ preventScroll: true })` on the field or the heading, each held in a ref.
- The other links need no behavior.
