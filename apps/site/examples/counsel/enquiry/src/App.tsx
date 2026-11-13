import { useRef, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = `text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground ${focusOutline}`

const plainLink = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focusOutline}`

const labelHeading = "font-mono text-label uppercase text-foreground"

const fieldLabel = "block font-mono text-label uppercase text-foreground"

const helperLine = "mt-2 font-mono text-label text-muted-foreground"

const fieldClasses =
  "mt-2 h-auto border-muted-foreground px-4 py-2 text-body md:text-body"

const buttonClasses = "h-auto px-8 py-2 font-mono text-label font-normal uppercase"

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
  "We check the names you give for conflicts of interest.",
  "A partner in the right team replies within one working day.",
  "If we can help, the first meeting, of up to an hour, is free.",
]

type Values = {
  name: string
  organisation: string
  email: string
  telephone: string
  area: string | null
  parties: string
  message: string
  consent: boolean
}

type ErrorField = "name" | "email" | "telephone" | "area" | "message" | "consent"

type Errors = Partial<Record<ErrorField, string>>

const emptyValues: Values = {
  name: "",
  organisation: "",
  email: "",
  telephone: "",
  area: null,
  parties: "",
  message: "",
  consent: false,
}

const errorOrder: ErrorField[] = [
  "name",
  "email",
  "telephone",
  "area",
  "message",
  "consent",
]

function check(values: Values): Errors {
  const errors: Errors = {}

  if (values.name.trim() === "") {
    errors.name = "Write your name."
  }

  if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(values.email.trim())) {
    errors.email = "Write an email address such as name@example.com."
  }

  const telephone = values.telephone.trim()
  if (telephone !== "") {
    const digits = telephone.replace(/\D/g, "").length
    if (!/^\+?[\d ]+$/.test(telephone) || digits < 10) {
      errors.telephone =
        "Write a telephone number such as 01632 960 214, or leave it empty."
    }
  }

  if (values.area === null) {
    errors.area = "Choose what the matter concerns."
  }

  if (values.message.trim().length < 20) {
    errors.message = "Tell us about the matter in a sentence or two."
  }

  if (!values.consent) {
    errors.consent = "Tick the box so that we may reply to you."
  }

  return errors
}

function ErrorLine({ id, children }: { id: string; children: ReactNode }) {
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

function EnquiryForm() {
  const [values, setValues] = useState<Values>(emptyValues)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState<{ area: string; email: string } | null>(
    null
  )

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const telephoneRef = useRef<HTMLInputElement>(null)
  const areaRef = useRef<HTMLButtonElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const consentRef = useRef<HTMLElement>(null)
  const confirmationRef = useRef<HTMLHeadingElement>(null)

  function focusField(field: ErrorField) {
    const refs = {
      name: nameRef,
      email: emailRef,
      telephone: telephoneRef,
      area: areaRef,
      message: messageRef,
      consent: consentRef,
    }
    refs[field].current?.focus()
  }

  function change<K extends keyof Values>(field: K, value: Values[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    if (field in errors) {
      setErrors((current) => {
        const next = { ...current }
        delete next[field as ErrorField]
        return next
      })
    }
  }

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = check(values)
    setErrors(found)

    const first = errorOrder.find((field) => found[field])
    if (first) {
      // The error lines are on the page before the field is read.
      requestAnimationFrame(() => focusField(first))
      return
    }

    setSent({ area: values.area ?? "", email: values.email.trim() })
    requestAnimationFrame(() => confirmationRef.current?.focus())
  }

  function startAgain() {
    setSent(null)
    setValues(emptyValues)
    setErrors({})
    requestAnimationFrame(() => nameRef.current?.focus())
  }

  return (
    <div className="mt-14 md:col-span-7 md:col-start-6 md:mt-0">
      {sent === null && (
        <form noValidate onSubmit={send} className="rounded-xl bg-card p-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h2 className="text-h2">Send an enquiry</h2>
            <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
              Free consultation
            </Badge>
          </div>
          <p className="mt-4 max-w-xl">
            Everything you send is read by a partner and kept confidential.
          </p>

          <div className="mt-8">
            <label htmlFor="name" className={fieldLabel}>
              Your name
            </label>
            <Input
              ref={nameRef}
              id="name"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={(event) => change("name", event.target.value)}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={fieldClasses}
            />
            {errors.name && <ErrorLine id="name-error">{errors.name}</ErrorLine>}
          </div>

          <div className="mt-8">
            <label htmlFor="organisation" className={fieldLabel}>
              Organisation (optional)
            </label>
            <Input
              id="organisation"
              name="organisation"
              autoComplete="organization"
              value={values.organisation}
              onChange={(event) => change("organisation", event.target.value)}
              className={fieldClasses}
            />
          </div>

          <div className="mt-8 md:grid md:grid-cols-2 md:gap-x-8">
            <div>
              <label htmlFor="email" className={fieldLabel}>
                Email address
              </label>
              <Input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => change("email", event.target.value)}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={fieldClasses}
              />
              {errors.email && (
                <ErrorLine id="email-error">{errors.email}</ErrorLine>
              )}
            </div>
            <div className="mt-8 md:mt-0">
              <label htmlFor="telephone" className={fieldLabel}>
                Telephone (optional)
              </label>
              <Input
                ref={telephoneRef}
                id="telephone"
                name="telephone"
                type="tel"
                autoComplete="tel"
                value={values.telephone}
                onChange={(event) => change("telephone", event.target.value)}
                aria-invalid={errors.telephone ? true : undefined}
                aria-describedby={
                  errors.telephone ? "telephone-error" : undefined
                }
                className={fieldClasses}
              />
              {errors.telephone && (
                <ErrorLine id="telephone-error">{errors.telephone}</ErrorLine>
              )}
            </div>
          </div>

          <div className="mt-8">
            <label htmlFor="area" className={fieldLabel}>
              What does the matter concern?
            </label>
            <Select
              value={values.area}
              onValueChange={(value) => change("area", value)}
            >
              <SelectTrigger
                ref={areaRef}
                id="area"
                aria-invalid={errors.area ? true : undefined}
                aria-describedby={errors.area ? "area-error" : undefined}
                className="mt-2"
              >
                <SelectValue placeholder="Choose an area" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.area && <ErrorLine id="area-error">{errors.area}</ErrorLine>}
          </div>

          <div className="mt-8">
            <label htmlFor="parties" className={fieldLabel}>
              Other parties involved (optional)
            </label>
            <p id="parties-help" className={helperLine}>
              Names of the other companies or people, so that we can check for
              conflicts.
            </p>
            <Input
              id="parties"
              name="parties"
              value={values.parties}
              onChange={(event) => change("parties", event.target.value)}
              aria-describedby="parties-help"
              className={fieldClasses}
            />
          </div>

          <div className="mt-8">
            <label htmlFor="message" className={fieldLabel}>
              Tell us about the matter
            </label>
            <p id="message-help" className={helperLine}>
              A few sentences: what happened, what you would like, and any
              deadline you know of.
            </p>
            <Textarea
              ref={messageRef}
              id="message"
              name="message"
              value={values.message}
              onChange={(event) => change("message", event.target.value)}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={
                errors.message ? "message-help message-error" : "message-help"
              }
              className={`${fieldClasses} min-h-48 resize-none`}
            />
            {errors.message && (
              <ErrorLine id="message-error">{errors.message}</ErrorLine>
            )}
          </div>

          <div className="mt-8">
            <div className="flex items-start gap-4">
              <Checkbox
                ref={consentRef}
                id="consent"
                name="consent"
                checked={values.consent}
                onCheckedChange={(checked) => change("consent", checked)}
                aria-labelledby="consent-label"
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? "consent-error" : undefined}
                className="mt-1"
              />
              <label
                id="consent-label"
                htmlFor="consent"
                className="text-body text-foreground"
              >
                I agree that Harrow &amp; Vane may use these details to reply
                to my enquiry and to check for conflicts of interest.
              </label>
            </div>
            {errors.consent && (
              <ErrorLine id="consent-error">{errors.consent}</ErrorLine>
            )}
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
            className={`mt-8 w-full md:w-auto ${buttonClasses}`}
          >
            Send enquiry
          </Button>
        </form>
      )}

      <div role="status">
        {sent !== null && (
          <div className="rounded-xl bg-card p-8">
            <h2
              ref={confirmationRef}
              tabIndex={-1}
              className="text-h2 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
            >
              Thank you. We have your enquiry
            </h2>
            <p className="mt-4 max-w-xl text-body wrap-break-word">
              {sent.area === "Something else"
                ? `A partner will reply to ${sent.email} within one working day.`
                : `A partner in ${sent.area} will reply to ${sent.email} within one working day.`}
            </p>
            <p className="mt-4 font-mono text-label text-muted-foreground uppercase tabular-nums">
              Reference · HV-2611-0418
            </p>
          </div>
        )}
      </div>

      {sent !== null && (
        <Button
          variant="secondary"
          onClick={startAgain}
          className={`mt-8 ${buttonClasses}`}
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
      <header className="flex flex-col items-start gap-4 border-b border-border py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={`font-heading text-h2 ${plainLink}`}>
          Harrow &amp; Vane
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={`font-mono text-label uppercase ${plainLink}${link.current ? " underline" : ""}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="mt-14 grid grid-cols-1 md:mt-28 md:grid-cols-12 md:gap-x-8">
          <p className="font-mono text-label text-muted-foreground uppercase md:col-span-12">
            Enquiries · Wexcombe
          </p>
          <h1 className="mt-4 text-h1 md:col-span-9 md:text-display">
            Tell us about your matter
          </h1>
          <p className="mt-8 max-w-xl md:col-span-7 md:col-start-1">
            Give us the outline and the names of the other parties, and a
            partner in the right team will reply within one working day. Please
            send no documents yet: we check for conflicts of interest first.
          </p>
        </section>

        <section className="mt-8 grid grid-cols-1 border-t border-border pt-8 md:mt-14 md:grid-cols-12 md:gap-x-8 md:pt-14">
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

            <h2 className={`mt-8 ${labelHeading}`}>Telephone</h2>
            <p className="mt-4 text-body">
              <a href="tel:01632960214" className={textLink}>
                01632 960 214
              </a>
            </p>

            <h2 className={`mt-8 ${labelHeading}`}>Hours</h2>
            <dl className="mt-4 border-b border-border">
              <div className="grid grid-cols-1 border-t border-border py-4 lg:grid-cols-3 lg:items-baseline lg:gap-x-4">
                <dt className="font-mono text-label text-muted-foreground uppercase">
                  Monday to Friday
                </dt>
                <dd className="mt-2 font-mono text-body tabular-nums lg:col-span-2 lg:mt-0">
                  <time dateTime="08:30">08:30</time>–
                  <time dateTime="17:30">17:30</time>
                </dd>
              </div>
              <div className="grid grid-cols-1 border-t border-border py-4 lg:grid-cols-3 lg:items-baseline lg:gap-x-4">
                <dt className="font-mono text-label text-muted-foreground uppercase">
                  Saturday and Sunday
                </dt>
                <dd className="mt-2 text-body lg:col-span-2 lg:mt-0">Closed</dd>
              </div>
            </dl>

            <h2 className={`mt-8 ${labelHeading}`}>What happens next</h2>
            <ol className="mt-4 list-none border-b border-border">
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="grid grid-cols-4 items-baseline gap-x-4 border-t border-border py-4"
                >
                  <span className="font-mono text-label text-muted-foreground uppercase tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="col-span-3 text-body">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <EnquiryForm />
        </section>
      </main>

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
            <p className="font-mono text-label uppercase">
              <a href="tel:01632960214" className={plainLink}>
                01632 960 214
              </a>
            </p>
            <p className="mt-2 font-mono text-label uppercase">
              <a
                href="mailto:enquiries@harrowvane.example"
                className={`normal-case ${plainLink}`}
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
              {navLinks.map((link, index) => (
                <li
                  key={link.href}
                  className={index > 0 ? "mt-2" : undefined}
                >
                  <a
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className={`font-mono text-label uppercase ${plainLink}${link.current ? " underline" : ""}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 font-mono text-label text-muted-foreground uppercase">
          © 2026 Harrow &amp; Vane LLP · Registered in England and Wales
        </p>
      </footer>
    </div>
  )
}

export default App
