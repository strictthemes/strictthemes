import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import {
  contrastRatio,
  deltaE,
  formatHex,
  lintSpec,
  palette,
  parseColor,
  parseSpec,
  tokensForMode,
  toDtcg,
  toNuxtUi,
  toShadcnCss,
  shadcnRadiusClasses,
  toShadcnTheme,
  toTailwindCss,
  type Finding,
} from '../src/index.ts'
import { mix } from '../src/color.ts'

const example = readFileSync(
  new URL('../examples/strict-one/DESIGN.md', import.meta.url),
  'utf8',
)

const rules = (findings: Finding[], severity?: string) =>
  findings.filter((f) => !severity || f.severity === severity).map((f) => f.rule)

const spec = (yaml: string, body = '') => `---\n${yaml}\n---\n${body}`

const rgb = (value: string) => {
  const parsed = parseColor(value)
  assert.ok(parsed, `expected ${value} to parse`)
  return parsed
}

test('color: parses hex, rgb, hsl and oklch to the same color', () => {
  for (const value of ['#f00', '#ff0000', '#ff0000ff', 'rgb(255 0 0)', 'rgba(255, 0, 0, 1)', 'hsl(0 100% 50%)', 'oklch(62.8% 0.2577 29.23)']) {
    assert.equal(formatHex(rgb(value)), '#ff0000', value)
  }
  assert.equal(parseColor('not a color'), null)
  assert.equal(parseColor('#12345'), null)
  assert.equal(rgb('#ff000080').a.toFixed(2), '0.50')
})

test('color: contrast and distance', () => {
  assert.equal(contrastRatio(rgb('#000'), rgb('#fff')), 21)
  assert.equal(contrastRatio(rgb('#777'), rgb('#fff')).toFixed(2), '4.48')
  assert.equal(deltaE(rgb('#1f3bff'), rgb('#1f3bff')), 0)
  assert.ok(deltaE(rgb('#1f3bff'), rgb('#1f3cff')) < 0.02)
  assert.ok(deltaE(rgb('#1f3bff'), rgb('#ff4f00')) > 0.2)
})

test('color: palette keeps the base color and runs light to dark', () => {
  const scale = palette(rgb('#1F3BFF'))
  assert.deepEqual(Object.keys(scale).map(Number), [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950])
  assert.ok(Object.values(scale).includes('#1f3bff'))
  const luminance = Object.values(scale).map((hex) => contrastRatio(rgb(hex), rgb('#000')))
  assert.deepEqual([...luminance].sort((a, b) => b - a), luminance)
})

test('example theme lints clean', () => {
  const result = lintSpec(example)
  assert.deepEqual(rules(result.findings, 'error'), [])
  assert.deepEqual(rules(result.findings, 'warning'), [])
  assert.equal(result.ok, true)
  assert.equal(result.spec.name, 'Strict One')
  assert.equal(result.spec.sections.length, 8)
  assert.equal(result.spec.strictDeclared, true)
})

test('references resolve, including whole-token and embedded ones', () => {
  const { spec: parsed } = parseSpec(example)
  const button = parsed.components['button-primary']
  assert.equal(button?.backgroundColor, '#1F3BFF')
  assert.equal(button?.padding, '8px 16px')
  assert.deepEqual(button?.typography, parsed.typography.label)
  assert.equal(parsed.rounded.none, '0')
  assert.equal(parsed.raw.components['button-primary']?.backgroundColor, '{colors.primary}')
})

test('modes override colors before references resolve', () => {
  const { spec: parsed } = parseSpec(example)
  const dark = tokensForMode(parsed, 'dark')
  assert.equal(dark.colors.background, '#0B0B0C')
  assert.equal(dark.colors.tertiary, '#FF4F00')
  assert.equal(dark.components.page?.backgroundColor, '#0B0B0C')
})

