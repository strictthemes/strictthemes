export type Severity = 'error' | 'warning' | 'info'

export interface Finding {
  rule: string
  severity: Severity
  message: string
  /** Dotted token path or section title the finding refers to. */
  path?: string
}

export interface TypographyToken {
  fontFamily?: string
  fontSize?: string | number
  fontWeight?: string | number
  lineHeight?: string | number
  letterSpacing?: string | number
  fontFeature?: string
  fontVariation?: string
  [key: string]: unknown
}

export type ComponentToken = Record<string, unknown>

export interface Tokens {
  colors: Record<string, string>
  typography: Record<string, TypographyToken>
  rounded: Record<string, string>
  spacing: Record<string, string>
  components: Record<string, ComponentToken>
}

export type RuleLevel = 'off' | 'warn' | 'error'

/** The `strict:` extension block. Everything here is enforced by Strict Check. */
export interface StrictRules {
  version: 1
  contrast: 'AA' | 'AAA'
  colors: { allow: 'tokens' | 'any'; tolerance: number }
  spacing: { allow: 'scale' | 'any'; extra: string[] }
  /**
   * `full` is the largest box that may be fully round (a circle or a pill),
   * measured on its shorter side: `12px` allows status dots, `64px` avatars too.
   * Without it, every full round is reported.
   */
  rounded: { allow: 'scale' | 'any'; full?: string }
  typography: { allow: 'scale' | 'any'; fonts: 'declared' | 'any' }
  tells: Record<string, RuleLevel>
  modes: Record<string, { colors: Record<string, string> }>
}

export interface Section {
  title: string
  /** Canonical DESIGN.md section name, or null for a custom section. */
  canonical: string | null
  body: string
}

export interface StrictSpec extends Tokens {
  name: string
  version?: string
  description?: string
  strict: StrictRules
  /** True when the file has its own `strict:` block (otherwise defaults apply). */
  strictDeclared: boolean
  sections: Section[]
  /** Tokens as written, with `{references}` unresolved. */
  raw: Tokens
}

export interface ParseResult {
  spec: StrictSpec
  findings: Finding[]
}

export interface LintResult extends ParseResult {
  /** False when any finding is an error. */
  ok: boolean
}
