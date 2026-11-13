---
page: wedding reply form
title: Reply
description: the reply form for a summer wedding, with who is replying, a choice of coming or not, the number of guests, a dinner choice and a note, checked in code, with a summary of the day beside it and a confirmation that replaces the form.
order: 2
checks:
  - "Coming or not is a button group with aria-pressed and a visible label, and choosing Sorry, I cannot come takes the number of guests and the dinner out of the form."
  - "The number of guests is set with minus and plus buttons from 1 to 4, each with an aria-label, and the value is announced with its unit, 1 guest or 2 guests."
  - "The dinner is the theme's Select, with no native select on the page: its trigger reads Choose a dinner until one is chosen, its list opens under it in the theme's colors, the chosen row has a check, and the arrow keys, Enter and Escape work in it."
  - "The dinner only gets an error when the guest is coming."
  - "Sending the empty form gives the name, the email and the choice of coming each their own error line with an icon, tied to its field, and focus moves to the name field."
  - "A good reply replaces the form, inside the same card, with a confirmation that repeats the name and the number of guests, a screen reader announces it, and focus moves to its heading."
  - "The opening block element carries bg-mist text-mist-foreground, so its text stays plum ink in dark mode, and nothing inside it has a text color class of its own."
---

Sample content, if the user gave none: replies to the wedding of Clem Ashdown and Rafe Linnell on Saturday 17 July 2027 at Quillbrook Barn, Little Saltry. Guests arrive from 13:30; the ceremony is at 14:00. Replies by Friday 30 April 2027. One reply covers up to 4 people named on an invitation. Four dinners: Roast chicken with tarragon, Wild mushroom pie (vegetarian), Summer vegetable tart (vegan), Children's plate (under 12). Clem's sister, Bea Ashdown, keeps the list: phone 01632 960 573, email hello@clemandrafe.example.

Build these parts in order.

### 1. Header

The header from the layout notes, with "Reply" as the current page; its link keeps `/rsvp`.

### 2. Opening

A full-width section that is a pastel block in mist, as the layout notes describe it, with its `aria-labelledby` pointing at the `<h1>`. The `<section>` is the block element, and it carries `bg-mist text-mist-foreground`, the pair from the first layout note, so its text stays plum in dark mode; nothing inside it gets a text color class of its own. It holds one `flex flex-col gap-3`: a `flex flex-col gap-2` with a label, `Reply by Friday 30 April 2027` (the date a `<time dateTime="2027-04-30">`), and the `<h1>` "Will you come?" in `text-h1 md:text-display`; then one paragraph in `text-body` with `max-w-xl`: "Tell us who is coming and what you would like for dinner. It takes a minute, and it helps us plan the tables and the minibuses."

### 3. Your reply and the day in short

A section of parts side by side, from the layout notes, with its `aria-labelledby` pointing at the `<h2>` "Your reply".

**First part,** `md:col-span-7`: a `flex flex-col gap-6` with the `<h2>` "Your reply" and the form card, as the Forms note describes it. Add the fields with `npx shadcn@latest add input textarea` if the project has none, and give the new files the edits the Added components note lists. This page uses the `outline` variant and `focusableWhenDisabled`, so it makes both of those edits in `button.tsx`, as well as the `secondary` one. The `<form>` has the `aria-label` "Your reply". Its fields, in this order, each in its own `flex flex-col gap-2`:

1. **Name**: the label "Your name", an `Input` with `autoComplete="name"`, and the helper text `As it is on your invitation`.
2. **Email**: the label "Email address", an `Input` of type `email` with `autoComplete="email"`, and the helper text `We send a copy of your reply here.` Where an error shows, it comes after the helper text, and the field's `aria-describedby` names both.
3. **Coming or not**: a label as a `<p>` with an `id`, in `font-mono text-label text-foreground`, "Are you coming?" (a `<label>` needs a field to point at; this one names the group), then a button group from the layout notes, `aria-labelledby` pointing at that `<p>`, with two buttons: "Yes, I will be there" and "Sorry, I cannot come". Neither is chosen when the page opens: both start with `aria-pressed="false"` and `variant="outline"`. Its error line goes under the group, and the group names the line in `aria-describedby`.
4. **Guests**, shown only while "Yes, I will be there" is chosen: a label as a `<p>` with an `id`, "Guests, you included", in `font-mono text-label text-foreground`, then a stepper from the layout notes, from 1 to 4, starting at 1. The value reads `1 guest`, `2 guests` and so on. The buttons' `aria-label`s are "Fewer guests" and "More guests". Under it the helper text `Your invitation is for up to 4 people.`, named in the group's `aria-describedby`.
5. **Dinner**, shown only while "Yes, I will be there" is chosen: the label "Your dinner", then a `Select` from the layout notes, with the placeholder "Choose a dinner" and the four dinners in the sample's order, each a `SelectItem` whose value is its plain text. Under it the helper text `If others come with you, tell us their dinners in the note.`
6. **Note**: the label "A note for Clem and Rafe (optional)", a `Textarea` with `maxLength={300}`, and under it helper text that counts down: `300 characters left`, down to `1 character left` and `0 characters left`.

