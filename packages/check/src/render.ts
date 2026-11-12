import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer, type Server } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'
import type { Browser } from 'playwright-core'
import { collect } from './collect.ts'
import { evaluatePage } from './evaluate.ts'
import type { MeasuredPage } from './generate.ts'
import { BASE_MODE, type Rules } from './rules.ts'
import { mergeResults, STATES, type CheckResult, type State } from './types.ts'

export interface RenderOptions {
  /** Paths to check on the site, e.g. `/` and `/pricing`. Default: `/`. */
  paths?: string[]
  /** Color modes to check. Default: every mode the spec declares. */
  modes?: string[]
  /** Viewport widths in px. Default: 1280 and 375. */
  widths?: number[]
  /** Path to a Chromium-based browser. Default: the Chrome installed on this machine. */
  browser?: string
  /** Milliseconds to wait after the page loads, for fonts and client rendering. Default: 300. */
  settle?: number
  /** The states to also check interactive elements in. Default: hover and focus. An empty list checks none. */
  states?: State[]
}

/**
 * The elements each state is forced on. Hover: what can be clicked, and
 * anything a Tailwind `hover:` or `group-hover:` class styles. Focus: what the
 * Tab key reaches.
 */
const TARGETS: Record<State, string> = {
  hover:
    'a[href], button, summary, label, select, input, textarea, tr, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="option"], [role="switch"], [role="checkbox"], [role="radio"], [tabindex], [class*="hover:"], .group, [class*="group/"]',
  focus:
    'a[href], button, summary, select, input:not([type="hidden"]), textarea, [role="button"], [role="link"], [role="tab"], [role="switch"], [role="checkbox"], [role="radio"], [tabindex], [contenteditable="true"]',
}

/** The pseudo-classes forced for each state. A browser shows `:focus-visible` to someone using the keyboard. */
const PSEUDO: Record<State, string[]> = { hover: ['hover'], focus: ['focus', 'focus-visible'] }

/** No more elements than this are put in a state on one page. */
const MAX_TARGETS = 1500

const NO_MOTION = '*, *::before, *::after { transition: none !important; }'

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
}

/**
 * Serves a built site from `dir` on a free local port. A path with no file
 * falls back to `index.html`, so single-page apps work.
 */
export function serveStatic(dir: string): Promise<{ url: string; close: () => Promise<void> }> {
  const root = resolve(dir)
  const fileFor = (pathname: string): string | null => {
    const path = normalize(join(root, decodeURIComponent(pathname)))
    if (path !== root && !path.startsWith(root + sep)) return null
    const candidates = [path, join(path, 'index.html'), `${path}.html`, join(root, 'index.html')]
    return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile()) ?? null
  }
  const server: Server = createServer((request, response) => {
    const file = fileFor(new URL(request.url ?? '/', 'http://localhost').pathname)
    if (!file) {
      response.writeHead(404).end('Not found')
      return
    }
    response.writeHead(200, { 'content-type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream' })
    createReadStream(file).pipe(response)
  })
  return new Promise((done, fail) => {
    server.once('error', fail)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      const port = typeof address === 'object' && address ? address.port : 0
      done({
        url: `http://127.0.0.1:${port}`,
        close: () => new Promise<void>((closed) => server.close(() => closed())),
      })
    })
  })
}

/** Where a Linux system's own package puts Chromium, as on a CI image after `apt-get install chromium`. */
const SYSTEM_CHROMIUM = ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/snap/bin/chromium']

/** Starts a headless Chromium: the given one, the machine's Chrome or Edge, its Chromium, or one Playwright installed. */
async function launch(executablePath?: string): Promise<Browser> {
  const { chromium } = await import('playwright-core')
  const system = SYSTEM_CHROMIUM.filter((path) => existsSync(path)).map((path) => ({ executablePath: path }))
  const attempts = executablePath
    ? [{ executablePath }]
    : [{ channel: 'chrome' }, { channel: 'msedge' }, ...system, {}]
  let lastError: unknown
  for (const options of attempts) {
    try {
      return await chromium.launch({ headless: true, ...options })
    } catch (error) {
      lastError = error
    }
  }
  const reason = lastError instanceof Error ? (lastError.message.split('\n')[0] ?? '') : String(lastError)
  throw new Error(
    `No browser to render the page with. Install Google Chrome or Chromium, or pass --browser <path to a Chromium-based browser>. (${reason})`,
  )
}

/**
 * Opens each path of a running site in a headless browser, in every color
 * mode and at every width, and checks what it measures against the rules.
 *
 * A mode other than the base one is switched on the way shadcn and the
 * Tailwind export expect: the mode's name as a class on `<html>`, with the
 * browser's own color scheme set to match.
 */
