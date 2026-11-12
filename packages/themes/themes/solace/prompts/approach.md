---
page: therapy approach page
title: Approach
description: a therapist's page on how sessions work, a long page read in one column, with a short list of contents that links to its sections, what happens before and in a first session, what comes after, one thing a client said set in the italic, what the therapist does not offer and one action.
order: 2
checks:
  - "The text sits in columns 1–7 from `md` up, every paragraph at most `max-w-xl`, with the list of contents in a card in columns 9–12 and column 8 empty; on a phone the contents come before the text."
  - "The five `<h2>` sections of the text each have an `id`, and each link in On this page has the same words as its heading and jumps to it."
  - "What happens in a first session is an ordered list of three entries, each led by a label with its minutes, 10, 30 and 10, which add up to the 50 minutes of a session."
  - "What a client said is a `<blockquote>` in the heading font's italic inside a `<figure>`, and its caption says it is shared with permission and changed to keep it private."
  - "What I do not offer is a list of five things, followed by what to do in an emergency in general words, with no phone number and no named organisation."
  - "The page has exactly one default (indigo) button, Request a first session; nothing is bold, and the only italics are the phrase in the `<h1>` and the client's words."
---

Sample content, if the user gave none: the practice of **Nora Ellingham**, an invented registered psychotherapist who works alone, with adults, one to one, in a garden room in Larkmere, an invented town, and online by video. This page says how she works: a free call of 20 minutes first, then sessions of 50 minutes at £68, once a week at the same time, with a look every sixth session at whether it is still useful. The text below is given word for word, because the page is only as calm as its words: use it as it is, and add no sections of your own.

Build these parts in order.

### 1. Header

The header from the layout notes. "Approach" is the current page, in the header and in the footer.

### 2. Opening

The first section, in the grid, with its `aria-labelledby` naming the `<h1>`:

