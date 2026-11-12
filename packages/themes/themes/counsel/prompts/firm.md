---
page: law firm home page
title: Firm
description: the home page of a commercial law firm, with a large opening statement, its practice areas, the firm in figures, three recent matters, four of its partners and a line to get in touch.
order: 1
checks:
  - "The `<h1>` is the page's only `text-display` text, from `md` up, and no heading or text on the page is bold or italic."
  - "The page has exactly one badge, Ranked 2026, on the Commercial disputes row, and nothing else on the page is `bg-tertiary`; there is exactly one default (navy) button, Make an enquiry."
  - "The five practice areas, the three matters and the four partners are lists, each entry with a 1px top border or, for the partners, a portrait; the figures are a `<dl>`."
  - "Every portrait is a rectangle with 4px corners, a hairline border and the person's initials, with an `aria-label`, and nothing on the page is round."
  - "Every section after the first is divided from the one before by one hairline, with equal white space above and below it."
---

Sample firm, if the user gave none: **Harrow & Vane LLP**, an invented commercial law firm in Wexcombe, an invented English city, founded in 1952 by Arthur Harrow and Eleanor Vane. One office, at 4 Chancery Row, Wexcombe WX1 2LN. 14 partners and 86 lawyers in five practice areas: Corporate, Commercial disputes, Employment, Real estate and Private client. Partners include Helena Marsh (managing partner, Corporate), David Achterberg (head of Commercial disputes), Priya Raman (Employment) and Ruth Calloway (Commercial disputes, made partner on 1 May 2026). Commercial disputes is ranked in the first band for the region by the Northern Legal Review, 2026, an invented directory. The main line is 01632 960 214, the enquiries address enquiries@harrowvane.example, and the office is open Monday to Friday 08:30–17:30. Every name, client and matter is invented: name no real firm, person, case or court ruling. Write the rest of the copy yourself, plain and exact, the way a careful letter reads: no superlatives, no "leading" or "world-class".

Build these parts in order.

### 1. Header

The header from the layout notes. None of the links is the current page.

### 2. Opening

The first section, in the grid:

