import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert, CircleCheck, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const STUDIO = "Whitlow Pottery"
const CONTAINER = "mx-auto max-w-[1120px] px-4 md:px-6"
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const CODE_FOCUS =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const NAV_LINK = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)
const TEXT_LINK = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  FOCUS
)
const BUTTON = "h-auto px-4 py-2 font-mono text-label"
const LABEL = "font-mono text-label"
const MUTED_LABEL = "font-mono text-label text-muted-foreground"
const TIME = "font-mono tabular-nums"

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
      "Nell throws all of the tableware, about forty pieces on a good day. She also keeps the glaze notebooks, one page for every firing since 2019.",
  },
  {
    initials: "TR",
    name: "Tomas Reid",
    role: "Glazes and kiln, co-founder",
    about:
      "Tomas mixes the glazes from raw materials in the old cold room. He loads and fires the gas kiln and stays up with it until it reaches temperature.",
  },
  {
    initials: "IO",
    name: "Ines Okafor",
    role: "Orders and the Saturday class",
    about:
      "Ines packs every order in paper and straw from the yard. On Saturday mornings she runs the class for six people at three wheels.",
  },
]

const steps = [
  {
    time: "1 hour",
    name: "Wedging the clay",
    text: "We knead each bag of clay on a plaster bench to push out the air and even out the moisture. Air left in the clay can crack a piece in the kiln.",
  },
  {
    time: "20 minutes a piece",
    name: "Throwing on the wheel",
    text: "Each piece is thrown by hand to a set weight, so a set of mugs holds the same amount. Lids and handles are made on the same day so they shrink together.",
  },
  {
    time: "7 days",
    name: "Trimming and drying",
    text: "When the clay is leather hard we trim the foot and smooth the rim. Then the pieces dry slowly on boards under plastic, so they do not warp.",
  },
  {
    time: "1 day",
    name: "The bisque firing, to 1,000°C",
    text: "The first firing turns dry clay into hard, porous ware that takes glaze well. The kiln heats for about ten hours and cools overnight.",
  },
  {
    time: "2 days",
    name: "Glazing and the glaze firing, to 1,260°C",
    text: "We dip each piece in glaze and wipe the foot clean by hand. The gas kiln then fires for twelve hours and cools for a day and a half before we open it.",
  },
]

type Hours = { open: boolean; classTime?: boolean }
const hours: [string, Hours][] = [
  ["Monday", { open: false }],
  ["Tuesday", { open: false }],
  ["Wednesday", { open: false }],
  ["Thursday", { open: true }],
  ["Friday", { open: true }],
  ["Saturday", { open: true, classTime: true }],
  ["Sunday", { open: false }],
]

function TimeRange({ from, to }: { from: string; to: string }) {
  return (
    <>
      <time dateTime={from} className={TIME}>
        {from}
      </time>{" "}
      to{" "}
      <time dateTime={to} className={TIME}>
        {to}
      </time>
    </>
  )
}

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  const links = (itemClass?: string) =>
    mainLinks.map((link) => (
      <li key={link.href}>
        <a
          href={link.href}
          aria-current={link.current ? "page" : undefined}
          className={cn(NAV_LINK, link.current && "underline", itemClass)}
        >
          {link.label}
        </a>
      </li>
    ))

  return (
    <header className="border-b">
      <div
        className={cn(
          CONTAINER,
          "flex flex-wrap items-center gap-x-4 gap-y-2 py-4 md:gap-x-6"
        )}
      >
        <a href="/" className={cn(NAV_LINK, "font-heading text-h2")}>
          {STUDIO}
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">{links()}</ul>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button
            ref={menuButton}
            variant="outline"
            className={cn(BUTTON, "md:hidden")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </Button>
          <a
            href="/basket"
            aria-label="Basket, 3 pieces"
            className={cn(NAV_LINK, "inline-flex items-center gap-2")}
          >
            <ShoppingBag
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.5}
            />
            <span className="hidden md:inline">Basket</span>
            <span className="font-mono tabular-nums">(3)</span>
          </a>
        </div>
      </div>
      <nav
        id="mobile-menu"
        aria-label="Main"
        className="border-t md:hidden"
        hidden={!open}
      >
        <ul className={cn(CONTAINER, "py-2")}>{links("block py-2")}</ul>
      </nav>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t">
      <div className={cn(CONTAINER, "py-10")}>
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
                  <a href={link.href} className={NAV_LINK}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={cn(MUTED_LABEL, "mt-6")}>© 2026 {STUDIO}</p>
      </div>
    </footer>
  )
}

type Field = "name" | "email" | "topic" | "message"
type Errors = Partial<Record<Field, string>>

function ErrorLine({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert
        aria-hidden="true"
        className="size-4 shrink-0"
        strokeWidth={1.5}
      />
      <span>{children}</span>
    </p>
  )
}

