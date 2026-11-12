---
page: therapy fees and questions page
title: Fees
description: a therapist's page of fees and questions, with a table of session types with their length and fee, how to cancel and how to pay as two cards, eight questions that open and close, and one action.
order: 4
checks:
  - "The fees are a `<table>` with a visually hidden caption and five rows, each with its length and its fee in the mono font: Free, £68, £68, £102 and £42; the fee column is right-aligned and no cell is bold."
  - "How to cancel and How to pay are two cards side by side from `md` up, each led by a label line, and they say 48 hours, the last Friday of each month and 14 days."
  - "Each of the eight questions is a `<button>` inside an `<h3>`, with aria-expanded and with aria-controls naming its answer; all are closed when the page opens, and any number can be open at once."
  - "A question opens and closes with Enter and with Space, its icon changes from Plus to Minus, and a closed answer has the hidden attribute."
  - "The page has exactly one default (indigo) button, Request a first session; the only italic is the phrase in the `<h1>`, and nothing is bold."
  - "At 375px the fees table fits its column without scrolling sideways, and each question's words wrap beside its icon."
---

Sample content, if the user gave none: the fees of **Nora Ellingham**, an invented registered psychotherapist who works alone, with adults, in a garden room in Larkmere, an invented town, and online by video. An introductory call of 20 minutes is free; a session of 50 minutes is £68, the first one too; a longer session of 80 minutes is £102; a reduced-fee session of 50 minutes is £42. Cancelling is free with 48 hours' notice, and inside 48 hours the full fee is charged. One invoice goes out by email on the last Friday of each month and is paid by bank transfer within 14 days. Fees are from 1 January 2027 and are reviewed each January. She does not bill insurers; name none. The copy below is given word for word: use it as it is.

Build these parts in order.

### 1. Header

The header from the layout notes. "Fees" is the current page, in the header and in the footer.

### 2. Opening

The first section, in the grid, with its `aria-labelledby` naming the `<h1>`:

