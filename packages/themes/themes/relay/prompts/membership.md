---
page: membership form
title: Membership
description: a page to join a sports club, with three kinds of membership to choose from as radio cards, a form for the new member's details, an emergency contact and consent that is checked in code, and a confirmation that replaces the form.
order: 4
checks:
  - "The three memberships are the theme's `RadioGroup`, each radio in a card that is a `<label>`, with Playing chosen at the start; the chosen card is marked by its radio and a darker border, never by amber, and the arrow keys move the choice."
  - "Every field has a visible label tied to it; sending the form with empty or wrong fields shows an error in words with an icon under each, tied with `aria-describedby`, and moves focus to the first field with an error."
  - "A date of birth under 18 with Playing chosen, or 18 or over with Junior chosen, gets its own error, worked out against 8 June 2027 and not the device clock."
  - "After Join the club the form is replaced by a confirmation with the number `WFC-27-0141` in a `role=status` element that was on the page from the start, and focus moves to its heading."
  - "Join the club in the form is the page's only amber button, and the radios and the checkbox are round and square, with a field's edge when clear and a navy fill in light mode, an ice blue one in dark mode, when checked."
  - "The date of birth is picked from the theme's calendar in a popover under a trigger that looks like the other fields, with no native date field or `<select>` on the page: month and year are the theme's `Select`, the chosen day is filled navy or ice blue, today is underlined, and the arrow keys, Enter and Escape work in it."
---

Sample content, if the user gave none: "Wendmoor Football Club", which has 140 members and takes new ones all season. Three kinds of membership for the 2027 season, which ends on 31 July: Playing at £95, for adults aged 18 or over; Junior at £45, for players under 18; Social at £30, for everyone else. Adults train on Mondays and Thursdays at 19:00, juniors on Thursdays at 17:30, all at Millrace Park. Today is Tuesday 8 June 2027, so the first session for a new player is Thursday 10 June, and the next home match is against Stenwick Albion on Saturday 19 June at 15:00. A new member gets the number `WFC-27-0141`.

This page uses the stock `button`, `input`, `radio-group`, `checkbox`, `popover`, `calendar` and `select`; add any the project lacks with `npx shadcn@latest add button input radio-group checkbox popover calendar select`, and make each new file import `cn` from the utils file, as the setup says.

Build these parts in order. The container inside `<main>` has one item: a `<div>` with `flex flex-col gap-8` that holds the page head and, after it, one plain `<div>` with no classes. That plain `<div>` holds the `<form>` of part 3 and, after the form, the confirmation element of part 4, on the page from the start and empty.

### 1. Header

The header from the layout notes. The current page is Membership.

### 2. Page head

The label `2027 SEASON · 140 MEMBERS`, then the `<h1>` "Join the club", then the sentence "Choose a membership, tell us who you are, and come to your first session. It takes two minutes." There is no action on the right: the form's button is the page's amber one.

### 3. The form

A `<form>` with `noValidate`, the `aria-label` "Join the club" and `flex flex-col gap-8`. It has two items: the memberships, then a grid row.

**Memberships.** A `RadioGroup`, which renders the `role="radiogroup"` element, with the `name` "membership", named by its heading with `aria-labelledby`, and `className="flex flex-col gap-5"`: an `<h2>` "Choose a membership", then a grid row of three radio cards, four columns each from `lg` up.

A radio card is a `<label>` with `flex cursor-pointer flex-col gap-3 rounded-xl border border-border bg-card p-5 has-data-checked:border-foreground`: a card of its own on the page, whose border turns to the text color while its radio is checked (the radio carries `data-checked` then). A `<label>` may hold only inline elements, so every part of it is a `<span>`:

- A first line, `flex items-center gap-3`: the radio, a `RadioGroupItem` with the membership as its `value`, then the membership's name in `font-heading text-h2 uppercase`.
- The price, `flex flex-col gap-1`: a figure in `text-h1`, then the label `A SEASON`.
- Who it is for, one sentence, `block text-body`.
- What it includes, `flex flex-col gap-2`: three lines, each `flex items-start gap-2 text-body` with the `Check` icon and a phrase.

The radio gets `aria-labelledby` naming the `<span>` with the membership's name and `aria-describedby` naming a `<span>` that wraps the other three parts (`flex flex-col gap-3`). The three cards:

