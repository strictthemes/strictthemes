import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  fontRoles,
  lintSpec,
  namedFamilies,
  slug,
  toDtcg,
  toNuxtUi,
  toShadcnCss,
  toShadcnTheme,
  toTailwindCss,
  type Finding,
  type StrictSpec,
} from '@strictthemes/spec'
import { FONTS } from './fonts.ts'
import { composePrompt, mergeSetup, parseBrief, type PageBrief, type PagePrompt } from './prompts.ts'

export const DEFAULT_BASE_URL = 'https://strictthemes.com/r'
const ITEM_SCHEMA = 'https://ui.shadcn.com/schema/registry-item.json'

/**
 * The CSS variable each font role fills in a shadcn project, and the elements
 * it applies to. Without a selector shadcn applies every font to `html`, and
 * the last one installed (the mono font) would take over the whole page.
 */
const ROLES = {
  sans: { variable: '--font-sans', selector: 'html' },
  mono: { variable: '--font-mono', selector: 'code, kbd, pre, samp' },
  heading: { variable: '--font-heading', selector: 'h1, h2, h3, h4, h5, h6' },
} as const
type Role = keyof typeof ROLES

export interface RegistryItem {
  $schema: string
  name: string
  type: string
  title: string
  description?: string
  docs?: string
  registryDependencies?: string[]
  /** npm packages the item needs. */
  dependencies?: string[]
  /** CSS added to the project's global stylesheet, in shadcn's object form. */
  css?: Record<string, Record<string, never>>
  cssVars?: Record<string, Record<string, string>>
  font?: Record<string, unknown>
}

export interface Theme {
  slug: string
  source: string
  spec: StrictSpec
  findings: Finding[]
  /** Page briefs, from `prompts/<page>.md`. */
  briefs: PageBrief[]
  /** Layout conventions shared by every page prompt of this theme, from `prompts/_shared.md`. */
  promptNotes: string
}

export interface Registry {
  themes: Theme[]
  /** Every registry item, themes first, then the fonts they depend on. */
  items: RegistryItem[]
  /** Every page prompt, composed and ready to paste. */
  prompts: PagePrompt[]
  /** Output files, keyed by path relative to the output directory. */
  files: Map<string, string>
}

/** The file in a theme's `prompts/` folder that holds notes shared by all its page prompts. */
export const SHARED_PROMPT_FILE = '_shared'

/**
 * Lints one DESIGN.md source into a theme. `promptFiles` maps a file name
 * without extension (`landing`, `_shared`) to its Markdown source.
 */
export function themeFromSource(themeSlug: string, source: string, promptFiles: Record<string, string> = {}): Theme {
  const { spec, findings } = lintSpec(source)
  const briefs = Object.entries(promptFiles)
    .filter(([name]) => !name.startsWith('_'))
    .map(([name, brief]) => parseBrief(name, brief))
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))
  return {
    slug: themeSlug,
    source,
    spec,
    findings,
    briefs,
    promptNotes: (promptFiles[SHARED_PROMPT_FILE] ?? '').trim(),
  }
}

/** Reads every `<dir>/<slug>/DESIGN.md` and lints it. */
export function loadThemes(dir: string): Theme[] {
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .map((name) => {
      const prompts = join(dir, name, 'prompts')
      const promptFiles: Record<string, string> = {}
      if (existsSync(prompts)) {
        for (const file of readdirSync(prompts).filter((f) => f.endsWith('.md'))) {
          promptFiles[file.slice(0, -'.md'.length)] = readFileSync(join(prompts, file), 'utf8')
        }
      }
      return themeFromSource(name, readFileSync(join(dir, name, 'DESIGN.md'), 'utf8'), promptFiles)
    })
}

