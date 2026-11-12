---
version: alpha
name: Kiln
description: A warm, hand-made theme for shops and studios. Clay paper, a fired-terracotta accent, and type with a little wobble.
colors:
  primary: "#963614"
  on-primary: "#FFF6EC"
  secondary: "#2A1D14"
  on-secondary: "#FBF6EE"
  tertiary: "#2F4A7A"
  on-tertiary: "#FBF6EE"
  neutral: "#6B5B4E"
  background: "#F4ECE1"
  surface: "#FBF6EE"
  foreground: "#2A1D14"
  border: "#DBCDBA"
  error: "#B3122D"
  success: "#2F6B3A"
  glaze-pale: "#F2EADC"
  glaze-dark: "#5A4132"
typography:
  display:
    fontFamily: Bricolage Grotesque
    fontSize: 60px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: -0.03em
  h1:
    fontFamily: Bricolage Grotesque
    fontSize: 38px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  h2:
    fontFamily: Bricolage Grotesque
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.01em
  body:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: DM Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.04em
rounded:
  sm: 2px
  md: 4px
  lg: 10px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 80px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
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
    backgroundColor: "{colors.surface}"
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
    full: 64px
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
        primary: "#EC8B5E"
        on-primary: "#2A1206"
        secondary: "#F1E6D8"
        on-secondary: "#2A1D14"
        tertiary: "#9DB4E6"
        on-tertiary: "#14203A"
        neutral: "#B5A493"
        background: "#1A130E"
        surface: "#241A13"
        foreground: "#F1E6D8"
        border: "#3B2D22"
        error: "#FF8E99"
        success: "#7FC98A"
---

## Overview

Kiln is for people who sell things they make: a ceramics studio, a small shop, a
bakery, a portfolio. It should feel like a good paper bag and a hand-written
price tag: warm, plain and sure of itself. The page is clay-colored paper, the
ink is a deep brown instead of black, and the one loud color is the terracotta
of something just out of the kiln.

## Colors

- **Primary (`#963614`)** is fired terracotta, for the main action and for links in running text.
- **Secondary (`#2A1D14`)** is a brown-black ink for secondary buttons and headings.
- **Tertiary (`#2F4A7A`)** is denim blue, the one cool note. Use it for a badge such as "New" or "Sold out", never for large areas.
- **Neutral (`#6B5B4E`)** sets captions, prices' small print and secondary text.
- **Background (`#F4ECE1`)** is clay paper. **Surface (`#FBF6EE`)** is a lighter sheet laid on it, for cards and product tiles.
- **Success (`#2F6B3A`) and Error (`#B3122D`)** report state, and always come with a word or an icon.
- **Glaze pale (`#F2EADC`) and Glaze dark (`#5A4132`)** are for one thing: a piece drawn where there is no photograph of it. They are the same in light and dark mode, because a pot does not change color when the page does. Such a piece has a thin outline in the text color, so a pale piece shows on a pale ground and a dark one on a dark ground.

## Typography

Bricolage Grotesque sets headings. It is a grotesque with uneven, hand-cut
shapes, so set it large and tight and let it carry the personality. DM Sans sets
body text at 16px. DM Mono sets labels, prices and small print: a price is a
figure, and figures line up. Labels are sentence case, never uppercase.

## Layout

A 12-column grid, 1120px at its widest, with 24px gutters. Product tiles sit
three or four to a row and go to two on a phone. Spacing comes from the scale
(4, 8, 16, 24, 40, 80): 80px between sections, 24px inside a card. Leave paper
showing. A page with one object and a lot of clay around it is doing its job.

## Elevation & Depth

Flat, like printed card. A surface is told from the page by its lighter color
and a 1px border. Nothing casts a shadow except things that float over the
page, which get one short, warm shadow.

## Shapes

Barely rounded, as if cut by hand and sanded once: 2px for badges, 4px for
buttons and inputs, 10px for cards and images. No pills, no circles except
avatars.

## Components

- **Buttons**: terracotta for the one main action, brown-black for the rest. Mono labels in sentence case.
- **Cards**: the lighter sheet, 10px corners, 24px padding (16px in a narrow product tile), a 1px border.
- **Badges**: denim blue, 2px corners, one or two words.
- **Prices**: mono figures, tabular, with the currency sign close to the number.
- **Icons**: 1.5px stroke line icons. Never emoji.

## Do's and Don'ts

- Do let the clay background show: most of a page is paper.
- Do use a terracotta fill once per screen, for the thing you want pressed.
- Do set prices and quantities in the mono font.
- Don't use pure black or pure white. The ink is brown and the paper is clay.
- Don't use gradients, glows or drop shadows on cards.
- Don't introduce a color, size or radius that is not a token above.
