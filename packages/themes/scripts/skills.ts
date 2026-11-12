// Writes each theme's skill to skills/<name>/SKILL.md in the repo root, where
// `npx skills add strictthemes/strictthemes` finds it. The files are generated
// from the themes: run this after changing a theme or its prompt notes. A test
// fails when a file on disk is not what this would write.
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildRegistry } from '../src/registry.ts'

const root = join(import.meta.dirname, '..', '..', '..')
const registry = buildRegistry(join(import.meta.dirname, '..', 'themes'))
for (const skill of registry.skills) {
  const dir = join(root, 'skills', skill.name)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'SKILL.md'), skill.source)
}
console.log(`Wrote ${registry.skills.length} theme skills to skills/.`)
