import * as React from "react"
import {
  Bike,
  CalendarClock,
  CalendarIcon,
  CircleAlert,
  Dog,
  Minus,
  Plus,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const TEXT_LINK = `text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground ${FOCUS}`
const HEADER_LINK = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${FOCUS}`
const BUTTON = "h-auto rounded-md px-5 py-2 font-mono text-label"
const LABEL_FOR_FIELD = "block font-mono text-label text-foreground"

const PORTS = [
  { value: "HRW", label: "Harrowmouth (HRW)" },
  { value: "PEL", label: "Port Ellery (PEL)" },
  { value: "BRN", label: "Brindle Ness (BRN)" },
  { value: "WRH", label: "Wrenholm (WRH)" },
  { value: "TLQ", label: "Tollan Quay (TLQ)" },
]

const PORT_NAMES: Record<string, string> = {
  HRW: "Harrowmouth",
  PEL: "Port Ellery",
  BRN: "Brindle Ness",
  WRH: "Wrenholm",
  TLQ: "Tollan Quay",
}

const MAX_PASSENGERS = 9
const DAYS_AHEAD = 180

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const WEEKDAYS_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]
const MONTHS_SHORT = [
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
const MONTHS_LONG = [
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

function toKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function fromKey(key: string) {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function todayKey() {
  return toKey(new Date())
}

function lastDayKey() {
  const now = new Date()
  return toKey(
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + DAYS_AHEAD)
  )
}

function shortDate(key: string) {
  const date = fromKey(key)
  return `${WEEKDAYS_SHORT[date.getDay()]} ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`
}

function longDate(key: string) {
  const date = fromKey(key)
  return `${WEEKDAYS_LONG[date.getDay()]} ${date.getDate()} ${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`
}

function count(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

type Field = "from" | "to" | "outward" | "return"
type Errors = Partial<Record<Field, string>>
type Search = {
  from: string
  to: string
  outward: string
  back: string | null
  adults: number
  children: number
}

function ErrorLine({ id, message }: { id: string; message: string }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert
        className="size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      {message}
    </p>
  )
}

function DateField({
  id,
  label,
  value,
  first,
  last,
  error,
  onPick,
  ref,
}: {
  id: string
  label: string
  value: string
  first: string
  last: string
  error?: string
  onPick: (key: string) => void
  ref: React.Ref<HTMLButtonElement>
}) {
  const [open, setOpen] = React.useState(false)
  const calendarRef = React.useRef<HTMLDivElement>(null)
  const labelId = `${id}-label`
  const valueId = `${id}-value`
  const errorId = `${id}-error`
  const firstDate = fromKey(first)
  const lastDate = fromKey(last)
  const selected = value ? fromKey(value) : undefined

  return (
    <div>
      <label id={labelId} htmlFor={id} className={LABEL_FOR_FIELD}>
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          ref={ref}
          id={id}
          type="button"
          aria-labelledby={`${labelId} ${valueId}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`mt-2 flex w-full items-center justify-between gap-2 rounded-md border border-muted-foreground bg-card px-3 py-2 text-body text-foreground transition-colors focus-visible:border-ring aria-invalid:border-destructive ${FOCUS}`}
        >
          <span id={valueId} className="min-w-0 truncate">
            {value ? (
              <time dateTime={value} className="tabular-nums">
                {shortDate(value)}
              </time>
            ) : (
              <span className="text-muted-foreground">Choose a date</span>
            )}
          </span>
          <CalendarIcon
            className="size-4 shrink-0 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-auto"
          initialFocus={() =>
            calendarRef.current?.querySelector<HTMLElement>(
              'td button[tabindex="0"]'
            ) ?? true
          }
        >
          <div ref={calendarRef}>
            <Calendar
              mode="single"
              required
              weekStartsOn={1}
              showOutsideDays={false}
              selected={selected}
              defaultMonth={selected ?? firstDate}
              startMonth={firstDate}
              endMonth={lastDate}
              disabled={{ before: firstDate, after: lastDate }}
              onSelect={(date) => {
                onPick(toKey(date))
                setOpen(false)
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
      {error && <ErrorLine id={errorId} message={error} />}
    </div>
  )
}

function Stepper({
  labelId,
  label,
  text,
  canLess,
  canMore,
  lessLabel,
  moreLabel,
  onLess,
  onMore,
  describedBy,
}: {
  labelId: string
  label: string
  text: string
  canLess: boolean
  canMore: boolean
  lessLabel: string
  moreLabel: string
  onLess: () => void
  onMore: () => void
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
          aria-label={lessLabel}
          disabled={!canLess}
          focusableWhenDisabled
          onClick={onLess}
        >
          <Minus className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </Button>
        <span
          aria-live="polite"
          className="inline-flex min-w-24 justify-center font-mono text-label text-foreground tabular-nums"
        >
          {text}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="rounded-md"
          aria-label={moreLabel}
          disabled={!canMore}
          focusableWhenDisabled
          onClick={onMore}
        >
          <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </Button>
      </div>
    </>
  )
}

function SearchCard() {
  const [trip, setTrip] = React.useState<"one" | "return">("one")
  const [from, setFrom] = React.useState<string | null>(null)
  const [to, setTo] = React.useState<string | null>(null)
  const [outward, setOutward] = React.useState("")
  const [back, setBack] = React.useState("")
  const [adults, setAdults] = React.useState(2)
  const [children, setChildren] = React.useState(0)
  const [errors, setErrors] = React.useState<Errors>({})
  const [result, setResult] = React.useState<Search | null>(null)

  const fromRef = React.useRef<HTMLButtonElement>(null)
  const toRef = React.useRef<HTMLButtonElement>(null)
  const outwardRef = React.useRef<HTMLButtonElement>(null)
  const returnRef = React.useRef<HTMLButtonElement>(null)
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const pendingFocus = React.useRef<Field | null>(null)

  React.useEffect(() => {
    const field = pendingFocus.current
    if (!field) return
    pendingFocus.current = null
    const refs = {
      from: fromRef,
      to: toRef,
      outward: outwardRef,
      return: returnRef,
    }
    refs[field].current?.focus()
  }, [errors])

  React.useEffect(() => {
    if (result) headingRef.current?.focus()
  }, [result])

  const today = todayKey()
  const last = lastDayKey()
  const total = adults + children

  function clearError(field: Field) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function chooseTrip(next: "one" | "return") {
    setTrip(next)
    if (next === "one") {
      setBack("")
      clearError("return")
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const now = todayKey()
    const end = lastDayKey()
    const next: Errors = {}

    if (!from) next.from = "Choose the port you sail from."

    if (!to) next.to = "Choose the port you sail to."
    else if (from && to === from)
      next.to = "Choose a different port from the one you sail from."

    if (!outward) next.outward = "Choose the date you sail."
    else if (outward < now) next.outward = "Choose today or a later date."
    else if (outward > end)
      next.outward = "We sell tickets up to 180 days ahead."

    if (trip === "return") {
      if (!back) next.return = "Choose the date you sail back."
      else if (outward && back < outward)
        next.return = "Choose a return date on or after the outward date."
      else if (back > end) next.return = "We sell tickets up to 180 days ahead."
    }

    const order: Field[] = ["from", "to", "outward", "return"]
    const firstError = order.find((field) => next[field])
    if (firstError) {
      pendingFocus.current = firstError
      setErrors(next)
      return
    }

    setErrors({})
    setResult({
      from: from!,
      to: to!,
      outward,
      back: trip === "return" ? back : null,
      adults,
      children,
    })
  }

  const passengers = result
    ? [
        count(result.adults, "adult", "adults"),
        result.children > 0
          ? count(result.children, "child", "children")
          : null,
      ]
        .filter(Boolean)
        .join(" and ")
    : ""

  return (
    <div className="rounded-xl border bg-card p-5 md:col-span-6 md:col-start-7">
      {!result && (
        <form noValidate aria-label="Search sailings" onSubmit={handleSubmit}>
          <div>
            <p id="trip-label" className="font-mono text-label text-foreground">
              Trip
            </p>
            <div
              role="group"
              aria-labelledby="trip-label"
              className="mt-2 flex flex-wrap gap-2"
            >
              <Button
                variant={trip === "one" ? "secondary" : "outline"}
                aria-pressed={trip === "one"}
                className={BUTTON}
                onClick={() => chooseTrip("one")}
              >
                One way
              </Button>
              <Button
                variant={trip === "return" ? "secondary" : "outline"}
                aria-pressed={trip === "return"}
                className={BUTTON}
                onClick={() => chooseTrip("return")}
              >
                Return
              </Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <label id="from-label" htmlFor="from" className={LABEL_FOR_FIELD}>
                From
              </label>
              <div className="mt-2">
                <Select
                  items={PORTS}
                  value={from}
                  onValueChange={(value) => {
                    if (value === null) return
                    setFrom(value)
                    clearError("from")
                  }}
                >
                  <SelectTrigger
                    ref={fromRef}
                    id="from"
                    aria-labelledby="from-label"
                    aria-invalid={errors.from ? true : undefined}
                    aria-describedby={errors.from ? "from-error" : undefined}
                  >
                    <SelectValue placeholder="Choose a port" />
                  </SelectTrigger>
                  <SelectContent>
                    {PORTS.map((port) => (
                      <SelectItem key={port.value} value={port.value}>
                        {port.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.from && <ErrorLine id="from-error" message={errors.from} />}
            </div>
            <div>
              <label id="to-label" htmlFor="to" className={LABEL_FOR_FIELD}>
                To
              </label>
              <div className="mt-2">
                <Select
                  items={PORTS}
                  value={to}
                  onValueChange={(value) => {
                    if (value === null) return
                    setTo(value)
                    clearError("to")
                  }}
                >
                  <SelectTrigger
                    ref={toRef}
                    id="to"
                    aria-labelledby="to-label"
                    aria-invalid={errors.to ? true : undefined}
                    aria-describedby={errors.to ? "to-error" : undefined}
                  >
                    <SelectValue placeholder="Choose a port" />
                  </SelectTrigger>
                  <SelectContent>
                    {PORTS.map((port) => (
                      <SelectItem key={port.value} value={port.value}>
                        {port.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.to && <ErrorLine id="to-error" message={errors.to} />}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <DateField
              ref={outwardRef}
              id="outward"
              label="Outward date"
              value={outward}
              first={today}
              last={last}
              error={errors.outward}
              onPick={(key) => {
                setOutward(key)
                clearError("outward")
              }}
            />
            {trip === "return" && (
              <DateField
                ref={returnRef}
                id="return"
                label="Return date"
                value={back}
                first={outward && outward > today ? outward : today}
                last={last}
                error={errors.return}
                onPick={(key) => {
                  setBack(key)
                  clearError("return")
                }}
              />
            )}
          </div>

          <div className="mt-5">
            <Stepper
              labelId="adults-label"
              label="Adults"
              text={count(adults, "adult", "adults")}
              canLess={adults > 1}
              canMore={adults < 9 && total < MAX_PASSENGERS}
              lessLabel="Fewer adults"
              moreLabel="More adults"
              onLess={() => setAdults((n) => Math.max(1, n - 1))}
              onMore={() => setAdults((n) => Math.min(9, n + 1))}
            />
          </div>

          <div className="mt-5">
            <Stepper
              labelId="children-label"
              label="Children"
              text={count(children, "child", "children")}
              canLess={children > 0}
              canMore={children < 8 && total < MAX_PASSENGERS}
              lessLabel="Fewer children"
              moreLabel="More children"
              onLess={() => setChildren((n) => Math.max(0, n - 1))}
              onMore={() => setChildren((n) => Math.min(8, n + 1))}
              describedBy="children-help"
            />
            <p
              id="children-help"
              className="mt-2 font-mono text-label text-muted-foreground"
            >
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
              className="text-h2 text-foreground focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
            >
              Your search is ready
            </h2>
            <p className="mt-3 max-w-xl text-body text-foreground">
              Sailings from {PORT_NAMES[result.from]} to{" "}
              {PORT_NAMES[result.to]} on{" "}
              <time dateTime={result.outward}>{longDate(result.outward)}</time>
              {result.back && (
                <>
                  , back on{" "}
                  <time dateTime={result.back}>{longDate(result.back)}</time>
                </>
              )}
              , for {passengers}.
            </p>
          </div>
        )}
      </div>

      {result && (
        <div className="mt-5">
          <a
            href="/results"
            className={cn(buttonVariants({ variant: "default" }), BUTTON)}
          >
            See the sailings
          </a>
        </div>
      )}
    </div>
  )
}

const ROUTES = [
  {
    port: "Port Ellery",
    sailings: "5 sailings a day",
    way: "1 h 45 min · Direct",
    fare: "£29.00",
    href: "/results",
    text: "The longest run of the day, past the Gull Rocks and into Port Ellery's old stone harbour, with a café on the upper deck.",
  },
  {
    port: "Brindle Ness",
    sailings: "3 sailings a day",
    way: "55 min · Direct",
    fare: "£18.00",
    href: "#",
    text: "A short hop across the sound to the nearest island, timed to meet the Brindle Ness bus at the slipway.",
  },
  {
    port: "Wrenholm",
    sailings: "2 sailings a day",
    way: "2 h 30 min · Direct",
    fare: "£36.00",
    href: "#",
    text: "Out to the far island on our largest ship, with a lounge, a hot food counter and room on deck for the view.",
  },
]

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-2 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <a href="/" className={`font-heading text-h2 ${HEADER_LINK}`}>
            Kestrel Ferries
          </a>
          <nav aria-label="Main">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              <li>
                <a
                  href="/"
                  aria-current="page"
                  className={`text-body underline ${HEADER_LINK}`}
                >
                  Book
                </a>
              </li>
              <li>
                <a href="/departures" className={`text-body ${HEADER_LINK}`}>
                  Departures
                </a>
              </li>
              <li>
                <a href="/ticket" className={`text-body ${HEADER_LINK}`}>
                  My booking
                </a>
              </li>
              <li>
                <a href="#" className={`text-body ${HEADER_LINK}`}>
                  Help
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-5">
        <section className="grid grid-cols-1 gap-5 pt-8 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <p className="font-mono text-label text-muted-foreground tabular-nums">
              Ferries to the islands · Since 1987
            </p>
            <h1 className="mt-2 text-h1 lg:text-display">
              Over the water by lunchtime
            </h1>
            <p className="mt-3 max-w-xl text-body">
              Our ships cross from Harrowmouth to four islands every day of the
              year. Bring the car, the bike or the dog: there is room on board
              for all three.
            </p>
            <p className="mt-5 font-mono text-label text-muted-foreground">
              Harrowmouth · Port Ellery · Brindle Ness · Wrenholm · Tollan Quay
            </p>
          </div>
          <SearchCard />
        </section>

        <section className="mt-16">
          <h2 className="text-h2">Popular routes</h2>
          <p className="mt-3 max-w-xl text-body">
            Every crossing leaves from Harrowmouth harbour, a five-minute walk
            from the railway station.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            {ROUTES.map((route) => (
              <article
                key={route.port}
                className="rounded-xl border bg-card p-5"
              >
                <p className="font-mono text-label text-muted-foreground tabular-nums">
                  {route.sailings}
                </p>
                <h3 className="mt-2 text-h2">Harrowmouth to {route.port}</h3>
                <p className="mt-3 max-w-xl text-body">{route.text}</p>
                <div className="mt-5 flex items-end justify-between gap-5">
                  <p className="font-mono text-label text-muted-foreground tabular-nums">
                    {route.way}
                  </p>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-label text-muted-foreground">
                      From, one adult
                    </p>
                    <p className="mt-1 font-mono text-h2 text-foreground tabular-nums">
                      {route.fare}
                    </p>
                  </div>
                </div>
                <p className="mt-5 max-w-xl">
                  <a href={route.href} className={TEXT_LINK}>
                    See sailings to {route.port}
                  </a>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-h2">Why sail with Kestrel</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3 md:items-start">
            <div>
              <h3 className="flex items-center gap-2 text-body font-bold">
                <CalendarClock
                  className="size-4"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                Change for £10.00
              </h3>
              <p className="mt-3 max-w-xl text-body">
                Plans change. Move your sailing up to 24 hours before it leaves,
                for £10.00 a booking.
              </p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-body font-bold">
                <Bike className="size-4" strokeWidth={1.5} aria-hidden="true" />
                Bring the bike
              </h3>
              <p className="mt-3 max-w-xl text-body">
                Bicycles cost £6.00 each and travel on the car deck, with a rack
                by the stairs.
              </p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-body font-bold">
                <Dog className="size-4" strokeWidth={1.5} aria-hidden="true" />
                Dogs on deck
              </h3>
              <p className="mt-3 max-w-xl text-body">
                Dogs travel free, on the open deck or in the dog lounge, on
                every one of our ships.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t bg-card">
        <div className="mx-auto max-w-[1120px] px-5 py-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">Kestrel Ferries</p>
              <p className="mt-2 max-w-xl text-body">
                Crossings from Harrowmouth to Port Ellery, Brindle Ness,
                Wrenholm and Tollan Quay since 1987.
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <p className="font-mono text-label text-muted-foreground">
                Customer desk
              </p>
              <p className="mt-2 max-w-xl text-body">
                <a href="tel:+441632960512" className={TEXT_LINK}>
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
