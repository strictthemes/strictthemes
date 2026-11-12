# Strict themes

The free themes, each written as one [Strict spec](../spec/SPEC.md)
(`DESIGN.md`), and the build that turns them into a shadcn registry.

| Theme | For | Fonts |
|---|---|---|
| [Strict One](themes/strict-one/DESIGN.md) | Editorial sites on a visible grid. Hard edges, one blue accent. | Archivo, IBM Plex Sans, IBM Plex Mono |
| [Recital](themes/recital/DESIGN.md) | Long reading. Paper tones, a serif voice, one oxblood accent. | Fraunces, Source Sans 3, Source Code Pro |
| [Avion](themes/avion/DESIGN.md) | Dashboards and tools. Cool greys, clear numbers, one teal signal. | Red Hat Display, Red Hat Text, Red Hat Mono |
| [Kiln](themes/kiln/DESIGN.md) | Shops and studios. Clay paper, terracotta, denim blue. | Bricolage Grotesque, DM Sans, DM Mono |
| [Ledger](themes/ledger/DESIGN.md) | Money and reports. Cream paper, pine green, brass. | Instrument Serif, Instrument Sans, Spline Sans Mono |
| [Cipher](themes/cipher/DESIGN.md) | Developer tools. Monospace headings, electric violet, acid lime. | JetBrains Mono, Geist |
| [Sorbet](themes/sorbet/DESIGN.md) | Consumer apps. Peach cream, raspberry, pill-shaped buttons. | Gabarito, Figtree, Sometype Mono |
| [Atelier](themes/atelier/DESIGN.md) | Portfolios and fashion. Ivory and black, a didone, no rounded corner. | Bodoni Moda, Hanken Grotesk, Fragment Mono |
| [Civic](themes/civic/DESIGN.md) | Public services and health. WCAG AAA contrast, large type. | Public Sans, Atkinson Hyperlegible Next, Atkinson Hyperlegible Mono |
| [Dispatch](themes/dispatch/DESIGN.md) | News and sport. Newsprint, black rules, condensed headlines, red. | Big Shoulders, Newsreader, Chivo Mono |
| [Tisane](themes/tisane/DESIGN.md) | Food, wellness and places to stay. Oat paper, olive, peach. | Young Serif, Albert Sans, Reddit Mono |
| [Voltage](themes/voltage/DESIGN.md) | Launches, events and music. A yellow page, black ink, electric blue. | Unbounded, Familjen Grotesk, Space Mono |
| [Nocturne](themes/nocturne/DESIGN.md) | Film, music and nightlife. Lilac-grey by day, aubergine and gold by night. | Syne, Onest, Azeret Mono |
| [Counsel](themes/counsel/DESIGN.md) | Law firms, advisers and private offices. White paper, midnight navy, gold used once. | Marcellus, Jost, Courier Prime |
| [Passage](themes/passage/DESIGN.md) | Travel and booking. Pale-water paper, navy ink, one hue of blue. | Overpass, Karla, Overpass Mono |
| [Ember](themes/ember/DESIGN.md) | Games, esports and sport. Blue-black, ember red, an amber signal. Dark first. | Oxanium, Sofia Sans, Martian Mono |
| [Gauge](themes/gauge/DESIGN.md) | Hardware, parts and spec sheets. Nine steel greys and no accent color. | Chivo, Libre Franklin, Roboto Mono |
| [Confetti](themes/confetti/DESIGN.md) | Invitations, parties and gift lists. Lilac-white paper, plum ink, pastel blocks. | Caprasimo, Nunito, Ubuntu Sans Mono |
| [Tideline](themes/tideline/DESIGN.md) | Surf schools, outdoor centres and the coast. Sand paper, deep-sea ink, lagoon and coral blocks. | Epilogue, Manrope, Geist Mono |
| [Relay](themes/relay/DESIGN.md) | Sports clubs, leagues and race days. Navy bands, an amber main action, large scores. | Saira, Rubik, Kode Mono |
| [Veranda](themes/veranda/DESIGN.md) | Guesthouses, small hotels and places to stay. Cream paper, slate ink, clay, sage and sand. | Cormorant, Outfit, Cutive Mono |
| [Solace](themes/solace/DESIGN.md) | Therapists, coaches and private practices. Blush paper, indigo ink, no signal color. | Literata, Mulish, Xanh Mono |
| [Primer](themes/primer/DESIGN.md) | Courses, schools and learning tools. Cream paper, deep-teal ink, four chart colors. | Lexend, Plus Jakarta Sans, Fira Code |

Every theme has a light and a dark mode and lints with no errors or warnings.
The tests also hold the themes apart: no two share a heading font, a body font,
or the same page color and accent.

## Install a theme