test('a plain DESIGN.md without a strict block gets default rules', () => {
  const result = lintSpec(spec('name: Plain\ncolors:\n  primary: "#000"\ntypography:\n  body:\n    fontSize: 16px'))
  assert.equal(result.ok, true)
  assert.equal(result.spec.strictDeclared, false)
  assert.equal(result.spec.strict.contrast, 'AA')
  assert.equal(result.spec.strict.colors.allow, 'tokens')
})

test('broken and circular references are errors', () => {
  const broken = lintSpec(spec('name: X\ncolors:\n  primary: "{colors.nope}"'))
  assert.ok(rules(broken.findings, 'error').includes('broken-ref'))
  assert.equal(broken.ok, false)

  const circular = lintSpec(spec('name: X\ncolors:\n  a: "{colors.b}"\n  b: "{colors.a}"'))
  assert.ok(rules(circular.findings, 'error').includes('circular-ref'))
})

test('structural errors: missing name, duplicate keys, duplicate sections, bad yaml', () => {
  assert.ok(rules(lintSpec('## Overview\nHello').findings, 'error').includes('missing-name'))
  assert.ok(rules(lintSpec(spec('name: X\nname: Y')).findings, 'error').includes('duplicate-key'))
  assert.ok(
    rules(lintSpec(spec('name: X', '## Colors\na\n## Colors\nb')).findings, 'error').includes('duplicate-section'),
  )
  assert.ok(rules(lintSpec(spec('name: [unclosed')).findings, 'error').includes('invalid-yaml'))
})

test('invalid values are errors', () => {
  const result = lintSpec(
    spec(
      [
        'name: X',
        'colors:',
        '  primary: "#12345"',
        'spacing:',
        '  md: wide',
        'typography:',
        '  body:',
        '    fontSize: 16',
        '    fontWeight: heavy',
      ].join('\n'),
    ),
  )
  const errors = result.findings.filter((f) => f.severity === 'error').map((f) => f.path)
  assert.deepEqual(errors.sort(), ['colors.primary', 'spacing.md', 'typography.body.fontSize', 'typography.body.fontWeight'])
})

test('contrast failures: warning for plain files, error when strict is declared', () => {
  const base = [
    'name: X',
    'colors:',
    '  primary: "#777777"',
    'typography:',
    '  body:',
    '    fontSize: 16px',
    'components:',
    '  button:',
    '    backgroundColor: "#ffffff"',
    '    textColor: "{colors.primary}"',
  ].join('\n')

  const plain = lintSpec(spec(base))
  assert.deepEqual(rules(plain.findings, 'warning'), ['contrast-ratio'])
  assert.equal(plain.ok, true)

  const strict = lintSpec(spec(`${base}\nstrict:\n  contrast: AA`))
  assert.deepEqual(rules(strict.findings, 'error'), ['contrast-ratio'])
  assert.equal(strict.ok, false)
})

test('contrast is checked in every mode', () => {
  const result = lintSpec(
    spec(
      [
        'name: X',
        'colors:',
        '  primary: "#000000"',
        '  background: "#ffffff"',
        'typography:',
        '  body:',
        '    fontSize: 16px',
        'components:',
        '  page:',
        '    backgroundColor: "{colors.background}"',
        '    textColor: "{colors.primary}"',
        'strict:',
        '  modes:',
        '    dark:',
        '      colors:',
        '        background: "#111111"',
      ].join('\n'),
    ),
  )
  const contrast = result.findings.filter((f) => f.rule === 'contrast-ratio')
  assert.equal(contrast.length, 1)
  assert.match(contrast[0]?.message ?? '', /^\[dark\]/)
})

