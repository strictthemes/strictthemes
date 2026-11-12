#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { toDtcg } from './export/dtcg.ts'
import { toNuxtUi } from './export/nuxt-ui.ts'
import { toShadcnCss, toShadcnTheme } from './export/shadcn.ts'
import { toTailwindCss } from './export/tailwind.ts'
import { lintSpec } from './lint.ts'
import type { StrictSpec } from './types.ts'

const USAGE = `strict-spec — parse, lint and export Strict design specs (DESIGN.md)

Usage:
  strict-spec lint <file> [--json]
  strict-spec export <file> --format <format> [--out <file>]

Formats:
  tailwind     Tailwind CSS v4 @theme block
  shadcn       shadcn registry item (registry:theme JSON)
  shadcn-css   shadcn CSS variables (:root / .dark)
  nuxt-ui      Nuxt UI palettes (CSS) followed by app.config.ts
  dtcg         W3C design tokens JSON
`

const FORMATS: Record<string, (spec: StrictSpec) => string> = {
  tailwind: toTailwindCss,
  shadcn: (spec) => `${JSON.stringify(toShadcnTheme(spec), null, 2)}\n`,
  'shadcn-css': toShadcnCss,
  'nuxt-ui': (spec) => {
    const theme = toNuxtUi(spec)
    return `${theme.css}\n/* app.config.ts\n${theme.appConfig}*/\n`
  },
  dtcg: (spec) => `${JSON.stringify(toDtcg(spec), null, 2)}\n`,
}

function fail(message: string): never {
  process.stderr.write(`${message}\n`)
  process.exit(2)
}

function main(argv: string[]): number {
  const [command, file, ...rest] = argv
  if (!command || command === '--help' || command === '-h') {
    process.stdout.write(USAGE)
    return 0
  }
  if (command !== 'lint' && command !== 'export') fail(`Unknown command "${command}"\n\n${USAGE}`)
  if (!file) fail(`Missing <file>\n\n${USAGE}`)

  const option = (name: string): string | undefined => {
    const index = rest.indexOf(name)
    return index === -1 ? undefined : rest[index + 1]
  }

  let source: string
  try {
    source = readFileSync(file, 'utf8')
  } catch {
    fail(`Cannot read ${file}`)
  }
  const result = lintSpec(source)

  if (command === 'lint') {
    if (rest.includes('--json')) {
      process.stdout.write(`${JSON.stringify({ ok: result.ok, findings: result.findings }, null, 2)}\n`)
    } else {
      for (const finding of result.findings) {
        const where = finding.path ? `  ${finding.path}` : ''
        process.stdout.write(`${finding.severity.padEnd(7)}  ${finding.rule}${where}\n         ${finding.message}\n`)
      }
      const count = (severity: string) => result.findings.filter((f) => f.severity === severity).length
      process.stdout.write(`\n${file}: ${count('error')} errors, ${count('warning')} warnings\n`)
    }
    return result.ok ? 0 : 1
  }

  const format = option('--format')
  const exporter = format ? FORMATS[format] : undefined
  if (!exporter) fail(`--format must be one of: ${Object.keys(FORMATS).join(', ')}`)
  if (!result.ok) {
    for (const finding of result.findings.filter((f) => f.severity === 'error')) {
      process.stderr.write(`error  ${finding.rule}  ${finding.path ?? ''}  ${finding.message}\n`)
    }
    fail(`${file} has errors; fix them before exporting`)
  }
  const output = exporter(result.spec)
  const out = option('--out')
  if (out) writeFileSync(out, output)
  else process.stdout.write(output)
  return 0
}

process.exit(main(process.argv.slice(2)))
