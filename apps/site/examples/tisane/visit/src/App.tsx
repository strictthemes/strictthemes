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

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)

const chromeLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const label = "font-mono text-label"

type Span = { from: string; to: string } | null

type Day = {
  name: string
  // Day of the week as JavaScript counts it: 0 is Sunday.
  jsDay: number
  room: Span
  kitchen: Span
}

const kitchenHours = { from: "11:30", to: "14:30" }

const days: Day[] = [
  { name: "Monday", jsDay: 1, room: null, kitchen: null },
  {
    name: "Tuesday",
    jsDay: 2,
    room: { from: "09:00", to: "17:00" },
    kitchen: kitchenHours,
  },
  {
    name: "Wednesday",
    jsDay: 3,
    room: { from: "09:00", to: "17:00" },
    kitchen: kitchenHours,
  },
  {
    name: "Thursday",
    jsDay: 4,
    room: { from: "09:00", to: "17:00" },
    kitchen: kitchenHours,
  },
  {
    name: "Friday",
    jsDay: 5,
    room: { from: "09:00", to: "17:00" },
    kitchen: kitchenHours,
  },
  {
    name: "Saturday",
    jsDay: 6,
    room: { from: "09:00", to: "18:00" },
    kitchen: kitchenHours,
  },
  {
    name: "Sunday",
    jsDay: 0,
    room: { from: "10:00", to: "16:00" },
    kitchen: kitchenHours,
  },
]

// "09:00" reads "9:00"; the dateTime keeps two-digit hours.
function clock(value: string) {
  return value.replace(/^0/, "")
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

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Book a table", href: "/booking" },
  { label: "Journal", href: "/journal" },
  { label: "Visit", href: "/visit", current: true },
]

const routes = [
  {
    title: "By train",
    text: "Ashby Wold station is a four-minute walk away. Leave by the main exit and turn left onto Station Road.",
  },
  {
    title: "By bus",
    text: "The 12 and the 31 stop outside Orchard Park, across the road from our door.",
  },
  {
    title: "By bike",
    text: "There are four bike stands on Mill Lane, just beside the entrance.",
  },
  {
    title: "By car",
    text: "There is no parking on Mill Lane. The car park on Station Road is three minutes away on foot.",
  },
]

const accessNotes = [
  "The entrance on Mill Lane is step-free.",
  "There is an accessible toilet on the ground floor.",
  "Two tables by the window are at wheelchair height.",
  "A printed large-type menu is kept at the counter.",
  "Assistance dogs are welcome.",
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

const fieldOrder: Field[] = ["name", "email", "about", "message"]
const fieldIds: Record<Field, string> = {
  name: "contact-name",
  email: "contact-email",
  about: "contact-about",
  message: "contact-message",
}

function isEmail(value: string) {
  if (/\s/.test(value)) return false
  const parts = value.split("@")
  if (parts.length !== 2) return false
  const [local, domain] = parts
  return local.length > 0 && domain.includes(".")
}

function ErrorLine({ id, children }: { id: string; children: string }) {
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
      <span>{children}</span>
    </p>
  )
}

