---
page: lawyer's profile page
title: Profile
description: the profile page of one partner at a commercial law firm, with a large rectangular portrait, her role and contact details, her experience, her admissions and education, her recent matters and her briefings.
order: 3
checks:
  - "The portrait is a large rectangle, `aspect-3/4`, with 4px corners, a hairline border and the initials RC, with an `aria-label` that describes the photograph; nothing on the page is round."
  - "The contact details are a `<dl>` whose telephone numbers are `tel:` links and whose email address is a `mailto:` link, never uppercased."
  - "Admissions and education are a `<dl>` with each year in a `<time>` element, and the recent matters are a list with a 1px top border on each entry."
  - "The page has exactly one badge, New partner, and nothing else on the page is `bg-tertiary`; there is exactly one default (navy) button, Email Ruth."
  - "No heading or text on the page is bold or italic."
---

Sample firm, if the user gave none: **Harrow & Vane LLP**, an invented commercial law firm in Wexcombe, an invented English city, founded in 1952, with 14 partners and 86 lawyers in one office at 4 Chancery Row, Wexcombe WX1 2LN. This page is for **Ruth Calloway**, a partner in its Commercial disputes team (4 partners and 16 lawyers, led by David Achterberg). She joined the firm as a trainee in 2011, was admitted as a solicitor in England and Wales in 2013, gained higher rights of audience in the civil courts in 2019 and was made partner on 1 May 2026. She read law at the University of Wexcombe (LLB, 2009) and took the Legal Practice Course at Wexcombe Law School (2010), both invented. She handles disputes that follow the sale of a company: warranty and indemnity claims, earn-outs and completion accounts. She speaks English and German. Direct line `01632 960 237`, email r.calloway@harrowvane.example; her assistant is Owen Pryce, `01632 960 238`. Every name, client and matter is invented: name no real firm, person, case or court ruling. Write her experience yourself, in the third person, plain and exact.

Build these parts in order.

### 1. Header

The header from the layout notes. "People" is the current page, in the header and in the footer.

### 2. Portrait and introduction

The first section, in the grid, with two parts:

**The portrait**, in columns 1–5 (`md:col-span-5`): a large portrait from the layout notes (`p-8`, the initials `RC` in `text-display`), with the `aria-label` "Ruth Calloway in a dark suit, standing at a window of the firm's library, her hands folded". From `md` up it is the full width of its columns; on a phone it is `w-2/3`, so the name shows on the first screen: write `w-2/3 md:w-full` in place of the notes' `w-full`.

**The introduction**, in columns 7–12 (`md:col-start-7 md:col-span-6`), with `mt-8 md:mt-0`, a `<div>` in this order:

- A row with `flex flex-wrap items-center gap-x-4 gap-y-2`: a label line in `text-muted-foreground`, `Partner · Commercial disputes`, and beside it the page's one badge, "New partner".
- With `mt-4`, the `<h1>` in `text-h1 md:text-display`: "Ruth Calloway". At 768px it may wrap onto two lines; that is fine.
- With `mt-4`, two sentences in `text-body`, at most `max-w-xl`. Sample: "Ruth acts in disputes that follow the sale of a company: warranty claims, earn-outs and the accounts drawn up at completion. She was made a partner in May 2026, fifteen years after she joined the firm as a trainee."
- With `mt-8`, a label heading "Contact", an `<h2>`.
- With `mt-4`, a `<dl>` as the layout notes describe it, with four rows: Direct line (`01632 960 237`, a `tel:01632960237` link), Email (`r.calloway@harrowvane.example`, a `mailto:` link), Assistant (`Owen Pryce · 01632 960 238`, with the number a `tel:01632960238` link), Office (`4 Chancery Row, Wexcombe`). The links are styled as links in running text and keep the `<dd>`'s `text-body`. At 375px the email address is wider than its cell: give that `<dd>` `wrap-anywhere`, so it breaks inside the cell and the page does not scroll sideways.
- With `mt-8`, a `<div>` holding the default button "Email Ruth", an `<a>` styled with `buttonVariants` and the Buttons classes, with the `href` `mailto:r.calloway@harrowvane.example`. The page's one default button.

### 3. Experience

A section in the grid, with two parts:

**The text**, in columns 1–7 (`md:col-span-7`):

