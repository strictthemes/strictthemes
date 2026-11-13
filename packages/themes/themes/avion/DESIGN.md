---
version: alpha
name: Avion
description: A calm, precise theme for dashboards and tools. Cool greys, clear numbers, and one teal signal.
colors:
  primary: "#085F66"
  on-primary: "#FFFFFF"
  secondary: "#16242E"
  on-secondary: "#FFFFFF"
  tertiary: "#BF8200"
  on-tertiary: "#16242E"
  neutral: "#5B6B76"
  background: "#F3F6F8"
  surface: "#FFFFFF"
  foreground: "#16242E"
  border: "#D5DDE3"
  error: "#C2362B"
  success: "#1E7B4B"
typography:
  display:
    fontFamily: Red Hat Display
    fontSize: 52px
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: -0.02em
  h1:
    fontFamily: Red Hat Display
    fontSize: 34px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.01em
  h2:
    fontFamily: Red Hat Display
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: Red Hat Text
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: Red Hat Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.06em
rounded:
  sm: 4px
  md: 8px
  lg: 14px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 20px
  xl: 32px
  2xl: 56px
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
        primary: "#3FC1CC"
        on-primary: "#06262B"
        secondary: "#E7EEF2"
        on-secondary: "#16242E"
        tertiary: "#F2A900"
        on-tertiary: "#16242E"
        neutral: "#93A4AF"
        background: "#0C151B"
        surface: "#14212A"
        foreground: "#E7EEF2"
        border: "#243540"
        error: "#FF7A6B"
        success: "#4CC38A"
---

## Overview

Avion is for interfaces people work in all day: dashboards, admin tools, status
pages. It borrows from instrument panels. Everything has a fixed place, numbers
are easy to compare, and color means something has changed. It should feel calm
when all is well and make the one thing that needs attention obvious.

## Colors

- **Primary (`#085F66`)** is teal, for the main action, the selected item and links.
- **Secondary (`#16242E`)** is a deep blue-black for secondary buttons and headings.
- **Tertiary (`#BF8200`)** is amber, a caution signal. Use it for badges and warnings, never as decoration. It is dark enough to stand alone as a dot or a bar on white (3.3:1); dark mode uses a brighter `#F2A900`.
- **Neutral (`#5B6B76`)** sets labels, units and secondary text.
- **Background (`#F3F6F8`)** is the cool grey of the page. **Surface (`#FFFFFF`)** is the panel that sits on it.
- **Success (`#1E7B4B`) and Error (`#C2362B`)** report state. Pair them with an icon or a word; never rely on color alone.

## Typography

Red Hat Display sets headings, heavy and compact. Red Hat Text sets body text at
15px, sized for dense screens. Red Hat Mono sets labels, table figures, IDs and
timestamps, so digits line up in columns. Labels are uppercase with wide tracking.
Use tabular figures wherever numbers are compared.

## Layout

A 12-column grid with 20px gutters. Content is grouped into panels on the grey
page, with 20px between panels and 20px padding inside them. Spacing comes from
the scale (4, 8, 12, 20, 32, 56). Keep related controls close and align numbers
to the right. Density is a feature: do not pad a table to fill the screen.

## Elevation & Depth

Two levels. Panels sit on the page by color alone: white on grey, with a 1px
border. Things that float, such as menus, dialogs and tooltips, get one short,
neutral shadow. No colored shadows and no blur.

## Shapes

Rounded but exact: 4px for badges and small controls, 8px for buttons and inputs,
14px for panels. Status dots are the only circles.

## Components

- **Buttons**: teal for the main action in a panel, blue-black for the rest. Uppercase mono labels.
- **Cards (panels)**: white, 14px corners, 20px padding, 1px border. Each has a short label at the top.
- **Badges**: amber for caution. Use the success and error colors for state.
- **Tables**: mono figures, right-aligned numbers, a 1px row border, no zebra stripes.
- **Icons**: 1.5px stroke line icons. Never emoji.

## Do's and Don'ts

- Do keep the page calm: most of the screen is grey, white and blue-black.
- Do use color only for state and for the main action.
- Do align numbers and use tabular figures.
- Don't use gradients, glows or glass effects.
- Don't use amber, green or red for decoration.
- Don't introduce a color, size or radius that is not a token above.
