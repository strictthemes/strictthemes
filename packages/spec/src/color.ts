/** sRGB, gamma-encoded, each channel 0..1. */
export interface Rgb {
  r: number
  g: number
  b: number
  a: number
}

export interface Oklab {
  l: number
  a: number
  b: number
}

export interface Oklch {
  l: number
  c: number
  h: number
}

const NAMED: Record<string, Rgb> = {
  black: { r: 0, g: 0, b: 0, a: 1 },
  white: { r: 1, g: 1, b: 1, a: 1 },
  transparent: { r: 0, g: 0, b: 0, a: 0 },
}

const NUMBER = /^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(%|deg)?$/

function num(token: string | undefined, percentScale: number): number | null {
  if (token === undefined) return null
  if (token === 'none') return 0
  const m = NUMBER.exec(token)
  if (!m) return null
  const n = Number(m[1])
  return m[2] === '%' ? (n / 100) * percentScale : n
}

function parseHex(s: string): Rgb | null {
  const hex = s.slice(1)
  if (!/^[0-9a-f]+$/.test(hex)) return null
  const full =
    hex.length === 3 || hex.length === 4
      ? [...hex].map((ch) => ch + ch).join('')
      : hex
  if (full.length !== 6 && full.length !== 8) return null
  const at = (i: number) => parseInt(full.slice(i, i + 2), 16) / 255
  return { r: at(0), g: at(2), b: at(4), a: full.length === 8 ? at(6) : 1 }
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hue = (((h % 360) + 360) % 360) / 30
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + hue) % 12
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  return [f(0), f(8), f(4)]
}

const toLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
const toGamma = (c: number) =>
  c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055

export function oklabToRgb(lab: Oklab, alpha = 1): Rgb {
  const l = (lab.l + 0.3963377774 * lab.a + 0.2158037573 * lab.b) ** 3
  const m = (lab.l - 0.1055613458 * lab.a - 0.0638541728 * lab.b) ** 3
  const s = (lab.l - 0.0894841775 * lab.a - 1.291485548 * lab.b) ** 3
  return {
    r: toGamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: toGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: toGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
    a: alpha,
  }
}

export function rgbToOklab(rgb: Rgb): Oklab {
  const r = toLinear(rgb.r)
  const g = toLinear(rgb.g)
  const b = toLinear(rgb.b)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return {
    l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  }
}

export function oklchToRgb(lch: Oklch, alpha = 1): Rgb {
  const rad = (lch.h * Math.PI) / 180
  return oklabToRgb(
    { l: lch.l, a: lch.c * Math.cos(rad), b: lch.c * Math.sin(rad) },
    alpha,
  )
}

export function rgbToOklch(rgb: Rgb): Oklch {
  const lab = rgbToOklab(rgb)
  const h = (Math.atan2(lab.b, lab.a) * 180) / Math.PI
  return { l: lab.l, c: Math.hypot(lab.a, lab.b), h: (h + 360) % 360 }
}

/**
 * Parses hex, rgb(), hsl(), oklch(), oklab() and the names black, white and
 * transparent. Returns null for anything else, including other valid CSS
 * colors (see `isCssColor`).
 */
export function parseColor(input: string): Rgb | null {
  const s = input.trim().toLowerCase()
  const named = NAMED[s]
  if (named) return { ...named }
  if (s.startsWith('#')) return parseHex(s)

  const fn = /^(rgba?|hsla?|oklch|oklab)\((.*)\)$/.exec(s)
  if (!fn) return null
  const parts = (fn[2] ?? '').trim().split(/[\s,/]+/).filter(Boolean)
  if (parts.length < 3 || parts.length > 4) return null
  const a = parts[3] === undefined ? 1 : num(parts[3], 1)
  if (a === null) return null

  const kind = fn[1] ?? ''
  if (kind.startsWith('rgb')) {
    const [r, g, b] = [0, 1, 2].map((i) => num(parts[i], 255))
    if (r == null || g == null || b == null) return null
    return { r: r / 255, g: g / 255, b: b / 255, a }
  }
  if (kind.startsWith('hsl')) {
    const h = num(parts[0], 360)
    const sat = num(parts[1]?.replace('%', ''), 1)
    const lig = num(parts[2]?.replace('%', ''), 1)
    if (h == null || sat == null || lig == null) return null
    const [r, g, b] = hslToRgb(h, sat / 100, lig / 100)
    return { r, g, b, a }
  }
  const l = num(parts[0], 1)
  if (l == null) return null
  if (kind === 'oklch') {
    const c = num(parts[1], 0.4)
    const h = num(parts[2], 360)
    if (c == null || h == null) return null
    return oklchToRgb({ l, c, h }, a)
  }
  const la = num(parts[1], 0.4)
  const lb = num(parts[2], 0.4)
  if (la == null || lb == null) return null
  return oklabToRgb({ l, a: la, b: lb }, a)
}

