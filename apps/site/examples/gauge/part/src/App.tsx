import * as React from "react"
import { Check, CircleAlert } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const TEXT_LINK = cn(
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
  FOCUS
)
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const LABEL = "font-mono text-label text-muted-foreground"
const PANEL = "rounded-xl border border-border bg-card p-4"
const PANEL_ROWS = "overflow-hidden rounded-xl border border-border bg-card"
const HEADING_ROW = "flex flex-wrap items-center justify-between gap-3"

const NAV_LINKS = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Compare", href: "/compare" },
  { label: "Downloads", href: "/downloads" },
  { label: "Quote", href: "/quote" },
]
const CURRENT_SECTION = "/catalogue"

const PART = {
  number: "TVL-2047-RS",
  boreMm: 20,
  outsideMm: 47,
  widthMm: 14,
  inStock: 1240,
}

// Drawing scale: pixels per millimetre.
const SCALE = 4

const MAX_QUANTITY = 10000

type PriceBreak = { min: number; max: number | null; pence: number }

const PRICE_BREAKS: PriceBreak[] = [
  { min: 1, max: 49, pence: 294 },
  { min: 50, max: 249, pence: 261 },
  { min: 250, max: 999, pence: 228 },
  { min: 1000, max: null, pence: 197 },
]

const SPECIFICATION: {
  property: string
  symbol: string
  value: string
  figure: boolean
  unit: string
}[] = [
  {
    property: "Bore diameter",
    symbol: "d",
    value: "20",
    figure: true,
    unit: "mm",
  },
  {
    property: "Outside diameter",
    symbol: "D",
    value: "47",
    figure: true,
    unit: "mm",
  },
  { property: "Width", symbol: "B", value: "14", figure: true, unit: "mm" },
  {
    property: "Dynamic load rating",
    symbol: "C",
    value: "13.40",
    figure: true,
    unit: "kN",
  },
  {
    property: "Static load rating",
    symbol: "C0",
    value: "6.55",
    figure: true,
    unit: "kN",
  },
  {
    property: "Limiting speed",
    symbol: "",
    value: "13,000",
    figure: true,
    unit: "r/min",
  },
  { property: "Mass", symbol: "", value: "0.103", figure: true, unit: "kg" },
  {
    property: "Operating temperature",
    symbol: "",
    value: "−30 to +110",
    figure: true,
    unit: "°C",
  },
  {
    property: "Seals",
    symbol: "",
    value: "Two rubber seals, RS",
    figure: false,
    unit: "",
  },
  {
    property: "Cage",
    symbol: "",
    value: "Pressed steel",
    figure: false,
    unit: "",
  },
  {
    property: "Ring material",
    symbol: "",
    value: "Chrome steel, 100Cr6",
    figure: false,
    unit: "",
  },
  {
    property: "Grease",
    symbol: "",
    value: "Lithium, 20% fill",
    figure: false,
    unit: "",
  },
  {
    property: "Radial clearance",
    symbol: "",
    value: "CN, normal",
    figure: false,
    unit: "",
  },
  {
    property: "Precision class",
    symbol: "",
    value: "P0, normal",
    figure: false,
    unit: "",
  },
]

const DOCUMENTS = [
  { title: "Data sheet, TVL-2047-RS", meta: "PDF · Rev C · 0.84 MB" },
  { title: "3D model, TVL-2047-RS", meta: "STEP · Rev C · 1.62 MB" },
  {
    title: "Certificate of conformity, 2026",
    meta: "PDF · Rev A · 0.21 MB",
  },
]

function formatCount(n: number) {
  return n.toLocaleString("en-GB")
}

// Pence to "1,137.80", without floating-point sums.
function formatPence(pence: number) {
  const pounds = Math.floor(pence / 100)
  const rest = String(pence % 100).padStart(2, "0")
  return `${formatCount(pounds)}.${rest}`
}

function formatRange(b: PriceBreak) {
  return b.max === null
    ? `${formatCount(b.min)} and over`
    : `${formatCount(b.min)} to ${formatCount(b.max)}`
}

