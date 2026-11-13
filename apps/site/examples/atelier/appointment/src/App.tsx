import * as React from "react"
import { CircleAlert } from "lucide-react"

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
import { compareDays, formatDate, getTomorrow, toDateTime } from "@/lib/date"
import { cn } from "@/lib/utils"

const HOUSE = "Maison Ardelle"
const EMAIL = "atelier@maison-ardelle.example"
const TIMES = ["10:00", "11:30", "14:00", "15:30", "17:00"]
const NAV = ["Collection", "House", "Appointment"]
const CURRENT = "Appointment"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const navLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusRing
)
const label = "font-mono text-label uppercase"
const fieldLabel = "block font-mono text-label text-foreground uppercase"
const labelHeading = "font-mono text-label text-foreground uppercase"
const inputClass =
  "mt-2 h-auto border-muted-foreground px-4 py-2 text-body md:text-body"
const buttonClass =
  "h-auto px-8 py-4 font-mono text-label font-normal uppercase"

type Field = "name" | "email" | "date" | "time"
type Errors = Partial<Record<Field, string>>
type Booking = { date: Date; time: string; email: string }

const SATURDAY_ERROR = "On Saturdays the last fitting is at 15:30."
const FIELD_ORDER: Field[] = ["name", "email", "date", "time"]
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(
  name: string,
  email: string,
  date: Date | undefined,
  time: string | null
): Errors {
  const errors: Errors = {}
  if (!name) errors.name = "Write your name."
  if (!email || !EMAIL_PATTERN.test(email)) {
    errors.email = "Write an email address such as name@example.com."
  }
  if (!date) {
    errors.date = "Choose a day."
  } else if (compareDays(date, getTomorrow()) < 0) {
    errors.date = "Choose a day from tomorrow on."
  } else if (date.getDay() === 0 || date.getDay() === 1) {
    errors.date =
      "The atelier is closed on Sundays and Mondays. Choose another day."
  }
  if (!time) {
    errors.time = "Choose a time."
  } else if (date && date.getDay() === 6 && time === "17:00") {
    errors.time = SATURDAY_ERROR
  }
  return errors
}

function ErrorLine({ id, children }: { id: string; children: string }) {
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
      <span>{children}</span>
    </p>
  )
}

function Header() {
  return (
    <header className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
      <a href="/" className={cn(navLink, "font-heading text-h2")}>
        {HOUSE}
      </a>
      <nav aria-label="Main">
        <ul className="flex flex-wrap gap-x-8 gap-y-2">
          {NAV.map((item) => (
            <li key={item}>
              <a
                href="#"
                aria-current={item === CURRENT ? "page" : undefined}
                className={cn(navLink, label, item === CURRENT && "underline")}
              >
                {item}
              </a>
            </li>
          ))}
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
            {NAV.map((item, index) => (
              <li key={item} className={cn(index > 0 && "mt-2")}>
                <a
                  href="#"
                  aria-current={item === CURRENT ? "page" : undefined}
                  className={cn(
                    navLink,
                    label,
                    item === CURRENT && "underline"
                  )}
                >
                  {item}
                </a>
              </li>
            ))}
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
      <h2 className={labelHeading}>Address</h2>
      <address className="mt-4 text-body not-italic">
        7 rue Belvèze
        <br />
        69001 Lyon
        <br />
        Second floor, with a lift
      </address>
      <p className="mt-4">
        <a href="#" className={textLink}>
          Open in a map
        </a>
      </p>

      <h2 className={cn(labelHeading, "mt-16")}>Hours</h2>
      <dl className="mt-4 border-b border-border">
        {[
          { days: "Tuesday to Friday", open: "10:00", close: "18:00" },
          { days: "Saturday", open: "10:00", close: "17:00" },
          { days: "Sunday and Monday" },
        ].map((row) => (
          <div
            key={row.days}
            className="grid grid-cols-1 border-t border-border py-4 lg:grid-cols-3 lg:items-baseline lg:gap-x-4"
          >
            <dt className={cn(label, "text-muted-foreground")}>{row.days}</dt>
            {row.open && row.close ? (
              <dd className="mt-2 font-mono text-body tabular-nums lg:col-span-2 lg:mt-0">
                <time dateTime={row.open}>{row.open}</time>–
                <time dateTime={row.close}>{row.close}</time>
              </dd>
            ) : (
              <dd className="mt-2 text-body lg:col-span-2 lg:mt-0">Closed</dd>
            )}
          </div>
        ))}
      </dl>

      <h2 className={cn(labelHeading, "mt-16")}>Questions</h2>
      <p className="mt-4 max-w-md text-body wrap-break-word">
        Write to{" "}
        <a href={`mailto:${EMAIL}`} className={textLink}>
          {EMAIL}
        </a>{" "}
        and a tailor will answer within a day.
      </p>
    </div>
  )
}

