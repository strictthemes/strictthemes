import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const navLink = cn(
  "inline-flex h-11 items-center text-body text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusRing
)
const card = "rounded-xl border border-border bg-card p-7"
const labelLine = "font-mono text-label text-muted-foreground"
const fieldLabel = "block text-body font-medium text-foreground"
const fieldClass = "h-auto border-muted-foreground px-4 py-2 text-body md:text-body"
const optionRow = "flex min-h-11 items-center gap-4"
const optionLabel = "text-body text-foreground"

const navItems = [
  { label: "Approach", href: "/approach" },
  { label: "About", href: "/about" },
  { label: "Fees", href: "/fees" },
  { label: "First session", href: "/first-session" },
]
const current = "/first-session"

type Reply = "" | "email" | "phone"
type Place = "" | "in-person" | "online" | "either"
type TimeKey = "mornings" | "afternoons" | "evenings"
type FieldKey =
  | "name"
  | "email"
  | "phone"
  | "reply"
  | "place"
  | "times"
  | "consent"
type Errors = Partial<Record<FieldKey, string>>

const timeOptions: { key: TimeKey; label: string }[] = [
  { key: "mornings", label: "Mornings, 09:00 to 12:00" },
  { key: "afternoons", label: "Afternoons, 12:00 to 17:00" },
  { key: "evenings", label: "Wednesday evenings, 17:00 to 20:00" },
]

const PHONE_MISSING = "Write a phone number, or choose By email below."
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Sent = { name: string; email: string; phone: string; reply: Reply }

function ids(...values: (string | false | undefined)[]) {
  const list = values.filter(Boolean)
  return list.length ? list.join(" ") : undefined
}

function ErrorLine({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-body text-destructive">
      <CircleAlert
        className="mt-1 size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span>{children}</span>
    </p>
  )
}

