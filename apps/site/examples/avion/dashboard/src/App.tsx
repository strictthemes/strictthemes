import { useId, useRef, useState, type KeyboardEvent } from "react"
import { ArrowDown, ArrowUp, Minus, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
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
const buttonText = "px-5 font-mono text-label uppercase"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const panelHeadingRow =
  "flex min-h-7 flex-wrap items-center justify-between gap-3"
const panelHeading = "font-mono text-label text-muted-foreground uppercase"

/* Navigation */

const navLinks = [
  { label: "Overview", href: "/", current: true },
  { label: "Shipments", href: "/shipments", current: false },
  { label: "Depots", href: "/depots", current: false },
  { label: "Reports", href: "/reports", current: false },
]

function navLinkClass(current: boolean) {
  return cn(
    "font-mono text-label uppercase transition-colors duration-150",
    focusRing,
    current ? "text-foreground" : "text-muted-foreground hover:text-foreground"
  )
}

/* Key numbers */

type Period = "today" | "7d" | "30d"
type Trend = "better" | "worse" | "neutral"
type Direction = "up" | "down" | "none"

type KeyNumber = {
  label: string
  value: string
  unit?: string
  change: string
  direction: Direction
  trend: Trend
  badge?: string
}

const periods: { value: Period; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
]

const inTransit: KeyNumber = {
  label: "In transit",
  value: "2,316",
  change: "Up 3% on this time yesterday",
  direction: "up",
  trend: "neutral",
}

const keyNumbers: Record<Period, KeyNumber[]> = {
  today: [
    {
      label: "Delivered",
      value: "1,284",
      change: "Up 4% on yesterday",
      direction: "up",
      trend: "better",
    },
    inTransit,
    {
      label: "Late",
      value: "37",
      change: "Up 9% on yesterday",
      direction: "up",
      trend: "worse",
      badge: "Check",
    },
    {
      label: "On-time rate",
      value: "96.8",
      unit: "%",
      change: "Down 1 point on yesterday",
      direction: "down",
      trend: "worse",
    },
  ],
  "7d": [
    {
      label: "Delivered",
      value: "8,947",
      change: "Up 2% on last week",
      direction: "up",
      trend: "better",
    },
    inTransit,
    {
      label: "Late",
      value: "291",
      change: "Up 6% on last week",
      direction: "up",
      trend: "worse",
      badge: "Check",
    },
    {
      label: "On-time rate",
      value: "96.7",
      unit: "%",
      change: "No change on last week",
      direction: "none",
      trend: "neutral",
    },
  ],
  "30d": [
    {
      label: "Delivered",
      value: "38,512",
      change: "Down 1% on previous 30 days",
      direction: "down",
      trend: "worse",
    },
    inTransit,
    {
      label: "Late",
      value: "1,164",
      change: "Down 3% on previous 30 days",
      direction: "down",
      trend: "better",
      badge: "Check",
    },
    {
      label: "On-time rate",
      value: "97.0",
      unit: "%",
      change: "No change on previous 30 days",
      direction: "none",
      trend: "neutral",
    },
  ],
}

const trendColor: Record<Trend, string> = {
  better: "text-success",
  worse: "text-destructive",
  neutral: "text-muted-foreground",
}

function ChangeIcon({ direction }: { direction: Direction }) {
  const Icon =
    direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : Minus
  return <Icon aria-hidden="true" className="size-4" strokeWidth={1.5} />
}

/* Chart: the last 14 days, the last one is today so far */

const chartTop = 1600
const deliveriesPerDay = [
  { date: "2026-10-31", label: "31 Oct", count: 1062 },
  { date: "2026-11-01", label: "1 Nov", count: 874 },
  { date: "2026-11-02", label: "2 Nov", count: 1218 },
  { date: "2026-11-03", label: "3 Nov", count: 1347 },
  { date: "2026-11-04", label: "4 Nov", count: 1295 },
  { date: "2026-11-05", label: "5 Nov", count: 1381 },
  { date: "2026-11-06", label: "6 Nov", count: 1411 },
  { date: "2026-11-07", label: "7 Nov", count: 1126 },
  { date: "2026-11-08", label: "8 Nov", count: 903 },
  { date: "2026-11-09", label: "9 Nov", count: 1254 },
  { date: "2026-11-10", label: "10 Nov", count: 1322 },
  { date: "2026-11-11", label: "11 Nov", count: 1368 },
  { date: "2026-11-12", label: "12 Nov", count: 1309 },
  { date: "2026-11-13", label: "Today", count: 1284 },
]

/* Needs attention */

type StateKind = "good" | "failed" | "caution" | "neutral"

const dotColor: Record<StateKind, string> = {
  good: "bg-success",
  failed: "bg-destructive",
  caution: "bg-tertiary",
  neutral: "bg-muted-foreground",
}

function State({ kind, children }: { kind: StateKind; children: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", dotColor[kind])}
      />
      <span className="text-body text-foreground">{children}</span>
    </span>
  )
}

const attention: {
  id: string
  kind: StateKind
  state: string
  text: string
  time: string
}[] = [
  {
    id: "NG-48177",
    kind: "failed",
    state: "Failed",
    text: "could not be delivered in Hollin Cross. No one was home and the customer has refused a safe place.",
    time: "14:12",
  },
  {
    id: "NG-48190",
    kind: "caution",
    state: "Delayed",
    text: "is held at Millbrook depot after its van broke down on the ring road.",
    time: "13:48",
  },
  {
    id: "NG-48204",
    kind: "caution",
    state: "Delayed",
    text: "missed the noon trunk to Carrow and now leaves on the 15:30 run.",
    time: "13:20",
  },
  {
    id: "NG-48139",
    kind: "failed",
    state: "Failed",
    text: "came back to Elmstead depot because the address has no house number.",
    time: "11:05",
  },
]

/* Recent shipments */

type Status = "transit" | "delivered" | "late"

const statusInfo: Record<Status, { label: string; kind: StateKind }> = {
  transit: { label: "In transit", kind: "neutral" },
  delivered: { label: "Delivered", kind: "good" },
  late: { label: "Late", kind: "failed" },
}

const shipments: {
  id: string
  destination: string
  depot: string
  status: Status
  weight: string
  due: string
}[] = [
  {
    id: "NG-48231",
    destination: "Wexley",
    depot: "Ashford Vale",
    status: "transit",
    weight: "2.4",
    due: "16:30",
  },
  {
    id: "NG-48228",
    destination: "Stannard Bay",
    depot: "Carrow",
    status: "delivered",
    weight: "0.8",
    due: "14:00",
  },
  {
    id: "NG-48226",
    destination: "Fernhill",
    depot: "Millbrook",
    status: "late",
    weight: "12.6",
    due: "12:00",
  },
  {
    id: "NG-48222",
    destination: "Larkmoor",
    depot: "Elmstead",
    status: "transit",
    weight: "5.1",
    due: "17:45",
  },
  {
    id: "NG-48219",
    destination: "Oxwick",
    depot: "Ashford Vale",
    status: "delivered",
    weight: "1.3",
    due: "13:30",
  },
  {
    id: "NG-48215",
    destination: "Brindle Green",
    depot: "Carrow",
    status: "transit",
    weight: "18.0",
    due: "18:00",
  },
  {
    id: "NG-48212",
    destination: "Cawthorne Mill",
    depot: "Millbrook",
    status: "delivered",
    weight: "3.7",
    due: "12:30",
  },
  {
    id: "NG-48209",
    destination: "Redgate",
    depot: "Elmstead",
    status: "late",
    weight: "0.5",
    due: "11:00",
  },
  {
    id: "NG-48207",
    destination: "Pelham Down",
    depot: "Ashford Vale",
    status: "delivered",
    weight: "7.9",
    due: "10:30",
  },
  {
    id: "NG-48203",
    destination: "Hollin Cross",
    depot: "Carrow",
    status: "transit",
    weight: "26.2",
    due: "17:00",
  },
]

type Filter = "all" | Status

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "transit", label: "In transit" },
  { value: "delivered", label: "Delivered" },
  { value: "late", label: "Late" },
]

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [period, setPeriod] = useState<Period>("today")
  const [filter, setFilter] = useState<Filter>("all")
  const [query, setQuery] = useState("")
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const chartHeadingId = useId()

  function onHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (menuOpen && event.key === "Escape") {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  const search = query.trim().toLowerCase()
  const visibleShipments = shipments.filter(
    (s) =>
      (filter === "all" || s.status === filter) &&
      (search === "" ||
        s.id.toLowerCase().includes(search) ||
        s.destination.toLowerCase().includes(search))
  )

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card" onKeyDown={onHeaderKeyDown}>
        <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-3 py-3 md:px-5">
          <a
            href="/"
            className={cn(
              "font-heading text-h2 transition-colors duration-150",
              focusRing
            )}
          >
            Northgate
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className={navLinkClass(link.current)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <span className={cn("ml-auto hidden md:block", smallFigure)}>
            Maren Okafor
          </span>
          <Button
            ref={menuButtonRef}
            variant="outline"
            className={cn("ml-auto md:hidden", buttonText)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="mobile-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t md:hidden"
        >
          <ul className="mx-auto max-w-[1280px] px-3 py-2 md:px-5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn("block py-2", navLinkClass(link.current))}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto grid max-w-[1280px] grid-cols-1 gap-5 px-3 py-5 md:grid-cols-12 md:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-12">
          <h1 className="text-h1">Overview</h1>
          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="Period"
              className="flex flex-wrap gap-1"
            >
              {periods.map((p) => (
                <Button
                  key={p.value}
                  variant={period === p.value ? "secondary" : "outline"}
                  aria-pressed={period === p.value}
                  className={buttonText}
                  onClick={() => setPeriod(p.value)}
                >
                  {p.label}
                </Button>
              ))}
            </div>
            <Button className={buttonText}>New shipment</Button>
          </div>
        </div>

        {keyNumbers[period].map((item) => (
          <section
            key={item.label}
            className="rounded-xl border bg-card p-5 md:col-span-6 lg:col-span-3"
          >
            <div className={panelHeadingRow}>
              <h2 className={panelHeading}>{item.label}</h2>
              {item.badge && (
                <Badge
                  variant="outline"
                  className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
                >
                  {item.badge}
                </Badge>
              )}
            </div>
            <p className="mt-3 flex items-baseline gap-1">
              <span className="font-heading text-h1 tabular-nums">
                {item.value}
              </span>
              {item.unit && <span className={smallFigure}>{item.unit}</span>}
            </p>
            <p
              className={cn(
                "mt-2 flex items-center gap-2 font-mono text-label tabular-nums",
                trendColor[item.trend]
              )}
            >
              <ChangeIcon direction={item.direction} />
              {item.change}
            </p>
          </section>
        ))}

        <section className="flex flex-col rounded-xl border bg-card p-5 md:col-span-12 lg:col-span-8">
          <div className={panelHeadingRow}>
            <h2 id={chartHeadingId} className={panelHeading}>
              Deliveries per day
            </h2>
          </div>
          <div className="sr-only">
            <table aria-labelledby={chartHeadingId}>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Deliveries</th>
                </tr>
              </thead>
              <tbody>
                {deliveriesPerDay.map((day) => (
                  <tr key={day.date}>
                    <td>{day.label}</td>
                    <td>{day.count.toLocaleString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div aria-hidden="true" className="mt-3 flex flex-1 flex-col">
            <div className="flex min-h-48 flex-1 gap-2">
              <div className="relative w-12">
                <span className={cn("absolute top-0 right-0", smallFigure)}>
                  1,600
                </span>
                <span
                  className={cn(
                    "absolute top-1/2 right-0 -translate-y-1/2",
                    smallFigure
                  )}
                >
                  800
                </span>
                <span className={cn("absolute right-0 bottom-0", smallFigure)}>
                  0
                </span>
              </div>
              <div className="relative flex-1">
                <div className="absolute inset-x-0 top-0 border-t border-border" />
                <div className="absolute inset-x-0 top-1/2 border-t border-border" />
                <div className="absolute inset-x-0 bottom-0 border-t border-border" />
                <div className="absolute inset-0 flex items-end gap-2">
                  {deliveriesPerDay.map((day, i) => (
                    <div
                      key={day.date}
                      className={cn(
                        "flex-1",
                        i === deliveriesPerDay.length - 1
                          ? "bg-primary"
                          : "bg-secondary",
                        i < 7 && "hidden md:block"
                      )}
                      style={{ height: `${(day.count / chartTop) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-2 flex gap-2 pl-14">
              {deliveriesPerDay.map((day, i) => {
                const last = i === deliveriesPerDay.length - 1
                return (
                  <div
                    key={day.date}
                    className={cn(
                      "min-w-0 flex-1 text-center whitespace-nowrap",
                      smallFigure,
                      last && "text-right text-foreground",
                      i < 7 && "hidden md:block"
                    )}
                  >
                    {i % 2 === 1 &&
                      (last ? (
                        <time dateTime={day.date}>Today</time>
                      ) : (
                        <time dateTime={day.date}>{day.label}</time>
                      ))}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border bg-card md:col-span-12 lg:col-span-4">
          <div className="border-b px-5 pt-5 pb-3">
            <div className={panelHeadingRow}>
              <h2 className={panelHeading}>Needs attention</h2>
            </div>
          </div>
          <ul>
            {attention.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-1 px-5 py-3 not-first:border-t"
              >
                <div>
                  <State kind={item.kind}>{item.state}</State>
                </div>
                <p className="max-w-md text-body">
                  <a href="#" className={textLink}>
                    {item.id}
                  </a>{" "}
                  {item.text}
                </p>
                <time
                  dateTime={`2026-11-13T${item.time}`}
                  className={smallFigure}
                >
                  {item.time}
                </time>
              </li>
            ))}
          </ul>
        </section>

        <section className="overflow-hidden rounded-xl border bg-card md:col-span-12">
          <div className="border-b px-5 pt-5 pb-3">
            <div className={panelHeadingRow}>
              <h2 className={panelHeading}>Recent shipments</h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search
                    aria-hidden="true"
                    className="absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <Input
                    type="search"
                    aria-label="Search shipments"
                    placeholder="ID or destination"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="px-2 pl-8 text-body md:text-body [&::-webkit-search-cancel-button]:appearance-none"
                  />
                </div>
                <div
                  role="group"
                  aria-label="Status"
                  className="flex flex-wrap gap-1"
                >
                  {filters.map((f) => (
                    <Button
                      key={f.value}
                      variant={filter === f.value ? "secondary" : "outline"}
                      aria-pressed={filter === f.value}
                      className={buttonText}
                      onClick={() => setFilter(f.value)}
                    >
                      {f.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Table label="Recent shipments" className="text-body">
            <TableHeader>
              <TableRow>
                <TableHead className="px-5 font-mono text-label text-muted-foreground uppercase">
                  ID
                </TableHead>
                <TableHead className="px-5 font-mono text-label text-muted-foreground uppercase">
                  Destination
                </TableHead>
                <TableHead className="px-5 font-mono text-label text-muted-foreground uppercase">
                  Depot
                </TableHead>
                <TableHead className="px-5 font-mono text-label text-muted-foreground uppercase">
                  Status
                </TableHead>
                <TableHead className="px-5 text-right font-mono text-label text-muted-foreground uppercase">
                  Weight <span className="normal-case">(kg)</span>
                </TableHead>
                <TableHead className="px-5 text-right font-mono text-label text-muted-foreground uppercase">
                  Due
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleShipments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-5 py-2 text-muted-foreground"
                  >
                    No shipments match.
                  </TableCell>
                </TableRow>
              ) : (
                visibleShipments.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="px-5 py-2">
                      <a
                        href="#"
                        className={cn("font-mono tabular-nums", textLink)}
                      >
                        {s.id}
                      </a>
                    </TableCell>
                    <TableCell className="px-5 py-2">{s.destination}</TableCell>
                    <TableCell className="px-5 py-2">{s.depot}</TableCell>
                    <TableCell className="px-5 py-2">
                      <State kind={statusInfo[s.status].kind}>
                        {statusInfo[s.status].label}
                      </State>
                    </TableCell>
                    <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                      {s.weight}
                    </TableCell>
                    <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                      <time dateTime={`2026-11-13T${s.due}`}>{s.due}</time>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </section>
      </main>
    </div>
  )
}

export default App
