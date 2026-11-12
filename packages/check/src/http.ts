import { createServer as createHttpServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import type { AddressInfo } from 'node:net'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createThemesServer, SERVER_VERSION, THEMES_SERVER_NAME } from './mcp.ts'

/** Where the hosted server answers MCP requests. */
export const MCP_PATH = '/mcp'

/** A request is a tool call with a slug or two in it. */
const MAX_BODY_BYTES = 64 * 1024

/** The server is public and reads nothing private, so a page in a browser may call it too. */
const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Protocol-Version, Mcp-Session-Id, Last-Event-ID',
  'Access-Control-Max-Age': '86400',
}

const rpcError = (status: number, message: string, headers: Record<string, string> = {}): Response =>
  new Response(JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message }, id: null }), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS, ...headers },
  })

/**
 * Answers one MCP request with the theme tools, over Streamable HTTP. It keeps no session: every request
 * gets a server of its own and a plain JSON answer, so it runs the same in a long-lived Node process and
 * in a function that starts for each request. It takes a web `Request` and gives a `Response`, which is
 * what Node, Netlify, Cloudflare Workers, Deno and Bun all speak.
 */
export async function handleThemesRequest(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
  // Without sessions there is no stream to open with GET and nothing to end with DELETE.
  if (request.method !== 'POST') return rpcError(405, 'This server takes POST requests only.', { Allow: 'POST, OPTIONS' })

  const server = createThemesServer()
  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true, maxRequestBodySize: MAX_BODY_BYTES })
  try {
    await server.connect(transport)
    const answer = await transport.handleRequest(request)
    // Read the answer to its end before the server is closed under it.
    const body = answer.status === 202 || answer.status === 204 ? null : await answer.text()
    const headers = new Headers(answer.headers)
    for (const [name, value] of Object.entries(CORS)) headers.set(name, value)
    return new Response(body, { status: answer.status, headers })
  } catch {
    return rpcError(500, 'The server could not answer this request.')
  } finally {
    await server.close().catch(() => undefined)
  }
}

const ABOUT = `${THEMES_SERVER_NAME} ${SERVER_VERSION}: the Strict themes and their page prompts as an MCP server.
Connect an MCP client to ${MCP_PATH} on this address (Streamable HTTP). The themes are at https://strictthemes.com/themes
`

/** A Node request as a web `Request`. A body over the limit is cut off, and the transport then refuses it. */
async function toWebRequest(request: IncomingMessage): Promise<Request> {
  const headers = new Headers()
  for (const [name, value] of Object.entries(request.headers)) {
    if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(', ') : value)
  }
  const url = `http://${request.headers.host ?? 'localhost'}${request.url ?? '/'}`
  if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'OPTIONS') return new Request(url, { method: request.method, headers })
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of request as AsyncIterable<Buffer>) {
    size += chunk.length
    if (size > MAX_BODY_BYTES + 1) break
    chunks.push(chunk)
  }
  return new Request(url, { method: request.method ?? 'POST', headers, body: Buffer.concat(chunks) })
}

async function answerNode(request: IncomingMessage, response: ServerResponse, log?: (line: string) => void): Promise<void> {
  const started = Date.now()
  const path = (request.url ?? '/').split('?')[0] ?? '/'
  let answer: Response
  if (path === MCP_PATH) {
    answer = await handleThemesRequest(await toWebRequest(request))
  } else if (path === '/' && (request.method === 'GET' || request.method === 'HEAD')) {
    answer = new Response(ABOUT, { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  } else {
    answer = new Response('Not found\n', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }
  const body = Buffer.from(await answer.arrayBuffer())
  response.writeHead(answer.status, { ...Object.fromEntries(answer.headers), 'Content-Length': String(body.length) })
  response.end(request.method === 'HEAD' ? undefined : body)
  // What was asked and how it went. Nothing about who asked.
  log?.(`${request.method} ${path.slice(0, 80)} ${answer.status} ${Date.now() - started}ms`)
}

export interface HttpOptions {
  /** Default: 8787. 0 takes any free port. */
  port?: number
  /** Default: 127.0.0.1, for a server that sits behind a proxy. 0.0.0.0 takes requests from other machines. */
  host?: string
  /** Gets one line for each request: its method, path, status and time. Default: nothing is logged. */
  log?: (line: string) => void
}

/** Serves the theme tools over HTTP until the process ends. Resolves once it listens, with the server and its address. */
export async function serveHttp(options: HttpOptions = {}): Promise<{ server: Server; url: string }> {
  const host = options.host ?? '127.0.0.1'
  const server = createHttpServer((request, response) => {
    answerNode(request, response, options.log).catch(() => {
      if (!response.headersSent) response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('The server could not answer this request.\n')
    })
  })
  // A tool call is answered in seconds. Do not let a slow or silent client hold a connection for long.
  server.requestTimeout = 30_000
  server.headersTimeout = 10_000
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(options.port ?? 8787, host, resolve)
  })
  const { port } = server.address() as AddressInfo
  return { server, url: `http://${host.includes(':') ? `[${host}]` : host}:${port}${MCP_PATH}` }
}
