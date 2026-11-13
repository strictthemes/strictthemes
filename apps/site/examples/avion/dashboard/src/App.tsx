import { useRef, useState, type KeyboardEvent, type ReactNode } from "react"
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
const labelClass = "font-mono text-label uppercase"
const buttonClass = "px-5 font-mono text-label uppercase"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"

const navLinks = [
  { label: "Overview", href: "/", current: true },
  { label: "Shipments", href: "/shipments", current: false },
  { label: "Depots", href: "/depots", current: false },
  { label: "Reports", href: "/reports", current: false },
]

function navLinkClass(current: boolean) {
  return cn(
    labelClass,
    "transition-colors duration-150",
    focusRing,
    current ? "text-foreground" : "text-muted-foreground hover:text-foreground"
  )
}

/* Key numbers */

type Period = "today" | "7d" | "30d"
type Trend = "up" | "down" | "flat"
type Tone = "good" | "bad" | "neutral"

type KeyNumber = {
  label: string
  value: string
  unit?: string
  change: string
  trend: Trend
  tone: Tone
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
  trend: "up",
  tone: "neutral",
}

const keyNumbers: Record<Period, KeyNumber[]> = {
  today: [
    {
      label: "Delivered",
      value: "702",
      change: "Up 4% on yesterday",
      trend: "up",
      tone: "good",
    },
    inTransit,
    {
      label: "Late",
      value: "18",
      change: "Down 12% on yesterday",
      trend: "down",
      tone: "good",
      badge: "Check",
    },
    {
      label: "On-time rate",
      value: "96.4",
      unit: "%",
      change: "Down 1 point on yesterday",
      trend: "down",
      tone: "bad",
    },
  ],
  "7d": [
    {
      label: "Delivered",
      value: "7,377",
      change: "Up 2% on last week",
      trend: "up",
      tone: "good",
    },
    inTransit,
    {
      label: "Late",
      value: "164",
      change: "Up 9% on last week",
      trend: "up",
      tone: "bad",
      badge: "Check",
    },
    {
      label: "On-time rate",
      value: "95.8",
      unit: "%",
      change: "Up 1 point on last week",
      trend: "up",
      tone: "good",
    },
  ],
  "30d": [
    {
      label: "Delivered",
      value: "29,846",
      change: "Down 1% on previous 30 days",
      trend: "down",
      tone: "bad",
    },
    inTransit,
    {
      label: "Late",
      value: "611",
      change: "Down 5% on previous 30 days",
      trend: "down",
      tone: "good",
      badge: "Check",
    },
    {
      label: "On-time rate",
      value: "96.1",
      unit: "%",
      change: "No change on previous 30 days",
      trend: "flat",
      tone: "neutral",
    },
  ],
}

const toneClass: Record<Tone, string> = {
  good: "text-success",
  bad: "text-destructive",
  neutral: "text-muted-foreground",
}

const trendIcon = { up: ArrowUp, down: ArrowDown, flat: Minus }

/* Chart */

const chartTop = 1600
const days = [
  { date: "2026-10-31", label: "31 Oct", count: 842 },
  { date: "2026-11-01", label: "1 Nov", count: 396 },
  { date: "2026-11-02", label: "2 Nov", count: 1318 },
  { date: "2026-11-03", label: "3 Nov", count: 1264 },
  { date: "2026-11-04", label: "4 Nov", count: 1287 },
  { date: "2026-11-05", label: "5 Nov", count: 1342 },
  { date: "2026-11-06", label: "6 Nov", count: 1411 },
  { date: "2026-11-07", label: "7 Nov", count: 905 },
  { date: "2026-11-08", label: "8 Nov", count: 412 },
  { date: "2026-11-09", label: "9 Nov", count: 1356 },
  { date: "2026-11-10", label: "10 Nov", count: 1298 },
  { date: "2026-11-11", label: "11 Nov", count: 1325 },
  { date: "2026-11-12", label: "12 Nov", count: 1379 },
  { date: "2026-11-13", label: "Today", count: 702 },
]

/* Needs attention */

type StateTone = "good" | "failed" | "caution" | "neutral"

const dotClass: Record<StateTone, string> = {
  good: "bg-success",
  failed: "bg-destructive",
  caution: "bg-tertiary",
  neutral: "bg-muted-foreground",
}

function State({ tone, word }: { tone: StateTone; word: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", dotClass[tone])}
      />
      <span className="text-body text-foreground">{word}</span>
    </span>
  )
}

