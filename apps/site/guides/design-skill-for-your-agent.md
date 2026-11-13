---
title: Give your coding agent a design skill
description: A skill tells a coding agent how to build UI in your design, step by step, and loads only when it is needed. Three ways to get one, and what one test of a skill taught.
kind: How to
date: 2026-11-13
checked: 2026-11-13
tool: "@strictthemes/check 0.7.1"
---

A `DESIGN.md` tells a coding agent what your design is: these colors, these sizes, these corners. It does not tell the agent what to do with a project that has none of them in its code yet, which font package to load under which name, or when to stop and ask. Left to work that out, an agent guesses, and the guesses are where a page goes off the design.

A skill fills that gap. It is the procedure that goes with the spec. This guide shows what a skill is made of, three ways to get one for your design, and what one test of a generated skill showed about what a skill has to say.

## 1. Know what a skill is

A skill is a folder with a file named `SKILL.md` in it. The file has three parts:

- **A name.** The same as the folder's name.
- **A description.** One or two sentences that say what the skill is for and when to use it.
- **The procedure.** Plain Markdown: steps, rules, a command to run at the end.

![A SKILL.md file drawn as five bands, each with a label beside it. The name, then the description, marked as the trigger that decides whether the rest is read, then the steps, the rules and stop conditions, and last the check, a command that says done or not.](/guides/design-skill-for-your-agent/skill-parts.svg "The parts of a skill. The description is the part that decides whether the rest is read.")

A coding agent that supports skills reads each skill's name and description at the start of a session, and opens the rest of the file only when a task matches the description. That is the difference from an instruction file such as `AGENTS.md`, which is loaded whole into every session:

| | Instruction file | Skill |
|---|---|---|
| Loaded | Always, in full | Name and description always, the rest on a match |
| Good length | Short: every line costs attention in every task | As long as the procedure needs |
| Holds | What is true for all work in the project | How to do one kind of work |
| Fails when | It grows until the agent skims it | Its description does not match the task, so it is never opened |

A design procedure fits the second column. It is long, and an agent fixing a database query does not need it. [DESIGN.md, AGENTS.md and Cursor rules](/guides/design-md-agents-md-rules/) covers which file holds what.

Where the folder goes depends on the tool. The commands below write to `.claude/skills/<name>/SKILL.md` in the project, which is one common place. Check where your tool reads skills from, or paste the file's text into its instruction file as a fallback.

## 2. Pick one of three ways to get one

| Way | When it fits | Length |
|---|---|---|
| A theme's ready skill | You build in one of the [themes](/themes/) | 5,061 to 9,159 words |
| Generate one from your site | You have a site that already looks right | About 700 words |
| Write one by hand | You have a spec and know your project's habits | Yours to decide |

The first range is a word count of the 23 files `skills/strict-theme-*/SKILL.md` in the repo; the middle one, Civic's, has 6,436 words.

### A. Take a theme's ready skill

Each theme has a skill at `https://strictthemes.com/themes/<slug>/SKILL.md`, and the same file in the repo at `skills/strict-theme-<slug>/SKILL.md`. To put Kiln's into a project:

```bash
curl -s --create-dirs -o .claude/skills/strict-theme-kiln/SKILL.md https://strictthemes.com/themes/kiln/SKILL.md
```

That writes one file of 40,970 bytes.

A theme's skill is long because it carries more than tokens. Kiln's opens like this:

```yaml
name: strict-theme-kiln
description: "Build UI in the Kiln theme from strictthemes.com. A warm, hand-made theme for shops and studios. ... Use it when the project's DESIGN.md is Kiln, or when the user asks for the Kiln theme. It installs the theme into a shadcn project, gives its layout rules and its page briefs (shop home page, collection page, product page, basket page and studio page), and checks the result with Strict Check."
```

Its sections are "Before you start", "The theme in short", "How Kiln pages are laid out", "Rules", "Page briefs" and "Check before you finish". The layout section is what a generated skill cannot have: how wide the container is, how sections are spaced, which text is a label.

### B. Generate one from your own site

If your site already looks the way you want, measure it. This writes a `DESIGN.md` and a skill from two pages:

