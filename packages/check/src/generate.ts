import { contrastRatio, deltaE, formatHex, parseColor, rgbToOklch, type Rgb, type StrictSpec } from '@strictthemes/spec'
import type { ElementData, PageData, Rgba } from './collect.ts'

/** What was measured on one page, in each color mode it has. */
export interface MeasuredPage {
  /** The page's address or path, for the notes. */
  path: string
  light: PageData
  /** The same page with the dark mode asked for, when it then looks different. */
  dark?: PageData
}

export interface GenerateOptions {
  /** The spec's name: a site's or a product's. */
  name: string
  /** Where the pages were measured, for the notes. */
  source: string
  /** The day of the measurement, as YYYY-MM-DD. */
  date: string
}

export interface GeneratedSpec {
  /** The whole DESIGN.md. */
  source: string
  /** What the generator could not settle from the pages, in plain sentences. */
  notes: string[]
}

const hexOf = (color: Rgba | [number, number, number]): string =>
  formatHex({ r: color[0] / 255, g: color[1] / 255, b: color[2] / 255, a: 1 }).toUpperCase()
const rgbOf = (hex: string): Rgb => parseColor(hex) as Rgb
const ratio = (a: string, b: string): number => contrastRatio(rgbOf(a), rgbOf(b))
const chroma = (hex: string): number => rgbToOklch(rgbOf(hex)).c
/** Chroma above this reads as a color, not a grey. */
const CHROMATIC = 0.04
/** Colors closer than this are one color measured twice. */
const SAME = 0.012

/** How a color is used across the pages. */
interface Use {
  hex: string
  text: number
  fill: number
  /** The area it fills, in px². */
  area: number
  border: number
  /** How many links and buttons it fills. */
  action: number
  /** How many links are set in it. */
  link: number
  /** The text colors seen on it, with how often. */
  on: Map<string, number>
}

const bump = <K>(map: Map<K, number>, key: K, by = 1): void => void map.set(key, (map.get(key) ?? 0) + by)
const top = <K>(map: Map<K, number>): K | undefined => [...map].sort((a, b) => b[1] - a[1])[0]?.[0]

const visible = (element: ElementData): boolean => !element.hidden && element.width > 0 && element.height > 0

/** Counts how every color on the pages is used, with near-identical colors merged into the commonest. */
function colorUses(pages: PageData[]): { uses: Map<string, Use>; same: (hex: string) => string } {
  const raw = new Map<string, Use>()
  const use = (hex: string): Use => {
    let entry = raw.get(hex)
    if (!entry) raw.set(hex, (entry = { hex, text: 0, fill: 0, area: 0, border: 0, action: 0, link: 0, on: new Map() }))
    return entry
  }
  for (const page of pages) {
    for (const element of page.elements) {
      if (!visible(element)) continue
      const isSvg = element.tag === 'svg'
      if (element.hasText && element.color[3] > 0) {
        const text = hexOf(element.color)
        use(text).text++
        if (element.tag === 'a') use(text).link++
        if (element.backdrop) bump(use(hexOf(element.backdrop)).on, text)
      }
      if (!isSvg && element.background[3] > 0.5) {
        const fill = use(hexOf(element.background))
        fill.fill++
        fill.area += element.width * element.height
        if (element.tag === 'a' || element.tag === 'button') fill.action++
      }
      if (!isSvg) for (const border of new Set(element.borders.filter((color) => color[3] > 0.5).map(hexOf))) use(border).border++
    }
  }
  const total = (entry: Use): number => entry.text + entry.fill + entry.border
  const ordered = [...raw.values()].sort((a, b) => total(b) - total(a))
  const canonical = new Map<string, string>()
  const kept: Use[] = []
  for (const entry of ordered) {
    const match = kept.find((other) => deltaE(rgbOf(other.hex), rgbOf(entry.hex)) <= SAME)
    if (!match) {
      kept.push(entry)
      canonical.set(entry.hex, entry.hex)
      continue
    }
    canonical.set(entry.hex, match.hex)
    match.text += entry.text
    match.fill += entry.fill
    match.area += entry.area
    match.border += entry.border
    match.action += entry.action
    match.link += entry.link
    for (const [text, count] of entry.on) bump(match.on, text, count)
  }
  const same = (hex: string): string => canonical.get(hex) ?? hex
  // The text colors seen on a fill are colors too: name them by the color they were merged into.
  for (const entry of kept) {
    const merged = new Map<string, number>()
    for (const [text, count] of entry.on) bump(merged, same(text), count)
    entry.on = merged
  }
  return { uses: new Map(kept.map((entry) => [entry.hex, entry])), same }
}

