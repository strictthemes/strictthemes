import { useEffect, useRef, useState, type FormEvent } from "react"
import { Check, CircleAlert } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// The sample's "now": Tuesday 8 June 2027, 20:05. Never the device clock.
const TODAY = "2027-06-08"
const EARLIEST_BIRTH = "1927-01-01"
// Born on or before this date means 18 or over today.
const ADULT_BORN_BY = "2009-06-08"
const MEMBER_NUMBER = "WFC-27-0141"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const bandFocusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-foreground"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const buttonClasses = "h-auto px-5 py-2 font-mono text-label uppercase"
const label = "font-mono text-label uppercase"

type MembershipId = "playing" | "junior" | "social"

type Membership = {
  id: MembershipId
  name: string
  price: string
  forWhom: string
  includes: [string, string, string]
  lastRow: [string, string]
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
    lastRow: ["First session", "Thursday 10 June, 19:00"],
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
    lastRow: ["First session", "Thursday 10 June, 17:30"],
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
    lastRow: ["Next home match", "Saturday 19 June, 15:00"],
  },
]

const NAV = [
  { label: "Fixtures", href: "/fixtures" },
  { label: "Table", href: "/standings" },
  { label: "Report", href: "/report" },
  { label: "Membership", href: "/membership" },
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
type TextFieldId = Exclude<FieldId, "consent">
type Errors = Partial<Record<FieldId, string>>

type TextField = {
  id: TextFieldId
  label: string
  type?: string
  autoComplete: string
  helper?: string
  both?: boolean
}

const FIELDS: TextField[] = [
  { id: "name", label: "Full name", autoComplete: "name", both: true },
  { id: "email", label: "Email", type: "email", autoComplete: "email" },
  {
    id: "dob",
    label: "Date of birth",
    type: "date",
    autoComplete: "bday",
    helper: "Playing members are 18 or over. Juniors are under 18.",
  },
  {
    id: "contact",
    label: "Emergency contact",
    autoComplete: "off",
    helper:
      "Someone we can call on a match day. For a junior, a parent or guardian.",
  },
  {
    id: "phone",
    label: "Emergency contact's phone",
    type: "tel",
    autoComplete: "off",
  },
]

type Values = Record<TextFieldId, string>
const EMPTY: Values = { name: "", email: "", dob: "", contact: "", phone: "" }

function validate(
  values: Values,
  consent: boolean,
  membership: MembershipId
): Errors {
  const v = {
    name: values.name.trim(),
    email: values.email.trim(),
    dob: values.dob.trim(),
    contact: values.contact.trim(),
    phone: values.phone.trim(),
  }
  const errors: Errors = {}

  if (!v.name) errors.name = "Enter your full name."

  if (!v.email) errors.email = "Enter your email address."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
    errors.email = "Enter an email address such as name@example.com."

  if (!v.dob) errors.dob = "Enter your date of birth."
  else if (
    !/^\d{4}-\d{2}-\d{2}$/.test(v.dob) ||
    v.dob > TODAY ||
    v.dob < EARLIEST_BIRTH
  )
    errors.dob = "Enter a date of birth from 1927 to today."
  else if (membership === "playing" && v.dob > ADULT_BORN_BY)
    errors.dob =
      "Playing membership is for adults. Choose Junior membership, or check the date."
  else if (membership === "junior" && v.dob <= ADULT_BORN_BY)
    errors.dob =
      "Junior membership is for under 18s. Choose Playing or Social membership, or check the date."

  if (!v.contact) errors.contact = "Enter the name of someone we can call."

  if (!/^\+?\d{10,15}$/.test(v.phone.replace(/\s/g, "")))
    errors.phone = "Enter a phone number of 10 to 15 digits."

  if (!consent) errors.consent = "Tick the box to agree to the code of conduct."

  return errors
}

function ErrorLine({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="flex items-start gap-2 text-label text-destructive">
      <CircleAlert
        className="size-4 shrink-0"
        strokeWidth={2}
        strokeLinecap="square"
        aria-hidden="true"
      />
      <span>{children}</span>
    </p>
  )
}

function Header() {
  return (
    <header className="border-b border-border bg-navy text-navy-foreground">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-x-8 gap-y-1 px-5 py-3">
        <a
          href="/"
          className={cn(
            "inline-flex items-center gap-3 transition-colors duration-150",
            bandFocusRing
          )}
        >
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ice font-heading text-body font-extrabold text-ice-foreground"
            aria-hidden="true"
          >
            W
          </span>
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
                      bandFocusRing
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
                  className={cn(
                    label,
                    "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
                    focusRing
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={cn(label, "text-muted-foreground")}>
          © 2027 Wendmoor Football Club · Millrace Park, Wendmoor · A demo:
          nothing is sent or stored
        </p>
      </div>
    </footer>
  )
}

type Confirmed = {
  firstName: string
  email: string
  membership: Membership
}

export function App() {
  const [membership, setMembership] = useState<MembershipId>("playing")
  const [values, setValues] = useState<Values>(EMPTY)
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null)

  const fieldRefs = useRef<Partial<Record<FieldId, HTMLInputElement | null>>>(
    {}
  )
  const focusFirstError = useRef(false)
  const confirmHeading = useRef<HTMLHeadingElement>(null)

  // Focus moves only after the error lines exist in the DOM.
  useEffect(() => {
    if (!focusFirstError.current) return
    focusFirstError.current = false
    const first = FIELD_ORDER.find((id) => errors[id])
    if (first) fieldRefs.current[first]?.focus()
  }, [errors])

  useEffect(() => {
    if (confirmed) confirmHeading.current?.focus()
  }, [confirmed])

  function clearError(id: FieldId) {
    setErrors((prev) => {
      if (!prev[id]) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(values, consent, membership)
    if (Object.keys(found).length > 0) {
      focusFirstError.current = true
      setErrors(found)
      return
    }
    setErrors({})
    setConfirmed({
      firstName: values.name.trim().split(/\s+/)[0],
      email: values.email.trim(),
      membership: MEMBERSHIPS.find((m) => m.id === membership)!,
    })
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />

      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-18 px-5 pt-8 pb-18">
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="flex flex-col gap-3">
                <p className={cn(label, "text-muted-foreground")}>
                  2027 Season · 140 Members
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
                  <div
                    role="radiogroup"
                    aria-labelledby="membership-heading"
                    className="flex flex-col gap-5"
                  >
                    <h2 id="membership-heading" className="text-h2 uppercase">
                      Choose a membership
                    </h2>
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                      {MEMBERSHIPS.map((m) => (
                        <label
                          key={m.id}
                          className="flex min-w-0 cursor-pointer flex-col gap-3 rounded-xl border border-border bg-card p-5 has-checked:border-foreground lg:col-span-4"
                        >
                          <span className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="membership"
                              value={m.id}
                              checked={membership === m.id}
                              onChange={() => {
                                setMembership(m.id)
                                clearError("dob")
                              }}
                              aria-labelledby={`membership-${m.id}-name`}
                              aria-describedby={`membership-${m.id}-details`}
                              className={cn(
                                "size-5 shrink-0 accent-secondary",
                                focusRing
                              )}
                            />
                            <span
                              id={`membership-${m.id}-name`}
                              className="font-heading text-h2 uppercase"
                            >
                              {m.name}
                            </span>
                          </span>
                          <span
                            id={`membership-${m.id}-details`}
                            className="flex flex-col gap-3"
                          >
                            <span className="flex flex-col gap-1">
                              <span className="font-heading text-h1 tabular-nums">
                                {m.price}
                              </span>
                              <span
                                className={cn(label, "text-muted-foreground")}
                              >
                                A season
                              </span>
                            </span>
                            <span className="block text-body">{m.forWhom}</span>
                            <span className="flex flex-col gap-2">
                              {m.includes.map((item) => (
                                <span
                                  key={item}
                                  className="flex items-start gap-2 text-body"
                                >
                                  <Check
                                    className="mt-1 size-4 shrink-0"
                                    strokeWidth={2}
                                    strokeLinecap="square"
                                    aria-hidden="true"
                                  />
                                  <span>{item}</span>
                                </span>
                              ))}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                    <div className="flex min-w-0 flex-col gap-5 rounded-xl border border-border bg-card p-5 lg:col-span-8">
                      <h2 className="text-h2 uppercase">Your details</h2>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {FIELDS.map((field) => {
                          const inputId = `field-${field.id}`
                          const helperId = field.helper
                            ? `${inputId}-helper`
                            : undefined
                          const error = errors[field.id]
                          const errorId = error ? `${inputId}-error` : undefined
                          const describedBy =
                            [helperId, errorId].filter(Boolean).join(" ") ||
                            undefined
                          return (
                            <div
                              key={field.id}
                              className={cn(
                                "flex min-w-0 flex-col gap-2",
                                field.both && "md:col-span-2"
                              )}
                            >
                              <label
                                htmlFor={inputId}
                                className={cn(label, "block text-foreground")}
                              >
                                {field.label}
                              </label>
                              <Input
                                ref={(el) => {
                                  fieldRefs.current[field.id] = el
                                }}
                                id={inputId}
                                name={field.id}
                                type={field.type ?? "text"}
                                autoComplete={field.autoComplete}
                                value={values[field.id]}
                                onChange={(e) => {
                                  const value = e.target.value
                                  setValues((prev) => ({
                                    ...prev,
                                    [field.id]: value,
                                  }))
                                  clearError(field.id)
                                }}
                                aria-invalid={error ? true : undefined}
                                aria-describedby={describedBy}
                                className="h-10 px-3 text-body md:text-body"
                              />
                              {field.helper && (
                                <p
                                  id={helperId}
                                  className="text-label text-muted-foreground"
                                >
                                  {field.helper}
                                </p>
                              )}
                              {error && errorId && (
                                <ErrorLine id={errorId}>{error}</ErrorLine>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="flex items-start gap-3 text-body text-foreground">
                          <input
                            ref={(el) => {
                              fieldRefs.current.consent = el
                            }}
                            type="checkbox"
                            name="consent"
                            checked={consent}
                            onChange={(e) => {
                              setConsent(e.target.checked)
                              clearError("consent")
                            }}
                            aria-invalid={errors.consent ? true : undefined}
                            aria-describedby={
                              errors.consent ? "field-consent-error" : undefined
                            }
                            className={cn(
                              "mt-0.5 size-5 shrink-0 accent-secondary",
                              focusRing
                            )}
                          />
                          <span>
                            I agree to the club's code of conduct, and to the
                            club keeping these details for the 2027 season.
                          </span>
                        </label>
                        {errors.consent && (
                          <ErrorLine id="field-consent-error">
                            {errors.consent}
                          </ErrorLine>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
                        <Button type="submit" className={buttonClasses}>
                          Join the club
                        </Button>
                        <p className="text-label text-muted-foreground">
                          You pay at your first session. Nothing is charged
                          here.
                        </p>
                      </div>
                    </div>

                    <aside
                      aria-labelledby="next-heading"
                      className="flex min-w-0 flex-col gap-5 self-start rounded-xl bg-ice p-5 text-ice-foreground lg:col-span-4"
                    >
                      <h2 id="next-heading" className="text-h2 uppercase">
                        What happens next
                      </h2>
                      <ol role="list" className="flex flex-col gap-3">
                        {[
                          "We email your membership number and a welcome from the club.",
                          "You come to your first session at Millrace Park and pay the season's fee there.",
                          "Players are registered with the league within a week, and can then be picked.",
                        ].map((step, i) => (
                          <li key={step} className="flex items-baseline gap-3">
                            <span className="w-5 shrink-0 font-heading text-h2 tabular-nums">
                              {i + 1}
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
                  <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
                    <h2
                      ref={confirmHeading}
                      tabIndex={-1}
                      className={cn("text-h2 uppercase", codeFocusRing)}
                    >
                      Welcome to Wendmoor FC
                    </h2>
                    <p className="max-w-2xl text-body">
                      Thank you, {confirmed.firstName}. Your{" "}
                      {confirmed.membership.name} membership for the 2027
                      season is ready.
                    </p>
                    <dl className="w-full max-w-md">
                      {[
                        ["Membership number", MEMBER_NUMBER],
                        ["Membership", confirmed.membership.name],
                        ["Fee for the season", confirmed.membership.price],
                        confirmed.membership.lastRow,
                      ].map(([term, detail], i) => (
                        <div
                          key={term}
                          className={cn(
                            "flex items-baseline justify-between gap-3 py-2",
                            i > 0 && "border-t border-border"
                          )}
                        >
                          <dt className={cn(label, "text-muted-foreground")}>
                            {term}
                          </dt>
                          <dd className="text-right text-body">{detail}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="max-w-2xl text-body">
                      We have sent the details to{" "}
                      <span className="wrap-anywhere">{confirmed.email}</span>.
                      This is a demo: nothing was sent or stored.
                    </p>
                    <a
                      href="/fixtures"
                      className={cn(
                        buttonVariants({ variant: "secondary" }),
                        buttonClasses,
                        "self-start"
                      )}
                    >
                      See the fixtures
                    </a>
                  </div>
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
