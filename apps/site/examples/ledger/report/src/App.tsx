import * as React from "react"

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

const label = "font-mono text-label uppercase text-muted-foreground"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"

const navLinks = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Invoices", href: "/invoice" },
  { label: "Payments", href: "/payment" },
  { label: "Reports", href: "/report" },
]
const currentHref = "/report"

const businessName = "Hollis & Vane Ltd"

const keyFigures = [
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
  net: { kind: "Profit" | "Loss"; amount: string }
  margin: string
  cash: string
}

const quarters: Quarter[] = [
  {
    quarter: "Q1",
    months: "Oct–Dec 2025",
    income: "£98,420",
    costs: "£79,310",
    net: { kind: "Profit", amount: "+£19,110" },
    margin: "19.4%",
    cash: "£38,250",
  },
  {
    quarter: "Q2",
    months: "Jan–Mar 2026",
    income: "£84,950",
    costs: "£89,130",
    net: { kind: "Loss", amount: "−£4,180" },
    margin: "−4.9%",
    cash: "£29,870",
  },
  {
    quarter: "Q3",
    months: "Apr–Jun 2026",
    income: "£109,760",
    costs: "£90,420",
    net: { kind: "Profit", amount: "+£19,340" },
    margin: "17.6%",
    cash: "£44,120",
  },
  {
    quarter: "Q4",
    months: "Jul–Sep 2026",
    income: "£119,730",
    costs: "£97,380",
    net: { kind: "Profit", amount: "+£22,350" },
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

const cellPad = "px-4 py-2 first:pl-6 last:pr-6"

function NoteMarker({ n }: { n: number }) {
  return (
    <sup className="relative -top-1 align-baseline text-label">
      <a href={`#note-${n}`} aria-label={`Note ${n}`} className={textLink}>
        {n}
      </a>
    </sup>
  )
}

function NavList({
  className,
  itemClassName,
}: {
  className: string
  itemClassName?: string
}) {
  return (
    <ul className={className}>
      {navLinks.map((link) => {
        const current = link.href === currentHref
        return (
          <li key={link.href}>
            <a
              href={link.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "font-mono text-label uppercase transition-colors duration-150",
                current
                  ? "text-foreground underline underline-offset-4"
                  : "text-muted-foreground hover:text-foreground",
                focusRing,
                itemClassName
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
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuButton = React.useRef<HTMLButtonElement>(null)

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButton.current?.focus()
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
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
          <NavList className="flex gap-6" />
        </nav>
        <p className={cn(smallFigure, "ml-auto hidden md:block")}>
          {businessName}
        </p>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="ml-auto px-4 font-mono text-label uppercase md:hidden"
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!menuOpen}
        className="border-t border-border md:hidden"
      >
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
          <NavList className="py-2" itemClassName="block py-2" />
        </div>
      </nav>
    </header>
  )
}

function PageHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <p className={label}>Yearly report</p>
        <h1 className="text-h1">The year to 30 September 2026</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="px-4 font-mono text-label uppercase"
        >
          Download PDF
        </Button>
      </div>
    </div>
  )
}

function YearInFigures() {
  return (
    <section aria-labelledby="figures-heading" className="flex flex-col gap-6">
      <h2 id="figures-heading" className="text-h2">
        The year in figures
      </h2>
      <dl className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {keyFigures.map((figure) => (
          <div
            key={figure.term}
            className="flex flex-col gap-2 border-t border-border pt-3"
          >
            <dt className={label}>{figure.term}</dt>
            <dd className="font-heading text-display text-foreground tabular-nums">
              {figure.value}
            </dd>
            <dd className="max-w-lg text-body text-foreground">
              {figure.change}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Commentary() {
  return (
    <section
      aria-labelledby="commentary-heading"
      className="flex flex-col gap-6"
    >
      <h2 id="commentary-heading" className="text-h2">
        What happened
      </h2>
      <div className="flex flex-col gap-4">
        <p className="max-w-lg text-body text-foreground">
          Our income for the year was £412,860, up 14% on the year before.
          <NoteMarker n={1} /> Most of the growth came from two new café
          clients, Brindle Café and the Oakum Coffee House, who now order menus,
          cup sleeves and loyalty cards from us every month. A busy summer of
          event print did the rest: festival programmes, wedding stationery and
          signs for three trade fairs.
        </p>
        <p className="max-w-lg text-body text-foreground">
          Our costs rose by 11% to £356,240. Paper was the largest part of the
          rise: the prices we paid for our stock went up by about 9% over the
          year.
          <NoteMarker n={2} /> We kept our suppliers and bought in larger runs
          where we could, which held our other costs close to last year’s, apart
          from the new machine.
        </p>
        <p className="max-w-lg text-body text-foreground">
          The second quarter, January to March, made a loss of £4,180, because
          we paid £18,400 for a new folding machine in full in February.
          <NoteMarker n={3} /> Cash was at its lowest at the end of March, at
          £29,870. It recovered through the spring and summer and stood at
          £54,310 at the end of September, the highest of the year.
        </p>
      </div>
    </section>
  )
}

function NetAmount({
  kind,
  amount,
  total = false,
}: Quarter["net"] & { total?: boolean }) {
  return (
    <span className="inline-flex items-baseline justify-end gap-2 whitespace-nowrap">
      <span className={label}>{kind}</span>
      <span
        className={cn(
          "tabular-nums",
          total ? "font-heading text-h2" : "font-mono",
          kind === "Profit" ? "text-primary" : "text-destructive"
        )}
      >
        {amount}
      </span>
    </span>
  )
}

function ByQuarter() {
  const head = cn("px-4 first:pl-6 last:pr-6", label)
  const figure = cn(cellPad, "text-right font-mono tabular-nums")
  const total = cn(
    cellPad,
    "border-t-4 border-double border-foreground font-heading text-h2 tabular-nums"
  )

  return (
    <section aria-labelledby="quarter-heading" className="flex flex-col gap-6">
      <h2 id="quarter-heading" className="text-h2">
        By quarter
      </h2>
      <p className="max-w-lg text-body text-foreground">
        Income and costs exclude VAT. Cash is the balance of both accounts on
        the last day of each quarter.
      </p>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table label="The year by quarter" className="text-body">
          <TableHeader>
            <TableRow>
              <TableHead className={head}>Quarter</TableHead>
              <TableHead className={cn(head, "text-right")}>Income</TableHead>
              <TableHead className={cn(head, "text-right")}>Costs</TableHead>
              <TableHead className={cn(head, "text-right")}>Net</TableHead>
              <TableHead className={cn(head, "text-right")}>Margin</TableHead>
              <TableHead className={cn(head, "text-right")}>
                Cash at end
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quarters.map((q) => (
              <TableRow key={q.quarter}>
                <TableCell className={cellPad}>
                  <div className="flex flex-col gap-1">
                    <span className="text-body">{q.quarter}</span>
                    <span className={smallFigure}>{q.months}</span>
                  </div>
                </TableCell>
                <TableCell className={figure}>{q.income}</TableCell>
                <TableCell className={figure}>{q.costs}</TableCell>
                <TableCell className={cn(cellPad, "text-right")}>
                  <NetAmount {...q.net} />
                </TableCell>
                <TableCell className={figure}>{q.margin}</TableCell>
                <TableCell className={figure}>{q.cash}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-transparent font-normal">
            <TableRow className="hover:bg-transparent">
              <TableCell className={total}>Year</TableCell>
              <TableCell className={cn(total, "text-right")}>
                £412,860
              </TableCell>
              <TableCell className={cn(total, "text-right")}>
                £356,240
              </TableCell>
              <TableCell className={cn(total, "text-right")}>
                <NetAmount kind="Profit" amount="+£56,620" total />
              </TableCell>
              <TableCell className={cn(total, "text-right")}>13.7%</TableCell>
              <TableCell className={cn(total, "text-right")}>£54,310</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </section>
  )
}

function Notes() {
  return (
    <section aria-labelledby="notes-heading" className="flex flex-col gap-6">
      <h2 id="notes-heading" className="text-h2">
        Notes
      </h2>
      <ol className="flex list-decimal flex-col gap-2 pl-6">
        {notes.map((note, i) => (
          <li
            key={i}
            id={`note-${i + 1}`}
            className="max-w-lg text-body text-foreground"
          >
            {note}
          </li>
        ))}
      </ol>
      <p className={smallFigure}>
        Prepared by Fairhold on{" "}
        <time dateTime="2026-11-20">20 November 2026</time> from the records of
        both accounts.
      </p>
    </section>
  )
}

export function App() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <SiteHeader />
      <main className="flex-1 py-6 md:py-12">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-4 md:px-6">
          <PageHeader />
          <YearInFigures />
          <Commentary />
          <ByQuarter />
          <Notes />
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
