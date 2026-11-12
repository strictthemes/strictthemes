---
version: alpha
name: Recital
description: A warm, literary theme for long reading. Paper tones, a serif voice, and one oxblood accent.
colors:
  primary: "#7B2D26"
  on-primary: "#FFF9F0"
  secondary: "#2B2622"
  on-secondary: "#FFF9F0"
  tertiary: "#B8892B"
  on-tertiary: "#1F1B18"
  neutral: "#6F665E"
  background: "#FBF7F0"
  surface: "#F3ECE1"
  foreground: "#1F1B18"
  border: "#DDD3C4"
  error: "#A3261C"
typography:
  display:
    fontFamily: Fraunces
    fontSize: 60px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.02em
  h1:
    fontFamily: Fraunces
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.01em
  h2:
    fontFamily: Fraunces
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.25
  body:
    fontFamily: Source Sans 3
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: Source Code Pro
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.04em
rounded:
  sm: 3px
  md: 6px
  lg: 12px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  2xl: 96px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.lg}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.lg}"
  badge:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.sm}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
  caption:
    backgroundColor: "{colors.background}"
    textColor: "{colors.neutral}"
    typography: "{typography.label}"
strict:
  version: 1
  contrast: AA
  colors:
    allow: tokens
    tolerance: 0.02
  spacing:
    allow: scale
    extra: ["0", "1px"]
  rounded:
    allow: scale
    full: 64px
  typography:
    allow: scale
    fonts: declared
  tells:
    purple-gradient: error
    emoji-icons: error
    nested-cards: error
    glow-shadows: error
  modes:
    dark:
      colors:
        primary: "#E39A7B"
        on-primary: "#1F1410"
        secondary: "#F2EADD"
        on-secondary: "#1F1B18"
        tertiary: "#D4A94A"
        neutral: "#A99F94"
        background: "#191614"
        surface: "#231F1C"
        foreground: "#F2EADD"
        border: "#3A332D"
        error: "#EF8A7E"
---

## Overview

Recital is for writing that people sit down with: essays, journals, documentation
read end to end. It should feel like a well-made paperback, with warm paper, dark
brown ink and a serif that has some character. The page is quiet so the words
carry it. One oxblood accent marks what the reader can act on.

## Colors

- **Primary (`#7B2D26`)** is oxblood. Use it for links, the main button and the occasional drop cap. Not for backgrounds.
- **Secondary (`#2B2622`)** is the ink for secondary buttons and heavy rules.
- **Tertiary (`#B8892B`)** is an ochre for badges and highlights, like a margin note in pencil. Use it rarely.
- **Neutral (`#6F665E`)** sets captions, bylines and dates.
- **Background (`#FBF7F0`) and Surface (`#F3ECE1`)** are paper tones. Never pure white, never a cool grey.
- **Error (`#A3261C`)** is for validation only. It is close to the primary, so always pair it with an icon or a message.

## Typography

Fraunces sets headings: soft, slightly old-style, never bold beyond 600. Source Sans 3
sets body text at 18px with a 1.65 line height and a measure of 60–70 characters.
Source Code Pro sets labels, bylines and code. Body text is never smaller than 16px,
and long passages are never centered or justified.

## Layout

A single reading column, 512px wide, centered on the page: at this type size that
is 60 to 70 characters a line. Wider elements such as images and tables may extend
to 768px. Spacing comes from the scale (4, 8, 16, 24,
48, 96), with 48px between sections and 96px before a new chapter. Sidebars are
the exception: prefer footnotes and inline asides.

## Elevation & Depth

Almost flat. A card sits on the page by its surface color and a 1px border. One
soft shadow is allowed for things that float over the text, such as menus and
dialogs; nothing else casts one.

## Shapes

Gently rounded: 3px for badges, 6px for buttons and inputs, 12px for cards and
images. No pills, and no perfect circles except avatars.

## Components

- **Buttons**: oxblood for the main action, ink for the rest. Sentence case, never all caps.
- **Cards**: surface fill, 12px corners, 24px padding. Used for asides and summaries, not for every paragraph.
- **Badges**: ochre, small, one or two words.
- **Block quotes**: a 2px primary rule on the left, set in Fraunces italic.
- **Icons**: thin line icons, used sparingly. Never emoji.

## Do's and Don'ts

- Do give text room: wide margins and tall line height.
- Do use italics for emphasis before reaching for color.
- Don't use pure white, pure black or cool greys.
- Don't use gradients, glows or glass effects.
- Don't put a card inside a card.
- Don't introduce a color, size or radius that is not a token above.
