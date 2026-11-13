import { useRef, useState } from "react"
import type { KeyboardEvent } from "react"

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

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = cn(
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
  focusOutline
)

const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"

const navLinks = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Compare", href: "/compare" },
  { label: "Downloads", href: "/downloads" },
  { label: "Quote", href: "/quote" },
]

const currentHref = "/compare"

type StockState = "In stock" | "Low stock" | "Made to order" | "Discontinued"

const stockDot: Record<StockState, string> = {
  "In stock": "bg-success",
  "Low stock": "bg-muted-foreground",
  "Made to order": "bg-muted-foreground",
  Discontinued: "bg-destructive",
}

type Part = {
  number: string
  href: string
  seals: string
  isNew?: boolean
}

const parts: [Part, Part, Part] = [
  { number: "TVL-2047-RS", href: "/part", seals: "Rubber seals" },
  { number: "TVL-2047-ZZ", href: "#", seals: "Metal shields" },
  { number: "TVL-2552-RS", href: "#", seals: "Rubber seals", isNew: true },
]

type Row =
  | { property: string; kind: "figure" | "phrase"; values: [string, string, string] }
  | { property: string; kind: "stock"; values: [StockState, StockState, StockState] }

const same = (value: string): [string, string, string] => [value, value, value]

const rows: Row[] = [
  { property: "Bore d (mm)", kind: "figure", values: ["20", "20", "25"] },
  {
    property: "Outside diameter D (mm)",
    kind: "figure",
    values: ["47", "47", "52"],
  },
  { property: "Width B (mm)", kind: "figure", values: ["14", "14", "15"] },
  {
    property: "Seals",
    kind: "phrase",
    values: [
      "Two rubber seals, RS",
      "Two metal shields, ZZ",
      "Two rubber seals, RS",
    ],
  },
  {
    property: "Dynamic load rating C (kN)",
    kind: "figure",
    values: ["13.40", "13.40", "14.60"],
  },
  {
    property: "Static load rating C0 (kN)",
    kind: "figure",
    values: ["6.55", "6.55", "7.85"],
  },
  {
    property: "Limiting speed (r/min)",
    kind: "figure",
    values: ["13,000", "18,000", "11,000"],
  },
  {
    property: "Operating temperature (°C)",
    kind: "figure",
    values: ["−30 to +110", "−30 to +120", "−30 to +110"],
  },
  {
    property: "Mass (kg)",
    kind: "figure",
    values: ["0.103", "0.101", "0.125"],
  },
  { property: "Cage", kind: "phrase", values: same("Pressed steel") },
  {
    property: "Ring material",
    kind: "phrase",
    values: same("Chrome steel, 100Cr6"),
  },
  { property: "Grease", kind: "phrase", values: same("Lithium, 20% fill") },
  { property: "Radial clearance", kind: "phrase", values: same("CN, normal") },
  { property: "Precision class", kind: "phrase", values: same("P0, normal") },
  {
    property: "Stock",
    kind: "stock",
    values: ["In stock", "Low stock", "In stock"],
  },
  {
    property: "Unit price, 1 to 49 (£)",
    kind: "figure",
    values: ["2.94", "2.71", "3.46"],
  },
]

// A row differs when its three values, as shown, are not all the same.
function rowDiffers(row: Row) {
  return row.values.some((value) => value !== row.values[0])
}

const differingCount = rows.filter(rowDiffers).length

function countText(onlyDiffering: boolean) {
  if (onlyDiffering) {
    return differingCount === 1
      ? "Showing the 1 row that differs"
      : `Showing the ${differingCount} rows that differ`
  }
  const total = rows.length === 1 ? "1 row" : `${rows.length} rows`
  return `${differingCount} of ${total} ${differingCount === 1 ? "differs" : "differ"}`
}

