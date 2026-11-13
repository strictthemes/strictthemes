import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from "react"
import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const focusRingCode =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusRing
)
const navLink = cn(
  "inline-flex h-11 items-center text-body text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const inputClass =
  "mt-2 h-auto border-muted-foreground px-4 py-2 text-body md:text-body"
const fieldLabel = "block text-body font-medium text-foreground"
const caption = "font-mono text-label text-muted-foreground"
const card = "rounded-xl border border-border bg-card p-7"

const navItems = [
  { label: "Approach", href: "/approach" },
  { label: "About", href: "/about" },
  { label: "Fees", href: "/fees" },
  { label: "First session", href: "/first-session" },
]
const CURRENT = "/first-session"

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
const ORDER: FieldKey[] = [
  "name",
  "email",
  "phone",
  "reply",
  "place",
  "times",
  "consent",
]

type Sent = { name: string; email: string; phone: string; reply: Reply }

function NavList({ vertical = false }: { vertical?: boolean }) {
  return (
    <ul
      className={cn(
        "list-none",
        vertical ? "flex flex-col" : "flex flex-wrap gap-x-4 md:gap-x-7"
      )}
    >
      {navItems.map((item) => {
        const current = item.href === CURRENT
        return (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={cn(navLink, current && "underline")}
            >
              {item.label}
            </a>
          </li>
        )
      })}
    </ul>
  )
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

function describedBy(...ids: (string | false | undefined)[]) {
  const list = ids.filter(Boolean).join(" ")
  return list || undefined
}

export function App() {
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
  const [focusTarget, setFocusTarget] = useState<{ key: FieldKey } | null>(
    null
  )
  const [sent, setSent] = useState<Sent | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const replyRef = useRef<HTMLElement>(null)
  const placeRef = useRef<HTMLElement>(null)
  const timesRef = useRef<HTMLElement>(null)
  const consentRef = useRef<HTMLElement>(null)
  const confirmRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!focusTarget) return
    const refs: Record<FieldKey, RefObject<HTMLElement | null>> = {
      name: nameRef,
      email: emailRef,
      phone: phoneRef,
      reply: replyRef,
      place: placeRef,
      times: timesRef,
      consent: consentRef,
    }
    const frame = requestAnimationFrame(() => {
      refs[focusTarget.key].current?.focus()
    })
    return () => cancelAnimationFrame(frame)
  }, [focusTarget])

  useEffect(() => {
    if (!sent) return
    const frame = requestAnimationFrame(() => confirmRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [sent])

  function clearError(...keys: FieldKey[]) {
    setErrors((prev) => {
      if (!keys.some((key) => prev[key])) return prev
      const next = { ...prev }
      for (const key of keys) delete next[key]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Errors = {}
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedPhone = phone.trim()

    if (!trimmedName) next.name = "Write your name. A first name is enough."

    if (!trimmedEmail) {
      next.email = "Write your email address, so that I can reply."
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      next.email =
        "Check the email address. It needs an @ and a domain, like name@example.com."
    }

    if (!trimmedPhone) {
      if (reply === "phone") next.phone = PHONE_MISSING
    } else if (!/^\+?\d{10,15}$/.test(trimmedPhone.replace(/\s/g, ""))) {
      next.phone =
        "Check the phone number. It needs 10 to 15 digits. You can also leave it empty."
    }

    if (!reply) next.reply = "Choose email or phone."
    if (!place) next.place = "Choose one of the three. Either is fine."
    if (!Object.values(times).some(Boolean)) {
      next.times = "Tick at least one time. You can tick them all."
    }
    if (!consent) {
      next.consent = "Tick the box, so that I may keep your details and reply."
    }

    setErrors(next)
    const first = ORDER.find((key) => next[key])
    if (first) {
      setFocusTarget({ key: first })
      return
    }
    setSent({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      reply,
    })
  }

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
        <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
          <NavList />
        </nav>
      </header>

      <main>
        <section
          aria-labelledby="page-heading"
          className="mt-12 grid grid-cols-1 md:mt-28 md:grid-cols-12 md:gap-x-7"
        >
          <p className={cn(caption, "md:col-span-12")}>
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
            <div
              role="note"
              aria-labelledby="emergency-heading"
              className={card}
            >
              <h2 id="emergency-heading" className="text-h2">
                This is not an emergency service
              </h2>
              <p className="mt-4 max-w-xl text-body">
                I read requests on working days, and it can take me two days
                to reply. If you are in immediate danger, or you think you
                might harm yourself or someone else, please do not wait for
                me. Call your local emergency number or go to the nearest
                emergency department.
              </p>
            </div>

            <div className={cn(card, "mt-7")}>
              {!sent && (
                <form
                  noValidate
                  aria-labelledby="request-heading"
                  onSubmit={handleSubmit}
                >
                  <h2 id="request-heading" className="text-h2">
                    Your request
                  </h2>
                  <p className="mt-4 text-body">
                    Your name, an email address and the choices below are
                    needed. The rest is up to you.
                  </p>

                  <div className="mt-7">
                    <label htmlFor="name" className={fieldLabel}>
                      Your name
                    </label>
                    <p id="name-help" className={cn(caption, "mt-2")}>
                      A first name is enough.
                    </p>
                    <Input
                      ref={nameRef}
                      id="name"
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        clearError("name")
                      }}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={describedBy(
                        "name-help",
                        errors.name && "name-error"
                      )}
                      className={inputClass}
                    />
                    {errors.name && (
                      <ErrorLine id="name-error">{errors.name}</ErrorLine>
                    )}
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
                      onChange={(e) => {
                        setEmail(e.target.value)
                        clearError("email")
                      }}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={describedBy(
                        errors.email && "email-error"
                      )}
                      className={inputClass}
                    />
                    {errors.email && (
                      <ErrorLine id="email-error">{errors.email}</ErrorLine>
                    )}
                  </div>

                  <div className="mt-7">
                    <label htmlFor="phone" className={fieldLabel}>
                      Phone number (optional)
                    </label>
                    <p id="phone-help" className={cn(caption, "mt-2")}>
                      Only needed if you would like me to call.
                    </p>
                    <Input
                      ref={phoneRef}
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value)
                        clearError("phone")
                      }}
                      aria-invalid={errors.phone ? true : undefined}
                      aria-describedby={describedBy(
                        "phone-help",
                        errors.phone && "phone-error"
                      )}
                      className={inputClass}
                    />
                    {errors.phone && (
                      <ErrorLine id="phone-error">{errors.phone}</ErrorLine>
                    )}
                  </div>

                  <div className="mt-7">
                    <fieldset
                      className="min-w-0"
                      aria-describedby={describedBy(
                        "reply-help",
                        errors.reply && "reply-error"
                      )}
                    >
                      <legend id="reply-legend" className={fieldLabel}>
                        How should I reply?
                      </legend>
                      <p id="reply-help" className={cn(caption, "mt-2")}>
                        If I call and you cannot answer, I leave no message.
                      </p>
                      <RadioGroup
                        name="reply"
                        value={reply}
                        onValueChange={(value) => {
                          const next = String(value) as Reply
                          setReply(next)
                          clearError("reply")
                          if (next === "email" && errors.phone === PHONE_MISSING) {
                            clearError("phone")
                          }
                        }}
                        aria-labelledby="reply-legend"
                        className="mt-2 gap-0"
                      >
                        <div className="flex min-h-11 items-center gap-4">
                          <RadioGroupItem
                            ref={replyRef}
                            value="email"
                            id="reply-email"
                            className="size-5"
                          />
                          <label
                            htmlFor="reply-email"
                            className="text-body text-foreground"
                          >
                            By email
                          </label>
                        </div>
                        <div className="flex min-h-11 items-center gap-4">
                          <RadioGroupItem
                            value="phone"
                            id="reply-phone"
                            className="size-5"
                          />
                          <label
                            htmlFor="reply-phone"
                            className="text-body text-foreground"
                          >
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
                      aria-describedby={describedBy(
                        errors.place && "place-error"
                      )}
                    >
                      <legend id="place-legend" className={fieldLabel}>
                        In person or online?
                      </legend>
                      <RadioGroup
                        name="place"
                        value={place}
                        onValueChange={(value) => {
                          setPlace(String(value) as Place)
                          clearError("place")
                        }}
                        aria-labelledby="place-legend"
                        className="mt-2 gap-0"
                      >
                        {[
                          { value: "in-person", label: "In person, in Larkmere" },
                          { value: "online", label: "Online, by video" },
                          { value: "either", label: "Either is fine" },
                        ].map((option, index) => (
                          <div
                            key={option.value}
                            className="flex min-h-11 items-center gap-4"
                          >
                            <RadioGroupItem
                              ref={index === 0 ? placeRef : undefined}
                              value={option.value}
                              id={`place-${option.value}`}
                              className="size-5"
                            />
                            <label
                              htmlFor={`place-${option.value}`}
                              className="text-body text-foreground"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                      {errors.place && (
                        <ErrorLine id="place-error">{errors.place}</ErrorLine>
                      )}
                    </fieldset>
                  </div>

                  <div className="mt-7">
                    <fieldset
                      className="min-w-0"
                      aria-describedby={describedBy(
                        "times-help",
                        errors.times && "times-error"
                      )}
                    >
                      <legend className={fieldLabel}>
                        Which times could suit you?
                      </legend>
                      <p id="times-help" className={cn(caption, "mt-2")}>
                        Tick all that could work.
                      </p>
                      {timeOptions.map((option, index) => (
                        <div
                          key={option.key}
                          className={cn(
                            "flex min-h-11 items-center gap-4",
                            index === 0 && "mt-2"
                          )}
                        >
                          <Checkbox
                            ref={index === 0 ? timesRef : undefined}
                            id={`time-${option.key}`}
                            aria-labelledby={`time-${option.key}-label`}
                            checked={times[option.key]}
                            onCheckedChange={(checked) => {
                              setTimes((prev) => ({
                                ...prev,
                                [option.key]: checked === true,
                              }))
                              clearError("times")
                            }}
                            className="size-5"
                          />
                          <label
                            id={`time-${option.key}-label`}
                            htmlFor={`time-${option.key}`}
                            className="text-body text-foreground"
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
                    <p id="message-help" className={cn(caption, "mt-2")}>
                      A sentence is enough. You can also leave this empty and
                      tell me when we speak.
                    </p>
                    <Textarea
                      id="message"
                      name="message"
                      maxLength={1000}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      aria-describedby="message-help"
                      className={cn(inputClass, "min-h-32 resize-none")}
                    />
                  </div>

                  <div className="mt-7">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        ref={consentRef}
                        id="consent"
                        aria-labelledby="consent-label"
                        aria-invalid={errors.consent ? true : undefined}
                        aria-describedby={describedBy(
                          errors.consent && "consent-error"
                        )}
                        checked={consent}
                        onCheckedChange={(checked) => {
                          setConsent(checked === true)
                          clearError("consent")
                        }}
                        className="mt-1 size-5"
                      />
                      <label
                        id="consent-label"
                        htmlFor="consent"
                        className="text-body text-foreground"
                      >
                        I agree that Nora Ellingham may keep these details to
                        reply to my request.
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
                  <p className={cn(caption, "mt-4")}>
                    Nothing is booked or charged when you send this.
                  </p>
                </form>
              )}

              <div role="status">
                {sent && (
                  <div>
                    <h2
                      ref={confirmRef}
                      tabIndex={-1}
                      className={cn("text-h2", focusRingCode)}
                    >
                      Thank you, {sent.name}. Your request is with me.
                    </h2>
                    <p className="mt-4 text-body">
                      {sent.reply === "phone"
                        ? `I will call ${sent.phone} within two working days. If I do not reach you, I will write to ${sent.email}.`
                        : `I will write to ${sent.email} within two working days.`}
                    </p>
                    <p className="mt-4 text-body">
                      I will offer you one or two times for a call of 20
                      minutes. It is free, and nothing is booked until we have
                      spoken.
                    </p>
                    <p className="mt-4 text-body">
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
          </div>

          <div className="mt-12 md:col-span-4 md:col-start-9 md:mt-0">
            <h2 className="text-h2">What happens next</h2>
            <ol className="mt-4 list-none border-b border-border">
              {[
                {
                  label: "Within 2 working days",
                  text: "I reply, by email or by phone, as you chose.",
                },
                {
                  label: "20 minutes · Free",
                  text: "We speak, by phone or video. You can ask me anything.",
                },
                {
                  label: "50 minutes · £68",
                  text: "If we both wish, we arrange a first session.",
                },
              ].map((step) => (
                <li key={step.label} className="border-t border-border py-4">
                  <p className={caption}>{step.label}</p>
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
              If we do not go on to work together, I delete your details
              within 30 days.
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-28 border-t border-border py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-7">
          <div className="md:col-span-7">
            <p className="font-heading text-h2">Nora Ellingham</p>
            <p className={cn(caption, "mt-2")}>
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
          <nav
            aria-label="Footer"
            className="mt-7 md:col-span-4 md:col-start-9 md:mt-0"
          >
            <NavList vertical />
          </nav>
        </div>
        <p className="mt-7 max-w-xl text-body text-foreground">
          This practice is not an emergency service. In an emergency, call your
          local emergency number or go to the nearest emergency department.
        </p>
        <p className={cn(caption, "mt-4")}>© 2027 Nora Ellingham</p>
      </footer>
    </div>
  )
}

export default App
