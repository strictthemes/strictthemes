# The Strict agent kit

Blocks for the agent's side of a conversation: what it called, what it asks
leave for, what it is writing, and what it read. React, on Base UI and
Tailwind CSS v4. Each block is one file that lands in the project and is the
project's to change. There is no library to install.

| Block | File | What it shows |
|---|---|---|
| Tool call | `blocks/tool-call.tsx` | One call an agent made to a tool: its name, whether it is running, done or failed, and on demand what went in and what came back. |
| Approval | `blocks/approval.tsx` | A request to do something the agent may not do on its own: what will happen, the exact command, and buttons to allow or deny it. The answer stays on screen. |
| Stream | `blocks/stream.tsx` | An answer that is still being written: the text so far with a caret, a line that says the agent is working, and a button to stop it. |
| Citations | `blocks/citations.tsx` | A numbered marker for running text and the list of sources it points at. |

The blocks keep no state beyond open and closed. The code around them says
whether a call is running, whether a request was allowed, and what the answer
is so far.

## Install

The kit is served from the registry on strictthemes.com, written out once for
each theme. Name the theme first, so the command fills in its colors:

```bash
npx shadcn@latest add https://strictthemes.com/r/kiln.json https://strictthemes.com/r/kiln-agent-kit.json
```

One block alone is `kiln-agent-tool-call`, `kiln-agent-approval`,
`kiln-agent-stream` or `kiln-agent-citations`. The files go to
`components/agent/`. [strictthemes.com/kit](https://strictthemes.com/kit)
shows the kit in every theme and has each command to copy.

## How a block follows a theme

The themes do not share a spacing scale: a medium gap is 12px in Relay and
16px in Solace. So a block in this folder names no size. It names tokens that
every Strict theme has:

- **`-sp-<token>`** in a class is a spacing step: `gap-sp-md`, `p-sp-lg`,
  `md:p-sp-xl`. The tokens are `xs`, `sm`, `md`, `lg` and `xl`.
- **`type-<token>`** is a type size with the font the theme sets it in:
  `type-label` becomes `font-mono text-label` in a theme whose labels are
  set in its mono font, and `text-label` alone in one that uses its body
  font.

The registry build (`kitSourceFor` in `packages/themes/src/kit.ts`) replaces
both for each theme, so what a project gets is plain Tailwind: `gap-3` in
Relay, `gap-4` in Solace. The files here are not valid Tailwind until then.

What a block may use, so that it is right in every theme:

- **Colors:** only the semantic classes (`bg-card`, `text-muted-foreground`,
  `border-border`, `bg-primary` with `text-primary-foreground`). A hover never
  lightens a fill that holds text: one theme holds text to WCAG AAA.
- **Type:** `text-body`, `text-label`, `text-h1`, `text-h2`, or a `type-`
  token. No weight class, no `leading-` and no `tracking-`: the type class
  sets all three, and the themes do not share a weight other than 400.
- **Corners:** `rounded-lg` only. It is shadcn's name for the base corner,
  the one corner every theme has, and it is square in a theme with none.
  Never `rounded-full`: some themes allow no full round.
- **Focus:** a 2px outline in the theme's ring color on everything that takes
  focus.
- **No card inside a card.** A code box inside a block is a tinted box
  without a border.

A test in `packages/themes` fails when a generated file still holds a token,
a weight class or another corner.

## The demo

`demo/` is one page that shows every block in every state, on a made-up task.
`apps/site/scripts/build-kit.ts` builds it once for each theme, from the same
files the registry serves, into the site at `/kit/<theme>/build/`.
`npm run strict-check:kit -w apps/site` then runs Strict Check on all of
them, and fails on any error or warning.

## What was tested

- **In every theme** (2026-11-12): the demo, built for each of the
  twenty-three themes, passes Strict Check at 100% with no errors and no
  warnings, in light and dark mode at 1280px and 375px, with hover and
  focus: 71,464 measured values in all. The first run found one fault, a
  main button whose hover fill fell under 7:1 in Civic, and the hover was
  changed for every theme.
- **A real install** (2026-11-12, shadcn CLI, a new Vite project): for Relay
  and for Atelier, one command installed the theme and the kit, the demo was
  put in as the page, and the project type-checked, built and passed Strict
  Check at 100%.
- **Not tested:** Next.js, a screen reader, and a project without a Strict
  theme, where the type classes the blocks use do not exist.

## Not here yet

Diff views, task lists, MCP App shells and A2UI catalogs, and a Vue port.