test('strict block is validated', () => {
  const result = lintSpec(
    spec(
      [
        'name: X',
        'colors:',
        '  primary: "#000"',
        'typography:',
        '  body:',
        '    fontSize: 16px',
        'strict:',
        '  contrast: AAAA',
        '  colors:',
        '    tolerance: 5',
        '  tells:',
        '    made-up: warn',
        '    emoji-icons: loud',
        '  modes:',
        '    dark:',
        '      colors:',
        '        ghost: "#fff"',
      ].join('\n'),
    ),
  )
  const invalid = result.findings.filter((f) => f.rule === 'invalid-strict').map((f) => f.path)
  assert.deepEqual(invalid.sort(), ['strict.colors.tolerance', 'strict.contrast', 'strict.tells.emoji-icons'])
  assert.ok(rules(result.findings, 'warning').includes('unknown-tell'))
  assert.ok(rules(result.findings, 'warning').includes('unknown-mode-token'))
  assert.equal(result.spec.strict.contrast, 'AA')
})

test('warnings: unknown keys, section order, missing primary and typography', () => {
  const result = lintSpec(spec('name: X\nbanana: 1', '## Typography\na\n## Colors\nb\n## Brand & Style\nc'))
  const warnings = rules(result.findings, 'warning')
  for (const rule of ['unknown-key', 'section-order', 'missing-primary', 'missing-typography']) {
    assert.ok(warnings.includes(rule), rule)
  }
  assert.equal(result.spec.sections[2]?.canonical, 'Overview')
  assert.equal(result.ok, true)
})

test('tokens can live in yaml blocks inside sections; other yaml blocks are ignored', () => {
  const body = [
    '## Colors',
    '```yaml',
    'colors:',
    '  primary: "#123456"',
    '```',
    '## Components',
    '```yaml',
    'example: not-a-token',
    '```',
    '```css',
    '## not a heading',
    '```',
  ].join('\n')
  const result = lintSpec(spec('name: X\ntypography:\n  body:\n    fontSize: 16px', body))
  assert.equal(result.spec.colors.primary, '#123456')
  assert.equal(result.spec.sections.length, 2)
  assert.ok(!rules(result.findings).includes('unknown-key'))

  const duplicate = lintSpec(spec('name: X\ncolors:\n  primary: "#000"', body))
  assert.ok(rules(duplicate.findings, 'error').includes('duplicate-key'))
})

