import * as React from "react"

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

type AccountId = "current" | "tax"
type AccountFilter = "all" | AccountId
type Direction = "all" | "in" | "out"

type Transaction = {
  id: number
  date: string
  description: string
  reference: string
  account: AccountId
  /** Amount in pence: positive for money in, negative for money out. */
  amount: number
}

const PAGE_SIZE = 10

const TRANSACTIONS: Transaction[] = [
  { date: "2026-11-27", description: "Larkspur Café", reference: "INV-0146", account: "current", amount: 48000 },
  { date: "2026-11-26", description: "Copperleaf Paper Mill", reference: "CPM-55821", account: "current", amount: -61240 },
  { date: "2026-11-25", description: "To tax reserve", reference: "TAX SAVE NOV", account: "current", amount: -150000 },
  { date: "2026-11-25", description: "From current account", reference: "TAX SAVE NOV", account: "tax", amount: 150000 },
  { date: "2026-11-24", description: "Brennan Wholesale", reference: "INV-0145", account: "current", amount: 234000 },
  { date: "2026-11-23", description: "Tillpoint card fees", reference: "FEES WK47", account: "current", amount: -3865 },
  { date: "2026-11-20", description: "Inkwell Supply Co.", reference: "ISC-30417", account: "current", amount: -18690 },
  { date: "2026-11-19", description: "Odell & Pryce Architects", reference: "INV-0144", account: "current", amount: 315000 },
  { date: "2026-11-18", description: "Northgate Van Leasing", reference: "VAN NOV", account: "current", amount: -32900 },
  { date: "2026-11-17", description: "Larkspur Café", reference: "INV-0143", account: "current", amount: 26500 },
  { date: "2026-11-16", description: "Tillpoint card fees", reference: "FEES WK46", account: "current", amount: -2710 },
  { date: "2026-11-13", description: "Fieldmark Design Suite", reference: "FDS-2611", account: "current", amount: -5400 },
  { date: "2026-11-12", description: "Copperleaf Paper Mill", reference: "CPM-55607", account: "current", amount: -84820 },
  { date: "2026-11-10", description: "Brennan Wholesale", reference: "INV-0142", account: "current", amount: 187550 },
  { date: "2026-11-09", description: "VAT for July to September", reference: "VAT Q3 2026", account: "tax", amount: -296480 },
  { date: "2026-11-09", description: "Tillpoint card fees", reference: "FEES WK45", account: "current", amount: -3120 },
  { date: "2026-11-06", description: "Odell & Pryce Architects", reference: "INV-0141", account: "current", amount: 142000 },
  { date: "2026-11-05", description: "Inkwell Supply Co.", reference: "ISC-30288", account: "current", amount: -9430 },
  { date: "2026-11-03", description: "Ashby Row Properties", reference: "RENT NOV", account: "current", amount: -165000 },
  { date: "2026-11-02", description: "Proofline Cloud", reference: "PLC-88213", account: "current", amount: -2280 },
  { date: "2026-11-02", description: "Larkspur Café", reference: "INV-0140", account: "current", amount: 31000 },
  { date: "2026-11-02", description: "Tillpoint card fees", reference: "FEES WK44", account: "current", amount: -2945 },
  { date: "2026-11-01", description: "Reserve interest", reference: "INT OCT", account: "tax", amount: 412 },
  { date: "2026-10-31", description: "To tax reserve", reference: "TAX SAVE OCT", account: "current", amount: -120000 },
  { date: "2026-10-31", description: "From current account", reference: "TAX SAVE OCT", account: "tax", amount: 120000 },
  { date: "2026-10-30", description: "Brennan Wholesale", reference: "INV-0139", account: "current", amount: 96000 },
  { date: "2026-10-30", description: "Copperleaf Paper Mill", reference: "CPM-55402", account: "current", amount: -40275 },
  { date: "2026-10-30", description: "Odell & Pryce Architects", reference: "INV-0138", account: "current", amount: 88000 },
].map((t, i) => ({ ...t, id: i + 1 }) as Transaction)

const ACCOUNT_ITEMS: { value: AccountFilter; label: string }[] = [
  { value: "all", label: "All accounts" },
  { value: "current", label: "Current account" },
  { value: "tax", label: "Tax reserve" },
]

const ACCOUNT_NAMES: Record<AccountId, string> = {
  current: "Current",
  tax: "Tax reserve",
}

const DIRECTIONS: { value: Direction; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in", label: "In" },
  { value: "out", label: "Out" },
]

