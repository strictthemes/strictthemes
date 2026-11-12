---
version: alpha
name: Ember
description: A hot, dark-first theme for games, esports and sport. Blue-black, ember red, and an amber signal from the same fire.
colors:
  primary: "#9D0208"
  on-primary: "#FFFFFF"
  secondary: "#03071E"
  on-secondary: "#FFF5E9"
  tertiary: "#FFBA08"
  on-tertiary: "#03071E"
  neutral: "#6A4B52"
  background: "#FFF5E9"
  surface: "#FFFFFF"
  foreground: "#03071E"
  border: "#E5CBAE"
  error: "#D00000"
  heat-low: "#DC2F02"
  heat-mid: "#F48C06"
  heat-high: "#FFBA08"
typography:
  display:
    fontFamily: Oxanium
    fontSize: 72px
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: -0.01em
  h1:
    fontFamily: Oxanium
    fontSize: 44px
    fontWeight: 700
    lineHeight: 1.05
  h2:
    fontFamily: Oxanium
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: Sofia Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: Martian Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.04em
rounded:
  sm: 1px
  md: 3px
  lg: 6px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 24px
  xl: 48px
  2xl: 80px
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
    full: 12px
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
        primary: "#D00000"
        on-primary: "#FFFFFF"
        secondary: "#FFF5E9"
        on-secondary: "#03071E"
        neutral: "#B5A6AC"
        background: "#03071E"
        surface: "#0D1128"
        foreground: "#FFF5E9"
        border: "#2A2140"
        error: "#FF7B6B"
---

## Overview

Ember is for things people play and compete in: a game's home page, patch
notes, a leaderboard, an item shop, a team or a gym. Its dark mode is the main
one: a blue-black page lit by one red and one amber, both taken from the same
fire. In light mode the red deepens on a warm white. It is loud in its type
and strict in its color.

## Colors

- **Primary (`#9D0208`)** is ember red, a brighter red in dark mode, for the one main action: "Play free", "Buy", "Join". Links are the text color, underlined.
- **Secondary (`#03071E`)** is blue-black for secondary buttons and headings.
- **Tertiary (`#FFBA08`)** is amber, with blue-black text on it, for one badge: "Live", "New season", "Rank 1".
- **Neutral (`#6A4B52`)** sets dates, version numbers and captions.
- **Background (`#FFF5E9`)** is warm white, and blue-black (`#03071E`) in dark mode. **Surface** is one step lighter than the page.
- **Heat (`heat-low` `#DC2F02`, `heat-mid` `#F48C06`, `heat-high` `#FFBA08`)** is a three-step scale for meters, ranks and chart bars, the same in both modes: red-orange, orange, amber. It is never a text color and never a button, and its value is always written beside it.
- **Error (`#D00000`)** is red like the action, so it is never shown without an icon and a message.

## Typography

Oxanium sets headings: squared, wide and heavy. Set display titles in
uppercase and let them run large. Sofia Sans sets body text at 16px. Martian
Mono sets labels in uppercase: versions, ranks, scores, dates, prices. Scores
and timers use tabular figures.

## Layout

A 12-column grid, 1280px at its widest, with 24px gutters. An opening fills
the first screen with one title and one action. Below it the page is dense:
tables, tiles and lists packed on the grid. Spacing comes from the scale (4,
8, 12, 24, 48, 80): 24px inside a card, 80px between sections.

## Elevation & Depth

Flat and dark. A card is one step lighter than the page, with a 1px border.
Nothing glows, however much the subject asks for it. Menus and dialogs float
on one short, neutral shadow.

## Shapes

Hard: 1px for badges, 3px for buttons and inputs, 6px for cards. A status dot
is the only circle.

## Components

- **Buttons**: red for the one main action, blue-black (warm white in dark mode) for the rest. Uppercase mono labels.
- **Cards**: 6px corners, 24px padding, a 1px border.
- **Badges**: amber with dark text, uppercase, one or two words.
- **Tables and leaderboards**: mono figures, right-aligned numbers, a 1px row border, the viewer's own row marked with a heat bar at its left edge.
- **Meters**: a flat bar filled with one heat color; low, mid and high are the three steps.
- **Icons**: 1.5px stroke line icons. Never emoji.

## Do's and Don'ts

- Do design the dark mode first: it is where this theme lives.
- Do keep red to one action per screen and amber to one badge.
- Do let numbers be large: a score or a rank can be the biggest thing on a page.
- Don't add glows, neon, gradients or blurred glass.
- Don't use a heat color for text or for a button.
- Don't introduce a color, size or radius that is not a token above.
