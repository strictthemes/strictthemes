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
  updated: string // local date and time, "YYYY-MM-DDTHH:MM"
}

const DEPOTS = [
  "Leeds Kirkstall",
  "York Clifton",
  "Hull Marfleet",
  "Harrogate Bilton",
]

const SHIPMENTS: Shipment[] = [
  {
    id: "NG-48213",
    customer: "Brackenridge Tools",
    destination: "Ripon",
    depot: "Harrogate Bilton",
    status: "In transit",
    weight: 18.4,
    value: 1240,
    updated: "2026-11-13T09:42",
  },
  {
    id: "NG-48207",
    customer: "Ouse Valley Florists",
    destination: "Selby",
    depot: "York Clifton",
    status: "Delivered",
    weight: 3.2,
    value: 86.5,
    updated: "2026-11-13T08:15",
  },
  {
    id: "NG-48199",
    customer: "Tanner & Hale Printers",
    destination: "Wakefield",
    depot: "Leeds Kirkstall",
    status: "Late",
    weight: 42.7,
    value: 2315.8,
    updated: "2026-11-12T17:58",
  },
  {
    id: "NG-48194",
    customer: "Humber Marine Supply",
    destination: "Grimsby",
    depot: "Hull Marfleet",
    status: "Held",
    weight: 64.0,
    value: 4980,
    updated: "2026-11-12T16:21",
  },
  {
    id: "NG-48188",
    customer: "Linton Bakehouse",
    destination: "Wetherby",
    depot: "Leeds Kirkstall",
    status: "Delivered",
    weight: 7.9,
    value: 142.3,
    updated: "2026-11-12T15:04",
  },
  {
    id: "NG-48181",
    customer: "Fieldfare Outdoor",
    destination: "Skipton",
    depot: "Harrogate Bilton",
    status: "In transit",
    weight: 12.5,
    value: 689.99,
    updated: "2026-11-12T13:37",
  },
  {
    id: "NG-48176",
    customer: "Minster Lane Books",
    destination: "Malton",
    depot: "York Clifton",
    status: "In transit",
    weight: 9.1,
    value: 214,
    updated: "2026-11-12T11:50",
  },
  {
    id: "NG-48170",
    customer: "Calder Bike Works",
    destination: "Halifax",
    depot: "Leeds Kirkstall",
    status: "Delivered",
    weight: 21.3,
    value: 1875,
    updated: "2026-11-12T10:12",
  },
  {
    id: "NG-48163",
    customer: "Spurn Point Fisheries",
    destination: "Withernsea",
    depot: "Hull Marfleet",
    status: "Late",
    weight: 31.6,
    value: 562.4,
    updated: "2026-11-12T08:46",
  },
  {
    id: "NG-48157",
    customer: "Nidd Gorge Dairy",
    destination: "Knaresborough",
    depot: "Harrogate Bilton",
    status: "Delivered",
    weight: 15.0,
    value: 318.75,
    updated: "2026-11-11T18:20",
  },
  {
    id: "NG-48150",
    customer: "Ashdown Electrical",
    destination: "Pontefract",
    depot: "Leeds Kirkstall",
    status: "In transit",
    weight: 27.8,
    value: 3420,
    updated: "2026-11-11T16:33",
  },
  {
    id: "NG-48144",
    customer: "Wolds Farm Machinery",
    destination: "Driffield",
    depot: "Hull Marfleet",
    status: "Held",
    weight: 88.2,
    value: 6150,
    updated: "2026-11-11T15:09",
  },
  {
    id: "NG-48139",
    customer: "Ouse Valley Florists",
    destination: "Tadcaster",
    depot: "York Clifton",
    status: "Delivered",
    weight: 2.4,
    value: 54,
    updated: "2026-11-11T14:05",
  },
  {
    id: "NG-48132",
    customer: "Kestrel Lab Supplies",
    destination: "Bradford",
    depot: "Leeds Kirkstall",
    status: "Late",
    weight: 5.6,
    value: 978.2,
    updated: "2026-11-11T12:48",
  },
  {
    id: "NG-48126",
    customer: "Pickering Pottery",
    destination: "Pickering",
    depot: "York Clifton",
    status: "In transit",
    weight: 19.7,
    value: 436,
    updated: "2026-11-11T11:02",
  },
  {
    id: "NG-48121",
    customer: "Beverley Saddlery",
    destination: "Beverley",
    depot: "Hull Marfleet",
    status: "Delivered",
    weight: 11.3,
    value: 1290.5,
    updated: "2026-11-11T09:27",
  },
  {
    id: "NG-48115",
    customer: "Brackenridge Tools",
    destination: "Thirsk",
    depot: "Harrogate Bilton",
    status: "Delivered",
    weight: 24.9,
    value: 1605,
    updated: "2026-11-10T17:44",
  },
  {
    id: "NG-48108",
    customer: "Aire Street Coffee",
    destination: "Leeds",
    depot: "Leeds Kirkstall",
    status: "In transit",
    weight: 6.8,
    value: 128.4,
    updated: "2026-11-10T16:10",
  },
  {
    id: "NG-48102",
    customer: "Holderness Seeds",
    destination: "Hornsea",
    depot: "Hull Marfleet",
    status: "In transit",
    weight: 36.5,
    value: 742.6,
    updated: "2026-11-10T14:28",
  },
  {
    id: "NG-48097",
    customer: "Shambles Clockmakers",
    destination: "York",
    depot: "York Clifton",
    status: "Held",
    weight: 1.8,
    value: 3890,
    updated: "2026-11-10T12:53",
  },
  {
    id: "NG-48091",
    customer: "Washburn Joinery",
    destination: "Otley",
    depot: "Harrogate Bilton",
    status: "Late",
    weight: 52.3,
    value: 2240,
    updated: "2026-11-10T11:16",
  },
  {
    id: "NG-48084",
    customer: "Kestrel Lab Supplies",
    destination: "Huddersfield",
    depot: "Leeds Kirkstall",
    status: "Delivered",
    weight: 4.2,
    value: 615,
    updated: "2026-11-10T09:39",
  },
  {
    id: "NG-48078",
    customer: "Derwent Textiles",
    destination: "Easingwold",
    depot: "York Clifton",
    status: "Delivered",
    weight: 13.6,
    value: 507.25,
    updated: "2026-11-09T16:57",
  },
  {
    id: "NG-48071",
    customer: "Fieldfare Outdoor",
    destination: "Settle",
    depot: "Harrogate Bilton",
    status: "In transit",
    weight: 8.4,
    value: 399,
    updated: "2026-11-09T14:31",
  },
]

