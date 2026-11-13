import * as React from "react"
import { CircleAlert } from "lucide-react"

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
import { cn } from "@/lib/utils"

/* ---------- The house ---------- */

type Room = {
  value: string
  name: string
  sleeps: number
  // winter, spring and autumn, summer
  prices: [number, number, number]
}

const ROOMS: Room[] = [
  { value: "thrift", name: "Thrift", sleeps: 2, prices: [104, 124, 146] },
  { value: "campion", name: "Campion", sleeps: 1, prices: [78, 92, 108] },
  { value: "samphire", name: "Samphire", sleeps: 2, prices: [112, 132, 156] },
  { value: "marram", name: "Marram", sleeps: 2, prices: [128, 152, 178] },
  { value: "sea-holly", name: "Sea Holly", sleeps: 3, prices: [142, 168, 196] },
  { value: "tamarisk", name: "Tamarisk", sleeps: 4, prices: [164, 192, 224] },
]

const ROOM_ITEMS = ROOMS.map((room) => ({
  value: room.value,
  label: `${room.name} · sleeps ${room.sleeps}`,
}))

const GUEST_ITEMS = [1, 2, 3, 4].map((n) => ({
  value: String(n),
  label: count(n, "guest"),
}))

const TIME_ITEMS = [
  { value: "15-16", label: "15:00 to 16:00" },
  { value: "16-17", label: "16:00 to 17:00" },
  { value: "17-18", label: "17:00 to 18:00" },
  { value: "18-19", label: "18:00 to 19:00" },
  { value: "19-20", label: "19:00 to 20:00" },
  { value: "later", label: "Later than 20:00" },
]

/* ---------- Words and figures ---------- */

function count(n: number, noun: string) {
  return `${n} ${noun}${n === 1 ? "" : "s"}`
}

function pounds(n: number) {
  return `£${n.toLocaleString("en-GB")}`
}

/* ---------- Calendar dates, counted in UTC ---------- */

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

function parts(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  return { year, month, day }
}

function utc(value: string) {
  const { year, month, day } = parts(value)
  return Date.UTC(year, month - 1, day)
}

