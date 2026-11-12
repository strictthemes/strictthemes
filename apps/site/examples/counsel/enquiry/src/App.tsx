import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusRing
)
const chromeLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const label = "font-mono text-label uppercase"
const labelHeading = "font-mono text-label uppercase text-foreground"
const fieldLabel = "block font-mono text-label uppercase text-foreground"
const helper = "mt-2 font-mono text-label text-muted-foreground"
const fieldClass =
  "mt-2 h-auto border-muted-foreground px-4 py-2 text-body md:text-body"
const selectClass = cn(
  "mt-2 h-auto w-full rounded-md border border-muted-foreground bg-transparent px-4 py-2 text-body text-foreground focus-visible:border-ring aria-invalid:border-destructive dark:bg-input/30 dark:aria-invalid:border-destructive/50",
  focusRing
)
const buttonClass =
  "h-auto px-8 py-2 font-mono text-label font-normal uppercase"

const navLinks = [
  { label: "Practice", href: "/practice/commercial-disputes" },
  { label: "People", href: "/people/ruth-calloway" },
  { label: "Insights", href: "/insights/notice-clauses" },
  { label: "Contact", href: "/contact", current: true },
]

const areas = [
  "Corporate",
  "Commercial disputes",
  "Employment",
  "Real estate",
  "Private client",
  "Something else",
]

const steps = [
  "We check the names you give us for conflicts of interest.",
  "A partner in the right team replies within one working day.",
  "If we can help, the first meeting, of up to an hour, is free.",
]

type Values = {
  name: string
  organisation: string
  email: string
  phone: string
  area: string
  parties: string
  message: string
  consent: boolean
}

type Checked = "name" | "email" | "phone" | "area" | "message" | "consent"
type Errors = Partial<Record<Checked, string>>
type FocusTarget = Checked | "heading"

const emptyValues: Values = {
  name: "",
  organisation: "",
  email: "",
  phone: "",
  area: "",
  parties: "",
  message: "",
  consent: false,
}

const order: Checked[] = [
  "name",
  "email",
  "phone",
  "area",
  "message",
  "consent",
]

function validate(values: Values): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = "Write your name."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Write an email address such as name@example.com."
  }
  const phone = values.phone.trim()
  if (phone) {
    const digits = phone.replace(/\D/g, "").length
    if (!/^\+?[0-9 ]+$/.test(phone) || digits < 10) {
      errors.phone =
        "Write a telephone number such as 01632 960 214, or leave it empty."
    }
  }
  if (!values.area) errors.area = "Choose what the matter concerns."
  if (values.message.trim().length < 20) {
    errors.message = "Tell us about the matter in a sentence or two."
  }
  if (!values.consent)
    errors.consent = "Tick the box so that we may reply to you."
  return errors
}

function ErrorLine({ id, message }: { id: string; message?: string }) {
  if (!message) return null
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
      {message}
    </p>
  )
}