- "Playing", `£95`, chosen at the start: "For adults aged 18 or over who want to play." It includes "Training on Mondays and Thursdays at 19:00", "A place in the first team or reserves squad" and "Match kit and insurance for the season".
- "Junior", `£45`: "For players under 18." It includes "Coaching on Thursdays at 17:30", "Matches with the under 18s on Sundays" and "Match kit and insurance for the season".
- "Social", `£30`: "For supporters, parents and former players." It includes "Free entry to home league matches", "A vote at the annual meeting" and "The club newsletter each month".

**The grid row** has two items.

**Your details,** eight columns from `lg` up: a card with the `<h2>` "Your details" and three more items.

First, a grid of fields, `grid grid-cols-1 gap-5 md:grid-cols-2`, in this order; a field marked "both" spans both columns (`md:col-span-2`):

1. "Full name", an `Input` with `autoComplete="name"`, both.
2. "Email", `type="email"`, `autoComplete="email"`.
3. "Date of birth", the date field described under the list, with the helper text "Playing members are 18 or over. Juniors are under 18."
4. "Emergency contact", `autoComplete="off"`, with the helper text "Someone we can call on a match day. For a junior, a parent or guardian."
5. "Emergency contact's phone", `type="tel"`, `autoComplete="off"`.

Every field starts empty.

**The date of birth** is picked from the project's `Calendar` in a `Popover`, never an `<input type="date">`, and the calendar's month and year are the theme's `Select`, never the native `<select>` the calendar ships with: no control here keeps the browser's look, at rest or open. Edit three files in `components/ui`, once, changing the classes in the file, then write the field in page code.

- `select.tsx`, so that the trigger is an `Input`'s box and the open list is the theme's:
  - `SelectTrigger`: replace `w-fit` with `w-full`, `border-input` with `border-muted-foreground`, `bg-transparent` with `bg-card`, its two stock gaps (its own and the one in `*:data-[slot=select-value]:`) with `gap-2`, its left padding with `pl-3` (delete the vertical padding; `pr-2` stays), its small text size with `text-body`, `data-[size=default]:h-8` with `data-[size=default]:h-10`, its `focus-visible:ring-*` classes with the outline classes of the Focus rule and its `aria-invalid:ring-*` classes with `aria-invalid:ring-0`; delete its four classes that start with `dark:`. Give the `ChevronDownIcon` `strokeLinecap="square"`. `pr-2` is meant: the chevron is drawn 4px inside its 16px box, so its tip ends 12px from the edge, as far as the text starts from the other one.
  - `SelectContent`: change the default `align = "center"` to `align = "start"` and `alignItemWithTrigger = true` to `alignItemWithTrigger = false`, so that the list opens under its trigger, not over it. On the popup, replace `w-(--anchor-width) min-w-36` with `max-w-(--available-width) min-w-(--anchor-width)`, as wide as the trigger and wider only where a choice needs it, and replace `ring-1 ring-foreground/10` with `border border-muted-foreground py-1`: the field's own edge, which also sets the list off in dark mode, where it is the card's navy. Its `rounded-lg`, `bg-popover` and `shadow-md` stay. Give the chevrons of the two scroll buttons `strokeLinecap="square"`.
  - `SelectItem`: replace its stock gap with `gap-2`, its left padding with `pl-3` and its small text size with `text-body` (`py-1 pr-8` stay); delete its corner class; replace `focus:bg-accent` and the two classes after it, which recolor the row's text, with `focus:bg-ice focus:text-ice-foreground`; give the `CheckIcon` `strokeLinecap="square"`. A row runs the full width of the list with its text under the trigger's. The row under the pointer or the arrow keys is a marked row, ice blue with navy text in both modes; this fill is its focus mark, so it is the one thing on ice that takes focus. The chosen row has a check under the trigger's chevron, in the row's text color.
