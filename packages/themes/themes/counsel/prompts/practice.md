---
page: practice area page
title: Practice
description: the page for one practice area of a commercial law firm, with what the team does, the matters it typically takes on, three recent matters, the two partners who lead it and its related briefings.
order: 2
checks:
  - "The running text sits in seven of the twelve columns from `md` up, with one short note beside it in columns 9–12 and the columns between them empty."
  - "The page has exactly one badge, Ranked 2026, beside the page's label line, and nothing else on the page is `bg-tertiary`; there is exactly one default (navy) button, Speak to the team."
  - "The typical matters, the recent matters and the related briefings are lists with a 1px top border on each entry; each briefing's date is a `<time>` with a `dateTime`."
  - "Each of the two partners has a rectangular portrait with initials, a name in the heading font, a role in a label, and a telephone link and an email link that are never uppercased."
  - "No heading or text on the page is bold or italic, and nothing on the page is round."
---

Sample firm, if the user gave none: **Harrow & Vane LLP**, an invented commercial law firm in Wexcombe, an invented English city, founded in 1952, with 14 partners and 86 lawyers in one office at 4 Chancery Row, Wexcombe WX1 2LN. This page is for its **Commercial disputes** team: 4 partners and 16 lawyers, led by David Achterberg (head of commercial disputes, `01632 960 231`, d.achterberg@harrowvane.example) and Ruth Calloway (partner, `01632 960 237`, r.calloway@harrowvane.example). The team acts for owner-managed companies, their buyers and sellers, and their lenders, in the courts, in arbitration and at mediation, and settles about eight in ten of its claims before trial, most of them at mediation. It is ranked in the first band for commercial disputes in the region by the Northern Legal Review, 2026, an invented directory. Every name, client and matter is invented: name no real firm, person, case or court ruling. Write the rest of the copy yourself, plain and exact.

Build these parts in order.

### 1. Header

The header from the layout notes. "Practice" is the current page, in the header and in the footer.

### 2. Opening

The first section, in the grid:

