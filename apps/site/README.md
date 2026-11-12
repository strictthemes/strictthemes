# The Strict site

strictthemes.com, built with Astro. It is static: every page and every registry
file is generated at build time from [`@strictthemes/themes`](../../packages/themes)
and [`@strictthemes/spec`](../../packages/spec).

| Path | What it is |
|---|---|
| `/` | Home: what Strict is, a card for each of the eighteen themes, the roadmap |
| `/themes`, `/themes/<slug>` | The catalog and one page per theme. A theme page wears its own theme |
| `/themes/<slug>/<file>` | A theme's exports: `DESIGN.md`, `tailwind.css`, `shadcn.css`, `nuxt-ui.css`, `app.config.ts`, `tokens.json` |
| `/themes/<slug>/prompts/<page>.md` | A theme's page prompts, as Markdown to paste into a coding agent |
| `/themes/<slug>/prompts/<page>/` | The preview of a page prompt: the page built from it, in a frame, with switches for screen width and color mode |
| `/themes/<slug>/prompts/<page>/build/` | That built page on its own |
| `/r/<name>.json` | The shadcn registry: theme items, font items and `registry.json` |
| `/spec` | The spec format, rendered from `packages/spec/SPEC.md` |
| `/llms.txt` | A plain-text map of the site for coding agents, with a link to this repo |
| `/sitemap.xml`, `/robots.txt` | The map for search engines, and the file that points them to it |

