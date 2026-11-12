import * as React from "react"
import { CircleAlert } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

// A fixed "today" for the sample: Thursday 12 November 2026.
const EARLIEST_DELIVERY = "2026-11-16"

const FOCUS_RING =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const CODE_FOCUS_RING =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const TEXT_LINK = cn(
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
  FOCUS_RING
)
const LABEL = "font-mono text-label text-muted-foreground"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const BUTTON_TEXT = "px-4 font-mono text-label"
const CONTAINER = "mx-auto w-full max-w-[1280px] px-4"

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

type FieldName =
  | "company"
  | "name"
  | "email"
  | "phone"
  | "delivery"
  | "address"
  | "town"
  | "postcode"
  | "requiredBy"

type Values = Record<FieldName, string>

const INITIAL_VALUES: Values = {
  company: "",
  name: "",
  email: "",
  phone: "",
  delivery: "standard",
  address: "",
  town: "",
  postcode: "",
  requiredBy: "",
}

const DELIVERY_OPTIONS = [
  { value: "standard", label: "Standard, 3 to 5 working days" },
  { value: "next-day", label: "Next working day" },
  { value: "collect", label: "Collect from Brigholt" },
]

type Sent = { lines: number; subtotal: number; email: string }

function parseQuantity(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, "")
  if (!/^\d+$/.test(cleaned)) return null
  const n = Number(cleaned)
  return n >= 1 && n <= 10000 ? n : null
}

function unitPrice(line: Line, quantity: number | null): number {
  if (quantity === null || quantity < 50) return line.breaks[0]
  if (quantity < 250) return line.breaks[1]
  if (quantity < 1000) return line.breaks[2]
  return line.breaks[3]
}

function lineTotal(line: Line): number {
  const q = parseQuantity(line.quantity)
  return q === null ? 0 : q * unitPrice(line, q)
}

// Pence to "1,137.80".
function formatPence(pence: number): string {
  const pounds = Math.floor(pence / 100).toLocaleString("en-GB")
  return `${pounds}.${String(pence % 100).padStart(2, "0")}`
}

function plural(n: number, noun: string) {
  return `${n} ${noun}${n === 1 ? "" : "s"}`
}

function qtyId(part: string) {
  return `qty-${part}`
}

function validate(lines: Line[], values: Values) {
  const errors: Record<string, string> = {}
  for (const line of lines) {
    if (parseQuantity(line.quantity) === null) {
      errors[qtyId(line.part)] = "Enter a whole number from 1 to 10,000."
    }
  }
  const v = Object.fromEntries(
    Object.entries(values).map(([k, val]) => [k, val.trim()])
  ) as Values

  if (!v.company) errors.company = "Enter your company's name."
  if (!v.name) errors.name = "Enter your name."
  if (!v.email) {
    errors.email = "Enter your email address."
  } else {
    const parts = v.email.split("@")
    if (parts.length !== 2 || !parts[0] || !parts[1].includes(".")) {
      errors.email = "Enter an email address such as buyer@pellam.example."
    }
  }
  if (v.phone && !/^\+?\d{10,15}$/.test(v.phone.replace(/\s/g, ""))) {
    errors.phone = "Enter a phone number of 10 to 15 digits, or leave it empty."
  }
  if (!v.address) errors.address = "Enter the delivery address."
  if (!v.town) errors.town = "Enter the town."
  if (!/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(v.postcode.toUpperCase())) {
    errors.postcode = "Enter a postcode such as AC7 1RT."
  }
  if (!v.requiredBy) {
    errors.requiredBy = "Enter a date."
  } else if (v.requiredBy < EARLIEST_DELIVERY) {
    errors.requiredBy =
      "Choose 16 November 2026 or later. We need two working days."
  }
  return errors
}

const FIELD_ORDER: FieldName[] = [
  "company",
  "name",
  "email",
  "phone",
  "delivery",
  "address",
  "town",
  "postcode",
  "requiredBy",
]

function ErrorLine({
  id,
  message,
  className,
}: {
  id: string
  message: string
  className?: string
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
      <span>{message}</span>
    </p>
  )
}

