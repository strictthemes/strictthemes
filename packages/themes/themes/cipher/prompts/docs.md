---
page: documentation page
title: Docs page
description: one reference page of a command-line tool's docs, with a sidebar of pages, code blocks that copy, a table of flags, a note, an "on this page" list and links to the previous and next page.
order: 2
checks:
  - The sidebar marks the current page with `aria-current="page"` and an underline, not by color alone.
  - Every code block has a working "Copy" button that confirms the copy in words.
  - The "On this page" links jump to their headings and mark the one in view with `aria-current="location"`.
  - Below `lg` the page has one "Menu" button, and it opens the nav links and the sidebar's pages inside the header.
  - Code blocks and the flags table scroll sideways inside their own box at 375px, and the page does not.
---

Sample content, if the user gave none: the reference page for `plinth deploy` in the docs of **Plinth**, a command-line tool by Plinth Labs that deploys a web project from the terminal. The page says what the command does, shows its usage, lists its flags, gives two examples and lists its exit codes. The previous page is `plinth init`, the next `plinth logs`. Write the text yourself, short and exact.

Build these parts in order.

### 1. Header

The site header from the layout notes. The product's name and, after it, the label `docs` in `text-muted-foreground` share one element with `flex items-baseline gap-2`, which is the row's first item. Nav links, in order: Docs (`/docs`, the current part of the site: here `aria-current="true"` in place of `"page"`, with the same underline), Changelog (`/changelog`), Pricing (`#`). Action at the right end: an `outline` button-link "Open console" (`/deploys`). Below `lg`, not `md`, the row holds the name, the `docs` label and the "Menu" button. The menu holds the three nav links, then "Open console", then the sidebar's groups in the sidebar's order. The nav links and "Open console" are labels; the sidebar's links keep the sidebar's `text-body`, commands in `font-mono`, with the menu's `py-2`. Each group opens with its label, a `<p>` with `mt-4` in `font-mono text-label text-muted-foreground`, and its links follow in a `<ul>`, as in the sidebar, with no margin; `plinth deploy` has `aria-current="page"` there too, and Docs keeps its `aria-current="true"`. It is the page's only menu.

### 2. Page layout

Here `<main>` has no top padding, in place of the notes' `pt-12`. Its container is, from `lg` up, a 12-column grid; below `lg` only the content column shows.

- **Columns 1–3, the sidebar.** A `<nav>` with the `aria-label` "Docs", hidden below `lg`. It stays in view and scrolls on its own: `sticky top-0 max-h-svh self-start overflow-y-auto pt-6 pb-6`, with `-mx-1 px-1` so the box does not clip the links' focus outline.
- **Columns 4–12 (4–10 from `xl` up), the content.** It has `min-w-0` and `pt-6`.
- **Columns 11–12, on this page.** Shown from `xl` up only: `sticky top-0 self-start pt-6`.

### 3. Sidebar

Three groups, each a label in a `<p>` (not a heading) in `text-muted-foreground`, and under it with `mt-2` a list of links; the groups are `mt-6` apart. Each link is a block with `py-1` in `text-body`, styled as a sidebar link from the layout notes, and the list's items have no margin; links that are commands are in `font-mono`. A docs page's address is `/docs/` plus its group and name, lowercase with hyphens: this page is `/docs/commands/deploy`, the previous `/docs/commands/init`, `plinth.toml` `/docs/reference/plinth-toml`.

- **Get started:** Install, Quick start, Configuration.
- **Commands:** `plinth init`, `plinth deploy` (the current page), `plinth logs`, `plinth rollback`, `plinth env`.
- **Reference:** `plinth.toml`, Environment variables, Exit codes.

### 4. Content

In this order:

1. A breadcrumb as a label in a `<p>`, `text-muted-foreground`: `Commands / plinth deploy`.
2. With `mt-2`, the `<h1>`: `plinth deploy`.
3. With `mt-3`, one paragraph: what the command does.
4. Four sections, each opened by an `<h2>` with `mt-12`, an `id` and `scroll-mt-6`: Usage, Flags, Examples, Exit codes. The headings and blocks are siblings in the content column, with no `<section>` around them, so each `<h2>` keeps its `mt-12`. Inside a section the rhythm of the layout notes holds: `mt-3` from the heading to the text and between paragraphs, `mt-6` before and after a code block, the table and the note. Every paragraph keeps the notes' `max-w-lg`, the note's too, while code blocks, the table and the note run the full column: the uneven right edge is meant.