export async function checkRendered(baseUrl: string, rules: Rules, options: RenderOptions = {}): Promise<CheckResult> {
  const paths = options.paths?.length ? options.paths : ['/']
  const modes = options.modes?.length ? options.modes : rules.modes
  const widths = options.widths?.length ? options.widths : [1280, 375]
  const states = options.states ?? STATES
  const browser = await launch(options.browser)
  const results: CheckResult[] = []
  try {
    for (const mode of modes) {
      const context = await browser.newContext({ colorScheme: mode === 'dark' ? 'dark' : 'light' })
      const page = await context.newPage()
      for (const path of paths) {
        for (const width of widths) {
          await page.setViewportSize({ width, height: 900 })
          const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load' })
          if (!response || !response.ok()) {
            throw new Error(`${new URL(path, baseUrl).href} answered ${response ? response.status() : 'nothing'}.`)
          }
          // Color transitions are cut for the whole check. Switching the mode starts one on every
          // element that has a transition, and a color read mid-fade is neither mode's.
          await page.addStyleTag({ content: NO_MOTION })
          await page.evaluate(
            ({ modes: all, mode: current, base }) => {
              for (const name of all) if (name !== base) document.documentElement.classList.toggle(name, name === current)
            },
            { modes: rules.modes, mode, base: BASE_MODE },
          )
          await page.evaluate(() => document.fonts.ready.then(() => undefined))
          await page.waitForTimeout(options.settle ?? 300)
          const where = { mode, width, ...(paths.length > 1 ? { path } : {}) }
          const data = await page.evaluate(collect, { remember: states.length > 0 })
          const result = evaluatePage(data, rules, where)
          // The same marked elements are on the page in every mode and width: count them once.
          results.push(mode === modes[0] && width === widths[0] ? result : { ...result, ignored: 0 })
          // A page that did not switch to this mode was reported once; its states would repeat that.
          if (states.length === 0 || result.findings.some((finding) => finding.rule === 'mode-not-applied')) continue

          // States are forced through the browser's own debugging protocol, as its inspector does,
          // so nothing moves or scrolls.
          const session = await context.newCDPSession(page)
          try {
            await session.send('DOM.enable')
            await session.send('CSS.enable')
            const { root } = await session.send('DOM.getDocument', { depth: 0 })
            for (const state of states) {
              const { nodeIds } = await session.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: TARGETS[state] })
              const targets = nodeIds.slice(0, MAX_TARGETS)
              for (const nodeId of targets) await session.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: PSEUDO[state] })
              const changed = await page.evaluate(collect, { state: { name: state, targets: TARGETS[state] } })
              results.push(evaluatePage(changed, rules, { ...where, state }))
              for (const nodeId of targets) await session.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] })
            }
          } finally {
            await session.detach().catch(() => undefined)
          }
        }
      }
      await context.close()
    }
  } finally {
    await browser.close()
  }
  return { ...mergeResults(results), scope: { paths, modes, widths, ...(states.length > 0 ? { states } : {}) } }
}

export interface MeasureOptions {
  /** Pages to measure on the site. Default: `/`. */
  paths?: string[]
  /** Path to a Chromium-based browser. Default: the Chrome installed on this machine. */
  browser?: string
  /** Milliseconds to wait after the page loads. Default: 800, as a site that is not yours may render late. */
  settle?: number
}

/**
 * Opens each page of a running site at 1280px and measures it, as it loads
 * and with dark mode asked for: the browser's color scheme set to dark, and
 * when that changes nothing, the class `dark` on `<html>` too. The dark
 * measurement is kept only when the page's own color then differs.
 */
export async function measurePages(baseUrl: string, options: MeasureOptions = {}): Promise<MeasuredPage[]> {
  const paths = options.paths?.length ? options.paths : ['/']
  const browser = await launch(options.browser)
  const measured: MeasuredPage[] = []
  try {
    for (const path of paths) {
      const href = new URL(path, baseUrl).href
      const open = async (scheme: 'light' | 'dark', withClass: boolean) => {
        const context = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 900 } })
        try {
          const page = await context.newPage()
          const response = await page.goto(href, { waitUntil: 'load', timeout: 45000 })
          if (!response || !response.ok()) throw new Error(`${href} answered ${response ? response.status() : 'nothing'}.`)
          await page.addStyleTag({ content: NO_MOTION }).catch(() => undefined)
          if (withClass) await page.evaluate(() => document.documentElement.classList.add('dark'))
          await page.evaluate(() => document.fonts.ready.then(() => undefined))
          await page.waitForTimeout(options.settle ?? 800)
          return await page.evaluate(collect, {})
        } finally {
          await context.close()
        }
      }
      const light = await open('light', false)
      const differs = (data: typeof light): boolean => data.canvas.some((channel, index) => channel !== light.canvas[index])
      let dark = await open('dark', false)
      if (!differs(dark)) dark = await open('dark', true)
      measured.push({ path: href, light, ...(differs(dark) ? { dark } : {}) })
    }
  } finally {
    await browser.close()
  }
  return measured
}
