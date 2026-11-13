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
  formatLongDate,
  formatMoney,
  formatShortDate,
  isoDate,
  isSameDay,
  moneyInWords,
} from "@/format"
import { cn } from "@/lib/utils"

// The sample's today: a fixed date, never the device clock.
const TODAY = new Date(2026, 10, 27)
const LATEST = new Date(2027, 0, 26)
const LIMIT = 1_000_000 // £10,000.00 in pence

const CONTAINER = "mx-auto w-full max-w-[1200px] px-4 md:px-6"
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const CODE_FOCUS =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const LABEL = "font-mono text-label uppercase text-muted-foreground"
const SMALL = "font-mono text-label tabular-nums text-muted-foreground"
const BUTTON = "px-4 font-mono text-label uppercase"
const TEXT_LINK = `text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground ${FOCUS}`

const NAV = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Invoices", href: "/invoice" },
  { label: "Payments", href: "/payment" },
  { label: "Reports", href: "/report" },
]
const CURRENT = "/payment"

type AccountId = "current" | "reserve"
const ACCOUNTS: Record<
  AccountId,
  { label: string; inSentence: string; balance: number }
> = {
  current: {
    label: "Current account · ending 4417",
    inSentence: "the current account",
    balance: 4_821_356,
  },
  reserve: {
    label: "Tax reserve · ending 8830",
    inSentence: "the tax reserve",
    balance: 1_369_071,
  },
}
const ACCOUNT_ITEMS = (Object.keys(ACCOUNTS) as AccountId[]).map((value) => ({
  value,
  label: ACCOUNTS[value].label,
}))

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
const PAYEE_ITEMS = PAYEES.map(({ value, label }) => ({ value, label }))

function payeeDetails(value: string) {
  const payee = PAYEES.find((p) => p.value === value)
  return payee ? `Sort code ${payee.sortCode} · Account ${payee.account}` : ""
}

/** Parses an amount to pence, or returns null when it is not one. */
function parseAmount(raw: string): number | null {
  const cleaned = raw.trim().replace(/^£/, "").replace(/[\s,]/g, "")
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null
  const [pounds, pence = ""] = cleaned.split(".")
  return Number(pounds) * 100 + Number(pence.padEnd(2, "0"))
}

type Errors = { payee?: string; amount?: string; reference?: string }
type Step = "details" | "review" | "done"
type Sent = { amount: number; payee: string; from: AccountId; date: Date }

const STEP_LABEL: Record<Step, string> = {
  details: "Step 1 of 3 · Details",
  review: "Step 2 of 3 · Review",
  done: "Step 3 of 3 · Done",
}
const HEADING: Record<Step, string> = {
  details: "Payment details",
  review: "Check the payment",
  done: "Payment recorded",
}