/** A name for a color no role claimed: `grey`, `blue`, `green`. */
function hueName(hex: string): string {
  const { l, c, h } = rgbToOklch(rgbOf(hex))
  if (c < CHROMATIC) return l > 0.97 ? 'white' : l < 0.2 ? 'black' : 'grey'
  if (c < 0.09 && l < 0.55 && h >= 20 && h < 110) return 'brown'
  if (h < 20 || h >= 345) return 'pink'
  if (h < 45) return 'red'
  if (h < 75) return 'orange'
  if (h < 110) return 'yellow'
  if (h < 165) return 'green'
  if (h < 215) return 'teal'
  if (h < 275) return 'blue'
  if (h < 320) return 'purple'
  return 'pink'
}

/** The text color to set on a fill: the one the pages use there when it can be read, or black or white. */
function textOn(fill: string, uses: Map<string, Use>, candidates: string[]): string {
  const measured = top(uses.get(fill)?.on ?? new Map<string, number>())
  if (measured !== undefined && ratio(measured, fill) >= 4.5) return measured
  return [...candidates, '#FFFFFF', '#000000'].sort((a, b) => ratio(b, fill) - ratio(a, fill))[0] as string
}

interface Palette {
  /** Token name to hex, in the order they are written. */
  colors: Map<string, string>
  /** What each token was seen as, for the notes. */
  seen: Map<string, string>
}

const times = (count: number, word: string): string => `${count} ${word}${count === 1 ? '' : 's'}`

/** Gives the colors of the pages their roles: the page, its text, the main action, and what is left. */
function paletteOf(pages: PageData[], notes: string[]): { palette: Palette; uses: Map<string, Use>; same: (hex: string) => string } {
  const { uses, same } = colorUses(pages)
  const all = [...uses.values()]
  const colors = new Map<string, string>()
  const seen = new Map<string, string>()
  const taken = new Set<string>()
  const set = (name: string, hex: string, what: string): void => {
    colors.set(name, hex)
    seen.set(name, what)
    taken.add(hex)
  }
  const free = (entry: Use): boolean => !taken.has(entry.hex)

  const background = same(hexOf(pages[0]?.canvas ?? [255, 255, 255]))
  set('background', background, 'the page itself')

  const texts = all.filter((entry) => entry.text > 0).sort((a, b) => b.text - a.text)
  // The main text color: of the colors much text is set in, the one that stands out most from the page.
  // Counting alone would pick the grey of captions on a page that has many.
  const much = texts.filter((entry) => entry.text >= (texts[0]?.text ?? 0) * 0.25)
  const foreground = [...much].sort((a, b) => ratio(b.hex, background) - ratio(a.hex, background))[0]?.hex ?? '#000000'
  if (ratio(foreground, background) < 4.5) {
    notes.push(`The commonest text color, ${foreground}, is ${ratio(foreground, background).toFixed(2)}:1 on the page's ${background}: under the 4.5:1 that WCAG AA asks for.`)
  }

  // The main action: what fills the most links and buttons. A color wins over a grey.
  const actions = all.filter((entry) => entry.action > 0 && entry.hex !== background).sort((a, b) => b.action - a.action)
  const links = all.filter((entry) => entry.link > 0 && chroma(entry.hex) > CHROMATIC).sort((a, b) => b.link - a.link)
  const fills = all.filter((entry) => entry.fill > 0 && chroma(entry.hex) > CHROMATIC && entry.hex !== background).sort((a, b) => b.fill - a.fill)
  const primary =
    actions.find((entry) => chroma(entry.hex) > CHROMATIC) ?? links[0] ?? actions[0] ?? fills[0] ?? uses.get(foreground)
  if (primary) {
    const what = primary.action > 0
      ? `the fill of ${times(primary.action, 'link or button').replace('link or buttons', 'links and buttons')}`
      : primary.link > 0 ? `the color of ${times(primary.link, 'link')}` : `seen ${times(primary.text + primary.fill, 'time')}`
    set('primary', primary.hex, what)
    set('on-primary', textOn(primary.hex, uses, [background, foreground]), 'the text on the primary color')
    if (primary.action === 0) notes.push(`No link or button on the pages has a colored fill, so "primary" is ${primary.hex}, ${what}. Check that it is the color you would give a main button.`)
  }
  const secondary = actions.find(free)
  if (secondary && secondary.action >= 2) {
    set('secondary', secondary.hex, `the fill of ${times(secondary.action, 'other link or button').replace('link or buttons', 'links and buttons')}`)
    set('on-secondary', textOn(secondary.hex, uses, [foreground, background]), 'the text on the secondary color')
  }

  const muted = texts.find((entry) => free(entry) && entry.hex !== foreground && deltaE(rgbOf(entry.hex), rgbOf(foreground)) > 0.05 && chroma(entry.hex) < 0.08 && ratio(entry.hex, background) >= 3)
  if (muted) set('neutral', muted.hex, `quieter text, ${times(muted.text, 'time')}`)

  // A surface is a step away from the page, not a colored band.
  const surfaces = all
    .filter((entry) => free(entry) && entry.hex !== foreground && entry.fill > 0 && ratio(foreground, entry.hex) >= 4.5 && ratio(entry.hex, background) < 1.5 && chroma(entry.hex) < 0.08)
    .sort((a, b) => b.area - a.area)
  const surface = surfaces[0]
  if (surface) set('surface', surface.hex, `the fill of ${times(surface.fill, 'box')}, the largest area after the page`.replace('boxs', 'boxes'))

  colors.set('foreground', foreground)
  seen.set('foreground', `the commonest text color, ${times(uses.get(foreground)?.text ?? 0, 'time')}`)
  taken.add(foreground)

  const border = all.filter((entry) => entry.border > 0 && entry.hex !== foreground).sort((a, b) => b.border - a.border)[0]
    ?? all.filter((entry) => entry.border > 0).sort((a, b) => b.border - a.border)[0]
  if (border && !taken.has(border.hex)) set('border', border.hex, `the commonest border, ${times(border.border, 'time')}`)

  // What is left, commonest first: each gets a name from its hue, and a text color when it is a fill.
  const total = all.reduce((sum, entry) => sum + entry.text + entry.fill + entry.border, 0)
  const rest = all
    .filter(free)
    .map((entry) => ({ entry, count: entry.text + entry.fill + entry.border }))
    .filter(({ count }) => count >= Math.max(3, total * 0.004))
    .sort((a, b) => b.count - a.count)
  const dropped = all.filter(free).length - Math.min(rest.length, 10)
  const counts = new Map<string, number>()
  for (const { entry, count } of rest.slice(0, 10)) {
    const base = hueName(entry.hex)
    bump(counts, base)
    const name = counts.get(base) === 1 && !colors.has(base) ? base : `${base}-${counts.get(base)}`
    const parts = [entry.text > 0 ? `text ${times(entry.text, 'time')}` : '', entry.fill > 0 ? `a fill ${times(entry.fill, 'time')}` : '', entry.border > 0 ? `a border ${times(entry.border, 'time')}` : ''].filter(Boolean)
    set(name, entry.hex, parts.join(', ') || `seen ${times(count, 'time')}`)
    if (entry.fill > 0 && entry.on.size > 0) {
      set(`on-${name}`, textOn(entry.hex, uses, [foreground, background]), `the text on ${name}`)
      taken.delete(colors.get(`on-${name}`) as string)
      taken.add(entry.hex)
    }
  }
  if (dropped > 0) {
    notes.push(`${times(dropped, 'more color')} on the pages ${dropped === 1 ? 'is' : 'are'} used too rarely to earn a name, and ${dropped === 1 ? 'is' : 'are'} not in the spec. Strict Check will report ${dropped === 1 ? 'it' : 'them'} as off the theme: add ${dropped === 1 ? 'it' : 'the ones that belong'}, or replace ${dropped === 1 ? 'it' : 'the rest'} on the site.`)
  }
  return { palette: { colors, seen }, uses, same }
}

