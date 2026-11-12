import { deltaE, parseColor, type Rgb } from '@strictthemes/spec'
import { onScale, scaleText, tellSeverity, toPx, type Rules } from './rules.ts'
import type { Category } from './types.ts'

/** What is wrong with one class, or with one color literal. */
export interface Problem {
  rule: string
  severity: 'error' | 'warning'
  message: string
}

/** A class the check understands: the category it counts under, and what is wrong with it, if anything. */
export interface ClassVerdict {
  category: Category
  problem?: Problem
}

const PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'
const COLOR_PREFIX =
  'bg|text|border(?:-[trblxyse])?|ring|ring-offset|outline|fill|stroke|from|via|to|decoration|divide|shadow|inset-shadow|drop-shadow|text-shadow|accent|caret|placeholder'
const PALETTE_CLASS = new RegExp(`^(${COLOR_PREFIX})-(?:(?:${PALETTE})-\\d{2,3}|(white|black))$`)
const ARBITRARY_COLOR = new RegExp(
  `^(${COLOR_PREFIX})-\\[(?:color:)?(#[0-9a-fA-F]{3,8}|(?:rgba?|hsla?|oklch|oklab)\\([^\\]]+\\))\\]$`,
)
const SPACING = /^-?(p[xytrblse]?|m[xytrblse]?|gap(?:-[xy])?|space-[xy])-(.+)$/
const TAILWIND_SIZE = /^text-(xs|sm|base|lg|xl|[2-9]xl)$/
const GRADIENT = /^bg-(gradient-to-[a-z]+|linear(-.+)?|radial(-.+)?|conic(-.+)?)$/
const WEIGHTS: Record<string, number> = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
}
const RADIUS_SIDES = new Set(['t', 'r', 'b', 'l', 's', 'e', 'tl', 'tr', 'br', 'bl', 'ss', 'se', 'ee', 'es'])

/**
 * A class without its variants and modifiers: `md:hover:!p-4` and `p-4!`
 * both give `p-4`, `bg-primary/80` gives `bg-primary`.
 */
export function utilityOf(candidate: string): string {
  let depth = 0
  let start = 0
  for (let i = 0; i < candidate.length; i++) {
    const char = candidate[i]
    if (char === '[' || char === '(') depth++
    else if (char === ']' || char === ')') depth--
    else if (char === ':' && depth === 0) start = i + 1
  }
  let utility = candidate.slice(start).replace(/^!/, '').replace(/!$/, '')
  // An opacity or line-height modifier: the part after a slash that is outside brackets.
  depth = 0
  for (let i = 0; i < utility.length; i++) {
    const char = utility[i]
    if (char === '[' || char === '(') depth++
    else if (char === ']' || char === ')') depth--
    else if (char === '/' && depth === 0) {
      utility = utility.slice(0, i)
      break
    }
  }
  return utility
}

/** True when `rgb` is, within the spec's tolerance, one of the theme's colors in any mode. */
export function isThemeColor(rgb: Rgb, rules: Rules): boolean {
  if (!rules.colors) return true
  return Object.values(rules.colors).some((colors) => colors.some((color) => deltaE(color, rgb) <= rules.tolerance))
}

/** What is wrong with a color written out in code, such as `#1F3BFF`. Null when colors are not restricted. */
export function colorLiteralProblem(literal: string, rules: Rules): Problem | null {
  if (!rules.colors) return null
  const rgb = parseColor(literal.replace(/_/g, ' '))
  if (!rgb || rgb.a === 0) return null
  if (isThemeColor(rgb, rules)) {
    return {
      rule: 'color-hard-coded',
      severity: 'warning',
      message: `${literal} is a theme color written out by hand, so it will not change with the color mode. Use the theme's class or variable for it.`,
    }
  }
  return {
    rule: 'color-off-token',
    severity: 'error',
    message: `${literal} is not one of the ${rules.name} colors.`,
  }
}

