// Makes the site's brand files in public/ from the mark in src/lib/brand.ts:
// the favicon (SVG and ICO), the icons a phone or a browser asks for, and the
// image shown when a page is shared. Run it by hand after the mark, the home
// page's headline or a theme's primary color changes: `npm run brand`.
//
// The files it writes are committed, so a normal build needs no browser.
import { readFileSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"

import { lintSpec } from "@strictthemes/spec"
import { chromium, type Browser } from "playwright-core"

import { BRAND, MARK_PATH, markSvg } from "../src/lib/brand.ts"

const site = resolve(import.meta.dirname, "..")
const root = resolve(site, "..", "..")
const out = join(site, "public")

/** The themes in the order the site shows them. */
const THEMES = [
  "strict-one", "recital", "avion", "kiln", "ledger", "cipher", "sorbet",
  "atelier", "civic", "dispatch", "tisane", "voltage", "nocturne",
]

const primaries = THEMES.map((slug) => {
  const source = readFileSync(join(root, "packages/themes/themes", slug, "DESIGN.md"), "utf8")
  const primary = lintSpec(source).spec.colors.primary
  if (!primary) throw new Error(`${slug} has no primary color`)
  return primary
})

/** A font file of the site's own theme, as a data address a page can load anywhere. */
const font = (path: string) =>
  `data:font/woff2;base64,${readFileSync(join(root, "node_modules", path)).toString("base64")}`

async function launch(): Promise<Browser> {
  let lastError: unknown
  for (const options of [{ channel: "chrome" }, { channel: "msedge" }, {}]) {
    try {
      return await chromium.launch({ headless: true, ...options })
    } catch (error) {
      lastError = error
    }
  }
  throw new Error(`No browser to draw the images with: install Google Chrome. (${String(lastError)})`)
}

const browser = await launch()
const page = await browser.newPage({ deviceScaleFactor: 1 })

/** Draws a page of the given size and returns it as a PNG. */
async function png(html: string, width: number, height: number): Promise<Buffer> {
  await page.setViewportSize({ width, height })
  await page.setContent(`<!doctype html><html><body style="margin:0">${html}</body></html>`)
  await page.evaluate(() => document.fonts.ready)
  return page.screenshot({ type: "png", clip: { x: 0, y: 0, width, height } })
}

const icon = (size: number, scale = 1) =>
  png(markSvg(scale).replace("<svg ", `<svg width="${size}" height="${size}" style="display:block" `), size, size)

/** An .ico file that holds PNG images, which every browser since IE 9 reads. */
function ico(images: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6 + images.length * 16)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  let offset = header.length
  images.forEach(({ size, data }, index) => {
    const entry = 6 + index * 16
    header.writeUInt8(size, entry)
    header.writeUInt8(size, entry + 1)
    header.writeUInt16LE(1, entry + 4)
    header.writeUInt16LE(32, entry + 6)
    header.writeUInt32LE(data.length, entry + 8)
    header.writeUInt32LE(offset, entry + 12)
    offset += data.length
  })
  return Buffer.concat([header, ...images.map((image) => image.data)])
}

// The share image: the home page's opening, on its column grid, with one
// square for each theme in that theme's primary color.
const share = `
<style>
  @font-face { font-family: Archivo; font-weight: 100 900; src: url(${font("@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2")}) format("woff2"); }
  @font-face { font-family: "IBM Plex Mono"; font-weight: 500; src: url(${font("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2")}) format("woff2"); }
  * { box-sizing: border-box; margin: 0; }
  .card { position: relative; width: 1200px; height: 630px; padding: 64px; background: #FFFFFF; color: ${BRAND.ink}; display: flex; flex-direction: column; overflow: hidden; }
  .columns { position: absolute; inset: 0 64px; display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; }
  .columns i { background: #F5F5F4; }
  .row { position: relative; display: flex; align-items: center; justify-content: space-between; }
  .name { display: flex; align-items: center; gap: 16px; }
  .name b { font: 700 40px/1 Archivo; letter-spacing: -0.02em; }
  .label { font: 500 16px/1.3 "IBM Plex Mono"; letter-spacing: 0.08em; text-transform: uppercase; color: #6B6B6B; }
  h1 { position: relative; margin-top: 16px; font: 700 80px/1.05 Archivo; letter-spacing: -0.02em; text-wrap: balance; }
  .grow { flex: 1; }
  .rule { position: relative; border-top: 2px solid ${BRAND.ink}; padding-top: 16px; }
  .swatches { display: flex; gap: 8px; }
  .swatches i { width: 32px; height: 32px; }
  .ink { color: ${BRAND.ink}; }
</style>
<div class="card">
  <div class="columns">${"<i></i>".repeat(12)}</div>
  <div class="row">
    <div class="name">
      <svg width="48" height="48" viewBox="0 0 32 32"><rect width="32" height="32" fill="${BRAND.blue}"/><path fill="${BRAND.onBlue}" d="${MARK_PATH}"/></svg>
      <b>Strict</b>
      <span class="label">Themes</span>
    </div>
    <span class="label">strictthemes.com</span>
  </div>
  <div class="grow"></div>
  <p class="label" style="position:relative">Themes and guardrails for AI-built UI</p>
  <h1>Give your coding agent a design system it has to follow.</h1>
  <div class="grow"></div>
  <div class="rule row">
    <span class="label"><span class="ink">01</span> / ${primaries.length} themes, free to use</span>
    <div class="swatches">${primaries.map((color) => `<i style="background:${color}"></i>`).join("")}</div>
  </div>
</div>`

const write = (name: string, data: string | Buffer) => {
  writeFileSync(join(out, name), data)
  console.log(`${name}  ${typeof data === "string" ? data.length : data.length} bytes`)
}

write("favicon.svg", markSvg())
write("favicon.ico", ico([
  { size: 16, data: await icon(16) },
  { size: 32, data: await icon(32) },
  { size: 48, data: await icon(48) },
]))
write("apple-touch-icon.png", await icon(180))
write("icon-192.png", await icon(192))
write("icon-512.png", await icon(512))
// A phone may crop this one to a circle: the rails keep to the middle.
write("icon-maskable-512.png", await icon(512, 0.75))
write("og.png", await png(share, 1200, 630))

await browser.close()
