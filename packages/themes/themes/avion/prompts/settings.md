---
page: settings page
title: Settings
description: a settings screen for an admin tool, with sections of form fields, switches, a members table and a way to delete the workspace.
order: 5
checks:
  - Every field has a visible label tied to it, and each switch has a name and announces whether it is on.
  - A panel's "Save changes" button is disabled until something in that panel changes, and after saving a confirmation is announced and the button is disabled again.
  - An empty workspace name gets an error message in words with an icon, tied to the field, and is not saved.
  - The "Delete workspace" button stays disabled until the workspace's name is typed exactly, and the warning is stated in words, not by the red color alone.
  - The switches have square corners like the rest of the theme, not a pill shape.
  - 'The time zone and every role is the theme''s `Select`, with no native `<select>` on the page: its list opens under its trigger in the theme''s colors, the chosen row has a check, and the arrow keys, Enter and Escape work in it.'
  - The section links jump to their panels, and the page does not scroll sideways on a phone.
---

Sample product, if the user gave none: "Northgate", the operations console of a regional parcel carrier. The workspace is called "Northgate North" and has five members. Invent the people; keep them believable.

Build these parts in order.

### 1. Top bar

The product's name, five nav links (Overview, Shipments, Depots, Reports, Settings) with Settings as the current page, and at the right end the signed-in person's name as a small figure, hidden below `md`.

### 2. Page header

The `<h1>` "Settings". No actions.

### 3. Section links

Three columns from `lg` up, full width below: a `<nav>` with the `aria-label` "Settings sections" that is itself the panel, one element with the classes of a panel with rows (`overflow-hidden rounded-xl border bg-card`, no padding) and no label heading. Four links to `#workspace`, `#notifications`, `#members` and `#danger-zone`, one per panel of the next part: Workspace, Notifications, Members, Danger zone. Each link is a block with `px-5 py-2` in `text-body text-foreground`, with an underline on hover and a 1px top border except the first. From `lg` up the panel stays in view while the page scrolls (`lg:sticky lg:top-5 lg:self-start`).

### 4. Panels

Nine columns from `lg` up, full width below: four panels stacked with `gap-5`. Each has the `id` its section link names (`workspace`, `notifications`, `members`, `danger-zone`) and `scroll-mt-5`.

**Workspace.** Heading: `Workspace`. A form with three fields, each at most `max-w-md` wide:

- "Workspace name": an `Input` with the `required` attribute and no other mark.
- "Address": an `Input` with the fixed start of the address before it in the same row, as a small figure (`northgate.example/`, `gap-2`), and helper text under it: "Use lowercase letters, numbers and hyphens only." Both are named in the field's `aria-describedby`.
- "Time zone": a `Select` with five time zones.

The form ends with a row with a 1px top border, `mt-5 pt-5` and `gap-3`: the default button "Save changes", an `outline` button "Discard", and a place for the confirmation.

**Notifications.** Heading: `Notifications`. A padded panel, not a panel with rows. Four rows divided by 1px borders, each with `py-3`, the first with no top padding and the last with none at the bottom (`first:pt-0 last:pb-0`): at the left a title in `text-body font-medium` with one sentence under it in `text-body text-muted-foreground` (`mt-1`), at the right the shadcn `Switch`; add it with `npx shadcn@latest add switch`. The stock `Switch` is a pill with a round thumb, and this theme has no pills: edit `components/ui/switch.tsx` so that the track and the thumb are both `rounded-sm` in place of `rounded-full`. The track is only 18px high, so a larger corner would still read as a pill. The title is a `<p>` and is the switch's label: tie them with `aria-labelledby`, and the sentence with `aria-describedby`. For example: Late deliveries, Failed deliveries, Daily summary, New members. The panel ends with the same row of buttons as the Workspace panel.

**Members.** A panel with rows. Heading: `Members`, with the count at the right end of the heading row as a small figure. A table with five rows and the columns Name, Email, Role and Last active (a date and time, right-aligned). The role of each row is a `Select` with Owner, Dispatcher and Viewer, in a wrapper with `w-32`, with an `aria-label` on its trigger that names the person ("Role of Tobias Reyes"); the signed-in person's own row shows the role as text and, after their name, the word `You` in the label style (uppercase, `text-muted-foreground`). Email addresses are plain body text, `text-body text-foreground` in the body font: not a small figure and not mono. The table scrolls in its box on a phone.

Under the table, in a row with a 1px top border and `px-5 py-5`: a form to invite someone, with a labelled email field ("Invite by email", `w-64`, full width below `md`), a labelled role `Select` ("Role", in a wrapper with `w-32`) and a `secondary` button "Send invite", in a row with `gap-3` that wraps, bottoms aligned (`items-end`). The error line goes under the row. A good address gets a confirmation there too, in a `role="status"` element under the row, empty from the start: a check icon in `text-success` and "Invite sent to" with the address, in `text-body`, cleared at the next keystroke in the field.

**Danger zone.** Heading: `Danger zone`. An `<h3>` in `text-body font-medium`, "Delete this workspace", and with `mt-1` one paragraph saying what is lost, that it cannot be undone, and that the workspace's name must be typed below to go on. With `mt-5`, a labelled field, "Confirm workspace name", at most `max-w-md` wide, and with `mt-3` the button "Delete workspace" in `variant="destructive"` with a warning icon before its text. Add `hover:text-foreground` to it: the stock hover tint leaves too little contrast for red text.

### Behavior

- Each of the two forms with "Save changes" tracks whether its values differ from the saved ones. "Save changes" and "Discard" are disabled while they do not. "Discard" puts the saved values back and moves focus to the panel's first field (in Notifications, its first switch), so it does not need `focusableWhenDisabled`. "Save changes" disables itself and keeps the focus, so it gets `focusableWhenDisabled`; it is the only button on this page that does. Such a button is not truly disabled, so Enter in a field still sends the form: the form's submit handler does nothing while the values equal the saved ones. "Save changes" stores the values and shows, as a confirmation in the button row, a check icon and "Saved" as a label in `text-success`; it goes away after four seconds.
- An empty workspace name shows the error line and is not saved. The address field lowercases what is typed and drops characters that are not allowed.
- More than one "Save changes" button can be on screen; at rest they are disabled.
- "Send invite" checks the email address; one that is already in the table is an error too. A good one adds a row to the members table with the address in the Email cell, a dash in the Name cell, the role chosen, as a `Select` like the other rows, and, in the last-active cell, a neutral state, "Invited". It empties the field, and the count in the heading row reads `5 members, 1 invited`.
- "Delete workspace" is disabled until the field holds the saved workspace name exactly. Clicking it replaces the panel's content under its heading with a confirmation of one sentence: "This is where the workspace would be deleted." The content and an empty `role="status"` element share one wrapper with `mt-3`; the click removes the content, puts the sentence in the status element, gives it `tabIndex={-1}` and moves focus to it, since the button that had focus is gone.
- The section links jump to their panels.