The registry is served from `https://strictthemes.com/r` since 2026-11-11. One
command installs a theme's colors, radius and fonts into a shadcn project:

```bash
npx shadcn@latest add https://strictthemes.com/r/recital.json
```

For other stacks, each theme also builds to a Tailwind v4 `@theme` file, Nuxt UI
CSS with an `app.config.ts`, plain shadcn CSS variables, and W3C design tokens.

## Build

```bash
npm run build
```

This writes `dist/`:

```
dist/r/<theme>.json          registry:theme item (colors, radius, type scale, font dependencies)
dist/r/font-<family>-<role>.json   registry:font items
dist/r/<theme>-<page>.json   registry:block items: each example page, ready to install
dist/r/<theme>-agent-<block>.json   the agent kit's blocks, written out for the theme
dist/r/<theme>-agent-kit.json       all of the kit's blocks in one item
dist/r/registry.json         index of every item
dist/themes/<theme>/         DESIGN.md, SKILL.md, tailwind.css, shadcn.css, nuxt-ui.css, app.config.ts, tokens.json
dist/themes/<theme>/prompts/<page>.md   page prompts, ready to paste into a coding agent
```

## Skills

Each theme has a skill, `skills/strict-theme-<theme>/SKILL.md` in the repo
root: what an agent needs to build any page in the theme, not one of its five.
It is the page prompt without the page. The setup steps, the theme in short,
the layout notes from `prompts/_shared.md`, the rules and the theme's do's and
don'ts are the same text, generated by the same code (`composeSkill` beside
`composePrompt` in [src/prompts.ts](src/prompts.ts)), followed by the list of
page briefs to fetch and the check to run.

```bash
npx skills add strictthemes/strictthemes --skill strict-theme-kiln
```

The files are generated and kept in the repo, because that is where the
command above reads them. After changing a theme or its layout notes:

```bash
npm run skills
```

A test fails when a file in `skills/` is not what the build would write. The
site serves the same text at `/themes/<theme>/SKILL.md`.

## Blocks

Every example page is also a `registry:block` item, `<theme>-<page>`, made
from the example's source in `apps/site/examples` ([src/blocks.ts](src/blocks.ts)).
A block is the page and the files it imports:

- The page becomes `components/<theme>-<page>/page.tsx`, and its own data and
  components go into the same folder. Imports between them are rewritten.
- The stock components the page uses keep their place in `components/ui`, in
  the form the page left them (the focus outline in place of the ring), and
  `lib/utils.ts` comes with them.
- What a new shadcn project already has (`main.tsx`, the theme provider) is
  left out, and so are the stylesheet and the page's `<title>`.

A block does not list its theme as a dependency. The shadcn command fills in a
theme's colors only for a theme it was asked for by name; one it fetches as a
dependency adds the fonts and the type classes and leaves the project's colors
as they were. So the command names both, the theme first:

```bash
npx shadcn@latest add https://strictthemes.com/r/relay.json https://strictthemes.com/r/relay-fixtures.json
```

## Agent kit

The agent kit's blocks are in [`packages/kit`](../kit), written with tokens in
place of sizes. The registry build writes them out for each theme
([src/kit.ts](src/kit.ts)): `<theme>-agent-tool-call`, `-approval`, `-stream`
and `-citations`, and `<theme>-agent-kit` with all four. They install like a
block, with the theme named first.

Theme items point at their fonts by absolute URL. To try the registry before it
is live, build it for a local address and serve `dist/`:

```bash
node scripts/build.ts --base-url http://localhost:5197/r
```

The build fails if any theme has a lint error or warning.

## Fonts

A theme installs its fonts through `registry:font` items, which make the shadcn
CLI add a Fontsource package (or `next/font` in Next.js) and set the font
variable. [src/fonts.ts](src/fonts.ts) maps each family name used in a
`DESIGN.md` to its package.

- Each font role has its own elements: body font on `html`, mono on `code, kbd,
  pre, samp`, heading font on `h1`–`h6`.
- Variable fonts are used where they exist. A font with no variable version
  lists its weights in the catalog, and the theme imports each weight beyond
  regular (IBM Plex Mono, DM Mono, Space Mono).
- Instrument Serif, Young Serif, Fragment Mono, Marcellus, Caprasimo, Cutive
  Mono and Xanh Mono have one weight. Their themes use that weight only, so
  nothing is set in a faked bold. Counsel sets Courier Prime in its regular
  weight only, too.
- A font whose theme sets text in italics names its italic file in the catalog
  (Fraunces, Source Sans 3, Bodoni Moda, Newsreader, Instrument Serif,
  Cormorant, Literata, Mulish).
- A label font is found by its name, which has to hold "mono" or "code".
- A theme using a family that is not in the catalog cannot be built: the tests
  check this.

