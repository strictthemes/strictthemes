---
name: strict-theme-strict-one
description: "Build UI in the Strict One theme from strictthemes.com. A disciplined, Swiss-grid editorial theme. One accent, hard edges, no decoration. Use it when the project's DESIGN.md is Strict One, or when the user asks for the Strict One theme. It installs the theme into a shadcn project, gives its layout rules and its page briefs (landing page, pricing page, article page, documentation page and dashboard), and checks the result with Strict Check."
---

# Strict One

A disciplined, Swiss-grid editorial theme. One accent, hard edges, no decoration.

This skill is for building UI in the Strict One theme: a page, a section or a component. `DESIGN.md` decides the tokens: colors, type, spacing steps and corners. The notes below say how the theme lays a page out and which token goes where.

## Before you start

1. **Check the theme is installed.** The project should have `DESIGN.md` in its root and the Strict One variables in its global CSS. If not, run `npx shadcn@latest add https://strictthemes.com/r/strict-one.json` and save https://strictthemes.com/themes/strict-one/DESIGN.md as `DESIGN.md` in the project root. In a project without shadcn, use https://strictthemes.com/themes/strict-one/tailwind.css instead. If the global CSS still imports a font the theme does not use (a new shadcn project imports Geist), remove that import, and uninstall its package if nothing else uses it. Keep every font import the theme's install added, also one for a style no page uses yet.
2. **Read `DESIGN.md` from start to finish.** It is the source of truth for every visual decision.
3. **Look at the project before writing code.** Use its framework, router and file layout. For controls (buttons, inputs, tabs, menus, dialogs, accordions, data tables) use the components in `components/ui`, and add a missing one with `npx shadcn@latest add <name>` rather than writing your own, unless the page brief names a plain element. Layout is plain elements with theme classes: sections, panels, figures and lists need no component.
4. **Teach `cn()` the theme's type classes.** shadcn's class merger does not know `text-display` or `text-h1`. It takes them for colors, so `cn("text-label text-muted-foreground")` silently drops one of the two, and a type class passed to a stock component does not replace its size. In a new shadcn project, `lib/utils.ts` only passes `cn` on from the `cn` package. Unless the file already holds the lines below, change it to:

   ```ts
   import { createCn } from "cn/config"

   // The theme's type classes are font sizes, not colors.
   export const cn = createCn({
     extend: {
       classGroups: {
         "font-size": [{ text: ["display", "h1", "h2", "body", "label"] }],
       },
     },
   })
   ```

   Then make every file in `components/ui` use it: where one has `import { cn } from "cn"`, change that line to import `cn` from the project's utils file (`@/lib/utils` in a default setup). Do the same for each component you add later. If the project uses `tailwind-merge` instead of the `cn` package, its components already import from the utils file: pass the same object to `extendTailwindMerge` and keep `clsx`.

## The theme in short

- **Fonts:** Archivo for headings, IBM Plex Sans for body text, IBM Plex Mono for labels and code.
- **Type scale** (size/weight; each class also sets line height and tracking): `text-display` 56px/700, `text-h1` 36px/700, `text-h2` 24px/600, `text-body` 16px/400, `text-label` 12px/500.
- **Font per size:** a type class does not set the font family. Headings (`<h1>` to `<h6>`) get the heading font on their own; on any other element add the font class: `font-heading` with `text-display`, `text-h1`, `text-h2`; `font-mono` with `text-label`.
- **Spacing scale**, with the Tailwind step in brackets: 4px (`1`), 8px (`2`), 16px (`4`), 32px (`8`), 64px (`16`).
- **Corners:** `rounded-none` 0px, `rounded-sm` 2px, `rounded-md` 4px.
- **Colors (light mode):** primary #1F3BFF, on-primary #FFFFFF, secondary #111111, on-secondary #FFFFFF, tertiary #FF4F00, on-tertiary #111111, neutral #6B6B6B, background #FFFFFF, surface #F5F5F4, foreground #111111, border #E2E2E0, error #C62828.

The layout notes below are written around a sample organisation and its pages. If the user gave you their own product, its name, pages and content replace the sample's, and the layout, the colors and the classes stay as the notes give them.

### How Strict One pages are laid out

