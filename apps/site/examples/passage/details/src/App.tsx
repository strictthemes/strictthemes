import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const textLink = `text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground ${focusRing}`
const headerLink = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`
const inputClass =
  "mt-2 h-auto rounded-md border-muted-foreground px-3 py-2 text-body md:text-body"
const labelClass = "block font-mono text-label text-foreground"
const buttonClass = "h-auto rounded-md px-5 py-2 font-mono text-label"

const FARE = 7800
const EXTRAS = {
  car: { name: "Car", price: 4600 },
  lounge: { name: "Lounge seats", price: 2400 },
  priority: { name: "Priority boarding", price: 800 },
} as const
const BIKE_PRICE = 600
const MAX_BIKES = 2

type FieldKey =
  "p1First" | "p1Last" | "email" | "phone" | "p2First" | "p2Last" | "conditions"

const FIELD_ORDER: FieldKey[] = [
  "p1First",
  "p1Last",
  "email",
  "phone",
  "p2First",
  "p2Last",
  "conditions",
]

type Errors = Partial<Record<FieldKey, string>>

type TextFields = {
  p1First: string
  p1Last: string
  email: string
  phone: string
  p2First: string
  p2Last: string
}

type Confirmation = { total: number; email: string }

function formatPrice(pence: number) {
  return `£${(pence / 100).toFixed(2)}`
}

function bicycles(count: number) {
  return `${count} ${count === 1 ? "bicycle" : "bicycles"}`
}

function validate(fields: TextFields, accepted: boolean): Errors {
  const errors: Errors = {}
  const t = (value: string) => value.trim()

  if (!t(fields.p1First))
    errors.p1First =
      "Write the first name as it is on the passenger's photo ID."
  if (!t(fields.p1Last))
    errors.p1Last = "Write the last name as it is on the passenger's photo ID."

  const email = t(fields.email)
  if (!email) errors.email = "Write an email address for the boarding pass."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Check the email address: it needs an @ and a domain."

  const phone = t(fields.phone)
  if (!phone) errors.phone = "Write a mobile number we can text on the day."
  else if (!/^[0-9+\-\s]+$/.test(phone) || phone.replace(/\D/g, "").length < 10)
    errors.phone = "Check the mobile number: it needs at least 10 digits."

  if (!t(fields.p2First))
    errors.p2First =
      "Write the first name as it is on the passenger's photo ID."
  if (!t(fields.p2Last))
    errors.p2Last = "Write the last name as it is on the passenger's photo ID."

  if (!accepted)
    errors.conditions = "Tick the box to accept the conditions of carriage."

  return errors
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
      {message}
    </p>
  )
}

function describedBy(...ids: (string | false | undefined)[]) {
  const list = ids.filter(Boolean)
  return list.length ? list.join(" ") : undefined
}

export function App() {
  const [fields, setFields] = useState<TextFields>({
    p1First: "",
    p1Last: "",
    email: "",
    phone: "",
    p2First: "",
    p2Last: "",
  })
  const [extras, setExtras] = useState({
    car: false,
    lounge: false,
    priority: false,
  })
  const [bikes, setBikes] = useState(0)
  const [accepted, setAccepted] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
  const [sendCount, setSendCount] = useState(0)

  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLElement | null>>>({})
  const confirmRef = useRef<HTMLHeadingElement>(null)
  const pendingFocus = useRef<FieldKey | "confirmation" | null>(null)

  useEffect(() => {
    const target = pendingFocus.current
    if (!target) return
    pendingFocus.current = null
    if (target === "confirmation") confirmRef.current?.focus()
    else fieldRefs.current[target]?.focus()
  }, [sendCount])

  const total =
    FARE +
    (Object.keys(EXTRAS) as (keyof typeof EXTRAS)[]).reduce(
      (sum, key) => sum + (extras[key] ? EXTRAS[key].price : 0),
      0
    ) +
    bikes * BIKE_PRICE

  function clearError(key: FieldKey) {
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function updateField(key: keyof TextFields, value: string) {
    setFields((current) => ({ ...current, [key]: value }))
    clearError(key)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(fields, accepted)
    setErrors(found)
    const first = FIELD_ORDER.find((key) => found[key])
    if (first) {
      setConfirmation(null)
      pendingFocus.current = first
    } else {
      setConfirmation({ total, email: fields.email.trim() })
      pendingFocus.current = "confirmation"
    }
    setSendCount((count) => count + 1)
  }

  function textField(
    key: keyof TextFields,
    label: string,
    options: {
      type?: string
      autoComplete: string
      helper?: string
    }
  ) {
    const id = `field-${key}`
    const helperId = options.helper ? `${id}-help` : undefined
    const errorId = `${id}-error`
    const error = errors[key]
    return (
      <>
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
        <Input
          ref={(el) => {
            fieldRefs.current[key] = el
          }}
          id={id}
          type={options.type ?? "text"}
          autoComplete={options.autoComplete}
          value={fields[key]}
          onChange={(event) => updateField(key, event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(helperId, error && errorId)}
          className={inputClass}
        />
        {options.helper && (
          <p
            id={helperId}
            className="mt-2 font-mono text-label text-muted-foreground"
          >
            {options.helper}
          </p>
        )}
        {error && <ErrorLine id={errorId} message={error} />}
      </>
    )
  }

  const extraRows: { key: keyof typeof EXTRAS; text: string }[] = [
    { key: "car", text: "A car up to 5 m long and 2 m high" },
    { key: "lounge", text: "Seats in the quiet lounge for two" },
    { key: "priority", text: "Priority boarding" },
  ]

  const summaryRows: { name: string; price: number }[] = [
    { name: "Fare, 2 adults", price: FARE },
    ...extraRows
      .filter((row) => extras[row.key])
      .map((row) => ({
        name: EXTRAS[row.key].name,
        price: EXTRAS[row.key].price,
      })),
    ...(bikes > 0
      ? [{ name: bicycles(bikes), price: bikes * BIKE_PRICE }]
      : []),
  ]

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-2 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <a href="/" className={`font-heading text-h2 ${headerLink}`}>
            Kestrel Ferries
          </a>
          <nav aria-label="Main">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              <li>
                <a
                  href="/"
                  aria-current="true"
                  className={`text-body underline ${headerLink}`}
                >
                  Book
                </a>
              </li>
              <li>
                <a href="/departures" className={`text-body ${headerLink}`}>
                  Departures
                </a>
              </li>
              <li>
                <a href="/ticket" className={`text-body ${headerLink}`}>
                  My booking
                </a>
              </li>
              <li>
                <a href="#" className={`text-body ${headerLink}`}>
                  Help
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-5">
        <section className="grid gap-5 pt-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="font-mono text-label text-muted-foreground">
              Step 2 of 3 · Passengers and extras
            </p>
            <h1 className="mt-2 text-h1">Who is travelling</h1>
            <p className="mt-3 max-w-xl">
              Write each name exactly as it is on the passenger's photo ID, or
              they may not be let on board. The lead passenger gets a text if
              the sailing changes.
            </p>
            <p className="mt-3">
              <a href="/results" className={textLink}>
                Back to sailings
              </a>
            </p>
          </div>
        </section>

        <section className="mt-16 grid gap-5 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-8">
            <form
              noValidate
              aria-label="Passenger details"
              onSubmit={handleSubmit}
            >
              <div
                role="group"
                aria-labelledby="passenger-1-heading"
                className="rounded-xl border bg-card p-5"
              >
                <p className="font-mono text-label text-muted-foreground">
                  Adult · Lead passenger
                </p>
                <h2 id="passenger-1-heading" className="mt-2 text-h2">
                  Passenger 1
                </h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    {textField("p1First", "First name", {
                      autoComplete: "given-name",
                    })}
                  </div>
                  <div>
                    {textField("p1Last", "Last name", {
                      autoComplete: "family-name",
                    })}
                  </div>
                </div>
                <div className="mt-5">
                  {textField("email", "Email address", {
                    type: "email",
                    autoComplete: "email",
                    helper: "We send the boarding pass here.",
                  })}
                </div>
                <div className="mt-5">
                  {textField("phone", "Mobile phone", {
                    type: "tel",
                    autoComplete: "tel",
                    helper:
                      "We text this number if the sailing is delayed or cancelled.",
                  })}
                </div>
              </div>

              <div
                role="group"
                aria-labelledby="passenger-2-heading"
                className="mt-5 rounded-xl border bg-card p-5"
              >
                <p className="font-mono text-label text-muted-foreground">
                  Adult
                </p>
                <h2 id="passenger-2-heading" className="mt-2 text-h2">
                  Passenger 2
                </h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    {textField("p2First", "First name", {
                      autoComplete: "given-name",
                    })}
                  </div>
                  <div>
                    {textField("p2Last", "Last name", {
                      autoComplete: "family-name",
                    })}
                  </div>
                </div>
              </div>

              <div
                role="group"
                aria-labelledby="extras-heading"
                className="mt-5 rounded-xl border bg-card p-5"
              >
                <p className="font-mono text-label text-muted-foreground">
                  Optional
                </p>
                <h2 id="extras-heading" className="mt-2 text-h2">
                  Extras
                </h2>
                <ul className="mt-5 divide-y">
                  {extraRows.map((row) => (
                    <li
                      key={row.key}
                      className="flex items-start justify-between gap-5 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={`extra-${row.key}`}
                            aria-labelledby={`extra-${row.key}-label`}
                            checked={extras[row.key]}
                            onCheckedChange={(checked) =>
                              setExtras((current) => ({
                                ...current,
                                [row.key]: checked,
                              }))
                            }
                            className="mt-0.5"
                          />
                          <label
                            id={`extra-${row.key}-label`}
                            htmlFor={`extra-${row.key}`}
                            className="text-body text-foreground"
                          >
                            {row.text}
                          </label>
                        </div>
                      </div>
                      <p className="mt-1 shrink-0 font-mono text-label text-foreground tabular-nums">
                        {formatPrice(EXTRAS[row.key].price)}
                      </p>
                    </li>
                  ))}
                  <li className="flex items-start justify-between gap-5 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p
                        id="bicycles-label"
                        className="font-mono text-label text-foreground"
                      >
                        Bicycles
                      </p>
                      <div
                        role="group"
                        aria-labelledby="bicycles-label"
                        className="mt-2 flex items-center gap-2"
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-md"
                          aria-label="Fewer bicycles"
                          disabled={bikes === 0}
                          focusableWhenDisabled
                          onClick={() =>
                            setBikes((count) => Math.max(0, count - 1))
                          }
                        >
                          <Minus
                            className="size-4"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </Button>
                        <span
                          aria-live="polite"
                          className="inline-flex min-w-24 justify-center font-mono text-label text-foreground tabular-nums"
                        >
                          {bicycles(bikes)}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-md"
                          aria-label="More bicycles"
                          disabled={bikes === MAX_BIKES}
                          focusableWhenDisabled
                          onClick={() =>
                            setBikes((count) => Math.min(MAX_BIKES, count + 1))
                          }
                        >
                          <Plus
                            className="size-4"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </Button>
                      </div>
                    </div>
                    <p className="shrink-0 font-mono text-label text-foreground tabular-nums">
                      {formatPrice(BIKE_PRICE)} each
                    </p>
                  </li>
                </ul>
              </div>

              <div
                role="group"
                aria-labelledby="conditions-heading"
                className="mt-5 rounded-xl border bg-card p-5"
              >
                <p className="font-mono text-label text-muted-foreground">
                  Before you pay
                </p>
                <h2 id="conditions-heading" className="mt-2 text-h2">
                  Conditions
                </h2>
                <p className="mt-3 text-body">
                  Under the{" "}
                  <a href="#" className={textLink}>
                    conditions of carriage
                  </a>
                  , a booking can be changed up to 24 hours before the sailing
                  for £10.00.
                </p>
                <div className="mt-5">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      ref={(el: HTMLElement | null) => {
                        fieldRefs.current.conditions = el
                      }}
                      id="field-conditions"
                      aria-labelledby="field-conditions-label"
                      checked={accepted}
                      onCheckedChange={(checked) => {
                        setAccepted(checked)
                        clearError("conditions")
                      }}
                      aria-invalid={errors.conditions ? true : undefined}
                      aria-describedby={
                        errors.conditions ? "field-conditions-error" : undefined
                      }
                      className="mt-0.5"
                    />
                    <label
                      id="field-conditions-label"
                      htmlFor="field-conditions"
                      className="text-body text-foreground"
                    >
                      I have read the conditions of carriage and the fare rules.
                    </label>
                  </div>
                  {errors.conditions && (
                    <ErrorLine
                      id="field-conditions-error"
                      message={errors.conditions}
                    />
                  )}
                </div>
              </div>

              <div className="mt-5">
                <Button type="submit" className={buttonClass}>
                  Continue to payment
                </Button>
              </div>
            </form>
            <div role="status">
              {confirmation && (
                <div className="mt-5">
                  <h2
                    ref={confirmRef}
                    tabIndex={-1}
                    className={`text-h2 text-foreground ${codeFocusRing}`}
                  >
                    Ready for payment
                  </h2>
                  <p className="mt-3 wrap-break-word text-foreground">
                    Your details are complete. The total to pay is{" "}
                    {formatPrice(confirmation.total)}, and the boarding pass
                    goes to {confirmation.email}.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside
            aria-labelledby="summary-heading"
            className="rounded-xl border bg-card p-5 lg:sticky lg:top-5 lg:col-span-4"
          >
            <p className="font-mono text-label text-muted-foreground">
              Your sailing
            </p>
            <h2 id="summary-heading" className="mt-2 text-h2">
              Fare summary
            </h2>
            <div className="mt-5 flex items-center gap-3">
              <div className="shrink-0">
                <p className="font-mono text-label text-foreground tabular-nums">
                  <time dateTime="09:15">09:15</time>
                </p>
                <p className="mt-1 font-mono text-label text-muted-foreground">
                  Harrowmouth
                </p>
              </div>
              <div className="min-w-0 flex-1 text-center">
                <p className="font-mono text-label text-muted-foreground">
                  1 h 45 min
                </p>
                <div aria-hidden="true" className="mt-1 h-px bg-border" />
                <p className="mt-1 font-mono text-label text-muted-foreground">
                  Direct
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-label text-foreground tabular-nums">
                  <time dateTime="11:00">11:00</time>
                </p>
                <p className="mt-1 font-mono text-label text-muted-foreground">
                  Port Ellery
                </p>
              </div>
            </div>
            <p className="mt-3 font-mono text-label text-muted-foreground tabular-nums">
              <time dateTime="2026-12-19">Saturday 19 December 2026</time> · MV
              Isla Grey
            </p>
            <ul className="mt-5 divide-y">
              {summaryRows.map((row) => (
                <li
                  key={row.name}
                  className="flex items-baseline justify-between gap-5 py-3 first:pt-0 last:pb-0"
                >
                  <span className="text-body">{row.name}</span>
                  <span className="shrink-0 font-mono text-label text-foreground tabular-nums">
                    {formatPrice(row.price)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-baseline justify-between gap-5 border-t pt-3">
              <p className="font-mono text-label text-foreground">Total</p>
              <p className="font-mono text-h2 text-foreground tabular-nums">
                {formatPrice(total)}
              </p>
            </div>
            <p className="mt-3 font-mono text-label text-muted-foreground">
              Includes port fees and VAT.
            </p>
          </aside>
        </section>
      </main>

      <footer className="mt-16 border-t bg-card">
        <div className="mx-auto max-w-[1120px] px-5 py-8">
          <div className="grid gap-5 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">Kestrel Ferries</p>
              <p className="mt-2">
                Crossings from Harrowmouth to Port Ellery, Brindle Ness,
                Wrenholm and Tollan Quay since 1987.
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <p className="font-mono text-label text-muted-foreground">
                Customer desk
              </p>
              <p className="mt-2 text-body">
                <a href="tel:+441632960512" className={textLink}>
                  01632 960 512
                </a>
              </p>
              <p className="mt-2 font-mono text-label text-muted-foreground tabular-nums">
                Every day · <time dateTime="06:00">06:00</time>–
                <time dateTime="22:00">22:00</time>
              </p>
            </div>
          </div>
          <p className="mt-5 font-mono text-label text-muted-foreground">
            © 2026 Kestrel Ferries
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
