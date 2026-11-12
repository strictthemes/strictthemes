import { useState } from "react"

import { Button } from "@/components/ui/button"
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

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const label = "font-mono text-label uppercase"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const buttonText = "px-4 font-mono text-label uppercase"

const navLinks = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Invoices", href: "/invoice" },
  { label: "Payments", href: "/payment" },
  { label: "Reports", href: "/report" },
]
const currentHref = "/report"

const figures = [
  { term: "Income", value: "£412,860", change: "Up 14% on last year." },
  { term: "Costs", value: "£356,240", change: "Up 11% on last year." },
  {
    term: "Profit before tax",
    value: "£56,620",
    change: "Up 37% on last year.",
  },
]

type Quarter = {
  quarter: string
  months: string
  income: string
  costs: string
  net: { kind: "profit" | "loss"; amount: string }
  margin: string
  cash: string
}

const quarters: Quarter[] = [
  {
    quarter: "Q1",
    months: "Oct–Dec 2025",
    income: "£98,420",
    costs: "£79,310",
    net: { kind: "profit", amount: "+£19,110" },
    margin: "19.4%",
    cash: "£38,250",
  },
  {
    quarter: "Q2",
    months: "Jan–Mar 2026",
    income: "£84,950",
    costs: "£89,130",
    net: { kind: "loss", amount: "−£4,180" },
    margin: "−4.9%",
    cash: "£29,870",
  },
  {
    quarter: "Q3",
    months: "Apr–Jun 2026",
    income: "£109,760",
    costs: "£90,420",
    net: { kind: "profit", amount: "+£19,340" },
    margin: "17.6%",
    cash: "£44,120",
  },
  {
    quarter: "Q4",
    months: "Jul–Sep 2026",
    income: "£119,730",
    costs: "£97,380",
    net: { kind: "profit", amount: "+£22,350" },
    margin: "18.7%",
    cash: "£54,310",
  },
]

const notes = [
  "Figures are rounded to the nearest pound and are before corporation tax.",
  "Paper prices are the average of the studio’s orders from Copperleaf Paper Mill in each quarter.",
  "The folding machine is counted in full as a cost in February. The statutory accounts spread it over five years, so their profit for the year will be higher.",
  "Transfers between the current account and the tax reserve are left out of income and costs.",
]

function NoteMarker({ n }: { n: number }) {
  return (
    <sup className="relative -top-1 align-baseline text-label">
      <a href={`#note-${n}`} aria-label={`Note ${n}`} className={textLink}>
        {n}
      </a>
    </sup>
  )
}

function NavLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  const current = href === currentHref
  return (
    <a
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(
        label,
        "transition-colors duration-150",
        current
          ? "text-foreground underline underline-offset-4"
          : "text-muted-foreground hover:text-foreground",
        focusRing,
        className
      )}
    >
      {children}
    </a>
  )
}

