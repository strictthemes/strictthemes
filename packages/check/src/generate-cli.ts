import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { lintSpec } from '@strictthemes/spec'
import { evaluatePage } from './evaluate.ts'
import { generateSpec } from './generate.ts'
import { measurePages } from './render.ts'
import { groupFindings, summarize } from './report.ts'
import { rulesFor } from './rules.ts'
import { CATEGORIES, mergeResults } from './types.ts'

const USAGE = `strict-check generate — measure a site and write a Strict spec (DESIGN.md) from what its pages use

Usage:
  strict-check generate <url> [options]

  url                The site, such as https://example.com or http://localhost:3000.
                     It is opened on this machine, in a headless browser.

Options:
  --path <path>      A page to measure, such as /pricing. Repeat for more. Default: the url's own path.
  --out <file>       Where to write the spec. Default: DESIGN.md
  --name <name>      The spec's name. Default: the site's host name.
  --browser <path>   A Chromium-based browser to use. Default: the Chrome on this machine.
  --force            Replace the file when it is there.

The spec is a starting point: its tokens are what the pages use, and its notes say what to rewrite.
Measure your own site, or one you may take the design of.
`

class UsageError extends Error {}

/** Runs `strict-check generate`. Returns the exit code: 0 when the spec was written. */
export async function generate(argv: string[]): Promise<number> {
  const values: Record<string, string[]> = {}
  const positional: string[] = []
  let force = false
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i] ?? ''
    if (['--path', '--out', '--name', '--browser'].includes(arg)) {
      const value = argv[++i]
      if (value === undefined) throw new UsageError(`${arg} needs a value.\n\n${USAGE}`)
      ;(values[arg] ??= []).push(value)
    } else if (arg === '--force') force = true
    else if (arg === '--help' || arg === '-h') {
      process.stdout.write(USAGE)
      return 0
    } else if (arg.startsWith('-')) throw new UsageError(`Unknown option ${arg}\n\n${USAGE}`)
    else positional.push(arg)
  }
  if (positional.length !== 1) throw new UsageError(`Give the address of one site.\n\n${USAGE}`)
  let url: URL
  try {
    url = new URL(/^https?:\/\//i.test(positional[0] as string) ? (positional[0] as string) : `https://${positional[0]}`)
  } catch {
    throw new UsageError(`"${positional[0]}" is not an address.`)
  }
  const out = resolve(values['--out']?.[0] ?? 'DESIGN.md')
  if (existsSync(out) && !force) throw new UsageError(`${out} is there already. Pass --force to replace it, or --out for another file.`)

  const paths = values['--path'] ?? [url.pathname + url.search]
  const browser = values['--browser']?.[0]
  process.stderr.write(`Measuring ${paths.map((path) => new URL(path, url).href).join(', ')}\n`)
  const measured = await measurePages(url.href, { paths, ...(browser !== undefined ? { browser } : {}) })
  const name = values['--name']?.[0] ?? url.hostname.replace(/^www\./, '')
  const { source, notes } = generateSpec(measured, { name, source: url.origin, date: new Date().toISOString().slice(0, 10) })

  const lint = lintSpec(source)
  const errors = lint.findings.filter((finding) => finding.severity === 'error')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, source)

  const lines: string[] = [`Wrote ${out}`, '']
  const spec = lint.spec
  const count = (group: unknown): number => (group && typeof group === 'object' ? Object.keys(group).length : 0)
  lines.push(
    `  colors      ${count(spec.colors)}${measured.some((page) => page.dark) && spec.strict?.modes ? ', with a dark mode' : ''}`,
    `  typography  ${count(spec.typography)} sizes`,
    `  spacing     ${count(spec.spacing)} steps`,
    `  corners     ${count(spec.rounded)}`,
    '',
  )
  if (errors.length > 0) {
    lines.push('The spec has errors, so Strict Check cannot use it yet:', ...errors.map((finding) => `  ${finding.message}`), '')
  } else {
    // How much of the measured pages the new spec covers: the same check, on the same measurements.
    const rules = rulesFor(spec)
    const results = measured.flatMap((page) => [
      evaluatePage(page.light, rules, { mode: 'light', width: 1280 }),
      ...(page.dark && rules.modes.includes('dark') ? [evaluatePage(page.dark, rules, { mode: 'dark', width: 1280 })] : []),
    ])
    const merged = mergeResults(results)
    const summary = summarize(results)
    lines.push(`Checked against the pages it was measured from: ${summary.score}% of ${summary.checked} measured values follow it.`)
    for (const category of CATEGORIES) {
      const { checked, failed } = merged.counts[category]
      if (failed > 0) lines.push(`  ${category.padEnd(11)} ${failed} of ${checked} off`)
    }
    const top = groupFindings(merged.findings).slice(0, 5)
    if (top.length > 0) lines.push('', 'The most common:', ...top.map((group) => `  ${group.count}× ${group.message}`))
    lines.push('')
  }
  if (notes.length > 0) lines.push('To settle by hand:', ...notes.map((note) => `  - ${note}`), '')
  lines.push('Next: read the spec and rewrite its notes, then run  strict-check --spec ' + (values['--out']?.[0] ?? 'DESIGN.md') + ' --url ' + url.origin)
  process.stdout.write(`${lines.join('\n')}\n`)
  return errors.length > 0 ? 1 : 0
}
