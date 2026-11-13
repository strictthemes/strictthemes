import { useRef, useState, type KeyboardEvent } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

// The sample's today is fixed, never the device clock.
const TODAY = "2026-11-27"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const CONTAINER = "mx-auto w-full max-w-[1200px] px-4 md:px-6"
const LABEL = "font-mono text-label uppercase text-muted-foreground"
const SMALL = "font-mono text-label tabular-nums text-muted-foreground"
const SHEET = "rounded-xl border border-border bg-card p-6"
const SHEET_ROWS = "overflow-hidden rounded-xl border border-border bg-card"
const HEADING_ROW = "flex min-h-8 flex-wrap items-center justify-between gap-3"
const TEXT_LINK = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  FOCUS
)
const BUTTON_TEXT = "px-4 font-mono text-label uppercase"

const NAV_LINKS = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Invoices", href: "/invoice" },
  { label: "Payments", href: "/payment" },
  { label: "Reports", href: "/report" },
]
const CURRENT = "/"

const SCALE_MAX = 8000

const WEEKS = [
  { days: "2–8", spoken: "2 to 8 November", moneyIn: 4860, moneyOut: 3412.5 },
  { days: "9–15", spoken: "9 to 15 November", moneyIn: 6240, moneyOut: 2186.4 },
  {
    days: "16–22",
    spoken: "16 to 22 November",
    moneyIn: 3780,
    moneyOut: 4021.18,
  },
  {
    days: "23–27",
    spoken: "23 to 27 November, to date",
    moneyIn: 3540,
    moneyOut: 2342.3,
    toDate: true,
  },
]

type Transaction = {
  date: string
  shortDate: string
  party: string
  reference: string
  account: "Current" | "Tax reserve"
  amount: number
}

const TRANSACTIONS: Transaction[] = [
  {
    date: "2026-11-26",
    shortDate: "26 Nov",
    party: "Marlow & Finch Books",
    reference: "INV-0139",
    account: "Current",
    amount: 2100,
  },
  {
    date: "2026-11-25",
    shortDate: "25 Nov",
    party: "Larch Street Properties",
    reference: "Studio rent, December",
    account: "Current",
    amount: -1450,
  },
  {
    date: "2026-11-24",
    shortDate: "24 Nov",
    party: "Thornbury Design Co.",
    reference: "INV-0140",
    account: "Current",
    amount: 1440,
  },
  {
    date: "2026-11-24",
    shortDate: "24 Nov",
    party: "Proofline Software",
    reference: "Monthly plan, 2 seats",
    account: "Current",
    amount: -38.4,
  },
  {
    date: "2026-11-23",
    shortDate: "23 Nov",
    party: "Ashdown Paper Supply",
    reference: "Order 5521, cotton card stock",
    account: "Current",
    amount: -612.8,
  },
  {
    date: "2026-11-20",
    shortDate: "20 Nov",
    party: "VAT payment",
    reference: "Quarter to 31 Oct 2026",
    account: "Tax reserve",
    amount: -2864,
  },
]

const pounds = new Intl.NumberFormat("en-GB", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function money(value: number) {
  return `£${pounds.format(Math.abs(value))}`
}

function signed(value: number) {
  if (value === 0) return money(0)
  return `${value > 0 ? "+" : "−"}${money(value)}`
}

function count(n: number, noun: string) {
  return `${n} ${noun}${n === 1 ? "" : "s"}`
}

function SignedAmount({ value }: { value: number }) {
  const isIn = value > 0
  const isZero = value === 0
  return (
    <span className="inline-flex items-baseline justify-end gap-2 whitespace-nowrap">
      <span className={LABEL}>{isIn || isZero ? "In" : "Out"}</span>
      <span
        className={cn(
          "font-mono tabular-nums",
          !isZero && (isIn ? "text-primary" : "text-destructive")
        )}
      >
        {signed(value)}
      </span>
    </span>
  )
}

function State({
  tone,
  children,
}: {
  tone: "settled" | "late" | "neutral"
  children: string
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn(
          "size-2 shrink-0 rounded-sm",
          tone === "settled" && "bg-primary",
          tone === "late" && "bg-destructive",
          tone === "neutral" && "bg-muted-foreground"
        )}
      />
      <span className="text-body text-foreground">{children}</span>
    </span>
  )
}

function WaitingBadge({ children }: { children: string }) {
  return (
    <Badge
      variant="outline"
      className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
    >
      {children}
    </Badge>
  )
}

