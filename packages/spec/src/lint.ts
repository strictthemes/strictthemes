import { contrastRatio, isCssColor, parseColor } from './color.ts'
import { parseSpec, SECTION_ORDER } from './parse.ts'
import { tokensForMode } from './resolve.ts'
import type { Finding, LintResult, Severity, StrictSpec, Tokens } from './types.ts'

const DIMENSION = /^[+-]?(?:\d+\.?\d*|\.\d+)(px|rem|em|%)?$/
const TYPOGRAPHY_KEYS = new Set([
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'fontFeature',
  'fontVariation',
])
const COMPONENT_COLOR_KEYS = new Set(['backgroundColor', 'textColor'])
const COMPONENT_DIMENSION_KEYS = new Set(['rounded', 'padding', 'size', 'height', 'width'])
const SEVERITY_ORDER: Record<Severity, number> = { error: 0, warning: 1, info: 2 }

const hasRef = (value: string) => /\{[A-Za-z0-9_.-]+\}/.test(value)

/** One CSS length. A bare number is only accepted when `unitless` is true or it is 0. */
export function isDimension(value: unknown, unitless = false): boolean {
  if (typeof value === 'number') return unitless || value === 0
  if (typeof value !== 'string') return false
  const match = DIMENSION.exec(value.trim())
  if (!match) return false
  return match[1] !== undefined || unitless || Number(value) === 0
}

const isDimensionList = (value: unknown) =>
  typeof value === 'string' &&
  value.trim().length > 0 &&
  value.trim().split(/\s+/).every((part) => isDimension(part))

function checkTokens(tokens: Tokens, findings: Finding[]): void {
  const add = (rule: string, severity: Severity, path: string, message: string) =>
    findings.push({ rule, severity, path, message })

  for (const [name, value] of Object.entries(tokens.colors)) {
    if (hasRef(value)) continue // already reported as a broken or circular reference
    if (!isCssColor(value)) {
      add('invalid-color', 'error', `colors.${name}`, `"${value}" is not a CSS color`)
    }
  }

  for (const group of ['rounded', 'spacing'] as const) {
    for (const [name, value] of Object.entries(tokens[group])) {
      if (hasRef(value)) continue
      if (!isDimension(value)) {
        add('invalid-dimension', 'error', `${group}.${name}`, `"${value}" is not a length (px, rem, em or %)`)
      }
    }
  }

  for (const [name, token] of Object.entries(tokens.typography)) {
    const at = `typography.${name}`
    for (const key of Object.keys(token)) {
      if (!TYPOGRAPHY_KEYS.has(key)) {
        add('unknown-typography-property', 'warning', `${at}.${key}`, `Unknown typography property "${key}"`)
      }
    }
    const { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } = token
    if (fontFamily !== undefined && (typeof fontFamily !== 'string' || !fontFamily.trim())) {
      add('invalid-typography', 'error', `${at}.fontFamily`, 'fontFamily must be a non-empty string')
    }
    if (fontSize !== undefined && !isDimension(fontSize)) {
      add('invalid-dimension', 'error', `${at}.fontSize`, `"${String(fontSize)}" is not a length (px, rem, em or %)`)
    }
    if (lineHeight !== undefined && !isDimension(lineHeight, true)) {
      add('invalid-dimension', 'error', `${at}.lineHeight`, `"${String(lineHeight)}" is not a number or length`)
    }
    if (letterSpacing !== undefined && !isDimension(letterSpacing)) {
      add('invalid-dimension', 'error', `${at}.letterSpacing`, `"${String(letterSpacing)}" is not a length`)
    }
    if (fontWeight !== undefined) {
      const weight = Number(fontWeight)
      const keyword = fontWeight === 'normal' || fontWeight === 'bold'
      if (!keyword && !(Number.isFinite(weight) && weight >= 1 && weight <= 1000)) {
        add('invalid-typography', 'error', `${at}.fontWeight`, `"${String(fontWeight)}" is not a font weight (1–1000, normal or bold)`)
      }
    }
  }

  for (const [name, component] of Object.entries(tokens.components)) {
    for (const [key, value] of Object.entries(component)) {
      const at = `components.${name}.${key}`
      if (typeof value === 'string' && hasRef(value)) continue
      if (COMPONENT_COLOR_KEYS.has(key)) {
        if (typeof value !== 'string' || !isCssColor(value)) {
          add('invalid-color', 'error', at, `"${String(value)}" is not a CSS color`)
        }
      } else if (COMPONENT_DIMENSION_KEYS.has(key)) {
        if (!isDimensionList(value) && !isDimension(value)) {
          add('invalid-dimension', 'error', at, `"${String(value)}" is not a length`)
        }
      } else if (key === 'typography') {
        if (value === null || typeof value !== 'object') {
          add('invalid-typography', 'error', at, 'typography must be a typography token or a reference to one')
        }
      } else {
        add('unknown-component-property', 'warning', at, `Unknown component property "${key}"`)
      }
    }
  }
}

