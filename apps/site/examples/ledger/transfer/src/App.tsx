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
  parseAmount,
  sameDay,
} from "@/format"
import { cn } from "@/lib/utils"

// The sample's today: Friday 27 November 2026, never the device clock.
const TODAY = new Date(2026, 10, 27)
const LAST_DAY = new Date(2027, 0, 26)
const LIMIT = 1_000_000 // £10,000.00 in pence

const ACCOUNTS = [
  {
    value: "current",
    label: "Current account · ending 4417",
    inSentence: "the current account",
    available: 4_821_356,
  },
  {
    value: "tax",
    label: "Tax reserve · ending 8830",
    inSentence: "the tax reserve",
    available: 1_369_071,
  },
]

const PAYEES = [
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

const NAV = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Invoices", href: "/invoice" },
  { label: "Payments", href: "/payment" },
  { label: "Reports", href: "/report" },
]
const CURRENT_PATH = "/payment"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const buttonText = "px-4 font-mono text-label uppercase"
const labelText = "font-mono text-label uppercase text-muted-foreground"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"

type Errors = { payee?: string; amount?: string; reference?: string }

type Payment = {
  account: (typeof ACCOUNTS)[number]
  payee: (typeof PAYEES)[number]
  pence: number
  reference: string
  date: Date
}

type Step = "form" | "review" | "done"
type FocusTarget = "from" | "payee" | "amount" | "reference" | "words" | "heading"

const STEPS: Record<Step, { heading: string; figure: string }> = {
  form: { heading: "Payment details", figure: "Step 1 of 3 · Details" },
  review: { heading: "Check the payment", figure: "Step 2 of 3 · Review" },
  done: { heading: "Payment recorded", figure: "Step 3 of 3 · Done" },
}

function payeeDetails(payee: (typeof PAYEES)[number]) {
  return `Sort code ${payee.sortCode} · Account ${payee.account}`
}

function describedBy(...ids: (string | false | undefined)[]) {
  const list = ids.filter(Boolean).join(" ")
  return list || undefined
}

