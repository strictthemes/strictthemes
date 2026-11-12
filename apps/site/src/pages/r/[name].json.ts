import type { APIRoute, GetStaticPaths } from "astro"
import { registry } from "@/lib/themes"

// The shadcn registry: /r/<theme>.json, /r/font-<family>-<role>.json and
// /r/registry.json, straight from @strictthemes/themes.
export const getStaticPaths: GetStaticPaths = () =>
  [...registry.files.keys()]
    .filter((path) => path.startsWith("r/"))
    .map((path) => ({
      params: { name: path.slice("r/".length, -".json".length) },
      props: { path },
    }))

export const GET: APIRoute = ({ props }) =>
  new Response(registry.files.get(props.path as string), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  })
