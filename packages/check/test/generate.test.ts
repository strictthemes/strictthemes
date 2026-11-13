import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { lintSpec } from '@strictthemes/spec'
import { checkRendered, generateSpec, measurePages, rulesFor, serveStatic } from '../src/index.ts'

const PAGE = `<!doctype html>
<html><head><meta charset="utf-8"><title>Shop</title><style>
  :root { --page: #FAF7F2; --ink: #1C1917; --quiet: #6B6258; --card: #F1ECE4; --line: #D9D0C3; --brand: #B4371A; --on-brand: #FFFFFF; }
  html.dark { --page: #171412; --ink: #F5F0E8; --quiet: #A89F94; --card: #221E1B; --line: #3A342F; --brand: #E8704F; --on-brand: #1C1917; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: var(--page); color: var(--ink); font: 400 16px/1.5 Georgia, serif; padding: 32px; }
  h1 { font: 700 40px/1.1 Georgia, serif; letter-spacing: -0.8px; margin-bottom: 16px; }
  h2 { font: 700 24px/1.25 Georgia, serif; margin-bottom: 8px; }
  p { margin-bottom: 16px; }
  small { display: block; font: 400 12px/1.4 Georgia, serif; color: var(--quiet); }
  .cards { display: flex; gap: 24px; margin-bottom: 32px; }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 24px; width: 300px; }
  a.button { display: inline-block; background: var(--brand); color: var(--on-brand); border-radius: 4px; padding: 8px 16px; text-decoration: none; }
  .tag { display: inline-block; border: 1px solid var(--line); border-radius: 999px; padding: 4px 8px; font-size: 12px; line-height: 1.4; color: var(--quiet); }
</style></head><body>
  <h1>Pots for a kitchen</h1>
  <p>Thrown by hand and fired twice.</p><p>Each one is a little different.</p><p>We ship on Mondays.</p>
  <div class="cards">
    <div class="card"><h2>Bowl</h2><p>Stoneware, 14 cm.</p><small>In stock</small><a class="button" href="#">Add to basket</a></div>
    <div class="card"><h2>Jug</h2><p>Stoneware, one litre.</p><small>Two left</small><a class="button" href="#">Add to basket</a></div>
    <div class="card"><h2>Plate</h2><p>Stoneware, 26 cm.</p><small>In stock</small><a class="button" href="#">Add to basket</a></div>
  </div>
  <span class="tag">New</span> <span class="tag">Seconds</span>
</body></html>`

function site(): string {
  const dir = mkdtempSync(join(tmpdir(), 'strict-generate-'))
  writeFileSync(join(dir, 'index.html'), PAGE)
  return dir
}

test('generate: a measured page becomes a spec that lints, and the page follows it', async (t) => {
  const dir = site()
  const server = await serveStatic(dir)
  try {
    let measured
    try {
      measured = await measurePages(server.url)
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('No browser')) return t.skip('no browser on this machine')
      throw error
    }
    assert.equal(measured.length, 1)
    assert.ok(measured[0]?.dark, 'the page has a dark mode behind the class `dark`')

    const { source, notes } = generateSpec(measured, { name: 'Pots', source: 'https://pots.example', date: '2026-11-12' })
    const lint = lintSpec(source)
    assert.deepEqual(lint.findings.filter((finding) => finding.severity !== 'info'), [], source)
    const { spec } = lint

    // Each color has the role the page gives it.
    assert.equal(spec.colors.background, '#FAF7F2')
    assert.equal(spec.colors.foreground, '#1C1917')
    assert.equal(spec.colors.primary, '#B4371A')
    assert.equal(spec.colors['on-primary'], '#FFFFFF')
    assert.equal(spec.colors.surface, '#F1ECE4')
    assert.equal(spec.colors.border, '#D9D0C3')
    assert.equal(spec.colors.neutral, '#6B6258')
    assert.deepEqual(spec.strict?.modes.dark?.colors, {
      background: '#171412',
      primary: '#E8704F',
      'on-primary': '#1C1917',
      neutral: '#A89F94',
      surface: '#221E1B',
      foreground: '#F5F0E8',
      border: '#3A342F',
    })

    assert.deepEqual(
      Object.fromEntries(Object.entries(spec.typography).map(([name, token]) => [name, token.fontSize])),
      { h1: '40px', h2: '24px', body: '16px', label: '12px' },
    )
    assert.equal(spec.typography.h1?.fontFamily, 'Georgia')
    assert.equal(spec.typography.h1?.fontWeight, 700)
    assert.equal(spec.typography.h1?.lineHeight, 1.1)
    assert.equal(spec.typography.h1?.letterSpacing, '-0.02em')
    assert.deepEqual(Object.values(spec.spacing), ['4px', '8px', '16px', '24px', '32px'])
    assert.deepEqual(spec.rounded, { sm: '4px', md: '8px' })
    assert.ok((spec.strict?.rounded.full ?? '') !== '', 'the pill tags make full rounds allowed')
    assert.ok(spec.components['button-primary'] && spec.components.card && spec.components.page)
    assert.match(source, /Measured from https:\/\/pots\.example on 2026-11-12/)
    assert.deepEqual(notes, [])

    // The page it was measured from follows the spec, in both modes and on hover and focus.
    const result = await checkRendered(server.url, rulesFor(spec), { widths: [1280] })
    assert.deepEqual(result.findings.map((finding) => finding.message), [])
  } finally {
    await server.close()
    rmSync(dir, { recursive: true, force: true })
  }
})

