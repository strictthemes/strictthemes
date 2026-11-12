import { createHash } from "node:crypto"

import { fontRoles, type StrictSpec } from "@strictthemes/spec"
import {
  buildRegistryFromThemes,
  FONTS,
  themeFromSource,
  type PagePrompt,
  type RegistryItem,
} from "@strictthemes/themes"

// Server-side only: this module reads the theme sources at build time.
const sources = import.meta.glob<string>(
  "../../../../packages/themes/themes/*/DESIGN.md",
  { query: "?raw", import: "default", eager: true }
)

const promptSources = import.meta.glob<string>(
  "../../../../packages/themes/themes/*/prompts/*.md",
  { query: "?raw", import: "default", eager: true }
)

/** A theme's prompt files, keyed by file name without extension. */
function promptFilesFor(slug: string): Record<string, string> {
  const files: Record<string, string> = {}
  for (const [path, source] of Object.entries(promptSources)) {
    const parts = path.split("/")
    if (parts.at(-3) !== slug) continue
    files[(parts.at(-1) ?? "").replace(/\.md$/, "")] = source
  }
  return files
}

/**
 * An example is the page a coding agent built from a page prompt, kept in
 * examples/<theme>/<page>/ as the agent left it. `example.json` beside it says
 * who built it and what Strict Check measured.
 */
export interface PromptExample {
  /** The tool the page was built in, e.g. "Claude Code". */
  tool: string
  model: string
  /** The day it was built, as YYYY-MM-DD. */
  date: string
  /** Which text of the prompt it was built from: see `promptVersion`. */
  prompt: string
  check: {
    /** Share of measured values that follow the theme, in percent. */
    score: number
    /** How many values Strict Check measured in the rendered page. */
    values: number
    errors: number
    warnings: number
  }
}

const exampleSources = import.meta.glob<PromptExample>(
  "../../examples/*/*/example.json",
  { import: "default", eager: true }
)

/** The built example for a theme's page prompt, if there is one. */
export function exampleFor(slug: string, page: string): PromptExample | undefined {
  return exampleSources[`../../examples/${slug}/${page}/example.json`]
}

/**
 * A short fingerprint of a prompt's text, as it is served on strictthemes.com.
 * An example records the one it was built from, so the site can say when the
 * prompt has changed since.
 */
export function promptVersion(prompt: string): string {
  const served = prompt.replaceAll(SITE_URL, "https://strictthemes.com")
  return createHash("sha256").update(served).digest("hex").slice(0, 16)
}

/** Where a prompt's files are served. */
export const promptUrls = (slug: string, page: string) => ({
  /** The prompt itself, as Markdown. */
  prompt: `/themes/${slug}/prompts/${page}.md`,
  /** The preview page, with the built example in a frame. */
  preview: `/themes/${slug}/prompts/${page}/`,
  /** The built example on its own. */
  build: `/themes/${slug}/prompts/${page}/build/`,
})

export const SITE_URL = (
  import.meta.env.SITE ?? "https://strictthemes.com"
).replace(/\/+$/, "")

/** The order themes are shown in. Anything not listed follows alphabetically. */
const ORDER = [
  "strict-one",
  "recital",
  "avion",
  "kiln",
  "ledger",
  "cipher",
  "sorbet",
  "atelier",
  "civic",
  "dispatch",
  "tisane",
  "voltage",
  "nocturne",
]
const rank = (slug: string) =>
  ORDER.includes(slug) ? ORDER.indexOf(slug) : ORDER.length

const loaded = Object.entries(sources)
  .map(([path, source]) => {
    const slug = path.split("/").at(-2) ?? ""
    return themeFromSource(slug, source, promptFilesFor(slug))
  })
  .sort((a, b) => rank(a.slug) - rank(b.slug) || a.slug.localeCompare(b.slug))

export const registry = buildRegistryFromThemes(loaded, `${SITE_URL}/r`)

