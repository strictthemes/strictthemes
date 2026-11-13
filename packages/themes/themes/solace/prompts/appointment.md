---
page: first session request page
title: Appointment
description: a therapist's page for requesting a first session, with a note that the practice is not an emergency service, a form for a name, an email address, an optional phone number, how to be contacted, in person or online, the times that suit, an optional message and consent, checked in code and replaced by a confirmation, with what happens next and a few lines on confidentiality beside it.
order: 5
checks:
  - "Every field has a visible label; how to reply and in person or online are fieldsets holding the theme's `RadioGroup`, with round radios, the times are a fieldset of three checkboxes, and the consent is a checkbox whose label is tied to it."
  - "Sending the form empty shows an error line with an icon under the name, the email address, both radio groups, the times and the consent, each saying how to put it right, and moves focus to the name field."
  - "Choosing By phone and leaving the phone number empty gives the phone field an error that says to write a number or to choose By email."
  - "A good request is replaced, inside the same card, by a confirmation in an element with the status role that was there from the start; its heading takes focus, and it says where the reply goes and that it comes within two working days."
  - "The note that this is not an emergency service stands above the form, says to call your local emergency number or go to the nearest emergency department, and holds no phone number and no organisation's name."
  - "No control is drawn by the browser: the page has no native radio, checkbox or select, the arrow keys move the choice inside each radio group, a chosen radio is filled with a dot in its middle, and the message field has no resize grip."
  - "Send my request is the page's one default (indigo) button, the only round things are the radio buttons, and no text is italic or heavier than weight 500."
---

Sample content, if the user gave none: a request for a first session with **Nora Ellingham**, an invented registered psychotherapist who works alone, with adults, in a garden room in Larkmere, an invented town, and online by video. She reads every request herself and replies within two working days, by email from `hello@ellingham.example` or by phone if asked. Then comes a free call of 20 minutes, and after it, if both wish, a first session of 50 minutes at £68. Sessions are held on Tuesday 09:00–17:00, Wednesday 12:00–20:00, Thursday 09:00–17:00 and Friday 09:00–13:00, as in the layout notes. The practice is not an emergency service. The copy below is given word for word: use it as it is, error and confirmation messages included.

Build these parts in order.

### 1. Header

The header from the layout notes. "First session" is the current page, in the header and in the footer.

### 2. Opening

The first section, in the grid, with its `aria-labelledby` naming the `<h1>`:

