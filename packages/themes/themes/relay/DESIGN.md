---
version: alpha
name: Relay
description: A fast, loud theme for sports clubs, leagues and race days. White kit, navy bands, an amber main action, and scores set large.
colors:
  primary: "#FFB703"
  on-primary: "#023047"
  secondary: "#023047"
  on-secondary: "#FFFFFF"
  tertiary: "#FB8500"
  on-tertiary: "#023047"
  neutral: "#3F6377"
  background: "#F5FAFC"
  surface: "#FFFFFF"
  foreground: "#023047"
  border: "#C5E1EE"
  error: "#B3261E"
  ring: "#023047"
  navy: "#023047"
  on-navy: "#FFFFFF"
  ice: "#8ECAE6"
  on-ice: "#023047"
typography:
  display:
    fontFamily: Saira
    fontSize: 64px
    fontWeight: 800
    lineHeight: 1.0
    letterSpacing: -0.01em
  h1:
    fontFamily: Saira
    fontSize: 40px
    fontWeight: 800
    lineHeight: 1.1
  h2:
    fontFamily: Saira
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: Rubik
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: Kode Mono
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.04em
rounded:
  sm: 3px
  md: 6px
  lg: 10px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 20px
  xl: 32px
  2xl: 72px
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
    full: 48px
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
        secondary: "#8ECAE6"
        on-secondary: "#023047"
        neutral: "#9CC7DB"
        background: "#011C2A"
        surface: "#023047"
        foreground: "#EAF6FB"
        border: "#0E4A66"
        error: "#FF9B8A"
        ring: "#FFB703"
---

## Overview

Relay is for clubs and competitions: a football club, a running club, a
league, a race day, a gym's timetable. It borrows from scoreboards and team
kit: white, navy bands, and amber for the one thing to press. Scores and
times are the largest things on a page.

## Colors

- **Primary (`#FFB703`)** is amber, with navy text on it, for the one main action: "Join the club", "Enter the race". It is the same in both modes. Amber is a fill: it is never a text or link color on a light page.
- **Secondary (`#023047`)** is navy, with white text on it, for every other button. In dark mode the other buttons are ice blue with navy text.
- **Navy (`#023047`)** fills bands: the header, a scoreboard, a table's head. A band is navy in both modes, its text is white, and a label on it is ice blue.
- **Tertiary (`#FB8500`)** is orange, with navy text on it, for one badge: "Live", "Final", "Sold out".
- **Ice (`#8ECAE6`)** fills quiet panels: the row of the club in a table, a marked fixture. Text on it is always navy (`#023047`), in dark mode too. On a navy band it is the color of labels.
- **Ring (`#023047`)** is the focus outline: navy on a light page, amber in dark mode.
- **Neutral (`#3F6377`)** sets dates, venues and captions.
- **Background (`#F5FAFC`)** is kit white. **Surface (`#FFFFFF`)** is the white of a card.
- **Error (`#B3261E`)** is used only with a message.

## Typography

Saira sets headings in uppercase at weight 800: a squared sans from the side
of a racing car. Scores and times are set in it too, large. Rubik sets body
text at 16px. Kode Mono sets labels in uppercase: dates, kick-off times,
venues, the heads of a table's columns. Figures in a table are tabular.

## Layout

A 12-column grid, 1240px at its widest, with 20px gutters. Spacing comes from
the scale (4, 8, 12, 20, 32, 72): 20px inside a card, 72px between sections.
Pages are dense and squared up: rows of fixtures, a table, a scoreboard. The
header is a navy band; one more navy band on a page holds the score or the
next match.

## Elevation & Depth

Flat. A card is white with a 1px border and no shadow. A scoreboard has the
same 1px border, which is what sets it off in dark mode. Menus and dialogs
float on one short, neutral shadow.

## Shapes

Tight: 3px for badges and checkboxes, 6px for buttons and inputs, 10px for
cards and bands. Club crests, avatars, status dots and switches are fully
round.

## Components

- **Buttons**: amber with navy text for the one main action, navy for the rest (ice blue in dark mode). Uppercase mono labels.
- **Cards**: white, 10px corners, 20px padding, a 1px border.
- **Badges**: orange with navy text, one or two words, uppercase.
- **Scoreboard**: a navy band with two names and two large figures; text on it is white, and a label on it is ice blue. It has a 1px border.
- **Tables**: a navy head, hairlines between rows, figures right-aligned, the club's own row filled with ice blue.
- **Icons**: 2px stroke line icons with square caps. Never emoji.

## Do's and Don'ts

- Do use amber once in view, on the main action. The focus outline in dark mode does not count.
- Do set scores, times and positions large, in the heading font.
- Do keep text on a navy band white and labels on it ice blue, in both modes.
- Don't write in amber or orange on a light page, and don't use amber for a link.
- Don't slant, outline or stretch the heading font, and don't use gradients or glows.
- Don't put a card inside a card or a band inside a card.
- Don't introduce a color, size or radius that is not a token above.
