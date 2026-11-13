import * as React from "react"
import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const container = "mx-auto max-w-[1280px] px-4 md:px-6"
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-6"
const label = "font-mono text-label uppercase"
const mutedLabel = cn(label, "text-muted-foreground")
const sectionHeading = "text-h2 md:text-h1"
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-primary",
  focusRing
)
const navLink = cn(
  label,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const fieldLabel = cn("block", label, "text-foreground")
const fieldClasses = "mt-2 h-auto px-4 py-2 text-body md:text-body"
const buttonClasses = cn("h-auto px-6 py-2", label)
const card = "rounded-xl border border-border bg-card p-6"

const pages = [
  { name: "Programme", href: "/" },
  { name: "Seasons", href: "/season" },
  { name: "Membership", href: "/membership" },
  { name: "Visit", href: "/visit" },
]

type Hours = { doors: string; lastFilm: string; barCloses: string }

const openingTimes: { day: string; hours: Hours | null }[] = [
  { day: "Monday", hours: null },
  {
    day: "Tuesday",
    hours: { doors: "17:00", lastFilm: "21:00", barCloses: "23:30" },
  },
  {
    day: "Wednesday",
    hours: { doors: "17:00", lastFilm: "21:00", barCloses: "23:30" },
  },
  {
    day: "Thursday",
    hours: { doors: "17:00", lastFilm: "21:00", barCloses: "23:30" },
  },
  {
    day: "Friday",
    hours: { doors: "16:00", lastFilm: "23:15", barCloses: "00:00" },
  },
  {
    day: "Saturday",
    hours: { doors: "16:00", lastFilm: "23:15", barCloses: "00:00" },
  },
  {
    day: "Sunday",
    hours: { doors: "13:00", lastFilm: "20:30", barCloses: "22:30" },
  },
]

const screens = [
  {
    name: "Screen 1",
    seats: 212,
    format: "35mm and digital",
    room: "The auditorium of 1934, with its raked floor, its curtain and both projectors still in the box.",
    access: [
      "Step-free from the street, through the main doors on Tallow Row.",
      "4 wheelchair spaces at the back of the stalls, each beside a companion seat.",
      "A hearing loop covers every seat.",
      "Rows A and M have extra legroom.",
      "Captioned screenings on Tuesdays.",
    ],
  },
  {
    name: "Screen 2",
    seats: 84,
    format: "Digital",
    room: "A newer room in the old winding shed, with steep tiers and a screen as wide as the wall.",
    access: [
      "Step-free from the street, along the ground-floor corridor past the box office.",
      "2 wheelchair spaces in the front row, each beside a companion seat.",
      "A hearing loop covers every seat.",
      "Row F, on the cross aisle, has extra legroom.",
      "Captioned screenings on Tuesdays.",
    ],
  },
  {
    name: "Screen 3",
    seats: 38,
    format: "Digital",
    room: "The former pattern loft under the roof, for repertory, short films and the small hours.",
    access: [
      "Up a flight of 18 stairs from the first floor, with no lift.",
      "No wheelchair spaces. Ask the box office and we will move a screening to Screen 2 where we can.",
      "A hearing loop covers every seat.",
      "The front row has extra legroom.",
      "Captioned screenings on Tuesdays.",
    ],
  },
]

const routes = [
  {
    by: "By tram",
    text: "Tallow Row, on the Harbour line, is three minutes' walk from the doors. On Fridays and Saturdays the last tram leaves after the late show ends.",
  },
  {
    by: "By bus",
    text: "Routes 14 and 62 stop at Ropewalk Gate, five minutes' walk along Tallow Row.",
  },
  {
    by: "By bike",
    text: "Twelve covered stands are in the yard beside the building, lit until the bar closes.",
  },
  {
    by: "By car",
    text: "We have no car park. The nearest is on Harbour Street, eight minutes' walk away, and two blue badge bays are outside the main doors.",
  },
]

const topics = [
  { value: "general", label: "General question" },
  { value: "access", label: "Access" },
  { value: "hire", label: "Private hire" },
  { value: "lost", label: "Lost property" },
]

const topicPhrases: Record<string, string> = {
  general: "your question",
  access: "your question about access",
  hire: "your question about private hire",
  lost: "your message about lost property",
}

type FieldName = "name" | "email" | "message"
type FieldErrors = Partial<Record<FieldName, string>>

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 text-body text-destructive"
    >
      <CircleAlert
        className="mt-1 size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span>{children}</span>
    </p>
  )
}

