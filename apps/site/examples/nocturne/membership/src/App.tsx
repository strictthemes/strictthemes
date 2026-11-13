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
  yearly: number
  forWhom: string
  includes: string[]
}

const PLANS: Plan[] = [
  {
    id: "friend",
    name: "Friend",
    monthly: 6,
    yearly: 60,
    forWhom:
      "For anyone who comes a few times a season and wants to help keep the doors open.",
    includes: [
      "10% off every ticket",
      "Members' screenings once a month",
      "The printed programme by post",
    ],
  },
  {
    id: "regular",
    name: "Regular",
    monthly: 12,
    yearly: 120,
    forWhom:
      "For people who see a film most weeks and like to book a season before it sells out.",
    includes: [
      "Two free tickets a month",
      "20% off every other ticket",
      "Priority booking for seasons and premieres",
      "10% off at the bar",
    ],
  },
  {
    id: "patron",
    name: "Patron",
    monthly: 25,
    yearly: 250,
    forWhom:
      "For those who want a seat of their own and a hand in keeping the 35mm prints coming.",
    includes: [
      "Everything in Regular",
      "Four free tickets a month",
      "A named seat in Screen 2",
      "An invitation to the season launches",
    ],
  },
]

const PLAN_ITEMS = PLANS.map((p) => ({ value: p.id, label: p.name }))

const START_DATE = "Wednesday 11 November 2026"

const NAV = [
  { label: "Programme", href: "/" },
  { label: "Seasons", href: "/season" },
  { label: "Membership", href: "/membership" },
  { label: "Visit", href: "/visit" },
]
const CURRENT = "/membership"

const CONTAINER = "mx-auto max-w-[1280px] px-4 md:px-6"
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const CODE_FOCUS =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const BUTTON = "h-auto px-6 py-2 font-mono text-label uppercase"
const LABEL = "font-mono text-label uppercase"
const TEXT_LINK = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-primary",
  FOCUS
)
const NAV_LINK = cn(
  LABEL,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)
const FIELD_LABEL = "block font-mono text-label uppercase text-foreground"
const FIELD = "mt-2 h-auto px-4 py-2 text-body md:text-body"

function money(value: number) {
  return Number.isInteger(value) ? `£${value}` : `£${value.toFixed(2)}`
}

function price(plan: Plan, period: Period) {
  return period === "monthly" ? plan.monthly : plan.yearly
}

function unit(period: Period) {
  return period === "monthly" ? "month" : "year"
}

function isEmail(value: string) {
  // No spaces, one @ with text before it, and after it a dot with text on
  // both sides.
  return /^[^\s@]+@[^\s@]*[^\s@.]\.[^\s@.][^\s@]*$/.test(value)
}

type Errors = { name?: string; email?: string }

type Confirmation = {
  firstName: string
  planName: string
  period: Period
  amount: string
}