function ContactForm() {
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    topic: "",
    message: "",
  })
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const topicRef = useRef<HTMLSelectElement>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sent) messageRef.current?.focus()
  }, [sent])

  function update(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
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
    if (!values.name.trim()) next.name = "Enter your name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Enter an email address, like name@example.com."
    if (!values.topic) next.topic = "Choose what your message is about."
    if (values.message.trim().length < 20)
      next.message = "Write a little more: at least 20 characters."
    setErrors(next)
    const order: Field[] = ["name", "email", "topic", "message"]
    const first = order.find((field) => next[field])
    if (first) {
      const target = {
        name: nameRef,
        email: emailRef,
        topic: topicRef,
        message: textRef,
      }[first]
      target.current?.focus()
      return
    }
    setSent(true)
  }

  const fieldProps = (field: Field) => ({
    id: `contact-${field}`,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
  })
  const labelClass = cn(LABEL, "block text-foreground")
  const inputClass = "mt-2 h-auto px-4 py-2 text-body md:text-body"

  return (
    <div className="mt-6">
      {!sent && (
        <form noValidate onSubmit={onSubmit}>
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              Your name
            </label>
            <Input
              ref={nameRef}
              {...fieldProps("name")}
              autoComplete="name"
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              className={inputClass}
            />
            {errors.name && (
              <ErrorLine id="contact-name-error">{errors.name}</ErrorLine>
            )}
          </div>
          <div className="mt-6">
            <label htmlFor="contact-email" className={labelClass}>
              Email address
            </label>
            <Input
              ref={emailRef}
              {...fieldProps("email")}
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
              className={inputClass}
            />
            {errors.email && (
              <ErrorLine id="contact-email-error">{errors.email}</ErrorLine>
            )}
          </div>
          <div className="mt-6">
            <label htmlFor="contact-topic" className={labelClass}>
              What it is about
            </label>
            <div className="mt-2 w-full md:w-1/2">
              <select
                ref={topicRef}
                {...fieldProps("topic")}
                value={values.topic}
                onChange={(event) => update("topic", event.target.value)}
                className={cn(
                  "h-auto w-full rounded-lg border border-input bg-card px-4 py-2 text-body aria-invalid:border-destructive",
                  FOCUS
                )}
              >
                <option value="">Choose one</option>
                <option value="commission">A commission</option>
                <option value="order">An order</option>
                <option value="class">The Saturday class</option>
                <option value="other">Something else</option>
              </select>
            </div>
            {errors.topic && (
              <ErrorLine id="contact-topic-error">{errors.topic}</ErrorLine>
            )}
          </div>
          <div className="mt-6">
            <label htmlFor="contact-message" className={labelClass}>
              Message
            </label>
            <Textarea
              ref={textRef}
              {...fieldProps("message")}
              value={values.message}
              onChange={(event) => update("message", event.target.value)}
              className={cn(inputClass, "min-h-40")}
            />
            {errors.message && (
              <ErrorLine id="contact-message-error">{errors.message}</ErrorLine>
            )}
          </div>
          <div className="mt-6">
            <Button type="submit" className={BUTTON}>
              Send message
            </Button>
          </div>
        </form>
      )}
      <div role="status">
        {sent && (
          <div
            ref={messageRef}
            tabIndex={-1}
            className={cn("flex items-start gap-2 text-body", CODE_FOCUS)}
          >
            <CircleCheck
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-success"
              strokeWidth={1.5}
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
    <div className="bg-background text-body text-foreground">
      <SiteHeader />
      <main className={cn(CONTAINER, "flex flex-col gap-20 pt-10 pb-20")}>
        <section className="grid gap-x-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7">
            <p className={MUTED_LABEL}>The studio</p>
            <h1 className="mt-2 text-h1">
              Two potters, one gas kiln and an old dairy in Bramwick
            </h1>
            <p className="mt-6 max-w-lg">
              Nell Varga and Tomas Reid started {STUDIO} in 2019 in a dairy that
              closed in 1994. They had one wheel, a borrowed electric kiln and
              the cold room for drying, and they sold their first mugs from a
              table by the yard gate.
            </p>
            <p className="mt-4 max-w-lg">
              We make stoneware for the table: mugs, bowls, plates, jugs and a
              few vases. We work in small batches of thirty or forty pieces, so
              every piece is thrown, trimmed and glazed by one of us, and we can
              change a glaze when a firing teaches us something.
            </p>
            <p className="mt-4 max-w-lg">
              In 2021 we built a gas kiln in the yard. It holds four times as
              much as the electric one and fires hotter, which gave us the deep
              iron and ash glazes we use now. We fire it about once a month.{" "}
              <a href="/" className={TEXT_LINK}>
                See what came out of the last firing
              </a>
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
            <figcaption className={cn(MUTED_LABEL, "mt-2")}>
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
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-card font-heading text-body"
                  >
                    {person.initials}
                  </span>
                  <div>
                    <h3 className="font-sans text-body font-medium">
                      {person.name}
                    </h3>
                    <p className={cn(MUTED_LABEL, "mt-1")}>{person.role}</p>
                  </div>
                </div>
                <p className="mt-4 max-w-lg">{person.about}</p>
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
                  <p className={MUTED_LABEL}>Step {index + 1}</p>
                  <p className={cn(LABEL, "mt-1 text-foreground tabular-nums")}>
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
                The yard has three parking spaces, and the door is step-free.
                The shop shelf is in the kiln room, right by the kiln.
              </p>
            </div>
            <div className="mt-10 md:col-span-6 md:col-start-7 md:mt-0">
              <p className={MUTED_LABEL}>Opening hours</p>
              <dl className="mt-2">
                {hours.map(([day, info]) => (
                  <div
                    key={day}
                    className="grid grid-cols-3 items-baseline gap-x-4 border-t py-2 last:border-b"
                  >
                    <dt className={MUTED_LABEL}>{day}</dt>
                    <dd className="col-span-2 text-body">
                      {info.open ? (
                        <TimeRange from="10:00" to="16:00" />
                      ) : (
                        "Closed"
                      )}
                      {info.classTime && (
                        <span className={cn(MUTED_LABEL, "block")}>
                          class <TimeRange from="10:00" to="12:00" />
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className={cn(MUTED_LABEL, "mt-4")}>
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
              Nell reads every message and answers within two working days.
              Commissions are booked from February.
            </p>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
