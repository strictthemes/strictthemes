import * as React from "react"
import { CircleAlert, Minus, Plus } from "lucide-react"

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
import { formatLongDate, startOfToday, toDateTime } from "@/lib/dates"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusOutline =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const textLink = `text-foreground underline decoration-1 underline-offset-4 hover:decoration-2 ${focusOutline}`
const navLink = `inline-flex h-11 items-center font-mono text-label uppercase text-foreground underline-offset-4 hover:underline ${focusOutline}`
const fieldLabel = "block font-mono text-label uppercase text-foreground"
const helperText = "font-mono text-label text-muted-foreground"
const inputClasses =
  "h-11 rounded-md border-muted-foreground px-4 text-body md:text-body"

type LessonId = "first-waves" | "green-waves" | "private-coaching"

const LESSONS: Record<LessonId, { name: string; price: number }> = {
  "first-waves": { name: "First Waves", price: 42 },
  "green-waves": { name: "Green Waves", price: 55 },
  "private-coaching": { name: "Private Coaching", price: 85 },
}

const lessonItems: { value: LessonId; label: string }[] = [
  { value: "first-waves", label: "First Waves · Beginners · £42 a person" },
  { value: "green-waves", label: "Green Waves · Improvers · £55 a person" },
  {
    value: "private-coaching",
    label: "Private Coaching · Any level · £85 a person",
  },
]

const abilityItems = [
  { value: "never", label: "Never surfed" },
  { value: "few-lessons", label: "One or two lessons" },
  { value: "white-water", label: "Catching white water waves alone" },
  { value: "green-waves", label: "Riding unbroken waves" },
]

const MIN_PEOPLE = 1
const MAX_PEOPLE = 4

type FieldKey = "lesson" | "date" | "ability" | "name" | "email" | "phone"
type Errors = Partial<Record<FieldKey, string>>
const FIELD_ORDER: FieldKey[] = [
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
  lesson: string
  date: Date
  people: number
  total: number
}

function peopleText(count: number) {
  return count === 1 ? "1 person" : `${count} people`
}

function describedBy(...ids: (string | false | undefined)[]) {
  const list = ids.filter(Boolean).join(" ")
  return list || undefined
}

function ErrorLine({ id, message }: { id: string; message?: string }) {
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
      {message}
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
          className={`inline-flex h-11 items-center font-heading text-h2 text-foreground ${focusOutline}`}
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
                  className={link.current ? `${navLink} underline` : navLink}
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
            <a href="tel:+441632960418" className={textLink}>
              01632 960 418
            </a>
            {" · "}
            <a href="mailto:hello@sandhopper.example" className={textLink}>
              hello@sandhopper.example
            </a>
          </p>
          <p className="font-mono text-label uppercase tabular-nums text-muted-foreground">
            Every day · <time dateTime="08:30">08:30</time>–
            <time dateTime="18:00">18:00</time> · © 2027 Sandhopper Surf School
          </p>
        </div>
      </div>
    </footer>
  )
}

