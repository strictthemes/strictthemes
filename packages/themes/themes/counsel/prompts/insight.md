---
page: legal briefing article
title: Insight
description: a long-read briefing from a commercial law firm, with a summary box, a list of its sections, four headed sections with a pull quote and numbered points, the author and related briefings.
order: 4
checks:
  - "The briefing is inside an `<article>` with one `<h1>`; its four `<h2>` sections each have an `id`, and each link in On this page jumps to its heading."
  - "The running text sits in columns 1–7 from `md` up, at most `max-w-xl` wide, with the list of sections in columns 9–12 and the columns between empty; on a phone the list of sections comes before the text."
  - "The summary box is the only card in the article, with a pale grey fill, 4px corners and no border or shadow, and the pull quote is set in the heading font, upright, with a 1px rule at its left."
  - "The page has exactly one badge, New, and nothing else on the page is `bg-tertiary`; there is exactly one default (navy) button, Discuss this with Ruth."
  - "No heading or text on the page is bold or italic, the article names no real case, court ruling, statute or firm, and nothing on the page is round."
---

Sample firm, if the user gave none: **Harrow & Vane LLP**, an invented commercial law firm in Wexcombe, an invented English city, founded in 1952, with 14 partners and 86 lawyers in one office at 4 Chancery Row, Wexcombe WX1 2LN. This page is a briefing by **Ruth Calloway**, a partner in its Commercial disputes team, published on 10 November 2026, an 8 minute read: "Notice clauses after a sale: when a late letter ends a warranty claim". Its subject: a buyer of a company who finds a problem after completion usually has a warranty claim against the sellers, but the sale contract says how, to whom and by when the buyer must give notice of it, and a notice that misses one of those terms can end the claim before its merits are heard. Its example is a claim the firm defended this year for the sellers of Halden Print, an invented printing company: a £3.4m warranty claim, struck out because the buyer's notice arrived one day after the contract's deadline. Write the full text yourself, 1,000 to 1,200 words of running text (the paragraphs, the two numbered lists and the pull quote count; In brief does not), in the first person plural ("we"), plain and exact, as a careful letter to a client reads. Name no real case, judge, court ruling, statute or section of one, and no real firm or person: speak of "the contract", "the court" and "the buyer". Every name is invented.

Build these parts in order. An `<article>` inside `<main>` wraps the first two sections, the opening and the briefing; the sections after it are siblings of the `<article>`, and keep the section margins and hairlines of the layout notes.

### 1. Header

The header from the layout notes. "Insights" is the current page, in the header and in the footer.

### 2. Opening

The first section, in the grid:

