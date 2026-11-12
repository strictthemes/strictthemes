---
version: alpha
name: Confetti
description: A light, cheerful theme for invitations, parties and gift lists. Lilac-white paper, plum ink, and pastel pink, sky and lilac.
colors:
  primary: "#4A2A63"
  on-primary: "#FFFFFF"
  secondary: "#CDB4DB"
  on-secondary: "#2E1A3F"
  tertiary: "#A2D2FF"
  on-tertiary: "#2E1A3F"
  neutral: "#6B5480"
  background: "#FBF7FD"
  surface: "#FFFFFF"
  foreground: "#2E1A3F"
  border: "#DCCBE6"
  error: "#B3123F"
  blush: "#FFC8DD"
  on-blush: "#2E1A3F"
  candy: "#FFAFCC"
  on-candy: "#2E1A3F"
  mist: "#BDE0FE"
  on-mist: "#2E1A3F"
typography:
  display:
    fontFamily: Caprasimo
    fontSize: 64px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -0.01em
  h1:
    fontFamily: Caprasimo
    fontSize: 40px
    fontWeight: 400
    lineHeight: 1.1
  h2:
    fontFamily: Caprasimo
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: Nunito
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Ubuntu Sans Mono
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.02em
rounded:
  sm: 8px
  md: 14px
  lg: 24px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 24px
  xl: 40px
  2xl: 88px
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
        primary: "#FFAFCC"
        on-primary: "#2E1A3F"
        neutral: "#BFAACC"
        background: "#1E1229"
        surface: "#2A1A38"
        foreground: "#F7EEFA"
        border: "#4B3460"
        error: "#FF9BB0"
---

## Overview

Confetti is for happy occasions and the pages that organise them: a wedding
invitation, a birthday, a baby shower, an RSVP form, a gift list. It should
feel like a card that came in the post: soft paper, a fat friendly serif, and
blocks of pastel. The pastels are fills. Everything that has to be read is
plum ink.

## Colors

- **Primary (`#4A2A63`)** is plum, for the one main action: "Reply", "Send", "Add my share". Links in running text use it too. In dark mode the main action is pink with plum text.
- **Secondary (`#CDB4DB`)** is lilac, with ink on it, for every other button.
- **Tertiary (`#A2D2FF`)** is sky blue, with ink on it, for one badge: "Reserved", "Day two", "Plus one".
- **Blush (`#FFC8DD`), candy (`#FFAFCC`) and mist (`#BDE0FE`)** fill large blocks: an opening, a date panel, a section band. They are the same in both modes, and text on them is always plum ink (`#2E1A3F`), in dark mode too, never the mode's text color.
- **Neutral (`#6B5480`)** sets dates, addresses and captions.
- **Background (`#FBF7FD`)** is lilac-white paper. **Surface (`#FFFFFF`)** is the white of a card.
- **Error (`#B3123F`)** is used only with a message.

## Typography

Caprasimo sets headings in its one weight: a fat, soft serif that is already
bold. Never fake a heavier weight or an italic. Set names and dates large.
Nunito sets body text at 17px, rounded and easy. Ubuntu Sans Mono sets labels
in sentence case: dates, times, addresses, counts of guests, prices.

## Layout

A 12-column grid, 1040px at its widest, with 24px gutters. Most pages are one
centered column, the way a card is read, with a pastel block at the top.
Spacing comes from the scale (4, 8, 12, 24, 40, 88): 24px inside a card, 88px
between sections. Blocks of color alternate with white paper; two pastel
blocks never touch.

## Elevation & Depth

Flat, like printed card. A card is white with a 1px lilac border and no
shadow. A pastel block has no border. Menus and dialogs float on one soft,
plum-tinted shadow.

## Shapes

Soft and generous: 8px for badges and checkboxes, 14px for buttons and
inputs, 24px for cards and color blocks. Avatars and switches are fully round.

## Components

- **Buttons**: plum for the one main action (pink in dark mode), lilac for the rest. Sentence-case mono labels.
- **Cards**: white, 24px corners, 24px padding, a 1px lilac border.
- **Badges**: sky blue with ink text, one or two words.
- **Color blocks**: blush, candy or mist, 24px corners, ink text, one heading and a few facts.
- **Icons**: 1.5px stroke line icons with round caps. Never emoji, however festive the page.

## Do's and Don'ts

- Do keep text in plum ink: a pastel is a fill, never a text color.
- Do keep buttons, links and fields on the paper: a pastel block holds text only.
- Do use one pastel per block, and white paper between blocks.
- Do say the date, the time and the place plainly, near the top.
- Don't scatter decoration: no confetti drawn in code, no gradients, no glows.
- Don't put a pastel block inside a card or a card inside a card.
- Don't introduce a color, size or radius that is not a token above.
