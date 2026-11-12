---
page: settings page
title: API tokens
description: the deploy console's settings page for API tokens, with a table of tokens, a form that creates one and shows it once, and a way to revoke a token by typing its name.
order: 5
checks:
  - An empty, malformed or duplicate token name gets an error in words with an icon, tied to the field, and focus moves to the field.
  - A new token is shown once, in full, with a working "Copy" button; after "Done" it cannot be seen again, and the table shows only its first characters.
  - A revoke with a name that does not match shows an error and revokes nothing; with the exact name, the row is gone and a message is announced and focused.
  - The warning before revoking is said in words, not by the red color alone.
  - The new token wraps inside its box at 375px, and its expiry date shows in the table.
---

Sample content, if the user gave none: the console of **Plinth**, a deploy tool by Plinth Labs; team Orrin, project `orrin-web`, signed in as `mara.lind@orrin.example`. Today is the fixed sample date, 11 November 2026, not the clock. Four tokens to start: `ci-deploy` (scope `deploy:write`, created 14 Aug 2026, last used 11 Nov 2026, 09:12, expires never), `staging-bot` (`deploy:write`, created 2 Sep 2026, last used 10 Nov 2026, 17:40, expires 1 Dec 2026), `metrics-reader` (`read`, created 19 Sep 2026, last used 11 Nov 2026, 08:03, expires 19 Sep 2027) and `mara-laptop` (`admin`, created 30 Oct 2026, never used, expires 28 Jan 2027). A token is `plt_` followed by 32 letters and digits; invent one for each sample token.

Build these parts in order.

### 1. Console bar

The console bar from the layout notes. Nav links, in order: Deploys (`/deploys`), Domains (`#`), Logs (`#`), Settings (`/settings/tokens`, the current page).

### 2. Page header

The `<h1>` "Settings". No actions.

### 3. Settings links

Two columns from `lg` up, the full width below: a `<nav>` with the `aria-label` "Settings", holding a `<ul>` of five links styled as sidebar links from the layout notes, each a block with `py-1` in `text-body`, the items with no margin: General (`#`), Members (`#`), Domains (`#`), API tokens (`/settings/tokens`, the current page), Billing (`#`). Below `lg` the `<ul>` is a row, `flex flex-wrap gap-x-6 gap-y-2`. From `lg` up the `<nav>` stays in view (`lg:sticky lg:top-6 lg:self-start`).

### 4. API tokens

Ten columns from `lg` up, the full width below, with `min-w-0`. In this order:

1. An `<h2>` "API tokens", and with `mt-3` one paragraph (`max-w-lg`): tokens let scripts and CI run `plinth` as the team, read from `PLINTH_TOKEN`.
2. The status element for the message after a token is revoked, with no margin of its own. The message is a `<p>` inside it with `mt-3` and `tabIndex={-1}`.
3. With `mt-6`, the tokens panel.
4. With `mt-6`, the create panel.

### 5. Tokens panel

A panel with rows. Its heading row holds the label heading, here an `<h3>` "Tokens" (under the `<h2>` "API tokens"), in the label-heading classes, not the `<h3>` style, and at the right end the count as a small figure (`4 tokens`). Add the components with `npx shadcn@latest add table badge input`. The table's `label` is "API tokens"; give the `<table>` `min-w-2xl`. Columns:

- **Name:** `font-mono`. On the token created last in this visit, the signal badge "new" follows the name with `gap-2`: the page's one lime mark.
- **Token:** the first eight characters, `plt_` and four more, and an ellipsis (`plt_7Kq2…`), `font-mono text-muted-foreground`, never the whole token.
- **Scope:** `font-mono`, lowercase.
- **Created**, **Last used** and **Expires:** right-aligned, a `<time>` with a `dateTime` in `font-mono tabular-nums`; a token never used, or one that never expires, shows the word `never`. Each shows the date alone (`11 Nov 2026`): the time a token was last used goes in its `dateTime` and is not shown, so that the seven columns fit the panel at 1280px.
- A last column, right-aligned, whose header is a visually hidden "Actions": a `Button` in `variant="destructive"` with the button classes and `hover:text-foreground` added: red text on the stock hover tint is too faint. Its text is "Revoke", its `aria-label` "Revoke ci-deploy".

