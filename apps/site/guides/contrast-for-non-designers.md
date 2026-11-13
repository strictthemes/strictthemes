---
title: "Contrast for non-designers: 4.5:1, 3:1 and AAA"
description: What a contrast ratio is, which number applies to which text, where pages fail it, and how to fix a failing pair. With the measured contrast of 23 themes in light and dark.
kind: Explained
date: 2026-11-13
checked: 2026-11-13
---

A caption in pale grey looks tidy on your screen, in your room, with your eyes. On a phone in daylight, or to a reader past fifty, it is a smudge. Contrast is the one design rule with a number attached, which makes it the easiest one to hand to a coding agent and the easiest to check. This guide explains the number, shows where pages fail it, and reports what the 23 themes in this repo score.

## What the ratio measures

A contrast ratio compares how much light two colors give off: the text and what is behind it. It runs from 1:1, the same color twice, to 21:1, black on white. It says nothing about hue. A red and a green of the same brightness score near 1:1, however different they look.

The standard behind the number is WCAG, the Web Content Accessibility Guidelines. It works in two steps.

1. Each color gets a **relative luminance**, a brightness from 0 (black) to 1 (white). The red, green and blue parts are first converted from the stored values to actual light, then weighted: `L = 0.2126 R + 0.7152 G + 0.0722 B`. Green counts for 72% and blue for 7%, because that is roughly how the eye responds. It is why a pure yellow is bright and a pure blue is dark.
2. The ratio is `(lighter + 0.05) / (darker + 0.05)`.

You never do this by hand. The point of knowing it is the weights: you cannot judge contrast from how "strong" a color feels. A saturated blue and a dark grey can have the same luminance.

## The thresholds

WCAG has two levels that matter in practice, AA and AAA, and two sizes of text.

| | Normal text | Large text |
|---|---|---|
| **AA** | 4.5:1 | 3:1 |
| **AAA** | 7:1 | 4.5:1 |

**Large text** is 24px and up, or 18.66px and up when it is bold (weight 700). Those are WCAG's 18pt and 14pt. Everything else is normal text, and that includes almost all of a page: body copy, captions, button labels, table cells, placeholders.

AA is the usual target, and the default in a `strict` block. AAA is the stricter one: choose it for text that is read for hours or by readers who need it.

![One sentence set five times on white in greys from light to dark, each labeled with its contrast ratio: 2.01, 3.03, 4.54, 7.00 and 15.13 to 1.](/guides/contrast-for-non-designers/grey-ladder.svg "The same words at about 2:1, 3:1, 4.5:1, 7:1 and 15:1 on white. Each grey is the lightest one that reaches its ratio, found by a script.")

Two things to take from the picture. The 3:1 line is readable to you right now, which is exactly why it ships. And the step from fail to pass is small: `#777777` on white is 4.48:1 and fails AA; `#767676` is 4.54:1 and passes.

## Where pages fail

Body text almost never fails. Dark ink on a light page clears 7:1 without anyone trying. The failures are in four places.

### Grey captions

Quiet text is made by lightening the ink, and it is easy to go one step too far. A popular way to do it is opacity. Here is the ink `#111111` over white at five opacities:

| Opacity | Becomes | Ratio | AA normal text |
|---|---|---|---|
| 80% | `#414141` | 10.27:1 | passes |
| 70% | `#585858` | 7.07:1 | passes |
| 60% | `#707070` | 4.94:1 | passes |
| 50% | `#888888` | 3.54:1 | fails |
| 40% | `#A0A0A0` | 2.62:1 | fails |

Half-opacity text fails. The same grey also sits on more than one background. On a card that is slightly darker than the page, it loses a little more: across the 23 themes, quiet text on the page is at least 5.08:1 in light mode, and on the card surface at least 4.79:1.

### Text on a brand-colored button

A button's label is normal text, so it needs 4.5:1 against the fill. The habit is white on every colored button. White works on dark, saturated colors and fails on orange, yellow and light blue.

![Six button colors from the themes, each shown with white text and with dark text and the contrast ratio of both. White passes on the first three and fails on orange, light blue and yellow, where dark text passes.](/guides/contrast-for-non-designers/button-text.svg "White and dark text on six button colors taken from the themes. No color here passes with both.")

No color in the picture passes AA with both. That is the useful fact: for a given fill there is usually one right answer, and it is decided by the fill's luminance, not by taste. This is why a theme has a separate token for the text on each fill (`on-primary` beside `primary`), and why an agent should use that token and never write `text-white`.

