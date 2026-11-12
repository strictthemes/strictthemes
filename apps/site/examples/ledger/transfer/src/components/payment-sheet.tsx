import { useEffect, useRef, useState, type ReactNode } from "react"
import { flushSync } from "react-dom"
import { CircleAlert } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { amountInWords, formatPounds, isAmountEmpty, parseAmount } from "@/lib/money"
import { cn } from "@/lib/utils"

// The sample's today: a fixed date, never the device clock.
const TODAY = "2026-11-27"
const LAST_DAY = "2027-01-26"
const LIMIT_PENCE = 1_000_000

const ACCOUNTS = [
  { id: "current", name: "Current account", short: "the current account", ending: "4417", available: 4_821_356 },
  { id: "reserve", name: "Tax reserve", short: "the tax reserve", ending: "8830", available: 1_369_071 },
]

const PAYEES = [
  { id: "copperleaf", name: "Copperleaf Paper Mill", sortCode: "40-11-62", account: "70119382" },
  { id: "brightwater", name: "Brightwater Inks", sortCode: "20-45-77", account: "53081146" },
  { id: "kestle", name: "Kestle Property Lettings", sortCode: "60-83-14", account: "11927405" },
  { id: "marlowe", name: "Marlowe Van Leasing", sortCode: "30-96-28", account: "84402613" },
]

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function dateParts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return { y, month: MONTHS[m - 1], d }
}
const shortDate = (iso: string) => {
  const { y, month, d } = dateParts(iso)
  return `${d} ${month.slice(0, 3)} ${y}`
}
const longDate = (iso: string) => {
  const { y, month, d } = dateParts(iso)
  return `${d} ${month} ${y}`
}

const accountLabel = (a: (typeof ACCOUNTS)[number]) => `${a.name} · ending ${a.ending}`
const payeeDetails = (p: (typeof PAYEES)[number]) => `Sort code ${p.sortCode} · Account ${p.account}`

type Field = "payee" | "amount" | "reference" | "date"
type Errors = Partial<Record<Field, string>>
type Values = { from: string; payee: string; amount: string; reference: string; date: string }

const EMPTY: Values = { from: "current", payee: "", amount: "", reference: "", date: TODAY }

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing = "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const labelClass = "font-mono text-label text-muted-foreground uppercase"
const smallFigure = "font-mono text-label text-muted-foreground tabular-nums"
const buttonClass = "px-4 font-mono text-label uppercase"
const selectClass = cn(
  "h-8 w-full rounded-lg border border-input bg-card px-2 text-body text-foreground aria-invalid:border-destructive",
  focusRing
)

function validate(v: Values): Errors {
  const errors: Errors = {}
  const account = ACCOUNTS.find((a) => a.id === v.from)!

  if (!v.payee) errors.payee = "Choose who to pay."

  const pence = parseAmount(v.amount)
  if (isAmountEmpty(v.amount)) errors.amount = "Enter an amount."
  else if (pence === null || pence === 0)
    errors.amount = "Enter an amount in pounds and pence, such as 240.50."
  else if (pence > account.available)
    errors.amount = `That is more than the ${formatPounds(account.available)} available in this account.`
  else if (pence > LIMIT_PENCE) errors.amount = "The most you can send in one payment is £10,000.00."

  const reference = v.reference.trim()
  if (!reference) errors.reference = "Enter a reference the payee will recognise."
  else if (reference.length > 18 || !/^[A-Za-z0-9 ]+$/.test(reference))
    errors.reference = "Use up to 18 letters, numbers and spaces."

  if (!v.date) errors.date = "Enter a date."
  else if (v.date < TODAY) errors.date = "Choose today or a later date."
  else if (v.date > LAST_DAY) errors.date = "Choose a date up to 26 January 2027."

  return errors
}

