---
page: membership page
title: Membership
description: the membership page of an independent cinema, with three plans, a monthly and yearly switch, and a sign-up form that checks its fields and confirms the sign-up without taking a payment.
order: 4
checks:
  - Switching between monthly and yearly changes every plan's price and its billing note, the form's summary line follows, and the chosen button has `aria-pressed="true"`.
  - Exactly one plan, Regular, has the "Recommended" badge, which is the page's only badge; the plans are not enlarged, lifted or tinted.
  - The page has one default (gold) button, "Join the Vesper", and asks for no card or bank details.
  - An empty name, or an empty or malformed email address, shows a sentence with an icon under the field, sets `aria-invalid` and moves focus to the first field with an error.
  - A good sign-up replaces the form with a confirmation in a `role="status"` element that names the plan, the price and the start date, and says no payment was taken.
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Second run of this page. The first runs showed that a poster in a row needs `self-start` to keep its proportions, which the theme's shared notes now say. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,051 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Second run on the prompt as revised after the problems the earlier test builds reported: after the first run on that text, the brief now says that the title breaks onto three lines, as it does. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,056 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,060 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: **The Vesper**, an independent cinema with three screens and a late bar at 21 Tallow Row, Oldmere. Three plans: **Friend** (£6 a month, or £60 a year): 10% off every ticket, members' screenings once a month, the printed programme by post. **Regular** (£12 a month, or £120 a year), the recommended one: two free tickets a month, 20% off every other ticket, priority booking for seasons and premieres, 10% off at the bar. **Patron** (£25 a month, or £250 a year): everything in Regular, four free tickets a month, a named seat in Screen 2, and an invitation to the season launches. A yearly plan costs ten months. Membership starts on the day of sign-up, Wednesday 11 November 2026.

Build these parts in order.

### 1. Header

The header from the layout notes. "Membership" is the current page.

### 2. Introduction

The first `<section>`: a label "Membership"; with `mt-2`, the `<h1>` "Become a member of the Vesper" in `text-h1 md:text-display`, inside a `<div>` with `max-w-4xl`, so that it breaks onto three short lines from `md` up; with `mt-6`, one paragraph within `max-w-xl` on what membership pays for (the late shows, the 35mm projector, the seasons).

### 3. Plans

The second `<section>`, with `mt-24`. An `<h2>` "Plans" in `text-h2 md:text-h1`.

With `mt-6`, a row `flex flex-wrap items-center gap-4`: a button group with the `aria-label` "Billing period" holding "Monthly" and "Yearly", then a label in `text-muted-foreground`: `Yearly · two months free`. "Monthly" is chosen at first.

With `mt-6`, the three plans as cards from the layout notes, in a grid `grid grid-cols-1 gap-6 md:grid-cols-3`. Each card is an `<article>` holding, in order:

1. The plan's name as an `<h3>` in `text-h2`. On Regular, the badge "Recommended" (add the component with `npx shadcn@latest add badge`) stands on the same line, after the name: the `<h3>` and the badge sit in a row `flex flex-wrap items-center gap-2`, so the three names stay level and no card needs a spacer.
2. With `mt-4`, the price as a `<p>` in `font-heading text-h1 tabular-nums`, e.g. `£12`, followed in the same `<p>` by a `<span>` label in `text-muted-foreground`, `/ month` or `/ year`, with `ml-2`.
3. With `mt-2`, the billing note, a label in `text-muted-foreground`: `Billed monthly · cancel any time`, or for yearly `Billed yearly · £10 a month`, with the plan's own per-month figure to the penny (`£5 a month`, `£10 a month`, `£20.83 a month`).
4. With `mt-4`, one sentence on who the plan is for.
5. With `mt-6`, a `<ul>` of what the plan includes, in words, `list-disc pl-4`, with `mt-2` on every item but the first.
6. The plan's button, full width (`w-full`), in a `<div>` with `mt-auto pt-6`: "Choose Friend", "Choose Regular", "Choose Patron". Add `whitespace-normal text-center`: at 768px a card is about 174px wide inside, so a label may need two lines, and the stock button does not wrap. Regular's is `variant="secondary"`; the other two are `variant="outline"`. None is gold: the gold action on this page is the form's.

Each card is `flex flex-col`, so the button's `mt-auto` takes up the spare height and the three buttons line up at the bottom of the cards from `md` up, where the grid makes the cards one height. Do not enlarge, lift or tint the recommended plan.

Below `md` the cards stack in the order Friend, Regular, Patron.

### 4. Sign-up

The third `<section>`, with `mt-24` and the `id` "join". A grid (`md:grid-cols-12`):

- Columns 1–5: an `<h2>` "Join" in `text-h2 md:text-h1`, then with `mt-4` two sentences: "Your membership starts today, Wednesday 11 November 2026. You can cancel it at any time from your account page." With `mt-4`, a `<p>` in `text-body text-muted-foreground`: "This is a demo. No card details are asked for and nothing is charged."
- Columns 7–12, with `mt-12 md:mt-0`: a wrapper holding the form and the status element from the layout notes.

The form, with `noValidate`:

1. "Full name", an `Input` with `autoComplete="name"` (add the component with `npx shadcn@latest add input`).
2. With `mt-6`, "Email address", an `Input` with `type="email"` and `autoComplete="email"`, and helper text: "We send your membership card here."
3. With `mt-6`, "Plan", a native `<select>` with Friend, Regular and Patron. Regular is chosen at first.
4. With `mt-6`, a summary line, a `<p>` with `aria-live="polite"` in `text-body`, built from the plan and the billing period: "Regular, billed monthly: £12 a month, starting Wednesday 11 November 2026." or "Regular, billed yearly: £120 a year, starting Wednesday 11 November 2026."
5. With `mt-6`, the default `Button` "Join the Vesper", with `type="submit"`. It is the page's one gold action.

### 5. Footer

The footer from the layout notes.

### Behavior

- The billing period and the chosen plan are component state. The prices, the billing notes, the `/ month` or `/ year` labels and the summary line all read from them, and the `<select>` and the "Choose" buttons both set the plan.
- A "Choose" button sets the plan and moves focus to the "Full name" field, which scrolls the form into view. It does not submit anything. Once the confirmation is shown, the form does not come back: a "Choose" button then only moves focus to the confirmation's `<h3>`, and the confirmation keeps the plan, period and price that were sent, whatever is switched after.
- When the form is sent, check it in code: the name must not be empty ("Enter your full name."), and the email must not be empty and must look like an address, with one `@` and a dot after it ("Enter an email address such as name@example.com."). Show every error at once, and move focus to the first field with an error.
- A good form is replaced by the confirmation. Its `<h3>`: "Welcome to the Vesper, Mara", with the first word of the name the person typed and no full stop. Under it, with `mt-4`, these sentences: "Your Regular membership, billed monthly at £12 a month, starts on Wednesday 11 November 2026." (yearly: "billed yearly at £120") "Your card will reach you by email. This was a demo: no payment was taken." After the status element, in the shared wrapper as the layout notes say, a text link "See what's on" to `/`.
- No payment form, no card field, no price is charged anywhere on the page.
