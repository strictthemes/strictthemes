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

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const runningLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)

const headerLink = cn(
  "text-body text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const buttonClasses = "h-auto rounded-md px-5 py-2 font-mono text-label"

const navLinks = [
  { label: "Book", href: "/" },
  { label: "Departures", href: "/departures", current: true },
  { label: "My booking", href: "/ticket" },
  { label: "Help", href: "#" },
]

type Port = "Port Ellery" | "Brindle Ness" | "Wrenholm" | "Tollan Quay"

type State =
  | { kind: "departed" }
  | { kind: "boarding" }
  | { kind: "onTime" }
  | { kind: "delayed"; minutes: number; now: string }
  | { kind: "cancelled" }

type Sailing = {
  time: string
  destination: Port
  callsAt?: Port
  ship: string
  berth: number
  state: State
}

const sailings: Sailing[] = [
  {
    time: "06:30",
    destination: "Port Ellery",
    ship: "MV Merlin Tide",
    berth: 2,
    state: { kind: "departed" },
  },
  {
    time: "07:10",
    destination: "Brindle Ness",
    ship: "MV Harrier",
    berth: 4,
    state: { kind: "departed" },
  },
  {
    time: "08:00",
    destination: "Wrenholm",
    ship: "MV Kestrel Dawn",
    berth: 1,
    state: { kind: "boarding" },
  },
  {
    time: "09:15",
    destination: "Port Ellery",
    ship: "MV Isla Grey",
    berth: 2,
    state: { kind: "onTime" },
  },
  {
    time: "10:05",
    destination: "Tollan Quay",
    ship: "MV Shearwater",
    berth: 3,
    state: { kind: "delayed", minutes: 20, now: "10:25" },
  },
  {
    time: "11:30",
    destination: "Brindle Ness",
    ship: "MV Harrier",
    berth: 4,
    state: { kind: "onTime" },
  },
  {
    time: "12:40",
    destination: "Port Ellery",
    callsAt: "Brindle Ness",
    ship: "MV Merlin Tide",
    berth: 2,
    state: { kind: "onTime" },
  },
  {
    time: "14:00",
    destination: "Wrenholm",
    ship: "MV Kestrel Dawn",
    berth: 1,
    state: { kind: "cancelled" },
  },
  {
    time: "15:30",
    destination: "Port Ellery",
    ship: "MV Isla Grey",
    berth: 2,
    state: { kind: "onTime" },
  },
  {
    time: "17:20",
    destination: "Tollan Quay",
    ship: "MV Shearwater",
    berth: 3,
    state: { kind: "onTime" },
  },
  {
    time: "19:00",
    destination: "Port Ellery",
    ship: "MV Merlin Tide",
    berth: 2,
    state: { kind: "onTime" },
  },
]

const filters: Array<"All" | Port> = [
  "All",
  "Port Ellery",
  "Brindle Ness",
  "Wrenholm",
  "Tollan Quay",
]

function StateMark({
  label,
  dot,
  text,
}: {
  label: string
  dot: string
  text: string
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", dot)}
      />
      <span className={cn("font-mono text-label", text)}>{label}</span>
    </span>
  )
}

function SailingState({ state }: { state: State }) {
  switch (state.kind) {
    case "departed":
      return (
        <StateMark
          label="Departed"
          dot="bg-muted-foreground"
          text="text-muted-foreground"
        />
      )
    case "onTime":
      return <StateMark label="On time" dot="bg-success" text="text-success" />
    case "cancelled":
      return (
        <StateMark
          label="Cancelled"
          dot="bg-destructive"
          text="text-destructive"
        />
      )
    case "boarding":
      return (
        <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
          Boarding
        </Badge>
      )
    case "delayed":
      return (
        <>
          <StateMark
            label={`Delayed ${state.minutes} min`}
            dot="bg-foreground"
            text="text-foreground"
          />
          <span className="mt-1 block font-mono text-label text-foreground tabular-nums">
            Now <time dateTime={state.now}>{state.now}</time>
          </span>
        </>
      )
  }
}

function statusLine(filter: "All" | Port, count: number) {
  const noun = count === 1 ? "sailing" : "sailings"
  return filter === "All"
    ? `Showing ${count} ${noun}`
    : `Showing ${count} ${noun} to ${filter}`
}

function App() {
  const [filter, setFilter] = useState<"All" | Port>("All")

  const shown = sailings.filter(
    (s) => filter === "All" || s.destination === filter || s.callsAt === filter
  )

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-2 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground transition-colors duration-150",
              focusRing
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
                    className={cn(headerLink, link.current && "underline")}
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
            <p className="font-mono text-label text-muted-foreground">
              Harrowmouth · HRW · Berths 1–4
            </p>
            <h1 className="mt-2 text-h1">Departures from Harrowmouth</h1>
            <p className="mt-3 max-w-xl">
              This board follows the ships as they move, and a berth can still
              change up to 20 minutes before a sailing, so check it again before
              you head down.
            </p>
            <p className="mt-3 font-mono text-label text-foreground tabular-nums">
              <time dateTime="2026-12-18">Friday 18 December 2026</time> ·
              Updated <time dateTime="07:48">07:48</time>
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
                <StateMark
                  label="Cancelled"
                  dot="bg-destructive"
                  text="text-destructive"
                />
              </p>
              <h2 id="notice-heading" className="mt-2 text-h2">
                The <time dateTime="14:00">14:00</time> to Wrenholm is cancelled
              </h2>
              <p className="mt-3 max-w-xl text-body">
                High winds are forecast for the afternoon, so this sailing will
                not run. If you are booked on it, you can move to the{" "}
                <time dateTime="08:00">08:00</time> to Wrenholm on{" "}
                <time dateTime="2026-12-19">Saturday 19 December 2026</time> at
                no cost, or have a full refund.
              </p>
              <p className="mt-3">
                <a href="/ticket" className={runningLink}>
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
            45 minutes before if you are travelling with a vehicle.
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
                {filters.map((option) => {
                  const chosen = option === filter
                  return (
                    <Button
                      key={option}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      onClick={() => setFilter(option)}
                      className={buttonClasses}
                    >
                      {option}
                    </Button>
                  )
                })}
              </div>
              <p
                role="status"
                className="mt-3 font-mono text-label text-muted-foreground"
              >
                {statusLine(filter, shown.length)}
              </p>
            </div>
            <Table label="Departures board" className="text-body">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {["Time", "Destination", "Ship", "Berth", "State"].map(
                    (heading) => (
                      <TableHead
                        key={heading}
                        scope="col"
                        className="h-auto px-5 py-3 font-mono text-label text-muted-foreground"
                      >
                        {heading}
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
                      <span className="block text-body">
                        {sailing.destination}
                      </span>
                      {sailing.callsAt && (
                        <span className="mt-1 block font-mono text-label text-muted-foreground">
                          Calls at {sailing.callsAt}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-body">
                      {sailing.ship}
                    </TableCell>
                    <TableCell className="px-5 py-3 font-mono text-label text-foreground tabular-nums">
                      {sailing.berth}
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <SailingState state={sailing.state} />
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
              <div className="flex items-baseline justify-between gap-5 py-2 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label text-muted-foreground">
                  Address
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground">
                  <address className="not-italic">
                    <span className="block">Harbour Road</span>
                    <span className="block">Harrowmouth</span>
                    <span className="block">HW1 4QS</span>
                  </address>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-5 py-2 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label text-muted-foreground">
                  Check-in desk
                </dt>
                <dd className="min-w-0 text-right font-mono text-label text-foreground tabular-nums">
                  Opens <time dateTime="05:45">05:45</time>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-5 py-2 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label text-muted-foreground">
                  Foot passengers
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground">
                  Desk closes 30 min before
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-5 py-2 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label text-muted-foreground">
                  Vehicles
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground">
                  Lane closes 45 min before
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-5 py-2 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label text-muted-foreground">
                  Parking
                </dt>
                <dd className="min-w-0 text-right font-mono text-label text-foreground tabular-nums">
                  Long stay · £8.00 a day
                </dd>
              </div>
            </dl>
          </div>
          <div className="rounded-xl border bg-card p-5 md:col-span-4 md:col-start-9">
            <p className="font-mono text-label text-muted-foreground">
              Sailing another day?
            </p>
            <h3 className="mt-2 text-h2">Book a crossing</h3>
            <p className="mt-3">
              Fares are lowest a few weeks ahead, and you can add dogs and
              bicycles when you book.
            </p>
            <div className="mt-5">
              <a href="/" className={cn(buttonVariants(), buttonClasses)}>
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
              <p className="mt-2">
                Crossings from Harrowmouth to Port Ellery, Brindle Ness,
                Wrenholm and Tollan Quay since 1987.
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <p className="font-mono text-label text-muted-foreground">
                Customer desk
              </p>
              <p className="mt-2 text-body">
                Call{" "}
                <a href="tel:+441632960512" className={runningLink}>
                  01632 960 512
                </a>{" "}
                for help with a booking.
              </p>
              <p className="mt-2 font-mono text-label text-muted-foreground tabular-nums">
                Every day · <time dateTime="06:00">06:00</time>–
                <time dateTime="22:00">22:00</time>
              </p>
            </div>
          </div>
          <p className="mt-5 font-mono text-label text-muted-foreground">
            © 2026 Kestrel Ferries
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