function NavLink({
  label,
  href,
  className,
}: {
  label: string
  href: string
  className?: string
}) {
  const current = href === CURRENT
  return (
    <a
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "font-mono text-label uppercase transition-colors duration-150",
        current
          ? "text-foreground underline underline-offset-4"
          : "text-muted-foreground hover:text-foreground",
        FOCUS,
        className
      )}
    >
      {label}
    </a>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!open || event.key !== "Escape") return
    setOpen(false)
    menuButton.current?.focus()
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div className={cn(CONTAINER, "flex items-center gap-6 py-4")}>
        <a
          href="/"
          className={cn("font-heading text-h2 text-foreground", FOCUS)}
        >
          Fairhold
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink {...link} />
              </li>
            ))}
          </ul>
        </nav>
        <p className={cn(SMALL, "ml-auto hidden md:block")}>
          Hollis &amp; Vane
        </p>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={open}
          aria-controls="menu-nav"
          onClick={() => setOpen((value) => !value)}
          className={cn(BUTTON_TEXT, "ml-auto md:hidden")}
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
          <ul className="py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink {...link} className="block py-2" />
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function PageHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <p className={SMALL}>
          <time dateTime={TODAY}>Friday 27 November 2026</time>
        </p>
        <h1 className="text-h1">Overview</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href="#"
          className={cn(buttonVariants({ variant: "outline" }), BUTTON_TEXT)}
        >
          New invoice
        </a>
        <a href="/payment" className={cn(buttonVariants(), BUTTON_TEXT)}>
          Make a payment
        </a>
      </div>
    </div>
  )
}

function BalanceSheet({
  id,
  label,
  figure,
  note,
  display,
}: {
  id: string
  label: string
  figure: string
  note: string
  display?: boolean
}) {
  return (
    <section
      aria-labelledby={id}
      className={cn(SHEET, "flex flex-col gap-1 lg:col-span-4")}
    >
      <h2 id={id} className={LABEL}>
        {label}
      </h2>
      <p
        className={cn(
          "font-heading text-h1 text-foreground tabular-nums",
          display && "xl:text-display"
        )}
      >
        {figure}
      </p>
      <p className={SMALL}>{note}</p>
    </section>
  )
}

function Balances() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <BalanceSheet
        id="balance-total"
        label="Total balance"
        figure="£61,904.27"
        note="Across 2 accounts"
        display
      />
      <BalanceSheet
        id="balance-current"
        label="Current account"
        figure="£48,213.56"
        note="60-14-22 · ending 4417"
      />
      <BalanceSheet
        id="balance-tax"
        label="Tax reserve"
        figure="£13,690.71"
        note="Set aside for VAT and tax · ending 8830"
      />
    </div>
  )
}

function height(value: number) {
  return { height: `${(value / SCALE_MAX) * 100}%` }
}

