import { useMemo, useState } from "react"
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
const panelHeading = "flex min-h-7 flex-wrap items-center justify-between gap-3"
const labelHeading = "font-mono text-label uppercase text-muted-foreground"

/* Top bar */

const navLinks = [
  { label: "Overview", href: "/", current: true },
  { label: "Shipments", href: "/shipments", current: false },
  { label: "Depots", href: "/depots", current: false },
  { label: "Reports", href: "/reports", current: false },
]

function NavLink({
  link,
  className,
}: {
  link: (typeof navLinks)[number]
  className?: string
}) {
  return (
    <a
      href={link.href}
      aria-current={link.current ? "page" : undefined}
      className={cn(
        "font-mono text-label uppercase transition-colors duration-150",
        link.current
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
        focusRing,
        className
      )}
    >
      {link.label}
    </a>
  )
}

/* Key numbers */

type Period = "today" | "7d" | "30d"

const periods: { value: Period; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
]

type Change = {
  direction: "up" | "down" | "flat"
  tone: "good" | "bad" | "neutral"
  text: string
}

type KeyNumber = {
  key: "delivered" | "transit" | "late" | "ontime"
  label: string
  value: string
  unit?: string
  change: Change
}

const keyNumbers: Record<Period, KeyNumber[]> = {
  today: [
    {
      key: "delivered",
      label: "Delivered",
      value: "1,284",
      change: { direction: "up", tone: "good", text: "Up 4% on yesterday" },
    },
    {
      key: "transit",
      label: "In transit",
      value: "2,416",
      change: { direction: "up", tone: "neutral", text: "Up 3% on yesterday" },
    },
    {
      key: "late",
      label: "Late",
      value: "37",
      change: { direction: "up", tone: "bad", text: "Up 16% on yesterday" },
    },
    {
      key: "ontime",
      label: "On-time rate",
      value: "96.4",
      unit: "%",
      change: {
        direction: "down",
        tone: "bad",
        text: "Down 1 point on yesterday",
      },
    },
  ],
  "7d": [
    {
      key: "delivered",
      label: "Delivered",
      value: "8,912",
      change: { direction: "up", tone: "good", text: "Up 2% on last week" },
    },
    {
      key: "transit",
      label: "In transit",
      value: "2,388",
      change: {
        direction: "down",
        tone: "neutral",
        text: "Down 1% on last week",
      },
    },
    {
      key: "late",
      label: "Late",
      value: "214",
      change: { direction: "down", tone: "good", text: "Down 6% on last week" },
    },
    {
      key: "ontime",
      label: "On-time rate",
      value: "97.1",
      unit: "%",
      change: {
        direction: "up",
        tone: "good",
        text: "Up 2 points on last week",
      },
    },
  ],
  "30d": [
    {
      key: "delivered",
      label: "Delivered",
      value: "37,640",
      change: { direction: "up", tone: "good", text: "Up 5% on last month" },
    },
    {
      key: "transit",
      label: "In transit",
      value: "2,350",
      change: {
        direction: "flat",
        tone: "neutral",
        text: "No change on last month",
      },
    },
    {
      key: "late",
      label: "Late",
      value: "1,086",
      change: { direction: "up", tone: "bad", text: "Up 3% on last month" },
    },
    {
      key: "ontime",
      label: "On-time rate",
      value: "96.9",
      unit: "%",
      change: {
        direction: "flat",
        tone: "neutral",
        text: "No change on last month",
      },
    },
  ],
}

const changeIcons = { up: ArrowUp, down: ArrowDown, flat: Minus }
const changeTones = {
  good: "text-success",
  bad: "text-destructive",
  neutral: "text-muted-foreground",
}

/* Chart: the last 14 days, ending today (13 Nov 2026) */

const chartTop = 1600
const deliveriesPerDay = [
  { date: "2026-10-31", label: "31 Oct", count: 1142 },
  { date: "2026-11-01", label: "1 Nov", count: 764 },
  { date: "2026-11-02", label: "2 Nov", count: 1318 },
  { date: "2026-11-03", label: "3 Nov", count: 1265 },
  { date: "2026-11-04", label: "4 Nov", count: 1207 },
  { date: "2026-11-05", label: "5 Nov", count: 1356 },
  { date: "2026-11-06", label: "6 Nov", count: 1389 },
  { date: "2026-11-07", label: "7 Nov", count: 1176 },
  { date: "2026-11-08", label: "8 Nov", count: 712 },
  { date: "2026-11-09", label: "9 Nov", count: 1342 },
  { date: "2026-11-10", label: "10 Nov", count: 1298 },
  { date: "2026-11-11", label: "11 Nov", count: 1411 },
  { date: "2026-11-12", label: "12 Nov", count: 1235 },
  { date: "2026-11-13", label: "Today", count: 1284 },
]

/* Needs attention */

type StateKind = "good" | "failed" | "caution" | "neutral"

