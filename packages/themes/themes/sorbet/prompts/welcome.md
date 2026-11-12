---
page: welcome page
title: Welcome
description: the public page of a habit-tracking app, with a friendly opening and one main button, three things the app does, a drawn preview of the app, a quote from a user and a sign-up form.
order: 1
checks:
  - The opening has exactly one raspberry button, a link that jumps to the sign-up form, and no other raspberry button is on screen with it.
  - The preview of the app is drawn from plain elements, with `role="img"` and an `aria-label` that says what it shows, and no image file is loaded.
  - An empty name or a malformed email gets a message in words with an icon, tied to its field with `aria-describedby`, and focus moves to the first field with an error.
  - After a good sign-up, the form is replaced by a confirmation that a screen reader announces, and focus moves to it.
  - At 375px the preview sits under the opening text, and the page does not scroll sideways.
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      First run of this page, on briefs revised after another page of the theme was built. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 99.7% of 1,745 measured values, with no errors and 2 warnings for the round avatar, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 7 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems the earlier test builds reported. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 99.7% of 1,751 measured values, with no errors and 2 warnings for the round avatar, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 1,750 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: "Mossy", a habit tracker for small, daily steps. You pick up to five habits, tick them off each day and watch a streak grow. It is free for five habits; Mossy Plus is $4 a month. The person in the preview is Ines, on Wednesday, 11 November 2026, with five habits: Drink 8 glasses of water, Read 10 pages, Walk after lunch, Stretch for 5 minutes, No phone after 22:00. Write the copy yourself, warm and plain, with no superlatives.

The `<main>` uses `gap-16` between sections.

Build these parts in order.

### 1. Header

The header from the layout notes, without the app's nav: this page is for people who have no account yet. At the right end (`ml-auto`), a text link "Sign in" to `#`, as a label (`font-mono text-label`) in the link colors from the notes; the `<a>` itself carries `inline-flex h-11 items-center`, so it is a 44px target.

### 2. Opening

A grid from the layout notes, `md:items-center`. Its first item, `md:col-span-6`, is a `flex flex-col gap-6`:

- A `flex flex-col gap-4` with the `<h1>` in `text-h1 md:text-display` ("Small steps, every day") and one paragraph under it: "Mossy helps you keep a few small habits. Tick each one off when it is done. It takes about ten seconds a day."
- A row (`flex flex-wrap items-center gap-3`) with the page's one main button: an `<a>` to `#signup` styled as a default button, "Start for free". Beside it, a small figure: `Free for 5 habits · No card needed`.

Its second item, `md:col-span-6`, is the preview (part 3). Below `md` it sits under the text.

### 3. Preview of the app

A `<figure>` with `flex w-full flex-col gap-2 md:mx-auto md:max-w-sm`: full width below `md`, at most 384px wide and centered in its column from `md` up. Inside it, a card with `role="img"` and the `aria-label` "The Mossy home screen: three of five habits done today, and a 12-day streak", as wide as the figure. Everything inside the card has `aria-hidden="true"`. The card is drawn from plain elements, top to bottom, in its own `gap-4`:

- A small figure, `Wednesday, 11 November`, then the greeting "Good morning, Ines" in `font-heading text-h2`, in a `flex flex-col gap-2`. Both are fixed text, not read from the clock.
- A row with a good-news badge (add it with `npx shadcn@latest add badge`), "12-day streak", with the `Flame` icon.
- Five habit rows, each a `flex items-center gap-3` with a 1px `border-t border-border pt-4` (`gap-4` from the card's stack holds them apart): a box `size-6 shrink-0 rounded-sm border border-border` that, for the three done habits (the first three in the sample's order), is `bg-secondary` with a `Check` icon (`text-secondary-foreground`) inside; then the habit's name in `text-body`; then at the right end (`ml-auto`) a small figure, "Done" or "To do". The rows are not cards and have no fill.

