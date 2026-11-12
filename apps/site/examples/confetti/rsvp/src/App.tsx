import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const container = "mx-auto max-w-[1088px] px-6"
const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const textLink = `text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground ${focusRing}`
const navLink = `inline-flex h-11 items-center font-mono text-label text-foreground underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`
const buttonText = "h-11 rounded-md px-6 font-mono text-label"
const helper = "font-mono text-label text-muted-foreground"
const fieldLabel = "block font-mono text-label text-foreground"

const DINNERS = [
  "Roast chicken with tarragon",
  "Wild mushroom pie (vegetarian)",
  "Summer vegetable tart (vegan)",
  "Children's plate (under 12)",
]

const MIN_GUESTS = 1
const MAX_GUESTS = 4
const NOTE_MAX = 300
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Choice = "none" | "yes" | "no"
type FieldKey = "name" | "email" | "choice" | "dinner"
type Errors = Partial<Record<FieldKey, string>>

type Sent = {
  name: string
  email: string
  choice: "yes" | "no"
  guests: number
  dinner: string
}

function guestsLabel(count: number) {
  return `${count} ${count === 1 ? "guest" : "guests"}`
}

function charactersLeft(count: number) {
  return `${count} ${count === 1 ? "character" : "characters"} left`
}

function ErrorLine({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="flex items-start gap-2 font-mono text-label text-destructive">
      <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      <span>{message}</span>
    </p>
  )
}

const navItems = [
  { label: "Reply", href: "/rsvp", current: true },
  { label: "Gifts", href: "/gifts", current: false },
  { label: "The day", href: "/day", current: false },
  { label: "Guestbook", href: "/guestbook", current: false },
]

function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className={`${container} flex flex-wrap items-center gap-x-6 gap-y-2 py-3`}>
        <a
          href="/"
          className={`inline-flex h-11 items-center font-heading text-h2 text-foreground ${focusRing}`}
        >
          Clem &amp; Rafe
        </a>
        <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
          <ul className="flex flex-wrap gap-x-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={item.current ? `${navLink} underline` : navLink}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div
        className={`${container} flex flex-col gap-3 py-10 md:flex-row md:items-center md:justify-between`}
      >
        <p className="font-heading text-h2">Clem &amp; Rafe</p>
        <div className="flex flex-col gap-2 md:items-end">
          <p className={helper}>
            <time dateTime="2027-07-17">Saturday 17 July 2027</time> · Quillbrook
            Barn, Little Saltry
          </p>
          <p className={helper}>
            Questions:{" "}
            <a href="mailto:hello@clemandrafe.example" className={textLink}>
              hello@clemandrafe.example
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

function ReplyForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [choice, setChoice] = useState<Choice>("none")
  const [guests, setGuests] = useState(MIN_GUESTS)
  const [dinner, setDinner] = useState("")
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [focusRequest, setFocusRequest] = useState<{ field: FieldKey } | null>(null)
  const [sent, setSent] = useState<Sent | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const yesRef = useRef<HTMLButtonElement>(null)
  const dinnerRef = useRef<HTMLSelectElement>(null)
  const confirmationRef = useRef<HTMLHeadingElement>(null)

  // Focus the first field with an error once its error line is in the page.
  useEffect(() => {
    if (!focusRequest) return
    const targets = {
      name: nameRef,
      email: emailRef,
      choice: yesRef,
      dinner: dinnerRef,
    }
    targets[focusRequest.field].current?.focus()
  }, [focusRequest])

  // Move focus to the confirmation once it replaces the form.
  useEffect(() => {
    if (sent) confirmationRef.current?.focus()
  }, [sent])

  function clearError(field: FieldKey) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Errors = {}
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName) {
      next.name = "Write your name, as it is on your invitation."
    }
    if (!trimmedEmail) {
      next.email = "Write your email address, so we can send you a copy."
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      next.email = "Check the email address: it needs an @ and a domain."
    }
    if (choice === "none") {
      next.choice = "Choose whether you can come."
    }
    if (choice === "yes" && !dinner) {
      next.dinner = "Choose a dinner for yourself."
    }

    setErrors(next)
    const order: FieldKey[] = ["name", "email", "choice", "dinner"]
    const first = order.find((field) => next[field])
    if (first) {
      setFocusRequest({ field: first })
      return
    }

    setSent({
      name: trimmedName,
      email: trimmedEmail,
      choice: choice as "yes" | "no",
      guests,
      dinner,
    })
  }

  function choose(value: "yes" | "no") {
    setChoice(value)
    clearError("choice")
  }

  const nameDescribedBy = errors.name ? "name-help name-error" : "name-help"
  const emailDescribedBy = errors.email ? "email-help email-error" : "email-help"
  const dinnerDescribedBy = errors.dinner ? "dinner-help dinner-error" : "dinner-help"
  const coming = choice === "yes"

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {!sent && (
        <form
          noValidate
          aria-label="Your reply"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
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
              aria-describedby={nameDescribedBy}
              className="h-11 rounded-md px-3 text-body md:text-body"
            />
            <p id="name-help" className={helper}>
              As it is on your invitation
            </p>
            {errors.name && <ErrorLine id="name-error" message={errors.name} />}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={fieldLabel}>
              Email address
            </label>
            <Input
              ref={emailRef}
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
              aria-describedby={emailDescribedBy}
              className="h-11 rounded-md px-3 text-body md:text-body"
            />
            <p id="email-help" className={helper}>
              We send a copy of your reply here.
            </p>
            {errors.email && <ErrorLine id="email-error" message={errors.email} />}
          </div>

          <div className="flex flex-col gap-2">
            <p id="choice-label" className="font-mono text-label text-foreground">
              Are you coming?
            </p>
            <div
              role="group"
              aria-labelledby="choice-label"
              aria-describedby={errors.choice ? "choice-error" : undefined}
              className="flex flex-wrap gap-2"
            >
              <Button
                ref={yesRef}
                aria-pressed={choice === "yes"}
                variant={choice === "yes" ? "secondary" : "outline"}
                className={buttonText}
                onClick={() => choose("yes")}
              >
                Yes, I will be there
              </Button>
              <Button
                aria-pressed={choice === "no"}
                variant={choice === "no" ? "secondary" : "outline"}
                className={buttonText}
                onClick={() => choose("no")}
              >
                Sorry, I cannot come
              </Button>
            </div>
            {errors.choice && <ErrorLine id="choice-error" message={errors.choice} />}
          </div>

          {coming && (
            <div className="flex flex-col gap-2">
              <p id="guests-label" className="font-mono text-label text-foreground">
                Guests, you included
              </p>
              <div
                role="group"
                aria-labelledby="guests-label"
                aria-describedby="guests-help"
                className="flex items-center gap-2"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="size-11 rounded-md"
                  aria-label="Fewer guests"
                  disabled={guests <= MIN_GUESTS}
                  focusableWhenDisabled
                  onClick={() => setGuests((count) => Math.max(MIN_GUESTS, count - 1))}
                >
                  <Minus className="size-4" strokeWidth={1.5} aria-hidden="true" />
                </Button>
                <span
                  aria-live="polite"
                  className="inline-flex min-w-24 justify-center font-mono text-label text-foreground tabular-nums"
                >
                  {guestsLabel(guests)}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-11 rounded-md"
                  aria-label="More guests"
                  disabled={guests >= MAX_GUESTS}
                  focusableWhenDisabled
                  onClick={() => setGuests((count) => Math.min(MAX_GUESTS, count + 1))}
                >
                  <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
                </Button>
              </div>
              <p id="guests-help" className={helper}>
                Your invitation is for up to 4 people.
              </p>
            </div>
          )}

          {coming && (
            <div className="flex flex-col gap-2">
              <label htmlFor="dinner" className={fieldLabel}>
                Your dinner
              </label>
              <select
                ref={dinnerRef}
                id="dinner"
                name="dinner"
                value={dinner}
                onChange={(event) => {
                  setDinner(event.target.value)
                  clearError("dinner")
                }}
                aria-invalid={errors.dinner ? true : undefined}
                aria-describedby={dinnerDescribedBy}
                className={`h-11 w-full rounded-md border border-input bg-card px-3 text-body text-foreground aria-invalid:border-destructive ${focusRing}`}
              >
                <option value="">Choose a dinner</option>
                {DINNERS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <p id="dinner-help" className={helper}>
                If others come with you, tell us their dinners in the note.
              </p>
              {errors.dinner && <ErrorLine id="dinner-error" message={errors.dinner} />}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="note" className={fieldLabel}>
              A note for Clem and Rafe (optional)
            </label>
            <Textarea
              id="note"
              name="note"
              maxLength={NOTE_MAX}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              aria-describedby="note-help"
              className="min-h-32 rounded-md px-3 py-2 text-body md:text-body"
            />
            <p id="note-help" className={helper}>
              {charactersLeft(NOTE_MAX - note.length)}
            </p>
          </div>

          <Button type="submit" className={`${buttonText} w-full md:w-auto md:self-start`}>
            Send my reply
          </Button>
        </form>
      )}

      <div role="status">
        {sent && (
          <div className="flex flex-col gap-3 text-foreground">
            {sent.choice === "yes" ? (
              <>
                <h3 ref={confirmationRef} tabIndex={-1} className={`text-h2 ${codeFocusRing}`}>
                  Thank you, {sent.name}
                </h3>
                <p className="max-w-xl">
                  We have you down for {guestsLabel(sent.guests)} on{" "}
                  <time dateTime="2027-07-17">Saturday 17 July 2027</time>, with{" "}
                  {sent.dinner} for your dinner.
                </p>
                <p className="max-w-xl">
                  A copy is on its way to {sent.email}. To change anything before{" "}
                  <time dateTime="2027-04-30">30 April</time>, write to{" "}
                  <a href="mailto:hello@clemandrafe.example" className={textLink}>
                    hello@clemandrafe.example
                  </a>
                  .
                </p>
              </>
            ) : (
              <>
                <h3 ref={confirmationRef} tabIndex={-1} className={`text-h2 ${codeFocusRing}`}>
                  Thank you for letting us know
                </h3>
                <p className="max-w-xl">
                  We will miss you, {sent.name}. If your plans change before{" "}
                  <time dateTime="2027-04-30">30 April</time>, write to{" "}
                  <a href="mailto:hello@clemandrafe.example" className={textLink}>
                    hello@clemandrafe.example
                  </a>{" "}
                  and we will make room.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const dayRows = [
  { term: "Date", value: <time dateTime="2027-07-17">Saturday 17 July 2027</time> },
  {
    term: "Arrive",
    value: (
      <>
        From <time dateTime="13:30">13:30</time>
      </>
    ),
  },
  { term: "Ceremony", value: <time dateTime="14:00">14:00</time> },
  { term: "Place", value: "Quillbrook Barn, Little Saltry" },
  { term: "Reply by", value: <time dateTime="2027-04-30">Friday 30 April 2027</time> },
]

export function App() {
  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <SiteHeader />

      <main className={`${container} flex flex-col gap-22 pt-10 pb-22`}>
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
              Tell us who is coming and what you would like for dinner. It takes a
              minute, and it helps us plan the tables and the minibuses.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="reply-heading"
          className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start md:gap-x-6"
        >
          <div className="flex flex-col gap-6 md:col-span-7">
            <h2 id="reply-heading" className="text-h2">
              Your reply
            </h2>
            <ReplyForm />
          </div>

          <aside
            aria-labelledby="day-heading"
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 md:col-span-4 md:col-start-9"
          >
            <h2 id="day-heading" className="text-h2">
              The day in short
            </h2>
            <dl className="divide-y divide-border">
              {dayRows.map((row) => (
                <div
                  key={row.term}
                  className="flex items-baseline justify-between gap-6 py-3 first:pt-0 last:pb-0"
                >
                  <dt className="shrink-0 font-mono text-label text-muted-foreground">
                    {row.term}
                  </dt>
                  <dd className="min-w-0 text-right text-body text-foreground tabular-nums">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="max-w-xl">
              Something the form does not ask? Write to{" "}
              <a href="mailto:hello@clemandrafe.example" className={textLink}>
                hello@clemandrafe.example
              </a>
              .
            </p>
          </aside>
        </section>

        <section aria-labelledby="offline-heading" className="grid grid-cols-1 md:grid-cols-12">
          <div className="flex flex-col gap-6 md:col-span-8 md:col-start-3">
            <h2 id="offline-heading" className="text-h2">
              Cannot reply online?
            </h2>
            <p className="max-w-xl">
              Clem&apos;s sister, Bea Ashdown, is keeping the list. Call her on{" "}
              <a href="tel:+441632960573" className={textLink}>
                01632 960 573
              </a>{" "}
              or write to{" "}
              <a href="mailto:hello@clemandrafe.example" className={textLink}>
                hello@clemandrafe.example
              </a>
              , and she will add you.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
