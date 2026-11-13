import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert, MapPin } from "lucide-react"

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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusOutline =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const chromeLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)
const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)
const label = "font-mono text-label"
const fieldLabel = "block font-mono text-label text-foreground"
const fieldClass = "mt-2 h-auto rounded-md px-4 py-2 text-body md:text-body"

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Book a table", href: "/booking" },
  { label: "Journal", href: "/journal" },
  { label: "Visit", href: "/visit", current: true },
]

type Span = { from: string; to: string } | null

// Days in JavaScript's order: getDay() returns 0 for Sunday.
const hours: { day: string; jsDay: number; room: Span; kitchen: Span }[] = [
  { day: "Monday", jsDay: 1, room: null, kitchen: null },
  {
    day: "Tuesday",
    jsDay: 2,
    room: { from: "09:00", to: "17:00" },
    kitchen: { from: "11:30", to: "14:30" },
  },
  {
    day: "Wednesday",
    jsDay: 3,
    room: { from: "09:00", to: "17:00" },
    kitchen: { from: "11:30", to: "14:30" },
  },
  {
    day: "Thursday",
    jsDay: 4,
    room: { from: "09:00", to: "17:00" },
    kitchen: { from: "11:30", to: "14:30" },
  },
  {
    day: "Friday",
    jsDay: 5,
    room: { from: "09:00", to: "17:00" },
    kitchen: { from: "11:30", to: "14:30" },
  },
  {
    day: "Saturday",
    jsDay: 6,
    room: { from: "09:00", to: "18:00" },
    kitchen: { from: "11:30", to: "14:30" },
  },
  {
    day: "Sunday",
    jsDay: 0,
    room: { from: "10:00", to: "16:00" },
    kitchen: { from: "11:30", to: "14:30" },
  },
]

function clock(t: string) {
  return t.replace(/^0/, "")
}

function Hours({ span }: { span: Span }) {
  if (!span) return <>Closed</>
  return (
    <>
      <time dateTime={span.from}>{clock(span.from)}</time>–
      <time dateTime={span.to}>{clock(span.to)}</time>
    </>
  )
}

const ways = [
  {
    title: "By train",
    text: "Ashby Wold station is a four-minute walk. Leave by the main entrance and turn left down Station Road.",
  },
  {
    title: "By bus",
    text: "The 12 and 31 buses stop outside Orchard Park, across the road from our door.",
  },
  {
    title: "By bike",
    text: "There are four bike stands on Mill Lane, just to the right of the entrance.",
  },
  {
    title: "By car",
    text: "There is no parking on Mill Lane. The car park on Station Road is three minutes away on foot.",
  },
]

const accessNotes = [
  "The entrance on Mill Lane is step-free, with a wide door.",
  "There is an accessible toilet on the ground floor.",
  "Two tables by the window are at wheelchair height.",
  "A printed large-type menu waits at the counter: just ask for it.",
  "Assistance dogs are welcome, and we keep a water bowl by the door.",
  "On Tuesdays the first hour is quiet, with the music off.",
]

const subjects = [
  { value: "booking", label: "A booking" },
  { value: "tea", label: "Buying tea" },
  { value: "access", label: "Access" },
  { value: "other", label: "Something else" },
]

type Field = "name" | "email" | "about" | "message"
type Errors = Partial<Record<Field, string>>

function ErrorLine({ id, text }: { id: string; text: string }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert
        className="size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span>{text}</span>
    </p>
  )
}