function fromUtc(time: number) {
  const date = new Date(time)
  const year = String(date.getUTCFullYear()).padStart(4, "0")
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function addDays(value: string, days: number) {
  return fromUtc(utc(value) + days * DAY)
}

function nightsBetween(arrive: string, leave: string) {
  return Math.round((utc(leave) - utc(arrive)) / DAY)
}

function isDateValue(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const { year, month, day } = parts(value)
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

function todayValue() {
  const now = new Date()
  const year = String(now.getFullYear()).padStart(4, "0")
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function longDate(value: string) {
  const date = new Date(utc(value))
  return `${WEEKDAYS[date.getUTCDay()]} ${date.getUTCDate()} ${
    MONTHS[date.getUTCMonth()]
  } ${date.getUTCFullYear()}`
}

// 0 winter, 1 spring and autumn, 2 summer
function season(value: string) {
  const { month } = parts(value)
  if (month === 7 || month === 8) return 2
  if (month >= 4 && month <= 10) return 1
  return 0
}

type PriceLine = { season: number; nights: number; price: number; sum: number }

function priceLines(arrive: string, leave: string, room: Room | undefined) {
  if (!arrive || !leave || !room) return null
  const nights = nightsBetween(arrive, leave)
  if (nights < 1) return null
  const bySeason = new Map<number, PriceLine>()
  for (let i = 0; i < nights; i++) {
    const s = season(addDays(arrive, i))
    const price = room.prices[s]
    const line = bySeason.get(s) ?? { season: s, nights: 0, price, sum: 0 }
    line.nights += 1
    line.sum += price
    bySeason.set(s, line)
  }
  const lines = [...bySeason.values()]
  return { lines, total: lines.reduce((t, l) => t + l.sum, 0), nights }
}

function reference(arrive: string) {
  const { year, month, day } = parts(arrive)
  return `KH-${String(year % 100).padStart(2, "0")}${String(month).padStart(
    2,
    "0"
  )}-${String(day).padStart(3, "0")}`
}

/* ---------- Form state ---------- */

type Field =
  "arrive" | "leave" | "room" | "guests" | "name" | "email" | "phone" | "time"

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
  const query = new URLSearchParams(window.location.search)
  const arrive = query.get("arrive")
  const leave = query.get("leave")
  const guests = query.get("guests")
  const room = query.get("room")
  if (arrive && isDateValue(arrive)) values.arrive = arrive
  if (leave && isDateValue(leave)) values.leave = leave
  if (guests && /^[1-4]$/.test(guests)) values.guests = guests
  if (room && ROOMS.some((r) => r.value === room)) values.room = room
  return values
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function check(values: Values, today: string) {
  const errors: Partial<Record<Field, string>> = {}
  const { arrive, leave } = values

  if (!arrive) errors.arrive = "Choose the day you arrive."
  else if (arrive < today) errors.arrive = "Choose today or a later day."

  if (!leave) errors.leave = "Choose the day you leave."
  else if (arrive) {
    const nights = nightsBetween(arrive, leave)
    const { month } = parts(arrive)
    if (nights < 1) errors.leave = "Choose a day after the day you arrive."
    else if (nights > 14)
      errors.leave =
        "We take requests for up to 14 nights. For a longer stay, write to us."
    else if (nights === 1 && (month === 7 || month === 8))
      errors.leave =
        "In July and August we take stays of two nights or more. Choose a later day."
  }

  const room = ROOMS.find((r) => r.value === values.room)
  if (!room) errors.room = "Choose a room."
  else if (Number(values.guests) > room.sleeps)
    errors.guests = `${room.name} sleeps ${room.sleeps}. Choose fewer guests or another room.`

  if (!values.name.trim()) errors.name = "Write your name."

  const email = values.email.trim()
  if (!email) errors.email = "Write your email address."
  else if (!EMAIL.test(email))
    errors.email = "Check the email address: it needs an @ and a domain."

  const phone = values.phone.trim()
  if (
    phone &&
    (!/^\+?[\d ]+$/.test(phone) || (phone.match(/\d/g) ?? []).length < 7)
  )
    errors.phone =
      "Write the number in digits, such as 01632 960 352, or leave it empty."

  if (!values.time) errors.time = "Choose when you expect to arrive."

  return errors
}

const ORDER: Field[] = [
  "arrive",
  "leave",
  "room",
  "guests",
  "name",
  "email",
  "phone",
  "time",
]

type Confirmation = {
  room: string
  guests: number
  arrive: string
  leave: string
  nights: number
  total: number
  email: string
}

/* ---------- Shared classes ---------- */

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const LABEL = "font-mono text-label uppercase"
const FIELD_LABEL = `block ${LABEL} text-foreground`
const HELP = "mt-2 font-mono text-label text-muted-foreground"
const NAV_LINK = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${FOCUS}`
const TEXT_LINK = `text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground ${FOCUS}`
const INPUT = "mt-2 h-11 rounded-md px-4 text-body md:text-body"
const BUTTON =
  "h-auto rounded-md px-6 py-2 font-mono text-label font-normal uppercase"
const SECTION = "mt-12 border-t border-border pt-6 md:mt-26"
const GRID = "grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start"
const CARD = "rounded-xl border border-border bg-card p-6"

function ErrorLine({ id, message }: { id: string; message?: string }) {
  if (!message) return null
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
      <span>{message}</span>
    </p>
  )
}

function describedBy(...ids: (string | false | undefined)[]) {
  const list = ids.filter(Boolean).join(" ")
  return list || undefined
}

/* ---------- Page ---------- */

const NAV = [
  { label: "Rooms", href: "/rooms" },
  { label: "Menu", href: "/menu" },
  { label: "Find us", href: "/#find-us" },
  { label: "Reserve", href: "/reserve", current: true },
]

export function App() {
  const [values, setValues] = React.useState<Values>(fromAddress)
  const [errors, setErrors] = React.useState<Partial<Record<Field, string>>>({})
  const [confirmation, setConfirmation] = React.useState<Confirmation | null>(
    null
  )
  const [focusRequest, setFocusRequest] = React.useState<{
    field: Field | "confirmation"
    n: number
  } | null>(null)

  const arriveRef = React.useRef<HTMLButtonElement>(null)
  const leaveRef = React.useRef<HTMLButtonElement>(null)
  const roomRef = React.useRef<HTMLButtonElement>(null)
  const guestsRef = React.useRef<HTMLButtonElement>(null)
  const nameRef = React.useRef<HTMLInputElement>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)
  const phoneRef = React.useRef<HTMLInputElement>(null)
  const timeRef = React.useRef<HTMLButtonElement>(null)
  const confirmationRef = React.useRef<HTMLHeadingElement>(null)

  React.useEffect(() => {
    if (!focusRequest) return
    const frame = requestAnimationFrame(() => {
      if (focusRequest.field === "confirmation")
        confirmationRef.current?.focus()
      else {
        const fieldRefs = {
          arrive: arriveRef,
          leave: leaveRef,
          room: roomRef,
          guests: guestsRef,
          name: nameRef,
          email: emailRef,
          phone: phoneRef,
          time: timeRef,
        }
        fieldRefs[focusRequest.field].current?.focus()
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [focusRequest])

  const today = todayValue()
  const room = ROOMS.find((r) => r.value === values.room)
  const guests = Number(values.guests)
  const stay = priceLines(values.arrive, values.leave, room)
  const nights =
    values.arrive && values.leave
      ? nightsBetween(values.arrive, values.leave)
      : 0

  function requestFocus(field: Field | "confirmation") {
    setFocusRequest((current) => ({ field, n: (current?.n ?? 0) + 1 }))
  }

  function clear(...fields: Field[]) {
    setErrors((current) => {
      if (!fields.some((f) => current[f])) return current
      const next = { ...current }
      for (const f of fields) delete next[f]
      return next
    })
  }

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = check(values, today)
    setErrors(found)
    const first = ORDER.find((f) => found[f])
    if (first) {
      requestFocus(first)
      return
    }
    const priced = priceLines(values.arrive, values.leave, room)
    if (!room || !priced) return
    setConfirmation({
      room: room.name,
      guests,
      arrive: values.arrive,
      leave: values.leave,
      nights: priced.nights,
      total: priced.total,
      email: values.email.trim(),
    })
    requestFocus("confirmation")
  }

  function startAgain() {
    setConfirmation(null)
    setValues({ ...EMPTY })
    setErrors({})
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname
    )
    requestFocus("arrive")
  }

  return (
    <div className="mx-auto max-w-[1160px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-4 border-b border-border py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", NAV_LINK)}>
          Kittiwake House
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={cn(LABEL, NAV_LINK, item.current && "underline")}
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
        <section aria-labelledby="page-title" className={cn(GRID, "pt-12")}>
          <div className="md:col-span-7">
            <p className={cn(LABEL, "text-muted-foreground")}>
              Six rooms · We reply within a day
            </p>
            <h1 id="page-title" className="mt-2 text-h1 lg:text-display">
              Request a reservation
            </h1>
            <p className="mt-4 max-w-xl">
              Tell us the days and the room you would like. Nothing is charged
              now: we write back to confirm, and you pay at the house when you
              leave.
            </p>
          </div>

          <div className="rounded-xl bg-clay p-6 text-clay-foreground md:col-span-4 md:col-start-9">
            <p className={LABEL}>How it works</p>
            <h2 className="mt-2 text-h2">A request, not a payment</h2>
            <ol className="mt-6">
              {[
                "You send the days and the room you would like.",
                "We check the room and write back within a day.",
                "You pay at the house when you leave, by card or in cash.",
              ].map((step, i) => (
                <li
                  key={step}
                  className={cn("flex items-baseline gap-4", i > 0 && "mt-4")}
                >
                  <span className={cn(LABEL, "tabular-nums")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="min-w-0">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Request and summary */}
        <section aria-label="Request and summary" className={cn(SECTION, GRID)}>
          <div className={cn(CARD, "md:col-span-7")}>
            {confirmation ? null : (
              <form
                noValidate
                aria-labelledby="request-title"
                onSubmit={handleSubmit}
              >
                <h2 id="request-title" className="text-h2">
                  Your request
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      id="arrive-label"
                      htmlFor="arrive"
                      className={FIELD_LABEL}
                    >
                      Arrival date
                    </label>
                    <DatePicker
                      id="arrive"
                      labelId="arrive-label"
                      name="arrive"
                      ref={arriveRef}
                      value={values.arrive}
                      onValueChange={(value) => {
                        set("arrive", value)
                        clear("arrive", "leave")
                      }}
                      min={today}
                      aria-invalid={!!errors.arrive}
                      aria-describedby={describedBy(
                        errors.arrive && "arrive-error"
                      )}
                      className="mt-2"
                    />
                    <ErrorLine id="arrive-error" message={errors.arrive} />
                  </div>
                  <div>
                    <label
                      id="leave-label"
                      htmlFor="leave"
                      className={FIELD_LABEL}
                    >
                      Departure date
                    </label>
                    <DatePicker
                      id="leave"
                      labelId="leave-label"
                      name="leave"
                      ref={leaveRef}
                      value={values.leave}
                      onValueChange={(value) => {
                        set("leave", value)
                        clear("leave")
                      }}
                      min={addDays(values.arrive || today, 1)}
                      aria-invalid={!!errors.leave}
                      aria-describedby={describedBy(
                        errors.leave && "leave-error"
                      )}
                      className="mt-2"
                    />
                    <ErrorLine id="leave-error" message={errors.leave} />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      id="room-label"
                      htmlFor="room"
                      className={FIELD_LABEL}
                    >
                      Room
                    </label>
                    <Select
                      items={ROOM_ITEMS}
                      value={values.room}
                      onValueChange={(value) => {
                        if (value === null) return
                        set("room", value)
                        clear("room", "guests")
                      }}
                    >
                      <SelectTrigger
                        id="room"
                        ref={roomRef}
                        aria-labelledby="room-label"
                        aria-invalid={!!errors.room || undefined}
                        aria-describedby={describedBy(
                          errors.room && "room-error"
                        )}
                        className="mt-2"
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
                    <label
                      id="guests-label"
                      htmlFor="guests"
                      className={FIELD_LABEL}
                    >
                      Guests
                    </label>
                    <Select
                      items={GUEST_ITEMS}
                      value={values.guests}
                      onValueChange={(value) => {
                        if (value === null) return
                        set("guests", value)
                        clear("guests")
                      }}
                    >
                      <SelectTrigger
                        id="guests"
                        ref={guestsRef}
                        aria-labelledby="guests-label"
                        aria-invalid={!!errors.guests || undefined}
                        aria-describedby={describedBy(
                          errors.guests && "guests-error"
                        )}
                        className="mt-2"
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
                  <label htmlFor="name" className={FIELD_LABEL}>
                    Name
                  </label>
                  <Input
                    id="name"
                    ref={nameRef}
                    autoComplete="name"
                    value={values.name}
                    onChange={(event) => {
                      set("name", event.target.value)
                      clear("name")
                    }}
                    aria-invalid={!!errors.name || undefined}
                    aria-describedby={describedBy(errors.name && "name-error")}
                    className={INPUT}
                  />
                  <ErrorLine id="name-error" message={errors.name} />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="email" className={FIELD_LABEL}>
                      Email address
                    </label>
                    <Input
                      id="email"
                      ref={emailRef}
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(event) => {
                        set("email", event.target.value)
                        clear("email")
                      }}
                      aria-invalid={!!errors.email || undefined}
                      aria-describedby={describedBy(
                        errors.email && "email-error"
                      )}
                      className={INPUT}
                    />
                    <ErrorLine id="email-error" message={errors.email} />
                  </div>
                  <div>
                    <label htmlFor="phone" className={FIELD_LABEL}>
                      Phone (optional)
                    </label>
                    <Input
                      id="phone"
                      ref={phoneRef}
                      type="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={(event) => {
                        set("phone", event.target.value)
                        clear("phone")
                      }}
                      aria-invalid={!!errors.phone || undefined}
                      aria-describedby={describedBy(
                        errors.phone && "phone-error"
                      )}
                      className={INPUT}
                    />
                    <ErrorLine id="phone-error" message={errors.phone} />
                  </div>
                </div>

                <div className="mt-6">
                  <label id="time-label" htmlFor="time" className={FIELD_LABEL}>
                    Time of arrival
                  </label>
                  <Select
                    items={TIME_ITEMS}
                    value={values.time}
                    onValueChange={(value) => {
                      if (value === null) return
                      set("time", value)
                      clear("time")
                    }}
                  >
                    <SelectTrigger
                      id="time"
                      ref={timeRef}
                      aria-labelledby="time-label"
                      aria-invalid={!!errors.time || undefined}
                      aria-describedby={describedBy(
                        "time-help",
                        errors.time && "time-error"
                      )}
                      className="mt-2"
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
                  <p id="time-help" className={HELP}>
                    The door is open from <time dateTime="15:00">15:00</time> to{" "}
                    <time dateTime="20:00">20:00</time>. For a later arrival we
                    leave a key in the porch.
                  </p>
                  <ErrorLine id="time-error" message={errors.time} />
                </div>

                <div className="mt-6">
                  <label htmlFor="note" className={FIELD_LABEL}>
                    Note (optional)
                  </label>
                  <Textarea
                    id="note"
                    maxLength={400}
                    value={values.note}
                    onChange={(event) => set("note", event.target.value)}
                    aria-describedby="note-help"
                    className="mt-2 min-h-24 resize-none rounded-md px-4 py-2 text-body md:text-body"
                  />
                  <p id="note-help" className={HELP}>
                    An allergy, a cot, a late train: anything we should know.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <Button type="submit" className={BUTTON}>
                    Send request
                  </Button>
                  <p className="font-mono text-label text-muted-foreground">
                    Nothing is paid now.
                  </p>
                </div>
              </form>
            )}

            <div role="status">
              {confirmation ? (
                <div>
                  <h2
                    ref={confirmationRef}
                    tabIndex={-1}
                    className="text-h2 focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:outline-solid"
                  >
                    Thank you. We have your request
                  </h2>
                  <p className="mt-4 max-w-xl">
                    {confirmation.room} for{" "}
                    {count(confirmation.guests, "guest")}, from{" "}
                    <time dateTime={confirmation.arrive}>
                      {longDate(confirmation.arrive)}
                    </time>{" "}
                    to{" "}
                    <time dateTime={confirmation.leave}>
                      {longDate(confirmation.leave)}
                    </time>
                    : {count(confirmation.nights, "night")},{" "}
                    {pounds(confirmation.total)} in all.
                  </p>
                  <p className="mt-4 max-w-xl wrap-break-word">
                    We will write to {confirmation.email} within a day to say
                    whether the room is free. Nothing has been paid.
                  </p>
                  <p
                    className={cn(
                      LABEL,
                      "mt-4 text-muted-foreground tabular-nums"
                    )}
                  >
                    Reference · {reference(confirmation.arrive)}
                  </p>
                </div>
              ) : null}
            </div>

            {confirmation ? (
              <div className="mt-6">
                <Button
                  variant="secondary"
                  className={BUTTON}
                  onClick={startAgain}
                >
                  Make another request
                </Button>
              </div>
            ) : null}
          </div>

          {/* Summary */}
          <aside
            aria-labelledby="summary-title"
            className={cn(
              CARD,
              "md:sticky md:top-6 md:col-span-4 md:col-start-9"
            )}
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className={cn(LABEL, "text-muted-foreground")}>Your stay</p>
              <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
                Breakfast included
              </Badge>
            </div>
            <h2 id="summary-title" className="mt-2 text-h2">
              Summary
            </h2>

            <dl className="mt-6 divide-y divide-border border-y border-border">
              <FactRow term="Arrive">
                {values.arrive ? (
                  <time dateTime={values.arrive}>
                    {longDate(values.arrive)}
                  </time>
                ) : null}
              </FactRow>
              <FactRow term="Leave">
                {values.leave ? (
                  <time dateTime={values.leave}>{longDate(values.leave)}</time>
                ) : null}
              </FactRow>
              <FactRow term="Nights">
                {nights >= 1 ? count(nights, "night") : null}
              </FactRow>
              <FactRow term="Room">{room ? room.name : null}</FactRow>
              <FactRow term="Guests">{count(guests, "guest")}</FactRow>
            </dl>

            <dl className="mt-6 divide-y divide-border border-y border-border">
              {stay?.lines.map((line) => (
                <div
                  key={line.season}
                  className="flex items-baseline justify-between gap-4 py-2"
                >
                  <dt
                    className={cn(LABEL, "text-muted-foreground tabular-nums")}
                  >
                    {count(line.nights, "night")} at {pounds(line.price)}
                  </dt>
                  <dd
                    className={cn(
                      LABEL,
                      "text-right text-foreground tabular-nums"
                    )}
                  >
                    {pounds(line.sum)}
                  </dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 py-2">
                <dt className={cn(LABEL, "text-muted-foreground")}>Total</dt>
                {stay ? (
                  <dd className="text-right font-heading text-h2 text-foreground tabular-nums">
                    {pounds(stay.total)}
                  </dd>
                ) : (
                  <dd className="text-right text-body text-muted-foreground">
                    Not worked out yet
                  </dd>
                )}
              </div>
            </dl>

            <p className="mt-4 font-mono text-label text-muted-foreground">
              Breakfast is included. You pay at the house when you leave.
            </p>
          </aside>
        </section>

        {/* Before you arrive */}
        <section aria-labelledby="before-title" className={cn(SECTION, GRID)}>
          <div className="md:col-span-4">
            <p className={cn(LABEL, "text-muted-foreground")}>Good to know</p>
            <h2 id="before-title" className="mt-2 text-h2 md:text-h1">
              Before you arrive
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <ul>
              <TimeRow name="Arrive">
                <time dateTime="15:00">15:00</time>–
                <time dateTime="20:00">20:00</time>
              </TimeRow>
              <TimeRow name="Leave by">
                <time dateTime="10:30">10:30</time>
              </TimeRow>
              <TimeRow name="Change or cancel, free of charge">
                Up to 7 days before
              </TimeRow>
              <TimeRow name="Stays in July and August">
                Two nights or more
              </TimeRow>
            </ul>
            <p className="mt-4 max-w-xl wrap-break-word">
              For anything else, write to{" "}
              <a
                href="mailto:stay@kittiwakehouse.example"
                className={TEXT_LINK}
              >
                stay@kittiwakehouse.example
              </a>{" "}
              or call{" "}
              <a
                href="tel:+441632960352"
                className={cn(TEXT_LINK, "whitespace-nowrap")}
              >
                01632 960 352
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-border py-12 md:mt-26">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <p className="font-heading text-h2">Kittiwake House</p>
            <p className="mt-2 max-w-xl">
              Six rooms above the harbour at Port Lowan, with breakfast on the
              veranda.
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <address className="not-italic">
              <span className="block">9 Harbour Terrace</span>
              <span className="block">Port Lowan LW6 3QT</span>
            </address>
            <p className="mt-4">
              <a href="tel:+441632960352" className={NAV_LINK}>
                01632 960 352
              </a>
            </p>
            <p className="mt-2 wrap-break-word">
              <a href="mailto:stay@kittiwakehouse.example" className={NAV_LINK}>
                stay@kittiwakehouse.example
              </a>
            </p>
          </div>
        </div>
        <p className={cn(LABEL, "mt-6 text-muted-foreground")}>
          © 2027 Kittiwake House · Open all year
        </p>
      </footer>
    </div>
  )
}

function FactRow({
  term,
  children,
}: {
  term: string
  children: React.ReactNode
}) {
  const missing = children === null || children === undefined
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className={cn(LABEL, "text-muted-foreground")}>{term}</dt>
      <dd
        className={cn(
          "text-right text-body tabular-nums",
          missing ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {missing ? "Not chosen yet" : children}
      </dd>
    </div>
  )
}

function TimeRow({
  name,
  children,
}: {
  name: string
  children: React.ReactNode
}) {
  return (
    <li className="flex items-baseline gap-2 py-2">
      <span className="min-w-0">{name}</span>
      <span
        aria-hidden="true"
        className="min-w-4 flex-1 border-b border-border"
      />
      <span className="shrink-0 font-mono text-label whitespace-nowrap text-foreground uppercase tabular-nums">
        {children}
      </span>
    </li>
  )
}

export default App