**Usage.** A paragraph, then a code block with the strip label `shell` holding `plinth deploy [path] [flags]`, then a paragraph that explains `path` with inline code.

**Flags.** One sentence, then the table, then the note.

- Add the component with `npx shadcn@latest add table`. The table fills a panel with rows that has no heading row of its own: the section's `<h2>` names it, and the `Table`'s `label` is "Flags of plinth deploy". Columns: Flag, Short, Default and Description. Flag, Short and Default are `font-mono`; an em dash, as the notes say, marks no value. The Description cells hold a sentence and get `whitespace-normal`. Give the `<table>` `min-w-xl`, so on a phone it scrolls rather than squeezes. Seven rows: `--env <name>` (`-e`, `preview`), `--prebuilt` (no short, `false`), `--message <text>` (`-m`, no default: the description says the commit's message is used), `--wait` (no short, `false`), `--yes` (`-y`, `false`), `--json` (no short, `false`), `--token <token>` (no short, `$PLINTH_TOKEN`).
- The note is an `<aside>`, a panel with `p-4` in place of `p-6`. Its first line is `flex items-center gap-2`, the `Info` icon and the label `note` in `text-foreground`. Under it, with `mt-2`, one or two sentences: `--yes` skips the confirmation before a production deploy, and a deploy run with no terminal attached, as in CI, needs it or stops with exit code 2.

**Examples.** A sentence, then a code block with the strip label `deploy a preview`, then with `mt-6` a sentence and a code block with the strip label `deploy to production and wait`. Each holds one command: `plinth deploy` and `plinth deploy --env production --wait --yes`. The shell blocks show no prompt sign. Lines that start with `#` are comments in `text-muted-foreground`; give the second block one comment line above the command.

**Exit codes.** With `mt-3` under the heading, a list without markers, its items `mt-2` apart. Each item is a line: the code as inline code, then the meaning in a few words of plain text, not `font-mono`. `0` the deploy is ready, `1` the build failed, `2` the deploy needs a confirmation, `3` the configuration is wrong, `4` it timed out while waiting.

**Previous and next.** At the end of the content, with `mt-12`, a `<nav>` with the `aria-label` "Previous and next" and a 1px top border, `pt-6`, holding two links in a row with `flex flex-wrap justify-between gap-6`. Each link is a block: a line with `flex items-center gap-2`, the label "Previous" or "Next" in `text-muted-foreground` beside the `ArrowLeft` or `ArrowRight` icon (the arrow before "Previous" and after "Next"), and under it, in a `<p>` with `mt-2`, the page's name in `font-heading text-h2 text-foreground`. The link has `group`, the name `underline-offset-4 group-hover:underline`. "Next" has `ml-auto text-right`, so it stays at the right end when the row wraps, and its icon line `justify-end`.

### 5. On this page

A `<nav>` with the `aria-label` "On this page". At its top, a label in a `<p>`, "On this page", in `text-muted-foreground`. Under it with `mt-2`, a list with one link per `<h2>` of the content (`#usage` and so on), the items `mt-2` apart. Each link is a label, `font-mono text-label`, `text-muted-foreground hover:text-foreground` with `transition-colors duration-150`.

### 6. Footer

The footer from the layout notes, with the links "Edit this page" (`#`), Changelog (`/changelog`) and Status (`#`).

### Behavior

- Mark the section in view in "On this page". Work it out from the headings' positions on scroll: the section in view is the last `<h2>` whose top is above a line one third of the way down the window, the first one before any is, and the last one when the page is scrolled to its end. The marked link is `text-foreground underline underline-offset-4` with `aria-current="location"`; the others keep their muted color and no underline.
- The "Copy" buttons work as the layout notes say, and copy the command without the comment lines.
- The "Menu" button works as the layout notes say, and the "On this page" links jump to their headings.
