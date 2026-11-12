import type { APIRoute } from "astro"
import { exampleFor, kitUrls, promptUrls, SITE_URL, themes } from "@/lib/themes"

// The pages a search engine should know about, each at its canonical address:
// the home page, the catalog, the spec, every theme page and every preview of
// a page prompt. Left out: the built example pages (they say "noindex"
// themselves), the 404 page, and the files a tool fetches (.md, .css, .json).
export const GET: APIRoute = () => {
  const paths = [
    "/",
    "/themes/",
    "/spec/",
    "/kit/",
    ...themes.map((theme) => kitUrls(theme.slug).page),
    ...themes.flatMap((theme) => [
      `/themes/${theme.slug}/`,
      ...theme.prompts
        .filter((prompt) => exampleFor(theme.slug, prompt.slug))
        .map((prompt) => promptUrls(theme.slug, prompt.slug).preview),
    ]),
  ]
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`),
    "</urlset>",
    "",
  ]
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}
