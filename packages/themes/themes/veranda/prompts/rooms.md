---
page: guesthouse rooms page
title: Rooms
description: the rooms page of a small guesthouse, with all six rooms as rows whose drawn pictures alternate sides, a control that shows the rooms for one, two or more guests, and a block of clay that says what every room includes.
order: 2
checks:
  - "All six rooms are rows of one list, each with a drawn plate, the room's name in the heading font, a label line of three facts, a price per night and one link whose words name the room."
  - "From `md` up the plate stands on the left in the first, third and fifth row shown and on the right in the others, with one empty column between plate and text; on a phone the plate always comes first."
  - "Choosing One guest, Two guests or Three or more leaves only the rooms that sleep that many, the chosen button has `aria-pressed` set to true, and a status line says in words how many rooms are shown."
  - "The block that says what every room includes is the page's only `bg-clay` element, all its text is ink in both modes, and it holds no link or button; Request a room, the page's one default (slate) button, stands on the paper beside it."
  - "The `<h1>` has one phrase in italics and no heading is bold; Breakfast included is the page's one badge, and nothing on the page is a pill or a circle."
---

Sample content, if the user gave none: the six rooms of **Kittiwake House**, the invented guesthouse described in the layout notes, at 9 Harbour Terrace, Port Lowan. Use the rooms, their facts and their prices exactly as the notes' list gives them, in that order, from the ground floor up. Each room also has one sentence, given below. Every name is invented.

Build these parts in order. This page needs `npx shadcn@latest add badge`, and it has a button group, so it makes the `outline` edit in `button.tsx` that the Buttons note describes.

### 1. Header

The header from the layout notes, with "Rooms" as the current page.

### 2. Opening

The first section, with `pt-12`, in columns 1–8 of a grid (`grid gap-6 md:grid-cols-12`, the `<div>` with `md:col-span-8`):

- A label line with the page's one badge beside it, in the row the Badges note gives: the label `Six rooms · From £78 a night` in `text-muted-foreground`, then the badge "Breakfast included".
- With `mt-2`, the `<h1>` in `text-h1 lg:text-display`: "Six rooms, no two alike", with the words "no two alike" in a `<span className="italic">`. This is the page's only italic.
- With `mt-4`, a `<p>` in `text-body`: "A price is for the room for one night, with breakfast for everyone in it. You can arrive from 15:00 and stay until 10:30 on the day you leave.", with each time in a `<time>`.

### 3. The rooms

A section with the hairline from the layout notes. Its heading is an `<h2>` with `sr-only`, "The rooms", which the section's `aria-labelledby` names; it comes first and takes no space.

**The control.** A `<div>` with `flex flex-wrap items-center justify-between gap-x-6 gap-y-4` and no top margin (it is the first thing seen under the hairline), holding:

- A button group from the layout notes with the `aria-label` "Show rooms for" and four buttons: "All rooms", "One guest", "Two guests", "Three or more". "All rooms" is chosen when the page opens.
- A `<p>` with `role="status"`, a label in `text-foreground`, saying how many rooms are shown: `Showing all 6 rooms`, `Showing 1 room for one guest`, `Showing 3 rooms for two guests` or `Showing 2 rooms for three or more guests`. Unlike the confirmations in the layout notes, it holds its first text from the start: it is a count that changes, not a message that replaces a form.

Under that row, with `mt-4`, a `<p>` of helper text in `font-mono text-label text-muted-foreground`, a sentence, not uppercased: "A guest travelling alone is welcome in any room for two, at the room's price."

**The list.** With `mt-12`, a `<ul>` with no markers and no padding, and `divide-y divide-border`, so a hairline falls between rooms and none above the first or below the last. Each `<li>` is a room row: `grid gap-6 py-12 first:pt-0 last:pb-0 md:grid-cols-12 md:items-center` (here `md:items-center` takes the place of the notes' `md:items-start`). A row has two items, the plate first in the code, then the text:

- **The plate**, with no caption, `aspect-4/3`, the plate itself the grid item.
- **The text**, a `<div>` in block flow:
  - A label in `text-muted-foreground`, the room's floor: `First floor`.
  - With `mt-2`, the room's name as an `<h3>` in `text-h2 md:text-h1` (larger than the notes' `<h3>`, because here the name stands beside a plate of seven columns).
  - With `mt-4`, the room's one sentence in `text-body`.
  - With `mt-4`, a `<p>` label in `text-foreground`, the room's three facts: how many it sleeps, its bed and its view, `Sleeps 2 · King bed · Sea view`.
  - With `mt-2`, a `<p>` label in `text-muted-foreground` with `tabular-nums`, the price per night: `From £128 a night`.
  - With `mt-6`, an onward link from the layout notes whose words name the room: "See Marram".

From `md` up the sides alternate, by the row's place in the list as it is shown, so they still alternate when the control hides some rooms:

