import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert } from "lucide-react"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const textLink = `text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-primary ${focusRing}`
const navLink = `font-mono text-label uppercase text-foreground underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`
const label = "font-mono text-label uppercase"
const fieldLabel = "block font-mono text-label uppercase text-foreground"
const fieldClass = "mt-2 h-auto px-4 py-2 text-body md:text-body"
const buttonClass = "h-auto px-6 py-2 font-mono text-label uppercase"
const sectionHeading = "text-h2 md:text-h1"

const navItems = [
  { label: "Programme", href: "/" },
  { label: "Seasons", href: "/season" },
  { label: "Membership", href: "/membership" },
  { label: "Visit", href: "/visit" },
]
const currentHref = "/visit"

type Hours = { doors: string; lastFilm: string; bar: string } | null
const openingTimes: { day: string; hours: Hours }[] = [
  { day: "Monday", hours: null },
  { day: "Tuesday", hours: { doors: "17:00", lastFilm: "21:00", bar: "23:30" } },
  { day: "Wednesday", hours: { doors: "17:00", lastFilm: "21:00", bar: "23:30" } },
  { day: "Thursday", hours: { doors: "17:00", lastFilm: "21:00", bar: "23:30" } },
  { day: "Friday", hours: { doors: "16:00", lastFilm: "23:15", bar: "00:00" } },
  { day: "Saturday", hours: { doors: "16:00", lastFilm: "23:15", bar: "00:00" } },
  { day: "Sunday", hours: { doors: "13:00", lastFilm: "20:30", bar: "22:30" } },
]

const screens = [
  {
    name: "Screen 1",
    details: "212 seats · 35mm and digital",
    room: "The old rope-twisting hall, with a raked floor, a 12-metre screen and the original iron roof trusses overhead.",
    access: [
      "Step-free from the street through the main doors on Tallow Row.",
      "Four wheelchair spaces at the end of row F, each with a companion seat beside it.",
      "A hearing loop covers the whole room.",
      "The seats on the aisles of row F have extra legroom.",
      "Captioned screenings every Tuesday.",
    ],
  },
  {
    name: "Screen 2",
    details: "84 seats · Digital",
    room: "A smaller room in the former tar store, with deep red seats and the best sound in the building.",
    access: [
      "Step-free from the street, along the ground-floor corridor past the box office.",
      "Two wheelchair spaces in the front row, on the left.",
      "A hearing loop covers the whole room.",
      "The seats in row A have extra legroom.",
      "Captioned screenings every Tuesday.",
    ],
  },
  {
    name: "Screen 3",
    details: "38 seats · Digital",
    room: "Our smallest room, in the old drying loft under the roof, used for documentaries, shorts and the late show.",
    access: [
      "Screen 3 is up a flight of 22 stairs, and there is no lift.",
      "It has no wheelchair spaces.",
      "A hearing loop covers the whole room.",
      "The seats in the back row have extra legroom.",
      "Captioned screenings every Tuesday.",
    ],
  },
]

const gettingHere = [
  {
    term: "By tram",
    text: "Take the Harbour line to Tallow Row. The stop is three minutes' walk from our doors.",
  },
  {
    term: "By bus",
    text: "Buses 14 and 31 stop on Quay Street, five minutes' walk away. The 31 runs until after the last film on Fridays and Saturdays.",
  },
  {
    term: "By bike",
    text: "There are racks for 20 bikes in the yard beside the entrance, under cover and lit until we close.",
  },
  {
    term: "By car",
    text: "We have no car park of our own. The Ropewalk car park on Mill Lane is a seven-minute walk and charges a flat rate in the evening.",
  },
]

const topics = [
  { value: "general", label: "General question" },
  { value: "access", label: "Access" },
  { value: "hire", label: "Private hire" },
  { value: "lost", label: "Lost property" },
]
const topicPhrase: Record<string, string> = {
  general: "your question",
  access: "your question about access",
  hire: "your question about private hire",
  lost: "your message about lost property",
}

type Field = "name" | "email" | "message"
type Errors = Partial<Record<Field, string>>

