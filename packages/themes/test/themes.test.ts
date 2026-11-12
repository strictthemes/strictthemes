import assert from 'node:assert/strict'
import { join } from 'node:path'
import { test } from 'node:test'
import { contrastRatio, mix, namedFamilies, parseColor, shadcnRadiusClasses } from '@strictthemes/spec'
import { FONTS } from '../src/fonts.ts'
import { buildRegistry, DEFAULT_BASE_URL, loadThemes } from '../src/registry.ts'

const themesDir = join(import.meta.dirname, '..', 'themes')
const themes = loadThemes(themesDir)
const registry = buildRegistry(themesDir)

const ratio = (a: string | undefined, b: string | undefined): number => {
  const x = parseColor(a ?? '')
  const y = parseColor(b ?? '')
  assert.ok(x && y, `not colors: ${a}, ${b}`)
  return contrastRatio(x, y)
}

test('Recital loads the italics its block quotes and emphasis are set in', () => {
  const item = registry.items.find((i) => i.name === 'recital')
  assert.ok(item)
  assert.deepEqual(Object.keys(item.css ?? {}), [
    '@import "@fontsource-variable/source-sans-3/wght-italic.css"',
    '@import "@fontsource-variable/fraunces/wght-italic.css"',
  ])
  assert.deepEqual(item.dependencies, ['@fontsource-variable/source-sans-3', '@fontsource-variable/fraunces'])
  // The spec's 12px corner is `rounded-xl` in a shadcn project; `rounded-lg` stays the base.
  assert.equal(item.cssVars?.theme?.['radius-xl'], '12px')
  assert.equal(item.cssVars?.theme?.['radius-lg'], undefined)
})

test('Avion has classes for its success color in both modes', () => {
  const item = registry.items.find((i) => i.name === 'avion')
  assert.ok(item)
  assert.equal(item.css, undefined)
  assert.equal(item.cssVars?.theme?.['color-success'], 'var(--success)')
  assert.equal(item.cssVars?.light?.success, '#1E7B4B')
  assert.equal(item.cssVars?.dark?.success, '#4CC38A')
  assert.equal(item.cssVars?.theme?.['radius-xl'], '14px')
})

test('Strict One loads every weight of its mono font and has a tertiary class', () => {
  const item = registry.items.find((i) => i.name === 'strict-one')
  assert.ok(item)
  // Labels are weight 500; the font package's default import is 400 only.
  assert.deepEqual(Object.keys(item.css ?? {}), ['@import "@fontsource/ibm-plex-mono/500.css"'])
  assert.deepEqual(item.dependencies, ['@fontsource/ibm-plex-mono'])
  assert.equal(item.cssVars?.theme?.['color-tertiary'], 'var(--tertiary)')
  assert.equal(item.cssVars?.light?.tertiary, '#FF4F00')
  assert.equal(item.cssVars?.light?.['tertiary-foreground'], '#111111')
  assert.equal(item.cssVars?.dark?.tertiary, '#FF4F00')
})

test('there are twenty-three themes with unique names', () => {
  assert.deepEqual(themes.map((t) => t.slug), [
    'atelier', 'avion', 'cipher', 'civic', 'confetti', 'counsel', 'dispatch',
    'ember', 'gauge', 'kiln', 'ledger', 'nocturne', 'passage', 'primer',
    'recital', 'relay', 'solace', 'sorbet', 'strict-one', 'tideline', 'tisane',
    'veranda', 'voltage',
  ])
  assert.equal(new Set(themes.map((t) => t.spec.name)).size, themes.length)
})

test('no two themes look alike: each has its own heading font, page color and accent', () => {
  const seen = { heading: new Map<string, string>(), colors: new Map<string, string>(), body: new Map<string, string>() }
  for (const theme of themes) {
    const { typography, colors } = theme.spec
    const facts = {
      heading: String(typography.display?.fontFamily),
      body: String(typography.body?.fontFamily),
      colors: `${colors.background} ${colors.primary}`,
    }
    for (const [kind, value] of Object.entries(facts) as [keyof typeof seen, string][]) {
      assert.equal(seen[kind].get(value), undefined, `${theme.slug} shares its ${kind} (${value}) with ${seen[kind].get(value)}`)
      seen[kind].set(value, theme.slug)
    }
  }
})

