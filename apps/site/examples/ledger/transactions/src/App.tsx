import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type Account = "current" | "tax"
type AccountFilter = "all" | Account
type Direction = "all" | "in" | "out"

type Transaction = {
  id: number
  date: string
  description: string
  reference: string
  account: Account
  // In pence: positive is money in, negative is money out.
  amount: number
}

// Newest first. The statement runs from 30 October to 27 November 2026.
const transactions: Transaction[] = [
  { id: 28, date: "2026-11-27", description: "Larkspur Café", reference: "INV-0139", account: "current", amount: 124050 },
  { id: 27, date: "2026-11-26", description: "Copperleaf Paper Mill", reference: "CPM-20871", account: "current", amount: -68420 },
  { id: 26, date: "2026-11-25", description: "Tillbrook Card Services", reference: "FEES NOV", account: "current", amount: -3860 },
  { id: 25, date: "2026-11-24", description: "To tax reserve", reference: "TAX NOV", account: "current", amount: -90000 },
  { id: 24, date: "2026-11-24", description: "From current account", reference: "TAX NOV", account: "tax", amount: 90000 },
  { id: 23, date: "2026-11-23", description: "Brennan Wholesale", reference: "INV-0138", account: "current", amount: 286000 },
  { id: 22, date: "2026-11-20", description: "Marlowe Inks", reference: "MI-4402", account: "current", amount: -31275 },
  { id: 21, date: "2026-11-19", description: "Odell & Pryce Architects", reference: "INV-0136", account: "current", amount: 197500 },
  { id: 20, date: "2026-11-18", description: "Pressroom Cloud", reference: "SUB-118820", account: "current", amount: -4900 },
  { id: 19, date: "2026-11-17", description: "Harrow Van Leasing", reference: "LEASE NOV", account: "current", amount: -28640 },
  { id: 18, date: "2026-11-16", description: "Larkspur Café", reference: "INV-0135", account: "current", amount: 42000 },
  { id: 17, date: "2026-11-13", description: "Copperleaf Paper Mill", reference: "CPM-20744", account: "current", amount: -52990 },
  { id: 16, date: "2026-11-12", description: "Brennan Wholesale", reference: "INV-0134", account: "current", amount: 148025 },
  { id: 15, date: "2026-11-11", description: "Foldline Type Library", reference: "LIC-2291", account: "current", amount: -12000 },
  { id: 14, date: "2026-11-10", description: "Fairhold interest", reference: "INT OCT", account: "tax", amount: 684 },
  { id: 13, date: "2026-11-09", description: "Odell & Pryce Architects", reference: "INV-0132", account: "current", amount: 320000 },
  { id: 12, date: "2026-11-06", description: "Marlowe Inks", reference: "MI-4317", account: "current", amount: -19830 },
  { id: 11, date: "2026-11-05", description: "Wexcombe Estates", reference: "RENT NOV", account: "current", amount: -115000 },
  { id: 10, date: "2026-11-04", description: "Larkspur Café", reference: "INV-0131", account: "current", amount: 61500 },
  { id: 9, date: "2026-11-03", description: "To tax reserve", reference: "TAX OCT", account: "current", amount: -75000 },
  { id: 8, date: "2026-11-03", description: "From current account", reference: "TAX OCT", account: "tax", amount: 75000 },
  { id: 7, date: "2026-11-03", description: "Brennan Wholesale", reference: "INV-0130", account: "current", amount: 98000 },
  { id: 6, date: "2026-11-02", description: "Tillbrook Card Services", reference: "FEES OCT", account: "current", amount: -4115 },
  { id: 5, date: "2026-11-02", description: "Copperleaf Paper Mill", reference: "CPM-20610", account: "current", amount: -74200 },
  { id: 4, date: "2026-10-30", description: "Odell & Pryce Architects", reference: "INV-0129", account: "current", amount: 134000 },
  { id: 3, date: "2026-10-30", description: "Harrow Van Leasing", reference: "LEASE OCT", account: "current", amount: -28640 },
  { id: 2, date: "2026-10-30", description: "Pressroom Cloud", reference: "SUB-117302", account: "current", amount: -4900 },
  { id: 1, date: "2026-10-30", description: "Dunmore Couriers", reference: "DC-55120", account: "current", amount: -6480 },
]

const PAGE_SIZE = 10

const navLinks = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Invoices", href: "/invoice" },
  { label: "Payments", href: "/payment" },
  { label: "Reports", href: "/report" },
]
const CURRENT_PATH = "/transactions"

const accountChoices: { value: AccountFilter; label: string }[] = [
  { value: "all", label: "All accounts" },
  { value: "current", label: "Current account" },
  { value: "tax", label: "Tax reserve" },
]

