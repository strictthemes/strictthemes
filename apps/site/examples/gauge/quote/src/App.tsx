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
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const BUTTON_TEXT = "px-4 font-mono text-label"

const NAV_LINKS = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Compare", href: "/compare" },
  { label: "Downloads", href: "/downloads" },
  { label: "Quote", href: "/quote" },
]
const CURRENT_NAV = "/quote"

type Line = {
  part: string
  href: string
  description: string
  // Price per bearing in pence for 1–49, 50–249, 250–999 and 1,000 and over.
  breaks: [number, number, number, number]
  quantity: string
}

const INITIAL_LINES: Line[] = [
  {
    part: "TVL-2047-RS",
    href: "/part",
    description: "Deep groove ball bearing, 20 × 47 × 14 mm, rubber seals",
    breaks: [294, 261, 228, 197],
    quantity: "250",
  },
  {
    part: "TVL-2552-RS",
    href: "#",
    description: "Deep groove ball bearing, 25 × 52 × 15 mm, rubber seals",
    breaks: [346, 307, 268, 232],
    quantity: "100",
  },
  {
    part: "TVL-3572-ZZ",
    href: "#",
    description: "Deep groove ball bearing, 35 × 72 × 17 mm, metal shields",
    breaks: [652, 579, 505, 437],
    quantity: "40",
  },
]

const DELIVERY_ITEMS = [
  { value: "standard", label: "Standard, 3 to 5 working days" },
  { value: "next-day", label: "Next working day" },
  { value: "collect", label: "Collect from Brigholt" },
]

type TextField =
  "company" | "name" | "email" | "phone" | "address" | "town" | "postcode"

type Details = Record<TextField, string>

const EMPTY_DETAILS: Details = {
  company: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  town: "",
  postcode: "",
}

type Errors = Record<string, string>

type Confirmation = {
  lines: number
  subtotal: number
  email: string
}

function parseQuantity(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, "")
  if (!/^\d+$/.test(cleaned)) return null
  const value = Number(cleaned)
  return value >= 1 && value <= 10000 ? value : null
}

function unitPrice(line: Line): number {
  const quantity = parseQuantity(line.quantity)
  if (quantity === null || quantity < 50) return line.breaks[0]
  if (quantity < 250) return line.breaks[1]
  if (quantity < 1000) return line.breaks[2]
  return line.breaks[3]
}

function lineTotal(line: Line): number {
  const quantity = parseQuantity(line.quantity)
  return quantity === null ? 0 : quantity * unitPrice(line)
}

function formatPence(pence: number): string {
  const pounds = Math.floor(pence / 100)
  const rest = String(pence % 100).padStart(2, "0")
  return `${pounds.toLocaleString("en-GB")}.${rest}`
}

function qtyId(part: string) {
  return `qty-${part}`
}

function validate(lines: Line[], details: Details, requiredBy?: Date) {
  const errors: Errors = {}
  for (const line of lines) {
    if (parseQuantity(line.quantity) === null) {
      errors[qtyId(line.part)] = "Enter a whole number from 1 to 10,000."
    }
  }
  if (!details.company) errors.company = "Enter your company's name."
  if (!details.name) errors.name = "Enter your name."
  if (!details.email) {
    errors.email = "Enter your email address."
  } else {
    const parts = details.email.split("@")
    if (parts.length !== 2 || !parts[0] || !parts[1].includes(".")) {
      errors.email = "Enter an email address such as buyer@pellam.example."
    }
  }
  if (
    details.phone &&
    !/^\+?\d{10,15}$/.test(details.phone.replace(/ /g, ""))
  ) {
    errors.phone = "Enter a phone number of 10 to 15 digits, or leave it empty."
  }
  if (!details.address) errors.address = "Enter the delivery address."
  if (!details.town) errors.town = "Enter the town."
  if (!/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(details.postcode)) {
    errors.postcode = "Enter a postcode such as AC7 1RT."
  }
  if (!requiredBy) {
    errors.requiredBy = "Enter a date."
  } else if (requiredBy < EARLIEST_DELIVERY) {
    errors.requiredBy =
      "Choose 16 November 2026 or later. We need two working days."
  }
  return errors
}

const FIELD_ORDER = [
  "company",
  "name",
  "email",
  "phone",
  "address",
  "town",
  "postcode",
  "requiredBy",
]

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