function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [about, setAbout] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [sentTo, setSentTo] = useState<string | null>(null)
  const thanksRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (sentTo !== null) thanksRef.current?.focus()
  }, [sentTo])

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
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()

    if (!trimmedName) next.name = "Write your name."
    if (!trimmedEmail) next.email = "Write your email address."
    else if (!isEmail(trimmedEmail))
      next.email = "Check the email address: it needs an @ and a domain."
    if (!about) next.about = "Choose what your message is about."
    if (!trimmedMessage) next.message = "Write a message."

    setErrors(next)
    const first = fieldOrder.find((field) => next[field])
    if (first) {
      document.getElementById(fieldIds[first])?.focus()
      return
    }
    setSentTo(trimmedEmail)
  }

  const errorId = (field: Field) => `${fieldIds[field]}-error`

  return (
    <div className="mt-6 rounded-xl border bg-card p-6">
      {sentTo === null && (
        <form noValidate aria-label="Write to us" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor={fieldIds.name}
              className="block font-mono text-label text-foreground"
            >
              Your name
            </label>
            <Input
              id={fieldIds.name}
              autoComplete="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                clearError("name")
              }}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? errorId("name") : undefined}
              className="mt-2 h-auto rounded-md px-4 py-2 text-body md:text-body"
            />
            {errors.name && (
              <ErrorLine id={errorId("name")}>{errors.name}</ErrorLine>
            )}
          </div>

          <div className="mt-6">
            <label
              htmlFor={fieldIds.email}
              className="block font-mono text-label text-foreground"
            >
              Email address
            </label>
            <Input
              id={fieldIds.email}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                clearError("email")
              }}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? errorId("email") : undefined}
              className="mt-2 h-auto rounded-md px-4 py-2 text-body md:text-body"
            />
            {errors.email && (
              <ErrorLine id={errorId("email")}>{errors.email}</ErrorLine>
            )}
          </div>

          <div className="mt-6">
            <label
              id={`${fieldIds.about}-label`}
              htmlFor={fieldIds.about}
              className="block font-mono text-label text-foreground"
            >
              About
            </label>
            <Select
              items={subjects}
              value={about}
              onValueChange={(value) => {
                if (value === null) return
                setAbout(value)
                clearError("about")
              }}
            >
              <SelectTrigger
                id={fieldIds.about}
                aria-labelledby={`${fieldIds.about}-label`}
                aria-invalid={errors.about ? true : undefined}
                aria-describedby={errors.about ? errorId("about") : undefined}
                className="mt-2"
              >
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.about && (
              <ErrorLine id={errorId("about")}>{errors.about}</ErrorLine>
            )}
          </div>

          <div className="mt-6">
            <label
              htmlFor={fieldIds.message}
              className="block font-mono text-label text-foreground"
            >
              Message
            </label>
            <Textarea
              id={fieldIds.message}
              value={message}
              onChange={(event) => {
                setMessage(event.target.value)
                clearError("message")
              }}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? errorId("message") : undefined}
              className="mt-2 h-auto min-h-48 resize-none rounded-md px-4 py-2 text-body md:text-body"
            />
            {errors.message && (
              <ErrorLine id={errorId("message")}>{errors.message}</ErrorLine>
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
        {sentTo !== null && (
          <div>
            <h3
              ref={thanksRef}
              tabIndex={-1}
              className="text-h2 focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:outline-solid"
            >
              Thank you
            </h3>
            <p className="mt-4 wrap-break-word">
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
  // Set once from the visitor's clock when the page loads.
  const [today] = useState(() => new Date().getDay())

  return (
    <div className="mx-auto max-w-[1120px] px-4 text-body md:px-6">
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
        <section className="grid grid-cols-1 gap-6 pt-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className={cn(label, "text-muted-foreground")}>
              Mill Lane, Ashby Wold
            </p>
            <h1 className="mt-2 text-h1">Visit us</h1>
            <p className="mt-4 max-w-xl">
              We are on the corner of Mill Lane and Station Road, opposite
              Orchard Park, a short walk from the station. There is no need to
              book a table unless you are four or more.
            </p>
          </div>
        </section>

        <section className="mt-18 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-4">
            <h2 className="text-h2">Address</h2>
            <address className="mt-4 not-italic">
              <span className="block">14 Mill Lane</span>
              <span className="block">Ashby Wold</span>
              <span className="block">AW3 7LN</span>
              <p className="mt-4">
                <a href="tel:+441632960418" className={textLink}>
                  01632 960 418
                </a>
              </p>
              <p className="mt-2 wrap-break-word">
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
                    {["Day", "Room", "Kitchen"].map((heading) => (
                      <TableHead
                        key={heading}
                        scope="col"
                        className="h-auto px-4 py-2 font-mono text-label text-muted-foreground first:pl-0 last:pr-0"
                      >
                        {heading}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {days.map((day) => {
                    const isToday = day.jsDay === today
                    return (
                      <TableRow
                        key={day.name}
                        aria-current={isToday ? "date" : undefined}
                        className="hover:bg-transparent"
                      >
                        <TableHead
                          scope="row"
                          className="h-auto px-4 py-2 text-left font-sans text-body font-normal whitespace-normal text-foreground first:pl-0 last:pr-0"
                        >
                          {day.name}
                          {isToday && (
                            <span className="block font-mono text-label text-primary">
                              Today
                            </span>
                          )}
                        </TableHead>
                        <TableCell className="px-4 py-2 font-mono text-label whitespace-nowrap text-foreground tabular-nums first:pl-0 last:pr-0">
                          <Hours span={day.room} />
                        </TableCell>
                        <TableCell className="px-4 py-2 font-mono text-label whitespace-nowrap text-foreground tabular-nums first:pl-0 last:pr-0">
                          <Hours span={day.kitchen} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        <section className="mt-18 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <h2 className="text-h2">Getting here</h2>
            <ul className="mt-6">
              {routes.map((route, index) => (
                <li
                  key={route.title}
                  className={index > 0 ? "mt-6" : undefined}
                >
                  <h3 className="text-body">{route.title}</h3>
                  <p className="mt-2 text-body">{route.text}</p>
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
                <div className="absolute inset-y-0 left-1/4 w-4 border-x border-muted-foreground bg-background" />
                <div className="absolute inset-x-0 top-1/2 h-4 border-y border-muted-foreground bg-background" />
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

        <section className="mt-18 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="text-h2">Access</h2>
            <ul className="mt-4 list-disc pl-6">
              {accessNotes.map((note, index) => (
                <li key={note} className={index > 0 ? "mt-2" : undefined}>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="contact"
          className="mt-18 grid grid-cols-1 gap-6 md:grid-cols-12"
        >
          <div className="md:col-span-7">
            <h2 className="text-h2">Write to us</h2>
            <p className="mt-4 max-w-xl">
              Hannah and Tomas, who run the room, read every message themselves
              and answer within two days.
            </p>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="mt-18">
        <div className="border-t py-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">The Linden Room</p>
              <p className="mt-2 max-w-xl">
                A small tea room and shop in Ashby Wold, pouring loose-leaf tea
                and serving lunch plates since 2014.
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
