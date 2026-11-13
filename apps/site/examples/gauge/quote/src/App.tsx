import * as React from "react"
import { CircleAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// The sample's today: a fixed date, never the device clock.
const TODAY = new Date(2026, 10, 12)
const EARLIEST_DELIVERY = new Date(2026, 10, 16)

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const FOCUS_CODE =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const TEXT_LINK = cn(
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
  FOCUS
)
const LABEL = "font-mono text-label text-muted-foreground"
const SMALL = "font-mono text-label tabular-nums text-muted-foreground"
const BUTTON = "px-4 font-mono text-label"
const HEAD = "px-4 font-mono text-label text-muted-foreground"
const CELL = "px-4 py-2"

const NAV = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Compare", href: "/compare" },
  { label: "Downloads", href: "/downloads" },
  { label: "Quote", href: "/quote" },
]
const CURRENT = "/quote"

type Line = {
  part: string
  description: string
  href: string
  // Price per bearing in pence for 1–49, 50–249, 250–999 and 1,000 and over.
  breaks: [number, number, number, number]
  quantity: string
}

const INITIAL_LINES: Line[] = [
  {
    part: "TVL-2047-RS",
    description: "Deep groove ball bearing, 20 × 47 × 14 mm, rubber seals",
    href: "/part",
    breaks: [294, 261, 228, 197],
    quantity: "250",
  },
  {
    part: "TVL-2552-RS",
    description: "Deep groove ball bearing, 25 × 52 × 15 mm, rubber seals",
    href: "#",
    breaks: [346, 307, 268, 232],
    quantity: "100",
  },
  {
    part: "TVL-3572-ZZ",
    description: "Deep groove ball bearing, 35 × 72 × 17 mm, metal shields",
    href: "#",
    breaks: [652, 579, 505, 437],
    quantity: "40",
  },
]

const DELIVERY_ITEMS = [
  { value: "standard", label: "Standard, 3 to 5 working days" },
  { value: "next-day", label: "Next working day" },
  { value: "collect", label: "Collect from Brigholt" },
]

type FieldName =
  | "company"
  | "name"
  | "email"
  | "phone"
  | "address"
  | "town"
  | "postcode"
  | "requiredBy"

type Fields = Record<Exclude<FieldName, "requiredBy">, string>

const FIELD_IDS: Record<FieldName, string> = {
  company: "company",
  name: "name",
  email: "email",
  phone: "phone",
  address: "address",
  town: "town",
  postcode: "postcode",
  requiredBy: "required-by",
}

function parseQuantity(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, "")
  if (!/^\d+$/.test(cleaned)) return null
  const n = Number(cleaned)
  return n >= 1 && n <= 10000 ? n : null
}

function unitPence(line: Line, qty: number | null): number {
  if (qty === null || qty < 50) return line.breaks[0]
  if (qty < 250) return line.breaks[1]
  if (qty < 1000) return line.breaks[2]
  return line.breaks[3]
}

function linePence(line: Line): number {
  const qty = parseQuantity(line.quantity)
  return qty === null ? 0 : qty * unitPence(line, qty)
}

function formatPence(pence: number): string {
  const pounds = Math.floor(pence / 100)
  const rest = String(pence % 100).padStart(2, "0")
  return `${pounds.toLocaleString("en-GB")}.${rest}`
}

function quantityId(part: string) {
  return `qty-${part}`
}

function lineCount(n: number) {
  return `${n} ${n === 1 ? "line" : "lines"}`
}

function ErrorLine({
  id,
  className,
  children,
}: {
  id: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <p
      id={id}
      className={cn(
        "flex items-start gap-2 font-mono text-label text-destructive",
        className
      )}
    >
      <CircleAlert
        className="size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span>{children}</span>
    </p>
  )
}

type Sent = { lines: number; subtotal: number; email: string }

