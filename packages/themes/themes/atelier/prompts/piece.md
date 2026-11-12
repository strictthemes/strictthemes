---
page: product page
title: Piece
description: the page for one garment, with large pictures, its name and price, a size choice, details and materials, care, and a request form that opens on the page.
order: 3
checks:
  - The size choice is a group of buttons with one `aria-pressed="true"` at most, and the chosen size is also written out in words above the group.
  - The price is in the mono font with tabular figures, and the details and materials are a `<dl>`.
  - The button "Request this piece" has `aria-expanded` and `aria-controls`, and the form it opens is hidden with the `hidden` attribute while closed.
  - Sending the form with no size, no name or a malformed email shows a message in words with an icon for each, and moves focus to the first one; a good request is replaced by a confirmation that a screen reader announces and that names the size.
---

Sample house, if the user gave none: **Maison Ardelle**, a small fashion house in Lyon founded in 2014 by Inès Ardelle. This page is for the **Lune wrap coat** from Autumn–Winter 2026, *Still Water*: a long wrap coat without buttons, in undyed wool woven in Biella, half-lined in cupro, tied with a belt of the same cloth. €1,480. Sizes 34, 36, 38, 40 and 42. Each coat is cut to order in the Lyon atelier and is ready about four weeks after a request. The house answers requests by email within two working days. The coat in the pictures is worn by Marit Ekwall, who is 178 cm tall and wears size 36.

Build these parts in order.

### 1. Header

The header from the layout notes. None of the links is the current page.

### 2. The piece

The first section, in the grid. It has two columns from `md` up: the pictures in columns 1–7 (`md:col-span-7`) and the information in columns 9–12 (`md:col-start-9 md:col-span-4`). Below `md` the information comes under the pictures with `mt-16`, and `md:mt-0` from `md` up.

**Pictures** (a `<div>` holding three figures, each with its caption below):

- The front: `aspect-3/4`, the full width of the column. Caption lines: `Front`, then `Worn by Marit Ekwall · 178 cm · Size 36`, with `cm` in a `<span>` with `normal-case` as the Labels note says. (In the `<dl>` below, `cm` is in body text, which is not uppercased: no span there.)
- With `mt-8`, a row of two figures, `grid grid-cols-2 gap-x-8`, which holds at 375px too: the back (`aspect-2/3`) and a detail of the cloth and the tie (`aspect-2/3`, `bg-card`). Captions: `Back` (one line), and `Detail`, then `Undyed wool`.

Each picture's `aria-label` describes the photograph in one sentence.

**Information** (a `<div>`, in this order):

- A label line in `text-muted-foreground`: `Look 03 · Autumn–Winter 2026`, where "Autumn–Winter 2026" is a link to the collection page, styled as a link in a caption.
- With `mt-4`, the `<h1>` in `text-h1`: "Lune *wrap* coat", with the one italic word in an `<em>`. The page's only italic.
- With `mt-4`, a row with `flex flex-wrap items-center gap-4`: the price, `€1,480`, in `font-mono text-body tabular-nums` (the mono font that `DESIGN.md` gives prices, at body size as the Figures note allows), and the page's one badge, "Made to order" (`npx shadcn@latest add badge`).
- With `mt-8`, one or two sentences in `text-body` about the coat: how it is cut and how it is worn.
- With `mt-8`, the size choice. First a label line with `flex items-baseline justify-between gap-4`: "Size" as a label in `text-foreground`, a `<span>` (not a `<label>`: it names a group, not a field) with the `id` the group's `aria-labelledby` names, and at the right end, in `text-muted-foreground`, the choice in words: `No size chosen` until one is, then `Chosen · 38`. Then with `mt-2` the button group from the layout notes, one button per size, holding the number. Below it, with `mt-2`, the error line when the form is sent without a size.
- With `mt-8`, the default button "Request this piece", full width, with `w-full whitespace-normal text-center` added: at 768px its column is too narrow for the label on one line, so it wraps and the button grows. It has `aria-expanded` and `aria-controls` naming the request area.
- The request area, with `mt-8` (see Behavior).
- With `mt-16`, a label heading "Details", an `<h2>`, and with `mt-4` a `<dl>` as the layout notes describe it, with five rows: Cloth (`Undyed wool, woven in Biella`), Lining (`Cupro, half-lined`), Length (`118 cm in size 38`), Fit (`Cut loose; take your usual size`), Made in (`Lyon, in our atelier`).
- With `mt-16`, a label heading "Care", an `<h2>`, and with `mt-4` a `<ul>` with `list-disc pl-4` of three lines in `text-body`, `mt-2` between items: dry clean only, brush after wearing, store on a wide hanger.
- With `mt-8`, one sentence in `text-body` with a link in running text to the house page: who cuts the coats and where.

### 3. Footer

The footer from the layout notes.

### On a phone

The pictures stack above the information. The front picture takes the full width; the back and the detail stay side by side. The size buttons wrap onto a second line if they need to. The `<dl>` keeps its term and value side by side.

### Behavior

- **Choosing a size:** a click on a size makes it the chosen one (`aria-pressed="true"`, the chosen look from the layout notes) and the others not. Clicking the chosen size again leaves it chosen. The label line changes to `Chosen · 38`. If the size error is showing, it goes away.
- **Opening the request:** "Request this piece" toggles the request area, which has the `id` that `aria-controls` names and carries the `hidden` attribute while closed. The button's text stays the same and its `aria-expanded` follows the state. Focus stays on the button.
- **The request area** is one wrapper holding the form and the empty `role="status"` element, as the layout notes describe. Here the area's `hidden` attribute hides the empty status element too while closed, unlike the Confirmations note: nothing can be sent then. The form is `bg-card p-8` with `noValidate`. Inside it a label line in `text-muted-foreground` repeating the chosen size (`Lune wrap coat · Size 38`, or `Lune wrap coat · No size chosen`), then the fields with `mt-8` between them (`npx shadcn@latest add input textarea`): "Your name" (`Input`), "Email address" (`Input` of type `email`), "Note (optional)" (`Textarea` with `min-h-32`, for questions about fit or length). Then with `mt-8` the default button "Send request", `type="submit"`, also with `w-full whitespace-normal text-center`, for the same reason. This is the second default button on screen while the form is open, which is fine on this page.
- **Sending:** check, in this order, that a size is chosen, that the name is not empty, and that the email has the form `name@domain.tld`. Each failure shows its own error line: under the size group "Choose a size above.", which every size button names with `aria-describedby` while it shows, so the button that gets focus reads it (a button takes no `aria-invalid`), "Write your name." and "Write an email address such as name@example.com." Focus moves to the first failure: for the size, the first size button.
- **Confirmation:** when all is good, the form is replaced by the message in the status element: an `<h2>` in `text-h2`, "Request received", with `tabIndex={-1}` and focus moved to it, then with `mt-4` a sentence in `text-body` that names the size and the email address as written: "We will write to ines@example.com within two working days about the Lune wrap coat in size 38." The size buttons and "Request this piece" stay as they are. The button still opens and closes the area; once the request is received the area holds only the confirmation, so closing hides it and opening shows it again, never the form.
- Nothing is sent anywhere: the confirmation is shown in the page.
