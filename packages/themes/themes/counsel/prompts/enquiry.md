---
page: new enquiry page
title: Enquiry
description: a commercial law firm's page for a new enquiry, with its address, telephone and office hours, what happens next, and a form for who you are, what the matter concerns, a message and consent, checked in code and replaced by a confirmation.
order: 5
checks:
  - "Every field has a visible label; what the matter concerns is the theme's `Select` with the prompt `Choose an area` as its placeholder, and the consent is the theme's `Checkbox` with its label tied to it."
  - "No native `<select>` is on the page: the list opens under its trigger, as wide as it, in the card's grey with the fields' border and a hairline between rows; the chosen row has a check, and the arrow keys, Enter and Escape work in it."
  - "Sending the form empty shows a message in words with an icon under each required field and under the checkbox, sets `aria-invalid` on each, and moves focus to the first of them."
  - "A good enquiry is replaced by a confirmation in an element with the status role that was on the page from the start; the confirmation's heading takes focus, and it repeats the practice area and the email address as written."
  - "The address is in an `<address>` element with `not-italic`, and the office hours are a `<dl>` with each time in a `<time>` element."
  - "The page has exactly one badge, Free consultation, and nothing else is `bg-tertiary`; Send enquiry is the page's one default (navy) button, and nothing on the page is round, bold or italic."
---

Sample firm, if the user gave none: **Harrow & Vane LLP**, an invented commercial law firm in Wexcombe, an invented English city, founded in 1952, with 14 partners and 86 lawyers in five practice areas: Corporate, Commercial disputes, Employment, Real estate and Private client. Its one office is at 4 Chancery Row, Wexcombe WX1 2LN, on the second floor, with a lift. The main line is `01632 960 214` and the enquiries address enquiries@harrowvane.example. The office is open Monday to Friday 08:30–17:30 and closed at weekends. Every enquiry is checked for conflicts of interest before anyone replies; then a partner in the right team replies within one working day, and the first meeting, of up to an hour, is free. Every name is invented.

Build these parts in order.

### 1. Header

The header from the layout notes. "Contact" is the current page, in the header and in the footer.

### 2. Opening

The first section, in the grid:

