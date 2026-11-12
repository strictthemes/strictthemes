import { useId, useMemo, useState } from "react"
import { ArrowDown, ArrowUp, Search } from "lucide-react"

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
const label = "font-mono text-label uppercase"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const buttonText = "px-5 font-mono text-label uppercase"
const container = "mx-auto max-w-[1280px] px-3 md:px-5"
const panel = "rounded-xl border bg-card"
const panelHeading = "flex min-h-7 flex-wrap items-center justify-between gap-3"
const panelTitle = "font-mono text-label text-muted-foreground uppercase"

const navLinks = [
  { name: "Overview", href: "/" },
  { name: "Shipments", href: "/shipments" },
  { name: "Depots", href: "/depots" },
  { name: "Reports", href: "/reports" },
]
const currentHref = "/"

/* Key numbers */

type Period = "today" | "7d" | "30d"
type Tone = "good" | "bad" | "none"
type Metric = {
  name: string
  value: string
  unit?: string
  direction: "up" | "down"
  change: string
  tone: Tone
}

const periods: { id: Period; name: string }[] = [
  { id: "today", name: "Today" },
  { id: "7d", name: "7 days" },
  { id: "30d", name: "30 days" },
]

const metricsByPeriod: Record<Period, Metric[]> = {
  today: [
    { name: "Delivered", value: "1,284", direction: "up", change: "Up 4% on yesterday", tone: "good" },
    { name: "In transit", value: "612", direction: "up", change: "Up 3% on yesterday", tone: "none" },
    { name: "Late", value: "37", direction: "up", change: "Up 9% on yesterday", tone: "bad" },
    { name: "On-time rate", value: "94.2", unit: "%", direction: "down", change: "Down 1 point on yesterday", tone: "bad" },
  ],
  "7d": [
    { name: "Delivered", value: "8,930", direction: "down", change: "Down 2% on last week", tone: "bad" },
    { name: "In transit", value: "4,105", direction: "down", change: "Down 1% on last week", tone: "none" },
    { name: "Late", value: "251", direction: "down", change: "Down 6% on last week", tone: "good" },
    { name: "On-time rate", value: "95.1", unit: "%", direction: "up", change: "Up 2 points on last week", tone: "good" },
  ],
  "30d": [
    { name: "Delivered", value: "37,415", direction: "up", change: "Up 5% on previous 30 days", tone: "good" },
    { name: "In transit", value: "17,862", direction: "up", change: "Up 4% on previous 30 days", tone: "none" },
    { name: "Late", value: "1,102", direction: "down", change: "Down 3% on previous 30 days", tone: "good" },
    { name: "On-time rate", value: "94.8", unit: "%", direction: "up", change: "Up 1 point on previous 30 days", tone: "good" },
  ],
}

const toneClass: Record<Tone, string> = {
  good: "text-success",
  bad: "text-destructive",
  none: "text-muted-foreground",
}

/* Chart: the last 14 days, ending today (11 Nov 2026) */

const scaleTop = 1600
const dailyDeliveries = [
  1192, 1240, 1058, 980, 1311, 1356, 1287, 1224, 1302, 1119, 1012, 1347, 1398,
  1284,
].map((count, i) => {
  const date = new Date(Date.UTC(2026, 10, 11 - 13 + i))
  return {
    count,
    iso: date.toISOString().slice(0, 10),
    day: date.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }),
    isToday: i === 13,
  }
})

/* Needs attention */

type StateTone = "good" | "failed" | "caution" | "neutral"
const dotClass: Record<StateTone, string> = {
  good: "bg-success",
  failed: "bg-destructive",
  caution: "bg-tertiary",
  neutral: "bg-muted-foreground",
}

function State({ tone, children }: { tone: StateTone; children: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", dotClass[tone])} />
      <span className="text-body text-foreground">{children}</span>
    </span>
  )
}

const attention: {
  id: string
  tone: StateTone
  state: string
  text: string
  time: string
}[] = [
  { id: "NG-48213", tone: "failed", state: "Failed", text: "could not be delivered at 14 Kestrel Lane, Fenwick: the loading bay was closed. It returns to Brookmere tonight.", time: "14:05" },
  { id: "NG-48177", tone: "caution", state: "Delayed", text: "is held at Calder Point after a sorting fault on belt 3. The new estimate is 17:30.", time: "13:42" },
  { id: "NG-48102", tone: "caution", state: "Delayed", text: "missed the morning trunk to Dunmore and goes out on the 15:00 run instead.", time: "12:18" },
  { id: "NG-47990", tone: "failed", state: "Failed", text: "was refused at the door in Oakhurst: the recipient says the box arrived damaged.", time: "11:51" },
]

/* Recent shipments */

type Status = "In transit" | "Delivered" | "Late"
const statusTone: Record<Status, StateTone> = {
  "In transit": "neutral",
  Delivered: "good",
  Late: "failed",
}
const statusFilters: ("All" | Status)[] = ["All", "In transit", "Delivered", "Late"]

