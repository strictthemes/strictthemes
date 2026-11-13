import { guides, guideUrls } from "@/lib/guides"
import type { APIRoute } from "astro"
import { CHECK_DOCS_URL, MCP_URL, NPM_URL, REPO_URL } from "@/lib/brand"
import { kitBlocks, SITE_URL, themes } from "@/lib/themes"

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
      `  - Skill: [${theme.skill.name}](${SITE_URL}${theme.skill.file}), how to build any page in the theme. Add it with \`${theme.skill.command}\``,
      `  - Other exports: ${theme.files
        .filter((file) => file !== "DESIGN.md" && file !== "SKILL.md")
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
    `- [Registry index](${SITE_URL}/r/registry.json): every shadcn registry item: the themes, their fonts, each example page as a block (\`<theme>-<page>\`), and the agent kit for each theme (\`<theme>-agent-kit\`).`,
    `- A block or a kit item needs its theme. Install both with one command, the theme first: \`npx shadcn@latest add ${SITE_URL}/r/<theme>.json ${SITE_URL}/r/<theme>-<page>.json\`.`,
    `- [Themes index](${SITE_URL}/themes.json): every theme and its page prompts as JSON, with the install command and the address of each file.`,
    "",
    "## Agent kit",
    "",
    `- [Agent kit](${SITE_URL}/kit/): React blocks for an agent's side of a conversation (${kitBlocks.map((block) => block.title.toLowerCase()).join(", ")}), written out for each theme in its spacing, type and colors. For a theme: \`npx shadcn@latest add ${SITE_URL}/r/<theme>.json ${SITE_URL}/r/<theme>-agent-kit.json\`.`,
    "",
    "## Docs",
    "",
    `- [The Strict spec format](${SITE_URL}/spec): DESIGN.md plus the \`strict\` block, lint rules and exports.`,
    "",
    "## Guides",
    "",
    ...guides.map((guide) => `- [${guide.title}](${SITE_URL}${guideUrls(guide.slug).markdown}): ${guide.description}`),
    "",
    "## Tools",
    "",
    `- [MCP server for the themes](${MCP_URL}): connect an MCP client to this address (Streamable HTTP, no key) to list the themes, get a theme's DESIGN.md and install command, and fetch a page prompt. Its tools are \`list_themes\`, \`get_theme\`, \`list_prompts\` and \`get_prompt\`.`,
    `- [Strict Check](${CHECK_DOCS_URL}): checks a project's code and its built pages against its DESIGN.md, and lists every value that is off the theme. Run \`npx @strictthemes/check . --dist dist\` in a project with a DESIGN.md in its root. It also runs in CI and as an MCP server (\`npx -y @strictthemes/check mcp\`), which has tools for the check and for reading these themes and page prompts. For a site that has no DESIGN.md, \`npx @strictthemes/check generate <url>\` measures its pages locally and writes one.`,
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
