import { useMemo, useRef, useState, type KeyboardEvent, type Ref } from "react"

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
  },
  {
    number: "TVL-1030-RS",
    bore: 10,
    outside: 30,
    width: 9,
    load: 5.5,
    stock: "In stock",
    price: 1.64,
  },
  {
    number: "TVL-1232-RS",
    bore: 12,
    outside: 32,
    width: 10,
    load: 7.2,
    stock: "In stock",
    price: 1.78,
  },
  {
    number: "TVL-1535-ZZ",
    bore: 15,
    outside: 35,
    width: 11,
    load: 8.1,
    stock: "Low stock",
    price: 1.96,
  },
  {
    number: "TVL-1740-RS",
    bore: 17,
    outside: 40,
    width: 12,
    load: 9.9,
    stock: "In stock",
    price: 2.38,
  },
  {
    number: "TVL-2047-RS",
    bore: 20,
    outside: 47,
    width: 14,
    load: 13.4,
    stock: "In stock",
    price: 2.94,
  },
  {
    number: "TVL-2047-ZZ",
    bore: 20,
    outside: 47,
    width: 14,
    load: 13.4,
    stock: "Low stock",
    price: 2.71,
  },
  {
    number: "TVL-2552-RS",
    bore: 25,
    outside: 52,
    width: 15,
    load: 14.6,
    stock: "In stock",
    price: 3.46,
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
  },
  {
    number: "TVL-3572-ZZ",
    bore: 35,
    outside: 72,
    width: 17,
    load: 26.8,
    stock: "In stock",
    price: 6.52,
  },
  {
    number: "TVL-4080-RS",
    bore: 40,
    outside: 80,
    width: 18,
    load: 32.2,
    stock: "Made to order",
    price: 8.15,
  },
  {
    number: "TVL-4585-RS",
    bore: 45,
    outside: 85,
    width: 19,
    load: 34.9,
    stock: "Discontinued",
    price: 9.4,
  },
]

const BORE_OPTIONS = [
  { id: "bore-10-17", label: "10 to 17", min: 10, max: 17 },
  { id: "bore-20-30", label: "20 to 30", min: 20, max: 30 },
  { id: "bore-35-45", label: "35 to 45", min: 35, max: 45 },
] as const

const SEAL_OPTIONS = [
  { id: "seal-rs", label: "Rubber seals, RS", suffix: "RS" },
  { id: "seal-zz", label: "Metal shields, ZZ", suffix: "ZZ" },
] as const

type SortKey = "bore" | "number" | "load" | "price"

const SORT_ITEMS: { value: SortKey; label: string }[] = [
  { value: "bore", label: "Bore, smallest first" },
  { value: "number", label: "Part number, A to Z" },
  { value: "load", label: "Load rating, highest first" },
  { value: "price", label: "Unit price, lowest first" },
]

const NAV_LINKS = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Compare", href: "/compare" },
  { label: "Downloads", href: "/downloads" },
  { label: "Quote", href: "/quote" },
]

const CURRENT_SECTION = "/catalogue"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const TEXT_LINK = cn(
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
  FOCUS
)

const BUTTON_TEXT = "px-4 font-mono text-label"

const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"

const DOT_CLASS: Record<StockState, string> = {
  "In stock": "bg-success",
  "Low stock": "bg-muted-foreground",
  "Made to order": "bg-muted-foreground",
  Discontinued: "bg-destructive",
}

