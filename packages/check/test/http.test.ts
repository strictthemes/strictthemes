import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { join } from 'node:path'
import { after, before, test } from 'node:test'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { handleThemesRequest, serveHttp } from '../src/http.ts'
import { SERVER_VERSION } from '../src/mcp.ts'

const cli = join(import.meta.dirname, '..', 'src', 'cli.ts')

const PROMPT = '# Build a product page with the Kiln theme\n\nYou are building one page in an existing project.\n'
const DESIGN = '---\nname: Kiln\n---\n\n## Overview\n\nClay paper and one terracotta accent.\n'

/** The text of a tool result. */
const textOf = (result: Record<string, unknown>): string =>
  (result.content as { type: string; text?: string }[]).map((part) => part.text ?? '').join('\n')

let site: Server
let hosted: Server
let endpoint: string
let client: Client
const logged: string[] = []

before(async () => {
  // A small copy of strictthemes.com for the server to read.
  site = createServer((request, response) => {
    const base = `http://127.0.0.1:${(site.address() as AddressInfo).port}`
    const files: Record<string, string> = {
      '/themes.json': JSON.stringify({
        version: 1,
        themes: [
          {
            slug: 'kiln',
            name: 'Kiln',
            description: 'A warm, hand-made theme for shops and studios.',
            fonts: { heading: 'Bricolage Grotesque', body: 'DM Sans', mono: 'DM Mono' },
            install: { command: `npx shadcn@latest add ${base}/r/kiln.json` },
            prompts: [{ slug: 'product', title: 'Product', description: 'the page of one piece in a small ceramics shop.' }],
          },
        ],
      }),
      '/themes/kiln/DESIGN.md': DESIGN,
      '/themes/kiln/prompts/product.md': PROMPT,
    }
    const file = files[request.url ?? '']
    response.writeHead(file === undefined ? 404 : 200)
    response.end(file ?? 'Not found')
  })
  await new Promise<void>((resolve) => site.listen(0, '127.0.0.1', resolve))
  process.env.STRICT_THEMES_URL = `http://127.0.0.1:${(site.address() as AddressInfo).port}`

  const started = await serveHttp({ port: 0, log: (line) => logged.push(line) })
  hosted = started.server
  endpoint = started.url
  client = new Client({ name: 'strict-themes-test', version: '0.0.0' })
  await client.connect(new StreamableHTTPClientTransport(new URL(endpoint)))
})

after(async () => {
  await client.close()
  await new Promise((resolve) => hosted.close(resolve))
  await new Promise((resolve) => site.close(resolve))
  delete process.env.STRICT_THEMES_URL
})

test('http: the hosted server names itself and has the four theme tools, and none that reads a project', async () => {
  assert.match(endpoint, /^http:\/\/127\.0\.0\.1:\d+\/mcp$/)
  assert.deepEqual(client.getServerVersion(), { name: 'strict-themes', version: SERVER_VERSION })
  assert.match(client.getInstructions() ?? '', /"list_themes"[\s\S]*"get_prompt"[\s\S]*cannot see the user's project[\s\S]*npx -y @strictthemes\/check mcp/)
  const { tools } = await client.listTools()
  assert.deepEqual(tools.map((tool) => tool.name).sort(), ['get_prompt', 'get_theme', 'list_prompts', 'list_themes'])
  for (const tool of tools) {
    assert.equal(tool.annotations?.readOnlyHint, true)
    // No tool takes a path on the machine the server runs on.
    assert.ok(!('dir' in (tool.inputSchema.properties ?? {})), tool.name)
  }
})

test('http: the tools answer over HTTP as they do over stdio', async () => {
  const themes = await client.callTool({ name: 'list_themes', arguments: {} })
  assert.match(textOf(themes), /^Strict has 1 theme\./)
  const theme = await client.callTool({ name: 'get_theme', arguments: { theme: 'kiln' } })
  assert.ok(textOf(theme).endsWith(`## DESIGN.md\n\n${DESIGN}`))
  const prompt = await client.callTool({ name: 'get_prompt', arguments: { theme: 'kiln', page: 'product' } })
  assert.equal(textOf(prompt), PROMPT)
  const unknown = await client.callTool({ name: 'get_prompt', arguments: { theme: 'kiln', page: 'checkout' } })
  assert.equal(unknown.isError, true)
  assert.equal(textOf(unknown), 'Kiln has no page prompt "checkout". Its page prompts are: product.')
})

/** One JSON-RPC call, as a client with no library would send it. */
const call = (body: unknown, headers: Record<string, string> = {}) =>
  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })

test('http: every request stands alone, with a plain JSON answer and no session', async () => {
  // No initialize first: a function that starts for each request has no memory of one.
  const response = await call({ jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name: 'list_prompts', arguments: { theme: 'kiln' } } })
  assert.equal(response.status, 200)
  assert.match(response.headers.get('content-type') ?? '', /^application\/json/)
  assert.equal(response.headers.get('mcp-session-id'), null)
  assert.equal(response.headers.get('access-control-allow-origin'), '*')
  const answer = (await response.json()) as { id: number; result: { content: { text: string }[] } }
  assert.equal(answer.id, 7)
  assert.match(answer.result.content[0]?.text ?? '', /^1 page prompt for Kiln\./)

  // A notification has no answer.
  const noted = await call({ jsonrpc: '2.0', method: 'notifications/initialized' })
  assert.equal(noted.status, 202)
  assert.equal(await noted.text(), '')
})

