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
  stops: number
  ship: string
  fare: number | null
  state: SailingState
  badge?: string
  note?: string
}

const SAILINGS: Sailing[] = [
  {
    id: "0630",
    departs: "06:30",
    arrives: "08:15",
    minutes: 105,
    stops: 0,
    ship: "MV Merlin Tide",
    fare: 64,
    state: "Seats free",
  },
  {
    id: "0915",
    departs: "09:15",
    arrives: "11:00",
    minutes: 105,
    stops: 0,
    ship: "MV Isla Grey",
    fare: 78,
    state: "Seats free",
  },
  {
    id: "1240",
    departs: "12:40",
    arrives: "14:35",
    minutes: 115,
    stops: 1,
    ship: "MV Merlin Tide",
    fare: 58,
    state: "Seats free",
    badge: "Lowest fare",
    note: "Calls at Brindle Ness · 10 min stop",
  },
  {
    id: "1530",
    departs: "15:30",
    arrives: "17:15",
    minutes: 105,
    stops: 0,
    ship: "MV Isla Grey",
    fare: null,
    state: "Sold out",
  },
  {
    id: "1900",
    departs: "19:00",
    arrives: "20:45",
    minutes: 105,
    stops: 0,
    ship: "MV Merlin Tide",
    fare: 64,
    state: "Few seats left",
  },
]

const FROM = "Harrowmouth"
const TO = "Port Ellery"
const PASSENGERS = "2 adults"

type SortKey = "departure" | "price" | "duration"

const SORTS: { key: SortKey; label: string; phrase: string }[] = [
  { key: "departure", label: "Departure", phrase: "earliest first" },
  { key: "price", label: "Price", phrase: "lowest fare first" },
  { key: "duration", label: "Duration", phrase: "shortest first" },
]

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const inlineLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const headerLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const buttonClasses = "h-auto rounded-md px-5 py-2 font-mono text-label"

