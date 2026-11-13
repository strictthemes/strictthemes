import { useRef, useState, type KeyboardEvent, type ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

// The sample's today: a fixed date, never the device clock.
const TODAY = "2026-11-27"

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

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number)
  return `${day} ${MONTHS[month - 1]} ${year}`
}

function DateValue({ iso }: { iso: string }) {
  return <time dateTime={iso}>{formatDate(iso)}</time>
}

function formatMoney(pence: number) {
  const pounds = Math.floor(pence / 100)
  const rest = String(pence % 100).padStart(2, "0")
  return `£${pounds.toLocaleString("en-GB")}.${rest}`
}

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const label = "font-mono text-label uppercase text-muted-foreground"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const sheet = "rounded-xl border border-border bg-card"
const headingRow = "flex min-h-8 flex-wrap items-center justify-between gap-3"

const NAV_LINKS = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Invoices", href: "/invoice" },
  { label: "Payments", href: "/payment" },
  { label: "Reports", href: "/report" },
]
const CURRENT_HREF = "/invoice"

const INVOICE = {
  number: "INV-0142",
  issued: "2026-11-13",
  due: "2026-11-27",
  reference: "LC-PO-2211",
}

const LINE_ITEMS = [
  {
    description: "Menu cards, A5, printed both sides on 350gsm uncoated",
    quantity: 400,
    unit: 110,
  },
  {
    description: "Table tents, folded and scored",
    quantity: 120,
    unit: 250,
  },
  {
    description: "Window posters, A2, for the spring menu",
    quantity: 6,
    unit: 4500,
  },
  {
    description: "Design and proofing, two rounds of changes",
    quantity: 1,
    unit: 23000,
  },
]

const SUBTOTAL = LINE_ITEMS.reduce(
  (sum, item) => sum + item.quantity * item.unit,
  0
)
const VAT = Math.round(SUBTOTAL * 0.2)
const TOTAL = SUBTOTAL + VAT

type ActivityItem = { id: string; text: ReactNode; date: string }

const INITIAL_ACTIVITY: ActivityItem[] = [
  { id: "viewed", text: "Viewed by Larkspur Café", date: "2026-11-24" },
  {
    id: "sent",
    text: (
      <>
        Sent to{" "}
        <span className="font-mono wrap-break-word">
          accounts@larkspur.example
        </span>
      </>
    ),
    date: "2026-11-13",
  },
  { id: "created", text: "Created by Ada Hollis", date: "2026-11-13" },
]

