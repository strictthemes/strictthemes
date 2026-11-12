import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { after, before, test } from 'node:test'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { lintSpec } from '@strictthemes/spec'
import { describeRules, rulesFor } from '../src/index.ts'
import { SERVER_VERSION } from '../src/mcp.ts'

const cli = join(import.meta.dirname, '..', 'src', 'cli.ts')
const specSource = readFileSync(join(import.meta.dirname, '..', '..', 'spec', 'examples', 'strict-one', 'DESIGN.md'), 'utf8')

function project(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), 'strict-check-mcp-'))
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, path)), { recursive: true })
    writeFileSync(join(dir, path), content)
  }
  return dir
}

const PAGE = (body: string) => `<!doctype html><html><head><meta name="viewport" content="width=device-width"><style>
  :root { --background: #FFFFFF; --foreground: #111111; }
  .dark { --background: #0B0B0C; --foreground: #F5F5F4; }
  html { background: var(--background); color: var(--foreground); font: 400 16px "IBM Plex Sans", sans-serif; }
  body { margin: 0; padding: 16px; }
</style></head><body>${body}</body></html>`

const clean = project({
  'DESIGN.md': specSource,
  'src/App.tsx': '<main className="p-4 text-body rounded-sm" />',
  'dist/index.html': PAGE('<p style="margin:0">On the theme.</p>'),
})
const broken = project({
  'DESIGN.md': specSource,
  'src/App.tsx': '<main className="p-3 text-sm bg-blue-500" />',
  'dist/index.html': PAGE('<p style="margin:0;font-size:13px">Off the theme.</p>'),
})

/** The text of a tool result. */
const textOf = (result: Record<string, unknown>): string =>
  (result.content as { type: string; text?: string }[]).map((part) => part.text ?? '').join('\n')

let client: Client

before(async () => {
  // The real thing: the command an agent's client would start, talking over stdin and stdout.
  client = new Client({ name: 'strict-check-test', version: '0.0.0' })
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [cli, 'mcp'], stderr: 'pipe' }))
})

after(async () => {
  await client.close()
  rmSync(clean, { recursive: true, force: true })
  rmSync(broken, { recursive: true, force: true })
})

test('mcp: the server names itself, explains itself and lists six read-only tools', async () => {
  assert.equal(client.getServerVersion()?.name, 'strict-check')
  assert.match(client.getInstructions() ?? '', /Call "rules" before[\s\S]*Call "check" after[\s\S]*"list_themes"[\s\S]*"get_prompt"/)
  const { tools } = await client.listTools()
  assert.deepEqual(tools.map((tool) => tool.name).sort(), ['check', 'get_prompt', 'get_theme', 'list_prompts', 'list_themes', 'rules'])
  assert.ok(tools.every((tool) => tool.outputSchema === undefined))
  for (const tool of tools) {
    assert.ok((tool.description ?? '').length > 80, `${tool.name} needs a description an agent can act on`)
    assert.equal(tool.annotations?.readOnlyHint, true)
  }
  const required = Object.fromEntries(tools.map((tool) => [tool.name, tool.inputSchema.required ?? []]))
  assert.deepEqual(required, {
    rules: ['dir'],
    check: ['dir'],
    list_themes: [],
    get_theme: ['theme'],
    list_prompts: [],
    get_prompt: ['theme', 'page'],
  })
  // The two that work on the project's own files reach nothing else; the four theme tools read strictthemes.com.
  const open = Object.fromEntries(tools.map((tool) => [tool.name, tool.annotations?.openWorldHint]))
  assert.deepEqual(open, { rules: false, check: false, list_themes: true, get_theme: true, list_prompts: true, get_prompt: true })
})