test('Cipher is set in Geist, so its install note says to keep the Geist import', () => {
  const docs = (slug: string) => registry.items.find((i) => i.name === slug)?.docs ?? ''
  assert.match(docs('cipher'), /keep that import/)
  assert.doesNotMatch(docs('cipher'), /remove that import/)
  assert.match(docs('kiln'), /remove that import/)
  // Its headings and labels share one font, which is installed once for each role.
  const item = registry.items.find((i) => i.name === 'cipher')
  assert.deepEqual(
    item?.registryDependencies?.map((url) => url.split('/').at(-1)),
    ['font-geist-sans.json', 'font-jet-brains-mono-mono.json', 'font-jet-brains-mono-heading.json'],
  )
  // Its page prompts say the same, and give labels the mono class.
  const prompt = registry.prompts.find((p) => p.theme === 'cipher')?.prompt ?? ''
  assert.match(prompt, /One of the theme's fonts is Geist, which a new shadcn project already imports: keep that import\./)
  assert.doesNotMatch(prompt, /a new shadcn project imports Geist\)/)
  assert.ok(prompt.includes('`font-heading` with `text-display`, `text-h1`, `text-h2`; `font-mono` with `text-label`; the two classes are the same family in this theme.'))
  const kiln = registry.prompts.find((p) => p.theme === 'kiln')?.prompt ?? ''
  assert.match(kiln, /a new shadcn project imports Geist\)/)
  assert.doesNotMatch(kiln, /the same family in this theme/)
})

test('Civic keeps its text at WCAG AAA in both modes', () => {
  const civic = themes.find((t) => t.slug === 'civic')
  assert.equal(civic?.spec.strict.contrast, 'AAA')
  const item = registry.items.find((i) => i.name === 'civic')
  assert.ok(item?.cssVars)
  for (const mode of ['light', 'dark']) {
    const vars = item.cssVars[mode] ?? {}
    for (const pair of ['primary', 'secondary', 'card', 'popover']) {
      const r = ratio(vars[pair], vars[`${pair}-foreground`])
      assert.ok(r >= 7, `${mode} ${pair}: ${r.toFixed(2)}`)
    }
    for (const surface of ['background', 'card']) {
      for (const text of ['foreground', 'muted-foreground']) {
        const r = ratio(vars[text], vars[surface])
        assert.ok(r >= 7, `${mode} ${text} on ${surface}: ${r.toFixed(2)}`)
      }
    }
    // A field's edge has to be visible too: 3:1 against the page.
    assert.ok(ratio(vars.border, vars.background) >= 3, `${mode} border`)
  }
})

for (const theme of themes) {
  test(`${theme.slug}: lints with no errors or warnings`, () => {
    const problems = theme.findings.filter((f) => f.severity !== 'info')
    assert.deepEqual(problems, [])
  })

  test(`${theme.slug}: is a complete spec`, () => {
    assert.ok(theme.spec.strictDeclared, 'has a strict block')
    assert.ok(theme.spec.strict.modes.dark, 'has a dark mode')
    assert.equal(theme.spec.sections.length, 8, 'has all eight sections')
    assert.ok(theme.spec.description, 'has a description')
  })

  test(`${theme.slug}: every font can be installed`, () => {
    for (const family of namedFamilies(theme.spec.typography)) {
      assert.ok(FONTS[family], `${family} is missing from the font catalog`)
    }
  })

  test(`${theme.slug}: shadcn colors are readable in both modes`, () => {
    const item = registry.items.find((i) => i.name === theme.slug)
    assert.ok(item?.cssVars)
    for (const mode of ['light', 'dark']) {
      const vars = item.cssVars[mode] ?? {}
      for (const pair of ['primary', 'secondary', 'accent', 'card', 'popover', 'sidebar', 'sidebar-primary']) {
        const r = ratio(vars[pair], vars[`${pair}-foreground`])
        assert.ok(r >= 4.5, `${mode} ${pair}: ${r.toFixed(2)}`)
      }
      for (const surface of ['background', 'card']) {
        const r = ratio(vars['muted-foreground'], vars[surface])
        assert.ok(r >= 4.5, `${mode} muted text on ${surface}: ${r.toFixed(2)}`)
      }
      assert.ok(ratio(vars.destructive, vars.background) >= 4.5, `${mode} destructive text`)
      // The stock shadcn button hovers at `bg-primary/80`: 80% primary over the page.
      const hover = mix(parseColor(vars.background ?? '')!, parseColor(vars.primary ?? '')!, 0.8)
      const onHover = contrastRatio(hover, parseColor(vars['primary-foreground'] ?? '')!)
      assert.ok(onHover >= 4.5, `${mode} primary button on hover: ${onHover.toFixed(2)}`)
      if (vars.tertiary !== undefined) {
        const r = ratio(vars.tertiary, vars['tertiary-foreground'])
        assert.ok(r >= 4.5, `${mode} tertiary: ${r.toFixed(2)}`)
      }
      assert.ok(ratio(vars.accent, vars.popover) >= 1.12, `${mode} highlight on popover`)
    }
  })
}