const directionChoices: { value: Direction; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in", label: "In" },
  { value: "out", label: "Out" },
]

const accountNames: Record<Account, string> = {
  current: "Current",
  tax: "Tax reserve",
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const container = "mx-auto w-full max-w-[1200px] px-4 md:px-6"
const label = "font-mono text-label uppercase text-muted-foreground"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const buttonText = "px-4 font-mono text-label uppercase"
const bodyCell = "px-4 py-2 first:pl-6 last:pr-6"
const totalCell = "border-t-4 border-double border-foreground"

// "2026-11-27" to "27 Nov".
function shortDate(iso: string) {
  const [, month, day] = iso.split("-")
  return `${Number(day)} ${months[Number(month) - 1]}`
}

// Pence to "£1,240.50", without a sign.
function pounds(pence: number) {
  const whole = Math.floor(Math.abs(pence) / 100).toLocaleString("en-GB")
  const rest = String(Math.abs(pence) % 100).padStart(2, "0")
  return `£${whole}.${rest}`
}

function navLinkClass(href: string) {
  return cn(
    "font-mono text-label uppercase transition-colors duration-150",
    focusOutline,
    href === CURRENT_PATH
      ? "text-foreground underline underline-offset-4"
      : "text-muted-foreground hover:text-foreground"
  )
}

// The word first, then the figure, so the digits keep the column's right edge.
function SignedAmount({
  direction,
  pence,
}: {
  direction: "in" | "out"
  pence: number
}) {
  const sum = Math.abs(pence)
  return (
    <span className="inline-flex items-baseline justify-end gap-2 whitespace-nowrap">
      <span className={label}>{direction === "in" ? "In" : "Out"}</span>
      <span
        className={cn(
          "font-mono tabular-nums",
          sum === 0
            ? "text-foreground"
            : direction === "in"
              ? "text-primary"
              : "text-destructive"
        )}
      >
        {sum === 0 ? "" : direction === "in" ? "+" : "−"}
        {pounds(sum)}
      </span>
    </span>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [account, setAccount] = useState<AccountFilter>("all")
  const [direction, setDirection] = useState<Direction>("all")
  const [page, setPage] = useState(1)
  const searchRef = useRef<HTMLInputElement>(null)

  const query = search.trim().toLowerCase()
  const filterSet = query !== "" || account !== "all" || direction !== "all"

  const matching = transactions.filter((row) => {
    if (account !== "all" && row.account !== account) return false
    if (direction === "in" && row.amount < 0) return false
    if (direction === "out" && row.amount > 0) return false
    if (query === "") return true
    return (
      row.description.toLowerCase().includes(query) ||
      row.reference.toLowerCase().includes(query)
    )
  })

  const count = matching.length
  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE))
  const first = (page - 1) * PAGE_SIZE
  const shown = matching.slice(first, first + PAGE_SIZE)
  const range =
    count === 0
      ? "0 of 0"
      : shown.length === 1
        ? `${first + 1} of ${count}`
        : `${first + 1}–${first + shown.length} of ${count}`

  let moneyIn = 0
  let moneyOut = 0
  for (const row of matching) {
    if (row.amount > 0) moneyIn += row.amount
    else moneyOut -= row.amount
  }
  const net = moneyIn - moneyOut

  function clearFilters() {
    setSearch("")
    setAccount("all")
    setDirection("all")
    setPage(1)
    searchRef.current?.focus()
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div className={cn(container, "flex items-center gap-6 py-4")}>
          <a
            href="/"
            className={cn("font-heading text-h2 text-foreground", focusOutline)}
          >
            Fairhold
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={
                      link.href === CURRENT_PATH ? "page" : undefined
                    }
                    className={navLinkClass(link.href)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className={cn(smallFigure, "ml-auto hidden md:block")}>
            Hollis &amp; Vane
          </p>
          <Button
            variant="outline"
            className={cn(buttonText, "ml-auto md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
        >
          <div className={container}>
            <ul className="py-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={
                      link.href === CURRENT_PATH ? "page" : undefined
                    }
                    className={cn("block py-2", navLinkClass(link.href))}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className="flex-1 py-6 md:py-12">
        <div className={cn(container, "flex flex-col gap-6")}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className={smallFigure}>
                <time dateTime="2026-10-30">30 Oct</time> –{" "}
                <time dateTime="2026-11-27">27 Nov 2026</time>
              </p>
              <h1 className="text-h1">Transactions</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className={buttonText}>
                Export CSV
              </Button>
            </div>
          </div>

          <section
            aria-label="Filters"
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex w-full flex-col gap-3 md:w-64">
                <label htmlFor="search" className={cn("block", label)}>
                  Search
                </label>
                <div className="flex flex-col gap-2">
                  <Input
                    ref={searchRef}
                    id="search"
                    type="text"
                    autoComplete="off"
                    placeholder="Payee or reference"
                    className="px-2 text-body md:text-body"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value)
                      setPage(1)
                    }}
                  />
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 md:w-48">
                <label htmlFor="account" className={cn("block", label)}>
                  Account
                </label>
                <div className="flex flex-col gap-2">
                  <Select
                    items={accountChoices}
                    value={account}
                    onValueChange={(value) => {
                      if (value === null) return
                      setAccount(value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger id="account">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accountChoices.map((choice) => (
                        <SelectItem key={choice.value} value={choice.value}>
                          {choice.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p id="direction-label" className={label}>
                  In or out
                </p>
                <div
                  role="group"
                  aria-labelledby="direction-label"
                  className="flex flex-wrap gap-1"
                >
                  {directionChoices.map((choice) => (
                    <Button
                      key={choice.value}
                      variant={
                        direction === choice.value ? "secondary" : "outline"
                      }
                      aria-pressed={direction === choice.value}
                      className={buttonText}
                      onClick={() => {
                        setDirection(choice.value)
                        setPage(1)
                      }}
                    >
                      {choice.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="w-full md:ml-auto md:w-auto">
                <Button
                  variant="outline"
                  className={buttonText}
                  disabled={!filterSet}
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="statement-heading"
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="flex min-h-8 flex-wrap items-center justify-between gap-3 border-b border-border px-6 pt-6 pb-3">
              <h2 id="statement-heading" className={label}>
                Statement
              </h2>
              <p aria-live="polite" className={smallFigure}>
                {range}
              </p>
            </div>

            <Table label="Statement" className="text-body">
              <TableHeader>
                <TableRow>
                  <TableHead className={cn("px-4 first:pl-6 last:pr-6", label)}>
                    Date
                  </TableHead>
                  <TableHead className={cn("px-4 first:pl-6 last:pr-6", label)}>
                    Description
                  </TableHead>
                  <TableHead className={cn("px-4 first:pl-6 last:pr-6", label)}>
                    Reference
                  </TableHead>
                  <TableHead className={cn("px-4 first:pl-6 last:pr-6", label)}>
                    Account
                  </TableHead>
                  <TableHead
                    className={cn(
                      "px-4 text-right first:pl-6 last:pr-6",
                      label
                    )}
                  >
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {count === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="px-6 py-12 whitespace-normal"
                    >
                      <div className="flex flex-col items-start gap-3">
                        <p className="text-body">
                          No transactions match these filters.
                        </p>
                        <Button
                          variant="outline"
                          className={buttonText}
                          onClick={clearFilters}
                        >
                          Clear filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  shown.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className={bodyCell}>
                        <time
                          dateTime={row.date}
                          className="font-mono tabular-nums"
                        >
                          {shortDate(row.date)}
                        </time>
                      </TableCell>
                      <TableCell className={bodyCell}>
                        {row.description}
                      </TableCell>
                      <TableCell className={cn(bodyCell, smallFigure)}>
                        {row.reference}
                      </TableCell>
                      <TableCell className={bodyCell}>
                        {accountNames[row.account]}
                      </TableCell>
                      <TableCell className={cn(bodyCell, "text-right")}>
                        <SignedAmount
                          direction={row.amount > 0 ? "in" : "out"}
                          pence={row.amount}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              {count > 0 && (
                <TableFooter className="bg-transparent font-normal">
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className={cn(bodyCell, label)}>
                      Money in
                    </TableCell>
                    <TableCell className={cn(bodyCell, "text-right")}>
                      <SignedAmount direction="in" pence={moneyIn} />
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className={cn(bodyCell, label)}>
                      Money out
                    </TableCell>
                    <TableCell className={cn(bodyCell, "text-right")}>
                      <SignedAmount direction="out" pence={moneyOut} />
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className={cn(bodyCell, totalCell)}>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-heading text-h2 tabular-nums">
                          {net > 0 ? "Net in" : net < 0 ? "Net out" : "Net"}
                        </span>
                        <span className={smallFigure}>
                          {count === 1
                            ? "1 transaction"
                            : `${count} transactions`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        bodyCell,
                        totalCell,
                        "text-right font-heading text-h2 tabular-nums",
                        net > 0
                          ? "text-primary"
                          : net < 0
                            ? "text-destructive"
                            : "text-foreground"
                      )}
                    >
                      {net > 0 ? "+" : net < 0 ? "−" : ""}
                      {pounds(net)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-3">
              <p className={smallFigure}>
                Page {page} of {pageCount}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className={buttonText}
                  focusableWhenDisabled
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className={buttonText}
                  focusableWhenDisabled
                  disabled={page >= pageCount}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </section>
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
