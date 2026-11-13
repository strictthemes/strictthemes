import { fontRoles, namedFamilies, parseColor, shadcnRadiusClasses, type StrictSpec } from '@strictthemes/spec'
import { parse as parseYaml } from 'yaml'
import type { Theme } from './registry.ts'

/**
 * The theme's corners as the classes a shadcn project has for them. shadcn
 * names its base corner `lg`, so a corner of the spec above the base sits one
 * name up: the line says so, because the spec's own names would mislead.
 */
function cornerClasses(spec: StrictSpec): string {
  const steps = shadcnRadiusClasses(spec)
  const classes = Object.entries(spec.rounded)
    .filter(([name]) => name === 'none' || steps[name] !== undefined)
    .map(([name, value]) => {
      const step = steps[name] ?? name
      const token = step === name ? '' : ` (the \`${name}\` corner in \`DESIGN.md\`)`
      return `\`rounded-${step}\` ${value === '0' ? '0px' : value}${token}`
    })
  if (classes.length === 0) return ''
  const moved = Object.entries(steps).filter(([name, step]) => name !== step)
  const base = spec.rounded.md ?? spec.rounded.default
  const note =
    moved.length > 0 && base !== undefined
      ? ` \`rounded-lg\` is ${base} as well: it is shadcn's name for the base corner, the one its stock buttons and inputs use.`
      : ''
  return `${classes.join(', ')}.${note}`
}

/** A page brief: the hand-written part of a page prompt. */
export interface PageBrief {
  /** File name without extension, e.g. `landing`. */
  slug: string
  /** What the page is, e.g. "landing page". Used in the prompt's title. */
  page: string
  title: string
  description: string
  /** Position in the theme's list of prompts; lower comes first. */
  order: number
  /** Checks specific to this page, added to the theme's own. */
  checks: string[]
  /** The page specification, as Markdown. */
  body: string
}

export interface PagePrompt extends PageBrief {
  theme: string
  /** The complete prompt, ready to paste into a coding agent. */
  prompt: string
}

/**
 * A check is one sentence. YAML reads an unquoted sentence with a colon and a
 * space in it as a map, which would reach the prompt as "[object Object]".
 */
function checkText(check: unknown, slug: string): string {
  if (typeof check !== 'string') {
    throw new Error(`${slug}: a check is not plain text (${JSON.stringify(check)}). Put it in quotation marks.`)
  }
  return check
}

/** Reads a brief: YAML front matter (`page`, `title`, `description`, `order`, `checks`) and a Markdown body. */
export function parseBrief(briefSlug: string, source: string): PageBrief {
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(source)
  if (!match) throw new Error(`${briefSlug}: a page brief needs YAML front matter`)
  const meta = (parseYaml(match[1] ?? '') ?? {}) as Record<string, unknown>
  for (const key of ['page', 'title', 'description']) {
    if (typeof meta[key] !== 'string' || meta[key] === '') throw new Error(`${briefSlug}: missing "${key}"`)
  }
  return {
    slug: briefSlug,
    page: meta.page as string,
    title: meta.title as string,
    description: meta.description as string,
    order: typeof meta.order === 'number' ? meta.order : Number.MAX_SAFE_INTEGER,
    checks: Array.isArray(meta.checks) ? meta.checks.map((check) => checkText(check, briefSlug)) : [],
    body: (match[2] ?? '').trim(),
  }
}

const px = (value: string): number | null => {
  const match = /^(-?\d*\.?\d+)(px)?$/.exec(value.trim())
  return match ? Number(match[1]) : null
}

/** A spacing or size value with the Tailwind class suffix it maps to (4px is `1`). */
function withTailwindStep(value: string): string {
  const n = px(value)
  if (n === null) return value
  if (n === 0) return '0 (`0`)'
  if (n === 1) return '1px (`px`)'
  return `${n}px (\`${n / 4}\`)`
}

