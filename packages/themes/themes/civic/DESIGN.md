---
version: alpha
name: Civic
description: A plain, trustworthy theme for public services and health. WCAG AAA contrast, large type, and nothing left to guess.
colors:
  primary: "#0B3D91"
  on-primary: "#FFFFFF"
  secondary: "#0B1320"
  on-secondary: "#FFFFFF"
  tertiary: "#FFD400"
  on-tertiary: "#0B1320"
  neutral: "#414B5A"
  background: "#FFFFFF"
  surface: "#F2F5F9"
  foreground: "#0B1320"
  border: "#7B8696"
  error: "#A30F0F"
  success: "#0B5F33"
typography:
  display:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -0.02em
  h1:
    fontFamily: Public Sans
    fontSize: 34px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  h2:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Atkinson Hyperlegible Mono
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.02em
rounded:
  sm: 3px
  md: 5px
  lg: 8px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
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
  contrast: AAA
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
        primary: "#9CC2FF"
        on-primary: "#061A3D"
        secondary: "#F4F7FB"
        on-secondary: "#0B1320"
        neutral: "#B6C0CE"
        background: "#0A0F18"
        surface: "#131B28"
        foreground: "#F4F7FB"
        border: "#66738A"
        error: "#FF9B91"
        success: "#7BE0A6"
---

## Overview

Civic is for services everyone has to be able to use: a council form, a clinic
booking, a benefits application, a school portal. It is built for the person
who is tired, on an old phone, in bad light, or using a screen reader. Every
text color meets WCAG AAA, borders are dark enough to see, and the design
never asks the reader to guess what something is.

## Colors

- **Primary (`#0B3D91`)** is a deep civic blue, for the main action and links.
- **Secondary (`#0B1320`)** is blue-black ink for secondary buttons and headings.
- **Tertiary (`#FFD400`)** is signal yellow, with dark text on it. Use it for one notice that must not be missed, and for nothing else.
- **Neutral (`#414B5A`)** sets hints and secondary text. It is still 7:1 on the page.
- **Background (`#FFFFFF`)** is white. **Surface (`#F2F5F9`)** is a pale blue-grey for a summary box or a section of a form.
- **Border (`#7B8696`)** is dark enough (over 3:1) that the edge of a field can be seen.
- **Success (`#0B5F33`) and Error (`#A30F0F`)** report state. Each comes with a word and an icon, and an error says how to fix it.

## Typography

Public Sans sets headings, plain and sturdy. Atkinson Hyperlegible Next sets
body text at 18px: it was drawn so that similar letters cannot be confused.
Atkinson Hyperlegible Mono sets labels, reference numbers, dates and button
text at 16px, larger than a label in other themes. Labels are sentence case.
The label of a form field, and the legend of a group of fields, is not a mono
label: it is body text in bold, so the question is the largest thing by its
field. Write in plain
language, one idea to a sentence.

## Layout

One column, 720px at its widest, for anything a person fills in or reads; a
12-column grid, 1120px at its widest, only for overviews. One question per
screen where you can. Spacing comes from the scale (4, 8, 16, 24, 40, 64):
24px between fields, 40px between groups. Touch targets are at least 44px
tall, with 8px between them.

## Elevation & Depth

Flat. A summary box is the pale surface with a 1px border. Nothing depends on
a shadow to be seen. Dialogs float on one short, neutral shadow and also have
a border.

## Shapes

Lightly rounded and consistent: 3px for badges and checkboxes, 5px for buttons
and inputs, 8px for boxes. No pills, and no shape that carries meaning by
itself.

## Components

- **Buttons**: civic blue for the one main action on a screen, blue-black for the rest. Sentence-case labels that say what happens: "Save and continue".
- **Cards (boxes)**: the pale surface, 8px corners, 24px padding, a 1px border.
- **Badges**: signal yellow with dark text, for a notice. State badges use the success and error colors with a word.
- **Inputs**: a visible label above, a hint under the label, and the error message next to the field it is about.
- **Icons**: 1.5px or 2px stroke line icons, always with a word beside them. Never emoji.

## Do's and Don'ts

- Do keep every text pair at 7:1 or better, in both modes.
- Do put a visible label on every field and a word beside every icon.
- Do say what went wrong and what to do next, in the error itself.
- Don't rely on color, position or shape alone to say something.
- Don't use placeholder text as a label, or light grey text for anything.
- Don't introduce a color, size or radius that is not a token above.
