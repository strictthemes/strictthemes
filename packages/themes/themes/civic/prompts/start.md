---
page: service start page
title: Start page
description: the start page of a public service, saying what it is for, who can use it, what you need, how long it takes, a "Start now" link and other ways to apply.
order: 1
checks:
  - The page has one civic-blue main action, "Start now", which is a link (`<a>`) styled as a button, at least 44px tall, with its arrow icon beside the words.
  - The lists of who can apply and what you need are real lists (`<ul>`), and the time it takes is stated in words.
  - The other ways to apply give a phone number, opening hours and a postal address in an `<address>` element, with no text in a color under 7:1.
  - No heading or paragraph is centered (only the words inside the full-width "Start now" link on a phone sit in its middle), and no content on the page is wider than 720px.
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      First run of this page, on briefs revised after another page of the theme was built. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 1,446 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems the earlier test builds reported. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 1,446 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 1,437 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: "Callowmere Council", an invented town council, and its service "Apply for a resident's parking permit". A permit lets a resident park one vehicle in their permit zone (zones A to D). It lasts 12 months and costs £30 to £144 a year, by vehicle type and whether it is the first or second permit at the address. Applying online takes about 10 minutes, and the council decides within 5 working days. Phone: 01632 960 418, Monday to Friday, 9am to 5pm. In person or by post: Parking Services, Callowmere Council, Guildhall, Market Street, Callowmere CM1 1AA. Use these facts as they are; write the rest of the copy yourself, plain and short.

Build these parts in order.

### 1. Header

The header from the layout notes: "Callowmere Council" and the service name "Apply for a resident's parking permit".

### 2. Title and purpose

The first element of `<main>`:

- The `<h1>` "Apply for a resident's parking permit": `text-h1` below `md`, `text-display` from `md` up (`md:text-display`). No caption over it. Since it is the service's name, the page's `<title>` is "Apply for a resident's parking permit – Callowmere Council", here in place of the note's.
- With `mt-6`, one paragraph: what the permit lets you do, in one or two sentences.
- With `mt-4`, a paragraph "You can use this service to:", and with `mt-4` a bulleted list of three items: apply for a first permit, apply for a second permit at the same address, and replace a permit when you change vehicle.

### 3. Who can apply

An `<h2>` "Who can apply", then with `mt-4` a paragraph "You can apply if:" and with `mt-4` a bulleted list of three conditions: you live at an address in permit zone A, B, C or D; the vehicle is registered to you at that address, or is a company car you are the main driver of; and the address has fewer than two permits already.

Then with `mt-4` one paragraph naming who cannot apply: homes at Linden Yard, which was built without parking. It ends with a text link "Read who can get a permit and what it costs", which goes to `#`.

### 4. Before you start

An `<h2>` "Before you start", then with `mt-4` a paragraph "You will need:" and with `mt-4` a bulleted list of three things: your vehicle's registration number, the date you want the permit to start, and proof of address from the last 3 months, such as a council tax bill or a tenancy agreement.

Then with `mt-4` two sentences: it takes about 10 minutes, and you do not pay until the council has approved the application. Then with `mt-4` one sentence saying what it costs, with the range from the sample.

### 5. Start now

A `<p>` with `mt-10` holding the main action: an `<a href="#">` styled as a default button, `cn(buttonVariants(), "h-11 w-full px-6 font-mono text-label md:w-auto")`, with the text "Start now" and the `ArrowRight` icon after it (`aria-hidden="true"`). It is the only default button on the page.

Under it, with `mt-4`, one sentence in `text-body`: you can save your answers and come back within 7 days.

### 6. Other ways to apply

A new part of the page: a `<section>` with `mt-16`, opening with an `<h2>` "Other ways to apply" with no top margin of its own, then with `mt-4` one paragraph saying you can apply by phone, in person or by post if you cannot use the online service, or if you would like help.

Then with `mt-6` a box holding two short groups:

- An `<h3>` "By phone", with no top margin since it opens the box, then with `mt-2` a `<p>` holding the number as a `tel:` text link with `font-bold`, and with `mt-2` the opening hours as a `<p>`: "Monday to Friday, 9am to 5pm. Closed on public holidays."
- An `<h3>` "In person or by post", with `mt-6`, then with `mt-2` the address in an `<address>` element with `not-italic`, as five lines with a `<br>` between them: "Parking Services", "Callowmere Council", "Guildhall", "Market Street", "Callowmere CM1 1AA". With `mt-2`, a sentence saying the Guildhall counter is open Monday to Friday, 9am to 4pm, and that a paper form is there.

Then with `mt-6` one paragraph: if you need this page in another format, such as large print or audio, call the same number. The phone number in it is plain text.

### 7. Related

A new part of the page: a `<section>` (not an `<aside>`, which inside `<main>` would be a landmark nested in a landmark) with `mt-16 border-t border-border pt-6`. Inside it an `<h2>` "Related" with no top margin, then with `mt-4` a link list (from the layout notes) of three links: "Who can get a permit and what it costs", "Visitor parking permits", "Find your permit zone". Each goes to `#`.

### 8. Footer

The footer from the layout notes.

### Behavior

- "Start now" and every other link go to `#`; the page needs no other behavior.
- On a phone the "Start now" link fills the column and the header's service name wraps under the council's name. 