function NavLink({
  link,
  className,
}: {
  link: (typeof navLinks)[number]
  className?: string
}) {
  const current = link.href === currentHref
  return (
    <a
      href={link.href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "font-mono text-label transition-colors duration-150",
        current
          ? "text-foreground underline underline-offset-4"
          : "text-muted-foreground hover:text-foreground",
        focusOutline,
        className
      )}
    >
      {link.label}
    </a>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [onlyDiffering, setOnlyDiffering] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const closeMenuOnEscape = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  const shownRows = onlyDiffering ? rows.filter(rowDiffers) : rows

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-[1280px] items-center gap-6 px-4 py-3">
          <a
            href="/catalogue"
            className={cn("font-heading text-h2 text-foreground", focusOutline)}
          >
            Torvale
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink link={link} />
                </li>
              ))}
            </ul>
          </nav>
          <p className={cn(smallFigure, "ml-auto hidden md:block")}>
            Sales 01632 960 418
          </p>
          <Button
            ref={menuButtonRef}
            variant="secondary"
            className="ml-auto px-4 font-mono text-label md:hidden"
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
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink link={link} className="block py-2" />
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
              <p className="font-mono text-label text-muted-foreground">
                Compare
              </p>
              <h1 className="text-h1">Three parts side by side</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="/catalogue"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "px-4 font-mono text-label"
                )}
              >
                Back to the catalogue
              </a>
              <a
                href="/quote"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "px-4 font-mono text-label"
                )}
              >
                Request a quote
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
              <h2 className="text-h2">Comparison</h2>
              <div className="flex flex-wrap items-center gap-4">
                <p aria-live="polite" className={smallFigure}>
                  {countText(onlyDiffering)}
                </p>
                <label className="flex items-center gap-2 text-body text-foreground">
                  <Checkbox
                    className="rounded-sm"
                    aria-labelledby="only-differing-label"
                    checked={onlyDiffering}
                    onCheckedChange={(checked) => setOnlyDiffering(checked)}
                  />
                  <span id="only-differing-label">
                    Show only rows that differ
                  </span>
                </label>
              </div>
            </div>

            <Table label="Comparison of three parts" className="text-body">
              <TableHeader>
                <TableRow>
                  <TableHead
                    scope="col"
                    className="min-w-48 px-4 font-mono text-label text-muted-foreground"
                  >
                    Property
                  </TableHead>
                  {parts.map((part) => (
                    <TableHead
                      key={part.number}
                      scope="col"
                      className="h-auto min-w-48 px-4 py-2 text-right font-mono text-label text-muted-foreground"
                    >
                      <div className="flex flex-col items-end gap-1">
                        {part.isNew ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={part.href}
                              className={cn("font-mono text-body", textLink)}
                            >
                              {part.number}
                            </a>
                            <Badge
                              variant="outline"
                              className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"
                            >
                              New
                            </Badge>
                          </div>
                        ) : (
                          <a
                            href={part.href}
                            className={cn("font-mono text-body", textLink)}
                          >
                            {part.number}
                          </a>
                        )}
                        <span className={smallFigure}>{part.seals}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {shownRows.map((row) => {
                  const differs = rowDiffers(row)
                  return (
                    <TableRow key={row.property}>
                      <th
                        scope="row"
                        className="px-4 py-2 text-left align-top text-body font-normal text-foreground"
                      >
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span>{row.property}</span>
                          {differs && (
                            <span className={cn(smallFigure, "text-foreground")}>
                              Differs
                            </span>
                          )}
                        </div>
                      </th>
                      {row.kind === "stock"
                        ? row.values.map((state, index) => (
                            <TableCell
                              key={parts[index].number}
                              className={cn(
                                "px-4 py-2 text-right",
                                differs && "font-bold"
                              )}
                            >
                              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                                <span
                                  aria-hidden="true"
                                  className={cn(
                                    "size-2 shrink-0 rounded-full",
                                    stockDot[state]
                                  )}
                                />
                                <span
                                  className={cn(
                                    "text-body text-foreground",
                                    differs && "font-bold"
                                  )}
                                >
                                  {state}
                                </span>
                              </span>
                            </TableCell>
                          ))
                        : row.values.map((value, index) => (
                            <TableCell
                              key={parts[index].number}
                              className={cn(
                                "px-4 py-2 text-right",
                                row.kind === "figure"
                                  ? "font-mono tabular-nums"
                                  : "text-body",
                                differs && "font-bold"
                              )}
                            >
                              {value}
                            </TableCell>
                          ))}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <div className="border-t border-border px-4 py-3">
              <p className={smallFigure}>
                Load ratings are calculated to ISO 281 and ISO 76. Limiting
                speeds are for grease lubrication. Prices exclude VAT.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:col-span-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-h2">Not sure which to choose?</h2>
              </div>
              <p className="max-w-lg text-body text-foreground">
                Shields let a bearing run faster and warmer; seals keep out
                more dirt and water. For a pump shaft near water, choose the
                rubber seals.
              </p>
              <a href="#" className={cn("self-start", textLink)}>
                Ask an engineer
              </a>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:col-span-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-h2">Need the files?</h2>
              </div>
              <p className="max-w-lg text-body text-foreground">
                Data sheets, 3D models and certificates for the whole TVL range
                are on one page.
              </p>
              <a href="/downloads" className={cn("self-start", textLink)}>
                Range documents
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-6">
          <p className={smallFigure}>
            Torvale Bearings Ltd · Brigholt works · Prices exclude VAT · A
            demo: nothing is sold or sent.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
