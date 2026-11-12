import { useMemo, useRef, useState, type KeyboardEvent } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  href: string
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
    badge: "New",
    href: "#",
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

const BORE_RANGES = [
  { id: "bore-10-17", label: "10 to 17", min: 10, max: 17 },
  { id: "bore-20-30", label: "20 to 30", min: 20, max: 30 },
  { id: "bore-35-45", label: "35 to 45", min: 35, max: 45 },
] as const

const SEALS = [
  { id: "seal-rs", label: "Rubber seals, RS", suffix: "RS" },
  { id: "seal-zz", label: "Metal shields, ZZ", suffix: "ZZ" },
] as const

type SortKey = "bore" | "number" | "load" | "price"

const SORTS: { value: SortKey; label: string }[] = [
  { value: "bore", label: "Bore, smallest first" },
  { value: "number", label: "Part number, A to Z" },
  { value: "load", label: "Load rating, highest first" },
  { value: "price", label: "Unit price, lowest first" },
]

const NAV = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Compare", href: "/compare" },
  { label: "Downloads", href: "/downloads" },
  { label: "Quote", href: "/quote" },
]
const CURRENT_NAV = "Catalogue"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const textLink = cn(
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
  focusRing
)
const buttonClass = "px-4 font-mono text-label"
const labelClass = "font-mono text-label text-muted-foreground"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"

const twoDecimals = new Intl.NumberFormat("en-GB", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function byNumber(a: Part, b: Part) {
  return a.number < b.number ? -1 : a.number > b.number ? 1 : 0
}

function StockLabel({ state }: { state: StockState }) {
  const dot =
    state === "In stock"
      ? "bg-success"
      : state === "Discontinued"
        ? "bg-destructive"
        : "bg-muted-foreground"
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", dot)}
      />
      <span className="text-body text-foreground">{state}</span>
    </span>
  )
}

function CheckOption({
  id,
  label,
  checked,
  onChange,
  inputRef,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  inputRef?: React.Ref<HTMLElement>
}) {
  const textId = `${id}-text`
  return (
    <label className="flex items-center gap-2 text-body text-foreground">
      <Checkbox
        ref={inputRef}
        className="rounded-sm"
        checked={checked}
        onCheckedChange={(value) => onChange(value)}
        aria-labelledby={textId}
      />
      <span id={textId}>{label}</span>
    </label>
  )
}