function MoneyInOut() {
  return (
    <section
      aria-labelledby="money-heading"
      className={cn(SHEET, "flex flex-col gap-3 lg:col-span-8")}
    >
      <div className={HEADING_ROW}>
        <h2 id="money-heading" className={LABEL}>
          Money in and out, November
        </h2>
        <div className="flex gap-4">
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-sm bg-primary"
            />
            <span className={LABEL}>In</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-sm bg-destructive"
            />
            <span className={LABEL}>Out</span>
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-1">
            <p className={LABEL}>In this month</p>
            <p className="font-mono text-body text-foreground tabular-nums">
              {signed(18420)}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className={LABEL}>Out this month</p>
            <p className="font-mono text-body text-foreground tabular-nums">
              {signed(-11962.38)}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-end">
          <div className="sr-only">
            <table aria-label="Money in and out by week, November 2026">
              <thead>
                <tr>
                  <th scope="col" className="font-normal">
                    Week
                  </th>
                  <th scope="col" className="font-normal">
                    In
                  </th>
                  <th scope="col" className="font-normal">
                    Out
                  </th>
                </tr>
              </thead>
              <tbody>
                {WEEKS.map((week) => (
                  <tr key={week.days}>
                    <th scope="row" className="font-normal">
                      {week.spoken}
                    </th>
                    <td>{money(week.moneyIn)}</td>
                    <td>{money(week.moneyOut)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div aria-hidden="true" className="flex gap-2">
            <div className={cn(SMALL, "relative h-48 w-12 shrink-0")}>
              <span className="absolute top-0 right-0">£8k</span>
              <span className="absolute top-1/2 right-0 -translate-y-1/2">
                £4k
              </span>
              <span className="absolute right-0 bottom-0">£0</span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="relative h-48">
                <div className="absolute inset-x-0 top-0 border-t border-border" />
                <div className="absolute inset-x-0 top-1/2 border-t border-border" />
                <div className="absolute inset-x-0 bottom-0 border-t border-border" />
                <div className="relative flex h-full gap-4">
                  {WEEKS.map((week) => (
                    <div
                      key={week.days}
                      className="flex min-w-0 flex-1 items-end gap-1"
                    >
                      <div
                        className="flex-1 bg-primary"
                        style={height(week.moneyIn)}
                      />
                      <div
                        className="flex-1 bg-destructive"
                        style={height(week.moneyOut)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                {WEEKS.map((week) => (
                  <p
                    key={week.days}
                    className={cn(
                      SMALL,
                      "min-w-0 flex-1 text-center whitespace-nowrap",
                      week.toDate && "text-foreground"
                    )}
                  >
                    {week.days}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WaitingOnYou() {
  const [approved, setApproved] = useState(false)
  const items = approved ? 2 : 3

  return (
    <section
      aria-labelledby="waiting-heading"
      className={cn(SHEET_ROWS, "lg:col-span-4")}
    >
      <div className={cn(HEADING_ROW, "border-b border-border px-6 pt-6 pb-3")}>
        <h2 id="waiting-heading" className={LABEL}>
          Waiting on you
        </h2>
        <p className={SMALL}>{count(items, "item")}</p>
      </div>
      <ul>
        <li className="flex flex-col gap-1 px-6 py-3">
          <div className="flex items-start justify-between gap-3">
            <a
              href="/invoice"
              className={cn(TEXT_LINK, "font-mono tabular-nums")}
            >
              INV-0142
            </a>
            <WaitingBadge>Due</WaitingBadge>
          </div>
          <p className="max-w-lg text-body text-foreground">
            Larkspur Café owes £1,488.00, due today.
          </p>
          <p className={SMALL}>
            Due <time dateTime="2026-11-27">27 Nov 2026</time>
          </p>
        </li>
        <li className="flex flex-col gap-1 border-t border-border px-6 py-3">
          <div className="flex items-start justify-between gap-3">
            <a href="#" className={cn(TEXT_LINK, "font-mono tabular-nums")}>
              INV-0137
            </a>
            <State tone="late">Overdue</State>
          </div>
          <p className="max-w-lg text-body text-foreground">
            Brennan Wholesale owes £640.00, 9 days late.
          </p>
          <p className={SMALL}>
            Due <time dateTime="2026-11-18">18 Nov 2026</time>
          </p>
        </li>
        <li className="flex flex-col gap-3 border-t border-border px-6 py-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between gap-3">
              <p className="text-body">Copperleaf Paper Mill</p>
              {approved ? (
                <State tone="settled">Approved</State>
              ) : (
                <WaitingBadge>To approve</WaitingBadge>
              )}
            </div>
            <p className="max-w-lg text-body text-foreground">
              Tom Vane set up a payment of £2,350.00 from the current account,
              to go on 30 November.
            </p>
          </div>
          <div>
            <Button
              variant="secondary"
              className={BUTTON_TEXT}
              disabled={approved}
              focusableWhenDisabled
              onClick={() => setApproved(true)}
            >
              Approve
            </Button>
            <div role="status">
              {approved && (
                <p className="mt-2 font-mono text-label text-foreground tabular-nums">
                  Approved. It goes on 30 November.
                </p>
              )}
            </div>
          </div>
        </li>
      </ul>
    </section>
  )
}

const CELL = "px-4 py-2 first:pl-6 last:pr-6"
const HEAD = cn(LABEL, "px-4 first:pl-6 last:pr-6")

function RecentTransactions() {
  return (
    <section aria-labelledby="recent-heading" className={SHEET_ROWS}>
      <div className={cn(HEADING_ROW, "border-b border-border px-6 pt-6 pb-3")}>
        <h2 id="recent-heading" className={LABEL}>
          Recent transactions
        </h2>
        <a
          href="/transactions"
          className={cn(TEXT_LINK, "font-mono text-label uppercase")}
        >
          All transactions
        </a>
      </div>
      <Table label="Recent transactions" className="text-body">
        <TableHeader>
          <TableRow>
            <TableHead className={HEAD}>Date</TableHead>
            <TableHead className={HEAD}>Description</TableHead>
            <TableHead className={HEAD}>Account</TableHead>
            <TableHead className={cn(HEAD, "text-right")}>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {TRANSACTIONS.map((t) => (
            <TableRow key={`${t.date}-${t.party}`}>
              <TableCell className={cn(CELL, "font-mono tabular-nums")}>
                <time dateTime={t.date}>{t.shortDate}</time>
              </TableCell>
              <TableCell className={CELL}>
                <div className="flex flex-col gap-1">
                  <span>{t.party}</span>
                  <span className={SMALL}>{t.reference}</span>
                </div>
              </TableCell>
              <TableCell className={CELL}>{t.account}</TableCell>
              <TableCell className={cn(CELL, "text-right")}>
                <SignedAmount value={t.amount} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}

export function App() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />
      <main className="flex-1 py-6 md:py-12">
        <div className={cn(CONTAINER, "flex flex-col gap-6")}>
          <PageHeader />
          <Balances />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <MoneyInOut />
            <WaitingOnYou />
          </div>
          <RecentTransactions />
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
