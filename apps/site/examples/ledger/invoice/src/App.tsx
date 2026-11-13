import { useState } from "react"

import { Badge } from "@/components/ui/badge"
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

// The sample's today: Friday 27 November 2026. Never the device clock.
const TODAY = { iso: "2026-11-27", text: "27 Nov 2026" }

const INVOICE = {
  number: "INV-0142",
  issued: { iso: "2026-11-13", text: "13 Nov 2026" },
  due: TODAY,
  reference: "LC-PO-2211",
  vatRate: 0.2,
}

const LINES = [
  { description: "Menu cards", quantity: 400, unitPrice: 1.1 },
  { description: "Table tents", quantity: 120, unitPrice: 2.5 },
  { description: "Window posters", quantity: 6, unitPrice: 45 },
  { description: "Design and proofing", quantity: 1, unitPrice: 230 },
]

const NAV_LINKS = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Invoices", href: "/invoice" },
  { label: "Payments", href: "/payment" },
  { label: "Reports", href: "/report" },
]

const CURRENT_PATH = "/invoice"

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const count = new Intl.NumberFormat("en-GB")

const subtotal = LINES.reduce(
  (sum, line) => sum + line.quantity * line.unitPrice,
  0
)
const vat = subtotal * INVOICE.vatRate
const total = subtotal + vat

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const CONTAINER = "mx-auto w-full max-w-[1200px] px-4 md:px-6"
const LABEL = "font-mono text-label uppercase text-muted-foreground"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const BUTTON = "px-4 font-mono text-label uppercase"
const DL_ROW =
  "flex items-baseline justify-between gap-3 border-border py-2 not-first:border-t"
const DL_VALUE = "text-right font-mono tabular-nums"
const HEAD_CELL =
  "px-4 font-mono text-label text-muted-foreground uppercase first:pl-0 last:pr-0"
const CELL = "px-4 py-2 first:pl-0 last:pr-0"
const NUMBER_CELL = cn(CELL, "text-right font-mono tabular-nums")

function navLinkClass(current: boolean) {
  return cn(
    "font-mono text-label uppercase transition-colors duration-150",
    FOCUS,
    current
      ? "text-foreground underline underline-offset-4"
      : "text-muted-foreground hover:text-foreground"
  )
}

function State({ paid }: { paid: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn(
          "size-2 shrink-0 rounded-sm",
          paid ? "bg-primary" : "bg-muted-foreground"
        )}
      />
      <span className="text-body text-foreground">
        {paid ? "Paid" : "Sent"}
      </span>
    </span>
  )
}

