import { useRef, useState, type FormEvent, type KeyboardEvent } from "react"
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
const BASKET_COUNT: number = 3

const container = "mx-auto max-w-[1120px] px-4 md:px-6"
const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const navLink = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const buttonText = "h-auto px-4 py-2 font-mono text-label"
const fieldLabel = "block font-mono text-label text-foreground"
const fieldClass = "h-auto px-4 py-2 text-body md:text-body"
const label = "font-mono text-label text-muted-foreground"

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
    about:
      "Nell throws all of the tableware, one batch at a time. She also keeps the glaze notebooks, with every recipe and every firing written down since the first one.",
  },
  {
    initials: "TR",
    name: "Tomas Reid",
    role: "Glazes and kiln, co-founder",
    about:
      "Tomas mixes the glazes from raw materials in the shed behind the kiln. He loads and fires the gas kiln, and sits up with it through the night of every firing.",
  },
  {
    initials: "IO",
    name: "Ines Okafor",
    role: "Orders and the Saturday class",
    about:
      "Ines packs every order in paper and card and takes it to the post office on her way home. On Saturday mornings she teaches the class at the studio's second wheel.",
  },
]

const steps = [
  {
    time: "1 hour",
    name: "Wedging the clay",
    text: "Each block of clay is kneaded on the bench to push out the air and even out the water in it. Air left in the clay can crack a piece in the kiln.",
  },
  {
    time: "20 minutes a piece",
    name: "Throwing on the wheel",
    text: "Nell centres a weighed ball of clay and pulls up the walls by hand. Every mug in a batch starts from the same weight, so a set matches.",
  },
  {
    time: "7 days",
    name: "Trimming and drying",
    text: "When a piece is leather-hard it goes back on the wheel to have its foot trimmed, and mugs and jugs get their handles. Then it dries slowly on the racks under a cloth.",
  },
  {
    time: "1 day",
    name: "The bisque firing, to 1,000°C",
    text: "The dry pieces are fired once in the electric kiln, to 1,000°C. This makes them hard enough to handle and still open enough to soak up a glaze.",
  },
  {
    time: "2 days",
    name: "Glazing and the glaze firing, to 1,260°C",
    text: "Each piece is dipped in glaze and its foot wiped clean. The gas kiln fires a full load to 1,260°C, then cools for a day before Tomas opens the door.",
  },
]

type Hours = { day: string; open?: boolean; classTime?: boolean }

