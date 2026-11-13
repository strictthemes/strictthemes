import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"
import { CalendarDays, CircleAlert, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const CODE_FOCUS =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const TEXT_LINK = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  FOCUS
)
const NAV_LINK = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)
const BUTTON = "h-auto rounded-md px-6 py-2 font-mono text-label"
const FIELD = "mt-2 h-auto rounded-md px-4 py-2 text-body md:text-body"
const LABEL = "block font-mono text-label text-foreground"
const HELP = "mt-2 font-mono text-label text-muted-foreground"

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
const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

const MAX_DAYS = 60
const NOTE_MAX = 300
const MIN_PEOPLE = 1
const MAX_PEOPLE = 8

const TIMES = (() => {
  const list: { value: string; label: string }[] = []
  for (let minutes = 9 * 60 + 30; minutes <= 16 * 60; minutes += 30) {
    const h = Math.floor(minutes / 60)
    const m = String(minutes % 60).padStart(2, "0")
    list.push({
      value: `${String(h).padStart(2, "0")}:${m}`,
      label: `${h}:${m}`,
    })
  }
  return list
})()

function startOfToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

function isoDate(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${m}-${d}`
}

function longDate(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

function fullDate(date: Date) {
  return `${WEEKDAYS[date.getDay()]} ${longDate(date)}`
}

function timeLabel(value: string) {
  return TIMES.find((t) => t.value === value)?.label ?? value
}

function peopleLabel(count: number) {
  return `${count} ${count === 1 ? "person" : "people"}`
}

type Field = "date" | "time" | "name" | "email"
type Errors = Partial<Record<Field, string>>

type Booking = {
  date: Date
  time: string
  people: number
  name: string
  email: string
}

const NAV = [
  { label: "Menu", href: "/menu" },
  { label: "Book a table", href: "/booking", current: true },
  { label: "Journal", href: "/journal" },
  { label: "Visit", href: "/visit" },
]

function ErrorLine({ id, message }: { id: string; message: string }) {
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

export function App() {
  const today = startOfToday()
  const lastDay = addDays(today, MAX_DAYS)

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [dateOpen, setDateOpen] = useState(false)
  const [time, setTime] = useState<string | null>(null)
  const [people, setPeople] = useState(2)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [focusTarget, setFocusTarget] = useState<{ field: Field } | null>(null)
  const [booking, setBooking] = useState<Booking | null>(null)

  const dateRef = useRef<HTMLButtonElement>(null)
  const timeRef = useRef<HTMLButtonElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!focusTarget) return
    const refs = {
      date: dateRef,
      time: timeRef,
      name: nameRef,
      email: emailRef,
    }
    refs[focusTarget.field].current?.focus()
  }, [focusTarget])

  useEffect(() => {
    if (booking) confirmRef.current?.focus()
  }, [booking])

  function clearError(field: Field) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const now = startOfToday()
    const max = addDays(now, MAX_DAYS)
    const next: Errors = {}

    if (!date) next.date = "Choose a date."
    else if (date < now) next.date = "Choose today or a later date."
    else if (date > max) next.date = "We take bookings up to 60 days ahead."
    else if (date.getDay() === 1)
      next.date = "We are closed on Mondays. Choose another day."

    if (!time) next.time = "Choose a time."

    if (!name.trim()) next.name = "Write the name for the booking."

    const mail = email.trim()
    if (!mail) next.email = "Write your email address."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))
      next.email = "Check the email address: it needs an @ and a domain."

    setErrors(next)
    const order: Field[] = ["date", "time", "name", "email"]
    const first = order.find((field) => next[field])
    if (first) {
      setFocusTarget({ field: first })
      return
    }
    if (date && time) {
      setBooking({ date, time, people, name: name.trim(), email: mail })
    }
  }

  const noteLeft = NOTE_MAX - note.length

  return (
    <div className="mx-auto max-w-[1120px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn(NAV_LINK, "font-heading text-h2")}>
          The Linden Room
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={cn(
                    NAV_LINK,
                    "text-body",
                    item.current && "underline"
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="grid gap-6 pt-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="font-mono text-label text-muted-foreground">
              Tables for one to eight · Up to 60 days ahead
            </p>
            <h1 className="mt-2 text-h1">Book a table</h1>
            <p className="mt-4 max-w-xl">
              We keep half our tables for people who walk in, so there is often
              room without a booking. If you do book, we hold your table for
              fifteen minutes after the time you choose.
            </p>
          </div>
        </section>

        <section className="mt-18 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="rounded-xl border bg-card p-6 md:col-span-7">
            {!booking && (
              <form
                noValidate
                aria-label="Book a table"
                onSubmit={handleSubmit}
              >
                <div>
                  <label id="date-label" htmlFor="date" className={LABEL}>
                    Date
                  </label>
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger
                      id="date"
                      ref={dateRef}
                      aria-labelledby="date-label date-value"
                      aria-invalid={errors.date ? true : undefined}
                      aria-describedby={errors.date ? "date-error" : undefined}
                      className={cn(
                        "mt-2 flex w-full items-center justify-between gap-2 rounded-md border border-input bg-card px-4 py-2 text-left text-body text-foreground transition-colors outline-none focus-visible:border-ring aria-invalid:border-destructive",
                        FOCUS
                      )}
                    >
                      <span
                        id="date-value"
                        className={date ? undefined : "text-muted-foreground"}
                      >
                        {date ? (
                          <time dateTime={isoDate(date)}>{longDate(date)}</time>
                        ) : (
                          "Choose a date"
                        )}
                      </span>
                      <CalendarDays
                        className="size-4 shrink-0 text-muted-foreground"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-auto p-2 md:p-4"
                      initialFocus={() =>
                        calendarRef.current?.querySelector<HTMLButtonElement>(
                          'td button[tabindex="0"]'
                        ) ?? true
                      }
                    >
                      <div ref={calendarRef}>
                        <Calendar
                          mode="single"
                          required
                          weekStartsOn={1}
                          selected={date}
                          defaultMonth={date ?? today}
                          startMonth={today}
                          endMonth={lastDay}
                          disabled={[{ before: today }, { after: lastDay }]}
                          onSelect={(day) => {
                            setDate(day)
                            clearError("date")
                            setDateOpen(false)
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  {errors.date && (
                    <ErrorLine id="date-error" message={errors.date} />
                  )}
                </div>

                <div className="mt-6">
                  <label htmlFor="time" className={LABEL}>
                    Time
                  </label>
                  <Select
                    items={TIMES}
                    value={time}
                    onValueChange={(value) => {
                      if (value === null) return
                      setTime(value)
                      clearError("time")
                    }}
                  >
                    <SelectTrigger
                      id="time"
                      ref={timeRef}
                      className="mt-2"
                      aria-invalid={errors.time ? true : undefined}
                      aria-describedby={errors.time ? "time-error" : undefined}
                    >
                      <SelectValue placeholder="Choose a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.time && (
                    <ErrorLine id="time-error" message={errors.time} />
                  )}
                </div>

                <div className="mt-6">
                  <p
                    id="people-label"
                    className="font-mono text-label text-foreground"
                  >
                    Number of people
                  </p>
                  <div
                    role="group"
                    aria-labelledby="people-label"
                    className="mt-2 flex items-center gap-2"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-md"
                      aria-label="Fewer people"
                      disabled={people <= MIN_PEOPLE}
                      focusableWhenDisabled
                      onClick={() =>
                        setPeople((p) => Math.max(MIN_PEOPLE, p - 1))
                      }
                    >
                      <Minus
                        className="size-4"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </Button>
                    <span
                      aria-live="polite"
                      className="inline-flex min-w-24 justify-center font-mono text-label text-foreground tabular-nums"
                    >
                      {peopleLabel(people)}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-md"
                      aria-label="More people"
                      disabled={people >= MAX_PEOPLE}
                      focusableWhenDisabled
                      onClick={() =>
                        setPeople((p) => Math.min(MAX_PEOPLE, p + 1))
                      }
                    >
                      <Plus
                        className="size-4"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                  <p className={HELP}>
                    For nine or more, write to{" "}
                    <a
                      href="mailto:hello@lindenroom.example"
                      className={TEXT_LINK}
                    >
                      hello@lindenroom.example
                    </a>
                  </p>
                </div>

                <div className="mt-6">
                  <label htmlFor="name" className={LABEL}>
                    Name
                  </label>
                  <Input
                    id="name"
                    ref={nameRef}
                    autoComplete="name"
                    className={FIELD}
                    value={name}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    onChange={(event) => {
                      setName(event.target.value)
                      clearError("name")
                    }}
                  />
                  {errors.name && (
                    <ErrorLine id="name-error" message={errors.name} />
                  )}
                </div>

                <div className="mt-6">
                  <label htmlFor="email" className={LABEL}>
                    Email address
                  </label>
                  <Input
                    id="email"
                    ref={emailRef}
                    type="email"
                    autoComplete="email"
                    className={FIELD}
                    value={email}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={
                      errors.email ? "email-help email-error" : "email-help"
                    }
                    onChange={(event) => {
                      setEmail(event.target.value)
                      clearError("email")
                    }}
                  />
                  <p id="email-help" className={HELP}>
                    We send the booking here, and nothing else.
                  </p>
                  {errors.email && (
                    <ErrorLine id="email-error" message={errors.email} />
                  )}
                </div>

                <div className="mt-6">
                  <label htmlFor="note" className={LABEL}>
                    Note (optional)
                  </label>
                  <Textarea
                    id="note"
                    maxLength={NOTE_MAX}
                    className={cn(FIELD, "min-h-24 resize-none")}
                    value={note}
                    aria-describedby="note-count"
                    onChange={(event) => setNote(event.target.value)}
                  />
                  <p id="note-count" className={HELP}>
                    {noteLeft} {noteLeft === 1 ? "character" : "characters"}{" "}
                    left
                  </p>
                </div>

                <div className="mt-6">
                  <Button type="submit" className={BUTTON}>
                    Book the table
                  </Button>
                </div>
              </form>
            )}
            <div role="status">
              {booking && (
                <div>
                  <h2
                    ref={confirmRef}
                    tabIndex={-1}
                    className={cn("text-h2", CODE_FOCUS)}
                  >
                    Your table is booked
                  </h2>
                  <p className="mt-4 max-w-xl">
                    A table for {peopleLabel(booking.people)} on{" "}
                    <time dateTime={isoDate(booking.date)}>
                      {fullDate(booking.date)}
                    </time>{" "}
                    at{" "}
                    <time dateTime={booking.time}>
                      {timeLabel(booking.time)}
                    </time>
                    , under the name {booking.name}.
                  </p>
                  <p className="mt-4 max-w-xl">
                    We have sent the details to {booking.email}.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside
            aria-labelledby="summary-heading"
            className="rounded-xl border bg-card p-6 md:col-span-5 md:col-start-8"
          >
            <p className="font-mono text-label text-muted-foreground">
              Your booking
            </p>
            <h2 id="summary-heading" className="mt-2 text-h2">
              Summary
            </h2>
            <dl className="mt-6 divide-y">
              <SummaryRow term="Date">
                {date ? (
                  <time dateTime={isoDate(date)}>{fullDate(date)}</time>
                ) : null}
              </SummaryRow>
              <SummaryRow term="Time">
                {time ? <time dateTime={time}>{timeLabel(time)}</time> : null}
              </SummaryRow>
              <SummaryRow term="People">{peopleLabel(people)}</SummaryRow>
              <SummaryRow term="Name">{name.trim() || null}</SummaryRow>
            </dl>
            <p className="mt-6 text-body">
              We hold the table for fifteen minutes, and you can change a
              booking by answering the email we send.
            </p>
          </aside>
        </section>

        <section className="mt-18 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="text-h2">Before you come</h2>
            <p className="mt-4 max-w-xl">
              The kitchen serves plates from <time dateTime="11:30">11:30</time>{" "}
              to <time dateTime="14:30">14:30</time>, with tea and cake all day.
              The shop counter stays open while the room is full, so you can buy
              a pot to take home while you wait.
            </p>
            <p className="mt-4">
              <a href="/menu" className={TEXT_LINK}>
                See the menu
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-18">
        <div className="border-t py-10">
          <div className="grid gap-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">The Linden Room</p>
              <p className="mt-2 max-w-xl">
                A tea room and shop on Mill Lane, with loose-leaf tea, plates at
                lunch and cake from the oven.
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <address className="not-italic">
                <span className="block">14 Mill Lane</span>
                <span className="block">Ashby Wold</span>
                <span className="block">AW3 7LN</span>
              </address>
              <p className="mt-4 font-mono text-label text-muted-foreground">
                Tuesday to Sunday · Closed Mondays
              </p>
            </div>
          </div>
          <p className="mt-6 font-mono text-label text-muted-foreground">
            © 2026 The Linden Room
          </p>
        </div>
      </footer>
    </div>
  )
}

function SummaryRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 first:pt-0">
      <dt className="font-mono text-label text-muted-foreground">{term}</dt>
      <dd className="text-right text-body text-foreground">
        {children ?? (
          <span className="text-muted-foreground">Not chosen yet</span>
        )}
      </dd>
    </div>
  )
}

export default App
