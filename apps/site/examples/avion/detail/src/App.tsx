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

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const navLink = cn(
  "font-mono text-label text-muted-foreground uppercase transition-colors duration-150 hover:text-foreground",
  focusRing
)
const label = "font-mono text-label uppercase text-muted-foreground"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const buttonText = "px-5 font-mono text-label uppercase"

const SIGNED_IN = "Tomas Reyes"
const SHIPMENT_ID = "NG-48213"
// The sample's "now": 11 Nov, 13:50.
const NOW = { iso: "2026-11-11T13:50", text: "11 Nov, 13:50" }

const navItems = [
  { label: "Overview", href: "/" },
  { label: "Shipments", href: "/shipments", current: true },
  { label: "Depots", href: "/depots" },
  { label: "Reports", href: "/reports" },
]

type Stamp = { iso: string; text: string }

type Step = {
  name: string
  reached?: Stamp
  expected?: Stamp
}

const steps: Step[] = [
  {
    name: "Booked",
    reached: { iso: "2026-11-10T15:22", text: "10 Nov, 15:22" },
  },
  {
    name: "Collected",
    reached: { iso: "2026-11-10T17:05", text: "10 Nov, 17:05" },
  },
  {
    name: "At depot",
    reached: { iso: "2026-11-10T21:48", text: "10 Nov, 21:48" },
  },
  {
    name: "Out for delivery",
    reached: { iso: "2026-11-11T08:40", text: "11 Nov, 08:40" },
  },
  {
    name: "Delivered",
    expected: { iso: "2026-11-11T13:45", text: "11 Nov, 13:45" },
  },
]
const CURRENT_STEP = 3

type TimelineEvent = {
  id: string
  at: Stamp
  text: string
  by: string
  state?: { word: string; dot: string }
}

const initialEvents: TimelineEvent[] = [
  {
    id: "e6",
    at: { iso: "2026-11-11T11:32", text: "11 Nov, 11:32" },
    text: "The A614 is closed at Fernley after a collision, so the van is taking the diversion through Kelham Lane and will miss the 12:00 slot.",
    by: "Marcus Hale, driver",
    state: { word: "Delayed", dot: "bg-tertiary" },
  },
  {
    id: "e5",
    at: { iso: "2026-11-11T08:40", text: "11 Nov, 08:40" },
    text: "Loaded onto van 14 and left Ashby Cross depot on route AC-07.",
    by: "Marcus Hale, driver",
  },
  {
    id: "e4",
    at: { iso: "2026-11-11T06:15", text: "11 Nov, 06:15" },
    text: "Sorted to delivery route AC-07, stop 9 of 23.",
    by: "Route planner",
  },
  {
    id: "e3",
    at: { iso: "2026-11-10T21:48", text: "10 Nov, 21:48" },
    text: "Arrived at Ashby Cross depot and scanned in at bay 3.",
    by: "Depot scanner, Ashby Cross",
  },
  {
    id: "e2",
    at: { iso: "2026-11-10T17:05", text: "10 Nov, 17:05" },
    text: "Collected from the sender's warehouse, one parcel of 12.40 kg.",
    by: "Lena Ortiz, driver",
  },
  {
    id: "e1",
    at: { iso: "2026-11-10T15:22", text: "10 Nov, 15:22" },
    text: "Shipment booked through the customer portal for next-day delivery.",
    by: "Hollowmere Home Goods",
  },
]

const items = [
  {
    sku: "KT-1180",
    description: "Stainless steel kettle, 1.7 l",
    quantity: 2,
    unitKg: 1.4,
  },
  {
    sku: "MG-0425",
    description: "Stoneware mug set of four",
    quantity: 3,
    unitKg: 2.1,
  },
  {
    sku: "TL-3302",
    description: "Linen tea towels, pack of three",
    quantity: 4,
    unitKg: 0.35,
  },
  {
    sku: "CB-0917",
    description: "Oak chopping board, large",
    quantity: 1,
    unitKg: 1.9,
  },
]
const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
const totalKg = items.reduce(
  (sum, item) => sum + item.quantity * item.unitKg,
  0
)
const kg = (value: number) => value.toFixed(2)

type Note = { id: string; text: string; by: string; at: Stamp }

const initialNotes: Note[] = [
  {
    id: "n2",
    text: "Customer asked us to leave it with the neighbour at number 14 if nobody answers.",
    by: "Dev Ahuja",
    at: { iso: "2026-11-11T11:48", text: "11 Nov, 11:48" },
  },
  {
    id: "n1",
    text: "Called the recipient to confirm the new window. They are home until 17:00.",
    by: "Priya Nair",
    at: { iso: "2026-11-11T09:12", text: "11 Nov, 09:12" },
  },
]

