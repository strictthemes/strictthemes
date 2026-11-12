import type { APIRoute, GetStaticPaths } from "astro"
import { registry } from "@/lib/themes"

const TYPES: Record<string, string> = {
  md: "text/markdown; charset=utf-8",
  css: "text/css; charset=utf-8",
  json: "application/json; charset=utf-8",
  ts: "text/plain; charset=utf-8",
}

// A theme's other exports: /themes/<slug>/DESIGN.md, tailwind.css, nuxt-ui.css…
export const getStaticPaths: GetStaticPaths = () =>
  [...registry.files.keys()]
    .filter((path) => path.startsWith("themes/") && path.split("/").length === 3)
    .map((path) => {
      const [, slug = "", file = ""] = path.split("/")
      return { params: { slug, file }, props: { path } }
    })

export const GET: APIRoute = ({ props, params }) =>
  new Response(registry.files.get(props.path as string), {
    headers: {
      "Content-Type":
        TYPES[(params.file ?? "").split(".").at(-1) ?? ""] ??
        "text/plain; charset=utf-8",
    },
  })
