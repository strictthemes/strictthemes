import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

// Runs against the built site (`npm test` builds first).
const dist = join(import.meta.dirname, "..", "dist")
const read = (path: string) => readFileSync(join(dist, path), "utf8")
// Every theme, with its name and its five page prompts in reading order.
const PAGES: [slug: string, name: string, pages: string[]][] = [
  ["strict-one", "Strict One", ["landing", "pricing", "article", "docs", "dashboard"]],
  ["recital", "Recital", ["essay", "journal", "chapter", "newsletter", "about"]],
  ["avion", "Avion", ["dashboard", "status", "list", "detail", "settings"]],
  ["kiln", "Kiln", ["shop", "collection", "product", "basket", "studio"]],
  ["ledger", "Ledger", ["overview", "transactions", "invoice", "transfer", "report"]],
  ["cipher", "Cipher", ["landing", "docs", "releases", "deploys", "tokens"]],
  ["sorbet", "Sorbet", ["welcome", "today", "progress", "plans", "profile"]],
  ["atelier", "Atelier", ["home", "collection", "piece", "house", "appointment"]],
  ["civic", "Civic", ["start", "question", "review", "confirmation", "guidance"]],
  ["dispatch", "Dispatch", ["front", "story", "live", "scores", "section"]],
  ["tisane", "Tisane", ["home", "menu", "booking", "recipe", "visit"]],
  ["voltage", "Voltage", ["launch", "lineup", "tickets", "artist", "info"]],
  ["nocturne", "Nocturne", ["programme", "film", "season", "membership", "visit"]],
  ["counsel", "Counsel", ["firm", "practice", "profile", "insight", "enquiry"]],
  ["passage", "Passage", ["search", "results", "details", "ticket", "departures"]],
  ["ember", "Ember", ["game", "patch", "leaderboard", "store", "player"]],
  ["gauge", "Gauge", ["catalogue", "part", "compare", "quote", "downloads"]],
  ["confetti", "Confetti", ["invitation", "rsvp", "gifts", "day", "guestbook"]],
  ["tideline", "Tideline", ["home", "lessons", "forecast", "booking", "guide"]],
  ["relay", "Relay", ["home", "fixtures", "standings", "membership", "report"]],
  ["veranda", "Veranda", ["home", "rooms", "room", "reserve", "menu"]],
  ["solace", "Solace", ["home", "approach", "profile", "fees", "appointment"]],
  ["primer", "Primer", ["catalogue", "course", "lesson", "progress", "plans"]],
]
const THEMES = PAGES.map(([slug]) => slug)

test("every page is built", () => {
  for (const page of ["index.html", "themes/index.html", "spec/index.html", "404.html"]) {
    assert.ok(existsSync(join(dist, page)), page)
  }
  for (const theme of THEMES) {
    assert.ok(existsSync(join(dist, "themes", theme, "index.html")), theme)
  }
})

test("the registry is served with production URLs", () => {
  for (const theme of THEMES) {
    const item = JSON.parse(read(`r/${theme}.json`)) as {
      type: string
      registryDependencies: string[]
    }
    assert.equal(item.type, "registry:theme")
    assert.equal(item.registryDependencies.length, 3)
    for (const url of item.registryDependencies) {
      assert.ok(url.startsWith("https://strictthemes.com/r/font-"), url)
      // Every font a theme depends on is a file the site serves.
      assert.ok(existsSync(join(dist, "r", url.split("/").at(-1) ?? "")), url)
    }
  }
  const index = JSON.parse(read("r/registry.json")) as { items: { name: string; type: string }[] }
  // Each theme, three fonts for each (body, labels and headings), a block for each of its
  // five example pages, and the agent kit: four blocks and one item that holds them all.
  assert.equal(index.items.length, THEMES.length * (4 + 5 + 5))
  assert.equal(new Set(index.items.map((item) => item.name)).size, index.items.length)
})

