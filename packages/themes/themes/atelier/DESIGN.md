---
version: alpha
name: Atelier
description: A spare, high-fashion theme for portfolios and houses. Ivory and black, a didone at display size, and no corner rounded.
colors:
  primary: "#141414"
  on-primary: "#FAF8F5"
  secondary: "#E4DFD6"
  on-secondary: "#141414"
  tertiary: "#DDBBAA"
  on-tertiary: "#141414"
  neutral: "#68635C"
  background: "#FAF8F5"
  surface: "#F1EEE8"
  foreground: "#141414"
  border: "#D6D1C8"
  error: "#A32020"
typography:
  display:
    fontFamily: Bodoni Moda
    fontSize: 72px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: -0.01em
  h1:
    fontFamily: Bodoni Moda
    fontSize: 44px
    fontWeight: 500
    lineHeight: 1.1
  h2:
    fontFamily: Bodoni Moda
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.2
  body:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: Fragment Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.12em
rounded:
  none: 0px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  2xl: 128px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "{spacing.md} {spacing.lg}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "{spacing.md} {spacing.lg}"
  badge:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "{spacing.xs} {spacing.sm}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.none}"
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
    extra: ["0", "1px", "2px"]
  rounded:
    allow: scale
  typography:
    allow: scale
    fonts: declared
  tells:
    purple-gradient: error
    emoji-icons: error
    nested-cards: warn
    glow-shadows: error
  modes:
    dark:
      colors:
        primary: "#F3F0EA"
        on-primary: "#141414"
        secondary: "#2B2A27"
        on-secondary: "#F3F0EA"
        neutral: "#A6A097"
        background: "#0F0F0F"
        surface: "#1A1A19"
        foreground: "#F3F0EA"
        border: "#353330"
        error: "#FF8577"
---

## Overview

Atelier is for work that is looked at: a fashion house, a photographer, an
architect, a gallery, a lookbook. It takes its manners from a printed
catalogue. The page is almost empty, the type is large and thin-stroked, and
the interface steps back so that the work is the only thing with color.

## Colors

- **Primary (`#141414`)** is black, for buttons, links and rules that matter.
- **Secondary (`#E4DFD6`)** is stone, a quiet fill for the second button.
- **Tertiary (`#DDBBAA`)** is blush, the single tint. Use it for one badge such as "New season", never for text.
- **Neutral (`#68635C`)** sets captions, credits and small print.
- **Background (`#FAF8F5`)** is ivory. **Surface (`#F1EEE8`)** is a slightly deeper paper for a caption block or a form.
- **Error (`#A32020`)** is the only saturated color in the interface, and appears only with a message.

## Typography

Bodoni Moda sets headings: a didone with hairline serifs, at its best large, so
the display size is 72px and headings are few. Its italic is the theme's one
flourish; use it for a single word or a title, not a paragraph. Hanken Grotesk
sets body text at 16px. Fragment Mono sets labels, uppercase with very wide
tracking: credits, dates, sizes, prices.

## Layout

A 12-column grid, 1320px at its widest, with 32px gutters. Images run large and
are placed off-center: a picture in eight columns with its caption in the
ninth, not a tidy row of three. Spacing comes from the scale (4, 8, 16, 32,
64, 128), and the big steps are the ones to use: 128px between sections.
White space is the main material.

## Elevation & Depth

None. Nothing has a shadow, and nothing sits on a card with a fill unless it
is a form. Things are separated by space first and a 1px hairline second.

## Shapes

Square. Every corner is 0: buttons, inputs, images, badges. The only curves on
the page are in the letters.

## Components

- **Buttons**: black with ivory text for the main action, stone for the second. Uppercase mono labels, generous padding, square corners.
- **Cards**: used rarely. A block of the deeper paper with 32px padding and no border.
- **Badges**: blush with black text, square, one or two words.
- **Links**: black with a 1px underline. Never colored.
- **Icons**: 1px or 1.5px stroke line icons, used sparingly. Never emoji.

## Do's and Don'ts

- Do give one image or one heading the whole screen.
- Do set captions and credits small, in the mono font, and let them be found.
- Do use the italic for one word or one title at a time.
- Don't round a corner, add a shadow or tint a background to make something "pop".
- Don't set long text in Bodoni: below 28px its hairlines break up.
- Don't introduce a color, size or radius that is not a token above.
