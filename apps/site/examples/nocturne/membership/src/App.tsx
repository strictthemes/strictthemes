import * as React from "react"
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
  audience: string
  includes: string[]
}

const plans: Plan[] = [
  {
    id: "friend",
    name: "Friend",
    monthly: 6,
    yearly: 60,
    audience:
      "For people who come a few times a year and want the Vesper to stay open.",
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
    audience: "For people who are here most weeks and like to book early.",
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
    audience: "For people who treat Screen 2 as their second front room.",
    includes: [
      "Everything in Regular",
      "Four free tickets a month",
      "A named seat in Screen 2",
      "An invitation to the season launches",
    ],
  },
]

const planItems = plans.map((plan) => ({ value: plan.id, label: plan.name }))

const periods: { id: Period; name: string }[] = [
  { id: "monthly", name: "Monthly" },
  { id: "yearly", name: "Yearly" },
]

const navLinks = [
  { name: "Programme", href: "/" },
  { name: "Seasons", href: "/season" },
  { name: "Membership", href: "/membership" },
  { name: "Visit", href: "/visit" },
]

const currentPath = "/membership"
const startDate = "Wednesday 11 November 2026"

const container = "mx-auto max-w-[1280px] px-4 md:px-6"
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-6"
const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const navLink = cn(
  label,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-primary",
  focusOutline
)
const buttonClasses = "h-auto px-6 py-2 font-mono text-label uppercase"
const fieldLabel = "block font-mono text-label uppercase text-foreground"
const fieldClasses = "mt-2 h-auto px-4 py-2 text-body md:text-body"
const errorLine = "mt-2 flex items-start gap-2 text-body text-destructive"

function pounds(amount: number) {
  return Number.isInteger(amount) ? `£${amount}` : `£${amount.toFixed(2)}`
}

function priceOf(plan: Plan, period: Period) {
  return period === "monthly" ? plan.monthly : plan.yearly
}

function priceWithUnit(plan: Plan, period: Period) {
  return `${pounds(priceOf(plan, period))} ${
    period === "monthly" ? "a month" : "a year"
  }`
}

function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

type Errors = { name?: string; email?: string }
type Sent = { firstName: string; plan: Plan; period: Period }