const dotColors: Record<StateKind, string> = {
  good: "bg-success",
  failed: "bg-destructive",
  caution: "bg-tertiary",
  neutral: "bg-muted-foreground",
}

function State({ kind, word }: { kind: StateKind; word: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", dotColors[kind])}
      />
      <span className="text-body text-foreground">{word}</span>
    </span>
  )
}

const attention: {
  id: string
  kind: StateKind
  state: string
  text: string
  time: string
  dateTime: string
}[] = [
  {
    id: "NG-48213",
    kind: "failed",
    state: "Failed",
    text: "could not be delivered to 14 Harbour Row, Eastmere: nobody was in and there is no safe place. It is back at Eastmere depot.",
    time: "14:05",
    dateTime: "2026-11-13T14:05",
  },
  {
    id: "NG-48177",
    kind: "caution",
    state: "Delayed",
    text: "missed the 12:00 trunk from Ridgefield to Brackley and will leave on the 16:30.",
    time: "12:20",
    dateTime: "2026-11-13T12:20",
  },
  {
    id: "NG-48102",
    kind: "caution",
    state: "Delayed",
    text: "is held at Lowbridge depot because its label is torn and needs reprinting.",
    time: "11:42",
    dateTime: "2026-11-13T11:42",
  },
  {
    id: "NG-48059",
    kind: "failed",
    state: "Failed",
    text: "was refused at 3 Mill Lane, Ashcombe. A return to the sender is booked for tomorrow.",
    time: "10:18",
    dateTime: "2026-11-13T10:18",
  },
]

/* Recent shipments */

type ShipmentStatus = "In transit" | "Delivered" | "Late"

const statusKinds: Record<ShipmentStatus, StateKind> = {
  "In transit": "neutral",
  Delivered: "good",
  Late: "failed",
}

const shipments: {
  id: string
  destination: string
  depot: string
  status: ShipmentStatus
  weight: string
  due: string
}[] = [
  {
    id: "NG-48291",
    destination: "Kelby",
    depot: "Eastmere",
    status: "In transit",
    weight: "2.4",
    due: "16:00",
  },
  {
    id: "NG-48288",
    destination: "Marsham",
    depot: "Ridgefield",
    status: "Delivered",
    weight: "0.8",
    due: "12:00",
  },
  {
    id: "NG-48284",
    destination: "Upper Wexton",
    depot: "Brackley",
    status: "Late",
    weight: "14.6",
    due: "11:30",
  },
  {
    id: "NG-48279",
    destination: "Saltmarsh Quay",
    depot: "Lowbridge",
    status: "In transit",
    weight: "5.1",
    due: "17:30",
  },
  {
    id: "NG-48275",
    destination: "Fernley",
    depot: "Eastmere",
    status: "Delivered",
    weight: "1.2",
    due: "10:00",
  },
  {
    id: "NG-48270",
    destination: "Hollins Cross",
    depot: "Ridgefield",
    status: "In transit",
    weight: "22.0",
    due: "18:00",
  },
  {
    id: "NG-48266",
    destination: "Brackley",
    depot: "Brackley",
    status: "Delivered",
    weight: "3.7",
    due: "13:00",
  },
  {
    id: "NG-48261",
    destination: "Ashcombe",
    depot: "Lowbridge",
    status: "Late",
    weight: "0.5",
    due: "09:30",
  },
  {
    id: "NG-48257",
    destination: "Thornby Green",
    depot: "Eastmere",
    status: "In transit",
    weight: "8.9",
    due: "16:30",
  },
  {
    id: "NG-48252",
    destination: "Kelby",
    depot: "Ridgefield",
    status: "Delivered",
    weight: "6.3",
    due: "12:30",
  },
]