const shipments: {
  id: string
  destination: string
  depot: string
  status: Status
  weight: string
  due: string
}[] = [
  { id: "NG-48231", destination: "22 Mill Street, Fenwick", depot: "Brookmere", status: "In transit", weight: "3.2", due: "16:30" },
  { id: "NG-48229", destination: "7 Heron Close, Oakhurst", depot: "Ashford Vale", status: "Delivered", weight: "1.1", due: "12:00" },
  { id: "NG-48226", destination: "Unit 4, Quarry Park, Dunmore", depot: "Dunmore", status: "Late", weight: "18.6", due: "11:00" },
  { id: "NG-48224", destination: "91 Castle Road, Linford", depot: "Calder Point", status: "In transit", weight: "5.4", due: "17:00" },
  { id: "NG-48219", destination: "3 Orchard Row, Brookmere", depot: "Brookmere", status: "Delivered", weight: "0.8", due: "10:30" },
  { id: "NG-48215", destination: "48 Station Hill, Ashford Vale", depot: "Ashford Vale", status: "In transit", weight: "12.0", due: "18:00" },
  { id: "NG-48213", destination: "14 Kestrel Lane, Fenwick", depot: "Brookmere", status: "Late", weight: "7.3", due: "13:00" },
  { id: "NG-48208", destination: "The Granary, Wexley", depot: "Calder Point", status: "Delivered", weight: "2.5", due: "09:30" },
  { id: "NG-48204", destination: "16 Fern Avenue, Linford", depot: "Calder Point", status: "In transit", weight: "4.9", due: "15:30" },
  { id: "NG-48199", destination: "5 Market Square, Dunmore", depot: "Dunmore", status: "Delivered", weight: "9.7", due: "11:30" },
]

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [period, setPeriod] = useState<Period>("today")
  const [status, setStatus] = useState<"All" | Status>("All")
  const [query, setQuery] = useState("")
  const chartHeadingId = useId()

  const metrics = metricsByPeriod[period]
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return shipments.filter(
      (s) =>
        (status === "All" || s.status === status) &&
        (q === "" ||
          s.id.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q))
    )
  }, [status, query])

  const navLinkClass = (href: string) =>
    cn(
      label,
      "transition-colors duration-150",
      focusRing,
      href === currentHref ? "text-foreground" : "text-muted-foreground hover:text-foreground"
    )

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className={cn(container, "flex items-center gap-8 py-3")}>
          <a href="/" className={cn("font-heading text-h2 transition-colors duration-150", focusRing)}>
            Northgate
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={link.href === currentHref ? "page" : undefined}
                    className={navLinkClass(link.href)}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <span className={cn(smallFigure, "ml-auto hidden md:block")}>Mara Lindqvist</span>
          <Button
            variant="outline"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(buttonText, "ml-auto md:hidden")}
          >
            Menu
          </Button>
        </div>
        <nav id="mobile-nav" aria-label="Main" hidden={!menuOpen} className="border-t md:hidden">
          <ul className={cn(container, "py-2")}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.href === currentHref ? "page" : undefined}
                  className={cn(navLinkClass(link.href), "block py-2")}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className={cn(container, "grid grid-cols-1 gap-5 py-5 md:grid-cols-12")}>
        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-12">
          <h1 className="text-h1">Overview</h1>
          <div className="flex flex-wrap items-center gap-2">
            <div role="group" aria-label="Period" className="flex flex-wrap gap-1">
              {periods.map((p) => (
                <Button
                  key={p.id}
                  variant={period === p.id ? "secondary" : "outline"}
                  aria-pressed={period === p.id}
                  onClick={() => setPeriod(p.id)}
                  className={buttonText}
                >
                  {p.name}
                </Button>
              ))}
            </div>
            <Button className={buttonText}>New shipment</Button>
          </div>
        </div>

        {/* Key numbers */}
        {metrics.map((m) => {
          const Arrow = m.direction === "up" ? ArrowUp : ArrowDown
          return (
            <section key={m.name} className={cn(panel, "p-5 md:col-span-6 lg:col-span-3")}>
              <div className={panelHeading}>
                <h2 className={panelTitle}>{m.name}</h2>
                {m.name === "Late" && (
                  <Badge
                    variant="outline"
                    className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
                  >
                    Check
                  </Badge>
                )}
              </div>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="font-heading text-h1 tabular-nums">{m.value}</span>
                {m.unit && <span className={smallFigure}>{m.unit}</span>}
              </p>
              <p className={cn("mt-2 flex items-center gap-1 font-mono text-label", toneClass[m.tone])}>
                <Arrow aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.5} />
                {m.change}
              </p>
            </section>
          )
        })}

        {/* Deliveries chart */}
        <section className={cn(panel, "flex flex-col p-5 md:col-span-12 lg:col-span-8")}>
          <div className={panelHeading}>
            <h2 id={chartHeadingId} className={panelTitle}>
              Deliveries per day
            </h2>
          </div>
          <div aria-hidden="true" className="mt-3 flex flex-1 flex-col">
            <div className="flex min-h-48 flex-1 gap-2">
              <div className="relative w-12">
                <span className={cn(smallFigure, "absolute top-0 right-0")}>
                  {scaleTop.toLocaleString("en-GB")}
                </span>
                <span className={cn(smallFigure, "absolute top-1/2 right-0 -translate-y-1/2")}>
                  {(scaleTop / 2).toLocaleString("en-GB")}
                </span>
                <span className={cn(smallFigure, "absolute right-0 bottom-0")}>0</span>
              </div>
              <div className="relative flex-1">
                <div className="absolute inset-x-0 top-0 border-t border-border" />
                <div className="absolute inset-x-0 top-1/2 border-t border-border" />
                <div className="absolute inset-x-0 bottom-0 border-t border-border" />
                <div className="absolute inset-0 flex items-end gap-2">
                  {dailyDeliveries.map((d, i) => (
                    <div
                      key={d.iso}
                      className={cn(
                        "flex-1",
                        d.isToday ? "bg-primary" : "bg-secondary",
                        i < 7 && "hidden md:block"
                      )}
                      style={{ height: `${(d.count / scaleTop) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-2 flex gap-2 pl-14">
              {dailyDeliveries.map((d, i) => (
                <div
                  key={d.iso}
                  className={cn(
                    "min-w-0 flex-1 whitespace-nowrap",
                    d.isToday ? "text-right" : "text-center",
                    i < 7 && "hidden md:block"
                  )}
                >
                  {d.isToday ? (
                    <span className="font-mono text-label text-foreground">Today</span>
                  ) : i % 2 === 1 ? (
                    <time dateTime={d.iso} className={smallFigure}>
                      {d.day}
                    </time>
                  ) : null}
                </div>
              ))}
            </div>
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
                {dailyDeliveries.map((d) => (
                  <tr key={d.iso}>
                    <th scope="row">
                      {d.isToday ? "Today" : <time dateTime={d.iso}>{d.day}</time>}
                    </th>
                    <td>{d.count.toLocaleString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Needs attention */}
        <section className={cn(panel, "overflow-hidden md:col-span-12 lg:col-span-4")}>
          <div className="border-b px-5 pt-5 pb-3">
            <div className={panelHeading}>
              <h2 className={panelTitle}>Needs attention</h2>
            </div>
          </div>
          <ul>
            {attention.map((item) => (
              <li key={item.id} className="flex flex-col gap-1 border-t px-5 py-3 first:border-t-0">
                <div>
                  <State tone={item.tone}>{item.state}</State>
                </div>
                <p className="max-w-md text-body">
                  <a href="#" className={textLink}>
                    {item.id}
                  </a>{" "}
                  {item.text}
                </p>
                <div>
                  <time dateTime={`2026-11-11T${item.time}`} className={smallFigure}>
                    {item.time}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent shipments */}
        <section className={cn(panel, "overflow-hidden md:col-span-12")}>
          <div className="border-b px-5 pt-5 pb-3">
            <div className={panelHeading}>
              <h2 className={panelTitle}>Recent shipments</h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    type="search"
                    aria-label="Search shipments"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-8 text-body md:text-body"
                  />
                </div>
                <div role="group" aria-label="Status" className="flex flex-wrap gap-1">
                  {statusFilters.map((s) => (
                    <Button
                      key={s}
                      variant={status === s ? "secondary" : "outline"}
                      aria-pressed={status === s}
                      onClick={() => setStatus(s)}
                      className={buttonText}
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
                {["ID", "Destination", "Depot", "Status"].map((h) => (
                  <TableHead key={h} className={cn(label, "px-5 text-muted-foreground")}>
                    {h}
                  </TableHead>
                ))}
                <TableHead className={cn(label, "px-5 text-right text-muted-foreground")}>
                  Weight <span className="normal-case">(kg)</span>
                </TableHead>
                <TableHead className={cn(label, "px-5 text-right text-muted-foreground")}>
                  Due
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-5 py-2 text-muted-foreground">
                    No shipments match.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="px-5 py-2">
                      <a href="#" className={cn(textLink, "font-mono tabular-nums")}>
                        {s.id}
                      </a>
                    </TableCell>
                    <TableCell className="px-5 py-2">{s.destination}</TableCell>
                    <TableCell className="px-5 py-2">{s.depot}</TableCell>
                    <TableCell className="px-5 py-2">
                      <State tone={statusTone[s.status]}>{s.status}</State>
                    </TableCell>
                    <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                      {s.weight}
                    </TableCell>
                    <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                      <time dateTime={`2026-11-11T${s.due}`}>{s.due}</time>
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
