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

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focus
)
const label = "font-mono text-label uppercase text-muted-foreground"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const sheet = "rounded-xl border border-border bg-card p-6"
const sheetWithRows = "overflow-hidden rounded-xl border border-border bg-card"
const headingRow = "flex min-h-8 flex-wrap items-center justify-between gap-3"
const rowsHeadingRow = cn(headingRow, "border-b border-border px-6 pt-6 pb-3")
const buttonText = "px-4 font-mono text-label uppercase"
const badgeClass =
  "h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label uppercase text-tertiary-foreground"
const container = "mx-auto w-full max-w-[1200px] px-4 md:px-6"

const navLinks = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Invoices", href: "/invoice" },
  { label: "Payments", href: "/payment" },
  { label: "Reports", href: "/report" },
]
const currentPath = "/"

// Money in and out per week of November 2026, in pence.
// The weeks add up to the month: in £18,420.00, out £11,962.38.
const weeks = [
  { days: "2–8", name: "2 to 8 November", inPence: 320000, outPence: 231055 },
  { days: "9–15", name: "9 to 15 November", inPence: 685000, outPence: 120418 },
  {
    days: "16–22",
    name: "16 to 22 November",
    inPence: 252000,
    outPence: 593125,
  },
  {
    days: "23–27",
    name: "23 to 27 November (to date)",
    inPence: 585000,
    outPence: 251640,
    toDate: true,
  },
]
const scaleTopPence = 800000

const transactions = [
  {
    date: "2026-11-26",
    shortDate: "26 Nov",
    party: "Northgate Books",
    reference: "INV-0139",
    account: "Current",
    pence: 360000,
  },
  {
    date: "2026-11-25",
    shortDate: "25 Nov",
    party: "Mortlake Paper Co.",
    reference: "Order 5521, cotton stock",
    account: "Current",
    pence: -61240,
  },
  {
    date: "2026-11-24",
    shortDate: "24 Nov",
    party: "Gridline Software",
    reference: "Design suite, November",
    account: "Current",
    pence: -5400,
  },
  {
    date: "2026-11-23",
    shortDate: "23 Nov",
    party: "Oriel Theatre",
    reference: "INV-0138",
    account: "Current",
    pence: 225000,
  },
  {
    date: "2026-11-23",
    shortDate: "23 Nov",
    party: "Kestrel Yard Studios",
    reference: "Studio rent, December",
    account: "Current",
    pence: -185000,
  },
  {
    date: "2026-11-20",
    shortDate: "20 Nov",
    party: "VAT payment",
    reference: "VAT return, Jul–Sep 2026",
    account: "Tax reserve",
    pence: -418640,
  },
]

function pounds(pence: number) {
  return (
    "£" +
    (Math.abs(pence) / 100).toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  )
}

function signed(pence: number) {
  if (pence === 0) return pounds(0)
  return (pence > 0 ? "+" : "−") + pounds(pence)
}

function SignedAmount({ pence }: { pence: number }) {
  const word = pence < 0 ? "Out" : "In"
  return (
    <span className="inline-flex items-baseline justify-end gap-2 whitespace-nowrap">
      <span className={label}>{word}</span>
      <span
        className={cn(
          "font-mono tabular-nums",
          pence > 0 && "text-primary",
          pence < 0 && "text-destructive"
        )}
      >
        {signed(pence)}
      </span>
    </span>
  )
}

function State({ word, mark }: { word: string; mark: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-sm", mark)}
      />
      <span className="text-body text-foreground">{word}</span>
    </span>
  )
}

function NavList({
  className,
  linkClassName,
}: {
  className?: string
  linkClassName?: string
}) {
  return (
    <ul className={className}>
      {navLinks.map((link) => {
        const current = link.href === currentPath
        return (
          <li key={link.href}>
            <a
              href={link.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "font-mono text-label uppercase transition-colors duration-150",
                focus,
                current
                  ? "text-foreground underline underline-offset-4"
                  : "text-muted-foreground hover:text-foreground",
                linkClassName
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

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!open || event.key !== "Escape") return
    setOpen(false)
    menuButton.current?.focus()
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div className={cn(container, "flex items-center gap-6 py-4")}>
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground no-underline transition-colors duration-150",
            focus
          )}
        >
          Fairhold
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <NavList className="flex gap-6" />
        </nav>
        <p className={cn(smallFigure, "ml-auto hidden md:block")}>
          Hollis &amp; Vane
        </p>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={open}
          aria-controls="menu-nav"
          onClick={() => setOpen((value) => !value)}
          className={cn(buttonText, "ml-auto md:hidden")}
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
        <div className={container}>
          <NavList className="py-2" linkClassName="block py-2" />
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
  id,
  title,
  figure,
  display,
  note,
}: {
  id: string
  title: string
  figure: string
  display?: boolean
  note: string
}) {
  return (
    <section
      aria-labelledby={id}
      className={cn(sheet, "flex flex-col gap-1 lg:col-span-4")}
    >
      <h2 id={id} className={label}>
        {title}
      </h2>
      <p
        className={cn(
          "font-heading text-h1 text-foreground tabular-nums",
          display && "xl:text-display"
        )}
      >
        {figure}
      </p>
      <p className={smallFigure}>{note}</p>
    </section>
  )
}

function Balances() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <BalanceSheet
        id="balance-total"
        title="Total balance"
        figure="£61,904.27"
        display
        note="Across 2 accounts"
      />
      <BalanceSheet
        id="balance-current"
        title="Current account"
        figure="£48,213.56"
        note="60-14-22 · ending 4417"
      />
      <BalanceSheet
        id="balance-tax"
        title="Tax reserve"
        figure="£13,690.71"
        note="Set aside for VAT and tax · ending 8830"
      />
    </div>
  )
}

