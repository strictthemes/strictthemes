import { contrastRatio, deltaE, formatHex, parseColor, rgbToOklch, type Rgb } from '@strictthemes/spec'
import type { ElementData, PageData, Rgba } from './collect.ts'
import { BASE_MODE, onScale, scaleText, tellSeverity, type Rules } from './rules.ts'
import { emptyCounts, type Category, type CheckFinding, type CheckResult } from './types.ts'

export interface PageContext {
  /** The color mode the page was in, e.g. `light` or `dark`. */
  mode: string
  /** The viewport width in px. */
  width: number
  /** The page's path. Set it when more than one page is checked, so reports can tell them apart. */
  path?: string
}

const toRgb = (color: Rgba | [number, number, number]): Rgb => ({
  r: color[0] / 255,
  g: color[1] / 255,
  b: color[2] / 255,
  a: color.length === 4 ? color[3] : 1,
})

const hex = (color: Rgba | [number, number, number]): string => formatHex({ ...toRgb(color), a: 1 }).toUpperCase()

const composite = (top: Rgba, bottom: [number, number, number]): [number, number, number] => [
  top[0] * top[3] + bottom[0] * (1 - top[3]),
  top[1] * top[3] + bottom[1] * (1 - top[3]),
  top[2] * top[3] + bottom[2] * (1 - top[3]),
]

/** A color counts as having a hue when its chroma is above this. */
const CHROMATIC = 0.04
/** Hues, in OKLCH degrees, that read as purple or violet. */
const isPurple = (hue: number): boolean => hue >= 280 && hue <= 330

