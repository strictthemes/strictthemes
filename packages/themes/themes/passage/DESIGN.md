---
version: alpha
name: Passage
description: A clear, airy theme for travel and booking. Pale-water paper, deep navy ink, and one hue of blue from light to dark.
colors:
  primary: "#023E8A"
  on-primary: "#FFFFFF"
  secondary: "#03045E"
  on-secondary: "#CAF0F8"
  tertiary: "#00B4D8"
  on-tertiary: "#03045E"
  neutral: "#35527A"
  background: "#CAF0F8"
  surface: "#FFFFFF"
  foreground: "#03045E"
  border: "#90E0EF"
  error: "#B3261E"
  success: "#0B6B4F"
typography:
  display:
    fontFamily: Overpass
    fontSize: 56px
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: -0.02em
  h1:
    fontFamily: Overpass
    fontSize: 36px
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: -0.01em
  h2:
    fontFamily: Overpass
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: Karla
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: Overpass Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.04em
rounded:
  sm: 6px
  md: 10px
  lg: 18px
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
        primary: "#48CAE4"
        on-primary: "#03045E"
        secondary: "#CAF0F8"
        on-secondary: "#03045E"
        neutral: "#90E0EF"
        background: "#02033B"
        surface: "#03045E"
        foreground: "#E6F8FC"
        border: "#023E8A"
        error: "#FF9B93"
        success: "#6FD9B4"
---

## Overview

Passage is for getting people from one place to another: a ferry line, an
airline, a rail operator, a tour company, a hotel's booking pages. It borrows
from departure boards and boarding passes. The page is pale water, cards are
white, and every color on it is one blue at a different depth.

## Colors

- **Primary (`#023E8A`)** is deep sea blue, for the one main action on a screen: "Search", "Continue", "Pay". Links in running text use it too.
- **Secondary (`#03045E`)** is navy ink for secondary buttons and headings.
- **Tertiary (`#00B4D8`)** is bright cyan, with navy text on it, for one badge: "Direct", "Lowest fare", "Boarding".
- **Neutral (`#35527A`)** sets times of day, fare rules and captions.
- **Background (`#CAF0F8`)** is pale water. **Surface (`#FFFFFF`)** is the white of a card or a ticket.
- **Success (`#0B6B4F`)** marks "On time" and "Confirmed", always with the word. **Error (`#B3261E`)** is for "Cancelled" and form errors, always with a message.

## Typography

Overpass sets headings: it was drawn from road signs, and reads at a glance.
Karla sets body text at 16px. Overpass Mono sets labels: times, port and
airport codes, booking references, seat numbers, prices. Times and prices use
tabular figures, and a time is always written in 24 hours.

## Layout

A 12-column grid, 1120px at its widest, with 20px gutters. A booking page is
one column of white cards on the water, with a summary beside it on a wide
screen. Spacing comes from the scale (4, 8, 12, 20, 32, 64): 20px inside a
card, 64px between sections. A journey is always read left to right: where
from, when, where to.

## Elevation & Depth

Flat. A white card on the pale page needs no shadow, only its 1px border. A
ticket is a card with one dashed rule where it would tear. Menus and dialogs
float on one short, blue-tinted shadow.

## Shapes

Rounded like a boarding pass: 6px for badges and checkboxes, 10px for buttons
and inputs, 18px for cards and tickets. Avatars and switches are fully round.

## Components

- **Buttons**: deep blue for the one main action, navy for the rest. Sentence-case mono labels.
- **Cards**: white, 18px corners, 20px padding, a 1px border.
- **Badges**: cyan with navy text, one or two words.
- **Journeys**: a mono time and a place on the left, the same on the right, and a 1px line between them with the duration above it.
- **Icons**: 1.5px stroke line icons. Never emoji.

## Do's and Don'ts

- Do keep to the one hue: depth of blue is how this theme says what matters.
- Do give a state a word as well as a color: "On time", "Delayed 20 min".
- Do put the price where the eye ends its line, on the right, in mono figures.
- Don't add a second accent color, a gradient or a photograph behind text.
- Don't write a time without its place, or a price without its currency.
- Don't introduce a color, size or radius that is not a token above.
