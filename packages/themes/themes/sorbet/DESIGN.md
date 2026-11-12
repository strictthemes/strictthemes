---
version: alpha
name: Sorbet
description: A friendly, rounded theme for consumer apps. Peach cream, raspberry, butter yellow and soft, generous shapes.
colors:
  primary: "#AD1457"
  on-primary: "#FFFFFF"
  secondary: "#2B1721"
  on-secondary: "#FFF6F1"
  tertiary: "#FFD23F"
  on-tertiary: "#2B1721"
  neutral: "#735E68"
  background: "#FFF6F1"
  surface: "#FFFFFF"
  foreground: "#2B1721"
  border: "#F0D9D2"
  error: "#B42318"
  success: "#1C7C54"
typography:
  display:
    fontFamily: Gabarito
    fontSize: 56px
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: -0.02em
  h1:
    fontFamily: Gabarito
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.01em
  h2:
    fontFamily: Gabarito
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: Figtree
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Sometype Mono
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0.02em
rounded:
  sm: 10px
  md: 20px
  lg: 28px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 40px
  3xl: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.xl}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.xl}"
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
        primary: "#FF85B4"
        on-primary: "#3A0A1E"
        secondary: "#FBEAF0"
        on-secondary: "#2B1721"
        neutral: "#BFA6B0"
        background: "#1D1118"
        surface: "#291922"
        foreground: "#FBEAF0"
        border: "#402A35"
        error: "#FF8A80"
        success: "#5BD6A0"
---

## Overview

Sorbet is for apps people use for themselves: habits, recipes, budgets,
learning, a first-run flow. It should feel like a kind person explaining
something. Shapes are round and large, the page is the color of peach cream,
and the type is big enough to read on a phone held in one hand.

## Colors

- **Primary (`#AD1457`)** is raspberry, for the main action and links.
- **Secondary (`#2B1721`)** is a plum-black for secondary buttons and headings.
- **Tertiary (`#FFD23F`)** is butter yellow, for a badge, a streak or a small celebration. Dark text on it, always.
- **Neutral (`#735E68`)** sets helper text and labels.
- **Background (`#FFF6F1`)** is peach cream. **Surface (`#FFFFFF`)** is the white card that sits on it.
- **Success (`#1C7C54`) and Error (`#B42318`)** report state, each with a word and an icon.

## Typography

Gabarito sets headings: round, heavy and friendly. Figtree sets body text at
17px, a size larger than most themes, because these screens are read on
phones. Sometype Mono sets labels, counts and times. Labels are sentence case.
Write short sentences and address the reader as "you".

## Layout

A single column on phones and a 12-column grid, 1120px at its widest, from
tablets up, with 24px gutters. One idea per screen and one main button per
view. Spacing comes from the scale (4, 8, 12, 16, 24, 40, 64): 24px inside a
card, 40px between groups, 64px between sections. Touch targets are at least
44px tall.

## Elevation & Depth

Flat and soft. A card is white on peach with a 1px border. No drop shadows on
cards; sheets and menus that float get one short, soft shadow.

## Shapes

Round everywhere: 10px for badges and small tiles, 20px for buttons and inputs,
which makes a button a pill, and 28px for cards. Avatars are circles.

## Components

- **Buttons**: raspberry for the one main action, plum-black for the rest. A quiet choice beside them (cancel, back, skip) is an outline button: the card's white with a 1px border. Pill-shaped, with wide side padding.
- **Cards**: white, 28px corners, 24px padding, a 1px border.
- **Badges**: butter yellow with dark text, for progress and small wins.
- **Inputs**: pill-shaped, with a visible label above. Never a placeholder as the only label.
- **Icons**: 1.5px stroke line icons with round caps. Never emoji.

## Do's and Don'ts

- Do keep one main action per view, in raspberry.
- Do use yellow for good news and nothing else.
- Do write the way you would say it out loud.
- Don't use gradients or glows to look playful: the shapes and the color do that.
- Don't put a card inside a card.
- Don't introduce a color, size or radius that is not a token above.
