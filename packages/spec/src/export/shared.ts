export const slug = (name: string): string =>
  name
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const GENERIC_FAMILIES = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'ui-rounded',
  'math',
  'emoji',
])

/** Quotes each family in a font stack that needs quoting. */
export function cssFontFamily(value: string): string {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((family) => {
      if (/^["'].*["']$/.test(family)) return family
      if (GENERIC_FAMILIES.has(family.toLowerCase())) return family
      return /^[A-Za-z_-][A-Za-z0-9_-]*$/.test(family) ? family : `"${family}"`
    })
    .join(', ')
}

const MONO_HINT = /mono|code|courier|consolas|menlo/i
const SERIF_HINT =
  /serif|georgia|times|garamond|playfair|merriweather|baskerville|caslon|didot|bodoni|fraunces|newsreader|marcellus|caprasimo|cormorant|literata/i

/**
 * A quoted font stack that ends in a generic family, so text still renders in
 * the right kind of typeface before the web font loads, or when it never does.
 * A stack that already ends in a generic family is left alone.
 */
export function fontStack(value: string): string {
  const stack = cssFontFamily(value)
  const last = stack.split(',').pop()?.trim().toLowerCase() ?? ''
  if (GENERIC_FAMILIES.has(last)) return stack
  if (MONO_HINT.test(value)) return `${stack}, ui-monospace, monospace`
  if (SERIF_HINT.test(value) && !/sans/i.test(value)) return `${stack}, ui-serif, serif`
  return `${stack}, ui-sans-serif, system-ui, sans-serif`
}

/** The named (non-generic) font families a spec uses, in first-use order. */
export function namedFamilies(typography: Record<string, { fontFamily?: unknown }>): string[] {
  const seen = new Set<string>()
  for (const token of Object.values(typography)) {
    if (typeof token.fontFamily !== 'string') continue
    for (const part of token.fontFamily.split(',')) {
      const family = part.trim().replace(/^["']|["']$/g, '')
      if (family && !GENERIC_FAMILIES.has(family.toLowerCase())) seen.add(family)
    }
  }
  return [...seen]
}

export interface FontRoles {
  sans?: string
  mono?: string
  heading?: string
}

/**
 * Picks the body, monospace and heading font stacks out of a spec's typography
 * tokens. Body and heading are found by token name; a mono font by its token
 * name or, failing that, its family name. `heading` is only set when it
 * differs from the body font.
 */
export function fontRoles(typography: Record<string, { fontFamily?: unknown }>): FontRoles {
  const entries = Object.entries(typography)
  const family = (...names: string[]): string | undefined => {
    for (const name of names) {
      const value = typography[name]?.fontFamily
      if (typeof value === 'string') return fontStack(value)
    }
    return undefined
  }
  const byHint = (hint: RegExp) => entries.find(([name]) => hint.test(name))?.[0] ?? ''
  const sans = family('body', 'body-md', byHint(/body|text|paragraph/i)) ?? family(entries[0]?.[0] ?? '')
  const monoByFamily = entries.find(
    ([, token]) => typeof token.fontFamily === 'string' && MONO_HINT.test(token.fontFamily),
  )?.[0]
  const mono = family(byHint(/mono|code/i), monoByFamily ?? '')
  const heading = family(byHint(/^h1$|heading|headline|title|display/i))
  return {
    ...(sans ? { sans } : {}),
    ...(mono ? { mono } : {}),
    ...(heading && heading !== sans ? { heading } : {}),
  }
}

/** Tailwind's own size names. A theme variable with one of these names would replace Tailwind's value. */
export const TAILWIND_SIZE_NAMES = new Set([
  '3xs', '2xs', 'xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl',
])

/**
 * The type scale as Tailwind v4 theme variables, without the leading `--`:
 * `text-<token>` plus its line height, weight and letter spacing, which makes
 * `text-<token>` a utility that sets all four. With `keepTailwindSizes`, a
 * token named like a Tailwind size (`sm`, `lg`…) is left out so it cannot
 * change the size of existing components.
 */
export function textScaleVars(
  typography: Record<string, { fontSize?: unknown; lineHeight?: unknown; fontWeight?: unknown; letterSpacing?: unknown }>,
  options: { keepTailwindSizes?: boolean } = {},
): [string, string][] {
  const out: [string, string][] = []
  for (const [name, token] of Object.entries(typography)) {
    const id = slug(name)
    if (token.fontSize === undefined) continue
    if (options.keepTailwindSizes && TAILWIND_SIZE_NAMES.has(id)) continue
    const key = `text-${id}`
    out.push([key, String(token.fontSize)])
    if (token.lineHeight !== undefined) out.push([`${key}--line-height`, String(token.lineHeight)])
    if (token.fontWeight !== undefined) out.push([`${key}--font-weight`, String(token.fontWeight)])
    if (token.letterSpacing !== undefined) out.push([`${key}--letter-spacing`, String(token.letterSpacing)])
  }
  return out
}

export function block(selector: string, declarations: [string, string][]): string {
  if (declarations.length === 0) return ''
  const lines = declarations.map(([name, value]) => `  ${name}: ${value};`)
  return `${selector} {\n${lines.join('\n')}\n}\n`
}
