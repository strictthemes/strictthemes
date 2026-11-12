import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DEPOTS,
  SHIPMENTS,
  STATUSES,
  type Shipment,
  type Status,
} from "@/data/shipments"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 10
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const BUTTON = "px-5 font-mono text-label uppercase"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const NAV_LINKS = [
  { label: "Overview", href: "/" },
  { label: "Shipments", href: "/shipments" },
  { label: "Depots", href: "/depots" },
  { label: "Reports", href: "/reports" },
]
const CURRENT = "/shipments"

type SortKey = "id" | "customer" | "weight" | "value" | "updated"
type Sort = { key: SortKey; dir: "asc" | "desc" }
type StatusFilter = "All" | Status

const STATE_DOT: Record<Status, string> = {
  "In transit": "bg-muted-foreground",
  Delivered: "bg-success",
  Late: "bg-destructive",
  Held: "bg-tertiary",
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
function formatDateTime(iso: string) {
  const [date, time] = iso.split("T")
  const [, m, d] = date.split("-").map(Number)
  return `${d} ${MONTHS[m - 1]}, ${time}`
}
const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
})
const kg = new Intl.NumberFormat("en-GB", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
})

function compare(a: Shipment, b: Shipment, key: SortKey) {
  switch (key) {
    case "weight":
    case "value":
      return a[key] - b[key]
    case "updated":
      return new Date(a.updated).getTime() - new Date(b.updated).getTime()
    default:
      return a[key].localeCompare(b[key], "en-GB")
  }
}

function StateLabel({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", STATE_DOT[status])} />
      <span className="text-body text-foreground">{status}</span>
    </span>
  )
}

function SortHeader({
  label,
  sortKey,
  sort,
  align = "left",
  onSort,
}: {
  label: React.ReactNode
  sortKey: SortKey
  sort: Sort
  align?: "left" | "right"
  onSort: (key: SortKey) => void
}) {
  const active = sort.key === sortKey
  const Icon = active ? (sort.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown
  const icon = (
    <Icon
      aria-hidden="true"
      className={cn("size-4", active && "text-foreground")}
      strokeWidth={1.5}
    />
  )
  return (
    <TableHead
      className={cn(
        "px-5 font-mono text-label uppercase text-muted-foreground",
        align === "right" && "text-right"
      )}
      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 font-mono text-label uppercase text-muted-foreground transition-colors duration-150 hover:text-foreground",
          FOCUS
        )}
      >
        {align === "right" && icon}
        {label}
        {align === "left" && icon}
      </button>
    </TableHead>
  )
}

