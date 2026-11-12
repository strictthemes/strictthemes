# @strictthemes/check

Checks a project's UI against its Strict design spec (`DESIGN.md`). It answers
one question: did the agent stay inside the theme?

First version.

## Use

```bash
npx @strictthemes/check path/to/project --dist dist
```

Or add it to a project, and run it there as `npx strict-check`:

```bash
npm install --save-dev @strictthemes/check
```

It needs Node 20 or later.

`path/to/project` is a project with a `DESIGN.md` in its root. `--dist dist`
is its built site, relative to the project. Without `--dist` or `--url` only
the source check runs.

```
strict-check [dir] [options]

--spec <file>      The spec to check against. Default: <dir>/DESIGN.md
--dist <dir>       Also check the built site in this folder, in a headless browser.
--url <url>        Also check a site that is already running.
--path <path>      A page to open, such as /pricing. Repeat for more. Default: /
--mode <name>      A color mode to check. Repeat for more. Default: every mode in the spec.
--width <px>       A viewport width. Repeat for more. Default: 1280 and 375.
--browser <path>   A Chromium-based browser to use. Default: the Chrome on this machine.
--include-ui       Also read components/ui, the stock components, in the source check.
--exclude <path>   A folder or file to leave out of the source check, relative to dir. Repeat for more.
--no-source        Skip the source check.
--rules            Print what the theme allows, and check nothing.
--json             Print the report as JSON.
--report <file>    Also write the report to a file. A name ending in .json gets the JSON
                   report, any other the text. Repeat for more.
```

`strict-check mcp` starts the MCP server instead; see below.

Exit code: `0` when there are no errors, `1` when there are, `2` when the
check could not run (no spec, a spec with errors, no browser). Warnings do
not fail a check.

The rendered check needs a Chromium-based browser. It uses the Chrome or Edge
already on the machine, or the Chromium a Linux system installs from its own
packages, and downloads nothing.

## What it checks

There are two checks. Both read the same rules from the spec's `strict` block.

### Source check

Reads the project's files as text: `.tsx`, `.jsx`, `.vue`, `.svelte`,
`.astro`, `.html`, `.mdx`, scripts and stylesheets. It needs no build and no
browser, so it is fast enough to run after every edit.

| Rule | Severity | Example |
|---|---|---|
| `color-off-token` | error | `bg-blue-500`, `border-[#ff00aa]`, `fill="#FF00AA"`, a color inside `shadow-[…]` |
| `color-hard-coded` | warning | `bg-[#1F3BFF]` or `text-white` where that is a theme color: it will not follow the color mode |
| `spacing-off-scale` | error | `p-3`, `gap-6`, `mt-[18px]` |
| `type-off-scale` | error | `text-sm`, `text-[13px]` |
| `weight-undeclared` | warning | `font-light` |
| `font-undeclared` | error | `font-[Georgia]`, `fontFamily: "Georgia"`, `font-family: Georgia` |
| `radius-off-scale` | warning or error | `rounded-xl` (a name the theme lacks), `rounded-[10px]` |
| `tell-gradient` | as the spec says | `bg-gradient-to-r`, `linear-gradient(…)` in a style |
| `tell-emoji` | as the spec says | An emoji anywhere in a component |

It skips `components/ui` (the stock components a registry installs, which
keep their own spacing), `node_modules`, build output, tests and config files.
A stylesheet that defines the theme's own variables is exempt from the color
rules.

In a shadcn project (one with a `components.json`) the corner classes are read
the way shadcn names them: `rounded-lg` is the base radius, and each corner of
the spec above the base is one name up, so a spec's `lg` corner is
`rounded-xl`. `strict-check --rules` lists the classes and their sizes.

`rounded-full` passes the source check when the spec sets
`strict.rounded.full`, because only the rendered check can measure the box. A
bare `rounded` counts as a class only inside a string that is not a sentence.

### Rendered check

Opens each page in a headless browser, in every color mode of the spec and at
two widths (1280px and 375px), and measures what the browser computed for
every visible element.

