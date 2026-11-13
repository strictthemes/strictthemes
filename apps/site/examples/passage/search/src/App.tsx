import { useEffect, useRef, useState, type FormEvent } from "react"
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
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const headerLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const buttonText = "h-auto rounded-md px-5 py-2 font-mono text-label"

const ports = [
  { value: "HRW", label: "Harrowmouth (HRW)", name: "Harrowmouth" },
  { value: "PEL", label: "Port Ellery (PEL)", name: "Port Ellery" },
  { value: "BRN", label: "Brindle Ness (BRN)", name: "Brindle Ness" },
  { value: "WRH", label: "Wrenholm (WRH)", name: "Wrenholm" },
  { value: "TLQ", label: "Tollan Quay (TLQ)", name: "Tollan Quay" },
]
const portItems = ports.map(({ value, label }) => ({ value, label }))
const portName = (code: string) =>
  ports.find((port) => port.value === code)?.name ?? code

const routes = [
  {
    to: "Port Ellery",
    sailings: "5 sailings a day",
    about:
      "The island's main harbour, with buses to every village waiting on the quay when the ship comes in.",
    trip: "1 h 45 min · Direct",
    fare: "£29.00",
    href: "/results",
  },
  {
    to: "Brindle Ness",
    sailings: "3 sailings a day",
    about:
      "Our shortest crossing, past the lighthouse and into the sheltered bay below the cliff walk.",
    trip: "55 min · Direct",
    fare: "£18.00",
    href: "#",
  },
  {
    to: "Wrenholm",
    sailings: "2 sailings a day",
    about:
      "The longest run, out past the seal rocks to the farthest island and its white sand beaches.",
    trip: "2 h 30 min · Direct",
    fare: "£36.00",
    href: "#",
  },
]

const weekdaysLong = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
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

const pad = (n: number) => String(n).padStart(2, "0")
const toKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const fromKey = (key: string) => {
  const [year, month, day] = key.split("-").map(Number)
  return new Date(year, month - 1, day)
}
const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
const shortDate = (key: string) => {
  const date = fromKey(key)
  return `${weekdaysLong[date.getDay()].slice(0, 3)} ${date.getDate()} ${monthsLong[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`
}
const longDate = (key: string) => {
  const date = fromKey(key)
  return `${weekdaysLong[date.getDay()]} ${date.getDate()} ${monthsLong[date.getMonth()]} ${date.getFullYear()}`
}

const adultsText = (n: number) => `${n} ${n === 1 ? "adult" : "adults"}`
const childrenText = (n: number) => `${n} ${n === 1 ? "child" : "children"}`

