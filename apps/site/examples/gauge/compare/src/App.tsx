import { useId, useRef, useState, type KeyboardEvent } from "react"

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

const CURRENT = "/compare"

type Part = {
  number: string
  href: string
  seals: string
  isNew?: boolean
}

const parts: Part[] = [
  { number: "TVL-2047-RS", href: "/part", seals: "Rubber seals" },
  { number: "TVL-2047-ZZ", href: "#", seals: "Metal shields" },
  { number: "TVL-2552-RS", href: "#", seals: "Rubber seals", isNew: true },
]

type StockState = "In stock" | "Low stock" | "Made to order" | "Discontinued"

type Row =
  | {
      property: string
      kind: "figure" | "phrase"
      values: [string, string, string]
    }
  | {
      property: string
      kind: "stock"
      values: [StockState, StockState, StockState]
    }

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
  {
    property: "Cage",
    kind: "phrase",
    values: ["Pressed steel", "Pressed steel", "Pressed steel"],
  },
  {
    property: "Ring material",
    kind: "phrase",
    values: [
      "Chrome steel, 100Cr6",
      "Chrome steel, 100Cr6",
      "Chrome steel, 100Cr6",
    ],
  },
  {
    property: "Grease",
    kind: "phrase",
    values: ["Lithium, 20% fill", "Lithium, 20% fill", "Lithium, 20% fill"],
  },
  {
    property: "Radial clearance",
    kind: "phrase",
    values: ["CN, normal", "CN, normal", "CN, normal"],
  },
  {
    property: "Precision class",
    kind: "phrase",
    values: ["P0, normal", "P0, normal", "P0, normal"],
  },
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

function rowDiffers(row: Row) {
  const [first, ...rest] = row.values
  return rest.some((value) => value !== first)
}

const dotClass: Record<StockState, string> = {
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
        className={cn("size-2 shrink-0 rounded-full", dotClass[state])}
      />
      <span className={cn("text-body text-foreground", bold && "font-bold")}>
        {state}
      </span>
    </span>
  )
}

function countText(differing: number, total: number, onlyDiffering: boolean) {
  if (onlyDiffering) {
    return differing === 1
      ? "Showing the 1 row that differs"
      : `Showing the ${differing} rows that differ`
  }
  return `${differing} of ${total} ${total === 1 ? "row" : "rows"} ${
    differing === 1 ? "differs" : "differ"
  }`
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  function closeOnEscape(event: KeyboardEvent) {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false)
      menuButton.current?.focus()
    }
  }

  function navLinkClass(href: string) {
    return cn(
      "font-mono text-label transition-colors duration-150",
      focusOutline,
      href === CURRENT
        ? "text-foreground underline underline-offset-4"
        : "text-muted-foreground hover:text-foreground"
    )
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex w-full max-w-[1280px] items-center gap-6 px-4 py-3">
        <a
          href="/catalogue"
          className={cn(
            "font-heading text-h2 text-foreground transition-colors duration-150",
            focusOutline
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
                  aria-current={link.href === CURRENT ? "page" : undefined}
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
          ref={menuButton}
          variant="secondary"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
          onKeyDown={closeOnEscape}
          className="ml-auto px-4 font-mono text-label md:hidden"
        >
          Menu
        </Button>
      </div>
      <nav
        id={menuId}
        aria-label="Main"
        hidden={!menuOpen}
        onKeyDown={closeOnEscape}
        className="border-t border-border md:hidden"
      >
        <div className="mx-auto w-full max-w-[1280px] px-4">
          <ul className="py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.href === CURRENT ? "page" : undefined}
                  className={cn("block py-2", navLinkClass(link.href))}
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
  const checkboxLabelId = useId()

  const marked = rows.map((row) => ({ row, differs: rowDiffers(row) }))
  const differingCount = marked.filter((item) => item.differs).length
  const shown = onlyDiffering ? marked.filter((item) => item.differs) : marked

  return (
    <section
      aria-labelledby="comparison-heading"
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h2 id="comparison-heading" className="text-h2">
          Comparison
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <p aria-live="polite" className={smallFigure}>
            {countText(differingCount, rows.length, onlyDiffering)}
          </p>
          <label className="flex items-center gap-2 text-body text-foreground">
            <Checkbox
              className="rounded-sm"
              aria-labelledby={checkboxLabelId}
              checked={onlyDiffering}
              onCheckedChange={(checked) => setOnlyDiffering(checked)}
            />
            <span id={checkboxLabelId}>Show only rows that differ</span>
          </label>
        </div>
      </div>

      <Table label="Comparison of three parts" className="min-w-3xl text-body">
        <TableHeader>
          <TableRow>
            <TableHead
              scope="col"
              className="px-4 font-mono text-label text-muted-foreground"
            >
              Property
            </TableHead>
            {parts.map((part) => (
              <TableHead
                key={part.number}
                scope="col"
                className="h-auto px-4 py-2 text-right font-mono text-label text-muted-foreground"
              >
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <a
                      href={part.href}
                      className={cn("font-mono text-body", textLink)}
                    >
                      {part.number}
                    </a>
                    {part.isNew && (
                      <Badge
                        variant="outline"
                        className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"
                      >
                        New
                      </Badge>
                    )}
                  </div>
                  <span className={smallFigure}>{part.seals}</span>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.map(({ row, differs }) => (
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
                ? row.values.map((value, index) => (
                    <TableCell
                      key={parts[index].number}
                      className={cn(
                        "px-4 py-2 text-right",
                        differs && "font-bold"
                      )}
                    >
                      <StockStateMark state={value} bold={differs} />
                    </TableCell>
                  ))
                : row.values.map((value, index) => (
                    <TableCell
                      key={parts[index].number}
                      className={cn(
                        "px-4 py-2 text-right text-foreground",
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
          ))}
        </TableBody>
      </Table>

      <div className="border-t border-border px-4 py-3">
        <p className={smallFigure}>
          Load ratings are calculated to ISO 281 and ISO 76. Limiting speeds are
          for grease lubrication. Prices exclude VAT.
        </p>
      </div>
    </section>
  )
}

function NextStepPanel({
  id,
  title,
  body,
  linkLabel,
  href,
}: {
  id: string
  title: string
  body: string
  linkLabel: string
  href: string
}) {
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:col-span-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={id} className="text-h2">
          {title}
        </h2>
      </div>
      <p className="max-w-lg text-body text-foreground">{body}</p>
      <p>
        <a href={href} className={textLink}>
          {linkLabel}
        </a>
      </p>
    </section>
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

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <NextStepPanel
              id="choose-heading"
              title="Not sure which to choose?"
              body="Shields let a bearing run faster and warmer; seals keep out more dirt and water. For a pump shaft near water, choose the rubber seals."
              linkLabel="Ask an engineer"
              href="#"
            />
            <NextStepPanel
              id="files-heading"
              title="Need the files?"
              body="Data sheets, 3D models and certificates for the whole TVL range are on one page."
              linkLabel="Range documents"
              href="/downloads"
            />
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