- `popover.tsx`, on the popup of `PopoverContent`: replace its stock gap with `gap-2`, its stock padding with `p-2`, its small text size with `text-body`, and `ring-1 ring-foreground/10` with `border border-muted-foreground`. Corner, fill and shadow stay.
- `calendar.tsx`:
  - Change the default `buttonVariant = "ghost"` to `buttonVariant = "outline"`: the two arrows are outline buttons, since the theme has no ghost button.
  - On the root, replace `p-2` with `p-0` (the popover has the padding) and `[--cell-size:--spacing(7)]` with `[--cell-size:--spacing(10)]`. A cell is 40px, the height of an `Input`, a step off the spacing scale on purpose: the arrows, the two selects and the days are then one height, and the selects have room between the arrows. `[--cell-radius:var(--radius-md)]`, 6px, stays.
  - In `classNames`: in `month`, replace the stock gap with `gap-3`. In `dropdowns`, replace the stock gap, the small text size and `font-medium` with `relative z-10 gap-2 px-2`; without `relative z-10` the row of arrows, which lies across the caption, takes the selects' clicks. In `weekdays`, add `gap-1`. In `weekday`, replace the arbitrary text size and `font-normal` with `font-mono text-label uppercase`, the theme's label. In `week`, replace the top margin with `mt-1` and add `gap-1`: one 4px gutter across and down, where the focus outline fits. In `today`, delete every class but `text-foreground`: today is marked on its button, below.
  - In `components`, give the three chevrons `strokeLinecap="square"` and add `Dropdown: CalendarDropdown`, a function in the same file that takes the library's `DropdownProps` (`options`, `value`, `onChange`, `disabled`, `aria-label`) and returns the theme's `Select`: `items` are the options with `value` as a string, `value` is `String(value)`, and `onValueChange` ignores `null` and calls `onChange?.({ target: { value: next } } as React.ChangeEvent<HTMLSelectElement>)`, which is all the library reads. Its `SelectTrigger` gets the `aria-label` and `className="font-heading font-bold uppercase"`, so that month and year read as the calendar's heading; its `SelectContent` gets `className="max-h-64"` and one `SelectItem` per option, with the option's `disabled`. The stock `dropdown_root`, `dropdown` and `caption_label` classes then style nothing; leave them.
  - `CalendarDayButton`: its `variant="ghost"` stays, since the classes below replace its look. In its classes, delete `border-0` and the three `group-data-[focused=true]/day:` classes that set a border color and a ring (the two that set `relative` and `z-10` stay; the outline `button.tsx` already has is the focus mark); replace `font-normal` with `font-heading text-body font-bold tabular-nums`, a day set like a figure; add `hover:border-foreground hover:bg-transparent group-data-[today=true]/day:underline group-data-[today=true]/day:decoration-2 group-data-[today=true]/day:underline-offset-4`; replace `data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground` with `data-[selected-single=true]:bg-secondary data-[selected-single=true]:text-secondary-foreground`; replace `dark:hover:text-foreground` with `dark:hover:bg-transparent dark:data-[selected-single=true]:hover:bg-secondary dark:data-[selected-single=true]:hover:text-secondary-foreground`, which are the rules' closing classes for the chosen day with `secondary` in place of `primary`; and in `[&>span]:`, replace the extra-small text size with `text-label`. The chosen day is then filled like the chosen button of a group, navy or ice blue, never amber; a day under the pointer gets a 1px edge in the text color and no fill, because an ice fill could not be told from the chosen day in dark mode; today has the thick underline of the current page's nav link, a mark that stays when it is hovered or chosen; days outside the month are muted.
- The field, in page code, is a `Popover` whose open state is page state:
  - `PopoverTrigger` is the field: `id`, a `ref`, and `flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-muted-foreground bg-card px-3 text-left text-body text-foreground transition-colors outline-none focus-visible:border-ring aria-invalid:border-destructive` with the outline classes of the Focus rule. It holds a `<span>` with an `id` of its own and, at the right, the `Calendar` icon of the icon set as the Icons note sets it, in `text-muted-foreground`. With no date the `<span>` holds "Choose a date" in a `<span>` with `text-muted-foreground`; with one, a `<time>` with the `dateTime` and the date written as in a sentence, without the weekday: `14 March 1990`.
  - The trigger is named by `aria-labelledby` with two ids, the visible label's and the value `<span>`'s ("Date of birth, 14 March 1990"); the label is the field's `<label>` with an `id` and `htmlFor`. `aria-invalid` and `aria-describedby` go on the trigger, and the form moves focus to it like any field.
  - `PopoverContent` gets `align="start"`, `className="w-auto"` and an `initialFocus` function that returns the day button with `tabindex="0"` inside the calendar (the chosen day, or today): left alone, focus goes to the first arrow. To find it, wrap the `Calendar` in a plain `<div>` with a `ref` and no classes, and return `ref.current?.querySelector<HTMLElement>('button[tabindex="0"]') ?? true`.
  - The calendar: `<Calendar mode="single" required captionLayout="dropdown" weekStartsOn={1} today={…} startMonth={…} endMonth={…} selected={…} defaultMonth={…} onSelect={…} />`. `today` is 8 June 2027, never the device clock; `startMonth` is January 1927 and `endMonth` June 2027; `defaultMonth` is the chosen date, or today. `onSelect` stores the date, removes the field's error and closes the popover; focus goes back to the trigger by itself. Choosing a month or a year keeps the popover open. Give the calendar no `disabled` days: a date after today can be picked, and the check on submit catches it.

