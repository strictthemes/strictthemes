---
page: landing page
title: Landing page
description: the website of a command-line deploy tool, with the install command, a terminal session, its features, a config example and a closing call to action.
order: 1
checks:
  - The install command sits in a code block whose "Copy" button copies the command alone and says "Copied" in words.
  - The terminal session is real text in the mono font, drawn from plain elements, with no window dots, no typed-out animation and no blinking cursor.
  - Acid lime appears once on the page, as the badge in the opening, and is never a text color.
  - The opening's heading is the page's only `<h1>` and its only `text-display` text.
  - At 375px the install command, the terminal's long lines and the config file scroll inside their own boxes, and the page does not.
tested:
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      First run of this page, on briefs revised after another page of the theme was built. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,444 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 6 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems the earlier test builds reported. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,604 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 5 minor problems with the brief and none blocking; they are not fixed.
  - tool: Claude Code
    model: Claude Opus 5.5
    date: "2026-11-11"
    result: >-
      Run on the prompt as revised after the problems that were still open. A fresh agent built the page in a new project with the theme installed. The build passed. Strict Check passed at 100% of 2,550 measured values, with no errors and no warnings, in light and dark mode at 1280px and 375px. Looked at in a browser at 1280px in light mode. The agent reported 4 minor problems with the brief and none blocking; they are not fixed.
---

Sample content, if the user gave none: **Plinth**, a command-line tool that deploys a web project from the terminal: `plinth deploy` builds the current commit, uploads it and prints the address. Every branch gets a preview address; `main` goes to production. It is made by Plinth Labs, and the latest version is `2.4.0`, released on 10 November 2026, which added preview deploys for every branch. The install command is `curl -fsSL https://plinth.example/install.sh | sh`. The sample project is `orrin-web`. Write the rest of the copy yourself, plain and exact, the way a good tool's README reads.

Build these parts in order.

### 1. Header

The site header from the layout notes. Nav links, in order: Docs (`/docs`), Changelog (`/changelog`), Pricing (`#`); none is current on this page. Actions at the right end: a header link "Sign in" (`#`), a label in the header-link style, and an `outline` button-link "Open console" (`/deploys`). Below `md` the row holds only the product's name and the "Menu" button (the nav and the actions are hidden there); the menu holds the three nav links, "Sign in" and "Open console", as links.

### 2. Opening

A `<section>`, inside the container, as a 12-column grid that is a single column below `lg`. No top margin: `<main>`'s `pt-12` gives the space above it.

- **Columns 1–7, the text.** First a line, `flex flex-wrap items-center gap-2`: the signal badge, "new" (add it with `npx shadcn@latest add badge`), and a text link to `/changelog`, "`2.4.0`: a preview for every branch", with the version in `font-mono`. This badge is the page's one lime mark. Then, with `mt-6`, the `<h1>`, in `text-display` from `md` up and `text-h1` below. Sample: "Deploy from the terminal you already have open". Then, with `mt-3`, one paragraph of two sentences. Then, with `mt-6`, the install command as a code block from the layout notes: the strip's label is `install`, and the `<pre>` holds the one command with no prompt sign. On a phone the command is wider than the box and scrolls in it. Then, with `mt-6`, a row with `gap-3` that wraps: the default button-link "Get started" (`/docs/get-started/quick-start`) and a text link "See every command" (`/docs/commands/deploy`).
- **Columns 8–12, the terminal.** A `<figure>` built like a code block, with no Copy button: the strip holds the `<figcaption>` `~/orrin-web` on the left and, on the right, a `<p>` `zsh` in `font-mono text-label text-muted-foreground`. No dots for close and minimise, no title bar of any other kind. Under the strip, the session: a `<pre>` with `overflow-x-auto p-4 font-mono text-label`, scrolling sideways in its own box as a code block does (`tabIndex={0}`, `role="region"`, the `aria-label` "Terminal session", the outline drawn inside). Its lines, one per line of the `<pre>`:

  ```
  $ plinth deploy
    reading plinth.toml
    building orrin-web  commit 8f3c2a1  branch feat/search
    uploading 214 files  4.1 MB
    ready  https://feat-search.orrin-web.plinth.example  in 38s
  $
  ```

  The `$` signs are `text-muted-foreground`. The command after the first `$` is `text-foreground`. The three output lines are `text-muted-foreground`. On the `ready` line the word `ready` is `text-success`, the address `text-foreground` and `in 38s` `text-muted-foreground`. After the last `$` and a space, the cursor: a `<span>` with `inline-block h-3 w-2 bg-primary align-middle` and `aria-hidden="true"`. It does not blink. The `<figcaption>` is the figure's only caption.

On a phone the terminal comes under the text, `gap-6` from it, at full width.

### 3. Features

A `<section>` with `mt-12`, a 1px `border-t border-border` and `pt-12`. First a label, `features`, in `text-muted-foreground`. Then, with `mt-2`, the `<h2>`: "What it does between commit and address". Then, with `mt-6`, a 12-column grid: four features, each three columns from `lg` up, six from `md` to `lg`, and the full width below `md`. No cards and no panels. Each feature is a `<div>` with a 1px `border-t border-border` and `pt-4`, holding:

- An icon: `GitBranch`, `Undo2`, `KeyRound` and `ScrollText`.
- With `mt-3`, an `<h3>`: "A preview for every branch", "Roll back in one command", "Secrets outside the repo", "Logs as they happen".
- With `mt-3`, a paragraph of one or two sentences that names the command as inline code: `plinth deploy`, `plinth rollback`, `plinth env set`, `plinth logs --follow`.

### 4. Configuration

A `<section>` with `mt-12`, a 1px `border-t border-border` and `pt-12`, as a 12-column grid that is a single column below `lg`.

- **Columns 1–5:** the label `configuration`, then with `mt-2` the `<h2>` "One file, checked in next to your code", then with `mt-3` a paragraph saying that `plinth.toml` names the build command, the output folder and which branch goes where, and that `plinth init` writes it.
- **Columns 6–12:** a code block with the strip label `plinth.toml` and a "Copy" button, holding:

  ```toml
  # plinth.toml
  name = "orrin-web"
  build = "npm run build"
  output = "dist"

  [env.production]
  branch = "main"
  domain = "orrin.example"

  [env.preview]
  branch = "*"
  ```

  The comment is `text-muted-foreground`. The keys (`name`, `build`, `output`, `branch`, `domain`) are `text-primary`. The section names in brackets, the `=` signs and the values are `text-foreground`.

### 5. Closing call to action

A `<section>` with `mt-12`, a 1px `border-t border-border` and `pt-12`, left-aligned. The `<h2>` and the sentence each have `max-w-lg`; the row of buttons does not. The `<h2>` "Your next commit can be live in a minute", with `mt-3` one sentence, and with `mt-6` a row with `gap-3` that wraps: the default button-link "Get started", to the same address as the opening's, and a `secondary` button-link "Open console". Here, in place of the notes' one default button per screen, the page has two, the opening's and this one, with the features and the configuration between them.

### 6. Footer

The footer from the layout notes, with the links Docs (`/docs`), Changelog (`/changelog`) and Status (`#`).

### Behavior

- The "Copy" buttons work as the layout notes say. The install block copies `curl -fsSL https://plinth.example/install.sh | sh` exactly.
- The "Menu" button opens and closes the menu, with `aria-expanded`, and Escape closes it.
- Nothing on the page moves by itself: the terminal is shown complete, as it stands after the deploy.
