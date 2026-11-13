import { useState } from "react"

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

// The sample's today is fixed: Friday 27 November 2026.
const TODAY = { iso: "2026-11-27", long: "Friday 27 November 2026" }

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const NAV_LINKS = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Invoices", href: "/invoice" },
  { label: "Payments", href: "/payment" },
  { label: "Reports", href: "/report" },
]

const CURRENT_PATH = "/"

// The top of the chart's scale, in pounds.
const SCALE_TOP = 8000

const WEEKS = [
  { days: "2–8", name: "2–8 November", moneyIn: 5100, moneyOut: 2660 },
  { days: "9–15", name: "9–15 November", moneyIn: 5120, moneyOut: 2890 },
  { days: "16–22", name: "16–22 November", moneyIn: 4260, moneyOut: 2310 },
  {
    days: "23–27",
    name: "23–27 November, to date",
    moneyIn: 3940,
    moneyOut: 4102.38,
    current: true,
  },
]

const MONTH_IN = WEEKS.reduce((sum, week) => sum + week.moneyIn, 0)
const MONTH_OUT = WEEKS.reduce((sum, week) => sum + week.moneyOut, 0)

type Transaction = {
  date: string
  name: string
  reference: string
  account: "Current" | "Tax reserve"
  amount: number
}

const TRANSACTIONS: Transaction[] = [
  {
    date: "2026-11-26",
    name: "Marlow & Finch Books",
    reference: "INV-0139",
    account: "Current",
    amount: 2460,
  },
  {
    date: "2026-11-25",
    name: "Copperleaf Paper Mill",
    reference: "Paper stock · PO-0318",
    account: "Current",
    amount: -684.2,
  },
  {
    date: "2026-11-24",
    name: "Tax office",
    reference: "VAT, July to September · VAT-2026-Q3",
    account: "Tax reserve",
    amount: -3180,
  },
  {
    date: "2026-11-20",
    name: "Inkwell Cloud",
    reference: "Studio plan, November · SUB-77104",
    account: "Current",
    amount: -42,
  },
  {
    date: "2026-11-19",
    name: "Otterbourne Theatre Trust",
    reference: "INV-0134",
    account: "Current",
    amount: 1875,
  },
  {
    date: "2026-11-16",
    name: "Tannery Yard Estates",
    reference: "Unit 6 rent, November · SO-0011",
    account: "Current",
    amount: -1150,
  },
]

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const CONTAINER = "mx-auto w-full max-w-[1200px] px-4 md:px-6"
const LABEL = "font-mono text-label uppercase text-muted-foreground"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const TEXT_LINK = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  FOCUS
)
const BUTTON = "px-4 font-mono text-label uppercase"
const SHEET = "rounded-xl border border-border bg-card p-6"
const ROW_SHEET = "overflow-hidden rounded-xl border border-border bg-card"
const HEADING_ROW = "flex min-h-8 flex-wrap items-center justify-between gap-3"
const ROW_HEADING = cn(HEADING_ROW, "border-b border-border px-6 pt-6 pb-3")
const BADGE =
  "h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label uppercase text-tertiary-foreground"
const HEAD_CELL = cn(LABEL, "px-4 first:pl-6 last:pr-6")
const BODY_CELL = "px-4 py-2 first:pl-6 last:pr-6"

