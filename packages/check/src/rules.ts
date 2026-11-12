import {
  namedFamilies,
  parseColor,
  shadcnRadiusClasses,
  tokensForMode,
  toShadcnTheme,
  type Rgb,
  type RuleLevel,
  type StrictSpec,
} from '@strictthemes/spec'

/** The name used for the spec's base colors, as opposed to a mode under `strict.modes`. */
export const BASE_MODE = 'light'

/**
 * What a spec allows, in the units the checks measure: pixels, weights and
 * RGB colors. A `null` list means the spec does not restrict that property.
 */
export interface Rules {
  name: string
  /** Minimum contrast for normal and for large text. */
  contrast: { normal: number; large: number; level: string }
  /** How far a color may be from an allowed one (OKLab distance). */
  tolerance: number
  /** Allowed colors per mode, or null when any color is allowed. */
  colors: Record<string, Rgb[]> | null
  /** The page background per mode, where the spec names one. Used to tell whether a page switched modes. */
  backgrounds: Record<string, Rgb | null>
  /** Allowed padding, margin and gap sizes in px. */
  spacing: number[] | null
  /** Allowed corner radii in px. */
  radii: number[] | null
  /** The largest box that may be fully round, in px on its shorter side. 0 when the theme allows none. */
  fullRound: number
  /** The `rounded-<name>` classes the project has, with the size of each in px. */
  radiusClasses: Record<string, number>
  /** The names in `radiusClasses`. */
  radiusNames: Set<string>
  /** Allowed font sizes in px, and the names of the type tokens. */
  sizes: number[] | null
  sizeNames: Set<string>
  weights: number[] | null
  /**
   * The line height and letter spacing each type size is set with, in px, or
   * null when the spec does not restrict type. A size two tokens share has two entries.
   */
  leading: TypeSetting[] | null
  /** Declared font families, lower-cased, or null when any font is allowed. */
  fonts: string[] | null
  tells: Record<string, RuleLevel>
  /** Every mode that can be checked: the base mode first. */
  modes: string[]
}

/** How one type token sets a size: its line height and letter spacing, in px. */
export interface TypeSetting {
  size: number
  /** Null when the token names no line height. */
  lineHeight: number | null
  letterSpacing: number
}

/** A token's line height or letter spacing in px. A bare number and `em` are multiples of the font size. */
function relativePx(value: string | number | undefined, size: number): number | null {
  if (value === undefined) return null
  const match = /^(-?\d*\.?\d+)(px|rem|em|%)?$/.exec(String(value).trim())
  if (!match) return null
  const n = Number(match[1])
  if (match[2] === 'px') return n
  if (match[2] === 'rem') return n * 16
  if (match[2] === '%') return (n / 100) * size
  return n * size
}

/** A CSS length in px. `rem` and `em` count as 16px. Returns null for anything else. */
export function toPx(value: string | number | undefined): number | null {
  if (value === undefined) return null
  if (typeof value === 'number') return value
  const match = /^(-?\d*\.?\d+)(px|rem|em)?$/.exec(value.trim())
  if (!match) return null
  const n = Number(match[1])
  return match[2] === 'rem' || match[2] === 'em' ? n * 16 : n
}

const unique = (values: number[]): number[] => [...new Set(values)].sort((a, b) => a - b)

const colorsOf = (values: Record<string, string>): Rgb[] =>
  Object.values(values)
    .map((value) => parseColor(value))
    .filter((rgb): rgb is Rgb => rgb !== null)

/** What `rulesFor` needs to know about the project the spec is checked in. */
export interface RulesOptions {
  /**
   * True for a project set up with shadcn (it has a `components.json`). There
   * the corner classes follow shadcn's names, not the spec's: see `cornerClasses`.
   */
  shadcn?: boolean
}

/**
 * The `rounded-<name>` classes a project has, and the size of each in px.
 *
 * In a plain Tailwind project the names are the spec's own. A shadcn project
 * calls its base corner `lg`, so there `rounded-lg` is the base radius and
 * every corner of the spec above the base sits one name up (the spec's `lg`
 * is `rounded-xl`), the way the shadcn export writes them.
 */