### Hover

A hover state is a new color pair, and nobody looks at it for long. The stock shadcn button hovers with the fill at 80% opacity (`hover:bg-primary/80`, in a project set up with shadcn 4.23.0). On Strict One's blue button that takes white text from 6.71:1 to 4.66:1: still a pass, by a thin margin. We computed the same hover for all 23 themes in both modes. It stays above 4.5:1 in every one, and it drops below 7:1 in Civic, the one theme that declares AAA (10.04:1 becomes 5.89:1 in light mode). A hover that is fine at AA can break AAA.

### Dark mode

Dark mode is not the light colors on a dark page. If a dark mode kept the light theme's quiet grey, it would fail in all 23 themes (1.89:1 to 3.69:1 against the dark background). If it kept the light primary as the link color, it would fail in 22. That is why every theme here changes `neutral` for dark mode and 22 of 23 change `primary`: both get lighter. A dark mode added late, by swapping only the background and the main text color, fails on exactly these.

## What the 23 themes score

We computed three pairs for every theme in `packages/themes/themes`, in both modes, with the `parseColor` and `contrastRatio` functions that `@strictthemes/spec` exports: main text on the page (`foreground` on `background`), quiet text on the page (`neutral` on `background`), and the label on the main button (`on-primary` on `primary`).

| Pair | Mode | Lowest | Median | Highest |
|---|---|---|---|---|
| Main text on page | light | 11.68 | 15.10 | 21.00 |
| | dark | 13.38 | 15.87 | 18.58 |
| Quiet text on page | light | 5.08 | 5.84 | 8.83 |
| | dark | 6.60 | 7.99 | 13.07 |
| Label on main button | light | 6.35 | 8.59 | 17.38 |
| | dark | 5.70 | 9.17 | 16.20 |

Each cell below is the ratio in light mode, then in dark.

| Theme | Level | Main text | Quiet text | Button label |
|---|---|---|---|---|
| atelier | AA | 17.38 / 16.85 | 5.62 / 7.39 | 17.38 / 16.20 |
| avion | AA | 14.59 / 15.73 | 5.08 / 7.17 | 7.40 / 7.36 |
| cipher | AA | 16.96 / 15.99 | 5.84 / 6.60 | 6.90 / 7.42 |
| civic | AAA | 18.61 / 17.86 | 8.83 / 10.43 | 10.04 / 9.46 |
| confetti | AA | 14.84 / 15.82 | 6.19 / 8.38 | 11.65 / 9.18 |
| counsel | AA | 21.00 / 18.58 | 6.20 / 9.11 | 15.97 / 12.50 |
| dispatch | AA | 16.74 / 16.72 | 6.28 / 7.52 | 6.35 / 6.86 |
| ember | AA | 18.51 / 18.51 | 7.11 / 8.56 | 8.59 / 5.70 |
| gauge | AA | 14.63 / 14.63 | 7.76 / 7.43 | 14.63 / 14.63 |
| kiln | AA | 13.96 / 14.91 | 5.55 / 7.61 | 6.93 / 7.09 |
| ledger | AA | 15.10 / 15.87 | 5.32 / 7.08 | 8.22 / 9.25 |
| nocturne | AA | 16.15 / 16.54 | 5.73 / 7.58 | 7.61 / 9.74 |
| passage | AA | 14.65 / 17.80 | 6.57 / 13.07 | 10.20 / 9.17 |
| primer | AA | 11.68 / 15.65 | 6.37 / 8.77 | 7.46 / 8.38 |
| recital | AA | 16.01 / 15.08 | 5.26 / 6.92 | 8.93 / 7.87 |
| relay | AA | 13.16 / 15.88 | 6.12 / 9.66 | 7.93 / 7.93 |
| solace | AA | 12.91 / 14.48 | 6.79 / 7.99 | 12.91 / 7.37 |
| sorbet | AA | 15.80 / 15.82 | 5.58 / 8.12 | 6.97 / 7.46 |
| strict-one | AA | 18.88 / 18.03 | 5.33 / 7.78 | 6.71 / 6.94 |
| tideline | AA | 14.40 / 14.40 | 5.51 / 8.09 | 10.08 / 9.37 |
| tisane | AA | 13.28 / 14.92 | 5.38 / 7.62 | 7.45 / 9.34 |
| veranda | AA | 12.06 / 13.38 | 5.50 / 8.02 | 8.87 / 10.00 |
| voltage | AA | 15.52 / 18.06 | 7.23 / 9.25 | 15.52 / 15.52 |

