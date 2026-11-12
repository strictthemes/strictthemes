---
version: alpha
name: Veranda
description: A warm, unhurried theme for guesthouses, small hotels and places to stay. Cream paper, slate ink, and clay, sage and sand used sparingly.
colors:
  primary: "#3D405B"
  on-primary: "#F4F1DE"
  secondary: "#F2CC8F"
  on-secondary: "#2A2C40"
  tertiary: "#81B29A"
  on-tertiary: "#2A2C40"
  neutral: "#5C5F78"
  background: "#F4F1DE"
  surface: "#FBFAF1"
  foreground: "#2A2C40"
  border: "#DDD8BD"
  error: "#A63A24"
  clay: "#E07A5F"
  on-clay: "#2A2C40"
typography:
  display:
    fontFamily: Cormorant
    fontSize: 68px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: -0.01em
  h1:
    fontFamily: Cormorant
    fontSize: 44px
    fontWeight: 500
    lineHeight: 1.1
  h2:
    fontFamily: Cormorant
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: Cutive Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.06em
rounded:
  sm: 2px
  md: 4px
  lg: 12px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  2xl: 104px
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
        primary: "#F2CC8F"
        on-primary: "#22243A"
        secondary: "#4A4D6B"
        on-secondary: "#F4F1DE"
        neutral: "#B9BBD0"
        background: "#22243A"
        surface: "#2E3049"
        foreground: "#F4F1DE"
        border: "#45486A"
        error: "#F2A08C"
---

## Overview

Veranda is for places people stay: a guesthouse, a small hotel, a farm stay,
a house to rent by the week. It should read like the card left on the bed:
cream paper, slate ink, a tall quiet serif, and a little clay, sage and sand.
Nothing hurries the guest.

## Colors

- **Primary (`#3D405B`)** is slate, for the one main action: "Check dates", "Request this room". In dark mode the main action is sand with slate text. Links are the text color, underlined.
- **Secondary (`#F2CC8F`)** is sand, with ink on it, for every other button.
- **Tertiary (`#81B29A`)** is sage, with ink on it, for one badge: "Sea view", "Breakfast included", "Two nights or more".
- **Clay (`#E07A5F`)** fills one block on a page: an opening panel or the call to book. It is the same in both modes, and text on it is always ink (`#2A2C40`), in dark mode too.
- **Neutral (`#5C5F78`)** sets dates, prices per night and captions.
- **Background (`#F4F1DE`)** is cream. **Surface (`#FBFAF1`)** is a lighter cream for cards.
- **Error (`#A63A24`)** is used only with a message.

## Typography

Cormorant sets headings: a tall, fine serif at weight 500, set large with
room around it. One phrase in a heading, or a guest's words, may be set in
its italic. Never set it bold. Outfit sets body text at 16px, plain and
round. Cutive Mono sets labels in uppercase with wide tracking, like the tag
on a room key: dates, room names, prices, times of breakfast.

## Layout

A 12-column grid, 1160px at its widest, with 24px gutters. Spacing comes from
the scale (4, 8, 16, 24, 48, 104): 24px inside a card, 104px between sections.
Pages are uneven on purpose: a picture of seven columns beside text of four,
then the other way round. Sections are divided by space and one hairline.

## Elevation & Depth

Flat. A card is a lighter cream with a 1px border and no shadow. Hairlines
divide a list. Menus and dialogs float on one soft, warm shadow.

## Shapes

Quiet: 2px for badges and checkboxes, 4px for buttons and inputs, 12px for
cards, pictures and the clay block. Nothing is a pill or a circle.

## Components

- **Buttons**: slate for the one main action (sand in dark mode), sand for the rest (a lighter slate in dark mode). Uppercase typewriter labels.
- **Cards**: lighter cream, 12px corners, 24px padding, a 1px border.
- **Badges**: sage with ink text, one to three words, uppercase.
- **Room rows**: a picture, the room's name in the heading font, three facts in labels, a price per night, one link.
- **Lists of times and prices**: a name on the left, a dotted or plain hairline, the figure on the right in a label.
- **Icons**: 1.5px stroke line icons, used sparingly. Never emoji.

## Do's and Don'ts

- Do use clay once on a page, for one block.
- Do say prices per night, what is included and when to arrive plainly.
- Do leave room: a heading has an empty column beside it.
- Don't set Cormorant in bold, and don't set body text in it.
- Don't count down, flash "only 1 left" or press the guest in any other way.
- Don't use gradients, glows or a card inside a card.
- Don't introduce a color, size or radius that is not a token above.
