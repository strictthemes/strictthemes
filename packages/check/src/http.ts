// The hosted server as a Node process: `strict-check mcp --http`.
import { createServer as createHttpServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import type { AddressInfo } from 'node:net'
import { answerThemesSite, MAX_BODY_BYTES, MCP_PATH } from './themes-http.ts'

export { handleThemesRequest, MCP_PATH } from './themes-http.ts'

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
  const answer = await answerThemesSite(await toWebRequest(request))
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