const hours: Hours[] = [
  { day: "Monday" },
  { day: "Tuesday" },
  { day: "Wednesday" },
  { day: "Thursday", open: true },
  { day: "Friday", open: true },
  { day: "Saturday", open: true, classTime: true },
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

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Time({ value }: { value: string }) {
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

function NavLinks({ itemClass }: { itemClass?: string }) {
  return mainLinks.map((link) => (
    <li key={link.href}>
      <a
        href={link.href}
        aria-current={link.current ? "page" : undefined}
        className={cn(navLink, link.current && "underline", itemClass)}
      >
        {link.label}
      </a>
    </li>
  ))
}

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
    <header className="border-b" onKeyDown={onKeyDown}>
      <div
        className={cn(
          container,
          "flex flex-wrap items-center gap-x-4 gap-y-2 py-4 md:gap-x-6"
        )}
      >
        <a href="/" className={cn(navLink, "font-heading text-h2")}>
          {STUDIO}
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            <NavLinks />
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button
            ref={menuButton}
            variant="outline"
            className={cn(buttonText, "md:hidden")}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </Button>
          <a
            href="/basket"
            aria-label={
              BASKET_COUNT === 0
                ? "Basket, empty"
                : `Basket, ${BASKET_COUNT} ${BASKET_COUNT === 1 ? "piece" : "pieces"}`
            }
            className={cn(navLink, "inline-flex items-center gap-2")}
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
        id="site-menu"
        aria-label="Main"
        className="border-t md:hidden"
        hidden={!open}
      >
        <ul className={cn(container, "py-2")}>
          <NavLinks itemClass="block py-2" />
        </ul>
      </nav>
    </header>
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
  const thanksRef = useRef<HTMLDivElement>(null)

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
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()
    setName(trimmedName)
    setEmail(trimmedEmail)
    setMessage(trimmedMessage)

    const found: Errors = {}
    if (!trimmedName) found.name = "Enter your name."
    if (!EMAIL.test(trimmedEmail))
      found.email = "Enter an email address, like name@example.com."
    if (!topic) found.topic = "Choose what your message is about."
    if (trimmedMessage.length < 20)
      found.message = "Write a little more: at least 20 characters."
    setErrors(found)

    if (found.name) return nameRef.current?.focus()
    if (found.email) return emailRef.current?.focus()
    if (found.topic) return topicRef.current?.focus()
    if (found.message) return messageRef.current?.focus()

    setSent(true)
    requestAnimationFrame(() => thanksRef.current?.focus())
  }

  return (
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
              className={cn(fieldClass, "mt-2")}
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
              className={cn(fieldClass, "mt-2")}
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
              className={cn(fieldClass, "mt-2 min-h-40 resize-none")}
            />
            {errors.message && (
              <ErrorLine id="contact-message-error">{errors.message}</ErrorLine>
            )}
          </div>

          <Button type="submit" className={cn(buttonText, "mt-6")}>
            Send message
          </Button>
        </form>
      )}
      <div role="status">
        {sent && (
          <div
            ref={thanksRef}
            tabIndex={-1}
            className="flex items-start gap-2 text-body focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
          >
            <CircleCheck
              className="mt-1 size-4 shrink-0 text-success"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <p className="text-foreground">
              Thank you. Nell will answer within two working days.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <Header />

      <main className={cn(container, "flex flex-col gap-20 pt-10 pb-20")}>
        <section className="grid gap-x-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7">
            <p className={label}>The studio</p>
            <h1 className="mt-2 text-h1">
              Two potters, one gas kiln and an old dairy in Bramwick
            </h1>
            <p className="mt-6 max-w-lg">
              Nell Varga and Tomas Reid started {STUDIO} in 2019, in a dairy on
              Coldharbour Yard that had stood empty since it closed in 1994.
              They had one wheel, a borrowed electric kiln and the cold room
              for a workshop.
            </p>
            <p className="mt-4 max-w-lg">
              They make stoneware for the table, and a few vases: mugs, bowls,
              plates and jugs. Each piece is thrown by hand in batches of
              twenty or thirty, small enough that every one is looked over
              before it goes on the shelf, and large enough to fill a kiln.
            </p>
            <p className="mt-4 max-w-lg">
              In 2021 they built a gas kiln in the yard. It holds four times as
              much as the electric one and fires hotter, which gave the Iron
              and Slate glazes their depth, and the shop now restocks after
              each firing.{" "}
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
              <div className="h-3/5 w-1/2 border border-foreground/40 bg-glaze-dark" />
            </div>
            <figcaption className={cn(label, "mt-2")}>
              The gas kiln, built in 2021
            </figcaption>
          </figure>
        </section>

        <section aria-labelledby="people-heading">
          <h2 id="people-heading" className="text-h2">
            The people
          </h2>
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
                    <p className={cn(label, "mt-1")}>{person.role}</p>
                  </div>
                </div>
                <p className="mt-4 max-w-lg">{person.about}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="process"
          aria-labelledby="process-heading"
          className="scroll-mt-10"
        >
          <h2 id="process-heading" className="text-h2">
            From clay to kiln
          </h2>
          <p className="mt-4 max-w-lg">
            A piece takes about three weeks from a bag of clay to the shop, and
            most of that is drying time and waiting for a full kiln.
          </p>
          <ol className="mt-6">
            {steps.map((step, index) => (
              <li
                key={step.name}
                className="border-t py-6 last:border-b md:grid md:grid-cols-12 md:gap-x-6"
              >
                <div className="md:col-span-3">
                  <p className={label}>Step {index + 1}</p>
                  <p className="mt-1 font-mono text-label text-foreground tabular-nums">
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

        <section aria-labelledby="visit-heading">
          <h2 id="visit-heading" className="text-h2">
            Visit the studio
          </h2>
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
                The yard has three parking spaces by the gate. The door is
                step-free, and the shop shelf is in the kiln room, so you can
                see the work beside the kiln that fired it.
              </p>
            </div>
            <div className="mt-10 md:col-span-6 md:col-start-7 md:mt-0">
              <p className={label}>Opening hours</p>
              <dl className="mt-2">
                {hours.map((row) => (
                  <div
                    key={row.day}
                    className="grid grid-cols-3 items-baseline gap-x-4 border-t py-2 last:border-b"
                  >
                    <dt className={label}>{row.day}</dt>
                    <dd className="col-span-2 text-body">
                      {row.open ? (
                        <>
                          <Time value="10:00" /> to <Time value="16:00" />
                        </>
                      ) : (
                        "Closed"
                      )}
                      {row.classTime && (
                        <span className={cn(label, "block tabular-nums")}>
                          class <time dateTime="10:00">10:00</time> to{" "}
                          <time dateTime="12:00">12:00</time>
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className={cn(label, "mt-4")}>
                Closed from <time dateTime="2026-12-24">24 December</time> to{" "}
                <time dateTime="2027-01-02">2 January</time>, both days
                included.
              </p>
            </div>
          </div>
        </section>

        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="grid gap-x-6 md:grid-cols-12"
        >
          <div className="md:col-span-7">
            <h2 id="contact-heading" className="text-h2">
              Write to us
            </h2>
            <p className="mt-4 max-w-lg">
              Nell reads every message and answers within two working days,
              and commissions are booked from February.
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
                    <a href={link.href} className={navLink}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <p className={cn(label, "mt-6")}>© 2026 {STUDIO}</p>
        </div>
      </footer>
    </div>
  )
}

export default App
