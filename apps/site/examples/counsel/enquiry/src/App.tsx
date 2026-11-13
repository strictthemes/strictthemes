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

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusOutline =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusOutline
)
const plainLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const navLinks = [
  { label: "Practice", href: "/practice/commercial-disputes" },
  { label: "People", href: "/people/ruth-calloway" },
  { label: "Insights", href: "/insights/notice-clauses" },
  { label: "Contact", href: "/contact" },
]
const currentHref = "/contact"

const areas = [
  "Corporate",
  "Commercial disputes",
  "Employment",
  "Real estate",
  "Private client",
  "Something else",
]

const buttonClasses = "h-auto px-8 py-2 font-mono text-label font-normal uppercase"
const fieldClasses =
  "mt-2 h-auto border-muted-foreground px-4 py-2 text-body md:text-body"
const labelClasses = "block font-mono text-label uppercase text-foreground"
const helperClasses = "mt-2 font-mono text-label text-muted-foreground"

type FieldKey = "name" | "email" | "phone" | "area" | "message" | "consent"
type Errors = Partial<Record<FieldKey, string>>

const fieldOrder: FieldKey[] = [
  "name",
  "email",
  "phone",
  "area",
  "message",
  "consent",
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function checkPhone(value: string) {
  if (value === "") return true
  if (!/^\+?[\d ]+$/.test(value)) return false
  return value.replace(/\D/g, "").length >= 10
}

function ErrorLine({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      {children}
    </p>
  )
}

type Sent = { area: string; email: string }

export function App() {
  const [name, setName] = useState("")
  const [organisation, setOrganisation] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [area, setArea] = useState<string | null>(null)
  const [parties, setParties] = useState("")
  const [message, setMessage] = useState("")
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState<Sent | null>(null)
  const [focusRequest, setFocusRequest] = useState<{
    target: FieldKey | "confirmation"
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
    const frame = requestAnimationFrame(() => {
      refs[focusRequest.target].current?.focus()
    })
    return () => cancelAnimationFrame(frame)
  }, [focusRequest])

  function requestFocus(target: FieldKey | "confirmation") {
    setFocusRequest((previous) => ({ target, n: (previous?.n ?? 0) + 1 }))
  }

  function clearError(key: FieldKey) {
    setErrors((previous) => {
      if (!previous[key]) return previous
      const next = { ...previous }
      delete next[key]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedPhone = phone.trim()
    const trimmedMessage = message.trim()

    const found: Errors = {}
    if (trimmedName === "") found.name = "Write your name."
    if (!emailPattern.test(trimmedEmail))
      found.email = "Write an email address such as name@example.com."
    if (!checkPhone(trimmedPhone))
      found.phone =
        "Write a telephone number such as 01632 960 214, or leave it empty."
    if (!area) found.area = "Choose what the matter concerns."
    if (trimmedMessage.length < 20)
      found.message = "Tell us about the matter in a sentence or two."
    if (!consent) found.consent = "Tick the box so that we may reply to you."

    setErrors(found)
    const first = fieldOrder.find((key) => found[key])
    if (first) {
      requestFocus(first)
      return
    }
    setSent({ area: area as string, email: trimmedEmail })
    requestFocus("confirmation")
  }

  function startAgain() {
    setName("")
    setOrganisation("")
    setEmail("")
    setPhone("")
    setArea(null)
    setParties("")
    setMessage("")
    setConsent(false)
    setErrors({})
    setSent(null)
    requestFocus("name")
  }

  const describedBy = (key: FieldKey, helper?: string) =>
    [helper, errors[key] ? `${key}-error` : undefined]
      .filter(Boolean)
      .join(" ") || undefined

  return (
    <div className="mx-auto max-w-[1200px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 border-b border-border py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", plainLink)}>
          Harrow &amp; Vane
        </a>
        <nav aria-label="Main">
          <ul className="flex list-none flex-wrap gap-x-4 gap-y-2 md:gap-x-8">
            {navLinks.map((link) => {
              const current = link.href === currentHref
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "font-mono text-label uppercase",
                      plainLink,
                      current && "underline"
                    )}
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
        <section className="mt-14 grid grid-cols-1 md:mt-28 md:grid-cols-12 md:gap-x-8">
          <p className="font-mono text-label uppercase text-muted-foreground md:col-span-12">
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
          <div className="md:col-span-4">
            <h2 className="font-mono text-label uppercase text-foreground">
              Address
            </h2>
            <address className="mt-4 text-body not-italic">
              Harrow &amp; Vane LLP
              <br />4 Chancery Row
              <br />
              Wexcombe WX1 2LN
              <br />
              Second floor, with a lift
            </address>

            <h2 className="mt-8 font-mono text-label uppercase text-foreground">
              Telephone
            </h2>
            <p className="mt-4 text-body">
              <a href="tel:01632960214" className={textLink}>
                01632 960 214
              </a>
            </p>

            <h2 className="mt-8 font-mono text-label uppercase text-foreground">
              Hours
            </h2>
            <dl className="mt-4 border-b border-border">
              <div className="grid grid-cols-1 border-t border-border py-4 lg:grid-cols-3 lg:items-baseline lg:gap-x-4">
                <dt className="font-mono text-label uppercase text-muted-foreground">
                  Monday to Friday
                </dt>
                <dd className="mt-2 font-mono text-body tabular-nums lg:col-span-2 lg:mt-0">
                  <time dateTime="08:30">08:30</time>–
                  <time dateTime="17:30">17:30</time>
                </dd>
              </div>
              <div className="grid grid-cols-1 border-t border-border py-4 lg:grid-cols-3 lg:items-baseline lg:gap-x-4">
                <dt className="font-mono text-label uppercase text-muted-foreground">
                  Saturday and Sunday
                </dt>
                <dd className="mt-2 text-body lg:col-span-2 lg:mt-0">Closed</dd>
              </div>
            </dl>

            <h2 className="mt-8 font-mono text-label uppercase text-foreground">
              What happens next
            </h2>
            <ol className="mt-4 list-none border-b border-border p-0">
              {[
                "We check the names you give us for conflicts of interest.",
                "A partner in the right team replies within one working day.",
                "If we can help, the first meeting, of up to an hour, is free.",
              ].map((step, index) => (
                <li
                  key={step}
                  className="grid grid-cols-4 items-baseline gap-x-4 border-t border-border py-4"
                >
                  <span className="font-mono text-label uppercase text-muted-foreground tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="col-span-3 text-body">{step}</p>
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
                  <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal uppercase text-tertiary-foreground">
                    Free consultation
                  </Badge>
                </div>
                <p className="mt-4 text-body">
                  Everything you send is read by a partner and kept
                  confidential.
                </p>

                <div className="mt-8">
                  <label htmlFor="name" className={labelClasses}>
                    Your name
                  </label>
                  <Input
                    id="name"
                    ref={nameRef}
                    autoComplete="name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value)
                      clearError("name")
                    }}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={describedBy("name")}
                    className={fieldClasses}
                  />
                  {errors.name && (
                    <ErrorLine id="name-error">{errors.name}</ErrorLine>
                  )}
                </div>

                <div className="mt-8">
                  <label htmlFor="organisation" className={labelClasses}>
                    Organisation (optional)
                  </label>
                  <Input
                    id="organisation"
                    autoComplete="organization"
                    value={organisation}
                    onChange={(event) => setOrganisation(event.target.value)}
                    className={fieldClasses}
                  />
                </div>

                <div className="mt-8 md:grid md:grid-cols-2 md:gap-x-8">
                  <div>
                    <label htmlFor="email" className={labelClasses}>
                      Email address
                    </label>
                    <Input
                      id="email"
                      ref={emailRef}
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)
                        clearError("email")
                      }}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={describedBy("email")}
                      className={fieldClasses}
                    />
                    {errors.email && (
                      <ErrorLine id="email-error">{errors.email}</ErrorLine>
                    )}
                  </div>
                  <div className="mt-8 md:mt-0">
                    <label htmlFor="phone" className={labelClasses}>
                      Telephone (optional)
                    </label>
                    <Input
                      id="phone"
                      ref={phoneRef}
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value)
                        clearError("phone")
                      }}
                      aria-invalid={errors.phone ? true : undefined}
                      aria-describedby={describedBy("phone")}
                      className={fieldClasses}
                    />
                    {errors.phone && (
                      <ErrorLine id="phone-error">{errors.phone}</ErrorLine>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <label
                    id="area-label"
                    htmlFor="area"
                    className={labelClasses}
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
                      aria-describedby={describedBy("area")}
                      className="mt-2"
                    >
                      <SelectValue placeholder="Choose an area" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((choice) => (
                        <SelectItem key={choice} value={choice}>
                          {choice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.area && (
                    <ErrorLine id="area-error">{errors.area}</ErrorLine>
                  )}
                </div>

                <div className="mt-8">
                  <label htmlFor="parties" className={labelClasses}>
                    Other parties involved (optional)
                  </label>
                  <p id="parties-help" className={helperClasses}>
                    Names of the other companies or people, so that we can
                    check for conflicts.
                  </p>
                  <Input
                    id="parties"
                    value={parties}
                    onChange={(event) => setParties(event.target.value)}
                    aria-describedby="parties-help"
                    className={fieldClasses}
                  />
                </div>

                <div className="mt-8">
                  <label htmlFor="message" className={labelClasses}>
                    Tell us about the matter
                  </label>
                  <p id="message-help" className={helperClasses}>
                    A few sentences: what happened, what you would like, and
                    any deadline you know of.
                  </p>
                  <Textarea
                    id="message"
                    ref={messageRef}
                    value={message}
                    onChange={(event) => {
                      setMessage(event.target.value)
                      clearError("message")
                    }}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={describedBy("message", "message-help")}
                    className={cn(fieldClasses, "min-h-48 resize-none")}
                  />
                  {errors.message && (
                    <ErrorLine id="message-error">{errors.message}</ErrorLine>
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
                      aria-describedby={describedBy("consent")}
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
                  className={cn(buttonClasses, "mt-8 w-full md:w-auto")}
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
                    className={cn("text-h2", codeFocusOutline)}
                  >
                    Thank you. We have your enquiry
                  </h2>
                  <p className="mt-4 text-body wrap-anywhere">
                    {sent.area === "Something else"
                      ? `A partner will reply to ${sent.email} within one working day.`
                      : `A partner in ${sent.area} will reply to ${sent.email} within one working day.`}
                  </p>
                  <p className="mt-4 font-mono text-label uppercase text-muted-foreground">
                    Reference · HV-2611-0418
                  </p>
                </div>
              )}
            </div>

            {sent && (
              <Button
                variant="secondary"
                onClick={startAgain}
                className={cn(buttonClasses, "mt-8")}
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
            <address className="mt-2 font-mono text-label uppercase text-muted-foreground not-italic">
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
            <p className="mt-2 font-mono text-label uppercase wrap-anywhere">
              <a
                href="mailto:enquiries@harrowvane.example"
                className={cn("normal-case", plainLink)}
              >
                enquiries@harrowvane.example
              </a>
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="mt-8 md:col-span-4 md:col-start-9 md:mt-0"
          >
            <ul className="list-none">
              {navLinks.map((link, index) => {
                const current = link.href === currentHref
                return (
                  <li key={link.href} className={index > 0 ? "mt-2" : undefined}>
                    <a
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "font-mono text-label uppercase",
                        plainLink,
                        current && "underline"
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
        <p className="mt-8 font-mono text-label uppercase text-muted-foreground">
          © 2026 Harrow &amp; Vane LLP · Registered in England and Wales
        </p>
      </footer>
    </div>
  )
}

export default App
