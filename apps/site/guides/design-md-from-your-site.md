---
title: Make a DESIGN.md from a site you already have
description: Measure the colors, type, spacing and corners your site uses, write them into a DESIGN.md with rules, and give a coding agent a skill that holds it to them.
kind: How to
date: 2026-11-13
checked: 2026-11-13
tool: "@strictthemes/check 0.7.1"
---

A coding agent that has never seen your site will build its next page in its own taste: a grey it likes, a 14px it likes, corners a little rounder than yours. Telling it "match the site" does not help much, because it cannot see what the site is made of.

A `DESIGN.md` fixes that. It is one file in the project's root that lists your colors, text sizes, spacing steps and corners, and says which values are allowed. This guide makes one from a site that is already live, in about a minute, and then puts it to work.

![A diagram in three steps. Measure: your live site. Write: a DESIGN.md with tokens, notes and rules, and a SKILL.md. Hold to it: Strict Check measures pages against the spec, and your coding agent builds from the same values and checks its work.](/guides/design-md-from-your-site/flow.svg "What this guide sets up")

You need Node 20 or later and Google Chrome (or Edge, or Chromium) on your machine. Nothing is sent anywhere: the pages are opened by the browser you already have.

## 1. Measure the site

Run this in your project's folder. Name two or three pages that differ from each other, such as the home page and a pricing or product page:

```bash
npx @strictthemes/check generate https://your-site.example --path / --path /pricing --skill
```

We ran it on this site's home page and its kit page. This is what it printed:

```
Measuring https://strictthemes.com/, https://strictthemes.com/kit/
Wrote DESIGN.md
Wrote .claude/skills/strict-design/SKILL.md

  colors      8
  typography  5 sizes
  spacing     5 steps
  corners     2

Checked against the pages it was measured from: 100% of 2885 measured values follow it.
```

The last line matters most. After writing the spec, the command checks the same pages against it and says how much of them it covers.

- **Near 100%:** your site is consistent, and the spec describes it.
- **Around 90%:** the site has one-off values. The command lists them under "To settle by hand": colors used once or twice, text sizes outside the main five, odd paddings. That list is a to-do list for the site as much as for the spec.

## 2. Read what it wrote

Open `DESIGN.md`. The top half is the tokens:

```yaml
colors:
  background: "#FFFFFF"
  primary: "#1F3BFF"
  on-primary: "#FFFFFF"
  secondary: "#F5F5F3"
  on-secondary: "#111111"
  neutral: "#6B6B6B"
  foreground: "#111111"
  border: "#E2E2E0"
```

Each color got the role the pages give it most often, and the file says why:

| Token | How it was chosen |
|---|---|
| `background` | The color of the page itself. |
| `foreground` | The text color that is used a lot and stands out most from the page. |
| `primary` | The colored fill on the most links and buttons. `on-primary` is the text on it. |
| `neutral` | The quieter text color: captions, hints. |
| `surface` | A fill one step away from the page, such as a card. |
| `border` | The commonest border color. |
| `blue`, `grey-2`, … | Whatever is left, named by its hue. |

Here is what that came to for this site, with the reason the file gives for each role:

![A table of the eight colors measured on strictthemes.com with a swatch of each: background white, primary blue as the fill of 1 link or button, secondary light grey as the fill of 23 other links and buttons, neutral grey for quieter text, foreground near-black, and the border grey.](/guides/design-md-from-your-site/roles.svg "The roles measured on this site, and why each color got its role")

Look at `primary` and `secondary`. The blue fills one button on those two pages and the light grey fills 23, yet blue is `primary`. That is deliberate: a color wins over a grey for the main action, because most sites have one colored button and many quiet ones. It is also the rule most likely to be wrong for your site, which is why the reasons are written down.

Check the roles before you trust them. The command counts; it does not know what you meant. Two things to look for:

- **Is `primary` your brand color?** On a page with one main button and twenty grey ones, counting can pick the wrong one. Swap the names if it did.
- **Do the leftover colors belong?** A `teal` that appears on one badge is either a real status color, which deserves a real name such as `success`, or a stray to remove from the site.

Type, spacing and corners follow the same idea: the body size, one smaller size for labels and up to three larger ones; the paddings and gaps used most, up to eight steps; up to three corner sizes.

## 3. Rewrite the notes

Below the tokens the file has eight sections of prose: Overview, Colors, Typography, Layout and so on. The command fills them with what it measured and with a request for your words, such as:

> Replace this paragraph with two or three sentences on who the product is for and how it should feel: an agent reads them before it builds.

Do that. The numbers tell an agent what it may use. The prose tells it when: that the primary color is for one action a view, that cards never sit inside cards, how wide the content column is. Ten minutes here is worth more than any other step in this guide.

## 4. Look at the rules

The file ends its front matter with a `strict` block:

```yaml
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
```

This is what turns a description into something that can be checked. It says: only the listed colors, only the listed spacing steps, only the listed sizes and fonts, and text at 4.5:1 against what is behind it. The [spec page](/spec/) explains each line.

## 5. Check the site against it

Now run the check on the live site:

```bash
npx @strictthemes/check --spec DESIGN.md --url https://your-site.example --no-source
```

It opens the page in every color mode the spec has, at 1280px and 375px, and also on hover and on focus, which the first measurement did not cover. For this site it reported 100% of 6,513 values. Expect it to find a few things the generator could not see: a hover color that is used nowhere else, a size that only appears on a phone. For each one, decide: add it to the spec, or fix it on the site.

## 6. Hand it to your agent

The `--skill` option wrote a second file, `.claude/skills/<name>-design/SKILL.md`. A skill is a short instruction file that coding agents load when a task matches it. This one tells the agent to:

1. read `DESIGN.md` before it writes any UI;
2. put the tokens into the code if they are not there yet, and how;
3. use only the listed values, in light and dark mode, on hover and focus;
4. build, run the check, fix what it reports, and say what it could not verify.

An agent that does not read `.claude/skills/` can be given the same file by another route: paste it into the project's instruction file, or pass `--skill-out` to write it where your tool looks.

If your project uses Tailwind 4 and the tokens are not in its CSS yet, this prints them as a `@theme` block, with the dark mode:

```bash
npx @strictthemes/spec export DESIGN.md --format tailwind
```

## What it cannot do

- **It measures one width.** What changes on a phone is not in the first draft. The check in step 5 will show you.
- **It finds a dark mode two ways:** the browser's own dark setting, and the class `dark` on the page. A site that switches another way gets a light spec.
- **It cannot open pages behind a login.**
- **It does not know intent.** A color used once on purpose and a color used once by accident look the same to it.

Measure your own site, or one whose design you may take.

## Next

- [The spec format](/spec/): every field of a `DESIGN.md` and of the `strict` block.
- [Strict Check](https://github.com/strictthemes/strictthemes/tree/master/packages/check#readme): every rule and option, and how to run it in CI.
- No site yet? Start from one of the [themes](/themes/) instead.
