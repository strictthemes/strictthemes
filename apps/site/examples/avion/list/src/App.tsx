import { useMemo, useRef, useState, type ReactNode } from "react"
import { flushSync } from "react-dom"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type Status = "In transit" | "Delivered" | "Late" | "Held"

type Shipment = {
  id: string
  customer: string
  destination: string
  depot: string
  status: Status
  weight: number
  value: number
  updated: string
}

const DEPOTS = ["Leeds Hub", "Bristol Cross", "Norwich East", "Carlisle North"]

const SHIPMENTS: Shipment[] = [
  { id: "NG-48213", customer: "Halden Joinery", destination: "Harrogate", depot: "Leeds Hub", status: "In transit", weight: 18.4, value: 1240, updated: "2026-11-13T09:42" },
  { id: "NG-48207", customer: "Pellow & Daughters", destination: "Truro", depot: "Bristol Cross", status: "Late", weight: 6.2, value: 389.5, updated: "2026-11-13T08:15" },
  { id: "NG-48199", customer: "Brackwater Outdoor", destination: "Kendal", depot: "Carlisle North", status: "Delivered", weight: 3.8, value: 142.99, updated: "2026-11-12T17:58" },
  { id: "NG-48194", customer: "Fenwick Lab Supplies", destination: "Cambridge", depot: "Norwich East", status: "Held", weight: 24.0, value: 3815, updated: "2026-11-12T16:20" },
  { id: "NG-48188", customer: "Ostrander Print Co.", destination: "York", depot: "Leeds Hub", status: "Delivered", weight: 11.5, value: 620, updated: "2026-11-12T15:07" },
  { id: "NG-48181", customer: "Marlowe Tea Rooms", destination: "Bath", depot: "Bristol Cross", status: "In transit", weight: 2.1, value: 86.4, updated: "2026-11-12T13:44" },
  { id: "NG-48176", customer: "Quarry Lane Cycles", destination: "Penrith", depot: "Carlisle North", status: "In transit", weight: 14.9, value: 1899, updated: "2026-11-12T11:30" },
  { id: "NG-48170", customer: "Ashby Veterinary", destination: "King's Lynn", depot: "Norwich East", status: "Late", weight: 7.7, value: 512.25, updated: "2026-11-12T10:02" },
  { id: "NG-48165", customer: "Thornbury Ceramics", destination: "Gloucester", depot: "Bristol Cross", status: "Delivered", weight: 31.2, value: 2460, updated: "2026-11-12T08:51" },
  { id: "NG-48159", customer: "Coldwell Garden Centre", destination: "Wakefield", depot: "Leeds Hub", status: "Held", weight: 42.6, value: 975, updated: "2026-11-11T18:36" },
  { id: "NG-48152", customer: "Saltmarsh Books", destination: "Cromer", depot: "Norwich East", status: "Delivered", weight: 5.4, value: 218.7, updated: "2026-11-11T16:12" },
  { id: "NG-48146", customer: "Ivybridge Dental", destination: "Exeter", depot: "Bristol Cross", status: "In transit", weight: 1.3, value: 640, updated: "2026-11-11T14:05" },
  { id: "NG-48141", customer: "Garrow Hardware", destination: "Workington", depot: "Carlisle North", status: "Delivered", weight: 19.8, value: 733.1, updated: "2026-11-11T12:47" },
  { id: "NG-48135", customer: "Linden Bakery Supply", destination: "Bradford", depot: "Leeds Hub", status: "In transit", weight: 27.3, value: 458, updated: "2026-11-11T11:19" },
  { id: "NG-48128", customer: "Wexcombe Audio", destination: "Ipswich", depot: "Norwich East", status: "Late", weight: 9.6, value: 2149.99, updated: "2026-11-11T09:33" },
  { id: "NG-48122", customer: "Redfern Optics", destination: "Swindon", depot: "Bristol Cross", status: "Delivered", weight: 0.8, value: 1320, updated: "2026-11-10T17:25" },
  { id: "NG-48117", customer: "Hartside Farm Shop", destination: "Hexham", depot: "Carlisle North", status: "Held", weight: 12.0, value: 164.5, updated: "2026-11-10T15:40" },
  { id: "NG-48110", customer: "Bellamy Office Fit", destination: "Huddersfield", depot: "Leeds Hub", status: "Delivered", weight: 56.4, value: 4120, updated: "2026-11-10T13:08" },
  { id: "NG-48104", customer: "Orwell Marine", destination: "Lowestoft", depot: "Norwich East", status: "In transit", weight: 22.7, value: 1586, updated: "2026-11-10T10:54" },
  { id: "NG-48098", customer: "Tamsin Rowe Studio", destination: "Wells", depot: "Bristol Cross", status: "Late", weight: 4.5, value: 295, updated: "2026-11-09T16:31" },
  { id: "NG-48093", customer: "Keld Mountain Gear", destination: "Keswick", depot: "Carlisle North", status: "Delivered", weight: 8.3, value: 874.6, updated: "2026-11-09T14:12" },
  { id: "NG-48087", customer: "Northfold Pharmacy", destination: "Ripon", depot: "Leeds Hub", status: "In transit", weight: 2.9, value: 96.8, updated: "2026-11-09T11:45" },
  { id: "NG-48081", customer: "Breckland Seeds", destination: "Thetford", depot: "Norwich East", status: "Delivered", weight: 15.1, value: 341.2, updated: "2026-11-08T15:03" },
  { id: "NG-48076", customer: "Calder Valley Frames", destination: "Halifax", depot: "Leeds Hub", status: "Held", weight: 37.5, value: 1705, updated: "2026-11-08T09:26" },
]