export function App() {
  const [rows, setRows] = useState<Shipment[]>(SHIPMENTS)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("All")
  const [depot, setDepot] = useState("All")
  const [sort, setSort] = useState<Sort>({ key: "updated", dir: "desc" })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [menuOpen, setMenuOpen] = useState(false)

  const searchRef = useRef<HTMLInputElement>(null)
  const headerCheckboxRef = useRef<HTMLElement>(null)
  const emptyClearRef = useRef<HTMLButtonElement>(null)
  const pendingFocus = useRef(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows
      .filter(
        (r) =>
          (!q ||
            r.id.toLowerCase().includes(q) ||
            r.customer.toLowerCase().includes(q) ||
            r.destination.toLowerCase().includes(q)) &&
          (status === "All" || r.status === status) &&
          (depot === "All" || r.depot === depot)
      )
      .sort((a, b) => {
        const c = compare(a, b, sort.key)
        return sort.dir === "asc" ? c : -c
      })
  }, [rows, query, status, depot, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = filtered.slice(start, start + PAGE_SIZE)
  const rangeLabel =
    filtered.length === 0
      ? "0 of 0"
      : `${start + 1}–${start + pageRows.length} of ${filtered.length}`

  const selectedOnPage = pageRows.filter((r) => selected.has(r.id)).length
  const allOnPage = pageRows.length > 0 && selectedOnPage === pageRows.length
  const someOnPage = selectedOnPage > 0 && !allOnPage
  const filtersActive = query !== "" || status !== "All" || depot !== "All"

  // After the selection buttons remove themselves, move focus once the new rows render.
  useEffect(() => {
    if (!pendingFocus.current) return
    pendingFocus.current = false
    if (filtered.length === 0) emptyClearRef.current?.focus()
    else headerCheckboxRef.current?.focus()
  })

  function resetView() {
    setPage(1)
    setSelected(new Set())
  }

  function clearFilters() {
    setQuery("")
    setStatus("All")
    setDepot("All")
    resetView()
    searchRef.current?.focus()
  }

  function onSort(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }))
    setPage(1)
  }

  function togglePage() {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allOnPage) pageRows.forEach((r) => next.delete(r.id))
      else pageRows.forEach((r) => next.add(r.id))
      return next
    })
  }

  function toggleRow(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function markDelivered() {
    setRows((prev) =>
      prev.map((r) => (selected.has(r.id) ? { ...r, status: "Delivered" } : r))
    )
    setSelected(new Set())
    pendingFocus.current = true
  }

  function clearSelection() {
    setSelected(new Set())
    pendingFocus.current = true
  }

  const linkClass = (href: string) =>
    cn(
      "font-mono text-label uppercase transition-colors duration-150",
      FOCUS,
      href === CURRENT ? "text-foreground" : "text-muted-foreground hover:text-foreground"
    )

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-3 py-3 md:px-5">
          <a href="/" className={cn("font-heading text-h2 text-foreground transition-colors duration-150", FOCUS)}>
            Northgate
          </a>
          <nav aria-label="Main" className="hidden items-center gap-5 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={linkClass(l.href)}
                aria-current={l.href === CURRENT ? "page" : undefined}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <span className={cn(SMALL_FIGURE, "ml-auto hidden md:block")}>Priya Okafor</span>
          <Button
            variant="outline"
            className={cn(BUTTON, "ml-auto md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            Menu
          </Button>
        </div>
        <nav id="mobile-nav" aria-label="Main" hidden={!menuOpen} className="border-t md:hidden">
          <ul className="mx-auto max-w-[1280px] px-3 py-2">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={cn(linkClass(l.href), "block py-2")}
                  aria-current={l.href === CURRENT ? "page" : undefined}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto grid max-w-[1280px] grid-cols-1 gap-5 px-3 py-5 md:grid-cols-12 md:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-12">
          <div className="flex items-baseline gap-3">
            <h1 className="text-h1">Shipments</h1>
            <span className={SMALL_FIGURE}>
              {SHIPMENTS.length} {SHIPMENTS.length === 1 ? "shipment" : "shipments"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className={BUTTON}>
              Export
            </Button>
            <Button className={BUTTON}>New shipment</Button>
          </div>
        </div>

        <section aria-label="Filters" className="rounded-xl border bg-card p-5 md:col-span-12">
          <div className="flex flex-wrap items-end gap-5">
            <div className="flex w-full flex-col gap-2 md:w-64">
              <label htmlFor="search" className="font-mono text-label uppercase text-muted-foreground">
                Search
              </label>
              <Input
                ref={searchRef}
                id="search"
                type="search"
                placeholder="ID, customer or destination"
                className="text-body md:text-body"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  resetView()
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p id="status-label" className="font-mono text-label uppercase text-muted-foreground">
                Status
              </p>
              <div role="group" aria-labelledby="status-label" className="flex flex-wrap gap-1">
                {(["All", ...STATUSES] as StatusFilter[]).map((s) => (
                  <Button
                    key={s}
                    variant={status === s ? "secondary" : "outline"}
                    aria-pressed={status === s}
                    className={BUTTON}
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
              <label htmlFor="depot" className="font-mono text-label uppercase text-muted-foreground">
                Depot
              </label>
              <select
                id="depot"
                value={depot}
                onChange={(e) => {
                  setDepot(e.target.value)
                  resetView()
                }}
                className={cn("h-8 w-full rounded-lg border border-input bg-card px-2 text-body", FOCUS)}
              >
                <option value="All">All depots</option>
                {DEPOTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="outline"
              className={cn(BUTTON, "ml-auto")}
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
              <h2 id="results-heading" className="font-mono text-label uppercase text-muted-foreground">
                Results
              </h2>
              <span aria-live="polite" className={cn(SMALL_FIGURE, selected.size > 0 && "sr-only")}>
                {rangeLabel}
              </span>
              {selected.size > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-body">{selected.size} selected</span>
                  <div className="flex gap-2">
                    <Button variant="secondary" className={BUTTON} onClick={markDelivered}>
                      Mark as delivered
                    </Button>
                    <Button variant="outline" className={BUTTON} onClick={clearSelection}>
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
                <TableHead className="pl-5">
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
                <SortHeader label="ID" sortKey="id" sort={sort} onSort={onSort} />
                <SortHeader label="Customer" sortKey="customer" sort={sort} onSort={onSort} />
                <TableHead className="px-5 font-mono text-label uppercase text-muted-foreground">
                  Destination
                </TableHead>
                <TableHead className="px-5 font-mono text-label uppercase text-muted-foreground">
                  Depot
                </TableHead>
                <TableHead className="px-5 font-mono text-label uppercase text-muted-foreground">
                  Status
                </TableHead>
                <SortHeader
                  label={
                    <>
                      Weight <span className="normal-case">(kg)</span>
                    </>
                  }
                  sortKey="weight"
                  sort={sort}
                  align="right"
                  onSort={onSort}
                />
                <SortHeader label="Value" sortKey="value" sort={sort} align="right" onSort={onSort} />
                <SortHeader label="Updated" sortKey="updated" sort={sort} align="right" onSort={onSort} />
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
                      className={cn(BUTTON, "mt-3")}
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
                      <TableCell className="py-2 pl-5">
                        <Checkbox
                          className="rounded-sm"
                          aria-label={`Select shipment ${r.id}`}
                          checked={isSelected}
                          onCheckedChange={(c) => toggleRow(r.id, c)}
                        />
                      </TableCell>
                      <TableCell className="px-5 py-2">
                        <a
                          href="#"
                          className={cn(
                            "font-mono tabular-nums text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                            FOCUS
                          )}
                        >
                          {r.id}
                        </a>
                      </TableCell>
                      <TableCell className="px-5 py-2">{r.customer}</TableCell>
                      <TableCell className="px-5 py-2">{r.destination}</TableCell>
                      <TableCell className="px-5 py-2">{r.depot}</TableCell>
                      <TableCell className="px-5 py-2">
                        <StateLabel status={r.status} />
                      </TableCell>
                      <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                        {kg.format(r.weight)}
                      </TableCell>
                      <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                        {money.format(r.value)}
                      </TableCell>
                      <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                        <time dateTime={r.updated}>{formatDateTime(r.updated)}</time>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3">
            <span className={SMALL_FIGURE}>
              Page {currentPage} of {pageCount}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className={BUTTON}
                focusableWhenDisabled
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className={BUTTON}
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