/**
 * The dark value of each color token: what the same elements show in dark
 * mode. Null when the two measurements are not of the same elements.
 */
function darkColors(palette: Palette, same: (hex: string) => string, pages: MeasuredPage[]): Map<string, string> | null {
  const votes = new Map<string, Map<string, number>>()
  const vote = (light: string, dark: string): void => {
    let entry = votes.get(light)
    if (!entry) votes.set(light, (entry = new Map()))
    bump(entry, dark)
  }
  const onVotes = new Map<string, Map<string, number>>()
  for (const page of pages) {
    if (!page.dark) continue
    if (page.dark.elements.length !== page.light.elements.length) return null
    for (const [index, light] of page.light.elements.entries()) {
      const dark = page.dark.elements[index]
      if (!dark || dark.tag !== light.tag) return null
      if (!visible(light)) continue
      if (light.hasText && light.color[3] > 0 && dark.color[3] > 0) {
        vote(same(hexOf(light.color)), hexOf(dark.color))
        // Text on a fill may turn with the fill, apart from the same color used elsewhere.
        if (light.backdrop) {
          const key = `${same(hexOf(light.backdrop))} ${same(hexOf(light.color))}`
          let entry = onVotes.get(key)
          if (!entry) onVotes.set(key, (entry = new Map()))
          bump(entry, hexOf(dark.color))
        }
      }
      if (light.background[3] > 0.5 && dark.background[3] > 0.5) vote(same(hexOf(light.background)), hexOf(dark.background))
      for (const [side, border] of light.borders.entries()) {
        const other = dark.borders[side]
        if (border[3] > 0.5 && other && other[3] > 0.5) vote(same(hexOf(border)), hexOf(other))
      }
    }
  }
  const first = pages.find((page) => page.dark)
  if (!first?.dark) return null
  const result = new Map<string, string>()
  for (const [name, light] of palette.colors) {
    if (name === 'background') {
      result.set(name, hexOf(first.dark.canvas))
      continue
    }
    const fill = name.startsWith('on-') ? palette.colors.get(name.slice(3)) : undefined
    const dark = (fill !== undefined ? top(onVotes.get(`${fill} ${light}`) ?? new Map<string, number>()) : undefined) ?? top(votes.get(light) ?? new Map<string, number>())
    if (dark !== undefined) result.set(name, dark)
  }
  // Text on a fill has to be readable there in dark mode too: where the pages' own is not, black or white is.
  for (const [name, text] of result) {
    if (!name.startsWith('on-')) continue
    const fill = result.get(name.slice(3)) ?? palette.colors.get(name.slice(3))
    if (fill !== undefined && ratio(text, fill) < 4.5) result.set(name, ratio('#FFFFFF', fill) >= ratio('#000000', fill) ? '#FFFFFF' : '#000000')
  }
  return result
}

