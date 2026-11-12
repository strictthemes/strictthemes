import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { checkClass, colorLiteralProblem, type Problem } from './classes.ts'
import { tellSeverity, type Rules } from './rules.ts'
import { emptyCounts, type Category, type CheckFinding, type CheckResult } from './types.ts'

export interface SourceOptions {
  /**
   * Also check `components/ui`. These are the stock components a registry
   * installs; they keep their own spacing and sizes, so they are skipped by default.
   */
  includeUi?: boolean
  /**
   * Folders or files to leave out, as paths relative to the project: another
   * project kept inside this one, generated code, a vendored library.
   */
  exclude?: string[]
}

/** An excluded path as the check compares it: forward slashes, no `./` in front, no slash at the end. */
export const normalizeExclude = (path: string): string =>
  path.split(sep).join('/').replace(/^(\.\/)+/, '').replace(/\/+$/, '')

const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  'out',
  'coverage',
  'public',
  '.git',
  '.next',
  '.nuxt',
  '.output',
  '.astro',
  '.svelte-kit',
  '.vercel',
  '.turbo',
  '.cache',
])
const MARKUP = new Set(['.tsx', '.jsx', '.vue', '.svelte', '.astro', '.html', '.mdx'])
const SCRIPT = new Set(['.ts', '.js', '.mjs', '.cjs'])
const STYLE = new Set(['.css', '.scss', '.pcss'])
const MAX_BYTES = 500_000

const extensionOf = (file: string): string => /\.[a-z0-9]+$/i.exec(file)?.[0].toLowerCase() ?? ''

/** Every file under `dir` the check reads, as paths relative to it, sorted. */
export function sourceFiles(dir: string, options: SourceOptions = {}): string[] {
  const files: string[] = []
  const excluded = new Set((options.exclude ?? []).map(normalizeExclude))
  const walk = (current: string) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name)
      if (excluded.has(relative(dir, path).split(sep).join('/'))) continue
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(path)
        continue
      }
      if (!entry.isFile()) continue
      const extension = extensionOf(entry.name)
      if (!MARKUP.has(extension) && !SCRIPT.has(extension) && !STYLE.has(extension)) continue
      if (/\.(d\.ts|min\.(js|css)|config\.[cm]?[jt]s|test\.[jt]sx?|spec\.[jt]sx?)$/.test(entry.name)) continue
      if (statSync(path).size > MAX_BYTES) continue
      const rel = relative(dir, path).split(sep).join('/')
      if (!options.includeUi && /(^|\/)components\/ui\//.test(rel)) continue
      files.push(rel)
    }
  }
  walk(dir)
  return files.sort()
}

/** A stylesheet that defines the theme itself: its color values belong there. */
const isThemeStylesheet = (text: string): boolean => /@theme\b|--(color-)?(background|primary|foreground)\s*:/.test(text)

