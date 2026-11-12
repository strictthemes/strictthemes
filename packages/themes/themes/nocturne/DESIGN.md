---
version: alpha
name: Nocturne
description: A dusky, cinematic theme for film, music and nightlife. Lilac-grey paper by day, aubergine and gold by night.
colors:
  primary: "#6B4A00"
  on-primary: "#FFF8E6"
  secondary: "#17131F"
  on-secondary: "#F2F0F5"
  tertiary: "#C9B6FF"
  on-tertiary: "#17131F"
  neutral: "#625B6E"
  background: "#F2F0F5"
  surface: "#FFFFFF"
  foreground: "#17131F"
  border: "#DAD5E2"
  error: "#B3261E"
typography:
  display:
    fontFamily: Syne
    fontSize: 64px
    fontWeight: 800
    lineHeight: 1.0
    letterSpacing: -0.02em
  h1:
    fontFamily: Syne
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.01em
  h2:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: Onest
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Azeret Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.06em
rounded:
  sm: 3px
  md: 8px
  lg: 16px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  2xl: 96px
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
        primary: "#F2C14E"
        on-primary: "#2A1E00"
        secondary: "#F0ECF7"
        on-secondary: "#17131F"
        neutral: "#A79FB5"
        background: "#100D16"
        surface: "#1A1622"
        foreground: "#F0ECF7"
        border: "#2F2A3A"
        error: "#FF8A80"
---

## Overview

Nocturne is for things people do after dark: a cinema programme, a record
label, a venue, a streaming library, a late-night radio show. It has the
manners of a film poster and an opening-night programme. Its dark mode is the
main one: aubergine black with a single warm gold. In light mode the same
gold deepens to bronze on lilac-grey paper.

## Colors

- **Primary (`#6B4A00`)** is bronze in light mode and gold in dark mode, for the one main action. Links are the text color, underlined, and turn gold under the pointer.
- **Secondary (`#17131F`)** is aubergine black for secondary buttons and headings.
- **Tertiary (`#C9B6FF`)** is pale lavender, with dark text on it, for one badge: "Premiere", "Tonight", "Late show".
- **Neutral (`#625B6E`)** sets credits, running times and captions.
- **Background (`#F2F0F5`)** is lilac-grey paper. **Surface (`#FFFFFF`)** is the white of a card; in dark mode both turn aubergine.
- **Error (`#B3261E`)** is used only with a message.

## Typography

Syne sets headings: wide, heavy and a little strange, which is the point. Set
titles large and let long ones wrap. Onest sets body text at 16px. Azeret
Mono sets labels, uppercase with wide tracking: dates, running times, ratings,
seat rows. Showtimes use tabular figures.

## Layout

A 12-column grid, 1280px at its widest, with 24px gutters. Posters and stills
run large, in the proportions they were made in, with a title and a line of
credits beneath. Spacing comes from the scale (4, 8, 16, 24, 48, 96): 24px
inside a card, 96px between sections. Give each title its own space, the way
a programme gives each film a page.

## Elevation & Depth

Flat and dark-minded. A card is told from the page by its lighter fill and a
1px border. Nothing glows. Menus and dialogs float on one short, neutral
shadow.

## Shapes

Softly cut: 3px for badges, 8px for buttons and inputs, 16px for cards and
posters. Avatars are circles.

## Components

- **Buttons**: gold (bronze in light mode) for the one main action, aubergine for the rest. Uppercase mono labels.
- **Cards**: 16px corners, 24px padding, a 1px border.
- **Badges**: lavender with dark text, uppercase, one or two words.
- **Listings**: a mono time on the left, the title in the heading font, credits in the neutral color beneath.
- **Icons**: 1.5px stroke line icons. Never emoji.

## Do's and Don'ts

- Do design the dark mode first: it is where this theme lives.
- Do keep gold to one action or one title per screen.
- Do let images be large and uncropped.
- Don't add glows, neon or blurred glass, however much the subject invites it.
- Don't mix gold with other warm accents: lavender is the only second color.
- Don't introduce a color, size or radius that is not a token above.
