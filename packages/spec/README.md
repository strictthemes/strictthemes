# @strictthemes/spec

Parses, lints and exports Strict design specs.

A Strict spec is a `DESIGN.md` file: design tokens as YAML at the top, the
reasoning behind them as Markdown below, plus one extra key, `strict`, that
says how tightly generated UI must follow the tokens. Any valid `DESIGN.md`
is a valid Strict spec. The format is described in [SPEC.md](SPEC.md).

First version.

## Command

```bash
npx @strictthemes/spec lint DESIGN.md
```

```bash
npx @strictthemes/spec export DESIGN.md --format tailwind --out theme.css
```

```
strict-spec lint <file> [--json]
strict-spec export <file> --format <format> [--out <file>]
```

| Format | What it writes |
|---|---|
| `tailwind` | A Tailwind CSS v4 `@theme` block |
| `shadcn` | A shadcn registry item (`registry:theme` JSON) |
| `shadcn-css` | shadcn CSS variables (`:root` and `.dark`) |
| `nuxt-ui` | Nuxt UI palettes as CSS, followed by `app.config.ts` |
| `dtcg` | W3C design tokens JSON |

`lint` exits with `0` when the spec has no errors and `1` when it has.
`export` refuses a spec with errors and exits with `2`.

## In code

```ts
import { readFileSync } from 'node:fs'
import { lintSpec, toTailwindCss } from '@strictthemes/spec'

const result = lintSpec(readFileSync('DESIGN.md', 'utf8'))

for (const finding of result.findings) {
  console.log(finding.severity, finding.rule, finding.message)
}
if (result.ok) {
  console.log(toTailwindCss(result.spec))
}
```

- `parseSpec(source)` reads a spec and reports what it could not read.
- `lintSpec(source)` does the same and also checks the tokens against the
  spec's own rules. `ok` is false when any finding is an error.
- `toTailwindCss`, `toShadcnTheme`, `toShadcnCss`, `toNuxtUi` and `toDtcg`
  turn a parsed spec into each export.
- `resolveTokens` and `tokensForMode` give the token values for a color mode.
- `shadcnRadiusClasses(tokens)` gives the `rounded-*` class a shadcn project
  has for each corner of a spec. Corners above the base one move a name up
  there (see [SPEC.md](SPEC.md)).
- The color helpers (`parseColor`, `contrastRatio`, `deltaE` and others) are
  the ones the linter uses.

## Related

- [`@strictthemes/check`](https://www.npmjs.com/package/@strictthemes/check)
  checks a project's code and its rendered pages against a spec.
- The themes at [strictthemes.com](https://strictthemes.com) are written in
  this format.

## Licence

MIT
