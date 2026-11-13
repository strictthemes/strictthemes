---
page: wedding gift list
title: Gifts
description: the gift list of a summer wedding, with a short note, a grid of gifts with drawn pictures, prices and a way to reserve each one, and a shared contribution toward one larger gift with a meter and a form.
order: 3
checks:
  - "Each gift card opens with a picture drawn from plain elements with role img and an aria-label, no image file is loaded, and no drawn shape has a border."
  - "Every price is a mono label in whole pounds, and the two gifts reserved by other guests carry a sky-blue Reserved badge with ink text and no button."
  - "The Reserve this gift buttons are lilac secondary buttons, each with an aria-label that names its gift, and Add my share is the only plum (default) button on the page."
  - "Reserving a gift adds its Reserved badge and turns its button into Cancel my reservation without moving focus, and the count of free gifts in its status line follows."
  - "The meter sits on the mist block and is drawn in its plum ink in both modes, the amount and the percentage beside it say the same in words, and a good share updates all three."
  - "The opening block element carries bg-candy text-candy-foreground and the bicycles block element bg-mist text-mist-foreground, so their text stays plum ink in dark mode, and nothing inside them has a text color class of its own."
---

Sample content, if the user gave none: the gift list of Clem Ashdown and Rafe Linnell, who marry on Saturday 17 July 2027 at Quillbrook Barn, Little Saltry, and are setting up their first home in the village. Six things for the house, two of them already reserved by other guests, and one bigger gift that guests share: two bicycles with baskets, £900 in all, of which 14 guests have given £540 so far. Write any other copy yourself, warm and plain.

The six gifts, in this order:

1. Linen tablecloth, £85: "Long enough for the table Rafe is building: eight places, and room for the jam." Free.
2. Four stoneware bowls, £60: "Deep enough for soup, wide enough for pasta." Reserved.
3. A picnic hamper for two, £120: "For Sunday afternoons on the hill behind the village." Free.
4. Six tumblers, £48: "Thick glass that survives the dishwasher and the garden." Reserved.
5. A bookshelf for the hall, £210: "Oak, five shelves, and room at last for Clem's cookbooks." Free.
6. A window box of herbs, £40: "For the kitchen sill: thyme, mint, sage and chives." Free.

Build these parts in order.

### 1. Header

The header from the layout notes, with "Gifts" as the current page; its link keeps `/gifts`.

### 2. Opening

A full-width section that is a pastel block in candy, as the layout notes describe it, with its `aria-labelledby` pointing at the `<h1>`. The `<section>` is the block element, and it carries `bg-candy text-candy-foreground`, the pair from the first layout note, so its text stays plum in dark mode; nothing inside it gets a text color class of its own. It holds one `flex flex-col gap-3`: a `flex flex-col gap-2` with a label, `Gift list · Saturday 17 July 2027 · Little Saltry` (the date a `<time dateTime="2027-07-17">`), and the `<h1>` "A few things for our home" in `text-h1 md:text-display`; then one paragraph in `text-body` with `max-w-xl`: "Coming is the gift. If you would like to bring something too, here are a few things for our first home in Little Saltry. Reserve one, and it shows as taken for everyone else."

### 3. Things for the house

A full-width section, with its `aria-labelledby` pointing at the `<h2>`. It opens with a `flex flex-col gap-2` holding the `<h2>` "Things for the house" and, under it, a `<p>` with `role="status"` as a small figure: `4 of 6 gifts still free`. Unlike the confirmations in the layout notes, it holds its text from the start: it is a count that changes, not a message that replaces a form. With every gift taken it reads `0 of 6 gifts still free`.

Then, in the section's `gap-6`, the six gifts as a grid of cards from the layout notes, each card `md:col-span-6 lg:col-span-4`: two to a row from `md`, three from `lg`, one below `md`. Add the badge with `npx shadcn@latest add badge` if the project has none. Each card is a `<li>` of a `<ul>` that carries the grid classes, and is a card with a picture, as the layout notes describe it:

- **The picture,** `flex aspect-3/2 items-center justify-center bg-muted`, with `role="img"` and the `aria-label` given below. Inside it one drawing, built with exactly these classes:
  1. Tablecloth, "A table laid with a pink linen cloth": a `flex flex-col items-center` holding the cloth, `h-16 w-40 rounded-sm bg-blush`, and under it a `flex w-36 justify-between` with two table legs, each `h-10 w-2 bg-secondary`.
  2. Bowls, "A stack of four pale blue bowls": a `flex flex-col items-center gap-1` holding four bowls, each `h-6 rounded-sm bg-mist`, from the top `w-20`, `w-24`, `w-28`, `w-32`.
  3. Hamper, "A pink picnic hamper with a handle": a `flex flex-col items-center gap-1` holding the handle, `h-2 w-16 bg-secondary`, and the basket, `h-16 w-32 rounded-md bg-candy`.
  4. Tumblers, "Six pale blue tumblers in a row": a `flex items-end gap-2` holding six tumblers, each `h-12 w-6 rounded-sm bg-mist`.
  5. Bookshelf, "Five pink books standing on a shelf": a `flex flex-col items-center` holding a `flex items-end gap-1` of five books, each `w-4 bg-blush`, with the heights `h-16`, `h-12`, `h-14`, `h-10`, `h-16`, and under them the shelf, `h-2 w-36 bg-secondary`.
  6. Window box, "A pink window box with five herbs growing in it": a `flex flex-col items-center gap-1` holding a `flex items-end gap-2` of five herbs, each `w-4 bg-secondary`, with the heights `h-8`, `h-12`, `h-10`, `h-12`, `h-8`, and under them the box, `h-8 w-36 rounded-sm bg-candy`.

  The shapes have no border, no shadow and no other classes; the ones under 24px across have square corners, as the Pictures note says.
