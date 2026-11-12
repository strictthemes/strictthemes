import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { CircleAlert, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const runningLink = `text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground ${focusRing}`
const headerLink = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`
const inputClass =
  "h-auto rounded-md border-muted-foreground px-3 py-2 text-body md:text-body"
const fieldLabel = "block font-mono text-label text-foreground"
const helperClass = "mt-2 font-mono text-label text-muted-foreground"
const priceLabel = "shrink-0 font-mono text-label text-foreground tabular-nums"

// All money is in pence.
const FARE = 7800
const CAR = 4600
const LOUNGE = 2400
const PRIORITY = 800
const BICYCLE = 600
const MAX_BICYCLES = 2

function money(pence: number) {
  return `£${(pence / 100).toFixed(2)}`
}

type FieldKey =
  | "p1First"
  | "p1Last"
  | "email"
  | "phone"
  | "p2First"
  | "p2Last"
  | "conditions"

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

type Values = {
  p1First: string
  p1Last: string
  email: string
  phone: string
  p2First: string
  p2Last: string
}

function validate(values: Values, conditions: boolean): Errors {
  const errors: Errors = {}
  const firstMsg = "Write the first name as it is on the passenger's photo ID."
  const lastMsg = "Write the last name as it is on the passenger's photo ID."
  if (!values.p1First.trim()) errors.p1First = firstMsg
  if (!values.p1Last.trim()) errors.p1Last = lastMsg

  const email = values.email.trim()
  if (!email) {
    errors.email = "Write an email address for the boarding pass."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Check the email address: it needs an @ and a domain."
  }

  const phone = values.phone.trim()
  if (!phone) {
    errors.phone = "Write a mobile number we can text on the day."
  } else {
    const allowedOnly = /^[\d\s+-]+$/.test(phone)
    const digits = phone.replace(/\D/g, "").length
    if (!allowedOnly || digits < 10) {
      errors.phone = "Check the mobile number: it needs at least 10 digits."
    }
  }

  if (!values.p2First.trim()) errors.p2First = firstMsg
  if (!values.p2Last.trim()) errors.p2Last = lastMsg
  if (!conditions) {
    errors.conditions = "Tick the box to accept the conditions of carriage."
  }
  return errors
}

function ErrorLine({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

function describedBy(...ids: (string | false | undefined)[]) {
  const list = ids.filter(Boolean).join(" ")
  return list || undefined
}

function Header() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-2 px-5 py-5 md:flex-row md:items-center md:justify-between">
        <a
          href="/"
          className={`font-heading text-h2 text-foreground transition-colors duration-150 ${focusRing}`}
        >
          Kestrel Ferries
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <a href="/" aria-current="true" className={`${headerLink} text-body underline`}>
                Book
              </a>
            </li>
            <li>
              <a href="/departures" className={`${headerLink} text-body`}>
                Departures
              </a>
            </li>
            <li>
              <a href="/ticket" className={`${headerLink} text-body`}>
                My booking
              </a>
            </li>
            <li>
              <a href="#" className={`${headerLink} text-body`}>
                Help
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="mx-auto max-w-[1120px] px-5 py-8">
        <div className="grid gap-5 md:grid-cols-12 md:items-start">
          <div className="md:col-span-6">
            <p className="font-heading text-h2">Kestrel Ferries</p>
            <p className="mt-2 max-w-xl">
              Crossings from Harrowmouth to Port Ellery, Brindle Ness, Wrenholm
              and Tollan Quay since 1987.
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="font-mono text-label text-muted-foreground">Customer desk</p>
            <p className="mt-2 text-body">
              <a href="tel:+441632960512" className={runningLink}>
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
  )
}

export function App() {
  const [values, setValues] = useState<Values>({
    p1First: "",
    p1Last: "",
    email: "",
    phone: "",
    p2First: "",
    p2Last: "",
  })
  const [car, setCar] = useState(false)
  const [lounge, setLounge] = useState(false)
  const [priority, setPriority] = useState(false)
  const [bicycles, setBicycles] = useState(0)
  const [conditions, setConditions] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [confirmation, setConfirmation] = useState<{
    total: number
    email: string
  } | null>(null)
  const [focusRequest, setFocusRequest] = useState<{
    target: FieldKey | "confirmation"
    n: number
  } | null>(null)

  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLElement | null>>>({})
  const confirmationRef = useRef<HTMLHeadingElement>(null)
  const conditionsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!focusRequest) return
    const frame = requestAnimationFrame(() => {
      if (focusRequest.target === "confirmation") {
        confirmationRef.current?.focus()
      } else if (focusRequest.target === "conditions") {
        conditionsRef.current?.focus()
      } else {
        fieldRefs.current[focusRequest.target]?.focus()
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [focusRequest])

  const summaryRows: { name: string; price: number }[] = [
    { name: "Fare, 2 adults", price: FARE },
  ]
  if (car) summaryRows.push({ name: "Car", price: CAR })
  if (lounge) summaryRows.push({ name: "Lounge seats", price: LOUNGE })
  if (priority) summaryRows.push({ name: "Priority boarding", price: PRIORITY })
  if (bicycles > 0) {
    summaryRows.push({
      name: bicycles === 1 ? "1 bicycle" : `${bicycles} bicycles`,
      price: bicycles * BICYCLE,
    })
  }
  const total = summaryRows.reduce((sum, row) => sum + row.price, 0)

  function clearError(key: FieldKey) {
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function setValue(key: keyof Values, value: string) {
    setValues((current) => ({ ...current, [key]: value }))
    clearError(key)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(values, conditions)
    setErrors(found)
    const first = FIELD_ORDER.find((key) => found[key])
    if (first) {
      setConfirmation(null)
      setFocusRequest((r) => ({ target: first, n: (r?.n ?? 0) + 1 }))
    } else {
      setConfirmation({ total, email: values.email.trim() })
      setFocusRequest((r) => ({ target: "confirmation", n: (r?.n ?? 0) + 1 }))
    }
  }

  function textField(
    key: keyof Values,
    label: string,
    options: {
      type?: string
      autoComplete: string
      helper?: string
    }
  ) {
    const id = `field-${key}`
    const helperId = options.helper ? `${id}-help` : undefined
    const errorId = errors[key] ? `${id}-error` : undefined
    return (
      <>
        <label htmlFor={id} className={fieldLabel}>
          {label}
        </label>
        <Input
          ref={(el: HTMLInputElement | null) => {
            fieldRefs.current[key] = el
          }}
          id={id}
          name={key}
          type={options.type ?? "text"}
          autoComplete={options.autoComplete}
          value={values[key]}
          onChange={(event) => setValue(key, event.target.value)}
          aria-invalid={errors[key] ? true : undefined}
          aria-describedby={describedBy(helperId, errorId)}
          className={`mt-2 ${inputClass}`}
        />
        {options.helper && (
          <p id={helperId} className={helperClass}>
            {options.helper}
          </p>
        )}
        {errors[key] && errorId && <ErrorLine id={errorId}>{errors[key]}</ErrorLine>}
      </>
    )
  }

  function checkboxRow(
    id: string,
    text: ReactNode,
    checked: boolean,
    onChange: (checked: boolean) => void
  ) {
    return (
      <div className="flex items-start gap-3">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(value) => onChange(value === true)}
          aria-labelledby={`${id}-label`}
          className="mt-0.5"
        />
        <label id={`${id}-label`} htmlFor={id} className="text-body text-foreground">
          {text}
        </label>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <Header />

      <main className="mx-auto max-w-[1120px] px-5">
        <section className="grid gap-5 pt-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="font-mono text-label text-muted-foreground">
              Step 2 of 3 · Passengers and extras
            </p>
            <h1 className="mt-2 text-h1">Who is travelling</h1>
            <p className="mt-3 max-w-xl">
              Write each name exactly as it is on the passenger's photo ID. We
              text the lead passenger if the sailing changes.
            </p>
            <p className="mt-3">
              <a href="/results" className={runningLink}>
                Back to sailings
              </a>
            </p>
          </div>
        </section>

        <section className="mt-16 grid gap-5 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-8">
            <form noValidate aria-label="Passenger details" onSubmit={handleSubmit}>
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
                <div className="mt-5 grid gap-5 md:grid-cols-2 md:items-start">
                  <div>
                    {textField("p1First", "First name", { autoComplete: "given-name" })}
                  </div>
                  <div>
                    {textField("p1Last", "Last name", { autoComplete: "family-name" })}
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
                    helper: "We text this number if the sailing is delayed or cancelled.",
                  })}
                </div>
              </div>

              <div
                role="group"
                aria-labelledby="passenger-2-heading"
                className="mt-5 rounded-xl border bg-card p-5"
              >
                <p className="font-mono text-label text-muted-foreground">Adult</p>
                <h2 id="passenger-2-heading" className="mt-2 text-h2">
                  Passenger 2
                </h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2 md:items-start">
                  <div>
                    {textField("p2First", "First name", { autoComplete: "given-name" })}
                  </div>
                  <div>
                    {textField("p2Last", "Last name", { autoComplete: "family-name" })}
                  </div>
                </div>
              </div>

              <div
                role="group"
                aria-labelledby="extras-heading"
                className="mt-5 rounded-xl border bg-card p-5"
              >
                <p className="font-mono text-label text-muted-foreground">Optional</p>
                <h2 id="extras-heading" className="mt-2 text-h2">
                  Extras
                </h2>
                <ul className="mt-5 divide-y">
                  <li className="flex items-start justify-between gap-5 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      {checkboxRow(
                        "extra-car",
                        "A car up to 5 m long and 2 m high",
                        car,
                        setCar
                      )}
                    </div>
                    <p className={priceLabel}>{money(CAR)}</p>
                  </li>
                  <li className="flex items-start justify-between gap-5 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      {checkboxRow(
                        "extra-lounge",
                        "Seats in the quiet lounge for two",
                        lounge,
                        setLounge
                      )}
                    </div>
                    <p className={priceLabel}>{money(LOUNGE)}</p>
                  </li>
                  <li className="flex items-start justify-between gap-5 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      {checkboxRow(
                        "extra-priority",
                        "Priority boarding",
                        priority,
                        setPriority
                      )}
                    </div>
                    <p className={priceLabel}>{money(PRIORITY)}</p>
                  </li>
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
                          disabled={bicycles === 0}
                          focusableWhenDisabled
                          onClick={() => setBicycles((n) => Math.max(0, n - 1))}
                        >
                          <Minus className="size-4" strokeWidth={1.5} aria-hidden="true" />
                        </Button>
                        <span
                          aria-live="polite"
                          className="inline-flex min-w-24 justify-center font-mono text-label text-foreground tabular-nums"
                        >
                          {bicycles === 1 ? "1 bicycle" : `${bicycles} bicycles`}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-md"
                          aria-label="More bicycles"
                          disabled={bicycles === MAX_BICYCLES}
                          focusableWhenDisabled
                          onClick={() =>
                            setBicycles((n) => Math.min(MAX_BICYCLES, n + 1))
                          }
                        >
                          <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                    <p className={priceLabel}>{money(BICYCLE)} each</p>
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
                <p className="mt-3 max-w-xl text-body">
                  Under our{" "}
                  <a href="#" className={runningLink}>
                    conditions of carriage
                  </a>
                  , you can change this booking up to 24 hours before the sailing
                  for £10.00.
                </p>
                <div className="mt-5">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      ref={conditionsRef}
                      id="conditions"
                      checked={conditions}
                      onCheckedChange={(value) => {
                        setConditions(value === true)
                        clearError("conditions")
                      }}
                      aria-labelledby="conditions-label"
                      aria-invalid={errors.conditions ? true : undefined}
                      aria-describedby={
                        errors.conditions ? "conditions-error" : undefined
                      }
                      className="mt-0.5"
                    />
                    <label
                      id="conditions-label"
                      htmlFor="conditions"
                      className="text-body text-foreground"
                    >
                      I have read the conditions of carriage and the fare rules.
                    </label>
                  </div>
                  {errors.conditions && (
                    <ErrorLine id="conditions-error">{errors.conditions}</ErrorLine>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <Button
                  type="submit"
                  className="h-auto rounded-md px-5 py-2 font-mono text-label"
                >
                  Continue to payment
                </Button>
              </div>
            </form>

            <div role="status">
              {confirmation && (
                <div className="mt-5">
                  <h2
                    ref={confirmationRef}
                    tabIndex={-1}
                    className={`text-h2 ${codeFocusRing}`}
                  >
                    Ready for payment
                  </h2>
                  <p className="mt-3 max-w-xl">
                    Your details are complete. The total to pay is{" "}
                    {money(confirmation.total)}, and the boarding pass goes to{" "}
                    {confirmation.email}.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside
            aria-labelledby="summary-heading"
            className="rounded-xl border bg-card p-5 lg:sticky lg:top-5 lg:col-span-4"
          >
            <p className="font-mono text-label text-muted-foreground">Your sailing</p>
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
                <p className="font-mono text-label text-muted-foreground">1 h 45 min</p>
                <div className="mt-1 h-px bg-border" aria-hidden="true" />
                <p className="mt-1 font-mono text-label text-muted-foreground">Direct</p>
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
              <time dateTime="2026-12-19">Saturday 19 December 2026</time> · MV Isla
              Grey
            </p>

            <ul className="mt-5 divide-y">
              {summaryRows.map((row) => (
                <li
                  key={row.name}
                  className="flex items-baseline justify-between gap-5 py-3 first:pt-0 last:pb-0"
                >
                  <span className="text-body">{row.name}</span>
                  <span className={priceLabel}>{money(row.price)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-baseline justify-between gap-5 border-t pt-3">
              <p className="font-mono text-label text-foreground">Total</p>
              <p className="font-mono text-h2 text-foreground tabular-nums">
                {money(total)}
              </p>
            </div>

            <p className="mt-3 font-mono text-label text-muted-foreground">
              Includes port fees and VAT.
            </p>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App