function ContactForm() {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [topic, setTopic] = React.useState("general")
  const [message, setMessage] = React.useState("")
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [sent, setSent] = React.useState<{
    email: string
    topic: string
  } | null>(null)

  const nameRef = React.useRef<HTMLInputElement>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)
  const messageRef = React.useRef<HTMLTextAreaElement>(null)
  const confirmationRef = React.useRef<HTMLHeadingElement>(null)

  React.useEffect(() => {
    if (sent) {
      confirmationRef.current?.focus()
    }
  }, [sent])

  function clearError(field: FieldName) {
    setErrors((current) => {
      if (!current[field]) {
        return current
      }
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const next: FieldErrors = {}
    if (name.trim() === "") {
      next.name = "Enter your name."
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter an email address such as name@example.com."
    }
    if (message.trim().length < 20) {
      next.message =
        "Write a few words more, so we can help: at least 20 characters."
    }
    setErrors(next)

    if (next.name) {
      nameRef.current?.focus()
    } else if (next.email) {
      emailRef.current?.focus()
    } else if (next.message) {
      messageRef.current?.focus()
    } else {
      setSent({ email: email.trim(), topic })
    }
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
              className={fieldClasses}
            />
            {errors.name && (
              <FieldError id="contact-name-error">{errors.name}</FieldError>
            )}
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
              className={fieldClasses}
            />
            {errors.email && (
              <FieldError id="contact-email-error">{errors.email}</FieldError>
            )}
          </div>

          <div className="mt-6">
            <label htmlFor="contact-topic" className={fieldLabel}>
              Topic
            </label>
            <Select
              items={topics}
              value={topic}
              onValueChange={(value) => {
                if (value !== null) {
                  setTopic(value)
                }
              }}
            >
              <SelectTrigger id="contact-topic" className="mt-2">
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
              className={cn(fieldClasses, "resize-none")}
            />
            <p
              id="contact-message-hint"
              className="mt-2 text-body text-muted-foreground"
            >
              If you lost something, say which screening you were at.
            </p>
            {errors.message && (
              <FieldError id="contact-message-error">
                {errors.message}
              </FieldError>
            )}
          </div>

          <Button type="submit" className={cn(buttonClasses, "mt-6")}>
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
              className="text-h2 focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:outline-solid"
            >
              Thank you, your message is with us
            </h3>
            <p className="mt-4 max-w-xl">
              We will answer {topicPhrases[sent.topic]} at {sent.email} within
              two working days.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuButtonRef = React.useRef<HTMLButtonElement>(null)

  function handleHeaderKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (menuOpen && event.key === "Escape") {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header
        className="border-b border-border"
        onKeyDown={handleHeaderKeyDown}
      >
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
                    aria-current={page.href === "/visit" ? "page" : undefined}
                    className={cn(
                      navLink,
                      page.href === "/visit" && "underline"
                    )}
                  >
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            ref={menuButtonRef}
            variant="outline"
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(buttonClasses, "md:hidden")}
          >
            Menu
          </Button>
        </div>
        <nav
          id="main-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
        >
          <div className={cn(container, "py-2")}>
            <ul>
              {pages.map((page) => (
                <li key={page.href}>
                  <a
                    href={page.href}
                    aria-current={page.href === "/visit" ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      navLink,
                      "block py-2",
                      page.href === "/visit" && "underline"
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

      <main className={cn(container, "pt-12")}>
        <section className={grid}>
          <div className="md:col-span-7">
            <p className={mutedLabel}>Visit</p>
            <h1 className="mt-2 text-h1 md:text-display">Find the Vesper</h1>
            <p className="mt-6 max-w-xl">
              The Vesper stands in a rope works built in 1871, where rope for
              the harbour was laid along the length of Tallow Row. It has been a
              cinema since 1934. Today it has three screens, and a bar on the
              first floor that looks out over the street.
            </p>
          </div>
          <div
            className={cn(card, "mt-12 md:col-span-4 md:col-start-9 md:mt-0")}
          >
            <p className={mutedLabel}>Address</p>
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

        <section className="mt-24">
          <h2 className={sectionHeading}>Opening times</h2>
          <p className="mt-4 max-w-xl">
            The box office opens half an hour before the first film of the day.
          </p>
          <div className={cn(grid, "mt-6")}>
            <div className="md:col-span-8">
              <Table label="Opening times" className="text-body">
                <TableHeader>
                  <TableRow>
                    {[
                      "Day",
                      "Doors open",
                      "Last film starts",
                      "Bar closes",
                    ].map((column) => (
                      <TableHead
                        key={column}
                        scope="col"
                        className={mutedLabel}
                      >
                        {column}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openingTimes.map(({ day, hours }) => (
                    <TableRow key={day}>
                      <TableHead
                        scope="row"
                        className="py-2 font-sans text-body font-normal text-foreground"
                      >
                        {day}
                      </TableHead>
                      {hours ? (
                        <>
                          <TableCell>
                            <time
                              dateTime={hours.doors}
                              className="font-mono tabular-nums"
                            >
                              {hours.doors}
                            </time>
                          </TableCell>
                          <TableCell>
                            <time
                              dateTime={hours.lastFilm}
                              className="font-mono tabular-nums"
                            >
                              {hours.lastFilm}
                            </time>
                          </TableCell>
                          <TableCell>
                            <time
                              dateTime={hours.barCloses}
                              className="font-mono tabular-nums"
                            >
                              {hours.barCloses}
                            </time>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>Closed</TableCell>
                          <TableCell>
                            <span aria-hidden="true">—</span>
                            <span className="sr-only">Closed</span>
                          </TableCell>
                          <TableCell>
                            <span aria-hidden="true">—</span>
                            <span className="sr-only">Closed</span>
                          </TableCell>
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
              <article key={screen.name} className={card}>
                <h3 className="text-h2">{screen.name}</h3>
                <p className={cn(mutedLabel, "mt-2 tabular-nums")}>
                  {screen.seats} seats · {screen.format}
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

        <section className={cn(grid, "mt-24")}>
          <figure className="md:col-span-7">
            <div
              role="img"
              aria-label="The first-floor bar at night, with its long zinc counter and the windows over Tallow Row"
              className="aspect-video rounded-xl border border-border bg-muted"
            />
            <figcaption className={cn(mutedLabel, "mt-2")}>
              The bar · An hour before the late show
            </figcaption>
          </figure>
          <div className="mt-6 md:col-span-5 md:mt-0">
            <h2 className={sectionHeading}>The bar</h2>
            <p className="mt-4 max-w-xl">
              The bar is on the first floor, up the main stairs or the lift
              beside the box office. It pours beer from three Oldmere breweries,
              makes coffee until it closes and sends out small plates until
              21:00.
            </p>
            <p className="mt-4 max-w-xl">
              You can take a drink into Screens 1 and 2. Screen 3 is too small
              for glasses, so finish yours at the counter first.
            </p>
            <p className={cn(mutedLabel, "mt-4")}>
              Opens with the doors · Until midnight Fri and Sat
            </p>
          </div>
        </section>

        <section className="mt-24">
          <h2 className={sectionHeading}>Getting here</h2>
          <dl className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {routes.map((route) => (
              <div key={route.by} className="border-t border-border pt-4">
                <dt className={mutedLabel}>{route.by}</dt>
                <dd className="mt-2 max-w-xl text-body">{route.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="contact" className={cn(grid, "mt-24")}>
          <div className="md:col-span-5">
            <h2 className={sectionHeading}>Write to us</h2>
            <p className="mt-4 max-w-xl">
              Ask us about access, private hire or lost property, and we will
              answer within two working days.
            </p>
          </div>
          <ContactForm />
        </section>
      </main>

      <footer className="mt-24 border-t border-border py-12">
        <div className={container}>
          <div className={grid}>
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
          <p className={cn(mutedLabel, "mt-12")}>© 2026 The Vesper</p>
        </div>
      </footer>
    </div>
  )
}

export default App
