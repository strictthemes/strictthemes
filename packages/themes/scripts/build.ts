import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildRegistry, DEFAULT_BASE_URL } from '../src/registry.ts'

// Usage: node scripts/build.ts [--base-url <url>] [--out <dir>]
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const option = (name: string): string | undefined => {
  const i = args.indexOf(name)
  return i === -1 ? undefined : args[i + 1]
}
const baseUrl = option('--base-url') ?? process.env.STRICT_REGISTRY_URL ?? DEFAULT_BASE_URL
const out = option('--out') ?? join(root, 'dist')

// The example pages live with the site. Each becomes a block in the registry.
const registry = buildRegistry(join(root, 'themes'), baseUrl, join(root, '..', '..', 'apps', 'site', 'examples'), join(root, '..', 'kit'))

// A theme with any error or warning does not ship.
let failed = false
for (const theme of registry.themes) {
  for (const finding of theme.findings) {
    if (finding.severity === 'info') continue
    failed = true
    process.stderr.write(`${theme.slug}: ${finding.severity} ${finding.rule}: ${finding.message}\n`)
  }
}
if (failed) process.exit(1)

rmSync(out, { recursive: true, force: true })
for (const [path, content] of registry.files) {
  const target = join(out, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content)
}
process.stdout.write(
  `Built ${registry.themes.length} themes and ${registry.items.length} registry items into ${out}\nRegistry URL: ${baseUrl}\n`,
)