- A row in columns 1–12 (`md:col-span-12`), a `<div>` with `flex flex-wrap items-center gap-x-4 gap-y-2`: a label line in `text-muted-foreground`, `Briefing · Commercial disputes`, and beside it the page's one badge, "New".
- With `mt-4`, the `<h1>` in `text-h1 md:text-display`, columns 1–10 (`md:col-span-10`): "Notice clauses after a sale: when a late letter ends a warranty claim". It runs over three lines on a large screen, and that is fine.
- With `mt-8`, the standfirst: a `<p>` in `font-heading text-h2` in columns 1–8 (`md:col-start-1 md:col-span-8`, which overlap the `<h1>`'s, so it starts a row under it), two sentences. Sample: "A buyer can have a good claim and still lose it to the calendar. Before anyone argues about the accounts, the contract asks whether the notice was right."
- With `mt-8`, in columns 1–8 (`md:col-start-1 md:col-span-8`), a label line in `text-muted-foreground`: `By Ruth Calloway · 10 November 2026 · 8 min read`. "Ruth Calloway" is a link to `/people/ruth-calloway`, styled as a link in running text and kept in `text-foreground`; the date is a `<time dateTime="2026-11-10">`.

### 3. The briefing

A section in the grid, with two parts. The list of sections comes first in the code, so that on a phone it stands above the text; from `md` up both parts have `md:row-start-1`, so the text takes columns 1–7 and the list sits at the right of its first lines.

**On this page**, in columns 9–12 (`md:col-start-9 md:col-span-4 md:row-start-1`): a `<nav>` with `aria-labelledby` naming its label heading, and no `aria-label`:

- A label heading "On this page", an `<h2>` with an `id`.
- With `mt-4`, an `<ol>` with `list-none`, no padding, `mt-2` between items, holding four links in `text-body`, styled as titles that are links, one for each `<h2>` of the text below, with the same words.

**The text**, in columns 1–7 (`md:col-span-7 md:row-start-1`), with `mt-14 md:mt-0`: one `<div>` in normal block flow. Every paragraph, list, the In brief card and the pull quote's `<blockquote>` is at most `max-w-xl`, so their right edges line up. Inside it, in this order:

- **In brief:** a card from the layout notes, a `<div>` with no top margin. A label heading "In brief", an `<h2>`, then with `mt-4` a `<ul>` with `list-disc pl-4` and `mt-2` between items, three sentences in `text-body`: notice clauses set the form, the recipient and the deadline of a claim; a court reads them strictly, and one day late can be too late; check the clause and serve early, with the facts you have.
- With `mt-8`, two opening paragraphs in `text-body`, the second with `mt-4`.
- **Four `<h2>` sections**, each `<h2>` in `text-h2` with `mt-14`, an `id` and `scroll-mt-8`, and the text under it with `mt-4`. Paragraphs follow each other with `mt-4`. A list, the pull quote, or a paragraph that follows a list or the pull quote has `mt-8`. The headings, in this order:
  1. "What a notice clause asks for" (`id="asks"`): two or three paragraphs on what such a clause usually requires (writing, the right address, reasonable detail of the claim, a last day).
  2. "Three ways a notice fails" (`id="fails"`): one paragraph, then with `mt-8` a numbered list (`list-decimal pl-8`, `mt-2` between items) of three items of one or two sentences each: sent too late; sent to the wrong person or address; too thin to say what the claim is. Then with `mt-8` the pull quote, then one more paragraph.
  3. "A claim lost by a day" (`id="a-day"`): two or three paragraphs on the Halden Print claim: the contract's deadline, the letter sent by courier on the last day and signed for the next morning, and the court's decision to strike the claim out. The sum (£3.4m) and the dates are written in the sentences as plain text.
  4. "What to do before you send" (`id="before"`): one paragraph, then with `mt-8` a numbered list (`list-decimal pl-8`, `mt-2` between items) of four steps of one sentence each, then with `mt-8` a closing paragraph.
- **The pull quote:** a `<blockquote>` with `border-l border-border pl-8`, holding one `<p>` in `font-heading text-h2`: one or two sentences that also stand, word for word, in a paragraph of this briefing, with no quotation marks, upright. Sample: "Most warranty claims are argued over the accounts. Some are lost in the post room first." No name under it: it is the briefing's own words.
- With `mt-8`, after the closing paragraph, one line of small print: a `<p>` in `font-mono text-label text-muted-foreground`, a sentence, not uppercased: "This briefing is general information and is not advice on any particular matter."

### 4. About the author

A section in the grid, with two parts:

- **The portrait**, in columns 1–2 (`md:col-span-2`): a portrait from the layout notes with the initials `RC`, and the `aria-label` "Ruth Calloway in a dark suit, at a window of the firm's library". On a phone it is a third of the width: write `w-1/3 md:w-full` in place of the notes' `w-full`.
- **The text**, in columns 4–10 (`md:col-start-4 md:col-span-7`), with `mt-8 md:mt-0`, a `<div>` in this order: a label heading "About the author", an `<h2>`; with `mt-4` the name as an `<h3>` in `text-h2` holding a link to `/people/ruth-calloway`, styled as a name that is a link; with `mt-2` a label line in `text-muted-foreground`, `Partner · Commercial disputes`; with `mt-4` two sentences in `text-body`, at most `max-w-xl`, on the disputes she handles; with `mt-8` a `<div>` holding the default button "Discuss this with Ruth", an `<a>` styled with `buttonVariants` and the Buttons classes, to `/contact`. The page's one default button.

### 5. Related briefings

A section that is not a grid:

- An `<h2>` in `text-h2`: "Related briefings".
- With `mt-8`, a `<ul>` as a list of entries, three entries, each with `py-8`. Each `<li>` is also `md:grid md:grid-cols-12 md:items-baseline md:gap-x-8`: in columns 1–3 (`md:col-span-3`) a label line in `text-muted-foreground` with the date as a `<time>` and the reading time, `29 October 2026 · 6 min read`; in columns 4–12 (`md:col-span-9`), with `mt-2 md:mt-0`, the title as an `<h3>` in `text-h2` holding a link to `#`, styled as a title that is a link, then with `mt-2` a label line in `text-muted-foreground` with the author and the practice area, `David Achterberg · Commercial disputes`.

  Entries, newest first: "Freezing orders: the first forty-eight hours" (29 October 2026, 6 min read, David Achterberg, Commercial disputes); "Break clauses in a commercial lease: getting the notice right" (1 October 2026, 5 min read, Thomas Kerridge, Real estate); "Earn-outs that end in dispute" (17 September 2026, 6 min read, Ruth Calloway, Commercial disputes).
- With `mt-8`, an onward link from the layout notes: "All briefings", to `#`.

### 6. Footer

The footer from the layout notes.

### On a phone

Every part is one column. The `<h1>` is `text-h1` and wraps over five or six lines; the standfirst follows it. The list of sections comes before the text, which starts 56px under it with the In brief card. The portrait is a third of the width, with the author's text under it. Each related briefing stacks: label line, title, then author.

### Behavior

- The links in On this page jump to their headings; `scroll-mt-8` keeps each heading clear of the top edge.
- Nothing else has state. Links only.
