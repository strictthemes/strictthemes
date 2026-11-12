// Builds the example pages in examples/<theme>/<page>/ into the built site, at
// dist/themes/<theme>/prompts/<page>/build/. Runs after `astro build`.
//
// An example is the page built from a theme's page prompt, kept as it came
// out: index.html, src/ and public/ of a Vite + shadcn
// project. Every example is built on its own, with its own copy of the stock
// components, using the packages this site already depends on.
import { existsSync, readdirSync } from "node:fs"
import { join, resolve } from "node:path"

import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { build, type Plugin } from "vite"

const site = resolve(import.meta.dirname, "..")
const examples = join(site, "examples")
const dist = join(site, "dist")

/** Example pages hold made-up companies: keep them out of search results. */
const noindex: Plugin = {
  name: "strict-example-noindex",
  transformIndexHtml: () => [
    { tag: "meta", attrs: { name: "robots", content: "noindex" }, injectTo: "head" },
  ],
}

const folders = (dir: string) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort()
    : []

if (!existsSync(join(dist, "index.html"))) {
  throw new Error("Build the site first: the examples are added to dist/.")
}

let count = 0
for (const theme of folders(examples)) {
  for (const page of folders(join(examples, theme))) {
    const root = join(examples, theme, page)
    if (!existsSync(join(root, "index.html"))) continue
    await build({
      root,
      configFile: false,
      // Relative addresses, so the page works from any folder.
      base: "./",
      logLevel: "warn",
      plugins: [react(), tailwindcss(), noindex],
      resolve: { alias: { "@": join(root, "src") } },
      build: {
        outDir: join(dist, "themes", theme, "prompts", page, "build"),
        emptyOutDir: true,
        // One example is a whole React app in one file, a little over the default limit.
        chunkSizeWarningLimit: 1000,
      },
    })
    count += 1
  }
}
console.log(`Built ${count} example page${count === 1 ? "" : "s"}.`)
