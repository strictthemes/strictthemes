---
page: guidance page
title: Guidance
description: a page of plain-language guidance for a public service, with a contents list, short sections, a list, a table of fees, one important notice and related links.
order: 5
checks:
  - The contents list has one link for each `<h2>` section of the body, and each link jumps to its heading.
  - The fee table has one header row, its amounts are right-aligned, and its scroll box is named "Prices for a 12-month permit".
  - There is exactly one signal-yellow notice, with dark text, the word "Important" beside its icon, and no link or muted text inside it.
  - The page has one civic-blue main action, "Apply for a permit", which is a link styled as a button.
  - Paragraphs are short (at most three sentences), and no text is muted except hints, captions and the updated date.
---

Sample content, if the user gave none: "Callowmere Council", an invented town council, and its guidance "Resident parking permits: who can get one and what it costs", updated on 4 November 2026. Permits are for homes in zones A to D, last 12 months, and at most two are given per address. Prices for 12 months, first permit and second permit at the same address: petrol or diesel £96 and £144, hybrid £72 and £108, fully electric £30 and £45. Visitor permits are £24 for a book of 20 day permits. From 1 April 2027, petrol and diesel permits go up to £102 and £150. Homes at Linden Yard, built without parking, cannot get a permit. Use these facts as they are; write the rest of the copy yourself, plain and short.

Build these parts in order.

### 1. Header

The header from the layout notes: "Callowmere Council" and "Apply for a resident's parking permit".

### 2. Title

The first element of `<main>`:

- A caption: `Guidance`.
- With `mt-2`, the `<h1>`: "Resident parking permits: who can get one and what it costs". The page's `<title>` is these words then " – Callowmere Council", here in place of the note's.
- With `mt-6`, one paragraph of two sentences: what a permit is and who this page is for.
- With `mt-4`, a label: a `<p>` in `font-mono text-label text-muted-foreground`, "Updated" and the date in a `<time>` with a `dateTime`.

### 3. Contents

With `mt-10`: a `<nav>` with `aria-labelledby` naming its heading, `border-l-4 border-border pl-4`. Inside it an `<h2>` "Contents" in `font-mono text-label text-muted-foreground`, here styled as a label in place of the Headings note's `text-h2`, with no top margin, then with `mt-2` a link list from the layout notes with one link for each of the five sections below, in their order.

### 4. Body

Five sections. They are not new parts: no `<section>` around them and no `mt-16`. Each is an `<h2>` with an `id`, `scroll-mt-6` and the `mt-10` from the layout notes, followed by its content, all directly in `<main>`. Paragraphs are `text-body`, at most three sentences each.

**Who can get a permit.** One paragraph: whether you can get one depends on where you live, on the vehicle and on how many permits your address has. Then with `mt-4` a sentence "You can get a permit if:" and with `mt-4` a bulleted list of three conditions: you live in zone A, B, C or D; the vehicle is registered to you at your address, or is a company car you are the main driver of; and your address has fewer than two permits. Then with `mt-4` a paragraph: homes at Linden Yard cannot get a permit, because they were built without parking. Then with `mt-4` a paragraph "Not sure which zone you live in? Find your permit zone.", in which "Find your permit zone" is the text link, a sentence of its own, with its full stop outside the link.

**What a permit costs.** One paragraph: the price depends on what the vehicle runs on and on whether it is the first or the second permit at the address. Then:

- An `<h3>` "Prices for a 12-month permit", with the `mt-6` from the layout notes.
- With `mt-4`, here in place of the `mt-2` under an `<h3>`, a wrapper `<div>` around the fee table: the shadcn `Table` as the layout notes set it, with the `label` "Prices for a 12-month permit". Three columns, "Vehicle runs on", "First permit" and "Second permit"; the two price columns and their headers are right-aligned (`text-right tabular-nums`). Three rows: petrol or diesel, hybrid, fully electric, with the prices from the sample. Add it with `npx shadcn@latest add table`.
- With `mt-6`, one paragraph: visitor permits cost £24 for a book of 20 day permits. It ends with the sentence "Read about visitor parking permits.", in which "visitor parking permits", lower case, is the text link.
- With `mt-6`, the notice from the layout notes, the only one on the page: from 1 April 2027 petrol and diesel permits cost £102 for a first permit and £150 for a second. A permit bought before then keeps its price until it ends. The date is a `<time>`.
- With `mt-6`, one paragraph: if you get council tax support, your first permit costs half the price.

**What you need to apply.** A sentence "You will need:" and with `mt-4` a bulleted list of three things: the vehicle's registration number, the date you want the permit to start, and proof of address from the last 3 months, such as a council tax bill, a tenancy agreement or a utility bill. Then with `mt-4` a paragraph: for a company car, a letter from your employer that says you are the main driver. Then the page's main action, in a `<p>` with `mt-10`: an `<a href="#">` styled as a default button, `cn(buttonVariants(), "h-11 w-full px-6 font-mono text-label md:w-auto")`, "Apply for a permit", with the `ArrowRight` icon after the words.

**How long a permit lasts.** Two paragraphs: a permit lasts 12 months from its start date; a reminder email comes 4 weeks before it ends, and you renew online in the same way you applied.

**If something changes.** A sentence, then with `mt-4` a bulleted list of three cases, each one or two sentences: you change vehicle (update the registration online, free); you move house (cancel the permit; you get back the full months left, less a £10 fee); you sell the vehicle and do not replace it (cancel it the same way).

### 5. Related

A new part of the page: a `<section>` (not an `<aside>`, which inside `<main>` would be a landmark nested in a landmark) with `mt-16 border-t border-border pt-6`. Inside it an `<h2>` "Related" with no top margin, then with `mt-4` a link list of three links: "Apply for a resident's parking permit", "Visitor parking permits", "Pay or challenge a parking fine". Each goes to `#`; the first has the words and the destination of the header's service name, which is right: both lead to the service's start page.

### 6. Footer

The footer from the layout notes.

### Behavior

- The contents links jump to their headings. Nothing else on the page needs behavior; every other link goes to `#`.
- On a phone the fee table scrolls sideways inside its box, the button fills the column, and the long `<h1>` wraps.
