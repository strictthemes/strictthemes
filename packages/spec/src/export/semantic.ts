import { bestContrast, contrastRatio, formatHex, mix, palette, parseColor, type Rgb } from '../color.ts'

const WHITE: Rgb = { r: 1, g: 1, b: 1, a: 1 }
const BLACK: Rgb = { r: 0, g: 0, b: 0, a: 1 }

/**
 * The token names `semanticColors` reads. A spec color with any other name has
 * no shadcn variable to go to, so the shadcn export gives it one of its own.
 */
export const SEMANTIC_SOURCES: ReadonlySet<string> = new Set([
  'background', 'surface', 'foreground', 'on-background', 'on-surface', 'text',
  'primary', 'primary-foreground', 'on-primary',
  'secondary', 'secondary-foreground', 'on-secondary',
  'muted', 'surface-variant', 'surface-muted', 'muted-foreground', 'on-surface-variant', 'neutral',
  'destructive', 'error', 'danger',
  'card', 'card-foreground', 'popover', 'popover-foreground',
  'accent', 'accent-foreground', 'on-accent',
  'border', 'outline', 'input', 'ring',
  'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
  'sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground',
  'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring',
])

/** Steps of the primary palette used for `chart-1` … `chart-5`, light to dark. */
const CHART_STEPS = [300, 400, 500, 600, 700]

/**
 * Maps spec colors onto shadcn's semantic variables. Each variable takes the
 * first matching token name; when none exists it is derived from the
 * background, foreground and primary colors.
 *
 * shadcn paints hover and highlighted states (menu items, toggles) with
 * `accent`, so a brand accent such as `tertiary` is not mapped to it: only a
 * token named `accent` is. Otherwise it is a step away from the popover
 * color, which is where highlighted items sit, so the highlight stays visible.
 */
export function semanticColors(colors: Record<string, string>): Record<string, string> {
  const first = (...names: string[]): string | undefined => {
    for (const name of names) {
      const value = colors[name]
      if (value !== undefined) return value
    }
    return undefined
  }
  const rgb = (value: string | undefined, fallback: Rgb): Rgb =>
    (value !== undefined ? parseColor(value) : null) ?? fallback

  const background = first('background', 'surface') ?? '#ffffff'
  const bg = rgb(background, WHITE)
  const foreground =
    first('foreground', 'on-background', 'on-surface', 'text') ?? formatHex(bestContrast(bg, [BLACK, WHITE]))
  const fg = rgb(foreground, BLACK)
  const blend = (t: number) => formatHex(mix(bg, fg, t))
  /** Text color for a surface: the theme's own foreground or background when one is readable on it. */
  const on = (value: string): string => {
    const surface = rgb(value, bg)
    const own = bestContrast(surface, [fg, bg])
    if (contrastRatio(surface, own) >= 4.5) return own === fg ? foreground : background
    return formatHex(bestContrast(surface, [fg, bg, WHITE, BLACK]))
  }

  const primary = first('primary') ?? foreground
  const primaryForeground = first('primary-foreground', 'on-primary') ?? on(primary)
  const secondary = first('secondary') ?? blend(0.06)
  const muted = first('muted', 'surface-variant', 'surface-muted') ?? blend(0.05)
  const destructive = first('destructive', 'error', 'danger') ?? '#dc2626'
  const card = first('card', 'surface') ?? background
  const cardForeground = first('card-foreground', 'on-surface') ?? foreground
  const popover = first('popover') ?? card
  const accent = first('accent') ?? formatHex(mix(rgb(popover, bg), fg, 0.08))
  const accentForeground = first('accent-foreground', 'on-accent') ?? on(accent)
  const border = first('border', 'outline') ?? blend(0.12)
  const ring = first('ring') ?? primary

  // Muted text has to stay readable (4.5:1) on both the page and a card. The
  // spec's `neutral` is used when it is; otherwise a grey is mixed, starting at
  // 60% of the way to the foreground and darkening until it passes.
  const surfaces = [bg, rgb(card, bg)]
  const readable = (color: Rgb) => surfaces.every((surface) => contrastRatio(color, surface) >= 4.5)
  const mutedForeground = (): string => {
    const neutral = first('neutral')
    const neutralRgb = neutral !== undefined ? parseColor(neutral) : null
    if (neutral !== undefined && neutralRgb && readable(neutralRgb)) return neutral
    let t = 0.6
    while (t < 1 && !readable(mix(bg, fg, t))) t += 0.02
    return blend(Math.min(t, 1))
  }

  const vars: Record<string, string> = {
    background,
    foreground,
    card,
    'card-foreground': cardForeground,
    popover,
    'popover-foreground': first('popover-foreground') ?? foreground,
    primary,
    'primary-foreground': primaryForeground,
    secondary,
    'secondary-foreground': first('secondary-foreground', 'on-secondary') ?? on(secondary),
    muted,
    'muted-foreground': first('muted-foreground', 'on-surface-variant') ?? mutedForeground(),
    accent,
    'accent-foreground': accentForeground,
    destructive,
    border,
    input: first('input') ?? border,
    ring,
  }

  // Charts default to a ramp of the primary color, so they match the theme
  // instead of keeping the project's previous palette.
  const ramp = palette(rgb(primary, fg))
  CHART_STEPS.forEach((step, i) => {
    const name = `chart-${i + 1}`
    vars[name] = first(name) ?? ramp[step] ?? primary
  })

  Object.assign(vars, {
    sidebar: first('sidebar') ?? card,
    'sidebar-foreground': first('sidebar-foreground') ?? cardForeground,
    'sidebar-primary': first('sidebar-primary') ?? primary,
    'sidebar-primary-foreground': first('sidebar-primary-foreground') ?? primaryForeground,
    'sidebar-accent': first('sidebar-accent') ?? accent,
    'sidebar-accent-foreground': first('sidebar-accent-foreground') ?? accentForeground,
    'sidebar-border': first('sidebar-border') ?? border,
    'sidebar-ring': first('sidebar-ring') ?? ring,
  })
  return vars
}