interface TypeToken {
  name: string
  size: number
  family: string
  weight: number
  /** A multiple of the size, or null when the pages leave it to the font. */
  lineHeight: number | null
  /** In em. */
  letterSpacing: number
  count: number
}

const FAMILY_SUFFIX = / (variable|var|vf)$/i
const GENERIC = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'math', 'emoji', 'fangsong', '-apple-system', 'blinkmacsystemfont'])

/** The type scale: the body size, one label size under it, and up to three heading sizes over it. */
function typeScale(pages: PageData[], notes: string[]): TypeToken[] {
  interface Size { size: number; count: number; family: Map<string, number>; weight: Map<number, number>; lineHeight: Map<number, number>; letterSpacing: Map<number, number> }
  const sizes = new Map<number, Size>()
  for (const page of pages) {
    for (const element of page.elements) {
      if (!visible(element) || !element.hasText || element.raised) continue
      const size = Math.round(element.fontSize * 2) / 2
      let entry = sizes.get(size)
      if (!entry) sizes.set(size, (entry = { size, count: 0, family: new Map(), weight: new Map(), lineHeight: new Map(), letterSpacing: new Map() }))
      entry.count++
      bump(entry.family, element.fontFamily.replace(FAMILY_SUFFIX, ''))
      bump(entry.weight, element.fontWeight)
      if (element.lineHeight > 0 && !['input', 'textarea', 'select'].includes(element.tag)) bump(entry.lineHeight, Math.round((element.lineHeight / element.fontSize) * 100) / 100)
      bump(entry.letterSpacing, Math.round((element.letterSpacing / element.fontSize) * 1000) / 1000)
    }
  }
  const all = [...sizes.values()]
  if (all.length === 0) return []
  const token = (name: string, entry: Size): TypeToken => ({
    name,
    size: entry.size,
    family: top(entry.family) ?? 'sans-serif',
    weight: top(entry.weight) ?? 400,
    lineHeight: top(entry.lineHeight) ?? null,
    letterSpacing: top(entry.letterSpacing) ?? 0,
    count: entry.count,
  })
  const byCount = [...all].sort((a, b) => b.count - a.count)
  // Body text is the commonest size a paragraph would be set in.
  const body = byCount.find((entry) => entry.size >= 14 && entry.size <= 20) ?? (byCount[0] as Size)
  const smaller = byCount.filter((entry) => entry.size < body.size)
  const larger = byCount.filter((entry) => entry.size > body.size).slice(0, 3).sort((a, b) => b.size - a.size)
  const names = larger.length >= 3 ? ['display', 'h1', 'h2'] : larger.length === 2 ? ['h1', 'h2'] : ['h1']
  const tokens = [
    ...larger.map((entry, index) => token(names[index] as string, entry)),
    token('body', body),
    ...(smaller[0] ? [token('label', smaller[0])] : []),
  ]
  const left = all.length - tokens.length
  if (left > 0) {
    const rest = all.filter((entry) => !tokens.some((kept) => kept.size === entry.size)).sort((a, b) => b.count - a.count)
    notes.push(`The pages use ${times(all.length, 'text size')}. The spec keeps ${tokens.length}; the other ${left === 1 ? 'one is' : `${left} are`} ${rest.slice(0, 6).map((entry) => `${entry.size}px (${times(entry.count, 'time')})`).join(', ')}${rest.length > 6 ? ' and more' : ''}. Strict Check will report text in ${left === 1 ? 'that size' : 'those sizes'}.`)
  }
  return tokens
}

