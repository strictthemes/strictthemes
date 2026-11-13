import * as React from "react"
import { ArrowRight, CircleAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/* ---------- Shared classes ---------- */

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusRing
)

const quietLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const label = "font-mono text-label uppercase"

const buttonClasses =
  "h-auto rounded-md px-6 py-2 font-mono text-label font-normal uppercase"

const sectionClasses = "mt-12 border-t border-border pt-6 md:mt-26"

const sectionHeading = "mt-2 text-h2 md:text-h1"

/* ---------- Dates ---------- */

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]
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

type Ymd = { y: number; m: number; d: number }

function parse(value: string): Ymd | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  return { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) }
}

function utcDay({ y, m, d }: Ymd) {
  return Date.UTC(y, m - 1, d) / 86400000
}

function fromUtcDay(day: number): string {
  const date = new Date(day * 86400000)
  const y = String(date.getUTCFullYear()).padStart(4, "0")
  const m = String(date.getUTCMonth() + 1).padStart(2, "0")
  const d = String(date.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function addDays(value: string, days: number): string {
  const ymd = parse(value)
  return ymd ? fromUtcDay(utcDay(ymd) + days) : value
}

function todayValue(): string {
  const now = new Date()
  const y = String(now.getFullYear()).padStart(4, "0")
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function longDate(value: string): string {
  const ymd = parse(value)
  if (!ymd) return value
  const weekday = new Date(utcDay(ymd) * 86400000).getUTCDay()
  return `${WEEKDAYS[weekday]} ${ymd.d} ${MONTHS[ymd.m - 1]} ${ymd.y}`
}

function nightsBetween(arrive: string, leave: string): number | null {
  const a = parse(arrive)
  const b = parse(leave)
  if (!a || !b) return null
  const nights = utcDay(b) - utcDay(a)
  return nights > 0 ? nights : null
}

const GUESTS = [
  { value: "1", label: "1 guest" },
  { value: "2", label: "2 guests" },
  { value: "3", label: "3 guests" },
  { value: "4", label: "4 guests" },
]

/* ---------- Small parts ---------- */

type PlateProps = {
  label: string
  window: "left" | "right"
  ground?: "h-1/4" | "h-1/3" | "h-1/2"
  className?: string
}

function Plate({ label, window, ground = "h-1/3", className }: PlateProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-muted",
        className
      )}
    >
      <div className={cn("absolute inset-x-0 bottom-0 bg-secondary", ground)} />
      <div
        className={cn(
          "absolute top-1/6 h-1/3 w-1/4 bg-secondary",
          window === "left" ? "left-1/6" : "right-1/6"
        )}
      />
    </div>
  )
}

function OnwardLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} className={cn(textLink, label, "inline-flex items-center gap-2")}>
      {children}
      <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
    </a>
  )
}

type Row = { key: string; name: React.ReactNode; figure: React.ReactNode }

function Rows({ rows, className }: { rows: Row[]; className?: string }) {
  return (
    <ul className={cn("list-none p-0", className)}>
      {rows.map((row) => (
        <li key={row.key} className="flex items-baseline gap-2 py-2">
          <span className="min-w-0">{row.name}</span>
          <span
            aria-hidden="true"
            className="min-w-4 flex-1 border-b border-border"
          />
          <span
            className={cn(
              label,
              "shrink-0 whitespace-nowrap text-foreground tabular-nums"
            )}
          >
            {row.figure}
          </span>
        </li>
      ))}
    </ul>
  )
}

function Time({ value }: { value: string }) {
  return <time dateTime={value}>{value}</time>
}

function Hours({ from, to }: { from: string; to: string }) {
  return (
    <>
      <Time value={from} />–<Time value={to} />
    </>
  )
}

/* ---------- Date check ---------- */

type Errors = { arrive?: string; leave?: string }