function formatFare(fare: number) {
  return `£${fare.toFixed(2)}`
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} h`
  return `${h} h ${m} min`
}

function formatStops(stops: number) {
  if (stops === 0) return "Direct"
  return stops === 1 ? "1 stop" : `${stops} stops`
}

function sortSailings(list: Sailing[], key: SortKey) {
  const byDeparture = [...list].sort((a, b) =>
    a.departs.localeCompare(b.departs)
  )
  if (key === "departure") return byDeparture
  return byDeparture.sort((a, b) => {
    const aOut = a.fare === null
    const bOut = b.fare === null
    if (aOut !== bOut) return aOut ? 1 : -1
    if (key === "price") return (a.fare ?? 0) - (b.fare ?? 0)
    return a.minutes - b.minutes
  })
}

function StateMark({ state }: { state: SailingState }) {
  const dot =
    state === "Sold out"
      ? "bg-muted-foreground"
      : state === "Few seats left"
        ? "bg-foreground"
        : "bg-primary"
  const word =
    state === "Sold out" ? "text-muted-foreground" : "text-foreground"
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", dot)}
      />
      <span className={cn("font-mono text-label", word)}>{state}</span>
    </span>
  )
}

function Journey({
  sailing,
  small = false,
}: {
  sailing: Sailing
  small?: boolean
}) {
  const timeClass = small
    ? "font-mono text-label text-foreground tabular-nums"
    : "font-mono text-h2 text-foreground tabular-nums"
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
          {formatDuration(sailing.minutes)}
        </p>
        <div aria-hidden="true" className="mt-1 h-px bg-border" />
        <p className="mt-1 font-mono text-label text-muted-foreground">
          {formatStops(sailing.stops)}
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
  const [sailings] = useState<Sailing[]>(SAILINGS)
  const [chosenId, setChosenId] = useState("0915")
  const [sortKey, setSortKey] = useState<SortKey>("departure")

  const sorted = sortSailings(sailings, sortKey)
  const chosen = sailings.find((s) => s.id === chosenId) ?? sailings[0]
  const sortPhrase = SORTS.find((s) => s.key === sortKey)?.phrase
  const count = sailings.length

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-2 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <a href="/" className={cn("font-heading text-h2", headerLink)}>
            Kestrel Ferries
          </a>
          <nav aria-label="Main">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              <li>
                <a
                  href="/"
                  aria-current="true"
                  className={cn("text-body underline", headerLink)}
                >
                  Book
                </a>
              </li>
              <li>
                <a href="/departures" className={cn("text-body", headerLink)}>
                  Departures
                </a>
              </li>
              <li>
                <a href="/ticket" className={cn("text-body", headerLink)}>
                  My booking
                </a>
              </li>
              <li>
                <a href="#" className={cn("text-body", headerLink)}>
                  Help
                </a>
              </li>
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
            <h1 className="mt-2 text-h1">Harrowmouth to Port Ellery</h1>
            <p className="mt-3 font-mono text-label text-foreground tabular-nums">
              <time dateTime="2026-12-19">Saturday 19 December 2026</time> · One
              way · {PASSENGERS}
            </p>
            <p className="mt-3">
              <a href="/" className={inlineLink}>
                Change search
              </a>
            </p>
          </div>
        </section>

        <section className="mt-16 grid gap-5 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-8">
            <h2 className="text-h2">Sailings</h2>
            <p className="mt-3 max-w-xl">
              Fares are for the whole booking of 2 adults, one way, and include
              port fees.
            </p>

            <div className="mt-5 rounded-xl border bg-card p-5">
              <p
                id="sort-label"
                className="font-mono text-label text-foreground"
              >
                Sort by
              </p>
              <div
                role="group"
                aria-labelledby="sort-label"
                className="mt-2 flex flex-wrap gap-2"
              >
                {SORTS.map((s) => {
                  const pressed = s.key === sortKey
                  return (
                    <Button
                      key={s.key}
                      variant={pressed ? "secondary" : "outline"}
                      aria-pressed={pressed}
                      className={buttonClasses}
                      onClick={() => setSortKey(s.key)}
                    >
                      {s.label}
                    </Button>
                  )
                })}
              </div>
              <p
                role="status"
                className="mt-3 font-mono text-label text-muted-foreground"
              >
                {count} {count === 1 ? "sailing" : "sailings"}, {sortPhrase}
              </p>
            </div>

            <ol className="mt-5 grid list-none gap-5 p-0">
              {sorted.map((sailing) => {
                const isChosen = sailing.id === chosen.id
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
                        <StateMark state={sailing.state} />
                      )}
                      {isChosen && (
                        <span className="inline-flex items-center gap-2 font-mono text-label text-foreground">
                          <Check
                            aria-hidden="true"
                            className="size-4"
                            strokeWidth={1.5}
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
                            className={buttonClasses}
                            onClick={() => setChosenId(sailing.id)}
                          >
                            Choose
                          </Button>
                        </div>
                      )}
                    </div>

                    {sailing.note && (
                      <p className="mt-3 font-mono text-label text-muted-foreground">
                        {sailing.note}
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
            <div className="mt-5">
              <Journey sailing={chosen} small />
            </div>
            <dl className="mt-5 divide-y">
              <div className="flex items-baseline justify-between gap-5 py-2 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label text-muted-foreground">
                  Date
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground">
                  <time dateTime="2026-12-19">Saturday 19 December 2026</time>
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
              <p className="font-mono text-h2 text-foreground tabular-nums">
                {chosen.fare !== null ? formatFare(chosen.fare) : ""}
              </p>
            </div>
            <div className="mt-5">
              <a
                href="/details"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  buttonClasses,
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
              Check-in at Harrowmouth closes 30 minutes before a sailing for
              foot passengers and 45 minutes before if you travel with a
              vehicle. Fares go up as a sailing fills.
            </p>
            <p className="mt-3">
              <a href="/departures" className={inlineLink}>
                Today&apos;s departures from Harrowmouth
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
                <a href="tel:+441632960512" className={inlineLink}>
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