const statusFilters = ["All", "In transit", "Delivered", "Late"] as const
type StatusFilter = (typeof statusFilters)[number]

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [period, setPeriod] = useState<Period>("today")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All")
  const [query, setQuery] = useState("")

  const visibleShipments = useMemo(() => {
    const q = query.trim().toLowerCase()
    return shipments.filter(
      (s) =>
        (statusFilter === "All" || s.status === statusFilter) &&
        (q === "" ||
          s.id.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q))
    )
  }, [query, statusFilter])

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
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
          <nav aria-label="Main" className="hidden items-center gap-5 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.href} link={link} />
            ))}
          </nav>
          <span className={cn("ml-auto hidden md:block", smallFigure)}>
            Ines Hartwell
          </span>
          <Button
            variant="outline"
            className={cn("ml-auto md:hidden", buttonText)}
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
          className="border-t md:hidden"
        >
          <div className="mx-auto max-w-[1280px] px-3 py-2 md:px-5">
            {navLinks.map((link) => (
              <NavLink key={link.href} link={link} className="block py-2" />
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto grid max-w-[1280px] grid-cols-1 gap-5 px-3 py-5 md:grid-cols-12 md:px-5">
        {/* Page header */}
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

        {/* Key numbers */}
        {keyNumbers[period].map((item) => {
          const Icon = changeIcons[item.change.direction]
          return (
            <section
              key={item.key}
              aria-labelledby={`kn-${item.key}`}
              className="rounded-xl border bg-card p-5 md:col-span-6 lg:col-span-3"
            >
              <div className={panelHeading}>
                <h2 id={`kn-${item.key}`} className={labelHeading}>
                  {item.label}
                </h2>
                {item.key === "late" && (
                  <Badge
                    variant="outline"
                    className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
                  >
                    Check
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
                  "mt-2 flex items-center gap-2 font-mono text-label",
                  changeTones[item.change.tone]
                )}
              >
                <Icon aria-hidden="true" className="size-4" strokeWidth={1.5} />
                {item.change.text}
              </p>
            </section>
          )
        })}

        {/* Deliveries chart */}
        <section
          aria-labelledby="chart-heading"
          className="flex flex-col rounded-xl border bg-card p-5 md:col-span-12 lg:col-span-8"
        >
          <div className={panelHeading}>
            <h2 id="chart-heading" className={labelHeading}>
              Deliveries per day
            </h2>
          </div>
          <div aria-hidden="true" className="mt-3 flex flex-1 flex-col">
            <div className="flex min-h-48 flex-1 gap-2">
              <div className="relative w-12">
                <span className={cn("absolute top-0 right-0", smallFigure)}>
                  {chartTop.toLocaleString("en-GB")}
                </span>
                <span
                  className={cn(
                    "absolute top-1/2 right-0 -translate-y-1/2",
                    smallFigure
                  )}
                >
                  {(chartTop / 2).toLocaleString("en-GB")}
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
                      "min-w-0 flex-1 whitespace-nowrap",
                      last ? "text-right" : "text-center",
                      i < 7 && "hidden md:block"
                    )}
                  >
                    {i % 2 === 1 && (
                      <time
                        dateTime={day.date}
                        className={cn(smallFigure, last && "text-foreground")}
                      >
                        {day.label}
                      </time>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="sr-only">
            <table aria-labelledby="chart-heading">
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Deliveries</th>
                </tr>
              </thead>
              <tbody>
                {deliveriesPerDay.map((day) => (
                  <tr key={day.date}>
                    <td>
                      <time dateTime={day.date}>{day.label}</time>
                    </td>
                    <td>{day.count.toLocaleString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Needs attention */}
        <section
          aria-labelledby="attention-heading"
          className="overflow-hidden rounded-xl border bg-card md:col-span-12 lg:col-span-4"
        >
          <div className="border-b px-5 pt-5 pb-3">
            <div className={panelHeading}>
              <h2 id="attention-heading" className={labelHeading}>
                Needs attention
              </h2>
            </div>
          </div>
          <ul>
            {attention.map((item, i) => (
              <li
                key={item.id}
                className={cn(
                  "flex flex-col gap-1 px-5 py-3",
                  i > 0 && "border-t"
                )}
              >
                <State kind={item.kind} word={item.state} />
                <p className="max-w-md text-body">
                  <a href="#" className={textLink}>
                    {item.id}
                  </a>{" "}
                  {item.text}
                </p>
                <time dateTime={item.dateTime} className={smallFigure}>
                  {item.time}
                </time>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent shipments */}
        <section
          aria-labelledby="shipments-heading"
          className="overflow-hidden rounded-xl border bg-card md:col-span-12"
        >
          <div className="border-b px-5 pt-5 pb-3">
            <div className={panelHeading}>
              <h2 id="shipments-heading" className={labelHeading}>
                Recent shipments
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search
                    aria-hidden="true"
                    className="absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <Input
                    type="text"
                    aria-label="Search shipments"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="px-2 pl-8 text-body md:text-body"
                  />
                </div>
                <div
                  role="group"
                  aria-label="Status"
                  className="flex flex-wrap gap-1"
                >
                  {statusFilters.map((s) => (
                    <Button
                      key={s}
                      variant={statusFilter === s ? "secondary" : "outline"}
                      aria-pressed={statusFilter === s}
                      className={buttonText}
                      onClick={() => setStatusFilter(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Table label="Recent shipments" className="text-body">
            <TableHeader>
              <TableRow>
                <TableHead className={cn("px-5", labelHeading)}>ID</TableHead>
                <TableHead className={cn("px-5", labelHeading)}>
                  Destination
                </TableHead>
                <TableHead className={cn("px-5", labelHeading)}>
                  Depot
                </TableHead>
                <TableHead className={cn("px-5", labelHeading)}>
                  Status
                </TableHead>
                <TableHead className={cn("px-5 text-right", labelHeading)}>
                  Weight <span className="normal-case">(kg)</span>
                </TableHead>
                <TableHead className={cn("px-5 text-right", labelHeading)}>
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
                      <State kind={statusKinds[s.status]} word={s.status} />
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
