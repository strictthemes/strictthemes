---
page: recipe page
title: Recipe
description: one recipe from a tea room's journal, with its title, a standfirst, the time and servings, ingredients that scale with a servings control, numbered steps and a note from the kitchen.
order: 4
checks:
  - The time and the servings under the title are mono labels in sentence case, and the publication date is a `<time>` with a `dateTime`.
  - Changing the servings with the minus and plus buttons rescales every amount in the ingredients list, and the new count is announced.
  - Amounts are rounded the way the brief says, so no amount shows more than one decimal place and counts show halves as "½".
  - The method is an ordered list of numbered steps, and the note from the kitchen is a card beside or after the steps, not inside another card.
---

Sample content, if the user gave none: a recipe from the journal of "The Linden Room", a tea room and shop at 14 Mill Lane, Ashby Wold. The recipe is "Pear, ginger and lemon verbena tisane", the pot served in the room each autumn, written up by the person who runs the kitchen, Mara Hollis, on 6 November 2026. It serves four cups. Prep 10 minutes, simmer 15 minutes, steep 5 minutes.

Ingredients for four cups:

- Ripe pears, 2
- Fresh ginger, 30 g
- Dried lemon verbena, 6 g
- Water, 1 l (1000 ml in the code, so the millilitre rule below applies)
- Honey, 2 tbsp (or maple syrup, to keep it vegan)
- Cinnamon stick, 1
- Lemon, ½

Write the method yourself in five steps, one to three sentences each. The steps do not repeat the amounts, so they need no scaling.

Build these parts in order. An `<article>` wraps the opening, the ingredients, the method and the note.

### 1. Header

The header from the layout notes. This page is one entry of the journal, not the journal itself, so here, in place of the notes' `aria-current="page"`, the "Journal" link gets `aria-current="true"` and `underline`, and keeps `/journal`.

### 2. Opening

The first section, with `pt-10`, as a grid (`grid gap-6 md:grid-cols-12 md:items-end`; here `md:items-end` takes the place of `md:items-start`, so the foot of the figure, which is its caption, lines up with the label line at the foot of the text):

- In columns 1–7: a label in `text-muted-foreground`, `From the journal · Mara Hollis · 6 November 2026`, with the date in a `<time>`. With `mt-2` the `<h1>` in `text-h1 md:text-display`. With `mt-4` a standfirst: one or two sentences in a `<p>` with `font-heading text-h2`, upright and in its one weight. With `mt-6`, a label line in `text-foreground`: `Prep 10 min · Simmer 15 min · Steep 5 min · Serves 4`. It gives the recipe as written and does not change with the servings control.
- In columns 8–12: a picture, `aspect-square`, with the `aria-label` "A clay teapot and two cups on a linen cloth, pear slices beside them" and a caption such as `The autumn pot, served from October`.

On a phone the picture comes under the label line.

### 3. Ingredients and method

A section with `mt-18`, as a grid (`grid gap-6 md:grid-cols-12 md:items-start`):

- Columns 1–5 hold the ingredients.
- Columns 7–12 hold the method and, after it, the note.

On a phone the ingredients come first, then the method, then the note.

**Ingredients.** An `<h2>` "Ingredients". Then the servings stepper as the layout notes describe, with no wrapper: with `mt-4` on it, a label `<p>` with an `id`, "Cups", in `font-mono text-label text-foreground`, then with `mt-2` on it the stepper's `role="group"` `<div>`, from one to twelve, starting at four. The value reads `1 cup`, `4 cups`. The buttons' `aria-label`s are "Fewer cups" and "More cups". With `mt-6`, the list of ingredients as rows from the layout notes, with `py-2` on each row: the ingredient's name on the left in `text-body`, with any aside after it, a space and then a `<span>` in `text-muted-foreground` holding the aside in brackets: `Honey (or maple syrup, to keep it vegan)`; the amount on the right as a label in `text-foreground` with `tabular-nums`, for example `30 g`, `2 tbsp`, `½`.

The stepper's value already announces the new count. Do not add a second live region for the list.

**Method.** An `<h2>` "Method", then with `mt-6` an ordered list in running text: `list-decimal pl-6`, `mt-4` between its items (more than the `mt-2` of the layout notes, because each step is a few sentences long). Each step is `text-body`. Where a step names a length of time or a temperature, write it plainly in the sentence ("simmer for 15 minutes", "let it cool to about 85°C"): it is neither a label nor a `<time>`, which the notes keep for dates and clock times.

**Note.** After the method, with `mt-6`: a card as an `<aside>` with the `aria-label` "A note from the kitchen". Inside it the label `A note from the kitchen` in `text-muted-foreground`, then with `mt-2` two or three sentences: lemon verbena turns bitter if the water is still boiling, so take the pan off the heat first, and the pears can go on to a crumble. Then with `mt-4` a label in `text-muted-foreground` with the cook's name, `Mara Hollis`.

### 4. More from the journal

A section with `mt-18`, outside the `<article>`, in columns 1–8 of a grid: an `<h2>` "More from the journal", then with `mt-6` a list of three entries as rows from the layout notes, with `py-4`: the title as a link in `text-foreground` with `decoration-1 underline-offset-4 hover:underline` and `transition-colors duration-150` on the left, and its date as a label in `text-muted-foreground` with a `<time>` on the right. Each title links to `#`. Below `md` the date goes under the title with `mt-2`: here, in place of the Rows note's row classes, each `<li>` is `flex flex-col items-start gap-0 py-4 md:flex-row md:items-baseline md:justify-between md:gap-4`, and the date has `mt-2 md:mt-0`. Sample titles: "Drying lemon verbena at home" (24 October 2026), "A week of soup" (9 October 2026), "Why we stopped using tea bags" (18 September 2026).

### 5. Footer

The footer from the layout notes.

### Behavior

- Keep the number of cups in component state, starting at four. Each amount is the amount for four, divided by four and multiplied by the number of cups.
- Round as you show it. A tie always rounds up.
  - Grams: to the nearest whole gram, never below 1 g: ginger for one cup is 7.5 g, shown `8 g`.
  - Millilitres: first round to the nearest 10 ml. Under 1000 ml, show that (`750 ml`). From 1000 ml up, divide it by 1000 and round to one decimal place, dropping a `.0`: 1000 ml is `1 l`, 1250 ml `1.3 l`, 1500 ml `1.5 l`, 3000 ml `3 l`.
  - Counts (pears, cinnamon sticks, lemons) and spoons: to the nearest half, never below ½, written as `½`, `1`, `1½`, `2`: a cinnamon stick for three cups is 0.75, shown `1`. A spoon amount keeps its unit: `1½ tbsp`.
- Only the amounts change. The names, the asides and the label line under the title stay as they are.
- At one cup the minus button is disabled, and at twelve the plus button, each with `focusableWhenDisabled` as the layout notes say, so this page makes the `data-disabled:` edit in `button.tsx`.
- The other links need no behavior.