- A label line in `text-muted-foreground`, columns 1–12 (`md:col-span-12`): `Fees from 1 January 2027`.
- With `mt-4`, the `<h1>` in `text-h1 md:text-display`, columns 1–9 (`md:col-span-9`): "Fees, said plainly". The words "said plainly" are an `<em>` with `italic`.
- With `mt-7`, a `<p>` in columns 1–7 (`md:col-start-1 md:col-span-7`, which overlap the `<h1>`'s, so it starts a row under it), at most `max-w-xl`, in `text-body`: "Here is what a session costs, how to pay and how to cancel. If something is not answered here, ask me. It is an ordinary question."

### 3. What sessions cost

A section in the grid, with two parts:

**The table**, in columns 1–7 (`md:col-span-7`):

- An `<h2>`: "What sessions cost".
- With `mt-7`, a table from the layout notes. Its `<caption>`: "Session types, with their length and fee". Three columns, with the headers `Session`, `Length` and `Fee`; the `Fee` header and every fee cell add `text-right`. In each row:
  - The row header, as the Tables note gives it, holding the session's name and under it a `<span>` with `mt-2 block font-mono text-label text-muted-foreground`, a short line on how it is held.
  - The length, a `<td>` that adds `whitespace-nowrap font-mono text-label text-foreground`.
  - The fee, a `<td>` that adds `whitespace-nowrap font-mono text-label tabular-nums text-foreground`.

  The rows, in this order:

  1. "Introductory call" / `By phone or video`, `20 minutes`, `Free`
  2. "First session" / `In person or online`, `50 minutes`, `£68`
  3. "Weekly session" / `In person or online`, `50 minutes`, `£68`
  4. "Longer session" / `By arrangement`, `80 minutes`, `£102`
  5. "Reduced-fee session" / `Ask me when you write`, `50 minutes`, `£42`
- With `mt-4`, a caption from the layout notes, a `<p>`: "Fees are reviewed each January. I tell you two months before any change."

**The note**, in columns 9–12 (`md:col-start-9 md:col-span-4 md:self-start`), with `mt-12 md:mt-0`: a card from the layout notes. `md:self-start` keeps the card as tall as its own text, not as tall as the column beside it.

- An `<h3>` in `text-h2`: "If the fee is a worry".
- With `mt-4`, a `<p>` in `text-body`: "Say so when you write. I keep some sessions at £42 for people on a low income, and I will tell you plainly whether I can offer one."

### 4. Cancelling and paying

Here, in place of one section, a `<div>` with the section's `mt-28` and the grid classes holds two `<section>` elements, each a card from the layout notes and each with `aria-labelledby` naming its own `<h2>`: the first in columns 1–6 (`md:col-span-6`), the second in columns 7–12 (`md:col-span-6`) with `mt-4 md:mt-0`. From `md` up the two cards are the same height. In each card:

- A label line in `text-muted-foreground`.
- With `mt-4`, an `<h2>`.
- With `mt-4`, three paragraphs in `text-body`, the second and third with `mt-4`.

The first card, word for word: label `48 hours' notice`; "How to cancel"; "Write to me at least 48 hours before your session, and there is no charge."; "Inside 48 hours I charge the full fee. I hold that time for you, and I cannot offer it to someone else at short notice."; "If I have to cancel, I tell you as early as I can, and you pay nothing."

The second card, word for word: label `One invoice a month`; "How to pay"; "I send one invoice by email on the last Friday of each month, for the sessions we had."; "You pay by bank transfer within 14 days. The details are on the invoice."; "I do not take cash or cards in the room. That keeps money out of the session."

### 5. Questions people ask

A section in the grid, with its content in columns 1–8 (`md:col-span-8`):

- An `<h2>`: "Questions people ask".
- With `mt-4`, a `<p>` in `text-body`: "Eight of them. Open the ones you need."
- With `mt-7`, a `<ul>` as a list with hairlines (see the layout notes), eight entries. Here an entry has no padding of its own (in place of the notes' `py-4`): the button carries it, so the whole row can be pressed. Each `<li>` holds:
  - An `<h3>` holding one plain `<button type="button">`, not a component, with an `id`, `aria-expanded` and `aria-controls` naming its answer, and `flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-heading text-h2 text-foreground hover:text-muted-foreground transition-colors duration-150`, plus the focus outline from the rules. It holds the question in a `<span>` and, after it, an icon with `shrink-0`: `Plus` while the answer is closed, `Minus` while it is open.
  - The answer: a `<div>` with an `id`, the `hidden` attribute while it is closed, and `pb-4`, holding one `<p>` in `text-body`, at most `max-w-xl`.

  The questions and answers, in this order, word for word:

  1. "How long would I come for?": "There is no set length. Some people come for eight or ten sessions, some for a year or longer. Every sixth session we look at whether it is still useful to you."
  2. "Do I need a referral from my doctor?": "No. You can write to me yourself. I do not contact your doctor unless you ask me to."
  3. "Can I use health insurance?": "I do not bill insurers. I can give you a receipt each month, and some policies pay you back. Your insurer can tell you whether yours does."
  4. "What if I am late?": "The session still ends at its usual time, so that the next person is not kept waiting. The fee is the same."
  5. "What if I am ill, or away?": "Tell me 48 hours before, and there is no charge. If you are too unwell to travel but well enough to talk, we can meet online instead."
  6. "Do you take holidays?": "Yes, about six weeks a year. I give you the dates at least a month ahead. You do not pay for sessions I cancel."
  7. "Is what I say confidential?": "Yes. What you say stays between us. There are a few limits, which are about safety and the law, and I explain them before we begin."
  8. "Can we change from in person to online?": "Yes. Tell me the day before, and I send you a video link. The time and the fee stay the same."

No `Accordion` component here: the plain buttons above are the whole mechanism.

### 6. The one action

A section in the grid, with one card in columns 1–7 (`md:col-span-7`), built as the note The one action says. The section's `aria-labelledby` names the card's `<h2>`.

- The `<h2>`: "If you would like to start".
- With `mt-4`, a `<p>` in `text-body`, at most `max-w-xl`: "Write to me with the form. The first call is free, and nothing is charged until we have met for a first session."
- With `mt-7`, a `<div>` holding the default button "Request a first session", an `<a>` to `/first-session`. The page's one default button.

### 7. Footer

The footer from the layout notes.

### On a phone

Every part is one column. The `<h1>` is `text-h1`. The table keeps its three columns: a session's name and the line under it wrap, the length and the fee stay on one line. The note comes 48px under the table's caption. The two cards stack, 16px apart, each as tall as its own text. A question's words wrap over two or three lines beside its icon, which stays at the right, centered on them.

### Behavior

- Keep the open questions in state as a set of their numbers; none is open when the page opens.
- Pressing a question's button, with the mouse, Enter or Space, opens its answer if it is closed and closes it if it is open: `aria-expanded` follows, the icon changes, and the answer loses or gets the `hidden` attribute. The others stay as they are, so any number can be open. Focus stays on the button. Nothing slides or fades.
- Nothing else has state. Links only.
