---
version: alpha
name: Cipher
description: A sharp, technical theme for developer tools. Monospace headings, cool paper, electric violet and one acid-lime signal.
colors:
  primary: "#5B32E6"
  on-primary: "#FFFFFF"
  secondary: "#0E1116"
  on-secondary: "#FFFFFF"
  tertiary: "#C6F135"
  on-tertiary: "#0E1116"
  neutral: "#565E6E"
  background: "#F1F3F1"
  surface: "#FFFFFF"
  foreground: "#0E1116"
  border: "#D3D8DA"
  error: "#C4281C"
  success: "#177A45"
typography:
  display:
    fontFamily: JetBrains Mono
    fontSize: 44px
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -0.04em
  h1:
    fontFamily: JetBrains Mono
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.03em
  h2:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.02em
  body:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.02em
rounded:
  sm: 3px
  md: 6px
  lg: 10px
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
        primary: "#A893FF"
        on-primary: "#120A33"
        secondary: "#E6E9EE"
        on-secondary: "#0E1116"
        neutral: "#8E97A6"
        background: "#0B0D10"
        surface: "#13161B"
        foreground: "#E6E9EE"
        border: "#262B34"
        error: "#FF7B72"
        success: "#56D38A"
---

## Overview

Cipher is for things developers use: a CLI's website, API docs, a deploy
dashboard, a changelog. It looks like a well-kept terminal brought into
daylight. Headings are set in the same monospace as the code, so prose and
commands read as one voice, and the page keeps the even rhythm of a text
buffer.

## Colors

- **Primary (`#5B32E6`)** is electric violet, for the main action, links and the cursor.
- **Secondary (`#0E1116`)** is near-black ink for secondary buttons and headings.
- **Tertiary (`#C6F135`)** is acid lime, a highlighter. Use it for one badge or one marked line, with dark text on it. It is never a text color.
- **Neutral (`#565E6E`)** sets comments, labels and secondary text.
- **Background (`#F1F3F1`)** is cool, faintly green paper. **Surface (`#FFFFFF`)** is the white of a panel or a code block.
- **Success (`#177A45`) and Error (`#C4281C`)** are for exit states: passed and failed. Pair them with the word.

## Typography

JetBrains Mono sets headings and labels. Monospace runs wide, so headings are
smaller than in other themes and tracked in tightly. Geist sets body text at
15px. Code, commands, file names, versions and hashes are always in the mono
font. Labels are lowercase or sentence case, the way a prompt would print them.

## Layout

A 12-column grid, 1200px at its widest, with 24px gutters. Docs use a narrow
reading column and a sidebar; tools use panels. Spacing comes from the scale
(4, 8, 12, 16, 24, 48), in the dense half of it: 12px between related lines,
24px inside a panel, 48px between sections. Left-align everything, as a
terminal does.

## Elevation & Depth

Flat. A panel is white on the page with a 1px border, like a window with no
shadow. Only menus, dialogs and tooltips float, on one short, neutral shadow.

## Shapes

The corners of a terminal window: 3px for badges and inline code, 6px for
buttons and inputs, 10px for panels and code blocks. No pills, and no circles except a status
dot.

## Components

- **Buttons**: violet for the one main action, near-black for the rest. Mono labels.
- **Cards (panels)**: white, 10px corners, 24px padding, a 1px border.
- **Badges**: acid lime with dark text for the one thing that is new or live.
- **Code blocks**: the panel style, mono at the label or body size, scrolling sideways in their own box.
- **Icons**: 1.5px stroke line icons. Never emoji.

## Do's and Don'ts

- Do set every command, path, flag and version in the mono font.
- Do keep lime to one mark per screen.
- Do left-align, and let lines be long before you center anything.
- Don't use violet as a fill for large areas, and never as a gradient.
- Don't use glows, neon outlines or scanline effects. This is a tool, not a poster of one.
- Don't introduce a color, size or radius that is not a token above.
