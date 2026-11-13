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

const runningLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)

const headerLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const buttonClasses = "h-auto rounded-md px-5 py-2 font-mono text-label"

type Port = "Port Ellery" | "Brindle Ness" | "Wrenholm" | "Tollan Quay"

type StateName = "Departed" | "On time" | "Delayed 20 min" | "Cancelled"

type Sailing = {
  time: string
  destination: Port
  callsAt?: Port
  ship: string
  berth: number
  state: StateName | "Boarding"
  newTime?: string
}

const sailings: Sailing[] = [
  {
    time: "06:30",
    destination: "Port Ellery",
    ship: "MV Merlin Tide",
    berth: 2,
    state: "Departed",
  },
  {
    time: "07:10",
    destination: "Brindle Ness",
    ship: "MV Harrier",
    berth: 4,
    state: "Departed",
  },
  {
    time: "08:00",
    destination: "Wrenholm",
    ship: "MV Kestrel Dawn",
    berth: 1,
    state: "Boarding",
  },
  {
    time: "09:15",
    destination: "Port Ellery",
    ship: "MV Isla Grey",
    berth: 2,
    state: "On time",
  },
  {
    time: "10:05",
    destination: "Tollan Quay",
    ship: "MV Shearwater",
    berth: 3,
    state: "Delayed 20 min",
    newTime: "10:25",
  },
  {
    time: "11:30",
    destination: "Brindle Ness",
    ship: "MV Harrier",
    berth: 4,
    state: "On time",
  },
  {
    time: "12:40",
    destination: "Port Ellery",
    callsAt: "Brindle Ness",
    ship: "MV Merlin Tide",
    berth: 2,
    state: "On time",
  },
  {
    time: "14:00",
    destination: "Wrenholm",
    ship: "MV Kestrel Dawn",
    berth: 1,
    state: "Cancelled",
  },
  {
    time: "15:30",
    destination: "Port Ellery",
    ship: "MV Isla Grey",
    berth: 2,
    state: "On time",
  },
  {
    time: "17:20",
    destination: "Tollan Quay",
    ship: "MV Shearwater",
    berth: 3,
    state: "On time",
  },
  {
    time: "19:00",
    destination: "Port Ellery",
    ship: "MV Merlin Tide",
    berth: 2,
    state: "On time",
  },
]

const filters: Array<"All" | Port> = [
  "All",
  "Port Ellery",
  "Brindle Ness",
  "Wrenholm",
  "Tollan Quay",
]

const stateStyles: Record<StateName, { dot: string; word: string }> = {
  Departed: { dot: "bg-muted-foreground", word: "text-muted-foreground" },
  "On time": { dot: "bg-success", word: "text-success" },
  "Delayed 20 min": { dot: "bg-foreground", word: "text-foreground" },
  Cancelled: { dot: "bg-destructive", word: "text-destructive" },
}

function State({ name }: { name: StateName }) {
  const style = stateStyles[name]
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", style.dot)}
      />
      <span className={cn("font-mono text-label", style.word)}>{name}</span>
    </span>
  )
}

const navLinks = [
  { label: "Book", href: "/" },
  { label: "Departures", href: "/departures", current: true },
  { label: "My booking", href: "/ticket" },
  { label: "Help", href: "#" },
]

export function App() {
  const [destination, setDestination] = useState<"All" | Port>("All")

  const shown =
    destination === "All"
      ? sailings
      : sailings.filter(
          (s) => s.destination === destination || s.callsAt === destination
        )

  const count = `Showing ${shown.length} ${shown.length === 1 ? "sailing" : "sailings"}`
  const statusText =
    destination === "All" ? count : `${count} to ${destination}`

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-2 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <a href="/" className={cn(headerLink, "font-heading text-h2")}>
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
                      headerLink,
                      "text-body",
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
            <p className="font-mono text-label text-muted-foreground">
              Harrowmouth · HRW · Berths 1–4
            </p>
            <h1 className="mt-2 text-h1">Departures from Harrowmouth</h1>
            <p className="mt-3 max-w-xl">
              This board follows the ships as they come and go, and a berth can
              change up to 20 minutes before a sailing.
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
                <State name="Cancelled" />
              </p>
              <h2 id="notice-heading" className="mt-2 text-h2 tabular-nums">
                The <time dateTime="14:00">14:00</time> to Wrenholm is cancelled
              </h2>
              <p className="mt-3 max-w-xl text-body tabular-nums">
                High winds are forecast for this afternoon. If you are booked on
                this sailing, you can move to the{" "}
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
            45 minutes before for passengers with a vehicle.
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
                  const chosen = option === destination
                  return (
                    <Button
                      key={option}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen ? "true" : "false"}
                      className={buttonClasses}
                      onClick={() => setDestination(option)}
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
                {statusText}
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
                {shown.map((s) => (
                  <TableRow key={s.time} className="hover:bg-transparent">
                    <TableCell className="px-5 py-3">
                      <time
                        dateTime={s.time}
                        className="font-mono text-h2 text-foreground tabular-nums"
                      >
                        {s.time}
                      </time>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <span className="block text-body">{s.destination}</span>
                      {s.callsAt && (
                        <span className="mt-1 block font-mono text-label text-muted-foreground">
                          Calls at {s.callsAt}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-body">
                      {s.ship}
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <span className="font-mono text-label text-foreground tabular-nums">
                        {s.berth}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      {s.state === "Boarding" ? (
                        <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
                          Boarding
                        </Badge>
                      ) : (
                        <State name={s.state} />
                      )}
                      {s.newTime && (
                        <span className="mt-1 block font-mono text-label text-foreground tabular-nums">
                          Now <time dateTime={s.newTime}>{s.newTime}</time>
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
                <dd className="min-w-0 text-right font-mono text-label text-foreground">
                  Desk closes 30 min before
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-5 py-2 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label text-muted-foreground">
                  Vehicles
                </dt>
                <dd className="min-w-0 text-right font-mono text-label text-foreground">
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
              <a
                href="/"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  buttonClasses
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
                <a href="tel:+441632960512" className={runningLink}>
                  01632 960 512
                </a>
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