export function App() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [period, setPeriod] = React.useState<Period>("monthly")
  const [planId, setPlanId] = React.useState<PlanId>("regular")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [errors, setErrors] = React.useState<Errors>({})
  const [sent, setSent] = React.useState<Sent | null>(null)

  const menuButtonRef = React.useRef<HTMLButtonElement>(null)
  const nameRef = React.useRef<HTMLInputElement>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)
  const confirmationRef = React.useRef<HTMLHeadingElement>(null)

  const chosenPlan = plans.find((plan) => plan.id === planId) ?? plans[1]

  React.useEffect(() => {
    if (sent) {
      confirmationRef.current?.focus()
    }
  }, [sent])

  function handleHeaderKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  function choosePlan(id: PlanId) {
    setPlanId(id)
    if (sent) {
      confirmationRef.current?.focus()
    } else {
      nameRef.current?.focus()
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const nextErrors: Errors = {}

    if (trimmedName === "") {
      nextErrors.name = "Enter your full name."
    }
    if (!looksLikeEmail(trimmedEmail)) {
      nextErrors.email = "Enter an email address such as name@example.com."
    }

    setErrors(nextErrors)

    if (nextErrors.name) {
      nameRef.current?.focus()
      return
    }
    if (nextErrors.email) {
      emailRef.current?.focus()
      return
    }

    setSent({
      firstName: trimmedName.split(/\s+/)[0],
      plan: chosenPlan,
      period,
    })
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border" onKeyDown={handleHeaderKeyDown}>
        <div
          className={cn(
            container,
            "flex flex-wrap items-center justify-between gap-4 py-4"
          )}
        >
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
              focusOutline
            )}
          >
            The Vesper
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={
                      link.href === currentPath ? "page" : undefined
                    }
                    className={cn(
                      navLink,
                      link.href === currentPath && "underline"
                    )}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            ref={menuButtonRef}
            variant="outline"
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(buttonClasses, "md:hidden")}
          >
            Menu
          </Button>
        </div>
        <nav
          id="main-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
        >
          <div className={cn(container, "py-2")}>
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={
                      link.href === currentPath ? "page" : undefined
                    }
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      navLink,
                      "block py-2",
                      link.href === currentPath && "underline"
                    )}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className={cn(container, "pt-12")}>
        <section>
          <p className={cn(label, "text-muted-foreground")}>Membership</p>
          <div className="mt-2 max-w-4xl">
            <h1 className="text-h1 md:text-display">
              Become a member of the Vesper
            </h1>
          </div>
          <p className="mt-6 max-w-xl">
            Membership pays for what ticket sales alone do not: the late shows
            that start after the last bus, the 35mm projector in Screen 2 and
            the person who keeps it running, and the seasons we programme
            around one director, one country or one year.
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
              {periods.map((item) => (
                <Button
                  key={item.id}
                  variant={period === item.id ? "secondary" : "outline"}
                  aria-pressed={period === item.id}
                  onClick={() => setPeriod(item.id)}
                  className={buttonClasses}
                >
                  {item.name}
                </Button>
              ))}
            </div>
            <p className={cn(label, "text-muted-foreground")}>
              Yearly · two months free
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className="flex flex-col rounded-xl border border-border bg-card p-6"
              >
                {plan.id === "regular" ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-h2">{plan.name}</h3>
                    <Badge
                      variant="secondary"
                      className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
                    >
                      Recommended
                    </Badge>
                  </div>
                ) : (
                  <h3 className="text-h2">{plan.name}</h3>
                )}
                <p className="mt-4 font-heading text-h1 tabular-nums">
                  {pounds(priceOf(plan, period))}
                  <span className={cn(label, "ml-2 text-muted-foreground")}>
                    {period === "monthly" ? "/ month" : "/ year"}
                  </span>
                </p>
                <p
                  className={cn(
                    label,
                    "mt-2 text-muted-foreground tabular-nums"
                  )}
                >
                  {period === "monthly"
                    ? "Billed monthly · cancel any time"
                    : `Billed yearly · ${pounds(
                        Math.round((plan.yearly / 12) * 100) / 100
                      )} a month`}
                </p>
                <p className="mt-4">{plan.audience}</p>
                <ul className="mt-6 list-disc pl-4">
                  {plan.includes.map((item, index) => (
                    <li key={item} className={index > 0 ? "mt-2" : undefined}>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <Button
                    variant={plan.id === "regular" ? "secondary" : "outline"}
                    onClick={() => choosePlan(plan.id)}
                    className={cn(
                      buttonClasses,
                      "w-full text-center whitespace-normal"
                    )}
                  >
                    Choose {plan.name}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="join" className="mt-24">
          <div className={grid}>
            <div className="md:col-span-5">
              <h2 className="text-h2 md:text-h1">Join</h2>
              <p className="mt-4 max-w-xl">
                Your membership starts today, {startDate}. You can cancel it at
                any time from your account page.
              </p>
              <p className="mt-4 max-w-xl text-body text-muted-foreground">
                This is a demo. No card details are asked for and nothing is
                charged.
              </p>
            </div>

            <div className="mt-12 md:col-span-6 md:col-start-7 md:mt-0">
              {!sent && (
                <form noValidate onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="full-name" className={fieldLabel}>
                      Full name
                    </label>
                    <Input
                      ref={nameRef}
                      id="full-name"
                      name="name"
                      autoComplete="name"
                      required
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
                        errors.name ? "full-name-error" : undefined
                      }
                      className={fieldClasses}
                    />
                    {errors.name && (
                      <p id="full-name-error" className={errorLine}>
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
                    <label htmlFor="email" className={fieldLabel}>
                      Email address
                    </label>
                    <Input
                      ref={emailRef}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
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
                        errors.email ? "email-hint email-error" : "email-hint"
                      }
                      className={fieldClasses}
                    />
                    <p
                      id="email-hint"
                      className="mt-2 text-body text-muted-foreground"
                    >
                      We send your membership card here.
                    </p>
                    {errors.email && (
                      <p id="email-error" className={errorLine}>
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
                    <label htmlFor="plan" className={fieldLabel}>
                      Plan
                    </label>
                    <Select
                      items={planItems}
                      value={planId}
                      onValueChange={(value) => {
                        if (value !== null) {
                          setPlanId(value)
                        }
                      }}
                    >
                      <SelectTrigger id="plan" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {planItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <p aria-live="polite" className="mt-6 text-body">
                    {chosenPlan.name}, billed {period}:{" "}
                    {priceWithUnit(chosenPlan, period)}, starting {startDate}.
                  </p>

                  <Button
                    type="submit"
                    className={cn(buttonClasses, "mt-6")}
                  >
                    Join the Vesper
                  </Button>
                </form>
              )}

              <div role="status">
                {sent && (
                  <>
                    <h3
                      ref={confirmationRef}
                      tabIndex={-1}
                      className="text-h2 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
                    >
                      Welcome to the Vesper, {sent.firstName}
                    </h3>
                    <p className="mt-4 max-w-xl">
                      Your {sent.plan.name} membership, billed {sent.period} at{" "}
                      {priceWithUnit(sent.plan, sent.period)}, starts on{" "}
                      {startDate}. Your card will reach you by email. This was
                      a demo: no payment was taken.
                    </p>
                  </>
                )}
              </div>
              {sent && (
                <p className="mt-6">
                  <a href="/" className={textLink}>
                    See what's on
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-24 border-t border-border py-12">
        <div className={container}>
          <div className={grid}>
            <div className="md:col-span-6">
              <p className="font-heading text-h2">The Vesper</p>
              <p className="mt-2 text-body text-muted-foreground">
                21 Tallow Row, Oldmere OM2 4LT
              </p>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body md:col-span-6 md:mt-0">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={textLink}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className={cn(label, "mt-12 text-muted-foreground")}>
            © 2026 The Vesper
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
