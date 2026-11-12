import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { Bike, CalendarClock, CircleAlert, Dog, Minus, Plus } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const CODE_FOCUS =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const RUNNING_LINK = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  FOCUS
)
const HEADER_LINK = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)
const BUTTON = "h-auto rounded-md px-5 py-2 font-mono text-label"
const LABEL = "font-mono text-label"
const FIELD_LABEL = "block font-mono text-label text-foreground"
const SELECT = cn(
  "mt-2 h-auto w-full rounded-md border border-muted-foreground bg-card px-3 py-2 text-body text-foreground aria-invalid:border-destructive",
  FOCUS
)
const INPUT = "mt-2 h-auto rounded-md border-muted-foreground px-3 py-2 text-body md:text-body"

const PORTS = [
  { code: "HRW", name: "Harrowmouth" },
  { code: "PEL", name: "Port Ellery" },
  { code: "BRN", name: "Brindle Ness" },
  { code: "WRH", name: "Wrenholm" },
  { code: "TLQ", name: "Tollan Quay" },
]

const ROUTES = [
  {
    frequency: "5 sailings a day",
    name: "Harrowmouth to Port Ellery",
    text: "Our busiest crossing, with sailings from early morning to late evening, so a day trip leaves you most of the day ashore.",
    duration: "1 h 45 min · Direct",
    price: "£29.00",
    href: "/results",
  },
  {
    frequency: "3 sailings a day",
    name: "Harrowmouth to Brindle Ness",
    text: "The short hop across the sound, past the lighthouse on Gull Point, and the easiest way to the walking paths on the headland.",
    duration: "55 min · Direct",
    price: "£18.00",
    href: "#",
  },
  {
    frequency: "2 sailings a day",
    name: "Harrowmouth to Wrenholm",
    text: "The long run out to the furthest island, with a café on the upper deck and room on the car deck for camper vans.",
    duration: "2 h 30 min · Direct",
    price: "£36.00",
    href: "#",
  },
]

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function isoDate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function dateLimits() {
  const now = new Date()
  const later = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 180)
  return { today: isoDate(now), max: isoDate(later) }
}

function longDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  return `${WEEKDAYS[date.getDay()]} ${d} ${MONTHS[m - 1]} ${y}`
}

function portName(code: string) {
  return PORTS.find((port) => port.code === code)?.name ?? code
}

