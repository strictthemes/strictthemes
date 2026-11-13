import { useState, type ReactNode } from "react"

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

type Port = "Port Ellery" | "Brindle Ness" | "Wrenholm" | "Tollan Quay"

type StateName = "Departed" | "Boarding" | "On time" | "Delayed" | "Cancelled"

type Sailing = {
  time: string
  destination: Port
  callsAt?: Port
  ship: string
  berth: number
  state: StateName
  newTime?: string
}

const SAILINGS: Sailing[] = [
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
    state: "Delayed",
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

const FILTERS: Array<"All" | Port> = [
  "All",
  "Port Ellery",
  "Brindle Ness",
  "Wrenholm",
  "Tollan Quay",
]

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)

const headerLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const buttonLook = "h-auto rounded-md px-5 py-2 font-mono text-label"

const NAV = [
  { label: "Book", href: "/" },
  { label: "Departures", href: "/departures" },
  { label: "My booking", href: "/ticket" },
  { label: "Help", href: "#" },
]

function State({
  dot,
  word,
  children,
}: {
  dot: string
  word: string
  children: ReactNode
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", dot)}
      />
      <span className={cn("font-mono text-label", word)}>{children}</span>
    </span>
  )
}

function SailingState({ sailing }: { sailing: Sailing }) {
  switch (sailing.state) {
    case "Boarding":
      return (
        <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
          Boarding
        </Badge>
      )
    case "Departed":
      return (
        <State dot="bg-muted-foreground" word="text-muted-foreground">
          Departed
        </State>
      )
    case "On time":
      return (
        <State dot="bg-success" word="text-success">
          On time
        </State>
      )
    case "Cancelled":
      return (
        <State dot="bg-destructive" word="text-destructive">
          Cancelled
        </State>
      )
    case "Delayed":
      return (
        <>
          <State dot="bg-foreground" word="text-foreground">
            Delayed 20 min
          </State>
          <span className="mt-1 block font-mono text-label text-foreground tabular-nums">
            Now <time dateTime={sailing.newTime}>{sailing.newTime}</time>
          </span>
        </>
      )
  }
}

function countLine(filter: "All" | Port, count: number) {
  const noun = count === 1 ? "sailing" : "sailings"
  if (filter === "All") return `Showing ${count} ${noun}`
  return `Showing ${count} ${noun} for ${filter}`
}

export function App() {
  const [filter, setFilter] = useState<"All" | Port>("All")

  const shown =
    filter === "All"
      ? SAILINGS
      : SAILINGS.filter((s) => s.destination === filter || s.callsAt === filter)

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-2 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <a href="/" className={cn("font-heading text-h2", headerLink)}>
            Kestrel Ferries
          </a>
          <nav aria-label="Main">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {NAV.map((item) => {
                const current = item.href === "/departures"
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "text-body",
                        headerLink,
                        current && "underline"
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-5">
        <section className="grid grid-cols-1 gap-5 pt-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="font-mono text-label text-muted-foreground">
              Harrowmouth · HRW · Berths 1–4
            </p>
            <h1 className="mt-2 text-h1">Departures from Harrowmouth</h1>
            <p className="mt-3 max-w-xl">
              This board follows the ships as they move, and a berth can still
              change up to 20 minutes before a sailing.
            </p>
            <p className="mt-3 font-mono text-label text-foreground tabular-nums">
              <time dateTime="2026-12-18">Friday 18 December 2026</time> ·
              Updated <time dateTime="07:48">07:48</time>
            </p>
          </div>
        </section>

        <section className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-12">
          <section
            aria-labelledby="notice-heading"
            className="rounded-xl border bg-card p-5 md:col-span-8"
          >
            <p>
              <State dot="bg-destructive" word="text-destructive">
                Cancelled
              </State>
            </p>
            <h2 id="notice-heading" className="mt-2 text-h2">
              The{" "}
              <time dateTime="14:00" className="tabular-nums">
                14:00
              </time>{" "}
              to Wrenholm is cancelled
            </h2>
            <p className="mt-3 max-w-xl text-body">
              High winds are forecast for the afternoon. If you are booked on
              this sailing, you can move to the{" "}
              <time dateTime="08:00" className="tabular-nums">
                08:00
              </time>{" "}
              to Wrenholm on{" "}
              <time dateTime="2026-12-19">Saturday 19 December 2026</time> at no
              cost, or have a full refund.
            </p>
            <p className="mt-3 max-w-xl">
              <a href="/ticket" className={textLink}>
                Change a booking
              </a>
            </p>
          </section>
        </section>

        <section className="mt-16">
          <h2 className="text-h2">Departures board</h2>
          <p className="mt-3 max-w-xl">
            Check-in closes 30 minutes before a sailing for foot passengers, and
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
                {FILTERS.map((option) => {
                  const chosen = option === filter
                  return (
                    <Button
                      key={option}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen ? "true" : "false"}
                      onClick={() => setFilter(option)}
                      className={buttonLook}
                    >
                      {option}
                    </Button>
                  )
                })}
              </div>
              <p
                role="status"
                className="mt-3 font-mono text-label text-muted-foreground tabular-nums"
              >
                {countLine(filter, shown.length)}
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
                    <TableCell className="px-5 py-3">
                      <span className="font-mono text-label text-foreground tabular-nums">
                        {sailing.berth}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <SailingState sailing={sailing} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-12 md:items-start">
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
                <dd className="min-w-0 text-right font-mono text-label text-foreground tabular-nums">
                  Desk closes 30 min before
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-5 py-2 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label text-muted-foreground">
                  Vehicles
                </dt>
                <dd className="min-w-0 text-right font-mono text-label text-foreground tabular-nums">
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
            <p className="mt-3 max-w-xl">
              Fares are lowest a few weeks ahead, and you can add dogs and
              bicycles when you book.
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
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">Kestrel Ferries</p>
              <p className="mt-2 max-w-xl">
                Crossings from Harrowmouth to Port Ellery, Brindle Ness,
                Wrenholm and Tollan Quay since 1987.
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <p className="font-mono text-label text-muted-foreground">
                Customer desk
              </p>
              <p className="mt-2 max-w-xl text-body">
                <a href="tel:+441632960512" className={textLink}>
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