function Nav({ label, row }: { label: string; row: boolean }) {
  return (
    <nav
      aria-label={label}
      className={row ? "w-full md:ml-auto md:w-auto" : undefined}
    >
      <ul className={row ? "flex flex-wrap gap-x-4 md:gap-x-7" : undefined}>
        {navItems.map((item) => {
          const isCurrent = item.href === current
          return (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(navLink, isCurrent && "underline")}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

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
  const [focusTarget, setFocusTarget] = useState<{ key: FieldKey } | null>(null)
  const [sent, setSent] = useState<Sent | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const replyRef = useRef<HTMLButtonElement>(null)
  const placeRef = useRef<HTMLButtonElement>(null)
  const timesRef = useRef<HTMLButtonElement>(null)
  const consentRef = useRef<HTMLButtonElement>(null)
  const thanksRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!focusTarget) return
    const refs = {
      name: nameRef,
      email: emailRef,
      phone: phoneRef,
      reply: replyRef,
      place: placeRef,
      times: timesRef,
      consent: consentRef,
    }
    refs[focusTarget.key].current?.focus()
  }, [focusTarget])

  useEffect(() => {
    if (sent) thanksRef.current?.focus()
  }, [sent])

  function clear(key: FieldKey) {
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const n = name.trim()
    const e = email.trim()
    const p = phone.trim()
    const found: Errors = {}

    if (!n) found.name = "Write your name. A first name is enough."

    if (!e) found.email = "Write your email address, so that I can reply."
    else if (!EMAIL_PATTERN.test(e))
      found.email =
        "Check the email address. It needs an @ and a domain, like name@example.com."

    if (!p && reply === "phone") found.phone = PHONE_MISSING
    else if (p && !/^\+?\d{10,15}$/.test(p.replace(/\s/g, "")))
      found.phone =
        "Check the phone number. It needs 10 to 15 digits. You can also leave it empty."

    if (!reply) found.reply = "Choose email or phone."
    if (!place) found.place = "Choose one of the three. Either is fine."
    if (!times.mornings && !times.afternoons && !times.evenings)
      found.times = "Tick at least one time. You can tick them all."
    if (!consent)
      found.consent = "Tick the box, so that I may keep your details and reply."

    setErrors(found)
    const order: FieldKey[] = [
      "name",
      "email",
      "phone",
      "reply",
      "place",
      "times",
      "consent",
    ]
    const first = order.find((key) => found[key])
    if (first) {
      setFocusTarget({ key: first })
      return
    }
    setSent({ name: n, email: e, phone: p, reply })
  }

  return (
    <div className={cn(card, "mt-7")}>
      {!sent && (
        <form noValidate aria-labelledby="request-heading" onSubmit={handleSubmit}>
          <h2 id="request-heading" className="text-h2">
            Your request
          </h2>
          <p className="mt-4 max-w-xl text-body">
            Your name, an email address and the choices below are needed. The
            rest is up to you.
          </p>

          <div className="mt-7">
            <label htmlFor="name" className={fieldLabel}>
              Your name
            </label>
            <p id="name-help" className={cn("mt-2", labelLine)}>
              A first name is enough.
            </p>
            <Input
              ref={nameRef}
              id="name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(ev) => {
                setName(ev.target.value)
                clear("name")
              }}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={ids("name-help", errors.name && "name-error")}
              className={cn("mt-2", fieldClass)}
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
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => {
                setEmail(ev.target.value)
                clear("email")
              }}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={ids(errors.email && "email-error")}
              className={cn("mt-2", fieldClass)}
            />
            {errors.email && (
              <ErrorLine id="email-error">{errors.email}</ErrorLine>
            )}
          </div>

          <div className="mt-7">
            <label htmlFor="phone" className={fieldLabel}>
              Phone number (optional)
            </label>
            <p id="phone-help" className={cn("mt-2", labelLine)}>
              Only needed if you would like me to call.
            </p>
            <Input
              ref={phoneRef}
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(ev) => {
                setPhone(ev.target.value)
                clear("phone")
              }}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={ids("phone-help", errors.phone && "phone-error")}
              className={cn("mt-2", fieldClass)}
            />
            {errors.phone && (
              <ErrorLine id="phone-error">{errors.phone}</ErrorLine>
            )}
          </div>

          <div className="mt-7">
            <fieldset
              className="min-w-0"
              aria-describedby={ids("reply-help", errors.reply && "reply-error")}
            >
              <legend id="reply-legend" className={fieldLabel}>
                How should I reply?
              </legend>
              <p id="reply-help" className={cn("mt-2", labelLine)}>
                If I call and you cannot answer, I leave no message.
              </p>
              <RadioGroup
                name="reply"
                value={reply}
                onValueChange={(value) => {
                  setReply(value as Reply)
                  setErrors((prev) => {
                    const next = { ...prev }
                    delete next.reply
                    if (value === "email" && next.phone === PHONE_MISSING)
                      delete next.phone
                    return next
                  })
                }}
                aria-labelledby="reply-legend"
                aria-invalid={errors.reply ? true : undefined}
                className="mt-2 gap-0"
              >
                <div className={optionRow}>
                  <RadioGroupItem
                    ref={replyRef}
                    value="email"
                    id="reply-email"
                    className="size-5"
                  />
                  <label htmlFor="reply-email" className={optionLabel}>
                    By email
                  </label>
                </div>
                <div className={optionRow}>
                  <RadioGroupItem value="phone" id="reply-phone" className="size-5" />
                  <label htmlFor="reply-phone" className={optionLabel}>
                    By phone
                  </label>
                </div>
              </RadioGroup>
              {errors.reply && (
                <ErrorLine id="reply-error">{errors.reply}</ErrorLine>
              )}
            </fieldset>
          </div>

          <div className="mt-7">
            <fieldset
              className="min-w-0"
              aria-describedby={ids(errors.place && "place-error")}
            >
              <legend id="place-legend" className={fieldLabel}>
                In person or online?
              </legend>
              <RadioGroup
                name="place"
                value={place}
                onValueChange={(value) => {
                  setPlace(value as Place)
                  clear("place")
                }}
                aria-labelledby="place-legend"
                aria-invalid={errors.place ? true : undefined}
                className="mt-2 gap-0"
              >
                <div className={optionRow}>
                  <RadioGroupItem
                    ref={placeRef}
                    value="in-person"
                    id="place-in-person"
                    className="size-5"
                  />
                  <label htmlFor="place-in-person" className={optionLabel}>
                    In person, in Larkmere
                  </label>
                </div>
                <div className={optionRow}>
                  <RadioGroupItem
                    value="online"
                    id="place-online"
                    className="size-5"
                  />
                  <label htmlFor="place-online" className={optionLabel}>
                    Online, by video
                  </label>
                </div>
                <div className={optionRow}>
                  <RadioGroupItem
                    value="either"
                    id="place-either"
                    className="size-5"
                  />
                  <label htmlFor="place-either" className={optionLabel}>
                    Either is fine
                  </label>
                </div>
              </RadioGroup>
              {errors.place && (
                <ErrorLine id="place-error">{errors.place}</ErrorLine>
              )}
            </fieldset>
          </div>

          <div className="mt-7">
            <fieldset
              className="min-w-0"
              aria-describedby={ids("times-help", errors.times && "times-error")}
            >
              <legend className={fieldLabel}>Which times could suit you?</legend>
              <p id="times-help" className={cn("mt-2", labelLine)}>
                Tick all that could work.
              </p>
              {timeOptions.map((option, index) => (
                <div
                  key={option.key}
                  className={cn(optionRow, index === 0 && "mt-2")}
                >
                  <Checkbox
                    ref={index === 0 ? timesRef : undefined}
                    id={`time-${option.key}`}
                    name="times"
                    value={option.key}
                    checked={times[option.key]}
                    onCheckedChange={(checked) => {
                      setTimes((prev) => ({ ...prev, [option.key]: checked }))
                      clear("times")
                    }}
                    aria-labelledby={`time-${option.key}-label`}
                    aria-invalid={errors.times ? true : undefined}
                    className="size-5"
                  />
                  <label
                    id={`time-${option.key}-label`}
                    htmlFor={`time-${option.key}`}
                    className={optionLabel}
                  >
                    {option.label}
                  </label>
                </div>
              ))}
              {errors.times && (
                <ErrorLine id="times-error">{errors.times}</ErrorLine>
              )}
            </fieldset>
          </div>

          <div className="mt-7">
            <label htmlFor="message" className={fieldLabel}>
              What brings you here? (optional)
            </label>
            <p id="message-help" className={cn("mt-2", labelLine)}>
              A sentence is enough. You can also leave this empty and tell me
              when we speak.
            </p>
            <Textarea
              id="message"
              name="message"
              maxLength={1000}
              value={message}
              onChange={(ev) => setMessage(ev.target.value)}
              aria-describedby="message-help"
              className={cn("mt-2 min-h-32 resize-none", fieldClass)}
            />
          </div>

          <div className="mt-7">
            <div className="flex items-start gap-4">
              <Checkbox
                ref={consentRef}
                id="consent"
                name="consent"
                checked={consent}
                onCheckedChange={(checked) => {
                  setConsent(checked)
                  clear("consent")
                }}
                aria-labelledby="consent-label"
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={ids(errors.consent && "consent-error")}
                className="mt-1 size-5"
              />
              <label
                id="consent-label"
                htmlFor="consent"
                className="text-body text-foreground"
              >
                I agree that Nora Ellingham may keep these details to reply to
                my request.
              </label>
            </div>
            {errors.consent && (
              <ErrorLine id="consent-error">{errors.consent}</ErrorLine>
            )}
          </div>

          <Button
            type="submit"
            className="mt-7 h-auto w-full px-7 py-2 text-body md:w-auto"
          >
            Send my request
          </Button>
          <p className={cn("mt-4", labelLine)}>
            Nothing is booked or charged when you send this.
          </p>
        </form>
      )}

      <div role="status">
        {sent && (
          <div>
            <h2
              ref={thanksRef}
              tabIndex={-1}
              className={cn("text-h2 wrap-break-word", codeFocusRing)}
            >
              Thank you, {sent.name}. Your request is with me.
            </h2>
            <p className="mt-4 max-w-xl text-body wrap-break-word">
              {sent.reply === "phone"
                ? `I will call ${sent.phone} within two working days. If I do not reach you, I will write to ${sent.email}.`
                : `I will write to ${sent.email} within two working days.`}
            </p>
            <p className="mt-4 max-w-xl text-body">
              I will offer you one or two times for a call of 20 minutes. It is
              free, and nothing is booked until we have spoken.
            </p>
            <p className="mt-4 max-w-xl text-body">
              You do not need to do anything else for now.
            </p>
          </div>
        )}
      </div>
      {sent && (
        <p className="mt-7">
          <a href="/approach" className={textLink}>
            Read how sessions work
          </a>
        </p>
      )}
    </div>
  )
}

