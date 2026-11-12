import * as React from "react"
import { flushSync } from "react-dom"
import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const FOCUS_CODE =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const TEXT_LINK = `text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground ${FOCUS}`
const NAV_LINK = `font-mono text-label uppercase text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${FOCUS}`
const LABEL = "block font-mono text-label uppercase text-foreground"
const LABEL_HEADING = "font-mono text-label uppercase text-foreground"
const FIELD =
  "mt-2 h-auto border-muted-foreground px-4 py-2 text-body md:text-body"
const SELECT = `mt-2 h-auto w-full border border-muted-foreground bg-transparent px-4 py-2 text-body text-foreground dark:bg-input/30 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 focus-visible:border-ring ${FOCUS}`
const BUTTON = "h-auto px-8 py-4 font-mono text-label font-normal uppercase"

const HOUSE = "Maison Ardelle"
const HOUSE_EMAIL = "atelier@maison-ardelle.example"
const TIMES = ["10:00", "11:30", "14:00", "15:30", "17:00"]
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

type Field = "name" | "email" | "date" | "time"
type Values = Record<Field | "note", string>
type Errors = Partial<Record<Field, string>>

const EMPTY: Values = { name: "", email: "", date: "", time: "", note: "" }
const SATURDAY_ERROR = "On Saturdays the last fitting is at 15:30."

const pad = (n: number) => String(n).padStart(2, "0")

/** Tomorrow by the visitor's clock, as YYYY-MM-DD. */
function tomorrowISO() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Reads YYYY-MM-DD as a calendar date in local time, not UTC. */
function parseDay(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const date = new Date(y, m - 1, d)
  if (date.getMonth() !== m - 1 || date.getDate() !== d) return null
  return date
}

function formatDay(date: Date) {
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

function validate(values: Values): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = "Write your name."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Write an email address such as name@example.com."

  const day = parseDay(values.date)
  if (!values.date || !day) errors.date = "Choose a day."
  else if (values.date < tomorrowISO())
    errors.date = "Choose a day from tomorrow on."
  else if (day.getDay() === 0 || day.getDay() === 1)
    errors.date =
      "The atelier is closed on Sundays and Mondays. Choose another day."

  if (!values.time) errors.time = "Choose a time."
  else if (day && day.getDay() === 6 && values.time === "17:00")
    errors.time = SATURDAY_ERROR
  return errors
}

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

function Header() {
  return (
    <header className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
      <a
        href="/"
        className={`font-heading text-h2 text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${FOCUS}`}
      >
        {HOUSE}
      </a>
      <nav aria-label="Main">
        <ul className="flex flex-wrap gap-x-8 gap-y-2">
          <li>
            <a href="#" className={NAV_LINK}>
              Collection
            </a>
          </li>
          <li>
            <a href="#" className={NAV_LINK}>
              House
            </a>
          </li>
          <li>
            <a href="#" aria-current="page" className={`${NAV_LINK} underline`}>
              Appointment
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-border py-8 md:mt-32">
      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-4">
          <p className="font-heading text-h2">{HOUSE}</p>
          <div className="mt-2 font-mono text-label text-muted-foreground uppercase">
            <p>7 rue Belvèze</p>
            <p>69001 Lyon</p>
          </div>
        </div>
        <nav
          aria-label="Footer"
          className="mt-8 md:col-span-4 md:col-start-9 md:mt-0"
        >
          <ul>
            <li>
              <a href="#" className={NAV_LINK}>
                Collection
              </a>
            </li>
            <li className="mt-2">
              <a href="#" className={NAV_LINK}>
                House
              </a>
            </li>
            <li className="mt-2">
              <a
                href="#"
                aria-current="page"
                className={`${NAV_LINK} underline`}
              >
                Appointment
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <p className="mt-8 font-mono text-label text-muted-foreground uppercase">
        © 2026 {HOUSE}
      </p>
    </footer>
  )
}