- A label line in `text-muted-foreground`, columns 1–12 (`md:col-span-12`): `Commercial lawyers · Wexcombe, since 1952`, with `1952` in a `<time dateTime="1952">`.
- With `mt-4`, the `<h1>` in `text-h1 md:text-display`, columns 1–10 (`md:col-span-10`): "Clear advice for the decisions that shape a business". It runs over two or three lines on a large screen.
- With `mt-8`, a `<p>` in columns 1–7 (`md:col-start-1 md:col-span-7`, which overlap the `<h1>`'s, so it starts a row under it), at most `max-w-xl`, two sentences in `text-body`. Sample: "We advise owner-managed companies, their boards and the families behind them, from a single office in Wexcombe. A partner reads every matter we take on, and stays with it to the end."
- With `mt-8`, in the same columns (`md:col-start-1 md:col-span-7`), an onward link from the layout notes: "Our practice areas", to `#practice-areas`.

No picture, no button and no badge in this section: the heading and the white space around it are the whole opening.

### 3. Practice areas

A section with the `id` `practice-areas`, in the grid, with two parts:

- **Heading**, in columns 1–4 (`md:col-span-4`): an `<h2>` in `text-h2`, "Practice areas", then with `mt-4` one sentence in `text-body`: "Five teams, each led by partners who have practised in Wexcombe for most of their careers."
- **The list**, in columns 5–12 (`md:col-start-5 md:col-span-8`), with `mt-8 md:mt-0`: a `<ul>` as a list of entries (see the layout notes), five entries, each with `py-8`. From `md` up each `<li>` is also `md:grid md:grid-cols-8 md:items-baseline md:gap-x-8`, with two parts:
  - In columns 1–3 (`md:col-span-3`): the area's name as an `<h3>` in `text-h2` holding a link, styled as a name that is a link. Only Commercial disputes links to `/practice/commercial-disputes`; the other four point to `#`.
  - In columns 4–8 (`md:col-span-5`), with `mt-2 md:mt-0`: one sentence in `text-body`, at most `max-w-xl`, saying what the team does.

  Entries, in this order: Corporate (sales and purchases of companies, investment, shareholder agreements), Commercial disputes (contract and supply claims, warranty claims after a sale, urgent court orders), Employment (contracts, restrictive covenants, team moves, tribunal claims), Real estate (leases, development sites, the property side of a sale), Private client (wills, trusts and succession for business owners).

  In the Commercial disputes entry only, under its `<h3>` in the same grid item, a `<p>` with `mt-2` holding the page's one badge: "Ranked 2026". It is the page's one use of gold.

### 4. The firm in figures

A section in the grid:

- An `<h2>` in `text-h2`, columns 1–4 (`md:col-span-4`): "The firm in figures".
- With `mt-8`, across columns 1–12 (`md:col-start-1 md:col-span-12`), a `<dl>`. Here, instead of the Description lists note, it is a row of four figures: `grid grid-cols-2 gap-x-4 md:grid-cols-4 md:gap-x-8`, two by two on a phone. Each figure is a `<div>` with `border-t border-border pt-4`, and every `<div>` in the second row on a phone has `mt-8 md:mt-0` (the third and fourth). Inside each `<div>` the term comes first in the code and second on screen: the `<div>` is also `flex flex-col-reverse`; the `<dt>` is a label in `text-muted-foreground` with `mt-2`, the `<dd>` the figure in `font-heading text-h1`. Figures and terms: `1952` Founded (the `<dd>` holds a `<time dateTime="1952">`), `14` Partners, `86` Lawyers, `£310m` Transactions advised on in 2025.

### 5. Recent matters

A section that is not a grid:

- An `<h2>` in `text-h2`: "Recent matters".
- With `mt-8`, a `<ul>` as a list of entries, three entries, each with `py-8`. Each `<li>` is also `md:grid md:grid-cols-12 md:items-baseline md:gap-x-8`, with three parts:
  - Columns 1–3 (`md:col-span-3`): a label line in `text-muted-foreground`, the year and the practice area, `2026 · Corporate`, with the year in a `<time dateTime="2026">`.
  - Columns 4–10 (`md:col-span-7`), with `mt-2 md:mt-0`: a `<div>` holding the matter's name as an `<h3>` in `text-h2`, not a link, and with `mt-2` one sentence in `text-body`, at most `max-w-xl`.
  - Columns 11–12 (`md:col-span-2`), with `mt-2 md:mt-0`: the value, a `<p>` in `font-mono text-label uppercase tabular-nums text-foreground` with `md:text-right`.

  Entries, in this order: "Sale of Corran Marine" (`2026 · Corporate`, `£48m`): advised the founders of a boatbuilder on its sale to a Dutch shipping group. "Estley Mills v Brandreth Engineering" (`2026 · Commercial disputes`, `£6.2m`): won a claim for a textile mill, after a nine-day trial, over a production line that never ran to its specification. "Wexcombe University, Quay Street" (`2026 · Real estate`, `11,000 m²`): acted for the university on the 25-year lease of its new research building. In `11,000 m²` the unit keeps its case: put `m²` in a `<span>` with `normal-case`.

### 6. Partners

A section that is not a grid:

- A row with `flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2`: an `<h2>` in `text-h2`, "Partners", and an onward link from the layout notes, "All 14 partners", pointing to `#`. Here the link's `<p>` is not below the list: it is the second item of this row, at its right end.
- With `mt-8`, a `<ul>` with `list-none` that is its own grid: `grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-8`. Here, instead of the Grid note's "never `gap-y-*`", this list of four people has `gap-y-8`, so the second row on a phone sits 32px under the first. Four `<li>`, each holding:
  - A portrait from the layout notes, with the person's initials.
  - With `mt-4`, the name as an `<h3>` in `text-h2` holding a link, styled as a name that is a link: Ruth Calloway links to `/people/ruth-calloway`, the others to `#`.
  - With `mt-2`, the role, a label line in `text-muted-foreground`.

  People, in this order: Helena Marsh (`HM`, `Managing partner · Corporate`), David Achterberg (`DA`, `Head of commercial disputes`), Priya Raman (`PR`, `Partner · Employment`), Ruth Calloway (`RC`, `Partner · Commercial disputes`). Each portrait's `aria-label` describes a photograph of that person in one sentence. At 375px a long name such as "David Achterberg" wraps onto two lines in its half of the row; that is fine.

### 7. Get in touch

A section in the grid, with its content in columns 1–7 (`md:col-span-7`):

- An `<h2>` in `text-h2`: "Talk to a partner".
- With `mt-4`, one or two sentences in `text-body`, at most `max-w-xl`: tell us briefly what the matter is, and a partner in the right team replies within one working day.
- With `mt-8`, a row with `flex flex-wrap items-center gap-x-8 gap-y-4`: the default button "Make an enquiry", an `<a>` styled with `buttonVariants` and the Buttons classes, to `/contact`, the page's one default button; and beside it a `<p>` label line: `Or call 01632 960 214`, where the number is a `tel:01632960214` link styled as a link in running text.

### 8. Footer

The footer from the layout notes.

### On a phone

Every part is one column. The `<h1>` is `text-h1` and wraps over four or five lines. In the practice areas each entry stacks: the name, the badge under Commercial disputes, then the sentence. The figures sit two by two. Each matter stacks: the label line, the name and sentence, then the value on its own line at the left. The partners sit two by two. The enquiry button and the phone line wrap onto two lines.

### Behavior

Nothing on this page has state. Links only: "Our practice areas" jumps to the practice areas section.
