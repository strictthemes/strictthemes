import { useState } from "react"
import { Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SailingState = "Seats free" | "Few seats left" | "Sold out"

type Sailing = {
  id: string
  departs: string
  arrives: string
  minutes: number
  duration: string
  way: "Direct" | "1 stop"
  call?: string
  ship: string
  fare: number | null
  state?: SailingState
  badge?: string
}

type SortOrder = "departure" | "price" | "duration"

const FROM = "Harrowmouth"
const TO = "Port Ellery"
const PASSENGERS = "2 adults"

const sailings: Sailing[] = [
  {
    id: "0630",
    departs: "06:30",
    arrives: "08:15",
    minutes: 105,
    duration: "1 h 45 min",
    way: "Direct",
    ship: "MV Merlin Tide",
    fare: 64,
    state: "Seats free",
  },
  {
    id: "0915",
    departs: "09:15",
    arrives: "11:00",
    minutes: 105,
    duration: "1 h 45 min",
    way: "Direct",
    ship: "MV Isla Grey",
    fare: 78,
    state: "Seats free",
  },
  {
    id: "1240",
    departs: "12:40",
    arrives: "14:35",
    minutes: 115,
    duration: "1 h 55 min",
    way: "1 stop",
    call: "Calls at Brindle Ness · 10 min stop",
    ship: "MV Merlin Tide",
    fare: 58,
    badge: "Lowest fare",
  },
  {
    id: "1530",
    departs: "15:30",
    arrives: "17:15",
    minutes: 105,
    duration: "1 h 45 min",
    way: "Direct",
    ship: "MV Isla Grey",
    fare: null,
    state: "Sold out",
  },
  {
    id: "1900",
    departs: "19:00",
    arrives: "20:45",
    minutes: 105,
    duration: "1 h 45 min",
    way: "Direct",
    ship: "MV Merlin Tide",
    fare: 64,
    state: "Few seats left",
  },
]

const sortOptions: { value: SortOrder; label: string; status: string }[] = [
  { value: "departure", label: "Departure", status: "earliest first" },
  { value: "price", label: "Price", status: "lowest fare first" },
  { value: "duration", label: "Duration", status: "shortest first" },
]

const stateStyles: Record<SailingState, { dot: string; word: string }> = {
  "Seats free": { dot: "bg-primary", word: "text-foreground" },
  "Few seats left": { dot: "bg-foreground", word: "text-foreground" },
  "Sold out": { dot: "bg-muted-foreground", word: "text-muted-foreground" },
}

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)

const headerLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const buttonText = "h-auto rounded-md px-5 py-2 font-mono text-label"

const navLinks = [
  { label: "Book", href: "/", current: true },
  { label: "Departures", href: "/departures", current: false },
  { label: "My booking", href: "/ticket", current: false },
  { label: "Help", href: "#", current: false },
]

function formatFare(fare: number) {
  return `£${fare.toFixed(2)}`
}

// The sailings come in order of leaving, and the sort is stable, so ties
// keep that order. A sold-out sailing goes last under price and duration.
function sortSailings(list: Sailing[], order: SortOrder) {
  if (order === "departure") return list
  return [...list].sort((a, b) => {
    const aSoldOut = a.fare === null
    const bSoldOut = b.fare === null
    if (aSoldOut !== bSoldOut) return aSoldOut ? 1 : -1
    if (aSoldOut || bSoldOut) return 0
    if (order === "price") return (a.fare ?? 0) - (b.fare ?? 0)
    return a.minutes - b.minutes
  })
}

function SailingStatus({ state }: { state: SailingState }) {
  const styles = stateStyles[state]
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn("size-2 shrink-0 rounded-full", styles.dot)}
        aria-hidden="true"
      />
      <span className={cn("font-mono text-label", styles.word)}>{state}</span>
    </span>
  )
}

function Journey({ sailing, small }: { sailing: Sailing; small?: boolean }) {
  const timeClass = cn(
    "font-mono text-foreground tabular-nums",
    small ? "text-label" : "text-h2"
  )
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0">
        <p className={timeClass}>
          <time dateTime={sailing.departs}>{sailing.departs}</time>
        </p>
        <p className="mt-1 font-mono text-label text-muted-foreground">
          {FROM}
        </p>
      </div>
      <div className="min-w-0 flex-1 text-center">
        <p className="font-mono text-label text-muted-foreground">
          {sailing.duration}
        </p>
        <div className="mt-1 h-px bg-border" aria-hidden="true" />
        <p className="mt-1 font-mono text-label text-muted-foreground">
          {sailing.way}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className={timeClass}>
          <time dateTime={sailing.arrives}>{sailing.arrives}</time>
        </p>
        <p className="mt-1 font-mono text-label text-muted-foreground">{TO}</p>
      </div>
    </div>
  )
}

