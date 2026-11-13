import type { APIRoute } from "astro"
import { guides } from "@/lib/guides"

// The text of every guide, for the search field on /guides/. Fetched only when a reader searches.
const plain = (markdown: string): string =>
  markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^```.*$/gm, "")
    .replace(/[`*_#>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

export const GET: APIRoute = () =>
  new Response(JSON.stringify(guides.map((guide) => ({ slug: guide.slug, text: plain(guide.body) }))), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  })
