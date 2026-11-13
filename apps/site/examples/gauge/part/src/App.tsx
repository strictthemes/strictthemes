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
const ROWS_PANEL = "overflow-hidden rounded-xl border border-border bg-card"
const CONTAINER = "mx-auto w-full max-w-[1280px] px-4"
const BUTTON = "px-4 font-mono text-label"

const NAV_LINKS = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Compare", href: "/compare" },
  { label: "Downloads", href: "/downloads" },
  { label: "Quote", href: "/quote" },
]
const CURRENT_SECTION = "/catalogue"

const PART = {
  number: "TVL-2047-RS",
  // Dimensions in millimetres.
  bore: 20,
  outside: 47,
  width: 14,
  stock: 1240,
  store: "Brigholt",
  leadDays: 10,
}

// Drawing scale: pixels per millimetre.
const SCALE = 4

// Unit prices in pence, per bearing.
const PRICE_BREAKS = [
  { min: 1, max: 49, pence: 294 },
  { min: 50, max: 249, pence: 261 },
  { min: 250, max: 999, pence: 228 },
  { min: 1000, max: null, pence: 197 },
] as const

const MAX_QUANTITY = 10000

type SpecRow = {
  property: string
  symbol?: string
  value: string
  figure: boolean
  unit?: string
}

const SPEC: SpecRow[] = [
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

function formatCount(n: number) {
  return n.toLocaleString("en-GB")
}

function formatPence(pence: number) {
  const pounds = Math.floor(pence / 100)
  const rest = String(pence % 100).padStart(2, "0")
  return `${pounds.toLocaleString("en-GB")}.${rest}`
}

function rangeLabel(min: number, max: number | null) {
  return max === null
    ? `${formatCount(min)} and over`
    : `${formatCount(min)} to ${formatCount(max)}`
}

type Parsed =
  | { kind: "empty" }
  | { kind: "invalid" }
  | { kind: "valid"; quantity: number }

function parseQuantity(raw: string): Parsed {
  const trimmed = raw.trim()
  if (trimmed === "") return { kind: "empty" }
  const digits = trimmed.replace(/,/g, "")
  if (!/^\d+$/.test(digits)) return { kind: "invalid" }
  const quantity = Number(digits)
  if (quantity < 1 || quantity > MAX_QUANTITY) return { kind: "invalid" }
  return { kind: "valid", quantity }
}

function breakFor(quantity: number) {
  return PRICE_BREAKS.find(
    (b) => quantity >= b.min && (b.max === null || quantity <= b.max)
  )!
}

function Header() {
  const [open, setOpen] = React.useState(false)
  const menuButton = React.useRef<HTMLButtonElement>(null)

  function onKeyDown(event: React.KeyboardEvent) {
    if (!open || event.key !== "Escape") return
    setOpen(false)
    menuButton.current?.focus()
  }

  function navLink(link: (typeof NAV_LINKS)[number], block = false) {
    const current = link.href === CURRENT_SECTION
    return (
      <a
        href={link.href}
        aria-current={current ? "true" : undefined}
        className={cn(
          "font-mono text-label transition-colors duration-150",
          FOCUS,
          block && "block py-2",
          current
            ? "text-foreground underline underline-offset-4"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {link.label}
      </a>
    )
  }

  return (
    <header className="border-b border-border bg-card" onKeyDown={onKeyDown}>
      <div className={cn(CONTAINER, "flex items-center gap-6 py-3")}>
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
              <li key={link.href}>{navLink(link)}</li>
            ))}
          </ul>
        </nav>
        <p className={cn(SMALL_FIGURE, "ml-auto hidden md:block")}>
          Sales 01632 960 418
        </p>
        <Button
          ref={menuButton}
          variant="secondary"
          className={cn(BUTTON, "ml-auto md:hidden")}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <div className={CONTAINER}>
          <ul className="py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>{navLink(link, true)}</li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function PageHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-label">
            {[
              { label: "Catalogue", href: "/catalogue" },
              { label: "Deep groove", href: "/catalogue" },
            ].map((step) => (
              <li key={step.label} className="flex items-center gap-2">
                <a
                  href={step.href}
                  className={cn(
                    "text-muted-foreground underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                    FOCUS
                  )}
                >
                  {step.label}
                </a>
                <span aria-hidden="true" className="text-muted-foreground">
                  /
                </span>
              </li>
            ))}
            <li>
              <span aria-current="page" className="text-foreground">
                {PART.number}
              </span>
            </li>
          </ol>
        </nav>
        <h1 className="font-mono text-h1">{PART.number}</h1>
        <p className="max-w-lg text-body text-foreground">
          Deep groove ball bearing, {PART.bore} × {PART.outside} ×{" "}
          {PART.width} mm, two rubber seals
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href="/compare"
          className={cn(buttonVariants({ variant: "secondary" }), BUTTON)}
        >
          Compare
        </a>
        <a
          href="/downloads"
          className={cn(buttonVariants({ variant: "secondary" }), BUTTON)}
        >
          Data sheet
        </a>
      </div>
    </div>
  )
}