function Field({
  id,
  label,
  helper,
  error,
  wide,
  children,
}: {
  id: string
  label: string
  helper?: string
  error?: string
  wide?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex flex-col gap-3", wide && "md:col-span-2")}>
      <label htmlFor={id} className={cn("block", LABEL)}>
        {label}
      </label>
      <div className="flex flex-col gap-2">
        {children}
        {helper && (
          <p id={`${id}-helper`} className={SMALL_FIGURE}>
            {helper}
          </p>
        )}
        {error && <ErrorLine id={`${id}-error`} message={error} />}
      </div>
    </div>
  )
}

function describedBy(...ids: (string | false | undefined)[]) {
  const list = ids.filter(Boolean).join(" ")
  return list || undefined
}

function SiteHeader() {
  const [open, setOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape" && open) {
      setOpen(false)
      buttonRef.current?.focus()
    }
  }

  return (
    <header className="border-b border-border bg-card">
      <div className={cn(CONTAINER, "flex items-center gap-6 py-3")}>
        <a
          href="/catalogue"
          className={cn(
            "font-heading text-h2 text-foreground no-underline",
            FOCUS_RING
          )}
        >
          Torvale
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink {...link} />
              </li>
            ))}
          </ul>
        </nav>
        <p className={cn("ml-auto hidden md:block", SMALL_FIGURE)}>
          Sales 01632 960 418
        </p>
        <Button
          ref={buttonRef}
          variant="secondary"
          className={cn("ml-auto md:hidden", BUTTON_TEXT)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onKeyDown}
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
        onKeyDown={onKeyDown}
      >
        <div className={CONTAINER}>
          <ul className="py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink {...link} className="block py-2" />
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function NavLink({
  label,
  href,
  className,
}: {
  label: string
  href: string
  className?: string
}) {
  const current = href === CURRENT_NAV
  return (
    <a
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "font-mono text-label transition-colors duration-150",
        current
          ? "text-foreground underline underline-offset-4"
          : "text-muted-foreground hover:text-foreground",
        FOCUS_RING,
        className
      )}
    >
      {label}
    </a>
  )
}

