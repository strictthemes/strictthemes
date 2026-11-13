import * as React from "react"
import { CircleAlert } from "lucide-react"

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
import { cn } from "@/lib/utils"

// The sample's today and the earliest delivery date: fixed, never the clock.
const TODAY = new Date(2026, 10, 12)
const EARLIEST = new Date(2026, 10, 16)

const CONTAINER = "mx-auto w-full max-w-[1280px] px-4"
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const LABEL = "font-mono text-label text-muted-foreground"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const TEXT_LINK = cn(
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
  FOCUS
)
const PANEL = "rounded-xl border border-border bg-card p-4"
const ROWS_PANEL = "overflow-hidden rounded-xl border border-border bg-card"
const PANEL_HEADING = "flex flex-wrap items-center justify-between gap-3"
const BUTTON = "px-4 font-mono text-label"
const HEAD_CELL = "px-4 font-mono text-label text-muted-foreground"
const CELL = "px-4 py-2"

const NAV_LINKS = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Compare", href: "/compare" },
  { label: "Downloads", href: "/downloads" },
  { label: "Quote", href: "/quote" },
]
const CURRENT_HREF = "/quote"

type Line = {
  part: string
  description: string
  href: string
  // Pence per bearing for 1 to 49, 50 to 249, 250 to 999, and 1,000 and over.
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

const DELIVERY_CHOICES = [
  { value: "standard", label: "Standard, 3 to 5 working days" },
  { value: "next-day", label: "Next working day" },
  { value: "collect", label: "Collect from Brigholt" },
]

const QUOTE_NOTES = [
  "Prices hold for 30 days from the date on the quote.",
  "Delivery is priced in the quote. Standard delivery is free on orders over £500.00.",
  "Orders placed by 15:00 on a working day leave Brigholt the same day.",
]

type TextField = "company" | "name" | "email" | "phone" | "address" | "town" | "postcode"
type FieldName = TextField | "requiredBy"

const EMPTY_VALUES: Record<TextField, string> = {
  company: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  town: "",
  postcode: "",
}

type Sent = { lines: number; subtotal: number; email: string }

function parseQuantity(text: string): number | null {
  const cleaned = text.trim().replace(/,/g, "")
  if (!/^\d+$/.test(cleaned)) return null
  const quantity = Number(cleaned)
  return quantity >= 1 && quantity <= 10000 ? quantity : null
}

function unitPence(line: Line, quantity: number | null): number {
  if (quantity === null || quantity < 50) return line.breaks[0]
  if (quantity < 250) return line.breaks[1]
  if (quantity < 1000) return line.breaks[2]
  return line.breaks[3]
}

function linePence(line: Line): number {
  const quantity = parseQuantity(line.quantity)
  return quantity === null ? 0 : quantity * unitPence(line, quantity)
}

function money(pence: number): string {
  return (pence / 100).toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function quantityId(part: string): string {
  return `quantity-${part}`
}

function describedBy(...ids: (string | false | undefined)[]): string | undefined {
  const list = ids.filter(Boolean).join(" ")
  return list === "" ? undefined : list
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
        "flex items-start gap-2 text-left font-mono text-label text-destructive",
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

function Field({
  id,
  label,
  labelId,
  helper,
  error,
  className,
  children,
}: {
  id: string
  label: string
  labelId?: string
  helper?: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <label id={labelId} htmlFor={id} className={cn("block", LABEL)}>
        {label}
      </label>
      <div className="flex flex-col gap-2">
        {children}
        {helper ? (
          <p id={`${id}-help`} className={SMALL_FIGURE}>
            {helper}
          </p>
        ) : null}
        {error ? <ErrorLine id={`${id}-error`}>{error}</ErrorLine> : null}
      </div>
    </div>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [lines, setLines] = React.useState<Line[]>(INITIAL_LINES)
  const [lineErrors, setLineErrors] = React.useState<Record<string, string>>({})
  const [values, setValues] = React.useState(EMPTY_VALUES)
  const [delivery, setDelivery] = React.useState("standard")
  const [requiredBy, setRequiredBy] = React.useState<Date | undefined>(undefined)
  const [errors, setErrors] = React.useState<Partial<Record<FieldName, string>>>({})
  const [focusTarget, setFocusTarget] = React.useState<{ id: string } | null>(null)
  const [sent, setSent] = React.useState<Sent | null>(null)

  const menuButtonRef = React.useRef<HTMLButtonElement>(null)
  const confirmationRef = React.useRef<HTMLHeadingElement>(null)

  // Runs after the error lines are rendered, so aria-describedby already
  // points at a line that exists when the field takes focus.
  React.useEffect(() => {
    if (focusTarget) document.getElementById(focusTarget.id)?.focus()
  }, [focusTarget])

  React.useEffect(() => {
    if (sent) confirmationRef.current?.focus()
  }, [sent])

  const subtotal = lines.reduce((sum, line) => sum + linePence(line), 0)

  function closeMenuOnEscape(event: React.KeyboardEvent) {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  function changeQuantity(part: string, quantity: string) {
    setLines((current) =>
      current.map((line) => (line.part === part ? { ...line, quantity } : line))
    )
    setLineErrors((current) => {
      if (!(part in current)) return current
      const next = { ...current }
      delete next[part]
      return next
    })
  }

  function removeLine(part: string) {
    const index = lines.findIndex((line) => line.part === part)
    const next = lines.filter((line) => line.part !== part)
    const neighbour = next[index] ?? next[index - 1]
    setLines(next)
    setLineErrors((current) => {
      const rest = { ...current }
      delete rest[part]
      return rest
    })
    if (neighbour) setFocusTarget({ id: quantityId(neighbour.part) })
  }

  function changeValue(field: TextField, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    clearError(field)
  }

  function clearError(field: FieldName) {
    setErrors((current) => {
      if (!(field in current)) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextLineErrors: Record<string, string> = {}
    for (const line of lines) {
      if (parseQuantity(line.quantity) === null) {
        nextLineErrors[line.part] = "Enter a whole number from 1 to 10,000."
      }
    }

    const company = values.company.trim()
    const name = values.name.trim()
    const email = values.email.trim()
    const phone = values.phone.trim()
    const address = values.address.trim()
    const town = values.town.trim()
    const postcode = values.postcode.trim()

    const nextErrors: Partial<Record<FieldName, string>> = {}
    if (company === "") nextErrors.company = "Enter your company's name."
    if (name === "") nextErrors.name = "Enter your name."
    if (email === "") {
      nextErrors.email = "Enter your email address."
    } else {
      const parts = email.split("@")
      if (parts.length !== 2 || parts[0] === "" || !parts[1].includes(".")) {
        nextErrors.email = "Enter an email address such as buyer@pellam.example."
      }
    }
    if (phone !== "" && !/^\+?\d{10,15}$/.test(phone.replace(/\s/g, ""))) {
      nextErrors.phone =
        "Enter a phone number of 10 to 15 digits, or leave it empty."
    }
    if (address === "") nextErrors.address = "Enter the delivery address."
    if (town === "") nextErrors.town = "Enter the town."
    if (!/^[a-z]{1,2}\d[a-z\d]? ?\d[a-z]{2}$/i.test(postcode)) {
      nextErrors.postcode = "Enter a postcode such as AC7 1RT."
    }
    if (!requiredBy) {
      nextErrors.requiredBy = "Enter a date."
    } else if (requiredBy < EARLIEST) {
      nextErrors.requiredBy =
        "Choose 16 November 2026 or later. We need two working days."
    }

    setLineErrors(nextLineErrors)
    setErrors(nextErrors)

    const firstLine = lines.find((line) => line.part in nextLineErrors)
    const order: FieldName[] = [
      "company",
      "name",
      "email",
      "phone",
      "address",
      "town",
      "postcode",
      "requiredBy",
    ]
    const firstField = order.find((field) => field in nextErrors)

    if (firstLine) {
      setFocusTarget({ id: quantityId(firstLine.part) })
    } else if (firstField) {
      setFocusTarget({ id: firstField })
    } else {
      setSent({ lines: lines.length, subtotal, email })
    }
  }

  function textField(
    field: TextField,
    label: string,
    props: React.ComponentProps<"input">,
    options: { className?: string; wrapper?: string } = {}
  ) {
    const error = errors[field]
    const input = (
      <Input
        id={field}
        name={field}
        value={values[field]}
        onChange={(event) => changeValue(field, event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(error && `${field}-error`)}
        className="px-2 text-body md:text-body"
        {...props}
      />
    )
    return (
      <Field id={field} label={label} error={error} className={options.className}>
        {options.wrapper ? <div className={options.wrapper}>{input}</div> : input}
      </Field>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <header className="border-b border-border bg-card">
        <div className={cn(CONTAINER, "flex items-center gap-6 py-3")}>
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
                  <NavLink {...link} />
                </li>
              ))}
            </ul>
          </nav>
          <p className={cn(SMALL_FIGURE, "ml-auto hidden md:block")}>
            Sales 01632 960 418
          </p>
          <Button
            ref={menuButtonRef}
            variant="secondary"
            className={cn(BUTTON, "ml-auto md:hidden")}
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

      <main className="flex-1 py-6">
        <div className={cn(CONTAINER, "flex flex-col gap-6")}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className={LABEL}>Quote</p>
              <h1 className="text-h1">Request a quote</h1>
            </div>
          </div>

          <div>
            {sent ? null : (
              <form
                noValidate
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                <section aria-labelledby="lines-heading" className={ROWS_PANEL}>
                  <div
                    className={cn(
                      PANEL_HEADING,
                      "border-b border-border px-4 py-3"
                    )}
                  >
                    <h2 id="lines-heading" className="text-h2">
                      Lines
                    </h2>
                    <p aria-live="polite" className={SMALL_FIGURE}>
                      {lines.length} {lines.length === 1 ? "line" : "lines"}
                    </p>
                  </div>
                  <Table label="Lines" className="text-body">
                    <TableHeader>
                      <TableRow>
                        <TableHead className={HEAD_CELL}>Part number</TableHead>
                        <TableHead className={cn(HEAD_CELL, "min-w-48")}>
                          Description
                        </TableHead>
                        <TableHead className={cn(HEAD_CELL, "text-right")}>
                          Quantity
                        </TableHead>
                        <TableHead className={cn(HEAD_CELL, "text-right")}>
                          Unit price (£)
                        </TableHead>
                        <TableHead className={cn(HEAD_CELL, "text-right")}>
                          Line total (£)
                        </TableHead>
                        <TableHead className={HEAD_CELL}>
                          <span className="sr-only">Action</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lines.map((line) => {
                        const id = quantityId(line.part)
                        const error = lineErrors[line.part]
                        const quantity = parseQuantity(line.quantity)
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
                              className={cn(CELL, "text-right whitespace-normal")}
                            >
                              <div className="flex flex-col items-end gap-2">
                                <Input
                                  id={id}
                                  name={id}
                                  inputMode="numeric"
                                  autoComplete="off"
                                  aria-label={`Quantity of ${line.part}`}
                                  aria-invalid={error ? true : undefined}
                                  aria-describedby={describedBy(
                                    error && `${id}-error`
                                  )}
                                  value={line.quantity}
                                  onChange={(event) =>
                                    changeQuantity(line.part, event.target.value)
                                  }
                                  className="w-24 px-2 text-right font-mono text-body tabular-nums md:text-body"
                                />
                                {error ? (
                                  <ErrorLine id={`${id}-error`} className="max-w-48">
                                    {error}
                                  </ErrorLine>
                                ) : null}
                              </div>
                            </TableCell>
                            <TableCell
                              className={cn(
                                CELL,
                                "text-right font-mono tabular-nums"
                              )}
                            >
                              {money(unitPence(line, quantity))}
                            </TableCell>
                            <TableCell
                              className={cn(
                                CELL,
                                "text-right font-mono tabular-nums"
                              )}
                            >
                              {money(linePence(line))}
                            </TableCell>
                            <TableCell className={cn(CELL, "text-right")}>
                              <Button
                                variant="secondary"
                                className={BUTTON}
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
                      <TableRow className="hover:bg-transparent">
                        <TableCell
                          colSpan={4}
                          className={cn(
                            CELL,
                            LABEL,
                            "border-t border-border text-right"
                          )}
                        >
                          Subtotal, excluding VAT
                        </TableCell>
                        <TableCell
                          className={cn(
                            CELL,
                            "border-t border-border text-right font-heading text-h2 tabular-nums"
                          )}
                        >
                          {money(subtotal)}
                        </TableCell>
                        <TableCell
                          className={cn(CELL, "border-t border-border")}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </section>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                  <section
                    aria-labelledby="details-heading"
                    className={cn(PANEL, "flex flex-col gap-4 lg:col-span-8")}
                  >
                    <div className={PANEL_HEADING}>
                      <h2 id="details-heading" className="text-h2">
                        Company and delivery
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {textField(
                        "company",
                        "Company",
                        { autoComplete: "organization" },
                        { className: "md:col-span-2" }
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
                      <Field id="delivery" label="Delivery">
                        <Select
                          items={DELIVERY_CHOICES}
                          value={delivery}
                          onValueChange={(value) => {
                            if (value !== null) setDelivery(value)
                          }}
                        >
                          <SelectTrigger id="delivery">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DELIVERY_CHOICES.map((choice) => (
                              <SelectItem key={choice.value} value={choice.value}>
                                {choice.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      {textField(
                        "address",
                        "Delivery address",
                        { autoComplete: "street-address" },
                        { className: "md:col-span-2" }
                      )}
                      {textField("town", "Town", {
                        autoComplete: "address-level2",
                      })}
                      {textField(
                        "postcode",
                        "Postcode",
                        { autoComplete: "postal-code" },
                        { wrapper: "w-32" }
                      )}
                      <Field
                        id="requiredBy"
                        labelId="requiredBy-label"
                        label="Required by"
                        helper="Monday 16 November 2026 or later."
                        error={errors.requiredBy}
                      >
                        <DatePicker
                          id="requiredBy"
                          labelId="requiredBy-label"
                          value={requiredBy}
                          onValueChange={(date) => {
                            setRequiredBy(date)
                            clearError("requiredBy")
                          }}
                          today={TODAY}
                          aria-invalid={errors.requiredBy ? true : undefined}
                          aria-describedby={describedBy(
                            "requiredBy-help",
                            errors.requiredBy && "requiredBy-error"
                          )}
                        />
                      </Field>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
                      <Button type="submit" className={BUTTON}>
                        Request a quote
                      </Button>
                      <p className={SMALL_FIGURE}>
                        We reply by 17:00 on the next working day.
                      </p>
                    </div>
                  </section>

                  <section
                    aria-labelledby="how-heading"
                    className={cn(ROWS_PANEL, "lg:col-span-4")}
                  >
                    <div
                      className={cn(
                        PANEL_HEADING,
                        "border-b border-border px-4 py-3"
                      )}
                    >
                      <h2 id="how-heading" className="text-h2">
                        How quotes work
                      </h2>
                    </div>
                    <ul>
                      {QUOTE_NOTES.map((note, index) => (
                        <li
                          key={note}
                          className={cn(
                            "px-4 py-3 text-body",
                            index > 0 && "border-t border-border"
                          )}
                        >
                          {note}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </form>
            )}
            <div role="status">
              {sent ? (
                <div className={cn(PANEL, "flex flex-col gap-4")}>
                  <h2
                    ref={confirmationRef}
                    tabIndex={-1}
                    className="text-h2 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
                  >
                    Quote requested
                  </h2>
                  <dl className="w-full max-w-md">
                    <ConfirmationRow first term="Reference">
                      TQ-26-04173
                    </ConfirmationRow>
                    <ConfirmationRow term="Lines">{sent.lines}</ConfirmationRow>
                    <ConfirmationRow term="Subtotal, excluding VAT">
                      £{money(sent.subtotal)}
                    </ConfirmationRow>
                    <ConfirmationRow term="Reply by">
                      <time dateTime="2026-11-13T17:00">17:00, 13 Nov 2026</time>
                    </ConfirmationRow>
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
                      BUTTON,
                      "self-start"
                    )}
                  >
                    Back to the catalogue
                  </a>
                </div>
              ) : null}
            </div>
          </div>
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

function NavLink({
  label,
  href,
  className,
}: {
  label: string
  href: string
  className?: string
}) {
  const current = href === CURRENT_HREF
  return (
    <a
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "font-mono text-label transition-colors duration-150",
        current
          ? "text-foreground underline underline-offset-4"
          : "text-muted-foreground hover:text-foreground",
        FOCUS,
        className
      )}
    >
      {label}
    </a>
  )
}

function ConfirmationRow({
  term,
  first = false,
  children,
}: {
  term: string
  first?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-3 py-2",
        !first && "border-t border-border"
      )}
    >
      <dt className={LABEL}>{term}</dt>
      <dd className="text-right font-mono tabular-nums">{children}</dd>
    </div>
  )
}

export default App
