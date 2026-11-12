import { useId, useRef, useState, type FormEvent, type ReactNode } from "react"
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

const SIGNED_IN = "Priya Nair"
const SHIPMENT_ID = "NG-48213"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const buttonText = "px-5 font-mono text-label uppercase"
const panel = "rounded-xl border bg-card p-5"
const rowsPanel = "overflow-hidden rounded-xl border bg-card"
const headingRow = "flex min-h-7 flex-wrap items-center justify-between gap-3"
const panelHeading = "font-mono text-label text-muted-foreground uppercase"

const navLinks = [
  { name: "Overview", href: "/" },
  { name: "Shipments", href: "/shipments" },
  { name: "Depots", href: "/depots" },
  { name: "Reports", href: "/reports" },
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

type Stamp = { text: string; dateTime: string }

function pad(n: number) {
  return String(n).padStart(2, "0")
}

function stampFrom(d: Date): Stamp {
  return {
    text: `${d.getDate()} ${MONTHS[d.getMonth()]}, ${pad(d.getHours())}:${pad(d.getMinutes())}`,
    dateTime: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`,
  }
}

function stamp(day: number, time: string): Stamp {
  return {
    text: `${day} Nov, ${time}`,
    dateTime: `2026-11-${pad(day)}T${time}`,
  }
}

function plural(n: number, noun: string) {
  return `${n} ${noun}${n === 1 ? "" : "s"}`
}

type StateKind = "good" | "failed" | "caution" | "neutral"

const dotColor: Record<StateKind, string> = {
  good: "bg-success",
  failed: "bg-destructive",
  caution: "bg-tertiary",
  neutral: "bg-muted-foreground",
}

function State({ kind, children }: { kind: StateKind; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", dotColor[kind])}
      />
      <span className="text-body text-foreground">{children}</span>
    </span>
  )
}

function PanelHeading({
  children,
  aside,
}: {
  children: ReactNode
  aside?: ReactNode
}) {
  return (
    <div className={headingRow}>
      <h2 className={panelHeading}>{children}</h2>
      {aside}
    </div>
  )
}

const steps = [
  { name: "Booked", reached: stamp(10, "11:02") },
  { name: "Collected", reached: stamp(10, "16:30") },
  { name: "At depot", reached: stamp(10, "21:50") },
  { name: "Out for delivery", reached: stamp(11, "08:40") },
  { name: "Delivered", reached: null as Stamp | null },
]
const CURRENT_STEP = 3
const EXPECTED = stamp(11, "15:30")

type TimelineEvent = {
  id: string
  at: Stamp
  text: string
  by: string
  state?: { kind: StateKind; word: string }
}

const initialEvents: TimelineEvent[] = [
  {
    id: "e6",
    at: stamp(11, "10:25"),
    text: "Road closure on the A614 near Ollerton. The driver is going round through Edwinstowe, and arrival moves back by about 90 minutes.",
    by: "Route planner",
    state: { kind: "caution", word: "Delayed" },
  },
  {
    id: "e5",
    at: stamp(11, "08:40"),
    text: "Loaded on van NG-V27 and left the Mansfield depot on the south round.",
    by: "Tomás Reyes, driver",
  },
  {
    id: "e4",
    at: stamp(11, "06:15"),
    text: "Sorted onto the Mansfield south round, stop 14 of 31.",
    by: "Sorting line 3",
  },
  {
    id: "e3",
    at: stamp(10, "21:50"),
    text: "Arrived at the Mansfield depot and scanned in, all four parcels.",
    by: "Depot scan, Mansfield",
  },
  {
    id: "e2",
    at: stamp(10, "16:30"),
    text: "Collected from the sender's loading dock in Nottingham.",
    by: "Sam Okafor, driver",
  },
  {
    id: "e1",
    at: stamp(10, "11:02"),
    text: "Booked through the customer portal for next-day delivery.",
    by: "Hallam Garden Supply",
  },
]

const items = [
  { sku: "HGS-2041", description: "Raised bed kit, cedar", qty: 2, kg: 18.4 },
  { sku: "HGS-1187", description: "Compost bin, 330 L", qty: 1, kg: 9.6 },
  { sku: "HGS-0532", description: "Drip irrigation set", qty: 3, kg: 4.2 },
  { sku: "HGS-0918", description: "Seed trays, pack of 10", qty: 4, kg: 2.8 },
]
const totalQty = items.reduce((sum, i) => sum + i.qty, 0)
const totalKg = items.reduce((sum, i) => sum + i.kg, 0)

type Note = { id: string; text: string; by: string; at: Stamp }

const initialNotes: Note[] = [
  {
    id: "n2",
    text: "Customer asked for the parcels to go in the side porch if nobody answers.",
    by: "Priya Nair",
    at: stamp(11, "09:12"),
  },
  {
    id: "n1",
    text: "Two boxes are over 15 kg. The driver needs a trolley at the drop.",
    by: "Daniel Osei",
    at: stamp(10, "17:05"),
  },
]

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [deliveredAt, setDeliveredAt] = useState<Stamp | null>(null)
  const [events, setEvents] = useState(initialEvents)
  const [notes, setNotes] = useState(initialNotes)
  const [draft, setDraft] = useState("")
  const [noteError, setNoteError] = useState(false)
  const [status, setStatus] = useState("")
  const noteField = useRef<HTMLTextAreaElement>(null)
  const ids = useId()
  const noteFieldId = `${ids}-note`
  const noteErrorId = `${ids}-note-error`
  const delivered = deliveredAt !== null

  function markDelivered() {
    if (delivered) return
    const now = stampFrom(new Date())
    setDeliveredAt(now)
    setEvents((prev) => [
      {
        id: `e-delivered`,
        at: now,
        text: "Handed over to the recipient and marked as delivered in the console.",
        by: SIGNED_IN,
        state: { kind: "good", word: "Delivered" },
      },
      ...prev,
    ])
    setStatus(`Shipment ${SHIPMENT_ID} marked as delivered.`)
  }

  function addNote(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) {
      setNoteError(true)
      noteField.current?.focus()
      return
    }
    setNotes((prev) => [
      {
        id: `n-${Date.now()}`,
        text,
        by: SIGNED_IN,
        at: stampFrom(new Date()),
      },
      ...prev,
    ])
    setDraft("")
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-3 py-3 md:px-5">
          <a
            href="/"
            className={cn(
              "rounded-sm font-heading text-h2 text-foreground",
              focusOutline
            )}
          >
            Northgate
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={link.name === "Shipments" ? "true" : undefined}
                    className={cn(
                      label,
                      "transition-colors duration-150",
                      link.name === "Shipments"
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                      focusOutline
                    )}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className={cn(smallFigure, "ml-auto hidden md:block")}>
            {SIGNED_IN}
          </p>
          <Button
            variant="outline"
            className={cn(buttonText, "ml-auto md:hidden")}
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
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.name === "Shipments" ? "true" : undefined}
                  className={cn(
                    label,
                    "block py-2 transition-colors duration-150",
                    link.name === "Shipments"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                    focusOutline
                  )}
                >
                  {link.name}
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
                label,
                "text-muted-foreground transition-colors duration-150 hover:text-foreground",
                focusOutline
              )}
            >
              Shipments
            </a>
            <span aria-hidden="true" className={smallFigure}>
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
                Shipment{" "}
                <span className="font-mono tabular-nums">{SHIPMENT_ID}</span>
              </h1>
              {delivered ? (
                <State kind="good">Delivered</State>
              ) : (
                <>
                  <State kind="neutral">Out for delivery</State>
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
                onClick={markDelivered}
              >
                Mark as delivered
              </Button>
            </div>
          </div>
          <p role="status" className="sr-only">
            {status}
          </p>
        </div>

        {/* Main column */}
        <div className="flex flex-col gap-5 md:col-span-12 lg:col-span-8">
          <section className={panel}>
            <PanelHeading>Progress</PanelHeading>
            <ol className="mt-3 grid gap-3 md:grid-cols-5">
              {steps.map((step, index) => {
                const state = delivered
                  ? "done"
                  : index < CURRENT_STEP
                    ? "done"
                    : index === CURRENT_STEP
                      ? "current"
                      : "to-come"
                const reached =
                  delivered && index === steps.length - 1
                    ? deliveredAt
                    : step.reached
                return (
                  <li
                    key={step.name}
                    aria-current={state === "current" ? "step" : undefined}
                    className="flex gap-3 md:flex-col md:gap-2"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-sm border",
                        state === "done" &&
                          "border-secondary bg-secondary text-secondary-foreground",
                        state === "current" && "border-primary bg-primary"
                      )}
                    >
                      {state === "done" && (
                        <Check className="size-4" strokeWidth={1.5} />
                      )}
                    </span>
                    <div>
                      <p className="font-sans text-body font-medium">
                        {step.name}
                        <span className="sr-only">
                          ,{" "}
                          {state === "done"
                            ? "Done"
                            : state === "current"
                              ? "Current"
                              : "To come"}
                        </span>
                      </p>
                      {state === "to-come" ? (
                        <>
                          <p className={cn(label, "text-muted-foreground")}>
                            Expected
                          </p>
                          <time
                            dateTime={EXPECTED.dateTime}
                            className={cn(smallFigure, "block whitespace-nowrap")}
                          >
                            {EXPECTED.text}
                          </time>
                        </>
                      ) : (
                        reached && (
                          <time
                            dateTime={reached.dateTime}
                            className={cn(smallFigure, "block whitespace-nowrap")}
                          >
                            {reached.text}
                          </time>
                        )
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>

          <section className={rowsPanel}>
            <div className="border-b px-5 pt-5 pb-3">
              <PanelHeading>Timeline</PanelHeading>
            </div>
            <ol>
              {events.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-col border-t px-5 py-3 first:border-t-0 md:flex-row md:gap-5"
                >
                  <time
                    dateTime={event.at.dateTime}
                    className={cn(smallFigure, "shrink-0 md:w-32")}
                  >
                    {event.at.text}
                  </time>
                  <div className="mt-1 md:mt-0">
                    {event.state && (
                      <div className="mb-1">
                        <State kind={event.state.kind}>{event.state.word}</State>
                      </div>
                    )}
                    <p className="text-body">{event.text}</p>
                    <p className={cn(smallFigure, "mt-1")}>{event.by}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className={cn(rowsPanel, "flex-1")}>
            <div className="border-b px-5 pt-5 pb-3">
              <PanelHeading
                aside={
                  <p className={smallFigure}>{plural(items.length, "item")}</p>
                }
              >
                Items
              </PanelHeading>
            </div>
            <Table label="Items" className="text-body">
              <TableHeader>
                <TableRow>
                  <TableHead className={cn(label, "px-5 text-muted-foreground")}>
                    SKU
                  </TableHead>
                  <TableHead className={cn(label, "px-5 text-muted-foreground")}>
                    Description
                  </TableHead>
                  <TableHead
                    className={cn(label, "px-5 text-right text-muted-foreground")}
                  >
                    Quantity
                  </TableHead>
                  <TableHead
                    className={cn(label, "px-5 text-right text-muted-foreground")}
                  >
                    Weight <span className="normal-case">(kg)</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.sku}>
                    <TableCell className="px-5 py-2 font-mono tabular-nums">
                      {item.sku}
                    </TableCell>
                    <TableCell className="px-5 py-2">{item.description}</TableCell>
                    <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                      {item.qty}
                    </TableCell>
                    <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                      {item.kg.toFixed(1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="font-medium">
                  <TableCell className="px-5 py-2">Total</TableCell>
                  <TableCell className="px-5 py-2" />
                  <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                    {totalQty}
                  </TableCell>
                  <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                    {totalKg.toFixed(1)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </section>
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-5 md:col-span-12 lg:col-span-4">
          <section className={panel}>
            <PanelHeading>Details</PanelHeading>
            <dl className="mt-3">
              {[
                { term: "Customer", value: "Hallam Garden Supply" },
                { term: "Service", value: "Next day, before 18:00" },
                { term: "Depot", value: "Mansfield" },
                {
                  term: "Weight",
                  value: (
                    <span className="font-mono tabular-nums">
                      {totalKg.toFixed(1)} kg
                    </span>
                  ),
                },
                {
                  term: "Booked",
                  value: (
                    <time
                      dateTime={steps[0].reached!.dateTime}
                      className="font-mono tabular-nums"
                    >
                      {steps[0].reached!.text}
                    </time>
                  ),
                },
                {
                  term: "Due",
                  value: (
                    <time
                      dateTime="2026-11-11T18:00"
                      className="font-mono tabular-nums"
                    >
                      11 Nov, 18:00
                    </time>
                  ),
                },
              ].map((row) => (
                <div
                  key={row.term}
                  className="flex items-baseline justify-between gap-3 border-t py-2 first:border-t-0"
                >
                  <dt className={cn(label, "text-muted-foreground")}>
                    {row.term}
                  </dt>
                  <dd className="text-right text-body">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={panel}>
            <PanelHeading>Addresses</PanelHeading>
            <div className="mt-3">
              <div>
                <h3 className={cn(label, "text-muted-foreground")}>From</h3>
                <address className="mt-1 text-body not-italic">
                  Hallam Garden Supply
                  <br />
                  Unit 4, Lenton Trade Park
                  <br />
                  NG7 2PX Nottingham
                </address>
              </div>
              <div className="mt-5 border-t pt-5">
                <h3 className={cn(label, "text-muted-foreground")}>To</h3>
                <address className="mt-1 text-body not-italic">
                  Ellen Marsh
                  <br />
                  17 Church Lane
                  <br />
                  NG22 9PL Ollerton
                </address>
              </div>
            </div>
          </section>

          <section className={cn(panel, "flex-1")}>
            <PanelHeading>Notes</PanelHeading>
            <form noValidate onSubmit={addNote} className="mt-3">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={noteFieldId}
                  className={cn(label, "text-muted-foreground")}
                >
                  Add a note
                </label>
                <Textarea
                  ref={noteField}
                  id={noteFieldId}
                  value={draft}
                  aria-invalid={noteError || undefined}
                  aria-describedby={noteError ? noteErrorId : undefined}
                  onChange={(e) => {
                    setDraft(e.target.value)
                    setNoteError(false)
                  }}
                  className="min-h-24 text-body md:text-body"
                />
              </div>
              {noteError && (
                <p
                  id={noteErrorId}
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
              <Button type="submit" variant="secondary" className={cn(buttonText, "mt-3")}>
                Add note
              </Button>
            </form>
            <ul className="mt-5">
              {notes.map((note) => (
                <li key={note.id} className="border-t py-3 last:pb-0">
                  <p className="text-body">{note.text}</p>
                  <p className={cn(smallFigure, "mt-1")}>
                    {note.by} ·{" "}
                    <time dateTime={note.at.dateTime}>{note.at.text}</time>
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
