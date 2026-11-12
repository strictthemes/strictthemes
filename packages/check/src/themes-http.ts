// The hosted server as a function from a web Request to a Response. Nothing here needs Node.
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createThemesServer, THEMES_SERVER_NAME } from './themes-server.ts'
import { SERVER_VERSION } from './version.ts'

/** Where the hosted server answers MCP requests. */
export const MCP_PATH = '/mcp'

/** A request is a tool call with a slug or two in it. */
export const MAX_BODY_BYTES = 64 * 1024

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

const plain = (status: number, body: string): Response => new Response(body, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })

/**
 * The whole address of the hosted server: `/mcp` answers MCP requests, `/` says in one line what the
 * server is, and every other path is a 404.
 */
export async function answerThemesSite(request: Request): Promise<Response> {
  const path = new URL(request.url).pathname
  if (path === MCP_PATH) return handleThemesRequest(request)
  if (path === '/' && (request.method === 'GET' || request.method === 'HEAD')) return plain(200, ABOUT)
  return plain(404, 'Not found\n')
}
