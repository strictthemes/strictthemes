import { marked } from "marked"

/** One guide: a Markdown file in `apps/site/guides`, with a few facts on top. */
export interface Guide {
  slug: string
  title: string
  description: string
  /** What sort of guide it is: "How to", "Explained" or "Worked example". */
  kind: string
  /** The day it was first published, and the day its commands were last run, as YYYY-MM-DD. */
  date: string
  checked: string
  /** The tool and version its commands were run with, when it has commands. */
  tool?: string
  /** The Markdown under the facts. */
  body: string
}

const sources = import.meta.glob<string>("../../guides/*.md", { query: "?raw", import: "default", eager: true })

const REQUIRED = ["title", "description", "kind", "date", "checked"] as const

function parse(path: string, source: string): Guide {
  const slug = path.replace(/^.*\//, "").replace(/\.md$/, "")
  const match = /^---\n([\s\S]*?)\n---\n/.exec(source)
  if (!match) throw new Error(`guides/${slug}.md has no facts at its top.`)
  const facts: Record<string, string> = {}
  for (const line of (match[1] ?? "").split("\n")) {
    const at = line.indexOf(":")
    if (at === -1) continue
    facts[line.slice(0, at).trim()] = line.slice(at + 1).trim().replace(/^"(.*)"$/, "$1")
  }
  for (const key of REQUIRED) if (!facts[key]) throw new Error(`guides/${slug}.md does not say its ${key}.`)
  return {
    slug,
    title: facts.title as string,
    description: facts.description as string,
    kind: facts.kind as string,
    date: facts.date as string,
    checked: facts.checked as string,
    ...(facts.tool ? { tool: facts.tool } : {}),
    body: source.slice(match[0].length).trim(),
  }
}

/** Every guide, the newest first. */
export const guides: Guide[] = Object.entries(sources)
  .map(([path, source]) => parse(path, source))
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))

export const guideUrls = (slug: string) => ({ page: `/guides/${slug}/`, markdown: `/guides/${slug}.md` })

/** The guide as a Markdown file of its own: its title and description, then its text. */
export const guideMarkdown = (guide: Guide): string =>
  `# ${guide.title}\n\n${guide.description}\n\nLast checked ${guide.checked}${guide.tool ? ` with ${guide.tool}` : ""}.\n\n${guide.body}\n`

/** The guide's text as HTML, and its main headings for a list of contents. */
export function renderGuide(guide: Guide): { html: string; contents: { id: string; title: string }[] } {
  const contents: { id: string; title: string }[] = []
  const html = marked.parse(guide.body, { async: false }).replace(/<h2>(.*?)<\/h2>/g, (_, inner: string) => {
    const title = inner.replace(/<[^>]+>/g, "")
    const id = title
      .toLowerCase()
      .replace(/^\d+\.\s*/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    contents.push({ id, title: title.replace(/^\d+\.\s*/, "") })
    return `<h2 id="${id}">${inner}</h2>`
  })
  return { html, contents }
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

/** `2026-11-13` as `13 November 2026`. */
export const longDate = (date: string): string => {
  const [year, month, day] = date.split("-").map(Number)
  return `${day} ${MONTHS[(month ?? 1) - 1]} ${year}`
}