```bash
npx -y @strictthemes/check@0.7.1 generate https://strictthemes.com --path / --path /kit/ --skill
```

It took 20 seconds here and printed:

```
Measuring https://strictthemes.com/, https://strictthemes.com/kit/
Wrote DESIGN.md
Wrote .claude/skills/strictthemes-com-design/SKILL.md

  colors      8
  typography  5 sizes
  spacing     5 steps
  corners     2

Checked against the pages it was measured from: 100% of 2885 measured values follow it.
```

The skill it wrote has 701 words. Its head:

```yaml
name: strictthemes-com-design
description: "Build UI that matches strictthemes.com (https://strictthemes.com): its colors, type, spacing and corners, as written in DESIGN.md. Use it whenever you add or change a page, a section or a component in this project. It names the tokens, says what is not allowed, and checks the result with Strict Check."
```

Then six steps under "Before you start", the tokens in short, nine rules, and the check. Two of the steps:

> 3. If the tokens are not in the code yet, put them there first. For Tailwind 4, `npx @strictthemes/spec export DESIGN.md --format tailwind` prints them as a `@theme` block, with the dark mode ...
>
> 4. Load each font under the exact family name the spec gives it. A package that registers the font as "Name Variable" needs its own `@font-face` with the spec's name.

`--skill-out <file>` writes the skill somewhere else. The skill repeats the spec's tokens as they were when it was written, so generate it again after you change the spec. [Make a DESIGN.md from a site you already have](/guides/design-md-from-your-site/) walks through the spec half of this command.

### C. Write one by hand

A skill is a text file, and a short one that fits your project beats a long one that does not. A template:

```markdown
---
name: acme-design
description: "Build UI that matches Acme's design, as written in DESIGN.md. Use it whenever you add or change a page, a section, a component or any styling in this project, also when the request does not mention design. It says how the tokens are named in the code, what is not allowed, and how to check the result."
---

# Acme: design

## Before you start

1. Read `DESIGN.md` in full.
2. The tokens are in `src/styles/theme.css`. Use the classes that file defines
   (`bg-surface`, `text-h1`), never a raw value.
3. Open `src/pages/pricing.tsx` and lay your page out the same way.

## Rules

- Only the colors, sizes, spacing steps and corners in `DESIGN.md`.
- Hover and focus colors are tokens too. Every control shows its focus.
- Need a value that is not in the spec? Stop and ask. Do not add a token.

## Check before you finish

Run `npm run build`, then `npx @strictthemes/check --dist dist`.
Fix what it lists and run it again until the last line starts with `Passed`.
Do not mark code `strict-ignore` to get there.
Then say what you built, what the check reported, and what you could not verify.
```

What each part is for:

- **`name`:** lower case with hyphens, the same as the folder.
- **`description`:** the trigger. See below.
- **Before you start:** the facts about this project that the spec cannot hold. Name real files. "The tokens are in `src/styles/theme.css`" saves the agent a search and a wrong guess.
- **Rules:** short, and only the ones an agent breaks. The values themselves stay in `DESIGN.md`.
- **A stop condition:** the line that begins "Need a value". Without it, an agent that lacks a color makes one up.
- **The check:** a command with a pass or fail, so "done" is not the agent's opinion.

### Writing the description so it triggers

The description is all the agent sees when it decides whether to open the skill. Three things make it work:

- **Say when, in the words of a request.** People ask for "a settings page" or "make the header sticky". They do not ask to "apply the design system". List the things that get asked for: a page, a section, a component, styling.
- **Say "whenever", and cover the quiet case.** Most UI requests do not mention design at all. "Also when the request does not mention design" is there for that.
- **Say what is inside.** "How the tokens are named, what is not allowed, how to check" tells the agent that opening the file will pay off.

A description such as "Design guidelines for Acme" names a topic and no occasion. It will sit unread.

## 3. See what one test showed

The generated skill has been put to one real test, and it is worth reading closely, because the skill changed after it.

A stock shadcn project was given two files and one request: a `DESIGN.md` and a skill, both generated from two example pages of the Kiln theme, and a request for a pricing page. No page existed to copy from, and none of the tokens were in the project's code.

