import type { APIRoute } from "astro"
import { fontRoles } from "@strictthemes/spec"
import { exampleFor, promptUrls, SITE_URL, themes } from "@/lib/themes"

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
          .filter((file) => file !== "DESIGN.md")
          .map((file) => `${SITE_URL}/themes/${theme.slug}/${file}`),
        prompts: theme.prompts.map((prompt) => {
          const urls = promptUrls(theme.slug, prompt.slug)
          const example = exampleFor(theme.slug, prompt.slug)
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
