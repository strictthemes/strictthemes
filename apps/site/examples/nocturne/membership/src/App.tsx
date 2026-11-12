import { useEffect, useRef, useState } from "react"
import type { FormEvent, KeyboardEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Period = "monthly" | "yearly"
type PlanId = "friend" | "regular" | "patron"

type Plan = {
  id: PlanId
  name: string
  monthly: number
  yearly: number
  perMonthYearly: string
  forWhom: string
  includes: string[]
}

const PLANS: Plan[] = [
  {
    id: "friend",
    name: "Friend",
    monthly: 6,
    yearly: 60,
    perMonthYearly: "£5",
    forWhom:
      "For anyone who comes a few times a season and wants the programme at home.",
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
    perMonthYearly: "£10",
    forWhom:
      "For people who see a film most weeks and like to book before the rush.",
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
    perMonthYearly: "£20.83",
    forWhom:
      "For those who want to keep the Vesper running and have a seat to show for it.",
    includes: [
      "Everything in Regular",
      "Four free tickets a month",
      "A named seat in Screen 2",
      "An invitation to the season launches",
    ],
  },
]

const START_DATE = "Wednesday 11 November 2026"

const NAV_LINKS = [
  { label: "Programme", href: "/" },
  { label: "Seasons", href: "/season" },
  { label: "Membership", href: "/membership" },
  { label: "Visit", href: "/visit" },
]

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
const INPUT = "mt-2 h-auto px-4 py-2 text-body md:text-body"

function price(plan: Plan, period: Period) {
  return period === "monthly" ? plan.monthly : plan.yearly
}

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (open && event.key === "Escape") {
      setOpen(false)
      menuButton.current?.focus()
    }
  }

  function linkClass(current: boolean) {
    return cn(NAV_LINK, current && "underline")
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
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
            {NAV_LINKS.map((link) => {
              const current = link.href === "/membership"
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={linkClass(current)}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={open}
          aria-controls="menu-small"
          className={cn(BUTTON, "md:hidden")}
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </Button>
      </div>
      <nav
        id="menu-small"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <div className="mx-auto max-w-[1280px] px-4 py-2 md:px-6">
          <ul>
            {NAV_LINKS.map((link) => {
              const current = link.href === "/membership"
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(linkClass(current), "block py-2")}
                    onClick={() => setOpen(false)}
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

function Footer() {
  return (
    <footer className="mt-24 border-t border-border py-12">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-6">
            <p className="font-heading text-h2">The Vesper</p>
            <p className="mt-2 text-body text-muted-foreground">
              21 Tallow Row, Oldmere OM2 4LT
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body md:col-span-6 md:mt-0">
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

type Errors = { name?: string; email?: string }
type Confirmation = { firstName: string; plan: Plan; period: Period }

export function App() {
  const [period, setPeriod] = useState<Period>("monthly")
  const [planId, setPlanId] = useState<PlanId>("regular")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLHeadingElement>(null)

  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1]

  useEffect(() => {
    if (confirmation) confirmRef.current?.focus()
  }, [confirmation])

  function choose(id: PlanId) {
    if (confirmation) {
      confirmRef.current?.focus()
      return
    }
    setPlanId(id)
    nameRef.current?.focus()
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Errors = {}
    if (name.trim() === "") next.name = "Enter your full name."
    const value = email.trim()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
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
      firstName: name.trim().split(/\s+/)[0],
      plan,
      period,
    })
  }

  const summaryPrice =
    period === "monthly" ? `£${plan.monthly} a month` : `£${plan.yearly} a year`

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <Header />
      <main className="mx-auto max-w-[1280px] px-4 pt-12 md:px-6">
        <section>
          <p className={cn(LABEL, "text-muted-foreground")}>Membership</p>
          <div className="mt-2 max-w-4xl">
            <h1 className="text-h1 md:text-display">
              Become a member of the Vesper
            </h1>
          </div>
          <p className="mt-6 max-w-xl">
            Members keep the Vesper open after dark. Your fee pays for the late
            shows that start after the last bus, for the upkeep of the 35mm
            projector in Screen 1, and for the seasons we build each autumn and
            spring, with prints borrowed from archives across the country.
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
              {(["monthly", "yearly"] as const).map((value) => (
                <Button
                  key={value}
                  variant={period === value ? "secondary" : "outline"}
                  aria-pressed={period === value}
                  className={BUTTON}
                  onClick={() => setPeriod(value)}
                >
                  {value === "monthly" ? "Monthly" : "Yearly"}
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
                className="flex flex-col rounded-xl border border-border bg-card p-6"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-h2">{p.name}</h3>
                  {p.id === "regular" && (
                    <Badge
                      variant="secondary"
                      className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
                    >
                      Recommended
                    </Badge>
                  )}
                </div>
                <p className="mt-4 font-heading text-h1 tabular-nums">
                  £{price(p, period)}
                  <span className={cn(LABEL, "ml-2 text-muted-foreground")}>
                    {period === "monthly" ? "/ month" : "/ year"}
                  </span>
                </p>
                <p
                  className={cn(
                    LABEL,
                    "mt-2 text-muted-foreground tabular-nums"
                  )}
                >
                  {period === "monthly"
                    ? "Billed monthly · cancel any time"
                    : `Billed yearly · ${p.perMonthYearly} a month`}
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
                    className={cn(
                      BUTTON,
                      "w-full text-center whitespace-normal"
                    )}
                    onClick={() => choose(p.id)}
                  >
                    Choose {p.name}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="join" className="mt-24">
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
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
                <form noValidate onSubmit={onSubmit}>
                  <div>
                    <label htmlFor="name" className={FIELD_LABEL}>
                      Full name
                    </label>
                    <Input
                      ref={nameRef}
                      id="name"
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (errors.name)
                          setErrors((prev) => ({ ...prev, name: undefined }))
                      }}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={INPUT}
                    />
                    {errors.name && (
                      <p
                        id="name-error"
                        className="mt-2 flex items-start gap-2 text-body text-destructive"
                      >
                        <CircleAlert
                          className="mt-1 size-4 shrink-0"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        <span>{errors.name}</span>
                      </p>
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
                        if (errors.email)
                          setErrors((prev) => ({ ...prev, email: undefined }))
                      }}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={
                        errors.email ? "email-help email-error" : "email-help"
                      }
                      className={INPUT}
                    />
                    <p
                      id="email-help"
                      className="mt-2 text-body text-muted-foreground"
                    >
                      We send your membership card here.
                    </p>
                    {errors.email && (
                      <p
                        id="email-error"
                        className="mt-2 flex items-start gap-2 text-body text-destructive"
                      >
                        <CircleAlert
                          className="mt-1 size-4 shrink-0"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <label htmlFor="plan" className={FIELD_LABEL}>
                      Plan
                    </label>
                    <select
                      id="plan"
                      name="plan"
                      value={planId}
                      onChange={(e) => setPlanId(e.target.value as PlanId)}
                      className={cn(
                        "mt-2 w-full rounded-lg border border-input bg-card px-4 py-2 text-body text-foreground",
                        FOCUS
                      )}
                    >
                      {PLANS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p aria-live="polite" className="mt-6 text-body">
                    {plan.name}, billed {period}: {summaryPrice}, starting{" "}
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
                      className={cn("text-h2", CODE_FOCUS)}
                    >
                      Welcome to the Vesper, {confirmation.firstName}
                    </h3>
                    <p className="mt-4 max-w-xl">
                      Your {confirmation.plan.name} membership, billed{" "}
                      {confirmation.period} at{" "}
                      {confirmation.period === "monthly"
                        ? `£${confirmation.plan.monthly} a month`
                        : `£${confirmation.plan.yearly}`}
                      , starts on {START_DATE}. Your card will reach you by
                      email. This was a demo: no payment was taken.
                    </p>
                  </>
                )}
              </div>

              {confirmation && (
                <p className="mt-6">
                  <a href="/" className={TEXT_LINK}>
                    See what's on
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
