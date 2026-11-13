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

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const container = "mx-auto w-full max-w-[1200px] px-4 md:px-6"

const label = "font-mono text-label uppercase text-muted-foreground"

const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"

const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)

const buttonLabel = "px-4 font-mono text-label uppercase"

const navLinks = [
  { name: "Overview", href: "/" },
  { name: "Transactions", href: "/transactions" },
  { name: "Invoices", href: "/invoice" },
  { name: "Payments", href: "/payment" },
  { name: "Reports", href: "/report" },
]

const currentPath = "/report"

const keyFigures = [
  { name: "Income", amount: 412860, change: "Up 14% on last year." },
  { name: "Costs", amount: 356240, change: "Up 11% on last year." },
  { name: "Profit before tax", amount: 56620, change: "Up 37% on last year." },
]

type Period = {
  name: string
  months?: string
  income: number
  costs: number
  net: number
  margin: number
  cash: number
}

const quarters: Period[] = [
  {
    name: "Q1",
    months: "Oct–Dec 2025",
    income: 98420,
    costs: 79310,
    net: 19110,
    margin: 19.4,
    cash: 38250,
  },
  {
    name: "Q2",
    months: "Jan–Mar 2026",
    income: 84950,
    costs: 89130,
    net: -4180,
    margin: -4.9,
    cash: 29870,
  },
  {
    name: "Q3",
    months: "Apr–Jun 2026",
    income: 109760,
    costs: 90420,
    net: 19340,
    margin: 17.6,
    cash: 44120,
  },
  {
    name: "Q4",
    months: "Jul–Sep 2026",
    income: 119730,
    costs: 97380,
    net: 22350,
    margin: 18.7,
    cash: 54310,
  },
]

const year: Period = {
  name: "Year",
  income: 412860,
  costs: 356240,
  net: 56620,
  margin: 13.7,
  cash: 54310,
}

const notes = [
  "Figures are rounded to the nearest pound and are before corporation tax.",
  "Paper prices are the average of the studio’s orders from Copperleaf Paper Mill in each quarter.",
  "The folding machine is counted in full as a cost in February. The statutory accounts spread it over five years, so their profit for the year will be higher.",
  "Transfers between the current account and the tax reserve are left out of income and costs.",
]

const MINUS = "−"

// Whole pounds, with a thousands comma and no sign.
function pounds(amount: number) {
  return `£${Math.abs(amount).toLocaleString("en-GB")}`
}

function signedPounds(amount: number) {
  return `${amount < 0 ? MINUS : "+"}${pounds(amount)}`
}

function percent(value: number) {
  return `${value < 0 ? MINUS : ""}${Math.abs(value).toFixed(1)}%`
}

function NavLink({
  link,
  className,
}: {
  link: (typeof navLinks)[number]
  className?: string
}) {
  const current = link.href === currentPath
  return (
    <a
      href={link.href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "font-mono text-label uppercase transition-colors duration-150",
        current
          ? "text-foreground underline underline-offset-4"
          : "text-muted-foreground hover:text-foreground",
        focusOutline,
        className
      )}
    >
      {link.name}
    </a>
  )
}

function NoteMarker({ note }: { note: number }) {
  return (
    <sup className="relative -top-1 align-baseline text-label">
      <a
        href={`#note-${note}`}
        aria-label={`Note ${note}`}
        className={textLink}
      >
        {note}
      </a>
    </sup>
  )
}

