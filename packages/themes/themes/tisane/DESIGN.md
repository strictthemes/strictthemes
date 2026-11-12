---
version: alpha
name: Tisane
description: A soft, unhurried theme for food, wellness and places to stay. Oat paper, olive green, a peach accent and a rounded serif.
colors:
  primary: "#4C5B1A"
  on-primary: "#FFFFFF"
  secondary: "#26281C"
  on-secondary: "#FCFAF4"
  tertiary: "#F0B59A"
  on-tertiary: "#26281C"
  neutral: "#626451"
  background: "#F5F1E8"
  surface: "#FCFAF4"
  foreground: "#26281C"
  border: "#DAD5C3"
  error: "#A8321F"
typography:
  display:
    fontFamily: Young Serif
    fontSize: 56px
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: -0.01em
  h1:
    fontFamily: Young Serif
    fontSize: 38px
    fontWeight: 400
    lineHeight: 1.15
  h2:
    fontFamily: Young Serif
    fontSize: 26px
    fontWeight: 400
    lineHeight: 1.25
  body:
    fontFamily: Albert Sans
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: Reddit Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0.04em
rounded:
  sm: 6px
  md: 12px
  lg: 20px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 72px
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
        primary: "#B9CC72"
        on-primary: "#1B2206"
        secondary: "#EDEBDD"
        on-secondary: "#26281C"
        neutral: "#A9AB95"
        background: "#171810"
        surface: "#20221A"
        foreground: "#EDEBDD"
        border: "#36382B"
        error: "#FF917E"
---

## Overview

Tisane is for slow things: a tea shop, a restaurant menu, a yoga studio, a
guesthouse, a recipe journal. It should feel like a linen napkin and a
hand-thrown cup. Colors are taken from plants and grain, corners are soft,
and the page is in no hurry to sell anything.

## Colors

- **Primary (`#4C5B1A`)** is olive green, for the main action and links.
- **Secondary (`#26281C`)** is a dark olive-black for secondary buttons and headings.
- **Tertiary (`#F0B59A`)** is peach, for a badge such as "Seasonal" or "Few left". Dark text on it.
- **Neutral (`#626451`)** sets notes, ingredients' small print and captions.
- **Background (`#F5F1E8`)** is oat paper. **Surface (`#FCFAF4`)** is a lighter cream for cards and menus.
- **Error (`#A8321F`)** is a brick red, used only with a message.

## Typography

Young Serif sets headings in its one weight: a round, sturdy serif that reads
warm at any size. Never fake a bold. Albert Sans sets body text at 17px with
open line spacing. Reddit Mono sets labels: prices, times, weights and
measures, in sentence case. Give text room: lines of 60 to 70 characters.

## Layout

A 12-column grid, 1120px at its widest, with 24px gutters. Pages are mostly a
single calm column with one image or one card beside the text. Spacing comes
from the scale (4, 8, 16, 24, 40, 72): 24px inside a card, 72px between
sections. Leave the oat background showing around everything.

## Elevation & Depth

Flat and matte. A card is cream on oat with a 1px border. No drop shadows on
cards; a menu or a dialog floats on one soft, warm shadow.

## Shapes

Soft, like something worn smooth: 6px for badges and checkboxes, 12px for
buttons and inputs, 20px for cards and images. Avatars are circles.

## Components

- **Buttons**: olive for the one main action, olive-black for the rest. Sentence-case mono labels.
- **Cards**: cream, 20px corners, 24px padding, a 1px border.
- **Badges**: peach with dark text, one or two words.
- **Menus and lists**: a name on the left, a mono price on the right, a 1px rule between rows.
- **Icons**: 1.5px stroke line icons with round caps. Never emoji.

## Do's and Don'ts

- Do keep the palette to what could grow in a garden.
- Do give each section room: one idea, then space.
- Do set prices and times in the mono font, quietly.
- Don't use bright or pure colors, gradients or glows.
- Don't crowd the page with badges or buttons: one of each is usually enough.
- Don't introduce a color, size or radius that is not a token above.
