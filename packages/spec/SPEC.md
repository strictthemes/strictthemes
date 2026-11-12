# The Strict spec format

A Strict spec is a `DESIGN.md` file: the format Google Labs published in 2026
(currently `alpha`), plus one extra top-level key, `strict`, that says how
tightly generated UI must follow the tokens.

- Any valid `DESIGN.md` is a valid Strict spec. Without a `strict` block the
  defaults below apply.
- A Strict spec is still a `DESIGN.md`. Other tools see `strict` as an unknown
  key, which the format treats as a warning, not an error.

## File layout

```markdown
---
name: Strict One            # required
version: alpha              # optional
description: …              # optional
colors: { … }
typography: { … }
rounded: { … }
spacing: { … }
components: { … }
strict: { … }               # the Strict extension
---

## Overview
…prose an agent reads to understand intent…
```

Tokens may also be written as ` ```yaml ` blocks inside `##` sections instead of
front matter. A yaml block only counts as tokens when every top-level key in it
is a spec key; anything else is treated as an illustration. A key may be
defined only once across the whole file.

## Tokens

| Group | Value |
|---|---|
| `colors` | Any CSS color: `"#1F3BFF"`, `"oklch(62% 0.18 250)"` |
| `typography` | Object with `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `fontFeature`, `fontVariation` |
| `rounded` | A length (`4px`, `0.25rem`). Plain numbers are read as px |
| `spacing` | A length. Plain numbers are read as px |
| `components` | Object with `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`. Variants (hover, pressed) are separate entries |

**References** point at another token with `{group.name}`:

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    typography: "{typography.label}"          # takes the whole token
    padding: "{spacing.sm} {spacing.md}"      # substituted as text
```

## Sections

All optional. Those present must appear in this order:

1. Overview (or "Brand & Style")
2. Colors
3. Typography
4. Layout (or "Layout & Spacing")
5. Elevation & Depth (or "Elevation")
6. Shapes
7. Components
8. Do's and Don'ts

Other headings are kept as custom sections.

## The `strict` block

```yaml
strict:
  version: 1
  contrast: AA              # AA (4.5:1) or AAA (7:1)
  colors:
    allow: tokens           # tokens: only token colors may appear. any: no check
    tolerance: 0.02         # how far a color may drift from a token (OKLab distance, 0–1)
  spacing:
    allow: scale            # scale: only spacing tokens. any: no check
    extra: ["0", "1px"]     # values allowed in addition to the scale
  rounded:
    allow: scale            # scale: only rounded tokens. any: no check
    full: 12px              # optional: the largest box that may be fully round
  typography:
    allow: scale            # only the declared sizes, weights and line heights
    fonts: declared         # only the declared font families
  tells:                    # signs of generic AI-made UI: off, warn or error
    purple-gradient: error
    emoji-icons: error
    nested-cards: warn
    glow-shadows: warn
  modes:                    # extra color modes; each overrides base color tokens
    dark:
      colors:
        background: "#0B0B0C"
        foreground: "#F5F5F4"
```

The values shown for `contrast`, `colors`, `spacing`, `rounded.allow` and
`typography` are the defaults. `tells` and `modes` are empty by default.

`rounded.full` has no default. A box whose corner radius is half its shorter
side or more is a full round: a circle or a pill. Without `full`, Strict Check
reports every one of them as a warning. With it, a full round passes when the
box is no larger than that on its shorter side: `12px` lets status dots
through, `64px` avatars and a pill-shaped switch too. Set it where the prose
of the file allows such shapes.

Mode overrides are applied before references resolve, so a component that
points at `{colors.background}` follows the dark value in dark mode.

This package validates the block and applies `contrast` to the spec's own
components. Checking a project's code and rendered pages against `colors`,
`spacing`, `rounded`, `typography` and `tells` is the job of Strict Check
(`@strictthemes/check`), which has a first version.

## Lint rules

| Rule | Severity | Meaning |
|---|---|---|
| `invalid-yaml`, `duplicate-key` | error | Tokens can't be read, or a key is defined twice |
| `missing-name` | error | No top-level `name` |
| `duplicate-section` | error | The same section appears twice |
| `broken-ref`, `circular-ref` | error | A `{reference}` points nowhere, or at itself |
| `invalid-token` | error | A token has the wrong shape |
| `invalid-color`, `invalid-dimension`, `invalid-typography` | error | A value isn't a color, length or font value |
| `invalid-strict` | error | A setting in the `strict` block has a value that isn't allowed |
| `contrast-ratio` | error / warning | A component's text and background fail WCAG. An error when the file has a `strict` block, a warning otherwise. Checked in every mode |
| `missing-primary`, `missing-typography` | warning | No `primary` color, or no typography tokens |
| `section-order` | warning | Known sections are out of order |
| `unknown-key` | warning | Unknown top-level key |
| `unknown-component-property`, `unknown-typography-property` | warning | Property the format doesn't define |
| `unknown-tell`, `unknown-mode-token` | warning | A tell id that isn't known, or a mode overriding a color that doesn't exist |
| `missing-sections`, `orphaned-tokens`, `token-summary` | info | Sections not present, colors no component uses, token counts |

## Exports

| Format | Output |
|---|---|
| `tailwind` | Tailwind CSS v4 `@theme` block, plus one class per extra mode |
| `shadcn` | shadcn registry item (`registry:theme`) for `npx shadcn add <url>` |
| `shadcn-css` | The same theme as `:root` / `.dark` CSS variables |
| `nuxt-ui` | 50–950 palettes for Nuxt UI's semantic colors, exact brand and page colors pinned to `--ui-*`, and an `app.config.ts` |
| `dtcg` | W3C Design Tokens Community Group JSON |

