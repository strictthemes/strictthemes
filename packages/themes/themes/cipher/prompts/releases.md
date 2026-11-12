---
page: changelog
title: Changelog
description: a command-line tool's changelog, with its releases newest first, the changes of each grouped by kind, a filter by kind and a badge on the latest release.
order: 3
checks:
  - Releases are listed newest first, each with its version in the mono font and its date in a `<time>` element with a `dateTime`.
  - Every group of changes names its kind in words (added, changed, fixed, removed), not by color.
  - Choosing a kind in the filter hides the changes of the other kinds and the releases left with none, and a count says how many releases are shown.
  - The "latest" badge is on the newest release only, is the page's one lime mark, and is not moved to another release when the filter hides that one.
  - At 375px each release's version and date sit above its changes and nothing scrolls sideways.
---

Sample content, if the user gave none: the changelog of **Plinth**, a command-line tool by Plinth Labs that deploys a web project from the terminal. Nine releases, newest first:

- `2.4.0`, 10 November 2026: preview deploys for every branch, `plinth deploy --wait`, faster uploads.
- `2.3.2`, 28 October 2026 and `2.3.1`, 21 October 2026: fixes only.
- `2.3.0`, 6 October 2026: `plinth env pull`; the old `plinth secrets` command removed.
- `2.2.1`, 22 September 2026; `2.2.0`, 8 September 2026; `2.1.0`, 18 August 2026; `2.0.1`, 4 August 2026.
- `2.0.0`, 21 July 2026: `plinth.toml` replaces `plinth.json`, which is no longer read.

Give each release two to six changes, one sentence each, the way a maintainer writes them: what changed and what it means for the user, with commands, flags and file names as inline code. Every kind appears in at least two releases; `removed` only in `2.3.0` and `2.0.0`.

Build these parts in order.

### 1. Header

The site header from the layout notes. Nav links, in order: Docs (`/docs`), Changelog (`/changelog`, the current page), Pricing (`#`). Action at the right end: an `outline` button-link "Open console" (`/deploys`). Below `md` the row holds the name and the "Menu" button; the menu holds the nav links and "Open console".

### 2. Page heading

Inside the container, at most `max-w-lg` wide: the `<h1>` "Changelog", and with `mt-3` one sentence: every release of the `plinth` command line, newest first, and how to update, with `plinth` and `plinth upgrade` both as inline code.

### 3. Filter

With `mt-6`, a row with `flex flex-wrap items-center gap-x-6 gap-y-3`:

- A button group with the `aria-label` "Filter by kind": All, Added, Changed, Fixed, Removed. Their text is in sentence case, as button text is; the group headings below print the kind lowercase, as the tool does. All is chosen at the start.
- A small figure with `aria-live="polite"`: `9 releases` while All is chosen, and `4 of 9 releases` when a kind leaves four.

### 4. Releases

Add the badge with `npx shadcn@latest add badge`. With `mt-12`, an `<ol>` with no markers and no padding. Each release is an `<li>` holding an `<article>`. The `<li>` has a 1px `border-t border-border` and `pt-6`, and every one but the first shown also `mt-12` (decide it by the position in the filtered list); the `<article>` has no margin, padding or border.

The `<article>` is a 12-column grid that is a single column below `lg`:

- **Columns 1–3, about the release.** The version as an `<h2>` in `text-h2`, with an `id` such as `v2-4-0` and a `v` before the number (`v2.4.0`). With `mt-2`, a `<p>` holding the date as a small figure, a `<time>` with a `dateTime` (`10 Nov 2026`). On the newest release only, with `mt-3`, a `<p>` holding the signal badge "latest": the page's one lime mark. Below `lg` this part sits above the changes, `gap-6` from them.
- **Columns 4–12, the changes,** at most `max-w-lg` wide. One group per kind that the release has, in the order added, changed, fixed, removed, the groups `mt-6` apart; the first group shown has no top margin, also when the filter leaves only one. Each group is an `<h3>` with the kind in words, lowercase (`added`), as a label: `font-mono text-label text-muted-foreground` in place of the usual `<h3>` style. Under it, with `mt-2`, a `<ul>` with `list-disc pl-4`, its items `mt-2` apart, each one change in `text-body`. No colored bars, no icons for the kinds: the word is the kind.

The badge is for the newest release overall, not the newest one shown. When the filter hides `2.4.0`, no badge shows, and none moves to another release.

### 5. Footer

The footer from the layout notes, with the links Docs (`/docs`), Status (`#`) and "RSS feed" (`#`).

### Behavior

- The releases come from one array in the code, each with its version, date and changes; each change has a kind.
- Choosing a kind shows, in every release, only that kind's group, and hides the releases that have none of it. All shows everything. The chosen button carries `aria-pressed="true"`.
- The count updates with the filter. Every kind leaves at least one release, so the list is never empty.
- The filter keeps the order newest first, and a hidden release is removed from the page, not only from view, so its heading does not stay in the headings list.
- Choosing a kind does not move focus.