const NAV_LINKS = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Invoices", href: "/invoice" },
  { label: "Payments", href: "/payment" },
  { label: "Reports", href: "/report" },
]
const CURRENT_PATH = "/transactions"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const CONTAINER = "mx-auto w-full max-w-[1200px] px-4 md:px-6"
const LABEL = "font-mono text-label uppercase text-muted-foreground"
const SMALL = "font-mono text-label tabular-nums text-muted-foreground"
const BUTTON = "px-4 font-mono text-label uppercase"
const CELL = "px-4 py-2 first:pl-6 last:pr-6"
const HEAD = cn(LABEL, "px-4 first:pl-6 last:pr-6")

const pounds = new Intl.NumberFormat("en-GB", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatPounds(pence: number) {
  return `£${pounds.format(Math.abs(pence) / 100)}`
}

function shortDate(iso: string) {
  const [, month, day] = iso.split("-")
  return `${Number(day)} ${MONTHS[Number(month) - 1]}`
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

function SignedAmount({ pence, direction }: { pence: number; direction: "in" | "out" }) {
  const zero = pence === 0
  const sign = zero ? "" : direction === "in" ? "+" : "−"
  return (
    <span className="inline-flex items-baseline justify-end gap-2 whitespace-nowrap">
      <span className={LABEL}>{direction === "in" ? "In" : "Out"}</span>
      <span
        className={cn(
          "font-mono tabular-nums",
          !zero && (direction === "in" ? "text-primary" : "text-destructive")
        )}
      >
        {sign}
        {formatPounds(pence)}
      </span>
    </span>
  )
}

function NavLinks({ itemClassName }: { itemClassName?: string }) {
  return NAV_LINKS.map((link) => {
    const current = link.href === CURRENT_PATH
    return (
      <li key={link.href}>
        <a
          href={link.href}
          aria-current={current ? "page" : undefined}
          className={cn(
            LABEL,
            "transition-colors duration-150",
            current
              ? "text-foreground underline underline-offset-4"
              : "hover:text-foreground",
            FOCUS,
            itemClassName
          )}
        >
          {link.label}
        </a>
      </li>
    )
  })
}

function SiteHeader() {
  const [open, setOpen] = React.useState(false)
  const menuButton = React.useRef<HTMLButtonElement>(null)

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (!open || event.key !== "Escape") return
    setOpen(false)
    menuButton.current?.focus()
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div className={cn(CONTAINER, "flex items-center gap-6 py-4")}>
        <a
          href="/"
          className={cn("font-heading text-h2 text-foreground no-underline", FOCUS)}
        >
          Fairhold
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            <NavLinks />
          </ul>
        </nav>
        <p className={cn(SMALL, "ml-auto hidden md:block")}>Hollis &amp; Vane</p>
        <Button
          ref={menuButton}
          variant="outline"
          className={cn(BUTTON, "ml-auto md:hidden")}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
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
          <ul className="py-2">
            <NavLinks itemClassName="block py-2" />
          </ul>
        </div>
      </nav>
    </header>
  )
}

export function App() {
  const [search, setSearch] = React.useState("")
  const [account, setAccount] = React.useState<AccountFilter>("all")
  const [direction, setDirection] = React.useState<Direction>("all")
  const [page, setPage] = React.useState(0)
  const searchRef = React.useRef<HTMLInputElement>(null)

  const query = search.trim().toLowerCase()
  const filterSet = query !== "" || account !== "all" || direction !== "all"

  const matches = React.useMemo(
    () =>
      TRANSACTIONS.filter((t) => {
        if (account !== "all" && t.account !== account) return false
        if (direction === "in" && t.amount <= 0) return false
        if (direction === "out" && t.amount >= 0) return false
        if (
          query !== "" &&
          !t.description.toLowerCase().includes(query) &&
          !t.reference.toLowerCase().includes(query)
        )
          return false
        return true
      }),
    [query, account, direction]
  )

  const count = matches.length
  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE))
  const current = Math.min(page, pageCount - 1)
  const rows = matches.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE)
  const first = current * PAGE_SIZE + 1
  const last = current * PAGE_SIZE + rows.length
  const range =
    count === 0 ? "0 of 0" : first === last ? `${first} of ${count}` : `${first}–${last} of ${count}`

  const moneyIn = matches.reduce((sum, t) => (t.amount > 0 ? sum + t.amount : sum), 0)
  const moneyOut = matches.reduce((sum, t) => (t.amount < 0 ? sum - t.amount : sum), 0)
  const net = moneyIn - moneyOut

  function clearFilters() {
    setSearch("")
    setAccount("all")
    setDirection("all")
    setPage(0)
    searchRef.current?.focus()
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <SiteHeader />

      <main className="flex-1 py-6 md:py-12">
        <div className={cn(CONTAINER, "flex flex-col gap-6")}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className={SMALL}>
                <time dateTime="2026-10-30">30 Oct</time> –{" "}
                <time dateTime="2026-11-27">27 Nov 2026</time>
              </p>
              <h1 className="text-h1">Transactions</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className={BUTTON}>
                Export CSV
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex w-full flex-col gap-3 md:w-64">
                <label htmlFor="search" className={cn(LABEL, "block")}>
                  Search
                </label>
                <Input
                  ref={searchRef}
                  id="search"
                  type="search"
                  placeholder="Payee or reference"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(0)
                  }}
                  className="px-2 text-body md:text-body [&::-webkit-search-cancel-button]:appearance-none"
                />
              </div>

              <div className="flex w-full flex-col gap-3 md:w-48">
                <label id="account-label" htmlFor="account" className={cn(LABEL, "block")}>
                  Account
                </label>
                <Select
                  items={ACCOUNT_ITEMS}
                  value={account}
                  onValueChange={(value) => {
                    if (value === null) return
                    setAccount(value as AccountFilter)
                    setPage(0)
                  }}
                >
                  <SelectTrigger id="account" aria-labelledby="account-label">
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
              </div>

              <div className="flex flex-col gap-3">
                <p id="direction-label" className={LABEL}>
                  In or out
                </p>
                <div role="group" aria-labelledby="direction-label" className="flex flex-wrap gap-1">
                  {DIRECTIONS.map((choice) => {
                    const chosen = direction === choice.value
                    return (
                      <Button
                        key={choice.value}
                        variant={chosen ? "secondary" : "outline"}
                        aria-pressed={chosen}
                        className={BUTTON}
                        onClick={() => {
                          setDirection(choice.value)
                          setPage(0)
                        }}
                      >
                        {choice.label}
                      </Button>
                    )
                  })}
                </div>
              </div>

              <div className="w-full md:ml-auto md:w-auto">
                <Button
                  variant="outline"
                  className={BUTTON}
                  disabled={!filterSet}
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              </div>
            </div>
          </div>

          <section
            aria-labelledby="statement-heading"
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="flex min-h-8 flex-wrap items-center justify-between gap-3 border-b border-border px-6 pt-6 pb-3">
              <h2 id="statement-heading" className={LABEL}>
                Statement
              </h2>
              <p aria-live="polite" className={SMALL}>
                {range}
              </p>
            </div>

            <Table label="Statement" className="text-body">
              <TableHeader>
                <TableRow>
                  <TableHead className={HEAD}>Date</TableHead>
                  <TableHead className={HEAD}>Description</TableHead>
                  <TableHead className={HEAD}>Reference</TableHead>
                  <TableHead className={HEAD}>Account</TableHead>
                  <TableHead className={cn(HEAD, "text-right")}>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {count === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="px-6 py-12 whitespace-normal">
                      <div className="flex flex-col items-start gap-3">
                        <p className="text-body">No transactions match these filters.</p>
                        <Button variant="outline" className={BUTTON} onClick={clearFilters}>
                          Clear filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className={cn(CELL, "font-mono tabular-nums")}>
                        <time dateTime={t.date}>{shortDate(t.date)}</time>
                      </TableCell>
                      <TableCell className={cn(CELL, "text-body")}>{t.description}</TableCell>
                      <TableCell className={cn(CELL, SMALL)}>{t.reference}</TableCell>
                      <TableCell className={CELL}>{ACCOUNT_NAMES[t.account]}</TableCell>
                      <TableCell className={cn(CELL, "text-right")}>
                        <SignedAmount pence={t.amount} direction={t.amount > 0 ? "in" : "out"} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              {count > 0 && (
                <TableFooter className="bg-transparent font-normal">
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className={cn(CELL, LABEL)}>
                      Money in
                    </TableCell>
                    <TableCell className={cn(CELL, "text-right")}>
                      <SignedAmount pence={moneyIn} direction="in" />
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className={cn(CELL, LABEL)}>
                      Money out
                    </TableCell>
                    <TableCell className={cn(CELL, "text-right")}>
                      <SignedAmount pence={moneyOut} direction="out" />
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={4}
                      className={cn(CELL, "border-t-4 border-double border-foreground")}
                    >
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-heading text-h2 tabular-nums">
                          {net > 0 ? "Net in" : net < 0 ? "Net out" : "Net"}
                        </span>
                        <span className={SMALL}>{plural(count, "transaction", "transactions")}</span>
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        CELL,
                        "border-t-4 border-double border-foreground text-right font-heading text-h2 tabular-nums",
                        net > 0 ? "text-primary" : net < 0 ? "text-destructive" : "text-foreground"
                      )}
                    >
                      {net > 0 ? "+" : net < 0 ? "−" : ""}
                      {formatPounds(net)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-3">
              <p className={SMALL}>
                Page {current + 1} of {pageCount}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className={BUTTON}
                  focusableWhenDisabled
                  disabled={current === 0}
                  onClick={() => setPage(current - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className={BUTTON}
                  focusableWhenDisabled
                  disabled={current >= pageCount - 1}
                  onClick={() => setPage(current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </section>
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
