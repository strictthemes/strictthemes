#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { describeRules } from './describe.ts'
import { formatJson, formatText, summarize } from './report.ts'
import { CheckError, loadSpec, runCheck } from './run.ts'
import type { CheckResult } from './types.ts'

const USAGE = `strict-check — check a project's UI against its Strict design spec (DESIGN.md)

Usage:
  strict-check [dir] [options]   Check a project.
  strict-check generate <url>    Measure a site and write a DESIGN.md from what its pages use.
                                 --path <path> for each page (default /), --out <file> (default DESIGN.md),
                                 --name <name>, --skill to also write a skill for agents, --browser <path>,
                                 --force to replace a file that is there.
  strict-check mcp               Serve the check and the Strict themes as an MCP server over stdio, for coding agents.
  strict-check mcp --http        Serve the Strict themes alone as an MCP server over HTTP, to host for others.
                                 --port <n> (default 8787) and --host <address> (default 127.0.0.1).
                                 The MCP address is /mcp on that port.

  dir                The project to check. Default: the current directory.

Options:
  --spec <file>      The spec to check against. Default: <dir>/DESIGN.md
  --dist <dir>       Also check the built site in this folder (for example dist), in a headless browser.
  --url <url>        Also check a site that is already running (for example http://localhost:5173).
  --path <path>      A page to open, such as /pricing. Repeat for more. Default: /
  --mode <name>      A color mode to check. Repeat for more. Default: every mode in the spec.
  --width <px>       A viewport width. Repeat for more. Default: 1280 and 375.
  --browser <path>   A Chromium-based browser to use. Default: the Chrome on this machine.
  --no-states        Check the pages as they load only, and not what changes on hover and on focus.
  --include-ui       Also read components/ui, the stock components, in the source check.
  --exclude <path>   A folder or file to leave out of the source check, relative to dir. Repeat for more.
  --no-source        Skip the source check.
  --rules            Print what the theme allows, and check nothing.
  --json             Print the report as JSON.
  --report <file>    Also write the report to a file, for a CI job to keep. A name ending
                     in .json gets the JSON report, any other the text. Repeat for more.

Leave something out of the check:
  in code       a comment: strict-ignore (this line), strict-ignore-next-line, strict-ignore-file
  on a page     the attribute data-strict-ignore on an element; everything inside it is skipped

Exit code: 0 when there are no errors, 1 when there are, 2 when the check could not run.
`

function fail(message: string): never {
  process.stderr.write(`${message}\n`)
  process.exit(2)
}

const VALUE_OPTIONS = new Set(['--spec', '--dist', '--url', '--path', '--mode', '--width', '--browser', '--exclude', '--report'])
const FLAGS = new Set(['--include-ui', '--no-source', '--no-states', '--rules', '--json', '--help', '-h'])

async function main(argv: string[]): Promise<number> {
  const values: Record<string, string[]> = {}
  const flags = new Set<string>()
  const positional: string[] = []
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i] ?? ''
    if (VALUE_OPTIONS.has(arg)) {
      const value = argv[++i]
      if (value === undefined) fail(`${arg} needs a value.\n\n${USAGE}`)
      ;(values[arg] ??= []).push(value)
    } else if (FLAGS.has(arg)) flags.add(arg)
    else if (arg.startsWith('-')) fail(`Unknown option ${arg}\n\n${USAGE}`)
    else positional.push(arg)
  }
  if (flags.has('--help') || flags.has('-h')) {
    process.stdout.write(USAGE)
    return 0
  }
  if (positional.length > 1) fail(`Give one project folder, not ${positional.length}.\n\n${USAGE}`)

  const dir = positional[0] ?? '.'
  // On the command line a relative --spec is relative to where the command runs, not to the project.
  const spec = values['--spec']?.[0] !== undefined ? resolve(values['--spec'][0]) : undefined
  const dist = values['--dist']?.[0]
  const url = values['--url']?.[0]
  const browser = values['--browser']?.[0]
  try {
    if (flags.has('--rules')) {
      const loaded = loadSpec(dir, spec)
      process.stdout.write(describeRules(loaded.spec, loaded.rules))
      return 0
    }
    const report = await runCheck({
      dir,
      ...(spec !== undefined ? { spec } : {}),
      ...(dist !== undefined ? { dist } : {}),
      ...(url !== undefined ? { url } : {}),
      ...(browser !== undefined ? { browser } : {}),
      paths: values['--path'] ?? [],
      modes: values['--mode'] ?? [],
      widths: (values['--width'] ?? []).map(Number),
      includeUi: flags.has('--include-ui'),
      exclude: values['--exclude'] ?? [],
      source: !flags.has('--no-source'),
      ...(flags.has('--no-states') ? { states: [] } : {}),
    })
    process.stdout.write(flags.has('--json') ? formatJson(report) : formatText(report))
    // Written whether the check passes or fails: a failed job is the one whose report gets read.
    for (const file of values['--report'] ?? []) {
      const path = resolve(file)
      mkdirSync(dirname(path), { recursive: true })
      writeFileSync(path, path.toLowerCase().endsWith('.json') ? formatJson(report) : formatText(report))
    }
    const results = [report.source, report.rendered].filter((result): result is CheckResult => result !== undefined)
    return summarize(results).ok ? 0 : 1
  } catch (error) {
    if (error instanceof CheckError) fail(error.message)
    throw error
  }
}

if (process.argv[2] === 'generate') {
  const { generate } = await import('./generate-cli.ts')
  generate(process.argv.slice(3)).then(
    (code) => process.exit(code),
    (error: unknown) => fail(error instanceof Error ? error.message : String(error)),
  )
} else if (process.argv[2] === 'mcp' && process.argv.includes('--http')) {
  const option = (name: string): string | undefined => {
    const at = process.argv.indexOf(name)
    return at === -1 ? undefined : process.argv[at + 1]
  }
  const port = option('--port')
  if (port !== undefined && !/^\d{1,5}$/.test(port)) fail(`--port needs a number, and got "${port}".`)
  const host = option('--host')
  const { serveHttp } = await import('./http.ts')
  try {
    const { url } = await serveHttp({
      ...(port !== undefined ? { port: Number(port) } : {}),
      ...(host !== undefined ? { host } : {}),
      // One line a request, for the service's log.
      log: (line) => console.error(line),
    })
    // On stderr, like every message of the server that is not an answer.
    console.error(`The Strict themes are served as an MCP server at ${url}`)
  } catch (error) {
    fail(`Could not start the server: ${error instanceof Error ? error.message : String(error)}`)
  }
} else if (process.argv[2] === 'mcp') {
  // Loaded only here, so a plain check does not pay for the MCP library.
  const { serve } = await import('./mcp.ts')
  await serve()
} else {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (error: unknown) => fail(error instanceof Error ? error.message : String(error)),
  )
}