function LegendItem({ word, mark }: { word: string; mark: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className={cn("size-2 rounded-sm", mark)} />
      <span className={label}>{word}</span>
    </span>
  )
}

function share(pence: number) {
  return `${(pence / scaleTopPence) * 100}%`
}

function MoneyInOut() {
  return (
    <section
      aria-labelledby="money-heading"
      className={cn(sheet, "flex flex-col gap-3 lg:col-span-8")}
    >
      <div className={headingRow}>
        <h2 id="money-heading" className={label}>
          Money in and out, November
        </h2>
        <div className="flex gap-4">
          <LegendItem word="In" mark="bg-primary" />
          <LegendItem word="Out" mark="bg-destructive" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-1">
            <p className={label}>In this month</p>
            <p className="font-mono text-body text-foreground tabular-nums">
              +£18,420.00
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className={label}>Out this month</p>
            <p className="font-mono text-body text-foreground tabular-nums">
              {"−"}£11,962.38
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
                      className="flex h-full min-w-0 flex-1 items-end gap-1"
                    >
                      <div
                        className="flex-1 bg-primary"
                        style={{ height: share(week.inPence) }}
                      />
                      <div
                        className="flex-1 bg-destructive"
                        style={{ height: share(week.outPence) }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                {weeks.map((week) => (
                  <div
                    key={week.days}
                    className={cn(
                      smallFigure,
                      "min-w-0 flex-1 text-center whitespace-nowrap",
                      week.toDate && "text-foreground"
                    )}
                  >
                    {week.days}
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                {weeks.map((week) => (
                  <tr key={week.days}>
                    <th scope="row" className="font-normal">
                      {week.name}
                    </th>
                    <td>{signed(week.inPence)}</td>
                    <td>{signed(-week.outPence)}</td>
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
    <section
      aria-labelledby="waiting-heading"
      className={cn(sheetWithRows, "lg:col-span-4")}
    >
      <div className={rowsHeadingRow}>
        <h2 id="waiting-heading" className={label}>
          Waiting on you
        </h2>
        <p className={smallFigure}>
          {count} {count === 1 ? "item" : "items"}
        </p>
      </div>
      <ul>
        <li className="flex flex-col gap-1 px-6 py-3">
          <div className="flex items-start justify-between gap-3">
            <a
              href="/invoice"
              className={cn(textLink, "font-mono tabular-nums")}
            >
              INV-0142
            </a>
            <Badge variant="outline" className={badgeClass}>
              Due
            </Badge>
          </div>
          <p className="max-w-lg text-body text-foreground">
            Larkspur Café owes £1,488.00, due today.
          </p>
          <p className={smallFigure}>
            Due <time dateTime="2026-11-27">27 Nov 2026</time>
          </p>
        </li>
        <li className="flex flex-col gap-1 border-t border-border px-6 py-3">
          <div className="flex items-start justify-between gap-3">
            <a href="#" className={cn(textLink, "font-mono tabular-nums")}>
              INV-0137
            </a>
            <State word="Overdue" mark="bg-destructive" />
          </div>
          <p className="max-w-lg text-body text-foreground">
            Brennan Wholesale owes £640.00, 9 days late.
          </p>
          <p className={smallFigure}>
            Due <time dateTime="2026-11-18">18 Nov 2026</time>
          </p>
        </li>
        <li className="flex flex-col gap-3 border-t border-border px-6 py-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between gap-3">
              <p className="text-body text-foreground">Copperleaf Paper Mill</p>
              {approved ? (
                <State word="Approved" mark="bg-primary" />
              ) : (
                <Badge variant="outline" className={badgeClass}>
                  To approve
                </Badge>
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
              className={buttonText}
              disabled={approved}
              focusableWhenDisabled
              onClick={() => setApproved(true)}
            >
              Approve
            </Button>
            <div role="status">
              {approved ? (
                <p className={cn(smallFigure, "mt-2 text-foreground")}>
                  Approved. It goes on 30 November.
                </p>
              ) : null}
            </div>
          </div>
        </li>
      </ul>
    </section>
  )
}

function RecentTransactions() {
  const edge = "px-4 first:pl-6 last:pr-6"
  return (
    <section aria-labelledby="recent-heading" className={sheetWithRows}>
      <div className={rowsHeadingRow}>
        <h2 id="recent-heading" className={label}>
          Recent transactions
        </h2>
        <a
          href="/transactions"
          className={cn("font-mono text-label uppercase", textLink)}
        >
          All transactions
        </a>
      </div>
      <Table label="Recent transactions" className="text-body">
        <TableHeader>
          <TableRow>
            <TableHead className={cn(label, edge)}>Date</TableHead>
            <TableHead className={cn(label, edge)}>Description</TableHead>
            <TableHead className={cn(label, edge)}>Account</TableHead>
            <TableHead className={cn(label, edge, "text-right")}>
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((row) => (
            <TableRow key={row.party + row.date}>
              <TableCell className={cn(edge, "py-2 font-mono tabular-nums")}>
                <time dateTime={row.date}>{row.shortDate}</time>
              </TableCell>
              <TableCell className={cn(edge, "py-2")}>
                <div className="flex flex-col gap-1">
                  <span>{row.party}</span>
                  <span className={smallFigure}>{row.reference}</span>
                </div>
              </TableCell>
              <TableCell className={cn(edge, "py-2")}>{row.account}</TableCell>
              <TableCell className={cn(edge, "py-2 text-right")}>
                <SignedAmount pence={row.pence} />
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
        <div className={cn(container, "flex flex-col gap-6")}>
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
        <div className={cn(container, "py-6")}>
          <p className={smallFigure}>
            Fairhold · A demo. No money moves. · 2026
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
