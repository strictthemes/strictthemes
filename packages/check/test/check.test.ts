import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { lintSpec } from '@strictthemes/spec'
import {
  checkClass,
  checkRendered,
  checkSource,
  describeRules,
  evaluatePage,
  formatText,
  mergeResults,
  groupFindings,
  loadSpec,
  rulesFor,
  serveStatic,
  summarize,
  utilityOf,
  type ElementData,
  type PageData,
} from '../src/index.ts'

const specFile = join(import.meta.dirname, '..', '..', 'spec', 'examples', 'strict-one', 'DESIGN.md')
const specSource = readFileSync(specFile, 'utf8')
const rules = rulesFor(lintSpec(specSource).spec)

/** Writes files into a new temporary folder and returns its path. */
function project(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), 'strict-check-'))
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, path)), { recursive: true })
    writeFileSync(join(dir, path), content)
  }
  return dir
}

test('rules: a spec becomes pixel scales, weights, fonts and colors per mode', () => {
  assert.deepEqual(rules.spacing, [0, 1, 4, 8, 16, 32, 64])
  assert.deepEqual(rules.radii, [0, 2, 4])
  assert.deepEqual(rules.sizes, [12, 16, 24, 36, 56])
  assert.deepEqual(rules.weights, [400, 500, 600, 700])
  assert.deepEqual(rules.fonts, ['archivo', 'ibm plex sans', 'ibm plex mono'])
  assert.deepEqual(rules.modes, ['light', 'dark'])
  assert.deepEqual(rules.contrast, { normal: 4.5, large: 3, level: 'AA' })
  assert.ok((rules.colors?.light?.length ?? 0) > 10, 'tokens plus the colors the shadcn export derives')
})

test('rules: a spec that allows anything restricts nothing', () => {
  const loose = specSource
    .replace('  colors:\n    allow: tokens', '  colors:\n    allow: any')
    .replace('  spacing:\n    allow: scale', '  spacing:\n    allow: any')
  const open = rulesFor(lintSpec(loose).spec)
  assert.equal(open.colors, null)
  assert.equal(open.spacing, null)
  assert.equal(checkClass('bg-blue-500', open), null)
  assert.equal(checkClass('p-3', open), null)
})

test('classes: variants and modifiers are stripped before a class is judged', () => {
  assert.equal(utilityOf('md:hover:p-4'), 'p-4')
  assert.equal(utilityOf('!p-4'), 'p-4')
  assert.equal(utilityOf('bg-primary/80'), 'bg-primary')
  assert.equal(utilityOf('data-[side=left]:w-64'), 'w-64')
  assert.equal(utilityOf('text-[length:var(--x)]'), 'text-[length:var(--x)]')
})

test('classes: each kind of class is judged against the theme', () => {
  const verdicts: [string, string | null][] = [
    // On the theme: counted, no problem.
    ['p-4', null],
    ['md:gap-x-8', null],
    ['-mx-1', null],
    ['mx-auto', null],
    ['py-px', null],
    ['text-h1', null],
    ['font-semibold', null],
    ['rounded-sm', null],
    ['rounded-t-md', null],
    ['rounded-none', null],
    ['mt-[16px]', null],
    ['p-[1rem]', null],
    // Off the theme.
    ['p-3', 'spacing-off-scale'],
    ['gap-6', 'spacing-off-scale'],
    ['space-y-1.5', 'spacing-off-scale'],
    ['md:hover:mt-[18px]', 'spacing-off-scale'],
    ['text-sm', 'type-off-scale'],
    ['text-[13px]', 'type-off-scale'],
    ['font-light', 'weight-undeclared'],
    ['font-[Georgia]', 'font-undeclared'],
    ['rounded-xl', 'radius-off-scale'],
    ['rounded', 'radius-off-scale'],
    ['rounded-full', 'radius-off-scale'],
    ['rounded-[10px]', 'radius-off-scale'],
    ['bg-blue-500', 'color-off-token'],
    ['hover:text-gray-600/50', 'color-off-token'],
    ['border-[#ff00aa]', 'color-off-token'],
    ['bg-[#1F3BFF]', 'color-hard-coded'],
    ['text-white', 'color-hard-coded'],
    ['bg-gradient-to-r', 'tell-gradient'],
    ['bg-linear-to-br', 'tell-gradient'],
    ['shadow-[0_0_24px_rgba(124,58,237,0.6)]', 'color-off-token'],
    ['shadow-[0_1px_0_#1F3BFF]', 'color-hard-coded'],
  ]
  for (const [candidate, rule] of verdicts) {
    const verdict = checkClass(candidate, rules)
    assert.ok(verdict, `${candidate} should be recognized`)
    assert.equal(verdict.problem?.rule ?? null, rule, candidate)
  }
  // A palette color gets a neutral example to reach for; a gradient stop gets none, because the fix is no gradient.
  assert.match(checkClass('text-gray-400', rules)?.problem?.message ?? '', /such as `text-foreground` or `text-muted-foreground`/)
  assert.doesNotMatch(checkClass('from-purple-500', rules)?.problem?.message ?? '', /such as/)
  // Not the check's business.
  for (const candidate of ['shadow-md', 'shadow-[0_1px_2px_var(--border)]', 'flex', 'w-64', 'bg-primary', 'text-muted-foreground', 'grid-cols-12', 'button', 'max-w-lg', 'top-3']) {
    assert.equal(checkClass(candidate, rules), null, candidate)
  }
})

