import assert from 'node:assert/strict'
import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { join } from 'node:path'
import { after, before, test } from 'node:test'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { catalogBase, CatalogError, describePrompts, describeThemes, findPrompt, findTheme, loadCatalog } from '../src/catalog.ts'

const cli = join(import.meta.dirname, '..', 'src', 'cli.ts')

const DESIGN = '---\nname: Kiln\ncolors:\n  primary: "#B4532A"\n---\n\n## Overview\n\nClay paper and one terracotta accent.\n'
const PROMPT = '# Build a product page with the Kiln theme\n\nYou are building one page in an existing project.\n\n## Check before you finish\n\n- [ ] One terracotta button.\n'

// A copy of what strictthemes.com serves, small enough to read here. It has a field the server does not know.
const catalog = (site: string) => ({
  version: 1,
  site,
  addedLater: 'a reader ignores what it does not know',
  themes: [
    {
      slug: 'kiln',
      name: 'Kiln',
      description: 'A warm, hand-made theme for shops and studios.',
      fonts: { heading: 'Bricolage Grotesque', body: 'DM Sans', mono: 'DM Mono' },
      page: `${site}/themes/kiln/`,
      spec: `${site}/themes/kiln/DESIGN.md`,
      install: { command: `npx shadcn@latest add ${site}/r/kiln.json`, notes: 'Kiln adds type classes: text-display, text-h1.' },
      exports: [`${site}/themes/kiln/tailwind.css`, `${site}/themes/kiln/tokens.json`],
      prompts: [
        {
          slug: 'product',
          title: 'Product',
          description: 'the page of one piece in a small ceramics shop.',
          url: `${site}/themes/kiln/prompts/product.md`,
          example: {
            preview: `${site}/themes/kiln/prompts/product/`,
            date: '2026-11-11',
            check: { score: 100, values: 1837, errors: 0, warnings: 0 },
          },
        },
        { slug: 'basket', title: 'Basket', description: 'the basket of a small ceramics shop.', url: `${site}/themes/kiln/prompts/basket.md` },
      ],
    },
    {
      slug: 'avion',
      name: 'Avion',
      description: 'A calm, precise theme for dashboards and tools.',
      fonts: { heading: 'Red Hat Display', body: 'Red Hat Text', mono: 'Red Hat Mono' },
      install: { command: `npx shadcn@latest add ${site}/r/avion.json` },
      prompts: [],
    },
  ],
})

/** The text of a tool result. */
const textOf = (result: Record<string, unknown>): string =>
  (result.content as { type: string; text?: string }[]).map((part) => part.text ?? '').join('\n')

let site: Server
let base: string
let client: Client
const asked: string[] = []

/** A client of the real command, reading its themes from `url`. */
async function connect(url: string): Promise<Client> {
  const env = Object.fromEntries(Object.entries(process.env).filter((entry): entry is [string, string] => entry[1] !== undefined))
  const connected = new Client({ name: 'strict-check-test', version: '0.0.0' })
  await connected.connect(
    new StdioClientTransport({ command: process.execPath, args: [cli, 'mcp'], env: { ...env, STRICT_THEMES_URL: url }, stderr: 'pipe' }),
  )
  return connected
}

before(async () => {
  site = createServer((request, response) => {
    asked.push(request.url ?? '')
    const files: Record<string, [type: string, body: string]> = {
      '/themes.json': ['application/json', JSON.stringify(catalog(base))],
      '/themes/kiln/DESIGN.md': ['text/markdown', DESIGN],
      '/themes/kiln/prompts/product.md': ['text/markdown', PROMPT],
    }
    const file = files[request.url ?? '']
    response.writeHead(file ? 200 : 404, { 'Content-Type': file?.[0] ?? 'text/plain' })
    response.end(file?.[1] ?? 'Not found')
  })
  await new Promise<void>((resolve) => site.listen(0, '127.0.0.1', resolve))
  base = `http://127.0.0.1:${(site.address() as AddressInfo).port}`
  client = await connect(base)
})

after(async () => {
  await client.close()
  await new Promise((resolve) => site.close(resolve))
})

