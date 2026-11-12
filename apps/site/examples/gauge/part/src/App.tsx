import { useEffect, useId, useRef, useState } from "react"
import type { FormEvent, KeyboardEvent } from "react"
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

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const PART = {
  number: "TVL-2047-RS",
  bore: 20, // d, mm
  outside: 47, // D, mm
  width: 14, // B, mm
  stock: 1240,
  store: "Brigholt",
}

// Drawing scale: pixels per millimetre.
const SCALE = 4

type PriceBreak = { min: number; max: number | null; pence: number }

const PRICE_BREAKS: PriceBreak[] = [
  { min: 1, max: 49, pence: 294 },
  { min: 50, max: 249, pence: 261 },
  { min: 250, max: 999, pence: 228 },
  { min: 1000, max: null, pence: 197 },
]

const MAX_QUANTITY = 10000

const NAV_LINKS = [
  { label: "Catalogue", href: "/catalogue", current: true },
  { label: "Compare", href: "/compare", current: false },
  { label: "Downloads", href: "/downloads", current: false },
  { label: "Quote", href: "/quote", current: false },
]

type SpecRow = {
  property: string
  symbol?: string
  value: string
  figure: boolean
  unit?: string
}

const SPEC_ROWS: SpecRow[] = [
  { property: "Bore diameter", symbol: "d", value: "20", figure: true, unit: "mm" },
  { property: "Outside diameter", symbol: "D", value: "47", figure: true, unit: "mm" },
  { property: "Width", symbol: "B", value: "14", figure: true, unit: "mm" },
  { property: "Dynamic load rating", symbol: "C", value: "13.40", figure: true, unit: "kN" },
  { property: "Static load rating", symbol: "C0", value: "6.55", figure: true, unit: "kN" },
  { property: "Limiting speed", value: "13,000", figure: true, unit: "r/min" },
  { property: "Mass", value: "0.103", figure: true, unit: "kg" },
  { property: "Operating temperature", value: "−30 to +110", figure: true, unit: "°C" },
  { property: "Seals", value: "Two rubber seals, RS", figure: false },
  { property: "Cage", value: "Pressed steel", figure: false },
  { property: "Ring material", value: "Chrome steel, 100Cr6", figure: false },
  { property: "Grease", value: "Lithium, 20% fill", figure: false },
  { property: "Radial clearance", value: "CN, normal", figure: false },
  { property: "Precision class", value: "P0, normal", figure: false },
]