const attention: {
  id: string
  tone: StateTone
  word: string
  text: string
  time: string
}[] = [
  {
    id: "NG-40817",
    tone: "failed",
    word: "Failed",
    text: "could not be delivered to 14 Harbour Row, Kettleford: nobody was in and there was no safe place. A second try is booked for tomorrow.",
    time: "11:52",
  },
  {
    id: "NG-40766",
    tone: "caution",
    word: "Delayed",
    text: "is on van 12 out of Eastmoor, held up by roadworks on the ring road. Its 23 stops are running about 40 minutes late.",
    time: "11:20",
  },
  {
    id: "NG-40692",
    tone: "caution",
    word: "Delayed",
    text: "is held at Ridgeway depot because its label is torn and the street name cannot be read. The sender has been asked to confirm it.",
    time: "10:47",
  },
  {
    id: "NG-40655",
    tone: "failed",
    word: "Failed",
    text: "was refused at the door by the customer and goes back to Calder depot on tonight's return run.",
    time: "09:58",
  },
]

/* Recent shipments */

type Status = "transit" | "delivered" | "late"
type StatusFilter = "all" | Status

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "transit", label: "In transit" },
  { value: "delivered", label: "Delivered" },
  { value: "late", label: "Late" },
]

const statusState: Record<Status, { tone: StateTone; word: string }> = {
  transit: { tone: "neutral", word: "In transit" },
  delivered: { tone: "good", word: "Delivered" },
  late: { tone: "failed", word: "Late" },
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
    id: "NG-40842",
    destination: "Wyncombe",
    depot: "Calder",
    status: "transit",
    weight: "2.4",
    due: "14:30",
  },
  {
    id: "NG-40839",
    destination: "Brackenmoor",
    depot: "Eastmoor",
    status: "delivered",
    weight: "0.8",
    due: "12:00",
  },
  {
    id: "NG-40836",
    destination: "Saltonby",
    depot: "Ridgeway",
    status: "late",
    weight: "11.2",
    due: "10:30",
  },
  {
    id: "NG-40833",
    destination: "Oxley Vale",
    depot: "Corvale",
    status: "transit",
    weight: "5.6",
    due: "16:00",
  },
  {
    id: "NG-40829",
    destination: "Penmarsh",
    depot: "Calder",
    status: "delivered",
    weight: "1.3",
    due: "11:00",
  },
  {
    id: "NG-40826",
    destination: "Druthwick",
    depot: "Eastmoor",
    status: "transit",
    weight: "18.0",
    due: "17:30",
  },
  {
    id: "NG-40821",
    destination: "Cawley Green",
    depot: "Ridgeway",
    status: "late",
    weight: "3.7",
    due: "09:30",
  },
  {
    id: "NG-40818",
    destination: "Kettleford",
    depot: "Corvale",
    status: "delivered",
    weight: "0.4",
    due: "10:00",
  },
  {
    id: "NG-40814",
    destination: "Hollin Cross",
    depot: "Calder",
    status: "transit",
    weight: "7.9",
    due: "15:00",
  },
  {
    id: "NG-40811",
    destination: "Fennick Bridge",
    depot: "Eastmoor",
    status: "delivered",
    weight: "2.1",
    due: "11:30",
  },
]