test('registry: theme items depend on their font items', () => {
  const names = new Set(registry.items.map((i) => i.name))
  for (const theme of themes) {
    const item = registry.items.find((i) => i.name === theme.slug)
    assert.ok(item)
    assert.equal(item.type, 'registry:theme')
    assert.equal(item.registryDependencies?.length, 3)
    for (const url of item.registryDependencies ?? []) {
      assert.ok(url.startsWith(`${DEFAULT_BASE_URL}/font-`), url)
      assert.ok(names.has(url.slice(DEFAULT_BASE_URL.length + 1, -'.json'.length)), `${url} is not in the registry`)
    }
    // Font variables and the "load these fonts yourself" note belong to the font items.
    const themeVars = Object.keys(item.cssVars?.theme ?? {})
    assert.ok(themeVars.every((name) => !name.startsWith('font-')), themeVars.join(', '))
    // The type scale installs with the theme, as text-<token> utilities.
    assert.ok(themeVars.includes('text-display') && themeVars.includes('text-body'))
    assert.ok(!item.docs?.includes('does not load the font files'), 'fonts come from font items')
    assert.ok(item.docs?.includes('createCn'), 'the install note explains the cn() setup')
    assert.ok(item.cssVars?.light?.radius)
  }
})

test('registry: font items', () => {
  const fonts = registry.items.filter((i) => i.type === 'registry:font')
  // Three per theme: body, labels and headings.
  assert.equal(fonts.length, themes.length * 3)
  for (const item of fonts) {
    const font = item.font as Record<string, string>
    for (const key of ['family', 'provider', 'import', 'variable', 'selector', 'dependency']) {
      assert.ok(font[key], `${item.name} is missing ${key}`)
    }
    // Each role has its own elements, so one font never replaces another on `html`.
    const expected = { '--font-sans': 'html', '--font-mono': 'code, kbd, pre, samp', '--font-heading': 'h1, h2, h3, h4, h5, h6' }
    assert.equal(font.selector, expected[font.variable as keyof typeof expected])
  }
})

test('registry: files and index', () => {
  const index = JSON.parse(registry.files.get('r/registry.json') ?? '{}') as { name: string; items: { name: string }[] }
  assert.equal(index.name, 'strict')
  assert.equal(index.items.length, registry.items.length)
  for (const theme of themes) {
    for (const file of ['DESIGN.md', 'tailwind.css', 'shadcn.css', 'nuxt-ui.css', 'app.config.ts', 'tokens.json']) {
      assert.ok(registry.files.has(`themes/${theme.slug}/${file}`), `${theme.slug}/${file}`)
    }
    assert.ok(registry.files.has(`r/${theme.slug}.json`))
  }
})

test('registry: base URL can be changed', () => {
  const local = buildRegistry(themesDir, 'http://localhost:4000/r/')
  const item = local.items.find((i) => i.name === 'recital')
  assert.ok(item?.registryDependencies?.every((url) => url.startsWith('http://localhost:4000/r/font-')))
})

const strictOne = themes.find((t) => t.slug === 'strict-one')

