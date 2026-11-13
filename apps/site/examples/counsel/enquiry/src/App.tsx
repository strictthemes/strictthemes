import { useEffect, useRef, useState, type FormEvent } from "react"
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
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const chromeLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusRing
)
const label = "font-mono text-label uppercase"
const fieldLabel = "block font-mono text-label uppercase text-foreground"
const fieldClass =
  "mt-2 h-auto border-muted-foreground px-4 py-2 text-body md:text-body"
const helperClass = "mt-2 font-mono text-label text-muted-foreground"
const buttonClass = "h-auto px-8 py-2 font-mono text-label font-normal uppercase"

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

type Field = "name" | "email" | "phone" | "area" | "message" | "consent"
type Errors = Partial<Record<Field, string>>

const order: Field[] = ["name", "email", "phone", "area", "message", "consent"]

const emptyValues = {
  name: "",
  organisation: "",
  email: "",
  phone: "",
  parties: "",
  message: "",
}

function ErrorLine({ id, message }: { id: string; message: string }) {
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
      <span>{message}</span>
    </p>
  )
}

function validate(
  values: typeof emptyValues,
  area: string | null,
  consent: boolean
): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = "Write your name."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Write an email address such as name@example.com."
  const phone = values.phone.trim()
  if (
    phone &&
    (!/^\+?[0-9 ]+$/.test(phone) || phone.replace(/\D/g, "").length < 10)
  )
    errors.phone =
      "Write a telephone number such as 01632 960 214, or leave it empty."
  if (!area) errors.area = "Choose what the matter concerns."
  if (values.message.trim().length < 20)
    errors.message = "Tell us about the matter in a sentence or two."
  if (!consent) errors.consent = "Tick the box so that we may reply to you."
  return errors
}

function describedBy(...ids: (string | false | undefined)[]) {
  const list = ids.filter(Boolean).join(" ")
  return list || undefined
}

