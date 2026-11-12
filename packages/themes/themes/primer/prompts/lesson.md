---
page: lesson page
title: Lesson
description: one lesson of an online course, with where the learner is in the course and a progress bar, the lesson's text with one code sample, a question with four answers and a Check my answer button that answers in words, a link to the next lesson, and the module's lessons with their state.
order: 3
checks:
  - "The opening says Lesson 4 of 12 in words, with a progress bar whose percentage and count of lessons done are written beside it."
  - "The four answers are native radio buttons in one `<fieldset>` with the question as its `<legend>`, and Check my answer is the only default button on the page."
  - "Check my answer with nothing chosen shows an error line with an icon, tied to the fieldset; with an answer chosen it says in words, in a `role=status` element that was on the page from the start, whether the answer is right, and explains the right one."
  - "A right answer marks lesson 4 done: the bar goes to 33%, the count to 4 of 12 lessons done, and the lesson's row in the module list says Done."
  - "Every lesson in the module list has its state as an icon and a word (Done, This lesson, Next or Locked), and the locked lesson is not a link."
  - "The code sample is a `<pre>` in the label font that scrolls inside its own box and can be reached with the keyboard."
---

Sample content, if the user gave none: "Rowlark", an online school for practical data skills, and its course "SQL from zero": 12 lessons, 3 h 10 min, taught by Odile Brandt. The learner, Tessa Marlow, has done lessons 1 to 3 and is reading lesson 4, "Filtering rows with WHERE", 16 min. That is 3 of 12 lessons done, 25%, with 2 h 31 min left in the course. The lesson is in module 1, "Asking one table questions", 6 lessons, 1 h 28 min:

1. "What a database is", 12 min, done
2. "Your first SELECT", 14 min, done
3. "Choosing columns", 13 min, done
4. "Filtering rows with WHERE", 16 min, this lesson
5. "Sorting with ORDER BY", 15 min, next
6. "A small report from one table", 18 min, locked

The lesson's examples ask Rowlark's own table of courses, `courses`, which has four courses for beginners, three intermediate and two advanced.

The container inside `<main>` uses `gap-8` between groups. This page uses the stock `button` only. It has no button group, so `components/ui/button.tsx` needs only the `secondary` change of the Buttons note. It has native radio buttons: set `color-scheme` in the global CSS as the Dark mode rule gives it for a native control, so that they follow the mode.

Build these parts in order.

### 1. Header

The header from the layout notes, with Courses marked as the current section (`aria-current="true"`, as the Breadcrumb note says).

### 2. Where you are

A `<div>` with `flex flex-col gap-5`, not a section:

- The breadcrumb: `Courses` (a link to `/catalogue`), `SQL from zero` (a link to `#`) and the current step `Lesson 4`.
- A `flex flex-col gap-2`: a small figure, `Module 1 · Asking one table questions`, then the `<h1>` in `text-h1`, "Filtering rows with WHERE".
- The place in the course, a `flex flex-col gap-2 md:max-w-2xl`:
  1. A row, `flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1`: a `<p>` in `font-sans text-body font-semibold`, "Lesson 4 of 12", and a small figure, `16 min · 2 h 31 min left in the course`.
  2. The progress bar from the layout notes, at 25%, with `25%` beside it.
  3. A small figure in `text-foreground`: `3 of 12 lessons done`.

### 3. The lesson and its module

A grid from the layout notes. Its first item, `lg:col-span-8`, is a `flex min-w-0 flex-col gap-8` holding the lesson's text, the question and what comes next. Its second item, `lg:col-span-4`, is the module's list. Below `lg` the list comes after everything in the first item.

**The lesson's text.** An `<article>` with `flex flex-col gap-8`. It holds three blocks, each a `flex flex-col gap-3`; paragraphs keep the measure of the layout notes. A word set in backticks below is an inline `<code>`: the label font at the size of the text around it (`font-mono`, no size class), with no fill and no border.

1. No heading. Two paragraphs: "So far every query has returned every row of a table. Most questions are about some of the rows: the courses for beginners, the orders from March, the customers in one town." and "`WHERE` is how you ask for them. It comes after `FROM` and holds a condition. The database checks the condition against each row and keeps the rows where it is true."
2. An `<h2>`, "One condition". A paragraph: "This query asks Rowlark's own table of courses for the ones for beginners:". Then the code sample, below. Then a paragraph: "The text `'Beginner'` is in single quotes. Without them the database would look for a column called Beginner and stop with an error. Numbers need no quotes: `WHERE lessons > 10` keeps the courses with more than ten lessons."
3. An `<h2>`, "Things to remember". A `<ul>` with `flex flex-col gap-2`, each `<li>` a `flex items-start gap-3` in `text-body` with the `Check` icon (`mt-1 shrink-0`, `aria-hidden="true"`): "`WHERE` comes after `FROM`."; "Text goes in single quotes. Numbers stand alone."; "`=` means equal, `<>` means not equal, and `>` and `<` compare numbers."

**The code sample.** The page's one code block: a `<figure>` with `flex flex-col gap-2 md:max-w-2xl`. First a `<pre>` with `overflow-x-auto rounded-lg border border-border bg-card p-5 font-mono text-body text-foreground`, holding a `<code>` with these three lines:

```sql
SELECT title, lessons
FROM courses
WHERE level = 'Beginner';
```

The `<pre>` scrolls sideways when it has to, so it gets `tabIndex={0}`, `role="region"`, the `aria-label` "Code sample: a query with WHERE" and the focus outline from the rules. No syntax colors: the code is in the text color. Then the `<figcaption>`, a small figure: `It returns 4 rows. Change 'Beginner' to 'Advanced' and it returns 2.`

