import * as React from "react"
import { CircleAlert, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DatePicker, formatLongDate, toDateTime } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const LESSONS = [
  {
    value: "first-waves",
    name: "First Waves",
    price: 42,
    label: "First Waves · Beginners · £42 a person",
  },
  {
    value: "green-waves",
    name: "Green Waves",
    price: 55,
    label: "Green Waves · Improvers · £55 a person",
  },
  {
    value: "private-coaching",
    name: "Private Coaching",
    price: 85,
    label: "Private Coaching · Any level · £85 a person",
  },
]
const LESSON_ITEMS = LESSONS.map(({ value, label }) => ({ value, label }))

const ABILITY_ITEMS = [
  { value: "never", label: "Never surfed" },
  { value: "one-or-two", label: "One or two lessons" },
  { value: "white-water", label: "Catching white water waves alone" },
  { value: "unbroken", label: "Riding unbroken waves" },
]

const MIN_PEOPLE = 1
const MAX_PEOPLE = 4
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

type Confirmation = {
  name: string
  email: string
  lessonName: string
  date: Date
  people: number
  total: number
}

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const CODE_FOCUS =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const RUNNING_LINK = `text-foreground underline decoration-1 underline-offset-4 hover:decoration-2 ${FOCUS}`
const NAV_LINK = `inline-flex h-11 items-center font-mono text-label uppercase text-foreground underline-offset-4 hover:underline ${FOCUS}`
const BUTTON_CLASSES = "h-11 rounded-md px-6 font-mono text-label uppercase"
const INPUT_CLASSES =
  "h-11 rounded-md border-muted-foreground px-4 text-body md:text-body"
const FIELD_LABEL = "block font-mono text-label uppercase text-foreground"
const HELPER = "font-mono text-label text-muted-foreground"

function startOfToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function peopleText(count: number) {
  return count === 1 ? "1 person" : `${count} people`
}

function describedBy(...ids: (string | false | undefined)[]) {
  const list = ids.filter(Boolean)
  return list.length ? list.join(" ") : undefined
}

function ErrorLine({ id, children }: { id: string; children: string }) {
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
      {children}
    </p>
  )
}

function Header() {
  const links = [
    { label: "Lessons", href: "/lessons" },
    { label: "Forecast", href: "/forecast" },
    { label: "Guide", href: "/guide" },
    { label: "Book", href: "/booking", current: true },
  ]
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-[1248px] flex-wrap items-center gap-x-6 px-6 py-2">
        <a
          href="/"
          className={`inline-flex h-11 items-center font-heading text-h2 text-foreground ${FOCUS}`}
        >
          Sandhopper
        </a>
        <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
          <ul className="flex flex-wrap gap-x-6">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={link.current ? `${NAV_LINK} underline` : NAV_LINK}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1248px] flex-col gap-6 px-6 py-10 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-heading text-h2">Sandhopper Surf School</p>
          <p className="text-body">
            Surf lessons and kit hire at Pentarrow Sands since 2009.
          </p>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <p className="font-mono text-label uppercase text-muted-foreground">
            The Boat Shed · Beach Road · Pentarrow Sands · ZP7 3SB
          </p>
          <p className="text-body">
            <a href="tel:+441632960418" className={RUNNING_LINK}>
              01632 960 418
            </a>
            {" · "}
            <a href="mailto:hello@sandhopper.example" className={RUNNING_LINK}>
              hello@sandhopper.example
            </a>
          </p>
          <p className="font-mono text-label uppercase text-muted-foreground">
            Every day ·{" "}
            <span className="tabular-nums">
              <time dateTime="08:30">08:30</time>–
              <time dateTime="18:00">18:00</time>
            </span>{" "}
            · © 2027 Sandhopper Surf School
          </p>
        </div>
      </div>
    </footer>
  )
}

