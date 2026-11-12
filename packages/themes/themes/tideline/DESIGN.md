---
version: alpha
name: Tideline
description: A sunny, sturdy theme for surf schools, outdoor centres and the coast. Sand paper, deep-sea ink, and lagoon, sun and coral in flat blocks.
colors:
  primary: "#264653"
  on-primary: "#FFFFFF"
  secondary: "#E9C46A"
  on-secondary: "#12262D"
  tertiary: "#F4A261"
  on-tertiary: "#12262D"
  neutral: "#4F6770"
  background: "#FBF5E6"
  surface: "#FFFFFF"
  foreground: "#12262D"
  border: "#E3D9BF"
  error: "#B3261E"
  lagoon: "#2A9D8F"
  on-lagoon: "#12262D"
  coral: "#E76F51"
  on-coral: "#12262D"
typography:
  display:
    fontFamily: Epilogue
    fontSize: 60px
    fontWeight: 800
    lineHeight: 1.0
    letterSpacing: -0.02em
  h1:
    fontFamily: Epilogue
    fontSize: 40px
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -0.01em
  h2:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: Manrope
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.3
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
        primary: "#E9C46A"
        on-primary: "#12262D"
        secondary: "#FBF5E6"
        on-secondary: "#12262D"
        neutral: "#A9BEC4"
        background: "#12262D"
        surface: "#1B3640"
        foreground: "#FBF5E6"
        border: "#2F5360"
        error: "#FF9B8A"
---

## Overview

Tideline is for businesses that work outdoors and by the water: a surf school,
a sailing club, a campsite, a kayak hire, a coastal walk. It should feel like
a painted sign on a beach hut: sand, deep-sea ink, and flat blocks of lagoon
green, sun yellow and coral. The colors are fills. Everything that has to be
read is ink.

## Colors

- **Primary (`#264653`)** is deep-sea charcoal, for the one main action: "Book a lesson", "Check the forecast". In dark mode the main action is sun yellow with ink text. Links are the text color, underlined.
- **Secondary (`#E9C46A`)** is sun yellow, with ink on it, for every other button.
- **Tertiary (`#F4A261`)** is warm orange, with ink on it, for one badge: "Beginners", "Low tide", "Few places left".
- **Lagoon (`#2A9D8F`) and coral (`#E76F51`)** fill large blocks: an opening, a conditions strip, a section band. They are the same in both modes, and text on them is always ink (`#12262D`), in dark mode too, never the mode's text color.
- **Neutral (`#4F6770`)** sets times, heights, distances and captions.
- **Background (`#FBF5E6`)** is sand. **Surface (`#FFFFFF`)** is the white of a card.
- **Error (`#B3261E`)** is used only with a message.

## Typography

Epilogue sets headings at weight 800: a wide, sturdy grotesque that reads from
across a car park. Keep headings short and set them tight. Manrope sets body
text at 17px. Geist Mono sets labels in uppercase with a little tracking: tide
times, wave heights, wind, prices, ages. Figures in a table are tabular.

## Layout

A 12-column grid, 1200px at its widest, with 24px gutters. Spacing comes from
the scale (4, 8, 16, 24, 40, 96): 24px inside a card, 96px between sections.
A page opens on one block of color that runs the width of the container.
Blocks of color alternate with sand; two blocks never touch.

## Elevation & Depth

Flat, like paint. A card is white on sand with a 1px border and no shadow. A
block of color has no border. Menus and dialogs float on one short, neutral
shadow.

## Shapes

Rounded like worn wood: 6px for badges and checkboxes, 12px for buttons and
inputs, 20px for cards and color blocks. Avatars and switches are fully round.

## Components

- **Buttons**: charcoal for the one main action (sun yellow in dark mode), sun yellow for the rest (sand in dark mode). Uppercase mono labels.
- **Cards**: white, 20px corners, 24px padding, a 1px border.
- **Badges**: orange with ink text, one or two words.
- **Color blocks**: lagoon or coral, 20px corners, ink text, one heading and a few facts.
- **Conditions**: a row of facts, each a label over a large figure: tide, swell, wind, water.
- **Icons**: 2px stroke line icons with round caps. Never emoji.

## Do's and Don'ts

- Do keep text in ink: lagoon and coral are fills, never text colors.
- Do keep buttons, links and fields on sand or white: a color block holds text only.
- Do use one color per block, and sand between blocks.
- Do give the facts a visitor plans by (time, place, price, what to bring) plainly.
- Don't draw waves, suns or palm trees in code, and don't use gradients or glows.
- Don't put a color block inside a card or a card inside a card.
- Don't introduce a color, size or radius that is not a token above.
