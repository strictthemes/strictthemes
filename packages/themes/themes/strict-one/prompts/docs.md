---
page: documentation page
title: Documentation page
description: a documentation page with a sidebar, the content, and an "on this page" list.
order: 4
checks:
  - The page has exactly one "Menu" button below `lg`, and it opens the search, the header links and the sidebar.
  - The sidebar marks the current page with `aria-current="page"`, and the mark is visible without relying on color alone.
  - Every code block has a working "Copy" button that confirms the copy in text.
  - The "on this page" links jump to their headings and mark the one in view.
  - The "Menu" button and the sheet it opens work with the keyboard.
  - Code blocks and tables scroll sideways inside their own box on small screens.
---

Sample content, if the user gave none: the "Authentication" page of the **Plainsheet API** docs. It explains API keys, shows a request with a key, lists the parameters of the "create key" endpoint, and describes the errors. Write the full text yourself, short and exact, the way good reference docs read.

Build these parts.

### 1. Header

A single row with a 1px bottom border: the product name in `font-heading text-h2` with a `DOCS` label in `text-muted-foreground` beside it, the two in a `flex items-baseline gap-2`, then label links, Guides, API and Changelog, none of them the current page and each pointing to `#`, and a search `Input` with the placeholder "Search the docs", `w-64` at the row's right end (`ml-auto`). In the sheet the field keeps the stock `w-full`. The search only needs to filter the sidebar links as the user types. Below `lg` the row holds only the product name, the `DOCS` label and a "Menu" button. The row's gap switches with that layout: `gap-4` below `lg`, `gap-8` from `lg` up, here instead of the notes' `md`. The header and the footer run across the whole window, above and below the three columns, so both lines are full width.

### 2. Page layout

From `lg` up (not `md`, as on other pages), a 12-column grid with `gap-x-8`. Each of its three columns has `pt-8`, and the content column ends with `pb-16`:

- **Columns 1–3, sidebar.** A `<nav>` with an `aria-label` and three groups, each under a group name that is a label in a `<p>`, not a heading (for example Get started, API, Guides), with four to six links in `text-body`, each pointing to `#`. Every link is a block with a 2px left line (`border-l-2`) and `pl-4`. The link for the current page, Authentication, has `aria-current="page"`, `font-medium` and a `border-foreground` line; the other links have a transparent line, so the text stays aligned. The sidebar stays in view and scrolls on its own if it is taller than the screen: `sticky top-0 max-h-svh self-start overflow-y-auto pb-8`, with the `pt-8` inside it, and `-mx-1 px-1` so the scroll box does not clip the links' focus outline.
- **Columns 4–9, content.**
- **Columns 10–12, on this page.** A label heading "ON THIS PAGE" in `text-foreground` and one label link per `<h2>` of the content, each a block with a 2px left line (`border-l-2`) and `pl-4`. `sticky top-0 self-start`, with the `pt-8` inside it. Hidden below `xl`; the content takes columns 4–12 then, and its text keeps to the measure.

Below `lg`, the header's "Menu" button opens a `Sheet` from the left that holds the search, the header links and the sidebar, in that order, `gap-8` apart in the sheet's one wrapper. In the sheet the sidebar keeps its groups and link lines but drops `sticky top-0 max-h-svh self-start overflow-y-auto pb-8`, its `pt-8` and `-mx-1 px-1`: the sheet is the scroll box. This is the page's only menu.

### 3. Content

In this order:

1. A breadcrumb as a label, plain text in a `<p>` in `text-muted-foreground`: `API / AUTHENTICATION`.
2. With `mt-2`, the `<h1>` in `text-h1`.
3. With `mt-4`, a lead paragraph in `font-sans text-h2 font-normal`, at most `max-w-xl` wide: it is in `text-h2`, not body text, so the notes' `max-w-lg` measure does not apply to it.
4. Four sections, each opened by an `<h2>` in `text-h2` with `mt-16`, not the `01 / NAME` section header of other pages. Give every `<h2>` an `id` and `scroll-mt-8`. Inside a section: `mt-4` between paragraphs, `space-y-2` between list items, and `my-8` around a code block, a note or a table.

Across the sections, include each of these at least once:

- **Code block:** a `bg-card` panel in `font-mono text-body`. A header strip with `px-4 py-2`, a 1px bottom border, a label naming the language or file (`CURL`, `RESPONSE`), and on the right a "Copy" `Button` in the `outline` variant. Under the strip, a `<pre>` with `p-4` and `overflow-x-auto` is the scroll box: it takes `tabIndex={0}`, `role="region"` and an `aria-label` ("cURL request"), and the strip stays put. After a copy, the button reads "Copied" for about two seconds; if the copy fails, it reads "Copy failed" for as long. A screen reader hears it from one visually hidden `role="status"` element in the strip that holds the same words for those two seconds and is empty otherwise; the button itself carries no `aria-live`.
- **Note:** a panel with a `border-foreground` border and `p-4`, a label reading `NOTE`, and one or two sentences. No colored background and no icon.
- **Parameters table:** columns Name, Type, Required and Description. Names and types in `font-mono`. Label-style header cells, 1px row borders. The section's `<h2>` names it, and its words are the table's `label`.
- **Inline code:** `font-mono` on `bg-card` with `px-1` and `rounded-sm`.
- **A numbered list** of steps.

5. At the end, with `mt-16`, a 1px top border, `pt-8` and two links side by side in a `flex justify-between gap-4`, each a `group flex flex-col gap-2` block pointing to `#`: "Previous" on the left and "Next" on the right, with `ml-auto text-right`. Each has a label ("PREVIOUS", "NEXT") in `text-muted-foreground` above the page title in `font-heading text-h2 text-foreground`, which is underlined while the link is hovered (`group-hover:underline underline-offset-4`); here, instead of the notes' style for a text link, neither is `text-primary`.

### 4. Footer

A footer with `py-8` and a 1px top border, holding one line: a label with the copyright on the left and "Edit this page", a text link in `text-body`, on the right.

### Behavior

- Mark the section in view in "on this page". Work it out from the headings' positions on scroll: the section in view is the last `<h2>` whose top is above a line one third of the way down the window, the first one before any is, and the last one when the page is scrolled to its end. An `IntersectionObserver` on the headings alone misses jumps. The marked link is `text-foreground` with a `border-foreground` left line and `aria-current="location"`; the rest are `text-muted-foreground` with a transparent line.
- The search filters sidebar links by their text and shows "No pages match" when nothing is left. The header's field and the sheet's share one value.
- Copying uses `navigator.clipboard`.