function describedBy(...ids: (string | false | undefined)[]) {
  const list = ids.filter(Boolean).join(" ")
  return list || undefined
}

function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuButton = React.useRef<HTMLButtonElement>(null)

  function onKeyDown(event: React.KeyboardEvent) {
    if (menuOpen && event.key === "Escape") {
      setMenuOpen(false)
      menuButton.current?.focus()
    }
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

  return (
    <header className="border-b border-border bg-card" onKeyDown={onKeyDown}>
      <div className="mx-auto flex w-full max-w-[1280px] items-center gap-6 px-4 py-3">
        <a
          href="/catalogue"
          className={cn("font-heading text-h2 text-foreground", FOCUS)}
        >
          Torvale
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.href === CURRENT_NAV ? "page" : undefined}
                  className={navLinkClass(link.href === CURRENT_NAV)}
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
          className={cn("ml-auto md:hidden", BUTTON_TEXT)}
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
                  aria-current={link.href === CURRENT_NAV ? "page" : undefined}
                  className={cn(
                    "block py-2",
                    navLinkClass(link.href === CURRENT_NAV)
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
  )
}

type FieldProps = {
  id: string
  label: string
  error?: string
  helper?: string
  className?: string
  inputWrapperClassName?: string
} & Omit<React.ComponentProps<typeof Input>, "id" | "className">

function TextInputField({
  id,
  label,
  error,
  helper,
  className,
  inputWrapperClassName,
  ...inputProps
}: FieldProps) {
  const helperId = helper ? `${id}-help` : undefined
  const errorId = error ? `${id}-error` : undefined
  const input = (
    <Input
      id={id}
      className="px-2 text-body md:text-body"
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(helperId, errorId)}
      {...inputProps}
    />
  )
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <label htmlFor={id} className={cn("block", LABEL)}>
        {label}
      </label>
      <div className="flex flex-col gap-2">
        {inputWrapperClassName ? (
          <div className={inputWrapperClassName}>{input}</div>
        ) : (
          input
        )}
        {helper && (
          <p id={helperId} className={SMALL_FIGURE}>
            {helper}
          </p>
        )}
        {error && <ErrorLine id={`${id}-error`}>{error}</ErrorLine>}
      </div>
    </div>
  )
}