function BookingSection() {
  const [today] = React.useState(startOfToday)
  const [lesson, setLesson] = React.useState<string | null>(null)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [people, setPeople] = React.useState(1)
  const [ability, setAbility] = React.useState<string | null>(null)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [note, setNote] = React.useState("")
  const [errors, setErrors] = React.useState<Errors>({})
  const [submitCount, setSubmitCount] = React.useState(0)
  const [confirmation, setConfirmation] = React.useState<Confirmation | null>(
    null
  )

  const lessonRef = React.useRef<HTMLButtonElement>(null)
  const dateRef = React.useRef<HTMLButtonElement>(null)
  const abilityRef = React.useRef<HTMLButtonElement>(null)
  const nameRef = React.useRef<HTMLInputElement>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)
  const phoneRef = React.useRef<HTMLInputElement>(null)
  const confirmationHeading = React.useRef<HTMLHeadingElement>(null)

  const chosenLesson = LESSONS.find((item) => item.value === lesson)
  const total = chosenLesson ? chosenLesson.price * people : 0

  // After a send with errors, focus the first field that has one.
  React.useEffect(() => {
    if (submitCount === 0) return
    const refs = {
      lesson: lessonRef,
      date: dateRef,
      ability: abilityRef,
      name: nameRef,
      email: emailRef,
      phone: phoneRef,
    }
    const first = FIELD_ORDER.find((field) => errors[field])
    if (first) refs[first].current?.focus()
    // Runs once per send; the error lines are in the page by now.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount])

  React.useEffect(() => {
    if (confirmation) confirmationHeading.current?.focus()
  }, [confirmation])

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
    const next: Errors = {}

    if (!lesson) next.lesson = "Choose a lesson."
    if (!date) next.date = "Choose a date."
    else if (date < startOfToday()) next.date = "Choose today or a later date."
    if (!ability)
      next.ability = "Choose the closest match, so we can plan the lesson."
    if (!name.trim()) next.name = "Write your name."
    const trimmedEmail = email.trim()
    if (!trimmedEmail)
      next.email = "Write your email address, so we can send your start time."
    else if (!EMAIL_PATTERN.test(trimmedEmail))
      next.email = "Check the email address: it needs an @ and a domain."
    if (!phone.trim())
      next.phone = "Write a mobile number we can text on the day."
    else if (phone.replace(/\D/g, "").length < 10)
      next.phone = "Check the mobile number: it needs at least 10 digits."

    setErrors(next)
    if (Object.keys(next).length > 0 || !chosenLesson || !date) {
      setSubmitCount((count) => count + 1)
      return
    }

    setConfirmation({
      name: name.trim(),
      email: trimmedEmail,
      lessonName: chosenLesson.name,
      date,
      people,
      total,
    })
  }

  const helper = {
    date: "booking-date-help",
    people: "booking-people-help",
    ability: "booking-ability-help",
    email: "booking-email-help",
    phone: "booking-phone-help",
    note: "booking-note-help",
  }
  const errorId = (field: FieldName) => `booking-${field}-error`

  return (
    <section
      aria-labelledby="your-lesson"
      className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start md:gap-x-6"
    >
      <div className="flex flex-col gap-6 md:col-span-7">
        <h2 id="your-lesson" className="text-h2">
          Your lesson
        </h2>
        <div className="rounded-xl border border-border bg-card p-6">
          {!confirmation && (
            <form
              noValidate
              aria-label="Book a lesson"
              className="flex flex-col gap-6"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="booking-lesson" className={FIELD_LABEL}>
                  Lesson
                </label>
                <Select
                  items={LESSON_ITEMS}
                  value={lesson}
                  onValueChange={(value) => {
                    if (value === null) return
                    setLesson(value)
                    clearError("lesson")
                  }}
                >
                  <SelectTrigger
                    id="booking-lesson"
                    ref={lessonRef}
                    aria-invalid={errors.lesson ? true : undefined}
                    aria-describedby={describedBy(
                      errors.lesson && errorId("lesson")
                    )}
                  >
                    <SelectValue placeholder="Choose a lesson" />
                  </SelectTrigger>
                  <SelectContent>
                    {LESSON_ITEMS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.lesson && (
                  <ErrorLine id={errorId("lesson")}>{errors.lesson}</ErrorLine>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  id="booking-date-label"
                  htmlFor="booking-date"
                  className={FIELD_LABEL}
                >
                  Date
                </label>
                <DatePicker
                  id="booking-date"
                  labelId="booking-date-label"
                  ref={dateRef}
                  value={date}
                  min={today}
                  onValueChange={(value) => {
                    setDate(value)
                    clearError("date")
                  }}
                  aria-invalid={errors.date ? true : undefined}
                  aria-describedby={describedBy(
                    helper.date,
                    errors.date && errorId("date")
                  )}
                />
                <p id={helper.date} className={HELPER}>
                  We set the start time by the tide and email it to you the day
                  before.
                </p>
                {errors.date && (
                  <ErrorLine id={errorId("date")}>{errors.date}</ErrorLine>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <p
                  id="booking-people-label"
                  className="font-mono text-label uppercase text-foreground"
                >
                  People
                </p>
                <div
                  role="group"
                  aria-labelledby="booking-people-label"
                  aria-describedby={helper.people}
                  className="flex items-center gap-2"
                >
                  <Button
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
                    <Minus className="size-4" strokeWidth={2} aria-hidden="true" />
                  </Button>
                  <span
                    aria-live="polite"
                    className="inline-flex min-w-24 justify-center font-mono text-label uppercase text-foreground tabular-nums"
                  >
                    {peopleText(people)}
                  </span>
                  <Button
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
                    <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
                  </Button>
                </div>
                <p id={helper.people} className={HELPER}>
                  Up to 4 people online. For a bigger group, call 01632 960 418.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="booking-ability" className={FIELD_LABEL}>
                  Surfing so far
                </label>
                <Select
                  items={ABILITY_ITEMS}
                  value={ability}
                  onValueChange={(value) => {
                    if (value === null) return
                    setAbility(value)
                    clearError("ability")
                  }}
                >
                  <SelectTrigger
                    id="booking-ability"
                    ref={abilityRef}
                    aria-invalid={errors.ability ? true : undefined}
                    aria-describedby={describedBy(
                      helper.ability,
                      errors.ability && errorId("ability")
                    )}
                  >
                    <SelectValue placeholder="Choose the closest" />
                  </SelectTrigger>
                  <SelectContent>
                    {ABILITY_ITEMS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p id={helper.ability} className={HELPER}>
                  For a group, choose for the least experienced person.
                </p>
                {errors.ability && (
                  <ErrorLine id={errorId("ability")}>{errors.ability}</ErrorLine>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="booking-name" className={FIELD_LABEL}>
                  Your name
                </label>
                <Input
                  id="booking-name"
                  ref={nameRef}
                  autoComplete="name"
                  className={INPUT_CLASSES}
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value)
                    clearError("name")
                  }}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={describedBy(
                    errors.name && errorId("name")
                  )}
                />
                {errors.name && (
                  <ErrorLine id={errorId("name")}>{errors.name}</ErrorLine>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
                <div className="flex flex-col gap-2">
                  <label htmlFor="booking-email" className={FIELD_LABEL}>
                    Email address
                  </label>
                  <Input
                    id="booking-email"
                    ref={emailRef}
                    type="email"
                    autoComplete="email"
                    className={INPUT_CLASSES}
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      clearError("email")
                    }}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={describedBy(
                      helper.email,
                      errors.email && errorId("email")
                    )}
                  />
                  <p id={helper.email} className={HELPER}>
                    We send your start time here.
                  </p>
                  {errors.email && (
                    <ErrorLine id={errorId("email")}>{errors.email}</ErrorLine>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="booking-phone" className={FIELD_LABEL}>
                    Mobile phone
                  </label>
                  <Input
                    id="booking-phone"
                    ref={phoneRef}
                    type="tel"
                    autoComplete="tel"
                    className={INPUT_CLASSES}
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value)
                      clearError("phone")
                    }}
                    aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={describedBy(
                      helper.phone,
                      errors.phone && errorId("phone")
                    )}
                  />
                  <p id={helper.phone} className={HELPER}>
                    We text you if the sea changes our plans.
                  </p>
                  {errors.phone && (
                    <ErrorLine id={errorId("phone")}>{errors.phone}</ErrorLine>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="booking-note" className={FIELD_LABEL}>
                  A note for your coach (optional)
                </label>
                <Textarea
                  id="booking-note"
                  maxLength={300}
                  className="min-h-32 resize-none rounded-md border-muted-foreground px-4 py-2 text-body md:text-body"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  aria-describedby={helper.note}
                />
                <p id={helper.note} className={HELPER}>
                  An old injury, nerves, a birthday: anything that helps us
                  plan.
                </p>
              </div>

              <Button
                type="submit"
                className={`${BUTTON_CLASSES} w-full md:w-auto md:self-start`}
              >
                Book my lesson
              </Button>
            </form>
          )}
          <div role="status">
            {confirmation && (
              <div className="flex flex-col gap-4 text-foreground">
                <h3
                  ref={confirmationHeading}
                  tabIndex={-1}
                  className={`text-h2 ${CODE_FOCUS}`}
                >
                  Your places are held, {confirmation.name}
                </h3>
                <p className="max-w-xl">
                  We have {peopleText(confirmation.people)} down for{" "}
                  {confirmation.lessonName} on{" "}
                  <time dateTime={toDateTime(confirmation.date)}>
                    {formatLongDate(confirmation.date)}
                  </time>
                  . The total is £{confirmation.total}, to pay at the Boat Shed
                  on the day.
                </p>
                <p className="max-w-xl">
                  We will email your start time to {confirmation.email} by{" "}
                  <time dateTime="18:00" className="tabular-nums">
                    18:00
                  </time>{" "}
                  the day before. To change anything, call{" "}
                  <a href="tel:+441632960418" className={RUNNING_LINK}>
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
        aria-labelledby="your-booking"
        className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 md:sticky md:top-6 md:col-span-4 md:col-start-9"
      >
        <h2 id="your-booking" className="text-h2">
          Your booking
        </h2>
        <dl className="divide-y divide-border">
          <div className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
            <dt className="shrink-0 font-mono text-label uppercase text-muted-foreground">
              Lesson
            </dt>
            <dd className="min-w-0 text-right text-body text-foreground">
              {chosenLesson ? chosenLesson.name : "Not chosen yet"}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
            <dt className="shrink-0 font-mono text-label uppercase text-muted-foreground">
              Date
            </dt>
            <dd className="min-w-0 text-right text-body text-foreground">
              {date ? (
                <time dateTime={toDateTime(date)}>{formatLongDate(date)}</time>
              ) : (
                "Not chosen yet"
              )}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
            <dt className="shrink-0 font-mono text-label uppercase text-muted-foreground">
              People
            </dt>
            <dd className="min-w-0 text-right text-body text-foreground">
              {peopleText(people)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
            <dt className="shrink-0 font-mono text-label uppercase text-muted-foreground">
              Price
            </dt>
            <dd className="min-w-0 text-right text-body text-foreground tabular-nums">
              {chosenLesson ? `£${chosenLesson.price} a person` : "Not chosen yet"}
            </dd>
          </div>
        </dl>
        <div className="flex items-baseline justify-between gap-6 border-t border-border pt-4">
          <p className="font-mono text-label uppercase text-foreground">Total</p>
          <p className="font-heading text-h2 text-foreground tabular-nums">
            £{total}
          </p>
        </div>
        <p className="font-mono text-label text-muted-foreground">
          Wetsuit, board and coach included. Pay at the Boat Shed on the day, by
          card or cash.
        </p>
      </aside>
    </section>
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <Header />
      <main className="mx-auto flex max-w-[1248px] flex-col gap-24 px-6 pt-10 pb-24">
        <section
          aria-labelledby="page-title"
          className="flex flex-col gap-6 rounded-xl bg-lagoon p-6 text-lagoon-foreground md:p-10"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-label uppercase">
                Lessons every day · Pay on the day
              </p>
              <h1 id="page-title" className="text-h1 md:text-display">
                Book a lesson
              </h1>
            </div>
            <p className="max-w-xl text-body">
              Choose a lesson and a date, tell us who is coming, and we hold
              your places. It takes two minutes, and you pay at the Boat Shed
              on the day.
            </p>
          </div>
        </section>

        <BookingSection />

        <section aria-labelledby="what-happens-next" className="flex flex-col gap-6">
          <h2 id="what-happens-next" className="text-h2">
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
          aria-labelledby="weather-promise"
          className="flex flex-col gap-6 rounded-xl bg-coral p-6 text-coral-foreground md:p-10"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-label uppercase">
                Our weather promise
              </p>
              <h2 id="weather-promise" className="text-h2">
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
      <Footer />
    </div>
  )
}

export default App