function pounds(value: number) {
  return `£${Math.abs(value).toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function shortDate(iso: string) {
  const [, month, day] = iso.split("-")
  return `${Number(day)} ${MONTHS[Number(month) - 1]}`
}

function navLinkClass(current: boolean) {
  return cn(
    "font-mono text-label uppercase transition-colors duration-150",
    current
      ? "text-foreground underline underline-offset-4"
      : "text-muted-foreground hover:text-foreground",
    FOCUS
  )
}

function SignedAmount({ value }: { value: number }) {
  if (value === 0) {
    return (
      <span className="inline-flex items-baseline justify-end gap-2 whitespace-nowrap">
        <span className={LABEL}>In</span>
        <span className="font-mono tabular-nums">{pounds(0)}</span>
      </span>
    )
  }

  const moneyIn = value > 0

  return (
    <span className="inline-flex items-baseline justify-end gap-2 whitespace-nowrap">
      <span className={LABEL}>{moneyIn ? "In" : "Out"}</span>
      <span
        className={cn(
          "font-mono tabular-nums",
          moneyIn ? "text-primary" : "text-destructive"
        )}
      >
        {moneyIn ? "+" : "−"}
        {pounds(value)}
      </span>
    </span>
  )
}

function State({
  word,
  tone,
}: {
  word: string
  tone: "settled" | "late" | "neutral"
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
      <span className="text-body text-foreground">{word}</span>
    </span>
  )
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b border-border">
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
                <a
                  href={link.href}
                  aria-current={link.href === CURRENT_PATH ? "page" : undefined}
                  className={navLinkClass(link.href === CURRENT_PATH)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={cn(SMALL_FIGURE, "ml-auto hidden md:block")}>
          Hollis &amp; Vane
        </p>
        <Button
          variant="outline"
          className={cn(BUTTON, "ml-auto md:hidden")}
          aria-expanded={menuOpen}
          aria-controls="menu-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </Button>
      </div>
      <nav
        id="menu-nav"
        aria-label="Main"
        hidden={!menuOpen}
        className="border-t border-border md:hidden"
      >
        <div className={CONTAINER}>
          <ul className="py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.href === CURRENT_PATH ? "page" : undefined}
                  className={cn(
                    "block py-2",
                    navLinkClass(link.href === CURRENT_PATH)
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function Balances() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <section className={cn(SHEET, "flex flex-col gap-1 lg:col-span-4")}>
        <h2 className={LABEL}>Total balance</h2>
        <p className="font-heading text-h1 text-foreground tabular-nums xl:text-display">
          £61,904.27
        </p>
        <p className={SMALL_FIGURE}>Across 2 accounts</p>
      </section>
      <section className={cn(SHEET, "flex flex-col gap-1 lg:col-span-4")}>
        <h2 className={LABEL}>Current account</h2>
        <p className="font-heading text-h1 text-foreground tabular-nums">
          £48,213.56
        </p>
        <p className={SMALL_FIGURE}>60-14-22 · ending 4417</p>
      </section>
      <section className={cn(SHEET, "flex flex-col gap-1 lg:col-span-4")}>
        <h2 className={LABEL}>Tax reserve</h2>
        <p className="font-heading text-h1 text-foreground tabular-nums">
          £13,690.71
        </p>
        <p className={SMALL_FIGURE}>Set aside for VAT and tax · ending 8830</p>
      </section>
    </div>
  )
}

function MoneyInAndOut() {
  return (
    <section className={cn(SHEET, "flex flex-col gap-3 lg:col-span-8")}>
      <div className={HEADING_ROW}>
        <h2 className={LABEL}>Money in and out, November</h2>
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
              +{pounds(MONTH_IN)}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className={LABEL}>Out this month</p>
            <p className="font-mono text-body text-foreground tabular-nums">
              −{pounds(MONTH_OUT)}
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-end">
          <div aria-hidden="true" className="flex gap-2">
            <div className="relative h-48 w-12 shrink-0">
              <span className={cn(SMALL_FIGURE, "absolute top-0 right-0")}>
                £8k
              </span>
              <span
                className={cn(
                  SMALL_FIGURE,
                  "absolute top-1/2 right-0 -translate-y-1/2"
                )}
              >
                £4k
              </span>
              <span className={cn(SMALL_FIGURE, "absolute right-0 bottom-0")}>
                £0
              </span>
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
                      className="flex h-full min-w-0 flex-1 items-end gap-1"
                    >
                      <div
                        className="flex-1 bg-primary"
                        style={{
                          height: `${(week.moneyIn / SCALE_TOP) * 100}%`,
                        }}
                      />
                      <div
                        className="flex-1 bg-destructive"
                        style={{
                          height: `${(week.moneyOut / SCALE_TOP) * 100}%`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                {WEEKS.map((week) => (
                  <span
                    key={week.days}
                    className={cn(
                      SMALL_FIGURE,
                      "min-w-0 flex-1 text-center whitespace-nowrap",
                      week.current && "text-foreground"
                    )}
                  >
                    {week.days}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="sr-only">
            <table>
              <thead>
                <tr>
                  <th scope="col" className="font-normal">
                    Week
                  </th>
                  <th scope="col" className="font-normal">
                    Money in
                  </th>
                  <th scope="col" className="font-normal">
                    Money out
                  </th>
                </tr>
              </thead>
              <tbody>
                {WEEKS.map((week) => (
                  <tr key={week.days}>
                    <th scope="row" className="font-normal">
                      {week.name}
                    </th>
                    <td>+{pounds(week.moneyIn)}</td>
                    <td>−{pounds(week.moneyOut)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

function WaitingOnYou() {
  const [approved, setApproved] = useState(false)
  const count: number = approved ? 2 : 3

  return (
    <section className={cn(ROW_SHEET, "lg:col-span-4")}>
      <div className={ROW_HEADING}>
        <h2 className={LABEL}>Waiting on you</h2>
        <p className={SMALL_FIGURE}>
          {count} {count === 1 ? "item" : "items"}
        </p>
      </div>
      <ul>
        <li className="flex flex-col gap-1 px-6 py-3">
          <div className="flex items-start justify-between gap-3">
            <a
              href="/invoice"
              className={cn("font-mono tabular-nums", TEXT_LINK)}
            >
              INV-0142
            </a>
            <Badge variant="outline" className={BADGE}>
              Due
            </Badge>
          </div>
          <p className="max-w-lg text-body">
            Larkspur Café owes £1,488.00, due today.
          </p>
          <p className={SMALL_FIGURE}>
            Due <time dateTime="2026-11-27">27 Nov 2026</time>
          </p>
        </li>
        <li className="flex flex-col gap-1 border-t border-border px-6 py-3">
          <div className="flex items-start justify-between gap-3">
            <a href="#" className={cn("font-mono tabular-nums", TEXT_LINK)}>
              INV-0137
            </a>
            <State word="Overdue" tone="late" />
          </div>
          <p className="max-w-lg text-body">
            Brennan Wholesale owes £640.00, 9 days late.
          </p>
          <p className={SMALL_FIGURE}>
            Due <time dateTime="2026-11-18">18 Nov 2026</time>
          </p>
        </li>
        <li className="flex flex-col gap-1 border-t border-border px-6 py-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-body">Copperleaf Paper Mill</p>
            {approved ? (
              <State word="Approved" tone="settled" />
            ) : (
              <Badge variant="outline" className={BADGE}>
                To approve
              </Badge>
            )}
          </div>
          <p className="max-w-lg text-body">
            Tom Vane set up a payment of £2,350.00 from the current account, to
            go on 30 November.
          </p>
          <div>
            <Button
              variant="secondary"
              className={BUTTON}
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

function RecentTransactions() {
  return (
    <section className={ROW_SHEET}>
      <div className={ROW_HEADING}>
        <h2 className={LABEL}>Recent transactions</h2>
        <a
          href="/transactions"
          className={cn("font-mono text-label uppercase", TEXT_LINK)}
        >
          All transactions
        </a>
      </div>
      <Table label="Recent transactions" className="text-body">
        <TableHeader>
          <TableRow>
            <TableHead className={HEAD_CELL}>Date</TableHead>
            <TableHead className={HEAD_CELL}>Description</TableHead>
            <TableHead className={HEAD_CELL}>Account</TableHead>
            <TableHead className={cn(HEAD_CELL, "text-right")}>
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {TRANSACTIONS.map((transaction) => (
            <TableRow key={`${transaction.date}-${transaction.reference}`}>
              <TableCell className={cn(BODY_CELL, "font-mono tabular-nums")}>
                <time dateTime={transaction.date}>
                  {shortDate(transaction.date)}
                </time>
              </TableCell>
              <TableCell className={BODY_CELL}>
                <div className="flex flex-col gap-1">
                  <span>{transaction.name}</span>
                  <span className={SMALL_FIGURE}>{transaction.reference}</span>
                </div>
              </TableCell>
              <TableCell className={BODY_CELL}>{transaction.account}</TableCell>
              <TableCell className={cn(BODY_CELL, "text-right")}>
                <SignedAmount value={transaction.amount} />
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
      <SiteHeader />
      <main className="flex-1 py-6 md:py-12">
        <div className={cn(CONTAINER, "flex flex-col gap-6")}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <time dateTime={TODAY.iso} className={SMALL_FIGURE}>
                {TODAY.long}
              </time>
              <h1 className="text-h1">Overview</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="#"
                className={cn(buttonVariants({ variant: "outline" }), BUTTON)}
              >
                New invoice
              </a>
              <a
                href="/payment"
                className={cn(buttonVariants({ variant: "default" }), BUTTON)}
              >
                Make a payment
              </a>
            </div>
          </div>
          <Balances />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <MoneyInAndOut />
            <WaitingOnYou />
          </div>
          <RecentTransactions />
        </div>
      </main>
      <footer className="border-t border-border">
        <div className={cn(CONTAINER, "py-6")}>
          <p className={SMALL_FIGURE}>
            Fairhold · A demo. No money moves. · 2026
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
