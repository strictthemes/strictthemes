import type { APIRoute, GetStaticPaths } from "astro"
import { guideMarkdown, guides, type Guide } from "@/lib/guides"

// Each guide as plain Markdown, for an agent or a reader who wants the text alone.
export const getStaticPaths: GetStaticPaths = () => guides.map((guide) => ({ params: { slug: guide.slug }, props: { guide } }))

export const GET: APIRoute = ({ props }) =>
  new Response(guideMarkdown((props as { guide: Guide }).guide), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