/** Colors written inside a CSS value, such as the stops of a gradient or the layers of a shadow. */
function colorsIn(value: string): Rgb[] {
  const matches = value.match(/#[0-9a-fA-F]{3,8}\b|(?:rgba?|hsla?|oklch|oklab)\([^)]*\)/g) ?? []
  return matches.map((match) => parseColor(match)).filter((rgb): rgb is Rgb => rgb !== null && rgb.a > 0)
}

const FAMILY_SUFFIX = / (variable|var|vf)$/i

/**
 * Judges what `collect()` measured on one page, in one color mode at one
 * width, against the theme's rules. Pure: it needs no browser.
 */
export function evaluatePage(data: PageData, rules: Rules, context: PageContext): CheckResult {
  const findings: CheckFinding[] = []
  const counts = emptyCounts()
  const allowed = rules.colors ? (rules.colors[context.mode] ?? rules.colors[BASE_MODE] ?? []) : null

  const check = (category: Category, ok: boolean, finding: () => Omit<CheckFinding, 'category' | 'mode' | 'width'>) => {
    counts[category].checked++
    if (ok) return
    counts[category].failed++
    findings.push({
      ...finding(),
      category,
      mode: context.mode,
      width: context.width,
      ...(context.path !== undefined ? { page: context.path } : {}),
    })
  }

  // A page that does not switch to this mode would fail every color for one reason. Say that once.
  const own = rules.backgrounds[context.mode]
  const base = rules.backgrounds[BASE_MODE]
  if (context.mode !== BASE_MODE && own && base && deltaE(own, base) > rules.tolerance) {
    const canvas = toRgb(data.canvas)
    const switched = deltaE(canvas, base) > rules.tolerance || deltaE(canvas, own) <= rules.tolerance
    check('colors', switched, () => ({
      rule: 'mode-not-applied',
      severity: 'warning',
      value: context.mode,
      message: `The page looks the same in ${context.mode} mode: its background is still ${hex(data.canvas)}. The check sets a \`${context.mode}\` class on <html> and the browser's color scheme. If the page has no ${context.mode} mode, pass --mode ${BASE_MODE}.`,
    }))
    if (!switched) return { findings, counts, ignored: data.ignored }
  }

  /** A color is the theme's when its RGB matches an allowed color; its opacity is free, as in `bg-primary/80`. */
  const isAllowed = (color: Rgba): boolean =>
    allowed === null || allowed.some((token) => deltaE(token, { ...toRgb(color), a: 1 }) <= rules.tolerance)

  const checkColor = (element: ElementData, color: Rgba, what: string) => {
    if (color[3] === 0) return
    check('colors', isAllowed(color), () => ({
      rule: 'color-off-token',
      severity: 'error',
      value: hex(color),
      selector: element.selector,
      message: `${what} ${hex(color)} is not one of the ${rules.name} colors.`,
    }))
  }

  for (const element of data.elements) {
    if (element.hidden) continue
    const isSvg = element.tag === 'svg'

    // Colors
    if (allowed !== null) {
      if (element.hasText) checkColor(element, element.color, 'Text color')
      if (!isSvg) {
        checkColor(element, element.background, 'Background')
        for (const border of new Set(element.borders.map((color) => color.join(',')))) {
          checkColor(element, border.split(',').map(Number) as Rgba, 'Border color')
        }
      }
    }

    // Contrast
    if (element.hasText && !element.disabled && element.backdrop && element.color[3] > 0) {
      const text = composite(element.color, element.backdrop)
      const ratio = contrastRatio(toRgb(text), toRgb(element.backdrop))
      const large = element.fontSize >= 24 || (element.fontSize >= 18.66 && element.fontWeight >= 700)
      const needed = large ? rules.contrast.large : rules.contrast.normal
      check('contrast', ratio >= needed, () => ({
        rule: 'contrast',
        severity: 'error',
        value: `${hex(text)} on ${hex(element.backdrop ?? [0, 0, 0])}`,
        selector: element.selector,
        message: `Text is ${ratio.toFixed(2)}:1 against its background; WCAG ${rules.contrast.level} needs ${needed}:1${large ? ' for large text' : ''}.`,
      }))
    }

    // Typography
    if (element.hasText) {
      if (rules.sizes) {
        const sizes = rules.sizes
        check('typography', onScale(element.fontSize, sizes), () => ({
          rule: 'type-off-scale',
          severity: 'error',
          value: `${element.fontSize}px`,
          selector: element.selector,
          message: `Text is ${element.fontSize}px, which is not in the type scale (${scaleText(sizes)}).`,
        }))
      }
      if (rules.weights) {
        const weights = rules.weights
        check('typography', weights.includes(element.fontWeight), () => ({
          rule: 'weight-undeclared',
          severity: 'warning',
          value: String(element.fontWeight),
          selector: element.selector,
          message: `Text is weight ${element.fontWeight}; the theme declares ${weights.join(', ')}.`,
        }))
      }
      if (rules.fonts) {
        const fonts = rules.fonts
        const family = element.fontFamily.toLowerCase().replace(FAMILY_SUFFIX, '')
        check('typography', fonts.includes(family), () => ({
          rule: 'font-undeclared',
          severity: 'error',
          value: element.fontFamily,
          selector: element.selector,
          message: `Text is set in ${element.fontFamily}, which the theme does not declare (${fonts.join(', ')}).`,
        }))
      }
    }

    // Spacing: stock components keep the spacing they ship with.
    if (rules.spacing && !element.stock) {
      const scale = rules.spacing
      for (const { property, px } of element.spacing) {
        // `padding-top` and `row-gap` report as "padding" and "gap".
        const kind = property.endsWith('gap') ? 'gap' : (property.split('-')[0] ?? property)
        check('spacing', onScale(px, scale), () => ({
          rule: 'spacing-off-scale',
          severity: 'error',
          value: `${kind} ${px}px`,
          selector: element.selector,
          message: `A ${kind} of ${px}px is not on the spacing scale (${scaleText(scale)}).`,
        }))
      }
    }

    // Corners: only where a corner can be seen.
    if (rules.radii && element.boxed && !isSvg) {
      const scale = rules.radii
      for (const radius of new Set(element.radii)) {
        if (radius === 0) continue
        // A radius of half the box or more is a full round, however it was written.
        const side = Math.min(element.width, element.height)
        const round = radius === -1 || radius >= side / 2
        // A theme may allow full rounds up to a size: status dots, avatars.
        const allowed = round ? side <= rules.fullRound + 0.5 : onScale(radius, scale)
        check('corners', allowed, () => ({
          rule: 'radius-off-scale',
          severity: round ? 'warning' : 'error',
          value: round ? 'full round' : `${radius}px`,
          selector: element.selector,
          message: !round
            ? `Corner radius is ${radius}px, which is not one of the theme's corners (${scaleText(scale)}).`
            : rules.fullRound > 0
              ? `A fully rounded box ${Math.round(side)}px across. The theme allows a full round up to ${rules.fullRound}px across.`
              : `A fully rounded box, which is not one of the theme's corners. Use it only where DESIGN.md allows a full round.`,
        }))
      }
    }

    // Tells
    const gradient = tellSeverity(rules, 'purple-gradient')
    if (gradient && element.backgroundImage.includes('gradient(')) {
      const hues = colorsIn(element.backgroundImage)
        .map((color) => rgbToOklch(color))
        .filter((color) => color.c > CHROMATIC)
        .map((color) => color.h)
      const purple = hues.some(isPurple)
      const spread = hues.length > 1 ? Math.max(...hues) - Math.min(...hues) : 0
      const multi = Math.min(spread, 360 - spread) > 40
      check('tells', !purple && !multi, () => ({
        rule: 'tell-gradient',
        severity: gradient,
        value: purple ? 'purple gradient' : 'multi-color gradient',
        selector: element.selector,
        message: `A ${purple ? 'purple' : 'multi-color'} gradient background, which ${rules.name} does not allow.`,
      }))
    }
    const emoji = tellSeverity(rules, 'emoji-icons')
    if (emoji && element.hasText) {
      check('tells', element.emoji === null, () => ({
        rule: 'tell-emoji',
        severity: emoji,
        value: element.emoji ?? '',
        selector: element.selector,
        message: `${element.emoji} is an emoji. ${rules.name} does not use emoji as icons or bullets. Where it stands for an icon, use one from the project's icon set; where it decorates text, remove it.`,
      }))
    }
    const glow = tellSeverity(rules, 'glow-shadows')
    if (glow && (element.boxShadow !== 'none' || element.textShadow !== 'none')) {
      const colored = colorsIn(`${element.boxShadow} ${element.textShadow}`).some((color) => rgbToOklch(color).c > CHROMATIC)
      check('tells', !colored, () => ({
        rule: 'tell-glow',
        severity: glow,
        value: 'colored shadow',
        selector: element.selector,
        message: `A colored shadow or glow, which ${rules.name} asks to avoid.`,
      }))
    }
    const nested = tellSeverity(rules, 'nested-cards')
    if (nested && element.card) {
      check('tells', !element.nestedCard, () => ({
        rule: 'tell-nested-cards',
        severity: nested,
        value: 'card inside a card',
        selector: element.selector,
        message: `A card inside a card, which ${rules.name} asks to avoid. Separate the inner content with a border or space instead.`,
      }))
    }
  }

  // Layout: the page must not scroll sideways.
  const culprits = data.elements.filter((element) => element.overflowing && !element.hidden)
  check('layout', data.scrollWidth <= data.viewportWidth + 1, () => ({
    rule: 'horizontal-scroll',
    severity: 'error',
    value: `${data.scrollWidth}px wide`,
    // The innermost element past the edge is usually the cause.
    ...(culprits.length > 0 ? { selector: culprits[culprits.length - 1]?.selector ?? '' } : {}),
    message: `The page scrolls sideways: its content is ${data.scrollWidth}px wide in a ${context.width}px window.`,
  }))

  return { findings, counts, ignored: data.ignored }
}
