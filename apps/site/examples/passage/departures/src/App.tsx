import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const headerLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)

const buttonLook = "h-auto rounded-md px-5 py-2 font-mono text-label"

const mutedLabel = "font-mono text-label text-muted-foreground"

type State = "Departed" | "On time" | "Delayed 20 min" | "Cancelled"

const stateLook: Record<State, { dot: string; word: string }> = {
  Departed: { dot: "bg-muted-foreground", word: "text-muted-foreground" },
  "On time": { dot: "bg-success", word: "text-success" },
  "Delayed 20 min": { dot: "bg-foreground", word: "text-foreground" },
  Cancelled: { dot: "bg-destructive", word: "text-destructive" },
}

function StateMark({ state }: { state: State }) {
  const look = stateLook[state]
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", look.dot)}
      />
      <span className={cn("font-mono text-label", look.word)}>{state}</span>
    </span>
  )
}

const ports = ["Port Ellery", "Brindle Ness", "Wrenholm", "Tollan Quay"] as const

type Port = (typeof ports)[number]

type Sailing = {
  time: string
  to: Port
  callsAt?: Port
  ship: string
  berth: number
  state: State | "Boarding"
  now?: string
}

const sailings: Sailing[] = [
  { time: "06:30", to: "Port Ellery", ship: "MV Merlin Tide", berth: 2, state: "Departed" },
  { time: "07:10", to: "Brindle Ness", ship: "MV Harrier", berth: 4, state: "Departed" },
  { time: "08:00", to: "Wrenholm", ship: "MV Kestrel Dawn", berth: 1, state: "Boarding" },
  { time: "09:15", to: "Port Ellery", ship: "MV Isla Grey", berth: 2, state: "On time" },
  {
    time: "10:05",
    to: "Tollan Quay",
    ship: "MV Shearwater",
    berth: 3,
    state: "Delayed 20 min",
    now: "10:25",
  },
  { time: "11:30", to: "Brindle Ness", ship: "MV Harrier", berth: 4, state: "On time" },
  {
    time: "12:40",
    to: "Port Ellery",
    callsAt: "Brindle Ness",
    ship: "MV Merlin Tide",
    berth: 2,
    state: "On time",
  },
  { time: "14:00", to: "Wrenholm", ship: "MV Kestrel Dawn", berth: 1, state: "Cancelled" },
  { time: "15:30", to: "Port Ellery", ship: "MV Isla Grey", berth: 2, state: "On time" },
  { time: "17:20", to: "Tollan Quay", ship: "MV Shearwater", berth: 3, state: "On time" },
  { time: "19:00", to: "Port Ellery", ship: "MV Merlin Tide", berth: 2, state: "On time" },
]

const navLinks = [
  { label: "Book", href: "/" },
  { label: "Departures", href: "/departures", current: true },
  { label: "My booking", href: "/ticket" },
  { label: "Help", href: "#" },
]

const dlRow = "flex items-baseline justify-between gap-5 py-2 first:pt-0 last:pb-0"
const dlTerm = cn(mutedLabel, "shrink-0")
const dlValue = "min-w-0 text-right text-body text-foreground"
const dlLabelValue =
  "min-w-0 text-right font-mono text-label text-foreground tabular-nums"