function DateCheck() {
  const [today] = React.useState(todayValue)
  const tomorrow = addDays(today, 1)

  const [arrive, setArrive] = React.useState("")
  const [leave, setLeave] = React.useState("")
  const [guests, setGuests] = React.useState("2")
  const [errors, setErrors] = React.useState<Errors>({})
  const [focusRequest, setFocusRequest] = React.useState<{
    id: string
    n: number
  } | null>(null)

  React.useEffect(() => {
    if (focusRequest) document.getElementById(focusRequest.id)?.focus()
  }, [focusRequest])

  const nights = nightsBetween(arrive, leave)

  function validate(): Errors {
    const next: Errors = {}
    if (!arrive) next.arrive = "Choose the day you arrive."
    else if (arrive < today) next.arrive = "Choose today or a later day."
    if (!leave) next.leave = "Choose the day you leave."
    else if (arrive && leave <= arrive)
      next.leave = "Choose a day after the day you arrive."
    return next
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const next = validate()
    setErrors(next)
    if (next.arrive || next.leave) {
      event.preventDefault()
      setFocusRequest((current) => ({
        id: next.arrive ? "arrive" : "leave",
        n: (current?.n ?? 0) + 1,
      }))
    }
  }

  return (
    <form
      noValidate
      action="/reserve"
      method="get"
      aria-labelledby="date-check-title"
      onSubmit={handleSubmit}
      className="mt-6 rounded-xl border border-border bg-card p-6"
    >
      <h2 id="date-check-title" className={cn(label, "text-foreground")}>
        Check your dates
      </h2>

      <div className="mt-4 grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-3">
          <label
            id="arrive-label"
            htmlFor="arrive"
            className={cn(label, "block text-foreground")}
          >
            Arrive
          </label>
          <DatePicker
            id="arrive"
            labelId="arrive-label"
            name="arrive"
            value={arrive}
            onValueChange={(value) => {
              setArrive(value)
              setErrors((current) => ({ ...current, arrive: undefined }))
            }}
            min={today}
            aria-invalid={errors.arrive ? true : undefined}
            aria-describedby={errors.arrive ? "arrive-error" : undefined}
            className="mt-2"
          />
        </div>

        <div className="md:col-span-3">
          <label
            id="leave-label"
            htmlFor="leave"
            className={cn(label, "block text-foreground")}
          >
            Leave
          </label>
          <DatePicker
            id="leave"
            labelId="leave-label"
            name="leave"
            value={leave}
            onValueChange={(value) => {
              setLeave(value)
              setErrors((current) => ({ ...current, leave: undefined }))
            }}
            min={arrive ? addDays(arrive, 1) : tomorrow}
            aria-invalid={errors.leave ? true : undefined}
            aria-describedby={errors.leave ? "leave-error" : undefined}
            className="mt-2"
          />
        </div>

        <div className="md:col-span-3">
          <label
            htmlFor="guests"
            className={cn(label, "block text-foreground")}
          >
            Guests
          </label>
          <Select
            name="guests"
            items={GUESTS}
            value={guests}
            onValueChange={(value) => {
              if (value !== null) setGuests(value)
            }}
          >
            <SelectTrigger id="guests" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GUESTS.map((choice) => (
                <SelectItem key={choice.value} value={choice.value}>
                  {choice.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-3">
          <Button
            type="submit"
            className="h-11 w-full rounded-md px-6 py-2 font-mono text-label font-normal uppercase"
          >
            Check dates
          </Button>
        </div>
      </div>

      {errors.arrive ? (
        <p
          id="arrive-error"
          className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
        >
          <CircleAlert
            className="size-4 shrink-0"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          {errors.arrive}
        </p>
      ) : null}
      {errors.leave ? (
        <p
          id="leave-error"
          className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
        >
          <CircleAlert
            className="size-4 shrink-0"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          {errors.leave}
        </p>
      ) : null}

      <p role="status" className={cn(label, "mt-4 text-foreground")}>
        {nights !== null ? (
          <>
            {nights === 1 ? "1 night" : `${nights} nights`} ·{" "}
            <time dateTime={arrive}>{longDate(arrive)}</time> to{" "}
            <time dateTime={leave}>{longDate(leave)}</time>
          </>
        ) : (
          "Choose the days you arrive and leave"
        )}
      </p>
      <p className="mt-2 font-mono text-label text-muted-foreground">
        Rooms from £78 a night, breakfast included. Nothing is paid until we
        confirm your stay.
      </p>
    </form>
  )
}

/* ---------- Page ---------- */

const ROOMS = [
  {
    name: "Marram",
    facts: "Sleeps 2 · King bed · Sea view",
    price: "From £128 a night",
    href: "/rooms/marram",
    window: "left" as const,
    ground: "h-1/3" as const,
    plate: "The bay window of Marram, with the bed facing the sea",
  },
  {
    name: "Thrift",
    facts: "Sleeps 2 · Double bed · Garden view",
    price: "From £104 a night",
    href: "#",
    window: "right" as const,
    ground: "h-1/2" as const,
    plate: "Thrift on the ground floor, its door open to the walled garden",
  },
  {
    name: "Tamarisk",
    facts: "Sleeps 4 · King bed and two singles · Harbour view",
    price: "From £164 a night",
    href: "#",
    window: "left" as const,
    ground: "h-1/4" as const,
    plate: "Tamarisk under the eaves, two rooms joined by a short landing",
  },
]

const NAV = [
  { label: "Rooms", href: "/rooms" },
  { label: "Menu", href: "/menu" },
  { label: "Find us", href: "/#find-us" },
  { label: "Reserve", href: "/reserve" },
]

export function App() {
  return (
    <div className="mx-auto max-w-[1160px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-4 border-b border-border py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn(quietLink, "font-heading text-h2")}>
          Kittiwake House
        </a>
        <nav aria-label="Main">
          <ul className="flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={cn(quietLink, label)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        {/* Opening */}
        <section aria-labelledby="opening-title" className="pt-12">
          <div className="grid gap-6 md:grid-cols-12">
            <div className="flex items-end rounded-xl bg-clay p-6 text-clay-foreground md:col-span-5">
              <div>
                <p className={label}>Guesthouse · Port Lowan</p>
                <h1 id="opening-title" className="mt-2 text-h1 lg:text-display">
                  A quiet house <span className="italic">above the harbour</span>
                </h1>
                <p className="mt-4 text-body">
                  Six rooms and a veranda that faces the bay. Breakfast is
                  included, and nothing hurries you.
                </p>
              </div>
            </div>
            <Plate
              label="The glazed veranda of Kittiwake House at breakfast time, with the bay beyond its windows"
              window="right"
              className="md:col-span-7 md:col-start-6"
            />
          </div>

          <DateCheck />
        </section>

        {/* Three of the rooms */}
        <section aria-labelledby="rooms-title" className={sectionClasses}>
          <p className={cn(label, "text-muted-foreground")}>
            Six rooms · From £78 a night
          </p>
          <h2 id="rooms-title" className={sectionHeading}>
            Three of our rooms
          </h2>
          <p className="mt-4 max-w-xl text-body">
            Each room is named for a plant that grows on the cliff path, and no
            two are alike.
          </p>
          <ul className="mt-6 grid list-none gap-6 p-0 md:grid-cols-3">
            {ROOMS.map((room) => (
              <li key={room.name}>
                <Plate label={room.plate} window={room.window} ground={room.ground} />
                <h3 className="mt-4 text-h2">{room.name}</h3>
                <p className={cn(label, "mt-2 text-foreground")}>{room.facts}</p>
                <p className={cn(label, "mt-2 text-muted-foreground tabular-nums")}>
                  {room.price}
                </p>
                <p className="mt-4">
                  <OnwardLink href={room.href}>{`See ${room.name}`}</OnwardLink>
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <a
              href="/rooms"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                buttonClasses
              )}
            >
              See all six rooms
            </a>
          </p>
        </section>

        {/* The house */}
        <section aria-labelledby="house-title" className={sectionClasses}>
          <div className="grid gap-6 md:grid-cols-12 md:items-start">
            <figure className="md:col-span-7">
              <Plate
                label="Kittiwake House seen from the quay, the third house of Harbour Terrace, with its white veranda"
                window="left"
                ground="h-1/2"
              />
              <figcaption className={cn(label, "mt-2 text-muted-foreground")}>
                Harbour Terrace from the quay
              </figcaption>
            </figure>
            <div className="md:col-span-4 md:col-start-9">
              <p className={cn(label, "text-muted-foreground")}>
                Since <time dateTime="1894">1894</time>
              </p>
              <h2 id="house-title" className={sectionHeading}>
                The house
              </h2>
              <p className="mt-4 max-w-xl text-body">
                The harbour pilot built this house in 1894, with a glazed
                veranda across the front so that he could watch for ships and
                stay dry. We have kept it since 2016 and changed as little as we
                could.
              </p>
              <p className="mt-4 max-w-xl text-body">
                There are six rooms, a breakfast room that opens onto the
                veranda, and a walled garden at the back. The quay is at the
                foot of the terrace steps.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-12">
            <figure className="md:col-span-9">
              <blockquote>
                <p className="font-heading text-h2 italic md:text-h1">
                  “We meant to walk the cliff path every day. Mostly we sat on
                  the veranda and watched the boats come in.”
                </p>
              </blockquote>
              <figcaption className={cn(label, "mt-4 text-muted-foreground")}>
                Ines and Paul · Stayed in Marram, April 2027
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Breakfast in brief */}
        <section
          aria-labelledby="breakfast-title"
          className={cn(sectionClasses, "grid gap-6 md:grid-cols-12 md:items-start")}
        >
          <div className="md:col-span-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className={cn(label, "text-muted-foreground")}>Every morning</p>
              <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
                Breakfast included
              </Badge>
            </div>
            <h2 id="breakfast-title" className={sectionHeading}>
              Breakfast on the veranda
            </h2>
            <p className="mt-4 max-w-xl text-body">
              We cook it to order, with eggs from the farm on the hill and
              kippers from the smokehouse on the quay, and serve it for as long
              as the hours here say.
            </p>
            <p className="mt-6">
              <OnwardLink href="/menu">See the menu</OnwardLink>
            </p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Rows
              rows={[
                {
                  key: "breakfast",
                  name: "Breakfast, every day",
                  figure: <Hours from="08:00" to="10:00" />,
                },
                {
                  key: "sunday",
                  name: "Breakfast on Sundays",
                  figure: <Hours from="08:00" to="10:30" />,
                },
                {
                  key: "tea",
                  name: "Tea and cake on the veranda",
                  figure: <Hours from="15:00" to="17:00" />,
                },
                {
                  key: "supper",
                  name: "Supper, Thursday to Saturday",
                  figure: <Hours from="18:30" to="20:30" />,
                },
              ]}
            />
            <p className="mt-4 max-w-xl text-body">
              Supper is a short menu of three courses. Tell us by{" "}
              <Time value="14:00" /> if you would like a table.
            </p>
          </div>
        </section>

        {/* Find us */}
        <section
          id="find-us"
          aria-labelledby="find-us-title"
          className={cn(
            sectionClasses,
            "grid scroll-mt-6 gap-6 md:grid-cols-12 md:items-start"
          )}
        >
          <div className="md:col-span-4">
            <p className={cn(label, "text-muted-foreground")}>Port Lowan</p>
            <h2 id="find-us-title" className={sectionHeading}>
              Find us
            </h2>
            <address className="mt-4 text-body not-italic">
              <span className="block">Kittiwake House</span>
              <span className="block">9 Harbour Terrace</span>
              <span className="block">Port Lowan LW6 3QT</span>
            </address>
            <p className="mt-4">
              <a href="tel:+441632960352" className={textLink}>
                01632 960 352
              </a>
            </p>
            <p className="mt-2">
              <a href="mailto:stay@kittiwakehouse.example" className={textLink}>
                stay@kittiwakehouse.example
              </a>
            </p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <h3 className={cn(label, "text-foreground")}>Getting here</h3>
            <Rows
              className="mt-4"
              rows={[
                {
                  key: "station",
                  name: "Port Lowan station",
                  figure: "12 min on foot",
                },
                {
                  key: "bus",
                  name: "Harbour bus stop, routes 7 and 18",
                  figure: "2 min on foot",
                },
                {
                  key: "car",
                  name: "Quay car park, free for guests",
                  figure: "4 min on foot",
                },
              ]}
            />
            <h3 className={cn(label, "mt-12 text-foreground")}>
              Arriving and leaving
            </h3>
            <Rows
              className="mt-4"
              rows={[
                {
                  key: "arrive",
                  name: "Arrive",
                  figure: <Hours from="15:00" to="20:00" />,
                },
                {
                  key: "leave",
                  name: "Leave by",
                  figure: <Time value="10:30" />,
                },
                {
                  key: "late",
                  name: (
                    <>
                      Later than <Time value="20:00" />
                    </>
                  ),
                  figure: "By arrangement",
                },
              ]}
            />
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-border py-12 md:mt-26">
        <div className="grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <p className="font-heading text-h2">Kittiwake House</p>
            <p className="mt-2 max-w-xl text-body">
              Six rooms above the harbour at Port Lowan, with breakfast on the
              veranda.
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <address className="text-body not-italic">
              <span className="block">9 Harbour Terrace</span>
              <span className="block">Port Lowan LW6 3QT</span>
            </address>
            <p className="mt-4 text-body">
              <a href="tel:+441632960352" className={quietLink}>
                01632 960 352
              </a>
            </p>
            <p className="mt-2 text-body">
              <a href="mailto:stay@kittiwakehouse.example" className={quietLink}>
                stay@kittiwakehouse.example
              </a>
            </p>
          </div>
        </div>
        <p className={cn(label, "mt-6 text-muted-foreground")}>
          © 2027 Kittiwake House · Open all year
        </p>
      </footer>
    </div>
  )
}

export default App