- **The text,** in the card's `<div>` with `flex flex-1 flex-col gap-3 p-6`: the gift's name as an `<h3>` in `text-h2`; its sentence in `text-body`; a row, `flex flex-wrap items-center gap-3`, with the price as a label in `text-foreground` with `tabular-nums` (`£85`) and, for a reserved gift, the badge from the layout notes, "Reserved"; and last, with `mt-auto`, the action, so the actions of a row line up:
  - A free gift: a `Button` with `variant="secondary"` and `w-full`, "Reserve this gift", with the `aria-label` "Reserve this gift: Linen tablecloth" (the visible words, a colon and the gift's name). These are not the page's main action: there are four of them on screen, so they are lilac.
  - A gift reserved by another guest: no button. In its place a `<p>` with `mt-auto flex h-11 items-center font-mono text-label text-muted-foreground`: "Another guest has this one".

### 4. One bigger gift

A section of parts side by side, from the layout notes, with its `aria-labelledby` pointing at the `<h2>` in the block.

**First part,** `md:col-span-7`: a pastel block in mist, as the layout notes describe it. The block element itself carries `bg-mist text-mist-foreground`, the pair from the first layout note, so its text stays plum in dark mode; nothing inside it gets a text color class of its own. In the block's `gap-6`, two groups:

- A `flex flex-col gap-3` holding a `flex flex-col gap-2` with a label, `One bigger gift`, and the `<h2>` "Two bicycles for the lanes"; then one paragraph in `text-body` with `max-w-xl`: "We would like to ride the lanes around Little Saltry on two bicycles with baskets. Any share helps, and every pound goes to the bicycles."
- A `flex flex-col gap-3` holding the figure's row, `flex flex-wrap items-baseline gap-2`, with the amount given so far as a `<p>` in `font-heading text-h1 tabular-nums`, `£540`, and beside it a label, `of £900`; then the meter from the layout notes, in the mist block's ink (`border-mist-foreground` on the track, `bg-mist-foreground` on the fill), its fill at 60%; then a label: `14 guests so far · 60%`. At one guest it reads `1 guest so far`.

**Second part,** `md:col-span-5`: the form card, as the Forms note describes it. Here, instead of a heading above the card, the block's `<h2>` heads the section, and the card is the part itself. Add the field with `npx shadcn@latest add input` if the project has none. The `<form>` has the `aria-label` "Add to the bicycles". Its fields, each in its own `flex flex-col gap-2`:

1. **Name**: the label "Your name", an `Input` with `autoComplete="name"`.
2. **Email**: the label "Email address", an `Input` of type `email` with `autoComplete="email"`, and the helper text `We write once, with how to send your share.`
3. **Amount**: the label "Your share in pounds", an `Input` of type `text` with `inputMode="numeric"` and `autoComplete="off"`, and the helper text `From £5 to £360, what is still needed`. The `£360` is the amount still needed, read from state.

The last item of the form is the page's one main action: the default `Button`, `type="submit"`, "Add my share". After the form, in the card, the empty `role="status"` element.

### 5. Something else in mind?

A section in the centered column from the layout notes, with an `<h2>` "Something else in mind?" and, in the column's `gap-6`, one paragraph in `text-body`: "Anything handmade, grown or written makes us just as happy. There is a table for cards and parcels by the barn door."

### 6. Footer

The footer from the layout notes.

### Behavior

- Keep the gifts in component state, each with its name, price and state: free, reserved by another guest, or reserved by you. The count in the status line reads from the same state.
- Clicking "Reserve this gift" reserves that gift for you: its card shows the "Reserved" badge beside the price, and the same `Button` element (do not render a new one) now reads "Cancel my reservation", with the `aria-label` "Cancel my reservation: Linen tablecloth", still `variant="secondary"`. Focus stays on it. Clicking it again gives the gift back: the badge goes and the button reads "Reserve this gift" again. The count follows each click: `3 of 6 gifts still free`. The two gifts reserved by other guests cannot be changed.
- Keep the amount given (starting at £540) and the number of guests (starting at 14) in state. The amount still needed is £900 minus the amount given. The percentage is the amount given over £900, rounded to a whole number.
- When the form is sent, check it in code:
  - Name: empty, or only spaces, gives "Write your name, so we know who to thank."
  - Email: empty gives "Write your email address."; a malformed one gives "Check the email address: it needs an @ and a domain."
  - Amount: trim it, take off one `£` in front and trim again, so `£ 50` is 50; leading zeros are fine (`050` is 50). Empty gives "Write an amount in pounds."; anything but a whole number gives "Write a whole number of pounds, like 50."; under 5 gives "The smallest share is £5."; more than what is still needed gives "We only need £360 more. Write £360 or less.", with the amount still needed.
- Each error line follows the layout notes, which say when it shows, when it goes and how focus reaches it.
- When everything is good, add the share to the amount given and one to the number of guests, so the block reads, after £50, `£590`, `15 guests so far · 66%` and a fill at 66%. The form is replaced in its card by the confirmation in the status element: an `<h3>` in `text-h2`, "Thank you, Dev Raman" (the name as typed, trimmed), with `tabIndex={-1}`, and one sentence: "We have noted £50 toward the bicycles, and we will write to dev@example.com with how to send it.", with the amount and the address they typed. The heading and the sentence sit in the message `<div>`; no button follows. Move focus to the heading. The block is not a live region: the confirmation says the amount.
- The other links need no behavior.