test('prompts: a theme with page prompts has five, in reading order', () => {
  const pages: Record<string, string[]> = {
    'strict-one': ['landing', 'pricing', 'article', 'docs', 'dashboard'],
    recital: ['essay', 'journal', 'chapter', 'newsletter', 'about'],
    avion: ['dashboard', 'status', 'list', 'detail', 'settings'],
    kiln: ['shop', 'collection', 'product', 'basket', 'studio'],
    ledger: ['overview', 'transactions', 'invoice', 'transfer', 'report'],
    cipher: ['landing', 'docs', 'releases', 'deploys', 'tokens'],
    sorbet: ['welcome', 'today', 'progress', 'plans', 'profile'],
    atelier: ['home', 'collection', 'piece', 'house', 'appointment'],
    civic: ['start', 'question', 'review', 'confirmation', 'guidance'],
    dispatch: ['front', 'story', 'live', 'scores', 'section'],
    tisane: ['home', 'menu', 'booking', 'recipe', 'visit'],
    voltage: ['launch', 'lineup', 'tickets', 'artist', 'info'],
    nocturne: ['programme', 'film', 'season', 'membership', 'visit'],
    counsel: ['firm', 'practice', 'profile', 'insight', 'enquiry'],
    passage: ['search', 'results', 'details', 'ticket', 'departures'],
    ember: ['game', 'patch', 'leaderboard', 'store', 'player'],
    gauge: ['catalogue', 'part', 'compare', 'quote', 'downloads'],
    confetti: ['invitation', 'rsvp', 'gifts', 'day', 'guestbook'],
    tideline: ['home', 'lessons', 'forecast', 'booking', 'guide'],
    relay: ['home', 'fixtures', 'standings', 'membership', 'report'],
    veranda: ['home', 'rooms', 'room', 'reserve', 'menu'],
    solace: ['home', 'approach', 'profile', 'fees', 'appointment'],
    primer: ['catalogue', 'course', 'lesson', 'progress', 'plans'],
  }
  // Every theme has page prompts.
  assert.deepEqual(themes.map((t) => t.slug).sort(), Object.keys(pages).sort())
  for (const [slug, expected] of Object.entries(pages)) {
    const prompts = registry.prompts.filter((p) => p.theme === slug)
    assert.deepEqual(prompts.map((p) => p.slug), expected, slug)
    for (const prompt of prompts) {
      assert.equal(registry.files.get(`themes/${slug}/prompts/${prompt.slug}.md`), prompt.prompt)
    }
    assert.ok(!registry.files.has(`themes/${slug}/prompts/_shared.md`), 'shared notes are not a prompt')
    assert.ok(themes.find((t) => t.slug === slug)?.promptNotes, `${slug}: no layout notes`)
  }
})

test('prompts: every prompt carries the install step, the theme, the rules and a checklist', () => {
  for (const prompt of registry.prompts) {
    const text = prompt.prompt
    const order = ['## Before you start', '## The theme in short', '## The page', '## Rules', '## Check before you finish']
    const positions = order.map((heading) => text.indexOf(heading))
    assert.ok(positions.every((at) => at > 0), `${prompt.slug}: a section is missing`)
    assert.deepEqual([...positions].sort((a, b) => a - b), positions, `${prompt.slug}: sections out of order`)
    assert.ok(text.includes(`npx shadcn@latest add ${DEFAULT_BASE_URL}/${prompt.theme}.json`), prompt.slug)
    assert.ok(prompt.checks.length >= 3, `${prompt.slug}: needs its own checks`)
    for (const check of prompt.checks) assert.ok(text.includes(`- [ ] ${check}`), `${prompt.slug}: ${check}`)
    assert.ok(!/lorem ipsum dolor/i.test(text), prompt.slug)
  }
})

test('prompts: the rules come from the theme, not from the brief', () => {
  for (const prompt of registry.prompts) {
    const theme = themes.find((t) => t.slug === prompt.theme)
    assert.ok(theme)
    const { spec } = theme
    for (const name of Object.keys(spec.typography)) {
      assert.ok(prompt.prompt.includes(`\`text-${name}\``), `${prompt.slug}: text-${name}`)
    }
    assert.ok(prompt.prompt.includes(`WCAG ${spec.strict.contrast}`), prompt.slug)
    assert.ok(prompt.prompt.includes(spec.colors.primary ?? 'no primary'), prompt.slug)
    // Without this step shadcn's cn() drops the type classes next to a text color.
    assert.ok(prompt.prompt.includes('createCn'), prompt.slug)
    assert.ok(prompt.prompt.includes(`text: [${Object.keys(spec.typography).map((n) => `"${n}"`).join(', ')}]`), prompt.slug)
    // Corners are named by the class a shadcn project has for them, not by the spec's token.
    for (const [token, step] of Object.entries(shadcnRadiusClasses(spec))) {
      assert.ok(prompt.prompt.includes(`\`rounded-${step}\` ${spec.rounded[token]}`), `${prompt.theme}/${prompt.slug}: rounded-${step}`)
    }
  }
})

