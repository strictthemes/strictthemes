---
name: strict-check
description: Check that UI you built or changed follows the project's theme (its DESIGN.md) with Strict Check, and fix what it reports. Use it in any project that has a DESIGN.md with a `strict` block - before writing UI, to read what the theme allows, and after writing or editing a page, component or stylesheet, before you say the work is done.
---

# Strict Check

Strict Check measures a project's UI against its theme, the `DESIGN.md` in the
project root. It reads the code and it opens the built pages in a headless
browser. It reports every value that is off the theme: a color, a spacing
step, a type size, a corner, low contrast, a page that scrolls sideways.

Asking yourself "did I follow the theme?" is not a check. Run this one.

## 1. Before you write UI: read what the theme allows

```bash
npx @strictthemes/check --rules
```

This prints the theme's colors in each mode, its spacing scale, type sizes,
corners, fonts, and the patterns it forbids. Use only those values. Read
`DESIGN.md` too: it says how the theme should look and feel, which the list
cannot.

## 2. After you change UI: build, then check

Build the project with its own build command, then:

```bash
npx @strictthemes/check --dist dist
```

`dist` is the folder the build wrote. Add `--path /pricing` for each page you
touched other than `/`. If a dev server is already running, use
`--url http://localhost:5173` in place of `--dist`.

Without `--dist` or `--url` only the code is read. That is quick and worth
doing after each edit, but it is half a check: it cannot see contrast, the
sizes stock components ship with, a card inside a card, or sideways scroll.
Do not report UI work as done on a source-only check.

Exit code 0 means no errors. 1 means errors. 2 means the check could not run;
read the message, fix the cause (often: the project is not built), and run it
again.

## 3. Fix what it reports

Each finding names the rule, the value, and the place: a file and line, or an
element with the color modes and widths it was seen in. The report lists
errors and warnings apart. Fix every error. Read each warning and fix it
unless there is a reason not to, and say what the reason is.

The counts are kinds of problem, not places: `×3` after a rule means three
places share it. The same problem can be a warning in the code and an error
on the page. The code check cannot know what a class such as `rounded-xl`
resolves to in this project; the page check measures it.

| Rule | Fix |
|---|---|
| `color-off-token` | Use one of the theme's color classes, for example `bg-primary` or `text-muted-foreground`. If no theme color fits, pick the nearest role. Do not add a color. |
| `color-hard-coded` | The value is a theme color written as a literal. Use the class or CSS variable for it so it follows the color mode. |
| `spacing-off-scale` | Use the nearest step on the spacing scale. On a stock component, override its default in `className`. |
| `type-off-scale` | Use one of the theme's `text-*` classes. Stock components often ship `text-sm`: override it. |
| `weight-undeclared`, `font-undeclared` | Use a weight and a font family the theme declares. |
| `radius-off-scale` | Use one of the theme's `rounded-*` classes. |
| `contrast` | Pair each background with its own foreground, for example `bg-primary` with `text-primary-foreground`. Do not fade text with opacity. |
| `tell-gradient`, `tell-glow`, `tell-nested-cards` | Remove it. Use a flat theme color; separate inner content with a border or space, not a second card. |
| `tell-emoji` | Where the emoji stands for an icon or a bullet, use an icon from the project's icon set. Where it decorates text, remove it; that is not deleting content. |
| `horizontal-scroll` | The report names the element past the edge. A grid or flex child that holds wide content needs `min-w-0`; a wide table or code block needs its own `overflow-x-auto` box. |
| `mode-not-applied` | The page looks the same in that mode. If the project has that mode, fix the switch: the mode's name as a class on `<html>`. If it has none, tell the user and check with `--mode light`. |

If the rendered check still reports a value after you changed the class,
something overrides your class. Look at the element's other classes and at
the component's defaults before trying again.

Then build and run the check again. Repeat until it passes. If the same
finding survives three attempts, stop and tell the user what you tried.

## 4. What you must not do to pass

- **Do not use `strict-ignore` or `data-strict-ignore` to hide a finding.**
  Those markers are for content that shows another theme on purpose, such as
  a color swatch or a preview of a different theme. If you believe one
  applies, ask the user first. The report counts every ignored place.
- **Do not edit `DESIGN.md`** or its `strict` block so the UI passes. The
  theme is the fixed side.
- **Do not drop a mode, a width or the source check** (`--mode`, `--width`,
  `--no-source`) to get a pass, and do not delete content the user asked for.
- **Do not edit `components/ui`** to change a stock component for one use.
  Override it where you use it.

## 5. Report the result honestly

Tell the user the last line of the report as it is, for example "Passed: 100%
of 3,726 measured values follow the theme. 0 errors, 0 warnings." Say which
pages, modes and widths were checked (the "Rendered pages" line of the
report lists them), any warnings you left and why, and anything marked
ignored.

A pass does not cover everything:

- Strict Check does not measure hover, focus or open menus, line height,
  text over images, or pages behind a login. Say so if the work touched any
  of these.
- It checks the theme's numbers, not what `DESIGN.md` says in words: which
  color is for what, how many primary buttons a view may have, how dense a
  page should be. `bg-primary` on a whole panel passes the check and can
  still break the theme. Follow `DESIGN.md` for those, and say where you
  made such a call.

## With the MCP server

If the `strict-check` MCP server is connected, use its tools in place of the
commands. They take the same options:

- `rules` with `dir`: what the theme allows.
- `check` with `dir` and `dist` (or `url`), and optionally `paths`, `modes`,
  `widths`: the same report the command prints. Its last line starts with
  "Passed" or "Failed".

`dir` is the absolute path of the project.

The server has four more tools, for a project that has no `DESIGN.md` yet or
a page the user wants built from a ready brief: `list_themes`, `get_theme`,
`list_prompts` and `get_prompt` return the Strict themes and their page
prompts from strictthemes.com. `get_theme` returns the theme's `DESIGN.md`,
to save in the project's root.