export function App() {
  const [chosenId, setChosenId] = useState("0915")
  const [sortOrder, setSortOrder] = useState<SortOrder>("departure")

  const sorted = sortSailings(sailings, sortOrder)
  const chosen = sailings.find((sailing) => sailing.id === chosenId)
  const sortStatus = sortOptions.find((option) => option.value === sortOrder)
  const count = `${sailings.length} ${sailings.length === 1 ? "sailing" : "sailings"}`

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
                    aria-current={link.current ? "true" : undefined}
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
              Step 1 of 3 · Choose a sailing
            </p>
            <h1 className="mt-2 text-h1">
              {FROM} to {TO}
            </h1>
            <p className="mt-3 font-mono text-label text-foreground">
              <time dateTime="2026-12-19">Saturday 19 December 2026</time> · One
              way · {PASSENGERS}
            </p>
            <p className="mt-3">
              <a href="/" className={textLink}>
                Change search
              </a>
            </p>
          </div>
        </section>

        <section className="mt-16 grid gap-5 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-8">
            <h2 className="text-h2">Sailings</h2>
            <p className="mt-3 max-w-xl">
              Fares are for {PASSENGERS}, one way, and include port fees.
            </p>

            <div className="mt-5 rounded-xl border bg-card p-5">
              <p id="sort-label" className="font-mono text-label text-foreground">
                Sort by
              </p>
              <div
                role="group"
                aria-labelledby="sort-label"
                className="mt-2 flex flex-wrap gap-2"
              >
                {sortOptions.map((option) => {
                  const pressed = option.value === sortOrder
                  return (
                    <Button
                      key={option.value}
                      variant={pressed ? "secondary" : "outline"}
                      aria-pressed={pressed}
                      className={buttonText}
                      onClick={() => setSortOrder(option.value)}
                    >
                      {option.label}
                    </Button>
                  )
                })}
              </div>
              <p
                role="status"
                className="mt-3 font-mono text-label text-muted-foreground"
              >
                {count}, {sortStatus?.status}
              </p>
            </div>

            <ol className="mt-5 grid gap-5">
              {sorted.map((sailing) => {
                const isChosen = sailing.id === chosenId
                return (
                  <li
                    key={sailing.id}
                    className={cn(
                      "rounded-xl border bg-card p-5",
                      isChosen && "border-primary"
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
                      {sailing.badge ? (
                        <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
                          {sailing.badge}
                        </Badge>
                      ) : (
                        sailing.state && <SailingStatus state={sailing.state} />
                      )}
                      {isChosen && (
                        <span className="inline-flex items-center gap-2 font-mono text-label text-foreground">
                          <Check
                            className="size-4"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          Chosen
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-center">
                      <div className="md:min-w-0 md:flex-1">
                        <Journey sailing={sailing} />
                      </div>
                      {sailing.fare !== null && (
                        <div className="flex items-center justify-end gap-5 md:shrink-0">
                          <div className="text-right">
                            <p className="font-mono text-h2 text-foreground tabular-nums">
                              {formatFare(sailing.fare)}
                            </p>
                            <p className="mt-1 font-mono text-label text-muted-foreground">
                              {PASSENGERS}
                            </p>
                          </div>
                          <Button
                            variant={isChosen ? "secondary" : "outline"}
                            aria-pressed={isChosen}
                            aria-label={`Choose the ${sailing.departs} sailing`}
                            className={buttonText}
                            onClick={() => setChosenId(sailing.id)}
                          >
                            Choose
                          </Button>
                        </div>
                      )}
                    </div>

                    {sailing.call && (
                      <p className="mt-3 font-mono text-label text-muted-foreground">
                        {sailing.call}
                      </p>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>

          <aside
            aria-labelledby="summary-heading"
            className="rounded-xl border bg-card p-5 lg:sticky lg:top-5 lg:col-span-4"
          >
            <p className="font-mono text-label text-muted-foreground">
              Your sailing
            </p>
            <h2 id="summary-heading" className="mt-2 text-h2">
              Summary
            </h2>
            {chosen && (
              <>
                <div className="mt-5">
                  <Journey sailing={chosen} small />
                </div>
                <dl className="mt-5 divide-y">
                  <div className="flex items-baseline justify-between gap-5 py-2 first:pt-0 last:pb-0">
                    <dt className="shrink-0 font-mono text-label text-muted-foreground">
                      Date
                    </dt>
                    <dd className="min-w-0 text-right text-body text-foreground">
                      <time dateTime="2026-12-19">
                        Saturday 19 December 2026
                      </time>
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-5 py-2 first:pt-0 last:pb-0">
                    <dt className="shrink-0 font-mono text-label text-muted-foreground">
                      Ship
                    </dt>
                    <dd className="min-w-0 text-right text-body text-foreground">
                      {chosen.ship}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-5 py-2 first:pt-0 last:pb-0">
                    <dt className="shrink-0 font-mono text-label text-muted-foreground">
                      Passengers
                    </dt>
                    <dd className="min-w-0 text-right text-body text-foreground">
                      {PASSENGERS}
                    </dd>
                  </div>
                </dl>
                <div className="mt-5 flex items-baseline justify-between gap-5 border-t pt-3">
                  <p className="font-mono text-label text-foreground">Total</p>
                  {chosen.fare !== null && (
                    <p className="font-mono text-h2 text-foreground tabular-nums">
                      {formatFare(chosen.fare)}
                    </p>
                  )}
                </div>
              </>
            )}
            <div className="mt-5">
              <a
                href="/details"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  buttonText,
                  "w-full"
                )}
              >
                Continue
              </a>
            </div>
            <p className="mt-3 font-mono text-label text-muted-foreground">
              Passenger names and extras come next.
            </p>
          </aside>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="text-h2">Before you sail</h2>
            <p className="mt-3 max-w-xl">
              Check-in at {FROM} closes 30 minutes before a sailing for foot
              passengers and 45 minutes before if you bring a vehicle. Fares go
              up as a sailing fills, so the price you see now is the lowest it
              will be.
            </p>
            <p className="mt-3">
              <a href="/departures" className={textLink}>
                Today's departures from {FROM}
              </a>
            </p>
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
              <p className="font-mono text-label text-muted-foreground">
                Customer desk
              </p>
              <p className="mt-2 text-body">
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