function NavLinks({ itemClass }: { itemClass?: string }) {
  return NAV.map((item) => {
    const current = item.label === CURRENT_NAV
    return (
      <li key={item.href}>
        <a
          href={item.href}
          aria-current={current ? "true" : undefined}
          className={cn(
            "font-mono text-label transition-colors duration-150",
            focusRing,
            current
              ? "text-foreground underline underline-offset-4"
              : "text-muted-foreground hover:text-foreground",
            itemClass
          )}
        >
          {item.label}
        </a>
      </li>
    )
  })
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstCheckboxRef = useRef<HTMLElement>(null)

  const [bores, setBores] = useState<string[]>([])
  const [seals, setSeals] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>("bore")

  const filterSet = bores.length > 0 || seals.length > 0 || inStockOnly

  const rows = useMemo(() => {
    const boreRanges = BORE_RANGES.filter((r) => bores.includes(r.id))
    const suffixes = SEALS.filter((s) => seals.includes(s.id)).map(
      (s) => s.suffix
    )
    const filtered = PARTS.filter((part) => {
      if (
        boreRanges.length > 0 &&
        !boreRanges.some((r) => part.bore >= r.min && part.bore <= r.max)
      ) {
        return false
      }
      if (
        suffixes.length > 0 &&
        !suffixes.some((s) => part.number.endsWith(`-${s}`))
      ) {
        return false
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
    return [...filtered].sort((a, b) => {
      let diff = 0
      if (sort === "bore") diff = a.bore - b.bore
      else if (sort === "load") diff = b.load - a.load
      else if (sort === "price") diff = a.price - b.price
      return diff !== 0 ? diff : byNumber(a, b)
    })
  }, [bores, seals, inStockOnly, sort])

  const count = !filterSet
    ? `${PARTS.length} ${PARTS.length === 1 ? "part" : "parts"}`
    : `${rows.length} of ${PARTS.length} parts`

  function toggle(list: string[], id: string, on: boolean) {
    return on ? [...list, id] : list.filter((x) => x !== id)
  }

  function clearFilters() {
    setBores([])
    setSeals([])
    setInStockOnly(false)
    firstCheckboxRef.current?.focus()
  }

  function onMenuKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-[1280px] items-center gap-6 px-4 py-3">
          <a
            href="/catalogue"
            className={cn(
              "font-heading text-h2 text-foreground transition-colors duration-150",
              focusRing
            )}
          >
            Torvale
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              <NavLinks />
            </ul>
          </nav>
          <p className={cn("ml-auto hidden md:block", smallFigure)}>
            Sales 01632 960 418
          </p>
          <Button
            ref={menuButtonRef}
            variant="secondary"
            className={cn("ml-auto md:hidden", buttonClass)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            onKeyDown={onMenuKeyDown}
          >
            Menu
          </Button>
        </div>
        <nav
          id="mobile-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="w-full border-t border-border md:hidden"
          onKeyDown={onMenuKeyDown}
        >
          <div className="mx-auto w-full max-w-[1280px] px-4">
            <ul className="py-2">
              <NavLinks itemClass="block py-2" />
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
                        focusRing
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
                        focusRing
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
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  buttonClass
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
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:col-span-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-h2">Filters</h2>
                <Button
                  variant="secondary"
                  className={buttonClass}
                  disabled={!filterSet}
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              </div>

              <div
                role="group"
                aria-labelledby="group-bore"
                className="flex flex-col gap-2"
              >
                <p id="group-bore" className={labelClass}>
                  Bore (mm)
                </p>
                {BORE_RANGES.map((range, index) => (
                  <CheckOption
                    key={range.id}
                    id={range.id}
                    label={range.label}
                    checked={bores.includes(range.id)}
                    onChange={(on) =>
                      setBores((list) => toggle(list, range.id, on))
                    }
                    inputRef={index === 0 ? firstCheckboxRef : undefined}
                  />
                ))}
              </div>

              <div
                role="group"
                aria-labelledby="group-seals"
                className="flex flex-col gap-2 border-t border-border pt-4"
              >
                <p id="group-seals" className={labelClass}>
                  Seals
                </p>
                {SEALS.map((seal) => (
                  <CheckOption
                    key={seal.id}
                    id={seal.id}
                    label={seal.label}
                    checked={seals.includes(seal.id)}
                    onChange={(on) =>
                      setSeals((list) => toggle(list, seal.id, on))
                    }
                  />
                ))}
              </div>

              <div
                role="group"
                aria-labelledby="group-stock"
                className="flex flex-col gap-2 border-t border-border pt-4"
              >
                <p id="group-stock" className={labelClass}>
                  Stock
                </p>
                <CheckOption
                  id="stock-only"
                  label="In stock only"
                  checked={inStockOnly}
                  onChange={setInStockOnly}
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-border pt-4">
                <label htmlFor="sort" className={cn("block", labelClass)}>
                  Sort by
                </label>
                <div className="flex w-full flex-col gap-2">
                  <select
                    id="sort"
                    value={sort}
                    onChange={(event) => setSort(event.target.value as SortKey)}
                    className={cn(
                      "h-8 w-full rounded-lg border border-input bg-card px-2 text-body text-foreground aria-invalid:border-destructive",
                      focusRing
                    )}
                  >
                    {SORTS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </aside>

            <section
              aria-labelledby="parts-heading"
              className="min-w-0 overflow-hidden rounded-xl border border-border bg-card lg:col-span-9"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <h2 id="parts-heading" className="text-h2">
                  Parts
                </h2>
                <p aria-live="polite" className={smallFigure}>
                  {count}
                </p>
              </div>

              <Table label="Parts" className="text-body">
                <TableHeader>
                  <TableRow>
                    <TableHead className={cn("px-4", labelClass)}>
                      Part number
                    </TableHead>
                    <TableHead className={cn("px-4 text-right", labelClass)}>
                      Bore (mm)
                    </TableHead>
                    <TableHead className={cn("px-4 text-right", labelClass)}>
                      Outside (mm)
                    </TableHead>
                    <TableHead className={cn("px-4 text-right", labelClass)}>
                      Width (mm)
                    </TableHead>
                    <TableHead className={cn("px-4 text-right", labelClass)}>
                      Load C (kN)
                    </TableHead>
                    <TableHead className={cn("px-4", labelClass)}>
                      Stock
                    </TableHead>
                    <TableHead className={cn("px-4 text-right", labelClass)}>
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
                          <p className="text-body text-foreground">
                            No parts match these filters.
                          </p>
                          <Button
                            variant="secondary"
                            className={buttonClass}
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
                          <span className="flex items-center gap-2">
                            <a
                              href={part.href}
                              className={cn("font-mono text-body", textLink)}
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
                          </span>
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
                          {twoDecimals.format(part.load)}
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          <StockLabel state={part.stock} />
                        </TableCell>
                        <TableCell className="px-4 py-2 text-right font-mono tabular-nums">
                          {twoDecimals.format(part.price)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="border-t border-border px-4 py-3">
                <p className={smallFigure}>
                  Unit prices are for 1 to 49 and exclude VAT. Price breaks for
                  larger quantities are on each part&apos;s page.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-6">
          <p className={smallFigure}>
            Torvale Bearings Ltd · Brigholt works · Prices exclude VAT · A demo:
            nothing is sold or sent.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
