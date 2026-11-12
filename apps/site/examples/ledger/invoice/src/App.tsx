import { useState, type ReactNode } from "react"

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

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const navLinks = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Invoices", href: "/invoice" },
  { label: "Payments", href: "/payment" },
  { label: "Reports", href: "/report" },
]
const currentHref = "/invoice"

const lineItems = [
  { description: "Menu cards", quantity: "400", unit: "£1.10", amount: "£440.00" },
  { description: "Table tents", quantity: "120", unit: "£2.50", amount: "£300.00" },
  { description: "Window posters", quantity: "6", unit: "£45.00", amount: "£270.00" },
  {
    description: "Design and proofing",
    quantity: "1",
    unit: "£230.00",
    amount: "£230.00",
  },
]

type ActivityItem = {
  id: string
  text: ReactNode
  date: string
  dateTime: string
}

const initialActivity: ActivityItem[] = [
  {
    id: "viewed",
    text: "Viewed by Larkspur Café",
    date: "24 Nov 2026",
    dateTime: "2026-11-24",
  },
  {
    id: "sent",
    text: (
      <>
        Sent to <span className="font-mono">accounts@larkspur.example</span>
      </>
    ),
    date: "13 Nov 2026",
    dateTime: "2026-11-13",
  },
  {
    id: "created",
    text: "Created by Ada Hollis",
    date: "13 Nov 2026",
    dateTime: "2026-11-13",
  },
]

const labelClass = "font-mono text-label uppercase text-muted-foreground"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"

function NavLink({
  label,
  href,
  className,
}: {
  label: string
  href: string
  className?: string
}) {
  const current = href === currentHref
  return (
    <a
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "font-mono text-label uppercase transition-colors duration-150",
        focusRing,
        current
          ? "text-foreground underline underline-offset-4"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {label}
    </a>
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
      <span className="text-body text-foreground">{paid ? "Paid" : "Sent"}</span>
    </span>
  )
}

function DetailRow({
  term,
  children,
  mono = true,
}: {
  term: string
  children: ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-border py-2 first:border-t-0">
      <dt className={labelClass}>{term}</dt>
      <dd
        className={cn(
          "text-right",
          mono ? "font-mono tabular-nums" : "text-body"
        )}
      >
        {children}
      </dd>
    </div>
  )
}