- **Container:** every section's content sits in a `max-w-[1200px]` container, centered, with `px-4` on small screens and `px-8` from `md` up. This width is the one arbitrary value allowed.
- **Grid:** inside the container, a 12-column grid with `gap-x-8` from `md` up, and a single column below `md`. The grid only sets columns: every vertical distance comes from the rhythm rule, written as `gap-y-*` or `mt-*`, also when the grid is stacked. Align content to the grid's left edge. Do not center text blocks.
- **Sections:** a section ends with `pb-16`. A section that opens with a rule (a section header, or its own top border) has nothing above the rule: the rule is its first line, and the space before it is the previous section's `pb-16`. A section with no rule, such as a hero, also has `pt-16`. A one-line row between sections (a proof row, a single link) has `pb-8` and no top padding. Where the page brief gives a section its own top border and `pt-16` (a closing call to action), that is the whole opening: the border is `border-border`, and the section has no section header. No background bands, no boxes around sections.
- **Vertical rhythm:** `gap-2` between a label and the thing it labels, `gap-4` between a heading and its paragraph and between paragraphs, `gap-8` between blocks, and `mt-8` between a section header and the section's content. In a list of links or features, `gap-2` between items and `gap-4` under the heading or label that names the list. A time or a byline under a line of text counts as its label: `gap-2`. `gap-4` between a button and a link beside it. A header row has `py-4`, with `gap-8` between its items from `md` up and `gap-4` below.
- **Section header:** a section opens with a 1px `border-foreground` top rule and `pt-4`. Under it, columns 1–3 hold a label in the form `01 / FEATURES` in `text-muted-foreground`, and columns 4–12 hold the section heading, an `<h2>` in `text-h1`. Where the page brief gives only the label, write the heading yourself. Below `md` the label sits above the heading with `gap-y-2`, which changes nothing from `md` up, where the two share a row.
- **Borders:** every line is 1px and `border-border`, unless the page brief gives it another width (the 2px left line of a contents link) or says `border-foreground`. The header's bottom line and the footer's top line run the full width of the window, or of the main column where a sidebar stands beside the header (an app screen); a header above a sidebar keeps the full width. Every other line stays inside the container.
- **Labels:** eyebrows, table headers, captions, bylines, nav links, button and badge text, and metadata are labels: `font-mono text-label uppercase`. Write a label as a short fragment, not a sentence; text that needs a full sentence is body text. Email addresses and values in a table or a figure are never uppercased. In a figure that shows a piece of the product (a thread of comments, a list of versions), the names, times and values are `font-mono text-label` without `uppercase`; only the figure's caption is a label. A table inside a figure follows the Tables note instead. A "label heading" is a real heading element styled as a label: an `<h2>` in a footer, otherwise `<h2>` or `<h3>`, whichever keeps the heading order.
- **Text color:** body text, headings, label headings and nav links are `text-foreground`; in a `bg-sidebar` area they are `text-sidebar-foreground`. A label heading over a list of links (a footer column, "On this page") is a heading, so `text-foreground` too. Other labels, captions and metadata are `text-muted-foreground`, a group name in a `<p>` over a list of links included. A button's text color comes from its variant. Paragraphs are never muted: hierarchy comes from size and weight, not color.
- **Measure:** a paragraph of body text is at most `max-w-lg` wide (512px, 65 to 70 characters a line in this font), however many columns it sits in.
- **Links:** a text link is `text-primary underline underline-offset-4 hover:text-foreground` and inherits its size. A link in a nav or in a footer's link list is `text-foreground` and gets an underline on hover, unless the page brief gives that list its own colors. In the header, the link to the page itself, where the brief names one, has `aria-current="page"` and a lasting `underline underline-offset-4`; the brief lists the header's links in order, and a link with no page here points to `#`.
- **Dates:** a date is written day, month name, year (`12 March 2026`, uppercased where it is in a label), a time of day as `14:05`, and both as `12 March 2026, 14:05`. Every date or time shown, in a label, a table or a figure, is a `<time>` with a `dateTime` attribute; a copyright year is not.
- **Buttons:** use the shadcn `Button` with `className="rounded-sm px-4 font-mono text-label uppercase"`, so labels are uppercase mono as `DESIGN.md` asks. A call to action that goes to another page is an `<a>` with the same classes: write `cn(buttonVariants({ variant }), "…")`, because `buttonVariants` alone does not merge classes and the stock size and corners would win. `Button` is for actions, so on a marketing page most "buttons" in the page brief are such links. One default button per screenful. Other actions, a "Menu" button included, use `variant="outline"` or a text link. A group of buttons where one is selected (a filter, a period switch) is a `role="group"` with an `aria-label` and `gap-1`; the selected one has `aria-pressed="true"` and `variant="secondary"`, the rest `variant="outline"`.
- **Badges:** the shadcn `Badge` with `className="h-auto rounded-none px-2 py-1 font-mono text-label uppercase"`. The padding is the one `DESIGN.md` gives a badge, in place of the stock one. At most one badge in a view is the signal badge `DESIGN.md` describes: the `secondary` variant with `bg-tertiary text-tertiary-foreground` added. Every other badge is outlined: `variant="outline"`, which gives the stock 1px `border-border` line, `text-foreground` and no fill; add no fill to it.
- **Inputs:** the shadcn `Input` with `className="rounded-sm py-0 text-body md:text-body"`, and an `aria-label` when it has no visible label. It keeps the stock `h-8` (32px), the height of a stock `Button`, so the two line up in a row with `items-center`; `py-0` in place of the stock `py-1` leaves room inside its 1px borders for a line of `text-body` (25.6px).
- **Icons:** from the project's icon set, with `size-4` and `strokeWidth={1.5}`.
- **Lists:** a numbered or bulleted list in running text is `list-decimal` or `list-disc` with `pl-4`, and `gap-2` between its items.
- **Corners:** controls use `rounded-sm` (2px), panels and code blocks `rounded-md` (4px), badges and figures inside panels `rounded-none`.
- **Figures:** a figure's caption is a label below its panel, outside it, with `mt-2`.
- **Panels:** a panel is a plain element with a 1px border and `rounded-md`. On a content page, panels that hold a figure or code are `bg-card`; on an app screen every panel is `bg-background`. Do not use the shadcn `Card` for a panel: it ships larger corners and a ring.
- **Surfaces:** flat. No shadows, no blur, no gradients. Where a stock component ships a shadow, a blur or a dimmed overlay (`Sheet`, `DropdownMenu`, `Tooltip`), remove it: with `className` where that reaches, otherwise by editing the file in `components/ui`, which is yours to change. Use a 1px border instead of a shadow and `bg-background/80` for an overlay.
- **Tables:** a table's body text is `text-body`; set it on the `Table` or the `<table>`. Column header cells (`scope="col"`) are labels in `text-muted-foreground`. Cells have `px-4 py-2`, in a plain `<table>` and in the stock `Table` alike: the stock `TableHead` ships `px-2`, its `TableCell` `p-2`, so in `components/ui/table.tsx` replace `TableHead`'s `px-2` and `TableCell`'s `p-2` with `px-4 py-2`. `TableHead` keeps its stock `h-10` (a least height, which `py-2` and one line fill), and a `<th>` in a plain `<table>` takes no height class; both stock cells keep `whitespace-nowrap`; a cell that holds a sentence gets `whitespace-normal`. Where the table lines up with text above it (in a section, a content column or a padded panel), add `first:pl-0 last:pr-0` in each cell's `className` so its first and last column start and end where the text does; where it touches a panel's border, do not. Where no row does anything (every table on a Strict One page), take the stock `TableRow`'s `hover:bg-muted/50` and `has-aria-expanded:bg-muted/50` out of the file; `data-[state=selected]:bg-muted` can stay. The stock `Table` wraps the `<table>` in its scroll box and puts its `className` on the `<table>`, inside that box: a margin around the table (`my-8`, `mt-8`) goes on a `<div>` wrapped around the `Table`, never in its `className`. A table's name is the heading or label heading above it, repeated as its scroll box's `aria-label`; do not use a `<caption>`, which scrolls sideways with the table. A table that can be wider than its box scrolls in a box that is reachable with the keyboard: `tabIndex={0}`, `role="region"` and an `aria-label`, on a wrapper `<div>`, never on the `<table>`. For the stock `Table`, edit `components/ui/table.tsx`: put these on its scroll box and add a required `label` prop for the name. A table that always fits needs none of this; one that should scroll on a phone rather than squeeze gets `min-w-lg`.
- **Primary color:** only for the one main action and for links. Never for large fills such as chart bars, bands or panels; those are `bg-foreground`, `bg-card` or a border.
- **Menus on small screens:** a "Menu" button with `aria-expanded` and `aria-controls` that shows the links as a list inside the `<header>`, under its row, with a 1px top border and `py-2`; each link is a block with `py-2`. Give the header's row `flex-wrap`, so that on a narrow phone it breaks into two lines rather than run off the screen. Use the shadcn `Sheet` only for a full sidebar; such a sheet is `bg-sidebar`, 256px wide (`data-[side=left]:w-64`, since a plain `w-64` loses to the stock width) and has a visually hidden `SheetTitle`, placed straight in `SheetContent` with no `SheetHeader`, whose padding the stock gap would then space. It is rendered outside the page's root, so it also needs `text-body`, plus `overflow-y-auto`, `px-4`, `pb-8` and `pt-16` to clear its close button. Put everything it shows in one wrapper with the page's own gaps, so the stock `gap-4` of `SheetContent` has nothing to space. Its trigger takes `render={<Button … />}` in a Base UI project and `asChild` in a Radix one; the trigger sets `aria-expanded` and `aria-controls` itself, so do not add them. In `components/ui/sheet.tsx`, give the close button's `XIcon` `strokeWidth={1.5}` and its `Button` `rounded-sm`; it keeps its stock size and place. A page never has two "Menu" buttons.
- **Motion:** in the code you write, the only transition is color: the links you write get `transition-colors duration-150`. Nothing moves on scroll. Stock components keep the motion they ship with, and so does an `<a>` styled with `buttonVariants`.

