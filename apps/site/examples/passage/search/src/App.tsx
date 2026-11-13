import * as React from "react"
import {
  Bike,
  Calendar as CalendarIcon,
  CalendarClock,
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
const buttonText = "h-auto rounded-md px-5 py-2 font-mono text-label"

const MAX_PASSENGERS = 9
const DAYS_AHEAD = 180

const ports = [
  { value: "HRW", name: "Harrowmouth" },
  { value: "PEL", name: "Port Ellery" },
  { value: "BRN", name: "Brindle Ness" },
  { value: "WRH", name: "Wrenholm" },
  { value: "TLQ", name: "Tollan Quay" },
]
const portItems = ports.map((port) => ({
  value: port.value,
  label: `${port.name} (${port.value})`,
}))

const nav = [
  { label: "Book", href: "/", current: true },
  { label: "Departures", href: "/departures", current: false },
  { label: "My booking", href: "/ticket", current: false },
  { label: "Help", href: "#", current: false },
]

const routes = [
  {
    frequency: "5 sailings a day",
    title: "Harrowmouth to Port Ellery",
    text: "The long crossing past the Skerry light, with a café on the upper deck and room below for cars and vans.",
    duration: "1 h 45 min",
    fare: "£29.00",
    port: "Port Ellery",
    href: "/results",
  },
  {
    frequency: "3 sailings a day",
    title: "Harrowmouth to Brindle Ness",
    text: "The quick hop across the sound, popular with walkers heading for the cliff path on a day return.",
    duration: "55 min",
    fare: "£18.00",
    port: "Brindle Ness",
    href: "#",
  },
  {
    frequency: "2 sailings a day",
    title: "Harrowmouth to Wrenholm",
    text: "Out to the far island on our largest ship, with cabins to rest in and a hot lunch served on board.",
    duration: "2 h 30 min",
    fare: "£36.00",
    port: "Wrenholm",
    href: "#",
  },
]

const weekdaysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const weekdaysLong = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]
const monthsShort = [
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
const monthsLong = [
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

function toIso(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function fromIso(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function todayIso() {
  return toIso(new Date())
}

function lastDayIso() {
  const now = new Date()
  return toIso(
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + DAYS_AHEAD)
  )
}

function shortDate(iso: string) {
  const date = fromIso(iso)
  return `${weekdaysShort[date.getDay()]} ${date.getDate()} ${monthsShort[date.getMonth()]} ${date.getFullYear()}`
}

function longDate(iso: string) {
  const date = fromIso(iso)
  return `${weekdaysLong[date.getDay()]} ${date.getDate()} ${monthsLong[date.getMonth()]} ${date.getFullYear()}`
}

function adultsText(n: number) {
  return `${n} ${n === 1 ? "adult" : "adults"}`
}

function childrenText(n: number) {
  return `${n} ${n === 1 ? "child" : "children"}`
}

function portName(code: string) {
  return ports.find((port) => port.value === code)?.name ?? code
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
      <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      {message}
    </p>
  )
}

function PortField({
  id,
  label,
  value,
  onChange,
  error,
  ref,
}: {
  id: string
  label: string
  value: string | null
  onChange: (value: string) => void
  error?: string
  ref: React.Ref<HTMLButtonElement>
}) {
  const labelId = `${id}-label`
  const errorId = `${id}-error`
  return (
    <div>
      <label
        id={labelId}
        htmlFor={id}
        className="block font-mono text-label text-foreground"
      >
        {label}
      </label>
      <div className="mt-2">
        <Select
          items={portItems}
          value={value}
          onValueChange={(next) => {
            if (next !== null) onChange(next)
          }}
        >
          <SelectTrigger
            ref={ref}
            id={id}
            aria-labelledby={labelId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          >
            <SelectValue placeholder="Choose a port" />
          </SelectTrigger>
          <SelectContent>
            {portItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <ErrorLine id={errorId} message={error} />}
    </div>
  )
}

function DateField({
  id,
  label,
  value,
  first,
  last,
  onChange,
  error,
  ref,
}: {
  id: string
  label: string
  value: string
  first: string
  last: string
  onChange: (value: string) => void
  error?: string
  ref: React.Ref<HTMLButtonElement>
}) {
  const [open, setOpen] = React.useState(false)
  const calendarRef = React.useRef<HTMLDivElement>(null)
  const labelId = `${id}-label`
  const valueId = `${id}-value`
  const errorId = `${id}-error`
  const firstDate = fromIso(first)
  const lastDate = fromIso(last)
  const selected = value ? fromIso(value) : undefined

  return (
    <div>
      <label
        id={labelId}
        htmlFor={id}
        className="block font-mono text-label text-foreground"
      >
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          ref={ref}
          id={id}
          aria-labelledby={`${labelId} ${valueId}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "mt-2 flex w-full items-center justify-between gap-2 rounded-md border border-muted-foreground bg-card px-3 py-2 text-body text-foreground transition-colors focus-visible:border-ring aria-invalid:border-destructive",
            focusRing
          )}
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
                onChange(toIso(date))
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
  id,
  label,
  value,
  min,
  max,
  atTotalLimit,
  text,
  less,
  more,
  onChange,
  helper,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  atTotalLimit: boolean
  text: (n: number) => string
  less: string
  more: string
  onChange: (n: number) => void
  helper?: string
}) {
  const labelId = `${id}-label`
  const helperId = `${id}-helper`
  return (
    <div>
      <p id={labelId} className="font-mono text-label text-foreground">
        {label}
      </p>
      <div
        role="group"
        aria-labelledby={labelId}
        aria-describedby={helper ? helperId : undefined}
        className="mt-2 flex items-center gap-2"
      >
        <Button
          variant="outline"
          size="icon"
          className="rounded-md"
          aria-label={less}
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
          {text(value)}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="rounded-md"
          aria-label={more}
          disabled={value >= max || atTotalLimit}
          focusableWhenDisabled
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </Button>
      </div>
      {helper && (
        <p
          id={helperId}
          className="mt-2 font-mono text-label text-muted-foreground"
        >
          {helper}
        </p>
      )}
    </div>
  )
}

function SearchCard() {
  const [trip, setTrip] = React.useState<"one-way" | "return">("one-way")
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

  const today = todayIso()
  const lastDay = lastDayIso()
  const atTotalLimit = adults + children >= MAX_PASSENGERS

  React.useEffect(() => {
    if (result) headingRef.current?.focus()
  }, [result])

  function clearError(field: Field) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function chooseTrip(next: "one-way" | "return") {
    setTrip(next)
    if (next === "one-way") {
      setBack("")
      clearError("return")
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const now = todayIso()
    const last = lastDayIso()
    const found: Errors = {}

    if (!from) found.from = "Choose the port you sail from."

    if (!to) found.to = "Choose the port you sail to."
    else if (to === from)
      found.to = "Choose a different port from the one you sail from."

    if (!outward) found.outward = "Choose the date you sail."
    else if (outward < now) found.outward = "Choose today or a later date."
    else if (outward > last)
      found.outward = "We sell tickets up to 180 days ahead."

    if (trip === "return") {
      if (!back) found.return = "Choose the date you sail back."
      else if (outward && back < outward)
        found.return = "Choose a return date on or after the outward date."
      else if (back > last) found.return = "We sell tickets up to 180 days ahead."
    }

    setErrors(found)

    const order: [Field, React.RefObject<HTMLButtonElement | null>][] = [
      ["from", fromRef],
      ["to", toRef],
      ["outward", outwardRef],
      ["return", returnRef],
    ]
    const firstError = order.find(([field]) => found[field])
    if (firstError) {
      requestAnimationFrame(() => firstError[1].current?.focus())
      return
    }

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
    ? result.children > 0
      ? `${adultsText(result.adults)} and ${childrenText(result.children)}`
      : adultsText(result.adults)
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
                variant={trip === "one-way" ? "secondary" : "outline"}
                aria-pressed={trip === "one-way"}
                className={buttonText}
                onClick={() => chooseTrip("one-way")}
              >
                One way
              </Button>
              <Button
                variant={trip === "return" ? "secondary" : "outline"}
                aria-pressed={trip === "return"}
                className={buttonText}
                onClick={() => chooseTrip("return")}
              >
                Return
              </Button>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <PortField
              ref={fromRef}
              id="from"
              label="From"
              value={from}
              error={errors.from}
              onChange={(value) => {
                setFrom(value)
                clearError("from")
              }}
            />
            <PortField
              ref={toRef}
              id="to"
              label="To"
              value={to}
              error={errors.to}
              onChange={(value) => {
                setTo(value)
                clearError("to")
              }}
            />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <DateField
              ref={outwardRef}
              id="outward"
              label="Outward date"
              value={outward}
              first={today}
              last={lastDay}
              error={errors.outward}
              onChange={(value) => {
                setOutward(value)
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
                last={lastDay}
                error={errors.return}
                onChange={(value) => {
                  setBack(value)
                  clearError("return")
                }}
              />
            )}
          </div>

          <div className="mt-5">
            <Stepper
              id="adults"
              label="Adults"
              value={adults}
              min={1}
              max={9}
              atTotalLimit={atTotalLimit}
              text={adultsText}
              less="Fewer adults"
              more="More adults"
              onChange={setAdults}
            />
          </div>

          <div className="mt-5">
            <Stepper
              id="children"
              label="Children"
              value={children}
              min={0}
              max={8}
              atTotalLimit={atTotalLimit}
              text={childrenText}
              less="Fewer children"
              more="More children"
              onChange={setChildren}
              helper="Ages 4 to 15. Under 4s travel free and need no ticket."
            />
          </div>

          <div className="mt-5">
            <Button type="submit" className={buttonText}>
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
              className="text-h2 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
            >
              Your search is ready
            </h2>
            <p className="mt-3 max-w-xl">
              Sailings from {portName(result.from)} to {portName(result.to)} on{" "}
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
            className={cn(buttonVariants({ variant: "default" }), buttonText)}
          >
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
          <a href="/" className={cn("font-heading text-h2", headerLink)}>
            Kestrel Ferries
          </a>
          <nav aria-label="Main">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {nav.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={cn("text-body", headerLink, item.current && "underline")}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-5">
        <section className="grid gap-5 pt-8 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <p className="font-mono text-label text-muted-foreground">
              Ferries to the islands · Since 1987
            </p>
            <h1 className="mt-2 text-h1 lg:text-display">
              Over the water by lunchtime
            </h1>
            <p className="mt-3 max-w-xl">
              Kestrel Ferries sails from Harrowmouth to four islands every day
              of the year. Bring the car, the bike or the dog, and be on the
              quay before the kettle has cooled.
            </p>
            <p className="mt-5 font-mono text-label text-muted-foreground">
              Harrowmouth · Port Ellery · Brindle Ness · Wrenholm · Tollan Quay
            </p>
          </div>
          <SearchCard />
        </section>

        <section className="mt-16">
          <h2 className="text-h2">Popular routes</h2>
          <p className="mt-3 max-w-xl">
            Every crossing leaves from Harrowmouth harbour, a five-minute walk
            from the railway station.
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {routes.map((route) => (
              <article key={route.title} className="rounded-xl border bg-card p-5">
                <p className="font-mono text-label text-muted-foreground">
                  {route.frequency}
                </p>
                <h3 className="mt-2 text-h2">{route.title}</h3>
                <p className="mt-3 max-w-xl">{route.text}</p>
                <div className="mt-5 flex items-end justify-between gap-5">
                  <p className="font-mono text-label text-muted-foreground">
                    {route.duration} · Direct
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
                <p className="mt-5">
                  <a href={route.href} className={textLink}>
                    See sailings to {route.port}
                  </a>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-h2">Why sail with Kestrel</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3 md:items-start">
            <div>
              <h3 className="flex items-center gap-2 text-body font-bold">
                <CalendarClock className="size-4" strokeWidth={1.5} aria-hidden="true" />
                Change for £10.00
              </h3>
              <p className="mt-3 max-w-xl">
                Plans change. Move your sailing up to 24 hours before it leaves,
                for £10.00 a booking, however many of you are travelling.
              </p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-body font-bold">
                <Bike className="size-4" strokeWidth={1.5} aria-hidden="true" />
                Bring the bike
              </h3>
              <p className="mt-3 max-w-xl">
                Bicycles cost £6.00 each and travel on the car deck, with a rack
                by the stairs so you can lock up and go straight to the lounge.
              </p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-body font-bold">
                <Dog className="size-4" strokeWidth={1.5} aria-hidden="true" />
                Dogs on deck
              </h3>
              <p className="mt-3 max-w-xl">
                Dogs travel free on the open deck and in the dog lounge on every
                ship, with water bowls by the door.
              </p>
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