function Header() {
  return (
    <header className="flex flex-col items-start gap-4 border-b border-border py-8 md:flex-row md:items-baseline md:justify-between">
      <a href="/" className={cn("font-heading text-h2", chromeLink)}>
        Harrow &amp; Vane
      </a>
      <nav aria-label="Main">
        <ul className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                className={cn(label, chromeLink, link.current && "underline")}
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

function Footer() {
  return (
    <footer className="mt-14 border-t border-border py-8 md:mt-28">
      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-4">
          <p className="font-heading text-h2">Harrow &amp; Vane LLP</p>
          <address className="mt-2 font-mono text-label text-muted-foreground uppercase not-italic">
            <p>4 Chancery Row</p>
            <p>Wexcombe WX1 2LN</p>
          </address>
        </div>
        <div className="mt-8 md:col-span-4 md:col-start-5 md:mt-0">
          <p className={label}>
            <a href="tel:01632960214" className={chromeLink}>
              01632 960 214
            </a>
          </p>
          <p className={cn("mt-2", label)}>
            <a
              href="mailto:enquiries@harrowvane.example"
              className={cn("normal-case", chromeLink)}
            >
              enquiries@harrowvane.example
            </a>
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="mt-8 md:col-span-4 md:col-start-9 md:mt-0"
        >
          <ul>
            {navLinks.map((link, i) => (
              <li key={link.href} className={cn(i > 0 && "mt-2")}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(label, chromeLink, link.current && "underline")}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className={cn("mt-8 text-muted-foreground", label)}>
        © 2026 Harrow &amp; Vane LLP · Registered in England and Wales
      </p>
    </footer>
  )
}

function Office() {
  return (
    <div className="md:col-span-4">
      <h2 className={labelHeading}>Address</h2>
      <address className="mt-4 text-body not-italic">
        Harrow &amp; Vane LLP
        <br />
        4 Chancery Row
        <br />
        Wexcombe WX1 2LN
        <br />
        Second floor, with a lift
      </address>

      <h2 className={cn("mt-8", labelHeading)}>Telephone</h2>
      <p className="mt-4 text-body">
        <a href="tel:01632960214" className={textLink}>
          01632 960 214
        </a>
      </p>

      <h2 className={cn("mt-8", labelHeading)}>Hours</h2>
      <dl className="mt-4 border-b border-border">
        <div className="grid grid-cols-1 border-t border-border py-4 lg:grid-cols-3 lg:items-baseline lg:gap-x-4">
          <dt className={cn(label, "text-muted-foreground")}>
            Monday to Friday
          </dt>
          <dd className="mt-2 text-body lg:col-span-2 lg:mt-0">
            <span className="font-mono tabular-nums">
              <time dateTime="08:30">08:30</time>–
              <time dateTime="17:30">17:30</time>
            </span>
          </dd>
        </div>
        <div className="grid grid-cols-1 border-t border-border py-4 lg:grid-cols-3 lg:items-baseline lg:gap-x-4">
          <dt className={cn(label, "text-muted-foreground")}>
            Saturday and Sunday
          </dt>
          <dd className="mt-2 text-body lg:col-span-2 lg:mt-0">Closed</dd>
        </div>
      </dl>

      <h2 className={cn("mt-8", labelHeading)}>What happens next</h2>
      <ol className="mt-4 list-none border-b border-border p-0">
        {steps.map((step, i) => (
          <li
            key={step}
            className="grid grid-cols-4 items-baseline gap-x-4 border-t border-border py-4"
          >
            <p className={cn(label, "text-muted-foreground tabular-nums")}>
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="col-span-3 text-body">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Enquiry() {
  const [values, setValues] = useState<Values>(emptyValues)
  const [errors, setErrors] = useState<Errors>({})
  const [confirmed, setConfirmed] = useState<{
    area: string
    email: string
  } | null>(null)
  const [focusRequest, setFocusRequest] = useState<{
    target: FocusTarget
  } | null>(null)
  const requestFocus = (target: FocusTarget) => setFocusRequest({ target })

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const areaRef = useRef<HTMLSelectElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const consentRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Move focus only after the error lines or the message have rendered.
  useEffect(() => {
    if (!focusRequest) return
    const targets: Record<FocusTarget, { current: HTMLElement | null }> = {
      name: nameRef,
      email: emailRef,
      phone: phoneRef,
      area: areaRef,
      message: messageRef,
      consent: consentRef,
      heading: headingRef,
    }
    targets[focusRequest.target].current?.focus()
  }, [focusRequest])

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }))
    if (key in errors) {
      setErrors((e) => {
        const next = { ...e }
        delete next[key as Checked]
        return next
      })
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    const first = order.find((key) => found[key])
    if (first) {
      requestFocus(first)
      return
    }
    setConfirmed({ area: values.area, email: values.email.trim() })
    requestFocus("heading")
  }

  function startAgain() {
    setValues(emptyValues)
    setErrors({})
    setConfirmed(null)
    requestFocus("name")
  }

  const describe = (...ids: (string | false | undefined)[]) =>
    ids.filter(Boolean).join(" ") || undefined

  return (
    <div className="mt-14 md:col-span-7 md:col-start-6 md:mt-0">
      {!confirmed && (
        <form
          noValidate
          onSubmit={handleSubmit}
          className="rounded-xl bg-card p-8"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h2 className="text-h2">Send an enquiry</h2>
            <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
              Free consultation
            </Badge>
          </div>
          <p className="mt-4 text-body">
            Everything you send is read by a partner and kept confidential.
          </p>

          <div className="mt-8">
            <label htmlFor="name" className={fieldLabel}>
              Your name
            </label>
            <Input
              id="name"
              ref={nameRef}
              autoComplete="name"
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describe(errors.name && "name-error")}
              className={fieldClass}
            />
            <ErrorLine id="name-error" message={errors.name} />
          </div>

          <div className="mt-8">
            <label htmlFor="organisation" className={fieldLabel}>
              Organisation (optional)
            </label>
            <Input
              id="organisation"
              autoComplete="organization"
              value={values.organisation}
              onChange={(e) => update("organisation", e.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="mt-8 md:grid md:grid-cols-2 md:gap-x-8">
            <div>
              <label htmlFor="email" className={fieldLabel}>
                Email address
              </label>
              <Input
                id="email"
                ref={emailRef}
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={describe(errors.email && "email-error")}
                className={fieldClass}
              />
              <ErrorLine id="email-error" message={errors.email} />
            </div>
            <div className="mt-8 md:mt-0">
              <label htmlFor="phone" className={fieldLabel}>
                Telephone (optional)
              </label>
              <Input
                id="phone"
                ref={phoneRef}
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={describe(errors.phone && "phone-error")}
                className={fieldClass}
              />
              <ErrorLine id="phone-error" message={errors.phone} />
            </div>
          </div>

          <div className="mt-8">
            <label htmlFor="area" className={fieldLabel}>
              What does the matter concern?
            </label>
            <select
              id="area"
              ref={areaRef}
              value={values.area}
              onChange={(e) => update("area", e.target.value)}
              aria-invalid={errors.area ? true : undefined}
              aria-describedby={describe(errors.area && "area-error")}
              className={selectClass}
            >
              <option value="">Choose an area</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <ErrorLine id="area-error" message={errors.area} />
          </div>

          <div className="mt-8">
            <label htmlFor="parties" className={fieldLabel}>
              Other parties involved (optional)
            </label>
            <p id="parties-help" className={helper}>
              Names of the other companies or people, so that we can check for
              conflicts.
            </p>
            <Input
              id="parties"
              value={values.parties}
              onChange={(e) => update("parties", e.target.value)}
              aria-describedby="parties-help"
              className={fieldClass}
            />
          </div>

          <div className="mt-8">
            <label htmlFor="message" className={fieldLabel}>
              Tell us about the matter
            </label>
            <p id="message-help" className={helper}>
              A few sentences: what happened, what you would like, and any
              deadline you know of.
            </p>
            <Textarea
              id="message"
              ref={messageRef}
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describe(
                "message-help",
                errors.message && "message-error"
              )}
              className={cn(fieldClass, "min-h-48")}
            />
            <ErrorLine id="message-error" message={errors.message} />
          </div>

          <div className="mt-8">
            <div className="flex items-start gap-4">
              <Checkbox
                id="consent"
                ref={consentRef}
                checked={values.consent}
                onCheckedChange={(checked) => update("consent", checked)}
                aria-labelledby="consent-label"
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={describe(errors.consent && "consent-error")}
                className="mt-1"
              />
              <label
                id="consent-label"
                htmlFor="consent"
                className="text-body text-foreground"
              >
                I agree that Harrow &amp; Vane may use these details to reply to
                my enquiry and to check for conflicts of interest.
              </label>
            </div>
            <ErrorLine id="consent-error" message={errors.consent} />
          </div>
          <p className="mt-4 font-mono text-label text-muted-foreground">
            How we handle your details is set out in our{" "}
            <a href="#" className={textLink}>
              privacy notice
            </a>
            .
          </p>

          <Button
            type="submit"
            className={cn(buttonClass, "mt-8 w-full md:w-auto")}
          >
            Send enquiry
          </Button>
        </form>
      )}

      <div role="status">
        {confirmed && (
          <div className="rounded-xl bg-card p-8">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className={cn("text-h2", codeFocusRing)}
            >
              Thank you. We have your enquiry
            </h2>
            <p className="mt-4 text-body">
              {confirmed.area === "Something else"
                ? `A partner will reply to ${confirmed.email} within one working day.`
                : `A partner in ${confirmed.area} will reply to ${confirmed.email} within one working day.`}
            </p>
            <p className={cn("mt-4 text-muted-foreground", label)}>
              Reference · HV-2611-0418
            </p>
          </div>
        )}
      </div>

      {confirmed && (
        <Button
          variant="secondary"
          onClick={startAgain}
          className={cn(buttonClass, "mt-8")}
        >
          Send another enquiry
        </Button>
      )}
    </div>
  )
}

export function App() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 text-body md:px-8">
      <Header />
      <main>
        <section className="mt-14 grid grid-cols-1 md:mt-28 md:grid-cols-12 md:gap-x-8">
          <p className={cn("text-muted-foreground md:col-span-12", label)}>
            Enquiries · Wexcombe
          </p>
          <h1 className="mt-4 text-h1 md:col-span-9 md:text-display">
            Tell us about your matter
          </h1>
          <p className="mt-8 max-w-xl text-body md:col-span-7 md:col-start-1">
            Give us the outline and the names of the other parties, and a
            partner in the right team will reply within one working day. Please
            send no documents yet: we check for conflicts of interest first.
          </p>
        </section>

        <section className="mt-8 grid grid-cols-1 border-t border-border pt-8 md:mt-14 md:grid-cols-12 md:gap-x-8 md:pt-14">
          <Office />
          <Enquiry />
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
