---
page: profile and settings screen
title: Profile
description: the profile screen of a habit-tracking app, with name and email that are checked and saved, reminders as labelled switches, a reminder time and a way to delete the account after typing a word.
order: 5
checks:
  - An empty name or a malformed email gets a message in words with an icon, tied to its field, and is not saved; a good save shows "Saved" with an icon in a `role="status"` element.
  - Every switch has a visible label tied to it with `aria-labelledby`, announces whether it is on, and has a touch area at least 44px tall.
  - 'The reminder time is the theme''s `Select` with a visible label, with no native `<select>` on the page: its trigger is a pill as tall as the inputs, its list opens under it as a sheet in the card''s color with a 1px border, the chosen row has a raspberry check, and the arrow keys, Enter and Escape work in it.'
  - The "Delete my account" button stays disabled until the word `delete` is typed, keeps keyboard focus while disabled, and its warning is stated in words, not by the red color alone.
  - Profile has one raspberry button, "Save changes".
---

Sample content, if the user gave none: "Mossy", a habit tracker for small, daily steps. The person is Ines Okafor, ines.okafor@example.com, on the free plan since 2 September 2026. Her reminders: a morning nudge at 08:00 (on), an evening check-in (on), a weekly summary on Sundays (off), a note when a streak is at risk (on).

The `<main>` uses `gap-10` between groups.

Build these parts in order.

### 1. Header

The header from the layout notes, with Profile as the current page.

### 2. Page header

The page header from the layout notes, with the small figure `With Mossy since 2 September 2026` (the date a `<time dateTime="2026-09-02">`) above the `<h1>` "Your profile".

### 3. Settings

A grid from the layout notes. Its first item, `md:col-span-7`, is a `flex flex-col gap-10` holding the parts "You" and "Reminders"; its second, `md:col-span-5`, holds "Your plan" and "Delete your account" in the same way. Below `md` they stack in that order. Each part is a card that is a section, with its `<h2>` first in the card's `gap-4` (in "You", the row that holds the avatar and the `<h2>` comes first).

**You.** The card opens with a row, `flex items-center gap-3`: an avatar with the initials `IO` and the `<h2>` "You". The form has `noValidate` and `flex flex-col gap-6`:

- "Name": an `Input` (add it with `npx shadcn@latest add input`) with `autoComplete="name"`.
- "Email": an `Input` with `type="email"` and `autoComplete="email"`, with helper text `We only write to you about your account.`
- A row, `flex items-center` with no gap of its own and no wrap (at 375px both fit on one line, and `ml-3` never indents a second line): the page's one default `Button`, `type="submit"`, "Save changes", and beside it the `role="status"` element for the confirmation, empty at first. The confirmation line inside it carries `ml-3`, so the empty element adds no space.

**Reminders.** The `<h2>` "Reminders" and, in the card's `gap-4`, one sentence: "Changes here save as you make them." Then four rows in a `flex flex-col`, each row `flex min-h-11 items-center justify-between gap-4 py-3`, every row after the first with `border-t border-border`:

- At the left, a `flex min-w-0 flex-col gap-2`: the title, a `<p>` with an `id` in `text-body font-medium` (add `font-sans`), and under it a small figure with an `id` that says what the reminder does. For example: Morning nudge / `A reminder to start your habits`; Evening check-in / `At 20:00, if something is left`; Weekly summary / `Sundays at 18:00`; Streak at risk / `When your streak could end tonight`.
- At the right, the shadcn `Switch` (add it with `npx shadcn@latest add switch`), tied to the title with `aria-labelledby` and to the small figure with `aria-describedby`.

The stock `Switch` is a pill, which suits this theme, but it is 18px tall and its touch area 34px. In `components/ui/switch.tsx`, replace `data-[size=default]:h-[18.4px] data-[size=default]:w-[32px]` with `data-[size=default]:h-6 data-[size=default]:w-10`, the thumb's `group-data-[size=default]/switch:size-4` with `group-data-[size=default]/switch:size-5`, and `after:-inset-y-2` with `after:-inset-y-3`, so the touch area reaches 48px. The `sm` size's classes and the thumb's `translate-x-[calc(100%-2px)]` stay: at the new sizes the thumb still ends at the track's inner edge, as it ships. On, its track is raspberry, as it ships. Off, its stock track is the border color, which is too faint against a white card: replace `data-unchecked:bg-input dark:data-unchecked:bg-input/80` on the track with `data-unchecked:bg-muted-foreground`. On the thumb, take out `dark:data-unchecked:bg-foreground`, so an off thumb stays `bg-background` in both modes: the stock light thumb on the new track is under 2:1 in dark mode, the background color over 5:1 in both. The thumb's other stock colors stay, and its place says which state the switch is in.

Under the rows, the reminder time: a field from the layout notes, "Morning reminder time", a `Select` from the layout notes in its own `<div>` with `w-full md:w-40` inside the field's stack (the label and helper text keep the card's width), with the times 06:00 to 11:00 every half hour, 08:00 chosen, and the helper text `When Mossy sends your morning nudge`. It is disabled while "Morning nudge" is off (`disabled` on the `Select`; the trigger dims by its stock classes), and the helper text then reads `Turn on Morning nudge to choose a time.`

**Your plan.** The `<h2>` "Your plan", then the key figure's row from the layout notes (`flex flex-wrap items-baseline gap-2`): `Free` as the smaller key figure, `font-heading text-h1`, with the small figure `5 of 5 habits in use` beside it as its unit. Then one sentence, "You are using all five habits on Free.", and a text link "See plans" to `/plans` with `self-start`, so the link is as wide as its words. No button.

**Delete your account.** The `<h2>` "Delete your account". Under it, in the card's `gap-4`, one `<div>` with no gap is the wrapper for the delete form and its status element. It holds a `flex flex-col gap-4` and, after it, the `role="status"` element, empty at first. The stack holds: one paragraph in `text-body` that says what is lost, in words: "This deletes your habits, your streak and all your history. It cannot be undone."; a field from the layout notes, "Type delete to confirm", an `Input` with `autoComplete="off"`; and the button "Delete my account": `variant="destructive"` with the `Trash2` icon before its text, `focusableWhenDisabled`, full width below `md` (`w-full md:w-auto md:self-start`). Add `hover:text-foreground` to it: the stock hover tint leaves too little contrast for the red text.

### 4. Footer

The footer from the layout notes.

### Behavior

- "Save changes" checks the fields: an empty name shows "Add your name, so Mossy knows what to call you."; a malformed email shows "Check your email: it needs an @ and a domain." Each error sits under its field, and focus moves to the first field with an error. Nothing is saved while an error shows.
- A good save stores the values in component state and shows the confirmation line from the layout notes with the word "Saved" in the status element. It goes away after four seconds. The avatar's initials follow the saved name.
- Each switch keeps its value in state and changes at once. Turning "Morning nudge" off disables the time `Select` and swaps its helper text; turning it on enables it again with the time it had.
- "Delete my account" is disabled until the field holds `delete`, ignoring case and spaces around it. Clicking it removes the stack and puts one `<p>` in the `role="status"` element: "This is where your account would be deleted." That sentence gets `tabIndex={-1}` and focus.
- The nav links and "See plans" go to their addresses and need no other behavior.
