import type { APIRoute, GetStaticPaths } from "astro"
import { registry } from "@/lib/themes"

// A theme's page prompts: /themes/<slug>/prompts/<page>.md, ready to paste into an agent.
export const getStaticPaths: GetStaticPaths = () =>
  registry.prompts.map((prompt) => ({
    params: { slug: prompt.theme, name: prompt.slug },
    props: { text: prompt.prompt },
  }))

export const GET: APIRoute = ({ props }) =>
  new Response(props.text as string, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
