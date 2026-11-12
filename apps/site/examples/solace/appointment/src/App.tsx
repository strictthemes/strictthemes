import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusOutline =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const navLink = `inline-flex h-11 items-center text-body text-foreground decoration-1 underline-offset-4 hover:underline transition-colors duration-150 ${focusOutline}`
const textLink = `text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground transition-colors duration-150 ${focusOutline}`
const cardClass = "rounded-xl border border-border bg-card p-7"
const labelLine = "font-mono text-label text-muted-foreground"
const fieldLabel = "block text-body font-medium text-foreground"
const fieldClass = "mt-2 h-auto border-muted-foreground px-4 py-2 text-body md:text-body"
const radioClass = `size-5 shrink-0 appearance-none rounded-full border border-muted-foreground checked:border-6 checked:border-primary ${focusOutline}`

const navItems = [
  { label: "Approach", href: "/approach" },
  { label: "About", href: "/about" },
  { label: "Fees", href: "/fees" },
  { label: "First session", href: "/first-session" },
]
const currentHref = "/first-session"

type Reply = "" | "email" | "phone"
type Place = "" | "in-person" | "online" | "either"
type TimeKey = "mornings" | "afternoons" | "evenings"
type FieldKey = "name" | "email" | "phone" | "reply" | "place" | "times" | "consent"
type Errors = Partial<Record<FieldKey, string>>

const replyOptions: { value: Exclude<Reply, "">; label: string }[] = [
  { value: "email", label: "By email" },
  { value: "phone", label: "By phone" },
]
const placeOptions: { value: Exclude<Place, "">; label: string }[] = [
  { value: "in-person", label: "In person, in Larkmere" },
  { value: "online", label: "Online, by video" },
  { value: "either", label: "Either is fine" },
]
const timeOptions: { value: TimeKey; label: string }[] = [
  { value: "mornings", label: "Mornings, 09:00 to 12:00" },
  { value: "afternoons", label: "Afternoons, 12:00 to 17:00" },
  { value: "evenings", label: "Wednesday evenings, 17:00 to 20:00" },
]

const MESSAGES = {
  name: "Write your name. A first name is enough.",
  emailEmpty: "Write your email address, so that I can reply.",
  emailMalformed:
    "Check the email address. It needs an @ and a domain, like name@example.com.",
  phoneMissing: "Write a phone number, or choose By email below.",
  phoneMalformed:
    "Check the phone number. It needs 10 to 15 digits. You can also leave it empty.",
  reply: "Choose email or phone.",
  place: "Choose one of the three. Either is fine.",
  times: "Tick at least one time. You can tick them all.",
  consent: "Tick the box, so that I may keep your details and reply.",
}

const ORDER: FieldKey[] = ["name", "email", "phone", "reply", "place", "times", "consent"]