test("every example page is a block, and every theme has the agent kit", () => {
  for (const [theme, , pages] of PAGES) {
    for (const page of pages) {
      const block = JSON.parse(read(`r/${theme}-${page}.json`)) as {
        type: string
        docs: string
        files: { target: string; content: string }[]
      }
      assert.equal(block.type, "registry:block")
      assert.equal(block.files[0]?.target, `components/${theme}-${page}/page.tsx`)
      // The page's own source, as the example holds it.
      assert.ok((block.files[0]?.content.length ?? 0) > 500, `${theme}-${page}`)
      const command = `npx shadcn@latest add https://strictthemes.com/r/${theme}.json https://strictthemes.com/r/${theme}-${page}.json`
      assert.ok(block.docs.includes(command), `${theme}-${page}`)
      // The preview page offers the same command.
      assert.ok(read(`themes/${theme}/prompts/${page}/index.html`).includes(command), `${theme}/${page}`)
    }
    const kit = JSON.parse(read(`r/${theme}-agent-kit.json`)) as { files: { target: string }[] }
    assert.deepEqual(
      kit.files.map((file) => file.target),
      ["tool-call", "approval", "stream", "citations"].map((name) => `components/agent/${name}.tsx`)
    )
    // The kit's page for the theme, and the demo it shows, built from those files.
    assert.ok(read(`kit/${theme}/index.html`).includes(`https://strictthemes.com/r/${theme}-agent-kit.json`), theme)
    assert.ok(existsSync(join(dist, "kit", theme, "build", "index.html")), theme)
    // The theme's skill, as a file and by its install command.
    const skill = read(`themes/${theme}/SKILL.md`)
    assert.match(skill, new RegExp(`^---\\nname: strict-theme-${theme}\\n`))
    assert.ok(read(`themes/${theme}/index.html`).includes(`npx skills add strictthemes/strictthemes --skill strict-theme-${theme}`), theme)
  }
  assert.ok(existsSync(join(dist, "kit", "index.html")))
})

test("a normal build does not tell search engines to stay away", () => {
  // Only a staging build (STRICT_NOINDEX=1) writes the no-index header file.
  assert.ok(!existsSync(join(dist, "_headers")))
})

test("the production server gets its settings file", () => {
  // Apache reads it on strictthemes.com: the 404 page and the types of .md and .ts.
  const settings = read(".htaccess")
  assert.ok(settings.includes("ErrorDocument 404 /404.html"))
  assert.match(settings, /^AddType text\/markdown \.md$/m)
  assert.match(settings, /^AddType text\/plain \.ts$/m)
  assert.match(settings, /^AddType application\/manifest\+json \.webmanifest$/m)
})

test("every page carries the mark, the icons and the share image", () => {
  const png = (path: string) => {
    const data = readFileSync(join(dist, path))
    assert.equal(data.subarray(1, 4).toString("latin1"), "PNG", path)
    return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) }
  }
  assert.deepEqual(png("apple-touch-icon.png"), { width: 180, height: 180 })
  assert.deepEqual(png("og.png"), { width: 1200, height: 630 })
  // An .ico file: type 1, and three sizes for a browser to choose from.
  const ico = readFileSync(join(dist, "favicon.ico"))
  assert.deepEqual([ico.readUInt16LE(2), ico.readUInt16LE(4)], [1, 3])

  // The manifest names files that exist, at the sizes it says.
  const manifest = JSON.parse(read("site.webmanifest")) as {
    icons: { src: string; sizes: string }[]
  }
  assert.equal(manifest.icons.length, 3)
  for (const icon of manifest.icons) {
    const { width, height } = png(icon.src.slice(1))
    assert.equal(`${width}x${height}`, icon.sizes, icon.src)
  }

  // The header and the favicon draw the same path.
  const mark = /d="(M8 6h16[^"]+)"/
  const path = mark.exec(read("favicon.svg"))?.[1]
  assert.ok(path)
  for (const page of ["index.html", "themes/kiln/index.html", "spec/index.html", "404.html"]) {
    const html = read(page)
    assert.equal(mark.exec(html)?.[1], path, page)
    for (const href of ["/favicon.ico", "/favicon.svg", "/apple-touch-icon.png", "/site.webmanifest"]) {
      assert.ok(html.includes(`href="${href}"`), `${page} ${href}`)
    }
    assert.ok(html.includes('<meta property="og:image" content="https://strictthemes.com/og.png"'), page)
    assert.ok(html.includes('<meta name="twitter:card" content="summary_large_image"'), page)
  }
})