export interface ThemeView {
  slug: string
  /** Position in the catalog, as "01". */
  number: string
  name: string
  description: string
  spec: StrictSpec
  item: RegistryItem
  light: Record<string, string>
  dark: Record<string, string>
  /** CSS font stacks, using the family names the font packages register. */
  fonts: { sans: string; mono: string; heading: string }
  installCommand: string
  /** Downloadable exports, as file names under /themes/<slug>/. */
  files: string[]
  /** Page prompts, served at /themes/<slug>/prompts/<name>.md. */
  prompts: PagePrompt[]
  /**
   * How the theme sets a large heading: the weight, tracking and line height
   * of its display size. A specimen uses these, so a font that has one weight
   * is never shown in a faked bold.
   */
  headingStyle: { fontWeight: string; letterSpacing: string; lineHeight: string }
}

/** The CSS stack for a family name from DESIGN.md. */
export function cssFontStack(family: string): string {
  const name = (family.split(",")[0] ?? "").trim().replace(/^["']|["']$/g, "")
  const source = FONTS[name]
  return source ? `'${source.cssFamily}', ${source.generic}` : family
}

function headingStyle(spec: StrictSpec): ThemeView["headingStyle"] {
  const token = spec.typography.display ?? spec.typography.h1 ?? {}
  return {
    fontWeight: String(token.fontWeight ?? 700),
    letterSpacing: String(token.letterSpacing ?? "normal"),
    lineHeight: String(token.lineHeight ?? 1.1),
  }
}

export const themes: ThemeView[] = registry.themes.map((theme, index) => {
  const item = registry.items.find((i) => i.name === theme.slug)
  if (!item) throw new Error(`No registry item for ${theme.slug}`)
  const roles = fontRoles(theme.spec.typography)
  const sans = cssFontStack(roles.sans ?? "sans-serif")
  return {
    slug: theme.slug,
    number: String(index + 1).padStart(2, "0"),
    name: theme.spec.name,
    description: theme.spec.description ?? "",
    spec: theme.spec,
    item,
    light: item.cssVars?.light ?? {},
    dark: item.cssVars?.dark ?? {},
    fonts: {
      sans,
      mono: cssFontStack(roles.mono ?? "monospace"),
      heading: roles.heading ? cssFontStack(roles.heading) : sans,
    },
    installCommand: `npx shadcn@latest add ${SITE_URL}/r/${theme.slug}.json`,
    files: [...registry.files.keys()]
      .filter((path) => path.startsWith(`themes/${theme.slug}/`))
      .filter((path) => path.split("/").length === 3)
      .map((path) => path.split("/").at(-1) ?? ""),
    prompts: registry.prompts.filter((prompt) => prompt.theme === theme.slug),
    headingStyle: headingStyle(theme.spec),
  }
})

export const getTheme = (slug: string): ThemeView | undefined =>
  themes.find((theme) => theme.slug === slug)

/** The theme the site itself wears. */
export const SITE_THEME = "strict-one"

const declarations = (vars: Record<string, string>): string =>
  Object.entries(vars)
    .map(([name, value]) => `--${name}:${value};`)
    .join("")

/**
 * CSS that scopes every theme's variables to `[data-theme="<slug>"]`, and its
 * dark values to `[data-mode="dark"]` on the same element. `:root` gets the
 * site's own theme.
 */
export function themeScopeCss(): string {
  return themes
    .map((theme) => {
      const fonts = declarations({
        "theme-font-sans": theme.fonts.sans,
        "theme-font-mono": theme.fonts.mono,
        "theme-font-heading": theme.fonts.heading,
        // The small corner steps the theme pins exactly (see radiusSteps in @strictthemes/spec).
        ...Object.fromEntries(
          Object.entries(theme.item.cssVars?.theme ?? {})
            .filter(([name]) => name.startsWith("radius-"))
            .map(([name, value]) => [`theme-${name}`, value])
        ),
      })
      const selector =
        theme.slug === SITE_THEME
          ? `:root,[data-theme="${theme.slug}"]`
          : `[data-theme="${theme.slug}"]`
      return (
        `${selector}{${declarations(theme.light)}${fonts}}` +
        `[data-theme="${theme.slug}"][data-mode="dark"]{${declarations(theme.dark)}}`
      )
    })
    .join("\n")
}
