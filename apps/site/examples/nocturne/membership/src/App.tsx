import { useEffect, useRef, useState } from "react"
import type { FormEvent, KeyboardEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type PlanId = "friend" | "regular" | "patron"
type Period = "monthly" | "yearly"

type Plan = {
  id: PlanId
  name: string
  monthly: number
  audience: string
  includes: string[]
}

const PLANS: Plan[] = [
  {
    id: "friend",
    name: "Friend",
    monthly: 6,
    audience:
      "For anyone who comes to the Vesper a few times a season and wants to keep up with what is on.",
    includes: [
      "10% off every ticket.",
      "A members' screening once a month.",
      "The printed programme, sent to you by post.",
    ],
  },
  {
    id: "regular",
    name: "Regular",
    monthly: 12,
    audience:
      "For people who are here most weeks and like a good seat on the first night of a season.",
    includes: [
      "Two free tickets a month.",
      "20% off every other ticket.",
      "Priority booking for seasons and premieres.",
      "10% off at the bar.",
    ],
  },
  {
    id: "patron",
    name: "Patron",
    monthly: 25,
    audience:
      "For those who want to keep the projector running and have a seat in the cinema that carries their name.",
    includes: [
      "Everything in Regular.",
      "Four free tickets a month.",
      "A named seat in Screen 2.",
      "An invitation to the season launches.",
    ],
  },
]

const PLAN_ITEMS = PLANS.map((plan) => ({ value: plan.id, label: plan.name }))

const START_DATE = "Wednesday 11 November 2026"

const NAV_LINKS = [
  { label: "Programme", href: "/" },
  { label: "Seasons", href: "/season" },
  { label: "Membership", href: "/membership" },
  { label: "Visit", href: "/visit" },
]

const CURRENT_PATH = "/membership"

const FOCUS_VISIBLE =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const FOCUS_FROM_CODE =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"

const CONTAINER = "mx-auto max-w-[1280px] px-4 md:px-6"
const BUTTON = "h-auto px-6 py-2 font-mono text-label uppercase"
const LABEL = "font-mono text-label uppercase"
const FIELD_LABEL = "block font-mono text-label uppercase text-foreground"
const FIELD = "mt-2 h-auto px-4 py-2 text-body md:text-body"
const TEXT_LINK = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-primary",
  FOCUS_VISIBLE
)
const NAV_LINK = cn(
  "font-mono text-label text-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS_VISIBLE
)

function formatPounds(amount: number) {
  const rounded = Math.round(amount * 100) / 100
  return Number.isInteger(rounded) ? `£${rounded}` : `£${rounded.toFixed(2)}`
}

function priceFor(plan: Plan, period: Period) {
  return period === "monthly" ? plan.monthly : plan.monthly * 10
}

function isEmailAddress(value: string) {
  if (/\s/.test(value)) return false
  const parts = value.split("@")
  if (parts.length !== 2) return false
  const [local, domain] = parts
  if (local.length === 0) return false
  const labels = domain.split(".")
  if (labels.length < 2) return false
  return labels.every((label) => label.length > 0)
}

type Errors = { name?: string; email?: string }

type Confirmation = {
  firstName: string
  planName: string
  period: Period
  price: number
}

