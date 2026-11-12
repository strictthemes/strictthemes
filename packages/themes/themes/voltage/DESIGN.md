---
version: alpha
name: Voltage
description: A bold poster of a theme for launches, events and music. A yellow page, black ink, thick shapes and electric blue.
colors:
  primary: "#0A0A0A"
  on-primary: "#FFE500"
  secondary: "#2B2BF0"
  on-secondary: "#FFFFFF"
  tertiary: "#FF4F9A"
  on-tertiary: "#0A0A0A"
  neutral: "#4A4838"
  background: "#FFE500"
  surface: "#FFFFFF"
  foreground: "#0A0A0A"
  border: "#0A0A0A"
  error: "#B00020"
typography:
  display:
    fontFamily: Unbounded
    fontSize: 64px
    fontWeight: 900
    lineHeight: 1.0
    letterSpacing: -0.03em
  h1:
    fontFamily: Unbounded
    fontSize: 38px
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -0.02em
  h2:
    fontFamily: Unbounded
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.01em
  body:
    fontFamily: Familjen Grotesk
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0.04em
rounded:
  sm: 6px
  md: 14px
  lg: 22px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 20px
  xl: 32px
  2xl: 64px
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
        primary: "#FFE500"
        on-primary: "#0A0A0A"
        secondary: "#5B5BFF"
        on-secondary: "#FFFFFF"
        neutral: "#B5B29C"
        background: "#0A0A0A"
        surface: "#171717"
        foreground: "#F7F5E6"
        border: "#F7F5E6"
        error: "#FF7A7A"
---

## Overview

Voltage is for things with a date on them: a product launch, a festival, a
game, a drop, a conference. It is a street poster turned into an interface.
The page itself is yellow, the ink is black, panels are white with black
outlines, and the type is wide and heavy. It is meant to be noticed from
across the room.

## Colors

- **Background (`#FFE500`)** is signal yellow. It is the brand: the page, not a button, carries the color.
- **Primary (`#0A0A0A`)** is black, for the main action, with yellow text on it.
- **Secondary (`#2B2BF0`)** is electric blue, a fill for the second action. It is not a text color: links are black and underlined.
- **Tertiary (`#FF4F9A`)** is hot pink, with black text on it, for one badge: "Sold out", "Tonight", "New".
- **Surface (`#FFFFFF`)** is white, for panels, forms and tickets.
- **Neutral (`#4A4838`)** sets small print. **Border (`#0A0A0A`)** is black: every panel and field is outlined.
- **Error (`#B00020`)** is a dark red that still reads on yellow. Pair it with a word.

## Typography

Unbounded sets headings: very wide and very heavy, so a few words fill a line.
Keep headlines to five words or fewer. Familjen Grotesk sets body text at
17px. Space Mono in bold sets labels, uppercase: dates, times, prices, seat
numbers. Numbers are part of the look, so set dates and countdowns large.

## Layout

A 12-column grid, 1200px at its widest, with 20px gutters. Sections are blocks
stacked like posters on a wall: a full-width headline, then white panels on
the yellow. Spacing comes from the scale (4, 8, 12, 20, 32, 64): 20px inside
a panel, 64px between sections. Fill the width; this theme does not whisper
from a narrow column.

## Elevation & Depth

Flat, with outlines. A panel is white with a 1px black border. No shadows, no
offset "sticker" shadows either. Menus and dialogs are outlined the same way
and get one short shadow.

## Shapes

Thick and round: 6px for badges and checkboxes, 14px for buttons and inputs,
22px for panels. Avatars and countdown dots are circles.

## Components

- **Buttons**: black with yellow text for the one main action, electric blue for the second. Bold uppercase mono labels.
- **Cards (panels)**: white, 22px corners, 20px padding, a 1px black border.
- **Badges**: hot pink with black text, uppercase, one or two words.
- **Inputs**: white with a black border, so they read on the yellow page.
- **Icons**: 2px stroke line icons. Never emoji.

## Do's and Don'ts

- Do keep the page yellow and put content on white panels.
- Do set one short headline very large.
- Do outline every panel and field in black.
- Don't put small body text straight on yellow for long passages: use a panel.
- Don't add gradients, glows or hard offset shadows.
- Don't introduce a color, size or radius that is not a token above.
