---
page: product page
title: Product
description: one piece from a small ceramics studio's shop, with pictures, its price, a choice of glaze, a quantity, an add-to-basket button with a confirmation, its details, care notes and related pieces.
order: 3
checks:
  - Choosing a glaze changes the pictures' text alternatives, the stock line and the glaze in the details, and the chosen button has `aria-pressed="true"`.
  - The quantity cannot go below 1 or above what is in stock (for Slate, the order limit of 4), and a minus or plus button disabled at its limit keeps keyboard focus.
  - The "Add to basket" button is the page's only terracotta button; pressing it raises the count on the header's basket link and shows a confirmation that a screen reader announces.
  - The details are a description list (`<dl>`), and the price, the quantity and every measurement are in mono figures.
---

Sample content, if the user gave none: "Whitlow Pottery", a stoneware studio of two potters, Nell Varga and Tomas Reid, in Bramwick. This page sells the Fold bowl, £34.00: a low bowl for soup, noodles or fruit, 16 cm across and 6 cm high, holding 550 ml, 420 g, thrown in buff stoneware with an unglazed, sanded foot. It comes in three glazes: Iron (dark brown), 6 in stock; Ash (pale grey-white), 2 in stock; and Slate (dark blue-grey), made to order and posted in about three weeks, at most 4 to an order. The price is the same in every glaze. This batch was fired on 6 November 2026.

Build these parts in order.

### 1. Header

The header from the layout notes. No link is the current page. The basket holds 3 pieces to start.

### 2. The piece

The first section of `<main>`, with the `aria-label` "Fold bowl". It opens with a breadcrumb, and under it with `mt-6` a 12-column grid with `md:items-start` holding two columns.

**Breadcrumb.** A `<nav>` with the `aria-label` "Breadcrumb" holding an `<ol>` in one row, `flex flex-wrap gap-2 font-mono text-label text-muted-foreground`: a link "Shop" to `/`, a `/`, a link "Tableware" to `/tableware`, a `/` and "Fold bowl" with `aria-current="page"`. The links are styled as header links and so are `text-foreground`; each `/` has `aria-hidden="true"`, and the slashes and "Fold bowl" stay muted.

**Pictures**, columns 1–7. A large picture and, with `mt-4`, two smaller ones side by side, `grid grid-cols-2 gap-4`. Each is a `<figure>` as the Pictures note says; the picture element inside it carries `rounded-xl border bg-muted` and the aspect ratio, `aspect-square` for the large one and `aspect-4/5` for the small ones. They show the bowl from the side (`h-1/4 w-3/5`), from above (`aspect-square w-3/5`, a square like every drawn piece: the theme allows no round shape this large) and its foot (`h-1/4 w-2/5`), in the chosen glaze as the Pictures note says: `bg-glaze-dark` for Iron and Slate, `bg-glaze-pale` for Ash. Each `aria-label` names the view and the glaze: "Fold bowl in iron glaze, seen from the side", "Fold bowl in iron glaze, seen from above", "The foot of the Fold bowl in iron glaze", and each caption says the view in words: "From the side", "From above", "The unglazed foot".

**Buying**, columns 8–12 (`md:col-span-5 md:col-start-8`). Below `md` this column comes under the pictures with `mt-10 md:mt-0`. In order:

- The `<h1>` in `text-h1`: "Fold bowl".
- With `mt-2` a label in `text-muted-foreground`: "Stoneware · 16 cm across".
- With `mt-4` the price, `£34.00`, as the Prices note says for the one large price.
- With `mt-4` one paragraph of two sentences about the bowl.
- With `mt-6` the glaze: a visible label "Glaze" (a `<p>`), then with `mt-2` a button group named by it, with Iron, Ash and Slate. Iron is chosen to start.
- With `mt-4` the stock line, a state in a `<p>` as the notes say: "In stock, 6 left" or "In stock, 2 left" with a success mark, or "Made to order, posted in about 3 weeks" with a neutral mark.
- With `mt-6` the quantity, as the Quantity note says: a visible label "Quantity" (a `<p>`), then with `mt-2` the group, named by it with `aria-labelledby`, its buttons "One fewer" and "One more".
- With `mt-6` the default button "Add to basket", `w-full`, with the `ShoppingBag` icon before the words. This is the page's one terracotta button.
- Then a wrapper `<div>` holding, first, a link "View basket" to `/basket`, styled as a header link, in a block element with `mt-2`, rendered once something has been added; and after it, beside the link and not around it, the status element for the confirmation, as the Confirmations note says. The status element comes last, so clearing it moves nothing above it. The message inside it has `mt-4`: "Added 2 Fold bowls in iron glaze to your basket." It does not replace a control, so focus stays on the button.

### 3. Details and care

A `<section>` with the `aria-label` "Details and care", a 12-column grid with `md:items-start`, so the Care card is only as tall as its text.

- Columns 1–7: the `<h2>` "Details", then with `mt-6` a `<dl>` as the Description lists note says, with seven rows: Size (`16 cm across, 6 cm high`), Holds (`550 ml`), Weight (`420 g`), Clay (Buff stoneware), Glaze (the chosen glaze's name alone, `Iron`, as on its button), Fired (6 November 2026, a `<time>` with `dateTime="2026-11-06"`), Foot (Unglazed and sanded smooth). The `<dd>` of Size, Holds and Weight is `font-mono tabular-nums` as a whole, units included; the other four are body text, the date too, as the Dates note says.
- Columns 9–12: a card, as the Cards note says, with the `<h2>` "Care", then with `mt-4` a `list-disc` list with `pl-6`, `mt-2` between its items, of four: safe in the dishwasher and the microwave; not for the oven or the hob; let it cool before it meets cold water; a fine crackle in Ash glaze is part of the glaze, not a crack. Below `md` the card comes under the list with `mt-10 md:mt-0`.

### 4. Goes well with

The section heading row from the layout notes: the `<h2>` "Goes well with" and the link "See all tableware" to `/tableware`. Then with `mt-6` the grid of product tiles from the Product tiles note, with four tiles (`aspect-square` pictures): Breakfast bowl, Ash, £26.00; Serving bowl, Ash, £72.00, badge "Last one"; Nest of three bowls, Slate, £58.00; Moor mug, Ash, £28.00. Each links to the piece's address, as the Product tiles note says: `/tableware/nest-of-three-bowls`. Add the `Badge` with `npx shadcn@latest add badge`.

### 5. Footer

The footer from the layout notes.

### Behavior

- Keep the glaze, the quantity and the basket count in component state. The glaze sets the pictures' fills and labels, the stock line, the quantity's limit and the Glaze row of the details.
- The quantity starts at 1. Its limit is the stock for Iron (6) and Ash (2); Slate is made to order and has no stock, so its limit is the order limit, 4. "One fewer" is disabled at 1 and "One more" at the limit; both get `focusableWhenDisabled`. Choosing a glaze whose limit is below the quantity sets the quantity to that limit.
- "Add to basket" adds the quantity to the header's count (`Basket (5)` after adding 2) and updates the link's `aria-label`. It writes the confirmation into the status element: clear it first and write the new sentence on the next frame, so that adding the same thing twice is read out twice. The sentence uses the singular for one ("Added 1 Fold bowl…"). The quantity goes back to 1. Adding does not change the stock line or the limit: the page keeps no stock count.
- The "Menu" button opens and closes the small-screen menu and sets `aria-expanded`; Escape closes it as the notes say.
- The tiles and the other links need no behavior.
