import * as React from "react"
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

type Status = "in-transit" | "delivered" | "late" | "held"
type Depot = "leeds" | "york" | "hull" | "harrogate"

type Shipment = {
  id: string
  customer: string
  destination: string
  depot: Depot
  status: Status
  weight: number
  value: number
  // ISO date and time, local, 24-hour clock
  updated: string
}

const DEPOTS: { value: Depot; label: string }[] = [
  { value: "leeds", label: "Leeds Central" },
  { value: "york", label: "York North" },
  { value: "hull", label: "Hull Docks" },
  { value: "harrogate", label: "Harrogate" },
]

const DEPOT_ITEMS: { value: "all" | Depot; label: string }[] = [
  { value: "all", label: "All depots" },
  ...DEPOTS,
]

const DEPOT_LABEL: Record<Depot, string> = {
  leeds: "Leeds Central",
  york: "York North",
  hull: "Hull Docks",
  harrogate: "Harrogate",
}

const STATUS_CHOICES: { value: "all" | Status; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in-transit", label: "In transit" },
  { value: "delivered", label: "Delivered" },
  { value: "late", label: "Late" },
  { value: "held", label: "Held" },
]

const STATUS_LOOK: Record<Status, { label: string; dot: string }> = {
  "in-transit": { label: "In transit", dot: "bg-muted-foreground" },
  delivered: { label: "Delivered", dot: "bg-success" },
  late: { label: "Late", dot: "bg-destructive" },
  held: { label: "Held", dot: "bg-tertiary" },
}