/** The theme's tokens in a few lines, so the prompt still works if DESIGN.md is not at hand. */
function themeSummary(spec: StrictSpec): string[] {
  const roles = fontRoles(spec.typography)
  const first = (stack: string | undefined) => (stack?.split(',')[0] ?? '').trim().replace(/^["']|["']$/g, '')
  const lines: string[] = []
  const fonts = [
    roles.heading && `${first(roles.heading)} for headings`,
    roles.sans && `${first(roles.sans)} for body text`,
    roles.mono && `${first(roles.mono)} for labels and code`,
  ].filter(Boolean)
  if (fonts.length > 0) lines.push(`- **Fonts:** ${fonts.join(', ')}.`)
  const type = Object.entries(spec.typography)
    .filter(([, token]) => token.fontSize !== undefined)
    .map(([name, token]) => `\`text-${name}\` ${token.fontSize}${token.fontWeight ? `/${token.fontWeight}` : ''}`)
  if (type.length > 0) {
    lines.push(`- **Type scale** (size/weight; each class also sets line height and tracking): ${type.join(', ')}.`)
  }
  const families = fontClasses(spec)
  if (families.length > 0) {
    lines.push(
      `- **Font per size:** a type class does not set the font family. Headings (\`<h1>\` to \`<h6>\`) get the heading font on their own; on any other element add the font class: ${families.join('; ')}.`,
    )
  }
  const spacing = Object.values(spec.spacing).map(withTailwindStep)
  if (spacing.length > 0) lines.push(`- **Spacing scale**, with the Tailwind step in brackets: ${spacing.join(', ')}.`)
  const corners = cornerClasses(spec)
  if (corners !== '') lines.push(`- **Corners:** ${corners}`)
  const colors = Object.entries(spec.colors)
    .filter(([, value]) => parseColor(value))
    .map(([name, value]) => `${name} ${value}`)
  if (colors.length > 0) lines.push(`- **Colors (light mode):** ${colors.join(', ')}.`)
  return lines
}

/** Which font class goes with which type class, for text that is not in a heading element. */
function fontClasses(spec: StrictSpec): string[] {
  const roles = fontRoles(spec.typography)
  const family = (stack: string | undefined) => (stack?.split(',')[0] ?? '').trim().replace(/^["']|["']$/g, '')
  // A theme may set its headings in its mono font. Both classes then give the
  // same family: heading sizes take `font-heading`, the rest `font-mono`.
  const shared = Boolean(roles.heading && roles.mono && family(roles.heading) === family(roles.mono))
  const byClass = new Map<string, string[]>()
  for (const [name, token] of Object.entries(spec.typography)) {
    if (token.fontSize === undefined || !token.fontFamily) continue
    const own = family(token.fontFamily)
    const cls =
      shared && own === family(roles.mono) ? (/^(display|h\d)$/.test(name) ? 'font-heading' : 'font-mono')
      : roles.heading && own === family(roles.heading) ? 'font-heading'
      : roles.mono && own === family(roles.mono) ? 'font-mono'
      : null
    if (cls) byClass.set(cls, [...(byClass.get(cls) ?? []), `\`text-${name}\``])
  }
  const classes = [...byClass].map(([cls, sizes]) => `\`${cls}\` with ${sizes.join(', ')}`)
  if (shared && classes.length > 0) classes.push('the two classes are the same family in this theme')
  return classes
}

/** The names of the theme's type classes, e.g. `display`, `h1`. */
const typeNames = (spec: StrictSpec): string[] =>
  Object.entries(spec.typography)
    .filter(([, token]) => token.fontSize !== undefined)
    .map(([name]) => name)

/**
 * `lib/utils.ts` for a shadcn project using this theme. shadcn's class merger
 * takes an unknown `text-*` class for a color, so `text-label
 * text-muted-foreground` loses one of the two until it is told these are sizes.
 */
export function mergeSetup(spec: StrictSpec): string {
  const names = typeNames(spec).map((name) => `"${name}"`).join(', ')
  return [
    'import { createCn } from "cn/config"',
    '',
    `// The theme's type classes are font sizes, not colors.`,
    'export const cn = createCn({',
    '  extend: {',
    '    classGroups: {',
    `      "font-size": [{ text: [${names}] }],`,
    '    },',
    '  },',
    '})',
  ].join('\n')
}

const TELLS: Record<string, string> = {
  'purple-gradient': 'purple or multi-color gradients',
  'emoji-icons': 'emoji used as icons or bullets',
  'nested-cards': 'a card inside a card',
  'glow-shadows': 'glows and colored shadows',
}

/** The theme's `strict` block as instructions. */
/** `a`, `a and b`, `a, b and c`. */
const listOf = (items: string[]): string =>
  items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`

function rules(spec: StrictSpec): string[] {
  const { strict } = spec
  const lines: string[] = []
  if (strict.colors.allow === 'tokens') {
    lines.push(
      '- **Colors:** only the theme\'s colors, through the semantic classes (`bg-background`, `text-foreground`, `bg-card`, `bg-primary`, `text-primary-foreground`, `text-muted-foreground`, `border-border` and so on). No hex, rgb or named colors in components, and no Tailwind palette classes such as `bg-blue-500` or `text-gray-600`.',
    )
  }
  if (strict.spacing.allow === 'scale') {
    const steps = Object.values(spec.spacing)
      .map((value) => px(value))
      .filter((n): n is number => n !== null)
      .map((n) => `\`${n / 4}\``)
    // Two steps a model reaches for by habit that this theme does not have.
    const [first = '7', second = '9'] = ['3', '6', '5', '10'].filter((step) => !steps.includes(`\`${step}\``))
    lines.push(
      `- **Spacing:** padding, margin and gap use only the scale's steps (${steps.join(', ')}) plus ${listOf(strict.spacing.extra)}. No arbitrary values such as \`p-[18px]\`, and no other steps such as \`p-${first}\` or \`gap-${second}\`. \`auto\` margins are fine. Widths and heights such as \`w-64\` or \`size-4\` are sizes, not spacing. This applies to the code you write: a stock component keeps the spacing inside it, unless this brief changes it. That includes the stock \`gap-1.5\` between a \`Button\`'s icon and its words: leave it, and add no gap class to the button.`,
    )
  }
  if (strict.typography.allow === 'scale') {
    const sizes = Object.entries(spec.typography)
      .filter(([, token]) => token.fontSize !== undefined)
      .map(([name]) => `\`text-${name}\``)
    lines.push(
      `- **Type:** every piece of text you write gets its size from one of ${sizes.join(', ')}, set on the element or on a parent it inherits from. Put \`text-${typeNames(spec).includes('body') ? 'body' : typeNames(spec).at(-1)}\` on the outermost element of the page you write. No other sizes. A stock shadcn component keeps the size it ships with, unless \`DESIGN.md\` or this brief gives that component its own style. A type class does not replace a weight class: where a stock component ships \`font-medium\` and the text should be regular, add \`font-normal\`.`,
    )
  }
  if (strict.typography.fonts === 'declared') {
    lines.push('- **Fonts:** only the theme\'s fonts, through `font-sans`, `font-heading` and `font-mono`. Do not add a font.')
  }
  if (strict.rounded.allow === 'scale') {
    const full = strict.rounded.full
    lines.push(
      full !== undefined
        ? `- **Corners:** only the \`rounded-*\` classes, which the theme already sets. No arbitrary radius, and \`rounded-full\` only where \`DESIGN.md\` or this brief names a full round, such as an avatar or a status dot. The theme allows a full round on a box up to ${full} across; Strict Check reports a larger one, and a pill counts by its height.`
        : '- **Corners:** only the `rounded-*` classes, which the theme already sets. No arbitrary radius. This theme has no full rounds: do not use `rounded-full`, and give a small mark a corner under half its height or none, because a box whose corner is half its height or more is a full round however it is written.',
    )
  }
  lines.push(`- **Contrast:** all text meets WCAG ${strict.contrast} against its background.`)
  lines.push(
    '- **Stock components:** a component from `components/ui`, and an `<a>` styled with `buttonVariants`, keeps the hover, pressed and disabled colors and the motion it ships with, unless this brief changes them, also where the layout notes give links a transition. They are the theme\'s colors under other names. The same holds for every other stock class that neither the notes nor this brief name, also in a file you edit: it stays. Examples are `TableHead`\'s `h-10`, `font-medium` and `whitespace-nowrap`, a `Checkbox`\'s `dark:bg-input/30`, and the `group-has-[:focus-visible]/field-label:` classes, which only act inside a shadcn `Field`. Classes the notes give a stock component go in its `className` where you use it, unless they say to change its file. `TableCell`\'s stock `p-2` then stays beside the `px-*` and `py-*` you pass, which is fine: those win.',
  )
  lines.push(
    '- **Forms:** a typed value is trimmed at both ends before it is checked and before it is shown again, so a field of spaces is empty. A field\'s error line comes after its helper text, and its `aria-describedby` names the helper text first. A group with an error names its error line in its own `aria-describedby`. A radio group takes `aria-invalid` on its `RadioGroup`; a set of checkboxes takes it on each `Checkbox`, because a `<fieldset>` does not take it.',
  )
  lines.push(
    '- **Long words:** text whose length the page does not control, such as an email address or a name the visitor typed and the page shows back, or a URL, gets `wrap-break-word` on its element. Otherwise one long word can widen its column past 375px.',
  )
  lines.push(
    '- **Dates and figures:** where the layout notes and this brief leave a case open, a `<time>` wraps only the date or the time, not the words around it. A date or a time inside a sentence is then plain text, and so is a copyright year. Where they ask for `tabular-nums` but not on which element, put it on the element that holds the whole figure or label line, so that it covers every figure in it; a `<time>` inside inherits it.',
  )
  lines.push(
    '- **Menus on small screens:** where the layout notes put the nav links behind a "Menu" button that opens a second `<nav>` in the header, the button is hidden from the notes\' breakpoint up (`md:hidden` for `md`). Escape closes the menu while focus is on the button or in the menu, through one `onKeyDown` on the `<header>` that acts only while the menu is open, and focus then goes to the button. The second `<nav>` marks the current page\'s link the way the row does. It shares the row\'s `aria-label`, which is right, because one of the two is always hidden.',
  )
  lines.push(
    '- **Counts:** a number with a noun reads right at one: "1 set", not "1 sets". Where this brief gives the words for only one of the two, write the other the same way.',
  )
  lines.push(
    '- **Sizes from data:** a height or a width that comes from data (a chart bar, a meter) is set with an inline `style`. That is the one use for an inline style.',
  )
  lines.push(
    '- **Focus:** every link and control shows a 2px outline on keyboard focus: `focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`. Where a class list that the layout notes or this brief spell out for a link, a nav link or a table\'s scroll box lacks them, add them to it. Keep `focus-visible:outline-solid` in it: in Tailwind 4 an `outline-none` on the same element, which stock components carry, otherwise hides the outline. An element that only gets focus from code (a heading or a message with `tabIndex={-1}`) gets the same outline written with `focus:` in place of `focus-visible:` (`focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring`): after a mouse click, a browser does not match `:focus-visible` on an element that code focuses. A link, a button or a field that code focuses keeps the `focus-visible:` classes it has: after a mouse click it shows no outline, which is how a browser treats every control, and is right. A stock component that ships its own focus ring (`Button`, `buttonVariants`, `Input`, `Textarea`, `Checkbox`, `Switch`, `RadioGroupItem`, `SelectTrigger`, the day buttons of a `Calendar`, `AccordionTrigger`, the close button of a `Sheet`) must lose that ring. Do it once, in the component\'s file in `components/ui`, which is yours to change: replace its `focus-visible:ring-*` classes with the outline classes, and in a field (an `Input`, a `Textarea`, a `SelectTrigger`, a `Checkbox`, a `Switch` or a `RadioGroupItem`) replace its `aria-invalid:ring-*` classes, the `dark:` ones included, with `aria-invalid:ring-0`, or a field with an error shows a tinted ring. `Button` has two more sets. Its base classes also carry `aria-invalid:ring-*` classes: replace them with `aria-invalid:ring-0`, as in a field. Its `aria-invalid:border-destructive` and `dark:aria-invalid:border-destructive/50` are borders and stay: what the notes say about a field\'s border classes is for fields. Its `destructive` variant carries `focus-visible:ring-*` classes of its own, the `dark:` one included: delete them and put nothing in their place, because the base classes already give every variant the outline. That variant\'s `focus-visible:border-destructive/40` is a border and stays. Wherever this rule says replace, change the classes in the file and do not add `ring-0` beside them: an added class only wins where it comes later and passes through `cn`. The stock `focus-visible:border-ring` can stay. These ring changes go only into the files of components that this page uses and that can take focus on it: a `Badge` that is not a link keeps its ring classes. So does `button.tsx` on a page with no `Button` and no `buttonVariants` link, even where the notes change that file for a hover. The `cn` import from the setup steps is another matter and goes into every file. A box that scrolls sideways (a code block, a wide table) gets `tabIndex={0}`, `role="region"`, an `aria-label` and the same outline, also at widths where it happens to fit. Where a focusable box touches the edges of a parent that has `overflow-hidden`, draw its outline inside it: `focus-visible:-outline-offset-2` in place of `focus-visible:outline-offset-2`.',
  )
  lines.push(
    '- **Controls:** no control keeps the browser\'s own look, at rest or open. A choice from a list is the project\'s `Select`, never a native `<select>`, whose arrow and open list the browser draws. A date is picked from the project\'s `Calendar` in a `Popover`, never an `<input type="date">`. A checkbox, a radio button and a switch are the project\'s `Checkbox`, `RadioGroup` and `Switch`, never a bare `<input>`. Add a missing one with `npx shadcn@latest add <name>`. The theme\'s layout notes say how it styles each one. For one they do not cover, make it match the theme\'s `Input`: the same height, corner, border, fill, text size and focus outline, with its icon as far from the right edge as the text is from the left, and a popup on the theme\'s surface with a 1px `border-border`, the theme\'s corner and text in the type scale. Leave no stock text size, glow ring or translucent ring on it. Every `Textarea` gets `resize-none` as well as the classes the notes give it, so the browser draws no grip in its corner. The stock one grows with its text (`field-sizing-content`), and one this brief sizes (`field-sizing-fixed` with `rows`) keeps that size. A field that searches or filters is an `Input` with `type="search"`, which tells a screen reader it is a search box. It also gets `[&::-webkit-search-cancel-button]:appearance-none`, which hides the clear button a browser draws in it. A `Select` takes its name from its visible label in two ways: the `<label>` has the `SelectTrigger`\'s `id` as its `htmlFor`, and the trigger has `aria-labelledby` with the label\'s `id`. Base UI links only its own `Select.Label`, which `select.tsx` does not wrap (its `SelectLabel` heads a group in the open list). A date field you write as a component takes a `ref` and passes it to its trigger, so code can focus it. The stock `CalendarDayButton` makes a `ref` and never attaches it, so add `ref={ref}` to its `<Button>`, or the arrow keys move nothing. End its classes with `dark:data-[selected-single=true]:hover:bg-primary dark:data-[selected-single=true]:hover:text-primary-foreground`: a `hover:` class loses to the chosen day\'s stock `data-[selected-single=true]:` classes, but a `dark:hover:` one beats them.',
  )
  const banned = Object.entries(strict.tells).filter(([, level]) => level === 'error').map(([tell]) => TELLS[tell] ?? tell)
  const discouraged = Object.entries(strict.tells).filter(([, level]) => level === 'warn').map(([tell]) => TELLS[tell] ?? tell)
  if (banned.length > 0) lines.push(`- **Not allowed:** ${banned.join('; ')}.`)
  if (discouraged.length > 0) lines.push(`- **Avoid:** ${discouraged.join('; ')}.`)
  if (strict.modes.dark) {
    lines.push('- **Dark mode:** the page must work with the `dark` class on `<html>`. Because every color comes from a semantic class, this needs no extra code; do not write `dark:` color overrides. A new shadcn project follows the system\'s mode and switches on the `d` key: leave that as it is, and add no mode switch of your own.')
  }
  return lines
}

/** The acceptance checks every page shares, from the theme's rules. */
function themeChecks(spec: StrictSpec): string[] {
  const { strict } = spec
  return [
    strict.colors.allow === 'tokens' && 'No color is written as a hex, rgb or Tailwind palette value in the page\'s code.',
    strict.spacing.allow === 'scale' && 'Every padding, margin and gap in the code you wrote is a step of the spacing scale.',
    strict.typography.allow === 'scale' && 'Every text element you wrote gets its size from a type-scale class, its own or an inherited one. Visually hidden text is exempt.',
    typeNames(spec).length > 0 && 'No file in `components/ui` imports `cn` from `"cn"` directly.',
    `Text contrast meets WCAG ${strict.contrast} in light${strict.modes.dark ? ' and dark' : ''} mode.`,
    'The page has one `<h1>`, headings are in order, and every image has alt text.',
    'Every interactive element can be reached with the keyboard and shows the focus outline from the rules.',
    'At 375px wide the page does not scroll sideways. Wide tables and code blocks scroll inside their own box, and a long email address or URL wraps.',
    'Every `Textarea` on the page has `resize-none`.',
    'The project builds without errors or warnings, apart from Vite\'s warning that a chunk is larger than 500 kB, which the `Select`, `Popover` and `Calendar` bring. That warning is about download size, not about the page: leave the build config, such as `vite.config.ts`, as it is.',
  ].filter((line): line is string => typeof line === 'string')
}

/**
 * The steps that get a project ready for the theme: install it, read
 * `DESIGN.md`, look at the project, and teach `cn()` the type classes.
 */
function setupSteps(theme: Theme, base: string): string[] {
  const { spec } = theme
  return [
    `1. **Check the theme is installed.** The project should have \`DESIGN.md\` in its root and the ${spec.name} variables in its global CSS. If not, run \`npx shadcn@latest add ${base}/r/${theme.slug}.json\` and save ${base}/themes/${theme.slug}/DESIGN.md as \`DESIGN.md\` in the project root. In a project without shadcn, use ${base}/themes/${theme.slug}/tailwind.css instead. ${
      // A new shadcn project imports Geist. A theme set in Geist must not say to remove it.
      namedFamilies(spec.typography).includes('Geist')
        ? 'One of the theme\'s fonts is Geist, which a new shadcn project already imports: keep that import. If the global CSS imports any other font the theme does not use, remove that import, and uninstall its package if nothing else uses it. Keep every font import the theme\'s install added, also one for a style no page uses yet.'
        : 'If the global CSS still imports a font the theme does not use (a new shadcn project imports Geist), remove that import, and uninstall its package if nothing else uses it. Keep every font import the theme\'s install added, also one for a style no page uses yet.'
    }`,
    '2. **Read `DESIGN.md` from start to finish.** It is the source of truth for every visual decision.',
    '3. **Look at the project before writing code.** Use its framework, router and file layout. For controls (buttons, inputs, tabs, menus, dialogs, accordions, data tables) use the components in `components/ui`, and add a missing one with `npx shadcn@latest add <name>` rather than writing your own, unless this brief names a plain element. Layout is plain elements with theme classes: sections, panels, figures and lists need no component.',
    ...(typeNames(spec).length > 0
      ? [
          `4. **Teach \`cn()\` the theme's type classes.** shadcn's class merger does not know ${typeNames(spec).slice(0, 2).map((name) => `\`text-${name}\``).join(' or ')}. It takes them for colors, so \`cn("text-${typeNames(spec).at(-1)} text-muted-foreground")\` silently drops one of the two, and a type class passed to a stock component does not replace its size. In a new shadcn project, \`lib/utils.ts\` only passes \`cn\` on from the \`cn\` package. Unless the file already holds the lines below, change it to:`,
          '',
          '   ```ts',
          ...mergeSetup(spec).split('\n').map((line) => (line ? `   ${line}` : '')),
          '   ```',
          '',
          '   Then make every file in `components/ui` use it: where one has `import { cn } from "cn"`, change that line to import `cn` from the project\'s utils file (`@/lib/utils` in a default setup). Do the same for each component you add later. If the project uses `tailwind-merge` instead of the `cn` package, its components already import from the utils file: pass the same object to `extendTailwindMerge` and keep `clsx`.',
        ]
      : []),
  ]
}

