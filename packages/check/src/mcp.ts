import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
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
import { describeRules } from './describe.ts'
import { formatText } from './report.ts'
import { CheckError, loadSpec, runCheck } from './run.ts'

export const SERVER_NAME = 'strict-check'
export const SERVER_VERSION = '0.4.0'
/** The server that is hosted for everyone: the theme tools alone, over HTTP. */
export const THEMES_SERVER_NAME = 'strict-themes'

const INSTRUCTIONS = `Strict Check tells you whether a project's UI follows its theme, the DESIGN.md in the project's root.
Call "rules" before you write or change UI, to see the colors, spacing, type sizes and corners the theme allows.
Call "check" after you change UI. Fix every error it lists and call it again until it passes. Build the project first and pass "dist" so the pages themselves are measured, not only the code.
Fix a finding by using a value the theme allows. Do not mark code strict-ignore to make a check pass: that marker is for content that shows another theme on purpose.
A project with no theme yet can take one of the Strict themes. "list_themes" names them, and "get_theme" returns one theme's DESIGN.md and how to install it. Each theme has page prompts: "list_prompts" says what each builds, and "get_prompt" returns the full brief for one page. Use a brief when the user asked for that page, and let what the user said about their own product replace its sample content.`

const THEMES_INSTRUCTIONS = `This server hands you the Strict themes and their page prompts, from strictthemes.com. They are free to use.
A Strict theme is one DESIGN.md file with a light and a dark mode that installs into a shadcn project. "list_themes" names the themes, and "get_theme" returns one theme's DESIGN.md and how to install it: save that file as DESIGN.md in the project's root.
Each theme has page prompts. "list_prompts" says what each builds, and "get_prompt" returns the full brief for one page. Use a brief when the user asked for that page, and let what the user said about their own product replace its sample content.
This server cannot see the user's project. To check a project against its theme, the user connects Strict Check on their own machine: npx -y @strictthemes/check mcp`

const failure = (error: unknown) => ({
  isError: true,
  content: [
    {
      type: 'text' as const,
      text:
        error instanceof CheckError || error instanceof CatalogError
          ? error.message
          : `Strict Check failed unexpectedly: ${error instanceof Error ? error.message : String(error)}`,
    },
  ],
})

const text = (value: string) => ({ content: [{ type: 'text' as const, text: value }] })

/** The theme tools read strictthemes.com and change nothing. */
const READS_THE_SITE = { readOnlyHint: true, openWorldHint: true }

/** The Strict Check MCP server: the check, the theme's rules and the Strict themes as tools an agent can call. */
export function createServer(): McpServer {
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION }, { instructions: INSTRUCTIONS })

  server.registerTool(
    'rules',
    {
      title: 'What the theme allows',
      description:
        "Lists what a project's theme allows: its colors in each mode, the spacing scale, corner radii, type sizes, font weights and families, the contrast level and the patterns it forbids. Read this before writing or changing UI so the first attempt is on the theme.",
      inputSchema: {
        dir: z.string().describe('Absolute path of the project. Its DESIGN.md is read from this folder.'),
        spec: z.string().optional().describe('Path of the spec, when it is not DESIGN.md in the project folder. Relative to dir, or absolute.'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ dir, spec }) => {
      try {
        const loaded = loadSpec(dir, spec)
        return { content: [{ type: 'text' as const, text: describeRules(loaded.spec, loaded.rules) }] }
      } catch (error) {
        return failure(error)
      }
    },
  )

  server.registerTool(
    'check',
    {
      title: 'Check UI against the theme',
      description:
        "Checks a project's UI against its theme (DESIGN.md) and returns a report as text: each value that is off the theme, where it is, and a last line that starts with Passed or Failed and gives the score. It always reads the source code for off-theme classes, hand-written colors, gradients and emoji. With `dist` or `url` it also opens the pages in a headless browser, in every color mode at 1280px and 375px, and measures colors, contrast, type, spacing, corners and sideways scroll. Run it after changing UI; fix the errors and run it again until it passes.",
      inputSchema: {
        dir: z.string().describe('Absolute path of the project to check.'),
        spec: z.string().optional().describe('Path of the spec, when it is not DESIGN.md in the project folder. Relative to dir, or absolute.'),
        dist: z
          .string()
          .optional()
          .describe('The folder with the built site, relative to dir, for example "dist". Build the project first. Use this or url, not both.'),
        url: z.string().optional().describe('The address of a site that is already running, for example "http://localhost:5173".'),
        paths: z.array(z.string()).optional().describe('Pages to open, for example ["/", "/pricing"]. Default: ["/"].'),
        modes: z.array(z.string()).optional().describe('Color modes to check, for example ["light"]. Default: every mode in the spec.'),
        widths: z.array(z.number()).optional().describe('Viewport widths in px. Default: [1280, 375].'),
        includeUi: z.boolean().optional().describe('Also read components/ui, the stock components, in the source check. Default: false.'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ dir, spec, dist, url, paths, modes, widths, includeUi }) => {
      try {
        const report = await runCheck({
          dir,
          ...(spec !== undefined ? { spec } : {}),
          ...(dist !== undefined ? { dist } : {}),
          ...(url !== undefined ? { url } : {}),
          ...(paths !== undefined ? { paths } : {}),
          ...(modes !== undefined ? { modes } : {}),
          ...(widths !== undefined ? { widths } : {}),
          ...(includeUi !== undefined ? { includeUi } : {}),
        })
        // Text only, on purpose. Claude Code hands the model a tool's structured content in place of its
        // text when both are present, so a summary object here would hide every finding from the agent.
        return { content: [{ type: 'text' as const, text: formatText(report) }] }
      } catch (error) {
        return failure(error)
      }
    },
  )

  registerThemeTools(server)
  return server
}

/** The hosted server: the four theme tools and nothing that reads a project. */
export function createThemesServer(): McpServer {
  const server = new McpServer({ name: THEMES_SERVER_NAME, version: SERVER_VERSION }, { instructions: THEMES_INSTRUCTIONS })
  registerThemeTools(server)
  return server
}

/** The tools that read the Strict themes and their page prompts from strictthemes.com. */
function registerThemeTools(server: McpServer): void {
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

/** Serves the tools over stdin and stdout until the client disconnects. */
export async function serve(): Promise<void> {
  await createServer().connect(new StdioServerTransport())
}
