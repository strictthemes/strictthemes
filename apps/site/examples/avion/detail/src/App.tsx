import { useRef, useState, type FormEvent, type ReactNode } from "react"
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

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const LABEL = "font-mono text-label uppercase"
const FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const BUTTON = "px-5 font-mono text-label uppercase"
const NAV_LINK = cn(LABEL, "transition-colors duration-150", FOCUS)

const SHIPMENT_ID = "NG-48213"
const SIGNED_IN = "Priya Nair"

const NAV = [
  { label: "Overview", href: "/" },
  { label: "Shipments", href: "/shipments", current: true },
  { label: "Depots", href: "/depots" },
  { label: "Reports", href: "/reports" },
]

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

type Stamp = { iso: string; text: string }

function stamp(date: Date): Stamp {
  const pad = (n: number) => String(n).padStart(2, "0")
  const hh = pad(date.getHours())
  const mm = pad(date.getMinutes())
  return {
    iso: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${hh}:${mm}`,
    text: `${date.getDate()} ${MONTHS[date.getMonth()]}, ${hh}:${mm}`,
  }
}

function at(iso: string): Stamp {
  return stamp(new Date(iso))
}

type Tone = "success" | "failed" | "caution" | "neutral"

const DOT: Record<Tone, string> = {
  success: "bg-success",
  failed: "bg-destructive",
  caution: "bg-tertiary",
  neutral: "bg-muted-foreground",
}

function State({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", DOT[tone])}
      />
      <span className="text-body text-foreground">{children}</span>
    </span>
  )
}

function PanelHeading({
  id,
  children,
  aside,
}: {
  id: string
  children: ReactNode
  aside?: ReactNode
}) {
  return (
    <div className="flex min-h-7 flex-wrap items-center justify-between gap-3">
      <h2 id={id} className={cn(LABEL, "text-muted-foreground")}>
        {children}
      </h2>
      {aside}
    </div>
  )
}

const PANEL = "rounded-xl border bg-card p-5"
const ROWS_PANEL = "overflow-hidden rounded-xl border bg-card"
const ROWS_HEAD = "border-b px-5 pt-5 pb-3"

type Step = { name: string; time: Stamp }

const STEPS: Step[] = [
  { name: "Booked", time: at("2026-11-10T15:22") },
  { name: "Collected", time: at("2026-11-10T17:48") },
  { name: "At depot", time: at("2026-11-10T21:06") },
  { name: "Out for delivery", time: at("2026-11-11T08:40") },
  { name: "Delivered", time: at("2026-11-11T13:45") },
]
const CURRENT_STEP = 3

type TimelineEvent = {
  id: string
  time: Stamp
  text: string
  by: string
  state?: { tone: Tone; word: string }
}

const EVENTS: TimelineEvent[] = [
  {
    id: "e6",
    time: at("2026-11-11T10:15"),
    text: "Road closure on the B1170 at Ferrow Bridge. The van is taking the diversion through Linden Road, and the new arrival time is 13:45.",
    by: "Route monitor",
    state: { tone: "caution", word: "Delayed" },
  },
  {
    id: "e5",
    time: at("2026-11-11T08:40"),
    text: "Loaded onto van NV-217 and left Easton Vale depot on route 14.",
    by: "Tomasz Wierzba",
  },
  {
    id: "e4",
    time: at("2026-11-11T06:55"),
    text: "Sorted to delivery route 14 with 38 other stops.",
    by: "Sorter 3, Easton Vale",
  },
  {
    id: "e3",
    time: at("2026-11-10T21:06"),
    text: "Arrived at Easton Vale depot and scanned in, 4 parcels.",
    by: "Dock scanner D2",
  },
  {
    id: "e2",
    time: at("2026-11-10T17:48"),
    text: "Collected from the sender's warehouse at Millbeck Trade Park.",
    by: "Marcus Hale",
  },
  {
    id: "e1",
    time: at("2026-11-10T15:22"),
    text: "Booked for next-day delivery before 12:00.",
    by: "Customer portal",
  },
]

const ITEMS = [
  {
    sku: "HB-TN-2204",
    description: "Two-person trekking tent, moss green",
    quantity: 2,
    weight: 6.8,
  },
  {
    sku: "HB-SB-0915",
    description: "Down sleeping bag, comfort to −5 °C",
    quantity: 3,
    weight: 4.2,
  },
  {
    sku: "HB-ST-0310",
    description: "Folding camp stove, steel",
    quantity: 1,
    weight: 1.6,
  },
  {
    sku: "HB-MT-1188",
    description: "Self-inflating sleeping mat, long",
    quantity: 4,
    weight: 5.8,
  },
]

const TOTAL_QUANTITY = ITEMS.reduce((sum, item) => sum + item.quantity, 0)
const TOTAL_WEIGHT = ITEMS.reduce((sum, item) => sum + item.weight, 0)

type Note = { id: string; text: string; by: string; time: Stamp }

const FIRST_NOTES: Note[] = [
  {
    id: "n2",
    text: "Called the recipient about the delay. Ruth Ainsley is at the clinic until 17:00, so an afternoon delivery is fine.",
    by: "Priya Nair",
    time: at("2026-11-11T09:12"),
  },
  {
    id: "n1",
    text: "Sender asks that the parcels go to the clinic's side door on Orchard Row, not the main entrance.",
    by: "Daniel Okafor",
    time: at("2026-11-10T15:40"),
  },
]

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [delivered, setDelivered] = useState<Stamp | null>(null)
  const [notes, setNotes] = useState<Note[]>(FIRST_NOTES)
  const [draft, setDraft] = useState("")
  const [noteError, setNoteError] = useState(false)
  const noteRef = useRef<HTMLTextAreaElement>(null)

  const events: TimelineEvent[] = delivered
    ? [
        {
          id: "e7",
          time: delivered,
          text: "Handed over at the clinic's side door on Orchard Row and signed for.",
          by: SIGNED_IN,
          state: { tone: "success", word: "Delivered" },
        },
        ...EVENTS,
      ]
    : EVENTS

  function markDelivered() {
    if (delivered) return
    setDelivered(stamp(new Date()))
  }

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) {
      setNoteError(true)
      noteRef.current?.focus()
      return
    }
    setNotes((current) => [
      {
        id: `n${Date.now()}`,
        text,
        by: SIGNED_IN,
        time: stamp(new Date()),
      },
      ...current,
    ])
    setDraft("")
    setNoteError(false)
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1280px] items-center px-3 py-3 md:px-5">
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground transition-colors duration-150",
              FOCUS
            )}
          >
            Northgate
          </a>
          <nav aria-label="Main" className="ml-8 hidden gap-5 md:flex">
            {NAV.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.current ? "true" : undefined}
                className={cn(
                  NAV_LINK,
                  link.current
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <p className={cn(FIGURE, "ml-auto hidden md:block")}>{SIGNED_IN}</p>
          <Button
            variant="outline"
            className={cn(BUTTON, "ml-auto md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="main-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t md:hidden"
        >
          <ul className="mx-auto max-w-[1280px] px-3 py-2 md:px-5">
            {NAV.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "true" : undefined}
                  className={cn(
                    NAV_LINK,
                    "block py-2",
                    link.current
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
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
        {/* Page header */}
        <div className="md:col-span-12">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <a
              href="/shipments"
              className={cn(
                NAV_LINK,
                "text-muted-foreground hover:text-foreground"
              )}
            >
              Shipments
            </a>
            <span
              aria-hidden="true"
              className="font-mono text-label text-muted-foreground"
            >
              /
            </span>
            <span
              aria-current="page"
              className="font-mono text-label text-foreground tabular-nums"
            >
              {SHIPMENT_ID}
            </span>
          </nav>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-h1">
                Shipment <span className="font-mono">{SHIPMENT_ID}</span>
              </h1>
              {delivered ? (
                <State tone="success">Delivered</State>
              ) : (
                <>
                  <State tone="neutral">Out for delivery</State>
                  <Badge
                    variant="outline"
                    className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
                  >
                    Delayed
                  </Badge>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className={BUTTON}>
                Print label
              </Button>
              <Button variant="secondary" className={BUTTON}>
                Reroute
              </Button>
              <Button
                className={BUTTON}
                onClick={markDelivered}
                disabled={delivered !== null}
                focusableWhenDisabled
              >
                Mark as delivered
              </Button>
            </div>
          </div>
          <p role="status" className="sr-only">
            {delivered ? `Shipment ${SHIPMENT_ID} marked as delivered.` : ""}
          </p>
        </div>

        {/* Main column */}
        <div className="flex flex-col gap-5 md:col-span-12 lg:col-span-8">
          <section aria-labelledby="progress-heading" className={PANEL}>
            <PanelHeading id="progress-heading">Progress</PanelHeading>
            <ol className="mt-3 grid gap-3 md:grid-cols-5">
              {STEPS.map((step, index) => {
                const last = index === STEPS.length - 1
                const status: "done" | "current" | "next" = delivered
                  ? "done"
                  : index < CURRENT_STEP
                    ? "done"
                    : index === CURRENT_STEP
                      ? "current"
                      : "next"
                const time = delivered && last ? delivered : step.time
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
                        status === "current" && "border-primary bg-primary"
                      )}
                    >
                      {status === "done" && (
                        <Check className="size-4" strokeWidth={1.5} />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="font-sans text-body font-medium">
                        {step.name}
                      </p>
                      <span className="sr-only">
                        {status === "done"
                          ? "Done"
                          : status === "current"
                            ? "Current"
                            : "To come"}
                      </span>
                      {status === "next" && (
                        <p className={cn(LABEL, "text-muted-foreground")}>
                          Expected
                        </p>
                      )}
                      <time
                        dateTime={time.iso}
                        className={cn(FIGURE, "block whitespace-nowrap")}
                      >
                        {time.text}
                      </time>
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>

          <section aria-labelledby="timeline-heading" className={ROWS_PANEL}>
            <div className={ROWS_HEAD}>
              <PanelHeading id="timeline-heading">Timeline</PanelHeading>
            </div>
            <ol>
              {events.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-col border-t px-5 py-3 first:border-t-0 md:flex-row md:items-baseline md:gap-5"
                >
                  <time
                    dateTime={event.time.iso}
                    className={cn(FIGURE, "md:w-32 md:shrink-0")}
                  >
                    {event.time.text}
                  </time>
                  <div className="mt-1 min-w-0 md:mt-0">
                    {event.state && (
                      <div className="mb-1">
                        <State tone={event.state.tone}>
                          {event.state.word}
                        </State>
                      </div>
                    )}
                    <p className="text-body">{event.text}</p>
                    <p className={cn(FIGURE, "mt-1")}>{event.by}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section
            aria-labelledby="items-heading"
            className={cn(ROWS_PANEL, "flex-1")}
          >
            <div className={ROWS_HEAD}>
              <PanelHeading
                id="items-heading"
                aside={
                  <p className={FIGURE}>
                    {plural(ITEMS.length, "item", "items")}
                  </p>
                }
              >
                Items
              </PanelHeading>
            </div>
            <Table label="Items" className="text-body">
              <TableHeader>
                <TableRow>
                  <TableHead
                    className={cn(LABEL, "px-5 text-muted-foreground")}
                  >
                    SKU
                  </TableHead>
                  <TableHead
                    className={cn(LABEL, "px-5 text-muted-foreground")}
                  >
                    Description
                  </TableHead>
                  <TableHead
                    className={cn(
                      LABEL,
                      "px-5 text-right text-muted-foreground"
                    )}
                  >
                    Quantity
                  </TableHead>
                  <TableHead
                    className={cn(
                      LABEL,
                      "px-5 text-right text-muted-foreground"
                    )}
                  >
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
                      {item.weight.toFixed(1)}
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
                    {TOTAL_WEIGHT.toFixed(1)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </section>
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-5 md:col-span-12 lg:col-span-4">
          <section aria-labelledby="details-heading" className={PANEL}>
            <PanelHeading id="details-heading">Details</PanelHeading>
            <dl className="mt-3">
              {[
                { term: "Customer", value: "Halden & Brook Outfitters" },
                { term: "Service", value: "Next day, before 12:00" },
                { term: "Depot", value: "Easton Vale" },
                {
                  term: "Weight",
                  value: `${TOTAL_WEIGHT.toFixed(1)} kg`,
                  mono: true,
                },
                { term: "Booked", time: at("2026-11-10T15:22") },
                { term: "Due", time: at("2026-11-11T12:00") },
              ].map((row) => (
                <div
                  key={row.term}
                  className="flex items-baseline justify-between gap-3 border-t py-2 first:border-t-0"
                >
                  <dt className={cn(LABEL, "text-muted-foreground")}>
                    {row.term}
                  </dt>
                  <dd
                    className={cn(
                      "text-right text-body",
                      (row.mono || row.time) && "font-mono tabular-nums"
                    )}
                  >
                    {row.time ? (
                      <time dateTime={row.time.iso}>{row.time.text}</time>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="addresses-heading" className={PANEL}>
            <PanelHeading id="addresses-heading">Addresses</PanelHeading>
            <div className="mt-3">
              <div>
                <h3 className={cn(LABEL, "text-muted-foreground")}>From</h3>
                <address className="mt-1 text-body not-italic">
                  Halden &amp; Brook Outfitters
                  <br />
                  Unit 7, Millbeck Trade Park
                  <br />
                  MB4 2QL Millbeck
                </address>
              </div>
              <div className="mt-5 border-t pt-5">
                <h3 className={cn(LABEL, "text-muted-foreground")}>To</h3>
                <address className="mt-1 text-body not-italic">
                  Ruth Ainsley
                  <br />
                  14 Orchard Row
                  <br />
                  FB2 7HN Ferrow Bridge
                </address>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="notes-heading"
            className={cn(PANEL, "flex-1")}
          >
            <PanelHeading id="notes-heading">Notes</PanelHeading>
            <form noValidate onSubmit={addNote} className="mt-3">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="note"
                  className={cn(LABEL, "text-muted-foreground")}
                >
                  Add a note
                </label>
                <Textarea
                  id="note"
                  ref={noteRef}
                  value={draft}
                  onChange={(event) => {
                    setDraft(event.target.value)
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
                    className="size-4 shrink-0"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  Write a note first.
                </p>
              )}
              <div className="mt-3">
                <Button type="submit" variant="secondary" className={BUTTON}>
                  Add note
                </Button>
              </div>
            </form>
            <ul className="mt-5">
              {notes.map((note) => (
                <li key={note.id} className="border-t py-3 last:pb-0">
                  <p className="text-body break-words whitespace-pre-line">
                    {note.text}
                  </p>
                  <p className={cn(FIGURE, "mt-1")}>
                    {note.by} ·{" "}
                    <time dateTime={note.time.iso}>{note.time.text}</time>
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