export function App() {
  const [lesson, setLesson] = React.useState<LessonId | null>(null)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [people, setPeople] = React.useState(MIN_PEOPLE)
  const [ability, setAbility] = React.useState<string | null>(null)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [note, setNote] = React.useState("")

  const [errors, setErrors] = React.useState<Errors>({})
  const [submitCount, setSubmitCount] = React.useState(0)
  const [booking, setBooking] = React.useState<Booking | null>(null)

  const lessonRef = React.useRef<HTMLButtonElement>(null)
  const dateRef = React.useRef<HTMLButtonElement>(null)
  const abilityRef = React.useRef<HTMLButtonElement>(null)
  const nameRef = React.useRef<HTMLInputElement>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)
  const phoneRef = React.useRef<HTMLInputElement>(null)
  const confirmationRef = React.useRef<HTMLHeadingElement>(null)

  const today = startOfToday()
  const price = lesson ? LESSONS[lesson].price : 0
  const total = price * people

  // After a send with errors, focus the first field with an error,
  // once its error line is in the page.
  React.useEffect(() => {
    if (submitCount === 0) return
    const refs: Record<FieldKey, React.RefObject<HTMLElement | null>> = {
      lesson: lessonRef,
      date: dateRef,
      ability: abilityRef,
      name: nameRef,
      email: emailRef,
      phone: phoneRef,
    }
    const first = FIELD_ORDER.find((key) => errors[key])
    if (first) refs[first].current?.focus()
    // Runs once per send, not on every error change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount])

  React.useEffect(() => {
    if (booking) confirmationRef.current?.focus()
  }, [booking])

  function clearError(key: FieldKey) {
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Errors = {}
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedPhone = phone.trim()

    if (!lesson) next.lesson = "Choose a lesson."
    if (!date) next.date = "Choose a date."
    else if (date < startOfToday()) next.date = "Choose today or a later date."
    if (!ability)
      next.ability = "Choose the closest match, so we can plan the lesson."
    if (!trimmedName) next.name = "Write your name."
    if (!trimmedEmail)
      next.email = "Write your email address, so we can send your start time."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail))
      next.email = "Check the email address: it needs an @ and a domain."
    if (!trimmedPhone)
      next.phone = "Write a mobile number we can text on the day."
    else if (trimmedPhone.replace(/\D/g, "").length < 10)
      next.phone = "Check the mobile number: it needs at least 10 digits."

    if (Object.keys(next).length > 0 || !lesson || !date) {
      setErrors(next)
      setSubmitCount((count) => count + 1)
      return
    }

    setErrors({})
    setBooking({
      name: trimmedName,
      email: trimmedEmail,
      lesson: LESSONS[lesson].name,
      date,
      people,
      total,
    })
  }

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

        <section
          aria-labelledby="your-lesson"
          className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start md:gap-x-6"
        >
          <div className="flex flex-col gap-6 md:col-span-7">
            <h2 id="your-lesson" className="text-h2">
              Your lesson
            </h2>
            <div className="rounded-xl border border-border bg-card p-6">
              {!booking && (
                <form
                  noValidate
                  aria-label="Book a lesson"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-2">
                    <label
                      id="lesson-label"
                      htmlFor="lesson"
                      className={fieldLabel}
                    >
                      Lesson
                    </label>
                    <Select
                      items={lessonItems}
                      value={lesson}
                      onValueChange={(value) => {
                        if (value === null) return
                        setLesson(value)
                        clearError("lesson")
                      }}
                    >
                      <SelectTrigger
                        ref={lessonRef}
                        id="lesson"
                        aria-labelledby="lesson-label"
                        aria-invalid={errors.lesson ? true : undefined}
                        aria-describedby={describedBy(
                          errors.lesson && "lesson-error"
                        )}
                      >
                        <SelectValue placeholder="Choose a lesson" />
                      </SelectTrigger>
                      <SelectContent>
                        {lessonItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorLine id="lesson-error" message={errors.lesson} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label id="date-label" htmlFor="date" className={fieldLabel}>
                      Date
                    </label>
                    <DatePicker
                      ref={dateRef}
                      id="date"
                      labelId="date-label"
                      value={date}
                      min={today}
                      onValueChange={(value) => {
                        setDate(value)
                        clearError("date")
                      }}
                      aria-invalid={errors.date ? true : undefined}
                      aria-describedby={describedBy(
                        "date-help",
                        errors.date && "date-error"
                      )}
                    />
                    <p id="date-help" className={helperText}>
                      We set the start time by the tide and email it to you the
                      day before.
                    </p>
                    <ErrorLine id="date-error" message={errors.date} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <p
                      id="people-label"
                      className="font-mono text-label uppercase text-foreground"
                    >
                      People
                    </p>
                    <div
                      role="group"
                      aria-labelledby="people-label"
                      aria-describedby="people-help"
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
                        <Minus
                          className="size-4"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </Button>
                      <span
                        aria-live="polite"
                        className="inline-flex min-w-24 justify-center font-mono text-label uppercase tabular-nums text-foreground"
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
                        <Plus
                          className="size-4"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                    <p id="people-help" className={helperText}>
                      Up to 4 people online. For a bigger group, call 01632 960
                      418.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      id="ability-label"
                      htmlFor="ability"
                      className={fieldLabel}
                    >
                      Surfing so far
                    </label>
                    <Select
                      items={abilityItems}
                      value={ability}
                      onValueChange={(value) => {
                        if (value === null) return
                        setAbility(value)
                        clearError("ability")
                      }}
                    >
                      <SelectTrigger
                        ref={abilityRef}
                        id="ability"
                        aria-labelledby="ability-label"
                        aria-invalid={errors.ability ? true : undefined}
                        aria-describedby={describedBy(
                          "ability-help",
                          errors.ability && "ability-error"
                        )}
                      >
                        <SelectValue placeholder="Choose the closest" />
                      </SelectTrigger>
                      <SelectContent>
                        {abilityItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p id="ability-help" className={helperText}>
                      For a group, choose for the least experienced person.
                    </p>
                    <ErrorLine id="ability-error" message={errors.ability} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className={fieldLabel}>
                      Your name
                    </label>
                    <Input
                      ref={nameRef}
                      id="name"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value)
                        clearError("name")
                      }}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={describedBy(
                        errors.name && "name-error"
                      )}
                      className={inputClasses}
                    />
                    <ErrorLine id="name-error" message={errors.name} />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className={fieldLabel}>
                        Email address
                      </label>
                      <Input
                        ref={emailRef}
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value)
                          clearError("email")
                        }}
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={describedBy(
                          "email-help",
                          errors.email && "email-error"
                        )}
                        className={inputClasses}
                      />
                      <p id="email-help" className={helperText}>
                        We send your start time here.
                      </p>
                      <ErrorLine id="email-error" message={errors.email} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="phone" className={fieldLabel}>
                        Mobile phone
                      </label>
                      <Input
                        ref={phoneRef}
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(event) => {
                          setPhone(event.target.value)
                          clearError("phone")
                        }}
                        aria-invalid={errors.phone ? true : undefined}
                        aria-describedby={describedBy(
                          "phone-help",
                          errors.phone && "phone-error"
                        )}
                        className={inputClasses}
                      />
                      <p id="phone-help" className={helperText}>
                        We text you if the sea changes our plans.
                      </p>
                      <ErrorLine id="phone-error" message={errors.phone} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="note" className={fieldLabel}>
                      A note for your coach (optional)
                    </label>
                    <Textarea
                      id="note"
                      maxLength={300}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      aria-describedby="note-help"
                      className="min-h-32 resize-none rounded-md border-muted-foreground px-4 py-2 text-body md:text-body"
                    />
                    <p id="note-help" className={helperText}>
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
                  <div className="flex flex-col gap-4">
                    <h3
                      ref={confirmationRef}
                      tabIndex={-1}
                      className={`text-h2 wrap-break-word ${codeFocusOutline}`}
                    >
                      Your places are held, {booking.name}
                    </h3>
                    <p className="max-w-xl text-body">
                      We have {peopleText(booking.people)} down for{" "}
                      {booking.lesson} on{" "}
                      <time dateTime={toDateTime(booking.date)}>
                        {formatLongDate(booking.date)}
                      </time>
                      . The total is £{booking.total}, to pay at the Boat Shed
                      on the day.
                    </p>
                    <p className="max-w-xl text-body wrap-break-word">
                      We will email your start time to {booking.email} by{" "}
                      <time dateTime="18:00">18:00</time> the day before. To
                      change anything, call{" "}
                      <a href="tel:+441632960418" className={textLink}>
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
                  {lesson ? LESSONS[lesson].name : "Not chosen yet"}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label uppercase text-muted-foreground">
                  Date
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground">
                  {date ? (
                    <time dateTime={toDateTime(date)}>
                      {formatLongDate(date)}
                    </time>
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
                <dd className="min-w-0 text-right text-body tabular-nums text-foreground">
                  {lesson ? `£${price} a person` : "Not chosen yet"}
                </dd>
              </div>
            </dl>
            <div className="flex items-baseline justify-between gap-6 border-t border-border pt-4">
              <p className="font-mono text-label uppercase text-foreground">
                Total
              </p>
              <p className="font-heading text-h2 tabular-nums text-foreground">
                £{total}
              </p>
            </div>
            <p className="font-mono text-label text-muted-foreground">
              Wetsuit, board and coach included. Pay at the Boat Shed on the
              day, by card or cash.
            </p>
          </aside>
        </section>

        <section aria-labelledby="next-steps" className="flex flex-col gap-6">
          <h2 id="next-steps" className="text-h2">
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
              <p className="max-w-xl text-body">
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
              <p className="max-w-xl text-body">
                By <time dateTime="18:00">18:00</time> the day before, we email
                your start time. The tide decides it: somewhere between{" "}
                <time dateTime="09:00">09:00</time> and{" "}
                <time dateTime="15:00">15:00</time>.
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
              <p className="max-w-xl text-body">
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
              We decide by <time dateTime="07:30">07:30</time> on the day
              whether the sea is safe. If we call your lesson off, you pick
              another date or get all of your money back.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App
