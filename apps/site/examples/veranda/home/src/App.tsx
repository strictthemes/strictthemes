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

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const headerLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusRing
)

const onwardLink = cn(
  textLink,
  "inline-flex items-center gap-2 font-mono text-label uppercase"
)

const buttonClasses =
  "h-auto rounded-md px-6 py-2 font-mono text-label font-normal uppercase"

const label = "font-mono text-label uppercase"

const sectionClasses = "mt-12 border-t border-border pt-6 md:mt-26"

const guestItems = [
  { value: "1", label: "1 guest" },
  { value: "2", label: "2 guests" },
  { value: "3", label: "3 guests" },
  { value: "4", label: "4 guests" },
]

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

type Parts = { year: number; month: number; day: number }

function parse(value: string): Parts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  }
}

function dayNumber(value: string): number | null {
  const parts = parse(value)
  if (!parts) return null
  return Date.UTC(parts.year, parts.month - 1, parts.day) / 86_400_000
}

function fromDayNumber(n: number): string {
  const date = new Date(n * 86_400_000)
  const y = String(date.getUTCFullYear()).padStart(4, "0")
  const m = String(date.getUTCMonth() + 1).padStart(2, "0")
  const d = String(date.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

// Today on the visitor's own clock, as a date field holds it.
function todayValue(): string {
  const now = new Date()
  const y = String(now.getFullYear()).padStart(4, "0")
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function longDate(value: string): string {
  const parts = parse(value)
  if (!parts) return ""
  const weekday = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day)
  ).getUTCDay()
  return `${WEEKDAYS[weekday]} ${parts.day} ${MONTHS[parts.month - 1]} ${parts.year}`
}

type Field = "arrive" | "leave"
type Errors = Partial<Record<Field, string>>

function Plate({
  label: ariaLabel,
  window,
  ground = "h-1/3",
  className,
}: {
  label: string
  window: "left" | "right"
  ground?: "h-1/4" | "h-1/3" | "h-1/2"
  className?: string
}) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
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

function Row({
  name,
  children,
}: {
  name: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <li className="flex items-baseline gap-2 py-2">
      <span className="min-w-0 text-body">{name}</span>
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
        {children}
      </span>
    </li>
  )
}

function Hours({ from, to }: { from: string; to: string }) {
  return (
    <>
      <time dateTime={from}>{from}</time>–<time dateTime={to}>{to}</time>
    </>
  )
}

const rooms = [
  {
    name: "Marram",
    facts: "Sleeps 2 · King bed · Sea view",
    price: "From £128 a night",
    link: "See Marram",
    href: "/rooms/marram",
    window: "left" as const,
    ground: "h-1/3" as const,
    plate: "The bay window of Marram, with the bed facing the sea",
  },
  {
    name: "Thrift",
    facts: "Sleeps 2 · Double bed · Garden view",
    price: "From £104 a night",
    link: "See Thrift",
    href: "#",
    window: "right" as const,
    ground: "h-1/2" as const,
    plate: "Thrift on the ground floor, its door open to the walled garden",
  },
  {
    name: "Tamarisk",
    facts: "Sleeps 4 · King bed and two singles · Harbour view",
    price: "From £164 a night",
    link: "See Tamarisk",
    href: "#",
    window: "left" as const,
    ground: "h-1/4" as const,
    plate: "Tamarisk under the eaves, two rooms joined by a short landing",
  },
]

function DateCheck() {
  const [arrive, setArrive] = React.useState("")
  const [leave, setLeave] = React.useState("")
  const [guests, setGuests] = React.useState("2")
  const [errors, setErrors] = React.useState<Errors>({})
  const [focusRequest, setFocusRequest] = React.useState<{
    field: Field
  } | null>(null)

  const arriveRef = React.useRef<HTMLButtonElement>(null)
  const leaveRef = React.useRef<HTMLButtonElement>(null)

  const today = todayValue()
  const todayN = dayNumber(today)!
  const arriveN = dayNumber(arrive)
  const leaveN = dayNumber(leave)
  const leaveMin = fromDayNumber((arriveN ?? todayN) + 1)

  React.useEffect(() => {
    if (!focusRequest) return
    const target =
      focusRequest.field === "arrive" ? arriveRef.current : leaveRef.current
    target?.focus()
  }, [focusRequest])

  const goodDates = arriveN !== null && leaveN !== null && leaveN > arriveN
  const nights = goodDates ? leaveN - arriveN : 0

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const now = dayNumber(todayValue())!
    const next: Errors = {}

    if (arriveN === null) next.arrive = "Choose the day you arrive."
    else if (arriveN < now) next.arrive = "Choose today or a later day."

    if (leaveN === null) next.leave = "Choose the day you leave."
    else if (arriveN !== null && leaveN <= arriveN)
      next.leave = "Choose a day after the day you arrive."

    setErrors(next)

    const first: Field | undefined = next.arrive
      ? "arrive"
      : next.leave
        ? "leave"
        : undefined

    if (first) {
      event.preventDefault()
      setFocusRequest({ field: first })
    }
  }

  return (
    <form
      noValidate
      action="/reserve"
      method="get"
      aria-labelledby="check-title"
      onSubmit={handleSubmit}
      className="mt-6 rounded-xl border border-border bg-card p-6"
    >
      <h2
        id="check-title"
        className={cn(label, "text-foreground")}
      >
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
            ref={arriveRef}
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
            ref={leaveRef}
            id="leave"
            labelId="leave-label"
            name="leave"
            value={leave}
            onValueChange={(value) => {
              setLeave(value)
              setErrors((current) => ({ ...current, leave: undefined }))
            }}
            min={leaveMin}
            aria-invalid={errors.leave ? true : undefined}
            aria-describedby={errors.leave ? "leave-error" : undefined}
            className="mt-2"
          />
        </div>

        <div className="md:col-span-3">
          <label
            id="guests-label"
            htmlFor="guests"
            className={cn(label, "block text-foreground")}
          >
            Guests
          </label>
          <Select
            name="guests"
            items={guestItems}
            value={guests}
            onValueChange={(value) => {
              if (value !== null) setGuests(value)
            }}
          >
            <SelectTrigger
              id="guests"
              aria-labelledby="guests-label"
              className="mt-2"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {guestItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-3">
          <Button
            type="submit"
            className={cn(buttonClasses, "h-11 w-full")}
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

      <p
        role="status"
        className={cn(label, "mt-4 text-foreground tabular-nums")}
      >
        {goodDates ? (
          <>
            {nights === 1 ? "1 night" : `${nights} nights`} ·{" "}
            <time dateTime={arrive}>{longDate(arrive)}</time> to{" "}
            <time dateTime={leave}>{longDate(leave)}</time>
          </>
        ) : (
          "Choose the days you arrive and leave"
        )}
      </p>

      <p className="mt-2 font-mono text-label text-muted-foreground tabular-nums">
        Rooms from £78 a night, breakfast included. Nothing is paid until we
        confirm your stay.
      </p>
    </form>
  )
}

export function App() {
  return (
    <div className="mx-auto max-w-[1160px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-4 border-b border-border py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn(headerLink, "font-heading text-h2")}>
          Kittiwake House
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <a href="/rooms" className={cn(headerLink, label)}>
                Rooms
              </a>
            </li>
            <li>
              <a href="/menu" className={cn(headerLink, label)}>
                Menu
              </a>
            </li>
            <li>
              <a href="/#find-us" className={cn(headerLink, label)}>
                Find us
              </a>
            </li>
            <li>
              <a href="/reserve" className={cn(headerLink, label)}>
                Reserve
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <section aria-labelledby="home-title" className="pt-12">
          <div className="grid gap-6 md:grid-cols-12">
            <div className="flex items-end rounded-xl bg-clay p-6 text-clay-foreground md:col-span-5">
              <div>
                <p className={label}>Guesthouse · Port Lowan</p>
                <h1 id="home-title" className="mt-2 text-h1 lg:text-display">
                  A quiet house{" "}
                  <span className="italic">above the harbour</span>
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

        <section aria-labelledby="rooms-title" className={sectionClasses}>
          <p className={cn(label, "text-muted-foreground tabular-nums")}>
            Six rooms · From £78 a night
          </p>
          <h2 id="rooms-title" className="mt-2 text-h2 md:text-h1">
            Three of our rooms
          </h2>
          <p className="mt-4 max-w-xl text-body">
            Each room is named for a plant that grows on the cliff path, and no
            two are alike.
          </p>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {rooms.map((room) => (
              <li key={room.name}>
                <Plate
                  label={room.plate}
                  window={room.window}
                  ground={room.ground}
                />
                <h3 className="mt-4 text-h2">{room.name}</h3>
                <p className={cn(label, "mt-2 text-foreground")}>
                  {room.facts}
                </p>
                <p
                  className={cn(
                    label,
                    "mt-2 text-muted-foreground tabular-nums"
                  )}
                >
                  {room.price}
                </p>
                <p className="mt-4">
                  <a href={room.href} className={onwardLink}>
                    {room.link}
                    <ArrowRight
                      className="size-4"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </a>
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

        <section aria-labelledby="house-title" className={sectionClasses}>
          <div className="grid gap-6 md:grid-cols-12 md:items-start">
            <figure className="md:col-span-7">
              <Plate
                label="Kittiwake House seen from the quay, the third house of Harbour Terrace, with its white veranda"
                window="left"
                ground="h-1/2"
              />
              <figcaption
                className={cn(label, "mt-2 text-muted-foreground")}
              >
                Harbour Terrace from the quay
              </figcaption>
            </figure>
            <div className="md:col-span-4 md:col-start-9">
              <p className={cn(label, "text-muted-foreground tabular-nums")}>
                Since <time dateTime="1894">1894</time>
              </p>
              <h2 id="house-title" className="mt-2 text-h2 md:text-h1">
                The house
              </h2>
              <p className="mt-4 max-w-xl text-body">
                The harbour pilot built this house in 1894, with a glazed
                veranda across the front so that he could watch for ships and
                stay dry. We have kept it since 2016 and changed as little as
                we could.
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
              <figcaption
                className={cn(label, "mt-4 text-muted-foreground")}
              >
                Ines and Paul · Stayed in Marram,{" "}
                <time dateTime="2027-04">April 2027</time>
              </figcaption>
            </figure>
          </div>
        </section>

        <section
          aria-labelledby="breakfast-title"
          className={cn(
            sectionClasses,
            "grid gap-6 md:grid-cols-12 md:items-start"
          )}
        >
          <div className="md:col-span-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className={cn(label, "text-muted-foreground")}>
                Every morning
              </p>
              <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
                Breakfast included
              </Badge>
            </div>
            <h2 id="breakfast-title" className="mt-2 text-h2 md:text-h1">
              Breakfast on the veranda
            </h2>
            <p className="mt-4 max-w-xl text-body">
              We cook breakfast to order, with eggs from the farm on the hill
              and kippers from the smokehouse on the quay. It is served at the
              hours listed here, and it is in the price of every room.
            </p>
            <p className="mt-6">
              <a href="/menu" className={onwardLink}>
                See the menu
                <ArrowRight
                  className="size-4"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </a>
            </p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <ul>
              <Row name="Breakfast, every day">
                <Hours from="08:00" to="10:00" />
              </Row>
              <Row name="Breakfast on Sundays">
                <Hours from="08:00" to="10:30" />
              </Row>
              <Row name="Tea and cake on the veranda">
                <Hours from="15:00" to="17:00" />
              </Row>
              <Row name="Supper, Thursday to Saturday">
                <Hours from="18:30" to="20:30" />
              </Row>
            </ul>
            <p className="mt-4 max-w-xl text-body">
              Supper is a short menu of three courses. Tell us by{" "}
              <time dateTime="14:00">14:00</time> if you would like a table.
            </p>
          </div>
        </section>

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
            <h2 id="find-us-title" className="mt-2 text-h2 md:text-h1">
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
              <a
                href="mailto:stay@kittiwakehouse.example"
                className={textLink}
              >
                stay@kittiwakehouse.example
              </a>
            </p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <h3 className={cn(label, "text-foreground")}>Getting here</h3>
            <ul className="mt-4">
              <Row name="Port Lowan station">12 min on foot</Row>
              <Row name="Harbour bus stop, routes 7 and 18">2 min on foot</Row>
              <Row name="Quay car park, free for guests">4 min on foot</Row>
            </ul>
            <h3 className={cn(label, "mt-12 text-foreground")}>
              Arriving and leaving
            </h3>
            <ul className="mt-4">
              <Row name="Arrive">
                <Hours from="15:00" to="20:00" />
              </Row>
              <Row name="Leave by">
                <time dateTime="10:30">10:30</time>
              </Row>
              <Row
                name={
                  <>
                    Later than <time dateTime="20:00">20:00</time>
                  </>
                }
              >
                By arrangement
              </Row>
            </ul>
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-border py-12 md:mt-26">
        <div className="grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <p className="font-heading text-h2">Kittiwake House</p>
            <p className="mt-2 text-body">
              Six rooms above the harbour at Port Lowan, with breakfast on the
              veranda.
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <address className="text-body not-italic">
              <span className="block">9 Harbour Terrace</span>
              <span className="block">Port Lowan LW6 3QT</span>
            </address>
            <p className="mt-4">
              <a href="tel:+441632960352" className={cn(headerLink, "text-body")}>
                01632 960 352
              </a>
            </p>
            <p className="mt-2">
              <a
                href="mailto:stay@kittiwakehouse.example"
                className={cn(headerLink, "text-body")}
              >
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