function Atelier() {
  return (
    <div className="md:col-span-4">
      <h2 className={LABEL_HEADING}>Address</h2>
      <address className="mt-4 text-body not-italic">
        7 rue Belvèze
        <br />
        69001 Lyon
        <br />
        Second floor, with a lift
      </address>
      <p className="mt-4">
        <a href="#" className={TEXT_LINK}>
          Open in a map
        </a>
      </p>

      <h2 className={`mt-16 ${LABEL_HEADING}`}>Hours</h2>
      <dl className="mt-4 border-b border-border">
        <HoursRow days="Tuesday to Friday" from="10:00" to="18:00" />
        <HoursRow days="Saturday" from="10:00" to="17:00" />
        <HoursRow days="Sunday and Monday" />
      </dl>

      <h2 className={`mt-16 ${LABEL_HEADING}`}>Questions</h2>
      <p className="mt-4 text-body">
        Write to{" "}
        <a href={`mailto:${HOUSE_EMAIL}`} className={TEXT_LINK}>
          {HOUSE_EMAIL}
        </a>{" "}
        and the atelier will answer within a day.
      </p>
    </div>
  )
}

function HoursRow({
  days,
  from,
  to,
}: {
  days: string
  from?: string
  to?: string
}) {
  return (
    <div className="grid grid-cols-1 border-t border-border py-4 lg:grid-cols-3 lg:items-baseline lg:gap-x-4">
      <dt className="font-mono text-label text-muted-foreground uppercase">
        {days}
      </dt>
      <dd className="mt-2 text-body lg:col-span-2 lg:mt-0">
        {from && to ? (
          <>
            <time dateTime={from} className="font-mono tabular-nums">
              {from}
            </time>
            –
            <time dateTime={to} className="font-mono tabular-nums">
              {to}
            </time>
          </>
        ) : (
          "Closed"
        )}
      </dd>
    </div>
  )
}

type BookingInfo = { date: string; day: string; time: string; email: string }