function NavLinks({ className }: { className?: string }) {
  return NAV_LINKS.map((link) => {
    const current = link.href === CURRENT_HREF
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
            focusOutline,
            className
          )}
        >
          {link.label}
        </a>
      </li>
    )
  })
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
    <div className="flex items-baseline justify-between gap-3 border-border py-2 not-first:border-t">
      <dt className={label}>{term}</dt>
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

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [paid, setPaid] = useState(false)
  const [activity, setActivity] = useState(INITIAL_ACTIVITY)
  const [message, setMessage] = useState("")

  function handleHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  function markAsPaid() {
    if (paid) return
    setPaid(true)
    setActivity((items) => [
      { id: "paid", text: "Marked as paid by Ada Hollis", date: TODAY },
      ...items,
    ])
    setMessage(`Invoice ${INVOICE.number} marked as paid.`)
  }

  const buttonText = "px-4 font-mono text-label uppercase"

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <header
        className="border-b border-border"
        onKeyDown={handleHeaderKeyDown}
      >
        <div className="mx-auto flex w-full max-w-[1200px] items-center gap-6 px-4 py-4 md:px-6">
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground transition-colors duration-150",
              focusOutline
            )}
          >
            Fairhold
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              <NavLinks />
            </ul>
          </nav>
          <p className={cn(smallFigure, "ml-auto hidden md:block")}>
            Hollis &amp; Vane
          </p>
          <Button
            ref={menuButtonRef}
            variant="outline"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(buttonText, "ml-auto md:hidden")}
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
            <ul className="py-2">
              <NavLinks className="block py-2" />
            </ul>
          </div>
        </nav>
      </header>

      <main className="flex-1 py-6 md:py-12">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className={label}>Invoice</p>
              <h1 className="text-h1">{INVOICE.number}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className={buttonText}>
                Download PDF
              </Button>
              <Button
                onClick={markAsPaid}
                disabled={paid}
                focusableWhenDisabled
                className={buttonText}
              >
                Mark as paid
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <article
              aria-labelledby="invoice-title"
              className={cn(
                sheet,
                "flex min-w-0 flex-col gap-12 p-6 md:p-12 lg:col-span-8"
              )}
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
                  <p className={cn(smallFigure, "text-foreground")}>
                    {INVOICE.number}
                  </p>
                  <State paid={paid} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <h3 className={label}>Bill to</h3>
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
                  <DetailRow term="Invoice number">{INVOICE.number}</DetailRow>
                  <DetailRow term="Issued">
                    <DateValue iso={INVOICE.issued} />
                  </DetailRow>
                  <DetailRow term="Due">
                    <DateValue iso={INVOICE.due} />
                  </DetailRow>
                  <DetailRow term="Your reference">
                    {INVOICE.reference}
                  </DetailRow>
                </dl>
              </div>

              <div className="flex flex-col">
                <Table label="Line items" className="text-body">
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className={cn(
                          label,
                          "min-w-48 px-4 first:pl-0 last:pr-0"
                        )}
                      >
                        Description
                      </TableHead>
                      <TableHead
                        className={cn(
                          label,
                          "px-4 text-right first:pl-0 last:pr-0"
                        )}
                      >
                        Quantity
                      </TableHead>
                      <TableHead
                        className={cn(
                          label,
                          "px-4 text-right first:pl-0 last:pr-0"
                        )}
                      >
                        Unit price
                      </TableHead>
                      <TableHead
                        className={cn(
                          label,
                          "px-4 text-right first:pl-0 last:pr-0"
                        )}
                      >
                        Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {LINE_ITEMS.map((item) => (
                      <TableRow key={item.description}>
                        <TableCell className="px-4 py-2 whitespace-normal first:pl-0 last:pr-0">
                          {item.description}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-right font-mono tabular-nums first:pl-0 last:pr-0">
                          {item.quantity.toLocaleString("en-GB")}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-right font-mono tabular-nums first:pl-0 last:pr-0">
                          {formatMoney(item.unit)}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-right font-mono tabular-nums first:pl-0 last:pr-0">
                          {formatMoney(item.quantity * item.unit)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <dl className="flex w-full flex-col self-end md:max-w-sm">
                  <div className="flex items-baseline justify-between gap-3 border-t border-border py-2">
                    <dt className={label}>Subtotal</dt>
                    <dd className="font-mono text-foreground tabular-nums">
                      {formatMoney(SUBTOTAL)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 border-t border-border py-2">
                    <dt className={label}>VAT 20%</dt>
                    <dd className="font-mono text-foreground tabular-nums">
                      {formatMoney(VAT)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 border-t-4 border-double border-foreground py-2 font-heading text-h2 tabular-nums">
                    <dt>Total</dt>
                    <dd>{formatMoney(TOTAL)}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-col gap-3 border-t border-border pt-6">
                <h3 className={label}>Payment details</h3>
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
                  <DetailRow term="Reference">{INVOICE.number}</DetailRow>
                </dl>
              </div>
            </article>

            <div className="flex min-w-0 flex-col gap-6 lg:col-span-4">
              <section
                aria-labelledby="status-heading"
                className={cn(sheet, "flex flex-col gap-3 p-6")}
              >
                <div className={headingRow}>
                  <h2 id="status-heading" className={label}>
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
                    <p className={smallFigure}>
                      {paid ? "Paid" : "Due"}{" "}
                      <DateValue iso={paid ? TODAY : INVOICE.due} />
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-col gap-1">
                      <p className={label}>Amount due</p>
                      <p className="font-heading text-h1 text-foreground tabular-nums">
                        {formatMoney(paid ? 0 : TOTAL)}
                      </p>
                    </div>
                    <div role="status">
                      {message && <p className="mt-3 text-body">{message}</p>}
                    </div>
                  </div>
                </div>
              </section>

              <section
                aria-labelledby="activity-heading"
                className={cn(sheet, "flex flex-1 flex-col overflow-hidden")}
              >
                <div
                  className={cn(
                    headingRow,
                    "border-b border-border px-6 pt-6 pb-3"
                  )}
                >
                  <h2 id="activity-heading" className={label}>
                    Activity
                  </h2>
                </div>
                <ul>
                  {activity.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col gap-1 border-border px-6 py-3 not-first:border-t"
                    >
                      <p className="text-body text-foreground">{item.text}</p>
                      <p className={smallFigure}>
                        <DateValue iso={item.date} />
                      </p>
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
