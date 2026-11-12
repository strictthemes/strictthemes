import { useEffect, useRef, useState } from "react"
import type { FormEvent, KeyboardEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const container = "mx-auto max-w-[1280px] px-4 md:px-6"
const label = "font-mono text-label uppercase"
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-primary",
  focusRing
)
const navLink = cn(
  label,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const buttonClass = "h-auto px-6 py-2 font-mono text-label uppercase"
const fieldClass = "mt-2 h-auto px-4 py-2 text-body md:text-body"
const fieldLabel = "block font-mono text-label uppercase text-foreground"

const pages = [
  { name: "Programme", href: "/" },
  { name: "Seasons", href: "/season" },
  { name: "Membership", href: "/membership" },
  { name: "Visit", href: "/visit" },
]
const currentHref = "/visit"

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (open && event.key === "Escape") {
      setOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div
        className={cn(
          container,
          "flex flex-wrap items-center justify-between gap-4 py-4"
        )}
      >
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
            focusRing
          )}
        >
          The Vesper
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {pages.map((page) => (
              <li key={page.href}>
                <a
                  href={page.href}
                  aria-current={page.href === currentHref ? "page" : undefined}
                  className={cn(
                    navLink,
                    page.href === currentHref && "underline"
                  )}
                >
                  {page.name}
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
          onClick={() => setOpen((value) => !value)}
          className={cn(buttonClass, "md:hidden")}
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
        <div className={cn(container, "py-2")}>
          <ul>
            {pages.map((page) => (
              <li key={page.href}>
                <a
                  href={page.href}
                  aria-current={page.href === currentHref ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    navLink,
                    "block py-2",
                    page.href === currentHref && "underline"
                  )}
                >
                  {page.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function Introduction() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
      <div className="md:col-span-7">
        <p className={cn(label, "text-muted-foreground")}>Visit</p>
        <h1 className="mt-2 text-h1 md:text-display">Find the Vesper</h1>
        <p className="mt-6 max-w-xl">
          The Vesper stands in the old rope works on Tallow Row, built in 1871
          to make rigging for the harbour. It has been a cinema since 1934.
          Today it has three screens, from a 212-seat hall under the original
          roof trusses to a 38-seat room in the loft, and a bar on the first
          floor.
        </p>
      </div>
      <div className="mt-12 rounded-xl border border-border bg-card p-6 md:col-span-4 md:col-start-9 md:mt-0">
        <p className={cn(label, "text-muted-foreground")}>Address</p>
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
        <p>
          <a href="mailto:hello@vesper.example" className={textLink}>
            hello@vesper.example
          </a>
        </p>
      </div>
    </section>
  )
}

type Day = {
  day: string
  doors?: string
  lastFilm?: string
  bar?: string
}

const openingTimes: Day[] = [
  { day: "Monday" },
  { day: "Tuesday", doors: "17:00", lastFilm: "21:00", bar: "23:30" },
  { day: "Wednesday", doors: "17:00", lastFilm: "21:00", bar: "23:30" },
  { day: "Thursday", doors: "17:00", lastFilm: "21:00", bar: "23:30" },
  { day: "Friday", doors: "16:00", lastFilm: "23:15", bar: "00:00" },
  { day: "Saturday", doors: "16:00", lastFilm: "23:15", bar: "00:00" },
  { day: "Sunday", doors: "13:00", lastFilm: "20:30", bar: "22:30" },
]

const cellEdges = "px-4 first:pl-0 last:pr-0"
const headCell = cn(label, "text-muted-foreground", cellEdges)
const bodyCell = cn("py-2", cellEdges)

function TimeCell({ value }: { value?: string }) {
  return (
    <TableCell className={bodyCell}>
      {value ? (
        <time dateTime={value} className="font-mono tabular-nums">
          {value}
        </time>
      ) : (
        <>
          <span aria-hidden="true">—</span>
          <span className="sr-only">Closed</span>
        </>
      )}
    </TableCell>
  )
}

function OpeningTimes() {
  return (
    <section className="mt-24">
      <h2 className="text-h2 md:text-h1">Opening times</h2>
      <p className="mt-4 max-w-xl">
        The box office opens half an hour before the first film of the day.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
        <div className="min-w-0 md:col-span-8">
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
              {openingTimes.map((row) => (
                <TableRow key={row.day}>
                  <TableHead
                    scope="row"
                    className={cn(
                      "py-2 font-sans text-body font-normal text-foreground",
                      cellEdges
                    )}
                  >
                    {row.day}
                  </TableHead>
                  {row.doors ? (
                    <TimeCell value={row.doors} />
                  ) : (
                    <TableCell className={bodyCell}>Closed</TableCell>
                  )}
                  <TimeCell value={row.lastFilm} />
                  <TimeCell value={row.bar} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}

const screens = [
  {
    name: "Screen 1",
    details: "212 seats · 35mm and digital",
    about:
      "The old spinning hall, 60 metres long, with the rope works' iron roof trusses still above the seats.",
    access: [
      "Step-free from the street through the main doors.",
      "Four wheelchair spaces in the front row, each with a companion seat beside it.",
      "A hearing loop covers the whole room.",
      "Row F has extra legroom.",
      "Captioned screenings every Tuesday.",
    ],
  },
  {
    name: "Screen 2",
    details: "84 seats · Digital",
    about:
      "A smaller room in the former tarring shed, with raked seating and a curtain in front of the screen.",
    access: [
      "Step-free from the street, along the ground-floor corridor past the box office.",
      "Two wheelchair spaces at the back of the room, on the level of the entrance.",
      "A hearing loop covers the whole room.",
      "The aisle seats in rows A and E have extra legroom.",
      "Captioned screenings every Tuesday.",
    ],
  },
  {
    name: "Screen 3",
    details: "38 seats · Digital",
    about:
      "Our loft room under the eaves, with sofas at the back, used for small seasons and private hire.",
    access: [
      "Up one flight of 22 stairs, with a handrail on both sides. There is no lift.",
      "No wheelchair spaces, as the room cannot be reached step-free.",
      "A hearing loop covers the whole room.",
      "The front row has extra legroom.",
      "Captioned screenings every Tuesday.",
    ],
  },
]

function Screens() {
  return (
    <section className="mt-24">
      <h2 className="text-h2 md:text-h1">The screens</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {screens.map((screen) => (
          <article
            key={screen.name}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="text-h2">{screen.name}</h3>
            <p className={cn(label, "mt-2 text-muted-foreground tabular-nums")}>
              {screen.details}
            </p>
            <p className="mt-4">{screen.about}</p>
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
  )
}

function Bar() {
  return (
    <section className="mt-24 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
      <figure className="md:col-span-7">
        <div
          role="img"
          aria-label="The first-floor bar at night, with its long zinc counter and the windows over Tallow Row"
          className="aspect-video rounded-xl border border-border bg-muted"
        />
        <figcaption className={cn(label, "mt-2 text-muted-foreground")}>
          The bar · An hour before the late show
        </figcaption>
      </figure>
      <div className="mt-6 md:col-span-5 md:mt-0">
        <h2 className="text-h2 md:text-h1">The bar</h2>
        <p className="mt-4 max-w-xl">
          The bar pours beer from three breweries within ten miles of Oldmere,
          makes coffee until late and serves small plates until 21:00: toasted
          sandwiches, a cheese board and bowls of spiced nuts.
        </p>
        <p className="mt-4 max-w-xl">
          You can take a drink into Screens 1 and 2. Glasses stay downstairs
          for Screen 3, where we serve drinks in cups instead.
        </p>
        <p className={cn(label, "mt-4 text-muted-foreground")}>
          Opens with the doors · Until midnight Fri and Sat
        </p>
      </div>
    </section>
  )
}

const routes = [
  {
    title: "By tram",
    text: "Take the Harbour line to Tallow Row. The cinema is a three-minute walk from the stop, down the hill towards the water.",
  },
  {
    title: "By bus",
    text: "The 14 and the 31 stop on Quay Street, five minutes' walk away. The 31 runs until after the last film on Fridays and Saturdays.",
  },
  {
    title: "By bike",
    text: "There are twelve covered bike stands in the yard beside the main doors, free for anyone coming to a film.",
  },
  {
    title: "By car",
    text: "We have no car park. The Ropewalk car park on Mill Lane is open all night; two blue badge bays sit right outside our doors.",
  },
]

function GettingHere() {
  return (
    <section className="mt-24">
      <h2 className="text-h2 md:text-h1">Getting here</h2>
      <dl className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {routes.map((route) => (
          <div key={route.title} className="border-t border-border pt-4">
            <dt className={cn(label, "text-muted-foreground")}>
              {route.title}
            </dt>
            <dd className="mt-2 max-w-xl text-body">{route.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

const topics = {
  general: { name: "General question", phrase: "your question" },
  access: { name: "Access", phrase: "your question about access" },
  hire: { name: "Private hire", phrase: "your question about private hire" },
  lost: { name: "Lost property", phrase: "your message about lost property" },
} as const
type Topic = keyof typeof topics

type Field = "name" | "email" | "message"
type Errors = Partial<Record<Field, string>>

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-body text-destructive">
      <CircleAlert
        className="mt-1 size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span>{message}</span>
    </p>
  )
}

function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [topic, setTopic] = useState<Topic>("general")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState<{ topic: Topic; email: string } | null>(
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

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Errors = {}
    if (name.trim() === "") next.name = "Enter your name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter an email address such as name@example.com."
    }
    if (message.trim().length < 20) {
      next.message =
        "Write a few words more, so we can help: at least 20 characters."
    }
    setErrors(next)
    if (next.name) nameRef.current?.focus()
    else if (next.email) emailRef.current?.focus()
    else if (next.message) messageRef.current?.focus()
    else setSent({ topic, email: email.trim() })
  }

  return (
    <section
      id="contact"
      className="mt-24 grid grid-cols-1 md:grid-cols-12 md:gap-x-6"
    >
      <div className="md:col-span-5">
        <h2 className="text-h2 md:text-h1">Write to us</h2>
        <p className="mt-4 max-w-xl">
          Ask us about access, private hire or lost property, and we will
          answer within two working days.
        </p>
      </div>
      <div className="mt-12 md:col-span-6 md:col-start-7 md:mt-0">
        {!sent && (
          <form noValidate onSubmit={onSubmit}>
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
              <FieldError id="contact-name-error" message={errors.name} />
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
                aria-describedby={
                  errors.email ? "contact-email-error" : undefined
                }
                className={fieldClass}
              />
              <FieldError id="contact-email-error" message={errors.email} />
            </div>
            <div className="mt-6">
              <label htmlFor="contact-topic" className={fieldLabel}>
                Topic
              </label>
              <select
                id="contact-topic"
                name="topic"
                value={topic}
                onChange={(event) => setTopic(event.target.value as Topic)}
                className={cn(
                  "mt-2 w-full rounded-lg border border-input bg-card px-4 py-2 text-body text-foreground",
                  focusRing
                )}
              >
                {(Object.keys(topics) as Topic[]).map((key) => (
                  <option key={key} value={key}>
                    {topics[key].name}
                  </option>
                ))}
              </select>
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
                className={fieldClass}
              />
              <p
                id="contact-message-hint"
                className="mt-2 text-body text-muted-foreground"
              >
                If you lost something, say which screening you were at.
              </p>
              <FieldError id="contact-message-error" message={errors.message} />
            </div>
            <Button type="submit" className={cn(buttonClass, "mt-6")}>
              Send message
            </Button>
          </form>
        )}
        <div role="status">
          {sent && (
            <div>
              <h3
                ref={confirmationRef}
                tabIndex={-1}
                className={cn("text-h2", codeFocusRing)}
              >
                Thank you, your message is with us
              </h3>
              <p className="mt-4 max-w-xl">
                We will answer {topics[sent.topic].phrase} at {sent.email}{" "}
                within two working days.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-border py-12">
      <div className={container}>
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-6">
            <p className="font-heading text-h2">The Vesper</p>
            <p className="mt-2 text-body text-muted-foreground">
              21 Tallow Row, Oldmere OM2 4LT
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body md:col-span-6 md:mt-0">
            {pages.map((page) => (
              <li key={page.href}>
                <a href={page.href} className={textLink}>
                  {page.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className={cn(label, "mt-12 text-muted-foreground")}>
          © 2026 The Vesper
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <Header />
      <main className={cn(container, "pt-12")}>
        <Introduction />
        <OpeningTimes />
        <Screens />
        <Bar />
        <GettingHere />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
