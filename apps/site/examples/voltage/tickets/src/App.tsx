import { useEffect, useRef, useState, type FormEvent } from "react"
import { Check, CircleAlert, Minus, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const label = "font-mono text-label font-bold uppercase text-foreground"
const smallPrint = "font-mono text-label text-muted-foreground"
const buttonText = "h-auto px-5 py-2 font-mono text-label font-bold uppercase"
const navLink = cn(
  label,
  "text-foreground underline-offset-4 hover:underline",
  focusRing
)

type TicketType = {
  id: string
  name: string
  price: number
  includes: [string, string, string]
  soldOut?: boolean
}

const TICKETS: TicketType[] = [
  {
    id: "weekend",
    name: "Weekend",
    price: 118,
    includes: [
      "Both days",
      "All three stages and the Drawing Office talks",
      "Re-entry until 22:00",
    ],
  },
  {
    id: "friday",
    name: "Friday",
    price: 64,
    includes: [
      "Friday from 16:00",
      "All stages",
      "The Fold Press workshop if places are left",
    ],
  },
  {
    id: "saturday",
    name: "Saturday",
    price: 72,
    includes: ["Saturday from 12:00", "All stages", "The Drawing Office talks"],
    soldOut: true,
  },
  {
    id: "under-18",
    name: "Under 18 weekend",
    price: 59,
    includes: [
      "Both days",
      "All three stages and the Drawing Office talks",
      "Entry for ages 13 to 17 with an adult who holds a ticket",
    ],
  },
]

const MAX_QUANTITY = 8

type Quantities = Record<string, number>
type Errors = { name?: string; email?: string; tickets?: string }
type Confirmation = { count: number; total: number; email: string }

const emptyQuantities = (): Quantities =>
  Object.fromEntries(TICKETS.map((t) => [t.id, 0]))

const euros = (amount: number) => `€${amount.toLocaleString("en-US")}`

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

function DateRange() {
  return (
    <>
      <time dateTime="2026-12-04">4</time>–
      <time dateTime="2026-12-05">5 Dec 2026</time>
    </>
  )
}

function ErrorLine({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      className="flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  )
}

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  const links = [
    { href: "/line-up", text: "Line-up" },
    { href: "/tickets", text: "Tickets", current: true },
    { href: "/info", text: "Info" },
  ]

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-8 gap-y-3 px-3 py-3 md:px-5">
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground underline-offset-4 hover:underline",
            focusRing
          )}
        >
          Tremor Days
        </a>
        <nav aria-label="Main" className="hidden gap-5 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(
                navLink,
                link.current && "underline decoration-2 underline-offset-4"
              )}
            >
              {link.text}
            </a>
          ))}
        </nav>
        <p className={cn(label, "ml-auto hidden md:block")}>
          <DateRange />
        </p>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className={cn(buttonText, "ml-auto md:hidden")}
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
        <div className="mx-auto max-w-[1200px] px-3 py-2 md:px-5">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(
                navLink,
                "block py-2",
                link.current && "underline decoration-2 underline-offset-4"
              )}
            >
              {link.text}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-3 py-8 md:px-5">
        <p className="font-heading text-h2">Tremor Days</p>
        <p className="text-body">
          Tremor Days is a two-day music and design festival on the old quays of
          Varsby Docks.
        </p>
        <p className={label}>
          Varsby Docks · <DateRange /> · © 2026 Tremor Days
        </p>
      </div>
    </footer>
  )
}

