import { useRef, useState, type KeyboardEvent } from "react"

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

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = cn(
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
  focusRing
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

type Value =
  | { kind: "figure"; text: string }
  | { kind: "phrase"; text: string }
  | { kind: "stock"; state: StockState }

type Property = {
  name: string
  values: [Value, Value, Value]
}

type Part = {
  number: string
  href: string
  seals: string
  isNew: boolean
}

const parts: Part[] = [
  { number: "TVL-2047-RS", href: "/part", seals: "Rubber seals", isNew: false },
  { number: "TVL-2047-ZZ", href: "#", seals: "Metal shields", isNew: false },
  { number: "TVL-2552-RS", href: "#", seals: "Rubber seals", isNew: true },
]

const figures = (a: string, b: string, c: string): [Value, Value, Value] => [
  { kind: "figure", text: a },
  { kind: "figure", text: b },
  { kind: "figure", text: c },
]

const phrases = (a: string, b: string, c: string): [Value, Value, Value] => [
  { kind: "phrase", text: a },
  { kind: "phrase", text: b },
  { kind: "phrase", text: c },
]

const properties: Property[] = [
  { name: "Bore d (mm)", values: figures("20", "20", "25") },
  { name: "Outside diameter D (mm)", values: figures("47", "47", "52") },
  { name: "Width B (mm)", values: figures("14", "14", "15") },
  {
    name: "Seals",
    values: phrases(
      "Two rubber seals, RS",
      "Two metal shields, ZZ",
      "Two rubber seals, RS"
    ),
  },
  {
    name: "Dynamic load rating C (kN)",
    values: figures("13.40", "13.40", "14.60"),
  },
  {
    name: "Static load rating C0 (kN)",
    values: figures("6.55", "6.55", "7.85"),
  },
  {
    name: "Limiting speed (r/min)",
    values: figures("13,000", "18,000", "11,000"),
  },
  {
    name: "Operating temperature (°C)",
    values: figures(
      "−30 to +110",
      "−30 to +120",
      "−30 to +110"
    ),
  },
  { name: "Mass (kg)", values: figures("0.103", "0.101", "0.125") },
  {
    name: "Cage",
    values: phrases("Pressed steel", "Pressed steel", "Pressed steel"),
  },
  {
    name: "Ring material",
    values: phrases(
      "Chrome steel, 100Cr6",
      "Chrome steel, 100Cr6",
      "Chrome steel, 100Cr6"
    ),
  },
  {
    name: "Grease",
    values: phrases(
      "Lithium, 20% fill",
      "Lithium, 20% fill",
      "Lithium, 20% fill"
    ),
  },
  {
    name: "Radial clearance",
    values: phrases("CN, normal", "CN, normal", "CN, normal"),
  },
  {
    name: "Precision class",
    values: phrases("P0, normal", "P0, normal", "P0, normal"),
  },
  {
    name: "Stock",
    values: [
      { kind: "stock", state: "In stock" },
      { kind: "stock", state: "Low stock" },
      { kind: "stock", state: "In stock" },
    ],
  },
  { name: "Unit price, 1 to 49 (£)", values: figures("2.94", "2.71", "3.46") },
]

function shown(value: Value): string {
  return value.kind === "stock" ? value.state : value.text
}

function differs(property: Property): boolean {
  const [first, ...rest] = property.values.map(shown)
  return rest.some((value) => value !== first)
}

const dotColor: Record<StockState, string> = {
  "In stock": "bg-success",
  "Low stock": "bg-muted-foreground",
  "Made to order": "bg-muted-foreground",
  Discontinued: "bg-destructive",
}

function StockStateMark({ state, bold }: { state: StockState; bold: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", dotColor[state])}
      />
      <span className={cn("text-body text-foreground", bold && "font-bold")}>
        {state}
      </span>
    </span>
  )
}

function navLinkClass(href: string) {
  return cn(
    "font-mono text-label transition-colors duration-150",
    focusRing,
    href === currentHref
      ? "text-foreground underline underline-offset-4"
      : "text-muted-foreground hover:text-foreground"
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  return (
    <header
      className="border-b border-border bg-card"
      onKeyDown={handleKeyDown}
    >
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
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.href === currentHref ? "page" : undefined}
                  className={navLinkClass(link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={cn("ml-auto hidden md:block", smallFigure)}>
          Sales 01632 960 418
        </p>
        <Button
          ref={menuButtonRef}
          variant="secondary"
          className="ml-auto px-4 font-mono text-label md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!menuOpen}
        className="border-t border-border md:hidden"
      >
        <div className="mx-auto w-full max-w-[1280px] px-4">
          <ul className="py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.href === currentHref ? "page" : undefined}
                  className={cn(navLinkClass(link.href), "block py-2")}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function Comparison() {
  const [onlyDiffering, setOnlyDiffering] = useState(false)

  const rows = properties.map((property) => ({
    property,
    differs: differs(property),
  }))
  const differingCount = rows.filter((row) => row.differs).length
  const visibleRows = onlyDiffering ? rows.filter((row) => row.differs) : rows

  const count = onlyDiffering
    ? differingCount === 1
      ? "Showing the 1 row that differs"
      : `Showing the ${differingCount} rows that differ`
    : `${differingCount} of ${rows.length} ${rows.length === 1 ? "row" : "rows"} ${differingCount === 1 ? "differs" : "differ"}`

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h2 className="text-h2">Comparison</h2>
        <div className="flex flex-wrap items-center gap-4">
          <p aria-live="polite" className={smallFigure}>
            {count}
          </p>
          <label className="flex items-center gap-2 text-body text-foreground">
            <Checkbox
              className="rounded-sm"
              aria-labelledby="only-differing-label"
              checked={onlyDiffering}
              onCheckedChange={(checked) => setOnlyDiffering(checked)}
            />
            <span id="only-differing-label">Show only rows that differ</span>
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
                className="h-auto min-w-48 px-4 py-2 text-right"
              >
                <div className="flex flex-col items-end gap-1">
                  {part.isNew ? (
                    <div className="flex items-center gap-2">
                      <a
                        href={part.href}
                        className={cn(textLink, "font-mono text-body")}
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
                      className={cn(textLink, "font-mono text-body")}
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
          {visibleRows.map(({ property, differs: rowDiffers }) => (
            <TableRow key={property.name}>
              <th
                scope="row"
                className="px-4 py-2 text-left align-top font-normal text-body text-foreground"
              >
                <div className="flex flex-wrap items-baseline gap-2">
                  <span>{property.name}</span>
                  {rowDiffers && (
                    <span className={cn(smallFigure, "text-foreground")}>
                      Differs
                    </span>
                  )}
                </div>
              </th>
              {property.values.map((value, index) => (
                <TableCell
                  key={parts[index].number}
                  className={cn(
                    "px-4 py-2 text-right",
                    value.kind === "figure"
                      ? "font-mono tabular-nums"
                      : "text-body",
                    rowDiffers && "font-bold"
                  )}
                >
                  {value.kind === "stock" ? (
                    <StockStateMark state={value.state} bold={rowDiffers} />
                  ) : (
                    value.text
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className={cn("border-t border-border px-4 py-3", smallFigure)}>
        Load ratings are calculated to ISO 281 and ISO 76. Limiting speeds are
        for grease lubrication. Prices exclude VAT.
      </p>
    </div>
  )
}

function NextSteps() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:col-span-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-h2">Not sure which to choose?</h2>
        </div>
        <p className="max-w-lg text-body text-foreground">
          Shields let a bearing run faster and warmer; seals keep out more dirt
          and water. For a pump shaft near water, choose the rubber seals.
        </p>
        <a href="#" className={cn(textLink, "self-start")}>
          Ask an engineer
        </a>
      </div>
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:col-span-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-h2">Need the files?</h2>
        </div>
        <p className="max-w-lg text-body text-foreground">
          Data sheets, 3D models and certificates for the whole TVL range are
          on one page.
        </p>
        <a href="/downloads" className={cn(textLink, "self-start")}>
          Range documents
        </a>
      </div>
    </div>
  )
}

export function App() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />
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
          <Comparison />
          <NextSteps />
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
