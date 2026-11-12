import type { APIRoute } from "astro"
import { CHECK_DOCS_URL, NPM_URL, REPO_URL } from "@/lib/brand"
import { SITE_URL, themes } from "@/lib/themes"

// A plain-text map of the site for coding agents.
export const GET: APIRoute = () => {
  const lines = [
    "# Strict",
    "",
    "> Themes and guardrails for AI-built UI. A Strict theme is one DESIGN.md file: design tokens, prose guidance, and a `strict` block of rules. Each theme installs into a shadcn project with one command and also exports to Tailwind CSS v4, Nuxt UI and W3C design tokens.",
    "",
    "## Themes",
    "",
    ...themes.flatMap((theme) => [
      `- [${theme.name}](${SITE_URL}/themes/${theme.slug}/DESIGN.md): ${theme.description}`,
      `  - Install: \`${theme.installCommand}\``,
      `  - Other exports: ${theme.files
        .filter((file) => file !== "DESIGN.md")
        .map((file) => `[${file}](${SITE_URL}/themes/${theme.slug}/${file})`)
        .join(", ")}`,
      ...(theme.prompts.length > 0
        ? [
            `  - Page prompts: ${theme.prompts
              .map(
                (prompt) =>
                  `[${prompt.title}](${SITE_URL}/themes/${theme.slug}/prompts/${prompt.slug}.md)`
              )
              .join(", ")}`,
          ]
        : []),
    ]),
    "",
    "## Registry",
    "",
    `- [Registry index](${SITE_URL}/r/registry.json): every shadcn registry item (themes and fonts).`,
    `- [Themes index](${SITE_URL}/themes.json): every theme and its page prompts as JSON, with the install command and the address of each file.`,
    "",
    "## Docs",
    "",
    `- [The Strict spec format](${SITE_URL}/spec): DESIGN.md plus the \`strict\` block, lint rules and exports.`,
    "",
    "## Tools",
    "",
    `- [Strict Check](${CHECK_DOCS_URL}): checks a project's code and its built pages against its DESIGN.md, and lists every value that is off the theme. Run \`npx @strictthemes/check . --dist dist\` in a project with a DESIGN.md in its root. It also runs in CI and as an MCP server (\`npx -y @strictthemes/check mcp\`), which has tools for the check and for reading these themes and page prompts.`,
    `- [The spec linter](${NPM_URL.spec}): \`npx @strictthemes/spec lint DESIGN.md\` checks a spec, and \`export\` writes it out for Tailwind, shadcn, Nuxt UI or as design tokens.`,
    "",
    "## Source",
    "",
    `- [strictthemes/strictthemes on GitHub](${REPO_URL}): the spec parser, the themes, Strict Check and this site, under the MIT licence.`,
    "",
  ]
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
