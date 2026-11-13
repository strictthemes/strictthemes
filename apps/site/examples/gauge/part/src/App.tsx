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

/* ---------- Sample data ---------- */

const part = {
  number: "TVL-2047-RS",
  summary: "Deep groove ball bearing, 20 × 47 × 14 mm, two rubber seals",
  bore: 20,
  outside: 47,
  width: 14,
  stock: 1240,
  store: "Brigholt",
  leadDays: 10,
}

// Unit prices in pence, so totals never pick up a rounding error.
const priceBreaks = [
  { range: "1 to 49", min: 1, max: 49, pence: 294 },
  { range: "50 to 249", min: 50, max: 249, pence: 261 },
  { range: "250 to 999", min: 250, max: 999, pence: 228 },
  { range: "1,000 and over", min: 1000, max: 10000, pence: 197 },
]

const MIN_QUANTITY = 1
const MAX_QUANTITY = 10000

type SpecRow = {
  property: string
  symbol?: string
  value: string
  figure: boolean
  unit?: string
}

const specification: SpecRow[] = [
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
  { property: "Limiting speed", value: "13,000", figure: true, unit: "r/min" },
  { property: "Mass", value: "0.103", figure: true, unit: "kg" },
  {
    property: "Operating temperature",
    value: "−30 to +110",
    figure: true,
    unit: "°C",
  },
  { property: "Seals", value: "Two rubber seals, RS", figure: false },
  { property: "Cage", value: "Pressed steel", figure: false },
  { property: "Ring material", value: "Chrome steel, 100Cr6", figure: false },
  { property: "Grease", value: "Lithium, 20% fill", figure: false },
  { property: "Radial clearance", value: "CN, normal", figure: false },
  { property: "Precision class", value: "P0, normal", figure: false },
]

const documents = [
  { name: "Data sheet, TVL-2047-RS", detail: "PDF · Rev C · 0.84 MB" },
  { name: "3D model, TVL-2047-RS", detail: "STEP · Rev C · 1.62 MB" },
  { name: "Certificate of conformity, 2026", detail: "PDF · Rev A · 0.21 MB" },
]

const navLinks = [
  { label: "Catalogue", href: "/catalogue", current: true },
  { label: "Compare", href: "/compare", current: false },
  { label: "Downloads", href: "/downloads", current: false },
  { label: "Quote", href: "/quote", current: false },
]

/* ---------- Shared classes ---------- */

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const container = "mx-auto w-full max-w-[1280px] px-4"
const label = "font-mono text-label text-muted-foreground"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const textLink = cn(
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
  focusOutline
)
const navLinkCurrent = "text-foreground underline underline-offset-4"
const navLinkOther = "text-muted-foreground hover:text-foreground"
const buttonLook = "px-4 font-mono text-label"
const headCell = "px-4 font-mono text-label text-muted-foreground"
const bodyCell = "px-4 py-2"
const dimensionLabel = "font-mono text-label tabular-nums text-foreground"

/* ---------- Figures ---------- */

function formatCount(value: number) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function formatPounds(pence: number) {
  const pounds = Math.floor(pence / 100)
  const rest = String(pence % 100).padStart(2, "0")
  return `£${formatCount(pounds)}.${rest}`
}

function parseQuantity(text: string): number | null {
  const cleaned = text.trim().replace(/,/g, "")
  if (!/^\d+$/.test(cleaned)) return null
  const quantity = Number(cleaned)
  if (quantity < MIN_QUANTITY || quantity > MAX_QUANTITY) return null
  return quantity
}

function breakFor(quantity: number) {
  return priceBreaks.find(
    (step) => quantity >= step.min && quantity <= step.max
  )
}

/* ---------- Drawing ---------- */

const SCALE = 4

function Drawing() {
  const bodyHeight = part.outside * SCALE
  const bodyWidth = part.width * SCALE
  const boreHeight = part.bore * SCALE
  const boreInset = ((part.outside - part.bore) / 2) * SCALE

  return (
    <div
      aria-hidden="true"
      className="flex items-start justify-center gap-2 py-6"
    >
      <div className="flex items-center gap-2" style={{ height: bodyHeight }}>
        <span className={dimensionLabel}>d {part.bore}</span>
        <div
          className="w-2 border-y border-l border-foreground"
          style={{ height: boreHeight }}
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative border border-foreground"
          style={{ width: bodyWidth, height: bodyHeight }}
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
        <span className={dimensionLabel}>B {part.width}</span>
      </div>
      <div className="flex gap-2" style={{ height: bodyHeight }}>
        <div className="w-2 self-stretch border-y border-r border-foreground" />
        <span className={cn(dimensionLabel, "self-center")}>
          D {part.outside}
        </span>
      </div>
    </div>
  )
}