/** The first family of a font stack, without quotes. */
const firstFamily = (stack: string): string => (stack.split(',')[0] ?? '').trim().replace(/^["']|["']$/g, '')

/** One `registry:font` item per font role the catalog can supply. */
function fontItems(spec: StrictSpec): { role: Role; item: RegistryItem }[] {
  const roles = fontRoles(spec.typography)
  const out: { role: Role; item: RegistryItem }[] = []
  for (const role of Object.keys(ROLES) as Role[]) {
    const stack = roles[role]
    if (!stack) continue
    const family = firstFamily(stack)
    const source = FONTS[family]
    if (!source) continue
    out.push({
      role,
      item: {
        $schema: ITEM_SCHEMA,
        name: `font-${slug(family)}-${role}`,
        type: 'registry:font',
        title: family,
        font: {
          family: `'${source.cssFamily}', ${source.generic}`,
          provider: 'google',
          import: source.import,
          variable: ROLES[role].variable,
          ...(source.weight ? { weight: source.weight } : {}),
          subsets: ['latin'],
          selector: ROLES[role].selector,
          dependency: source.dependency,
        },
      },
    })
  }
  return out
}

/**
 * Builds the registry: one `registry:theme` item per theme, the
 * `registry:font` items they depend on, an index, and each theme's other
 * exports (Tailwind, Nuxt UI, design tokens).
 *
 * A theme item leaves out the font variables its font items set, because the
 * installed font registers under its package's family name ("Archivo
 * Variable"), not the name in DESIGN.md.
 */
export function buildRegistry(themesDir: string, baseUrl: string = DEFAULT_BASE_URL): Registry {
  return buildRegistryFromThemes(loadThemes(themesDir), baseUrl)
}

/** The same build for themes that are already loaded, for example by a bundler. */
export function buildRegistryFromThemes(themes: Theme[], baseUrl: string = DEFAULT_BASE_URL): Registry {
  const base = baseUrl.replace(/\/+$/, '')
  // The site the registry lives on: the registry URL without its last path segment.
  const siteUrl = base.replace(/\/[^/]+$/, '')
  const prompts: PagePrompt[] = []
  const themeItems: RegistryItem[] = []
  const fonts = new Map<string, RegistryItem>()
  const files = new Map<string, string>()
  const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`

  for (const theme of themes) {
    const { spec } = theme
    const shadcn = toShadcnTheme(spec)
    const item: RegistryItem = { ...shadcn, name: theme.slug, cssVars: { ...shadcn.cssVars } }
    const themeFonts = { ...shadcn.cssVars.theme }
    const dependencies: string[] = []
    const packages = new Set<string>()
    const css: Record<string, Record<string, never>> = {}
    for (const { role, item: font } of fontItems(spec)) {
      fonts.set(font.name, font)
      dependencies.push(`${base}/${font.name}.json`)
      delete themeFonts[`font-${role}`]
      // Outside Next.js the CLI imports the font package's default file, which
      // for a non-variable font is weight 400 only. The other weights the
      // catalog lists are imported by the theme itself.
      const source = FONTS[firstFamily(fontRoles(spec.typography)[role] ?? '')]
      for (const weight of source?.weight ?? []) {
        if (weight === '400') continue
        packages.add(source!.dependency)
        css[`@import "${source!.dependency}/${weight}.css"`] = {}
      }
      // The default file is the upright font only. The italic is its own file.
      if (source?.italic) {
        packages.add(source.dependency)
        css[`@import "${source.dependency}/${source.italic}"`] = {}
      }
    }
    if (packages.size > 0) item.dependencies = [...packages]
    if (Object.keys(css).length > 0) item.css = css
    item.cssVars = { ...shadcn.cssVars, theme: themeFonts }
    if (dependencies.length > 0) item.registryDependencies = dependencies
    // The note about loading fonts by hand only applies when some font has no item.
    if (Object.keys(themeFonts).every((name) => !name.startsWith('font-'))) delete item.docs
    // Printed by the CLI after install: without this, cn() drops the theme's type classes.
    const typeClasses = Object.keys(themeFonts).filter((name) => /^text-[a-z0-9]+$/.test(name))
    if (typeClasses.length > 0) {
      item.docs = [
        item.docs,
        `${spec.name} adds type classes: ${typeClasses.join(', ')}. shadcn's cn() takes them for colors and drops them next to a text color. To fix that, set lib/utils.ts to the code below, and in components/ui import cn from that file instead of from "cn":\n\n${mergeSetup(spec)}`,
      ].filter(Boolean).join('\n\n')
    }
    if (dependencies.length > 0) {
      // A new shadcn project imports Geist. A theme set in Geist must not tell the user to remove it.
      const usesGeist = namedFamilies(spec.typography).includes('Geist')
      item.docs = [
        item.docs,
        usesGeist
          ? `${spec.name} brings its own fonts. One of them is Geist, which a new shadcn project already imports: keep that import.`
          : `${spec.name} brings its own fonts. If your global CSS still imports another font (a new shadcn project imports Geist), remove that import and its package unless you use the font elsewhere.`,
      ].filter(Boolean).join('\n\n')
    }
    themeItems.push(item)

    const nuxt = toNuxtUi(spec)
    files.set(`themes/${theme.slug}/DESIGN.md`, theme.source)
    files.set(`themes/${theme.slug}/tailwind.css`, toTailwindCss(spec))
    files.set(`themes/${theme.slug}/shadcn.css`, toShadcnCss(spec))
    files.set(`themes/${theme.slug}/nuxt-ui.css`, nuxt.css)
    files.set(`themes/${theme.slug}/app.config.ts`, nuxt.appConfig)
    files.set(`themes/${theme.slug}/tokens.json`, json(toDtcg(spec)))
    for (const brief of theme.briefs) {
      const prompt = composePrompt(theme, brief, siteUrl)
      prompts.push({ ...brief, theme: theme.slug, prompt })
      files.set(`themes/${theme.slug}/prompts/${brief.slug}.md`, prompt)
    }
  }

  const items = [...themeItems, ...[...fonts.values()].sort((a, b) => a.name.localeCompare(b.name))]
  for (const item of items) files.set(`r/${item.name}.json`, json(item))
  files.set(
    'r/registry.json',
    json({
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      name: 'strict',
      homepage: 'https://strictthemes.com',
      items: items.map(({ $schema: _schema, ...rest }) => rest),
    }),
  )
  return { themes, items, prompts, files }
}
