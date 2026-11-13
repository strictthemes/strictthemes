import * as React from "react"
import { CircleAlert } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/date-picker"
import {
  amountInWords,
  formatLongDate,
  formatMoney,
  formatShortDate,
  isoDate,
  sameDay,
} from "@/lib/format"
import { cn } from "@/lib/utils"

// The sample's today, fixed: never the device clock.
const TODAY = new Date(2026, 10, 27)
const LATEST = new Date(2027, 0, 26)
const LIMIT = 1_000_000 // pence: £10,000.00

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const CODE_FOCUS =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const LABEL = "font-mono text-label uppercase text-muted-foreground"
const SMALL = "font-mono text-label tabular-nums text-muted-foreground"
const BUTTON = "px-4 font-mono text-label uppercase"
const TEXT_LINK = `text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground ${FOCUS}`
const CONTAINER = "mx-auto w-full max-w-[1200px] px-4 md:px-6"

const NAV = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Invoices", href: "/invoice" },
  { label: "Payments", href: "/payment" },
  { label: "Reports", href: "/report" },
]
const CURRENT = "/payment"

type Account = {
  value: string
  label: string
  inSentence: string
  balance: number
}

const ACCOUNTS: Account[] = [
  {
    value: "current",
    label: "Current account · ending 4417",
    inSentence: "the current account",
    balance: 4_821_356,
  },
  {
    value: "reserve",
    label: "Tax reserve · ending 8830",
    inSentence: "the tax reserve",
    balance: 1_369_071,
  },
]

type Payee = {
  value: string
  label: string
  sortCode: string
  account: string
}

const PAYEES: Payee[] = [
  {
    value: "copperleaf",
    label: "Copperleaf Paper Mill",
    sortCode: "40-11-62",
    account: "70119382",
  },
  {
    value: "brightwater",
    label: "Brightwater Inks",
    sortCode: "20-45-17",
    account: "53817204",
  },
  {
    value: "kestle",
    label: "Kestle Property Lettings",
    sortCode: "30-92-08",
    account: "11640395",
  },
  {
    value: "marlowe",
    label: "Marlowe Van Leasing",
    sortCode: "60-83-41",
    account: "92054718",
  },
]

const accountItems = ACCOUNTS.map(({ value, label }) => ({ value, label }))
const payeeItems = PAYEES.map(({ value, label }) => ({ value, label }))

const findAccount = (value: string) =>
  ACCOUNTS.find((a) => a.value === value) ?? ACCOUNTS[0]
const findPayee = (value: string | null) =>
  PAYEES.find((p) => p.value === value)
const payeeDetails = (p: Payee) =>
  `Sort code ${p.sortCode} · Account ${p.account}`

type Field = "payee" | "amount" | "reference"
type Errors = Partial<Record<Field, string>>

/** Pence from what was typed, or null when it is not an amount. */
function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/[\s,]/g, "").replace(/^£/, "")
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(cleaned)
  if (!match) return null
  const pence = Number(match[1]) * 100 + Number((match[2] ?? "").padEnd(2, "0"))
  return Number.isSafeInteger(pence) ? pence : null
}

type Payment = {
  account: Account
  payee: Payee
  pence: number
  reference: string
  date: Date
}

type Step = "form" | "review" | "done"
type FocusTarget = "from" | "words" | "heading" | Field

const HEADINGS: Record<Step, string> = {
  form: "Payment details",
  review: "Check the payment",
  done: "Payment recorded",
}
const STEPS: Record<Step, string> = {
  form: "Step 1 of 3 · Details",
  review: "Step 2 of 3 · Review",
  done: "Step 3 of 3 · Done",
}

function ErrorLine({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="flex items-start gap-2 font-mono text-label text-destructive">
      <CircleAlert aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0" />
      <span>{children}</span>
    </p>
  )
}

function describedBy(...ids: (string | false | undefined)[]) {
  return ids.filter(Boolean).join(" ") || undefined
}