**The question.** A card that is a section, with the `<h2>` "Check what you learned". Under it, as the card's second item, one plain `<div>` holds the `<form>` and, after it, the `role="status"` element for the result, empty at the start. The `<form>` has `noValidate` and `flex flex-col gap-5`:

- A `<fieldset>` with `m-0 min-w-0 border-0 p-0`. Its `<legend>` has `p-0 pb-3 font-sans text-body font-semibold` and is the question: "Which query returns the intermediate courses?" After the legend, a `flex flex-col gap-3`: the hint, a small figure with an `id`, `One answer is right.`; then the four answers in a `<div>` with `flex flex-col`; then the error line, while there is one. The fieldset names the hint, and the error line while there is one, in its `aria-describedby`.
- Each answer is a `<label>` with `flex min-h-10 cursor-pointer items-start gap-3 border-t border-border py-3`, all four with the rule above them. It holds a native `<input type="radio">` with the `name` `answer` and `mt-0.5 size-5 shrink-0 accent-primary`, then the query as a `<code>` with `min-w-0 font-mono text-body break-words`. Not the shadcn `RadioGroup`. None is chosen at the start. The four, in this order:
  1. `SELECT title FROM courses WHERE level = Intermediate;`
  2. `SELECT title FROM courses WHERE level = 'Intermediate';`
  3. `SELECT title WHERE level = 'Intermediate' FROM courses;`
  4. `SELECT title FROM courses FILTER level = 'Intermediate';`
- A row, `flex flex-wrap items-center gap-3`: the page's one default `Button`, `type="submit"`, "Check my answer", and a small figure, `You can try as often as you like`.

The second answer is the right one.

**The result.** Rendered inside the status element only after an answer has been checked: a `<div>` with `mt-5 flex items-start gap-3 border-t border-border pt-5`. It holds an icon with `mt-0.5 size-5 shrink-0` in `text-foreground`, `CircleCheck` for a right answer and `CircleX` for a wrong one, then a `flex flex-col gap-1`: a name (the small heading of the Headings note, as a `<p>`) and one paragraph in `text-body`. Nothing in it is green or red: the words say it.

- Right: the name "That is right", and "WHERE comes after FROM, and the text 'Intermediate' is in single quotes. The query returns 3 rows, one for each intermediate course. Lesson 4 is done."
- Wrong: the name "Not quite", and two sentences. The first says what is wrong with the answer chosen: for the first answer, "Without quotes the database looks for a column called Intermediate and stops with an error."; for the third, "WHERE cannot come before FROM: the database has to know the table first."; for the fourth, "SQL has no FILTER word for this: the word is WHERE." The second is the same for all three: "The right answer is the second query: WHERE after FROM, with the text in single quotes."

**What comes next.** A `<div>` with `flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5`: on the left a `flex flex-col gap-1` with a small figure, `Up next · 15 min`, and a name as a `<p>`, "Lesson 5: Sorting with ORDER BY"; on the right an `<a href="#">` styled as a `secondary` button, "Next lesson", with the `ArrowRight` icon after its text.

**The module's list.** An `<aside>` that is a card and is named by its heading with `aria-labelledby`, with `lg:sticky lg:top-8 lg:self-start`, so it stays in view from `lg` up while the lesson scrolls. It holds a `flex flex-col gap-2` with the `<h2>` "In this module" and a small figure, `Module 1 · 6 lessons · 1 h 28 min`; then the six lessons as an `<ol>`, set as the Rows with rules note says; then a small figure: `Lessons open one at a time. Lesson 6 opens when you start lesson 5.`

Each `<li>` is also `flex items-start gap-3`: the state's icon with `mt-0.5 size-5 shrink-0` and `aria-hidden="true"`, then a `flex min-w-0 flex-col gap-1` with the lesson's number and title on one line, `4. Filtering rows with WHERE`, in `text-body`, and under it a small figure with the length and the state, `16 min · This lesson`. The four states:

- **Done** (lessons 1 to 3): the `CircleCheck` icon in `text-foreground`; the title is a title link from the Links note, to `#`; the figure ends in `Done`.
- **This lesson** (lesson 4): the `Play` icon in `text-foreground`; the title is a `<span>` with `font-semibold` and `aria-current="page"`, not a link; the figure ends in `This lesson`.
- **Next** (lesson 5): the `ArrowRight` icon in `text-foreground`; the title is a title link to `#`; the figure ends in `Next`.
- **Locked** (lesson 6): the `Lock` icon in `text-muted-foreground`; the title is plain text in `text-muted-foreground`, not a link; the figure ends in `Locked`.

### 4. Footer

The footer from the layout notes.

### Behavior

- Keep the chosen answer, the checked result and whether lesson 4 is done in component state.
- "Check my answer" with no answer chosen shows the error line "Choose one of the four answers first." under the answers, names it in the fieldset's `aria-describedby` and moves focus to the first radio button. Render the line first and move focus after, in an effect. Choosing an answer removes the line.
- With an answer chosen, "Check my answer" puts the result into the status element and keeps focus on the button. Choosing another answer afterwards empties the status element, so a result never stands beside an answer it does not belong to. The learner may check again as often as they like.
- The first right answer marks lesson 4 done, and it stays done whatever is checked later. From then on the place in the course reads `4 of 12 lessons done` with the bar and its figure at 33%, the small figure beside "Lesson 4 of 12" reads `16 min · 2 h 15 min left in the course`, and the lesson's row in the module's list has the `CircleCheck` icon and `16 min · Done`. Its title stays as it is, with `aria-current="page"`. Lessons 5 and 6 do not change.
- The percentage is the lessons done out of 12, rounded to a whole number, and sets the fill's width.
- "Next lesson" and every other link need no behavior beyond their `href`.
