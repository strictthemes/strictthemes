import { useState, type ReactNode } from "react"

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

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const label = "font-mono text-label uppercase text-muted-foreground"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const sheet = "rounded-xl border border-border bg-card p-6"
const sheetWithRows =
  "flex flex-col overflow-hidden rounded-xl border border-border bg-card"
const headingRow =
  "flex min-h-8 flex-wrap items-center justify-between gap-3"
const rowsHeadingRow = cn(headingRow, "border-b border-border px-6 pt-6 pb-3")
const buttonText = "px-4 font-mono text-label uppercase"

const navLinks = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Invoices", href: "/invoice" },
  { label: "Payments", href: "/payment" },
  { label: "Reports", href: "/report" },
]
const currentHref = "/"

// Four weeks of November, to date (today is 27 November 2026).
const weeks = [
  { days: "2–8", full: "2 to 8 November", moneyIn: 4200, moneyOut: 3812.4 },
  { days: "9–15", full: "9 to 15 November", moneyIn: 6150, moneyOut: 2964.18 },
  { days: "16–22", full: "16 to 22 November", moneyIn: 3870, moneyOut: 1845.6 },
  {
    days: "23–27",
    full: "23 to 27 November, to date",
    moneyIn: 4200,
    moneyOut: 3340.2,
    current: true,
  },
]
const scaleTop = 8000

type Transaction = {
  date: string
  shortDate: string
  party: string
  reference: string
  account: "Current" | "Tax reserve"
  amount: number
}

const transactions: Transaction[] = [
  {
    date: "2026-11-26",
    shortDate: "26 Nov",
    party: "VAT payment",
    reference: "Quarter to 30 September",
    account: "Tax reserve",
    amount: -2412.6,
  },
  {
    date: "2026-11-25",
    shortDate: "25 Nov",
    party: "Larch Row Theatre",
    reference: "INV-0140",
    account: "Current",
    amount: 4200,
  },
  {
    date: "2026-11-24",
    shortDate: "24 Nov",
    party: "Inkwell Cloud",
    reference: "Design software, November",
    account: "Current",
    amount: -64.8,
  },
  {
    date: "2026-11-23",
    shortDate: "23 Nov",
    party: "Copperleaf Paper Mill",
    reference: "Cotton paper stock, order 5521",
    account: "Current",
    amount: -862.8,
  },
  {
    date: "2026-11-20",
    shortDate: "20 Nov",
    party: "Marlow & Finch Books",
    reference: "INV-0138",
    account: "Current",
    amount: 3870,
  },
  {
    date: "2026-11-16",
    shortDate: "16 Nov",
    party: "Brickfield Lettings",
    reference: "Studio rent, November",
    account: "Current",
    amount: -1450,
  },
]

const pounds = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatMoney(value: number) {
  return pounds.format(Math.abs(value))
}

