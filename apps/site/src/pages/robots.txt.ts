import type { APIRoute } from "astro"
import { SITE_URL } from "@/lib/themes"

// Every crawler may read everything, and here is the map. Nothing is
// disallowed on purpose: a page that should stay out of search results says
// "noindex" itself, and a crawler has to be allowed to fetch it to read that.
export const GET: APIRoute = () =>
  new Response(["User-agent: *", "Allow: /", "", `Sitemap: ${SITE_URL}/sitemap.xml`, ""].join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