function State({ dot, word }: { dot: string; word: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", dot)}
      />
      <span className="text-body text-foreground">{word}</span>
    </span>
  )
}

function PanelHeading({
  children,
  aside,
}: {
  children: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <div className="flex min-h-7 flex-wrap items-center justify-between gap-3">
      <h2 className={label}>{children}</h2>
      {aside}
    </div>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [delivered, setDelivered] = React.useState(false)
  const [events, setEvents] = React.useState(initialEvents)
  const [notes, setNotes] = React.useState(initialNotes)
  const [draft, setDraft] = React.useState("")
  const [noteError, setNoteError] = React.useState(false)
  const [status, setStatus] = React.useState("")
  const menuButtonRef = React.useRef<HTMLButtonElement>(null)
  const noteRef = React.useRef<HTMLTextAreaElement>(null)

  function onHeaderKeyDown(event: React.KeyboardEvent) {
    if (menuOpen && event.key === "Escape") {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  function markDelivered() {
    if (delivered) return
    setDelivered(true)
    setEvents((current) => [
      {
        id: "e7",
        at: NOW,
        text: "Delivered to the recipient at the front door and signed for.",
        by: SIGNED_IN,
        state: { word: "Delivered", dot: "bg-success" },
      },
      ...current,
    ])
    setStatus(`Shipment ${SHIPMENT_ID} marked as delivered.`)
  }

  function addNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) {
      setNoteError(true)
      noteRef.current?.focus()
      return
    }
    setNotes((current) => [
      { id: `n${Date.now()}`, text, by: SIGNED_IN, at: NOW },
      ...current,
    ])
    setDraft("")
    setNoteError(false)
  }

  const currentStep = delivered ? -1 : CURRENT_STEP

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card" onKeyDown={onHeaderKeyDown}>
        <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-3 py-3 md:px-5">
          <a
            href="/"
            className={cn(
              "font-heading text-h2 transition-colors duration-150",
              focusRing
            )}
          >
            Northgate
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={item.current ? "true" : undefined}
                    className={cn(navLink, item.current && "text-foreground")}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className={cn(smallFigure, "ml-auto hidden md:block")}>
            {SIGNED_IN}
          </p>
          <Button
            ref={menuButtonRef}
            variant="outline"
            className={cn(buttonText, "ml-auto md:hidden")}
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
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? "true" : undefined}
                  className={cn(
                    navLink,
                    "block py-2",
                    item.current && "text-foreground"
                  )}
                >
                  {item.label}
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
            <a href="/shipments" className={navLink}>
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
                <State dot="bg-success" word="Delivered" />
              ) : (
                <State dot="bg-muted-foreground" word="Out for delivery" />
              )}
              {!delivered && (
                <Badge
                  variant="outline"
                  className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
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
                onClick={markDelivered}
              >
                Mark as delivered
              </Button>
            </div>
          </div>
          <div role="status" className="sr-only">
            {status}
          </div>
        </div>

        {/* Main column */}
        <div className="flex flex-col gap-5 md:col-span-12 lg:col-span-8">
          <section className="rounded-xl border bg-card p-5">
            <PanelHeading>Progress</PanelHeading>
            <ol className="mt-3 grid gap-3 md:grid-cols-5">
              {steps.map((step, index) => {
                const isLast = index === steps.length - 1
                const done = delivered || index < CURRENT_STEP
                const current = index === currentStep
                const reached = delivered && isLast ? NOW : step.reached
                return (
                  <li
                    key={step.name}
                    aria-current={current ? "step" : undefined}
                    className="flex gap-3 md:flex-col md:gap-2"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-sm border",
                        done &&
                          "border-secondary bg-secondary text-secondary-foreground",
                        current && "border-primary bg-primary",
                        !done && !current && "border-muted-foreground"
                      )}
                    >
                      {done && (
                        <Check
                          className="size-4"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <div>
                      <p className="font-sans text-body font-medium">
                        {step.name}
                        <span className="sr-only">
                          {done
                            ? ", Done"
                            : current
                              ? ", Current"
                              : ", To come"}
                        </span>
                      </p>
                      {done || current ? (
                        reached && (
                          <time
                            dateTime={reached.iso}
                            className={cn(
                              smallFigure,
                              "block whitespace-nowrap"
                            )}
                          >
                            {reached.text}
                          </time>
                        )
                      ) : (
                        <>
                          <p className={label}>Expected</p>
                          {step.expected && (
                            <time
                              dateTime={step.expected.iso}
                              className={cn(
                                smallFigure,
                                "block whitespace-nowrap"
                              )}
                            >
                              {step.expected.text}
                            </time>
                          )}
                        </>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>

          <section className="overflow-hidden rounded-xl border bg-card">
            <div className="border-b px-5 pt-5 pb-3">
              <PanelHeading>Timeline</PanelHeading>
            </div>
            <ol>
              {events.map((event, index) => (
                <li
                  key={event.id}
                  className={cn(
                    "flex flex-col px-5 py-3 md:flex-row md:items-baseline md:gap-5",
                    index > 0 && "border-t"
                  )}
                >
                  <time
                    dateTime={event.at.iso}
                    className={cn(smallFigure, "block md:w-32 md:shrink-0")}
                  >
                    {event.at.text}
                  </time>
                  <div className="mt-1 min-w-0 md:mt-0">
                    {event.state && (
                      <div className="mb-1">
                        <State dot={event.state.dot} word={event.state.word} />
                      </div>
                    )}
                    <p className="text-body">{event.text}</p>
                    <p className={cn(smallFigure, "mt-1")}>{event.by}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="flex-1 overflow-hidden rounded-xl border bg-card">
            <div className="border-b px-5 pt-5 pb-3">
              <PanelHeading
                aside={
                  <p className={smallFigure}>
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </p>
                }
              >
                Items
              </PanelHeading>
            </div>
            <Table label="Items" className="text-body">
              <TableHeader>
                <TableRow>
                  <TableHead className={cn(label, "px-5")}>SKU</TableHead>
                  <TableHead className={cn(label, "px-5")}>
                    Description
                  </TableHead>
                  <TableHead className={cn(label, "px-5 text-right")}>
                    Quantity
                  </TableHead>
                  <TableHead className={cn(label, "px-5 text-right")}>
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
                    <TableCell className="px-5 py-2">
                      {item.description}
                    </TableCell>
                    <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                      {kg(item.quantity * item.unitKg)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="font-medium">
                  <TableCell className="px-5 py-2">Total</TableCell>
                  <TableCell className="px-5 py-2" />
                  <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                    {totalQuantity}
                  </TableCell>
                  <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                    {kg(totalKg)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </section>
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-5 md:col-span-12 lg:col-span-4">
          <section className="rounded-xl border bg-card p-5">
            <PanelHeading>Details</PanelHeading>
            <dl className="mt-3">
              {[
                { term: "Customer", value: "Hollowmere Home Goods" },
                { term: "Service", value: "Next day, before 12:00" },
                { term: "Depot", value: "Ashby Cross" },
                {
                  term: "Weight",
                  value: (
                    <span className="font-mono tabular-nums">
                      {kg(totalKg)} kg
                    </span>
                  ),
                },
                {
                  term: "Booked",
                  value: (
                    <time
                      dateTime="2026-11-10T15:22"
                      className="font-mono tabular-nums"
                    >
                      10 Nov, 15:22
                    </time>
                  ),
                },
                {
                  term: "Due",
                  value: (
                    <time
                      dateTime="2026-11-11T12:00"
                      className="font-mono tabular-nums"
                    >
                      11 Nov, 12:00
                    </time>
                  ),
                },
              ].map((row, index) => (
                <div
                  key={row.term}
                  className={cn(
                    "flex items-baseline justify-between gap-3 py-2",
                    index > 0 && "border-t"
                  )}
                >
                  <dt className={label}>{row.term}</dt>
                  <dd className="text-right text-body">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-xl border bg-card p-5">
            <PanelHeading>Addresses</PanelHeading>
            <div className="mt-3">
              <div>
                <h3 className={label}>From</h3>
                <address className="mt-1 text-body not-italic">
                  <span className="block">Hollowmere Home Goods</span>
                  <span className="block">
                    Unit 6, Brackenfield Trading Estate
                  </span>
                  <span className="block">DE55 7RT Alfreton</span>
                </address>
              </div>
              <div className="mt-5 border-t pt-5">
                <h3 className={label}>To</h3>
                <address className="mt-1 text-body not-italic">
                  <span className="block">Joanna Whitlock</span>
                  <span className="block">12 Rowan Close</span>
                  <span className="block">NG22 8QH Kelham</span>
                </address>
              </div>
            </div>
          </section>

          <section className="flex-1 rounded-xl border bg-card p-5">
            <PanelHeading>Notes</PanelHeading>
            <form noValidate onSubmit={addNote} className="mt-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="note" className={label}>
                  Add a note
                </label>
                <Textarea
                  ref={noteRef}
                  id="note"
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
              <Button
                type="submit"
                variant="secondary"
                className={cn(buttonText, "mt-3")}
              >
                Add note
              </Button>
            </form>
            <ul className="mt-5">
              {notes.map((note) => (
                <li key={note.id} className="border-t py-3 last:pb-0">
                  <p className="text-body wrap-break-word">{note.text}</p>
                  <p className={cn(smallFigure, "mt-1")}>
                    {note.by} ·{" "}
                    <time dateTime={note.at.iso}>{note.at.text}</time>
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
