---
page: membership form
title: Membership
description: a page to join a sports club, with three kinds of membership to choose from as radio cards, a form for the new member's details, an emergency contact and consent that is checked in code, and a confirmation that replaces the form.
order: 4
checks:
  - "The three memberships are native radios that share a name, each in a card that is a `<label>`, with Playing chosen at the start; the chosen card is marked by its radio and a darker border, never by amber."
  - "Every field has a visible label tied to it; sending the form with empty or wrong fields shows an error in words with an icon under each, tied with `aria-describedby`, and moves focus to the first field with an error."
  - "A date of birth under 18 with Playing chosen, or 18 or over with Junior chosen, gets its own error, worked out against 8 June 2027 and not the device clock."
  - "After Join the club the form is replaced by a confirmation with the number `WFC-27-0141` in a `role=status` element that was on the page from the start, and focus moves to its heading."
  - "Join the club in the form is the page's only amber button, and the radios and the checkbox show a navy mark in light mode and an ice blue one in dark mode."
---

Sample content, if the user gave none: "Wendmoor Football Club", which has 140 members and takes new ones all season. Three kinds of membership for the 2027 season, which ends on 31 July: Playing at £95, for adults aged 18 or over; Junior at £45, for players under 18; Social at £30, for everyone else. Adults train on Mondays and Thursdays at 19:00, juniors on Thursdays at 17:30, all at Millrace Park. Today is Tuesday 8 June 2027, so the first session for a new player is Thursday 10 June, and the next home match is against Stenwick Albion on Saturday 19 June at 15:00. A new member gets the number `WFC-27-0141`.

This page uses the stock `button` and `input`; add any the project lacks with `npx shadcn@latest add button input`. It has a date field, so set `color-scheme` as the rules say; the native radios and the checkbox follow it too.

Build these parts in order. The container inside `<main>` has one item: a `<div>` with `flex flex-col gap-8` that holds the page head and, after it, one plain `<div>` with no classes. That plain `<div>` holds the `<form>` of part 3 and, after the form, the confirmation element of part 4, on the page from the start and empty.

### 1. Header

The header from the layout notes. The current page is Membership.

### 2. Page head

The label `2027 SEASON · 140 MEMBERS`, then the `<h1>` "Join the club", then the sentence "Choose a membership, tell us who you are, and come to your first session. It takes two minutes." There is no action on the right: the form's button is the page's amber one.

### 3. The form

A `<form>` with `noValidate`, the `aria-label` "Join the club" and `flex flex-col gap-8`. It has two items: the memberships, then a grid row.

**Memberships.** A `<div>` with `role="radiogroup"`, named by its heading with `aria-labelledby`, and `flex flex-col gap-5`: an `<h2>` "Choose a membership", then a grid row of three radio cards, four columns each from `lg` up.

A radio card is a `<label>` with `flex cursor-pointer flex-col gap-3 rounded-xl border border-border bg-card p-5 has-checked:border-foreground`: a card of its own on the page, whose border turns to the text color while its radio is checked. A `<label>` may hold only inline elements, so every part of it is a `<span>`:

- A first line, `flex items-center gap-3`: the radio, with the `name` "membership", then the membership's name in `font-heading text-h2 uppercase`.
- The price, `flex flex-col gap-1`: a figure in `text-h1`, then the label `A SEASON`.
- Who it is for, one sentence, `block text-body`.
- What it includes, `flex flex-col gap-2`: three lines, each `flex items-start gap-2 text-body` with the `Check` icon and a phrase.

The radio gets `aria-labelledby` naming the `<span>` with the membership's name and `aria-describedby` naming a `<span>` that wraps the other three parts (`flex flex-col gap-3`). The three cards:

- "Playing", `£95`, chosen at the start: "For adults aged 18 or over who want to play." It includes "Training on Mondays and Thursdays at 19:00", "A place in the first team or reserves squad" and "Match kit and insurance for the season".
- "Junior", `£45`: "For players under 18." It includes "Coaching on Thursdays at 17:30", "Matches with the under 18s on Sundays" and "Match kit and insurance for the season".
- "Social", `£30`: "For supporters, parents and former players." It includes "Free entry to home league matches", "A vote at the annual meeting" and "The club newsletter each month".

**The grid row** has two items.

**Your details,** eight columns from `lg` up: a card with the `<h2>` "Your details" and three more items.