function Drawing() {
  const height = PART.outside * SCALE
  const boreHeight = PART.bore * SCALE
  const width = PART.width * SCALE
  const boreInset = ((PART.outside - PART.bore) / 2) * SCALE
  const dimLabel = "font-mono text-label tabular-nums text-foreground"

  return (
    <div className={cn(PANEL, "flex flex-col gap-4 lg:col-span-5")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-h2">Drawing</h2>
        <p className={SMALL_FIGURE}>Dimensions in mm</p>
      </div>
      <figure className="flex flex-col gap-4">
        <div
          aria-hidden="true"
          className="flex items-start justify-center gap-2 py-6"
        >
          <div className="flex items-center gap-2" style={{ height }}>
            <span className={dimLabel}>d {PART.bore}</span>
            <div
              className="w-2 border-y border-l border-foreground"
              style={{ height: boreHeight }}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div
              className="relative border border-foreground"
              style={{ width, height }}
            >
              <div
                className="absolute inset-x-0 border-t border-dashed border-foreground"
                style={{ top: boreInset }}
              />
              <div
                className="absolute inset-x-0 border-t border-dashed border-foreground"
                style={{ bottom: boreInset }}
              />
            </div>
            <div className="h-2 self-stretch border-x border-b border-foreground" />
            <span className={dimLabel}>B {PART.width}</span>
          </div>
          <div className="flex gap-2" style={{ height }}>
            <div className="w-2 self-stretch border-y border-r border-foreground" />
            <span className={cn(dimLabel, "self-center")}>
              D {PART.outside}
            </span>
          </div>
        </div>
        <figcaption className={SMALL_FIGURE}>
          Side view of {PART.number}. Bore d {PART.bore} mm, outside diameter
          D {PART.outside} mm, width B {PART.width} mm. The dashed lines show
          the bore.
        </figcaption>
      </figure>
    </div>
  )
}

function PriceAndStock() {
  const [value, setValue] = React.useState("1")
  const [error, setError] = React.useState<string | null>(null)
  const [focusTick, setFocusTick] = React.useState(0)
  const [confirmation, setConfirmation] = React.useState<{
    quantity: number
    pence: number
  } | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (focusTick > 0) inputRef.current?.focus()
  }, [focusTick])

  const parsed = parseQuantity(value)
  const quantity = parsed.kind === "valid" ? parsed.quantity : null
  const applies = quantity === null ? null : breakFor(quantity)
  const total = quantity !== null && applies ? quantity * applies.pence : 0

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = parseQuantity(value)
    if (result.kind !== "valid") {
      setError(
        result.kind === "empty"
          ? "Enter a quantity."
          : "Enter a whole number from 1 to 10,000."
      )
      setConfirmation(null)
      setFocusTick((t) => t + 1)
      return
    }
    setError(null)
    setConfirmation({
      quantity: result.quantity,
      pence: breakFor(result.quantity).pence,
    })
  }

  const cellEdge = "px-4 first:pl-0 last:pr-0"

  return (
    <div className={cn(PANEL, "flex flex-col gap-4 lg:col-span-7")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-h2">Price and stock</h2>
      </div>

      <dl>
        <div className="flex items-baseline justify-between gap-3 py-2">
          <dt className={LABEL}>Stock</dt>
          <dd className="text-right">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full bg-success"
                />
                <span className="text-body text-foreground">In stock</span>
              </span>
              <span className={SMALL_FIGURE}>
                {formatCount(PART.stock)} at {PART.store}
              </span>
            </div>
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
          <dd className="text-right text-body">
            {PART.leadDays} working days
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3">
        <h3 className="font-sans text-body font-bold">Price breaks</h3>
        <Table label="Price breaks" className="text-body">
          <TableHeader>
            <TableRow>
              <TableHead className={cn(cellEdge, LABEL, "text-right")}>
                Quantity
              </TableHead>
              <TableHead className={cn(cellEdge, LABEL, "text-right")}>
                Unit price (£)
              </TableHead>
              <TableHead className={cn(cellEdge, LABEL)}>
                Your quantity
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PRICE_BREAKS.map((b) => {
              const on = applies === b
              return (
                <TableRow key={b.min}>
                  <TableCell
                    className={cn(
                      cellEdge,
                      "py-2 text-right font-mono tabular-nums",
                      on && "font-bold"
                    )}
                  >
                    {rangeLabel(b.min, b.max)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      cellEdge,
                      "py-2 text-right font-mono tabular-nums",
                      on && "font-bold"
                    )}
                  >
                    {formatPence(b.pence)}
                  </TableCell>
                  <TableCell className={cn(cellEdge, "py-2", on && "font-bold")}>
                    {on ? "Applies" : null}
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
                <label htmlFor="quantity" className={cn(LABEL, "block")}>
                  Quantity
                </label>
                <Input
                  ref={inputRef}
                  id="quantity"
                  name="quantity"
                  inputMode="numeric"
                  autoComplete="off"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value)
                    setError(null)
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={
                    error ? "quantity-help quantity-error" : "quantity-help"
                  }
                  className="px-2 text-right font-mono text-body tabular-nums md:text-body"
                />
              </div>
              <Button type="submit" className={BUTTON}>
                Add to quote
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <p id="quantity-help" className={SMALL_FIGURE}>
                {formatCount(PART.stock)} in stock. Larger orders ship in{" "}
                {PART.leadDays} working days.
              </p>
              {error ? (
                <p
                  id="quantity-error"
                  className="flex items-start gap-2 font-mono text-label text-destructive"
                >
                  <CircleAlert
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4 shrink-0"
                  />
                  <span>{error}</span>
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className={LABEL}>Line total</p>
            <p className="font-heading text-h1 tabular-nums text-foreground">
              £{formatPence(total)}
            </p>
            <p className={SMALL_FIGURE}>
              {quantity !== null && applies
                ? `${formatCount(quantity)} at £${formatPence(applies.pence)} each`
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
                  strokeWidth={1.5}
                  className="size-4 text-success"
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
  const head = cn("px-4", LABEL)
  const cell = "px-4 py-2"

  return (
    <section aria-labelledby="specification" className="flex flex-col gap-4">
      <h2 id="specification" className="text-h2">
        Specification
      </h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className={cn(ROWS_PANEL, "lg:col-span-8")}>
          <Table label="Specification table" className="text-body">
            <TableHeader>
              <TableRow>
                <TableHead className={head}>Property</TableHead>
                <TableHead className={head}>Symbol</TableHead>
                <TableHead className={cn(head, "text-right")}>Value</TableHead>
                <TableHead className={head}>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SPEC.map((row) => (
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

        <div className={cn(ROWS_PANEL, "lg:col-span-4")}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
            <h3 className="text-h2">Documents</h3>
            <a href="/downloads" className={cn(TEXT_LINK, "font-mono text-label")}>
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

export function App() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />
      <main className="flex-1 py-6">
        <div className={cn(CONTAINER, "flex flex-col gap-12")}>
          <div className="flex flex-col gap-6">
            <PageHeader />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <Drawing />
              <PriceAndStock />
            </div>
          </div>
          <Specification />
        </div>
      </main>
      <footer className="border-t border-border">
        <div className={cn(CONTAINER, "py-6")}>
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