test('mcp: rules returns what the theme allows', async () => {
  const result = await client.callTool({ name: 'rules', arguments: { dir: clean } })
  assert.notEqual(result.isError, true)
  const text = textOf(result)
  assert.match(text, /^Strict One: what the theme allows/)
  assert.match(text, /primary\s+#1F3BFF \/ #8091FF/)
  assert.match(text, /Spacing \(padding, margin, gap\): 0px, 1px, 4px, 8px, 16px, 32px, 64px\./)
  assert.match(text, /As Tailwind steps: 0, px, 1, 2, 4, 8, 16\./)
  assert.match(text, /Classes: text-display, text-h1, text-h2, text-body, text-label\./)
  assert.match(text, /Corners: none 0px, sm 2px, md 4px\. Classes: rounded-none 0px, rounded-sm 2px, rounded-md 4px\./)
  assert.match(text, /emoji as icons or bullets \(error\)/)
  // The same text the command prints with --rules.
  const spec = lintSpec(specSource).spec
  assert.equal(text, describeRules(spec, rulesFor(spec)))
  const printed = spawnSync(process.execPath, [cli, clean, '--rules'], { encoding: 'utf8' })
  assert.equal(printed.status, 0)
  assert.equal(printed.stdout, text)
})

test('mcp: check on source alone reports findings and says the pages were not measured', async () => {
  const passed = await client.callTool({ name: 'check', arguments: { dir: clean } })
  assert.notEqual(passed.isError, true)
  assert.match(textOf(passed), /Rendered pages: not checked/)
  assert.match(textOf(passed), /^Passed: 100% of 3 measured values/m)
  // The whole answer is in the text. Claude Code shows the model structured content in place of the
  // text when a tool returns both, so the tool must not return a summary object beside the report.
  assert.equal(passed.structuredContent, undefined)

  const failed = await client.callTool({ name: 'check', arguments: { dir: broken } })
  // A check that finds problems is a result, not a tool error.
  assert.notEqual(failed.isError, true)
  assert.equal(failed.structuredContent, undefined)
  assert.match(textOf(failed), /^Failed: 0% of 3 measured values follow the theme\. 3 errors, 0 warnings\.$/m)
  assert.match(textOf(failed), /`p-3` is 12px, which is not on the spacing scale/)
  assert.match(textOf(failed), /src\/App\.tsx:1/)
})

test('mcp: check with dist measures the built pages', async (t) => {
  const result = await client.callTool({ name: 'check', arguments: { dir: broken, dist: 'dist', modes: ['light'], widths: [1280] } })
  if (result.isError === true && /No browser/.test(textOf(result))) return t.skip('no Chromium-based browser on this machine')
  assert.notEqual(result.isError, true)
  assert.match(textOf(result), /^Rendered pages: \/ in light mode at 1280px, also on hover and focus$/m)
  assert.match(textOf(result), /4 errors, 0 warnings\.$/m)
  assert.match(textOf(result), /Text is 13px, which is not in the type scale/)

  const passed = await client.callTool({ name: 'check', arguments: { dir: clean, dist: 'dist' } })
  assert.match(textOf(passed), /^Passed: 100% of /m)
})

test('mcp: a check that cannot run is a tool error with a reason', async () => {
  const cases: [Record<string, unknown>, RegExp][] = [
    [{ dir: join(clean, 'missing') }, /Cannot find the folder/],
    [{ dir: clean, spec: 'nope.md' }, /Cannot find the spec/],
    [{ dir: clean, dist: 'build' }, /has no index\.html\. Build the project first\./],
    [{ dir: clean, dist: 'dist', url: 'http://localhost:1' }, /not both/],
    [{ dir: clean, url: 'file:///etc/hosts' }, /not an http or https address/],
    [{ dir: clean, dist: 'dist', modes: ['sepia'] }, /has no "sepia" mode/],
  ]
  for (const [args, reason] of cases) {
    const result = await client.callTool({ name: 'check', arguments: args })
    assert.equal(result.isError, true, JSON.stringify(args))
    assert.match(textOf(result), reason)
  }
  const rules = await client.callTool({ name: 'rules', arguments: { dir: join(clean, 'missing') } })
  assert.equal(rules.isError, true)
})

test('the MCP server names the version of the package', () => {
  const manifest = JSON.parse(readFileSync(join(import.meta.dirname, '..', 'package.json'), 'utf8')) as { version: string }
  assert.equal(SERVER_VERSION, manifest.version)
})