| Rule | Severity | What is measured |
|---|---|---|
| `color-off-token` | error | Text, background and border colors. Opacity is free: `bg-primary/80` is still primary. |
| `contrast` | error | Text against the background behind it, at the spec's WCAG level. Large text gets the lower ratio. |
| `type-off-scale` | error | Font size of every element that holds text. |
| `weight-undeclared` | warning | Font weight. |
| `font-undeclared` | error | The first font family. |
| `spacing-off-scale` | error | Padding, margin and gap. Stock components (`data-slot`) are skipped. |
| `radius-off-scale` | warning or error | Corner radius, only on elements that paint a background or border. A box whose radius is half its shorter side or more is a full round: it passes up to the size the spec's `strict.rounded.full` gives, and is a warning above it or where the spec gives none. |
| `tell-gradient` | as the spec says | A gradient with a purple stop, or with stops more than 40° of hue apart. |
| `tell-glow` | as the spec says | A box or text shadow with a color in it. |
| `tell-nested-cards` | as the spec says | A card inside a card. |
| `tell-emoji` | as the spec says | An emoji in text. |
| `horizontal-scroll` | error | The page is wider than the window. |
| `mode-not-applied` | warning | The page looks the same in a mode as in the base one. That mode is then not measured, so a page with no dark mode gets one warning, not hundreds of color errors. |

The allowed colors are the spec's tokens in each mode, plus the colors the
shadcn export derives from them (such as `--sidebar` and `--muted`). The
color mode is set through `prefers-color-scheme` and by putting the mode's
name as a class on `<html>`.

## Leaving something out

Some parts of a page are off the theme on purpose: a preview of another
theme, a color swatch, a type specimen.

- **On a page:** put `data-strict-ignore` on an element. It and everything
  inside it are not measured.
- **In code:** a comment with `strict-ignore` leaves out that line,
  `strict-ignore-next-line` the line after it, and `strict-ignore-file` the
  whole file. Write the reason after it: `// strict-ignore: swatch of another theme`.

- **A whole folder:** `--exclude <path>` leaves a folder or a file out of the
  source check: another project kept inside this one, generated code, a
  vendored library. The path is relative to the project, and only that path
  is left out, not every folder of the same name. The MCP `check` tool has no
  such option, so an agent cannot use it to reach a pass.

The report says how many places were left out and names the excluded paths,
so a perfect score cannot hide them.

## The report

```
Strict Check: Strict One

Source code
  spacing         64 checked  1 off
  typography      21 checked  all on theme

Rendered pages: / in light and dark mode at 1280px and 375px
  colors         762 checked  all on theme
  spacing        530 checked  4 off
  typography    1674 checked  4 off
  contrast       554 checked  all on theme
  layout           4 checked  all on theme

Errors in the source (1)
  spacing-off-scale
    `p-3` is 12px, which is not on the spacing scale (0, 1, 4, 8, 16, 32, 64px).
    src/components/plans.tsx:7

Errors on the rendered pages (2)
  spacing-off-scale
    A padding of 12px is not on the spacing scale (0, 1, 4, 8, 16, 32, 64px).
    section.mx-auto.p-3  [light, dark; 1280px, 375px]
  type-off-scale
    Text is 14px, which is not in the type scale (12, 16, 24, 36, 56px).
    p.text-sm "Billed once a year"  [light, dark; 1280px, 375px]

Failed: 99.7% of 3609 measured values follow the theme. 3 errors, 0 warnings.
```

The "Rendered pages" line says which pages, modes and widths were opened.
The same element in several modes and widths is listed once, with the modes
and widths in brackets. An error or warning is one kind of problem, a rule
and a value; `×3` after it means three places share it. When more than one page is checked, each place starts
with the page's path. The score is the share of measured values that are on
the theme. `--json` gives the same data.

## In CI

A job runs the same command. It fails when the check finds errors (exit code
1) or cannot run (exit code 2), and passes with warnings. `--report` writes
the report to files the job keeps, whether the check passes or fails.

Both examples assume a project with a `DESIGN.md` in its root, an `npm run
build` that writes `dist`, and version 0.2 or later of this package.

### GitLab CI

```yaml
strict-check:
  image: node:24
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
  script:
    - npm ci
    - npm run build
    # The rendered check needs a browser, and the image has none.
    - apt-get update -qq && apt-get install -y -qq --no-install-recommends chromium > /dev/null
    - npx --yes @strictthemes/check@0.2 --dist dist --report strict-check.txt --report strict-check.json
  artifacts:
    when: always
    paths:
      - strict-check.txt
      - strict-check.json
    expire_in: 1 week
```

### GitHub Actions

`.github/workflows/strict-check.yml`:

