import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"
import { CircleAlert, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
const FIELD_CLASS = "mt-2 h-auto rounded-md px-4 py-2 text-body md:text-body"
const LABEL_CLASS = "block font-mono text-label text-foreground"
const HELP_CLASS = "mt-2 font-mono text-label text-muted-foreground"

const MIN_PEOPLE = 1
const MAX_PEOPLE = 8
const NOTE_MAX = 300
const DAYS_AHEAD = 60

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

// Every half hour from 9:30 to 16:00, as "09:30" values.
const TIMES: string[] = []
for (let minutes = 9 * 60 + 30; minutes <= 16 * 60; minutes += 30) {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0")
  const m = String(minutes % 60).padStart(2, "0")
  TIMES.push(`${h}:${m}`)
}

const NAV = [
  { label: "Menu", href: "/menu" },
  { label: "Book a table", href: "/booking", current: true },
  { label: "Journal", href: "/journal" },
  { label: "Visit", href: "/visit" },
]

type Field = "date" | "time" | "name" | "email"
type Errors = Partial<Record<Field, string>>
type Booking = {
  date: string
  time: string
  people: number
  name: string
  email: string
}

function toIso(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function fromIso(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function todayIso() {
  return toIso(new Date())
}

function maxIso() {
  const d = new Date()
  d.setDate(d.getDate() + DAYS_AHEAD)
  return toIso(d)
}

function formatDate(iso: string) {
  const d = fromIso(iso)
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function formatTime(value: string) {
  return value.replace(/^0/, "")
}

function peopleText(n: number) {
  return n === 1 ? "1 person" : `${n} people`
}

function isValidIsoDate(iso: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(iso) && !Number.isNaN(fromIso(iso).getTime())
  )
}

function validate(values: Booking): Errors {
  const errors: Errors = {}
  const today = todayIso()
  const max = maxIso()

  if (!values.date || !isValidIsoDate(values.date)) {
    errors.date = "Choose a date."
  } else if (values.date < today) {
    errors.date = "Choose today or a later date."
  } else if (values.date > max) {
    errors.date = "We take bookings up to 60 days ahead."
  } else if (fromIso(values.date).getDay() === 1) {
    errors.date = "We are closed on Mondays. Choose another day."
  }

  if (!values.time) errors.time = "Choose a time."

  if (!values.name.trim()) errors.name = "Write the name for the booking."

  const email = values.email.trim()
  if (!email) {
    errors.email = "Write your email address."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Check the email address: it needs an @ and a domain."
  }

  return errors
}

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

function DateText({ iso }: { iso: string }) {
  return <time dateTime={iso}>{formatDate(iso)}</time>
}

function TimeText({ value }: { value: string }) {
  return <time dateTime={value}>{formatTime(value)}</time>
}

function SummaryRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 first:pt-0">
      <dt className="font-mono text-label text-muted-foreground">{term}</dt>
      <dd className="min-w-0 text-right text-body wrap-anywhere text-foreground">
        {children}
      </dd>
    </div>
  )
}

function NotChosen() {
  return <span className="text-muted-foreground">Not chosen yet</span>
}

export function App() {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [people, setPeople] = useState(2)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [booked, setBooked] = useState<Booking | null>(null)

  const dateRef = useRef<HTMLInputElement>(null)
  const timeRef = useRef<HTMLSelectElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLHeadingElement>(null)

  const today = todayIso()
  const max = maxIso()

  useEffect(() => {
    if (booked) confirmRef.current?.focus()
  }, [booked])

  function clearError(field: Field) {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = { date, time, people, name, email }
    const found = validate(values)
    setErrors(found)

    const order: [Field, { current: HTMLElement | null }][] = [
      ["date", dateRef],
      ["time", timeRef],
      ["name", nameRef],
      ["email", emailRef],
    ]
    const first = order.find(([field]) => found[field])
    if (first) {
      first[1].current?.focus()
      return
    }
    setBooked({ ...values, name: name.trim(), email: email.trim() })
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
              room without a booking. A booked table is held for fifteen minutes
              after its time.
            </p>
          </div>
        </section>

        <section className="mt-18 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="rounded-xl border bg-card p-6 md:col-span-7">
            {!booked && (
              <form
                noValidate
                aria-label="Book a table"
                onSubmit={handleSubmit}
              >
                <div>
                  <label htmlFor="date" className={LABEL_CLASS}>
                    Date
                  </label>
                  <Input
                    ref={dateRef}
                    id="date"
                    type="date"
                    min={today}
                    max={max}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value)
                      clearError("date")
                    }}
                    aria-invalid={errors.date ? true : undefined}
                    aria-describedby={errors.date ? "date-error" : undefined}
                    className={FIELD_CLASS}
                  />
                  {errors.date && (
                    <ErrorLine id="date-error" message={errors.date} />
                  )}
                </div>

                <div className="mt-6">
                  <label htmlFor="time" className={LABEL_CLASS}>
                    Time
                  </label>
                  <select
                    ref={timeRef}
                    id="time"
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value)
                      clearError("time")
                    }}
                    aria-invalid={errors.time ? true : undefined}
                    aria-describedby={errors.time ? "time-error" : undefined}
                    className={cn(
                      "mt-2 h-auto w-full rounded-md border border-input bg-card px-4 py-2 text-body text-foreground aria-invalid:border-destructive",
                      FOCUS
                    )}
                  >
                    <option value="">Choose a time</option>
                    {TIMES.map((t) => (
                      <option key={t} value={t}>
                        {formatTime(t)}
                      </option>
                    ))}
                  </select>
                  {errors.time && (
                    <ErrorLine id="time-error" message={errors.time} />
                  )}
                </div>

                <div className="mt-6">
                  <p id="people-label" className={LABEL_CLASS}>
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
                        setPeople((n) => Math.max(MIN_PEOPLE, n - 1))
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
                      {peopleText(people)}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-md"
                      aria-label="More people"
                      disabled={people >= MAX_PEOPLE}
                      focusableWhenDisabled
                      onClick={() =>
                        setPeople((n) => Math.min(MAX_PEOPLE, n + 1))
                      }
                    >
                      <Plus
                        className="size-4"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                  <p className={HELP_CLASS}>
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
                  <label htmlFor="name" className={LABEL_CLASS}>
                    Name
                  </label>
                  <Input
                    ref={nameRef}
                    id="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      clearError("name")
                    }}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={FIELD_CLASS}
                  />
                  {errors.name && (
                    <ErrorLine id="name-error" message={errors.name} />
                  )}
                </div>

                <div className="mt-6">
                  <label htmlFor="email" className={LABEL_CLASS}>
                    Email address
                  </label>
                  <Input
                    ref={emailRef}
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      clearError("email")
                    }}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={
                      errors.email ? "email-help email-error" : "email-help"
                    }
                    className={FIELD_CLASS}
                  />
                  <p id="email-help" className={HELP_CLASS}>
                    We send the booking here, and nothing else.
                  </p>
                  {errors.email && (
                    <ErrorLine id="email-error" message={errors.email} />
                  )}
                </div>

                <div className="mt-6">
                  <label htmlFor="note" className={LABEL_CLASS}>
                    Note (optional)
                  </label>
                  <Textarea
                    id="note"
                    maxLength={NOTE_MAX}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    aria-describedby="note-count"
                    className={cn(FIELD_CLASS, "min-h-24")}
                  />
                  <p id="note-count" className={HELP_CLASS}>
                    {noteLeft === 1
                      ? "1 character left"
                      : `${noteLeft} characters left`}
                  </p>
                </div>

                <div className="mt-6">
                  <Button
                    type="submit"
                    className="h-auto rounded-md px-6 py-2 font-mono text-label"
                  >
                    Book the table
                  </Button>
                </div>
              </form>
            )}
            <div role="status">
              {booked && (
                <div>
                  <h2
                    ref={confirmRef}
                    tabIndex={-1}
                    className={cn("text-h2", CODE_FOCUS)}
                  >
                    Your table is booked
                  </h2>
                  <p className="mt-4">
                    A table for {peopleText(booked.people)} on{" "}
                    <DateText iso={booked.date} /> at{" "}
                    <TimeText value={booked.time} />, under the name{" "}
                    {booked.name}.
                  </p>
                  <p className="mt-4 wrap-anywhere">
                    We have sent the details to {booked.email}.
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
                {date && isValidIsoDate(date) ? (
                  <DateText iso={date} />
                ) : (
                  <NotChosen />
                )}
              </SummaryRow>
              <SummaryRow term="Time">
                {time ? <TimeText value={time} /> : <NotChosen />}
              </SummaryRow>
              <SummaryRow term="People">{peopleText(people)}</SummaryRow>
              <SummaryRow term="Name">
                {name.trim() ? name : <NotChosen />}
              </SummaryRow>
            </dl>
            <p className="mt-6 text-body">
              We hold the table for fifteen minutes, and you can change a
              booking by answering our email.
            </p>
          </aside>
        </section>

        <section className="mt-18 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="text-h2">Before you come</h2>
            <p className="mt-4 max-w-xl">
              The kitchen serves plates from <time dateTime="11:30">11:30</time>{" "}
              to <time dateTime="14:30">14:30</time>, with cakes and tea all
              day. When the room is full, the shop counter stays open for loose
              leaf and a cup to take away.
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
                A tea room and shop on Mill Lane, pouring loose-leaf tea since
                2014.
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

export default App
