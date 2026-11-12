// mcp.strictthemes.com: the four theme tools of Strict Check's MCP server, hosted for clients that only
// take an address. All of it is the handler from @strictthemes/check; this file only hands it requests.
import { answerThemesSite } from '../../../packages/check/src/themes-http.ts'

export default {
  fetch: (request: Request): Promise<Response> => answerThemesSite(request),
}