function Booking() {
  const [values, setValues] = React.useState<Values>(EMPTY)
  const [errors, setErrors] = React.useState<Errors>({})
  const [booking, setBooking] = React.useState<BookingInfo | null>(null)

  const nameRef = React.useRef<HTMLInputElement>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)
  const dateRef = React.useRef<HTMLInputElement>(null)
  const timeRef = React.useRef<HTMLSelectElement>(null)
  const headingRef = React.useRef<HTMLHeadingElement>(null)

  React.useEffect(() => {
    if (booking) headingRef.current?.focus()
  }, [booking])

  function update(field: keyof Values, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
    setErrors((e) => {
      if (field === "note") return e
      const next = { ...e }
      delete next[field]
      if (field === "date" && next.time === SATURDAY_ERROR) delete next.time
      return next
    })
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    const first = (["name", "email", "date", "time"] as Field[]).find(
      (f) => found[f]
    )
    if (first) {
      const fieldRefs = {
        name: nameRef,
        email: emailRef,
        date: dateRef,
        time: timeRef,
      }
      fieldRefs[first].current?.focus()
      return
    }
    const day = parseDay(values.date)!
    setBooking({
      date: values.date,
      day: formatDay(day),
      time: values.time,
      email: values.email.trim(),
    })
  }

  function bookAnother() {
    setValues(EMPTY)
    setErrors({})
    flushSync(() => setBooking(null))
    nameRef.current?.focus()
  }

  const invalid = (f: Field) => (errors[f] ? true : undefined)
  const described = (f: Field) => (errors[f] ? `${f}-error` : undefined)

  return (
    <div className="mt-16 md:col-span-7 md:col-start-6 md:mt-0">
      {!booking && (
        <form noValidate onSubmit={onSubmit} className="bg-card p-8">
          <h2 className="text-h2">Book a fitting</h2>
          <p className="mt-4 text-body">
            A tailor will confirm your fitting by email within a day.
          </p>

          <div className="mt-8">
            <div>
              <label htmlFor="name" className={LABEL}>
                Your name
              </label>
              <Input
                ref={nameRef}
                id="name"
                name="name"
                autoComplete="name"
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                aria-invalid={invalid("name")}
                aria-describedby={described("name")}
                className={FIELD}
              />
              <ErrorLine id="name-error" message={errors.name} />
            </div>

            <div className="mt-8">
              <label htmlFor="email" className={LABEL}>
                Email address
              </label>
              <Input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                aria-invalid={invalid("email")}
                aria-describedby={described("email")}
                className={FIELD}
              />
              <ErrorLine id="email-error" message={errors.email} />
            </div>

            <div className="mt-8 md:grid md:grid-cols-2 md:gap-x-8">
              <div>
                <label htmlFor="date" className={LABEL}>
                  Date
                </label>
                <Input
                  ref={dateRef}
                  id="date"
                  name="date"
                  type="date"
                  min={tomorrowISO()}
                  value={values.date}
                  onChange={(e) => update("date", e.target.value)}
                  aria-invalid={invalid("date")}
                  aria-describedby={described("date")}
                  className={FIELD}
                />
                <ErrorLine id="date-error" message={errors.date} />
              </div>
              <div className="mt-8 md:mt-0">
                <label htmlFor="time" className={LABEL}>
                  Time
                </label>
                <select
                  ref={timeRef}
                  id="time"
                  name="time"
                  value={values.time}
                  onChange={(e) => update("time", e.target.value)}
                  aria-invalid={invalid("time")}
                  aria-describedby={described("time")}
                  className={SELECT}
                >
                  <option value="">Choose a time</option>
                  {TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ErrorLine id="time-error" message={errors.time} />
              </div>
            </div>

            <div className="mt-8">
              <label htmlFor="note" className={LABEL}>
                Note (optional)
              </label>
              <p
                id="note-help"
                className="mt-2 font-mono text-label text-muted-foreground"
              >
                Tell us what you would like to try, or your size.
              </p>
              <Textarea
                id="note"
                name="note"
                value={values.note}
                onChange={(e) => update("note", e.target.value)}
                aria-describedby="note-help"
                className={`min-h-32 ${FIELD}`}
              />
            </div>
          </div>

          <Button type="submit" className={`mt-8 w-full md:w-auto ${BUTTON}`}>
            Request a fitting
          </Button>
        </form>
      )}

      <div role="status">
        {booking && (
          <div className="bg-card p-8">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className={`text-h2 ${FOCUS_CODE}`}
            >
              Your fitting is requested
            </h2>
            <p className="mt-4 text-body">
              <time dateTime={booking.date}>{booking.day}</time> at{" "}
              <time dateTime={booking.time}>{booking.time}</time>. We will
              confirm to {booking.email} within a day.
            </p>
          </div>
        )}
      </div>

      {booking && (
        <Button
          variant="outline"
          onClick={bookAnother}
          className={`mt-8 ${BUTTON}`}
        >
          Book another fitting
        </Button>
      )}
    </div>
  )
}

export function App() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 text-body md:px-8">
      <Header />
      <main>
        <section className="mt-16 grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <p className="font-mono text-label text-muted-foreground uppercase md:col-span-12">
            Fittings · Lyon
          </p>
          <h1 className="mt-4 text-h1 md:col-span-9 md:text-display">
            Come to the <em>atelier</em>
          </h1>
          <p className="mt-8 max-w-md text-body md:col-span-5 md:col-start-5">
            A fitting is an hour in the atelier with one of our tailors, to try
            on the season's pieces or to be measured for a coat. It is free.
          </p>
        </section>

        <section className="mt-16 grid grid-cols-1 md:mt-32 md:grid-cols-12 md:gap-x-8">
          <Atelier />
          <Booking />
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