function count(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

type Trip = "one-way" | "return"
type FieldName = "from" | "to" | "outward" | "return"
type Errors = Partial<Record<FieldName, string>>

const FIELD_IDS: Record<FieldName, string> = {
  from: "from",
  to: "to",
  outward: "outward-date",
  return: "return-date",
}

type Search = {
  from: string
  to: string
  outward: string
  returnDate: string | null
  adults: number
  children: number
}

function ErrorLine({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 font-mono text-label text-destructive">
      <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

function Stepper({
  labelId,
  label,
  value,
  min,
  max,
  atTotal,
  one,
  many,
  fewerLabel,
  moreLabel,
  onChange,
  describedBy,
}: {
  labelId: string
  label: string
  value: number
  min: number
  max: number
  atTotal: boolean
  one: string
  many: string
  fewerLabel: string
  moreLabel: string
  onChange: (value: number) => void
  describedBy?: string
}) {
  return (
    <>
      <p id={labelId} className="font-mono text-label text-foreground">
        {label}
      </p>
      <div
        role="group"
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        className="mt-2 flex items-center gap-2"
      >
        <Button
          variant="outline"
          size="icon"
          className="rounded-md"
          aria-label={fewerLabel}
          disabled={value <= min}
          focusableWhenDisabled
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <Minus className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </Button>
        <span
          aria-live="polite"
          className="inline-flex min-w-24 justify-center font-mono text-label text-foreground tabular-nums"
        >
          {count(value, one, many)}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="rounded-md"
          aria-label={moreLabel}
          disabled={value >= max || atTotal}
          focusableWhenDisabled
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </Button>
      </div>
    </>
  )
}

function SearchCard() {
  const [limits] = useState(dateLimits)
  const [trip, setTrip] = useState<Trip>("one-way")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [outward, setOutward] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [errors, setErrors] = useState<Errors>({})
  const [focusTarget, setFocusTarget] = useState<{ field: FieldName; attempt: number } | null>(
    null
  )
  const [result, setResult] = useState<Search | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const atTotal = adults + children >= 9

  useEffect(() => {
    if (focusTarget) document.getElementById(FIELD_IDS[focusTarget.field])?.focus()
  }, [focusTarget])

  useEffect(() => {
    if (result) headingRef.current?.focus()
  }, [result])

  function clearError(field: FieldName) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function chooseTrip(next: Trip) {
    setTrip(next)
    if (next === "one-way") {
      setReturnDate("")
      clearError("return")
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { today, max } = dateLimits()
    const found: Errors = {}

    if (!from) found.from = "Choose the port you sail from."

    if (!to) found.to = "Choose the port you sail to."
    else if (from && to === from) found.to = "Choose a different port from the one you sail from."

    if (!outward) found.outward = "Choose the date you sail."
    else if (outward < today) found.outward = "Choose today or a later date."
    else if (outward > max) found.outward = "We sell tickets up to 180 days ahead."

    if (trip === "return") {
      if (!returnDate) found.return = "Choose the date you sail back."
      else if (outward && returnDate < outward)
        found.return = "Choose a return date on or after the outward date."
      else if (returnDate > max) found.return = "We sell tickets up to 180 days ahead."
    }

    setErrors(found)
    const first = (["from", "to", "outward", "return"] as FieldName[]).find((f) => found[f])
    if (first) {
      setFocusTarget((current) => ({ field: first, attempt: (current?.attempt ?? 0) + 1 }))
      return
    }

    setResult({
      from,
      to,
      outward,
      returnDate: trip === "return" ? returnDate : null,
      adults,
      children,
    })
  }

  function errorProps(field: FieldName) {
    return errors[field]
      ? { "aria-invalid": true as const, "aria-describedby": `${FIELD_IDS[field]}-error` }
      : {}
  }

  function passengers(search: Search) {
    const parts = [count(search.adults, "adult", "adults")]
    if (search.children > 0) parts.push(count(search.children, "child", "children"))
    return parts.join(" and ")
  }

  return (
    <div className="rounded-xl border bg-card p-5 md:col-span-6 md:col-start-7">
      {!result && (
        <form noValidate aria-label="Search sailings" onSubmit={handleSubmit}>
          <div>
            <p id="trip-label" className="font-mono text-label text-foreground">
              Trip
            </p>
            <div role="group" aria-labelledby="trip-label" className="mt-2 flex flex-wrap gap-2">
              <Button
                className={BUTTON}
                variant={trip === "one-way" ? "secondary" : "outline"}
                aria-pressed={trip === "one-way"}
                onClick={() => chooseTrip("one-way")}
              >
                One way
              </Button>
              <Button
                className={BUTTON}
                variant={trip === "return" ? "secondary" : "outline"}
                aria-pressed={trip === "return"}
                onClick={() => chooseTrip("return")}
              >
                Return
              </Button>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div>
              <label htmlFor="from" className={FIELD_LABEL}>
                From
              </label>
              <select
                id="from"
                className={SELECT}
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value)
                  clearError("from")
                }}
                {...errorProps("from")}
              >
                <option value="">Choose a port</option>
                {PORTS.map((port) => (
                  <option key={port.code} value={port.code}>
                    {port.name} ({port.code})
                  </option>
                ))}
              </select>
              {errors.from && <ErrorLine id="from-error">{errors.from}</ErrorLine>}
            </div>
            <div>
              <label htmlFor="to" className={FIELD_LABEL}>
                To
              </label>
              <select
                id="to"
                className={SELECT}
                value={to}
                onChange={(e) => {
                  setTo(e.target.value)
                  clearError("to")
                }}
                {...errorProps("to")}
              >
                <option value="">Choose a port</option>
                {PORTS.map((port) => (
                  <option key={port.code} value={port.code}>
                    {port.name} ({port.code})
                  </option>
                ))}
              </select>
              {errors.to && <ErrorLine id="to-error">{errors.to}</ErrorLine>}
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div>
              <label htmlFor="outward-date" className={FIELD_LABEL}>
                Outward date
              </label>
              <Input
                id="outward-date"
                type="date"
                className={INPUT}
                min={limits.today}
                max={limits.max}
                value={outward}
                onChange={(e) => {
                  setOutward(e.target.value)
                  clearError("outward")
                }}
                {...errorProps("outward")}
              />
              {errors.outward && <ErrorLine id="outward-date-error">{errors.outward}</ErrorLine>}
            </div>
            {trip === "return" && (
              <div>
                <label htmlFor="return-date" className={FIELD_LABEL}>
                  Return date
                </label>
                <Input
                  id="return-date"
                  type="date"
                  className={INPUT}
                  min={outward || limits.today}
                  max={limits.max}
                  value={returnDate}
                  onChange={(e) => {
                    setReturnDate(e.target.value)
                    clearError("return")
                  }}
                  {...errorProps("return")}
                />
                {errors.return && <ErrorLine id="return-date-error">{errors.return}</ErrorLine>}
              </div>
            )}
          </div>

          <div className="mt-5">
            <Stepper
              labelId="adults-label"
              label="Adults"
              value={adults}
              min={1}
              max={9}
              atTotal={atTotal}
              one="adult"
              many="adults"
              fewerLabel="Fewer adults"
              moreLabel="More adults"
              onChange={setAdults}
            />
          </div>

          <div className="mt-5">
            <Stepper
              labelId="children-label"
              label="Children"
              value={children}
              min={0}
              max={8}
              atTotal={atTotal}
              one="child"
              many="children"
              fewerLabel="Fewer children"
              moreLabel="More children"
              onChange={setChildren}
              describedBy="children-help"
            />
            <p id="children-help" className="mt-2 font-mono text-label text-muted-foreground">
              Ages 4 to 15. Under 4s travel free and need no ticket.
            </p>
          </div>

          <div className="mt-5">
            <Button type="submit" className={BUTTON}>
              Search sailings
            </Button>
          </div>
        </form>
      )}

      <div role="status">
        {result && (
          <div>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className={cn("text-h2 text-foreground", CODE_FOCUS)}
            >
              Your search is ready
            </h2>
            <p className="mt-3 max-w-xl text-foreground">
              Sailings from {portName(result.from)} to {portName(result.to)} on{" "}
              <time dateTime={result.outward}>{longDate(result.outward)}</time>
              {result.returnDate && (
                <>
                  , back on <time dateTime={result.returnDate}>{longDate(result.returnDate)}</time>
                </>
              )}
              , for {passengers(result)}.
            </p>
          </div>
        )}
      </div>

      {result && (
        <div className="mt-5">
          <a href="/results" className={cn(buttonVariants({ variant: "default" }), BUTTON)}>
            See the sailings
          </a>
        </div>
      )}
    </div>
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-2 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <a href="/" className={cn(HEADER_LINK, "font-heading text-h2")}>
            Kestrel Ferries
          </a>
          <nav aria-label="Main">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              <li>
                <a href="/" aria-current="page" className={cn(HEADER_LINK, "text-body underline")}>
                  Book
                </a>
              </li>
              <li>
                <a href="/departures" className={cn(HEADER_LINK, "text-body")}>
                  Departures
                </a>
              </li>
              <li>
                <a href="/ticket" className={cn(HEADER_LINK, "text-body")}>
                  My booking
                </a>
              </li>
              <li>
                <a href="#" className={cn(HEADER_LINK, "text-body")}>
                  Help
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-5">
        <section className="grid gap-5 pt-8 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <p className={cn(LABEL, "text-muted-foreground")}>Ferries to the islands · Since 1987</p>
            <h1 className="mt-2 text-h1 text-foreground lg:text-display">
              Over the water by lunchtime
            </h1>
            <p className="mt-3 max-w-xl text-body">
              Crossings from Harrowmouth to the harbours, beaches and hill paths of four islands.
              Bring the car, the bike or the dog: there is room on board for all three.
            </p>
            <p className={cn(LABEL, "mt-5 text-muted-foreground")}>
              Harrowmouth · Port Ellery · Brindle Ness · Wrenholm · Tollan Quay
            </p>
          </div>
          <SearchCard />
        </section>

        <section className="mt-16">
          <h2 className="text-h2 text-foreground">Popular routes</h2>
          <p className="mt-3 max-w-xl">
            Every crossing leaves from Harrowmouth harbour, a five-minute walk from the station.
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {ROUTES.map((route) => (
              <article key={route.name} className="rounded-xl border bg-card p-5">
                <p className={cn(LABEL, "text-muted-foreground")}>{route.frequency}</p>
                <h3 className="mt-2 text-h2 text-foreground">{route.name}</h3>
                <p className="mt-3 max-w-xl text-body">{route.text}</p>
                <div className="mt-5 flex items-end justify-between gap-5">
                  <p className={cn(LABEL, "text-muted-foreground")}>{route.duration}</p>
                  <div className="shrink-0 text-right">
                    <p className={cn(LABEL, "text-muted-foreground")}>From, one adult</p>
                    <p className="mt-1 font-mono text-h2 text-foreground tabular-nums">
                      {route.price}
                    </p>
                  </div>
                </div>
                <p className="mt-5">
                  <a href={route.href} className={RUNNING_LINK}>
                    See sailings
                  </a>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-h2 text-foreground">Why sail with Kestrel</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3 md:items-start">
            <div>
              <h3 className="flex items-center gap-2 text-body font-bold text-foreground">
                <CalendarClock className="size-4" strokeWidth={1.5} aria-hidden="true" />
                Change for £10.00
              </h3>
              <p className="mt-3 max-w-xl">
                Plans shift. Move your sailing up to 24 hours before it leaves for £10.00 a
                booking, however many people are on it.
              </p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-body font-bold text-foreground">
                <Bike className="size-4" strokeWidth={1.5} aria-hidden="true" />
                Bring the bike
              </h3>
              <p className="mt-3 max-w-xl">
                Bicycles cost £6.00 each and travel on the car deck, with a rack by the stairs so
                you can lock up and go straight to the lounge.
              </p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-body font-bold text-foreground">
                <Dog className="size-4" strokeWidth={1.5} aria-hidden="true" />
                Dogs on deck
              </h3>
              <p className="mt-3 max-w-xl">
                Dogs travel free on the open deck and in the dog lounge on every ship, with water
                bowls by the door.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t bg-card">
        <div className="mx-auto max-w-[1120px] px-5 py-8">
          <div className="grid gap-5 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2 text-foreground">Kestrel Ferries</p>
              <p className="mt-2 max-w-xl">
                Crossings from Harrowmouth to Port Ellery, Brindle Ness, Wrenholm and Tollan Quay
                since 1987.
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <p className={cn(LABEL, "text-muted-foreground")}>Customer desk</p>
              <p className="mt-2 text-body">
                Call{" "}
                <a href="tel:+441632960512" className={RUNNING_LINK}>
                  01632 960 512
                </a>{" "}
                to change or ask about a booking.
              </p>
              <p className={cn(LABEL, "mt-2 text-muted-foreground tabular-nums")}>
                Every day · <time dateTime="06:00">06:00</time>–<time dateTime="22:00">22:00</time>
              </p>
            </div>
          </div>
          <p className={cn(LABEL, "mt-5 text-muted-foreground")}>© 2026 Kestrel Ferries</p>
        </div>
      </footer>
    </div>
  )
}

export default App
