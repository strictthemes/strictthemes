import { useRef, useState } from "react"
import type { KeyboardEvent } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

type StockState = "In stock" | "Low stock" | "Made to order" | "Discontinued"

type Part = {
  number: string
  bore: number
  outside: number
  width: number
  load: number
  stock: StockState
  price: number
  href: string
  badge?: string
}

const PARTS: Part[] = [
  {
    number: "TVL-1026-ZZ",
    bore: 10,
    outside: 26,
    width: 8,
    load: 4.75,
    stock: "In stock",
    price: 1.42,
    href: "#",
  },
  {
    number: "TVL-1030-RS",
    bore: 10,
    outside: 30,
    width: 9,
    load: 5.5,
    stock: "In stock",
    price: 1.64,
    href: "#",
  },
  {
    number: "TVL-1232-RS",
    bore: 12,
    outside: 32,
    width: 10,
    load: 7.2,
    stock: "In stock",
    price: 1.78,
    href: "#",
  },
  {
    number: "TVL-1535-ZZ",
    bore: 15,
    outside: 35,
    width: 11,
    load: 8.1,
    stock: "Low stock",
    price: 1.96,
    href: "#",
  },
  {
    number: "TVL-1740-RS",
    bore: 17,
    outside: 40,
    width: 12,
    load: 9.9,
    stock: "In stock",
    price: 2.38,
    href: "#",
  },
  {
    number: "TVL-2047-RS",
    bore: 20,
    outside: 47,
    width: 14,
    load: 13.4,
    stock: "In stock",
    price: 2.94,
    href: "/part",
  },
  {
    number: "TVL-2047-ZZ",
    bore: 20,
    outside: 47,
    width: 14,
    load: 13.4,
    stock: "Low stock",
    price: 2.71,
    href: "#",
  },
  {
    number: "TVL-2552-RS",
    bore: 25,
    outside: 52,
    width: 15,
    load: 14.6,
    stock: "In stock",
    price: 3.46,
    href: "#",
    badge: "New",
  },
  {
    number: "TVL-3062-RS",
    bore: 30,
    outside: 62,
    width: 16,
    load: 20.1,
    stock: "Made to order",
    price: 4.88,
    href: "#",
  },
  {
    number: "TVL-3572-ZZ",
    bore: 35,
    outside: 72,
    width: 17,
    load: 26.8,
    stock: "In stock",
    price: 6.52,
    href: "#",
  },
  {
    number: "TVL-4080-RS",
    bore: 40,
    outside: 80,
    width: 18,
    load: 32.2,
    stock: "Made to order",
    price: 8.15,
    href: "#",
  },
  {
    number: "TVL-4585-RS",
    bore: 45,
    outside: 85,
    width: 19,
    load: 34.9,
    stock: "Discontinued",
    price: 9.4,
    href: "#",
  },
]

const NAV_LINKS = [
  { label: "Catalogue", href: "/catalogue", current: true },
  { label: "Compare", href: "/compare", current: false },
  { label: "Downloads", href: "/downloads", current: false },
  { label: "Quote", href: "/quote", current: false },
]

const BORE_OPTIONS = [
  { id: "bore-10-17", label: "10 to 17", min: 10, max: 17 },
  { id: "bore-20-30", label: "20 to 30", min: 20, max: 30 },
  { id: "bore-35-45", label: "35 to 45", min: 35, max: 45 },
]

const SEAL_OPTIONS = [
  { id: "seal-rs", label: "Rubber seals, RS", suffix: "RS" },
  { id: "seal-zz", label: "Metal shields, ZZ", suffix: "ZZ" },
]

const STOCK_OPTION = { id: "stock-only", label: "In stock only" }

const SORT_ITEMS = [
  { value: "bore", label: "Bore, smallest first" },
  { value: "number", label: "Part number, A to Z" },
  { value: "load", label: "Load rating, highest first" },
  { value: "price", label: "Unit price, lowest first" },
]

const STOCK_DOT: Record<StockState, string> = {
  "In stock": "bg-success",
  "Low stock": "bg-muted-foreground",
  "Made to order": "bg-muted-foreground",
  Discontinued: "bg-destructive",
}

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const TEXT_LINK = cn(
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
  FOCUS
)
const LABEL = "font-mono text-label text-muted-foreground"
const SMALL_FIGURE = "font-mono text-label text-muted-foreground tabular-nums"
const BUTTON = "px-4 font-mono text-label"
const HEAD = "px-4 font-mono text-label text-muted-foreground"
const FIGURE_CELL = "px-4 py-2 text-right font-mono tabular-nums"