function signed(value: number) {
  if (value === 0) return formatMoney(0)
  return `${value > 0 ? "+" : "−"}${formatMoney(value)}`
}

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`
}

function SignedAmount({ value }: { value: number }) {
  const isIn = value > 0
  const isZero = value === 0
  return (
    <span className="inline-flex items-baseline justify-end gap-2 whitespace-nowrap">
      <span className={label}>{isIn || isZero ? "In" : "Out"}</span>
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
  children: ReactNode
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

function WaitingBadge({ children }: { children: ReactNode }) {
  return (
    <Badge
      variant="outline"
      className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label uppercase text-tertiary-foreground"
    >
      {children}
    </Badge>
  )
}

function NavList({ mobile = false }: { mobile?: boolean }) {
  return (
    <ul className={mobile ? "py-2" : "flex gap-6"}>
      {navLinks.map((link) => {
        const current = link.href === currentHref
        return (
          <li key={link.href}>
            <a
              href={link.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "font-mono text-label uppercase transition-colors duration-150",
                focusRing,
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
      })}
    </ul>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-[1200px] items-center gap-6 px-4 py-4 md:px-6">
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground no-underline",
            focusRing
          )}
        >
          Fairhold
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <NavList />
        </nav>
        <p className={cn(smallFigure, "ml-auto hidden md:block")}>
          Hollis &amp; Vane
        </p>
        <Button
          variant="outline"
          className={cn(buttonText, "ml-auto md:hidden")}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
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
          <NavList mobile />
        </div>
      </nav>
    </header>
  )
}

function PageHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <p className={smallFigure}>
          <time dateTime="2026-11-27">Friday 27 November 2026</time>
        </p>
        <h1 className="text-h1">Overview</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href="#"
          className={cn(buttonVariants({ variant: "outline" }), buttonText)}
        >
          New invoice
        </a>
        <a
          href="/payment"
          className={cn(buttonVariants({ variant: "default" }), buttonText)}
        >
          Make a payment
        </a>
      </div>
    </div>
  )
}

function BalanceSheet({
  title,
  amount,
  note,
  display = false,
}: {
  title: string
  amount: string
  note: string
  display?: boolean
}) {
  return (
    <section className={cn(sheet, "flex flex-col gap-1 lg:col-span-4")}>
      <h2 className={label}>{title}</h2>
      <p
        className={cn(
          "font-heading text-h1 tabular-nums text-foreground",
          display && "xl:text-display"
        )}
      >
        {amount}
      </p>
      <p className={smallFigure}>{note}</p>
    </section>
  )
}

function Balances() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <BalanceSheet
        title="Total balance"
        amount="£61,904.27"
        note="Across 2 accounts"
        display
      />
      <BalanceSheet
        title="Current account"
        amount="£48,213.56"
        note="60-14-22 · ending 4417"
      />
      <BalanceSheet
        title="Tax reserve"
        amount="£13,690.71"
        note="Set aside for VAT and tax · ending 8830"
      />
    </div>
  )
}

function MoneyInOut() {
  return (
    <section className={cn(sheet, "flex flex-col gap-3 lg:col-span-8")}>
      <div className={headingRow}>
        <h2 className={label}>Money in and out, November</h2>
        <div className="flex gap-4">
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2 rounded-sm bg-primary"
            />
            <span className={label}>In</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2 rounded-sm bg-destructive"
            />
            <span className={label}>Out</span>
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-1">
            <p className={label}>In this month</p>
            <p className="font-mono text-body tabular-nums text-foreground">
              +£18,420.00
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className={label}>Out this month</p>
            <p className="font-mono text-body tabular-nums text-foreground">
              −£11,962.38
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-end">
          <div aria-hidden="true" className="flex gap-2">
            <div className="relative h-48 w-12 shrink-0">
              <span className={cn(smallFigure, "absolute top-0 right-0")}>
                £8k
              </span>
              <span
                className={cn(
                  smallFigure,
                  "absolute top-1/2 right-0 -translate-y-1/2"
                )}
              >
                £4k
              </span>
              <span className={cn(smallFigure, "absolute right-0 bottom-0")}>
                £0
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="relative h-48">
                <div className="absolute inset-x-0 top-0 border-t border-border" />
                <div className="absolute inset-x-0 top-1/2 border-t border-border" />
                <div className="absolute inset-x-0 bottom-0 border-t border-border" />
                <div className="relative flex h-full gap-4">
                  {weeks.map((week) => (
                    <div
                      key={week.days}
                      className="flex min-w-0 flex-1 items-end gap-1"
                    >
                      <div
                        className="flex-1 bg-primary"
                        style={{
                          height: `${(week.moneyIn / scaleTop) * 100}%`,
                        }}
                      />
                      <div
                        className="flex-1 bg-destructive"
                        style={{
                          height: `${(week.moneyOut / scaleTop) * 100}%`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                {weeks.map((week) => (
                  <p
                    key={week.days}
                    className={cn(
                      smallFigure,
                      "min-w-0 flex-1 text-center whitespace-nowrap",
                      week.current && "text-foreground"
                    )}
                  >
                    {week.days}
                  </p>
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
                {weeks.map((week) => (
                  <tr key={week.days}>
                    <th scope="row" className="font-normal">
                      {week.full}
                    </th>
                    <td>{formatMoney(week.moneyIn)}</td>
                    <td>{formatMoney(week.moneyOut)}</td>
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
  const count = approved ? 2 : 3
  const paragraph = "max-w-lg text-body text-foreground"

  return (
    <section className={cn(sheetWithRows, "lg:col-span-4")}>
      <div className={rowsHeadingRow}>
        <h2 className={label}>Waiting on you</h2>
        <p className={smallFigure}>{plural(count, "item")}</p>
      </div>
      <ul>
        <li className="flex flex-col gap-1 border-t border-border px-6 py-3 first:border-t-0">
          <div className="flex items-start justify-between gap-3">
            <a href="/invoice" className={cn(textLink, "font-mono")}>
              INV-0142
            </a>
            <WaitingBadge>Due</WaitingBadge>
          </div>
          <p className={paragraph}>Larkspur Café owes £1,488.00, due today.</p>
          <p className={smallFigure}>
            Due <time dateTime="2026-11-27">27 Nov 2026</time>
          </p>
        </li>
        <li className="flex flex-col gap-1 border-t border-border px-6 py-3 first:border-t-0">
          <div className="flex items-start justify-between gap-3">
            <a href="#" className={cn(textLink, "font-mono")}>
              INV-0137
            </a>
            <State tone="late">Overdue</State>
          </div>
          <p className={paragraph}>
            Brennan Wholesale owes £640.00, 9 days late.
          </p>
          <p className={smallFigure}>
            Due <time dateTime="2026-11-18">18 Nov 2026</time>
          </p>
        </li>
        <li className="flex flex-col gap-1 border-t border-border px-6 py-3 first:border-t-0">
          <div className="flex items-start justify-between gap-3">
            <p className="text-body text-foreground">Copperleaf Paper Mill</p>
            {approved ? (
              <State tone="settled">Approved</State>
            ) : (
              <WaitingBadge>To approve</WaitingBadge>
            )}
          </div>
          <p className={paragraph}>
            Tom Vane set up a payment of £2,350.00 from the current account, to
            go on 30 November.
          </p>
          <div>
            <Button
              variant="secondary"
              className={buttonText}
              disabled={approved}
              focusableWhenDisabled
              onClick={() => setApproved(true)}
            >
              Approve
            </Button>
            <div role="status">
              {approved && (
                <p className={cn(smallFigure, "mt-2 text-foreground")}>
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
  const edge = "first:pl-6 last:pr-6"
  return (
    <section className={sheetWithRows}>
      <div className={rowsHeadingRow}>
        <h2 className={label}>Recent transactions</h2>
        <a
          href="/transactions"
          className={cn(
            "font-mono text-label uppercase text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
            focusRing
          )}
        >
          All transactions
        </a>
      </div>
      <Table label="Recent transactions" className="text-body">
        <TableHeader>
          <TableRow>
            <TableHead className={cn(label, "px-4", edge)}>Date</TableHead>
            <TableHead className={cn(label, "px-4", edge)}>
              Description
            </TableHead>
            <TableHead className={cn(label, "px-4", edge)}>Account</TableHead>
            <TableHead className={cn(label, "px-4 text-right", edge)}>
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={`${t.date}-${t.party}`}>
              <TableCell className={cn("px-4 py-2", edge)}>
                <time dateTime={t.date} className="font-mono tabular-nums">
                  {t.shortDate}
                </time>
              </TableCell>
              <TableCell className={cn("px-4 py-2", edge)}>
                <div className="flex flex-col gap-1">
                  <span>{t.party}</span>
                  <span className={smallFigure}>{t.reference}</span>
                </div>
              </TableCell>
              <TableCell className={cn("px-4 py-2", edge)}>
                {t.account}
              </TableCell>
              <TableCell className={cn("px-4 py-2 text-right", edge)}>
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
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 md:px-6">
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
        <div className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-6">
          <p className={smallFigure}>
            Fairhold · A demo. No money moves. · 2026
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