- An `<h2>` in `text-h2`: "Experience".
- With `mt-4`, three paragraphs in `text-body`, each at most `max-w-xl`, the second and third with `mt-4`: the kinds of client she acts for (buyers and sellers of owner-managed companies, and the private equity houses behind some of them); how she handles a claim in its first weeks (the contract's notice and limitation clauses read first, a written view of the claim's worth within two weeks); and the work she has done in arbitration and at mediation. The last paragraph holds one link in running text, "the Commercial disputes team", to `/practice/commercial-disputes`.

**The note**, in columns 9–12 (`md:col-start-9 md:col-span-4`), with `mt-14 md:mt-0`, as the Text and note rule says:

- A label heading "Languages", an `<h3>`.
- With `mt-4`, one `<p>` in `text-body`: "English and German".
- With `mt-8`, a label heading "Practice areas", an `<h3>`.
- With `mt-4`, a `<p>` in `text-body`: "Commercial disputes; Corporate, for claims that follow a sale".

### 4. Admissions and education

A section in the grid, with its content in columns 1–7 (`md:col-span-7`):

- An `<h2>` in `text-h2`: "Admissions and education".
- With `mt-8`, a `<dl>` as the layout notes describe it, with five rows, oldest last. Each `<dt>` has `tabular-nums` and holds the year in a `<time>` (`<time dateTime="2026">2026</time>`), and each `<dd>` one line in `text-body`:
  - `2026`: Partner, Harrow & Vane LLP
  - `2019`: Higher rights of audience, civil proceedings
  - `2013`: Admitted as a solicitor in England and Wales
  - `2010`: Legal Practice Course, Wexcombe Law School
  - `2009`: LLB Law, University of Wexcombe

### 5. Recent matters

A section that is not a grid:

- An `<h2>` in `text-h2`: "Recent matters".
- With `mt-8`, a `<ul>` as a list of entries, three entries, each with `py-8`. Each `<li>` is also `md:grid md:grid-cols-12 md:items-baseline md:gap-x-8`, with three parts:
  - Columns 1–3 (`md:col-span-3`): a label line in `text-muted-foreground`, the year and the kind of claim, `2026 · Warranty claim`, with the year in a `<time>`.
  - Columns 4–10 (`md:col-span-7`), with `mt-2 md:mt-0`: a `<div>` holding the matter's name as an `<h3>` in `text-h2`, not a link, then with `mt-2` one sentence in `text-body`, at most `max-w-xl`, on what she did.
  - Columns 11–12 (`md:col-span-2`), with `mt-2 md:mt-0`: the value, a `<p>` in `font-mono text-label tabular-nums text-foreground` with `md:text-right`, and no `uppercase`, so a sum keeps its small `m`.

  Entries, in this order: "The sellers of Halden Print" (`2026 · Warranty claim`, `£3.4m`): led the defence of a buyer's warranty claim, struck out because its notice arrived one day after the contract's deadline. "Estley Mills v Brandreth Engineering" (`2026 · Trial`, `£6.2m`): with David Achterberg, won a claim for a textile mill after a nine-day trial. "Pellam Foods" (`2025 · Arbitration`, `£1.8m`): recovered the cost of a failed packaging contract for a food producer in an arbitration seated in Wexcombe.

### 6. Briefings by Ruth

A section that is not a grid:

- An `<h2>` in `text-h2`: "Briefings by Ruth".
- With `mt-8`, a `<ul>` as a list of entries, two entries, each with `py-8`. Each `<li>` is also `md:grid md:grid-cols-12 md:items-baseline md:gap-x-8`: in columns 1–3 (`md:col-span-3`) a label line in `text-muted-foreground` with the date as a `<time>` and the reading time, `10 November 2026 · 8 min read`; in columns 4–12 (`md:col-span-9`), with `mt-2 md:mt-0`, the title as an `<h3>` in `text-h2` holding a link, styled as a title that is a link.

  Entries, newest first: "Notice clauses after a sale: when a late letter ends a warranty claim" (10 November 2026, 8 min read, to `/insights/notice-clauses`); "Earn-outs that end in dispute" (17 September 2026, 6 min read, to `#`). At 768px the label lines here and in Recent matters wrap onto two lines in their three columns; that is fine.

### 7. Footer

The footer from the layout notes.

### On a phone

Every part is one column. The portrait is two thirds of the width, with the label line, the badge and the name under it. The contact rows keep their term and value side by side; the email address breaks if it has to. The note comes after the experience, 56px under it. Each matter and briefing stacks: label line, then name or title, then sentence, then value.

### Behavior

Nothing on this page has state. Links only.
