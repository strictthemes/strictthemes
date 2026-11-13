---
page: course catalogue
title: Catalogue
description: the course catalogue of an online school, with a search field and a level filter that together change a grid of nine course cards, a count of results given in words, and an empty state.
order: 1
checks:
  - "The search field and the level filter work together on the nine cards, and the level filter is a button group with `aria-pressed`, not tabs."
  - "The search field looks like any field of the theme, with text in it too: the browser's own clear button does not show."
  - "The count of results is a sentence in words in a `role=status` element that is on the page from the start, and it follows every keystroke and every press."
  - "Every card gives its topic in words beside the dot, its level in a green badge, its number of lessons and its length, and no text is set on azure, sun or berry."
  - "A search with no result shows a sentence and a Clear search and level button, and pressing it brings back all nine cards and moves focus to the search field."
  - "The grid is three cards wide from `lg` up, two from `md` and one below, and the page does not scroll sideways at 375px."
---

Sample content, if the user gave none: "Rowlark", an online school for practical data skills. Its nine courses, in this order (title, topic, level, lessons, length, teacher, one sentence):

1. "Spreadsheets from scratch", Spreadsheets, Beginner, 10 lessons, 2 h 30 min, Samir Okonjo. "Cells, formulas and tidy tables, for people who have never opened a spreadsheet."
2. "SQL from zero", SQL, Beginner, 12 lessons, 3 h 10 min, Odile Brandt. "Ask a database your first questions with SELECT, WHERE and ORDER BY."
3. "Your first charts", Charts, Beginner, 8 lessons, 1 h 50 min, Lena Farrow. "Turn a small table into a bar chart and a line chart that people can read."
4. "Cleaning messy data", Spreadsheets, Beginner, 9 lessons, 2 h 15 min, Samir Okonjo. "Fix dates, doubles and stray spaces before they spoil your sums."
5. "Pivot tables in practice", Spreadsheets, Intermediate, 11 lessons, 3 h 5 min, Samir Okonjo. "Sum up ten thousand rows in a minute, and know what the summary hides."
6. "Joins and grouping in SQL", SQL, Intermediate, 14 lessons, 4 h 5 min, Odile Brandt. "Bring two tables together, then count, sum and average by group."
7. "Charts that tell the truth", Charts, Intermediate, 10 lessons, 2 h 40 min, Lena Farrow. "Axes, scales and colors that show the numbers as they are."
8. "Window functions step by step", SQL, Advanced, 13 lessons, 3 h 50 min, Odile Brandt. "Running totals, ranks and moving averages without leaving SQL."
9. "Dashboards people read", Charts, Advanced, 15 lessons, 4 h 30 min, Lena Farrow. "Plan, lay out and test one page of charts for a team that is short of time."

That is four courses for beginners, three intermediate and two advanced: 102 lessons in all.

The container inside `<main>` uses `gap-20` between sections. This page uses the stock `button`, `input` and `badge`; add any the project lacks with `npx shadcn@latest add button input badge`. It has a button group, so make both changes to `components/ui/button.tsx` that the Buttons note gives.

Build these parts in order.

### 1. Header

The header from the layout notes, with Courses as the current page.

### 2. Opening

A `<div>` with `flex flex-col gap-8`, not a section. First a `flex flex-col gap-3`: the `<h1>` in `text-h1 md:text-display` with `md:max-w-3xl`, "Data skills you will use on Monday", and one paragraph: "Nine courses in spreadsheets, SQL and charts. Every lesson is short, ends with one question, and starts where the last one stopped."

Then four figures, a `<ul>` with `grid grid-cols-2 gap-5 md:max-w-2xl md:grid-cols-4`: two rows of two below `md`, one row of four from `md` up. Each `<li>` is `flex flex-col gap-1 border-l-2 pl-3`, with a rule in a chart color on its left, in the order of the Chart colors note: `border-azure`, `border-tertiary`, `border-sun`, `border-berry`. It holds the smaller key figure of the layout notes and, under it, a small figure:

- `9`, then `courses`
- `102`, then `lessons`
- `3`, then `topics`
- `3`, then `teachers`

The rules only decorate: here a color does not stand for a topic.

### 3. All courses

A section with the `<h2>` "All courses". Its content, in the section's `gap-5`, is the controls, the count, and the grid or the empty state.

**The controls.** A `<div>` with `flex flex-col gap-5 md:flex-row md:items-end md:justify-between`:

