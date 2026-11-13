import { useEffect, useRef, useState } from "react"
import type { FormEvent, KeyboardEvent, ReactNode } from "react"
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

const STUDIO = "Whitlow Pottery"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const plainLink = `text-foreground underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`

const textLink = `text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground ${focusRing}`

const label = "font-mono text-label"

const mainLinks = [
  { label: "Shop", href: "/" },
  { label: "Tableware", href: "/tableware" },
  { label: "Vases", href: "/vases" },
  { label: "Studio", href: "/studio" },
]

const currentHref = "/studio"

const footerLinks = [
  { label: "Shop", href: "/" },
  { label: "Studio", href: "/studio" },
  { label: "Delivery and returns", href: "/delivery" },
  { label: "Care of stoneware", href: "/care" },
]

const basketCount: number = 3

function basketLabel(count: number) {
  if (count === 0) return "Basket, empty"
  if (count === 1) return "Basket, 1 piece"
  return `Basket, ${count} pieces`
}

const people = [
  {
    initials: "NV",
    name: "Nell Varga",
    role: "Potter, co-founder",
    about:
      "Nell throws the tableware on the wheel by the window, most days from eight. She also keeps the glaze notebooks, one for every firing since 2019.",
  },
  {
    initials: "TR",
    name: "Tomas Reid",
    role: "Glazes and kiln, co-founder",
    about:
      "Tomas mixes the glazes from raw materials in the back room. He loads and fires the gas kiln, and stays with it through the night of every firing.",
  },
  {
    initials: "IO",
    name: "Ines Okafor",
    role: "Orders and the Saturday class",
    about:
      "Ines packs every order in paper and takes it to the post office herself. On Saturdays she runs the class, six people at three wheels.",
  },
]

const steps = [
  {
    name: "Wedging the clay",
    time: "1 hour",
    text: "We knead each bag of clay by hand to push out the air and even out the water in it. Air left in the clay can crack a piece in the kiln.",
  },
  {
    name: "Throwing on the wheel",
    time: "20 minutes a piece",
    text: "Nell centres a weighed ball of clay and pulls up the walls in one sitting. Handles and spouts go on the next morning, once the clay has firmed.",
  },
  {
    name: "Trimming and drying",
    time: "7 days",
    text: "When a piece is leather-hard we turn it over and trim its foot. It then dries slowly under cloth for about a week, so it does not warp.",
  },
  {
    name: "The bisque firing, to 1,000°C",
    time: "1 day",
    text: "The first firing takes the dry clay to 1,000°C and makes it hard but porous. Out of the kiln, a piece can be handled safely and takes up glaze.",
  },
  {
    name: "Glazing and the glaze firing, to 1,260°C",
    time: "2 days",
    text: "Tomas dips each piece in glaze and wipes its foot clean. The gas kiln climbs to 1,260°C over a day and takes another day to cool before we open it.",
  },
]