type Parsed =
  { ok: true; quantity: number } | { ok: false; error: "empty" | "invalid" }

function parseQuantity(raw: string): Parsed {
  const trimmed = raw.trim()
  if (trimmed === "") return { ok: false, error: "empty" }
  const digits = trimmed.replace(/,/g, "")
  if (!/^\d+$/.test(digits)) return { ok: false, error: "invalid" }
  const quantity = Number(digits)
  if (quantity < 1 || quantity > MAX_QUANTITY) {
    return { ok: false, error: "invalid" }
  }
  return { ok: true, quantity }
}

function breakFor(quantity: number) {
  return PRICE_BREAKS.find(
    (b) => quantity >= b.min && (b.max === null || quantity <= b.max)
  )!
}

function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuButton = React.useRef<HTMLButtonElement>(null)

  function navLinkClass(href: string) {
    return cn(
      "font-mono text-label transition-colors duration-150",
      FOCUS,
      href === CURRENT_SECTION
        ? "text-foreground underline underline-offset-4"
        : "text-muted-foreground hover:text-foreground"
    )
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (menuOpen && event.key === "Escape") {
      setMenuOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <header className="border-b border-border bg-card" onKeyDown={onKeyDown}>
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
                  className={navLinkClass(link.href)}
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
          ref={menuButton}
          variant="secondary"
          className="ml-auto px-4 font-mono text-label md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-nav"
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

function PageHeader() {
  const crumbLink = cn(
    "text-muted-foreground underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
    FOCUS
  )
  const action = cn(
    buttonVariants({ variant: "secondary" }),
    "px-4 font-mono text-label"
  )
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-label">
            <li className="flex items-center gap-2">
              <a href="/catalogue" className={crumbLink}>
                Catalogue
              </a>
              <span aria-hidden="true" className="text-muted-foreground">
                /
              </span>
            </li>
            <li className="flex items-center gap-2">
              <a href="/catalogue" className={crumbLink}>
                Deep groove
              </a>
              <span aria-hidden="true" className="text-muted-foreground">
                /
              </span>
            </li>
            <li className="text-foreground" aria-current="page">
              {PART.number}
            </li>
          </ol>
        </nav>
        <h1 className="font-mono text-h1">{PART.number}</h1>
        <p className="text-body">
          Deep groove ball bearing, {PART.boreMm} × {PART.outsideMm} ×{" "}
          {PART.widthMm} mm, two rubber seals
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <a href="/compare" className={action}>
          Compare
        </a>
        <a href="/downloads" className={action}>
          Data sheet
        </a>
      </div>
    </div>
  )
}

function DrawingPanel() {
  const D = PART.outsideMm * SCALE
  const d = PART.boreMm * SCALE
  const B = PART.widthMm * SCALE
  // Offset inside the body's 1px border, so the line meets the bracket's end.
  const boreOffset = ((PART.outsideMm - PART.boreMm) / 2) * SCALE - 1
  const dimLabel = "font-mono text-label tabular-nums text-foreground"

  return (
    <div className={cn(PANEL, "flex flex-col gap-4 lg:col-span-5")}>
      <div className={HEADING_ROW}>
        <h2 className="text-h2">Drawing</h2>
        <p className={SMALL_FIGURE}>Dimensions in mm</p>
      </div>
      <figure className="flex flex-col gap-4">
        <div
          aria-hidden="true"
          className="flex items-start justify-center gap-2 py-6"
        >
          <div className="flex items-center gap-2" style={{ height: D }}>
            <span className={dimLabel}>d {PART.boreMm}</span>
            <div
              className="w-2 border-y border-l border-foreground"
              style={{ height: d }}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div
              className="relative border border-foreground"
              style={{ width: B, height: D }}
            >
              <div
                className="absolute inset-x-0 border-t border-dashed border-foreground"
                style={{ top: boreOffset }}
              />
              <div
                className="absolute inset-x-0 border-t border-dashed border-foreground"
                style={{ bottom: boreOffset }}
              />
            </div>
            <div className="h-2 self-stretch border-x border-b border-foreground" />
            <span className={dimLabel}>B {PART.widthMm}</span>
          </div>
          <div className="flex gap-2" style={{ height: D }}>
            <div className="w-2 self-stretch border-y border-r border-foreground" />
            <span className={cn(dimLabel, "self-center")}>
              D {PART.outsideMm}
            </span>
          </div>
        </div>
        <figcaption className={SMALL_FIGURE}>
          Side view of {PART.number}. Bore d {PART.boreMm} mm, outside diameter
          D {PART.outsideMm} mm, width B {PART.widthMm} mm. The dashed lines
          show the bore.
        </figcaption>
      </figure>
    </div>
  )
}

function PriceStockPanel() {
  const [quantityText, setQuantityText] = React.useState("1")
  const [error, setError] = React.useState<string | null>(null)
  const [errorKey, setErrorKey] = React.useState(0)
  const [confirmation, setConfirmation] = React.useState<{
    quantity: number
    pence: number
  } | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const parsed = parseQuantity(quantityText)
  const applies = parsed.ok ? breakFor(parsed.quantity) : null

  React.useEffect(() => {
    if (errorKey > 0) inputRef.current?.focus()
  }, [errorKey])

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!parsed.ok) {
      setError(
        parsed.error === "empty"
          ? "Enter a quantity."
          : `Enter a whole number from 1 to ${formatCount(MAX_QUANTITY)}.`
      )
      setErrorKey((k) => k + 1)
      setConfirmation(null)
      return
    }
    setError(null)
    setConfirmation({
      quantity: parsed.quantity,
      pence: breakFor(parsed.quantity).pence,
    })
  }

  const headClass = cn("px-4 first:pl-0 last:pr-0", LABEL)
  const cellClass = "px-4 py-2 first:pl-0 last:pr-0"

  return (
    <div className={cn(PANEL, "flex flex-col gap-4 lg:col-span-7")}>
      <div className={HEADING_ROW}>
        <h2 className="text-h2">Price and stock</h2>
      </div>

      <dl>
        <div className="flex items-baseline justify-between gap-3 py-2">
          <dt className={LABEL}>Stock</dt>
          <dd className="flex flex-wrap items-center justify-end gap-2 text-right">
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full bg-success"
              />
              <span className="text-body text-foreground">In stock</span>
            </span>
            <span className={SMALL_FIGURE}>
              {formatCount(PART.inStock)} at Brigholt
            </span>
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-t border-border py-2">
          <dt className={LABEL}>Dispatch</dt>
          <dd className="text-right text-body">
            Same working day if ordered by 15:00
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-t border-border py-2">
          <dt className={LABEL}>Lead time beyond stock</dt>
          <dd className="text-right text-body">10 working days</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3">
        <h3 className="font-sans text-body font-bold">Price breaks</h3>
        <Table label="Price breaks" className="text-body">
          <TableHeader>
            <TableRow>
              <TableHead className={cn(headClass, "text-right")}>
                Quantity
              </TableHead>
              <TableHead className={cn(headClass, "text-right")}>
                Unit price (£)
              </TableHead>
              <TableHead className={headClass}>Your quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PRICE_BREAKS.map((b) => {
              const marked = applies === b
              return (
                <TableRow key={b.min}>
                  <TableCell
                    className={cn(
                      cellClass,
                      "text-right font-mono tabular-nums",
                      marked && "font-bold"
                    )}
                  >
                    {formatRange(b)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      cellClass,
                      "text-right font-mono tabular-nums",
                      marked && "font-bold"
                    )}
                  >
                    {formatPence(b.pence)}
                  </TableCell>
                  <TableCell className={cn(cellClass, marked && "font-bold")}>
                    {marked ? "Applies" : null}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div>
        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex w-32 flex-col gap-3">
                <label htmlFor="quantity" className={cn("block", LABEL)}>
                  Quantity
                </label>
                <Input
                  ref={inputRef}
                  id="quantity"
                  name="quantity"
                  inputMode="numeric"
                  autoComplete="off"
                  value={quantityText}
                  onChange={(event) => {
                    setQuantityText(event.target.value)
                    setError(null)
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={
                    error ? "quantity-help quantity-error" : "quantity-help"
                  }
                  className="px-2 text-right font-mono text-body tabular-nums md:text-body"
                />
              </div>
              <Button type="submit" className="px-4 font-mono text-label">
                Add to quote
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <p id="quantity-help" className={SMALL_FIGURE}>
                {formatCount(PART.inStock)} in stock. Larger orders ship in 10
                working days.
              </p>
              {error ? (
                <p
                  id="quantity-error"
                  className="flex items-start gap-2 font-mono text-label text-destructive"
                >
                  <CircleAlert
                    aria-hidden="true"
                    className="size-4 shrink-0"
                    strokeWidth={1.5}
                  />
                  {error}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className={LABEL}>Line total</p>
            <p className="font-heading text-h1 tabular-nums">
              £
              {parsed.ok
                ? formatPence(parsed.quantity * applies!.pence)
                : "0.00"}
            </p>
            <p className={SMALL_FIGURE}>
              {parsed.ok
                ? `${formatCount(parsed.quantity)} at £${formatPence(applies!.pence)} each`
                : "Enter a quantity to see the price."}
            </p>
          </div>
        </form>
        <div role="status">
          {confirmation ? (
            <p className="mt-3 flex items-start gap-2 text-body">
              <span className="flex h-lh shrink-0 items-center">
                <Check
                  aria-hidden="true"
                  className="size-4 text-success"
                  strokeWidth={1.5}
                />
              </span>
              <span>
                Added to your quote: {formatCount(confirmation.quantity)} at £
                {formatPence(confirmation.pence)} each, £
                {formatPence(confirmation.quantity * confirmation.pence)}.{" "}
                <a href="/quote" className={TEXT_LINK}>
                  View quote
                </a>
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Specification() {
  const headClass = cn("px-4", LABEL)
  const cellClass = "px-4 py-2"
  return (
    <section aria-labelledby="specification" className="flex flex-col gap-4">
      <h2 id="specification" className="text-h2">
        Specification
      </h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className={cn(PANEL_ROWS, "lg:col-span-8")}>
          <Table label="Specification table" className="text-body">
            <TableHeader>
              <TableRow>
                <TableHead className={headClass}>Property</TableHead>
                <TableHead className={headClass}>Symbol</TableHead>
                <TableHead className={cn(headClass, "text-right")}>
                  Value
                </TableHead>
                <TableHead className={headClass}>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SPECIFICATION.map((row) => (
                <TableRow key={row.property}>
                  <TableCell className={cn(cellClass, "text-body")}>
                    {row.property}
                  </TableCell>
                  <TableCell className={cn(cellClass, "font-mono")}>
                    {row.symbol}
                  </TableCell>
                  <TableCell
                    className={cn(
                      cellClass,
                      "text-right",
                      row.figure ? "font-mono tabular-nums" : "text-body"
                    )}
                  >
                    {row.value}
                  </TableCell>
                  <TableCell className={cn(cellClass, "font-mono")}>
                    {row.unit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className={cn(PANEL_ROWS, "lg:col-span-4")}>
          <div className={cn(HEADING_ROW, "border-b border-border px-4 py-3")}>
            <h3 className="text-h2">Documents</h3>
            <a
              href="/downloads"
              className={cn(TEXT_LINK, "font-mono text-label")}
            >
              All documents
            </a>
          </div>
          <ul>
            {DOCUMENTS.map((doc, i) => (
              <li
                key={doc.title}
                className={cn(
                  "flex flex-col gap-1 px-4 py-3",
                  i > 0 && "border-t border-border"
                )}
              >
                <a href="#" className={cn(TEXT_LINK, "text-body")}>
                  {doc.title}
                </a>
                <p className={SMALL_FIGURE}>{doc.meta}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function App() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />
      <main className="flex-1 py-6">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-4">
          <div className="flex flex-col gap-6">
            <PageHeader />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <DrawingPanel />
              <PriceStockPanel />
            </div>
          </div>
          <Specification />
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