- A label line in `text-muted-foreground`, columns 1–12 (`md:col-span-12`): `Enquiries · Wexcombe`.
- With `mt-4`, the `<h1>` in `text-h1 md:text-display`, columns 1–9 (`md:col-span-9`): "Tell us about your matter".
- With `mt-8`, a `<p>` in columns 1–7 (`md:col-start-1 md:col-span-7`, which overlap the `<h1>`'s, so it starts a row under it), at most `max-w-xl`, two sentences in `text-body`. Sample: "Give us the outline and the names of the other parties, and a partner in the right team will reply within one working day. Please send no documents yet: we check for conflicts of interest first."

### 3. Office and enquiry

A section in the grid with two parts.

**The office**, in columns 1–4 (`md:col-span-4`):

- A label heading "Address", an `<h2>`.
- With `mt-4`, an `<address>` with `not-italic` in `text-body`: `Harrow & Vane LLP`, `4 Chancery Row`, `Wexcombe WX1 2LN` and "Second floor, with a lift", each on its own line with `<br>`.
- With `mt-8`, a label heading "Telephone", an `<h2>`, and with `mt-4` a `<p>` in `text-body` holding `01632 960 214` as a `tel:01632960214` link, styled as a link in running text.
- With `mt-8`, a label heading "Hours", an `<h2>`.
- With `mt-4`, a `<dl>` as the layout notes describe it, with two rows: Monday to Friday, and Saturday and Sunday. Here, instead of the notes' three columns at every width, a row is `grid grid-cols-1 lg:grid-cols-3 lg:items-baseline lg:gap-x-4` and its `<dd>` is `mt-2 lg:col-span-2 lg:mt-0`: from `md` to `lg` this column is too narrow for a day and a span of hours side by side. The row keeps its `border-t border-border py-4`. The weekday `<dd>` has `font-mono tabular-nums` beside its `text-body`, so the dash between the times matches them, and holds two `<time>` elements (`<time dateTime="08:30">08:30</time>–<time dateTime="17:30">17:30</time>`); the weekend reads "Closed" in `text-body`.
- With `mt-8`, a label heading "What happens next", an `<h2>`.
- With `mt-4`, an `<ol>` as a list of entries (see the layout notes), three entries, each with `py-4` (here, instead of the notes' `py-8`). Each `<li>` is also `grid grid-cols-4 items-baseline gap-x-4`, which holds at 375px too: in column 1 the step's number, a `<span>` (it is a grid item, so it needs no `<p>`) styled as a label in `text-muted-foreground` with `tabular-nums`, `01`, `02`, `03`; in the other three a `<p>` with `col-span-3`, one sentence in `text-body`. Steps: we check the names you give for conflicts of interest; a partner in the right team replies within one working day; if we can help, the first meeting, of up to an hour, is free.

**The enquiry**, in columns 6–12 (`md:col-start-6 md:col-span-7`), with `mt-14 md:mt-0`: one wrapper holding the form and the empty `role="status"` element, as the layout notes describe (Forms and Confirmations). The form is `rounded-xl bg-card p-8` with `noValidate`:

- A row with `flex flex-wrap items-center gap-x-4 gap-y-2`: an `<h2>` in `text-h2`, "Send an enquiry", and beside it the page's one badge, "Free consultation". The badge sits on the card's pale grey, which is fine.
- With `mt-4`, one sentence in `text-body`: everything you send is read by a partner and kept confidential.
- With `mt-8`, the fields, `mt-8` apart, each in its own wrapper (`npx shadcn@latest add input textarea select checkbox`):
  - "Your name": an `Input`, `autoComplete="name"`.
  - "Organisation (optional)": an `Input`, `autoComplete="organization"`.
  - A row with the email and the telephone: a `<div>` with `md:grid md:grid-cols-2 md:gap-x-8`, which takes the `mt-8` between fields; inside it each field in its own wrapper, the email's with no margin, the telephone's with `mt-8 md:mt-0`. On a phone the two stack. "Email address": an `Input` of type `email`, `autoComplete="email"`. "Telephone (optional)": an `Input` of type `tel`, `autoComplete="tel"`.
  - "What does the matter concern?": a `Select` from the layout notes, with the placeholder `Choose an area` and the choices `Corporate`, `Commercial disputes`, `Employment`, `Real estate`, `Private client` and `Something else`.
  - "Other parties involved (optional)": an `Input`. Under its label, with `mt-2`, a helper line: a `<p>` in `font-mono text-label text-muted-foreground`, not uppercased, "Names of the other companies or people, so that we can check for conflicts.", with the `id` `parties-help`, which the field's `aria-describedby` names at all times. Here the field has `mt-2` under the helper line, in place of the Inputs note's `mt-2` under the label.
  - "Tell us about the matter": a `Textarea` with `min-h-48`. Under its label, with `mt-2`, a helper line as above with the `id` `message-help`: "A few sentences: what happened, what you would like, and any deadline you know of." The textarea has `mt-2` under it and names it in its `aria-describedby` at all times.
  - The consent: a wrapper holding the checkbox row from the layout notes, and under the row, with `mt-2`, its error line while there is one. The `<label>`: "I agree that Harrow & Vane may use these details to reply to my enquiry and to check for conflicts of interest." Under the wrapper, with `mt-4`, a `<p>` in `font-mono text-label text-muted-foreground`, not uppercased: "How we handle your details is set out in our privacy notice.", where "privacy notice" is a link to `#`, styled as a link in running text.
- With `mt-8`, the default button "Send enquiry", `type="submit"`. The page's only default button.

### 4. Footer

The footer from the layout notes.

### On a phone

The office's details come first and the form after them, at the full width, 56px under. The email and telephone fields stack. The form keeps its `p-8`. Inputs and the select take the full width of the form. The badge wraps under the form's heading if the line is too short. The send button and the "Send another enquiry" button are each `w-full md:w-auto`: full width on a phone, their own width from `md` up.

### Behavior

- **Sending:** check each field in code, in this order, and show one error per field, the first that applies, under that field. Empty name: "Write your name." Empty or malformed email (it must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`: no spaces, one `@`, and a dot after it with text on both sides): "Write an email address such as name@example.com." A telephone that is not empty but holds anything other than digits, spaces and one leading `+`, or fewer than ten digits: "Write a telephone number such as 01632 960 214, or leave it empty." No area chosen: "Choose what the matter concerns." A message that is empty or under 20 characters once trimmed: "Tell us about the matter in a sentence or two." The box not ticked: "Tick the box so that we may reply to you." The organisation and the other parties are not checked. A field with a helper line names both lines in its `aria-describedby` while it has an error: the helper's `id` first, then the error's.
- **Focus:** focus moves to the first field with an error, after the error lines are rendered, as the Errors note says. For the area, focus goes to the `SelectTrigger`, which holds the ref. For the consent, focus goes to the visible checkbox: hold a ref on the `Checkbox` and call `focus()` on it. The `Checkbox` gets `aria-invalid` and names its error line in `aria-describedby` while the error shows; ticking it removes both.
- **Confirmation:** when all is good, the form is replaced by the message in the status element, drawn as the Confirmations note says: an `<h2>` in `text-h2`, "Thank you. We have your enquiry", with `tabIndex={-1}` and focus moved to it; then with `mt-4` a sentence in `text-body` with `wrap-anywhere` (the form sits in grid columns, and a long address must not widen them) that repeats the area as chosen and the email address as written: "A partner in Commercial disputes will reply to ruth@example.com within one working day." For `Something else` it reads "A partner will reply to … within one working day." Then with `mt-4` a label line in `text-muted-foreground`: `Reference · HV-2611-0418`, a fixed sample reference. After the status element, in the same wrapper and only while the message shows, a `secondary` button with `mt-8`, "Send another enquiry", which empties the status element, brings back the empty form with no errors and no area chosen, and moves focus to the name field.
- Nothing is sent anywhere: the confirmation is shown in the page.