Second, the consent: a stack with `gap-2` holding a checkbox row as the Radios and checkboxes note sets it, with the sentence "I agree to the club's code of conduct, and to the club keeping these details for the 2027 season.", and its error line when there is one. The checkbox starts clear.

Third, a row with `flex flex-wrap items-center gap-3 border-t border-border pt-5`: the default (amber) button "Join the club" with `type="submit"`, and a `<p>` of small print: "You pay at your first session. Nothing is charged here."

**What happens next,** four columns from `lg` up: an ice panel with `lg:self-start`, so that it is only as tall as its content, an `<aside>` named by its `<h2>` "What happens next" in `text-h2`. Then an `<ol>` with `role="list"` and `flex flex-col gap-3` of three steps, each `flex items-baseline gap-3`: its number, `1` to `3`, a figure in `text-h2` with `w-5 shrink-0`, and a sentence in `text-body`:

1. "We email your membership number and a welcome from the club."
2. "You come to your first session at Millrace Park and pay the season's fee there."
3. "Players are registered with the league within a week, and can then be picked."

Then a `<p>` in `text-body`: "Questions? Call the club secretary, Marian Osei, on 01632 960 277." The number is plain text, not a link: nothing on an ice panel takes focus, and nothing on it has a text color class.

### 4. The confirmation

Rendered inside the confirmation element only after a good submit, when the `<form>` is gone: a card, with nothing above it in the plain `<div>`. In it:

- An `<h2>` "Welcome to Wendmoor FC", with `tabIndex={-1}` and the `focus:` outline from the rules.
- A `<p>` in `text-body`: "Thank you, Priya. Your Playing membership for the 2027 season is ready.", with the first word of the name as typed and the membership as chosen.
- A `<dl>` as the Description lists note sets it on a card, `w-full max-w-md`, with four rows: "Membership number", `WFC-27-0141`; "Membership", the kind chosen; "Fee for the season", `£95`, `£45` or `£30`; and the last row by the kind: for Playing, "First session", "Thursday 10 June, 19:00"; for Junior, "First session", "Thursday 10 June, 17:30"; for Social, "Next home match", "Saturday 19 June, 15:00".
- A `<p>` in `text-body`: "We have sent the details to" with the email address as typed, then a full stop. Then a second sentence: "This is a demo: nothing was sent or stored."
- A link styled as a `secondary` button, "See the fixtures", to `/fixtures`, at its own width (`self-start`).

### Behavior

- Choosing a radio card changes the membership; the arrow keys move between the three. Focus stays on the radio.
- "Join the club" checks every field in code, in the order below, and moves focus to the first one with an error once the error lines are rendered. Each error, with its text:
  - Full name empty: "Enter your full name."
  - Email empty: "Enter your email address." Anything that does not match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`: "Enter an email address such as name@example.com."
  - Date of birth empty: "Enter your date of birth." Later than 8 June 2027, or earlier than 1 January 1927: "Enter a date of birth from 1927 to today." With Playing chosen and a birthday after 8 June 2009, so under 18 today: "Playing membership is for adults. Choose Junior membership, or check the date." With Junior chosen and a birthday on or before 8 June 2009: "Junior membership is for under 18s. Choose Playing or Social membership, or check the date." Social takes any age.
  - Emergency contact empty: "Enter the name of someone we can call."
  - Emergency contact's phone: with spaces removed, anything but 10 to 15 digits with an optional `+` in front: "Enter a phone number of 10 to 15 digits."
  - Consent not ticked: "Tick the box to agree to the code of conduct." The checkbox gets `aria-invalid` and names the line, and focus can move to it like any field.
- The error under the date of birth is also removed when the membership changes, since it may no longer hold.
- With no errors, the form is removed with its cards and its panel, the confirmation fills the status element, and focus moves to its `<h2>`, so that the message is not read twice.
- The links need no behavior beyond their `href`.