What the numbers say:

- **Main text is never the problem.** The lowest of 46 values is 11.68:1.
- **Quiet text is where the level is decided.** In light mode it is under 7:1 in 19 of 23 themes. Only Civic declares AAA, and its quiet text is the darkest at 8.83:1. Three more (Ember, Gauge, Voltage) have quiet text above 7:1 without declaring AAA.
- **Dark mode scores higher on quiet text**, a median of 7.99 against 5.84. Light grey on near-black has more room than mid grey on white.
- **The tightest pair in any theme** is not among these three. Of the 276 component pairs the linter checks across all themes and modes, the lowest is a secondary button in Voltage's dark mode: white on `#5B5BFF`, 4.79:1.

## How a spec's contrast level is checked

A `DESIGN.md` states its level in one line of its `strict` block:

```yaml
strict:
  version: 1
  contrast: AA
```

Two tools read it, and they check different things.

**The linter** (`@strictthemes/spec`) checks the spec itself. For every entry under `components` that has both a `backgroundColor` and a `textColor`, it computes the ratio, in the base colors and again in every mode. It needs 4.5:1 for `AA` and 7:1 for `AAA`. It gives no allowance for large text, because a spec does not say where a component will be used. Here is a spec with a light grey caption and white on an orange button:

```bash
npx @strictthemes/spec lint DESIGN.md
```

```
error    contrast-ratio  components.button-primary
         #FFFFFF on #FF4F00 has a contrast ratio of 3.30:1, below WCAG AA (4.5:1)
error    contrast-ratio  components.caption
         #999999 on #FFFFFF has a contrast ratio of 2.85:1, below WCAG AA (4.5:1)
...
DESIGN.md: 2 errors, 0 warnings
```

The limit of this check: it only sees pairs the spec declares as components. A spec with a faint `neutral` and no `caption` component passes.

**Strict Check** (`@strictthemes/check`) checks the built page. It opens it in a headless browser and, for every element that holds text, compares the text color with the color actually behind it, in each color mode, at two widths, and again on hover and on focus. Half-transparent text is flattened onto its background first. Text of 24px, or of 18.66px at weight 700, gets the large-text ratio: 3:1 at AA, 4.5:1 at AAA. It skips disabled controls and text that sits on a gradient or a background image, where there is no single color to compare with. Those you check by eye.

## How to fix a failing pair

**Change the color, not the weight.** Bold text has the same ratio as regular text. Weight only matters where it moves text into the large class, at 18.66px and above.

**Change the token, not the element.** A failing caption means the token is wrong everywhere it is used. Which one to change:

| What fails | Token to change | Direction |
|---|---|---|
| Caption or hint on the page | `neutral` | Darker in light mode, lighter in dark |
| Label on a colored button | `on-primary` (or `on-secondary`, `on-tertiary`) | Flip between light and dark text first |
| Label still fails after the flip | `primary` | Darker for white text, lighter for dark text |
| Only in dark mode | the same token under `strict.modes.dark.colors` | Leave the light value alone |
| Only on hover | the hover style | Use a solid token or an underline, not a lower opacity |

In the example above, changing `neutral` to `#6B6B6B` (5.33:1) and `on-primary` to `#111111` (5.73:1 on the orange) brings the linter to `0 errors, 0 warnings`. Setting `contrast: AAA` on that fixed spec fails both again, each "below WCAG AAA (7:1)". Declare AAA at the start of a project, not at the end.

## A rule of thumb without a tool

- **On white, grey text is `#767676` or darker.** For AAA, `#595959` or darker.
- **Ink at an opacity:** 60% or more on white. Never 50%.
- **White or dark text on a color:** compare the fill with mid grey, `#777777`. A fill that is clearly darker takes white text; one that is lighter takes dark text. Orange, yellow, lime and sky blue are lighter than they feel.
- **Squint, or turn the screen brightness down.** The text that disappears first is the text that fails.
- **Then look at three places again:** the hover state, the dark mode, and the placeholder in a form field.

A rule of thumb finds the bad cases. The number settles the close ones, and it costs one command.

## Next

- [The spec format](/spec/): the `strict` block, `contrast` and color modes.
- [AI slop in UI: the tells, and how to check for them](/guides/ai-slop-ui-tells/): faint grey text is one of ten.
- [Dark mode with tokens in Tailwind 4](/guides/dark-mode-with-tokens-tailwind-4/): where the dark values of each token live.
