import { z } from 'zod'

/** Where the themes are read from, unless `STRICT_THEMES_URL` names another copy of the site. */
export const CATALOG_URL = 'https://strictthemes.com'

/** The themes could not be read, or the theme or page asked for does not exist. */
export class CatalogError extends Error {
  override name = 'CatalogError'
}

const slug = z.string().regex(/^[a-z0-9][a-z0-9-]*$/)

const promptSchema = z.object({
  slug,
  title: z.string(),
  description: z.string(),
  example: z
    .object({
      preview: z.string(),
      check: z.object({ score: z.number(), errors: z.number(), warnings: z.number() }),
    })
    .optional(),
})

const themeSchema = z.object({
  slug,
  name: z.string(),
  description: z.string(),
  fonts: z.object({ heading: z.string().optional(), body: z.string().optional(), mono: z.string().optional() }),
  page: z.string().optional(),
  install: z.object({ command: z.string(), notes: z.string().optional() }),
  exports: z.array(z.string()).optional(),
  prompts: z.array(promptSchema),
})

/** `/themes.json` on strictthemes.com: every theme and its page prompts. Fields it does not name are ignored. */
export const catalogSchema = z.object({ version: z.number(), themes: z.array(themeSchema) })

export type Catalog = z.infer<typeof catalogSchema>
export type CatalogTheme = z.infer<typeof themeSchema>
export type CatalogPrompt = z.infer<typeof promptSchema>

/** The site the themes are read from, without a slash at the end. */
export function catalogBase(env: Record<string, string | undefined> = process.env): string {
  const base = (env.STRICT_THEMES_URL ?? '').trim() || CATALOG_URL
  if (!/^https?:\/\//.test(base)) throw new CatalogError(`STRICT_THEMES_URL is "${base}", which is not an http or https address.`)
  return base.replace(/\/+$/, '')
}

const TIMEOUT_MS = 15_000
/** The longest answer taken: a page prompt is about 40,000 characters. */
const MAX_CHARS = 1_000_000

const FRESH_MS = 5 * 60_000
/** Files kept at most. A hosted server is asked for the same few again and again. */
const KEPT_FILES = 200
const texts = new Map<string, { at: number; text: string }>()

/** A file of the site, read once and kept for five minutes. */
async function fetchText(url: string): Promise<string> {
  const kept = texts.get(url)
  if (kept && Date.now() - kept.at < FRESH_MS) return kept.text
  const text = await fetchFresh(url)
  if (texts.size >= KEPT_FILES) texts.delete(texts.keys().next().value as string)
  texts.set(url, { at: Date.now(), text })
  return text
}

async function fetchFresh(url: string): Promise<string> {
  let response: Response
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), headers: { 'User-Agent': 'strict-check-mcp' } })
  } catch (error) {
    const reason = error instanceof Error && error.name === 'TimeoutError' ? `no answer in ${TIMEOUT_MS / 1000} seconds` : 'no connection'
    throw new CatalogError(`Could not read ${url}: ${reason}. The theme tools read the themes from ${new URL(url).host} and need a connection to it.`)
  }
  if (!response.ok) throw new CatalogError(`Could not read ${url}: the site answered ${response.status}.`)
  const text = await response.text()
  if (text.length > MAX_CHARS) throw new CatalogError(`Could not read ${url}: the answer is longer than expected.`)
  return text
}

const cache = new Map<string, { at: number; catalog: Catalog }>()

/** Every theme and its page prompts, read from the site and kept for five minutes. */
export async function loadCatalog(base = catalogBase()): Promise<Catalog> {
  const kept = cache.get(base)
  if (kept && Date.now() - kept.at < FRESH_MS) return kept.catalog
  const url = `${base}/themes.json`
  const text = await fetchText(url)
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new CatalogError(`Could not read ${url}: the answer is not JSON.`)
  }
  const result = catalogSchema.safeParse(parsed)
  if (!result.success) {
    throw new CatalogError(`Could not read ${url}: it is not a list of themes this version understands. A newer @strictthemes/check may be needed.`)
  }
  cache.set(base, { at: Date.now(), catalog: result.data })
  return result.data
}

/** The theme with this slug or name. An unknown one is an error that lists the themes there are. */
export function findTheme(catalog: Catalog, wanted: string): CatalogTheme {
  const key = wanted.trim().toLowerCase()
  const theme = catalog.themes.find((entry) => entry.slug === key || entry.name.toLowerCase() === key)
  if (!theme) {
    throw new CatalogError(`There is no theme "${wanted}". The themes are: ${catalog.themes.map((entry) => entry.slug).join(', ')}.`)
  }
  return theme
}

/** The page prompt of a theme with this slug or title. An unknown one is an error that lists the theme's pages. */
export function findPrompt(theme: CatalogTheme, wanted: string): CatalogPrompt {
  const key = wanted.trim().toLowerCase()
  const prompt = theme.prompts.find((entry) => entry.slug === key || entry.title.toLowerCase() === key)
  if (!prompt) {
    throw new CatalogError(
      `${theme.name} has no page prompt "${wanted}". Its page prompts are: ${theme.prompts.map((entry) => entry.slug).join(', ') || 'none'}.`,
    )
  }
  return prompt
}

