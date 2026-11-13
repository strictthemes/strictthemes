import * as React from "react"
import { Calendar as CalendarIcon, Check, CircleAlert } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
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
const EARLIEST_BIRTH = new Date(1927, 0, 1)
// A person born on or before this day is 18 or over on TODAY.
const ADULT_CUTOFF = new Date(2009, 5, 8)
const START_MONTH = new Date(1927, 0)
const END_MONTH = new Date(2027, 5)

const MEMBER_NUMBER = "WFC-27-0141"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const FOCUS_BAND =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-foreground"
const FOCUS_CODE =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const BUTTON = "h-auto px-5 py-2 font-mono text-label uppercase"
const LABEL = "font-mono text-label uppercase"
const TEXT_LINK =
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2"

const NAV = [
  { label: "Fixtures", href: "/fixtures" },
  { label: "Table", href: "/standings" },
  { label: "Report", href: "/report" },
  { label: "Membership", href: "/membership" },
]

type MembershipId = "playing" | "junior" | "social"

type Membership = {
  id: MembershipId
  name: string
  price: string
  forWhom: string
  includes: string[]
  nextLabel: string
  nextValue: string
}

const MEMBERSHIPS: Membership[] = [
  {
    id: "playing",
    name: "Playing",
    price: "£95",
    forWhom: "For adults aged 18 or over who want to play.",
    includes: [
      "Training on Mondays and Thursdays at 19:00",
      "A place in the first team or reserves squad",
      "Match kit and insurance for the season",
    ],
    nextLabel: "First session",
    nextValue: "Thursday 10 June, 19:00",
  },
  {
    id: "junior",
    name: "Junior",
    price: "£45",
    forWhom: "For players under 18.",
    includes: [
      "Coaching on Thursdays at 17:30",
      "Matches with the under 18s on Sundays",
      "Match kit and insurance for the season",
    ],
    nextLabel: "First session",
    nextValue: "Thursday 10 June, 17:30",
  },
  {
    id: "social",
    name: "Social",
    price: "£30",
    forWhom: "For supporters, parents and former players.",
    includes: [
      "Free entry to home league matches",
      "A vote at the annual meeting",
      "The club newsletter each month",
    ],
    nextLabel: "Next home match",
    nextValue: "Saturday 19 June, 15:00",
  },
]

type FieldId = "name" | "email" | "dob" | "contact" | "phone" | "consent"

const FIELD_ORDER: FieldId[] = [
  "name",
  "email",
  "dob",
  "contact",
  "phone",
  "consent",
]

type Errors = Partial<Record<FieldId, string>>

type Confirmed = {
  firstName: string
  email: string
  membership: Membership
}

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

function Crest({ letters, className }: { letters: string; className: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-ice text-ice-foreground",
        className
      )}
    >
      {letters}
    </span>
  )
}

function ErrorLine({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="flex items-start gap-2 text-label text-destructive">
      <CircleAlert
        className="size-4 shrink-0"
        strokeWidth={2}
        strokeLinecap="square"
        aria-hidden="true"
      />
      <span>{message}</span>
    </p>
  )
}

function describedBy(...ids: (string | false | undefined)[]) {
  const list = ids.filter(Boolean)
  return list.length ? list.join(" ") : undefined
}

