# @strictthemes/mcp

The Strict themes and their page prompts as a hosted MCP server, for clients
that only take an address. It runs on Cloudflare Workers, at
`https://mcp.strictthemes.com/mcp`:

```json
{
  "mcpServers": {
    "strict-themes": { "type": "http", "url": "https://mcp.strictthemes.com/mcp" }
  }
}
```

It has the four theme tools of
[Strict Check's MCP server](../../packages/check#mcp-server): `list_themes`,
`get_theme`, `list_prompts` and `get_prompt`. It has no `rules` and no
`check`: those read a project's files, and a hosted server cannot see them.
For those, connect Strict Check on your own machine.

All of the server is `answerThemesSite` in
[packages/check/src/themes-http.ts](../../packages/check/src/themes-http.ts).
[src/worker.ts](src/worker.ts) only hands it requests, and
[wrangler.jsonc](wrangler.jsonc) says where the Worker is served.

| Address | What it answers |
|---|---|
| `POST /mcp` | MCP requests, over Streamable HTTP. No session: every request stands alone and gets a JSON answer |
| `GET /` | One line that says what the server is |
| anything else | 404 |

It needs no key and stores nothing. It reads `themes.json` and the themes'
files from strictthemes.com and keeps each for five minutes.

## Run it

```bash
npm run dev -w apps/mcp
```

That starts the Worker on this machine with Wrangler, which npm fetches on
first use. No Cloudflare account is needed for it.

```bash
npm run deploy -w apps/mcp
```

That puts it online. It needs someone signed in with Wrangler
(`npx wrangler login`) to the Cloudflare account that holds strictthemes.com.
The first deploy creates the Worker and the DNS record for
`mcp.strictthemes.com`.

## What was tested

On 2026-11-12 the Worker was run on a Mac with `wrangler dev`, reading the
live site. An MCP client connected over HTTP and called `get_theme` for all
eighteen themes and `get_prompt` for all ninety prompts; every answer was the
file as the site serves it.

It was deployed the same day, and the same run against
`https://mcp.strictthemes.com/mcp` gave the same result: 109 calls, none
refused, half of them answered within 133 ms. Claude Code connected to the
address as an HTTP server and called `list_themes`. Not tried: any other
client, and more than one caller at a time.
