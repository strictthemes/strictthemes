import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

/* ---------- The house ---------- */

type Season = "winter" | "spring" | "summer"

type Room = {
  value: string
  name: string
  sleeps: number
  prices: Record<Season, number>
}

const ROOMS: Room[] = [
  { value: "thrift", name: "Thrift", sleeps: 2, prices: { winter: 104, spring: 124, summer: 146 } },
  { value: "campion", name: "Campion", sleeps: 1, prices: { winter: 78, spring: 92, summer: 108 } },
  { value: "samphire", name: "Samphire", sleeps: 2, prices: { winter: 112, spring: 132, summer: 156 } },
  { value: "marram", name: "Marram", sleeps: 2, prices: { winter: 128, spring: 152, summer: 178 } },
  { value: "sea-holly", name: "Sea Holly", sleeps: 3, prices: { winter: 142, spring: 168, summer: 196 } },
  { value: "tamarisk", name: "Tamarisk", sleeps: 4, prices: { winter: 164, spring: 192, summer: 224 } },
]

const ARRIVAL_TIMES = [
  "15:00 to 16:00",
  "16:00 to 17:00",
  "17:00 to 18:00",
  "18:00 to 19:00",
  "19:00 to 20:00",
  "Later than 20:00",
]

const MAX_NIGHTS = 14
const REFERENCE = "KH-2705-014"

/* ---------- Calendar dates, counted in UTC days ---------- */

const DAY_MS = 86_400_000
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

/** Days since 1 January 1970 for a `YYYY-MM-DD` value, or null if it is not a real day. */
function toDay(value: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const ms = Date.UTC(y, m - 1, d)
  const date = new Date(ms)
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) {
    return null
  }
  return ms / DAY_MS
}

