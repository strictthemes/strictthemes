import { useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

type Account = "current" | "reserve"

type Transaction = {
  id: string
  date: string // ISO, YYYY-MM-DD
  description: string
  reference: string
  account: Account
  amount: number // pence; positive is money in, negative is money out
}

const TRANSACTIONS: Transaction[] = [
  { id: "t28", date: "2026-11-27", description: "Larkspur Café", reference: "INV-0146", account: "current", amount: 124050 },
  { id: "t27", date: "2026-11-26", description: "Copperleaf Paper Mill", reference: "CPM-88213", account: "current", amount: -61240 },
  { id: "t26", date: "2026-11-25", description: "Card processing fees", reference: "FEES W48", account: "current", amount: -1875 },
  { id: "t25", date: "2026-11-24", description: "Brennan Wholesale", reference: "INV-0145", account: "current", amount: 286000 },
  { id: "t24", date: "2026-11-23", description: "To tax reserve", reference: "TAX NOV", account: "current", amount: -150000 },
  { id: "t23", date: "2026-11-23", description: "From current account", reference: "TAX NOV", account: "reserve", amount: 150000 },
  { id: "t22", date: "2026-11-20", description: "Inkwell Supply Co.", reference: "ISC-4471", account: "current", amount: -21430 },
  { id: "t21", date: "2026-11-19", description: "Odell & Pryce Architects", reference: "INV-0144", account: "current", amount: 345000 },
  { id: "t20", date: "2026-11-18", description: "Northgate Van Leasing", reference: "VAN NOV", account: "current", amount: -38900 },
  { id: "t19", date: "2026-11-17", description: "Layerform design software", reference: "LF-2611", account: "current", amount: -4900 },
  { id: "t18", date: "2026-11-16", description: "Card processing fees", reference: "FEES W47", account: "current", amount: -1240 },
  { id: "t17", date: "2026-11-13", description: "Larkspur Café", reference: "INV-0143", account: "current", amount: 86520 },
  { id: "t16", date: "2026-11-12", description: "Copperleaf Paper Mill", reference: "CPM-88107", account: "current", amount: -108465 },
  { id: "t15", date: "2026-11-11", description: "Proofbox file storage", reference: "PBX-2611", account: "current", amount: -2400 },
  { id: "t14", date: "2026-11-10", description: "Brennan Wholesale", reference: "INV-0142", account: "current", amount: 197500 },
  { id: "t13", date: "2026-11-09", description: "Inkwell Supply Co.", reference: "ISC-4402", account: "current", amount: -15680 },
  { id: "t12", date: "2026-11-09", description: "Card processing fees", reference: "FEES W46", account: "current", amount: -960 },
  { id: "t11", date: "2026-11-06", description: "Odell & Pryce Architects", reference: "INV-0141", account: "current", amount: 212000 },
  { id: "t10", date: "2026-11-04", description: "Larkspur Café", reference: "INV-0140", account: "current", amount: 54000 },
  { id: "t09", date: "2026-11-03", description: "Ashby Row Properties", reference: "RENT NOV", account: "current", amount: -185000 },
  { id: "t08", date: "2026-11-02", description: "To tax reserve", reference: "TAX OCT", account: "current", amount: -120000 },
  { id: "t07", date: "2026-11-02", description: "From current account", reference: "TAX OCT", account: "reserve", amount: 120000 },
  { id: "t06", date: "2026-11-02", description: "Card processing fees", reference: "FEES W45", account: "current", amount: -1530 },
  { id: "t05", date: "2026-11-02", description: "Copperleaf Paper Mill", reference: "CPM-87994", account: "current", amount: -73820 },
  { id: "t04", date: "2026-10-31", description: "Brennan Wholesale", reference: "INV-0139", account: "current", amount: 142800 },
  { id: "t03", date: "2026-10-31", description: "Layerform design software", reference: "LF-2610", account: "current", amount: -4900 },
  { id: "t02", date: "2026-10-30", description: "Inkwell Supply Co.", reference: "ISC-4359", account: "current", amount: -9875 },
  { id: "t01", date: "2026-10-30", description: "Odell & Pryce Architects", reference: "INV-0138", account: "current", amount: 168000 },
]

const ACCOUNT_NAMES: Record<Account, string> = {
  current: "Current",
  reserve: "Tax reserve",
}

const PAGE_SIZE = 10
const MINUS = "−"
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

type AccountFilter = "all" | Account
type Direction = "all" | "in" | "out"

const NAV_LINKS = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Invoices", href: "/invoice" },
  { label: "Payments", href: "/payment" },
  { label: "Reports", href: "/report" },
]
const CURRENT_PATH = "/transactions"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const LABEL = "font-mono text-label uppercase text-muted-foreground"
const SMALL = "font-mono text-label tabular-nums text-muted-foreground"
const BUTTON = "px-4 font-mono text-label uppercase"