export function App() {
  const [values, setValues] = useState(emptyValues)
  const [area, setArea] = useState<string | null>(null)
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState<{ area: string; email: string } | null>(
    null
  )
  const [focusRequest, setFocusRequest] = useState<{
    target: Field | "confirmation"
    n: number
  } | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const areaRef = useRef<HTMLButtonElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const consentRef = useRef<HTMLElement>(null)
  const confirmationRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!focusRequest) return
    const refs = {
      name: nameRef,
      email: emailRef,
      phone: phoneRef,
      area: areaRef,
      message: messageRef,
      consent: consentRef,
      confirmation: confirmationRef,
    }
    refs[focusRequest.target].current?.focus()
  }, [focusRequest])

  function request(target: Field | "confirmation") {
    setFocusRequest((prev) => ({ target, n: (prev?.n ?? 0) + 1 }))
  }

  function clearError(field: Field) {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function update(field: keyof typeof emptyValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (order.includes(field as Field)) clearError(field as Field)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(values, area, consent)
    setErrors(found)
    const first = order.find((field) => found[field])
    if (first) {
      request(first)
      return
    }
    setSent({ area: area as string, email: values.email.trim() })
    request("confirmation")
  }

  function startAgain() {
    setValues(emptyValues)
    setArea(null)
    setConsent(false)
    setErrors({})
    setSent(null)
    request("name")
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 text-body md:px-8">
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

      <main>
        <section className="mt-14 grid grid-cols-1 md:mt-28 md:grid-cols-12 md:gap-x-8">
          <p className={cn(label, "text-muted-foreground md:col-span-12")}>
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
            <h2 className={cn(label, "text-foreground")}>Address</h2>
            <address className="mt-4 not-italic">
              Harrow &amp; Vane LLP
              <br />4 Chancery Row
              <br />
              Wexcombe WX1 2LN
              <br />
              Second floor, with a lift
            </address>

            <h2 className={cn(label, "mt-8 text-foreground")}>Telephone</h2>
            <p className="mt-4">
              <a href="tel:01632960214" className={textLink}>
                01632 960 214
              </a>
            </p>

            <h2 className={cn(label, "mt-8 text-foreground")}>Hours</h2>
            <dl className="mt-4 border-b border-border">
              <div className="grid grid-cols-1 border-t border-border py-4 lg:grid-cols-3 lg:items-baseline lg:gap-x-4">
                <dt className={cn(label, "text-muted-foreground")}>
                  Monday to Friday
                </dt>
                <dd className="mt-2 font-mono text-body tabular-nums lg:col-span-2 lg:mt-0">
                  <time dateTime="08:30">08:30</time>–
                  <time dateTime="17:30">17:30</time>
                </dd>
              </div>
              <div className="grid grid-cols-1 border-t border-border py-4 lg:grid-cols-3 lg:items-baseline lg:gap-x-4">
                <dt className={cn(label, "text-muted-foreground")}>
                  Saturday and Sunday
                </dt>
                <dd className="mt-2 text-body lg:col-span-2 lg:mt-0">Closed</dd>
              </div>
            </dl>

            <h2 className={cn(label, "mt-8 text-foreground")}>
              What happens next
            </h2>
            <ol className="mt-4 border-b border-border">
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="grid grid-cols-4 items-baseline gap-x-4 border-t border-border py-4"
                >
                  <span
                    className={cn(label, "text-muted-foreground tabular-nums")}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="col-span-3">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-14 md:col-span-7 md:col-start-6 md:mt-0">
            {!sent && (
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
                <p className="mt-4">
                  Everything you send is read by a partner and kept
                  confidential.
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
                    aria-describedby={describedBy(
                      errors.name && "name-error"
                    )}
                    className={fieldClass}
                  />
                  {errors.name && (
                    <ErrorLine id="name-error" message={errors.name} />
                  )}
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
                      aria-describedby={describedBy(
                        errors.email && "email-error"
                      )}
                      className={fieldClass}
                    />
                    {errors.email && (
                      <ErrorLine id="email-error" message={errors.email} />
                    )}
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
                      aria-describedby={describedBy(
                        errors.phone && "phone-error"
                      )}
                      className={fieldClass}
                    />
                    {errors.phone && (
                      <ErrorLine id="phone-error" message={errors.phone} />
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <label
                    id="area-label"
                    htmlFor="area"
                    className={fieldLabel}
                  >
                    What does the matter concern?
                  </label>
                  <Select
                    value={area}
                    onValueChange={(value) => {
                      setArea(value as string | null)
                      clearError("area")
                    }}
                  >
                    <SelectTrigger
                      id="area"
                      ref={areaRef}
                      aria-labelledby="area-label"
                      aria-invalid={errors.area ? true : undefined}
                      aria-describedby={describedBy(
                        errors.area && "area-error"
                      )}
                      className="mt-2"
                    >
                      <SelectValue placeholder="Choose an area" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.area && (
                    <ErrorLine id="area-error" message={errors.area} />
                  )}
                </div>

                <div className="mt-8">
                  <label htmlFor="parties" className={fieldLabel}>
                    Other parties involved (optional)
                  </label>
                  <p id="parties-help" className={helperClass}>
                    Names of the other companies or people, so that we can
                    check for conflicts.
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
                  <p id="message-help" className={helperClass}>
                    A few sentences: what happened, what you would like, and
                    any deadline you know of.
                  </p>
                  <Textarea
                    id="message"
                    ref={messageRef}
                    value={values.message}
                    onChange={(e) => update("message", e.target.value)}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={describedBy(
                      "message-help",
                      errors.message && "message-error"
                    )}
                    className={cn(fieldClass, "min-h-48 resize-none")}
                  />
                  {errors.message && (
                    <ErrorLine id="message-error" message={errors.message} />
                  )}
                </div>

                <div className="mt-8">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      id="consent"
                      ref={consentRef}
                      checked={consent}
                      onCheckedChange={(checked) => {
                        setConsent(checked === true)
                        clearError("consent")
                      }}
                      aria-labelledby="consent-label"
                      aria-invalid={errors.consent ? true : undefined}
                      aria-describedby={describedBy(
                        errors.consent && "consent-error"
                      )}
                      className="mt-1"
                    />
                    <label
                      id="consent-label"
                      htmlFor="consent"
                      className="text-body text-foreground"
                    >
                      I agree that Harrow &amp; Vane may use these details to
                      reply to my enquiry and to check for conflicts of
                      interest.
                    </label>
                  </div>
                  {errors.consent && (
                    <ErrorLine id="consent-error" message={errors.consent} />
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
                  className={cn(buttonClass, "mt-8 w-full md:w-auto")}
                >
                  Send enquiry
                </Button>
              </form>
            )}

            <div role="status">
              {sent && (
                <div className="rounded-xl bg-card p-8">
                  <h2
                    ref={confirmationRef}
                    tabIndex={-1}
                    className={cn("text-h2", codeFocusRing)}
                  >
                    Thank you. We have your enquiry
                  </h2>
                  <p className="mt-4 wrap-anywhere">
                    {sent.area === "Something else"
                      ? `A partner will reply to ${sent.email} within one working day.`
                      : `A partner in ${sent.area} will reply to ${sent.email} within one working day.`}
                  </p>
                  <p
                    className={cn(
                      label,
                      "mt-4 text-muted-foreground tabular-nums"
                    )}
                  >
                    Reference · HV-2611-0418
                  </p>
                </div>
              )}
            </div>

            {sent && (
              <Button
                variant="secondary"
                onClick={startAgain}
                className={cn(buttonClass, "mt-8 w-full md:w-auto")}
              >
                Send another enquiry
              </Button>
            )}
          </div>
        </section>
      </main>

      <footer className="mt-14 border-t border-border py-8 md:mt-28">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-4">
            <p className="font-heading text-h2">Harrow &amp; Vane LLP</p>
            <address
              className={cn(label, "mt-2 not-italic text-muted-foreground tabular-nums")}
            >
              <p>4 Chancery Row</p>
              <p>Wexcombe WX1 2LN</p>
            </address>
          </div>
          <div className="mt-8 md:col-span-4 md:col-start-5 md:mt-0">
            <p className={cn(label, "tabular-nums")}>
              <a href="tel:01632960214" className={chromeLink}>
                01632 960 214
              </a>
            </p>
            <p className={cn(label, "mt-2 wrap-anywhere")}>
              <a
                href="mailto:enquiries@harrowvane.example"
                className={cn(chromeLink, "normal-case")}
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
                <li key={link.href} className={index > 0 ? "mt-2" : undefined}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className={cn(
                      label,
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
        </div>
        <p className={cn(label, "mt-8 text-muted-foreground tabular-nums")}>
          © 2026 Harrow &amp; Vane LLP · Registered in England and Wales
        </p>
      </footer>
    </div>
  )
}

export default App