function ErrorLine({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-body text-destructive">
      <CircleAlert className="mt-1 size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

function describedBy(...ids: (string | false | undefined)[]) {
  const list = ids.filter(Boolean).join(" ")
  return list || undefined
}

function NavList() {
  return (
    <ul className="flex flex-wrap gap-x-4 md:gap-x-7">
      {navItems.map((item) => {
        const current = item.href === currentHref
        return (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={current ? `${navLink} underline` : navLink}
            >
              {item.label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function FooterNavList() {
  return (
    <ul>
      {navItems.map((item) => {
        const current = item.href === currentHref
        return (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={current ? `${navLink} underline` : navLink}
            >
              {item.label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

type Sent = { name: string; email: string; phone: string; reply: Reply }

function RequestForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [reply, setReply] = useState<Reply>("")
  const [place, setPlace] = useState<Place>("")
  const [times, setTimes] = useState<Record<TimeKey, boolean>>({
    mornings: false,
    afternoons: false,
    evenings: false,
  })
  const [message, setMessage] = useState("")
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [focusRequest, setFocusRequest] = useState<{ key: FieldKey; n: number } | null>(null)
  const [sent, setSent] = useState<Sent | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const replyRef = useRef<HTMLInputElement>(null)
  const placeRef = useRef<HTMLInputElement>(null)
  const timesRef = useRef<HTMLElement>(null)
  const consentRef = useRef<HTMLElement>(null)
  const confirmRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!focusRequest) return
    const targets: Record<FieldKey, { current: HTMLElement | null }> = {
      name: nameRef,
      email: emailRef,
      phone: phoneRef,
      reply: replyRef,
      place: placeRef,
      times: timesRef,
      consent: consentRef,
    }
    targets[focusRequest.key].current?.focus()
  }, [focusRequest])

  useEffect(() => {
    if (sent) confirmRef.current?.focus()
  }, [sent])

  function clearError(key: FieldKey) {
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function validate(): Errors {
    const found: Errors = {}
    if (!name.trim()) found.name = MESSAGES.name
    const trimmedEmail = email.trim()
    if (!trimmedEmail) found.email = MESSAGES.emailEmpty
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail))
      found.email = MESSAGES.emailMalformed
    const compactPhone = phone.replace(/\s/g, "")
    if (!compactPhone) {
      if (reply === "phone") found.phone = MESSAGES.phoneMissing
    } else if (!/^\+?\d{10,15}$/.test(compactPhone)) {
      found.phone = MESSAGES.phoneMalformed
    }
    if (!reply) found.reply = MESSAGES.reply
    if (!place) found.place = MESSAGES.place
    if (!times.mornings && !times.afternoons && !times.evenings) found.times = MESSAGES.times
    if (!consent) found.consent = MESSAGES.consent
    return found
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    const first = ORDER.find((key) => found[key])
    if (first) {
      setFocusRequest((prev) => ({ key: first, n: (prev?.n ?? 0) + 1 }))
      return
    }
    setSent({ name: name.trim(), email: email.trim(), phone: phone.trim(), reply })
  }

  return (
    <div className={`mt-7 ${cardClass}`}>
      {!sent && (
        <form noValidate aria-labelledby="request-heading" onSubmit={handleSubmit}>
          <h2 id="request-heading" className="text-h2">
            Your request
          </h2>
          <p className="mt-4 max-w-xl text-body">
            Your name, an email address and the choices below are needed. The rest is
            up to you.
          </p>

          <div className="mt-7">
            <label htmlFor="name" className={fieldLabel}>
              Your name
            </label>
            <p id="name-help" className={`mt-2 ${labelLine}`}>
              A first name is enough.
            </p>
            <Input
              ref={nameRef}
              id="name"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                clearError("name")
              }}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describedBy("name-help", errors.name && "name-error")}
              className={fieldClass}
            />
            {errors.name && <ErrorLine id="name-error">{errors.name}</ErrorLine>}
          </div>

          <div className="mt-7">
            <label htmlFor="email" className={fieldLabel}>
              Email address
            </label>
            <Input
              ref={emailRef}
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                clearError("email")
              }}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy(errors.email && "email-error")}
              className={fieldClass}
            />
            {errors.email && <ErrorLine id="email-error">{errors.email}</ErrorLine>}
          </div>

          <div className="mt-7">
            <label htmlFor="phone" className={fieldLabel}>
              Phone number (optional)
            </label>
            <p id="phone-help" className={`mt-2 ${labelLine}`}>
              Only needed if you would like me to call.
            </p>
            <Input
              ref={phoneRef}
              id="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                clearError("phone")
              }}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={describedBy("phone-help", errors.phone && "phone-error")}
              className={fieldClass}
            />
            {errors.phone && <ErrorLine id="phone-error">{errors.phone}</ErrorLine>}
          </div>

          <div className="mt-7">
            <fieldset
              className="min-w-0"
              aria-describedby={describedBy("reply-help", errors.reply && "reply-error")}
            >
              <legend className="text-body font-medium text-foreground">
                How should I reply?
              </legend>
              <p id="reply-help" className={`mt-2 ${labelLine}`}>
                If I call and you cannot answer, I leave no message.
              </p>
              {replyOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={`flex min-h-11 items-center gap-4${index === 0 ? " mt-2" : ""}`}
                >
                  <input
                    ref={index === 0 ? replyRef : undefined}
                    type="radio"
                    id={`reply-${option.value}`}
                    name="reply"
                    value={option.value}
                    checked={reply === option.value}
                    onChange={() => {
                      setReply(option.value)
                      clearError("reply")
                      if (option.value === "email") {
                        setErrors((prev) => {
                          if (prev.phone !== MESSAGES.phoneMissing) return prev
                          const next = { ...prev }
                          delete next.phone
                          return next
                        })
                      }
                    }}
                    className={radioClass}
                  />
                  <label htmlFor={`reply-${option.value}`} className="text-body text-foreground">
                    {option.label}
                  </label>
                </div>
              ))}
              {errors.reply && <ErrorLine id="reply-error">{errors.reply}</ErrorLine>}
            </fieldset>
          </div>

          <div className="mt-7">
            <fieldset
              className="min-w-0"
              aria-describedby={describedBy(errors.place && "place-error")}
            >
              <legend className="text-body font-medium text-foreground">
                In person or online?
              </legend>
              {placeOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={`flex min-h-11 items-center gap-4${index === 0 ? " mt-2" : ""}`}
                >
                  <input
                    ref={index === 0 ? placeRef : undefined}
                    type="radio"
                    id={`place-${option.value}`}
                    name="place"
                    value={option.value}
                    checked={place === option.value}
                    onChange={() => {
                      setPlace(option.value)
                      clearError("place")
                    }}
                    className={radioClass}
                  />
                  <label htmlFor={`place-${option.value}`} className="text-body text-foreground">
                    {option.label}
                  </label>
                </div>
              ))}
              {errors.place && <ErrorLine id="place-error">{errors.place}</ErrorLine>}
            </fieldset>
          </div>

          <div className="mt-7">
            <fieldset
              className="min-w-0"
              aria-describedby={describedBy("times-help", errors.times && "times-error")}
            >
              <legend className="text-body font-medium text-foreground">
                Which times could suit you?
              </legend>
              <p id="times-help" className={`mt-2 ${labelLine}`}>
                Tick all that could work.
              </p>
              {timeOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={`flex min-h-11 items-center gap-4${index === 0 ? " mt-2" : ""}`}
                >
                  <Checkbox
                    ref={index === 0 ? timesRef : undefined}
                    id={`time-${option.value}`}
                    aria-labelledby={`time-${option.value}-label`}
                    checked={times[option.value]}
                    onCheckedChange={(checked) => {
                      setTimes((prev) => ({ ...prev, [option.value]: checked }))
                      clearError("times")
                    }}
                    className="size-5"
                  />
                  <label
                    id={`time-${option.value}-label`}
                    htmlFor={`time-${option.value}`}
                    className="text-body text-foreground"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
              {errors.times && <ErrorLine id="times-error">{errors.times}</ErrorLine>}
            </fieldset>
          </div>

          <div className="mt-7">
            <label htmlFor="message" className={fieldLabel}>
              What brings you here? (optional)
            </label>
            <p id="message-help" className={`mt-2 ${labelLine}`}>
              A sentence is enough. You can also leave this empty and tell me when we
              speak.
            </p>
            <Textarea
              id="message"
              maxLength={1000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              aria-describedby="message-help"
              className={`min-h-32 ${fieldClass}`}
            />
          </div>

          <div className="mt-7">
            <div className="flex items-start gap-4">
              <Checkbox
                ref={consentRef}
                id="consent"
                aria-labelledby="consent-label"
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={describedBy(errors.consent && "consent-error")}
                checked={consent}
                onCheckedChange={(checked) => {
                  setConsent(checked)
                  clearError("consent")
                }}
                className="mt-1 size-5"
              />
              <label
                id="consent-label"
                htmlFor="consent"
                className="text-body text-foreground"
              >
                I agree that Nora Ellingham may keep these details to reply to my
                request.
              </label>
            </div>
            {errors.consent && <ErrorLine id="consent-error">{errors.consent}</ErrorLine>}
          </div>

          <Button type="submit" className="mt-7 h-auto w-full px-7 py-2 text-body md:w-auto">
            Send my request
          </Button>
          <p className={`mt-4 ${labelLine}`}>Nothing is booked or charged when you send this.</p>
        </form>
      )}

      <div role="status">
        {sent && (
          <div>
            <h2 ref={confirmRef} tabIndex={-1} className={`text-h2 ${codeFocusOutline}`}>
              Thank you, {sent.name}. Your request is with me.
            </h2>
            <p className="mt-4 max-w-xl text-body">
              {sent.reply === "phone"
                ? `I will call ${sent.phone} within two working days. If I do not reach you, I will write to ${sent.email}.`
                : `I will write to ${sent.email} within two working days.`}
            </p>
            <p className="mt-4 max-w-xl text-body">
              I will offer you one or two times for a call of 20 minutes. It is free, and
              nothing is booked until we have spoken.
            </p>
            <p className="mt-4 max-w-xl text-body">
              You do not need to do anything else for now.
            </p>
          </div>
        )}
      </div>

      {sent && (
        <p className="mt-7 text-body">
          <a href="/approach" className={textLink}>
            Read how sessions work
          </a>
        </p>
      )}
    </div>
  )
}

const nextSteps = [
  { label: "Within 2 working days", text: "I reply, by email or by phone, as you chose." },
  { label: "20 minutes · Free", text: "We speak, by phone or video. You can ask me anything." },
  { label: "50 minutes · £68", text: "If we both wish, we arrange a first session." },
]

export function App() {
  return (
    <div className="mx-auto max-w-[1136px] px-4 text-body text-foreground md:px-7">
      <header className="flex flex-wrap items-center gap-x-7 py-4">
        <a
          href="/"
          className={`inline-flex h-11 items-center font-heading text-h2 text-foreground transition-colors duration-150 ${focusOutline}`}
        >
          Nora Ellingham
        </a>
        <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
          <NavList />
        </nav>
      </header>

      <main>
        <section
          aria-labelledby="page-heading"
          className="mt-12 grid grid-cols-1 md:mt-28 md:grid-cols-12 md:gap-x-7"
        >
          <p className={`md:col-span-12 ${labelLine}`}>
            First step · A call of 20 minutes · Free
          </p>
          <h1 id="page-heading" className="mt-4 text-h1 md:col-span-9 md:text-display">
            Request a first session
          </h1>
          <p className="mt-7 max-w-xl text-body md:col-span-7 md:col-start-1">
            Fill in what you can. I read every request myself, and I reply within two
            working days.
          </p>
        </section>

        <section
          aria-label="Your request"
          className="mt-28 grid grid-cols-1 md:grid-cols-12 md:gap-x-7"
        >
          <div className="md:col-span-7">
            <div role="note" aria-labelledby="emergency-heading" className={cardClass}>
              <h2 id="emergency-heading" className="text-h2">
                This is not an emergency service
              </h2>
              <p className="mt-4 max-w-xl text-body">
                I read requests on working days, and it can take me two days to reply. If
                you are in immediate danger, or you think you might harm yourself or
                someone else, please do not wait for me. Call your local emergency number
                or go to the nearest emergency department.
              </p>
            </div>

            <RequestForm />
          </div>

          <div className="mt-12 md:col-span-4 md:col-start-9 md:mt-0">
            <h2 className="text-h2">What happens next</h2>
            <ol className="mt-4 list-none border-b border-border p-0">
              {nextSteps.map((step) => (
                <li key={step.label} className="border-t border-border py-4">
                  <p className={labelLine}>{step.label}</p>
                  <p className="mt-2 max-w-xl text-body">{step.text}</p>
                </li>
              ))}
            </ol>

            <h2 className="mt-12 text-h2">Confidentiality</h2>
            <p className="mt-4 max-w-xl text-body">
              What you write here comes only to me. Nobody else reads it.
            </p>
            <p className="mt-4 max-w-xl text-body">
              I use it to reply to you, and for nothing else. I send no newsletters.
            </p>
            <p className="mt-4 max-w-xl text-body">
              If we do not go on to work together, I delete your details within 30 days.
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-28 border-t border-border py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-7">
          <div className="md:col-span-7">
            <p className="font-heading text-h2">Nora Ellingham</p>
            <p className={`mt-2 ${labelLine}`}>
              Registered psychotherapist · Larkmere and online
            </p>
            <address className="mt-7 text-body not-italic">
              The Garden Room, 14 Orchard Row, Larkmere LK2 4DN
            </address>
            <p className="mt-2 text-body">
              <a href="mailto:hello@ellingham.example" className={textLink}>
                hello@ellingham.example
              </a>
            </p>
          </div>
          <nav aria-label="Footer" className="mt-7 md:col-span-4 md:col-start-9 md:mt-0">
            <FooterNavList />
          </nav>
        </div>
        <p className="mt-7 max-w-xl text-body text-foreground">
          This practice is not an emergency service. In an emergency, call your local
          emergency number or go to the nearest emergency department.
        </p>
        <p className={`mt-4 ${labelLine}`}>© 2027 Nora Ellingham</p>
      </footer>
    </div>
  )
}

export default App
