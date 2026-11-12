// Builds the agent kit's demo page once for every theme, into the built site
// at dist/kit/<theme>/build/. Runs after `astro build`.
//
// Each demo is a small Vite project written to .kit/<theme>/: the kit's four
// blocks as the registry serves them for that theme, the demo page from
// packages/kit/demo, and the stylesheet of a project that installed the theme
// (the one the theme's first example page has). So what the site shows, and
// what `npm run strict-check:kit` measures, is the code a project gets.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"

import { KIT_FOLDER, kitSourceFor, loadKit, loadThemes } from "@strictthemes/themes"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { build, type Plugin } from "vite"

/** The demo holds a made-up shop, and the kit's own page is the one to find: keep it out of search results. */
const noindex: Plugin = {
  name: "strict-kit-noindex",
  transformIndexHtml: () => [
    { tag: "meta", attrs: { name: "robots", content: "noindex" }, injectTo: "head" },
  ],
}

const site = resolve(import.meta.dirname, "..")
const repo = resolve(site, "..", "..")
const dist = join(site, "dist")
const work = join(site, ".kit")
const demo = join(repo, "packages", "kit", "demo")

if (!existsSync(join(dist, "index.html"))) {
  throw new Error("Build the site first: the kit demos are added to dist/.")
}

const blocks = loadKit(join(repo, "packages", "kit"))
const themes = loadThemes(join(repo, "packages", "themes", "themes"))
rmSync(work, { recursive: true, force: true })

let count = 0
for (const theme of themes) {
  const examples = join(site, "examples", theme.slug)
  const page = existsSync(examples) ? readdirSync(examples).sort()[0] : undefined
  const css = page ? join(examples, page, "src", "index.css") : ""
  if (!existsSync(css)) throw new Error(`${theme.slug} has no example page to take its stylesheet from.`)

  const root = join(work, theme.slug)
  mkdirSync(join(root, "src", KIT_FOLDER), { recursive: true })
  const write = (path: string, source: string) => writeFileSync(join(root, path), kitSourceFor(source, theme.spec))
  write("index.html", readFileSync(join(demo, "index.html"), "utf8"))
  write("src/main.tsx", readFileSync(join(demo, "main.tsx"), "utf8"))
  write("src/demo.tsx", readFileSync(join(demo, "demo.tsx"), "utf8"))
  cpSync(css, join(root, "src", "index.css"))
  // What makes it a shadcn project to Strict Check, which then reads the corner classes by shadcn's names.
  cpSync(join(examples, page as string, "components.json"), join(root, "components.json"))
  writeFileSync(join(root, "DESIGN.md"), theme.source)
  for (const block of blocks) write(`src/${KIT_FOLDER}/${block.file}`, block.source)

  await build({
    root,
    configFile: false,
    // Relative addresses, so the page works from any folder.
    base: "./",
    logLevel: "warn",
    plugins: [react(), tailwindcss(), noindex],
    resolve: { alias: { "@": join(root, "src") } },
    build: { outDir: join(dist, "kit", theme.slug, "build"), emptyOutDir: true },
  })
  count += 1
}

console.log(`Built the agent kit in ${count} themes.`)
