---
title: "Web design trends for 2027: what browsers actually support"
description: Ten web design trends for 2027, each checked against MDN's browser data on 26 November 2026. What works in every browser, what is still Chrome only, and what to skip.
kind: Explained
date: 2026-11-26
checked: 2026-11-26
---

Most lists of web design trends are about taste: a colour, a font style, a mood. Taste is hard to check. This list is about what you can build. Each trend for 2027 below is a feature that browsers shipped, or a rule that now applies, and each one has a support status you can look up.

We read every MDN page, its browser compatibility data, web.dev's Baseline page and the European Accessibility Act on EUR-Lex on 26 November 2026. Browser support moves every month, so check the linked page before you rely on a feature.

## TL;DR

- **Ready in every major browser:** container queries, `:has()`, modern colour (`light-dark()`, `oklch()`, `color-mix()`), entry animations with `@starting-style`, popovers and button commands, and balanced headings.
- **New in every major browser in 2026:** anchor positioning and scroll-driven animations. Use them with a fallback for older browsers.
- **Almost there:** view transitions between pages. Chrome, Edge and Safari have them. MDN's data lists Firefox 162, due 8 December 2026.
- **Not ready:** a fully styled `<select>`, `text-wrap: pretty` in Firefox, `interpolate-size`, `if()` and `@function`. Use them only as an extra that can fail quietly.
- **Not a browser feature, but real:** the European Accessibility Act has applied to many consumer services since 28 June 2025. Accessibility is a requirement now, not a trend.
- **For teams that build with a coding agent:** write your design down as tokens in a `DESIGN.md` file, so every page uses the same values.

## How to read "support" in this guide