The `<figcaption>` under the card is a label in `text-muted-foreground`, `md:text-center`, so it is centered under the card from `md` up and left-aligned below: "What your mornings look like in Mossy".

### 4. What it does

A section with an `<h2>` "What Mossy does for you", then a row of three cards: a grid from the layout notes with `gap-6`, each card `md:col-span-4`. Each card, in its `gap-4`:

1. An icon, `size-6`, in `text-foreground`: `ListChecks`, `Bell`, `Flame`.
2. An `<h3>` in `text-h2`: "Tick off your day", "A nudge at the right time", "See your streak grow".
3. One or two sentences in `text-body`. For example: "Pick up to five habits. Each one is a single tap when it is done." / "Choose when Mossy reminds you. It never sends more than two a day." / "Every day you finish everything adds one to your streak. Miss a day, and you start again, kindly."

### 5. What people say

A section with an `aria-label` "What people say" and no visible heading, holding only a `<blockquote>`, `md:max-w-3xl`, with `flex flex-col gap-4`:

- The quote as a `<p>` in `font-heading text-h1`, with no quotation marks. Here, instead of the notes' `max-w-lg`, it has no width of its own and fills the blockquote's `md:max-w-3xl`. One or two sentences, e.g. "I wanted to read more for years. Ten pages a day did it, and the streak kept me honest."
- A `<footer>` inside the `<blockquote>`, a row with `gap-3`: an avatar with the initials, then a `flex flex-col gap-2` holding the name in `text-body text-foreground` ("Marta Lindqvist") and a small figure ("Nurse, 41 days in a row").

### 6. Sign-up

A section with the `id` `signup` and `scroll-mt-10`, its `aria-labelledby` pointing at the `<h2>` below. It holds only a grid from the layout notes, so it is a plain `<section>` with no `flex flex-col gap-6` of its own. Its first item, `md:col-span-5`, is a `flex flex-col gap-4` with the `<h2>` "Start with one habit" and one paragraph: "You can add more habits later. Free stays free, for up to five."

Its second item, `md:col-span-7`, is a card that is the wrapper for the form and for the status element that replaces it. In place of the card's column stack, this card is a plain block, so the empty status element after the form adds no gap. The form has `noValidate` and `flex flex-col gap-6`, with:

- "Your first name": an `Input` (add it with `npx shadcn@latest add input`) with `autoComplete="given-name"`.
- "Email": an `Input` with `type="email"` and `autoComplete="email"`, with helper text `We send one email to confirm, and nothing else.`
- A `<select>` "Your first habit", full width: the five habits in the sample's order, then "I will choose later". "Drink 8 glasses of water", the first, is chosen at the start.
- The default `Button` with `type="submit"`, "Create my account", full width below `md` (`w-full md:w-auto md:self-start`).

The sign-up button is the second raspberry button on the page; it is far below the opening and never on screen with it.

### 7. Footer

The footer from the layout notes.

### Behavior

- "Start for free" keeps `href="#signup"`, so it works without code. Its `onClick` calls `event.preventDefault()`, then `scrollIntoView()` on the sign-up section (no smooth scrolling), then focuses the first name field with `focus({ preventScroll: true })`. Once the form has been replaced, it focuses the confirmation's `<h3>` instead.
- On submit, check the fields: the name must not be empty ("Add your first name so we know what to call you."), the email must be well formed, as the layout notes define it ("Check your email: it needs an @ and a domain, like ines@example.com."). Show each error under its field and move focus to the first field with an error.
- A good form is replaced in the card by the confirmation in the `role="status"` element: an `<h3>` in `text-h2` with `tabIndex={-1}` that gets focus, "You are in, Ines" (with the name they typed), and one sentence: "We sent a link to ines@example.com. Open it on your phone and your first habit is waiting." Use the address they typed. Then a good-news badge, "Day 1". The three sit in one `flex flex-col items-start gap-4` inside the status element, rendered only once the form is sent.
- "Sign in" and the footer need no behavior.