const steps = [
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
          className={cn(
            "inline-flex h-11 items-center font-heading text-h2 text-foreground transition-colors duration-150",
            focusRing
          )}
        >
          Nora Ellingham
        </a>
        <Nav label="Main" row />
      </header>

      <main>
        <section
          aria-labelledby="page-heading"
          className="mt-12 grid grid-cols-1 md:mt-28 md:grid-cols-12 md:gap-x-7"
        >
          <p className={cn(labelLine, "md:col-span-12")}>
            First step · A call of 20 minutes · Free
          </p>
          <h1
            id="page-heading"
            className="mt-4 text-h1 md:col-span-9 md:text-display"
          >
            Request a first session
          </h1>
          <p className="mt-7 max-w-xl text-body md:col-span-7 md:col-start-1">
            Fill in what you can. I read every request myself, and I reply
            within two working days.
          </p>
        </section>

        <section
          aria-label="Your request"
          className="mt-28 grid grid-cols-1 md:grid-cols-12 md:gap-x-7"
        >
          <div className="md:col-span-7">
            <div role="note" aria-labelledby="emergency-heading" className={card}>
              <h2 id="emergency-heading" className="text-h2">
                This is not an emergency service
              </h2>
              <p className="mt-4 max-w-xl text-body">
                I read requests on working days, and it can take me two days to
                reply. If you are in immediate danger, or you think you might
                harm yourself or someone else, please do not wait for me. Call
                your local emergency number or go to the nearest emergency
                department.
              </p>
            </div>
            <RequestForm />
          </div>

          <div className="mt-12 md:col-span-4 md:col-start-9 md:mt-0">
            <h2 className="text-h2">What happens next</h2>
            <ol className="mt-4 list-none border-b border-border p-0">
              {steps.map((step) => (
                <li key={step.label} className="border-t border-border py-4">
                  <p className={labelLine}>{step.label}</p>
                  <p className="mt-2 text-body">{step.text}</p>
                </li>
              ))}
            </ol>

            <h2 className="mt-12 text-h2">Confidentiality</h2>
            <p className="mt-4 max-w-xl text-body">
              What you write here comes only to me. Nobody else reads it.
            </p>
            <p className="mt-4 max-w-xl text-body">
              I use it to reply to you, and for nothing else. I send no
              newsletters.
            </p>
            <p className="mt-4 max-w-xl text-body">
              If we do not go on to work together, I delete your details within
              30 days.
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-28 border-t border-border py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-7">
          <div className="md:col-span-7">
            <p className="font-heading text-h2">Nora Ellingham</p>
            <p className={cn("mt-2", labelLine)}>
              Registered psychotherapist · Larkmere and online
            </p>
            <address className="mt-7 text-body not-italic">
              The Garden Room, 14 Orchard Row, Larkmere LK2 4DN
            </address>
            <p className="mt-2">
              <a href="mailto:hello@ellingham.example" className={textLink}>
                hello@ellingham.example
              </a>
            </p>
          </div>
          <div className="mt-7 md:col-span-4 md:col-start-9 md:mt-0">
            <Nav label="Footer" row={false} />
          </div>
        </div>
        <p className="mt-7 max-w-xl text-body text-foreground">
          This practice is not an emergency service. In an emergency, call your
          local emergency number or go to the nearest emergency department.
        </p>
        <p className={cn("mt-4", labelLine)}>© 2027 Nora Ellingham</p>
      </footer>
    </div>
  )
}

export default App
