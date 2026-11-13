import * as React from "react"
import { flushSync } from "react-dom"
import { CircleAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatDate, getTomorrow, toDateTime } from "@/lib/dates"
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

const HOUSE = "Maison Ardelle"
const EMAIL = "atelier@maison-ardelle.example"
const TIMES = ["10:00", "11:30", "14:00", "15:30", "17:00"]
const SATURDAY_ERROR = "On Saturdays the last fitting is at 15:30."

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const TEXT_LINK = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  FOCUS
)
const NAV_LINK = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)
const LABEL = "font-mono text-label uppercase"
const LABEL_HEADING = "font-mono text-label uppercase text-foreground"
const FIELD_LABEL = "block font-mono text-label uppercase text-foreground"
const FIELD =
  "h-auto border-muted-foreground px-4 py-2 text-body md:text-body"
const BUTTON = "h-auto px-8 py-4 font-mono text-label font-normal uppercase"

const PAGES = ["Collection", "House", "Appointment"]
const CURRENT = "Appointment"

type Field = "name" | "email" | "date" | "time"
type Errors = Partial<Record<Field, string>>
type Booking = { date: Date; time: string; email: string }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ErrorLine({ id, message }: { id: string; message: string }) {
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

function SiteHeader() {
  return (
    <header className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
      <a href="/" className={cn("font-heading text-h2", NAV_LINK)}>
        {HOUSE}
      </a>
      <nav aria-label="Main">
        <ul className="flex flex-wrap gap-x-8 gap-y-2">
          {PAGES.map((page) => (
            <li key={page}>
              <a
                href="#"
                aria-current={page === CURRENT ? "page" : undefined}
                className={cn(LABEL, NAV_LINK, page === CURRENT && "underline")}
              >
                {page}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

function SiteFooter() {
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
            {PAGES.map((page, index) => (
              <li key={page} className={cn(index > 0 && "mt-2")}>
                <a
                  href="#"
                  aria-current={page === CURRENT ? "page" : undefined}
                  className={cn(
                    LABEL,
                    NAV_LINK,
                    page === CURRENT && "underline"
                  )}
                >
                  {page}
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

function Opening() {
  return (
    <section className="mt-16 grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
      <p className={cn(LABEL, "text-muted-foreground md:col-span-12")}>
        Fittings · Lyon
      </p>
      <h1 className="mt-4 text-h1 md:col-span-9 md:text-display">
        Come to the <em>atelier</em>
      </h1>
      <p className="mt-8 max-w-md md:col-span-5 md:col-start-5">
        A fitting is an hour in the atelier with one of our tailors, to try on
        the season’s pieces or to be measured for a coat. It is free.
      </p>
    </section>
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

      <h2 className={cn(LABEL_HEADING, "mt-16")}>Hours</h2>
      <dl className="mt-4 border-b border-border">
        {[
          { day: "Tuesday to Friday", open: "10:00", close: "18:00" },
          { day: "Saturday", open: "10:00", close: "17:00" },
          { day: "Sunday and Monday" },
        ].map((row) => (
          <div
            key={row.day}
            className="grid grid-cols-1 border-t border-border py-4 lg:grid-cols-3 lg:items-baseline lg:gap-x-4"
          >
            <dt className={cn(LABEL, "text-muted-foreground")}>{row.day}</dt>
            <dd
              className={cn(
                "mt-2 text-body lg:col-span-2 lg:mt-0",
                row.open && "font-mono tabular-nums"
              )}
            >
              {row.open && row.close ? (
                <>
                  <time dateTime={row.open}>{row.open}</time>–
                  <time dateTime={row.close}>{row.close}</time>
                </>
              ) : (
                "Closed"
              )}
            </dd>
          </div>
        ))}
      </dl>

      <h2 className={cn(LABEL_HEADING, "mt-16")}>Questions</h2>
      <p className="mt-4 max-w-md wrap-break-word">
        Write to{" "}
        <a href={`mailto:${EMAIL}`} className={TEXT_LINK}>
          {EMAIL}
        </a>{" "}
        and a tailor will answer within a day.
      </p>
    </div>
  )
}

function Booking() {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [time, setTime] = React.useState<string | null>(null)
  const [note, setNote] = React.useState("")
  const [errors, setErrors] = React.useState<Errors>({})
  const [booking, setBooking] = React.useState<Booking | null>(null)
  const [tomorrow, setTomorrow] = React.useState(getTomorrow)

  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const focusNext = React.useRef<"heading" | "name" | null>(null)

  React.useEffect(() => {
    if (focusNext.current === "heading") headingRef.current?.focus()
    if (focusNext.current === "name") document.getElementById("name")?.focus()
    focusNext.current = null
  }, [booking])

  function clearError(...fields: Field[]) {
    setErrors((current) => {
      const next = { ...current }
      for (const field of fields) delete next[field]
      return next
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextDay = getTomorrow()
    setTomorrow(nextDay)

    const next: Errors = {}
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName) next.name = "Write your name."
    if (!EMAIL_PATTERN.test(trimmedEmail))
      next.email = "Write an email address such as name@example.com."

    if (!date) next.date = "Choose a day."
    else if (date.getTime() < nextDay.getTime())
      next.date = "Choose a day from tomorrow on."
    else if (date.getDay() === 0 || date.getDay() === 1)
      next.date =
        "The atelier is closed on Sundays and Mondays. Choose another day."

    if (!time) next.time = "Choose a time."
    else if (date && date.getDay() === 6 && time === "17:00")
      next.time = SATURDAY_ERROR

    // Commit the error lines first, so the focused field already names its error.
    flushSync(() => setErrors(next))

    const first = (["name", "email", "date", "time"] as Field[]).find(
      (field) => next[field]
    )
    if (first) {
      document.getElementById(first)?.focus()
      return
    }

    focusNext.current = "heading"
    setBooking({ date: date!, time: time!, email: trimmedEmail })
  }

  function handleAnother() {
    setName("")
    setEmail("")
    setDate(undefined)
    setTime(null)
    setNote("")
    setErrors({})
    focusNext.current = "name"
    setBooking(null)
  }

  return (
    <div className="mt-16 md:col-span-7 md:col-start-6 md:mt-0">
      {!booking && (
        <form noValidate onSubmit={handleSubmit} className="bg-card p-8">
          <h2 className="text-h2">Book a fitting</h2>
          <p className="mt-4 max-w-md">
            A tailor will confirm your fitting by email within a day.
          </p>

          <div className="mt-8">
            <label htmlFor="name" className={FIELD_LABEL}>
              Your name
            </label>
            <Input
              id="name"
              autoComplete="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                clearError("name")
              }}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={cn(FIELD, "mt-2")}
            />
            {errors.name && <ErrorLine id="name-error" message={errors.name} />}
          </div>

          <div className="mt-8">
            <label htmlFor="email" className={FIELD_LABEL}>
              Email address
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                clearError("email")
              }}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={cn(FIELD, "mt-2")}
            />
            {errors.email && (
              <ErrorLine id="email-error" message={errors.email} />
            )}
          </div>

          <div className="mt-8 xl:grid xl:grid-cols-2 xl:gap-x-8">
            <div className="min-w-0">
              <label id="date-label" htmlFor="date" className={FIELD_LABEL}>
                Date
              </label>
              <DatePicker
                id="date"
                labelId="date-label"
                value={date}
                onValueChange={(value) => {
                  setDate(value)
                  if (errors.time === SATURDAY_ERROR) clearError("date", "time")
                  else clearError("date")
                }}
                disabled={{ before: tomorrow }}
                startMonth={tomorrow}
                aria-invalid={errors.date ? true : undefined}
                aria-describedby={errors.date ? "date-error" : undefined}
                className="mt-2"
              />
              {errors.date && (
                <ErrorLine id="date-error" message={errors.date} />
              )}
            </div>

            <div className="mt-8 min-w-0 xl:mt-0">
              <label id="time-label" htmlFor="time" className={FIELD_LABEL}>
                Time
              </label>
              <Select
                value={time}
                onValueChange={(value: string | null) => {
                  if (value === null) return
                  setTime(value)
                  clearError("time")
                }}
              >
                <SelectTrigger
                  id="time"
                  aria-labelledby="time-label"
                  aria-invalid={errors.time ? true : undefined}
                  aria-describedby={errors.time ? "time-error" : undefined}
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
                <ErrorLine id="time-error" message={errors.time} />
              )}
            </div>
          </div>

          <div className="mt-8">
            <label htmlFor="note" className={FIELD_LABEL}>
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
              value={note}
              onChange={(event) => setNote(event.target.value)}
              aria-describedby="note-help"
              className={cn(FIELD, "mt-2 min-h-32 resize-none")}
            />
          </div>

          <Button type="submit" className={cn(BUTTON, "mt-8 w-full md:w-auto")}>
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
              className="text-h2 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
            >
              Your fitting is requested
            </h2>
            <p className="mt-4 max-w-md wrap-break-word">
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
          className={cn(BUTTON, "mt-8")}
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
      <SiteHeader />
      <main>
        <Opening />
        <section className="mt-16 grid grid-cols-1 md:mt-32 md:grid-cols-12 md:gap-x-8">
          <Atelier />
          <Booking />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
