---
version: alpha
name: Primer
description: A bright, clear theme for courses, schools and learning tools. Cream paper, deep-teal ink, a blue action, and four chart colors.
colors:
  primary: "#095C78"
  on-primary: "#FFFFFF"
  secondary: "#FFD166"
  on-secondary: "#073B4C"
  tertiary: "#06D6A0"
  on-tertiary: "#073B4C"
  neutral: "#3E6270"
  background: "#FFFBF0"
  surface: "#FFFFFF"
  foreground: "#073B4C"
  border: "#E4DCC6"
  error: "#B3123F"
  azure: "#118AB2"
  sun: "#FFD166"
  berry: "#EF476F"
typography:
  display:
    fontFamily: Lexend
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.02em
  h1:
    fontFamily: Lexend
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.01em
  h2:
    fontFamily: Lexend
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Fira Code
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.02em
rounded:
  sm: 6px
  md: 10px
  lg: 16px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 20px
  xl: 32px
  2xl: 80px
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
    full: 56px
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
        primary: "#FFD166"
        on-primary: "#073B4C"
        secondary: "#0E7699"
        on-secondary: "#FFFFFF"
        neutral: "#9DC3CF"
        background: "#04222C"
        surface: "#073B4C"
        foreground: "#F3FAFB"
        border: "#0F5469"
        error: "#FF8FA8"
---

## Overview

Primer is for learning: an online course, a school, a coding class, a
language app's website, a workbook. It should feel like a good exercise
book: cream paper, deep-teal ink, one deep blue to press, and a small set of
bright colors that show progress and draw charts. The bright colors mark and
measure. They never carry text.

## Colors

- **Primary (`#095C78`)** is deep blue, with white text on it, for the one main action: "Start the course", "Check my answer". In dark mode the main action is yellow with ink text. Links in running text use the text color, underlined.
- **Secondary (`#FFD166`)** is yellow, with ink on it, for every other button. In dark mode the other buttons are a lighter blue.
- **Tertiary (`#06D6A0`)** is green, with ink on it, for one badge and for progress: "Completed", "New", the filled part of a progress bar.
- **Azure (`#118AB2`), sun (`#FFD166`) and berry (`#EF476F`)** are chart colors, the same in both modes: a bar, a line, a dot, a rule. With green they make a set of four, used in this order: azure, green, sun, berry. No text is ever set on azure, sun or berry, and no chart color is a text color.
- **Neutral (`#3E6270`)** sets durations, counts and captions.
- **Background (`#FFFBF0`)** is cream paper. **Surface (`#FFFFFF`)** is the white of a card.
- **Error (`#B3123F`)** is used only with a message. A wrong answer is told in words, with the right one beside it.

## Typography

Lexend sets headings at weight 700: a wide, even sans made to be easy to
read. Plus Jakarta Sans sets body text at 16px. Fira Code sets labels in
sentence case at weight 500: lengths of lessons, counts, scores, levels, and
any code. Figures in a table or a chart are tabular.

## Layout

A 12-column grid, 1200px at its widest, with 32px gutters. Spacing comes from
the scale (4, 8, 12, 20, 32, 80): 20px inside a card and between cards, 80px
between sections.
A lesson is read in one column of eight; a catalogue is a grid of three
cards; a progress page puts figures above charts above a list.

## Elevation & Depth

Flat. A card is white on cream with a 1px border and no shadow. Menus and
dialogs float on one short, neutral shadow.

## Shapes

Friendly: 6px for badges and checkboxes, 10px for buttons and inputs, 16px
for cards. Avatars, progress bars, the dots of a chart's legend and switches
are fully round.

## Components

- **Buttons**: deep blue for the one main action (yellow in dark mode), yellow for the rest (a lighter blue in dark mode). Sentence-case labels in the body font, weight 600.
- **Cards**: white, 16px corners, 20px padding, a 1px border.
- **Badges**: green with ink text, one or two words.
- **Progress bars**: 8px tall and fully round, green on a track of the border color, with the figure beside it in a label.
- **Charts**: flat bars or one line, drawn with plain elements, in the four chart colors, each with its figure written beside it in ink.
- **Lesson lists**: a number, a title, a length in a label, and a state: done, next or locked.
- **Icons**: 2px stroke line icons with round caps. Never emoji.

## Do's and Don'ts

- Do write the figure beside every bar and every progress bar: color alone says nothing.
- Do keep one main action in view: the next lesson, the next question.
- Do tell a learner where they are: lesson 4 of 12, 35 minutes left.
- Don't set text on azure, sun or berry, and don't use any chart color for text.
- Don't use more than the four chart colors, and don't use gradients or glows.
- Don't put a card inside a card.
- Don't introduce a color, size or radius that is not a token above.
