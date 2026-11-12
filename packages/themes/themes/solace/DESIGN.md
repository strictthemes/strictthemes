---
version: alpha
name: Solace
description: A soft, steady theme for therapists, coaches and private practices. Blush paper, indigo ink, and mauve greys with no signal color.
colors:
  primary: "#22223B"
  on-primary: "#F2E9E4"
  secondary: "#C9ADA7"
  on-secondary: "#22223B"
  tertiary: "#9A8C98"
  on-tertiary: "#22223B"
  neutral: "#4A4E69"
  background: "#F2E9E4"
  surface: "#FAF5F2"
  foreground: "#22223B"
  border: "#DFD0C9"
  error: "#9B2C2C"
typography:
  display:
    fontFamily: Literata
    fontSize: 56px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: -0.01em
  h1:
    fontFamily: Literata
    fontSize: 38px
    fontWeight: 400
    lineHeight: 1.2
  h2:
    fontFamily: Literata
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: Mulish
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: Xanh Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.02em
rounded:
  sm: 6px
  md: 12px
  lg: 20px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 28px
  xl: 48px
  2xl: 112px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.lg}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.body}"
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
    full: 72px
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
        primary: "#C9ADA7"
        on-primary: "#22223B"
        secondary: "#4A4E69"
        on-secondary: "#F2E9E4"
        neutral: "#B8ADB6"
        background: "#191929"
        surface: "#22223B"
        foreground: "#F2E9E4"
        border: "#3A3B57"
        error: "#F0A3A3"
---

## Overview

Solace is for people whose work is listening: a therapist, a counsellor, a
coach, a small group practice. A visitor may arrive anxious, so the page is
calm before it is anything else: blush paper, indigo ink, greys with mauve in
them, and no color that shouts. There is one thing to do on a page, and it
is never urgent.

## Colors

- **Primary (`#22223B`)** is indigo ink, for the one main action: "Request a first session". In dark mode the main action is rose taupe with ink text. Links are the text color, underlined.
- **Secondary (`#C9ADA7`)** is rose taupe, with ink on it, for every other button.
- **Tertiary (`#9A8C98`)** is mauve grey, with ink on it, for one badge: "Online", "In person", "Evenings".
- **Neutral (`#4A4E69`)** sets durations, fees and captions.
- **Background (`#F2E9E4`)** is blush paper. **Surface (`#FAF5F2`)** is a paler blush for cards.
- **Error (`#9B2C2C`)** is used only with a message, and the message says how to put it right.

There is no accent color. Emphasis comes from size, from space and from the
italic.

## Typography

Literata sets headings at weight 400: a book serif with a warm italic. A
phrase in a heading, and anything a client said, may be set in the italic.
Never set a heading bold. Mulish sets body text at 17px with open leading,
in short paragraphs. Xanh Mono sets labels in sentence case: times, lengths
of sessions, fees, days of the week.

## Layout

A 12-column grid, 1080px at its widest, with 28px gutters. Most pages are one
column of seven or eight, with the other columns empty or holding one short
note. Spacing comes from the scale (4, 8, 16, 28, 48, 112): 28px inside a
card, 112px between sections. Sections are divided by space alone.

## Elevation & Depth

Flat and soft. A card is a paler blush with a 1px border and no shadow.
Menus and dialogs float on one soft, mauve-tinted shadow.

## Shapes

Soft: 6px for badges and checkboxes, 12px for buttons and inputs, 20px for
cards. A portrait, a switch and a radio button are fully round.

## Components

- **Buttons**: indigo for the one main action (rose taupe in dark mode), rose taupe for the rest (slate in dark mode). Sentence-case labels in the body font, weight 500.
- **Cards**: paler blush, 20px corners, 28px padding, a 1px border.
- **Badges**: mauve grey with ink text, one or two words, sentence case.
- **Questions and answers**: a question in the heading font, an answer in body text, a hairline between pairs.
- **Portraits**: round, drawn large beside a name and a line of training.
- **Icons**: 1.5px stroke line icons with round caps, few. Never emoji.

## Do's and Don'ts

- Do write as one person speaks to another: short sentences, plain words, "you" and "I".
- Do give one action on a page and say what happens after it.
- Do say fees, lengths and how to cancel plainly.
- Don't use urgency: no countdowns, no "limited places", no pop-ups.
- Don't promise results, and don't decorate with leaves, waves or sunrises drawn in code.
- Don't use gradients, glows or a card inside a card.
- Don't introduce a color, size or radius that is not a token above.
