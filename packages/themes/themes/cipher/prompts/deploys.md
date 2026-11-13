---
page: deploys list
title: Deploys
description: the deploy console's list of deployments, with filters, a table of commits, branches, environments, states, durations and times, and the log of the selected deployment.
order: 4
checks:
  - Every state in the table is a dot and a lowercase word, never a color alone.
  - The branch search, the environment filter and the state filter work together, a count says how many deployments match, and an empty result shows a message and a way to clear the filters.
  - Choosing a deployment's commit hash shows its log in the log panel, whose lines do not wrap, and the chosen row is marked by more than its background.
  - Commit hashes, branches, durations and times are in the mono font, and durations and times are right-aligned.
  - The one lime mark is the "live" badge on the deployment that serves production.
  - 'The state filter is the theme''s `Select` in the mono font, with no native `<select>` on the page: its list opens under its trigger in the theme''s colors, the chosen row has a check, and the arrow keys, Enter and Escape work in it.'
---

Sample content, if the user gave none: the console of **Plinth**, a deploy tool by Plinth Labs. The team is Orrin and the project `orrin-web`; the signed-in person is `mara.lind@orrin.example`. Invent 20 deployments over the last three days, the newest on 11 November 2026, the sample's fixed today (no clock): commits as seven-character hashes (`8f3c2a1`) with a one-line message, branches (`main`, `feat/search`, `fix/cart-total`, `chore/deps`), environments `production` (always from `main`) and `preview` (all other branches). States: one `queued` (the newest), one `building` (the one before it), two `failed`, one `canceled`, the rest `ready`. Durations from `38s` to `3m 12s`. A production deployment is served at `https://orrin.example`, a preview at the branch name with `/` as `-` before `.orrin-web.plinth.example` (`https://feat-search.orrin-web.plinth.example`).

Build these parts in order.

### 1. Console bar

The console bar from the layout notes. Nav links, in order: Deploys (`/deploys`, the current page), Domains (`#`), Logs (`#`), Settings (`/settings/tokens`).

### 2. Page header

The `<h1>` "Deploys". The action is the default button "Deploy main".

### 3. Filters

A panel spanning twelve columns, with no heading row; the panel element itself is the row, `flex flex-wrap items-end gap-6`. Add the components with `npx shadcn@latest add input select table badge`.

- A search field with the visible label "Branch" and the placeholder "main, feat/…", in a wrapper with `w-64`, full width below `md`. It matches any part of the branch name, ignoring case.
- The environment filter: a visible label "Environment" (a `<p>` styled as a field label, since a `<label>` cannot name a group), and with `mt-2` a button group with All, Production and Preview. Here the group's name comes from the `<p>` through `aria-labelledby`, in place of the notes' `aria-label`.
- The state filter: a labelled `Select` "State" in `font-mono`, with All states, `ready`, `building`, `queued`, `failed` and `canceled`, in a wrapper with `w-48`.
- At the right end (`ml-auto`), an `outline` button "Clear filters", disabled while no filter is set.

### 4. Deployments

A panel with rows spanning twelve columns. Its heading row holds the label heading `Deployments` and, at the right end, a small figure with `aria-live="polite"`: `20 deployments`, or `6 of 20` when filters are set (`0 of 20` when none match).

The table's `label` is "Deployments". Give the `<table>` `min-w-4xl`. Columns:

- **Commit:** the hash as a `<button>` in `font-mono`, styled as a text link, with the `aria-label` "Show log of 8f3c2a1". It is what selects the row.
- **Message:** the commit message, with `whitespace-normal`.
- **Branch:** `font-mono`.
- **Environment:** the word, lowercase, in the body font, as the State column's word is. On the newest `ready` deployment to `production`, the signal badge "live" follows the word, with `gap-2`: the page's one lime mark.
- **State:** a state from the layout notes: `ready` passed, `failed` failed, `building` under way, `queued` and `canceled` waiting or stopped.
- **Duration:** right-aligned, `font-mono tabular-nums`. A queued deployment shows an em dash, `—`, with `aria-hidden="true"` and "not started" in a visually hidden span after it; the building one an em dash with "not finished" hidden the same way; a canceled one the time it ran before it was canceled.
- **Created:** right-aligned, a `<time>` with a `dateTime` in `font-mono tabular-nums` (`11 Nov 2026, 14:05`).

The selected row has `data-state="selected"` and `data-[state=selected]:bg-secondary/10`: the stock fill for a selected row cannot be told from the panel in dark mode. Its hash button has `aria-pressed="true"` and is `font-bold text-foreground no-underline`, so the mark is more than a color; the others have `aria-pressed="false"`.

When nothing matches, the table's body is one row with one cell across all columns, `whitespace-normal px-6 py-6`: the sentence "No deployments match these filters." and, with `mt-3`, an `outline` button "Clear filters".

### 5. Log

A panel with rows spanning twelve columns, under the table. Its heading row holds the label heading `Log` and, at the right end, a small figure naming the deployment: `8f3c2a1 · production · ready`. It is not a live region: the count above is the page's one, and the hash buttons' `aria-pressed` tells which log shows.

Under the heading row, the log: a `<div>` that scrolls on its own, both ways: `max-h-96 overflow-auto py-3`, with `tabIndex={0}`, `role="region"`, the `aria-label` "Log of 8f3c2a1" and the focus outline drawn inside it. It holds an `<ol>` with no markers and no padding, `w-max min-w-full`, so that each line is as wide as the longest and keeps its right padding at the scroll end. The lines have no margin between them, in place of the notes' `mt-2` for list items. Each line is an `<li>` with `flex gap-3 px-6 font-mono text-label whitespace-pre`: the time as a small figure in a `<time>` (`14:05:12`), then the text in `text-foreground`. Lines do not wrap; on a phone the box scrolls sideways.

Write 8 to 12 lines for each `ready`, `failed` or `canceled` deployment from its data: cloning the commit, installing, building, uploading, then the end. A `ready` deployment ends with a line whose first word, `ready`, is `text-success`, followed by the address and the time taken. A `failed` one has a line starting with the word `error`, in `text-destructive`, then the reason, and ends with `failed: build exited with code 1`, the word `failed` in `text-destructive`. A `building` one ends at its last line so far; a `queued` one has the single line `queued behind 1 deployment`; a `canceled` one ends with `canceled by mara.lind`.

### Behavior

- All of it works on the sample data in component state.
- The table is sorted by Created, newest first. The `building` deployment, the second row, is selected at the start.
- The three filters work together. "Clear filters" empties the search, chooses All and All states, and moves focus to the search field.
- If the selected deployment is filtered out, the first row shown is selected; when rows show again after none did, the first row shown is selected. Clearing the filters keeps the selection as it is. When no row is shown, the log panel's figure reads `No deployment selected`, the box's `aria-label` is "Log", and in place of the `<ol>` it holds a `<p>` in `text-body` with `px-6`: "No deployment matches these filters, so no log is shown."
- Choosing a hash selects the row and shows its log; focus stays on the button.
- The "Menu" button works as the layout notes say. "Deploy main" and the links need no other behavior.