function ErrorLine({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <p
      id={id}
      className="flex items-start gap-2 font-mono text-label text-destructive"
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

function describedBy(...ids: (string | false | null | undefined)[]) {
  const list = ids.filter(Boolean).join(" ")
  return list || undefined
}

function Header() {
  const [open, setOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  function links(mobile: boolean) {
    return NAV.map((link) => {
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
  }

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
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground transition-colors duration-150",
            FOCUS
          )}
        >
          Fairhold
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">{links(false)}</ul>
        </nav>
        <p className={cn(SMALL, "ml-auto hidden md:block")}>
          Hollis &amp; Vane
        </p>
        <Button
          ref={buttonRef}
          variant="outline"
          className={cn(BUTTON, "ml-auto md:hidden")}
          aria-expanded={open}
          aria-controls="menu-nav"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </Button>
      </div>
      <nav
        id="menu-nav"
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
  const [step, setStep] = React.useState<Step>("details")
  const [from, setFrom] = React.useState<AccountId>("current")
  const [payee, setPayee] = React.useState<string | null>(null)
  const [amount, setAmount] = React.useState("")
  const [reference, setReference] = React.useState("")
  const [date, setDate] = React.useState<Date>(TODAY)
  const [errors, setErrors] = React.useState<Errors>({})
  const [sent, setSent] = React.useState<Sent | null>(null)

  const fromRef = React.useRef<HTMLButtonElement>(null)
  const payeeRef = React.useRef<HTMLButtonElement>(null)
  const amountRef = React.useRef<HTMLInputElement>(null)
  const referenceRef = React.useRef<HTMLInputElement>(null)
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const wordsRef = React.useRef<HTMLParagraphElement>(null)
  const pendingFocus = React.useRef<React.RefObject<HTMLElement | null> | null>(
    null
  )

  React.useEffect(() => {
    if (pendingFocus.current) {
      pendingFocus.current.current?.focus()
      pendingFocus.current = null
    }
  })

  const account = ACCOUNTS[from]
  const pence = parseAmount(amount) ?? 0
  const trimmedReference = reference.trim()
  const chosenPayee = PAYEES.find((p) => p.value === payee)

  function clearError(field: keyof Errors) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function check(): Errors {
    const found: Errors = {}
    if (!payee) found.payee = "Choose who to pay."

    if (!amount.trim()) {
      found.amount = "Enter an amount."
    } else {
      const value = parseAmount(amount)
      if (value === null || value === 0) {
        found.amount = "Enter an amount in pounds and pence, such as 240.50."
      } else if (value > account.balance) {
        found.amount = `That is more than the ${formatMoney(account.balance)} available in this account.`
      } else if (value > LIMIT) {
        found.amount = "The most you can send in one payment is £10,000.00."
      }
    }

    if (!trimmedReference) {
      found.reference = "Enter a reference the payee will recognise."
    } else if (
      trimmedReference.length > 18 ||
      !/^[A-Za-z0-9 ]+$/.test(trimmedReference)
    ) {
      found.reference = "Use up to 18 letters, numbers and spaces."
    }
    return found
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = check()
    setErrors(found)
    if (found.payee) payeeRef.current?.focus()
    else if (found.amount) amountRef.current?.focus()
    else if (found.reference) referenceRef.current?.focus()
    else {
      pendingFocus.current = wordsRef
      setStep("review")
    }
  }

  function changeDetails() {
    pendingFocus.current = fromRef
    setStep("details")
  }

  function sendPayment() {
    if (!payee) return
    setSent({ amount: pence, payee, from, date })
    pendingFocus.current = headingRef
    setStep("done")
  }

  function makeAnother() {
    setSent(null)
    setFrom("current")
    setPayee(null)
    setAmount("")
    setReference("")
    setDate(TODAY)
    setErrors({})
    pendingFocus.current = fromRef
    setStep("details")
  }

  const sentPayee = sent
    ? PAYEES.find((p) => p.value === sent.payee)
    : undefined

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
          {HEADING[step]}
        </h2>
        <p className={SMALL}>{STEP_LABEL[step]}</p>
      </div>

      <div>
        {step === "details" && (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex max-w-md flex-col gap-3">
              <label
                id="from-label"
                htmlFor="from"
                className={cn(LABEL, "block")}
              >
                From account
              </label>
              <div className="flex flex-col gap-2">
                <Select
                  items={ACCOUNT_ITEMS}
                  value={from}
                  onValueChange={(value) => {
                    if (value === null) return
                    setFrom(value as AccountId)
                    clearError("amount")
                  }}
                >
                  <SelectTrigger
                    ref={fromRef}
                    id="from"
                    aria-labelledby="from-label"
                    aria-describedby="from-help"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNT_ITEMS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
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
              <label
                id="payee-label"
                htmlFor="payee"
                className={cn(LABEL, "block")}
              >
                Payee
              </label>
              <div className="flex flex-col gap-2">
                <Select
                  items={PAYEE_ITEMS}
                  value={payee}
                  onValueChange={(value) => {
                    if (value === null) return
                    setPayee(value as string)
                    clearError("payee")
                  }}
                >
                  <SelectTrigger
                    ref={payeeRef}
                    id="payee"
                    aria-labelledby="payee-label"
                    aria-describedby={describedBy(
                      payee && "payee-help",
                      errors.payee && "payee-error"
                    )}
                    aria-invalid={errors.payee ? true : undefined}
                  >
                    <SelectValue placeholder="Choose a payee" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYEE_ITEMS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {payee && (
                  <p id="payee-help" className={SMALL}>
                    {payeeDetails(payee)}
                  </p>
                )}
                {errors.payee && (
                  <ErrorLine id="payee-error">{errors.payee}</ErrorLine>
                )}
              </div>
            </div>

            <div className="flex max-w-md flex-col gap-3">
              <label htmlFor="amount" className={cn(LABEL, "block")}>
                Amount
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex w-48 items-center gap-2">
                  <span className="font-mono text-label text-foreground tabular-nums">
                    £
                  </span>
                  <Input
                    ref={amountRef}
                    id="amount"
                    inputMode="decimal"
                    autoComplete="off"
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value)
                      clearError("amount")
                    }}
                    aria-describedby={describedBy(
                      "amount-help",
                      errors.amount && "amount-error"
                    )}
                    aria-invalid={errors.amount ? true : undefined}
                    className="px-2 text-right font-mono text-body tabular-nums md:text-body"
                  />
                </div>
                <p id="amount-help" className={SMALL}>
                  Up to £10,000.00 a payment.
                </p>
                {errors.amount && (
                  <ErrorLine id="amount-error">{errors.amount}</ErrorLine>
                )}
              </div>
            </div>

            <div className="flex max-w-md flex-col gap-3">
              <label htmlFor="reference" className={cn(LABEL, "block")}>
                Reference
              </label>
              <div className="flex flex-col gap-2">
                <Input
                  ref={referenceRef}
                  id="reference"
                  autoComplete="off"
                  value={reference}
                  onChange={(event) => {
                    setReference(event.target.value)
                    clearError("reference")
                  }}
                  aria-describedby={describedBy(
                    "reference-help",
                    errors.reference && "reference-error"
                  )}
                  aria-invalid={errors.reference ? true : undefined}
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
              <label
                id="pay-on-label"
                htmlFor="pay-on"
                className={cn(LABEL, "block")}
              >
                Pay on
              </label>
              <div className="flex flex-col gap-2">
                <DatePicker
                  id="pay-on"
                  labelId="pay-on-label"
                  describedBy="pay-on-help"
                  value={date}
                  onChange={setDate}
                  today={TODAY}
                  latest={LATEST}
                />
                <p id="pay-on-help" className={SMALL}>
                  Today, or a later day up to and including 26 January 2027.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" className={BUTTON}>
                Review payment
              </Button>
              <a
                href="/"
                className={cn(buttonVariants({ variant: "outline" }), BUTTON)}
              >
                Cancel
              </a>
            </div>
          </form>
        )}

        {step === "review" && chosenPayee && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <p className={LABEL}>You are sending</p>
              <p className="font-heading text-h1 text-foreground tabular-nums">
                {formatMoney(pence)}
              </p>
              <p
                ref={wordsRef}
                tabIndex={-1}
                className={cn("max-w-lg text-body text-foreground", CODE_FOCUS)}
              >
                {moneyInWords(pence)}
              </p>
            </div>

            <dl>
              <div className="flex items-baseline justify-between gap-3 py-2">
                <dt className={LABEL}>From</dt>
                <dd className="text-right text-body">{account.label}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-t border-border py-2">
                <dt className={LABEL}>To</dt>
                <dd className="flex flex-col items-end gap-1 text-right">
                  <span className="text-body">{chosenPayee.label}</span>
                  <span className={SMALL}>
                    {payeeDetails(chosenPayee.value)}
                  </span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-t border-border py-2">
                <dt className={LABEL}>Reference</dt>
                <dd className="min-w-0 text-right font-mono wrap-break-word">
                  {trimmedReference}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-t border-border py-2">
                <dt className={LABEL}>Pay on</dt>
                <dd className="text-right font-mono tabular-nums">
                  {isSameDay(date, TODAY) && "Today, "}
                  <time dateTime={isoDate(date)}>{formatShortDate(date)}</time>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-t border-border py-2">
                <dt className={LABEL}>Balance after</dt>
                <dd className="text-right font-mono tabular-nums">
                  {formatMoney(account.balance - pence)}
                </dd>
              </div>
            </dl>

            <p className="max-w-lg text-body text-foreground">
              Check the payee&apos;s details. A payment cannot be called back
              once it is sent.
            </p>

            <div className="flex flex-wrap gap-2">
              <Button className={BUTTON} onClick={sendPayment}>
                Send payment
              </Button>
              <Button
                variant="outline"
                className={BUTTON}
                onClick={changeDetails}
              >
                Change details
              </Button>
            </div>
          </div>
        )}

        <div role="status">
          {sent && sentPayee && (
            <div className="flex flex-col gap-3">
              <p className="font-heading text-h2 text-foreground tabular-nums">
                {formatMoney(sent.amount)} to {sentPayee.label}
              </p>
              <p className="max-w-lg text-body text-foreground">
                From {ACCOUNTS[sent.from].inSentence}, on{" "}
                {formatLongDate(sent.date)}.
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
            <Button
              variant="secondary"
              className={BUTTON}
              onClick={makeAnother}
            >
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
        <li className="px-6 py-3 text-body text-foreground">
          Payments for today go out within two hours. Payments for a later day
          go out at 06:00 on that day.
        </li>
        <li className="border-t border-border px-6 py-3 text-body text-foreground">
          You can send up to £10,000.00 in one payment.
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