export function App() {
  const [destination, setDestination] = useState<Port | "All">("All")

  const shown =
    destination === "All"
      ? sailings
      : sailings.filter(
          (sailing) =>
            sailing.to === destination || sailing.callsAt === destination
        )

  const count = `${shown.length} ${shown.length === 1 ? "sailing" : "sailings"}`
  const status =
    destination === "All"
      ? `Showing ${count}`
      : `Showing ${count} to ${destination}`

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-2 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground transition-colors duration-150",
              focusOutline
            )}
          >
            Kestrel Ferries
          </a>
          <nav aria-label="Main">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className={cn(
                      "text-body",
                      headerLink,
                      link.current && "underline"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-5">
        <section className="grid gap-5 pt-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className={mutedLabel}>Harrowmouth · HRW · Berths 1–4</p>
            <h1 className="mt-2 text-h1">Departures from Harrowmouth</h1>
            <p className="mt-3 max-w-xl">
              This board follows the ships as they move, and a berth can change
              up to 20 minutes before a sailing.
            </p>
            <p className="mt-3 font-mono text-label text-foreground tabular-nums">
              <time dateTime="2026-12-18">Friday 18 December 2026</time>
              {" · "}Updated <time dateTime="07:48">07:48</time>
            </p>
          </div>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-12">
          <div className="md:col-span-8">
            <section
              aria-labelledby="notice-heading"
              className="rounded-xl border bg-card p-5"
            >
              <p>
                <StateMark state="Cancelled" />
              </p>
              <h2 id="notice-heading" className="mt-2 text-h2">
                The <time dateTime="14:00">14:00</time> to Wrenholm is
                cancelled
              </h2>
              <p className="mt-3 max-w-xl text-body">
                High winds are forecast for the afternoon. If you are booked on
                it, you can move to the <time dateTime="08:00">08:00</time> to
                Wrenholm on{" "}
                <time dateTime="2026-12-19">Saturday 19 December 2026</time> at
                no cost, or have a full refund.
              </p>
              <p className="mt-3">
                <a href="/ticket" className={textLink}>
                  Change a booking
                </a>
              </p>
            </section>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-h2">Departures board</h2>
          <p className="mt-3 max-w-xl">
            Check-in closes 30 minutes before a sailing for foot passengers and
            45 minutes before with a vehicle.
          </p>
          <div className="mt-5 overflow-hidden rounded-xl border bg-card">
            <div className="border-b p-5">
              <p
                id="destination-label"
                className="font-mono text-label text-foreground"
              >
                Destination
              </p>
              <div
                role="group"
                aria-labelledby="destination-label"
                className="mt-2 flex flex-wrap gap-2"
              >
                {(["All", ...ports] as const).map((port) => {
                  const chosen = port === destination
                  return (
                    <Button
                      key={port}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      className={buttonLook}
                      onClick={() => setDestination(port)}
                    >
                      {port}
                    </Button>
                  )
                })}
              </div>
              <p role="status" className={cn(mutedLabel, "mt-3")}>
                {status}
              </p>
            </div>
            <Table label="Departures board" className="text-body">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {["Time", "Destination", "Ship", "Berth", "State"].map(
                    (name) => (
                      <TableHead
                        key={name}
                        scope="col"
                        className={cn(mutedLabel, "h-auto px-5 py-3")}
                      >
                        {name}
                      </TableHead>
                    )
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.map((sailing) => (
                  <TableRow key={sailing.time} className="hover:bg-transparent">
                    <TableCell className="px-5 py-3">
                      <time
                        dateTime={sailing.time}
                        className="font-mono text-h2 text-foreground tabular-nums"
                      >
                        {sailing.time}
                      </time>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <span className="block text-body">{sailing.to}</span>
                      {sailing.callsAt && (
                        <span className={cn(mutedLabel, "mt-1 block")}>
                          Calls at {sailing.callsAt}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-body">
                      {sailing.ship}
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <span className="font-mono text-label text-foreground tabular-nums">
                        {sailing.berth}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      {sailing.state === "Boarding" ? (
                        <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
                          Boarding
                        </Badge>
                      ) : (
                        <StateMark state={sailing.state} />
                      )}
                      {sailing.now && (
                        <span className="mt-1 block font-mono text-label text-foreground tabular-nums">
                          Now <time dateTime={sailing.now}>{sailing.now}</time>
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7">
            <h2 className="text-h2">At the port</h2>
            <dl className="mt-5 divide-y">
              <div className={dlRow}>
                <dt className={dlTerm}>Address</dt>
                <dd className={dlValue}>
                  <address className="not-italic">
                    <span className="block">Harbour Road</span>
                    <span className="block">Harrowmouth</span>
                    <span className="block">HW1 4QS</span>
                  </address>
                </dd>
              </div>
              <div className={dlRow}>
                <dt className={dlTerm}>Check-in desk</dt>
                <dd className={dlLabelValue}>
                  Opens <time dateTime="05:45">05:45</time>
                </dd>
              </div>
              <div className={dlRow}>
                <dt className={dlTerm}>Foot passengers</dt>
                <dd className={dlValue}>Desk closes 30 min before</dd>
              </div>
              <div className={dlRow}>
                <dt className={dlTerm}>Vehicles</dt>
                <dd className={dlValue}>Lane closes 45 min before</dd>
              </div>
              <div className={dlRow}>
                <dt className={dlTerm}>Parking</dt>
                <dd className={dlLabelValue}>Long stay · £8.00 a day</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-xl border bg-card p-5 md:col-span-4 md:col-start-9">
            <p className={mutedLabel}>Sailing another day?</p>
            <h3 className="mt-2 text-h2">Book a crossing</h3>
            <p className="mt-3">
              Fares are lowest a few weeks ahead, and dogs and bicycles can be
              added when you book.
            </p>
            <div className="mt-5">
              <a
                href="/"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  buttonLook
                )}
              >
                Search sailings
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t bg-card">
        <div className="mx-auto max-w-[1120px] px-5 py-8">
          <div className="grid gap-5 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">Kestrel Ferries</p>
              <p className="mt-2 max-w-xl">
                Crossings from Harrowmouth to Port Ellery, Brindle Ness,
                Wrenholm and Tollan Quay since 1987.
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <p className={mutedLabel}>Customer desk</p>
              <p className="mt-2 text-body">
                <a href="tel:+441632960512" className={textLink}>
                  01632 960 512
                </a>
              </p>
              <p className={cn(mutedLabel, "mt-2 tabular-nums")}>
                Every day · <time dateTime="06:00">06:00</time>–
                <time dateTime="22:00">22:00</time>
              </p>
            </div>
          </div>
          <p className={cn(mutedLabel, "mt-5")}>© 2026 Kestrel Ferries</p>
        </div>
      </footer>
    </div>
  )
}

export default App