First, a grid of fields, `grid grid-cols-1 gap-5 md:grid-cols-2`, in this order; a field marked "both" spans both columns (`md:col-span-2`):

1. "Full name", an `Input` with `autoComplete="name"`, both.
2. "Email", `type="email"`, `autoComplete="email"`.
3. "Date of birth", `type="date"`, `autoComplete="bday"`, with the helper text "Playing members are 18 or over. Juniors are under 18."
4. "Emergency contact", `autoComplete="off"`, with the helper text "Someone we can call on a match day. For a junior, a parent or guardian."
5. "Emergency contact's phone", `type="tel"`, `autoComplete="off"`.

Every field starts empty.

Second, the consent: a stack with `gap-2` holding a checkbox row as the Radios and checkboxes note sets it, with the sentence "I agree to the club's code of conduct, and to the club keeping these details for the 2027 season.", and its error line when there is one. The checkbox starts clear.

Third, a row with `flex flex-wrap items-center gap-3 border-t border-border pt-5`: the default (amber) button "Join the club" with `type="submit"`, and one line of small print: "You pay at your first session. Nothing is charged here."

**What happens next,** four columns from `lg` up: an ice panel, an `<aside>` named by its `<h2>` "What happens next" in `text-h2`. Then an `<ol>` with `role="list"` and `flex flex-col gap-3` of three steps, each `flex items-baseline gap-3`: its number, `1` to `3`, a figure in `text-h2` with `w-5 shrink-0`, and a sentence in `text-body`:

1. "We email your membership number and a welcome from the club."
2. "You come to your first session at Millrace Park and pay the season's fee there."
3. "Players are registered with the league within a week, and can then be picked."

Then a `<p>` in `text-body`: "Questions? Call the club secretary, Marian Osei, on 01632 960 277." The number is plain text, not a link: nothing on an ice panel takes focus, and nothing on it has a text color class.

### 4. The confirmation

Rendered inside the confirmation element only after a good submit, when the `<form>` is gone: a card, with nothing above it in the plain `<div>`. In it:

- An `<h2>` "Welcome to Wendmoor FC", with `tabIndex={-1}` and the `focus:` outline from the rules.
- A `<p>` in `text-body`: "Thank you, Priya. Your Playing membership for the 2027 season is ready.", with the first word of the name as typed and the membership as chosen.
- A `<dl>` as the Description lists note sets it on a card, `w-full max-w-md`, with four rows: "Membership number", `WFC-27-0141`; "Membership", the kind chosen; "Fee for the season", `£95`, `£45` or `£30`; and the last row by the kind: for Playing, "First session", "Thursday 10 June, 19:00"; for Junior, "First session", "Thursday 10 June, 17:30"; for Social, "Next home match", "Saturday 19 June, 15:00".
- A `<p>` in `text-body`: "We have sent the details to" with the email address as typed, then a full stop. Then a second sentence: "This is a demo: nothing was sent or stored."
- A link styled as a `secondary` button, "See the fixtures", to `/fixtures`, at its own width (`self-start`).

### Behavior

- Choosing a radio card changes the membership; the arrow keys move between the three, as native radios do. Focus stays on the radio.
- "Join the club" checks every field in code, in the order below, and moves focus to the first one with an error once the error lines are rendered. Each error, with its text:
  - Full name empty: "Enter your full name."
  - Email empty: "Enter your email address." Anything that does not match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`: "Enter an email address such as name@example.com."
  - Date of birth empty: "Enter your date of birth." Later than 8 June 2027, or earlier than 1 January 1927: "Enter a date of birth from 1927 to today." With Playing chosen and a birthday after 8 June 2009, so under 18 today: "Playing membership is for adults. Choose Junior membership, or check the date." With Junior chosen and a birthday on or before 8 June 2009: "Junior membership is for under 18s. Choose Playing or Social membership, or check the date." Social takes any age.
  - Emergency contact empty: "Enter the name of someone we can call."
  - Emergency contact's phone: with spaces removed, anything but 10 to 15 digits with an optional `+` in front: "Enter a phone number of 10 to 15 digits."
  - Consent not ticked: "Tick the box to agree to the code of conduct." The checkbox gets `aria-invalid` and names the line, and focus can move to it like any field.
- The error under the date of birth is also removed when the membership changes, since it may no longer hold.
- With no errors, the form is removed with its cards and its panel, the confirmation fills the status element, and focus moves to its `<h2>`, so that the message is not read twice.
- The links need no behavior beyond their `href`.