![web.dev's Baseline page, which explains how web platform features become Baseline.](/guides/web-design-trends-2027/baseline.jpg "web.dev, Baseline, 26 November 2026")

We use the Baseline labels that MDN shows at the top of each page. web.dev defines them:

- **Newly available:** the feature works in all the core browsers. Those are Chrome, Edge, Firefox and Safari, on desktop and mobile.
- **Widely available:** 30 months have passed since it became newly available. Most sites can use it without worrying about support.
- **Limited availability:** at least one core browser does not support it yet.

Where a feature has no label yet, we give the browser versions from MDN's compatibility data.

## The trends at a glance

| Trend | Support today | Effort | Adopt in 2027? |
| --- | --- | --- | --- |
| View transitions in one page | Baseline 2025, newly available | Low | Yes |
| View transitions between pages | Limited. Firefox 162 is listed for 8 December 2026 | Low | Yes, as an extra |
| Scroll-driven animations | Baseline 2026, newly available | Medium | Yes, with a fallback |
| Anchor positioning | Baseline 2026, newly available | Medium | Yes, with a fallback |
| Entry animations with `@starting-style` | Baseline 2024, newly available | Low | Yes |
| Container queries | Widely available | Medium | Yes |
| `:has()` | Widely available | Low | Yes |
| `light-dark()`, `oklch()`, `color-mix()` | Widely available | Low | Yes |
| Popovers and button commands | Baseline 2025, newly available | Low | Yes |
| Fully styled `<select>` | Limited. Chrome, Edge, Safari 27 | Medium | Only as an extra |
| `text-wrap: balance` | Baseline 2024, newly available | Very low | Yes |
| `text-wrap: pretty` | Chrome, Edge, Safari 26. Not Firefox | Very low | Yes, it fails quietly |
| Accessibility under the EAA | Law since 28 June 2025 | Ongoing | Required in scope |
| Design tokens for coding agents | Not a browser feature | Low | Yes, if you use agents |

## 1. View transitions

A view transition animates the change from one state of a page to the next. The browser takes a picture of the old state, updates the page, and fades or slides between the two. You write a few lines of CSS instead of an animation library.

![MDN's page for Document startViewTransition, marked Baseline 2025, newly available.](/guides/web-design-trends-2027/view-transitions.jpg "MDN, Document: startViewTransition(), 26 November 2026")

**Within one page:** `document.startViewTransition()` is Baseline 2025, newly available. Firefox added it in version 144, in October 2025.

```js
document.startViewTransition(() => showNextSlide());
```

**Between pages:** a normal link from one page to another can animate too, with one rule in the CSS of both pages. MDN marks `@view-transition` as limited availability. Its data shows Chrome and Edge 126 and Safari 18.2. It lists Firefox 162 with a release date of 8 December 2026.

```css
@view-transition {
  navigation: auto;
}
```

![MDN's page for the view-transition at-rule, marked limited availability.](/guides/web-design-trends-2027/cross-document.jpg "MDN, @view-transition, 26 November 2026")

**Examples:** two developer sites already animate page changes this way. We read their stylesheets on 26 November 2026.

![Adam Argyle's Nerdy Notebook, a CSS notebook with a pink and purple gradient title and a sidebar of demos.](/guides/web-design-trends-2027/example-nerdy-dev.jpg "nerdy.dev, Nerdy Notebook, 26 November 2026")

Adam Argyle's Nerdy Notebook at nerdy.dev sets `@view-transition { navigation: auto; }` and gives the first heading on each page a `view-transition-name`, so the browser can animate the title from one page to the next.

![Una Kravets' home page, with a large photo, a serif HELLO WORLD heading and social icons.](/guides/web-design-trends-2027/example-una-im.jpg "una.im, home page, 26 November 2026")

**Example:** Una Kravets' site at una.im also uses `@view-transition { navigation: auto; }`, wrapped in a `prefers-reduced-motion` check so it turns off for people who ask for less motion.

**Worth it?** Yes. A browser without support just loads the next page as it always did. That makes page transitions one of the safest web design trends to adopt. They also work on a plain static site, with no JavaScript framework. Respect `prefers-reduced-motion` for people who turn motion off.

## 2. Scroll-driven animations

Scroll-driven animations tie a CSS animation to the scroll position instead of a clock. A reading progress bar, a header that shrinks, or an image that fades in as it enters the screen can all be pure CSS.

![MDN's page for the animation-timeline property, marked Baseline 2026, newly available.](/guides/web-design-trends-2027/scroll-driven.jpg "MDN, animation-timeline, 26 November 2026")

MDN marks `animation-timeline` as Baseline 2026, newly available. Firefox was the last core browser to add it, in version 159 on 27 October 2026. Safari added it in version 26.

```css
.progress {
  animation: grow linear;
  animation-timeline: scroll();
}
```

![Stripe's home page, with a colourful ribbon gradient behind the headline Financial infrastructure to grow your revenue.](/guides/web-design-trends-2027/example-stripe.jpg "stripe.com, home page, 26 November 2026")

**Example:** Stripe's stylesheets use `animation-timeline: scroll(inline self)` with an animation named `detect-scroll`, which ties a style to a row's sideways scroll. Its dialog overlay uses a named scroll timeline inside `@supports (animation-timeline: scroll())`, the same safe pattern as above.

**Worth it?** Yes, for small touches. It replaces scroll listeners in JavaScript. Firefox support is only a month old, so wrap it in `@supports (animation-timeline: scroll())` and make sure the page reads fine without the animation.

## 3. Anchor positioning

Anchor positioning places one element next to another in pure CSS. Tooltips, menus and labels can sit next to their button, and flip to the other side when they would leave the screen. Until now this needed a JavaScript library.

![MDN's page for the anchor-name property, marked Baseline 2026, newly available since January 2026.](/guides/web-design-trends-2027/anchor-positioning.jpg "MDN, anchor-name, 26 November 2026")

MDN marks `anchor-name` and `position-anchor` as Baseline 2026, newly available, and says the feature works in the latest browsers since January 2026. The page also notes that some parts may have varying levels of support. Firefox added it in version 147 and Safari in version 26.

```css
.button { anchor-name: --menu-button; }
.menu {
  position: absolute;
  position-anchor: --menu-button;
  top: anchor(bottom);
}
```

![Chrome for Developers home page, with the headline A Powerful Web. Made Easier.](/guides/web-design-trends-2027/example-developer-chrome.jpg "developer.chrome.com, home page, 26 November 2026")

**Example:** On developer.chrome.com, the user button in the header sets `anchor-name: --devsite-user-button`, and a fixed panel uses `position-anchor: --devsite-user-button` to sit next to it. Stripe's stylesheets also use `position-anchor`, inside an `@supports (anchor-name: ...)` check, for the indicator in its side navigation.

**Worth it?** Yes, together with popovers (trend 8). Test the fallback placement in each browser, since that is the part that varies.

## 4. Entry animations with @starting-style

CSS transitions used to skip the first frame of an element. A dialog that appeared could not fade in without a script. `@starting-style` gives the browser a starting state to animate from.

![MDN's page for the starting-style at-rule, marked Baseline 2024, newly available.](/guides/web-design-trends-2027/starting-style.jpg "MDN, @starting-style, 26 November 2026")

MDN marks `@starting-style` as Baseline 2024, newly available.

```css
dialog[open] {
  opacity: 1;
  transition: opacity 0.2s;
  @starting-style { opacity: 0; }
}
```

![Tailwind CSS home page, with the headline Rapidly build modern websites without ever leaving your HTML.](/guides/web-design-trends-2027/example-tailwindcss.jpg "tailwindcss.com, home page, 26 November 2026")

**Example:** Tailwind CSS ships a `starting:` variant that writes `@starting-style` for you, and its own site uses it. Its stylesheet has `@starting-style` rules that start open elements and popovers at `opacity: 0`, so they fade in.

**Worth it?** Yes. It is small, and an older browser simply shows the element without the fade.

## 5. Container queries

A media query asks how wide the screen is. A container query asks how wide the box is. A card can then change its layout when it sits in a narrow sidebar, wherever the page puts it.

![MDN's page for the container at-rule, marked Baseline widely available.](/guides/web-design-trends-2027/container-queries.jpg "MDN, @container, 26 November 2026")

MDN marks `@container` as widely available. Style queries on custom properties, such as `@container style(--theme: dark)`, are newer. MDN's data shows Firefox added them in version 151, in May 2026, so all core browsers now have them.

```css
.card-list { container-type: inline-size; }
@container (width > 30rem) {
  .card { display: grid; grid-template-columns: 1fr 2fr; }
}
```

![Linear's dark home page, with the headline The product development system for teams and agents.](/guides/web-design-trends-2027/example-linear.jpg "linear.app, home page, 26 November 2026")

**Example:** Linear's home page sets `container-type: inline-size` on parts of the page and uses a named container query, `@container ... (width >= 975px)`, for its row of startup logos.

![Astro's home page on a purple gradient, with the headline The web framework for content-driven websites.](/guides/web-design-trends-2027/example-astro.jpg "astro.build, home page, 26 November 2026")

**Example:** Astro's site has an `@container` utility class that sets `container-type: inline-size`, so any block can become a container.

**Worth it?** Yes. This is the main layout change for component-based sites. Use size queries freely. Style queries are new in Firefox, so keep them for extras.

## 6. :has(), the parent selector

`:has()` selects an element by what it contains. A form row with an invalid input, a card with an image, or a page with an open menu can all be styled with no class added by JavaScript.

![MDN's page for the has pseudo-class, marked Baseline widely available.](/guides/web-design-trends-2027/has.jpg "MDN, :has(), 26 November 2026")

MDN marks `:has()` as widely available.

```css
.field:has(input:invalid) { border-color: var(--danger); }
```

![Figma's home page, with a carousel of website designs and a prompt box.](/guides/web-design-trends-2027/example-figma.jpg "figma.com, home page, 26 November 2026")

**Example:** Figma's site uses the same pattern as the snippet above: `:has(input:invalid)` draws a red outline around an input's wrapper when the value is not valid. Its CSS also uses `container-type: scroll-state`, a newer kind of container query.

**Worth it?** Yes. It is safe to use everywhere.

## 7. Modern colour: light-dark(), oklch() and color-mix()

Three colour functions make themes shorter:

- `light-dark()` takes two colours and picks one based on the colour scheme. A dark mode can live in one line per colour.
- `oklch()` describes a colour by lightness, chroma and hue. Changing the lightness keeps the hue looking the same, which makes tints and shades easier to build.
- `color-mix()` mixes two colours, for example a hover state made of 85% of the brand colour and 15% black.

![MDN's page for the light-dark CSS function, marked Baseline widely available.](/guides/web-design-trends-2027/light-dark.jpg "MDN, light-dark(), 26 November 2026")

MDN marks all three as widely available.

```css
:root { color-scheme: light dark; }
.button {
  background: light-dark(oklch(45% 0.15 40), oklch(75% 0.12 40));
}
.button:hover {
  background: color-mix(in oklch, var(--brand) 85%, black);
}
```

![Open Props home page, with the headline Supercharged CSS variables and a code sample.](/guides/web-design-trends-2027/example-open-props.jpg "open-props.style, home page, 26 November 2026")

**Example:** Open Props, a set of ready-made CSS variables, builds its palette in `oklch()`, with the hue and chroma set by variables. Its palette playground then picks colours with `light-dark()`, inside an `@supports` check.

**Worth it?** Yes. Check contrast after you mix colours, since a mix can drop below the minimum. [Colour contrast for non-designers](/guides/contrast-for-non-designers/) explains the numbers.

## 8. Popovers and button commands

The `popover` attribute turns any element into a menu or panel that opens on top of the page. The `commandfor` and `command` attributes let a button open a dialog or popover with no JavaScript. The browser handles focus, the Escape key and clicks outside.

![MDN's page for the Invoker Commands API, marked Baseline 2025, newly available.](/guides/web-design-trends-2027/invoker-commands.jpg "MDN, Invoker Commands API, 26 November 2026")

MDN marks the Popover API and the Invoker Commands API as Baseline 2025, newly available. Safari was the last to add button commands, in version 26.2.

```html
<button commandfor="menu" command="toggle-popover">Menu</button>
<div id="menu" popover>...</div>
```

![Vercel's home page, with a black triangle logo and the headline Agentic Infrastructure.](/guides/web-design-trends-2027/example-vercel.jpg "vercel.com, home page, 26 November 2026")

**Example:** On vercel.com, the menu behind the logo is a `<div popover="manual" role="menu">`, and the stylesheets style it with `:popover-open`. On nerdy.dev's home page, the search button uses `commandfor="site-search" command="show-modal"` to open a `<dialog>` with no script, and the close button uses `command="close"`.

**Worth it?** Yes. Less JavaScript, and keyboard behaviour you get for free. Pair it with anchor positioning to place the menu next to its button.

## 9. A fully styled select menu

For years, the open list of a `<select>` could not be styled. A new opt-in, `appearance: base-select`, lets you style the button, the list and each option, and even put images in options.

![MDN's page for the picker pseudo-element, marked limited availability.](/guides/web-design-trends-2027/customizable-select.jpg "MDN, ::picker(), 26 November 2026")

MDN marks `::picker()` as limited availability. Its data shows Chrome and Edge 135 and Safari 27. Firefox has `base-select` only behind a flag, from version 149.

```css
select, ::picker(select) {
  appearance: base-select;
}
```

**Worth it?** Only as an extra. In Firefox the menu stays a normal select, which still works. Don't design a layout that breaks if the list is not styled.

## 10. Better line breaks in headings and text

Two values of `text-wrap` fix ugly line breaks without hand-placed `<br>` tags:

- `balance` evens out the lines of a short heading, so the last line is not one lonely word.
- `pretty` avoids a single short word on the last line of a paragraph.

![MDN's page for the text-wrap-style property, marked Baseline 2024, newly available.](/guides/web-design-trends-2027/text-wrap.jpg "MDN, text-wrap-style, 26 November 2026")

MDN marks `text-wrap-style` as Baseline 2024, newly available. That covers `balance`. MDN's data shows `pretty` in Chrome and Edge 130 and Safari 26, but not in Firefox.

```css
h1, h2, h3 { text-wrap: balance; }
p { text-wrap: pretty; }
```

![Svelte's home page, with the headline web development for the rest of us and a 3D illustration.](/guides/web-design-trends-2027/example-svelte.jpg "svelte.dev, home page, 26 November 2026")

**Example:** Svelte's home page sets `text-wrap: balance` on its intro text and on another short block of text. Its code blocks also mix colours with `color-mix(in oklch, ...)`.

**Worth it?** Yes. It is two lines, and a browser without support wraps text the old way. MDN notes that `pretty` is slower, and suggests it for longer text where layout matters more than speed.

## Accessibility is now a legal requirement in the EU

The European Accessibility Act is a directive, (EU) 2019/882. Article 2 says it applies to services provided to consumers after 28 June 2025. The list includes e-commerce services, consumer banking services, e-books, electronic communications, and the websites and apps of air, bus, rail and waterborne passenger transport.

![The European Accessibility Act on EUR-Lex, Article 2, listing services provided to consumers after 28 June 2025.](/guides/web-design-trends-2027/eaa.jpg "EUR-Lex, Directive (EU) 2019/882, 26 November 2026")

Two limits matter. Microenterprises that provide services are exempt from its service requirements. And each EU country applies it through its own national law. If you sell to consumers in the EU, check your country's law, not a blog post.

**What it means for design:** enough contrast, a visible focus state, real buttons and links, labels on form fields, and pages that work with a keyboard. Many of the features above help. Popovers and button commands handle focus and the Escape key for you.

## Design tokens and DESIGN.md files for coding agents

More sites are now built with a coding agent. An agent picks a colour, a size and a gap for every element it makes. Without a written design, it guesses, and two pages guess differently.

The fix is old: design tokens, named values such as `primary` or `spacing-md`. What is new is where they live. A `DESIGN.md` file in the project's root holds the tokens and a short description of how to use them. The agent reads it before it builds, and a checker can test the result afterwards.

This is not a browser feature, so there is no support table. It is a working habit. [What is a DESIGN.md](/guides/what-is-design-md/) explains the format, and [design tokens for coding agents](/guides/design-tokens-for-coding-agents/) covers naming them.

## Sites using these trends today

We loaded each home page on 26 November 2026 and searched its stylesheets and markup. The table lists only what we found. A feature in a stylesheet can still be limited to one part of the page.

| Site | What its CSS or HTML uses |
| --- | --- |
| [nerdy.dev](https://nerdy.dev/) | Cross-page view transitions, `view-transition-name`, `commandfor` buttons, `:has()`, `color-mix()` |
| [una.im](https://una.im/) | Cross-page view transitions |
| [stripe.com](https://stripe.com/) | Scroll-driven animation, anchor positioning, `commandfor` |
| [developer.chrome.com](https://developer.chrome.com/) | Anchor positioning, `text-wrap: balance` |
| [tailwindcss.com](https://tailwindcss.com/) | `@starting-style`, `:popover-open`, `color-mix(in oklab)` |
| [linear.app](https://linear.app/) | Container queries |
| [astro.build](https://astro.build/) | Container queries, `text-wrap: balance` and `pretty` |
| [figma.com](https://www.figma.com/) | `:has()`, scroll-state container queries |
| [open-props.style](https://open-props.style/) | `oklch()`, `light-dark()` |
| [vercel.com](https://vercel.com/) | The `popover` attribute, `:popover-open`, `@starting-style` |
| [svelte.dev](https://svelte.dev/) | `text-wrap: balance`, `color-mix(in oklch)` |

## Which trends to adopt in 2027

- **Start with the safe ones:** container queries, `:has()`, `light-dark()` and `oklch()`, `text-wrap: balance`, and popovers. They work in every major browser and remove code.
- **Add motion that fails quietly:** view transitions, `@starting-style` and scroll-driven animations. A browser without them shows the page without the animation. Always honour reduced motion.
- **Replace your tooltip library** with anchor positioning plus popovers, and test the fallback placement.
- **Treat accessibility as a requirement,** not a trend, if you serve consumers in the EU.
- **Write a DESIGN.md** if a coding agent builds any part of your site.

## What to skip for now

These appeared in 2025 and 2026 but are not ready for most sites. MDN's data on 26 November 2026 shows:

- **`interpolate-size`** (animating to `height: auto`): marked experimental. Chrome and Edge only. Safari has it only in a preview build.
- **`interestfor`** (open a popover on hover or focus): marked experimental. Chrome and Edge only.
- **`if()` and `@function` in CSS:** Chrome and Edge only among released browsers.
- **`reading-flow`** (keyboard order that follows a grid layout): marked experimental. Chrome and Edge only.
- **A fully styled `<select>`** as a core part of a design. Use it only as an extra until Firefox ships it.

## FAQ

### What are the biggest web design trends for 2027?

The ones you can build today are view transitions, scroll-driven animations, anchor positioning, container queries, `:has()`, modern colour functions, popovers and better text wrapping. Each works in all major browsers, or fails quietly where it doesn't. Accessibility is the other big one, because the European Accessibility Act now applies to many consumer services.

### Can I use view transitions between pages yet?

In Chrome, Edge and Safari, yes. MDN's data lists Firefox 162, with a release date of 8 December 2026. A browser without support just loads the page normally, so you can add it now.

### What does "Baseline" mean?

It is a label defined by the WebDX Community Group and shown on MDN and web.dev. "Newly available" means the feature works in Chrome, Edge, Firefox and Safari. "Widely available" means 30 months have passed since then.

### Do I need JavaScript for tooltips and menus in 2027?

Often not. The `popover` attribute, button commands and anchor positioning cover opening, closing, focus and placement. You may still need a script for complex menus or for older browsers.

### Does the European Accessibility Act apply to my website?

It applies to the services it lists, such as e-commerce and consumer banking, when provided to consumers in the EU after 28 June 2025. Microenterprises providing services are exempt from the service requirements. Each country applies it through national law, so check yours.
