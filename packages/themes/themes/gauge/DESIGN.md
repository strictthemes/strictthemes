---
version: alpha
name: Gauge
description: A plain, exact theme for hardware, parts and spec sheets. Nine steel greys, dense tables, and no accent color at all.
colors:
  primary: "#212529"
  on-primary: "#F8F9FA"
  secondary: "#E9ECEF"
  on-secondary: "#212529"
  tertiary: "#ADB5BD"
  on-tertiary: "#212529"
  neutral: "#495057"
  background: "#F8F9FA"
  surface: "#FFFFFF"
  foreground: "#212529"
  border: "#CED4DA"
  error: "#B3261E"
  success: "#1E7B4B"
typography:
  display:
    fontFamily: Chivo
    fontSize: 48px
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: -0.02em
  h1:
    fontFamily: Chivo
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.01em
  h2:
    fontFamily: Chivo
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: Libre Franklin
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: Roboto Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.04em
rounded:
  sm: 2px
  md: 4px
  lg: 8px
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
        primary: "#F8F9FA"
        on-primary: "#212529"
        secondary: "#495057"
        on-secondary: "#F8F9FA"
        neutral: "#ADB5BD"
        background: "#212529"
        surface: "#343A40"
        foreground: "#F8F9FA"
        border: "#495057"
        error: "#FF8A80"
        success: "#5CCB8F"
---

## Overview

Gauge is for things that are specified before they are bought: fasteners,
bearings, tools, machines, electronic parts. It reads like a good catalogue
page or a data sheet. There is no accent color: nine greys from steel white to
graphite carry everything, and a product's own brand color can take the place
of the primary without anything else changing.

## Colors

- **Primary (`#212529`)** is graphite, for the one main action in a view: "Add to quote", "Request a quote". Links are the text color, underlined.
- **Secondary (`#E9ECEF`)** is pale steel, with graphite text on it, for every other button.
- **Tertiary (`#ADB5BD`)** is mid steel, with graphite text on it, for a badge: "New", "Made to order".
- **Neutral (`#495057`)** sets units, part numbers and captions.
- **Background (`#F8F9FA`)** is steel white. **Surface (`#FFFFFF`)** is the white of a panel or a table.
- **Success (`#1E7B4B`)** marks "In stock", always with the word. **Error (`#B3261E`)** is for "Discontinued" and form errors, always with a message.

## Typography

Chivo sets headings, heavy and compact. Libre Franklin sets body text at
15px, because these pages carry a lot of it. Roboto Mono sets labels: part
numbers, dimensions, tolerances, units, prices. Every number in a table is
mono and tabular, and right-aligned when it is a quantity.

## Layout

A 12-column grid, 1280px at its widest, with 16px gutters. Pages are dense on
purpose: filters in a narrow column, a table in the rest. Spacing comes from
the scale (4, 8, 12, 16, 24, 48): 16px inside a panel, 48px between sections.
A table may be wider than a phone and scroll inside its own box.

## Elevation & Depth

Flat. A panel is white on steel white with a 1px border. Tables use 1px row
borders and no zebra stripes. Menus and dialogs float on one short, neutral
shadow.

## Shapes

Machined: 2px for badges and checkboxes, 4px for buttons and inputs, 8px for
panels. A status dot is the only circle.

## Components

- **Buttons**: graphite for the one main action in a view, pale steel for the rest. Sentence-case mono labels.
- **Cards (panels)**: white, 8px corners, 16px padding, a 1px border.
- **Badges**: mid steel with graphite text, one or two words.
- **Tables**: a mono header row, 1px row borders, numbers right-aligned with their unit in the column header, not in every cell.
- **Drawings**: a part is drawn in outline, 1px lines in the text color on the panel's white, with its dimensions in labels.
- **Icons**: 1.5px stroke line icons. Never emoji.

## Do's and Don'ts

- Do give every number its unit, once, where the eye finds it.
- Do keep the page grey: a state color appears only beside its word.
- Do let a table be a table: no cards for rows of comparable figures.
- Don't add an accent color, a gradient or a tinted panel.
- Don't round a figure the buyer has to rely on, or hide a part number behind a click.
- Don't introduce a color, size or radius that is not a token above.
