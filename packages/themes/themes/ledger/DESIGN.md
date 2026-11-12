---
version: alpha
name: Ledger
description: A sober, exact theme for money and reports. Cream paper, pine green, a serif for the big numbers.
colors:
  primary: "#0E5A40"
  on-primary: "#FFFFFF"
  secondary: "#14211B"
  on-secondary: "#FFFFFF"
  tertiary: "#B98A2F"
  on-tertiary: "#14211B"
  neutral: "#5A6860"
  background: "#F6F4EC"
  surface: "#FFFFFF"
  foreground: "#14211B"
  border: "#D9D6C8"
  error: "#B42318"
typography:
  display:
    fontFamily: Instrument Serif
    fontSize: 64px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -0.01em
  h1:
    fontFamily: Instrument Serif
    fontSize: 42px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: -0.01em
  h2:
    fontFamily: Instrument Serif
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: Instrument Sans
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: Spline Sans Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.05em
rounded:
  sm: 2px
  md: 3px
  lg: 6px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 48px
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
    padding: "{spacing.xl}"
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
        primary: "#5FD3A4"
        on-primary: "#062016"
        secondary: "#E9EFE9"
        on-secondary: "#14211B"
        neutral: "#93A49A"
        background: "#0D1512"
        surface: "#15201B"
        foreground: "#E9EFE9"
        border: "#26352D"
        error: "#FF7D6E"
---

## Overview

Ledger is for interfaces about money: banking, invoicing, accounting, annual
reports. It borrows from a bound account book and a private bank's letterhead.
The tone is quiet confidence. Nothing shouts, every figure can be found again,
and the serif gives the large numbers the weight of something signed.

## Colors

- **Primary (`#0E5A40`)** is pine green, for the main action, links and money coming in.
- **Secondary (`#14211B`)** is a green-black ink for secondary buttons and headings.
- **Tertiary (`#B98A2F`)** is brass. Use it for a badge that marks something to act on: "Due", "Pending", "Review".
- **Neutral (`#5A6860`)** sets labels, column headers and notes.
- **Background (`#F6F4EC`)** is cream paper. **Surface (`#FFFFFF`)** is the white sheet a statement or a table sits on.
- **Error (`#B42318`)** is for money going out and for failures. Say which in words: a minus sign, "Overdue", "Declined".

## Typography

Instrument Serif sets headings and key figures in one weight, regular. Size
does the work, so never fake a bold. Instrument Sans sets body text at 15px,
sized for tables. Spline Sans Mono sets labels, amounts in tables, account
numbers and dates. Labels are uppercase with wide tracking. Use tabular figures
wherever amounts are compared, and align them to the right.

## Layout

A 12-column grid, 1200px at its widest, with 24px gutters. Statements and
tables sit on white sheets on the cream page. Spacing comes from the scale
(4, 8, 12, 16, 24, 48), and it is tight: 12px between a label and its field
group, 24px inside a sheet, 48px between sections. Rule lines do the dividing
that whitespace does elsewhere.

## Elevation & Depth

Flat. A sheet is white on cream with a 1px border. Totals are set off by a
double rule, not by a shadow or a fill. Only menus and dialogs float, on one
short, neutral shadow.

## Shapes

Nearly square, like cut paper: 2px for badges, 3px for buttons and inputs, 6px
for sheets. No pills.

## Components

- **Buttons**: pine green for the main action of a view, green-black for the rest. Uppercase mono labels.
- **Cards (sheets)**: white, 6px corners, 24px padding, a 1px border.
- **Badges**: brass with dark text, for things that wait on someone.
- **Tables**: mono amounts, right-aligned, a 1px rule under each row, the total row in the heading font.
- **Icons**: 1.5px stroke line icons. Never emoji.

## Do's and Don'ts

- Do right-align amounts and use tabular figures.
- Do show a negative amount with a minus sign and a word, not by color alone.
- Do keep the serif in its one weight and let size set the hierarchy.
- Don't use green and red as decoration: here they mean in and out.
- Don't use gradients, glows or rounded pills.
- Don't introduce a color, size or radius that is not a token above.