- A label line in `text-muted-foreground`, columns 1–12 (`md:col-span-12`): `How I work · About 3 minutes to read`.
- With `mt-4`, the `<h1>` in `text-h1 md:text-display`, columns 1–9 (`md:col-span-9`): "How we would work together". The words "work together" are an `<em>` with `italic`.
- With `mt-7`, a `<p>` in columns 1–7 (`md:col-start-1 md:col-span-7`, which overlap the `<h1>`'s, so it starts a row under it), at most `max-w-xl`, in `text-body`: "This page says what a session is like, from the first call to the last meeting. Read as much of it as helps. You can also just ask me."

### 3. The text

A section in the grid, with its `aria-label` "How sessions work" (here, in place of `aria-labelledby`), and two parts. The list of contents comes first in the code, so that on a phone it stands above the text; from `md` up both parts have `md:row-start-1`, so the text takes columns 1–7 and the contents sit at the right of its first lines.

**On this page**, in columns 9–12 (`md:col-start-9 md:col-span-4 md:row-start-1`): a `<nav>` that is a card from the layout notes, with `aria-labelledby` naming its heading and no `aria-label`. It also has `md:sticky md:top-7 md:self-start`, so on a large screen it stays in view while the text is read.

- An `<h2>` with an `id`: "On this page".
- With `mt-4`, an `<ol>` with `list-none`, no padding and `mt-2` between items, holding five links in `text-body`, styled as links in running text, one for each `<h2>` of the text, with the same words.

**The text**, in columns 1–7 (`md:col-span-7 md:row-start-1`), with `mt-12 md:mt-0`: one `<div>` in normal block flow. Every paragraph is a `<p>` in `text-body`, at most `max-w-xl`. Each of the five `<h2>` has an `id` and `scroll-mt-7`; the first has no top margin, the others `mt-12`. The text under a heading starts with `mt-4`, and paragraphs follow each other with `mt-4`. A list, the quotation, and a paragraph that follows a list or the quotation have `mt-7`. In this order, word for word:

**"Before we meet"** (`id="before"`)

- "It starts with a call of 20 minutes, by phone or video. It is free."
- "You can tell me a little about what is going on, and ask me anything. I will say how I work and whether I think I can help. If I am not the right person, I will say so, and where I can I will suggest who might be."
- "Nothing is booked until we have spoken and you have had time to think."

**"The first session"** (`id="first-session"`)

- "A first session is 50 minutes, like every session after it. It costs the same, £68."
- An `<ol>` as a list with hairlines (see the layout notes), three entries. Each `<li>` is also `md:grid md:grid-cols-7 md:items-baseline md:gap-x-7`: in columns 1–2 (`md:col-span-2`) a label line in `text-muted-foreground`; in columns 3–7 (`md:col-span-5`), with `mt-2 md:mt-0`, a `<p>` in `text-body`.
  1. `First 10 minutes`: "We settle in. I explain confidentiality and its few limits, and you can ask about anything on this page."
  2. `Middle 30 minutes`: "You talk about what brings you, in any order. I may ask a question now and then. Silence is allowed."
  3. `Last 10 minutes`: "We stop and look at how it was. I say what I heard, and we each say whether we would like to go on."
- "You do not have to decide in the room. You can write to me a few days later."

**"After that"** (`id="after"`)

- "If we go on, we meet once a week, on the same day and at the same time. A steady rhythm matters more than a fast one."
- "Some people come for eight or ten sessions. Some stay for a year or longer. Every sixth session we take a few minutes to ask whether this is still useful to you."
- "You can end at any point. I ask only that we have one last session to finish properly, rather than stopping by email."

**"What a client said"** (`id="in-their-words"`)

- A `<figure>` holding a `<blockquote>` and a `<figcaption>`. The `<blockquote>` has no border and no padding, and holds one `<p>` in `font-heading text-h2 italic`, with its quotation marks typed: "“I kept waiting to be told what was wrong with me. It took a few weeks to notice that nobody was going to, and that I could put things down in that room that I had carried everywhere else.”" The `<figcaption>`, with `mt-4`, is a caption from the layout notes: "A client, after a year of weekly sessions. Shared with permission, and changed to keep it private."
- "People say many different things about therapy. This is one of them, and it is not a promise of what it would be for you."

**"What I do not offer"** (`id="not-offered"`)

- "It is better to know this before you write."
- A `<ul>` with `list-disc pl-7` and `mt-2` between items, five items in `text-body`:
  1. "Emergency or crisis support. I cannot respond quickly, and I am not available between sessions."
  2. "Diagnosis, medication or medical advice. Your doctor is the right person for those."
  3. "Couples or family therapy. I work with one person at a time."
  4. "Work with anyone under 18."
  5. "Reports for courts, employers or insurers."
- "If you need one of these, tell me when you write. Where I can, I will point you towards someone who offers it."
- "In an emergency, call your local emergency number or go to the nearest emergency department."

The text holds no card, no badge, no picture and no button.

### 4. The one action

A section in the grid, with one card in columns 1–7 (`md:col-span-7`), built as the note The one action says. The section's `aria-labelledby` names the card's `<h2>`.

- The `<h2>`: "If this sounds right for you".
- With `mt-4`, a `<p>` in `text-body`, at most `max-w-xl`: "Write to me with the form. I reply within two working days. The first call is free, and nothing is booked until we have spoken."
- With `mt-7`, a `<div>` holding the default button "Request a first session", an `<a>` to `/first-session`. The page's one default button.

### 5. Footer

The footer from the layout notes.

### On a phone

Every part is one column. The `<h1>` is `text-h1` and wraps over two or three lines. The card On this page comes before the text and is not sticky; the text starts 48px under it. In the first session's list each entry stacks: the label, then its sentences 8px under it. The client's words wrap over eight or nine lines at 24px, which is fine.

### Behavior

- The links in On this page jump to their headings; `scroll-mt-7` keeps each heading clear of the top edge.
- Nothing else has state. Links only.