function ErrorLine({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-2 font-mono text-label text-destructive">
      <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

function FieldShell({
  id,
  label,
  helper,
  error,
  children,
}: {
  id: string
  label: string
  helper?: ReactNode
  error?: string
  children: ReactNode
}) {
  return (
    <div className="flex max-w-md flex-col gap-3">
      <label htmlFor={id} className={cn("block", labelClass)}>
        {label}
      </label>
      <div className="flex flex-col gap-2">
        {children}
        {helper ? (
          <p id={`${id}-helper`} className={smallFigure}>
            {helper}
          </p>
        ) : null}
        {error ? <ErrorLine id={`${id}-error`}>{error}</ErrorLine> : null}
      </div>
    </div>
  )
}

function describedBy(id: string, hasHelper: boolean, hasError: boolean) {
  const ids = [hasHelper && `${id}-helper`, hasError && `${id}-error`].filter(Boolean)
  return ids.length ? ids.join(" ") : undefined
}

type Step = "form" | "review" | "done"
type FocusTarget = "from" | "words" | "heading" | null

export function PaymentSheet({ className }: { className?: string }) {
  const [step, setStep] = useState<Step>("form")
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState<Values | null>(null)
  // Where focus goes once the next step has rendered.
  const focusTarget = useRef<FocusTarget>(null)

  const headingRef = useRef<HTMLHeadingElement>(null)
  const wordsRef = useRef<HTMLParagraphElement>(null)
  const fromRef = useRef<HTMLSelectElement>(null)
  const payeeRef = useRef<HTMLSelectElement>(null)
  const amountRef = useRef<HTMLInputElement>(null)
  const referenceRef = useRef<HTMLInputElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!focusTarget.current) return
    const el = { from: fromRef, words: wordsRef, heading: headingRef }[focusTarget.current].current
    focusTarget.current = null
    el?.focus()
  }, [step])

  const account = ACCOUNTS.find((a) => a.id === values.from)!
  const payee = PAYEES.find((p) => p.id === values.payee)

  function change(field: keyof Values, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
    setErrors((e) => {
      const next = { ...e }
      if (field !== "from") delete next[field]
      // The amount's error depends on the chosen account.
      if (field === "from") delete next.amount
      return next
    })
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(values)
    // Render the errors first, so the focused field already names its error.
    flushSync(() => setErrors(found))
    const order: [Field, React.RefObject<HTMLElement | null>][] = [
      ["payee", payeeRef],
      ["amount", amountRef],
      ["reference", referenceRef],
      ["date", dateRef],
    ]
    const first = order.find(([field]) => found[field])
    if (first) {
      first[1].current?.focus()
      return
    }
    setStep("review")
    focusTarget.current = "words"
  }

  function changeDetails() {
    setStep("form")
    focusTarget.current = "from"
  }

  function send() {
    setSent(values)
    setStep("done")
    focusTarget.current = "heading"
  }

  function startAgain() {
    setSent(null)
    setValues(EMPTY)
    setErrors({})
    setStep("form")
    focusTarget.current = "from"
  }

  const heading = { form: "Payment details", review: "Check the payment", done: "Payment recorded" }[step]
  const stepText = {
    form: "Step 1 of 3 · Details",
    review: "Step 2 of 3 · Review",
    done: "Step 3 of 3 · Done",
  }[step]

  const amountPence = parseAmount(values.amount) ?? 0
  const sentAccount = sent ? ACCOUNTS.find((a) => a.id === sent.from)! : null
  const sentPayee = sent ? PAYEES.find((p) => p.id === sent.payee)! : null
  const sentPence = sent ? (parseAmount(sent.amount) ?? 0) : 0

  return (
    <section
      aria-labelledby="payment-heading"
      className={cn("flex flex-col gap-3 rounded-xl border border-border bg-card p-6", className)}
    >
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
        <h2
          id="payment-heading"
          ref={headingRef}
          tabIndex={-1}
          className={cn(labelClass, codeFocusRing)}
        >
          {heading}
        </h2>
        <p className={smallFigure}>{stepText}</p>
      </div>

      <div>
        {step === "form" ? (
          <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
            <FieldShell id="from" label="From account" helper={`${formatPounds(account.available)} available`}>
              <select
                id="from"
                ref={fromRef}
                value={values.from}
                onChange={(e) => change("from", e.target.value)}
                aria-describedby="from-helper"
                className={selectClass}
              >
                {ACCOUNTS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {accountLabel(a)}
                  </option>
                ))}
              </select>
            </FieldShell>

            <FieldShell
              id="payee"
              label="Payee"
              helper={payee ? payeeDetails(payee) : undefined}
              error={errors.payee}
            >
              <select
                id="payee"
                ref={payeeRef}
                value={values.payee}
                onChange={(e) => change("payee", e.target.value)}
                aria-invalid={errors.payee ? true : undefined}
                aria-describedby={describedBy("payee", !!payee, !!errors.payee)}
                className={selectClass}
              >
                <option value="">Choose a payee</option>
                {PAYEES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </FieldShell>

            <FieldShell id="amount" label="Amount" helper="Up to £10,000.00 a payment." error={errors.amount}>
              <div className="flex w-48 items-center gap-2">
                <span className="font-mono text-label text-foreground tabular-nums" aria-hidden="true">
                  £
                </span>
                <Input
                  id="amount"
                  ref={amountRef}
                  inputMode="decimal"
                  autoComplete="off"
                  value={values.amount}
                  onChange={(e) => change("amount", e.target.value)}
                  aria-invalid={errors.amount ? true : undefined}
                  aria-describedby={describedBy("amount", true, !!errors.amount)}
                  className="text-right font-mono text-body tabular-nums md:text-body"
                />
              </div>
            </FieldShell>

            <FieldShell
              id="reference"
              label="Reference"
              helper="Up to 18 letters, numbers and spaces. The payee sees this."
              error={errors.reference}
            >
              <Input
                id="reference"
                ref={referenceRef}
                autoComplete="off"
                value={values.reference}
                onChange={(e) => change("reference", e.target.value)}
                aria-invalid={errors.reference ? true : undefined}
                aria-describedby={describedBy("reference", true, !!errors.reference)}
                className="text-body md:text-body"
              />
            </FieldShell>

            <FieldShell
              id="date"
              label="Pay on"
              helper="Today, or a later day up to and including 26 January 2027."
              error={errors.date}
            >
              <Input
                id="date"
                ref={dateRef}
                type="date"
                min={TODAY}
                max={LAST_DAY}
                value={values.date}
                onChange={(e) => change("date", e.target.value)}
                aria-invalid={errors.date ? true : undefined}
                aria-describedby={describedBy("date", true, !!errors.date)}
                className="text-body md:text-body"
              />
            </FieldShell>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" className={buttonClass}>
                Review payment
              </Button>
              <a href="/" className={cn(buttonVariants({ variant: "outline" }), buttonClass)}>
                Cancel
              </a>
            </div>
          </form>
        ) : null}

        {step === "review" && payee ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <p className={labelClass}>You are sending</p>
              <p className="font-heading text-h1 text-foreground tabular-nums">{formatPounds(amountPence)}</p>
              <p
                ref={wordsRef}
                tabIndex={-1}
                className={cn("max-w-lg text-body text-foreground", codeFocusRing)}
              >
                {amountInWords(amountPence)}
              </p>
            </div>

            <dl>
              {(
                [
                  ["From", <span className="text-body">{accountLabel(account)}</span>],
                  [
                    "To",
                    <span className="flex flex-col items-end gap-1">
                      <span className="text-body">{payee.name}</span>
                      <span className={smallFigure}>{payeeDetails(payee)}</span>
                    </span>,
                  ],
                  ["Reference", <span className="font-mono">{values.reference.trim()}</span>],
                  [
                    "Pay on",
                    <span className="font-mono tabular-nums">
                      {values.date === TODAY ? "Today, " : null}
                      <time dateTime={values.date}>{shortDate(values.date)}</time>
                    </span>,
                  ],
                  [
                    "Balance after",
                    <span className="font-mono tabular-nums">{formatPounds(account.available - amountPence)}</span>,
                  ],
                ] as const
              ).map(([term, detail], i) => (
                <div
                  key={term}
                  className={cn(
                    "flex items-baseline justify-between gap-3 py-2",
                    i > 0 && "border-t border-border"
                  )}
                >
                  <dt className={labelClass}>{term}</dt>
                  <dd className="text-right">{detail}</dd>
                </div>
              ))}
            </dl>

            <p className="max-w-lg text-body">
              Check the payee's details. A payment cannot be called back once it is sent.
            </p>

            <div className="flex flex-wrap gap-2">
              <Button className={buttonClass} onClick={send}>
                Send payment
              </Button>
              <Button variant="outline" className={buttonClass} onClick={changeDetails}>
                Change details
              </Button>
            </div>
          </div>
        ) : null}

        <div role="status">
          {step === "done" && sent && sentAccount && sentPayee ? (
            <div className="flex flex-col gap-3">
              <p className="font-heading text-h2 tabular-nums">
                {formatPounds(sentPence)} to {sentPayee.name}
              </p>
              <p className="max-w-lg text-body">
                From {sentAccount.short}, on {longDate(sent.date)}.
              </p>
              <p className="max-w-lg text-body">
                This is a demo: no money left the account and nothing was sent anywhere.
              </p>
            </div>
          ) : null}
        </div>

        {step === "done" ? (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button variant="secondary" className={buttonClass} onClick={startAgain}>
              Make another payment
            </Button>
            <a
              href="/"
              className={cn(
                "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                focusRing
              )}
            >
              Back to overview
            </a>
          </div>
        ) : null}
      </div>
    </section>
  )
}