test("the sitemap lists every page a search engine may show, and no other", () => {
  // Every built page that does not say "noindex", by the canonical address it gives itself.
  const pages = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory()
        ? pages(join(dir, entry.name))
        : entry.name === "index.html"
          ? [join(dir, entry.name)]
          : []
    )
  const canonical = pages(dist)
    .map((file) => readFileSync(file, "utf8"))
    .filter((html) => !html.includes('<meta name="robots" content="noindex">'))
    .map((html) => /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1] ?? "no canonical")
    .sort()
  const listed = [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  assert.deepEqual([...listed].sort(), canonical)
  // The home page, the catalog, the spec, the agent kit, and for each theme its page, its
  // five previews and the kit in it.
  assert.equal(listed.length, 4 + THEMES.length * 7)
  assert.equal(listed[0], "https://strictthemes.com/")
  assert.ok(!listed.some((url) => url.includes("/404") || url.endsWith("/build/")))

  const robots = read("robots.txt")
  assert.match(robots, /^User-agent: \*$/m)
  assert.match(robots, /^Sitemap: https:\/\/strictthemes\.com\/sitemap\.xml$/m)
  assert.ok(!robots.includes("Disallow"))
})

test("every theme's exports can be downloaded", () => {
  for (const theme of THEMES) {
    for (const file of ["DESIGN.md", "tailwind.css", "shadcn.css", "nuxt-ui.css", "app.config.ts", "tokens.json"]) {
      assert.ok(existsSync(join(dist, "themes", theme, file)), `${theme}/${file}`)
    }
  }
})

test("theme pages wear their theme and show the install command", () => {
  for (const theme of THEMES) {
    const html = read(`themes/${theme}/index.html`)
    assert.match(html, new RegExp(`<html[^>]*data-theme="${theme}"`))
    assert.ok(html.includes(`npx shadcn@latest add https://strictthemes.com/r/${theme}.json`))
  }
})

test("no page or file points at a local address", () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]
    )
  for (const file of walk(dist).filter((f) => /\.(html|json|txt|md)$/.test(f))) {
    assert.ok(!readFileSync(file, "utf8").includes("localhost"), file)
  }
})

test("every theme's page prompts are served and complete", () => {
  for (const [slug, name, pages] of PAGES) {
    for (const page of pages) {
      const prompt = read(`themes/${slug}/prompts/${page}.md`)
      assert.ok(prompt.startsWith("# Build a"), `${slug}/${page}: title`)
      assert.ok((prompt.split("\n")[0] ?? "").endsWith(`with the ${name} theme`), `${slug}/${page}: title`)
      for (const heading of ["## Before you start", "## The page", "## Rules", "## Check before you finish"]) {
        assert.ok(prompt.includes(heading), `${slug}/${page}: ${heading}`)
      }
      assert.ok(prompt.includes(`https://strictthemes.com/r/${slug}.json`), `${slug}/${page}`)
      // The theme page and the map for agents both link to it.
      assert.ok(read(`themes/${slug}/index.html`).includes(`/themes/${slug}/prompts/${page}.md`), `${slug}/${page}`)
      assert.ok(read("llms.txt").includes(`/themes/${slug}/prompts/${page}.md`), `${slug}/${page}`)
    }
  }
})

test("the home and themes pages show a card for every theme, in its own skin", () => {
  for (const page of ["index.html", "themes/index.html"]) {
    const html = read(page)
    for (const theme of THEMES) {
      assert.match(html, new RegExp(`<a href="/themes/${theme}"[^>]*data-theme="${theme}"`), `${page}: ${theme}`)
    }
  }
})

test("every page and llms.txt point to the project's code", () => {
  const repo = "https://github.com/strictthemes/strictthemes"
  for (const page of ["index.html", "themes/kiln/index.html", "spec/index.html", "404.html"]) {
    assert.match(read(page), new RegExp(`<footer[\\s\\S]*href="${repo}">Source on GitHub</a>`), page)
  }
  assert.ok(read("llms.txt").includes(`(${repo})`))
})

test("llms.txt lists every theme", () => {
  const text = read("llms.txt")
  for (const theme of THEMES) {
    assert.ok(text.includes(`https://strictthemes.com/r/${theme}.json`), theme)
  }
})

