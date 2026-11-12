import { parseDocument } from 'yaml'
import { resolveTokens } from './resolve.ts'
import type {
  ComponentToken,
  Finding,
  ParseResult,
  RuleLevel,
  Section,
  StrictRules,
  Tokens,
  TypographyToken,
} from './types.ts'

/** Canonical DESIGN.md sections, in the order the format requires. */
export const SECTION_ORDER = [
  'Overview',
  'Colors',
  'Typography',
  'Layout',
  'Elevation & Depth',
  'Shapes',
  'Components',
  "Do's and Don'ts",
] as const

const SECTION_ALIASES: Record<string, string> = {
  'brand & style': 'Overview',
  'layout & spacing': 'Layout',
  elevation: 'Elevation & Depth',
}

const TOKEN_GROUPS = ['colors', 'typography', 'rounded', 'spacing', 'components'] as const
const KNOWN_KEYS = new Set<string>([
  'version',
  'name',
  'description',
  'omitted',
  'strict',
  ...TOKEN_GROUPS,
])

/** AI-tell rule ids Strict Check understands. */
export const KNOWN_TELLS = [
  'purple-gradient',
  'emoji-icons',
  'nested-cards',
  'glow-shadows',
] as const

export function defaultStrictRules(): StrictRules {
  return {
    version: 1,
    contrast: 'AA',
    colors: { allow: 'tokens', tolerance: 0.02 },
    spacing: { allow: 'scale', extra: ['0', '1px'] },
    rounded: { allow: 'scale' },
    typography: { allow: 'scale', fonts: 'declared' },
    tells: {},
    modes: {},
  }
}

type Dict = Record<string, unknown>

const isDict = (value: unknown): value is Dict =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

function canonicalSection(title: string): string | null {
  const key = title.toLowerCase().replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim()
  const alias = SECTION_ALIASES[key]
  if (alias) return alias
  return SECTION_ORDER.find((name) => name.toLowerCase() === key) ?? null
}

function parseYaml(text: string, where: string, findings: Finding[]): Dict | null {
  const doc = parseDocument(text)
  for (const error of doc.errors) {
    findings.push({
      rule: error.code === 'DUPLICATE_KEY' ? 'duplicate-key' : 'invalid-yaml',
      severity: 'error',
      message: `${where}: ${error.message.split('\n')[0] ?? error.message}`,
    })
  }
  if (doc.errors.length > 0) return null
  const value: unknown = doc.toJS()
  if (value === null || value === undefined) return {}
  if (!isDict(value)) {
    findings.push({
      rule: 'invalid-yaml',
      severity: 'error',
      message: `${where}: expected a YAML mapping`,
    })
    return null
  }
  return value
}

interface Body {
  sections: Section[]
  yamlBlocks: string[]
}

