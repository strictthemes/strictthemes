import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, posix } from 'node:path'

/**
 * An example page as it is kept in the repo: the files under its `src/`
 * folder, keyed by their path there (`App.tsx`, `components/ui/button.tsx`).
 */
export interface ExampleSource {
  theme: string
  page: string
  files: Record<string, string>
}

/** One file of a block, in the shape a shadcn registry item lists it. */
export interface BlockFile {
  path: string
  type: 'registry:component' | 'registry:ui' | 'registry:lib'
  content: string
  target: string
}

export interface Block {
  theme: string
  page: string
  /** The item's name in the registry: `<theme>-<page>`. */
  name: string
  /** The folder the page's own files install into, under the project's components folder. */
  folder: string
  files: BlockFile[]
  /** npm packages the files import. */
  dependencies: string[]
}

const SOURCE = /\.(ts|tsx)$/
/** What a Vite + shadcn project brings itself, and a block must not replace. */
const NOT_THE_PAGE = new Set(['main.tsx', 'vite-env.d.ts', 'components/theme-provider.tsx'])
const ENTRY = 'App.tsx'
/** Packages every React project already has. */
const GIVEN = new Set(['react', 'react-dom'])

/**
 * Every import and export-from statement in a file, with the place of its
 * specifier. Only statements that start a line count: an example's sample
 * text may hold code, such as a build error that quotes an import.
 */
function specifiers(source: string): { value: string; start: number; end: number }[] {
  const found: { value: string; start: number; end: number }[] = []
  const pattern = /^(?:import\s+(?:[\w*{}\s,$]+?\s+from\s+)?|export\s+(?:\*(?:\s+as\s+\w+)?|(?:type\s+)?\{[^}]*\})\s+from\s+)(["'])([^"'\n]+)\1/gm
  for (let match = pattern.exec(source); match; match = pattern.exec(source)) {
    const value = match[2] ?? ''
    const end = match.index + match[0].length - 1
    found.push({ value, start: end - value.length, end })
  }
  return found
}

/** The npm packages a source file imports, without the ones every React project has. */
export function importedPackages(source: string): string[] {
  const packages = new Set<string>()
  for (const { value } of specifiers(source)) {
    if (!value.startsWith('.') && !value.startsWith('@/') && !GIVEN.has(packageOf(value))) packages.add(packageOf(value))
  }
  return [...packages].sort()
}

/** The file under `src/` a specifier points at, or null for a package or an asset. */
function resolve(specifier: string, from: string, files: Record<string, string>): string | null {
  let path: string
  if (specifier.startsWith('@/')) path = specifier.slice(2)
  else if (specifier.startsWith('.')) path = posix.normalize(posix.join(posix.dirname(from), specifier))
  else return null
  for (const candidate of [path, `${path}.ts`, `${path}.tsx`, `${path}/index.ts`, `${path}/index.tsx`]) {
    if (files[candidate] !== undefined) return candidate
  }
  return null
}

/** `@base-ui/react/button` is the package `@base-ui/react`; `cn/config` is `cn`. */
const packageOf = (specifier: string): string =>
  specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : (specifier.split('/')[0] ?? specifier)

/**
 * Turns an example page into a block: the page and the files it imports, ready
 * to install into another shadcn project.
 *
 * The stock components keep their place (`components/ui`), in the form the
 * page left them: with the focus outline in place of the ring, and with `cn`
 * from the project's own utils file, which comes along too. Everything else
 * the page is made of goes into one folder, `components/<theme>-<page>/`, with
 * the page itself as `page.tsx`, and the imports between those files are
 * rewritten to their new places.
 */
export function blockFromExample(example: ExampleSource): Block | null {
  const { files } = example
  if (files[ENTRY] === undefined) return null
  const name = `${example.theme}-${example.page}`
  const folder = `components/${name}`

  // Everything the page reaches, starting from the page.
  const reached = new Set<string>()
  const queue = [ENTRY]
  while (queue.length > 0) {
    const file = queue.pop() as string
    if (reached.has(file) || NOT_THE_PAGE.has(file) || !SOURCE.test(file)) continue
    reached.add(file)
    for (const { value } of specifiers(files[file] ?? '')) {
      const target = resolve(value, file, files)
      if (target !== null) queue.push(target)
    }
  }

  const placeOf = (file: string): { target: string; type: BlockFile['type'] } => {
    if (file.startsWith('components/ui/')) return { target: file, type: 'registry:ui' }
    if (file === 'lib/utils.ts') return { target: file, type: 'registry:lib' }
    if (file === ENTRY) return { target: `${folder}/page.tsx`, type: 'registry:component' }
    return { target: `${folder}/${file.replace(/^components\//, '')}`, type: 'registry:component' }
  }

  const dependencies = new Set<string>()
  const blockFiles: BlockFile[] = []
  for (const file of [...reached].sort((a, b) => Number(b === ENTRY) - Number(a === ENTRY) || a.localeCompare(b))) {
    let content = files[file] ?? ''
    // From the last specifier to the first, so the places of the earlier ones stay right.
    for (const { value, start, end } of specifiers(content).reverse()) {
      const target = resolve(value, file, files)
      if (target === null) {
        if (!value.startsWith('.') && !value.startsWith('@/') && !GIVEN.has(packageOf(value))) dependencies.add(packageOf(value))
        continue
      }
      const moved = `@/${placeOf(target).target.replace(SOURCE, '')}`
      content = content.slice(0, start) + moved + content.slice(end)
    }
    const { target, type } = placeOf(file)
    blockFiles.push({ path: target, type, content, target })
  }
  return { theme: example.theme, page: example.page, name, folder, files: blockFiles, dependencies: [...dependencies].sort() }
}

/** Reads every `<dir>/<theme>/<page>/src` into an example source. */
export function loadExamples(dir: string): ExampleSource[] {
  if (!existsSync(dir)) return []
  const folders = (path: string): string[] =>
    readdirSync(path, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()
  const examples: ExampleSource[] = []
  for (const theme of folders(dir)) {
    for (const page of folders(join(dir, theme))) {
      const src = join(dir, theme, page, 'src')
      if (!existsSync(src)) continue
      const files: Record<string, string> = {}
      const walk = (path: string, prefix: string): void => {
        for (const entry of readdirSync(path, { withFileTypes: true })) {
          const relative = prefix === '' ? entry.name : `${prefix}/${entry.name}`
          if (entry.isDirectory()) walk(join(path, entry.name), relative)
          else if (SOURCE.test(entry.name)) files[relative] = readFileSync(join(path, entry.name), 'utf8')
        }
      }
      walk(src, '')
      examples.push({ theme, page, files })
    }
  }
  return examples
}