function cornerClasses(spec: StrictSpec, shadcn: boolean): Record<string, number> {
  const classes: Record<string, number> = { none: 0 }
  const add = (name: string, value: string | undefined): void => {
    const size = toPx(value)
    if (size !== null) classes[name] = size
  }
  if (!shadcn) {
    for (const [name, value] of Object.entries(spec.rounded)) add(name, value)
    return classes
  }
  const steps = shadcnRadiusClasses(spec)
  for (const [token, step] of Object.entries(steps)) add(step, spec.rounded[token])
  if (classes.lg === undefined) add('lg', toShadcnTheme(spec).cssVars.light.radius)
  return classes
}

/**
 * Turns a spec into the rules the checks apply.
 *
 * Allowed colors are the spec's color tokens in each mode, plus the colors
 * the shadcn export derives from them (muted and accent surfaces, the chart
 * ramp), because a project that installed the theme uses those too.
 */
export function rulesFor(spec: StrictSpec, options: RulesOptions = {}): Rules {
  const { strict } = spec
  const corners = cornerClasses(spec, options.shadcn === true)
  const shadcn = toShadcnTheme(spec)
  const modes = [BASE_MODE, ...Object.keys(strict.modes)]
  const colors: Record<string, Rgb[]> = {}
  const backgrounds: Record<string, Rgb | null> = {}
  for (const mode of modes) {
    const tokens = mode === BASE_MODE ? spec.colors : tokensForMode(spec, mode).colors
    const derived = mode === BASE_MODE ? shadcn.cssVars.light : mode === 'dark' ? (shadcn.cssVars.dark ?? {}) : {}
    colors[mode] = [...colorsOf(tokens), ...colorsOf(derived)]
    backgrounds[mode] = tokens.background !== undefined ? parseColor(tokens.background) : null
  }

  const typography = Object.values(spec.typography)
  const px = (values: (string | number | undefined)[]): number[] =>
    unique(values.map(toPx).filter((n): n is number => n !== null))
  const weights = unique(
    typography.map((token) => Number(token.fontWeight)).filter((n) => Number.isFinite(n) && n > 0),
  )
  const fonts = namedFamilies(spec.typography).map((family) => family.toLowerCase())
  const leading: TypeSetting[] = []
  for (const token of typography) {
    const size = toPx(token.fontSize)
    if (size === null) continue
    leading.push({
      size,
      lineHeight: relativePx(token.lineHeight, size),
      letterSpacing: relativePx(token.letterSpacing, size) ?? 0,
    })
  }

  return {
    name: spec.name,
    contrast:
      strict.contrast === 'AAA' ? { normal: 7, large: 4.5, level: 'AAA' } : { normal: 4.5, large: 3, level: 'AA' },
    tolerance: strict.colors.tolerance,
    colors: strict.colors.allow === 'tokens' ? colors : null,
    backgrounds,
    spacing: strict.spacing.allow === 'scale' ? px([...Object.values(spec.spacing), ...strict.spacing.extra]) : null,
    radii: strict.rounded.allow === 'scale' ? px([...Object.values(spec.rounded), 0]) : null,
    fullRound: toPx(strict.rounded.full) ?? 0,
    radiusClasses: corners,
    radiusNames: new Set(Object.keys(corners)),
    sizes: strict.typography.allow === 'scale' ? px(typography.map((token) => token.fontSize)) : null,
    sizeNames: new Set(Object.entries(spec.typography).filter(([, token]) => token.fontSize !== undefined).map(([name]) => name)),
    weights: strict.typography.allow === 'scale' && weights.length > 0 ? weights : null,
    leading: strict.typography.allow === 'scale' && leading.length > 0 ? leading : null,
    fonts: strict.typography.fonts === 'declared' && fonts.length > 0 ? fonts : null,
    tells: strict.tells,
    modes,
  }
}

/** The severity a tell is reported at, or null when the spec turns it off or never names it. */
export function tellSeverity(rules: Rules, tell: string): 'error' | 'warning' | null {
  const level = rules.tells[tell]
  if (level === 'error') return 'error'
  if (level === 'warn') return 'warning'
  return null
}

/** True when `px` is one of the allowed sizes, within half a pixel. */
export const onScale = (px: number, allowed: number[]): boolean => allowed.some((value) => Math.abs(value - px) <= 0.5)

/** The allowed sizes as text, for messages: `4, 8, 16px`. */
export const scaleText = (allowed: number[]): string => `${allowed.join(', ')}px`