- A row in columns 1–12 (`md:col-span-12`), a `<div>` with `flex flex-wrap items-center gap-x-4 gap-y-2`: a label line in `text-muted-foreground`, `Practice area · 4 partners · 16 lawyers`, and beside it the page's one badge, "Ranked 2026". 16px between them on one line, 8px when the badge wraps under the label.
- With `mt-4`, the `<h1>` in `text-h1 md:text-display`, columns 1–9 (`md:col-span-9`): "Commercial disputes".
- With `mt-8`, a `<p>` in columns 1–7 (`md:col-start-1 md:col-span-7`, which overlap the `<h1>`'s, so it starts a row under it), at most `max-w-xl`, in `text-body`. Sample: "When a contract, a sale or a partnership goes wrong, we work out what the claim is worth before anyone spends money on it, and then we pursue it or defend it to the end."

### 3. What we do

A section in the grid, with two parts:

**The text**, in columns 1–7 (`md:col-span-7`):

- An `<h2>` in `text-h2`: "What we do".
- With `mt-4`, three paragraphs in `text-body`, each at most `max-w-xl`, the second and third with `mt-4`. Say who the team acts for; how it handles a new dispute in its first two weeks (a partner reads the papers, the client gets a written view of the claim's merits and its likely cost); and how often its claims settle before trial and why. The last paragraph holds one link in running text, "our briefing on notice clauses", to `/insights/notice-clauses`.

**The note**, in columns 9–12 (`md:col-start-9 md:col-span-4`), with `mt-14 md:mt-0`, as the Text and note rule says:

- A label heading "The team", an `<h3>`.
- With `mt-4`, a `<dl>` as the layout notes describe it, with four rows: Partners (`4`), Lawyers (`16`), Head of practice (`David Achterberg`), Ranked (`Band 1, Northern Legal Review, 2026`). The two `<dd>` elements that hold a count have `font-mono tabular-nums` beside their `text-body`.

### 4. Typical matters

A section in the grid:

- An `<h2>` in `text-h2`, columns 1–4 (`md:col-span-4`): "Typical matters".
- In columns 5–12 (`md:col-start-5 md:col-span-8`), with `mt-8 md:mt-0`: a `<ul>` as a list of entries, six entries, each with `py-4` (here, instead of the notes' `py-8`, because the entries are short). Each `<li>` is also `md:grid md:grid-cols-8 md:items-baseline md:gap-x-8`, with two parts: the kind of matter as an `<h3>` in `text-h2` in columns 1–3 (`md:col-span-3`), and one sentence in `text-body` in columns 4–8 (`md:col-span-5`), with `mt-2 md:mt-0`.

  Entries, in this order, each `<h3>` exactly these words, with a sentence you write: Contract and supply claims; Warranty claims after a sale; Shareholder disputes; Professional negligence; Arbitration; Urgent court orders (its sentence says these are freezing orders and injunctions, often obtained within a day or two).

### 5. Recent matters

A section that is not a grid:

- An `<h2>` in `text-h2`: "Recent matters".
- With `mt-8`, a `<ul>` as a list of entries, three entries, each with `py-8`. Each `<li>` is also `md:grid md:grid-cols-12 md:items-baseline md:gap-x-8`, with three parts:
  - Columns 1–3 (`md:col-span-3`): a label line in `text-muted-foreground` with the year and the kind of claim, `2026 · Trial`, the year in a `<time dateTime="2026">`.
  - Columns 4–10 (`md:col-span-7`), with `mt-2 md:mt-0`: a `<div>` holding the matter's name as an `<h3>` in `text-h2`, not a link, then with `mt-2` one sentence in `text-body`, at most `max-w-xl`, then with `mt-2` a label line in `text-muted-foreground` naming who led it, written as each entry gives it below (`Led by David Achterberg`).
  - Columns 11–12 (`md:col-span-2`), with `mt-2 md:mt-0`: the value, a `<p>` in `font-mono text-label tabular-nums text-foreground` with `md:text-right`, and no `uppercase`, so a sum keeps its small `m`.

  Entries, in this order: "Estley Mills v Brandreth Engineering" (`2026 · Trial`, `£6.2m`, `Led by David Achterberg with Ruth Calloway`): won a claim for a textile mill, after a nine-day trial, over a production line that never ran to its specification. "The sellers of Halden Print" (`2026 · Warranty claim`, `£3.4m`, `Led by Ruth Calloway`): a buyer's warranty claim against our clients was struck out because its notice arrived one day after the contract's deadline. "Marram Logistics" (`2026 · Urgent order`, `£2.1m`, `Led by David Achterberg`): a freezing order against a former director, obtained within 36 hours of the first call.

### 6. Who leads it

A section that is not a grid:

- An `<h2>` in `text-h2`: "Who leads it".
- With `mt-8`, a `<ul>` with no markers that is itself the grid (`grid grid-cols-1 md:grid-cols-12 md:gap-x-8`), with two `<li>`: the first in columns 1–6 (`md:col-span-6`), the second in columns 7–12 (`md:col-start-7 md:col-span-6`) with `mt-14 md:mt-0`. Each `<li>` is itself a grid of its own from `md` up, `md:grid md:grid-cols-6 md:gap-x-8`, with two parts:
  - The portrait from the layout notes in columns 1–2 (`md:col-span-2`), with the person's initials. On a phone it is `w-1/2` wide, so it does not fill the screen: write `w-1/2 md:w-full` in place of the notes' `w-full`.
  - In columns 3–6 (`md:col-span-4`), with `mt-4 md:mt-0`, a `<div>` holding: the name as an `<h3>` in `text-h2` holding a link, styled as a name that is a link (Ruth Calloway to `/people/ruth-calloway`, David Achterberg to `#`); with `mt-2` the role, a label line in `text-muted-foreground`; with `mt-4` one sentence in `text-body` on what they handle; with `mt-4` two `<p>` label lines, the second with `mt-2`: the telephone number as a `tel:` link and the email address as a `mailto:` link in `normal-case`, both styled as links in running text. The email's `<p>` also has `wrap-anywhere`: from 768px to about 1000px the address is wider than its four columns.

  People: David Achterberg (`DA`, `Head of commercial disputes`, `01632 960 231`, `d.achterberg@harrowvane.example`): trials and urgent court orders. Ruth Calloway (`RC`, `Partner · Commercial disputes`, `01632 960 237`, `r.calloway@harrowvane.example`): disputes that follow the sale of a company. Each portrait's `aria-label` describes a photograph of that person in one sentence.

### 7. Related briefings

A section that is not a grid:

- An `<h2>` in `text-h2`: "Related briefings".
- With `mt-8`, a `<ul>` as a list of entries, three entries, each with `py-8`. Each `<li>` is also `md:grid md:grid-cols-12 md:items-baseline md:gap-x-8`: in columns 1–3 (`md:col-span-3`) a label line in `text-muted-foreground` with the date as a `<time>` and the reading time, `10 November 2026 · 8 min read`; in columns 4–12 (`md:col-span-9`), with `mt-2 md:mt-0`, one `<div>` that is the grid item, holding the title as an `<h3>` in `text-h2` holding a link, styled as a title that is a link, then with `mt-2` the author, a label line in `text-muted-foreground`.

  Entries, newest first: "Notice clauses after a sale: when a late letter ends a warranty claim" (10 November 2026, 8 min read, Ruth Calloway, to `/insights/notice-clauses`); "Freezing orders: the first forty-eight hours" (29 October 2026, 6 min read, David Achterberg, to `#`); "Earn-outs that end in dispute" (17 September 2026, 6 min read, Ruth Calloway, to `#`).
- With `mt-8`, an onward link from the layout notes: "All briefings", to `#`.

### 8. Speak to the team

A section in the grid, with its content in columns 1–7 (`md:col-span-7`):

- An `<h2>` in `text-h2`: "Speak to the team".
- With `mt-4`, one or two sentences in `text-body`, at most `max-w-xl`: send us the outline of the dispute and any deadline you know of, and a partner replies within one working day.
- With `mt-8`, a `<div>` holding the default button "Speak to the team", an `<a>` styled with `buttonVariants` and the Buttons classes, to `/contact`. The page's one default button.

### 9. Footer

The footer from the layout notes.

### On a phone

Every part is one column. The badge wraps under the label line if the line is too short. The note comes after the three paragraphs, 56px under them. Each list entry stacks: label line, then name or title, then sentence, then value. The two partners stack, each with a half-width portrait above their name.

### Behavior

Nothing on this page has state. Links only.
