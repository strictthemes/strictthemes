/** What a finding is about. Each category is counted on its own. */
export type Category = 'colors' | 'spacing' | 'typography' | 'corners' | 'contrast' | 'tells' | 'layout'

export const CATEGORIES: Category[] = ['colors', 'spacing', 'typography', 'corners', 'contrast', 'tells', 'layout']

export interface CheckFinding {
  rule: string
  category: Category
  severity: 'error' | 'warning'
  /** One sentence: what is wrong and what the theme allows. */
  message: string
  /** The offending value, e.g. `gap-6` or `13px`. Findings with the same rule and value are grouped in reports. */
  value: string
  /** Source check: the file, relative to the project, and the line. */
  file?: string
  line?: number
  /** Rendered check: the element, the color mode and the viewport width it was measured in. */
  selector?: string
  mode?: string
  width?: number
  /** Rendered check: the page's path, when more than one page was checked. */
  page?: string
}

export interface Count {
  /** Values that were measured against the theme. */
  checked: number
  /** Values that were off. */
  failed: number
}

export type Counts = Record<Category, Count>

export interface CheckResult {
  findings: CheckFinding[]
  counts: Counts
  /** Places left out on request: lines marked `strict-ignore`, elements marked `data-strict-ignore`. */
  ignored?: number
  /** Source check: the folders and files left out with `exclude`. */
  excluded?: string[]
  /** Rendered check: the pages, color modes and widths that were opened. */
  scope?: { paths: string[]; modes: string[]; widths: number[] }
}

export const emptyCounts = (): Counts =>
  Object.fromEntries(CATEGORIES.map((category) => [category, { checked: 0, failed: 0 }])) as Counts

export function mergeResults(results: CheckResult[]): CheckResult {
  const counts = emptyCounts()
  for (const result of results) {
    for (const category of CATEGORIES) {
      counts[category].checked += result.counts[category].checked
      counts[category].failed += result.counts[category].failed
    }
  }
  const ignored = results.reduce((sum, result) => sum + (result.ignored ?? 0), 0)
  const scope = results.find((result) => result.scope !== undefined)?.scope
  const excluded = [...new Set(results.flatMap((result) => result.excluded ?? []))]
  return {
    findings: results.flatMap((result) => result.findings),
    counts,
    ignored,
    ...(excluded.length > 0 ? { excluded } : {}),
    ...(scope ? { scope } : {}),
  }
}