function Header() {
  return (
    <header className="border-b border-border bg-navy text-navy-foreground">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-x-8 gap-y-1 px-5 py-3">
        <a
          href="/"
          className={cn(
            "inline-flex items-center gap-3 underline-offset-4 transition-colors duration-150 hover:underline",
            FOCUS_BAND
          )}
        >
          <Crest
            letters="W"
            className="size-10 font-heading text-body font-extrabold"
          />
          <span className="font-heading text-h2 uppercase">Wendmoor FC</span>
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-5">
            {NAV.map((item) => {
              const current = item.href === "/membership"
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center font-mono text-label uppercase underline-offset-4 transition-colors duration-150 hover:underline",
                      current && "underline decoration-2",
                      FOCUS_BAND
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-3 px-5 py-8">
        <p className="font-heading text-h2 uppercase">Wendmoor FC</p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(LABEL, TEXT_LINK, FOCUS)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={cn(LABEL, "text-muted-foreground")}>
          © 2027 Wendmoor Football Club · Millrace Park, Wendmoor · A demo:
          nothing is sent or stored
        </p>
      </div>
    </footer>
  )
}

function RadioCard({ membership }: { membership: Membership }) {
  const nameId = `membership-${membership.id}-name`
  const detailsId = `membership-${membership.id}-details`
  return (
    <label className="flex min-w-0 cursor-pointer flex-col gap-3 rounded-xl border border-border bg-card p-5 has-data-checked:border-foreground lg:col-span-4">
      <span className="flex items-center gap-3">
        <RadioGroupItem
          value={membership.id}
          aria-labelledby={nameId}
          aria-describedby={detailsId}
        />
        <span id={nameId} className="font-heading text-h2 uppercase">
          {membership.name}
        </span>
      </span>
      <span id={detailsId} className="flex flex-col gap-3">
        <span className="flex flex-col gap-1">
          <span className="font-heading text-h1 tabular-nums">
            {membership.price}
          </span>
          <span className={cn(LABEL, "text-muted-foreground")}>A season</span>
        </span>
        <span className="block text-body">{membership.forWhom}</span>
        <span className="flex flex-col gap-2">
          {membership.includes.map((line) => (
            <span key={line} className="flex items-start gap-2 text-body">
              <Check
                className="mt-1 size-4 shrink-0"
                strokeWidth={2}
                strokeLinecap="square"
                aria-hidden="true"
              />
              <span>{line}</span>
            </span>
          ))}
        </span>
      </span>
    </label>
  )
}

type TextFieldProps = {
  id: Exclude<FieldId, "dob" | "consent">
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  helper?: string
  inputRef: React.Ref<HTMLInputElement>
  className?: string
} & Pick<React.ComponentProps<"input">, "type" | "autoComplete">

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  helper,
  inputRef,
  className,
  type = "text",
  autoComplete,
}: TextFieldProps) {
  const helperId = `${id}-helper`
  const errorId = `${id}-error`
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <label htmlFor={id} className={cn("block", LABEL, "text-foreground")}>
        {label}
      </label>
      <Input
        ref={inputRef}
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(helper && helperId, error && errorId)}
        className="h-10 px-3 text-body md:text-body"
      />
      {helper && (
        <p id={helperId} className="text-label text-muted-foreground">
          {helper}
        </p>
      )}
      {error && <ErrorLine id={errorId} message={error} />}
    </div>
  )
}