export function App() {
  const [lines, setLines] = React.useState<Line[]>(INITIAL_LINES)
  const [details, setDetails] = React.useState<Details>(EMPTY_DETAILS)
  const [delivery, setDelivery] = React.useState("standard")
  const [requiredBy, setRequiredBy] = React.useState<Date | undefined>()
  const [errors, setErrors] = React.useState<Errors>({})
  const [focusRequest, setFocusRequest] = React.useState<{ id: string } | null>(
    null
  )
  const [confirmation, setConfirmation] = React.useState<Confirmation | null>(
    null
  )
  const confirmationHeading = React.useRef<HTMLHeadingElement>(null)

  const subtotal = lines.reduce((sum, line) => sum + lineTotal(line), 0)

  React.useEffect(() => {
    if (focusRequest) document.getElementById(focusRequest.id)?.focus()
  }, [focusRequest])

  React.useEffect(() => {
    if (confirmation) confirmationHeading.current?.focus()
  }, [confirmation])

  function clearError(key: string) {
    setErrors((current) => {
      if (!(key in current)) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function setQuantity(part: string, quantity: string) {
    setLines((current) =>
      current.map((line) => (line.part === part ? { ...line, quantity } : line))
    )
    clearError(qtyId(part))
  }

  function removeLine(part: string) {
    const index = lines.findIndex((line) => line.part === part)
    const next = lines.filter((line) => line.part !== part)
    setLines(next)
    clearError(qtyId(part))
    const target = next[index] ?? next[index - 1]
    if (target) setFocusRequest({ id: qtyId(target.part) })
  }

  function setDetail(field: TextField, value: string) {
    setDetails((current) => ({ ...current, [field]: value }))
    clearError(field)
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedLines = lines.map((line) => ({
      ...line,
      quantity: line.quantity.trim(),
    }))
    const trimmed = Object.fromEntries(
      Object.entries(details).map(([key, value]) => [key, value.trim()])
    ) as Details
    setLines(trimmedLines)
    setDetails(trimmed)

    const found = validate(trimmedLines, trimmed, requiredBy)
    setErrors(found)
    const order = [
      ...trimmedLines.map((line) => qtyId(line.part)),
      ...FIELD_ORDER,
    ]
    const first = order.find((key) => key in found)
    if (first) {
      setFocusRequest({ id: first === "requiredBy" ? "required-by" : first })
      return
    }
    setConfirmation({
      lines: trimmedLines.length,
      subtotal: trimmedLines.reduce((sum, line) => sum + lineTotal(line), 0),
      email: trimmed.email,
    })
  }

  const count = `${lines.length} ${lines.length === 1 ? "line" : "lines"}`
  const headCell = cn("px-4", LABEL)
  const bodyCell = "px-4 py-2"

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />

      <main className="flex-1 py-6">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className={LABEL}>Quote</p>
              <h1 className="text-h1">Request a quote</h1>
            </div>
          </div>

          <div>
            {!confirmation && (
              <form
                noValidate
                onSubmit={onSubmit}
                className="flex flex-col gap-4"
              >
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                    <h2 className="text-h2">Lines</h2>
                    <p aria-live="polite" className={SMALL_FIGURE}>
                      {count}
                    </p>
                  </div>
                  <Table label="Lines" className="text-body">
                    <TableHeader>
                      <TableRow>
                        <TableHead className={headCell}>Part number</TableHead>
                        <TableHead className={cn(headCell, "min-w-48")}>
                          Description
                        </TableHead>
                        <TableHead className={cn(headCell, "text-right")}>
                          Quantity
                        </TableHead>
                        <TableHead className={cn(headCell, "text-right")}>
                          Unit price (£)
                        </TableHead>
                        <TableHead className={cn(headCell, "text-right")}>
                          Line total (£)
                        </TableHead>
                        <TableHead className={headCell}>
                          <span className="sr-only">Action</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lines.map((line) => {
                        const id = qtyId(line.part)
                        const error = errors[id]
                        return (
                          <TableRow key={line.part}>
                            <TableCell className={bodyCell}>
                              <a
                                href={line.href}
                                className={cn("font-mono text-body", TEXT_LINK)}
                              >
                                {line.part}
                              </a>
                            </TableCell>
                            <TableCell
                              className={cn(bodyCell, "whitespace-normal")}
                            >
                              {line.description}
                            </TableCell>
                            <TableCell
                              className={cn(
                                bodyCell,
                                "text-right whitespace-normal"
                              )}
                            >
                              <div className="flex flex-col items-end gap-2">
                                <Input
                                  id={id}
                                  inputMode="numeric"
                                  aria-label={`Quantity of ${line.part}`}
                                  aria-invalid={error ? true : undefined}
                                  aria-describedby={
                                    error ? `${id}-error` : undefined
                                  }
                                  value={line.quantity}
                                  onChange={(event) =>
                                    setQuantity(line.part, event.target.value)
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
                                bodyCell,
                                "text-right font-mono tabular-nums"
                              )}
                            >
                              {formatPence(unitPrice(line))}
                            </TableCell>
                            <TableCell
                              className={cn(
                                bodyCell,
                                "text-right font-mono tabular-nums"
                              )}
                            >
                              {formatPence(lineTotal(line))}
                            </TableCell>
                            <TableCell className={bodyCell}>
                              <Button
                                variant="secondary"
                                className={BUTTON_TEXT}
                                aria-label={`Remove ${line.part}`}
                                disabled={lines.length === 1}
                                onClick={() => removeLine(line.part)}
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
                          className={cn(bodyCell, "text-right", LABEL)}
                        >
                          Subtotal, excluding VAT
                        </TableCell>
                        <TableCell
                          className={cn(
                            bodyCell,
                            "text-right font-heading text-h2 tabular-nums"
                          )}
                        >
                          {formatPence(subtotal)}
                        </TableCell>
                        <TableCell className={bodyCell} />
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
                      <TextInputField
                        id="company"
                        label="Company"
                        autoComplete="organization"
                        className="md:col-span-2"
                        value={details.company}
                        error={errors.company}
                        onChange={(event) =>
                          setDetail("company", event.target.value)
                        }
                      />
                      <TextInputField
                        id="name"
                        label="Your name"
                        autoComplete="name"
                        value={details.name}
                        error={errors.name}
                        onChange={(event) =>
                          setDetail("name", event.target.value)
                        }
                      />
                      <TextInputField
                        id="email"
                        label="Email"
                        type="email"
                        autoComplete="email"
                        value={details.email}
                        error={errors.email}
                        onChange={(event) =>
                          setDetail("email", event.target.value)
                        }
                      />
                      <TextInputField
                        id="phone"
                        label="Phone (optional)"
                        type="tel"
                        autoComplete="tel"
                        value={details.phone}
                        error={errors.phone}
                        onChange={(event) =>
                          setDetail("phone", event.target.value)
                        }
                      />
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
                      <TextInputField
                        id="address"
                        label="Delivery address"
                        autoComplete="street-address"
                        className="md:col-span-2"
                        value={details.address}
                        error={errors.address}
                        onChange={(event) =>
                          setDetail("address", event.target.value)
                        }
                      />
                      <TextInputField
                        id="town"
                        label="Town"
                        autoComplete="address-level2"
                        value={details.town}
                        error={errors.town}
                        onChange={(event) =>
                          setDetail("town", event.target.value)
                        }
                      />
                      <TextInputField
                        id="postcode"
                        label="Postcode"
                        autoComplete="postal-code"
                        inputWrapperClassName="w-32"
                        value={details.postcode}
                        error={errors.postcode}
                        onChange={(event) =>
                          setDetail("postcode", event.target.value)
                        }
                      />
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
                            onValueChange={(value) => {
                              setRequiredBy(value)
                              clearError("requiredBy")
                            }}
                            today={TODAY}
                            aria-invalid={errors.requiredBy ? true : undefined}
                            aria-describedby={describedBy(
                              "required-by-help",
                              errors.requiredBy && "required-by-error"
                            )}
                          />
                          <p id="required-by-help" className={SMALL_FIGURE}>
                            Monday 16 November 2026 or later.
                          </p>
                          {errors.requiredBy && (
                            <ErrorLine id="required-by-error">
                              {errors.requiredBy}
                            </ErrorLine>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
                      <Button type="submit" className={BUTTON_TEXT}>
                        Request a quote
                      </Button>
                      <p className={SMALL_FIGURE}>
                        We reply by 17:00 on the next working day.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                      <h2 className="text-h2">How quotes work</h2>
                    </div>
                    <ul>
                      {[
                        "Prices hold for 30 days from the date on the quote.",
                        "Delivery is priced in the quote. Standard delivery is free on orders over £500.00.",
                        "Orders placed by 15:00 on a working day leave Brigholt the same day.",
                      ].map((text) => (
                        <li
                          key={text}
                          className="border-t border-border px-4 py-3 text-body first:border-t-0"
                        >
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </form>
            )}

            <div role="status">
              {confirmation && (
                <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
                  <h2
                    ref={confirmationHeading}
                    tabIndex={-1}
                    className={cn("text-h2", FOCUS_CODE)}
                  >
                    Quote requested
                  </h2>
                  <dl className="w-full max-w-md">
                    {[
                      { term: "Reference", value: "TQ-26-04173" },
                      { term: "Lines", value: String(confirmation.lines) },
                      {
                        term: "Subtotal, excluding VAT",
                        value: `£${formatPence(confirmation.subtotal)}`,
                      },
                      {
                        term: "Reply by",
                        value: (
                          <time dateTime="2026-11-13T17:00">
                            17:00, 13 Nov 2026
                          </time>
                        ),
                      },
                    ].map((row) => (
                      <div
                        key={row.term}
                        className="flex items-baseline justify-between gap-3 border-t border-border py-2 first:border-t-0"
                      >
                        <dt className={LABEL}>{row.term}</dt>
                        <dd className="text-right font-mono tabular-nums">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="max-w-lg text-body wrap-break-word">
                    We will send the quote to {confirmation.email}, from
                    sales@torvale.example.
                  </p>
                  <p className="max-w-lg text-body">
                    This is a demo: nothing was sent and no stock is held.
                  </p>
                  <a
                    href="/catalogue"
                    className={cn(
                      buttonVariants({ variant: "secondary" }),
                      BUTTON_TEXT,
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
