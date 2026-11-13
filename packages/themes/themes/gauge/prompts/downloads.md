---
page: downloads page
title: Downloads
description: the documents for one product range, data sheets, CAD files and certificates, in a table with type, format, revision, date, file size and a download link each, filtered by a button group.
order: 5
checks:
  - "The type filter is a button group with `aria-pressed`, all of it pale steel secondary, the chosen button marked by its border and bold text and not by a fill."
  - "Each document row has its type, format, revision, a `<time>` for its date, its size in a right-aligned mono column whose header carries the unit, and a download link whose name says which file it is."
  - "The count in the table's heading row follows the filter and is announced, and the four filters show 10, 4, 3 and 3 documents."
  - "Download all is the only default button on the page, and the page does not scroll sideways at 375px."
---

Sample content, if the user gave none: "Torvale Bearings Ltd" and the documents for its TVL range of deep groove ball bearings. Ten documents, newest first (title, type, format, revision, date, size in MB):

1. "TVL-2552-RS data sheet", Data sheet, PDF, Rev A, 21 Oct 2026, 0.91
2. "TVL-2552-RS 3D model", CAD file, STEP, Rev A, 21 Oct 2026, 1.75
3. "TVL range catalogue", Data sheet, PDF, Rev D, 2 Oct 2026, 2.40
4. "TVL range 2D outlines", CAD file, DXF, Rev D, 2 Oct 2026, 0.36
5. "Material declaration, REACH and RoHS", Certificate, PDF, Rev B, 28 Sep 2026, 0.29
6. "TVL-2047-RS data sheet", Data sheet, PDF, Rev C, 14 Sep 2026, 0.84
7. "TVL-2047-RS 3D model", CAD file, STEP, Rev C, 14 Sep 2026, 1.62
8. "TVL-3572-ZZ data sheet", Data sheet, PDF, Rev B, 9 Sep 2026, 0.88
9. "Certificate of conformity, 2026", Certificate, PDF, Rev A, 4 Sep 2026, 0.21
10. "ISO 9001 certificate, Brigholt works", Certificate, PDF, Rev C, 1 Sep 2026, 0.47

That is four data sheets, three CAD files and three certificates, 9.73 MB in all.

This page uses the stock `button` and `table`; add any the project lacks with `npx shadcn@latest add button table`.

Build these parts in order; the footer is as the layout notes describe it.

### 1. Header

The product's name, the four nav links with Downloads as the current page, the sales line at the right end from `md` up, and the "Menu" button below `md`.

### 2. Page header

On the left, the label "Downloads", then the `<h1>` "TVL range documents", then, as the stack's last item, a small figure: `Deep groove ball bearings · 10 documents · updated 21 Oct 2026`, with the date in a `<time>`. On the right, one action: a link styled as the default button, "Download all (ZIP, 9.73 MB)", to `#`, with the `Download` icon before its text. It is the page's one main action.

### 3. Documents

A grid row. The documents are a panel with rows spanning nine columns from `lg` up, full width below.

Its heading row holds the `<h2>` "Documents" and, at its right end, in a `flex flex-wrap items-center gap-3`, the type filter and the count. The filter is a button group with the `aria-label` "Document type" and four buttons, as the Button groups note sets them: "All (10)", chosen at first, "Data sheets (4)", "CAD files (3)" and "Certificates (3)". The count is a small figure in an element with `aria-live="polite"`: `10 documents` for All, `4 of 10 documents` for a filter. Below `md` the group and the count wrap under the heading.

The shadcn `Table` with the label "Documents" and seven columns:

- **Document:** the title in `text-body`, with `whitespace-normal`; its header has `min-w-48`.
- **Type:** "Data sheet", "CAD file" or "Certificate", in `text-body`.
- **Format:** `PDF`, `STEP` or `DXF`, in `font-mono`.
- **Revision:** `Rev A`, in `font-mono`.
- **Date:** a `<time>` in `font-mono tabular-nums`, `21 Oct 2026`, with its `dateTime`.
- **Size (MB):** `0.91`, two decimals, right-aligned, header too.
- **The last column:** its header is "File", made `sr-only` as the Tables note says. The cell is left-aligned and holds a text link to `#`, with no `download` attribute (on `#` it would save the page itself), `inline-flex items-center gap-2`, in `font-mono text-label`: the `Download` icon, then the word "Download". Its `aria-label` names the file: "Download TVL-2552-RS data sheet, PDF, 0.91 MB".

Seven columns of nine on 1280px fit without scrolling; on a phone the table scrolls in its box. Every filter leaves at least three rows, so there is no empty state.

Under the table, inside the same panel, a row with `border-t border-border px-4 py-3` holding one small figure: "Each file shows its revision on its first page. Older revisions are sent on request."

### 4. File formats

A panel with rows spanning three columns from `lg` up, full width below. A heading row holding only the `<h2>` "File formats", then a `<dl>` of three rows. Each row is a `<div>` with `flex flex-col gap-1 px-4 py-3` and `border-t border-border` except the first, as the Panels with rows note sets a row (not the Description lists note's row): the `<dt>` is the format as a label in `text-foreground`, the `<dd>` one sentence in `text-body`.

- `PDF`: "Data sheets and certificates, for any PDF reader."
- `STEP`: "3D models for any CAD system, in millimetres."
- `DXF`: "2D outlines of every size in the range, for drawing packages."

### Behavior

- The type filter keeps its value in component state and shows only the documents of the chosen type, in the same newest-first order. The chosen button has `aria-pressed="true"`, the others `aria-pressed="false"`. Focus stays on the button that was pressed. The count follows at once.
- No button on this page is ever disabled, so none gets `focusableWhenDisabled`, and `components/ui/button.tsx` needs no `data-disabled:` classes.
- "Download all" and the download links point to `#` and need no behavior: there are no files in this demo.
