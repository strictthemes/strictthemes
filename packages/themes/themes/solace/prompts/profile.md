---
page: therapist's profile page
title: Profile
description: the profile page of one therapist in private practice, with a round portrait beside her name, her training and registration as a list, her areas of work, her languages, a table of the days and times sessions are held and whether each is in person or online, and one action.
order: 3
checks:
  - "The portrait is a 72px round fill with the initials NE, with the img role and an aria-label, in a row beside the `<h1>` and a line of training; it is the only round thing on the page."
  - "Training and registration are a `<dl>` of five rows with a hairline above each and one under the last, each year in a `<time>` element, and no real school, register or qualification is named."
  - "The days and times are a `<table>` with a visually hidden caption, column headers and row headers that are not bold, each time in a `<time>` element, and a badge In person or Online, or both, in each row."
  - "At 375px the table fits its column without scrolling sideways: the times do not wrap, and two badges in one row wrap under each other."
  - "The page has exactly one default (indigo) button, Request a first session, and no text on the page is bold or italic."
---

Sample content, if the user gave none: the profile of **Nora Ellingham**, an invented registered psychotherapist who works alone, with adults, one to one, in The Garden Room, 14 Orchard Row, Larkmere LK2 4DN (an invented town) and online by video. In private practice since 2014. Her training, all at invented schools: Diploma in Integrative Psychotherapy, Northmoor Institute, 2014 (four years, part time); Certificate in Working with Grief and Loss, The Tidewell Centre, 2016; Certificate in Online and Telephone Therapy, Northmoor Institute, 2020. Registered since 2014, registration no. 04417; name no register. Before that she taught in a secondary school for nine years. She speaks English and Dutch. Sessions are held on Tuesday 09:00–17:00 (in person), Wednesday 12:00–20:00 (in person or online), Thursday 09:00–17:00 (online) and Friday 09:00–13:00 (online). The copy below is given word for word: use it as it is.

Build these parts in order.

### 1. Header

The header from the layout notes. "About" is the current page, in the header and in the footer.

### 2. Portrait and introduction

The first section, in the grid, with its `aria-labelledby` naming the `<h1>` and its content in columns 1–8 (`md:col-span-8`):

- A row with `flex items-center gap-4 md:gap-7`: the portrait from the layout notes, and beside it a `<div>` with `min-w-0` holding the `<h1>` in `text-h1 md:text-display`, "Nora Ellingham", and with `mt-2` a label line in `text-muted-foreground`, `Registered psychotherapist · In practice since 2014`. The portrait keeps its 72px beside the large name: it is not made larger.
- With `mt-7`, three paragraphs in `text-body`, each at most `max-w-xl`, the second and third with `mt-4`:
  - "I am a psychotherapist. I work with adults, one to one, in a garden room in Larkmere and online by video."
  - "I trained for four years, after nine years as a secondary school teacher. Teaching showed me how much people carry without saying so."
  - "I work in an integrative way. That means I do not follow one method. I use what fits the person in front of me, and I say what I am doing and why."

### 3. Training and registration

A section in the grid, with two parts:

**The list**, in columns 1–7 (`md:col-span-7`):

- An `<h2>`: "Training and registration".
- With `mt-7`, a `<dl>` as the Description lists note describes it, with five rows, newest first. Each `<dt>` holds the year in a `<time>` (`<time dateTime="2020">2020</time>`) with `tabular-nums`; the first row's term is the words `Each year`, with no `<time>`. Each `<dd>` holds a `<p>` in `text-body` and, with `mt-2`, a label line in `text-muted-foreground`:
  - `Each year`: "Thirty hours of further training" / `And supervision once a month`
  - `2020`: "Certificate in Online and Telephone Therapy" / `Northmoor Institute · Six months`
  - `2016`: "Certificate in Working with Grief and Loss" / `The Tidewell Centre · One year`
  - `2014`: "Registered psychotherapist" / `Registration no. 04417 · Renewed each year`
  - `2014`: "Diploma in Integrative Psychotherapy" / `Northmoor Institute · Four years, part time`
- With `mt-7`, a `<p>` in `text-body`, at most `max-w-xl`: "I am insured to practise. If you would like to see my entry on the register, ask and I will send it."