## Rules

- **Colors:** only the theme's colors, through the semantic classes (`bg-background`, `text-foreground`, `bg-card`, `bg-primary`, `text-primary-foreground`, `text-muted-foreground`, `border-border` and so on). No hex, rgb or named colors in components, and no Tailwind palette classes such as `bg-blue-500` or `text-gray-600`.
- **Spacing:** padding, margin and gap use only the scale's steps (`1`, `2`, `4`, `8`, `16`) plus 0 and 1px. No arbitrary values such as `p-[18px]`, and no other steps such as `p-3` or `gap-6`. `auto` margins are fine. Widths and heights such as `w-64` or `size-4` are sizes, not spacing. This applies to the code you write: a stock component keeps the spacing inside it, unless the page brief changes it.
- **Type:** every piece of text you write gets its size from one of `text-display`, `text-h1`, `text-h2`, `text-body`, `text-label`, set on the element or on a parent it inherits from. Put `text-body` on the outermost element of the page you write. No other sizes. A stock shadcn component keeps the size it ships with, unless `DESIGN.md` or the page brief gives that component its own style. A type class does not replace a weight class: where a stock component ships `font-medium` and the text should be regular, add `font-normal`.
- **Fonts:** only the theme's fonts, through `font-sans`, `font-heading` and `font-mono`. Do not add a font.
- **Corners:** only the `rounded-*` classes, which the theme already sets. No arbitrary radius, and `rounded-full` only where `DESIGN.md` or the page brief names a full round, such as an avatar or a status dot. The theme allows a full round on a box up to 64px across; Strict Check reports a larger one, and a pill counts by its height.
- **Contrast:** all text meets WCAG AA against its background.
- **Stock components:** a component from `components/ui`, and an `<a>` styled with `buttonVariants`, keeps the hover, pressed and disabled colors and the motion it ships with, unless the page brief changes them. They are the theme's colors under other names.
- **Counts:** a number with a noun reads right at one: "1 set", not "1 sets". Where the page brief gives the words for only one of the two, write the other the same way.
- **Sizes from data:** a height or a width that comes from data (a chart bar, a meter) is set with an inline `style`. That is the one use for an inline style.
- **Focus:** every link and control shows a 2px outline on keyboard focus: `focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`. Keep `focus-visible:outline-solid` in it: in Tailwind 4 an `outline-none` on the same element, which stock components carry, otherwise hides the outline. An element that only gets focus from code (a heading or a message with `tabIndex={-1}`) gets the same outline written with `focus:` in place of `focus-visible:` (`focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring`): after a mouse click, a browser does not match `:focus-visible` on an element that code focuses. A link, a button or a field that code focuses keeps the `focus-visible:` classes it has: after a mouse click it shows no outline, which is how a browser treats every control, and is right. A stock component that ships its own focus ring (`Button`, `buttonVariants`, `Input`, `Textarea`, `Checkbox`, `Switch`, `AccordionTrigger`, the close button of a `Sheet`) must lose that ring. Do it once, in the component's file in `components/ui`, which is yours to change: replace its `focus-visible:ring-*` classes with the outline classes, and in a field replace its `aria-invalid:ring-*` classes, the `dark:` ones included, with `aria-invalid:ring-0`, or a field with an error shows a tinted ring. `Button` has two more sets. Its base classes also carry `aria-invalid:ring-*` classes: replace them with `aria-invalid:ring-0`, as in a field. Its `destructive` variant carries `focus-visible:ring-*` classes of its own, the `dark:` one included: delete them and put nothing in their place, because the base classes already give every variant the outline. Wherever this rule says replace, change the classes in the file and do not add `ring-0` beside them: an added class only wins where it comes later and passes through `cn`. The stock `focus-visible:border-ring` can stay. These ring changes go only into the files of components that this page uses and that can take focus on it: a `Badge` that is not a link keeps its ring classes. The `cn` import from the setup steps is another matter and goes into every file. A box that scrolls sideways (a code block, a wide table) gets `tabIndex={0}`, `role="region"`, an `aria-label` and the same outline, also at widths where it happens to fit. Where a focusable box touches the edges of a parent that has `overflow-hidden`, draw its outline inside it: `focus-visible:-outline-offset-2` in place of `focus-visible:outline-offset-2`.
- **Not allowed:** purple or multi-color gradients; emoji used as icons or bullets.
- **Avoid:** a card inside a card; glows and colored shadows.
- **Dark mode:** the page must work with the `dark` class on `<html>`. Because every color comes from a semantic class, this needs no extra code; do not write `dark:` color overrides. A new shadcn project follows the system's mode and switches on the `d` key: leave that as it is, and add no mode switch of your own. If the page has a native `<select>` or a date or time field, tell the browser the mode, or its list and its picker stay light in dark mode: in the global CSS, give `:root` `color-scheme: light` and `.dark` `color-scheme: dark`.

