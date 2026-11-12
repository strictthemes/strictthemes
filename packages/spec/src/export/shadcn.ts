import { bestContrast, formatHex, parseColor } from '../color.ts'
import { tokensForMode } from '../resolve.ts'
import type { StrictSpec, Tokens } from '../types.ts'
import { SEMANTIC_SOURCES, semanticColors } from './semantic.ts'
import { block, fontRoles, namedFamilies, slug, textScaleVars } from './shared.ts'

export interface ShadcnTheme {
  $schema: string
  name: string
  type: 'registry:theme'
  title: string
  description?: string
  /** Shown by the shadcn CLI after install. Lists the fonts the project has to load. */
  docs?: string
  cssVars: {
    /** Goes into `@theme`: font families and the type scale (`text-<token>` utilities). */
    theme: Record<string, string>
    /** Goes into `:root`: colors and the base radius. */
    light: Record<string, string>
    dark?: Record<string, string>
  }
}

/**
 * shadcn's `--radius` is the base every `rounded-*` utility is calculated
 * from. It has to be set in `:root`: a value in `@theme` loses to the
 * `:root` one every shadcn project already has.
 */
function baseRadius(tokens: Tokens): string | undefined {
  const rounded = tokens.rounded
  return rounded.md ?? rounded.default ?? Object.values(rounded)[0]
}

/** The `rounded-*` steps shadcn derives from the base radius. */
const SHADCN_RADIUS_STEPS = ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']

/**
 * The `rounded-*` step each of the spec's corners has in a shadcn project,
 * by token name: `{ sm: 'sm', md: 'md', lg: 'xl' }`.
 *
 * Up to the base radius a corner keeps the spec's own name. shadcn calls its
 * base radius `lg`, the corner of its buttons and inputs, so every corner of
 * the spec larger than the base moves one name up: the spec's `lg` is
 * `rounded-xl`, which is also the corner of shadcn's cards and dialogs.
 * Tokens with other names, or with a value that is not a length, have no step.
 */
export function shadcnRadiusClasses(tokens: Tokens): Record<string, string> {
  const base = Number.parseFloat(baseRadius(tokens) ?? '')
  if (Number.isNaN(base)) return {}
  const classes: Record<string, string> = {}
  for (const [index, name] of SHADCN_RADIUS_STEPS.entries()) {
    const value = tokens.rounded[name]
    if (value === undefined || !/^-?\d*\.?\d+(px)?$/.test(value.trim())) continue
    const step = Number.parseFloat(value) <= base ? name : SHADCN_RADIUS_STEPS[index + 1]
    if (step !== undefined) classes[name] = step
  }
  return classes
}

/**
 * shadcn calculates `rounded-sm` and `rounded-md` as 0.6 and 0.8 of the base
 * radius, and `rounded-xl` as 1.4 of it, which gives values the spec never
 * named (2.4px and 3.2px for a 4px base). Each of the spec's corners is
 * written out exactly instead, under the step `shadcnRadiusClasses` gives it.
 * `rounded-lg` is never written: it stays at the base radius, for the stock
 * components that use it.
 */
function radiusSteps(tokens: Tokens): Record<string, string> {
  const steps: Record<string, string> = {}
  for (const [name, step] of Object.entries(shadcnRadiusClasses(tokens))) {
    const value = tokens.rounded[name]
    if (value !== undefined && step !== 'lg') steps[`radius-${step}`] = value
  }
  return steps
}

/**
 * Spec colors shadcn has no variable for: `tertiary`, `success` and any color
 * with a name of the spec's own (`glaze-pale`). Each gets its own variable, so
 * `bg-tertiary`, `text-success` and `bg-glaze-pale` exist. A name that only
 * gives the text color of another (`on-tertiary`) is not a color of its own.
 */
function extraColorNames(colors: Record<string, string>): string[] {
  return Object.keys(colors).filter(
    (name) => !SEMANTIC_SOURCES.has(name) && !name.startsWith('on-') && !name.endsWith('-foreground'),
  )
}

/** For each extra color the spec has: the color and its foreground, e.g. `tertiary` and `tertiary-foreground`. */
function extraColors(colors: Record<string, string>): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const name of extraColorNames(colors)) {
    const value = colors[name]
    if (value === undefined) continue
    const rgb = parseColor(value)
    const fallback = rgb ? formatHex(bestContrast(rgb, [{ r: 0, g: 0, b: 0, a: 1 }, { r: 1, g: 1, b: 1, a: 1 }])) : '#000000'
    vars[name] = value
    vars[`${name}-foreground`] = colors[`on-${name}`] ?? colors[`${name}-foreground`] ?? fallback
  }
  return vars
}

/** The `@theme` entries that turn the extra colors into utilities. */
function extraColorUtilities(colors: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.keys(extraColors(colors)).map((name) => [`color-${name}`, `var(--${name})`]))
}

function fontVars(tokens: Tokens): Record<string, string> {
  const { sans, mono, heading } = fontRoles(tokens.typography)
  return {
    ...(sans ? { 'font-sans': sans } : {}),
    ...(mono ? { 'font-mono': mono } : {}),
    ...(heading ? { 'font-heading': heading } : {}),
  }
}

/**
 * A shadcn registry item of type `registry:theme`, the JSON that
 * `npx shadcn add <url>` consumes. A `dark` block is included when the spec
 * declares a "dark" mode under `strict.modes`.
 *
 * The theme names the fonts but cannot load them: `docs` lists the families
 * the project has to add itself.
 */
export function toShadcnTheme(spec: StrictSpec): ShadcnTheme {
  const radius = baseRadius(spec)
  const fonts = namedFamilies(spec.typography)
  const theme: ShadcnTheme = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: slug(spec.name) || 'theme',
    type: 'registry:theme',
    title: spec.name,
    ...(spec.description ? { description: spec.description } : {}),
    ...(fonts.length > 0
      ? {
          docs: `${spec.name} uses these fonts: ${fonts.join(', ')}. The theme sets the font variables but does not load the font files. Add them to your app, for example with Fontsource or Google Fonts.`,
        }
      : {}),
    cssVars: {
      theme: {
        ...fontVars(spec),
        ...Object.fromEntries(textScaleVars(spec.typography, { keepTailwindSizes: true })),
        ...radiusSteps(spec),
        ...extraColorUtilities(spec.colors),
      },
      light: {
        ...semanticColors(spec.colors),
        ...extraColors(spec.colors),
        ...(radius !== undefined ? { radius } : {}),
      },
    },
  }
  if (spec.strict.modes.dark) {
    const dark = tokensForMode(spec, 'dark').colors
    theme.cssVars.dark = { ...semanticColors(dark), ...extraColors(dark) }
  }
  return theme
}

/** The same theme as plain CSS variables (`:root` and `.dark`), for pasting into a stylesheet. */
export function toShadcnCss(spec: StrictSpec): string {
  const { cssVars } = toShadcnTheme(spec)
  const declarations = (vars: Record<string, string>): [string, string][] =>
    Object.entries(vars).map(([name, value]) => [`--${name}`, value])
  return [
    `/* ${spec.name} — generated by @strictthemes/spec */\n`,
    block(':root', [...declarations(cssVars.theme), ...declarations(cssVars.light)]),
    cssVars.dark ? block('.dark', declarations(cssVars.dark)) : '',
  ]
    .filter(Boolean)
    .join('\n')
}