test('http: only POST reaches the tools', async () => {
  const get = await fetch(endpoint, { headers: { Accept: 'text/event-stream' } })
  assert.equal(get.status, 405)
  assert.equal(get.headers.get('allow'), 'POST, OPTIONS')
  assert.match(await get.text(), /takes POST requests only/)
  const del = await fetch(endpoint, { method: 'DELETE' })
  assert.equal(del.status, 405)

  const preflight = await fetch(endpoint, { method: 'OPTIONS', headers: { Origin: 'https://example.com', 'Access-Control-Request-Method': 'POST' } })
  assert.equal(preflight.status, 204)
  assert.equal(preflight.headers.get('access-control-allow-origin'), '*')
  assert.match(preflight.headers.get('access-control-allow-headers') ?? '', /Mcp-Protocol-Version/)
})

test('http: a bad request gets an error, not a crash', async () => {
  const notJson = await call('{ not json')
  assert.equal(notJson.status, 400)
  const tooLong = await call({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'get_theme', arguments: { theme: 'k'.repeat(70_000) } } })
  assert.equal(tooLong.status, 413)
  const wrongType = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain', Accept: 'application/json, text/event-stream' }, body: 'hello' })
  assert.equal(wrongType.status, 415)
  // The server still answers afterwards.
  const ok = await call({ jsonrpc: '2.0', id: 2, method: 'tools/list' })
  assert.equal(ok.status, 200)
  assert.equal(((await ok.json()) as { result: { tools: unknown[] } }).result.tools.length, 4)
})

test('http: the address says what it is, and nothing else is served', async () => {
  const root = endpoint.replace(/\/mcp$/, '/')
  const about = await fetch(root)
  assert.equal(about.status, 200)
  assert.match(await about.text(), /^strict-themes \d+\.\d+\.\d+: the Strict themes and their page prompts as an MCP server\.\nConnect an MCP client to \/mcp/)
  assert.equal((await fetch(`${root}themes.json`)).status, 404)
  assert.equal((await fetch(`${root}mcp/extra`)).status, 404)
  assert.equal((await fetch(root, { method: 'POST', body: '{}' })).status, 404)
})

test('http: the log has one line for each request, and nothing about who sent it', async () => {
  logged.length = 0
  await fetch(endpoint.replace(/\/mcp$/, '/'))
  await call({ jsonrpc: '2.0', id: 3, method: 'tools/list' })
  await fetch(endpoint)
  assert.equal(logged.length, 3)
  assert.match(logged[0] ?? '', /^GET \/ 200 \d+ms$/)
  assert.match(logged[1] ?? '', /^POST \/mcp 200 \d+ms$/)
  assert.match(logged[2] ?? '', /^GET \/mcp 405 \d+ms$/)
})

test('http: the handler works on a web Request alone, as a serverless function would call it', async () => {
  const response = await handleThemesRequest(
    new Request('https://mcp.example.com/any/path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'get_prompt', arguments: { theme: 'kiln', page: 'product' } } }),
    }),
  )
  assert.equal(response.status, 200)
  const answer = (await response.json()) as { result: { content: { text: string }[] } }
  assert.equal(answer.result.content[0]?.text, PROMPT)
})

test('http: the command starts the server and says where', async () => {
  const child = spawn(process.execPath, [cli, 'mcp', '--http', '--port', '0'], {
    env: { ...process.env },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  try {
    const line = await new Promise<string>((resolve, reject) => {
      let seen = ''
      child.stderr.on('data', (chunk: Buffer) => {
        seen += chunk.toString()
        if (seen.includes('\n')) resolve(seen.trim())
      })
      child.on('exit', (code) => reject(new Error(`exited with ${code}: ${seen}`)))
    })
    const url = /^The Strict themes are served as an MCP server at (http:\/\/127\.0\.0\.1:\d+\/mcp)$/.exec(line)?.[1]
    assert.ok(url, line)
    const other = new Client({ name: 'strict-themes-test', version: '0.0.0' })
    await other.connect(new StreamableHTTPClientTransport(new URL(url)))
    assert.equal((await other.listTools()).tools.length, 4)
    await other.close()
  } finally {
    child.kill()
  }

  const bad = spawn(process.execPath, [cli, 'mcp', '--http', '--port', 'eighty'], { stdio: ['ignore', 'pipe', 'pipe'] })
  const [code, message] = await new Promise<[number | null, string]>((resolve) => {
    let seen = ''
    bad.stderr.on('data', (chunk: Buffer) => (seen += chunk.toString()))
    bad.on('exit', (exit) => resolve([exit, seen]))
  })
  assert.equal(code, 2)
  assert.equal(message, '--port needs a number, and got "eighty".\n')
})
