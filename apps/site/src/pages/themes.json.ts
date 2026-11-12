import type { APIRoute } from "astro"
import { fontRoles } from "@strictthemes/spec"
import { blockCommand, exampleFor, kitUrls, promptUrls, SITE_URL, themes } from "@/lib/themes"

/** The family a role names, without its fallbacks or quotation marks. */
const family = (stack: string | undefined): string | undefined =>
  stack ? (stack.split(",")[0] ?? "").trim().replace(/^["']|["']$/g, "") : undefined

// Every theme and its page prompts in one file, for tools. The MCP server of
// Strict Check reads it: its tools list_themes, get_theme, list_prompts and
// get_prompt answer from here. Add fields freely; a reader ignores what it does
// not know. Renaming or removing one breaks every installed copy of the server.
export const GET: APIRoute = () => {
  const body = {
    version: 1,
    site: SITE_URL,
    themes: themes.map((theme) => {
      const roles = fontRoles(theme.spec.typography)
      return {
        slug: theme.slug,
        name: theme.name,
        description: theme.description,
        fonts: {
          heading: family(roles.heading ?? roles.sans),
          body: family(roles.sans),
          mono: family(roles.mono),
        },
        page: `${SITE_URL}/themes/${theme.slug}/`,
        spec: `${SITE_URL}/themes/${theme.slug}/DESIGN.md`,
        install: {
          command: theme.installCommand,
          // What the shadcn CLI prints after the install.
          notes: theme.item.docs ?? "",
        },
        exports: theme.files
          .filter((file) => file !== "DESIGN.md" && file !== "SKILL.md")
          .map((file) => `${SITE_URL}/themes/${theme.slug}/${file}`),
        // How an agent builds any UI in the theme, as a skill file.
        skill: {
          name: theme.skill.name,
          url: `${SITE_URL}${theme.skill.file}`,
          install: theme.skill.command,
        },
        // Blocks for agent interfaces, written out for this theme.
        kit: {
          page: `${SITE_URL}${kitUrls(theme.slug).page}`,
          install: theme.kit.command,
          blocks: theme.kit.blocks.map((block) => ({
            name: block.name,
            title: block.title,
            description: block.description,
            install: block.command,
          })),
        },
        prompts: theme.prompts.map((prompt) => {
          const urls = promptUrls(theme.slug, prompt.slug)
          const example = exampleFor(theme.slug, prompt.slug)
          const block = blockCommand(theme.slug, prompt.slug)
          return {
            slug: prompt.slug,
            title: prompt.title,
            description: prompt.description,
            url: `${SITE_URL}${urls.prompt}`,
            ...(example
              ? {
                  example: {
                    preview: `${SITE_URL}${urls.preview}`,
                    date: example.date,
                    check: example.check,
                    // The command that installs the example page itself, with its theme.
                    ...(block ? { install: block } : {}),
                  },
                }
              : {}),
          }
        }),
      }
    }),
  }
  return new Response(JSON.stringify(body, null, 2) + "\n", {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  })
}
