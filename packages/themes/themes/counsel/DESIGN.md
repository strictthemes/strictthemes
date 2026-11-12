---
version: alpha
name: Counsel
description: A composed, formal theme for law firms, advisers and private offices. White paper, midnight navy, and gold used once.
colors:
  primary: "#14213D"
  on-primary: "#FFFFFF"
  secondary: "#000000"
  on-secondary: "#FFFFFF"
  tertiary: "#FCA311"
  on-tertiary: "#000000"
  neutral: "#5B6170"
  background: "#FFFFFF"
  surface: "#F6F6F6"
  foreground: "#000000"
  border: "#E5E5E5"
  error: "#B3261E"
typography:
  display:
    fontFamily: Marcellus
    fontSize: 60px
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: -0.01em
  h1:
    fontFamily: Marcellus
    fontSize: 40px
    fontWeight: 400
    lineHeight: 1.15
  h2:
    fontFamily: Marcellus
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.3
  body:
    fontFamily: Jost
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Courier Prime
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.06em
rounded:
  sm: 1px
  md: 2px
  lg: 4px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 56px
  2xl: 112px
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
        primary: "#FFC300"
        on-primary: "#000814"
        secondary: "#F4F6FA"
        on-secondary: "#000814"
        tertiary: "#E5E5E5"
        on-tertiary: "#000814"
        neutral: "#9FB0C8"
        background: "#000814"
        surface: "#001D3D"
        foreground: "#F4F6FA"
        border: "#003566"
        error: "#FF8A80"
---

## Overview

Counsel is for firms whose product is judgment: a law firm, a tax adviser, a
family office, an architect's practice. It should read like a letter on good
headed paper: white, black, a midnight navy, and gold used once on a page. Its
dark mode is the same letterhead at night, navy-black with a gold action.

## Colors

- **Primary (`#14213D`)** is midnight navy, for the one main action. In dark mode the main action is gold. Links are the text color, underlined.
- **Secondary (`#000000`)** is black, for secondary buttons and headings.
- **Tertiary (`#FCA311`)** is gold, with black text on it, for one badge or one marked figure on a page: "New partner", "Ranked 2026". In dark mode the gold moves to the main action and the badge is pale grey.
- **Neutral (`#5B6170`)** sets dates, matter numbers and captions.
- **Background (`#FFFFFF`)** is white paper. **Surface (`#F6F6F6`)** is a pale grey for cards and side notes.
- **Error (`#B3261E`)** is used only with a message.

## Typography

Marcellus sets headings in its one weight: a Roman inscription letter that
needs no bold to carry a page. Never fake a bold. Set display and h1 large,
with air above them. Jost sets body text at 17px, a calm geometric sans.
Courier Prime sets labels in uppercase with wide tracking: dates, matter
numbers, the names of practice areas. Figures in a table are tabular.

## Layout

A 12-column grid, 1200px at its widest, with 32px gutters. Text sits in a
column of seven or eight; the columns beside it stay empty or hold one short
note. Spacing comes from the scale (4, 8, 16, 32, 56, 112): 32px inside a
card, 112px between sections. Sections are divided by one hairline, and white
space does the rest.

## Elevation & Depth

Flat. A card is pale grey on white with no shadow. Hairlines, not boxes,
divide a page. Menus and dialogs float on one short, neutral shadow.

## Shapes

Nearly square: 1px for badges, 2px for buttons and inputs, 4px for cards.
Nothing is a pill or a circle; a portrait is a rectangle.

## Components

- **Buttons**: navy for the one main action (gold in dark mode), black for the rest. Uppercase typewriter labels.
- **Cards**: pale grey, 4px corners, 32px padding, no shadow.
- **Badges**: gold with black text (pale grey in dark mode), uppercase, one or two words, once on a page.
- **Lists of people and matters**: a name in the heading font, a role or a date in a label beneath, a hairline between rows.
- **Icons**: 1.5px stroke line icons, used sparingly. Never emoji.

## Do's and Don'ts

- Do use gold once on a page, and let it mean something. The focus outline and a ticked checkbox do not count.
- Do leave wide margins: an empty column is part of the design.
- Do set names and titles in the heading font and the facts about them in labels.
- Don't set Marcellus in bold or italics: it has neither.
- Don't use gradients, glows or photographs with color casts.
- Don't introduce a color, size or radius that is not a token above.