function checkContrast(spec: StrictSpec, tokens: Tokens, mode: string | null, findings: Finding[]): void {
  const threshold = spec.strict.contrast === 'AAA' ? 7 : 4.5
  for (const [name, component] of Object.entries(tokens.components)) {
    const { backgroundColor, textColor } = component
    if (typeof backgroundColor !== 'string' || typeof textColor !== 'string') continue
    const background = parseColor(backgroundColor)
    const text = parseColor(textColor)
    if (!background || !text) continue
    const ratio = contrastRatio(background, text)
    if (ratio >= threshold) continue
    findings.push({
      rule: 'contrast-ratio',
      // A spec that declares its own strict rules has opted into enforcement.
      severity: spec.strictDeclared ? 'error' : 'warning',
      path: `components.${name}`,
      message:
        `${mode ? `[${mode}] ` : ''}${textColor} on ${backgroundColor} has a contrast ratio of ` +
        `${ratio.toFixed(2)}:1, below WCAG ${spec.strict.contrast} (${threshold}:1)`,
    })
  }
}

function checkSections(spec: StrictSpec, findings: Finding[]): void {
  const order = SECTION_ORDER as readonly string[]
  let last = -1
  for (const section of spec.sections) {
    if (!section.canonical) continue
    const index = order.indexOf(section.canonical)
    if (index < last) {
      findings.push({
        rule: 'section-order',
        severity: 'warning',
        path: section.title,
        message: `Section "${section.title}" is out of order. Expected order: ${order.join(', ')}`,
      })
    }
    last = Math.max(last, index)
  }
  const present = new Set(spec.sections.map((section) => section.canonical))
  const missing = order.filter((name) => !present.has(name))
  if (missing.length > 0) {
    findings.push({
      rule: 'missing-sections',
      severity: 'info',
      message: `Sections not present: ${missing.join(', ')}`,
    })
  }
}

function checkUsage(spec: StrictSpec, findings: Finding[]): void {
  if (!('primary' in spec.colors)) {
    findings.push({
      rule: 'missing-primary',
      severity: 'warning',
      path: 'colors',
      message: 'No "primary" color token. Agents fall back to their own defaults without one',
    })
  }
  if (Object.keys(spec.typography).length === 0) {
    findings.push({
      rule: 'missing-typography',
      severity: 'warning',
      path: 'typography',
      message: 'No typography tokens. Agents fall back to their own font choices without them',
    })
  }
  if (Object.keys(spec.raw.components).length > 0) {
    const used = JSON.stringify(spec.raw.components) + JSON.stringify(spec.raw.colors)
    const orphans = Object.keys(spec.colors).filter((name) => !used.includes(`{colors.${name}}`))
    if (orphans.length > 0) {
      findings.push({
        rule: 'orphaned-tokens',
        severity: 'info',
        path: 'colors',
        message: `Colors no component refers to: ${orphans.join(', ')}`,
      })
    }
  }
  const count = (group: keyof Tokens) => Object.keys(spec[group]).length
  findings.push({
    rule: 'token-summary',
    severity: 'info',
    message:
      `${count('colors')} colors, ${count('typography')} typography, ${count('rounded')} rounded, ` +
      `${count('spacing')} spacing, ${count('components')} components, ` +
      `${Object.keys(spec.strict.modes).length} extra modes`,
  })
}

/** Parses a spec and runs every lint rule. `ok` is false when there is at least one error. */
export function lintSpec(source: string): LintResult {
  const { spec, findings } = parseSpec(source)

  checkTokens(spec, findings)
  checkContrast(spec, spec, null, findings)
  for (const mode of Object.keys(spec.strict.modes)) {
    const tokens = tokensForMode(spec, mode, findings)
    for (const [name, value] of Object.entries(spec.strict.modes[mode]?.colors ?? {})) {
      if (!/\{/.test(value) && !isCssColor(value)) {
        findings.push({
          rule: 'invalid-color',
          severity: 'error',
          path: `strict.modes.${mode}.colors.${name}`,
          message: `"${value}" is not a CSS color`,
        })
      }
    }
    checkContrast(spec, tokens, mode, findings)
  }
  checkSections(spec, findings)
  checkUsage(spec, findings)

  const unique = new Map<string, Finding>()
  for (const finding of findings) {
    unique.set(`${finding.rule}|${finding.path ?? ''}|${finding.message}`, finding)
  }
  const sorted = [...unique.values()].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  )
  return { spec, findings: sorted, ok: !sorted.some((f) => f.severity === 'error') }
}
