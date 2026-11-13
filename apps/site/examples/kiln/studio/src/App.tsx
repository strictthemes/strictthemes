import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { CircleAlert, CircleCheck, ShoppingBag } from "lucide-react"

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

const STUDIO = "Whitlow Pottery"
const BASKET_COUNT = 3

const container = "mx-auto max-w-[1120px] px-4 md:px-6"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const quietLink = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const label = "font-mono text-label"
const mutedLabel = "font-mono text-label text-muted-foreground"
const buttonClasses = "h-auto px-4 py-2 font-mono text-label"
const fieldClasses = "mt-2 h-auto px-4 py-2 text-body md:text-body"
const fieldLabel = "block font-mono text-label text-foreground"

const mainLinks = [
  { label: "Shop", href: "/" },
  { label: "Tableware", href: "/tableware" },
  { label: "Vases", href: "/vases" },
  { label: "Studio", href: "/studio", current: true },
]

const footerLinks = [
  { label: "Shop", href: "/" },
  { label: "Studio", href: "/studio" },
  { label: "Delivery and returns", href: "/delivery" },
  { label: "Care of stoneware", href: "/care" },
]

const people = [
  {
    initials: "NV",
    name: "Nell Varga",
    role: "Potter, co-founder",
    text: "Nell throws the tableware, about forty pieces on a good day at the wheel. She also keeps the glaze notebooks, one line for every test tile since 2019.",
  },
  {
    initials: "TR",
    name: "Tomas Reid",
    role: "Glazes and kiln, co-founder",
    text: "Tomas mixes the glazes from raw materials, a bucket at a time. He packs and fires the kiln, and sits up with it on the night of a glaze firing.",
  },
  {
    initials: "IO",
    name: "Ines Okafor",
    role: "Orders and the Saturday class",
    text: "Ines packs every order in paper and wood wool, and has not lost a plate in the post yet. She runs the Saturday class, six people at six wheels.",
  },
]

const steps = [
  {
    time: "1 hour",
    name: "Wedging the clay",
    text: "A 12.5 kg bag of stoneware clay is cut, slammed and kneaded on a plaster slab until no air is left in it. Then it is weighed into balls, 450 g for a mug and 900 g for a dinner plate.",
  },
  {
    time: "20 minutes a piece",
    name: "Throwing on the wheel",
    text: "Nell centres each ball and pulls it up against a gauge, so that six mugs come out as one set. The pieces are cut from the wheel with a wire and left on boards overnight.",
  },
  {
    time: "7 days",
    name: "Trimming and drying",
    text: "The next day, when the clay is as firm as cheese, each piece goes back on the wheel upside down and its foot is cut. Then it dries on the racks for a week, turned once, away from the door.",
  },
  {
    time: "1 day",
    name: "The bisque firing, to 1,000°C",
    text: "The dry pieces are stacked in the electric kiln and fired slowly to 1,000°C. They come out hard but still thirsty, which is what makes a glaze hold on to them.",
  },
  {
    time: "2 days",
    name: "Glazing and the glaze firing, to 1,260°C",
    text: "Each piece is dipped in one of four glazes, and its foot is wiped clean so it does not stick to the shelf. The gas kiln takes fourteen hours to reach 1,260°C and a day and a half to cool before it can be opened.",
  },
]

const OPEN = { from: "10:00", to: "16:00" }

const hours: {
  day: string
  open?: { from: string; to: string }
  lesson?: { from: string; to: string }
}[] = [
  { day: "Monday" },
  { day: "Tuesday" },
  { day: "Wednesday" },
  { day: "Thursday", open: OPEN },
  { day: "Friday", open: OPEN },
  { day: "Saturday", open: OPEN, lesson: { from: "10:00", to: "12:00" } },
  { day: "Sunday" },
]

const topics = [
  { value: "commission", label: "A commission" },
  { value: "order", label: "An order" },
  { value: "class", label: "The Saturday class" },
  { value: "other", label: "Something else" },
]

type Field = "name" | "email" | "topic" | "message"
type Errors = Partial<Record<Field, string>>

const fieldOrder: Field[] = ["name", "email", "topic", "message"]

function basketLabel(count: number) {
  if (count === 0) return "Basket, empty"
  return `Basket, ${count} ${count === 1 ? "piece" : "pieces"}`
}

