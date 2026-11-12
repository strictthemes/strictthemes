# Contributing

Thank you for looking. Bug reports, theme ideas and pull requests are all
welcome.

## Report a bug or ask for something

Open an [issue](https://github.com/strictthemes/strictthemes/issues/new/choose).
There is a form for a bug, one for a wrong or missing Strict Check finding,
and one for a theme idea.

For a bug in Strict Check, the most useful thing is the smallest file that
shows it, the `DESIGN.md` it was checked against, and the report the command
printed.

To report a security problem, do not open an issue: see [SECURITY.md](SECURITY.md).

## Set up

You need Node 24 (`nvm use` picks it up from `.nvmrc`).

```bash
npm install
```

```bash
npm run build
```

```bash
npm test
```

`npm test` runs every package's tests, and builds the site to test it. The
rendered checks need Google Chrome, Microsoft Edge or Chromium on the machine.

The repo is an npm workspace:

| Folder | What is in it |
|---|---|
| `packages/spec` | The parser, the linter and the exports for `DESIGN.md` |
| `packages/themes` | The themes, their page prompts and the registry build |
| `packages/check` | Strict Check: the command, the MCP server and the library |
| `apps/site` | strictthemes.com |
| `skills/strict-check` | The skill for coding agents |

Run the site locally with `npm run dev --workspace @strictthemes/site`.

## Before you open a pull request

Run these from the repo's root. The same four run in CI on every pull request,
and a pull request is merged only when they pass.

```bash
npm run build
```

```bash
npm run typecheck
```

```bash
npm test
```

```bash
npm run strict-check --workspace @strictthemes/site
```

The last one is Strict Check on the site itself, against its own theme. If
your change touches the site, it has to stay at no errors.

A good pull request:

- does one thing, and says what and why in its description;
- adds or changes a test when it changes behaviour;
- updates the README of the package it touches when it changes what the
  package does;
- keeps numbers honest: a README says "tested in X" only for what was run.

## Propose a theme

A theme is one folder in `packages/themes/themes`: a `DESIGN.md` and five page
prompts in `prompts/`. Before writing one, open a theme idea issue, so we can
agree on what it is for. A new theme should do a job the others do not: look
at [the eighteen](https://strictthemes.com/themes) first.

A theme is ready when:

- `npx @strictthemes/spec lint DESIGN.md` reports no errors;
- it has a light and a dark mode, and text passes WCAG AA in both;
- its fonts are free to use and to serve, and are on Fontsource;
- each of its five page prompts has been run in a coding agent at least
  once, and the page that came out was checked with Strict Check.

## Licence

By contributing you agree that your work is offered under the
[MIT licence](LICENSE), like the rest of the project.