test('classes: a shadcn project has its own names for the corners', () => {
  const source = specSource.replace(/^rounded:\n(  .+\n)+/m, 'rounded:\n  none: 0\n  sm: 3px\n  md: 6px\n  lg: 12px\n')
  const spec = lintSpec(source).spec
  const problem = (utility: string, projectRules: typeof rules): string | null =>
    checkClass(utility, projectRules)?.problem?.rule ?? null

  // Plain Tailwind: the spec's own names.
  const plain = rulesFor(spec)
  assert.deepEqual(plain.radiusClasses, { none: 0, sm: 3, md: 6, lg: 12 })
  assert.equal(problem('rounded-lg', plain), null)
  assert.equal(problem('rounded-xl', plain), 'radius-off-scale')

  // shadcn: `lg` is the base corner, and the spec's `lg` sits one name up.
  const shadcn = rulesFor(spec, { shadcn: true })
  assert.deepEqual(shadcn.radiusClasses, { none: 0, sm: 3, md: 6, xl: 12, lg: 6 })
  assert.equal(problem('rounded-lg', shadcn), null)
  assert.equal(problem('rounded-xl', shadcn), null)
  assert.equal(problem('rounded-2xl', shadcn), 'radius-off-scale')
  assert.match(describeRules(spec, shadcn), /Classes: rounded-none 0px, rounded-sm 3px, rounded-md 6px, rounded-lg 6px, rounded-xl 12px\./)

  // A project with a components.json is read as a shadcn project.
  const dir = project({ 'DESIGN.md': source, 'components.json': '{}', 'src/App.tsx': '<main className="p-4 rounded-xl" />' })
  try {
    assert.deepEqual(loadSpec(dir).rules.radiusClasses, shadcn.radiusClasses)
    assert.deepEqual(checkSource(dir, loadSpec(dir).rules).findings, [])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('source: finds classes, colors, gradients and emoji that are off the theme', () => {
  const dir = project({
    'src/App.tsx': [
      'export function App() {',
      '  return (',
      '    <main className="mx-auto p-3 md:gap-6 text-sm rounded-xl bg-blue-500">',
      '      <a href="#fee" className="p-4 text-body text-primary">Fees ✨</a>',
      '      <svg fill="#FF00AA" />',
      '      <div style={{ background: "linear-gradient(90deg, red, blue)" }} />',
      '      <p style={{ fontFamily: "Georgia" }}>Serif</p>',
      '      <p style={{ fontFamily: token.fontFamily }} className="font-[family-name:var(--font-mono)]">From the theme</p>',
      '      <p style="font-family: \'IBM Plex Mono\', monospace">Declared</p>',
      '    </main>',
      '  )',
      '}',
    ].join('\n'),
    'src/components/ui/button.tsx': 'export const Button = () => <button className="px-2.5 text-sm rounded-lg" />',
    'src/index.css': '@theme inline { --color-background: var(--background); }\n:root { --background: #FFFFFF; --x: #123456; }',
    'src/extra.css': '.note { color: #123456; background: #ffffff; }\n.serif { font-family: "Times New Roman", serif; }\n.inherit { font-family: var(--font-sans); }',
    'node_modules/pkg/index.tsx': 'export const X = () => <div className="p-3 bg-red-500" />',
  })
  try {
    const result = checkSource(dir, rules)
    const found = result.findings.map((finding) => `${finding.file}:${finding.line} ${finding.rule} ${finding.value}`)
    assert.deepEqual(found.sort(), [
      'src/App.tsx:3 color-off-token bg-blue-500',
      'src/App.tsx:3 radius-off-scale rounded-xl',
      'src/App.tsx:3 spacing-off-scale md:gap-6',
      'src/App.tsx:3 spacing-off-scale p-3',
      'src/App.tsx:3 type-off-scale text-sm',
      'src/App.tsx:4 tell-emoji ✨',
      'src/App.tsx:5 color-off-token #FF00AA',
      'src/App.tsx:6 tell-gradient gradient',
      'src/App.tsx:7 font-undeclared Georgia',
      'src/extra.css:1 color-hard-coded #ffffff',
      'src/extra.css:1 color-off-token #123456',
      'src/extra.css:2 font-undeclared Times New Roman',
    ])
    assert.deepEqual(result.counts.spacing, { checked: 4, failed: 2 })

    // The stock components are read only on request.
    const withUi = checkSource(dir, rules, { includeUi: true })
    assert.ok(withUi.findings.some((finding) => finding.file === 'src/components/ui/button.tsx'))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

/** One element as `collect()` would report it, on the theme unless overridden. */
const element = (overrides: Partial<ElementData> = {}): ElementData => ({
  selector: 'p "Text"',
  tag: 'p',
  stock: false,
  hasText: true,
  color: [17, 17, 17, 1],
  background: [0, 0, 0, 0],
  backdrop: [255, 255, 255],
  borders: [],
  radii: [0, 0, 0, 0],
  boxed: false,
  fontSize: 16,
  fontWeight: 400,
  fontFamily: 'IBM Plex Sans Variable',
  spacing: [],
  boxShadow: 'none',
  textShadow: 'none',
  backgroundImage: 'none',
  width: 400,
  height: 24,
  hidden: false,
  disabled: false,
  overflowing: false,
  emoji: null,
  card: false,
  nestedCard: false,
  ...overrides,
})
const WHITE: [number, number, number] = [255, 255, 255]
const NEAR_BLACK: [number, number, number] = [11, 11, 12]
const page = (elements: ElementData[], scrollWidth = 1280, canvas = WHITE): PageData => ({
  viewportWidth: 1280,
  scrollWidth,
  elements,
  truncated: false,
  canvas,
  ignored: 0,
})
const rulesFound = (elements: ElementData[], mode = 'light', scrollWidth = 1280): string[] =>
  evaluatePage(page(elements, scrollWidth, mode === 'dark' ? NEAR_BLACK : WHITE), rules, { mode, width: 1280 })
    .findings.map((finding) => finding.rule)
    .sort()

test('rendered: an element on the theme has no findings', () => {
  assert.deepEqual(rulesFound([element()]), [])
  // A theme color at reduced opacity is still the theme's color.
  assert.deepEqual(rulesFound([element({ background: [31, 59, 255, 0.8], boxed: true, hasText: false })]), [])
  // The same element in dark mode uses the dark tokens.
  assert.deepEqual(rulesFound([element({ color: [245, 245, 244, 1], backdrop: [11, 11, 12] })], 'dark'), [])
})

test('corners: a theme may allow full rounds up to a size', () => {
  const round = (size: number) => element({ boxed: true, hasText: false, width: size, height: size, radii: [-1, -1, -1, -1] })
  // Without `full`, every full round is a warning, in the source and on the page.
  assert.equal(rules.fullRound, 0)
  assert.equal(checkClass('rounded-full', rules)?.problem?.rule, 'radius-off-scale')
  assert.deepEqual(rulesFound([round(8)]), ['radius-off-scale'])

  const source = specSource.replace('  rounded:\n    allow: scale', '  rounded:\n    allow: scale\n    full: 48px')
  assert.notEqual(source, specSource)
  const allowing = rulesFor(lintSpec(source).spec)
  assert.equal(allowing.fullRound, 48)
  // The class passes in the source: the size is measured on the page.
  assert.equal(checkClass('rounded-full', allowing)?.problem, undefined)
  const found = (size: number) =>
    evaluatePage(page([round(size)]), allowing, { mode: 'light', width: 1280 }).findings.map((finding) => finding.severity)
  assert.deepEqual(found(8), [])
  assert.deepEqual(found(48), [])
  assert.deepEqual(found(96), ['warning'])
  // A pill counts by its shorter side.
  const pill = element({ boxed: true, hasText: false, width: 200, height: 40, radii: [20, 20, 20, 20] })
  assert.deepEqual(evaluatePage(page([pill]), allowing, { mode: 'light', width: 1280 }).findings, [])
  assert.match(describeRules(lintSpec(source).spec, allowing), /A full round \(`rounded-full`\) only on a box up to 48px across/)

  // A value that is not a size is refused.
  const bad = lintSpec(specSource.replace('  rounded:\n    allow: scale', '  rounded:\n    allow: scale\n    full: yes'))
  assert.ok(bad.findings.some((finding) => finding.rule === 'invalid-strict' && finding.path === 'strict.rounded.full'))
})

test('rendered: each measured property is judged against the theme', () => {
  assert.deepEqual(rulesFound([element({ color: [255, 0, 170, 1] })]), ['color-off-token', 'contrast'])
  assert.deepEqual(rulesFound([element({ color: [107, 107, 107, 0.5] })]), ['contrast'])
  assert.deepEqual(rulesFound([element({ fontSize: 14 })]), ['type-off-scale'])
  assert.deepEqual(rulesFound([element({ fontWeight: 300 })]), ['weight-undeclared'])
  assert.deepEqual(rulesFound([element({ fontFamily: 'Georgia' })]), ['font-undeclared'])
  assert.deepEqual(rulesFound([element({ spacing: [{ property: 'padding-top', px: 12 }] })]), ['spacing-off-scale'])
  assert.deepEqual(rulesFound([element({ boxed: true, radii: [5.6, 5.6, 5.6, 5.6] })]), ['radius-off-scale'])
  assert.deepEqual(rulesFound([element({ emoji: '✨' })]), ['tell-emoji'])
  assert.deepEqual(rulesFound([element({ card: true, nestedCard: true })]), ['tell-nested-cards'])
  assert.deepEqual(rulesFound([element({ boxShadow: 'rgba(124, 58, 237, 0.6) 0px 0px 24px 0px' })]), ['tell-glow'])
  assert.deepEqual(
    rulesFound([element({ backgroundImage: 'linear-gradient(90deg, rgb(173, 70, 255), rgb(246, 51, 154))', backdrop: null })]),
    ['tell-gradient'],
  )
  assert.deepEqual(rulesFound([element()], 'light', 1500), ['horizontal-scroll'])
})

test('rendered: what cannot be seen or is not the page author\'s is left alone', () => {
  // A stock component keeps its own spacing.
  assert.deepEqual(rulesFound([element({ stock: true, spacing: [{ property: 'padding-left', px: 10 }] })]), [])
  // A radius on an element that paints no box cannot be seen.
  assert.deepEqual(rulesFound([element({ radii: [9, 9, 9, 9] })]), [])
  // Visually hidden text and disabled controls are not held to contrast.
  assert.deepEqual(rulesFound([element({ hidden: true, fontSize: 1, color: [255, 0, 170, 1] })]), [])
  assert.deepEqual(rulesFound([element({ disabled: true, color: [107, 107, 107, 0.5] })]), [])
  // Large text needs 3:1, not 4.5:1.
  assert.deepEqual(rulesFound([element({ fontSize: 36, fontWeight: 700, color: [107, 107, 107, 0.75] })]), [])
  // A neutral shadow is not a glow; a one-color fade is not a multi-color gradient.
  assert.deepEqual(rulesFound([element({ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 2px 0px' })]), [])
  // A shadow layer of no size draws nothing, whatever its color: `ring-0` leaves one in the text color.
  assert.deepEqual(rulesFound([element({ boxShadow: 'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgb(7, 59, 76) 0px 0px 0px 0px' })]), [])
  assert.deepEqual(rulesFound([element({ boxShadow: 'rgb(7, 59, 76) 0px 0px 0px 0px, rgb(7, 59, 76) 0px 0px 0px 3px' })]), ['tell-glow'])
  assert.deepEqual(rulesFound([element({ backgroundImage: 'linear-gradient(rgb(245, 245, 244), rgb(255, 255, 255))', backdrop: null })]), [])
})

test('report: the same element in several modes is one place', () => {
  const light = evaluatePage(page([element({ fontSize: 14 })]), rules, { mode: 'light', width: 1280 })
  const dark = evaluatePage(page([element({ fontSize: 14, color: [245, 245, 244, 1], backdrop: NEAR_BLACK })], 1280, NEAR_BLACK), rules, { mode: 'dark', width: 375 })
  const groups = groupFindings([...light.findings, ...dark.findings])
  assert.equal(groups.length, 1)
  assert.equal(groups[0]?.count, 1)
  assert.deepEqual(groups[0]?.modes, ['light', 'dark'])
  assert.deepEqual(groups[0]?.widths, [1280, 375])

  const summary = summarize([mergeResults([light, dark])])
  assert.equal(summary.ok, false)
  assert.equal(summary.errors, 1)
  assert.ok(summary.score < 100 && summary.score > 50)
  const text = formatText({ theme: rules.name, rendered: { findings: [...light.findings, ...dark.findings], counts: light.counts } })
  assert.match(text, /type-off-scale/)
  assert.match(text, /\[light, dark; 1280px, 375px\]/)
  assert.match(text, /^Failed: /m)
})

test('rendered: a page that does not switch modes is reported once, not once per color', () => {
  // The page is still white in dark mode: every color on it would be "off" for the same reason.
  const stuck = evaluatePage(page([element(), element(), element()]), rules, { mode: 'dark', width: 1280 })
  assert.deepEqual(stuck.findings.map((finding) => `${finding.severity} ${finding.rule} ${finding.value}`), ['warning mode-not-applied dark'])
  assert.match(stuck.findings[0]?.message ?? '', /still #FFFFFF.*--mode light/)
  assert.deepEqual(stuck.counts.colors, { checked: 1, failed: 1 })
  assert.equal(stuck.counts.typography.checked, 0)
  // A page with some other background of its own is checked as usual.
  const custom = evaluatePage(page([element({ backdrop: [20, 20, 60] })], 1280, [20, 20, 60]), rules, { mode: 'dark', width: 1280 })
  assert.ok(!custom.findings.some((finding) => finding.rule === 'mode-not-applied'))
})

test('report: says what was opened, and its totals add up to its sections', () => {
  const source = { findings: [], counts: evaluatePage(page([]), rules, { mode: 'light', width: 1280 }).counts }
  const rendered = {
    ...mergeResults([evaluatePage(page([element({ emoji: '✨', fontSize: 14 })]), rules, { mode: 'light', width: 1280 })]),
    scope: { paths: ['/', '/pricing'], modes: ['light', 'dark'], widths: [1280, 375] },
  }
  const inCode = {
    counts: source.counts,
    findings: [{ rule: 'tell-emoji', category: 'tells' as const, severity: 'error' as const, message: 'An emoji.', value: '✨', file: 'src/App.tsx', line: 3 }],
  }
  const text = formatText({ theme: rules.name, source: inCode, rendered })
  assert.match(text, /^Rendered pages: \/, \/pricing in light and dark mode at 1280px and 375px$/m)
  assert.match(text, /^Errors in the source \(1\)$/m)
  assert.match(text, /^Errors on the rendered pages \(2\)$/m)
  // The emoji is in the code and on the page: one error in each section, so three in all.
  assert.match(text, /3 errors, 0 warnings\.$/m)
  assert.equal(summarize([inCode, rendered]).errors, 3)
})

test('report: findings from several pages name the page', () => {
  const home = evaluatePage(page([element({ fontSize: 14 })]), rules, { mode: 'light', width: 1280, path: '/' })
  const pricing = evaluatePage(page([element({ fontSize: 14 })]), rules, { mode: 'light', width: 1280, path: '/pricing' })
  const groups = groupFindings([...home.findings, ...pricing.findings])
  assert.equal(groups[0]?.count, 2)
  assert.deepEqual(groups[0]?.where, ['/ › p "Text"', '/pricing › p "Text"'])
})

test('source: a folder or a file can be left out, and the report names it', () => {
  const dir = project({
    'src/App.tsx': '<main className="p-4 text-body" />',
    'examples/other/src/App.tsx': '<main className="p-3 text-sm bg-blue-500" />',
    'src/generated/icons.tsx': '<svg className="p-3" />',
    'src/examples/Kept.tsx': '<main className="p-3" />',
  })
  try {
    const all = checkSource(dir, rules)
    assert.equal(groupFindings(all.findings).length, 3)
    assert.equal(all.excluded, undefined)

    // A folder by its path from the project, however it is written, and one file.
    const some = checkSource(dir, rules, { exclude: ['./examples/', 'src/generated/icons.tsx'] })
    assert.deepEqual(some.excluded, ['examples', 'src/generated/icons.tsx'])
    // Only the path itself is left out, not every folder of that name.
    assert.deepEqual(some.findings.map((finding) => finding.file), ['src/examples/Kept.tsx'])

    const text = formatText({ theme: 'Strict One', source: some })
    assert.match(text, /^Not checked, on request: examples, src\/generated\/icons\.tsx in the source \(excluded\)\.$/m)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('source: a comment leaves a line, the next line or a whole file out', () => {
  const dir = project({
    'src/App.tsx': [
      '<main className="p-3">', // 1: reported
      '  <div className="p-3" /> {/* strict-ignore: a preview of another theme */}', // 2: left out
      '  {/* strict-ignore-next-line */}', // 3
      '  <div className="gap-6 text-sm" />', // 4: left out
      '  <div className="gap-6" data-strict-ignore />', // 5: the attribute is for the rendered check only
      '  <p className="text-body">A rounded box, with rounded: 4px</p>', // 6: the word, not the class
      '  <p className="rounded text-body" />', // 7: the class
      '  <p className="text-body">{"Figures are rounded to the nearest pound."}</p>', // 8: a sentence in a string
      '  <p className={`rounded ${wide ? "p-4" : "p-2"}`} />', // 9: the class, in a template
      '</main>',
    ].join('\n'),
    'src/Swatches.tsx': '// strict-ignore-file: shows other palettes\nexport const X = () => <div className="bg-blue-500 p-3" />',
    'src/page.html': '<!-- strict-ignore-next-line -->\n<p class="text-sm">Small</p>\n<p class="text-sm">Small</p>',
  })
  try {
    const result = checkSource(dir, rules)
    assert.deepEqual(
      result.findings.map((finding) => `${finding.file}:${finding.line} ${finding.value}`).sort(),
      ['src/App.tsx:1 p-3', 'src/App.tsx:5 gap-6', 'src/App.tsx:7 rounded', 'src/App.tsx:9 rounded', 'src/page.html:3 text-sm'],
    )
    // Two lines in App.tsx, one file, one line in page.html.
    assert.equal(result.ignored, 4)
    assert.equal(summarize([result]).ignored, 4)
    assert.match(formatText({ theme: rules.name, source: result }), /Not checked, on request: 4 places in the source marked strict-ignore\./)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

const CSS = `
  :root { --background: #FFFFFF; --foreground: #111111; --primary: #1F3BFF; }
  .dark { --background: #0B0B0C; --foreground: #F5F5F4; --primary: #8091FF; }
  html { background: var(--background); color: var(--foreground); font: 400 16px "IBM Plex Sans", sans-serif; }
  body { margin: 0; padding: 16px; }
  h1 { font: 700 36px Archivo, sans-serif; margin: 0 0 16px; }
  a { color: var(--primary); }
`
const cleanPage = `<!doctype html><html><head><meta name="viewport" content="width=device-width"><style>${CSS}</style></head>
<body><h1>Plain page</h1><p style="margin:0">Body text with <a href="#">a link</a>.</p></body></html>`
const ignoredPage = cleanPage.replace(
  '</body>',
  '<div data-strict-ignore><p style="font-size:13px;color:#FF00AA;padding:12px">A preview of another theme ✨</p></div></body>',
)
const brokenPage = cleanPage.replace(
  '</body>',
  '<p style="margin:0;font-size:13px;color:#FF00AA;padding:12px">Off ✨</p><div style="width:700px;height:8px"></div></body>',
)

test('rendered: a real page is opened in every mode and width', async (t) => {
  const dir = project({ 'index.html': cleanPage, 'broken/index.html': brokenPage, 'ignored/index.html': ignoredPage })
  const server = await serveStatic(dir)
  try {
    let clean
    try {
      clean = await checkRendered(server.url, rules)
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('No browser')) return t.skip('no Chromium-based browser on this machine')
      throw error
    }
    assert.deepEqual(clean.findings, [])
    // Two modes at two widths, each with one layout check.
    assert.equal(clean.counts.layout.checked, 4)
    assert.ok(clean.counts.contrast.checked >= 12)

    assert.equal(clean.ignored, 0)

    // An element marked data-strict-ignore is left out with everything in it, and counted once.
    const ignored = await checkRendered(server.url, rules, { paths: ['/ignored'] })
    assert.deepEqual(ignored.findings, [])
    assert.equal(ignored.ignored, 1)

    // With two pages, each finding says which page it is on.
    const both = await checkRendered(server.url, rules, { paths: ['/', '/broken'], modes: ['light'], widths: [1280] })
    assert.ok(both.findings.length > 0)
    assert.ok(both.findings.every((finding) => finding.page === '/broken'))

    const broken = await checkRendered(server.url, rules, { paths: ['/broken'] })
    const found = new Set(broken.findings.map((finding) => finding.rule))
    assert.deepEqual([...found].sort(), ['color-off-token', 'contrast', 'horizontal-scroll', 'spacing-off-scale', 'tell-emoji', 'type-off-scale'])
    // The page is 700px wide: it scrolls at 375px, in both modes, and not at 1280px.
    const scroll = broken.findings.filter((finding) => finding.rule === 'horizontal-scroll')
    assert.deepEqual(scroll.map((finding) => `${finding.mode} ${finding.width}`).sort(), ['dark 375', 'light 375'])
  } finally {
    await server.close()
    rmSync(dir, { recursive: true, force: true })
  }
})

test('cli: exits 0 on a clean project, 1 on errors and 2 when it cannot run', () => {
  const cli = join(import.meta.dirname, '..', 'src', 'cli.ts')
  const run = (...args: string[]) => spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' })
  const clean = project({ 'DESIGN.md': specSource, 'src/App.tsx': '<main className="p-4 text-body rounded-sm" />' })
  const broken = project({ 'DESIGN.md': specSource, 'src/App.tsx': '<main className="p-3 text-sm bg-blue-500" />' })
  try {
    const ok = run(clean)
    assert.equal(ok.status, 0, ok.stderr)
    assert.match(ok.stdout, /^Passed: 100% of 3 measured values/m)
    assert.match(ok.stdout, /Rendered pages: not checked/)

    const failed = run(broken, '--json')
    assert.equal(failed.status, 1)
    const report = JSON.parse(failed.stdout) as { ok: boolean; errors: number; source: { findings: { rule: string }[] } }
    assert.equal(report.ok, false)
    assert.equal(report.errors, 3)
    assert.deepEqual(report.source.findings.map((finding) => finding.rule).sort(), ['color-off-token', 'spacing-off-scale', 'type-off-scale'])

    // A relative --spec is read from where the command runs, not from the project.
    const elsewhere = spawnSync(process.execPath, [cli, broken, '--spec', 'DESIGN.md'], { encoding: 'utf8', cwd: clean })
    assert.equal(elsewhere.status, 1, elsewhere.stderr)

    // For a CI job: a folder left out, and the report kept as files, also when the check fails.
    mkdirSync(join(broken, 'vendor'), { recursive: true })
    writeFileSync(join(broken, 'vendor', 'Widget.tsx'), '<div className="gap-6" />')
    const text = join(broken, 'reports', 'strict-check.txt')
    const json = join(broken, 'reports', 'strict-check.json')
    const kept = run(broken, '--exclude', 'vendor', '--report', text, '--report', json)
    assert.equal(kept.status, 1, kept.stderr)
    assert.equal(readFileSync(text, 'utf8'), kept.stdout)
    assert.match(kept.stdout, /^Failed: .* 3 errors, 0 warnings\.$/m)
    const saved = JSON.parse(readFileSync(json, 'utf8')) as { errors: number; source: { excluded: string[] } }
    assert.equal(saved.errors, 3)
    assert.deepEqual(saved.source.excluded, ['vendor'])
    assert.ok(!existsSync(join(clean, 'reports')))

    assert.equal(run(join(clean, 'missing')).status, 2)
    assert.equal(run(clean, '--spec', join(clean, 'nope.md')).status, 2)
    assert.equal(run(clean, '--mode', 'sepia', '--dist', '.').status, 2)
    assert.equal(run(clean, '--frobnicate').status, 2)
  } finally {
    rmSync(clean, { recursive: true, force: true })
    rmSync(broken, { recursive: true, force: true })
  }
})
