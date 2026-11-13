---
page: wedding guestbook page
title: Guestbook
description: the guestbook of a summer wedding, with messages from guests as cards with a round initials avatar, and a form to leave a message, checked in code, with a confirmation that replaces it.
order: 5
checks:
  - "Each message is a card with a 44px round avatar of the writer's initials, hidden from screen readers, the writer's name as a heading and the date as a time element."
  - "Sending the form with an empty name or an empty message gives each its own error line with an icon, tied to its field, and focus moves to the first of them."
  - "A good message replaces the form, inside the same card, with a confirmation that a screen reader announces and that takes focus, a new card appears at the top of the list, and the count reads 7 messages."
  - "The message field counts down the characters left, and reads 1 character left at one."
  - "No card sits inside another card, and the blush block holds no avatar, badge, link or field."
  - "The opening block element carries bg-blush text-blush-foreground, so its text stays plum ink in dark mode, and nothing inside it has a text color class of its own."
---

Sample content, if the user gave none: the guestbook of Clem Ashdown and Rafe Linnell, who marry on Saturday 17 July 2027 at Quillbrook Barn, Little Saltry. Six guests have written so far, newest first:

1. Juno Pell, `Margot's daughter, aged 9`, 9 April 2027: she is going to dance every dance, and reminds Rafe that he promised the one with the arches.
2. Tobias Wren, `Your neighbour on Saltry Lane`, 1 April 2027: the croquet set is theirs to borrow for the day, and he wishes them a garden that grows faster than his.
3. Hester Quayle, `Clem's friend from the library`, 24 March 2027: she remembers Clem reading recipes aloud at the issue desk, and hopes the new kitchen hears plenty of them.
4. Dev Raman, `Rafe's flatmate at university`, 15 March 2027: he has known for years that Rafe would marry someone who could out-walk him, and he is glad it is Clem.
5. Ade Fairbrother, `Clem's cousin`, 9 March 2027: the family has waited a long time for a ceilidh, and he has been practising in the kitchen.
6. Margot Pell, `Clem's godmother`, 2 March 2027: she held Clem at her christening and will try very hard not to cry at the barn.

Write each message yourself from its line, in one to three sentences, in the guest's own voice. Initials: JP, TW, HQ, DR, AF, MP.

Build these parts in order.

### 1. Header

The header from the layout notes, with "Guestbook" as the current page; its link keeps `/guestbook`.

### 2. Opening

A full-width section that is a pastel block in blush, as the layout notes describe it, with its `aria-labelledby` pointing at the `<h1>`. The `<section>` is the block element, and it carries `bg-blush text-blush-foreground`, the pair from the first layout note, so its text stays plum in dark mode; nothing inside it gets a text color class of its own. It holds one `flex flex-col gap-3`: a `flex flex-col gap-2` with a label, `For Clem and Rafe`, and the `<h1>` "Leave us a few words" in `text-h1 md:text-display`; then one paragraph in `text-body` with `max-w-xl`: "A memory, a wish or a piece of advice for the years ahead. We read every one, and we are keeping them all."

### 3. Messages and the form

Here, in place of a section, the `<main>`'s item is a `<div>` with the grid classes of the layout notes' parts side by side (`grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-6 md:items-start`), holding two sections. Below `md` the messages come first, then the form.

**Messages,** a section with `md:col-span-7`, `flex flex-col gap-6`, and its `aria-labelledby` pointing at its `<h2>`. It opens with a `flex flex-col gap-2` holding the `<h2>` "Messages" and, under it, a small figure: `6 messages` (`1 message` at one). Then the messages as a `<ul>` with no markers and no padding and `flex flex-col gap-6`, newest first. Each `<li>` is a card from the layout notes, with the card's `gap-3`:

- A row, `flex items-center gap-3`: the avatar from the layout notes with the writer's initials, then a `flex min-w-0 flex-col gap-2` holding the writer's name as an `<h3>` in `text-body` (in the heading font, as the Headings note says) and, under it, a small figure: how they know the couple and the date, joined with ` · `: `Clem's godmother · 2 March 2027`, the date a `<time dateTime="2027-03-02">`. The small figure wraps under the name at 375px, not beside it. Every message date takes this short form, without the weekday.
- The message, one `<p>` in `text-body`.

The cards have no other parts: no badge, no button, no reply link.

**Write in the guestbook,** a section with `md:col-span-5`, `flex flex-col gap-6`, and its `aria-labelledby` pointing at its `<h2>`. It opens with a `flex flex-col gap-3` holding the `<h2>` "Write in the guestbook" and one sentence in `text-body`: "Your message goes at the top of the list straight away." Then the form card, as the Forms note describes it. Add the fields with `npx shadcn@latest add input textarea` if the project has none, and give the new files the edits the Added components note lists. The `<form>` has the `aria-label` "Write in the guestbook". Its fields, each in its own `flex flex-col gap-2`:

1. **Name**: the label "Your name", an `Input` with `autoComplete="name"` and `maxLength={60}`.
2. **How you know them**: the label "How you know Clem and Rafe (optional)", an `Input` with `autoComplete="off"` and `maxLength={60}`, and the helper text `Like "Rafe's cousin" or "the neighbours at number 4"`.
3. **Message**: the label "Your message", a `Textarea` with `maxLength={500}`, and under it helper text that counts down: `500 characters left`, down to `1 character left` and `0 characters left`. Where an error shows, it comes after the count, and the field's `aria-describedby` names both.

The last item of the form is the page's one main action: the default `Button`, `type="submit"`, "Add my message", full width below `md` as the Forms note says. After the form, in the card, the empty `role="status"` element.

### 4. On the day

A section in the centered column from the layout notes, with an `<h2>` "On the day" and, in the column's `gap-6`, one paragraph in `text-body`: "There is a paper guestbook too, on the table by the barn door, with pens that work. Write in both if you like."

### 5. Footer

The footer from the layout notes.

### Behavior

- Keep the messages in component state as a list of objects with an `id` (the React key, since two guests can share a name), a name, the initials, how they know the couple (or none), the date (or none, for a new one) and the text. The count reads from the list.
- When the form is sent, check it in code:
  - Name: empty, or only spaces, gives "Write your name, so they know who it is from."
  - Message: empty, or only spaces, gives "Write a message. A line or two is plenty."
  - How you know them is optional and never gets an error.
- Each error line follows the layout notes, which say when it shows, when it goes and how focus reaches it. Focus moves to the first field with an error.
- When both are good, add a card at the top of the list from the trimmed values. Its initials are the first letter of the first two words of the name, in capitals (`Dev Raman` gives `DR`; a one-word name gives one letter). Its small figure is how they know the couple, if given, then `Just now`, joined with ` · `: `Rafe's cousin · Just now`, or `Just now` alone; `Just now` is plain text, not a `<time>`. The count follows: `7 messages`. The form is replaced in its card by the confirmation in the status element: an `<h3>` in `text-h2`, "Thank you, Dev Raman" (the name as typed, trimmed), with `tabIndex={-1}`, and one sentence: "Your message is at the top of the guestbook." The heading and the sentence sit in the message `<div>`; no button follows. Move focus to the heading.
- The list is not a live region: the confirmation says what happened.
- The other links need no behavior.