/** True for anything that is plausibly a CSS color, parseable by us or not. */
export function isCssColor(input: string): boolean {
  const s = input.trim().toLowerCase()
  if (parseColor(s)) return true
  if (/^[a-z]+$/.test(s)) return true
  return /^(color|lab|lch|hwb|color-mix|light-dark|var)\(.+\)$/.test(s)
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

export function inGamut(rgb: Rgb, epsilon = 0.0005): boolean {
  return [rgb.r, rgb.g, rgb.b].every((c) => c >= -epsilon && c <= 1 + epsilon)
}

export function formatHex(rgb: Rgb): string {
  const hex = (c: number) =>
    Math.round(clamp01(c) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${hex(rgb.r)}${hex(rgb.g)}${hex(rgb.b)}`
}

export function relativeLuminance(rgb: Rgb): number {
  return (
    0.2126 * toLinear(clamp01(rgb.r)) +
    0.7152 * toLinear(clamp01(rgb.g)) +
    0.0722 * toLinear(clamp01(rgb.b))
  )
}

/** WCAG 2 contrast ratio (1..21). Alpha is ignored: colors are treated as opaque. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** Euclidean distance in OKLab. Roughly: 0.02 is a just-noticeable difference. */
export function deltaE(a: Rgb, b: Rgb): number {
  const x = rgbToOklab(a)
  const y = rgbToOklab(b)
  return Math.hypot(x.l - y.l, x.a - y.a, x.b - y.b)
}

/** Linear mix in sRGB: t = 0 gives `a`, t = 1 gives `b`. */
export function mix(a: Rgb, b: Rgb, t: number): Rgb {
  const m = (x: number, y: number) => x + (y - x) * t
  return { r: m(a.r, b.r), g: m(a.g, b.g), b: m(a.b, b.b), a: m(a.a, b.a) }
}

/** Whichever of the candidates contrasts most with `background`. */
export function bestContrast(background: Rgb, candidates: Rgb[]): Rgb {
  let best = candidates[0] ?? { r: 0, g: 0, b: 0, a: 1 }
  for (const c of candidates) {
    if (contrastRatio(background, c) > contrastRatio(background, best)) best = c
  }
  return best
}

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
const LIGHTNESS = [0.975, 0.94, 0.885, 0.82, 0.72, 0.63, 0.54, 0.46, 0.39, 0.32, 0.24]
const CHROMA = [0.12, 0.25, 0.45, 0.7, 0.9, 1, 1, 0.92, 0.8, 0.68, 0.5]

function clipChroma(lch: Oklch): Rgb {
  const direct = oklchToRgb(lch)
  if (inGamut(direct)) return direct
  let lo = 0
  let hi = lch.c
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    if (inGamut(oklchToRgb({ ...lch, c: mid }))) lo = mid
    else hi = mid
  }
  return oklchToRgb({ ...lch, c: lo })
}

/**
 * Builds a 50–950 scale around one color. The step whose lightness is closest
 * to the input keeps the input's exact value.
 */
export function palette(base: Rgb): Record<number, string> {
  const lch = rgbToOklch(base)
  let anchor = 0
  LIGHTNESS.forEach((l, i) => {
    if (Math.abs(l - lch.l) < Math.abs((LIGHTNESS[anchor] ?? 0) - lch.l)) anchor = i
  })
  const anchorChroma = CHROMA[anchor] ?? 1
  const out: Record<number, string> = {}
  STEPS.forEach((step, i) => {
    if (i === anchor) {
      out[step] = formatHex(base)
      return
    }
    const c = Math.min(0.37, (lch.c * (CHROMA[i] ?? 1)) / anchorChroma)
    out[step] = formatHex(clipChroma({ l: LIGHTNESS[i] ?? 0.5, c, h: lch.h }))
  })
  return out
}