test('prompts: a brief only names corners the theme has', () => {
  for (const theme of themes) {
    // `lg` is shadcn's base corner, `full` is for avatars and status dots.
    const corners = new Set(['none', 'lg', 'full', ...Object.values(shadcnRadiusClasses(theme.spec))])
    for (const brief of [...theme.briefs, { slug: '_shared', body: theme.promptNotes }]) {
      for (const [, name] of brief.body.matchAll(/`[^`]*?\brounded-([a-z0-9]+)\b/g)) {
        assert.ok(corners.has(name ?? ''), `${theme.slug}/${brief.slug}: rounded-${name} is not one of the theme's corners`)
      }
    }
  }
})

test('prompts: a brief does not ask for what the theme forbids', () => {
  assert.ok(strictOne)
  for (const brief of strictOne.briefs) {
    // Strict One: primary is for the main action and links, and the theme has no pills.
    assert.ok(!/`[^`]*\brounded-(lg|xl|full)\b/.test(brief.body), `${brief.slug}: corners are none, sm or md`)
    assert.ok(!/var\(--chart-\d\)|bg-primary\b(?!-)/.test(brief.body.replace(/default \(primary\)/g, '')), `${brief.slug}: primary is not for fills`)
  }
})

test('prompts: a brief only names type and spacing the theme has', () => {
  // `text-<name>` classes that are a color or an alignment, not a size.
  const notSizes = ['foreground', 'background', 'muted', 'primary', 'secondary', 'tertiary', 'destructive', 'success', 'sidebar', 'card', 'right', 'left', 'center']
  for (const theme of themes) {
    const { spec } = theme
    const steps = new Set(
      [...Object.values(spec.spacing), ...spec.strict.spacing.extra].map((value) => String(Number.parseFloat(value) / 4)),
    )
    const sizes = new Set(Object.keys(spec.typography))
    // A color of the theme's own has classes too, such as `text-blush-foreground`.
    const ownColors = Object.keys(spec.colors).map((color) => color.split('-')[0])
    for (const brief of [...theme.briefs, { slug: '_shared', body: theme.promptNotes }]) {
      const where = `${theme.slug}/${brief.slug}`
      for (const [, name] of brief.body.matchAll(/`[^`]*?\btext-([a-z0-9]+)\b/g)) {
        if (notSizes.includes(name ?? '') || ownColors.includes(name ?? '')) continue
        assert.ok(sizes.has(name ?? ''), `${where}: text-${name} is not in the type scale`)
      }
      for (const [, , step] of brief.body.matchAll(/\b(p[xytblr]?|m[xytblr]?|gap(?:-[xy])?|space-[xy])-(\d+(?:\.\d+)?)\b/g)) {
        assert.ok(steps.has(step ?? ''), `${where}: spacing step ${step} is not in the scale`)
      }
    }
  }
})

test('prompts: the rules answer what test builds kept asking', () => {
  for (const prompt of registry.prompts) {
    // An element that code focuses needs `focus:`, not `focus-visible:`.
    assert.ok(prompt.prompt.includes('focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring'), prompt.slug)
    // The starter's own mode key stays, and native controls are told the mode.
    assert.ok(prompt.prompt.includes('switches on the `d` key'), prompt.slug)
    assert.ok(prompt.prompt.includes('color-scheme: dark'), prompt.slug)
    // A font the theme's install added is not one to remove.
    assert.ok(prompt.prompt.includes("Keep every font import the theme's install added"), prompt.slug)
    // What happens to the Button's other rings is said in so many words.
    assert.ok(prompt.prompt.includes('delete them and put nothing in their place'), prompt.slug)
    assert.ok(!prompt.prompt.includes('go the same way'), prompt.slug)
    // A count reads right at one.
    assert.ok(prompt.prompt.includes('"1 set", not "1 sets"'), prompt.slug)
  }
})

test('prompts: the corners rule gives the theme\'s limit for full rounds', () => {
  for (const theme of registry.themes) {
    const full = theme.spec.strict.rounded.full
    for (const prompt of registry.prompts.filter((item) => item.theme === theme.slug)) {
      if (full !== undefined) {
        assert.ok(prompt.prompt.includes(`a full round on a box up to ${full} across`), prompt.slug)
      } else {
        assert.ok(prompt.prompt.includes('This theme has no full rounds'), prompt.slug)
        // A brief of such a theme does not ask for one.
        assert.ok(!/`[^`]*rounded-full[^`]*` (for|on) /.test(prompt.prompt.split('## Rules')[0] ?? ''), prompt.slug)
      }
    }
  }
})