function scanBody(body: string): Body {
  const sections: Section[] = []
  const yamlBlocks: string[] = []
  let current: { title: string; lines: string[] } | null = null
  let fence: { marker: string; yaml: boolean; lines: string[] } | null = null

  const close = () => {
    if (!current) return
    sections.push({
      title: current.title,
      canonical: canonicalSection(current.title),
      body: current.lines.join('\n').trim(),
    })
  }

  for (const line of body.split(/\r?\n/)) {
    if (fence) {
      if (line.trimStart().startsWith(fence.marker)) {
        if (fence.yaml && current) yamlBlocks.push(fence.lines.join('\n'))
        fence = null
      } else {
        fence.lines.push(line)
      }
      current?.lines.push(line)
      continue
    }
    const open = /^\s*(```+|~~~+)\s*([A-Za-z0-9_-]*)/.exec(line)
    if (open?.[1]) {
      const lang = (open[2] ?? '').toLowerCase()
      fence = { marker: open[1], yaml: lang === 'yaml' || lang === 'yml', lines: [] }
      current?.lines.push(line)
      continue
    }
    const heading = /^##\s+(.+?)\s*#*\s*$/.exec(line)
    if (heading?.[1]) {
      close()
      current = { title: heading[1], lines: [] }
      continue
    }
    current?.lines.push(line)
  }
  close()
  return { sections, yamlBlocks }
}

function stringMap(
  value: unknown,
  group: string,
  findings: Finding[],
  numbersAsPx: boolean,
): Record<string, string> {
  const out: Record<string, string> = {}
  if (value === undefined) return out
  if (!isDict(value)) {
    findings.push({
      rule: 'invalid-token',
      severity: 'error',
      message: `"${group}" must be a mapping of token names to values`,
      path: group,
    })
    return out
  }
  for (const [name, item] of Object.entries(value)) {
    if (typeof item === 'string') out[name] = item
    else if (typeof item === 'number' && numbersAsPx) out[name] = item === 0 ? '0' : `${item}px`
    else {
      findings.push({
        rule: 'invalid-token',
        severity: 'error',
        message: `${group}.${name} must be a ${numbersAsPx ? 'string or number' : 'string'}`,
        path: `${group}.${name}`,
      })
    }
  }
  return out
}

function dictMap<T extends Dict>(
  value: unknown,
  group: string,
  findings: Finding[],
): Record<string, T> {
  const out: Record<string, T> = {}
  if (value === undefined) return out
  if (!isDict(value)) {
    findings.push({
      rule: 'invalid-token',
      severity: 'error',
      message: `"${group}" must be a mapping of token names to objects`,
      path: group,
    })
    return out
  }
  for (const [name, item] of Object.entries(value)) {
    if (isDict(item)) out[name] = item as T
    else {
      findings.push({
        rule: 'invalid-token',
        severity: 'error',
        message: `${group}.${name} must be an object`,
        path: `${group}.${name}`,
      })
    }
  }
  return out
}

function parseStrict(value: unknown, baseColors: Record<string, string>, findings: Finding[]): StrictRules {
  const rules = defaultStrictRules()
  if (value === undefined) return rules
  const bad = (path: string, message: string) =>
    findings.push({ rule: 'invalid-strict', severity: 'error', message, path })
  if (!isDict(value)) {
    bad('strict', '"strict" must be a mapping')
    return rules
  }

  const pick = <T extends string>(
    source: Dict,
    key: string,
    path: string,
    allowed: readonly T[],
    fallback: T,
  ): T => {
    const item = source[key]
    if (item === undefined) return fallback
    if (typeof item === 'string' && (allowed as readonly string[]).includes(item)) return item as T
    bad(path, `${path} must be one of: ${allowed.join(', ')}`)
    return fallback
  }
  const group = (key: string): Dict => {
    const item = value[key]
    if (item === undefined) return {}
    if (isDict(item)) return item
    bad(`strict.${key}`, `strict.${key} must be a mapping`)
    return {}
  }

  if (value.version !== undefined && value.version !== 1) {
    bad('strict.version', 'strict.version must be 1')
  }
  rules.contrast = pick(value, 'contrast', 'strict.contrast', ['AA', 'AAA'], rules.contrast)

  const colors = group('colors')
  rules.colors.allow = pick(colors, 'allow', 'strict.colors.allow', ['tokens', 'any'], rules.colors.allow)
  if (colors.tolerance !== undefined) {
    if (typeof colors.tolerance === 'number' && colors.tolerance >= 0 && colors.tolerance <= 1) {
      rules.colors.tolerance = colors.tolerance
    } else {
      bad('strict.colors.tolerance', 'strict.colors.tolerance must be a number between 0 and 1')
    }
  }

  const spacing = group('spacing')
  rules.spacing.allow = pick(spacing, 'allow', 'strict.spacing.allow', ['scale', 'any'], rules.spacing.allow)
  if (spacing.extra !== undefined) {
    if (Array.isArray(spacing.extra) && spacing.extra.every((v) => typeof v === 'string' || typeof v === 'number')) {
      rules.spacing.extra = spacing.extra.map((v) => String(v))
    } else {
      bad('strict.spacing.extra', 'strict.spacing.extra must be a list of dimensions')
    }
  }

  const rounded = group('rounded')
  rules.rounded.allow = pick(rounded, 'allow', 'strict.rounded.allow', ['scale', 'any'], rules.rounded.allow)
  if (rounded.full !== undefined) {
    const full = typeof rounded.full === 'number' ? `${rounded.full}px` : rounded.full
    if (typeof full === 'string' && /^\d*\.?\d+(px|rem)$/.test(full.trim())) rules.rounded.full = full.trim()
    else bad('strict.rounded.full', 'strict.rounded.full must be a size in px or rem, such as 12px')
  }

  const typography = group('typography')
  rules.typography.allow = pick(typography, 'allow', 'strict.typography.allow', ['scale', 'any'], rules.typography.allow)
  rules.typography.fonts = pick(typography, 'fonts', 'strict.typography.fonts', ['declared', 'any'], rules.typography.fonts)

  for (const [id, level] of Object.entries(group('tells'))) {
    if (level !== 'off' && level !== 'warn' && level !== 'error') {
      bad(`strict.tells.${id}`, `strict.tells.${id} must be one of: off, warn, error`)
      continue
    }
    if (!(KNOWN_TELLS as readonly string[]).includes(id)) {
      findings.push({
        rule: 'unknown-tell',
        severity: 'warning',
        message: `Unknown tell "${id}". Known tells: ${KNOWN_TELLS.join(', ')}`,
        path: `strict.tells.${id}`,
      })
    }
    rules.tells[id] = level as RuleLevel
  }

  for (const [mode, item] of Object.entries(group('modes'))) {
    if (!isDict(item)) {
      bad(`strict.modes.${mode}`, `strict.modes.${mode} must be a mapping`)
      continue
    }
    const overrides = stringMap(item.colors, `strict.modes.${mode}.colors`, findings, false)
    for (const name of Object.keys(overrides)) {
      if (!(name in baseColors)) {
        findings.push({
          rule: 'unknown-mode-token',
          severity: 'warning',
          message: `Mode "${mode}" overrides colors.${name}, which is not a base color token`,
          path: `strict.modes.${mode}.colors.${name}`,
        })
      }
    }
    rules.modes[mode] = { colors: overrides }
  }

  return rules
}

/**
 * Reads a DESIGN.md / Strict spec: YAML tokens (front matter and ```yaml
 * blocks inside sections), the `strict:` rules block and the Markdown sections.
 * Structural problems are returned as findings; this never throws on bad input.
 */
export function parseSpec(source: string): ParseResult {
  const findings: Finding[] = []
  const data: Dict = {}

  const merge = (block: Dict, where: string) => {
    for (const [key, value] of Object.entries(block)) {
      if (key in data) {
        findings.push({
          rule: 'duplicate-key',
          severity: 'error',
          message: `${where}: top-level key "${key}" is defined more than once`,
          path: key,
        })
        continue
      }
      data[key] = value
    }
  }

  let body = source.replace(/^﻿/, '')
  const frontMatter = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(body)
  if (frontMatter) {
    const parsed = parseYaml(frontMatter[1] ?? '', 'Front matter', findings)
    if (parsed) merge(parsed, 'Front matter')
    body = body.slice(frontMatter[0].length)
  }

  const { sections, yamlBlocks } = scanBody(body)
  yamlBlocks.forEach((block, i) => {
    const local: Finding[] = []
    const parsed = parseYaml(block, `YAML block ${i + 1}`, local)
    // A yaml block only counts as tokens when every key is a spec key;
    // anything else is treated as an illustration and left alone.
    if (parsed && Object.keys(parsed).length > 0 && Object.keys(parsed).every((k) => KNOWN_KEYS.has(k))) {
      merge(parsed, `YAML block ${i + 1}`)
    }
  })

  for (const key of Object.keys(data)) {
    if (!KNOWN_KEYS.has(key)) {
      findings.push({
        rule: 'unknown-key',
        severity: 'warning',
        message: `Unknown top-level key "${key}"`,
        path: key,
      })
    }
  }

  const seen = new Set<string>()
  for (const section of sections) {
    const id = (section.canonical ?? section.title).toLowerCase()
    if (seen.has(id)) {
      findings.push({
        rule: 'duplicate-section',
        severity: 'error',
        message: `Section "${section.title}" appears more than once`,
        path: section.title,
      })
    }
    seen.add(id)
  }

  const name = typeof data.name === 'string' ? data.name.trim() : ''
  if (!name) {
    findings.push({
      rule: 'missing-name',
      severity: 'error',
      message: 'The spec needs a top-level "name"',
      path: 'name',
    })
  }

  const raw: Tokens = {
    colors: stringMap(data.colors, 'colors', findings, false),
    typography: dictMap<TypographyToken>(data.typography, 'typography', findings),
    rounded: stringMap(data.rounded, 'rounded', findings, true),
    spacing: stringMap(data.spacing, 'spacing', findings, true),
    components: dictMap<ComponentToken>(data.components, 'components', findings),
  }
  const strict = parseStrict(data.strict, raw.colors, findings)
  const resolved = resolveTokens(raw, findings)

  return {
    spec: {
      name,
      ...(data.version !== undefined ? { version: String(data.version) } : {}),
      ...(typeof data.description === 'string' ? { description: data.description } : {}),
      ...resolved,
      strict,
      strictDeclared: data.strict !== undefined,
      sections,
      raw,
    },
    findings,
  }
}