export function App() {
  const [quantities, setQuantities] = useState<Quantities>(emptyQuantities)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)

  const nameInput = useRef<HTMLInputElement>(null)
  const emailInput = useRef<HTMLInputElement>(null)
  const weekendPlus = useRef<HTMLButtonElement>(null)
  const message = useRef<HTMLParagraphElement>(null)
  const pendingFocus = useRef<"message" | "name" | null>(null)

  useEffect(() => {
    if (pendingFocus.current === "message") message.current?.focus()
    if (pendingFocus.current === "name") nameInput.current?.focus()
    pendingFocus.current = null
  }, [confirmation])

  const lines = TICKETS.filter((t) => quantities[t.id] > 0).map((t) => ({
    id: t.id,
    name: t.name,
    quantity: quantities[t.id],
    amount: quantities[t.id] * t.price,
  }))
  const total = lines.reduce((sum, line) => sum + line.amount, 0)
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)

  function change(id: string, delta: number) {
    setQuantities((current) => {
      const next = Math.min(MAX_QUANTITY, Math.max(0, current[id] + delta))
      return { ...current, [id]: next }
    })
    if (delta > 0) {
      setErrors((current) => ({ ...current, tickets: undefined }))
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Errors = {}
    if (name.trim() === "") next.name = "Enter your name."
    if (!isEmail(email.trim()))
      next.email = "Enter an email address, like ada@example.com."
    if (count === 0) next.tickets = "Choose at least one ticket first."
    setErrors(next)

    if (next.name) return nameInput.current?.focus()
    if (next.email) return emailInput.current?.focus()
    if (next.tickets) return weekendPlus.current?.focus()

    pendingFocus.current = "message"
    setConfirmation({ count, total, email: email.trim() })
  }

  function startOver() {
    setQuantities(emptyQuantities())
    setName("")
    setEmail("")
    setErrors({})
    pendingFocus.current = "name"
    setConfirmation(null)
  }

  const locked = confirmation !== null

  return (
    <div className="min-h-screen bg-background font-sans text-body text-foreground">
      <SiteHeader />

      <main className="mx-auto flex max-w-[1200px] flex-col gap-16 px-3 py-8 md:px-5 md:py-16">
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <p className={label}>
              Tremor Days · <DateRange />
            </p>
            <h1 className="text-h1 md:text-display">Tickets</h1>
          </div>
          <p className="max-w-xl text-body">
            Choose your tickets, then leave a name and an email. No payment is
            taken on this page.
          </p>
        </section>

        <section
          aria-labelledby="order-heading"
          className="flex flex-col gap-8"
        >
          <h2 id="order-heading" className="sr-only">
            Your order
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <ul className="flex list-none flex-col gap-5 p-0 md:col-span-7">
              {TICKETS.map((ticket) => {
                const quantity = quantities[ticket.id]
                return (
                  <li
                    key={ticket.id}
                    className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-h2">{ticket.name}</h3>
                      {ticket.soldOut && (
                        <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-bold text-tertiary-foreground uppercase">
                          Sold out
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-heading text-h1 tabular-nums">
                        {euros(ticket.price)}
                      </p>
                      <p className={label}>Per person</p>
                    </div>
                    <ul className="flex list-none flex-col gap-3 p-0">
                      {ticket.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check
                            className="mt-1 size-4 shrink-0"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
                      <p className={label}>Quantity</p>
                      <div
                        role="group"
                        aria-label={`${ticket.name} tickets`}
                        className="flex items-center gap-3"
                      >
                        {ticket.soldOut ? (
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label={`One fewer ${ticket.name} ticket`}
                            disabled
                          >
                            <Minus className="size-4" aria-hidden="true" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label={`One fewer ${ticket.name} ticket`}
                            focusableWhenDisabled
                            disabled={locked || quantity === 0}
                            onClick={() => change(ticket.id, -1)}
                          >
                            <Minus className="size-4" aria-hidden="true" />
                          </Button>
                        )}
                        <p
                          aria-live="polite"
                          className="flex w-8 justify-center font-heading text-h2 tabular-nums"
                        >
                          {quantity}
                        </p>
                        {ticket.soldOut ? (
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label={`One more ${ticket.name} ticket`}
                            disabled
                          >
                            <Plus className="size-4" aria-hidden="true" />
                          </Button>
                        ) : (
                          <Button
                            ref={
                              ticket.id === "weekend" ? weekendPlus : undefined
                            }
                            variant="outline"
                            size="icon"
                            aria-label={`One more ${ticket.name} ticket`}
                            aria-describedby={
                              ticket.id === "weekend" && errors.tickets
                                ? "tickets-error"
                                : undefined
                            }
                            focusableWhenDisabled
                            disabled={locked || quantity === MAX_QUANTITY}
                            onClick={() => change(ticket.id, 1)}
                          >
                            <Plus className="size-4" aria-hidden="true" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="flex flex-col gap-5 md:col-span-5">
              <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
                <h3 className="text-h2">Summary</h3>
                <ul className="flex list-none flex-col gap-3 p-0">
                  {lines.length === 0 ? (
                    <li>No tickets chosen yet.</li>
                  ) : (
                    lines.map((line) => (
                      <li
                        key={line.id}
                        className="flex items-baseline justify-between gap-3"
                      >
                        <span>
                          {line.quantity} × {line.name}
                        </span>
                        <span className="font-mono tabular-nums">
                          {euros(line.amount)}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
                <div className="flex items-baseline justify-between gap-3 border-t border-border pt-5">
                  <p className={label}>Total</p>
                  <p className="font-heading text-h1 tabular-nums">
                    {euros(total)}
                  </p>
                </div>
                <p className={smallPrint}>
                  This is a demo. No payment is taken and no tickets are issued.
                </p>
              </div>

              <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
                <h3 className="text-h2">Your details</h3>
                <div>
                  {!confirmation && (
                    <form
                      noValidate
                      onSubmit={onSubmit}
                      className="flex flex-col gap-5"
                    >
                      <div className="flex flex-col gap-2">
                        <label htmlFor="name" className={cn(label, "block")}>
                          Name
                        </label>
                        <Input
                          ref={nameInput}
                          id="name"
                          name="name"
                          autoComplete="name"
                          value={name}
                          onChange={(event) => {
                            setName(event.target.value)
                            setErrors((current) => ({
                              ...current,
                              name: undefined,
                            }))
                          }}
                          aria-invalid={errors.name ? true : undefined}
                          aria-describedby={
                            errors.name ? "name-error" : undefined
                          }
                          className="h-auto px-3 py-2 text-body md:text-body"
                        />
                        {errors.name && (
                          <ErrorLine id="name-error">{errors.name}</ErrorLine>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className={cn(label, "block")}>
                          Email
                        </label>
                        <Input
                          ref={emailInput}
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value)
                            setErrors((current) => ({
                              ...current,
                              email: undefined,
                            }))
                          }}
                          aria-invalid={errors.email ? true : undefined}
                          aria-describedby={
                            errors.email
                              ? "email-hint email-error"
                              : "email-hint"
                          }
                          className="h-auto px-3 py-2 text-body md:text-body"
                        />
                        <p id="email-hint" className={smallPrint}>
                          We would send the tickets here.
                        </p>
                        {errors.email && (
                          <ErrorLine id="email-error">{errors.email}</ErrorLine>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          type="submit"
                          aria-describedby={
                            errors.tickets ? "tickets-error" : undefined
                          }
                          className={cn(buttonText, "w-full")}
                        >
                          Reserve tickets
                        </Button>
                        {errors.tickets && (
                          <ErrorLine id="tickets-error">
                            {errors.tickets}
                          </ErrorLine>
                        )}
                      </div>
                    </form>
                  )}
                  <div role="status">
                    {confirmation && (
                      <div className="flex flex-col gap-3">
                        <p
                          ref={message}
                          tabIndex={-1}
                          className={cn(
                            "flex items-start gap-2 text-body font-bold",
                            codeFocusRing
                          )}
                        >
                          <Check
                            className="mt-1 size-4 shrink-0"
                            aria-hidden="true"
                          />
                          Reserved: {confirmation.count}{" "}
                          {confirmation.count === 1 ? "ticket" : "tickets"},{" "}
                          {euros(confirmation.total)}.
                        </p>
                        <p className="text-body">
                          Tickets would go to {confirmation.email}. This is a
                          demo, so nothing was charged or sent.
                        </p>
                      </div>
                    )}
                  </div>
                  {confirmation && (
                    <div className="pt-3">
                      <Button
                        variant="outline"
                        onClick={startOver}
                        className={buttonText}
                      >
                        Start a new order
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
