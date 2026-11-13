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

const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)

const chromeLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Book a table", href: "/booking" },
  { label: "Journal", href: "/journal" },
  { label: "Visit", href: "/visit" },
]

type Span = { from: string; to: string } | null

const room = (from: string, to: string): Span => ({ from, to })
const kitchen: Span = { from: "11:30", to: "14:30" }

// `day` is the number Date.getDay() returns for that weekday.
const hours: { name: string; day: number; room: Span; kitchen: Span }[] = [
  { name: "Monday", day: 1, room: null, kitchen: null },
  { name: "Tuesday", day: 2, room: room("09:00", "17:00"), kitchen },
  { name: "Wednesday", day: 3, room: room("09:00", "17:00"), kitchen },
  { name: "Thursday", day: 4, room: room("09:00", "17:00"), kitchen },
  { name: "Friday", day: 5, room: room("09:00", "17:00"), kitchen },
  { name: "Saturday", day: 6, room: room("09:00", "18:00"), kitchen },
  { name: "Sunday", day: 0, room: room("10:00", "16:00"), kitchen },
]

// "09:00" is shown as "9:00"; the dateTime keeps two-digit hours.
function Clock({ value }: { value: string }) {
  return <time dateTime={value}>{value.replace(/^0/, "")}</time>
}

function Hours({ span }: { span: Span }) {
  if (!span) return <>Closed</>
  return (
    <>
      <Clock value={span.from} />–<Clock value={span.to} />
    </>
  )
}

const routes = [
  {
    title: "By train",
    text: "Ashby Wold station is a four-minute walk. Leave by the main exit and turn right down Station Road.",
  },
  {
    title: "By bus",
    text: "The 12 and 31 stop outside Orchard Park, across the road from our door.",
  },
  {
    title: "By bike",
    text: "There is a rack for six bikes beside the entrance on Mill Lane, under the linden tree.",
  },
  {
    title: "By car",
    text: "There is no parking on Mill Lane. The car park on Station Road is three minutes away on foot.",
  },
]

