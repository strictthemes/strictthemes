import * as React from "react"
import { flushSync } from "react-dom"
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
import { formatLongDate, getTomorrow, toDateTime } from "@/lib/date"
import { cn } from "@/lib/utils"

const NAV_LINKS = ["Collection", "House", "Appointment"]
const CURRENT_PAGE = "Appointment"

const TIMES = ["10:00", "11:30", "14:00", "15:30", "17:00"]

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const SITE_LINK = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)

const TEXT_LINK = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  FOCUS
)

const LABEL = "font-mono text-label uppercase"
const LABEL_HEADING = "font-mono text-label text-foreground uppercase"
const FIELD_LABEL = "block font-mono text-label text-foreground uppercase"
const FIELD = "h-auto border-muted-foreground px-4 py-2 text-body md:text-body"

const DL_ROW =
  "grid grid-cols-1 border-t border-border py-4 lg:grid-cols-3 lg:items-baseline lg:gap-x-4"
const DL_TERM = "font-mono text-label text-muted-foreground uppercase"
const DL_VALUE = "mt-2 text-body lg:col-span-2 lg:mt-0"
const FIGURE = "font-mono tabular-nums"

type FieldName = "name" | "email" | "date" | "time"
type Errors = Partial<Record<FieldName, string>>

type Booking = {
  date: Date
  time: string
  email: string
}

const FIELD_ORDER: FieldName[] = ["name", "email", "date", "time"]

const SATURDAY_ERROR = "On Saturdays the last fitting is at 15:30."

