import { useEffect, useRef, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { CircleAlert, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const CONTAINER = "mx-auto max-w-[1088px] px-6"
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const CODE_FOCUS =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const TEXT_LINK = `text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground ${FOCUS}`
const NAV_LINK = `inline-flex h-11 items-center font-mono text-label text-foreground underline-offset-4 transition-colors duration-150 hover:underline ${FOCUS}`
const BUTTON = "h-11 rounded-md px-6 font-mono text-label"
const FIELD_LABEL = "block font-mono text-label text-foreground"
const GROUP_LABEL = "font-mono text-label text-foreground"
const HELPER = "font-mono text-label text-muted-foreground"
const FIELD = "h-11 rounded-md px-3 text-body md:text-body"

const MAIL = "hello@clemandrafe.example"
const NOTE_MAX = 300
const MIN_GUESTS = 1
const MAX_GUESTS = 4
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const NAV = [
  { label: "Reply", href: "/rsvp", current: true },
  { label: "Gifts", href: "/gifts", current: false },
  { label: "The day", href: "/day", current: false },
  { label: "Guestbook", href: "/guestbook", current: false },
]

const DINNERS = [
  "Roast chicken with tarragon",
  "Wild mushroom pie (vegetarian)",
  "Summer vegetable tart (vegan)",
  "Children's plate (under 12)",
]

type Choice = "none" | "coming" | "not-coming"
type FieldKey = "name" | "email" | "coming" | "dinner"
type Errors = Partial<Record<FieldKey, string>>
type Confirmation =
  | { kind: "coming"; name: string; email: string; guests: number; dinner: string }
  | { kind: "not-coming"; name: string }

function guestCount(count: number) {
  return count === 1 ? "1 guest" : `${count} guests`
}

function charactersLeft(count: number) {
  return count === 1 ? "1 character left" : `${count} characters left`
}

function ErrorLine({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      className="flex items-start gap-2 font-mono text-label text-destructive"
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

function MailLink() {
  return (
    <a href={`mailto:${MAIL}`} className={TEXT_LINK}>
      {MAIL}
    </a>
  )
}

function ReplyCard() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [choice, setChoice] = useState<Choice>("none")
  const [guests, setGuests] = useState(MIN_GUESTS)
  const [dinner, setDinner] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const yesRef = useRef<HTMLButtonElement>(null)
  const dinnerRef = useRef<HTMLButtonElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const pendingFocus = useRef<FieldKey | null>(null)

  // Focus moves after the render that adds the error lines.
  useEffect(() => {
    const key = pendingFocus.current
    if (!key) return
    pendingFocus.current = null
    const target = {
      name: nameRef,
      email: emailRef,
      coming: yesRef,
      dinner: dinnerRef,
    }[key]
    target.current?.focus()
  }, [errors])

  useEffect(() => {
    if (confirmation) headingRef.current?.focus()
  }, [confirmation])

  function clearError(key: FieldKey) {
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function choose(next: Choice) {
    setChoice(next)
    clearError("coming")
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const next: Errors = {}

    if (!trimmedName) {
      next.name = "Write your name, as it is on your invitation."
    }
    if (!trimmedEmail) {
      next.email = "Write your email address, so we can send you a copy."
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      next.email = "Check the email address: it needs an @ and a domain."
    }
    if (choice === "none") {
      next.coming = "Choose whether you can come."
    }
    if (choice === "coming" && dinner === null) {
      next.dinner = "Choose a dinner for yourself."
    }

    const order: FieldKey[] = ["name", "email", "coming", "dinner"]
    const first = order.find((key) => next[key])
    if (first) {
      pendingFocus.current = first
      setErrors(next)
      return
    }

    setErrors({})
    if (choice === "coming" && dinner !== null) {
      setConfirmation({
        kind: "coming",
        name: trimmedName,
        email: trimmedEmail,
        guests,
        dinner,
      })
    } else {
      setConfirmation({ kind: "not-coming", name: trimmedName })
    }
  }

  const coming = choice === "coming"
  const left = NOTE_MAX - note.length

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {confirmation === null && (
        <form
          noValidate
          aria-label="Your reply"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="reply-name" className={FIELD_LABEL}>
              Your name
            </label>
            <Input
              ref={nameRef}
              id="reply-name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                clearError("name")
              }}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={
                errors.name
                  ? "reply-name-help reply-name-error"
                  : "reply-name-help"
              }
              className={FIELD}
            />
            <p id="reply-name-help" className={HELPER}>
              As it is on your invitation
            </p>
            {errors.name && (
              <ErrorLine id="reply-name-error">{errors.name}</ErrorLine>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="reply-email" className={FIELD_LABEL}>
              Email address
            </label>
            <Input
              ref={emailRef}
              id="reply-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                clearError("email")
              }}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={
                errors.email
                  ? "reply-email-help reply-email-error"
                  : "reply-email-help"
              }
              className={FIELD}
            />
            <p id="reply-email-help" className={HELPER}>
              We send a copy of your reply here.
            </p>
            {errors.email && (
              <ErrorLine id="reply-email-error">{errors.email}</ErrorLine>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p id="reply-coming-label" className={GROUP_LABEL}>
              Are you coming?
            </p>
            <div
              role="group"
              aria-labelledby="reply-coming-label"
              aria-describedby={
                errors.coming ? "reply-coming-error" : undefined
              }
              className="flex flex-wrap gap-2"
            >
              <Button
                ref={yesRef}
                variant={coming ? "secondary" : "outline"}
                aria-pressed={coming}
                onClick={() => choose("coming")}
                className={BUTTON}
              >
                Yes, I will be there
              </Button>
              <Button
                variant={choice === "not-coming" ? "secondary" : "outline"}
                aria-pressed={choice === "not-coming"}
                onClick={() => choose("not-coming")}
                className={BUTTON}
              >
                Sorry, I cannot come
              </Button>
            </div>
            {errors.coming && (
              <ErrorLine id="reply-coming-error">{errors.coming}</ErrorLine>
            )}
          </div>

          {coming && (
            <div className="flex flex-col gap-2">
              <p id="reply-guests-label" className={GROUP_LABEL}>
                Guests, you included
              </p>
              <div
                role="group"
                aria-labelledby="reply-guests-label"
                aria-describedby="reply-guests-help"
                className="flex items-center gap-2"
              >
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Fewer guests"
                  disabled={guests <= MIN_GUESTS}
                  focusableWhenDisabled
                  onClick={() =>
                    setGuests((count) => Math.max(MIN_GUESTS, count - 1))
                  }
                  className="size-11 rounded-md"
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
                  {guestCount(guests)}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="More guests"
                  disabled={guests >= MAX_GUESTS}
                  focusableWhenDisabled
                  onClick={() =>
                    setGuests((count) => Math.min(MAX_GUESTS, count + 1))
                  }
                  className="size-11 rounded-md"
                >
                  <Plus
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </Button>
              </div>
              <p id="reply-guests-help" className={HELPER}>
                Your invitation is for up to 4 people.
              </p>
            </div>
          )}

          {coming && (
            <div className="flex flex-col gap-2">
              <label htmlFor="reply-dinner" className={FIELD_LABEL}>
                Your dinner
              </label>
              <Select
                value={dinner}
                onValueChange={(value) => {
                  if (value === null) return
                  setDinner(value)
                  clearError("dinner")
                }}
              >
                <SelectTrigger
                  ref={dinnerRef}
                  id="reply-dinner"
                  aria-invalid={errors.dinner ? true : undefined}
                  aria-describedby={
                    errors.dinner
                      ? "reply-dinner-help reply-dinner-error"
                      : "reply-dinner-help"
                  }
                >
                  <SelectValue placeholder="Choose a dinner" />
                </SelectTrigger>
                <SelectContent>
                  {DINNERS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p id="reply-dinner-help" className={HELPER}>
                If others come with you, tell us their dinners in the note.
              </p>
              {errors.dinner && (
                <ErrorLine id="reply-dinner-error">{errors.dinner}</ErrorLine>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="reply-note" className={FIELD_LABEL}>
              A note for Clem and Rafe (optional)
            </label>
            <Textarea
              id="reply-note"
              name="note"
              maxLength={NOTE_MAX}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              aria-describedby="reply-note-help"
              className="min-h-32 resize-none rounded-md px-3 py-2 text-body md:text-body"
            />
            <p id="reply-note-help" className={`${HELPER} tabular-nums`}>
              {charactersLeft(left)}
            </p>
          </div>

          <Button
            type="submit"
            className={`${BUTTON} w-full md:w-auto md:self-start`}
          >
            Send my reply
          </Button>
        </form>
      )}

      <div role="status">
        {confirmation?.kind === "coming" && (
          <div className="flex flex-col gap-3">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className={`text-h2 text-foreground ${CODE_FOCUS}`}
            >
              Thank you, {confirmation.name}
            </h3>
            <p className="max-w-xl text-body text-foreground">
              We have you down for {guestCount(confirmation.guests)} on{" "}
              <time dateTime="2027-07-17">Saturday 17 July 2027</time>, with{" "}
              {confirmation.dinner} for your dinner.
            </p>
            <p className="max-w-xl text-body wrap-break-word text-foreground">
              A copy is on its way to {confirmation.email}. To change anything
              before <time dateTime="2027-04-30">30 April</time>, write to{" "}
              <MailLink />.
            </p>
          </div>
        )}
        {confirmation?.kind === "not-coming" && (
          <div className="flex flex-col gap-3">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className={`text-h2 text-foreground ${CODE_FOCUS}`}
            >
              Thank you for letting us know
            </h3>
            <p className="max-w-xl text-body wrap-break-word text-foreground">
              We will miss you, {confirmation.name}. If your plans change
              before <time dateTime="2027-04-30">30 April</time>, write to{" "}
              <MailLink /> and we will make room.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div
          className={`${CONTAINER} flex flex-wrap items-center gap-x-6 gap-y-2 py-3`}
        >
          <a
            href="/"
            className={`inline-flex h-11 items-center font-heading text-h2 text-foreground ${FOCUS}`}
          >
            Clem &amp; Rafe
          </a>
          <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
            <ul className="flex flex-wrap gap-x-6">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={
                      item.current ? `${NAV_LINK} underline` : NAV_LINK
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className={`${CONTAINER} flex flex-col gap-22 pt-10 pb-22`}>
        <section
          aria-labelledby="opening-heading"
          className="flex flex-col gap-6 rounded-xl bg-mist p-6 text-mist-foreground md:p-10"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-label">
                Reply by <time dateTime="2027-04-30">Friday 30 April 2027</time>
              </p>
              <h1 id="opening-heading" className="text-h1 md:text-display">
                Will you come?
              </h1>
            </div>
            <p className="max-w-xl text-body">
              Tell us who is coming and what you would like for dinner. It
              takes a minute, and it helps us plan the tables and the
              minibuses.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="reply-heading"
          className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start md:gap-x-6"
        >
          <div className="flex flex-col gap-6 md:col-span-7">
            <h2 id="reply-heading" className="text-h2 text-foreground">
              Your reply
            </h2>
            <ReplyCard />
          </div>

          <aside
            aria-labelledby="day-heading"
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 md:col-span-4 md:col-start-9"
          >
            <h2 id="day-heading" className="text-h2 text-foreground">
              The day in short
            </h2>
            <dl className="divide-y divide-border">
              <div className="flex items-baseline justify-between gap-6 py-3 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label text-muted-foreground">
                  Date
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground">
                  <time dateTime="2027-07-17">Saturday 17 July 2027</time>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-3 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label text-muted-foreground">
                  Arrive
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground">
                  From{" "}
                  <time dateTime="13:30" className="tabular-nums">
                    13:30
                  </time>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-3 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label text-muted-foreground">
                  Ceremony
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground">
                  <time dateTime="14:00" className="tabular-nums">
                    14:00
                  </time>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-3 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label text-muted-foreground">
                  Place
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground">
                  Quillbrook Barn, Little Saltry
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-3 first:pt-0 last:pb-0">
                <dt className="shrink-0 font-mono text-label text-muted-foreground">
                  Reply by
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground">
                  <time dateTime="2027-04-30">Friday 30 April 2027</time>
                </dd>
              </div>
            </dl>
            <p className="max-w-xl text-body wrap-break-word text-foreground">
              Something the form does not ask? Write to <MailLink />.
            </p>
          </aside>
        </section>

        <section
          aria-labelledby="offline-heading"
          className="grid grid-cols-1 md:grid-cols-12"
        >
          <div className="flex flex-col gap-6 md:col-span-8 md:col-start-3">
            <h2 id="offline-heading" className="text-h2 text-foreground">
              Cannot reply online?
            </h2>
            <p className="max-w-xl text-body text-foreground">
              Clem&apos;s sister, Bea Ashdown, is keeping the list. Call her on{" "}
              <a href="tel:+441632960573" className={TEXT_LINK}>
                01632 960 573
              </a>{" "}
              or write to <MailLink />, and she will add you.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div
          className={`${CONTAINER} flex flex-col gap-3 py-10 md:flex-row md:items-center md:justify-between`}
        >
          <p className="font-heading text-h2 text-foreground">
            Clem &amp; Rafe
          </p>
          <div className="flex flex-col gap-2 md:items-end">
            <p className="font-mono text-label text-muted-foreground">
              <time dateTime="2027-07-17">Saturday 17 July 2027</time> ·
              Quillbrook Barn, Little Saltry
            </p>
            <p className="font-mono text-label text-muted-foreground">
              Questions: <MailLink />
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