function byNumber(a: Part, b: Part) {
  return a.number < b.number ? -1 : a.number > b.number ? 1 : 0
}

function sortParts(parts: Part[], sort: string) {
  const sorted = [...parts]
  sorted.sort((a, b) => {
    let order = 0
    if (sort === "bore") order = a.bore - b.bore
    else if (sort === "load") order = b.load - a.load
    else if (sort === "price") order = a.price - b.price
    return order !== 0 ? order : byNumber(a, b)
  })
  return sorted
}

function navLinkClass(current: boolean) {
  return cn(
    "font-mono text-label transition-colors duration-150",
    current
      ? "text-foreground underline underline-offset-4"
      : "text-muted-foreground hover:text-foreground",
    FOCUS
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [checked, setChecked] = useState<string[]>([])
  const [sort, setSort] = useState("bore")
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstCheckboxRef = useRef<HTMLElement>(null)

  const filterSet = checked.length > 0

  const bores = BORE_OPTIONS.filter((option) => checked.includes(option.id))
  const seals = SEAL_OPTIONS.filter((option) => checked.includes(option.id))
  const stockOnly = checked.includes(STOCK_OPTION.id)

  const rows = sortParts(
    PARTS.filter(
      (part) =>
        (bores.length === 0 ||
          bores.some((b) => part.bore >= b.min && part.bore <= b.max)) &&
        (seals.length === 0 ||
          seals.some((s) => part.number.endsWith(`-${s.suffix}`))) &&
        (!stockOnly || part.stock === "In stock" || part.stock === "Low stock")
    ),
    sort
  )

  const total = PARTS.length
  const noun = total === 1 ? "part" : "parts"
  const count = filterSet
    ? `${rows.length} of ${total} ${noun}`
    : `${total} ${noun}`

  function toggle(id: string, on: boolean) {
    setChecked((current) =>
      on
        ? [...current.filter((item) => item !== id), id]
        : current.filter((item) => item !== id)
    )
  }

  function clearFilters() {
    setChecked([])
    firstCheckboxRef.current?.focus()
  }

  function closeMenuOnEscape(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  function option(id: string, label: string, first = false) {
    return (
      <label
        key={id}
        className="flex items-center gap-2 text-body text-foreground"
      >
        <Checkbox
          ref={first ? firstCheckboxRef : undefined}
          className="rounded-sm"
          checked={checked.includes(id)}
          onCheckedChange={(on) => toggle(id, on)}
          aria-labelledby={`${id}-text`}
        />
        <span id={`${id}-text`}>{label}</span>
      </label>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-[1280px] items-center gap-6 px-4 py-3">
          <a
            href="/catalogue"
            className={cn("font-heading text-h2 text-foreground", FOCUS)}
          >
            Torvale
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "true" : undefined}
                    className={navLinkClass(link.current)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className={cn(SMALL_FIGURE, "ml-auto hidden md:block")}>
            Sales 01632 960 418
          </p>
          <Button
            ref={menuButtonRef}
            variant="secondary"
            className={cn(BUTTON, "ml-auto md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen((open) => !open)}
            onKeyDown={closeMenuOnEscape}
          >
            Menu
          </Button>
        </div>
        <nav
          id="main-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
          onKeyDown={closeMenuOnEscape}
        >
          <div className="mx-auto w-full max-w-[1280px] px-4">
            <ul className="py-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "true" : undefined}
                    className={cn("block py-2", navLinkClass(link.current))}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className="flex-1 py-6">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-2 font-mono text-label">
                  <li>
                    <a
                      href="/catalogue"
                      className={cn(
                        "text-muted-foreground underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                        FOCUS
                      )}
                    >
                      Catalogue
                    </a>
                  </li>
                  <li aria-hidden="true" className="text-muted-foreground">
                    /
                  </li>
                  <li>
                    <a
                      href="#"
                      className={cn(
                        "text-muted-foreground underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                        FOCUS
                      )}
                    >
                      Ball bearings
                    </a>
                  </li>
                  <li aria-hidden="true" className="text-muted-foreground">
                    /
                  </li>
                  <li aria-current="page" className="text-foreground">
                    Deep groove
                  </li>
                </ol>
              </nav>
              <h1 className="text-h1">Deep groove ball bearings</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="/downloads"
                className={cn(buttonVariants({ variant: "secondary" }), BUTTON)}
              >
                Range documents
              </a>
            </div>
          </div>

          <p className="max-w-lg text-body text-foreground">
            Single-row bearings with a 20% grease fill, sealed or shielded on
            both sides. Chrome steel rings, pressed steel cage, normal
            clearance.
          </p>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <aside
              aria-label="Filters"
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:col-span-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-h2">Filters</h2>
                <Button
                  variant="secondary"
                  className={BUTTON}
                  disabled={!filterSet}
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              </div>

              <div
                role="group"
                aria-labelledby="bore-label"
                className="flex flex-col gap-2"
              >
                <p id="bore-label" className={LABEL}>
                  Bore (mm)
                </p>
                {BORE_OPTIONS.map((item, index) =>
                  option(item.id, item.label, index === 0)
                )}
              </div>

              <div
                role="group"
                aria-labelledby="seals-label"
                className="flex flex-col gap-2 border-t border-border pt-4"
              >
                <p id="seals-label" className={LABEL}>
                  Seals
                </p>
                {SEAL_OPTIONS.map((item) => option(item.id, item.label))}
              </div>

              <div
                role="group"
                aria-labelledby="stock-label"
                className="flex flex-col gap-2 border-t border-border pt-4"
              >
                <p id="stock-label" className={LABEL}>
                  Stock
                </p>
                {option(STOCK_OPTION.id, STOCK_OPTION.label)}
              </div>

              <div className="flex flex-col gap-3 border-t border-border pt-4">
                <label htmlFor="sort-by" className={cn("block", LABEL)}>
                  Sort by
                </label>
                <div className="flex flex-col gap-2">
                  <Select
                    items={SORT_ITEMS}
                    value={sort}
                    onValueChange={(value) => {
                      if (value !== null) setSort(value)
                    }}
                  >
                    <SelectTrigger id="sort-by">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_ITEMS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </aside>

            <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-9">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <h2 className="text-h2">Parts</h2>
                <p aria-live="polite" className={SMALL_FIGURE}>
                  {count}
                </p>
              </div>
              <Table label="Parts" className="text-body">
                <TableHeader>
                  <TableRow>
                    <TableHead className={HEAD}>Part number</TableHead>
                    <TableHead className={cn(HEAD, "text-right")}>
                      Bore (mm)
                    </TableHead>
                    <TableHead className={cn(HEAD, "text-right")}>
                      Outside (mm)
                    </TableHead>
                    <TableHead className={cn(HEAD, "text-right")}>
                      Width (mm)
                    </TableHead>
                    <TableHead className={cn(HEAD, "text-right")}>
                      Load C (kN)
                    </TableHead>
                    <TableHead className={HEAD}>Stock</TableHead>
                    <TableHead className={cn(HEAD, "text-right")}>
                      Unit price (£)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((part) => (
                    <TableRow key={part.number}>
                      <TableCell className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <a
                            href={part.href}
                            className={cn("font-mono text-body", TEXT_LINK)}
                          >
                            {part.number}
                          </a>
                          {part.badge ? (
                            <Badge
                              variant="outline"
                              className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"
                            >
                              {part.badge}
                            </Badge>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className={FIGURE_CELL}>{part.bore}</TableCell>
                      <TableCell className={FIGURE_CELL}>
                        {part.outside}
                      </TableCell>
                      <TableCell className={FIGURE_CELL}>
                        {part.width}
                      </TableCell>
                      <TableCell className={FIGURE_CELL}>
                        {part.load.toFixed(2)}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <span className="inline-flex items-center gap-2 whitespace-nowrap">
                          <span
                            aria-hidden="true"
                            className={cn(
                              "size-2 shrink-0 rounded-full",
                              STOCK_DOT[part.stock]
                            )}
                          />
                          <span className="text-body text-foreground">
                            {part.stock}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell className={FIGURE_CELL}>
                        {part.price.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="px-4 py-12 whitespace-normal"
                      >
                        <div className="flex flex-col items-start gap-3">
                          <p className="text-body">
                            No parts match these filters.
                          </p>
                          <Button
                            variant="secondary"
                            className={BUTTON}
                            onClick={clearFilters}
                          >
                            Clear filters
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
              <div className="border-t border-border px-4 py-3">
                <p className={SMALL_FIGURE}>
                  Unit prices are for 1 to 49 and exclude VAT. Price breaks for
                  larger quantities are on each part&apos;s page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-6">
          <p className={SMALL_FIGURE}>
            Torvale Bearings Ltd · Brigholt works · Prices exclude VAT · A demo:
            nothing is sold or sent.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