function FieldError({ id, children }: { id: string; children: string }) {
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

function Hours({ from, to }: { from: string; to: string }) {
  return (
    <span className={FIGURE}>
      <time dateTime={from}>{from}</time>–<time dateTime={to}>{to}</time>
    </span>
  )
}

export function App() {
  const [tomorrow] = React.useState(getTomorrow)

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [time, setTime] = React.useState<string | null>(null)
  const [note, setNote] = React.useState("")
  const [errors, setErrors] = React.useState<Errors>({})
  const [booking, setBooking] = React.useState<Booking | null>(null)

  const confirmationRef = React.useRef<HTMLHeadingElement>(null)

  function clearError(field: FieldName) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleDateChange(value: Date) {
    setDate(value)
    setErrors((current) => {
      const next = { ...current }
      delete next.date
      // The Saturday error under the time field depends on the date too.
      if (next.time === SATURDAY_ERROR) delete next.time
      return next
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const next: Errors = {}
    const trimmedEmail = email.trim()

    if (name.trim() === "") {
      next.name = "Write your name."
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      next.email = "Write an email address such as name@example.com."
    }

    if (!date) {
      next.date = "Choose a day."
    } else if (date.getTime() < getTomorrow().getTime()) {
      next.date = "Choose a day from tomorrow on."
    } else if (date.getDay() === 0 || date.getDay() === 1) {
      next.date =
        "The atelier is closed on Sundays and Mondays. Choose another day."
    }

    if (!time) {
      next.time = "Choose a time."
    } else if (date && date.getDay() === 6 && time === "17:00") {
      next.time = SATURDAY_ERROR
    }

    const firstInvalid = FIELD_ORDER.find((field) => next[field])

    if (firstInvalid || !date || !time) {
      setErrors(next)
      if (firstInvalid) document.getElementById(firstInvalid)?.focus()
      return
    }

    flushSync(() => {
      setErrors({})
      setBooking({ date, time, email: trimmedEmail })
    })
    confirmationRef.current?.focus()
  }

  function handleReset() {
    flushSync(() => {
      setBooking(null)
      setName("")
      setEmail("")
      setDate(undefined)
      setTime(null)
      setNote("")
      setErrors({})
    })
    document.getElementById("name")?.focus()
  }

  return (
    <div className="mx-auto max-w-[1320px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn(SITE_LINK, "font-heading text-h2")}>
          Maison Ardelle
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  aria-current={link === CURRENT_PAGE ? "page" : undefined}
                  className={cn(
                    SITE_LINK,
                    LABEL,
                    link === CURRENT_PAGE && "underline"
                  )}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="mt-16 grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <p className={cn(LABEL, "text-muted-foreground md:col-span-12")}>
            Fittings · Lyon
          </p>
          <h1 className="mt-4 text-h1 md:col-span-9 md:text-display">
            Come to the <em>atelier</em>
          </h1>
          <p className="mt-8 max-w-md text-body md:col-span-5 md:col-start-5">
            A fitting is an hour in the atelier with one of our tailors, to try
            on the season&rsquo;s pieces or to be measured for a coat. It is
            free.
          </p>
        </section>

        <section className="mt-16 grid grid-cols-1 md:mt-32 md:grid-cols-12 md:gap-x-8">
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
              <div className={DL_ROW}>
                <dt className={DL_TERM}>Tuesday to Friday</dt>
                <dd className={DL_VALUE}>
                  <Hours from="10:00" to="18:00" />
                </dd>
              </div>
              <div className={DL_ROW}>
                <dt className={DL_TERM}>Saturday</dt>
                <dd className={DL_VALUE}>
                  <Hours from="10:00" to="17:00" />
                </dd>
              </div>
              <div className={DL_ROW}>
                <dt className={DL_TERM}>Sunday and Monday</dt>
                <dd className={DL_VALUE}>Closed</dd>
              </div>
            </dl>

            <h2 className={cn(LABEL_HEADING, "mt-16")}>Questions</h2>
            <p className="mt-4 max-w-md text-body">
              Write to{" "}
              <a
                href="mailto:atelier@maison-ardelle.example"
                className={cn(TEXT_LINK, "wrap-anywhere")}
              >
                atelier@maison-ardelle.example
              </a>{" "}
              and a tailor will answer.
            </p>
          </div>

          <div className="mt-16 md:col-span-7 md:col-start-6 md:mt-0">
            {!booking && (
              <form className="bg-card p-8" noValidate onSubmit={handleSubmit}>
                <h2 className="text-h2">Book a fitting</h2>
                <p className="mt-4 max-w-md text-body">
                  A tailor will confirm your fitting by email within a day.
                </p>

                <div className="mt-8">
                  <label htmlFor="name" className={FIELD_LABEL}>
                    Your name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value)
                      clearError("name")
                    }}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={cn("mt-2", FIELD)}
                  />
                  {errors.name && (
                    <FieldError id="name-error">{errors.name}</FieldError>
                  )}
                </div>

                <div className="mt-8">
                  <label htmlFor="email" className={FIELD_LABEL}>
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
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={cn("mt-2", FIELD)}
                  />
                  {errors.email && (
                    <FieldError id="email-error">{errors.email}</FieldError>
                  )}
                </div>

                <div className="mt-8 xl:grid xl:grid-cols-2 xl:gap-x-8">
                  <div>
                    <label
                      id="date-label"
                      htmlFor="date"
                      className={FIELD_LABEL}
                    >
                      Date
                    </label>
                    <DatePicker
                      id="date"
                      labelId="date-label"
                      value={date}
                      onValueChange={handleDateChange}
                      disabled={{ before: tomorrow }}
                      startMonth={tomorrow}
                      aria-invalid={errors.date ? true : undefined}
                      aria-describedby={errors.date ? "date-error" : undefined}
                      className="mt-2"
                    />
                    {errors.date && (
                      <FieldError id="date-error">{errors.date}</FieldError>
                    )}
                  </div>

                  <div className="mt-8 xl:mt-0">
                    <label htmlFor="time" className={FIELD_LABEL}>
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
                        className="mt-2"
                        aria-invalid={errors.time ? true : undefined}
                        aria-describedby={
                          errors.time ? "time-error" : undefined
                        }
                      >
                        <SelectValue
                          placeholder="Choose a time"
                          className={time ? FIGURE : undefined}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMES.map((choice) => (
                          <SelectItem
                            key={choice}
                            value={choice}
                            className={FIGURE}
                          >
                            {choice}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.time && (
                      <FieldError id="time-error">{errors.time}</FieldError>
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
                    name="note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    aria-describedby="note-help"
                    className={cn("mt-2 min-h-32 resize-none", FIELD)}
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-8 h-auto w-full px-8 py-4 font-mono text-label font-normal uppercase md:w-auto"
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
                  <p className="mt-4 max-w-md text-body wrap-anywhere">
                    <time dateTime={toDateTime(booking.date)}>
                      {formatLongDate(booking.date)}
                    </time>{" "}
                    at <time dateTime={booking.time}>{booking.time}</time>. We
                    will confirm to {booking.email} within a day.
                  </p>
                </div>
              )}
            </div>

            {booking && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="mt-8 h-auto px-8 py-4 font-mono text-label font-normal uppercase"
              >
                Book another fitting
              </Button>
            )}
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-border py-8 md:mt-32">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-4">
            <p className="font-heading text-h2">Maison Ardelle</p>
            <div className={cn(LABEL, "mt-2 text-muted-foreground")}>
              <p>7 rue Belvèze</p>
              <p>69001 Lyon</p>
            </div>
          </div>
          <nav
            aria-label="Footer"
            className="mt-8 md:col-span-4 md:col-start-9 md:mt-0"
          >
            <ul>
              {NAV_LINKS.map((link, index) => (
                <li key={link} className={index > 0 ? "mt-2" : undefined}>
                  <a
                    href="#"
                    aria-current={link === CURRENT_PAGE ? "page" : undefined}
                    className={cn(
                      SITE_LINK,
                      LABEL,
                      link === CURRENT_PAGE && "underline"
                    )}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={cn(LABEL, "mt-8 text-muted-foreground")}>
          © 2026 Maison Ardelle
        </p>
      </footer>
    </div>
  )
}

export default App