const SPACING_NAMES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']

/** The spacing scale: the paddings, margins and gaps the pages use most, up to eight steps. */
function spacingScale(pages: PageData[], notes: string[]): number[] {
  const counts = new Map<number, number>()
  for (const page of pages) {
    for (const element of page.elements) {
      if (!visible(element)) continue
      for (const { px } of element.spacing) if (px > 2) bump(counts, Math.round(px))
    }
  }
  const total = [...counts.values()].reduce((sum, count) => sum + count, 0)
  if (total === 0) return [4, 8, 16, 24, 32]
  const ordered = [...counts].sort((a, b) => b[1] - a[1])
  const kept = ordered.filter(([, count]) => count / total >= 0.02).slice(0, SPACING_NAMES.length)
  const covered = kept.reduce((sum, [, count]) => sum + count, 0)
  if (covered < total) {
    notes.push(`The spacing scale keeps the ${kept.length} sizes that make up ${Math.round((covered / total) * 100)}% of the paddings, margins and gaps on the pages. ${times(ordered.length - kept.length, 'other size')} ${ordered.length - kept.length === 1 ? 'is' : 'are'} used too: ${ordered.slice(kept.length, kept.length + 8).map(([px]) => `${px}px`).join(', ')}${ordered.length - kept.length > 8 ? ' and more' : ''}.`)
  }
  return kept.map(([px]) => px).sort((a, b) => a - b)
}

/** The corners: up to three radii the pages use most, and the largest box that is fully round. */
function cornerScale(pages: PageData[]): { radii: number[]; full: number } {
  const counts = new Map<number, number>()
  let full = 0
  for (const page of pages) {
    for (const element of page.elements) {
      if (!visible(element) || !element.boxed || element.tag === 'svg') continue
      const side = Math.min(element.width, element.height)
      for (const radius of new Set(element.radii)) {
        if (radius === 0) continue
        if (radius === -1 || radius >= side / 2) {
          // A wide pill counts by its height. A huge round shape is an illustration, not a control.
          if (side <= 96) full = Math.max(full, Math.ceil(side))
        } else bump(counts, Math.round(radius))
      }
    }
  }
  const radii = [...counts].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([px]) => px).sort((a, b) => a - b)
  return { radii, full }
}

const quote = (value: string): string => JSON.stringify(value)
const number = (value: number): string => String(Math.round(value * 1000) / 1000)

/**
 * Writes a Strict spec from what was measured on a site's pages: the colors
 * with a role for each, the type scale, the spacing scale, the corners, a dark
 * mode when the pages have one, and a `strict` block that holds new UI to them.
 *
 * It is a starting point. It records what the pages do, not what was meant:
 * the prose says so, and says what to rewrite.
 */
