import { useEffect, useRef, useState } from "react"
import type { FormEvent, KeyboardEvent, ReactNode } from "react"
import { Check, CircleAlert, Minus, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusOutline =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const label = "font-mono text-label font-bold uppercase text-foreground"
const smallPrint = "font-mono text-label text-muted-foreground"
const buttonText = "h-auto px-5 py-2 font-mono text-label font-bold uppercase"
const navLink = cn(label, "underline-offset-4 hover:underline", focusOutline)
const currentLink = "underline decoration-2 underline-offset-4"
const panel = "flex flex-col gap-5 rounded-xl border border-border bg-card p-5"

type TicketId = "weekend" | "friday" | "saturday" | "under-18"

type Ticket = {
  id: TicketId
  name: string
  price: number
  includes: string[]
  soldOut?: boolean
}

const tickets: Ticket[] = [
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

const emptyQuantities: Record<TicketId, number> = {
  weekend: 0,
  friday: 0,
  saturday: 0,
  "under-18": 0,
}

const navItems = [
  { href: "/line-up", text: "Line-up" },
  { href: "/tickets", text: "Tickets" },
  { href: "/info", text: "Info" },
]

function euros(amount: number) {
  return `€${amount.toLocaleString("en-US")}`
}

function isValidEmail(value: string) {
  if (/\s/.test(value)) return false
  const parts = value.split("@")
  if (parts.length !== 2) return false
  const [local, domain] = parts
  if (local.length < 1) return false
  for (let i = 1; i < domain.length - 1; i++) {
    if (domain[i] === ".") return true
  }
  return false
}

function DateRange() {
  return (
    <>
      <time dateTime="2026-12-04">4</time>–
      <time dateTime="2026-12-05">5 Dec 2026</time>
    </>
  )
}

function ErrorLine({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      className="flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  return (
    <header className="border-b border-border" onKeyDown={handleKeyDown}>
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
          {navItems.map((item) => {
            const current = item.href === "/tickets"
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(navLink, current && currentLink)}
              >
                {item.text}
              </a>
            )
          })}
        </nav>
        <p className={cn(label, "ml-auto hidden tabular-nums md:block")}>
          <DateRange />
        </p>
        <Button
          ref={menuButtonRef}
          variant="outline"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className={cn(buttonText, "ml-auto md:hidden")}
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!menuOpen}
        className="border-t border-border md:hidden"
      >
        <div className="mx-auto max-w-[1200px] px-3 py-2 md:px-5">
          {navItems.map((item) => {
            const current = item.href === "/tickets"
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(navLink, "block py-2", current && currentLink)}
              >
                {item.text}
              </a>
            )
          })}
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
          A two-day music and design festival at Varsby Docks.
        </p>
        <p className={cn(label, "tabular-nums")}>
          Varsby Docks · <DateRange /> · © 2026 Tremor Days
        </p>
      </div>
    </footer>
  )
}

type Confirmation = { count: number; total: number; email: string }