function ContactCard() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [about, setAbout] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [sentTo, setSentTo] = useState<string | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const aboutRef = useRef<HTMLButtonElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const thanksRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (sentTo) thanksRef.current?.focus()
  }, [sentTo])

  function clear(field: Field) {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Errors = {}
    const address = email.trim()
    if (!name.trim()) next.name = "Write your name."
    if (!address) next.email = "Write your email address."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address))
      next.email = "Check the email address: it needs an @ and a domain."
    if (!about) next.about = "Choose what your message is about."
    if (!message.trim()) next.message = "Write a message."
    setErrors(next)

    const refs = {
      name: nameRef,
      email: emailRef,
      about: aboutRef,
      message: messageRef,
    }
    const first = (["name", "email", "about", "message"] as Field[]).find(
      (f) => next[f]
    )
    if (first) {
      refs[first].current?.focus()
      return
    }
    setSentTo(address)
  }

  return (
    <div className="mt-6 rounded-xl border bg-card p-6">
      {!sentTo && (
        <form noValidate aria-label="Write to us" onSubmit={handleSubmit}>
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
              onChange={(e) => {
                setName(e.target.value)
                clear("name")
              }}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              className={fieldClass}
            />
            {errors.name && (
              <ErrorLine id="contact-name-error" text={errors.name} />
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
              onChange={(e) => {
                setEmail(e.target.value)
                clear("email")
              }}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={
                errors.email ? "contact-email-error" : undefined
              }
              className={fieldClass}
            />
            {errors.email && (
              <ErrorLine id="contact-email-error" text={errors.email} />
            )}
          </div>

          <div className="mt-6">
            <label htmlFor="contact-about" className={fieldLabel}>
              About
            </label>
            <Select
              items={subjects}
              value={about}
              onValueChange={(value) => {
                if (value === null) return
                setAbout(value)
                clear("about")
              }}
            >
              <SelectTrigger
                ref={aboutRef}
                id="contact-about"
                aria-invalid={errors.about ? true : undefined}
                aria-describedby={
                  errors.about ? "contact-about-error" : undefined
                }
                className="mt-2"
              >
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.about && (
              <ErrorLine id="contact-about-error" text={errors.about} />
            )}
          </div>

          <div className="mt-6">
            <label htmlFor="contact-message" className={fieldLabel}>
              Message
            </label>
            <Textarea
              ref={messageRef}
              id="contact-message"
              name="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                clear("message")
              }}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={
                errors.message ? "contact-message-error" : undefined
              }
              className={cn(fieldClass, "min-h-48 resize-none")}
            />
            {errors.message && (
              <ErrorLine id="contact-message-error" text={errors.message} />
            )}
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              className="h-auto rounded-md px-6 py-2 font-mono text-label"
            >
              Send message
            </Button>
          </div>
        </form>
      )}
      <div role="status">
        {sentTo && (
          <div>
            <h3
              ref={thanksRef}
              tabIndex={-1}
              className={cn("text-h2 text-foreground", codeFocusOutline)}
            >
              Thank you
            </h3>
            <p className="mt-4">
              Your message is with us, and an answer will reach {sentTo} within
              two days.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export function App() {
  const [today] = useState(() => new Date().getDay())

  return (
    <div className="mx-auto max-w-[1120px] px-4 text-body text-foreground md:px-6">
      <header className="flex flex-col items-start gap-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", chromeLink)}>
          The Linden Room
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(
                    "text-body",
                    chromeLink,
                    link.current && "underline"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="grid gap-6 pt-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className={cn(label, "text-muted-foreground")}>
              Mill Lane, Ashby Wold
            </p>
            <h1 className="mt-2 text-h1">Visit us</h1>
            <p className="mt-4 max-w-xl">
              We are on the corner of Mill Lane and Station Road, opposite
              Orchard Park, four minutes from the station. Come as you are:
              there is no need to book unless you are four or more, and then you
              can{" "}
              <a href="/booking" className={textLink}>
                book a table
              </a>{" "}
              here.
            </p>
          </div>
        </section>

        <section className="mt-18 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-4">
            <h2 className="text-h2">Address</h2>
            <address className="mt-4 text-body not-italic">
              <span className="block">14 Mill Lane</span>
              <span className="block">Ashby Wold</span>
              <span className="block">AW3 7LN</span>
              <p className="mt-4">
                <a href="tel:+441632960418" className={textLink}>
                  01632 960 418
                </a>
              </p>
              <p className="mt-2">
                <a href="mailto:hello@lindenroom.example" className={textLink}>
                  hello@lindenroom.example
                </a>
              </p>
            </address>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <h2 className="text-h2">Opening hours</h2>
            <div className="mt-6">
              <Table label="Opening hours" className="text-body">
                <TableCaption className="sr-only">Opening hours</TableCaption>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    {["Day", "Room", "Kitchen"].map((h) => (
                      <TableHead
                        key={h}
                        scope="col"
                        className="h-auto px-4 py-2 font-mono text-label text-muted-foreground first:pl-0 last:pr-0"
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hours.map((row) => {
                    const isToday = row.jsDay === today
                    return (
                      <TableRow
                        key={row.day}
                        aria-current={isToday ? "date" : undefined}
                        className="hover:bg-transparent"
                      >
                        <TableHead
                          scope="row"
                          className="h-auto px-4 py-2 text-left font-sans text-body font-normal whitespace-normal text-foreground first:pl-0 last:pr-0"
                        >
                          {row.day}
                          {isToday && (
                            <span className="block font-mono text-label text-primary">
                              Today
                            </span>
                          )}
                        </TableHead>
                        <TableCell className="px-4 py-2 font-mono text-label whitespace-nowrap text-foreground tabular-nums first:pl-0 last:pr-0">
                          <Hours span={row.room} />
                        </TableCell>
                        <TableCell className="px-4 py-2 font-mono text-label whitespace-nowrap text-foreground tabular-nums first:pl-0 last:pr-0">
                          <Hours span={row.kitchen} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        <section className="mt-18 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <h2 className="text-h2">Getting here</h2>
            <ul className="mt-6 list-none p-0">
              {ways.map((way, i) => (
                <li key={way.title} className={i > 0 ? "mt-6" : undefined}>
                  <h3 className="text-body">{way.title}</h3>
                  <p className="mt-2 max-w-xl text-body">{way.text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <figure>
              <div
                role="img"
                aria-label="Map of the streets around The Linden Room"
                aria-describedby="directions"
                className="relative aspect-4/3 overflow-hidden rounded-xl border bg-muted"
              >
                <div className="absolute inset-x-0 top-1/2 h-4 bg-background" />
                <div className="absolute inset-y-0 left-1/4 w-4 bg-background" />
                <div className="absolute inset-x-0 top-1/6 h-1 bg-secondary" />
                <div className="absolute right-1/12 bottom-1/12 flex h-1/5 w-2/5 items-center justify-center border bg-card">
                  <span className="rounded-sm bg-card px-2 py-1 font-mono text-label whitespace-nowrap text-foreground">
                    Orchard Park
                  </span>
                </div>
                <span className="absolute right-1/12 bottom-1/2 rounded-sm bg-card px-2 py-1 font-mono text-label whitespace-nowrap text-foreground">
                  Station Road
                </span>
                <span className="absolute top-1/4 left-1/4 rounded-sm bg-card px-2 py-1 font-mono text-label whitespace-nowrap text-foreground">
                  Mill Lane
                </span>
                <div className="absolute top-7/12 left-1/4 flex items-center gap-1">
                  <MapPin
                    className="size-6 text-primary"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="rounded-sm border bg-card px-2 py-1 font-mono text-label whitespace-nowrap text-foreground">
                    The Linden Room
                  </span>
                </div>
              </div>
              <figcaption className={cn(label, "mt-2 text-muted-foreground")}>
                Not to scale
              </figcaption>
            </figure>
            <p id="directions" className="mt-4 max-w-xl text-body">
              From the station, walk down Station Road for four minutes. We are
              on the corner with Mill Lane, opposite Orchard Park.
            </p>
          </div>
        </section>

        <section className="mt-18 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="text-h2">Access</h2>
            <ul className="mt-4 max-w-xl list-disc pl-6">
              {accessNotes.map((note, i) => (
                <li key={note} className={i > 0 ? "mt-2" : undefined}>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="mt-18 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="text-h2">Write to us</h2>
            <p className="mt-4 max-w-xl">
              Ruth Ashdown, who runs the room, reads every message herself and
              answers within two days.
            </p>
            <ContactCard />
          </div>
        </section>
      </main>

      <footer className="mt-18">
        <div className="border-t py-10">
          <div className="grid gap-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">The Linden Room</p>
              <p className="mt-2 max-w-xl">
                A tea room and tea shop on Mill Lane, pouring loose-leaf tea and
                serving plates at lunchtime.
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <address className="not-italic">
                <span className="block">14 Mill Lane</span>
                <span className="block">Ashby Wold</span>
                <span className="block">AW3 7LN</span>
              </address>
              <p className={cn(label, "mt-4 text-muted-foreground")}>
                Tuesday to Sunday · Closed Mondays
              </p>
            </div>
          </div>
          <p className={cn(label, "mt-6 text-muted-foreground")}>
            © 2026 The Linden Room
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