- In the first, third and fifth row shown, the plate is in columns 1–7 (`md:col-span-7`) and the text in columns 9–12 (`md:col-span-4 md:col-start-9`).
- In the second, fourth and sixth, the text is in columns 1–4 (`md:col-span-4 md:col-start-1 md:row-start-1`) and the plate in columns 6–12 (`md:col-span-7 md:col-start-6 md:row-start-1`). Both need `md:row-start-1`, because the plate comes first in the code.

The six rooms, in this order. The plate's shapes belong to the room, not to its place in the list:

1. Thrift. `Ground floor`. "On the garden side, with a door of its own to the walled garden and no stairs to climb." `Sleeps 2 · Double bed · Garden view`, `From £104 a night`, "See Thrift" to `#`. Plate: the window at `right-1/6`, the ground `h-1/2`; `aria-label` "Thrift on the ground floor, its door open to the walled garden".
2. Campion. `First floor`. "The smallest room, with a writing desk at the window and the garden below." `Sleeps 1 · Single bed · Garden view`, `From £78 a night`, "See Campion" to `#`. Plate: the window at `left-1/6`; `aria-label` "Campion, a single bed and a desk at a tall window".
3. Samphire. `First floor`. "Two beds under a tall window that looks along the quay." `Sleeps 2 · Twin beds · Harbour view`, `From £112 a night`, "See Samphire" to `#`. Plate: the window at `right-1/6`, the ground `h-1/4`; `aria-label` "Samphire, twin beds under a window that looks along the quay".
4. Marram. `First floor`. "The bay window at the front of the house, with the sea in all three panes." `Sleeps 2 · King bed · Sea view`, `From £128 a night`, "See Marram" to `/rooms/marram`. Plate: the window at `left-1/6`; `aria-label` "The bay window of Marram, with the bed facing the sea".
5. Sea Holly. `Second floor`. "Up under the roof, with a daybed in the dormer for a third guest or an afternoon." `Sleeps 3 · King bed and a daybed · Sea view`, `From £142 a night`, "See Sea Holly" to `#`. Plate: the window at `right-1/6`; `aria-label` "Sea Holly under the roof, a daybed in the dormer window".
6. Tamarisk. `Second floor`. "Two rooms joined by a short landing, for a family or for four friends." `Sleeps 4 · King bed and two singles · Harbour view`, `From £164 a night`, "See Tamarisk" to `#`. Plate: the window at `left-1/6`, the ground `h-1/4`; `aria-label` "Tamarisk under the eaves, two rooms joined by a short landing".

### 4. In every room

A section that holds nothing but the clay block and its action, so it has `mt-12 md:mt-26` and no hairline, as the Sections note says. Its `aria-labelledby` names the block's heading. It is a grid (`grid gap-6 md:grid-cols-12 md:items-end`; here `md:items-end` takes the place of `md:items-start`, so the action lines up with the foot of the block):

- In columns 1–7 (`md:col-span-7`): the page's clay block, holding:
  - A label with no text color class, so it takes the block's ink: `Included in every price`.
  - With `mt-2`, an `<h2>`: "In every room".
  - With `mt-6`, a `<ul>` with no markers and no padding, `grid gap-x-6 gap-y-2 md:grid-cols-2`, of six items. Each `<li>` is `flex items-start gap-2` in `text-body`: the `Check` icon with `mt-1 shrink-0`, then the words. The items: "Breakfast on the veranda", "Linen sheets and wool blankets", "A kettle, loose tea and fresh milk", "Wifi through the house", "Free parking at the quay", "A key of your own, to come and go as you like".
- In columns 9–12 (`md:col-span-4 md:col-start-9`), on the paper: a `<div>` holding a label in `text-muted-foreground`, `No payment now`; with `mt-2` a `<p>` in `text-body`, "Send a request and we reply within a day."; and with `mt-6` a `<p>` holding the page's one default button, an `<a>` styled as a button: "Request a room", to `/reserve`.

On a phone the block comes first and the action under it.

### 5. Footer

The footer from the layout notes.

### Behavior

- Keep the chosen button in component state. "All rooms" shows all six. "One guest" shows the rooms that sleep 1 (Campion); "Two guests" the rooms that sleep 2 (Thrift, Samphire, Marram); "Three or more" the rooms that sleep 3 or 4 (Sea Holly, Tamarisk). The rooms keep their order.
- Hidden rooms are not rendered, so the hairlines between rows and the `first:` and `last:` paddings stay right, and the sides alternate from the first row shown.
- The status line updates with each choice. Choosing a button moves no focus: it stays on the button.
- In the sample every choice shows at least one room. With the user's own rooms, a choice that shows none puts, in place of the list and with `mt-12`, one line in `text-body`: "No room sleeps that many. Write to us and we will see what we can do."
- The control changes only what is shown; it does not change the address of the page.
- The other links need no behavior.
