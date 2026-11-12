---
page: confirmation page
title: Confirmation
description: the page a person sees after sending a public-service application, with a reference number they can copy, what happens next with dates, how to get help and a link to give feedback.
order: 4
checks:
  - The reference number is set in the mono font, can be selected as text, and the "Copy reference number" button copies it and announces that it did, through a status element that was on the page from the start.
  - The success is stated in words in the `<h1>`, with the check icon beside it; it is not shown by the green color alone.
  - What happens next is an ordered list (`<ol>`) of three steps, and each step's date is a `<time>` element with a `dateTime`.
  - The phone number is a `tel:` link and the email address a `mailto:` link, and the feedback link says what it is for in its own words.
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      First run of this page, on briefs revised after another page of the theme was built. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 1,302 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems the earlier test builds reported. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 1,285 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 1,320 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: "Callowmere Council", an invented town council, and its service "Apply for a resident's parking permit". Priya Okafor of 14 Wharf Row, Callowmere CM4 7QJ, sent her application on 11 November 2026 for a first permit in zone B for her petrol Velmar Arden, registration KX19 TDV, to start on 1 December 2026. Her reference number is `CPP-2611-4827`. A copy went to priya.okafor@mail.example. The permit costs £96 for 12 months, paid after approval. Help: 01632 960 418, Monday to Friday, 9am to 5pm, or permits@callowmere.example. Write the rest of the copy yourself, plain and short.

Build these parts in order.

### 1. Header

The header from the layout notes: "Callowmere Council" and "Apply for a resident's parking permit". This page has no Back link: the application has been sent.

### 2. Application sent

The first element of `<main>`: a box. Inside it:

- A row `flex items-start gap-4`: the `CircleCheck` icon in `text-success`, `mt-1 size-8 shrink-0` (here `size-8` in place of the Icons note's `size-5`, to match the heading) and `aria-hidden="true"`, and the `<h1>` "Application sent". The word in the heading says it; the green icon only repeats it.
- With `mt-6`, as the first text under the `<h1>`, one paragraph: a copy of the application has been sent to the email address, which is in `break-words` so it can wrap on a phone.
- With `mt-6`, the label "Your reference number" as a `<p>` in `font-mono text-label text-muted-foreground`.
- With `mt-2`, the number as a `<p>` in `font-mono text-h2 font-bold tabular-nums whitespace-nowrap text-foreground` (`whitespace-nowrap`, because a line could otherwise break at a hyphen; it fits at 375px), here in `text-h2` in place of the label size the Labels note gives a reference number, with no `aria-labelledby`, which a `<p>` may not have: the label is read just before it. It is plain text that can be selected; no input, no letter spacing of your own.
- With `mt-4`, a wrapper `<div>` holding a `secondary` `Button` "Copy reference number" with the `Copy` icon before the words, and after the button, in the same wrapper, the status element from the layout notes, whose message is a `<p>` with `mt-2`.
- With `mt-4`, one sentence: keep the number, and quote it if you contact the council.

### 3. What happens next

An `<h2>` "What happens next", then with `mt-4` one sentence saying the council will email at each step. Then with `mt-6` an `<ol>` with `list-decimal pl-6 marker:font-bold` of three steps, each `<li>` with `mt-6` except the first. Each step holds:

- Its title as an `<h3>` in `text-body font-bold`.
- With `mt-1`, its date as a label: a `<p>` in `font-mono text-label text-muted-foreground` holding the word "By" (the third step: "On") and then a `<time>` with a `dateTime` that holds only the date: "By 18 November 2026".
- With `mt-2`, one or two sentences.

The three steps:

1. "We check your application", by 18 November 2026: the council checks the address and the vehicle record, and may email to ask for more proof of address.
2. "You pay for the permit", by 25 November 2026: once it is approved, an email brings a link to pay £96. The link works for 7 days.
3. "Your permit starts", on 1 December 2026: the permit is linked to KX19 TDV, so there is nothing to display. It runs to 30 November 2027, and a reminder comes 4 weeks before it ends.

Then with `mt-6` one paragraph: if the application is turned down, the email says why and how to ask for the decision to be looked at again.

### 4. If you need help

An `<h2>` "If you need help", then with `mt-4` a paragraph holding the phone number as a `tel:` text link with `font-bold`, and the opening hours. With `mt-4`, a paragraph holding the email address as a `mailto:` text link with `break-words`, and a sentence that answers come within 2 working days. With `mt-4`, one sentence: have your reference number ready.

### 5. Feedback

A new part of the page: a `<section>` with `mt-16 border-t border-border pt-6`, opening with an `<h2>` "Tell us how this went" with no top margin. With `mt-4`, one sentence: it takes about a minute, and the answers are used to make the service easier. With `mt-4`, a `<p>` holding the text link "Give feedback on the parking permit service", which goes to `#`.

### 6. Footer

The footer from the layout notes.

### Behavior

- "Copy reference number" writes `CPP-2611-4827` to the clipboard with `await navigator.clipboard.writeText(…)` inside a `try`/`catch`. When it works, the status message reads "Reference number copied". When it fails, it reads "Copying did not work. Select the number and copy it yourself." It fails where `navigator.clipboard` is undefined (a page not on a secure address), where the call throws and where its promise rejects; the `try`/`catch` around the awaited call catches all three, where a `.catch()` alone would miss the first. Each click empties the status element first and sets the message 100 milliseconds later with `setTimeout`, clearing a timer still waiting from an earlier click, so that a second click is announced again. The message stays until the next click. The button keeps its words and is never disabled; focus stays on it.
- The other links go to `#`.
- On a phone the reference number stays on one line, and the button fills the column.
