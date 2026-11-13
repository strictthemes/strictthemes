---
page: basket page
title: Basket
description: the basket of a small ceramics studio's shop, with its lines, quantity controls, a delivery choice, a note for the studio and a summary whose totals update.
order: 4
checks:
  - Changing a quantity or the delivery choice updates the line total, the subtotal, the delivery cost and the total at once, and standard post turns free when the subtotal reaches £100.00.
  - Removing a line updates the header's count and the totals, says so in a status message, and moves focus to the next line, the previous one, or the empty basket's heading.
  - The "Go to checkout" link is an `<a>` styled as the default button, the page's only terracotta button, and the page has no payment form.
  - Every price is in mono figures with two decimals and the pound sign against the figure.
---

Sample content, if the user gave none: "Whitlow Pottery", a stoneware studio of two potters, Nell Varga and Tomas Reid, at Unit 3, Coldharbour Yard, Bramwick BW4 2LT. The basket holds two lines: Moor mug in Ash glaze, £28.00 each, quantity 2, at most 8 in stock; and Fold bowl in Iron glaze, £34.00, quantity 1, at most 6 in stock. Delivery: Standard post, 3 to 5 working days, £5.50, free when the subtotal is £100.00 or more; Tracked, next working day, £9.50; Collect from the studio, free, Thursday to Saturday, 10:00 to 16:00.

Build these parts in order.

### 1. Header

The header from the layout notes. The basket link, to `/basket`, is the current page. Its count is the sum of the quantities, 3 to start, and follows every change, down to `Basket (0)`.

### 2. Title

The first section of `<main>`: the `<h1>` in `text-h1`, "Your basket", and with `mt-2` a label, a `<p>`, in `text-muted-foreground`, `3 pieces`, in mono figures, which follows every change (`1 piece`, `No pieces`). Then the status element for messages about removed lines, as the Confirmations note says; the message inside it has `mt-4`.

### 3. Lines and summary

In the same section as the title, with `mt-6`, a 12-column grid with `md:items-start`. Below `md` the summary comes under the lines and the note, with `mt-10 md:mt-0`.

**Lines**, columns 1–7. A visually hidden `<h2>`, "Pieces in your basket", then a `<ul>` with no markers, no gap and no top margin (the hidden heading takes no space). Each line is an `<li>` with `border-t py-6 last:border-b`: a 1px top border, and the last also a bottom one. A line is a row, `flex gap-4`:

- A picture as the Pictures note says, `size-20 shrink-0 rounded-xl border` (square, in place of the note's aspect class), the piece in the shape for its kind and the fill for its glaze (Ash is pale, Iron dark), with an `aria-label` such as "Moor mug in ash glaze".
- Beside it, a column with `min-w-0 flex-1`:
  - A row, `flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1`: on the left the name as an `<h3>` in `font-sans text-body font-medium`, a link to the piece styled as a header link (`/tableware/moor-mug`, `/tableware/fold-bowl`); on the right the line total as a price.
  - With `mt-1` a label, a `<p>`, in `text-muted-foreground`: the glaze and the unit price, `Ash glaze · £28.00 each`.
  - With `mt-4` a row, `flex flex-wrap items-center gap-4`: the quantity, as the Quantity note says, with the `aria-label` "Quantity of Moor mug" and the buttons "One fewer Moor mug" and "One more Moor mug"; then an `outline` button "Remove", with the `Trash2` icon before the word and the `aria-label` "Remove Moor mug".

At 375px the picture keeps its size and the quantity row wraps.

**Note for the studio.** Under the list, with `mt-10`: the label "A note for the studio", then with `mt-2` a `Textarea` (add it with `npx shadcn@latest add textarea`) with `min-h-24` and `maxLength={300}`, then with `mt-2` helper text: "A gift message, or where to leave the parcel." followed by the count of characters left, `300 left`, in mono figures, down to `0 left`. The field's `aria-describedby` names the helper text. The count is not a live region: it is read with the description when the field takes focus, not on every key.

**Summary**, columns 9–12 (`md:col-span-4 md:col-start-9`). A card, as the Cards note says, with an `<h2>` "Summary", then:

- With `mt-6` the delivery choice: a visible label "Delivery" (a `<p>`), then with `mt-2` a button group named by it, as the notes say, but stacked: `flex flex-col gap-2` here, in place of the note's `flex flex-wrap gap-2`. Each button is `w-full justify-between whitespace-normal text-left` (here `whitespace-normal`, in place of the Buttons note's `whitespace-nowrap`, as a name and its cost may need two lines in the narrow card), with the option's name on the left and its cost on the right, at the button's label size, or the word "Free". Standard post is chosen to start.
- With `mt-2` helper text for the chosen option: "Arrives in 3 to 5 working days.", "Order by 13:00 for the next working day.", or "Collect from Unit 3, Coldharbour Yard, Thursday to Saturday, 10:00 to 16:00." Each time is a `<time>` with a `dateTime`; a range is two of them.
- With `mt-6` the totals: a `<dl>` with three rows. Here, in place of the Description lists note's grid, each row is a `<div>`, `flex items-baseline justify-between gap-4 py-2`, with a 1px top border, and the last row has no bottom border; the `<dt>` is a label in `text-muted-foreground` and the `<dd>` a price. The rows are Subtotal, Delivery (the cost, or "Free") and Total. In the Total row the `<dt>` is `font-sans text-body font-medium text-foreground` and the `<dd>` is `text-h2 font-medium`, still a mono price, as the Prices note says. The totals are not a live region; the `<output>` announces each click.
- With `mt-4`, only while Standard post is chosen, helper text about free post. Under a £100.00 subtotal it is "Spend £10.00 more for free standard post.", where the amount is £100.00 less the subtotal (£10.00 at the start); from £100.00 up it is "Standard post is free on this order."
- With `mt-6` a link styled as the default button, "Go to checkout", `w-full`, to `/checkout`. It is the page's one terracotta button. There is no payment form on this page.
- With `mt-4` helper text: "You pay on the next page."

**Empty basket.** When the last line is removed, the lines, the note and the summary are not rendered, and in their place, across columns 1–7, stands the following. The status element stays where it is, above, so the removal message still shows.

- An `<h2>` in `text-h2` with `tabIndex={-1}`: "Your basket is empty".
- With `mt-4` one sentence: "The next firing comes out of the kiln in early December."
- With `mt-6` a link styled as a `secondary` button, "Back to the shop", to `/`.

### 4. Footer

The footer from the layout notes.

### Behavior

- Keep the lines, the delivery choice and the note in component state, and work out every figure from them in pence: line total, subtotal, delivery, total and the count.
- "One fewer" is disabled at 1 and "One more" at the most in stock; both get `focusableWhenDisabled`.
- Standard post costs £5.50 under a £100.00 subtotal and nothing from £100.00 up; its button shows the cost that applies. Tracked is £9.50 at any subtotal; collection is free.
- "Remove" takes the line out, writes "Moor mug removed from your basket." into the status element, and moves focus to the name link of the line that took its place, or to the name link of the line before it if it was the last one, or to the empty basket's heading if no line is left.
- The count of characters left updates as the visitor types.
- The "Menu" button opens and closes the small-screen menu and sets `aria-expanded`; Escape closes it as the notes say.
- Links need no behavior.