function ErrorLine({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-body text-destructive">
      <CircleAlert
        className="mt-1 size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span>{message}</span>
    </p>
  )
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen) return
    if (event.key === "Escape") {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  return (
    <header className="border-b border-border" onKeyDown={handleKeyDown}>
      <div
        className={cn(
          CONTAINER,
          "flex flex-wrap items-center justify-between gap-4 py-4"
        )}
      >
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
            FOCUS_VISIBLE
          )}
        >
          The Vesper
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {NAV_LINKS.map((link) => {
              const current = link.href === CURRENT_PATH
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(NAV_LINK, current && "underline")}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
        <Button
          ref={menuButtonRef}
          variant="outline"
          className={cn(BUTTON, "md:hidden")}
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
        className="border-t border-border md:hidden"
        hidden={!menuOpen}
      >
        <div className={cn(CONTAINER, "py-2")}>
          <ul>
            {NAV_LINKS.map((link) => {
              const current = link.href === CURRENT_PATH
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(NAV_LINK, "block py-2", current && "underline")}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border py-12">
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-6">
            <p className="font-heading text-h2">The Vesper</p>
            <p className="mt-2 text-body text-muted-foreground">
              21 Tallow Row, Oldmere OM2 4LT
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body md:col-span-6 md:col-start-7 md:mt-0">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={TEXT_LINK}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className={cn(LABEL, "mt-12 text-muted-foreground")}>
          © 2026 The Vesper
        </p>
      </div>
    </footer>
  )
}

export function App() {
  const [period, setPeriod] = useState<Period>("monthly")
  const [planId, setPlanId] = useState<PlanId>("regular")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const confirmationRef = useRef<HTMLHeadingElement>(null)

  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1]
  const price = priceFor(plan, period)
  const unit = period === "monthly" ? "month" : "year"

  useEffect(() => {
    if (confirmation) confirmationRef.current?.focus()
  }, [confirmation])

  function choosePlan(id: PlanId) {
    setPlanId(id)
    if (confirmation) {
      confirmationRef.current?.focus()
    } else {
      nameRef.current?.focus()
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const next: Errors = {}
    if (trimmedName.length === 0) {
      next.name = "Enter your full name."
    }
    if (!isEmailAddress(trimmedEmail)) {
      next.email = "Enter an email address such as name@example.com."
    }
    setErrors(next)
    if (next.name) {
      nameRef.current?.focus()
      return
    }
    if (next.email) {
      emailRef.current?.focus()
      return
    }
    setConfirmation({
      firstName: trimmedName.split(/\s+/)[0],
      planName: plan.name,
      period,
      price,
    })
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <SiteHeader />

      <main className={cn(CONTAINER, "pt-12")}>
        <section>
          <p className={cn(LABEL, "text-muted-foreground")}>Membership</p>
          <div className="mt-2 max-w-4xl">
            <h1 className="text-h1 md:text-display">
              Become a member of the Vesper
            </h1>
          </div>
          <p className="mt-6 max-w-xl">
            Membership keeps the late shows running after the last bus, pays
            for the upkeep of our 35mm projector and the prints we bring in for
            it, and lets us build seasons around films that rarely reach a big
            screen. In return, you see more of them for less.
          </p>
        </section>

        <section className="mt-24">
          <h2 className="text-h2 md:text-h1">Plans</h2>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div
              role="group"
              aria-label="Billing period"
              className="flex flex-wrap gap-2"
            >
              {(["monthly", "yearly"] as const).map((option) => {
                const chosen = option === period
                return (
                  <Button
                    key={option}
                    variant={chosen ? "secondary" : "outline"}
                    aria-pressed={chosen}
                    className={BUTTON}
                    onClick={() => setPeriod(option)}
                  >
                    {option === "monthly" ? "Monthly" : "Yearly"}
                  </Button>
                )
              })}
            </div>
            <p className={cn(LABEL, "text-muted-foreground")}>
              Yearly · two months free
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PLANS.map((item) => {
              const itemPrice = priceFor(item, period)
              const note =
                period === "monthly"
                  ? "Billed monthly · cancel any time"
                  : `Billed yearly · ${formatPounds(itemPrice / 12)} a month`
              return (
                <article
                  key={item.id}
                  className="flex flex-col rounded-xl border border-border bg-card p-6"
                >
                  {item.id === "regular" ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-h2">{item.name}</h3>
                      <Badge
                        variant="secondary"
                        className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
                      >
                        Recommended
                      </Badge>
                    </div>
                  ) : (
                    <h3 className="text-h2">{item.name}</h3>
                  )}
                  <p className="mt-4 font-heading text-h1 tabular-nums">
                    {formatPounds(itemPrice)}
                    <span
                      className={cn(LABEL, "ml-2 text-muted-foreground")}
                    >
                      / {unit}
                    </span>
                  </p>
                  <p
                    className={cn(
                      LABEL,
                      "mt-2 text-muted-foreground tabular-nums"
                    )}
                  >
                    {note}
                  </p>
                  <p className="mt-4">{item.audience}</p>
                  <ul className="mt-6 list-disc pl-4">
                    {item.includes.map((line, index) => (
                      <li key={line} className={index > 0 ? "mt-2" : undefined}>
                        {line}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <Button
                      variant={item.id === "regular" ? "secondary" : "outline"}
                      className={cn(
                        BUTTON,
                        "w-full text-center whitespace-normal"
                      )}
                      onClick={() => choosePlan(item.id)}
                    >
                      Choose {item.name}
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section
          id="join"
          className="mt-24 grid grid-cols-1 md:grid-cols-12 md:gap-x-6"
        >
          <div className="md:col-span-5">
            <h2 className="text-h2 md:text-h1">Join</h2>
            <p className="mt-4 max-w-xl">
              Your membership starts today, {START_DATE}. You can cancel it at
              any time from your account page.
            </p>
            <p className="mt-4 max-w-xl text-body text-muted-foreground">
              This is a demo. No card details are asked for and nothing is
              charged.
            </p>
          </div>

          <div className="mt-12 md:col-span-6 md:col-start-7 md:mt-0">
            {!confirmation && (
              <form noValidate onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="full-name" className={FIELD_LABEL}>
                    Full name
                  </label>
                  <Input
                    ref={nameRef}
                    id="full-name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value)
                      if (errors.name) {
                        setErrors((prev) => ({ ...prev, name: undefined }))
                      }
                    }}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "full-name-error" : undefined}
                    className={FIELD}
                  />
                  {errors.name && (
                    <ErrorLine id="full-name-error" message={errors.name} />
                  )}
                </div>

                <div className="mt-6">
                  <label htmlFor="email" className={FIELD_LABEL}>
                    Email address
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
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: undefined }))
                      }
                    }}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={
                      errors.email ? "email-help email-error" : "email-help"
                    }
                    className={FIELD}
                  />
                  <p id="email-help" className="mt-2 text-body text-muted-foreground">
                    We send your membership card here.
                  </p>
                  {errors.email && (
                    <ErrorLine id="email-error" message={errors.email} />
                  )}
                </div>

                <div className="mt-6">
                  <label id="plan-label" htmlFor="plan" className={FIELD_LABEL}>
                    Plan
                  </label>
                  <Select
                    items={PLAN_ITEMS}
                    value={planId}
                    onValueChange={(value) => {
                      if (value === null) return
                      setPlanId(value as PlanId)
                    }}
                  >
                    <SelectTrigger
                      id="plan"
                      aria-labelledby="plan-label"
                      className="mt-2"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAN_ITEMS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <p aria-live="polite" className="mt-6 text-body">
                  {plan.name}, billed {period}: {formatPounds(price)} a {unit},
                  starting {START_DATE}.
                </p>

                <Button type="submit" className={cn(BUTTON, "mt-6")}>
                  Join the Vesper
                </Button>
              </form>
            )}

            <div role="status">
              {confirmation && (
                <>
                  <h3
                    ref={confirmationRef}
                    tabIndex={-1}
                    className={cn("text-h2 wrap-break-word", FOCUS_FROM_CODE)}
                  >
                    Welcome to the Vesper, {confirmation.firstName}
                  </h3>
                  <p className="mt-4">
                    Your {confirmation.planName} membership, billed{" "}
                    {confirmation.period} at {formatPounds(confirmation.price)}{" "}
                    a {confirmation.period === "monthly" ? "month" : "year"},
                    starts on {START_DATE}. Your card will reach you by email.
                    This was a demo: no payment was taken.
                  </p>
                </>
              )}
            </div>

            {confirmation && (
              <p className="mt-6">
                <a href="/" className={TEXT_LINK}>
                  See what&apos;s on
                </a>
              </p>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