function Net({ amount, total = false }: { amount: number; total?: boolean }) {
  const loss = amount < 0
  return (
    <span className="inline-flex items-baseline justify-end gap-2 whitespace-nowrap">
      <span className={label}>{loss ? "Loss" : "Profit"}</span>
      <span
        className={cn(
          "tabular-nums",
          total ? "font-heading text-h2" : "font-mono",
          loss ? "text-destructive" : "text-primary"
        )}
      >
        {signedPounds(amount)}
      </span>
    </span>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const headCell = cn(label, "px-4 first:pl-6 last:pr-6")
  const amountHead = cn(headCell, "text-right")
  const cell = "px-4 py-2 first:pl-6 last:pr-6"
  const amountCell = cn(cell, "text-right font-mono tabular-nums")
  const totalCell = cn(
    cell,
    "border-t-4 border-double border-foreground font-heading text-h2 tabular-nums"
  )

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
                  <NavLink link={link} />
                </li>
              ))}
            </ul>
          </nav>
          <p className={cn(smallFigure, "ml-auto hidden md:block")}>
            Hollis &amp; Vane Ltd
          </p>
          <Button
            variant="outline"
            className={cn(buttonLabel, "ml-auto md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="small-screen-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="small-screen-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
        >
          <div className={container}>
            <ul className="py-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink link={link} className="block py-2" />
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className="flex-1 py-6 md:py-12">
        <div className={cn(container, "flex flex-col gap-12")}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className={label}>Yearly report</p>
              <h1 className="text-h1">The year to 30 September 2026</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className={buttonLabel}>
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
              {keyFigures.map((figure) => (
                <div
                  key={figure.name}
                  className="flex flex-col gap-2 border-t border-border pt-3"
                >
                  <dt className={label}>{figure.name}</dt>
                  <dd className="font-heading text-display text-foreground tabular-nums">
                    {pounds(figure.amount)}
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
                Income for the year was £412,860, up 14% on the year before.
                <NoteMarker note={1} /> Most of the growth came from two new
                café clients, who now order menus, loyalty cards and window
                posters from us every month. The summer was the busiest we have
                had for event print, with programmes and signs for four
                festivals between June and September.
              </p>
              <p className="max-w-lg text-body text-foreground">
                Costs came to £356,240, up 11%. The largest part of the rise was
                paper. The price we pay for paper went up by about 9% over the
                year, with the steepest step in the spring.
                <NoteMarker note={2} /> We printed more as well, so we bought
                more ink and plates and paid more for delivery. Rent and our own
                pay did not change.
              </p>
              <p className="max-w-lg text-body text-foreground">
                The second quarter was a loss of £4,180. We bought a new folding
                machine for £18,400 and paid for it in full in February.
                <NoteMarker note={3} /> Without it the quarter would have made a
                profit. Cash was lowest at the end of March, at £29,870, and
                recovered through the summer. We ended the year with £54,310
                across both accounts.
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
                    <TableHead scope="col" className={headCell}>
                      Quarter
                    </TableHead>
                    <TableHead scope="col" className={amountHead}>
                      Income
                    </TableHead>
                    <TableHead scope="col" className={amountHead}>
                      Costs
                    </TableHead>
                    <TableHead scope="col" className={amountHead}>
                      Net
                    </TableHead>
                    <TableHead scope="col" className={amountHead}>
                      Margin
                    </TableHead>
                    <TableHead scope="col" className={amountHead}>
                      Cash at end
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quarters.map((quarter) => (
                    <TableRow key={quarter.name}>
                      <TableCell className={cell}>
                        <div className="flex flex-col gap-1">
                          <span className="text-body">{quarter.name}</span>
                          <span className={smallFigure}>{quarter.months}</span>
                        </div>
                      </TableCell>
                      <TableCell className={amountCell}>
                        {pounds(quarter.income)}
                      </TableCell>
                      <TableCell className={amountCell}>
                        {pounds(quarter.costs)}
                      </TableCell>
                      <TableCell className={cn(cell, "text-right")}>
                        <Net amount={quarter.net} />
                      </TableCell>
                      <TableCell className={amountCell}>
                        {percent(quarter.margin)}
                      </TableCell>
                      <TableCell className={amountCell}>
                        {pounds(quarter.cash)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className="bg-transparent font-normal">
                  <TableRow className="hover:bg-transparent">
                    <TableCell className={cn(totalCell, "text-foreground")}>
                      {year.name}
                    </TableCell>
                    <TableCell className={cn(totalCell, "text-right")}>
                      {pounds(year.income)}
                    </TableCell>
                    <TableCell className={cn(totalCell, "text-right")}>
                      {pounds(year.costs)}
                    </TableCell>
                    <TableCell className={cn(totalCell, "text-right")}>
                      <Net amount={year.net} total />
                    </TableCell>
                    <TableCell className={cn(totalCell, "text-right")}>
                      {percent(year.margin)}
                    </TableCell>
                    <TableCell className={cn(totalCell, "text-right")}>
                      {pounds(year.cash)}
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
              {notes.map((note, index) => (
                <li
                  key={index}
                  id={`note-${index + 1}`}
                  className="max-w-lg text-body"
                >
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