function Clock({ value }: { value: string }) {
  return (
    <time dateTime={value} className="font-mono tabular-nums">
      {value}
    </time>
  )
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
  const [topic, setTopic] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const topicRef = useRef<HTMLButtonElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const confirmationRef = useRef<HTMLParagraphElement>(null)

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

    const found: Errors = {}
    if (name.trim() === "") {
      found.name = "Enter your name."
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      found.email = "Enter an email address, like name@example.com."
    }
    if (topic === null) {
      found.topic = "Choose what your message is about."
    }
    if (message.trim().length < 20) {
      found.message = "Write a little more: at least 20 characters."
    }
    setErrors(found)

    const first = fieldOrder.find((field) => found[field])
    if (first) {
      const refs = {
        name: nameRef,
        email: emailRef,
        topic: topicRef,
        message: messageRef,
      }
      refs[first].current?.focus()
      return
    }
    setSent(true)
  }

  return (
    <div className="mt-6">
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
              <ErrorLine id="contact-name-error">{errors.name}</ErrorLine>
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
              <ErrorLine id="contact-email-error">{errors.email}</ErrorLine>
            )}
          </div>

          <div className="mt-6">
            <label htmlFor="contact-topic" className={fieldLabel}>
              What it is about
            </label>
            <Select
              items={topics}
              value={topic}
              onValueChange={(value) => {
                if (value === null) return
                setTopic(value)
                clearError("topic")
              }}
            >
              <SelectTrigger
                ref={topicRef}
                id="contact-topic"
                aria-invalid={errors.topic ? true : undefined}
                aria-describedby={
                  errors.topic ? "contact-topic-error" : undefined
                }
                className="mt-2"
              >
                <SelectValue placeholder="Choose one" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.topic && (
              <ErrorLine id="contact-topic-error">{errors.topic}</ErrorLine>
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
              onChange={(event) => {
                setMessage(event.target.value)
                clearError("message")
              }}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={
                errors.message ? "contact-message-error" : undefined
              }
              className={cn(fieldClasses, "min-h-40 resize-none")}
            />
            {errors.message && (
              <ErrorLine id="contact-message-error">{errors.message}</ErrorLine>
            )}
          </div>

          <Button type="submit" className={cn(buttonClasses, "mt-6")}>
            Send message
          </Button>
        </form>
      )}
      <div role="status">
        {sent && (
          <p
            ref={confirmationRef}
            tabIndex={-1}
            className="flex items-start gap-2 text-body focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
          >
            <CircleCheck
              className="mt-1 size-4 shrink-0 text-success"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="text-foreground">
              Thank you. Nell will answer within two working days.
            </span>
          </p>
        )}
      </div>
    </div>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [menuOpen])

  return (
    <div className="bg-background text-body text-foreground">
      <header className="border-b">
        <div
          className={cn(
            container,
            "flex flex-wrap items-center gap-x-4 gap-y-2 py-4 md:gap-x-6"
          )}
        >
          <a href="/" className={cn(quietLink, "font-heading text-h2")}>
            {STUDIO}
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {mainLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className={cn(quietLink, link.current && "underline")}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <Button
              ref={menuButtonRef}
              variant="outline"
              aria-expanded={menuOpen}
              aria-controls="small-screen-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className={cn(buttonClasses, "md:hidden")}
            >
              Menu
            </Button>
            <a
              href="/basket"
              aria-label={basketLabel(BASKET_COUNT)}
              className={cn(quietLink, "inline-flex items-center gap-2")}
            >
              <ShoppingBag
                className="size-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="hidden md:inline">Basket</span>
              <span className="font-mono tabular-nums">({BASKET_COUNT})</span>
            </a>
          </div>
        </div>
        <nav
          id="small-screen-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t md:hidden"
        >
          <ul className={cn(container, "py-2")}>
            {mainLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(
                    quietLink,
                    "block py-2",
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

      <main className={cn(container, "flex flex-col gap-20 pt-10 pb-20")}>
        <section className="grid gap-x-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7">
            <p className={mutedLabel}>The studio</p>
            <h1 className="mt-2 text-h1">
              Two potters, one gas kiln and an old dairy in Bramwick
            </h1>
            <p className="mt-6 max-w-lg">
              Nell Varga and Tomas Reid started {STUDIO} in 2019, in a dairy at
              Coldharbour Yard that had stood empty since it closed in 1994.
              They had one wheel and an electric kiln borrowed from Nell’s old
              college, and for the first winter they sold from a table in the
              yard.
            </p>
            <p className="mt-4 max-w-lg">
              They make stoneware for the table: mugs, bowls, plates, jugs and a
              few vases, in four glazes. A firing holds about 120 pieces, and
              each one passes through the same two pairs of hands, so a batch is
              as many as the two of them can throw, trim and glaze well in three
              weeks.
            </p>
            <p className="mt-4 max-w-lg">
              In 2021 they built a gas kiln in the yard, brick by brick, over
              one summer. It fires hotter and with less air than the electric
              one, which turned the Iron glaze from flat brown to a deep,
              speckled rust and gave the Ash glaze its grey edge.{" "}
              <a
                href="/"
                className={cn(
                  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                  focusOutline
                )}
              >
                See what came out of the last firing
              </a>
              .
            </p>
          </div>
          <figure className="mt-10 md:col-span-4 md:col-start-9 md:mt-0">
            <div
              role="img"
              aria-label="The gas kiln in the yard, drawn as a block"
              className="flex aspect-4/5 items-center justify-center rounded-xl border bg-muted"
            >
              <div className="h-3/5 w-1/2 border border-foreground/40 bg-glaze-dark" />
            </div>
            <figcaption className={cn(mutedLabel, "mt-2")}>
              The gas kiln, built in 2021
            </figcaption>
          </figure>
        </section>

        <section>
          <h2 className="text-h2">The people</h2>
          <ul className="mt-6 grid gap-y-10 md:grid-cols-3 md:gap-x-6">
            {people.map((person) => (
              <li key={person.initials}>
                <div className="flex items-center gap-4">
                  <div
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-card font-heading text-body"
                  >
                    {person.initials}
                  </div>
                  <div>
                    <h3 className="font-sans text-body font-medium">
                      {person.name}
                    </h3>
                    <p className={cn(mutedLabel, "mt-1")}>{person.role}</p>
                  </div>
                </div>
                <p className="mt-4 max-w-lg">{person.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="process" className="scroll-mt-10">
          <h2 className="text-h2">From clay to kiln</h2>
          <p className="mt-4 max-w-lg">
            A piece takes about three weeks to get from a bag of clay to the
            shop.
          </p>
          <ol className="mt-6">
            {steps.map((step, index) => (
              <li
                key={step.name}
                className="border-t py-6 last:border-b md:grid md:grid-cols-12 md:gap-x-6"
              >
                <div className="md:col-span-3">
                  <p className={mutedLabel}>Step {index + 1}</p>
                  <p className={cn(label, "mt-1 text-foreground tabular-nums")}>
                    {step.time}
                  </p>
                </div>
                <div className="mt-4 md:col-span-9 md:mt-0">
                  <h3 className="font-sans text-body font-medium">
                    {step.name}
                  </h3>
                  <p className="mt-2 max-w-lg">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-h2">Visit the studio</h2>
          <div className="mt-6 grid gap-x-6 md:grid-cols-12">
            <div className="md:col-span-5">
              <address className="not-italic">
                {STUDIO}
                <br />
                Unit 3, Coldharbour Yard
                <br />
                Bramwick BW4 2LT
              </address>
              <p className="mt-4 max-w-lg">
                The yard has three parking spaces, straight ahead as you come
                through the gate. The door is step-free, and the shop shelf is
                by the kiln, at the back of the room.
              </p>
            </div>
            <div className="mt-10 md:col-span-6 md:col-start-7 md:mt-0">
              <p className={mutedLabel}>Opening hours</p>
              <dl className="mt-2">
                {hours.map((row) => (
                  <div
                    key={row.day}
                    className="grid grid-cols-3 items-baseline gap-x-4 border-t py-2 last:border-b"
                  >
                    <dt className={mutedLabel}>{row.day}</dt>
                    <dd className="col-span-2 text-body">
                      {row.open ? (
                        <>
                          <Clock value={row.open.from} /> to{" "}
                          <Clock value={row.open.to} />
                        </>
                      ) : (
                        "Closed"
                      )}
                      {row.lesson && (
                        <span className={cn(mutedLabel, "block")}>
                          class <Clock value={row.lesson.from} /> to{" "}
                          <Clock value={row.lesson.to} />
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className={cn(mutedLabel, "mt-4")}>
                Closed from <time dateTime="2026-12-24">24 December</time> to{" "}
                <time dateTime="2027-01-02">2 January</time>, both days
                included.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="grid gap-x-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="text-h2">Write to us</h2>
            <p className="mt-4 max-w-lg">
              Nell reads every message and answers within two working days, and
              commissions are booked from February.
            </p>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className={cn(container, "py-10")}>
          <div className="flex flex-col gap-6 md:flex-row md:justify-between">
            <div>
              <p className="font-heading text-h2">{STUDIO}</p>
              <address className="mt-2 not-italic">
                Unit 3, Coldharbour Yard
                <br />
                Bramwick BW4 2LT
              </address>
            </div>
            <nav aria-label="Footer">
              <ul className="flex flex-col gap-2">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={quietLink}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <p className={cn(mutedLabel, "mt-6")}>© 2026 {STUDIO}</p>
        </div>
      </footer>
    </div>
  )
}

export default App