function Booking() {
  const [tomorrow] = React.useState(getTomorrow)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [time, setTime] = React.useState<string | null>(null)
  const [note, setNote] = React.useState("")
  const [errors, setErrors] = React.useState<Errors>({})
  const [booking, setBooking] = React.useState<Booking | null>(null)

  const nameRef = React.useRef<HTMLInputElement>(null)
  const confirmationRef = React.useRef<HTMLHeadingElement>(null)

  const hadBooking = React.useRef(false)

  // Focus follows the swap: to the confirmation's heading when it shows,
  // and back to the name field when the empty form returns.
  React.useEffect(() => {
    if (booking) {
      hadBooking.current = true
      confirmationRef.current?.focus()
    } else if (hadBooking.current) {
      hadBooking.current = false
      nameRef.current?.focus()
    }
  }, [booking])

  function clearError(...fields: Field[]) {
    setErrors((current) => {
      if (!fields.some((field) => current[field])) return current
      const next = { ...current }
      for (const field of fields) delete next[field]
      return next
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const found = validate(trimmedName, trimmedEmail, date, time)
    setErrors(found)
    const first = FIELD_ORDER.find((field) => found[field])
    if (first) {
      document.getElementById(first)?.focus()
      return
    }
    if (date && time) {
      setBooking({ date, time, email: trimmedEmail })
    }
  }

  function handleAnother() {
    setName("")
    setEmail("")
    setDate(undefined)
    setTime(null)
    setNote("")
    setErrors({})
    setBooking(null)
  }

  const describedBy = (field: Field) =>
    errors[field] ? `${field}-error` : undefined

  return (
    <div className="mt-16 md:col-span-7 md:col-start-6 md:mt-0">
      {!booking && (
        <form noValidate onSubmit={handleSubmit} className="bg-card p-8">
          <h2 className="text-h2">Book a fitting</h2>
          <p className="mt-4 max-w-md text-body">
            A tailor will confirm your fitting by email within a day.
          </p>

          <div className="mt-8">
            <label htmlFor="name" className={fieldLabel}>
              Your name
            </label>
            <Input
              ref={nameRef}
              id="name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                clearError("name")
              }}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describedBy("name")}
              className={inputClass}
            />
            {errors.name && (
              <ErrorLine id="name-error">{errors.name}</ErrorLine>
            )}
          </div>

          <div className="mt-8">
            <label htmlFor="email" className={fieldLabel}>
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                clearError("email")
              }}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy("email")}
              className={inputClass}
            />
            {errors.email && (
              <ErrorLine id="email-error">{errors.email}</ErrorLine>
            )}
          </div>

          <div className="mt-8 xl:grid xl:grid-cols-2 xl:gap-x-8">
            <div>
              <label id="date-label" htmlFor="date" className={fieldLabel}>
                Date
              </label>
              <DatePicker
                id="date"
                labelId="date-label"
                value={date}
                onValueChange={(value) => {
                  setDate(value)
                  setErrors((current) => {
                    if (!current.date && current.time !== SATURDAY_ERROR) {
                      return current
                    }
                    const next = { ...current }
                    delete next.date
                    if (next.time === SATURDAY_ERROR) delete next.time
                    return next
                  })
                }}
                disabled={{ before: tomorrow }}
                startMonth={tomorrow}
                aria-invalid={errors.date ? true : undefined}
                aria-describedby={describedBy("date")}
                className="mt-2"
              />
              {errors.date && (
                <ErrorLine id="date-error">{errors.date}</ErrorLine>
              )}
            </div>

            <div className="mt-8 xl:mt-0">
              <label id="time-label" htmlFor="time" className={fieldLabel}>
                Time
              </label>
              <Select
                value={time}
                onValueChange={(value) => {
                  if (value === null) return
                  setTime(value)
                  clearError("time")
                }}
              >
                <SelectTrigger
                  id="time"
                  aria-labelledby="time-label"
                  aria-invalid={errors.time ? true : undefined}
                  aria-describedby={describedBy("time")}
                  className="mt-2"
                >
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent>
                  {TIMES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.time && (
                <ErrorLine id="time-error">{errors.time}</ErrorLine>
              )}
            </div>
          </div>

          <div className="mt-8">
            <label htmlFor="note" className={fieldLabel}>
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
              value={note}
              onChange={(event) => setNote(event.target.value)}
              aria-describedby="note-help"
              className={cn(inputClass, "min-h-32 resize-none")}
            />
          </div>

          <Button
            type="submit"
            className={cn(buttonClass, "mt-8 w-full md:w-auto")}
          >
            Request a fitting
          </Button>
        </form>
      )}

      <div role="status">
        {booking && (
          <div className="bg-card p-8">
            <h2
              ref={confirmationRef}
              tabIndex={-1}
              className="text-h2 focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:outline-solid"
            >
              Your fitting is requested
            </h2>
            <p className="mt-4 max-w-md text-body wrap-break-word">
              <time dateTime={toDateTime(booking.date)}>
                {formatDate(booking.date)}
              </time>{" "}
              at <time dateTime={booking.time}>{booking.time}</time>. We will
              confirm to {booking.email} within a day.
            </p>
          </div>
        )}
      </div>

      {booking && (
        <Button
          variant="outline"
          onClick={handleAnother}
          className={cn(buttonClass, "mt-8")}
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
          <p className={cn(label, "text-muted-foreground md:col-span-12")}>
            Fittings · Lyon
          </p>
          <h1 className="mt-4 text-h1 md:col-span-9 md:text-display">
            Come to the <em>atelier</em>
          </h1>
          <p className="mt-8 max-w-md md:col-span-5 md:col-start-5">
            A fitting is an hour in the atelier with one of our tailors, to try
            on pieces from Autumn–Winter 2026, Still Water, or to be measured
            for a coat cut to order. It is free.
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