**Revoking.** "Revoke" opens a confirmation inside the same panel, under the table: a row with a 1px top border and `px-6 py-4`, holding a `<form>` with `noValidate` named by its first line through `aria-labelledby`. That line is a `<p>` in `font-mono font-bold`: `Revoke ci-deploy`. With `mt-3`, one sentence: scripts using this token stop working at once; this cannot be undone. With `mt-4`, the field "Type ci-deploy to confirm", at most `max-w-md` wide. With `mt-4`, a row with `gap-2`: a `destructive` button "Revoke token", `type="submit"`, with the `TriangleAlert` icon before its text and the same added hover, and an `outline` button "Cancel". One is open at a time; "Revoke" on another row moves it there.

### 6. Create panel

A padded panel. Its heading row holds the label heading, an `<h3>` "Create a token", styled as the "Tokens" one. With `mt-4`, one wrapper holding the form, then the `role="status"` element that replaces it, then the buttons after the message.

The form has `noValidate` and three fields, each at most `max-w-md` wide:

- "Name": an `Input` with helper text: lowercase letters, numbers and hyphens, up to 32 characters.
- "Scope": a `<select>` with `font-mono` and `read`, `deploy:write` and `admin`, starting on `deploy:write`, with helper text that says what the chosen scope can do and changes with it.
- "Expires": a `<select>` with `font-mono`, since its options are durations: 30 days, 90 days, 1 year and Never, starting on 90 days.

With `mt-6`, the default button "Create token", `type="submit"`.

When a token is made, the form goes. Inside the status element, in this order:

1. A `<p>` with `tabIndex={-1}`, which gets focus: `Token ci-preview created.`
2. With `mt-3`, one sentence: copy it now; it is shown once, Plinth keeps only a hash of it, and it expires on the date (a `<time>`, such as `9 Feb 2027`), or never.
3. With `mt-6`, the token in a `<code>` with `block break-all rounded-sm bg-muted px-2 py-1 font-mono text-body`. No border, so it is not a box in the panel; on a phone it wraps, not scrolls.

After the status element, in the wrapper and rendered only while a token is shown, a row with `mt-6` and `flex flex-wrap gap-2`: the "Copy" button from the code-block recipe (`outline`), which copies the token, here in the default size in place of `size="sm"`, so it is as tall as "Done"; and a `secondary` button "Done". Here, in place of the recipe's "beside it", the Copy button's hidden status is not in the row: it is the wrapper's last child, rendered at all times, so it is on the page before the first copy.

### Behavior

- All of it works in component state. "Create token" checks the name, with these errors: empty, "Enter a name for the token."; characters that are not allowed, "Use only lowercase letters, numbers and hyphens."; more than 32 characters, "Use 32 characters or fewer."; a name already in the table, "A token named ci-deploy already exists. Choose another name."
- A good name makes the token with `crypto.getRandomValues`, adds a row on top (created 11 Nov 2026, last used `never`, the expiry counted from that date: 30 and 90 days in days (11 Dec 2026, 9 Feb 2027), 1 year to the same date (11 Nov 2027), and the "new" badge), updates the count and shows the token. It is kept only until "Done".
- "Done" empties the status element, brings back an empty form and focuses the Name field; the whole token is gone for good.
- "Revoke" opens the confirmation and moves focus to its field. "Revoke token" is always enabled; when the field does not hold the token's name exactly, it shows the error "Type ci-deploy exactly to revoke this token." under the field. "Cancel" closes it and focuses that row's "Revoke".
- With the exact name, "Revoke token" removes the row, closes the confirmation, updates the count, puts `Token ci-deploy revoked.` in the status element under the paragraph and moves focus to it. With no tokens left, the count reads `0 tokens` and the table's body is one row, across all columns: "No tokens. Create one below."
- The "Menu" button works as the notes say; links need nothing more.