test("themes.json lists every theme and page prompt, and every address in it is a file the site serves", () => {
  const index = JSON.parse(read("themes.json")) as {
    version: number
    site: string
    themes: {
      slug: string
      name: string
      description: string
      fonts: { heading: string; body: string; mono: string }
      page: string
      spec: string
      install: { command: string; notes: string }
      exports: string[]
      prompts: {
        slug: string
        title: string
        description: string
        url: string
        example?: { preview: string; check: { score: number; errors: number; warnings: number } }
      }[]
    }[]
  }
  assert.equal(index.version, 1)
  assert.equal(index.site, "https://strictthemes.com")
  // The same themes and pages, in the same order, as the site shows.
  assert.deepEqual(
    index.themes.map((theme) => [theme.slug, theme.name, theme.prompts.map((prompt) => prompt.slug)]),
    PAGES
  )
  /** The file in dist behind an address on the site. */
  const served = (url: string) => {
    assert.ok(url.startsWith("https://strictthemes.com/"), url)
    const path = url.slice("https://strictthemes.com/".length)
    return join(dist, path.endsWith("/") ? `${path}index.html` : path)
  }
  for (const theme of index.themes) {
    assert.ok(theme.description.length > 20, theme.slug)
    for (const font of [theme.fonts.heading, theme.fonts.body, theme.fonts.mono]) {
      assert.match(font, /^[A-Z][A-Za-z0-9 ]+$/, `${theme.slug}: ${font}`)
    }
    assert.equal(theme.install.command, `npx shadcn@latest add https://strictthemes.com/r/${theme.slug}.json`)
    assert.match(theme.install.notes, /adds type classes/, theme.slug)
    assert.equal(theme.exports.length, 5, theme.slug)
    for (const url of [theme.page, theme.spec, ...theme.exports]) assert.ok(existsSync(served(url)), url)
    for (const prompt of theme.prompts) {
      assert.ok(existsSync(served(prompt.url)), prompt.url)
      assert.match(prompt.description, /\.$/, `${theme.slug}/${prompt.slug}`)
      // Every prompt has a built example, and the index says how it scored.
      assert.ok(prompt.example, `${theme.slug}/${prompt.slug}`)
      assert.ok(existsSync(served(prompt.example.preview)), prompt.example.preview)
      assert.equal(prompt.example.check.errors, 0, `${theme.slug}/${prompt.slug}`)
    }
  }
  assert.ok(read("llms.txt").includes("(https://strictthemes.com/themes.json)"))
})

// The example pages: what was built from each page prompt, kept in
// examples/<theme>/<page>/ and built into the site by scripts/build-examples.ts.
const examplesDir = join(import.meta.dirname, "..", "examples")
const examples = readdirSync(examplesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .flatMap((theme) =>
    readdirSync(join(examplesDir, theme.name), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((page) => ({ theme: theme.name, page: page.name }))
  )

test("no served file has a name that web servers commonly refuse", () => {
  // nginx on the production server answers 403 for any readme, changelog or
  // license file ending in .md or .txt, so a prompt called changelog.md could
  // not be read or copied.
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]
    )
  for (const file of walk(dist)) {
    assert.doesNotMatch(file, /(readme|changelog|license)\.(md|txt)$/i, file)
  }
})

test("every page prompt has an example page", () => {
  const prompts = THEMES.flatMap((theme) =>
    readdirSync(join(dist, "themes", theme, "prompts"))
      .filter((file) => file.endsWith(".md"))
      .map((file) => `${theme}/${file.replace(/\.md$/, "")}`)
  )
  assert.equal(prompts.length, PAGES.flatMap(([, , pages]) => pages).length)
  assert.deepEqual(examples.map(({ theme, page }) => `${theme}/${page}`).sort(), prompts.sort())
})

