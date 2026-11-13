import { useMemo, useRef, useState } from "react"
import type { KeyboardEvent } from "react"

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

type AccountId = "current" | "reserve"
type AccountFilter = "all" | AccountId
type Direction = "all" | "in" | "out"

type Transaction = {
  id: number
  date: string // ISO date
  description: string
  reference: string
  account: AccountId
  amount: number // pence; positive is money in, negative is money out
}

const PAGE_SIZE = 10

const ACCOUNT_NAMES: Record<AccountId, string> = {
  current: "Current",
  reserve: "Tax reserve",
}

const ACCOUNT_ITEMS: { value: AccountFilter; label: string }[] = [
  { value: "all", label: "All accounts" },
  { value: "current", label: "Current account" },
  { value: "reserve", label: "Tax reserve" },
]

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

// Hollis & Vane's statement, 30 October to 27 November 2026, newest first.
const TRANSACTIONS: Transaction[] = [
  {
    id: 28,
    date: "2026-11-27",
    description: "Larkspur Café",
    reference: "INV-0142",
    account: "current",
    amount: 48600,
  },
  {
    id: 27,
    date: "2026-11-26",
    description: "Copperleaf Paper Mill",
    reference: "CPM-88214",
    account: "current",
    amount: -61240,
  },
  {
    id: 26,
    date: "2026-11-25",
    description: "Card processing fees",
    reference: "FEES 25NOV",
    account: "current",
    amount: -1836,
  },
  {
    id: 25,
    date: "2026-11-24",
    description: "Brennan Wholesale",
    reference: "INV-0141",
    account: "current",
    amount: 215000,
  },
  {
    id: 24,
    date: "2026-11-23",
    description: "To tax reserve",
    reference: "TFR 8830",
    account: "current",
    amount: -120000,
  },
  {
    id: 23,
    date: "2026-11-23",
    description: "From current account",
    reference: "TFR 4417",
    account: "reserve",
    amount: 120000,
  },
  {
    id: 22,
    date: "2026-11-21",
    description: "Card processing fees",
    reference: "FEES 21NOV",
    account: "current",
    amount: -1588,
  },
  {
    id: 21,
    date: "2026-11-20",
    description: "Marlow Ink Co.",
    reference: "MIC-3307",
    account: "current",
    amount: -26490,
  },
  {
    id: 20,
    date: "2026-11-19",
    description: "Odell & Pryce Architects",
    reference: "INV-0140",
    account: "current",
    amount: 384000,
  },
  {
    id: 19,
    date: "2026-11-18",
    description: "Plateset design software",
    reference: "SUB NOV",
    account: "current",
    amount: -4900,
  },
  {
    id: 18,
    date: "2026-11-16",
    description: "Kestrel Van Leasing",
    reference: "LEASE NOV",
    account: "current",
    amount: -38950,
  },
  {
    id: 17,
    date: "2026-11-14",
    description: "Parcelwise courier",
    reference: "PW-55120",
    account: "current",
    amount: -3640,
  },
  {
    id: 16,
    date: "2026-11-13",
    description: "Larkspur Café",
    reference: "INV-0139",
    account: "current",
    amount: 31250,
  },
  {
    id: 15,
    date: "2026-11-12",
    description: "Copperleaf Paper Mill",
    reference: "CPM-88107",
    account: "current",
    amount: -108475,
  },
  {
    id: 14,
    date: "2026-11-10",
    description: "VAT payment",
    reference: "VAT Q3 2026",
    account: "reserve",
    amount: -312680,
  },
  {
    id: 13,
    date: "2026-11-09",
    description: "Card processing fees",
    reference: "FEES 09NOV",
    account: "current",
    amount: -2214,
  },
  {
    id: 12,
    date: "2026-11-06",
    description: "Brennan Wholesale",
    reference: "INV-0138",
    account: "current",
    amount: 167500,
  },
  {
    id: 11,
    date: "2026-11-05",
    description: "Marlow Ink Co.",
    reference: "MIC-3251",
    account: "current",
    amount: -19820,
  },
  {
    id: 10,
    date: "2026-11-04",
    description: "Tallybook accounting",
    reference: "SUB NOV",
    account: "current",
    amount: -2400,
  },
  {
    id: 9,
    date: "2026-11-03",
    description: "Odell & Pryce Architects",
    reference: "INV-0137",
    account: "current",
    amount: 242000,
  },
  {
    id: 8,
    date: "2026-11-02",
    description: "Harrow Yard Studios rent",
    reference: "RENT NOV",
    account: "current",
    amount: -145000,
  },
  {
    id: 7,
    date: "2026-11-02",
    description: "To tax reserve",
    reference: "TFR 8830",
    account: "current",
    amount: -90000,
  },
  {
    id: 6,
    date: "2026-11-02",
    description: "From current account",
    reference: "TFR 4417",
    account: "reserve",
    amount: 90000,
  },
  {
    id: 5,
    date: "2026-11-01",
    description: "Proofline file storage",
    reference: "SUB NOV",
    account: "current",
    amount: -1200,
  },
  {
    id: 4,
    date: "2026-10-31",
    description: "Larkspur Café",
    reference: "INV-0136",
    account: "current",
    amount: 26800,
  },
  {
    id: 3,
    date: "2026-10-31",
    description: "Copperleaf Paper Mill",
    reference: "CPM-87990",
    account: "current",
    amount: -74530,
  },
  {
    id: 2,
    date: "2026-10-30",
    description: "Brennan Wholesale",
    reference: "INV-0135",
    account: "current",
    amount: 98000,
  },
  {
    id: 1,
    date: "2026-10-30",
    description: "Card processing fees",
    reference: "FEES 30OCT",
    account: "current",
    amount: -1162,
  },
]

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

