import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { lintSpec, type StrictSpec } from '@strictthemes/spec'
import { checkRendered, serveStatic } from './render.ts'
import type { Report } from './report.ts'
import { rulesFor, type Rules } from './rules.ts'
import { checkSource } from './source.ts'

/** The check could not run: a missing folder or spec, a spec with errors, no browser. Not a failed check. */
export class CheckError extends Error {
  override name = 'CheckError'
}

export interface RunOptions {
  /** The project to check. */
  dir: string
  /** The spec to check against. Default: `DESIGN.md` in `dir`. */
  spec?: string
  /** The built site, relative to `dir`. It is served locally and opened in a headless browser. */
  dist?: string
  /** A site that is already running. Use this or `dist`, not both. */
  url?: string
  /** Pages to open, such as `/pricing`. Default: `/`. */
  paths?: string[]
  /** Color modes to check. Default: every mode in the spec. */
  modes?: string[]
  /** Viewport widths in px. Default: 1280 and 375. */
  widths?: number[]
  /** Path to a Chromium-based browser. Default: the Chrome on this machine. */
  browser?: string
  /** Also read `components/ui` in the source check. */
  includeUi?: boolean
  /** Folders or files to leave out of the source check, relative to `dir`. */
  exclude?: string[]
  /** Set to false to skip the source check. */
  source?: boolean
}

export interface LoadedSpec {
  file: string
  spec: StrictSpec
  rules: Rules
}

/** Reads and lints the spec for a project. Throws a `CheckError` when there is nothing reliable to check against. */
export function loadSpec(dir: string, specFile?: string): LoadedSpec {
  const folder = resolve(dir)
  if (!existsSync(folder) || !statSync(folder).isDirectory()) throw new CheckError(`Cannot find the folder ${folder}`)
  const file = resolve(folder, specFile ?? 'DESIGN.md')
  if (!existsSync(file)) throw new CheckError(`Cannot find the spec at ${file}. Pass the path of the theme's DESIGN.md.`)
  const lint = lintSpec(readFileSync(file, 'utf8'))
  if (!lint.ok) {
    const errors = lint.findings.filter((finding) => finding.severity === 'error').map((finding) => `  ${finding.message}`)
    throw new CheckError(`${file} has errors, so there is nothing reliable to check against:\n${errors.join('\n')}`)
  }
  // A project set up with shadcn names its corner classes differently.
  const shadcn = existsSync(resolve(folder, 'components.json'))
  return { file, spec: lint.spec, rules: rulesFor(lint.spec, { shadcn }) }
}

/**
 * Runs the source check, and the rendered check when `dist` or `url` is
 * given, and returns the report. Throws a `CheckError` when it cannot run.
 */
export async function runCheck(options: RunOptions): Promise<Report> {
  const dir = resolve(options.dir)
  const { rules } = loadSpec(dir, options.spec)
  const report: Report = { theme: rules.name }

  const { dist, url } = options
  if (dist !== undefined && url !== undefined) throw new CheckError('Give the built site (dist) or a running site (url), not both.')
  if (url !== undefined && !/^https?:\/\//.test(url)) throw new CheckError(`${url} is not an http or https address.`)
  const widths = options.widths ?? []
  if (widths.some((width) => !Number.isFinite(width) || width < 200)) throw new CheckError('A width is a number of pixels, 200 or more.')
  const modes = options.modes ?? []
  const unknown = modes.find((mode) => !rules.modes.includes(mode))
  if (unknown !== undefined) throw new CheckError(`The spec has no "${unknown}" mode. It has: ${rules.modes.join(', ')}.`)
  const folder = dist !== undefined ? resolve(dir, dist) : undefined
  if (folder !== undefined && !existsSync(resolve(folder, 'index.html'))) {
    throw new CheckError(`${folder} has no index.html. Build the project first.`)
  }

  if (options.source !== false) {
    report.source = checkSource(dir, rules, {
      includeUi: options.includeUi === true,
      ...(options.exclude?.length ? { exclude: options.exclude } : {}),
    })
  }

  if (folder === undefined && url === undefined) {
    report.renderedSkipped = 'Give the built site (dist) or a running site (url) to measure the pages themselves.'
    return report
  }
  const server = folder !== undefined ? await serveStatic(folder) : undefined
  try {
    report.rendered = await checkRendered(server?.url ?? url ?? '', rules, {
      paths: options.paths ?? [],
      modes,
      widths,
      ...(options.browser !== undefined ? { browser: options.browser } : {}),
    })
  } catch (error) {
    throw new CheckError(`The rendered check could not run: ${error instanceof Error ? error.message : String(error)}`)
  } finally {
    await server?.close()
  }
  return report
}