test('export: Tailwind v4 theme', () => {
  const css = toTailwindCss(parseSpec(example).spec)
  assert.match(css, /@theme \{/)
  assert.match(css, /--color-primary: #1F3BFF;/)
  assert.match(css, /--color-on-primary: #FFFFFF;/)
  assert.match(css, /--font-display: Archivo, ui-sans-serif, system-ui, sans-serif;/)
  assert.match(css, /--font-body: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;/)
  assert.match(css, /--font-label: "IBM Plex Mono", ui-monospace, monospace;/)
  assert.doesNotMatch(css, /--font-h1:/)
  assert.match(css, /--text-display: 56px;/)
  assert.match(css, /--text-display--line-height: 1\.05;/)
  assert.match(css, /--radius-sm: 2px;/)
  // Prefixed, so Tailwind's own max-w-lg and w-lg keep their sizes.
  assert.match(css, /--spacing-space-lg: 32px;/)
  assert.doesNotMatch(css, /--spacing-lg:/)
  assert.match(css, /\.dark \{\n {2}--color-primary: #8091FF;/)
})

test('export: shadcn registry theme', () => {
  const theme = toShadcnTheme(parseSpec(example).spec)
  assert.equal(theme.type, 'registry:theme')
  assert.equal(theme.name, 'strict-one')
  // shadcn reads the base radius from :root, so it must not go into @theme.
  assert.equal(theme.cssVars.light.radius, '4px')
  assert.equal(theme.cssVars.theme.radius, undefined)
  // shadcn's derived steps would be 2.4px and 3.2px; the spec's own values are written instead.
  assert.equal(theme.cssVars.theme['radius-sm'], '2px')
  assert.equal(theme.cssVars.theme['radius-md'], '4px')
  assert.equal(theme.cssVars.theme['radius-lg'], undefined)
  assert.equal(theme.cssVars.dark?.radius, undefined)
  assert.equal(theme.cssVars.theme['font-sans'], '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif')
  assert.equal(theme.cssVars.theme['font-mono'], '"IBM Plex Mono", ui-monospace, monospace')
  assert.equal(theme.cssVars.theme['font-heading'], 'Archivo, ui-sans-serif, system-ui, sans-serif')
  assert.match(theme.docs ?? '', /Archivo, IBM Plex Sans, IBM Plex Mono/)
  // The type scale installs as text-<token> utilities.
  assert.equal(theme.cssVars.theme['text-display'], '56px')
  assert.equal(theme.cssVars.theme['text-display--line-height'], '1.05')
  assert.equal(theme.cssVars.theme['text-label--letter-spacing'], '0.08em')
  assert.equal(theme.cssVars.light.primary, '#1F3BFF')
  assert.equal(theme.cssVars.light['primary-foreground'], '#FFFFFF')
  // `accent` paints hover states in shadcn, so the brand's tertiary color stays out of it.
  assert.notEqual(theme.cssVars.light.accent, '#FF4F00')
  assert.equal(theme.cssVars.light['accent-foreground'], '#111111')
  assert.equal(theme.cssVars.light['sidebar-primary'], '#1F3BFF')
  assert.equal(theme.cssVars.light.sidebar, theme.cssVars.light.card)
  assert.equal(new Set([1, 2, 3, 4, 5].map((n) => theme.cssVars.light[`chart-${n}`])).size, 5)
  assert.equal(theme.cssVars.light.destructive, '#C62828')
  assert.equal(theme.cssVars.dark?.background, '#0B0B0C')
  assert.notEqual(theme.cssVars.dark?.accent, '#FF4F00')
  assert.equal(theme.cssVars.dark?.['accent-foreground'], '#F5F5F4')
  assert.equal(theme.cssVars.dark?.['sidebar-primary'], '#8091FF')

  for (const vars of [theme.cssVars.light, theme.cssVars.dark ?? {}]) {
    // A highlighted menu item has to stand out from the popover behind it.
    assert.ok(contrastRatio(rgb(vars.accent ?? ''), rgb(vars.popover ?? '')) >= 1.12, 'accent vs popover')
    for (const pair of ['primary', 'secondary', 'accent', 'card', 'popover']) {
      const ratio = contrastRatio(rgb(vars[pair] ?? ''), rgb(vars[`${pair}-foreground`] ?? ''))
      assert.ok(ratio >= 4.5, `${pair}: ${ratio.toFixed(2)}`)
    }
  }

  const css = toShadcnCss(parseSpec(example).spec)
  assert.match(css, /:root \{[^}]*--radius: 4px;/)
  assert.match(css, /\.dark \{/)
})

test('export: shadcn gives a corner larger than the base the next step up', () => {
  const { spec: parsed } = parseSpec(
    spec('name: Round\ncolors:\n  primary: "#0000ff"\n  success: "#1E7B4B"\nrounded:\n  sm: 3px\n  md: 6px\n  lg: 12px'),
  )
  // shadcn's `rounded-lg` is its base radius, so the spec's `lg` becomes `rounded-xl`.
  assert.deepEqual(shadcnRadiusClasses(parsed), { sm: 'sm', md: 'md', lg: 'xl' })
  const theme = toShadcnTheme(parsed)
  assert.equal(theme.cssVars.light.radius, '6px')
  assert.equal(theme.cssVars.theme['radius-sm'], '3px')
  assert.equal(theme.cssVars.theme['radius-md'], '6px')
  // Stock buttons and inputs use rounded-lg: it stays at the base.
  assert.equal(theme.cssVars.theme['radius-lg'], undefined)
  // Without this, rounded-xl would be 1.4 times the base: 8.4px, a value the spec never named.
  assert.equal(theme.cssVars.theme['radius-xl'], '12px')

  // A state color shadcn has no variable for gets its own, so `text-success` exists.
  assert.equal(theme.cssVars.light.success, '#1E7B4B')
  assert.equal(theme.cssVars.theme['color-success'], 'var(--success)')
  assert.equal(theme.cssVars.light.tertiary, undefined)

  // So does a color with a name of the spec's own, in every mode.
  const glazed = toShadcnTheme(
    parseSpec(
      spec(
        'name: Glaze\ncolors:\n  primary: "#0000ff"\n  on-primary: "#ffffff"\n  glaze-pale: "#F2EADC"\nstrict:\n  version: 1\n  modes:\n    dark:\n      colors:\n        primary: "#8888ff"',
      ),
    ).spec,
  )
  assert.equal(glazed.cssVars.light['glaze-pale'], '#F2EADC')
  assert.equal(glazed.cssVars.dark?.['glaze-pale'], '#F2EADC')
  assert.equal(glazed.cssVars.theme['color-glaze-pale'], 'var(--glaze-pale)')
  // A name that only gives another color's text is not a color of its own.
  assert.equal(glazed.cssVars.theme['color-on-primary'], undefined)

  // A spec with nothing above the base is unchanged.
  assert.deepEqual(shadcnRadiusClasses(parseSpec(example).spec), { sm: 'sm', md: 'md' })
})

test('export: shadcn uses explicit accent, chart and sidebar tokens', () => {
  const { spec: parsed } = parseSpec(
    spec('name: Named\ncolors:\n  primary: "#0000ff"\n  accent: "#eeeeff"\n  chart-1: "#ff0000"\n  sidebar: "#fafafa"\ntypography:\n  body:\n    fontFamily: Georgia, serif\n    fontSize: 16px'),
  )
  const theme = toShadcnTheme(parsed)
  assert.equal(theme.cssVars.light.accent, '#eeeeff')
  assert.equal(theme.cssVars.light['chart-1'], '#ff0000')
  assert.equal(theme.cssVars.light.sidebar, '#fafafa')
  // A stack that already ends in a generic family is left alone.
  assert.equal(theme.cssVars.theme['font-sans'], 'Georgia, serif')
  assert.equal(theme.cssVars.theme['text-body'], '16px')

  // A token named like a Tailwind size must not resize existing components.
  const clash = toShadcnTheme(parseSpec(spec('name: Clash\ntypography:\n  sm:\n    fontSize: 20px\n  lead:\n    fontSize: 22px')).spec)
  assert.equal(clash.cssVars.theme['text-sm'], undefined)
  assert.equal(clash.cssVars.theme['text-lead'], '22px')
  assert.equal(theme.cssVars.theme['font-heading'], undefined)
})

test('export: shadcn muted text stays readable', () => {
  // The spec's neutral is used when it passes on the page and on cards.
  const strictOne = toShadcnTheme(parseSpec(example).spec)
  assert.equal(strictOne.cssVars.light['muted-foreground'], '#6B6B6B')
  assert.equal(strictOne.cssVars.dark?.['muted-foreground'], '#A3A3A0')

  // A neutral that is too light is ignored, and the mixed grey is darkened until it passes.
  const tinted = toShadcnTheme(
    parseSpec(spec('name: Tinted\ncolors:\n  background: "#F3F6F8"\n  foreground: "#16242E"\n  surface: "#E4EAEE"\n  neutral: "#C9D1D6"')).spec,
  )
  const muted = tinted.cssVars.light['muted-foreground'] ?? ''
  assert.notEqual(muted, '#C9D1D6')
  assert.ok(contrastRatio(rgb(muted), rgb('#F3F6F8')) >= 4.5)
  assert.ok(contrastRatio(rgb(muted), rgb('#E4EAEE')) >= 4.5)
})

test('export: shadcn derives missing semantic colors', () => {
  const { spec: parsed } = parseSpec(spec('name: Bare\ncolors:\n  primary: "#0000ff"'))
  const theme = toShadcnTheme(parsed)
  assert.equal(theme.cssVars.light.background, '#ffffff')
  assert.equal(theme.cssVars.light.foreground, '#000000')
  assert.equal(theme.cssVars.light['primary-foreground'], '#ffffff')
  assert.equal(theme.cssVars.dark, undefined)
})

test('export: Nuxt UI palettes and app config', () => {
  const theme = toNuxtUi(parseSpec(example).spec)
  assert.deepEqual(theme.colors, {
    primary: 'strict-one-primary',
    secondary: 'strict-one-secondary',
    error: 'strict-one-error',
    neutral: 'strict-one-neutral',
  })
  assert.match(theme.css, /@theme static \{/)
  assert.match(theme.css, /--color-strict-one-primary-\d+: #1f3bff;/)
  assert.equal((theme.css.match(/--color-strict-one-primary-/g) ?? []).length, 11)
  assert.match(theme.css, /:root \{\n {2}--ui-primary: #1F3BFF;/)
  // Buttons use rounded-md, 1.5 times --ui-radius, so they come out at the spec's 4px.
  assert.match(theme.css, /--ui-radius: 2\.6667px;/)
  assert.match(theme.css, /\.dark \{\n {2}--ui-primary: #8091FF;/)
  assert.doesNotMatch(theme.css, /--ui-neutral/)
  assert.match(theme.css, /--font-mono: "IBM Plex Mono", ui-monospace, monospace;/)
  assert.match(theme.appConfig, /primary: 'strict-one-primary',/)

  // Page colors come from the spec, not from Nuxt UI's neutral palette.
  const [light = '', darkCss = ''] = theme.css.split('.dark {')
  assert.match(light, /--ui-bg: #FFFFFF;/)
  assert.match(light, /--ui-text: #111111;/)
  assert.match(light, /--ui-border: #E2E2E0;/)
  assert.match(light, /--ui-bg-muted: #F5F5F4;/)
  assert.match(darkCss, /--ui-bg: #0B0B0C;/)
  assert.match(darkCss, /--ui-text: #F5F5F4;/)
  assert.match(darkCss, /--ui-text-inverted: #0B0B0C;/)
  assert.doesNotMatch(theme.css, /:root:not\(\.dark\)/)

  // Hover states use `elevated` at half opacity: that has to stay visible in both modes.
  for (const [css, bg] of [[light, '#FFFFFF'], [darkCss, '#0B0B0C']] as const) {
    const elevated = /--ui-bg-elevated: (#[0-9a-f]{6});/i.exec(css)?.[1] ?? ''
    assert.ok(contrastRatio(mix(rgb(bg), rgb(elevated), 0.5), rgb(bg)) >= 1.09, `elevated on ${bg}`)
  }
})

test('export: Nuxt UI keeps the app\'s dark mode when the spec has none', () => {
  const lightOnly = toNuxtUi(
    parseSpec(spec('name: Light\ncolors:\n  primary: "#0000ff"\n  background: "#fffdf8"\n  foreground: "#222222"\nrounded:\n  md: 0')).spec,
  )
  assert.match(lightOnly.css, /:root:not\(\.dark\) \{\n {2}--ui-bg: #fffdf8;/)
  assert.doesNotMatch(lightOnly.css, /\.dark \{/)
  assert.match(lightOnly.css, /--ui-radius: 0px;/)

  // No page colors in the spec: Nuxt UI's own are left alone.
  const bare = toNuxtUi(parseSpec(spec('name: Bare\ncolors:\n  primary: "#0000ff"')).spec)
  assert.doesNotMatch(bare.css, /--ui-bg/)
  assert.match(bare.css, /--ui-primary: #0000ff;/)
})

test('export: DTCG tokens', () => {
  const tokens = toDtcg(parseSpec(example).spec) as {
    color: Record<string, { $type: string; $value: string }>
    typography: Record<string, { $value: { fontFamily: string } }>
  }
  assert.deepEqual(tokens.color.primary, { $type: 'color', $value: '#1F3BFF' })
  assert.equal(tokens.typography.body?.$value.fontFamily, 'IBM Plex Sans')
})