function Header() {
  const [open, setOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  const links = (mobile: boolean) =>
    NAV.map((link) => {
      const current = link.href === CURRENT
      return (
        <li key={link.href}>
          <a
            href={link.href}
            aria-current={current ? "page" : undefined}
            className={cn(
              "font-mono text-label uppercase transition-colors duration-150",
              FOCUS,
              mobile && "block py-2",
              current
                ? "text-foreground underline underline-offset-4"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {link.label}
          </a>
        </li>
      )
    })

  return (
    <header
      className="border-b border-border"
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          setOpen(false)
          buttonRef.current?.focus()
        }
      }}
    >
      <div className={cn(CONTAINER, "flex items-center gap-6 py-4")}>
        <a href="/" className={cn("font-heading text-h2 text-foreground", FOCUS)}>
          Fairhold
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">{links(false)}</ul>
        </nav>
        <p className={cn(SMALL, "ml-auto hidden md:block")}>Hollis &amp; Vane</p>
        <Button
          ref={buttonRef}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
          className={cn(BUTTON, "ml-auto md:hidden")}
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <div className={CONTAINER}>
          <ul className="py-2">{links(true)}</ul>
        </div>
      </nav>
    </header>
  )
}

function PaymentSheet() {
  const [step, setStep] = React.useState<Step>("form")
  const [from, setFrom] = React.useState(ACCOUNTS[0].value)
  const [payee, setPayee] = React.useState<string | null>(null)
  const [amount, setAmount] = React.useState("")
  const [reference, setReference] = React.useState("")
  const [date, setDate] = React.useState(TODAY)
  const [errors, setErrors] = React.useState<Errors>({})
  const [review, setReview] = React.useState<Payment | null>(null)
  const [sent, setSent] = React.useState<Payment | null>(null)
  const [focus, setFocus] = React.useState<{ target: FocusTarget } | null>(null)

  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const fromRef = React.useRef<HTMLButtonElement>(null)
  const payeeRef = React.useRef<HTMLButtonElement>(null)
  const amountRef = React.useRef<HTMLInputElement>(null)
  const referenceRef = React.useRef<HTMLInputElement>(null)
  const wordsRef = React.useRef<HTMLParagraphElement>(null)

  React.useEffect(() => {
    if (!focus) return
    const targets: Record<FocusTarget, React.RefObject<HTMLElement | null>> = {
      from: fromRef,
      payee: payeeRef,
      amount: amountRef,
      reference: referenceRef,
      words: wordsRef,
      heading: headingRef,
    }
    targets[focus.target].current?.focus()
  }, [focus])

  const account = findAccount(from)
  const chosenPayee = findPayee(payee)

  const clearError = (...fields: Field[]) =>
    setErrors((current) => {
      if (!fields.some((f) => current[f])) return current
      const next = { ...current }
      for (const f of fields) delete next[f]
      return next
    })

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const typedAmount = amount.trim()
    const typedReference = reference.trim()
    setAmount(typedAmount)
    setReference(typedReference)

    const next: Errors = {}
    if (!chosenPayee) next.payee = "Choose who to pay."

    const pence = parseAmount(typedAmount)
    if (!typedAmount) next.amount = "Enter an amount."
    else if (pence === null || pence === 0)
      next.amount = "Enter an amount in pounds and pence, such as 240.50."
    else if (pence > account.balance)
      next.amount = `That is more than the ${formatMoney(account.balance)} available in this account.`
    else if (pence > LIMIT)
      next.amount = "The most you can send in one payment is £10,000.00."

    if (!typedReference) next.reference = "Enter a reference the payee will recognise."
    else if (typedReference.length > 18 || !/^[A-Za-z0-9 ]+$/.test(typedReference))
      next.reference = "Use up to 18 letters, numbers and spaces."

    setErrors(next)
    const first = (["payee", "amount", "reference"] as Field[]).find((f) => next[f])
    if (first) {
      setFocus({ target: first })
      return
    }
    setReview({
      account,
      payee: chosenPayee!,
      pence: pence!,
      reference: typedReference,
      date,
    })
    setStep("review")
    setFocus({ target: "words" })
  }

  function changeDetails() {
    setStep("form")
    setFocus({ target: "from" })
  }

  function send() {
    setSent(review)
    setReview(null)
    setStep("done")
    setFocus({ target: "heading" })
  }

  function startAgain() {
    setSent(null)
    setFrom(ACCOUNTS[0].value)
    setPayee(null)
    setAmount("")
    setReference("")
    setDate(TODAY)
    setErrors({})
    setStep("form")
    setFocus({ target: "from" })
  }

  return (
    <section
      aria-labelledby="payment-heading"
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 lg:col-span-8"
    >
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
        <h2
          id="payment-heading"
          ref={headingRef}
          tabIndex={-1}
          className={cn(LABEL, CODE_FOCUS)}
        >
          {HEADINGS[step]}
        </h2>
        <p className={SMALL}>{STEPS[step]}</p>
      </div>

      <div>
        {step === "form" && (
          <form noValidate onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex max-w-md flex-col gap-3">
              <label id="from-label" htmlFor="from" className={cn("block", LABEL)}>
                From account
              </label>
              <div className="flex flex-col gap-2">
                <Select
                  items={accountItems}
                  value={from}
                  onValueChange={(value) => {
                    if (value === null) return
                    setFrom(value)
                    clearError("amount")
                  }}
                >
                  <SelectTrigger
                    id="from"
                    ref={fromRef}
                    aria-labelledby="from-label"
                    aria-describedby="from-help"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNTS.map((a) => (
                      <SelectItem key={a.value} value={a.value}>
                        {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p id="from-help" className={SMALL}>
                  {formatMoney(account.balance)} available
                </p>
              </div>
            </div>

            <div className="flex max-w-md flex-col gap-3">
              <label id="payee-label" htmlFor="payee" className={cn("block", LABEL)}>
                Payee
              </label>
              <div className="flex flex-col gap-2">
                <Select
                  items={payeeItems}
                  value={payee}
                  onValueChange={(value) => {
                    if (value === null) return
                    setPayee(value)
                    clearError("payee")
                  }}
                >
                  <SelectTrigger
                    id="payee"
                    ref={payeeRef}
                    aria-labelledby="payee-label"
                    aria-invalid={errors.payee ? true : undefined}
                    aria-describedby={describedBy(
                      chosenPayee && "payee-help",
                      errors.payee && "payee-error"
                    )}
                  >
                    <SelectValue placeholder="Choose a payee" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYEES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {chosenPayee && (
                  <p id="payee-help" className={SMALL}>
                    {payeeDetails(chosenPayee)}
                  </p>
                )}
                {errors.payee && <ErrorLine id="payee-error">{errors.payee}</ErrorLine>}
              </div>
            </div>

            <div className="flex max-w-md flex-col gap-3">
              <label htmlFor="amount" className={cn("block", LABEL)}>
                Amount
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex w-48 items-center gap-2">
                  <span className={cn(SMALL, "text-foreground")}>£</span>
                  <Input
                    id="amount"
                    ref={amountRef}
                    inputMode="decimal"
                    autoComplete="off"
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value)
                      clearError("amount")
                    }}
                    aria-invalid={errors.amount ? true : undefined}
                    aria-describedby={describedBy(
                      "amount-help",
                      errors.amount && "amount-error"
                    )}
                    className="px-2 text-right font-mono text-body tabular-nums md:text-body"
                  />
                </div>
                <p id="amount-help" className={SMALL}>
                  Up to £10,000.00 a payment.
                </p>
                {errors.amount && <ErrorLine id="amount-error">{errors.amount}</ErrorLine>}
              </div>
            </div>

            <div className="flex max-w-md flex-col gap-3">
              <label htmlFor="reference" className={cn("block", LABEL)}>
                Reference
              </label>
              <div className="flex flex-col gap-2">
                <Input
                  id="reference"
                  ref={referenceRef}
                  autoComplete="off"
                  value={reference}
                  onChange={(event) => {
                    setReference(event.target.value)
                    clearError("reference")
                  }}
                  aria-invalid={errors.reference ? true : undefined}
                  aria-describedby={describedBy(
                    "reference-help",
                    errors.reference && "reference-error"
                  )}
                  className="px-2 text-body md:text-body"
                />
                <p id="reference-help" className={SMALL}>
                  Up to 18 letters, numbers and spaces. The payee sees this.
                </p>
                {errors.reference && (
                  <ErrorLine id="reference-error">{errors.reference}</ErrorLine>
                )}
              </div>
            </div>

            <div className="flex max-w-md flex-col gap-3">
              <label id="payon-label" htmlFor="payon" className={cn("block", LABEL)}>
                Pay on
              </label>
              <div className="flex flex-col gap-2">
                <DatePicker
                  id="payon"
                  labelId="payon-label"
                  describedBy="payon-help"
                  value={date}
                  onChange={setDate}
                  today={TODAY}
                  latest={LATEST}
                />
                <p id="payon-help" className={SMALL}>
                  Today, or a later day up to and including 26 January 2027.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" className={BUTTON}>
                Review payment
              </Button>
              <a href="/" className={cn(buttonVariants({ variant: "outline" }), BUTTON)}>
                Cancel
              </a>
            </div>
          </form>
        )}

        {step === "review" && review && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <p className={LABEL}>You are sending</p>
              <p className="font-heading text-h1 tabular-nums text-foreground">
                {formatMoney(review.pence)}
              </p>
              <p
                ref={wordsRef}
                tabIndex={-1}
                className={cn("max-w-lg text-body text-foreground", CODE_FOCUS)}
              >
                {amountInWords(review.pence)}
              </p>
            </div>

            <dl>
              {[
                {
                  term: "From",
                  detail: <span className="text-body">{review.account.label}</span>,
                },
                {
                  term: "To",
                  detail: (
                    <span className="flex flex-col items-end gap-1">
                      <span className="text-body">{review.payee.label}</span>
                      <span className={SMALL}>{payeeDetails(review.payee)}</span>
                    </span>
                  ),
                },
                {
                  term: "Reference",
                  detail: (
                    <span className="font-mono wrap-break-word">{review.reference}</span>
                  ),
                },
                {
                  term: "Pay on",
                  detail: (
                    <span className="font-mono tabular-nums">
                      {sameDay(review.date, TODAY) && "Today, "}
                      <time dateTime={isoDate(review.date)}>
                        {formatShortDate(review.date)}
                      </time>
                    </span>
                  ),
                },
                {
                  term: "Balance after",
                  detail: (
                    <span className="font-mono tabular-nums">
                      {formatMoney(review.account.balance - review.pence)}
                    </span>
                  ),
                },
              ].map((row, index) => (
                <div
                  key={row.term}
                  className={cn(
                    "flex items-baseline justify-between gap-3 py-2",
                    index > 0 && "border-t border-border"
                  )}
                >
                  <dt className={LABEL}>{row.term}</dt>
                  <dd className="min-w-0 text-right">{row.detail}</dd>
                </div>
              ))}
            </dl>

            <p className="max-w-lg text-body text-foreground">
              Check the payee's details. A payment cannot be called back once it is
              sent.
            </p>

            <div className="flex flex-wrap gap-2">
              <Button className={BUTTON} onClick={send}>
                Send payment
              </Button>
              <Button variant="outline" className={BUTTON} onClick={changeDetails}>
                Change details
              </Button>
            </div>
          </div>
        )}

        <div role="status">
          {sent && (
            <div className="flex flex-col gap-3">
              <p className="font-heading text-h2 tabular-nums">
                {formatMoney(sent.pence)} to {sent.payee.label}
              </p>
              <p className="max-w-lg text-body text-foreground">
                From {sent.account.inSentence}, on {formatLongDate(sent.date)}.
              </p>
              <p className="max-w-lg text-body text-foreground">
                This is a demo: no money left the account and nothing was sent
                anywhere.
              </p>
            </div>
          )}
        </div>

        {sent && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button variant="secondary" className={BUTTON} onClick={startAgain}>
              Make another payment
            </Button>
            <a href="/" className={TEXT_LINK}>
              Back to overview
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

function GoodToKnow() {
  return (
    <section
      aria-labelledby="good-to-know"
      className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-4"
    >
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-3 border-b border-border px-6 pt-6 pb-3">
        <h2 id="good-to-know" className={LABEL}>
          Good to know
        </h2>
      </div>
      <ul>
        <li className="px-6 py-3">
          <p className="max-w-lg text-body text-foreground">
            Payments for today go out within two hours. Payments for a later day go
            out at 06:00 on that day.
          </p>
        </li>
        <li className="border-t border-border px-6 py-3">
          <p className="max-w-lg text-body text-foreground">
            You can send up to £10,000.00 in one payment.
          </p>
        </li>
      </ul>
    </section>
  )
}

export function App() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />
      <main className="flex-1 py-6 md:py-12">
        <div className={cn(CONTAINER, "flex flex-col gap-6")}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className={LABEL}>Payments</p>
              <h1 className="text-h1">Make a payment</h1>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <PaymentSheet />
            <GoodToKnow />
          </div>
        </div>
      </main>
      <footer className="border-t border-border">
        <div className={cn(CONTAINER, "py-6")}>
          <p className={SMALL}>Fairhold · A demo. No money moves. · 2026</p>
        </div>
      </footer>
    </div>
  )
}

export default App
