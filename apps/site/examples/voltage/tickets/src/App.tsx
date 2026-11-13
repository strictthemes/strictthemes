import { useEffect, useRef, useState } from "react"
import type { FormEvent, KeyboardEvent } from "react"
import { Check, CircleAlert, Minus, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusOutline =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const labelClass = "font-mono text-label font-bold uppercase text-foreground"
const buttonText = "h-auto px-5 py-2 font-mono text-label font-bold uppercase"
const panel = "flex flex-col rounded-xl border border-border bg-card p-5"
const navLink = cn(
  "font-mono text-label font-bold text-foreground uppercase underline-offset-4 hover:underline",
  focusOutline
)
const currentLink = "underline decoration-2 underline-offset-4"
const errorLine = "flex items-start gap-2 font-mono text-label text-destructive"
const smallPrint = "font-mono text-label text-muted-foreground"

type TicketId = "weekend" | "friday" | "saturday" | "under18"

type Ticket = {
  id: TicketId
  name: string
  price: number
  includes: [string, string, string]
  soldOut?: boolean
}

const TICKETS: Ticket[] = [
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
    id: "under18",
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

const EMPTY_QUANTITIES: Record<TicketId, number> = {
  weekend: 0,
  friday: 0,
  saturday: 0,
  under18: 0,
}

const NAV = [
  { label: "Line-up", href: "/line-up" },
  { label: "Tickets", href: "/tickets", current: true },
  { label: "Info", href: "/info" },
]

function euros(amount: number) {
  return `€${amount.toLocaleString("en-US")}`
}

function ticketWord(count: number) {
  return count === 1 ? "ticket" : "tickets"
}

function isEmail(value: string) {
  const at = value.indexOf("@")
  if (at < 1) return false
  const domain = value.slice(at + 1)
  if (domain.includes("@")) return false
  return /[^.]\.[^.]/.test(domain)
}

function FestivalDates() {
  return (
    <>
      <time dateTime="2026-12-04">4</time>–
      <time dateTime="2026-12-05">5 Dec 2026</time>
    </>
  )
}

type Errors = { name?: string; email?: string; tickets?: string }

type Order = { count: number; total: number; email: string }

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (open && event.key === "Escape") {
      setOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-8 gap-y-3 px-3 py-3 md:px-5">
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground underline-offset-4 hover:underline",
            focusOutline
          )}
        >
          Tremor Days
        </a>
        <nav aria-label="Main" className="hidden gap-5 md:flex">
          {NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(navLink, link.current && currentLink)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className={cn(labelClass, "ml-auto hidden tabular-nums md:block")}>
          <FestivalDates />
        </p>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          className={cn(buttonText, "ml-auto md:hidden")}
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <div className="mx-auto max-w-[1200px] px-3 py-2 md:px-5">
          {NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(navLink, "block py-2", link.current && currentLink)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-3 py-8 md:px-5">
        <p className="font-heading text-h2">Tremor Days</p>
        <p className="text-body">
          A two-day music and design festival at Varsby Docks.
        </p>
        <p className={cn(labelClass, "tabular-nums")}>
          Varsby Docks · <FestivalDates /> · © 2026 Tremor Days
        </p>
      </div>
    </footer>
  )
}

export function App() {
  const [quantities, setQuantities] =
    useState<Record<TicketId, number>>(EMPTY_QUANTITIES)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [order, setOrder] = useState<Order | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const weekendPlusRef = useRef<HTMLButtonElement>(null)
  const messageRef = useRef<HTMLParagraphElement>(null)
  const focusNameNext = useRef(false)

  const lines = TICKETS.filter((ticket) => quantities[ticket.id] > 0).map(
    (ticket) => ({
      ticket,
      quantity: quantities[ticket.id],
      amount: quantities[ticket.id] * ticket.price,
    })
  )
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)
  const total = lines.reduce((sum, line) => sum + line.amount, 0)

  useEffect(() => {
    if (order) {
      messageRef.current?.focus()
    } else if (focusNameNext.current) {
      focusNameNext.current = false
      nameRef.current?.focus()
    }
  }, [order])

  function change(id: TicketId, step: number) {
    const next = Math.min(MAX_QUANTITY, Math.max(0, quantities[id] + step))
    setQuantities({ ...quantities, [id]: next })
    if (next > 0 && errors.tickets) {
      setErrors({ ...errors, tickets: undefined })
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const next: Errors = {}
    if (!trimmedName) next.name = "Enter your name."
    if (!isEmail(trimmedEmail))
      next.email = "Enter an email address, like ada@example.com."
    if (count === 0) next.tickets = "Choose at least one ticket first."
    setErrors(next)

    if (next.name) nameRef.current?.focus()
    else if (next.email) emailRef.current?.focus()
    else if (next.tickets) weekendPlusRef.current?.focus()
    else {
      setName(trimmedName)
      setEmail(trimmedEmail)
      setOrder({ count, total, email: trimmedEmail })
    }
  }

  function startNewOrder() {
    setQuantities(EMPTY_QUANTITIES)
    setName("")
    setEmail("")
    setErrors({})
    setOrder(null)
    focusNameNext.current = true
  }

  return (
    <div className="min-h-screen bg-background font-sans text-body text-foreground">
      <Header />

      <main className="mx-auto flex max-w-[1200px] flex-col gap-16 px-3 py-8 md:px-5 md:py-16">
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <p className={cn(labelClass, "tabular-nums")}>
              Tremor Days · <FestivalDates />
            </p>
            <h1 className="text-h1 md:text-display">Tickets</h1>
          </div>
          <p className="max-w-xl text-body">
            Choose your tickets, then leave a name and an email. No payment is
            taken on this page.
          </p>
        </section>

        <section className="flex flex-col gap-8">
          <h2 className="sr-only">Your order</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <ul className="flex flex-col gap-5 md:col-span-7">
              {TICKETS.map((ticket) => {
                const quantity = quantities[ticket.id]
                const isWeekend = ticket.id === "weekend"
                return (
                  <li key={ticket.id} className={cn(panel, "gap-5")}>
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
                      <p className={labelClass}>Per person</p>
                    </div>
                    <ul className="flex flex-col gap-3">
                      {ticket.includes.map((line) => (
                        <li key={line} className="flex items-start gap-2">
                          <Check
                            aria-hidden="true"
                            className="mt-1 size-4 shrink-0"
                          />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
                      <p className={labelClass}>Quantity</p>
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
                            <Minus aria-hidden="true" className="size-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label={`One fewer ${ticket.name} ticket`}
                            focusableWhenDisabled
                            disabled={quantity === 0 || order !== null}
                            onClick={() => change(ticket.id, -1)}
                          >
                            <Minus aria-hidden="true" className="size-4" />
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
                            <Plus aria-hidden="true" className="size-4" />
                          </Button>
                        ) : (
                          <Button
                            ref={isWeekend ? weekendPlusRef : undefined}
                            variant="outline"
                            size="icon"
                            aria-label={`One more ${ticket.name} ticket`}
                            aria-describedby={
                              isWeekend && errors.tickets
                                ? "tickets-error"
                                : undefined
                            }
                            focusableWhenDisabled
                            disabled={
                              quantity >= MAX_QUANTITY || order !== null
                            }
                            onClick={() => change(ticket.id, 1)}
                          >
                            <Plus aria-hidden="true" className="size-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="flex flex-col gap-5 md:col-span-5">
              <div className={cn(panel, "gap-5")}>
                <h3 className="text-h2">Summary</h3>
                {lines.length > 0 ? (
                  <ul className="flex flex-col gap-3">
                    {lines.map((line) => (
                      <li
                        key={line.ticket.id}
                        className="flex items-baseline justify-between gap-3"
                      >
                        <span>
                          {line.quantity} × {line.ticket.name}
                        </span>
                        <span className="font-mono tabular-nums">
                          {euros(line.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-body">No tickets chosen yet.</p>
                )}
                <div className="flex items-baseline justify-between gap-3 border-t border-border pt-5">
                  <p className={labelClass}>Total</p>
                  <p className="font-heading text-h1 tabular-nums">
                    {euros(total)}
                  </p>
                </div>
                <p className={smallPrint}>
                  This is a demo. No payment is taken and no tickets are issued.
                </p>
              </div>

              <div className={cn(panel, "gap-5")}>
                <h3 className="text-h2">Your details</h3>
                <div>
                  {!order && (
                    <form
                      noValidate
                      onSubmit={onSubmit}
                      className="flex flex-col gap-5"
                    >
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="name"
                          className={cn(labelClass, "block")}
                        >
                          Name
                        </label>
                        <Input
                          ref={nameRef}
                          id="name"
                          name="name"
                          autoComplete="name"
                          value={name}
                          onChange={(event) => {
                            setName(event.target.value)
                            if (errors.name)
                              setErrors({ ...errors, name: undefined })
                          }}
                          aria-invalid={errors.name ? true : undefined}
                          aria-describedby={
                            errors.name ? "name-error" : undefined
                          }
                          className="h-auto px-3 py-2 text-body md:text-body"
                        />
                        {errors.name && (
                          <p id="name-error" className={errorLine}>
                            <CircleAlert
                              aria-hidden="true"
                              className="size-4 shrink-0"
                            />
                            <span>{errors.name}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="email"
                          className={cn(labelClass, "block")}
                        >
                          Email
                        </label>
                        <Input
                          ref={emailRef}
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value)
                            if (errors.email)
                              setErrors({ ...errors, email: undefined })
                          }}
                          aria-invalid={errors.email ? true : undefined}
                          aria-describedby={
                            errors.email
                              ? "email-help email-error"
                              : "email-help"
                          }
                          className="h-auto px-3 py-2 text-body md:text-body"
                        />
                        <p id="email-help" className={smallPrint}>
                          We would send the tickets here.
                        </p>
                        {errors.email && (
                          <p id="email-error" className={errorLine}>
                            <CircleAlert
                              aria-hidden="true"
                              className="size-4 shrink-0"
                            />
                            <span>{errors.email}</span>
                          </p>
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
                          <p id="tickets-error" className={errorLine}>
                            <CircleAlert
                              aria-hidden="true"
                              className="size-4 shrink-0"
                            />
                            <span>{errors.tickets}</span>
                          </p>
                        )}
                      </div>
                    </form>
                  )}

                  <div role="status">
                    {order && (
                      <div className="flex flex-col gap-3">
                        <p
                          ref={messageRef}
                          tabIndex={-1}
                          className={cn(
                            "flex items-start gap-2 text-body font-bold",
                            codeFocusOutline
                          )}
                        >
                          <Check
                            aria-hidden="true"
                            className="mt-1 size-4 shrink-0"
                          />
                          <span>
                            Reserved: {order.count} {ticketWord(order.count)},{" "}
                            {euros(order.total)}.
                          </span>
                        </p>
                        <p className="text-body wrap-break-word">
                          Tickets would go to {order.email}. This is a demo, so
                          nothing was charged or sent.
                        </p>
                      </div>
                    )}
                  </div>

                  {order && (
                    <div className="pt-3">
                      <Button
                        variant="outline"
                        onClick={startNewOrder}
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

      <Footer />
    </div>
  )
}

export default App