/** Neutral theme classes to reach for in place of a palette color. None for gradient stops: the fix there is no gradient. */
function themeClassHint(prefix: string): string {
  if (/^(from|via|to)$/.test(prefix)) return ''
  const examples =
    prefix === 'bg'
      ? ['bg-background', 'bg-card']
      : prefix === 'text'
        ? ['text-foreground', 'text-muted-foreground']
        : prefix.startsWith('border')
          ? [`${prefix}-border`]
          : []
  const such = examples.length > 0 ? `, such as ${examples.map((example) => `\`${example}\``).join(' or ')}` : ''
  return ` Use one of the theme's color classes${such}; DESIGN.md says which color is for what.`
}

/** Colors written inside an arbitrary shadow, such as `shadow-[0_0_24px_rgba(124,58,237,0.6)]`. */
const SHADOW = /^(?:shadow|inset-shadow|drop-shadow|text-shadow)-\[(.+)\]$/
const COLOR_IN_VALUE = /#[0-9a-fA-F]{3,8}(?![0-9a-zA-Z])|(?:rgba?|hsla?|oklch|oklab)\([^)]*\)/g

function colorClass(utility: string, rules: Rules): ClassVerdict | null {
  if (!rules.colors) return null
  const palette = PALETTE_CLASS.exec(utility)
  if (palette) {
    const named = palette[2]
    if (named) {
      const problem = colorLiteralProblem(named, rules)
      return problem ? { category: 'colors', problem: { ...problem, message: problem.message.replace(named, `\`${utility}\``) } } : null
    }
    return {
      category: 'colors',
      problem: {
        rule: 'color-off-token',
        severity: 'error',
        message: `\`${utility}\` is a Tailwind palette color, not one of the ${rules.name} colors.${themeClassHint(palette[1] ?? '')}`,
      },
    }
  }
  const arbitrary = ARBITRARY_COLOR.exec(utility)
  if (arbitrary) {
    const problem = colorLiteralProblem(arbitrary[2] ?? '', rules)
    return problem ? { category: 'colors', problem } : null
  }
  const shadow = SHADOW.exec(utility)
  if (shadow) {
    const problems = (shadow[1]?.match(COLOR_IN_VALUE) ?? [])
      .map((literal) => colorLiteralProblem(literal, rules))
      .filter((problem): problem is Problem => problem !== null)
    const problem = problems.find((item) => item.severity === 'error') ?? problems[0]
    return problem ? { category: 'colors', problem } : null
  }
  return null
}

function spacingClass(utility: string, rules: Rules): ClassVerdict | null {
  if (!rules.spacing) return null
  const match = SPACING.exec(utility)
  if (!match) return null
  const value = match[2] ?? ''
  let px: number | null = null
  if (/^\d*\.?\d+$/.test(value)) px = Number(value) * 4
  else if (value === 'px') px = 1
  else if (/^\[.+\]$/.test(value)) px = toPx(value.slice(1, -1))
  // `auto`, `reverse`, a theme token such as `p-space-md`, a variable or a calc: nothing to measure.
  if (px === null) return /^(auto|reverse|space-.+|\(.+\)|\[.+\]|\d+\/\d+)$/.test(value) ? { category: 'spacing' } : null
  if (onScale(Math.abs(px), rules.spacing)) return { category: 'spacing' }
  return {
    category: 'spacing',
    problem: {
      rule: 'spacing-off-scale',
      severity: 'error',
      message: `\`${utility}\` is ${Math.abs(px)}px, which is not on the spacing scale (${scaleText(rules.spacing)}).`,
    },
  }
}