// A class candidate: optional variants, a lower-case utility name, an optional
// arbitrary value in brackets or parentheses, and an optional modifier.
const CANDIDATE =
  /(?<![\w./@#$-])!?(?:[a-z0-9@*-]+(?:\[[^\]\s]*\])?:)*-?[a-z][a-z0-9]*(?:-[a-z0-9.]+)*(?:-\[[^\]\s]+\]|-\([^)\s]+\))?(?:\/[a-z0-9.%]+|\/\[[^\]\s]+\])?!?(?![\w-])/g
const COLOR_FUNCTION = '(?:rgba?|hsla?|oklch|oklab)\\([^)"\'`]*\\)'
const HEX = '#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})'
/** A string literal that is nothing but a color: `"#1F3BFF"`, `'rgb(0 0 0)'`. */
const QUOTED_COLOR = new RegExp(`(["'\`])(${HEX}|${COLOR_FUNCTION})\\1`, 'g')
/** A color anywhere in a line of CSS. */
const CSS_COLOR = new RegExp(`${HEX}(?![0-9a-zA-Z_-])|${COLOR_FUNCTION}`, 'g')
const CSS_GRADIENT = /\b(?:repeating-)?(?:linear|radial|conic)-gradient\(/
// Characters that show as emoji by default, and any character forced to with a variation selector.
/** A font family set by hand in CSS or a style attribute: `font-family: Georgia`. */
const CSS_FONT_FAMILY = /font-family\s*:\s*["'`]?([^;"'`}]+)/
/** The same in a style object, where only a quoted name can be read: `fontFamily: "Georgia"`. */
const JS_FONT_FAMILY = /fontFamily\s*:\s*["'`]([^"'`]+)["'`]/

/** A comment that leaves code out of the check: this line, the next line, or the whole file. */
const IGNORE = /(?:\/\/|\/\*|<!--|#)\s*strict-ignore(-next-line|-file)?(?![\w-])/

const EMOJI = /\p{Emoji_Presentation}|\p{Extended_Pictographic}️/u

/**
 * The quoted string that position `index` of `line` is inside, when it opened
 * on the same line: its text up to the closing quote or the end of the line.
 */
function stringAround(line: string, index: number): string | null {
  let open: string | null = null
  let start = 0
  for (let i = 0; i < index; i++) {
    const char = line[i]
    if (char === '\\') i++
    else if (open === null && (char === '"' || char === "'" || char === '`')) {
      open = char
      start = i + 1
    } else if (char === open) open = null
  }
  if (open === null) return null
  let end = index
  while (end < line.length && line[end] !== open) end += line[end] === '\\' ? 2 : 1
  return line.slice(start, end)
}

/** Words a sentence has and a list of classes never does. */
const PROSE = /(?:^|\s)(?:the|and|are|is|was|were|to|of|a|an|in|or|up|down|off)(?=\s|$)|[a-z][.,;?!](?=\s|$)|(?:^|\s)[A-Z][a-z]+(?=\s|$)/

/** True when a string reads as a sentence, not as a list of classes. */
function isProse(text: string): boolean {
  return PROSE.test(text)
}

/**
 * Checks the code of a project against the theme's rules: the Tailwind
 * classes it uses, colors written out by hand, gradients and emoji.
 *
 * It reads class names as text, so it works the same in React, Vue, Svelte,
 * Astro and plain HTML. It does not know what a class resolves to in this
 * project; the rendered check measures that.
 */
export function checkSource(dir: string, rules: Rules, options: SourceOptions = {}): CheckResult {
  const findings: CheckFinding[] = []
  const counts = emptyCounts()
  const emojiSeverity = tellSeverity(rules, 'emoji-icons')
  const gradientSeverity = tellSeverity(rules, 'purple-gradient')
  let ignored = 0

  for (const file of sourceFiles(dir, options)) {
    const text = readFileSync(join(dir, file), 'utf8')
    const extension = extensionOf(file)
    const isStyle = STYLE.has(extension)
    const themeStylesheet = isStyle && isThemeStylesheet(text)
    const lines = text.split('\n')
    if (lines.some((line) => IGNORE.exec(line)?.[1] === '-file')) {
      ignored++
      continue
    }

    lines.forEach((content, index) => {
      const marker = IGNORE.exec(content)
      const previous = index > 0 ? IGNORE.exec(lines[index - 1] ?? '') : null
      if ((marker && marker[1] === undefined) || previous?.[1] === '-next-line') {
        ignored++
        return
      }
      const seen = new Set<string>()
      const report = (category: Category, value: string, problem: Problem) => {
        counts[category].failed++
        if (seen.has(`${problem.rule} ${value}`)) return
        seen.add(`${problem.rule} ${value}`)
        findings.push({ ...problem, category, value, file, line: index + 1 })
      }

      for (const match of content.matchAll(CANDIDATE)) {
        const candidate = match[0]
        // "rounded" is also an English word: it is a class only inside a string
        // that is not a sentence ("Figures are rounded to the nearest pound").
        if (candidate === 'rounded') {
          const around = stringAround(content, match.index)
          if (around === null || isProse(around)) continue
        }
        const verdict = checkClass(candidate, rules)
        if (!verdict) continue
        counts[verdict.category].checked++
        if (verdict.problem) report(verdict.category, candidate, verdict.problem)
      }

      if (rules.colors && !themeStylesheet) {
        const literals = isStyle
          ? [...content.matchAll(CSS_COLOR)].map((match) => match[0])
          : [...content.matchAll(QUOTED_COLOR)]
              // `href="#fee"` is a link to an element, not a color.
              .filter((match) => !/(href|to|id|htmlFor|for)=\{?$/.test(content.slice(0, match.index)))
              .map((match) => match[2] ?? '')
        for (const literal of literals) {
          const problem = colorLiteralProblem(literal, rules)
          if (!problem) continue
          counts.colors.checked++
          report('colors', literal, problem)
        }
      }

      // In a component a gradient only counts where it is a style: text that mentions one is content.
      if (gradientSeverity && !themeStylesheet && CSS_GRADIENT.test(content) && (isStyle || /\bstyle\s*=|-\[[^\]]*gradient\(/.test(content))) {
        counts.tells.checked++
        report('tells', 'gradient', {
          rule: 'tell-gradient',
          severity: gradientSeverity,
          message: `A CSS gradient. ${rules.name} does not allow purple or multi-color gradients; use a flat theme color.`,
        })
      }

      const family =
        rules.fonts && !themeStylesheet
          ? (CSS_FONT_FAMILY.exec(content)?.[1] ?? (isStyle ? undefined : JS_FONT_FAMILY.exec(content)?.[1]))
          : undefined
      if (family !== undefined && rules.fonts) {
        const first = (family.split(',')[0] ?? '').trim().replace(/^["']|["']$/g, '')
        // A variable or a keyword follows the theme; only a named family can be off it.
        if (first !== '' && !/^(var\(|inherit|initial|unset|revert|\{|\$)/.test(first) && !/^(sans-serif|serif|monospace|system-ui|ui-[a-z-]+)$/.test(first)) {
          counts.typography.checked++
          if (!rules.fonts.includes(first.toLowerCase().replace(/ (variable|var|vf)$/, ''))) {
            report('typography', first, {
              rule: 'font-undeclared',
              severity: 'error',
              message: `${first} is not a font the theme declares (${rules.fonts.join(', ')}). Use the theme's font classes.`,
            })
          }
        }
      }

      if (emojiSeverity && !isStyle) {
        const emoji = EMOJI.exec(content)
        if (emoji) {
          counts.tells.checked++
          report('tells', emoji[0], {
            rule: 'tell-emoji',
            severity: emojiSeverity,
            message: `${emoji[0]} is an emoji. ${rules.name} does not use emoji as icons or bullets. Where it stands for an icon, use one from the project's icon set; where it decorates text, remove it.`,
          })
        }
      }
    })
  }
  const excluded = [...new Set((options.exclude ?? []).map(normalizeExclude))].filter((path) => path !== '')
  return { findings, counts, ignored, ...(excluded.length > 0 ? { excluded } : {}) }
}
