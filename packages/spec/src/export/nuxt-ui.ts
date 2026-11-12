import { contrastRatio, formatHex, mix, palette, parseColor } from '../color.ts'
import { tokensForMode } from '../resolve.ts'
import type { StrictSpec } from '../types.ts'
import { semanticColors } from './semantic.ts'
import { block, fontRoles, slug } from './shared.ts'

export interface NuxtUiTheme {
  /** Add to your main stylesheet, after `@import "tailwindcss"` and `@import "@nuxt/ui"`. */
  css: string
  /** Merge into `app.config.ts` under `ui.colors`. */
  colors: Record<string, string>
  /** Ready-to-paste `app.config.ts`. */
  appConfig: string
}

/** Nuxt UI's semantic color aliases, and the spec token names that can fill each. */
const ALIASES: Record<string, string[]> = {
  primary: ['primary'],
  secondary: ['secondary'],
  success: ['success', 'positive'],
  info: ['info'],
  warning: ['warning', 'caution'],
  error: ['error', 'destructive', 'danger'],
  neutral: ['neutral', 'gray', 'grey'],
}

/** A spec that names any of these has its own page colors, which Nuxt UI must not replace. */
const SURFACE_TOKENS = ['background', 'surface', 'foreground', 'on-background', 'on-surface', 'text']

/**
 * Nuxt UI takes its page background, text and border colors from the neutral
 * palette, not from the theme. These pin them to the spec's own colors; the
 * in-between shades (muted text, raised backgrounds) are mixed from the
 * background and foreground.
 */
function surfaceVars(colors: Record<string, string>): [string, string][] {
  if (!SURFACE_TOKENS.some((name) => name in colors)) return []
  const semantic = semanticColors(colors)
  const value = (name: string): string => semantic[name] ?? ''
  const bg = parseColor(value('background'))
  const fg = parseColor(value('foreground'))
  if (!bg || !fg) return []
  const blend = (t: number) => formatHex(mix(bg, fg, t))
  const border = parseColor(value('border')) ?? mix(bg, fg, 0.12)
  // Nuxt UI draws hover and selected states with `elevated` at half opacity.
  // A fixed mix is too faint on very dark backgrounds, so the step grows until
  // the half-opacity result stands out from the background (contrast 1.1).
  let half = 0.04
  while (half < 0.25 && contrastRatio(mix(bg, fg, half), bg) < 1.1) half += 0.01
  const elevated = half * 2
  return [
    ['--ui-bg', value('background')],
    ['--ui-bg-muted', value('card') !== value('background') ? value('card') : value('muted')],
    ['--ui-bg-elevated', blend(elevated)],
    ['--ui-bg-accented', blend(elevated + 0.06)],
    ['--ui-bg-inverted', value('foreground')],
    ['--ui-text-dimmed', blend(0.45)],
    ['--ui-text-muted', value('muted-foreground')],
    ['--ui-text-toned', blend(0.75)],
    ['--ui-text', value('foreground')],
    ['--ui-text-highlighted', value('foreground')],
    ['--ui-text-inverted', value('background')],
    ['--ui-border', value('border')],
    ['--ui-border-muted', value('border')],
    ['--ui-border-accented', formatHex(mix(border, fg, 0.15))],
    ['--ui-border-inverted', value('foreground')],
  ]
}

/**
 * Nuxt UI's `--ui-radius` is its smallest step: buttons and inputs use
 * `rounded-md`, which is 1.5 times it. The spec's medium radius is divided by
 * 1.5 so those components come out at exactly the spec's value.
 */
function baseRadius(radius: string): string {
  const match = /^(-?\d*\.?\d+)([a-z%]*)$/i.exec(radius.trim())
  if (!match) return `calc(${radius} / 1.5)`
  const scaled = Math.round((Number(match[1]) / 1.5) * 10000) / 10000
  return `${scaled}${match[2] || 'px'}`
}

/**
 * Nuxt UI theme. Nuxt UI wants a full 50–950 scale per semantic color, so each
 * matching spec color is expanded into one (keeping the exact spec value at
 * its nearest step) and registered under a `<theme>-<alias>` palette name.
 *
 * Nuxt UI paints with shade 500 (400 in dark mode) by default, which is rarely
 * the spec's exact color, so `--ui-<alias>` is pinned to the spec value, and
 * to the dark mode's value under `.dark` when the spec declares one.
 *
 * Page colors are pinned the same way. A spec without a dark mode pins them
 * for light mode only, so the app's dark mode keeps working on Nuxt UI's
 * defaults.
 */
export function toNuxtUi(spec: StrictSpec): NuxtUiTheme {
  const prefix = slug(spec.name) || 'theme'
  const theme: [string, string][] = []
  const colors: Record<string, string> = {}
  const root: [string, string][] = []
  const dark: [string, string][] = []
  const darkColors = spec.strict.modes.dark ? tokensForMode(spec, 'dark').colors : null

  for (const [alias, candidates] of Object.entries(ALIASES)) {
    const tokenName = candidates.find((name) => name in spec.colors)
    if (!tokenName) continue
    const rgb = parseColor(spec.colors[tokenName] ?? '')
    if (!rgb) continue
    const paletteName = `${prefix}-${alias}`
    for (const [step, hex] of Object.entries(palette(rgb))) {
      theme.push([`--color-${paletteName}-${step}`, hex])
    }
    colors[alias] = paletteName
    if (alias === 'neutral') continue // Nuxt UI has no single --ui-neutral variable
    root.push([`--ui-${alias}`, spec.colors[tokenName] ?? ''])
    const darkValue = darkColors?.[tokenName]
    if (darkValue !== undefined) dark.push([`--ui-${alias}`, darkValue])
  }

  const fonts = fontRoles(spec.typography)
  if (fonts.sans) theme.push(['--font-sans', fonts.sans])
  if (fonts.mono) theme.push(['--font-mono', fonts.mono])

  const radius = spec.rounded.md ?? spec.rounded.default ?? Object.values(spec.rounded)[0]
  if (radius !== undefined) root.push(['--ui-radius', baseRadius(radius)])

  const lightSurfaces = surfaceVars(spec.colors)
  let lightOnly: [string, string][] = []
  if (darkColors) {
    root.push(...lightSurfaces)
    dark.push(...surfaceVars(darkColors))
  } else {
    lightOnly = lightSurfaces
  }

  const css = [
    `/* ${spec.name} — generated by @strictthemes/spec */\n`,
    block('@theme static', theme),
    block(':root', root),
    block(':root:not(.dark)', lightOnly),
    block('.dark', dark),
  ]
    .filter(Boolean)
    .join('\n')

  const lines = Object.entries(colors).map(([alias, name]) => `      ${alias}: '${name}',`)
  const appConfig = `export default defineAppConfig({\n  ui: {\n    colors: {\n${lines.join('\n')}\n    },\n  },\n})\n`

  return { css, colors, appConfig }
}