const cellEdge = "px-4 py-2 first:pl-0 last:pr-0"

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [paid, setPaid] = useState(false)
  const [activity, setActivity] = useState(initialActivity)

  function markAsPaid() {
    if (paid) return
    setPaid(true)
    setActivity((rows) => [
      {
        id: "paid",
        text: "Marked as paid by Ada Hollis",
        date: "27 Nov 2026",
        dateTime: "2026-11-27",
      },
      ...rows,
    ])
  }

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
                  <NavLink {...link} />
                </li>
              ))}
            </ul>
          </nav>
          <p className={cn(smallFigure, "ml-auto hidden md:block")}>
            Hollis &amp; Vane
          </p>
          <Button
            variant="outline"
            className="ml-auto px-4 font-mono text-label uppercase md:hidden"
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
                  <NavLink {...link} className="block py-2" />
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className="flex-1 py-6 md:py-12">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className={labelClass}>Invoice</p>
              <h1 className="text-h1">INV-0142</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="px-4 font-mono text-label uppercase"
              >
                Download PDF
              </Button>
              <Button
                className="px-4 font-mono text-label uppercase"
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
              aria-labelledby="invoice-title"
              className="flex min-w-0 flex-col gap-12 rounded-xl border border-border bg-card p-6 md:p-12 lg:col-span-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="flex flex-col gap-2">
                  <p className="font-heading text-h2">Hollis &amp; Vane</p>
                  <address className="text-body not-italic">
                    Hollis &amp; Vane Ltd
                    <br />
                    Unit 4, Tanner&apos;s Yard
                    <br />
                    Kestle KS3 9QT
                  </address>
                  <p className={smallFigure}>VAT GB 318 4402 17</p>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 id="invoice-title" className="text-h2">
                    Invoice
                  </h2>
                  <p className={cn(smallFigure, "text-foreground")}>INV-0142</p>
                  <State paid={paid} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <h3 className={cn("font-mono text-label", labelClass)}>
                    Bill to
                  </h3>
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
                  <DetailRow term="Invoice number">INV-0142</DetailRow>
                  <DetailRow term="Issued">
                    <time dateTime="2026-11-13">13 Nov 2026</time>
                  </DetailRow>
                  <DetailRow term="Due">
                    <time dateTime="2026-11-27">27 Nov 2026</time>
                  </DetailRow>
                  <DetailRow term="Your reference">LC-PO-2211</DetailRow>
                </dl>
              </div>

              <Table label="Line items" className="text-body">
                <TableHeader>
                  <TableRow>
                    <TableHead className={cn(labelClass, "min-w-48 px-4 first:pl-0 last:pr-0")}>
                      Description
                    </TableHead>
                    <TableHead className={cn(labelClass, "px-4 text-right first:pl-0 last:pr-0")}>
                      Quantity
                    </TableHead>
                    <TableHead className={cn(labelClass, "px-4 text-right first:pl-0 last:pr-0")}>
                      Unit price
                    </TableHead>
                    <TableHead className={cn(labelClass, "px-4 text-right first:pl-0 last:pr-0")}>
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item) => (
                    <TableRow key={item.description}>
                      <TableCell className={cn(cellEdge, "whitespace-normal")}>
                        {item.description}
                      </TableCell>
                      <TableCell className={cn(cellEdge, "text-right font-mono tabular-nums")}>
                        {item.quantity}
                      </TableCell>
                      <TableCell className={cn(cellEdge, "text-right font-mono tabular-nums")}>
                        {item.unit}
                      </TableCell>
                      <TableCell className={cn(cellEdge, "text-right font-mono tabular-nums")}>
                        {item.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className="bg-transparent font-normal">
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={3} className={cn(cellEdge, "text-right")}>
                      <span className={labelClass}>Subtotal</span>
                    </TableCell>
                    <TableCell
                      className={cn(cellEdge, "text-right font-mono tabular-nums text-foreground")}
                    >
                      £1,240.00
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={3} className={cn(cellEdge, "text-right")}>
                      <span className={labelClass}>VAT 20%</span>
                    </TableCell>
                    <TableCell
                      className={cn(cellEdge, "text-right font-mono tabular-nums text-foreground")}
                    >
                      £248.00
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={3}
                      className={cn(
                        cellEdge,
                        "border-t-4 border-double border-foreground text-right font-heading text-h2 tabular-nums"
                      )}
                    >
                      Total
                    </TableCell>
                    <TableCell
                      className={cn(
                        cellEdge,
                        "border-t-4 border-double border-foreground text-right font-heading text-h2 tabular-nums"
                      )}
                    >
                      £1,488.00
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>

              <div className="flex flex-col gap-3 border-t border-border pt-6">
                <h3 className={cn("font-mono text-label", labelClass)}>
                  Payment details
                </h3>
                <p className="max-w-lg text-body text-foreground">
                  Pay by bank transfer within 14 days, quoting the invoice
                  number.
                </p>
                <dl className="w-full max-w-md">
                  <DetailRow term="Account name" mono={false}>
                    Hollis &amp; Vane Ltd
                  </DetailRow>
                  <DetailRow term="Sort code">60-14-22</DetailRow>
                  <DetailRow term="Account number">31884417</DetailRow>
                  <DetailRow term="Reference">INV-0142</DetailRow>
                </dl>
              </div>
            </article>

            <div className="flex flex-col gap-6 lg:col-span-4">
              <section
                aria-labelledby="status-heading"
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
              >
                <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
                  <h2 id="status-heading" className={cn("font-mono text-label", labelClass)}>
                    Status
                  </h2>
                  {!paid && (
                    <Badge
                      variant="outline"
                      className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label uppercase text-tertiary-foreground"
                    >
                      Due
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <State paid={paid} />
                    <p className={smallFigure}>
                      {paid ? "Paid" : "Due"}{" "}
                      <time dateTime="2026-11-27">27 Nov 2026</time>
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-col gap-1">
                      <p className={labelClass}>Amount due</p>
                      <p className="font-heading text-h1 tabular-nums text-foreground">
                        {paid ? "£0.00" : "£1,488.00"}
                      </p>
                    </div>
                    <div role="status">
                      {paid && (
                        <p className="mt-3 max-w-lg text-body text-foreground">
                          Invoice INV-0142 marked as paid.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section
                aria-labelledby="activity-heading"
                className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="flex min-h-8 flex-wrap items-center justify-between gap-3 border-b border-border px-6 pt-6 pb-3">
                  <h2 id="activity-heading" className={cn("font-mono text-label", labelClass)}>
                    Activity
                  </h2>
                </div>
                <ul>
                  {activity.map((row) => (
                    <li
                      key={row.id}
                      className="flex flex-col gap-1 border-t border-border px-6 py-3 first:border-t-0"
                    >
                      <p className="max-w-lg text-body text-foreground">{row.text}</p>
                      <time dateTime={row.dateTime} className={smallFigure}>
                        {row.date}
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