**The note**, in columns 9–12 (`md:col-start-9 md:col-span-4 md:self-start`), with `mt-12 md:mt-0`: a card from the layout notes. `md:self-start` keeps the card as tall as its own text, not as tall as the column beside it.

- An `<h3>` in `text-h2`: "Languages".
- With `mt-4`, a `<p>` in `text-body`: "English and Dutch. A session can be in either, or move between the two."

### 4. Areas of work

A section in the grid, with two parts:

- **Heading**, in columns 1–4 (`md:col-span-4`): an `<h2>`, "Areas of work", then with `mt-4` a `<p>` in `text-body`: "These are what people most often bring. The list is not a boundary."
- **The list**, in columns 6–12 (`md:col-start-6 md:col-span-7`), with `mt-7 md:mt-0`: one `<div>` holding a `<ul>` as a list with hairlines (see the layout notes), six entries, which from `md` up is also two columns: `md:grid md:grid-cols-2 md:gap-x-7`. Each `<li>` is its name alone, in `font-heading text-h2`, with no sentence under it: "Anxiety and worry", "Low mood", "Grief and loss", "Burnout and work", "Relationships", "A change you did not choose". Under the list, in the same `<div>`, with `mt-7`, a `<p>` in `text-body`, at most `max-w-xl`: "I do not work with couples, families or anyone under 18. The rest of what I do not offer is on the page about how I work.", with "the page about how I work" a link in running text to `/approach#not-offered`.

### 5. When sessions are held

A section in the grid, with two parts:

**The table**, in columns 1–7 (`md:col-span-7`):

- An `<h2>`: "When sessions are held".
- With `mt-4`, a `<p>` in `text-body`, at most `max-w-xl`: "These are the hours in which I see people. Your own session is at the same time each week."
- With `mt-7`, a table from the layout notes (add the badge with `npx shadcn@latest add badge`). Its `<caption>`: "Days and times of sessions". Three columns, with the headers `Day`, `Times` and `Where`. In each row:
  - The row header, the day, as the Tables note gives it.
  - The times, a `<td>` that adds `whitespace-nowrap font-mono text-label tabular-nums text-foreground`: two `<time>` elements joined by an en dash, `<time dateTime="09:00">09:00</time>–<time dateTime="17:00">17:00</time>`.
  - Where, a `<td>` holding a `<div>` with `flex flex-wrap gap-2` and one or two badges from the layout notes.

  The rows, in this order: Tuesday, `09:00–17:00`, "In person"; Wednesday, `12:00–20:00`, "In person" and "Online"; Thursday, `09:00–17:00`, "Online"; Friday, `09:00–13:00`, "Online".
- With `mt-4`, a caption from the layout notes, a `<p>`: "No sessions on Mondays, at weekends or on public holidays."

**The note**, in columns 9–12 (`md:col-start-9 md:col-span-4 md:self-start`), with `mt-12 md:mt-0`: a card from the layout notes. `md:self-start` keeps the card as tall as its own text, not as tall as the column beside it.

- An `<h3>` in `text-h2`: "Finding the room".
- With `mt-4`, a `<p>` in `text-body`: "The Garden Room is behind 14 Orchard Row, through the side gate. There is one low step. If steps are difficult, tell me, and we can meet online."

### 6. The one action

A section in the grid, with one card in columns 1–7 (`md:col-span-7`), built as the note The one action says. The section's `aria-labelledby` names the card's `<h2>`.

- The `<h2>`: "If you would like to meet".
- With `mt-4`, a `<p>` in `text-body`, at most `max-w-xl`: "The button leads to a short form. I reply within two working days, and we start with a free call of 20 minutes."
- With `mt-7`, a `<div>` holding the default button "Request a first session", an `<a>` to `/first-session`. The page's one default button.

### 7. Footer

The footer from the layout notes.

### On a phone

Every part is one column. The portrait keeps its 72px with the name beside it; the `<h1>` is `text-h1` and wraps onto two lines, and the label line under it wraps too. The rows of training keep their year and their text side by side. The Languages card comes 48px under the list. The areas of work are one column of six. The table keeps its three columns: the times stay on one line, and Wednesday's two badges stand one under the other. The Finding the room card comes 48px under the table's caption.

### Behavior

Nothing on this page has state. Links only.