function shortDate(iso: string) {
  const [, month, day] = iso.split("-").map(Number)
  return `${day} ${MONTHS[month - 1]}`
}

function pounds(pence: number) {
  return `£${(Math.abs(pence) / 100).toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const LINK_FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const LABEL = "font-mono text-label uppercase text-muted-foreground"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const BUTTON = "px-4 font-mono text-label uppercase"

function SignedAmount({
  pence,
  direction,
}: {
  pence: number
  direction: "in" | "out"
}) {
  const zero = pence === 0
  return (
    <span className="inline-flex items-baseline justify-end gap-2 whitespace-nowrap">
      <span className={LABEL}>{direction === "in" ? "In" : "Out"}</span>
      <span
        className={cn(
          "font-mono tabular-nums",
          !zero && (direction === "in" ? "text-primary" : "text-destructive")
        )}
      >
        {zero ? "" : direction === "in" ? "+" : "−"}
        {pounds(pence)}
      </span>
    </span>
  )
}

function NavLinks({ mobile = false }: { mobile?: boolean }) {
  return NAV_LINKS.map((link) => {
    const current = link.href === CURRENT_PATH
    return (
      <li key={link.href}>
        <a
          href={link.href}
          aria-current={current ? "page" : undefined}
          className={cn(
            "font-mono text-label uppercase transition-colors duration-150",
            LINK_FOCUS,
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

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const [search, setSearch] = useState("")
  const [account, setAccount] = useState<AccountFilter>("all")
  const [direction, setDirection] = useState<Direction>("all")
  const [page, setPage] = useState(1)

  const query = search.trim().toLowerCase()
  const filtersSet = query !== "" || account !== "all" || direction !== "all"

  const matching = useMemo(
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

  const total = matching.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const first = (currentPage - 1) * PAGE_SIZE
  const shown = matching.slice(first, first + PAGE_SIZE)

  let range = "0 of 0"
  if (shown.length === 1) range = `${first + 1} of ${total}`
  else if (shown.length > 1)
    range = `${first + 1}–${first + shown.length} of ${total}`

  const moneyIn = matching.reduce(
    (sum, t) => (t.amount > 0 ? sum + t.amount : sum),
    0
  )
  const moneyOut = matching.reduce(
    (sum, t) => (t.amount < 0 ? sum - t.amount : sum),
    0
  )
  const net = moneyIn - moneyOut

  function clearFilters() {
    setSearch("")
    setAccount("all")
    setDirection("all")
    setPage(1)
    searchRef.current?.focus()
  }

  function onHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (menuOpen && event.key === "Escape") {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <header className="border-b border-border" onKeyDown={onHeaderKeyDown}>
        <div className="mx-auto flex w-full max-w-[1200px] items-center gap-6 px-4 py-4 md:px-6">
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground transition-colors duration-150",
              LINK_FOCUS
            )}
          >
            Fairhold
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              <NavLinks />
            </ul>
          </nav>
          <p className={cn(SMALL_FIGURE, "ml-auto hidden md:block")}>
            Hollis &amp; Vane
          </p>
          <Button
            ref={menuButtonRef}
            variant="outline"
            className={cn(BUTTON, "ml-auto md:hidden")}
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
            <ul className="py-2">
              <NavLinks mobile />
            </ul>
          </div>
        </nav>
      </header>

      <main className="flex-1 py-6 md:py-12">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className={SMALL_FIGURE}>
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
                <label htmlFor="search" className={cn("block", LABEL)}>
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
                    setPage(1)
                  }}
                  className="px-2 text-body md:text-body [&::-webkit-search-cancel-button]:appearance-none"
                />
              </div>

              <div className="flex w-full flex-col gap-3 md:w-48">
                <label
                  id="account-label"
                  htmlFor="account"
                  className={cn("block", LABEL)}
                >
                  Account
                </label>
                <Select
                  items={ACCOUNT_ITEMS}
                  value={account}
                  onValueChange={(value) => {
                    if (value === null) return
                    setAccount(value)
                    setPage(1)
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
                <div
                  role="group"
                  aria-labelledby="direction-label"
                  className="flex flex-wrap gap-1"
                >
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
                          setPage(1)
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
                  disabled={!filtersSet}
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
              <p aria-live="polite" className={SMALL_FIGURE}>
                {range}
              </p>
            </div>

            <Table label="Statement" className="text-body">
              <TableHeader>
                <TableRow>
                  <TableHead className={cn("px-4 first:pl-6 last:pr-6", LABEL)}>
                    Date
                  </TableHead>
                  <TableHead className={cn("px-4 first:pl-6 last:pr-6", LABEL)}>
                    Description
                  </TableHead>
                  <TableHead className={cn("px-4 first:pl-6 last:pr-6", LABEL)}>
                    Reference
                  </TableHead>
                  <TableHead className={cn("px-4 first:pl-6 last:pr-6", LABEL)}>
                    Account
                  </TableHead>
                  <TableHead
                    className={cn(
                      "px-4 text-right first:pl-6 last:pr-6",
                      LABEL
                    )}
                  >
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
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
                          className={BUTTON}
                          onClick={clearFilters}
                        >
                          Clear filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  shown.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="px-4 py-2 first:pl-6 last:pr-6">
                        <time
                          dateTime={t.date}
                          className="font-mono tabular-nums"
                        >
                          {shortDate(t.date)}
                        </time>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-body first:pl-6 last:pr-6">
                        {t.description}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "px-4 py-2 first:pl-6 last:pr-6",
                          SMALL_FIGURE
                        )}
                      >
                        {t.reference}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-body first:pl-6 last:pr-6">
                        {ACCOUNT_NAMES[t.account]}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-right first:pl-6 last:pr-6">
                        <SignedAmount
                          pence={t.amount}
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
                    <TableCell
                      colSpan={4}
                      className={cn("px-4 py-2 first:pl-6 last:pr-6", LABEL)}
                    >
                      Money in
                    </TableCell>
                    <TableCell className="px-4 py-2 text-right first:pl-6 last:pr-6">
                      <SignedAmount pence={moneyIn} direction="in" />
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={4}
                      className={cn("px-4 py-2 first:pl-6 last:pr-6", LABEL)}
                    >
                      Money out
                    </TableCell>
                    <TableCell className="px-4 py-2 text-right first:pl-6 last:pr-6">
                      <SignedAmount pence={moneyOut} direction="out" />
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={4}
                      className="border-t-4 border-double border-foreground px-4 py-2 first:pl-6 last:pr-6"
                    >
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-heading text-h2 tabular-nums">
                          {net > 0 ? "Net in" : net < 0 ? "Net out" : "Net"}
                        </span>
                        <span className={SMALL_FIGURE}>
                          {total} {total === 1 ? "transaction" : "transactions"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="border-t-4 border-double border-foreground px-4 py-2 text-right first:pl-6 last:pr-6">
                      <span
                        className={cn(
                          "font-heading text-h2 tabular-nums",
                          net > 0
                            ? "text-primary"
                            : net < 0
                              ? "text-destructive"
                              : "text-foreground"
                        )}
                      >
                        {net > 0 ? "+" : net < 0 ? "−" : ""}
                        {pounds(net)}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-3">
              <p className={SMALL_FIGURE}>
                Page {currentPage} of {pageCount}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className={BUTTON}
                  focusableWhenDisabled
                  disabled={currentPage <= 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className={BUTTON}
                  focusableWhenDisabled
                  disabled={currentPage >= pageCount}
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
          <p className={SMALL_FIGURE}>
            Fairhold · A demo. No money moves. · 2026
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