From the theme's own do's and don'ts:

- Do keep one accent color per screen.
- Do let whitespace separate content.
- Don't use gradients, glows, glassmorphism or drop shadows.
- Don't use emoji as icons or bullets.
- Don't introduce a color, size or radius that is not a token above.

## Page briefs

Strict One has a full brief for each of these pages: sections, layout, sample content and checks. When the user asks for one of them, fetch its brief and follow it. Where a brief and the notes above differ, the brief wins.

- **Landing page:** a marketing landing page for a software product, from header to footer. https://strictthemes.com/themes/strict-one/prompts/landing.md
- **Pricing page:** a pricing page with three plans, a monthly and yearly switch, a comparison table and a FAQ. https://strictthemes.com/themes/strict-one/prompts/pricing.md
- **Article page:** a long-form article or blog post page built for reading, with a table of contents. https://strictthemes.com/themes/strict-one/prompts/article.md
- **Documentation page:** a documentation page with a sidebar, the content, and an "on this page" list. https://strictthemes.com/themes/strict-one/prompts/docs.md
- **Dashboard:** the overview screen of a web app, with navigation, key numbers, a chart and a table. https://strictthemes.com/themes/strict-one/prompts/dashboard.md

## Check before you finish

Build the project, then measure it against the theme with Strict Check:

```bash
npx @strictthemes/check --dist dist
```

`dist` is the folder the build wrote. Add `--path /pricing` for each page you touched other than `/`. Fix every error it lists by using a value the theme allows, and run it again until the last line starts with `Passed`. Do not mark code `strict-ignore` to get there.

Then tell the user what you built, what the check reported, and anything you could not verify.