export function generateSpec(measured: MeasuredPage[], options: GenerateOptions): GeneratedSpec {
  const notes: string[] = []
  const light = measured.map((page) => page.light)
  const { palette, same } = paletteOf(light, notes)
  const { colors, seen } = palette
  const type = typeScale(light, notes)
  const spacing = spacingScale(light, notes)
  const { radii, full } = cornerScale(light)
  const hasDark = measured.some((page) => page.dark)
  const dark = hasDark ? darkColors(palette, same, measured) : null
  if (hasDark && !dark) notes.push('The pages look different in dark mode, but not element for element, so the dark colors could not be matched to the light ones. The spec has a light mode only.')

  const background = colors.get('background') as string
  const foreground = colors.get('foreground') as string
  /** The lowest contrast of a fill and its text across the modes, or 0 when one of the two is not a token. */
  const lowest = (fillName: string, textName: string): number => {
    const fill = colors.get(fillName)
    const text = colors.get(textName)
    if (fill === undefined || text === undefined) return 0
    const inDark = dark ? ratio(dark.get(textName) ?? text, dark.get(fillName) ?? fill) : Infinity
    return Math.min(ratio(text, fill), inDark)
  }
  // A pair under 4.5:1 in any mode would be an error in the spec, so it is left out and noted.
  const holds = (fillName: string, textName: string): boolean => lowest(fillName, textName) >= 4.5

  // A system font stack differs from machine to machine, so there is no one family to hold a page to.
  const systemFonts = type.some((token) => GENERIC.has(token.family.toLowerCase()))
  if (systemFonts) notes.push('Some of the text is set in a system font, which is a different font on each machine, so the spec does not restrict fonts. Name the fonts and set `strict.typography.fonts` to `declared` to have them checked.')
  const cornerNames = radii.length === 3 ? ['sm', 'md', 'lg'] : radii.length === 2 ? ['sm', 'md'] : ['md']
  const typeNames = new Set(type.map((token) => token.name))
  const spacingName = (index: number): string => SPACING_NAMES[index] as string
  const nearest = (px: number): string => {
    let best = 0
    for (const [index, value] of spacing.entries()) if (Math.abs(value - px) < Math.abs((spacing[best] as number) - px)) best = index
    return `{spacing.${spacingName(best)}}`
  }
  const buttonCorner = radii.length > 0 ? `{rounded.${cornerNames[Math.min(1, cornerNames.length - 1)]}}` : undefined

  const yaml: string[] = ['---', 'version: alpha', `name: ${quote(options.name)}`, `description: ${quote(`Measured from ${options.source} on ${options.date}. A starting point: the tokens are what the pages use, and the notes need your words.`)}`, 'colors:']
  for (const [name, hex] of colors) yaml.push(`  ${name}: ${quote(hex)}`)
  yaml.push('typography:')
  for (const token of type) {
    yaml.push(`  ${token.name}:`, `    fontFamily: ${quote(token.family)}`, `    fontSize: ${number(token.size)}px`, `    fontWeight: ${token.weight}`)
    if (token.lineHeight !== null) yaml.push(`    lineHeight: ${number(token.lineHeight)}`)
    if (token.letterSpacing !== 0) yaml.push(`    letterSpacing: ${number(token.letterSpacing)}em`)
  }
  yaml.push('rounded:')
  if (radii.length === 0) yaml.push('  none: 0px')
  for (const [index, radius] of radii.entries()) yaml.push(`  ${cornerNames[index]}: ${radius}px`)
  yaml.push('spacing:')
  for (const [index, px] of spacing.entries()) yaml.push(`  ${spacingName(index)}: ${px}px`)

  const components: string[] = []
  if (holds('primary', 'on-primary')) {
    components.push('  button-primary:', '    backgroundColor: "{colors.primary}"', '    textColor: "{colors.on-primary}"')
    if (typeNames.has('label') || typeNames.has('body')) components.push(`    typography: "{typography.${typeNames.has('label') ? 'label' : 'body'}}"`)
    if (buttonCorner) components.push(`    rounded: "${buttonCorner}"`)
    components.push(`    padding: "${nearest(8)} ${nearest(16)}"`)
  } else if (colors.has('primary')) {
    notes.push(`No text color reaches 4.5:1 on the primary color${dark ? ' in both modes' : ''} (the best is ${lowest('primary', 'on-primary').toFixed(2)}:1), so the spec lists no primary button. Deepen or lighten the primary color.`)
  }
  if (holds('secondary', 'on-secondary')) {
    components.push('  button-secondary:', '    backgroundColor: "{colors.secondary}"', '    textColor: "{colors.on-secondary}"')
  }
  if (colors.has('surface') && holds('surface', 'foreground')) {
    components.push('  card:', '    backgroundColor: "{colors.surface}"', '    textColor: "{colors.foreground}"')
    if (radii.length > 0) components.push(`    rounded: "{rounded.${cornerNames.at(-1)}}"`)
  }
  if (holds('background', 'foreground')) {
    components.push('  page:', '    backgroundColor: "{colors.background}"', '    textColor: "{colors.foreground}"')
    if (typeNames.has('body')) components.push('    typography: "{typography.body}"')
  }
  if (components.length > 0) yaml.push('components:', ...components)

  yaml.push(
    'strict:',
    '  version: 1',
    '  contrast: AA',
    '  colors:',
    '    allow: tokens',
    '    tolerance: 0.02',
    '  spacing:',
    '    allow: scale',
    '    extra: ["0", "1px", "2px"]',
    '  rounded:',
    '    allow: scale',
    ...(full > 0 ? [`    full: ${full}px`] : []),
    '  typography:',
    '    allow: scale',
    `    fonts: ${systemFonts ? 'any' : 'declared'}`,
    '  tells:',
    '    purple-gradient: warn',
    '    emoji-icons: warn',
    '    nested-cards: warn',
    '    glow-shadows: warn',
  )
  if (dark) {
    yaml.push('  modes:', '    dark:', '      colors:')
    for (const [name] of colors) {
      const value = dark.get(name)
      if (value !== undefined) yaml.push(`        ${name}: ${quote(value)}`)
    }
  }
  yaml.push('---', '')

  const families = [...new Set(type.map((token) => token.family))]
  const shadows = light.flatMap((page) => page.elements).filter((element) => visible(element) && element.boxShadow !== 'none' && /[1-9]\d*(\.\d+)?px/.test(element.boxShadow)).length
  const paths = measured.map((page) => page.path)
  const list = (items: string[]): string => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`)
  const prose: string[] = [
    '## Overview',
    '',
    `This spec was measured from ${options.source} on ${options.date}: ${list(paths.map((path) => `\`${path}\``))}, at 1280px${dark ? ', in light and dark mode' : ''}. It records what ${paths.length === 1 ? 'that page uses' : 'those pages use'}, not what was meant. Replace this paragraph with two or three sentences on who the product is for and how it should feel: an agent reads them before it builds.`,
    '',
    '## Colors',
    '',
    'Each color has the role the pages give it most often. Say here, in your own words, what each one is for and where it must not be used.',
    '',
    ...[...colors].map(([name, hex]) => `- **${name}** (${hex}${dark?.get(name) && dark.get(name) !== hex ? `, ${dark.get(name)} in dark mode` : ''}): ${seen.get(name) ?? 'measured on the pages'}.`),
    '',
    '## Typography',
    '',
    `${list(families)} ${families.length === 1 ? 'sets' : 'set'} the pages. The scale has ${times(type.length, 'size')}:`,
    '',
    ...type.map((token) => `- **${token.name}:** ${number(token.size)}px ${token.family}, weight ${token.weight}${token.lineHeight !== null ? `, line height ${number(token.lineHeight)}` : ''}${token.letterSpacing !== 0 ? `, letter spacing ${number(token.letterSpacing)}em` : ''}. Seen ${times(token.count, 'time')}.`),
    '',
    'Use no size between these.',
    '',
    '## Layout',
    '',
    `Padding, margin and gap come from one scale: ${spacing.map((px) => `${px}px`).join(', ')}. Add here how wide the page's content is, how many columns it has and how it changes on a phone: none of that can be read from the numbers.`,
    '',
    '## Elevation & Depth',
    '',
    shadows === 0
      ? 'Nothing on the pages casts a shadow. Depth comes from fills and borders.'
      : `${times(shadows, 'element')} on the pages ${shadows === 1 ? 'casts' : 'cast'} a shadow. Say here which kinds of box may have one.`,
    '',
    '## Shapes',
    '',
    radii.length === 0
      ? `Corners are square.${full > 0 ? ` A box up to ${full}px across may be fully round.` : ''}`
      : `Corners are ${list(radii.map((px) => `${px}px`))}.${full > 0 ? ` A box up to ${full}px across may be fully round, such as a pill button or an avatar.` : ' Nothing is fully round.'}`,
    '',
    '## Components',
    '',
    components.length > 0
      ? 'The front matter lists the pairs of fill and text that were measured and can be read. Describe each component here: when to use it, and what must not go inside it.'
      : 'No pair of fill and text on the pages reached 4.5:1, so the front matter lists no component. Fix the colors first.',
    '',
    "## Do's and Don'ts",
    '',
    '- Do use only the colors, sizes, spacing steps and corners above.',
    '- Do keep text at 4.5:1 or more against what is behind it.',
    "- Don't add a color, a text size or a font for one page.",
    "- Don't leave this list as it is: add what your team would say in a review.",
    '',
  ]
  return { source: `${yaml.join('\n')}\n${prose.join('\n')}`, notes }
}