## Develop

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm test
```

`npm test` builds the site and checks the output. Build `@strictthemes/spec` first
(`npm run build` at the repo root does both in order).

## How themes reach the page

- [src/lib/themes.ts](src/lib/themes.ts) loads every `DESIGN.md` and builds the registry.
- The layout writes each theme's variables scoped to `[data-theme="<slug>"]`, with
  dark values under `[data-mode="dark"]`. `:root` gets Strict One, the theme the
  site itself uses.
- [ThemePreview.tsx](src/components/ThemePreview.tsx) renders stock shadcn
  components inside such an element. Colors, corners and fonts resolve where
  they are used, so several themes can sit on one page.

The site is light only. Previews switch between light and dark on their own.

## Example pages

Every page prompt has an example: the page built from it, kept as it came out
in `examples/<theme>/<page>/`.

| File | What it is |
|---|---|
| `index.html`, `src/`, `public/` | The page's Vite + shadcn project, without its config and `node_modules` |
| `components.json` | Marks the folder as a shadcn project for Strict Check |
| `example.json` | When it was built, what Strict Check measured, and `prompt`: a fingerprint of the prompt text it was built from |

[scripts/build-examples.ts](scripts/build-examples.ts) runs after `astro build`
and builds each example on its own into
`dist/themes/<theme>/prompts/<page>/build/`, with the packages this site
already depends on. The examples are not part of the site's own code: the
type check, the linter and the site's stylesheet all leave the folder alone.
`npm run dev` does not serve them; use `npm run build` and a static server to
see the previews.

An example is not edited by hand. When a prompt changes, its preview page says
so by itself: it compares `prompt` with the fingerprint of the prompt as served
(`promptVersion` in [src/lib/themes.ts](src/lib/themes.ts): the first 16 hex
digits of its SHA-256) and shows "An earlier version of the prompt" until the
example is replaced. To replace one, run the prompt again in a new project,
check the result with Strict Check, and replace the folder and its
`example.json`. The tests refuse an example whose `example.json` records an
error.

The theme pages and the home page show each example as a small live view
([PromptThumb.astro](src/components/PromptThumb.astro)): the built page in a
frame, scaled down.

## Theme cards

The home page and `/themes` show every theme as a card
([ThemeCard.astro](src/components/ThemeCard.astro)): its name in its own
heading font and weight, its description, two buttons, a badge and its colors.
A card is plain HTML inside an element with `data-theme`, so it costs no
script. Each theme's fonts are imported in
[src/styles/global.css](src/styles/global.css); a browser fetches a font only
on a page that uses it.

## The mark, the icons and the share image

The mark is an S drawn as two rails that hook into each other, on a square. It
sits on a 32-unit grid with a 4-unit stroke, so it is sharp at 16px and 32px.
Its path is in [src/lib/brand.ts](src/lib/brand.ts), and nowhere else.

- [Logo.astro](src/components/Logo.astro) draws it in the header and the
  footer, in the primary color of the theme the page wears: blue on the site's
  own pages, a theme's color on that theme's page.
- [scripts/build-brand.ts](scripts/build-brand.ts) makes the files in
  `public/` from it, in Strict One's blue:

| File | What it is for |
|---|---|
| `favicon.svg`, `favicon.ico` | The browser tab. The `.ico` holds 16, 32 and 48px |
| `apple-touch-icon.png` | An iPhone's home screen, 180px |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | The icons `site.webmanifest` names. In the maskable one the rails keep to the middle, so a phone may crop it to a circle |
| `og.png` | The image shown when a page is shared, 1200 by 630: the home page's headline on its column grid, and one square for each theme in that theme's primary color |

```bash
npm run brand
```

Run it after the mark, the home page's headline or a theme's primary color
changes, and commit what it writes. It draws with Google Chrome through
`playwright-core`, so it needs Chrome on the machine. A normal build only
copies the files and needs no browser. `site.webmanifest` is written by hand.

Every page shares the same `og.png`.

## Strict Check on the site

The site is checked against its own theme, Strict One:

```bash
npm run strict-check
```

Build the repo first (`npm run build` at the root): the script runs the check
from `packages/check/dist` on the source and on five built pages (home,
themes, spec, the Strict One page and the 404 page), in light mode, at 1280px
and 375px. The workflow runs it on every pull request and on `master`, after
the tests, shows the report on the run's page and keeps it as
`strict-check.txt`.

What is left out, and why:

- `examples/` (`--exclude examples`): ninety projects, each in another
  theme and each checked against that theme when it was built.
- [ThemeCard.astro](src/components/ThemeCard.astro) and every theme preview
  (`strict-ignore-file`, `data-strict-ignore`): they wear the theme they show.
- The brand colors in [brand.ts](src/lib/brand.ts): the icon files and the
  share image are drawn once, in fixed colors.
- Dark mode (`--mode light`): the site has none.
- The other seventeen theme pages: they wear their own themes on the site's
  layout, so they do not pass against Strict One.

## Search engines

[sitemap.xml.ts](src/pages/sitemap.xml.ts) lists the pages a search engine may
show, each at the canonical address the page gives itself: the home page, the
catalog, the spec, every theme page and every preview of a page prompt, 81 in
all. It leaves out the built example pages, which carry `noindex` themselves,
the 404 page, and the files a tool fetches (`.md`, `.css`, `.json`). It gives
no dates, because the build has no honest one for a page.

[robots.txt.ts](src/pages/robots.txt.ts) allows every crawler everywhere and
names the sitemap. Nothing is disallowed on purpose: a crawler has to fetch a
page to read its `noindex`.

A test compares the sitemap with the built pages, so a new page is either
listed or marked `noindex`. A staging build writes both files with the staging
address; its `X-Robots-Tag` header keeps it out of search results all the same.

## Try the registry locally

The install URLs are built from the site address. To install a theme from a
local server, start it with that address:

```bash
STRICT_SITE_URL=http://localhost:4321 npm run dev
```

```bash
npx shadcn@latest add http://localhost:4321/r/recital.json
```

## Staging

A staging copy is built with its own address and kept out of search results:

```bash
STRICT_SITE_URL=https://staging.example.com STRICT_NOINDEX=1 npm run build
```

- `STRICT_SITE_URL` puts the staging address into the install commands and
  the registry, so a theme can be installed from staging.
- `STRICT_NOINDEX=1` writes a Netlify `_headers` file that sends
  `X-Robots-Tag: noindex, nofollow` with every file. A normal build writes no
  such file, and a test checks that.
- `netlify.toml` in the repo root holds the build settings for a build on
  Netlify from Git. That path is untried; the staging copy so far was
  deployed by hand from a local build.
- Tried on 2026-11-11 from a staging copy: `npx shadcn@latest add` with the
  staging address of `strict-one.json`, in a clean Vite + shadcn project,
  installed the theme, its three fonts and the extra mono weight. A small page
  built with it passed Strict Check at 100% in both color modes.

## Production deploy

[.github/workflows/ci.yml](../../.github/workflows/ci.yml) builds and tests
the whole monorepo on GitHub Actions, then copies `apps/site/dist/` to the
server with rsync over SSH.

- **build** runs on pull requests and on `master`: `npm ci`, `npm run build`,
  `npm run typecheck`, `npm test`, then Strict Check on the site. It writes
  `deploy.txt` (commit, branch, time) into the built site and keeps the site
  as an artifact, hidden files included, because the site has a `.htaccess`.
- **deploy** runs on `master` only, in the `production` environment, and only
  when that environment has the secrets `SSH_PRIVATE_KEY`, `SSH_KNOWN_HOSTS`,
  `DEPLOY_HOST`, `DEPLOY_USER` and `DEPLOY_PATH`. It copies the site with
  `--delete`, and refuses a `DEPLOY_PATH` that does not end in `/static/` and
  a build without `index.html`, `.htaccess` or `deploy.txt`. It compares what
  is in the files (`--checksum`), so only files that differ are sent.
- Run by hand (Actions > CI > Run workflow) it is a dry run: it lists what a
  deploy would change and changes nothing, unless the switch is turned off.

A pull request from a fork gets no secrets, and its run never reaches the
deploy job.

strictthemes.com has served this site since 2026-11-11.

On the server nginx passes requests to Apache, and Apache reads
[public/.htaccess](public/.htaccess). That file makes Apache answer a missing
page with the site's own `404.html`, send `.md` and `.ts` files as text so a
browser shows them, and send the web manifest with its type. Without it
Apache shows its default error page, sends `.md` with no type and `.ts` as
video.

What was tried: `deploy.txt` on the domain shows the commit of each deploy.
On 2026-11-12, the day the deploy moved here from a GitLab pipeline, a dry
run from GitHub listed one file to change, `deploy.txt` itself, and the first
deploy left every page as it was.
The `.htaccess` file was tried against the built site in a local `httpd:2.4`
container, and after its deploy the domain showed the site's own 404 page and
sent `DESIGN.md` and `app.config.ts` as text.

## Old addresses

The site this one replaced, a shop for WordPress themes, was dropped on
purpose, not ported, so its addresses answer "not found".

## Not here yet

- A share image for each theme, and analytics.
- The sitemap has not been submitted to a search engine by hand; they find it
  through `robots.txt`.