- The search field, in a wrapper with `w-full md:max-w-sm`: a field from the layout notes with the label "Search courses", an `Input` with `type="search"` and `autoComplete="off"`, and the helper text `By title, topic or teacher`. No placeholder and no search button: the grid follows as you type. A browser draws a clear button of its own inside a search field that holds text: add `[&::-webkit-search-cancel-button]:appearance-none` to the `Input`'s `className`, beside the classes of the Inputs note, so the field keeps the theme's look. Escape still empties the field where the browser does that.
- The level filter, a `flex flex-col gap-2`: a `<p>` with an `id`, styled as a field's label, "Level"; then a button group from the layout notes, named by that `<p>` with `aria-labelledby` (in place of the `aria-label`), with four buttons: "All levels", chosen at the start, "Beginner", "Intermediate" and "Advanced".

**The count.** A `<p>` with `role="status"`, a small figure in `text-foreground`. It always holds a sentence, so it is an item of the section's stack:

- `Showing all 9 courses` while all nine are shown;
- `Showing 3 of 9 courses` while fewer are shown (`Showing 1 of 9 courses`);
- `No courses match` while none is.

**The grid.** A `<ul>` with `grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3`, in the order of the sample list. Each `<li>` is a card from the layout notes, with `h-full`, holding, top to bottom in its `gap-5`:

1. A row, `flex flex-wrap items-center justify-between gap-2`: the topic mark from the layout notes (the dot in the topic's color, then `Spreadsheets`, `SQL` or `Charts`), and the level as a badge: "Beginner", "Intermediate" or "Advanced". Every level has the same green badge: the word tells them apart.
2. A `flex flex-col gap-2`: the title as an `<h3>` in `text-h2`, holding a title link from the Links note (`/course` for "Charts that tell the truth", `#` for the others); then the course's sentence in `text-body`; then a small figure with the teacher, `With Odile Brandt`.
3. The card's foot, with `mt-auto`, so the feet of a row stand on one line: a `<div>` with `flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border pt-3`, holding two small figures in `text-foreground`, each with its icon: `BookOpen` and `12 lessons`, then `Clock` and `3 h 10 min`.

Nothing else is in a card: no button, no price, no picture. This page has no default button: nothing on it is the one main action.

**The empty state.** While no course matches, the grid is not rendered and a card takes its place, with `items-start` beside its stack classes: a name (the small heading of the Headings note, as a `<p>`), "No courses match your search"; one sentence in `text-body`, "Try a shorter word, or another level."; and a `secondary` button, "Clear search and level".

### 4. How a lesson works

A section with the `<h2>` "How a lesson works", then a `<ul>` with `grid grid-cols-1 gap-8 md:grid-cols-3`. Each `<li>` is a `flex flex-col gap-2`, not a card: an icon with `size-5` in `text-foreground`, an `<h3>` in `text-h2`, and one or two sentences in `text-body`.

- `BookOpen`, "Read for a quarter of an hour": "A lesson takes 12 to 19 minutes. It explains one idea and shows it once."
- `ListChecks`, "Answer one question": "Each lesson ends with a question with four answers. You are told in words whether you were right, and why."
- `Bookmark`, "Pick up where you stopped": "Rowlark keeps your place, your lessons done and your days in a row."

Under the list, in the section's `gap-5`, one line in `text-body`: "The first module of every course is free." followed by a text link, "See the plans", to `/plans`.

### 5. Footer

The footer from the layout notes.

### Behavior

- Keep the search text and the level in component state; the cards, the count and the empty state all read from them.
- A course matches the search when the text typed, trimmed and compared without regard to case, is found in its title, its topic or its teacher's name. An empty search matches every course. So `sql` shows three courses, two by their title and "Window functions step by step" by its topic, and `lena` shows Lena Farrow's three.
- A course matches the level when "All levels" is chosen or its level is the chosen one. A card is shown when it matches both: `sql` with "Advanced" leaves one course, and `pivot` with "Beginner" leaves none.
- The count follows at once, on every keystroke and every press of a level. The chosen level's button has `aria-pressed="true"`, the others `aria-pressed="false"`; pressing one moves no focus.
- "Clear search and level" empties the search field, chooses "All levels" and moves focus to the search field, since the button itself is gone with the empty state.
- The title links and the nav links need no behavior beyond their `href`.
