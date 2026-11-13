import { useEffect, useRef, useState } from "react"
import type { FormEvent, KeyboardEvent } from "react"
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
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline aria-[current=page]:underline",
  focusRing
)
const buttonClass = "h-auto px-6 py-2 font-mono text-label uppercase"
const fieldLabel = "block font-mono text-label uppercase text-foreground"
const fieldClass = "mt-2 h-auto px-4 py-2 text-body md:text-body"
const errorClass = "mt-2 flex items-start gap-2 text-body text-destructive"
const sectionHeading = "text-h2 md:text-h1"

const navItems = [
  { label: "Programme", href: "/" },
  { label: "Seasons", href: "/season" },
  { label: "Membership", href: "/membership" },
  { label: "Visit", href: "/visit" },
]
const currentHref = "/visit"

type Hours = {
  day: string
  doors?: string
  lastFilm?: string
  bar?: string
}

const openingTimes: Hours[] = [
  { day: "Monday" },
  { day: "Tuesday", doors: "17:00", lastFilm: "21:00", bar: "23:30" },
  { day: "Wednesday", doors: "17:00", lastFilm: "21:00", bar: "23:30" },
  { day: "Thursday", doors: "17:00", lastFilm: "21:00", bar: "23:30" },
  { day: "Friday", doors: "16:00", lastFilm: "23:15", bar: "00:00" },
  { day: "Saturday", doors: "16:00", lastFilm: "23:15", bar: "00:00" },
  { day: "Sunday", doors: "13:00", lastFilm: "20:30", bar: "22:30" },
]

const screens = [
  {
    name: "Screen 1",
    seats: 212,
    format: "35mm and digital",
    about:
      "The old rope walk's long hall, with a raked floor, a curtain and the only projection box in town that still runs 35mm prints.",
    access: [
      "Step-free from the street through the main foyer.",
      "Four wheelchair spaces in row F, each with a companion seat beside it.",
      "A hearing loop covers every seat.",
      "Row F and the aisle seats in row A have extra legroom.",
      "Captioned screenings every Tuesday.",
    ],
  },
  {
    name: "Screen 2",
    seats: 84,
    format: "Digital",
    about:
      "A smaller room in the former tarring shed, with deep seats and a screen wide enough for scope films at their full width.",
    access: [
      "Step-free from the street, along the ground-floor corridor past the box office.",
      "Two wheelchair spaces at the back of the room, level with the entrance.",
      "A hearing loop covers every seat.",
      "The front row has extra legroom.",
      "Captioned screenings every Tuesday.",
    ],
  },
  {
    name: "Screen 3",
    seats: 38,
    format: "Digital",
    about:
      "The loft under the roof beams, where we show short runs, documentaries and the late films that find a small, loyal crowd.",
    access: [
      "Up one flight of 22 stairs from the bar, with a handrail on both sides. There is no lift.",
      "No wheelchair spaces, as the room cannot be reached without stairs.",
      "A hearing loop covers every seat.",
      "The two seats at the end of the back row have extra legroom.",
      "Captioned screenings every Tuesday.",
    ],
  },
]