function isEmail(value: string) {
  if (/\s/.test(value)) return false
  const parts = value.split("@")
  if (parts.length !== 2) return false
  const [local, domain] = parts
  if (!local) return false
  const labels = domain.split(".")
  return labels.length >= 2 && labels.every((part) => part.length > 0)
}

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  return (
    <header
      className="border-b border-border"
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          setOpen(false)
          menuButton.current?.focus()
        }
      }}
    >
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
        <a
          href="/"
          className={`font-heading text-h2 text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`}
        >
          The Vesper
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.href === currentHref ? "page" : undefined}
                  className={`${navLink} ${item.href === currentHref ? "underline" : ""}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-menu"
          className={`${buttonClass} md:hidden`}
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <div className="mx-auto max-w-[1280px] px-4 py-2 md:px-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.href === currentHref ? "page" : undefined}
                  className={`${navLink} block py-2 ${item.href === currentHref ? "underline" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [topic, setTopic] = useState("general")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState<{ topic: string; email: string } | null>(
    null
  )

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const confirmationRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (sent) confirmationRef.current?.focus()
  }, [sent])

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
    const next: Errors = {}
    const trimmedEmail = email.trim()
    if (!name.trim()) next.name = "Enter your name."
    if (!isEmail(trimmedEmail))
      next.email = "Enter an email address such as name@example.com."
    if (message.trim().length < 20)
      next.message =
        "Write a few words more, so we can help: at least 20 characters."
    setErrors(next)

    if (next.name) nameRef.current?.focus()
    else if (next.email) emailRef.current?.focus()
    else if (next.message) messageRef.current?.focus()
    else setSent({ topic, email: trimmedEmail })
  }

  return (
    <div className="mt-12 md:col-span-6 md:col-start-7 md:mt-0">
      {!sent && (
        <form noValidate onSubmit={handleSubmit}>
          <div>
            <label htmlFor="contact-name" className={fieldLabel}>
              Your name
            </label>
            <Input
              ref={nameRef}
              id="contact-name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                clearError("name")
              }}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              className={fieldClass}
            />
            {errors.name && <ErrorLine id="contact-name-error" text={errors.name} />}
          </div>

          <div className="mt-6">
            <label htmlFor="contact-email" className={fieldLabel}>
              Email address
            </label>
            <Input
              ref={emailRef}
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                clearError("email")
              }}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              className={fieldClass}
            />
            {errors.email && (
              <ErrorLine id="contact-email-error" text={errors.email} />
            )}
          </div>

          <div className="mt-6">
            <label id="contact-topic-label" htmlFor="contact-topic" className={fieldLabel}>
              Topic
            </label>
            <Select
              items={topics}
              value={topic}
              onValueChange={(value) => {
                if (value !== null) setTopic(value)
              }}
            >
              <SelectTrigger
                id="contact-topic"
                aria-labelledby="contact-topic-label"
                className="mt-2"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {topics.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6">
            <label htmlFor="contact-message" className={fieldLabel}>
              Message
            </label>
            <Textarea
              ref={messageRef}
              id="contact-message"
              name="message"
              rows={5}
              value={message}
              onChange={(event) => {
                setMessage(event.target.value)
                clearError("message")
              }}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={
                errors.message
                  ? "contact-message-hint contact-message-error"
                  : "contact-message-hint"
              }
              className={`${fieldClass} resize-none`}
            />
            <p id="contact-message-hint" className="mt-2 text-body text-muted-foreground">
              If you lost something, say which screening you were at.
            </p>
            {errors.message && (
              <ErrorLine id="contact-message-error" text={errors.message} />
            )}
          </div>

          <Button type="submit" className={`mt-6 ${buttonClass}`}>
            Send message
          </Button>
        </form>
      )}
      <div role="status">
        {sent && (
          <>
            <h3
              ref={confirmationRef}
              tabIndex={-1}
              className="text-h2 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
            >
              Thank you, your message is with us
            </h3>
            <p className="mt-4 max-w-xl wrap-break-word">
              We will answer {topicPhrase[sent.topic]} at {sent.email} within
              two working days.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function ErrorLine({ id, text }: { id: string; text: string }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-body text-destructive">
      <CircleAlert
        className="mt-1 size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span>{text}</span>
    </p>
  )
}

function Time({ value }: { value: string }) {
  return (
    <time dateTime={value} className="font-mono tabular-nums">
      {value}
    </time>
  )
}

const headCell =
  "px-4 font-mono text-label uppercase text-muted-foreground first:pl-0 last:pr-0"
const rowHeadCell =
  "px-4 py-2 font-sans text-body font-normal text-foreground first:pl-0 last:pr-0"
const bodyCell = "px-4 py-2 first:pl-0 last:pr-0"

function ClosedCell() {
  return (
    <TableCell className={bodyCell}>
      <span aria-hidden="true">—</span>
      <span className="sr-only">Closed</span>
    </TableCell>
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-[1280px] px-4 pt-12 md:px-6">
        <section className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-7">
            <p className={`${label} text-muted-foreground`}>Visit</p>
            <h1 className="mt-2 text-h1 md:text-display">Find the Vesper</h1>
            <p className="mt-6 max-w-xl">
              The Vesper stands in the old Tallow Row rope works, built in 1871
              to twist cable for the ships in the harbour. It has been a cinema
              since 1934. Today it has three screens and a bar on the first
              floor, up the wide stairs from the foyer.
            </p>
          </div>
          <div className="mt-12 rounded-xl border border-border bg-card p-6 md:col-span-4 md:col-start-9 md:mt-0">
            <p className={`${label} text-muted-foreground`}>Address</p>
            <address className="mt-2 text-body not-italic">
              21 Tallow Row
              <br />
              Oldmere
              <br />
              OM2 4LT
            </address>
            <p className="mt-4">
              <a href="tel:01632960418" className={textLink}>
                01632 960 418
              </a>
            </p>
            <p className="wrap-break-word">
              <a href="mailto:hello@vesper.example" className={textLink}>
                hello@vesper.example
              </a>
            </p>
          </div>
        </section>

        <section className="mt-24">
          <h2 className={sectionHeading}>Opening times</h2>
          <p className="mt-4 max-w-xl">
            The box office opens half an hour before the first film of the day.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
            <div className="md:col-span-8">
              <Table label="Opening times" className="text-body">
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col" className={headCell}>
                      Day
                    </TableHead>
                    <TableHead scope="col" className={headCell}>
                      Doors open
                    </TableHead>
                    <TableHead scope="col" className={headCell}>
                      Last film starts
                    </TableHead>
                    <TableHead scope="col" className={headCell}>
                      Bar closes
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openingTimes.map(({ day, hours }) => (
                    <TableRow key={day}>
                      <TableHead scope="row" className={rowHeadCell}>
                        {day}
                      </TableHead>
                      {hours ? (
                        <>
                          <TableCell className={bodyCell}>
                            <Time value={hours.doors} />
                          </TableCell>
                          <TableCell className={bodyCell}>
                            <Time value={hours.lastFilm} />
                          </TableCell>
                          <TableCell className={bodyCell}>
                            <Time value={hours.bar} />
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className={bodyCell}>Closed</TableCell>
                          <ClosedCell />
                          <ClosedCell />
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        <section className="mt-24">
          <h2 className={sectionHeading}>The screens</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {screens.map((screen) => (
              <article
                key={screen.name}
                className="rounded-xl border border-border bg-card p-6"
              >
                <h3 className="text-h2">{screen.name}</h3>
                <p className={`mt-2 ${label} text-muted-foreground tabular-nums`}>
                  {screen.details}
                </p>
                <p className="mt-4">{screen.room}</p>
                <ul className="mt-6 list-disc pl-4 text-body">
                  {screen.access.map((note, index) => (
                    <li key={note} className={index > 0 ? "mt-2" : undefined}>
                      {note}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-24 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <figure className="md:col-span-7">
            <div
              role="img"
              aria-label="The first-floor bar at night, with its long zinc counter and the windows over Tallow Row"
              className="aspect-video rounded-xl border border-border bg-muted"
            />
            <figcaption className={`mt-2 ${label} text-muted-foreground`}>
              The bar · An hour before the late show
            </figcaption>
          </figure>
          <div className="mt-6 md:col-span-5 md:mt-0">
            <h2 className={sectionHeading}>The bar</h2>
            <p className="mt-4 max-w-xl">
              The bar pours beer from breweries within twenty miles of Oldmere,
              makes coffee until late and serves small plates from the kitchen
              until 21:00.
            </p>
            <p className="mt-4 max-w-xl">
              You can take a drink into Screens 1 and 2: ask at the counter for
              a glass with a lid. Screen 3 is too small for a tray, so drinks
              for the late show stay in the bar.
            </p>
            <p className={`mt-4 ${label} text-muted-foreground`}>
              Opens with the doors · Until midnight Fri and Sat
            </p>
          </div>
        </section>

        <section className="mt-24">
          <h2 className={sectionHeading}>Getting here</h2>
          <dl className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {gettingHere.map((entry) => (
              <div key={entry.term} className="border-t border-border pt-4">
                <dt className={`${label} text-muted-foreground`}>{entry.term}</dt>
                <dd className="mt-2 max-w-xl text-body">{entry.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          id="contact"
          className="mt-24 grid grid-cols-1 md:grid-cols-12 md:gap-x-6"
        >
          <div className="md:col-span-5">
            <h2 className={sectionHeading}>Write to us</h2>
            <p className="mt-4 max-w-xl">
              Send us your questions about access, private hire or lost
              property, and we will answer within two working days.
            </p>
          </div>
          <ContactForm />
        </section>
      </main>

      <footer className="mt-24 border-t border-border py-12">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">The Vesper</p>
              <p className="mt-2 text-body text-muted-foreground">
                21 Tallow Row, Oldmere OM2 4LT
              </p>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body md:col-span-6 md:col-start-7 md:mt-0">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={textLink}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className={`mt-12 ${label} text-muted-foreground tabular-nums`}>
            © 2026 The Vesper
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
