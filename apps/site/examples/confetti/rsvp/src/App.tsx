import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from "react"
import { flushSync } from "react-dom"
import { CircleAlert, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = `text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground ${focusOutline}`

const navLink = `inline-flex h-11 items-center font-mono text-label text-foreground underline-offset-4 transition-colors duration-150 hover:underline ${focusOutline}`

const buttonClass = "h-11 rounded-md px-6 font-mono text-label"

const container = "mx-auto max-w-[1088px] px-6"

const fieldLabel = "block font-mono text-label text-foreground"

const helperText = "font-mono text-label text-muted-foreground"

const dinners = [
  "Roast chicken with tarragon",
  "Wild mushroom pie (vegetarian)",
  "Summer vegetable tart (vegan)",
  "Children's plate (under 12)",
]

const navItems = [
  { label: "Reply", href: "/rsvp", current: true },
  { label: "Gifts", href: "/gifts", current: false },
  { label: "The day", href: "/day", current: false },
  { label: "Guestbook", href: "/guestbook", current: false },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NOTE_MAX = 300
const GUESTS_MIN = 1
const GUESTS_MAX = 4

type Coming = "yes" | "no" | null

type Errors = {
  name?: string
  email?: string
  coming?: string
  dinner?: string
}

type Reply = {
  name: string
  email: string
  coming: "yes" | "no"
  guests: number
  dinner: string | null
}

function guestCount(n: number) {
  return n === 1 ? "1 guest" : `${n} guests`
}

function charactersLeft(n: number) {
  return n === 1 ? "1 character left" : `${n} characters left`
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

function OurEmail() {
  return (
    <a href="mailto:hello@clemandrafe.example" className={textLink}>
      hello@clemandrafe.example
    </a>
  )
}

function Header() {
  return (
    <header className="border-b border-border">
      <div
        className={`${container} flex flex-wrap items-center gap-x-6 gap-y-2 py-3`}
      >
        <a
          href="/"
          className={`inline-flex h-11 items-center font-heading text-h2 text-foreground ${focusOutline}`}
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

function Footer() {
  return (
    <footer className="border-t border-border">
      <div
        className={`${container} flex flex-col gap-3 py-10 md:flex-row md:items-center md:justify-between`}
      >
        <p className="font-heading text-h2">Clem &amp; Rafe</p>
        <div className="flex flex-col gap-2 md:items-end">
          <p className="font-mono text-label text-muted-foreground">
            <time dateTime="2027-07-17">Saturday 17 July 2027</time> ·
            Quillbrook Barn, Little Saltry
          </p>
          <p className="font-mono text-label text-muted-foreground">
            Questions: <OurEmail />
          </p>
        </div>
      </div>
    </footer>
  )
}

function Opening() {
  return (
    <section
      aria-labelledby="opening-title"
      className="flex flex-col gap-6 rounded-xl bg-mist p-6 text-mist-foreground md:p-10"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-label">
            Reply by <time dateTime="2027-04-30">Friday 30 April 2027</time>
          </p>
          <h1 id="opening-title" className="text-h1 md:text-display">
            Will you come?
          </h1>
        </div>
        <p className="max-w-xl text-body">
          Tell us who is coming and what you would like for dinner. It takes a
          minute, and it helps us plan the tables and the minibuses.
        </p>
      </div>
    </section>
  )
}

function Confirmation({
  reply,
  headingRef,
}: {
  reply: Reply
  headingRef: RefObject<HTMLHeadingElement | null>
}) {
  const headingClass =
    "text-h2 wrap-break-word focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"

  if (reply.coming === "yes") {
    return (
      <div className="flex flex-col gap-3">
        <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
          Thank you, {reply.name}
        </h3>
        <p className="max-w-xl">
          We have you down for {guestCount(reply.guests)} on{" "}
          <time dateTime="2027-07-17">Saturday 17 July 2027</time>, with{" "}
          {reply.dinner} for your dinner.
        </p>
        <p className="max-w-xl wrap-break-word">
          A copy is on its way to {reply.email}. To change anything before{" "}
          <time dateTime="2027-04-30">30 April</time>, write to <OurEmail />.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
        Thank you for letting us know
      </h3>
      <p className="max-w-xl wrap-break-word">
        We will miss you, {reply.name}. If your plans change before{" "}
        <time dateTime="2027-04-30">30 April</time>, write to <OurEmail /> and
        we will make room.
      </p>
    </div>
  )
}

function ReplyForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [coming, setComing] = useState<Coming>(null)
  const [guests, setGuests] = useState(GUESTS_MIN)
  const [dinner, setDinner] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [reply, setReply] = useState<Reply | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const yesRef = useRef<HTMLButtonElement>(null)
  const dinnerRef = useRef<HTMLButtonElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (reply) headingRef.current?.focus()
  }, [reply])

  function clearError(field: keyof Errors) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function choose(value: "yes" | "no") {
    setComing(value)
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
    if (!coming) {
      next.coming = "Choose whether you can come."
    }
    if (coming === "yes" && !dinner) {
      next.dinner = "Choose a dinner for yourself."
    }

    if (Object.keys(next).length > 0) {
      flushSync(() => setErrors(next))
      if (next.name) nameRef.current?.focus()
      else if (next.email) emailRef.current?.focus()
      else if (next.coming) yesRef.current?.focus()
      else if (next.dinner) dinnerRef.current?.focus()
      return
    }

    setErrors({})
    setReply({
      name: trimmedName,
      email: trimmedEmail,
      coming: coming as "yes" | "no",
      guests,
      dinner: coming === "yes" ? dinner : null,
    })
  }

  const emailDescribedBy = errors.email
    ? "email-help email-error"
    : "email-help"
  const dinnerDescribedBy = errors.dinner
    ? "dinner-help dinner-error"
    : "dinner-help"

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {!reply && (
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
              aria-describedby={
                errors.name ? "name-help name-error" : "name-help"
              }
              className="h-11 rounded-md px-3 text-body md:text-body"
            />
            <p id="name-help" className={helperText}>
              As it is on your invitation
            </p>
            {errors.name && <ErrorLine id="name-error">{errors.name}</ErrorLine>}
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
            <p id="email-help" className={helperText}>
              We send a copy of your reply here.
            </p>
            {errors.email && (
              <ErrorLine id="email-error">{errors.email}</ErrorLine>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p id="coming-label" className="font-mono text-label text-foreground">
              Are you coming?
            </p>
            <div
              role="group"
              aria-labelledby="coming-label"
              aria-describedby={errors.coming ? "coming-error" : undefined}
              className="flex flex-wrap gap-2"
            >
              <Button
                ref={yesRef}
                aria-pressed={coming === "yes"}
                variant={coming === "yes" ? "secondary" : "outline"}
                className={buttonClass}
                onClick={() => choose("yes")}
              >
                Yes, I will be there
              </Button>
              <Button
                aria-pressed={coming === "no"}
                variant={coming === "no" ? "secondary" : "outline"}
                className={buttonClass}
                onClick={() => choose("no")}
              >
                Sorry, I cannot come
              </Button>
            </div>
            {errors.coming && (
              <ErrorLine id="coming-error">{errors.coming}</ErrorLine>
            )}
          </div>

          {coming === "yes" && (
            <>
              <div className="flex flex-col gap-2">
                <p
                  id="guests-label"
                  className="font-mono text-label text-foreground"
                >
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
                    disabled={guests <= GUESTS_MIN}
                    focusableWhenDisabled
                    onClick={() =>
                      setGuests((n) => Math.max(GUESTS_MIN, n - 1))
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
                    {guestCount(guests)}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-11 rounded-md"
                    aria-label="More guests"
                    disabled={guests >= GUESTS_MAX}
                    focusableWhenDisabled
                    onClick={() =>
                      setGuests((n) => Math.min(GUESTS_MAX, n + 1))
                    }
                  >
                    <Plus
                      className="size-4"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </Button>
                </div>
                <p id="guests-help" className={helperText}>
                  Your invitation is for up to 4 people.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  id="dinner-label"
                  htmlFor="dinner"
                  className={fieldLabel}
                >
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
                    id="dinner"
                    aria-labelledby="dinner-label"
                    aria-invalid={errors.dinner ? true : undefined}
                    aria-describedby={dinnerDescribedBy}
                  >
                    <SelectValue placeholder="Choose a dinner" />
                  </SelectTrigger>
                  <SelectContent>
                    {dinners.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p id="dinner-help" className={helperText}>
                  If others come with you, tell us their dinners in the note.
                </p>
                {errors.dinner && (
                  <ErrorLine id="dinner-error">{errors.dinner}</ErrorLine>
                )}
              </div>
            </>
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
              className="min-h-32 resize-none rounded-md px-3 py-2 text-body md:text-body"
            />
            <p id="note-help" className={helperText}>
              {charactersLeft(NOTE_MAX - note.length)}
            </p>
          </div>

          <Button
            type="submit"
            className={`${buttonClass} w-full md:w-auto md:self-start`}
          >
            Send my reply
          </Button>
        </form>
      )}
      <div role="status">
        {reply && <Confirmation reply={reply} headingRef={headingRef} />}
      </div>
    </div>
  )
}

function DayInShort() {
  const rows: { term: string; value: ReactNode }[] = [
    {
      term: "Date",
      value: <time dateTime="2027-07-17">Saturday 17 July 2027</time>,
    },
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
    {
      term: "Reply by",
      value: <time dateTime="2027-04-30">Friday 30 April 2027</time>,
    },
  ]

  return (
    <aside
      aria-labelledby="day-title"
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 md:col-span-4 md:col-start-9"
    >
      <h2 id="day-title" className="text-h2">
        The day in short
      </h2>
      <dl className="divide-y divide-border">
        {rows.map((row) => (
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
      <p className="text-body wrap-break-word">
        Something the form does not ask? Write to <OurEmail />.
      </p>
    </aside>
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <Header />
      <main className={`${container} flex flex-col gap-22 pt-10 pb-22`}>
        <Opening />

        <section
          aria-labelledby="reply-title"
          className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start md:gap-x-6"
        >
          <div className="flex flex-col gap-6 md:col-span-7">
            <h2 id="reply-title" className="text-h2">
              Your reply
            </h2>
            <ReplyForm />
          </div>
          <DayInShort />
        </section>

        <section
          aria-labelledby="offline-title"
          className="grid grid-cols-1 md:grid-cols-12"
        >
          <div className="flex flex-col gap-6 md:col-span-8 md:col-start-3">
            <h2 id="offline-title" className="text-h2">
              Cannot reply online?
            </h2>
            <p className="max-w-xl text-body">
              Clem&apos;s sister, Bea Ashdown, is keeping the list. Call her on{" "}
              <a href="tel:+441632960573" className={textLink}>
                01632 960 573
              </a>{" "}
              or write to <OurEmail />, and she will add you.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