test('themes: list_themes names every theme, its fonts and its pages', async () => {
  const result = await client.callTool({ name: 'list_themes', arguments: {} })
  assert.notEqual(result.isError, true)
  assert.equal(result.structuredContent, undefined)
  const text = textOf(result)
  assert.match(text, /^Strict has 2 themes\./)
  assert.match(text, /^kiln: Kiln\. A warm, hand-made theme for shops and studios\.$/m)
  assert.match(text, /^ {2}Fonts: Bricolage Grotesque for headings, DM Sans for body text, DM Mono for labels and code\.$/m)
  assert.match(text, /^ {2}Page prompts: product, basket\.$/m)
  // A theme without page prompts has no such line.
  assert.match(text, /^avion: Avion\..*\n {2}Fonts: .*\n\nNext: get_theme/m)
  assert.equal(text, describeThemes(await loadCatalog(base)))
})

test('themes: get_theme returns the install steps and the whole DESIGN.md', async () => {
  const result = await client.callTool({ name: 'get_theme', arguments: { theme: 'kiln' } })
  assert.notEqual(result.isError, true)
  const text = textOf(result)
  assert.match(text, /^Kiln \(kiln\)\. A warm, hand-made theme/)
  assert.ok(text.includes(`Its page, with live previews: ${base}/themes/kiln/\n`))
  assert.ok(text.includes(`run \`npx shadcn@latest add ${base}/r/kiln.json\``))
  assert.match(text, /Save the DESIGN\.md below as `DESIGN\.md` in the project's root/)
  assert.ok(text.includes(`In a project without shadcn, use ${base}/themes/kiln/tailwind.css instead of step 1.`))
  assert.ok(text.includes(`Other exports: ${base}/themes/kiln/tokens.json.`))
  assert.match(text, /## After the install\n\nKiln adds type classes: text-display, text-h1\./)
  assert.match(text, /## Page prompts\n\nproduct \(Product\), basket \(Basket\)\. get_prompt returns one in full\./)
  // The spec is in the answer whole, so it can be saved as the file.
  assert.ok(text.endsWith(`## DESIGN.md\n\n${DESIGN}`))
})

test('themes: a theme is found by its name too, and a file the site lacks is an error', async () => {
  const result = await client.callTool({ name: 'get_theme', arguments: { theme: ' Avion ' } })
  // The name was understood: the address asked for is Avion's. Its DESIGN.md is not served here, and the tool says so.
  assert.equal(result.isError, true)
  assert.equal(textOf(result), `Could not read ${base}/themes/avion/DESIGN.md: the site answered 404.`)
})

test('themes: list_prompts describes the pages of one theme or of all', async () => {
  const one = await client.callTool({ name: 'list_prompts', arguments: { theme: 'kiln' } })
  assert.notEqual(one.isError, true)
  const text = textOf(one)
  assert.match(text, /^2 page prompts for Kiln\./)
  assert.ok(
    text.includes(
      `- product: Product. Builds the page of one piece in a small ceramics shop. The page built from it: Strict Check 100%, 0 errors. See it at ${base}/themes/kiln/prompts/product/`,
    ),
  )
  // A prompt that was never built says nothing about a build.
  assert.match(text, /^- basket: Basket\. Builds the basket of a small ceramics shop\.$/m)
  assert.doesNotMatch(text, /Avion/)

  const all = await client.callTool({ name: 'list_prompts', arguments: {} })
  assert.match(textOf(all), /^2 page prompts in 2 themes\./)
  assert.match(textOf(all), /## Avion \(avion\)\n\n- None yet\./)
  // The list of every theme's prompts is long, so it leaves out how each build scored.
  assert.match(textOf(all), /^- product: Product\. Builds the page of one piece in a small ceramics shop\.$/m)
  assert.match(textOf(all), /Next: list_prompts with one theme also says how the page built from each prompt scored\./)
  assert.equal(textOf(all), describePrompts((await loadCatalog(base)).themes))
})

test('themes: get_prompt returns the prompt word for word', async () => {
  const result = await client.callTool({ name: 'get_prompt', arguments: { theme: 'kiln', page: 'product' } })
  assert.notEqual(result.isError, true)
  assert.equal(result.structuredContent, undefined)
  assert.equal(textOf(result), PROMPT)
  // Found by its title as well.
  const byTitle = await client.callTool({ name: 'get_prompt', arguments: { theme: 'Kiln', page: 'Product' } })
  assert.equal(textOf(byTitle), PROMPT)
})

test('themes: an unknown theme or page is an error that lists what there is', async () => {
  const theme = await client.callTool({ name: 'get_theme', arguments: { theme: 'porcelain' } })
  assert.equal(theme.isError, true)
  assert.equal(textOf(theme), 'There is no theme "porcelain". The themes are: kiln, avion.')

  const page = await client.callTool({ name: 'get_prompt', arguments: { theme: 'kiln', page: 'checkout' } })
  assert.equal(page.isError, true)
  assert.equal(textOf(page), 'Kiln has no page prompt "checkout". Its page prompts are: product, basket.')

  const none = await client.callTool({ name: 'get_prompt', arguments: { theme: 'avion', page: 'dashboard' } })
  assert.equal(textOf(none), 'Avion has no page prompt "dashboard". Its page prompts are: none.')

  const listed = await client.callTool({ name: 'list_prompts', arguments: { theme: '../etc' } })
  assert.equal(listed.isError, true)
  assert.match(textOf(listed), /^There is no theme "\.\.\/etc"\./)
})

test('themes: the list of themes is read once and kept, and a name never becomes a path', async () => {
  // Every call above went through one server process, which read the list once. This file read it once too, to compare.
  assert.equal(asked.filter((url) => url === '/themes.json').length, 2)
  // Only files of themes and pages the list names were asked for.
  for (const url of asked) assert.match(url, /^\/themes\.json$|^\/themes\/(kiln|avion)\/(DESIGN\.md|prompts\/product\.md)$/, url)
})

test('themes: a site that cannot be reached is a tool error that says why', async () => {
  const offline = await connect('http://127.0.0.1:9')
  try {
    const result = await offline.callTool({ name: 'list_themes', arguments: {} })
    assert.equal(result.isError, true)
    assert.equal(
      textOf(result),
      'Could not read http://127.0.0.1:9/themes.json: no connection. The theme tools read the themes from 127.0.0.1:9 and need a connection to it.',
    )
    // The tools that work on the project's own files do not need the site.
    const { tools } = await offline.listTools()
    assert.equal(tools.length, 6)
  } finally {
    await offline.close()
  }
})

test('themes: the address comes from STRICT_THEMES_URL, or is strictthemes.com', () => {
  assert.equal(catalogBase({}), 'https://strictthemes.com')
  assert.equal(catalogBase({ STRICT_THEMES_URL: '  ' }), 'https://strictthemes.com')
  assert.equal(catalogBase({ STRICT_THEMES_URL: 'http://localhost:4321/' }), 'http://localhost:4321')
  assert.throws(() => catalogBase({ STRICT_THEMES_URL: 'file:///etc' }), CatalogError)
})

test('themes: a list this version cannot read says a newer version may be needed', async () => {
  const odd = createServer((_request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ version: 2, themes: [{ slug: 'Not A Slug' }] }))
  })
  await new Promise<void>((resolve) => odd.listen(0, '127.0.0.1', resolve))
  const url = `http://127.0.0.1:${(odd.address() as AddressInfo).port}`
  try {
    await assert.rejects(loadCatalog(url), (error: unknown) => {
      assert.ok(error instanceof CatalogError)
      assert.match(error.message, /is not a list of themes this version understands\. A newer @strictthemes\/check may be needed\.$/)
      return true
    })
  } finally {
    await new Promise((resolve) => odd.close(resolve))
  }
})

test('themes: finding a theme or a page ignores case and outer spaces', async () => {
  const loaded = await loadCatalog(base)
  assert.equal(findTheme(loaded, 'KILN').slug, 'kiln')
  assert.equal(findPrompt(findTheme(loaded, 'kiln'), ' Basket ').slug, 'basket')
})