/**
 * Composes the full prompt for one page. The brief supplies the page; the
 * theme summary, the rules and most of the checklist are generated from the
 * theme's spec, so they cannot drift from it.
 */
export function composePrompt(theme: Theme, brief: PageBrief, siteUrl: string): string {
  const { spec } = theme
  const base = siteUrl.replace(/\/+$/, '')
  const checks = [...brief.checks, ...themeChecks(spec)]
  const dos = spec.sections.find((section) => section.canonical === "Do's and Don'ts")
  return [
    `# Build ${/^[aeiou]/i.test(brief.page) ? 'an' : 'a'} ${brief.page} with the ${spec.name} theme`,
    '',
    `You are building one page in an existing project: ${brief.description} Follow this brief closely. \`DESIGN.md\` decides the tokens: colors, type, spacing steps and corners. This brief decides the layout, its widths included, and which token goes where. If this brief names a color, a type size, a spacing step or a corner that \`DESIGN.md\` does not have, \`DESIGN.md\` wins.`,
    '',
    '## Before you start',
    '',
    ...setupSteps(theme, base),
    `${typeNames(spec).length > 0 ? 5 : 4}. **Write real content.** If the user gave you details about their product, use them. Otherwise use the sample product in this brief and write the rest of the copy yourself: specific and plain, the way the samples read. Invent the company and people names; do not use real ones. Never use lorem ipsum. A link with no destination yet points to \`#\`. Set the page's \`<title>\` and meta description.`,
    '',
    `## The theme in short`,
    '',
    ...themeSummary(spec),
    ...(theme.promptNotes ? ['', theme.promptNotes] : []),
    '',
    '## The page',
    '',
    ...(theme.promptNotes ? ['Where this section and the layout notes above differ, this section wins.', ''] : []),
    brief.body,
    '',
    '## Rules',
    '',
    ...rules(spec),
    ...(dos ? ['', `From the theme's own do's and don'ts:`, '', dos.body.trim()] : []),
    '',
    '## Check before you finish',
    '',
    'Go through this list against the code you wrote, and fix anything that fails.',
    '',
    ...checks.map((check) => `- [ ] ${check}`),
    '',
    'Then tell the user which checks pass, which you could not verify, and anything in this brief you did not do and why.',
    '',
  ].join('\n')
}