## Page prompts

A page prompt is a complete brief for one page built with a theme. Every theme
has five:

| Theme | Pages |
|---|---|
| Strict One | landing, pricing, article, docs, dashboard |
| Recital | essay, journal, chapter, newsletter, about |
| Avion | dashboard, status, list, detail, settings |
| Kiln | shop, collection, product, basket, studio |
| Ledger | overview, transactions, invoice, transfer, report |
| Cipher | landing, docs, releases, deploys, tokens |
| Sorbet | welcome, today, progress, plans, profile |
| Atelier | home, collection, piece, house, appointment |
| Civic | start, question, review, confirmation, guidance |
| Dispatch | front, story, live, scores, section |
| Tisane | home, menu, booking, recipe, visit |
| Voltage | launch, lineup, tickets, artist, info |
| Nocturne | programme, film, season, membership, visit |
| Counsel | firm, practice, profile, insight, enquiry |
| Passage | search, results, details, ticket, departures |
| Ember | game, patch, leaderboard, store, player |
| Gauge | catalogue, part, compare, quote, downloads |
| Confetti | invitation, rsvp, gifts, day, guestbook |
| Tideline | home, lessons, forecast, booking, guide |
| Relay | home, fixtures, standings, membership, report |
| Veranda | home, rooms, room, reserve, menu |
| Solace | home, approach, profile, fees, appointment |
| Primer | catalogue, course, lesson, progress, plans |

Only part of a prompt is written by hand:

- `themes/<slug>/prompts/<page>.md` is the **brief**: the page's sections,
  layout and behavior, with its own checks in the front matter (`page`,
  `title`, `description`, `order`, `checks`).
- `themes/<slug>/prompts/_shared.md` holds the layout conventions every page
  of the theme shares (container, grid, section header, labels).

[src/prompts.ts](src/prompts.ts) composes the rest from the theme's spec: the
install step, a short token summary, the rules (from the `strict` block and the
theme's do's and don'ts) and the checklist the agent goes through at the end.
Change a theme's tokens or rules and every prompt follows.

A brief may only name type sizes, spacing steps and corners the theme has; the
tests check this for every theme.

A prompt is written for a shadcn project, so it names corners by the class
such a project has for them. shadcn calls its base corner `lg`, which moves
every larger corner of a spec one name up: Recital's 12px `lg` corner is
`rounded-xl`, and `rounded-lg` is 6px. The summary in each prompt says so.

## Add a theme

1. Create `themes/<slug>/DESIGN.md` with a `strict` block, a `dark` mode and all
   eight sections.
2. Add any new font family to `src/fonts.ts`.
3. Run `npm test`. It lints the spec and checks that the exported shadcn colors
   are readable in both modes.

## What was tested

Strict One, Recital and Avion were installed by URL with shadcn CLI 4.23 into a
new Vite + Base UI project and checked in the browser in light and dark mode.

The ten themes added on 2026-11-11 were each installed with the shadcn CLI
from a local copy of the registry into a new Vite + Base UI project. Every
install added the theme's fonts and variables, and every project built. They
were looked at in the browser on the site, where stock shadcn components wear
each theme: all ten in light mode, Voltage also in dark mode. They were not
looked at in an installed project.

The five themes added on 2026-11-12 were each installed with the shadcn CLI
from a local copy of the registry into a new Vite + Base UI project, and every
project built. Their twenty-five example pages were built in copies of those
projects and looked at in a browser: every page in light or dark mode, and at
least one page of each theme in dark mode.

Tideline, Relay, Veranda, Solace and Primer, added later the same day, were
each installed the same way, and every project built. Their twenty-five
example pages were built in copies of those projects and pass Strict Check
with no errors or warnings in light and dark mode at 1280px and 375px. Each
was looked at as a full-page picture at 1280px, and at least one page of each
theme in dark mode and at 375px.

Not tested yet: a Next.js project (where the extra font-weight import is also
untried), the Nuxt UI output of any theme but Strict One, and the dark mode of
nine of the ten new themes in a browser.
- **Skills, blocks and the agent kit** (2026-11-12): the twenty-three skills
  are generated and compared with the files in `skills/` by a test; none was
  run in an agent yet. One block, Relay's fixtures page, was installed with
  the shadcn CLI into a new Vite project together with its theme: the project
  built, and passed Strict Check at 100% of 9,050 measured values in both
  modes at two widths, with hover and focus. Installed without naming the
  theme it failed at 89.2%, which is why the command names both. The other
  114 blocks are checked for their shape by a test (every import points at a
  file the block brings) and were not installed. The kit's tests are in
  [`packages/kit`](../kit#what-was-tested).