const DOCUMENTS = [
  { title: "Data sheet, TVL-2047-RS", meta: "PDF · Rev C · 0.84 MB" },
  { title: "3D model, TVL-2047-RS", meta: "STEP · Rev C · 1.62 MB" },
  { title: "Certificate of conformity, 2026", meta: "PDF · Rev A · 0.21 MB" },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const TEXT_LINK = cn(
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
  FOCUS
)

const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const LABEL = "font-mono text-label text-muted-foreground"

function withCommas(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Pence to "1,137.80": integer arithmetic only.
function formatPence(pence: number): string {
  const pounds = Math.floor(pence / 100)
  const rest = String(pence % 100).padStart(2, "0")
  return `${withCommas(pounds)}.${rest}`
}

function formatRange(b: PriceBreak): string {
  return b.max === null
    ? `${withCommas(b.min)} and over`
    : `${withCommas(b.min)} to ${withCommas(b.max)}`
}

type Parsed =
  | { kind: "empty" }
  | { kind: "invalid" }
  | { kind: "valid"; quantity: number }

function parseQuantity(raw: string): Parsed {
  const cleaned = raw.trim().replace(/,/g, "")
  if (cleaned === "") return { kind: "empty" }
  if (!/^\d+$/.test(cleaned)) return { kind: "invalid" }
  const quantity = Number(cleaned)
  if (quantity < 1 || quantity > MAX_QUANTITY) return { kind: "invalid" }
  return { kind: "valid", quantity }
}

function breakFor(quantity: number): PriceBreak {
  return (
    PRICE_BREAKS.find(
      (b) => quantity >= b.min && (b.max === null || quantity <= b.max)
    ) ?? PRICE_BREAKS[0]
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function App() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <SiteHeader />
      <main className="flex-1 py-6">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-4">
          <div className="flex flex-col gap-6">
            <PageHeader />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <DrawingPanel />
              <PriceAndStockPanel />
            </div>
          </div>
          <SpecificationSection />
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

// 1. Header ------------------------------------------------------------------

function navLinkClass(current: boolean) {
  return cn(
    "font-mono text-label transition-colors duration-150",
    FOCUS,
    current
      ? "text-foreground underline underline-offset-4"
      : "text-muted-foreground hover:text-foreground"
  )
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuId = "mobile-menu"

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  return (
    <header className="border-b border-border bg-card">
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
                  aria-current={link.current ? "true" : undefined}
                  className={navLinkClass(link.current)}
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
          className="ml-auto px-4 font-mono text-label md:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
          onKeyDown={handleKeyDown}
        >
          Menu
        </Button>
      </div>
      <nav
        id={menuId}
        aria-label="Main"
        hidden={!menuOpen}
        className="border-t border-border md:hidden"
        onKeyDown={handleKeyDown}
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
  )
}

// 2. Page header -------------------------------------------------------------

function PageHeader() {
  const crumbLink = cn(
    "text-muted-foreground underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
    FOCUS
  )
  const buttonLink = cn(
    buttonVariants({ variant: "secondary" }),
    "px-4 font-mono text-label"
  )

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-label">
            <li>
              <a href="/catalogue" className={crumbLink}>
                Catalogue
              </a>
            </li>
            <li aria-hidden="true" className="text-muted-foreground">
              /
            </li>
            <li>
              <a href="/catalogue" className={crumbLink}>
                Deep groove
              </a>
            </li>
            <li aria-hidden="true" className="text-muted-foreground">
              /
            </li>
            <li aria-current="page" className="text-foreground">
              {PART.number}
            </li>
          </ol>
        </nav>
        <h1 className="font-mono text-h1">{PART.number}</h1>
        <p className="text-body">
          Deep groove ball bearing, {PART.bore} × {PART.outside} × {PART.width}{" "}
          mm, two rubber seals
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <a href="/compare" className={buttonLink}>
          Compare
        </a>
        <a href="/downloads" className={buttonLink}>
          Data sheet
        </a>
      </div>
    </div>
  )
}

// 3. Drawing -----------------------------------------------------------------

function DrawingPanel() {
  const bodyHeight = PART.outside * SCALE // D × 4
  const bodyWidth = PART.width * SCALE // B × 4
  const boreHeight = PART.bore * SCALE // d × 4
  const boreOffset = ((PART.outside - PART.bore) / 2) * SCALE // (D − d) / 2 × 4
  const dimLabel = "font-mono text-label tabular-nums text-foreground"

  return (
    <section
      aria-labelledby="drawing-heading"
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:col-span-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="drawing-heading" className="text-h2">
          Drawing
        </h2>
        <p className={SMALL_FIGURE}>Dimensions in mm</p>
      </div>
      <figure className="flex flex-col gap-4">
        <div
          aria-hidden="true"
          className="flex items-start justify-center gap-2 py-6"
        >
          {/* Bore dimension */}
          <div
            className="flex items-center gap-2"
            style={{ height: bodyHeight }}
          >
            <span className={dimLabel}>d {PART.bore}</span>
            <div
              className="w-2 border-y border-l border-foreground"
              style={{ height: boreHeight }}
            />
          </div>
          {/* The part, side view */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="relative border border-foreground"
              style={{ width: bodyWidth, height: bodyHeight }}
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
            <span className={dimLabel}>B {PART.width}</span>
          </div>
          {/* Outside dimension */}
          <div className="flex gap-2" style={{ height: bodyHeight }}>
            <div className="w-2 self-stretch border-y border-r border-foreground" />
            <span className={cn("self-center", dimLabel)}>
              D {PART.outside}
            </span>
          </div>
        </div>
        <figcaption className={SMALL_FIGURE}>
          Side view of {PART.number}. Bore d {PART.bore} mm, outside diameter D{" "}
          {PART.outside} mm, width B {PART.width} mm. The dashed lines show the
          bore.
        </figcaption>
      </figure>
    </section>
  )
}

// 4. Price and stock ---------------------------------------------------------

function PriceAndStockPanel() {
  const [raw, setRaw] = useState("1")
  const [error, setError] = useState<string | null>(null)
  const [errorNonce, setErrorNonce] = useState(0)
  const [confirmation, setConfirmation] = useState<{
    quantity: number
    unitPence: number
    totalPence: number
  } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fieldId = useId()
  const helperId = `${fieldId}-helper`
  const errorId = `${fieldId}-error`

  const parsed = parseQuantity(raw)
  const quantity = parsed.kind === "valid" ? parsed.quantity : null
  const applying = quantity === null ? null : breakFor(quantity)
  const totalPence =
    quantity !== null && applying ? quantity * applying.pence : 0

  // Move focus to the field once the error line is in the DOM.
  useEffect(() => {
    if (errorNonce > 0) inputRef.current?.focus()
  }, [errorNonce])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = parseQuantity(raw)
    if (result.kind !== "valid") {
      setError(
        result.kind === "empty"
          ? "Enter a quantity."
          : "Enter a whole number from 1 to 10,000."
      )
      setErrorNonce((n) => n + 1)
      return
    }
    setError(null)
    const unit = breakFor(result.quantity).pence
    setConfirmation({
      quantity: result.quantity,
      unitPence: unit,
      totalPence: result.quantity * unit,
    })
  }

  const edgeCell = "px-4 first:pl-0 last:pr-0"

  return (
    <section
      aria-labelledby="price-heading"
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:col-span-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="price-heading" className="text-h2">
          Price and stock
        </h2>
      </div>

      {/* Stock */}
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
              {withCommas(PART.stock)} at {PART.store}
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

      {/* Price breaks */}
      <div className="flex flex-col gap-3">
        <h3 className="font-sans text-body font-bold">Price breaks</h3>
        <Table label="Price breaks" className="text-body">
          <TableHeader>
            <TableRow>
              <TableHead className={cn(LABEL, edgeCell, "text-right")}>
                Quantity
              </TableHead>
              <TableHead className={cn(LABEL, edgeCell, "text-right")}>
                Unit price (£)
              </TableHead>
              <TableHead className={cn(LABEL, edgeCell)}>
                Your quantity
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PRICE_BREAKS.map((b) => {
              const marked = applying === b
              const cell = cn(edgeCell, "py-2", marked && "font-bold")
              return (
                <TableRow key={b.min}>
                  <TableCell
                    className={cn(cell, "text-right font-mono tabular-nums")}
                  >
                    {formatRange(b)}
                  </TableCell>
                  <TableCell
                    className={cn(cell, "text-right font-mono tabular-nums")}
                  >
                    {formatPence(b.pence)}
                  </TableCell>
                  <TableCell className={cn(cell, "text-body")}>
                    {marked ? "Applies" : null}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Add to quote */}
      <div>
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex w-32 flex-col gap-3">
                <label htmlFor={fieldId} className={cn("block", LABEL)}>
                  Quantity
                </label>
                <Input
                  ref={inputRef}
                  id={fieldId}
                  name="quantity"
                  inputMode="numeric"
                  autoComplete="off"
                  value={raw}
                  onChange={(event) => {
                    setRaw(event.target.value)
                    setError(null)
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${helperId} ${errorId}` : helperId}
                  className="text-right font-mono text-body tabular-nums md:text-body"
                />
              </div>
              <Button type="submit" className="px-4 font-mono text-label">
                Add to quote
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <p id={helperId} className={SMALL_FIGURE}>
                {withCommas(PART.stock)} in stock. Larger orders ship in 10
                working days.
              </p>
              {error ? (
                <p
                  id={errorId}
                  className="flex items-start gap-2 font-mono text-label text-destructive"
                >
                  <CircleAlert
                    aria-hidden="true"
                    className="size-4 shrink-0"
                    strokeWidth={1.5}
                  />
                  <span>{error}</span>
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className={LABEL}>Line total</p>
            <p className="font-heading text-h1 tabular-nums">
              £{formatPence(totalPence)}
            </p>
            <p className={SMALL_FIGURE}>
              {quantity !== null && applying
                ? `${withCommas(quantity)} at £${formatPence(applying.pence)} each`
                : "Enter a quantity to see the price."}
            </p>
          </div>
        </form>
        <div role="status">
          {confirmation ? (
            <p className="mt-3 flex items-start gap-2 text-body">
              <Check
                aria-hidden="true"
                className="size-4 shrink-0 text-success"
                strokeWidth={1.5}
              />
              <span>
                Added to your quote: {withCommas(confirmation.quantity)} at £
                {formatPence(confirmation.unitPence)} each, £
                {formatPence(confirmation.totalPence)}.{" "}
                <a href="/quote" className={TEXT_LINK}>
                  View quote
                </a>
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

// 5. Specification -----------------------------------------------------------

function SpecificationSection() {
  const head = cn(LABEL, "px-4")
  const cell = "px-4 py-2"

  return (
    <section
      aria-labelledby="specification-heading"
      className="flex flex-col gap-4"
    >
      <h2 id="specification-heading" className="text-h2">
        Specification
      </h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-8">
          <Table label="Specification" className="text-body">
            <TableHeader>
              <TableRow>
                <TableHead className={head}>Property</TableHead>
                <TableHead className={head}>Symbol</TableHead>
                <TableHead className={cn(head, "text-right")}>Value</TableHead>
                <TableHead className={head}>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SPEC_ROWS.map((row) => (
                <TableRow key={row.property}>
                  <TableCell className={cn(cell, "text-body")}>
                    {row.property}
                  </TableCell>
                  <TableCell className={cn(cell, "font-mono")}>
                    {row.symbol ?? null}
                  </TableCell>
                  <TableCell
                    className={cn(
                      cell,
                      "text-right",
                      row.figure ? "font-mono tabular-nums" : "text-body"
                    )}
                  >
                    {row.value}
                  </TableCell>
                  <TableCell className={cn(cell, "font-mono")}>
                    {row.unit ?? null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
            <h3 className="text-h2">Documents</h3>
            <a
              href="/downloads"
              className={cn(TEXT_LINK, "font-mono text-label")}
            >
              All documents
            </a>
          </div>
          <ul>
            {DOCUMENTS.map((doc, index) => (
              <li
                key={doc.title}
                className={cn(
                  "flex flex-col gap-1 px-4 py-3",
                  index > 0 && "border-t border-border"
                )}
              >
                <a href="#" className={cn(TEXT_LINK, "self-start text-body")}>
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

export default App
