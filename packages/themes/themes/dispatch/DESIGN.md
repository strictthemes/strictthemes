---
version: alpha
name: Dispatch
description: A loud, fast theme for news and sport. Newsprint, black rules, condensed headlines and a breaking-news red.
colors:
  primary: "#BF0D2A"
  on-primary: "#FFFFFF"
  secondary: "#111111"
  on-secondary: "#FFFFFF"
  tertiary: "#FFE14D"
  on-tertiary: "#111111"
  neutral: "#5C5850"
  background: "#F4F1EA"
  surface: "#FFFFFF"
  foreground: "#111111"
  border: "#1C1C1C"
  error: "#9E0019"
typography:
  display:
    fontFamily: Big Shoulders
    fontSize: 88px
    fontWeight: 800
    lineHeight: 0.95
  h1:
    fontFamily: Big Shoulders
    fontSize: 56px
    fontWeight: 800
    lineHeight: 1.0
  h2:
    fontFamily: Big Shoulders
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: Newsreader
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Chivo Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.06em
rounded:
  none: 0
  sm: 1px
  md: 2px
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
        primary: "#FF6B7D"
        on-primary: "#2A0308"
        secondary: "#F4F1EA"
        on-secondary: "#111111"
        neutral: "#A8A39A"
        background: "#121110"
        surface: "#1C1B19"
        foreground: "#F4F1EA"
        border: "#8F8B82"
        error: "#FF8A8A"
---

## Overview

Dispatch is for things that happen today: a news site, a sports desk, a live
blog, a magazine front. It takes after a tabloid front page and a stadium
scoreboard. Headlines are condensed and very large, columns are divided by
black rules, and one red says that something is happening right now.

## Colors

- **Primary (`#BF0D2A`)** is breaking-news red, for the main action, links and the word "Live".
- **Secondary (`#111111`)** is press black for secondary buttons, headlines and rules.
- **Tertiary (`#FFE14D`)** is highlighter yellow, with black text on it, for one marked phrase or an "Exclusive" badge.
- **Neutral (`#5C5850`)** sets bylines, timestamps and captions.
- **Background (`#F4F1EA`)** is newsprint. **Surface (`#FFFFFF`)** is the white of a featured story or a score box.
- **Border (`#1C1C1C`)** is nearly black on purpose: rules are part of the design, as they are in print.

## Typography

Big Shoulders sets headlines: tall, condensed and heavy, at 88px for a front
page lead. Set headlines in uppercase, and keep them short enough to fit two
lines. Newsreader, a text serif, sets body copy at 18px with real italics.
Chivo Mono sets labels, uppercase: section names, bylines, times and scores.
Scores and times use tabular figures.

## Layout

A 12-column grid, 1280px at its widest. Columns of stories are divided by a 1px
rule with 24px on each side of it. One lead story takes eight columns;
the rest stack in the other four. Spacing comes from the scale (4, 8, 16, 24,
48, 96). It is dense: a front page shows many stories, and rules keep them
apart where other themes would use space.

## Elevation & Depth

None. This is ink on paper. Stories are divided by black rules, a featured box
is white on newsprint with a 1px black border, and nothing has a shadow.
Menus and dialogs get a border and one short shadow.

## Shapes

Square. Images, boxes and badges have 0 corners; buttons and inputs have 2px,
just enough not to look broken. No pills, no circles except a "Live" dot.

## Components

- **Buttons**: red for the one main action, black for the rest. Uppercase mono labels.
- **Cards (story boxes)**: white, square, 24px padding, a 1px black border.
- **Badges**: yellow with black text for "Exclusive"; a red dot and the word "Live" for live coverage.
- **Rules**: 1px black between stories, 2px above a section name.
- **Pictures**: square, with no border. Where there is no image file, a flat block in the muted color stands in for the picture, with its caption under it.
- **Icons**: 1.5px stroke line icons. Never emoji.

## Do's and Don'ts

- Do make one headline much larger than everything else on the screen.
- Do divide with rules and keep the columns tight.
- Do keep red for what is live, new or the main action. The focus outline is red as well: it marks where the reader is, and it is the one other use.
- Don't soften it: no rounded cards, no shadows, no pale grey borders.
- Don't set body copy in the headline font, or headlines in sentence case.
- Don't introduce a color, size or radius that is not a token above.