export function App() {
  const [quantities, setQuantities] =
    useState<Record<TicketId, number>>(emptyQuantities)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [nameError, setNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [ticketError, setTicketError] = useState(false)
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const weekendPlusRef = useRef<HTMLButtonElement>(null)
  const messageRef = useRef<HTMLParagraphElement>(null)
  const focusNameAfterReset = useRef(false)

  const lines = tickets
    .filter((ticket) => quantities[ticket.id] > 0)
    .map((ticket) => ({
      ticket,
      quantity: quantities[ticket.id],
      amount: quantities[ticket.id] * ticket.price,
    }))
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)
  const total = lines.reduce((sum, line) => sum + line.amount, 0)

  useEffect(() => {
    if (confirmation) {
      messageRef.current?.focus()
    } else if (focusNameAfterReset.current) {
      focusNameAfterReset.current = false
      nameRef.current?.focus()
    }
  }, [confirmation])

  function changeQuantity(id: TicketId, step: number) {
    const next = Math.min(MAX_QUANTITY, Math.max(0, quantities[id] + step))
    setQuantities({ ...quantities, [id]: next })
    if (next > 0) setTicketError(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const badName = trimmedName === ""
    const badEmail = !isValidEmail(trimmedEmail)
    const badTickets = count === 0

    setNameError(badName)
    setEmailError(badEmail)
    setTicketError(badTickets)

    if (badName) {
      nameRef.current?.focus()
    } else if (badEmail) {
      emailRef.current?.focus()
    } else if (badTickets) {
      weekendPlusRef.current?.focus()
    } else {
      setConfirmation({ count, total, email: trimmedEmail })
    }
  }

  function startNewOrder() {
    setQuantities(emptyQuantities)
    setName("")
    setEmail("")
    setNameError(false)
    setEmailError(false)
    setTicketError(false)
    focusNameAfterReset.current = true
    setConfirmation(null)
  }

  return (
    <div className="min-h-screen bg-background font-sans text-body text-foreground">
      <SiteHeader />

      <main className="mx-auto flex max-w-[1200px] flex-col gap-16 px-3 py-8 md:px-5 md:py-16">
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <p className={cn(label, "tabular-nums")}>
              Tremor Days · <DateRange />
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
              {tickets.map((ticket) => {
                const quantity = quantities[ticket.id]
                const isWeekend = ticket.id === "weekend"
                return (
                  <li key={ticket.id} className={panel}>
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
                    <ul className="flex flex-col gap-3">
                      {ticket.includes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-body"
                        >
                          <Check
                            className="mt-1 size-4 shrink-0"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
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
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              disabled
                              aria-label={`One fewer ${ticket.name} ticket`}
                            >
                              <Minus aria-hidden="true" />
                            </Button>
                            <p
                              aria-live="polite"
                              className="flex w-8 justify-center font-heading text-h2 tabular-nums"
                            >
                              0
                            </p>
                            <Button
                              variant="outline"
                              size="icon"
                              disabled
                              aria-label={`One more ${ticket.name} ticket`}
                            >
                              <Plus aria-hidden="true" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              focusableWhenDisabled
                              disabled={confirmation !== null || quantity <= 0}
                              aria-label={`One fewer ${ticket.name} ticket`}
                              onClick={() => changeQuantity(ticket.id, -1)}
                            >
                              <Minus aria-hidden="true" />
                            </Button>
                            <p
                              aria-live="polite"
                              className="flex w-8 justify-center font-heading text-h2 tabular-nums"
                            >
                              {quantity}
                            </p>
                            <Button
                              ref={isWeekend ? weekendPlusRef : undefined}
                              variant="outline"
                              size="icon"
                              focusableWhenDisabled
                              disabled={
                                confirmation !== null ||
                                quantity >= MAX_QUANTITY
                              }
                              aria-label={`One more ${ticket.name} ticket`}
                              aria-describedby={
                                isWeekend && ticketError
                                  ? "ticket-error"
                                  : undefined
                              }
                              onClick={() => changeQuantity(ticket.id, 1)}
                            >
                              <Plus aria-hidden="true" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="flex flex-col gap-5 md:col-span-5">
              <div className={panel}>
                <h3 className="text-h2">Summary</h3>
                {lines.length > 0 ? (
                  <ul className="flex flex-col gap-3">
                    {lines.map((line) => (
                      <li
                        key={line.ticket.id}
                        className="flex items-baseline justify-between gap-3"
                      >
                        <span className="text-body">
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
                  <p className={label}>Total</p>
                  <p className="font-heading text-h1 tabular-nums">
                    {euros(total)}
                  </p>
                </div>
                <p className={smallPrint}>
                  This is a demo. No payment is taken and no tickets are issued.
                </p>
              </div>

              <div className={panel}>
                <h3 className="text-h2">Your details</h3>
                <div>
                  {!confirmation && (
                    <form
                      noValidate
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-5"
                    >
                      <div className="flex flex-col gap-2">
                        <label htmlFor="name" className={cn(label, "block")}>
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
                            setNameError(false)
                          }}
                          aria-invalid={nameError || undefined}
                          aria-describedby={
                            nameError ? "name-error" : undefined
                          }
                          className="h-auto px-3 py-2 text-body md:text-body"
                        />
                        {nameError && (
                          <ErrorLine id="name-error">
                            Enter your name.
                          </ErrorLine>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className={cn(label, "block")}>
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
                            setEmailError(false)
                          }}
                          aria-invalid={emailError || undefined}
                          aria-describedby={
                            emailError ? "email-help email-error" : "email-help"
                          }
                          className="h-auto px-3 py-2 text-body md:text-body"
                        />
                        <p id="email-help" className={smallPrint}>
                          We would send the tickets here.
                        </p>
                        {emailError && (
                          <ErrorLine id="email-error">
                            Enter an email address, like ada@example.com.
                          </ErrorLine>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          type="submit"
                          aria-describedby={
                            ticketError ? "ticket-error" : undefined
                          }
                          className={cn(buttonText, "w-full")}
                        >
                          Reserve tickets
                        </Button>
                        {ticketError && (
                          <ErrorLine id="ticket-error">
                            Choose at least one ticket first.
                          </ErrorLine>
                        )}
                      </div>
                    </form>
                  )}

                  <div role="status">
                    {confirmation && (
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
                            className="mt-1 size-4 shrink-0"
                            aria-hidden="true"
                          />
                          <span>
                            Reserved: {confirmation.count}{" "}
                            {confirmation.count === 1 ? "ticket" : "tickets"},{" "}
                            {euros(confirmation.total)}.
                          </span>
                        </p>
                        <p className="text-body wrap-break-word">
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

      <SiteFooter />
    </div>
  )
}

export default App