![The top of a pricing page on a clay-colored background: a header with the name Kiln Shop and a terracotta button, a large heading that reads Learn to glaze, one firing at a time, and three plan cards with prices of 65, 220 and 140 dollars.](/guides/design-skill-for-your-agent/trial-page.png "The page from the test, built in a stock shadcn project from a generated spec and skill.")

The result passed Strict Check on the first run. We ran the check again on a copy of that project for this guide:

```bash
npx -y @strictthemes/check@0.7.1 --dist dist
```

```
Rendered pages: / in light and dark mode at 1280px and 375px, also on hover and focus
  colors         546 checked  all on theme
  spacing        732 checked  all on theme
  typography    1360 checked  all on theme
  ...

Passed: 100% of 3389 measured values follow the theme. 0 errors, 0 warnings.
```

That is the good news. The useful news is what the pass hid. The skill used in the test had three steps under "Before you start", and the second said to look at how the project names the tokens in code. A stock project names none. So before any page could be written, the tokens had to be wired in: the project's stylesheet was rewritten, 151 lines in all, with every color as a variable in both modes, the default palette and text sizes switched off, and a class for each of the five text styles. The fonts needed the same care. The spec says `Bricolage Grotesque`; the font package registers `Bricolage Grotesque Variable`, a different family name, so the stylesheet declares the font again under the spec's name. None of that was in the skill. It worked, but by inference, and the report that came back listed the places where the skill had left a choice open.

The skill was changed to close the larger ones. Generating it again from the same two pages after the change gave this difference from the one in the test:

| | In the test | After the change |
|---|---|---|
| Words | 531 | 759 |
| Steps before starting | 3 | 6 |
| Rules | 8 | 9 |
| Wiring the tokens | Not mentioned | Step 3, with the export command |
| Font family names | Not mentioned | Step 4 |
| Hover and focus | Not mentioned | A rule of their own |
| No page to copy | Not mentioned | "choose a layout yourself and tell the user which choices were yours" |

The changed skill has not been through the same test again. One run is one run.

### What belongs in the skill, and what in the spec

The lesson is a division of labor:

| Put in `DESIGN.md` | Put in the skill |
|---|---|
| Every value: colors, sizes, steps, corners | The order of work: read, wire, build, check |
| What each token is for | How to get the tokens into this project's code |
| The `strict` block: what is allowed | The exact names fonts must load under |
| Layout in words: widths, columns, rhythm | What to do when the spec is silent: stop and ask, or choose and say so |
| | The check as the last step, and what not to do to pass it |

A value in the skill is a copy, and copies go stale. The generated skill says so itself: "If this list and `DESIGN.md` differ, the spec is right."

## 4. Test your own skill

A skill reads as complete to the person who wrote it. Test it the way the generated one was tested:

1. **Start a fresh session** in a copy of the project, so the agent knows nothing you told it earlier.
2. **Give it one small task and do not name the skill:** "Add a FAQ section to the pricing page." If the skill is not opened, the description is the problem. Fix that first.
3. **Ask for a list of guesses.** End the request with: "When you are done, list every decision the skill and DESIGN.md did not settle for you." This list is the result you are after.
4. **Run the check yourself,** and read the diff for raw values: a hex color, a `text-[15px]`, a new font import.
5. **Turn each guess into a line.** A guess about a value goes into `DESIGN.md`. A guess about procedure goes into the skill. Then run the test again from step 1.

Stop when the list of guesses is short and none of them shows on the page.

## What a skill cannot do

- **It does not enforce anything.** A skill is advice the agent can skip or half-follow. The check is what holds; run it [in CI](/guides/strict-check-in-ci/) as well.
- **It may never load.** A task that does not match the description goes ahead without it.
- **A generated skill knows no layout.** It is written from measured values, so it has no container width and no page structure until you add them.
- **Skill support differs between tools,** and so does the folder they read. The skills here are plain Markdown, so the text can go wherever your tool reads instructions.

## Next

- [DESIGN.md, AGENTS.md and Cursor rules](/guides/design-md-agents-md-rules/): what goes in which file.
- [Keep an agent on your design: Strict Check in CI](/guides/strict-check-in-ci/): the check that holds when the skill is skipped.
- [The themes](/themes/): each has a ready skill, a spec and page prompts.
