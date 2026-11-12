import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { ArrowRight, CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants, Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const section = "mt-12 border-t border-border pt-6 md:mt-26"
const headerLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusOutline
)
const buttonClasses =
  "h-auto rounded-md px-6 py-2 font-mono text-label font-normal uppercase"

/* Dates: calendar days as written in a date field, counted in UTC */

const DAY = 24 * 60 * 60 * 1000
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

function toDay(value: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

function toValue(day: number): string {
  const d = new Date(day)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
}

function todayDay(): number {
  const now = new Date()
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
}

function DateText({ day }: { day: number }) {
  const d = new Date(day)
  return (
    <time dateTime={toValue(day)}>
      {WEEKDAYS[d.getUTCDay()]} {d.getUTCDate()} {MONTHS[d.getUTCMonth()]}{" "}
      {d.getUTCFullYear()}
    </time>
  )
}

/* Pictures */

type PlateProps = {
  description: string
  window: "left" | "right"
  ground?: "h-1/4" | "h-1/3" | "h-1/2"
  className?: string
}

function Plate({ description, window, ground = "h-1/3", className }: PlateProps) {
  return (
    <div
      role="img"
      aria-label={description}
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

/* Small parts */

function OnwardLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className={cn(textLink, label, "inline-flex items-center gap-2")}>
      {children}
      <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
    </a>
  )
}

function Rows({ rows }: { rows: { name: ReactNode; figure: ReactNode }[] }) {
  return (
    <ul className="list-none p-0">
      {rows.map((row, i) => (
        <li key={i} className="flex items-baseline gap-2 py-2">
          <span className="min-w-0 text-body">{row.name}</span>
          <span aria-hidden="true" className="min-w-4 flex-1 border-b border-border" />
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

function Hours({ from, to }: { from: string; to: string }) {
  return (
    <>
      <time dateTime={from}>{from}</time>–<time dateTime={to}>{to}</time>
    </>
  )
}

/* Rooms */

const rooms = [
  {
    name: "Marram",
    facts: "Sleeps 2 · King bed · Sea view",
    price: "From £128 a night",
    href: "/rooms/marram",
    plate: {
      window: "left",
      ground: "h-1/3",
      description: "The bay window of Marram, with the bed facing the sea",
    },
  },
  {
    name: "Thrift",
    facts: "Sleeps 2 · Double bed · Garden view",
    price: "From £104 a night",
    href: "#",
    plate: {
      window: "right",
      ground: "h-1/2",
      description: "Thrift on the ground floor, its door open to the walled garden",
    },
  },
  {
    name: "Tamarisk",
    facts: "Sleeps 4 · King bed and two singles · Harbour view",
    price: "From £164 a night",
    href: "#",
    plate: {
      window: "left",
      ground: "h-1/4",
      description: "Tamarisk under the eaves, two rooms joined by a short landing",
    },
  },
] as const

/* Date check */

type Field = "arrive" | "leave"
type Errors = Partial<Record<Field, string>>

const fieldLabel = cn(label, "block text-foreground")
const fieldClasses = "mt-2 h-11 rounded-md px-4 text-body md:text-body"

function DateCheck() {
  const [today] = useState(todayDay)
  const [arrive, setArrive] = useState("")
  const [leave, setLeave] = useState("")
  const [guests, setGuests] = useState("2")
  const [errors, setErrors] = useState<Errors>({})
  const [focusField, setFocusField] = useState<{ field: Field } | null>(null)
  const arriveRef = useRef<HTMLInputElement>(null)
  const leaveRef = useRef<HTMLInputElement>(null)

  const arriveDay = toDay(arrive)
  const leaveDay = toDay(leave)
  const nights =
    arriveDay !== null && leaveDay !== null && leaveDay > arriveDay
      ? Math.round((leaveDay - arriveDay) / DAY)
      : null

  useEffect(() => {
    if (!focusField) return
    const ref = focusField.field === "arrive" ? arriveRef : leaveRef
    ref.current?.focus()
  }, [focusField])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const next: Errors = {}
    if (arriveDay === null) next.arrive = "Choose the day you arrive."
    else if (arriveDay < today) next.arrive = "Choose today or a later day."
    if (leaveDay === null) next.leave = "Choose the day you leave."
    else if (arriveDay !== null && leaveDay <= arriveDay)
      next.leave = "Choose a day after the day you arrive."

    setErrors(next)
    const first = (["arrive", "leave"] as const).find((field) => next[field])
    if (first) {
      event.preventDefault()
      setFocusField({ field: first })
    }
  }

  function clearError(field: Field) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  return (
    <form
      noValidate
      action="/reserve"
      method="get"
      aria-labelledby="date-check-heading"
      onSubmit={handleSubmit}
      className="mt-6 rounded-xl border border-border bg-card p-6"
    >
      <h2 id="date-check-heading" className={cn(label, "text-foreground")}>
        Check your dates
      </h2>
      <div className="mt-4 grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-3">
          <label htmlFor="arrive" className={fieldLabel}>
            Arrive
          </label>
          <Input
            ref={arriveRef}
            id="arrive"
            name="arrive"
            type="date"
            min={toValue(today)}
            value={arrive}
            onChange={(event) => {
              setArrive(event.target.value)
              clearError("arrive")
            }}
            aria-invalid={errors.arrive ? true : undefined}
            aria-describedby={errors.arrive ? "arrive-error" : undefined}
            className={fieldClasses}
          />
        </div>
        <div className="md:col-span-3">
          <label htmlFor="leave" className={fieldLabel}>
            Leave
          </label>
          <Input
            ref={leaveRef}
            id="leave"
            name="leave"
            type="date"
            min={toValue((arriveDay ?? today) + DAY)}
            value={leave}
            onChange={(event) => {
              setLeave(event.target.value)
              clearError("leave")
            }}
            aria-invalid={errors.leave ? true : undefined}
            aria-describedby={errors.leave ? "leave-error" : undefined}
            className={fieldClasses}
          />
        </div>
        <div className="md:col-span-3">
          <label htmlFor="guests" className={fieldLabel}>
            Guests
          </label>
          <select
            id="guests"
            name="guests"
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            className={cn(
              "mt-2 h-11 w-full rounded-md border border-muted-foreground bg-card px-4 text-body text-foreground aria-invalid:border-destructive focus-visible:border-ring",
              focusOutline
            )}
          >
            <option value="1">1 guest</option>
            <option value="2">2 guests</option>
            <option value="3">3 guests</option>
            <option value="4">4 guests</option>
          </select>
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
      {(["arrive", "leave"] as const).map((field) =>
        errors[field] ? (
          <p
            key={field}
            id={`${field}-error`}
            className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
          >
            <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            {errors[field]}
          </p>
        ) : null
      )}
      <p role="status" className={cn(label, "mt-4 text-foreground")}>
        {nights !== null && arriveDay !== null && leaveDay !== null ? (
          <>
            {nights === 1 ? "1 night" : `${nights} nights`} · <DateText day={arriveDay} /> to{" "}
            <DateText day={leaveDay} />
          </>
        ) : (
          "Choose the days you arrive and leave"
        )}
      </p>
      <p className="mt-2 font-mono text-label text-muted-foreground">
        Rooms from £78 a night, breakfast included. Nothing is paid until we confirm
        your stay.
      </p>
    </form>
  )
}

/* Page */

export function App() {
  return (
    <div className="mx-auto max-w-[1160px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-4 border-b border-border py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn(headerLink, "font-heading text-h2")}>
          Kittiwake House
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              ["Rooms", "/rooms"],
              ["Menu", "/menu"],
              ["Find us", "/#find-us"],
              ["Reserve", "/reserve"],
            ].map(([text, href]) => (
              <li key={href}>
                <a href={href} className={cn(headerLink, label)}>
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section aria-labelledby="opening-heading" className="pt-12">
          <div className="grid gap-6 md:grid-cols-12">
            <div className="flex items-end rounded-xl bg-clay p-6 text-clay-foreground md:col-span-5">
              <div>
                <p className={label}>Guesthouse · Port Lowan</p>
                <h1 id="opening-heading" className="mt-2 text-h1 lg:text-display">
                  A quiet house <span className="italic">above the harbour</span>
                </h1>
                <p className="mt-4 text-body">
                  Six rooms and a veranda that faces the bay. Breakfast is included,
                  and nothing hurries you.
                </p>
              </div>
            </div>
            <Plate
              window="right"
              description="The glazed veranda of Kittiwake House at breakfast time, with the bay beyond its windows"
              className="md:col-span-7 md:col-start-6"
            />
          </div>
          <DateCheck />
        </section>

        <section aria-labelledby="rooms-heading" className={section}>
          <p className={cn(label, "text-muted-foreground")}>
            Six rooms · From <span className="tabular-nums">£78</span> a night
          </p>
          <h2 id="rooms-heading" className="mt-2 text-h2 md:text-h1">
            Three of our rooms
          </h2>
          <p className="mt-4 max-w-xl text-body">
            Each room is named for a plant that grows on the cliff path, and no two
            are alike.
          </p>
          <ul className="mt-6 grid list-none gap-6 p-0 md:grid-cols-3">
            {rooms.map((room) => (
              <li key={room.name}>
                <Plate
                  window={room.plate.window}
                  ground={room.plate.ground}
                  description={room.plate.description}
                />
                <h3 className="mt-4 text-h2">{room.name}</h3>
                <p className={cn(label, "mt-2 text-foreground")}>{room.facts}</p>
                <p className={cn(label, "mt-2 text-muted-foreground tabular-nums")}>
                  {room.price}
                </p>
                <p className="mt-4">
                  <OnwardLink href={room.href}>See {room.name}</OnwardLink>
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <a
              href="/rooms"
              className={cn(buttonVariants({ variant: "secondary" }), buttonClasses)}
            >
              See all six rooms
            </a>
          </p>
        </section>

        <section aria-labelledby="house-heading" className={section}>
          <div className="grid gap-6 md:grid-cols-12 md:items-start">
            <figure className="md:col-span-7">
              <Plate
                window="left"
                ground="h-1/2"
                description="Kittiwake House seen from the quay, the third house of Harbour Terrace, with its white veranda"
              />
              <figcaption className={cn(label, "mt-2 text-muted-foreground")}>
                Harbour Terrace from the quay
              </figcaption>
            </figure>
            <div className="md:col-span-4 md:col-start-9">
              <p className={cn(label, "text-muted-foreground")}>
                Since <time dateTime="1894">1894</time>
              </p>
              <h2 id="house-heading" className="mt-2 text-h2 md:text-h1">
                The house
              </h2>
              <p className="mt-4 max-w-xl text-body">
                The harbour pilot built this house in 1894, with a glazed veranda
                across the front so that he could watch for ships and stay dry. We
                have kept it since 2016 and changed as little as we could.
              </p>
              <p className="mt-4 max-w-xl text-body">
                There are six rooms, a breakfast room that opens onto the veranda, and
                a walled garden at the back. The quay is at the foot of the terrace
                steps.
              </p>
            </div>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-12">
            <figure className="md:col-span-9">
              <blockquote>
                <p className="font-heading text-h2 italic md:text-h1">
                  “We meant to walk the cliff path every day. Mostly we sat on the
                  veranda and watched the boats come in.”
                </p>
              </blockquote>
              <figcaption className={cn(label, "mt-4 text-muted-foreground")}>
                Ines and Paul · Stayed in Marram, April 2027
              </figcaption>
            </figure>
          </div>
        </section>

        <section
          aria-labelledby="breakfast-heading"
          className={cn(section, "grid gap-6 md:grid-cols-12 md:items-start")}
        >
          <div className="md:col-span-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className={cn(label, "text-muted-foreground")}>Every morning</p>
              <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal uppercase text-tertiary-foreground">
                Breakfast included
              </Badge>
            </div>
            <h2 id="breakfast-heading" className="mt-2 text-h2 md:text-h1">
              Breakfast on the veranda
            </h2>
            <p className="mt-4 max-w-xl text-body">
              We cook breakfast to order, with eggs from the farm on the hill and
              kippers from the smokehouse on the quay. It is served for as long as the
              hours here say, so there is no need to come down early.
            </p>
            <p className="mt-6">
              <OnwardLink href="/menu">See the menu</OnwardLink>
            </p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Rows
              rows={[
                { name: "Breakfast, every day", figure: <Hours from="08:00" to="10:00" /> },
                { name: "Breakfast on Sundays", figure: <Hours from="08:00" to="10:30" /> },
                {
                  name: "Tea and cake on the veranda",
                  figure: <Hours from="15:00" to="17:00" />,
                },
                {
                  name: "Supper, Thursday to Saturday",
                  figure: <Hours from="18:30" to="20:30" />,
                },
              ]}
            />
            <p className="mt-4 max-w-xl text-body">
              Supper is a short menu of three courses. Tell us by{" "}
              <time dateTime="14:00">14:00</time> if you would like a table.
            </p>
          </div>
        </section>

        <section
          id="find-us"
          aria-labelledby="find-us-heading"
          className={cn(section, "grid scroll-mt-6 gap-6 md:grid-cols-12 md:items-start")}
        >
          <div className="md:col-span-4">
            <p className={cn(label, "text-muted-foreground")}>Port Lowan</p>
            <h2 id="find-us-heading" className="mt-2 text-h2 md:text-h1">
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
            <div className="mt-4">
              <Rows
                rows={[
                  { name: "Port Lowan station", figure: "12 min on foot" },
                  { name: "Harbour bus stop, routes 7 and 18", figure: "2 min on foot" },
                  { name: "Quay car park, free for guests", figure: "4 min on foot" },
                ]}
              />
            </div>
            <h3 className={cn(label, "mt-12 text-foreground")}>Arriving and leaving</h3>
            <div className="mt-4">
              <Rows
                rows={[
                  { name: "Arrive", figure: <Hours from="15:00" to="20:00" /> },
                  { name: "Leave by", figure: <time dateTime="10:30">10:30</time> },
                  {
                    name: (
                      <>
                        Later than <time dateTime="20:00">20:00</time>
                      </>
                    ),
                    figure: "By arrangement",
                  },
                ]}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-border py-12 md:mt-26">
        <div className="grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <p className="font-heading text-h2">Kittiwake House</p>
            <p className="mt-2 text-body">
              Six rooms above the harbour at Port Lowan, with breakfast on the veranda.
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <address className="text-body not-italic">
              <span className="block">9 Harbour Terrace</span>
              <span className="block">Port Lowan LW6 3QT</span>
            </address>
            <p className="mt-4 text-body">
              <a href="tel:+441632960352" className={headerLink}>
                01632 960 352
              </a>
            </p>
            <p className="mt-2 text-body">
              <a href="mailto:stay@kittiwakehouse.example" className={headerLink}>
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