test("every example page is built, and kept out of search results", () => {
  assert.ok(examples.length > 0)
  for (const { theme, page } of examples) {
    const html = read(`themes/${theme}/prompts/${page}/build/index.html`)
    assert.match(html, /<meta name="robots" content="noindex">/, `${theme}/${page}`)
    // Addresses are relative, so the page works from the folder it is served in.
    assert.ok(!/(src|href)="\/(assets|src)\//.test(html), `${theme}/${page}`)
    assert.match(html, /src="\.\/assets\/[^"]+\.js"/, `${theme}/${page}`)
  }
})

test("every example has a preview page that says how it was made", () => {
  for (const { theme, page } of examples) {
    const facts = JSON.parse(
      readFileSync(join(examplesDir, theme, page, "example.json"), "utf8")
    ) as {
      date: string
      prompt: string
      check: { score: number; errors: number }
    }
    assert.match(facts.date, /^\d{4}-\d{2}-\d{2}$/, `${theme}/${page}`)
    // It names the text of the prompt it was built from, and the page says
    // whether that is still the prompt as served.
    assert.match(facts.prompt, /^[0-9a-f]{16}$/, `${theme}/${page}`)
    const served = createHash("sha256")
      .update(read(`themes/${theme}/prompts/${page}.md`))
      .digest("hex")
      .slice(0, 16)
    const preview = read(`themes/${theme}/prompts/${page}/index.html`)
    assert.ok(
      preview.includes(
        facts.prompt === served ? "The prompt as it is now" : "An earlier version of the prompt"
      ),
      `${theme}/${page}: which prompt it was built from`
    )
    // An example with errors in Strict Check is not one to show.
    assert.equal(facts.check.errors, 0, `${theme}/${page}`)

    const html = read(`themes/${theme}/prompts/${page}/index.html`)
    assert.ok(html.includes(`src="/themes/${theme}/prompts/${page}/build/"`), `${theme}/${page}: frame`)
    assert.ok(html.includes(`data-copy-url="/themes/${theme}/prompts/${page}.md"`), `${theme}/${page}: copy`)
    assert.ok(html.includes(`${facts.check.score}% of`), `${theme}/${page}: score`)
    // The theme page shows it next to its prompt.
    const themePage = read(`themes/${theme}/index.html`)
    assert.ok(themePage.includes(`href="/themes/${theme}/prompts/${page}/"`), `${theme}/${page}: link`)
    assert.ok(themePage.includes(`src="/themes/${theme}/prompts/${page}/build/"`), `${theme}/${page}: small view`)
  }
})

test("the site does not say who or what built the example pages", () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory()
        ? // The built examples themselves are the pages, not text about them.
          entry.name === "build" || entry.name === "_astro"
          ? []
          : walk(join(dir, entry.name))
        : [join(dir, entry.name)]
    )
  // A block in the registry holds an example page's own source, sample text included
  // ("a dictionary edited by hand"): like the built page, it is the page, not text about it.
  const blocks = new Set(PAGES.flatMap(([theme, , pages]) => pages.map((page) => join(dist, "r", `${theme}-${page}.json`))))
  const files = walk(dist).filter((file) => /\.(html|json|txt|xml)$/.test(file) && !blocks.has(file))
  assert.ok(files.length > 100)
  for (const file of files) {
    const text = readFileSync(file, "utf8")
    for (const phrase of [/Claude/, /\bOpus\b/, /Built by/i, /Edited by hand/i, /agent built from/i, /Run once in/i]) {
      assert.doesNotMatch(text, phrase, file)
    }
  }
  for (const { theme, page } of examples) {
    const facts = JSON.parse(readFileSync(join(examplesDir, theme, page, "example.json"), "utf8")) as Record<string, unknown>
    assert.deepEqual(Object.keys(facts).sort(), ["check", "date", "prompt"], `${theme}/${page}`)
  }
})

test("the home page shows a built page for each theme that has one", () => {
  const html = read("index.html")
  for (const theme of new Set(examples.map((example) => example.theme))) {
    assert.match(html, new RegExp(`src="/themes/${theme}/prompts/[a-z-]+/build/"`), theme)
  }
})

test("the site says nothing about the shop it used to be", () => {
  for (const page of ["index.html", "themes/index.html", "spec/index.html", "404.html", "llms.txt"]) {
    assert.doesNotMatch(read(page), /wordpress/i, page)
  }
})

test("links inside a page point at something on that page", () => {
  for (const page of ["index.html", "spec/index.html", ...THEMES.map((slug) => `themes/${slug}/index.html`)]) {
    const html = read(page)
    const targets = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1])
    assert.ok(targets.length > 0, `${page} has no links to its own sections`)
    for (const target of targets) {
      assert.ok(html.includes(` id="${target}"`), `${page}: nothing is named "${target}"`)
    }
  }
})

test("the home page and llms.txt say how to run Strict Check", () => {
  const command = "npx @strictthemes/check . --dist dist"
  assert.ok(read("index.html").includes(command))
  assert.ok(read("llms.txt").includes(command))
})

test("the home page and llms.txt give the address of the hosted MCP server", () => {
  const address = "https://mcp.strictthemes.com/mcp"
  assert.ok(read("index.html").includes(`<code data-command>${address}</code>`))
  assert.ok(read("llms.txt").includes(`(${address})`))
})

test("the header links to the code, and buttons that copy can be told apart", () => {
  const repo = "https://github.com/strictthemes/strictthemes"
  assert.match(read("index.html"), new RegExp(`<header[\\s\\S]*href="${repo}"[\\s\\S]*</header>`))
  const labels = [...read("themes/index.html").matchAll(/data-copy aria-label="([^"]+)"/g)].map((match) => match[1])
  assert.equal(labels.length, THEMES.length)
  assert.equal(new Set(labels).size, labels.length)
})