const SHIPMENTS: Shipment[] = [
  {
    id: "NG-48213",
    customer: "Halden & Pryce Joinery",
    destination: "Wakefield",
    depot: "leeds",
    status: "in-transit",
    weight: 18.4,
    value: 1240,
    updated: "2026-11-13T09:42",
  },
  {
    id: "NG-48207",
    customer: "Brightmoor Pharmacy",
    destination: "Ilkley",
    depot: "harrogate",
    status: "delivered",
    weight: 2.1,
    value: 386.5,
    updated: "2026-11-13T08:15",
  },
  {
    id: "NG-48199",
    customer: "Calder Valley Bikes",
    destination: "Hebden Bridge",
    depot: "leeds",
    status: "late",
    weight: 24.8,
    value: 2895,
    updated: "2026-11-12T17:30",
  },
  {
    id: "NG-48194",
    customer: "Ouse Street Books",
    destination: "Selby",
    depot: "york",
    status: "delivered",
    weight: 6.3,
    value: 212.4,
    updated: "2026-11-12T16:05",
  },
  {
    id: "NG-48188",
    customer: "Marram Coastal Supplies",
    destination: "Bridlington",
    depot: "hull",
    status: "held",
    weight: 41.0,
    value: 3610,
    updated: "2026-11-12T14:48",
  },
  {
    id: "NG-48182",
    customer: "Tessaly Print Works",
    destination: "Bradford",
    depot: "leeds",
    status: "in-transit",
    weight: 12.7,
    value: 845.2,
    updated: "2026-11-12T13:20",
  },
  {
    id: "NG-48176",
    customer: "Fenwick Garden Centre",
    destination: "Knaresborough",
    depot: "harrogate",
    status: "in-transit",
    weight: 33.5,
    value: 1078,
    updated: "2026-11-12T11:02",
  },
  {
    id: "NG-48171",
    customer: "Holloway Dental Lab",
    destination: "Malton",
    depot: "york",
    status: "late",
    weight: 1.4,
    value: 560,
    updated: "2026-11-12T09:37",
  },
  {
    id: "NG-48165",
    customer: "Saltgate Marine",
    destination: "Grimsby",
    depot: "hull",
    status: "delivered",
    weight: 58.2,
    value: 4720,
    updated: "2026-11-11T18:44",
  },
  {
    id: "NG-48160",
    customer: "Wren & Abbot Tea Room",
    destination: "Ripon",
    depot: "harrogate",
    status: "delivered",
    weight: 4.9,
    value: 148.75,
    updated: "2026-11-11T16:21",
  },
  {
    id: "NG-48154",
    customer: "Kirkstall Audio",
    destination: "Huddersfield",
    depot: "leeds",
    status: "held",
    weight: 9.6,
    value: 1985,
    updated: "2026-11-11T14:05",
  },
  {
    id: "NG-48149",
    customer: "Minster Fabrics",
    destination: "Thirsk",
    depot: "york",
    status: "in-transit",
    weight: 15.2,
    value: 690,
    updated: "2026-11-11T12:48",
  },
  {
    id: "NG-48143",
    customer: "Humber Lab Services",
    destination: "Beverley",
    depot: "hull",
    status: "in-transit",
    weight: 3.8,
    value: 1320.6,
    updated: "2026-11-11T10:16",
  },
  {
    id: "NG-48138",
    customer: "Pennine Outdoor Co.",
    destination: "Skipton",
    depot: "leeds",
    status: "delivered",
    weight: 21.3,
    value: 940,
    updated: "2026-11-11T08:53",
  },
  {
    id: "NG-48132",
    customer: "Nidd Valley Cheese",
    destination: "Pateley Bridge",
    depot: "harrogate",
    status: "late",
    weight: 11.0,
    value: 305.8,
    updated: "2026-11-10T17:12",
  },
  {
    id: "NG-48127",
    customer: "Shambles Clockmakers",
    destination: "Pickering",
    depot: "york",
    status: "delivered",
    weight: 7.5,
    value: 2410,
    updated: "2026-11-10T15:40",
  },
  {
    id: "NG-48121",
    customer: "Eastfield Tiles",
    destination: "Goole",
    depot: "hull",
    status: "in-transit",
    weight: 64.9,
    value: 1755,
    updated: "2026-11-10T13:27",
  },
  {
    id: "NG-48116",
    customer: "Armley Office Supply",
    destination: "Pudsey",
    depot: "leeds",
    status: "delivered",
    weight: 13.1,
    value: 418.3,
    updated: "2026-11-10T11:09",
  },
  {
    id: "NG-48110",
    customer: "Valley Gardens Florist",
    destination: "Wetherby",
    depot: "harrogate",
    status: "in-transit",
    weight: 5.6,
    value: 96.4,
    updated: "2026-11-10T09:31",
  },
  {
    id: "NG-48104",
    customer: "Clifford Tower Games",
    destination: "Tadcaster",
    depot: "york",
    status: "held",
    weight: 8.2,
    value: 1150,
    updated: "2026-11-09T17:55",
  },
  {
    id: "NG-48099",
    customer: "Spurn Point Brewing",
    destination: "Withernsea",
    depot: "hull",
    status: "delivered",
    weight: 47.6,
    value: 1890.5,
    updated: "2026-11-09T16:02",
  },
  {
    id: "NG-48093",
    customer: "Roundhay Physio",
    destination: "Harehills",
    depot: "leeds",
    status: "late",
    weight: 2.9,
    value: 275,
    updated: "2026-11-09T14:18",
  },
  {
    id: "NG-48088",
    customer: "Bilton Hardware",
    destination: "Boroughbridge",
    depot: "harrogate",
    status: "delivered",
    weight: 29.7,
    value: 664.9,
    updated: "2026-11-09T11:46",
  },
  {
    id: "NG-48082",
    customer: "Micklegate Cycles",
    destination: "Easingwold",
    depot: "york",
    status: "in-transit",
    weight: 19.9,
    value: 3240,
    updated: "2026-11-09T09:05",
  },
]

const PAGE_SIZE = 10

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

function formatUpdated(iso: string) {
  const [date, time] = iso.split("T")
  const [, month, day] = date.split("-")
  return `${Number(day)} ${MONTHS[Number(month) - 1]}, ${time}`
}

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

type SortKey = "id" | "customer" | "weight" | "value" | "updated"
type SortDir = "ascending" | "descending"