/* ---------- Page ---------- */

type Confirmation = { quantity: number; pence: number }

export function App() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [quantityText, setQuantityText] = React.useState("1")
  const [error, setError] = React.useState<{ text: string } | null>(null)
  const [confirmation, setConfirmation] = React.useState<Confirmation | null>(
    null
  )

  const menuButtonRef = React.useRef<HTMLButtonElement>(null)
  const quantityRef = React.useRef<HTMLInputElement>(null)

  const quantity = parseQuantity(quantityText)
  const applied = quantity === null ? undefined : breakFor(quantity)

  // The error line is on the page before focus moves to the field it names.
  React.useEffect(() => {
    if (error) quantityRef.current?.focus()
  }, [error])

  function handleMenuKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (quantityText.trim() === "") {
      setError({ text: "Enter a quantity." })
      setConfirmation(null)
      return
    }
    if (quantity === null || !applied) {
      setError({ text: "Enter a whole number from 1 to 10,000." })
      setConfirmation(null)
      return
    }
    setError(null)
    setConfirmation({ quantity, pence: applied.pence })
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <header className="border-b border-border bg-card">
        <div className={cn(container, "flex items-center gap-6 py-3")}>
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
                  <a
                    href={link.href}
                    aria-current={link.current ? "true" : undefined}
                    className={cn(
                      "font-mono text-label transition-colors duration-150",
                      link.current ? navLinkCurrent : navLinkOther,
                      focusOutline
                    )}
                  >
                    {link.label}
                  </a>
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
            className={cn(buttonLook, "ml-auto md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen((open) => !open)}
            onKeyDown={handleMenuKeyDown}
          >
            Menu
          </Button>
        </div>
        <nav
          id="main-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
          onKeyDown={handleMenuKeyDown}
        >
          <div className={container}>
            <ul className="py-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "true" : undefined}
                    className={cn(
                      "block py-2 font-mono text-label transition-colors duration-150",
                      link.current ? navLinkCurrent : navLinkOther,
                      focusOutline
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
        <div className={cn(container, "flex flex-col gap-12")}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <nav aria-label="Breadcrumb">
                  <ol className="flex flex-wrap items-center gap-2 font-mono text-label">
                    <li>
                      <a
                        href="/catalogue"
                        className={cn(
                          "text-muted-foreground underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                          focusOutline
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
                        href="/catalogue"
                        className={cn(
                          "text-muted-foreground underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                          focusOutline
                        )}
                      >
                        Deep groove
                      </a>
                    </li>
                    <li aria-hidden="true" className="text-muted-foreground">
                      /
                    </li>
                    <li aria-current="page" className="text-foreground">
                      {part.number}
                    </li>
                  </ol>
                </nav>
                <h1 className="font-mono text-h1">{part.number}</h1>
                <p className="text-body">{part.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/compare"
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    buttonLook
                  )}
                >
                  Compare
                </a>
                <a
                  href="/downloads"
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    buttonLook
                  )}
                >
                  Data sheet
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <section
                aria-labelledby="drawing-heading"
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:col-span-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 id="drawing-heading" className="text-h2">
                    Drawing
                  </h2>
                  <p className={smallFigure}>Dimensions in mm</p>
                </div>
                <figure className="flex flex-col gap-4">
                  <Drawing />
                  <figcaption className={smallFigure}>
                    Side view of {part.number}. Bore d {part.bore} mm, outside
                    diameter D {part.outside} mm, width B {part.width} mm. The
                    dashed lines show the bore.
                  </figcaption>
                </figure>
              </section>

              <section
                aria-labelledby="price-heading"
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:col-span-7"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 id="price-heading" className="text-h2">
                    Price and stock
                  </h2>
                </div>

                <dl>
                  <div className="flex items-baseline justify-between gap-3 py-2">
                    <dt className={label}>Stock</dt>
                    <dd className="flex flex-wrap items-center justify-end gap-2 text-right">
                      <span className="inline-flex items-center gap-2 whitespace-nowrap">
                        <span
                          aria-hidden="true"
                          className="size-2 shrink-0 rounded-full bg-success"
                        />
                        <span className="text-body text-foreground">
                          In stock
                        </span>
                      </span>
                      <span className={smallFigure}>
                        {formatCount(part.stock)} at {part.store}
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 border-t border-border py-2">
                    <dt className={label}>Dispatch</dt>
                    <dd className="text-right text-body">
                      Same working day if ordered by 15:00
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 border-t border-border py-2">
                    <dt className={label}>Lead time beyond stock</dt>
                    <dd className="text-right text-body">
                      {part.leadDays} working days
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-col gap-3">
                  <h3 className="font-sans text-body font-bold">
                    Price breaks
                  </h3>
                  <Table label="Price breaks" className="text-body">
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          className={cn(
                            headCell,
                            "text-right first:pl-0 last:pr-0"
                          )}
                        >
                          Quantity
                        </TableHead>
                        <TableHead
                          className={cn(
                            headCell,
                            "text-right first:pl-0 last:pr-0"
                          )}
                        >
                          Unit price (£)
                        </TableHead>
                        <TableHead
                          className={cn(headCell, "first:pl-0 last:pr-0")}
                        >
                          Your quantity
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {priceBreaks.map((step) => {
                        const marked = step === applied
                        return (
                          <TableRow key={step.min}>
                            <TableCell
                              className={cn(
                                bodyCell,
                                "text-right font-mono tabular-nums first:pl-0 last:pr-0",
                                marked && "font-bold"
                              )}
                            >
                              {step.range}
                            </TableCell>
                            <TableCell
                              className={cn(
                                bodyCell,
                                "text-right font-mono tabular-nums first:pl-0 last:pr-0",
                                marked && "font-bold"
                              )}
                            >
                              {(step.pence / 100).toFixed(2)}
                            </TableCell>
                            <TableCell
                              className={cn(
                                bodyCell,
                                "text-body first:pl-0 last:pr-0",
                                marked && "font-bold"
                              )}
                            >
                              {marked ? "Applies" : null}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <form
                    noValidate
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-end gap-3">
                        <div className="flex w-32 flex-col gap-3">
                          <label
                            htmlFor="quantity"
                            className={cn(label, "block")}
                          >
                            Quantity
                          </label>
                          <Input
                            ref={quantityRef}
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
                              error
                                ? "quantity-help quantity-error"
                                : "quantity-help"
                            }
                            className="px-2 text-right font-mono text-body tabular-nums md:text-body"
                          />
                        </div>
                        <Button type="submit" className={buttonLook}>
                          Add to quote
                        </Button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p id="quantity-help" className={smallFigure}>
                          {formatCount(part.stock)} in stock. Larger orders ship
                          in {part.leadDays} working days.
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
                            <span>{error.text}</span>
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className={label}>Line total</p>
                      <p className="font-heading text-h1 tabular-nums">
                        {quantity !== null && applied
                          ? formatPounds(quantity * applied.pence)
                          : "£0.00"}
                      </p>
                      <p className={smallFigure}>
                        {quantity !== null && applied
                          ? `${formatCount(quantity)} at ${formatPounds(applied.pence)} each`
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
                          Added to your quote:{" "}
                          {formatCount(confirmation.quantity)} at{" "}
                          {formatPounds(confirmation.pence)} each,{" "}
                          {formatPounds(
                            confirmation.quantity * confirmation.pence
                          )}
                          .{" "}
                          <a href="/quote" className={textLink}>
                            View quote
                          </a>
                        </span>
                      </p>
                    ) : null}
                  </div>
                </div>
              </section>
            </div>
          </div>

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
                      <TableHead className={headCell}>Property</TableHead>
                      <TableHead className={headCell}>Symbol</TableHead>
                      <TableHead className={cn(headCell, "text-right")}>
                        Value
                      </TableHead>
                      <TableHead className={headCell}>Unit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specification.map((row) => (
                      <TableRow key={row.property}>
                        <TableCell className={cn(bodyCell, "text-body")}>
                          {row.property}
                        </TableCell>
                        <TableCell className={cn(bodyCell, "font-mono")}>
                          {row.symbol}
                        </TableCell>
                        <TableCell
                          className={cn(
                            bodyCell,
                            "text-right",
                            row.figure ? "font-mono tabular-nums" : "text-body"
                          )}
                        >
                          {row.value}
                        </TableCell>
                        <TableCell className={cn(bodyCell, "font-mono")}>
                          {row.unit}
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
                    className={cn(textLink, "font-mono text-label")}
                  >
                    All documents
                  </a>
                </div>
                <ul>
                  {documents.map((item, index) => (
                    <li
                      key={item.name}
                      className={cn(
                        "flex flex-col items-start gap-1 px-4 py-3",
                        index > 0 && "border-t border-border"
                      )}
                    >
                      <a href="#" className={cn(textLink, "text-body")}>
                        {item.name}
                      </a>
                      <span className={smallFigure}>{item.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className={cn(container, "py-6")}>
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