export function App() {
  const [lines, setLines] = React.useState<Line[]>(INITIAL_LINES)
  const [values, setValues] = React.useState<Values>(INITIAL_VALUES)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [focusRequest, setFocusRequest] = React.useState<{
    id: string
    n: number
  } | null>(null)
  const [sent, setSent] = React.useState<Sent | null>(null)
  const confirmationHeading = React.useRef<HTMLHeadingElement>(null)

  const subtotal = lines.reduce((sum, line) => sum + lineTotal(line), 0)

  // Focus moves only after the render that put the error lines (or the
  // replacement line) on the page.
  React.useEffect(() => {
    if (focusRequest) document.getElementById(focusRequest.id)?.focus()
  }, [focusRequest])

  React.useEffect(() => {
    if (sent) confirmationHeading.current?.focus()
  }, [sent])

  function clearError(id: string) {
    setErrors((prev) => {
      if (!(id in prev)) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  function setQuantity(part: string, quantity: string) {
    setLines((prev) =>
      prev.map((l) => (l.part === part ? { ...l, quantity } : l))
    )
    clearError(qtyId(part))
  }

  function removeLine(part: string) {
    const index = lines.findIndex((l) => l.part === part)
    const next = lines.filter((l) => l.part !== part)
    const target = next[index] ?? next[index - 1]
    setLines(next)
    clearError(qtyId(part))
    if (target) {
      setFocusRequest((prev) => ({
        id: qtyId(target.part),
        n: (prev?.n ?? 0) + 1,
      }))
    }
  }

  function setValue(name: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }))
    clearError(name)
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(lines, values)
    const order = [
      ...lines.map((l) => qtyId(l.part)),
      ...FIELD_ORDER,
    ] as string[]
    const first = order.find((id) => id in found)
    setErrors(found)
    if (first) {
      setFocusRequest((prev) => ({ id: first, n: (prev?.n ?? 0) + 1 }))
      return
    }
    setSent({
      lines: lines.length,
      subtotal,
      email: values.email.trim(),
    })
  }

  function textField(
    name: FieldName,
    label: string,
    props: React.ComponentProps<typeof Input> & {
      wide?: boolean
      helper?: string
      inputClassName?: string
      wrapClassName?: string
    } = {}
  ) {
    const { wide, helper, inputClassName, wrapClassName, ...inputProps } =
      props
    const error = errors[name]
    const input = (
      <Input
        id={name}
        name={name}
        value={values[name]}
        onChange={(e) => setValue(name, e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(
          helper && `${name}-helper`,
          error && `${name}-error`
        )}
        className={cn("text-body md:text-body", inputClassName)}
        {...inputProps}
      />
    )
    return (
      <Field
        id={name}
        label={label}
        helper={helper}
        error={error}
        wide={wide}
      >
        {wrapClassName ? <div className={wrapClassName}>{input}</div> : input}
      </Field>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <SiteHeader />

      <main className="flex-1 py-6">
        <div className={cn(CONTAINER, "flex flex-col gap-6")}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className={LABEL}>Quote</p>
              <h1 className="text-h1">Request a quote</h1>
            </div>
          </div>

          <div>
            {!sent && (
              <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
                <section
                  aria-labelledby="lines-heading"
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                    <h2 id="lines-heading" className="text-h2">
                      Lines
                    </h2>
                    <p aria-live="polite" className={SMALL_FIGURE}>
                      {plural(lines.length, "line")}
                    </p>
                  </div>
                  <Table label="Lines" className="text-body">
                    <TableHeader>
                      <TableRow>
                        <TableHead className={cn("px-4", LABEL)}>
                          Part number
                        </TableHead>
                        <TableHead className={cn("min-w-48 px-4", LABEL)}>
                          Description
                        </TableHead>
                        <TableHead className={cn("px-4 text-right", LABEL)}>
                          Quantity
                        </TableHead>
                        <TableHead className={cn("px-4 text-right", LABEL)}>
                          Unit price (£)
                        </TableHead>
                        <TableHead className={cn("px-4 text-right", LABEL)}>
                          Line total (£)
                        </TableHead>
                        <TableHead className={cn("px-4", LABEL)}>
                          <span className="sr-only">Action</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lines.map((line) => {
                        const q = parseQuantity(line.quantity)
                        const id = qtyId(line.part)
                        const error = errors[id]
                        return (
                          <TableRow key={line.part}>
                            <TableCell className="px-4 py-2">
                              <a
                                href={line.href}
                                className={cn(TEXT_LINK, "font-mono text-body")}
                              >
                                {line.part}
                              </a>
                            </TableCell>
                            <TableCell className="px-4 py-2 whitespace-normal">
                              {line.description}
                            </TableCell>
                            <TableCell className="px-4 py-2 text-right whitespace-normal">
                              <div className="flex flex-col items-end gap-2">
                                <Input
                                  id={id}
                                  value={line.quantity}
                                  inputMode="numeric"
                                  aria-label={`Quantity of ${line.part}`}
                                  aria-invalid={error ? true : undefined}
                                  aria-describedby={
                                    error ? `${id}-error` : undefined
                                  }
                                  onChange={(e) =>
                                    setQuantity(line.part, e.target.value)
                                  }
                                  className="w-24 text-right font-mono text-body tabular-nums md:text-body"
                                />
                                {error && (
                                  <ErrorLine
                                    id={`${id}-error`}
                                    message={error}
                                    className="max-w-48 text-left"
                                  />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-2 text-right font-mono tabular-nums">
                              {formatPence(unitPrice(line, q))}
                            </TableCell>
                            <TableCell className="px-4 py-2 text-right font-mono tabular-nums">
                              {formatPence(lineTotal(line))}
                            </TableCell>
                            <TableCell className="px-4 py-2">
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
                    <TableFooter className="border-t-0 bg-transparent">
                      <TableRow className="border-b-0 hover:bg-transparent">
                        <TableCell
                          colSpan={4}
                          className={cn(
                            "border-t border-border px-4 py-2 text-right",
                            LABEL
                          )}
                        >
                          Subtotal, excluding VAT
                        </TableCell>
                        <TableCell className="border-t border-border px-4 py-2 text-right font-heading text-h2 tabular-nums">
                          {formatPence(subtotal)}
                        </TableCell>
                        <TableCell className="border-t border-border px-4 py-2" />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </section>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                  <section
                    aria-labelledby="details-heading"
                    className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:col-span-8"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 id="details-heading" className="text-h2">
                        Company and delivery
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {textField("company", "Company", {
                        autoComplete: "organization",
                        wide: true,
                      })}
                      {textField("name", "Your name", { autoComplete: "name" })}
                      {textField("email", "Email", {
                        type: "email",
                        autoComplete: "email",
                      })}
                      {textField("phone", "Phone (optional)", {
                        type: "tel",
                        autoComplete: "tel",
                      })}
                      <Field id="delivery" label="Delivery">
                        <select
                          id="delivery"
                          name="delivery"
                          value={values.delivery}
                          onChange={(e) => setValue("delivery", e.target.value)}
                          className={cn(
                            "h-8 w-full rounded-lg border border-input bg-card px-2 text-body text-foreground aria-invalid:border-destructive",
                            FOCUS_RING
                          )}
                        >
                          {DELIVERY_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </Field>
                      {textField("address", "Delivery address", {
                        autoComplete: "street-address",
                        wide: true,
                      })}
                      {textField("town", "Town", {
                        autoComplete: "address-level2",
                      })}
                      {textField("postcode", "Postcode", {
                        autoComplete: "postal-code",
                        wrapClassName: "w-32",
                      })}
                      {textField("requiredBy", "Required by", {
                        type: "date",
                        min: EARLIEST_DELIVERY,
                        helper: "Monday 16 November 2026 or later.",
                      })}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
                      <Button type="submit" className={BUTTON_TEXT}>
                        Request a quote
                      </Button>
                      <p className={SMALL_FIGURE}>
                        We reply by 17:00 on the next working day.
                      </p>
                    </div>
                  </section>

                  <section
                    aria-labelledby="how-heading"
                    className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                      <h2 id="how-heading" className="text-h2">
                        How quotes work
                      </h2>
                    </div>
                    <ul>
                      {[
                        "Prices hold for 30 days from the date on the quote.",
                        "Delivery is priced in the quote. Standard delivery is free on orders over £500.00.",
                        "Orders placed by 15:00 on a working day leave Brigholt the same day.",
                      ].map((text, i) => (
                        <li
                          key={text}
                          className={cn(
                            "px-4 py-3",
                            i > 0 && "border-t border-border"
                          )}
                        >
                          <p className="max-w-lg text-body text-foreground">
                            {text}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </form>
            )}

            <div role="status">
              {sent && (
                <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
                  <h2
                    ref={confirmationHeading}
                    tabIndex={-1}
                    className={cn("text-h2", CODE_FOCUS_RING)}
                  >
                    Quote requested
                  </h2>
                  <dl className="w-full max-w-md">
                    {[
                      { term: "Reference", value: "TQ-26-04173" },
                      { term: "Lines", value: String(sent.lines) },
                      {
                        term: "Subtotal, excluding VAT",
                        value: `£${formatPence(sent.subtotal)}`,
                      },
                      {
                        term: "Reply by",
                        value: (
                          <time dateTime="2026-11-13T17:00">
                            17:00, 13 Nov 2026
                          </time>
                        ),
                      },
                    ].map((row, i) => (
                      <div
                        key={row.term}
                        className={cn(
                          "flex items-baseline justify-between gap-3 py-2",
                          i > 0 && "border-t border-border"
                        )}
                      >
                        <dt className={LABEL}>{row.term}</dt>
                        <dd className="text-right font-mono tabular-nums">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="max-w-lg text-body text-foreground">
                    We will send the quote to {sent.email}, from
                    sales@torvale.example.
                  </p>
                  <p className="max-w-lg text-body text-foreground">
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
        <div className={cn(CONTAINER, "py-6")}>
          <p className={SMALL_FIGURE}>
            Torvale Bearings Ltd · Brigholt works · Prices exclude VAT · A
            demo: nothing is sold or sent.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
