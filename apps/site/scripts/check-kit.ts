// Runs Strict Check on the agent kit in every theme: the generated code in
// .kit/<theme>/ and the built demo at dist/kit/<theme>/build/, in each color
// mode, at 1280px and 375px, with hover and focus. Run `npm run build` first.
//
// Usage: node scripts/check-kit.ts [theme...]
// It fails on any error and on any warning: the kit has to be clean in every theme.
import { existsSync, readdirSync } from "node:fs"
import { join, resolve } from "node:path"

import { formatText, groupFindings, runCheck, summarize } from "../../../packages/check/src/index.ts"

const site = resolve(import.meta.dirname, "..")
const work = join(site, ".kit")
const dist = join(site, "dist")
const only = process.argv.slice(2)

if (!existsSync(work)) throw new Error("Build the site first: .kit/ is written by scripts/build-kit.ts.")

let failed = 0
let values = 0
const themes = readdirSync(work).filter((theme) => only.length === 0 || only.includes(theme)).sort()
for (const theme of themes) {
  const report = await runCheck({ dir: join(work, theme), dist, paths: [`/kit/${theme}/build/`] })
  const results = [report.source, report.rendered].filter((result) => result !== undefined)
  const summary = summarize(results)
  values += summary.checked
  const findings = results.flatMap((result) => groupFindings(result.findings))
  console.log(`${theme.padEnd(12)} ${String(summary.score).padStart(5)}% of ${summary.checked}  ${summary.errors} errors, ${summary.warnings} warnings`)
  if (findings.length > 0) {
    failed += 1
    console.log(formatText(report).split("\n").map((line) => `    ${line}`).join("\n"))
  }
}
console.log(
  failed === 0
    ? `The agent kit follows all ${themes.length} themes: ${values} measured values, 0 errors, 0 warnings.`
    : `The agent kit is off the theme in ${failed} of ${themes.length} themes.`,
)
process.exit(failed === 0 ? 0 : 1)
