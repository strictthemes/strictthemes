import { useState } from "react"
import { Check, CircleCheck, Minus } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Period = "monthly" | "yearly"

const container = "mx-auto max-w-[1168px] px-4 md:px-6"
const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const buttonClasses = "h-11 px-6 font-mono text-label"
const goodNewsBadge =
  "h-auto gap-1 rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"

const navLinks = [
  { label: "Today", href: "/today" },
  { label: "Progress", href: "/progress" },
  { label: "Plans", href: "/plans" },
  { label: "Profile", href: "/profile" },
]

type Feature = { text: string; limit?: boolean }

type Plan = {
  id: string
  name: string
  recommended?: boolean
  current?: boolean
  price: Record<Period, string>
  note: Record<Period, string>
  forWhom: string
  features: Feature[]
  cta?: { label: string; variant: "default" | "secondary" }
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    current: true,
    price: { monthly: "$0", yearly: "$0" },
    note: {
      monthly: "Free for as long as you like",
      yearly: "Free for as long as you like",
    },
    forWhom: "For getting started with a few habits.",
    features: [
      { text: "Daily reminders" },
      { text: "Your streak, by week and month" },
      { text: "Up to 5 habits", limit: true },
      { text: "30 days of history", limit: true },
    ],
  },
  {
    id: "plus",
    name: "Plus",
    recommended: true,
    price: { monthly: "$4", yearly: "$3" },
    note: { monthly: "Billed monthly", yearly: "Billed $36 once a year" },
    forWhom:
      "For when five habits are not enough, or you want all your history.",
    features: [
      { text: "Unlimited habits" },
      { text: "All your history" },
      { text: "The year view" },
      { text: "A note on each day" },
      { text: "Everything in Free" },
    ],
    cta: { label: "Try Plus free", variant: "default" },
  },
  {
    id: "together",
    name: "Together",
    price: { monthly: "$8", yearly: "$6" },
    note: { monthly: "Billed monthly", yearly: "Billed $72 once a year" },
    forWhom: "For a household that keeps habits together.",
    features: [
      { text: "Plus for up to 4 people" },
      { text: "Shared habits you tick off together" },
      { text: "Everything in Plus" },
    ],
    cta: { label: "Choose Together", variant: "secondary" },
  },
]

const questions = [
  {
    q: "Can I try Plus before paying?",
    a: "Yes. You get 14 days of Plus for free, and you do not need a card to start.",
  },
  {
    q: "What happens to my habits if I go back to Free?",
    a: "You keep all of them. You choose which five stay active, and the rest wait until you need them.",
  },
  {
    q: "Can I pay once a year?",
    a: "Yes. Plus is $36 for the year, and Together is $72. Pick Yearly above to see it.",
  },
  {
    q: "How does Together work?",
    a: "One person pays. They send a link, and up to 4 people join with it.",
  },
  {
    q: "Can I cancel any time?",
    a: "Yes, in Profile. You keep Plus until the end of the period you paid for.",
  },
]

export function App() {
  const [period, setPeriod] = useState<Period>("monthly")

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div
          className={cn(
            container,
            "flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
          )}
        >
          <a
            href="/today"
            className={cn(
              "inline-flex h-11 items-center font-heading text-h2 text-foreground transition-colors duration-150",
              focusOutline
            )}
          >
            Mossy
          </a>
          <nav aria-label="Main" className="w-full md:w-auto">
            <ul className="flex gap-1">
              {navLinks.map((link) => {
                const current = link.href === "/plans"
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "inline-flex h-11 items-center rounded-lg px-3 font-mono text-label transition-colors duration-150",
                        current
                          ? "bg-secondary text-secondary-foreground"
                          : "text-foreground underline-offset-4 hover:underline",
                        focusOutline
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </header>

      <main className={cn(container, "flex flex-col gap-16 pt-10 pb-16")}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className={smallFigure}>You are on Free</p>
            <h1 className="text-h1 md:text-display">Pick what fits you</h1>
          </div>
          <p className="max-w-lg text-body">
            Free covers most people. Plus is for when five habits are not
            enough.
          </p>
        </div>

        <section aria-labelledby="plans-heading" className="flex flex-col gap-6">
          <h2 id="plans-heading" className="sr-only">
            Plans
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="Billing"
              className="flex flex-wrap gap-2"
            >
              <Button
                variant={period === "monthly" ? "secondary" : "outline"}
                aria-pressed={period === "monthly"}
                className={buttonClasses}
                onClick={() => setPeriod("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={period === "yearly" ? "secondary" : "outline"}
                aria-pressed={period === "yearly"}
                className={buttonClasses}
                onClick={() => setPeriod("yearly")}
              >
                Yearly
              </Button>
            </div>
            <div className="flex h-11 items-center">
              {period === "yearly" ? (
                <Badge className={goodNewsBadge}>Yearly saves 3 months</Badge>
              ) : (
                <p className={smallFigure}>Yearly saves 3 months</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 md:col-span-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-h2">
                    {plan.name}
                  </h3>
                  {plan.recommended && (
                    <Badge
                      variant="secondary"
                      className="h-auto gap-1 rounded-sm px-2 py-1 font-mono text-label"
                    >
                      Recommended
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <p className="font-heading text-display tabular-nums text-foreground">
                      {plan.price[period]}
                    </p>
                    <p className={smallFigure}>a month</p>
                  </div>
                  <p className={smallFigure}>{plan.note[period]}</p>
                </div>

                <p className="max-w-lg text-body">{plan.forWhom}</p>

                <ul className="flex flex-col gap-2 border-t border-border pt-4">
                  {plan.features.map((feature) => {
                    const Icon = feature.limit ? Minus : Check
                    return (
                      <li
                        key={feature.text}
                        className="flex items-start gap-2 text-body"
                      >
                        <Icon
                          aria-hidden="true"
                          strokeWidth={1.5}
                          className="mt-1 size-4 shrink-0 text-foreground"
                        />
                        {feature.text}
                      </li>
                    )
                  })}
                </ul>

                {plan.cta ? (
                  <a
                    href="#"
                    className={cn(
                      buttonVariants({ variant: plan.cta.variant }),
                      buttonClasses,
                      "mt-auto w-full"
                    )}
                  >
                    {plan.cta.label}
                  </a>
                ) : (
                  <p className="mt-auto flex h-11 items-center gap-2 font-mono text-label text-muted-foreground">
                    <CircleCheck
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-4 shrink-0"
                    />
                    You are on this plan
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="questions-heading"
          className="flex flex-col gap-6 md:max-w-3xl"
        >
          <h2 id="questions-heading" className="text-h2">
            Questions people ask
          </h2>
          <Accordion>
            {questions.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>
                  <p className="max-w-lg">{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section
          aria-labelledby="last-word-heading"
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 md:max-w-lg"
        >
          <h2 id="last-word-heading" className="text-h2">
            Not sure yet?
          </h2>
          <p className="max-w-lg text-body">
            Stay on Free. Nothing you add there is lost if you move to Plus
            later.
          </p>
        </section>
      </main>

      <footer className="border-t border-border">
        <div
          className={cn(
            container,
            "flex flex-wrap items-center justify-between gap-3 py-10"
          )}
        >
          <p className="font-heading text-h2">Mossy</p>
          <p className="font-mono text-label text-muted-foreground">
            Mossy · Made for small, daily steps · 2026
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