function compare(a: Shipment, b: Shipment, key: SortKey) {
  switch (key) {
    case "id":
      return a.id.localeCompare(b.id)
    case "customer":
      return a.customer.localeCompare(b.customer)
    case "weight":
      return a.weight - b.weight
    case "value":
      return a.value - b.value
    case "updated":
      return new Date(a.updated).getTime() - new Date(b.updated).getTime()
  }
}

const NAV = [
  { label: "Overview", href: "/" },
  { label: "Shipments", href: "/shipments", current: true },
  { label: "Depots", href: "/depots" },
  { label: "Reports", href: "/reports" },
]

const LABEL = "font-mono text-label uppercase"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const BUTTON_TEXT = "px-5 font-mono text-label uppercase"
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const TEXT_LINK = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  FOCUS
)

function NavLinks({
  className,
  linkClassName,
}: {
  className?: string
  linkClassName?: string
}) {
  return (
    <ul className={className}>
      {NAV.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            aria-current={item.current ? "page" : undefined}
            className={cn(
              LABEL,
              "transition-colors duration-150",
              FOCUS,
              item.current
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
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
  label,
  column,
  sortKey,
  sortDir,
  align = "left",
  onSort,
}: {
  label: React.ReactNode
  column: SortKey
  sortKey: SortKey
  sortDir: SortDir
  align?: "left" | "right"
  onSort: (key: SortKey) => void
}) {
  const sorted = sortKey === column
  const Icon = !sorted
    ? ArrowUpDown
    : sortDir === "ascending"
      ? ArrowUp
      : ArrowDown
  const icon = (
    <Icon
      aria-hidden="true"
      strokeWidth={1.5}
      className={cn("size-4", sorted && "text-foreground")}
    />
  )
  return (
    <TableHead
      aria-sort={sorted ? sortDir : undefined}
      className={cn(
        "px-5 font-mono text-label text-muted-foreground uppercase",
        align === "right" && "text-right"
      )}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          "inline-flex items-center gap-1 font-mono text-label text-muted-foreground uppercase transition-colors duration-150 hover:text-foreground",
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
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [rows, setRows] = React.useState<Shipment[]>(SHIPMENTS)
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState<"all" | Status>("all")
  const [depot, setDepot] = React.useState<"all" | Depot>("all")
  const [sortKey, setSortKey] = React.useState<SortKey>("updated")
  const [sortDir, setSortDir] = React.useState<SortDir>("descending")
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set())

  const menuButtonRef = React.useRef<HTMLButtonElement>(null)
  const searchRef = React.useRef<HTMLInputElement>(null)
  const headerCheckboxRef = React.useRef<HTMLElement>(null)
  const emptyClearRef = React.useRef<HTMLButtonElement>(null)

  const matching = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = rows.filter((row) => {
      if (status !== "all" && row.status !== status) return false
      if (depot !== "all" && row.depot !== depot) return false
      if (!query) return true
      return (
        row.id.toLowerCase().includes(query) ||
        row.customer.toLowerCase().includes(query) ||
        row.destination.toLowerCase().includes(query)
      )
    })
    const dir = sortDir === "ascending" ? 1 : -1
    return [...filtered].sort((a, b) => compare(a, b, sortKey) * dir)
  }, [rows, search, status, depot, sortKey, sortDir])

  const total = matching.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = matching.slice(start, start + PAGE_SIZE)

  const selectedOnPage = pageRows.filter((row) => selected.has(row.id)).length
  const allOnPage = pageRows.length > 0 && selectedOnPage === pageRows.length
  const someOnPage = selectedOnPage > 0 && !allOnPage

  const filtersActive = search !== "" || status !== "all" || depot !== "all"
  const rangeLabel =
    total === 0
      ? "0 of 0"
      : `${start + 1}–${start + pageRows.length} of ${total}`

  function resetForFilterChange() {
    setPage(1)
    setSelected(new Set())
  }

  function clearFilters() {
    setSearch("")
    setStatus("all")
    setDepot("all")
    resetForFilterChange()
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
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function togglePage() {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allOnPage) pageRows.forEach((row) => next.delete(row.id))
      else pageRows.forEach((row) => next.add(row.id))
      return next
    })
  }

  function focusAfterSelectionAction(remaining: number) {
    if (remaining === 0) emptyClearRef.current?.focus()
    else headerCheckboxRef.current?.focus()
  }

  function markDelivered() {
    const nextRows = rows.map((row) =>
      selected.has(row.id) ? { ...row, status: "delivered" as const } : row
    )
    const query = search.trim().toLowerCase()
    const remaining = nextRows.filter((row) => {
      if (status !== "all" && row.status !== status) return false
      if (depot !== "all" && row.depot !== depot) return false
      if (!query) return true
      return (
        row.id.toLowerCase().includes(query) ||
        row.customer.toLowerCase().includes(query) ||
        row.destination.toLowerCase().includes(query)
      )
    }).length
    const lastPage = Math.max(1, Math.ceil(remaining / PAGE_SIZE))
    flushSync(() => {
      setRows(nextRows)
      setSelected(new Set())
      setPage(Math.min(currentPage, lastPage))
    })
    focusAfterSelectionAction(remaining)
  }

  function clearSelection() {
    flushSync(() => setSelected(new Set()))
    focusAfterSelectionAction(total)
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header
        className="border-b bg-card"
        onKeyDown={(event) => {
          if (menuOpen && event.key === "Escape") {
            setMenuOpen(false)
            menuButtonRef.current?.focus()
          }
        }}
      >
        <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-3 py-3 md:px-5">
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground transition-colors duration-150",
              FOCUS
            )}
          >
            Northgate
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <NavLinks className="flex items-center gap-5" />
          </nav>
          <div className="ml-auto flex items-center gap-5">
            <p className={cn(SMALL_FIGURE, "hidden md:block")}>
              Priya Ashworth
            </p>
            <Button
              ref={menuButtonRef}
              variant="outline"
              className={cn(BUTTON_TEXT, "md:hidden")}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              Menu
            </Button>
          </div>
        </div>
        <nav
          id="mobile-nav"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t md:hidden"
        >
          <div className="mx-auto max-w-[1280px] px-3 py-2 md:px-5">
            <NavLinks linkClassName="block py-2" />
          </div>
        </nav>
      </header>

      <main className="mx-auto grid max-w-[1280px] grid-cols-1 gap-5 px-3 py-5 md:grid-cols-12 md:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-12">
          <div className="flex items-baseline gap-3">
            <h1 className="text-h1">Shipments</h1>
            <p className={SMALL_FIGURE}>
              {SHIPMENTS.length}{" "}
              {SHIPMENTS.length === 1 ? "shipment" : "shipments"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className={BUTTON_TEXT}>
              Export
            </Button>
            <Button className={BUTTON_TEXT}>New shipment</Button>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 md:col-span-12">
          <div className="flex flex-wrap items-end gap-5">
            <div className="flex w-full flex-col gap-2 md:w-64">
              <label
                htmlFor="search"
                className={cn(LABEL, "text-muted-foreground")}
              >
                Search
              </label>
              <Input
                ref={searchRef}
                id="search"
                type="search"
                placeholder="ID, customer or destination"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  resetForFilterChange()
                }}
                className="px-2 text-body md:text-body [&::-webkit-search-cancel-button]:appearance-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p
                id="status-label"
                className={cn(LABEL, "text-muted-foreground")}
              >
                Status
              </p>
              <div
                role="group"
                aria-labelledby="status-label"
                className="flex flex-wrap gap-1"
              >
                {STATUS_CHOICES.map((choice) => {
                  const chosen = status === choice.value
                  return (
                    <Button
                      key={choice.value}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      className={BUTTON_TEXT}
                      onClick={() => {
                        setStatus(choice.value)
                        resetForFilterChange()
                      }}
                    >
                      {choice.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="flex w-48 flex-col gap-2">
              <label
                id="depot-label"
                htmlFor="depot-filter"
                className={cn(LABEL, "text-muted-foreground")}
              >
                Depot
              </label>
              <Select
                items={DEPOT_ITEMS}
                value={depot}
                onValueChange={(value) => {
                  if (value === null) return
                  setDepot(value)
                  resetForFilterChange()
                }}
              >
                <SelectTrigger id="depot-filter" aria-labelledby="depot-label">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPOT_ITEMS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className={cn(BUTTON_TEXT, "ml-auto")}
              disabled={!filtersActive}
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-card md:col-span-12">
          <div className="border-b px-5 pt-5 pb-3">
            <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
              <h2 className={cn(LABEL, "text-muted-foreground")}>Results</h2>
              <p
                aria-live="polite"
                className={cn(SMALL_FIGURE, selected.size > 0 && "sr-only")}
              >
                {rangeLabel}
              </p>
              {selected.size > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-body tabular-nums">
                    {selected.size} selected
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      className={BUTTON_TEXT}
                      onClick={markDelivered}
                    >
                      Mark as delivered
                    </Button>
                    <Button
                      variant="outline"
                      className={BUTTON_TEXT}
                      onClick={clearSelection}
                    >
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
                <SortHeader
                  label="ID"
                  column="id"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={sortBy}
                />
                <SortHeader
                  label="Customer"
                  column="customer"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={sortBy}
                />
                <TableHead className="px-5 font-mono text-label text-muted-foreground uppercase">
                  Destination
                </TableHead>
                <TableHead className="px-5 font-mono text-label text-muted-foreground uppercase">
                  Depot
                </TableHead>
                <TableHead className="px-5 font-mono text-label text-muted-foreground uppercase">
                  Status
                </TableHead>
                <SortHeader
                  label={
                    <>
                      Weight <span className="normal-case">(kg)</span>
                    </>
                  }
                  column="weight"
                  align="right"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={sortBy}
                />
                <SortHeader
                  label="Value"
                  column="value"
                  align="right"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={sortBy}
                />
                <SortHeader
                  label="Updated"
                  column="updated"
                  align="right"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={sortBy}
                />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="px-5 py-8 text-left whitespace-normal"
                  >
                    <p>No shipments match these filters.</p>
                    <Button
                      ref={emptyClearRef}
                      variant="outline"
                      className={cn(BUTTON_TEXT, "mt-3")}
                      onClick={clearFilters}
                    >
                      Clear filters
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((row) => {
                  const isSelected = selected.has(row.id)
                  const look = STATUS_LOOK[row.status]
                  return (
                    <TableRow
                      key={row.id}
                      data-state={isSelected ? "selected" : undefined}
                      className="data-[state=selected]:bg-secondary/10"
                    >
                      <TableCell className="px-5 py-2">
                        <Checkbox
                          className="rounded-sm"
                          aria-label={`Select shipment ${row.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            toggleRow(row.id, checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="px-5 py-2">
                        <a
                          href="#"
                          className={cn(TEXT_LINK, "font-mono tabular-nums")}
                        >
                          {row.id}
                        </a>
                      </TableCell>
                      <TableCell className="px-5 py-2">
                        {row.customer}
                      </TableCell>
                      <TableCell className="px-5 py-2">
                        {row.destination}
                      </TableCell>
                      <TableCell className="px-5 py-2">
                        {DEPOT_LABEL[row.depot]}
                      </TableCell>
                      <TableCell className="px-5 py-2">
                        <span className="inline-flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className={cn(
                              "size-2 shrink-0 rounded-full",
                              look.dot
                            )}
                          />
                          <span className="text-body text-foreground">
                            {look.label}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                        {row.weight.toFixed(1)}
                      </TableCell>
                      <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                        {money.format(row.value)}
                      </TableCell>
                      <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                        <time dateTime={row.updated}>
                          {formatUpdated(row.updated)}
                        </time>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3">
            <p className={SMALL_FIGURE}>
              Page {currentPage} of {pageCount}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className={BUTTON_TEXT}
                focusableWhenDisabled
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className={BUTTON_TEXT}
                focusableWhenDisabled
                disabled={currentPage >= pageCount}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
