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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const navLink = cn(
  "inline-flex h-11 items-center font-mono text-label text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const buttonClasses = "h-11 rounded-md px-6 font-mono text-label"
const fieldLabel = "block font-mono text-label"
const helperText = "font-mono text-label text-muted-foreground"

const EMAIL = "hello@clemandrafe.example"
const MIN_GUESTS = 1
const MAX_GUESTS = 4
const NOTE_MAX = 300

const DINNERS = [
  "Roast chicken with tarragon",
  "Wild mushroom pie (vegetarian)",
  "Summer vegetable tart (vegan)",
  "Children's plate (under 12)",
]

const NAV = [
  { label: "Reply", href: "/rsvp", current: true },
  { label: "Gifts", href: "/gifts", current: false },
  { label: "The day", href: "/day", current: false },
  { label: "Guestbook", href: "/guestbook", current: false },
]

type Coming = "yes" | "no" | null
type FieldKey = "name" | "email" | "coming" | "dinner"
type Errors = Partial<Record<FieldKey, string>>
type Sent = {
  name: string
  email: string
  coming: "yes" | "no"
  guests: number
  dinner: string | null
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function guestsLabel(n: number) {
  return n === 1 ? "1 guest" : `${n} guests`
}

function charactersLeft(n: number) {
  return n === 1 ? "1 character left" : `${n} characters left`
}

function MailLink() {
  return (
    <a href={`mailto:${EMAIL}`} className={textLink}>
      {EMAIL}
    </a>
  )
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

function describedBy(...ids: (string | false | undefined)[]) {
  return ids.filter(Boolean).join(" ") || undefined
}

function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-[1088px] flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
        <a
          href="/"
          className={cn(
            "inline-flex h-11 items-center font-heading text-h2 text-foreground transition-colors duration-150",
            focusRing
          )}
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
                  className={cn(navLink, item.current && "underline")}
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
      <div className="mx-auto flex max-w-[1088px] flex-col gap-3 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <p className="font-heading text-h2">Clem &amp; Rafe</p>
        <div className="flex flex-col gap-2 md:items-end">
          <p className="font-mono text-label text-muted-foreground tabular-nums">
            <time dateTime="2027-07-17">Saturday 17 July 2027</time> ·
            Quillbrook Barn, Little Saltry
          </p>
          <p className="font-mono text-label wrap-break-word text-muted-foreground">
            Questions: <MailLink />
          </p>
        </div>
      </div>
    </footer>
  )
}

function ReplyForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [coming, setComing] = useState<Coming>(null)
  const [guests, setGuests] = useState(MIN_GUESTS)
  const [dinner, setDinner] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [focusRequest, setFocusRequest] = useState<{
    field: FieldKey
    n: number
  } | null>(null)
  const [sent, setSent] = useState<Sent | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const yesRef = useRef<HTMLButtonElement>(null)
  const dinnerRef = useRef<HTMLButtonElement>(null)
  const confirmationRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!focusRequest) return
    const targets = {
      name: nameRef,
      email: emailRef,
      coming: yesRef,
      dinner: dinnerRef,
    }
    targets[focusRequest.field].current?.focus()
  }, [focusRequest])

  useEffect(() => {
    if (sent) confirmationRef.current?.focus()
  }, [sent])

  function clearError(field: FieldKey) {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
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

    if (!trimmedName)
      next.name = "Write your name, as it is on your invitation."
    if (!trimmedEmail)
      next.email = "Write your email address, so we can send you a copy."
    else if (!emailPattern.test(trimmedEmail))
      next.email = "Check the email address: it needs an @ and a domain."
    if (!coming) next.coming = "Choose whether you can come."
    if (coming === "yes" && !dinner)
      next.dinner = "Choose a dinner for yourself."

    setErrors(next)
    const order: FieldKey[] = ["name", "email", "coming", "dinner"]
    const first = order.find((key) => next[key])
    if (first) {
      setFocusRequest((prev) => ({ field: first, n: (prev?.n ?? 0) + 1 }))
      return
    }

    setSent({
      name: trimmedName,
      email: trimmedEmail,
      coming: coming as "yes" | "no",
      guests,
      dinner,
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {!sent && (
        <form
          noValidate
          aria-label="Your reply"
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="reply-name" className={fieldLabel}>
              Your name
            </label>
            <Input
              ref={nameRef}
              id="reply-name"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                clearError("name")
              }}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describedBy(
                "reply-name-help",
                errors.name && "reply-name-error"
              )}
              className="h-11 rounded-md px-3 text-body md:text-body"
            />
            <p id="reply-name-help" className={helperText}>
              As it is on your invitation.
            </p>
            {errors.name && (
              <ErrorLine id="reply-name-error">{errors.name}</ErrorLine>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="reply-email" className={fieldLabel}>
              Email address
            </label>
            <Input
              ref={emailRef}
              id="reply-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                clearError("email")
              }}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy(
                "reply-email-help",
                errors.email && "reply-email-error"
              )}
              className="h-11 rounded-md px-3 text-body md:text-body"
            />
            <p id="reply-email-help" className={helperText}>
              We send a copy of your reply here.
            </p>
            {errors.email && (
              <ErrorLine id="reply-email-error">{errors.email}</ErrorLine>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p
              id="reply-coming-label"
              className="font-mono text-label text-foreground"
            >
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
                aria-pressed={coming === "yes"}
                variant={coming === "yes" ? "secondary" : "outline"}
                className={buttonClasses}
                onClick={() => choose("yes")}
              >
                Yes, I will be there
              </Button>
              <Button
                aria-pressed={coming === "no"}
                variant={coming === "no" ? "secondary" : "outline"}
                className={buttonClasses}
                onClick={() => choose("no")}
              >
                Sorry, I cannot come
              </Button>
            </div>
            {errors.coming && (
              <ErrorLine id="reply-coming-error">{errors.coming}</ErrorLine>
            )}
          </div>

          {coming === "yes" && (
            <>
              <div className="flex flex-col gap-2">
                <p
                  id="reply-guests-label"
                  className="font-mono text-label text-foreground"
                >
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
                    className="size-11 rounded-md"
                    aria-label="Fewer guests"
                    disabled={guests <= MIN_GUESTS}
                    focusableWhenDisabled
                    onClick={() =>
                      setGuests((n) => Math.max(MIN_GUESTS, n - 1))
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
                    {guestsLabel(guests)}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-11 rounded-md"
                    aria-label="More guests"
                    disabled={guests >= MAX_GUESTS}
                    focusableWhenDisabled
                    onClick={() =>
                      setGuests((n) => Math.min(MAX_GUESTS, n + 1))
                    }
                  >
                    <Plus
                      className="size-4"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </Button>
                </div>
                <p id="reply-guests-help" className={helperText}>
                  Your invitation is for up to 4 people.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  id="reply-dinner-label"
                  htmlFor="reply-dinner"
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
                    id="reply-dinner"
                    aria-labelledby="reply-dinner-label"
                    aria-invalid={errors.dinner ? true : undefined}
                    aria-describedby={describedBy(
                      "reply-dinner-help",
                      errors.dinner && "reply-dinner-error"
                    )}
                  >
                    <SelectValue placeholder="Choose a dinner" />
                  </SelectTrigger>
                  <SelectContent>
                    {DINNERS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p id="reply-dinner-help" className={helperText}>
                  If others come with you, tell us their dinners in the note.
                </p>
                {errors.dinner && (
                  <ErrorLine id="reply-dinner-error">{errors.dinner}</ErrorLine>
                )}
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="reply-note" className={fieldLabel}>
              A note for Clem and Rafe (optional)
            </label>
            <Textarea
              id="reply-note"
              maxLength={NOTE_MAX}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              aria-describedby="reply-note-help"
              className="min-h-32 resize-none rounded-md px-3 py-2 text-body md:text-body"
            />
            <p id="reply-note-help" className={cn(helperText, "tabular-nums")}>
              {charactersLeft(NOTE_MAX - note.length)}
            </p>
          </div>

          <Button
            type="submit"
            className={cn(buttonClasses, "w-full md:w-auto md:self-start")}
          >
            Send my reply
          </Button>
        </form>
      )}

      <div role="status">
        {sent && (
          <div className="flex flex-col gap-3">
            {sent.coming === "yes" ? (
              <>
                <h3
                  ref={confirmationRef}
                  tabIndex={-1}
                  className={cn("text-h2 wrap-break-word", codeFocusRing)}
                >
                  Thank you, {sent.name}
                </h3>
                <p>
                  We have you down for {guestsLabel(sent.guests)} on{" "}
                  <time dateTime="2027-07-17">Saturday 17 July 2027</time>, with{" "}
                  {sent.dinner} for your dinner.
                </p>
                <p className="wrap-break-word">
                  A copy is on its way to {sent.email}. To change anything
                  before <time dateTime="2027-04-30">30 April</time>, write to{" "}
                  <MailLink />.
                </p>
              </>
            ) : (
              <>
                <h3
                  ref={confirmationRef}
                  tabIndex={-1}
                  className={cn("text-h2", codeFocusRing)}
                >
                  Thank you for letting us know
                </h3>
                <p className="wrap-break-word">
                  We will miss you, {sent.name}. If your plans change before{" "}
                  <time dateTime="2027-04-30">30 April</time>, write to{" "}
                  <MailLink /> and we will make room.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const DAY_ROWS: { term: string; value: ReactNode }[] = [
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

export function App() {
  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <SiteHeader />

      <main className="mx-auto flex max-w-[1088px] flex-col gap-22 px-6 pt-10 pb-22">
        <section
          aria-labelledby="opening-title"
          className="flex flex-col gap-6 rounded-xl bg-mist p-6 text-mist-foreground md:p-10"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-label tabular-nums">
                Reply by <time dateTime="2027-04-30">Friday 30 April 2027</time>
              </p>
              <h1 id="opening-title" className="text-h1 md:text-display">
                Will you come?
              </h1>
            </div>
            <p className="max-w-xl text-body">
              Tell us who is coming and what you would like for dinner. It takes
              a minute, and it helps us plan the tables and the minibuses.
            </p>
          </div>
        </section>

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

          <aside
            aria-labelledby="day-title"
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 md:col-span-4 md:col-start-9"
          >
            <h2 id="day-title" className="text-h2">
              The day in short
            </h2>
            <dl className="divide-y divide-border">
              {DAY_ROWS.map((row) => (
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
              Something the form does not ask? Write to <MailLink />.
            </p>
          </aside>
        </section>

        <section
          aria-labelledby="offline-title"
          className="grid grid-cols-1 md:grid-cols-12"
        >
          <div className="flex flex-col gap-6 md:col-span-8 md:col-start-3">
            <h2 id="offline-title" className="text-h2">
              Cannot reply online?
            </h2>
            <p className="max-w-xl text-body wrap-break-word">
              Clem&apos;s sister, Bea Ashdown, is keeping the list. Call her on{" "}
              <a href="tel:+441632960573" className={textLink}>
                01632 960 573
              </a>{" "}
              or write to <MailLink />, and she will add you.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
