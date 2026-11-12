import { CATEGORIES, type CheckFinding, type CheckResult, type Counts } from './types.ts'

/** Findings that share a rule and a value, with every place they were found. */
export interface FindingGroup {
  rule: string
  severity: 'error' | 'warning'
  value: string
  message: string
  /** How many places it was found in: lines of code, or elements on a page. */
  count: number
  /** Up to five of those places: `src/App.tsx:12`, or an element such as `h2.text-h1 "Plans"`. */
  where: string[]
  /** Rendered check: the color modes and viewport widths it was seen in. */
  modes?: string[]
  widths?: number[]
}

export interface Summary {
  /** True when there are no errors. Warnings do not fail a check. */
  ok: boolean
  /** Kinds of problem, not places: a rule and a value count once per check, however many places have it. */
  errors: number
  warnings: number
  /** Values measured across every category, and how many were off. */
  checked: number
  failed: number
  /** The share of measured values that follow the theme, from 0 to 100, to one decimal. */
  score: number
  /** Lines and elements left out on request. They are not part of the score. */
  ignored: number
}

const location = (finding: CheckFinding): string =>
  finding.file !== undefined
    ? `${finding.file}:${finding.line ?? 1}`
    : [finding.page, finding.selector ?? 'the page'].filter((part) => part !== undefined).join(' › ')

/** Groups findings by rule and value: errors first, then by how often each occurs. */
export function groupFindings(findings: CheckFinding[]): FindingGroup[] {
  const groups = new Map<string, FindingGroup>()
  const places = new Map<string, Set<string>>()
  for (const finding of findings) {
    const key = `${finding.rule}\u0000${finding.value}`
    const where = location(finding)
    let group = groups.get(key)
    if (!group) {
      group = { rule: finding.rule, severity: finding.severity, value: finding.value, message: finding.message, count: 0, where: [] }
      groups.set(key, group)
      places.set(key, new Set())
    }
    // The same element seen again in another mode or width is one place, not two.
    const seen = places.get(key)
    if (seen && !seen.has(where)) {
      seen.add(where)
      group.count++
      if (group.where.length < 5) group.where.push(where)
    }
    if (finding.mode !== undefined && !(group.modes ??= []).includes(finding.mode)) group.modes.push(finding.mode)
    if (finding.width !== undefined && !(group.widths ??= []).includes(finding.width)) group.widths.push(finding.width)
  }
  return [...groups.values()].sort(
    (a, b) => Number(b.severity === 'error') - Number(a.severity === 'error') || b.count - a.count || a.rule.localeCompare(b.rule),
  )
}

export function summarize(results: CheckResult[]): Summary {
  let checked = 0
  let failed = 0
  for (const result of results) {
    for (const category of CATEGORIES) {
      checked += result.counts[category].checked
      failed += result.counts[category].failed
    }
  }
  // Counted per check, as the report lists them: a problem seen in the code and on the page is two.
  const groups = results.flatMap((result) => groupFindings(result.findings))
  const errors = groups.filter((group) => group.severity === 'error').length
  return {
    ok: errors === 0,
    errors,
    warnings: groups.length - errors,
    checked,
    failed,
    score: checked === 0 ? 100 : Math.floor(((checked - failed) / checked) * 1000) / 10,
    ignored: results.reduce((sum, result) => sum + (result.ignored ?? 0), 0),
  }
}

const countLines = (counts: Counts): string[] =>
  CATEGORIES.filter((category) => counts[category].checked > 0).map((category) => {
    const { checked, failed } = counts[category]
    return `  ${category.padEnd(11)} ${String(checked).padStart(6)} checked  ${failed === 0 ? 'all on theme' : `${failed} off`}`
  })

export interface Report {
  theme: string
  source?: CheckResult
  rendered?: CheckResult
  /** Why the rendered check did not run, when it did not. */
  renderedSkipped?: string
}

/** The report as plain text for a terminal or an agent. */
export function formatText(report: Report): string {
  const results = [report.source, report.rendered].filter((result): result is CheckResult => result !== undefined)
  const summary = summarize(results)
  const lines: string[] = [`Strict Check: ${report.theme}`, '']
  if (report.source) lines.push('Source code', ...countLines(report.source.counts), '')
  if (report.rendered) {
    const scope = report.rendered.scope
    const where = scope
      ? `: ${scope.paths.join(', ')} in ${scope.modes.join(' and ')} mode at ${scope.widths.map((width) => `${width}px`).join(' and ')}`
      : ''
    lines.push(`Rendered pages${where}`, ...countLines(report.rendered.counts), '')
  }
  else if (report.renderedSkipped) lines.push(`Rendered pages: not checked. ${report.renderedSkipped}`, '')

  const sections: [string, CheckResult | undefined][] = [
    ['in the source', report.source],
    ['on the rendered pages', report.rendered],
  ]
  for (const [label, result] of sections) {
    if (!result) continue
    const groups = groupFindings(result.findings)
    for (const severity of ['error', 'warning'] as const) {
      const list = groups.filter((group) => group.severity === severity)
      if (list.length === 0) continue
      lines.push(`${severity === 'error' ? 'Errors' : 'Warnings'} ${label} (${list.length})`)
      for (const group of list) {
        lines.push(`  ${group.rule}${group.count > 1 ? `  ×${group.count}` : ''}`)
        lines.push(`    ${group.message}`)
        const more = group.count - group.where.length
        const seenIn = group.modes && group.widths ? `  [${group.modes.join(', ')}; ${group.widths.map((width) => `${width}px`).join(', ')}]` : ''
        lines.push(`    ${group.where.join('; ')}${more > 0 ? `; and ${more} more` : ''}${seenIn}`)
      }
      lines.push('')
    }
  }

  const count = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`
  const skipped = [
    report.source?.ignored ? `${count(report.source.ignored, 'place')} in the source marked strict-ignore` : '',
    report.rendered?.ignored ? `${count(report.rendered.ignored, 'element')} on the pages marked data-strict-ignore` : '',
    report.source?.excluded?.length ? `${report.source.excluded.join(', ')} in the source (excluded)` : '',
  ].filter((part) => part !== '')
  if (skipped.length > 0) lines.push(`Not checked, on request: ${skipped.join(', ')}.`, '')
  lines.push(
    `${summary.ok ? 'Passed' : 'Failed'}: ${summary.score}% of ${summary.checked} measured values follow the theme. ${count(summary.errors, 'error')}, ${count(summary.warnings, 'warning')}.`,
  )
  return `${lines.join('\n')}\n`
}

/** The report as data, for tools. */
export function formatJson(report: Report): string {
  const results = [report.source, report.rendered].filter((result): result is CheckResult => result !== undefined)
  const part = (result: CheckResult | undefined) =>
    result
      ? {
          counts: result.counts,
          ignored: result.ignored ?? 0,
          ...(result.excluded ? { excluded: result.excluded } : {}),
          ...(result.scope ? { scope: result.scope } : {}),
          findings: groupFindings(result.findings),
        }
      : null
  return `${JSON.stringify(
    {
      theme: report.theme,
      ...summarize(results),
      source: part(report.source),
      rendered: part(report.rendered),
      ...(report.renderedSkipped ? { renderedSkipped: report.renderedSkipped } : {}),
    },
    null,
    2,
  )}\n`
}