function PanelHeading({
  id,
  title,
  children,
}: {
  id?: string
  title: string
  children?: ReactNode
}) {
  return (
    <div className="flex min-h-7 flex-wrap items-center justify-between gap-3">
      <h2 id={id} className={cn(labelClass, "text-muted-foreground")}>
        {title}
      </h2>
      {children}
    </div>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [period, setPeriod] = useState<Period>("today")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [query, setQuery] = useState("")

  function onHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (menuOpen && event.key === "Escape") {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  const needle = query.trim().toLowerCase()
  const rows = shipments.filter(
    (s) =>
      (status === "all" || s.status === status) &&
      (needle === "" ||
        s.id.toLowerCase().includes(needle) ||
        s.destination.toLowerCase().includes(needle))
  )

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card" onKeyDown={onHeaderKeyDown}>
        <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-3 py-3 md:px-5">
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground transition-colors duration-150",
              focusRing
            )}
          >
            Northgate
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-5">
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
          <span className={cn(smallFigure, "ml-auto hidden md:block")}>
            Maren Okafor
          </span>
          <Button
            ref={menuButtonRef}
            variant="outline"
            className={cn(buttonClass, "ml-auto md:hidden")}
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
          <ul className="mx-auto max-w-[1280px] px-3 py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(navLinkClass(link.current), "block py-2")}
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
                  className={buttonClass}
                  onClick={() => setPeriod(p.value)}
                >
                  {p.label}
                </Button>
              ))}
            </div>
            <Button className={buttonClass}>New shipment</Button>
          </div>
        </div>

        {keyNumbers[period].map((k) => {
          const Icon = trendIcon[k.trend]
          return (
            <section
              key={k.label}
              className="rounded-xl border bg-card p-5 md:col-span-6 lg:col-span-3"
            >
              <PanelHeading title={k.label}>
                {k.badge && (
                  <Badge
                    variant="outline"
                    className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
                  >
                    {k.badge}
                  </Badge>
                )}
              </PanelHeading>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-heading text-h1 tabular-nums">
                  {k.value}
                </span>
                {k.unit && <span className={smallFigure}>{k.unit}</span>}
              </div>
              <p
                className={cn(
                  "mt-2 flex items-center gap-2 font-mono text-label",
                  toneClass[k.tone]
                )}
              >
                <Icon aria-hidden="true" className="size-4" strokeWidth={1.5} />
                {k.change}
              </p>
            </section>
          )
        })}

        <section className="flex flex-col rounded-xl border bg-card p-5 md:col-span-12 lg:col-span-8">
          <PanelHeading id="deliveries-heading" title="Deliveries per day" />
          <div className="sr-only">
            <table aria-labelledby="deliveries-heading">
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Deliveries</th>
                </tr>
              </thead>
              <tbody>
                {days.map((d) => (
                  <tr key={d.date}>
                    <th scope="row">{d.label}</th>
                    <td>{d.count.toLocaleString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div aria-hidden="true" className="mt-3 flex flex-1 flex-col">
            <div className="flex min-h-48 flex-1 gap-2">
              <div className="relative w-12">
                <span className={cn(smallFigure, "absolute top-0 right-0")}>
                  1,600
                </span>
                <span
                  className={cn(
                    smallFigure,
                    "absolute top-1/2 right-0 -translate-y-1/2"
                  )}
                >
                  800
                </span>
                <span className={cn(smallFigure, "absolute right-0 bottom-0")}>
                  0
                </span>
              </div>
              <div className="relative flex-1">
                <div className="absolute inset-x-0 top-0 border-t border-border" />
                <div className="absolute inset-x-0 top-1/2 border-t border-border" />
                <div className="absolute inset-x-0 bottom-0 border-t border-border" />
                <div className="absolute inset-0 flex items-end gap-2">
                  {days.map((d, i) => (
                    <div
                      key={d.date}
                      className={cn(
                        "flex-1",
                        i === days.length - 1 ? "bg-primary" : "bg-secondary",
                        i < 7 && "hidden md:block"
                      )}
                      style={{ height: `${(d.count / chartTop) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-2 flex gap-2 pl-14">
              {days.map((d, i) => {
                const last = i === days.length - 1
                const labelled = (days.length - 1 - i) % 2 === 0
                return (
                  <div
                    key={d.date}
                    className={cn(
                      "min-w-0 flex-1 text-center whitespace-nowrap",
                      smallFigure,
                      last && "text-right text-foreground",
                      i < 7 && "hidden md:block"
                    )}
                  >
                    {labelled && <time dateTime={d.date}>{d.label}</time>}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border bg-card md:col-span-12 lg:col-span-4">
          <div className="border-b px-5 pt-5 pb-3">
            <PanelHeading title="Needs attention" />
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
                <div>
                  <State tone={item.tone} word={item.word} />
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
            <PanelHeading title="Recent shipments">
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
                    onChange={(e) => setQuery(e.target.value)}
                    className="px-2 pl-8 text-body md:text-body [&::-webkit-search-cancel-button]:appearance-none"
                  />
                </div>
                <div
                  role="group"
                  aria-label="Status"
                  className="flex flex-wrap gap-1"
                >
                  {statusFilters.map((f) => (
                    <Button
                      key={f.value}
                      variant={status === f.value ? "secondary" : "outline"}
                      aria-pressed={status === f.value}
                      className={buttonClass}
                      onClick={() => setStatus(f.value)}
                    >
                      {f.label}
                    </Button>
                  ))}
                </div>
              </div>
            </PanelHeading>
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
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-5 py-2 text-muted-foreground"
                  >
                    No shipments match.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="px-5 py-2">
                      <a
                        href="#"
                        className={cn(textLink, "font-mono tabular-nums")}
                      >
                        {s.id}
                      </a>
                    </TableCell>
                    <TableCell className="px-5 py-2">{s.destination}</TableCell>
                    <TableCell className="px-5 py-2">{s.depot}</TableCell>
                    <TableCell className="px-5 py-2">
                      <State
                        tone={statusState[s.status].tone}
                        word={statusState[s.status].word}
                      />
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