export function App() {
  const [paid, setPaid] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const activity = [
    ...(paid
      ? [{ id: "paid", text: <>Marked as paid by Ada Hollis</>, date: TODAY }]
      : []),
    {
      id: "viewed",
      text: <>Viewed by Larkspur Café</>,
      date: { iso: "2026-11-24", text: "24 Nov 2026" },
    },
    {
      id: "sent",
      text: (
        <>
          Sent to <span className="font-mono">accounts@larkspur.example</span>
        </>
      ),
      date: INVOICE.issued,
    },
    {
      id: "created",
      text: <>Created by Ada Hollis</>,
      date: INVOICE.issued,
    },
  ]

  function markAsPaid() {
    if (paid) return
    setPaid(true)
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
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
                    aria-current={
                      link.href === CURRENT_PATH ? "page" : undefined
                    }
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
            aria-controls="main-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="main-menu"
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
                    aria-current={
                      link.href === CURRENT_PATH ? "page" : undefined
                    }
                    className={cn(
                      navLinkClass(link.href === CURRENT_PATH),
                      "block py-2"
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

      <main className="flex-1 py-6 md:py-12">
        <div className={cn(CONTAINER, "flex flex-col gap-6")}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className={LABEL}>Invoice</p>
              <h1 className="text-h1">{INVOICE.number}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className={BUTTON}>
                Download PDF
              </Button>
              <Button
                className={BUTTON}
                disabled={paid}
                focusableWhenDisabled
                onClick={markAsPaid}
              >
                Mark as paid
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <article
              aria-labelledby="document-title"
              className="flex min-w-0 flex-col gap-12 rounded-xl border border-border bg-card p-6 md:p-12 lg:col-span-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="flex flex-col gap-2">
                  <p className="font-heading text-h2">Hollis &amp; Vane</p>
                  <address className="text-body not-italic">
                    Hollis &amp; Vane Ltd
                    <br />
                    Unit 4, Tanner&rsquo;s Yard
                    <br />
                    Kestle KS3 9QT
                  </address>
                  <p className={SMALL_FIGURE}>VAT GB 318 4402 17</p>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 id="document-title" className="text-h2">
                    Invoice
                  </h2>
                  <p className={cn(SMALL_FIGURE, "text-foreground")}>
                    {INVOICE.number}
                  </p>
                  <p>
                    <State paid={paid} />
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <h3 className={LABEL}>Bill to</h3>
                  <address className="text-body not-italic">
                    Larkspur Café
                    <br />
                    Accounts
                    <br />
                    18 Mill Row
                    <br />
                    Kestle KS1 4DE
                  </address>
                </div>
                <dl>
                  <div className={DL_ROW}>
                    <dt className={LABEL}>Invoice number</dt>
                    <dd className={DL_VALUE}>{INVOICE.number}</dd>
                  </div>
                  <div className={DL_ROW}>
                    <dt className={LABEL}>Issued</dt>
                    <dd className={DL_VALUE}>
                      <time dateTime={INVOICE.issued.iso}>
                        {INVOICE.issued.text}
                      </time>
                    </dd>
                  </div>
                  <div className={DL_ROW}>
                    <dt className={LABEL}>Due</dt>
                    <dd className={DL_VALUE}>
                      <time dateTime={INVOICE.due.iso}>{INVOICE.due.text}</time>
                    </dd>
                  </div>
                  <div className={DL_ROW}>
                    <dt className={LABEL}>Your reference</dt>
                    <dd className={DL_VALUE}>{INVOICE.reference}</dd>
                  </div>
                </dl>
              </div>

              <Table label="Line items" className="text-body">
                <TableHeader>
                  <TableRow>
                    <TableHead className={cn(HEAD_CELL, "min-w-48")}>
                      Description
                    </TableHead>
                    <TableHead className={cn(HEAD_CELL, "text-right")}>
                      Quantity
                    </TableHead>
                    <TableHead className={cn(HEAD_CELL, "text-right")}>
                      Unit price
                    </TableHead>
                    <TableHead className={cn(HEAD_CELL, "text-right")}>
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LINES.map((line) => (
                    <TableRow key={line.description}>
                      <TableCell className={cn(CELL, "whitespace-normal")}>
                        {line.description}
                      </TableCell>
                      <TableCell className={NUMBER_CELL}>
                        {count.format(line.quantity)}
                      </TableCell>
                      <TableCell className={NUMBER_CELL}>
                        {money.format(line.unitPrice)}
                      </TableCell>
                      <TableCell className={NUMBER_CELL}>
                        {money.format(line.quantity * line.unitPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className="bg-transparent font-normal">
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={3}
                      className={cn(CELL, LABEL, "text-right")}
                    >
                      Subtotal
                    </TableCell>
                    <TableCell className={cn(NUMBER_CELL, "text-foreground")}>
                      {money.format(subtotal)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={3}
                      className={cn(CELL, LABEL, "text-right")}
                    >
                      VAT 20%
                    </TableCell>
                    <TableCell className={cn(NUMBER_CELL, "text-foreground")}>
                      {money.format(vat)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={3}
                      className={cn(
                        CELL,
                        "border-t-4 border-double border-foreground text-right font-heading text-h2 tabular-nums"
                      )}
                    >
                      Total
                    </TableCell>
                    <TableCell
                      className={cn(
                        CELL,
                        "border-t-4 border-double border-foreground text-right font-heading text-h2 tabular-nums"
                      )}
                    >
                      {money.format(total)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>

              <div className="flex flex-col gap-3 border-t border-border pt-6">
                <h3 className={LABEL}>Payment details</h3>
                <p className="max-w-lg text-body text-foreground">
                  Pay by bank transfer within 14 days, quoting the invoice
                  number.
                </p>
                <dl className="w-full max-w-md">
                  <div className={DL_ROW}>
                    <dt className={LABEL}>Account name</dt>
                    <dd className="text-right text-body">
                      Hollis &amp; Vane Ltd
                    </dd>
                  </div>
                  <div className={DL_ROW}>
                    <dt className={LABEL}>Sort code</dt>
                    <dd className={DL_VALUE}>60-14-22</dd>
                  </div>
                  <div className={DL_ROW}>
                    <dt className={LABEL}>Account number</dt>
                    <dd className={DL_VALUE}>31884417</dd>
                  </div>
                  <div className={DL_ROW}>
                    <dt className={LABEL}>Reference</dt>
                    <dd className={DL_VALUE}>{INVOICE.number}</dd>
                  </div>
                </dl>
              </div>
            </article>

            <div className="flex min-w-0 flex-col gap-6 lg:col-span-4">
              <section
                aria-labelledby="status-title"
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
              >
                <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
                  <h2 id="status-title" className={LABEL}>
                    Status
                  </h2>
                  {!paid && (
                    <Badge
                      variant="outline"
                      className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
                    >
                      Due
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <State paid={paid} />
                    <p className={SMALL_FIGURE}>
                      {paid ? "Paid" : "Due"}{" "}
                      <time dateTime={TODAY.iso}>{TODAY.text}</time>
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-col gap-1">
                      <p className={LABEL}>Amount due</p>
                      <p className="font-heading text-h1 text-foreground tabular-nums">
                        {money.format(paid ? 0 : total)}
                      </p>
                    </div>
                    <div role="status">
                      {paid && (
                        <p className="mt-3 text-body text-foreground">
                          Invoice {INVOICE.number} marked as paid.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section
                aria-labelledby="activity-title"
                className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="flex min-h-8 flex-wrap items-center justify-between gap-3 border-b border-border px-6 pt-6 pb-3">
                  <h2 id="activity-title" className={LABEL}>
                    Activity
                  </h2>
                </div>
                <ul>
                  {activity.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex flex-col gap-1 border-border px-6 py-3 not-first:border-t"
                    >
                      <p className="text-body text-foreground">{entry.text}</p>
                      <time dateTime={entry.date.iso} className={SMALL_FIGURE}>
                        {entry.date.text}
                      </time>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
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