/** A theme's DESIGN.md, as the site serves it. */
export const loadSpecText = (theme: CatalogTheme, base = catalogBase()): Promise<string> => fetchText(`${base}/themes/${theme.slug}/DESIGN.md`)

/** A page prompt in full, as the site serves it. */
export const loadPromptText = (theme: CatalogTheme, prompt: CatalogPrompt, base = catalogBase()): Promise<string> =>
  fetchText(`${base}/themes/${theme.slug}/prompts/${prompt.slug}.md`)

const fontsOf = (theme: CatalogTheme): string => {
  const { heading, body, mono } = theme.fonts
  return [heading && `${heading} for headings`, body && `${body} for body text`, mono && `${mono} for labels and code`].filter(Boolean).join(', ')
}

const builtOnce = (prompt: CatalogPrompt): string =>
  prompt.example
    ? ` The page built from it: Strict Check ${prompt.example.check.score}%, ${count(prompt.example.check.errors, 'error')}. See it at ${prompt.example.preview}`
    : ''

const count = (n: number, word: string): string => `${n} ${word}${n === 1 ? '' : 's'}`

/** The answer of `list_themes`: one entry for each theme. */
export function describeThemes(catalog: Catalog): string {
  return [
    `Strict has ${count(catalog.themes.length, 'theme')}. Each is one DESIGN.md file with a light and a dark mode, and installs into a shadcn project with one command.`,
    '',
    ...catalog.themes.flatMap((theme) => [
      `${theme.slug}: ${theme.name}. ${theme.description}`,
      `  Fonts: ${fontsOf(theme)}.`,
      ...(theme.prompts.length > 0 ? [`  Page prompts: ${theme.prompts.map((prompt) => prompt.slug).join(', ')}.`] : []),
    ]),
    '',
    'Next: get_theme with a slug returns that theme\'s DESIGN.md and how to install it. list_prompts describes its page prompts, and get_prompt returns one in full.',
  ].join('\n')
}

/** The answer of `get_theme`: how to install a theme, then its DESIGN.md. */
export function describeTheme(theme: CatalogTheme, specText: string): string {
  const tailwind = (theme.exports ?? []).find((url) => url.endsWith('/tailwind.css'))
  const others = (theme.exports ?? []).filter((url) => url !== tailwind)
  return [
    `${theme.name} (${theme.slug}). ${theme.description}`,
    `Fonts: ${fontsOf(theme)}.`,
    ...(theme.page ? [`Its page, with live previews: ${theme.page}`] : []),
    '',
    '## Install',
    '',
    `1. In a shadcn project, run \`${theme.install.command}\`. It adds the theme's colors, type classes, corners and fonts to the global CSS.`,
    `2. Save the DESIGN.md below as \`DESIGN.md\` in the project's root, unchanged. It is the source of truth for every visual decision, and Strict Check reads it from there.`,
    ...(tailwind ? [`In a project without shadcn, use ${tailwind} instead of step 1.`] : []),
    ...(others.length > 0 ? [`Other exports: ${others.join(', ')}.`] : []),
    ...(theme.install.notes ? ['', '## After the install', '', theme.install.notes] : []),
    '',
    '## Page prompts',
    '',
    theme.prompts.length > 0
      ? `${theme.prompts.map((prompt) => `${prompt.slug} (${prompt.title})`).join(', ')}. get_prompt returns one in full.`
      : 'This theme has none yet.',
    '',
    '## DESIGN.md',
    '',
    specText.trimEnd(),
    '',
  ].join('\n')
}

/**
 * The answer of `list_prompts`: what each page prompt builds, for one theme or for all.
 * For one theme it also says how the page built from each prompt scored; for all, that would double a long list.
 */
export function describePrompts(themes: CatalogTheme[]): string {
  const total = themes.reduce((sum, theme) => sum + theme.prompts.length, 0)
  const one = themes.length === 1
  return [
    `${count(total, 'page prompt')}${one ? ` for ${themes[0]?.name}` : ` in ${count(themes.length, 'theme')}`}. A page prompt is a complete brief for one page built with its theme: the sections, the layout, the sample content, the behavior and a checklist.`,
    '',
    ...themes.flatMap((theme) => [
      `## ${theme.name} (${theme.slug})`,
      '',
      ...(theme.prompts.length > 0
        ? theme.prompts.map((prompt) => `- ${prompt.slug}: ${prompt.title}. Builds ${prompt.description}${one ? builtOnce(prompt) : ''}`)
        : ['- None yet.']),
      '',
    ]),
    one
      ? 'Next: get_prompt with a theme and a page returns the prompt in full.'
      : 'Next: list_prompts with one theme also says how the page built from each prompt scored. get_prompt with a theme and a page returns the prompt in full.',
  ].join('\n')
}
