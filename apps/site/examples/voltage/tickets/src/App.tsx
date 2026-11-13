import { useEffect, useRef, useState, type FormEvent } from "react"
import { Check, CircleAlert, Minus, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const FOCUS_CODE =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const LABEL = "font-mono text-label font-bold uppercase text-foreground"
const SMALL = "font-mono text-label text-muted-foreground"
const CONTAINER = "mx-auto max-w-[1200px] px-3 md:px-5"
const PANEL = "flex flex-col gap-5 rounded-xl border border-border bg-card p-5"
const BUTTON = "h-auto px-5 py-2 font-mono text-label font-bold uppercase"
const NAV_LINK = cn(
  LABEL,
  "hover:underline underline-offset-4",
  FOCUS
)
const ERROR_LINE =
  "flex items-start gap-2 font-mono text-label text-destructive"

const MAX_QTY = 8

type TicketId = "weekend" | "friday" | "saturday" | "under18"

type Ticket = {
  id: TicketId
  name: string
  price: number
  includes: string[]
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
      "Fold Press workshop if places are left",
    ],
  },
  {
    id: "saturday",
    name: "Saturday",
    price: 72,
    includes: ["Saturday from 12:00", "All stages", "Drawing Office talks"],
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

const EMPTY_QUANTITIES: Record<TicketId, number> = {
  weekend: 0,
  friday: 0,
  saturday: 0,
  under18: 0,
}

function euros(amount: number) {
  return `€${amount.toLocaleString("en-US")}`
}

function isEmail(value: string) {
  return /^[^@\s]+@[^@\s]*[^@\s.]\.[^@\s.][^@\s]*$/.test(value)
}

type Errors = { name?: string; email?: string; tickets?: string }

type Confirmed = { count: number; total: number; email: string }

function FestivalDates() {
  return (
    <>
      <time dateTime="2026-12-04">4</time>–
      <time dateTime="2026-12-05">5 Dec 2026</time>
    </>
  )
}

function Header() {
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
    { href: "/line-up", label: "Line-up" },
    { href: "/tickets", label: "Tickets", current: true },
    { href: "/info", label: "Info" },
  ]

  return (
    <header className="border-b border-border">
      <div
        className={cn(
          CONTAINER,
          "flex flex-wrap items-center gap-x-8 gap-y-3 py-3"
        )}
      >
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground hover:underline underline-offset-4",
            FOCUS
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
                NAV_LINK,
                link.current && "underline decoration-2 underline-offset-4"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className={cn(LABEL, "ml-auto hidden md:block")}>
          <FestivalDates />
        </p>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className={cn(BUTTON, "ml-auto md:hidden")}
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
        <div className={cn(CONTAINER, "py-2")}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(
                NAV_LINK,
                "block py-2",
                link.current && "underline decoration-2 underline-offset-4"
              )}
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
      <div className={cn(CONTAINER, "flex flex-col gap-3 py-8")}>
        <p className="font-heading text-h2">Tremor Days</p>
        <p className="max-w-xl text-body">
          A two-day music and design festival on the old quays of Varsby Docks.
        </p>
        <p className={LABEL}>
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
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const weekendPlusRef = useRef<HTMLButtonElement>(null)
  const messageRef = useRef<HTMLParagraphElement>(null)
  const focusNameAfterReset = useRef(false)

  const lines = TICKETS.filter((ticket) => quantities[ticket.id] > 0).map(
    (ticket) => ({
      ...ticket,
      quantity: quantities[ticket.id],
      amount: quantities[ticket.id] * ticket.price,
    })
  )
  const total = lines.reduce((sum, line) => sum + line.amount, 0)
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)

  useEffect(() => {
    if (confirmed) messageRef.current?.focus()
  }, [confirmed])

  useEffect(() => {
    if (!confirmed && focusNameAfterReset.current) {
      focusNameAfterReset.current = false
      nameRef.current?.focus()
    }
  }, [confirmed])

  function changeQuantity(id: TicketId, step: number) {
    const next = Math.min(MAX_QTY, Math.max(0, quantities[id] + step))
    setQuantities({ ...quantities, [id]: next })
    if (next > 0 && errors.tickets) {
      setErrors({ ...errors, tickets: undefined })
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Errors = {}
    if (!name.trim()) next.name = "Enter your name."
    if (!isEmail(email.trim()))
      next.email = "Enter an email address, like ada@example.com."
    if (count === 0) next.tickets = "Choose at least one ticket first."
    setErrors(next)

    if (next.name) nameRef.current?.focus()
    else if (next.email) emailRef.current?.focus()
    else if (next.tickets) weekendPlusRef.current?.focus()
    else setConfirmed({ count, total, email: email.trim() })
  }

  function startNewOrder() {
    setQuantities(EMPTY_QUANTITIES)
    setName("")
    setEmail("")
    setErrors({})
    focusNameAfterReset.current = true
    setConfirmed(null)
  }

  return (
    <div className="min-h-screen bg-background font-sans text-body text-foreground">
      <Header />

      <main className={cn(CONTAINER, "flex flex-col gap-16 py-8 md:py-16")}>
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <p className={LABEL}>
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
            <ul className="flex list-none flex-col gap-5 p-0 md:col-span-7">
              {TICKETS.map((ticket) => {
                const quantity = quantities[ticket.id]
                const isWeekend = ticket.id === "weekend"
                return (
                  <li key={ticket.id} className={PANEL}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-h2">{ticket.name}</h3>
                      {ticket.soldOut && (
                        <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-bold uppercase text-tertiary-foreground">
                          Sold out
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="font-heading text-h1 tabular-nums">
                        {euros(ticket.price)}
                      </p>
                      <p className={LABEL}>Per person</p>
                    </div>

                    <ul className="flex flex-col gap-3">
                      {ticket.includes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-body"
                        >
                          <Check
                            aria-hidden="true"
                            className="mt-1 size-4 shrink-0"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
                      <p className={LABEL}>Quantity</p>
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
                            disabled={quantity === 0 || confirmed !== null}
                            focusableWhenDisabled
                            onClick={() => changeQuantity(ticket.id, -1)}
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
                            disabled={
                              quantity === MAX_QTY || confirmed !== null
                            }
                            focusableWhenDisabled
                            onClick={() => changeQuantity(ticket.id, 1)}
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
              <div className={PANEL}>
                <h3 className="text-h2">Summary</h3>
                {lines.length === 0 ? (
                  <p className="text-body">No tickets chosen yet.</p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {lines.map((line) => (
                      <li
                        key={line.id}
                        className="flex items-baseline justify-between gap-3"
                      >
                        <span className="text-body">
                          {line.quantity} × {line.name}
                        </span>
                        <span className="font-mono tabular-nums">
                          {euros(line.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex items-baseline justify-between gap-3 border-t border-border pt-5">
                  <p className={LABEL}>Total</p>
                  <p className="font-heading text-h1 tabular-nums">
                    {euros(total)}
                  </p>
                </div>
                <p className={SMALL}>
                  This is a demo. No payment is taken and no tickets are
                  issued.
                </p>
              </div>

              <div className={PANEL}>
                <h3 className="text-h2">Your details</h3>
                <div>
                  {!confirmed && (
                    <form
                      noValidate
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-5"
                    >
                      <div className="flex flex-col gap-2">
                        <label htmlFor="name" className={cn(LABEL, "block")}>
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
                          <p id="name-error" className={ERROR_LINE}>
                            <CircleAlert
                              aria-hidden="true"
                              className="size-4 shrink-0"
                            />
                            <span>{errors.name}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className={cn(LABEL, "block")}>
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
                        <p id="email-help" className={SMALL}>
                          We would send the tickets here.
                        </p>
                        {errors.email && (
                          <p id="email-error" className={ERROR_LINE}>
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
                          className={cn(BUTTON, "w-full")}
                        >
                          Reserve tickets
                        </Button>
                        {errors.tickets && (
                          <p id="tickets-error" className={ERROR_LINE}>
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
                    {confirmed && (
                      <div className="flex flex-col gap-3">
                        <p
                          ref={messageRef}
                          tabIndex={-1}
                          className={cn(
                            "flex items-start gap-2 text-body font-bold",
                            FOCUS_CODE
                          )}
                        >
                          <Check
                            aria-hidden="true"
                            className="mt-1 size-4 shrink-0"
                          />
                          <span>
                            Reserved: {confirmed.count}{" "}
                            {confirmed.count === 1 ? "ticket" : "tickets"},{" "}
                            {euros(confirmed.total)}.
                          </span>
                        </p>
                        <p className="text-body">
                          Tickets would go to {confirmed.email}. This is a
                          demo, so nothing was charged or sent.
                        </p>
                      </div>
                    )}
                  </div>

                  {confirmed && (
                    <div className="pt-3">
                      <Button
                        variant="outline"
                        onClick={startNewOrder}
                        className={BUTTON}
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