The last item of the form is the page's one main action: the default `Button`, `type="submit"`, "Send my reply", full width below `md` as the Forms note says. After the form, in the card, the empty `role="status"` element.

**Second part,** `md:col-span-4 md:col-start-9`: a card as an `<aside>` with `aria-labelledby` pointing at its `<h2>`. Below `md` it comes after the form card. In the card's `gap-3`:

- The `<h2>` "The day in short".
- A `<dl>` with five rows, as the Rows note says, each row a `<div>` with `justify-between`: the term, a `<dt>`, is a label in `text-muted-foreground` with `shrink-0`; the value, a `<dd>`, is `min-w-0 text-right text-body text-foreground`, so a long value wraps inside its own cell at 375px. The rows: Date / `Saturday 17 July 2027`; Arrive / `From 13:30`; Ceremony / `14:00`; Place / `Quillbrook Barn, Little Saltry`; Reply by / `Friday 30 April 2027`. Every date and time in it is a `<time>`.
- One sentence in `text-body`: "Something the form does not ask? Write to hello@clemandrafe.example.", the address a link in running text to `mailto:hello@clemandrafe.example`.

### 4. Cannot reply online?

A section in the centered column from the layout notes, with an `<h2>` "Cannot reply online?" and, in the column's `gap-6`, one paragraph in `text-body`: "Clem's sister, Bea Ashdown, is keeping the list. Call her on 01632 960 573 or write to hello@clemandrafe.example, and she will add you.", with the number a link in running text to `tel:+441632960573` and the address a link to `mailto:hello@clemandrafe.example`.

### 5. Footer

The footer from the layout notes.

### Behavior

- Keep every value in component state: the name, the email, the choice (none, coming or not coming), the number of guests, the dinner and the note.
- Clicking "Yes, I will be there" or "Sorry, I cannot come" chooses it: it becomes `aria-pressed="true"` and `variant="secondary"`, the other goes back to `outline`, and focus stays on the button clicked. While "Sorry, I cannot come" is chosen, the guests and the dinner are not rendered and nothing about them is checked; choosing "Yes" again brings them back with the values they had.
- When the form is sent, check it in code, in this order:
  - Name: empty, or only spaces, gives "Write your name, as it is on your invitation."
  - Email: empty gives "Write your email address, so we can send you a copy."; a malformed one gives "Check the email address: it needs an @ and a domain."
  - Coming or not: no choice gives "Choose whether you can come."
  - Dinner, only when coming: no dinner chosen gives "Choose a dinner for yourself."
  - The number of guests is always valid, since the stepper cannot leave 1 to 4. The note is optional.
- Each error line follows the layout notes, which say when it shows, when it goes and how focus reaches it. Focus moves to the first field with an error; for the choice of coming, that is the "Yes, I will be there" button, and for the dinner its `SelectTrigger`. The choice's error goes as soon as one of its buttons is clicked.
- When everything is good, the form is replaced in its card by the confirmation in the status element. For a guest who is coming: an `<h3>` in `text-h2`, "Thank you, Ada Fenwick" (the name as typed, trimmed), with `tabIndex={-1}`; then a sentence that repeats the reply: "We have you down for 2 guests on Saturday 17 July 2027, with Wild mushroom pie (vegetarian) for your dinner.", the count written as the stepper writes it (`1 guest`, `3 guests`), the dinner as its row in the list reads, and the date a `<time dateTime="2027-07-17">`; then a sentence: "A copy is on its way to ada@example.com. To change anything before 30 April, write to hello@clemandrafe.example.", with the address they typed, the date a `<time dateTime="2027-04-30">` and our address a link in running text. For a guest who is not coming: the `<h3>` "Thank you for letting us know", and one sentence: "We will miss you, Ada Fenwick. If your plans change before 30 April, write to hello@clemandrafe.example and we will make room.", with the same `<time>` and link. The heading and the sentences sit in the message `<div>`; no button follows. Move focus to the heading. The card "The day in short" stays as it is.
- The note's count follows each keystroke and is not a live region.
- The other links need no behavior.
