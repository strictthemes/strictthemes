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
dist/r/registry.json         index of every item
dist/themes/<theme>/         DESIGN.md, tailwind.css, shadcn.css, nuxt-ui.css, app.config.ts, tokens.json
dist/themes/<theme>/prompts/<page>.md   page prompts, ready to paste into a coding agent
```

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
- Instrument Serif, Young Serif and Fragment Mono have one weight. Their themes
  use that weight only, so nothing is set in a faked bold.
- A font whose theme sets text in italics names its italic file in the catalog
  (Fraunces, Source Sans 3, Bodoni Moda, Newsreader, Instrument Serif).
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
| Cipher | landing, docs, changelog, deploys, tokens |
| Sorbet | welcome, today, progress, plans, profile |
| Atelier | home, collection, piece, house, appointment |
| Civic | start, question, review, confirmation, guidance |
| Dispatch | front, story, live, scores, section |
| Tisane | home, menu, booking, recipe, visit |
| Voltage | launch, lineup, tickets, artist, info |
| Nocturne | programme, film, season, membership, visit |

Only part of a prompt is written by hand:

- `themes/<slug>/prompts/<page>.md` is the **brief**: the page's sections,
  layout and behavior, with its own checks in the front matter (`page`,
  `title`, `description`, `order`, `checks`, `tested`).
- `themes/<slug>/prompts/_shared.md` holds the layout conventions every page
  of the theme shares (container, grid, section header, labels).

[src/prompts.ts](src/prompts.ts) composes the rest from the theme's spec: the
install step, a short token summary, the rules (from the `strict` block and the
theme's do's and don'ts) and the checklist the agent goes through at the end.
Change a theme's tokens or rules and every prompt follows.

A brief may only name type sizes, spacing steps and corners the theme has; the
tests check this for every theme. `tested` lists runs that really happened,
with the tool, the date and what came out. Leave it empty until a prompt has
been run.

A prompt is written for a shadcn project, so it names corners by the class
such a project has for them. shadcn calls its base corner `lg`, which moves
every larger corner of a spec one name up: Recital's 12px `lg` corner is
`rounded-xl`, and `rounded-lg` is 6px. The summary in each prompt says so.

### All thirteen themes: the problems that were still open

The round described in the next section left a list of open points and 289
minor problems in the agents' reports. On 2026-11-11 they were worked through
in four places.

**The spec and Strict Check.**

- **Full rounds.** `strict.rounded.full` in a `DESIGN.md` is the largest box
  that may be fully round, measured on its shorter side. Strict Check passes a
  circle or a pill up to that size and reports a larger one; before, it warned
  on every one. Three themes set 12px, enough for a status dot (Avion, Cipher,
  Dispatch). Seven set 64px, enough for an avatar and a pill-shaped switch
  (Kiln, Nocturne, Recital, Sorbet, Strict One, Tisane, Voltage). Atelier,
  Civic and Ledger set none: they have no full rounds.
- **Colors of a theme's own.** A color with a name shadcn has no variable for
  is exported as its own variable and utility. Kiln has two, `glaze-pale` and
  `glaze-dark`, the same in both modes, so a drawn piece keeps its glaze in
  dark mode.
- **The word "rounded".** Strict Check took it for a class in the sentence
  "Figures are rounded to the nearest pound". It now counts as a class only in
  a string that is not a sentence.

**Five `DESIGN.md` files.** Sorbet's Buttons line names the outline button.
Dispatch has a line for pictures (a flat block in the muted color) and says
that the focus outline is red as well. Strict One allows one badge filled with
the tertiary color in a view; the others are outlined. Cipher allows no circle
but a status dot. Kiln's text on terracotta is no longer pure white, which its
own don'ts forbid.

**The generated rules** in [src/prompts.ts](src/prompts.ts):

- **The `Button`'s other rings.** The `aria-invalid` ring is replaced with
  `aria-invalid:ring-0`, as in a field. The ring classes of the `destructive`
  variant are deleted, because the base classes already give every variant the
  outline.
- **Focus from code on a link or a button.** Such a control keeps its
  `focus-visible:` classes. After a mouse click it shows no outline, which is
  how a browser treats every control, and the rule now says so.
- **Corners.** The rule gives the theme's limit for full rounds, or says that
  the theme has none.
- **Counts.** A number with a noun reads right at one: "1 set", not "1 sets".

**Every theme's notes and briefs.** One agent for each theme (Claude Opus 5.5)
revised its `_shared.md` and its five briefs again. In every theme:

- A secondary button's stock hover is replaced once, in `button.tsx`.
- An error line goes when its own field changes; the others stay until the
  next submit.
- What to replace in `input.tsx` is given as whole class names, so
  `file:bg-transparent` stays.

And for the other points of the list: a chart's scale values sit inside the
plot (the top one hangs under its line, the bottom one stands on its line);
the hours on Atelier's appointment page need no `gap-y`; in Recital a wide
block carries the margin and the column after it has none; Kiln's pictures use
the two glaze colors; Nocturne's showtimes fall inside the opening hours its
visit page gives; Voltage's counts agree from page to page.

All sixty-five pages were then built again, each by a fresh agent (Claude Opus
5.5) in a new Vite + shadcn project with the theme installed, and checked with
Strict Check in light and dark mode at 1280px and 375px.

- All sixty-five built, and all sixty-five passed Strict Check at 100%, with
  no errors and no warnings: 166,853 measured values in all.
- No agent reported a blocking problem. They reported 278 minor ones.
- Every build was looked at in a browser at 1280px in light mode. Looking
  found two things no agent and no check had reported. On Recital's about page
  the agent had glued two class names together (`mt-4md:grid`), and two rows
  of the facts card lost their layout. On Cipher's tokens page the table was
  wider than its panel at 1280px, and the "Revoke" buttons were cut off.
- Both briefs were corrected and both pages built again. Recital's now says
  how to join the class; Cipher's gives the page ten columns of the grid and
  shows each date without the time. Both passed at 100% with no blocking
  problem, and both were looked at again.

The sixty-five previews on the site are the last build of each page, each from
the prompt as it is now, and nothing in them was fixed by hand. Beyond the
look at 1280px, three pages were looked at in dark mode (Kiln's shop, Sorbet's
profile, Nocturne's programme), four at 375px (Avion's dashboard, Tisane's
visit, Dispatch's front, Voltage's line-up) and two at 768px (Atelier's
appointment, Nocturne's season).

Still open. The agents' last reports hold 278 minor problems, one to six a
page, and none blocking; the `tested` record in each brief gives its count.
The ones that came up most, or that show on a page:

- **The `Button`'s rings, again.** Beside the `destructive` variant's ring
  classes sits `focus-visible:border-destructive/40`, and the rule does not
  say whether it stays. The base classes hold two `aria-invalid` ring classes,
  one of them `dark:`, and the rule does not say that one `ring-0` replaces
  both.
- **A page with no secondary button.** The notes still ask for the hover in
  `button.tsx`. Some agents made the change and some left it.
- **Motion.** A stock `Button` ships with `transition-all` and a nudge when
  pressed. The notes of several themes say "the only transition is color" and,
  elsewhere, that stock components keep their motion.
- **Escape.** "It closes on Escape" does not say whether the key works from
  anywhere on the page or only with focus inside the menu (Dispatch, Voltage).
- **Focus and rendering.** Moving focus to a field in the same step that adds
  its error line needs the line rendered first. No brief says how.
- **`<time>`.** Whether a date or a time in running text, in small print or in
  a code sample is a `<time>`, and whether it takes `tabular-nums`.
- **Rules that meet.** A general margin in the notes against another in a
  page's own section: text after a box against an `<h2>` (Civic), a section's
  `gap-8` against a heading's `gap-3` (Voltage), `mt-12` against `mt-6` for a
  stacked column (Nocturne). The page's section wins, and agents still ask.
- **Nocturne.** Whether the opening hours bound the start of a screening or
  all of it.
- **Tisane's visit page.** The streets of the drawn map are `bg-background` on
  `bg-muted`, about 1.1:1, so they hardly show. The directions under the map
  carry the meaning.
- **Tisane's booking page.** The value of a summary row has `shrink-0`, which
  is wrong for a typed name at 375px. The agent used `min-w-0` and wrapping.
- **Civic's guidance page.** One check says no text is muted, and the brief
  has muted lines of its own.
- **Cipher's tokens page.** With the row's stock hover tint under it, the red
  "Revoke" label is about 4.4:1, under the 4.5:1 its size needs. Off the hover
  it is 4.9:1.

Not done: no prompt has been run in Cursor or v0, and none more than once on
its present text.

### All thirteen themes: the reported problems

The runs described in the sections below left 342 minor problems in the agents'
reports. On 2026-11-11 they were worked through in two places.

**The generated rules** in [src/prompts.ts](src/prompts.ts), which every one of
the sixty-five prompts carries:

- **Focus from code.** An element that only code focuses (a heading or a
  message with `tabIndex={-1}`) gets its outline written with `focus:` in place
  of `focus-visible:`. After a mouse click a browser does not match
  `:focus-visible` on such an element, so no outline showed.
- **Which rings to replace.** Ring classes are replaced only in the files of
  components the page uses and that can take focus on it, so a `Badge` that is
  not a link keeps its ring. The rule now also names the `Button`'s
  `destructive` variant and its `aria-invalid` ring.
- **Dark mode.** A new shadcn project follows the system's mode and switches on
  the `d` key. The rule says to leave that as it is and to add no switch. A
  page with a native `<select>`, date field or time field sets `color-scheme`
  for both modes, so the list and the picker are dark in dark mode.
- **Fonts.** Every font import the theme's install added stays, also one for a
  style no page uses yet (Ledger's italic).
- **The `cn()` step** says what `lib/utils.ts` holds in a new project.

**Every theme's notes and briefs.** One agent for each theme (Claude Opus 5.5)
revised its `_shared.md` and its five briefs from that theme's reports. Most
themes now name the header's links and give one format for dates, and several
say which buttons stay focusable when disabled. What else changed, for the
problems the earlier lists named:

- **Avion.** On the status page the uptime figure has its own line below `md`.
  A secondary button's hover is given for every such button and for the chosen
  one of a group. On the list page, focus goes to the header checkbox when a
  button removes itself.
- **Strict One.** A label that heads a group of links has one color. An `Input`
  keeps its 32px height, and the note says how.
- **Recital.** The input's border is `border-muted-foreground`, 3:1 against the
  page. The claim that the drop cap spans two lines is gone. `DESIGN.md` no
  longer asks for small caps.
- **Tables** (Strict One, Avion, Ledger, Nocturne, Recital). A table's name
  sits above its scroll box, not in a `<caption>` that scrolls with it. Strict
  One's and Avion's notes say what the stock `TableHead` keeps.
- **Sorbet.** The thumb of a switch that is off is `bg-background` in both
  modes (5.6:1 and 8.1:1 against its track). Sample counts on the progress page
  add up.
- **Voltage.** The outline button loses the stock `dark:bg-input/30`, so it is
  not see-through in dark mode.
- **Kiln.** A pale drawn piece has a border and square corners, so it no longer
  reads as a card inside a card.
- **Nocturne.** The season pass card takes five of twelve columns from `md` and
  four from `lg`. The `Textarea` gets `field-sizing-fixed`, so `rows` works.
- **Tisane.** On the visit page the caption is the last thing in its figure,
  and the map's tags have exact positions.
- **Cipher.** On the deploys page `role="region"` is on a wrapper, not on the
  list.

All sixty-five pages were then built again, each by a fresh agent (Claude Opus
5.5) in a new Vite + shadcn project with the theme installed, and checked with
Strict Check in light and dark mode at 1280px and 375px.

- All sixty-five built, and all sixty-five passed Strict Check with no errors.
- No agent reported a blocking problem. They reported 283 minor ones.
- Every build was looked at in a browser at 1280px in light mode. Looking found
  five things no agent and no check had reported: a broken sentence in
  Recital's about page; a wrong reference in Ledger's notes ("the last note");
  Voltage's Menu button, which sat beside the name and not at the right end of
  the header below `md`; the title of Nocturne's membership page, said to break
  onto two lines where it breaks onto three; and the opening hours on Atelier's
  appointment page, where "Saturday" ran out of its cell at 768px.
- These five were corrected and the thirteen pages they change were built
  again: Ledger's five, Voltage's five, and the three single pages. All
  thirteen passed with no errors and no blocking problem.

Of the last build of each page, fifty scored 100%. The other fifteen scored
97.8% to 99.9%, with warnings only, all for full rounds: status dots, avatars
and Sorbet's stock pill-shaped switch. Beyond the look at 1280px, three pages
were looked at in dark mode (Sorbet's profile, Kiln's shop, Tisane's booking),
five at 375px (Tisane's visit, Avion's status and dashboard, Voltage's tickets
and artist) and two at 768px (Nocturne's season, Atelier's appointment).

The agents' last reports of this round held 289 minor problems, four or five a
page, and none blocking. The section above says what became of them, and of
the open points this round listed. Its builds have replaced this round's as
the previews on the site.

### The ten newer themes

Kiln, Ledger, Cipher, Sorbet, Atelier, Civic, Dispatch, Tisane, Voltage and
Nocturne got their five prompts each on 2026-11-11. One agent for each theme
wrote its notes and briefs from the theme's `DESIGN.md` and from what the
earlier runs had shown, around one invented organisation: a pottery, a bank for
small businesses, a deploy tool, a habit tracker, a fashion house, a council's
parking permits, a city newspaper, a tea room, a festival and a cinema.

The prompts were then run in three steps. Every build was made by a fresh agent
(Claude Opus 5.5) in a new Vite + shadcn project with the theme installed, and
checked with Strict Check in light and dark mode at 1280px and 375px.

1. **One page of each theme.** All ten built and passed Strict Check with no
   errors. The agents reported one blocking problem, which applied to every
   theme (the disabled button, below), and about eighty minor ones. All ten
   sets of briefs were revised.
2. **All fifty pages.** All fifty built, and forty-nine passed Strict Check
   with no errors. Ledger's overview failed: the labels under its chart ran
   past the sheet at 375px, so the page scrolled sideways. The agents reported
   two blocking problems and 261 minor ones. The blocking ones were a poster in
   a row on Nocturne's pages, which lost its 2:3 shape without `self-start`,
   and sample numbers on Sorbet's progress page that could not all be true at
   once. These three were fixed in the briefs, with a broken sentence in
   Ledger's notes and two buttons whose labels did not fit their cards.
3. **Twelve pages again.** Ledger's five and Nocturne's five, because a change
   to a theme's shared notes changes all five of its prompts, and Sorbet's
   progress and plans pages. All twelve passed at 100%, and no agent reported
   a blocking problem.

The fifty previews on the site were then the last build of each page. Forty
scored 100%. The other ten scored 97.8% to 99.9%, with warnings only: round
shapes the briefs ask for (status dots, avatars and Sorbet's stock pill-shaped
switch) and, in Kiln's shop, a drawn pot that read as a card inside a card.
Every build was looked at in a browser at 1280px, three of them in dark mode,
and six also at 375px. These previews have since been replaced by the builds of
the round above.

What these runs changed outside the ten themes' briefs:

- **A disabled button that stays focusable.** With `focusableWhenDisabled`,
  Base UI sets `aria-disabled` and `data-disabled` in place of the `disabled`
  attribute, so the stock button's `disabled:` classes do nothing and the
  button looks enabled. Every Buttons note that uses the prop now adds
  `data-disabled:pointer-events-none data-disabled:opacity-50` in
  `components/ui/button.tsx`. Avion's note says so too. That changed Avion's
  five prompts, so its five pages were built again (98.7% to 99.9%, no errors,
  no blocking problem) and those builds replace its earlier previews.
- **Fonts a new project already has.** Cipher's body font is Geist, which a new
  shadcn project imports. Its install step now says to keep that import; for
  the other themes it still says to remove it. Where a theme's headings and
  labels are one family, as in Cipher, the font line of the summary says that
  the two classes are the same.
- **A check with a colon in it.** A sentence in a brief's `checks` that holds a
  colon and a space is read as a YAML map unless it is in quotation marks, and
  the prompt then listed `[object Object]`. The build now stops on such a
  check.
- **Seven `DESIGN.md` files** were made exact where a brief and the theme
  disagreed: Civic's labels and button text are 16px and a field's label is
  bold body text; Nocturne and Voltage say that a link is the text color,
  underlined, and not the accent; Kiln keeps its terracotta fill for one thing
  a screen and allows 16px padding in a narrow product tile.

These runs left 256 minor problems in the agents' reports for the fifty pages,
about five a page, and none blocking. They were worked through in the round
above, which also lists what is still open.

### The first three themes: the run on the revised text

The fifteen prompts were run on 2026-11-11 as they were then served, and the
agents reported 96 problems in them, none blocking. The prompts were revised
for about 88 of those, in three places: the generated rules in
[src/prompts.ts](src/prompts.ts), each theme's `_shared.md`, and the briefs.
What changed most:

- **Focus.** A stock component's ring classes are replaced in its file, not
  overridden beside it, and an element that only code focuses shows the same
  outline.
- **Forms.** A `<label>` is `block`. A button that its own click disables stays
  focusable. A form and the status element that replaces it share one wrapper,
  and the empty status element is never hidden.
- **Round shapes.** One wording in the rules and the notes: avatars and status
  dots.
- **Recital.** One wrapping container. Small caps are not used. Where a
  section's top margin goes is said once.
- **Avion.** "Small figure" is used wherever one is meant. The uptime bars
  state slow and down days in words next to the percentage.

All fifteen were then run again on the revised text, each by a fresh agent
(Claude Opus 5.5) in a new Vite + shadcn project with the theme installed from
the live registry.

- All fifteen built without errors.
- Fourteen passed Strict Check with no errors on the first run, in light and
  dark mode at 1280px and 375px. In the fifteenth, Recital's chapter page, the
  agent left `text-body` off the table and the check failed on 14px text. The
  brief's sentence about the table was made exact and the page run again; the
  second run passed.
- Ten pages score 100%; the other five score 98.7% to 99.9%, with warnings only
  for round shapes their theme allows.
- The agents reported 83 problems, none blocking. Most are new, smaller
  questions about text added in the revision.
- Every page was looked at in a browser at 1280px, and one at 375px in dark
  mode.

These builds were the previews on the site for Strict One and Recital, and
Avion's five were built once more after its Buttons note changed (above). All
fifteen have since been replaced by the builds of the round on the reported
problems. Each preview is kept as the agent left it, in
`apps/site/examples/<theme>/<page>/`, and nothing in them was fixed by hand.
Each `example.json` records a fingerprint of the prompt text the page was built
from, and the preview page says whether that is the prompt as it is now or an
earlier version. All sixty-five previews are built from the prompt as it is
now.

The problems these runs reported, and the ones left open before them, were
worked through in the round on the reported problems, which also lists what is
still open.

### Recital and Avion: what the test runs showed

Each of the ten prompts was run twice by a fresh agent in a new Vite + shadcn
project (2026-11-11), the second time on the revised text. All twenty builds
passed `npm run build`, and all twenty passed Strict Check with no errors, in
light and dark mode at 1280px and 375px: the Recital pages at 99.3% to 100%,
the Avion pages at 98.7% to 99.9%. The warnings are round shapes the themes
allow (avatars, status dots) and, in the first settings build, the stock
`Switch`. Every page was looked at in a browser in both rounds, and five of the
twenty builds at 375px in dark mode. Nothing has been run in Cursor or v0.

In the first round the agents reported 216 problems, 30 of them blocking. The
second-round reports were capped at 12 items each and held 7 blocking ones,
none in seven of the ten prompts. Those seven items were answered in the
prompts afterwards, and the run on the final text (above) found no blocking
problem in any of the fifteen.

What the runs changed:

- **A form's button did nothing.** The Base UI `Button` is `type="button"`
  unless told otherwise. The notes now say that a button that sends a form
  needs `type="submit"`.
- **`space-y-*` broke the rhythm.** It puts its margin under headings too, so
  the gap under a heading was 24px, not 16px. Recital's notes now give every
  element its own top margin.
- **A field with an error kept a tinted ring.** `focus-visible:ring-0` does not
  remove the stock `aria-invalid` ring. The focus rule now adds
  `aria-invalid:ring-0`, and lists `Textarea`, `Checkbox` and `Switch`.
- **Focus outlines were cut off.** A table that fills a panel with
  `overflow-hidden` loses an outline drawn outside it. The rule now draws it
  inside in that case.
- **The spacing rule named an allowed step as forbidden.** Its example of a
  step to avoid was `gap-6`, which Recital has. The example now comes from the
  theme's own scale.
- **"`DESIGN.md` wins" was too broad.** Agents could not tell whether a layout
  width in a brief loses to the spec. The sentence now covers tokens only.
- **A fill class on `Input` did not hold in dark mode,** where the stock
  `dark:bg-input/30` wins. The notes no longer set one.
- **Labels in Avion uppercased what they should not:** times, units, names.
  The notes now separate labels from small figures.
- **A status message was not announced** when its element arrived together
  with its text. The notes ask for an empty `role="status"` element from the
  start, and say where focus goes when a form is replaced.
- **Stock components that do not fit a theme:** the `Switch` is a pill, the
  `Checkbox` has no look for a mixed state, the `secondary` button's hover
  color equals its resting one, and red text on the `destructive` button's
  hover tint is 4.0:1. The briefs that use them say what to change.

The runs also found three gaps in the themes, fixed on 2026-11-11:

- **Larger corners had no class.** In a shadcn project `rounded-lg` is the base
  radius and `rounded-xl` was 1.4 times it, so Recital's 12px and Avion's 14px
  corner did not exist. The shadcn export now writes each corner above the
  base one step name up, and Strict Check reads a project with a
  `components.json` the same way.
- **Avion's success color had no class.** The export now writes `--success`,
  so `bg-success` and `text-success` work in both modes.
- **Recital loaded no italics.** Its spec sets block quotes and emphasis in
  italics, and the font packages' default file is upright only, so the browser
  slanted the upright letters. The theme item now imports the italic files of
  Fraunces and Source Sans 3. This is untried in a Next.js project, where the
  CLI loads fonts another way.

Recital's spec also asked for a 680px reading column and for 60 to 70
characters a line, and 680px holds about 90 at its type size. The column is
now 512px, which measured 67 to 70, with wide elements up to 768px.

### Strict One: what the test runs showed

All five prompts have been run by a fresh agent in a new Vite + shadcn project
(2026-11-10): landing and dashboard four times, pricing, article and docs
twice. Every build passed `npm run build` and was checked in the browser in
light mode, in dark mode and at 375px. Nothing has been run in Cursor or v0.
The prompts were revised after each run, so the current revision has not been
re-run.

The last round ran on the fixed theme and the rewritten prompts. The agents
reported 57 problems, 23 of them blocking (they had to guess or deviate),
against 80 the round before. None stopped a build, and the earlier causes (the
`cn()` setup, the grid against the rhythm, section padding, focus) did not come
back. What was left was mostly detail the briefs did not give: spacing inside a
component, the stock `Sheet`'s width, how a table's label reaches its scroll box.

What the runs changed:

- **shadcn's `cn()` drops the theme's type classes.** It reads `text-label` as
  a color. Every prompt now starts by registering the type classes as font
  sizes and pointing `components/ui` at that `cn`. In the third round all five
  agents did this without trouble.
- **Corners.** shadcn's `rounded-sm` and `rounded-md` were 2.4px and 3.2px. The
  shadcn export now writes the theme's exact values.
- **Stock components are not on-theme by themselves.** The shared notes give a
  recipe for `Button`, `Badge`, `Input`, `Table` and `Sheet`, say when to use
  plain elements instead of `Card`, and note that `buttonVariants` needs `cn()`
  around it.
- **Briefs asked for things the theme forbids:** muted paragraphs, bars in the
  primary color, `Tabs` with no panels. The tests now catch some of these.
- **Layout rules contradicted each other.** A grid `gap-8` fought the vertical
  rhythm, and three rules about section padding could not all hold. The grid
  now sets columns only, and a section's padding is defined once.
- **No focus style was given.** Every agent had to invent one, and the obvious
  Tailwind 4 classes render nothing next to a stock `outline-none`. The rules
  now carry one recipe that works with it.
- **The reading measure was wrong.** `max-w-[68ch]` gives 82 to 94 characters a
  line in IBM Plex Sans. The article now uses `max-w-lg`, which measured 70.

The runs also found four gaps in the theme itself, fixed on 2026-11-10 and
checked in a fresh install:

- **Label weight.** IBM Plex Mono has no variable version, and the CLI imports
  only weight 400 of it. The theme item now imports weight 500 as well.
- **Tertiary color.** It had no class in a shadcn project. The shadcn export
  now writes `--tertiary`, so `bg-tertiary text-tertiary-foreground` works.
- **Primary button on hover.** The stock button hovers at `bg-primary/80`,
  which was under 4.5:1 in Strict One's dark mode (4.16) and Avion's light mode
  (4.19). Strict One's dark primary is now `#8091FF` and Avion's light primary
  `#085F66`; a test checks the hover state of every theme in both modes.
- **Leftover font.** A new shadcn project imports Geist, and a registry item
  cannot remove a line. The install note and the prompts say to remove it.

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

Not tested yet: a Next.js project (where the extra font-weight import is also
untried), the Nuxt UI output of any theme but Strict One, and the dark mode of
nine of the ten new themes in a browser.
