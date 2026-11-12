---
version: alpha
name: Strict One
description: A disciplined, Swiss-grid editorial theme. One accent, hard edges, no decoration.
colors:
  primary: "#1F3BFF"
  on-primary: "#FFFFFF"
  secondary: "#111111"
  on-secondary: "#FFFFFF"
  tertiary: "#FF4F00"
  on-tertiary: "#111111"
  neutral: "#6B6B6B"
  background: "#FFFFFF"
  surface: "#F5F5F4"
  foreground: "#111111"
  border: "#E2E2E0"
  error: "#C62828"
typography:
  display:
    fontFamily: Archivo
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.02em
  h1:
    fontFamily: Archivo
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.01em
  h2:
    fontFamily: Archivo
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.08em
rounded:
  none: 0
  sm: 2px
  md: 4px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm} {spacing.md}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
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
    rounded: "{rounded.md}"
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
    extra: ["0", "1px"]
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
    glow-shadows: warn
  modes:
    dark:
      colors:
        primary: "#8091FF"
        on-primary: "#0B0B0C"
        secondary: "#F5F5F4"
        on-secondary: "#111111"
        neutral: "#A3A3A0"
        background: "#0B0B0C"
        surface: "#161618"
        foreground: "#F5F5F4"
        border: "#2A2A2E"
        error: "#FF6B5E"
---

## Overview

Strict One is an editorial theme built on a visible grid. It reads like a well-set
printed page: generous whitespace, strong type contrast, and a single saturated
blue used only where the reader should act. Nothing is decorative. If an element
does not carry content or structure, remove it.

## Colors

- **Primary (`#1F3BFF`)** is for the one main action on a screen and for links. Never use it for large fills or backgrounds.
- **Secondary (`#111111`)** is ink: headings, secondary buttons, rules.
- **Tertiary (`#FF4F00`)** is a signal color for a badge or a status only. At most one thing per view has it.
- **Neutral (`#6B6B6B`)** is for captions and metadata.
- **Background / Surface** are flat. No gradients, no tints of primary.
- **Error (`#C62828`)** is reserved for validation and destructive actions.

## Typography

Archivo sets headings, tight and heavy. IBM Plex Sans sets body text at 16px with a
1.6 line height and a measure of 60–75 characters. IBM Plex Mono sets labels in
uppercase with wide tracking. Use only the five sizes defined above; hierarchy
comes from size and weight, never from color.

## Layout

A 12-column grid with 32px gutters and a 1200px maximum width. All spacing comes
from the scale (4, 8, 16, 32, 64). Align everything to the grid's left edge;
centered layouts are the exception, not the default. Separate sections with
whitespace or a 1px border, not with boxes.

## Elevation & Depth

Flat. There are no shadows and no blur. Layers are separated by a 1px border in
the border color or by a change from background to surface.

## Shapes

Corners are square or nearly so: 0 for badges and images, 2px for controls, 4px
for cards. Nothing is pill-shaped or circular except avatars.

## Components

- **Buttons**: one primary button per view. Labels are uppercase mono, 12px.
- **Cards**: surface fill, 32px padding, no shadow. Never nest a card inside a card.
- **Badges**: square. The tertiary fill is for the one badge on a view that signals something. Any other badge on that view is outlined: a 1px border and no fill.
- **Icons**: 1.5px stroke line icons. Never emoji.

## Do's and Don'ts

- Do keep one accent color per screen.
- Do let whitespace separate content.
- Don't use gradients, glows, glassmorphism or drop shadows.
- Don't use emoji as icons or bullets.
- Don't introduce a color, size or radius that is not a token above.
