// @ts-check

import { writeFileSync } from "node:fs"

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"

/**
 * For a staging build (STRICT_NOINDEX=1): a Netlify `_headers` file that tells
 * search engines to keep every file out of their index, so the staging copy
 * never competes with the real site. A normal build writes no such file.
 * @type {import("astro").AstroIntegration}
 */
const noindex = {
  name: "strict-noindex",
  hooks: {
    "astro:build:done": ({ dir }) => {
      writeFileSync(new URL("_headers", dir), "/*\n  X-Robots-Tag: noindex, nofollow\n")
    },
  },
}

// The registry's install URLs are built from `site`. Set STRICT_SITE_URL to try
// the registry from a local server, e.g. STRICT_SITE_URL=http://localhost:4321.
export default defineConfig({
  site: process.env.STRICT_SITE_URL ?? "https://strictthemes.com",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), ...(process.env.STRICT_NOINDEX === "1" ? [noindex] : [])],
})
