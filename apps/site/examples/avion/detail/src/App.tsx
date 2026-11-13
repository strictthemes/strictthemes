import * as React from "react"
import { Check, CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const SIGNED_IN = "Elena Varga"
const NOW = { text: "11 Nov, 13:50", iso: "2026-11-11T13:50" }

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const navLink = cn(
  "font-mono text-label uppercase text-muted-foreground transition-colors duration-150 hover:text-foreground",
  focusRing
)
const currentNavLink = cn(
  "font-mono text-label uppercase text-foreground transition-colors duration-150",
  focusRing
)
const label = "font-mono text-label uppercase text-muted-foreground"
const smallFigure = "font-mono text-label text-muted-foreground tabular-nums"
const panel = "rounded-xl border bg-card p-5"
const rowsPanel = "overflow-hidden rounded-xl border bg-card"
const headingRow = "flex min-h-7 flex-wrap items-center justify-between gap-3"
const buttonText = "px-5 font-mono text-label uppercase"

const NAV = [
  { label: "Overview", href: "/" },
  { label: "Shipments", href: "/shipments", current: true },
  { label: "Depots", href: "/depots" },
  { label: "Reports", href: "/reports" },
]

type Stamp = { text: string; iso: string }

const STEPS: { name: string; at: Stamp }[] = [
  { name: "Booked", at: { text: "10 Nov, 15:22", iso: "2026-11-10T15:22" } },
  { name: "Collected", at: { text: "10 Nov, 17:05", iso: "2026-11-10T17:05" } },
  { name: "At depot", at: { text: "10 Nov, 21:48", iso: "2026-11-10T21:48" } },
  {
    name: "Out for delivery",
    at: { text: "11 Nov, 08:40", iso: "2026-11-11T08:40" },
  },
  { name: "Delivered", at: { text: "11 Nov, 13:45", iso: "2026-11-11T13:45" } },
]

type Tone = "success" | "caution" | "failed" | "neutral"

type TimelineEvent = {
  id: string
  at: Stamp
  text: string
  by: string
  state?: { tone: Tone; word: string }
}

const EVENTS: TimelineEvent[] = [
  {
    id: "delay",
    at: { text: "11 Nov, 11:32", iso: "2026-11-11T11:32" },
    text: "A road closure on the A61 at Killinghall sent the van on a diversion, so delivery is now expected at 13:45.",
    by: "Route planner",
    state: { tone: "caution", word: "Delayed" },
  },
  {
    id: "out",
    at: { text: "11 Nov, 08:40", iso: "2026-11-11T08:40" },
    text: "Loaded onto van LE-17 and left the Leeds East depot for the Harrogate round.",
    by: "Marcus Obi",
  },
  {
    id: "sorted",
    at: { text: "11 Nov, 06:15", iso: "2026-11-11T06:15" },
    text: "Sorted onto the morning Harrogate route.",
    by: "Sorting line 2, Leeds East",
  },
  {
    id: "depot",
    at: { text: "10 Nov, 21:48", iso: "2026-11-10T21:48" },
    text: "Arrived at the Leeds East depot and scanned in with all four items.",
    by: "Inbound scanner, Leeds East",
  },
  {
    id: "collected",
    at: { text: "10 Nov, 17:05", iso: "2026-11-10T17:05" },
    text: "Collected from the sender's warehouse in Wakefield.",
    by: "Dana Price",
  },
  {
    id: "booked",
    at: { text: "10 Nov, 15:22", iso: "2026-11-10T15:22" },
    text: "Booked online by the sender for next-day delivery.",
    by: "Halden Garden Supplies",
  },
]

const ITEMS = [
  { sku: "HGS-2041", description: "Glazed planter, 30 cm", quantity: 6, unitKg: 2.4 },
  { sku: "HGS-1187", description: "Seed tray, pack of 5", quantity: 10, unitKg: 0.35 },
  { sku: "HGS-3310", description: "Watering can, 10 l", quantity: 4, unitKg: 0.9 },
  { sku: "HGS-0952", description: "Peat-free compost, 20 l", quantity: 3, unitKg: 8.5 },
]
const lineKg = (item: (typeof ITEMS)[number]) =>
  Math.round(item.quantity * item.unitKg * 10) / 10
const TOTAL_QUANTITY = ITEMS.reduce((sum, item) => sum + item.quantity, 0)
const TOTAL_KG = ITEMS.reduce((sum, item) => sum + lineKg(item), 0)
const kg = (value: number) => value.toFixed(1)

type Note = { id: number; text: string; by: string; at: Stamp }

const INITIAL_NOTES: Note[] = [
  {
    id: 2,
    text: "Customer asked for the parcels to go to the side gate if the front desk is closed.",
    by: "Priya Nair",
    at: { text: "11 Nov, 09:12", iso: "2026-11-11T09:12" },
  },
  {
    id: 1,
    text: "Compost bags rewrapped at the depot after one split in the cage.",
    by: "Owen Clarke",
    at: { text: "10 Nov, 22:05", iso: "2026-11-10T22:05" },
  },
]

const DOT: Record<Tone, string> = {
  success: "bg-success",
  caution: "bg-tertiary",
  failed: "bg-destructive",
  neutral: "bg-muted-foreground",
}

function State({ tone, word }: { tone: Tone; word: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", DOT[tone])}
      />
      <span className="text-body text-foreground">{word}</span>
    </span>
  )
}

function StampTime({ at, className }: { at: Stamp; className?: string }) {
  return (
    <time dateTime={at.iso} className={className}>
      {at.text}
    </time>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [delivered, setDelivered] = React.useState(false)
  const [notes, setNotes] = React.useState<Note[]>(INITIAL_NOTES)
  const [noteText, setNoteText] = React.useState("")
  const [noteError, setNoteError] = React.useState(false)
  const menuButtonRef = React.useRef<HTMLButtonElement>(null)
  const noteRef = React.useRef<HTMLTextAreaElement>(null)

  const events: TimelineEvent[] = delivered
    ? [
        {
          id: "delivered",
          at: NOW,
          text: "Delivered to Ripley Court Garden Centre and signed for at the front desk.",
          by: SIGNED_IN,
          state: { tone: "success", word: "Delivered" },
        },
        ...EVENTS,
      ]
    : EVENTS

  function onHeaderKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (menuOpen && event.key === "Escape") {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  function addNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = noteText.trim()
    if (!text) {
      setNoteError(true)
      noteRef.current?.focus()
      return
    }
    setNotes((current) => [
      { id: Date.now(), text, by: SIGNED_IN, at: NOW },
      ...current,
    ])
    setNoteText("")
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card" onKeyDown={onHeaderKeyDown}>
        <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-3 py-3 md:px-5">
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground transition-colors duration-150",
              focusRing
            )}
          >
            Northgate
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-5">
              {NAV.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "true" : undefined}
                    className={link.current ? currentNavLink : navLink}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <span className={cn("ml-auto hidden md:block", smallFigure)}>
            {SIGNED_IN}
          </span>
          <Button
            ref={menuButtonRef}
            variant="outline"
            className={cn("ml-auto md:hidden", buttonText)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="mobile-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t md:hidden"
        >
          <ul className="mx-auto max-w-[1280px] px-3 py-2">
            {NAV.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "true" : undefined}
                  className={cn(
                    "block py-2",
                    link.current ? currentNavLink : navLink
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto grid max-w-[1280px] grid-cols-1 gap-5 px-3 py-5 md:grid-cols-12 md:px-5">
        <div className="md:col-span-12">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <a href="/shipments" className={navLink}>
                  Shipments
                </a>
              </li>
              <li
                aria-hidden="true"
                className="font-mono text-label text-muted-foreground"
              >
                /
              </li>
              <li>
                <span
                  aria-current="page"
                  className="font-mono text-label text-foreground tabular-nums"
                >
                  NG-48213
                </span>
              </li>
            </ol>
          </nav>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-h1">
                Shipment <span className="font-mono">NG-48213</span>
              </h1>
              {delivered ? (
                <State tone="success" word="Delivered" />
              ) : (
                <State tone="neutral" word="Out for delivery" />
              )}
              {!delivered && (
                <Badge
                  variant="outline"
                  className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label uppercase text-tertiary-foreground"
                >
                  Delayed
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className={buttonText}>
                Print label
              </Button>
              <Button variant="secondary" className={buttonText}>
                Reroute
              </Button>
              <Button
                className={buttonText}
                disabled={delivered}
                focusableWhenDisabled
                onClick={() => setDelivered(true)}
              >
                Mark as delivered
              </Button>
            </div>
          </div>
          <div role="status" className="sr-only">
            {delivered ? "Shipment NG-48213 marked as delivered." : ""}
          </div>
        </div>

        <div className="flex flex-col gap-5 md:col-span-12 lg:col-span-8">
          <section aria-labelledby="progress-heading" className={panel}>
            <div className={headingRow}>
              <h2 id="progress-heading" className={label}>
                Progress
              </h2>
            </div>
            <ol className="mt-3 grid gap-3 md:grid-cols-5">
              {STEPS.map((step, index) => {
                const status = delivered
                  ? "done"
                  : index < 3
                    ? "done"
                    : index === 3
                      ? "current"
                      : "next"
                const at =
                  delivered && index === STEPS.length - 1 ? NOW : step.at
                return (
                  <li
                    key={step.name}
                    aria-current={status === "current" ? "step" : undefined}
                    className="flex gap-3 md:flex-col md:gap-2"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-sm border",
                        status === "done" &&
                          "border-secondary bg-secondary text-secondary-foreground",
                        status === "current" && "border-primary bg-primary",
                        status === "next" && "border-muted-foreground"
                      )}
                    >
                      {status === "done" && (
                        <Check className="size-4" strokeWidth={1.5} />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="font-sans text-body font-medium">
                        {step.name}
                        <span className="sr-only">
                          {status === "done"
                            ? ", Done"
                            : status === "current"
                              ? ", Current"
                              : ", To come"}
                        </span>
                      </p>
                      {status === "next" && <p className={label}>Expected</p>}
                      <StampTime
                        at={at}
                        className={cn("block whitespace-nowrap", smallFigure)}
                      />
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>

          <section aria-labelledby="timeline-heading" className={rowsPanel}>
            <div className="border-b px-5 pt-5 pb-3">
              <div className={headingRow}>
                <h2 id="timeline-heading" className={label}>
                  Timeline
                </h2>
              </div>
            </div>
            <ol>
              {events.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-col border-t px-5 py-3 first:border-t-0 md:flex-row md:items-baseline md:gap-5"
                >
                  <StampTime
                    at={event.at}
                    className={cn("md:w-32 md:shrink-0", smallFigure)}
                  />
                  <div className="mt-1 min-w-0 md:mt-0">
                    {event.state && (
                      <div className="mb-1">
                        <State {...event.state} />
                      </div>
                    )}
                    <p className="text-body">{event.text}</p>
                    <p className={cn("mt-1", smallFigure)}>{event.by}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section
            aria-labelledby="items-heading"
            className={cn("flex-1", rowsPanel)}
          >
            <div className="border-b px-5 pt-5 pb-3">
              <div className={headingRow}>
                <h2 id="items-heading" className={label}>
                  Items
                </h2>
                <span className={smallFigure}>
                  {ITEMS.length} {ITEMS.length === 1 ? "item" : "items"}
                </span>
              </div>
            </div>
            <Table label="Items" className="text-body">
              <TableHeader>
                <TableRow>
                  <TableHead className={cn("px-5", label)}>SKU</TableHead>
                  <TableHead className={cn("px-5", label)}>
                    Description
                  </TableHead>
                  <TableHead className={cn("px-5 text-right", label)}>
                    Quantity
                  </TableHead>
                  <TableHead className={cn("px-5 text-right", label)}>
                    Weight <span className="normal-case">(kg)</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ITEMS.map((item) => (
                  <TableRow key={item.sku}>
                    <TableCell className="px-5 py-2 font-mono tabular-nums">
                      {item.sku}
                    </TableCell>
                    <TableCell className="px-5 py-2">
                      {item.description}
                    </TableCell>
                    <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                      {kg(lineKg(item))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="font-medium">
                  <TableCell className="px-5 py-2">Total</TableCell>
                  <TableCell className="px-5 py-2" />
                  <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                    {TOTAL_QUANTITY}
                  </TableCell>
                  <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                    {kg(TOTAL_KG)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </section>
        </div>

        <div className="flex flex-col gap-5 md:col-span-12 lg:col-span-4">
          <section aria-labelledby="details-heading" className={panel}>
            <div className={headingRow}>
              <h2 id="details-heading" className={label}>
                Details
              </h2>
            </div>
            <dl className="mt-3">
              {[
                { term: "Customer", value: "Ripley Court Garden Centre" },
                { term: "Service", value: "Next day, before 12:00" },
                { term: "Depot", value: "Leeds East" },
                {
                  term: "Weight",
                  value: (
                    <span className="font-mono tabular-nums">
                      {kg(TOTAL_KG)} kg
                    </span>
                  ),
                },
                {
                  term: "Booked",
                  value: (
                    <StampTime
                      at={STEPS[0].at}
                      className="font-mono tabular-nums"
                    />
                  ),
                },
                {
                  term: "Due",
                  value: (
                    <StampTime
                      at={{ text: "11 Nov, 12:00", iso: "2026-11-11T12:00" }}
                      className="font-mono tabular-nums"
                    />
                  ),
                },
              ].map((row) => (
                <div
                  key={row.term}
                  className="flex items-baseline justify-between gap-3 border-t py-2 first:border-t-0"
                >
                  <dt className={label}>{row.term}</dt>
                  <dd className="text-right text-body text-foreground">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="addresses-heading" className={panel}>
            <div className={headingRow}>
              <h2 id="addresses-heading" className={label}>
                Addresses
              </h2>
            </div>
            <div className="mt-3">
              <div>
                <h3 className={label}>From</h3>
                <address className="mt-1 text-body not-italic">
                  Halden Garden Supplies
                  <br />
                  Unit 4, Calder Park
                  <br />
                  WF2 7AB Wakefield
                </address>
              </div>
              <div className="mt-5 border-t pt-5">
                <h3 className={label}>To</h3>
                <address className="mt-1 text-body not-italic">
                  Ripley Court Garden Centre
                  <br />
                  18 Station Parade
                  <br />
                  HG1 1TE Harrogate
                </address>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="notes-heading"
            className={cn("flex-1", panel)}
          >
            <div className={headingRow}>
              <h2 id="notes-heading" className={label}>
                Notes
              </h2>
            </div>
            <form noValidate onSubmit={addNote} className="mt-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="note" className={label}>
                  Add a note
                </label>
                <Textarea
                  ref={noteRef}
                  id="note"
                  value={noteText}
                  onChange={(event) => {
                    setNoteText(event.target.value)
                    setNoteError(false)
                  }}
                  aria-invalid={noteError || undefined}
                  aria-describedby={noteError ? "note-error" : undefined}
                  className="min-h-24 resize-none px-2 text-body md:text-body"
                />
              </div>
              {noteError && (
                <p
                  id="note-error"
                  className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
                >
                  <CircleAlert
                    aria-hidden="true"
                    className="size-4 shrink-0"
                    strokeWidth={1.5}
                  />
                  Write a note first.
                </p>
              )}
              <Button
                type="submit"
                variant="secondary"
                className={cn("mt-3", buttonText)}
              >
                Add note
              </Button>
            </form>
            <ul className="mt-5">
              {notes.map((note) => (
                <li key={note.id} className="border-t py-3 last:pb-0">
                  <p className="text-body wrap-break-word">{note.text}</p>
                  <p className={cn("mt-1", smallFigure)}>
                    {note.by} · <StampTime at={note.at} />
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
