import * as React from "react"
import { Calendar as CalendarIcon, Check, CircleAlert } from "lucide-react"

import { buttonVariants, Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

// The sample's "now": Tuesday 8 June 2027, 20:05. Never the device clock.
const TODAY = new Date(2027, 5, 8)
const EARLIEST = new Date(1927, 0, 1)
// Born on or before this day: 18 or over on 8 June 2027.
const ADULT_CUTOFF = new Date(2009, 5, 8)
const MEMBER_NUMBER = "WFC-27-0141"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const FOCUS_BAND =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-foreground"
const FOCUS_CODE =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const ICON = {
  className: "size-4 shrink-0",
  strokeWidth: 2,
  strokeLinecap: "square" as const,
  "aria-hidden": true as const,
}
const BUTTON = "h-auto px-5 py-2 font-mono text-label uppercase"
const FIELD_LABEL = "block font-mono text-label uppercase text-foreground"
const SMALL_PRINT = "text-label text-muted-foreground"
const LABEL = "font-mono text-label uppercase text-muted-foreground"

const NAV = [
  { label: "Fixtures", href: "/fixtures" },
  { label: "Table", href: "/standings" },
  { label: "Report", href: "/report" },
  { label: "Membership", href: "/membership" },
]

type Kind = "playing" | "junior" | "social"

const MEMBERSHIPS: {
  value: Kind
  name: string
  price: string
  forWhom: string
  includes: string[]
  lastRow: { label: string; value: string }
}[] = [
  {
    value: "playing",
    name: "Playing",
    price: "£95",
    forWhom: "For adults aged 18 or over who want to play.",
    includes: [
      "Training on Mondays and Thursdays at 19:00",
      "A place in the first team or reserves squad",
      "Match kit and insurance for the season",
    ],
    lastRow: { label: "First session", value: "Thursday 10 June, 19:00" },
  },
  {
    value: "junior",
    name: "Junior",
    price: "£45",
    forWhom: "For players under 18.",
    includes: [
      "Coaching on Thursdays at 17:30",
      "Matches with the under 18s on Sundays",
      "Match kit and insurance for the season",
    ],
    lastRow: { label: "First session", value: "Thursday 10 June, 17:30" },
  },
  {
    value: "social",
    name: "Social",
    price: "£30",
    forWhom: "For supporters, parents and former players.",
    includes: [
      "Free entry to home league matches",
      "A vote at the annual meeting",
      "The club newsletter each month",
    ],
    lastRow: { label: "Next home match", value: "Saturday 19 June, 15:00" },
  },
]

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function formatDate(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

function isoDate(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${m}-${d}`
}

type FieldKey = "name" | "email" | "dob" | "contact" | "phone" | "consent"
const ORDER: FieldKey[] = [
  "name",
  "email",
  "dob",
  "contact",
  "phone",
  "consent",
]
type Errors = Partial<Record<FieldKey, string>>

type Confirmed = { firstName: string; email: string; kind: Kind }

function ErrorLine({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="flex items-start gap-2 text-label text-destructive">
      <CircleAlert {...ICON} />
      <span>{message}</span>
    </p>
  )
}

function describedBy(...ids: (string | false | undefined)[]) {
  const list = ids.filter(Boolean).join(" ")
  return list || undefined
}

export function App() {
  const [kind, setKind] = React.useState<Kind>("playing")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [dob, setDob] = React.useState<Date | undefined>(undefined)
  const [contact, setContact] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [consent, setConsent] = React.useState(false)
  const [dobOpen, setDobOpen] = React.useState(false)
  const [errors, setErrors] = React.useState<Errors>({})
  const [focusTick, setFocusTick] = React.useState(0)
  const [confirmed, setConfirmed] = React.useState<Confirmed | null>(null)

  const nameRef = React.useRef<HTMLInputElement>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)
  const dobRef = React.useRef<HTMLButtonElement>(null)
  const contactRef = React.useRef<HTMLInputElement>(null)
  const phoneRef = React.useRef<HTMLInputElement>(null)
  const consentRef = React.useRef<HTMLButtonElement>(null)
  const calendarRef = React.useRef<HTMLDivElement>(null)
  const headingRef = React.useRef<HTMLHeadingElement>(null)

  // Move focus once the error lines are on the page.
  React.useEffect(() => {
    if (focusTick === 0) return
    const refs: Record<FieldKey, React.RefObject<HTMLElement | null>> = {
      name: nameRef,
      email: emailRef,
      dob: dobRef,
      contact: contactRef,
      phone: phoneRef,
      consent: consentRef,
    }
    const first = ORDER.find((key) => errors[key])
    if (first) refs[first].current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusTick])

  React.useEffect(() => {
    if (confirmed) headingRef.current?.focus()
  }, [confirmed])

  function clearError(key: FieldKey) {
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function validate(): Errors {
    const next: Errors = {}
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedContact = contact.trim()
    const digits = phone.trim().replace(/\s/g, "")

    if (!trimmedName) next.name = "Enter your full name."

    if (!trimmedEmail) next.email = "Enter your email address."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail))
      next.email = "Enter an email address such as name@example.com."

    if (!dob) next.dob = "Enter your date of birth."
    else if (dob > TODAY || dob < EARLIEST)
      next.dob = "Enter a date of birth from 1927 to today."
    else if (kind === "playing" && dob > ADULT_CUTOFF)
      next.dob =
        "Playing membership is for adults. Choose Junior membership, or check the date."
    else if (kind === "junior" && dob <= ADULT_CUTOFF)
      next.dob =
        "Junior membership is for under 18s. Choose Playing or Social membership, or check the date."

    if (!trimmedContact) next.contact = "Enter the name of someone we can call."

    if (!/^\+?\d{10,15}$/.test(digits))
      next.phone = "Enter a phone number of 10 to 15 digits."

    if (!consent) next.consent = "Tick the box to agree to the code of conduct."

    return next
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = validate()
    if (Object.keys(next).length > 0) {
      setErrors(next)
      setFocusTick((tick) => tick + 1)
      return
    }
    setErrors({})
    setConfirmed({
      firstName: name.trim().split(/\s+/)[0],
      email: email.trim(),
      kind,
    })
  }

  const chosen = confirmed
    ? MEMBERSHIPS.find((m) => m.value === confirmed.kind)!
    : null

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <header className="border-b border-border bg-navy text-navy-foreground">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-x-8 gap-y-1 px-5 py-3">
          <a
            href="/"
            className={cn("group inline-flex items-center gap-3", FOCUS_BAND)}
          >
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ice font-heading text-body font-extrabold text-ice-foreground"
            >
              W
            </span>
            <span className="font-heading text-h2 uppercase underline-offset-4 group-hover:underline">
              Wendmoor FC
            </span>
          </a>
          <nav aria-label="Main">
            <ul className="flex flex-wrap gap-x-5">
              {NAV.map((link) => {
                const current = link.href === "/membership"
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "inline-flex h-10 items-center font-mono text-label uppercase underline-offset-4 hover:underline",
                        current && "underline decoration-2",
                        FOCUS_BAND
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
      </header>

      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-18 px-5 pt-8 pb-18">
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="flex flex-col gap-3">
                <p className={LABEL}>2027 Season · 140 members</p>
                <h1 className="text-h1 uppercase">Join the club</h1>
                <p className="max-w-2xl text-body">
                  Choose a membership, tell us who you are, and come to your
                  first session. It takes two minutes.
                </p>
              </div>
            </div>

            <div>
              {!confirmed && (
                <form
                  noValidate
                  aria-label="Join the club"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-8"
                >
                  <RadioGroup
                    name="membership"
                    value={kind}
                    onValueChange={(value) => {
                      setKind(value as Kind)
                      clearError("dob")
                    }}
                    aria-labelledby="membership-heading"
                    className="flex flex-col gap-5"
                  >
                    <h2 id="membership-heading" className="text-h2 uppercase">
                      Choose a membership
                    </h2>
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                      {MEMBERSHIPS.map((m) => (
                        <label
                          key={m.value}
                          className="flex min-w-0 cursor-pointer flex-col gap-3 rounded-xl border border-border bg-card p-5 has-data-checked:border-foreground lg:col-span-4"
                        >
                          <span className="flex items-center gap-3">
                            <RadioGroupItem
                              value={m.value}
                              aria-labelledby={`membership-${m.value}-name`}
                              aria-describedby={`membership-${m.value}-details`}
                            />
                            <span
                              id={`membership-${m.value}-name`}
                              className="font-heading text-h2 uppercase"
                            >
                              {m.name}
                            </span>
                          </span>
                          <span
                            id={`membership-${m.value}-details`}
                            className="flex flex-col gap-3"
                          >
                            <span className="flex flex-col gap-1">
                              <span className="font-heading text-h1 tabular-nums">
                                {m.price}
                              </span>
                              <span className={LABEL}>A season</span>
                            </span>
                            <span className="block text-body">{m.forWhom}</span>
                            <span className="flex flex-col gap-2">
                              {m.includes.map((line) => (
                                <span
                                  key={line}
                                  className="flex items-start gap-2 text-body"
                                >
                                  <Check
                                    {...ICON}
                                    className="mt-1 size-4 shrink-0"
                                  />
                                  <span>{line}</span>
                                </span>
                              ))}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                    <section
                      aria-labelledby="details-heading"
                      className="flex min-w-0 flex-col gap-5 rounded-xl border border-border bg-card p-5 lg:col-span-8"
                    >
                      <h2 id="details-heading" className="text-h2 uppercase">
                        Your details
                      </h2>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label htmlFor="name" className={FIELD_LABEL}>
                            Full name
                          </label>
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
                              errors.name && "name-error"
                            )}
                            className="h-10 px-3 text-body md:text-body"
                          />
                          {errors.name && (
                            <ErrorLine id="name-error" message={errors.name} />
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <label htmlFor="email" className={FIELD_LABEL}>
                            Email
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
                            className="h-10 px-3 text-body md:text-body"
                          />
                          {errors.email && (
                            <ErrorLine
                              id="email-error"
                              message={errors.email}
                            />
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <label
                            id="dob-label"
                            htmlFor="dob"
                            className={FIELD_LABEL}
                          >
                            Date of birth
                          </label>
                          <Popover open={dobOpen} onOpenChange={setDobOpen}>
                            <PopoverTrigger
                              ref={dobRef}
                              id="dob"
                              type="button"
                              aria-labelledby="dob-label dob-value"
                              aria-invalid={errors.dob ? true : undefined}
                              aria-describedby={describedBy(
                                "dob-help",
                                errors.dob && "dob-error"
                              )}
                              className={cn(
                                "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-muted-foreground bg-card px-3 text-left text-body text-foreground transition-colors outline-none focus-visible:border-ring aria-invalid:border-destructive",
                                FOCUS
                              )}
                            >
                              <span id="dob-value">
                                {dob ? (
                                  <time dateTime={isoDate(dob)}>
                                    {formatDate(dob)}
                                  </time>
                                ) : (
                                  <span className="text-muted-foreground">
                                    Choose a date
                                  </span>
                                )}
                              </span>
                              <CalendarIcon
                                {...ICON}
                                className="size-4 shrink-0 text-muted-foreground"
                              />
                            </PopoverTrigger>
                            <PopoverContent
                              align="start"
                              className="w-auto"
                              initialFocus={() =>
                                calendarRef.current?.querySelector<HTMLElement>(
                                  'button[tabindex="0"]'
                                ) ?? true
                              }
                            >
                              <div ref={calendarRef}>
                                <Calendar
                                  mode="single"
                                  required
                                  captionLayout="dropdown"
                                  weekStartsOn={1}
                                  today={TODAY}
                                  startMonth={new Date(1927, 0)}
                                  endMonth={new Date(2027, 5)}
                                  selected={dob}
                                  defaultMonth={dob ?? TODAY}
                                  onSelect={(date) => {
                                    setDob(date)
                                    clearError("dob")
                                    setDobOpen(false)
                                  }}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                          <p id="dob-help" className={SMALL_PRINT}>
                            Playing members are 18 or over. Juniors are under
                            18.
                          </p>
                          {errors.dob && (
                            <ErrorLine id="dob-error" message={errors.dob} />
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <label htmlFor="contact" className={FIELD_LABEL}>
                            Emergency contact
                          </label>
                          <Input
                            ref={contactRef}
                            id="contact"
                            name="contact"
                            autoComplete="off"
                            value={contact}
                            onChange={(e) => {
                              setContact(e.target.value)
                              clearError("contact")
                            }}
                            aria-invalid={errors.contact ? true : undefined}
                            aria-describedby={describedBy(
                              "contact-help",
                              errors.contact && "contact-error"
                            )}
                            className="h-10 px-3 text-body md:text-body"
                          />
                          <p id="contact-help" className={SMALL_PRINT}>
                            Someone we can call on a match day. For a junior, a
                            parent or guardian.
                          </p>
                          {errors.contact && (
                            <ErrorLine
                              id="contact-error"
                              message={errors.contact}
                            />
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <label htmlFor="phone" className={FIELD_LABEL}>
                            Emergency contact&apos;s phone
                          </label>
                          <Input
                            ref={phoneRef}
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="off"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value)
                              clearError("phone")
                            }}
                            aria-invalid={errors.phone ? true : undefined}
                            aria-describedby={describedBy(
                              errors.phone && "phone-error"
                            )}
                            className="h-10 px-3 text-body md:text-body"
                          />
                          {errors.phone && (
                            <ErrorLine
                              id="phone-error"
                              message={errors.phone}
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="flex items-start gap-3 text-body text-foreground">
                          <Checkbox
                            ref={consentRef}
                            name="consent"
                            checked={consent}
                            onCheckedChange={(checked) => {
                              setConsent(checked)
                              clearError("consent")
                            }}
                            aria-invalid={errors.consent ? true : undefined}
                            aria-describedby={describedBy(
                              errors.consent && "consent-error"
                            )}
                            className="mt-0.5"
                          />
                          <span>
                            I agree to the club&apos;s code of conduct, and to
                            the club keeping these details for the 2027 season.
                          </span>
                        </label>
                        {errors.consent && (
                          <ErrorLine
                            id="consent-error"
                            message={errors.consent}
                          />
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
                        <Button type="submit" className={BUTTON}>
                          Join the club
                        </Button>
                        <p className={SMALL_PRINT}>
                          You pay at your first session. Nothing is charged
                          here.
                        </p>
                      </div>
                    </section>

                    <aside
                      aria-labelledby="next-heading"
                      className="flex min-w-0 flex-col gap-5 rounded-xl bg-ice p-5 text-ice-foreground lg:col-span-4 lg:self-start"
                    >
                      <h2 id="next-heading" className="text-h2 uppercase">
                        What happens next
                      </h2>
                      <ol role="list" className="flex flex-col gap-3">
                        {[
                          "We email your membership number and a welcome from the club.",
                          "You come to your first session at Millrace Park and pay the season's fee there.",
                          "Players are registered with the league within a week, and can then be picked.",
                        ].map((step, index) => (
                          <li key={step} className="flex items-baseline gap-3">
                            <span className="w-5 shrink-0 font-heading text-h2 tabular-nums">
                              {index + 1}
                            </span>
                            <span className="text-body">{step}</span>
                          </li>
                        ))}
                      </ol>
                      <p className="text-body">
                        Questions? Call the club secretary, Marian Osei, on
                        01632 960 277.
                      </p>
                    </aside>
                  </div>
                </form>
              )}

              <div role="status">
                {confirmed && chosen && (
                  <section
                    aria-labelledby="welcome-heading"
                    className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5"
                  >
                    <h2
                      id="welcome-heading"
                      ref={headingRef}
                      tabIndex={-1}
                      className={cn("text-h2 uppercase", FOCUS_CODE)}
                    >
                      Welcome to Wendmoor FC
                    </h2>
                    <p className="max-w-2xl text-body wrap-break-word">
                      Thank you, {confirmed.firstName}. Your {chosen.name}{" "}
                      membership for the 2027 season is ready.
                    </p>
                    <dl className="w-full max-w-md">
                      {[
                        { label: "Membership number", value: MEMBER_NUMBER },
                        { label: "Membership", value: chosen.name },
                        { label: "Fee for the season", value: chosen.price },
                        chosen.lastRow,
                      ].map((row, index) => (
                        <div
                          key={row.label}
                          className={cn(
                            "flex items-baseline justify-between gap-3 py-2",
                            index > 0 && "border-t border-border"
                          )}
                        >
                          <dt className={LABEL}>{row.label}</dt>
                          <dd className="text-right text-body">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="max-w-2xl text-body wrap-break-word">
                      We have sent the details to {confirmed.email}. This is a
                      demo: nothing was sent or stored.
                    </p>
                    <a
                      href="/fixtures"
                      className={cn(
                        buttonVariants({ variant: "secondary" }),
                        BUTTON,
                        "self-start"
                      )}
                    >
                      See the fixtures
                    </a>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-3 px-5 py-8">
          <p className="font-heading text-h2 uppercase">Wendmoor FC</p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {NAV.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn(
                      "font-mono text-label text-foreground uppercase underline underline-offset-4 hover:decoration-2",
                      FOCUS
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className={LABEL}>
            © 2027 Wendmoor Football Club · Millrace Park, Wendmoor · A demo:
            nothing is sent or stored
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