function ErrorLine({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-body text-destructive">
      <CircleAlert
        className="mt-1 size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span>{children}</span>
    </p>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [period, setPeriod] = useState<Period>("monthly")
  const [planId, setPlanId] = useState<PlanId>("regular")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)

  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLHeadingElement>(null)

  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1]

  useEffect(() => {
    if (confirmation) confirmRef.current?.focus()
  }, [confirmation])

  function onHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  function choose(id: PlanId) {
    setPlanId(id)
    if (confirmation) confirmRef.current?.focus()
    else nameRef.current?.focus()
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const next: Errors = {}
    if (!trimmedName) next.name = "Enter your full name."
    if (!trimmedEmail || !isEmail(trimmedEmail))
      next.email = "Enter an email address such as name@example.com."
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
      amount: `${money(price(plan, period))} a ${unit(period)}`,
    })
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border" onKeyDown={onHeaderKeyDown}>
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
              FOCUS
            )}
          >
            The Vesper
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {NAV.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={link.href === CURRENT ? "page" : undefined}
                    className={cn(NAV_LINK, link.href === CURRENT && "underline")}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            ref={menuButtonRef}
            variant="outline"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className={cn(BUTTON, "md:hidden")}
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
          <div className={cn(CONTAINER, "py-2")}>
            <ul>
              {NAV.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={link.href === CURRENT ? "page" : undefined}
                    className={cn(
                      NAV_LINK,
                      "block py-2",
                      link.href === CURRENT && "underline"
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className={cn(CONTAINER, "pt-12")}>
        <section aria-labelledby="intro-title">
          <p className={cn(LABEL, "text-muted-foreground")}>Membership</p>
          <div className="mt-2 max-w-4xl">
            <h1 id="intro-title" className="text-h1 md:text-display">
              Become a member of the Vesper
            </h1>
          </div>
          <p className="mt-6 max-w-xl">
            Membership is what keeps the Vesper running after dark. It pays the
            projectionists who stay for the late shows, keeps the 35mm projector
            in Screen 1 serviced and supplied with prints, and lets us build
            seasons around films that no distributor would send us on their
            own. Members get cheaper tickets and first pick of the seats in
            return.
          </p>
        </section>

        <section className="mt-24" aria-labelledby="plans-title">
          <h2 id="plans-title" className="text-h2 md:text-h1">
            Plans
          </h2>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div
              role="group"
              aria-label="Billing period"
              className="flex flex-wrap gap-2"
            >
              {(["monthly", "yearly"] as const).map((p) => (
                <Button
                  key={p}
                  variant={period === p ? "secondary" : "outline"}
                  aria-pressed={period === p}
                  className={BUTTON}
                  onClick={() => setPeriod(p)}
                >
                  {p === "monthly" ? "Monthly" : "Yearly"}
                </Button>
              ))}
            </div>
            <p className={cn(LABEL, "text-muted-foreground")}>
              Yearly · two months free
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PLANS.map((p) => (
              <article
                key={p.id}
                aria-labelledby={`plan-${p.id}`}
                className="flex flex-col rounded-xl border border-border bg-card p-6"
              >
                {p.id === "regular" ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 id={`plan-${p.id}`} className="text-h2">
                      {p.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label uppercase text-tertiary-foreground"
                    >
                      Recommended
                    </Badge>
                  </div>
                ) : (
                  <h3 id={`plan-${p.id}`} className="text-h2">
                    {p.name}
                  </h3>
                )}
                <p className="mt-4 font-heading text-h1 tabular-nums">
                  {money(price(p, period))}
                  <span className={cn(LABEL, "ml-2 text-muted-foreground")}>
                    / {unit(period)}
                  </span>
                </p>
                <p className={cn(LABEL, "mt-2 tabular-nums text-muted-foreground")}>
                  {period === "monthly"
                    ? "Billed monthly · cancel any time"
                    : `Billed yearly · ${money(p.yearly / 12)} a month`}
                </p>
                <p className="mt-4">{p.forWhom}</p>
                <ul className="mt-6 list-disc pl-4">
                  {p.includes.map((item, i) => (
                    <li key={item} className={i > 0 ? "mt-2" : undefined}>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <Button
                    variant={p.id === "regular" ? "secondary" : "outline"}
                    className={cn(BUTTON, "w-full whitespace-normal text-center")}
                    onClick={() => choose(p.id)}
                  >
                    Choose {p.name}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="join"
          aria-labelledby="join-title"
          className="mt-24 grid grid-cols-1 md:grid-cols-12 md:gap-x-6"
        >
          <div className="md:col-span-5">
            <h2 id="join-title" className="text-h2 md:text-h1">
              Join
            </h2>
            <p className="mt-4 max-w-xl">
              Your membership starts today, {START_DATE}. You can cancel it at
              any time from your account page.
            </p>
            <p className="mt-4 text-body text-muted-foreground">
              This is a demo. No card details are asked for and nothing is
              charged.
            </p>
          </div>

          <div className="mt-12 md:col-span-6 md:col-start-7 md:mt-0">
            {!confirmation && (
              <form noValidate onSubmit={onSubmit}>
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
                    onChange={(e) => {
                      setName(e.target.value)
                      setErrors((prev) => ({ ...prev, name: undefined }))
                    }}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "full-name-error" : undefined}
                    className={FIELD}
                  />
                  {errors.name && (
                    <ErrorLine id="full-name-error">{errors.name}</ErrorLine>
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
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setErrors((prev) => ({ ...prev, email: undefined }))
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
                    <ErrorLine id="email-error">{errors.email}</ErrorLine>
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
                      if (value !== null) setPlanId(value as PlanId)
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
                  {plan.name}, billed {period}:{" "}
                  {money(price(plan, period))} a {unit(period)}, starting{" "}
                  {START_DATE}.
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
                    ref={confirmRef}
                    tabIndex={-1}
                    className={cn("text-h2 wrap-break-word", CODE_FOCUS)}
                  >
                    Welcome to the Vesper, {confirmation.firstName}
                  </h3>
                  <p className="mt-4">
                    Your {confirmation.planName} membership, billed{" "}
                    {confirmation.period} at {confirmation.amount}, starts on{" "}
                    {START_DATE}. Your card will reach you by email. This was a
                    demo: no payment was taken.
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

      <footer className="mt-24 border-t border-border py-12">
        <div className={CONTAINER}>
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">The Vesper</p>
              <p className="mt-2 text-body text-muted-foreground">
                21 Tallow Row, Oldmere OM2 4LT
              </p>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body md:col-span-6 md:mt-0">
              {NAV.map((link) => (
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
    </div>
  )
}

export default App
