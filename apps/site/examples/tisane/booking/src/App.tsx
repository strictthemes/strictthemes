import * as React from "react"
import { flushSync } from "react-dom"
import { CalendarDays, CircleAlert, Minus, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
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

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)
const siteLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)
const fieldLabel = "block font-mono text-label text-foreground"
const fieldClass = "mt-2 h-auto rounded-md px-4 py-2 text-body md:text-body"
const buttonClass = "h-auto rounded-md px-6 py-2 font-mono text-label"

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Book a table", href: "/booking" },
  { label: "Journal", href: "/journal" },
  { label: "Visit", href: "/visit" },
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
const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

const MAX_PEOPLE = 8
const MIN_PEOPLE = 1
const NOTE_MAX = 300
const DAYS_AHEAD = 60

// Every half hour from 9:30 to 16:00.
const timeItems: { value: string; label: string }[] = []
for (let minutes = 9 * 60 + 30; minutes <= 16 * 60; minutes += 30) {
  const h = Math.floor(minutes / 60)
  const m = String(minutes % 60).padStart(2, "0")
  timeItems.push({ value: `${String(h).padStart(2, "0")}:${m}`, label: `${h}:${m}` })
}

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

function formatDate(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

function formatLongDate(date: Date) {
  return `${WEEKDAYS[date.getDay()]} ${formatDate(date)}`
}

function timeLabel(value: string) {
  return timeItems.find((item) => item.value === value)?.label ?? value
}

function peopleText(count: number) {
  return count === 1 ? "1 person" : `${count} people`
}

function charactersLeft(count: number) {
  return count === 1 ? "1 character left" : `${count} characters left`
}

function isWellFormedEmail(value: string) {
  if (/\s/.test(value)) return false
  const parts = value.split("@")
  if (parts.length !== 2) return false
  const [local, domain] = parts
  if (!local || !domain) return false
  const dot = domain.indexOf(".")
  return dot > 0 && dot < domain.length - 1
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

function FieldError({ id, message }: { id: string; message: string }) {
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

function TimeValue({ value }: { value: string }) {
  return <time dateTime={value}>{timeLabel(value)}</time>
}

function DateValue({ date, long = false }: { date: Date; long?: boolean }) {
  return (
    <time dateTime={isoDate(date)}>
      {long ? formatLongDate(date) : formatDate(date)}
    </time>
  )
}

export function App() {
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [dateOpen, setDateOpen] = React.useState(false)
  const [time, setTime] = React.useState<string | null>(null)
  const [people, setPeople] = React.useState(2)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [note, setNote] = React.useState("")
  const [errors, setErrors] = React.useState<Errors>({})
  const [booking, setBooking] = React.useState<Booking | null>(null)

  const dateRef = React.useRef<HTMLButtonElement>(null)
  const timeRef = React.useRef<HTMLButtonElement>(null)
  const nameRef = React.useRef<HTMLInputElement>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)
  const calendarRef = React.useRef<HTMLDivElement>(null)
  const confirmationRef = React.useRef<HTMLHeadingElement>(null)

  const today = startOfToday()
  const lastDay = addDays(today, DAYS_AHEAD)
  const trimmedName = name.trim()

  React.useEffect(() => {
    if (booking) confirmationRef.current?.focus()
  }, [booking])

  function clearError(field: Field) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const now = startOfToday()
    const max = addDays(now, DAYS_AHEAD)
    const next: Errors = {}

    if (!date) next.date = "Choose a date."
    else if (date < now) next.date = "Choose today or a later date."
    else if (date > max) next.date = "We take bookings up to 60 days ahead."
    else if (date.getDay() === 1)
      next.date = "We are closed on Mondays. Choose another day."

    if (!time) next.time = "Choose a time."

    const cleanName = name.trim()
    if (!cleanName) next.name = "Write the name for the booking."

    const cleanEmail = email.trim()
    if (!cleanEmail) next.email = "Write your email address."
    else if (!isWellFormedEmail(cleanEmail))
      next.email = "Check the email address: it needs an @ and a domain."

    flushSync(() => setErrors(next))

    if (next.date) return dateRef.current?.focus()
    if (next.time) return timeRef.current?.focus()
    if (next.name) return nameRef.current?.focus()
    if (next.email) return emailRef.current?.focus()

    if (date && time) {
      setBooking({ date, time, people, name: cleanName, email: cleanEmail })
    }
  }

  return (
    <div className="mx-auto max-w-[1120px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", siteLink)}>
          The Linden Room
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => {
              const current = link.href === "/booking"
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={cn("text-body", siteLink, current && "underline")}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>

      <main>
        <section className="grid grid-cols-1 gap-6 pt-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="font-mono text-label text-muted-foreground tabular-nums">
              Tables for one to eight · Up to 60 days ahead
            </p>
            <h1 className="mt-2 text-h1">Book a table</h1>
            <p className="mt-4 max-w-xl">
              We keep half of our tables for people who walk in, so there is
              often room on the day. A booked table is held for fifteen
              minutes after its time.
            </p>
          </div>
        </section>

        <section className="mt-18 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
          <div className="rounded-xl border bg-card p-6 md:col-span-7">
            {!booking && (
              <form noValidate aria-label="Book a table" onSubmit={handleSubmit}>
                <div>
                  <label id="date-label" htmlFor="date-trigger" className={fieldLabel}>
                    Date
                  </label>
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger
                      id="date-trigger"
                      ref={dateRef}
                      aria-labelledby="date-label date-value"
                      aria-invalid={errors.date ? true : undefined}
                      aria-describedby={errors.date ? "date-error" : undefined}
                      className={cn(
                        "mt-2 flex w-full items-center justify-between gap-2 rounded-md border border-input bg-card px-4 py-2 text-left text-body text-foreground transition-colors outline-none focus-visible:border-ring aria-invalid:border-destructive",
                        focusOutline
                      )}
                    >
                      <span
                        id="date-value"
                        className={date ? undefined : "text-muted-foreground"}
                      >
                        {date ? <DateValue date={date} /> : "Choose a date"}
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
                        calendarRef.current?.querySelector<HTMLElement>(
                          'td button[tabindex="0"]'
                        ) ?? null
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
                          onSelect={(day: Date) => {
                            setDate(day)
                            clearError("date")
                            setDateOpen(false)
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  {errors.date && <FieldError id="date-error" message={errors.date} />}
                </div>

                <div className="mt-6">
                  <label id="time-label" htmlFor="time-trigger" className={fieldLabel}>
                    Time
                  </label>
                  <Select
                    items={timeItems}
                    value={time}
                    onValueChange={(value) => {
                      if (value === null) return
                      setTime(value)
                      clearError("time")
                    }}
                  >
                    <SelectTrigger
                      id="time-trigger"
                      ref={timeRef}
                      aria-labelledby="time-label"
                      aria-invalid={errors.time ? true : undefined}
                      aria-describedby={errors.time ? "time-error" : undefined}
                      className="mt-2"
                    >
                      <SelectValue placeholder="Choose a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.time && <FieldError id="time-error" message={errors.time} />}
                </div>

                <div className="mt-6">
                  <p id="people-label" className="font-mono text-label text-foreground">
                    Number of people
                  </p>
                  <div
                    role="group"
                    aria-labelledby="people-label"
                    aria-describedby="people-help"
                    className="mt-2 flex items-center gap-2"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-md"
                      aria-label="Fewer people"
                      disabled={people <= MIN_PEOPLE}
                      focusableWhenDisabled
                      onClick={() => setPeople((n) => Math.max(MIN_PEOPLE, n - 1))}
                    >
                      <Minus className="size-4" strokeWidth={1.5} aria-hidden="true" />
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
                      onClick={() => setPeople((n) => Math.min(MAX_PEOPLE, n + 1))}
                    >
                      <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
                    </Button>
                  </div>
                  <p
                    id="people-help"
                    className="mt-2 font-mono text-label wrap-break-word text-muted-foreground"
                  >
                    For nine or more, write to{" "}
                    <a href="mailto:hello@lindenroom.example" className={textLink}>
                      hello@lindenroom.example
                    </a>
                  </p>
                </div>

                <div className="mt-6">
                  <label htmlFor="name" className={fieldLabel}>
                    Name
                  </label>
                  <Input
                    id="name"
                    ref={nameRef}
                    autoComplete="name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value)
                      clearError("name")
                    }}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={fieldClass}
                  />
                  {errors.name && <FieldError id="name-error" message={errors.name} />}
                </div>

                <div className="mt-6">
                  <label htmlFor="email" className={fieldLabel}>
                    Email address
                  </label>
                  <Input
                    id="email"
                    ref={emailRef}
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      clearError("email")
                    }}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={
                      errors.email ? "email-help email-error" : "email-help"
                    }
                    className={fieldClass}
                  />
                  <p id="email-help" className="mt-2 font-mono text-label text-muted-foreground">
                    We send the booking here, and nothing else.
                  </p>
                  {errors.email && (
                    <FieldError id="email-error" message={errors.email} />
                  )}
                </div>

                <div className="mt-6">
                  <label htmlFor="note" className={fieldLabel}>
                    Note (optional)
                  </label>
                  <Textarea
                    id="note"
                    value={note}
                    maxLength={NOTE_MAX}
                    onChange={(event) => setNote(event.target.value)}
                    aria-describedby="note-count"
                    className={cn(fieldClass, "min-h-24 resize-none")}
                  />
                  <p
                    id="note-count"
                    className="mt-2 font-mono text-label text-muted-foreground tabular-nums"
                  >
                    {charactersLeft(NOTE_MAX - note.length)}
                  </p>
                </div>

                <div className="mt-6">
                  <Button type="submit" className={buttonClass}>
                    Book the table
                  </Button>
                </div>
              </form>
            )}
            <div role="status">
              {booking && (
                <div>
                  <h2
                    ref={confirmationRef}
                    tabIndex={-1}
                    className="text-h2 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
                  >
                    Your table is booked
                  </h2>
                  <p className="mt-4 max-w-xl wrap-break-word">
                    A table for {peopleText(booking.people)} on{" "}
                    <DateValue date={booking.date} long /> at{" "}
                    <TimeValue value={booking.time} />, under the name{" "}
                    {booking.name}.
                  </p>
                  <p className="mt-4 max-w-xl wrap-break-word">
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
            <p className="font-mono text-label text-muted-foreground">Your booking</p>
            <h2 id="summary-heading" className="mt-2 text-h2">
              Summary
            </h2>
            <dl className="mt-6 divide-y">
              <SummaryRow term="Date" missing="Not chosen yet">
                {date && <DateValue date={date} long />}
              </SummaryRow>
              <SummaryRow term="Time" missing="Not chosen yet">
                {time && <TimeValue value={time} />}
              </SummaryRow>
              <SummaryRow term="People" missing="Not chosen yet">
                {peopleText(people)}
              </SummaryRow>
              <SummaryRow term="Name" missing="Not given yet">
                {trimmedName || null}
              </SummaryRow>
            </dl>
            <p className="mt-6 max-w-xl">
              We hold the table for fifteen minutes, and you can change the
              booking by answering the email we send.
            </p>
          </aside>
        </section>

        <section className="mt-18 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="text-h2">Before you come</h2>
            <p className="mt-4 max-w-xl">
              The kitchen serves plates from <time dateTime="11:30">11:30</time>{" "}
              to <time dateTime="14:30">14:30</time>, and the shop counter stays
              open for tea and cake to take away while the room is full.
            </p>
            <p className="mt-4">
              <a href="/menu" className={textLink}>
                See the menu
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-18">
        <div className="border-t py-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">The Linden Room</p>
              <p className="mt-2 max-w-xl">
                A tea room and shop on Mill Lane, with loose-leaf tea, cakes
                from our own oven and plates at lunch.
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
          <p className="mt-6 font-mono text-label text-muted-foreground tabular-nums">
            © 2026 The Linden Room
          </p>
        </div>
      </footer>
    </div>
  )
}

function SummaryRow({
  term,
  missing,
  children,
}: {
  term: string
  missing: string
  children: React.ReactNode
}) {
  const empty = children === null || children === undefined || children === false || children === ""
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 first:pt-0">
      <dt className="shrink-0 font-mono text-label text-muted-foreground">{term}</dt>
      <dd
        className={cn(
          "min-w-0 text-right text-body wrap-break-word tabular-nums",
          empty ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {empty ? missing : children}
      </dd>
    </div>
  )
}

export default App
