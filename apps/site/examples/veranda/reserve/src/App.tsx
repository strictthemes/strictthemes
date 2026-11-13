import * as React from "react"
import { CircleAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

/* ------------------------------------------------------------------ */
/* The house                                                           */
/* ------------------------------------------------------------------ */

type Season = "winter" | "shoulder" | "summer"

type Room = {
  value: string
  name: string
  sleeps: number
  prices: Record<Season, number>
}

const ROOMS: Room[] = [
  { value: "thrift", name: "Thrift", sleeps: 2, prices: { winter: 104, shoulder: 124, summer: 146 } },
  { value: "campion", name: "Campion", sleeps: 1, prices: { winter: 78, shoulder: 92, summer: 108 } },
  { value: "samphire", name: "Samphire", sleeps: 2, prices: { winter: 112, shoulder: 132, summer: 156 } },
  { value: "marram", name: "Marram", sleeps: 2, prices: { winter: 128, shoulder: 152, summer: 178 } },
  { value: "sea-holly", name: "Sea Holly", sleeps: 3, prices: { winter: 142, shoulder: 168, summer: 196 } },
  { value: "tamarisk", name: "Tamarisk", sleeps: 4, prices: { winter: 164, shoulder: 192, summer: 224 } },
]

const ROOM_ITEMS = ROOMS.map((room) => ({
  value: room.value,
  label: `${room.name} · sleeps ${room.sleeps}`,
}))

const GUEST_ITEMS = [1, 2, 3, 4].map((n) => ({
  value: String(n),
  label: count(n, "guest", "guests"),
}))

const TIME_ITEMS = [
  { value: "15-16", label: "15:00 to 16:00" },
  { value: "16-17", label: "16:00 to 17:00" },
  { value: "17-18", label: "17:00 to 18:00" },
  { value: "18-19", label: "18:00 to 19:00" },
  { value: "19-20", label: "19:00 to 20:00" },
  { value: "later", label: "Later than 20:00" },
]

const MAX_NIGHTS = 14
const DAY = 86_400_000

/* ------------------------------------------------------------------ */
/* Dates, counted as calendar dates                                    */
/* ------------------------------------------------------------------ */

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function parts(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const y = Number(match[1])
  const m = Number(match[2])
  const d = Number(match[3])
  const check = new Date(Date.UTC(y, m - 1, d))
  if (
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== m - 1 ||
    check.getUTCDate() !== d
  ) {
    return null
  }
  return { y, m, d }
}

function utc(value: string): number {
  const p = parts(value)
  return p ? Date.UTC(p.y, p.m - 1, p.d) : NaN
}

function fromUtc(ms: number): string {
  const date = new Date(ms)
  const y = String(date.getUTCFullYear()).padStart(4, "0")
  const m = String(date.getUTCMonth() + 1).padStart(2, "0")
  const d = String(date.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function todayValue(): string {
  const now = new Date()
  return fromUtc(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
}

function addDays(value: string, days: number): string {
  return fromUtc(utc(value) + days * DAY)
}

function longDate(value: string): string {
  const date = new Date(utc(value))
  return `${WEEKDAYS[date.getUTCDay()]} ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

function nightsBetween(arrive: string, leave: string): number {
  if (!parts(arrive) || !parts(leave)) return 0
  return Math.round((utc(leave) - utc(arrive)) / DAY)
}

function seasonOf(value: string): Season {
  const month = new Date(utc(value)).getUTCMonth() + 1
  if (month === 7 || month === 8) return "summer"
  if (month >= 4 && month <= 10) return "shoulder"
  return "winter"
}

function isHighSummer(value: string): boolean {
  return seasonOf(value) === "summer"
}

/* ------------------------------------------------------------------ */
/* Words and figures                                                   */
/* ------------------------------------------------------------------ */

function count(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`
}

function pounds(n: number): string {
  return `£${n.toLocaleString("en-GB")}`
}

type PriceLine = { nights: number; price: number }

/** One line per run of nights at the same price, in the order they come. */
function priceLines(room: Room, arrive: string, nights: number): PriceLine[] {
  const lines: PriceLine[] = []
  for (let i = 0; i < nights; i++) {
    const price = room.prices[seasonOf(addDays(arrive, i))]
    const last = lines[lines.length - 1]
    if (last && last.price === price) last.nights += 1
    else lines.push({ nights: 1, price })
  }
  return lines
}

/* ------------------------------------------------------------------ */
/* The form                                                            */
/* ------------------------------------------------------------------ */

type Values = {
  arrive: string
  leave: string
  room: string | null
  guests: string
  name: string
  email: string
  phone: string
  time: string | null
  note: string
}

type FieldName = Exclude<keyof Values, "note">
type Errors = Partial<Record<FieldName, string>>

const ORDER: FieldName[] = ["arrive", "leave", "room", "guests", "name", "email", "phone", "time"]

const EMPTY: Values = {
  arrive: "",
  leave: "",
  room: null,
  guests: "2",
  name: "",
  email: "",
  phone: "",
  time: null,
  note: "",
}

function fromAddress(): Values {
  const values = { ...EMPTY }
  if (typeof window === "undefined") return values
  const query = new URLSearchParams(window.location.search)
  const arrive = query.get("arrive")
  const leave = query.get("leave")
  const guests = query.get("guests")
  const room = query.get("room")
  if (arrive && parts(arrive)) values.arrive = arrive
  if (leave && parts(leave)) values.leave = leave
  if (guests && /^[1-4]$/.test(guests)) values.guests = guests
  if (room && ROOMS.some((r) => r.value === room)) values.room = room
  return values
}

function check(values: Values, today: string): Errors {
  const errors: Errors = {}
  const room = ROOMS.find((r) => r.value === values.room)

  if (!values.arrive) errors.arrive = "Choose the day you arrive."
  else if (utc(values.arrive) < utc(today)) errors.arrive = "Choose today or a later day."

  if (!values.leave) {
    errors.leave = "Choose the day you leave."
  } else if (values.arrive) {
    const nights = nightsBetween(values.arrive, values.leave)
    if (nights < 1) errors.leave = "Choose a day after the day you arrive."
    else if (nights > MAX_NIGHTS)
      errors.leave = "We take requests for up to 14 nights. For a longer stay, write to us."
    else if (nights === 1 && isHighSummer(values.arrive))
      errors.leave = "In July and August we take stays of two nights or more. Choose a later day."
  }

  if (!room) errors.room = "Choose a room."
  else if (Number(values.guests) > room.sleeps)
    errors.guests = `${room.name} sleeps ${room.sleeps}. Choose fewer guests or another room.`

  if (!values.name.trim()) errors.name = "Write your name."

  const email = values.email.trim()
  if (!email) errors.email = "Write your email address."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Check the email address: it needs an @ and a domain."

  const phone = values.phone.trim()
  if (phone) {
    const digits = phone.replace(/\D/g, "").length
    if (!/^\+?[\d ]+$/.test(phone) || digits < 7)
      errors.phone = "Write the number in digits, such as 01632 960 352, or leave it empty."
  }

  if (!values.time) errors.time = "Choose when you expect to arrive."

  return errors
}

type Confirmed = {
  room: string
  guests: number
  arrive: string
  leave: string
  nights: number
  total: number
  email: string
}

/* ------------------------------------------------------------------ */
/* Shared classes                                                      */
/* ------------------------------------------------------------------ */

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const navLink = cn(
  label,
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)
const footerLink = cn(
  "text-body text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focus
)
const fieldLabel = cn("block", label, "text-foreground")
const helper = "mt-2 font-mono text-label text-muted-foreground"
const buttonClass = "h-auto rounded-md px-6 py-2 font-mono text-label font-normal uppercase"
const inputClass = "mt-2 h-11 rounded-md px-4 text-body md:text-body"
const sectionClass = "mt-12 border-t border-border pt-6 md:mt-26"

function describedBy(...ids: (string | false | undefined)[]): string | undefined {
  const list = ids.filter(Boolean)
  return list.length ? list.join(" ") : undefined
}

function ErrorLine({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-2 flex items-start gap-2 font-mono text-label text-destructive">
      <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      <span>{message}</span>
    </p>
  )
}

function LongDate({ value }: { value: string }) {
  return <time dateTime={value}>{longDate(value)}</time>
}

/* ------------------------------------------------------------------ */
/* The page                                                            */
/* ------------------------------------------------------------------ */

const NAV = [
  { label: "Rooms", href: "/rooms" },
  { label: "Menu", href: "/menu" },
  { label: "Find us", href: "/#find-us" },
  { label: "Reserve", href: "/reserve", current: true },
]

export function App() {
  const [today] = React.useState(todayValue)
  const [values, setValues] = React.useState<Values>(fromAddress)
  const [errors, setErrors] = React.useState<Errors>({})
  const [confirmed, setConfirmed] = React.useState<Confirmed | null>(null)
  const [focusTarget, setFocusTarget] = React.useState<{ id: string } | null>(null)

  React.useEffect(() => {
    if (!focusTarget) return
    const frame = requestAnimationFrame(() => {
      document.getElementById(focusTarget.id)?.focus()
    })
    return () => cancelAnimationFrame(frame)
  }, [focusTarget])

  const room = ROOMS.find((r) => r.value === values.room) ?? null
  const nights = nightsBetween(values.arrive, values.leave)
  const lines = room && nights >= 1 ? priceLines(room, values.arrive, nights) : []
  const total = lines.reduce((sum, line) => sum + line.nights * line.price, 0)
  const guests = Number(values.guests)

  function set<K extends keyof Values>(key: K, value: Values[K], alsoClear: FieldName[] = []) {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => {
      const next = { ...e }
      for (const k of [key, ...alsoClear]) delete next[k as FieldName]
      return next
    })
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = check(values, today)
    setErrors(found)
    const first = ORDER.find((k) => found[k])
    if (first) {
      setFocusTarget({ id: first })
      return
    }
    setConfirmed({
      room: room!.name,
      guests,
      arrive: values.arrive,
      leave: values.leave,
      nights,
      total,
      email: values.email.trim(),
    })
    setFocusTarget({ id: "confirmation-heading" })
  }

  function startAgain() {
    setValues({ ...EMPTY })
    setErrors({})
    setConfirmed(null)
    setFocusTarget({ id: "arrive" })
  }

  const leaveMin = values.arrive && parts(values.arrive) ? addDays(values.arrive, 1) : addDays(today, 1)

  return (
    <div className="mx-auto max-w-[1160px] px-4 text-body md:px-6">
      {/* Header */}
      <header className="flex flex-col items-start gap-4 border-b border-border py-6 md:flex-row md:items-baseline md:justify-between">
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
            focus
          )}
        >
          Kittiwake House
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={cn(navLink, item.current && "underline")}
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
        <section
          aria-labelledby="page-heading"
          className="grid gap-6 pt-12 md:grid-cols-12 md:items-start"
        >
          <div className="md:col-span-7">
            <p className={cn(label, "text-muted-foreground")}>Six rooms · We reply within a day</p>
            <h1 id="page-heading" className="mt-2 text-h1 text-foreground lg:text-display">
              Request a reservation
            </h1>
            <p className="mt-4 max-w-xl text-body text-foreground">
              Tell us the days and the room you would like. Nothing is charged now: we write back
              to confirm, and you pay at the house when you leave.
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
          className={cn(sectionClass, "grid gap-6 md:grid-cols-12 md:items-start")}
        >
          <div className="rounded-xl border border-border bg-card p-6 md:col-span-7">
            {confirmed ? null : (
              <form noValidate aria-labelledby="request-heading" onSubmit={onSubmit}>
                <h2 id="request-heading" className="text-h2 text-foreground">
                  Your request
                </h2>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <label id="arrive-label" htmlFor="arrive" className={fieldLabel}>
                      Arrival date
                    </label>
                    <DatePicker
                      id="arrive"
                      labelId="arrive-label"
                      name="arrive"
                      value={values.arrive}
                      onValueChange={(v) => set("arrive", v, ["leave"])}
                      min={today}
                      className="mt-2"
                      aria-invalid={!!errors.arrive}
                      aria-describedby={describedBy(errors.arrive && "arrive-error")}
                    />
                    <ErrorLine id="arrive-error" message={errors.arrive} />
                  </div>
                  <div>
                    <label id="leave-label" htmlFor="leave" className={fieldLabel}>
                      Departure date
                    </label>
                    <DatePicker
                      id="leave"
                      labelId="leave-label"
                      name="leave"
                      value={values.leave}
                      onValueChange={(v) => set("leave", v)}
                      min={leaveMin}
                      className="mt-2"
                      aria-invalid={!!errors.leave}
                      aria-describedby={describedBy(errors.leave && "leave-error")}
                    />
                    <ErrorLine id="leave-error" message={errors.leave} />
                  </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="room" className={fieldLabel}>
                      Room
                    </label>
                    <Select
                      name="room"
                      items={ROOM_ITEMS}
                      value={values.room}
                      onValueChange={(v) => {
                        if (v !== null) set("room", v, ["guests"])
                      }}
                    >
                      <SelectTrigger
                        id="room"
                        className="mt-2"
                        aria-invalid={!!errors.room || undefined}
                        aria-describedby={describedBy(errors.room && "room-error")}
                      >
                        <SelectValue placeholder="Choose a room" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROOM_ITEMS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorLine id="room-error" message={errors.room} />
                  </div>
                  <div>
                    <label htmlFor="guests" className={fieldLabel}>
                      Guests
                    </label>
                    <Select
                      name="guests"
                      items={GUEST_ITEMS}
                      value={values.guests}
                      onValueChange={(v) => {
                        if (v !== null) set("guests", v)
                      }}
                    >
                      <SelectTrigger
                        id="guests"
                        className="mt-2"
                        aria-invalid={!!errors.guests || undefined}
                        aria-describedby={describedBy(errors.guests && "guests-error")}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GUEST_ITEMS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorLine id="guests-error" message={errors.guests} />
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
                    onChange={(e) => set("name", e.target.value)}
                    className={inputClass}
                    aria-invalid={!!errors.name || undefined}
                    aria-describedby={describedBy(errors.name && "name-error")}
                  />
                  <ErrorLine id="name-error" message={errors.name} />
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
                      onChange={(e) => set("email", e.target.value)}
                      className={inputClass}
                      aria-invalid={!!errors.email || undefined}
                      aria-describedby={describedBy(errors.email && "email-error")}
                    />
                    <ErrorLine id="email-error" message={errors.email} />
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
                      onChange={(e) => set("phone", e.target.value)}
                      className={inputClass}
                      aria-invalid={!!errors.phone || undefined}
                      aria-describedby={describedBy(errors.phone && "phone-error")}
                    />
                    <ErrorLine id="phone-error" message={errors.phone} />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="time" className={fieldLabel}>
                    Time of arrival
                  </label>
                  <Select
                    name="time"
                    items={TIME_ITEMS}
                    value={values.time}
                    onValueChange={(v) => {
                      if (v !== null) set("time", v)
                    }}
                  >
                    <SelectTrigger
                      id="time"
                      className="mt-2"
                      aria-invalid={!!errors.time || undefined}
                      aria-describedby={describedBy("time-help", errors.time && "time-error")}
                    >
                      <SelectValue placeholder="Choose a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_ITEMS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p id="time-help" className={helper}>
                    The door is open from <time dateTime="15:00">15:00</time> to{" "}
                    <time dateTime="20:00">20:00</time>. For a later arrival we leave a key in the
                    porch.
                  </p>
                  <ErrorLine id="time-error" message={errors.time} />
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
                    onChange={(e) => set("note", e.target.value)}
                    className="mt-2 min-h-24 resize-none rounded-md px-4 py-2 text-body md:text-body"
                    aria-describedby="note-help"
                  />
                  <p id="note-help" className={helper}>
                    An allergy, a cot, a late train: anything we should know.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <Button type="submit" className={buttonClass}>
                    Send request
                  </Button>
                  <p className="font-mono text-label text-muted-foreground">Nothing is paid now.</p>
                </div>
              </form>
            )}

            <div role="status">
              {confirmed ? (
                <div>
                  <h2
                    id="confirmation-heading"
                    tabIndex={-1}
                    className="text-h2 text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:outline-solid"
                  >
                    Thank you. We have your request
                  </h2>
                  <p className="mt-4 max-w-xl text-body text-foreground">
                    {confirmed.room} for {count(confirmed.guests, "guest", "guests")}, from{" "}
                    <LongDate value={confirmed.arrive} /> to <LongDate value={confirmed.leave} />:{" "}
                    {count(confirmed.nights, "night", "nights")}, {pounds(confirmed.total)} in all.
                  </p>
                  <p className="mt-4 max-w-xl text-body text-foreground">
                    We will write to {confirmed.email} within a day to say whether the room is
                    free. Nothing has been paid.
                  </p>
                  <p className={cn("mt-4", label, "text-muted-foreground")}>
                    Reference · KH-2705-014
                  </p>
                </div>
              ) : null}
            </div>

            {confirmed ? (
              <div className="mt-6">
                <Button variant="secondary" className={buttonClass} onClick={startAgain}>
                  Make another request
                </Button>
              </div>
            ) : null}
          </div>

          {/* Summary */}
          <aside
            aria-labelledby="summary-heading"
            className="rounded-xl border border-border bg-card p-6 md:sticky md:top-6 md:col-span-4 md:col-start-9"
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className={cn(label, "text-muted-foreground")}>Your stay</p>
              <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
                Breakfast included
              </Badge>
            </div>
            <h2 id="summary-heading" className="mt-2 text-h2 text-foreground">
              Summary
            </h2>

            <dl className="mt-6 divide-y divide-border border-y border-border">
              <Fact term="Arrive">
                {parts(values.arrive) ? <LongDate value={values.arrive} /> : null}
              </Fact>
              <Fact term="Leave">
                {parts(values.leave) ? <LongDate value={values.leave} /> : null}
              </Fact>
              <Fact term="Nights">{nights >= 1 ? count(nights, "night", "nights") : null}</Fact>
              <Fact term="Room">{room ? room.name : null}</Fact>
              <Fact term="Guests">{count(guests, "guest", "guests")}</Fact>
            </dl>

            <dl className="mt-6 divide-y divide-border border-y border-border">
              {lines.map((line, i) => (
                <div key={i} className="flex items-baseline justify-between gap-4 py-2">
                  <dt className={cn(label, "text-muted-foreground tabular-nums")}>
                    {count(line.nights, "night", "nights")} at {pounds(line.price)}
                  </dt>
                  <dd className={cn(label, "text-right text-foreground tabular-nums")}>
                    {pounds(line.nights * line.price)}
                  </dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 py-2">
                <dt className={cn(label, "text-muted-foreground")}>Total</dt>
                {lines.length ? (
                  <dd className="text-right font-heading text-h2 text-foreground tabular-nums">
                    {pounds(total)}
                  </dd>
                ) : (
                  <dd className="text-right text-body text-muted-foreground">Not worked out yet</dd>
                )}
              </div>
            </dl>

            <p className="mt-4 font-mono text-label text-muted-foreground">
              Breakfast is included. You pay at the house when you leave.
            </p>
          </aside>
        </section>

        {/* Before you arrive */}
        <section
          aria-labelledby="before-heading"
          className={cn(sectionClass, "grid gap-6 md:grid-cols-12 md:items-start")}
        >
          <div className="md:col-span-4">
            <p className={cn(label, "text-muted-foreground")}>Good to know</p>
            <h2 id="before-heading" className="mt-2 text-h2 text-foreground md:text-h1">
              Before you arrive
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <ul className="list-none p-0">
              <Row name="Arrive">
                <time dateTime="15:00">15:00</time>–<time dateTime="20:00">20:00</time>
              </Row>
              <Row name="Leave by">
                <time dateTime="10:30">10:30</time>
              </Row>
              <Row name="Change or cancel, free of charge">Up to 7 days before</Row>
              <Row name="Stays in July and August">Two nights or more</Row>
            </ul>
            <p className="mt-4 max-w-xl text-body text-foreground">
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

      {/* Footer */}
      <footer className="mt-12 border-t border-border py-12 md:mt-26">
        <div className="grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <p className="font-heading text-h2 text-foreground">Kittiwake House</p>
            <p className="mt-2 max-w-xl text-body text-foreground">
              Six rooms above the harbour at Port Lowan, with breakfast on the veranda.
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <address className="text-body text-foreground not-italic">
              <span className="block">9 Harbour Terrace</span>
              <span className="block">Port Lowan LW6 3QT</span>
            </address>
            <p className="mt-4">
              <a href="tel:+441632960352" className={footerLink}>
                01632 960 352
              </a>
            </p>
            <p className="mt-2">
              <a href="mailto:stay@kittiwakehouse.example" className={footerLink}>
                stay@kittiwakehouse.example
              </a>
            </p>
          </div>
        </div>
        <p className={cn("mt-6", label, "text-muted-foreground")}>
          © 2027 Kittiwake House · Open all year
        </p>
      </footer>
    </div>
  )
}

function Fact({ term, children }: { term: string; children: React.ReactNode }) {
  const missing = children === null || children === undefined
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className={cn(label, "text-muted-foreground")}>{term}</dt>
      <dd className={cn("text-right text-body", missing ? "text-muted-foreground" : "text-foreground")}>
        {missing ? "Not chosen yet" : children}
      </dd>
    </div>
  )
}

function Row({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <li className="flex items-baseline gap-2 py-2">
      <span className="min-w-0 text-body text-foreground">{name}</span>
      <span aria-hidden="true" className="min-w-4 flex-1 border-b border-border" />
      <span className={cn(label, "shrink-0 whitespace-nowrap text-foreground tabular-nums")}>
        {children}
      </span>
    </li>
  )
}

export default App