const priceFormat = new Intl.NumberFormat("en-GB", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function byNumber(a: Part, b: Part) {
  return a.number < b.number ? -1 : a.number > b.number ? 1 : 0
}

function sortParts(parts: Part[], key: SortKey) {
  const sorted = [...parts]
  sorted.sort((a, b) => {
    let diff = 0
    if (key === "bore") diff = a.bore - b.bore
    if (key === "load") diff = b.load - a.load
    if (key === "price") diff = a.price - b.price
    return diff !== 0 ? diff : byNumber(a, b)
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

function StockLabel({ state }: { state: StockState }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", DOT_CLASS[state])}
      />
      <span className="text-body text-foreground">{state}</span>
    </span>
  )
}

type OptionProps = {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  inputRef?: Ref<HTMLElement>
}

function Option({ id, label, checked, onChange, inputRef }: OptionProps) {
  const textId = `${id}-text`
  return (
    <label className="flex items-center gap-2 text-body text-foreground">
      <Checkbox
        ref={inputRef}
        className="rounded-sm"
        checked={checked}
        onCheckedChange={(value) => onChange(value === true)}
        aria-labelledby={textId}
      />
      <span id={textId}>{label}</span>
    </label>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [bores, setBores] = useState<string[]>([])
  const [seals, setSeals] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>("bore")

  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstCheckboxRef = useRef<HTMLElement>(null)

  const filterSet = bores.length > 0 || seals.length > 0 || inStockOnly

  const rows = useMemo(() => {
    const filtered = PARTS.filter((part) => {
      if (bores.length > 0) {
        const inRange = BORE_OPTIONS.some(
          (option) =>
            bores.includes(option.id) &&
            part.bore >= option.min &&
            part.bore <= option.max
        )
        if (!inRange) return false
      }
      if (seals.length > 0) {
        const sealed = SEAL_OPTIONS.some(
          (option) =>
            seals.includes(option.id) &&
            part.number.endsWith(`-${option.suffix}`)
        )
        if (!sealed) return false
      }
      if (
        inStockOnly &&
        part.stock !== "In stock" &&
        part.stock !== "Low stock"
      ) {
        return false
      }
      return true
    })
    return sortParts(filtered, sort)
  }, [bores, seals, inStockOnly, sort])

  const count = filterSet
    ? `${rows.length} of ${PARTS.length} parts`
    : `${PARTS.length} parts`

  function toggle(list: string[], id: string, checked: boolean) {
    return checked ? [...list, id] : list.filter((item) => item !== id)
  }

  function clearFilters() {
    setBores([])
    setSeals([])
    setInStockOnly(false)
    firstCheckboxRef.current?.focus()
  }

  function onHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <header
        className="border-b border-border bg-card"
        onKeyDown={onHeaderKeyDown}
      >
        <div className="mx-auto flex w-full max-w-[1280px] items-center gap-6 px-4 py-3">
          <a
            href="/catalogue"
            className={cn(
              "font-heading text-h2 text-foreground transition-colors duration-150",
              FOCUS
            )}
          >
            Torvale
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={
                      link.href === CURRENT_SECTION ? "true" : undefined
                    }
                    className={navLinkClass(link.href === CURRENT_SECTION)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className={cn("ml-auto hidden md:block", SMALL_FIGURE)}>
            Sales 01632 960 418
          </p>
          <Button
            ref={menuButtonRef}
            variant="secondary"
            className={cn("ml-auto md:hidden", BUTTON_TEXT)}
            aria-expanded={menuOpen}
            aria-controls="menu-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="menu-nav"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
        >
          <div className="mx-auto w-full max-w-[1280px] px-4">
            <ul className="py-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={
                      link.href === CURRENT_SECTION ? "true" : undefined
                    }
                    className={cn(
                      navLinkClass(link.href === CURRENT_SECTION),
                      "block py-2"
                    )}
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
                  <li className="flex items-center gap-2">
                    <a
                      href="/catalogue"
                      className={cn(
                        "text-muted-foreground underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                        FOCUS
                      )}
                    >
                      Catalogue
                    </a>
                    <span aria-hidden="true" className="text-muted-foreground">
                      /
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <a
                      href="#"
                      className={cn(
                        "text-muted-foreground underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                        FOCUS
                      )}
                    >
                      Ball bearings
                    </a>
                    <span aria-hidden="true" className="text-muted-foreground">
                      /
                    </span>
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
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  BUTTON_TEXT
                )}
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
              className="flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:col-span-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-h2">Filters</h2>
                <Button
                  variant="secondary"
                  className={BUTTON_TEXT}
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
                <p
                  id="bore-label"
                  className="font-mono text-label text-muted-foreground"
                >
                  Bore (mm)
                </p>
                {BORE_OPTIONS.map((option, index) => (
                  <Option
                    key={option.id}
                    id={option.id}
                    label={option.label}
                    checked={bores.includes(option.id)}
                    onChange={(checked) =>
                      setBores((list) => toggle(list, option.id, checked))
                    }
                    inputRef={index === 0 ? firstCheckboxRef : undefined}
                  />
                ))}
              </div>

              <div
                role="group"
                aria-labelledby="seal-label"
                className="flex flex-col gap-2 border-t border-border pt-4"
              >
                <p
                  id="seal-label"
                  className="font-mono text-label text-muted-foreground"
                >
                  Seals
                </p>
                {SEAL_OPTIONS.map((option) => (
                  <Option
                    key={option.id}
                    id={option.id}
                    label={option.label}
                    checked={seals.includes(option.id)}
                    onChange={(checked) =>
                      setSeals((list) => toggle(list, option.id, checked))
                    }
                  />
                ))}
              </div>

              <div
                role="group"
                aria-labelledby="stock-label"
                className="flex flex-col gap-2 border-t border-border pt-4"
              >
                <p
                  id="stock-label"
                  className="font-mono text-label text-muted-foreground"
                >
                  Stock
                </p>
                <Option
                  id="stock-only"
                  label="In stock only"
                  checked={inStockOnly}
                  onChange={setInStockOnly}
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-border pt-4">
                <label
                  id="sort-label"
                  htmlFor="sort"
                  className="block font-mono text-label text-muted-foreground"
                >
                  Sort by
                </label>
                <div className="flex flex-col gap-2">
                  <Select
                    items={SORT_ITEMS}
                    value={sort}
                    onValueChange={(value) => {
                      if (value !== null) setSort(value as SortKey)
                    }}
                  >
                    <SelectTrigger id="sort" aria-labelledby="sort-label">
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

            <div className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card lg:col-span-9">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <h2 id="parts-heading" className="text-h2">
                  Parts
                </h2>
                <p aria-live="polite" className={SMALL_FIGURE}>
                  {count}
                </p>
              </div>

              <Table label="Parts" className="text-body">
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4 font-mono text-label text-muted-foreground">
                      Part number
                    </TableHead>
                    <TableHead className="px-4 text-right font-mono text-label text-muted-foreground">
                      Bore (mm)
                    </TableHead>
                    <TableHead className="px-4 text-right font-mono text-label text-muted-foreground">
                      Outside (mm)
                    </TableHead>
                    <TableHead className="px-4 text-right font-mono text-label text-muted-foreground">
                      Width (mm)
                    </TableHead>
                    <TableHead className="px-4 text-right font-mono text-label text-muted-foreground">
                      Load C (kN)
                    </TableHead>
                    <TableHead className="px-4 font-mono text-label text-muted-foreground">
                      Stock
                    </TableHead>
                    <TableHead className="px-4 text-right font-mono text-label text-muted-foreground">
                      Unit price (£)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
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
                            className={BUTTON_TEXT}
                            onClick={clearFilters}
                          >
                            Clear filters
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((part) => (
                      <TableRow key={part.number}>
                        <TableCell className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <a
                              href={
                                part.number === "TVL-2047-RS" ? "/part" : "#"
                              }
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
                        <TableCell className="px-4 py-2 text-right font-mono tabular-nums">
                          {part.bore}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-right font-mono tabular-nums">
                          {part.outside}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-right font-mono tabular-nums">
                          {part.width}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-right font-mono tabular-nums">
                          {part.load.toFixed(2)}
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          <StockLabel state={part.stock} />
                        </TableCell>
                        <TableCell className="px-4 py-2 text-right font-mono tabular-nums">
                          {priceFormat.format(part.price)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="mt-auto border-t border-border px-4 py-3">
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