/** A theme's skill: where it is kept in the repo and what the file holds. */
export interface ThemeSkill {
  theme: string
  /** The skill's name, which is also its folder under `skills/`. */
  name: string
  /** The whole `SKILL.md`. */
  source: string
}

/** A brief's wording, for a text that is read without one. */
const withoutBrief = (text: string): string =>
  text.replaceAll('This brief', 'The page brief').replaceAll('this brief', 'the page brief')

/**
 * Composes a theme's skill: what an agent needs to build any UI in the theme,
 * not one page. It is the page prompt without the page: the same setup, the
 * same summary, layout notes and rules, generated from the same spec, and the
 * list of page briefs to fetch when the user asks for one of those pages.
 */
export function composeSkill(theme: Theme, siteUrl: string): ThemeSkill {
  const { spec } = theme
  const base = siteUrl.replace(/\/+$/, '')
  const name = `strict-theme-${theme.slug}`
  const dos = spec.sections.find((section) => section.canonical === "Do's and Don'ts")
  const summary = (spec.description ?? '').trim()
  const pages = theme.briefs.map((brief) => brief.page)
  // One line of YAML, in quotation marks: a description may hold a colon.
  const description = [
    `Build UI in the ${spec.name} theme from strictthemes.com.`,
    summary,
    `Use it when the project's DESIGN.md is ${spec.name}, or when the user asks for the ${spec.name} theme.`,
    `It installs the theme into a shadcn project, gives its layout rules${pages.length > 0 ? ` and its page briefs (${listOf(pages)})` : ''}, and checks the result with Strict Check.`,
  ].filter((part) => part !== '').join(' ')
  const body = [
    `# ${spec.name}`,
    '',
    summary,
    '',
    `This skill is for building UI in the ${spec.name} theme: a page, a section or a component. \`DESIGN.md\` decides the tokens: colors, type, spacing steps and corners. The notes below say how the theme lays a page out and which token goes where.`,
    '',
    '## Before you start',
    '',
    ...setupSteps(theme, base),
    '',
    '## The theme in short',
    '',
    ...themeSummary(spec),
    ...(theme.promptNotes
      ? [
          '',
          'The layout notes below are written around a sample organisation and its pages. If the user gave you their own product, its name, pages and content replace the sample\'s, and the layout, the colors and the classes stay as the notes give them.',
          '',
          theme.promptNotes,
        ]
      : []),
    '',
    '## Rules',
    '',
    ...rules(spec),
    ...(dos ? ['', `From the theme's own do's and don'ts:`, '', dos.body.trim()] : []),
    '',
    ...(theme.briefs.length > 0
      ? [
          '## Page briefs',
          '',
          `${spec.name} has a full brief for each of these pages: sections, layout, sample content and checks. When the user asks for one of them, fetch its brief and follow it. Where a brief and the notes above differ, the brief wins.`,
          '',
          ...theme.briefs.map((brief) => `- **${brief.title}:** ${brief.description} ${base}/themes/${theme.slug}/prompts/${brief.slug}.md`),
          '',
        ]
      : []),
    '## Check before you finish',
    '',
    'Build the project, then measure it against the theme with Strict Check:',
    '',
    '```bash',
    'npx @strictthemes/check --dist dist',
    '```',
    '',
    '`dist` is the folder the build wrote. Add `--path /pricing` for each page you touched other than `/`. Fix every error it lists by using a value the theme allows, and run it again until the last line starts with `Passed`. Do not mark code `strict-ignore` to get there.',
    '',
    'Then tell the user what you built, what the check reported, and anything you could not verify.',
    '',
  ].join('\n')
  const source = ['---', `name: ${name}`, `description: ${JSON.stringify(description)}`, '---', '', withoutBrief(body)].join('\n')
  return { theme: theme.slug, name, source }
}