const accessNotes = [
  "The entrance on Mill Lane is step-free, with a door wide enough for any chair.",
  "There is an accessible toilet on the ground floor.",
  "Two tables by the window are at wheelchair height.",
  "A printed large-type menu waits at the counter: ask for it whenever you like.",
  "Assistance dogs are welcome, with a bowl of water by the door.",
  "The first hour on Tuesdays is a quiet hour, with the music off.",
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

const tag =
  "rounded-sm bg-card px-2 py-1 font-mono text-label whitespace-nowrap text-foreground"

const labelClass = "block font-mono text-label text-foreground"
const fieldClass = "mt-2 h-auto rounded-md px-4 py-2 text-body md:text-body"

function ErrorLine({ id, message }: { id: string; message: string }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      <span>{message}</span>
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

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const aboutRef = useRef<HTMLButtonElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
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
    const values = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    }
    const found: Errors = {}
    if (!values.name) found.name = "Write your name."
    if (!values.email) found.email = "Write your email address."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      found.email = "Check the email address: it needs an @ and a domain."
    if (!about) found.about = "Choose what your message is about."
    if (!values.message) found.message = "Write a message."
    setErrors(found)

    const first = fieldOrder.find((field) => found[field])
    if (first) {
      const refs = {
        name: nameRef,
        email: emailRef,
        about: aboutRef,
        message: messageRef,
      }
      refs[first].current?.focus()
      return
    }
    setSentTo(values.email)
  }

  return (
    <div className="mt-6 rounded-xl border bg-card p-6">
      {sentTo === null && (
        <form noValidate aria-label="Write to us" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className={labelClass}>
              Your name
            </label>
            <Input
              ref={nameRef}
              id="name"
              autoComplete="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                clearError("name")
              }}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={fieldClass}
            />
            {errors.name && <ErrorLine id="name-error" message={errors.name} />}
          </div>

          <div className="mt-6">
            <label htmlFor="email" className={labelClass}>
              Email address
            </label>
            <Input
              ref={emailRef}
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                clearError("email")
              }}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={fieldClass}
            />
            {errors.email && (
              <ErrorLine id="email-error" message={errors.email} />
            )}
          </div>

          <div className="mt-6">
            <label id="about-label" htmlFor="about" className={labelClass}>
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
                ref={aboutRef}
                id="about"
                aria-labelledby="about-label"
                aria-invalid={errors.about ? true : undefined}
                aria-describedby={errors.about ? "about-error" : undefined}
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
              <ErrorLine id="about-error" message={errors.about} />
            )}
          </div>

          <div className="mt-6">
            <label htmlFor="message" className={labelClass}>
              Message
            </label>
            <Textarea
              ref={messageRef}
              id="message"
              value={message}
              onChange={(event) => {
                setMessage(event.target.value)
                clearError("message")
              }}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={cn(fieldClass, "min-h-48 resize-none")}
            />
            {errors.message && (
              <ErrorLine id="message-error" message={errors.message} />
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
              className={cn("text-h2", codeFocusOutline)}
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
  const [today] = useState(() => new Date().getDay())

  return (
    <div className="mx-auto max-w-[1120px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", chromeLink)}>
          The Linden Room
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => {
              const current = link.href === "/visit"
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={cn("text-body", chromeLink, current && "underline")}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>

      <main>
        <section className="grid gap-6 pt-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="font-mono text-label text-muted-foreground">
              Mill Lane, Ashby Wold
            </p>
            <h1 className="mt-2 text-h1">Visit us</h1>
            <p className="mt-4 max-w-xl">
              We are on the corner of Mill Lane and Station Road, opposite
              Orchard Park, four minutes from the station. Walk in whenever we
              are open: you only need to book if you are four or more.
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
                <caption className="sr-only">Opening hours</caption>
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
                  {hours.map((row) => {
                    const isToday = row.day === today
                    return (
                      <TableRow
                        key={row.name}
                        aria-current={isToday ? "date" : undefined}
                        className="hover:bg-transparent"
                      >
                        <TableHead
                          scope="row"
                          className="h-auto px-4 py-2 text-left font-sans text-body font-normal whitespace-normal text-foreground first:pl-0 last:pr-0"
                        >
                          {row.name}
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
              {routes.map((route, index) => (
                <li key={route.title} className={index > 0 ? "mt-6" : undefined}>
                  <h3 className="text-body">{route.title}</h3>
                  <p className="mt-2 max-w-xl text-body">{route.text}</p>
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
                  <span className={tag}>Orchard Park</span>
                </div>
                <span className={cn(tag, "absolute right-1/12 bottom-1/2")}>
                  Station Road
                </span>
                <span className={cn(tag, "absolute top-1/4 left-1/4")}>
                  Mill Lane
                </span>
                <div className="absolute top-7/12 left-1/4 flex items-center gap-1">
                  <MapPin
                    className="size-6 text-primary"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className={cn(tag, "border")}>The Linden Room</span>
                </div>
              </div>
              <figcaption className="mt-2 font-mono text-label text-muted-foreground">
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
            <ul className="mt-4 list-disc pl-6">
              {accessNotes.map((note, index) => (
                <li
                  key={note}
                  className={cn("max-w-xl", index > 0 && "mt-2")}
                >
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
              Hana and Teodor, who run the room, read every message themselves
              and answer within two days.
            </p>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="mt-18">
        <div className="border-t py-10">
          <div className="grid gap-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">The Linden Room</p>
              <p className="mt-2 max-w-xl">
                A tea room and tea shop on Mill Lane, pouring loose-leaf pots
                and serving plates from a small kitchen.
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <address className="not-italic">
                <span className="block">14 Mill Lane</span>
                <span className="block">Ashby Wold</span>
                <span className="block">AW3 7LN</span>
              </address>
              <p className="mt-4 font-mono text-label text-muted-foreground">
                Tuesday to Sunday · Closed Mondays
              </p>
            </div>
          </div>
          <p className="mt-6 font-mono text-label text-muted-foreground">
            © 2026 The Linden Room
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