const STATUS_FILTERS = ["All", "In transit", "Delivered", "Late", "Held"] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]

const DEPOT_ITEMS = [
  { value: "all", label: "All depots" },
  ...DEPOTS.map((d) => ({ value: d, label: d })),
]

const STATUS_DOT: Record<Status, string> = {
  "In transit": "bg-muted-foreground",
  Delivered: "bg-success",
  Late: "bg-destructive",
  Held: "bg-tertiary",
}

type SortKey = "id" | "customer" | "weight" | "value" | "updated"
type SortDir = "ascending" | "descending"

const PAGE_SIZE = 10
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" })
const kg = new Intl.NumberFormat("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function formatUpdated(iso: string) {
  const [date, time] = iso.split("T")
  const [, month, day] = date.split("-").map(Number)
  return `${day} ${MONTHS[month - 1]}, ${time}`
}

const label = "font-mono text-label uppercase"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const buttonText = "px-5 font-mono text-label uppercase"
const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)

const NAV = [
  { label: "Overview", href: "/" },
  { label: "Shipments", href: "/shipments", current: true },
  { label: "Depots", href: "/depots" },
  { label: "Reports", href: "/reports" },
]

function NavLinks({ className, linkClassName }: { className?: string; linkClassName?: string }) {
  return (
    <ul className={className}>
      {NAV.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            aria-current={item.current ? "page" : undefined}
            className={cn(
              label,
              "transition-colors duration-150",
              focusOutline,
              item.current ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              linkClassName
            )}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

function SortHeader({
  column,
  align = "left",
  sortKey,
  sortDir,
  onSort,
  children,
}: {
  column: SortKey
  align?: "left" | "right"
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
  children: ReactNode
}) {
  const active = sortKey === column
  const Icon = !active ? ArrowUpDown : sortDir === "ascending" ? ArrowUp : ArrowDown
  const icon = (
    <Icon
      aria-hidden="true"
      strokeWidth={1.5}
      className={cn("size-4", active && "text-foreground")}
    />
  )
  return (
    <TableHead
      aria-sort={active ? sortDir : undefined}
      className={cn(
        "px-5 font-mono text-label uppercase text-muted-foreground",
        align === "right" && "text-right"
      )}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          "inline-flex items-center gap-1 font-mono text-label uppercase text-muted-foreground transition-colors duration-150 hover:text-foreground",
          focusOutline
        )}
      >
        {align === "right" && icon}
        <span>{children}</span>
        {align === "left" && icon}
      </button>
    </TableHead>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [rows, setRows] = useState<Shipment[]>(SHIPMENTS)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<StatusFilter>("All")
  const [depot, setDepot] = useState("all")
  const [sortKey, setSortKey] = useState<SortKey>("updated")
  const [sortDir, setSortDir] = useState<SortDir>("descending")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const searchRef = useRef<HTMLInputElement>(null)
  const headerCheckboxRef = useRef<HTMLElement>(null)
  const emptyClearRef = useRef<HTMLButtonElement>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter(
      (r) =>
        (status === "All" || r.status === status) &&
        (depot === "all" || r.depot === depot) &&
        (q === "" ||
          r.id.toLowerCase().includes(q) ||
          r.customer.toLowerCase().includes(q) ||
          r.destination.toLowerCase().includes(q))
    )
  }, [rows, search, status, depot])

  const sorted = useMemo(() => {
    const dir = sortDir === "ascending" ? 1 : -1
    return [...filtered].sort((a, b) => {
      const x = a[sortKey]
      const y = b[sortKey]
      if (typeof x === "number" && typeof y === "number") return (x - y) * dir
      return String(x).localeCompare(String(y), "en-GB") * dir
    })
  }, [filtered, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = sorted.slice(start, start + PAGE_SIZE)
  const rangeText =
    sorted.length === 0
      ? "0 of 0"
      : `${start + 1}–${start + pageRows.length} of ${sorted.length}`

  const selectedOnPage = pageRows.filter((r) => selected.has(r.id)).length
  const allOnPage = pageRows.length > 0 && selectedOnPage === pageRows.length
  const someOnPage = selectedOnPage > 0 && !allOnPage
  const filtersActive = search !== "" || status !== "All" || depot !== "all"

  function resetView() {
    setPage(1)
    setSelected(new Set())
  }

  function clearFilters() {
    flushSync(() => {
      setSearch("")
      setStatus("All")
      setDepot("all")
      resetView()
    })
    searchRef.current?.focus()
  }

  function sortBy(key: SortKey) {
    if (key === sortKey) {
      setSortDir(sortDir === "ascending" ? "descending" : "ascending")
    } else {
      setSortKey(key)
      setSortDir("ascending")
    }
    setPage(1)
  }

  function toggleRow(id: string, checked: boolean) {
    const next = new Set(selected)
    if (checked) next.add(id)
    else next.delete(id)
    setSelected(next)
  }

  function togglePage() {
    const next = new Set(selected)
    if (allOnPage) pageRows.forEach((r) => next.delete(r.id))
    else pageRows.forEach((r) => next.add(r.id))
    setSelected(next)
  }

  function markDelivered() {
    const nextRows = rows.map((r) =>
      selected.has(r.id) ? { ...r, status: "Delivered" as const } : r
    )
    flushSync(() => {
      setRows(nextRows)
      setSelected(new Set())
    })
    const stillMatching = nextRows.some(
      (r) =>
        (status === "All" || r.status === status) &&
        (depot === "all" || r.depot === depot) &&
        (search.trim() === "" ||
          [r.id, r.customer, r.destination].some((v) =>
            v.toLowerCase().includes(search.trim().toLowerCase())
          ))
    )
    if (stillMatching) headerCheckboxRef.current?.focus()
    else emptyClearRef.current?.focus()
  }

  function clearSelection() {
    flushSync(() => setSelected(new Set()))
    headerCheckboxRef.current?.focus()
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-3 py-3 md:px-5">
          <a
            href="/"
            className={cn("font-heading text-h2 text-foreground transition-colors duration-150", focusOutline)}
          >
            Northgate
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <NavLinks className="flex items-center gap-5" />
          </nav>
          <span className={cn(smallFigure, "ml-auto hidden md:inline")}>Maren Achterberg</span>
          <Button
            variant="outline"
            className={cn(buttonText, "ml-auto md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            Menu
          </Button>
        </div>
        <nav id="mobile-menu" aria-label="Main" hidden={!menuOpen} className="border-t md:hidden">
          <div className="mx-auto max-w-[1280px] px-3 py-2 md:px-5">
            <NavLinks linkClassName="block py-2" />
          </div>
        </nav>
      </header>

      <main className="mx-auto grid max-w-[1280px] grid-cols-1 gap-5 px-3 py-5 md:grid-cols-12 md:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-12">
          <div className="flex items-baseline gap-3">
            <h1 className="text-h1">Shipments</h1>
            <span className={smallFigure}>
              {SHIPMENTS.length} {SHIPMENTS.length === 1 ? "shipment" : "shipments"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className={buttonText}>
              Export
            </Button>
            <Button className={buttonText}>New shipment</Button>
          </div>
        </div>

        <section aria-label="Filters" className="rounded-xl border bg-card p-5 md:col-span-12">
          <div className="flex flex-wrap items-end gap-5">
            <div className="flex w-full flex-col gap-2 md:w-64">
              <label htmlFor="search" className={cn(label, "text-muted-foreground")}>
                Search
              </label>
              <Input
                ref={searchRef}
                id="search"
                type="text"
                autoComplete="off"
                placeholder="ID, customer or destination"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  resetView()
                }}
                className="px-2 text-body md:text-body"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p id="status-label" className={cn(label, "text-muted-foreground")}>
                Status
              </p>
              <div role="group" aria-labelledby="status-label" className="flex flex-wrap gap-1">
                {STATUS_FILTERS.map((s) => (
                  <Button
                    key={s}
                    variant={status === s ? "secondary" : "outline"}
                    aria-pressed={status === s}
                    className={buttonText}
                    onClick={() => {
                      setStatus(s)
                      resetView()
                    }}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex w-48 flex-col gap-2">
              <label htmlFor="depot" className={cn(label, "text-muted-foreground")}>
                Depot
              </label>
              <Select
                items={DEPOT_ITEMS}
                value={depot}
                onValueChange={(v) => {
                  if (v === null) return
                  setDepot(v)
                  resetView()
                }}
              >
                <SelectTrigger id="depot">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPOT_ITEMS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className={cn(buttonText, "ml-auto")}
              disabled={!filtersActive}
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>
        </section>

        <section
          aria-labelledby="results-heading"
          className="overflow-hidden rounded-xl border bg-card md:col-span-12"
        >
          <div className="border-b px-5 pt-5 pb-3">
            <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
              <h2 id="results-heading" className={cn(label, "text-muted-foreground")}>
                Results
              </h2>
              <p aria-live="polite" className={selected.size > 0 ? "sr-only" : smallFigure}>
                {rangeText}
              </p>
              {selected.size > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-body">{selected.size} selected</span>
                  <div className="flex gap-2">
                    <Button variant="secondary" className={buttonText} onClick={markDelivered}>
                      Mark as delivered
                    </Button>
                    <Button variant="outline" className={buttonText} onClick={clearSelection}>
                      Clear selection
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Table label="Results" className="text-body">
            <TableHeader>
              <TableRow>
                <TableHead className="px-5">
                  <Checkbox
                    ref={headerCheckboxRef}
                    className="rounded-sm"
                    aria-label="Select all on this page"
                    checked={allOnPage}
                    indeterminate={someOnPage}
                    disabled={pageRows.length === 0}
                    onCheckedChange={togglePage}
                  />
                </TableHead>
                <SortHeader column="id" sortKey={sortKey} sortDir={sortDir} onSort={sortBy}>
                  ID
                </SortHeader>
                <SortHeader column="customer" sortKey={sortKey} sortDir={sortDir} onSort={sortBy}>
                  Customer
                </SortHeader>
                <TableHead className="px-5 font-mono text-label uppercase text-muted-foreground">
                  Destination
                </TableHead>
                <TableHead className="px-5 font-mono text-label uppercase text-muted-foreground">
                  Depot
                </TableHead>
                <TableHead className="px-5 font-mono text-label uppercase text-muted-foreground">
                  Status
                </TableHead>
                <SortHeader column="weight" align="right" sortKey={sortKey} sortDir={sortDir} onSort={sortBy}>
                  Weight <span className="normal-case">(kg)</span>
                </SortHeader>
                <SortHeader column="value" align="right" sortKey={sortKey} sortDir={sortDir} onSort={sortBy}>
                  Value
                </SortHeader>
                <SortHeader column="updated" align="right" sortKey={sortKey} sortDir={sortDir} onSort={sortBy}>
                  Updated
                </SortHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="px-5 py-8 text-left whitespace-normal">
                    <p>No shipments match these filters.</p>
                    <Button
                      ref={emptyClearRef}
                      variant="outline"
                      className={cn(buttonText, "mt-3")}
                      onClick={clearFilters}
                    >
                      Clear filters
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((r) => {
                  const isSelected = selected.has(r.id)
                  return (
                    <TableRow
                      key={r.id}
                      data-state={isSelected ? "selected" : undefined}
                      className="data-[state=selected]:bg-secondary/10"
                    >
                      <TableCell className="px-5 py-2">
                        <Checkbox
                          className="rounded-sm"
                          aria-label={`Select shipment ${r.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => toggleRow(r.id, checked)}
                        />
                      </TableCell>
                      <TableCell className="px-5 py-2">
                        <a href="#" className={cn("font-mono tabular-nums", textLink)}>
                          {r.id}
                        </a>
                      </TableCell>
                      <TableCell className="px-5 py-2">{r.customer}</TableCell>
                      <TableCell className="px-5 py-2">{r.destination}</TableCell>
                      <TableCell className="px-5 py-2">{r.depot}</TableCell>
                      <TableCell className="px-5 py-2">
                        <span className="inline-flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className={cn("size-2 shrink-0 rounded-full", STATUS_DOT[r.status])}
                          />
                          <span className="text-body text-foreground">{r.status}</span>
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                        {kg.format(r.weight)}
                      </TableCell>
                      <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                        {money.format(r.value)}
                      </TableCell>
                      <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                        <time dateTime={r.updated}>{formatUpdated(r.updated)}</time>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3">
            <p className={smallFigure}>
              Page {currentPage} of {pageCount}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className={buttonText}
                focusableWhenDisabled
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className={buttonText}
                focusableWhenDisabled
                disabled={currentPage >= pageCount}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