const hours: { day: string; open: boolean; classTime?: boolean }[] = [
  { day: "Monday", open: false },
  { day: "Tuesday", open: false },
  { day: "Wednesday", open: false },
  { day: "Thursday", open: true },
  { day: "Friday", open: true },
  { day: "Saturday", open: true, classTime: true },
  { day: "Sunday", open: false },
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

function Time({ value }: { value: string }) {
  return (
    <time dateTime={value} className="font-mono tabular-nums">
      {value}
    </time>
  )
}

function ErrorLine({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert
        aria-hidden="true"
        strokeWidth={1.5}
        className="size-4 shrink-0"
      />
      <span className="min-w-0 wrap-break-word">{children}</span>
    </p>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!open || event.key !== "Escape") return
    setOpen(false)
    menuButton.current?.focus()
  }

  return (
    <header className="border-b" onKeyDown={onKeyDown}>
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 md:gap-x-6 md:px-6">
        <a href="/" className={`font-heading text-h2 ${plainLink}`}>
          {STUDIO}
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {mainLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.href === currentHref ? "page" : undefined}
                  className={`${plainLink} ${link.href === currentHref ? "underline" : ""}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button
            ref={menuButton}
            variant="outline"
            aria-expanded={open}
            aria-controls="menu-nav"
            onClick={() => setOpen((value) => !value)}
            className="h-auto px-4 py-2 font-mono text-label md:hidden"
          >
            Menu
          </Button>
          <a
            href="/basket"
            aria-label={basketLabel(basketCount)}
            className={`inline-flex items-center gap-2 ${plainLink}`}
          >
            <ShoppingBag
              aria-hidden="true"
              strokeWidth={1.5}
              className="size-4"
            />
            <span className="hidden md:inline">Basket</span>
            <span className="font-mono tabular-nums">({basketCount})</span>
          </a>
        </div>
      </div>
      <nav
        id="menu-nav"
        aria-label="Main"
        hidden={!open}
        className="border-t md:hidden"
      >
        <ul className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
          {mainLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.href === currentHref ? "page" : undefined}
                className={`block py-2 ${plainLink} ${link.href === currentHref ? "underline" : ""}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

function Story() {
  return (
    <section className="grid grid-cols-1 gap-x-6 md:grid-cols-12 md:items-start">
      <div className="md:col-span-7">
        <p className={`${label} text-muted-foreground`}>The studio</p>
        <h1 className="mt-2 text-h1">
          Two potters, one gas kiln and an old dairy in Bramwick
        </h1>
        <p className="mt-6 max-w-lg">
          Nell Varga and Tomas Reid started {STUDIO} in 2019, in a dairy at
          Coldharbour Yard that had stood empty since it closed in 1994. They
          had one wheel, a borrowed electric kiln and a sink they plumbed in
          themselves.
        </p>
        <p className="mt-4 max-w-lg">
          We make stoneware for the table: mugs, bowls, plates and jugs, and a
          few vases. We work in batches of forty or fifty pieces, so every glaze
          is mixed for a firing we can watch, and nothing waits in a warehouse.
        </p>
        <p className="mt-4 max-w-lg">
          In 2021 we built a gas kiln in the yard. It holds three times what the
          electric one did, and its flame moves the glaze in a way the old kiln
          never could, so no two pieces from a firing are quite alike.{" "}
          <a href="/" className={textLink}>
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
          <div className="h-3/5 w-1/2 border border-foreground/60 bg-glaze-dark" />
        </div>
        <figcaption className={`mt-2 ${label} text-muted-foreground tabular-nums`}>
          The gas kiln, built in 2021
        </figcaption>
      </figure>
    </section>
  )
}

function People() {
  return (
    <section aria-labelledby="people-heading">
      <h2 id="people-heading" className="text-h2">
        The people
      </h2>
      <ul className="mt-6 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-6">
        {people.map((person) => (
          <li key={person.initials}>
            <div className="flex items-center gap-4">
              <div
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-card font-heading text-body"
              >
                {person.initials}
              </div>
              <div className="min-w-0">
                <h3 className="font-sans text-body font-medium">
                  {person.name}
                </h3>
                <p className={`mt-1 ${label} text-muted-foreground`}>
                  {person.role}
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-lg">{person.about}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="scroll-mt-10"
    >
      <h2 id="process-heading" className="text-h2">
        From clay to kiln
      </h2>
      <p className="mt-4 max-w-lg">
        A piece takes about three weeks from a bag of clay to the shop, and for
        much of that time it sits on a shelf, waiting for a full kiln.
      </p>
      <ol className="mt-6">
        {steps.map((step, index) => (
          <li
            key={step.name}
            className="border-t py-6 last:border-b md:grid md:grid-cols-12 md:gap-x-6"
          >
            <div className="md:col-span-3">
              <p className={`${label} text-muted-foreground tabular-nums`}>
                Step {index + 1}
              </p>
              <p className={`mt-1 ${label} text-foreground tabular-nums`}>
                {step.time}
              </p>
            </div>
            <div className="mt-4 md:col-span-9 md:col-start-4 md:mt-0">
              <h3 className="font-sans text-body font-medium">{step.name}</h3>
              <p className="mt-2 max-w-lg">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Visit() {
  return (
    <section aria-labelledby="visit-heading">
      <h2 id="visit-heading" className="text-h2">
        Visit the studio
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-x-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <address className="not-italic">
            {STUDIO}
            <br />
            Unit 3, Coldharbour Yard
            <br />
            Bramwick BW4 2LT
          </address>
          <p className="mt-4 max-w-lg">
            The yard has three parking spaces by the gate. The door is
            step-free, and the shop shelf stands by the kiln, so you choose a
            piece where it was fired.
          </p>
        </div>
        <div className="mt-10 md:col-span-6 md:col-start-7 md:mt-0">
          <p className={`${label} text-muted-foreground`}>Opening hours</p>
          <dl className="mt-2">
            {hours.map((row) => (
              <div
                key={row.day}
                className="grid grid-cols-3 items-baseline gap-x-4 border-t py-2 last:border-b"
              >
                <dt className={`${label} text-muted-foreground`}>{row.day}</dt>
                <dd className="col-span-2 text-body">
                  {row.open ? (
                    <>
                      <Time value="10:00" /> to <Time value="16:00" />
                    </>
                  ) : (
                    "Closed"
                  )}
                  {row.classTime && (
                    <span
                      className={`block ${label} text-muted-foreground tabular-nums`}
                    >
                      class <time dateTime="10:00">10:00</time> to{" "}
                      <time dateTime="12:00">12:00</time>
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className={`mt-4 ${label} text-muted-foreground tabular-nums`}>
            Closed from <time dateTime="2026-12-24">24 December</time> to{" "}
            <time dateTime="2027-01-02">2 January</time>, both days included.
          </p>
        </div>
      </div>
    </section>
  )
}

function Contact() {
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
  const thanksRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (sent) thanksRef.current?.focus()
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Enter an email address, like name@example.com."
    if (topic === null) next.topic = "Choose what your message is about."
    if (message.trim().length < 20)
      next.message = "Write a little more: at least 20 characters."
    setErrors(next)

    const first = fieldOrder.find((field) => next[field])
    if (!first) {
      setSent(true)
      return
    }
    const refs = {
      name: nameRef,
      email: emailRef,
      topic: topicRef,
      message: messageRef,
    }
    refs[first].current?.focus()
  }

  const fieldLabel = `block ${label} text-foreground`
  const fieldClass = "mt-2 h-auto px-4 py-2 text-body md:text-body"

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="grid grid-cols-1 gap-x-6 md:grid-cols-12"
    >
      <div className="md:col-span-7">
        <h2 id="contact-heading" className="text-h2">
          Write to us
        </h2>
        <p className="mt-4 max-w-lg">
          Nell reads every message and answers within two working days, and
          commissions are booked from February.
        </p>
        <div className="mt-6">
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
                  className={fieldClass}
                />
                {errors.email && (
                  <ErrorLine id="contact-email-error">{errors.email}</ErrorLine>
                )}
              </div>
              <div className="mt-6">
                <label
                  id="contact-topic-label"
                  htmlFor="contact-topic"
                  className={fieldLabel}
                >
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
                    aria-labelledby="contact-topic-label"
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
                  className={`${fieldClass} min-h-40 resize-none`}
                />
                {errors.message && (
                  <ErrorLine id="contact-message-error">
                    {errors.message}
                  </ErrorLine>
                )}
              </div>
              <Button
                type="submit"
                className="mt-6 h-auto px-4 py-2 font-mono text-label"
              >
                Send message
              </Button>
            </form>
          )}
          <div role="status">
            {sent && (
              <p
                ref={thanksRef}
                tabIndex={-1}
                className="flex items-start gap-2 text-body focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
              >
                <CircleCheck
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="mt-1 size-4 shrink-0 text-success"
                />
                <span className="text-foreground">
                  Thank you. Nell will answer within two working days.
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-[1120px] px-4 py-10 md:px-6">
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
                  <a href={link.href} className={plainLink}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={`mt-6 ${label} text-muted-foreground tabular-nums`}>
          © 2026 {STUDIO}
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <Header />
      <main className="mx-auto flex max-w-[1120px] flex-col gap-20 px-4 pt-10 pb-20 md:px-6">
        <Story />
        <People />
        <Process />
        <Visit />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