export interface SkillOptions {
  /** Where the spec is, as the agent should open it: `DESIGN.md` for one in the project's root. */
  specPath: string
  /** The site the spec was measured from, for the description. */
  source?: string
}

/** A name a skill may have: lower-case letters, digits and hyphens. */
export const skillName = (name: string): string =>
  `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'site'}-design`

/**
 * Writes a skill (SKILL.md) for a spec: when to use it, the tokens in short,
 * the rules its `strict` block sets, and the check to run before finishing.
 * The spec stays the source of the values; the skill tells an agent to read it.
 */
export function generateSkill(spec: StrictSpec, options: SkillOptions): string {
  const name = skillName(spec.name ?? 'site')
  const title = spec.name ?? 'This site'
  const strict = spec.strict
  const dark = strict?.modes.dark?.colors ?? {}
  const description = [
    `Build UI that matches ${title}${options.source ? ` (${options.source})` : ''}: its colors, type, spacing and corners, as written in ${options.specPath}.`,
    `Use it whenever you add or change a page, a section or a component in this project.`,
    'It names the tokens, says what is not allowed, and checks the result with Strict Check.',
  ].join(' ')
  const type = Object.entries(spec.typography).map(([token, value]) => {
    const parts = [value.fontSize, value.fontFamily, value.fontWeight !== undefined ? `weight ${value.fontWeight}` : undefined, value.lineHeight !== undefined ? `line height ${value.lineHeight}` : undefined, value.letterSpacing !== undefined ? `letter spacing ${value.letterSpacing}` : undefined]
    return `- **${token}:** ${parts.filter((part) => part !== undefined).join(', ')}`
  })
  const scale = (group: Record<string, unknown>): string => Object.entries(group).map(([token, value]) => `${token} ${String(value)}`).join(', ')
  const rules: string[] = []
  if (strict?.colors.allow === 'tokens') rules.push('Use only the colors above, by token. No other hex value.')
  if (strict?.typography.allow === 'scale') rules.push('Set text in the sizes above only, each with its own weight, line height and letter spacing. A size has one weight: for emphasis use a larger size or a color, not bold. On a narrow screen step a heading down to the next size in the list.')
  if (strict?.typography.fonts === 'declared') rules.push('Use only the fonts above.')
  if (strict?.spacing.allow === 'scale') rules.push(`Padding, margin and gap come from the spacing steps${strict.spacing.extra.length > 0 ? `, or ${strict.spacing.extra.join(', ')}` : ''}.`)
  if (strict?.rounded.allow === 'scale') rules.push(`Corners come from the list above${strict.rounded.full ? `. A box up to ${strict.rounded.full} across may be fully round` : ', and nothing is fully round'}.`)
  rules.push(`Text needs a contrast of ${strict?.contrast === 'AAA' ? '7:1 (4.5:1 for large text)' : '4.5:1 (3:1 for large text)'} or more against what is behind it${Object.keys(dark).length > 0 ? ', in light and in dark mode' : ''}. Put text on a fill only in that fill's \`on-\` color; a fill without one is not for text.`)
  rules.push('Hover and focus are checked too. A hover or focus color has to be one of the colors above, and every link, button and field needs a focus mark that can be seen.')
  const tells = Object.entries(strict?.tells ?? {}).filter(([, level]) => level !== 'off').map(([tell]) => tell.replace(/-/g, ' '))
  if (tells.length > 0) rules.push(`Avoid: ${tells.join(', ')}.`)
  const body = [
    `# ${title}: design`,
    '',
    `This skill is for building UI in this project. \`${options.specPath}\` holds the design: every color, text size, spacing step and corner, and a \`strict\` block that says what is allowed.`,
    '',
    '## Before you start',
    '',
    `1. Read \`${options.specPath}\` in full. Its front matter is the tokens; its sections say how they are used.`,
    '2. Look at how the project names the tokens in code (CSS variables, Tailwind classes) and use those names, not raw values.',
    `3. If the tokens are not in the code yet, put them there first. For Tailwind 4, \`npx @strictthemes/spec export ${options.specPath} --format tailwind\` prints them as a \`@theme\` block, with the dark mode: color classes named after the tokens (\`bg-surface\`, \`text-on-primary\`), a text class for each size (\`text-h1\`), the corners and the spacing steps. Remove a default palette, text sizes and fonts the project came with, and restyle stock components that use them.`,
    "4. Load each font under the exact family name the spec gives it. A package that registers the font as \"Name Variable\" needs its own `@font-face` with the spec's name.",
    '5. Run `npx @strictthemes/check --rules` to see what the check allows, as values and as classes.',
    '6. Look at a page that exists before you build a new one, and lay yours out the same way. If there is none, or a section of the spec is still a note asking to be written, choose a layout yourself and tell the user which choices were yours.',
    '',
    '## The tokens in short',
    '',
    '**Colors**',
    '',
    ...Object.entries(spec.colors).map(([token, value]) => `- **${token}:** ${String(value)}${dark[token] !== undefined && dark[token] !== value ? ` (${String(dark[token])} in dark mode)` : ''}`),
    '',
    '**Type**',
    '',
    ...type,
    '',
    `**Spacing:** ${scale(spec.spacing)}`,
    '',
    `**Corners:** ${scale(spec.rounded)}`,
    '',
    `If this list and \`${options.specPath}\` differ, the spec is right.`,
    '',
    '## Rules',
    '',
    ...rules.map((rule) => `- ${rule}`),
    '- Need a value that is not in the spec? Stop and ask. Do not add a token on your own.',
    '',
    '## Check before you finish',
    '',
    'Build the project, then measure it against the spec with Strict Check:',
    '',
    '```bash',
    `npx @strictthemes/check${options.specPath === 'DESIGN.md' ? '' : ` --spec ${options.specPath}`} --dist dist`,
    '```',
    '',
    '`dist` is the folder the build wrote. Add `--path /pricing` for each page you touched other than `/`. Fix every error it lists by using a value the spec allows, and run it again until the last line starts with `Passed`. Do not mark code `strict-ignore` to get there.',
    '',
    'Then tell the user what you built, what the check reported, and anything you could not verify.',
    '',
  ].join('\n')
  return ['---', `name: ${name}`, `description: ${JSON.stringify(description)}`, '---', '', body].join('\n')
}
