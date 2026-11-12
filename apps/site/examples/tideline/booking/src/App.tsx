import { useEffect, useRef, useState } from "react"
import { CircleAlert, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const LESSONS = [
  { id: "first-waves", name: "First Waves", level: "Beginners", price: 42 },
  { id: "green-waves", name: "Green Waves", level: "Improvers", price: 55 },
  { id: "private", name: "Private Coaching", level: "Any level", price: 85 },
] as const

const ABILITIES = [
  "Never surfed",
  "One or two lessons",
  "Catching white water waves alone",
  "Riding unbroken waves",
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

const MIN_PEOPLE = 1
const MAX_PEOPLE = 4
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const FOCUS_FROM_CODE =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const LINK = cn(
  "text-foreground underline decoration-1 underline-offset-4 hover:decoration-2",
  FOCUS
)
const NAV_LINK = cn(
  "inline-flex h-11 items-center font-mono text-label text-foreground uppercase underline-offset-4 hover:underline",
  FOCUS
)
const LABEL = "block font-mono text-label uppercase text-foreground"
const HELPER = "font-mono text-label text-muted-foreground"
const INPUT =
  "h-11 rounded-md border-muted-foreground px-4 text-body md:text-body"
const SELECT = cn(
  "h-11 w-full rounded-md border border-muted-foreground bg-card px-4 text-body text-foreground aria-invalid:border-destructive",
  FOCUS
)

type FieldName = "lesson" | "date" | "ability" | "name" | "email" | "phone"
type Errors = Partial<Record<FieldName, string>>

const FIELD_ORDER: FieldName[] = [
  "lesson",
  "date",
  "ability",
  "name",
  "email",
  "phone",
]

type Booking = {
  name: string
  email: string
  lessonName: string
  date: string
  people: number
  total: number
}

function todayValue() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function formatDate(value: string) {
  const [y, m, d] = value.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  return `${WEEKDAYS[date.getDay()]} ${d} ${MONTHS[m - 1]} ${y}`
}

function peopleText(count: number) {
  return count === 1 ? "1 person" : `${count} people`
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p
      id={id}
      className="flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert
        className="size-4 shrink-0"
        strokeWidth={2}
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

export function App() {
  const [lesson, setLesson] = useState("")
  const [date, setDate] = useState("")
  const [people, setPeople] = useState(1)
  const [ability, setAbility] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [sendCount, setSendCount] = useState(0)
  const [booking, setBooking] = useState<Booking | null>(null)

  const fieldRefs = useRef<
    Partial<Record<FieldName, HTMLInputElement | HTMLSelectElement | null>>
  >({})
  const confirmationRef = useRef<HTMLHeadingElement>(null)

  const chosenLesson = LESSONS.find((item) => item.id === lesson)
  const total = chosenLesson ? chosenLesson.price * people : 0
  const today = todayValue()

  useEffect(() => {
    if (sendCount === 0) return
    const first = FIELD_ORDER.find((field) => errors[field])
    if (first) fieldRefs.current[first]?.focus()
    // Run only after a send, not when an error is cleared by typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendCount])

  useEffect(() => {
    if (booking) confirmationRef.current?.focus()
  }, [booking])

  function clearError(field: FieldName) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found: Errors = {}

    if (!lesson) found.lesson = "Choose a lesson."

    if (!date) found.date = "Choose a date."
    else if (date < todayValue()) found.date = "Choose today or a later date."

    if (!ability)
      found.ability = "Choose the closest match, so we can plan the lesson."

    if (!name.trim()) found.name = "Write your name."

    const trimmedEmail = email.trim()
    if (!trimmedEmail)
      found.email = "Write your email address, so we can send your start time."
    else if (!EMAIL_PATTERN.test(trimmedEmail))
      found.email = "Check the email address: it needs an @ and a domain."

    const trimmedPhone = phone.trim()
    const phoneDigits = trimmedPhone.replace(/\D/g, "")
    if (!trimmedPhone)
      found.phone = "Write a mobile number we can text on the day."
    else if (!/^[\d\s+-]+$/.test(trimmedPhone) || phoneDigits.length < 10)
      found.phone = "Check the mobile number: it needs at least 10 digits."

    setErrors(found)

    if (Object.keys(found).length > 0) {
      setSendCount((count) => count + 1)
      return
    }

    if (!chosenLesson) return
    setBooking({
      name: name.trim(),
      email: trimmedEmail,
      lessonName: chosenLesson.name,
      date,
      people,
      total: chosenLesson.price * people,
    })
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1248px] flex-wrap items-center gap-x-6 px-6 py-2">
          <a
            href="/"
            className={cn(
              "inline-flex h-11 items-center font-heading text-h2 text-foreground",
              FOCUS
            )}
          >
            Sandhopper
          </a>
          <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
            <ul className="flex flex-wrap gap-x-6">
              <li>
                <a href="/lessons" className={NAV_LINK}>
                  Lessons
                </a>
              </li>
              <li>
                <a href="/forecast" className={NAV_LINK}>
                  Forecast
                </a>
              </li>
              <li>
                <a href="/guide" className={NAV_LINK}>
                  Guide
                </a>
              </li>
              <li>
                <a
                  href="/booking"
                  aria-current="page"
                  className={cn(NAV_LINK, "underline")}
                >
                  Book
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1248px] flex-col gap-24 px-6 pt-10 pb-24">
        <section
          aria-labelledby="opening-heading"
          className="flex flex-col gap-6 rounded-xl bg-lagoon p-6 text-lagoon-foreground md:p-10"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-label uppercase">
                Lessons every day · Pay on the day
              </p>
              <h1 id="opening-heading" className="text-h1 md:text-display">
                Book a lesson
              </h1>
            </div>
            <p className="max-w-xl text-body">
              Choose a lesson and a date, tell us who is coming, and we hold
              your places. It takes two minutes, and you pay at the Boat Shed on
              the day.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="lesson-heading"
          className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start md:gap-x-6"
        >
          <div className="flex flex-col gap-6 md:col-span-7">
            <h2 id="lesson-heading" className="text-h2">
              Your lesson
            </h2>
            <div className="rounded-xl border border-border bg-card p-6">
              {!booking && (
                <form
                  noValidate
                  aria-label="Book a lesson"
                  className="flex flex-col gap-6"
                  onSubmit={handleSubmit}
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="lesson" className={LABEL}>
                      Lesson
                    </label>
                    <select
                      id="lesson"
                      ref={(el) => {
                        fieldRefs.current.lesson = el
                      }}
                      value={lesson}
                      onChange={(event) => {
                        setLesson(event.target.value)
                        clearError("lesson")
                      }}
                      aria-invalid={errors.lesson ? true : undefined}
                      aria-describedby={describedBy(
                        errors.lesson && "lesson-error"
                      )}
                      className={SELECT}
                    >
                      <option value="">Choose a lesson</option>
                      {LESSONS.map((item) => (
                        <option key={item.id} value={item.id}>
                          {`${item.name} · ${item.level} · £${item.price} a person`}
                        </option>
                      ))}
                    </select>
                    <FieldError id="lesson-error" message={errors.lesson} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="date" className={LABEL}>
                      Date
                    </label>
                    <Input
                      id="date"
                      type="date"
                      ref={(el) => {
                        fieldRefs.current.date = el
                      }}
                      min={today}
                      value={date}
                      onChange={(event) => {
                        setDate(event.target.value)
                        clearError("date")
                      }}
                      aria-invalid={errors.date ? true : undefined}
                      aria-describedby={describedBy(
                        "date-helper",
                        errors.date && "date-error"
                      )}
                      className={INPUT}
                    />
                    <p id="date-helper" className={HELPER}>
                      We set the start time by the tide and email it to you the
                      day before.
                    </p>
                    <FieldError id="date-error" message={errors.date} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <p
                      id="people-label"
                      className="font-mono text-label text-foreground uppercase"
                    >
                      People
                    </p>
                    <div
                      role="group"
                      aria-labelledby="people-label"
                      aria-describedby="people-helper"
                      className="flex items-center gap-2"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-11 rounded-md"
                        aria-label="Fewer people"
                        disabled={people <= MIN_PEOPLE}
                        focusableWhenDisabled
                        onClick={() =>
                          setPeople((count) => Math.max(MIN_PEOPLE, count - 1))
                        }
                      >
                        <Minus
                          className="size-4"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </Button>
                      <span
                        aria-live="polite"
                        className="inline-flex min-w-24 justify-center font-mono text-label text-foreground uppercase tabular-nums"
                      >
                        {peopleText(people)}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-11 rounded-md"
                        aria-label="More people"
                        disabled={people >= MAX_PEOPLE}
                        focusableWhenDisabled
                        onClick={() =>
                          setPeople((count) => Math.min(MAX_PEOPLE, count + 1))
                        }
                      >
                        <Plus
                          className="size-4"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                    <p id="people-helper" className={HELPER}>
                      Up to 4 people online. For a bigger group, call 01632 960
                      418.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="ability" className={LABEL}>
                      Surfing so far
                    </label>
                    <select
                      id="ability"
                      ref={(el) => {
                        fieldRefs.current.ability = el
                      }}
                      value={ability}
                      onChange={(event) => {
                        setAbility(event.target.value)
                        clearError("ability")
                      }}
                      aria-invalid={errors.ability ? true : undefined}
                      aria-describedby={describedBy(
                        "ability-helper",
                        errors.ability && "ability-error"
                      )}
                      className={SELECT}
                    >
                      <option value="">Choose the closest</option>
                      {ABILITIES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <p id="ability-helper" className={HELPER}>
                      For a group, choose for the least experienced person.
                    </p>
                    <FieldError id="ability-error" message={errors.ability} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className={LABEL}>
                      Your name
                    </label>
                    <Input
                      id="name"
                      autoComplete="name"
                      ref={(el) => {
                        fieldRefs.current.name = el
                      }}
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value)
                        clearError("name")
                      }}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={describedBy(
                        errors.name && "name-error"
                      )}
                      className={INPUT}
                    />
                    <FieldError id="name-error" message={errors.name} />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className={LABEL}>
                        Email address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        ref={(el) => {
                          fieldRefs.current.email = el
                        }}
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value)
                          clearError("email")
                        }}
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={describedBy(
                          "email-helper",
                          errors.email && "email-error"
                        )}
                        className={INPUT}
                      />
                      <p id="email-helper" className={HELPER}>
                        We send your start time here.
                      </p>
                      <FieldError id="email-error" message={errors.email} />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="phone" className={LABEL}>
                        Mobile phone
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        ref={(el) => {
                          fieldRefs.current.phone = el
                        }}
                        value={phone}
                        onChange={(event) => {
                          setPhone(event.target.value)
                          clearError("phone")
                        }}
                        aria-invalid={errors.phone ? true : undefined}
                        aria-describedby={describedBy(
                          "phone-helper",
                          errors.phone && "phone-error"
                        )}
                        className={INPUT}
                      />
                      <p id="phone-helper" className={HELPER}>
                        We text you if the sea changes our plans.
                      </p>
                      <FieldError id="phone-error" message={errors.phone} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="note" className={LABEL}>
                      A note for your coach (optional)
                    </label>
                    <Textarea
                      id="note"
                      maxLength={300}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      aria-describedby="note-helper"
                      className="min-h-32 rounded-md border-muted-foreground px-4 py-2 text-body md:text-body"
                    />
                    <p id="note-helper" className={HELPER}>
                      An old injury, nerves, a birthday: anything that helps us
                      plan.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full rounded-md px-6 font-mono text-label uppercase md:w-auto md:self-start"
                  >
                    Book my lesson
                  </Button>
                </form>
              )}
              <div role="status">
                {booking && (
                  <div className="flex flex-col gap-4 text-foreground">
                    <h3
                      ref={confirmationRef}
                      tabIndex={-1}
                      className={cn("text-h2", FOCUS_FROM_CODE)}
                    >
                      Your places are held, {booking.name}
                    </h3>
                    <p>
                      We have {peopleText(booking.people)} down for{" "}
                      {booking.lessonName} on{" "}
                      <time dateTime={booking.date}>
                        {formatDate(booking.date)}
                      </time>
                      . The total is £{booking.total}, to pay at the Boat Shed
                      on the day.
                    </p>
                    <p>
                      We will email your start time to {booking.email} by{" "}
                      <time dateTime="18:00" className="tabular-nums">
                        18:00
                      </time>{" "}
                      the day before. To change anything, call{" "}
                      <a href="tel:+441632960418" className={LINK}>
                        01632 960 418
                      </a>
                      .
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside
            aria-labelledby="summary-heading"
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 md:sticky md:top-6 md:col-span-4 md:col-start-9"
          >
            <h2 id="summary-heading" className="text-h2">
              Your booking
            </h2>
            <dl className="divide-y divide-border">
              <div className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label text-muted-foreground uppercase">
                  Lesson
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground">
                  {chosenLesson ? chosenLesson.name : "Not chosen yet"}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label text-muted-foreground uppercase">
                  Date
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground">
                  {date ? (
                    <time dateTime={date}>{formatDate(date)}</time>
                  ) : (
                    "Not chosen yet"
                  )}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label text-muted-foreground uppercase">
                  People
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground">
                  {peopleText(people)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label text-muted-foreground uppercase">
                  Price
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground tabular-nums">
                  {chosenLesson
                    ? `£${chosenLesson.price} a person`
                    : "Not chosen yet"}
                </dd>
              </div>
            </dl>
            <div className="flex items-baseline justify-between gap-6 border-t border-border pt-4">
              <p className="font-mono text-label text-foreground uppercase">
                Total
              </p>
              <p className="font-heading text-h2 text-foreground tabular-nums">
                £{total}
              </p>
            </div>
            <p className="font-mono text-label text-muted-foreground">
              Wetsuit, board and coach included. Pay at the Boat Shed on the
              day, by card or cash.
            </p>
          </aside>
        </section>

        <section aria-labelledby="next-heading" className="flex flex-col gap-6">
          <h2 id="next-heading" className="text-h2">
            What happens next
          </h2>
          <ol className="grid list-none grid-cols-1 gap-6 p-0 lg:grid-cols-3">
            <li className="flex flex-col gap-2 border-t border-border pt-4">
              <p
                aria-hidden="true"
                className="font-heading text-h1 text-foreground"
              >
                1
              </p>
              <h3 className="text-h2">We hold your places</h3>
              <p className="text-body">
                As soon as you send the form, your places are yours. Nothing is
                paid online.
              </p>
            </li>
            <li className="flex flex-col gap-2 border-t border-border pt-4">
              <p
                aria-hidden="true"
                className="font-heading text-h1 text-foreground"
              >
                2
              </p>
              <h3 className="text-h2">We set the time</h3>
              <p className="text-body">
                By{" "}
                <time dateTime="18:00" className="tabular-nums">
                  18:00
                </time>{" "}
                the day before, we email your start time. The tide decides it:
                somewhere between{" "}
                <time dateTime="09:00" className="tabular-nums">
                  09:00
                </time>{" "}
                and{" "}
                <time dateTime="15:00" className="tabular-nums">
                  15:00
                </time>
                .
              </p>
            </li>
            <li className="flex flex-col gap-2 border-t border-border pt-4">
              <p
                aria-hidden="true"
                className="font-heading text-h1 text-foreground"
              >
                3
              </p>
              <h3 className="text-h2">You come 20 minutes early</h3>
              <p className="text-body">
                Find us at the Boat Shed at the foot of the slipway. You pay, we
                fit your wetsuit, and we walk down to the water together.
              </p>
            </li>
          </ol>
        </section>

        <section
          aria-labelledby="promise-heading"
          className="flex flex-col gap-6 rounded-xl bg-coral p-6 text-coral-foreground md:p-10"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-label uppercase">
                Our weather promise
              </p>
              <h2 id="promise-heading" className="text-h2">
                If the sea says no, you choose
              </h2>
            </div>
            <p className="max-w-xl text-body">
              We decide by{" "}
              <time dateTime="07:30" className="tabular-nums">
                07:30
              </time>{" "}
              on the day whether the sea is safe. If we call your lesson off,
              you pick another date or get all of your money back.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-6 px-6 py-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="font-heading text-h2">Sandhopper Surf School</p>
            <p className="text-body">
              Surf lessons and kit hire at Pentarrow Sands since 2009.
            </p>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <p className="font-mono text-label text-muted-foreground uppercase">
              The Boat Shed · Beach Road · Pentarrow Sands · ZP7 3SB
            </p>
            <p className="text-body">
              <a href="tel:+441632960418" className={LINK}>
                01632 960 418
              </a>{" "}
              ·{" "}
              <a href="mailto:hello@sandhopper.example" className={LINK}>
                hello@sandhopper.example
              </a>
            </p>
            <p className="font-mono text-label text-muted-foreground uppercase">
              Every day ·{" "}
              <time dateTime="08:30" className="tabular-nums">
                08:30
              </time>
              –
              <time dateTime="18:00" className="tabular-nums">
                18:00
              </time>{" "}
              · © 2027 Sandhopper Surf School
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