function formatPounds(pence: number) {
  const abs = Math.abs(pence)
  const pounds = Math.floor(abs / 100).toLocaleString("en-GB")
  const rest = String(abs % 100).padStart(2, "0")
  return `£${pounds}.${rest}`
}

function shortDate(iso: string) {
  const [, m, d] = iso.split("-")
  return `${Number(d)} ${MONTHS[Number(m) - 1]}`
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

function SignedAmount({ pence, direction }: { pence: number; direction: "in" | "out" }) {
  const zero = pence === 0
  const sign = zero ? "" : direction === "in" ? "+" : MINUS
  return (
    <span className="inline-flex items-baseline justify-end gap-2 whitespace-nowrap">
      <span className={LABEL}>{direction === "in" ? "In" : "Out"}</span>
      <span
        className={cn(
          "font-mono tabular-nums",
          zero ? "text-foreground" : direction === "in" ? "text-primary" : "text-destructive"
        )}
      >
        {sign}
        {formatPounds(pence)}
      </span>
    </span>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const linkClass = (current: boolean) =>
    cn(
      "font-mono text-label uppercase transition-colors duration-150",
      FOCUS,
      current
        ? "text-foreground underline underline-offset-4"
        : "text-muted-foreground hover:text-foreground"
    )
  const links = (block: boolean) =>
    NAV_LINKS.map((link) => {
      const current = link.href === CURRENT_PATH
      return (
        <li key={link.href}>
          <a
            href={link.href}
            aria-current={current ? "page" : undefined}
            className={cn(linkClass(current), block && "block py-2")}
          >
            {link.label}
          </a>
        </li>
      )
    })

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-[1200px] items-center gap-6 px-4 py-4 md:px-6">
        <a href="/" className={cn("font-heading text-h2 text-foreground", FOCUS)}>
          Fairhold
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">{links(false)}</ul>
        </nav>
        <p className={cn(SMALL, "ml-auto hidden md:block")}>Hollis &amp; Vane</p>
        <Button
          variant="outline"
          className={cn(BUTTON, "ml-auto md:hidden")}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
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
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
          <ul className="py-2">{links(true)}</ul>
        </div>
      </nav>
    </header>
  )
}

export function App() {
  const [search, setSearch] = useState("")
  const [account, setAccount] = useState<AccountFilter>("all")
  const [direction, setDirection] = useState<Direction>("all")
  const [page, setPage] = useState(1)
  const searchRef = useRef<HTMLInputElement>(null)

  const query = search.trim().toLowerCase()
  const filterSet = query !== "" || account !== "all" || direction !== "all"

  const matches = useMemo(
    () =>
      TRANSACTIONS.filter((t) => {
        if (
          query &&
          !t.description.toLowerCase().includes(query) &&
          !t.reference.toLowerCase().includes(query)
        )
          return false
        if (account !== "all" && t.account !== account) return false
        if (direction === "in" && t.amount <= 0) return false
        if (direction === "out" && t.amount >= 0) return false
        return true
      }),
    [query, account, direction]
  )

  const total = matches.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const rows = matches.slice(start, start + PAGE_SIZE)
  const rangeLabel =
    total === 0 ? "0 of 0" : `${start + 1}–${start + rows.length} of ${total}`

  const moneyIn = matches.reduce((sum, t) => (t.amount > 0 ? sum + t.amount : sum), 0)
  const moneyOut = matches.reduce((sum, t) => (t.amount < 0 ? sum - t.amount : sum), 0)
  const net = moneyIn - moneyOut

  function clearFilters() {
    setSearch("")
    setAccount("all")
    setDirection("all")
    setPage(1)
    searchRef.current?.focus()
  }

  const directions: { value: Direction; label: string }[] = [
    { value: "all", label: "All" },
    { value: "in", label: "In" },
    { value: "out", label: "Out" },
  ]

  const footCell = "px-4 py-2 first:pl-6 last:pr-6"
  const totalCell = cn(footCell, "border-t-4 border-double border-foreground")

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />

      <main className="flex-1 py-6 md:py-12">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 md:px-6">
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

          <section aria-label="Filters" className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex w-full flex-col gap-3 md:w-64">
                <label htmlFor="search" className={cn("block", LABEL)}>
                  Search
                </label>
                <div className="flex flex-col gap-2">
                  <Input
                    id="search"
                    ref={searchRef}
                    type="search"
                    placeholder="Payee or reference"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setPage(1)
                    }}
                    className="text-body md:text-body"
                  />
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 md:w-48">
                <label htmlFor="account" className={cn("block", LABEL)}>
                  Account
                </label>
                <div className="flex flex-col gap-2">
                  <select
                    id="account"
                    value={account}
                    onChange={(e) => {
                      setAccount(e.target.value as AccountFilter)
                      setPage(1)
                    }}
                    className={cn(
                      "h-8 w-full rounded-lg border border-input bg-card px-2 text-body text-foreground aria-invalid:border-destructive",
                      FOCUS
                    )}
                  >
                    <option value="all">All accounts</option>
                    <option value="current">Current account</option>
                    <option value="reserve">Tax reserve</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p id="direction-label" className={LABEL}>
                  In or out
                </p>
                <div
                  role="group"
                  aria-labelledby="direction-label"
                  className="flex flex-wrap gap-1"
                >
                  {directions.map((d) => {
                    const chosen = direction === d.value
                    return (
                      <Button
                        key={d.value}
                        variant={chosen ? "secondary" : "outline"}
                        aria-pressed={chosen}
                        className={BUTTON}
                        onClick={() => {
                          setDirection(d.value)
                          setPage(1)
                        }}
                      >
                        {d.label}
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
          </section>

          <section
            aria-labelledby="statement-heading"
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="flex min-h-8 flex-wrap items-center justify-between gap-3 border-b border-border px-6 pt-6 pb-3">
              <h2 id="statement-heading" className={LABEL}>
                Statement
              </h2>
              <p aria-live="polite" className={SMALL}>
                {rangeLabel}
              </p>
            </div>

            <Table label="Statement" className="text-body">
              <TableHeader>
                <TableRow>
                  {["Date", "Description", "Reference", "Account"].map((h) => (
                    <TableHead key={h} className={cn("px-4 first:pl-6 last:pr-6", LABEL)}>
                      {h}
                    </TableHead>
                  ))}
                  <TableHead className={cn("px-4 text-right first:pl-6 last:pr-6", LABEL)}>
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="px-6 py-12 whitespace-normal">
                      <div className="flex flex-col items-start gap-3">
                        <p className="text-body text-foreground">
                          No transactions match these filters.
                        </p>
                        <Button variant="outline" className={BUTTON} onClick={clearFilters}>
                          Clear filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="px-4 py-2 font-mono tabular-nums first:pl-6 last:pr-6">
                        <time dateTime={t.date}>{shortDate(t.date)}</time>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-body first:pl-6 last:pr-6">
                        {t.description}
                      </TableCell>
                      <TableCell className={cn("px-4 py-2 first:pl-6 last:pr-6", SMALL)}>
                        {t.reference}
                      </TableCell>
                      <TableCell className="px-4 py-2 first:pl-6 last:pr-6">
                        {ACCOUNT_NAMES[t.account]}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-right first:pl-6 last:pr-6">
                        <SignedAmount
                          pence={Math.abs(t.amount)}
                          direction={t.amount > 0 ? "in" : "out"}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              {total > 0 && (
                <TableFooter className="bg-transparent font-normal">
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className={footCell}>
                      <span className={LABEL}>Money in</span>
                    </TableCell>
                    <TableCell className={cn(footCell, "text-right")}>
                      <SignedAmount pence={moneyIn} direction="in" />
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className={footCell}>
                      <span className={LABEL}>Money out</span>
                    </TableCell>
                    <TableCell className={cn(footCell, "text-right")}>
                      <SignedAmount pence={moneyOut} direction="out" />
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className={totalCell}>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-heading text-h2 tabular-nums">
                          {net > 0 ? "Net in" : net < 0 ? "Net out" : "Net"}
                        </span>
                        <span className={SMALL}>
                          {plural(total, "transaction", "transactions")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        totalCell,
                        "text-right font-heading text-h2 tabular-nums",
                        net > 0
                          ? "text-primary"
                          : net < 0
                            ? "text-destructive"
                            : "text-foreground"
                      )}
                    >
                      {net > 0 ? "+" : net < 0 ? MINUS : ""}
                      {formatPounds(net)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-3">
              <p className={SMALL}>
                Page {currentPage} of {pageCount}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className={BUTTON}
                  disabled={currentPage <= 1}
                  focusableWhenDisabled
                  onClick={() => setPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className={BUTTON}
                  disabled={currentPage >= pageCount}
                  focusableWhenDisabled
                  onClick={() => setPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-6">
          <p className={SMALL}>Fairhold · A demo. No money moves. · 2026</p>
        </div>
      </footer>
    </div>
  )
}

export default App
