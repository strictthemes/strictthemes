import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from "react"
import { CircleAlert, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const headerLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const inputClasses =
  "mt-2 h-auto rounded-md border-muted-foreground px-3 py-2 text-body md:text-body"
const buttonClasses = "h-auto rounded-md px-5 py-2 font-mono text-label"

const FARE = 7800
const EXTRAS = {
  car: { name: "Car", price: 4600 },
  lounge: { name: "Lounge seats", price: 2400 },
  priority: { name: "Priority boarding", price: 800 },
}
const BICYCLE = 600
const MAX_BICYCLES = 2

type FieldKey =
  "p1First" | "p1Last" | "email" | "phone" | "p2First" | "p2Last" | "conditions"

type Errors = Partial<Record<FieldKey, string>>

const FIELD_ORDER: FieldKey[] = [
  "p1First",
  "p1Last",
  "email",
  "phone",
  "p2First",
  "p2Last",
  "conditions",
]

function formatPrice(pence: number) {
  return `£${(pence / 100).toFixed(2)}`
}

function bicycles(count: number) {
  return `${count} ${count === 1 ? "bicycle" : "bicycles"}`
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
      <span>{children}</span>
    </p>
  )
}

type TextFieldProps = {
  id: FieldKey
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  help?: string
  type?: string
  autoComplete: string
  inputRef: RefObject<HTMLInputElement | null>
}

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  help,
  type = "text",
  autoComplete,
  inputRef,
}: TextFieldProps) {
  const helpId = `${id}-help`
  const errorId = `${id}-error`
  const describedBy = [help ? helpId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ")

  return (
    <div>
      <label
        htmlFor={id}
        className="block font-mono text-label text-foreground"
      >
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
        aria-describedby={describedBy || undefined}
        className={inputClasses}
      />
      {help ? (
        <p
          id={helpId}
          className="mt-2 font-mono text-label text-muted-foreground"
        >
          {help}
        </p>
      ) : null}
      {error ? <ErrorLine id={errorId}>{error}</ErrorLine> : null}
    </div>
  )
}

type ExtraRowProps = {
  id: string
  label: string
  price: number
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

function ExtraRow({
  id,
  label,
  price,
  checked,
  onCheckedChange,
}: ExtraRowProps) {
  return (
    <li className="flex items-start justify-between gap-5 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <div className="flex items-start gap-3">
          <Checkbox
            id={id}
            aria-labelledby={`${id}-label`}
            checked={checked}
            onCheckedChange={(value) => onCheckedChange(value === true)}
            className="mt-0.5"
          />
          <label
            id={`${id}-label`}
            htmlFor={id}
            className="text-body text-foreground"
          >
            {label}
          </label>
        </div>
      </div>
      <p className="mt-1 shrink-0 font-mono text-label text-foreground tabular-nums">
        {formatPrice(price)}
      </p>
    </li>
  )
}

type Confirmation = { total: number; email: string }

export function App() {
  const [p1First, setP1First] = useState("")
  const [p1Last, setP1Last] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [p2First, setP2First] = useState("")
  const [p2Last, setP2Last] = useState("")
  const [car, setCar] = useState(false)
  const [lounge, setLounge] = useState(false)
  const [priority, setPriority] = useState(false)
  const [bikeCount, setBikeCount] = useState(0)
  const [accepted, setAccepted] = useState(false)

  const [errors, setErrors] = useState<Errors>({})
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
  const [focusRequest, setFocusRequest] = useState<{
    target: FieldKey | "confirmation"
    n: number
  } | null>(null)

  const p1FirstRef = useRef<HTMLInputElement>(null)
  const p1LastRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const p2FirstRef = useRef<HTMLInputElement>(null)
  const p2LastRef = useRef<HTMLInputElement>(null)
  const conditionsRef = useRef<HTMLSpanElement>(null)
  const confirmationRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!focusRequest) return
    if (focusRequest.target === "confirmation") {
      confirmationRef.current?.focus()
    } else {
      const refs = {
        p1First: p1FirstRef,
        p1Last: p1LastRef,
        email: emailRef,
        phone: phoneRef,
        p2First: p2FirstRef,
        p2Last: p2LastRef,
        conditions: conditionsRef,
      }
      refs[focusRequest.target].current?.focus()
    }
  }, [focusRequest])

  const clearError = (key: FieldKey) => {
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const textHandler =
    (key: FieldKey, setter: (value: string) => void) => (value: string) => {
      setter(value)
      clearError(key)
    }

  const rows: { name: string; price: number }[] = [
    { name: "Fare, 2 adults", price: FARE },
  ]
  if (car) rows.push(EXTRAS.car)
  if (lounge) rows.push(EXTRAS.lounge)
  if (priority) rows.push(EXTRAS.priority)
  if (bikeCount > 0)
    rows.push({ name: bicycles(bikeCount), price: bikeCount * BICYCLE })
  const total = rows.reduce((sum, row) => sum + row.price, 0)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Errors = {}

    if (!p1First.trim())
      next.p1First =
        "Write the first name as it is on the passenger's photo ID."
    if (!p1Last.trim())
      next.p1Last = "Write the last name as it is on the passenger's photo ID."

    const emailValue = email.trim()
    if (!emailValue)
      next.email = "Write an email address for the boarding pass."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue))
      next.email = "Check the email address: it needs an @ and a domain."

    const phoneValue = phone.trim()
    if (!phoneValue)
      next.phone = "Write a mobile number we can text on the day."
    else if (
      /[^\d\s+-]/.test(phoneValue) ||
      phoneValue.replace(/\D/g, "").length < 10
    )
      next.phone = "Check the mobile number: it needs at least 10 digits."

    if (!p2First.trim())
      next.p2First =
        "Write the first name as it is on the passenger's photo ID."
    if (!p2Last.trim())
      next.p2Last = "Write the last name as it is on the passenger's photo ID."

    if (!accepted)
      next.conditions = "Tick the box to accept the conditions of carriage."

    setErrors(next)
    const first = FIELD_ORDER.find((key) => next[key])
    if (first) {
      setConfirmation(null)
      setFocusRequest((current) => ({
        target: first,
        n: (current?.n ?? 0) + 1,
      }))
    } else {
      setConfirmation({ total, email: emailValue })
      setFocusRequest((current) => ({
        target: "confirmation",
        n: (current?.n ?? 0) + 1,
      }))
    }
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-2 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <a href="/" className={cn("font-heading text-h2", headerLink)}>
            Kestrel Ferries
          </a>
          <nav aria-label="Main">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              <li>
                <a
                  href="/"
                  aria-current="true"
                  className={cn("text-body underline", headerLink)}
                >
                  Book
                </a>
              </li>
              <li>
                <a href="/departures" className={cn("text-body", headerLink)}>
                  Departures
                </a>
              </li>
              <li>
                <a href="/ticket" className={cn("text-body", headerLink)}>
                  My booking
                </a>
              </li>
              <li>
                <a href="#" className={cn("text-body", headerLink)}>
                  Help
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-5">
        <section className="grid grid-cols-1 gap-5 pt-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="font-mono text-label text-muted-foreground">
              Step 2 of 3 · Passengers and extras
            </p>
            <h1 className="mt-2 text-h1">Who is travelling</h1>
            <p className="mt-3 max-w-xl">
              Write each name exactly as it is on the passenger's photo ID. If
              the sailing changes, we text the lead passenger.
            </p>
            <p className="mt-3 max-w-xl">
              <a href="/results" className={textLink}>
                Back to sailings
              </a>
            </p>
          </div>
        </section>

        <section className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
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
                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <TextField
                    id="p1First"
                    label="First name"
                    autoComplete="given-name"
                    value={p1First}
                    onChange={textHandler("p1First", setP1First)}
                    error={errors.p1First}
                    inputRef={p1FirstRef}
                  />
                  <TextField
                    id="p1Last"
                    label="Last name"
                    autoComplete="family-name"
                    value={p1Last}
                    onChange={textHandler("p1Last", setP1Last)}
                    error={errors.p1Last}
                    inputRef={p1LastRef}
                  />
                </div>
                <div className="mt-5">
                  <TextField
                    id="email"
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={textHandler("email", setEmail)}
                    error={errors.email}
                    help="We send the boarding pass here."
                    inputRef={emailRef}
                  />
                </div>
                <div className="mt-5">
                  <TextField
                    id="phone"
                    label="Mobile phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={textHandler("phone", setPhone)}
                    error={errors.phone}
                    help="We text this number if the sailing is delayed or cancelled."
                    inputRef={phoneRef}
                  />
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
                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <TextField
                    id="p2First"
                    label="First name"
                    autoComplete="given-name"
                    value={p2First}
                    onChange={textHandler("p2First", setP2First)}
                    error={errors.p2First}
                    inputRef={p2FirstRef}
                  />
                  <TextField
                    id="p2Last"
                    label="Last name"
                    autoComplete="family-name"
                    value={p2Last}
                    onChange={textHandler("p2Last", setP2Last)}
                    error={errors.p2Last}
                    inputRef={p2LastRef}
                  />
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
                  <ExtraRow
                    id="extra-car"
                    label="A car up to 5 m long and 2 m high"
                    price={EXTRAS.car.price}
                    checked={car}
                    onCheckedChange={setCar}
                  />
                  <ExtraRow
                    id="extra-lounge"
                    label="Seats in the quiet lounge for two"
                    price={EXTRAS.lounge.price}
                    checked={lounge}
                    onCheckedChange={setLounge}
                  />
                  <ExtraRow
                    id="extra-priority"
                    label="Priority boarding"
                    price={EXTRAS.priority.price}
                    checked={priority}
                    onCheckedChange={setPriority}
                  />
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
                          disabled={bikeCount === 0}
                          focusableWhenDisabled
                          onClick={() =>
                            setBikeCount((n) => Math.max(0, n - 1))
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
                          {bicycles(bikeCount)}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-md"
                          aria-label="More bicycles"
                          disabled={bikeCount === MAX_BICYCLES}
                          focusableWhenDisabled
                          onClick={() =>
                            setBikeCount((n) => Math.min(MAX_BICYCLES, n + 1))
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
                      {formatPrice(BICYCLE)} each
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
                <p className="mt-3 max-w-xl">
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
                      ref={conditionsRef}
                      id="conditions"
                      aria-labelledby="conditions-label"
                      aria-invalid={errors.conditions ? true : undefined}
                      aria-describedby={
                        errors.conditions ? "conditions-error" : undefined
                      }
                      checked={accepted}
                      onCheckedChange={(value) => {
                        setAccepted(value === true)
                        clearError("conditions")
                      }}
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
                  {errors.conditions ? (
                    <ErrorLine id="conditions-error">
                      {errors.conditions}
                    </ErrorLine>
                  ) : null}
                </div>
              </div>

              <div className="mt-5">
                <Button type="submit" className={buttonClasses}>
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
                    className={cn("text-h2", codeFocusRing)}
                  >
                    Ready for payment
                  </h2>
                  <p className="mt-3 max-w-xl wrap-break-word">
                    Your details are complete. The total to pay is{" "}
                    {formatPrice(confirmation.total)}, and the boarding pass
                    goes to {confirmation.email}.
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <aside
            aria-labelledby="summary-heading"
            className="rounded-xl border bg-card p-5 lg:sticky lg:top-5 lg:col-span-4 lg:col-start-9"
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
              {rows.map((row) => (
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
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">Kestrel Ferries</p>
              <p className="mt-2 max-w-xl">
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