type Field = "from" | "to" | "outward" | "return"
type Errors = Partial<Record<Field, string>>
type Trip = "one-way" | "return"
type Search = {
  trip: Trip
  from: string
  to: string
  outward: string
  back: string
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

function DateField({
  id,
  label,
  value,
  first,
  last,
  error,
  onChange,
}: {
  id: string
  label: string
  value: string
  first: string
  last: string
  error?: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)
  const firstDay = fromKey(first)
  const lastDay = fromKey(last)
  const selected = value ? fromKey(value) : undefined

  return (
    <div>
      <label
        id={`${id}-label`}
        htmlFor={id}
        className="block font-mono text-label text-foreground"
      >
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          aria-labelledby={`${id}-label ${id}-value`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "mt-2 flex w-full items-center justify-between gap-2 rounded-md border border-muted-foreground bg-card px-3 py-2 text-body text-foreground transition-colors focus-visible:border-ring aria-invalid:border-destructive",
            focusRing
          )}
        >
          <span id={`${id}-value`} className="min-w-0 truncate">
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
              defaultMonth={selected ?? firstDay}
              startMonth={firstDay}
              endMonth={lastDay}
              disabled={{ before: firstDay, after: lastDay }}
              onSelect={(day) => {
                onChange(toKey(day))
                setOpen(false)
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
      {error && <ErrorLine id={`${id}-error`} message={error} />}
    </div>
  )
}

function Stepper({
  id,
  label,
  value,
  text,
  canLower,
  canRaise,
  lowerLabel,
  raiseLabel,
  onChange,
}: {
  id: string
  label: string
  value: number
  text: string
  canLower: boolean
  canRaise: boolean
  lowerLabel: string
  raiseLabel: string
  onChange: (value: number) => void
}) {
  return (
    <>
      <p id={`${id}-label`} className="font-mono text-label text-foreground">
        {label}
      </p>
      <div
        role="group"
        aria-labelledby={`${id}-label`}
        className="mt-2 flex items-center gap-2"
      >
        <Button
          variant="outline"
          size="icon"
          className="rounded-md"
          aria-label={lowerLabel}
          disabled={!canLower}
          focusableWhenDisabled
          onClick={() => onChange(value - 1)}
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
          aria-label={raiseLabel}
          disabled={!canRaise}
          focusableWhenDisabled
          onClick={() => onChange(value + 1)}
        >
          <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </Button>
      </div>
    </>
  )
}

function SearchCard() {
  const [trip, setTrip] = useState<Trip>("one-way")
  const [from, setFrom] = useState<string | null>(null)
  const [to, setTo] = useState<string | null>(null)
  const [outward, setOutward] = useState("")
  const [back, setBack] = useState("")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [errors, setErrors] = useState<Errors>({})
  const [focusRequest, setFocusRequest] = useState<{ id: string } | null>(null)
  const [search, setSearch] = useState<Search | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const today = toKey(new Date())
  const lastDay = toKey(addDays(new Date(), 180))
  const passengers = adults + children

  useEffect(() => {
    if (focusRequest) document.getElementById(focusRequest.id)?.focus()
  }, [focusRequest])

  useEffect(() => {
    if (search) headingRef.current?.focus()
  }, [search])

  const clearError = (field: Field) =>
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })

  const chooseTrip = (value: Trip) => {
    setTrip(value)
    if (value === "one-way") {
      setBack("")
      clearError("return")
    }
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found: Errors = {}

    if (!from) found.from = "Choose the port you sail from."

    if (!to) found.to = "Choose the port you sail to."
    else if (to === from)
      found.to = "Choose a different port from the one you sail from."

    if (!outward) found.outward = "Choose the date you sail."
    else if (outward < today) found.outward = "Choose today or a later date."
    else if (outward > lastDay)
      found.outward = "We sell tickets up to 180 days ahead."

    if (trip === "return") {
      if (!back) found.return = "Choose the date you sail back."
      else if (outward && back < outward)
        found.return = "Choose a return date on or after the outward date."
      else if (back > lastDay)
        found.return = "We sell tickets up to 180 days ahead."
    }

    setErrors(found)
    const order: Field[] = ["from", "to", "outward", "return"]
    const firstError = order.find((field) => found[field])
    if (firstError) {
      setFocusRequest({ id: firstError })
      return
    }

    setSearch({
      trip,
      from: from!,
      to: to!,
      outward,
      back,
      adults,
      children,
    })
  }

  const who = search
    ? search.children > 0
      ? `${adultsText(search.adults)} and ${childrenText(search.children)}`
      : adultsText(search.adults)
    : ""

  return (
    <div className="rounded-xl border bg-card p-5 md:col-span-6 md:col-start-7">
      {!search && (
        <form noValidate aria-label="Search sailings" onSubmit={onSubmit}>
          <div>
            <p id="trip-label" className="font-mono text-label text-foreground">
              Trip
            </p>
            <div
              role="group"
              aria-labelledby="trip-label"
              className="mt-2 flex flex-wrap gap-2"
            >
              {(
                [
                  ["one-way", "One way"],
                  ["return", "Return"],
                ] as const
              ).map(([value, text]) => (
                <Button
                  key={value}
                  variant={trip === value ? "secondary" : "outline"}
                  aria-pressed={trip === value}
                  className={buttonText}
                  onClick={() => chooseTrip(value)}
                >
                  {text}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {(
              [
                ["from", "From", from, setFrom],
                ["to", "To", to, setTo],
              ] as const
            ).map(([field, text, value, setValue]) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block font-mono text-label text-foreground"
                >
                  {text}
                </label>
                <div className="mt-2">
                  <Select
                    items={portItems}
                    value={value}
                    onValueChange={(next) => {
                      if (next === null) return
                      setValue(next)
                      clearError(field)
                    }}
                  >
                    <SelectTrigger
                      id={field}
                      aria-invalid={errors[field] ? true : undefined}
                      aria-describedby={
                        errors[field] ? `${field}-error` : undefined
                      }
                    >
                      <SelectValue placeholder="Choose a port" />
                    </SelectTrigger>
                    <SelectContent>
                      {portItems.map((port) => (
                        <SelectItem key={port.value} value={port.value}>
                          {port.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors[field] && (
                  <ErrorLine id={`${field}-error`} message={errors[field]} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <DateField
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
              text={adultsText(adults)}
              canLower={adults > 1}
              canRaise={adults < 9 && passengers < 9}
              lowerLabel="Fewer adults"
              raiseLabel="More adults"
              onChange={setAdults}
            />
          </div>

          <div className="mt-5">
            <Stepper
              id="children"
              label="Children"
              value={children}
              text={childrenText(children)}
              canLower={children > 0}
              canRaise={children < 8 && passengers < 9}
              lowerLabel="Fewer children"
              raiseLabel="More children"
              onChange={setChildren}
            />
            <p className="mt-2 font-mono text-label text-muted-foreground">
              Ages 4 to 15. Under 4s travel free and need no ticket.
            </p>
          </div>

          <div className="mt-5">
            <Button type="submit" className={buttonText}>
              Search sailings
            </Button>
          </div>
        </form>
      )}

      <div role="status">
        {search && (
          <div>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className={cn("text-h2", codeFocusRing)}
            >
              Your search is ready
            </h2>
            <p className="mt-3 max-w-xl">
              Sailings from {portName(search.from)} to {portName(search.to)} on{" "}
              <time dateTime={search.outward}>{longDate(search.outward)}</time>
              {search.trip === "return" && (
                <>
                  , back on{" "}
                  <time dateTime={search.back}>{longDate(search.back)}</time>
                </>
              )}
              , for {who}.
            </p>
          </div>
        )}
      </div>

      {search && (
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
              <li>
                <a
                  href="/"
                  aria-current="page"
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
        <section className="grid gap-5 pt-8 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <p className="font-mono text-label text-muted-foreground">
              Ferries to the islands · Since 1987
            </p>
            <h1 className="mt-2 text-h1 lg:text-display">
              Over the water by lunchtime
            </h1>
            <p className="mt-3 max-w-xl text-body">
              Every day of the year we sail from Harrowmouth to four island
              harbours. Bring the car, the bike or the dog: there is room on
              board for all three.
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
              <article
                key={route.to}
                className="rounded-xl border bg-card p-5"
              >
                <p className="font-mono text-label text-muted-foreground">
                  {route.sailings}
                </p>
                <h3 className="mt-2 text-h2">Harrowmouth to {route.to}</h3>
                <p className="mt-3 max-w-xl text-body">{route.about}</p>
                <div className="mt-5 flex items-end justify-between gap-5">
                  <p className="font-mono text-label text-muted-foreground">
                    {route.trip}
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
                    See sailings
                    <span className="sr-only"> to {route.to}</span>
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
                <CalendarClock
                  className="size-4"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                Change for £10.00
              </h3>
              <p className="mt-3 max-w-xl">
                Plans shift. Move your booking to another sailing up to 24
                hours before it leaves, for £10.00 a booking.
              </p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-body font-bold">
                <Bike className="size-4" strokeWidth={1.5} aria-hidden="true" />
                Bring the bike
              </h3>
              <p className="mt-3 max-w-xl">
                Bicycles cost £6.00 each and travel on the car deck, with a
                rack by the stairs to lock them to.
              </p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-body font-bold">
                <Dog className="size-4" strokeWidth={1.5} aria-hidden="true" />
                Dogs on deck
              </h3>
              <p className="mt-3 max-w-xl">
                Dogs travel free on the open deck and in the dog lounge on
                every ship, with water bowls by the door.
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