const TOTAL = SHIPMENTS.length
const PAGE_SIZE = 10

const STATUS_FILTERS = [
  "All",
  "In transit",
  "Delivered",
  "Late",
  "Held",
] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]

const DEPOT_ITEMS = [
  { value: "all", label: "All depots" },
  ...DEPOTS.map((d) => ({ value: d, label: d })),
]

type SortKey = "id" | "customer" | "weight" | "value" | "updated"
type Sort = { key: SortKey; dir: "asc" | "desc" }

const STATUS_DOT: Record<Status, string> = {
  "In transit": "bg-muted-foreground",
  Delivered: "bg-success",
  Late: "bg-destructive",
  Held: "bg-tertiary",
}

const NAV = [
  { label: "Overview", href: "/" },
  { label: "Shipments", href: "/shipments" },
  { label: "Depots", href: "/depots" },
  { label: "Reports", href: "/reports" },
]
const CURRENT = "/shipments"

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

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatUpdated(stamp: string) {
  const [date, time] = stamp.split("T")
  const [, month, day] = date.split("-").map(Number)
  return `${day} ${MONTHS[month - 1]}, ${time}`
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

function filterRows(
  rows: Shipment[],
  search: string,
  status: StatusFilter,
  depot: string
) {
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
}

function sortRows(rows: Shipment[], sort: Sort) {
  const sign = sort.dir === "asc" ? 1 : -1
  return [...rows].sort((a, b) => {
    let diff: number
    switch (sort.key) {
      case "weight":
      case "value":
        diff = a[sort.key] - b[sort.key]
        break
      case "updated":
        diff = new Date(a.updated).getTime() - new Date(b.updated).getTime()
        break
      default:
        diff = a[sort.key].localeCompare(b[sort.key], "en-GB", {
          numeric: true,
        })
    }
    return diff * sign
  })
}

function pageCount(n: number) {
  return Math.max(1, Math.ceil(n / PAGE_SIZE))
}

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const LABEL = "font-mono text-label uppercase"
const SMALL = "font-mono text-label tabular-nums text-muted-foreground"
const BUTTON = "px-5 font-mono text-label uppercase"

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [rows, setRows] = useState<Shipment[]>(SHIPMENTS)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<StatusFilter>("All")
  const [depot, setDepot] = useState("all")
  const [sort, setSort] = useState<Sort>({ key: "updated", dir: "desc" })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(() => new Set())

  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const headerCheckboxRef = useRef<HTMLElement>(null)
  const emptyClearRef = useRef<HTMLButtonElement>(null)

  const filtered = useMemo(
    () => sortRows(filterRows(rows, search, status, depot), sort),
    [rows, search, status, depot, sort]
  )
  const pages = pageCount(filtered.length)
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const first = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const last = Math.min(page * PAGE_SIZE, filtered.length)
  const range =
    filtered.length === 0 ? "0 of 0" : `${first}–${last} of ${filtered.length}`

  const pageSelected = pageRows.filter((r) => selected.has(r.id)).length
  const allOnPage = pageRows.length > 0 && pageSelected === pageRows.length
  const someOnPage = pageSelected > 0 && !allOnPage

  const filtersAtRest = search === "" && status === "All" && depot === "all"

  function resetForFilterChange() {
    setPage(1)
    setSelected(new Set())
  }

  function clearFilters() {
    flushSync(() => {
      setSearch("")
      setStatus("All")
      setDepot("all")
      resetForFilterChange()
    })
    searchRef.current?.focus()
  }

  function sortBy(key: SortKey) {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    )
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
      if (allOnPage) pageRows.forEach((r) => next.delete(r.id))
      else pageRows.forEach((r) => next.add(r.id))
      return next
    })
  }

  function markDelivered() {
    const nextRows = rows.map((r) =>
      selected.has(r.id) ? { ...r, status: "Delivered" as const } : r
    )
    const remaining = filterRows(nextRows, search, status, depot).length
    flushSync(() => {
      setRows(nextRows)
      setSelected(new Set())
      setPage((p) => Math.min(p, pageCount(remaining)))
    })
    if (remaining === 0) emptyClearRef.current?.focus()
    else headerCheckboxRef.current?.focus()
  }

  function clearSelection() {
    flushSync(() => setSelected(new Set()))
    headerCheckboxRef.current?.focus()
  }

  function sortHeader(
    key: SortKey,
    label: ReactNode,
    align: "left" | "right" = "left"
  ) {
    const active = sort.key === key
    const Icon = !active
      ? ArrowUpDown
      : sort.dir === "asc"
        ? ArrowUp
        : ArrowDown
    const icon = (
      <Icon
        aria-hidden="true"
        strokeWidth={1.5}
        className={cn("size-4", active && "text-foreground")}
      />
    )
    return (
      <TableHead
        aria-sort={
          active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined
        }
        className={cn(
          "px-5 font-mono text-label text-muted-foreground uppercase",
          align === "right" && "text-right"
        )}
      >
        <button
          type="button"
          onClick={() => sortBy(key)}
          className={cn(
            "inline-flex items-center gap-1 text-muted-foreground uppercase transition-colors duration-150 hover:text-foreground",
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

  const navLink = (item: (typeof NAV)[number], block = false) => {
    const current = item.href === CURRENT
    return (
      <a
        href={item.href}
        aria-current={current ? "page" : undefined}
        className={cn(
          LABEL,
          "transition-colors duration-150",
          FOCUS,
          block && "block py-2",
          current
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {item.label}
      </a>
    )
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header
        className="border-b bg-card"
        onKeyDown={(e) => {
          if (menuOpen && e.key === "Escape") {
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
            <ul className="flex gap-5">
              {NAV.map((item) => (
                <li key={item.href}>{navLink(item)}</li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center">
            <p className={cn(SMALL, "hidden md:block")}>Maren Holt</p>
            <Button
              ref={menuButtonRef}
              variant="outline"
              className={cn(BUTTON, "md:hidden")}
              aria-expanded={menuOpen}
              aria-controls="main-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              Menu
            </Button>
          </div>
        </div>
        <nav
          id="main-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t md:hidden"
        >
          <ul className="mx-auto max-w-[1280px] px-3 py-2 md:px-5">
            {NAV.map((item) => (
              <li key={item.href}>{navLink(item, true)}</li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-[1280px] px-3 py-5 md:px-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-12">
            <div className="flex items-baseline gap-3">
              <h1 className="text-h1">Shipments</h1>
              <p className={SMALL}>{plural(TOTAL, "shipment", "shipments")}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className={BUTTON}>
                Export
              </Button>
              <Button className={BUTTON}>New shipment</Button>
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
                  onChange={(e) => {
                    setSearch(e.target.value)
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
                  {STATUS_FILTERS.map((s) => (
                    <Button
                      key={s}
                      variant={status === s ? "secondary" : "outline"}
                      aria-pressed={status === s}
                      className={BUTTON}
                      onClick={() => {
                        setStatus(s)
                        resetForFilterChange()
                      }}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex w-48 flex-col gap-2">
                <label
                  id="depot-label"
                  htmlFor="depot"
                  className={cn(LABEL, "text-muted-foreground")}
                >
                  Depot
                </label>
                <Select
                  items={DEPOT_ITEMS}
                  value={depot}
                  onValueChange={(v) => {
                    if (v === null) return
                    setDepot(v)
                    resetForFilterChange()
                  }}
                >
                  <SelectTrigger id="depot" aria-labelledby="depot-label">
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
                className={cn(BUTTON, "ml-auto")}
                disabled={filtersAtRest}
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </div>
          </div>

          <section
            aria-labelledby="results-heading"
            className="overflow-hidden rounded-xl border bg-card md:col-span-12"
          >
            <div className="border-b px-5 pt-5 pb-3">
              <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
                <h2
                  id="results-heading"
                  className={cn(LABEL, "text-muted-foreground")}
                >
                  Results
                </h2>
                {selected.size > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-body">{selected.size} selected</p>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        className={BUTTON}
                        onClick={markDelivered}
                      >
                        Mark as delivered
                      </Button>
                      <Button
                        variant="outline"
                        className={BUTTON}
                        onClick={clearSelection}
                      >
                        Clear selection
                      </Button>
                    </div>
                  </div>
                )}
                <p
                  aria-live="polite"
                  className={selected.size > 0 ? "sr-only" : SMALL}
                >
                  {range}
                </p>
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
                  {sortHeader("id", "ID")}
                  {sortHeader("customer", "Customer")}
                  <TableHead
                    className={cn("px-5", LABEL, "text-muted-foreground")}
                  >
                    Destination
                  </TableHead>
                  <TableHead
                    className={cn("px-5", LABEL, "text-muted-foreground")}
                  >
                    Depot
                  </TableHead>
                  <TableHead
                    className={cn("px-5", LABEL, "text-muted-foreground")}
                  >
                    Status
                  </TableHead>
                  {sortHeader(
                    "weight",
                    <span>
                      Weight <span className="normal-case">(kg)</span>
                    </span>,
                    "right"
                  )}
                  {sortHeader("value", "Value", "right")}
                  {sortHeader("updated", "Updated", "right")}
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
                      <div className="mt-3">
                        <Button
                          ref={emptyClearRef}
                          variant="outline"
                          className={BUTTON}
                          onClick={clearFilters}
                        >
                          Clear filters
                        </Button>
                      </div>
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
                            onCheckedChange={(c) => toggleRow(r.id, c)}
                          />
                        </TableCell>
                        <TableCell className="px-5 py-2">
                          <a
                            href="#"
                            className={cn(
                              "font-mono text-primary tabular-nums underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                              FOCUS
                            )}
                          >
                            {r.id}
                          </a>
                        </TableCell>
                        <TableCell className="px-5 py-2">
                          {r.customer}
                        </TableCell>
                        <TableCell className="px-5 py-2">
                          {r.destination}
                        </TableCell>
                        <TableCell className="px-5 py-2">{r.depot}</TableCell>
                        <TableCell className="px-5 py-2">
                          <span className="inline-flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className={cn(
                                "size-2 shrink-0 rounded-full",
                                STATUS_DOT[r.status]
                              )}
                            />
                            <span className="text-body text-foreground">
                              {r.status}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                          {r.weight.toFixed(1)}
                        </TableCell>
                        <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                          {money.format(r.value)}
                        </TableCell>
                        <TableCell className="px-5 py-2 text-right font-mono tabular-nums">
                          <time dateTime={r.updated}>
                            {formatUpdated(r.updated)}
                          </time>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3">
              <p className={SMALL}>
                Page {filtered.length === 0 ? 1 : page} of {pages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className={BUTTON}
                  focusableWhenDisabled
                  disabled={page <= 1 || filtered.length === 0}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className={BUTTON}
                  focusableWhenDisabled
                  disabled={page >= pages || filtered.length === 0}
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