test('generate: the command writes the file, and does not replace one without --force', async (t) => {
  const dir = site()
  const server = await serveStatic(dir)
  const out = join(dir, 'DESIGN.md')
  const run = (...args: string[]) =>
    new Promise<{ status: number | null; stdout: string; stderr: string }>((done) => {
      // Not spawnSync: the server it reads from runs in this process.
      import('node:child_process').then(({ execFile }) =>
        execFile(process.execPath, ['src/cli.ts', 'generate', ...args], { cwd: new URL('..', import.meta.url) }, (error, stdout, stderr) =>
          done({ status: error ? (typeof error.code === 'number' ? error.code : 1) : 0, stdout, stderr }),
        ),
      )
    })
  try {
    const first = await run(server.url, '--out', out, '--name', 'Pots')
    if (/No browser/.test(first.stderr)) return t.skip('no browser on this machine')
    assert.equal(first.status, 0, first.stderr)
    assert.ok(existsSync(out))
    assert.match(readFileSync(out, 'utf8'), /^name: "Pots"$/m)
    assert.match(first.stdout, /100% of \d+ measured values follow it/)
    assert.match(first.stdout, /with a dark mode/)

    // With --skill-out, a skill that names the spec and its tokens is written too.
    const skill = join(dir, 'skill', 'SKILL.md')
    const withSkill = await run(server.url, '--out', out, '--name', 'Pots & Pans', '--skill-out', skill, '--force')
    assert.equal(withSkill.status, 0, withSkill.stderr)
    const text = readFileSync(skill, 'utf8')
    assert.match(text, /^---\nname: pots-pans-design\ndescription: "/)
    assert.match(text, /- \*\*primary:\*\* #B4371A \(#E8704F in dark mode\)/)
    assert.match(text, /- \*\*h1:\*\* 40px, Georgia, weight 700, line height 1\.1, letter spacing -0\.02em/)
    assert.match(text, /\*\*Spacing:\*\* xs 4px, sm 8px, md 16px, lg 24px, xl 32px/)
    assert.match(text, /in light and in dark mode/)
    assert.match(text, /npx @strictthemes\/spec export .*DESIGN\.md --format tailwind/)
    assert.match(text, /Hover and focus are checked too/)
    assert.match(text, /npx @strictthemes\/check --spec .*DESIGN\.md --dist dist/)
    assert.equal((await run(server.url, '--out', out, '--skill-out', skill)).status, 2)

    const second = await run(server.url, '--out', join(dir, 'other.md'), '--force')
    assert.equal(second.status, 0)
    const third = await run(server.url, '--out', out)
    assert.equal(third.status, 2)
    assert.match(third.stderr, /is there already/)
    assert.equal((await run(server.url, '--out', out, '--force')).status, 0)

    assert.equal((await run()).status, 2)
    assert.equal(spawnSync(process.execPath, ['src/cli.ts', 'generate', '--help'], { cwd: new URL('..', import.meta.url) }).status, 0)
  } finally {
    await server.close()
    rmSync(dir, { recursive: true, force: true })
  }
})