const headCell = cn(label, "px-4 text-muted-foreground first:pl-6 last:pr-6")
const bodyCell = "px-4 py-2 first:pl-6 last:pr-6"
const totalCell = cn(
  bodyCell,
  "border-t-4 border-double border-foreground font-heading text-h2 tabular-nums"
)

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-[1200px] items-center gap-6 px-4 py-4 md:px-6">
          <a
            href="/"
            className={cn("font-heading text-h2 text-foreground", focusRing)}
          >
            Fairhold
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href}>{link.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <p className={cn(smallFigure, "ml-auto hidden md:block")}>
            Hollis &amp; Vane Ltd
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
            <ul className="py-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href} className="block py-2">
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className="flex-1 py-6 md:py-12">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className={cn(label, "text-muted-foreground")}>
                Yearly report
              </p>
              <h1 className="text-h1">The year to 30 September 2026</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className={buttonText}>
                Download PDF
              </Button>
            </div>
          </div>

          <section
            aria-labelledby="figures-heading"
            className="flex flex-col gap-6"
          >
            <h2 id="figures-heading" className="text-h2">
              The year in figures
            </h2>
            <dl className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {figures.map((figure) => (
                <div
                  key={figure.term}
                  className="flex flex-col gap-2 border-t border-border pt-3"
                >
                  <dt className={cn(label, "text-muted-foreground")}>
                    {figure.term}
                  </dt>
                  <dd className="font-heading text-display text-foreground tabular-nums">
                    {figure.value}
                  </dd>
                  <dd className="text-body">{figure.change}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section
            aria-labelledby="commentary-heading"
            className="flex flex-col gap-6"
          >
            <h2 id="commentary-heading" className="text-h2">
              What happened
            </h2>
            <div className="flex flex-col gap-4">
              <p className="max-w-lg text-body text-foreground">
                It was our busiest year since we opened the studio. Our income
                came to £412,860, 14% more than the year before.
                <NoteMarker n={1} /> Two new café clients now order menus,
                loyalty cards and window posters every month, and a busy summer
                of weddings and festivals filled the press with event print from
                June to September.
              </p>
              <p className="max-w-lg text-body text-foreground">
                Our costs rose by 11% to £356,240. Most of the rise was paper:
                the stock we buy most went up by about 9% over the year, a
                little in every quarter.
                <NoteMarker n={2} /> We passed some of that on in our autumn
                prices, but kept the café work at last year’s rates to win the
                two new accounts.
              </p>
              <p className="max-w-lg text-body text-foreground">
                The second quarter was a loss of £4,180. In February we paid
                £18,400 for a new folding machine, and we count it in full in
                that month.
                <NoteMarker n={3} /> January and February are always quiet, so
                cash was at its lowest at the end of March, £29,870. It
                recovered by June and ended the year at £54,310.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="quarters-heading"
            className="flex flex-col gap-6"
          >
            <h2 id="quarters-heading" className="text-h2">
              By quarter
            </h2>
            <p className="max-w-lg text-body text-foreground">
              Income and costs exclude VAT. Cash is the balance of both accounts
              on the last day of each quarter.
            </p>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table label="The year by quarter" className="text-body">
                <TableHeader>
                  <TableRow>
                    <TableHead className={headCell}>Quarter</TableHead>
                    <TableHead className={cn(headCell, "text-right")}>
                      Income
                    </TableHead>
                    <TableHead className={cn(headCell, "text-right")}>
                      Costs
                    </TableHead>
                    <TableHead className={cn(headCell, "text-right")}>
                      Net
                    </TableHead>
                    <TableHead className={cn(headCell, "text-right")}>
                      Margin
                    </TableHead>
                    <TableHead className={cn(headCell, "text-right")}>
                      Cash at end
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quarters.map((q) => (
                    <TableRow key={q.quarter}>
                      <TableCell className={bodyCell}>
                        <div className="flex flex-col gap-1">
                          <span className="text-body">{q.quarter}</span>
                          <span className={smallFigure}>{q.months}</span>
                        </div>
                      </TableCell>
                      <TableCell
                        className={cn(
                          bodyCell,
                          "text-right font-mono tabular-nums"
                        )}
                      >
                        {q.income}
                      </TableCell>
                      <TableCell
                        className={cn(
                          bodyCell,
                          "text-right font-mono tabular-nums"
                        )}
                      >
                        {q.costs}
                      </TableCell>
                      <TableCell className={cn(bodyCell, "text-right")}>
                        <span className="inline-flex items-baseline justify-end gap-2 whitespace-nowrap">
                          <span className={cn(label, "text-muted-foreground")}>
                            {q.net.kind === "profit" ? "Profit" : "Loss"}
                          </span>
                          <span
                            className={cn(
                              "font-mono tabular-nums",
                              q.net.kind === "profit"
                                ? "text-primary"
                                : "text-destructive"
                            )}
                          >
                            {q.net.amount}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell
                        className={cn(
                          bodyCell,
                          "text-right font-mono tabular-nums"
                        )}
                      >
                        {q.margin}
                      </TableCell>
                      <TableCell
                        className={cn(
                          bodyCell,
                          "text-right font-mono tabular-nums"
                        )}
                      >
                        {q.cash}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className="bg-transparent font-normal">
                  <TableRow className="hover:bg-transparent">
                    <TableCell className={cn(totalCell, "text-foreground")}>
                      Year
                    </TableCell>
                    <TableCell className={cn(totalCell, "text-right")}>
                      £412,860
                    </TableCell>
                    <TableCell className={cn(totalCell, "text-right")}>
                      £356,240
                    </TableCell>
                    <TableCell className={cn(totalCell, "text-right")}>
                      <span className="inline-flex items-baseline justify-end gap-2 whitespace-nowrap">
                        <span className={cn(label, "text-muted-foreground")}>
                          Profit
                        </span>
                        <span className="font-heading text-h2 text-primary tabular-nums">
                          +£56,620
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className={cn(totalCell, "text-right")}>
                      13.7%
                    </TableCell>
                    <TableCell className={cn(totalCell, "text-right")}>
                      £54,310
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </section>

          <section
            aria-labelledby="notes-heading"
            className="flex flex-col gap-6"
          >
            <h2 id="notes-heading" className="text-h2">
              Notes
            </h2>
            <ol className="flex list-decimal flex-col gap-2 pl-6">
              {notes.map((note, i) => (
                <li key={i} id={`note-${i + 1}`} className="max-w-lg text-body">
                  {note}
                </li>
              ))}
            </ol>
            <p className={smallFigure}>
              Prepared by Fairhold on{" "}
              <time dateTime="2026-11-20">20 November 2026</time> from the
              records of both accounts.
            </p>
          </section>
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