function Confirmation({
  confirmed,
  headingRef,
}: {
  confirmed: Confirmed
  headingRef: React.Ref<HTMLHeadingElement>
}) {
  const { membership } = confirmed
  const rows = [
    { term: "Membership number", value: MEMBER_NUMBER },
    { term: "Membership", value: membership.name },
    { term: "Fee for the season", value: membership.price },
    { term: membership.nextLabel, value: membership.nextValue },
  ]
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className={cn("text-h2 uppercase", FOCUS_CODE)}
      >
        Welcome to Wendmoor FC
      </h2>
      <p className="max-w-2xl text-body">
        Thank you, {confirmed.firstName}. Your {membership.name} membership for
        the 2027 season is ready.
      </p>
      <dl className="w-full max-w-md">
        {rows.map((row, index) => (
          <div
            key={row.term}
            className={cn(
              "flex items-baseline justify-between gap-3 py-2",
              index > 0 && "border-t border-border"
            )}
          >
            <dt className={cn(LABEL, "text-muted-foreground")}>{row.term}</dt>
            <dd className="text-right text-body">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="max-w-2xl text-body">
        We have sent the details to {confirmed.email}. This is a demo: nothing
        was sent or stored.
      </p>
      <a
        href="/fixtures"
        className={cn(buttonVariants({ variant: "secondary" }), BUTTON, "self-start")}
      >
        See the fixtures
      </a>
    </div>
  )
}

export function App() {
  const [membership, setMembership] = React.useState<MembershipId>("playing")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [dob, setDob] = React.useState<Date | undefined>(undefined)
  const [dobOpen, setDobOpen] = React.useState(false)
  const [contact, setContact] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [consent, setConsent] = React.useState(false)
  const [errors, setErrors] = React.useState<Errors>({})
  const [confirmed, setConfirmed] = React.useState<Confirmed | null>(null)

  const nameRef = React.useRef<HTMLInputElement>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)
  const dobRef = React.useRef<HTMLButtonElement>(null)
  const contactRef = React.useRef<HTMLInputElement>(null)
  const phoneRef = React.useRef<HTMLInputElement>(null)
  const consentRef = React.useRef<HTMLElement>(null)
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const calendarRef = React.useRef<HTMLDivElement>(null)

  // Set on submit; the effect below moves focus once the error lines exist.
  const focusPending = React.useRef(false)

  React.useEffect(() => {
    if (!focusPending.current) return
    focusPending.current = false
    const first = FIELD_ORDER.find((field) => errors[field])
    if (!first) return
    const refs: Record<FieldId, React.RefObject<HTMLElement | null>> = {
      name: nameRef,
      email: emailRef,
      dob: dobRef,
      contact: contactRef,
      phone: phoneRef,
      consent: consentRef,
    }
    refs[first].current?.focus()
  }, [errors])

  React.useEffect(() => {
    if (confirmed) headingRef.current?.focus()
  }, [confirmed])

  function clearError(field: FieldId) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function validate(): Errors {
    const next: Errors = {}
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedContact = contact.trim()
    const trimmedPhone = phone.trim().replace(/\s/g, "")

    if (!trimmedName) next.name = "Enter your full name."

    if (!trimmedEmail) next.email = "Enter your email address."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail))
      next.email = "Enter an email address such as name@example.com."

    if (!dob) next.dob = "Enter your date of birth."
    else if (dob > TODAY || dob < EARLIEST_BIRTH)
      next.dob = "Enter a date of birth from 1927 to today."
    else if (membership === "playing" && dob > ADULT_CUTOFF)
      next.dob =
        "Playing membership is for adults. Choose Junior membership, or check the date."
    else if (membership === "junior" && dob <= ADULT_CUTOFF)
      next.dob =
        "Junior membership is for under 18s. Choose Playing or Social membership, or check the date."

    if (!trimmedContact)
      next.contact = "Enter the name of someone we can call."

    if (!/^\+?\d{10,15}$/.test(trimmedPhone))
      next.phone = "Enter a phone number of 10 to 15 digits."

    if (!consent) next.consent = "Tick the box to agree to the code of conduct."

    return next
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = validate()
    if (Object.keys(next).length > 0) {
      focusPending.current = true
      setErrors(next)
      return
    }
    const chosen = MEMBERSHIPS.find((item) => item.id === membership)!
    setErrors({})
    setConfirmed({
      firstName: name.trim().split(/\s+/)[0],
      email: email.trim(),
      membership: chosen,
    })
  }

  const dobLabelId = "dob-label"
  const dobValueId = "dob-value"
  const dobHelperId = "dob-helper"
  const dobErrorId = "dob-error"
  const consentErrorId = "consent-error"

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-18 px-5 pt-8 pb-18">
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="flex flex-col gap-3">
                <p className={cn(LABEL, "text-muted-foreground")}>
                  2027 season · 140 members
                </p>
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
                  className="flex flex-col gap-8"
                  onSubmit={handleSubmit}
                >
                  <RadioGroup
                    name="membership"
                    value={membership}
                    onValueChange={(value) => {
                      setMembership(value as MembershipId)
                      clearError("dob")
                    }}
                    aria-labelledby="membership-heading"
                    className="flex flex-col gap-5"
                  >
                    <h2 id="membership-heading" className="text-h2 uppercase">
                      Choose a membership
                    </h2>
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                      {MEMBERSHIPS.map((item) => (
                        <RadioCard key={item.id} membership={item} />
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
                        <TextField
                          id="name"
                          label="Full name"
                          autoComplete="name"
                          value={name}
                          onChange={(value) => {
                            setName(value)
                            clearError("name")
                          }}
                          error={errors.name}
                          inputRef={nameRef}
                          className="md:col-span-2"
                        />
                        <TextField
                          id="email"
                          label="Email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(value) => {
                            setEmail(value)
                            clearError("email")
                          }}
                          error={errors.email}
                          inputRef={emailRef}
                        />

                        <div className="flex min-w-0 flex-col gap-2">
                          <label
                            id={dobLabelId}
                            htmlFor="dob"
                            className={cn("block", LABEL, "text-foreground")}
                          >
                            Date of birth
                          </label>
                          <Popover open={dobOpen} onOpenChange={setDobOpen}>
                            <PopoverTrigger
                              id="dob"
                              ref={dobRef}
                              aria-labelledby={`${dobLabelId} ${dobValueId}`}
                              aria-invalid={errors.dob ? true : undefined}
                              aria-describedby={describedBy(
                                dobHelperId,
                                errors.dob && dobErrorId
                              )}
                              className={cn(
                                "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-muted-foreground bg-card px-3 text-left text-body text-foreground transition-colors outline-none focus-visible:border-ring aria-invalid:border-destructive",
                                FOCUS
                              )}
                            >
                              <span id={dobValueId}>
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
                                className="size-4 shrink-0 text-muted-foreground"
                                strokeWidth={2}
                                strokeLinecap="square"
                                aria-hidden="true"
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
                                  startMonth={START_MONTH}
                                  endMonth={END_MONTH}
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
                          <p
                            id={dobHelperId}
                            className="text-label text-muted-foreground"
                          >
                            Playing members are 18 or over. Juniors are under
                            18.
                          </p>
                          {errors.dob && (
                            <ErrorLine id={dobErrorId} message={errors.dob} />
                          )}
                        </div>

                        <TextField
                          id="contact"
                          label="Emergency contact"
                          autoComplete="off"
                          helper="Someone we can call on a match day. For a junior, a parent or guardian."
                          value={contact}
                          onChange={(value) => {
                            setContact(value)
                            clearError("contact")
                          }}
                          error={errors.contact}
                          inputRef={contactRef}
                        />
                        <TextField
                          id="phone"
                          label="Emergency contact's phone"
                          type="tel"
                          autoComplete="off"
                          value={phone}
                          onChange={(value) => {
                            setPhone(value)
                            clearError("phone")
                          }}
                          error={errors.phone}
                          inputRef={phoneRef}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="flex items-start gap-3 text-body text-foreground">
                          <Checkbox
                            ref={consentRef}
                            className="mt-0.5"
                            checked={consent}
                            onCheckedChange={(checked) => {
                              setConsent(checked)
                              clearError("consent")
                            }}
                            aria-invalid={errors.consent ? true : undefined}
                            aria-describedby={
                              errors.consent ? consentErrorId : undefined
                            }
                          />
                          <span>
                            I agree to the club's code of conduct, and to the
                            club keeping these details for the 2027 season.
                          </span>
                        </label>
                        {errors.consent && (
                          <ErrorLine
                            id={consentErrorId}
                            message={errors.consent}
                          />
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
                        <Button type="submit" className={BUTTON}>
                          Join the club
                        </Button>
                        <p className="text-label text-muted-foreground">
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
                {confirmed && (
                  <Confirmation confirmed={confirmed} headingRef={headingRef} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
