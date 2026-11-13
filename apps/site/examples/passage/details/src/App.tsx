import { useEffect, useRef, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { CircleAlert, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const TEXT_LINK = `text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground ${FOCUS}`
const NAV_LINK = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${FOCUS}`
const CARD = "rounded-xl border bg-card p-5"
const FIELD_LABEL = "block font-mono text-label text-foreground"
const MUTED_LABEL = "font-mono text-label text-muted-foreground"
const PRICE_LABEL = "shrink-0 font-mono text-label text-foreground tabular-nums"
const INPUT =
  "h-auto rounded-md border-muted-foreground px-3 py-2 text-body md:text-body"

// All sums are in pence.
const FARE = 7800
const CAR = 4600
const LOUNGE = 2400
const PRIORITY = 800
const BICYCLE = 600
const MAX_BICYCLES = 2

type TextField = "p1First" | "p1Last" | "email" | "phone" | "p2First" | "p2Last"
type FieldKey = TextField | "conditions"
type Errors = Partial<Record<FieldKey, string>>

// The order in which focus looks for the first error.
const FIELD_ORDER: FieldKey[] = [
  "p1First",
  "p1Last",
  "email",
  "phone",
  "p2First",
  "p2Last",
  "conditions",
]

const FIELD_IDS: Record<FieldKey, string> = {
  p1First: "p1-first-name",
  p1Last: "p1-last-name",
  email: "p1-email",
  phone: "p1-phone",
  p2First: "p2-first-name",
  p2Last: "p2-last-name",
  conditions: "conditions",
}

const FIRST_NAME_ERROR =
  "Write the first name as it is on the passenger's photo ID."
const LAST_NAME_ERROR =
  "Write the last name as it is on the passenger's photo ID."

function pounds(pence: number) {
  return `£${(pence / 100).toFixed(2)}`
}

function bicycleCount(count: number) {
  return count === 1 ? "1 bicycle" : `${count} bicycles`
}

function ErrorLine({ id, children }: { id: string; children: ReactNode }) {
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
      {children}
    </p>
  )
}

function TextInput({
  id,
  label,
  type = "text",
  autoComplete,
  value,
  onChange,
  helper,
  error,
}: {
  id: string
  label: string
  type?: "text" | "email" | "tel"
  autoComplete: string
  value: string
  onChange: (value: string) => void
  helper?: string
  error?: string
}) {
  const helperId = `${id}-helper`
  const errorId = `${id}-error`
  const describedBy =
    [helper ? helperId : null, error ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined

  return (
    <div>
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </label>
      <Input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`mt-2 ${INPUT}`}
      />
      {helper ? (
        <p id={helperId} className={`mt-2 ${MUTED_LABEL}`}>
          {helper}
        </p>
      ) : null}
      {error ? <ErrorLine id={errorId}>{error}</ErrorLine> : null}
    </div>
  )
}

function CheckboxRow({
  id,
  checked,
  onCheckedChange,
  children,
  invalid,
  describedBy,
  checkboxRef,
}: {
  id: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  children: ReactNode
  invalid?: boolean
  describedBy?: string
  checkboxRef?: React.Ref<HTMLElement>
}) {
  const labelId = `${id}-label`
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        ref={checkboxRef}
        checked={checked}
        onCheckedChange={(next) => onCheckedChange(next)}
        aria-labelledby={labelId}
        aria-invalid={invalid ? true : undefined}
        aria-describedby={describedBy}
        className="mt-0.5"
      />
      <label id={labelId} htmlFor={id} className="text-body text-foreground">
        {children}
      </label>
    </div>
  )
}

function Header() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-2 px-5 py-5 md:flex-row md:items-center md:justify-between">
        <a
          href="/"
          className={`font-heading text-h2 text-foreground transition-colors duration-150 ${FOCUS}`}
        >
          Kestrel Ferries
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <a
                href="/"
                aria-current="true"
                className={`text-body underline ${NAV_LINK}`}
              >
                Book
              </a>
            </li>
            <li>
              <a href="/departures" className={`text-body ${NAV_LINK}`}>
                Departures
              </a>
            </li>
            <li>
              <a href="/ticket" className={`text-body ${NAV_LINK}`}>
                My booking
              </a>
            </li>
            <li>
              <a href="#" className={`text-body ${NAV_LINK}`}>
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
            <p className={MUTED_LABEL}>Customer desk</p>
            <p className="mt-2 text-body">
              <a href="tel:+441632960512" className={TEXT_LINK}>
                01632 960 512
              </a>
            </p>
            <p className={`mt-2 tabular-nums ${MUTED_LABEL}`}>
              Every day · <time dateTime="06:00">06:00</time>–
              <time dateTime="22:00">22:00</time>
            </p>
          </div>
        </div>
        <p className={`mt-5 ${MUTED_LABEL}`}>© 2026 Kestrel Ferries</p>
      </div>
    </footer>
  )
}

export function App() {
  const [values, setValues] = useState<Record<TextField, string>>({
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
  const [accepted, setAccepted] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [confirmation, setConfirmation] = useState<{
    total: number
    email: string
  } | null>(null)
  // What to focus after the next render; `send` makes every send a new value.
  const [focusRequest, setFocusRequest] = useState<{
    target: FieldKey | "confirmation"
    send: number
  } | null>(null)

  const conditionsRef = useRef<HTMLElement>(null)
  const confirmationRef = useRef<HTMLHeadingElement>(null)

  const total =
    FARE +
    (car ? CAR : 0) +
    (lounge ? LOUNGE : 0) +
    (priority ? PRIORITY : 0) +
    bicycles * BICYCLE

  useEffect(() => {
    if (!focusRequest) return
    const { target } = focusRequest
    if (target === "confirmation") {
      confirmationRef.current?.focus()
    } else if (target === "conditions") {
      conditionsRef.current?.focus()
    } else {
      document.getElementById(FIELD_IDS[target])?.focus()
    }
  }, [focusRequest])

  function clearError(key: FieldKey) {
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function setValue(key: TextField, value: string) {
    setValues((current) => ({ ...current, [key]: value }))
    clearError(key)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found: Errors = {}

    if (!values.p1First.trim()) found.p1First = FIRST_NAME_ERROR
    if (!values.p1Last.trim()) found.p1Last = LAST_NAME_ERROR

    const email = values.email.trim()
    if (!email) {
      found.email = "Write an email address for the boarding pass."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      found.email = "Check the email address: it needs an @ and a domain."
    }

    const phone = values.phone.trim()
    if (!phone) {
      found.phone = "Write a mobile number we can text on the day."
    } else if (
      !/^[\d\s+-]+$/.test(phone) ||
      phone.replace(/\D/g, "").length < 10
    ) {
      found.phone = "Check the mobile number: it needs at least 10 digits."
    }

    if (!values.p2First.trim()) found.p2First = FIRST_NAME_ERROR
    if (!values.p2Last.trim()) found.p2Last = LAST_NAME_ERROR

    if (!accepted) {
      found.conditions = "Tick the box to accept the conditions of carriage."
    }

    setErrors(found)
    const first = FIELD_ORDER.find((key) => found[key])
    setConfirmation(first ? null : { total, email })
    setFocusRequest((current) => ({
      target: first ?? "confirmation",
      send: (current?.send ?? 0) + 1,
    }))
  }

  const conditionsErrorId = "conditions-error"

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <Header />

      <main className="mx-auto max-w-[1120px] px-5">
        <section className="grid gap-5 pt-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className={MUTED_LABEL}>Step 2 of 3 · Passengers and extras</p>
            <h1 className="mt-2 text-h1">Who is travelling</h1>
            <p className="mt-3 max-w-xl">
              Write each name as it is on the passenger&apos;s photo ID. The
              lead passenger gets a text if the sailing changes.
            </p>
            <p className="mt-3">
              <a href="/results" className={TEXT_LINK}>
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
                className={CARD}
              >
                <p className={MUTED_LABEL}>Adult · Lead passenger</p>
                <h2 id="passenger-1-heading" className="mt-2 text-h2">
                  Passenger 1
                </h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <TextInput
                    id={FIELD_IDS.p1First}
                    label="First name"
                    autoComplete="given-name"
                    value={values.p1First}
                    onChange={(value) => setValue("p1First", value)}
                    error={errors.p1First}
                  />
                  <TextInput
                    id={FIELD_IDS.p1Last}
                    label="Last name"
                    autoComplete="family-name"
                    value={values.p1Last}
                    onChange={(value) => setValue("p1Last", value)}
                    error={errors.p1Last}
                  />
                </div>
                <div className="mt-5">
                  <TextInput
                    id={FIELD_IDS.email}
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(value) => setValue("email", value)}
                    helper="We send the boarding pass here."
                    error={errors.email}
                  />
                </div>
                <div className="mt-5">
                  <TextInput
                    id={FIELD_IDS.phone}
                    label="Mobile phone"
                    type="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={(value) => setValue("phone", value)}
                    helper="We text this number if the sailing is delayed or cancelled."
                    error={errors.phone}
                  />
                </div>
              </div>

              <div
                role="group"
                aria-labelledby="passenger-2-heading"
                className={`mt-5 ${CARD}`}
              >
                <p className={MUTED_LABEL}>Adult</p>
                <h2 id="passenger-2-heading" className="mt-2 text-h2">
                  Passenger 2
                </h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <TextInput
                    id={FIELD_IDS.p2First}
                    label="First name"
                    autoComplete="given-name"
                    value={values.p2First}
                    onChange={(value) => setValue("p2First", value)}
                    error={errors.p2First}
                  />
                  <TextInput
                    id={FIELD_IDS.p2Last}
                    label="Last name"
                    autoComplete="family-name"
                    value={values.p2Last}
                    onChange={(value) => setValue("p2Last", value)}
                    error={errors.p2Last}
                  />
                </div>
              </div>

              <div
                role="group"
                aria-labelledby="extras-heading"
                className={`mt-5 ${CARD}`}
              >
                <p className={MUTED_LABEL}>Optional</p>
                <h2 id="extras-heading" className="mt-2 text-h2">
                  Extras
                </h2>
                <ul className="mt-5 divide-y">
                  <li className="flex items-start justify-between gap-5 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <CheckboxRow
                        id="extra-car"
                        checked={car}
                        onCheckedChange={setCar}
                      >
                        A car up to 5 m long and 2 m high
                      </CheckboxRow>
                    </div>
                    <p className={PRICE_LABEL}>{pounds(CAR)}</p>
                  </li>
                  <li className="flex items-start justify-between gap-5 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <CheckboxRow
                        id="extra-lounge"
                        checked={lounge}
                        onCheckedChange={setLounge}
                      >
                        Seats in the quiet lounge for two
                      </CheckboxRow>
                    </div>
                    <p className={PRICE_LABEL}>{pounds(LOUNGE)}</p>
                  </li>
                  <li className="flex items-start justify-between gap-5 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <CheckboxRow
                        id="extra-priority"
                        checked={priority}
                        onCheckedChange={setPriority}
                      >
                        Priority boarding
                      </CheckboxRow>
                    </div>
                    <p className={PRICE_LABEL}>{pounds(PRIORITY)}</p>
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
                          onClick={() =>
                            setBicycles((count) => Math.max(0, count - 1))
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
                          {bicycleCount(bicycles)}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-md"
                          aria-label="More bicycles"
                          disabled={bicycles === MAX_BICYCLES}
                          focusableWhenDisabled
                          onClick={() =>
                            setBicycles((count) =>
                              Math.min(MAX_BICYCLES, count + 1)
                            )
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
                    <p className={PRICE_LABEL}>{pounds(BICYCLE)} each</p>
                  </li>
                </ul>
              </div>

              <div
                role="group"
                aria-labelledby="conditions-heading"
                className={`mt-5 ${CARD}`}
              >
                <p className={MUTED_LABEL}>Before you pay</p>
                <h2 id="conditions-heading" className="mt-2 text-h2">
                  Conditions
                </h2>
                <p className="mt-3 max-w-xl text-body">
                  Under the{" "}
                  <a href="#" className={TEXT_LINK}>
                    conditions of carriage
                  </a>
                  , a booking can be changed up to 24 hours before the sailing
                  for £10.00.
                </p>
                <div className="mt-5">
                  <CheckboxRow
                    id={FIELD_IDS.conditions}
                    checked={accepted}
                    onCheckedChange={(next) => {
                      setAccepted(next)
                      clearError("conditions")
                    }}
                    invalid={Boolean(errors.conditions)}
                    describedBy={
                      errors.conditions ? conditionsErrorId : undefined
                    }
                    checkboxRef={conditionsRef}
                  >
                    I have read the conditions of carriage and the fare rules.
                  </CheckboxRow>
                  {errors.conditions ? (
                    <ErrorLine id={conditionsErrorId}>
                      {errors.conditions}
                    </ErrorLine>
                  ) : null}
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
              {confirmation ? (
                <div className="mt-5">
                  <h2
                    ref={confirmationRef}
                    tabIndex={-1}
                    className="text-h2 focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:outline-solid"
                  >
                    Ready for payment
                  </h2>
                  <p className="mt-3 max-w-xl">
                    Your details are complete. The total to pay is{" "}
                    {pounds(confirmation.total)}, and the boarding pass goes to{" "}
                    {confirmation.email}.
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <aside
            aria-labelledby="fare-summary-heading"
            className={`lg:sticky lg:top-5 lg:col-span-4 ${CARD}`}
          >
            <p className={MUTED_LABEL}>Your sailing</p>
            <h2 id="fare-summary-heading" className="mt-2 text-h2">
              Fare summary
            </h2>
            <div className="mt-5 flex items-center gap-3">
              <div className="shrink-0">
                <p className="font-mono text-label text-foreground tabular-nums">
                  <time dateTime="09:15">09:15</time>
                </p>
                <p className={`mt-1 ${MUTED_LABEL}`}>Harrowmouth</p>
              </div>
              <div className="min-w-0 flex-1 text-center">
                <p className={MUTED_LABEL}>1 h 45 min</p>
                <div className="mt-1 h-px bg-border" aria-hidden="true" />
                <p className={`mt-1 ${MUTED_LABEL}`}>Direct</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-label text-foreground tabular-nums">
                  <time dateTime="11:00">11:00</time>
                </p>
                <p className={`mt-1 ${MUTED_LABEL}`}>Port Ellery</p>
              </div>
            </div>
            <p className={`mt-3 ${MUTED_LABEL}`}>
              <time dateTime="2026-12-19">Saturday 19 December 2026</time> · MV
              Isla Grey
            </p>
            <ul className="mt-5 divide-y">
              <SummaryRow name="Fare, 2 adults" pence={FARE} />
              {car ? <SummaryRow name="Car" pence={CAR} /> : null}
              {lounge ? (
                <SummaryRow name="Lounge seats" pence={LOUNGE} />
              ) : null}
              {priority ? (
                <SummaryRow name="Priority boarding" pence={PRIORITY} />
              ) : null}
              {bicycles > 0 ? (
                <SummaryRow
                  name={bicycleCount(bicycles)}
                  pence={bicycles * BICYCLE}
                />
              ) : null}
            </ul>
            <div className="mt-5 flex items-baseline justify-between gap-5 border-t pt-3">
              <p className="font-mono text-label text-foreground">Total</p>
              <p className="font-mono text-h2 text-foreground tabular-nums">
                {pounds(total)}
              </p>
            </div>
            <p className={`mt-3 ${MUTED_LABEL}`}>Includes port fees and VAT.</p>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function SummaryRow({ name, pence }: { name: string; pence: number }) {
  return (
    <li className="flex items-baseline justify-between gap-5 py-3 first:pt-0 last:pb-0">
      <span className="min-w-0 text-body">{name}</span>
      <span className={PRICE_LABEL}>{pounds(pence)}</span>
    </li>
  )
}

export default App
