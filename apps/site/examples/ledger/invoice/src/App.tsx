import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react"

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

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const navLinks = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Invoices", href: "/invoice" },
  { label: "Payments", href: "/payment" },
  { label: "Reports", href: "/report" },
]
const currentPath = "/invoice"

const lineItems = [
  {
    description: "Menu cards, printed on both sides.",
    quantity: "400",
    unitPrice: "£1.10",
    amount: "£440.00",
  },
  {
    description: "Table tents, folded and scored.",
    quantity: "120",
    unitPrice: "£2.50",
    amount: "£300.00",
  },
  {
    description: "Window posters, A2 on matt stock.",
    quantity: "6",
    unitPrice: "£45.00",
    amount: "£270.00",
  },
  {
    description: "Design and proofing, two rounds of changes.",
    quantity: "1",
    unitPrice: "£230.00",
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

const label = "font-mono text-label uppercase text-muted-foreground"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const sheet = "rounded-xl border border-border bg-card p-6"
const dlRow =
  "flex items-baseline justify-between gap-3 py-2 not-first:border-t not-first:border-border"

function InvoiceState({ paid }: { paid: boolean }) {
  return (
    <p className="inline-flex items-center gap-2">
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
    </p>
  )
}

function NavList({
  className,
  linkClassName,
}: {
  className?: string
  linkClassName?: string
}) {
  return (
    <ul className={className}>
      {navLinks.map((link) => {
        const current = link.href === currentPath
        return (
          <li key={link.href}>
            <a
              href={link.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "font-mono text-label uppercase transition-colors duration-150",
                focusOutline,
                current
                  ? "text-foreground underline underline-offset-4"
                  : "text-muted-foreground hover:text-foreground",
                linkClassName
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

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [paid, setPaid] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  const activity: ActivityItem[] = paid
    ? [
        {
          id: "paid",
          text: "Marked as paid by Ada Hollis",
          date: "27 Nov 2026",
          dateTime: "2026-11-27",
        },
        ...initialActivity,
      ]
    : initialActivity

  function handleHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  function markAsPaid() {
    if (paid) return
    setPaid(true)
  }

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
            <NavList className="flex gap-6" />
          </nav>
          <p className={cn(smallFigure, "ml-auto hidden md:block")}>
            Hollis &amp; Vane
          </p>
          <Button
            ref={menuButtonRef}
            variant="outline"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
            className="ml-auto px-4 font-mono text-label uppercase md:hidden"
          >
            Menu
          </Button>
        </div>
        <nav
          id={menuId}
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
        >
          <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
            <NavList className="py-2" linkClassName="block py-2" />
          </div>
        </nav>
      </header>

      <main className="flex-1 py-6 md:py-12">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className={label}>Invoice</p>
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
                onClick={markAsPaid}
                disabled={paid}
                focusableWhenDisabled
                className="px-4 font-mono text-label uppercase"
              >
                Mark as paid
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <article
              aria-labelledby="invoice-title"
              className="flex flex-col gap-12 rounded-xl border border-border bg-card p-6 md:p-12 lg:col-span-8"
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
                  <InvoiceState paid={paid} />
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
                  <div className={dlRow}>
                    <dt className={label}>Invoice number</dt>
                    <dd className="text-right font-mono tabular-nums">
                      INV-0142
                    </dd>
                  </div>
                  <div className={dlRow}>
                    <dt className={label}>Issued</dt>
                    <dd className="text-right font-mono tabular-nums">
                      <time dateTime="2026-11-13">13 Nov 2026</time>
                    </dd>
                  </div>
                  <div className={dlRow}>
                    <dt className={label}>Due</dt>
                    <dd className="text-right font-mono tabular-nums">
                      <time dateTime="2026-11-27">27 Nov 2026</time>
                    </dd>
                  </div>
                  <div className={dlRow}>
                    <dt className={label}>Your reference</dt>
                    <dd className="text-right font-mono tabular-nums">
                      LC-PO-2211
                    </dd>
                  </div>
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
                    {lineItems.map((item) => (
                      <TableRow key={item.description}>
                        <TableCell className="px-4 py-2 whitespace-normal first:pl-0 last:pr-0">
                          {item.description}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-right font-mono tabular-nums first:pl-0 last:pr-0">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-right font-mono tabular-nums first:pl-0 last:pr-0">
                          {item.unitPrice}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-right font-mono tabular-nums first:pl-0 last:pr-0">
                          {item.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <dl className="flex w-full flex-col self-end md:max-w-sm">
                  <div className="flex items-baseline justify-between gap-3 border-t border-border py-2">
                    <dt className={label}>Subtotal</dt>
                    <dd className="font-mono text-foreground tabular-nums">
                      £1,240.00
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 border-t border-border py-2">
                    <dt className={label}>VAT 20%</dt>
                    <dd className="font-mono text-foreground tabular-nums">
                      £248.00
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 border-t-4 border-double border-foreground py-2 font-heading text-h2 tabular-nums">
                    <dt>Total</dt>
                    <dd>£1,488.00</dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-col gap-3 border-t border-border pt-6">
                <h3 className={label}>Payment details</h3>
                <p className="max-w-lg text-body">
                  Pay by bank transfer within 14 days, quoting the invoice
                  number.
                </p>
                <dl className="w-full max-w-md">
                  <div className={dlRow}>
                    <dt className={label}>Account name</dt>
                    <dd className="text-right text-body">
                      Hollis &amp; Vane Ltd
                    </dd>
                  </div>
                  <div className={dlRow}>
                    <dt className={label}>Sort code</dt>
                    <dd className="text-right font-mono tabular-nums">
                      60-14-22
                    </dd>
                  </div>
                  <div className={dlRow}>
                    <dt className={label}>Account number</dt>
                    <dd className="text-right font-mono tabular-nums">
                      31884417
                    </dd>
                  </div>
                  <div className={dlRow}>
                    <dt className={label}>Reference</dt>
                    <dd className="text-right font-mono tabular-nums">
                      INV-0142
                    </dd>
                  </div>
                </dl>
              </div>
            </article>

            <div className="flex flex-col gap-6 lg:col-span-4">
              <section
                aria-labelledby="status-heading"
                className={cn(sheet, "flex flex-col gap-3")}
              >
                <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
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
                    <InvoiceState paid={paid} />
                    <p className={smallFigure}>
                      {paid ? "Paid" : "Due"}{" "}
                      <time dateTime="2026-11-27">27 Nov 2026</time>
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-col gap-1">
                      <p className={label}>Amount due</p>
                      <p className="font-heading text-h1 text-foreground tabular-nums">
                        {paid ? "£0.00" : "£1,488.00"}
                      </p>
                    </div>
                    <div role="status">
                      {paid && (
                        <p className="mt-3 text-body">
                          Invoice INV-0142 marked as paid.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section
                aria-labelledby="activity-heading"
                className="flex-1 overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="flex min-h-8 flex-wrap items-center justify-between gap-3 border-b border-border px-6 pt-6 pb-3">
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
                      <p className="text-body wrap-break-word">{item.text}</p>
                      <time dateTime={item.dateTime} className={smallFigure}>
                        {item.date}
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