Every exported font family ends in a generic fallback (`sans-serif`, `serif` or
`monospace`), so text renders in the right kind of typeface when the web font
is missing. No export loads font files: the project has to add them.

### Tailwind

- **Type scale.** Each typography token becomes a `text-<token>` utility that
  sets size, line height, weight and tracking together (`text-h1`,
  `text-label`).
- **Spacing.** Spacing tokens are written as `--spacing-space-<name>`, giving
  `p-space-md` or `gap-space-lg`. They are not written as `--spacing-<name>`,
  because Tailwind would then also use them for `max-w-md` and `w-lg`, and a
  `md` of 16px turns every `max-w-md` box into a 16px sliver.

### shadcn

Tested with shadcn CLI 4.23 on a new Vite + Base UI project (`shadcn add`,
build, light and dark mode in the browser).

- **Colors.** shadcn has semantic colors (`muted`, `border`, `card`…) that a
  spec may not define. Each takes the first matching token name (for example
  `border` or `outline`), and is derived from the background, foreground and
  primary colors when there is none.
- **Muted text.** `muted-foreground` is the spec's `neutral` color when that is
  readable (4.5:1) on both the page and a card. Otherwise a grey is mixed and
  darkened until it is.
- **`accent` is not the brand accent.** shadcn paints hover and highlighted
  states with it, so `tertiary` is not mapped to it. Only a token named
  `accent` is used; otherwise it is derived as a step away from the popover
  color.
- **Charts and sidebar.** `chart-1` to `chart-5` default to a ramp of the
  primary color and the `sidebar-*` variables follow the card, primary, accent
  and border colors. Tokens with those exact names override them.
- **Radius.** `rounded.md` becomes shadcn's base `--radius`, which each shadcn
  style scales in its own way (in the `nova` style a badge is still a pill at
  4px). It is written to `:root`, where shadcn reads it.
- **Fonts.** `font-sans`, `font-mono` and, when headings use a different
  family, `font-heading`. The item's `docs` text, which the CLI prints after
  install, lists the families to load.
- **Type scale.** The typography tokens are installed as `text-<token>`
  utilities, the same as in the Tailwind export. A token named like one of
  Tailwind's own sizes (`sm`, `base`, `lg`…) is left out, because shadcn
  components rely on those sizes. shadcn's `cn()` takes an unknown `text-*`
  class for a color, so `cn("text-label text-muted-foreground")` drops one of
  the two until the names are registered as font sizes (`createCn` from
  `cn/config`, or `extendTailwindMerge`). Stock components import `cn`
  straight from the `cn` package, so they have to import the configured one
  from `lib/utils.ts` instead.
- **Small corners are exact.** shadcn derives `rounded-sm` and `rounded-md`
  from the base radius (×0.6 and ×0.8), which gives 2.4px and 3.2px for a 4px
  base. A rounded token named like one of shadcn's steps, and no larger than
  the base, is written out as it is, so `rounded-sm` and `rounded-md` are the
  spec's own `sm` and `md`.
- **Larger corners move one name up.** shadcn's `rounded-lg` is the base
  radius, the one its stock buttons and inputs use, so it cannot also be a
  spec's larger `lg` corner. Each rounded token above the base is written to
  the next step name: with a 6px base, a 12px `lg` token becomes
  `rounded-xl`, and `rounded-lg` stays 6px. `shadcnRadiusClasses(tokens)`
  returns this mapping.
- **Tertiary and success.** shadcn has no variable for a third brand color,
  and `accent` is taken by hover states. A `tertiary` token is exported as
  `--tertiary` and `--tertiary-foreground` (from `on-tertiary`), with the
  utilities `bg-tertiary` and `text-tertiary-foreground`. A `success` token is
  exported the same way, as `bg-success` and `text-success`.
- **Colors with a name of the spec's own.** Any other color shadcn has no
  variable for (`glaze-pale`, `warning`) is exported like `tertiary`: its own
  variable and its own utility (`bg-glaze-pale`). A color a mode does not
  override keeps its value in that mode.

### Nuxt UI

Tested with Nuxt UI 4.12 on the official starter (build, light and dark mode in
the browser).

- **Brand colors.** Each of `primary`, `secondary`, `success`, `info`,
  `warning`, `error` and `neutral` that the spec defines becomes a 50–950
  palette, and `--ui-<name>` is pinned to the spec's exact value.
- **Page colors.** Nuxt UI takes its background, text and borders from the
  neutral palette. When the spec defines a background or foreground color,
  `--ui-bg*`, `--ui-text*` and `--ui-border*` are pinned to the spec's colors
  instead; the in-between shades are mixed from background and foreground.
- **Dark mode.** A spec with a `dark` mode pins both. A spec without one pins
  page colors under `:root:not(.dark)`, so the app's dark mode keeps Nuxt UI's
  defaults.
- **Text on solid buttons** is Nuxt UI's inverted text color, which is pinned
  to the background color. A spec's `on-primary` is not used.
- **Radius.** Nuxt UI's `--ui-radius` is its smallest step, and buttons and
  inputs use 1.5 times it. `rounded.md` is divided by 1.5 so they come out at
  the spec's value.
- **Fonts.** `--font-sans` and `--font-mono`. Nuxt Fonts, which the starter
  includes, loads the families by name.