export function App() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuButtonRef = React.useRef<HTMLButtonElement>(null)

  const [lines, setLines] = React.useState<Line[]>(INITIAL_LINES)
  const [fields, setFields] = React.useState<Fields>({
    company: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    town: "",
    postcode: "",
  })
  const [delivery, setDelivery] = React.useState("standard")
  const [requiredBy, setRequiredBy] = React.useState<Date | undefined>()
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [focusRequest, setFocusRequest] = React.useState<{
    id: string
    n: number
  } | null>(null)
  const [sent, setSent] = React.useState<Sent | null>(null)
  const confirmationRef = React.useRef<HTMLHeadingElement>(null)

  const subtotal = lines.reduce((sum, line) => sum + linePence(line), 0)

  // Focus moves only once the error lines (or the next line) are rendered.
  React.useEffect(() => {
    if (focusRequest) document.getElementById(focusRequest.id)?.focus()
  }, [focusRequest])

  React.useEffect(() => {
    if (sent) confirmationRef.current?.focus()
  }, [sent])

  function requestFocus(id: string) {
    setFocusRequest((prev) => ({ id, n: (prev?.n ?? 0) + 1 }))
  }

  function clearError(key: string) {
    setErrors((prev) => {
      if (!(key in prev)) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function setQuantity(part: string, value: string) {
    setLines((prev) =>
      prev.map((line) =>
        line.part === part ? { ...line, quantity: value } : line
      )
    )
    clearError(quantityId(part))
  }

  function removeLine(index: number) {
    const removed = lines[index]
    const next = lines.filter((_, i) => i !== index)
    const target = next[Math.min(index, next.length - 1)]
    setLines(next)
    clearError(quantityId(removed.part))
    if (target) {
      requestFocus(quantityId(target.part))
    }
  }

  function setField(name: keyof Fields, value: string) {
    setFields((prev) => ({ ...prev, [name]: value }))
    clearError(name)
  }

  function validate(): Record<string, string> {
    const e: Record<string, string> = {}
    for (const line of lines) {
      if (parseQuantity(line.quantity) === null) {
        e[quantityId(line.part)] = "Enter a whole number from 1 to 10,000."
      }
    }
    const f = {
      company: fields.company.trim(),
      name: fields.name.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      address: fields.address.trim(),
      town: fields.town.trim(),
      postcode: fields.postcode.trim().toUpperCase(),
    }
    if (!f.company) e.company = "Enter your company's name."
    if (!f.name) e.name = "Enter your name."
    if (!f.email) e.email = "Enter your email address."
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email))
      e.email = "Enter an email address such as buyer@pellam.example."
    if (f.phone && !/^\+?\d{10,15}$/.test(f.phone.replace(/\s/g, "")))
      e.phone = "Enter a phone number of 10 to 15 digits, or leave it empty."
    if (!f.address) e.address = "Enter the delivery address."
    if (!f.town) e.town = "Enter the town."
    if (!/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(f.postcode))
      e.postcode = "Enter a postcode such as AC7 1RT."
    if (!requiredBy) e.requiredBy = "Enter a date."
    else if (requiredBy < EARLIEST_DELIVERY)
      e.requiredBy =
        "Choose 16 November 2026 or later. We need two working days."
    return e
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const e = validate()
    setErrors(e)
    const order = [
      ...lines.map((line) => quantityId(line.part)),
      ...(Object.keys(FIELD_IDS) as FieldName[]),
    ]
    const first = order.find((key) => key in e)
    if (first) {
      const id =
        first in FIELD_IDS ? FIELD_IDS[first as FieldName] : first
      requestFocus(id)
      return
    }
    setSent({
      lines: lines.length,
      subtotal,
      email: fields.email.trim(),
    })
  }

  function errorId(key: string) {
    return `${FIELD_IDS[key as FieldName] ?? key}-error`
  }

  function textField(
    name: keyof Fields,
    label: string,
    props: React.ComponentProps<typeof Input>,
    options: { wide?: boolean; narrow?: boolean } = {}
  ) {
    const id = FIELD_IDS[name]
    const error = errors[name]
    const input = (
      <Input
        id={id}
        value={fields[name]}
        onChange={(e) => setField(name, e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId(name) : undefined}
        className="px-2 text-body md:text-body"
        {...props}
      />
    )
    return (
      <div
        className={cn("flex flex-col gap-3", options.wide && "md:col-span-2")}
      >
        <label htmlFor={id} className={cn("block", LABEL)}>
          {label}
        </label>
        <div className="flex flex-col gap-2">
          {options.narrow ? <div className="w-32">{input}</div> : input}
          {error && <ErrorLine id={errorId(name)}>{error}</ErrorLine>}
        </div>
      </div>
    )
  }

  function navLink(item: (typeof NAV)[number], extra?: string) {
    const current = item.href === CURRENT
    return (
      <a
        href={item.href}
        aria-current={current ? "page" : undefined}
        className={cn(
          "font-mono text-label transition-colors duration-150",
          current
            ? "text-foreground underline underline-offset-4"
            : "text-muted-foreground hover:text-foreground",
          FOCUS,
          extra
        )}
      >
        {item.label}
      </a>
    )
  }

  const requiredByError = errors.requiredBy

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <header
        className="border-b border-border bg-card"
        onKeyDown={(e) => {
          if (menuOpen && e.key === "Escape") {
            setMenuOpen(false)
            menuButtonRef.current?.focus()
          }
        }}
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
              {NAV.map((item) => (
                <li key={item.href}>{navLink(item)}</li>
              ))}
            </ul>
          </nav>
          <p className={cn("ml-auto hidden md:block", SMALL)}>
            Sales 01632 960 418
          </p>
          <Button
            ref={menuButtonRef}
            variant="secondary"
            className={cn("ml-auto md:hidden", BUTTON)}
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
              {NAV.map((item) => (
                <li key={item.href}>{navLink(item, "block py-2")}</li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className="flex-1 py-6">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className={LABEL}>Quote</p>
              <h1 className="text-h1">Request a quote</h1>
            </div>
          </div>

          <div>
            {!sent && (
              <form
                noValidate
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                    <h2 className="text-h2">Lines</h2>
                    <p aria-live="polite" className={SMALL}>
                      {lineCount(lines.length)}
                    </p>
                  </div>
                  <Table label="Lines" className="text-body">
                    <TableHeader>
                      <TableRow>
                        <TableHead className={HEAD}>Part number</TableHead>
                        <TableHead className={cn(HEAD, "min-w-48")}>
                          Description
                        </TableHead>
                        <TableHead className={cn(HEAD, "text-right")}>
                          Quantity
                        </TableHead>
                        <TableHead className={cn(HEAD, "text-right")}>
                          Unit price (£)
                        </TableHead>
                        <TableHead className={cn(HEAD, "text-right")}>
                          Line total (£)
                        </TableHead>
                        <TableHead className={HEAD}>
                          <span className="sr-only">Action</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lines.map((line, index) => {
                        const qty = parseQuantity(line.quantity)
                        const id = quantityId(line.part)
                        const error = errors[id]
                        return (
                          <TableRow key={line.part}>
                            <TableCell className={CELL}>
                              <a
                                href={line.href}
                                className={cn(TEXT_LINK, "font-mono text-body")}
                              >
                                {line.part}
                              </a>
                            </TableCell>
                            <TableCell className={cn(CELL, "whitespace-normal")}>
                              {line.description}
                            </TableCell>
                            <TableCell
                              className={cn(
                                CELL,
                                "text-right whitespace-normal"
                              )}
                            >
                              <div className="flex flex-col items-end gap-2">
                                <Input
                                  id={id}
                                  inputMode="numeric"
                                  aria-label={`Quantity of ${line.part}`}
                                  value={line.quantity}
                                  onChange={(e) =>
                                    setQuantity(line.part, e.target.value)
                                  }
                                  aria-invalid={error ? true : undefined}
                                  aria-describedby={
                                    error ? `${id}-error` : undefined
                                  }
                                  className="w-24 px-2 text-right font-mono text-body tabular-nums md:text-body"
                                />
                                {error && (
                                  <ErrorLine
                                    id={`${id}-error`}
                                    className="max-w-48 text-left"
                                  >
                                    {error}
                                  </ErrorLine>
                                )}
                              </div>
                            </TableCell>
                            <TableCell
                              className={cn(
                                CELL,
                                "text-right font-mono tabular-nums"
                              )}
                            >
                              {formatPence(unitPence(line, qty))}
                            </TableCell>
                            <TableCell
                              className={cn(
                                CELL,
                                "text-right font-mono tabular-nums"
                              )}
                            >
                              {formatPence(linePence(line))}
                            </TableCell>
                            <TableCell className={CELL}>
                              <Button
                                variant="secondary"
                                className={BUTTON}
                                aria-label={`Remove ${line.part}`}
                                disabled={lines.length === 1}
                                onClick={() => removeLine(index)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                    <TableFooter className="bg-transparent">
                      <TableRow className="hover:bg-transparent">
                        <TableCell
                          colSpan={4}
                          className={cn(CELL, LABEL, "text-right")}
                        >
                          Subtotal, excluding VAT
                        </TableCell>
                        <TableCell
                          className={cn(
                            CELL,
                            "text-right font-heading text-h2 tabular-nums"
                          )}
                        >
                          {formatPence(subtotal)}
                        </TableCell>
                        <TableCell className={CELL} />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                  <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:col-span-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="text-h2">Company and delivery</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {textField(
                        "company",
                        "Company",
                        { autoComplete: "organization" },
                        { wide: true }
                      )}
                      {textField("name", "Your name", { autoComplete: "name" })}
                      {textField("email", "Email", {
                        type: "email",
                        autoComplete: "email",
                      })}
                      {textField("phone", "Phone (optional)", {
                        type: "tel",
                        autoComplete: "tel",
                      })}
                      <div className="flex flex-col gap-3">
                        <label
                          id="delivery-label"
                          htmlFor="delivery"
                          className={cn("block", LABEL)}
                        >
                          Delivery
                        </label>
                        <div className="flex flex-col gap-2">
                          <Select
                            items={DELIVERY_ITEMS}
                            value={delivery}
                            onValueChange={(value) => {
                              if (value !== null) setDelivery(value)
                            }}
                          >
                            <SelectTrigger
                              id="delivery"
                              aria-labelledby="delivery-label"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {DELIVERY_ITEMS.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {textField(
                        "address",
                        "Delivery address",
                        { autoComplete: "street-address" },
                        { wide: true }
                      )}
                      {textField("town", "Town", {
                        autoComplete: "address-level2",
                      })}
                      {textField(
                        "postcode",
                        "Postcode",
                        { autoComplete: "postal-code" },
                        { narrow: true }
                      )}
                      <div className="flex flex-col gap-3">
                        <label
                          id="required-by-label"
                          htmlFor="required-by"
                          className={cn("block", LABEL)}
                        >
                          Required by
                        </label>
                        <div className="flex flex-col gap-2">
                          <DatePicker
                            id="required-by"
                            labelId="required-by-label"
                            value={requiredBy}
                            onValueChange={(date) => {
                              setRequiredBy(date)
                              clearError("requiredBy")
                            }}
                            today={TODAY}
                            aria-invalid={requiredByError ? true : undefined}
                            aria-describedby={
                              requiredByError
                                ? "required-by-helper required-by-error"
                                : "required-by-helper"
                            }
                          />
                          <p id="required-by-helper" className={SMALL}>
                            Monday 16 November 2026 or later.
                          </p>
                          {requiredByError && (
                            <ErrorLine id="required-by-error">
                              {requiredByError}
                            </ErrorLine>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
                      <Button type="submit" className={BUTTON}>
                        Request a quote
                      </Button>
                      <p className={SMALL}>
                        We reply by 17:00 on the next working day.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                      <h2 className="text-h2">How quotes work</h2>
                    </div>
                    <ul>
                      <li className="px-4 py-3 text-body">
                        Prices hold for 30 days from the date on the quote.
                      </li>
                      <li className="border-t border-border px-4 py-3 text-body">
                        Delivery is priced in the quote. Standard delivery is
                        free on orders over £500.00.
                      </li>
                      <li className="border-t border-border px-4 py-3 text-body">
                        Orders placed by 15:00 on a working day leave Brigholt
                        the same day.
                      </li>
                    </ul>
                  </div>
                </div>
              </form>
            )}
            <div role="status">
              {sent && (
                <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
                  <h2
                    ref={confirmationRef}
                    tabIndex={-1}
                    className={cn("text-h2", FOCUS_CODE)}
                  >
                    Quote requested
                  </h2>
                  <dl className="w-full max-w-md">
                    {[
                      ["Reference", "TQ-26-04173"],
                      ["Lines", String(sent.lines)],
                      [
                        "Subtotal, excluding VAT",
                        `£${formatPence(sent.subtotal)}`,
                      ],
                    ].map(([term, value], i) => (
                      <div
                        key={term}
                        className={cn(
                          "flex items-baseline justify-between gap-3 py-2",
                          i > 0 && "border-t border-border"
                        )}
                      >
                        <dt className={LABEL}>{term}</dt>
                        <dd className="text-right font-mono tabular-nums">
                          {value}
                        </dd>
                      </div>
                    ))}
                    <div className="flex items-baseline justify-between gap-3 border-t border-border py-2">
                      <dt className={LABEL}>Reply by</dt>
                      <dd className="text-right font-mono tabular-nums">
                        <time dateTime="2026-11-13T17:00">
                          17:00, 13 Nov 2026
                        </time>
                      </dd>
                    </div>
                  </dl>
                  <p className="max-w-lg text-body wrap-break-word">
                    We will send the quote to {sent.email}, from
                    sales@torvale.example.
                  </p>
                  <p className="max-w-lg text-body">
                    This is a demo: nothing was sent and no stock is held.
                  </p>
                  <a
                    href="/catalogue"
                    className={cn(
                      buttonVariants({ variant: "secondary" }),
                      BUTTON,
                      "self-start"
                    )}
                  >
                    Back to the catalogue
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-6">
          <p className={SMALL}>
            Torvale Bearings Ltd · Brigholt works · Prices exclude VAT · A
            demo: nothing is sold or sent.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