function ErrorLine({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-2 font-mono text-label text-destructive">
      <CircleAlert aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0" />
      <span>{children}</span>
    </p>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false)

  const navLink = (href: string) =>
    cn(
      "font-mono text-label uppercase transition-colors duration-150",
      focusRing,
      href === CURRENT_PATH
        ? "text-foreground underline underline-offset-4"
        : "text-muted-foreground hover:text-foreground"
    )

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-[1200px] items-center gap-6 px-4 py-4 md:px-6">
        <a href="/" className={cn("font-heading text-h2 text-foreground", focusRing)}>
          Fairhold
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.href === CURRENT_PATH ? "page" : undefined}
                  className={navLink(item.href)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={cn("ml-auto hidden md:block", smallFigure)}>Hollis &amp; Vane</p>
        <Button
          variant="outline"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
          className={cn(buttonText, "ml-auto md:hidden")}
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!menuOpen}
        className="border-t border-border md:hidden"
      >
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
          <ul className="py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.href === CURRENT_PATH ? "page" : undefined}
                  className={cn("block py-2", navLink(item.href))}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
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
  const [payment, setPayment] = React.useState<Payment | null>(null)
  const [focusTarget, setFocusTarget] = React.useState<{ target: FocusTarget } | null>(
    null
  )

  const fromRef = React.useRef<HTMLButtonElement>(null)
  const payeeRef = React.useRef<HTMLButtonElement>(null)
  const amountRef = React.useRef<HTMLInputElement>(null)
  const referenceRef = React.useRef<HTMLInputElement>(null)
  const wordsRef = React.useRef<HTMLParagraphElement>(null)
  const headingRef = React.useRef<HTMLHeadingElement>(null)

  React.useEffect(() => {
    if (!focusTarget) return
    const refs = {
      from: fromRef,
      payee: payeeRef,
      amount: amountRef,
      reference: referenceRef,
      words: wordsRef,
      heading: headingRef,
    }
    refs[focusTarget.target].current?.focus()
  }, [focusTarget])

  const account = ACCOUNTS.find((a) => a.value === from) ?? ACCOUNTS[0]
  const chosenPayee = PAYEES.find((p) => p.value === payee)

  function clearError(...keys: (keyof Errors)[]) {
    setErrors((current) => {
      if (!keys.some((key) => current[key])) return current
      const next = { ...current }
      for (const key of keys) delete next[key]
      return next
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Errors = {}

    if (!chosenPayee) next.payee = "Choose who to pay."

    const pence = parseAmount(amount)
    if (pence === "empty") next.amount = "Enter an amount."
    else if (pence === "invalid")
      next.amount = "Enter an amount in pounds and pence, such as 240.50."
    else if (pence > account.available)
      next.amount = `That is more than the ${formatMoney(account.available)} available in this account.`
    else if (pence > LIMIT)
      next.amount = "The most you can send in one payment is £10,000.00."

    const ref = reference.trim()
    if (ref === "") next.reference = "Enter a reference the payee will recognise."
    else if (ref.length > 18 || !/^[A-Za-z0-9 ]+$/.test(ref))
      next.reference = "Use up to 18 letters, numbers and spaces."

    setErrors(next)
    const first = (["payee", "amount", "reference"] as const).find((key) => next[key])
    if (first) {
      setFocusTarget({ target: first })
      return
    }
    if (!chosenPayee || typeof pence !== "number") return

    setPayment({ account, payee: chosenPayee, pence, reference: ref, date })
    setStep("review")
    setFocusTarget({ target: "words" })
  }

  function changeDetails() {
    setStep("form")
    setFocusTarget({ target: "from" })
  }

  function sendPayment() {
    setStep("done")
    setFocusTarget({ target: "heading" })
  }

  function makeAnother() {
    setFrom(ACCOUNTS[0].value)
    setPayee(null)
    setAmount("")
    setReference("")
    setDate(TODAY)
    setErrors({})
    setPayment(null)
    setStep("form")
    setFocusTarget({ target: "from" })
  }

  const fieldClass = "flex max-w-md flex-col gap-3"
  const fieldLabel = cn("block", labelText)
  const inputClass = "px-2 text-body md:text-body"

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
          className={cn(labelText, codeFocusRing)}
        >
          {STEPS[step].heading}
        </h2>
        <p className={smallFigure}>{STEPS[step].figure}</p>
      </div>

      <div>
        {step === "form" && (
          <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className={fieldClass}>
              <label htmlFor="from" className={fieldLabel}>
                From account
              </label>
              <div className="flex flex-col gap-2">
                <Select
                  items={ACCOUNTS}
                  value={from}
                  onValueChange={(value) => {
                    if (value === null) return
                    setFrom(value)
                    clearError("amount")
                  }}
                >
                  <SelectTrigger id="from" ref={fromRef} aria-describedby="from-help">
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
                <p id="from-help" className={smallFigure}>
                  {formatMoney(account.available)} available
                </p>
              </div>
            </div>

            <div className={fieldClass}>
              <label htmlFor="payee" className={fieldLabel}>
                Payee
              </label>
              <div className="flex flex-col gap-2">
                <Select
                  items={PAYEES}
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
                  <p id="payee-help" className={smallFigure}>
                    {payeeDetails(chosenPayee)}
                  </p>
                )}
                {errors.payee && <ErrorLine id="payee-error">{errors.payee}</ErrorLine>}
              </div>
            </div>

            <div className={fieldClass}>
              <label htmlFor="amount" className={fieldLabel}>
                Amount
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex w-48 items-center gap-2">
                  <span className="font-mono text-label tabular-nums text-foreground">£</span>
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
                    className={cn(inputClass, "font-mono tabular-nums text-right")}
                  />
                </div>
                <p id="amount-help" className={smallFigure}>
                  Up to £10,000.00 a payment.
                </p>
                {errors.amount && <ErrorLine id="amount-error">{errors.amount}</ErrorLine>}
              </div>
            </div>

            <div className={fieldClass}>
              <label htmlFor="reference" className={fieldLabel}>
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
                  className={inputClass}
                />
                <p id="reference-help" className={smallFigure}>
                  Up to 18 letters, numbers and spaces. The payee sees this.
                </p>
                {errors.reference && (
                  <ErrorLine id="reference-error">{errors.reference}</ErrorLine>
                )}
              </div>
            </div>

            <div className={fieldClass}>
              <label id="payon-label" htmlFor="payon" className={fieldLabel}>
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
                  last={LAST_DAY}
                />
                <p id="payon-help" className={smallFigure}>
                  Today, or a later day up to and including 26 January 2027.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" className={buttonText}>
                Review payment
              </Button>
              <a href="/" className={cn(buttonVariants({ variant: "outline" }), buttonText)}>
                Cancel
              </a>
            </div>
          </form>
        )}

        {step === "review" && payment && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <p className={labelText}>You are sending</p>
              <p className="font-heading text-h1 tabular-nums text-foreground">
                {formatMoney(payment.pence)}
              </p>
              <p
                ref={wordsRef}
                tabIndex={-1}
                className={cn("max-w-lg text-body text-foreground", codeFocusRing)}
              >
                {amountInWords(payment.pence)}
              </p>
            </div>

            <dl>
              <div className="flex items-baseline justify-between gap-3 py-2">
                <dt className={labelText}>From</dt>
                <dd className="text-right text-body">{payment.account.label}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-t border-border py-2">
                <dt className={labelText}>To</dt>
                <dd className="flex flex-col items-end gap-1 text-right">
                  <span className="text-body">{payment.payee.label}</span>
                  <span className={smallFigure}>{payeeDetails(payment.payee)}</span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-t border-border py-2">
                <dt className={labelText}>Reference</dt>
                <dd className="text-right font-mono">{payment.reference}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-t border-border py-2">
                <dt className={labelText}>Pay on</dt>
                <dd className="text-right font-mono tabular-nums">
                  {sameDay(payment.date, TODAY) && "Today, "}
                  <time dateTime={isoDate(payment.date)}>
                    {formatShortDate(payment.date)}
                  </time>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-t border-border py-2">
                <dt className={labelText}>Balance after</dt>
                <dd className="text-right font-mono tabular-nums">
                  {formatMoney(payment.account.available - payment.pence)}
                </dd>
              </div>
            </dl>

            <p className="max-w-lg text-body text-foreground">
              Check the payee&apos;s details. A payment cannot be called back once it is
              sent.
            </p>

            <div className="flex flex-wrap gap-2">
              <Button className={buttonText} onClick={sendPayment}>
                Send payment
              </Button>
              <Button variant="outline" className={buttonText} onClick={changeDetails}>
                Change details
              </Button>
            </div>
          </div>
        )}

        <div role="status">
          {step === "done" && payment && (
            <div className="flex flex-col gap-3">
              <p className="font-heading text-h2 tabular-nums text-foreground">
                {formatMoney(payment.pence)} to {payment.payee.label}
              </p>
              <p className="max-w-lg text-body text-foreground">
                From {payment.account.inSentence}, on {formatLongDate(payment.date)}.
              </p>
              <p className="max-w-lg text-body text-foreground">
                This is a demo: no money left the account and nothing was sent anywhere.
              </p>
            </div>
          )}
        </div>

        {step === "done" && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button variant="secondary" className={buttonText} onClick={makeAnother}>
              Make another payment
            </Button>
            <a href="/" className={textLink}>
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
        <h2 id="good-to-know" className={labelText}>
          Good to know
        </h2>
      </div>
      <ul>
        <li className="px-6 py-3 text-body text-foreground">
          Payments for today go out within two hours. Payments for a later day go out at
          06:00 on that day.
        </li>
        <li className="border-t border-border px-6 py-3 text-body text-foreground">
          The limit is £10,000.00 a payment, from either account.
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
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className={labelText}>Payments</p>
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
        <div className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-6">
          <p className={smallFigure}>Fairhold · A demo. No money moves. · 2026</p>
        </div>
      </footer>
    </div>
  )
}

export default App
