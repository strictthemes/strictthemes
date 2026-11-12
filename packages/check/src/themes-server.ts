// The theme tools, and the server that has only them. This file and what it imports use nothing of Node,
// so the hosted server also runs where there is no file system: in a Cloudflare Worker, for one.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import {
  CatalogError,
  catalogBase,
  describePrompts,
  describeTheme,
  describeThemes,
  findPrompt,
  findTheme,
  loadCatalog,
  loadPromptText,
  loadSpecText,
} from './catalog.ts'
import { SERVER_VERSION } from './version.ts'

/** The server that is hosted for everyone: the theme tools alone, over HTTP. */
export const THEMES_SERVER_NAME = 'strict-themes'

const THEMES_INSTRUCTIONS = `This server hands you the Strict themes and their page prompts, from strictthemes.com. They are free to use.
A Strict theme is one DESIGN.md file with a light and a dark mode that installs into a shadcn project. "list_themes" names the themes, and "get_theme" returns one theme's DESIGN.md and how to install it: save that file as DESIGN.md in the project's root.
Each theme has page prompts. "list_prompts" says what each builds, and "get_prompt" returns the full brief for one page. Use a brief when the user asked for that page, and let what the user said about their own product replace its sample content.
This server cannot see the user's project. To check a project against its theme, the user connects Strict Check on their own machine: npx -y @strictthemes/check mcp`

const failure = (error: unknown) => ({
  isError: true,
  content: [
    {
      type: 'text' as const,
      text: error instanceof CatalogError ? error.message : `The themes could not be read: ${error instanceof Error ? error.message : String(error)}`,
    },
  ],
})

const text = (value: string) => ({ content: [{ type: 'text' as const, text: value }] })

/** The theme tools read strictthemes.com and change nothing. */
const READS_THE_SITE = { readOnlyHint: true, openWorldHint: true }

/** The hosted server: the four theme tools and nothing that reads a project. */
export function createThemesServer(): McpServer {
  const server = new McpServer({ name: THEMES_SERVER_NAME, version: SERVER_VERSION }, { instructions: THEMES_INSTRUCTIONS })
  registerThemeTools(server)
  return server
}

/** The tools that read the Strict themes and their page prompts from strictthemes.com. */
export function registerThemeTools(server: McpServer): void {
  server.registerTool(
    'list_themes',
    {
      title: 'The Strict themes',
      description:
        'Lists the Strict themes from strictthemes.com: for each its slug, name, what kind of site it suits, its fonts and the pages it has prompts for. A theme is one DESIGN.md file with a light and a dark mode that installs into a shadcn project. Call this when a project has no theme yet, or when the user asks which themes there are.',
      inputSchema: {},
      annotations: READS_THE_SITE,
    },
    async () => {
      try {
        return text(describeThemes(await loadCatalog()))
      } catch (error) {
        return failure(error)
      }
    },
  )

  server.registerTool(
    'get_theme',
    {
      title: 'One theme and how to install it',
      description:
        "Returns one Strict theme: the command that installs it into a shadcn project, what to do after the install, the theme's page prompts, and its whole DESIGN.md (colors in both modes, type, spacing, corners, components and rules). Save that DESIGN.md in the project's root: Strict Check reads it from there.",
      inputSchema: {
        theme: z.string().describe('The theme\'s slug, as list_themes gives it, for example "kiln".'),
      },
      annotations: READS_THE_SITE,
    },
    async ({ theme }) => {
      try {
        const base = catalogBase()
        const found = findTheme(await loadCatalog(base), theme)
        return text(describeTheme(found, await loadSpecText(found, base)))
      } catch (error) {
        return failure(error)
      }
    },
  )

  server.registerTool(
    'list_prompts',
    {
      title: 'The page prompts',
      description:
        'Lists the page prompts of one Strict theme, or of every theme: for each page its slug, its title and what it builds. For one theme it also says how the page built from each prompt scored in Strict Check, with a link to see that page. Call this to find the prompt for a page the user wants.',
      inputSchema: {
        theme: z.string().optional().describe('A theme\'s slug, for example "kiln". Leave it out to list the prompts of every theme.'),
      },
      annotations: READS_THE_SITE,
    },
    async ({ theme }) => {
      try {
        const catalog = await loadCatalog()
        return text(describePrompts(theme === undefined ? catalog.themes : [findTheme(catalog, theme)]))
      } catch (error) {
        return failure(error)
      }
    },
  )

  server.registerTool(
    'get_prompt',
    {
      title: 'One page prompt in full',
      description:
        "Returns one page prompt, word for word as strictthemes.com serves it: a complete brief for building one page with a Strict theme, about 10,000 tokens. It has the install step, the theme in short, the page's parts in order with their classes and sample content, the behavior, the rules and a checklist to go through at the end. Call it when the user asked for that page, then build the page from it and run Strict Check on the result.",
      inputSchema: {
        theme: z.string().describe('The theme\'s slug, for example "kiln".'),
        page: z.string().describe('The page\'s slug, as list_prompts gives it, for example "product".'),
      },
      annotations: READS_THE_SITE,
    },
    async ({ theme, page }) => {
      try {
        const base = catalogBase()
        const found = findTheme(await loadCatalog(base), theme)
        return text(await loadPromptText(found, findPrompt(found, page), base))
      } catch (error) {
        return failure(error)
      }
    },
  )
}