```yaml
name: Strict Check
on: pull_request

jobs:
  strict-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run build
      # The runner has Chrome, which the rendered check uses.
      - run: npx --yes @strictthemes/check@0.2 --dist dist --report strict-check.txt --report strict-check.json
      - name: Show the report on the run's page
        if: always()
        run: |
          test -f strict-check.txt || exit 0
          {
            echo '```'
            cat strict-check.txt
            echo '```'
          } >> "$GITHUB_STEP_SUMMARY"
      - uses: actions/upload-artifact@v7
        if: always()
        with:
          name: strict-check
          path: strict-check.*
```

### Notes for both

- **More pages.** Without `--path` only `/` is opened. Add `--path /pricing`
  for each page that matters.
- **A site without a dark mode** is reported as `mode-not-applied`. Pass
  `--mode light`.
- **A monorepo.** Give the project's folder first (`@strictthemes/check@0.2
  apps/web --dist dist`), and `--spec` when its `DESIGN.md` lives elsewhere.
- **A fixed version.** Add the package to the project
  (`npm install --save-dev @strictthemes/check`) and call `npx strict-check`,
  and the lock file decides the version.
- **Time.** On this repo's site the check itself takes about 12 seconds for
  five pages. Installing Chromium in a GitLab job takes about a minute.

This repo runs the check on its own site in GitHub Actions: see
`strict-check` in `apps/site/package.json` and the `build` job in
`.github/workflows/ci.yml`.

## For coding agents

The point of the check is that the agent that wrote the UI runs it, reads
the report and fixes what it finds. There are two ways to give it that.

### MCP server

`strict-check mcp` serves two tools over stdio:

| Tool | What it does |
|---|---|
| `rules` | Returns what the theme allows: colors in each mode, the spacing scale, type sizes, corners, fonts, contrast level and forbidden patterns. For reading before writing UI. The same text as `--rules`. |
| `check` | Runs the check and returns the same report the command prints, as text. Its last line starts with "Passed" or "Failed". Takes `dir`, and optionally `spec`, `dist` or `url`, `paths`, `modes`, `widths`, `includeUi`. |

Both only read, and both answer in text alone. Claude Code gives the model a
tool's structured data in place of its text when a tool returns both, so a
summary object beside the report would hide the findings from the agent.
A check that finds problems is a normal result; a check that
could not run (no spec, project not built, no browser) is a tool error with
the reason.

To connect it in Claude Code, Cursor or another MCP client:

```json
{
  "mcpServers": {
    "strict-check": {
      "command": "npx",
      "args": ["-y", "@strictthemes/check", "mcp"]
    }
  }
}
```

From a checkout of this repo it is `"command": "node"` with
`"args": ["/absolute/path/to/packages/check/dist/cli.js", "mcp"]`.

### Skill

[`skills/strict-check/SKILL.md`](https://github.com/strictthemes/strictthemes/blob/master/skills/strict-check/SKILL.md) tells an
agent when to run the check, how to read the report, how to fix each rule,
and what it must not do to get a pass (mark findings ignored, edit
`DESIGN.md`, drop a mode). It works with the command or with the MCP tools.
It names the command as `npx @strictthemes/check`.

## As a library

```ts
import { lintSpec } from '@strictthemes/spec'
import { checkSource, checkRendered, rulesFor, serveStatic, summarize } from '@strictthemes/check'

