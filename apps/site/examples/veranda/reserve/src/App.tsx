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

// ---------------------------------------------------------------------------
// The house

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

const GUEST_ITEMS = ["1", "2", "3", "4"].map((value) => ({
  value,
  label: count(Number(value), "guest", "guests"),
}))

const TIME_ITEMS = [
  { value: "15:00", label: "15:00 to 16:00" },
  { value: "16:00", label: "16:00 to 17:00" },
  { value: "17:00", label: "17:00 to 18:00" },
  { value: "18:00", label: "18:00 to 19:00" },
  { value: "19:00", label: "19:00 to 20:00" },
  { value: "later", label: "Later than 20:00" },
]

const MAX_NIGHTS = 14

// ---------------------------------------------------------------------------
// Dates, written as a date field holds them: "2027-05-14"

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
const DAY = 86_400_000

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

function dayNumber(value: string) {
  const p = parts(value)
  return p ? Date.UTC(p.y, p.m - 1, p.d) / DAY : NaN
}

function fromDayNumber(n: number) {
  const date = new Date(n * DAY)
  const y = String(date.getUTCFullYear()).padStart(4, "0")
  const m = String(date.getUTCMonth() + 1).padStart(2, "0")
  const d = String(date.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function todayValue() {
  const now = new Date()
  const y = String(now.getFullYear()).padStart(4, "0")
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function longDate(value: string) {
  const p = parts(value)
  if (!p) return value
  const weekday = new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay()
  return `${WEEKDAYS[weekday]} ${p.d} ${MONTHS[p.m - 1]} ${p.y}`
}

// 0 winter, 1 spring and autumn, 2 summer
function season(month: number) {
  if (month >= 11 || month <= 3) return 0
  if (month === 7 || month === 8) return 2
  return 1
}

function nightsBetween(arrive: string, leave: string) {
  if (!parts(arrive) || !parts(leave)) return 0
  return dayNumber(leave) - dayNumber(arrive)
}

type PriceLine = { nights: number; price: number; sum: number }

function priceLines(room: Room, arrive: string, nights: number) {
  const lines: { season: number; line: PriceLine }[] = []
  const start = dayNumber(arrive)
  for (let i = 0; i < nights; i++) {
    const month = Number(fromDayNumber(start + i).slice(5, 7))
    const s = season(month)
    const price = room.prices[s]
    const last = lines[lines.length - 1]
    if (last && last.season === s) {
      last.line.nights += 1
      last.line.sum += price
    } else {
      lines.push({ season: s, line: { nights: 1, price, sum: price } })
    }
  }
  return lines.map((entry) => entry.line)
}

function count(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

function pounds(n: number) {
  return `£${n.toLocaleString("en-GB")}`
}

// ---------------------------------------------------------------------------
// The form

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

type Field = Exclude<keyof Values, "note">
type Errors = Partial<Record<Field, string>>

const FIELD_ORDER: Field[] = [
  "arrive",
  "leave",
  "room",
  "guests",
  "name",
  "email",
  "phone",
  "time",
]

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

function findRoom(value: string | null) {
  return ROOMS.find((room) => room.value === value)
}

function check(values: Values, today: string): Errors {
  const errors: Errors = {}

  if (!values.arrive) {
    errors.arrive = "Choose the day you arrive."
  } else if (dayNumber(values.arrive) < dayNumber(today)) {
    errors.arrive = "Choose today or a later day."
  }

  if (!values.leave) {
    errors.leave = "Choose the day you leave."
  } else if (values.arrive) {
    const nights = nightsBetween(values.arrive, values.leave)
    const month = Number(values.arrive.slice(5, 7))
    if (nights < 1) {
      errors.leave = "Choose a day after the day you arrive."
    } else if (nights > MAX_NIGHTS) {
      errors.leave =
        "We take requests for up to 14 nights. For a longer stay, write to us."
    } else if (nights === 1 && (month === 7 || month === 8)) {
      errors.leave =
        "In July and August we take stays of two nights or more. Choose a later day."
    }
  }

  const room = findRoom(values.room)
  if (!room) {
    errors.room = "Choose a room."
  } else if (Number(values.guests) > room.sleeps) {
    errors.guests = `${room.name} sleeps ${room.sleeps}. Choose fewer guests or another room.`
  }

  if (!values.name.trim()) {
    errors.name = "Write your name."
  }

  const email = values.email.trim()
  if (!email) {
    errors.email = "Write your email address."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Check the email address: it needs an @ and a domain."
  }

  const phone = values.phone.trim()
  if (phone) {
    const digits = phone.replace(/\D/g, "").length
    if (!/^\+?[0-9 ]+$/.test(phone) || digits < 7) {
      errors.phone =
        "Write the number in digits, such as 01632 960 352, or leave it empty."
    }
  }

  if (!values.time) {
    errors.time = "Choose when you expect to arrive."
  }

  return errors
}

type Confirmation = {
  room: string
  guests: number
  arrive: string
  leave: string
  nights: number
  total: number
  email: string
  reference: string
}

// ---------------------------------------------------------------------------
// Shared classes

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const navLink = `font-mono text-label uppercase text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`
const footerLink = `text-body text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`
const textLink = `text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground ${focusRing}`
const buttonClasses =
  "h-auto rounded-md px-6 py-2 font-mono text-label font-normal uppercase"
const fieldLabel = "block font-mono text-label uppercase text-foreground"
const inputClasses = "mt-2 h-11 rounded-md px-4 text-body md:text-body"
const helperLine = "mt-2 font-mono text-label text-muted-foreground"
const label = "font-mono text-label uppercase"

function ErrorLine({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      <span>{message}</span>
    </p>
  )
}

function describedBy(...ids: (string | false | undefined)[]) {
  const list = ids.filter(Boolean)
  return list.length ? list.join(" ") : undefined
}

// ---------------------------------------------------------------------------
// The page

export function App() {
  const today = todayValue()
  const tomorrow = fromDayNumber(dayNumber(today) + 1)

  const [values, setValues] = React.useState<Values>(fromAddress)
  const [errors, setErrors] = React.useState<Errors>({})
  const [confirmation, setConfirmation] = React.useState<Confirmation | null>(
    null
  )
  const [focusRequest, setFocusRequest] = React.useState<{
    id: string
    n: number
  } | null>(null)

  React.useEffect(() => {
    if (!focusRequest) return
    const frame = requestAnimationFrame(() => {
      document.getElementById(focusRequest.id)?.focus()
    })
    return () => cancelAnimationFrame(frame)
  }, [focusRequest])

  function focusLater(id: string) {
    setFocusRequest((previous) => ({ id, n: (previous?.n ?? 0) + 1 }))
  }

  // Set a value and clear the errors that depend on it.
  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((previous) => ({ ...previous, [key]: value }))
    setErrors((previous) => {
      const next = { ...previous }
      if (key !== "note") delete next[key as Field]
      if (key === "arrive") delete next.leave
      if (key === "room") delete next.guests
      return next
    })
  }

  const room = findRoom(values.room)
  const nights = nightsBetween(values.arrive, values.leave)
  const hasNights = nights >= 1
  const lines = room && hasNights ? priceLines(room, values.arrive, nights) : []
  const total = lines.reduce((sum, line) => sum + line.sum, 0)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = check(values, today)
    setErrors(found)
    const first = FIELD_ORDER.find((field) => found[field])
    if (first) {
      focusLater(first)
      return
    }
    if (!room) return
    const p = parts(values.arrive)!
    setConfirmation({
      room: room.name,
      guests: Number(values.guests),
      arrive: values.arrive,
      leave: values.leave,
      nights,
      total,
      email: values.email.trim(),
      reference: `KH-${String(p.y % 100).padStart(2, "0")}${String(p.m).padStart(2, "0")}-${String(p.d).padStart(3, "0")}`,
    })
    focusLater("confirmation-heading")
  }

  function startAgain() {
    setValues({ ...EMPTY })
    setErrors({})
    setConfirmation(null)
    focusLater("arrive")
  }

  const departureMin = values.arrive
    ? fromDayNumber(dayNumber(values.arrive) + 1)
    : tomorrow

  return (
    <div className="mx-auto max-w-[1160px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-4 border-b border-border py-6 md:flex-row md:items-baseline md:justify-between">
        <a
          href="/"
          className={`font-heading text-h2 text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`}
        >
          Kittiwake House
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <a href="/rooms" className={navLink}>
                Rooms
              </a>
            </li>
            <li>
              <a href="/menu" className={navLink}>
                Menu
              </a>
            </li>
            <li>
              <a href="/#find-us" className={navLink}>
                Find us
              </a>
            </li>
            <li>
              <a
                href="/reserve"
                aria-current="page"
                className={`${navLink} underline`}
              >
                Reserve
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <section
          aria-labelledby="page-title"
          className="grid gap-6 pt-12 md:grid-cols-12 md:items-start"
        >
          <div className="md:col-span-7">
            <p className={`${label} text-muted-foreground`}>
              Six rooms · We reply within a day
            </p>
            <h1 id="page-title" className="mt-2 text-h1 lg:text-display">
              Request a reservation
            </h1>
            <p className="mt-4 max-w-xl text-body">
              Tell us the days and the room you would like. Nothing is charged
              now: we write back to confirm, and you pay at the house when you
              leave.
            </p>
          </div>

          <div className="rounded-xl bg-clay p-6 text-clay-foreground md:col-span-4 md:col-start-9">
            <p className={label}>How it works</p>
            <h2 className="mt-2 text-h2">A request, not a payment</h2>
            <ol className="mt-6 list-none p-0">
              <li className="flex items-baseline gap-4">
                <span className={`${label} tabular-nums`}>01</span>
                <p className="text-body">
                  You send the days and the room you would like.
                </p>
              </li>
              <li className="mt-4 flex items-baseline gap-4">
                <span className={`${label} tabular-nums`}>02</span>
                <p className="text-body">
                  We check the room and write back within a day.
                </p>
              </li>
              <li className="mt-4 flex items-baseline gap-4">
                <span className={`${label} tabular-nums`}>03</span>
                <p className="text-body">
                  You pay at the house when you leave, by card or in cash.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section
          aria-label="Request and summary"
          className="mt-12 grid gap-6 border-t border-border pt-6 md:mt-26 md:grid-cols-12 md:items-start"
        >
          <div className="rounded-xl border border-border bg-card p-6 md:col-span-7">
            {confirmation ? null : (
              <form
                noValidate
                aria-labelledby="request-heading"
                onSubmit={handleSubmit}
              >
                <h2 id="request-heading" className="text-h2">
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
                      onValueChange={(value) => update("arrive", value)}
                      min={today}
                      className="mt-2"
                      aria-invalid={Boolean(errors.arrive)}
                      aria-describedby={describedBy(
                        errors.arrive && "arrive-error"
                      )}
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
                      onValueChange={(value) => update("leave", value)}
                      min={departureMin}
                      className="mt-2"
                      aria-invalid={Boolean(errors.leave)}
                      aria-describedby={describedBy(
                        errors.leave && "leave-error"
                      )}
                    />
                    <ErrorLine id="leave-error" message={errors.leave} />
                  </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <label id="room-label" htmlFor="room" className={fieldLabel}>
                      Room
                    </label>
                    <Select
                      name="room"
                      items={ROOM_ITEMS}
                      value={values.room}
                      onValueChange={(value) => {
                        if (value !== null) update("room", value)
                      }}
                    >
                      <SelectTrigger
                        id="room"
                        aria-labelledby="room-label"
                        aria-invalid={errors.room ? true : undefined}
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
                    <label id="guests-label" htmlFor="guests" className={fieldLabel}>
                      Guests
                    </label>
                    <Select
                      name="guests"
                      items={GUEST_ITEMS}
                      value={values.guests}
                      onValueChange={(value) => {
                        if (value !== null) update("guests", value)
                      }}
                    >
                      <SelectTrigger
                        id="guests"
                        aria-labelledby="guests-label"
                        aria-invalid={errors.guests ? true : undefined}
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
                  <label htmlFor="name" className={fieldLabel}>
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={values.name}
                    onChange={(event) => update("name", event.target.value)}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={describedBy(errors.name && "name-error")}
                    className={inputClasses}
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
                      onChange={(event) => update("email", event.target.value)}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={describedBy(
                        errors.email && "email-error"
                      )}
                      className={inputClasses}
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
                      onChange={(event) => update("phone", event.target.value)}
                      aria-invalid={errors.phone ? true : undefined}
                      aria-describedby={describedBy(
                        errors.phone && "phone-error"
                      )}
                      className={inputClasses}
                    />
                    <ErrorLine id="phone-error" message={errors.phone} />
                  </div>
                </div>

                <div className="mt-6">
                  <label id="time-label" htmlFor="time" className={fieldLabel}>
                    Time of arrival
                  </label>
                  <Select
                    name="time"
                    items={TIME_ITEMS}
                    value={values.time}
                    onValueChange={(value) => {
                      if (value !== null) update("time", value)
                    }}
                  >
                    <SelectTrigger
                      id="time"
                      aria-labelledby="time-label"
                      aria-invalid={errors.time ? true : undefined}
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
                  <p id="time-help" className={helperLine}>
                    The door is open from <time dateTime="15:00">15:00</time>{" "}
                    to <time dateTime="20:00">20:00</time>. For a later arrival
                    we leave a key in the porch.
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
                    onChange={(event) => update("note", event.target.value)}
                    aria-describedby="note-help"
                    className="mt-2 min-h-24 resize-none rounded-md px-4 py-2 text-body md:text-body"
                  />
                  <p id="note-help" className={helperLine}>
                    An allergy, a cot, a late train: anything we should know.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <Button type="submit" className={buttonClasses}>
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
                    id="confirmation-heading"
                    tabIndex={-1}
                    className={`text-h2 ${codeFocusRing}`}
                  >
                    Thank you. We have your request
                  </h2>
                  <p className="mt-4 max-w-xl text-body">
                    {confirmation.room} for{" "}
                    {count(confirmation.guests, "guest", "guests")}, from{" "}
                    <time dateTime={confirmation.arrive}>
                      {longDate(confirmation.arrive)}
                    </time>{" "}
                    to{" "}
                    <time dateTime={confirmation.leave}>
                      {longDate(confirmation.leave)}
                    </time>
                    : {count(confirmation.nights, "night", "nights")},{" "}
                    {pounds(confirmation.total)} in all.
                  </p>
                  <p className="mt-4 max-w-xl text-body wrap-break-word">
                    We will write to {confirmation.email} within a day to say
                    whether the room is free. Nothing has been paid.
                  </p>
                  <p className={`mt-4 ${label} text-muted-foreground`}>
                    Reference · {confirmation.reference}
                  </p>
                </div>
              ) : null}
            </div>

            {confirmation ? (
              <div className="mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  className={buttonClasses}
                  onClick={startAgain}
                >
                  Make another request
                </Button>
              </div>
            ) : null}
          </div>

          <aside
            aria-labelledby="summary-heading"
            className="rounded-xl border border-border bg-card p-6 md:sticky md:top-6 md:col-span-4 md:col-start-9"
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className={`${label} text-muted-foreground`}>Your stay</p>
              <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
                Breakfast included
              </Badge>
            </div>
            <h2 id="summary-heading" className="mt-2 text-h2">
              Summary
            </h2>

            <dl className="mt-6 divide-y divide-border border-y border-border">
              <SummaryRow term="Arrive">
                {parts(values.arrive) ? (
                  <time dateTime={values.arrive}>{longDate(values.arrive)}</time>
                ) : null}
              </SummaryRow>
              <SummaryRow term="Leave">
                {parts(values.leave) ? (
                  <time dateTime={values.leave}>{longDate(values.leave)}</time>
                ) : null}
              </SummaryRow>
              <SummaryRow term="Nights">
                {hasNights ? count(nights, "night", "nights") : null}
              </SummaryRow>
              <SummaryRow term="Room">{room ? room.name : null}</SummaryRow>
              <SummaryRow term="Guests">
                {count(Number(values.guests), "guest", "guests")}
              </SummaryRow>
            </dl>

            <dl className="mt-6 divide-y divide-border border-y border-border">
              {lines.map((line, index) => (
                <div
                  key={index}
                  className="flex items-baseline justify-between gap-4 py-2"
                >
                  <dt className={`${label} text-muted-foreground tabular-nums`}>
                    {count(line.nights, "night", "nights")} at {pounds(line.price)}
                  </dt>
                  <dd
                    className={`${label} text-right text-foreground tabular-nums`}
                  >
                    {pounds(line.sum)}
                  </dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 py-2">
                <dt className={`${label} text-muted-foreground`}>Total</dt>
                {lines.length ? (
                  <dd className="text-right font-heading text-h2 text-foreground tabular-nums">
                    {pounds(total)}
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

        <section
          aria-labelledby="before-heading"
          className="mt-12 grid gap-6 border-t border-border pt-6 md:mt-26 md:grid-cols-12 md:items-start"
        >
          <div className="md:col-span-4">
            <p className={`${label} text-muted-foreground`}>Good to know</p>
            <h2 id="before-heading" className="mt-2 text-h2 md:text-h1">
              Before you arrive
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <ul className="list-none p-0">
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
              <TimeRow name="Stays in July and August">Two nights or more</TimeRow>
            </ul>
            <p className="mt-4 max-w-xl text-body">
              For anything else, write to{" "}
              <a href="mailto:stay@kittiwakehouse.example" className={textLink}>
                stay@kittiwakehouse.example
              </a>{" "}
              or call{" "}
              <a
                href="tel:+441632960352"
                className={`${textLink} whitespace-nowrap`}
              >
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
        <p className={`mt-6 ${label} text-muted-foreground`}>
          © 2027 Kittiwake House · Open all year
        </p>
      </footer>
    </div>
  )
}

function SummaryRow({
  term,
  children,
}: {
  term: string
  children: React.ReactNode
}) {
  const missing = children === null || children === undefined
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className={`${label} text-muted-foreground`}>{term}</dt>
      <dd
        className={`text-right text-body ${missing ? "text-muted-foreground" : "text-foreground"}`}
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
      <span className="min-w-0 text-body">{name}</span>
      <span aria-hidden="true" className="min-w-4 flex-1 border-b border-border" />
      <span className="shrink-0 font-mono text-label whitespace-nowrap text-foreground uppercase tabular-nums">
        {children}
      </span>
    </li>
  )
}

export default App