- A label line in `text-muted-foreground`, columns 1–12 (`md:col-span-12`): `First step · A call of 20 minutes · Free`.
- With `mt-4`, the `<h1>` in `text-h1 md:text-display`, columns 1–9 (`md:col-span-9`): "Request a first session".
- With `mt-7`, a `<p>` in columns 1–7 (`md:col-start-1 md:col-span-7`, which overlap the `<h1>`'s, so it starts a row under it), at most `max-w-xl`, in `text-body`: "Fill in what you can. I read every request myself, and I reply within two working days."

### 3. Your request

A section in the grid, with the `aria-label` "Your request" (here, in place of `aria-labelledby`, because the form's heading leaves the page with the form), and two parts.

**The request**, in columns 1–7 (`md:col-span-7`), holding the note and, under it, the form.

The note about emergencies comes first: a card from the layout notes, a `<div>` with `role="note"` and `aria-labelledby` naming its heading. It holds no icon, no link and no phone number.

- An `<h2>`: "This is not an emergency service".
- With `mt-4`, a `<p>` in `text-body`, at most `max-w-xl`: "I read requests on working days, and it can take me two days to reply. If you are in immediate danger, or you think you might harm yourself or someone else, please do not wait for me. Call your local emergency number or go to the nearest emergency department."

With `mt-7`, the form's card, as the Forms note describes it: a card holding the `<form>` and, after it, the empty `role="status"` element. Add the fields with `npx shadcn@latest add input textarea checkbox radio-group`. In the `<form>`, in this order:

- An `<h2>` with an `id`: "Your request".
- With `mt-4`, a `<p>` in `text-body`: "Your name, an email address and the choices below are needed. The rest is up to you."
- The fields, each in its own wrapper with `mt-7`:
  1. **Name:** the label "Your name", the helper line "A first name is enough.", an `Input` with `autoComplete="name"`.
  2. **Email:** the label "Email address", an `Input` of type `email` with `autoComplete="email"`.
  3. **Phone:** the label "Phone number (optional)", the helper line "Only needed if you would like me to call.", an `Input` of type `tel` with `autoComplete="tel"`.
  4. **How to reply:** a group of choices with the `<legend>` "How should I reply?" and the helper line "If I call and you cannot answer, I leave no message." A `RadioGroup` with the `name` `reply` and two radios: "By email" and "By phone".
  5. **Where:** a group of choices with the `<legend>` "In person or online?" A `RadioGroup` with the `name` `place` and three radios: "In person, in Larkmere", "Online, by video" and "Either is fine".
  6. **Times:** a group of choices with the `<legend>` "Which times could suit you?" and the helper line "Tick all that could work." Its `<legend>` needs no `id`: no `RadioGroup` names it, and the fieldset takes its name from it. Three checkboxes, each in a row of a group: "Mornings, 09:00 to 12:00", "Afternoons, 12:00 to 17:00" and "Wednesday evenings, 17:00 to 20:00".
  7. **Message:** the label "What brings you here? (optional)", the helper line "A sentence is enough. You can also leave this empty and tell me when we speak.", a `Textarea` with `maxLength={1000}`.
  8. **Consent:** a wrapper holding one checkbox row whose label is a sentence, as the Checkboxes note gives it, and under the row its error line while there is one. The `<label>`: "I agree that Nora Ellingham may keep these details to reply to my request."
- With `mt-7`, the default button "Send my request", `type="submit"`. The page's one default button.
- With `mt-4`, a caption from the layout notes, a `<p>`: "Nothing is booked or charged when you send this."

**Beside it**, in columns 9–12 (`md:col-start-9 md:col-span-4`), with `mt-12 md:mt-0`: a `<div>` with no card, holding two parts.

- An `<h2>`: "What happens next".
- With `mt-4`, an `<ol>` as a list with hairlines (see the layout notes), three entries. Each `<li>` holds a label line in `text-muted-foreground` and, with `mt-2`, a `<p>` in `text-body`:
  1. `Within 2 working days`: "I reply, by email or by phone, as you chose."
  2. `20 minutes · Free`: "We speak, by phone or video. You can ask me anything."
  3. `50 minutes · £68`: "If we both wish, we arrange a first session."
- With `mt-12`, an `<h2>`: "Confidentiality".
- With `mt-4`, three paragraphs in `text-body`, the second and third with `mt-4`: "What you write here comes only to me. Nobody else reads it."; "I use it to reply to you, and for nothing else. I send no newsletters."; "If we do not go on to work together, I delete your details within 30 days."

### 4. Footer

The footer from the layout notes.

### On a phone

Every part is one column, in this order: the opening, the note about emergencies, the form, what happens next, confidentiality. The cards keep their 28px padding, and the fields take the full width inside the form's card. Each radio and each checkbox of a group stands in a row at least 44px tall. The send button is full width. What happens next starts 48px under the form's card.

### Behavior

- Keep every value in component state: the name, the email address, the phone number, how to reply (none, email or phone), the place (none, in person, online or either), the three times, the message and the consent.
- **Sending:** check the form in code, in this order, and show one error per field or group, the first that applies, as the Errors note says:
  - Name, empty or only spaces: "Write your name. A first name is enough."
  - Email address, empty: "Write your email address, so that I can reply." Malformed: "Check the email address. It needs an @ and a domain, like name@example.com."
  - Phone number, empty while By phone is chosen: "Write a phone number, or choose By email below." Not empty, but once its spaces are taken out it is not 10 to 15 digits with at most one `+` in front: "Check the phone number. It needs 10 to 15 digits. You can also leave it empty."
  - How to reply, none chosen: "Choose email or phone."
  - In person or online, none chosen: "Choose one of the three. Either is fine."
  - Times, none ticked: "Tick at least one time. You can tick them all."
  - Consent, not ticked: "Tick the box, so that I may keep your details and reply."
  - The message is never checked.
- **Focus:** focus moves to the first field with an error. For a group of radios that is its first radio; for the times, the first checkbox; for the consent, its checkbox. To focus a `Checkbox` or a `RadioGroupItem`, hold a ref on it and call `focus()`. The consent's `Checkbox` gets `aria-invalid` and names its error line in `aria-describedby` while the error shows.
- **Errors going away:** as the Errors note says, and one more: the phone number's error about a missing number also goes when By email is chosen.
- **Confirmation:** when all is good, the form is replaced by the message in the status element, as the Confirmations note says. The `<h2>`, with `tabIndex={-1}` and focus moved to it: "Thank you, Sam. Your request is with me.", with the name as typed, trimmed. Then three paragraphs:
  - Where the reply goes. By email: "I will write to sam@example.com within two working days." By phone: "I will call 01632 960 417 within two working days. If I do not reach you, I will write to sam@example.com." The address and the number are the ones typed, trimmed; the two here are samples.
  - "I will offer you one or two times for a call of 20 minutes. It is free, and nothing is booked until we have spoken."
  - "You do not need to do anything else for now."

  After the status element, in the same card and only while the message shows, with `mt-7`, a `<p>` holding one link in running text: "Read how sessions work", to `/approach`. No button follows, and the form does not come back.
- The note about emergencies and the part beside the form stay as they are. Nothing is sent anywhere: the confirmation is shown in the page.