function typeClass(utility: string, rules: Rules): ClassVerdict | null {
  const typeClasses = [...rules.sizeNames].map((name) => `\`text-${name}\``).join(', ')
  if (rules.sizes) {
    const named = /^text-([a-z0-9]+)$/.exec(utility)
    if (named && rules.sizeNames.has(named[1] ?? '')) return { category: 'typography' }
    if (TAILWIND_SIZE.test(utility)) {
      return {
        category: 'typography',
        problem: {
          rule: 'type-off-scale',
          severity: 'error',
          message: `\`${utility}\` is not in the type scale. Use one of ${typeClasses}.`,
        },
      }
    }
    const arbitrary = /^text-\[(?:length:)?(.+)\]$/.exec(utility)
    const px = arbitrary ? toPx(arbitrary[1]) : null
    if (px !== null) {
      if (onScale(px, rules.sizes)) return { category: 'typography' }
      return {
        category: 'typography',
        problem: {
          rule: 'type-off-scale',
          severity: 'error',
          message: `\`${utility}\` is ${px}px, which is not in the type scale (${scaleText(rules.sizes)}).`,
        },
      }
    }
  }
  const font = /^font-(.+)$/.exec(utility)
  if (!font) return null
  const value = font[1] ?? ''
  const weight = WEIGHTS[value] ?? (/^\[\d+\]$/.test(value) ? Number(value.slice(1, -1)) : null)
  if (weight !== null) {
    if (!rules.weights) return null
    if (rules.weights.includes(weight)) return { category: 'typography' }
    return {
      category: 'typography',
      problem: {
        rule: 'weight-undeclared',
        severity: 'warning',
        message: `\`${utility}\` is weight ${weight}; the theme declares ${rules.weights.join(', ')}.`,
      },
    }
  }
  // `font-[family-name:var(--font-mono)]` points at the theme; only a family written out is by hand.
  if (rules.fonts && /^\[.+\]$/.test(value) && !value.includes('var(')) {
    return {
      category: 'typography',
      problem: {
        rule: 'font-undeclared',
        severity: 'error',
        message: `\`${utility}\` sets a font by hand. Use the theme's font classes.`,
      },
    }
  }
  return null
}

function radiusClass(utility: string, rules: Rules): ClassVerdict | null {
  if (!rules.radii || !/^rounded(-|$)/.test(utility)) return null
  const parts = utility.split('-').slice(1)
  if (parts[0] !== undefined && RADIUS_SIDES.has(parts[0])) parts.shift()
  const value = parts.join('-')
  const names = [...rules.radiusNames].map((name) => `\`rounded-${name}\``).join(', ')
  if (/^\[.+\]$/.test(value)) {
    const px = toPx(value.slice(1, -1))
    if (px === null || onScale(px, rules.radii)) return { category: 'corners' }
    return {
      category: 'corners',
      problem: {
        rule: 'radius-off-scale',
        severity: 'error',
        message: `\`${utility}\` is ${px}px, which is not one of the theme's corners (${scaleText(rules.radii)}).`,
      },
    }
  }
  if (rules.radiusNames.has(value)) return { category: 'corners' }
  // Where the theme allows full rounds up to a size, the rendered check measures the box.
  if (value === 'full' && rules.fullRound > 0) return { category: 'corners' }
  if (value !== '' && !/^(xs|sm|md|lg|xl|[2-4]xl|full)$/.test(value)) return null
  return {
    category: 'corners',
    problem: {
      rule: 'radius-off-scale',
      severity: 'warning',
      message:
        value === 'full'
          ? `\`${utility}\` is a full round, which is not one of the theme's corners. Use it only where DESIGN.md allows a full round.`
          : `\`${utility}\` is not one of the corners the theme names. Use ${names}.`,
    },
  }
}

function tellClass(utility: string, rules: Rules): ClassVerdict | null {
  if (!GRADIENT.test(utility)) return null
  const severity = tellSeverity(rules, 'purple-gradient')
  if (!severity) return null
  return {
    category: 'tells',
    problem: {
      rule: 'tell-gradient',
      severity,
      message: `\`${utility}\` adds a gradient. ${rules.name} does not allow purple or multi-color gradients; use a flat theme color.`,
    },
  }
}

/**
 * Judges one class as written in the source, variants and all. Returns null
 * for anything that is not a color, spacing, type, corner or gradient class.
 */
export function checkClass(candidate: string, rules: Rules): ClassVerdict | null {
  const utility = utilityOf(candidate)
  return (
    colorClass(utility, rules) ??
    spacingClass(utility, rules) ??
    typeClass(utility, rules) ??
    radiusClass(utility, rules) ??
    tellClass(utility, rules)
  )
}