const rules = rulesFor(lintSpec(designMd).spec)
const source = checkSource('path/to/project', rules)
const server = await serveStatic('path/to/project/dist')
const rendered = await checkRendered(server.url, rules, { paths: ['/', '/pricing'] })
await server.close()
const { ok, score, errors } = summarize([source, rendered])
```

`runCheck(options)` does all of that in one call and returns the report; it
is what the command and the MCP server both use. `describeRules(spec, rules)`
gives the text of `--rules`.

`evaluatePage(data, rules, context)` is the pure half of the rendered check:
it takes what `collect()` measured in a page and returns findings, with no
browser involved.

## What was tested

- The five pages built from the Strict One prompts (landing, pricing, article,
  docs, dashboard) pass at 100%, with 2,600 to 4,400 measured values each. A
  run takes five to six seconds per project.
- The twenty pages built from the Recital and Avion prompts (ten pages, two
  rounds, 2026-11-11) pass with no errors, at 98.7% to 100%, with 1,700 to
  5,300 measured values each. The warnings are round shapes those themes
  allow (avatars, status dots) and a stock `Switch`.
- A copy of the pricing page with planted mistakes (palette colors, off-scale
  spacing, type and corners, a purple gradient, a glow, an emoji, a card in a
  card, low contrast, a too-wide row) fails, and each mistake is reported by
  the source check, the rendered check or both.
- This repo's own site (Astro), checked against Strict One: the first run
  found two real bugs, pages that scrolled sideways at 375px and code text at
  14px, which is not in the type scale. Both are fixed. The home, themes,
  Strict One and spec pages now pass with no errors in light mode, with the
  theme previews and swatches marked `data-strict-ignore`. The site has no
  dark mode, and the Recital and Avion pages do not pass against their own
  themes: they use those themes' colors and fonts on the site's Strict One
  layout.
- **In CI (2026-11-12).** The site's check runs in this repo's GitHub
  Actions workflow on every pull request and on `master`: the source, without
  the ninety example projects (`--exclude examples`), and the home,
  themes, spec, Strict One and 404 pages in light mode. It passes at 100% of
  15,202 measured values, with no errors and no warnings, on an
  `ubuntu-latest` runner with the runner's own Chrome.
- Before the repo moved to GitHub the same check ran in a GitLab pipeline, in
  a `node:24` image with Chromium from Debian's packages, and measured the
  same 15,202 values, as did Chrome on macOS.
- The two examples above differ from this repo's own jobs in one thing: they
  fetch the package with `npx`, and this repo runs its own build of it. The
  GitLab example was run as written, in a clean `node:24` container, on a
  failing and on a passing project. The GitHub example has not been run as
  written.
- Everything else was run on macOS with Chrome, on Vite + React and Astro
  projects. Other frameworks and Windows are untried.
- **The skill, by a fresh agent:** one agent followed the skill with the
  command to fix the broken copy and passed in one edit, with no ignore
  markers. Its feedback changed the report and the skill.
- **The MCP server in Claude Code** (2.1.209, model Opus 4.8, headless, the
  server passed with `--mcp-config`), two runs on the broken copy:
  - Server only, and a prompt that did not mention the tools: it found them,
    called `rules` before writing and `check` after building, and passed at
    100% on the first check. About 2.5 minutes.
  - Server and skill together, asked to check the project and fix it: it
    loaded the skill, built, got a failing report (30 errors, 7 warnings),
    fixed the one file, checked again and passed at 100%. About 3 minutes.
    It did not call `rules` in this run; it read `DESIGN.md` instead.
  - The first run found a bug: Claude Code gave the model the tool's
    structured data in place of its text, so a failing check would have
    shown counts and no findings. The tools now answer in text only, and the
    second run confirmed the model received the full report.
- Not tried: the server or the skill in Cursor or any client other than
  Claude Code; an interactive Claude Code session, where a project's
  `.mcp.json` needs the user's approval first.
- The package is on npm since 2026-11-12. No one outside this repo is known
  to have run it.

## What it does not check yet

- **Line height and letter spacing.** Only font size, weight and family.
- **States.** Hover, focus and open menus are not triggered, so their colors
  and contrast are not measured.
- **Text over images or over a sibling.** The background behind text is taken
  from its ancestors. Text that sits over an image, or over an element that
  is not its ancestor, is measured against the wrong color unless it is
  absolutely positioned.
- **A square box inside a card.** A card is counted as a bordered or
  shadowed box with rounded corners. A square-cornered bordered box inside a
  card is not reported as a card inside a card, because a theme may use
  exactly that for a figure or a drawing inside a panel. In one test run the
  agent turned a nested card into such a box and the check passed it.
- **Stock components' own spacing.** Elements with `data-slot` keep the
  spacing they ship with, so a wrong padding added to one is not reported in
  the rendered check. The source check still sees the class.
- **Classes built at run time.** The source check reads class names as
  written. `"p-" + size` is invisible to it; the rendered check catches the
  result.
- **Sample text that looks like code.** A quoted color inside a code sample
  (`primary: "#1F3BFF"` in a string that is shown to the reader) is reported
  as a hard-coded color. It is a warning; mark the line `strict-ignore`
  where a comment fits.
- **Other ways of switching modes.** The check sets the mode's name as a
  class on `<html>` and the browser's color scheme. A site that switches
  with `data-theme="dark"` or its own script is reported as
  `mode-not-applied`.
- **Pages behind a login,** and anything that needs data from a server.
- **Layout rules in a theme's prose,** such as "one primary button per view".
  Only the `strict` block is enforced.

## Licence

MIT