function toValue(day: number): string {
  const date = new Date(day * DAY_MS)
  const y = String(date.getUTCFullYear()).padStart(4, "0")
  const m = String(date.getUTCMonth() + 1).padStart(2, "0")
  const d = String(date.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function todayDay(): number {
  const now = new Date()
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY_MS
}

function monthOf(day: number): number {
  return new Date(day * DAY_MS).getUTCMonth() + 1
}

function formatDate(day: number): string {
  const date = new Date(day * DAY_MS)
  return `${WEEKDAYS[date.getUTCDay()]} ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

function DateText({ day }: { day: number }) {
  return <time dateTime={toValue(day)}>{formatDate(day)}</time>
}

function seasonOf(day: number): Season {
  const month = monthOf(day)
  if (month === 7 || month === 8) return "summer"
  if (month >= 4 && month <= 10) return "spring"
  return "winter"
}

/* ---------- Words and money ---------- */

function count(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

function pounds(n: number) {
  return `£${n.toLocaleString("en-GB")}`
}

/* ---------- Form state ---------- */

type Values = {
  arrive: string
  leave: string
  room: string
  guests: string
  name: string
  email: string
  phone: string
  time: string
  note: string
}

type FieldName = Exclude<keyof Values, "note">
type Errors = Partial<Record<FieldName, string>>

const FIELD_ORDER: FieldName[] = ["arrive", "leave", "room", "guests", "name", "email", "phone", "time"]

const EMPTY: Values = {
  arrive: "",
  leave: "",
  room: "",
  guests: "2",
  name: "",
  email: "",
  phone: "",
  time: "",
  note: "",
}

function valuesFromAddress(): Values {
  const values = { ...EMPTY }
  if (typeof window === "undefined") return values
  const params = new URLSearchParams(window.location.search)
  const arrive = params.get("arrive")
  const leave = params.get("leave")
  const guests = params.get("guests")
  const room = params.get("room")
  if (arrive && toDay(arrive) !== null) values.arrive = arrive
  if (leave && toDay(leave) !== null) values.leave = leave
  if (guests && /^[1-4]$/.test(guests)) values.guests = guests
  if (room && ROOMS.some((r) => r.value === room)) values.room = room
  return values
}

type PriceRow = { season: Season; nights: number; price: number }

type Stay = {
  arrive: number | null
  leave: number | null
  nights: number | null
  room: Room | undefined
  guests: number
  rows: PriceRow[]
  total: number | null
}

function workOut(values: Values): Stay {
  const arrive = toDay(values.arrive)
  const leave = toDay(values.leave)
  const room = ROOMS.find((r) => r.value === values.room)
  const nights = arrive !== null && leave !== null && leave - arrive >= 1 ? leave - arrive : null
  const rows: PriceRow[] = []
  if (room && arrive !== null && nights !== null) {
    for (let day = arrive; day < arrive + nights; day++) {
      const season = seasonOf(day)
      const last = rows[rows.length - 1]
      if (last && last.season === season) last.nights += 1
      else rows.push({ season, nights: 1, price: room.prices[season] })
    }
  }
  const total = rows.length ? rows.reduce((sum, r) => sum + r.nights * r.price, 0) : null
  return { arrive, leave, nights, room, guests: Number(values.guests), rows, total }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function check(values: Values): Errors {
  const errors: Errors = {}
  const today = todayDay()
  const arrive = toDay(values.arrive)
  const leave = toDay(values.leave)

  if (!values.arrive || arrive === null) errors.arrive = "Choose the day you arrive."
  else if (arrive < today) errors.arrive = "Choose today or a later day."

  if (!values.leave || leave === null) errors.leave = "Choose the day you leave."
  else if (arrive !== null) {
    const nights = leave - arrive
    const month = monthOf(arrive)
    if (nights < 1) errors.leave = "Choose a day after the day you arrive."
    else if (nights > MAX_NIGHTS)
      errors.leave = "We take requests for up to 14 nights. For a longer stay, write to us."
    else if (nights === 1 && (month === 7 || month === 8))
      errors.leave = "In July and August we take stays of two nights or more. Choose a later day."
  }

  const room = ROOMS.find((r) => r.value === values.room)
  if (!room) errors.room = "Choose a room."
  else if (Number(values.guests) > room.sleeps)
    errors.guests = `${room.name} sleeps ${room.sleeps}. Choose fewer guests or another room.`

  if (!values.name.trim()) errors.name = "Write your name."

  const email = values.email.trim()
  if (!email) errors.email = "Write your email address."
  else if (!EMAIL.test(email)) errors.email = "Check the email address: it needs an @ and a domain."

  const phone = values.phone.trim()
  if (phone) {
    const digits = phone.replace(/\D/g, "").length
    if (!/^\+?[\d ]+$/.test(phone) || digits < 7)
      errors.phone = "Write the number in digits, such as 01632 960 352, or leave it empty."
  }

  if (!values.time) errors.time = "Choose when you expect to arrive."

  return errors
}

/* ---------- Shared classes ---------- */

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const helper = "font-mono text-label text-muted-foreground"
const chromeLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusRing
)
const buttonClass = "h-auto rounded-md px-6 py-2 font-mono text-label font-normal uppercase"
const inputClass = "mt-2 h-11 rounded-md px-4 text-body md:text-body"
const selectClass = cn(
  "mt-2 h-11 w-full rounded-md border border-muted-foreground bg-card px-4 text-body text-foreground aria-invalid:border-destructive focus-visible:border-ring",
  focusRing
)
const fieldLabel = "block font-mono text-label uppercase text-foreground"
const sectionRule = "mt-12 border-t border-border pt-6 md:mt-26"

/* ---------- Small parts ---------- */

function ErrorLine({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 font-mono text-label text-destructive">
      <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

function describedBy(...ids: (string | false | undefined)[]) {
  const list = ids.filter(Boolean).join(" ")
  return list || undefined
}

const NAV = [
  { label: "Rooms", href: "/rooms" },
  { label: "Menu", href: "/menu" },
  { label: "Find us", href: "/#find-us" },
  { label: "Reserve", href: "/reserve", current: true },
]

/* ---------- Page ---------- */

export function App() {
  const [values, setValues] = useState<Values>(valuesFromAddress)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState<{ stay: Stay; email: string } | null>(null)
  const [focusTarget, setFocusTarget] = useState<{ id: string } | null>(null)
  const confirmHeading = useRef<HTMLHeadingElement>(null)

  const stay = workOut(values)
  const today = todayDay()
  const arriveDay = toDay(values.arrive)
  const leaveMin = toValue(arriveDay !== null ? arriveDay + 1 : today + 1)

  // Move focus once the render that needs it is on the page.
  useEffect(() => {
    if (!focusTarget) return
    const frame = requestAnimationFrame(() => {
      if (focusTarget.id === "confirmation") confirmHeading.current?.focus()
      else document.getElementById(focusTarget.id)?.focus()
    })
    return () => cancelAnimationFrame(frame)
  }, [focusTarget])

  function update(field: keyof Values, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
    setErrors((e) => {
      const next = { ...e }
      if (field !== "note") delete next[field]
      if (field === "arrive") delete next.leave
      if (field === "room") delete next.guests
      return next
    })
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = check(values)
    setErrors(found)
    const first = FIELD_ORDER.find((f) => found[f])
    if (first) {
      setFocusTarget({ id: first })
      return
    }
    setSent({ stay: workOut(values), email: values.email.trim() })
    setFocusTarget({ id: "confirmation" })
  }

  function again() {
    setValues({ ...EMPTY })
    setErrors({})
    setSent(null)
    setFocusTarget({ id: "arrive" })
  }

  const invalid = (field: FieldName) => (errors[field] ? true : undefined)
  const errorId = (field: FieldName) => errors[field] && `${field}-error`

  return (
    <div className="mx-auto max-w-[1160px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-4 border-b border-border py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", chromeLink)}>
          Kittiwake House
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={cn(label, chromeLink, item.current && "underline")}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        {/* Opening */}
        <section aria-labelledby="page-title" className="grid gap-6 pt-12 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7">
            <p className={cn(label, "text-muted-foreground")}>Six rooms · We reply within a day</p>
            <h1 id="page-title" className="mt-2 text-h1 lg:text-display">
              Request a reservation
            </h1>
            <p className="mt-4 max-w-xl text-body">
              Tell us the days and the room you would like. Nothing is charged now: we write back to
              confirm, and you pay at the house when you leave.
            </p>
          </div>

          <div className="rounded-xl bg-clay p-6 text-clay-foreground md:col-span-4 md:col-start-9">
            <p className={label}>How it works</p>
            <h2 className="mt-2 text-h2">A request, not a payment</h2>
            <ol className="mt-6 list-none p-0">
              {[
                "You send the days and the room you would like.",
                "We check the room and write back within a day.",
                "You pay at the house when you leave, by card or in cash.",
              ].map((step, i) => (
                <li key={step} className={cn("flex items-baseline gap-4", i > 0 && "mt-4")}>
                  <span className={cn(label, "tabular-nums")}>{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-body">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Request and summary */}
        <section
          aria-label="Request and summary"
          className={cn(sectionRule, "grid gap-6 md:grid-cols-12 md:items-start")}
        >
          <div className="rounded-xl border border-border bg-card p-6 md:col-span-7">
            {!sent && (
              <form noValidate aria-labelledby="request-heading" onSubmit={onSubmit}>
                <h2 id="request-heading" className="text-h2">
                  Your request
                </h2>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="arrive" className={fieldLabel}>
                      Arrival date
                    </label>
                    <Input
                      id="arrive"
                      name="arrive"
                      type="date"
                      min={toValue(today)}
                      value={values.arrive}
                      onChange={(e) => update("arrive", e.target.value)}
                      aria-invalid={invalid("arrive")}
                      aria-describedby={describedBy(errorId("arrive"))}
                      className={inputClass}
                    />
                    {errors.arrive && <ErrorLine id="arrive-error">{errors.arrive}</ErrorLine>}
                  </div>
                  <div>
                    <label htmlFor="leave" className={fieldLabel}>
                      Departure date
                    </label>
                    <Input
                      id="leave"
                      name="leave"
                      type="date"
                      min={leaveMin}
                      value={values.leave}
                      onChange={(e) => update("leave", e.target.value)}
                      aria-invalid={invalid("leave")}
                      aria-describedby={describedBy(errorId("leave"))}
                      className={inputClass}
                    />
                    {errors.leave && <ErrorLine id="leave-error">{errors.leave}</ErrorLine>}
                  </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="room" className={fieldLabel}>
                      Room
                    </label>
                    <select
                      id="room"
                      name="room"
                      value={values.room}
                      onChange={(e) => update("room", e.target.value)}
                      aria-invalid={invalid("room")}
                      aria-describedby={describedBy(errorId("room"))}
                      className={selectClass}
                    >
                      <option value="">Choose a room</option>
                      {ROOMS.map((room) => (
                        <option key={room.value} value={room.value}>
                          {`${room.name} · sleeps ${room.sleeps}`}
                        </option>
                      ))}
                    </select>
                    {errors.room && <ErrorLine id="room-error">{errors.room}</ErrorLine>}
                  </div>
                  <div>
                    <label htmlFor="guests" className={fieldLabel}>
                      Guests
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      value={values.guests}
                      onChange={(e) => update("guests", e.target.value)}
                      aria-invalid={invalid("guests")}
                      aria-describedby={describedBy(errorId("guests"))}
                      className={selectClass}
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={String(n)}>
                          {count(n, "guest", "guests")}
                        </option>
                      ))}
                    </select>
                    {errors.guests && <ErrorLine id="guests-error">{errors.guests}</ErrorLine>}
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="name" className={fieldLabel}>
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={values.name}
                    onChange={(e) => update("name", e.target.value)}
                    aria-invalid={invalid("name")}
                    aria-describedby={describedBy(errorId("name"))}
                    className={inputClass}
                  />
                  {errors.name && <ErrorLine id="name-error">{errors.name}</ErrorLine>}
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="email" className={fieldLabel}>
                      Email address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(e) => update("email", e.target.value)}
                      aria-invalid={invalid("email")}
                      aria-describedby={describedBy(errorId("email"))}
                      className={inputClass}
                    />
                    {errors.email && <ErrorLine id="email-error">{errors.email}</ErrorLine>}
                  </div>
                  <div>
                    <label htmlFor="phone" className={fieldLabel}>
                      Phone (optional)
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      aria-invalid={invalid("phone")}
                      aria-describedby={describedBy(errorId("phone"))}
                      className={inputClass}
                    />
                    {errors.phone && <ErrorLine id="phone-error">{errors.phone}</ErrorLine>}
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="time" className={fieldLabel}>
                    Time of arrival
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={values.time}
                    onChange={(e) => update("time", e.target.value)}
                    aria-invalid={invalid("time")}
                    aria-describedby={describedBy("time-help", errorId("time"))}
                    className={selectClass}
                  >
                    <option value="">Choose a time</option>
                    {ARRIVAL_TIMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <p id="time-help" className={cn("mt-2", helper)}>
                    The door is open from <time dateTime="15:00">15:00</time> to{" "}
                    <time dateTime="20:00">20:00</time>. For a later arrival we leave a key in the porch.
                  </p>
                  {errors.time && <ErrorLine id="time-error">{errors.time}</ErrorLine>}
                </div>

                <div className="mt-6">
                  <label htmlFor="note" className={fieldLabel}>
                    Note (optional)
                  </label>
                  <Textarea
                    id="note"
                    name="note"
                    maxLength={400}
                    value={values.note}
                    onChange={(e) => update("note", e.target.value)}
                    aria-describedby="note-help"
                    className="mt-2 min-h-24 rounded-md px-4 py-2 text-body md:text-body"
                  />
                  <p id="note-help" className={cn("mt-2", helper)}>
                    An allergy, a cot, a late train: anything we should know.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <Button type="submit" className={buttonClass}>
                    Send request
                  </Button>
                  <p className={helper}>Nothing is paid now.</p>
                </div>
              </form>
            )}

            <div role="status">
              {sent && sent.stay.room && sent.stay.arrive !== null && sent.stay.leave !== null && (
                <div>
                  <h2
                    ref={confirmHeading}
                    tabIndex={-1}
                    className="text-h2 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
                  >
                    Thank you. We have your request
                  </h2>
                  <p className="mt-4 max-w-xl text-body">
                    {sent.stay.room.name} for {count(sent.stay.guests, "guest", "guests")}, from{" "}
                    <DateText day={sent.stay.arrive} /> to <DateText day={sent.stay.leave} />:{" "}
                    {count(sent.stay.nights ?? 0, "night", "nights")}, {pounds(sent.stay.total ?? 0)} in
                    all.
                  </p>
                  <p className="mt-4 max-w-xl text-body">
                    We will write to {sent.email} within a day to say whether the room is free. Nothing
                    has been paid.
                  </p>
                  <p className={cn("mt-4", label, "text-muted-foreground")}>Reference · {REFERENCE}</p>
                </div>
              )}
            </div>

            {sent && (
              <div className="mt-6">
                <Button variant="secondary" className={buttonClass} onClick={again}>
                  Make another request
                </Button>
              </div>
            )}
          </div>

          <aside
            aria-labelledby="summary-heading"
            className="rounded-xl border border-border bg-card p-6 md:sticky md:top-6 md:col-span-4 md:col-start-9"
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className={cn(label, "text-muted-foreground")}>Your stay</p>
              <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal uppercase text-tertiary-foreground">
                Breakfast included
              </Badge>
            </div>
            <h2 id="summary-heading" className="mt-2 text-h2">
              Summary
            </h2>

            <dl className="mt-6 divide-y divide-border border-y border-border">
              <FactRow term="Arrive" missing={stay.arrive === null}>
                {stay.arrive !== null && <DateText day={stay.arrive} />}
              </FactRow>
              <FactRow term="Leave" missing={stay.leave === null}>
                {stay.leave !== null && <DateText day={stay.leave} />}
              </FactRow>
              <FactRow term="Nights" missing={stay.nights === null}>
                {stay.nights !== null && count(stay.nights, "night", "nights")}
              </FactRow>
              <FactRow term="Room" missing={!stay.room}>
                {stay.room?.name}
              </FactRow>
              <FactRow term="Guests" missing={false}>
                {count(stay.guests, "guest", "guests")}
              </FactRow>
            </dl>

            <dl className="mt-6 divide-y divide-border border-y border-border">
              {stay.rows.map((row) => (
                <div key={row.season} className="flex items-baseline justify-between gap-4 py-2">
                  <dt className={cn(label, "text-muted-foreground tabular-nums")}>
                    {count(row.nights, "night", "nights")} at {pounds(row.price)}
                  </dt>
                  <dd className={cn(label, "text-right text-foreground tabular-nums")}>
                    {pounds(row.nights * row.price)}
                  </dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 py-2">
                <dt className={cn(label, "text-muted-foreground")}>Total</dt>
                {stay.total !== null ? (
                  <dd className="text-right font-heading text-h2 text-foreground tabular-nums">
                    {pounds(stay.total)}
                  </dd>
                ) : (
                  <dd className="text-right text-body text-muted-foreground">Not worked out yet</dd>
                )}
              </div>
            </dl>

            <p className={cn("mt-4", helper)}>Breakfast is included. You pay at the house when you leave.</p>
          </aside>
        </section>

        {/* Before you arrive */}
        <section
          aria-labelledby="before-heading"
          className={cn(sectionRule, "grid gap-6 md:grid-cols-12 md:items-start")}
        >
          <div className="md:col-span-4">
            <p className={cn(label, "text-muted-foreground")}>Good to know</p>
            <h2 id="before-heading" className="mt-2 text-h2 md:text-h1">
              Before you arrive
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <ul className="list-none p-0">
              <TimeRow name="Arrive">
                <time dateTime="15:00">15:00</time>–<time dateTime="20:00">20:00</time>
              </TimeRow>
              <TimeRow name="Leave by">
                <time dateTime="10:30">10:30</time>
              </TimeRow>
              <TimeRow name="Change or cancel, free of charge">Up to 7 days before</TimeRow>
              <TimeRow name="Stays in July and August">Two nights or more</TimeRow>
            </ul>
            <p className="mt-4 max-w-xl text-body">
              For anything else, write to{" "}
              <a href="mailto:stay@kittiwakehouse.example" className={textLink}>
                stay@kittiwakehouse.example
              </a>{" "}
              or call{" "}
              <a href="tel:+441632960352" className={textLink}>
                01632 960 352
              </a>
              .
            </p>
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
            <p className="mt-4">
              <a href="tel:+441632960352" className={cn("text-body", chromeLink)}>
                01632 960 352
              </a>
            </p>
            <p className="mt-2">
              <a href="mailto:stay@kittiwakehouse.example" className={cn("text-body", chromeLink)}>
                stay@kittiwakehouse.example
              </a>
            </p>
          </div>
        </div>
        <p className={cn("mt-6", label, "text-muted-foreground")}>© 2027 Kittiwake House · Open all year</p>
      </footer>
    </div>
  )
}

function FactRow({ term, missing, children }: { term: string; missing: boolean; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className={cn(label, "text-muted-foreground")}>{term}</dt>
      <dd className={cn("text-right text-body", missing ? "text-muted-foreground" : "text-foreground")}>
        {missing ? "Not chosen yet" : children}
      </dd>
    </div>
  )
}

function TimeRow({ name, children }: { name: string; children: ReactNode }) {
  return (
    <li className="flex items-baseline gap-2 py-2">
      <span className="min-w-0 text-body">{name}</span>
      <span aria-hidden="true" className="min-w-4 flex-1 border-b border-border" />
      <span className={cn(label, "shrink-0 text-foreground whitespace-nowrap tabular-nums")}>{children}</span>
    </li>
  )
}

export default App