const travel = [
  {
    term: "By tram",
    text: "Take the Harbour line to Tallow Row. The cinema is three minutes' walk from the stop, down the hill towards the water.",
  },
  {
    term: "By bus",
    text: "The 14 and the 31 stop on Quay Street, five minutes' walk away. The 31 runs until after the last film on Fridays and Saturdays.",
  },
  {
    term: "By bike",
    text: "There are twelve covered stands in the yard by the main door, free to use while you are with us.",
  },
  {
    term: "By car",
    text: "We have no car park. The Ropeyard car park on Mill Lane is open all night and takes eight minutes to walk from.",
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

type Errors = { name?: string; email?: string; message?: string }

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function Time({ value }: { value: string }) {
  return (
    <time dateTime={value} className="font-mono tabular-nums">
      {value}
    </time>
  )
}

function ClosedCell() {
  return (
    <>
      <span aria-hidden="true">—</span>
      <span className="sr-only">Closed</span>
    </>
  )
}

function FieldError({ id, text }: { id: string; text: string }) {
  return (
    <p id={id} className={errorClass}>
      <CircleAlert
        className="mt-1 size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span>{text}</span>
    </p>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

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
  const confirmRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (sent) confirmRef.current?.focus()
  }, [sent])

  function onHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()
    const next: Errors = {}
    if (!trimmedName) next.name = "Enter your name."
    if (!trimmedEmail || !isEmail(trimmedEmail))
      next.email = "Enter an email address such as name@example.com."
    if (trimmedMessage.length < 20)
      next.message =
        "Write a few words more, so we can help: at least 20 characters."
    setErrors(next)
    if (next.name) nameRef.current?.focus()
    else if (next.email) emailRef.current?.focus()
    else if (next.message) messageRef.current?.focus()
    else setSent({ topic, email: trimmedEmail })
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border" onKeyDown={onHeaderKeyDown}>
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
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={navLink}
                    aria-current={
                      item.href === currentHref ? "page" : undefined
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            ref={menuButtonRef}
            variant="outline"
            className={cn(buttonClass, "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-border md:hidden"
          hidden={!menuOpen}
        >
          <div className={cn(container, "py-2")}>
            <ul>
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={cn(navLink, "block py-2")}
                    aria-current={
                      item.href === currentHref ? "page" : undefined
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className={cn(container, "pt-12")}>
        <section className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-7">
            <p className={cn(label, "text-muted-foreground")}>Visit</p>
            <h1 className="mt-2 text-h1 md:text-display">Find the Vesper</h1>
            <p className="mt-6 max-w-xl">
              The Vesper stands in a rope works built in 1871, where the long
              hall once held a quarter-mile of twisting hemp. It has been a
              cinema since 1934. Today it has three screens, from a 212-seat
              hall to a 38-seat loft, and a bar on the first floor that stays
              open after the last film.
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
              <a
                href="mailto:hello@vesper.example"
                className={cn(textLink, "wrap-break-word")}
              >
                hello@vesper.example
              </a>
            </p>
          </div>
        </section>

        <section className="mt-24">
          <h2 className={sectionHeading}>Opening times</h2>
          <p className="mt-4 max-w-xl">
            The box office opens half an hour before the first film of the
            day.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
            <div className="min-w-0 md:col-span-8">
              <Table label="Opening times" className="text-body">
                <TableHeader>
                  <TableRow>
                    {["Day", "Doors open", "Last film starts", "Bar closes"].map(
                      (heading) => (
                        <TableHead
                          key={heading}
                          scope="col"
                          className="px-4 font-mono text-label text-muted-foreground uppercase first:pl-0 last:pr-0"
                        >
                          {heading}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openingTimes.map((row) => {
                    const cell = "px-4 py-2 first:pl-0 last:pr-0"
                    return (
                      <TableRow key={row.day}>
                        <TableHead
                          scope="row"
                          className="px-4 py-2 font-sans text-body font-normal text-foreground first:pl-0 last:pr-0"
                        >
                          {row.day}
                        </TableHead>
                        <TableCell className={cell}>
                          {row.doors ? <Time value={row.doors} /> : "Closed"}
                        </TableCell>
                        <TableCell className={cell}>
                          {row.lastFilm ? (
                            <Time value={row.lastFilm} />
                          ) : (
                            <ClosedCell />
                          )}
                        </TableCell>
                        <TableCell className={cell}>
                          {row.bar ? <Time value={row.bar} /> : <ClosedCell />}
                        </TableCell>
                      </TableRow>
                    )
                  })}
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
                <p
                  className={cn(
                    label,
                    "mt-2 text-muted-foreground tabular-nums"
                  )}
                >
                  {screen.seats} {screen.seats === 1 ? "seat" : "seats"} ·{" "}
                  {screen.format}
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
            <h2 className={sectionHeading}>The bar</h2>
            <p className="mt-4 max-w-xl">
              Upstairs, under the old rope loft, the bar pours beer from three
              breweries within ten miles of Oldmere, makes coffee until late
              and serves small plates until 21:00: flatbreads, pickles, a soup
              that changes with the week.
            </p>
            <p className="mt-4 max-w-xl">
              You can take a drink into Screens 1 and 2, in the glass it came
              in. Screen 3 is too close to the beams for anything but water.
            </p>
            <p className={cn(label, "mt-4 text-muted-foreground")}>
              Opens with the doors · Until midnight Fri and Sat
            </p>
          </div>
        </section>

        <section className="mt-24">
          <h2 className={sectionHeading}>Getting here</h2>
          <dl className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {travel.map((entry) => (
              <div key={entry.term} className="border-t border-border pt-4">
                <dt className={cn(label, "text-muted-foreground")}>
                  {entry.term}
                </dt>
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
              Ask us about access, private hire or lost property, and we will
              answer within two working days.
            </p>
          </div>
          <div className="mt-12 md:col-span-6 md:col-start-7 md:mt-0">
            {!sent && (
              <form noValidate onSubmit={onSubmit}>
                <div>
                  <label htmlFor="name" className={fieldLabel}>
                    Your name
                  </label>
                  <Input
                    ref={nameRef}
                    id="name"
                    autoComplete="name"
                    className={fieldClass}
                    value={name}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    onChange={(event) => {
                      setName(event.target.value)
                      setErrors((prev) => ({ ...prev, name: undefined }))
                    }}
                  />
                  {errors.name && (
                    <FieldError id="name-error" text={errors.name} />
                  )}
                </div>
                <div className="mt-6">
                  <label htmlFor="email" className={fieldLabel}>
                    Email address
                  </label>
                  <Input
                    ref={emailRef}
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={fieldClass}
                    value={email}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      setErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                  />
                  {errors.email && (
                    <FieldError id="email-error" text={errors.email} />
                  )}
                </div>
                <div className="mt-6">
                  <label
                    id="topic-label"
                    htmlFor="topic"
                    className={fieldLabel}
                  >
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
                      id="topic"
                      aria-labelledby="topic-label"
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
                  <label htmlFor="message" className={fieldLabel}>
                    Message
                  </label>
                  <Textarea
                    ref={messageRef}
                    id="message"
                    rows={5}
                    className={cn(fieldClass, "resize-none")}
                    value={message}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={
                      errors.message
                        ? "message-hint message-error"
                        : "message-hint"
                    }
                    onChange={(event) => {
                      setMessage(event.target.value)
                      setErrors((prev) => ({ ...prev, message: undefined }))
                    }}
                  />
                  <p
                    id="message-hint"
                    className="mt-2 text-body text-muted-foreground"
                  >
                    If you lost something, say which screening you were at.
                  </p>
                  {errors.message && (
                    <FieldError id="message-error" text={errors.message} />
                  )}
                </div>
                <Button type="submit" className={cn(buttonClass, "mt-6")}>
                  Send message
                </Button>
              </form>
            )}
            <div role="status">
              {sent && (
                <>
                  <h3
                    ref={confirmRef}
                    tabIndex={-1}
                    className={cn("text-h2", codeFocusRing)}
                  >
                    Thank you, your message is with us
                  </h3>
                  <p className="mt-4 max-w-xl wrap-break-word">
                    We will answer {topicPhrase[sent.topic]} at {sent.email}{" "}
                    within two working days.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

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
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={textLink}>
                    {item.label}
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
    </div>
  )
}

export default App
